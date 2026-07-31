'use client'

import { useMemo, useState } from 'react'
import { getCalculatorDefinition } from '@/data/calculators'

import { InputPanel } from '@/components/calculators/CalculatorPanels'
import { useErgebnisbericht } from '@/components/calculators/ErgebnisDownload'
import { InstrumentSuche } from '@/components/calculators/InstrumentSuche'
import { Callout } from '@/components/ui/Callout'
import { Icon } from '@/components/ui/Icon'
import { Stat, StatGrid } from '@/components/ui/Stat'
import {
  analysiere,
  beobachtungen,
  type Anteil,
  type DepotStammdaten,
  type Position,
} from '@/lib/depot'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/format'

/**
 * Die Aufteilung einer Zusammenstellung, nach Gewichten.
 *
 * ## Warum es diesen Rechner gibt
 *
 * Weil „ich bin breit aufgestellt“ eine Aussage über Anteile ist und fast
 * immer aus dem Bauch kommt. Zehn Positionen fühlen sich nach Streuung an.
 * Sind sechs davon Technologie und macht eine allein die Hälfte aus, ist es
 * keine – aber das sieht man einer Liste von zehn Zeilen nicht an. Es sichtbar
 * zu machen braucht keine Prognose und kein Modell, nur eine Division.
 *
 * ## Warum die Daten das Gerät nicht verlassen
 *
 * Weil sie niemanden etwas angehen. Gerechnet wird im Browser, gespeichert
 * wird nichts, gesendet wird nichts – die Seite ist ein statisches Dokument
 * ohne Gegenstelle. Das ist keine Zusicherung, die man glauben muss: Es gibt
 * schlicht keinen Server, an den etwas gehen könnte.
 *
 * ## Warum Beträge und nicht Prozente eingegeben werden
 *
 * Beträge kennt man, Prozente muss man ausrechnen – und wer sie ausrechnet,
 * hat die Antwort schon. Die Umrechnung ist genau die Arbeit, die dieser
 * Rechner abnimmt.
 */

/** Was die Seite über die wählbaren Instrumente mitgibt. */
export interface Auswahleintrag extends DepotStammdaten {
  ticker: string
  /** Klartext des Sitzlands, sofern bekannt. */
  landName?: string
}

interface Zeile {
  /** Eigene Kennung, damit React beim Löschen nicht durcheinanderkommt. */
  id: number
  symbol: string
  betrag: string
}

let naechsteId = 1
function neueZeile(symbol = '', betrag = ''): Zeile {
  return { id: naechsteId++, symbol, betrag }
}

/**
 * Eine Beispielaufstellung, die etwas zeigt.
 *
 * Bewusst nicht ausgewogen: Vier Positionen, davon zwei Halbleiter und die
 * größte bei gut einem Drittel. Ein Musterdepot, an dem nichts auffällt, wäre
 * ein schlechtes Muster – man sähe nicht, wozu die Seite da ist. Wer eigene
 * Zahlen einträgt, überschreibt es ohnehin sofort.
 */
const BEISPIEL = [
  ['nvidia', '4000'],
  ['amd', '2000'],
  ['sap', '2500'],
  ['apple', '3000'],
]

