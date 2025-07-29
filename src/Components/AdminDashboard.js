import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { motion } from "framer-motion";
import Loader from "./Loader";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [data, setData] = useState({
    chatLogs: [],
    appointments: [],
    transactions: [],
    payments: [],
    psychologists: [],
    users: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleLogin = async () => {
    try {
      const res = await axios.post("/api/admin/simple-dashboard", {
        email: credentials.email,
        password: credentials.password,
      });
      setData(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError(err.response?.data?.message || "Failed to load dashboard data. Ensure correct admin credentials.");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="admin-login-container">
        <h2>Admin Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={credentials.email}
          onChange={handleChange}
          className="admin-login-input"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          className="admin-login-input"
        />
        <button onClick={handleLogin} className="admin-login-button">
          Login
        </button>
        {error && <p className="error-message">{error}</p>}
      </div>
    );
  }

  return (
    <motion.div
      className="admin-dashboard-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        Admin Dashboard
      </motion.h1>

      <section className="dashboard-section">
        <h2>Users</h2>
        {data.users.length === 0 ? (
          <p>No users available.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{new Date(user.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="dashboard-section">
        <h2>Chat Logs</h2>
        {data.chatLogs.length === 0 ? (
          <p>No chat logs available.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Session ID</th>
                <th>Message</th>
                <th>Response</th>
                <th>Sentiment</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.chatLogs.map((log) => (
                <tr key={log._id}>
                  <td>{log.userId?.name || "Unknown"}</td>
                  <td>{log.sessionId}</td>
                  <td>{log.message}</td>
                  <td>{log.response?.text || "N/A"}</td>
                  <td>{log.sentiment || "N/A"}</td>
                  <td>{new Date(log.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="dashboard-section">
        <h2>Appointments</h2>
        {data.appointments.length === 0 ? (
          <p>No appointments available.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Psychologist</th>
                <th>Date</th>
                <th>Time</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {data.appointments.map((appt) => (
                <tr key={appt._id}>
                  <td>{appt.userId?.name || "Unknown"}</td>
                  <td>{appt.psychologistId?.name || "Unknown"} ({appt.psychologistId?.specialization})</td>
                  <td>{appt.date}</td>
                  <td>{appt.timeSlot}</td>
                  <td>{appt.reason || "N/A"}</td>
                  <td>{appt.status}</td>
                  <td>{appt.paymentId?.paymentStatus || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="dashboard-section">
        <h2>Transactions</h2>
        {data.transactions.length === 0 ? (
          <p>No transactions available.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Stripe Payment ID</th>
                <th>Amount (PKR)</th>
                <th>Currency</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.transactions.map((tx) => (
                <tr key={tx._id}>
                  <td>{tx.userId?.name || "Unknown"}</td>
                  <td>{tx.stripePaymentId}</td>
                  <td>{(tx.amount / 100).toFixed(2)}</td>
                  <td>{tx.currency.toUpperCase()}</td>
                  <td>{tx.status}</td>
                  <td>{new Date(tx.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="dashboard-section">
        <h2>Payments</h2>
        {data.payments.length === 0 ? (
          <p>No payments available.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Appointment</th>
                <th>Amount (PKR)</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.payments.map((payment) => (
                <tr key={payment._id}>
                  <td>{payment.userId?.name || "Unknown"}</td>
                  <td>{payment.appointmentId ? `${payment.appointmentId.date} ${payment.appointmentId.timeSlot}` : "N/A"}</td>
                  <td>{payment.amount.toFixed(2)}</td>
                  <td>{payment.paymentMethod}</td>
                  <td>{payment.paymentStatus}</td>
                  <td>{new Date(payment.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="dashboard-section">
        <h2>Psychologists</h2>
        {data.psychologists.length === 0 ? (
          <p>No psychologists available.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Specialization</th>
                <th>Hourly Rate (PKR)</th>
                <th>Experience</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {data.psychologists.map((psy) => (
                <tr key={psy._id}>
                  <td>{psy.name}</td>
                  <td>{psy.specialization}</td>
                  <td>{psy.hourlyRate.toFixed(2)}</td>
                  <td>{psy.experience || "N/A"}</td>
                  <td>{psy.rating || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </motion.div>
  );
};

export default AdminDashboard;