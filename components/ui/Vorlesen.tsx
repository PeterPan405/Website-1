'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

import { Aufnahmeleiste } from '@/components/ui/Aufnahmeleiste'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import {
  bevorzugteStimme,
  gruppiereStimmen,
  klingtMaennlich,
  tonlageFuer,
} from '@/lib/vorlese-text'

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
 * Wo die gewählte Stimme liegt – ein Gerät, eine Wahl, alle Seiten.
 *
 * Der Schlüssel trägt eine „-2“, und das ist kein Versionsschmuck: Eine früher
 * von Hand gewählte Stimme überstimmt die Automatik dauerhaft. Wer vor der
 * Umstellung auf „männlich und tief“ einmal eine Stimme angeklickt hatte,
 * hörte deshalb weiter die alte – jede Änderung an der Rangfolge lief ins
 * Leere. Der neue Schlüssel setzt alle Geräte einmalig auf die Automatik
 * zurück; wer danach wieder von Hand wählt, dessen Wahl gilt wie gehabt.
 */
const STIMMWAHL_SCHLUESSEL = 'fk-vorlesen-stimme-2'
const STIMMWAHL_ALT = 'fk-vorlesen-stimme'

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
  const stimmen = useSyncExternalStore(
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
    /* Die Wahl aus der Zeit vor dem Zurücksetzen räumt sich hier weg. */
    try {
      window.localStorage?.removeItem(STIMMWAHL_ALT)
    } catch {
      // Ohne Speicherzugriff gibt es auch keine Altlast zu entfernen.
    }
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
  const gruppen = gruppiereStimmen(stimmen)
  const zurAuswahl = [...gruppen.maennlich, ...gruppen.weitere]
  const wahlVorhanden = zurAuswahl.some((stimme) => stimme.voiceURI === stimmwahl)
  const automatik = bevorzugteStimme(stimmen)
  /* Was tatsächlich sprechen wird: die Handwahl, sonst die Automatik. */
  const wirksam = zurAuswahl.find((stimme) => stimme.voiceURI === stimmwahl) ?? automatik

  /**
   * Die gewählte Stimme – oder die Voreinstellung: männlich, lokal, deutsch.
   *
   * Die Rangfolge steht in `lib/vorlese-text.ts` und ist dort geprüft; die
   * Schnittstelle kennt kein Geschlecht, erkannt wird es am Stimmnamen.
   */
  function stimmeFuerAuftrag(): SpeechSynthesisVoice | null {
    const alle = window.speechSynthesis.getVoices()
    return (
      alle.find((stimme) => stimme.voiceURI === stimmwahlRef.current) ??
      bevorzugteStimme(alle)
    )
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

  function stimmeWechseln(voiceURI: string) {
    stimmwahlRef.current = voiceURI
    setStimmwahl(voiceURI)
    try {
      window.localStorage?.setItem(STIMMWAHL_SCHLUESSEL, voiceURI)
    } catch {
      // Privater Modus oder voller Speicher: Die Wahl gilt dann nur hier.
    }
    if (laueftRef.current && zustand === 'laeuft') {
      neuAnsetzen()
      return
    }
    /*
      Probehören: Wer die Stimme wechselt, ohne dass gerade gelesen wird,
      hört sofort einen Satz mit der neuen Stimme. Ohne die Probe müsste man
      erst das Vorlesen starten, um zu erfahren, was man gewählt hat – und
      auf Geräten, deren Browser die Stimmwahl stillschweigend übergeht,
      merkte man es gar nicht. Klingt jede Probe gleich, liegt es am Gerät,
      nicht an der Auswahl; der Hinweis unter der Leiste sagt, was dann hilft.
    */
    const alle = window.speechSynthesis.getVoices()
    const stimme =
      alle.find((eintrag) => eintrag.voiceURI === voiceURI) ?? bevorzugteStimme(alle)
    const probe = new SpeechSynthesisUtterance('So klingt diese Stimme.')
    probe.lang = 'de-DE'
    if (stimme) probe.voice = stimme
    probe.pitch = tonlageFuer(stimme)
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(probe)
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
          {/*
            Die Automatik nennt ihre Wahl beim Namen. „Automatisch“ allein
            hieße: Man hört eine Stimme und weiß nicht, welche – und ob eine
            Änderung der Rangfolge überhaupt ankommt, ist nicht zu erkennen.
          */}
          <option value="">
            {automatik ? `Automatisch: ${automatik.name}` : 'Stimme: automatisch'}
          </option>
          {/*
            Zwei Gruppen statt einer Liste. Erkennt die Automatik eine
            Männerstimme nicht – die Namensliste kann nicht vollständig sein –,
            muss von Hand gewählt werden, und dann steht man sonst vor
            „Katja“, „Hedda“, „Stefan“, „Google Deutsch“ und rät.
          */}
          {gruppen.maennlich.length > 0 && (
            <optgroup label="Männliche Stimmen">
              {gruppen.maennlich.map((stimme) => (
                <option key={stimme.voiceURI} value={stimme.voiceURI}>
                  {stimme.name}
                  {stimme.localService ? '' : ' (online)'}
                </option>
              ))}
            </optgroup>
          )}
          {gruppen.weitere.length > 0 && (
            <optgroup
              label={gruppen.maennlich.length > 0 ? 'Weitere Stimmen' : 'Stimmen'}
            >
              {gruppen.weitere.map((stimme) => (
                <option key={stimme.voiceURI} value={stimme.voiceURI}>
                  {stimme.name}
                  {stimme.localService ? '' : ' (online)'}
                </option>
              ))}
            </optgroup>
          )}
        </select>
      )}

      {/*
        Der Browser kann nur Stimmen nutzen, die das Gerät mitbringt. Findet
        sich darunter keine männliche deutsche, kann keine Rangfolge der Welt
        eine herbeizaubern – dann hilft nur, im Betriebssystem eine zu
        installieren. Das sagt die Leiste offen, statt es still zu versuchen.
      */}
      {bereit && stimmen.length > 0 && (!wirksam || !klingtMaennlich(wirksam)) && (
        <p className="text-fg-subtle w-full text-xs leading-relaxed">
          Auf diesem Gerät ist keine männliche deutsche Stimme zu finden – gesprochen wird
          mit abgesenkter Tonlage. Abhilfe: In den Systemeinstellungen (Windows:
          „Sprache“, Android: „Sprachausgabe“, iOS: „Gesprochene Inhalte“) eine männliche
          deutsche Stimme installieren; sie erscheint danach hier in der Auswahl. Klingt
          jede Stimme aus der Auswahl gleich, spricht der Browser mit der Systemstimme des
          Geräts – dann greift nur ein Wechsel der Standardstimme in den
          Geräte-Einstellungen unter „Sprachausgabe“.
        </p>
      )}
    </div>
  )
}
