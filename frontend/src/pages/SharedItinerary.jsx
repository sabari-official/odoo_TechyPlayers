import React from 'react';
import { Share2 } from 'lucide-react';

const SharedItinerary = () => {
    return (
        <div className="container flex-center" style={{ minHeight: '80vh' }}>
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', maxWidth: '600px' }}>
                <div style={{ width: '80px', height: '80px', background: '#e0f2fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#0ea5e9' }}>
                    <Share2 size={40} />
                </div>
                <h1>Public Itinerary View</h1>
                <p className="text-secondary">
                    This is what your friends will see when you share a trip link.
                    It will be a read-only version of the Itinerary View.
                </p>
            </div>
        </div>
    );
};
export default SharedItinerary;
