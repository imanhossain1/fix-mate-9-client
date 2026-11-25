
"use client";

import { useEffect, useState } from "react";
import {
  getAllUsers,
  getAdminServices,
  getAdminBookings,
} from "@/lib/api";

import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  // Load dashboard data from backend
  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const [usersData, servicesData, bookingsData] =
        await Promise.all([
          getAllUsers(),
          getAdminServices(),
          getAdminBookings(),
        ]);

      setUsers(Array.isArray(usersData) ? usersData : []);
      setServices(Array.isArray(servicesData) ? servicesData : []);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);

    } catch (error) {
      console.error("Admin dashboard error:", error);

      toast.error(error.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Count users by role
  const customerCount = users.filter(
    (user) => user.role?.toLowerCase() === "customer"
  ).length;

  const technicianCount = users.filter(
    (user) => user.role?.toLowerCase() === "technician"
  ).length;

  // Recent bookings
  const recentBookings = [...bookings]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    )
    .slice(0, 5);

  // Format date
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

  // Booking status color
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

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">

      <div className="mx-auto max-w-7xl">

        {/* Dashboard Heading */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <h1 className="mb-2 text-2xl font-bold md:text-3xl">
              Admin Dashboard
            </h1>

            <p className="text-base-content/60">
              Welcome to FixMate Admin Panel
            </p>
          </div>

          <button
            onClick={loadDashboardData}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Loading
              </>
            ) : (
              <>↻ Refresh Dashboard</>
            )}
          </button>

        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : (
          <>

            {/* Statistics Cards */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

              {/* Total Users */}
              <div className="stat rounded-xl bg-base-100 shadow">
                <div className="stat-title">
                  Total Users
                </div>

                <div className="stat-value text-primary">
                  {users.length}
                </div>

                <div className="stat-desc">
                  All registered users
                </div>
              </div>

              {/* Customers */}
              <div className="stat rounded-xl bg-base-100 shadow">
                <div className="stat-title">
                  Customers
                </div>

                <div className="stat-value text-success">
                  {customerCount}
                </div>

                <div className="stat-desc">
                  Registered customers
                </div>
              </div>

              {/* Technicians */}
              <div className="stat rounded-xl bg-base-100 shadow">
                <div className="stat-title">
                  Technicians
                </div>

                <div className="stat-value text-info">
                  {technicianCount}
                </div>

                <div className="stat-desc">
                  Registered technicians
                </div>
              </div>

              {/* Total Services */}
              <div className="stat rounded-xl bg-base-100 shadow">
                <div className="stat-title">
                  Total Services
                </div>

                <div className="stat-value text-warning">
                  {services.length}
                </div>

                <div className="stat-desc">
                  All repair services
                </div>
              </div>

            </div>

            {/* Booking Statistics */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <div className="stat rounded-xl bg-base-100 shadow">
                <div className="stat-title">
                  Total Bookings
                </div>

                <div className="stat-value">
                  {bookings.length}
                </div>

                <div className="stat-desc">
                  All repair requests
                </div>
              </div>

              <div className="stat rounded-xl bg-base-100 shadow">
                <div className="stat-title">
                  Requested
                </div>

                <div className="stat-value text-info">
                  {bookings.filter(
                    (b) => b.status?.toLowerCase() === "requested"
                  ).length}
                </div>

                <div className="stat-desc">
                  Waiting for technician
                </div>
              </div>

              <div className="stat rounded-xl bg-base-100 shadow">
                <div className="stat-title">
                  Active Jobs
                </div>

                <div className="stat-value text-warning">
                  {bookings.filter((b) =>
                    ["accepted", "in-progress"].includes(
                      b.status?.toLowerCase()
                    )
                  ).length}
                </div>

                <div className="stat-desc">
                  Ongoing repair jobs
                </div>
              </div>

              <div className="stat rounded-xl bg-base-100 shadow">
                <div className="stat-title">
                  Completed Jobs
                </div>

                <div className="stat-value text-success">
                  {bookings.filter(
                    (b) => b.status?.toLowerCase() === "completed"
                  ).length}
                </div>

                <div className="stat-desc">
                  Finished repair jobs
                </div>
              </div>

            </div>

            {/* Recent Bookings */}
            <div className="overflow-hidden rounded-xl bg-base-100 shadow">

              <div className="border-b border-base-300 p-5">
                <h2 className="text-xl font-bold">
                  Recent Bookings
                </h2>

                <p className="mt-1 text-sm text-base-content/60">
                  Latest repair requests from FixMate customers.
                </p>
              </div>

              {recentBookings.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="mb-3 text-5xl">
                    📋
                  </div>

                  <h3 className="text-lg font-bold">
                    No bookings found
                  </h3>

                  <p className="mt-2 text-sm text-base-content/60">
                    Booking information will appear here.
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
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {recentBookings.map((booking, index) => (
                        <tr key={booking._id || index}>

                          <td>{index + 1}</td>

                          <td>
                            <div className="font-semibold">
                              {booking.serviceTitle || "N/A"}
                            </div>

                            <div className="text-xs text-base-content/60">
                              {booking.category || "Repair Service"}
                            </div>
                          </td>

                          <td>
                            <div className="font-medium">
                              {booking.customerName || "N/A"}
                            </div>

                            <div className="text-xs text-base-content/60">
                              {booking.customerEmail || "N/A"}
                            </div>
                          </td>

                          <td>
                            {booking.technicianName || "N/A"}
                          </td>

                          <td>
                            {formatDate(booking.preferredDate)}
                          </td>

                          <td className="font-bold">
                            ${booking.finalAmount ?? booking.basePrice ?? 0}
                          </td>

                          <td>
                            <span
                              className={`badge capitalize ${getStatusColor(
                                booking.status
                              )}`}
                            >
                              {booking.status || "N/A"}
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
                This dashboard displays real-time data retrieved
                from the FixMate database. Admin can monitor users,
                services and bookings from this panel.
              </p>
            </div>

          </>
        )}

      </div>
    </div>
  );
}
