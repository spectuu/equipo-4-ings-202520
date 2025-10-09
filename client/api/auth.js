import axios from "./axiosConfig";

const API_URL = "http://localhost:8080/medicod/dev/auth";

export const register = async (email, username, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { email, username, password });

    const token = response.data?.data?.token;

    if (!token) throw new Error("Token not found");

    return { token };
  } catch (err) {
    // Re-throw with a clearer message o propaga el error original
    const message = err?.response?.data?.message || err.message || "Registration failed";
    throw new Error(message);
  }
};