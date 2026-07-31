import { Callout } from '@/components/ui/Callout'
import { formatPercent } from '@/lib/format'
import { getZinsreihe, zeitpunktText } from '@/lib/zinsen'

/**
 * Der gemessene Wert neben der Rechenannahme.
 *
 * ## Warum das kein Ersatz für die Annahme ist
 *
 * Ein Rechner über dreißig Jahre arbeitet mit einer Annahme, und das muss er
 * auch: Die Rate eines einzelnen Monats über dreißig Jahre fortzuschreiben
 * wäre die schlechteste aller Prognosen. Was hier steht, ist der Bezugspunkt
 * dazu – wo die Größe gerade tatsächlich liegt, damit die eingestellte Annahme
 * nicht im luftleeren Raum steht.
 *
 * Fehlt der Wert, fehlt der ganze Block. Ein leerer Rahmen mit „keine Daten“
 * hilft niemandem.
 */
export function Zinsstand({
  reihen,
  titel,
  einleitung,
}: {
  /** Kennungen aus `data/snapshots/zinsen.json`, in der Reihenfolge der Anzeige. */
  reihen: readonly string[]
  titel: string
  einleitung: string
}) {
  const gefunden = reihen
    .map((id) => getZinsreihe(id))
    .filter((reihe): reihe is NonNullable<typeof reihe> => Boolean(reihe?.aktuell))

  if (gefunden.length === 0) return null

  return (
    <Callout variant="info" title={titel} className="mt-10">
      <p>{einleitung}</p>
      <ul className="not-prose mt-3 space-y-3">
        {gefunden.map((reihe) => {
          const aktuell = reihe.aktuell!
          const vorher = reihe.vorEinemJahr
          return (
            <li key={reihe.bezeichnung}>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-fg font-semibold tabular-nums">
                  {formatPercent(aktuell.wert, 1)}
                </span>
                <span className="text-fg-muted text-sm">{reihe.bezeichnung}</span>
                <span className="text-fg-subtle text-xs">
                  Stand {zeitpunktText(aktuell.t)}
                  {/*
                    Der Vorjahreswert steht dabei, wo es ihn gibt. Ohne ihn ist
                    eine Rate eine Zahl; mit ihm sieht man die Richtung – und
                    genau darum geht es bei Zinsen und Inflation.
                  */}
                  {vorher && ` · vor einem Jahr ${formatPercent(vorher.wert, 1)}`}
                </span>
              </div>
              <p className="text-fg-subtle mt-1 text-xs leading-relaxed">
                {reihe.abgrenzung}
              </p>
            </li>
          )
        })}
      </ul>
      <p className="text-fg-subtle mt-3 text-xs">
        Quelle:{' '}
        {gefunden.map((reihe, index) => (
          <span key={reihe.quelle.url}>
            {index > 0 && ' · '}
            <a
              href={reihe.quelle.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              {reihe.quelle.label}
            </a>
          </span>
        ))}
      </p>
    </Callout>
  )
}
