
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Input value নেওয়া
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Login button click
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    console.log("Login Data:", formData);

    const { data, error } = await signIn.email({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      console.log("Login Error:", error);
      setError(error.message);
      return;
    }

    console.log("Login Success:", data);

    router.push("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200 px-4 py-10">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">

          <h1 className="text-center text-3xl font-bold">
            Welcome Back
          </h1>

          <p className="mb-4 text-center text-base-content/60">
            Sign in to your FixMate account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
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
                placeholder="Enter your password"
                className="input input-bordered w-full"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-400">
                {error}
              </p>
            )}

            {/* Login Button */}
            <button
              type="submit"
              className="btn btn-primary w-full"
            >
              Sign In
            </button>

          </form>

          <p className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <a
              href="/sign-up"
              className="link link-primary font-semibold"
            >
              Sign Up
            </a>
          </p>

        </div>
      </div>
    </div>
  );
}
