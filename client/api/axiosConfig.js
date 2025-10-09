import axios from "axios";
import { getToken } from "./token";

const PUBLIC_ROUTES = ["/auth/login", "/auth/register"];

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/medicod/dev",
});

axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  const url = config.url || "";
  const isPublic = PUBLIC_ROUTES.some((route) => url.includes(route));

  if (!isPublic && token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;