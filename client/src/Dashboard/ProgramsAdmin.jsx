// src/Dashboard/pages/ProgramsAdmin.jsx
import { useEffect, useMemo, useState } from "react";
import api, { media } from "../api/axios";

export default function ProgramsAdmin() {
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    slug: "",
    summary: "",
    order: 0,
    is_active: true,
    image: null,
    icon: "",
  });

  const resetForm = () =>
    setForm({ title: "", slug: "", summary: "", order: 0, is_active: true, image: null, icon: "" });

  const load = async () => {
    setError("");
    try {
      const { data } = await api.get("/api/admin/programs/");
      setItems(data);
    } catch (e) {
      setError(e.message || "Failed to load programs");
    }
  };

  useEffect(() => { load(); }, []);

  const buildFD = (obj) => {
    const fd = new FormData();
    Object.entries(obj).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      if (k === "is_active") fd.append(k, v ? "true" : "false");
      else if (k === "order") fd.append(k, String(v));
      else fd.append(k, v);
    });
    return fd;
  };

  const onCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (!form.title.trim()) throw new Error("Title is required");

      const fd = buildFD(form);
      await api.post("/api/admin/programs/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      resetForm();
      await load();
    } catch (e) {
      setError(e.message || "Create failed");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Delete program?")) return;
    try {
      await api.delete(`/api/admin/programs/${id}/`);
      await load();
    } catch (e) {
      setError(e.message || "Delete failed");
    }
  };

  const onToggleActive = async (p) => {
    try {
      await api.patch(`/api/admin/programs/${p.id}/`, { is_active: !p.is_active });
      await load();
    } catch (e) {
      setError(e.message || "Update failed");
    }
  };

  const onUpdate = async (p, patch) => {
    try {
      if (patch.image) {
        const fd = buildFD({ ...p, ...patch });
        await api.put(`/api/admin/programs/${p.id}/`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.patch(`/api/admin/programs/${p.id}/`, patch);
      }
      await load();
    } catch (e) {
      setError(e.message || "Update failed");
    }
  };

  const ordered = useMemo(
    () => [...items].sort((a, b) => (a.order - b.order) || (a.id - b.id)),
    [items]
  );

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Programs</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={onCreate} className="grid md:grid-cols-2 gap-3 bg-white p-4 rounded-md border">
        <input
          className="border p-2 rounded"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Slug (optional; auto from title)"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Icon (optional)"
          value={form.icon}
          onChange={(e) => setForm({ ...form, icon: e.target.value })}
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
        <textarea
          className="border p-2 rounded md:col-span-2"
          placeholder="Short summary"
          value={form.summary}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
        />
        <div className="col-span-full flex gap-2">
          <button disabled={saving} className="bg-lime-600 text-white rounded px-4 py-2">
            {saving ? "Saving…" : "Add Program"}
          </button>
          <button type="button" onClick={resetForm} className="border rounded px-4 py-2">
            Reset
          </button>
        </div>
      </form>

      <ul className="mt-6 space-y-3">
        {ordered.map((p, i) => (
          <li key={p.id} className="bg-white border rounded p-4">
            <div className="flex items-start gap-4">
              <div className="w-32 h-20 bg-gray-100 rounded overflow-hidden border">
                {p.image ? (
                  <img src={media(p.image)} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{p.title}</div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        const prev = ordered[i - 1];
                        if (!prev) return;
                        await Promise.all([
                          api.patch(`/api/admin/programs/${p.id}/`, { order: prev.order }),
                          api.patch(`/api/admin/programs/${prev.id}/`, { order: p.order }),
                        ]);
                        await load();
                      }}
                      disabled={i === 0}
                      className="px-2 py-1 border rounded disabled:opacity-40"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        const next = ordered[i + 1];
                        if (!next) return;
                        await Promise.all([
                          api.patch(`/api/admin/programs/${p.id}/`, { order: next.order }),
                          api.patch(`/api/admin/programs/${next.id}/`, { order: p.order }),
                        ]);
                        await load();
                      }}
                      disabled={i === ordered.length - 1}
                      className="px-2 py-1 border rounded disabled:opacity-40"
                    >
                      ↓
                    </button>
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  slug: {p.slug || "—"} · order: {p.order} · active: {String(p.is_active)} · icon: {p.icon || "—"}
                </div>

                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input
                    className="border p-2 rounded"
                    defaultValue={p.title}
                    onBlur={(e) => e.target.value !== p.title && onUpdate(p, { title: e.target.value })}
                  />
                  <input
                    className="border p-2 rounded"
                    placeholder="Slug (optional)"
                    defaultValue={p.slug || ""}
                    onBlur={(e) => e.target.value !== (p.slug || "") && onUpdate(p, { slug: e.target.value })}
                  />
                  <input
                    className="border p-2 rounded"
                    placeholder="Icon"
                    defaultValue={p.icon || ""}
                    onBlur={(e) => e.target.value !== (p.icon || "") && onUpdate(p, { icon: e.target.value })}
                  />
                  <input
                    type="number"
                    className="border p-2 rounded"
                    defaultValue={p.order}
                    onBlur={(e) => Number(e.target.value) !== p.order && onUpdate(p, { order: Number(e.target.value) })}
                  />
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" defaultChecked={p.is_active} onChange={() => onToggleActive(p)} />
                    Active
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onUpdate(p, { image: file });
                    }}
                  />
                  <textarea
                    className="border p-2 rounded md:col-span-2"
                    defaultValue={p.summary || ""}
                    onBlur={(e) => e.target.value !== (p.summary || "") && onUpdate(p, { summary: e.target.value })}
                  />
                </div>
              </div>

              <button onClick={() => onDelete(p.id)} className="text-red-600 hover:underline">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
