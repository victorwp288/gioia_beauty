import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const REMINDER_ADVANCE_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

export async function POST(request) {
  try {
    const { number, startTime, name, selectedDate } = await request.json();

    if (!number || !startTime || !name || !selectedDate) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    const now = new Date();
    const appointmentDate = new Date(selectedDate);
    const timeUntilAppointment = appointmentDate.getTime() - now.getTime();

    let reminderTime = new Date(
      appointmentDate.getTime() - REMINDER_ADVANCE_TIME
    );
    let reminderMessage = `Hello ${name}, this is a reminder for your appointment in 1 hour. We look forward to seeing you!`;

    // If the appointment is less than 1 hour away, send the reminder immediately
    if (timeUntilAppointment < REMINDER_ADVANCE_TIME) {
      reminderTime = now;
      const minutesUntilAppointment = Math.max(
        Math.floor(timeUntilAppointment / (60 * 1000)),
        0
      );
      reminderMessage = `Hello ${name}, this is a reminder for your appointment in ${minutesUntilAppointment} minutes. We look forward to seeing you!`;
    }

    const messageOptions = {
      body: reminderMessage,
      to: number,
      from: process.env.TWILIO_PHONE_NUMBER,
    };

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
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function GET() {
  return new Response(JSON.stringify({ message: "Method not allowed" }), {
    status: 405,
  });
}
