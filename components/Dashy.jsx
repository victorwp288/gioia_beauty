"use client";
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
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
import { X, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { AppointmentCalendar } from "./AppointmentCalendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Dashy() {
  const [appointments, setAppointments] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
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

  useEffect(() => {
    fetchAppointments();
  }, []);

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const deleteAppointment = async (appointment) => {
    // ... (keep existing deleteAppointment logic)
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAppointment = async () => {
    // ... (keep existing handleAddAppointment logic)
  };

  const filteredAppointments = appointments.filter(
    (appointment) =>
      new Date(appointment.selectedDate).toDateString() ===
      selectedDate.toDateString()
  );

  return (
    <div className="w-full">
      <div className="flex flex-col gap-6 p-1 lg:p-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Appointments for {formatDate(selectedDate)}</CardTitle>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Appointment
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Appointment</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Delete</TableHead>
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
                        onClick={() => deleteAppointment(appointment)}
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

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Appointment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Clients name
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
                Clients email
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
                Clients phone number
              </Label>
              <Input
                id="number"
                name="number"
                value={newAppointment.number}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="appointmentType" className="text-right">
                Appointment type
              </Label>
              <Input
                id="appointmentType"
                name="appointmentType"
                value={newAppointment.appointmentType}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startTime" className="text-right">
                Start Time
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
                End Time
              </Label>
              <Input
                id="endTime"
                name="endTime"
                type="time"
                value={newAppointment.endTime}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Duration (min)
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
                Date
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
          <Button onClick={handleAddAppointment}>Add Appointment</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
