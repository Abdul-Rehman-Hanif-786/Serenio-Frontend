import React, { useEffect, useState } from "react";
import "./Professionals.css";
import api from "../api/axios";
import Loader from "./Loader";

function Professionals() {
  const [psychologists, setPsychologists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPsychologist, setSelectedPsychologist] = useState(null);
  const [bookingForm, setBookingForm] = useState({ date: "", timeSlot: "" });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");

  useEffect(() => {
    fetchPsychologists();
  }, []);

  const fetchPsychologists = async () => {
    try {
      console.log("Fetching psychologists from /api/psychologists");
      const res = await api.get("/api/psychologists");
      console.log("Response data:", res.data);
      setPsychologists(res.data);
    } catch (err) {
      setError("Failed to load professionals.");
      console.error("Fetch error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/psychologists"); // Enhance with actual filtering
      setPsychologists(res.data);
    } catch (err) {
      console.error("Filter error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPsychologist = (psych) => {
    setSelectedPsychologist(psych);
    setBookingMessage("");
  };

  const handleBookingChange = (e) => {
    setBookingForm({ ...bookingForm, [e.target.name]: e.target.value });
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!selectedPsychologist) {
      setBookingMessage("Please select a psychologist first.");
      return;
    }
    setBookingLoading(true);
    try {
      const response = await api.post("/api/appointments/book", {
        psychologistId: selectedPsychologist._id,
        date: bookingForm.date,
        timeSlot: bookingForm.timeSlot,
        userId: localStorage.getItem("userId"),
      });
      setBookingMessage(response.data.message);
      setBookingForm({ date: "", timeSlot: "" });
    } catch (err) {
      setBookingMessage(
        err.response?.data?.message || "Failed to book appointment."
      );
      console.error("Booking error:", err.response?.data || err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="professionals-container">
      <h2>Find Your Mental Health Professional</h2>
      <p>
        Connect with licensed psychologists tailored to your needs.
        <br /> Start your journey to better mental health today.
      </p>

      <div className="search-filter">
        <input
          className="search-bar"
          placeholder="Search by name or specialization..."
          onChange={(e) => {
            const filtered = psychologists.filter(
              (psych) =>
                psych.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                psych.specialization
                  .toLowerCase()
                  .includes(e.target.value.toLowerCase())
            );
            setPsychologists(filtered);
          }}
        />
        <button
          className="filter-button"
          onClick={handleFilter}
          disabled={loading}
        >
          {loading ? <Loader size={15} color="#fff" /> : "Filter"}
        </button>
      </div>

      {loading ? (
        <div className="loader-wrapper">
          <Loader size={40} />
        </div>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="psychologist-grid">
          {psychologists.map((psych, index) => (
            <div
              key={index}
              className="psychologist-card"
              onClick={() => handleSelectPsychologist(psych)}
            >
              <img
                src={psych.imageUrl || "https://via.placeholder.com/200x300"}
                alt={psych.name}
                className="psychologist-image"
                onError={(e) => console.log("Image error for:", psych.name, e)}
              />
              <h3>{psych.name}</h3>
              <p className="specialization-preview">{psych.specialization}</p>
              <button className="view-profile">View Profile</button>
            </div>
          ))}
        </div>
      )}

      {selectedPsychologist && (
        <div className="psychologist-details animate-slide-in">
          <button
            className="close-button"
            onClick={() => setSelectedPsychologist(null)}
          >
            &times;
          </button>
          <div className="profile-header">
            <img
              src={selectedPsychologist.imageUrl || "https://via.placeholder.com/200x300"}
              alt={selectedPsychologist.name}
              className="profile-image"
              onError={(e) => console.log("Image error for:", selectedPsychologist.name, e)}
            />
            <div>
              <h3>{selectedPsychologist.name}</h3>
              <p className="specialization">{selectedPsychologist.specialization}</p>
            </div>
          </div>
          <div className="profile-bio">
            <p>{selectedPsychologist.bio || "No bio available."}</p>
          </div>
          <div className="profile-info">
            <p><strong>Rating:</strong> ⭐ {selectedPsychologist.rating || "N/A"} ({selectedPsychologist.reviews || 0} reviews)</p>
            <p><strong>Experience:</strong> {selectedPsychologist.experience || "N/A"}</p>
            <p><strong>Availability:</strong> {selectedPsychologist.availability || "Check availability"}</p>
          </div>
          <form className="booking-form" onSubmit={handleBookAppointment}>
            <div className="form-group">
              <label htmlFor="date">Date:</label>
              <input
                type="date"
                id="date"
                name="date"
                value={bookingForm.date}
                onChange={handleBookingChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="timeSlot">Time Slot:</label>
              <input
                type="time"
                id="timeSlot"
                name="timeSlot"
                value={bookingForm.timeSlot}
                onChange={handleBookingChange}
                required
              />
            </div>
            <button type="submit" disabled={bookingLoading}>
              {bookingLoading ? "Booking..." : "Book Now"}
            </button>
          </form>
          {bookingMessage && (
            <p
              className={
                bookingMessage.includes("successfully") ? "success" : "error"
              }
            >
              {bookingMessage}
            </p>
          )}
        </div>
      )}

      {!loading && !error && psychologists.length > 0 && (
        <button className="load-more">Load More Psychologists</button>
      )}
    </div>
  );
}

export default Professionals;