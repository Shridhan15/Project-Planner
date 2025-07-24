// components/ProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { ProjectContext } from "../../context/ProjectContext";
 
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(ProjectContext);

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
