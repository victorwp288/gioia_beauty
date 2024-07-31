"use client";

// components/SubscribeForm.js
import { useState } from "react";
import { db } from "../utils/firebase";
import { collection, addDoc } from "firebase/firestore";
const SubscribeForm = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "newsletter_subscribers"), {
        email,
      });
      setStatus("Successfully subscribed!");
    } catch (error) {
      setStatus("Error: " + error.message);
    }

    setEmail("");
  };

  return (
    <div className="w-full bg-primary md:py-8 text-center">
      <div className="max-w-md mx-auto mt-10 md:w-full md:mt-0">
        <div className="text-white px-4 pt-6">
          <h2 className="font-bold text-2xl pb-4">Newsletter</h2>
          <p className="text-sm">
            Vuoi rimanere aggiornato su tutte le novità, offerte speciali e
            contenuti esclusivi? Iscriviti alla newsletter e ricevi direttamente
            nella tua casella di posta le ultime notizie e promozioni
            imperdibili!
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="px-4 pt-2 pb-8 mb-4 text-center"
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            ></label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-white bg-primary flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-white focus-visible:outline-none focus-visible:shadow disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Inserisci la tua mail"
              required
            />
          </div>
          <div className="flex items-center justify-center text-center">
            <button
              type="submit"
              className=" text-primary inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:shadow disabled:pointer-events-none disabled:opacity-50 bg-white hover:bg-slate-200 h-10 px-4 py-2 mt-3"
            >
              Iscriviti
            </button>
          </div>
          {status && <p className="mt-4 text-sm text-gray-600">{status}</p>}
        </form>
      </div>
    </div>
  );
};

export default SubscribeForm;
