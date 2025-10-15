import React, { useEffect, useState } from "react";
import api, { media } from "../../api/axios"; // adjust path if needed
// import { Link } from "react-router-dom"; // if using routes

export default function NewsSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const fallback = [
    {
      id: 1,
      title: "Blood Donation Drive Brings Hope",
      image:
        "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=1600&q=80",
      date: "2025-09-21",
      summary:
        "Over 200 volunteers participated in our recent blood donation campaign, helping save countless lives across Jessore.",
    },
    {
      id: 2,
      title: "Tree Plantation Day 2025",
      image:
        "https://images.unsplash.com/photo-1552089123-2d26226fc2d0?auto=format&fit=crop&w=1600&q=80",
      date: "2025-08-17",
      summary:
        "More than 500 trees were planted in collaboration with local schools and volunteers to promote a greener Jessore.",
    },
    {
      id: 3,
      title: "Environmental Clean-Up Campaign",
      image:
        "https://images.unsplash.com/photo-1598515213693-d8c5e6d3f15b?auto=format&fit=crop&w=1600&q=80",
      date: "2025-07-10",
      summary:
        "Our youth teams came together to clean public areas and raise awareness about waste management.",
    },
    {
      id: 4,
      title: "Healthcare Camp for Rural Families",
      image:
        "https://images.unsplash.com/photo-1580281657521-6d8a8b8c6a2d?auto=format&fit=crop&w=1600&q=80",
      date: "2025-06-02",
      summary:
        "Free medical check-ups and medicine distribution helped hundreds of families in rural Jessore.",
    },
  ];

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/news/");
        const list = Array.isArray(res.data) ? res.data : [];
        if (mounted) {
          setItems(list.length ? list : fallback);
          setErr("");
        }
      } catch (e) {
        if (mounted) {
          setItems(fallback);
          setErr(e.message || "Failed to load news");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section
      id="news"
      className="scroll-mt-28 md:scroll-mt-32 relative bg-gradient-to-b from-lime-100 via-green-200 to-gray-700 pt-5 pb-20 text-gray-900 overflow-hidden"
    >
      {/* dotted pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.06)_1px,transparent_0)] [background-size:22px_22px] opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div
          className="text-center mb-12"
          data-aos="fade-down"
          data-aos-duration="800"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Latest News & Updates
          </h2>
          <div className="mx-auto mt-3 w-24 h-1 bg-lime-600 rounded-full" />
          <p className="text-gray-800 mt-3 max-w-2xl mx-auto">
            Stay informed about our latest initiatives and events happening in
            Jessore.
          </p>
          {err && (
            <p className="mt-2 text-sm text-red-600">
              {err} — showing recent highlights.
            </p>
          )}
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-3xl overflow-hidden bg-white/70 border border-lime-100 shadow-sm animate-pulse"
              >
                <div className="h-56 w-full bg-gray-200/70" />
                <div className="p-6 space-y-3">
                  <div className="h-4 w-24 bg-gray-200/70" />
                  <div className="h-6 w-3/4 bg-gray-200/70" />
                  <div className="h-4 w-full bg-gray-200/70" />
                  <div className="h-4 w-2/3 bg-gray-200/70" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
              <article
                key={item.id || item.slug || index}
                data-aos="fade-up"
                data-aos-delay={index * 150}
                className="group rounded-3xl overflow-hidden bg-white/90 border border-lime-100 shadow-md hover:shadow-xl hover:bg-lime-50 transition-all duration-300 hover:-translate-y-2 hover:border-lime-400 hover:ring-4 hover:ring-lime-200/40"
              >
                <div className="overflow-hidden">
                  <img
                    src={media(item.image)}
                    alt={item.title}
                    className="h-56 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                <div className="p-6 space-y-3">
                  <div className="text-sm text-green-700 font-semibold">
                    {item.date
                      ? new Date(item.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : ""}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-700">{item.summary}</p>
                  <a
                    href={item.slug ? `/news/${item.slug}` : "#news"}
                    className="inline-block text-green-700 font-semibold hover:text-green-800 transition-all"
                  >
                    Read More →
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
