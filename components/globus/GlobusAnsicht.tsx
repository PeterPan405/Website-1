'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { Globus, type GlobusLand } from '@/components/globus/Globus'
import { cn } from '@/lib/cn'
import { quantilsgrenzen, stufeFuer } from '@/lib/globus-geometrie'
import { formatNumber, formatNumberSigned } from '@/lib/format'

/**
 * Der Globus mit allem, was ihn bedienbar macht.
 *
 * Die Zeichenfläche selbst kann nur zeichnen. Alles, was eine Karte erst
 * benutzbar macht – welche Kennzahl gezeigt wird, was die Farben bedeuten, wie
 * viele Länder überhaupt einen Wert haben, und was zu einem angeklickten Land
 * bekannt ist – steht hier drumherum.
 */

/** Was der Browser je Land bekommt. Bewusst schlank gehalten. */
export interface AnsichtLand {
  id: string
  name: string
  region?: string
  waehrung?: string
  bipUsd?: number
  /** Wahr, wenn das BIP aus Einwohnern und Einkommen gebildet wurde. */
  bipUsdGeschaetzt?: boolean
  einwohner?: number
  bipProKopfUsd?: number
  /** Gesetzt, wenn das Gebiet keine ständige Bevölkerung hat. */
  unbewohnt?: string
  schuldenquote?: { wert: number; zeitraum: string; quelle: string }
  durchschnittsgehalt?: { wert: number; zeitraum: string; quelle: string }
  medianvermoegen?: { wert: number; zeitraum: string; quelle: string }
  arbeitslosenquote?: { wert: number; zeitraum: string; quelle: string }
  inflation?: { wert: number; zeitraum: string; quelle: string }
  indizes: Kurs[]
  aktien: Kurs[]
}

interface Kurs {
  symbol: string
  ticker: string
  name: string
  kindLabel: string
  summary: string
  hinweis?: string
}

export interface AnsichtMetrik {
  id: string
  label: string
  erklaerung: string
  einheit: string
  /**
   * Für wie viele Länder ein Wert hinterlegt ist.
   *
   * Bei Gehältern und Vermögen sind es je nach Quelle nur einige Dutzend –
   * die Karte ist dann überwiegend grau. Ohne diese Angabe liest sich das
   * wie ein Defekt, obwohl es die Datenlage ist. Deshalb steht sie neben der
   * Erklärung und nicht in einer Fußnote.
   */
  belegt?: number
}

export interface AnsichtQuelle {
  label: string
  url: string
  abgrenzung: string
}

const FARBEN = [
  '--c-globus-1',
  '--c-globus-2',
  '--c-globus-3',
  '--c-globus-4',
  '--c-globus-5',
]

/**
 * Die Farben für eine bestimmte Zahl von Klassen.
 *
 * `quantilsgrenzen` liefert weniger Grenzen, wenn die Daten nicht mehr
 * hergeben – bei vielen gleichen Werten etwa. Dann müssen auch weniger Farben
 * gezeigt werden, und zwar **gespreizt**: Die oberste Klasse soll den
 * dunkelsten Ton bekommen, sonst wirkt eine dreiklassige Karte blass, als
 * käme keiner ihrer Werte oben an.
 */
function farbenFuer(klassen: number): string[] {
  if (klassen >= FARBEN.length) return FARBEN
  if (klassen <= 1) return [FARBEN[FARBEN.length - 1]]
  return Array.from(
    { length: klassen },
    (_, index) => FARBEN[Math.round((index * (FARBEN.length - 1)) / (klassen - 1))]
  )
}

