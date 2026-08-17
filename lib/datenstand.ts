import {
  handelsplatzFuer,
  verpassteSitzungen,
  type Instrumentkennung,
} from '@/lib/handelszeiten'

/**
 * Wie alt eine Zahl ist – und ab wann das zu alt wäre.
 *
 * ## Warum die Zahl allein nicht reicht
 *
 * „Stand 14. August" beantwortet die Frage nicht, die jemand hat. Er will
 * wissen, ob er der Zahl trauen kann, und dafür muss er wissen, wie oft sie
 * sich überhaupt ändert. Vierzehn Tage sind bei einem Aktienkurs ein Ausfall
 * und bei der Leistungsbilanz der Bundesbank ein normaler Dienstag.
 *
 * Die verstreuten Stand-Hinweise auf der Website nannten bisher nur das
 * Datum. Wer den Takt der Quelle nicht kennt – und das ist fast jeder –,
 * konnte daraus nichts ableiten.
 *
 * ## Die Falle, um die sich hier alles dreht
 *
 * **Diese Website wird statisch gebaut.** Eine Ampel, die beim Bau rechnet,
 * friert ihr Ergebnis ein: Sie stünde auf Grün, weil der Wert *beim Bauen*
 * frisch war, und bliebe grün, während die Seite drei Tage im Cache liegt.
 * Sie könnte per Konstruktion nie rot werden.
 *
 * Das ist genau die Sorte Absicherung, die aussieht wie Ruhe. Deshalb:
 *
 * - Diese Datei rechnet **nichts** aus einer eigenen Uhr. `jetzt` ist immer
 *   ein Argument.
 * - `components/ui/Datenstandsampel.tsx` ruft sie **im Browser** auf, mit der
 *   Uhr des Besuchers. Server- und Bauzeit sehen nur das Datum ohne Urteil.
 *
 * Wer diese Funktionen in einer Server-Komponente aufruft und das Ergebnis
 * ausliefert, hebt die Absicherung auf – ohne dass etwas rot wird.
 *
 * ## Warum Handelsplätze anders gemessen werden als Statistiken
 *
 * Bei einem Kurs zählen nicht Stunden, sondern **verpasste Handelsschlüsse**.
 * Ein Kurs vom Freitagabend ist am Montagmorgen sechzig Stunden alt und
 * völlig in Ordnung; derselbe Kurs am Dienstagmorgen hat eine Sitzung
 * verpasst und ist ein Fehler. Das rechnet `verpassteSitzungen()` in
 * `lib/handelszeiten.ts` – dieselbe Funktion, die auch der Kursabruf
 * benutzt, damit Anzeige und Überwachung nicht auseinanderlaufen.
 *
 * Bei einer Statistik zählen Tage gegen den Veröffentlichungstakt, nach
 * derselben Faustregel wie in `lib/reihen-alter.ts`: das Doppelte des Takts,
 * mindestens eine Woche Luft. Eine Grenze, die den guten Tag gerade eben
 * trägt, ist eine Wette.
 */

/** Wie frisch eine Zahl ist. */
export type Frische = 'frisch' | 'aelter' | 'veraltet'

/** Das Ergebnis einer Beurteilung – Stufe, Alter und ein ganzer Satz dazu. */
export interface Datenstand {
  frische: Frische
  /** Alter in vollen Tagen. `null`, wenn der Zeitstempel unlesbar ist. */
  alterTage: number | null
  /**
   * Ein Satz, der ohne die Ampel auskommt.
   *
   * Farbe allein ist keine Aussage: Sie ist für rund acht Prozent der Männer
   * schlecht unterscheidbar und für einen Screenreader gar nicht vorhanden.
   */
  satz: string
}

/**
 * Was von einer Quelle erwartet wird.
 *
 * Zwei Formen, weil es zwei verschiedene Messungen sind – siehe oben. Beide
 * tragen ihre Erwartung ausdrücklich mit sich: Eine Ampel ohne den Takt, an
 * dem sie misst, wäre eine Meinung.
 */
export type Erwartung =
  | {
      art: 'handel'
      /** Das Instrument, dessen Börse den Takt vorgibt. */
      instrument: Instrumentkennung
    }
  | {
      art: 'takt'
      /** Wie oft die Quelle liefert – erscheint im Satz. */
      takt: string
      /** Ab wie vielen Tagen die Zahl als älter gilt. */
      aelterAbTagen: number
      /** Ab wie vielen Tagen sie als veraltet gilt. */
      veraltetAbTagen: number
    }

const TAG_MS = 24 * 60 * 60 * 1000

