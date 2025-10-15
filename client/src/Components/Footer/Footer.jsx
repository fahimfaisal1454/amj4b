import React, { useEffect, useState } from "react";
import {
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaIdCard,
  FaMapMarkerAlt,
  FaExclamationTriangle,
} from "react-icons/fa";

const Footer = () => {
  const [institution, setInstitution] = useState({
    name: "",
    address: "",
    contact_phone: "",
    contact_email: "",
    government_approval_number: "",
    government_approval_date: "",
    history: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // replace the axios call with static or local data
    const fetchInstitutionInfo = async () => {
      try {
        setLoading(true);
        // optional: fetch from /public/institution.json if you want editable data
        const res = await fetch("/institution.json").catch(() => null);
        if (res && res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setInstitution(data[0] || {});
          } else {
            setInstitution(data || {});
          }
        } else {
          // fallback static data
          setInstitution({
            name: "Amar Jessore",
            address: "Jessore, Khulna Division, Bangladesh",
            contact_phone: "+880 1X-XXXX-XXXX",
            contact_email: "info@amarjessore.org",
            government_approval_number: "—",
            government_approval_date: "—",
            history:
              "Community-driven NGO focused on education, health, and environment initiatives in Jessore.",
          });
        }
      } catch (err) {
        console.error("Error loading institution info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInstitutionInfo();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString("bn-BD", options);
    } catch {
      return "N/A";
    }
  };

  const safeDisplay = (value, fallback = "") =>
    value && value.trim() !== "" ? value : fallback;

  return (
    <footer className="w-full text-gray-800 bg-green-400 font-sans mt-auto">
      <div className="max-w-7xl mx-auto p-6 bg-green-400">
        {/* Copyright and Credits - Always shows */}
        <div className="text-center text-xs text-black">
          <p>
            © 2025 {safeDisplay(institution?.name, "প্রতিষ্ঠানের নাম")},{" "}
            {safeDisplay(institution?.address, "ঠিকানা")}. All rights reserved.
            <span className="mx-2">|</span>
            Powered by{" "}
            <a
              href="https://www.utshabtech.com.bd/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black font-medium hover:underline"
            >
              Utshab Technology Ltd.
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
