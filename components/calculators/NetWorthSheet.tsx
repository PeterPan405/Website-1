'use client'

import { useId, useMemo, useState } from 'react'

import { ComparisonBars } from '@/components/calculators/CalculatorPanels'
import {
  entferneZeile,
  ergaenzeZeile,
  heute,
  leereWerte,
  setzeBetrag,
  setzeName,
  setzeStichtag,
  useBogenstand,
} from '@/components/calculators/vermoegen-speicher'
import { Callout } from '@/components/ui/Callout'
import { Icon } from '@/components/ui/Icon'
import { Stat, StatGrid } from '@/components/ui/Stat'
import { formatCurrency, formatNumber } from '@/lib/format'
import { formatForInput, parseGermanNumber } from '@/lib/parse-number'
import { erzeugePdf } from '@/lib/pdf'
import { siteConfig } from '@/lib/site'
import {
  alsPdfZeilen,
  alsTabelle,
  bogen,
  dateiname,
  werteAuswerten,
  zeilenVon,
  type Gruppe,
  type Posten,
  type Werte,
  type Zeile,
} from '@/lib/vermoegen'

/**
 * Der Bogen für das Nettovermögen.
 *
 * ## Warum das kein Rechner im üblichen Sinn ist
 *
 * Die anderen Rechner dieser Seite beantworten eine Frage. Dieser hier stellt
 * eine: Was besitzt du, was schuldest du, und was bleibt. Gerechnet wird nur
 * addiert und einmal subtrahiert – der Wert liegt nicht in der Rechnung,
 * sondern darin, dass man einmal alles zusammenträgt.
 *
 * ## Warum es zwei Downloads gibt
 *
 * Weil es zwei Arten gibt, so etwas zu machen. Die einen füllen hier aus und
 * nehmen das Ergebnis mit. Die anderen wollen einen leeren Bogen, den sie
 * ausdrucken und mit dem Kontoauszug daneben mit der Hand ausfüllen. Beide
 * Wege enden bei derselben Datei – nur einmal mit Zahlen und einmal ohne.
 *
 * ## Warum ein PDF und keine Tabelle
 *
 * Weil der Bogen zum Abheften da ist. Ein PDF sieht auf jedem Gerät gleich
 * aus, lässt sich ohne Rückfrage drucken und altert nicht mit dem
 * Tabellenprogramm. Die Fassung mit Semikolon gibt es weiterhin – aber unten,
 * bei der Zwischenablage, wo sie hingehört: für alle, die mit den Zahlen
 * weiterrechnen wollen.
 *
 * ## Wo die Eingaben bleiben
 *
 * Im Browser, im localStorage dieses Geräts – siehe `vermoegen-speicher.ts`.
 * Es gibt keinen Server, an den etwas ginge, und keine Anmeldung. Das ist bei
 * einer vollständigen Vermögensaufstellung kein Nebenaspekt, sondern die
 * Voraussetzung dafür, dass jemand sie überhaupt ausfüllt.
 */

/** Wie viele leere Spalten die heruntergeladene Datei für spätere Male bekommt. */
const WEITERE_SPALTEN = 5

/**
 * Die Adresse für die Fußzeile des Bogens – ohne Schema, wie man sie sagt.
 *
 * Aus `siteConfig.url` und nicht als Text daneben: Ein ausgedruckter Bogen
 * bleibt jahrelang in einem Ordner liegen, und die Adresse darauf ist die
 * einzige Spur zurück zur Website. Sie muss stimmen.
 */
const pdfAdresse = new URL(siteConfig.url).host.replace(/^www\./, '')

