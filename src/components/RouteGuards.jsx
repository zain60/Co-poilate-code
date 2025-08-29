import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// PrivateRoute: Only accessible if the user is authenticated
export const PrivateRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  console.log('guard token :', token)
  if (!token) {
    // Redirect to the login page if not authenticated
    return <Navigate to="/" replace />;
  }

  return children;
};

// PublicRoute: Only accessible if the user is not authenticated
export const PublicRoute = ({ children, noRedirect = false }) => {
  const token = useSelector((state) => state.auth.token);

  if (token && !noRedirect) {
    // Redirect to the home page if already authenticated, unless noRedirect is true
    return <Navigate to="/home" replace />;
  }

  return children;
};