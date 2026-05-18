import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Register() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!role) {
            alert("Please select a role before registering.");
            return;
        }

        // Automatically switches between local testing and your live Render API
        const API_BASE_URL = window.location.hostname === "localhost"
            ? "http://localhost:5000"
            : "https://atomquest-hackathon-2026-60su.onrender.com";

        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    password,
                    role
                })
            });

            if (!response.ok) {
                throw new Error("Server communication issue");
            }

            const data = await response.json();

            if (data.message === "success") {
                alert("Registration Successful!");
                navigate("/login");
            } else {
                alert(data.error || "Registration Failed. Username might be taken.");
            }
        } catch (error) {
            console.error("Registration error:", error);
            alert("Unable to reach the server. Please try again in a few seconds.");
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h1 className="register-title">Create Account</h1>
                
                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="Username"
                        className="register-input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="register-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <select
                        className="register-select"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                    >
                        <option value="">Select Role</option>
                        <option value="Employee">Employee</option>
                        <option value="Manager">Manager</option>
                        <option value="Admin">Admin</option>
                    </select>

                    <button type="submit" className="register-btn">
                        Register
                    </button>
                </form>
                
                <p className="login-link-text" onClick={() => navigate("/login")}>
                    Already have an account? Sign In
                </p>
            </div>
        </div>
    );
}

export default Register;