/**
 * Eine Datei im Browser erzeugen und herunterladen.
 *
 * ## Warum die Adresse erst später freigegeben wird
 *
 * Hier stand `URL.revokeObjectURL` unmittelbar nach dem Klick. Das sieht
 * aufgeräumt aus und ist ein Fehler: Der Klick stößt den Download nur an, der
 * Browser liest die Adresse erst danach. Wer sie sofort zurückgibt, zieht ihm
 * die Datei unter den Händen weg – je nach Browser kommt dann nichts oder ein
 * abgebrochener Download heraus. Eine Sekunde später ist der Download längst
 * gestartet und die Adresse wird nicht mehr gebraucht.
 *
 * ## Warum das Byte-Order-Mark davor gehört
 *
 * Ohne es liest eine deutsche Tabellenkalkulation die Datei als Windows-1252
 * und macht aus jedem Umlaut ein Fragezeichen. Mit ihm erkennt sie UTF-8 und
 * öffnet die Datei ohne Rückfrage.
 */
function herunterladen(
  inhalt: Blob | string,
  name: string,
  typ = 'text/csv;charset=utf-8'
) {
  const datei =
    inhalt instanceof Blob ? inhalt : new Blob(['\ufeff', inhalt], { type: typ })
  const adresse = URL.createObjectURL(datei)
  const verweis = document.createElement('a')
  verweis.href = adresse
  verweis.download = name
  verweis.rel = 'noopener'
  document.body.append(verweis)
  verweis.click()
  verweis.remove()
  window.setTimeout(() => URL.revokeObjectURL(adresse), 60_000)
}

