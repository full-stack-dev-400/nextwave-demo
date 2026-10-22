import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  service?: string;
  budget?: string;
  message?: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;

    const name = body.name?.trim();
    const email = body.email?.trim();
    const phone = body.phone?.trim();
    const company = body.company?.trim();
    const service = body.service?.trim();
    const budget = body.budget?.trim();
    const message = body.message?.trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, email and message are required.",
        },
        {
          status: 400,
        },
      );
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address.",
        },
        {
          status: 400,
        },
      );
    }

    const smtpHost = process.env.ZOHO_SMTP_HOST;
    const smtpPort = Number(
      process.env.ZOHO_SMTP_PORT ?? "465",
    );
    const smtpUser = process.env.ZOHO_SMTP_USER;
    const smtpPassword =
      process.env.ZOHO_SMTP_PASSWORD;
    const receiver =
      process.env.CONTACT_RECEIVER;

    if (
      !smtpHost ||
      !smtpUser ||
      !smtpPassword ||
      !receiver
    ) {
      console.error(
        "Missing SMTP environment variables.",
      );

      return NextResponse.json(
        {
          success: false,
          message: "Email service is not configured.",
        },
        {
          status: 500,
        },
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });

    await transporter.sendMail({
      from: `"BEZTEQ Website" <${smtpUser}>`,
      to: receiver,
      replyTo: email,
      subject: `New website enquiry — ${name}`,
      text: `
New enquiry received from bezteq.com

Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}
Company: ${company || "Not provided"}
Service: ${service || "Not specified"}
Budget: ${budget || "Not specified"}

Message:
${message}
      `.trim(),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #111;">
          <h2>New BEZTEQ website enquiry</h2>

          <table cellpadding="8" cellspacing="0" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td><strong>Name</strong></td>
              <td>${escapeHtml(name)}</td>
            </tr>

            <tr>
              <td><strong>Email</strong></td>
              <td>${escapeHtml(email)}</td>
            </tr>

            <tr>
              <td><strong>Phone</strong></td>
              <td>${phone ? escapeHtml(phone) : "Not provided"}</td>
            </tr>

            <tr>
              <td><strong>Company</strong></td>
              <td>${company ? escapeHtml(company) : "Not provided"}</td>
            </tr>

            <tr>
              <td><strong>Service</strong></td>
              <td>${service ? escapeHtml(service) : "Not specified"}</td>
            </tr>

            <tr>
              <td><strong>Budget</strong></td>
              <td>
                ${
                  budget
                    ? escapeHtml(budget)
                    : "Not specified"
                }
              </td>
            </tr>
          </table>

          <hr style="border: 0; border-top: 1px solid #ddd; margin: 24px 0;" />

          <h3>Message</h3>

          <p style="white-space: pre-wrap; line-height: 1.6;">
            ${escapeHtml(message)}
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Your enquiry has been sent successfully.",
    });
  } catch (error) {
    console.error("Contact form error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "We could not send your enquiry. Please try again.",
      },
      {
        status: 500,
      },
    );
  }
}