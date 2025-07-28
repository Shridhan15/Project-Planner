import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Users from "./pages/Users";
import Projects from "./pages/Projects";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<></>} />
        <Route path="/users" element={<Users />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </div>
  );
};

export default App;
