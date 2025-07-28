import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import api from "../api/axios";
import "./PsychologistDashboard.css";

const COLORS = ["#4CAF50", "#FF5722", "#FFC107", "#2196F3"];

const PsychologistDashboard = () => {
  const [availability, setAvailability] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookingStats, setBookingStats] = useState([]);
  const [revenueStats, setRevenueStats] = useState([]);
  const [statusStats, setStatusStats] = useState([]);

  useEffect(() => {
    fetchAvailability();
    fetchDashboardStats();
  }, []);

  const fetchAvailability = async () => {
    try {
      const res = await api.get("/api/psychologists/my-availability");
      setAvailability(res.data.dates);
    } catch (err) {
      console.error("Failed to fetch availability", err);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const res = await api.get("/api/psychologists/stats");
      setBookingStats(res.data.bookings);
      setRevenueStats(res.data.revenue);
      setStatusStats(res.data.status);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  const toggleAvailability = async (date) => {
    const dateStr = date.toISOString().split("T")[0];
    try {
      const res = await api.put("/api/psychologists/toggle-availability", { date: dateStr });
      setAvailability(res.data.dates);
    } catch (err) {
      console.error("Failed to update availability", err);
    }
  };

  const isAvailable = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return availability.includes(dateStr);
  };

  return (
    <motion.div
      className="psych-dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        Psychologist Dashboard
      </motion.h2>

      <motion.div
        className="dashboard-section"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h3>Manage Availability</h3>
        <Calendar
          value={selectedDate}
          onClickDay={(date) => {
            setSelectedDate(date);
            toggleAvailability(date);
          }}
          tileClassName={({ date }) =>
            isAvailable(date) ? "available-date" : "unavailable-date"
          }
        />
      </motion.div>

      <motion.div
        className="dashboard-section charts"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="chart-box">
          <h4>Weekly Bookings</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={bookingStats}>
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="bookings" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h4>Monthly Revenue</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueStats}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#2196F3" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h4>Appointment Status</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusStats} dataKey="value" nameKey="status" outerRadius={80}>
                {statusStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PsychologistDashboard;
