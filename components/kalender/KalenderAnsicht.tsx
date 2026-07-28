'use client'

import Link from 'next/link'
import { useMemo, useState, useSyncExternalStore } from 'react'

import { cn } from '@/lib/cn'
import type { Termin, TerminArt } from '@/data/kalender/typen'

/**
 * Der Börsenkalender mit Filtern und Vergangenheitsmarkierung.
 *
 * ## Warum „heute“ erst im Browser entsteht
 *
 * Die Seite wird statisch gebaut. Würde der Server entscheiden, was ein
 * kommender Termin ist, wäre „heute“ der Tag des letzten Builds – nach zwei
 * Wochen ohne Neubau stünden abgelaufene Zinsentscheide unter „steht an“. Der
 * Server liefert deshalb alle Termine, und erst der Browser markiert mit dem
 * echten Datum, was vorbei ist.
 *
 * Bis das JavaScript läuft, ist der vollständige Kalender bereits lesbar –
 * ohne Markierung, aber vollständig. Das ist die richtige Reihenfolge: erst
 * der Inhalt, dann die Einordnung.
 */

const ARTFARBEN: Record<TerminArt, string> = {
  notenbank: 'bg-brand-soft text-brand',
  berichtssaison: 'bg-markets-soft text-markets',
  verfallstag: 'bg-warning-soft text-warning',
  boersenfeiertag: 'bg-tools-soft text-tools',
  wahl: 'bg-debt-soft text-debt',
  konjunktur: 'bg-news-soft text-news',
}

export interface AnsichtGruppe {
  monat: string
  termine: Termin[]
}

/**
 * Eine Zeile in der Liste – entweder ein Termin oder ein ganzer Meldetag.
 *
 * Die erwarteten Quartalszahlen sind der Grund für diese Unterscheidung. Sie
 * ballen sich: Am 29. Oktober 2026 melden fünfzehn der hier geführten
 * Unternehmen am selben Tag. Fünfzehn Zeilen mit demselben Erklärungstext
 * untereinander verdrängen den Zinsentscheid daneben, ohne einen Gedanken mehr
 * zu transportieren.
 *
 * Zusammengefasst steht der Tag einmal da, die Erklärung einmal, und die
 * Unternehmen als Liste von Links – dieselbe Information auf einem Bruchteil
 * der Fläche.
 */
type Zeile =
  | { schluessel: string; sammel: false; termin: Termin }
  | { schluessel: string; sammel: true; datum: string; termine: Termin[] }

/**
 * Fasst erwartete Quartalszahlen desselben Tages zusammen.
 *
 * Zusammengefasst wird erst ab zwei Unternehmen: Ein einzelner Meldetag ist
 * als vollständige Zeile besser aufgehoben – dort steht dann auch der
 * Vorjahrestermin, aus dem die Erwartung stammt.
 */
function zuZeilen(termine: readonly Termin[]): Zeile[] {
  const zeilen: Zeile[] = []
  const sammelstellen = new Map<string, Extract<Zeile, { sammel: true }>>()

  for (const termin of termine) {
    if (!termin.geschaetzt || termin.art !== 'berichtssaison') {
      zeilen.push({
        schluessel: `${termin.datum}-${termin.titel}`,
        sammel: false,
        termin,
      })
      continue
    }

    const vorhanden = sammelstellen.get(termin.datum)
    if (vorhanden) {
      vorhanden.termine.push(termin)
      continue
    }

    const neu: Extract<Zeile, { sammel: true }> = {
      schluessel: `sammel-${termin.datum}`,
      sammel: true,
      datum: termin.datum,
      termine: [termin],
    }
    sammelstellen.set(termin.datum, neu)
    zeilen.push(neu)
  }

  // Aus Sammelstellen mit nur einem Unternehmen wird wieder eine normale Zeile.
  return zeilen.map((zeile) =>
    zeile.sammel && zeile.termine.length === 1
      ? {
          schluessel: `${zeile.termine[0].datum}-${zeile.termine[0].titel}`,
          sammel: false,
          termin: zeile.termine[0],
        }
      : zeile
  )
}

