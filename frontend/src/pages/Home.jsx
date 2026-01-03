import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, MapPin, Calendar, ArrowRight } from 'lucide-react';
import '../styles/Home.css';

const Home = () => {
    const recentTrips = [
        { id: 1, title: 'Summer in Paris', dates: 'Jun 15 - Jun 22', location: 'Paris, France', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1000' },
        { id: 2, title: 'Tokyo Adventure', dates: 'Oct 05 - Oct 15', location: 'Tokyo, Japan', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=1000' },
    ];

    const recommendations = [
        { id: 101, title: 'Bali Retreat', cost: '$1,200', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1000' },
        { id: 102, title: 'Swiss Alps', cost: '$2,500', img: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&q=80&w=1000' },
        { id: 103, title: 'Santorini Sunset', cost: '$1,800', img: 'https://images.unsplash.com/photo-1613395877344-13d4c2807df5?auto=format&fit=crop&q=80&w=1000' },
    ];

    return (
        <div className="home-container">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="welcome-section"
            >
                <h1>Welcome back, Traveler! 🌍</h1>
                <p>Your next adventure awaits.</p>
                <Link to="/create-trip" className="cta-button">
                    <Plus size={20} /> Plan New Trip
                </Link>
            </motion.div>

            <section className="section">
                <div className="section-header">
                    <h2>Your Recent Trips</h2>
                    <Link to="/my-trips" className="view-all">View All <ArrowRight size={16} /></Link>
                </div>
                <div className="cards-grid">
                    {recentTrips.map((trip) => (
                        <div key={trip.id} className="trip-card glass">
                            <div className="card-image" style={{ backgroundImage: `url(${trip.img})` }}></div>
                            <div className="card-content">
                                <h3>{trip.title}</h3>
                                <div className="card-meta">
                                    <span><MapPin size={14} /> {trip.location}</span>
                                    <span><Calendar size={14} /> {trip.dates}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>


        </div>
    );
};

export default Home;
