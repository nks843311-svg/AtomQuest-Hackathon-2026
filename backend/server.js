const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

db.connect((err)=>{

    if(err){
        console.log(err);
    }
    else{
        console.log("MySQL Connected");
    }
});


// LOGIN
app.post("/login",(req,res)=>{

    const {username,password} = req.body;

    const sql =
    "SELECT * FROM users WHERE username=? AND password=?";

    db.query(sql,[username,password],(err,result)=>{

        if(err){
            console.log(err);
            return res.json({message:"error"});
        }

        if(result.length > 0){

            const user = result[0];

            res.json({
                message:"success",
                role:user.role,
                user_id:user.id
            });
        }
        else{
            res.json({message:"invalid"});
        }
    });
});


// REGISTER
app.post("/register",(req,res)=>{

    const {username,password,role} = req.body;

    const sql =
    "INSERT INTO users(username,password,role) VALUES(?,?,?)";

    db.query(sql,[username,password,role],(err,result)=>{

        if(err){
            console.log(err);
            return res.json({message:"error"});
        }

        res.json({message:"success"});
    });
});


// CREATE GOAL
app.post("/goals",(req,res)=>{

    const {

        user_id,
        goal_title,
        description,
        thrust_area,
        uom,
        target_value,
        weightage

    } = req.body;

    if(weightage < 10){

        return res.json({
            message:"Minimum weightage is 10%"
        });
    }

    const sql = `

    INSERT INTO goals

    (
        user_id,
        goal_title,
        description,
        thrust_area,
        uom,
        target_value,
        weightage
    )

    VALUES (?,?,?,?,?,?,?)

    `;

    db.query(sql,[

        user_id,
        goal_title,
        description,
        thrust_area,
        uom,
        target_value,
        weightage

    ],(err,result)=>{

        if(err){
            console.log(err);
            return res.json({message:"error"});
        }

        res.json({message:"success"});
    });
});


// FETCH USER GOALS
app.get("/goals/:user_id",(req,res)=>{

    const sql =
    "SELECT * FROM goals WHERE user_id=?";

    db.query(sql,[req.params.user_id],(err,result)=>{

        if(err){
            console.log(err);
            return res.json([]);
        }

        res.json(result);
    });
});


// FETCH ALL GOALS
app.get("/allgoals",(req,res)=>{

    const sql = "SELECT * FROM goals";

    db.query(sql,(err,result)=>{

        if(err){
            console.log(err);
            return res.json([]);
        }

        res.json(result);
    });
});


// APPROVE GOAL
app.put("/approve/:id",(req,res)=>{

    const sql =
    "UPDATE goals SET status='approved' WHERE id=?";

    db.query(sql,[req.params.id],(err,result)=>{

        if(err){
            console.log(err);
            return res.json({message:"error"});
        }

        res.json({message:"success"});
    });
});


// RETURN FOR REWORK
app.put("/rework/:id",(req,res)=>{

    const sql =
    "UPDATE goals SET status='rework' WHERE id=?";

    db.query(sql,[req.params.id],(err,result)=>{

        if(err){
            console.log(err);
            return res.json({message:"error"});
        }

        res.json({message:"rework"});
    });
});


// UPDATE GOAL
app.put("/updategoal/:id",(req,res)=>{

    const {target_value,weightage} = req.body;

    const sql = `

    UPDATE goals

    SET
    target_value=?,
    weightage=?

    WHERE id=?

    `;

    db.query(sql,[

        target_value,
        weightage,
        req.params.id

    ],(err,result)=>{

        if(err){
            console.log(err);
            return res.json({message:"error"});
        }

        res.json({message:"updated"});
    });
});


// CREATE SHARED GOAL
app.post("/createsharedgoal",(req,res)=>{

    const {

        primary_owner_id,
        goal_title,
        target_value

    } = req.body;

    const sql = `

    INSERT INTO shared_goals

    (
        primary_owner_id,
        goal_title,
        target_value
    )

    VALUES (?,?,?)

    `;

    db.query(sql,[

        primary_owner_id,
        goal_title,
        target_value

    ],(err,result)=>{

        if(err){
            console.log(err);
            return res.json({message:"error"});
        }

        res.json({

            message:"success",
            shared_goal_id:result.insertId
        });
    });
});


