import Link from 'next/link'

import {
  STANDARDANNAHMEN,
  gerechtfertigtesKgv,
  implizitesWachstum,
} from '@/lib/eingepreist'
import { formatNumber, formatPercentSigned } from '@/lib/format'

/**
 * Die Bewertung, auf der Aktienseite bereits durchgerechnet.
 *
 * Der Bewertungsrechner beantwortet „Welches Gewinnwachstum bezahlt dieses
 * KGV?“ – aber wer auf einer Aktienseite steht, soll die Antwort für genau
 * diese Aktie nicht erst hinter einem Klick suchen. Die Karte rechnet sie
 * beim Bauen mit den Standardannahmen vor; der Rechner bleibt der Ort, an
 * dem man die Annahmen verstellt, und öffnet vorbelegt mit diesem KGV.
 *
 * Die Annahmen stehen ausgeschrieben im Satz, nicht in einer Fußnote: Eine
 * vorgerechnete Zahl ohne ihre Annahmen sähe aus wie eine Eigenschaft der
 * Aktie – sie ist aber eine Eigenschaft des Modells.
 */
export function EingepreistKarte({
  kgv,
  className,
}: {
  kgv: number
  className?: string
}) {
  const wachstum = implizitesWachstum(kgv, STANDARDANNAHMEN)
  const kgvOhneWachstum = gerechtfertigtesKgv(0, STANDARDANNAHMEN)

  return (
    <section aria-labelledby="eingepreist" className={className}>
      <h2 id="eingepreist" className="text-fg text-2xl font-bold">
        Was der Kurs schon verspricht
      </h2>
      <div className="fk-card mt-6 p-6">
        {wachstum === null ? (
          <p className="text-fg-muted leading-relaxed">
            Für das KGV von {formatNumber(kgv, 1)} liegt das nötige Gewinnwachstum
            außerhalb des Modells (−50 bis +60 Prozent je Jahr) – dieser Preis lässt sich
            mit Gewinnwachstum allein nicht begründen.
          </p>
        ) : (
          <>
            <p className="text-fg-muted text-sm font-medium">
              Eingepreistes Gewinnwachstum
            </p>
            <p className="text-brand mt-1.5 text-3xl font-bold tabular-nums sm:text-4xl">
              {formatPercentSigned(wachstum)} pro Jahr
            </p>
            <p className="text-fg-subtle mt-2 text-sm leading-relaxed">
              So stark müsste der Gewinn {STANDARDANNAHMEN.jahre} Jahre lang jedes Jahr
              wachsen, damit ein Käufer zum heutigen KGV von {formatNumber(kgv, 1)} genau{' '}
              {STANDARDANNAHMEN.abzinsungProzent} Prozent Rendite bekommt (End-KGV{' '}
              {STANDARDANNAHMEN.endKgv}). Zum Vergleich: Ganz ohne Wachstum wäre ein KGV
              von {formatNumber(kgvOhneWachstum, 1)} gerechtfertigt.
            </p>
          </>
        )}
        <p className="text-fg-subtle mt-3 text-xs leading-relaxed">
          Das ist eine Messlatte für den Preis, kein Kursziel und keine Empfehlung – und
          die Zahl hängt an den Annahmen. Genau dafür gibt es den Rechner:
        </p>
        <p className="mt-3">
          <Link
            href={`/rechner/bewertungsrechner#kgv=${kgv.toFixed(1)}`}
            className="fk-btn-secondary text-sm"
          >
            Annahmen im Bewertungsrechner verstellen
          </Link>
        </p>
      </div>
    </section>
  )
}
