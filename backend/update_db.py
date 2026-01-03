from server import app, db
from sqlalchemy import text

with app.app_context():
    print("Attempting to update database schema...")
    try:
        with db.engine.connect() as conn:
            # Try adding the plan_details column
            conn.execute(text("ALTER TABLE trip ADD COLUMN plan_details TEXT"))
            conn.commit()
            print("SUCCESS: Added 'plan_details' column to 'trip' table.")
    except Exception as e:
        print(f"INFO: Could not add 'plan_details' (it might already exist). Details: {e}")
        
    print("Schema update check complete.")
