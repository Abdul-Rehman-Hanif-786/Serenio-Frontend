import React, { useEffect, useState } from "react";
import "./SentimentAnalysis.css";
import api from "../api/axios";
import Loader from "./Loader"; // ✅ spinner import

const SentimentReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get("/api/sentiment-report");
        setReport(res.data);
      } catch (err) {
        console.error("Error fetching sentiment report:", err);
        setError("Failed to load sentiment report.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading) return <Loader />; // ✅ show spinner while loading
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="report-container">
      <h1 className="report-title">Sentiment Analysis Report</h1>
      <p className="report-subtitle">
        Your emotional journey summary for the past 30 days<br />
        <span className="report-date">Generated on {new Date().toDateString()}</span>
      </p>

      {/* Sentiment Distribution */}
      <div className="card">
        <h2 className="section-title">Sentiment Distribution</h2>
        <p className="section-subtitle">Overview of your emotional patterns</p>
        <img
          src="/sentiment-chart-placeholder.png"
          alt="Sentiment Chart"
          className="chart-image"
        />
        <div className="stats-row">
          <p>Positive: {report.positive}%</p>
          <p>Neutral: {report.neutral}%</p>
          <p>Negative: {report.negative}%</p>
        </div>
      </div>

      {/* Session Summary */}
      <div className="grid-two">
        <div className="card">
          <h2 className="section-title">🧠 Overall Tone Analysis</h2>
          <p className="section-text">{report.toneAnalysis}</p>
        </div>
        <div className="card">
          <h2 className="section-title">📊 Session Frequency</h2>
          <ul className="section-list">
            <li>Total Sessions: <strong>{report.totalSessions}</strong></li>
            <li>Average per Week: <strong>{report.averagePerWeek}</strong></li>
            <li>Longest Streak: <strong>{report.longestStreak}</strong></li>
            <li>Most Active Time: <strong>{report.mostActiveTime}</strong></li>
          </ul>
        </div>
      </div>

      {/* Key Insights */}
      <div className="card">
        <h2 className="section-title">🔍 Key Insights</h2>
        <div className="grid-three">
          <div className="insight-box green">
            <strong>Improvement:</strong><br />
            {report.insights.improvement}
          </div>
          <div className="insight-box blue">
            <strong>Consistency:</strong><br />
            {report.insights.consistency}
          </div>
          <div className="insight-box purple">
            <strong>Milestone:</strong><br />
            {report.insights.milestone}
          </div>
        </div>
      </div>

      <div className="button-wrapper">
        <button className="download-button">📄 Download Report (PDF)</button>
      </div>

      <p className="footer-text">
        Complete report with detailed analysis and recommendations
      </p>
    </div>
  );
};

export default SentimentReport;
