// src/Components/Banner/Banner.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { media } from "../../api/axios";

const Banner = () => {
  const navigate = useNavigate();

  // --- auth state (for Login / Dashboard / Logout buttons)
  const [authed, setAuthed] = useState(!!localStorage.getItem("token"));
  useEffect(() => {
    const onStorage = () => setAuthed(!!localStorage.getItem("token"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthed(false);
    navigate("/");
  };

  // --- UI states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // --- data states
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState("");

  const navigation = useMemo(
    () => [
      { name: "Home", href: "#home" },
      { name: "About Us", href: "#about" },
      { name: "Projects", href: "#projects" },
      { name: "Stories", href: "#stories" },
      { name: "News", href: "#news" },
      { name: "Contact", href: "#contact" },
    ],
    []
  );

  const fallbackSlides = useMemo(
    () => [
      {
        image:
          "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80",
        title: "Education Changes Lives",
        description:
          "Empowering communities through quality education and learning opportunities for every child.",
        ctaPrimary: "বাংলা",
        ctaSecondary: "English",
        ctaHref: "#about",
      },
      {
        image:
          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=1600&q=80",
        title: "Healthcare for All",
        description:
          "Bringing essential medical care and health services to underserved communities.",
        ctaPrimary: "বাংলা",
        ctaSecondary: "English",
        ctaHref: "#news",
      },
      {
        image:
          "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1600&q=80",
        title: "Clean Water Initiative",
        description:
          "Providing access to clean, safe drinking water and sanitation facilities.",
        ctaPrimary: "বাংলা",
        ctaSecondary: "English",
        ctaHref: "#projects",
      },
      {
        image:
          "https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=1600&q=80",
        title: "Women Empowerment",
        description:
          "Supporting women with skills training, microfinance, and leadership development.",
        ctaPrimary: "বাংলা",
        ctaSecondary: "English",
        ctaHref: "#stories",
      },
    ],
    []
  );

  // --- fetch slides
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/banner/");
        const apiSlides = (Array.isArray(res.data) ? res.data : []).map((s) => ({
          image: media(s.image),
          title: s.title,
          description: s.subtitle || "",
          ctaPrimary: s.cta_text || "Explore",
          ctaSecondary: "Learn more",
          ctaHref: s.cta_href || "#about",
        }));
        if (mounted) {
          setSlides(apiSlides.length ? apiSlides : fallbackSlides);
          setCurrentSlide(0);
          setLoadErr("");
        }
      } catch (e) {
        if (mounted) {
          setSlides(fallbackSlides);
          setLoadErr(e?.message || "Failed to load banner");
        }
      } finally {
        mounted && setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [fallbackSlides]);

  // --- scroll and auto-rotate
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (isHovered || slides.length === 0) return;
    const id = setInterval(
      () => setCurrentSlide((p) => (p + 1) % slides.length),
      6000
    );
    return () => clearInterval(id);
  }, [isHovered, slides.length]);

  const nextSlide = () =>
    setCurrentSlide((p) => (p + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((p) => (p - 1 + slides.length) % slides.length);
  const goToSlide = (i) => setCurrentSlide(i);

  // --- smooth scroll utils
  const getScrollableAncestor = (el) => {
    let node = el?.parentElement;
    while (node && node !== document.body) {
      const style = getComputedStyle(node);
      const canScroll = /(auto|scroll)/.test(style.overflowY || style.overflow);
      if (canScroll && node.scrollHeight > node.clientHeight) return node;
      node = node.parentElement;
    }
    return document.scrollingElement || document.documentElement;
  };
  const easeInOutCubic = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const animateScroll = (scroller, to, duration = 650) => {
    const start = scroller.scrollTop;
    const diff = to - start;
    let startTs;
    const step = (ts) => {
      if (!startTs) startTs = ts;
      const p = Math.min((ts - startTs) / duration, 1);
      scroller.scrollTop = start + diff * easeInOutCubic(p);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const handleNavClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;
    const header = document.querySelector("header");
    const offset = (header?.offsetHeight || 96) + 8;
    const scroller = getScrollableAncestor(target);
    const scrollerTop =
      scroller === document.documentElement || scroller === document.body
        ? 0
        : scroller.getBoundingClientRect().top;
    const targetTop = target.getBoundingClientRect().top;
    const y = scroller.scrollTop + (targetTop - scrollerTop) - offset;
    animateScroll(scroller, y, 650);
    setMobileMenuOpen(false);
  };

  return (
    <div className="relative bg-black">
      {/* NAVBAR */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-black/95 backdrop-blur-lg shadow-xl" : "bg-transparent"
        }`}
      >
        <nav className="flex items-center justify-between p-6 lg:px-12">
          {/* Logo */}
          <div className="flex lg:flex-1">
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, "#home")}
              className="flex items-center gap-3 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-lime-400/30 rounded-full blur-md group-hover:blur-lg transition-all duration-300" />
                <img
                  className="relative h-10 w-auto transform group-hover:scale-110 transition-transform duration-300"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Circle-icons-heart.svg/1024px-Circle-icons-heart.svg.png"
                  alt="NGO Logo"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-lime-400 to-green-400 bg-clip-text text-transparent">
                Amar Jashore
              </span>
            </a>
          </div>

          {/* Desktop menu */}
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="nav-link relative text-lg font-semibold text-white hover:text-lime-400 transition-all duration-300 group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-lime-400 to-blue-400 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* Right-side CTAs */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-3">
            {!authed ? (
              <Link
                to="/login"
                className="relative overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-lime-500 px-6 py-3 text-sm font-bold text-white shadow-lg hover:shadow-blue-500/30 transform hover:scale-105 transition-all duration-300 group"
              >
                <span className="relative z-10">Login</span>
                <div className="absolute inset-0 bg-gradient-to-r from-lime-400 to-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="relative overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-lime-500 px-6 py-3 text-sm font-bold text-white shadow-lg hover:shadow-blue-500/30 transform hover:scale-105 transition-all duration-300 group"
                >
                  <span className="relative z-10">Dashboard</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-lime-400 to-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="relative overflow-hidden rounded-full bg-gradient-to-r from-gray-700 to-gray-500 px-6 py-3 text-sm font-bold text-white shadow-lg hover:shadow-gray-500/30 transform hover:scale-105 transition-all duration-300 group"
                >
                  <span className="relative z-10">Logout</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="inline-flex items-center justify-center rounded-lg p-3 text-white bg-gradient-to-r from-lime-600 to-blue-600 hover:from-lime-500 hover:to-blue-500 transform hover:scale-105 transition-all duration-300"
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile panel */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute inset-x-0 top-full z-50 bg-black/95 backdrop-blur-lg shadow-2xl border-t border-lime-500/20">
            <div className="p-6 space-y-4">
              {navigation.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="block text-base font-semibold text-white hover:text-lime-400 transition-all duration-300 transform hover:translate-x-2"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {item.name}
                </a>
              ))}

              {!authed ? (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center rounded-full bg-gradient-to-r from-blue-600 to-lime-500 px-6 py-3 text-base font-bold text-white shadow-lg hover:shadow-blue-500/30 transform hover:scale-105 transition-all duration-300"
                >
                  Login
                </Link>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center rounded-full bg-gradient-to-r from-blue-600 to-lime-500 px-6 py-3 text-base font-bold text-white shadow-lg hover:shadow-blue-500/30 transform hover:scale-105 transition-all duration-300"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="block w-full text-center rounded-full bg-gradient-to-r from-gray-700 to-gray-500 px-6 py-3 text-base font-bold text-white shadow-lg hover:shadow-gray-500/30 transform hover:scale-105 transition-all duration-300"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* HERO / SLIDER */}
      <div
        className="slider-container w-full relative isolate h-screen overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {loading && (
          <div className="absolute inset-0 z-40 flex items-center justify-center text-white/90">
            Loading…
          </div>
        )}
        {!loading && loadErr && (
          <div className="absolute inset-0 z-40 flex items-center justify-center text-red-300">
            {loadErr}
          </div>
        )}

        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ${
              index === currentSlide ? "opacity-100 z-20 page-turn-in" : "opacity-0 z-10"
            }`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/70" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-lime-400/20 rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 3}s`,
                  }}
                />
              ))}
            </div>

            {/* content */}
            <div className="relative z-30 mx-auto max-w-4xl px-6 pt-32 text-center sm:pt-48 lg:pt-56 text-white">
              <div className="space-y-8">
                <h1
                  className={`text-reveal text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl ${
                    index === currentSlide ? "animate-text-reveal" : ""
                  }`}
                >
                  <span className="inline-block bg-gradient-to-r from-white via-lime-100 to-white bg-clip-text text-transparent">
                    {slide.title}
                  </span>
                </h1>

                <p
                  className={`text-reveal-delay text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-2xl mx-auto text-gray-200 ${
                    index === currentSlide ? "animate-text-reveal-delay" : ""
                  }`}
                >
                  {slide.description}
                </p>

                <div
                  className={`button-reveal flex items-center justify-center gap-x-6 ${
                    index === currentSlide ? "animate-button-reveal" : ""
                  }`}
                >
                  <a
                    href={slide.ctaHref || "#news"}
                    onClick={(e) => handleNavClick(e, slide.ctaHref || "#news")}
                    className="relative overflow-hidden rounded-full bg-gradient-to-r from-lime-500 to-green-500 px-8 py-4 text-lg font-bold text-white shadow-2xl hover:shadow-lime-500/40 transform hover:scale-110 transition-all duration-300 group"
                  >
                    <span className="relative z-10">{slide.ctaPrimary}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-lime-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    <div className="absolute inset-0 animate-pulse bg-white/10 rounded-full" />
                  </a>

                  <a
                    href="#about"
                    onClick={(e) => handleNavClick(e, "#about")}
                    className="text-lg font-semibold text-lime-300 hover:text-white transition-all duration-300 group flex items-center gap-2"
                  >
                    <span>{slide.ctaSecondary}</span>
                    <svg
                      className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* indicators */}
        <div className="absolute bottom-8 left-0 right-0 z-40 flex justify-center space-x-4">
          {slides.map((_, index) => (
            <button
              key={index}
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-500 ${
                index === currentSlide
                  ? "w-12 h-3 bg-gradient-to-r from-lime-400 to-blue-400 rounded-full shadow-lg shadow-lime-400/50"
                  : "w-3 h-3 bg-white/50 hover:bg-white/80 rounded-full"
              }`}
            />
          ))}
        </div>

        {/* arrows */}
        <button
          className={`absolute left-6 top-1/2 z-40 -translate-y-1/2 rounded-full bg-black/50 backdrop-blur-md p-4 text-white hover:bg-gradient-to-r hover:from-lime-500/20 hover:to-blue-500/20 border border-lime-400/30 hover:border-lime-400/60 transition-all duration-300 transform hover:scale-110 ${
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
          }`}
          onClick={prevSlide}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          className={`absolute right-6 top-1/2 z-40 -translate-y-1/2 rounded-full bg-black/50 backdrop-blur-md p-4 text-white hover:bg-gradient-to-r hover:from-lime-500/20 hover:to-blue-500/20 border border-lime-400/30 hover:border-lime-400/60 transition-all duration-300 transform hover:scale-110 ${
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
          }`}
          onClick={nextSlide}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* local styles (plain <style>, not styled-jsx) */}
      <style>{`
        .slider-container { perspective: 2000px; width: 100%; }
        @keyframes pageTurnIn {
          0% { transform: rotateY(-90deg); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: rotateY(0); opacity: 1; }
        }
        .page-turn-in { animation: pageTurnIn 1s ease-out; transform-origin: left center; }
        @keyframes textReveal {
          0% { opacity: 0; transform: translateY(50px) scale(0.8); filter: blur(10px); }
          60% { opacity: 0.8; transform: translateY(10px) scale(0.95); filter: blur(2px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0px); }
        }
        @keyframes textRevealDelay {
          0% { opacity: 0; transform: translateY(30px); filter: blur(5px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0px); }
        }
        @keyframes buttonReveal {
          0% { opacity: 0; transform: translateY(40px) scale(0.8); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-text-reveal { animation: textReveal 1.2s ease-out 0.3s both; }
        .animate-text-reveal-delay { animation: textRevealDelay 1s ease-out 0.8s both; }
        .animate-button-reveal { animation: buttonReveal 1s ease-out 1.2s both; }
      `}</style>
    </div>
  );
};

export default Banner;
