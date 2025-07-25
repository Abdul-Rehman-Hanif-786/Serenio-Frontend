import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";
import { FaEye, FaEyeSlash, FaGoogle, FaFacebookF } from "react-icons/fa";
import api from "../api/axios";
import Loader from "./Loader";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async () => {
    setError("");

    if (!email.trim()) {
      toast.error("Email is required.", { position: "top-center", autoClose: 3000 });
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Enter a valid email address.", { position: "top-center", autoClose: 3000 });
      return;
    }

    if (!password.trim()) {
      toast.error("Password is required.", { position: "top-center", autoClose: 3000 });
      return;
    }

    const rememberMe = document.getElementById("rememberMeCheckbox").checked;
    if (!rememberMe) {
      toast.warn("Please check 'Remember me' before logging in.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/login", { email, password });
      const { token, role } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      toast.success("Login successful!", {
        position: "top-center",
        autoClose: 3000,
      });

      setTimeout(() => {
        if (role === "admin") {
          navigate("/AdminDashboard");
        } else {
          navigate("/UserDashboard");
        }
      }, 1500);
    } catch (err) {
      const message = err.response?.data?.message || "Login failed. Please try again.";
      setError(message);

      if (message.toLowerCase().includes("email")) {
        toast.error("Email not found. Please sign up first.", { position: "top-center" });
      } else if (message.toLowerCase().includes("password")) {
        toast.error("Incorrect password. Please try again.", { position: "top-center" });
      } else {
        toast.error(message, { position: "top-center" });
      }
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return <Loader />;

  return (
    <div className="login-wrapper">
      <ToastContainer theme="colored" position="top-center" autoClose={5000} />

      <div className="login-card">
        <h2 className="login-title">
          <img src={require("../assets/signupLogo.png")} alt="logo" className="logo-img" />
        </h2>
        <p className="login-subtitle">Please sign in to your account</p>

        <input
          type="email"
          className="login-input"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            className="login-input"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="eye-icon" onClick={() => setShowPassword((prev) => !prev)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="login-options">
          <label>
            <input type="checkbox" id="rememberMeCheckbox" /> Remember me
          </label>
          <Link to="/forgot" className="forgot-link">
            Forgot Password?
          </Link>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <button className="login-button" onClick={handleLogin}>
            Log In
          </button>
        )}

        <div className="divider">or</div>

        <button className="social-button google">
          <FaGoogle className="social-icon" />
          Continue with Google
        </button>

        <button className="social-button facebook">
          <FaFacebookF className="social-icon" />
          Continue with Facebook
        </button>

        <p className="signup-text">
          Don’t have an account?{" "}
          <Link to="/signup" className="signup-link">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
