"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Clock } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  runTransaction,
  doc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/utils/firebase";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import appointmentTypesData from "@/data/appointmentTypes.json";
import BookingConfirmation from "./BookingConfirmation";

// Constants and utility functions
const appointmentTypes = appointmentTypesData;

const formSchema = z.object({
  date: z.date(),
  note: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  number: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  timeSlot: z.string().min(1, "Time slot is required"),
  selectedDate: z
    .date()
    .min(
      new Date(new Date().setHours(0, 0, 0, 0) + 86400000),
      "Cannot book today or past dates"
    ), // Disallow booking today
  appointmentType: z.string().min(1, "Appointment type is required"),
  variant: z.string().optional(),
  duration: z.number().min(1, "Duration is required"),
});

const openCloseHours = {
  1: { open: "09:00", close: "19:00" }, // Monday
  2: { open: "10:00", close: "20:00" }, // Tuesday
  3: { open: "09:00", close: "19:00" }, // Wednesday
  4: { open: "10:00", close: "20:00" }, // Thursday
  5: { open: "09:00", close: "18:30" }, // Friday
  6: null, // Saturday Closed
  0: null, // Sunday Closed
};

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const BookAppointment = () => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState();
  const [vacationPeriods, setVacationPeriods] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null); // Initialize as null
  const [appointmentType, setAppointmentType] = useState(appointmentTypes[0]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showAllTimeSlots, setShowAllTimeSlots] = useState(false);
  const initialVisibleSlots = 12; // Adjust as needed
  const [modalIsOpen, setIsOpen] = useState(false);

  const appointmentsCache = useRef({});

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: null, // Initialize as null
      note: "",
      name: "",
      number: "",
      email: "",
      timeSlot: "",
      selectedDate: null, // Initialize as null
      appointmentType: appointmentTypes[0].type,
      variant: "",
      duration: appointmentTypes[0].durations[0],
    },
  });

  // Fetch vacation periods from Firestore
  useEffect(() => {
    const fetchVacationPeriods = async () => {
      const querySnapshot = await getDocs(collection(db, "vacations"));
      const vacationsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Convert dates from strings to Date objects
      const formattedVacations = vacationsData.map((vacation) => ({
        ...vacation,
        startDate: new Date(vacation.startDate),
        endDate: new Date(vacation.endDate),
      }));
      setVacationPeriods(formattedVacations);
    };

    fetchVacationPeriods();
  }, []);

  // Function to check if a day should be disabled
  const isDisabledDay = (day) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dayOfWeek = day.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Check if day is in any vacation period
    const isInVacation = vacationPeriods.some((vacation) => {
      // Normalize dates to ignore time
      const vacationStart = new Date(
        vacation.startDate.getFullYear(),
        vacation.startDate.getMonth(),
        vacation.startDate.getDate()
      );
      const vacationEnd = new Date(
        vacation.endDate.getFullYear(),
        vacation.endDate.getMonth(),
        vacation.endDate.getDate()
      );
      return day >= vacationStart && day <= vacationEnd;
    });

    return day <= today || isWeekend || isInVacation; // Disable today, past dates, weekends, and vacation days
  };

  // Function to get the next available date
  const getNextAvailableDate = () => {
    let date = new Date();
    date.setDate(date.getDate() + 1); // Start from tomorrow

    while (isDisabledDay(date)) {
      date.setDate(date.getDate() + 1);
    }
    return date;
  };

  // Initialize selectedDate after vacation periods are fetched
  useEffect(() => {
    const nextDate = getNextAvailableDate();
    setSelectedDate(nextDate);
    form.setValue("date", nextDate);
    form.setValue("selectedDate", nextDate);
  }, [vacationPeriods]);

  // Fetch time slots only when necessary
  const fetchTimeSlots = useCallback(
    async (date) => {
      if (!date) return;

      const dayOfWeek = date.getDay();
      const hours = openCloseHours[dayOfWeek];

      if (!hours) {
        setTimeSlots([]);
        return; // Closed day, no available slots
      }

      const dateKey = date.toDateString();
      let existingAppointments = appointmentsCache[dateKey];

      if (!existingAppointments) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const q = query(
          collection(db, "customers"),
          where("selectedDate", ">=", startOfDay.toISOString()),
          where("selectedDate", "<=", endOfDay.toISOString())
        );
        const querySnapshot = await getDocs(q);
        existingAppointments = querySnapshot.docs
          .map((doc) => doc.data())
          .sort((a, b) => a.startTime.localeCompare(b.startTime));

        // Cache the appointments to avoid redundant fetches
        appointmentsCache.current[dateKey] = existingAppointments;
      }

      const availableTimeSlots = generateTimeSlots(
        date,
        existingAppointments,
        hours
      );

      setTimeSlots(availableTimeSlots);
      if (availableTimeSlots.length > 0) {
        const firstAvailableTimeSlot = availableTimeSlots[0];
        setSelectedTimeSlot(firstAvailableTimeSlot);
        form.setValue("timeSlot", firstAvailableTimeSlot);
      } else {
        // If no time slots are available on this date, find the next date
        const nextDate = getNextAvailableDateFrom(date);
        setSelectedDate(nextDate);
        form.setValue("date", nextDate);
        form.setValue("selectedDate", nextDate);
      }
    },
    [appointmentType, form]
  );

  // Function to get the next available date from a given date
  const getNextAvailableDateFrom = (startDate) => {
    let date = new Date(startDate);
    date.setDate(date.getDate() + 1);

    while (isDisabledDay(date)) {
      date.setDate(date.getDate() + 1);
    }
    return date;
  };

  const generateTimeSlots = (date, existingAppointments, hours) => {
    const [openHours, openMinutes] = hours.open.split(":").map(Number);
    const [closeHours, closeMinutes] = hours.close.split(":").map(Number);
    const openingTime = openHours * 60 + openMinutes;
    const closingTime = closeHours * 60 + closeMinutes;

    const slots = [];
    let time = openingTime;

    const duration = form.getValues("duration") || appointmentType.durations[0];

    while (time + duration <= closingTime) {
      if (!doesSlotOverlap(time, existingAppointments, duration)) {
        slots.push(formatTime(time));
      }
      time += 15; // Increment by 15 minutes
    }

    return slots;
  };

  const doesSlotOverlap = (time, existingAppointments, duration) => {
    const slotEndTime = time + duration;
    return existingAppointments.some((appointment) => {
      const [appStartHours, appStartMinutes] = appointment.startTime
        .split(":")
        .map(Number);
      const appStartTime = appStartHours * 60 + appStartMinutes;
      const appEndTime = appStartTime + appointment.totalDuration;

      return time < appEndTime && slotEndTime > appStartTime;
    });
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    fetchTimeSlots(selectedDate);
  }, [selectedDate, appointmentType, selectedVariant]);

  const handleAppointmentTypeChange = (e) => {
    const selectedType = appointmentTypes.find(
      (type) => type.type === e.target.value
    );
    setAppointmentType(selectedType);
    setSelectedVariant(null);
    form.setValue("appointmentType", selectedType.type);
    form.setValue("variant", "");
    form.setValue("duration", selectedType.durations[0]);
  };

  const handleVariantChange = (e) => {
    const selectedDuration = parseInt(e.target.value);
    setSelectedVariant(selectedDuration);
    form.setValue("variant", e.target.value);
    form.setValue("duration", selectedDuration);
  };

  const handleSubmit = async (data) => {
    try {
      const startTime = data.timeSlot;
      const duration = data.duration;
      const extraTime = appointmentType.extraTime[0];
      const [startHours, startMinutes] = startTime.split(":").map(Number);

      let endMinutes = startMinutes + duration + extraTime;
      let endHours = startHours;

      if (endMinutes >= 60) {
        endHours += Math.floor(endMinutes / 60);
        endMinutes = endMinutes % 60;
      }

      const formattedEndTime = `${endHours
        .toString()
        .padStart(2, "0")}:${endMinutes.toString().padStart(2, "0")}`;

      const selectedDateString = data.selectedDate.toISOString();

      // Server-side validation using Firestore transaction
      await runTransaction(db, async (transaction) => {
        const appointmentsRef = collection(db, "customers");

        // Query for overlapping appointments
        const q = query(
          appointmentsRef,
          where("selectedDate", "==", selectedDateString),
          where("startTime", "<", formattedEndTime),
          where("endTime", ">", startTime)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          throw new Error(
            "Il time slot selezionato non è più disponibile. Per favore, seleziona un altro orario."
          );
        }

        // Proceed to add the new appointment
        const newAppointmentRef = doc(appointmentsRef);

        transaction.set(newAppointmentRef, {
          ...data,
          startTime,
          endTime: formattedEndTime,
          duration,
          totalDuration: duration + extraTime,
          selectedDate: selectedDateString,
          appointmentType: data.appointmentType || appointmentTypes[0].type,
          variant: selectedVariant,
          createdAt: new Date().toISOString(),
        });
      });

      // Send confirmation email
      const emailData = {
        email: data.email,
        name: data.name,
        startTime,
        endTime: formattedEndTime,
        duration,
        appointmentType: data.appointmentType,
        date: formatDate(data.selectedDate),
      };

      const emailResponse = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });

      if (!emailResponse.ok) {
        const emailResult = await emailResponse.json();
        console.error("Error sending email:", emailResult);
      }

      // Open the confirmation modal
      openModal();
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert(error.message);
    }
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div className="m-auto mt-12 w-[90vw] space-y-4 md:w-[70vw]">
      <div className="flex flex-col gap-2 py-1 md:gap-4 md:py-4">
        <h4 className="text-xs font-extrabold text-primary ">
          CONCEDITI UN MOMENTO DI RELAX
        </h4>
        <h2 className="font-serif text-3xl font-bold tracking-tight md:text-3xl">
          Prenota un appuntamento
        </h2>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2">
            {/* Calendar */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seleziona data*</FormLabel>
                  <FormControl>
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setSelectedDate(date);
                        form.setValue("selectedDate", date);
                      }}
                      disabled={isDisabledDay}
                      className="w-fit rounded-md border"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Time Slot */}
            <FormField
              control={form.control}
              name="timeSlot"
              render={({ field }) => (
                <FormItem className="mt-3 md:mt-0">
                  <FormLabel className="mb-3 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Seleziona orario*
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-2 rounded-lg border p-5">
                        {(showAllTimeSlots
                          ? timeSlots
                          : timeSlots.slice(0, initialVisibleSlots)
                        ).map((time, index) => (
                          <h2
                            key={index}
                            onClick={() => {
                              setSelectedTimeSlot(time);
                              field.onChange(time);
                            }}
                            className={`cursor-pointer rounded-full border p-2 text-center hover:bg-primary hover:text-white ${
                              time === selectedTimeSlot &&
                              "bg-primary text-white"
                            }`}
                          >
                            {time}
                          </h2>
                        ))}
                      </div>
                      {timeSlots.length > initialVisibleSlots && (
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => setShowAllTimeSlots(!showAllTimeSlots)}
                        >
                          {showAllTimeSlots
                            ? "Mostra meno"
                            : `Mostra più (${
                                timeSlots.length - initialVisibleSlots
                              } altri)`}
                        </Button>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Appointment Type */}
            <FormField
              control={form.control}
              name="appointmentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trattamento*</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:shadow disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                      onChange={handleAppointmentTypeChange}
                    >
                      {appointmentTypes.map((appointmentType) => (
                        <option
                          key={appointmentType.id}
                          value={appointmentType.type}
                        >
                          {appointmentType.type}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {appointmentType.durations.length > 1 && (
              <FormField
                control={form.control}
                name="variant"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durata del trattamento</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:shadow disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                        onChange={handleVariantChange}
                      >
                        <option value="">Seleziona durata</option>
                        {appointmentType.durations.map((duration, index) => (
                          <option key={index} value={duration}>
                            {duration} minuti
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {/* Note */}
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Note" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome e Cognome*</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Phone Number */}
            <div>
              <FormLabel>Numero di telefono*</FormLabel>
              <Controller
                name="number"
                control={form.control}
                render={({ field: { onChange, value } }) => (
                  <PhoneInput
                    country={"it"}
                    value={value}
                    onChange={(phone, country, e, formattedValue) => {
                      onChange(formattedValue); // Includes the "+"
                    }}
                  />
                )}
              />
            </div>
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (opzionale)</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-3" color="primary" type="submit">
              Prenota appuntamento
            </Button>
          </div>
        </form>
        <BookingConfirmation isOpen={modalIsOpen} onRequestClose={closeModal} />
      </Form>
    </div>
  );
};

export default BookAppointment;
