import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom"; 
import { ProjectContext } from "../../context/ProjectContext";

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(ProjectContext);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Delay to simulate auth check (e.g., from localStorage)
    const check = setTimeout(() => {
      setCheckingAuth(false);
    }, 100); // 100ms delay gives time for context to rehydrate

    return () => clearTimeout(check);
  }, []);

  if (checkingAuth) return null;  
  if (!token) return <Navigate to="/login" />;
  return children;
};

export default ProtectedRoute;
