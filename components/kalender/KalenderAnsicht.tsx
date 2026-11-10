'use client'

import Link from 'next/link'
import { useMemo, useState, useSyncExternalStore } from 'react'

import { cn } from '@/lib/cn'
import { anzeigemonat, istVorbei as istVorbeiAm, laeuftNoch } from '@/lib/kalender-zeit'
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
 *
 * ## Warum nach Tagen, und warum die Quartalszahlen als Namensliste
 *
 * Betreiber, 10.11.2026: „im Kalender … sieht das wirklich sehr
 * unübersichtlich aus“. Gemessen am Bau vom 29.10.: 17.460 px am Schirm,
 * 26.478 px am Telefon für zwei Monate. Jede angekündigte Quartalszahl stand
 * als eigener Eintrag mit Art, Datum, Titel, demselben Erklärsatz und vier
 * Verweisen – am 10. November über ein Dutzend japanischer Unternehmen
 * untereinander, die US-Verbraucherpreise dazwischen kaum zu finden. Die
 * Zusammenfassung gab es schon, aber nur für hochgerechnete Termine; die
 * angekündigten aus Tokio und New York liefen einzeln durch.
 *
 * Jetzt steht jeder Tag einmal da. Zuerst kommen die Termine, die den ganzen
 * Markt bewegen – Notenbanken, Konjunkturdaten, Verfallstage, Feiertage,
 * Wahlen – mit ihrem Satz, was sie bedeuten. Darunter die Quartalszahlen des
 * Tages als Liste von Namen, getrennt nach angekündigt, erwartet und
 * hochgerechnet; der Erklärsatz steht einmal.
 */

export interface AnsichtGruppe {
  monat: string
  termine: Termin[]
}

/** Ein Tag in der Liste – oder alles, was gerade läuft (`datum: null`). */
interface Tag {
  schluessel: string
  datum: string | null
  einzeln: Termin[]
  zahlen: Termin[]
}

/** Ein Meldetermin eines einzelnen Unternehmens – kein Zeitraum wie die Berichtssaison. */
function istUnternehmenstermin(termin: Termin): boolean {
  return (
    termin.art === 'berichtssaison' &&
    !termin.bis &&
    /: Quartalszahlen/.test(termin.titel)
  )
}

function zuTagen(termine: readonly Termin[], heute: string | null): Tag[] {
  const tage = new Map<string, Tag>()
  for (const termin of termine) {
    const datum = laeuftNoch(termin, heute) ? null : termin.datum
    const schluessel = datum ?? 'laufend'
    let tag = tage.get(schluessel)
    if (!tag) {
      tag = { schluessel, datum, einzeln: [], zahlen: [] }
      tage.set(schluessel, tag)
    }
    if (istUnternehmenstermin(termin)) tag.zahlen.push(termin)
    else tag.einzeln.push(termin)
  }
  /*
    Innerhalb des Tages nach Uhrzeit: Am 11.11.2026 stand die Lagarde-Rede
    um 10:45 vor den deutschen Verbraucherpreisen um 8:00. Termine ohne
    Uhrzeit (Feiertage, Zeiträume) stehen vorn – sie gelten den ganzen Tag.
  */
  for (const tag of tage.values())
    tag.einzeln.sort((a, b) => uhrzeitwert(a) - uhrzeitwert(b))
  // „Läuft gerade“ zuerst, dann nach Datum.
  return [...tage.values()].sort((a, b) => (a.datum ?? '').localeCompare(b.datum ?? ''))
}

/** Minuten seit Mitternacht aus „14:30 Uhr“; ohne Uhrzeit −1, also vorn. */
function uhrzeitwert(termin: Termin): number {
  const treffer = termin.uhrzeit?.match(/(\d{1,2}):(\d{2})/)
  return treffer ? Number(treffer[1]) * 60 + Number(treffer[2]) : -1
}

type Meldestand = 'angekündigt' | 'erwartet' | 'hochgerechnet'

/**
 * Drei Zustände, wie auf der Aktienseite: angekündigt (das Unternehmen
 * selbst), erwartet (veröffentlichter Terminplan, nicht bestätigt),
 * hochgerechnet (aus dem Meldemuster der Vorjahre).
 */
