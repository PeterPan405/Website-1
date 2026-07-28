'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { Icon } from '@/components/ui/Icon'
import {
  ausweichAdresse,
  brauchtUebersetzung,
  darfUebersetzen,
  inBloecke,
  SPRACH_SCHLUESSEL,
} from '@/lib/uebersetzung'

/**
 * Schaltet die Seite zwischen Deutsch und Englisch um.
 *
 * ## Wie übersetzt wird
 *
 * Mit dem Übersetzer, den der Browser mitbringt (`Translator`, verfügbar in
 * aktuellen Chromium-Browsern). Der arbeitet auf dem Gerät: Es verlässt kein
 * Satz die Maschine des Besuchers, es wird kein fremdes Skript geladen, und es
 * gibt nichts, wofür eine Einwilligung einzuholen wäre.
 *
 * Beim ersten Mal lädt der Browser dafür ein Sprachmodell herunter. Das dauert
 * je nach Verbindung eine Weile, weshalb der Knopf währenddessen den Fortschritt
 * zeigt, statt so zu tun, als sei nichts.
 *
 * ## Warum die Übersetzung direkt im Text passiert
 *
 * Ersetzt werden die Textknoten selbst, nicht `innerHTML` ganzer Abschnitte.
 * Das klingt umständlicher, hält aber alles zusammen, was zwischen den Wörtern
 * steht: Verweise, Hervorhebungen, Zahlenformate, die Reihenfolge der
 * Tabellenzellen. Wer stattdessen `innerHTML` überschreibt, verliert bei jedem
 * Absatz mit einem Link genau diesen Link.
 *
 * Die Ausgangstexte bleiben in einer Map stehen, damit das Zurückschalten kein
 * Neuladen braucht.
 *
 * ## Wenn der Browser keinen Übersetzer hat
 *
 * Dann wird nichts vorgetäuscht. Der Knopf öffnet die Seite in einem neuen Tab
 * bei einem Übersetzungsdienst – ein Verweis nach außen, den man anklickt oder
 * eben nicht.
 */

/** Der Teil der Browser-Schnittstelle, der hier gebraucht wird. */
interface Uebersetzer {
  translate(text: string): Promise<string>
  destroy?: () => void
}
interface UebersetzerBauer {
  availability(sprachen: {
    sourceLanguage: string
    targetLanguage: string
  }): Promise<string>
  create(einstellungen: {
    sourceLanguage: string
    targetLanguage: string
    monitor?: (m: EventTarget) => void
  }): Promise<Uebersetzer>
}

function bauer(): UebersetzerBauer | null {
  const fenster = window as unknown as { Translator?: UebersetzerBauer }
  return fenster.Translator ?? null
}

type Zustand = 'deutsch' | 'laedt' | 'englisch'

/**
 * Die Ausgangstexte, um zurückschalten zu können.
 *
 * Steht bewusst neben der Komponente und nicht in einem `useRef`: Der Inhalt
 * dieser Map wird verändert, und veränderliche Zustände gehören nicht in etwas,
 * das React zwischen zwei Renderdurchläufen hindurchreicht. Die Kopfzeile gibt
 * es genau einmal auf der Seite, also gibt es auch genau eine Map.
 */
const ausgangstexte = new Map<Text, string>()

