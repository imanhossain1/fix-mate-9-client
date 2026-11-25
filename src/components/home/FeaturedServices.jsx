import Link from "next/link";
import { getServices } from "@/lib/api";

export default async function FeaturedServices() {
  let featuredServices = [];

  try {
    const allServices = await getServices();
    const list = Array.isArray(allServices)
      ? allServices
      : allServices?.services || allServices?.data || [];

    featuredServices = list
      .filter(
        (item) => item?.approvalStatus === "approved" && item?.isAvailable !== false
      )
      .slice(0, 6);
  } catch (error) {
    console.error("Failed to load featured services:", error);
    featuredServices = [];
  }

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
            Find trusted professionals for all your repair needs. Quality service
            is just one click away.
          </p>
        </div>

        {/* Service Cards (Max 6) */}
        {featuredServices.length === 0 ? (
          <div className="rounded-2xl border border-base-300 bg-base-100 p-10 text-center">
            <p className="text-lg font-medium text-base-content/70">
              No featured services available right now.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredServices.map((service) => (
              <div
                key={service._id}
                className="card flex h-full flex-col justify-between border border-base-300 bg-base-100 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="card-body flex h-full flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      {service.image ? (
                        <img
                          src={service.image}
                          alt={service.title}
                          className="h-14 w-14 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-2xl font-bold text-primary">
                          🔧
                        </div>
                      )}

                      <span className="badge badge-outline badge-primary">
                        {service.category}
                      </span>
                    </div>

                    <h3 className="card-title mt-4 line-clamp-1">
                      {service.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm text-base-content/60">
                      {service.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-base-content/70">
                      {service.serviceMode && (
                        <span className="badge badge-ghost">
                          {service.serviceMode}
                        </span>
                      )}
                      {service.technicianName && (
                        <span className="badge badge-ghost">
                          By {service.technicianName}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-base-300 pt-4">
                    <div>
                      <p className="text-xs text-base-content/50">
                        Starting from
                      </p>
                      <p className="text-xl font-bold text-primary">
                        ৳{service.basePrice}
                      </p>
                    </div>

                    <Link
                      href={`/services/${service._id}`}
                      className="btn btn-primary btn-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Link href="/services" className="btn btn-outline btn-primary">
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
}