import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        // Automatically switches between local testing and your live Render API
        const API_BASE_URL = window.location.hostname === "localhost"
            ? "http://localhost:5000"
            : "https://atomquest-hackathon-2026-60su.onrender.com";

        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();

            if (data.message === "success") {
                if (data.role === "Employee") {
                    navigate("/employee");
                } else if (data.role === "Manager") {
                    navigate("/manager");
                } else if (data.role === "Admin") {
                    navigate("/admin");
                }
            } else {
                alert("Invalid Login");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Unable to connect to the server. Please try again later.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">
                    Goal Portal Login
                </h1>

                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Enter Username"
                        className="login-input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Enter Password"
                        className="login-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit" className="login-btn">
                        Login
                    </button>
                </form>

                <p className="login-text">
                    Employee Performance Management System
                </p>
            </div>
        </div>
    );
}

export default Login;