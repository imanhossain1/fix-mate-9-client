
"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

const services = [
  {
    id: 1,
    title: "AC Repair & Servicing",
    category: "AC Repair",
    price: 500,
    icon: "❄️",
    description:
      "Professional AC repair, cleaning, installation and maintenance services. Our experienced technicians provide reliable AC servicing at your doorstep.",
    image:
      "https://images.unsplash.com/photo-1631545806609-7e6f3f5f6f7a",
    features: [
      "AC Installation",
      "AC Gas Refill",
      "AC Cleaning",
      "AC Troubleshooting",
    ],
  },
  {
    id: 2,
    title: "Laptop Repair",
    category: "Computer",
    price: 400,
    icon: "💻",
    description:
      "Expert laptop diagnosis, hardware replacement and software repair services by experienced technicians.",
    image:
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed",
    features: [
      "Laptop Display Repair",
      "Keyboard Replacement",
      "Software Installation",
      "Hardware Troubleshooting",
    ],
  },
  {
    id: 3,
    title: "Mobile Repair",
    category: "Mobile",
    price: 300,
    icon: "📱",
    description:
      "Fast mobile display, battery and hardware repair services by professional technicians.",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    features: [
      "Display Replacement",
      "Battery Replacement",
      "Charging Port Repair",
      "Software Issues",
    ],
  },
  {
    id: 4,
    title: "Refrigerator Repair",
    category: "Home Appliance",
    price: 600,
    icon: "🧊",
    description:
      "Reliable refrigerator diagnosis, repair and maintenance solutions for your home.",
    image:
      "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5",
    features: [
      "Cooling Problems",
      "Gas Refill",
      "Compressor Repair",
      "Regular Maintenance",
    ],
  },
  {
    id: 5,
    title: "TV Repair",
    category: "Electronics",
    price: 500,
    icon: "📺",
    description:
      "Professional LED, LCD and Smart TV repair services.",
    image:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1",
    features: [
      "Display Problems",
      "Sound Problems",
      "Smart TV Setup",
      "Hardware Repair",
    ],
  },
  {
    id: 6,
    title: "Washing Machine Repair",
    category: "Home Appliance",
    price: 550,
    icon: "🫧",
    description:
      "Expert washing machine troubleshooting and repair at your doorstep.",
    image:
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1",
    features: [
      "Water Leakage Repair",
      "Motor Repair",
      "Drainage Problems",
      "Regular Maintenance",
    ],
  },
  {
    id: 7,
    title: "Desktop Computer Repair",
    category: "Computer",
    price: 450,
    icon: "🖥️",
    description:
      "Desktop hardware, motherboard and software troubleshooting.",
    image:
      "https://images.unsplash.com/photo-1587831990711-23ca6441447b",
    features: [
      "Motherboard Repair",
      "Windows Installation",
      "Hardware Upgrade",
      "Virus Removal",
    ],
  },
  {
    id: 8,
    title: "Microwave Oven Repair",
    category: "Home Appliance",
    price: 350,
    icon: "🍲",
    description:
      "Professional microwave oven diagnosis and repair services.",
    image:
      "https://images.unsplash.com/photo-1585659722983-3a675dabf23d",
    features: [
      "Heating Problems",
      "Door Repair",
      "Electrical Issues",
      "Regular Maintenance",
    ],
  },
  {
    id: 9,
    title: "Printer Repair",
    category: "Electronics",
    price: 300,
    icon: "🖨️",
    description:
      "Printer servicing, ink issues and hardware troubleshooting.",
    image:
      "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6",
    features: [
      "Paper Jam Repair",
      "Ink Problems",
      "Printer Setup",
      "Hardware Troubleshooting",
    ],
  },
];

export default function ServiceDetailsPage() {
  // URL theke dynamic ID nebo
  const params = useParams();

  // URL-er ID number e convert korbo
  const serviceId = Number(params.id);

  // ID diye service khujbo
  const service = services.find(
    (item) => item.id === serviceId
  );

  // Service na pele
  if (!service) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-5 text-center">
        <h1 className="text-3xl font-bold">
          Service Not Found
        </h1>

        <p className="text-base-content/60">
          Sorry, this service does not exist.
        </p>

        <Link href="/services" className="btn btn-primary">
          Back to Services
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-base-100">

      {/* Page Header */}
      <section className="bg-base-200 px-5 py-12">
        <div className="mx-auto max-w-7xl">

          <Link href="/services" className="text-primary font-semibold">
            ← Back to Services
          </Link>

          <div className="mt-6">
            <span className="badge badge-primary">
              {service.category}
            </span>

            <h1 className="mt-4 text-3xl font-bold md:text-5xl">
              {service.title}
            </h1>

            <p className="mt-4 max-w-2xl text-base-content/60">
              Professional repair service from trusted FixMate technicians.
            </p>
          </div>

        </div>
      </section>

      {/* Details Section */}
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-3">

        {/* Service Information */}
        <div className="space-y-8 lg:col-span-2">

          <img
            src={service.image}
            alt={service.title}
            className="h-72 w-full rounded-2xl object-cover md:h-96"
          />

          <div>
            <h2 className="text-2xl font-bold">
              About This Service
            </h2>

            <p className="mt-4 leading-8 text-base-content/70">
              {service.description}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              What's Included?
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {service.features.map((feature) => (
                <div
                  key={feature}
                  className="rounded-xl bg-base-200 p-4"
                >
                  <span className="mr-2 text-success">✓</span>
                  {feature}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Price Card */}
        <aside>
          <div className="sticky top-24 rounded-2xl border border-base-300 p-6 shadow-lg">

            <p className="text-sm text-base-content/60">
              Starting Service Price
            </p>

            <h2 className="mt-2 text-3xl font-bold text-primary">
              ৳{service.price}
            </h2>

            <div className="divider"></div>

            <div className="space-y-4">

              <div className="flex justify-between gap-3">
                <span className="text-base-content/60">
                  Service
                </span>
                <span className="font-semibold text-right">
                  {service.title}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-base-content/60">
                  Category
                </span>
                <span className="font-semibold">
                  {service.category}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-base-content/60">
                  Service ID
                </span>
                <span className="font-semibold">
                  #{service.id}
                </span>
              </div>

            </div>

            <div className="divider"></div>

            <p className="text-sm leading-6 text-base-content/60">
              Final repair cost may vary depending on the problem
              and required parts.
            </p>

            <button
              className="btn btn-primary mt-6 w-full"
              disabled
            >
              Booking Coming Soon
            </button>

          </div>
        </aside>

      </section>

    </main>
  );
}