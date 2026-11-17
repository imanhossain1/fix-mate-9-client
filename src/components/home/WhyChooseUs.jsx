
const benefits = [
  {
    id: 1,
    icon: "🛡️",
    title: "Verified Technicians",
    description:
      "Find skilled and verified technicians you can trust for your repair needs.",
  },
  {
    id: 2,
    icon: "💰",
    title: "Affordable Pricing",
    description:
      "Get transparent repair costs with no unnecessary hidden charges.",
  },
  {
    id: 3,
    icon: "⚡",
    title: "Fast Service",
    description:
      "Book a repair request easily and get help without unnecessary delays.",
  },
  {
    id: 4,
    icon: "⭐",
    title: "Quality Service",
    description:
      "We focus on reliable repairs and a better customer experience.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="bg-base-200 px-5 py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">

        {/* Left Content */}
        <div>
          <p className="font-semibold uppercase tracking-widest text-primary">
            Why Choose Us
          </p>

          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            Why Customers Trust FixMate
          </h2>

          <p className="mt-5 leading-7 text-base-content/60">
            We make repair services simple, convenient and reliable.
            From finding the right technician to completing your
            repair, FixMate helps you every step of the way.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <div
                key={benefit.id}
                className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm"
              >
                <div className="text-3xl">
                  {benefit.icon}
                </div>

                <h3 className="mt-3 font-bold">
                  {benefit.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-base-content/60">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Content */}
        <div className="rounded-3xl bg-primary p-8 text-primary-content md:p-12">
          <div className="text-6xl">🔧</div>

          <h3 className="mt-8 text-3xl font-bold">
            Your Problem, Our Responsibility.
          </h3>

          <p className="mt-5 leading-7 opacity-90">
            Whether it is a broken laptop, faulty AC or a
            household appliance, FixMate connects you with
            the right repair professional.
          </p>

          <div className="mt-8 border-t border-primary-content/30 pt-6">
            <p className="text-lg font-semibold">
              FixMate — Your Trusted Repair Partner.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
