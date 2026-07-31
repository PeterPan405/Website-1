'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import { Icon } from '@/components/ui/Icon'
import {
  formatLargeAmount,
  formatNumber,
  formatPercent,
  formatPercentSigned,
} from '@/lib/format'
import { leseKursCsv, type Kurspunkt } from '@/lib/normierung'
import { vergleiche, vorbehalte, type Vergleichsposten } from '@/lib/vergleich'
import { Vergleichskurve } from '@/components/markets/Vergleichskurve'

/**
 * Die Auswahl der beiden Titel und die Tabelle darunter.
 *
 * ## Warum die Daten für alle Titel mitkommen
 *
 * Aus demselben Grund wie bei der Merkliste: Die Seite entsteht beim Bauen,
 * und welche zwei Titel jemand vergleichen will, weiß erst der Browser. Eine
 * Seite je Paarung wäre die Alternative – bei 1.029 Aktien sind das über eine
 * halbe Million Seiten für einen Anlass, den kaum jemand zweimal hat.
 *
 * ## Warum ein einfaches Auswahlfeld
 *
 * Ein natives `<select>` bringt die Tastatursuche mit, funktioniert ohne
 * JavaScript-Bibliothek und ist auf dem Telefon das, was das Gerät ohnehin
 * anbietet. Eine selbstgebaute Auswahlliste sähe moderner aus und wäre in
 * jeder Hinsicht schlechter bedienbar.
 */
