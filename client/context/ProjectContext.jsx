import React from "react";
import { createContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export const ProjectContext = createContext();
import dummyProjects from "../src/assets/assets";

const ProjectContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [projectsData, setProjectsData] = useState(dummyProjects);

  const navigate = useNavigate();

  const value = {
    backendUrl,
    token,
    setToken,
    navigate,
    projectsData,
    setProjectsData,
  };

  return (
    <ProjectContext.Provider value={value}>
      {props.children}
    </ProjectContext.Provider>
  );
};

export default ProjectContextProvider;
