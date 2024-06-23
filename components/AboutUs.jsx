import React from "react";
import Image from "next/image";
import { elettroporatore } from "./ServicesImages";

function AboutUs() {
  return (
    <div className="  m-auto w-[90vw] md:w-[70vw] md:py-12 py-10 ">
      <div className="flex flex-col gap-2 py-2 pb-6 md:gap-4 md:py-4">
        <h4 className="text-xs font-extrabold text-primary ">SCOPRI</h4>
        <h2 className="font-serif text-3xl font-bold tracking-tight  md:text-3xl">
          Come nasce Gioia Beauty
        </h2>
      </div>

      <p className="text-sm md:w-[40vw]">
        Ciao! Sono Gioia, nata nel 2003 e da sempre appassionata del mondo
        dell’estetica. <br /> <br /> Questa mia passione mi ha accompagnato fin
        da bambina, portandomi nel 2019 a iscrivermi all’Enaip di Piacenza, dove
        ho frequentato il biennio di estetica. <br /> A 18 anni, completato il
        biennio, ho deciso di continuare la mia formazione presso la Diadema
        Academy, l’accademia italiana di eccellenza nel settore dell’estetica.
        Ho frequentato il secondo e il terzo anno, arricchendo
        contemporaneamente la mia esperienza lavorativa prima in un centro a
        Milano e successivamente in un centro estetico nella provincia di Parma.
        <br />
        Dopo due anni di studi, mi sono diplomata con una specializzazione e il
        massimo dei voti. Ho proseguito la mia formazione ottenendo l’attestato
        da make-up artist e hairstylist presso l’Accademia MUD di Milano, scuola
        fondata nel 1997 a Los Angeles e arrivata a Milano nel 2016. <br />
        <br />
        Grazie alla mia esperienza e alla continua formazione, ho creato un
        ambiente accogliente con servizi di alta qualità, unendo l’impegno per
        la sostenibilità attraverso l’uso di prodotti biologici, vegani e
        strumenti riutilizzabili e riciclabili.
      </p>
    </div>
  );
}

export default AboutUs;
