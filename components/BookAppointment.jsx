"use client";
import React, { useEffect, useState, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import { db } from "@/utils/firebase";

import appointmentTypes from "@/data/appointmentTypes.json";

import BookingConfirmation from "./BookingConfirmation";

const toasty = () => toast("Appointment Booked!");

const formSchema = z.object({
  date: z.date(),
  note: z.string().optional(),
  name: z.string(),
  number: z.string(),
  email: z.string().email(),
  timeSlot: z.string(),
  selectedDate: z.date(),
  appointmentType: z.string(),
  variant: z.string().optional(),
  duration: z.number(), // Ensure duration is included in the schema as a number
});

const BookAppointment = () => {
  const [timeSlot, setTimeSlot] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointmentType, setAppointmentType] = useState(appointmentTypes[0]);
  const [selectedVariant, setSelectedVariant] = useState(null);

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
      appointmentType: "",
      variant: "",
      duration: appointmentTypes[0].durations[0],
    },
  });

  const fetchTimeSlots = useCallback(
    async (date) => {
      if (!date) return;

      const formattedDate = date.toISOString().split("T")[0];
      const q = query(
        collection(db, "customers"),
        where("selectedDate", "==", formattedDate)
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => doc.data());

      const duration = selectedVariant
        ? parseInt(selectedVariant)
        : appointmentType.durations[0];

      const allTimeSlots = Array.from(
        { length: Math.floor(((17 - 8) * 60) / duration) },
        (_, i) => {
          const time = 8 * 60 + i * duration;
          const hours = Math.floor(time / 60);
          const minutes = time % 60;
          return `${hours < 10 ? "0" : ""}${hours}:${
            minutes < 10 ? "0" : ""
          }${minutes}`;
        }
      );
      const occupiedTimeSlots = data.map((item) => item.timeSlot);
      const availableTimeSlots = allTimeSlots.filter(
        (slot) => !occupiedTimeSlots.includes(slot)
      );

      setTimeSlot(availableTimeSlots);
      if (availableTimeSlots.length > 0) {
        const firstAvailableTimeSlot = availableTimeSlots[0];
        setSelectedTimeSlot(firstAvailableTimeSlot);
        form.setValue("timeSlot", firstAvailableTimeSlot);
      }
    },
    [appointmentType, selectedVariant, form]
  );

  useEffect(() => {
    fetchTimeSlots(selectedDate);
  }, [selectedDate, appointmentType, selectedVariant, fetchTimeSlots]);

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
      const [startHours, startMinutes] = startTime.split(":").map(Number);

      let endMinutes = startMinutes + duration;
      let endHours = startHours;

      if (endMinutes >= 60) {
        endHours += Math.floor(endMinutes / 60);
        endMinutes = endMinutes % 60;
      }

      const endTime = new Date(selectedDate);
      endTime.setHours(endHours, endMinutes, 0, 0);

      const formattedEndTime = `${endTime.getHours()}:${
        endTime.getMinutes() < 10 ? "0" : ""
      }${endTime.getMinutes()}`;

      const docRef = await addDoc(collection(db, "customers"), {
        ...data,
        startTime,
        endTime: formattedEndTime,
        duration, // Include duration in the data
        selectedDate: data.selectedDate.toISOString().split("T")[0],
        appointmentType: data.appointmentType,
        variant: selectedVariant,
        createdAt: new Date().toISOString(),
      });
      console.log("Appointment booked with ID:", docRef.id);
      openModal();
    } catch (error) {
      console.error("Error booking appointment:", error);
    }
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const isPastDay = (day) =>
    day <= new Date() || day.getDay() === 0 || day.getDay() === 6;

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
                  <FormLabel>Select Date</FormLabel>
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
                      className="w-full rounded-md border"
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
                    Select Time Slot
                  </FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-3 gap-2 rounded-lg border p-5">
                      {timeSlot.map((time, index) => (
                        <h2
                          key={index}
                          onClick={() => {
                            setSelectedTimeSlot(time);
                            field.onChange(time);
                          }}
                          className={`cursor-pointer rounded-full border p-2 text-center hover:bg-primary hover:text-white ${
                            time === selectedTimeSlot && "bg-primary text-white"
                          }`}
                        >
                          {time}
                        </h2>
                      ))}
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
                  <FormLabel>Appointment Type</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                    <FormLabel>Duration Variant</FormLabel>
                    <FormControl>
                      <select
                        className=" flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                        onChange={handleVariantChange}
                      >
                        <option value="">Select Duration</option>
                        {appointmentType.durations.map((duration, index) => (
                          <option key={index} value={duration}>
                            {duration} minutes
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Variant Selection */}
            {appointmentType.durations.length > 1 && (
              <FormField
                control={form.control}
                name="variant"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration Variant</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                        onChange={(e) => {
                          setSelectedVariant(e.target.value);
                          field.onChange(e);
                        }}
                      >
                        <option value="">Select Duration</option>
                        {appointmentType.durations.map((duration, index) => (
                          <option key={index} value={duration}>
                            {duration} minutes
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
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Phone Number */}
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-3" color="primary" type="submit">
              Book Appointment
            </Button>
          </div>
        </form>
        <BookingConfirmation isOpen={modalIsOpen} onRequestClose={closeModal} />
      </Form>
    </div>
  );
};

export default BookAppointment;
