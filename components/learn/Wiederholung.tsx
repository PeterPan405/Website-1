'use client'

import Link from 'next/link'
import { useCallback, useId, useRef, useState } from 'react'

import {
  leseKarten,
  setzeWiederholungZurueck,
  speichereKarte,
  useKarten,
} from '@/components/learn/wiederholung-speicher'
import { Callout } from '@/components/ui/Callout'
import { Icon } from '@/components/ui/Icon'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Stat, StatGrid } from '@/components/ui/Stat'
import type { Bestandsfrage } from '@/lib/fragenbestand'
import { cn } from '@/lib/cn'
import { formatDate, formatPercent } from '@/lib/format'
import {
  ABSTAENDE,
  HOECHSTES_FACH,
  beantworte,
  neueKarte,
  runde,
  stand,
  type Karte,
} from '@/lib/wiederholung'

/**
 * Die Übungsrunde der verteilten Wiederholung.
 *
 * ## Was hier passiert und was nicht
 *
 * Die Rechnung – welches Fach, wann wieder fällig – steht in
 * `lib/wiederholung.ts` und ist ohne Browser geprüft. Diese Datei ist
 * Oberfläche: Fragen holen, anzeigen, Antwort entgegennehmen, das Ergebnis in
 * den Speicher geben.
 *
 * ## Warum die Fragen nachgeladen werden
 *
 * 408 Fragen sind rund 250 KB. In dieses Bündel importiert, bezahlte sie
 * jeder, der die Seite öffnet – auch wer nur nachsehen will, wann das nächste
 * Mal etwas fällig ist. Geladen wird deshalb erst beim Start einer Runde.
 */

/** Wie viele Karten eine Runde umfasst. */
const RUNDENLAENGE = 12

type Ladezustand = 'ruht' | 'laedt' | 'bereit' | 'fehler'

interface Antwortstand {
  /** Index der bestätigten Antwort, oder null solange nicht bestätigt. */
  bestaetigt: number | null
  gewaehlt: number | null
}

