// components/EmailTemplate.js
import * as React from "react";

export const EmailTemplate = ({ name, startTime, endTime, duration, date }) => (
  <div>
    <h1>Ciao, {name}!</h1>
    <p>
      Il tuo appuntamento nel centro estetico Gioia Beauty è stato confermato
      per il giorno {date}
    </p>
    <p>
      <strong>Inizio appuntamento:</strong> {startTime}
    </p>
    <p>
      <strong>Fine appuntamento:</strong> {endTime}
    </p>
    <p>
      <strong>Durata:</strong> {duration} minutes
    </p>
    <p>Grazie per la prenotazione.</p>
    <p>
      Non puoi rispondere a questa email.{" "}
      <i>This email cant be responded to.</i>
    </p>
  </div>
);
