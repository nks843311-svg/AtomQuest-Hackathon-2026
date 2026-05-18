import { useState, useEffect } from "react";
import "./Employee.css";

function Employee() {
    // Dynamic base URL detection for development vs production environments
    const API_BASE_URL = window.location.hostname === "localhost"
        ? "http://localhost:5000"
        : "https://atomquest-hackathon-2026-60su.onrender.com";

    const userId = 1;

    const [form, setForm] = useState({
        goal_title: "",
        description: "",
        thrust_area: "",
        uom: "",
        target_value: "",
        weightage: ""
    });

    const [goals, setGoals] = useState([]);

    // FETCH GOALS
    useEffect(() => {
        fetch(`${API_BASE_URL}/goals/${userId}`)
            .then(res => res.json())
            .then(data => setGoals(data))
            .catch(err => console.error("Error fetching goals:", err));
    }, [API_BASE_URL]);

    // HANDLE INPUT CHANGE
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // ADD GOAL
    const addGoal = async (e) => {
        e.preventDefault();

        if (goals.length >= 8) {
            alert("Maximum 8 goals allowed");
            return;
        }

        if (Number(form.weightage) < 10) {
            alert("Minimum weightage is 10%");
            return;
        }

        const totalWeightage = goals.reduce(
            (sum, g) => sum + Number(g.weightage),
            0
        );

        if (totalWeightage + Number(form.weightage) > 100) {
            alert("Total weightage cannot exceed 100%");
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/goals`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user_id: userId,
                    ...form
                })
            });

            const data = await res.json();
            alert(data.message || "Goal added successfully!");
            window.location.reload();
        } catch (err) {
            console.error("Error adding goal:", err);
            alert("Failed to submit goal. Check server connection.");
        }
    };

    // QUARTER UPDATE
    const updateQuarterly = async (goal) => {
        try {
            const res = await fetch(`${API_BASE_URL}/updatequarter/${goal.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    actual_achievement: goal.actual_achievement,
                    progress_status: goal.progress_status
                })
            });

            const data = await res.json();
            alert(data.message || "Quarter update saved!");
            window.location.reload();
        } catch (err) {
            console.error("Error updating quarter metrics:", err);
            alert("Failed to update goal criteria.");
        }
    };

    return (
        <div className="employee-container">
            <h1 className="main-title">Employee Goal Dashboard</h1>

            {/* GOAL FORM */}
            <div className="form-card">
                <h2 className="section-title">Create Goal</h2>
                <form onSubmit={addGoal}>
                    <input
                        className="input-field"
                        name="goal_title"
                        placeholder="Goal Title"
                        value={form.goal_title}
                        onChange={handleChange}
                        required
                    />

                    <input
                        className="input-field"
                        name="description"
                        placeholder="Description"
                        value={form.description}
                        onChange={handleChange}
                        required
                    />

                    <input
                        className="input-field"
                        name="thrust_area"
                        placeholder="Thrust Area"
                        value={form.thrust_area}
                        onChange={handleChange}
                        required
                    />

                    <select
                        className="select-field"
                        name="uom"
                        value={form.uom}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select UOM</option>
                        <option value="Numeric">Numeric</option>
                        <option value="%">%</option>
                        <option value="Timeline">Timeline</option>
                        <option value="Zero-based">Zero-based</option>
                    </select>

                    <input
                        className="input-field"
                        name="target_value"
                        placeholder="Target Value"
                        value={form.target_value}
                        onChange={handleChange}
                        required
                    />

                    <input
                        className="input-field"
                        type="number"
                        name="weightage"
                        placeholder="Weightage %"
                        value={form.weightage}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit" className="submit-btn">
                        Submit Goal
                    </button>
                </form>
            </div>

            {/* DISPLAY GOALS */}
            <h2 className="section-title">My Goals</h2>
            
            {goals.length === 0 ? (
                <p className="no-goals-text">No active performance goals found.</p>
            ) : (
                goals.map((goal) => (
                    <div key={goal.id} className="goal-card">
                        <h3>Goal Title</h3>
                        <input className="input-field" value={goal.goal_title || ""} readOnly />

                        <h3>Description</h3>
                        <input className="input-field" value={goal.description || ""} readOnly />

                        <h3>Thrust Area</h3>
                        <input className="input-field" value={goal.thrust_area || ""} readOnly />

                        <h3>UOM</h3>
                        <input className="input-field" value={goal.uom || ""} readOnly />

                        <h3>Target Value</h3>
                        <input className="input-field" value={goal.target_value || ""} readOnly />

                        <h3>Weightage (%)</h3>
                        <input
                            className="input-field"
                            type="number"
                            value={goal.weightage || ""}
                            disabled={goal.status === "approved"}
                            onChange={(e) => {
                                const updatedGoals = goals.map((g) =>
                                    g.id === goal.id ? { ...g, weightage: e.target.value } : g
                                );
                                setGoals(updatedGoals);
                            }}
                        />

                        <h3>Actual Achievement</h3>
                        <input
                            className="input-field"
                            type="text"
                            value={goal.actual_achievement || ""}
                            onChange={(e) => {
                                const updatedGoals = goals.map((g) =>
                                    g.id === goal.id ? { ...g, actual_achievement: e.target.value } : g
                                );
                                setGoals(updatedGoals);
                            }}
                        />

                        <h3>Progress Status</h3>
                        <select
                            className="select-field"
                            value={goal.progress_status || ""}
                            onChange={(e) => {
                                const updatedGoals = goals.map((g) =>
                                    g.id === goal.id ? { ...g, progress_status: e.target.value } : g
                                );
                                setGoals(updatedGoals);
                            }}
                        >
                            <option value="">Select Status</option>
                            <option value="Not Started">Not Started</option>
                            <option value="On Track">On Track</option>
                            <option value="Completed">Completed</option>
                        </select>

                        <button className="save-btn" onClick={() => updateQuarterly(goal)}>
                            Save Quarterly Update
                        </button>

                        <h3>Status</h3>
                        <div className="status-box">{goal.status || "Pending"}</div>

                        {goal.status === "approved" && (
                            <p className="locked-text">Goal Locked By Manager</p>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

export default Employee;