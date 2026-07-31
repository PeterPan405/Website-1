'use client'

import { useState } from 'react'

import { Icon } from '@/components/ui/Icon'
import { ergaenzeMerkliste, useMerkliste } from '@/components/markets/merkliste-speicher'
import { baueMerkcode, leseMerkcode } from '@/lib/merkcode'

/**
 * Die Merkliste sichern und auf ein anderes Gerät bringen.
 *
 * ## Warum kein Konto
 *
 * Weil ein Konto bedeutete, dass jemand eine Datenbank betreibt, in der steht,
 * welche Aktien welcher Mensch beobachtet. Das ist eine Aussage über sein Geld
 * und geht niemanden etwas an – am wenigsten den Betreiber einer Website, die
 * genau das schreibt.
 *
 * Ein Textschnipsel zum Kopieren löst dasselbe Problem: Er entsteht im
 * Browser, wird vom Menschen weitergegeben und liest sich am anderen Gerät
 * wieder ein. Kein Byte verlässt dabei das Gerät, außer der Mensch schickt es
 * selbst irgendwohin – und dann weiß er es.
 *
 * ## Warum Einlesen ergänzt statt ersetzt
 *
 * Weil der übliche Anlass das Zusammenführen zweier Listen ist. Ersetzen wäre
 * die gefährlichere Voreinstellung und lässt sich über „Leeren“ ohnehin
 * herstellen.
 */
export function Merkaustausch({
  /** Alle geführten Symbole – nur diese werden übernommen. */
  bekannteSymbole,
}: {
  bekannteSymbole: readonly string[]
}) {
  const liste = useMerkliste()
  const [eingabe, setzeEingabe] = useState('')
  const [meldung, setzeMeldung] = useState<string | null>(null)
  const [kopiert, setzeKopiert] = useState(false)

  const code = baueMerkcode(liste.map((eintrag) => eintrag.symbol))
  const bekannt = new Set(bekannteSymbole)

  async function kopieren() {
    try {
      await navigator.clipboard.writeText(code)
      setzeKopiert(true)
      window.setTimeout(() => setzeKopiert(false), 2500)
    } catch {
      /*
        Ohne Zwischenablage-Rechte bleibt das Feld darüber stehen – es ist
        auswählbar, und Kopieren von Hand funktioniert immer. Eine
        Fehlermeldung wäre hier sinnlos: Der Nutzer sieht den Code ja.
      */
      setzeKopiert(false)
    }
  }

  function einlesen() {
    const gelesen = leseMerkcode(eingabe)
    if (gelesen.length === 0) {
      setzeMeldung('Aus diesem Text ließ sich nichts herauslesen.')
      return
    }

    /*
      Nur was im Katalog steht. Was hier durchkommt, wird später Teil einer
      Adresse – und ein Symbol, das es nicht gibt, ergäbe eine Zeile, die
      nirgendwohin führt.
    */
    const gueltig = gelesen.filter((symbol) => bekannt.has(symbol))
    const verworfen = gelesen.length - gueltig.length

    if (gueltig.length === 0) {
      setzeMeldung(
        `Keiner der ${gelesen.length} Einträge ist ein hier geführtes Instrument.`
      )
      return
    }

    const dazu = ergaenzeMerkliste(gueltig)
    setzeEingabe('')
    setzeMeldung(
      [
        dazu === 0
          ? 'Alle Einträge standen schon auf der Liste.'
          : `${dazu} ${dazu === 1 ? 'Titel' : 'Titel'} hinzugefügt.`,
        verworfen > 0
          ? `${verworfen} ${verworfen === 1 ? 'Eintrag war' : 'Einträge waren'} kein geführtes Instrument und ${verworfen === 1 ? 'wurde' : 'wurden'} übersprungen.`
          : null,
      ]
        .filter(Boolean)
        .join(' ')
    )
  }

  return (
    <section aria-labelledby="austausch" className="mt-12">
      <h2 id="austausch" className="text-fg text-2xl font-bold">
        Mitnehmen und zusammenführen
      </h2>
      <p className="text-fg-muted mt-2 max-w-2xl leading-relaxed">
        Die Liste liegt in diesem Browser. Damit steht am Telefon eine andere als am
        Rechner – und wer die Browserdaten löscht, löscht sie mit. Dieser Code ist der Weg
        dazwischen: kopieren, am anderen Gerät einfügen, fertig. Er entsteht hier im
        Browser und wird nirgendwohin gesendet.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <label
            htmlFor="merkcode-ausgabe"
            className="text-fg-subtle text-xs font-medium tracking-wide uppercase"
          >
            Dein Code
          </label>
          <textarea
            id="merkcode-ausgabe"
            readOnly
            value={code}
            rows={3}
            className="border-border bg-surface-subtle text-fg mt-1.5 w-full rounded-lg border px-3 py-2.5 font-mono text-xs"
          />
          <button
            type="button"
            onClick={kopieren}
            disabled={liste.length === 0}
            className="fk-btn-secondary mt-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon name={kopiert ? 'check' : 'download'} className="size-4" />
            {kopiert ? 'Kopiert' : 'Code kopieren'}
          </button>
        </div>

        <div>
          <label
            htmlFor="merkcode-eingabe"
            className="text-fg-subtle text-xs font-medium tracking-wide uppercase"
          >
            Code einlesen
          </label>
          <textarea
            id="merkcode-eingabe"
            value={eingabe}
            onChange={(event) => setzeEingabe(event.target.value)}
            rows={3}
            placeholder="IMI1:…"
            className="border-border bg-surface text-fg focus:border-markets mt-1.5 w-full rounded-lg border px-3 py-2.5 font-mono text-xs outline-none"
          />
          <button
            type="button"
            onClick={einlesen}
            disabled={eingabe.trim().length === 0}
            className="fk-btn-secondary mt-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon name="bookmark" className="size-4" />
            Zur Liste hinzufügen
          </button>
          {/*
            Die Rückmeldung liegt in einer Live-Region: Wer die Seite vorlesen
            lässt, erfährt sonst nicht, dass etwas passiert ist – der Knopf
            sieht danach genauso aus wie davor.
          */}
          {meldung && (
            <p role="status" className="text-fg-muted mt-2 text-sm leading-relaxed">
              {meldung}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
