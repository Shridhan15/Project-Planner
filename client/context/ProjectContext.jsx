import React from "react";
import { createContext } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
export const ProjectContext = createContext();
import dummyProjects from "../src/assets/assets";
import axios from "axios";

const ProjectContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [projectsData, setProjectsData] = useState(dummyProjects);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  const getAllProjects = async () => {
    try {
      const respose = await axios.get(backendUrl + "/api/project/getprojects");
      if (respose.data.success) {
        setProjectsData(respose.data.projects);
      } else {
        console.error("Failed to fetch projects:", respose.data.message);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const value = {
    backendUrl,
    token,
    setToken,
    navigate,
    projectsData,
    setProjectsData,
    getAllProjects,
    isAuthenticated,
    setIsAuthenticated,
    login,
    logout,
  };

  return (
    <ProjectContext.Provider value={value}>
      {props.children}
    </ProjectContext.Provider>
  );
};

export default ProjectContextProvider;
