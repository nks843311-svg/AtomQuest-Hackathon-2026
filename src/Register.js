import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register(){

    const navigate = useNavigate();

    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [role,setRole] = useState("");

    const handleRegister = async (e) => {

        e.preventDefault();

        const response = await fetch(
            "http://localhost:5000/register",
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    username,
                    password,
                    role
                })
            }
        );

        const data = await response.json();

        if(data.message === "success"){
            alert("Registration Successful");
            navigate("/login");
        }
        else{
            alert("Registration Failed");
        }
    };

    return(

        <form onSubmit={handleRegister}>

            <input
                type="text"
                placeholder="Username"
                onChange={(e)=>setUsername(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                onChange={(e)=>setPassword(e.target.value)}
            />

            <select
                onChange={(e)=>setRole(e.target.value)}
            >
                <option value="">Select Role</option>
                <option value="Employee">Employee</option>
                <option value="Manager">Manager</option>
                <option value="Admin">Admin</option>
            </select>

            <button type="submit">
                Register
            </button>

        </form>
    );
}

export default Register;