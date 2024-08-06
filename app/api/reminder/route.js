import { NextResponse } from "next/server";
import { db } from "@/utils/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function GET() {
  try {
    const now = new Date();
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    console.log("Current time:", now.toISOString());
    console.log("Two hours from now:", twoHoursFromNow.toISOString());

    // Get today's date in YYYY-MM-DD format
    const todayDate = now.toISOString().split("T")[0];

    const appointmentsRef = collection(db, "customers");

    // Query for appointments with today's date
    const q = query(
      appointmentsRef,
      where("selectedDate", ">=", todayDate),
      where("selectedDate", "<", todayDate + "T23:59:59")
    );

    const querySnapshot = await getDocs(q);

    console.log("Number of documents returned:", querySnapshot.size);

    const upcomingAppointments = [];
    const messageResults = [];

    for (const doc of querySnapshot.docs) {
      console.log("Processing appointment:", doc.id);
      const appointmentData = doc.data();
      console.log(
        "Appointment data:",
        JSON.stringify(appointmentData, null, 2)
      );

      const appointmentDate = new Date(appointmentData.selectedDate);
      const [hours, minutes] = appointmentData.startTime.split(":").map(Number);
      appointmentDate.setHours(hours, minutes, 0, 0);

      const timeUntilAppointment = appointmentDate.getTime() - now.getTime();
      const minutesUntilAppointment = Math.floor(
        timeUntilAppointment / (60 * 1000)
      );

      console.log("Parsed appointment date:", appointmentDate.toISOString());
      console.log("Minutes until appointment:", minutesUntilAppointment);

      // Include appointments happening within the next 2 hours
      if (minutesUntilAppointment > 0 && minutesUntilAppointment <= 120) {
        upcomingAppointments.push({
          id: doc.id,
          name: appointmentData.name,
          number: appointmentData.number,
          startTime: appointmentData.startTime,
          appointmentType: appointmentData.appointmentType,
          date: appointmentDate.toISOString(),
          minutesUntilAppointment,
        });

        // Prepare content variables for WhatsApp message
        const contentVariables = JSON.stringify({
          1: appointmentData.name,
          2: minutesUntilAppointment.toString(),
        });

        console.log("contentVariables", contentVariables);

        try {
          const message = await client.messages.create({
            from: "MGec1ec7d85883d27a8a009067f340cd5d",
            to: `whatsapp:${appointmentData.number}`,
            contentSid: "HXd4917d1b6eff98dfce235843a43f8335",
            contentVariables: contentVariables,
          });

          messageResults.push({
            appointmentId: doc.id,
            messageSid: message.sid,
            status: "sent",
          });
        } catch (error) {
          console.error(
            `Error sending WhatsApp message for appointment ${doc.id}:`,
            error
          );
          messageResults.push({
            appointmentId: doc.id,
            error: error.message,
            status: "failed",
          });
        }
      } else {
        console.log("Appointment not within the next 2 hours");
      }
    }

    return NextResponse.json({
      appointments: upcomingAppointments,
      messageResults: messageResults,
    });
  } catch (error) {
    console.error("Error processing upcoming appointments:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.toString() },
      { status: 500 }
    );
  }
}
