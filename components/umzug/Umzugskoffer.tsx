'use client'

import { useEffect, useRef, useState } from 'react'

import { Icon } from '@/components/ui/Icon'
import {
  BESTAENDE,
  baueUmzug,
  pruefeUmzug,
  zaehleEintraege,
  type Umzugsinhalt,
} from '@/lib/umzug'

/**
 * Herunterladen und Einlesen der Umzugsdatei.
 *
 * Die Regeln – was mitkommt, warum Einlesen ersetzt statt ergänzt, warum
 * die Werte roh bleiben – stehen in `lib/umzug.ts` und sind dort geprüft.
 * Hier passiert nur Bedienung: Datei bauen und herunterladen; Datei wählen,
 * Inhalt **zeigen**, und erst nach einem ausdrücklichen zweiten Klick
 * übernehmen. Ein Import, der beim Dateiwählen sofort schreibt, wäre ein
 * Klick zu wenig für eine Aktion, die den Lernstand eines Geräts ersetzt.
 *
 * Nach der Übernahme lädt die Seite neu: Die Speicher-Hooks halten ihre
 * Stände im Arbeitsspeicher vor, und ein Neuladen ist der eine Weg, der
 * alle zehn zugleich sicher auffrischt.
 */
export function Umzugskoffer() {
  const dateiwahl = useRef<HTMLInputElement>(null)
  const [gelesen, setzeGelesen] = useState<{
    inhalt: Umzugsinhalt
    bestaende: Record<string, string>
  } | null>(null)
  const [fehler, setzeFehler] = useState<string | null>(null)
  const [uebernommen, setzeUebernommen] = useState(false)

  /**
   * Was auf diesem Gerät gerade vorhanden ist – für die Übersicht.
   *
   * Erst nach der Übernahme durch den Browser gelesen: Der Server kennt den
   * localStorage nicht, und ein Lesen beim Rendern ergäbe zwei verschiedene
   * erste Bilder.
   */
  const [vorhanden, setzeVorhanden] = useState<
    { schluessel: string; name: string; anzahl: number | null }[]
  >([])
  useEffect(() => {
    setzeVorhanden(
      BESTAENDE.flatMap(({ schluessel, name }) => {
        let wert: string | null = null
        try {
          wert = window.localStorage.getItem(schluessel)
        } catch {
          wert = null
        }
        if (wert === null) return []
        return [{ schluessel, name, anzahl: zaehleEintraege(wert) }]
      })
    )
  }, [])

  function herunterladen() {
    const datei = baueUmzug(
      (schluessel) => {
        try {
          return window.localStorage.getItem(schluessel)
        } catch {
          return null
        }
      },
      new Date().toISOString().slice(0, 10)
    )
    const blob = new Blob([`${JSON.stringify(datei, null, 2)}\n`], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const anker = document.createElement('a')
    anker.href = url
    anker.download = `im-invests-umzug-${datei.erstellt}.json`
    anker.click()
    URL.revokeObjectURL(url)
  }

  async function dateiGewaehlt(liste: FileList | null) {
    setzeGelesen(null)
    setzeFehler(null)
    setzeUebernommen(false)
    const datei = liste?.[0]
    if (!datei) return

    const ergebnis = pruefeUmzug(await datei.text())
    if ('fehler' in ergebnis) {
      setzeFehler(ergebnis.fehler)
      return
    }
    setzeGelesen(ergebnis)
  }

  function uebernehmen() {
    if (!gelesen) return
    try {
      for (const [schluessel, wert] of Object.entries(gelesen.bestaende)) {
        window.localStorage.setItem(schluessel, wert)
      }
    } catch {
      setzeFehler(
        'Der Speicher dieses Browsers nimmt gerade nichts an (voll oder privater Modus).'
      )
      return
    }
    setzeUebernommen(true)
    // Neu laden, damit alle Speicher-Hooks den neuen Stand sehen.
    window.setTimeout(() => window.location.reload(), 1200)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ------------------------------------------------------ Mitnehmen */}
      <section aria-labelledby="mitnehmen" className="fk-card p-6">
        <h2 id="mitnehmen" className="text-fg text-lg font-semibold">
          Von diesem Gerät mitnehmen
        </h2>
        {vorhanden.length === 0 ? (
          <p className="text-fg-muted mt-3 text-sm leading-relaxed">
            Auf diesem Gerät ist noch nichts gespeichert – es gibt nichts mitzunehmen.
          </p>
        ) : (
          <>
            <ul className="text-fg-muted mt-3 space-y-1 text-sm">
              {vorhanden.map((eintrag) => (
                <li key={eintrag.schluessel} className="flex justify-between gap-3">
                  <span>{eintrag.name}</span>
                  <span className="text-fg-subtle tabular-nums">
                    {eintrag.anzahl === null
                      ? 'vorhanden'
                      : `${eintrag.anzahl} ${eintrag.anzahl === 1 ? 'Eintrag' : 'Einträge'}`}
                  </span>
                </li>
              ))}
            </ul>
            <button type="button" onClick={herunterladen} className="fk-btn-primary mt-5">
              <Icon name="download" className="size-4" />
              Umzugsdatei herunterladen
            </button>
            <p className="text-fg-subtle mt-3 text-xs leading-relaxed">
              Die Datei entsteht hier im Browser und wird nirgendwohin gesendet. Sie kann
              deine Vermögensübersicht enthalten – behandle sie wie ein Bankdokument,
              nicht wie einen Link.
            </p>
          </>
        )}
      </section>

      {/* ------------------------------------------------------- Einlesen */}
      <section aria-labelledby="einlesen" className="fk-card p-6">
        <h2 id="einlesen" className="text-fg text-lg font-semibold">
          Auf diesem Gerät einlesen
        </h2>
        <p className="text-fg-muted mt-3 text-sm leading-relaxed">
          Wähle eine Umzugsdatei vom alten Gerät. Erst danach siehst du, was sie enthält –
          übernommen wird nichts ohne den zweiten Klick.
        </p>
        <input
          ref={dateiwahl}
          type="file"
          accept="application/json,.json"
          onChange={(ereignis) => dateiGewaehlt(ereignis.target.files)}
          aria-label="Umzugsdatei wählen"
          className="text-fg-muted file:fk-btn-secondary mt-4 block w-full text-sm file:mr-3"
        />

        {fehler && (
          <p role="status" className="text-danger mt-3 text-sm leading-relaxed">
            {fehler}
          </p>
        )}

        {gelesen && !uebernommen && (
          <div className="mt-4">
            <p className="text-fg text-sm font-medium">
              Die Datei{gelesen.inhalt.erstellt ? ` vom ${gelesen.inhalt.erstellt}` : ''}{' '}
              enthält:
            </p>
            <ul className="text-fg-muted mt-2 space-y-1 text-sm">
              {gelesen.inhalt.eintraege.map((eintrag) => (
                <li key={eintrag.schluessel} className="flex justify-between gap-3">
                  <span>{eintrag.name}</span>
                  <span className="text-fg-subtle tabular-nums">
                    {eintrag.anzahl === null
                      ? 'vorhanden'
                      : `${eintrag.anzahl} ${eintrag.anzahl === 1 ? 'Eintrag' : 'Einträge'}`}
                  </span>
                </li>
              ))}
            </ul>
            {gelesen.inhalt.unbekannt.length > 0 && (
              <p className="text-fg-subtle mt-2 text-xs leading-relaxed">
                Übersprungen, weil hier unbekannt: {gelesen.inhalt.unbekannt.join(', ')}
              </p>
            )}
            <p className="text-fg-muted mt-3 text-sm leading-relaxed">
              Übernehmen <strong className="text-fg">ersetzt</strong> diese Bestände auf
              diesem Gerät. Alles, was nicht in der Datei steht, bleibt unangetastet.
            </p>
            <button type="button" onClick={uebernehmen} className="fk-btn-primary mt-4">
              <Icon name="check" className="size-4" />
              Jetzt übernehmen
            </button>
          </div>
        )}

        {uebernommen && (
          <p role="status" className="text-fg mt-4 text-sm leading-relaxed">
            Übernommen. Die Seite lädt gleich neu, damit überall der neue Stand steht.
          </p>
        )}
      </section>
    </div>
  )
}
