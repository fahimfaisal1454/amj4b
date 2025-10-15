import React, { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  HeartPulse,
  Droplets,
  Shield,
  GraduationCap,
  Stethoscope,
  Leaf,
  Users,
  Sparkles,
  Activity,
} from "lucide-react";
import api, { media } from "../../api/axios"; // adjust if needed

const iconMap = {
  "book-open": BookOpen,
  education: BookOpen,
  "heart-pulse": HeartPulse,
  health: HeartPulse,
  healthcare: HeartPulse,
  droplets: Droplets,
  wash: Droplets,
  water: Droplets,
  "child-protection": Shield,
  protection: Shield,
  shield: Shield,
  graduation: GraduationCap,
  stethoscope: Stethoscope,
  leaf: Leaf,
  community: Users,
  sparkles: Sparkles,
  activity: Activity,
};

export default function ProjectsGrid() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const fallback = useMemo(
    () => [
      {
        iconKey: "book-open",
        title: "Education",
        blurb: "Scholarships, school kits, and tutoring for children.",
        href: "/projects#education",
      },
      {
        iconKey: "heart-pulse",
        title: "Healthcare",
        blurb: "Community clinics, screenings, and emergency support.",
        href: "/projects#health",
      },
      {
        iconKey: "droplets",
        title: "Water & Sanitation",
        blurb: "Clean wells, hygiene awareness, and safe water access.",
        href: "/projects#wash",
      },
      {
        iconKey: "shield",
        title: "Child Protection",
        blurb: "Programs to keep families together and children safe.",
        href: "/projects#protection",
      },
    ],
    []
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/projects/");
        const list = Array.isArray(res.data) ? res.data : [];
        if (!mounted) return;

        if (!list.length) {
          setItems(fallback);
          setErr("");
          return;
        }

        const mapped = list.map((p) => ({
          id: p.id,
          iconKey: (p.icon || "").toLowerCase().trim() || "sparkles",
          title: p.title,
          blurb: p.summary || "",
          image: p.image ? media(p.image) : "",
          href: p.slug ? `/projects#${p.slug}` : "/projects",
        }));

        setItems(mapped);
        setErr("");
      } catch (e) {
        if (mounted) {
          setItems(fallback);
          setErr(e.message || "Failed to load projects");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [fallback]);

  return (
    <section
      id="projects"
      className="relative bg-gradient-to-b from-lime-100 via-green-200 to-gray-400 py-20 overflow-hidden"
    >
      {/* Soft dotted pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.05)_1px,transparent_0)] [background-size:22px_22px] opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-12" data-aos="fade-down">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            Our Projects
          </h2>
          <div className="mx-auto w-24 h-1 bg-lime-600 rounded-full" />
          <p className="text-gray-800 mt-3 max-w-2xl mx-auto">
            Building brighter futures through education, health, and protection.
          </p>
          {err && (
            <p className="text-sm text-red-600 mt-2">
              {err} — showing highlights.
            </p>
          )}
        </div>

        {/* Loading shimmer */}
        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-3xl bg-white/60 backdrop-blur-md border border-lime-100 p-8 shadow-sm animate-pulse"
              >
                <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-gray-200/60" />
                <div className="h-4 w-1/2 bg-gray-200/60 mx-auto mb-2 rounded" />
                <div className="h-3 w-3/4 bg-gray-200/60 mx-auto rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((i, idx) => {
              const Icon = iconMap[i.iconKey] || Sparkles;
              return (
                <a
                  key={i.id || i.title}
                  href={i.href}
                  data-aos="fade-up"
                  data-aos-delay={idx * 140}
                  className="group relative flex flex-col items-center text-center 
                    rounded-3xl bg-white/90 backdrop-blur-md border border-lime-100 
                    p-8 shadow-md hover:shadow-xl hover:bg-lime-50 transition-all duration-300 
                    hover:-translate-y-2 hover:border-lime-400 hover:ring-4 hover:ring-lime-200/50"
                >
                  <div
                    className="flex justify-center items-center w-20 h-20 rounded-full 
                    bg-gradient-to-br from-lime-100 to-green-200 shadow-inner 
                    group-hover:from-lime-200 group-hover:to-white transition-all mb-5 overflow-hidden"
                  >
                    {i.image ? (
                      <img
                        src={i.image}
                        alt={i.title}
                        className="w-20 h-20 object-cover rounded-full"
                        loading="lazy"
                      />
                    ) : (
                      <Icon className="w-10 h-10 text-green-600" />
                    )}
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 group-hover:text-green-700 transition-colors">
                    {i.title}
                  </h3>
                  <p className="text-sm text-gray-700 mt-3 leading-relaxed">
                    {i.blurb}
                  </p>
                  <span className="inline-block mt-5 text-green-700 font-medium group-hover:translate-x-1 transition-transform">
                    Learn more →
                  </span>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
