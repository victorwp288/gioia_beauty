import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const REMINDER_ADVANCE_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

export async function POST(request) {
  try {
    const { number, startTime, name, selectedDate } = await request.json();

    console.log("Received data:", { number, startTime, name, selectedDate });

    if (!number || !startTime || !name || !selectedDate) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    const now = new Date();
    console.log("Current time:", now.toISOString());

    // Parse the date and time
    const [day, month, year] = selectedDate.split("/").map(Number);
    const [hours, minutes] = startTime.split(":").map(Number);

    // Create the appointment date (note: month is 0-indexed in JavaScript Date)
    const appointmentDate = new Date(year, month - 1, day, hours, minutes);

    console.log("Parsed appointment time:", appointmentDate.toISOString());

    // Ensure the appointment is in the future
    if (isNaN(appointmentDate.getTime()) || appointmentDate <= now) {
      return new Response(
        JSON.stringify({ error: "Invalid or past appointment time" }),
        { status: 400 }
      );
    }

    const timeUntilAppointment = appointmentDate.getTime() - now.getTime();
    const minutesUntilAppointment = Math.floor(
      timeUntilAppointment / (60 * 1000)
    );

    console.log("Minutes until appointment:", minutesUntilAppointment);

    let reminderTime = new Date(
      appointmentDate.getTime() - REMINDER_ADVANCE_TIME
    );
    let reminderMessage;

    if (minutesUntilAppointment > 60) {
      const hours = Math.floor(minutesUntilAppointment / 60);
      const minutes = minutesUntilAppointment % 60;
      reminderMessage = `Hello ${name}, this is a reminder for your appointment in ${hours} hour${
        hours > 1 ? "s" : ""
      } and ${minutes} minute${
        minutes !== 1 ? "s" : ""
      }. We look forward to seeing you!`;
    } else if (minutesUntilAppointment > 0) {
      reminderMessage = `Hello ${name}, this is a reminder for your appointment in ${minutesUntilAppointment} minute${
        minutesUntilAppointment !== 1 ? "s" : ""
      }. We look forward to seeing you!`;
    } else {
      reminderMessage = `Hello ${name}, this is a reminder for your appointment which is starting now. We look forward to seeing you!`;
    }

    console.log("Reminder message:", reminderMessage);

    const whatsappLink = `whatsapp:${number}`;

    const messageOptions = {
      body: reminderMessage,
      to: whatsappLink,
      from: process.env.TWILIO_PAID_NUMBER,
    };

    // Add this condition for WhatsApp messages
    if (whatsappLink.startsWith("whatsapp:")) {
      messageOptions.from = `whatsapp:${process.env.TWILIO_PAID_NUMBER}`;
    }

    // If the reminder time is in the future, schedule it
    if (reminderTime > now) {
      messageOptions.sendAt = reminderTime.toISOString();
      messageOptions.scheduleType = "fixed";
    }

    const message = await client.messages.create(messageOptions);

    return new Response(
      JSON.stringify({ success: true, messageSid: message.sid }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Twilio API Error:", error);
    return new Response(
      JSON.stringify({ error: error.message, details: error.toString() }),
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  return new Response(JSON.stringify({ message: "Method not allowed" }), {
    status: 405,
  });
}
