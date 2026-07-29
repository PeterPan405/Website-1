'use client'

import { useSyncExternalStore } from 'react'

import { bogen, type Werte } from '@/lib/vermoegen'

/**
 * Der ausgefüllte Vermögensbogen im Browser.
 *
 * Bewusst ohne Nutzerkonto: Eine vollständige Vermögensaufstellung ist das
 * Letzte, was man an einen Server schicken sollte. Sie liegt ausschließlich im
 * localStorage dieses Geräts – damit gibt es keine personenbezogenen Daten auf
 * dem Server, keine Anmeldung und keine Einwilligungspflicht, und der Bogen
 * steht beim nächsten Besuch trotzdem noch da.
 *
 * Angebunden über `useSyncExternalStore` statt über einen Effekt: Der Bogen
 * wird beim ersten Rendern nicht aus dem Speicher gelesen, sondern der Speicher
 * ist die Quelle, an der die Komponente hängt. Das erspart den Zustand
 * „geladen, aber noch nicht angezeigt“ – und damit die Runde synchroner
 * setState-Aufrufe, die React zu Recht bemängelt.
 */

const SPEICHER_SCHLUESSEL = 'fk-vermoegen'

export interface Bogenstand {
  /** Datum, auf das sich alle Werte beziehen, im Format JJJJ-MM-TT. */
  stichtag: string
  werte: Werte
}

/**
 * Stabiler Stand für das Server-Rendering.
 *
 * Der Stichtag ist hier bewusst leer und nicht das heutige Datum: Die Seite
 * wird beim Erzeugen der Website vorgerendert, „heute“ wäre also der Tag des
 * Bauens. Der Browser setzt das richtige Datum, sobald er übernimmt.
 */
const LEER: Bogenstand = { stichtag: '', werte: {} }

let cache: Bogenstand | null = null
const listeners = new Set<() => void>()

/** Das heutige Datum im Format JJJJ-MM-TT, in der Zeitzone des Geräts. */
export function heute(): string {
  const jetzt = new Date()
  const monat = `${jetzt.getMonth() + 1}`.padStart(2, '0')
  const tag = `${jetzt.getDate()}`.padStart(2, '0')
  return `${jetzt.getFullYear()}-${monat}-${tag}`
}

/**
 * Gelesene Werte auf die Posten begrenzen, die es im Bogen gibt.
 *
 * Ohne diesen Schritt käme jeder Inhalt in die Summen, den jemand von Hand in
 * den localStorage schreibt – und ein Posten, den eine spätere Fassung des
 * Bogens nicht mehr kennt, würde stumm mitgezählt.
 */
function bereinige(roh: unknown): Werte {
  const werte: Werte = {}
  if (typeof roh !== 'object' || roh === null) return werte

  for (const gruppe of bogen) {
    for (const posten of gruppe.posten) {
      const wert = (roh as Record<string, unknown>)[posten.id]
      if (typeof wert === 'number' && Number.isFinite(wert)) werte[posten.id] = wert
    }
  }
  return werte
}

function read(): Bogenstand {
  if (cache) return cache
  if (typeof window === 'undefined') return LEER

  try {
    const roh = window.localStorage.getItem(SPEICHER_SCHLUESSEL)
    const gelesen: unknown = roh ? JSON.parse(roh) : null
    const stand = (gelesen ?? {}) as Partial<Bogenstand>
    cache = {
      stichtag:
        typeof stand.stichtag === 'string' && stand.stichtag ? stand.stichtag : heute(),
      werte: bereinige(stand.werte),
    }
  } catch {
    // Privater Modus, voller Speicher oder beschädigter Inhalt: leer anfangen.
    cache = { stichtag: heute(), werte: {} }
  }
  return cache
}

function write(next: Bogenstand) {
  cache = next
  try {
    window.localStorage.setItem(SPEICHER_SCHLUESSEL, JSON.stringify(next))
  } catch {
    // Dann gilt die Eingabe eben nur für diese Sitzung.
  }
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)

  // Änderungen in einem anderen Tab übernehmen.
  function onStorage(event: StorageEvent) {
    if (event.key !== SPEICHER_SCHLUESSEL) return
    cache = null
    listeners.forEach((entry) => entry())
  }
  window.addEventListener('storage', onStorage)

  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

/** Der aktuelle Bogen. Während des Server-Renderings leer. */
export function useBogenstand(): Bogenstand {
  return useSyncExternalStore(subscribe, read, () => LEER)
}

export function setzeStichtag(stichtag: string) {
  write({ ...read(), stichtag })
}

/** Einen Betrag setzen – `undefined` löscht die Zeile wieder. */
export function setzeWert(id: string, wert: number | undefined) {
  const werte = { ...read().werte }
  if (wert === undefined) delete werte[id]
  else werte[id] = wert
  write({ ...read(), werte })
}

/** Alle Beträge löschen. Der Stichtag bleibt stehen. */
export function leereWerte() {
  write({ ...read(), werte: {} })
}
