
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode"; // ✅ Correct import

//🔒 Function to check if token is expired
const isTokenExpired = (token) => {
  try {
    const { exp } = jwtDecode(token);
    return Date.now() >= exp * 1000;
  } catch (err) {
    return true; // Treat invalid tokens as expired
  }
};

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const expired = token ? isTokenExpired(token) : true;

  useEffect(() => {
    if (!token || expired) {
      toast.error("Session expired. Please login again.", {
        position: "top-center",
        autoClose: 4000,
      });
    }
  }, [location.pathname, token, expired]);

  // if (!token || expired) {
  //   localStorage.removeItem("token");
  //   return <Navigate to="/login" state={{ from: location }} replace />;
  // }

  return children;
};

export default PrivateRoute;