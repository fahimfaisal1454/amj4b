// src/Dashboard/pages/AboutUs.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { HeartHandshake } from "lucide-react";

export default function AboutUs() {
  const [about, setAbout] = useState(null);
  const [error, setError] = useState("");

  // Fallback (if backend isn’t reachable)
  const fallback = {
    badge_text: "Our Mission",
    heading: "Empowering Jessore through education, health & environment.",
    body:
      "We are a community-driven NGO focused on sustainable change. From school support to rural health camps and green initiatives, our volunteers and partners work hand-in-hand to build a brighter future.",
    image_url: "", // optional local placeholder
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/about/");
        setAbout(res.data || fallback);
      } catch (err) {
        console.error("Failed to load About section:", err);
        setError(err.message || "Failed to load");
        setAbout(fallback);
      }
    })();
  }, []);

  const data = about || fallback;

  return (
    <section
      id="about"
      className="relative overflow-hidden py-5 md:py-5 scroll-mt-28 md:scroll-mt-32 text-gray-900"
    >
      {/* Base light gradient + soft lime/green shades */}
      <div className="absolute inset-0 bg-gradient-to-b from-lime-50 via-green-200 to-gray-300" />
      <div className="pointer-events-none absolute inset-0 opacity-70 mix-blend-multiply
        [background:radial-gradient(900px_420px_at_50%_-140px,rgba(163,230,53,0.24),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-60
        [background:radial-gradient(900px_520px_at_95%_70%,rgba(16,185,129,0.18),transparent_70%)]" />
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.45)_1px,transparent_0)] [background-size:22px_22px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 grid gap-12 md:grid-cols-2 items-center">
        {/* Left content */}
        <div data-aos="fade-right">
          {/* badge */}
          {!!data.badge_text && (
            <div className="inline-flex items-center gap-2 rounded-full border border-lime-200 bg-white px-3 py-1 text-xs font-semibold text-green-700">
              <HeartHandshake className="w-4 h-4" />
              {data.badge_text}
            </div>
          )}

          {/* heading */}
          <h2 className="mt-4 text-4xl md:text-5xl font-extrabold leading-tight">
            {data.heading}
          </h2>

          {/* body */}
          <p className="mt-4 text-lg text-gray-700">
            {data.body}
          </p>

          {/* error message */}
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </div>

        {/* Right image (polished card with gentle halo) */}
        <div className="hidden md:block" data-aos="fade-left">
          <div className="relative">
            {/* soft green halo behind image */}
            <div className="absolute -inset-3 rounded-3xl opacity-40 blur-2xl
                [background:radial-gradient(400px_260px_at_70%_30%,rgba(34,197,94,0.25),transparent_70%)]" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white ring-1 ring-lime-100 shadow-lg">
              {data.image_url ? (
                <img
                  src={data.image_url}
                  alt="About"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gray-50" />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
