'use client'

import { useState } from 'react'

import {
  entferneLuecke,
  leereSuchluecken,
  useSuchluecken,
} from '@/components/layout/suchluecken-speicher'
import { Icon } from '@/components/ui/Icon'
import { formatDateShort } from '@/lib/format'
import { alsText, gesamtzahl } from '@/lib/suchluecken'

/**
 * Was auf diesem Gerät gesucht und nicht gefunden wurde.
 *
 * ## Warum die Liste sichtbar ist und nicht nur gesammelt wird
 *
 * Weil sie sonst heimlich wäre. Ein Protokoll der eigenen Sucheingaben, das
 * niemand einsehen kann, ist eine Wanze – auch dann, wenn es das Gerät nie
 * verlässt. Hier steht es Zeile für Zeile, jede einzelne lässt sich löschen,
 * und wer das Ganze weghaben will, drückt einmal auf „Alles löschen“.
 *
 * ## Warum kein automatischer Versand
 *
 * Dieselbe Antwort. Ein Suchfeld nimmt entgegen, was jemand eintippt, und das
 * ist gelegentlich mehr als ein Stichwort. Übertragen wird nichts; wer die
 * Liste schicken will, kopiert sie mit dem Knopf und entscheidet dabei selbst,
 * was mitgeht.
 */
export function Suchlueckentafel({ kontaktMail }: { kontaktMail: string }) {
  const luecken = useSuchluecken()
  const [kopiert, setzeKopiert] = useState(false)

  async function kopieren() {
    try {
      await navigator.clipboard.writeText(alsText(luecken))
      setzeKopiert(true)
      setTimeout(() => setzeKopiert(false), 2500)
    } catch {
      // Ohne Zwischenablage-Erlaubnis bleibt der Text im Kasten darunter lesbar.
      setzeKopiert(false)
    }
  }

  if (luecken.length === 0) {
    return (
      <div className="border-border bg-surface-subtle rounded-xl border p-6">
        <p className="text-fg font-medium">Hier steht noch nichts.</p>
        <p className="text-fg-muted mt-2 leading-relaxed">
          Aufgenommen wird eine Suche erst, wenn sie nichts gefunden hat und die Eingabe
          eine Sekunde lang stehen geblieben ist. Wer beim Tippen „nes“, „nest“ und
          „nestl“ durchläuft und dann Nestlé findet, hinterlässt deshalb nichts – und was
          doch schon notiert war, wird beim Treffer wieder entfernt.
        </p>
      </div>
    )
  }

  const gesamt = gesamtzahl(luecken)

  return (
    <div>
      <p className="text-fg-muted leading-relaxed">
        <strong className="text-fg font-semibold">{luecken.length}</strong>{' '}
        {luecken.length === 1 ? 'Anfrage' : 'verschiedene Anfragen'}, zusammen{' '}
        <strong className="text-fg font-semibold">{gesamt}</strong>{' '}
        {gesamt === 1 ? 'erfolglose Suche' : 'erfolglose Suchen'}. Die Zahl links sagt,
        wie oft – und sie ist die eigentliche Auskunft: Fünfzehn Einträge mit je einer
        Suche sind Rauschen, drei mit je zwanzig sind eine Lücke.
      </p>

      <ul className="border-border divide-border mt-6 divide-y rounded-xl border">
        {luecken.map((eintrag) => (
          <li key={eintrag.anfrage} className="flex items-center gap-4 px-4 py-3">
            <span className="text-fg w-12 shrink-0 text-right font-semibold tabular-nums">
              {eintrag.anzahl}×
            </span>
            <span className="text-fg min-w-0 flex-1 break-words">{eintrag.anfrage}</span>
            <span className="text-fg-subtle hidden shrink-0 text-xs tabular-nums sm:block">
              zuletzt {formatDateShort(eintrag.zuletzt)}
            </span>
            <button
              type="button"
              onClick={() => entferneLuecke(eintrag.anfrage)}
              className="fk-btn-ghost size-8 shrink-0 rounded-full p-0"
            >
              <Icon name="close" className="size-4" />
              <span className="sr-only">„{eintrag.anfrage}“ aus der Liste entfernen</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={kopieren} className="fk-btn-primary">
          <Icon name={kopiert ? 'check' : 'layers'} className="size-4" />
          {kopiert ? 'In der Zwischenablage' : 'Liste kopieren'}
        </button>
        <a
          href={`mailto:${kontaktMail}?subject=${encodeURIComponent('Was ich gesucht und nicht gefunden habe')}`}
          className="fk-btn-secondary"
        >
          <Icon name="mail" className="size-4" />
          Per Mail schicken
        </a>
        <button type="button" onClick={leereSuchluecken} className="fk-btn-ghost">
          Alles löschen
        </button>
      </div>

      {/*
        Der fertige Text steht sichtbar da, nicht nur in der Zwischenablage.

        Zwei Gründe: Ohne Erlaubnis für die Zwischenablage – im privaten Modus
        oder unter strengen Einstellungen – ginge sonst gar nichts. Und wer
        etwas verschickt, soll vorher genau das sehen, was er verschickt, und
        nicht eine Zusammenfassung davon.
      */}
      <details className="border-border mt-6 rounded-xl border">
        <summary className="text-fg cursor-pointer px-4 py-3 text-sm font-medium">
          Was genau kopiert wird
        </summary>
        <pre className="text-fg-muted overflow-x-auto px-4 pb-4 text-xs leading-relaxed">
          {alsText(luecken)}
        </pre>
      </details>
    </div>
  )
}
