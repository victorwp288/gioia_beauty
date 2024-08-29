import { EmailTemplate } from "@/components/EmailTemplate";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { email, name, startTime, endTime, duration, date } =
      await request.json();

    console.log("Received data:", {
      email,
      name,
      startTime,
      endTime,
      duration,
      date,
    });

    // Send email to the customer
    const { data: customerData, error: customerError } =
      await resend.emails.send({
        from: "Gioia Beauty <noreply@gioiabeauty.net>",
        to: [email],
        subject: "Ricevuta di prenotazione",
        react: EmailTemplate({ name, startTime, endTime, duration, date }),
      });

    if (customerError) {
      console.error("Error sending email to customer:", customerError);
      return new Response(JSON.stringify({ error: customerError }), {
        status: 500,
      });
    }

    // Send email to the admin (yourself)
    const { data: adminData, error: adminError } = await resend.emails.send({
      from: "Gioia Beauty <noreply@gioiabeauty.net>",
      to: ["gioiabeautyy@gmail.com"],
      subject: "Nuova prenotazione",
      react: EmailTemplate({
        name,
        startTime,
        endTime,
        duration,
        date,
        isAdmin: true,
      }),
    });

    if (adminError) {
      console.error("Error sending email to admin:", adminError);
      return new Response(JSON.stringify({ error: adminError }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify({ customerData, adminData }), {
      status: 200,
    });
  } catch (error) {
    console.error("Catch error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
