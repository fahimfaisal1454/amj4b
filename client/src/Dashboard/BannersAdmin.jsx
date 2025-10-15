// src/Dashboard/pages/BannersAdmin.jsx
import { useEffect, useMemo, useState } from "react";
import api, { media } from "../api/axios";

export default function BannersAdmin() {
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    cta_text: "",
    cta_href: "",
    order: 0,
    is_active: true,
    image: null,
  });

  const resetForm = () =>
    setForm({
      title: "",
      subtitle: "",
      cta_text: "",
      cta_href: "",
      order: 0,
      is_active: true,
      image: null,
    });

  const load = async () => {
    setError("");
    try {
      const { data } = await api.get("/api/admin/banners/");
      setItems(data);
    } catch (e) {
      setError(e.message || "Failed to load banners");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const buildFormData = (obj) => {
    const fd = new FormData();
    Object.entries(obj).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      if (k === "is_active") {
        // DRF accepts 'true'/'false' in multipart
        fd.append(k, v ? "true" : "false");
      } else if (k === "order") {
        fd.append(k, String(v));
      } else {
        fd.append(k, v);
      }
    });
    return fd;
    };

  const onCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (!form.title.trim()) throw new Error("Title is required");
      if (!form.image) throw new Error("Image is required");

      const fd = buildFormData(form);
      await api.post("/api/admin/banners/", fd, {
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
    if (!confirm("Delete banner?")) return;
    try {
      await api.delete(`/api/admin/banners/${id}/`);
      await load();
    } catch (e) {
      setError(e.message || "Delete failed");
    }
  };

  const onToggleActive = async (b) => {
    try {
      const payload = { is_active: !b.is_active };
      // partial update; JSON is fine here
      await api.patch(`/api/admin/banners/${b.id}/`, payload);
      await load();
    } catch (e) {
      setError(e.message || "Update failed");
    }
  };

  const onUpdate = async (b, patch) => {
    try {
      // if image is included, use multipart; otherwise JSON
      if (patch.image) {
        const fd = buildFormData({ ...b, ...patch });
        await api.put(`/api/admin/banners/${b.id}/`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.patch(`/api/admin/banners/${b.id}/`, patch);
      }
      await load();
    } catch (e) {
      setError(e.message || "Update failed");
    }
  };

  const move = async (idx, dir) => {
    // simple client-side reorder: swap order with neighbor, then PATCH both
    const target = items[idx];
    const neighbor = items[idx + dir];
    if (!target || !neighbor) return;

    try {
      await Promise.all([
        api.patch(`/api/admin/banners/${target.id}/`, { order: neighbor.order }),
        api.patch(`/api/admin/banners/${neighbor.id}/`, { order: target.order }),
      ]);
      await load();
    } catch (e) {
      setError(e.message || "Reorder failed");
    }
  };

  const ordered = useMemo(
    () => [...items].sort((a, b) => (a.order - b.order) || (a.id - b.id)),
    [items]
  );

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Banners</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={onCreate} className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white p-4 rounded-md border">
        <input
          className="border p-2 rounded"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Subtitle"
          value={form.subtitle}
          onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="CTA Text"
          value={form.cta_text}
          onChange={(e) => setForm({ ...form, cta_text: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="CTA Href (e.g. #about or /resources)"
          value={form.cta_href}
          onChange={(e) => setForm({ ...form, cta_href: e.target.value })}
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

        <div className="col-span-full flex gap-2">
          <button disabled={saving} className="bg-lime-600 text-white rounded px-4 py-2">
            {saving ? "Saving…" : "Add Banner"}
          </button>
          <button type="button" onClick={resetForm} className="border rounded px-4 py-2">
            Reset
          </button>
        </div>
      </form>

      <ul className="mt-6 space-y-3">
        {ordered.map((b, i) => (
          <li key={b.id} className="bg-white border rounded p-4">
            <div className="flex items-start gap-4">
              <div className="w-40 h-24 bg-gray-100 rounded overflow-hidden border">
                {b.image ? (
                  <img
                    src={media(b.image)}
                    alt={b.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{b.title}</div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      className="px-2 py-1 border rounded disabled:opacity-40"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, +1)}
                      disabled={i === ordered.length - 1}
                      className="px-2 py-1 border rounded disabled:opacity-40"
                    >
                      ↓
                    </button>
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  order: {b.order} · active: {String(b.is_active)} · {b.cta_text || "—"} → {b.cta_href || "—"}
                </div>

                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input
                    className="border p-2 rounded"
                    defaultValue={b.title}
                    onBlur={(e) => e.target.value !== b.title && onUpdate(b, { title: e.target.value })}
                  />
                  <input
                    className="border p-2 rounded"
                    defaultValue={b.subtitle || ""}
                    onBlur={(e) => e.target.value !== (b.subtitle || "") && onUpdate(b, { subtitle: e.target.value })}
                  />
                  <input
                    className="border p-2 rounded"
                    placeholder="CTA Text"
                    defaultValue={b.cta_text || ""}
                    onBlur={(e) => e.target.value !== (b.cta_text || "") && onUpdate(b, { cta_text: e.target.value })}
                  />
                  <input
                    className="border p-2 rounded"
                    placeholder="CTA Href"
                    defaultValue={b.cta_href || ""}
                    onBlur={(e) => e.target.value !== (b.cta_href || "") && onUpdate(b, { cta_href: e.target.value })}
                  />
                  <input
                    type="number"
                    className="border p-2 rounded"
                    defaultValue={b.order}
                    onBlur={(e) => Number(e.target.value) !== b.order && onUpdate(b, { order: Number(e.target.value) })}
                  />
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      defaultChecked={b.is_active}
                      onChange={() => onToggleActive(b)}
                    />
                    Active
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onUpdate(b, { image: file });
                    }}
                  />
                </div>
              </div>

              <button onClick={() => onDelete(b.id)} className="text-red-600 hover:underline">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
