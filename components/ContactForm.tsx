'use client';

/* Formularz kontaktowy — POST na /api/kontakt, wysyłka SMTP przez Gmail. */

import { useState } from 'react';

type Tone = 'idle' | 'ok' | 'error';

export function ContactForm() {
  const [status, setStatus] = useState('');
  const [tone, setTone] = useState<Tone>('idle');
  const [sending, setSending] = useState(false);

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
      setTone('ok');
      setStatus('Dziękuję — wiadomość została wysłana.');
    } catch {
      setTone('error');
      setStatus('Nie udało się wysłać. Proszę spróbować ponownie lub zadzwonić.');
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="ag-form" onSubmit={onSubmit}>
      <div className="ag-form__row">
        <label className="ag-field">
          <span className="ag-field__label">Imię i nazwisko</span>
          <input
            className="ag-input"
            name="imie"
            type="text"
            required
            autoComplete="name"
            placeholder="Jak się do Państwa zwracać"
          />
        </label>

        <label className="ag-field">
          <span className="ag-field__label">E-mail</span>
          <input
            className="ag-input"
            name="email"
            type="email"
            required
            autoComplete="email"
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
          autoComplete="tel"
          placeholder="+48 …"
        />
      </label>

      <label className="ag-field ag-field--grow">
        <span className="ag-field__label">Wiadomość</span>
        <textarea
          className="ag-textarea"
          name="wiadomosc"
          required
          placeholder="Lokalizacja działki, planowany metraż, etap przygotowań, terminy…"
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
        <span className="ag-form__status" data-tone={tone} role="status" aria-live="polite">
          {status}
        </span>
      </div>

      <p className="ag-form__note">Dane z formularza służą wyłącznie do odpowiedzi na zapytanie.</p>
    </form>
  );
}
