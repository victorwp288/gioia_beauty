import React from "react";
import Image from "next/image";
import { whiteTick } from "./ServicesImages";

function Technologies() {
  return (
    <div className=" m-auto w-[90vw] md:w-[70vw] md:py-12">
      <div className="flex flex-col gap-2 py-8 pb-6 md:gap-4 md:py-4">
        <h4 className="text-xs font-extrabold text-white ">SCOPRI</h4>
        <h2 className="font-serif text-2xl font-bold tracking-tight text-white md:text-3xl">
          Le tecnologie
        </h2>
      </div>
      <div className="grid md:grid-cols-3 gap-14 py-10 md:py-0">
        <div className=" text-white flex-col gap-2 flex">
          <div className="flex flex-col gap-2">
            <Image
              src={whiteTick}
              width={26}
              height={26}
              alt="technology indicator"
            />
            <h2 className="text-lg font-semibold">Elettroporatore</h2>
          </div>

          <p className="text-sm">
            L’elettroporatore è un dispositivo medico utilizzato per facilitare
            l’ingresso di sostanze terapeutiche all’interno delle cellule
            attraverso l’applicazione di impulsi elettrici. Questi impulsi
            creano temporaneamente pori nella membrana cellulare, permettendo a
            molecole di vario tipo, come farmaci o DNA, di penetrare
            efficacemente nelle cellule.
          </p>
        </div>
        <div className=" text-white flex-col gap-2 flex">
          <div className="flex flex-col gap-2">
            <Image
              src={whiteTick}
              width={26}
              height={26}
              alt="technology indicator"
            />
            <h2 className="text-lg font-semibold">Ossigeno dermo infusione</h2>
          </div>

          <p className="text-sm">
            L’ossigeno dermo infusione è una tecnica estetica che utilizza
            ossigeno ad alta concentrazione per veicolare nutrienti nella pelle.
            Migliora l’idratazione, stimola il collagene e favorisce la
            rigenerazione cellulare, rendendo la pelle più luminosa e compatta.
            È particolarmente apprezzato per i suoi effetti immediati e senza
            tempi di recupero.
          </p>
        </div>
        <div className=" text-white flex-col gap-2 flex">
          <div className="flex flex-col gap-2">
            <Image
              src={whiteTick}
              width={26}
              height={26}
              alt="technology indicator"
            />
            <h2 className="text-lg font-semibold">Pressoterapia</h2>
          </div>

          <p className="text-sm">
            La pressoterapia utilizza la pressione dell’aria per stimolare il
            sistema linfatico migliorando la circolazione sanguigna. Attraverso
            appositi applicatori che avvolgono le gambe, le braccia o altre
            parti del corpo, aiuta a ridurre gonfiori, eliminare tossine e
            migliorare la tonicità della pelle. È frequentemente utilizzata per
            trattare linfedemi, cellulite e per favorire il recupero muscolare
            post-allenamento.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Technologies;