// ASSIGN GOAL
app.post("/assigngoal",(req,res)=>{

    const {

        shared_goal_id,
        employee_id,
        weightage

    } = req.body;

    const sql = `

    INSERT INTO shared_goal_assignments

    (
        shared_goal_id,
        employee_id,
        weightage
    )

    VALUES (?,?,?)

    `;

    db.query(sql,[

        shared_goal_id,
        employee_id,
        weightage

    ],(err,result)=>{

        if(err){
            console.log(err);
            return res.json({message:"error"});
        }

        res.json({
            message:"Goal Assigned"
        });
    });
});


// ASSIGNED EMPLOYEES
app.get("/assignedemployees",(req,res)=>{

    const sql = `

    SELECT

    users.id,
    users.username,
    shared_goals.goal_title

    FROM shared_goal_assignments

    JOIN users
    ON users.id =
    shared_goal_assignments.employee_id

    JOIN shared_goals
    ON shared_goals.id =
    shared_goal_assignments.shared_goal_id

    `;

    db.query(sql,(err,result)=>{

        if(err){
            console.log(err);
            return res.json([]);
        }

        res.json(result);
    });
});


// UNASSIGNED EMPLOYEES
app.get("/unassignedemployees",(req,res)=>{

    const sql = `

    SELECT *

    FROM users

    WHERE role='employee'

    AND id NOT IN (

        SELECT employee_id
        FROM shared_goal_assignments
    )

    `;

    db.query(sql,(err,result)=>{

        if(err){
            console.log(err);
            return res.json([]);
        }

        res.json(result);
    });
});


// QUARTERLY UPDATE
app.put("/updatequarter/:id",(req,res)=>{

    const {id} = req.params;

    const {

        actual_achievement,
        progress_status

    } = req.body;

    let progress_score = 0;

    if(progress_status === "Not Started"){
        progress_score = 0;
    }
    else if(progress_status === "On Track"){
        progress_score = 50;
    }
    else if(progress_status === "Completed"){
        progress_score = 100;
    }

    const sql = `

    UPDATE goals

    SET

    actual_achievement=?,
    progress_status=?,
    progress_score=?

    WHERE id=?

    `;

    db.query(sql,[

        actual_achievement,
        progress_status,
        progress_score,
        id

    ],(err,result)=>{

        if(err){
            console.log(err);
            return res.json({message:"error"});
        }

        res.json({
            message:"Quarterly Update Saved"
        });
    });
});


// MANAGER CHECK-IN
app.put("/checkin/:id",(req,res)=>{

    const {id} = req.params;

    const {manager_comment} = req.body;

    const sql = `

    UPDATE goals

    SET manager_comment=?

    WHERE id=?

    `;

    db.query(sql,[

        manager_comment,
        id

    ],(err,result)=>{

        if(err){
            console.log(err);
            return res.json({message:"error"});
        }

        res.json({
            message:"Check-in Saved"
        });
    });
});
//start serveradmin
// GET USERS
app.get("/users",(req,res)=>{

    const sql = "SELECT * FROM users";

    db.query(sql,(err,result)=>{

        if(err){
            return res.json({message:"error"});
        }

        res.json(result);
    });
});

// DELETE USER
app.delete("/deleteuser/:id",(req,res)=>{

    const sql = "DELETE FROM users WHERE id=?";

    db.query(sql,[req.params.id],(err,result)=>{

        if(err){
            return res.json({message:"error"});
        }

        res.json({
            message:"User Deleted"
        });
    });
});

// UNLOCK GOAL
app.put("/unlockgoal/:id",(req,res)=>{

    const sql = `
    UPDATE goals
    SET status='pending'
    WHERE id=?
    `;

    db.query(sql,[req.params.id],(err,result)=>{

        if(err){
            return res.json({message:"error"});
        }

        res.json({
            message:"Goal Unlocked"
        });
    });
});


app.listen(5000,()=>{

    console.log("Server Running On Port 5000");
});
