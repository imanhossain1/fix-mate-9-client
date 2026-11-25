import Link from "next/link";

const CATEGORIES = [
  { name: "Smartphone", icon: "📱", desc: "Screen, battery & charging fix" },
  { name: "Laptop & PC", icon: "💻", desc: "Hardware, OS & thermal service" },
  { name: "AC", icon: "❄️", desc: "Cooling, gas refill & deep clean" },
  { name: "Refrigerator", icon: "🧊", desc: "Compressor & cooling repair" },
  { name: "TV", icon: "📺", desc: "Display, backlight & board fix" },
  { name: "Washing Machine", icon: "🧺", desc: "Drum, motor & drain repair" },
  { name: "Electrical", icon: "⚡", desc: "Wiring, switches & breaker fix" },
];

export default function PopularCategories() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-14">
      <div className="mb-8">
        <h2 className="text-2xl font-bold md:text-3xl">Popular Categories</h2>
        <p className="mt-2 text-base-content/70">
          Choose a repair category to browse available technicians.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {CATEGORIES.map((item) => (
          <Link
            key={item.name}
            href={`/services?category=${encodeURIComponent(item.name)}`}
            className="card border border-base-300 bg-base-100 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary"
          >
            <div className="text-3xl">{item.icon}</div>
            <h3 className="mt-3 text-lg font-bold">{item.name}</h3>
            <p className="mt-1 text-sm text-base-content/70">{item.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}