import React, { useEffect, useState } from "react";
import api from "../api/axios"; // must inject Bearer token for /api/admin/*

export default function ProjectsAdmin() {
  const [list, setList] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    order: 0,
    icon: "",
    image: null,
    is_active: true,
    summary: "",
  });

  const load = async () => {
    try {
      setErr("");
      const res = await api.get("/api/admin/projects/");
      setList(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setErr(e?.response?.status === 403 ? "Not authorized" : e.message || "Load failed");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") setForm((s) => ({ ...s, [name]: checked }));
    else if (type === "file") setForm((s) => ({ ...s, [name]: files?.[0] || null }));
    else setForm((s) => ({ ...s, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== null && v !== undefined && v !== "") fd.append(k, v);
      });
      await api.post("/api/admin/projects/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm({
        title: "",
        slug: "",
        order: 0,
        icon: "",
        image: null,
        is_active: true,
        summary: "",
      });
      await load();
    } catch (e1) {
      setErr(e1?.response?.data ? JSON.stringify(e1.response.data) : e1.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Projects</h2>
      {err && <div className="mb-4 text-red-600">Error: {err}</div>}

      <form onSubmit={submit} className="space-y-3 mb-8">
        <input className="border p-2 w-full" placeholder="Title" name="title" value={form.title} onChange={onChange} />
        <input className="border p-2 w-full" placeholder="Slug (optional)" name="slug" value={form.slug} onChange={onChange} />
        <input className="border p-2 w-full" placeholder="Icon (optional, e.g. heart-pulse)" name="icon" value={form.icon} onChange={onChange} />
        <input className="border p-2 w-full" type="number" placeholder="Order" name="order" value={form.order} onChange={onChange} />
        <label className="flex items-center gap-2">
          <input type="checkbox" name="is_active" checked={form.is_active} onChange={onChange} />
          Active
        </label>
        <input className="border p-2 w-full" type="file" name="image" onChange={onChange} />
        <textarea className="border p-2 w-full" placeholder="Short summary" name="summary" value={form.summary} onChange={onChange} />
        <button disabled={loading} className="bg-lime-600 text-white px-4 py-2 rounded">
          {loading ? "Saving..." : "Add Project"}
        </button>
      </form>

      <div className="border rounded">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">ID</th>
              <th className="p-2">Title</th>
              <th className="p-2">Slug</th>
              <th className="p-2">Active</th>
              <th className="p-2">Order</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-2">{p.id}</td>
                <td className="p-2">{p.title}</td>
                <td className="p-2">{p.slug}</td>
                <td className="p-2">{String(p.is_active)}</td>
                <td className="p-2">{p.order}</td>
              </tr>
            ))}
            {!list.length && (
              <tr>
                <td colSpan="5" className="p-3 text-gray-500">
                  No projects yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
