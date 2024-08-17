// components/EmailTemplate.js
import * as React from "react";

export const EmailTemplate = ({ name, startTime, endTime, duration, date }) => (
  <div>
    <h1>Gentile {name},</h1>
    <p>
      Il tuo appuntamento nel centro estetico Gioia Beauty è stato confermato
      per il giorno {date}.
    </p>
    <p>
      <strong>Inizio appuntamento:</strong> {startTime}
    </p>
    <p>
      <strong>Fine appuntamento:</strong> {endTime}
    </p>
    <p>
      <strong>Durata:</strong> {duration} minuti
    </p>

    <p>
      <i>Non è possibile rispondere a questa mail.</i>{" "}
    </p>
  </div>
);
