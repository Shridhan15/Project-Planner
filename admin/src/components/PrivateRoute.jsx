 import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';

const PrivateRoute = ({ children }) => {
  const { atoken } = useContext(AdminContext);

  return atoken ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
