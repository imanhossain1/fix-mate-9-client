
const HeroSection = () => {
  return (
    <section className="bg-base-200">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 md:grid-cols-2 lg:py-28">

        {/* Left Content */}
        <div>
          <div className="badge badge-primary badge-outline mb-5">
            Your Trusted Repair Partner
          </div>

          <h1 className="text-4xl font-bold leading-tight md:text-6xl">
            Expert Repair Services
            <span className="text-primary"> At Your Doorstep.</span>
          </h1>

          <p className="mt-6 max-w-lg text-base-content/70">
            Get reliable and professional technicians for your
            home appliances, electronics, and everyday repairs.
            Book your service easily with FixMate.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button className="btn btn-primary">
              Explore Services
            </button>

            <button className="btn btn-outline">
              How It Works
            </button>
          </div>

          <div className="mt-10 flex gap-8">
            <div>
              <h3 className="text-2xl font-bold">500+</h3>
              <p className="text-sm text-base-content/60">
                Happy Customers
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold">100+</h3>
              <p className="text-sm text-base-content/60">
                Expert Technicians
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold">4.9</h3>
              <p className="text-sm text-base-content/60">
                Customer Rating
              </p>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div>
          <img
            src="https://images.unsplash.com/photo-1581092921461-eab62e97a780"
            alt="Professional technician repairing electronic equipment"
            className="h-[350px] w-full rounded-2xl object-cover shadow-xl md:h-[480px]"
          />
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
