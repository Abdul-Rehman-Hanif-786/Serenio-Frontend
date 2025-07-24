

// File: ChatIllustration.js
const ChatIllustration = () => (
  <svg
    width="280"
    height="220"
    viewBox="0 0 280 220"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Background Circle */}
    <circle cx="180" cy="100" r="100" fill="#E6E6FA" />

    {/* Laptop */}
    <rect x="80" y="130" width="100" height="50" rx="6" fill="#1E2A47" />
    <circle cx="90" cy="155" r="2" fill="#E6E6FA" />

    {/* Person */}
    <path d="M110 130c-5-15-10-50 10-55s25 10 30 25c3 10 4 25 0 30" fill="#17A2B8" />
    <path d="M130 100c-2-10-1-18 4-22s12-1 15 2 3 10 1 16c-1 5-8 10-10 10s-5-3-10-6z" fill="#F9D6C3" />
    <path d="M140 80c-2 4 2 5 3 4 1 0 0-3-3-4z" fill="#1E2A47" />

    {/* Hair */}
    <path d="M128 75c0-7 8-11 13-11 6 0 12 5 13 11s-2 15-5 17c-2 2-6-3-10-6s-11-4-11-11z" fill="#1E2A47" />

    {/* Chat Bubble */}
    <rect x="170" y="60" width="40" height="20" rx="5" fill="#FFFFFF" />
    <circle cx="180" cy="70" r="2" fill="#AAB2C8" />
    <circle cx="188" cy="70" r="2" fill="#AAB2C8" />
    <circle cx="196" cy="70" r="2" fill="#AAB2C8" />
  </svg>
);

export default ChatIllustration;


