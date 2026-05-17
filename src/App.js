import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import About from "./About";

import Employee from "./Employee";
import Manager from "./Manager";
import Admin from "./Admin";

function App(){

  return(

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/about" element={<About />} />

        <Route path="/employee" element={<Employee />} />

        <Route path="/manager" element={<Manager />} />

        <Route path="/admin" element={<Admin />} />

      </Routes>

    </BrowserRouter>

  );
}

export default App;