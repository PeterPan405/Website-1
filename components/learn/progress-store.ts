'use client'

import { useSyncExternalStore } from 'react'

/**
 * Lernfortschritt im Browser.
 *
 * Bewusst ohne Nutzerkonto: Der Fortschritt liegt ausschließlich im
 * localStorage des Geräts. Damit gibt es keine personenbezogenen Daten auf dem
 * Server, keine Anmeldung und keine Einwilligungspflicht – und der Lernbereich
 * funktioniert trotzdem mit Fortschrittsanzeige.
 *
 * Angebunden über `useSyncExternalStore`, damit alle Komponenten auf derselben
 * Quelle arbeiten und sich sofort aktualisieren, wenn eine Stufe abgeschlossen
 * wird.
 */

const STORAGE_KEY = 'fk-learn-progress'

/** Stabile leere Referenz für das Server-Rendering. */
const EMPTY: readonly string[] = []

let cache: readonly string[] | null = null
const listeners = new Set<() => void>()

/** Schlüssel eines Fortschrittseintrags: `thema:stufe`. */
export function levelKey(topicSlug: string, levelId: string): string {
  return `${topicSlug}:${levelId}`
}

function read(): readonly string[] {
  if (cache) return cache
  if (typeof window === 'undefined') return EMPTY

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    cache = Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : []
  } catch {
    // Privater Modus, voller Speicher oder beschädigter Inhalt: leer starten.
    cache = EMPTY
  }
  return cache
}

function write(next: readonly string[]) {
  cache = next
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Fortschritt gilt dann nur für die aktuelle Sitzung.
  }
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)

  // Änderungen in einem anderen Tab übernehmen.
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

/** Alle abgeschlossenen Stufen. Während des Server-Renderings leer. */
export function useCompletedLevels(): readonly string[] {
  return useSyncExternalStore(
    subscribe,
    read,
    // Der Server kennt den localStorage nicht – dort ist der Fortschritt leer.
    () => EMPTY
  )
}

export function markComplete(key: string) {
  const current = read()
  if (current.includes(key)) return
  write([...current, key])
}

export function markIncomplete(key: string) {
  const current = read()
  if (!current.includes(key)) return
  write(current.filter((entry) => entry !== key))
}

export function toggleComplete(key: string): boolean {
  const current = read()
  const isComplete = current.includes(key)
  if (isComplete) markIncomplete(key)
  else markComplete(key)
  return !isComplete
}

/** Setzt den gesamten Fortschritt zurück. */
export function resetProgress() {
  write([])
}
