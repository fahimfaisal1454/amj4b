// src/Pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { baseURL } from "../api/axios";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      // Clear any stale tokens to avoid weird states
      localStorage.removeItem("token");
      localStorage.removeItem("refresh");

      // Use a plain axios call here to avoid any interceptors
      const { data } = await api.post("/api/auth/token/", {
        username: form.username.trim(),
        password: form.password,
      });

      if (!data?.access || !data?.refresh) {
        throw new Error("Invalid response from server.");
      }

      // Save access + refresh separately (strings)
      localStorage.setItem("token", data.access);
      localStorage.setItem("refresh", data.refresh);

      navigate("/dashboard"); // or wherever your admin home is
    } catch (err) {
      // Try to surface a helpful message from DRF if available
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.non_field_errors?.[0] ||
        err?.message ||
        "Invalid username or password.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Login</h2>

        {error && <p className="bg-red-100 text-red-700 p-2 rounded text-sm mb-3">{error}</p>}

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full border rounded p-2 mt-1 focus:ring-2 focus:ring-lime-400"
              placeholder="Enter your admin username"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border rounded p-2 mt-1 focus:ring-2 focus:ring-lime-400"
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-lime-500 hover:bg-lime-600 disabled:opacity-60 text-white font-semibold py-2 rounded transition-all"
          >
            {submitting ? "Logging in…" : "Login"}
          </button>
        </div>

        {/* Optional: quick env hint */}
        
      </form>
    </div>
  );
}
