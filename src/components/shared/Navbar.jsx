"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";

const Navbar = () => {
  const router = useRouter();
  const { data: session, isPending, refetch } = useSession();
  const [liveName, setLiveName] = useState(null);

  useEffect(() => {
    const handleProfileUpdated = (e) => {
      if (e?.detail?.name) {
        setLiveName(e.detail.name);
      }
      if (typeof refetch === "function") {
        refetch();
      }
      router.refresh();
    };

    window.addEventListener("fixmate:profile-updated", handleProfileUpdated);
    return () => {
      window.removeEventListener("fixmate:profile-updated", handleProfileUpdated);
    };
  }, [refetch, router]);

  const displayName = liveName || session?.user?.name || "";

  // Login করা User-এর Role অনুযায়ী Dashboard URL তৈরি
  const role = session?.user?.role;
  console.log("sesstio n role ====", role);

  const dashboardLink = {
    customer: "/dashboard/customer",
    technician: "/dashboard/technician",
    admin: "/dashboard/admin",
  };

  // User-এর Role অনুযায়ী Dashboard Link নির্বাচন
  const userDashboard = dashboardLink[role] || "/dashboard/customer";

  // Logout Function
  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="sticky top-0 z-50 border-b border-base-300 bg-base-100 shadow-sm">
      <div className="navbar mx-auto max-w-7xl px-5">

        {/* Logo */}
        <div className="navbar-start">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-2xl text-primary-content">
              🔧
            </div>

            <div>
              <h1 className="text-xl font-extrabold text-primary">
                FixMate
              </h1>
              <p className="text-[10px] font-medium tracking-wider text-base-content/60">
                YOUR REPAIR PARTNER
              </p>
            </div>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-1 px-1 font-medium">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/about">About Us</Link></li>
          </ul>
        </div>

        {/* Right Side */}
        <div className="navbar-end gap-2">

          {!isPending && (
            <>
              {session?.user ? (

                // Login করা User-এর Profile Dropdown
                <div className="dropdown dropdown-end">

                  <button
                    tabIndex={0}
                    className="btn btn-ghost flex items-center gap-2"
                  >
                    {/* User Avatar */}
                    <div className="avatar placeholder">
                      <div className="w-9 rounded-full bg-primary text-primary-content">
                        <span>
                          {displayName?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* User Name */}
                    <span className="hidden sm:inline font-semibold">
                      {displayName}
                    </span>

                    <span>⌄</span>
                  </button>

                  {/* Dropdown Menu */}
                  <ul
                    tabIndex={0}
                    className="menu dropdown-content z-50 mt-3 w-56 rounded-box bg-base-100 p-3 shadow-lg"
                  >
                    {/* Dashboard Link */}
                    <li>
                      <Link href={userDashboard}>
                        📊 Dashboard
                      </Link>
                    </li>

                    {/* Profile Link */}
                    <li>
                      <Link href="/dashboard/profile">
                        👤 My Profile
                      </Link>
                    </li>

                    <div className="divider my-1"></div>

                    {/* Sign Out */}
                    <li>
                      <button
                        onClick={handleSignOut}
                        className="text-error"
                      >
                        🚪 Sign Out
                      </button>
                    </li>
                  </ul>

                </div>

              ) : (

                // Login না করা User
                <>
                  <Link
                    href="/sign-in"
                    className="btn btn-ghost hidden sm:inline-flex"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/sign-up"
                    className="btn btn-primary btn-sm sm:btn-md"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </>
          )}

          {/* Mobile Menu */}
          <div className="dropdown dropdown-end lg:hidden">
            <button
              tabIndex={0}
              className="btn btn-ghost btn-square"
              aria-label="Open navigation menu"
            >
              ☰
            </button>

            <ul
              tabIndex={0}
              className="menu dropdown-content z-50 mt-3 w-56 rounded-box bg-base-100 p-3 shadow-lg"
            >
              <li><Link href="/">Home</Link></li>
              <li><Link href="/services">Services</Link></li>
              <li><Link href="/about">About Us</Link></li>

              {!isPending && (
                session?.user ? (
                  <>
                    {/* Mobile Dashboard Link */}
                    <li>
                      <Link href={userDashboard}>
                        📊 Dashboard
                      </Link>
                    </li>

                    {/* Mobile Profile Link */}
                    <li>
                      <Link href="/dashboard/profile">
                        👤 My Profile
                      </Link>
                    </li>

                    {/* Mobile Logout */}
                    <li>
                      <button
                        onClick={handleSignOut}
                        className="text-error"
                      >
                        🚪 Sign Out
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li><Link href="/sign-in">Sign In</Link></li>
                    <li><Link href="/sign-up">Sign Up</Link></li>
                  </>
                )
              )}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Navbar;