/**
 * Das Ergebnis eines Rechners als Dokument – zum Mitnehmen.
 *
 * ## Warum
 *
 * Weil ein Rechnerergebnis auf dem Bildschirm verschwindet, sobald man die
 * Seite verlässt. Wer mit einer Zahl ins Bankgespräch geht, sie mit jemandem
 * bespricht oder in einem Jahr nachsehen will, was er damals angenommen hat,
 * braucht sie auf Papier oder als Datei.
 *
 * ## Warum die Annahmen mit ins Dokument gehören
 *
 * Weil das Ergebnis ohne sie wertlos ist. „312.000 Euro“ ist keine Aussage;
 * „312.000 Euro bei 250 Euro monatlich, 7 Prozent und 30 Jahren“ ist eine. Ein
 * Blatt, auf dem nur das Ergebnis steht, wird in einem Jahr für eine Auskunft
 * gehalten statt für eine Fortschreibung – und dann rechnet niemand mehr nach,
 * woher die Zahl kam.
 *
 * Deshalb ist `annahmen` im Bericht **nicht optional**.
 *
 * ## Zwei Formate, zwei Zwecke
 *
 * PDF zum Lesen, Abheften und Weitergeben – mit allen Hinweisen, gestaltet.
 * CSV zum Weiterrechnen in einer Tabellenkalkulation. Die Hinweise stehen auch
 * dort, als Zeilen am Ende: Eine Datei, die man weitergibt, muss sich selbst
 * erklären, und ein CSV ohne Kontext ist eine Spalte Zahlen ohne Herkunft.
 *
 * Ohne Laufzeitimporte außer den Rechtshinweisen, damit `tests/` das Modul
 * direkt laden kann.
 */

import {
  DOKUMENT_HINWEISE,
  RECHTSHINWEIS_KERN,
  RECHTSHINWEIS_TITEL,
  erstelltAm,
} from './rechtshinweis.ts'

/** Ein benannter Wert – eine Annahme oder ein Ergebnis. */
export interface Berichtszeile {
  bezeichnung: string
  /** Der Wert, bereits formatiert. Die Formatierung kennt der Rechner. */
  wert: string
  /** Ein Satz zur Einordnung, sofern nötig. */
  hinweis?: string
}

/** Ein Abschnitt mit Zeilen. */
export interface Berichtsblock {
  titel: string
  zeilen: Berichtszeile[]
}

/** Was ein Rechner über sein Ergebnis mitteilt. */
export interface Ergebnisbericht {
  /** Der Name des Rechners, wie er auf dem Dokument steht. */
  titel: string
  /** Die Adresse der Rechnerseite, für die Fußzeile und zum Nachrechnen. */
  pfad: string
  /**
   * Womit gerechnet wurde. Pflicht – siehe oben.
   *
   * Ein Bericht ohne Annahmen wird von `alsPdfZeilen` beanstandet und nicht
   * stillschweigend kürzer ausgegeben.
   */
  annahmen: Berichtszeile[]
  /** Was herausgekommen ist. */
  ergebnisse: Berichtszeile[]
  /** Weitere Aufstellungen, etwa eine Aufteilung oder ein Jahresverlauf. */
  bloecke?: Berichtsblock[]
  /**
   * Die Grenzen dieses Rechners, aus seiner Methodik.
   *
   * Kommen zu den allgemeinen Hinweisen dazu und stehen vor ihnen: Was dieser
   * eine Rechner nicht kann, ist für den Leser wichtiger als der Satz, der auf
   * jedem Dokument steht.
   */
  grenzen?: string[]
  /** Woher verwendete Fremddaten stammen, mit Stand. */
  datenstand?: string[]
}

