'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

import { Aufnahmeleiste } from '@/components/ui/Aufnahmeleiste'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { bevorzugteStimme, tonlageFuer } from '@/lib/vorlese-text'

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

/**
 * Die Reste der früheren Stimmwahl im Speicher der Besucher.
 *
 * Es gab hier eine Auswahlliste, und wer einmal von Hand gewählt hatte, dessen
 * Wahl überstimmte die Automatik dauerhaft. Die Liste ist weg – gesprochen
 * wird mit einer Stimme –, die Einträge stehen aber weiter in jedem Browser,
 * der sie je gesetzt hat. Sie werden beim ersten Besuch aufgeräumt: Ein
 * Schlüssel, den nichts mehr liest, ist nur noch Datenhaltung ohne Zweck.
 */
const STIMMWAHL_ALTLASTEN = ['fk-vorlesen-stimme-2', 'fk-vorlesen-stimme']

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

/**
 * Was die Leiste über eine fertige Aufnahme wissen muss.
 *
 * Liegt eine vor, spricht nicht das Gerät, sondern die eigene Stimme – siehe
 * `Aufnahmeleiste`. Die Gerätestimme bleibt als Rückfall darunter: Eine Datei
 * kann fehlen, weil ein Bau neuer ist als die Aufnahmen oder weil der Ordner
 * auf dem Server halb übertragen wurde.
 */
export interface Vorleseaufnahme {
  adresse: string
  marken: number[]
  sekunden: number
}

export function Vorlesen({
  abschnitte,
  aufnahme,
}: {
  abschnitte: string[]
  aufnahme?: Vorleseaufnahme | null
}) {
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
  /*
    Der Stimmenbestand des Geräts wird weiter abonniert – nicht zum Auswählen,
    sondern weil `bevorzugteStimme` ihn braucht und er auf vielen Geräten erst
    nach dem ersten Rendern gefüllt ist. Ohne das Abo spräche der erste
    Auftrag mit der Standardstimme statt mit der besten verfügbaren.
  */
  useSyncExternalStore(
    stimmenAbo,
    () => stimmenBestand,
    () => KEINE_STIMMEN
  )

  /* Gibt es eine Aufnahme, kommt sie aber nicht, spricht wieder das Gerät. */
  const [aufnahmeGescheitert, setAufnahmeGescheitert] = useState(false)
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
    /* Die Wahl aus der Zeit vor dem Zurücksetzen räumt sich hier weg. */
    try {
      for (const schluessel of STIMMWAHL_ALTLASTEN) {
        window.localStorage?.removeItem(schluessel)
      }
    } catch {
      // Ohne Speicherzugriff gibt es auch keine Altlast zu entfernen.
    }
    return () => {
      laueftRef.current = false
      window.speechSynthesis?.cancel()
    }
  }, [])

  /**
   * Die Stimme des Geräts, die dem Ziel am nächsten kommt: männlich, lokal,
   * deutsch. Die Rangfolge steht in `lib/vorlese-text.ts` und ist dort geprüft;
   * die Schnittstelle kennt kein Geschlecht, erkannt wird es am Stimmnamen.
   *
   * Von Hand wählen lässt sich hier nichts mehr – siehe die Begründung unten
   * an der Leiste.
   */
  function stimmeFuerAuftrag(): SpeechSynthesisVoice | null {
    return bevorzugteStimme(window.speechSynthesis.getVoices())
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
    auftrag.pitch = tonlageFuer(stimme)
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

  if (abschnitte.length === 0) return null

  /*
    Der Vorzug gilt der Aufnahme, und zwar ohne Wahlmöglichkeit davor.

    Eine Auswahl „echte Stimme oder Gerätestimme?" wäre eine Frage an
    Besucher, die sie nicht beantworten können, bevor sie beides gehört
    haben – und die richtige Antwort ist ohnehin immer dieselbe. Erst wenn
    die Datei nicht kommt, wird die Gerätestimme sichtbar; dann aber ohne
    Zutun.
  */
  if (aufnahme && !aufnahmeGescheitert) {
    return (
      <Aufnahmeleiste
        adresse={aufnahme.adresse}
        marken={aufnahme.marken}
        sekunden={aufnahme.sekunden}
        /*
          Dieselben Abschnitte, aus denen die Aufnahme entstanden ist. Die
          Leiste macht daraus die Kapitel ihrer Zeitleiste – ohne sie wäre sie
          ein Balken ohne Gliederung.
        */
        abschnitte={abschnitte}
        aufGeraetestimme={() => setAufnahmeGescheitert(true)}
      />
    )
  }

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
        Keine Stimmauswahl mehr – und kein Absatz darüber, wie man im
        Betriebssystem eine männliche deutsche Stimme nachinstalliert.

        Beides war ehrlich gemeint und trotzdem falsch: Es machte einen
        Notbehelf zum Angebot. Gesprochen werden soll diese Website mit
        **einer** Stimme, derselben wie im Podcast; die Gerätestimme springt
        nur ein, solange die Aufnahme einer Seite noch nicht existiert. Wer
        vor eine Auswahl gestellt wird, hält sie für die Sache.

        Der Satz sagt jetzt schlicht, woran man ist. Er verschwindet von
        selbst, sobald der nächtliche Lauf diese Seite gesprochen hat – dann
        greift die Aufnahmeleiste, und die kennt keine Auswahl.
      */}
      {bereit && (
        <p className="text-fg-subtle w-full text-xs leading-relaxed">
          Diese Seite ist noch nicht mit unserer eigenen Stimme aufgenommen – bis dahin
          liest die Stimme deines Geräts vor.
        </p>
      )}
    </div>
  )
}
