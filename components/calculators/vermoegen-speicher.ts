'use client'

import { useSyncExternalStore } from 'react'

import {
  ausAltemFormat,
  bogen,
  neueZeile,
  zeilenVon,
  type Werte,
  type Zeile,
} from '@/lib/vermoegen'

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
 *
 * ## Zwei Formen, eine Wahrheit
 *
 * Früher stand je Posten eine Zahl im Speicher, heute eine Liste von Zeilen.
 * Wer den Bogen vorher ausgefüllt hat, hat die alte Form auf seinem Gerät –
 * und die soll beim nächsten Besuch nicht einfach weg sein. Gelesen wird
 * deshalb beides; geschrieben nur noch die neue.
 */
function bereinige(roh: unknown): Werte {
  const werte: Werte = {}
  if (typeof roh !== 'object' || roh === null) return werte

  const quelle = roh as Record<string, unknown>

  for (const gruppe of bogen) {
    for (const posten of gruppe.posten) {
      const wert = quelle[posten.id]

      // Die alte Form: eine Zahl je Posten.
      if (typeof wert === 'number' && Number.isFinite(wert)) {
        werte[posten.id] = ausAltemFormat({ [posten.id]: wert })[posten.id]
        continue
      }

      if (!Array.isArray(wert)) continue

      const zeilen: Zeile[] = []
      for (const eintrag of wert) {
        if (typeof eintrag !== 'object' || eintrag === null) continue
        const { id, name, betrag } = eintrag as Partial<Zeile>
        if (typeof betrag !== 'number' || !Number.isFinite(betrag)) continue
        zeilen.push({
          id: typeof id === 'string' && id ? id : neueZeile().id,
          name: typeof name === 'string' && name.trim() ? name : undefined,
          betrag,
        })
      }
      if (zeilen.length > 0) werte[posten.id] = zeilen
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

/** Die Zeilen eines Postens ersetzen. Eine leere Liste löscht ihn ganz. */
function setzeZeilen(posten: string, zeilen: Zeile[]) {
  const werte = { ...read().werte }
  if (zeilen.length === 0) delete werte[posten]
  else werte[posten] = zeilen
  write({ ...read(), werte })
}

/**
 * Die Zeilen eines Postens, um die angesprochene ergänzt.
 *
 * ## Warum das nötig ist
 *
 * Ein Posten ohne Eintrag zeigt im Bogen trotzdem eine Zeile – sonst gäbe es
 * nichts, in das man schreiben könnte. Diese Zeile steht aber noch in keinem
 * Speicher. Ohne diese Stelle liefe die erste Eingabe deshalb ins Leere: Die
 * Zuordnung fände die Nummer nicht, änderte nichts und schriebe eine leere
 * Liste zurück. Genau das ist beim ersten Versuch passiert – 2.000 Euro
 * eingetippt, „+“ gedrückt, Betrag weg.
 */
function mitZeile(posten: string, zeileId: string): Zeile[] {
  const vorhanden = zeilenVon(read().werte, posten)
  return vorhanden.some((zeile) => zeile.id === zeileId)
    ? vorhanden
    : [...vorhanden, { id: zeileId, betrag: 0 }]
}

/**
 * Einen Betrag setzen – `undefined` bedeutet: Feld leer.
 *
 * Die Zeile bleibt dabei stehen. Sie zu entfernen, sobald das Feld leer ist,
 * wäre naheliegend und im Weg: Wer eine Zahl korrigieren will, löscht sie
 * zuerst – und bekäme die Zeile unter den Fingern weggezogen. Weg ist sie erst
 * mit dem Kreuz daneben. In der Datei taucht eine leere Zeile ohnehin nicht auf.
 */
export function setzeBetrag(posten: string, zeileId: string, wert: number | undefined) {
  setzeZeilen(
    posten,
    mitZeile(posten, zeileId).map((zeile) =>
      zeile.id === zeileId ? { ...zeile, betrag: wert ?? 0 } : zeile
    )
  )
}

/** Die Bezeichnung einer Zeile ändern. */
export function setzeName(posten: string, zeileId: string, name: string) {
  setzeZeilen(
    posten,
    mitZeile(posten, zeileId).map((zeile) =>
      zeile.id === zeileId ? { ...zeile, name: name.trim() ? name : undefined } : zeile
    )
  )
}

/** Eine weitere Zeile an einen Posten hängen und ihre Nummer zurückgeben. */
export function ergaenzeZeile(posten: string): string {
  const zeile = neueZeile()
  const vorhanden = zeilenVon(read().werte, posten)
  /*
    Hat der Posten noch gar keine Zeile, entstehen zwei: die bisher gedachte
    erste und die neue. Sonst verschwände beim ersten Klick auf das Plus die
    Zeile, in die man gerade etwas eintragen wollte.
  */
  const grundlage = vorhanden.length === 0 ? [neueZeile()] : vorhanden
  setzeZeilen(posten, [...grundlage, zeile])
  return zeile.id
}

/** Eine Zeile entfernen. */
export function entferneZeile(posten: string, zeileId: string) {
  setzeZeilen(
    posten,
    zeilenVon(read().werte, posten).filter((zeile) => zeile.id !== zeileId)
  )
}

/** Alle Beträge löschen. Der Stichtag bleibt stehen. */
export function leereWerte() {
  write({ ...read(), werte: {} })
}
