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

/** Die eingetragenen Beträge, nach Postennummer. */
export type Werte = Record<string, number>

export interface Auswertung {
  besitz: number
  schulden: number
  netto: number
  /** Summe je Gruppe, nach Gruppennummer. */
  jeGruppe: Record<string, number>
  /** Wie viele Zeilen ausgefüllt sind – für den Hinweis, dass etwas fehlt. */
  ausgefuellt: number
}

function betrag(werte: Werte, id: string): number {
  const wert = werte[id]
  return typeof wert === 'number' && Number.isFinite(wert) ? wert : 0
}

export function werteAuswerten(werte: Werte): Auswertung {
  const jeGruppe: Record<string, number> = {}
  let besitz = 0
  let schulden = 0
  let ausgefuellt = 0

  for (const gruppe of bogen) {
    let summe = 0
    for (const posten of gruppe.posten) {
      const wert = betrag(werte, posten.id)
      summe += wert
      if (wert !== 0) ausgefuellt += 1
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
        Nicht ausgefüllte Zeilen bleiben leer statt „0,00“.

        Für die Summe ist beides dasselbe – eine leere Zelle zählt in jeder
        Tabellenkalkulation als null. Für den Menschen davor nicht: Eine Null
        behauptet „geprüft, es ist keins da“, eine leere Zelle sagt „hier stand
        nichts an“. Auf einem Bogen mit 26 Zeilen, von denen die meisten leer
        bleiben, ist das der Unterschied zwischen lesbar und zugestellt.
      */
      const eingetragen = werte ? werte[posten.id] : undefined
      const wert =
        typeof eingetragen === 'number' && Number.isFinite(eingetragen)
          ? deutscheZahl(eingetragen)
          : ''
      zeilen.push([feld(gruppe.titel), feld(posten.label), wert].join(';') + leer)
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
export function dateiname(stichtag: string, ausgefuellt: boolean): string {
  return `vermoegensuebersicht-${stichtag}${ausgefuellt ? '' : '-leer'}.csv`
}
