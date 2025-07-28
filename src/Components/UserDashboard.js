// ✅ Animated Dashboard using Framer Motion
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";
import Loader from "./Loader";
import "./UserDashboard.css";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const DashboardHome = () => {
  const navigate = useNavigate();
  const [mood, setMood] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingAction, setLoadingAction] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [userAddLoading, setUserAddLoading] = useState(false);
  const [userRole, setUserRole] = useState("User");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoadingPage(true);
      setError("");
      try {
        const [moodRes, activityRes] = await Promise.all([
          api.get("/api/mood/stats"),
          api.get("/api/activity/recent"),
        ]);
        setMood(moodRes.data);
        setActivity(activityRes.data);
      } catch (err) {
        console.error("Error loading dashboard data:", err.response?.data || err.message);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoadingPage(false);
      }
    };

    const fetchUserRole = async () => {
      try {
        const res = await api.get("/api/profile");
        setUserRole(res.data.role || "User");
      } catch (err) {
        console.error("Error fetching user role:", err.response?.data || err.message);
        setError("Failed to load user role. Defaulting to 'User'.");
      }
    };

    fetchDashboardData();
    fetchUserRole();
  }, []);

  const handleNavigation = async (path, action) => {
    setLoadingAction(action);
    await new Promise((r) => setTimeout(r, 1000));
    setLoadingAction(null);
    navigate(path);
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      console.log("Exported!");
    } catch (err) {
      console.error("Export failed:", err);
      setError("Failed to export data.");
    } finally {
      setExportLoading(false);
    }
  };

  const handleAddUser = async () => {
    setUserAddLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      console.log("User added!");
    } catch (err) {
      console.error("Add user failed:", err);
      setError("Failed to add user.");
    } finally {
      setUserAddLoading(false);
    }
  };

  if (loadingPage) {
    return (
      <div className="full-page-loader">
        <Loader size={40} />
      </div>
    );
  }

  return (
    <motion.div
      className="dashboard-home"
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={{ duration: 0.6 }}
    >
      <motion.div className="welcome-banner" variants={fadeInUp} transition={{ duration: 0.5 }}>
        <h2>Welcome back 👋</h2>
        <p>How are you feeling today? Let's check in on your mental wellness journey.</p>
      </motion.div>

      {error && <p className="error-message">{error}</p>}

      <div className="dashboard-grid">
        <motion.div className="mood-tracker card" variants={fadeInUp} transition={{ delay: 0.1 }}>
          <h3>Mood Tracker</h3>
          <div className="circle">
            <span className="percent">{mood?.percentage || "..."}</span>
            <span className="status">{mood?.status || "Loading..."}</span>
          </div>
          <p>{mood?.message || "Tracking your mood..."}</p>
        </motion.div>

        <motion.div className="quick-actions card" variants={fadeInUp} transition={{ delay: 0.2 }}>
          <h3>Quick Actions</h3>
          <div className="actions">
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              disabled={loadingAction === "chat"}
              onClick={() => handleNavigation("/chatbot", "chat")}
            >
              {loadingAction === "chat" ? <Loader size={16} /> : "💬 Chat with Bot"}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              disabled={loadingAction === "book"}
              onClick={() => handleNavigation("/Professionals", "book")}
            >
              {loadingAction === "book" ? <Loader size={16} /> : "📅 Book Appointment"}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              disabled={loadingAction === "report"}
              onClick={() => handleNavigation("/sentimentAnalysisDashboard", "report")}
            >
              {loadingAction === "report" ? <Loader size={16} /> : "📊 Generate Report"}
            </motion.button>
            {userRole === "Psychologist" && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                disabled={loadingAction === "profile"}
                onClick={() => handleNavigation("/psychologist-profile", "profile")}
              >
                {loadingAction === "profile" ? <Loader size={16} /> : "📝 Update Profile"}
              </motion.button>
            )}
          </div>
        </motion.div>

        <motion.div className="extra-actions card" variants={fadeInUp} transition={{ delay: 0.3 }}>
          <h3>Admin Tools</h3>
          <div className="actions admin-tool-actions">
            <motion.button
              className="admin-btn export-btn"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              disabled={exportLoading}
              onClick={handleExport}
            >
              {exportLoading ? <Loader size={16} /> : "⬇️ Export Data"}
            </motion.button>
            <motion.button
              className="admin-btn add-user-btn"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              disabled={userAddLoading}
              onClick={handleAddUser}
            >
              {userAddLoading ? <Loader size={16} /> : "➕ Add User"}
            </motion.button>
          </div>
        </motion.div>

        <motion.div className="recent-activity card" variants={fadeInUp} transition={{ delay: 0.4 }}>
          <h3>Recent Activity</h3>
          <ul>
            {activity.map((item, i) => (
              <motion.li key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
                {item.action} <span>{item.time}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardHome;
