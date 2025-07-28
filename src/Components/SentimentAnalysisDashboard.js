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
    const fetchSentimentAnalysis = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get(`/api/sentimentAnalysis/session/${sessionId}`);
        setSentiment(response.data.sentiment || "NEUTRAL");
        setRecommendation(response.data.recommendation || "No recommendation available.");
      } catch (err) {
        console.error("Error fetching sentiment analysis:", err.response?.data || err.message);
        setError("Failed to load sentiment analysis. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSentimentAnalysis();
  }, [sessionId]);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      const response = await api.get(`/api/sentimentAnalysis/session/${sessionId}`);
      setSentiment(response.data.sentiment || "NEUTRAL");
      setRecommendation(response.data.recommendation || "No recommendation available.");
      setError("");
    } catch (err) {
      console.error("Refresh error:", err.response?.data || err.message);
      setError("Failed to refresh data.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Session ID before fetch:", sessionId);
      const response = await fetch(`http://localhost:5000/api/report/session-report/1f6895f2-6b6c-4be0-8f3e-2e00fa1f6414`, {
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
        <h2 className="text-2xl font-semibold mb-2">Sentiment Analysis Report</h2>
        <p className="text-lg">Insights from your session: {sessionId}</p>
      </motion.div>

      {error && (
        <motion.p
          className="bg-red-100 text-red-800 p-3 rounded-md mb-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {error}
        </motion.p>
      )}

      <div className="dashboard-grid grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          className="sentiment-stats card bg-white p-6 rounded-xl shadow-md"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-xl font-medium mb-4">Sentiment Overview</h3>
          <div className="circle flex flex-col items-center text-center mb-4">
            <motion.span
              className="percent text-4xl font-bold text-[#1E2A47]"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {sentiment?.toUpperCase() || "N/A"}
            </motion.span>
            <span className="status text-lg text-[#1E2A47]">Dominant Sentiment</span>
          </div>
          <p className="text-gray-600 text-center">Based on your recent chat logs.</p>
        </motion.div>

        <motion.div
          className="recommendation card bg-white p-6 rounded-xl shadow-md"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-xl font-medium mb-4">Recommendation</h3>
          <p className="text-gray-600 mb-4">{recommendation}</p>
          <a
            href={recommendation.match(/https?:\/\/[^\s]+/)?.[0] || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1E2A47] underline hover:text-opacity-80 transition-colors"
          >
            Visit Resource
          </a>
        </motion.div>
      </div>

      <div className="button-wrapper flex flex-col items-center gap-4 mt-10">
        <motion.button
          onClick={handleRefresh}
          disabled={loading}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          className="bg-[#1E2A47] text-[#E0E7FF] py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform disabled:opacity-50"
        >
          {loading ? <Loader size={16} /> : "Refresh Analysis"}
        </motion.button>

        <motion.button
          onClick={handleGenerateReport}
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.06 }}
          className="generate-report-btn bg-[#4F46E5] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#4338CA] transition duration-200"
        >
          Generate Report
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SentimentAnalysisDashboard;
