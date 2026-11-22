import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function DashboardLayout({ children }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/sign-in");
  }

  const role = session.user?.role || "customer";

  const navLinksByRole = {
    customer: [
      { label: "Overview", href: "/dashboard/customer" },
      { label: "My Bookings", href: "/dashboard/customer/bookings" },
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
      { label: "Manage Users", href: "/dashboard/admin/users" },
      { label: "Service Approval", href: "/dashboard/admin/services" },
      { label: "All Bookings", href: "/dashboard/admin/bookings" },
      { label: "Transactions", href: "/dashboard/admin/transactions" },
      { label: "Update Profile", href: "/dashboard/profile" },
    ],
  };

  const links = navLinksByRole[role] || navLinksByRole.customer;

  return (
    <div className="min-h-screen flex bg-base-200">
      {/* Sidebar */}
      <aside className="w-64 bg-base-100 border-r p-4 flex flex-col justify-between">
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
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-4 border-t text-xs">
          <Link href="/" className="link link-hover block mb-2">
            Back to Home
          </Link>
          <p className="font-medium truncate">{session.user.name || "User"}</p>
          <p className="opacity-70 truncate">{session.user.email}</p>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        <header className="bg-base-100 border-b px-6 py-3 flex items-center justify-between">
          <span className="text-sm font-medium capitalize">{role} Dashboard</span>
          <div className="flex items-center gap-3 text-sm">
            <span>{session.user.name || session.user.email}</span>
            <span className="badge badge-outline capitalize">{role}</span>
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}