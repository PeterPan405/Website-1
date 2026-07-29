/**
 * Der Bogen für das Nettovermögen – Aufbau, Summen und Ausgabe als Tabelle.
 *
 * Bewusst ohne Importe, damit `tests/` das Modul direkt laden kann.
 *
 * ## Warum ein Bogen und keine App
 *
 * Weil das Nettovermögen keine Zahl ist, die man täglich braucht, sondern eine,
 * die man ein- bis viermal im Jahr aufschreibt und danebenlegt. Genau dafür ist
 * eine Tabelle zum Abheften das richtige Werkzeug – und nicht ein Konto bei
 * einem Anbieter, dem man dafür sein gesamtes Vermögen offenlegt.
 *
 * Alles bleibt deshalb im Browser. Es gibt keinen Server, an den etwas ginge.
 *
 * ## Warum die Datei so aussieht, wie sie aussieht
 *
 * Semikolon statt Komma als Trennzeichen, Komma als Dezimalzeichen und ein
 * Byte-Order-Mark am Anfang: Das ist die Kombination, mit der die Datei in
 * einer deutschen Tabellenkalkulation aufgeht, ohne dass jemand einen
 * Importdialog bedienen muss. Mit Komma-Trennung und Punkt-Dezimalzeichen
 * landet alles in einer einzigen Spalte, und Umlaute werden zu Fragezeichen.
 */

/**
 * Die Zeilenform, die `lib/pdf.ts` erwartet.
 *
 * Bewusst hier wiederholt statt importiert: Diese Datei bleibt ohne Importe,
 * damit die Prüfungen sie direkt laden können. Die Wiederholung ist drei Zeilen
 * lang, und wenn sie auseinanderläuft, meldet es der Übersetzer an der Stelle,
 * an der beide zusammenkommen.
 */
export type PdfZeilen = (
  | { art: 'ueberschrift'; text: string }
  | { art: 'unterueberschrift'; text: string; betrag?: string }
  | { art: 'zeile'; text: string; betrag?: string; eingerueckt?: boolean }
  | { art: 'summe'; text: string; betrag?: string }
  | { art: 'hinweis'; text: string }
  | { art: 'abstand' }
  | { art: 'linie' }
  | { art: 'seitenumbruch' }
)[]

export type Gruppenart = 'besitz' | 'schulden'

export interface Posten {
  id: string
  label: string
  /** Ein Hinweis, was gemeint ist – steht als Hilfetext am Feld. */
  hinweis?: string
}

export interface Gruppe {
  id: string
  titel: string
  art: Gruppenart
  /** Ein Satz darüber, was in diese Gruppe gehört. */
  erklaerung: string
  posten: Posten[]
}

/**
 * Der Aufbau des Bogens.
 *
 * Die Reihenfolge ist nicht beliebig: Sie beginnt bei dem, was man sofort
 * nachsehen kann (Kontostände), und endet bei dem, was man schätzen muss
 * (Sachwerte). Wer oben anfängt, hat nach fünf Minuten schon einen Teil
 * beisammen – wer bei der Immobilienbewertung anfängt, hört dort auf.
 */
