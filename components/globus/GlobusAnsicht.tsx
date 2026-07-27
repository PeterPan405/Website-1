'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

import { Globus, type GlobusLand } from '@/components/globus/Globus'
import { cn } from '@/lib/cn'
import { quantilsgrenzen, stufeFuer } from '@/lib/globus-geometrie'
import { formatNumber } from '@/lib/format'

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
  einwohner?: number
  bipProKopfUsd?: number
  schuldenquote?: { wert: number; zeitraum: string; quelle: string }
  durchschnittsgehalt?: { wert: number; zeitraum: string; quelle: string }
  medianvermoegen?: { wert: number; zeitraum: string; quelle: string }
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

  const waehle = (id: string | null) => {
    setAusgewaehlt(id)
    if (id) setZielId(id)
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div>
        {/* --------------------------------------------------- Kennzahlwahl */}
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
        </fieldset>

        <p className="text-fg-muted mt-3 text-sm leading-relaxed">{metrik.erklaerung}</p>

        <div className="mt-6">
          <Globus
            laender={globusLaender}
            farben={farben}
            ausgewaehlt={ausgewaehlt}
            onAuswahl={waehle}
            onHover={() => {}}
            zielId={zielId}
          />
        </div>

        <Legende
          grenzen={grenzen}
          farben={farben}
          einheit={metrik.einheit}
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
          {land ? (
            <Landtafel land={land} quellen={quellen} weltbankJahr={weltbankJahr} />
          ) : (
            <div className="rounded-card border-border bg-surface-muted border p-5">
              <p className="text-fg-muted text-sm leading-relaxed">
                Ein Land anklicken – oder oben suchen. Der Globus dreht sich dann dorthin
                und zeigt hier, was zu diesem Land hinterlegt ist.
              </p>
              <p className="text-fg-subtle mt-3 text-xs leading-relaxed">
                Ziehen dreht die Kugel, das Mausrad zoomt. Mit der Tastatur: erst
                anwählen, dann Pfeiltasten zum Drehen, Plus und Minus zum Zoomen.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Legende({
  grenzen,
  farben,
  einheit,
  abgedeckt,
  gesamt,
}: {
  grenzen: number[]
  farben: string[]
  einheit: string
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
                ? `unter ${formatNumber(grenzen[0] ?? 0)}`
                : index === farben.length - 1
                  ? `ab ${formatNumber(grenzen[index - 1] ?? 0)}`
                  : `${formatNumber(grenzen[index - 1] ?? 0)}–${formatNumber(grenzen[index] ?? 0)}`}
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

      <p className="text-fg-subtle mt-3 text-xs leading-relaxed">
        Angaben in {einheit}. Die Klassen enthalten jeweils gleich viele Länder, nicht
        gleich große Wertebereiche – sonst läge bei diesen Größenordnungen fast alles in
        der untersten Klasse. Die Farbe zeigt also den Rang, nicht den Abstand.{' '}
        <strong className="text-fg-muted font-semibold">
          {abgedeckt} von {gesamt} Ländern
        </strong>{' '}
        haben für diese Kennzahl einen hinterlegten Wert.
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
      fussnote: `Weltbank, ${weltbankJahr}`,
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
                Ausdrücklich „keine Angabe hinterlegt“ und nicht einfach ein
                Strich oder eine Null. Für Staatsverschuldung, Gehalt und
                Vermögen gibt es keine offene Datei; was hier steht, ist von
                Hand gepflegt und deshalb lückenhaft. Eine Null stünde da wie
                ein Land ohne Schulden.
              */
              <dd className="text-fg-subtle text-sm italic">keine Angabe hinterlegt</dd>
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
