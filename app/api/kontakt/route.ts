/* Wysyłka formularza przez dodatkowe konto Gmail (SMTP + hasło aplikacji).
   Zmienne środowiskowe w Vercel: GMAIL_USER, GMAIL_APP_PASSWORD, CONTACT_TO. */

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const { GMAIL_USER, GMAIL_APP_PASSWORD, CONTACT_TO } = process.env;

  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    return NextResponse.json({ error: 'mail-not-configured' }, { status: 500 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'bad-request' }, { status: 400 });

  const { imie, email, telefon, wiadomosc, firma } = body as Record<string, string>;

  // honeypot — bot wypełnia ukryte pole; udajemy sukces
  if (firma) return NextResponse.json({ ok: true });

  if (!imie?.trim() || !email?.trim() || !wiadomosc?.trim()) {
    return NextResponse.json({ error: 'missing-fields' }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
  });

  await transporter.sendMail({
    from: `Strona Aleksandra Gosk <${GMAIL_USER}>`,
    to: CONTACT_TO || GMAIL_USER,
    replyTo: email,
    subject: `Zapytanie ze strony — ${imie}`,
    text: [
      `Imię i nazwisko: ${imie}`,
      `E-mail: ${email}`,
      `Telefon: ${telefon || '—'}`,
      '',
      wiadomosc,
    ].join('\n'),
  });

  return NextResponse.json({ ok: true });
}
