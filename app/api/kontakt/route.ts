/* Wysyłka formularza przez dodatkowe konto Gmail (SMTP + hasło aplikacji).
   Zmienne środowiskowe w Vercel:
   - GMAIL_USER, GMAIL_APP_PASSWORD, CONTACT_TO: poczta (wymagane),
   - TURNSTILE_SECRET_KEY + NEXT_PUBLIC_TURNSTILE_SITE_KEY: Cloudflare Turnstile
     (opcjonalne; bez nich weryfikacja jest pomijana). */

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { formLimits } from '@/lib/config';

export const runtime = 'nodejs';

/* Granica zaufania. `maxLength` i `type="email"` w przeglądarce to wygoda dla
   użytkownika: żądanie da się wysłać z pominięciem formularza, więc te same
   progi muszą obowiązywać tutaj. Bez tego w skrzynce ląduje, co kto chce. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* Antyspam, warstwy od najtańszej:
   1. honeypot: ukryte pole „firma” wypełnia tylko bot,
   2. pułapka czasowa: człowiek nie wypełni formularza w mniej niż 3 s; brak
      pomiaru oznacza żądanie wysłane z pominięciem strony,
   3. filtr treści: za dużo linków albo typowe frazy spamu,
   4. Cloudflare Turnstile, gdy są klucze.
   Boty (1, 2, frazy) dostają udawany sukces, żeby nie uczyły się omijać filtra.
   Za dużo linków zgłaszamy wprost, bo to może być człowiek. */
const MIN_CZAS_MS = 3000;
const MAX_LINKOW = 2;
const LINK = /https?:\/\/|www\./i;
const LINKI = /https?:\/\/|www\./gi;
/* ponytail: krótka lista fraz; rozszerzyć, gdy w skrzynce zacznie przechodzić konkretny spam */
const SPAM = /\b(seo services?|backlinks?|crypto|bitcoin|casino|viagra|cialis|forex|loan offer|guest post)\b/i;

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

async function turnstileOk(token: string, ip: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // Turnstile nieskonfigurowany: pomijamy tę warstwę
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
    });
    const json = (await res.json()) as { success?: boolean };
    return json.success === true;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'bad-request' }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const pole = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
  const dane = {
    imie: pole(b.imie),
    email: pole(b.email),
    telefon: pole(b.telefon),
    wiadomosc: pole(b.wiadomosc),
  };
  const udajSukces = () => NextResponse.json({ ok: true });

  // 1. honeypot
  if (pole(b.firma)) return udajSukces();

  // 2. pułapka czasowa
  const czas = typeof b.czas === 'number' ? b.czas : -1;
  if (czas < MIN_CZAS_MS) return udajSukces();

  const niepoprawne = bledy(dane);
  if (niepoprawne.length) {
    return NextResponse.json({ error: 'invalid-fields', pola: niepoprawne }, { status: 400 });
  }

  // 3. filtr treści
  const tekst = `${dane.imie}\n${dane.wiadomosc}`;
  if (SPAM.test(tekst) || LINK.test(dane.imie)) return udajSukces();
  if ((dane.wiadomosc.match(LINKI) ?? []).length > MAX_LINKOW) {
    return NextResponse.json({ error: 'too-many-links' }, { status: 400 });
  }

  // 4. Turnstile
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;
  if (!(await turnstileOk(pole(b.turnstile), ip))) {
    return NextResponse.json({ error: 'captcha' }, { status: 403 });
  }

  const { GMAIL_USER, GMAIL_APP_PASSWORD, CONTACT_TO } = process.env;
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    return NextResponse.json({ error: 'mail-not-configured' }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
  });

  try {
    await transporter.sendMail({
      from: `Strona Aleksandra Niewińska <${GMAIL_USER}>`,
      to: CONTACT_TO || GMAIL_USER,
      // temat składa się z danych od użytkownika: nowa linia pozwoliłaby dopisać
      // własne nagłówki, więc łamania linii nie przepuszczamy
      replyTo: dane.email.replace(/[\r\n]/g, ''),
      subject: `Zapytanie ze strony: ${dane.imie.replace(/[\r\n]/g, ' ')}`,
      text: [
        `Imię i nazwisko: ${dane.imie}`,
        `E-mail: ${dane.email}`,
        `Telefon: ${dane.telefon || 'nie podano'}`,
        '',
        dane.wiadomosc,
      ].join('\n'),
    });
  } catch {
    return NextResponse.json({ error: 'send-failed' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
