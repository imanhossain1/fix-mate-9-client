
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "../../lib/auth-client";
import { createRepairRequest } from "../../lib/api";
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
            toast.error("Please login first!");
            router.push("/login");
            return;
        }

        if (user.role?.toLowerCase() !== "customer") {
            toast.error("Only customers can request services!");
            return;
        }

        setLoading(true);

        const requestData = {
            serviceId: service._id || service.id,
            customerName: user.name,
            customerEmail: user.email,
            phone,
            address,
            preferredDate,
            problemDescription,
        };

        try {
            const data = await createRepairRequest(requestData);

            toast.success("Repair request submitted successfully!");

            router.push("/dashboard/customer/my-services");

        } catch (error) {
            toast.error(error.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    if (isPending) {
        return <p>Loading user...</p>;
    }

    if (!user) {
        return (
            <div className="p-6 text-center border rounded-xl">
                <h2 className="text-xl font-bold">Login Required</h2>
                <button
                    onClick={() => router.push("/login")}
                    className="btn btn-primary mt-4"
                >
                    Login Now
                </button>
            </div>
        );
    }

    if (user.role?.toLowerCase() !== "customer") {
        return (
            <div className="p-6 text-center border rounded-xl">
                Only customers can submit repair requests.
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 border rounded-2xl shadow-lg">

            <h2 className="text-2xl font-bold mb-2">
                Repair Request Form
            </h2>

            <p className="text-sm opacity-60 mb-6">
                Request a repair service from our technicians.
            </p>

            <div className="bg-base-200 p-4 rounded-xl mb-6">
                <h3 className="font-bold">{service.title}</h3>
                <p>Category: {service.category}</p>
                <p className="font-semibold text-primary">
                    Price: ৳{service.price}
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
                    <label className="label">Phone Number</label>
                    <input
                        type="tel"
                        placeholder="01XXXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="input input-bordered w-full"
                        required
                    />
                </div>

                <div>
                    <label className="label">Address</label>
                    <textarea
                        placeholder="Enter your full address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
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
                        placeholder="Describe your repair problem..."
                        value={problemDescription}
                        onChange={(e) =>
                            setProblemDescription(e.target.value)
                        }
                        className="textarea textarea-bordered w-full"
                        rows={4}
                        required
                    />
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
