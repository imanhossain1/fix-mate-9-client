
const categories = [
  {
    id: 1,
    icon: "❄️",
    title: "AC Repair",
    description: "AC servicing, installation and repair.",
  },
  {
    id: 2,
    icon: "💻",
    title: "Computer & Laptop",
    description: "Computer and laptop troubleshooting.",
  },
  {
    id: 3,
    icon: "📱",
    title: "Mobile Repair",
    description: "Mobile display, battery and hardware repair.",
  },
  {
    id: 4,
    icon: "📺",
    title: "TV & Electronics",
    description: "LED, LCD and smart TV repair.",
  },
  {
    id: 5,
    icon: "🧊",
    title: "Refrigerator",
    description: "Fridge maintenance and repair.",
  },
  {
    id: 6,
    icon: "🫧",
    title: "Home Appliances",
    description: "Washing machine and other appliance repair.",
  },
];

const PopularCategories = () => {
  return (
    <section className="bg-base-100 px-5 py-20">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mb-12 text-center">
          <p className="font-semibold uppercase tracking-widest text-primary">
            Explore Categories
          </p>

          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            Popular Repair Categories
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base-content/60">
            Whatever the problem, find the right repair
            category and get professional help.
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group flex items-center gap-5 rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm transition hover:border-primary hover:shadow-lg"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-3xl transition group-hover:bg-primary group-hover:text-white">
                {category.icon}
              </div>

              <div>
                <h3 className="text-lg font-bold">
                  {category.title}
                </h3>

                <p className="mt-2 text-sm text-base-content/60">
                  {category.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PopularCategories;