/** Volle Tage zwischen zwei Zeitpunkten. `null`, wenn `stand` unlesbar ist. */
export function alterInTagen(stand: string, jetzt: Date): number | null {
  const zeit = Date.parse(stand.length === 10 ? `${stand}T00:00:00Z` : stand)
  if (Number.isNaN(zeit)) return null
  return Math.floor((jetzt.getTime() - zeit) / TAG_MS)
}

/** „vor 3 Tagen“, „gestern“, „heute“ – ohne Datum, das steht daneben. */
function alterText(tage: number): string {
  if (tage <= 0) return 'von heute'
  if (tage === 1) return 'von gestern'
  return `${tage} Tage alt`
}

/**
 * Beurteilt einen Zeitstempel gegen die Erwartung an seine Quelle.
 *
 * `jetzt` ist Pflicht und hat keinen Vorgabewert. Ein `jetzt = new Date()`
 * würde diese Funktion in einer Server-Komponente stillschweigend auf die
 * Bauzeit setzen – und genau das soll auffallen, wenn es jemand tut.
 */
export function beurteile(stand: string, erwartung: Erwartung, jetzt: Date): Datenstand {
  const tage = alterInTagen(stand, jetzt)

  if (tage === null) {
    return {
      frische: 'veraltet',
      alterTage: null,
      satz: 'Der Zeitstempel dieser Angabe ist nicht lesbar.',
    }
  }

  if (erwartung.art === 'handel') {
    const platz = handelsplatzFuer(erwartung.instrument)

    /*
      Ohne bekannten Handelsplatz wird nicht geraten.

      Krypto handelt durchgehend, ein unbekanntes Instrument könnte alles
      sein. Eine Ampel, die hier eine Farbe erfindet, behauptet mehr als sie
      weiß – dann lieber nur das Alter und kein Urteil.
    */
    if (!platz) {
      return {
        frische: tage <= 1 ? 'frisch' : tage <= 4 ? 'aelter' : 'veraltet',
        alterTage: tage,
        satz: `Diese Zahl ist ${alterText(tage)}. Für dieses Instrument ist kein Handelsplatz hinterlegt, deshalb ohne Vergleich mit seinen Handelszeiten.`,
      }
    }

    const zeit = Date.parse(stand.length === 10 ? `${stand}T00:00:00Z` : stand)
    const verpasst = verpassteSitzungen(platz, new Date(zeit), jetzt)

    if (verpasst === 0) {
      return {
        frische: 'frisch',
        alterTage: tage,
        satz: `Diese Zahl ist ${alterText(tage)} und damit auf dem Stand des letzten Schlusses am Handelsplatz ${platz.name}.`,
      }
    }
    if (verpasst === 1) {
      return {
        frische: 'aelter',
        alterTage: tage,
        satz: `Seit dieser Zahl hat der Handelsplatz ${platz.name} einmal geschlossen, ohne dass ein neuer Kurs ankam.`,
      }
    }
    return {
      frische: 'veraltet',
      alterTage: tage,
      satz: `Seit dieser Zahl hat der Handelsplatz ${platz.name} ${verpasst}-mal geschlossen, ohne dass ein neuer Kurs ankam. Der Abruf hat wahrscheinlich ein Problem.`,
    }
  }

  if (tage < erwartung.aelterAbTagen) {
    return {
      frische: 'frisch',
      alterTage: tage,
      satz: `Diese Zahl ist ${alterText(tage)}. Die Quelle liefert ${erwartung.takt}.`,
    }
  }
  if (tage < erwartung.veraltetAbTagen) {
    return {
      frische: 'aelter',
      alterTage: tage,
      satz: `Diese Zahl ist ${alterText(tage)}. Die Quelle liefert ${erwartung.takt} – eine Aktualisierung steht also aus, ist aber noch im Rahmen.`,
    }
  }
  return {
    frische: 'veraltet',
    alterTage: tage,
    satz: `Diese Zahl ist ${alterText(tage)}, obwohl die Quelle ${erwartung.takt} liefert. Hier stimmt etwas nicht.`,
  }
}

/**
 * Eine Takt-Erwartung nach der Faustregel aus `lib/reihen-alter.ts`.
 *
 * Das Doppelte des Takts gilt als älter, das Dreifache als veraltet –
 * mindestens aber eine Woche Luft. Ohne diesen Mindestabstand schlüge eine
 * tägliche Quelle schon nach zwei Tagen an, und eine Prüfung, die grundlos
 * anschlägt, wird abgeschaltet.
 */
export function taktErwartung(takt: string, taktTage: number): Erwartung {
  return {
    art: 'takt',
    takt,
    aelterAbTagen: Math.max(7, taktTage * 2),
    veraltetAbTagen: Math.max(14, taktTage * 3),
  }
}
