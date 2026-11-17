
const services = [
  {
    id: 1,
    title: "AC Repair & Servicing",
    category: "Home Appliance",
    price: "৳500",
    icon: "❄️",
    description: "Professional AC repair, cleaning and maintenance services.",
  },
  {
    id: 2,
    title: "Laptop Repair",
    category: "Computer",
    price: "৳400",
    icon: "💻",
    description: "Expert laptop diagnosis, hardware and software repair.",
  },
  {
    id: 3,
    title: "Mobile Repair",
    category: "Electronics",
    price: "৳300",
    icon: "📱",
    description: "Fast and reliable mobile phone repair services.",
  },
  {
    id: 4,
    title: "Refrigerator Repair",
    category: "Home Appliance",
    price: "৳600",
    icon: "🧊",
    description: "Reliable refrigerator repair and maintenance solutions.",
  },
  {
    id: 5,
    title: "TV Repair",
    category: "Electronics",
    price: "৳500",
    icon: "📺",
    description: "Professional LED, LCD and Smart TV repair services.",
  },
  {
    id: 6,
    title: "Washing Machine Repair",
    category: "Home Appliance",
    price: "৳550",
    icon: "🫧",
    description: "Expert washing machine repair at your doorstep.",
  },
];

const FeaturedServices = () => {
  return (
    <section className="bg-base-100 px-5 py-20">
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mb-12 text-center">
          <p className="font-semibold uppercase tracking-widest text-primary">
            Our Services
          </p>

          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            Featured Repair Services
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base-content/60">
            Find trusted professionals for all your repair
            needs. Quality service is just one click away.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="card border border-base-300 bg-base-100 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="card-body">

                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-3xl">
                    {service.icon}
                  </div>

                  <span className="badge badge-outline badge-primary">
                    {service.category}
                  </span>
                </div>

                <h3 className="card-title mt-4">
                  {service.title}
                </h3>

                <p className="text-sm text-base-content/60">
                  {service.description}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-base-300 pt-4">
                  <div>
                    <p className="text-xs text-base-content/50">
                      Starting from
                    </p>
                    <p className="text-xl font-bold text-primary">
                      {service.price}
                    </p>
                  </div>

                  <button className="btn btn-primary btn-sm">
                    View Details
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <button className="btn btn-outline btn-primary">
            View All Services
          </button>
        </div>

      </div>
    </section>
  );
};

export default FeaturedServices;
