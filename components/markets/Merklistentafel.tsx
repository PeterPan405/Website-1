'use client'

import Link from 'next/link'

import { Streutafel } from '@/components/markets/Streutafel'
import { Icon } from '@/components/ui/Icon'
import {
  entferneAusMerkliste,
  HOECHSTZAHL,
  leereMerkliste,
  useMerkliste,
} from '@/components/markets/merkliste-speicher'
import { cn } from '@/lib/cn'
import { formatDateShort, formatNumber, formatPercentSigned } from '@/lib/format'

/**
 * Was die Merkliste je Titel anzeigt.
 *
 * Beim Bauen erzeugt und für **alle** Instrumente mitgeliefert – die Seite ist
 * statisch, und welche Titel jemand gemerkt hat, weiß erst der Browser. Die
 * Felder sind deshalb kurzgehalten: Was hier steht, steht tausendfach im
 * Seitenpaket.
 */
export interface Merkdaten {
  symbol: string
  ticker: string
  name: string
  einheit: string
  stellen: number
  wert: number
  veraenderung: number
  /** Dividendenrendite in Prozent, wo sie gebildet werden konnte. */
  rendite: number | null
  /** Nächster erwarteter Termin, `JJJJ-MM-TT`. */
  termin: string | null
  /** Was für ein Termin das ist – „Dividende“ oder „Quartalszahlen“. */
  terminArt: string | null
  /** Branche, für die Streuungsprüfung. */
  branche: string | null
  /** Sitzland als ISO-3166-Zahl, für dieselbe. */
  sitzland: string | null
}

/**
 * Die gemerkten Titel mit Kurs, Rendite und nächstem Termin.
 *
 * ## Warum die Daten für alle Titel mitkommen
 *
 * Weil die Seite beim Bauen entsteht und die Merkliste erst im Browser
 * existiert. Der Server kann nicht wissen, welche Zeilen gebraucht werden;
 * also liegen alle bereit und die Auswahl passiert hier. Das kostet einmal
 * ein paar hundert Kilobyte auf genau dieser Seite – die Alternative wäre ein
 * Server, den es hier nicht gibt.
 *
 * ## Warum die Termine geschätzt heißen
 *
 * Weil sie es sind. Dividendenabschläge und Quartalstermine sind aus dem
 * bisherigen Muster gerechnet; das steht im Kalender genauso und aus demselben
 * Grund. Ein geschätzter Termin, der aussieht wie ein feststehender, ist
 * schlechter als gar keiner.
 */
