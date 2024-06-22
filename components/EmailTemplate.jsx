// components/EmailTemplate.js
import * as React from "react";

export const EmailTemplate = ({ name, startTime, endTime, duration, date }) => (
  <div>
    <h1>Welcome, {name}!</h1>
    <p>Your appointment is confirmed for {date}</p>
    <p>
      <strong>Start Time:</strong> {startTime}
    </p>
    <p>
      <strong>End Time:</strong> {endTime}
    </p>
    <p>
      <strong>Duration:</strong> {duration} minutes
    </p>
    <p>Thank you for booking with us!</p>
    <p>This email cant be responded to!</p>
  </div>
);
