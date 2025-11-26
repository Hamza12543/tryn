import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/mailer";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const to = searchParams.get("to") || process.env.ADMIN_EMAIL;

    if (!to) {
      return NextResponse.json({ error: "Missing 'to' query param and ADMIN_EMAIL env" }, { status: 400 });
    }

    await sendEmail({
      to,
      subject: "Test email from app",
      html: `<p>This is a test email sent at ${new Date().toISOString()}.</p>`,
    });

    return NextResponse.json({ ok: true, to });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const to = body.to || process.env.ADMIN_EMAIL;
    const subject = body.subject || "Test email from app";
    const html = body.html || `<p>This is a test email sent at ${new Date().toISOString()}.</p>`;

    if (!to) {
      return NextResponse.json({ error: "Missing 'to' in body and ADMIN_EMAIL env" }, { status: 400 });
    }

    await sendEmail({ to, subject, html });

    return NextResponse.json({ ok: true, to });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
