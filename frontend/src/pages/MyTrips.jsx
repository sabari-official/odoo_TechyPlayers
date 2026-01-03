import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight, Trash2, Plus } from 'lucide-react';
import axios from 'axios';

const MyTrips = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/trips', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTrips(res.data);
            } catch (err) {
                console.error("Error fetching trips", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTrips();
    }, []);

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ padding: '2rem 0' }}
            >
                <div className="flex-between" style={{ marginBottom: '2rem' }}>
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        My Adventures <span style={{ fontSize: '0.6em', opacity: 0.5 }}>({trips.length})</span>
                    </h1>
                    <Link to="/create-trip" className="btn btn-primary">
                        <Plus size={18} /> New Trip
                    </Link>
                </div>

                {loading ? (
                    <div className="flex-center" style={{ minHeight: '300px' }}>
                        <div className="loading-spinner"></div>
                    </div>
                ) : trips.length === 0 ? (
                    <div className="glass-panel flex-center" style={{ padding: '4rem', flexDirection: 'column', textAlign: 'center', minHeight: '400px' }}>
                        <div style={{ background: 'var(--surface-alt)', borderRadius: '50%', padding: '1.5rem', marginBottom: '1.5rem' }}>
                            <MapPin size={32} style={{ color: 'var(--primary)' }} />
                        </div>
                        <h3>No trips planned yet</h3>
                        <p style={{ margin: '1rem 0 2rem', color: 'var(--text-secondary)', maxWidth: '400px' }}>
                            Your travel journal is empty. Start planning your first adventure with our AI assistant.
                        </p>
                        <Link to="/create-trip" className="btn btn-primary">Start Planning</Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                        {trips.map((trip, idx) => (
                            <motion.div
                                key={trip.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="glass-panel"
                                style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', border: '1px solid var(--border)' }}
                                whileHover={{ y: -5 }}
                            >
                                <div style={{
                                    height: '160px',
                                    background: `linear-gradient(135deg, ${getRandomColor(idx)}, ${getRandomColor(idx + 1)})`,
                                    position: 'relative',
                                    padding: '1.5rem'
                                }}>
                                    <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem' }}>
                                        <h2 style={{ color: 'white', fontSize: '1.5rem', textShadow: '0 2px 10px rgba(0,0,0,0.3)', margin: 0 }}>
                                            {trip.destination || trip.location || "Untitled Trip"}
                                        </h2>
                                    </div>
                                </div>

                                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <Calendar size={14} /> {formatDate(trip.dates || trip.startDate)}
                                        </span>
                                    </div>

                                    <p style={{
                                        fontSize: '0.95rem',
                                        color: 'var(--text-secondary)',
                                        marginBottom: '1.5rem',
                                        flex: 1,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        lineHeight: '1.6'
                                    }}>
                                        {trip.description || trip.notes || "No details provided for this trip."}
                                    </p>

                                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
                                        <Link to={`/trip/${trip.id}`} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                                            View
                                        </Link>
                                        <Link to={`/planner/${trip.id}`} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                                            Edit
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

// Helper for random nice gradients
const getRandomColor = (index) => {
    const colors = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#0ea5e9', '#10b981'];
    return colors[index % colors.length];
};

const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    try {
        return new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
        return dateString;
    }
};

export default MyTrips;
