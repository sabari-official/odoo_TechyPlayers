import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Calendar, MapPin, Clock, ArrowLeft, Printer, Share2 } from 'lucide-react';

const ItineraryView = () => {
    const { tripId } = useParams();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:5000/api/trips/${tripId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Parse the plan text into days
                // Assuming format "Day 1: ... \n Day 2: ..."
                const planText = res.data.plan_details || "";
                const days = planText.split(/Day \d+:/g).filter(Boolean).map((dayContent, index) => ({
                    day: index + 1,
                    content: dayContent.trim()
                }));

                setTrip({ ...res.data, parsedDays: days });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (tripId) fetchTrip();
    }, [tripId]);

    if (loading) return <div className="container" style={{ paddingTop: '4rem' }}>Loading itinerary...</div>;
    if (!trip) return <div className="container">Trip not found.</div>;

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="view-header flex-between"
                style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}
            >
                <div>
                    <Link to="/my-trips" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                        <ArrowLeft size={16} /> Back
                    </Link>
                    <h1>{trip.city} Itinerary</h1>
                    <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        <span className="flex-center" style={{ gap: '0.5rem' }}><Calendar size={16} /> {trip.startDate} - {trip.endDate}</span>
                    </div>
                </div>
                <div className="action-buttons flex-center" style={{ gap: '1rem' }}>
                    <button className="btn btn-secondary" onClick={() => window.print()}><Printer size={18} /> Print</button>
                    <button className="btn btn-primary"><Share2 size={18} /> Share</button>
                </div>
            </motion.div>

            <div className="itinerary-list">
                {trip.parsedDays.map((day, idx) => (
                    <motion.div
                        key={day.day}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="day-container glass-panel"
                        style={{ padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '2rem' }}
                    >
                        <div className="day-sticker" style={{ minWidth: '80px', borderRight: '1px solid var(--border)' }}>
                            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)', display: 'block' }}>Day {day.day}</span>
                        </div>

                        <div className="activities-column" style={{ flex: 1, whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
                            {/* Simple text rendering for now since AI returns unstructured text blobs mostly */}
                            {day.content}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ItineraryView;
