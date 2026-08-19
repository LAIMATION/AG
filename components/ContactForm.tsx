'use client';

/* Formularz kontaktowy — POST na /api/kontakt, wysyłka SMTP przez Gmail.

   Limity znaków pochodzą z `formLimits` i są tu tylko afordancją: pole przestaje
   przyjmować znaki, licznik pokazuje ile zostało. Właściwa walidacja siedzi na
   serwerze, bo `maxLength` da się ominąć wysyłając żądanie z pominięciem formularza. */

import { useState } from 'react';
import { formLimits } from '@/lib/config';

type Tone = 'idle' | 'ok' | 'error';

export function ContactForm() {
  const [status, setStatus] = useState('');
  const [tone, setTone] = useState<Tone>('idle');
  const [sending, setSending] = useState(false);
  const [uzyte, setUzyte] = useState(0);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

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
        }),
      });

      if (!res.ok) throw new Error('send-failed');

      form.reset();
      setUzyte(0);
      setTone('ok');
      setStatus('Dziękuję — wiadomość została wysłana.');
    } catch {
      setTone('error');
      setStatus('Nie udało się wysłać. Spróbuj ponownie albo zadzwoń.');
    } finally {
      setSending(false);
    }
  };

  const zostalo = formLimits.wiadomosc.max - uzyte;

  return (
    <form className="ag-form" onSubmit={onSubmit} noValidate={false}>
      <div className="ag-form__row">
        <label className="ag-field">
          <span className="ag-field__label">
            Imię i nazwisko <span className="ag-field__req">(wymagane)</span>
          </span>
          <input
            className="ag-input"
            name="imie"
            type="text"
            required
            minLength={formLimits.imie.min}
            maxLength={formLimits.imie.max}
            autoComplete="name"
            placeholder="Jak się do Ciebie zwracać"
          />
        </label>

        <label className="ag-field">
          <span className="ag-field__label">
            E-mail <span className="ag-field__req">(wymagane)</span>
          </span>
          <input
            className="ag-input"
            name="email"
            type="email"
            required
            maxLength={formLimits.email.max}
            autoComplete="email"
            inputMode="email"
            placeholder="adres@poczta.pl"
          />
        </label>
      </div>

      <label className="ag-field">
        <span className="ag-field__label">Telefon (opcjonalnie)</span>
        <input
          className="ag-input"
          name="telefon"
          type="tel"
          maxLength={formLimits.telefon.max}
          autoComplete="tel"
          inputMode="tel"
          placeholder="+48 …"
        />
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
          name="wiadomosc"
          required
          minLength={formLimits.wiadomosc.min}
          maxLength={formLimits.wiadomosc.max}
          onChange={(e) => setUzyte(e.currentTarget.value.length)}
          placeholder="Lokalizacja działki, rodzaj budynku, planowany metraż, etap przygotowań, terminy…"
        />
      </label>

      {/* pułapka na boty — ukryta przed użytkownikiem */}
      <div className="ag-sr" aria-hidden="true">
        <label>
          Firma
          <input name="firma" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

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

      <p className="ag-form__note">Dane z formularza służą wyłącznie do odpowiedzi na zapytanie.</p>
    </form>
  );
}
