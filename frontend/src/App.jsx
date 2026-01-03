import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './styles/Components.css';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import CreateTrip from './pages/CreateTrip';
import MyTrips from './pages/MyTrips';
import ItineraryBuilder from './pages/ItineraryBuilder';
import ItineraryView from './pages/ItineraryView';
import CitySearch from './pages/CitySearch';
import ActivitySearch from './pages/ActivitySearch';
import Budget from './pages/Budget';
import Timeline from './pages/Timeline';
import SharedItinerary from './pages/SharedItinerary';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import { AnimatePresence } from 'framer-motion';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Basic check - in production you might want to validate the token with the backend
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
        setIsLoading(false);
    }, []);

    if (isLoading) return <div className="flex-center" style={{ minHeight: '100vh', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Loading...</div>;

    return (
        <Router>
            <div className="app-container">
                {isAuthenticated && <Navbar />}
                <main className="main-content">
                    <AnimatePresence mode="wait">
                        <Routes>
                            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
                            <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/" />} />

                            {/* Protected Routes */}
                            <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
                            <Route path="/create-trip" element={isAuthenticated ? <CreateTrip /> : <Navigate to="/login" />} />
                            <Route path="/my-trips" element={isAuthenticated ? <MyTrips /> : <Navigate to="/login" />} />
                            <Route path="/planner/:tripId" element={isAuthenticated ? <ItineraryBuilder /> : <Navigate to="/login" />} />
                            <Route path="/trip/:tripId" element={isAuthenticated ? <ItineraryView /> : <Navigate to="/login" />} />
                            <Route path="/search/cities" element={isAuthenticated ? <CitySearch /> : <Navigate to="/login" />} />
                            <Route path="/search/activities" element={isAuthenticated ? <ActivitySearch /> : <Navigate to="/login" />} />
                            <Route path="/trip/:tripId/budget" element={isAuthenticated ? <Budget /> : <Navigate to="/login" />} />
                            <Route path="/trip/:tripId/timeline" element={isAuthenticated ? <Timeline /> : <Navigate to="/login" />} />
                            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
                            <Route path="/admin" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />} />

                            {/* Public Route */}
                            <Route path="/share/:shareId" element={<SharedItinerary />} />
                        </Routes>
                    </AnimatePresence>
                </main>
            </div>
        </Router>
    );
}

export default App;
