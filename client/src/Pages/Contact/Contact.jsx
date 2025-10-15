import React, { useEffect, useMemo } from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import api from "../../api/axios"; // adjust path if needed

export default function Contact() {
  const [status, setStatus] = React.useState({ ok: false, error: "" });
  const [pending, setPending] = React.useState(false);

  // Fetched contact info (editable via /api/admin/contact-info/)
  const [info, setInfo] = React.useState({
    email: "",
    phone: "",
    address: "",
    hours: "",
  });
  const [infoErr, setInfoErr] = React.useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setInfoErr("");
        const { data } = await api.get("/api/contact-info/");
        if (!mounted) return;
        setInfo({
          email: data?.email || "",
          phone: data?.phone || "",
          address: data?.address || "",
          hours: data?.hours || "",
        });
      } catch (e) {
        if (!mounted) return;
        setInfoErr(e?.message || "Failed to load contact info");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ ok: false, error: "" });
    setPending(true);

    const formEl = e.currentTarget; // capture before await
    const form = new FormData(formEl);
    const payload = Object.fromEntries(form.entries());

    const body = {
      name: (payload.name || "").trim(),
      email: (payload.email || "").trim(),
      phone: (payload.phone || "").trim(),
      subject: (payload.subject || "").trim(),
      message: (payload.message || "").trim(),
    };

    try {
      await api.post("/api/contact/", body);
      setStatus({ ok: true, error: "" });
      formEl.reset();
    } catch (err) {
      setStatus({
        ok: false,
        error: err?.response?.data
          ? typeof err.response.data === "string"
            ? err.response.data
            : JSON.stringify(err.response.data)
          : err?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setPending(false);
    }
  }

  // Build the Contact Information list from fetched info
  const infoItems = useMemo(
    () => [
      {
        icon: <Mail className="mt-1 h-5 w-5 text-green-600" />,
        label: "Email",
        content: (
          <a
            href={info.email ? `mailto:${info.email}` : "#"}
            className="font-medium text-green-700 hover:text-green-800"
          >
            {info.email || "—"}
          </a>
        ),
      },
      {
        icon: <Phone className="mt-1 h-5 w-5 text-green-600" />,
        label: "Phone",
        content: (
          <a
            href={info.phone ? `tel:${info.phone}` : "#"}
            className="font-medium text-green-700 hover:text-green-800"
          >
            {info.phone || "—"}
          </a>
        ),
      },
      {
        icon: <MapPin className="mt-1 h-5 w-5 text-green-600" />,
        label: "Address",
        content: <p className="font-medium">{info.address || "—"}</p>,
      },
      {
        icon: <Clock className="mt-1 h-5 w-5 text-green-600" />,
        label: "Hours",
        content: <p className="font-medium">{info.hours || "—"}</p>,
      },
    ],
    [info.email, info.phone, info.address, info.hours]
  );

  return (
    <section
      id="contact"
      className="scroll-mt-28 md:scroll-mt-32 relative overflow-hidden pt-1 pb-14 text-gray-900"
    >
      {/* Base light gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-lime-100 via-green-100 to-gray-500" />

      {/* Top lime shade (soft band under the navbar) */}
      <div className="pointer-events-none absolute inset-0 opacity-70 mix-blend-multiply
                      [background:radial-gradient(900px_420px_at_50%_-140px,rgba(163,230,53,0.28),transparent_70%)]" />

      {/* Bottom green shade (subtle depth near the fold) */}
      <div className="pointer-events-none absolute inset-0 opacity-60
                      [background:radial-gradient(900px_520px_at_50%_115%,rgba(16,185,129,0.22),transparent_70%)]" />

      {/* Very light texture so it doesn’t look flat */}
      <div className="absolute inset-0 opacity-15
                      bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.5)_1px,transparent_0)]
                      [background-size:22px_22px]" />

      {/* CONTENT */}
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="text-center mb-8" data-aos="fade-down" data-aos-duration="700">
          <span className="inline-flex items-center gap-2 rounded-full border border-lime-200 bg-white px-3 py-1 text-xs font-semibold text-green-700">
            Get in Touch
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mt-3">
            Contact{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-lime-500">
              Amar Jessore
            </span>
          </h1>
          <p className="mt-2 max-w-2xl mx-auto text-lg text-gray-700">
            Questions, ideas, or want to volunteer? We’d love to hear from you.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
          {/* Left: Contact Info */}
          <aside className="md:col-span-2 space-y-6" data-aos="fade-right" data-aos-duration="700">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">Contact Information</h2>
              <p className="mt-1 text-gray-600">Reach us via email, phone, or visit our office.</p>

              {infoErr && (
                <p className="mt-2 text-sm text-red-600">
                  Failed to load contact info — showing blanks.
                </p>
              )}

              <ul className="mt-6 space-y-4">
                {infoItems.map((it, idx) => (
                  <li
                    key={it.label}
                    className="flex gap-3"
                    data-aos="fade-up"
                    data-aos-delay={100 + idx * 100}
                  >
                    {it.icon}
                    <div>
                      <p className="text-sm text-gray-500">{it.label}</p>
                      {it.content}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Map */}
            <div
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              data-aos="zoom-in-up"
              data-aos-delay={120}
            >
              <iframe
                title="Amar Jessore Map"
                className="h-56 w-full"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=Jessore,Bangladesh&z=12&output=embed"
              />
            </div>
          </aside>

          {/* Right: Form */}
          <div className="md:col-span-3" data-aos="fade-left" data-aos-duration="700">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <h2 className="text-xl font-bold">Send us a message</h2>
              <p className="mt-1 text-gray-600">We usually reply within 1–2 business days.</p>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-1" data-aos="fade-up" data-aos-delay="60">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-green-300 transition-shadow"
                    placeholder="Your name"
                  />
                </div>

                <div className="sm:col-span-1" data-aos="fade-up" data-aos-delay="100">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-green-300 transition-shadow"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="sm:col-span-1" data-aos="fade-up" data-aos-delay="140">
                  <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone (optional)
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-green-300 transition-shadow"
                    placeholder="+880…"
                  />
                </div>

                <div className="sm:col-span-1" data-aos="fade-up" data-aos-delay="180">
                  <label htmlFor="subject" className="text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-green-300 transition-shadow"
                    placeholder="How can we help?"
                  />
                </div>

                <div className="sm:col-span-2" data-aos="fade-up" data-aos-delay="220">
                  <label htmlFor="message" className="text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-green-300 transition-shadow"
                    placeholder="Write your message here…"
                  />
                </div>
              </div>

              <div
                className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                data-aos="fade-up"
                data-aos-delay="260"
              >
                <button
                  type="submit"
                  disabled={pending}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold text-white shadow transition-transform
                    ${
                      pending
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-600 to-lime-500 hover:shadow-lg hover:scale-105"
                    }`}
                >
                  <Send className="h-4 w-4" />
                  {pending ? "Sending..." : "Send Message"}
                </button>

                {status.ok && (
                  <span className="text-sm font-medium text-green-700">
                    Thanks! Your message was sent.
                  </span>
                )}
                {status.error && (
                  <span className="text-sm font-medium text-red-600">
                    {status.error}
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
