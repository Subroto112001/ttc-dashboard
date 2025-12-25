import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api/v1",
});

// Interceptor: রিকোয়েস্ট যাওয়ার আগে অটোমেটিক টোকেন যুক্ত করবে
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
