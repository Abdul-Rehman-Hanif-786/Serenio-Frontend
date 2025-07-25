import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Import the CSS file

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={require("../assets/logo.png")} alt="logo" className="logo-img" />
      </div>

      <ul className="navbar-links">
        <li>
          <Link to="/signup" className="nav-button signup-btn">Sign Up</Link>
        </li>
        <li>
          <Link to="/login" className="nav-button login-btn">Login</Link>
        </li> 
        
        
        <li>
          <Link to="/PaymentForm">Payment</Link>
        </li>
       
      </ul>
    </nav>
  );
};

export default Navbar;
