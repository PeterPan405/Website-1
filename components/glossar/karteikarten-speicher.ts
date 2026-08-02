'use client'

import { useSyncExternalStore } from 'react'

import type { Karte } from '@/lib/wiederholung'

/**
 * Der Karteikarten-Stand des Glossars im Browser.
 *
 * Baugleich mit `wiederholung-speicher.ts`, aber ein **eigener Schlüssel**:
 * Die Quiz-Wiederholung führt Multiple-Choice-Fragen der Lernstufen, die
 * Karteikarten führen Glossarbegriffe mit Selbsteinschätzung. In einem
 * Speicher vermischt, zeigte die Wiederholungsseite plötzlich Karten, zu
 * denen sie keine Frage kennt – und umgekehrt. Die Leitner-Rechnung dahinter
 * teilen sich beide (`lib/wiederholung.ts`), nur der Bestand ist getrennt.
 */

const STORAGE_KEY = 'fk-glossar-karten-1'

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
export function useGlossarKarten(): readonly Karte[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY)
}

/** Eine Karte einfügen oder ersetzen. */
export function speichereGlossarKarte(karte: Karte) {
  const bisher = read()
  write([...bisher.filter((eintrag) => eintrag.id !== karte.id), karte])
}

/** Alles vergessen – der Anfang von vorn. */
export function setzeKarteikartenZurueck() {
  write(EMPTY)
}
