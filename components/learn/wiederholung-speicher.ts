'use client'

import { useSyncExternalStore } from 'react'

import type { Karte } from '@/lib/wiederholung'

/**
 * Der Wiederholungsstand im Browser.
 *
 * Gleiches Prinzip wie Lernfortschritt und Quiz-Ergebnisse: allein im
 * localStorage dieses Geräts, kein Konto, nichts auf einem Server. Die Rechnung
 * dahinter – welches Fach, wann wieder fällig – steht in `lib/wiederholung.ts`
 * und ist geprüft; hier geht es nur ums Aufbewahren.
 *
 * ## Warum ein eigener Schlüssel und nicht der des Quiz
 *
 * Weil beide etwas anderes bedeuten. `fk-quiz-results` hält je Stufe das beste
 * Ergebnis fest – eine Bestleistung, die nicht altert. Eine Wiederholungskarte
 * ist das Gegenteil: Sie soll altern, das ist ihr Zweck. In einen Speicher
 * gelegt, müsste einer von beiden Zwecken nachgeben.
 */

const STORAGE_KEY = 'fk-wiederholung-1'

/** Stabile leere Referenz für das Server-Rendering. */
const EMPTY: readonly Karte[] = []

let cache: readonly Karte[] | null = null
const listeners = new Set<() => void>()

function istKarte(wert: unknown): wert is Karte {
  if (typeof wert !== 'object' || wert === null) return false
  const k = wert as Record<string, unknown>
  return (
    typeof k.id === 'string' &&
    typeof k.fach === 'number' &&
    typeof k.faellig === 'string' &&
    typeof k.versuche === 'number' &&
    typeof k.richtig === 'number'
  )
}

function read(): readonly Karte[] {
  if (cache) return cache
  if (typeof window === 'undefined') return EMPTY

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    cache = Array.isArray(parsed) ? parsed.filter(istKarte) : EMPTY
  } catch {
    // Privater Modus oder beschädigter Inhalt: leer starten statt abstürzen.
    cache = EMPTY
  }
  return cache
}

function write(next: readonly Karte[]) {
  cache = next
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Der Stand gilt dann nur für diese Sitzung.
  }
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)

  function onStorage(event: StorageEvent) {
    if (event.key !== STORAGE_KEY) return
    cache = null
    listeners.forEach((entry) => entry())
  }
  window.addEventListener('storage', onStorage)

  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

/** Alle gespeicherten Karten. Während des Server-Renderings leer. */
export function useKarten(): readonly Karte[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY)
}

/** Karten lesen, ohne an eine Komponente gebunden zu sein. */
export function leseKarten(): readonly Karte[] {
  return read()
}

/** Eine Karte einfügen oder ersetzen. */
export function speichereKarte(karte: Karte) {
  const bestand = read()
  const index = bestand.findIndex((eintrag) => eintrag.id === karte.id)
  if (index === -1) {
    write([...bestand, karte])
    return
  }
  const naechste = [...bestand]
  naechste[index] = karte
  write(naechste)
}

/** Setzt den Wiederholungsstand zurück. */
export function setzeWiederholungZurueck() {
  write(EMPTY)
}
