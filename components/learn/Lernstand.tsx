'use client'

import Link from 'next/link'

import { levelKey, useCompletedLevels } from '@/components/learn/progress-store'
import { useQuizResults } from '@/components/learn/quiz-store'
import { Icon } from '@/components/ui/Icon'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Stat, StatGrid } from '@/components/ui/Stat'
import { learnLevelIds, type LearnLevelId } from '@/data/learn/types'
import { cn } from '@/lib/cn'
import { formatPercent } from '@/lib/format'

/**
 * Der eigene Lernstand über alle Themen.
 *
 * ## Was hier zusammenkommt
 *
 * Der Lernbereich führt zwei getrennte Speicher: abgehakte Stufen
 * (`progress-store`) und das beste Quiz-Ergebnis je Stufe (`quiz-store`). Beide
 * werden bisher nur dort gezeigt, wo sie entstehen – auf der Stufenseite. Wer
 * wissen will, wo er insgesamt steht, muss 34 Themen durchklicken.
 *
 * Diese Tafel legt beides nebeneinander, und der Vergleich ist der eigentliche
 * Ertrag: Eine abgehakte Stufe ohne Quiz-Ergebnis ist gelesen, nicht geprüft.
 *
 * ## Warum vor der Hydration nichts steht
 *
 * Der Server kennt den localStorage nicht. Statt einen Platzhalter zu zeigen,
 * der gleich darauf springt, steht hier eine Zeile, die den Zustand benennt –
 * bei abgeschaltetem JavaScript bleibt sie stehen und ist dann die Wahrheit.
 */

export interface Themenstand {
  slug: string
  titel: string
  /** Welche Stufen dieses Themas ausformulierten Text haben. */
  ausformuliert: LearnLevelId[]
}

const STUFENNAME: Record<LearnLevelId, string> = {
  beginner: 'Beginner',
  fortgeschritten: 'Fortgeschritten',
  profi: 'Profi',
}

