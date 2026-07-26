'use client'

import Lenis from 'lenis'
import { useEffect } from 'react'

/**
 * Gleitendes Scrollen statt sprunghafter Rasterung.
 *
 * Ein Mausrad meldet dem Browser einzelne Rastungen, und der springt je Rastung
 * eine feste Strecke. Das ist die Ursache des ruckartigen Eindrucks – nicht
 * fehlende Rechenleistung. `scroll-behavior: smooth` ändert daran nichts, es
 * wirkt nur bei Sprungmarken und programmatischem Scrollen.
 *
 * Diese Komponente nimmt die Rastungen entgegen und bewegt die Seite stattdessen
 * über mehrere Bilder hinweg auf das neue Ziel zu. Das Scrollen läuft damit
 * weich aus, statt zu springen.
 *
 * Bewusst nur für das Mausrad: Auf Touchgeräten bleibt das native Scrollen
 * unangetastet (`smoothTouch` ist standardmäßig aus). Dort gibt es bereits
 * Schwung vom Betriebssystem, und ein zweiter darübergelegter würde sich
 * schwammig anfühlen.
 */
export function SmoothScroll() {
  useEffect(() => {
    /*
      Wer Bewegung reduziert haben möchte, bekommt das native Scrollen. Für
      manche Menschen ist weich nachlaufende Bewegung nicht angenehmer, sondern
      löst Übelkeit aus – deshalb ist diese Abfrage keine Feinheit, sondern
      Voraussetzung dafür, den Effekt überhaupt einzubauen.
    */
    const wenigerBewegung = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (wenigerBewegung.matches) return

    const lenis = new Lenis({
      /*
        0.09 ist bewusst niedrig gewählt. Höhere Werte lassen die Seite länger
        nachlaufen; das wirkt in einer Vorführung eindrucksvoll, fühlt sich beim
        Lesen aber träge an, weil die Seite nach dem Loslassen weiterrutscht.
      */
      lerp: 0.09,
      /*
        Strecke je Rastung, relativ zur Voreinstellung des Browsers. Etwas mehr
        als eins, weil die Bewegung durch das Ausgleiten langsamer erscheint als
        ein harter Sprung derselben Länge.
      */
      wheelMultiplier: 1.1,
      autoRaf: true,
    })

    return () => lenis.destroy()
  }, [])

  return null
}