export function Vergleichstafel({
  posten,
  anfangLinks,
  anfangRechts,
}: {
  posten: Vergleichsposten[]
  anfangLinks: string
  anfangRechts: string
}) {
  const [linksSymbol, setzeLinks] = useState(anfangLinks)
  const [rechtsSymbol, setzeRechts] = useState(anfangRechts)

  const nachSymbol = useMemo(
    () => new Map(posten.map((eintrag) => [eintrag.symbol, eintrag])),
    [posten]
  )

  /*
    Die beiden Kursreihen werden nachgeladen, nicht mitgeliefert.

    Sie ins Seitenpaket zu legen hieße, für über tausend Aktien Reihen
    auszuliefern, von denen jeder Besucher zwei braucht. Stattdessen holt der
    Browser genau die beiden CSV-Dateien, die ohnehin zum Herunterladen
    dastehen – eine Datei, zwei Zwecke.

    Schlägt der Abruf fehl, bleibt die Kurve weg und die Tabelle steht
    trotzdem. Sie ist der Inhalt dieser Seite; die Kurve ist die Zugabe.
  */
  const [kurven, setzeKurven] = useState<{
    links: Kurspunkt[]
    rechts: Kurspunkt[]
    fuer: string
  } | null>(null)

  useEffect(() => {
    if (linksSymbol === rechtsSymbol) return
    const kennung = `${linksSymbol}|${rechtsSymbol}`
    let abgebrochen = false

    async function holen() {
      try {
        const [a, b] = await Promise.all([
          fetch(`/maerkte/${linksSymbol}/kurse.csv`).then((antwort) => antwort.text()),
          fetch(`/maerkte/${rechtsSymbol}/kurse.csv`).then((antwort) => antwort.text()),
        ])
        if (abgebrochen) return
        setzeKurven({ links: leseKursCsv(a), rechts: leseKursCsv(b), fuer: kennung })
      } catch {
        if (!abgebrochen) setzeKurven(null)
      }
    }

    void holen()
    return () => {
      abgebrochen = true
    }
  }, [linksSymbol, rechtsSymbol])

  const links = nachSymbol.get(linksSymbol) ?? posten[0]
  const rechts = nachSymbol.get(rechtsSymbol) ?? posten[1]
  if (!links || !rechts) return null

  const gruppen = vergleiche(links, rechts)
  const hinweise = vorbehalte(links, rechts)
  const dasselbe = links.symbol === rechts.symbol

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { id: 'vergleich-links', wert: linksSymbol, setzen: setzeLinks, nummer: 1 },
          { id: 'vergleich-rechts', wert: rechtsSymbol, setzen: setzeRechts, nummer: 2 },
        ].map((feld) => (
          <div key={feld.id}>
            <label
              htmlFor={feld.id}
              className="text-fg-subtle text-xs font-medium tracking-wide uppercase"
            >
              {feld.nummer}. Aktie
            </label>
            <select
              id={feld.id}
              value={feld.wert}
              onChange={(event) => feld.setzen(event.target.value)}
              className="border-border bg-surface text-fg focus:border-markets mt-1.5 w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
            >
              {posten.map((eintrag) => (
                <option key={eintrag.symbol} value={eintrag.symbol}>
                  {eintrag.name} ({eintrag.ticker})
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {dasselbe ? (
        <p className="text-fg-muted mt-8 leading-relaxed">
          Zweimal derselbe Titel. Wähle oben einen zweiten aus.
        </p>
      ) : (
        <>
          {hinweise.length > 0 && (
            /*
              Die Vorbehalte stehen über der Tabelle. Wer sie erst darunter
              liest, hat die Zahlen schon geglaubt.
            */
            <div className="border-border bg-surface-subtle mt-8 rounded-lg border p-5">
              <h2 className="text-fg flex items-center gap-2 text-sm font-semibold">
                <Icon name="info" className="text-markets size-4" />
                Was diesen Vergleich einschränkt
              </h2>
              <ul className="text-fg-muted mt-3 space-y-2 text-sm leading-relaxed">
                {hinweise.map((satz) => (
                  <li key={satz} className="flex gap-2">
                    <span aria-hidden="true" className="text-fg-subtle">
                      ·
                    </span>
                    <span>{satz}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {kurven?.fuer === `${linksSymbol}|${rechtsSymbol}` && (
            <Vergleichskurve
              links={kurven.links}
              rechts={kurven.rechts}
              namelinks={links.name}
              namerechts={rechts.name}
            />
          )}

          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[38rem] text-sm">
              <caption className="sr-only">
                {links.name} und {rechts.name} im Vergleich
              </caption>
              <thead>
                <tr className="border-border border-b">
                  <th scope="col" className="text-fg-subtle py-3 text-left font-medium">
                    Merkmal
                  </th>
                  {[links, rechts].map((seite) => (
                    <th
                      key={seite.symbol}
                      scope="col"
                      className="py-3 text-right font-semibold"
                    >
                      <Link
                        href={`/maerkte/${seite.symbol}`}
                        className="text-fg hover:text-markets"
                      >
                        {seite.name}
                      </Link>
                      <span className="text-fg-subtle block text-xs font-normal">
                        {seite.ticker}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              {gruppen.map((gruppe) => (
                <tbody key={gruppe.titel}>
                  <tr>
                    <th
                      colSpan={3}
                      scope="colgroup"
                      className="pt-8 pb-1 text-left align-bottom"
                    >
                      <span className="text-fg text-base font-bold">{gruppe.titel}</span>
                      <span className="text-fg-muted mt-1 block max-w-2xl text-xs leading-relaxed font-normal">
                        {gruppe.einleitung}
                      </span>
                    </th>
                  </tr>
                  {gruppe.zeilen.map((zeile) => (
                    <tr key={zeile.feld} className="border-border border-b align-top">
                      <th scope="row" className="text-fg py-3 pr-4 text-left font-medium">
                        {zeile.feld}
                        {zeile.hinweis && (
                          <span className="text-fg-subtle mt-0.5 block max-w-md text-xs leading-relaxed font-normal">
                            {zeile.hinweis}
                          </span>
                        )}
                      </th>
                      {(['links', 'rechts'] as const).map((seite) => {
                        const seitendaten = seite === 'links' ? links : rechts
                        return (
                          <td
                            key={seite}
                            className={`py-3 pl-4 text-right tabular-nums ${
                              zeile.vorn === seite
                                ? 'text-fg font-semibold'
                                : 'text-fg-muted'
                            }`}
                          >
                            {zelleninhalt(zeile, seite, seitendaten)}
                            {/*
                              Die Markierung trägt einen Text für Vorlese-
                              programme. Eine Auszeichnung, die nur farbig und
                              fett ist, kommt dort gar nicht an.
                            */}
                            {zeile.vorn === seite && (
                              <span className="sr-only"> – liegt hier vorn</span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
        </>
      )}
    </div>
  )
}

/** Der Zellwert in der Schreibweise, die zur Einheit gehört. */
function zelleninhalt(
  zeile: ReturnType<typeof vergleiche>[number]['zeilen'][number],
  seite: 'links' | 'rechts',
  daten: Vergleichsposten
) {
  if (zeile.einheit === 'text') {
    const text = seite === 'links' ? zeile.linksText : zeile.rechtsText
    return text ?? '—'
  }

  const wert = seite === 'links' ? zeile.links : zeile.rechts
  if (wert === null) return '—'

  if (zeile.einheit === 'prozent') return formatPercentSigned(wert)
  if (zeile.einheit === 'anteil') return formatPercent(wert)
  if (zeile.einheit === 'faktor') return formatNumber(wert, 1)
  if (zeile.einheit === 'kurs') return `${formatNumber(wert, 2)} ${daten.waehrung}`
  return formatLargeAmount(wert, daten.bilanzwaehrung ?? '')
}
