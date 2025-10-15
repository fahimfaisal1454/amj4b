// src/Dashboard/pages/StoriesAdmin.jsx
import { useEffect, useState } from "react";
import api from "../api/axios"; // ✅ fixed path

export default function StoriesAdmin() {
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    tag: "",
    order: 0,
    is_active: true,
    image: null,
    date: "",
  });

  const load = async () => {
    try {
      setErr("");
      const { data } = await api.get("/api/admin/stories/");
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e?.response?.status === 401 ? "Unauthorized (login/token missing)" :
            e?.response?.status === 403 ? "Forbidden (not admin)" :
            e?.message || "Failed to load stories");
      setItems([]);
    }
  };

  useEffect(() => { load(); }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr("");

    try {
      const fd = new FormData();
      fd.append("title", form.title);
      if (form.slug) fd.append("slug", form.slug);
      if (form.excerpt) fd.append("excerpt", form.excerpt);
      if (form.tag) fd.append("tag", form.tag);
      fd.append("order", String(Number(form.order) || 0));
      fd.append("is_active", form.is_active ? "true" : "false");
      if (form.date) fd.append("date", form.date); // YYYY-MM-DD
      if (form.image) fd.append("image", form.image); // ✅ only append if chosen

      await api.post("/api/admin/stories/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setForm({
        title: "",
        slug: "",
        excerpt: "",
        tag: "",
        order: 0,
        is_active: true,
        image: null,
        date: "",
      });
      await load();
    } catch (e1) {
      setErr(e1?.response?.data ? JSON.stringify(e1.response.data) : e1.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Delete story?")) return;
    try {
      await api.delete(`/api/admin/stories/${id}/`);
      await load();
    } catch (e) {
      setErr(e?.message || "Delete failed");
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Stories</h1>
      {err && <div className="mb-4 text-red-600">Error: {err}</div>}

      <form onSubmit={onCreate} className="grid md:grid-cols-2 gap-3 bg-white p-4 rounded-md border">
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
        <input
          className="border p-2 rounded"
          placeholder="Tag (e.g. Health, Environment)"
          value={form.tag}
          onChange={(e) => setForm({ ...form, tag: e.target.value })}
        />
        <textarea
          className="border p-2 rounded md:col-span-2"
          placeholder="Short excerpt"
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
        />
        <input
          type="number"
          className="border p-2 rounded"
          placeholder="Order"
          value={form.order}
          onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
        />
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
          />
          Active
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })}
        />
        <button disabled={saving} className="bg-lime-600 text-white rounded px-4 py-2">
          {saving ? "Saving…" : "Add Story"}
        </button>
      </form>

      <ul className="mt-6 space-y-3">
        {items.map((s) => (
          <li key={s.id} className="bg-white border rounded p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold">{s.title}</div>
              <div className="text-sm text-gray-500">
                date: {s.date || "—"} · tag: {s.tag || "—"} · order: {s.order ?? 0} · active: {String(s.is_active)}
              </div>
              <div className="text-gray-600">{s.excerpt}</div>
            </div>
            <button onClick={() => onDelete(s.id)} className="text-red-600 hover:underline">
              Delete
            </button>
          </li>
        ))}
        {!items.length && (
          <li className="text-gray-500">No stories yet</li>
        )}
      </ul>
    </div>
  );
}
