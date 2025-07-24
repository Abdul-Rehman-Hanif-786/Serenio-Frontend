import React from "react";
import "./Index.css";
import { useNavigate } from "react-router-dom"; // ✅ Added for navigation
import ChatIllustration from "./ChatIllustration";

<ChatIllustration />

const Index = () => {
  const navigate = useNavigate(); // ✅ Initialize navigation

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Your Partner in <span>Mental Wellness</span></h1>
          <p>
            We’re here to provide compassionate support for your mental well-being.
          </p>
          <button
            className="get-started"
            onClick={() => navigate("/login")} // ✅ Link to login page
          >
            Get Started
          </button>
        </div>
        <div className="hero-image">
          
            <img src={require("../assets/undraw_remote-worker_0l91.png")} alt="logo" className="hero-img" 
            
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>How Serenio Can Help You</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <img src="https://img.icons8.com/ios/50/chat--v1.png" alt="AI Chat" />
            <h3>AI Chat Support</h3>
            <p>
              Talk to our AI for immediate, confidential mental health support.
            </p>
          </div>
          <div className="feature-card">
            <img src="https://img.icons8.com/ios/50/calendar--v1.png" alt="Scheduling" />
            <h3>Appointment Scheduling</h3>
            <p>
              Book sessions with qualified mental health professionals at your convenience.
            </p>
          </div>
          <div className="feature-card">
            <img src="https://img.icons8.com/ios/50/thumb-up.png" alt="Guidance" />
            <h3>Personalized Guidance</h3>
            <p>
              Receive tailored advice and resources to support your mental wellness.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 Serenio. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