export function KalenderAnsicht({
  gruppen,
  artMeta,
  reihenfolge,
  anzahl,
  themennamen,
  kursnamen,
}: {
  gruppen: AnsichtGruppe[]
  artMeta: Record<TerminArt, { label: string; erklaerung: string }>
  reihenfolge: TerminArt[]
  anzahl: Record<TerminArt, number>
  /** Slug auf lesbaren Themennamen – sonst stünde „waehrungen wechselkurse“ da. */
  themennamen: Record<string, string>
  /** Kurssymbol auf Ticker, aus demselben Grund. */
  kursnamen: Record<string, string>
}) {
  const [aktiv, setAktiv] = useState<Set<TerminArt>>(new Set())
  const [zeigeVergangenes, setZeigeVergangenes] = useState(false)

  /*
    Das heutige Datum kommt aus dem Browser, nicht aus dem Build.

    `useSyncExternalStore` ist dafür der vorgesehene Weg: Der dritte Wert ist
    die Fassung für den Server – dort gibt es kein sinnvolles „heute“, also
    `null`. Erst im Browser kommt das echte Datum dazu. Ohne diese Trennung
    erzeugten Server und Browser unterschiedliches HTML.

    Das Abonnement bleibt leer, weil sich der Tag während einer Sitzung nicht
    ändert; wer über Mitternacht auf der Seite bleibt, sieht den Wechsel beim
    nächsten Laden.
  */
  const heute = useSyncExternalStore(
    () => () => {},
    () => new Date().toISOString().slice(0, 10),
    () => null
  )

  const umschalten = (art: TerminArt) => {
    setAktiv((vorher) => {
      const neu = new Set(vorher)
      if (neu.has(art)) neu.delete(art)
      else neu.add(art)
      return neu
    })
  }

  const istVorbei = (termin: Termin): boolean => {
    if (!heute) return false
    // Ein Zeitraum ist erst vorbei, wenn auch sein Ende vorbei ist.
    return (termin.bis ?? termin.datum) < heute
  }

  const gefiltert = useMemo(() => {
    return gruppen
      .map((gruppe) => ({
        monat: gruppe.monat,
        zeilen: zuZeilen(
          gruppe.termine.filter((termin) => {
            if (aktiv.size > 0 && !aktiv.has(termin.art)) return false
            if (!zeigeVergangenes && istVorbei(termin)) return false
            return true
          })
        ),
      }))
      .filter((gruppe) => gruppe.zeilen.length > 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gruppen, aktiv, zeigeVergangenes, heute])

  const vergangene = useMemo(
    () => gruppen.flatMap((g) => g.termine).filter(istVorbei).length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gruppen, heute]
  )

  const naechster = useMemo(() => {
    if (!heute) return null
    return gruppen.flatMap((g) => g.termine).find((termin) => !istVorbei(termin)) ?? null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gruppen, heute])

  return (
    <div>
      {naechster && (
        <div className="rounded-card border-brand/30 bg-brand-soft border p-5">
          <p className="text-brand text-xs font-semibold tracking-wide uppercase">
            Als Nächstes
          </p>
          <p className="text-fg mt-1.5 text-lg font-bold">{naechster.titel}</p>
          <p className="text-fg-muted mt-1 text-sm">
            {/* Auch hier: erst kennzeichnen, dann datieren. Der hervorgehobene
                Kasten ist die Stelle, an der eine Hochrechnung am ehesten für
                eine Tatsache gehalten würde. */}
            {naechster.geschaetzt && (
              <span className="text-fg-subtle">erwartet um den </span>
            )}
            {langesDatum(naechster.datum)}
            {naechster.uhrzeit && ` · ${naechster.uhrzeit}`}
            {naechster.ort && ` · ${naechster.ort}`}
          </p>
        </div>
      )}

      {/* ------------------------------------------------------------ Filter */}
      <fieldset className={naechster ? 'mt-8' : ''}>
        <legend className="text-fg-subtle text-xs font-semibold tracking-wide uppercase">
          Nach Art filtern
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {/* Arten ohne Termine bekommen keinen Schalter: Ein Filter, der
              garantiert nichts findet, ist eine Sackgasse. */}
          {reihenfolge
            .filter((art) => anzahl[art] > 0)
            .map((art) => (
              <button
                key={art}
                type="button"
                onClick={() => umschalten(art)}
                aria-pressed={aktiv.has(art)}
                className={cn(
                  'rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
                  aktiv.has(art)
                    ? 'border-brand bg-brand text-brand-contrast'
                    : 'border-border text-fg-muted hover:text-fg hover:border-border-strong'
                )}
              >
                {artMeta[art].label}{' '}
                <span className="tabular-nums opacity-60">{anzahl[art]}</span>
              </button>
            ))}
          {aktiv.size > 0 && (
            <button
              type="button"
              onClick={() => setAktiv(new Set())}
              className="text-fg-subtle hover:text-fg px-2 py-1.5 text-sm underline underline-offset-2"
            >
              Filter aufheben
            </button>
          )}
        </div>
      </fieldset>

      {vergangene > 0 && (
        <label className="text-fg-muted mt-4 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={zeigeVergangenes}
            onChange={(ereignis) => setZeigeVergangenes(ereignis.target.checked)}
            className="accent-brand size-4"
          />
          {vergangene} bereits vergangene Termine mit anzeigen
        </label>
      )}

      {/* ------------------------------------------------------------ Liste */}
      {gefiltert.length === 0 ? (
        <p className="text-fg-muted mt-10">
          Zu dieser Auswahl steht nichts an. Filter aufheben, um alles zu sehen.
        </p>
      ) : (
        <div className="mt-10 space-y-12">
          {gefiltert.map((gruppe) => (
            <section key={gruppe.monat} aria-labelledby={`monat-${gruppe.monat}`}>
              <h2
                id={`monat-${gruppe.monat}`}
                className="border-border text-fg border-b pb-2 text-lg font-bold"
              >
                {monatsname(gruppe.monat)}
              </h2>
              <ul className="mt-5 space-y-5">
                {gruppe.zeilen.map((zeile) =>
                  zeile.sammel ? (
                    <li
                      key={zeile.schluessel}
                      className={cn(
                        'grid gap-x-5 gap-y-2 sm:grid-cols-[7.5rem_minmax(0,1fr)]',
                        istVorbei(zeile.termine[0]) && 'opacity-55'
                      )}
                    >
                      <div className="sm:text-right">
                        <p className="text-fg text-sm font-semibold tabular-nums">
                          <span className="text-fg-subtle font-normal">um den </span>
                          {kurzesDatum(zeile.datum)}
                        </p>
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={cn(
                              'rounded-full px-2 py-0.5 text-[0.6875rem] font-semibold',
                              ARTFARBEN.berichtssaison
                            )}
                          >
                            {artMeta.berichtssaison.label}
                          </span>
                          <span className="border-border text-fg-subtle rounded-full border border-dashed px-2 py-0.5 text-[0.6875rem] font-medium">
                            erwartet, nicht bestätigt
                          </span>
                          {istVorbei(zeile.termine[0]) && (
                            <span className="text-fg-subtle text-xs">vorbei</span>
                          )}
                        </div>

                        <h3 className="text-fg mt-1.5 font-semibold">
                          {zeile.termine.length} Unternehmen melden Quartalszahlen
                        </h3>
                        <p className="text-fg-muted mt-1 text-sm leading-relaxed">
                          Abgeleitet aus dem Meldemuster der vergangenen Jahre. Den
                          genauen Tag geben die Unternehmen wenige Wochen vorher selbst
                          bekannt. Für den Kurs zählt ohnehin nicht die Zahl, sondern ihre
                          Abweichung von der Erwartung.
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                          {zeile.termine.map((termin) => {
                            const symbol = termin.symbole?.[0]
                            if (!symbol) return null
                            return (
                              <Link
                                key={symbol}
                                href={`/maerkte/${symbol}`}
                                className="text-brand text-xs underline underline-offset-2"
                              >
                                {termin.titel.replace(': Quartalszahlen erwartet', '')}
                              </Link>
                            )
                          })}
                          <a
                            href={zeile.termine[0].quelle.url}
                            rel="noopener noreferrer nofollow"
                            target="_blank"
                            className="text-fg-subtle hover:text-fg text-xs underline underline-offset-2"
                          >
                            Quelle
                          </a>
                        </div>
                      </div>
                    </li>
                  ) : (
                    <ZeileEinzeln
                      key={zeile.schluessel}
                      termin={zeile.termin}
                      vorbei={istVorbei(zeile.termin)}
                      artMeta={artMeta}
                      themennamen={themennamen}
                      kursnamen={kursnamen}
                    />
                  )
                )}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

function ZeileEinzeln({
  termin,
  vorbei,
  artMeta,
  themennamen,
  kursnamen,
}: {
  termin: Termin
  vorbei: boolean
  artMeta: Record<TerminArt, { label: string; erklaerung: string }>
  themennamen: Record<string, string>
  kursnamen: Record<string, string>
}) {
  return (
    <li
      className={cn(
        'grid gap-x-5 gap-y-2 sm:grid-cols-[7.5rem_minmax(0,1fr)]',
        vorbei && 'opacity-55'
      )}
    >
      <div className="sm:text-right">
        <p className="text-fg text-sm font-semibold tabular-nums">
          {termin.geschaetzt && (
            <span className="text-fg-subtle font-normal">um den </span>
          )}
          {kurzesDatum(termin.datum)}
          {termin.bis && (
            <>
              <span className="text-fg-subtle"> bis </span>
              {kurzesDatum(termin.bis)}
            </>
          )}
        </p>
        {termin.uhrzeit && (
          <p className="text-fg-subtle mt-0.5 text-xs">{termin.uhrzeit}</p>
        )}
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-[0.6875rem] font-semibold',
              ARTFARBEN[termin.art]
            )}
          >
            {artMeta[termin.art].label}
          </span>
          {termin.ort && <span className="text-fg-subtle text-xs">{termin.ort}</span>}
          {/*
            Der Unterschied zwischen bekannt gegeben und hochgerechnet gehört
            an die Stelle, an der jemand den Termin liest – nicht in eine
            Fußnote. Wer danach eine Order legt, muss es sehen, ohne zu
            scrollen.
          */}
          {termin.geschaetzt && (
            <span className="border-border text-fg-subtle rounded-full border border-dashed px-2 py-0.5 text-[0.6875rem] font-medium">
              erwartet, nicht bestätigt
            </span>
          )}
          {vorbei && <span className="text-fg-subtle text-xs">vorbei</span>}
        </div>

        <h3 className="text-fg mt-1.5 font-semibold">{termin.titel}</h3>
        <p className="text-fg-muted mt-1 text-sm leading-relaxed">{termin.bedeutung}</p>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
          {termin.symbole?.map((symbol) => (
            <Link
              key={symbol}
              href={`/maerkte/${symbol}`}
              className="text-brand text-xs underline underline-offset-2"
            >
              {kursnamen[symbol] ?? symbol}
            </Link>
          ))}
          {termin.themen?.map((thema) => (
            <Link
              key={thema}
              href={`/lernen/${thema}`}
              className="text-fg-subtle hover:text-fg text-xs underline underline-offset-2"
            >
              {themennamen[thema] ?? thema}
            </Link>
          ))}
          <a
            href={termin.quelle.url}
            rel="noopener noreferrer nofollow"
            target="_blank"
            className="text-fg-subtle hover:text-fg text-xs underline underline-offset-2"
          >
            Quelle
          </a>
        </div>
      </div>
    </li>
  )
}

const MONATE = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
]

function monatsname(monat: string): string {
  const [jahr, nummer] = monat.split('-')
  return `${MONATE[Number(nummer) - 1]} ${jahr}`
}

function kurzesDatum(datum: string): string {
  const [, monat, tag] = datum.split('-')
  return `${Number(tag)}. ${MONATE[Number(monat) - 1].slice(0, 3)}.`
}

function langesDatum(datum: string): string {
  const [jahr, monat, tag] = datum.split('-')
  return `${Number(tag)}. ${MONATE[Number(monat) - 1]} ${jahr}`
}
