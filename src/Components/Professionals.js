import React, { useEffect, useState } from 'react';
import './Professionals.css';
import api from '../api/axios';
import Loader from './Loader'; // ✅ Spinner component

function About() {
  const [psychologists, setPsychologists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false); // ✅ New State
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPsychologists();
  }, []);

  const fetchPsychologists = async () => {
    try {
      const res = await api.get('/api/psychologists');
      setPsychologists(res.data);
    } catch (err) {
      setError("Failed to load professionals.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    setFilterLoading(true);
    try {
      // Simulate filtering (you can replace this with a real filtered API call)
      const res = await api.get('/api/psychologists'); // Filter logic would go here
      setPsychologists(res.data);
    } catch (err) {
      console.error("Filter error", err);
    } finally {
      setFilterLoading(false);
    }
  };

  return (
    <div className="about-container">
      <h2>Find Your Mental Health Professional</h2>
      <p>
        Connect with licensed psychologists who understand your unique needs.<br />
        Take the first step towards better mental health today.
      </p>

      <input className="search-bar" placeholder="Search by name or specialization..." />
      
      {/* ✅ Filter Button with Loader */}
      <button className="filter-button" onClick={handleFilter} disabled={filterLoading}>
        {filterLoading ? <Loader size={15} color="#fff" /> : "Filter"}
      </button>

      {/* ✅ Loader on page load */}
      {loading ? (
        <div className="loader-wrapper">
          <Loader size={40} />
        </div>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="psychologist-list">
          {psychologists.map((psych, index) => (
            <div className="psychologist-card" key={index}>
              <h3>{psych.name}</h3>
              <p>{psych.specialization}</p>
              <p>⭐ {psych.rating} ({psych.reviews} reviews)</p>
              <p>{psych.experience} experience • {psych.availability}</p>
              <button className="book-button">Book Appointment</button>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && (
        <button className="load-more">Load More Psychologists</button>
      )}
    </div>
  );
}

export default About;
