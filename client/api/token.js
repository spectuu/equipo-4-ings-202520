const TOKEN_KEY = "token";

const isClient = () => typeof window !== "undefined" && !!window.localStorage;

export const setToken = (token) => {
  if (!isClient()) return;
  localStorage.setItem(TOKEN_KEY, token ?? "");
};

export const getToken = () => {
  if (!isClient()) return null;
  const token = localStorage.getItem(TOKEN_KEY);
  return token && token !== "undefined" ? token : null;
};

export const removeToken = () => {
  if (!isClient()) return;
  localStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = () => !!getToken();

export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "===".slice((normalized.length + 3) % 4);
    const jsonStr =
      typeof atob === "function"
        ? atob(padded)
        : Buffer.from(padded, "base64").toString("binary");
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
};
