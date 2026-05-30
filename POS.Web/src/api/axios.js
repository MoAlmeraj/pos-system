import axios from "axios";

// Create a custom axios with our API's base URL
const api = axios.create({
  baseURL: "http://localhost:5280/api",
});

// This runs automatically before EVERY request
api.interceptors.request.use((config) => {
  // Read the token from the browser's localStorage
  const token = localStorage.getItem("token");

  // If the token exists, attach it to the request header
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Return the config so the request can continue
  return config;
});

// Export so other files can use this configured axios
export default api;
