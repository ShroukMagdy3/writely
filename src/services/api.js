import axios from "axios";

const api = axios.create({
  baseURL: "https://blog-app-delta-lime.vercel.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const loginUser = (data) => api.post("/auth/login", data);
export const registerUser = (data) => api.post("/auth/signup", data);
export const getPostById = (id) => api.get(`/posts/${id}`);
export const createPost = (data) => api.post("/posts/create", data);
export const updatePost = (id, data) => api.post(`/posts/update/${id}`, data);
export const deletePost = (id) => api.delete(`/posts/${id}`);
export const getAllPosts = () => api.get("/posts");
export const getProfile = () => api.get("auth/profile");
