"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import { getCustomerBookings } from "@/lib/api";

export default function CustomerDashboard() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = useCallback(async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      setError("");

      const data = await getCustomerBookings(user.email);
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Customer dashboard error:", err);
      setError(err.message || "Failed to load dashboard data");
      toast.error(err.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    if (isPending) return;

    if (!user) {
      router.push("/sign-in");
      return;
    }

    if (user.role !== "customer") {
      toast.error("You are not allowed to access this dashboard");
      router.push("/dashboard");
      return;
    }

    loadDashboardData();
  }, [isPending, user, router, loadDashboardData]);

  const formatDate = (date) => {
    if (!date) return "N/A";
    const value = new Date(date);
    if (Number.isNaN(value.getTime())) return "N/A";

    return value.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatus = (status) => {
    const statusList = {
      requested: {
        label: "Requested",
        className: "badge-info",
      },
      accepted: {
        label: "Accepted",
        className: "badge-primary",
      },
      "in-progress": {
        label: "In Progress",
        className: "badge-warning",
      },
      completed: {
        label: "Completed",
        className: "badge-success",
      },
      rejected: {
        label: "Rejected",
        className: "badge-error",
      },
      cancelled: {
        label: "Cancelled",
        className: "badge-neutral",
      },
    };

    return (
      statusList[status] || {
        label: status || "Unknown",
        className: "badge-ghost",
      }
    );
  };

  const totalRequests = bookings.length;

  const activeJobs = bookings.filter((booking) =>
    ["accepted", "in-progress"].includes(booking.status)
  ).length;

  const completedJobs = bookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  const pendingRequests = bookings.filter(
    (booking) => booking.status === "requested"
  ).length;

  const recentBookings = [...bookings]
    .sort((a, b) => {
      return (
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
      );
    })
    .slice(0, 5);

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
    <div className="space-y-6">
      {/* Dashboard Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Customer Dashboard</h1>
          <p className="mt-2 text-base-content/60">
            Welcome back, {user.name || "Customer"}! Manage your repair bookings
            and payments.
          </p>
        </div>

        <button
          onClick={loadDashboardData}
          className="btn btn-outline btn-primary"
          disabled={loading}
        >
          <span>↻</span>
          Refresh Dashboard
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
          <button onClick={loadDashboardData} className="btn btn-sm">
            Try Again
          </button>
        </div>
      )}

      {/* Dashboard Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="stat rounded-xl border border-base-300 bg-base-100 shadow-sm">
          <div className="stat-figure text-primary">
            <span className="text-3xl">📋</span>
          </div>
          <div className="stat-title">Total Requests</div>
          <div className="stat-value text-primary">{totalRequests}</div>
          <div className="stat-desc">All your repair requests</div>
        </div>

        <div className="stat rounded-xl border border-base-300 bg-base-100 shadow-sm">
          <div className="stat-figure text-info">
            <span className="text-3xl">🔧</span>
          </div>
          <div className="stat-title">Active Jobs</div>
          <div className="stat-value text-info">{activeJobs}</div>
          <div className="stat-desc">Accepted and in-progress jobs</div>
        </div>

        <div className="stat rounded-xl border border-base-300 bg-base-100 shadow-sm">
          <div className="stat-figure text-success">
            <span className="text-3xl">✅</span>
          </div>
          <div className="stat-title">Completed Jobs</div>
          <div className="stat-value text-success">{completedJobs}</div>
          <div className="stat-desc">Successfully completed jobs</div>
        </div>

        <div className="stat rounded-xl border border-base-300 bg-base-100 shadow-sm">
          <div className="stat-figure text-warning">
            <span className="text-3xl">⏳</span>
          </div>
          <div className="stat-title">Requested</div>
          <div className="stat-value text-warning">{pendingRequests}</div>
          <div className="stat-desc">Waiting for technician response</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/services" className="btn btn-primary">
            Browse Services
          </Link>
          <Link
            href="/dashboard/customer/my-bookings"
            className="btn btn-outline btn-primary"
          >
            My Bookings
          </Link>
          <Link
            href="/dashboard/customer/payments"
            className="btn btn-outline"
          >
            Payment History
          </Link>
          <Link href="/dashboard/profile" className="btn btn-outline">
            My Profile
          </Link>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold">Recent Bookings</h2>
            <p className="mt-1 text-sm text-base-content/60">
              Your latest repair service requests
            </p>
          </div>

          <Link
            href="/dashboard/customer/my-bookings"
            className="btn btn-sm btn-outline btn-primary"
          >
            View All Bookings
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="py-10 text-center">
            <div className="mb-3 text-5xl">🔧</div>
            <h3 className="text-lg font-bold">No Bookings Yet</h3>
            <p className="mt-2 text-sm text-base-content/60">
              You haven&apos;t requested any repair service yet.
            </p>
            <Link href="/services" className="btn btn-primary mt-4">
              Browse Services
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Preferred Date</th>
                  <th>Technician</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => {
                  const status = getStatus(booking.status);

                  return (
                    <tr key={booking._id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="h-12 w-12 rounded-lg bg-base-200">
                              {booking.serviceImage ? (
                                <img
                                  src={booking.serviceImage}
                                  alt={booking.serviceTitle || "Service"}
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center text-xl">
                                  🔧
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <div className="font-bold">
                              {booking.serviceTitle || "Repair Service"}
                            </div>
                            <div className="text-xs text-base-content/60">
                              {booking.category || "General"}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>{formatDate(booking.preferredDate)}</td>
                      <td>{booking.technicianName || "Not assigned"}</td>
                      <td className="font-semibold">
                        ${booking.finalAmount ?? booking.basePrice ?? 0}
                      </td>
                      <td>
                        <span className={`badge ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Help Section */}
      <div className="rounded-xl bg-primary p-6 text-primary-content">
        <h2 className="text-xl font-bold">Need a Repair Service?</h2>
        <p className="mt-2 text-sm opacity-90">
          Explore our available repair services and book a trusted technician
          for your device or home appliance.
        </p>
        <Link
          href="/services"
          className="btn mt-4 border-none bg-base-100 text-primary hover:bg-base-200"
        >
          Explore Services
        </Link>
      </div>
    </div>
  );
}