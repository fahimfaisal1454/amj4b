import React, { useEffect, useState } from "react";

const LOCAL_JSON_URL = "/gallery.json"; // put this in /public/gallery.json

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [visibleCount, setVisibleCount] = useState(4); // show 4 initially

  useEffect(() => {
    let isMounted = true;

    // Fallback data in case gallery.json is missing
    const fallback = [
      {
        image: "/images/gallery/sample-1.jpg",
        caption: "Community tree planting — Jessore",
      },
      {
        image: "/images/gallery/sample-2.jpg",
        caption: "Health camp outreach",
      },
      {
        image: "/images/gallery/sample-3.jpg",
        caption: "After-school program",
      },
      {
        image: "/images/gallery/sample-4.jpg",
        caption: "Clean-up drive",
      },
    ];

    (async () => {
      try {
        const res = await fetch(LOCAL_JSON_URL, { cache: "no-store" });
        if (!res.ok) throw new Error("No gallery.json found");
        const data = await res.json();
        if (isMounted) setPhotos(Array.isArray(data) ? data : fallback);
      } catch {
        if (isMounted) setPhotos(fallback);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLoadMore = () => setVisibleCount((n) => n + 4);
  const handleShowLess = () => setVisibleCount(4);

  // Close modal on Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setSelectedImage(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="bg-white py-4">
      <div className="max-w-6xl mx-auto">
        {photos.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {photos.slice(0, visibleCount).map((photo, index) => (
                <button
                  key={index}
                  type="button"
                  className="group relative overflow-hidden rounded-lg border border-gray-200 h-64 bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500"
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => setSelectedImage(photo)}
                  aria-label={photo.caption || "Open image"}
                >
                  <img
                    loading="lazy"
                    src={photo.image}
                    alt={photo.caption || "Gallery image"}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div
                    className={`absolute inset-0 bg-black/30 flex items-end p-4 transition-opacity duration-300 ${
                      hoveredCard === index ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <p className="text-white font-medium text-sm line-clamp-2">
                      {photo.caption || ""}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-center gap-3 mt-6">
              {visibleCount < photos.length && (
                <button
                  onClick={handleLoadMore}
                  className="px-4 py-2 bg-amber-500 text-black rounded hover:bg-amber-600"
                >
                  Load More
                </button>
              )}
              {visibleCount > 4 && (
                <button
                  onClick={handleShowLess}
                  className="px-4 py-2 bg-amber-500 text-black rounded hover:bg-amber-600"
                >
                  Show Less
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-black">No photos available in the gallery</p>
          </div>
        )}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-amber-400"
              aria-label="Close"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="max-h-[70vh] overflow-hidden rounded-lg">
              <img
                src={selectedImage.image}
                alt={selectedImage.caption || "Selected image"}
                className="w-full object-contain"
                style={{ maxHeight: "70vh" }}
              />
            </div>
            {selectedImage.caption && (
              <div className="mt-2 text-center text-white">
                <p className="text-sm">{selectedImage.caption}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
