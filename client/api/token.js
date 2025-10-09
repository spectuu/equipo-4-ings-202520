const TOKEN_KEY = "token";

const isClient = () => typeof window !== "undefined" && !!window.localStorage;

export const setToken = (token) => {
  if (!isClient()) return;
  localStorage.setItem(TOKEN_KEY, token);
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

export const isAuthenticated = () => {
  return !!getToken();
};