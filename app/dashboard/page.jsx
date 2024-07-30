import React from "react";
import { Dashy } from "@/components/Dashy";
import SubscriberList from "@/components/SubscriberList";

const DashboardPage = () => {
  return (
    <div className="">
      <Dashy />

      <section className="">
        <h2 className="text-2xl font-semibold mb-4">Newsletter Management</h2>
        <SubscriberList />
      </section>
    </div>
  );
};

export default DashboardPage;
