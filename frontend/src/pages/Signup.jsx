import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import axios from 'axios';
import '../styles/Auth.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        }
    };

    return (
        <div className="auth-page">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="auth-container-split"
            >
                {/* Left Side: Image */}
                <div
                    className="auth-side auth-image-side"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')" }}
                >
                    <div style={{ position: 'relative', zIndex: 1, color: 'white', marginTop: 'auto' }}>
                        <h2 style={{ fontSize: '2rem' }}>Join the Journey.</h2>
                        <p>Start planning your dream trip today.</p>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="auth-side auth-form-side">
                    <div className="auth-header">
                        <h1>Create Account</h1>
                        <p>Start your journey today.</p>
                    </div>

                    {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="input-group">
                            <User className="input-icon" size={20} />
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <Mail className="input-icon" size={20} />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <Lock className="input-icon" size={20} />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <Lock className="input-icon" size={20} />
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" className="primary-btn">
                            Sign Up <ArrowRight size={20} />
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>Already have an account? <Link to="/login">Login</Link></p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
