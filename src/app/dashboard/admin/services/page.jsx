
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
    getAdminServices,
    updateServiceApproval,
} from "@/lib/api";

export default function AdminServicesPage() {

    // সব Service রাখার State
    const [services, setServices] = useState([]);

    // প্রথমবার Data Load হওয়ার সময়
    const [loading, setLoading] = useState(true);

    // কোন Service Update হচ্ছে সেটি রাখবে
    const [updatingId, setUpdatingId] = useState(null);

    // কোন Status-এর Service দেখাব
    const [filter, setFilter] = useState("all");

    // API Error রাখবে
    const [error, setError] = useState("");

    // =================================
    // 1. Server থেকে সব Service আনা
    // =================================

    const loadServices = async () => {
        try {
            setError("");

            const data = await getAdminServices();

            setServices(data);

        } catch (error) {
            setError(error.message);
            toast.error(error.message || "Failed to load services");
        } finally {
            setLoading(false);
        }
    };

    // Page Open হলে একবার Service Load হবে
    useEffect(() => {
        loadServices();
    }, []);


    // =================================
    // 2. Service Approve / Reject
    // =================================

    const handleStatus = async (id, status) => {

        // একই Service-এ একাধিকবার Click আটকাবে
        if (updatingId) return;

        try {
            setUpdatingId(id);

            // Loading Toast দেখাবে
            const toastId = toast.loading(
                `Service ${status} হচ্ছে...`
            );

            await updateServiceApproval(id, status);

            // সফল হলে UI-তে Status পরিবর্তন করবে
            setServices((previousServices) =>
                previousServices.map((service) =>
                    service._id === id
                        ? {
                              ...service,
                              approvalStatus: status,
                          }
                        : service
                )
            );

            // Loading Toast সরিয়ে Success দেখাবে
            toast.success(
                `Service ${status} successfully!`,
                { id: toastId }
            );

        } catch (error) {
            toast.error(error.message || "Something went wrong!");
        } finally {
            setUpdatingId(null);
        }
    };


    // =================================
    // 3. Filter অনুযায়ী Service দেখানো
    // =================================

    const filteredServices =
        filter === "all"
            ? services
            : services.filter(
                  (service) =>
                      service.approvalStatus === filter
              );


    // =================================
    // 4. Dashboard Statistics
    // =================================

    const pendingCount = services.filter(
        (service) => service.approvalStatus === "pending"
    ).length;

    const approvedCount = services.filter(
        (service) => service.approvalStatus === "approved"
    ).length;

    const rejectedCount = services.filter(
        (service) => service.approvalStatus === "rejected"
    ).length;


    // =================================
    // 5. Loading UI
    // =================================

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <span className="loading loading-spinner loading-lg text-primary"></span>

                    <p className="mt-4 text-sm opacity-60">
                        Loading services...
                    </p>
                </div>
            </div>
        );
    }


    // =================================
    // 6. Main Dashboard UI
    // =================================

    return (
        <main className="min-h-screen bg-base-200 p-4 md:p-8">

            <div className="mx-auto max-w-7xl">

                {/* Dashboard Header */}
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">

                    <div>
                        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                            FixMate Admin Panel
                        </p>

                        <h1 className="mt-2 text-3xl font-bold md:text-4xl">
                            Manage Services
                        </h1>

                        <p className="mt-2 text-base-content/60">
                            Review and manage technician service requests.
                        </p>
                    </div>

                    {/* Refresh Button */}
                    <button
                        onClick={loadServices}
                        className="btn btn-outline btn-primary"
                    >
                        ↻ Refresh Services
                    </button>

                </div>


                {/* Error Message */}
                {error && (
                    <div className="alert alert-error mb-6">
                        <span>{error}</span>

                        <button
                            onClick={loadServices}
                            className="btn btn-sm"
                        >
                            Retry
                        </button>
                    </div>
                )}


                {/* =================================
                    Dashboard Statistics
                ================================= */}

                <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    {/* Total */}
                    <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
                        <p className="text-sm text-base-content/60">
                            Total Services
                        </p>

                        <h2 className="mt-3 text-3xl font-bold">
                            {services.length}
                        </h2>

                        <p className="mt-2 text-xs text-base-content/50">
                            All technician services
                        </p>
                    </div>

                    {/* Pending */}
                    <div className="rounded-2xl border border-warning/30 bg-base-100 p-5 shadow-sm">
                        <p className="text-sm text-base-content/60">
                            Pending Services
                        </p>

                        <h2 className="mt-3 text-3xl font-bold text-warning">
                            {pendingCount}
                        </h2>

                        <p className="mt-2 text-xs text-base-content/50">
                            Waiting for approval
                        </p>
                    </div>

                    {/* Approved */}
                    <div className="rounded-2xl border border-success/30 bg-base-100 p-5 shadow-sm">
                        <p className="text-sm text-base-content/60">
                            Approved Services
                        </p>

                        <h2 className="mt-3 text-3xl font-bold text-success">
                            {approvedCount}
                        </h2>

                        <p className="mt-2 text-xs text-base-content/50">
                            Available services
                        </p>
                    </div>

                    {/* Rejected */}
                    <div className="rounded-2xl border border-error/30 bg-base-100 p-5 shadow-sm">
                        <p className="text-sm text-base-content/60">
                            Rejected Services
                        </p>

                        <h2 className="mt-3 text-3xl font-bold text-error">
                            {rejectedCount}
                        </h2>

                        <p className="mt-2 text-xs text-base-content/50">
                            Not approved
                        </p>
                    </div>

                </div>


                {/* =================================
                    Filter Section
                ================================= */}

                <div className="mb-6 rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm">

                    <div className="mb-3">
                        <h2 className="font-bold">
                            All Service Requests
                        </h2>

                        <p className="text-sm text-base-content/60">
                            Filter services by approval status.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">

                        {["all", "pending", "approved", "rejected"].map(
                            (status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilter(status)}
                                    className={`btn btn-sm ${
                                        filter === status
                                            ? "btn-primary"
                                            : "btn-outline"
                                    }`}
                                >
                                    {status.charAt(0).toUpperCase() +
                                        status.slice(1)}

                                    {status === "all"
                                        ? ` (${services.length})`
                                        : ` (${
                                              status === "pending"
                                                  ? pendingCount
                                                  : status === "approved"
                                                  ? approvedCount
                                                  : rejectedCount
                                          })`}
                                </button>
                            )
                        )}

                    </div>
                </div>


                {/* =================================
                    Service Cards
                ================================= */}

                {filteredServices.length === 0 ? (

                    // কোনো Service না থাকলে
                    <div className="rounded-2xl border border-base-300 bg-base-100 px-5 py-16 text-center shadow-sm">

                        <div className="mb-4 text-5xl">
                            🔧
                        </div>

                        <h2 className="text-xl font-bold">
                            No Services Found
                        </h2>

                        <p className="mt-2 text-sm text-base-content/60">
                            No services available in this category.
                        </p>

                    </div>

                ) : (

                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                        {filteredServices.map((service) => (

                            <div
                                key={service._id}
                                className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                            >

                                {/* Service Image */}
                                <div className="relative">

                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        className="h-52 w-full object-cover"
                                    />

                                    {/* Status Badge */}
                                    <span
                                        className={`badge absolute right-3 top-3 border-0 px-3 py-3 font-semibold ${
                                            service.approvalStatus === "approved"
                                                ? "badge-success"
                                                : service.approvalStatus === "rejected"
                                                ? "badge-error"
                                                : "badge-warning"
                                        }`}
                                    >
                                        {service.approvalStatus}
                                    </span>

                                </div>


                                {/* Service Details */}
                                <div className="space-y-4 p-5">

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                                            {service.category}
                                        </p>

                                        <h2 className="mt-1 text-xl font-bold">
                                            {service.title}
                                        </h2>
                                    </div>

                                    <p className="line-clamp-2 text-sm leading-6 text-base-content/60">
                                        {service.description}
                                    </p>


                                    {/* Price */}
                                    <div className="flex items-center justify-between rounded-xl bg-base-200 p-3">

                                        <div>
                                            <p className="text-xs text-base-content/60">
                                                Starting Price
                                            </p>

                                            <p className="text-xl font-bold text-primary">
                                                ৳{service.basePrice}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-xs text-base-content/60">
                                                Duration
                                            </p>

                                            <p className="font-semibold">
                                                {service.estimatedDuration}
                                            </p>
                                        </div>

                                    </div>


                                    {/* Technician Information */}
                                    <div className="space-y-2 border-t border-base-300 pt-4">

                                        <h3 className="text-sm font-bold">
                                            Technician Information
                                        </h3>

                                        <p className="text-sm">
                                            <strong>Name:</strong>{" "}
                                            {service.technicianName}
                                        </p>

                                        <p className="break-all text-sm">
                                            <strong>Email:</strong>{" "}
                                            {service.technicianEmail}
                                        </p>

                                        <p className="text-sm">
                                            <strong>Area:</strong>{" "}
                                            {service.serviceArea}
                                        </p>

                                        <p className="text-sm">
                                            <strong>Mode:</strong>{" "}
                                            {service.serviceMode}
                                        </p>

                                    </div>


                                    {/* Approve / Reject Buttons */}
                                    <div className="grid grid-cols-2 gap-3 border-t border-base-300 pt-4">

                                        {service.approvalStatus !== "approved" ? (

                                            <button
                                                onClick={() =>
                                                    handleStatus(
                                                        service._id,
                                                        "approved"
                                                    )
                                                }
                                                disabled={updatingId !== null}
                                                className="btn btn-success btn-sm"
                                            >
                                                {updatingId === service._id
                                                    ? "Updating..."
                                                    : "✓ Approve"}
                                            </button>

                                        ) : (

                                            <button
                                                disabled
                                                className="btn btn-success btn-sm"
                                            >
                                                ✓ Approved
                                            </button>

                                        )}


                                        {service.approvalStatus !== "rejected" ? (

                                            <button
                                                onClick={() =>
                                                    handleStatus(
                                                        service._id,
                                                        "rejected"
                                                    )
                                                }
                                                disabled={updatingId !== null}
                                                className="btn btn-error btn-outline btn-sm"
                                            >
                                                {updatingId === service._id
                                                    ? "Updating..."
                                                    : "✕ Reject"}
                                            </button>

                                        ) : (

                                            <button
                                                disabled
                                                className="btn btn-error btn-outline btn-sm"
                                            >
                                                Rejected
                                            </button>

                                        )}

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </main>
    );
}
