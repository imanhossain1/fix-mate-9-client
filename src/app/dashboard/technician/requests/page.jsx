"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import { getTechnicianBookings, updateBookingStatus } from "@/lib/api";

export default function Requests() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Reject confirmation modal state
  const [rejectTarget, setRejectTarget] = useState(null);

  // Complete modal state (with finalAmount)
  const [completeTarget, setCompleteTarget] = useState(null);
  const [finalAmount, setFinalAmount] = useState("");

  const loadBookings = useCallback(async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      setError("");

      const data = await getTechnicianBookings(user.email);
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load technician bookings:", err);
      const msg = err?.message || "Failed to load repair requests";
      setError(msg);
      toast.error(msg);
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

    if (user.role !== "technician") {
      toast.error("Only technicians can access this page");
      router.push("/dashboard");
      return;
    }

    loadBookings();
  }, [isPending, user, router, loadBookings]);

  const handleStatusChange = async (booking, nextStatus, extraBody = {}) => {
    const bookingId = booking?._id;
    if (!bookingId) return;

    // একবার accept হয়ে গেলে আবার accept চলবে না
    if (nextStatus === "accepted" && booking.status !== "requested") {
      return;
    }

    if (actionLoadingId === bookingId) return;

    try {
      setActionLoadingId(bookingId);

      await updateBookingStatus(bookingId, nextStatus, extraBody);

      setBookings((prev) =>
        prev.map((item) =>
          item._id === bookingId
            ? {
                ...item,
                status: nextStatus,
                ...(extraBody.finalAmount !== undefined
                  ? { finalAmount: Number(extraBody.finalAmount) }
                  : {}),
              }
            : item
        )
      );

      toast.success(`Job marked as ${nextStatus}`);
    } catch (err) {
      console.error("Status update error:", err);
      toast.error(err?.message || "Could not update status");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectTarget?._id) return;
    const target = rejectTarget;
    setRejectTarget(null);
    await handleStatusChange(target, "rejected");
  };

  const openCompleteModal = (booking) => {
    setCompleteTarget(booking);
    setFinalAmount(
      booking.finalAmount !== undefined && booking.finalAmount !== null
        ? String(booking.finalAmount)
        : String(booking.basePrice ?? "")
    );
  };

  const handleConfirmComplete = async (e) => {
    e.preventDefault();
    if (!completeTarget?._id) return;

    const numericAmount = Number(finalAmount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      toast.error("Final amount must be a number greater than 0");
      return;
    }

    const target = completeTarget;
    setCompleteTarget(null);
    await handleStatusChange(target, "completed", {
      finalAmount: numericAmount,
    });
  };

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
      requested: { label: "Requested", cls: "badge-info" },
      accepted: { label: "Accepted", cls: "badge-primary" },
      "in-progress": { label: "In Progress", cls: "badge-warning" },
      completed: { label: "Completed", cls: "badge-success" },
      rejected: { label: "Rejected", cls: "badge-error" },
      cancelled: { label: "Cancelled", cls: "badge-neutral" },
    };

    return map[status] || { label: status || "Unknown", cls: "badge-ghost" };
  };

  const getPaymentBadge = (paymentStatus) => {
    if (paymentStatus === "paid") {
      return <span className="badge badge-success badge-sm">Paid</span>;
    }
    return <span className="badge badge-ghost badge-sm">Unpaid</span>;
  };

  const filteredBookings = bookings.filter((item) => {
    if (statusFilter === "all") return true;
    return item.status === statusFilter;
  });

  if (isPending || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!user || user.role !== "technician") {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Manage Requests</h1>
          <p className="mt-1 text-sm text-base-content/60">
            Review incoming repair requests and update job progress step by step.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            className="select select-bordered select-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="requested">Requested</option>
            <option value="accepted">Accepted</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <button
            type="button"
            onClick={loadBookings}
            className="btn btn-outline btn-primary btn-sm"
            disabled={loading}
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
          <button type="button" onClick={loadBookings} className="btn btn-sm">
            Try Again
          </button>
        </div>
      )}

      {/* Requests Table */}
      <div className="rounded-xl border border-base-300 bg-base-100 p-4 md:p-5 shadow-sm">
        {filteredBookings.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mb-3 text-4xl">🛠️</div>
            <h2 className="text-lg font-bold">No Repair Requests Found</h2>
            <p className="mt-1 text-sm text-base-content/60">
              There are no bookings matching the selected status right now.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Customer</th>
                  <th>Phone & Address</th>
                  <th>Preferred Date</th>
                  <th>Problem Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => {
                  const badge = getStatusBadge(booking.status);
                  const isBusy = actionLoadingId === booking._id;

                  return (
                    <tr key={booking._id} className="align-top">
                      <td>
                        <div className="font-bold">
                          {booking.serviceTitle || "Repair Service"}
                        </div>
                        <div className="text-xs text-base-content/60">
                          Base: ${booking.basePrice ?? 0}
                          {booking.status === "completed" &&
                          booking.finalAmount !== undefined
                            ? ` • Final: $${booking.finalAmount}`
                            : ""}
                        </div>
                      </td>

                      <td>
                        <div className="font-medium">
                          {booking.customerName || "Customer"}
                        </div>
                        <div className="text-xs text-base-content/60">
                          {booking.customerEmail}
                        </div>
                      </td>

                      <td>
                        <div className="text-sm">
                          {booking.customerPhone || "N/A"}
                        </div>
                        <div className="max-w-[180px] text-xs text-base-content/60">
                          {booking.address || "N/A"}
                        </div>
                      </td>

                      <td className="whitespace-nowrap text-sm">
                        {formatDate(booking.preferredDate)}
                      </td>

                      <td>
                        <p className="max-w-[240px] text-xs leading-relaxed">
                          {booking.problemDescription || "No description"}
                        </p>
                      </td>

                      <td>
                        <span className={`badge ${badge.cls}`}>
                          {badge.label}
                        </span>
                      </td>

                      <td>
                        {/* Step 1: requested -> Accept / Reject */}
                        {booking.status === "requested" && (
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              disabled={isBusy || booking.status !== "requested"}
                              onClick={() =>
                                handleStatusChange(booking, "accepted")
                              }
                              className="btn btn-primary btn-xs cursor-pointer disabled:cursor-not-allowed"
                            >
                              {isBusy ? "..." : "Accept"}
                            </button>
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => setRejectTarget(booking)}
                              className="btn btn-error btn-outline btn-xs cursor-pointer disabled:cursor-not-allowed"
                            >
                              Reject
                            </button>
                          </div>
                        )}

                        {/* Step 2: accepted -> Start Work (in-progress) */}
                        {booking.status === "accepted" && (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() =>
                              handleStatusChange(booking, "in-progress")
                            }
                            className="btn btn-warning btn-xs cursor-pointer disabled:cursor-not-allowed"
                          >
                            {isBusy ? "Updating..." : "Start Work"}
                          </button>
                        )}

                        {/* Step 3: in-progress -> Mark Completed (modal with finalAmount) */}
                        {booking.status === "in-progress" && (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => openCompleteModal(booking)}
                            className="btn btn-success btn-xs text-white cursor-pointer disabled:cursor-not-allowed"
                          >
                            {isBusy ? "Updating..." : "Mark Completed"}
                          </button>
                        )}

                        {/* Terminal states: completed / rejected / cancelled */}
                        {["completed", "rejected", "cancelled"].includes(
                          booking.status
                        ) && (
                          <div className="flex flex-col gap-1">
                            {booking.status === "completed" &&
                              getPaymentBadge(booking.paymentStatus)}
                            <span className="text-xs text-base-content/50">
                              No further action
                            </span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reject Confirmation Modal */}
      {rejectTarget && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Reject Repair Request?</h3>
            <p className="py-3 text-sm text-base-content/70">
              Are you sure you want to reject the request for{" "}
              <strong>{rejectTarget.serviceTitle}</strong> from{" "}
              <strong>{rejectTarget.customerName}</strong>?
            </p>
            <div className="modal-action">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setRejectTarget(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-error btn-sm"
                onClick={handleConfirmReject}
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mark Completed Modal (Set finalAmount) */}
      {completeTarget && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Mark Job as Completed</h3>
            <p className="mt-1 text-sm text-base-content/70">
              Service: <strong>{completeTarget.serviceTitle}</strong> (Base
              Price: ${completeTarget.basePrice ?? 0})
            </p>

            <form onSubmit={handleConfirmComplete} className="mt-4 space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Final Amount (USD, greater than 0)
                  </span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={finalAmount}
                  onChange={(e) => setFinalAmount(e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="Enter final amount"
                />
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setCompleteTarget(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-success btn-sm text-white"
                >
                  Save & Complete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}