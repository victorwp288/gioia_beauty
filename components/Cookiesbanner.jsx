"use client";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function Cookiesbanner() {
  const [firstVisit, setFirstVisit] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("firstVisit")) {
      setFirstVisit(true);
      localStorage.setItem("firstVisit", "no");
    }
  }, []);

  if (!firstVisit) {
    return null;
  }

  return (
    <div className=" z-50 fixed bottom-0 left-0 right-0 bg-zinc-950 py-4 px-6 text-white md:py-6 md:px-8">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">We use cookies</h3>
          <p className="text-sm text-gray-400">
            We use cookies to improve your experience on our website. By
            continuing to use our site, you agree to our use of cookies!
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <Button className="w-full sm:w-auto">Accept Cookies</Button>
          <Button className="w-full sm:w-auto">Decline Cookies</Button>
        </div>
      </div>
    </div>
  );
}
