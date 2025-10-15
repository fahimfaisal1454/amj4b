// src/api/auth.js
import axios from "axios";
import { baseURL } from "./axios"; // reuse baseURL from your existing axios.js

export const setTokens = (access, refresh) => {
  if (access) localStorage.setItem("token", access);
  if (refresh) localStorage.setItem("refresh", refresh);
};

export const clearTokens = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh");
};

export async function login(username, password) {
  const res = await axios.post(`${baseURL}/api/auth/token/`, { username, password });
  const { access, refresh } = res.data || {};
  if (!access || !refresh) throw new Error("Invalid login response");
  setTokens(access, refresh);
  return { access, refresh };
}

export function logout() {
  clearTokens();
  if (typeof window !== "undefined") window.location.href = "/login";
}
