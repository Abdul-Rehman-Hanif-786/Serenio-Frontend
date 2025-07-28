// ✅ Animated Chatbot using Framer Motion
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "./Chatbot.css";
import api from "../api/axios";
import Loader from "./Loader";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";


const analyzeSentiment = (text) => {
  const lowerText = text.toLowerCase();
  if (lowerText.includes("happy") || lowerText.includes("great") || lowerText.includes("good")) {
    return "Positive";
  } else if (lowerText.includes("sad") || lowerText.includes("bad") || lowerText.includes("why")) {
    return "Negative";
  }
  return "Neutral";
};

const messageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Chatbot = () => {
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState(() => {
  const existing = localStorage.getItem("serenioSessionId");
  if (existing) return existing;
  const newId = uuidv4();
  localStorage.setItem("serenioSessionId", newId);
  return newId;
  });

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const chatMessagesRef = useRef(null);

  useEffect(() => {
    const loadInitial = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setMessages([
        {
          sender: "bot",
          name: "Serenio AI",
          text: "Hello Aman! I'm Serenio AI, your personal assistant. How can I help you today?",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          sentiment: null,
        },
      ]);
      setPageLoading(false);
    };
    loadInitial();
  }, []);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userSentiment = analyzeSentiment(input);
    const userMessage = {
      sender: "user",
      name: "Aman",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sentiment: userSentiment,
    };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await api.post("/api/chatbot/message", { message: input,sessionId });
      const botReply = {
        sender: "bot",
        name: "Serenio AI",
        text: res.data.botReply || "Sorry, I didn’t understand that.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        sentiment: null,
      };
      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      const errorReply = {
        sender: "bot",
        name: "Serenio AI",
        text: "Oops! Something went wrong while processing your message.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        sentiment: null,
      };
      setMessages((prev) => [...prev, errorReply]);
    }

    setInput("");
    setLoading(false);
  };

const handleEndChat = () => {
  setMessages([
    {
      sender: "bot",
      name: "Serenio AI",
      text: "Thank you for chatting. Take care! 😊",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sentiment: null,
    },
  ]);

  const sid = localStorage.getItem("serenioSessionId");
  if (sid) {
    navigate(`/SentimentAnalysisDashboard`); // Redirect to report
    localStorage.removeItem("serenioSessionId");
  }
};

  if (pageLoading) {
    return (
      <div className="chatbot-loader-screen">
        <Loader size={32} color="#333" />
        <p>Loading Serenio AI...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="chatbot-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div className="chatbot-header" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        💬 Serenio AI
      </motion.div>

      <div className="chat-window" ref={chatMessagesRef}>
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            className={`message-block ${msg.sender === "user" ? "user-msg" : "bot-msg"}`}
            variants={messageVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.4, delay: idx * 0.1 }}
          >
            <div className="sender-name">{msg.name}</div>
            <motion.div
              className="message-bubble"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {msg.text}
            </motion.div>
            <div className="meta">
              <span className="time">{msg.time}</span>
              {msg.sender === "user" && msg.sentiment && (
                <span className={`sentiment ${msg.sentiment.toLowerCase()}`}>{msg.sentiment}</span>
              )}
            </div>
          </motion.div>
        ))}

        {loading && <Loader />}
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          className="chat-input"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <motion.button
          className="send-button"
          onClick={handleSend}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
        >
          Send
        </motion.button>
      </div>

      <motion.div
        className="end-chat-wrapper"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          className="end-chat-button"
          onClick={handleEndChat}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          End Chat
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Chatbot;