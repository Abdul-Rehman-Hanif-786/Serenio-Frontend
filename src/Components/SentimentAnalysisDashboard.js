import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./SentimentAnalysisDashboard.css";
import api from "../api/axios";
import Loader from "./Loader";

const SentimentAnalysisDashboard = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [sentiment, setSentiment] = useState(null);
  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID provided. Please start a chat.");
      setLoading(false);
      return;
    }

    const fetchSentimentAnalysis = async () => {
      setLoading(true);
      setError("");
      try {
        const logsRes = await api.get(`/api/chatlogs/session/${sessionId}`);
        const chatLogs = logsRes.data;

        if (chatLogs.length === 0) {
          setError("No chat logs for this session. Please start a chat to generate analysis.");
          setSentiment("N/A");
          setRecommendation("");
          return;
        }

        const messages = chatLogs.map(log => ({
          role: "user",
          content: `${log.message} (Response: ${log.response})`
        }));

        const aiRes = await api.post("/api/openai/sentiment", { messages });
        setSentiment(aiRes.data.sentiment || "NEUTRAL");
        setRecommendation(aiRes.data.recommendation || "No recommendation available.");
      } catch (err) {
        console.error("Error fetching sentiment analysis:", err.response?.data || err.message);
        setError("Failed to load sentiment analysis. Please try again.");
        setSentiment("NEUTRAL");
        setRecommendation("No recommendation available due to error.");
      } finally {
        setLoading(false);
      }
    };

    fetchSentimentAnalysis();
  }, [sessionId]);

  const handleGenerateReport = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/report/session-report/${sessionId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to generate report");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Serenio_Report_${sessionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Report generation failed:", err.message);
      alert("Failed to generate report. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-50">
        <Loader size={40} />
      </div>
    );
  }

  return (
    <motion.div
      className="dashboard-home min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 p-8 font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="welcome-banner bg-[#1E2A47] text-[#E0E7FF] p-6 rounded-xl mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold mb-1">Sentiment Analysis Report</h2>
      </motion.div>

      {error && (
        <motion.p
          className="bg-red-100 text-red-800 p-3 rounded-md mb-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {error} {error.includes("No chat logs") && (
            <button
              onClick={() => navigate("/chatbot")}
              className="text-blue-600 underline ml-2"
            >
              Start Chat
            </button>
          )}
        </motion.p>
      )}

      <div className="dashboard-grid grid grid-cols-1 md:grid-cols-2 gap-6">
  <motion.div
    className="card uniform-card"
    whileHover={{ scale: 1.03 }}
    transition={{ duration: 0.3 }}
  >
    <h3 className="text-xl font-semibold text-center mb-4">Sentiment Overview</h3>
    <div className="text-center flex flex-col items-center justify-center flex-grow">
      <motion.span
        className="text-4xl font-bold text-[#1E2A47] mb-2"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {sentiment?.toUpperCase() || "N/A"}
      </motion.span>
      <p className="text-lg text-[#1E2A47]">Dominant Sentiment</p>
      <p className="text-gray-600 text-sm mt-2">Based on your recent chat logs</p>
    </div>
  </motion.div>

  <motion.div
    className="card uniform-card"
    whileHover={{ scale: 1.03 }}
    transition={{ duration: 0.3 }}
  >
    <h3 className="text-xl font-semibold text-center mb-4">Recommendation</h3>
    <div className="text-center flex flex-col items-center justify-center flex-grow px-2">
      <p className="text-gray-700 text-base leading-relaxed">{recommendation}</p>
    </div>
  </motion.div>
</div>

 <div className="button-wrapper flex flex-col items-center gap-4 mt-10">
  <motion.button
    onClick={handleGenerateReport}
    whileTap={{ scale: 0.96 }}
    whileHover={{ scale: 1.06 }}
    className="generate-report-btn"
  >
    Generate Report
  </motion.button>
</div>
    </motion.div>
  );
};

export default SentimentAnalysisDashboard;