export function NetWorthSheet() {
  const { stichtag, werte } = useBogenstand()
  const auswertung = useMemo(() => werteAuswerten(werte), [werte])

  /*
    Der Ausweg, wenn der Download nicht ankommt.

    Auf verwalteten Geräten – Firmenlaptops, Schulrechner, manche
    Sicherheitsprogramme – sperrt der Browser Downloads pauschal und meldet
    „durch Richtlinie blockiert“. Von der Website aus lässt sich daran nichts
    ändern: Die Sperre sitzt vor dem Herunterladen, nicht darin.

    Was sich ändern lässt, ist die Sackgasse. Der Bogen wird auf Wunsch als
    Text angezeigt, und von dort führen zwei Wege weiter, die keine Richtlinie
    kennt: kopieren und in eine leere Tabelle einfügen, oder markieren und
    ausdrucken.
  */
  const [tabelle, setTabelle] = useState<{ inhalt: string; name: string } | null>(null)
  const [kopiert, setKopiert] = useState(false)

  /**
   * Den Bogen als PDF erzeugen und herunterladen.
   *
   * Gebaut wird die Datei erst beim Klick. Ein PDF, das niemand anfordert,
   * muss auch nicht entstehen – und beim Klick sind es wenige Millisekunden.
   */
  function ladePdf(ausgefuellt: boolean) {
    const tag = stichtag || heute()
    const bytes = erzeugePdf({
      titel: 'Vermögensübersicht',
      untertitel: ausgefuellt
        ? `Stichtag ${tag.split('-').reverse().join('.')}`
        : `Zum Ausfüllen · Stichtag ${tag.split('-').reverse().join('.')}`,
      marke: siteConfig.name,
      /*
        Die Adresse kommt aus der Konfiguration und steht nicht mehr im Text.
        Hier stand `im-invests.de` – eine Domain mit Bindestrich, die es nicht
        gibt und nie gab; sie löst nicht einmal auf. Jeder ausgedruckte Bogen
        verwies damit auf eine Adresse, unter der niemand die Website findet.
        Aus `siteConfig.url` abgeleitet kann das nicht wieder auseinanderlaufen.
      */
      fusszeile: `${pdfAdresse} · Vermögensübersicht · im Browser erstellt, nichts gesendet`,
      zeilen: alsPdfZeilen({
        werte: ausgefuellt ? werte : undefined,
        stichtag: tag,
        weitereSpalten: 0,
      }),
    })
    herunterladen(
      new Blob([bytes as BlobPart], { type: 'application/pdf' }),
      dateiname(tag, ausgefuellt, 'pdf'),
      'application/pdf'
    )
  }

  function zeigeTabelle(ausgefuellt: boolean) {
    const tag = stichtag || heute()
    setKopiert(false)
    setTabelle({
      inhalt: alsTabelle({
        werte: ausgefuellt ? werte : undefined,
        stichtag: tag,
        weitereSpalten: WEITERE_SPALTEN,
      }),
      name: dateiname(tag, ausgefuellt, 'csv'),
    })
  }

  async function kopiere() {
    if (!tabelle) return
    try {
      await navigator.clipboard.writeText(tabelle.inhalt)
      setKopiert(true)
    } catch {
      // Ohne Zwischenablage bleibt der Text zum Markieren stehen.
      setKopiert(false)
    }
  }

  /*
    Der Stichtag ist bis zur Übernahme durch den Browser leer – absichtlich:
    Die Seite wird beim Erzeugen der Website vorgerendert, „heute“ wäre dort der
    Tag des Bauens und stimmte beim Besuch nicht mehr mit dem überein, was der
    Browser einsetzt. Angezeigt wird deshalb, was im Speicher steht; nur beim
    Herunterladen tritt ersatzweise das heutige Datum ein.
  */
  const postenGesamt = bogen.reduce((summe, gruppe) => summe + gruppe.posten.length, 0)

  return (
    <div className="space-y-6">
      <div className="fk-card p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <label
              htmlFor="vermoegen-stichtag"
              className="text-fg block text-sm font-medium"
            >
              Stichtag
            </label>
            <input
              id="vermoegen-stichtag"
              type="date"
              value={stichtag}
              onChange={(event) => setzeStichtag(event.target.value)}
              className="fk-input mt-1.5 w-auto"
            />
            <p className="text-fg-subtle mt-1.5 text-xs leading-relaxed">
              Das Datum, auf das sich alle Werte beziehen. Es steht später als
              Spaltenüberschrift in der Datei.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => ladePdf(true)}
              className="fk-btn-primary px-4 py-2 text-sm"
            >
              <Icon name="download" className="size-4" />
              Ausgefüllt als PDF
            </button>
            <button
              type="button"
              onClick={() => ladePdf(false)}
              className="fk-btn-secondary px-4 py-2 text-sm"
            >
              <Icon name="download" className="size-4" />
              Leerer Bogen als PDF
            </button>
          </div>
        </div>

        {/*
          Steht bewusst sichtbar unter den Knöpfen und nicht in einer
          Fehlermeldung: Ob der Download ankommt, weiß die Seite nicht – der
          Browser meldet die Sperre nicht zurück. Wer nichts bekommen hat, muss
          den zweiten Weg finden können, ohne danach zu suchen.
        */}
        <div className="border-border mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t pt-3">
          <p className="text-fg-subtle text-xs leading-relaxed">
            Kommt keine Datei an? Auf verwalteten Geräten sperren Browser Downloads
            pauschal. Dann hilft der Weg über die Zwischenablage:
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => zeigeTabelle(true)}
              className="fk-btn-ghost px-3 py-1.5 text-xs"
            >
              Als Tabelle anzeigen
            </button>
            <button
              type="button"
              onClick={() => zeigeTabelle(false)}
              className="fk-btn-ghost px-3 py-1.5 text-xs"
            >
              Leere Tabelle anzeigen
            </button>
          </div>
        </div>

        {tabelle && (
          <div className="border-border mt-4 border-t pt-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-fg text-sm font-medium">{tabelle.name}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void kopiere()}
                  className="fk-btn-secondary px-3 py-1.5 text-xs"
                >
                  <Icon name={kopiert ? 'check' : 'layers'} className="size-3.5" />
                  {kopiert ? 'Kopiert' : 'Alles kopieren'}
                </button>
                <button
                  type="button"
                  onClick={() => setTabelle(null)}
                  className="fk-btn-ghost px-3 py-1.5 text-xs"
                >
                  <Icon name="close" className="size-3.5" />
                  Schließen
                </button>
              </div>
            </div>
            <p className="text-fg-subtle mt-2 text-xs leading-relaxed">
              Kopieren, in einer leeren Tabelle einfügen und beim Einfügen das Semikolon
              als Trennzeichen wählen. Zum Ausdrucken genügt es, den Text zu markieren.
            </p>
            <textarea
              readOnly
              value={tabelle.inhalt}
              rows={12}
              onFocus={(event) => event.currentTarget.select()}
              aria-label={`Inhalt von ${tabelle.name}`}
              className="fk-input mt-3 font-mono text-xs"
            />
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        {/*
          Die beiden Überschriften stehen nur für Screenreader da: Sichtbar
          erklären sich die Spalten von selbst, aber ohne sie spränge die
          Gliederung von der h1 der Seite direkt zu den h3 der Gruppen.
        */}
        <section aria-labelledby="bogen-eingaben" className="min-w-0 space-y-6">
          <h2 id="bogen-eingaben" className="sr-only">
            Bogen ausfüllen
          </h2>
          {bogen.map((gruppe) => (
            <GruppenKarte
              key={gruppe.id}
              gruppe={gruppe}
              werte={werte}
              summe={auswertung.jeGruppe[gruppe.id] ?? 0}
            />
          ))}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-fg-subtle text-xs">
              {formatNumber(auswertung.ausgefuellt, 0)} von{' '}
              {formatNumber(postenGesamt, 0)} Zeilen ausgefüllt. Leere Zeilen zählen als
              null – es müssen nicht alle sein.
            </p>
            <button
              type="button"
              onClick={leereWerte}
              className="fk-btn-ghost px-3 py-1.5 text-xs"
              disabled={auswertung.ausgefuellt === 0}
            >
              <Icon name="close" className="size-3.5" />
              Alle Eingaben löschen
            </button>
          </div>
        </section>

        <section
          aria-labelledby="bogen-ergebnis"
          className="lg:sticky lg:top-24 lg:h-fit"
        >
          <h2 id="bogen-ergebnis" className="sr-only">
            Ergebnis
          </h2>
          <div className="fk-card p-5 sm:p-6">
            <p className="text-fg-muted text-sm font-medium">Nettovermögen</p>
            <p
              className={`mt-1.5 text-3xl font-bold tabular-nums ${
                auswertung.netto < 0 ? 'text-danger' : 'text-brand'
              }`}
            >
              {formatCurrency(auswertung.netto, 0)}
            </p>
            <p className="text-fg-subtle mt-2 text-sm leading-relaxed">
              Besitz minus Schulden
              {stichtag && ` zum ${stichtag.split('-').reverse().join('.')}`}.
            </p>

            <div className="mt-5">
              <ComparisonBars
                bars={[
                  {
                    label: 'Besitz',
                    value: auswertung.besitz,
                    display: formatCurrency(auswertung.besitz, 0),
                    barClass: 'bg-success',
                  },
                  {
                    label: 'Schulden',
                    value: auswertung.schulden,
                    display: formatCurrency(auswertung.schulden, 0),
                    barClass: 'bg-danger',
                  },
                ]}
              />
            </div>
          </div>

          <StatGrid columns={2} className="mt-4">
            <Stat
              label="Besitz"
              value={formatCurrency(auswertung.besitz, 0)}
              tone="positive"
            />
            <Stat
              label="Schulden"
              value={formatCurrency(auswertung.schulden, 0)}
              tone="negative"
            />
          </StatGrid>

          <p className="text-fg-subtle mt-4 text-xs leading-relaxed">
            Die Eingaben bleiben auf diesem Gerät. Sie werden nicht übertragen und nicht
            gespeichert außerhalb deines Browsers.
          </p>
        </section>
      </div>

      {auswertung.netto < 0 && (
        <Callout variant="info" title="Ein negatives Nettovermögen ist kein Fehler">
          <p>
            Wer ein Haus finanziert oder ein Studium hinter sich hat, steht am Anfang
            regelmäßig im Minus. Aussagekräftig ist nicht der Stand, sondern die Richtung:
            Lade den Bogen herunter, trage ihn in einem halben Jahr erneut ein und
            vergleiche die beiden Spalten.
          </p>
        </Callout>
      )}

      <Callout variant="tip" title="Zweimal im Jahr genügt">
        <p>
          Eine einzelne Aufstellung sagt wenig. Erst die Reihe zeigt, ob das Nettovermögen
          wächst und woran das liegt – am Sparen oder an den Kursen. Leg das PDF deshalb
          ab und mach in einem halben Jahr das nächste: Nebeneinander beantworten die
          beiden eine Frage, die eines allein nicht beantworten kann.
        </p>
      </Callout>
    </div>
  )
}

