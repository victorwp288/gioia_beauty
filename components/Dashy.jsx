"use client";
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/utils/firebase";
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import { X, Plus, Edit } from "lucide-react"; // Import Edit icon
import { toast } from "react-toastify";
import { AppointmentCalendar } from "./AppointmentCalendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import appointmentTypes from "@/data/appointmentTypes.json";

export function Dashy() {
  const [appointments, setAppointments] = useState([]);
  const [newsletterSubscribers, setNewsletterSubscribers] = useState([]); // State for subscribers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteSubscriberModalOpen, setIsDeleteSubscriberModalOpen] =
    useState(false); // State for subscriber delete modal
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [subscriberToDelete, setSubscriberToDelete] = useState(null); // State for subscriber to delete
  const [isEditMode, setIsEditMode] = useState(false); // Track edit mode
  const [appointmentToEdit, setAppointmentToEdit] = useState(null); // Track the appointment being edited

  const [newAppointment, setNewAppointment] = useState({
    name: "",
    email: "",
    number: "",
    appointmentType: "",
    startTime: "",
    endTime: "",
    duration: "",
    selectedDate: "",
    note: "",
  });

  useEffect(() => {
    fetchAppointments();
    fetchNewsletterSubscribers(); // Fetch subscribers on component mount
    if (isAddModalOpen && !isEditMode) {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
      const formattedDate = now.toISOString().split("T")[0]; // YYYY-MM-DD format

      setNewAppointment((prev) => ({
        ...prev,
        startTime: currentTime,
        selectedDate: formattedDate,
      }));
    }
  }, [isAddModalOpen]);

  const fetchAppointments = async () => {
    const querySnapshot = await getDocs(collection(db, "customers"));
    let appointmentsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    appointmentsData = appointmentsData.sort((a, b) => {
      const dateA = new Date(a.selectedDate);
      const dateB = new Date(b.selectedDate);

      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;

      const timeA = a.startTime.split(":").map(Number);
      const timeB = b.startTime.split(":").map(Number);

      if (timeA[0] < timeB[0]) return -1;
      if (timeA[0] > timeB[0]) return 1;
      if (timeA[1] < timeB[1]) return -1;
      if (timeA[1] > timeB[1]) return 1;

      return 0;
    });

    setAppointments(appointmentsData);
  };

  const fetchNewsletterSubscribers = async () => {
    const querySnapshot = await getDocs(
      collection(db, "newsletter_subscribers")
    );
    const subscribersData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setNewsletterSubscribers(subscribersData);
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment((prev) => ({ ...prev, [name]: value }));

    if (name === "startTime" || name === "duration") {
      const endTime = calculateEndTime(
        name === "startTime" ? value : newAppointment.startTime,
        name === "duration" ? value : newAppointment.duration
      );
      setNewAppointment((prev) => ({ ...prev, endTime }));
    }
  };

  const handleAppointmentTypeChange = (value) => {
    const selectedType = appointmentTypes.find((type) => type.type === value);
    const duration = selectedType ? selectedType.durations[0] : "";
    const startTime = newAppointment.startTime;
    const endTime = calculateEndTime(startTime, duration);

    setNewAppointment((prev) => ({
      ...prev,
      appointmentType: value,
      duration: duration,
      endTime: endTime,
    }));
  };

  const calculateEndTime = (startTime, durationMinutes) => {
    if (!startTime || !durationMinutes) return "";

    const [hours, minutes] = startTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + Number(durationMinutes);
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;

    return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(
      2,
      "0"
    )}`;
  };

  const handlePhoneChange = (value, country, e, formattedValue) => {
    setNewAppointment((prev) => ({ ...prev, number: formattedValue }));
  };

  const filteredAppointments = appointments.filter(
    (appointment) =>
      new Date(appointment.selectedDate).toDateString() ===
      selectedDate.toDateString()
  );

  const handleDeleteClick = (appointment) => {
    setAppointmentToDelete(appointment);
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (appointment) => {
    setAppointmentToEdit(appointment);
    setNewAppointment(appointment); // Populate form with existing appointment data
    setIsEditMode(true); // Set to edit mode
    setIsAddModalOpen(true); // Open the modal
  };

  const handleConfirmDelete = async () => {
    if (appointmentToDelete) {
      try {
        await deleteDoc(doc(db, "customers", appointmentToDelete.id));
        const emailData = {
          email: appointmentToDelete.email,
          name: appointmentToDelete.name,
          startTime: appointmentToDelete.startTime,
          endTime: appointmentToDelete.endTime,
          duration: appointmentToDelete.duration,
          date: formatDate(new Date(appointmentToDelete.selectedDate)),
        };
        const emailResponse = await fetch("/api/cancel", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(emailData),
        });
        if (!emailResponse.ok) {
          throw new Error("Failed to send cancellation email");
        }
        setAppointments(
          appointments.filter((a) => a.id !== appointmentToDelete.id)
        );
        toast.success("Appointment cancelled and email sent");
      } catch (error) {
        console.error("Error cancelling appointment or sending email: ", error);
        toast.error("Failed to cancel appointment. Please try again.");
      }
    }
    setIsDeleteModalOpen(false);
    setAppointmentToDelete(null);
  };

  const handleAddOrEditAppointment = async () => {
    try {
      const startTime = newAppointment.startTime;
      const duration = parseInt(newAppointment.duration, 10);
      const extraTime = appointmentTypes.find(
        (type) => type.type === newAppointment.appointmentType
      ).extraTime[0];

      const [startHours, startMinutes] = startTime.split(":").map(Number);

      let totalMinutes = startHours * 60 + startMinutes + duration + extraTime;
      let endHours = Math.floor(totalMinutes / 60) % 24;
      let endMinutes = totalMinutes % 60;

      const endTime = `${endHours.toString().padStart(2, "0")}:${endMinutes
        .toString()
        .padStart(2, "0")}`;

      const appointmentData = {
        ...newAppointment,
        endTime,
        totalDuration: duration + extraTime,
        createdAt: new Date().toISOString(),
      };

      if (isEditMode && appointmentToEdit) {
        await updateDoc(
          doc(db, "customers", appointmentToEdit.id),
          appointmentData
        );
        toast.success("Appointment updated successfully");
      } else {
        const docRef = await addDoc(
          collection(db, "customers"),
          appointmentData
        );
        console.log("Appointment added with ID:", docRef.id);
        toast.success("Appointment added successfully");
      }

      setIsAddModalOpen(false);
      setIsEditMode(false);
      setAppointmentToEdit(null);
      await fetchAppointments();
    } catch (error) {
      console.error("Error adding/editing appointment:", error);
      toast.error("Failed to add/edit appointment. Please try again.");
    }
  };

  const handleDeleteSubscriber = (subscriber) => {
    setSubscriberToDelete(subscriber);
    setIsDeleteSubscriberModalOpen(true);
  };

  const handleConfirmDeleteSubscriber = async () => {
    if (subscriberToDelete) {
      try {
        await deleteDoc(
          doc(db, "newsletter_subscribers", subscriberToDelete.id)
        );
        setNewsletterSubscribers(
          newsletterSubscribers.filter((s) => s.id !== subscriberToDelete.id)
        );
        toast.success("Subscriber deleted successfully");
      } catch (error) {
        console.error("Error deleting subscriber:", error);
        toast.error("Failed to delete subscriber. Please try again.");
      }
    }
    setIsDeleteSubscriberModalOpen(false);
    setSubscriberToDelete(null);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-6 p-1 lg:p-6">
        {/* Appointments Card */}
        <Card>
          <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle>
              Gli appuntamenti di oggi - {formatDate(selectedDate)}
            </CardTitle>
            <Button
              onClick={() => {
                setIsAddModalOpen(true);
                setIsEditMode(false); // Ensure not in edit mode
                setNewAppointment({
                  name: "",
                  email: "",
                  number: "",
                  appointmentType: "",
                  startTime: "",
                  endTime: "",
                  duration: "",
                  selectedDate: "",
                  note: "",
                });
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Aggiungi appuntamento
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Appuntamento</TableHead>
                  <TableHead>Inizio</TableHead>
                  <TableHead>Fine</TableHead>
                  <TableHead>Durata</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Contatto</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead>Cancella</TableHead>
                  <TableHead>Edita</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>{appointment.appointmentType}</TableCell>
                    <TableCell>{appointment.startTime}</TableCell>
                    <TableCell>{appointment.endTime}</TableCell>
                    <TableCell>{appointment.duration} minutes</TableCell>
                    <TableCell>
                      <div className="font-medium">{appointment.name}</div>
                      <div className="text-gray-500 dark:text-gray-400 text-sm">
                        {appointment.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-gray-500 dark:text-gray-400 text-sm">
                        {appointment.number}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-gray-500 dark:text-gray-400 text-sm">
                        {appointment.note}
                      </div>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleDeleteClick(appointment)}
                        className="p-2 hover:bg-red-100 rounded-full"
                      >
                        <X size={20} className="text-red-500" />
                      </button>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleEditClick(appointment)}
                        className="p-2 hover:bg-blue-100 rounded-full"
                      >
                        <Edit size={20} className="text-blue-500" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Newsletter Subscribers Card */}
        <Card>
          <CardHeader>
            <CardTitle>Newsletter Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Cancella</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newsletterSubscribers.map((subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell>{subscriber.email}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleDeleteSubscriber(subscriber)}
                        className="p-2 hover:bg-red-100 rounded-full"
                      >
                        <X size={20} className="text-red-500" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <AppointmentCalendar
          appointments={appointments}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>

      {/* Add/Edit Appointment Dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditMode
                ? "Edita appuntamento"
                : "Aggiungi nuovo appuntamento"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* All input fields are the same */}
            {/* ... existing input fields ... */}
          </div>
          <DialogFooter>
            <Button onClick={handleAddOrEditAppointment}>
              {isEditMode ? "Salva modifiche" : "Aggiungi appuntamento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Appointment Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conferma cancellazione</DialogTitle>
          </DialogHeader>
          <p>Sei sicuro di voler cancellare l&apos;appuntamento?</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Annulla
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Cancella appuntamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Subscriber Dialog */}
      <Dialog
        open={isDeleteSubscriberModalOpen}
        onOpenChange={setIsDeleteSubscriberModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conferma cancellazione</DialogTitle>
          </DialogHeader>
          <p>Sei sicuro di voler cancellare questo iscritto alla newsletter?</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteSubscriberModalOpen(false)}
            >
              Annulla
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDeleteSubscriber}
            >
              Cancella iscritto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
