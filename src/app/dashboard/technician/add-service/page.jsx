"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { apiAddServiceFunction } from "@/lib/api";
import toast from "react-hot-toast";

export default function AddServicePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [loading, setLoading] = useState(false);

  const handleAddService = async (e) => {
    e.preventDefault();

    if (!session?.user?.email) {
      toast.error("Please sign in as a technician first.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Uploading image & saving service...");

    const form = e.target;
    const imageFile = form.image.files[0];

    try {
      // ১. ImgBB তে ছবি আপলোড
      const imgFormData = new FormData();
      imgFormData.append("image", imageFile);

      const imgbbRes = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        {
          method: "POST",
          body: imgFormData,
        }
      );
      const imgbbData = await imgbbRes.json();

      if (!imgbbRes.ok || !imgbbData.success) {
        toast.error(
          imgbbData?.error?.message || "ছবি আপলোড ব্যর্থ হয়েছে! আবার চেষ্টা করুন।",
          { id: toastId }
        );
        setLoading(false);
        return;
      }

      const imageUrl = imgbbData.data.display_url;

      // ২. সার্ভিস ডাটা তৈরি
      const serviceData = {
        title: form.title.value.trim(),
        category: form.category.value,
        description: form.description.value.trim(),
        image: imageUrl,
        basePrice: parseFloat(form.basePrice.value),
        estimatedDuration: form.estimatedDuration.value.trim(),
        serviceMode: form.serviceMode.value,
        serviceArea: form.serviceArea.value.trim(),
        technicianName: session?.user?.name || "Technician",
        technicianEmail: session?.user?.email,
        approvalStatus: "pending",
        isAvailable: true,
        createdAt: new Date(),
      };

      // ৩. api.js থেকে সার্ভারে ডেটা পাঠানো
      const serverResult = await apiAddServiceFunction(serviceData);

      if (serverResult?.insertedId) {
        toast.success("Service added! Waiting for admin approval.", {
          id: toastId,
        });
        form.reset();
        router.push("/dashboard/technician/my-services");
      } else {
        toast.error(serverResult?.message || "সার্ভিস যোগ করতে সমস্যা হয়েছে!", {
          id: toastId,
        });
      }
    } catch (error) {
      console.error("Error adding service:", error);
      toast.error(error.message || "সার্ভিস যোগ করতে সমস্যা হয়েছে!", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return <div className="p-6 text-center">Loading session...</div>;
  }

  return (
    <div className="mx-auto max-w-2xl rounded-xl bg-base-100 p-6 shadow-md">
      <h1 className="mb-2 text-2xl font-bold">Add a Repair Service</h1>
      <p className="mb-6 text-sm text-base-content/70">
        Fill in the details below. Your service will go live once an Admin approves it.
      </p>

      <form onSubmit={handleAddService} className="space-y-4">
        {/* Service Title */}
        <div>
          <label className="label font-semibold">Service Title</label>
          <input
            type="text"
            name="title"
            placeholder="e.g. iPhone Screen Replacement"
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* Category & Service Mode */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="label font-semibold">Category</label>
            <select name="category" className="select select-bordered w-full" required>
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
            <label className="label font-semibold">Service Mode</label>
            <select name="serviceMode" className="select select-bordered w-full" required>
              <option value="Home Visit">Home Visit</option>
              <option value="Shop Drop-off">Shop Drop-off</option>
            </select>
          </div>
        </div>

        {/* Base Price & Estimated Duration */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="label font-semibold">Base Price ($ USD)</label>
            <input
              type="number"
              name="basePrice"
              min="1"
              step="0.01"
              placeholder="e.g. 50"
              className="input input-bordered w-full"
              required
            />
          </div>

          <div>
            <label className="label font-semibold">Estimated Duration</label>
            <input
              type="text"
              name="estimatedDuration"
              placeholder="e.g. 2-3 hours"
              className="input input-bordered w-full"
              required
            />
          </div>
        </div>

        {/* Service Area & Service Banner Image */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="label font-semibold">Service Area</label>
            <input
              type="text"
              name="serviceArea"
              placeholder="e.g. Dhanmondi, Dhaka"
              className="input input-bordered w-full"
              required
            />
          </div>

          <div>
            <label className="label font-semibold">Service Banner Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              className="file-input file-input-bordered w-full"
              required
            />
          </div>
        </div>

        {/* Read-only Technician Info from Session */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="label font-semibold">Technician Name</label>
            <input
              type="text"
              value={session?.user?.name || ""}
              readOnly
              className="input input-bordered w-full bg-base-200"
            />
          </div>

          <div>
            <label className="label font-semibold">Technician Email</label>
            <input
              type="email"
              value={session?.user?.email || ""}
              readOnly
              className="input input-bordered w-full bg-base-200"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="label font-semibold">Service Description</label>
          <textarea
            name="description"
            rows="3"
            placeholder="Describe what is included in this repair service..."
            className="textarea textarea-bordered w-full"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? "Uploading & Saving..." : "Submit Service"}
        </button>
      </form>
    </div>
  );
}