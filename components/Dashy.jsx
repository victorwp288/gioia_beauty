// components/Dashy.jsx

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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false); // Track edit mode
  const [appointmentToEdit, setAppointmentToEdit] = useState(null); // Track the appointment being edited

  const [isVacationModalOpen, setIsVacationModalOpen] = useState(false);
  const [vacationStartDate, setVacationStartDate] = useState(null);
  const [vacationEndDate, setVacationEndDate] = useState(null);

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
  }, [isAddModalOpen, isEditMode]);

  const fetchAppointments = async () => {
    try {
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
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to fetch appointments. Please try again.");
    }
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
      const selectedType = appointmentTypes.find(
        (type) => type.type === newAppointment.appointmentType
      );

      if (!selectedType) {
        toast.error("Please select a valid appointment type.");
        return;
      }

      const extraTime = selectedType.extraTime[0];

      const [startHours, startMinutes] = startTime.split(":").map(Number);

      let totalMinutes = startHours * 60 + startMinutes + duration + extraTime;
      let endHours = Math.floor(totalMinutes / 60) % 24;
      let endMinutes = totalMinutes % 60;

      const endTime = `${String(endHours).padStart(2, "0")}:${String(
        endMinutes
      ).padStart(2, "0")}`;

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

  const handleSetVacationPeriod = async () => {
    if (!vacationStartDate || !vacationEndDate) {
      toast.error("Please select both start and end dates.");
      return;
    }

    const startDate = new Date(vacationStartDate);
    const endDate = new Date(vacationEndDate);

    if (endDate < startDate) {
      toast.error("End date must be after start date.");
      return;
    }

    try {
      await addDoc(collection(db, "vacations"), {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        createdAt: new Date().toISOString(),
      });
      toast.success("Vacation period set successfully.");
      setIsVacationModalOpen(false);
    } catch (error) {
      console.error("Error setting vacation period:", error);
      toast.error("Failed to set vacation period. Please try again.");
    }
  };

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Vacation Period Button and Dialog */}
      <div className="mb-6">
        <Button
          onClick={() => {
            setIsVacationModalOpen(true);
            setVacationStartDate(null);
            setVacationEndDate(null);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Imposta break
        </Button>
        <Dialog
          open={isVacationModalOpen}
          onOpenChange={setIsVacationModalOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Imposta break</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vacationStartDate" className="text-right">
                  Start Date
                </Label>
                <Input
                  id="vacationStartDate"
                  name="vacationStartDate"
                  type="date"
                  value={vacationStartDate || ""}
                  onChange={(e) => setVacationStartDate(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vacationEndDate" className="text-right">
                  End Date
                </Label>
                <Input
                  id="vacationEndDate"
                  name="vacationEndDate"
                  type="date"
                  value={vacationEndDate || ""}
                  onChange={(e) => setVacationEndDate(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsVacationModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSetVacationPeriod}>Set Vacation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-6 p-1 ">
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
                    <TableCell>{appointment.duration} minuti</TableCell>
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
      </div>

      {/* Appointment Calendar */}
      <div className="mb-6">
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome del cliente
              </Label>
              <Input
                id="name"
                name="name"
                value={newAppointment.name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                value={newAppointment.email}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="number" className="text-right">
                Numero di telefono
              </Label>
              <div className="col-span-3">
                <PhoneInput
                  country={"it"}
                  value={newAppointment.number}
                  onChange={handlePhoneChange}
                  inputStyle={{
                    height: "2.5rem",
                    width: "100%",
                    borderRadius: "0.375rem",
                    borderColor: "#e2e8f1",
                    backgroundColor: "#ffffff",
                    paddingLeft: "3rem",
                    paddingRight: "0.75rem",
                    fontSize: "0.875rem",
                  }}
                  buttonStyle={{
                    height: "2.5rem",
                    borderColor: "#e2e8f1",
                    backgroundColor: "#ffffff",
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="appointmentType" className="text-right">
                Tipo di appuntamento
              </Label>
              <Select
                value={newAppointment.appointmentType}
                onValueChange={handleAppointmentTypeChange}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select appointment type" />
                </SelectTrigger>
                <SelectContent>
                  {appointmentTypes.map((type) => (
                    <SelectItem key={type.id} value={type.type}>
                      {type.type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startTime" className="text-right">
                Inizio appuntamento
              </Label>
              <Input
                id="startTime"
                name="startTime"
                type="time"
                value={newAppointment.startTime}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endTime" className="text-right">
                Fine appuntamento
              </Label>
              <Input
                id="endTime"
                name="endTime"
                type="time"
                value={newAppointment.endTime}
                onChange={handleInputChange}
                className="col-span-3"
                readOnly // Make endTime read-only since it's calculated
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Durata (min)
              </Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                value={newAppointment.duration}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="selectedDate" className="text-right">
                Data
              </Label>
              <Input
                id="selectedDate"
                name="selectedDate"
                type="date"
                value={newAppointment.selectedDate}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="note" className="text-right">
                Note
              </Label>
              <Input
                id="note"
                name="note"
                value={newAppointment.note}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddOrEditAppointment}>
              {isEditMode ? "Salva modifiche" : "Aggiungi appuntamento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conferma cancellazione</DialogTitle>
          </DialogHeader>
          <p>
            Sei sicuro di voler cancellare l&apos;appuntamento di{" "}
            <strong>{appointmentToDelete?.name}</strong>?
          </p>
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
    </div>
  );
}
