import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from "./Components/Navbar";
import Index from "./Components/Index";
import Login from "./Components/Login";
import AdminDashboard from "./Components/AdminDashboard";
import Signup from "./Components/Signup";
import SentimentAnalysis from "./Components/SentimentAnalysis";
import Professionals from "./Components/Professionals";
import PaymentForm from "./Components/PaymentForm";
import Chatbot from "./Components/Chatbot";
import Profile from "./Components/Profile";
import UserDashboard from "./Components/UserDashboard";
import Loader from "./Components/Loader";
import PrivateRoute from "./Components/PrivateRoute";
import Logs from "./Components/Logs";

// ✅ Layout Wrapper to conditionally show Navbar
const Layout = ({ children }) => {
  const location = useLocation();

  // Only show Navbar on these routes:
  const showNavbar = ["/", "/login", "/signup"].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/AdminDashboard"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/UserDashboard"
            element={
              <PrivateRoute>
                <UserDashboard />
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
      </Layout>
    </Router>
  );
};

export default App;
