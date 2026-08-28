'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'

import { merkeLuecke, meldeTreffer } from '@/components/layout/suchluecken-speicher'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { learnLevelIds, learnLevelMeta } from '@/data/learn/types'
import { searchEntries, type SearchEntry } from '@/lib/search-match'
import {
  artenMitAnzahl,
  filtere,
  filterLohntSich,
  mitDatum,
  stufenMitAnzahl,
  type Suchfilter,
} from '@/lib/such-filter'

/**
 * Suche über alle Inhalte der Website.
 *
 * Sucht vollständig im Browser: Die Website wird statisch ausgeliefert, es gibt
 * keinen Server, der eine Anfrage beantworten könnte. Den Index baut
 * `lib/search.ts` beim Bauen, das Root-Layout reicht ihn durch.
 *
 * Bedienung mit der Tastatur ist der Regelfall, nicht die Ausnahme: Strg+K
 * beziehungsweise Cmd+K öffnet, Pfeiltasten wählen aus, Enter öffnet den
 * Treffer, Escape schließt.
 */
export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [aktiv, setAktiv] = useState(0)
  const [lastOpen, setLastOpen] = useState(open)
  const [index, setIndex] = useState<SearchEntry[] | null>(null)
  const [ladefehler, setLadefehler] = useState(false)
  const eingabe = useRef<HTMLInputElement>(null)
  const liste = useRef<HTMLUListElement>(null)

  const [filter, setFilter] = useState<Suchfilter>({})

  /*
    Erst alles finden, dann filtern, dann kürzen.

    `searchEntries` kürzt sonst auf acht – und dann zählte die Filterleiste
    acht Treffer, obwohl es vierzig gibt. Die Zahl am Knopf wäre eine Zahl
    über den Ausschnitt und nicht über das Ergebnis.
  */
  const alleTreffer = useMemo(
    () => (index ? searchEntries(index, query, Number.POSITIVE_INFINITY) : []),
    [index, query]
  )

  const heute = useMemo(() => new Date().toISOString().slice(0, 10), [])

  const gefiltert = useMemo(
    () => filtere(alleTreffer, filter, heute),
    [alleTreffer, filter, heute]
  )

  const treffer = useMemo(() => gefiltert.slice(0, 8), [gefiltert])

  const arten = useMemo(() => artenMitAnzahl(alleTreffer), [alleTreffer])
  const stufen = useMemo(
    () =>
      stufenMitAnzahl(
        alleTreffer,
        learnLevelIds.map((id) => ({ id, label: learnLevelMeta[id].label }))
      ),
    [alleTreffer]
  )
  const datierte = useMemo(() => mitDatum(alleTreffer), [alleTreffer])
  const zeigeFilter = useMemo(() => filterLohntSich(alleTreffer), [alleTreffer])

  const filterGesetzt =
    filter.art !== undefined ||
    filter.stufe !== undefined ||
    filter.hoechstensTageAlt !== undefined

  /*
    Beim Öffnen die vorherige Eingabe verwerfen.

    Die Anpassung erfolgt während des Renderns statt in einem Effekt – dasselbe
    Muster wie in der Kopfzeile beim Seitenwechsel. In einem Effekt wäre für
    einen Frame noch die alte Suche samt Treffern sichtbar, und React weist
    setState im Effekt zu Recht zurück.
  */
  if (open !== lastOpen) {
    setLastOpen(open)
    if (open) {
      setQuery('')
      setAktiv(0)
      setFilter({})
    }
  }

  // Fokus in das Feld, sonst müsste man nach dem Öffnen erst hineinklicken.
  useEffect(() => {
    if (!open) return
    const timer = setTimeout(() => eingabe.current?.focus(), 20)
    return () => clearTimeout(timer)
  }, [open])

  /*
    Den Index beim ersten Öffnen holen, danach nie wieder.

    Er liegt als eigene Datei vor, statt in den Daten jeder Seite mitzureisen.
    Das spart auf jeder Seite rund 32 KB und kostet einmalig 31 KB – einen
    Abruf, den der Browser anschließend zwischenspeichert.
  */
  useEffect(() => {
    if (!open || index || ladefehler) return

    let abgebrochen = false
    fetch('/suchindex.json')
      .then((antwort) => {
        if (!antwort.ok) throw new Error(String(antwort.status))
        return antwort.json()
      })
      .then((daten: SearchEntry[]) => {
        if (!abgebrochen) setIndex(daten)
      })
      .catch(() => {
        if (!abgebrochen) setLadefehler(true)
      })

    return () => {
      abgebrochen = true
    }
  }, [open, index, ladefehler])

  // Solange die Suche offen ist, darf die Seite dahinter nicht scrollen.
  useEffect(() => {
    if (!open) return
    const vorher = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = vorher
    }
  }, [open])

  // Den ausgewählten Treffer im Blick behalten, auch bei langer Liste.
  useEffect(() => {
    const element = liste.current?.children[aktiv] as HTMLElement | undefined
    element?.scrollIntoView({ block: 'nearest' })
  }, [aktiv])

  /*
    Erfolglose Suchen aufzeichnen – auf diesem Gerät, ohne Übertragung.

    ## Warum nicht bei jedem Tastendruck

    Weil beim Tippen von „nestle“ unterwegs „nes“, „nest“ und „nestl“ erfolglos
    sind. Zwei Vorkehrungen dagegen: Hier wird erst aufgezeichnet, wenn eine
    Eingabe **eine Sekunde lang stehen geblieben** ist – wer weitertippt,
    erzeugt keinen Eintrag. Und findet eine spätere, längere Eingabe doch
    etwas, verschwinden ihre protokollierten Vorsilben wieder; das erledigt
    `meldeTreffer`.

    Ohne die zweite Vorkehrung reichte die erste nicht: Wer beim Tippen kurz
    nachdenkt, hinterlässt sonst genau das Bruchstück im Protokoll, an dem er
    innegehalten hat.
  */
  useEffect(() => {
    if (!open || !index) return
    const eingabe = query.trim()
    if (eingabe === '') return

    const zeit = setTimeout(() => {
      /*
        Gezählt wird gegen `alleTreffer`, nicht gegen die gefilterte Liste.

        Sonst schriebe jeder Filter, der nichts übrig lässt, eine Suchlücke ins
        Protokoll – obwohl die Suche funktioniert hat. Das Protokoll soll
        fehlende Inhalte sammeln, nicht enge Filter.
      */
      if (alleTreffer.length === 0) merkeLuecke(eingabe)
      else meldeTreffer(eingabe)
    }, 1000)
    return () => clearTimeout(zeit)
  }, [open, index, query, alleTreffer.length])

  function oeffnen(entry: SearchEntry) {
    onClose()
    router.push(entry.href)
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
      return
    }
    if (treffer.length === 0) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setAktiv((i) => (i + 1) % treffer.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setAktiv((i) => (i - 1 + treffer.length) % treffer.length)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const ziel = treffer[aktiv]
      if (ziel) oeffnen(ziel)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]"
        >
          {/*
            Die Fläche dahinter schließt beim Klick. Für Tastatur und
            Screenreader ist sie bedeutungslos – dort schließt Escape, und der
            Dialog selbst trägt die Beschriftung.
          */}
          <div
            aria-hidden="true"
            onClick={onClose}
            className="bg-canvas/70 absolute inset-0 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Suche"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            onKeyDown={onKeyDown}
            className="fk-card border-border shadow-lift relative w-full max-w-xl overflow-hidden border"
          >
            <div className="border-border flex items-center gap-3 border-b px-4">
              <Icon name="search" className="text-fg-subtle size-5 shrink-0" />
              <input
                ref={eingabe}
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  // Neue Eingabe, neue Trefferliste – wieder oben anfangen.
                  setAktiv(0)
                  /*
                    Und ohne Filter. Ein Filter aus der vorigen Suche passt
                    fast nie auf die neue und erzeugt dann eine leere Liste,
                    deren Grund oben klein in einer Leiste steht.
                  */
                  setFilter({})
                }}
                placeholder="Thema, Rechner, Kurs oder Meldung suchen"
                aria-label="Suchbegriff"
                aria-controls="suchergebnisse"
                autoComplete="off"
                className="text-fg placeholder:text-fg-subtle w-full bg-transparent py-4 text-base outline-none"
              />
              <button
                type="button"
                onClick={onClose}
                className="fk-btn-ghost size-8 shrink-0 rounded-full p-0"
              >
                <Icon name="close" className="size-4" />
                <span className="sr-only">Suche schließen</span>
              </button>
            </div>

            {/*
              Die Filterleiste zwischen Eingabe und Liste.

              Sie erscheint nur, wenn sie etwas ausrichten kann – bei einer
              einzigen Art wäre jeder Knopf wirkungslos. Und jeder Knopf trägt
              seine Zahl: Was er wegnimmt, steht dran, bevor man klickt.
            */}
            {index && query.trim() !== '' && zeigeFilter && (
              <div className="border-border flex flex-wrap items-center gap-1.5 border-b px-3 py-2">
                <button
                  type="button"
                  onClick={() => setFilter({})}
                  aria-pressed={!filterGesetzt}
                  className={cn(
                    'rounded-full px-2.5 py-1 text-xs font-medium transition',
                    filterGesetzt
                      ? 'text-fg-muted hover:bg-surface-muted'
                      : 'bg-brand text-on-fill'
                  )}
                >
                  Alle <span className="opacity-60">{alleTreffer.length}</span>
                </button>

                {arten.map((art) => (
                  <button
                    key={art.wert}
                    type="button"
                    onClick={() => {
                      setFilter((bisher) => ({
                        ...bisher,
                        art: bisher.art === art.wert ? undefined : art.wert,
                      }))
                      setAktiv(0)
                    }}
                    aria-pressed={filter.art === art.wert}
                    className={cn(
                      'rounded-full px-2.5 py-1 text-xs font-medium transition',
                      filter.art === art.wert
                        ? 'bg-brand text-on-fill'
                        : 'text-fg-muted hover:bg-surface-muted'
                    )}
                  >
                    {art.label} <span className="opacity-60">{art.anzahl}</span>
                  </button>
                ))}

                {/*
                  Die Lernstufe steht nur da, wenn Lernstufen dabei sind – und
                  in der Reihenfolge des Lernwegs, nicht nach Häufigkeit.
                */}
                {stufen.length > 1 &&
                  stufen.map((stufe) => (
                    <button
                      key={stufe.wert}
                      type="button"
                      onClick={() => {
                        setFilter((bisher) => ({
                          ...bisher,
                          stufe: bisher.stufe === stufe.wert ? undefined : stufe.wert,
                        }))
                        setAktiv(0)
                      }}
                      aria-pressed={filter.stufe === stufe.wert}
                      className={cn(
                        'rounded-full border px-2.5 py-1 text-xs font-medium transition',
                        filter.stufe === stufe.wert
                          ? 'border-learn bg-learn text-on-fill'
                          : 'border-border text-fg-muted hover:bg-surface-muted'
                      )}
                    >
                      {stufe.label} <span className="opacity-60">{stufe.anzahl}</span>
                    </button>
                  ))}

                {/*
                  Der Altersfilter greift nur auf datierte Einträge. Ein Kurs
                  ist nicht sieben Tage alt und auch nicht älter – er hat kein
                  Datum. Damit die Streichung keine stille ist, steht die Zahl
                  der datierten Treffer im Knopf.
                */}
                {datierte > 0 && datierte < alleTreffer.length && (
                  <button
                    type="button"
                    onClick={() => {
                      setFilter((bisher) => ({
                        ...bisher,
                        hoechstensTageAlt:
                          bisher.hoechstensTageAlt === undefined ? 7 : undefined,
                      }))
                      setAktiv(0)
                    }}
                    aria-pressed={filter.hoechstensTageAlt !== undefined}
                    title={`${datierte} der ${alleTreffer.length} Treffer haben ein Datum. Die übrigen sind nicht alt – sie haben keines.`}
                    className={cn(
                      'rounded-full border px-2.5 py-1 text-xs font-medium transition',
                      filter.hoechstensTageAlt !== undefined
                        ? 'border-news bg-news text-on-fill'
                        : 'border-border text-fg-muted hover:bg-surface-muted'
                    )}
                  >
                    Letzte 7 Tage <span className="opacity-60">{datierte}</span>
                  </button>
                )}
              </div>
            )}

            {ladefehler ? (
              <p className="text-fg-muted px-4 py-6 text-sm">
                Der Suchindex konnte nicht geladen werden. Über die Navigation oben kommst
                du weiterhin überall hin.
              </p>
            ) : query.trim() === '' ? (
              <p className="text-fg-muted px-4 py-6 text-sm">
                Durchsucht Lernthemen, Rechner, Kurse, Nachrichten und die Seiten der
                Plattform.
              </p>
            ) : !index ? (
              <p className="text-fg-muted px-4 py-6 text-sm">Suche wird geladen …</p>
            ) : treffer.length === 0 ? (
              <div className="px-4 py-6 text-sm">
                {/*
                  Zwei verschiedene Leeren, zwei verschiedene Sätze.

                  „Nichts gefunden" ist falsch, wenn die Suche 40 Treffer hat
                  und der Filter sie wegnimmt. Wer das verwechselt, schickt
                  Leute mit einem funktionierenden Suchbegriff wieder weg.
                */}
                {alleTreffer.length > 0 ? (
                  <p className="text-fg-muted">
                    {alleTreffer.length} Treffer zu{' '}
                    <span className="text-fg font-medium">„{query}“</span>, aber keiner
                    passt zum gewählten Filter.{' '}
                    <button
                      type="button"
                      onClick={() => setFilter({})}
                      className="text-brand underline underline-offset-2"
                    >
                      Filter aufheben
                    </button>
                  </p>
                ) : (
                  <p className="text-fg-muted">
                    Nichts gefunden zu{' '}
                    <span className="text-fg font-medium">„{query}“</span>. Vielleicht
                    hilft ein einzelnes Stichwort statt eines ganzen Satzes.
                  </p>
                )}
                {/*
                  Der Verweis auf das Protokoll gehört hierher und nicht in eine
                  Fußzeile: Hier ist der Moment, in dem jemand merkt, dass etwas
                  fehlt. Dass die Suche mitgeschrieben wird, steht dabei – sonst
                  wäre es heimlich, und heimlich ist es nirgends auf dieser Seite.
                */}
                <p className="text-fg-subtle mt-3 text-xs leading-relaxed">
                  Erfolglose Suchen werden{' '}
                  <strong className="font-semibold">in diesem Browser</strong> notiert und
                  nicht übertragen.{' '}
                  <Link
                    href="/suche/luecken"
                    onClick={onClose}
                    className="text-brand underline underline-offset-2"
                  >
                    Was dabei zusammenkommt, kannst du ansehen
                  </Link>{' '}
                  – und uns schicken, wenn du magst.
                </p>
              </div>
            ) : (
              <ul
                ref={liste}
                id="suchergebnisse"
                className="max-h-[50vh] overflow-y-auto p-2"
              >
                {treffer.map((entry, i) => (
                  <li key={entry.href}>
                    {/*
                      Button statt Verweis: Die Auswahl folgt den Pfeiltasten,
                      und ein Verweis würde bei jedem Tastendruck den Fokus aus
                      dem Eingabefeld ziehen. Die Navigation übernimmt der
                      Router, das Ziel steht in title.
                    */}
                    <button
                      type="button"
                      onClick={() => oeffnen(entry)}
                      onMouseEnter={() => setAktiv(i)}
                      title={entry.href}
                      className={cn(
                        'flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition',
                        i === aktiv ? 'bg-surface-muted' : 'hover:bg-surface-muted'
                      )}
                    >
                      <span className="text-fg-subtle mt-0.5 shrink-0 text-[11px] font-semibold tracking-wide uppercase">
                        {entry.kind}
                      </span>
                      <span className="min-w-0">
                        <span className="text-fg block text-sm font-medium">
                          {entry.title}
                        </span>
                        {entry.hint && (
                          <span className="text-fg-muted line-clamp-1 block text-xs">
                            {entry.hint}
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                ))}
                {/*
                  Der Weg aus dem Dialog auf die Suchseite.

                  Er steht hier und nicht oben: Wer die Trefferliste schon
                  gesehen hat, weiß, ob sich eine Seite mit Adresse lohnt. Und
                  er ist der einzige interne Verweis auf `/suche` – ohne ihn
                  wäre die Seite von der Website aus nicht erreichbar und
                  stünde nur im `sitemap.xml`.
                */}
                <li className="border-border mt-2 border-t px-3 pt-3 pb-1">
                  <Link
                    href={`/suche?q=${encodeURIComponent(query)}`}
                    onClick={onClose}
                    className="text-fg-muted hover:text-brand text-xs underline underline-offset-2"
                  >
                    Als eigene Seite öffnen – zum Weitergeben oder Merken
                  </Link>
                </li>
              </ul>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
