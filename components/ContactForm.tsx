'use client';

/* Formularz kontaktowy — POST na /api/kontakt, wysyłka SMTP przez Gmail.

   Limity znaków pochodzą z `formLimits`: pole przestaje przyjmować znaki, licznik
   pokazuje ile zostało. Reguły i komunikaty są w `lib/walidacja.ts`, wspólne z
   serwerem: tutaj dają komunikat pod polem (po wyjściu z pola i przy wysyłce),
   a serwer i tak sprawdza wszystko jeszcze raz. Natywne dymki przeglądarki są
   wyłączone (`noValidate`), żeby komunikaty były po polsku i w stylu strony. */

import { useEffect, useRef, useState } from 'react';
import { formLimits } from '@/lib/config';
import { KOMUNIKAT, sprawdz, sprawdzPole, type Pole } from '@/lib/walidacja';

type Tone = 'idle' | 'ok' | 'error';

/* Cloudflare Turnstile: aktywny tylko, gdy w Vercel ustawiono klucz witryny.
   Tryb `interaction-only`: widget jest niewidoczny, dopóki Cloudflare nie uzna,
   że trzeba coś kliknąć. */
const TURNSTILE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type Turnstile = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
};
declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

const KOMUNIKATY: Record<string, string> = {
  'invalid-fields': 'Popraw zaznaczone pola i wyślij ponownie.',
  'too-many-links': 'Wiadomość ma za dużo linków. Zostaw najwyżej dwa i wyślij ponownie.',
  captcha: 'Nie udało się potwierdzić, że piszesz Ty, a nie robot. Odśwież stronę i spróbuj ponownie.',
};

