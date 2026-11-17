
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";

export default function SignUpPage() {
  const [error, setError]  = useState('');
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
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

  // Register button click
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form Data:", formData);

    const { data, error } = await signUp.email({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      console.log("Signup Error:", error);
      setError(error.message)
      return;
    }

    console.log("Signup Success:", data);

    router.push("/");
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

            {/* Name */}
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
                placeholder="Create a password"
                className="input input-bordered w-full"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
               {/* error    */}
               {error && <p className="text-red-400">{error}</p> }
            {/* Register Button */}
            <button
              type="submit"
              className="btn btn-primary w-full"
            >
              Create Account
            </button>

          </form>

          <p className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <a
              href="/sign-in"
              className="link link-primary font-semibold"
            >
              Sign In
            </a>
          </p>

        </div>
      </div>
    </div>
  );
}
