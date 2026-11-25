
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const role = (user?.role || "customer").toLowerCase();

  useEffect(() => {
    if (!isPending && !user) {
      router.replace("/sign-in");
    }
  }, [isPending, user, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // বর্তমান pathname অনুযায়ী কোন রোল দরকার তা নির্ণয়
  let requiredRole = null;
  if (pathname.startsWith("/dashboard/admin")) {
    requiredRole = "admin";
  } else if (pathname.startsWith("/dashboard/technician")) {
    requiredRole = "technician";
  } else if (pathname.startsWith("/dashboard/customer")) {
    requiredRole = "customer";
  }

  const isForbidden = requiredRole && role !== requiredRole;

  const myDashboard =
    role === "admin"
      ? "/dashboard/admin"
      : role === "technician"
      ? "/dashboard/technician"
      : "/dashboard/customer";

  const navLinksByRole = {
    customer: [
      { label: "Overview", href: "/dashboard/customer" },
      { label: "My Bookings", href: "/dashboard/customer/my-bookings" },
      { label: "Payment History", href: "/dashboard/customer/payments" },
      { label: "Update Profile", href: "/dashboard/profile" },
    ],
    technician: [
      { label: "Overview", href: "/dashboard/technician" },
      { label: "Add Service", href: "/dashboard/technician/add-service" },
      { label: "My Services", href: "/dashboard/technician/my-services" },
      { label: "Requests", href: "/dashboard/technician/requests" },
      { label: "Update Profile", href: "/dashboard/profile" },
    ],
    admin: [
      { label: "Overview", href: "/dashboard/admin" },
      { label: "Manage Users", href: "/dashboard/admin/manage-users" },
      { label: "Manage Services", href: "/dashboard/admin/services" },
      { label: "Manage Booking", href: "/dashboard/admin/manage-booking" },
      { label: "Transactions", href: "/dashboard/admin/transactions" },
      { label: "Update Profile", href: "/dashboard/profile" },
    ],
  };

  const links = navLinksByRole[role] || navLinksByRole.customer;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-base-200">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-base-100 border-b md:border-b-0 md:border-r p-4 flex flex-col justify-between">
        <div>
          <div className="mb-6 pb-3 border-b">
            <Link href="/" className="text-xl font-bold text-primary">
              FixMate
            </Link>
            <p className="text-xs uppercase opacity-70 mt-1">{role}</p>
          </div>

          <ul className="menu gap-1 p-0">
            {links.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={pathname === item.href ? "active font-semibold" : ""}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-4 border-t text-xs">
          <Link href="/" className="link link-hover block mb-2">
            Back to Home
          </Link>
          <p className="font-medium truncate">{user.name || "User"}</p>
          <p className="opacity-70 truncate">{user.email}</p>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        <header className="bg-base-100 border-b px-6 py-3 flex items-center justify-between">
          <span className="text-sm font-medium capitalize">{role} Dashboard</span>
          <div className="flex items-center gap-3 text-sm">
            {user.image && (
              <img
                src={user.image}
                alt={user.name || "Avatar"}
                className="w-7 h-7 rounded-full object-cover border"
              />
            )}
            <span>{user.name || user.email}</span>
            <span className="badge badge-outline capitalize">{role}</span>
          </div>
        </header>

        <main className="flex-1 p-6">
          {isForbidden ? (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-base-100 rounded-box p-8 text-center border">
              <span className="badge badge-error badge-outline mb-2">
                403 Forbidden
              </span>
              <h1 className="text-2xl font-bold">Access Denied</h1>
              <p className="opacity-75 mt-2 max-w-md">
                আপনার বর্তমান রোল (<strong className="capitalize">{role}</strong>) এই
                পেজটি দেখার অনুমতি রাখে না।
              </p>
              <Link href={myDashboard} className="btn btn-primary btn-sm mt-5">
                Go to My Dashboard
              </Link>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}