export const bogen: Gruppe[] = [
  {
    id: 'liquide',
    titel: 'Konten und Bargeld',
    art: 'besitz',
    erklaerung:
      'Alles, woran du heute ohne Verlust herankommst. Diese Zeilen sind in fünf Minuten ausgefüllt.',
    posten: [
      { id: 'giro', label: 'Girokonto' },
      { id: 'tagesgeld', label: 'Tagesgeld' },
      { id: 'festgeld', label: 'Festgeld', hinweis: 'Auch wenn es noch gebunden ist.' },
      { id: 'bargeld', label: 'Bargeld' },
    ],
  },
  {
    id: 'anlagen',
    titel: 'Geldanlagen',
    art: 'besitz',
    erklaerung:
      'Der aktuelle Wert, nicht der Einstandspreis. Was du bezahlt hast, ist für diese Aufstellung ohne Bedeutung.',
    posten: [
      { id: 'depot', label: 'Depot: Aktien und ETFs' },
      { id: 'fonds', label: 'Fonds außerhalb des Depots' },
      { id: 'anleihen', label: 'Anleihen und Sparbriefe' },
      { id: 'krypto', label: 'Kryptowährungen' },
      { id: 'edelmetalle', label: 'Edelmetalle', hinweis: 'Zum aktuellen Ankaufspreis.' },
    ],
  },
  {
    id: 'vorsorge',
    titel: 'Altersvorsorge',
    art: 'besitz',
    erklaerung:
      'Der heutige Rückkaufs- oder Anwartschaftswert. Bei der gesetzlichen Rente steht dieser Wert in der jährlichen Renteninformation.',
    posten: [
      {
        id: 'gesetzlich',
        label: 'Gesetzliche Rentenversicherung',
        hinweis: 'Bewusst ohne Voreinstellung – manche rechnen sie mit, manche nicht.',
      },
      { id: 'betrieblich', label: 'Betriebliche Altersvorsorge' },
      { id: 'privat', label: 'Private Renten- und Lebensversicherung' },
      { id: 'ruerup', label: 'Rürup- oder Riester-Vertrag' },
    ],
  },
  {
    id: 'sachwerte',
    titel: 'Sachwerte',
    art: 'besitz',
    erklaerung:
      'Hier wird geschätzt, und das ist in Ordnung – solange die Schätzung vorsichtig ist und beim nächsten Mal nach derselben Regel entsteht.',
    posten: [
      { id: 'immobilie', label: 'Selbst genutzte Immobilie' },
      { id: 'vermietet', label: 'Vermietete Immobilien' },
      { id: 'fahrzeug', label: 'Fahrzeuge' },
      { id: 'wertgegenstaende', label: 'Wertgegenstände' },
      { id: 'firmenanteile', label: 'Firmenanteile und Beteiligungen' },
      {
        id: 'forderungen',
        label: 'Forderungen',
        hinweis: 'Geld, das dir jemand schuldet.',
      },
    ],
  },
  {
    id: 'immobilienkredite',
    titel: 'Immobilienkredite',
    art: 'schulden',
    erklaerung: 'Die heutige Restschuld, nicht die ursprüngliche Kreditsumme.',
    posten: [
      { id: 'hypothek', label: 'Hypothek auf die selbst genutzte Immobilie' },
      { id: 'hypothekVermietet', label: 'Hypotheken auf vermietete Immobilien' },
    ],
  },
  {
    id: 'weitereSchulden',
    titel: 'Übrige Schulden',
    art: 'schulden',
    erklaerung:
      'Alles, was sonst noch offen ist. Der Dispo gehört auch dann hierher, wenn er „nur kurz“ in Anspruch genommen ist.',
    posten: [
      { id: 'ratenkredit', label: 'Raten- und Konsumkredite' },
      { id: 'dispo', label: 'Dispositionskredit' },
      { id: 'kreditkarte', label: 'Offene Kreditkartenbeträge' },
      { id: 'bafoeg', label: 'BAföG oder Studienkredit' },
      { id: 'privatschulden', label: 'Private Schulden' },
    ],
  },
]

/**
 * Eine eingetragene Zeile.
 *
 * Ein Posten kann mehrere haben – wer drei Girokonten führt, trägt drei ein.
 * Der Name ist freiwillig: Steht keiner da, gilt die Bezeichnung des Postens.
 * Das hält den Bogen für alle leicht, die nur eine Zeile brauchen, und öffnet
 * ihn für alle anderen.
 */
export interface Zeile {
  /** Innerhalb des Postens eindeutig – für die Zuordnung im Speicher. */
  id: string
  /** Freie Bezeichnung, etwa „Girokonto Sparkasse“. */
  name?: string
  betrag: number
}

/** Die eingetragenen Zeilen, nach Postennummer. */
export type Werte = Record<string, Zeile[]>

/**
 * Die frühere Form: ein Betrag je Posten.
 *
 * Sie steht noch im Speicher aller, die den Bogen vor der Erweiterung
 * ausgefüllt haben. Weggeworfen wird davon nichts – gelesen wird beides.
 */
