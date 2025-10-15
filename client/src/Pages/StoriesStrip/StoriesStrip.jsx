// src/Components/StoriesStrip/StoriesStrip.jsx
import React, { useEffect, useMemo, useState } from "react";
import api, { media } from "../../api/axios"; // adjust path if needed

export default function StoriesStrip({ posts }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const hasPosts = Array.isArray(posts) && posts.length > 0;

  const demoPosts = useMemo(
    () => [
      {
        id: "blood-donation-camp",
        slug: "blood-donation-camp-jessore",
        title: "Community Blood Donation Camp",
        date: "2025-01-15",
        image: "/images/demo/blood-donation.jpg",
        tag: "Health",
        excerpt:
          "Volunteers and youth groups came together to collect 120+ units of blood for patients in need.",
      },
      {
        id: "tree-plantation-drive",
        slug: "tree-plantation-drive-schools",
        title: "Tree Plantation Drive in Schools",
        date: "2025-02-04",
        image: "/images/demo/tree-plantation.jpg",
        tag: "Environment",
        excerpt:
          "We planted 500 saplings across 6 schools to create greener, cooler campuses for students.",
      },
      {
        id: "cleanliness-campaign",
        slug: "environment-cleaning-town",
        title: "Environment Cleaning Campaign",
        date: "2025-02-20",
        image: "/images/demo/environment-cleaning.jpg",
        tag: "Community",
        excerpt:
          "Local residents joined our teams to clean streets and spread awareness on waste segregation.",
      },
    ],
    []
  );

  useEffect(() => {
    let mounted = true;

    if (hasPosts) {
      setItems(posts.slice(0, 3));
      setLoading(false);
      setErr("");
      return () => {
        mounted = false;
      };
    }

    (async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/stories/");
        const list = Array.isArray(res.data) ? res.data : [];

        if (!mounted) return;

        if (!list.length) {
          setItems(demoPosts.slice(0, 3));
          setErr("");
          return;
        }

        const mapped = list.slice(0, 3).map((s, i) => ({
          id: s.id ?? i,
          slug: s.slug || s.id || "",
          title: s.title || "Story",
          date: s.created_at || s.updated_at || "",
          image: media(s.image) || "/images/demo/placeholder.jpg",
          tag: s.tag || "",
          excerpt: s.excerpt || "",
        }));

        setItems(mapped);
        setErr("");
      } catch (e) {
        if (mounted) {
          setItems(demoPosts.slice(0, 3));
          setErr(e.message || "Failed to load stories");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [hasPosts, posts, demoPosts]);

  return (
    <section
      id="stories"
      className="relative bg-gradient-to-b from-lime-100 via-green-200 to-gray-500 py-5 overflow-hidden"
    >
      {/* Soft dotted background overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.06)_1px,transparent_0)] [background-size:22px_22px] opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div
          className="flex flex-col items-center mb-10 text-center"
          data-aos="fade-down"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Our Stories
          </h2>
          <div className="mt-3 w-24 h-1 bg-lime-600 rounded-full mx-auto" />
          <a
            href="/resources"
            className="text-green-700 font-medium hover:underline mt-2"
            data-aos="fade"
            data-aos-delay="150"
          >
            All stories →
          </a>
          {err && (
            <p className="mt-2 text-sm text-red-600">
              {err} — showing highlights.
            </p>
          )}
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid gap-8 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-3xl overflow-hidden border border-lime-100 bg-white/70 shadow-sm animate-pulse"
              >
                <div className="h-48 w-full bg-gray-200/70" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-24 bg-gray-200/70" />
                  <div className="h-5 w-3/4 bg-gray-200/70" />
                  <div className="h-3 w-full bg-gray-200/70" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            {items.map((p, idx) => (
              <a
                key={p.id || p.slug || idx}
                href={`/resources/${p.slug || ""}`}
                data-aos="fade-up"
                data-aos-delay={idx * 140}
                className="group relative rounded-3xl overflow-hidden border border-lime-100 bg-white/90 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-lime-300 hover:ring-4 hover:ring-lime-200/40"
              >
                {/* Image Section */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={p.image || "/images/demo/placeholder.jpg"}
                    alt={p.title}
                    className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                  {p.tag && (
                    <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-green-700 shadow">
                      {p.tag}
                    </span>
                  )}
                </div>

                {/* Text Content */}
                <div className="p-5">
                  <div className="text-xs text-gray-600">
                    {p.date ? new Date(p.date).toLocaleDateString() : ""}
                  </div>
                  <h3 className="mt-1 text-lg font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                    {p.title}
                  </h3>
                  {p.excerpt && (
                    <p className="mt-2 line-clamp-2 text-sm text-gray-700">
                      {p.excerpt}
                    </p>
                  )}
                  <div className="mt-4 inline-flex items-center text-green-700 font-medium group-hover:translate-x-1 transition-transform">
                    Read more →
                  </div>
                </div>

                {/* Hover bar animation */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-lime-600 group-hover:w-full transition-all duration-500" />
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
