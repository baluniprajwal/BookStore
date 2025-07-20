import axios from "axios";

export const API_URL = "https://bookstore-kn7a.onrender.com/api";
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
