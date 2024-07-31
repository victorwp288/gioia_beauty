import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export function AppointmentCalendar({ appointments }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const filteredAppointments = appointments.filter(
    (appointment) =>
      new Date(appointment.selectedDate).toDateString() ===
      selectedDate.toDateString()
  );

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex h-full w-full max-w-6xl flex-col gap-6 md:flex-row md:gap-8">
      <div className="flex-1 rounded-lg border bg-background">
        <div className="flex items-center justify-between border-b p-4">
          <div className="text-lg font-medium">
            {selectedDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setSelectedDate(
                  new Date(selectedDate.setMonth(selectedDate.getMonth() - 1))
                )
              }
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setSelectedDate(
                  new Date(selectedDate.setMonth(selectedDate.getMonth() + 1))
                )
              }
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => setSelectedDate(date)}
            initialFocus
          />
        </div>
      </div>
      <div className="flex-1 rounded-lg border bg-background p-6">
        <h2 className="text-lg font-medium">
          Appointments for {formatDate(selectedDate)}
        </h2>
        <div className="mt-4 grid gap-4">
          {filteredAppointments.map((appointment) => (
            <div key={appointment.id} className="flex items-start gap-4">
              <div className="flex-none rounded-md bg-muted px-2 py-1 text-xs font-medium">
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
                  {appointment.duration} minutes
                </p>
              </div>
            </div>
          ))}
          {filteredAppointments.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No appointments for this date.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
