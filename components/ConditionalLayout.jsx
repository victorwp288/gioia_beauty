// components/ConditionalLayout.jsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const hideLayoutPaths = ["/dashboard", "/login"]; // Add your paths here

  const hideLayout = hideLayoutPaths.includes(pathname);
  return (
    <>
      {!hideLayout && <Navbar />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
}
