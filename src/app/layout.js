
import { Toaster } from "react-hot-toast";
import "./globals.css";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export const metadata = {
  title: "FixMate - Your Repair Partner",
  description: "Your Trusted Partner for Every Repair.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-right" reverseOrder={false} />
        <Navbar />

        {children}

        <Footer />
      </body>
    </html>
  );
}
