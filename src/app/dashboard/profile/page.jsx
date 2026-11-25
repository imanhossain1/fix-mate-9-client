"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { updateUserProfile } from "@/lib/api";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isPending) return;

    if (!user) {
      router.replace("/sign-in");
      return;
    }

    setName(user.name || "");
    setImage(user.image || "");
  }, [isPending, user, router]);

  const role = (user?.role || "customer").toLowerCase();
  const roleLabel =
    role === "admin"
      ? "Admin"
      : role === "technician"
      ? "Technician"
      : "Customer";

  const roleBadgeClass =
    role === "admin"
      ? "badge-secondary"
      : role === "technician"
      ? "badge-success"
      : "badge-info";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.email) return;

    const cleanName = name.trim();
    const cleanImage = image.trim();

    if (!cleanName) {
      toast.error("Name is required");
      return;
    }

    try {
      setSaving(true);

      await updateUserProfile({
        email: user.email,
        name: cleanName,
        image: cleanImage,
      });

      if (typeof authClient.updateUser === "function") {
        await authClient.updateUser({
          name: cleanName,
          image: cleanImage || undefined,
        });
      }

      toast.success("Profile updated successfully");
      setTimeout(() => {
        window.location.reload();
      }, 400);
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error(err?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Update Profile</h1>
        <p className="mt-1 text-sm text-base-content/60">
          Manage your account information. Changes reflect across your dashboard and navbar.
        </p>
      </div>

      {/* Current Profile Summary Card */}
      <div className="flex flex-col gap-4 rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm sm:flex-row sm:items-center">
        <div className="avatar">
          <div className="h-16 w-16 overflow-hidden rounded-full border border-base-300 bg-base-200">
            {image || user.image ? (
              <img
                src={image || user.image}
                alt={name || user.name || "Profile"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary text-xl font-bold text-primary-content">
                {(name || user.name || user.email || "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold">{name || user.name || "User"}</h2>
            <span className={`badge badge-sm ${roleBadgeClass}`}>
              {roleLabel}
            </span>
          </div>
          <p className="text-sm text-base-content/60">{user.email}</p>
        </div>
      </div>

      {/* Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm md:p-6"
      >
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Full Name</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Email Address</span>
          </label>
          <input
            type="email"
            disabled
            value={user.email || ""}
            className="input input-bordered w-full opacity-70"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Profile Photo URL</span>
          </label>
          <input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://example.com/photo.jpg"
            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Account Role</span>
          </label>
          <input
            type="text"
            disabled
            value={roleLabel}
            className="input input-bordered w-full opacity-70"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary cursor-pointer"
          >
            {saving ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}