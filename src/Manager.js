import { useEffect, useState } from "react";
import "./Manager.css";

function Manager() {
    // Dynamic base URL detection for development vs production environments
    const API_BASE_URL = window.location.hostname === "localhost"
        ? "http://localhost:5000"
        : "https://atomquest-hackathon-2026-60su.onrender.com";

    // GOALS
    const [goals, setGoals] = useState([]);

    // ASSIGNED EMPLOYEES
    const [assigned, setAssigned] = useState([]);

    // UNASSIGNED EMPLOYEES
    const [unassigned, setUnassigned] = useState([]);

    // SHARED GOAL FORM
    const [sharedGoal, setSharedGoal] = useState({
        goal_title: "",
        target_value: ""
    });

    // FETCH ALL GOALS
    useEffect(() => {
        fetch(`${API_BASE_URL}/allgoals`)
            .then(res => res.json())
            .then(data => setGoals(data))
            .catch(err => console.error("Error fetching all goals:", err));
    }, [API_BASE_URL]);

    // FETCH ASSIGNED EMPLOYEES
    useEffect(() => {
        fetch(`${API_BASE_URL}/assignedemployees`)
            .then(res => res.json())
            .then(data => setAssigned(data))
            .catch(err => console.error("Error fetching assigned employees:", err));
    }, [API_BASE_URL]);

    // FETCH UNASSIGNED EMPLOYEES
    useEffect(() => {
        fetch(`${API_BASE_URL}/unassignedemployees`)
            .then(res => res.json())
            .then(data => setUnassigned(data))
            .catch(err => console.error("Error fetching unassigned employees:", err));
    }, [API_BASE_URL]);

    // HANDLE SHARED GOAL INPUT
    const handleSharedGoalChange = (e) => {
        setSharedGoal({
            ...sharedGoal,
            [e.target.name]: e.target.value
        });
    };

    // CREATE SHARED GOAL
    const createSharedGoal = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/createsharedgoal`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    primary_owner_id: 1,
                    ...sharedGoal
                })
            });
            const data = await res.json();
            alert(data.message || "Shared goal created!");
            window.location.reload();
        } catch (err) {
            console.error("Error creating shared goal:", err);
            alert("Failed to create shared goal.");
        }
    };

    // APPROVE GOAL
    const approveGoal = async (id) => {
        try {
            await fetch(`${API_BASE_URL}/approve/${id}`, {
                method: "PUT"
            });
            alert("Goal Approved");
            window.location.reload();
        } catch (err) {
            console.error("Error approving goal:", err);
            alert("Failed to approve goal.");
        }
    };

    // UPDATE GOAL
    const updateGoal = async (goal) => {
        try {
            await fetch(`${API_BASE_URL}/updategoal/${goal.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    target_value: goal.target_value,
                    weightage: goal.weightage
                })
            });
            alert("Goal Updated");
        } catch (err) {
            console.error("Error updating goal:", err);
            alert("Failed to update goal metrics.");
        }
    };

    // RETURN FOR REWORK
    const reworkGoal = async (id) => {
        try {
            await fetch(`${API_BASE_URL}/rework/${id}`, {
                method: "PUT"
            });
            alert("Returned For Rework");
            window.location.reload();
        } catch (err) {
            console.error("Error requesting rework:", err);
            alert("Failed to submit rework request.");
        }
    };

    // SAVE CHECK-IN COMMENT
    const saveComment = async (goal) => {
        try {
            const res = await fetch(`${API_BASE_URL}/checkin/${goal.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    manager_comment: goal.manager_comment
                })
            });
            const data = await res.json();
            alert(data.message || "Check-in saved!");
        } catch (err) {
            console.error("Error saving check-in:", err);
            alert("Failed to save comment.");
        }
    };

    // ASSIGN GOAL
    const assignGoal = async (employeeId) => {
        const sharedGoalId = 1;
        const weightage = 20;

        try {
            const res = await fetch(`${API_BASE_URL}/assigngoal`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    shared_goal_id: sharedGoalId,
                    employee_id: employeeId,
                    weightage: weightage
                })
            });
            const data = await res.json();
            alert(data.message || "Goal assigned cleanly!");
            window.location.reload();
        } catch (err) {
            console.error("Error assigning goal:", err);
            alert("Failed to assign goal allocation.");
        }
    };

    return (
        <div style={{ padding: "20px" }} className="manager-container">
            <h1>Manager Approval Dashboard</h1>
            <hr />

            {/* CREATE SHARED GOAL */}
            <div className="form-card" style={{ marginBottom: "20px" }}>
                <h1>Create Shared Goal</h1>
                <h3>Goal Title</h3>
                <input
                    type="text"
                    name="goal_title"
                    placeholder="Enter Goal Title"
                    value={sharedGoal.goal_title}
                    onChange={handleSharedGoalChange}
                />

                <h3>Target Value</h3>
                <input
                    type="text"
                    name="target_value"
                    placeholder="Enter Target Value"
                    value={sharedGoal.target_value}
                    onChange={handleSharedGoalChange}
                />
                <br /><br />
                <button onClick={createSharedGoal}>Create Shared Goal</button>
            </div>
            <hr />

            {/* GOALS CONTROL GRID */}
            <h1>Review Employee Proposals</h1>
            {goals.length === 0 ? (
                <p>No goals currently submitted for review.</p>
            ) : (
                goals.map((g) => (
                    <div
                        key={g.id}
                        style={{
                            border: "1px solid black",
                            padding: "20px",
                            marginBottom: "20px",
                            borderRadius: "10px"
                        }}
                        className="goal-card"
                    >
                        <h2>Goal Title</h2>
                        <p>{g.goal_title}</p>

                        <h2>Description</h2>
                        <p>{g.description}</p>

                        <h2>Thrust Area</h2>
                        <p>{g.thrust_area}</p>

                        <h2>Unit Of Measurement (UOM)</h2>
                        <p>{g.uom}</p>

                        <h2>Target Value</h2>
                        <input
                            type="text"
                            value={g.target_value || ""}
                            onChange={(e) => {
                                const updatedGoals = goals.map((goal) =>
                                    goal.id === g.id ? { ...goal, target_value: e.target.value } : goal
                                );
                                setGoals(updatedGoals);
                            }}
                        />

                        <h2>Weightage (%)</h2>
                        <input
                            type="number"
                            value={g.weightage || ""}
                            onChange={(e) => {
                                const updatedGoals = goals.map((goal) =>
                                    goal.id === g.id ? { ...goal, weightage: e.target.value } : goal
                                );
                                setGoals(updatedGoals);
                            }}
                        />
                        <br /><br />
                        <button onClick={() => updateGoal(g)}>Save Changes</button>
                        <button onClick={() => approveGoal(g.id)} style={{ marginLeft: "10px" }}>Approve</button>
                        <button onClick={() => reworkGoal(g.id)} style={{ marginLeft: "10px" }}>Return For Rework</button>

                        <h2>Status</h2>
                        <p>{g.status || "Pending"}</p>
                        <hr />

                        <h2>Planned Target</h2>
                        <p>{g.target_value}</p>

                        <h2>Actual Achievement</h2>
                        <p>{g.actual_achievement || "Not updated yet"}</p>

                        <h2>Progress Status</h2>
                        <p>{g.progress_status || "None"}</p>

                        <h2>Progress Score</h2>
                        <p>{g.progress_score || 0}%</p>

                        <h2>Manager Check-in Comment</h2>
                        <textarea
                            value={g.manager_comment || ""}
                            onChange={(e) => {
                                const updatedGoals = goals.map((goal) =>
                                    goal.id === g.id ? { ...goal, manager_comment: e.target.value } : goal
                                );
                                setGoals(updatedGoals);
                            }}
                        />
                        <br /><br />
                        <button onClick={() => saveComment(g)}>Save Check-in</button>
                    </div>
                ))
            )}
            <hr />

            {/* ASSIGNED EMPLOYEES */}
            <h1>Assigned Employees</h1>
            {assigned.length === 0 ? <p>No assigned employees listings found.</p> : assigned.map((emp) => (
                <div
                    key={emp.id}
                    style={{
                        border: "1px solid blue",
                        padding: "15px",
                        marginBottom: "10px",
                        borderRadius: "10px"
                    }}
                >
                    <h3>Employee Name</h3>
                    <p>{emp.username}</p>
                    <h3>Assigned Goal</h3>
                    <p>{emp.goal_title}</p>
                </div>
            ))}
            <hr />

            {/* UNASSIGNED EMPLOYEES */}
            <h1>Employees Without Assigned Goals</h1>
            {unassigned.length === 0 ? <p>All active employees have goals structuralized.</p> : unassigned.map((emp) => (
                <div
                    key={emp.id}
                    style={{
                        border: "1px solid red",
                        padding: "15px",
                        marginBottom: "10px",
                        borderRadius: "10px"
                    }}
                >
                    <h3>{emp.username}</h3>
                    <p>No Goal Assigned</p>
                    <button onClick={() => assignGoal(emp.id)}>Assign Goal</button>
                </div>
            ))}
        </div>
    );
}

export default Manager;