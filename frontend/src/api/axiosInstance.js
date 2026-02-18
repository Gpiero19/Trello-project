import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to include the token in headers automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle the new response format
// New format: { success: true, data: {...}, message }
// This extracts the data so components get the actual response
axiosInstance.interceptors.response.use(
  (response) => {
    // If response has success: true, extract the data
    if (response.data && response.data.success === true) {
      // Return a new object with the extracted data
      return {
        ...response,
        data: response.data.data
      };
    }
    return response;
  },
  (error) => {
    // Handle error responses
    if (error.response && error.response.data) {
      // Keep the error format as is for components to handle
      console.error("API Error:", error.response.data);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
