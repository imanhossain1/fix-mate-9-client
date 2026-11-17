
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-neutral text-neutral-content">

      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:grid-cols-2 lg:grid-cols-4">

        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-2xl">
              🔧
            </div>

            <span className="text-2xl font-extrabold">
              FixMate
            </span>
          </Link>

          <p className="mt-5 max-w-xs text-sm leading-7 text-neutral-content/70">
            Your Trusted Partner for Every Repair.
            Find professional technicians and get reliable
            repair services at your doorstep.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-5 text-lg font-bold">
            Quick Links
          </h3>

          <ul className="space-y-3 text-sm text-neutral-content/70">
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

            <li>
              <Link href="/login" className="hover:text-primary">
                Sign In
              </Link>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="mb-5 text-lg font-bold">
            Our Services
          </h3>

          <ul className="space-y-3 text-sm text-neutral-content/70">
            <li>AC Repair</li>
            <li>Laptop & Computer Repair</li>
            <li>Mobile Repair</li>
            <li>TV Repair</li>
            <li>Home Appliance Repair</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-5 text-lg font-bold">
            Contact Us
          </h3>

          <ul className="space-y-4 text-sm text-neutral-content/70">
            <li className="flex gap-3">
              <span>📍</span>
              <span>Bangladesh</span>
            </li>

            <li className="flex gap-3">
              <span>📧</span>
              <span>support@fixmate.com</span>
            </li>

            <li className="flex gap-3">
              <span>📞</span>
              <span>+880 1XXXXXXXXX</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Footer */}
      <div className="border-t border-neutral-content/20">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-center text-sm text-neutral-content/60 md:flex-row">

          <p>
            © {new Date().getFullYear()} FixMate. All rights reserved.
          </p>

          <p>
            Your Trusted Partner for Every Repair.
          </p>

        </div>
      </div>

    </footer>
  );
};

export default Footer;
