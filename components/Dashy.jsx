import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
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
import { Calendar } from "@/components/ui/calendar";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { AppointmentCalendar } from "./AppointmentCalendar";

export function Dashy() {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    const querySnapshot = await getDocs(collection(db, "customers"));
    let appointmentsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    appointmentsData = appointmentsData.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

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
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, "customers", appointment.id));

      // Prepare email data
      const emailData = {
        email: appointment.email,
        name: appointment.name,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        duration: appointment.duration,
        date: formatDate(new Date(appointment.selectedDate)),
      };

      // Send cancellation email
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

      // Update local state
      setAppointments(appointments.filter((a) => a.id !== appointment.id));

      toast.success("Appointment cancelled and email sent");
    } catch (error) {
      console.error("Error cancelling appointment or sending email: ", error);
      toast.error("Failed to cancel appointment. Please try again.");
    }
  };

  return (
    <div className="w-full h-full">
      <div className="grid gap-6 p-6 sm:p-10">
        <Card>
          <CardHeader>
            <CardTitle>Gli appuntamenti di oggi</CardTitle>
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
                {appointments.map((appointment) => (
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
        <AppointmentCalendar appointments={appointments} />
      </div>
    </div>
  );
}
