import { useState } from "react";

import { useNavigate } from "react-router-dom";

import "./Login.css";

function Login(){

    const navigate = useNavigate();

    const [username,setUsername] = useState("");

    const [password,setPassword] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        const response = await fetch(
            
            "http://localhost:5000/login",

            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body: JSON.stringify({

                    username,
                    password
                })
            }
        );

        const data = await response.json();

        if(data.message === "success"){

            if(data.role === "Employee"){

                navigate("/employee");
            }

            else if(data.role === "Manager"){

                navigate("/manager");
            }

            else if(data.role === "Admin"){

                navigate("/admin");
            }
        }

        else{

            alert("Invalid Login");
        }
    };

    return(

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

                        onChange={(e)=>
                            setUsername(e.target.value)
                        }
                    />

                    <input

                        type="password"

                        placeholder="Enter Password"

                        className="login-input"

                        onChange={(e)=>
                            setPassword(e.target.value)
                        }
                    />

                    <button
                    type="submit"
                    className="login-btn">

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