export function Merklistentafel({
  daten,
  laendernamen,
}: {
  daten: readonly Merkdaten[]
  /** ISO-Zahl auf deutschen Ländernamen, für die Streuungsprüfung. */
  laendernamen: Readonly<Record<string, string>>
}) {
  const liste = useMerkliste()
  const nachSymbol = new Map(daten.map((eintrag) => [eintrag.symbol, eintrag]))

  /*
    Die Reihenfolge der Merkliste zählt, nicht die des Katalogs: zuletzt
    gemerkt steht oben. Einträge ohne Gegenstück im Katalog fallen still weg –
    das passiert, wenn ein Titel aus der Auswahl genommen wurde, und ein
    Verweis ins Leere wäre schlechter als eine Zeile weniger.
  */
  const zeilen = liste
    .map((eintrag) => nachSymbol.get(eintrag.symbol))
    .filter((eintrag): eintrag is Merkdaten => Boolean(eintrag))

  if (zeilen.length === 0) {
    return (
      <div className="border-border bg-surface-muted rounded-xl border p-6">
        <p className="text-fg font-semibold">Noch nichts gemerkt</p>
        <p className="text-fg-muted mt-2 leading-relaxed">
          Auf jeder Kursseite steht oben ein Knopf „Merken“. Was du dort merkst, erscheint
          hier – mit dem aktuellen Kurs, der Dividendenrendite und dem nächsten erwarteten
          Termin.
        </p>
        <p className="text-fg-subtle mt-3 text-sm leading-relaxed">
          Die Liste bleibt in diesem Browser und geht an niemanden. Sie überlebt deshalb
          keinen Gerätewechsel und kein Löschen der Browserdaten.
        </p>
        <Link
          href="/maerkte"
          className="text-markets mt-4 inline-flex items-center gap-1 font-medium underline underline-offset-2"
        >
          Zu den Kursen
          <Icon name="arrow-right" className="size-4" aria-hidden="true" />
        </Link>
      </div>
    )
  }

  const mitTermin = zeilen
    .filter((zeile) => zeile.termin)
    .sort((a, b) => (a.termin ?? '').localeCompare(b.termin ?? ''))

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="text-fg-muted text-sm">
          {zeilen.length} von höchstens {HOECHSTZAHL} Titeln
        </p>
        <button
          type="button"
          onClick={leereMerkliste}
          className="text-fg-subtle hover:text-danger text-sm underline underline-offset-2"
        >
          Liste leeren
        </button>
      </div>

      <ul className="border-border mt-4 border-t">
        {zeilen.map((zeile) => {
          const positiv = zeile.veraenderung >= 0
          return (
            <li
              key={zeile.symbol}
              className="border-border flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b py-3"
            >
              <Link
                href={`/maerkte/${zeile.symbol}`}
                className="text-fg hover:text-markets w-20 shrink-0 truncate text-sm font-semibold"
              >
                {zeile.ticker}
              </Link>
              <Link
                href={`/maerkte/${zeile.symbol}`}
                className="text-fg-muted hover:text-fg min-w-0 flex-1 truncate text-sm"
              >
                {zeile.name}
              </Link>

              <span className="text-fg shrink-0 text-sm tabular-nums">
                {formatNumber(zeile.wert, zeile.stellen)}{' '}
                <span className="text-fg-subtle text-xs">{zeile.einheit}</span>
              </span>
              <span
                className={cn(
                  'w-24 shrink-0 text-right text-sm font-medium whitespace-nowrap tabular-nums',
                  positiv ? 'text-success' : 'text-danger'
                )}
              >
                {formatPercentSigned(zeile.veraenderung)}
              </span>
              <span className="text-fg-subtle w-24 shrink-0 text-right text-sm tabular-nums">
                {zeile.rendite !== null ? `${formatNumber(zeile.rendite, 2)} %` : '–'}
              </span>
              <span className="text-fg-subtle w-28 shrink-0 text-right text-xs">
                {zeile.termin ? formatDateShort(zeile.termin) : '–'}
              </span>
              <button
                type="button"
                onClick={() => entferneAusMerkliste(zeile.symbol)}
                className="text-fg-subtle hover:text-danger shrink-0 transition"
              >
                <Icon name="close" className="size-4" aria-hidden="true" />
                <span className="sr-only">{zeile.name} entfernen</span>
              </button>
            </li>
          )
        })}
      </ul>

      <p className="text-fg-subtle mt-3 text-xs leading-relaxed">
        Spalten: Kurs, Tagesveränderung, Dividendenrendite der letzten zwölf Monate,
        nächster erwarteter Termin. Ein Strich heißt, dass die Zahl fehlt – bei der
        Rendite meist, weil der Titel keine Dividende zahlt oder noch kein voller
        Jahreszyklus vorliegt.
      </p>

      {mitTermin.length > 0 && (
        <section aria-labelledby="termine" className="mt-10">
          <h2 id="termine" className="text-fg text-xl font-bold">
            Was als Nächstes ansteht
          </h2>
          <p className="text-fg-muted mt-2 leading-relaxed">
            Dieselben Titel, nach Datum sortiert. Alle Termine sind aus dem bisherigen
            Muster gerechnet und deshalb Schätzungen – den verbindlichen Tag nennt das
            Unternehmen selbst, meist wenige Wochen vorher.
          </p>
          <ul className="border-border mt-4 border-t">
            {mitTermin.slice(0, 12).map((zeile) => (
              <li
                key={`${zeile.symbol}-termin`}
                className="border-border flex items-baseline gap-3 border-b py-2.5"
              >
                <span className="text-fg-subtle w-24 shrink-0 text-sm tabular-nums">
                  {formatDateShort(zeile.termin ?? '')}
                </span>
                <Link
                  href={`/maerkte/${zeile.symbol}`}
                  className="text-fg hover:text-markets min-w-0 flex-1 truncate text-sm"
                >
                  {zeile.name}
                </Link>
                <span className="text-fg-subtle shrink-0 text-xs">
                  {zeile.terminArt} · geschätzt
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/*
        Die Streuung steht unter den Terminen, nicht darüber.

        Oben beantwortet die Liste „was habe ich im Blick“ und „was steht an“ –
        beides Fragen mit einer Zahl als Antwort. Die Streuung ist die Frage
        danach: Was sagt diese Auswahl über sich selbst? Wer sie zuerst liest,
        hat die Liste noch nicht gesehen, auf die sie sich bezieht.
      */}
      <Streutafel
        posten={zeilen.map((zeile) => ({
          branche: zeile.branche,
          sitzland: zeile.sitzland,
        }))}
        laendernamen={laendernamen}
      />
    </div>
  )
}
