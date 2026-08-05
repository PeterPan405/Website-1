'use client'

import { useSyncExternalStore } from 'react'

import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import {
  type Handelsplatz,
  handelsplatzFuer,
  istGeoeffnet,
  ortszeit,
  verpassteSitzungen,
} from '@/lib/handelszeiten'

/**
 * Sagt, wann dieser Markt handelt – und ob ein Kurs eine Sitzung verpasst hat.
 *
 * ## Warum das im Browser entsteht und nicht beim Bauen
 *
 * Aus demselben Grund wie beim Kalender: „Jetzt" wäre auf einer statisch
 * gebauten Seite der Zeitpunkt des letzten Baus. Ein Hinweis „dieser Kurs ist
 * überfällig" wäre damit selbst überfällig – und im schlimmsten Fall würde er
 * an einem Tag stehen, an dem alles stimmt.
 *
 * Bis das JavaScript läuft, steht die Zeile mit den Handelszeiten bereits da.
 * Sie hängt nicht an der Uhrzeit und ist der Teil, der erklärt; nur das Urteil
 * „offen / geschlossen / überfällig" kommt nach.
 *
 * ## Warum zwei Aussagen und nicht eine
 *
 * Weil ein alter Kurs zwei völlig verschiedene Dinge bedeuten kann, und der
 * Unterschied für den Leser der ganze Punkt ist:
 *
 * - **Die Börse hat zu.** Dann ist der Kurs der Schlusskurs, er ist richtig,
 *   und er wird sich bis zur nächsten Eröffnung nicht ändern.
 * - **Die Börse hat gehandelt, und wir haben es nicht mitbekommen.** Dann
 *   fehlt hier etwas.
 *
 * Am 5. August 2026 sah beides gleich aus: Der Nikkei trug den Schluss vom
 * Vortag, und nichts auf der Seite unterschied das von einem normalen
 * Feierabend.
 */
export function Handelsfenster({
  symbol,
  ticker,
  kind,
  stand,
}: {
  symbol: string
  ticker: string
  kind: string
  /** Zeitpunkt des Kurses, ISO-8601. */
  stand: string
}) {
  const platz = handelsplatzFuer({ symbol, ticker, kind })

  /*
    „Jetzt" kommt aus dem Browser, nicht aus dem Build – dasselbe Muster wie im
    Kalender, und aus demselben Grund: Der dritte Wert ist die Fassung für den
    Server, dort gibt es kein sinnvolles Jetzt. Ohne diese Trennung erzeugten
    Server und Browser unterschiedliches HTML.

    Abonniert wird ein Minutentakt: Anders als beim Kalender wechselt die
    Aussage hier zweimal am Tag, und wer um kurz vor neun auf der Seite steht,
    soll die Eröffnung sehen, ohne neu zu laden.
  */
  const jetztMs = useSyncExternalStore(
    (melden) => {
      const takt = setInterval(melden, 60_000)
      return () => clearInterval(takt)
    },
    () => Math.floor(Date.now() / 60_000) * 60_000,
    () => null
  )

  if (!platz) return null

  const jetzt = jetztMs === null ? null : new Date(jetztMs)

  const standDatum = new Date(stand)
  const offen = jetzt ? istGeoeffnet(platz, jetzt) : null
  const verpasst =
    jetzt && !Number.isNaN(standDatum.getTime())
      ? verpassteSitzungen(platz, standDatum, jetzt)
      : 0

  return (
    <div className="mt-3 space-y-2">
      <p className="text-fg-subtle flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        <Icon name="clock" className="size-4 shrink-0" aria-hidden="true" />
        <span>
          {platz.name}: {zeitraum(platz)} Ortszeit
          {jetzt && <> · bei dir {zeitraumLokal(platz, jetzt)}</>}
        </span>
        {offen !== null && (
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-xs font-semibold',
              offen ? 'bg-success-soft text-success' : 'bg-surface-muted text-fg-muted'
            )}
          >
            {offen ? 'handelt gerade' : 'geschlossen'}
          </span>
        )}
      </p>

      {verpasst > 0 && (
        <p className="bg-warning-soft text-warning flex items-start gap-2 rounded-lg px-3 py-2 text-sm">
          <Icon name="warning" className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>
            <strong className="font-semibold">
              Dieser Kurs ist nicht auf dem letzten Stand.
            </strong>{' '}
            Seit ihm hat {platz.name}{' '}
            {verpasst === 1 ? 'einmal geschlossen' : `${verpasst}-mal geschlossen`}, ohne
            dass hier ein neuer Wert angekommen ist.
          </span>
        </p>
      )}
    </div>
  )
}

function hhmm(minuten: number): string {
  const h = Math.floor(minuten / 60)
  const m = minuten % 60
  return m === 0 ? `${h} Uhr` : `${h}:${String(m).padStart(2, '0')} Uhr`
}

function zeitraum(platz: Handelsplatz): string {
  return `${hhmm(platz.von).replace(' Uhr', '')}–${hhmm(platz.bis)}`
}

/**
 * Dasselbe Fenster in der Zeit des Lesers.
 *
 * Der Umweg über `ortszeit` mit der eigenen Zone spart die Rechnung mit
 * Zeitzonen-Versätzen: Gefragt wird nicht „wie viel Versatz liegt dazwischen",
 * sondern „welche Uhrzeit ist hier, wenn es dort Eröffnung ist".
 */
function zeitraumLokal(platz: Handelsplatz, jetzt: Date): string {
  const hier = Intl.DateTimeFormat().resolvedOptions().timeZone
  const dort = ortszeit(jetzt, platz.zone)
  const beiMir = ortszeit(jetzt, hier)
  const versatz = beiMir.minute - dort.minute

  const dreh = (m: number) => (((m + versatz) % 1440) + 1440) % 1440
  return `${hhmm(dreh(platz.von)).replace(' Uhr', '')}–${hhmm(dreh(platz.bis))}`
}
