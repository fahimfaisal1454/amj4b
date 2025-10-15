// src/Dashboard/pages/ContactsAdmin.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function ContactsAdmin() {
  const [items, setItems] = useState([]);

  const load = async () => {
    const { data } = await api.get("/api/admin/contacts/");
    setItems(data);
  };
  useEffect(() => { load(); }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Contact Messages</h1>

      <div className="bg-white border rounded">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Subject</th>
              <th className="p-3">Received</th>
            </tr>
          </thead>
          <tbody>
            {items.map((m) => (
              <tr key={m.id} className="border-t">
                <td className="p-3">{m.name}</td>
                <td className="p-3">{m.email}</td>
                <td className="p-3">{m.subject}</td>
                <td className="p-3">{new Date(m.created_at).toLocaleString()}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">No messages yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
