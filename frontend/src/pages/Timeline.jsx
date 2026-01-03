import React from 'react';
import { motion } from 'framer-motion';

const Timeline = () => {
    return (
        <div className="container flex-center" style={{ minHeight: '60vh' }}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-panel"
                style={{ padding: '3rem', textAlign: 'center', maxWidth: '500px' }}
            >
                <img
                    src="https://cdn-icons-png.flaticon.com/512/3652/3652191.png"
                    alt="Timeline"
                    style={{ width: '80px', marginBottom: '1.5rem', opacity: 0.8 }}
                />
                <h2>Visual Timeline 🚀</h2>
                <p className="text-secondary" style={{ margin: '1rem 0' }}>
                    We are building a stunning Gantt-chart style timeline for your trips.
                    This advanced feature will be available in the next update!
                </p>
                <button className="btn btn-secondary">Notify Me</button>
            </motion.div>
        </div>
    );
};
export default Timeline;
