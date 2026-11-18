
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../../lib/auth";

// ==========================================
// Dashboard Layout
// এই Layout তিনটি Role-এর জন্য ব্যবহার হবে।
// ==========================================

export default async function DashboardLayout({ children }) {

  // STEP 1:
  // BetterAuth থেকে Login করা User-এর Session আনছি।

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // STEP 2:
  // Login না থাকলে Sign In Page-এ পাঠাব।

  if (!session) {
    redirect("/sign-in");
  }

  // STEP 3:
  // Login করা User-এর Role সংগ্রহ করছি।

  const role = session.user.role;

  // STEP 4:
  // User-এর নাম ও প্রথম অক্ষর সংগ্রহ করছি।

  const userName = session.user.name || "User";
  const avatarLetter = userName.charAt(0).toUpperCase();

  // STEP 5:
  // Admin, Customer ও Technician-এর আলাদা Menu তৈরি করছি।

  const menus = {

    // Admin-এর Menu
    admin: [
      { name: "Overview", link: "/dashboard/admin", icon: "📊" },
      { name: "Manage Users", link: "/dashboard/admin/users", icon: "👥" },
      { name: "Manage Services", link: "/dashboard/admin/services", icon: "🔧" },
      { name: "Manage Bookings", link: "/dashboard/admin/bookings", icon: "📅" },
      { name: "Payments", link: "/dashboard/admin/payments", icon: "💳" },
    ],

    // Customer-এর Menu
    customer: [
      { name: "Overview", link: "/dashboard/customer", icon: "📊" },
      { name: "Browse Services", link: "/services", icon: "🔧" },
      { name: "My Bookings", link: "/dashboard/customer/bookings", icon: "📅" },
      { name: "Payment History", link: "/dashboard/customer/payments", icon: "💳" },
    ],

    // Technician-এর Menu
    technician: [
      { name: "Overview", link: "/dashboard/technician", icon: "📊" },
      { name: "My Services", link: "/dashboard/technician/services", icon: "🛠️" },
      { name: "Booking Requests", link: "/dashboard/technician/bookings", icon: "📅" },
      { name: "Completed Jobs", link: "/dashboard/technician/completed", icon: "✅" },
    ],

  };

  // STEP 6:
  // বর্তমান Role অনুযায়ী Menu নির্বাচন করছি।

  const currentMenu = menus[role];

  // STEP 7:
  // অজানা Role হলে Sign In Page-এ পাঠাব।

  if (!currentMenu) {
    redirect("/sign-in");
  }

  // STEP 8:
  // Dashboard UI দেখাচ্ছি।

  return (
    <div className="min-h-screen bg-base-200">

      {/* =================================
          LEFT SIDEBAR
          এখানে Role অনুযায়ী Menu দেখাবে।
      ================================= */}

      <aside className="fixed left-0 top-0 h-screen w-64 bg-base-100 border-r border-base-300 p-5">

        {/* Website Logo */}

        <Link href="/" className="text-2xl font-bold text-primary">
          FixMate
        </Link>

        <p className="text-sm text-base-content/50 mt-1">
          {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
        </p>

        <div className="divider"></div>

        {/* Dynamic Navigation Menu */}

        <ul className="menu gap-2">

          {currentMenu.map((item) => (
            <li key={item.link}>
              <Link href={item.link}>
                <span>{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}

        </ul>

        {/* Back to Website Button */}

        <div className="absolute bottom-5 left-5 right-5">
          <Link href="/" className="btn btn-outline btn-sm w-full">
            ← Back to Website
          </Link>
        </div>

      </aside>

      {/* =================================
          MAIN CONTENT
          Sidebar-এর ডান পাশে Page দেখাবে।
      ================================= */}

      <main className="ml-64 min-h-screen p-6">

        {/* Top Navbar */}

        <header className="navbar bg-base-100 rounded-xl px-5 shadow-sm mb-6">

          <div className="navbar-start">
            <h2 className="text-lg font-semibold">
              {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
            </h2>
          </div>

          <div className="navbar-end gap-3">

            {/* Login করা User-এর নাম */}

            <span className="text-sm">
              Welcome, {userName}
            </span>

            {/* User Avatar */}

            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-10">
                <span>{avatarLetter}</span>
              </div>
            </div>

          </div>

        </header>

        {/* =================================
            CHILDREN
            এখানে Admin, Customer অথবা
            Technician-এর Page দেখাবে।
        ================================= */}

        {children}

      </main>

    </div>
  );
}
