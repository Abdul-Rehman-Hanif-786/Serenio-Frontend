// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // http://localhost:5000
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Request:", config.url, config.headers); // Debug
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("Response error:", error.response?.status, error.response?.data); // Debug
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      console.log("Interceptor: Redirecting to /login due to 401");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

console.log("Axios baseURL:", api.defaults.baseURL);

export default api;