export function ContactForm() {
  const [status, setStatus] = useState('');
  const [tone, setTone] = useState<Tone>('idle');
  const [sending, setSending] = useState(false);
  const [uzyte, setUzyte] = useState(0);
  const [bledy, setBledy] = useState<Partial<Record<Pole, string>>>({});
  // pułapka czasowa: od kiedy formularz jest na ekranie
  const otwarty = useRef(0);
  const widget = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | undefined>(undefined);
  const token = useRef('');

  useEffect(() => {
    otwarty.current = Date.now();
    if (!TURNSTILE_KEY || !widget.current) return;

    const pokaz = () => {
      if (!window.turnstile || !widget.current || widgetId.current) return;
      widgetId.current = window.turnstile.render(widget.current, {
        sitekey: TURNSTILE_KEY,
        appearance: 'interaction-only',
        language: 'pl',
        theme: 'auto',
        callback: (t: string) => (token.current = t),
        'expired-callback': () => (token.current = ''),
      });
    };

    if (window.turnstile) return pokaz();
    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    s.async = true;
    s.onload = pokaz;
    document.head.appendChild(s);
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const wartosc = (p: Pole) => String(data.get(p) ?? '');

    const znalezione = sprawdz({
      imie: wartosc('imie'),
      email: wartosc('email'),
      telefon: wartosc('telefon'),
      wiadomosc: wartosc('wiadomosc'),
    });
    if (Object.keys(znalezione).length) {
      setBledy(znalezione);
      setTone('error');
      setStatus('Popraw zaznaczone pola i wyślij ponownie.');
      // fokus na pierwsze błędne pole: czytnik od razu przeczyta jego komunikat
      const pierwsze = (['imie', 'email', 'telefon', 'wiadomosc'] as Pole[]).find((p) => znalezione[p]);
      (form.elements.namedItem(pierwsze!) as HTMLElement | null)?.focus();
      return;
    }

    setSending(true);
    setTone('idle');
    setStatus('Wysyłam…');

    try {
      const res = await fetch('/api/kontakt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imie: data.get('imie'),
          email: data.get('email'),
          telefon: data.get('telefon'),
          wiadomosc: data.get('wiadomosc'),
          firma: data.get('firma'), // honeypot
          czas: Date.now() - otwarty.current,
          turnstile: token.current,
        }),
      });

      if (!res.ok) {
        const { error, pola } = (await res.json().catch(() => ({}))) as {
          error?: string;
          pola?: Pole[];
        };
        // serwer odrzucił pola: te same komunikaty co w przeglądarce, pod polami
        if (error === 'invalid-fields' && pola?.length) {
          setBledy(Object.fromEntries(pola.map((p) => [p, KOMUNIKAT[p]])));
          throw new Error('invalid-fields');
        }
        throw new Error(error ?? 'send-failed');
      }

      form.reset();
      setBledy({});
      setUzyte(0);
      setTone('ok');
      setStatus('Dziękuję, wiadomość została wysłana.');
    } catch (err) {
      setTone('error');
      setStatus(
        KOMUNIKATY[(err as Error).message] ?? 'Nie udało się wysłać. Spróbuj ponownie albo zadzwoń.',
      );
    } finally {
      // token Turnstile jest jednorazowy
      token.current = '';
      if (widgetId.current) window.turnstile?.reset(widgetId.current);
      setSending(false);
    }
  };

  const zostalo = formLimits.wiadomosc.max - uzyte;

  /* Komunikat pojawia się po wyjściu z wypełnionego pola (puste przeskakiwane
     Tabem nie krzyczą, to wyłapie wysyłka) i znika, gdy tylko wpis jest poprawny. */
  const ustaw = (p: Pole, blad: string | null) =>
    setBledy((b) => {
      if ((b[p] ?? null) === blad) return b;
      const n = { ...b };
      if (blad) n[p] = blad;
      else delete n[p];
      return n;
    });

  const pole = (p: Pole) => ({
    name: p,
    'aria-invalid': bledy[p] ? true : undefined,
    'aria-describedby': bledy[p] ? `blad-${p}` : undefined,
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const v = e.currentTarget.value;
      if (v.trim()) ustaw(p, sprawdzPole(p, v));
    },
    onInput: (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (bledy[p] && !sprawdzPole(p, e.currentTarget.value)) ustaw(p, null);
    },
  });

  // komunikat jest opisem pola (aria-describedby), więc nie dublujemy go w drzewie dostępności
  const blad = (p: Pole) =>
    bledy[p] ? (
      <span id={`blad-${p}`} className="ag-field__error" aria-hidden="true">
        {bledy[p]}
      </span>
    ) : null;

  return (
    <form className="ag-form" onSubmit={onSubmit} noValidate>
      <div className="ag-form__row">
        <label className="ag-field">
          <span className="ag-field__label">
            Imię i nazwisko <span className="ag-field__req">(wymagane)</span>
          </span>
          <input
            className="ag-input"
            {...pole('imie')}
            type="text"
            required
            minLength={formLimits.imie.min}
            maxLength={formLimits.imie.max}
            autoComplete="name"
            placeholder="Jak się do Ciebie zwracać"
          />
          {blad('imie')}
        </label>

        <label className="ag-field">
          <span className="ag-field__label">
            E-mail <span className="ag-field__req">(wymagane)</span>
          </span>
          <input
            className="ag-input"
            {...pole('email')}
            type="email"
            required
            maxLength={formLimits.email.max}
            autoComplete="email"
            inputMode="email"
            placeholder="adres@poczta.pl"
          />
          {blad('email')}
        </label>
      </div>

      <label className="ag-field">
        <span className="ag-field__label">Telefon (opcjonalnie)</span>
        <input
          className="ag-input"
          {...pole('telefon')}
          type="tel"
          maxLength={formLimits.telefon.max}
          autoComplete="tel"
          inputMode="tel"
          placeholder="+48 …"
        />
        {blad('telefon')}
      </label>

      <label className="ag-field ag-field--grow">
        <span className="ag-field__label">
          Wiadomość <span className="ag-field__req">(wymagane)</span>
          <span className="ag-field__count" aria-hidden="true">
            {zostalo} znaków
          </span>
        </span>
        <textarea
          className="ag-textarea"
          {...pole('wiadomosc')}
          required
          minLength={formLimits.wiadomosc.min}
          maxLength={formLimits.wiadomosc.max}
          onChange={(e) => setUzyte(e.currentTarget.value.length)}
          placeholder="Lokalizacja działki, rodzaj budynku, planowany metraż, etap przygotowań, terminy…"
        />
        {blad('wiadomosc')}
      </label>

      {/* pułapka na boty — ukryta przed użytkownikiem */}
      <div className="ag-sr" aria-hidden="true">
        <label>
          Firma
          <input name="firma" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {TURNSTILE_KEY && <div className="ag-form__captcha" ref={widget} />}

      <div className="ag-form__foot">
        <button className="ag-btn" type="submit" disabled={sending}>
          {sending ? 'Wysyłam…' : 'Wyślij wiadomość'}
        </button>
        {/* Błąd musi przerwać czytnikowi bieżącą wypowiedź — `status` jest zbyt
            łagodny na komunikat, po którym trzeba coś poprawić. */}
        <span
          className="ag-form__status"
          data-tone={tone}
          role={tone === 'error' ? 'alert' : 'status'}
          aria-live={tone === 'error' ? 'assertive' : 'polite'}
        >
          {status}
        </span>
      </div>

      {/* skrócona informacja z art. 13 RODO; pełna treść na podstronie */}
      <p className="ag-form__note">
        Administratorem danych jest ATRIUM Studio Aleksandra Niewińska. Dane z formularza przetwarzam
        wyłącznie, by odpowiedzieć na zapytanie. Szczegóły i Twoje prawa:{' '}
        <a href="/polityka-prywatnosci">polityka prywatności</a>.
      </p>
    </form>
  );
}