export function Lernstand({ themen }: { themen: Themenstand[] }) {
  const erledigt = useCompletedLevels()
  const quiz = useQuizResults()

  const alleSchluessel = themen.flatMap((thema) =>
    learnLevelIds.map((stufe) => levelKey(thema.slug, stufe))
  )
  const fertig = alleSchluessel.filter((schluessel) => erledigt.includes(schluessel))
  const vollstaendigeThemen = themen.filter((thema) =>
    learnLevelIds.every((stufe) => erledigt.includes(levelKey(thema.slug, stufe)))
  )

  /* Quiz-Ergebnisse, aber nur die zu Lernstufen – Akademieschlüssel bleiben außen vor. */
  const eigeneErgebnisse = alleSchluessel
    .map((schluessel) => quiz[schluessel])
    .filter((ergebnis) => ergebnis !== undefined)
  const gestellt = eigeneErgebnisse.reduce((summe, ergebnis) => summe + ergebnis.total, 0)
  const getroffen = eigeneErgebnisse.reduce(
    (summe, ergebnis) => summe + ergebnis.correct,
    0
  )

  /* Abgehakt, aber nie ein Quiz gemacht: gelesen und nicht geprüft. */
  const ungeprueft = fertig.filter((schluessel) => !quiz[schluessel]).length

  /** Die erste Stufe, die noch offen ist – in der Reihenfolge der Themen. */
  const naechste = (() => {
    for (const thema of themen) {
      for (const stufe of learnLevelIds) {
        if (!erledigt.includes(levelKey(thema.slug, stufe))) {
          return { thema, stufe }
        }
      }
    }
    return null
  })()

  return (
    <div>
      <StatGrid>
        <Stat
          label="Stufen erledigt"
          value={String(fertig.length)}
          hint={`von ${alleSchluessel.length} im Lernbereich`}
          tone={fertig.length > 0 ? 'positive' : undefined}
        />
        <Stat
          label="Themen vollständig"
          value={String(vollstaendigeThemen.length)}
          hint={`von ${themen.length} – alle drei Stufen abgehakt`}
        />
        <Stat
          label="Quiz-Trefferquote"
          value={gestellt === 0 ? '—' : formatPercent((getroffen / gestellt) * 100, 0)}
          hint={
            gestellt === 0
              ? 'Noch kein Wissenscheck gemacht'
              : `Beste Versuche, ${getroffen} von ${gestellt} Fragen`
          }
        />
        <Stat
          label="Abgehakt, ungeprüft"
          value={String(ungeprueft)}
          tone={ungeprueft > 0 ? 'negative' : undefined}
          hint="Stufen ohne Wissenscheck – gelesen ist nicht geprüft"
        />
      </StatGrid>

      <ProgressBar
        value={fertig.length}
        max={alleSchluessel.length}
        label={`${fertig.length} von ${alleSchluessel.length} Lernstufen abgeschlossen`}
        className="mt-8"
      />

      {fertig.length === 0 ? (
        <p className="text-fg-muted mt-6 max-w-2xl leading-relaxed">
          Hier steht noch nichts. Das heißt nicht zwingend, dass du nichts gelernt hast –
          es heißt, dass in diesem Browser keine Stufe abgehakt ist. Wer schon etwas weiß,
          kommt mit dem Einstufungstest weiter unten schneller zum Einstiegspunkt als mit
          dem Durchklicken von {themen.length} Themen.
        </p>
      ) : naechste ? (
        <p className="text-fg-muted mt-6 leading-relaxed">
          Als Nächstes offen:{' '}
          <Link
            href={`/lernen/${naechste.thema.slug}/${naechste.stufe}`}
            className="text-learn font-medium underline underline-offset-2"
          >
            {naechste.thema.titel}, {STUFENNAME[naechste.stufe]}
          </Link>
          .
        </p>
      ) : (
        <p className="text-fg-muted mt-6 leading-relaxed">
          Alle {alleSchluessel.length} Stufen sind abgehakt. Was jetzt zählt, ist Behalten
          – dafür gibt es die{' '}
          <Link
            href="/lernen/wiederholen"
            className="text-learn font-medium underline underline-offset-2"
          >
            verteilte Wiederholung
          </Link>
          .
        </p>
      )}

      <div className="relative mt-10 overflow-x-auto">
        <table className="w-full min-w-[34rem] text-sm">
          <caption className="sr-only">
            Lernstand je Thema: erledigte Stufen und bestes Quiz-Ergebnis
          </caption>
          <thead>
            <tr className="border-border text-fg-subtle border-b text-left text-xs">
              <th scope="col" className="py-2 pr-4 font-medium">
                Thema
              </th>
              {learnLevelIds.map((stufe) => (
                <th key={stufe} scope="col" className="w-28 py-2 pr-4 font-medium">
                  {STUFENNAME[stufe]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {themen.map((thema) => (
              <tr key={thema.slug} className="border-border border-b">
                <th scope="row" className="py-2.5 pr-4 text-left font-medium">
                  <Link
                    href={`/lernen/${thema.slug}`}
                    className="text-fg hover:text-learn"
                  >
                    {thema.titel}
                  </Link>
                </th>
                {learnLevelIds.map((stufe) => {
                  const schluessel = levelKey(thema.slug, stufe)
                  const abgehakt = erledigt.includes(schluessel)
                  const ergebnis = quiz[schluessel]
                  const hatText = thema.ausformuliert.includes(stufe)

                  return (
                    <td key={stufe} className="py-2.5 pr-4">
                      <Link
                        href={`/lernen/${thema.slug}/${stufe}`}
                        className="group inline-flex items-center gap-1.5"
                        aria-label={`${thema.titel}, ${STUFENNAME[stufe]}: ${
                          abgehakt ? 'erledigt' : 'offen'
                        }${
                          ergebnis
                            ? `, bestes Quiz ${ergebnis.correct} von ${ergebnis.total}`
                            : ''
                        }`}
                      >
                        {abgehakt ? (
                          <Icon
                            name="check-circle"
                            className="text-success size-4 shrink-0"
                          />
                        ) : (
                          /*
                            Kein Symbol für „offen“, sondern ein leerer Ring: Der
                            Zeichensatz hat keinen Kreis, und ein durchgestrichenes
                            oder graues Häkchen sähe aus wie ein Fehlschlag. Offen
                            ist kein Fehlschlag.
                          */
                          <span
                            aria-hidden="true"
                            className={cn(
                              'size-4 shrink-0 rounded-full border',
                              hatText ? 'border-border-strong' : 'border-border'
                            )}
                          />
                        )}
                        <span
                          className={cn(
                            'text-xs tabular-nums',
                            ergebnis ? 'text-fg-subtle' : 'text-transparent'
                          )}
                          aria-hidden="true"
                        >
                          {ergebnis ? `${ergebnis.correct}/${ergebnis.total}` : '–'}
                        </span>
                      </Link>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-fg-subtle mt-4 flex items-start gap-2 text-xs leading-relaxed">
        <Icon name="shield" className="mt-0.5 size-3.5 shrink-0" />
        Haken und Quiz-Ergebnisse liegen allein in diesem Browser. Auf einem anderen Gerät
        ist die Tafel leer – nicht, weil etwas verloren ging, sondern weil nie etwas
        übertragen wurde.
      </p>
    </div>
  )
}
