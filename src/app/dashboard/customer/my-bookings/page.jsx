
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { getCustomerBookings } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

export default function CustomerMyServicesPage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Load customer bookings
  const loadBookings = async () => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data = await getCustomerBookings(user.email);
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Customer bookings error:", error);
      toast.error(error.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  // Login and role check
  useEffect(() => {
    if (isPending) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "customer") {
      toast.error("You are not allowed to access this page");
      router.push("/dashboard");
      return;
    }

    loadBookings();
  }, [isPending, user?.email, user?.role]);

  // Status label
  const getStatusLabel = (status) => {
    const statusLabels = {
      requested: "Pending",
      accepted: "Approved",
      rejected: "Rejected",
      "in-progress": "In Progress",
      completed: "Completed",
      cancelled: "Cancelled",
    };

    return statusLabels[status] || status || "Unknown";
  };

  // Status color
  const getStatusClass = (status) => {
    const statusClasses = {
      requested: "badge-warning",
      accepted: "badge-info",
      rejected: "badge-error",
      "in-progress": "badge-primary",
      completed: "badge-success",
      cancelled: "badge-neutral",
    };

    return statusClasses[status] || "badge-ghost";
  };

  // Date formatting
  const formatDate = (date) => {
    if (!date) return "Not available";

    const formattedDate = new Date(date);

    if (Number.isNaN(formattedDate.getTime())) {
      return "Not available";
    }

    return formattedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Search and filter
  const filteredBookings = bookings.filter((booking) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      (booking.serviceTitle || "").toLowerCase().includes(searchText) ||
      (booking.category || "").toLowerCase().includes(searchText) ||
      (booking.technicianName || "").toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Summary counts
  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "requested"
  ).length;

  const approvedBookings = bookings.filter(
    (booking) => booking.status === "accepted"
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  const paidBookings = bookings.filter(
    (booking) => booking.paymentStatus === "paid"
  ).length;

  // Loading state
  if (isPending || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!user || user.role !== "customer") {
    return null;
  }

  return (
    <div className="min-h-screen space-y-6 bg-base-200/40 p-4 md:p-6">

      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-base-content md:text-3xl">
            My Bookings
          </h1>

          <p className="mt-1 text-sm text-base-content/60">
            Track and manage your repair service requests.
          </p>
        </div>

        <button
          onClick={loadBookings}
          className="btn btn-outline btn-primary"
          disabled={loading}
        >
          <span>↻</span>
          Refresh Bookings
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-5">
            <p className="text-sm text-base-content/60">Total Bookings</p>
            <h2 className="text-3xl font-bold">{totalBookings}</h2>
          </div>
        </div>

        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-5">
            <p className="text-sm text-base-content/60">Pending</p>
            <h2 className="text-3xl font-bold text-warning">
              {pendingBookings}
            </h2>
          </div>
        </div>

        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-5">
            <p className="text-sm text-base-content/60">Approved</p>
            <h2 className="text-3xl font-bold text-info">
              {approvedBookings}
            </h2>
          </div>
        </div>

        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-5">
            <p className="text-sm text-base-content/60">Completed</p>
            <h2 className="text-3xl font-bold text-success">
              {completedBookings}
            </h2>
          </div>
        </div>

        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-5">
            <p className="text-sm text-base-content/60">Paid Bookings</p>
            <h2 className="text-3xl font-bold text-primary">
              {paidBookings}
            </h2>
          </div>
        </div>

      </div>

      {/* Search and Filter */}
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body gap-4 p-4 md:flex-row md:items-end">

          <div className="w-full flex-1">
            <label className="mb-2 block text-sm font-semibold">
              Search Bookings
            </label>

            <input
              type="text"
              placeholder="Search service, category or technician..."
              className="input input-bordered w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="w-full md:w-60">
            <label className="mb-2 block text-sm font-semibold">
              Filter by Status
            </label>

            <select
              className="select select-bordered w-full"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Bookings</option>
              <option value="requested">Pending</option>
              <option value="accepted">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("all");
            }}
            className="btn btn-ghost"
          >
            Clear Filter
          </button>

        </div>
      </div>

      {/* Booking History */}
      <div className="space-y-4">

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold">Booking History</h2>
            <p className="text-sm text-base-content/60">
              View all your repair service bookings
            </p>
          </div>

          <span className="badge badge-primary badge-outline">
            {filteredBookings.length} bookings found
          </span>
        </div>

        {/* Empty State */}
        {filteredBookings.length === 0 ? (
          <div className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body items-center py-12 text-center">

              <div className="text-5xl">🔧</div>

              <h3 className="mt-3 text-xl font-bold">
                No Bookings Found
              </h3>

              <p className="max-w-md text-sm text-base-content/60">
                {bookings.length === 0
                  ? "You haven't booked any repair service yet."
                  : "No bookings match your search or selected status."}
              </p>

              {bookings.length === 0 ? (
                <button
                  onClick={() => router.push("/services")}
                  className="btn btn-primary mt-3"
                >
                  Browse Services
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("all");
                  }}
                  className="btn btn-outline btn-primary mt-3"
                >
                  Clear Filters
                </button>
              )}

            </div>
          </div>
        ) : (

          filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="card border border-base-300 bg-base-100 shadow-sm"
            >
              <div className="card-body p-4 md:p-6">

                {/* Service Information */}
                <div className="flex flex-col gap-4 sm:flex-row">

                  <div className="h-28 w-full shrink-0 overflow-hidden rounded-lg bg-base-200 sm:w-36">
                    {booking.serviceImage ? (
                      <img
                        src={booking.serviceImage}
                        alt={booking.serviceTitle || "Repair service"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-4xl">
                        🔧
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">

                    <div className="flex flex-wrap items-start justify-between gap-3">

                      <div>
                        <h3 className="text-lg font-bold">
                          {booking.serviceTitle || "Repair Service"}
                        </h3>

                        <p className="mt-1 text-sm text-base-content/60">
                          {booking.category || "General Service"}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className={`badge ${getStatusClass(booking.status)}`}>
                          {getStatusLabel(booking.status)}
                        </span>

                        <span
                          className={`badge ${
                            booking.paymentStatus === "paid"
                              ? "badge-success"
                              : "badge-warning"
                          }`}
                        >
                          {booking.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                        </span>
                      </div>

                    </div>

                    {/* Booking Details */}
                    <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">

                      <div>
                        <p className="text-base-content/50">Booking Date</p>
                        <p className="font-medium">
                          {formatDate(booking.createdAt)}
                        </p>
                      </div>

                      <div>
                        <p className="text-base-content/50">Preferred Date</p>
                        <p className="font-medium">
                          {formatDate(booking.preferredDate)}
                        </p>
                      </div>

                      <div>
                        <p className="text-base-content/50">Technician</p>
                        <p className="font-medium">
                          {booking.technicianName || "Not assigned"}
                        </p>
                      </div>

                      <div>
                        <p className="text-base-content/50">Phone Number</p>
                        <p className="font-medium">
                          {booking.customerPhone || "Not available"}
                        </p>
                      </div>

                      <div>
                        <p className="text-base-content/50">Total Amount</p>
                        <p className="font-bold text-primary">
                          ৳{booking.finalAmount ?? booking.basePrice ?? 0}
                        </p>
                      </div>

                      <div>
                        <p className="text-base-content/50">Payment Status</p>
                        <p className="font-medium capitalize">
                          {booking.paymentStatus || "unpaid"}
                        </p>
                      </div>

                    </div>

                  </div>
                </div>

                {/* Address */}
                <div className="mt-4 rounded-lg bg-base-200 p-3">
                  <p className="text-xs font-semibold text-base-content/50">
                    SERVICE ADDRESS
                  </p>

                  <p className="mt-1 text-sm">
                    {booking.address || "No address provided"}
                  </p>
                </div>

                {/* Problem Description */}
                <div className="mt-3">
                  <p className="text-xs font-semibold text-base-content/50">
                    PROBLEM DESCRIPTION
                  </p>

                  <p className="mt-1 text-sm leading-relaxed">
                    {booking.problemDescription || "No description provided"}
                  </p>
                </div>

              </div>
            </div>
          ))

        )}

      </div>

    </div>
  );
}
