// src/Layout/Main.jsx
import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../Components/Footer/Footer";

// ✅ AOS for scroll animations
import AOS from "aos";
import "aos/dist/aos.css";

const Main = () => {
  const location = useLocation();

  // ✅ Init AOS once
  useEffect(() => {
    AOS.init({
      duration: 700,       // animation length
      easing: "ease-out",
      once: false,
      mirror: true,          // animate once
      offset: 80,          // trigger a bit early
    });
  }, []);

  // ✅ Refresh on route change (so new elements animate)
 useEffect(() => {
  const onLoad = () => AOS.refreshHard();
  window.addEventListener("load", onLoad);
  return () => window.removeEventListener("load", onLoad);
}, []);

  return (
    // Use the window as the scroller (no overflow on <main>)
    <div
      className="min-h-screen flex flex-col bg-[#c71a1a]"
      style={{
        backgroundColor: "#1e1e2f",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='12' viewBox='0 0 20 12'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='charlie-brown' fill='%2361b4e4' fill-opacity='0.17'%3E%3Cpath d='M9.8 12L0 2.2V.8l10 10 10-10v1.4L10.2 12h-.4zm-4 0L0 6.2V4.8L7.2 12H5.8zm8.4 0L20 6.2V4.8L12.8 12h1.4zM9.8 0l.2.2.2-.2h-.4zm-4 0L10 4.2 14.2 0h-1.4L10 2.8 7.2 0H5.8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      {/* content */}
      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Main;