export function SprachUmschalter({ className }: { className?: string }) {
  const [zustand, setZustand] = useState<Zustand>('deutsch')
  const [fortschritt, setFortschritt] = useState(0)
  const uebersetzerRef = useRef<Uebersetzer | null>(null)

  /** Alle übersetzbaren Textknoten unterhalb eines Elements. */
  const textknoten = useCallback((wurzel: Node): Text[] => {
    const gefunden: Text[] = []
    const lauf = document.createTreeWalker(wurzel, NodeFilter.SHOW_TEXT, {
      acceptNode(knoten) {
        const eltern = knoten.parentElement
        if (!eltern) return NodeFilter.FILTER_REJECT
        for (let e: Element | null = eltern; e; e = e.parentElement) {
          if (!darfUebersetzen(e)) return NodeFilter.FILTER_REJECT
        }
        return brauchtUebersetzung(knoten.nodeValue ?? '')
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT
      },
    })
    for (let k = lauf.nextNode(); k; k = lauf.nextNode()) gefunden.push(k as Text)
    return gefunden
  }, [])

  /**
   * Der Ausweg, wenn im Browser nichts zu holen ist.
   *
   * Wichtig ist, dass er **jeden** Fehlschlag auffängt und nicht nur den Fall
   * „gibt es hier nicht“. Beim Ausprobieren zeigte sich, dass ein Browser die
   * Schnittstelle durchaus anbieten kann und trotzdem kein Modell liefert –
   * dann brach der Versuch still ab, und ein Klick auf den Knopf tat gar
   * nichts. Ein Knopf, der nichts tut, ist schlimmer als keiner.
   */
  const ausweichen = useCallback(() => {
    setZustand('deutsch')
    window.open(ausweichAdresse(window.location.href), '_blank', 'noopener')
  }, [])

  const insEnglische = useCallback(async () => {
    const werkzeug = bauer()
    if (!werkzeug) {
      ausweichen()
      return
    }

    setZustand('laedt')
    setFortschritt(0)

    try {
      if (!uebersetzerRef.current) {
        const stand = await werkzeug.availability({
          sourceLanguage: 'de',
          targetLanguage: 'en',
        })
        if (stand === 'unavailable') {
          ausweichen()
          return
        }
        uebersetzerRef.current = await werkzeug.create({
          sourceLanguage: 'de',
          targetLanguage: 'en',
          monitor(m) {
            m.addEventListener('downloadprogress', (ereignis) => {
              const anteil = (ereignis as ProgressEvent).loaded
              if (typeof anteil === 'number') setFortschritt(Math.round(anteil * 100))
            })
          },
        })
      }

      const uebersetzer = uebersetzerRef.current
      const knoten = textknoten(document.body)
      let fertig = 0
      let gelungen = 0

      for (const block of inBloecke(knoten, 12)) {
        await Promise.all(
          block.map(async (k) => {
            const quelle = k.nodeValue ?? ''
            if (!ausgangstexte.has(k)) ausgangstexte.set(k, quelle)
            try {
              k.nodeValue = await uebersetzer.translate(quelle)
              gelungen += 1
            } catch {
              // Ein einzelner Satz, der nicht durchgeht, ist kein Grund,
              // die ganze Seite halb übersetzt stehen zu lassen.
            }
          })
        )
        fertig += block.length
        setFortschritt(Math.round((fertig / Math.max(knoten.length, 1)) * 100))
      }

      /*
        Wenn nichts durchging, ist auch nichts übersetzt.

        Ohne diese Prüfung stünde der Knopf auf „DE“ und die Seite auf Deutsch –
        ein Zustand, aus dem der Besucher nicht mehr herausfindet.
      */
      if (gelungen === 0) {
        ausweichen()
        return
      }

      document.documentElement.lang = 'en'
      setZustand('englisch')
      try {
        window.localStorage.setItem(SPRACH_SCHLUESSEL, 'en')
      } catch {
        // Privater Modus: Die Wahl gilt dann nur für diese Seite.
      }
    } catch {
      ausweichen()
    }
  }, [textknoten, ausweichen])

  const insDeutsche = useCallback(() => {
    for (const [knoten, text] of ausgangstexte) {
      if (knoten.isConnected) knoten.nodeValue = text
    }
    ausgangstexte.clear()
    document.documentElement.lang = 'de'
    setZustand('deutsch')
    try {
      window.localStorage.removeItem(SPRACH_SCHLUESSEL)
    } catch {
      // siehe oben
    }
  }, [])

  /*
    Die Wahl gilt über den Seitenwechsel hinaus.

    Ohne das wäre der Umschalter nutzlos: Ein Klick auf den ersten Verweis
    brächte wieder eine deutsche Seite. Weil die Website statisch ausgeliefert
    wird, gibt es keinen Server, der das übernehmen könnte – also fragt jede
    Seite beim Aufbau selbst nach, was zuletzt gewählt war.
  */
  useEffect(() => {
    let gewaehlt: string | null = null
    try {
      gewaehlt = window.localStorage.getItem(SPRACH_SCHLUESSEL)
    } catch {
      gewaehlt = null
    }
    if (gewaehlt !== 'en' || !bauer()) return

    /*
      Erst nach dem ersten Bild anfangen.

      Die Übersetzung schreibt in hunderte Textknoten. Liefe sie noch im
      Aufbau, sähe der Besucher eine Weile gar nichts – so sieht er die
      deutsche Seite und dann, Abschnitt für Abschnitt, die englische.
    */
    const gestartet = window.setTimeout(() => void insEnglische(), 0)
    return () => window.clearTimeout(gestartet)
    // Absichtlich nur beim ersten Aufbau.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    return () => uebersetzerRef.current?.destroy?.()
  }, [])

  const beschriftung =
    zustand === 'englisch'
      ? 'Auf Deutsch zurückschalten'
      : zustand === 'laedt'
        ? `Wird übersetzt … ${fortschritt} Prozent`
        : 'Translate this page into English'

  return (
    <button
      type="button"
      onClick={zustand === 'englisch' ? insDeutsche : insEnglische}
      disabled={zustand === 'laedt'}
      title={beschriftung}
      aria-live="polite"
      className={`fk-btn-ghost h-10 gap-1.5 rounded-full px-2.5 text-xs font-semibold ${className ?? ''}`}
    >
      <Icon name="globe" className="size-5" />
      <span aria-hidden="true" className="tabular-nums">
        {zustand === 'laedt' ? `${fortschritt}%` : zustand === 'englisch' ? 'DE' : 'EN'}
      </span>
      <span className="sr-only">{beschriftung}</span>
    </button>
  )
}
