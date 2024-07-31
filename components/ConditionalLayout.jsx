// components/ConditionalLayout.jsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const hideLayout = pathname === "/dashboard"; // Adjust this to your specific page

  return (
    <>
      {!hideLayout && <Navbar />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
}
