import axios from "./axiosConfig";

const API_URL = "http://localhost:8080/medicod/dev/auth";

export const register = async (email, username, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { email, username, password });

    const token = response.data?.data?.token;

    if (!token) throw new Error("Token not found");

    return { token };
  } catch (err) {
    const message = err?.response?.data?.message || err.message || "Registration failed";
    throw new Error(message);
  }
};

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });

    const token = response.data?.data?.token;

    if (!token) throw new Error("Token not found");

    return { token };
  } catch (err) {
    const message = err?.response?.data?.message || err.message || "Login failed";
    throw new Error(message);
  }
};