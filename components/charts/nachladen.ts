'use client'

import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'
import { createElement } from 'react'

/**
 * Diagramme erst laden, wenn sie gebraucht werden.
 *
 * ## Warum
 *
 * Weil `recharts` **338 Kilobyte** wiegt und bis Juli 2026 auf jeder
 * Rechnerseite im ersten Laden steckte – auch auf denen, deren Diagramm weit
 * unter der ersten Bildschirmhöhe liegt. Aufgefallen ist das keinem Auge,
 * sondern `npm run gewicht`: Rechnerseiten luden 1.257 Kilobyte, alle anderen
 * Seiten rund 800.
 *
 * 338 Kilobyte sind am Schreibtisch nichts. Auf einem älteren Telefon sind sie
 * Herunterladen **und** Auswerten, und das Auswerten ist die teurere Hälfte –
 * sie blockiert den Hauptstrang, während der Nutzer schon tippen will.
 *
 * ## Warum die Höhe mitgegeben werden muss
 *
 * Damit nichts springt. Wird das Diagramm nachgeladen, ist sein Platz vorher
 * leer; ohne reservierte Höhe rutscht der ganze Text darunter nach oben und
 * beim Eintreffen wieder nach unten. Das ist genau der Effekt, der einen beim
 * Lesen die Zeile verlieren lässt – und Google misst ihn als Layoutverschiebung.
 *
 * Deshalb nimmt der Platzhalter dieselbe Höhe ein wie das Diagramm, das kommt.
 *
 * ## Warum ohne serverseitiges Rendern
 *
 * `recharts` misst den verfügbaren Platz im Browser. Auf dem Server gibt es
 * keinen, und das vorgerenderte Ergebnis müsste ohnehin sofort ersetzt werden.
 * Es mitzuliefern hieße, dieselbe Grafik zweimal zu erzeugen.
 */

/**
 * Macht aus einer Diagrammkomponente eine, die sich selbst nachlädt.
 *
 * `hoehe` ist die Höhe des Platzhalters und sollte der Voreinstellung des
 * Diagramms entsprechen.
 */
export function nachgeladen<P extends object>(
  laden: () => Promise<{ default: ComponentType<P> }>,
  hoehe: number
): ComponentType<P> {
  return dynamic(laden, {
    ssr: false,
    loading: () =>
      createElement('div', {
        style: { height: hoehe },
        className: 'bg-surface-muted w-full animate-pulse rounded-xl',
        /*
          Für Vorleseprogramme ist ein ladender Platzhalter nichts – die
          eigentliche Aussage steht in den Zahlen daneben, und ein Diagramm
          ist ohnehin nur die zweite Darstellung derselben Werte.
        */
        'aria-hidden': 'true',
      }),
  })
}
