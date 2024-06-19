import React from "react";
import Image from "next/image";
import { elettroporatore } from "./ServicesImages";

function AboutUs() {
  return (
    <div className="  m-auto w-[90vw] md:w-[70vw] md:py-12 py-10 ">
      <div className="flex flex-col gap-2 py-2 pb-6 md:gap-4 md:py-4">
        <h4 className="text-xs font-extrabold text-primary ">SCOPRI</h4>
        <h2 className="font-serif text-2xl font-bold tracking-tight  md:text-3xl">
          Come nasce Gioia beauty
        </h2>
      </div>

      <p className=" md:w-[40vw]">
        Ciao! sono Gioia, nata nel 2003 e sin da bambina sono appassionata del
        mondo dell’estetica. Ho coltivato questa mia passione fino a quando, nel
        2019, ho deciso di iscrivermi all’Enaip di Piacenza, frequentando il
        biennio di estetica.
        <br /> <br />A 18 anni, terminato il biennio, mi sono iscritta presso{" "}
        <i>Diadema Academy</i>, l’accademia d’eccellenza italiana nel settore
        dell’estetica. Ho frequentato il secondo e il terzo anno. <br />
        Nel mentre ho arricchito la mia esperienza lavorativa prima presso un
        centro a Milano, successivamente presso un centro estetico in provincia
        di Parma. <br /> Dopo i due anni di studio, mi sono diplomata con valore
        di specializzazione con il massimo dei voti. Ho proseguito la mia
        formazione ottenendo l’attestato da make-up artist e hairstylist all’
        <i>Accademia MUD</i> di Milano, scuola nata nel 1997 a Los Angeles ed
        arrivata a Milano nel 2016. <br />
        <br />
        Grazie alla mia esperienza e alla mia continua formazione, ho realizzato
        un ambiente accogliente con servizi di alta qualità, che si uniscono
        all’impegno per la sostenibilità; utilizzando prodotti biologici, vegani
        e strumenti riutilizzabili e riciclabili.
      </p>
    </div>
  );
}

export default AboutUs;
