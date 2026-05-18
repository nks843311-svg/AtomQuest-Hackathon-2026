import { useEffect, useState } from "react";
import "./Admin.css";

function Admin() {
    // Dynamic base URL detection for development vs production environments
    const API_BASE_URL = window.location.hostname === "localhost"
        ? "http://localhost:5000"
        : "https://atomquest-hackathon-2026-60su.onrender.com";

    // USERS
    const [users, setUsers] = useState([]);

    // GOALS
    const [goals, setGoals] = useState([]);

    // FETCH USERS
    useEffect(() => {
        fetch(`${API_BASE_URL}/users`)
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(err => console.error("Error fetching users:", err));
    }, [API_BASE_URL]);

    // FETCH GOALS
    useEffect(() => {
        fetch(`${API_BASE_URL}/allgoals`)
            .then(res => res.json())
            .then(data => setGoals(data))
            .catch(err => console.error("Error fetching goals:", err));
    }, [API_BASE_URL]);

    // DELETE USER
    const deleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            const res = await fetch(`${API_BASE_URL}/deleteuser/${id}`, {
                method: "DELETE"
            });
            const data = await res.json();
            alert(data.message || "User deleted successfully");
            window.location.reload();
        } catch (err) {
            console.error("Error deleting user:", err);
            alert("Failed to delete user. Check server connection.");
        }
    };

    // UNLOCK GOAL
    const unlockGoal = async (id) => {
        try {
            const res = await fetch(`${API_BASE_URL}/unlockgoal/${id}`, {
                method: "PUT"
            });
            const data = await res.json();
            alert(data.message || "Goal unlocked successfully");
            window.location.reload();
        } catch (err) {
            console.error("Error unlocking goal:", err);
            alert("Failed to unlock goal.");
        }
    };

    return (
        <div className="admin-container">
            <h1 className="main-title">Admin Dashboard</h1>

            {/* USERS SECTION */}
            <h2 className="section-title">All Users</h2>
            {users.length === 0 ? (
                <p>No registered users found.</p>
            ) : (
                users.map((u) => (
                    <div key={u.id} className="card">
                        <h3>User Name</h3>
                        <p>{u.username}</p>

                        <h3>Role</h3>
                        <p>{u.role}</p>

                        <button
                            className="delete-btn"
                            onClick={() => deleteUser(u.id)}
                        >
                            Delete User
                        </button>
                    </div>
                ))
            )}

            <hr />

            {/* GOALS SECTION */}
            <h2 className="section-title">Goal Management</h2>
            {goals.length === 0 ? (
                <p>No active performance goals found.</p>
            ) : (
                goals.map((g) => (
                    <div key={g.id} className="card">
                        <h3>Goal Title</h3>
                        <p>{g.goal_title}</p>

                        <h3>Employee ID</h3>
                        <p>{g.user_id}</p>

                        <h3>Status</h3>
                        <p>{g.status || "Pending"}</p>

                        <button
                            className="unlock-btn"
                            onClick={() => unlockGoal(g.id)}
                        >
                            Unlock Goal
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}

export default Admin;