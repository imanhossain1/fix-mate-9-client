
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

import {
  getTechnicianServices,
  updateServiceById,
  deleteServiceById,
} from "@/lib/api";

import toast from "react-hot-toast";

export default function MyServices() {
  const { data: session, isPending } = useSession();

  // States
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingService, setEditingService] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const [deletingService, setDeletingService] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [updatingId, setUpdatingId] = useState(null);

  const email = session?.user?.email;

  // Load only logged-in technician's services
  const loadMyServices = async () => {
    if (!email) {
      setServices([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data = await getTechnicianServices(email);

      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Load Services Error:", error);
      toast.error(error.message || "Failed to load services");
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  // Load services when session is ready
  useEffect(() => {
    if (isPending) return;

    loadMyServices();
  }, [isPending, email]);

  // Availability ON / OFF
  const handleToggleAvailability = async (service) => {
    const nextStatus = !service.isAvailable;

    try {
      setUpdatingId(service._id);

      await updateServiceById(service._id, {
        isAvailable: nextStatus,
      });

      setServices((prev) =>
        prev.map((item) =>
          item._id === service._id
            ? { ...item, isAvailable: nextStatus }
            : item
        )
      );

      toast.success(
        nextStatus
          ? "Service is now available"
          : "Service marked unavailable"
      );
    } catch (error) {
      console.error("Availability Error:", error);
      toast.error(error.message || "Failed to update availability");
    } finally {
      setUpdatingId(null);
    }
  };

  // Edit Service
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!editingService?._id) return;

    const form = e.currentTarget;

    const updatedData = {
      title: form.elements.title.value.trim(),
      category: form.elements.category.value,
      description: form.elements.description.value.trim(),
      basePrice: Number(form.elements.basePrice.value),
      estimatedDuration: form.elements.estimatedDuration.value.trim(),
      serviceMode: form.elements.serviceMode.value,
      serviceArea: form.elements.serviceArea.value.trim(),
    };

    if (
      !updatedData.title ||
      !updatedData.description ||
      !updatedData.serviceArea ||
      !updatedData.estimatedDuration ||
      updatedData.basePrice <= 0
    ) {
      toast.error("Please provide valid service information");
      return;
    }

    try {
      setSavingEdit(true);

      await updateServiceById(editingService._id, updatedData);

      setServices((prev) =>
        prev.map((item) =>
          item._id === editingService._id
            ? {
                ...item,
                ...updatedData,
                approvalStatus: "pending",
              }
            : item
        )
      );

      toast.success("Service updated successfully");

      setEditingService(null);
    } catch (error) {
      console.error("Edit Service Error:", error);
      toast.error(error.message || "Failed to update service");
    } finally {
      setSavingEdit(false);
    }
  };

  // Delete Service
  const handleConfirmDelete = async () => {
    if (!deletingService?._id) return;

    try {
      setDeleting(true);

      await deleteServiceById(deletingService._id);

      setServices((prev) =>
        prev.filter((item) => item._id !== deletingService._id)
      );

      toast.success("Service deleted successfully");

      setDeletingService(null);
    } catch (error) {
      console.error("Delete Service Error:", error);
      toast.error(error.message || "Failed to delete service");
    } finally {
      setDeleting(false);
    }
  };

  // Approval Badge
  const getApprovalBadge = (status) => {
    if (status === "approved") return "badge-success";
    if (status === "rejected") return "badge-error";

    return "badge-warning";
  };

  // Loading Screen
  if (isPending || loading) {
    return (
      <div className="flex justify-center items-center min-h-60">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="ml-3">Loading my services...</p>
      </div>
    );
  }

  // Main UI
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Services</h1>
          <p className="text-sm opacity-70">
            Manage your repair services.
          </p>
        </div>

        <Link
          href="/dashboard/technician/add-service"
          className="btn btn-primary btn-sm"
        >
          + Add Service
        </Link>
      </div>

      {/* Empty State */}
      {services.length === 0 ? (
        <div className="bg-base-100 rounded-xl shadow p-10 text-center">
          <h2 className="text-lg font-semibold mb-3">
            No Services Found
          </h2>

          <p className="text-sm opacity-70 mb-5">
            You have not added any services yet.
          </p>

          <Link
            href="/dashboard/technician/add-service"
            className="btn btn-primary"
          >
            Add Your First Service
          </Link>
        </div>
      ) : (

        /* Services Table */
        <div className="overflow-x-auto bg-base-100 rounded-xl shadow">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Service</th>
                <th>Category</th>
                <th>Price</th>
                <th>Approval</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {services.map((service) => (
                <tr key={service._id}>

                  {/* Service Info */}
                  <td>
                    <div className="flex items-center gap-3">
                      {service.image && (
                        <img
                          src={service.image}
                          alt={service.title || "Service"}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}

                      <div>
                        <p className="font-semibold">
                          {service.title}
                        </p>

                        <p className="text-xs opacity-60">
                          {service.serviceMode} • {service.serviceArea}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td>{service.category}</td>

                  {/* Price */}
                  <td className="font-semibold">
                    ৳{service.basePrice}
                  </td>

                  {/* Approval */}
                  <td>
                    <span
                      className={`badge capitalize ${getApprovalBadge(
                        service.approvalStatus
                      )}`}
                    >
                      {service.approvalStatus || "pending"}
                    </span>
                  </td>

                  {/* Availability */}
                  <td>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="toggle toggle-success toggle-sm"
                        checked={Boolean(service.isAvailable)}
                        disabled={updatingId === service._id}
                        onChange={() =>
                          handleToggleAvailability(service)
                        }
                      />

                      <span className="text-xs">
                        {service.isAvailable ? "ON" : "OFF"}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingService(service)}
                        className="btn btn-outline btn-xs"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => setDeletingService(service)}
                        className="btn btn-error btn-outline btn-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editingService && (
        <div className="modal modal-open">
          <div className="modal-box max-w-lg">
            <h3 className="text-xl font-bold mb-5">
              Edit Service
            </h3>

            <form onSubmit={handleEditSubmit} className="space-y-4">

              <div>
                <label className="label">Service Title</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingService.title}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div>
                <label className="label">Category</label>
                <select
                  name="category"
                  defaultValue={editingService.category}
                  className="select select-bordered w-full"
                  required
                >
                  <option value="Smartphone">Smartphone</option>
                  <option value="Laptop & PC">Laptop & PC</option>
                  <option value="AC">AC</option>
                  <option value="Refrigerator">Refrigerator</option>
                  <option value="TV">TV</option>
                  <option value="Washing Machine">Washing Machine</option>
                  <option value="Electrical">Electrical</option>
                </select>
              </div>

              <div>
                <label className="label">Service Mode</label>
                <select
                  name="serviceMode"
                  defaultValue={editingService.serviceMode}
                  className="select select-bordered w-full"
                  required
                >
                  <option value="Home Visit">Home Visit</option>
                  <option value="Shop Drop-off">Shop Drop-off</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Base Price</label>
                  <input
                    type="number"
                    name="basePrice"
                    min="1"
                    step="0.01"
                    defaultValue={editingService.basePrice}
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                <div>
                  <label className="label">Estimated Duration</label>
                  <input
                    type="text"
                    name="estimatedDuration"
                    defaultValue={editingService.estimatedDuration}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label">Service Area</label>
                <input
                  type="text"
                  name="serviceArea"
                  defaultValue={editingService.serviceArea}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  name="description"
                  rows="4"
                  defaultValue={editingService.description}
                  className="textarea textarea-bordered w-full"
                  required
                />
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-ghost"
                  disabled={savingEdit}
                  onClick={() => setEditingService(null)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingEdit}
                  className="btn btn-primary"
                >
                  {savingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingService && (
        <div className="modal modal-open">
          <div className="modal-box max-w-sm">
            <h3 className="text-xl font-bold">
              Delete Service?
            </h3>

            <p className="py-4">
              Are you sure you want to delete{" "}
              <strong>{deletingService.title}</strong>?
              This action cannot be undone.
            </p>

            <div className="modal-action">
              <button
                type="button"
                className="btn btn-ghost"
                disabled={deleting}
                onClick={() => setDeletingService(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-error"
                disabled={deleting}
                onClick={handleConfirmDelete}
              >
                {deleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
