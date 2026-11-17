
const steps = [
  {
    number: "01",
    icon: "🔍",
    title: "Find a Service",
    description:
      "Browse repair services and find the right technician for your needs.",
  },
  {
    number: "02",
    icon: "📅",
    title: "Book a Service",
    description:
      "Choose your preferred service and submit a repair request.",
  },
  {
    number: "03",
    icon: "🛠️",
    title: "Get Repair Done",
    description:
      "Our technician will contact you and complete the repair.",
  },
  {
    number: "04",
    icon: "💳",
    title: "Pay Securely",
    description:
      "Review the final repair amount and pay after service completion.",
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-base-200 px-5 py-20">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mb-14 text-center">
          <p className="font-semibold uppercase tracking-widest text-primary">
            Simple Process
          </p>

          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            How FixMate Works
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base-content/60">
            Getting your home appliances repaired is now easier
            than ever. Just follow these four simple steps.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative rounded-2xl border border-base-300 bg-base-100 p-8 text-center shadow-sm transition hover:-translate-y-2 hover:shadow-lg"
            >
              <span className="absolute right-5 top-5 text-3xl font-bold text-primary/20">
                {step.number}
              </span>

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-4xl">
                {step.icon}
              </div>

              <h3 className="mt-6 text-xl font-bold">
                {step.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-base-content/60">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
