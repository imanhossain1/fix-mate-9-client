
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();

  // Signup Error দেখানোর জন্য
  const [error, setError] = useState("");

  // Form Submit হওয়ার সময় Loading দেখানোর জন্য
  const [loading, setLoading] = useState(false);

  // Signup Form-এর সব Input-এর Value এখানে থাকবে
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer", // Default Role Customer
  });

  // Input পরিবর্তন হলে State Update হবে
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Create Account Button Click করলে এই Function চলবে
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    // শুধু Customer অথবা Technician Role গ্রহণ করব
    // Admin Signup থেকে দেওয়া যাবে না
    const selectedRole = ["customer", "technician"].includes(
      formData.role
    )
      ? formData.role
      : "customer";

    try {
      // BetterAuth দিয়ে নতুন Account তৈরি
      const { data, error } = await signUp.email({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: selectedRole,
      });

      // Signup Error হলে Error Message দেখাবে
      if (error) {
        setError(error.message);
        return;
      }

      console.log("Signup Success:", data);

      // Role অনুযায়ী Dashboard-এ পাঠানো
      if (selectedRole === "technician") {
        router.push("/dashboard/technician");
      } else {
        router.push("/dashboard/customer");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.log("Signup Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200 px-4 py-10">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">

          <h1 className="text-center text-3xl font-bold">
            Create Account
          </h1>

          <p className="mb-4 text-center text-base-content/60">
            Join FixMate and get your repairs done easily.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">
                  Full Name
                </span>
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                className="input input-bordered w-full"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">
                  Email Address
                </span>
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="input input-bordered w-full"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">
                  Password
                </span>
              </label>

              <input
                type="password"
                name="password"
                placeholder="Create a password"
                className="input input-bordered w-full"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            {/* Select Role: Customer অথবা Technician */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">
                  Register As
                </span>
              </label>

              <div className="flex gap-6 rounded-lg border border-base-300 p-4">

                {/* Customer Role */}
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    value="customer"
                    className="radio radio-primary"
                    checked={formData.role === "customer"}
                    onChange={handleChange}
                  />
                  <span>Customer</span>
                </label>

                {/* Technician Role */}
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    value="technician"
                    className="radio radio-primary"
                    checked={formData.role === "technician"}
                    onChange={handleChange}
                  />
                  <span>Technician</span>
                </label>

              </div>
            </div>

            {/* Signup Error Message */}
            {error && (
              <p className="text-sm text-error">
                {error}
              </p>
            )}

            {/* Create Account Button */}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

          </form>

          {/* Sign In Link */}
          <p className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="link link-primary font-semibold"
            >
              Sign In
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
