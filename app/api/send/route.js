// app/api/send/route.js
import { EmailTemplate } from "@/components/EmailTemplate";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { email, name, startTime, endTime, duration } = await request.json();

    const { data, error } = await resend.emails.send({
      from: "Gioia Beauty <noreply@gioiabeauty.net>",
      to: [email],
      subject: "Booking Confirmed! 🎉",
      react: EmailTemplate({ name, startTime, endTime, duration }),
    });

    if (error) {
      console.error("Error sending email:", error);
      return new Response(JSON.stringify({ error }), { status: 500 });
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("Catch error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