export function Wiederholung() {
  const gruppe = useId()
  const karten = useKarten()

  const [bestand, setBestand] = useState<Bestandsfrage[] | null>(null)
  const [zustand, setZustand] = useState<Ladezustand>('ruht')
  const [laufend, setLaufend] = useState<Bestandsfrage[] | null>(null)
  const [position, setPosition] = useState(0)
  const [antwort, setAntwort] = useState<Antwortstand>({
    bestaetigt: null,
    gewaehlt: null,
  })
  const [richtigeInRunde, setRichtigeInRunde] = useState(0)
  const [fertig, setFertig] = useState(false)

  const rueckmeldung = useRef<HTMLDivElement>(null)

  /*
    `heute` einmal je Aufbau bestimmt und nicht bei jedem Rechenschritt neu:
    Sonst könnte eine Runde, die über Mitternacht dauert, mittendrin den Tag
    wechseln – und eine gerade beantwortete Karte wäre sofort wieder fällig.
  */
  const [heute] = useState(() => new Date().toISOString().slice(0, 10))

  const lage = stand(karten, heute)

  const holeBestand = useCallback(async (): Promise<Bestandsfrage[] | null> => {
    if (bestand) return bestand
    setZustand('laedt')
    try {
      const antwort = await fetch('/lernen/fragen.json')
      if (!antwort.ok) throw new Error(String(antwort.status))
      const geladen = (await antwort.json()) as Bestandsfrage[]
      setBestand(geladen)
      setZustand('bereit')
      return geladen
    } catch {
      setZustand('fehler')
      return null
    }
  }, [bestand])

  async function starte() {
    const alle = await holeBestand()
    if (!alle) return

    const vorhandene = leseKarten()
    const auswahl = runde(
      vorhandene,
      alle.map((frage) => frage.id),
      heute,
      RUNDENLAENGE
    )

    const nachId = new Map(alle.map((frage) => [frage.id, frage]))
    const fragen: Bestandsfrage[] = []
    for (const karte of auswahl.wiederholung) {
      const frage = nachId.get(karte.id)
      /*
        Eine gespeicherte Karte ohne zugehörige Frage kann es geben: Wurde eine
        Frage entfernt, bleibt ihre Karte im Browser zurück. Sie wird
        übersprungen statt gelöscht – Löschen wäre stillschweigender
        Datenverlust für einen Fall, der sich von selbst erledigt.
      */
      if (frage) fragen.push(frage)
    }
    for (const id of auswahl.neu) {
      const frage = nachId.get(id)
      if (frage) fragen.push(frage)
    }

    if (fragen.length === 0) return

    setLaufend(fragen)
    setPosition(0)
    setAntwort({ bestaetigt: null, gewaehlt: null })
    setRichtigeInRunde(0)
    setFertig(false)
  }

  const frage = laufend?.[position]
  const warRichtig = antwort.bestaetigt !== null && antwort.bestaetigt === frage?.richtig

  function pruefe() {
    if (antwort.gewaehlt === null || !frage) return
    const richtig = antwort.gewaehlt === frage.richtig

    const vorhanden = leseKarten().find((karte) => karte.id === frage.id)
    const karte: Karte = vorhanden ?? neueKarte(frage.id, heute)
    speichereKarte(beantworte(karte, richtig, heute))

    setAntwort((vorher) => ({ ...vorher, bestaetigt: vorher.gewaehlt }))
    if (richtig) setRichtigeInRunde((zahl) => zahl + 1)
    window.setTimeout(() => rueckmeldung.current?.focus(), 50)
  }

  function weiter() {
    if (!laufend) return
    if (position === laufend.length - 1) {
      setFertig(true)
      return
    }
    setPosition((wert) => wert + 1)
    setAntwort({ bestaetigt: null, gewaehlt: null })
  }

  // ------------------------------------------------------------ Übersicht
  if (!laufend || fertig) {
    return (
      <div>
        <StatGrid>
          <Stat
            label="Heute fällig"
            value={String(lage.faellig)}
            hint={
              lage.faellig > 0
                ? 'Karten, deren Abstand abgelaufen ist'
                : lage.naechsterTag
                  ? `Nächste Fälligkeit am ${formatDate(lage.naechsterTag)}`
                  : 'Noch nichts angefangen'
            }
            tone={lage.faellig > 0 ? 'positive' : undefined}
          />
          <Stat
            label="Begonnen"
            value={String(lage.begonnen)}
            hint="Fragen, die du mindestens einmal beantwortet hast"
          />
          <Stat
            label="Gefestigt"
            value={String(lage.gefestigt)}
            hint={`In Fach 4 oder ${HOECHSTES_FACH} – die kommen erst in Wochen wieder`}
          />
          <Stat
            label="Trefferquote"
            value={
              lage.trefferProzent === null ? '—' : formatPercent(lage.trefferProzent, 0)
            }
            hint="Über alle Versuche, nicht über die letzte Runde"
          />
        </StatGrid>

        {fertig && (
          <Callout variant="tip" title="Runde beendet" className="mt-8">
            <p>
              {richtigeInRunde} von {laufend?.length ?? 0} richtig. Was du konntest, ist
              ein Fach weitergerückt und kommt später wieder; was nicht saß, liegt wieder
              in Fach 1 und ist morgen dran.
            </p>
          </Callout>
        )}

        {zustand === 'fehler' && (
          <Callout
            variant="warning"
            title="Die Fragen ließen sich nicht laden"
            className="mt-8"
          >
            <p>
              Das kann an der Verbindung liegen. Der gespeicherte Stand ist davon nicht
              betroffen – er liegt in diesem Browser und nicht auf einem Server.
            </p>
          </Callout>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={starte}
            disabled={zustand === 'laedt'}
            className="fk-btn-primary"
          >
            {zustand === 'laedt'
              ? 'Fragen werden geladen …'
              : lage.faellig > 0
                ? `${Math.min(lage.faellig, RUNDENLAENGE)} Karten wiederholen`
                : lage.begonnen > 0
                  ? 'Neue Fragen üben'
                  : 'Übung beginnen'}
            <Icon name="arrow-right" className="size-4" />
          </button>

          {lage.begonnen > 0 && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Den gesamten Wiederholungsstand löschen?')) {
                  setzeWiederholungZurueck()
                }
              }}
              className="fk-btn-secondary"
            >
              Stand zurücksetzen
            </button>
          )}
        </div>

        <div className="text-fg-subtle mt-8 max-w-2xl space-y-3 text-sm leading-relaxed">
          <p>
            Fünf Fächer, feste Abstände: {ABSTAENDE.slice(1).join(', ')} Tage. Eine
            richtige Antwort rückt die Frage ein Fach weiter, eine falsche wirft sie
            zurück auf Fach 1 – nicht ein Fach herunter. Wer eine Frage aus Fach 4 nicht
            mehr kann, hat sie nicht fast gewusst.
          </p>
          <p>
            Der Stand liegt allein in diesem Browser. Kein Konto, keine Übertragung, und
            beim Löschen der Browserdaten ist er weg. Die Fragen sind dieselben wie in den{' '}
            <Link
              href="/lernen"
              className="text-learn font-medium underline underline-offset-2"
            >
              Lernthemen
            </Link>
            .
          </p>
        </div>
      </div>
    )
  }

  // -------------------------------------------------------------- Fragenlauf
  if (!frage) return null

  return (
    <section
      aria-labelledby={`${gruppe}-titel`}
      className="rounded-card border-learn/30 bg-surface border p-6 sm:p-7"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="fk-chip bg-learn-soft text-learn">
          <Icon name="target" className="size-3.5" />
          {frage.themaTitel} · {frage.stufeLabel}
        </p>
        <p className="text-fg-subtle text-sm font-medium tabular-nums">
          Karte {position + 1} von {laufend.length}
        </p>
      </div>

      <h2 id={`${gruppe}-titel`} className="sr-only">
        Wiederholung, Karte {position + 1} von {laufend.length}
      </h2>

      <ProgressBar
        value={position + (antwort.bestaetigt !== null ? 1 : 0)}
        max={laufend.length}
        label={`Karte ${position + 1} von ${laufend.length}`}
        showValue={false}
        className="mt-4"
      />

      <fieldset className="mt-6" disabled={antwort.bestaetigt !== null}>
        <legend className="text-fg text-lg font-semibold">{frage.frage}</legend>

        <div className="mt-4 space-y-2">
          {frage.antworten.map((option, index) => {
            const gewaehlt = antwort.gewaehlt === index
            const istRichtige = index === frage.richtig
            const zeigeRichtig = antwort.bestaetigt !== null && istRichtige
            const zeigeFalsch = antwort.bestaetigt !== null && gewaehlt && !istRichtige

            return (
              <label
                key={index}
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition',
                  antwort.bestaetigt === null &&
                    'hover:border-learn/50 hover:bg-surface-muted',
                  antwort.bestaetigt === null && gewaehlt
                    ? 'border-learn bg-learn-soft'
                    : 'border-border',
                  zeigeRichtig && 'border-success bg-success-soft',
                  zeigeFalsch && 'border-danger bg-danger-soft',
                  antwort.bestaetigt !== null && 'cursor-default'
                )}
              >
                <input
                  type="radio"
                  name={`${gruppe}-karte-${position}`}
                  value={index}
                  checked={gewaehlt}
                  onChange={() =>
                    setAntwort((vorher) => ({ ...vorher, gewaehlt: index }))
                  }
                  className="accent-learn mt-0.5 size-4 shrink-0"
                />
                <span className="text-fg min-w-0 flex-1 text-sm leading-relaxed">
                  {option}
                </span>
                {zeigeRichtig && (
                  <Icon
                    name="check-circle"
                    className="text-success mt-0.5 size-4 shrink-0"
                    label="Richtige Antwort"
                  />
                )}
                {zeigeFalsch && (
                  <Icon
                    name="close"
                    className="text-danger mt-0.5 size-4 shrink-0"
                    label="Deine Antwort war falsch"
                  />
                )}
              </label>
            )
          })}
        </div>
      </fieldset>

      {antwort.bestaetigt !== null && (
        <div
          ref={rueckmeldung}
          tabIndex={-1}
          role="status"
          aria-live="polite"
          className={cn(
            'mt-5 rounded-xl border p-4',
            warRichtig
              ? 'border-success/40 bg-success-soft'
              : 'border-warning/40 bg-warning-soft'
          )}
        >
          <p className="text-fg flex items-center gap-2 text-sm font-semibold">
            <Icon name={warRichtig ? 'check-circle' : 'info'} className="size-4" />
            {warRichtig ? 'Richtig – kommt später wieder' : 'Nicht ganz – morgen wieder'}
          </p>
          <p className="text-fg-muted mt-2 text-sm leading-relaxed">
            {frage.begruendung}
          </p>
          <p className="text-fg-subtle mt-3 text-xs">
            Ausführlich im Lernthema{' '}
            <Link
              href={`/lernen/${frage.themaSlug}/${frage.stufe}`}
              className="text-learn underline underline-offset-2"
            >
              {frage.themaTitel}, {frage.stufeLabel}
            </Link>
            .
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-fg-subtle text-xs tabular-nums">
          {richtigeInRunde} richtig in dieser Runde
        </p>

        {antwort.bestaetigt === null ? (
          <button
            type="button"
            onClick={pruefe}
            disabled={antwort.gewaehlt === null}
            className="fk-btn-primary"
          >
            Antwort prüfen
          </button>
        ) : (
          <button type="button" onClick={weiter} className="fk-btn-primary">
            {position === laufend.length - 1 ? 'Runde abschließen' : 'Nächste Karte'}
            <Icon name="arrow-right" className="size-4" />
          </button>
        )}
      </div>
    </section>
  )
}