/** Ein Dateiname ohne Umlaute, Leerzeichen und Doppelpunkte. */
export function dateiname(titel: string, datum: Date, endung: string): string {
  const rein = titel
    .toLowerCase()
    .replaceAll('ä', 'ae')
    .replaceAll('ö', 'oe')
    .replaceAll('ü', 'ue')
    .replaceAll('ß', 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  const tag = `${datum.getFullYear()}-${String(datum.getMonth() + 1).padStart(2, '0')}-${String(datum.getDate()).padStart(2, '0')}`
  return `im-invests-${rein}-${tag}.${endung}`
}

/**
 * Die Zeilen für das PDF.
 *
 * Der Rückgabetyp ist absichtlich der von `lib/pdf.ts` – dort steht, wie eine
 * Zeile aussieht, und eine zweite Beschreibung davon wäre eine, die
 * auseinanderläuft. Hier steht nur die Reihenfolge.
 */
export function alsPdfZeilen(
  bericht: Ergebnisbericht,
  jetzt: Date
): {
  art: string
  text?: string
  betrag?: string
  ton?: string
}[] {
  if (bericht.annahmen.length === 0) {
    /*
      Kein stiller Notausgang. Ein Bericht ohne Annahmen ist ein Blatt mit
      einer Zahl darauf, und das ist genau das Dokument, das später
      missverstanden wird. Lieber laut scheitern als leise etwas Falsches
      ausgeben.
    */
    throw new Error(
      `Der Bericht „${bericht.titel}“ nennt keine Annahmen. Ohne sie ist das Ergebnis ` +
        'nicht nachvollziehbar und das Dokument irreführend.'
    )
  }

  const zeilen: { art: string; text?: string; betrag?: string; ton?: string }[] = []

  zeilen.push({ art: 'ueberschrift', text: 'Womit gerechnet wurde' })
  for (const a of bericht.annahmen) {
    zeilen.push({ art: 'zeile', text: a.bezeichnung, betrag: a.wert })
    if (a.hinweis) zeilen.push({ art: 'hinweis', text: a.hinweis })
  }

  zeilen.push({ art: 'abstand' })
  zeilen.push({ art: 'ueberschrift', text: 'Ergebnis' })
  bericht.ergebnisse.forEach((e, i) => {
    /*
      Das erste Ergebnis als Abschluss-Kasten, der Rest als Summenzeile. Wer
      ein Blatt überfliegt, sucht eine Zahl – und findet sie, wenn genau eine
      hervorgehoben ist. Sind alle hervorgehoben, ist es keine mehr.
    */
    zeilen.push({
      art: i === 0 ? 'abschluss' : 'summe',
      text: e.bezeichnung,
      betrag: e.wert,
    })
    if (e.hinweis) zeilen.push({ art: 'hinweis', text: e.hinweis })
  })

  for (const block of bericht.bloecke ?? []) {
    if (block.zeilen.length === 0) continue
    zeilen.push({ art: 'abstand' })
    zeilen.push({ art: 'ueberschrift', text: block.titel })
    for (const z of block.zeilen) {
      /*
        Eine Zeile ohne Wert ist Fließtext, kein Wertepaar.

        `zeile` setzt die Bezeichnung links und den Betrag rechts und bricht
        dabei nicht um – für „Halbleiter · 52,2 %“ genau richtig. Ein ganzer
        Satz lief damit rechts aus dem Blatt: Die Beobachtungen zur Verteilung
        waren im ersten PDF nach zwei Dritteln abgeschnitten. Als `hinweis`
        gesetzt fließt der Text über mehrere Zeilen.
      */
      if (z.wert === '') {
        zeilen.push({ art: 'hinweis', text: z.bezeichnung })
      } else {
        zeilen.push({ art: 'zeile', text: z.bezeichnung, betrag: z.wert })
      }
      if (z.hinweis) zeilen.push({ art: 'hinweis', text: z.hinweis })
    }
  }

  if (bericht.datenstand && bericht.datenstand.length > 0) {
    zeilen.push({ art: 'abstand' })
    zeilen.push({ art: 'ueberschrift', text: 'Verwendete Daten' })
    for (const q of bericht.datenstand) zeilen.push({ art: 'hinweis', text: q })
  }

  /*
    Die Hinweise auf eine eigene Seite. Nicht aus Höflichkeit, sondern damit
    sie vollständig bleiben: Am Seitenende abgeschnittene Rechtshinweise sind
    schlechter als gar keine, weil sie den Eindruck erwecken, es sei alles
    gesagt worden.
  */
  zeilen.push({ art: 'seitenumbruch' })
  zeilen.push({ art: 'ueberschrift', text: RECHTSHINWEIS_TITEL })
  zeilen.push({ art: 'hinweis', text: RECHTSHINWEIS_KERN })
  zeilen.push({ art: 'abstand' })

  if (bericht.grenzen && bericht.grenzen.length > 0) {
    zeilen.push({ art: 'unterueberschrift', text: 'Was dieser Rechner nicht sagt' })
    for (const g of bericht.grenzen) zeilen.push({ art: 'hinweis', text: `– ${g}` })
    zeilen.push({ art: 'abstand' })
  }

  zeilen.push({ art: 'unterueberschrift', text: 'Zu diesem Dokument' })
  for (const h of DOKUMENT_HINWEISE) zeilen.push({ art: 'hinweis', text: `– ${h}` })
  zeilen.push({ art: 'abstand' })
  zeilen.push({ art: 'hinweis', text: erstelltAm(jetzt) })

  return zeilen
}

/** Ein CSV-Feld: Anführungszeichen verdoppeln, alles einpacken. */
function feld(wert: string): string {
  return `"${wert.replaceAll('"', '""')}"`
}

/**
 * Derselbe Bericht als CSV.
 *
 * Trennzeichen ist das Semikolon, nicht das Komma: Eine deutsche
 * Tabellenkalkulation erwartet es so, weil das Komma hier das Dezimalzeichen
 * ist. Mit einem Komma getrennt landet „1.234,56“ in zwei Spalten.
 */
export function alsCsv(bericht: Ergebnisbericht, jetzt: Date): string {
  const zeilen: string[] = []
  const paar = (a: string, b = '') => zeilen.push(`${feld(a)};${feld(b)}`)

  paar(bericht.titel, erstelltAm(jetzt))
  paar('')
  paar('Womit gerechnet wurde')
  for (const a of bericht.annahmen) paar(a.bezeichnung, a.wert)

  paar('')
  paar('Ergebnis')
  for (const e of bericht.ergebnisse) paar(e.bezeichnung, e.wert)

  for (const block of bericht.bloecke ?? []) {
    if (block.zeilen.length === 0) continue
    paar('')
    paar(block.titel)
    for (const z of block.zeilen) paar(z.bezeichnung, z.wert)
  }

  if (bericht.datenstand && bericht.datenstand.length > 0) {
    paar('')
    paar('Verwendete Daten')
    for (const q of bericht.datenstand) paar(q)
  }

  /*
    Die Hinweise stehen auch im CSV. Eine Tabelle wird weitergereicht wie ein
    PDF, und dann ist sie das einzige, was der Nächste sieht.
  */
  paar('')
  paar(RECHTSHINWEIS_TITEL)
  paar(RECHTSHINWEIS_KERN)
  if (bericht.grenzen && bericht.grenzen.length > 0) {
    paar('')
    paar('Was dieser Rechner nicht sagt')
    for (const g of bericht.grenzen) paar(g)
  }
  paar('')
  paar('Zu diesem Dokument')
  for (const h of DOKUMENT_HINWEISE) paar(h)

  return zeilen.join('\r\n')
}
