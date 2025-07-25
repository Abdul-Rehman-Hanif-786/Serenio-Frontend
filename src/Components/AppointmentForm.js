import React, { useEffect, useState } from "react";
import axios from "../api/axios"; // or just "axios" if not using preconfigured instance

const AppointmentForm = () => {
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [form, setForm] = useState({ name: "", date: "", time: "", reason: "" });
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");

  // Load available slots
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

  // Load user's appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get("/api/appointments/user");
        setAppointments(res.data);
      } catch (err) {
        console.error("Failed to fetch appointments");
      }
    };
    fetchAppointments();
  }, []);

  // Filter available times when a date is selected (fixed useEffect)
  useEffect(() => {
    const slot = slots.find((s) => s.date === selectedDate);
    setAvailableTimes(slot ? slot.times : []);
    setForm((prev) => ({ ...prev, date: selectedDate, time: "" }));
  }, [selectedDate, slots]); // ✅ added `slots` to dependencies

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/appointments/book", form);
      setMessage("Appointment booked successfully!");
      setForm({ name: "", date: "", time: "", reason: "" });
      setSelectedDate("");
      const res = await axios.get("/api/appointments/user");
      setAppointments(res.data);
    } catch (err) {
      setMessage(err.response?.data?.message || "Booking failed.");
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      await axios.delete(`/api/appointments/${id}`);
      setAppointments((prev) => prev.filter((appt) => appt.id !== id));
      alert("Appointment cancelled.");
    } catch (err) {
      alert("Failed to cancel.");
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Book Appointment</h2>
      {message && <p className="mb-2 text-blue-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-2 border p-4 rounded shadow mb-6">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your Name"
          className="w-full border p-2 rounded"
        />

        <select
          className="w-full border p-2 rounded"
          onChange={(e) => setSelectedDate(e.target.value)}
          value={selectedDate}
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
          className="w-full border p-2 rounded"
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
          className="w-full border p-2 rounded"
        />

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Book Appointment
        </button>
      </form>

      <h2 className="text-xl font-bold mb-2">Your Appointments</h2>
      {appointments.length === 0 ? (
        <p>No upcoming appointments.</p>
      ) : (
        <ul className="space-y-3">
          {appointments.map((appt) => (
            <li key={appt.id} className="p-3 border rounded shadow-sm">
              <p><strong>{appt.date}</strong> at <strong>{appt.time}</strong></p>
              <p>Reason: {appt.reason}</p>
              <button
                onClick={() => handleCancel(appt.id)}
                className="mt-2 text-red-600 hover:underline"
              >
                Cancel
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AppointmentForm;
