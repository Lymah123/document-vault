import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", 
});

// Interceptor for attaching token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = 'Bearer ${token}';
  }
  return req;
});

export const uploadFile = (formData) => API.post("/upload", formData);
export const getFiles = () => API.get("/files");