/** Eine Gruppe des Bogens mit ihren Posten. */
function GruppenKarte({
  gruppe,
  werte,
  summe,
}: {
  gruppe: Gruppe
  werte: Werte
  summe: number
}) {
  return (
    <section aria-labelledby={`gruppe-${gruppe.id}`} className="fk-card p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h3 id={`gruppe-${gruppe.id}`} className="text-fg text-base font-semibold">
          {gruppe.titel}
        </h3>
        <span
          className={`text-sm font-semibold tabular-nums ${
            gruppe.art === 'schulden' ? 'text-danger' : 'text-fg'
          }`}
        >
          {gruppe.art === 'schulden' && summe > 0 ? '− ' : ''}
          {formatCurrency(summe, 0)}
        </span>
      </div>
      <p className="text-fg-muted mt-1 text-sm leading-relaxed">{gruppe.erklaerung}</p>

      <div className="mt-4 space-y-3">
        {gruppe.posten.map((posten) => (
          <PostenBlock
            key={posten.id}
            posten={posten}
            zeilen={zeilenVon(werte, posten.id)}
          />
        ))}
      </div>
    </section>
  )
}

/** Das Raster einer Eingabezeile: Bezeichnung, Betrag, Knopf. */
const RASTER = 'grid grid-cols-[minmax(0,1fr)_8.5rem_2rem] items-center gap-2'

