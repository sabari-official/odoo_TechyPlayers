import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    MapPin, Calendar, DollarSign, FileText,
    Sparkles, Send, Save, RefreshCw, Wand2
} from 'lucide-react';

const CreateTrip = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [generatedPlan, setGeneratedPlan] = useState("");
    const [modificationInstruction, setModificationInstruction] = useState("");

    const [formData, setFormData] = useState({
        city: '',
        country: '',
        startDate: '',
        endDate: '',
        budgetType: 'Fixed',
        budgetAmount: '',
        notes: ''
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // 1. Generate Plan
    const handleGenerate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:8001/api/create-agentic-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            setGeneratedPlan(data.plan);
            setTimeout(() => {
                document.getElementById('itinerary-results')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } catch (error) {
            alert("Error generating plan: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // 2. Modify Plan
    const handleModify = async () => {
        if (!modificationInstruction) return;
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:8001/api/modify-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    current_plan: generatedPlan,
                    user_instruction: modificationInstruction
                }),
            });
            const data = await res.json();
            setGeneratedPlan(data.plan);
            setModificationInstruction("");
        } catch (error) {
            alert("Error modifying plan");
        } finally {
            setIsLoading(false);
        }
    };

    // 3. Save Trip
    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/trips', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    city: formData.city,
                    startDate: formData.startDate,
                    endDate: formData.endDate,
                    notes: formData.notes,
                    final_plan: generatedPlan,
                    destination: formData.city
                }),
            });
            const data = await res.json();
            if (res.ok) {
                alert("Trip saved successfully! Redirecting to your trips...");
                navigate('/my-trips');
            } else {
                alert("Failed to save: " + data.message);
            }
        } catch (error) {
            console.error("Save Error:", error);
            alert("Error saving trip: " + (error.message || "Unknown error"));
        }
    };

    return (
        <div className="container page-container">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="planner-layout"
            >

                {/* --- Left Column: Inputs --- */}
                <div className="planner-sidebar">
                    <div className="glass-panel p-md">
                        <div className="mb-lg">
                            <h1 className="flex-center mb-sm text-xl gap-sm justify-start">
                                <Sparkles className="text-primary" /> Plan Trip
                            </h1>
                            <p className="text-secondary">AI-powered itinerary generation.</p>
                        </div>

                        <form onSubmit={handleGenerate} className="flex-col gap-lg">
                            {/* Destination */}
                            <div className="grid-2">
                                <div className="form-group no-margin">
                                    <label className="form-label">City</label>
                                    <div className="input-icon-wrapper">
                                        <MapPin size={18} className="icon" />
                                        <input
                                            name="city"
                                            className="form-input with-icon"
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g. Kyoto"
                                        />
                                    </div>
                                </div>
                                <div className="form-group no-margin">
                                    <label className="form-label">Country</label>
                                    <input
                                        name="country"
                                        className="form-input"
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. Japan"
                                    />
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="grid-2">
                                <div className="form-group no-margin">
                                    <label className="form-label">Start Date</label>
                                    <input name="startDate" type="date" className="form-input" onChange={handleChange} required />
                                </div>
                                <div className="form-group no-margin">
                                    <label className="form-label">End Date</label>
                                    <input name="endDate" type="date" className="form-input" onChange={handleChange} required />
                                </div>
                            </div>

                            {/* Budget */}
                            <div>
                                <label className="form-label">Budget Type</label>
                                <div className="budget-options">
                                    {['Fixed', 'Flexible', 'Luxury'].map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, budgetType: type })}
                                            className={`budget-chip ${formData.budgetType === type ? 'active' : ''}`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                                {formData.budgetType === 'Fixed' && (
                                    <div className="input-icon-wrapper mt-md">
                                        <DollarSign size={18} className="icon" />
                                        <input
                                            name="budgetAmount"
                                            type="number"
                                            className="form-input with-icon"
                                            placeholder="Enter max amount"
                                            onChange={handleChange}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="form-label">Preferences / Notes</label>
                                <textarea
                                    name="notes"
                                    rows="3"
                                    className="form-textarea"
                                    onChange={handleChange}
                                    placeholder="e.g. Vegan food, avoid crowds, love museums..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-full-width mt-md"
                                disabled={isLoading}
                            >
                                {isLoading && !generatedPlan ? (
                                    <><RefreshCw className="spin" size={20} /> Generating...</>
                                ) : (
                                    <><Sparkles size={20} /> Generate Itinerary</>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* --- Right Column: Results --- */}
                <div className="planner-results" id="itinerary-results">
                    {generatedPlan ? (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-panel planner-editor-area"
                        >
                            <div className="flex-between mb-lg">
                                <h2>Your Itinerary</h2>
                                <div className="flex-center gap-sm">
                                    <span className="badge">{formData.city}</span>
                                    <span className="badge">{formData.budgetType}</span>
                                </div>
                            </div>

                            <div className="editor-wrapper">
                                <textarea
                                    value={generatedPlan}
                                    onChange={(e) => setGeneratedPlan(e.target.value)}
                                    className="form-textarea code-font h-full"
                                />
                            </div>

                            {/* AI Modification Bar */}
                            <div className="ai-modify-bar mb-lg">
                                <Wand2 size={20} className="text-secondary ml-md" />
                                <input
                                    type="text"
                                    value={modificationInstruction}
                                    onChange={(e) => setModificationInstruction(e.target.value)}
                                    placeholder="Ask AI to adjust..."
                                    className="modify-input"
                                    onKeyDown={(e) => e.key === 'Enter' && handleModify()}
                                />
                                <button
                                    onClick={handleModify}
                                    className="btn-icon"
                                    disabled={isLoading}
                                    title="Apply Changes"
                                >
                                    {isLoading ? <RefreshCw className="spin" size={18} /> : <Send size={18} />}
                                </button>
                            </div>

                            <div className="action-row">
                                <button onClick={handleSave} className="btn btn-primary btn-full-width">
                                    <Save size={18} /> Save Plan
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="glass-panel center-content empty-state">
                            <FileText size={64} className="mb-md opacity-50" />
                            <h3>Ready to Plan?</h3>
                            <p className="text-secondary">Fill out the details on the left to generate your custom itinerary.</p>
                        </div>
                    )}
                </div>

            </motion.div>
        </div>
    );
};

export default CreateTrip;
