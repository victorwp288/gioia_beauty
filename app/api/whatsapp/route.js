import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function POST(request) {
  try {
    const { number, name, time } = await request.json();

    if (!number || !name || !time) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

	//find time til appointment in minutes
	const now = new Date();
	const appointmentTime = new Date(time);
	const timeUntilAppointment = appointmentTime.getTime() - now.getTime();
	const minutesUntilAppointment = Math.floor(timeUntilAppointment / (60 * 1000));


    const message = await client.messages.create({
      from: "MGec1ec7d85883d27a8a009067f340cd5d",
      to: `whatsapp:${number}`,
      body: `Hello`,
      contentSid: "HXd4917d1b6eff98dfce235843a43f8335",
      contentVariables: JSON.stringify({
        1: name,
        2: minutesUntilAppointment,
      }),
    });



    return new Response(
      JSON.stringify({ success: true, messageSid: message.sid }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Twilio API Error:", error);
    console.error(JSON.stringify(error, null, 2)); // Log the full error object

    if (error.code === 63001) {
      return new Response(
        JSON.stringify({
          error: "User not opted in",
          details:
            "The recipient has not opted in to receive WhatsApp messages from this number.",
        }),
        { status: 400 }
      );
    } else if (error.code === 63003) {
      return new Response(
        JSON.stringify({
          error: "Message window expired",
          details:
            "The 24-hour window for free-form messaging has expired. Use a message template instead.",
        }),
        { status: 400 }
      );
    } else {
      return new Response(
        JSON.stringify({ error: error.message, details: error.toString() }),
        { status: 500 }
      );
    }
  }
}
