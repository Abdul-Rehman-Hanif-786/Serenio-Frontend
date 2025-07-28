// ✅ Animated AppointmentForm.js using Framer Motion
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "../api/axios";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import "./AppointmentForm.css";

const AppointmentForm = () => {
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [form, setForm] = useState({ psychologistId: "", date: "", time: "", reason: "" });
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [psychologist, setPsychologist] = useState(null);
  const [price, setPrice] = useState(0);

  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const { psychologistId, date, timeSlot } = location.state || {};

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await axios.get("/api/appointments/available-slots");
        setSlots(res.data);
      } catch (err) {
        console.error("Failed to fetch available slots");
      }
    };
    fetchSlots();
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get("/api/appointments/my");
        setAppointments(res.data.appointments);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
      }
    };
    fetchAppointments();
  }, []);

  useEffect(() => {
    const fetchPsychologist = async () => {
      try {
        const res = await axios.get(`/api/psychologists/${psychologistId}`);
        setPsychologist(res.data);
        setPrice(res.data.hourlyRate * 100);
      } catch (err) {
        console.error("Failed to fetch psychologist data", err);
      }
    };
    if (psychologistId) fetchPsychologist();
  }, [psychologistId]);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      psychologistId: psychologistId || prev.psychologistId,
      date: date || prev.date,
      time: timeSlot || prev.time,
    }));

    const slot = slots.find((s) => s.date === (date || selectedDate));
    setAvailableTimes(slot ? slot.times : []);
  }, [selectedDate, slots, psychologistId, date, timeSlot]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.psychologistId || !form.date || !form.time) {
      setMessage("Please fill all required fields.");
      return;
    }

    if (!stripe || !elements) {
      setMessage("Stripe not loaded yet.");
      return;
    }

    try {
      setLoading(true);
      const paymentRes = await axios.post("/api/payment/create-payment-intent", {
        amount: 10000,
        currency: "pkr",
      });
      const clientSecret = paymentRes.data.clientSecret;
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) {
        setMessage("❌ Payment failed: " + result.error.message);
        return;
      }
      if (result.paymentIntent.status !== "succeeded") {
        setMessage("❌ Payment was not successful.");
        return;
      }

      await axios.post("/api/appointments/book", {
        psychologistId: form.psychologistId,
        date: form.date,
        timeSlot: form.time,
        reason: form.reason,
      });

      setMessage("✅ Appointment booked and payment confirmed!");
      const res = await axios.get("/api/appointments/my");
      setAppointments(res.data.appointments);
      setForm({ psychologistId: "", date: "", time: "", reason: "" });
      setSelectedDate("");
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Booking failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      await axios.delete(`/api/appointments/cancel/${id}`);
      setAppointments((prev) => prev.filter((appt) => appt._id !== id));
      alert("Appointment cancelled.");
    } catch (err) {
      alert("Failed to cancel.");
    }
  };

  return (
    <motion.div
      className="appointment-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2 initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>Book Appointment</motion.h2>
      {message && <p className="message">{message}</p>}

      <motion.form
        onSubmit={handleSubmit}
        className="appointment-form"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <input
          name="psychologistId"
          value={form.psychologistId}
          onChange={handleChange}
          placeholder="Psychologist ID"
          className="appointment-form-input"
          disabled
        />

        <select
          className="appointment-form-input"
          onChange={(e) => setSelectedDate(e.target.value)}
          value={selectedDate || form.date}
        >
          <option value="">-- Select Date --</option>
          {slots.map((s) => (
            <option key={s.date} value={s.date}>{s.date}</option>
          ))}
        </select>

        <select
          name="time"
          value={form.time}
          onChange={handleChange}
          className="appointment-form-input"
          disabled={!availableTimes.length}
        >
          <option value="">-- Select Time --</option>
          {availableTimes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <textarea
          name="reason"
          value={form.reason}
          onChange={handleChange}
          placeholder="Reason for appointment"
          className="appointment-form-input"
        />

        <label>Card Payment:</label>
        <div className="stripe-card">
          <CardElement />
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? "Processing..." : "Pay & Confirm Appointment"}
        </motion.button>
      </motion.form>

      <div className="appointment-list">
        <h2>Your Appointments</h2>
        {appointments.length === 0 ? (
          <p>No upcoming appointments.</p>
        ) : (
          <ul>
            {appointments.map((appt) => (
              <motion.li
                key={appt._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p>
                  <strong>{appt.date}</strong> at <strong>{appt.timeSlot}</strong> with {appt.psychologistId?.name || "Unknown"} ({appt.psychologistId?.specialization || ""})
                </p>
                <button onClick={() => handleCancel(appt._id)}>Cancel</button>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
};

export default AppointmentForm;