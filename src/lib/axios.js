// lib/axios.js
import axios from "axios";

export const axiosInstance = axios.create({
  // baseURL: 'https://pos-backend-b5a5.onrender.com/api/v1',
  baseURL:'http://localhost:5676/api/v1',
  withCredentials: true, // This is crucial for sending cookies
  headers: {
    'Content-Type': 'application/json',
    // Add any other default headers here
  }
});

// Add response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors (e.g., redirect to login)
      console.log('Unauthorized access detected');
    }
    return Promise.reject(error);
  }
);