export type AlteWerte = Record<string, number>

/** Eine Zeile mit einer neuen, eindeutigen Nummer. */
export function neueZeile(betrag = 0, name?: string): Zeile {
  return {
    id: `z${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`,
    name,
    betrag,
  }
}

/**
 * Alte Werte in die neue Form bringen.
 *
 * Aus `{ giro: 2500 }` wird eine Zeile ohne Namen. Sie sieht danach im Bogen
 * genauso aus wie vorher – nur dass jetzt eine zweite danebenpasst.
 */
export function ausAltemFormat(alt: AlteWerte): Werte {
  const werte: Werte = {}
  for (const [id, betrag] of Object.entries(alt)) {
    if (typeof betrag !== 'number' || !Number.isFinite(betrag)) continue
    werte[id] = [neueZeile(betrag)]
  }
  return werte
}

export interface Auswertung {
  besitz: number
  schulden: number
  netto: number
  /** Summe je Gruppe, nach Gruppennummer. */
  jeGruppe: Record<string, number>
  /** Wie viele Zeilen ausgefüllt sind – für den Hinweis, dass etwas fehlt. */
  ausgefuellt: number
}

/** Die Zeilen eines Postens – auch wenn keine da sind. */
export function zeilenVon(werte: Werte, id: string): Zeile[] {
  const zeilen = werte[id]
  return Array.isArray(zeilen) ? zeilen : []
}

function betrag(zeile: Zeile): number {
  return typeof zeile.betrag === 'number' && Number.isFinite(zeile.betrag)
    ? zeile.betrag
    : 0
}

export function werteAuswerten(werte: Werte): Auswertung {
  const jeGruppe: Record<string, number> = {}
  let besitz = 0
  let schulden = 0
  let ausgefuellt = 0

  for (const gruppe of bogen) {
    let summe = 0
    for (const posten of gruppe.posten) {
      for (const zeile of zeilenVon(werte, posten.id)) {
        const wert = betrag(zeile)
        summe += wert
        if (wert !== 0) ausgefuellt += 1
      }
    }
    jeGruppe[gruppe.id] = summe
    if (gruppe.art === 'besitz') besitz += summe
    else schulden += summe
  }

  return { besitz, schulden, netto: besitz - schulden, jeGruppe, ausgefuellt }
}

/** Eine Zahl im deutschen Format, ohne Tausendertrennung. */
function deutscheZahl(wert: number): string {
  return wert.toFixed(2).replace('.', ',')
}

