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

    const appointmentsRef = collection(db, "customers");
    const q = query(
      appointmentsRef,
      where("selectedDate", "==", now.toISOString().split("T")[0]),
      where("startTime", ">=", now.toTimeString().slice(0, 5)),
      where("startTime", "<=", twoHoursFromNow.toTimeString().slice(0, 5))
    );

    const querySnapshot = await getDocs(q);
    const upcomingAppointments = [];
    const messageResults = [];

    for (const doc of querySnapshot.docs) {
      const appointmentData = doc.data();
      const appointmentTime = new Date(
        `${appointmentData.selectedDate}T${appointmentData.startTime}`
      );
      const timeUntilAppointment = appointmentTime.getTime() - now.getTime();
      const minutesUntilAppointment = Math.floor(
        timeUntilAppointment / (60 * 1000)
      );

      upcomingAppointments.push({
        id: doc.id,
        name: appointmentData.name,
        number: appointmentData.number,
        startTime: appointmentData.startTime,
        appointmentType: appointmentData.appointmentType,
        date: appointmentData.selectedDate,
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
    }

    return NextResponse.json({
      appointments: upcomingAppointments,
      messageResults: messageResults,
    });
  } catch (error) {
    console.error("Error processing upcoming appointments:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