export function GlobusAnsicht({
  laender,
  metriken,
  quellen,
  weltbankJahr,
}: {
  laender: AnsichtLand[]
  metriken: AnsichtMetrik[]
  quellen: Record<string, AnsichtQuelle>
  weltbankJahr: number
}) {
  const [metrikId, setMetrikId] = useState(metriken[0].id)
  const [ausgewaehlt, setAusgewaehlt] = useState<string | null>(null)
  const [zielId, setZielId] = useState<string | null>(null)
  const [suche, setSuche] = useState('')
  const [vollbild, setVollbild] = useState(false)

  const metrik = metriken.find((eintrag) => eintrag.id === metrikId) ?? metriken[0]

  const wertVon = useMemo(() => {
    return (land: AnsichtLand): number | null => {
      switch (metrikId) {
        case 'bip':
          return land.bipUsd ?? null
        case 'einwohner':
          return land.einwohner ?? null
        case 'bipProKopf':
          return land.bipProKopfUsd ?? null
        case 'schuldenquote':
          return land.schuldenquote?.wert ?? null
        case 'durchschnittsgehalt':
          return land.durchschnittsgehalt?.wert ?? null
        case 'medianvermoegen':
          return land.medianvermoegen?.wert ?? null
        case 'arbeitslosenquote':
          return land.arbeitslosenquote?.wert ?? null
        case 'inflation':
          return land.inflation?.wert ?? null
        case 'kurse':
          return land.indizes.length + land.aktien.length
        default:
          return null
      }
    }
  }, [metrikId])

  const { grenzen, farben, abgedeckt, globusLaender } = useMemo(() => {
    const werte = laender
      .map(wertVon)
      .filter((wert): wert is number => wert !== null && Number.isFinite(wert))
    const grenzen = quantilsgrenzen(werte, FARBEN.length)
    const globusLaender: GlobusLand[] = laender.map((land) => ({
      id: land.id,
      name: land.name,
      stufe: stufeFuer(wertVon(land), grenzen),
    }))
    return {
      grenzen,
      farben: farbenFuer(grenzen.length + 1),
      abgedeckt: werte.length,
      globusLaender,
    }
  }, [laender, wertVon])

  const treffer = useMemo(() => {
    const begriff = suche.trim().toLowerCase()
    if (begriff.length < 2) return []
    return laender.filter((land) => land.name.toLowerCase().includes(begriff)).slice(0, 8)
  }, [laender, suche])

  const land = ausgewaehlt
    ? (laender.find((eintrag) => eintrag.id === ausgewaehlt) ?? null)
    : null

  /*
    Ein Land in der Adresse.

    Die Suche in der Kopfzeile führt auf `/globus#land-360`, und das muss hier
    ankommen: Wer „Indonesien“ eintippt, will das Land sehen, nicht die
    Startansicht mit dem Hinweis, man möge etwas anklicken.

    Warum die Raute und kein Abfrageparameter: Die Seite wird statisch
    ausgeliefert. `useSearchParams` verlangt in Next.js eine Suspense-Grenze und
    macht die Seite zur Laufzeitsache; die Raute liest der Browser ohne
    Zutun – und sie überlebt jede Art von Hosting.

    Zwei Wege führen herein: die erste Anzeige (die Seite wurde mit der Raute
    aufgerufen) und `hashchange` (wir waren schon hier und die Suche hat nur die
    Raute geändert; die Seite lädt dann nicht neu).
  */
  const waehle = useCallback((id: string | null) => {
    setAusgewaehlt(id)
    if (id) setZielId(id)
    if (typeof window === 'undefined') return
    // `replaceState` statt `pushState`: Der Zurückknopf soll die Seite
    // verlassen und nicht durch ein Dutzend angeklickter Länder zurückgehen.
    const ziel = id ? `#land-${id}` : window.location.pathname
    window.history.replaceState(null, '', ziel)
  }, [])

  useEffect(() => {
    const ausAdresse = () => {
      const treffer = /^#land-([a-z0-9-]+)$/i.exec(window.location.hash)
      if (!treffer) return
      const id = treffer[1]
      if (!laender.some((eintrag) => eintrag.id === id)) return
      setAusgewaehlt(id)
      setZielId(id)
    }
    ausAdresse()
    window.addEventListener('hashchange', ausAdresse)
    return () => window.removeEventListener('hashchange', ausAdresse)
  }, [laender])

  /*
    Die Kennzahlwahl – wie die Tafel einmal beschrieben, an zwei Stellen
    gezeigt.

    Im Vollbild gehört sie mit hinein: Ohne sie zeigt der Globus dort für immer
    die Kennzahl, die beim Umschalten eingestellt war. Wer die Karte
    bildschirmfüllend betrachtet, will aber gerade dann zwischen
    Wirtschaftsleistung, Einwohnern und Schulden wechseln können.
  */
  const kennzahlwahl = (
    <fieldset>
      <legend className="text-fg-subtle text-xs font-semibold tracking-wide uppercase">
        Einfärbung nach
      </legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {metriken.map((eintrag) => (
          <button
            key={eintrag.id}
            type="button"
            onClick={() => setMetrikId(eintrag.id)}
            aria-pressed={eintrag.id === metrikId}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
              eintrag.id === metrikId
                ? 'border-brand bg-brand text-brand-contrast'
                : 'border-border text-fg-muted hover:text-fg hover:border-border-strong'
            )}
          >
            {eintrag.label}
          </button>
        ))}
      </div>
      <p className="text-fg-muted mt-3 text-sm leading-relaxed">
        {metrik.erklaerung}
        {metrik.belegt !== undefined && (
          <>
            {' '}
            <span className="text-fg-subtle">
              Hinterlegt für {metrik.belegt} von {laender.length} Ländern und Gebieten
              {metrik.belegt < laender.length / 2 && ' – die übrigen bleiben grau'}.
            </span>
          </>
        )}
      </p>
    </fieldset>
  )

  /*
    Der Inhalt der Tafel – einmal beschrieben, an zwei Stellen gezeigt.

    Normal steht er in der Seitenspalte, im Vollbild im Rahmen des Globus.
    Beides gleichzeitig anzuzeigen hieße, denselben Text zweimal ins Dokument
    zu schreiben; deshalb meldet der Globus den Wechsel, und die Seitenspalte
    tritt so lange ab.
  */
  const tafelInhalt = land ? (
    <Landtafel land={land} quellen={quellen} weltbankJahr={weltbankJahr} />
  ) : (
    <div className="rounded-card border-border bg-surface-muted border p-5">
      <p className="text-fg-muted text-sm leading-relaxed">
        Ein Land anklicken – oder oben suchen. Der Globus dreht sich dann dorthin und
        zeigt hier, was zu diesem Land hinterlegt ist.
      </p>
      <p className="text-fg-subtle mt-3 text-xs leading-relaxed">
        Ziehen dreht die Kugel, das Mausrad zoomt. Mit der Tastatur: erst anwählen, dann
        Pfeiltasten zum Drehen, Plus und Minus zum Zoomen.
      </p>
    </div>
  )

  return (
    /*
      `minmax(0,1fr)` auch in der einspaltigen Ansicht.

      Ohne die Angabe bekommt die einzige Rasterspalte die Breite `auto`, und
      das heißt: so breit wie ihr Inhalt. Die Zeichenfläche des Globus trägt
      ihre Breite als Pixelwert – auf dem Handy hat sie die Spalte damit über
      die Fensterbreite hinausgezogen, und zu sehen war nur die linke Hälfte.
    */
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="min-w-0">
        {/* --------------------------------------------------- Kennzahlwahl */}
        {vollbild ? null : kennzahlwahl}

        <div className={cn(vollbild ? '' : 'mt-6')}>
          <Globus
            laender={globusLaender}
            farben={farben}
            ausgewaehlt={ausgewaehlt}
            onAuswahl={waehle}
            onHover={() => {}}
            zielId={zielId}
            werkzeuge={kennzahlwahl}
            tafel={tafelInhalt}
            onVollbild={setVollbild}
          />
        </div>

        <Legende
          grenzen={grenzen}
          farben={farben}
          einheit={metrik.einheit}
          metrikId={metrikId}
          abgedeckt={abgedeckt}
          gesamt={laender.length}
        />
      </div>

      {/* ------------------------------------------------------ Seitenspalte */}
      <div className="space-y-6">
        <div>
          <label
            htmlFor="globus-suche"
            className="text-fg-subtle text-xs font-semibold tracking-wide uppercase"
          >
            Land suchen
          </label>
          <input
            id="globus-suche"
            type="search"
            value={suche}
            onChange={(ereignis) => setSuche(ereignis.target.value)}
            placeholder="z. B. Japan"
            autoComplete="off"
            className="border-border bg-surface text-fg placeholder:text-fg-subtle focus-visible:ring-ring/60 mt-2 w-full rounded-lg border px-3 py-2 text-sm outline-none focus-visible:ring-2"
          />
          {treffer.length > 0 && (
            <ul className="border-border bg-surface mt-2 overflow-hidden rounded-lg border">
              {treffer.map((eintrag) => (
                <li key={eintrag.id}>
                  <button
                    type="button"
                    onClick={() => {
                      waehle(eintrag.id)
                      setSuche('')
                    }}
                    className="text-fg hover:bg-surface-muted block w-full px-3 py-2 text-left text-sm"
                  >
                    {eintrag.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/*
          Die Tafel meldet sich an.

          Die Auswahl passiert auf einer Zeichenfläche, von der ein Screenreader
          nichts mitbekommt. Ohne `aria-live` bliebe ein Klick auf ein Land für
          ihn folgenlos – der Inhalt änderte sich lautlos irgendwo auf der Seite.
        */}
        <div id="globus-landtafel" aria-live="polite">
          {vollbild ? null : tafelInhalt}
        </div>
      </div>
    </div>
  )
}

/**
 * Eine Klassengrenze so beschriften, wie sie in der Detailtafel stünde.
 *
 * Das Bruttoinlandsprodukt liegt in **Millionen** US-Dollar vor. Die Tafel
 * rechnet das um und schreibt „382 Mrd. US-$“; die Legende schrieb bis eben die
 * rohe Zahl unter die Überschrift „Angaben in US-Dollar“. Da stand dann „unter
 * 263“ für Volkswirtschaften unter 263 Millionen – und „ab 330.858“ für alles
 * ab 331 Milliarden. Beides um den Faktor eine Million daneben, ohne dass man
 * es der Zahl ansieht.
 *
 * Die übrigen Kennzahlen stehen in ihrer eigenen Einheit und brauchen nichts.
 *
 * ## Raten brauchen eine Nachkommastelle
 *
 * Arbeitslosenquote und Inflation liegen zwischen etwa −2 und 30. Ohne
 * Nachkommastelle fielen die Klassengrenzen zusammen: Aus 2,3 · 2,9 · 3,4 · 4,1
 * würde „2 · 3 · 3 · 4“, und zwei benachbarte Klassen sähen aus, als hätten sie
 * dieselbe Grenze. Bei Beträgen in Dollar oder Personen spielt die Stelle
 * keine Rolle, hier ist sie der Unterschied.
 */
const RATENMETRIKEN = new Set(['arbeitslosenquote', 'inflation', 'schuldenquote'])

function grenzenbeschriftung(wert: number, metrikId: string): string {
  if (RATENMETRIKEN.has(metrikId)) return formatNumber(wert, 1)
  if (metrikId !== 'bip') return formatNumber(wert)
  // Unterhalb einer Milliarde bliebe von „0,3 Mrd.“ nach dem Runden nichts.
  return wert >= 1000 ? `${formatNumber(wert / 1000)} Mrd.` : `${formatNumber(wert)} Mio.`
}

function Legende({
  grenzen,
  farben,
  einheit,
  metrikId,
  abgedeckt,
  gesamt,
}: {
  grenzen: number[]
  farben: string[]
  einheit: string
  metrikId: string
  abgedeckt: number
  gesamt: number
}) {
  /*
    Die Beschriftung folgt den tatsächlichen Grenzen, nicht der Farbzahl.

    Gibt es weniger Grenzen, gibt es weniger Klassen – eine Legende mit fünf
    Feldern über einer dreiklassigen Karte würde zwei Farben zeigen, die auf
    der Kugel nirgends vorkommen.
  */
  return (
    <div className="border-border mt-6 border-t pt-5">
      <div className="flex flex-wrap items-center gap-x-1 gap-y-2">
        {farben.map((farbe, index) => (
          <div key={farbe} className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="size-4 rounded"
              style={{ backgroundColor: `var(${farbe})` }}
            />
            <span className="text-fg-subtle text-xs tabular-nums">
              {index === 0
                ? `unter ${grenzenbeschriftung(grenzen[0] ?? 0, metrikId)}`
                : index === farben.length - 1
                  ? `ab ${grenzenbeschriftung(grenzen[index - 1] ?? 0, metrikId)}`
                  : `${grenzenbeschriftung(grenzen[index - 1] ?? 0, metrikId)}–${grenzenbeschriftung(grenzen[index] ?? 0, metrikId)}`}
            </span>
          </div>
        ))}
        <div className="ml-2 flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="size-4 rounded"
            style={{ backgroundColor: 'var(--c-globus-leer)' }}
          />
          <span className="text-fg-subtle text-xs">keine Angabe</span>
        </div>
      </div>

      {/* Knapp gehalten: Die ausführliche Erklärung steht einmal unter der
          Karte und muss nicht bei jeder Kennzahl wiederholt werden. */}
      <p className="text-fg-subtle mt-3 text-xs leading-relaxed">
        Angaben in {einheit} · {abgedeckt} von {gesamt} Ländern und Gebieten mit Wert
      </p>
    </div>
  )
}

function Landtafel({
  land,
  quellen,
  weltbankJahr,
}: {
  land: AnsichtLand
  quellen: Record<string, AnsichtQuelle>
  weltbankJahr: number
}) {
  const zeilen: {
    label: string
    wert: string | null
    fussnote?: string
  }[] = [
    {
      label: 'Bruttoinlandsprodukt',
      wert: land.bipUsd ? `${formatNumber(land.bipUsd / 1000)} Mrd. US-$` : null,
      fussnote: land.bipUsdGeschaetzt
        ? `gerechnet aus Einwohnern und Einkommen, ${weltbankJahr}`
        : `Weltbank, ${weltbankJahr}`,
    },
    {
      label: 'Einwohner',
      wert: land.einwohner ? formatNumber(land.einwohner) : null,
      fussnote: `Weltbank, ${weltbankJahr}`,
    },
    {
      label: 'BIP pro Kopf',
      wert: land.bipProKopfUsd ? `${formatNumber(land.bipProKopfUsd)} US-$` : null,
      fussnote: `gerechnet aus beidem, ${weltbankJahr}`,
    },
    {
      label: 'Staatsverschuldung',
      wert: land.schuldenquote
        ? `${formatNumber(land.schuldenquote.wert, 1)} % des BIP`
        : null,
      fussnote: land.schuldenquote
        ? `${quellen[land.schuldenquote.quelle]?.label ?? land.schuldenquote.quelle}, ${land.schuldenquote.zeitraum}`
        : undefined,
    },
    {
      label: 'Durchschnittsgehalt',
      wert: land.durchschnittsgehalt
        ? `${formatNumber(land.durchschnittsgehalt.wert)} US-$ im Jahr`
        : null,
      fussnote: land.durchschnittsgehalt
        ? `${quellen[land.durchschnittsgehalt.quelle]?.label ?? ''}, ${land.durchschnittsgehalt.zeitraum}`
        : undefined,
    },
    {
      label: 'Medianvermögen',
      wert: land.medianvermoegen
        ? `${formatNumber(land.medianvermoegen.wert)} US-$ je Erwachsenem`
        : null,
      fussnote: land.medianvermoegen
        ? `${quellen[land.medianvermoegen.quelle]?.label ?? ''}, ${land.medianvermoegen.zeitraum}`
        : undefined,
    },
    {
      label: 'Arbeitslosenquote',
      wert: land.arbeitslosenquote
        ? `${formatNumber(land.arbeitslosenquote.wert, 1)} % der Erwerbspersonen`
        : null,
      fussnote: land.arbeitslosenquote
        ? `${quellen[land.arbeitslosenquote.quelle]?.label ?? ''}, ${land.arbeitslosenquote.zeitraum}`
        : undefined,
    },
    {
      /*
        Das Jahr in der Fußnote ist hier keine Formsache, sondern die
        Hauptsache: Eine Inflationsrate ohne Bezugsjahr ist wertlos, und die
        Reihe hinkt dem laufenden Jahr immer hinterher.

        Das Vorzeichen wird ausgeschrieben – bei fallenden Preisen ist es die
        ganze Aussage, und ein übersehenes Minus dreht sie um.
      */
      label: 'Inflation',
      wert: land.inflation
        ? `${formatNumberSigned(land.inflation.wert, 1)} % gegenüber Vorjahr`
        : null,
      fussnote: land.inflation
        ? `${quellen[land.inflation.quelle]?.label ?? ''}, ${land.inflation.zeitraum}`
        : undefined,
    },
  ]

  return (
    <div className="rounded-card border-border bg-surface border p-5">
      {/*
        Ebene 2, obwohl es optisch eine Kartenüberschrift ist.

        Die Tafel steht im Dokument vor den erklärenden Abschnitten der Seite.
        Ein h3 an dieser Stelle ergäbe die Folge h1 → h3 → h2 – für alle, die
        sich per Überschriftenliste bewegen, ein Sprung ins Leere.
      */}
      <h2 className="text-fg text-lg font-bold">{land.name}</h2>
      {(land.region || land.waehrung) && (
        <p className="text-fg-subtle mt-0.5 text-xs">
          {[land.region, land.waehrung].filter(Boolean).join(' · ')}
        </p>
      )}

      <dl className="mt-4 space-y-3">
        {zeilen.map((zeile) => (
          <div key={zeile.label}>
            <dt className="text-fg-subtle text-xs">{zeile.label}</dt>
            {zeile.wert ? (
              <>
                <dd className="text-fg text-sm font-semibold tabular-nums">
                  {zeile.wert}
                </dd>
                {zeile.fussnote && (
                  <dd className="text-fg-subtle mt-0.5 text-[0.6875rem] leading-snug">
                    {zeile.fussnote}
                  </dd>
                )}
              </>
            ) : (
              /*
                Zwei Fälle, die nicht dasselbe sind.

                „Keine Angabe hinterlegt“ heißt: Die Zahl gibt es, sie steht nur
                nirgends, wo wir sie holen könnten. Ausdrücklich nicht ein Strich
                oder eine Null – eine Null stünde da wie ein Land ohne Schulden.

                Bei einem unbewohnten Gebiet stimmt dieser Satz aber nicht. Für
                den Siachen-Gletscher hat niemand versäumt, ein
                Durchschnittsgehalt zu erheben; es gibt dort niemanden, der eines
                verdient. Das ist keine Lücke, sondern eine Eigenschaft.
              */
              <dd className="text-fg-subtle text-sm italic">
                {land.unbewohnt ? 'ohne ständige Bevölkerung' : 'keine Angabe hinterlegt'}
              </dd>
            )}
          </div>
        ))}
      </dl>

      {(land.indizes.length > 0 || land.aktien.length > 0) && (
        <div className="border-border mt-5 border-t pt-4">
          <p className="text-fg-subtle text-xs font-semibold tracking-wide uppercase">
            Kurse von hier
          </p>
          <ul className="mt-3 space-y-2">
            {[...land.indizes, ...land.aktien].map((kurs) => (
              <li key={kurs.symbol}>
                <Link
                  href={`/maerkte/${kurs.symbol}`}
                  className="group flex items-baseline justify-between gap-3"
                >
                  <span className="text-fg group-hover:text-brand text-sm font-medium">
                    {kurs.name}
                  </span>
                  <span className="text-fg-subtle shrink-0 text-[0.6875rem]">
                    {kurs.kindLabel}
                  </span>
                </Link>
                {kurs.hinweis && (
                  <p className="text-fg-subtle mt-0.5 text-[0.6875rem] leading-snug">
                    {kurs.hinweis}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