function meldestand(termin: Termin): Meldestand {
  if (termin.geschaetzt) return 'hochgerechnet'
  return /Quartalszahlen erwartet\s*$/.test(termin.titel) ? 'erwartet' : 'angekündigt'
}

const MELDESTAENDE: { stand: Meldestand; label: string }[] = [
  { stand: 'angekündigt', label: 'Angekündigt' },
  { stand: 'erwartet', label: 'Erwartet laut Terminplan' },
  { stand: 'hochgerechnet', label: 'Hochgerechnet, nicht bestätigt' },
]

export function KalenderAnsicht({
  gruppen,
  artMeta,
  reihenfolge,
  nurAufWunsch,
  anzahl,
  themennamen,
  kursnamen,
}: {
  gruppen: AnsichtGruppe[]
  artMeta: Record<TerminArt, { label: string; erklaerung: string }>
  reihenfolge: TerminArt[]
  /** Arten, die erst auf Wunsch erscheinen – siehe `data/kalender/typen.ts`. */
  nurAufWunsch: TerminArt[]
  anzahl: Record<TerminArt, number>
  /** Slug auf lesbaren Themennamen – sonst stünde „waehrungen wechselkurse“ da. */
  themennamen: Record<string, string>
  /** Kurssymbol auf Ticker, aus demselben Grund. */
  kursnamen: Record<string, string>
}) {
  const [aktiv, setAktiv] = useState<Set<TerminArt>>(new Set())
  const [zeigeVergangenes, setZeigeVergangenes] = useState(false)
  /*
    Zwei Monate offen, der Rest auf Wunsch (29.10.2026, „deutlich gekürzt …
    übersichtlicher"): Alle Monate bis 2027 ergaben 110.242 px auf dem
    Telefon. Wer weiter planen will, klappt auf; das Abo enthält ohnehin alles.
  */
  const [alleMonate, setAlleMonate] = useState(false)

  /*
    Das heutige Datum kommt aus dem Browser, nicht aus dem Build.

    `useSyncExternalStore` ist dafür der vorgesehene Weg: Der dritte Wert ist
    die Fassung für den Server – dort gibt es kein sinnvolles „heute“, also
    `null`. Erst im Browser kommt das echte Datum dazu. Ohne diese Trennung
    erzeugten Server und Browser unterschiedliches HTML.
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

  const istVorbei = (termin: Termin): boolean => istVorbeiAm(termin, heute)

  const gefiltert = useMemo(() => {
    /*
      Erst filtern, dann **neu** nach Monat gruppieren.

      Die Gruppen kommen fertig aus dem Build, und dort gibt es kein „heute“.
      Ein Zeitraum, der am 30. Juli beginnt und am 5. August endet, liegt darin
      also unter „Juli“. Am 1. August ist das falsch – er läuft, und er gehört
      in den laufenden Monat. Weil erst der Browser das Datum kennt, kann diese
      Zuordnung auch erst hier entstehen.
    */
    const umsortiert = new Map<string, Termin[]>()
    for (const gruppe of gruppen) {
      for (const termin of gruppe.termine) {
        /*
          Zwei verschiedene Regeln, und der Unterschied ist der Kern dieses
          Filters. Die gewöhnlichen Arten sind ohne Auswahl alle sichtbar.
          Die Arten aus `nurAufWunsch` erscheinen erst, wenn ihr Schalter an
          ist – bei mehreren Tausend Dividendenterminen wäre die andere
          Voreinstellung ein Kalender, in dem die Zinsentscheide nicht mehr zu
          finden sind.
        */
        if (nurAufWunsch.includes(termin.art) && !aktiv.has(termin.art)) continue
        if (aktiv.size > 0 && !aktiv.has(termin.art)) continue
        if (!zeigeVergangenes && istVorbei(termin)) continue
        const monat = anzeigemonat(termin, heute)
        const liste = umsortiert.get(monat) ?? []
        liste.push(termin)
        umsortiert.set(monat, liste)
      }
    }
    return [...umsortiert.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([monat, termine]) => ({ monat, tage: zuTagen(termine, heute) }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gruppen, aktiv, zeigeVergangenes, heute])

  const vergangene = useMemo(
    () => gruppen.flatMap((g) => g.termine).filter(istVorbei).length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gruppen, heute]
  )

  /*
    „Als Nächstes“ nennt den nächsten Termin, der den ganzen Markt angeht –
    nicht die laufende Berichtssaison und nicht die Quartalszahl eines
    einzelnen Unternehmens, die sonst fast jeden Tag dort stünde.
  */
  const naechster = useMemo(() => {
    if (!heute) return null
    const kommend = gruppen
      .flatMap((g) => g.termine)
      .filter((t) => !istVorbei(t) && !nurAufWunsch.includes(t.art))
    return (
      kommend.find((t) => t.art !== 'berichtssaison' && !laeuftNoch(t, heute)) ??
      kommend[0] ??
      null
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gruppen, heute])

  return (
    <div>
      {naechster && (
        <div className="border-fg border-l-2 py-1 pl-4">
          <p className="text-fg-muted text-sm">Als Nächstes</p>
          <p className="text-fg mt-0.5 text-lg font-semibold">{naechster.titel}</p>
          <p className="text-fg-muted mt-0.5 text-sm">
            {/* Auch hier: erst kennzeichnen, dann datieren. */}
            {naechster.geschaetzt && <span>erwartet am </span>}
            {langesDatum(naechster.datum)}
            {naechster.uhrzeit && ` · ${naechster.uhrzeit}`}
            {naechster.ort && ` · ${naechster.ort}`}
          </p>
        </div>
      )}

      {/* ------------------------------------------------------------ Filter */}
      <fieldset className={naechster ? 'mt-8' : ''}>
        <legend className="text-fg-muted text-sm">Nach Art filtern</legend>
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
                  'rounded-full border px-3.5 py-1.5 text-sm transition-colors',
                  aktiv.has(art)
                    ? 'border-fg bg-fg text-canvas'
                    : 'border-border text-fg-muted hover:text-fg hover:border-border-strong'
                )}
              >
                {nurAufWunsch.includes(art) && !aktiv.has(art) ? '+ ' : ''}
                {artMeta[art].label}{' '}
                <span className="tabular-nums opacity-60">{anzahl[art]}</span>
              </button>
            ))}
          {aktiv.size > 0 && (
            <button
              type="button"
              onClick={() => setAktiv(new Set())}
              className="text-fg-muted hover:text-fg px-2 py-1.5 text-sm underline underline-offset-2"
            >
              Filter aufheben
            </button>
          )}
        </div>
        {vergangene > 0 && (
          <label className="text-fg-muted mt-4 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={zeigeVergangenes}
              onChange={(ereignis) => setZeigeVergangenes(ereignis.target.checked)}
              className="size-4 accent-[var(--c-fg)]"
            />
            Vergangene Termine zeigen ({vergangene})
          </label>
        )}
      </fieldset>

      {/* ------------------------------------------------------------ Liste */}
      {gefiltert.length === 0 ? (
        <p className="text-fg-muted mt-10">
          Zu dieser Auswahl steht nichts an. Filter aufheben, um alles zu sehen.
        </p>
      ) : (
        <div className="mt-12 space-y-14">
          {(alleMonate ? gefiltert : gefiltert.slice(0, OFFENE_MONATE)).map((gruppe) => (
            <section key={gruppe.monat} aria-labelledby={`monat-${gruppe.monat}`}>
              <h2 id={`monat-${gruppe.monat}`} className="text-fg text-2xl font-bold">
                {monatsname(gruppe.monat)}
              </h2>
              <ol className="mt-4">
                {gruppe.tage.map((tag) => (
                  <TagZeile
                    key={tag.schluessel}
                    tag={tag}
                    heute={heute}
                    istVorbei={istVorbei}
                    artMeta={artMeta}
                    themennamen={themennamen}
                    kursnamen={kursnamen}
                  />
                ))}
              </ol>
            </section>
          ))}
          {!alleMonate && gefiltert.length > OFFENE_MONATE && (
            <button
              type="button"
              onClick={() => setAlleMonate(true)}
              className="fk-btn-secondary"
            >
              Weitere {gefiltert.length - OFFENE_MONATE} Monate anzeigen
            </button>
          )}
        </div>
      )}
    </div>
  )
}

