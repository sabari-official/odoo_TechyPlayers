import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, ArrowRight } from 'lucide-react';

const CitySearch = () => {
    const [searchTerm, setSearchTerm] = useState('');

    // Mock Agentic Results
    const cities = [
        { id: 1, name: 'Kyoto, Japan', rating: 4.8, type: 'Historic', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=400' },
        { id: 2, name: 'Santorini, Greece', rating: 4.9, type: 'Romantic', img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=400' },
        { id: 3, name: 'New York, USA', rating: 4.7, type: 'Urban', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=400' },
        { id: 4, name: 'Cape Town, SA', rating: 4.6, type: 'Adventure', img: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&q=80&w=400' },
    ];

    return (
        <div className="container">
            <div style={{ padding: '3rem 0', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Explore the World</h1>
                <p className="text-secondary">Discover destinations curated by AI for your taste.</p>

                <div className="search-bar-hero glass-panel">
                    <Search size={24} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search for cities, regions, or vibes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn btn-primary">Search</button>
                </div>
            </div>

            <div className="cities-grid">
                {cities.map((city, idx) => (
                    <motion.div
                        key={city.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="city-card glass-panel"
                    >
                        <div className="city-img" style={{ backgroundImage: `url(${city.img})` }}>
                            <span className="city-badge">{city.type}</span>
                        </div>
                        <div className="city-content">
                            <div className="flex-between">
                                <h3>{city.name}</h3>
                                <span className="rating"><Star size={14} fill="gold" stroke="none" /> {city.rating}</span>
                            </div>
                            <button className="btn btn-ghost" style={{ width: '100%', marginTop: '1rem', justifyContent: 'space-between' }}>
                                Explore <ArrowRight size={16} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <style>{`
                .search-bar-hero {
                    max-width: 600px;
                    margin: 2rem auto;
                    display: flex;
                    align-items: center;
                    padding: 0.5rem;
                    border-radius: 99px;
                    background: white;
                }
                .search-bar-hero input {
                    flex: 1;
                    border: none;
                    font-size: 1.1rem;
                    padding: 0.5rem 1rem;
                    outline: none;
                }
                .search-icon { color: var(--text-light); margin-left: 1rem; }
                
                .cities-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 2rem;
                    padding-bottom: 3rem;
                }
                .city-card {
                    overflow: hidden;
                    transition: transform 0.2s;
                }
                .city-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-xl); }
                
                .city-img {
                    height: 200px;
                    background-size: cover;
                    background-position: center;
                    position: relative;
                }
                .city-badge {
                    position: absolute;
                    top: 1rem; right: 1rem;
                    background: rgba(0,0,0,0.6);
                    color: white;
                    padding: 0.25rem 0.75rem;
                    border-radius: 99px;
                    font-size: 0.8rem;
                    backdrop-filter: blur(4px);
                }
                .city-content { padding: 1.5rem; }
                .rating { display: flex; align-items: center; gap: 0.25rem; font-weight: 600; color: var(--text-main); }
            `}</style>
        </div>
    );
};

export default CitySearch;
