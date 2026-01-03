from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
import os
from functools import wraps

app = Flask(__name__)
CORS(app)

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:Localhost_123@localhost/travel_app_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your_super_secret_key_here'

db = SQLAlchemy(app)

# --- Models ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Trip(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    description = db.Column(db.Text)
    destination = db.Column(db.String(100))
    plan_details = db.Column(db.Text) # AI Plan Storage

# --- Decorators ---
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            try:
                token = request.headers['Authorization'].split(" ")[1]
            except IndexError:
                return jsonify({'message': 'Token format is invalid!'}), 401
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = db.session.get(User, data['user_id']) # Updated for SQLAlchemy 2.0
        except Exception as e:
            return jsonify({'message': 'Token is invalid!', 'error': str(e)}), 401
            
        return f(current_user, *args, **kwargs)
    return decorated

# Initialize DB
@app.before_request
def create_tables():
    try:
        db.create_all()
    except Exception as e:
        print(f"DB Error: {e}")

# --- Routes ---

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing required fields'}), 400
        
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'User already exists'}), 409
        
    new_user = User(full_name=data.get('name', ''), email=data['email'])
    new_user.set_password(data['password'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing data'}), 400
        
    user = User.query.filter_by(email=data['email']).first()
    if not user or not user.check_password(data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401
        
    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, app.config['SECRET_KEY'], algorithm="HS256")
    
    return jsonify({'token': token, 'user': {'id': user.id, 'name': user.full_name, 'email': user.email}}), 200

# User Profile Routes
@app.route('/api/user/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    return jsonify({
        'id': current_user.id,
        'name': current_user.full_name,
        'email': current_user.email,
        'created_at': current_user.created_at
    })

@app.route('/api/user/password', methods=['PUT'])
@token_required
def update_password(current_user):
    data = request.get_json()
    if not data.get('new_password'): return jsonify({'message': 'New password required'}), 400
    current_user.set_password(data['new_password'])
    db.session.commit()
    return jsonify({'message': 'Password updated successfully'})

@app.route('/api/user/account', methods=['DELETE'])
@token_required
def delete_account(current_user):
    db.session.delete(current_user)
    db.session.commit()
    return jsonify({'message': 'Account deleted successfully'})

# Trip Routes
@app.route('/api/trips', methods=['POST'])
@token_required
def create_trip(current_user):
    data = request.get_json()
    try:
        s_date = datetime.datetime.strptime(data.get('startDate'), '%Y-%m-%d').date()
        e_date = datetime.datetime.strptime(data.get('endDate'), '%Y-%m-%d').date()
    except:
        s_date = datetime.date.today()
        e_date = datetime.date.today()

    new_trip = Trip(
        user_id=current_user.id,
        name=data.get('city', 'New Trip') + " Adventure",
        start_date=s_date,
        end_date=e_date,
        description=data.get('notes'),
        destination=data.get('city'),
        plan_details=data.get('final_plan')
    )
    db.session.add(new_trip)
    db.session.commit()
    return jsonify({'message': 'Trip created!', 'trip_id': new_trip.id}), 201

@app.route('/api/trips', methods=['GET'])
@token_required
def get_trips(current_user):
    trips = Trip.query.filter_by(user_id=current_user.id).all()
    output = []
    for trip in trips:
        output.append({
            'id': trip.id,
            'name': trip.name,
            'dates': f"{trip.start_date} - {trip.end_date}",
            'location': trip.destination,
            'description': trip.description
        })
    return jsonify(output)

@app.route('/api/trips/<int:trip_id>', methods=['GET'])
@token_required
def get_single_trip(current_user, trip_id):
    trip = Trip.query.filter_by(id=trip_id, user_id=current_user.id).first()
    if not trip: return jsonify({'message': 'Trip not found'}), 404
    
    return jsonify({
        'id': trip.id,
        'name': trip.name,
        'city': trip.destination,
        'startDate': trip.start_date.strftime('%Y-%m-%d'),
        'endDate': trip.end_date.strftime('%Y-%m-%d'),
        'description': trip.description,
        'plan_details': trip.plan_details
    })

if __name__ == '__main__':
    print("Starting Server linked to MySQL travel_app_db...")
    app.run(debug=True, port=5000)
