"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import { getTechnicianBookings, getTechnicianServices } from "@/lib/api";

export default function TechnicianDashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = useCallback(async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      setError("");

      const [servicesData, bookingsData] = await Promise.all([
        getTechnicianServices(user.email),
        getTechnicianBookings(user.email),
      ]);

      setServices(Array.isArray(servicesData) ? servicesData : []);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
    } catch (err) {
      console.error("Technician dashboard load error:", err);
      const msg = err?.message || "Failed to load technician dashboard data";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    if (isPending) return;

    if (!user) {
      router.replace("/sign-in");
      return;
    }

    if ((user.role || "").toLowerCase() !== "technician") {
      toast.error("Only technicians can access this dashboard");
      router.replace("/dashboard");
      return;
    }

    loadDashboardData();
  }, [isPending, user, router, loadDashboardData]);

  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";
    const parsed = new Date(dateValue);
    if (Number.isNaN(parsed.getTime())) return "N/A";

    return parsed.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const map = {
      requested: { label: "Requested", cls: "badge-warning" },
      accepted: { label: "Accepted", cls: "badge-info" },
      "in-progress": { label: "In Progress", cls: "badge-primary" },
      completed: { label: "Completed", cls: "badge-success" },
      rejected: { label: "Rejected", cls: "badge-error" },
      cancelled: { label: "Cancelled", cls: "badge-neutral" },
    };

    return map[status] || { label: status || "Unknown", cls: "badge-ghost" };
  };

  const myServicesCount = services.length;
  const newRequestsCount = bookings.filter(
    (b) => b.status === "requested"
  ).length;
  const inProgressCount = bookings.filter(
    (b) => b.status === "in-progress"
  ).length;
  const completedJobsCount = bookings.filter(
    (b) => b.status === "completed"
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

  if (!user || (user.role || "").toLowerCase() !== "technician") {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold mb-1">Technician Dashboard</h1>
          <p className="text-base-content/60">
            Manage your repair services and customer bookings.
          </p>
        </div>

        <button
          type="button"
          onClick={loadDashboardData}
          disabled={loading}
          className="btn btn-outline btn-primary btn-sm"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
          <button
            type="button"
            onClick={loadDashboardData}
            className="btn btn-sm"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="stat bg-base-100 shadow rounded-xl">
          <div className="stat-title">My Services</div>
          <div className="stat-value text-primary">{myServicesCount}</div>
          <div className="stat-desc">Your listed services</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-xl">
          <div className="stat-title">New Requests</div>
          <div className="stat-value text-warning">{newRequestsCount}</div>
          <div className="stat-desc">Waiting for your response</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-xl">
          <div className="stat-title">In Progress</div>
          <div className="stat-value text-info">{inProgressCount}</div>
          <div className="stat-desc">Ongoing repair jobs</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-xl">
          <div className="stat-title">Completed Jobs</div>
          <div className="stat-value text-success">{completedJobsCount}</div>
          <div className="stat-desc">Successfully completed</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-base-100 rounded-xl shadow p-5">
        <h2 className="text-lg font-bold mb-4">Quick Actions</h2>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/technician/add-service"
            className="btn btn-primary"
          >
            Add Service
          </Link>

          <Link
            href="/dashboard/technician/my-services"
            className="btn btn-outline"
          >
            My Services
          </Link>

          <Link
            href="/dashboard/technician/requests"
            className="btn btn-outline"
          >
            Manage Requests
          </Link>

          <Link href="/dashboard/profile" className="btn btn-ghost">
            Update Profile
          </Link>
        </div>
      </div>

      {/* Recent Booking Requests */}
      <div className="bg-base-100 rounded-xl shadow p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Recent Booking Requests</h2>
          <Link
            href="/dashboard/technician/requests"
            className="link link-primary text-sm"
          >
            View All Requests
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-base-content/60">
              No booking requests assigned to you yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentBookings.map((booking) => {
                  const badge = getStatusBadge(booking.status);

                  return (
                    <tr key={booking._id}>
                      <td className="font-medium">
                        {booking.customerName || booking.customerEmail || "Customer"}
                      </td>
                      <td>{booking.serviceTitle || "Repair Service"}</td>
                      <td className="whitespace-nowrap">
                        {formatDate(booking.preferredDate || booking.createdAt)}
                      </td>
                      <td>
                        <span className={`badge ${badge.cls}`}>
                          {badge.label}
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
    </div>
  );
}