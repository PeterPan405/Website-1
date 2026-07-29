'use client'

import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Icon } from '@/components/ui/Icon'
import {
  ausweichAdresse,
  brauchtUebersetzung,
  darfUebersetzen,
  inBloecke,
  SPRACH_SCHLUESSEL,
  TEXTATTRIBUTE,
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

/** Dasselbe für Attribute: Element, Attributname, ursprünglicher Wert. */
const ausgangsattribute: { element: Element; attribut: string; wert: string }[] = []

/** Und für den Titel im Browser-Tab. */
let ausgangstitel = ''

/**
 * Der übersetzte Titel, damit er sich nicht heimlich zurücksetzt.
 *
 * Next verwaltet den Inhalt von `<title>` selbst und schreibt ihn beim
 * Seitenwechsel neu. Ohne diese Merker stünde im Reiter wieder Deutsch, während
 * die Seite darunter englisch ist.
 */
let uebersetzterTitel = ''

export function SprachUmschalter({ className }: { className?: string }) {
  const [zustand, setZustand] = useState<Zustand>('deutsch')
  const [fortschritt, setFortschritt] = useState(0)
  const uebersetzerRef = useRef<Uebersetzer | null>(null)

  /**
   * Alle übersetzbaren Attribute unterhalb eines Elements.
   *
   * Getrennt von den Textknoten, weil sie anders ersetzt werden – und weil
   * sonst leicht vergessen wird, dass es sie gibt. Auf der Startseite hängen
   * daran die Beschriftungen der Knöpfe in der Kopfzeile.
   */
  const textattribute = useCallback((wurzel: Element): [Element, string][] => {
    const gefunden: [Element, string][] = []
    for (const element of [wurzel, ...wurzel.querySelectorAll('*')]) {
      if (!darfUebersetzen(element)) continue
      for (const attribut of TEXTATTRIBUTE) {
        const wert = element.getAttribute(attribut)
        if (wert && brauchtUebersetzung(wert)) gefunden.push([element, attribut])
      }
    }
    return gefunden
  }, [])

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

      /*
        Knoten der vorigen Seite wegräumen.

        Beim Seitenwechsel hängen sie nicht mehr im Dokument. Ohne dieses
        Aufräumen wüchse die Map mit jedem Seitenaufruf weiter, und das
        Zurückschalten liefe über tausende Knoten, die es nicht mehr gibt.
      */
      for (const knoten of [...ausgangstexte.keys()]) {
        if (!knoten.isConnected) ausgangstexte.delete(knoten)
      }

      const knoten = textknoten(document.body)
      const attribute = textattribute(document.body)
      const gesamt = knoten.length + attribute.length + 1
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
        setFortschritt(Math.round((fertig / gesamt) * 100))
      }

      for (const block of inBloecke(attribute, 12)) {
        await Promise.all(
          block.map(async ([element, attribut]) => {
            const quelle = element.getAttribute(attribut) ?? ''
            ausgangsattribute.push({ element, attribut, wert: quelle })
            try {
              element.setAttribute(attribut, await uebersetzer.translate(quelle))
              gelungen += 1
            } catch {
              // siehe oben
            }
          })
        )
        fertig += block.length
        setFortschritt(Math.round((fertig / gesamt) * 100))
      }

      /*
        Der Titel steht im Browser-Tab und im Lesezeichen.

        Ihn zu übersehen wäre der auffälligste Rest: Die Seite ist englisch, der
        Reiter darüber deutsch.
      */
      if (document.title && brauchtUebersetzung(document.title)) {
        ausgangstitel = document.title
        try {
          uebersetzterTitel = await uebersetzer.translate(document.title)
          document.title = uebersetzterTitel
          gelungen += 1
        } catch {
          // siehe oben
        }
      }
      setFortschritt(100)

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
  }, [textknoten, textattribute, ausweichen])

  const insDeutsche = useCallback(() => {
    for (const [knoten, text] of ausgangstexte) {
      if (knoten.isConnected) knoten.nodeValue = text
    }
    ausgangstexte.clear()

    for (const { element, attribut, wert } of ausgangsattribute) {
      if (element.isConnected) element.setAttribute(attribut, wert)
    }
    ausgangsattribute.length = 0

    if (ausgangstitel) {
      document.title = ausgangstitel
      ausgangstitel = ''
    }
    uebersetzterTitel = ''

    document.documentElement.lang = 'de'
    setZustand('deutsch')
    try {
      window.localStorage.removeItem(SPRACH_SCHLUESSEL)
    } catch {
      // siehe oben
    }
  }, [])

  /*
    Die Wahl gilt über den Seitenwechsel hinaus – auch über den, den man nicht
    sieht.

    Diese Website wechselt die Seite ohne Neuladen: Next tauscht nur den Inhalt
    aus, die Kopfzeile bleibt stehen. Für diese Komponente heißt das, dass sie
    von einem Seitenwechsel nichts mitbekommt – sie wird nicht neu aufgebaut.
    Genau daran ist die erste Fassung gescheitert: Die Startseite war englisch,
    ein Klick auf „Lernen“ brachte eine deutsche Seite zurück, und der Knopf
    stand weiter auf „DE“.

    `usePathname` schließt die Lücke. Der Pfad ändert sich bei jedem Wechsel,
    also läuft die Übersetzung erneut – für den neuen Inhalt.
  */
  const pfad = usePathname()

  useEffect(() => {
    let gewaehlt: string | null = null
    try {
      gewaehlt = window.localStorage.getItem(SPRACH_SCHLUESSEL)
    } catch {
      gewaehlt = null
    }
    if (gewaehlt !== 'en' || !bauer()) return

    /*
      Kurz warten, statt sofort loszulaufen.

      Beim Seitenwechsel steht der neue Inhalt nicht im selben Augenblick im
      Dokument, in dem sich der Pfad ändert. Wer sofort anfängt, übersetzt die
      alte Seite ein zweites Mal und die neue gar nicht.
    */
    const gestartet = window.setTimeout(() => void insEnglische(), 120)
    return () => window.clearTimeout(gestartet)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pfad])

  /*
    Den übersetzten Titel gegen Next verteidigen.

    Den Inhalt von `<title>` verwaltet Next selbst und schreibt ihn beim
    Seitenwechsel neu – nach der Übersetzung, nicht davor. Im Reiter stand
    dadurch Deutsch über einer englischen Seite.
  */
  useEffect(() => {
    const titelKnoten = document.querySelector('title')
    if (!titelKnoten) return
    const beobachter = new MutationObserver(() => {
      if (!uebersetzterTitel) return
      if (document.title !== uebersetzterTitel) document.title = uebersetzterTitel
    })
    beobachter.observe(titelKnoten, {
      childList: true,
      characterData: true,
      subtree: true,
    })
    return () => beobachter.disconnect()
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
