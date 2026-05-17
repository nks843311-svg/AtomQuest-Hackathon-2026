import { Link } from "react-router-dom";

import About from "./About";

import "./App.css";

function Home(){

    return(

        <div className="app">

            <nav className="navbar">

                <Link to="/">Home</Link>

                <Link to="/login">
                    Login
                </Link>

                <Link to="/register">
                    Registration
                </Link>

            </nav>

            <h1 className="title">
                In-House Goal Setting & Tracking Portal
            </h1>

            <About />

        </div>
    );
}

export default Home;