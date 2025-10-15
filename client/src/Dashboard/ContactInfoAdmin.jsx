// src/Dashboard/pages/ContactInfoAdmin.jsx
import { useEffect, useState } from "react";
import api from "../api/axios"; // adjust path if your axios file is elsewhere

export default function ContactInfoAdmin() {
  const [form, setForm] = useState({
    email: "",
    phone: "",
    address: "",
    hours: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ ok: "", err: "" });

  const load = async () => {
    try {
      setLoading(true);
      setMsg({ ok: "", err: "" });
      const { data } = await api.get("/api/admin/contact-info/");
      setForm({
        email: data?.email || "",
        phone: data?.phone || "",
        address: data?.address || "",
        hours: data?.hours || "",
      });
    } catch (e) {
      setMsg({
        ok: "",
        err:
          e?.response?.status === 401
            ? "Unauthorized (login?)"
            : e?.response?.status === 403
            ? "Forbidden (admin only)"
            : e?.message || "Failed to load contact info",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ ok: "", err: "" });
    try {
      await api.put("/api/admin/contact-info/", form);
      setMsg({ ok: "Saved.", err: "" });
    } catch (e1) {
      setMsg({
        ok: "",
        err: e1?.response?.data
          ? typeof e1.response.data === "string"
            ? e1.response.data
            : JSON.stringify(e1.response.data)
          : e1?.message || "Save failed",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold mb-4">Contact Info</h1>

      {msg.err && <div className="mb-3 rounded border border-red-200 bg-red-50 p-2 text-red-700">{msg.err}</div>}
      {msg.ok && <div className="mb-3 rounded border border-green-200 bg-green-50 p-2 text-green-700">{msg.ok}</div>}

      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-9 bg-gray-200 rounded" />
          <div className="h-9 bg-gray-200 rounded" />
          <div className="h-9 bg-gray-200 rounded" />
          <div className="h-9 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      ) : (
        <form onSubmit={submit} className="grid gap-3 bg-white p-4 border rounded-lg">
          <label className="grid gap-1">
            <span className="text-sm text-gray-700">Email</span>
            <input
              type="email"
              className="border rounded p-2"
              value={form.email}
              onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
              placeholder="info@amarjessore.org"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-gray-700">Phone</span>
            <input
              type="text"
              className="border rounded p-2"
              value={form.phone}
              onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
              placeholder="+8801XXXXXXXXX"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-gray-700">Address</span>
            <input
              type="text"
              className="border rounded p-2"
              value={form.address}
              onChange={(e) => setForm((s) => ({ ...s, address: e.target.value }))}
              placeholder="Jessore, Khulna Division, Bangladesh"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-gray-700">Hours</span>
            <input
              type="text"
              className="border rounded p-2"
              value={form.hours}
              onChange={(e) => setForm((s) => ({ ...s, hours: e.target.value }))}
              placeholder="Sat–Thu: 10:00–18:00"
            />
          </label>

          <div className="flex gap-2 pt-1">
            <button
              disabled={saving}
              className={`px-4 py-2 rounded text-white ${saving ? "bg-gray-400" : "bg-lime-600 hover:bg-lime-700"}`}
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={load}
              className="px-4 py-2 rounded border"
              disabled={saving}
              title="Reload from server"
            >
              Reset
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
