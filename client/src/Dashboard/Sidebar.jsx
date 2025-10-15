// src/Dashboard/Sidebar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const Sidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const links = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "About Section", to: "/dashboard/about" },
    { label: "Banners", to: "/dashboard/banners" },
    { label: "Programs", to: "/dashboard/projects" },
    { label: "Impact Stats", to: "/dashboard/impacts" },
    { label: "Stories", to: "/dashboard/stories" },
    { label: "News", to: "/dashboard/news" },
    { label: "Contacts", to: "/dashboard/contacts" },
    { label: "Contact Info", to: "/dashboard/contact-info" },
  ];

  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      navigate("/");
      setLoggingOut(false);
    }, 600);
  };

  return (
    <aside className="bg-gray-900 text-white w-64 h-screen p-4 fixed top-0 left-0 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center text-lime-400">
          Admin Panel
        </h2>

        <nav className="space-y-2">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md bg-lime-600 text-gray-900 font-semibold hover:bg-lime-500 transition-all duration-300"
          >
            🏠 Home
          </Link>

          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`block px-3 py-2 rounded-md transition-all duration-200 ${
                pathname === link.to
                  ? "bg-lime-500 text-gray-900 font-semibold"
                  : "hover:bg-gray-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Logout button */}
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className={`mt-6 w-full py-2 rounded-md font-semibold transition-all duration-300 ${
          loggingOut
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-red-600 hover:bg-red-500"
        }`}
      >
        {loggingOut ? "Logging out..." : "Logout"}
      </button>
    </aside>
  );
};

export default Sidebar;
