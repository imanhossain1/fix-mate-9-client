import { Suspense } from "react";
import ServiceCard from "../../components/services/ServiceCard";
import ServicesFilterBar from "../../components/services/ServicesFilterBar";
import { getServices } from "../../lib/api";

export default async function ServicesPage({ searchParams }) {
  const resolvedParams = await searchParams;

  const filters = {
    category: resolvedParams?.category || "",
    search: resolvedParams?.search || "",
    serviceMode: resolvedParams?.serviceMode || "",
    sort: resolvedParams?.sort || "newest",
  };

  const services = await getServices(filters);

  return (
    <main className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">
        {filters.category ? `${filters.category} Services` : "All Repair Services"} (
        {services.length})
      </h1>

      <Suspense fallback={<div className="skeleton h-20 w-full rounded-2xl mb-8" />}>
        <ServicesFilterBar />
      </Suspense>

      {services.length === 0 ? (
        <div className="rounded-xl border border-base-300 p-8 text-center">
          <p className="text-lg font-medium">No services found matching your filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      )}
    </main>
  );
}