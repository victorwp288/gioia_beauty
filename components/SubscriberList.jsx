"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

const SubscriberList = () => {
  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    const fetchSubscribers = async () => {
      const querySnapshot = await getDocs(
        collection(db, "newsletter_subscribers")
      );
      setSubscribers(querySnapshot.docs.map((doc) => doc.data().email));
    };
    fetchSubscribers();
  }, []);

  const copyAllEmails = () => {
    const allEmails = subscribers.join(", ");
    navigator.clipboard.writeText(allEmails);
    toast.success("All emails copied to clipboard!");
  };

  return (
    <div className="space-y-4">
      <Button onClick={copyAllEmails}>Copia le email</Button>
      <div className="bg-gray-100 p-4 rounded-md">
        <h3 className="font-semibold mb-2">Subscriber Emails:</h3>
        <ul className="list-disc pl-5">
          {subscribers.map((email, index) => (
            <li key={index}>{email}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SubscriberList;
