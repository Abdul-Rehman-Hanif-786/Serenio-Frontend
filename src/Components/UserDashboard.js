import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Loader from "./Loader"; // Ensure Loader supports a `size` prop
import "./UserDashboard.css";

const DashboardHome = () => {
  const navigate = useNavigate();

  const [mood, setMood] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loadingPage, setLoadingPage] = useState(true);          // Full page loader
  const [loadingAction, setLoadingAction] = useState(null);      // For chat/book/report
  const [exportLoading, setExportLoading] = useState(false);     // For export button
  const [userAddLoading, setUserAddLoading] = useState(false);   // For add user button
  const [userRole, setUserRole] = useState("User");             // User role state

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoadingPage(true);
      try {
        const [moodRes, appointmentRes, activityRes] = await Promise.all([
          api.get("/api/mood/stats"),
          api.get("/api/appointments/upcoming"),
          api.get("/api/activity/recent"),
        ]);
        setMood(moodRes.data);
        setAppointments(appointmentRes.data);
        setActivity(activityRes.data);
      } catch (err) {
        console.error("Error loading dashboard data", err);
      } finally {
        setLoadingPage(false);
      }
    };

    const fetchUserRole = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const res = await api.get(`/api/users/${userId}`);
        setUserRole(res.data.role || "User");
      } catch (err) {
        console.error("Error fetching user role:", err);
      }
    };

    fetchDashboardData();
    fetchUserRole();
  }, []);

  const handleNavigation = async (path, action) => {
    setLoadingAction(action);
    await new Promise((r) => setTimeout(r, 1000)); // simulate loading
    setLoadingAction(null);
    navigate(path);
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000)); // simulate export
      // TODO: Add actual export logic
      console.log("Exported!");
    } catch (err) {
      console.error("Export failed", err);
    } finally {
      setExportLoading(false);
    }
  };

  const handleAddUser = async () => {
    setUserAddLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000)); // simulate add user
      // TODO: Add actual user add logic
      console.log("User added!");
    } catch (err) {
      console.error("Add user failed", err);
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
    <div className="dashboard-home">
      <div className="welcome-banner">
        <h2>Welcome back 👋</h2>
        <p>How are you feeling today? Let's check in on your mental wellness journey.</p>
      </div>

      <div className="dashboard-grid">
        {/* Mood Tracker */}
        <div className="mood-tracker card">
          <h3>Mood Tracker</h3>
          <div className="circle">
            <span className="percent">{mood?.percentage || "..."}</span>
            <span className="status">{mood?.status || "Loading..."}</span>
          </div>
          <p>{mood?.message || "Tracking your mood..."}</p>
        </div>

        {/* Upcoming Appointments */}
        <div className="appointments card">
          <h3>Upcoming Appointments</h3>
          {appointments.map((a, i) => (
            <div className="appointment" key={i}>
              <p>
                <strong>{a.doctor}</strong><br />
                <span>{a.specialty}</span>
              </p>
              <p>📅 {a.date} | 🕑 {a.time}</p>
              <button className={a.status === "Scheduled" ? "scheduled-btn" : "join-btn"}>
                {a.status}
              </button>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions card">
          <h3>Quick Actions</h3>
          <div className="actions">
            <button
              disabled={loadingAction === "chat"}
              onClick={() => handleNavigation("/chatbot", "chat")}
            >
              {loadingAction === "chat" ? <Loader size={16} /> : "💬 Chat with Bot"}
            </button>
            <button
              disabled={loadingAction === "book"}
              onClick={() => handleNavigation("/Professionals", "book")}
            >
              {loadingAction === "book" ? <Loader size={16} /> : "📅 Book Appointment"}
            </button>
            <button
              disabled={loadingAction === "report"}
              onClick={() => handleNavigation("/sentimentAnalysis", "report")}
            >
              {loadingAction === "report" ? <Loader size={16} /> : "📊 Generate Report"}
            </button>
            {userRole === "Psychologist" && (
              <button
                disabled={loadingAction === "profile"}
                onClick={() => handleNavigation("/psychologist-profile", "profile")}
              >
                {loadingAction === "profile" ? <Loader size={16} /> : "📝 Update Profile"}
              </button>
            )}
          </div>
        </div>

        {/* Admin Tools: Export + Add User */}
        <div className="extra-actions card">
          <h3>Admin Tools</h3>
          <div className="actions admin-tool-actions">
            <button
              className="admin-btn export-btn"
              disabled={exportLoading}
              onClick={handleExport}
            >
              {exportLoading ? <Loader size={16} /> : "⬇️ Export Data"}
            </button>
            <button
              className="admin-btn add-user-btn"
              disabled={userAddLoading}
              onClick={handleAddUser}
            >
              {userAddLoading ? <Loader size={16} /> : "➕ Add User"}
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="recent-activity card">
          <h3>Recent Activity</h3>
          <ul>
            {activity.map((item, i) => (
              <li key={i}>
                {item.action} <span>{item.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;