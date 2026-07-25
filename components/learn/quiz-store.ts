'use client'

import { useSyncExternalStore } from 'react'

/**
 * Quiz-Ergebnisse im Browser.
 *
 * Gleiches Prinzip wie der Lernfortschritt in `progress-store.ts`: rein lokal im
 * localStorage, kein Konto, keine Serverübertragung. Gespeichert wird immer nur
 * das **beste** Ergebnis je Stufe – ein schlechterer zweiter Versuch soll den
 * erreichten Stand nicht wieder zunichtemachen.
 */

const STORAGE_KEY = 'fk-quiz-results'

export interface QuizResult {
  correct: number
  total: number
  /** ISO-Zeitstempel des Versuchs, der dieses Ergebnis erzielt hat. */
  at: string
}

export type QuizResults = Readonly<Record<string, QuizResult>>

/** Stabile leere Referenz für das Server-Rendering. */
const EMPTY: QuizResults = Object.freeze({})

let cache: QuizResults | null = null
const listeners = new Set<() => void>()

function isQuizResult(value: unknown): value is QuizResult {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.correct === 'number' &&
    typeof candidate.total === 'number' &&
    typeof candidate.at === 'string'
  )
}

function read(): QuizResults {
  if (cache) return cache
  if (typeof window === 'undefined') return EMPTY

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : {}
    if (typeof parsed !== 'object' || parsed === null) {
      cache = EMPTY
    } else {
      // Beschädigte oder fremde Einträge herausfiltern, statt zu vertrauen.
      const clean: Record<string, QuizResult> = {}
      for (const [key, value] of Object.entries(parsed)) {
        if (isQuizResult(value)) clean[key] = value
      }
      cache = clean
    }
  } catch {
    cache = EMPTY
  }
  return cache
}

function write(next: QuizResults) {
  cache = next
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Privater Modus: Das Ergebnis gilt dann nur für diese Sitzung.
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

/** Alle gespeicherten Quiz-Ergebnisse. Während des Server-Renderings leer. */
export function useQuizResults(): QuizResults {
  return useSyncExternalStore(subscribe, read, () => EMPTY)
}

/**
 * Speichert ein Ergebnis, sofern es besser als das bisherige ist.
 *
 * @returns `true`, wenn das Ergebnis eine neue persönliche Bestleistung war.
 */
export function saveQuizResult(key: string, correct: number, total: number): boolean {
  const current = read()
  const previous = current[key]
  if (previous && previous.correct >= correct) return false

  write({ ...current, [key]: { correct, total, at: new Date().toISOString() } })
  return true
}

/** Löscht alle Quiz-Ergebnisse. */
export function resetQuizResults() {
  write(EMPTY)
}
