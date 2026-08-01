'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Ein schmaler Fortschrittsbalken am oberen Fensterrand beim Lesen.
 *
 * ## Was er misst – und was absichtlich nicht
 *
 * Gemessen wird der nächstgelegene `<article>`-Vorfahre, nicht die Seite:
 * Quellen, Schlagwörter, verwandte Artikel und die Seitenleiste gehören
 * nicht zum Lesefortschritt. Bei langen Artikeln beantwortet der Balken die
 * eine Frage, die die Rollleiste des Browsers nicht beantwortet: Wie viel
 * vom **Text** liegt noch vor mir?
 *
 * ## Handwerkliches
 *
 * - Nur ein `width`-Anteil wird gesetzt, keine Animation – damit gibt es
 *   auch nichts, was `prefers-reduced-motion` verletzen könnte.
 * - Das Scroll-Ereignis ist über `requestAnimationFrame` gedrosselt und
 *   passiv angemeldet.
 * - Im Ausdruck verschwindet der Balken (`data-drucken="aus"`): Papier hat
 *   keinen Fortschritt.
 * - `aria-hidden`, weil die Information rein visuell ist – Vorleseprogramme
 *   haben mit der Gliederung des Artikels den besseren Fortschrittsbegriff.
 */
export function Leseleiste() {
  const marke = useRef<HTMLSpanElement>(null)
  const [anteil, setAnteil] = useState(0)

  useEffect(() => {
    const artikel = marke.current?.closest('article')
    if (!artikel) return

    let angefordert = false
    const messen = () => {
      angefordert = false
      const kasten = artikel.getBoundingClientRect()
      const gelesen = window.innerHeight - kasten.top
      const neu = kasten.height > 0 ? gelesen / kasten.height : 0
      setAnteil(Math.min(1, Math.max(0, neu)))
    }
    const beiScroll = () => {
      if (angefordert) return
      angefordert = true
      requestAnimationFrame(messen)
    }

    messen()
    window.addEventListener('scroll', beiScroll, { passive: true })
    window.addEventListener('resize', beiScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', beiScroll)
      window.removeEventListener('resize', beiScroll)
    }
  }, [])

  return (
    <span ref={marke} aria-hidden="true" data-drucken="aus">
      <span
        className="bg-news fixed inset-x-0 top-0 z-50 block h-0.5 origin-left"
        style={{ transform: `scaleX(${anteil})` }}
      />
    </span>
  )
}
