import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import axios from 'axios';
import '../styles/Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                // Force reload or use context update (simplest is reload or navigate)
                window.location.href = '/';
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="auth-page">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="auth-container-split"
            >
                {/* Left Side: Form */}
                <div className="auth-side auth-form-side">
                    <div className="auth-header">
                        <h1>Welcome Back</h1>
                        <p>Plan your next adventure with us.</p>
                    </div>

                    {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="input-group">
                            <Mail className="input-icon" size={20} />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <Lock className="input-icon" size={20} />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div style={{ textAlign: 'right' }}>
                            <Link to="/forgot-password" style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>
                                Forgot Password?
                            </Link>
                        </div>

                        <button type="submit" className="primary-btn">
                            Login <ArrowRight size={20} />
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
                    </div>
                </div>

                {/* Right Side: Image */}
                <div
                    className="auth-side auth-image-side"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')" }}
                >
                    {/* Optional Overlay Text */}
                    <div style={{ position: 'relative', zIndex: 1, color: 'white', marginTop: 'auto' }}>
                        <h2 style={{ fontSize: '2rem' }}>Explore the World.</h2>
                        <p>Discover new places and create unforgettable memories.</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
