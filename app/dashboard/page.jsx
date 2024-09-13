import React from "react";
import { Dashy } from "@/components/Dashy";
import SubscriberList from "@/components/SubscriberList";

const DashboardPage = () => {
  return (
    <div className="w-[95vw] m-auto py-16">
      <Dashy />

      <section className="w-[91vw] mt-6 m-auto">
        <h2 className="text-2xl font-semibold mb-4">Iscrizioni newsletter</h2>
        <SubscriberList />
      </section>
    </div>
  );
};

export default DashboardPage;
