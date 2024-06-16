// pages/contacts.js

import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const Contacts = () => {
  const Map = dynamic(() => import("@/components/Map"), {
    ssr: false,
  });

  const latitude = 44.96556;
  const longitude = 9.8514;
  return (
    <div className=" m-auto mt-2 w-[90vw] md:mt-32 md:w-[70vw] ">
      <h2 className="font-serif text-2xl font-bold tracking-tight md:text-3xl">
        I nostri contatti
      </h2>
      <div className="grid md:grid-cols-2 md:pt-8">
        <div className="flex flex-col gap-4">
          <h2 className=" text-xl font-bold tracking-tight md:text-xl">
            Orari di apertura
          </h2>
          <div>
            <p>
              Lunedì, Mercoledi <b>9.00 - 19.00</b>
            </p>
            <p>
              Martedì, Giovedì <b>10.00 - 20.00</b>
            </p>
            <p>
              Venerdì <b>9.00 - 18.30</b>
            </p>
            <p>
              Sabato, Domenica <b>Chiuso</b>
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className=" text-xl font-bold tracking-tight md:text-xl">
            Contatti
          </h2>
          <div>
            <Link
              target="_blank"
              href={"https://maps.app.goo.gl/Vg7QqpUBStAnfnzV7"}
            >
              <p>Via Emilia 60, 29010 Roveleto PC</p>
            </Link>
            <Link className="underline" href="mailto:gioiabeautyy@gmail.com">
              <p>gioiabeautyy@gmail.com</p>
            </Link>
            <Link href="tel:+393914213634">
              <p>+39 391 421 3634</p>
            </Link>
          </div>
        </div>
      </div>
      {/* Here you put the map */}
      <Map latitude={latitude} longitude={longitude} />
    </div>
  );
};

export default Contacts;
