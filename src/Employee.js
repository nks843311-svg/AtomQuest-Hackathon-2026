import { useState, useEffect } from "react";

import "./Employee.css";

function Employee() {

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

        fetch(`http://localhost:5000/goals/${userId}`)

        .then(res => res.json())

        .then(data => setGoals(data));

    }, []);

    // HANDLE INPUT
    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value
        });
    };

    // ADD GOAL
    const addGoal = async (e) => {

        e.preventDefault();

        if(goals.length >= 8){

            alert("Maximum 8 goals allowed");

            return;
        }

        if(Number(form.weightage) < 10){

            alert("Minimum weightage is 10%");

            return;
        }

        const totalWeightage =

        goals.reduce(
            (sum,g)=>sum + Number(g.weightage),
            0
        );

        if(totalWeightage + Number(form.weightage) > 100){

            alert("Total weightage cannot exceed 100%");

            return;
        }

        const res = await fetch(

            "http://localhost:5000/goals",

            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body: JSON.stringify({

                    user_id:userId,

                    ...form
                })
            }
        );

        const data = await res.json();

        alert(data.message);

        window.location.reload();
    };

    // QUARTER UPDATE
    const updateQuarterly = async(goal)=>{

        const res = await fetch(

            `http://localhost:5000/updatequarter/${goal.id}`,

            {

                method:"PUT",

                headers:{
                    "Content-Type":"application/json"
                },

                body: JSON.stringify({

                    actual_achievement:
                    goal.actual_achievement,

                    progress_status:
                    goal.progress_status
                })
            }
        );

        const data = await res.json();

        alert(data.message);

        window.location.reload();
    };

    return (

        <div className="employee-container">

            <h1 className="main-title">

                Employee Goal Dashboard

            </h1>

            {/* GOAL FORM */}

            <div className="form-card">

                <h2 className="section-title">

                    Create Goal

                </h2>

                <form onSubmit={addGoal}>

                    <input
                    className="input-field"
                    name="goal_title"
                    placeholder="Goal Title"
                    onChange={handleChange}
                    />

                    <input
                    className="input-field"
                    name="description"
                    placeholder="Description"
                    onChange={handleChange}
                    />

                    <input
                    className="input-field"
                    name="thrust_area"
                    placeholder="Thrust Area"
                    onChange={handleChange}
                    />

                    <select
                    className="select-field"
                    name="uom"
                    onChange={handleChange}
                    >

                        <option value="">
                            Select UOM
                        </option>

                        <option>
                            Numeric
                        </option>

                        <option>
                            %
                        </option>

                        <option>
                            Timeline
                        </option>

                        <option>
                            Zero-based
                        </option>

                    </select>

                    <input
                    className="input-field"
                    name="target_value"
                    placeholder="Target Value"
                    onChange={handleChange}
                    />

                    <input
                    className="input-field"
                    type="number"
                    name="weightage"
                    placeholder="Weightage %"
                    onChange={handleChange}
                    />

                    <button
                    type="submit"
                    className="submit-btn">

                        Submit Goal

                    </button>

                </form>

            </div>

            {/* GOALS */}

            <h2 className="section-title">

                My Goals

            </h2>

            {goals.map((goal)=>(

                <div
                key={goal.id}
                className="goal-card">

                    <h3>Goal Title</h3>

                    <input
                    className="input-field"
                    value={goal.goal_title}
                    readOnly
                    />

                    <h3>Description</h3>

                    <input
                    className="input-field"
                    value={goal.description}
                    readOnly
                    />

                    <h3>Thrust Area</h3>

                    <input
                    className="input-field"
                    value={goal.thrust_area}
                    readOnly
                    />

                    <h3>UOM</h3>

                    <input
                    className="input-field"
                    value={goal.uom}
                    readOnly
                    />

                    <h3>Target Value</h3>

                    <input
                    className="input-field"
                    value={goal.target_value}
                    readOnly
                    />

                    <h3>Weightage (%)</h3>

                    <input

                    className="input-field"

                    type="number"

                    value={goal.weightage}

                    disabled={goal.status === "approved"}

                    onChange={(e)=>{

                        const updatedGoals =

                        goals.map((g)=>

                            g.id === goal.id

                            ? {
                                ...g,
                                weightage:e.target.value
                              }

                            : g
                        );

                        setGoals(updatedGoals);
                    }}
                    />

                    <h3>Actual Achievement</h3>

                    <input

                    className="input-field"

                    type="text"

                    value={goal.actual_achievement || ""}

                    onChange={(e)=>{

                        const updatedGoals =

                        goals.map((g)=>

                            g.id === goal.id

                            ? {
                                ...g,
                                actual_achievement:e.target.value
                              }

                            : g
                        );

                        setGoals(updatedGoals);
                    }}
                    />

                    <h3>Progress Status</h3>

                    <select

                    className="select-field"

                    value={goal.progress_status || ""}

                    onChange={(e)=>{

                        const updatedGoals =

                        goals.map((g)=>

                            g.id === goal.id

                            ? {
                                ...g,
                                progress_status:e.target.value
                              }

                            : g
                        );

                        setGoals(updatedGoals);
                    }}
                    >

                        <option value="">
                            Select Status
                        </option>

                        <option>
                            Not Started
                        </option>

                        <option>
                            On Track
                        </option>

                        <option>
                            Completed
                        </option>

                    </select>

                    <button

                    className="save-btn"

                    onClick={()=>updateQuarterly(goal)}>

                        Save Quarterly Update

                    </button>

                    <h3>Status</h3>

                    <div className="status-box">

                        {goal.status}

                    </div>

                    {goal.status === "approved" && (

                        <p className="locked-text">

                            Goal Locked By Manager

                        </p>
                    )}

                </div>
            ))}

        </div>
    );
}

export default Employee;