/**
 * Ein Posten mit seinen Zeilen.
 *
 * ## Warum es zwei Darstellungen gibt
 *
 * Weil die meisten Posten nur eine Zeile haben. Solange das so ist, steht die
 * Bezeichnung links und der Betrag rechts – eine Zeile, wie auf einem Formular.
 * Ein Bogen, der 26-mal zusätzlich nach einem Namen fragt, den niemand braucht,
 * wäre doppelt so lang und halb so benutzbar.
 *
 * Erst mit der zweiten Zeile ändert sich das: Ab da muss man sie unterscheiden
 * können, also bekommt jede ein Feld für ihre Bezeichnung, und der Name des
 * Postens rückt als Überschrift darüber.
 */
function PostenBlock({ posten, zeilen }: { posten: Posten; zeilen: Zeile[] }) {
  /*
    Ohne Eintrag wird eine gedachte erste Zeile gezeigt. Sie steht noch in
    keinem Speicher – erst wenn jemand etwas einträgt, entsteht sie wirklich.
    Ihre Nummer ist deshalb aus dem Posten abgeleitet und bleibt stabil.
  */
  const angezeigt: Zeile[] =
    zeilen.length > 0 ? zeilen : [{ id: `${posten.id}-erste`, betrag: 0 }]
  const mehrere = angezeigt.length > 1

  const plus = (
    <button
      type="button"
      onClick={() => ergaenzeZeile(posten.id)}
      className="fk-btn-ghost justify-self-center px-1.5 py-1"
      title={`Weitere Zeile für „${posten.label}“`}
    >
      <span aria-hidden="true" className="text-base leading-none">
        +
      </span>
      <span className="sr-only">Weitere Zeile für {posten.label}</span>
    </button>
  )

  const beschriftung = (
    <span className="min-w-0">
      <span className="text-fg block text-sm">{posten.label}</span>
      {posten.hinweis && (
        <span className="text-fg-subtle block text-xs leading-snug">
          {posten.hinweis}
        </span>
      )}
    </span>
  )

  if (!mehrere) {
    return (
      <div className={RASTER}>
        {beschriftung}
        <BetragsFeld posten={posten} zeile={angezeigt[0]} />
        {plus}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        {beschriftung}
        {plus}
      </div>

      <div className="mt-1.5 space-y-2">
        {angezeigt.map((zeile) => (
          <div key={zeile.id} className={RASTER}>
            <input
              type="text"
              value={zeile.name ?? ''}
              placeholder={posten.label}
              onChange={(event) => setzeName(posten.id, zeile.id, event.target.value)}
              aria-label={`Bezeichnung für ${posten.label}`}
              className="fk-input text-sm"
            />
            <BetragsFeld posten={posten} zeile={zeile} />
            <button
              type="button"
              onClick={() => entferneZeile(posten.id, zeile.id)}
              className="fk-btn-ghost justify-self-center px-1.5 py-1"
              title={`Zeile „${zeile.name?.trim() || posten.label}“ entfernen`}
            >
              <Icon name="close" className="size-3.5" />
              <span className="sr-only">
                Zeile {zeile.name?.trim() || posten.label} entfernen
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Das Betragsfeld einer Zeile.
 *
 * Bewusst nicht `NumberField`: Bei über zwanzig Zeilen untereinander braucht es
 * keine Schieberegler und keine Hinweistexte unter jedem Feld. Ein leeres Feld
 * bleibt leer und wird nicht zu einer Null – wer eine Zeile nicht ausfüllt,
 * soll das später auch sehen.
 */
function BetragsFeld({ posten, zeile }: { posten: Posten; zeile: Zeile }) {
  const fehlerId = useId()
  const wert = zeile.betrag
  const [text, setText] = useState(() => (wert === 0 ? '' : formatForInput(wert)))
  const [zuletzt, setZuletzt] = useState(wert)
  const [fehler, setFehler] = useState<string | undefined>(undefined)

  // Wird der Wert von außen gesetzt – etwa durch „Alle Eingaben löschen“ oder
  // das Laden aus dem Speicher –, das Textfeld nachziehen. Während des Renderns
  // statt in einem Effekt, wie React es für abgeleiteten State empfiehlt.
  if (wert !== zuletzt) {
    setZuletzt(wert)
    setText(wert === 0 ? '' : formatForInput(wert))
    setFehler(undefined)
  }

  function aendern(eingabe: string) {
    setText(eingabe)
    if (eingabe.trim() === '') {
      setFehler(undefined)
      setzeBetrag(posten.id, zeile.id, undefined)
      return
    }
    const gelesen = parseGermanNumber(eingabe, { min: 0, label: posten.label })
    setFehler(gelesen.error)
    if (gelesen.ok) setzeBetrag(posten.id, zeile.id, gelesen.value)
  }

  return (
    <div className="relative">
      <input
        type="text"
        inputMode="decimal"
        autoComplete="off"
        value={text}
        placeholder="—"
        onChange={(event) => aendern(event.target.value)}
        aria-label={zeile.name?.trim() || posten.label}
        aria-invalid={fehler ? true : undefined}
        aria-describedby={fehler ? fehlerId : undefined}
        className={`fk-input pr-7 text-right tabular-nums ${
          fehler ? 'border-danger focus:border-danger' : ''
        }`}
      />
      <span
        aria-hidden="true"
        className="text-fg-subtle pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-sm"
      >
        €
      </span>
      {fehler && (
        <p id={fehlerId} role="alert" className="text-danger mt-1 text-xs font-medium">
          {fehler}
        </p>
      )}
    </div>
  )
}
