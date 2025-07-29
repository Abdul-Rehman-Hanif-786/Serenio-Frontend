
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import api from "../api/axios";
import Loader from "./Loader";
import "./UserDashboard.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const slideIn = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const scaleUp = {
  hover: { scale: 1.05, transition: { duration: 0.3, ease: "easeInOut" } },
  tap: { scale: 0.95 },
};

const DashboardHome = () => {
  const navigate = useNavigate();
  const [mood, setMood] = useState(null);
  const [activity, setActivity] = useState([]);
  const [psychologists, setPsychologists] = useState([]);
  const [sessionInsights, setSessionInsights] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingAction, setLoadingAction] = useState(null);
  const [userRole, setUserRole] = useState("User");
  const [error, setError] = useState("");
  const [sessionId] = useState(localStorage.getItem("serenioSessionId") || "");
  const [hasChatLogs, setHasChatLogs] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoadingPage(true);
      try {
        const [moodRes, activityRes, psychRes, insightsRes] = await Promise.all([
          api.get("/api/dashboard/mood/stats").catch((err) => {
            console.error("Mood stats error:", err.response?.status, err.response?.data);
            return { data: null };
          }),
          api.get("/api/dashboard/activity/recent").catch((err) => {
            console.error("Activity error:", err.response?.status, err.response?.data);
            return { data: [] };
          }),
          api.get("/api/dashboard/psychologists/top").catch((err) => {
            console.error("Psychologists error:", err.response?.status, err.response?.data);
            return { data: [] };
          }),
          api.get("/api/dashboard/sessions/insights").catch((err) => {
            console.error("Insights error:", err.response?.status, err.response?.data);
            return { data: null };
          }),
        ]);
        setMood(moodRes.data);
        setActivity(activityRes.data);
        setPsychologists(psychRes.data);
        setSessionInsights(insightsRes.data);
      } catch (err) {
        console.error("Dashboard data error:", err.message);
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
        console.error("User role error:", err.response?.status, err.response?.data);
        setError("Failed to load user role. Defaulting to 'User'.");
      }
    };

    const checkChatLogs = async () => {
      if (sessionId) {
        try {
          const response = await api.get(`/api/chatlogs/session/${sessionId}`);
          setHasChatLogs(response.data.length > 0);
        } catch (error) {
          console.error("Error checking chat logs:", error.response?.data || error.message);
          setHasChatLogs(false);
        }
      }
    };

    fetchDashboardData();
    fetchUserRole();
    checkChatLogs();
  }, [sessionId]);

  const handleNavigation = async (path, action) => {
    setLoadingAction(action);
    await new Promise((r) => setTimeout(r, 1000));
    setLoadingAction(null);
    if (path.includes("sentimentAnalysisDashboard") && !hasChatLogs) {
      alert("Please start a chat first to generate analysis.");
      navigate("/chatbot");
    } else {
      navigate(path);
    }
  };

  const moodHistogramData = {
    labels: ["Positive", "Neutral", "Negative"],
    datasets: [
      {
        label: "Mood Count",
        data: [
          mood?.history?.filter((m) => m.sentiment === "positive")?.length || 0,
          mood?.history?.filter((m) => m.sentiment === "neutral")?.length || 0,
          mood?.history?.filter((m) => m.sentiment === "negative")?.length || 0,
        ],
        backgroundColor: ["#2ecc71", "#f1c40f", "#e74c3c"],
        borderColor: ["#27ae60", "#f39c12", "#c0392b"],
        borderWidth: 1,
      },
    ],
  };

  const histogramOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Mood Distribution (Last 30 Days)", font: { family: "DM Sans", size: 16 } },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Count", font: { family: "DM Sans" } } },
      x: { title: { display: true, text: "Sentiment", font: { family: "DM Sans" } } },
    },
  };

  if (loadingPage) {
    return (
      <div className="full-page-loader">
        <Loader size={40} />
      </div>
    );
  }

  return (
    <motion.div className="dashboard-home" initial="hidden" animate="visible" variants={fadeInUp}>
      <motion.div className="welcome-banner" variants={fadeInUp}>
        <h2>Welcome back,👋</h2>
        <p>How are you feeling today? Let’s check in on your mental wellness journey!</p>
      </motion.div>

      <motion.div className="quick-actions card" variants={slideIn}>
        <h3>Quick Actions</h3>
        <div className="actions">
          <motion.button whileHover="hover" whileTap="tap" variants={scaleUp} disabled={loadingAction === "chat"} onClick={() => handleNavigation("/chatbot", "chat")}>💬 Chat with Bot</motion.button>
          <motion.button whileHover="hover" whileTap="tap" variants={scaleUp} disabled={loadingAction === "book"} onClick={() => handleNavigation("/Professionals", "book")}>📅 Book Appointment</motion.button>
          <motion.button whileHover="hover" whileTap="tap" variants={scaleUp} disabled={loadingAction === "report"} onClick={() => handleNavigation("/sentimentAnalysisDashboard/:sessionId", "report")}>📊 Generate Report</motion.button>
          {userRole === "Psychologist" && (
            <motion.button whileHover="hover" whileTap="tap" variants={scaleUp} disabled={loadingAction === "profile"} onClick={() => handleNavigation("/psychologist-profile", "profile")}>📝 Update Profile</motion.button>
          )}
        </div>
      </motion.div>

      <div className="dashboard-grid">
        <motion.div className="mood-tracker card" variants={fadeInUp}>
          <div className="header-row">
            <h3>Mood Tracker 😊</h3>
            <motion.button whileHover="hover" whileTap="tap" variants={scaleUp} onClick={() => handleNavigation("/mood-tracker")}>Log Mood</motion.button>
          </div>
          <div className="mood-histogram">
            <Bar data={moodHistogramData} options={histogramOptions} />
          </div>
          <p>Current Mood: <strong>{mood?.status || "Loading..."}</strong> ({mood?.percentage || "..."}% Positive)</p>
          {mood && mood.history ? (
            mood.history.length === 0 ? (
              <p>No mood entries yet. Start by logging your mood today!</p>
            ) : (
              <ul className="mood-history">
                <AnimatePresence>
                  {mood.history.slice(0, 7).map((day, i) => (
                    <motion.li key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.1 }}>
                      {day.date}: {day.sentiment}
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )
          ) : (
            <p>No mood data available. Log a mood to get started!</p>
          )}
        </motion.div>

        <motion.div className="psychologist-preview card scrollable-card" variants={slideIn}>
          <div className="header-row">
            <h3>Psychologist Marketplace</h3>
            <motion.button whileHover="hover" whileTap="tap" variants={scaleUp} onClick={() => handleNavigation("/professionals")}>View All</motion.button>
          </div>
          <div className="psychologist-list">
            <AnimatePresence>
              {psychologists.length === 0 ? (
                <p>No psychologists available at the moment.</p>
              ) : (
                psychologists.map((psych, i) => (
                  <motion.div key={i} className="psychologist-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.1 }}>
                    <strong>{psych.name}</strong> <br />
                    {psych.specialization}<br />
                    ⭐ {psych.rating} | PKR {psych.hourlyRate}/hr
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div className="recent-activity card" variants={fadeInUp}>
          <h3>Recent Activity</h3>
          {activity.length === 0 ? (
            <p>No recent activity yet.</p>
          ) : (
            <ul>
              <AnimatePresence>
                {activity.map((item, i) => (
                  <motion.li key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.1 }}>
                    {item.type === "session" && `Session on ${item.time} - Sentiment: ${item.sentiment}`}
                    {item.type === "appointment" && `Booked with ${item.psychologist} on ${item.time}`}
                    {item.type === "payment" && `Payment of PKR ${item.amount} - ${item.status}`}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </motion.div>

        <motion.div className="session-insights card" variants={fadeInUp}>
          <h3>Session Insights</h3>
          <p>
            Total Sessions: {sessionInsights?.total || 0}<br />
            Avg Rating: {sessionInsights?.averageRating || 0}<br />
            Latest Tip: {sessionInsights?.latestRecommendation || "N/A"}
          </p>
        </motion.div>
      </div>
      {error && <p className="error-message">{error}</p>}
    </motion.div>
  );
};

export default DashboardHome;
