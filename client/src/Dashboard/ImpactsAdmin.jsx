// src/Dashboard/pages/ImpactsAdmin.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function ImpactsAdmin() {
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ label: "", value: 0, suffix: "", order: 0 });

  const load = async () => {
    const { data } = await api.get("/api/admin/impacts/");
    setItems(data);
  };
  useEffect(() => { load(); }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/api/admin/impacts/", form);
      setForm({ label: "", value: 0, suffix: "", order: 0 });
      await load();
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Delete stat?")) return;
    await api.delete(`/api/admin/impacts/${id}/`);
    await load();
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Impact Stats</h1>

      <form onSubmit={onCreate} className="grid md:grid-cols-4 gap-3 bg-white p-4 rounded-md border">
        <input className="border p-2 rounded" placeholder="Label"
               value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
        <input type="number" className="border p-2 rounded" placeholder="Value"
               value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} />
        <input className="border p-2 rounded" placeholder="Suffix (e.g. +, k, years)"
               value={form.suffix} onChange={(e) => setForm({ ...form, suffix: e.target.value })} />
        <input type="number" className="border p-2 rounded" placeholder="Order"
               value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
        <button disabled={saving} className="bg-lime-600 text-white rounded px-4 py-2 md:col-span-4">
          {saving ? "Saving…" : "Add Stat"}
        </button>
      </form>

      <ul className="mt-6 space-y-3">
        {items.map((s) => (
          <li key={s.id} className="bg-white border rounded p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold">{s.label}: {s.value}{s.suffix}</div>
              <div className="text-sm text-gray-500">order: {s.order}</div>
            </div>
            <button onClick={() => onDelete(s.id)} className="text-red-600 hover:underline">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
