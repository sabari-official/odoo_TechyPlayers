import React from 'react';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';

const ActivitySearch = () => {
    return (
        <div className="container">
            <div className="flex-between" style={{ padding: '2rem 0' }}>
                <h1>Find Activities 🏄‍♂️</h1>
                <button className="btn btn-secondary"><Filter size={18} /> Filters</button>
            </div>

            {/* Simple Grid Placeholder for demonstration of style consistency */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <motion.div
                        key={i}
                        className="glass-panel"
                        whileHover={{ scale: 1.02 }}
                        style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)' }}
                    >
                        Activity {i} Preview
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
export default ActivitySearch;
