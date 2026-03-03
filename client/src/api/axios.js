import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // Tăng lên 30 giây
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add token to request header if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error("API Error:", error.response.status, error.response.data);

      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        console.warn("Unauthorized! Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Redirect to login if needed
        // window.location.href = "/login";
      }
    } else if (error.request) {
      // Request made but no response
      console.error("Network Error:", error.message);
      console.error("Request:", error.request);
    } else {
      // Something else happened
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
