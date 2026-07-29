'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

/**
 * Liest die Abschnitte einer Seite mit der Stimme des Browsers vor.
 *
 * ## Warum die Web-Speech-Schnittstelle
 *
 * Sie ist die einzige Möglichkeit, auf einer Website ohne Server vorzulesen:
 * Die Stimme kommt vom Gerät, kein Text verlässt die Seite in Richtung eines
 * Vorlesedienstes. Der Preis ist, dass Klang und Verfügbarkeit vom Gerät
 * abhängen – ein iPhone klingt anders als ein Linux-Rechner, und ein Browser
 * ohne deutsche Stimme nimmt seine Standardstimme.
 *
 * ## Warum Abschnitt für Abschnitt gesprochen wird
 *
 * Chrome bricht lange Vorleseaufträge bei manchen Stimmen kommentarlos ab.
 * Deshalb bekommt die Stimme immer nur einen Abschnitt; erst wenn er zu Ende
 * ist, wird der nächste gestartet. Nebenbei ergibt das den Fortschritt und
 * eine saubere Stelle, an der ein Tempo- oder Stimmwechsel greifen kann.
 *
 * ## Ein Wechsel der Seite beendet das Vorlesen
 *
 * `speechSynthesis` gehört dem Fenster, nicht der Komponente. Ohne das
 * Aufräumen beim Abbau spräche die Stimme auf der nächsten Seite weiter –
 * über einen Text, der längst nicht mehr zu sehen ist.
 */

/** Wo die gewählte Stimme liegt – ein Gerät, eine Wahl, alle Seiten. */
const STIMMWAHL_SCHLUESSEL = 'fk-vorlesen-stimme'

/** Nichts zu beobachten – die Fähigkeit des Browsers ändert sich nicht. */
function nieWieder() {
  return () => {}
}

/** Stabile leere Referenz für das Server-Rendering. */
const KEINE_STIMMEN: readonly SpeechSynthesisVoice[] = []

/*
  Die Stimmen des Geräts als beobachtbarer Bestand.

  `getVoices()` liefert in Chrome beim ersten Aufruf oft eine leere Liste und
  reicht die echte erst über das Ereignis `voiceschanged` nach. Ein einfacher
  Aufruf beim Rendern sähe deshalb auf vielen Geräten keine einzige Stimme.
  Der kleine Speicher hier füllt sich beim Abonnieren und bei jedem Nachschub –
  und `useSyncExternalStore` hält alle Vorleseleisten auf demselben Stand.
*/
let stimmenBestand: readonly SpeechSynthesisVoice[] = KEINE_STIMMEN

function stimmenAbo(melden: () => void) {
  if (!('speechSynthesis' in window)) return () => {}
  const laden = () => {
    stimmenBestand = window.speechSynthesis.getVoices()
    melden()
  }
  laden()
  window.speechSynthesis.addEventListener?.('voiceschanged', laden)
  return () => window.speechSynthesis.removeEventListener?.('voiceschanged', laden)
}

