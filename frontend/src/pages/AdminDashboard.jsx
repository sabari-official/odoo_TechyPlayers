import React from 'react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container"
            style={{ padding: '2rem 1rem' }}
        >
            <div className="section-header">
                <h1>Admin Dashboard</h1>
            </div>
            <div className="card-content" style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: '2rem' }}>
                <p style={{ color: 'var(--text-secondary)' }}>Welcome to the admin area. This section is under construction.</p>
            </div>
        </motion.div>
    );
};

export default AdminDashboard;
