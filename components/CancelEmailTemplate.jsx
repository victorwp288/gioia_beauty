// components/EmailTemplate.js
import * as React from "react";

export const CancelEmailTemplate = ({
  name,
  startTime,
  endTime,
  duration,
  date,
}) => (
  <div>
    <h1>Dear, {name}!</h1>
    <p>Your appointment is unfortunately canceled for {date}</p>
    <p>
      <strong>Start Time:</strong> {startTime}
    </p>
    <p>
      <strong>End Time:</strong> {endTime}
    </p>
    <p>
      <strong>Duration:</strong> {duration} minutes
    </p>
    <p>We are sorry for the inconvenience!</p>
    <p>This email cant be responded to!</p>
  </div>
);
