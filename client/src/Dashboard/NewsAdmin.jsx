// src/Dashboard/pages/NewsAdmin.jsx
import { useEffect, useState } from "react";
import api from "../api/axios"; // ✅ same fix as stories

export default function NewsAdmin() {
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const [form, setForm] = useState({
    title: "",
    slug: "",
    summary: "",
    date: "",
    published: true,
    image: null,
  });

  const load = async () => {
    try {
      setErr("");
      const { data } = await api.get("/api/admin/news/");
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(
        e?.response?.status === 401
          ? "Unauthorized (login/token missing)"
          : e?.response?.status === 403
          ? "Forbidden (not admin)"
          : e?.message || "Failed to load news"
      );
      setItems([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr("");

    try {
      const fd = new FormData();
      fd.append("title", form.title);
      if (form.slug) fd.append("slug", form.slug);
      if (form.summary) fd.append("summary", form.summary);
      if (form.date) fd.append("date", form.date); // YYYY-MM-DD
      fd.append("published", form.published ? "true" : "false");
      if (form.image) fd.append("image", form.image);

      await api.post("/api/admin/news/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setForm({
        title: "",
        slug: "",
        summary: "",
        date: "",
        published: true,
        image: null,
      });
      await load();
    } catch (e1) {
      setErr(
        e1?.response?.data
          ? JSON.stringify(e1.response.data)
          : e1.message || "Save failed"
      );
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Delete news item?")) return;
    try {
      await api.delete(`/api/admin/news/${id}/`);
      await load();
    } catch (e) {
      setErr(e?.message || "Delete failed");
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">News</h1>
      {err && <div className="mb-4 text-red-600">Error: {err}</div>}

      <form
        onSubmit={onCreate}
        className="grid md:grid-cols-2 gap-3 bg-white p-4 rounded-md border"
      >
        <input
          className="border p-2 rounded"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          className="border p-2 rounded"
          placeholder="Slug (optional)"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
          />
          Published
        </label>
        <textarea
          className="border p-2 rounded md:col-span-2"
          placeholder="Short summary"
          value={form.summary}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setForm({ ...form, image: e.target.files?.[0] || null })
          }
        />
        <button
          disabled={saving}
          className="bg-lime-600 text-white rounded px-4 py-2"
        >
          {saving ? "Saving…" : "Add News"}
        </button>
      </form>

      <ul className="mt-6 space-y-3">
        {items.map((n) => (
          <li
            key={n.id}
            className="bg-white border rounded p-4 flex items-center justify-between"
          >
            <div>
              <div className="font-semibold">{n.title}</div>
              <div className="text-sm text-gray-500">
                date: {n.date || "—"} · published: {String(n.published)}
              </div>
              <div className="text-gray-600">{n.summary}</div>
            </div>
            <button
              onClick={() => onDelete(n.id)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
        {!items.length && <li className="text-gray-500">No news yet</li>}
      </ul>
    </div>
  );
}
