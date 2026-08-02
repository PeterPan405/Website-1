'use client'

import { useEffect } from 'react'

/**
 * Meldet den Dienstarbeiter an, der den Lernbereich offline lesbar hält.
 *
 * Was er speichert und – wichtiger – was nicht, steht in `public/sw.js`:
 * nur Lernen, Akademie und Glossar, immer Netz zuerst. Kursseiten bekommen
 * nie eine Offline-Fassung, damit alte Zahlen nicht wie aktuelle aussehen.
 *
 * Die Anmeldung ist bewusst still: kein Hinweis, kein Banner. Wer offline
 * eine gelesene Lernseite öffnet, merkt, dass es geht – wer immer Netz hat,
 * merkt nichts.
 */
export function OfflineLernen() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Ohne Dienstarbeiter funktioniert die Website exakt wie vorher –
      // ein Fehlschlag hier ist kein Zustand, über den jemand reden muss.
    })
  }, [])

  return null
}
