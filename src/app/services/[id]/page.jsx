"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import BookingRequestForm from "@/components/services/BookingRequestForm";
import { getSingleService } from "@/lib/api";

export default function ServiceDetailsPage() {
  const params = useParams();
  const id = params.id;

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getSingleService(id)
      .then((data) => {
        if (!data || !data._id || data.approvalStatus !== "approved" || !data.isAvailable) {
          setError("Service Not Found");
          return;
        }

        setService(data);
      })
      .catch(() => setError("Failed to load service"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error || !service) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-3xl font-bold">Service Not Found</h1>
        <p>This service does not exist or is not available.</p>
        <Link href="/services" className="btn btn-primary">
          Back to Services
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-base-100">

      {/* Header */}
      <section className="bg-base-200 px-5 py-12">
        <div className="mx-auto max-w-7xl">
          <Link href="/services" className="font-semibold text-primary">
            ← Back to Services
          </Link>

          <div className="mt-6">
            <span className="badge badge-primary">
              {service.category}
            </span>

            <h1 className="mt-4 text-3xl font-bold md:text-5xl">
              {service.title}
            </h1>

            <p className="mt-4 text-base-content/60">
              Professional repair service from FixMate technicians.
            </p>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-3">

        {/* Service Information */}
        <div className="space-y-8 lg:col-span-2">

          <img
            src={service.image}
            alt={service.title}
            className="h-72 w-full rounded-2xl object-cover md:h-96"
          />

          <div>
            <h2 className="text-2xl font-bold">About This Service</h2>
            <p className="mt-4 leading-8 text-base-content/70">
              {service.description}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold">Service Information</h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-base-200 p-4">
                <p className="text-sm opacity-60">Estimated Duration</p>
                <p className="font-bold">{service.estimatedDuration}</p>
              </div>

              <div className="rounded-xl bg-base-200 p-4">
                <p className="text-sm opacity-60">Service Mode</p>
                <p className="font-bold">{service.serviceMode}</p>
              </div>

              <div className="rounded-xl bg-base-200 p-4">
                <p className="text-sm opacity-60">Service Area</p>
                <p className="font-bold">{service.serviceArea}</p>
              </div>

              <div className="rounded-xl bg-base-200 p-4">
                <p className="text-sm opacity-60">Category</p>
                <p className="font-bold">{service.category}</p>
              </div>
            </div>
          </div>

          {/* Technician Information */}
          <div className="rounded-2xl border p-6">
            <h2 className="text-2xl font-bold">Technician Information</h2>

            <div className="mt-4 space-y-2">
              <p>
                <strong>Name:</strong> {service.technicianName}
              </p>
              <p>
                <strong>Service Area:</strong> {service.serviceArea}
              </p>
              <p>
                <strong>Email:</strong> {service.technicianEmail}
              </p>
            </div>
          </div>
        </div>

        {/* Price & Booking */}
        <aside>
          <div className="sticky top-24 rounded-2xl border border-base-300 p-6 shadow-lg">

            <p className="text-sm opacity-60">Starting Service Price</p>

            <h2 className="mt-2 text-3xl font-bold text-primary">
              ৳{service.basePrice}
            </h2>

            <div className="divider"></div>

            <div className="space-y-4">
              <div className="flex justify-between gap-3">
                <span className="opacity-60">Service</span>
                <span className="font-semibold">{service.title}</span>
              </div>

              <div className="flex justify-between">
                <span className="opacity-60">Duration</span>
                <span className="font-semibold">{service.estimatedDuration}</span>
              </div>

              <div className="flex justify-between">
                <span className="opacity-60">Mode</span>
                <span className="font-semibold">{service.serviceMode}</span>
              </div>
            </div>

            <div className="divider"></div>

            <BookingRequestForm service={service} />

          </div>
        </aside>
      </section>
    </main>
  );
}