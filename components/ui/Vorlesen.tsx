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
 * eine saubere Stelle, an der ein Tempowechsel greifen kann.
 *
 * ## Ein Wechsel der Seite beendet das Vorlesen
 *
 * `speechSynthesis` gehört dem Fenster, nicht der Komponente. Ohne das
 * Aufräumen beim Abbau spräche die Stimme auf der nächsten Seite weiter –
 * über einen Text, der längst nicht mehr zu sehen ist.
 */
/** Nichts zu beobachten – die Fähigkeit des Browsers ändert sich nicht. */
function nieWieder() {
  return () => {}
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
  const [zustand, setZustand] = useState<'aus' | 'laeuft' | 'pausiert'>('aus')
  const [stelle, setStelle] = useState(0)
  const [tempo, setTempo] = useState(1)

  /*
    Die Refs führen den Lauf, der Zustand beschriftet die Knöpfe.

    Der Weiterlauf passiert in `onend`-Rückrufen, und die sehen nur den Stand
    zum Zeitpunkt ihrer Erzeugung. Ohne Refs läse ein Tempowechsel mitten im
    Text mit dem alten Tempo weiter – oder ein „Stopp“ würde vom nächsten
    `onend` gleich wieder überholt.
  */
  const laueftRef = useRef(false)
  const tempoRef = useRef(1)

  /* Beim Verlassen der Seite verstummen – siehe Kopfkommentar. */
  useEffect(() => {
    return () => {
      laueftRef.current = false
      window.speechSynthesis?.cancel()
    }
  }, [])

  /**
   * Die Stimme des Geräts für Deutsch – lokale vor eingesandten.
   *
   * Manche Browser bieten Netzstimmen an, die den Text zum Hersteller
   * schicken. Auf einer Seite, die sonst nichts überträgt, wird die lokale
   * Stimme bevorzugt, wo es eine gibt.
   */
  function deutscheStimme(): SpeechSynthesisVoice | null {
    const stimmen = window.speechSynthesis.getVoices()
    const deutsche = stimmen.filter((stimme) =>
      stimme.lang.toLowerCase().startsWith('de')
    )
    return deutsche.find((stimme) => stimme.localService) ?? deutsche[0] ?? null
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
    const stimme = deutscheStimme()
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
   * 1 → 1,25 → 1,5 → 0,75 → 1 …
   *
   * Ein laufender Auftrag behält sein Tempo; deshalb wird der aktuelle
   * Abschnitt mit dem neuen Tempo neu gestartet statt nur der nächste.
   */
  function tempoWechseln() {
    const reihe = [1, 1.25, 1.5, 0.75]
    const naechstes = reihe[(reihe.indexOf(tempoRef.current) + 1) % reihe.length]
    tempoRef.current = naechstes
    setTempo(naechstes)
    if (laueftRef.current && zustand === 'laeuft') {
      window.speechSynthesis.cancel()
      /*
        `cancel` feuert das `onend` des abgebrochenen Auftrags, und das würde
        eine zweite Kette starten. Der Neustart wartet deshalb einen Tick, bis
        der alte Rückruf ins Leere gelaufen ist.
      */
      laueftRef.current = false
      window.setTimeout(() => {
        laueftRef.current = true
        sprich(stelle)
      }, 60)
    }
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
          title="Gelesen von der Stimme deines Browsers – Klang und Sprache hängen vom Gerät ab."
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
    </div>
  )
}
