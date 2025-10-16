// src/api/axios.js
import axios from "axios";

// pick correct base URL from Vite envs (no trailing slash)
export const baseURL = (import.meta.env.DEV
  ? import.meta.env.VITE_API_BASE_URL_LOCAL
  : import.meta.env.VITE_API_BASE_URL_PROD
).replace(/\/+$/, "");

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
  timeout: 15000,
});

// ---- attach access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ---- refresh-once-and-retry for admin endpoints
let isRefreshing = false;
let pending = [];

const processQueue = (error, token = null) => {
  pending.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  pending = [];
};

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    const status = err?.response?.status;
    const isAdminCall = (original?.url || "").includes("/api/admin/");
    const refresh = localStorage.getItem("refresh");

    const detail =
      err?.response?.data?.detail ||
      err?.response?.data?.message ||
      err?.message ||
      "Request failed";
    const wrapped = new Error(detail);
    wrapped.status = status;

    if (status === 401 && isAdminCall && refresh && !original._retry) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pending.push({
            resolve: (newToken) => {
              original.headers.Authorization = `Bearer ${newToken}`;
              resolve(api(original));
            },
            reject,
          });
        });
      }

      try {
        isRefreshing = true;
        const { data } = await axios.post(`${baseURL}/api/auth/refresh/`, { refresh });
        const newAccess = data?.access;
        if (!newAccess) throw new Error("No access token in refresh response");

        localStorage.setItem("token", newAccess);
        api.defaults.headers.Authorization = `Bearer ${newAccess}`;
        processQueue(null, newAccess);

        original.headers.Authorization = `Bearer ${newAccess}`;
        return api(original);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        if (typeof window !== "undefined") window.location.href = "/login";
        return Promise.reject(wrapped);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(wrapped);
  }
);

export default api;

/** helper for media paths coming from Django (`/media/...`) */
export const media = (path) => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${baseURL}${path}`;
};
