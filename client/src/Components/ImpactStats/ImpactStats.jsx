import { Heart, Users, MapPin } from "lucide-react";

export default function ImpactStats() {
  const stats = [
    { icon: <Heart className="w-8 h-8 text-lime-600 mb-3" />, kpi: "12+", label: "Active Programs" },
    { icon: <Users className="w-8 h-8 text-lime-600 mb-3" />, kpi: "4,200+", label: "Children Reached" },
    { icon: <MapPin className="w-8 h-8 text-lime-600 mb-3" />, kpi: "18", label: "Districts Covered" },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-gray-50 to-white py-16 text-gray-900">
      {/* subtle background pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#e2e8f0_1px,transparent_0)] [background-size:20px_20px] opacity-40" />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 sm:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="group relative rounded-2xl border border-lime-100 bg-white/80 p-8 text-center shadow-md backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex justify-center">{s.icon}</div>
            <div className="mt-2 text-4xl font-extrabold text-lime-700 transition-transform group-hover:scale-110">
              {s.kpi}
            </div>
            <div className="mt-1 font-medium text-gray-600">{s.label}</div>

            {/* accent line animation */}
            <div className="absolute bottom-0 left-0 h-1 w-0 rounded-b-2xl bg-lime-600 transition-all duration-500 group-hover:w-full" />
          </div>
        ))}
      </div>
    </section>
  );
}
