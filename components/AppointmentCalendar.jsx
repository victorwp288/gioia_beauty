// components/AppointmentCalendar.jsx

import React from "react";
import { Calendar } from "@/components/ui/calendar";

export function AppointmentCalendar({
  appointments,
  selectedDate,
  setSelectedDate,
}) {
  const filteredAppointments = appointments.filter(
    (appointment) =>
      new Date(appointment.selectedDate).toDateString() ===
      selectedDate.toDateString()
  );

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("it-IT", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDateSelect = (date) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  return (
    <div className="flex flex-col gap-2 h-full w-full">
      {/* Calendar Component */}
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-700/70 bg-white dark:bg-zinc-800 p-4 w-full h-fit">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          initialFocus
          className="w-full"
          tableClassName="w-full table-fixed"
        />
      </div>

      {/* Appointments List */}
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-700/70 bg-white dark:bg-zinc-800 p-6 max-h-[calc(100vh-220px)] overflow-y-auto w-full">
        <div className="mt-4 grid gap-4">
          {filteredAppointments.map((appointment) => (
            <div key={appointment.id} className="flex items-start gap-4">
              <div className="flex-none rounded-md bg-gray-200 dark:bg-gray-600 px-2 py-1 text-xs font-medium">
                {appointment.startTime}
              </div>
              <div className="flex-1">
                <h3 className="text-base font-medium">
                  {appointment.appointmentType}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {appointment.name} - {appointment.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  {appointment.duration} minuti
                </p>
              </div>
            </div>
          ))}
          {filteredAppointments.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nessun appuntamento per questa data
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
