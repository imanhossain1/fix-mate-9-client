
"use client";

import { useEffect, useState } from "react";
import { getAdminBookings } from "@/lib/api";
import toast from "react-hot-toast";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  // Load all bookings from server
  const loadBookings = async () => {
    try {
      setLoading(true);

      const data = await getAdminBookings();

      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Booking loading error:", error);
      toast.error(error.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  // Booking status badge color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "requested":
        return "badge-info";

      case "accepted":
        return "badge-primary";

      case "in-progress":
        return "badge-warning";

      case "completed":
        return "badge-success";

      case "rejected":
        return "badge-error";

      case "cancelled":
        return "badge-ghost";

      default:
        return "badge-ghost";
    }
  };

  // Format date safely
  const formatDate = (date) => {
    if (!date) return "N/A";

    const formattedDate = new Date(date);

    if (Number.isNaN(formattedDate.getTime())) {
      return "N/A";
    }

    return formattedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Count bookings by status
  const countStatus = (status) => {
    return bookings.filter(
      (booking) => booking.status?.toLowerCase() === status
    ).length;
  };

  // Filter and search bookings
  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus =
      filter === "all" ||
      booking.status?.toLowerCase() === filter;

    const searchText = search.toLowerCase();

    const matchesSearch =
      (booking.customerName || "").toLowerCase().includes(searchText) ||
      (booking.customerEmail || "").toLowerCase().includes(searchText) ||
      (booking.technicianName || "").toLowerCase().includes(searchText) ||
      (booking.serviceTitle || "").toLowerCase().includes(searchText);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Page Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold">
              All Bookings
            </h1>

            <p className="mt-2 text-sm text-base-content/60">
              Monitor all repair requests across the FixMate platform.
            </p>
          </div>

          <button
            onClick={loadBookings}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Loading
              </>
            ) : (
              <>
                <span>↻</span>
                Refresh Bookings
              </>
            )}
          </button>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <p className="text-sm text-base-content/60">
                Total Bookings
              </p>

              <h2 className="text-3xl font-bold">
                {bookings.length}
              </h2>

              <p className="text-xs text-base-content/50">
                All repair requests
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <p className="text-sm text-base-content/60">
                Requested
              </p>

              <h2 className="text-3xl font-bold text-info">
                {countStatus("requested")}
              </h2>

              <p className="text-xs text-base-content/50">
                Waiting for technician
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <p className="text-sm text-base-content/60">
                Active Jobs
              </p>

              <h2 className="text-3xl font-bold text-warning">
                {countStatus("accepted") + countStatus("in-progress")}
              </h2>

              <p className="text-xs text-base-content/50">
                Accepted and in progress
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <p className="text-sm text-base-content/60">
                Completed Jobs
              </p>

              <h2 className="text-3xl font-bold text-success">
                {countStatus("completed")}
              </h2>

              <p className="text-xs text-base-content/50">
                Finished repair jobs
              </p>
            </div>
          </div>

        </div>

        {/* Status Overview */}
        <div className="mb-8 rounded-xl bg-base-100 p-5 shadow">
          <h2 className="mb-4 text-lg font-bold">
            Booking Status Overview
          </h2>

          <div className="flex flex-wrap gap-3">
            <span className="badge badge-info badge-lg">
              Requested: {countStatus("requested")}
            </span>

            <span className="badge badge-primary badge-lg">
              Accepted: {countStatus("accepted")}
            </span>

            <span className="badge badge-warning badge-lg">
              In Progress: {countStatus("in-progress")}
            </span>

            <span className="badge badge-success badge-lg">
              Completed: {countStatus("completed")}
            </span>

            <span className="badge badge-error badge-lg">
              Rejected: {countStatus("rejected")}
            </span>

            <span className="badge badge-ghost badge-lg">
              Cancelled: {countStatus("cancelled")}
            </span>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col gap-4 rounded-xl bg-base-100 p-5 shadow lg:flex-row lg:items-center lg:justify-between">

          <div className="w-full lg:max-w-sm">
            <input
              type="text"
              placeholder="Search customer, technician or service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              "all",
              "requested",
              "accepted",
              "in-progress",
              "completed",
              "rejected",
              "cancelled",
            ].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`btn btn-sm capitalize ${
                  filter === status
                    ? "btn-primary"
                    : "btn-outline"
                }`}
              >
                {status === "all"
                  ? "All"
                  : status === "in-progress"
                  ? "In Progress"
                  : status}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings Table */}
        <div className="overflow-hidden rounded-xl bg-base-100 shadow">

          <div className="flex flex-col justify-between gap-2 border-b border-base-300 p-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold">
                Booking Records
              </h2>

              <p className="mt-1 text-sm text-base-content/60">
                Showing {filteredBookings.length} of {bookings.length} bookings
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="py-20 text-center">
              <div className="mb-3 text-5xl">📋</div>

              <h3 className="text-xl font-bold">
                No bookings found
              </h3>

              <p className="mt-2 text-sm text-base-content/60">
                No booking matches your search or selected status.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra">

                <thead>
                  <tr>
                    <th>#</th>
                    <th>Service</th>
                    <th>Customer</th>
                    <th>Technician</th>
                    <th>Preferred Date</th>
                    <th>Amount</th>
                    <th>Booking Status</th>
                    <th>Payment</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBookings.map((booking, index) => (
                    <tr key={booking._id || index}>

                      {/* Serial */}
                      <td>{index + 1}</td>

                      {/* Service */}
                      <td>
                        <div className="flex min-w-48 items-center gap-3">
                          {booking.serviceImage ? (
                            <img
                              src={booking.serviceImage}
                              alt={booking.serviceTitle || "Service"}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-base-200">
                              🔧
                            </div>
                          )}

                          <div>
                            <p className="font-semibold">
                              {booking.serviceTitle || "N/A"}
                            </p>

                            <p className="text-xs text-base-content/60">
                              {booking.category || "Repair Service"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Customer */}
                      <td>
                        <p className="font-semibold">
                          {booking.customerName || "N/A"}
                        </p>

                        <p className="text-xs text-base-content/60">
                          {booking.customerEmail || "N/A"}
                        </p>
                      </td>

                      {/* Technician */}
                      <td>
                        <p className="font-medium">
                          {booking.technicianName || "N/A"}
                        </p>

                        <p className="text-xs text-base-content/60">
                          {booking.technicianEmail || "N/A"}
                        </p>
                      </td>

                      {/* Preferred Date */}
                      <td>
                        {formatDate(booking.preferredDate)}
                      </td>

                      {/* Amount */}
                      <td>
                        <p className="font-bold">
                          ${booking.finalAmount ?? booking.basePrice ?? 0}
                        </p>

                        <p className="text-xs text-base-content/50">
                          Final / Base
                        </p>
                      </td>

                      {/* Booking Status */}
                      <td>
                        <span
                          className={`badge capitalize ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status || "N/A"}
                        </span>
                      </td>

                      {/* Payment Status */}
                      <td>
                        <span
                          className={`badge ${
                            booking.paymentStatus?.toLowerCase() === "paid"
                              ? "badge-success"
                              : "badge-warning"
                          }`}
                        >
                          {booking.paymentStatus || "unpaid"}
                        </span>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </div>

        {/* Admin Note */}
        <div className="mt-6 rounded-xl border border-base-300 bg-base-100 p-5">
          <h3 className="font-bold">
            Admin Monitoring
          </h3>

          <p className="mt-1 text-sm text-base-content/60">
            Booking status is managed by the assigned technician or customer
            according to the FixMate workflow. Admin can monitor all bookings
            but cannot directly change job status from this page.
          </p>
        </div>

      </div>
    </div>
  );
}
