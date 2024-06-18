import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
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

export function Dashy() {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    const querySnapshot = await getDocs(collection(db, "customers"));
    let appointmentsData = querySnapshot.docs.map((doc) => doc.data());

    // Sort appointments by createdAt in descending order
    appointmentsData = appointmentsData.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    setAppointments(appointmentsData);
  };
  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="w-full h-full">
      <div className="grid gap-6 p-6 sm:p-10">
        <Card>
          <CardHeader>
            <CardTitle>Todays Appointments</CardTitle>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment, index) => (
                  <TableRow key={index}>
                    <TableCell>{appointment.appointmentType}</TableCell>
                    <TableCell>{appointment.startTime}</TableCell>
                    <TableCell>{appointment.endTime}</TableCell>
                    <TableCell>{appointment.duration}</TableCell>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Calendar View</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              className="w-full [&_td]:w-16 [&_td]:h-16 [&_th]:w-16 [&_[name=day]]:w-16 [&_[name=day]]:h-16 [&>div]:space-x-0 [&>div]:gap-6"
              mode="single"
              numberOfMonths={1}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
