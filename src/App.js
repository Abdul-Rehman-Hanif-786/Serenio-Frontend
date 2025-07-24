import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from "./Components/Navbar";
import Index from "./Components/Index";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import Signup from "./Components/Signup";
import SentimentAnalysis from "./Components/SentimentAnalysis";
import Professionals from "./Components/Professionals";
import PaymentForm from "./Components/PaymentForm";
import Chatbot from "./Components/Chatbot";
import Profile from "./Components/Profile";
import DashboardHome from "./Components/DashboardHome";
import Loader from "./Components/Loader";
import PrivateRoute from "./Components/PrivateRoute";

// ✅ Import Logs Component
import Logs from "./Components/Logs";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* ✅ Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/DashboardHome"
          element={
            <PrivateRoute>
              <DashboardHome />
            </PrivateRoute>
          }
        />
        <Route
          path="/Chatbot"
          element={
            <PrivateRoute>
              <Chatbot />
            </PrivateRoute>
          }
        />
        <Route
          path="/SentimentAnalysis"
          element={
            <PrivateRoute>
              <SentimentAnalysis />
            </PrivateRoute>
          }
        />
        <Route
          path="/Professionals"
          element={
            <PrivateRoute>
              <Professionals />
            </PrivateRoute>
          }
        />
        <Route
          path="/PaymentForm"
          element={
            <PrivateRoute>
              <PaymentForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/Profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* ✅ New Logs Route */}
        <Route
          path="/Logs"
          element={
            <PrivateRoute>
              <Logs />
            </PrivateRoute>
          }
        />

        <Route path="/Loader" element={<Loader />} />
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Router>
  );
};

export default App;