export function Vorlesen({ abschnitte }: { abschnitte: string[] }) {
  /*
    Ob der Browser vorlesen kann, weiß nur der Browser – der Server rendert
    deshalb „nein“ und der erste Client-Durchlauf die Wahrheit. Über
    `useSyncExternalStore` statt einem setState im Effekt: Der React-Compiler
    weist synchrone Zustandsänderungen in Effekten zurück, und das zu Recht –
    sie erzeugen ein zweites Rendern direkt nach dem ersten.
  */
  const bereit = useSyncExternalStore(
    nieWieder,
    () => 'speechSynthesis' in window,
    () => false
  )
  const stimmen = useSyncExternalStore(
    stimmenAbo,
    () => stimmenBestand,
    () => KEINE_STIMMEN
  )

  const [zustand, setZustand] = useState<'aus' | 'laeuft' | 'pausiert'>('aus')
  const [stelle, setStelle] = useState(0)
  const [tempo, setTempo] = useState(1)
  /*
    Die Wahl kommt aus dem localStorage und gilt für alle Seiten. Der Server
    kennt weder Speicher noch Stimmen – er rendert die Leiste ohne Auswahl,
    und die erscheint erst mit den Stimmen des Geräts.
  */
  const [stimmwahl, setStimmwahl] = useState(() =>
    typeof window === 'undefined'
      ? ''
      : (window.localStorage?.getItem(STIMMWAHL_SCHLUESSEL) ?? '')
  )

  /*
    Die Refs führen den Lauf, der Zustand beschriftet die Knöpfe.

    Der Weiterlauf passiert in `onend`-Rückrufen, und die sehen nur den Stand
    zum Zeitpunkt ihrer Erzeugung. Ohne Refs läse ein Tempowechsel mitten im
    Text mit dem alten Tempo weiter – oder ein „Stopp“ würde vom nächsten
    `onend` gleich wieder überholt.
  */
  const laueftRef = useRef(false)
  const tempoRef = useRef(1)
  const stimmwahlRef = useRef(stimmwahl)

  /* Beim Verlassen der Seite verstummen – siehe Kopfkommentar. */
  useEffect(() => {
    return () => {
      laueftRef.current = false
      window.speechSynthesis?.cancel()
    }
  }, [])

  /*
    Zur Auswahl stehen die deutschen Stimmen des Geräts; gibt es keine, alle.
    Netzstimmen schicken den Text zum Hersteller des Browsers – sie sind
    gekennzeichnet, damit die Wahl eine informierte ist.
  */
  const deutsche = stimmen.filter((stimme) => stimme.lang.toLowerCase().startsWith('de'))
  const zurAuswahl = deutsche.length > 0 ? deutsche : stimmen
  const wahlVorhanden = zurAuswahl.some((stimme) => stimme.voiceURI === stimmwahl)

  /** Die gewählte Stimme – oder die Voreinstellung: lokal und deutsch. */
  function stimmeFuerAuftrag(): SpeechSynthesisVoice | null {
    const alle = window.speechSynthesis.getVoices()
    const gewuenschte = alle.find((stimme) => stimme.voiceURI === stimmwahlRef.current)
    if (gewuenschte) return gewuenschte
    const de = alle.filter((stimme) => stimme.lang.toLowerCase().startsWith('de'))
    return de.find((stimme) => stimme.localService) ?? de[0] ?? null
  }

  function sprich(ab: number) {
    if (!laueftRef.current || ab >= abschnitte.length) {
      laueftRef.current = false
      setZustand('aus')
      setStelle(0)
      return
    }

    setStelle(ab)
    const auftrag = new SpeechSynthesisUtterance(abschnitte[ab])
    auftrag.lang = 'de-DE'
    auftrag.rate = tempoRef.current
    const stimme = stimmeFuerAuftrag()
    if (stimme) auftrag.voice = stimme
    auftrag.onend = () => sprich(ab + 1)
    /*
      Ein Fehler beendet das Vorlesen, statt still hängen zu bleiben. Der
      häufigste Fall ist `canceled` durch das eigene Aufräumen – dann hat
      `laueftRef` den Weiterlauf ohnehin schon unterbunden.
    */
    auftrag.onerror = () => {
      if (laueftRef.current) sprich(ab + 1)
    }
    window.speechSynthesis.speak(auftrag)
  }

  function start() {
    window.speechSynthesis.cancel()
    laueftRef.current = true
    setZustand('laeuft')
    sprich(stelle)
  }

  function pause() {
    window.speechSynthesis.pause()
    setZustand('pausiert')
  }

  function weiter() {
    window.speechSynthesis.resume()
    setZustand('laeuft')
  }

  function stopp() {
    laueftRef.current = false
    window.speechSynthesis.cancel()
    setZustand('aus')
    setStelle(0)
  }

  /**
   * Setzt den aktuellen Abschnitt mit den neuen Einstellungen neu an.
   *
   * Ein laufender Auftrag behält Tempo und Stimme; nur ein Neustart des
   * Abschnitts übernimmt die Änderung sofort statt erst beim nächsten.
   * `cancel` feuert das `onend` des abgebrochenen Auftrags, und das würde
   * eine zweite Kette starten – der Neustart wartet deshalb einen Tick, bis
   * der alte Rückruf ins Leere gelaufen ist.
   */
  function neuAnsetzen() {
    if (!laueftRef.current || zustand !== 'laeuft') return
    window.speechSynthesis.cancel()
    laueftRef.current = false
    window.setTimeout(() => {
      laueftRef.current = true
      sprich(stelle)
    }, 60)
  }

  /** 1 → 1,25 → 1,5 → 0,75 → 1 … */
  function tempoWechseln() {
    const reihe = [1, 1.25, 1.5, 0.75]
    const naechstes = reihe[(reihe.indexOf(tempoRef.current) + 1) % reihe.length]
    tempoRef.current = naechstes
    setTempo(naechstes)
    neuAnsetzen()
  }

  function stimmeWechseln(voiceURI: string) {
    stimmwahlRef.current = voiceURI
    setStimmwahl(voiceURI)
    try {
      window.localStorage?.setItem(STIMMWAHL_SCHLUESSEL, voiceURI)
    } catch {
      // Privater Modus oder voller Speicher: Die Wahl gilt dann nur hier.
    }
    neuAnsetzen()
  }

  if (abschnitte.length === 0) return null

  return (
    <div
      className={cn(
        'border-border bg-surface-muted flex flex-wrap items-center gap-2 rounded-xl border px-3 py-2',
        !bereit && 'hidden'
      )}
    >
      {zustand === 'laeuft' ? (
        <button
          type="button"
          onClick={pause}
          className="fk-btn-secondary px-3 py-1.5 text-xs"
        >
          <Icon name="pause" className="size-3.5" />
          Pause
        </button>
      ) : (
        <button
          type="button"
          onClick={zustand === 'pausiert' ? weiter : start}
          className="fk-btn-secondary px-3 py-1.5 text-xs"
          title="Gelesen von einer Stimme deines Browsers – Klang und Auswahl hängen vom Gerät ab."
        >
          <Icon name="play" className="size-3.5" />
          {zustand === 'pausiert' ? 'Weiter' : 'Vorlesen'}
        </button>
      )}

      {zustand !== 'aus' && (
        <>
          <button
            type="button"
            onClick={stopp}
            className="fk-btn-ghost px-3 py-1.5 text-xs"
          >
            <Icon name="close" className="size-3.5" />
            Stopp
          </button>
          <button
            type="button"
            onClick={tempoWechseln}
            className="fk-btn-ghost px-3 py-1.5 text-xs tabular-nums"
            aria-label={`Lesetempo ändern, derzeit ${tempo.toLocaleString('de-DE')}-fach`}
          >
            {tempo.toLocaleString('de-DE')}×
          </button>
          <span className="text-fg-subtle text-xs tabular-nums" aria-live="polite">
            Abschnitt {stelle + 1} von {abschnitte.length}
          </span>
        </>
      )}

      {/*
        Die Stimmauswahl steht auch vor dem Start – wer die Stimme wechseln
        will, soll sie nicht erst suchen müssen, während gesprochen wird.
        Bei nur einer Stimme gibt es nichts zu wählen.
      */}
      {zurAuswahl.length > 1 && (
        <select
          value={wahlVorhanden ? stimmwahl : ''}
          onChange={(ereignis) => stimmeWechseln(ereignis.target.value)}
          aria-label="Vorlesestimme wählen"
          className="border-border bg-canvas text-fg focus-visible:ring-ring ml-auto max-w-44 rounded-lg border px-2 py-1.5 text-xs focus-visible:ring-2 focus-visible:outline-none"
        >
          <option value="">Stimme: automatisch</option>
          {zurAuswahl.map((stimme) => (
            <option key={stimme.voiceURI} value={stimme.voiceURI}>
              {stimme.name}
              {stimme.localService ? '' : ' (online)'}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}
