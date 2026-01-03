import { useNavigate } from 'react-router-dom';
import { Home, PlusCircle, Map, Search, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Navbar.css';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isActive = (path) => location.pathname === path;
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    const handleProfileClick = () => {
        navigate('/profile');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="logo">
                    <span className="logo-icon">✈️</span>
                    <span className="logo-text">WanderLust</span>
                </Link>

                <div className="nav-links">
                    <NavLink to="/" icon={<Home size={18} />} label="Home" active={isActive('/')} />
                    <NavLink to="/my-trips" icon={<Map size={18} />} label="My Trips" active={isActive('/my-trips')} />
                    <NavLink to="/create-trip" icon={<PlusCircle size={18} />} label="Plan" active={isActive('/create-trip')} />
                    <NavLink to="/search/cities" icon={<Search size={18} />} label="Explore" active={isActive('/search/cities')} />
                </div>

                <div className="nav-actions">
                    {user ? (
                        <button className="user-profile-btn" onClick={handleProfileClick}>
                            <div className="avatar-circle">
                                {user.name ? user.name.charAt(0).toUpperCase() : <User size={20} />}
                            </div>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>
                                {user.name && user.name.split(' ')[0]}
                            </span>
                        </button>
                    ) : (
                        <Link to="/login" className="login-btn-nav">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

const NavLink = ({ to, icon, label, active }) => (
    <Link to={to} className={`nav-link ${active ? 'active' : ''}`}>
        <span className="nav-icon">{icon}</span>
        <span className="nav-label">{label}</span>
    </Link>
);

export default Navbar;