export function Depotanalyse({ katalog }: { katalog: Auswahleintrag[] }) {
  const [zeilen, setZeilen] = useState<Zeile[]>(() => {
    const vorhanden = new Set(katalog.map((e) => e.symbol))
    const start = BEISPIEL.filter(([s]) => vorhanden.has(s)).map(([s, b]) =>
      neueZeile(s, b)
    )
    return start.length > 0 ? start : [neueZeile(), neueZeile()]
  })

  const stammdaten = useMemo(() => new Map(katalog.map((e) => [e.symbol, e])), [katalog])
  /** Sitzland-Nummer auf Klartext, einmal aus dem Katalog gezogen. */
  const laender = useMemo(() => {
    const karte = new Map<string, string>()
    for (const e of katalog) {
      if (e.sitzland && e.landName) karte.set(e.sitzland, e.landName)
    }
    return karte
  }, [katalog])

  const analyse = useMemo(() => {
    const positionen: Position[] = zeilen.map((z) => ({
      symbol: z.symbol,
      // Komma als Dezimaltrennzeichen: So tippt man auf Deutsch.
      betrag: Number.parseFloat(z.betrag.replace(/\./g, '').replace(',', '.')),
    }))
    return analysiere(positionen, stammdaten)
  }, [zeilen, stammdaten])

  const funde = useMemo(() => beobachtungen(analyse), [analyse])

  /*
    Das Ergebnis zum Mitnehmen anmelden.

    Die Positionen sind hier die Annahmen – ohne sie ist jede Aufteilung eine
    Zahl ohne Herkunft. Ist nichts eingetragen, wird `null` gemeldet und der
    Knopf verschwindet, statt ein Blatt mit Nullen anzubieten.
  */
  useErgebnisbericht(
    analyse.anzahl === 0
      ? null
      : {
          titel: 'Depotanalyse',
          pfad: '/rechner/depotanalyse',
          annahmen: analyse.positionen.map((p) => ({
            bezeichnung: p.stammdaten?.name ?? p.symbol,
            wert: formatCurrency(p.betrag),
          })),
          ergebnisse: [
            { bezeichnung: 'Summe', wert: formatCurrency(analyse.summe) },
            {
              bezeichnung: 'Größte Position',
              wert: formatPercent(analyse.konzentration.groessterPosten * 100, 1),
            },
            {
              bezeichnung: 'Drei größte zusammen',
              wert: formatPercent(analyse.konzentration.dreiGroessten * 100, 1),
            },
            {
              bezeichnung: 'Wirksame Positionszahl',
              wert: formatNumber(analyse.konzentration.wirksameAnzahl, 1),
              hinweis:
                'Wie vielen gleich großen Positionen die Verteilung entspricht – der ' +
                'Kehrwert des Herfindahl-Index.',
            },
            ...(analyse.kostenquote !== null
              ? [
                  {
                    bezeichnung: 'Laufende Kosten (gewichtet)',
                    wert: formatPercent(analyse.kostenquote, 2),
                    hinweis: `Bezogen auf ${formatPercent(analyse.kostenAbdeckung * 100, 0)} der Summe; nur dort ist eine Kostenquote hinterlegt.`,
                  },
                ]
              : []),
          ],
          bloecke: [
            {
              titel: 'Nach Anlageart',
              zeilen: alsBerichtszeilen(analyse.nachArt, analyse.summe),
            },
            {
              titel: 'Nach Branche',
              zeilen: alsBerichtszeilen(analyse.nachBranche, analyse.summe),
            },
            {
              titel: 'Nach Sitzland',
              zeilen: alsBerichtszeilen(
                analyse.nachLand.map((l) => ({
                  ...l,
                  gruppe: l.gruppe === null ? null : (laender.get(l.gruppe) ?? l.gruppe),
                })),
                analyse.summe
              ),
            },
            {
              titel: 'Nach Währung',
              zeilen: alsBerichtszeilen(analyse.nachWaehrung, analyse.summe),
            },
            ...(funde.length > 0
              ? [
                  {
                    titel: 'Was an der Verteilung auffällt',
                    zeilen: funde.map((f) => ({ bezeichnung: f.text, wert: '' })),
                  },
                ]
              : []),
          ],
          grenzen: getCalculatorDefinition('depotanalyse')!.grenzen,
        }
  )

  function aendere(id: number, feld: 'symbol' | 'betrag', wert: string) {
    setZeilen((alt) => alt.map((z) => (z.id === id ? { ...z, [feld]: wert } : z)))
  }

  return (
    <div className="mt-8 space-y-6">
      <InputPanel title="Positionen">
        <div className="space-y-2">
          {zeilen.map((zeile) => (
            <div key={zeile.id} className="flex flex-wrap items-end gap-2">
              <InstrumentSuche
                eintraege={katalog}
                wert={zeile.symbol}
                onWaehle={(symbol) => aendere(zeile.id, 'symbol', symbol)}
                label="Instrument suchen"
              />
              <label className="w-32">
                <span className="sr-only">Betrag in Euro</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={zeile.betrag}
                  onChange={(e) => aendere(zeile.id, 'betrag', e.target.value)}
                  placeholder="0"
                  className="fk-input w-full text-right tabular-nums"
                />
              </label>
              <button
                type="button"
                onClick={() => setZeilen((alt) => alt.filter((z) => z.id !== zeile.id))}
                className="fk-btn-ghost size-10 rounded-full p-0"
                /* Der Name des Titels im Label: „Zeile 3 entfernen" hilft
                   niemandem, der die Zeilen nicht sehen kann. */
                aria-label={`${
                  stammdaten.get(zeile.symbol)?.name ?? 'Leere Position'
                } entfernen`}
              >
                <Icon name="close" className="size-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setZeilen((alt) => [...alt, neueZeile()])}
            className="fk-btn-secondary"
          >
            Position hinzufügen
          </button>
          <button
            type="button"
            onClick={() => setZeilen([neueZeile(), neueZeile()])}
            className="fk-btn-ghost"
          >
            Leeren
          </button>
        </div>
      </InputPanel>

      {analyse.anzahl === 0 ? (
        <Callout variant="info" title="Noch nichts zu rechnen">
          <p>
            Sobald mindestens eine Position einen Betrag hat, steht hier die Aufteilung –
            nach Anlageart, Branche, Land und Währung.
          </p>
        </Callout>
      ) : (
        <>
          <Abschnitt titel="Überblick">
            <StatGrid>
              <Stat label="Summe" value={formatCurrency(analyse.summe)} />
              <Stat label="Positionen" value={formatNumber(analyse.anzahl)} />
              <Stat
                label="Größte Position"
                value={formatPercent(analyse.konzentration.groessterPosten * 100, 1)}
              />
              <Stat
                label="Wirksame Anzahl"
                value={formatNumber(analyse.konzentration.wirksameAnzahl, 1)}
                hint="Wie vielen gleich großen Positionen die Verteilung entspricht."
              />
            </StatGrid>

            {(analyse.kostenquote !== null || analyse.dividendenrendite !== null) && (
              <StatGrid className="mt-4" columns={2}>
                {analyse.kostenquote !== null && (
                  <Stat
                    label="Laufende Kosten"
                    value={formatPercent(analyse.kostenquote, 2)}
                    hint={`Gewichtet über ${formatPercent(
                      analyse.kostenAbdeckung * 100,
                      0
                    )} der Summe – nur dort ist eine Kostenquote hinterlegt.`}
                  />
                )}
                {analyse.dividendenrendite !== null && (
                  <Stat
                    label="Ausschüttungsrendite"
                    value={formatPercent(analyse.dividendenrendite, 2)}
                    hint={`Gewichtet über ${formatPercent(
                      analyse.dividendenAbdeckung * 100,
                      0
                    )} der Summe.`}
                  />
                )}
              </StatGrid>
            )}
          </Abschnitt>

          <Abschnitt titel="Gewichtung je Position">
            <Balken
              eintraege={analyse.positionen.map((p) => ({
                gruppe: p.stammdaten?.name ?? p.symbol,
                betrag: p.betrag,
                anteil: p.anteil,
                posten: 1,
              }))}
              summe={analyse.summe}
            />
          </Abschnitt>

          <div className="grid gap-6 lg:grid-cols-2">
            <Abschnitt titel="Nach Anlageart">
              <Balken eintraege={analyse.nachArt} summe={analyse.summe} />
            </Abschnitt>
            <Abschnitt titel="Nach Branche">
              <Balken eintraege={analyse.nachBranche} summe={analyse.summe} />
            </Abschnitt>
            <Abschnitt titel="Nach Sitzland">
              <Balken
                eintraege={analyse.nachLand.map((l) => ({
                  ...l,
                  gruppe: l.gruppe === null ? null : (laender.get(l.gruppe) ?? l.gruppe),
                }))}
                summe={analyse.summe}
              />
            </Abschnitt>
            <Abschnitt titel="Nach Währung">
              <Balken eintraege={analyse.nachWaehrung} summe={analyse.summe} />
            </Abschnitt>
          </div>

          {funde.length > 0 && (
            <Callout variant="info" title="Was an der Verteilung auffällt">
              <ul className="space-y-2">
                {funde.map((fund) => (
                  <li key={fund.text}>{fund.text}</li>
                ))}
              </ul>
              <p className="text-fg-subtle mt-3 text-sm">
                Beobachtungen, keine Empfehlungen. Ob eine Aufteilung passt, hängt an
                Zielen und Zeitraum – und die kennt diese Seite nicht.
              </p>
            </Callout>
          )}
        </>
      )}
    </div>
  )
}

/**
 * Eine Aufteilung als Balken.
 *
 * Balken und nicht Kreis: Anteile lassen sich als Länge vergleichen, als
 * Kreissegment nicht. Bei zwei ähnlich großen Segmenten rät man, welches
 * größer ist; bei zwei Balken sieht man es. Das ist kein Geschmacksurteil,
 * sondern der Grund, warum Kreisdiagramme in der Statistik einen schlechten
 * Ruf haben.
 */
function Balken({ eintraege, summe }: { eintraege: Anteil[]; summe: number }) {
  if (eintraege.length === 0 || summe <= 0) return null
  return (
    <ul className="space-y-2">
      {eintraege.map((e) => (
        <li key={e.gruppe ?? 'ohne'}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className={e.gruppe === null ? 'text-fg-subtle' : 'text-fg'}>
              {e.gruppe ?? 'nicht zugeordnet'}
            </span>
            <span className="text-fg-muted tabular-nums">
              {formatPercent(e.anteil * 100, 1)}
              <span className="text-fg-subtle ml-2">{formatCurrency(e.betrag)}</span>
            </span>
          </div>
          <div className="bg-surface-muted mt-1 h-2 overflow-hidden rounded-full">
            <div
              className={
                e.gruppe === null ? 'bg-border-strong h-full' : 'bg-brand h-full'
              }
              style={{ width: `${Math.max(e.anteil * 100, 0.5)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

/**
 * Ein Ergebnisblock mit sichtbarer Überschrift.
 *
 * `ResultPanel` aus `CalculatorPanels` versteckt seine Überschrift für
 * Vorleseprogramme – richtig bei einem Rechner mit genau einem Ergebnis,
 * hinderlich bei einem mit sieben. Hier braucht jede Aufteilung ihren Namen
 * auf dem Bildschirm, sonst steht da eine Reihe unbeschrifteter Balken.
 */
function Abschnitt({ titel, children }: { titel: string; children: React.ReactNode }) {
  return (
    <section className="fk-card p-5 sm:p-6">
      <h2 className="text-fg text-lg font-semibold">{titel}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

/** Eine Aufteilung als Berichtszeilen – Anteil und Betrag nebeneinander. */
function alsBerichtszeilen(eintraege: Anteil[], summe: number) {
  if (summe <= 0) return []
  return eintraege.map((e) => ({
    bezeichnung: e.gruppe ?? 'nicht zugeordnet',
    wert: `${formatPercent(e.anteil * 100, 1)} · ${formatCurrency(e.betrag)}`,
  }))
}
