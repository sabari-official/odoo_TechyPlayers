import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Wallet, TrendingUp, AlertCircle, DollarSign } from 'lucide-react';

const Budget = () => {
    const [budget] = useState({
        total: 3500,
        spent: 1250,
        currency: '$',
        breakdown: [
            { category: 'Flights', amount: 800, color: '#6366f1' },
            { category: 'Accommodation', amount: 1200, color: '#ec4899' },
            { category: 'Food', amount: 600, color: '#f59e0b' },
            { category: 'Activities', amount: 500, color: '#10b981' },
            { category: 'Transport', amount: 400, color: '#8b5cf6' },
        ]
    });

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel"
                style={{ padding: '2rem' }}
            >
                <div className="flex-between" style={{ marginBottom: '2rem' }}>
                    <div>
                        <h1>Trip Budget</h1>
                        <p className="text-secondary">Track your expenses and forecast costs.</p>
                    </div>
                    <button className="btn btn-primary">
                        <TrendingUp size={18} /> AI Forecast
                    </button>
                </div>

                <div className="budget-grid">
                    {/* Summary Cards */}
                    <div className="budget-card">
                        <div className="icon-box info"><Wallet size={24} /></div>
                        <div>
                            <h3>Total Budget</h3>
                            <p className="amount">{budget.currency}{budget.total}</p>
                        </div>
                    </div>

                    <div className="budget-card">
                        <div className="icon-box warning"><DollarSign size={24} /></div>
                        <div>
                            <h3>Spent So Far</h3>
                            <p className="amount">{budget.currency}{budget.spent}</p>
                        </div>
                    </div>

                    <div className="budget-card">
                        <div className="icon-box success"><TrendingUp size={24} /></div>
                        <div>
                            <h3>Remaining</h3>
                            <p className="amount">{budget.currency}{budget.total - budget.spent}</p>
                        </div>
                    </div>
                </div>

                {/* Visual Breakdown */}
                <h3 style={{ marginTop: '3rem', marginBottom: '1.5rem' }}>Expense Breakdown</h3>
                <div className="breakdown-list">
                    {budget.breakdown.map((item, index) => (
                        <div key={index} className="breakdown-item">
                            <div className="item-header">
                                <span className="dot" style={{ background: item.color }}></span>
                                <span>{item.category}</span>
                            </div>
                            <div className="progress-bar-bg">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(item.amount / budget.total) * 100}%` }}
                                    transition={{ duration: 1, delay: index * 0.1 }}
                                    className="progress-bar-fill"
                                    style={{ background: item.color }}
                                />
                            </div>
                            <span className="item-amount">{budget.currency}{item.amount}</span>
                        </div>
                    ))}
                </div>

                <div className="ai-insight glass-panel">
                    <AlertCircle size={20} className="icon-accent" />
                    <p><strong>AI Insight:</strong> Based on current flight trends to Paris, you might save 15% if you book your activities 2 weeks in advance.</p>
                </div>

            </motion.div>

            <style>{`
        .budget-grid {
           display: grid;
           grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
           gap: 1.5rem;
        }
        .budget-card {
           background: rgba(255,255,255,0.6);
           padding: 1.5rem;
           border-radius: var(--radius-lg);
           border: 1px solid var(--border);
           display: flex;
           align-items: center;
           gap: 1rem;
        }
        .icon-box {
           width: 50px; height: 50px;
           border-radius: 12px;
           display: flex; align-items: center; justify-content: center;
           color: white;
        }
        .icon-box.info { background: var(--primary); }
        .icon-box.warning { background: var(--secondary); }
        .icon-box.success { background: #10b981; }
        
        .amount { font-size: 1.5rem; font-weight: 700; color: var(--text-main); }
        
        .breakdown-list { display: flex; flex-direction: column; gap: 1rem; }
        .breakdown-item { display: grid; grid-template-columns: 150px 1fr 80px; align-items: center; gap: 1rem; }
        .item-header { display: flex; align-items: center; gap: 0.5rem; font-weight: 500; }
        .dot { width: 10px; height: 10px; border-radius: 50%; }
        
        .progress-bar-bg { height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden; }
        .progress-bar-fill { height: 100%; border-radius: 4px; }
        
        .ai-insight {
           margin-top: 2rem;
           background: linear-gradient(to right, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
           padding: 1rem;
           display: flex; gap: 1rem; align-items: center;
           border: 1px solid rgba(99, 102, 241, 0.2);
           color: var(--primary-dark);
        }
      `}</style>
        </div>
    );
};

export default Budget;
