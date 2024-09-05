"use client";
import React, { useEffect, useState, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays, Clock } from "lucide-react";
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
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import { db } from "@/utils/firebase";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import appointmentTypes from "@/data/appointmentTypes.json";

import BookingConfirmation from "./BookingConfirmation";

const toasty = () => toast("Appointment Booked!");

const formSchema = z.object({
  date: z.date(),
  note: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  number: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  timeSlot: z.string().min(1, "Time slot is required"),
  selectedDate: z
    .date()
    .min(new Date(new Date().setHours(0, 0, 0, 0)), "Date is required"), // Allow selecting today starting from 00:00
  appointmentType: z.string().min(1, "Appointment type is required"),
  variant: z.string().optional(),
  duration: z.number().min(1, "Duration is required"),
});

const BookAppointment = () => {
  const [timeSlot, setTimeSlot] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointmentType, setAppointmentType] = useState(appointmentTypes[0]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showAllTimeSlots, setShowAllTimeSlots] = useState(false);
  const initialVisibleSlots = 12; // You can adjust this number

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      note: "",
      name: "",
      number: "",
      email: "",
      timeSlot: "",
      selectedDate: new Date(),
      appointmentType: appointmentTypes[0].type,
      variant: "",
      duration: appointmentTypes[0].durations[0],
    },
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

  const fetchTimeSlots = useCallback(
    async (date) => {
      if (!date) return;

      const now = new Date();

      // Normalize dates to compare only year, month, and day
      const normalizeDate = (d) =>
        new Date(d.getFullYear(), d.getMonth(), d.getDate());

      const isToday =
        normalizeDate(date).getTime() === normalizeDate(now).getTime();
      const currentTime = isToday ? now.getHours() * 60 + now.getMinutes() : 0;

      const dayOfWeek = date.getDay();
      const hours = openCloseHours[dayOfWeek];

      if (!hours) {
        setTimeSlot([]);
        return; // Closed day, no available slots
      }

      // Create start and end of the selected date in ISO format
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
      const existingAppointments = querySnapshot.docs
        .map((doc) => doc.data())
        .sort((a, b) => a.startTime.localeCompare(b.startTime));

      const [openHours, openMinutes] = hours.open.split(":").map(Number);
      const [closeHours, closeMinutes] = hours.close.split(":").map(Number);
      const openingTime = openHours * 60 + openMinutes;
      const closingTime = closeHours * 60 + closeMinutes;

      const generateTimeSlots = () => {
        const slots = [];
        let currentTime = openingTime;

        const addSlot = (time) => {
          if (
            time >= openingTime &&
            time < closingTime &&
            (!isToday || time > currentTime) &&
            !doesSlotOverlap(time)
          ) {
            slots.push(formatTime(time));
          }
        };

        const doesSlotOverlap = (time) => {
          // Calculate end time of the slot
          const slotEndTime = time + form.getValues("duration");
          return existingAppointments.some((appointment) => {
            const [appStartHours, appStartMinutes] = appointment.startTime
              .split(":")
              .map(Number);
            const appStartTime = appStartHours * 60 + appStartMinutes;
            const appEndTime = appStartTime + appointment.totalDuration;

            // Check if the slot overlaps with the existing appointment
            return time < appEndTime && slotEndTime > appStartTime;
          });
        };

        existingAppointments.forEach((appointment) => {
          const [appStartHours, appStartMinutes] = appointment.startTime
            .split(":")
            .map(Number);
          const appStartTime = appStartHours * 60 + appStartMinutes;

          // Add slots before this appointment
          while (currentTime < appStartTime) {
            addSlot(currentTime);
            currentTime += 15; // Increment by 15 minutes
          }

          // Move current time to the end of this appointment
          currentTime = appStartTime + appointment.totalDuration;

          // Round up to the next 15-minute interval
          currentTime = Math.ceil(currentTime / 15) * 15;
        });

        // Fill in any remaining slots after the last appointment
        while (currentTime < closingTime) {
          addSlot(currentTime);
          currentTime += 15; // Increment by 15 minutes
        }

        return slots;
      };

      const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, "0")}:${mins
          .toString()
          .padStart(2, "0")}`;
      };

      const availableTimeSlots = generateTimeSlots();

      setTimeSlot(availableTimeSlots);
      if (availableTimeSlots.length > 0) {
        const firstAvailableTimeSlot = availableTimeSlots[0];
        setSelectedTimeSlot(firstAvailableTimeSlot);
        form.setValue("timeSlot", firstAvailableTimeSlot);
      }
    },
    [selectedVariant, appointmentType, form]
  );

  useEffect(() => {
    fetchTimeSlots(selectedDate);
  }, [selectedDate, appointmentType, selectedVariant, fetchTimeSlots]);

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

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

  const [modalIsOpen, setIsOpen] = useState(false);

  const handleSubmit = async (data) => {
    try {
      const startTime = data.timeSlot;
      const duration = data.duration;
      const extraTime = appointmentType.extraTime[0]; // Get extraTime
      const [startHours, startMinutes] = startTime.split(":").map(Number);

      let endMinutes = startMinutes + duration + extraTime; // Include extraTime
      let endHours = startHours;

      if (endMinutes >= 60) {
        endHours += Math.floor(endMinutes / 60);
        endMinutes = endMinutes % 60;
      }

      const endTime = new Date(selectedDate);
      endTime.setHours(endHours, endMinutes, 0, 0);

      const formattedEndTime = `${endHours
        .toString()
        .padStart(2, "0")}:${endMinutes.toString().padStart(2, "0")}`;
      const formattedSelectedDate = formatDate(data.selectedDate);

      const q = query(
        collection(db, "newsletter_subscribers"),
        where("email", "==", data.email)
      );
      const querySnapshot = await getDocs(q);
      const isSubscribed = !querySnapshot.empty;

      const docRef = await addDoc(collection(db, "customers"), {
        ...data,
        startTime,
        endTime: formattedEndTime,
        duration, // This is the visible duration
        totalDuration: duration + extraTime, // This is the actual total duration
        selectedDate: data.selectedDate.toISOString(),
        appointmentType: data.appointmentType || appointmentTypes[0].type,
        variant: selectedVariant,
        createdAt: new Date().toISOString(),
        isSubscribedToNewsletter: isSubscribed,
      });
      console.log("Appointment booked with ID:", docRef.id);

      const emailData = {
        email: data.email,
        name: data.name,
        startTime: startTime,
        endTime: formattedEndTime,
        duration: duration,
        date: formattedSelectedDate,
      };

      console.log("Email data:", emailData);

      const emailResponse = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });

      const emailResult = await emailResponse.json();
      console.log("Email response:", emailResult);

      if (!emailResponse.ok) {
        console.error("Error sending email:", emailResult);
      }

      //  const whatsappData = await fetch("/api/whatsapp", {
      //    method: "POST",
      //    headers: {
      //      "Content-Type": "application/json",
      //    },
      //    body: JSON.stringify({
      //      number: data.number,
      //      name: data.name,
      //      time: data.timeSlot,
      //      date: formattedSelectedDate,
      //    }),
      //  });
      //  console.log("Whatsapp data:", whatsappData);
      //  const whatsappResult = await whatsappData.json();
      //  console.log("Whatsapp response:", whatsappResult);
      //  console.log("Whatsapp response:", whatsappResult.body);

      openModal();
    } catch (error) {
      console.error("Error booking appointment:", error);
    }
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const isPastDay = (day) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dayOfWeek = day.getDay();

    // Check if the day is Saturday or Sunday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    return day < today || isWeekend;
  };

  return (
    <div className=" m-auto mt-12 w-[90vw] space-y-4  md:w-[70vw]">
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
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 items-end">
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
                      disabled={isPastDay}
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
                      {timeSlot.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2 rounded-lg border p-5">
                          {(showAllTimeSlots
                            ? timeSlot
                            : timeSlot.slice(0, initialVisibleSlots)
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
                      ) : (
                        <div className="rounded-lg border p-5 text-center text-black">
                          Nessun appuntamento disponibile per oggi
                        </div>
                      )}

                      {timeSlot.length > initialVisibleSlots && (
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => setShowAllTimeSlots(!showAllTimeSlots)}
                        >
                          {showAllTimeSlots
                            ? "Mostra di meno"
                            : `Mostra di più (${
                                timeSlot.length - initialVisibleSlots
                              } more)`}
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
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:shadow disabled:cursor-not-allowed disabled:opacity-50"
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
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:shadow disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                        onChange={handleVariantChange}
                      >
                        <option value="">Select Duration</option>
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
                      onChange(formattedValue); // This will include the "+"
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
