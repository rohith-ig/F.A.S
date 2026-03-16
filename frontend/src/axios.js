import axios from "axios";
import React from "react";
const api = axios.create({
  baseURL: process.env.BACKEND_URL || "http://localhost:6969",
  withCredentials: true
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = document.cookie
      .split("; ")
      .find(row => row.startsWith("jwt="))
      ?.split("=")[1];
    console.log("Token from cookie:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default api;