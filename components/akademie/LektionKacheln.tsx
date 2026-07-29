'use client'

import Link from 'next/link'

import { lektionKey, useCompletedLevels } from '@/components/learn/progress-store'
import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/lib/cn'

/**
 * Die Lektionen eines Bereichs als Kacheln, jede mit ihrem Bearbeitungsstand.
 *
 * ## Warum eine Client-Komponente
 *
 * Der Haken kommt aus dem localStorage und damit erst im Browser. Ein
 * statisches Paket kennt ihn nicht – die Kachel wird deshalb zunächst
 * unerledigt ausgeliefert und erhält den Haken beim ersten Rendern im
 * Browser. Sichtbar ist der Wechsel nicht: Er passiert vor dem ersten Bild.
 *
 * Nur die Liste ist Client-Code, nicht die ganze Seite. Kopfbereich,
 * Hinweiskasten und Legende bleiben serverseitig – sie enthalten den Text,
 * auf den es für Suchmaschinen ankommt.
 */
export interface LektionKachel {
  slug: string
  titel: string
  kurz: string
  dauer: number
  /** Beschriftung der Einstufung, etwa „Beobachtung“. */
  belegart: string
}

export function LektionKacheln({
  bereich,
  lektionen,
}: {
  bereich: string
  lektionen: LektionKachel[]
}) {
  const erledigt = useCompletedLevels()

  return (
    <ol className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {lektionen.map((lektion, nummer) => {
        const fertig = erledigt.includes(lektionKey(bereich, lektion.slug))

        return (
          /*
            Das Einblenden sitzt innerhalb des <li>, nicht darum herum.

            `Reveal` rendert ein <div>; außen herum stünde es zwischen <ol> und
            <li>. Das ist ungültiges Markup, und Vorleseprogramme geben die
            Anzahl der Einträge dann nicht mehr zuverlässig an – aus einer
            Liste mit dreizehn Lektionen wird eine Ansammlung von Kästen.
          */
          <li key={lektion.slug} className="h-full">
            <Reveal delay={Math.min(nummer, 8) * 0.03} className="h-full">
              <Link
                href={`/akademie/${bereich}/${lektion.slug}`}
                className={cn(
                  'fk-card-interactive group flex h-full flex-col p-5',
                  fertig && 'border-success/40'
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  {/*
                    Dieselbe Marke wie im Lernbereich: Die Nummer wird zum
                    Haken. Ein zusätzlicher Kreis neben der Nummer hätte zwei
                    Zeichen für eine Aussage – und die Nummer hat ihren Dienst
                    getan, sobald die Lektion durch ist.
                  */}
                  <span
                    className={cn(
                      'flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold tabular-nums transition-colors',
                      fertig ? 'bg-success text-white' : 'bg-akademie-soft text-akademie'
                    )}
                  >
                    {fertig ? <Icon name="check" className="size-4" /> : nummer + 1}
                  </span>

                  {fertig ? (
                    <span className="fk-chip bg-success-soft text-success">Erledigt</span>
                  ) : (
                    <span className="border-border text-fg-subtle rounded-full border px-2 py-0.5 text-xs">
                      {lektion.belegart}
                    </span>
                  )}
                </div>

                <h3 className="text-fg group-hover:text-akademie mt-4 leading-snug font-semibold transition">
                  {lektion.titel}
                </h3>
                <p className="text-fg-muted mt-2 flex-1 text-sm leading-relaxed">
                  {lektion.kurz}
                </p>

                <span className="mt-4 flex items-center justify-between gap-2 text-sm">
                  <span className="text-fg-subtle text-xs">
                    {lektion.dauer} Min. Lesezeit
                  </span>
                  <span className="text-akademie flex items-center gap-1 text-sm font-semibold">
                    {fertig ? 'Nochmal ansehen' : 'Öffnen'}
                    <Icon
                      name="arrow-right"
                      className="size-4 transition-transform group-hover:translate-x-0.5"
                    />
                  </span>
                </span>
              </Link>
            </Reveal>
          </li>
        )
      })}
    </ol>
  )
}
