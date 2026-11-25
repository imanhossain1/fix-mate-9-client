"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { createBooking } from "@/lib/api";
import toast from "react-hot-toast";

export default function BookingRequestForm({ service }) {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      router.push(`/sign-in?callbackURL=/services/${service._id}`);
      return;
    }

    if (user.role !== "customer") {
      toast.error("Only customers can request a repair");
      return;
    }

    if (problemDescription.trim().length < 20) {
      toast.error("Problem description must be at least 20 characters");
      return;
    }

    setLoading(true);

    const bookingData = {
      serviceId: service._id,
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: phone,
      address,
      preferredDate,
      problemDescription,
    };

    try {
      const result = await createBooking(bookingData);

      if (!result.success) {
        throw new Error(result.message || "Booking failed");
      }

      toast.success("Repair request submitted successfully!");

      router.push("/dashboard/customer/my-bookings");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (isPending) return <p>Loading...</p>;

  if (!user) {
    return (
      <div className="rounded-xl border p-6 text-center">
        <h2 className="text-xl font-bold">Login Required</h2>
        <p className="mt-2">Login as a customer to request this repair.</p>
        <button
          onClick={() =>
            router.push(`/sign-in?callbackURL=/services/${service._id}`)
          }
          className="btn btn-primary mt-4"
        >
          Sign In to Request
        </button>
      </div>
    );
  }

  if (user.role !== "customer") {
    return (
      <div className="rounded-xl border p-6 text-center">
        Only customers can request a repair.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border p-6 shadow-lg">
      <h2 className="mb-2 text-2xl font-bold">Request Repair</h2>

      <p className="mb-6 text-sm opacity-60">
        Send your repair request to the technician.
      </p>

      <div className="mb-6 rounded-xl bg-base-200 p-4">
        <h3 className="font-bold">{service.title}</h3>
        <p>Category: {service.category}</p>
        <p className="font-semibold text-primary">
          Starting Price: ৳{service.basePrice}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Customer Name</label>
          <input
            value={user.name || ""}
            readOnly
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label">Customer Email</label>
          <input
            value={user.email || ""}
            readOnly
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="01XXXXXXXXX"
            className="input input-bordered w-full"
            required
          />
        </div>

        <div>
          <label className="label">Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your full address"
            className="textarea textarea-bordered w-full"
            required
          />
        </div>

        <div>
          <label className="label">Preferred Date</label>
          <input
            type="date"
            min={today}
            value={preferredDate}
            onChange={(e) => setPreferredDate(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div>
          <label className="label">Problem Description</label>
          <textarea
            value={problemDescription}
            onChange={(e) => setProblemDescription(e.target.value)}
            placeholder="Describe your repair problem (minimum 20 characters)"
            className="textarea textarea-bordered w-full"
            rows={4}
            minLength={20}
            required
          />
          <p className="mt-1 text-xs opacity-60">
            {problemDescription.length}/20 minimum characters
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? "Submitting..." : "Submit Repair Request"}
        </button>
      </form>
    </div>
  );
}