/** Wie viele Monate ohne Klick offen stehen. */
const OFFENE_MONATE = 2

function TagZeile({
  tag,
  heute,
  istVorbei,
  artMeta,
  themennamen,
  kursnamen,
}: {
  tag: Tag
  heute: string | null
  istVorbei: (termin: Termin) => boolean
  artMeta: Record<TerminArt, { label: string; erklaerung: string }>
  themennamen: Record<string, string>
  kursnamen: Record<string, string>
}) {
  const alle = [...tag.einzeln, ...tag.zahlen]
  const vorbei = alle.every(istVorbei)
  const istHeute = tag.datum !== null && tag.datum === heute
  return (
    <li
      className={cn(
        'border-border grid gap-x-8 gap-y-3 border-t py-6 sm:grid-cols-[8.5rem_minmax(0,1fr)]',
        vorbei && 'opacity-55'
      )}
    >
      <div>
        {tag.datum ? (
          <>
            <p className="text-fg font-semibold">{tagMitMonat(tag.datum)}</p>
            <p className="text-fg-muted text-sm">
              {istHeute ? 'heute' : wochentag(tag.datum)}
            </p>
          </>
        ) : (
          <p className="text-fg font-semibold">Läuft gerade</p>
        )}
      </div>

      <div className="min-w-0 space-y-6">
        {tag.einzeln.map((termin) => (
          <Eintrag
            key={`${termin.datum}-${termin.titel}`}
            termin={termin}
            heute={heute}
            vorbei={istVorbei(termin)}
            artMeta={artMeta}
            themennamen={themennamen}
            kursnamen={kursnamen}
          />
        ))}
        {tag.zahlen.length > 0 && <Quartalszahlen termine={tag.zahlen} />}
      </div>
    </li>
  )
}

