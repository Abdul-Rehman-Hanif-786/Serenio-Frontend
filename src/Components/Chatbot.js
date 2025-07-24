import React, { useState, useEffect, useRef } from "react";
import "./Chatbot.css";
import api from "../api/axios";
import Loader from "./Loader";

const Chatbot = () => {
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
          sentiment: "Positive",
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

    const userMessage = {
      sender: "user",
      name: "Aman",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sentiment: "Neutral",
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await api.post("/chat", { message: input });

      const botReply = {
        sender: "bot",
        name: "Serenio AI",
        text: res.data.reply || "Sorry, I didn’t understand that.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        // sentiment is still stored but not shown in UI
        sentiment: res.data.sentiment || "Neutral",
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      const errorReply = {
        sender: "bot",
        name: "Serenio AI",
        text: "Oops! Something went wrong while processing your message.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        sentiment: "Neutral",
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
        sentiment: "Neutral",
      },
    ]);
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
    <div className="chatbot-container">
      <div className="chatbot-header">💬 Serenio AI</div>

      <div className="chat-window" ref={chatMessagesRef}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message-block ${msg.sender === "user" ? "user-msg" : "bot-msg"}`}
          >
            <div className="sender-name">{msg.name}</div>
            <div className="message-bubble">{msg.text}</div>
            <div className="meta">
              <span className="time">{msg.time}</span>
              {/* ✅ Only show Neutral if it's from the user */}
              {msg.sender === "user" && msg.sentiment === "Neutral" && (
                <span className="sentiment neutral">{msg.sentiment}</span>
              )}
            </div>
          </div>
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
        <button className="send-button" onClick={handleSend}>
          Send
        </button>
      </div>

      <div className="end-chat-wrapper">
        <button className="end-chat-button" onClick={handleEndChat}>
          End Chat
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
