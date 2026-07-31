'use client'

import { useSyncExternalStore } from 'react'

import { entferneVorsilben, raeumeAuf, zaehle, type Suchluecke } from '@/lib/suchluecken'

/**
 * Das Protokoll erfolgloser Suchen im Browser.
 *
 * Dieselbe Bauart wie `components/markets/merkliste-speicher.ts`: ein
 * Schlüssel im `localStorage`, ein Zwischenspeicher im Modul, `storage`-Ereignisse
 * für andere Tabs. Die Regeln, was gezählt wird, stehen in `lib/suchluecken.ts`
 * und sind dort geprüft; hier steht nur, wie es auf die Platte kommt.
 *
 * ## Warum es das Gerät nicht verlässt
 *
 * Weil ein Suchfeld entgegennimmt, was jemand eintippt. Es unbemerkt
 * fortzuschicken wäre Tracking, und davon gibt es hier nichts. Sichtbar wird
 * das Protokoll unter `/suche/luecken`; weggehen kann es nur, wenn jemand es
 * dort selbst kopiert.
 */

const STORAGE_KEY = 'fk-suchluecken'

/** Stabile leere Referenz für das Server-Rendering. */
const LEER: readonly Suchluecke[] = Object.freeze([])

let cache: readonly Suchluecke[] | null = null
const listeners = new Set<() => void>()

function istEintrag(wert: unknown): wert is Suchluecke {
  if (typeof wert !== 'object' || wert === null) return false
  const kandidat = wert as Record<string, unknown>
  return (
    typeof kandidat.anfrage === 'string' &&
    typeof kandidat.anzahl === 'number' &&
    Number.isFinite(kandidat.anzahl) &&
    typeof kandidat.zuletzt === 'string'
  )
}

function read(): readonly Suchluecke[] {
  if (cache) return cache
  if (typeof window === 'undefined') return LEER

  try {
    const roh = window.localStorage.getItem(STORAGE_KEY)
    const gelesen: unknown = roh ? JSON.parse(roh) : []
    cache = Array.isArray(gelesen)
      ? Object.freeze(raeumeAuf(gelesen.filter(istEintrag)))
      : LEER
  } catch {
    cache = LEER
  }
  return cache
}

function write(naechste: readonly Suchluecke[]) {
  cache = Object.freeze([...naechste])
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache))
  } catch {
    // Privater Modus oder voller Speicher: Das Protokoll gilt dann nur für diese Sitzung.
  }
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)

  function onStorage(event: StorageEvent) {
    if (event.key !== STORAGE_KEY) return
    cache = null
    listeners.forEach((eintrag) => eintrag())
  }
  window.addEventListener('storage', onStorage)

  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

/** Das Protokoll, häufigste Anfrage zuerst. Während des Server-Rendering leer. */
export function useSuchluecken(): readonly Suchluecke[] {
  return useSyncExternalStore(subscribe, read, () => LEER)
}

/** Nimmt eine erfolglose Anfrage auf. */
export function merkeLuecke(anfrage: string) {
  write(zaehle(read(), anfrage))
}

/**
 * Meldet, dass eine Anfrage etwas gefunden hat.
 *
 * Räumt ihre bereits protokollierten Vorsilben weg – siehe `lib/suchluecken.ts`.
 * Schreibt nur, wenn sich dadurch etwas ändert: Jeder Tastendruck einer
 * erfolgreichen Suche liefe sonst in einen `localStorage`-Schreibvorgang.
 */
export function meldeTreffer(anfrage: string) {
  const jetzt = read()
  const naechste = entferneVorsilben(jetzt, anfrage)
  if (naechste.length !== jetzt.length) write(naechste)
}

/** Löscht das Protokoll. */
export function leereSuchluecken() {
  write(LEER)
}

/** Entfernt eine einzelne Anfrage. */
export function entferneLuecke(anfrage: string) {
  write(read().filter((eintrag) => eintrag.anfrage !== anfrage))
}
