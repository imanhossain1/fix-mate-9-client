
"use client";

import { useState } from "react";
import Link from "next/link";

const services = [
  {
    id: 1,
    title: "AC Repair & Servicing",
    category: "AC Repair",
    price: 500,
    icon: "❄️",
    description: "Professional AC repair, cleaning, installation and maintenance services.",
    image: "https://images.unsplash.com/photo-1631545806609-7e6f3f5f6f7a",
  },
  {
    id: 2,
    title: "Laptop Repair",
    category: "Computer",
    price: 400,
    icon: "💻",
    description: "Expert laptop diagnosis, hardware replacement and software repair.",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed",
  },
  {
    id: 3,
    title: "Mobile Repair",
    category: "Mobile",
    price: 300,
    icon: "📱",
    description: "Fast mobile display, battery and hardware repair services.",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
  },
  {
    id: 4,
    title: "Refrigerator Repair",
    category: "Home Appliance",
    price: 600,
    icon: "🧊",
    description: "Reliable refrigerator diagnosis, repair and maintenance solutions.",
    image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5",
  },
  {
    id: 5,
    title: "TV Repair",
    category: "Electronics",
    price: 500,
    icon: "📺",
    description: "Professional LED, LCD and Smart TV repair services.",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1",
  },
  {
    id: 6,
    title: "Washing Machine Repair",
    category: "Home Appliance",
    price: 550,
    icon: "🫧",
    description: "Expert washing machine troubleshooting and repair at your doorstep.",
    image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1",
  },
  {
    id: 7,
    title: "Desktop Computer Repair",
    category: "Computer",
    price: 450,
    icon: "🖥️",
    description: "Desktop hardware, motherboard and software troubleshooting.",
    image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b",
  },
  {
    id: 8,
    title: "Microwave Oven Repair",
    category: "Home Appliance",
    price: 350,
    icon: "🍲",
    description: "Professional microwave oven diagnosis and repair services.",
    image: "https://images.unsplash.com/photo-1585659722983-3a675dabf23d",
  },
  {
    id: 9,
    title: "Printer Repair",
    category: "Electronics",
    price: 300,
    icon: "🖨️",
    description: "Printer servicing, ink issues and hardware troubleshooting.",
    image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6",
  },
];

const categories = [
  "All",
  "AC Repair",
  "Computer",
  "Mobile",
  "Home Appliance",
  "Electronics",
];


export default function ServicesPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredServices = services.filter((service) => {
    const matchSearch =
      service.title.toLowerCase().includes(search.toLowerCase()) ||
      service.description.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      activeCategory === "All" ||
      service.category === activeCategory;

    return matchSearch && matchCategory;
  });

  return (
    <main className="min-h-screen bg-base-100">

      <section className="bg-base-200 px-5 py-16 text-center">
        <p className="font-semibold uppercase tracking-widest text-primary">
          Explore Our Services
        </p>

        <h1 className="mt-3 text-4xl font-bold md:text-5xl">
          Find The Right Repair Service
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base-content/60">
          Discover professional repair services for your
          electronics, home appliances and everyday needs.
          FixMate connects you with trusted technicians.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">

        {/* Search */}
        <div className="mx-auto mb-8 max-w-xl">
          <input
            type="text"
            placeholder="Search repair services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>

        {/* Category Filter */}
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`btn btn-sm ${
                activeCategory === category
                  ? "btn-primary"
                  : "btn-outline"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Result Heading */}
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">
              All Repair Services
            </h2>

            <p className="mt-1 text-sm text-base-content/60">
              Find the right service for your needs.
            </p>
          </div>

          <span className="badge badge-primary badge-outline">
            {filteredServices.length} Services
          </span>
        </div>

        {/* Service Cards */}
        {filteredServices.length > 0 ? (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="card overflow-hidden border border-base-300 bg-base-100 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <figure className="relative h-52 bg-base-200">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute left-4 top-4 badge badge-primary">
                    {service.category}
                  </div>
                </figure>

                <div className="card-body">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {service.icon}
                    </span>

                    <h3 className="card-title text-lg">
                      {service.title}
                    </h3>
                  </div>

                  <p className="text-sm leading-6 text-base-content/60">
                    {service.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-base-300 pt-4">
                    <div>
                      <p className="text-xs text-base-content/50">
                        Starting from
                      </p>

                      <p className="text-xl font-bold text-primary">
                        ৳{service.price}
                      </p>
                    </div>

                    <Link
                      href={`/services/${service.id}`}
                      className="btn btn-primary btn-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-base-200 py-16 text-center">
            <div className="text-5xl">🔍</div>

            <h3 className="mt-4 text-xl font-bold">
              No Services Found
            </h3>

            <p className="mt-2 text-sm text-base-content/60">
              Try another search or category.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
              }}
              className="btn btn-primary btn-sm mt-5"
            >
              Clear Filters
            </button>
          </div>
        )}

      </section>
    </main>
  );
}
