import axios from "axios";

const api = axios.create({
  baseURL: "https://bus-ticket-system-jytd.onrender.com",
  timeout: 20000, // 20 seconds
});



// auto attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;