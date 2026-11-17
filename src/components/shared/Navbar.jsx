
import Link from "next/link";

const Navbar = () => {
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
            <li>
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
            </li>

            <li>
              <Link href="/services" className="hover:text-primary">
                Services
              </Link>
            </li>

            <li>
              <Link href="/about" className="hover:text-primary">
                About Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Side */}
        <div className="navbar-end gap-2">

          <Link
            href="/login"
            className="btn btn-ghost hidden sm:inline-flex"
          >
            Sign In
          </Link>

          <Link
            href="/register"
            className="btn btn-primary btn-sm sm:btn-md"
          >
            Get Started
          </Link>

          {/* Mobile Menu */}
          <div className="dropdown dropdown-end lg:hidden">
            <button
              tabIndex={0}
              className="btn btn-ghost btn-square"
              aria-label="Open navigation menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <ul
              tabIndex={0}
              className="menu dropdown-content z-50 mt-3 w-52 rounded-box bg-base-100 p-3 shadow-lg"
            >
              <li><Link href="/">Home</Link></li>
              <li><Link href="/services">Services</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/login">Sign In</Link></li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Navbar;
