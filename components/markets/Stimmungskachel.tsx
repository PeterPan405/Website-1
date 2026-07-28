import Link from 'next/link'

import { Tacho } from '@/components/markets/Tacho'
import { Icon } from '@/components/ui/Icon'
import type { Marktbereich, Stimmung } from '@/lib/markets'
import { STUFEN_TEXT } from '@/lib/markets'

/**
 * Angst und Gier als Kachel in Kursgröße.
 *
 * Über die volle Breite wirkte der Tacho wie die Hauptaussage der Seite – dabei
 * ist er eine Kennzahl unter vielen. In der Kachelreihe steht er da, wo er
 * hingehört: neben Hang Seng und Russell 2000, gleich groß, gleich gewichtet.
 *
 * ## Warum die Kachel ein Link ist
 *
 * Aus demselben Grund wie bei einem Kurs: Die Kachel zeigt einen Stand, und der
 * beantwortet die naheliegende nächste Frage nicht – ob dieser Stand hoch oder
 * niedrig ist, verglichen mit der Woche davor. Dafür gibt es die Seite
 * dahinter. Die Kachel selbst bleibt eine Zahl, kein Aufsatz.
 *
 * Die Zeichnung ist `aria-hidden`; darunter steht dasselbe als Satz.
 */
export function Stimmungskachel({
  stimmung,
  titel,
  bereich,
}: {
  stimmung: Stimmung
  titel: string
  bereich: Marktbereich
}) {
  const stufentext = STUFEN_TEXT[stimmung.stufe]
  const teile = stimmung.bestandteile.map((teil) => teil.label.toLowerCase()).join(', ')

  return (
    <Link
      href={`/maerkte/stimmung/${bereich}`}
      className="fk-card-interactive group flex h-full flex-col p-5"
    >
      <h3 className="text-fg-subtle text-xs font-semibold tracking-wide uppercase">
        {titel}
      </h3>

      <div className="mt-2 flex justify-center">
        <Tacho stimmung={stimmung} />
      </div>

      {/* Dieselbe Aussage als Satz – das Diagramm ist aria-hidden. */}
      <p className="text-fg-subtle mt-auto pt-3 text-xs leading-relaxed">
        <span className="text-fg font-semibold">
          {stimmung.wert} von 100 – {stufentext}.
        </span>{' '}
        Gerechnet aus {teile} der Kurse dieser Seite.
      </p>

      {/*
        Derselbe Hinweis wie auf den Kurskacheln.

        Ohne ihn ist die Kachel zwar anklickbar, sieht aber nicht danach aus –
        und eine Schaltfläche, die man nicht als solche erkennt, ist keine. Der
        Wortlaut ist bewusst identisch mit dem der Kurskacheln daneben: zwei
        Formulierungen für dieselbe Handlung wären eine Unterscheidung, die es
        nicht gibt.
      */}
      <p className="text-brand mt-4 flex items-center gap-1 text-sm font-semibold">
        Details ansehen
        <Icon
          name="arrow-right"
          className="size-4 transition-transform group-hover:translate-x-0.5"
        />
      </p>
    </Link>
  )
}
