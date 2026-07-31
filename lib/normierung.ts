/**
 * Zwei Kursreihen auf einen gemeinsamen Startpunkt bringen.
 *
 * ## Warum normiert werden muss
 *
 * Weil zwei Kurse in verschiedenen Größenordnungen und oft in verschiedenen
 * Währungen stehen. Eine Aktie bei 480 Dollar und eine bei 31 Euro in dasselbe
 * Diagramm zu zeichnen ergibt eine Linie am oberen Rand und eine, die auf der
 * Grundlinie klebt – und keine der beiden Bewegungen ist zu erkennen.
 *
 * Beide auf 100 zu setzen beantwortet dagegen genau die Frage, um die es geht:
 * Was wäre aus demselben Betrag geworden?
 *
 * ## Warum der gemeinsame Anfang zählt
 *
 * Zwei Reihen beginnen selten am selben Tag – ein Titel ist länger notiert als
 * der andere, Börsen haben verschiedene Feiertage. Wer beide einfach bei ihrem
 * eigenen ersten Punkt auf 100 setzt, vergleicht verschiedene Zeiträume und
 * nennt es einen Vergleich. Normiert wird deshalb auf den ersten Tag, den
 * **beide** haben.
 *
 * Ohne Laufzeitimporte, damit `tests/` das Modul direkt laden kann.
 */

export interface Kurspunkt {
  t: string
  value: number
}

export interface NormiertePunkte {
  /** Der gemeinsame Anfangstag, auf den beide auf 100 gesetzt sind. */
  ab: string
  links: Kurspunkt[]
  rechts: Kurspunkt[]
}

/** Der Tagesteil eines Zeitstempels. */
function tag(t: string): string {
  return t.slice(0, 10)
}

/**
 * Setzt zwei Reihen auf einen gemeinsamen Startpunkt von 100.
 *
 * `null`, wenn es keinen gemeinsamen Zeitraum gibt oder der Startwert einer
 * Reihe nicht positiv ist. Eine Division durch null ergäbe `Infinity`, und das
 * zeichnete sich als senkrechte Linie ins Bild – sichtbar falsch, aber erst,
 * nachdem es jemandem aufgefallen ist.
 */
export function normiere(
  links: readonly Kurspunkt[],
  rechts: readonly Kurspunkt[]
): NormiertePunkte | null {
  if (links.length === 0 || rechts.length === 0) return null

  /*
    Der gemeinsame Anfang ist der spätere der beiden ersten Tage. Wer den
    früheren nähme, hätte für eine der Reihen keinen Wert – und müsste ihn
    schätzen.
  */
  const anfang = tag(links[0].t) > tag(rechts[0].t) ? tag(links[0].t) : tag(rechts[0].t)

  const linksAb = links.filter((punkt) => tag(punkt.t) >= anfang)
  const rechtsAb = rechts.filter((punkt) => tag(punkt.t) >= anfang)
  if (linksAb.length === 0 || rechtsAb.length === 0) return null

  const basisLinks = linksAb[0].value
  const basisRechts = rechtsAb[0].value
  if (!(basisLinks > 0) || !(basisRechts > 0)) return null

  return {
    ab: anfang,
    links: linksAb.map((punkt) => ({
      t: punkt.t,
      value: (punkt.value / basisLinks) * 100,
    })),
    rechts: rechtsAb.map((punkt) => ({
      t: punkt.t,
      value: (punkt.value / basisRechts) * 100,
    })),
  }
}

/**
 * Liest eine Kursreihe aus einer CSV-Datei dieser Website.
 *
 * ## Warum überhaupt aus einer Datei
 *
 * Die Vergleichsseite lässt zwei beliebige der über tausend Aktien wählen. Die
 * Kursreihen aller Titel ins Seitenpaket zu legen wäre die naheliegende
 * Lösung – und sie brächte selbst bei einem Punkt je Monat mehrere hundert
 * Kilobyte auf eine Seite, von denen jeder Besucher zwei Reihen braucht.
 *
 * Seit es `/maerkte/<symbol>/kurse.csv` gibt, ist das unnötig: Der Browser
 * holt genau die beiden Reihen nach, die gerade gebraucht werden. Dieselben
 * Dateien, die auch zum Herunterladen dastehen – eine Datei, zwei Zwecke.
 *
 * Zeilen mit `#` sind der Kopfkommentar, die erste Datenzeile die
 * Spaltenüberschrift. Beides fällt heraus.
 */
export function leseKursCsv(text: string): Kurspunkt[] {
  const punkte: Kurspunkt[] = []

  for (const zeile of text.split('\n')) {
    const roh = zeile.trim()
    if (!roh || roh.startsWith('#')) continue

    const [datum, wert] = roh.split(';')
    if (!datum || !wert) continue
    // Die Überschriftenzeile hat kein Datum im Datumsformat.
    if (!/^\d{4}-\d{2}-\d{2}$/.test(datum)) continue

    const zahl = Number(wert)
    if (!Number.isFinite(zahl)) continue
    punkte.push({ t: datum, value: zahl })
  }

  return punkte
}

/** Der kleinste und größte Wert über beide Reihen – für die Achse. */
export function spanne(werte: NormiertePunkte): { min: number; max: number } {
  const alle = [...werte.links, ...werte.rechts].map((punkt) => punkt.value)
  return { min: Math.min(...alle), max: Math.max(...alle) }
}
