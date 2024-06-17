"use client";

import Image from "next/image";
import logo from "@/images/logo.svg";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const BurgerMenu = dynamic(() => import("@/components/BurgerMenu"), {
  ssr: false,
});

function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLinkClick = (target) => {
    if (target.startsWith("#")) {
      const targetElement = document.querySelector(target);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push(target);
      }
    } else {
      router.push(target);
    }
  };

  const menuItems = [
    { id: 1, link: "/#services", label: "I NOSTRI SERVIZI" },
    { id: 2, link: "/gallery", label: "GALLERY" },
    { id: 3, link: "/contacts", label: "CONTATTI" },
    { id: 4, link: "/#booking-section", label: "PRENOTA" },
  ];

  return (
    <div className="fixed top-0 z-50 flex w-full items-center justify-between bg-white px-4 py-4 text-sm transition duration-300 ease-in-out md:px-28 lg:px-64">
      <Image src={logo} className=" w-16 lg:w-20" alt="Logo" />
      <ul className="hidden gap-10 md:flex">
        <li>
          <Link
            href="/#services"
            className="link cursor-pointer focus:font-bold focus:text-[#c9a6b0] active:decoration-[#c9a6b0]"
          >
            I NOSTRI SERVIZI
          </Link>
        </li>
        <li>
          <Link
            href="/gallery"
            className="link cursor-pointer focus:font-bold focus:text-[#c9a6b0] active:decoration-[#c9a6b0]"
          >
            GALLERY
          </Link>
        </li>
        <li>
          <Link
            href="/contacts"
            className="link cursor-pointer focus:font-bold focus:text-[#c9a6b0] active:decoration-[#cfcccc]"
          >
            CONTATTI
          </Link>
        </li>
        <li>
          <Link
            href="/#booking-section"
            className="link cursor-pointer font-semibold active:underline focus:text-[#c9a6b0] active:decoration-[#c9a6b0] focus:font-bold"
          >
            PRENOTA
          </Link>
        </li>
      </ul>
      <div className="md:hidden">
        <BurgerMenu
          isOpen={isMenuOpen}
          setIsOpen={setIsMenuOpen}
          menuItems={menuItems}
        />
      </div>
    </div>
  );
}

export default Navbar;
