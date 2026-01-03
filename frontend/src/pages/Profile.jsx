import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, LogOut, Trash2, Shield, Mail } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [passData, setPassData] = useState({ newPassword: '', confirm: '' });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/user/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(res.data);
            } catch (err) {
                console.error(err);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate]);

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setMessage('');
        if (passData.newPassword !== passData.confirm) {
            setMessage('Passwords do not match');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5000/api/user/password',
                { newPassword: passData.newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage('Password updated successfully!');
            setPassData({ newPassword: '', confirm: '' });
        } catch (err) {
            setMessage('Failed to update password');
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you sure? This cannot be undone.")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete('http://localhost:5000/api/user/account', {
                headers: { Authorization: `Bearer ${token}` }
            });
            handleLogout();
        } catch (err) {
            setMessage('Failed to delete account');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading Profile...</div>;

    return (
        <div className="profile-page">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="profile-container"
            >
                {/* Header Section */}
                <div className="profile-header glass">
                    <div className="profile-avatar-large">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="profile-info">
                        <h1>{user?.name}</h1>
                        <p className="email-badge"><Mail size={14} /> {user?.email}</p>
                        <p className="join-date">Member since {new Date(user?.created_at).toLocaleDateString()}</p>
                    </div>
                    <button onClick={handleLogout} className="logout-btn-large">
                        <LogOut size={18} /> Logout
                    </button>
                </div>

                <div className="profile-grid">
                    {/* Security Settings */}
                    <div className="settings-card glass">
                        <div className="card-header">
                            <Shield size={24} className="icon-accent" />
                            <h2>Security Settings</h2>
                        </div>

                        <form onSubmit={handleUpdatePassword} className="password-form">
                            <h3>Update Password</h3>
                            {message && <p className="status-msg">{message}</p>}
                            <div className="input-with-icon">
                                <Lock size={18} />
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    value={passData.newPassword}
                                    onChange={e => setPassData({ ...passData, newPassword: e.target.value })}
                                />
                            </div>
                            <div className="input-with-icon">
                                <Lock size={18} />
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={passData.confirm}
                                    onChange={e => setPassData({ ...passData, confirm: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="update-btn">Update Password</button>
                        </form>
                    </div>

                    {/* Danger Zone */}
                    <div className="settings-card glass danger-zone">
                        <div className="card-header">
                            <Trash2 size={24} className="icon-danger" />
                            <h2 className="text-danger">Danger Zone</h2>
                        </div>
                        <p>Once you delete your account, there is no going back. Please be certain.</p>
                        <button onClick={handleDeleteAccount} className="delete-btn">
                            Delete Account
                        </button>
                    </div>
                </div>
            </motion.div>

            <style>{`
                .profile-page {
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: 2rem;
                }
                .profile-header {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                    padding: 3rem;
                    border-radius: 1.5rem;
                    margin-bottom: 2rem;
                    background: white;
                }
                .profile-avatar-large {
                    width: 100px;
                    height: 100px;
                    background: var(--gradient-main);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 3rem;
                    font-weight: 700;
                    color: white;
                    box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
                }
                .profile-info h1 { font-size: 2rem; margin-bottom: 0.5rem; }
                .email-badge { 
                    display: inline-flex; align-items: center; gap: 0.5rem;
                    background: #f1f5f9; padding: 0.25rem 0.75rem; 
                    border-radius: 99px; color: #64748b; font-size: 0.9rem;
                }
                .join-date { margin-top: 0.5rem; color: #94a3b8; font-size: 0.85rem; }
                
                .logout-btn-large {
                    margin-left: auto;
                    display: flex; align-items: center; gap: 0.5rem;
                    padding: 0.75rem 1.5rem;
                    background: #fee2e2; color: #ef4444; border: none;
                    border-radius: 0.75rem; font-weight: 600;
                    transition: all 0.2s;
                }
                .logout-btn-large:hover { background: #fca5a5; color: white; }

                .profile-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                    gap: 1.5rem;
                }

                .settings-card {
                    padding: 2rem;
                    border-radius: 1rem;
                    background: white;
                }
                .card-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
                .icon-accent { color: var(--primary); }
                .icon-danger { color: #ef4444; }
                .text-danger { color: #ef4444; }

                .input-with-icon {
                    position: relative;
                    margin-bottom: 1rem;
                }
                .input-with-icon input {
                    width: 100%;
                    padding: 0.75rem 0.75rem 0.75rem 2.5rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 0.5rem;
                }
                .input-with-icon svg {
                    position: absolute; left: 0.75rem; top: 50%;
                    transform: translateY(-50%); color: #94a3b8;
                }
                .update-btn {
                    width: 100%; padding: 0.75rem;
                    background: var(--text-main); color: white;
                    border: none; border-radius: 0.5rem; font-weight: 600;
                }
                
                .danger-zone { border: 1px solid #fee2e2; }
                .delete-btn {
                    margin-top: 1rem;
                    padding: 0.75rem 1.5rem;
                    background: #ef4444; color: white; border: none;
                    border-radius: 0.5rem; font-weight: 600;
                }
            `}</style>
        </div>
    );
};

export default Profile;