/** Ein Feld so einpacken, dass Semikolon und Anführungszeichen darin überleben. */
function feld(text: string): string {
  return /[";\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export interface TabellenOptionen {
  /** Die eingetragenen Werte. Fehlen sie, entsteht ein leerer Bogen. */
  werte?: Werte
  /** Datum der ersten Spalte, im Format JJJJ-MM-TT. */
  stichtag: string
  /**
   * Wie viele leere Spalten für spätere Stichtage angehängt werden.
   *
   * Der eigentliche Zweck des Bogens: Eine einzelne Momentaufnahme sagt wenig,
   * die Reihe über zwei Jahre sagt alles. Deshalb kommt die Datei mit Platz für
   * die nächsten Male – wer sie ausdruckt, hat die Spalten zum Eintragen schon
   * da.
   */
  weitereSpalten: number
}

/**
 * Der Bogen als Tabelle mit Semikolon-Trennung.
 *
 * Gibt eine Zeichenkette zurück, die als Datei gespeichert werden kann. Das
 * Byte-Order-Mark setzt die aufrufende Stelle, weil es zur Datei gehört und
 * nicht zum Inhalt.
 */
export function alsTabelle(optionen: TabellenOptionen): string {
  const { werte, stichtag, weitereSpalten } = optionen
  const zeilen: string[] = []

  const kopf = ['Bereich', 'Posten', stichtag]
  for (let i = 0; i < weitereSpalten; i += 1) kopf.push('')
  zeilen.push(kopf.map(feld).join(';'))

  const auswertung = werte ? werteAuswerten(werte) : null
  const leer = ';'.repeat(weitereSpalten)

  for (const gruppe of bogen) {
    zeilen.push('')
    zeilen.push(
      [
        feld(gruppe.art === 'besitz' ? 'BESITZ' : 'SCHULDEN'),
        feld(gruppe.titel),
        '',
      ].join(';') + leer
    )

    for (const posten of gruppe.posten) {
      /*
        Leere Zeilen fallen hier heraus, nicht schon im Speicher.

        Im Bogen bleibt eine Zeile stehen, auch wenn ihr Feld gerade leer ist –
        sonst verschwände sie beim Korrigieren einer Zahl unter den Fingern. In
        der Datei hat sie nichts verloren: Dort stünde „0,00“, und das behauptet
        „geprüft, es ist keins da“, wo nichts geprüft wurde.
      */
      const eingetragen = werte
        ? zeilenVon(werte, posten.id).filter(
            (zeile) => betrag(zeile) !== 0 || zeile.name?.trim()
          )
        : []

      /*
        Ein Posten ohne Eintrag bekommt trotzdem seine Zeile.

        Das ist der ganze Zweck des leeren Bogens: Er soll die Gliederung
        zeigen, damit man ihn ausdrucken und mit der Hand ausfüllen kann. Aus
        demselben Grund bleibt der Betrag leer statt „0,00“ – für die Summe ist
        beides dasselbe, für den Menschen davor nicht. Eine Null behauptet
        „geprüft, es ist keins da“, eine leere Zelle sagt „hier stand nichts an“.
      */
      if (eingetragen.length === 0) {
        zeilen.push([feld(gruppe.titel), feld(posten.label), ''].join(';') + leer)
        continue
      }

      /*
        Mehrere Zeilen je Posten stehen einzeln untereinander.

        Wer drei Girokonten führt, will beim Nachlesen sehen, welches wie viel
        hält – eine zusammengezogene Summe nähme genau die Auskunft weg, für die
        er sie einzeln eingetragen hat. Ohne eigenen Namen steht die Bezeichnung
        des Postens da.
      */
      for (const zeile of eingetragen) {
        const bezeichnung = zeile.name?.trim() ? zeile.name.trim() : posten.label
        zeilen.push(
          [feld(gruppe.titel), feld(bezeichnung), deutscheZahl(betrag(zeile))].join(';') +
            leer
        )
      }
    }

    zeilen.push(
      [
        '',
        feld(`Summe ${gruppe.titel}`),
        auswertung ? deutscheZahl(auswertung.jeGruppe[gruppe.id] ?? 0) : '',
      ].join(';') + leer
    )
  }

  zeilen.push('')
  zeilen.push(
    ['', feld('Besitz gesamt'), auswertung ? deutscheZahl(auswertung.besitz) : ''].join(
      ';'
    ) + leer
  )
  zeilen.push(
    [
      '',
      feld('Schulden gesamt'),
      auswertung ? deutscheZahl(auswertung.schulden) : '',
    ].join(';') + leer
  )
  zeilen.push(
    ['', feld('NETTOVERMÖGEN'), auswertung ? deutscheZahl(auswertung.netto) : ''].join(
      ';'
    ) + leer
  )

  return zeilen.join('\r\n') + '\r\n'
}

/** Der Dateiname, unter dem der Bogen gespeichert wird. */
export function dateiname(
  stichtag: string,
  ausgefuellt: boolean,
  endung: 'pdf' | 'csv' = 'pdf'
): string {
  return `vermoegensuebersicht-${stichtag}${ausgefuellt ? '' : '-leer'}.${endung}`
}

/** Ein Datum von `2026-07-29` nach `29.07.2026`. */
function deutschesDatum(stichtag: string): string {
  const teile = stichtag.split('-')
  return teile.length === 3 ? `${teile[2]}.${teile[1]}.${teile[0]}` : stichtag
}

/** Ein Betrag mit Tausenderpunkten – im PDF ist Platz dafür. */
function betragsText(wert: number): string {
  const zeichen = wert < 0 ? '-' : ''
  const [ganz, nachkomma] = Math.abs(wert).toFixed(2).split('.')
  const gruppiert = ganz.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${zeichen}${gruppiert},${nachkomma} EUR`
}

/**
 * Der Bogen als Zeilen für ein PDF.
 *
 * ## Warum das hier steht und nicht im PDF-Modul
 *
 * Weil es zwei verschiedene Fragen sind: Wie ein Vermögensbogen aufgebaut ist,
 * weiß diese Datei; wie man Text auf eine Seite setzt, weiß `lib/pdf.ts`.
 * Dazwischen liegt eine Liste von Zeilen, und beide Seiten können sich ändern,
 * ohne die andere anzufassen.
 *
 * ## Was im PDF anders ist als in der Tabelle
 *
 * Die Tabelle ist zum Weiterrechnen da, das PDF zum Abheften. Deshalb stehen
 * hier Tausenderpunkte und die Währung an jedem Betrag, die Summen sind
 * hervorgehoben, und am Ende steht das Nettovermögen groß. Leere Zeilen bleiben
 * mit einer Punktreihe stehen – auf einem Blatt, das man ausdruckt und mit der
 * Hand ausfüllt, ist genau das der Zweck.
 */
export function alsPdfZeilen(optionen: TabellenOptionen): PdfZeilen {
  const { werte, stichtag } = optionen
  const auswertung = werte ? werteAuswerten(werte) : null
  const zeilen: PdfZeilen = []

  for (const gruppe of bogen) {
    zeilen.push({
      art: 'unterueberschrift',
      text: gruppe.titel,
      betrag: auswertung ? betragsText(auswertung.jeGruppe[gruppe.id] ?? 0) : undefined,
    })
    zeilen.push({ art: 'hinweis', text: gruppe.erklaerung })

    for (const posten of gruppe.posten) {
      const eingetragen = werte
        ? zeilenVon(werte, posten.id).filter(
            (zeile) => betrag(zeile) !== 0 || zeile.name?.trim()
          )
        : []

      if (eingetragen.length === 0) {
        // Die Punktreihe ist die Linie zum Eintragen mit der Hand.
        zeilen.push({
          art: 'zeile',
          text: posten.label,
          betrag: werte ? undefined : '. . . . . . . . . . .',
          eingerueckt: true,
        })
        continue
      }

      for (const zeile of eingetragen) {
        zeilen.push({
          art: 'zeile',
          text: zeile.name?.trim() ? zeile.name.trim() : posten.label,
          betrag: betragsText(betrag(zeile)),
          eingerueckt: true,
        })
      }
    }

    zeilen.push({ art: 'abstand' })
  }

  zeilen.push({ art: 'linie' })
  zeilen.push({
    art: 'summe',
    text: 'Besitz gesamt',
    betrag: auswertung ? betragsText(auswertung.besitz) : undefined,
  })
  zeilen.push({
    art: 'summe',
    text: 'Schulden gesamt',
    betrag: auswertung ? betragsText(auswertung.schulden) : undefined,
  })
  zeilen.push({
    art: 'unterueberschrift',
    text: 'NETTOVERMÖGEN',
    betrag: auswertung ? betragsText(auswertung.netto) : undefined,
  })

  zeilen.push({ art: 'abstand' })
  zeilen.push({
    art: 'hinweis',
    text: werte
      ? `Stand ${deutschesDatum(stichtag)}. Eine einzelne Aufstellung sagt wenig – erst die Reihe uber mehrere Jahre zeigt, ob das Nettovermogen wachst und woran das liegt.`
          .replace('uber', 'über')
          .replace('Nettovermogen', 'Nettovermögen')
          .replace('wachst', 'wächst')
      : 'Zum Ausdrucken und mit der Hand Ausfüllen. Schulden werden als positive Beträge eingetragen und beim Nettovermögen abgezogen.',
  })

  return zeilen
}
