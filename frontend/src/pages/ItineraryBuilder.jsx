import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Plus, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import axios from 'axios';

const ItineraryBuilder = () => {
    const { tripId } = useParams();
    const [days, setDays] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:5000/api/trips/${tripId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Initialize mock drag-drop data structure from the text if possible, or just raw blocks
                // For this demo, we create "Activity Cards" from lines starting with "-"
                const planText = res.data.plan_details || "";

                // Robust parsing of "Day X"
                // Split by "Day <number>" (case insensitive, optional colon)
                const daySplit = planText.split(/(?=Day\s+\d+)/i);

                const parsedDays = daySplit.filter(s => s.trim().length > 0).map((dayContent, index) => {
                    // Extract title (e.g. "Day 1: Paris")
                    const lines = dayContent.trim().split('\n');
                    const title = lines[0].trim();

                    // Extract activities (lines that look like list items or have substantial content)
                    const activityLines = lines.slice(1).filter(line => {
                        const l = line.trim();
                        return l.length > 5 && (l.startsWith('-') || l.startsWith('*') || l.match(/^\d+\./));
                    });

                    // If no list items found, just take non-empty lines that aren't headers (simplified)
                    const finalActivities = activityLines.length > 0 ? activityLines : lines.slice(1).filter(l => l.trim().length > 10);

                    return {
                        id: `day-${index + 1}`,
                        date: title || `Day ${index + 1}`,
                        activities: finalActivities.map((line, i) => ({
                            id: `day-${index}-act-${i}`,
                            title: line.replace(/^[-*•]\s*/, '').replace(/^\d+\.\s*/, '').trim(),
                            type: 'general'
                        }))
                    };
                });

                // Fallback if parsing completely fails but text exists
                if (parsedDays.length === 0 && planText.length > 0) {
                    parsedDays.push({
                        id: 'day-1',
                        date: 'Itinerary',
                        activities: [{ id: 'act-1', title: 'Review detailed plan in View mode', type: 'note' }]
                    });
                }

                setDays(parsedDays);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTrip();
    }, [tripId]);

    const onDragEnd = (result) => {
        if (!result.destination) return;
        // Logic to reorder 'days' state array
        // Copilot Note: Simplified reorder logic
        const sourceDayIndex = days.findIndex(d => d.id === result.source.droppableId);
        const destDayIndex = days.findIndex(d => d.id === result.destination.droppableId);

        const sourceDay = days[sourceDayIndex];
        const destDay = days[destDayIndex];

        const sourceActivities = [...sourceDay.activities];
        const destActivities = [...destDay.activities];

        const [moved] = sourceActivities.splice(result.source.index, 1);

        if (sourceDayIndex === destDayIndex) {
            sourceActivities.splice(result.destination.index, 0, moved);
            const newDays = [...days];
            newDays[sourceDayIndex] = { ...sourceDay, activities: sourceActivities };
            setDays(newDays);
        } else {
            destActivities.splice(result.destination.index, 0, moved);
            const newDays = [...days];
            newDays[sourceDayIndex] = { ...sourceDay, activities: sourceActivities };
            newDays[destDayIndex] = { ...destDay, activities: destActivities };
            setDays(newDays);
        }
    };

    if (loading) return <div className="container" style={{ paddingTop: '4rem' }}>Loading Builder...</div>;

    return (
        <div className="container" style={{ paddingTop: '2rem', height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
            <header className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Trip Builder 🏗️</h1>
                    <p className="text-secondary">Drag and drop activities to rearrange your schedule.</p>
                </div>
                <button className="btn btn-primary">Save Changes</button>
            </header>

            <DragDropContext onDragEnd={onDragEnd}>
                <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '2rem', height: '100%' }}>
                    {days.map((day) => (
                        <div key={day.id} className="glass-panel" style={{ minWidth: '320px', width: '320px', display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.5)' }}>
                            <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontWeight: 700, background: 'rgba(255,255,255,0.8)' }}>
                                {day.date}
                            </div>
                            <Droppable droppableId={day.id}>
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        style={{ padding: '1rem', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
                                    >
                                        {day.activities.map((act, index) => (
                                            <Draggable key={act.id} draggableId={act.id} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={{
                                                            userSelect: 'none',
                                                            padding: '1rem',
                                                            backgroundColor: 'white',
                                                            borderRadius: '0.75rem',
                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                                            ...provided.draggableProps.style
                                                        }}
                                                    >
                                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                                                            <GripVertical size={16} color="#cbd5e1" style={{ marginTop: '4px' }} />
                                                            <span style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>{act.title}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
};

export default ItineraryBuilder;