/**
 * Die Quartalszahlen eines Tages: Namen statt Einträge. Jeder Name führt auf
 * die Aktienseite; dort stehen Uhrzeit, Vorjahrestermin und Quelle.
 */
function Quartalszahlen({ termine }: { termine: readonly Termin[] }) {
  return (
    <div>
      <p className="text-fg-muted text-sm">
        Quartalszahlen
        <span className="tabular-nums"> · {termine.length} Unternehmen</span>
      </p>
      <dl className="mt-1.5 space-y-1.5">
        {MELDESTAENDE.map(({ stand, label }) => {
          const liste = termine.filter((t) => meldestand(t) === stand)
          if (liste.length === 0) return null
          return (
            <div key={stand} className="text-sm leading-relaxed">
              <dt className="text-fg-muted inline">{label}: </dt>
              <dd className="inline">
                {liste.map((termin, i) => {
                  const symbol = termin.symbole?.[0]
                  const name = termin.titel.replace(/:\s*Quartalszahlen.*$/, '')
                  return (
                    <span key={`${termin.titel}-${i}`}>
                      {i > 0 && <span className="text-fg-muted"> · </span>}
                      {symbol ? (
                        <Link
                          href={`/maerkte/${symbol}`}
                          className="text-fg hover:text-brand font-medium underline-offset-2 hover:underline"
                        >
                          {name}
                        </Link>
                      ) : (
                        <span className="text-fg font-medium">{name}</span>
                      )}
                      {termin.uhrzeit && (
                        <span className="text-fg-muted">
                          {' '}
                          ({kurzeUhrzeit(termin.uhrzeit)})
                        </span>
                      )}
                    </span>
                  )
                })}
              </dd>
            </div>
          )
        })}
      </dl>
      <p className="text-fg-muted mt-1.5 text-xs">
        Für den Kurs zählt nicht die Zahl, sondern ihre Abweichung von der Erwartung.
      </p>
    </div>
  )
}

