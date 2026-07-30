'use client'

import { useSyncExternalStore } from 'react'

/**
 * Die Merkliste im Browser.
 *
 * ## Warum ohne Konto
 *
 * Dieselbe Entscheidung wie beim Lernfortschritt und den Quiz-Ergebnissen: Was
 * jemand beobachtet, ist eine Aussage über sein Geld. Sie gehört nicht auf
 * einen fremden Server, und ohne Server gibt es auch nichts zu verlieren –
 * kein Konto, keine Anmeldung, keine Datenschutzerklärung, die etwas erklären
 * müsste.
 *
 * Der Preis steht dabei und wird auf der Seite genannt: Die Liste gilt für
 * diesen Browser. Wer das Gerät wechselt, fängt neu an, und wer die
 * Browserdaten löscht, löscht sie mit.
 *
 * ## Warum nur Symbole
 *
 * Gespeichert wird die Kennung des Instruments und der Zeitpunkt, sonst
 * nichts. Kurse, Termine und Renditen kommen aus dem gebauten Bestand – sie
 * hier mitzuspeichern hieße, sie einzufrieren: Die Merkliste zeigte dann
 * Wochen später noch den Kurs vom Tag des Merkens, und niemand käme darauf,
 * dass die Zahl alt ist.
 */

const STORAGE_KEY = 'fk-merkliste'

/** Ein gemerktes Instrument. */
export interface Merkeintrag {
  symbol: string
  /** ISO-Zeitstempel des Merkens – die Liste steht nach ihm sortiert. */
  at: string
}

/** Stabile leere Referenz für das Server-Rendering. */
const EMPTY: readonly Merkeintrag[] = Object.freeze([])

/**
 * Obergrenze, damit die Liste eine Liste bleibt.
 *
 * Wer zweihundert Titel merkt, hat keine Merkliste mehr, sondern eine zweite
 * Marktübersicht – und die gibt es schon. Beim Überschreiten fällt der älteste
 * Eintrag heraus, sichtbar und mit Hinweis.
 */
export const HOECHSTZAHL = 50

let cache: readonly Merkeintrag[] | null = null
const listeners = new Set<() => void>()

function istEintrag(wert: unknown): wert is Merkeintrag {
  if (typeof wert !== 'object' || wert === null) return false
  const kandidat = wert as Record<string, unknown>
  return typeof kandidat.symbol === 'string' && typeof kandidat.at === 'string'
}

function read(): readonly Merkeintrag[] {
  if (cache) return cache
  if (typeof window === 'undefined') return EMPTY

  try {
    const roh = window.localStorage.getItem(STORAGE_KEY)
    const gelesen: unknown = roh ? JSON.parse(roh) : []
    /*
      Fremde oder beschädigte Einträge herausfiltern, statt ihnen zu vertrauen.
      Im localStorage steht, was irgendwann einmal hineingeschrieben wurde – auch
      von einer älteren Fassung dieser Website.
    */
    cache = Array.isArray(gelesen) ? Object.freeze(gelesen.filter(istEintrag)) : EMPTY
  } catch {
    cache = EMPTY
  }
  return cache
}

function write(naechste: readonly Merkeintrag[]) {
  cache = Object.freeze([...naechste])
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache))
  } catch {
    // Privater Modus oder voller Speicher: Die Liste gilt dann nur für diese Sitzung.
  }
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)

  /*
    Auf Änderungen aus anderen Tabs hören. Wer in einem Tab etwas merkt und in
    einem anderen die Merkliste offen hat, soll dort nicht einen veralteten
    Stand sehen.
  */
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

/** Die Merkliste, jüngster Eintrag zuerst. Während des Server-Renderings leer. */
export function useMerkliste(): readonly Merkeintrag[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY)
}

/** Ob ein Instrument gemerkt ist. */
export function istGemerkt(liste: readonly Merkeintrag[], symbol: string): boolean {
  return liste.some((eintrag) => eintrag.symbol === symbol)
}

/**
 * Merkt ein Instrument oder entfernt es wieder.
 *
 * @returns `true`, wenn es danach gemerkt ist.
 */
export function merkenUmschalten(symbol: string): boolean {
  const jetzt = read()
  if (jetzt.some((eintrag) => eintrag.symbol === symbol)) {
    write(jetzt.filter((eintrag) => eintrag.symbol !== symbol))
    return false
  }

  const neu = [{ symbol, at: new Date().toISOString() }, ...jetzt]
  write(neu.slice(0, HOECHSTZAHL))
  return true
}

/** Entfernt ein Instrument aus der Liste. */
export function entferneAusMerkliste(symbol: string) {
  write(read().filter((eintrag) => eintrag.symbol !== symbol))
}

/** Leert die Merkliste. */
export function leereMerkliste() {
  write(EMPTY)
}
