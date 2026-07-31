'use client'

import { useMemo, useState } from 'react'

import { useMerkliste } from '@/components/markets/merkliste-speicher'
import type { Merkdaten } from '@/components/markets/Merklistentafel'
import { Icon } from '@/components/ui/Icon'
import { baueIcs, type Termineintrag } from '@/lib/feed'
import { formatDateShort } from '@/lib/format'

/**
 * Die Termine der gemerkten Titel als Kalenderdatei.
 *
 * ## Warum eine Datei zum Herunterladen und kein Abonnement
 *
 * Weil ein Abonnement eine Adresse braucht, unter der der Kalender die Datei
 * abholt – und diese Adresse müsste die Merkliste enthalten. Sie stünde damit
 * im Zugriffsprotokoll jedes Servers dazwischen: welche Titel jemand
 * beobachtet, alle paar Stunden neu. Genau das vermeidet die Merkliste, indem
 * sie im Browser bleibt.
 *
 * Der Preis ist derselbe wie bei jedem Herunterladen: Die Datei ist ein
 * Abzug. Wer die Merkliste ändert, lädt neu – und das steht dabei, statt
 * jemanden monatelang auf einen eingefrorenen Kalender schauen zu lassen.
 *
 * Der abonnierbare **Börsenkalender** unter `/kalender/termine.ics` bleibt
 * davon unberührt; er enthält keine persönliche Auswahl und darf deshalb über
 * eine feste Adresse laufen.
 *
 * ## Warum die Datei erst auf Klick entsteht
 *
 * Sie entsteht ohnehin im Browser – der Server kennt die Merkliste nicht. Sie
 * erst beim Klick zu bauen spart nichts an Rechenzeit, das ins Gewicht fiele,
 * hält aber die `blob:`-Adresse aus dem Dokument, solange niemand sie will.
 */
export function Merkkalender({ daten }: { daten: Merkdaten[] }) {
  const merkliste = useMerkliste()
  /*
    Der erzeugte Abzug **samt** der Liste, aus der er entstand.

    Die Liste mitzuführen ist der Kern: Ändert jemand die Merkliste, ist eine
    schon erzeugte Datei veraltet, und ein Knopf „speichern“, der den alten
    Stand liefert, wäre schlimmer als gar keiner. Der Abgleich läuft während
    des Renderns und nicht in einem Effekt – dasselbe Muster wie im Suchdialog
    beim Öffnen. In einem Effekt stünde für einen Frame der veraltete Knopf da,
    und React weist `setState` im Effekt zu Recht zurück.
  */
  const [abzug, setzeAbzug] = useState<{
    adresse: string
    fuer: readonly { symbol: string }[]
  } | null>(null)

  if (abzug && abzug.fuer !== merkliste) {
    URL.revokeObjectURL(abzug.adresse)
    setzeAbzug(null)
  }

  const gemerkt = useMemo(() => {
    const symbole = new Set(merkliste.map((eintrag) => eintrag.symbol))
    return daten.filter((zeile) => symbole.has(zeile.symbol))
  }, [merkliste, daten])

  const termine = useMemo(
    () =>
      gemerkt
        .flatMap((zeile) => zeile.termine.map((termin) => ({ zeile, termin })))
        .sort((a, b) => a.termin.tag.localeCompare(b.termin.tag)),
    [gemerkt]
  )

  if (termine.length === 0) return null

  function bauen() {
    const eintraege: Termineintrag[] = termine.map(({ zeile, termin }) => ({
      /*
        Dieselbe Bauart der Kennung wie im Börsenkalender: aus Angaben, die
        sich zwischen zwei Abzügen nicht ändern. Sonst legt das
        Kalenderprogramm beim zweiten Herunterladen alles doppelt an, statt
        die vorhandenen Einträge zu ersetzen.
      */
      uid: `merk-${zeile.symbol}-${termin.tag}-${termin.art}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .concat('@iminvests.de'),
      datum: termin.tag,
      /*
        „(erwartet)“ steht im Titel und nicht nur in der Beschreibung. In einem
        fremden Kalender ist der Titel oft alles, was gelesen wird – und jeder
        dieser Termine ist aus dem bisherigen Muster gerechnet, nicht vom
        Unternehmen genannt.
      */
      titel: `(erwartet) ${zeile.name}: ${termin.art}`,
      beschreibung: [
        `${termin.art} von ${zeile.name} (${zeile.ticker}).`,
        'Der Tag ist aus dem bisherigen Meldemuster gerechnet und keine Ankündigung des Unternehmens. Den verbindlichen Termin nennt das Unternehmen selbst, meist wenige Wochen vorher.',
        'Aus deiner Merkliste bei IM Invests – keine Anlageberatung.',
      ].join('\n'),
      url: `https://iminvests.de/maerkte/${zeile.symbol}`,
    }))

    const text = baueIcs(
      'IM Invests – meine Merkliste',
      'Erwartete Dividenden- und Quartalstermine der Titel auf deiner Merkliste. Ein Abzug vom Tag des Herunterladens.',
      eintraege
    )
    setzeAbzug({
      adresse: URL.createObjectURL(
        new Blob([text], { type: 'text/calendar;charset=utf-8' })
      ),
      fuer: merkliste,
    })
  }

  const letzter = termine[termine.length - 1].termin.tag

  return (
    <section aria-labelledby="merkkalender" className="mt-10">
      <h2 id="merkkalender" className="text-fg text-xl font-bold">
        Die Termine in den eigenen Kalender
      </h2>
      <p className="text-fg-muted mt-2 leading-relaxed">
        {termine.length} {termine.length === 1 ? 'Termin' : 'Termine'} aus{' '}
        {gemerkt.length} {gemerkt.length === 1 ? 'Titel' : 'Titeln'}, bis zum{' '}
        {formatDateShort(letzter)}. Die Datei enthält Ganztagstermine – keiner dieser
        Termine hat eine Uhrzeit, die für alle stimmt, und eine erfundene sähe im Kalender
        aus wie eine Angabe.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {abzug ? (
          <a href={abzug.adresse} download="merkliste.ics" className="fk-btn-primary">
            <Icon name="download" className="size-4" />
            merkliste.ics speichern
          </a>
        ) : (
          <button type="button" onClick={bauen} className="fk-btn-primary">
            <Icon name="clock" className="size-4" />
            Kalenderdatei erzeugen
          </button>
        )}
        <span className="text-fg-subtle text-sm">
          {abzug
            ? 'Danach im Kalenderprogramm öffnen.'
            : 'Entsteht in deinem Browser, nichts wird übertragen.'}
        </span>
      </div>

      <p className="text-fg-subtle mt-4 text-sm leading-relaxed">
        Das ist ein <strong className="text-fg font-semibold">Abzug</strong>, kein
        Abonnement: Änderst du die Merkliste oder verschieben sich Termine, lade die Datei
        neu herunter. Ein Abonnement bräuchte eine feste Adresse, und die müsste deine
        Auswahl enthalten – sie stünde damit im Protokoll jedes Servers dazwischen. Wer
        einen mitlaufenden Kalender will, findet unter{' '}
        <a href="/kalender" className="text-markets hover:underline">
          Kalender
        </a>{' '}
        den allgemeinen Börsenkalender zum Abonnieren.
      </p>
    </section>
  )
}
