/* Wysyłka formularza przez dodatkowe konto Gmail (SMTP + hasło aplikacji).
   Zmienne środowiskowe w Vercel: GMAIL_USER, GMAIL_APP_PASSWORD, CONTACT_TO. */

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { formLimits } from '@/lib/config';

export const runtime = 'nodejs';

/* Granica zaufania. `maxLength` i `type="email"` w przeglądarce to wygoda dla
   użytkownika — żądanie da się wysłać z pominięciem formularza, więc te same
   progi muszą obowiązywać tutaj. Bez tego w skrzynce ląduje, co kto chce. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function bledy(p: { imie: string; email: string; telefon: string; wiadomosc: string }) {
  const e: string[] = [];
  if (p.imie.length < formLimits.imie.min || p.imie.length > formLimits.imie.max) e.push('imie');
  if (p.email.length > formLimits.email.max || !EMAIL.test(p.email)) e.push('email');
  if (p.telefon.length > formLimits.telefon.max) e.push('telefon');
  if (
    p.wiadomosc.length < formLimits.wiadomosc.min ||
    p.wiadomosc.length > formLimits.wiadomosc.max
  )
    e.push('wiadomosc');
  return e;
}

export async function POST(req: Request) {
  const { GMAIL_USER, GMAIL_APP_PASSWORD, CONTACT_TO } = process.env;

  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    return NextResponse.json({ error: 'mail-not-configured' }, { status: 500 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'bad-request' }, { status: 400 });
  }

  const pole = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
  const dane = {
    imie: pole((body as Record<string, unknown>).imie),
    email: pole((body as Record<string, unknown>).email),
    telefon: pole((body as Record<string, unknown>).telefon),
    wiadomosc: pole((body as Record<string, unknown>).wiadomosc),
  };

  // honeypot — bot wypełnia ukryte pole; udajemy sukces
  if (pole((body as Record<string, unknown>).firma)) return NextResponse.json({ ok: true });

  const niepoprawne = bledy(dane);
  if (niepoprawne.length) {
    return NextResponse.json({ error: 'invalid-fields', pola: niepoprawne }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
  });

  await transporter.sendMail({
    from: `Strona Aleksandra Gosk <${GMAIL_USER}>`,
    to: CONTACT_TO || GMAIL_USER,
    // temat składa się z danych od użytkownika — nowa linia pozwoliłaby dopisać
    // własne nagłówki, więc łamania linii nie przepuszczamy
    replyTo: dane.email.replace(/[\r\n]/g, ''),
    subject: `Zapytanie ze strony — ${dane.imie.replace(/[\r\n]/g, ' ')}`,
    text: [
      `Imię i nazwisko: ${dane.imie}`,
      `E-mail: ${dane.email}`,
      `Telefon: ${dane.telefon || '—'}`,
      '',
      dane.wiadomosc,
    ].join('\n'),
  });

  return NextResponse.json({ ok: true });
}