function Eintrag({
  termin,
  heute,
  vorbei,
  artMeta,
  themennamen,
  kursnamen,
}: {
  termin: Termin
  heute: string | null
  vorbei: boolean
  artMeta: Record<TerminArt, { label: string; erklaerung: string }>
  themennamen: Record<string, string>
  kursnamen: Record<string, string>
}) {
  const laufend = laeuftNoch(termin, heute)
  return (
    <div>
      <p className="text-fg-muted text-sm">
        {artMeta[termin.art].label}
        {termin.uhrzeit && ` · ${termin.uhrzeit}`}
        {termin.ort && ` · ${termin.ort}`}
        {termin.bis &&
          (laufend
            ? ` · noch bis ${kurzesDatum(termin.bis)}`
            : ` · bis ${kurzesDatum(termin.bis)}`)}
        {/*
          Der Unterschied zwischen bekannt gegeben und hochgerechnet gehört
          an die Stelle, an der jemand den Termin liest – nicht in eine
          Fußnote.
        */}
        {termin.geschaetzt && ' · erwartet, nicht bestätigt'}
        {vorbei && ' · vorbei'}
      </p>
      <h3 className="text-fg mt-0.5 text-base font-semibold">{termin.titel}</h3>
      <p className="text-fg-muted mt-1 text-sm leading-relaxed">{termin.bedeutung}</p>
      {/*
        Prognose und Vorwert, wie die Quelle sie nennt. Ein Ist-Wert steht
        hier nie – der Kalender kündigt an, er meldet nicht.
      */}
      {termin.werte && termin.werte.length > 0 && (
        <ul className="text-fg-muted mt-1.5 space-y-0.5 text-sm">
          {termin.werte.map((wert) => (
            <li key={wert.name}>
              <span className="text-fg">{wert.name}:</span>
              {wert.prognose && ` Prognose ${wert.prognose}`}
              {wert.prognose && wert.vorher && ' ·'}
              {wert.vorher && ` zuvor ${wert.vorher}`}
            </li>
          ))}
        </ul>
      )}

      <p className="text-fg-muted mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs">
        {termin.symbole?.map((symbol) => (
          <Link
            key={symbol}
            href={`/maerkte/${symbol}`}
            className="hover:text-fg underline underline-offset-2"
          >
            {kursnamen[symbol] ?? symbol}
          </Link>
        ))}
        {termin.themen?.map((thema) => (
          <Link
            key={thema}
            href={`/lernen/${thema}`}
            className="hover:text-fg underline underline-offset-2"
          >
            {themennamen[thema] ?? thema}
          </Link>
        ))}
        <a
          href={termin.quelle.url}
          rel="noopener noreferrer nofollow"
          target="_blank"
          className="hover:text-fg underline underline-offset-2"
        >
          Quelle
        </a>
      </p>
    </div>
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

const WOCHENTAGE = [
  'Sonntag',
  'Montag',
  'Dienstag',
  'Mittwoch',
  'Donnerstag',
  'Freitag',
  'Samstag',
]

function monatsname(monat: string): string {
  const [jahr, nummer] = monat.split('-')
  return `${MONATE[Number(nummer) - 1]} ${jahr}`
}

function kurzesDatum(datum: string): string {
  const [, monat, tag] = datum.split('-')
  return `${Number(tag)}. ${MONATE[Number(monat) - 1].slice(0, 3)}.`
}

/** „10. November“ – das Jahr steht in der Monatsüberschrift. */
function tagMitMonat(datum: string): string {
  const [, monat, tag] = datum.split('-')
  return `${Number(tag)}. ${MONATE[Number(monat) - 1]}`
}

/** Aus dem Datum selbst, ohne Zeitzone: Mittag UTC ist überall derselbe Tag. */
function wochentag(datum: string): string {
  return WOCHENTAGE[new Date(`${datum}T12:00:00Z`).getUTCDay()]
}

/** „vor der US-Eröffnung“ → „vorbörslich“; Uhrzeiten bleiben, wie sie sind. */
function kurzeUhrzeit(uhrzeit: string): string {
  if (/vor der US-Er/i.test(uhrzeit)) return 'vorbörslich'
  if (/nach dem US-Schl/i.test(uhrzeit)) return 'nachbörslich'
  return uhrzeit
}

function langesDatum(datum: string): string {
  const [jahr, monat, tag] = datum.split('-')
  return `${Number(tag)}. ${MONATE[Number(monat) - 1]} ${jahr}`
}
