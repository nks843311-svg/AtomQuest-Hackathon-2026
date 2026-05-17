import { useEffect, useState } from "react";

import "./Admin.css";

function Admin(){

    // USERS
    const [users,setUsers] = useState([]);

    // GOALS
    const [goals,setGoals] = useState([]);

    // FETCH USERS
    useEffect(()=>{

        fetch("http://localhost:5000/users")

        .then(res=>res.json())

        .then(data=>setUsers(data));

    },[]);

    // FETCH GOALS
    useEffect(()=>{

        fetch("http://localhost:5000/allgoals")

        .then(res=>res.json())

        .then(data=>setGoals(data));

    },[]);

    // DELETE USER
    const deleteUser = async(id)=>{

        const res = await fetch(

            `http://localhost:5000/deleteuser/${id}`,

            {
                method:"DELETE"
            }
        );

        const data = await res.json();

        alert(data.message);

        window.location.reload();
    };

    // UNLOCK GOAL
    const unlockGoal = async(id)=>{

        const res = await fetch(

            `http://localhost:5000/unlockgoal/${id}`,

            {
                method:"PUT"
            }
        );

        const data = await res.json();

        alert(data.message);

        window.location.reload();
    };

    return(

        <div className="admin-container">

            <h1 className="main-title">

                Admin Dashboard

            </h1>

            {/* USERS SECTION */}

            <h2 className="section-title">

                All Users

            </h2>

            {users.map((u)=>(

                <div
                key={u.id}
                className="card">

                    <h3>User Name</h3>

                    <p>{u.username}</p>

                    <h3>Role</h3>

                    <p>{u.role}</p>

                    <button

                    className="delete-btn"

                    onClick={()=>deleteUser(u.id)}>

                        Delete User

                    </button>

                </div>
            ))}

            <hr />

            {/* GOALS SECTION */}

            <h2 className="section-title">

                Goal Management

            </h2>

            {goals.map((g)=>(

                <div
                key={g.id}
                className="card">

                    <h3>Goal Title</h3>

                    <p>{g.goal_title}</p>

                    <h3>Employee ID</h3>

                    <p>{g.user_id}</p>

                    <h3>Status</h3>

                    <p>{g.status}</p>

                    <button

                    className="unlock-btn"

                    onClick={()=>unlockGoal(g.id)}>

                        Unlock Goal

                    </button>

                </div>
            ))}

        </div>
    );
}

export default Admin;