import axios, { AxiosRequestConfig } from "axios";

// Base URL from environment variable
const BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3000";

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});


// Add interceptor to handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear any stored auth
      localStorage.removeItem("token");

      // Redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);



export default api;
