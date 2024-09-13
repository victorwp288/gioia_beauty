"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { X } from "lucide-react"; // Import the X icon

const SubscriberList = () => {
  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    const fetchSubscribers = async () => {
      const querySnapshot = await getDocs(
        collection(db, "newsletter_subscribers")
      );
      setSubscribers(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          email: doc.data().email,
        }))
      );
    };
    fetchSubscribers();
  }, []);

  const copyAllEmails = () => {
    const allEmails = subscribers
      .map((subscriber) => subscriber.email)
      .join(", ");
    navigator.clipboard.writeText(allEmails);
    toast.success("All emails copied to clipboard!");
  };

  const handleDeleteSubscriber = async (subscriberId) => {
    try {
      await deleteDoc(doc(db, "newsletter_subscribers", subscriberId));
      setSubscribers(subscribers.filter((s) => s.id !== subscriberId));
      toast.success("Subscriber deleted successfully");
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      toast.error("Failed to delete subscriber. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={copyAllEmails}>Copia le email</Button>
      <div className="bg-gray-100 p-4 rounded-md">
        <h3 className="font-semibold mb-2">Emails degli iscritti</h3>
        <ul className="list-none">
          {subscribers.map((subscriber) => (
            <li
              key={subscriber.id}
              className="flex items-center justify-between py-2 border-b border-gray-200"
            >
              <span>{subscriber.email}</span>
              <button
                onClick={() => handleDeleteSubscriber(subscriber.id)}
                className="p-2 hover:bg-red-100 rounded-full"
              >
                <X size={16} className="text-red-500" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SubscriberList;
