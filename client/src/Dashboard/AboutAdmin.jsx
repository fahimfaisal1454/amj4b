// src/Dashboard/pages/AboutAdmin.jsx
import React, { useEffect, useMemo, useState } from "react";
import api from "../api/axios";

export default function AboutAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // UI fields
  const [badgeText, setBadgeText] = useState("");
  const [heading, setHeading] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");

    api
      .get("/api/admin/about/")
      .then(({ data }) => {
        if (!alive) return;
        setBadgeText(data.badge_text ?? "");
        setHeading(data.heading ?? "");
        setBody(data.body ?? "");
        setImageUrl(data.image_url ?? "");
      })
      .catch((e) => alive && setError(e.message || "Failed to load"))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, []);

  const valid = useMemo(() => heading.trim().length > 0, [heading]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!valid) return;

    setSaving(true);
    setError("");

    const formData = new FormData();
    formData.append("badge_text", badgeText);
    formData.append("heading", heading);
    formData.append("body", body);
    if (image) formData.append("image", image);

    try {
      const { data } = await api.put("/api/admin/about/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setBadgeText(data.badge_text ?? "");
      setHeading(data.heading ?? "");
      setBody(data.body ?? "");
      setImageUrl(data.image_url ?? "");
      setImage(null);
    } catch (e) {
      setError(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 780, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 12 }}>Edit About Section</h1>

      {loading && <div>Loading…</div>}
      {!!error && (
        <div
          role="alert"
          style={{
            margin: "8px 0 16px",
            padding: 12,
            border: "1px solid #fecaca",
            background: "#fff1f2",
            borderRadius: 8,
            color: "#991b1b",
            whiteSpace: "pre-wrap",
          }}
        >
          {error}
        </div>
      )}

      {!loading && (
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>
              Badge text
            </label>
            <input
              type="text"
              value={badgeText}
              onChange={(e) => setBadgeText(e.target.value)}
              placeholder="Badge text"
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>
              Heading
            </label>
            <input
              type="text"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              placeholder="Heading"
              required
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>
              Body text
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              placeholder="Body text"
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                resize: "vertical",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>
              Image
            </label>
            {imageUrl && (
              <div style={{ marginBottom: 8 }}>
                <img
                  src={imageUrl}
                  alt="Current About Section"
                  style={{
                    width: "100%",
                    maxHeight: 240,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="submit"
              disabled={!valid || saving}
              style={{
                padding: "10px 16px",
                borderRadius: 8,
                border: "1px solid #16a34a",
                background: saving ? "#86efac" : "#22c55e",
                color: "white",
                cursor: saving ? "progress" : "pointer",
              }}
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              disabled={saving}
              style={{
                padding: "10px 16px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                background: "white",
                cursor: "pointer",
              }}
            >
              Reset
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
