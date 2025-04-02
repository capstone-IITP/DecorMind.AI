import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
    try {
        const { name, email, subject, message } = await req.json();

        if (!name || !email || !subject || !message) {
            return Response.json({ error: "All fields are required!" }, { status: 400 });
        }

        const data = await resend.emails.send({
            from: "DecorMind <support@yourdomain.com>", // Resend verified domain email
            to: "ai.decormind@gmail.com",  // Email to receive messages
            subject: subject,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage: ${message}`,
        });

        return Response.json({ success: "Message sent successfully!", data }, { status: 200 });
    } catch (error) {
        return Response.json({ error: "Something went wrong!" }, { status: 500 });
    }
}