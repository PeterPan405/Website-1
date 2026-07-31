'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

import { Icon } from '@/components/ui/Icon'
import {
  alsCsv,
  alsPdfZeilen,
  dateiname,
  type Ergebnisbericht,
} from '@/lib/ergebnis-bericht'
import { erzeugePdf, type PdfZeile } from '@/lib/pdf'
import { dokumentFusszeile, erstelltAm } from '@/lib/rechtshinweis'
import { siteConfig } from '@/lib/site'

/**
 * Das Ergebnis eines Rechners zum Mitnehmen.
 *
 * ## Warum ein Kontext und kein Prop
 *
 * Der Knopf gehört auf die Rechnerseite, das Ergebnis kennt aber nur der
 * Rechner tief darin. Ihn von oben durchzureichen hieße, jede der neun
 * Rechnerkomponenten um einen Rückkanal zu erweitern und `CalculatorPage` um
 * einen Zustand, der sie nichts angeht.
 *
 * So meldet sich jeder Rechner mit einer Zeile an – `useErgebnisbericht(...)` –
 * und der Knopf erscheint von selbst. Wer keinen Bericht meldet, bekommt
 * keinen Knopf; es gibt keinen Zustand „Knopf da, aber nichts dahinter“.
 *
 * ## Warum erst beim Klick gebaut wird
 *
 * Ein PDF, das niemand anfordert, muss auch nicht entstehen. Beim Klick sind
 * es wenige Millisekunden, im Hintergrund wären es bei jedem Tastendruck im
 * Rechner dieselben Millisekunden.
 */

const Kanal = createContext<{
  bericht: Ergebnisbericht | null
  melde: (b: Ergebnisbericht | null) => void
} | null>(null)

export function ErgebnisAnbieter({ children }: { children: ReactNode }) {
  const [bericht, melde] = useState<Ergebnisbericht | null>(null)
  return <Kanal.Provider value={{ bericht, melde }}>{children}</Kanal.Provider>
}

/**
 * Meldet den aktuellen Stand eines Rechners zum Herunterladen an.
 *
 * `null` heißt „gerade nichts Sinnvolles“ – etwa eine leere Depotaufstellung.
 * Dann verschwindet der Knopf, statt eine Datei mit Nullen anzubieten.
 */
export function useErgebnisbericht(bericht: Ergebnisbericht | null) {
  const kanal = useContext(Kanal)
  const melde = kanal?.melde
  /*
    Der Bericht wird bei jedem Tastendruck neu gebaut und ist deshalb bei jedem
    Rendern ein neues Objekt. Als Abhängigkeit genommen liefe der Effekt endlos.
    Verglichen wird deshalb der Inhalt – er ist klein, und JSON ist hier die
    ehrlichste Form von „hat sich etwas geändert“.
  */
  const kennung = bericht ? JSON.stringify(bericht) : null
  useEffect(() => {
    if (!melde) return
    melde(kennung ? (JSON.parse(kennung) as Ergebnisbericht) : null)
    return () => melde(null)
  }, [kennung, melde])
}

function herunterladen(inhalt: Blob, name: string) {
  const adresse = URL.createObjectURL(inhalt)
  const verweis = document.createElement('a')
  verweis.href = adresse
  verweis.download = name
  verweis.rel = 'noopener'
  document.body.append(verweis)
  verweis.click()
  verweis.remove()
  /*
    Nicht sofort zurückgeben: Der Klick stößt den Download nur an, der Browser
    liest die Adresse erst danach. Dieselbe Falle steht in `NetWorthSheet`
    ausführlich beschrieben – sie hat dort schon einmal zugeschlagen.
  */
  window.setTimeout(() => URL.revokeObjectURL(adresse), 60_000)
}

/** Die Adresse ohne Protokoll, für die Fußzeile des Dokuments. */
const adresse = siteConfig.url.replace(/^https?:\/\//, '').replace(/\/$/, '')

export function ErgebnisDownload() {
  const kanal = useContext(Kanal)
  const bericht = kanal?.bericht ?? null
  if (!bericht) return null

  function ladePdf() {
    if (!bericht) return
    const jetzt = new Date()
    const bytes = erzeugePdf({
      titel: bericht.titel,
      untertitel: erstelltAm(jetzt),
      marke: siteConfig.name,
      fusszeile: dokumentFusszeile(`${adresse}${bericht.pfad}`),
      /*
        `alsPdfZeilen` beschreibt die Zeilen mit weiten Typen, damit das Modul
        ohne Abhängigkeit auf `lib/pdf.ts` testbar bleibt. Hier ist der Bezug
        wieder da, und die Zusicherung ist an genau einer Stelle.
      */
      zeilen: alsPdfZeilen(bericht, jetzt) as PdfZeile[],
    })
    herunterladen(
      new Blob([bytes as BlobPart], { type: 'application/pdf' }),
      dateiname(bericht.titel, jetzt, 'pdf')
    )
  }

  function ladeCsv() {
    if (!bericht) return
    const jetzt = new Date()
    /*
      Das Byte-Order-Mark davor, sonst liest eine deutsche Tabellenkalkulation
      die Datei als Windows-1252 und macht aus jedem Umlaut ein Fragezeichen.
    */
    herunterladen(
      new Blob(['﻿', alsCsv(bericht, jetzt)], { type: 'text/csv;charset=utf-8' }),
      dateiname(bericht.titel, jetzt, 'csv')
    )
  }

  return (
    <section className="fk-card mt-8 p-5 sm:p-6">
      <h2 className="text-fg text-lg font-semibold">Ergebnis mitnehmen</h2>
      <p className="text-fg-muted mt-2 text-sm leading-relaxed">
        Das Blatt enthält die Annahmen, das Ergebnis und die Hinweise dazu – damit die
        Zahl auch in einem Jahr noch einzuordnen ist. Erstellt wird es im Browser; es
        werden keine Daten übertragen.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={ladePdf} className="fk-btn-secondary">
          <Icon name="download" className="size-4" />
          Als PDF
        </button>
        <button type="button" onClick={ladeCsv} className="fk-btn-ghost">
          <Icon name="download" className="size-4" />
          Als Tabelle (CSV)
        </button>
      </div>
      <p className="text-fg-subtle mt-3 text-xs leading-relaxed">
        Modellrechnung, keine Anlage- oder Steuerberatung. Der vollständige Hinweis steht
        auf dem Dokument.
      </p>
    </section>
  )
}
