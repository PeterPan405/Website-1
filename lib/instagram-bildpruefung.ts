/**
 * Die Prüfung der Kacheln vor dem Hochladen – ohne den Betreiber.
 *
 * Betreiber, 26.10.2026, nachdem die Ifo-Kachel das Foto des Audi-Werks
 * zeigte: „Bitte in Zukunft morgens eine doppelte Prüfung oder so einführen –
 * nicht von mir, sondern von dir –, dass solche Fehler nicht mehr vorkommen."
 * Davor: dreimal dasselbe Börsenfoto in einem Beitrag, die olympischen Ringe
 * am Eiffelturm an zwei Tagen, eine Tafel der Gebärdensprache für Alphabet,
 * ein Wasserbüffel für die britische Inflation.
 *
 * Geprüft wird, **was hinausginge** – die Kacheln, wie sie auf der Website
 * liegen und Meta sie abholt. Nicht das Register, nicht der Plan: Am 26.10.
 * war das Register in sich stimmig, nur zeigten zwei Einträge auf dieselbe
 * Datei. Ein Riegel ist so gut wie die Quelle, die er fragt.
 *
 * Zwei Prüfungen, die verschiedene Fehler finden:
 *
 *   1. **Gerechnet** (hier): Fingerabdruck der Bildzone jeder Kachel. Zwei
 *      Kacheln mit demselben Bild, eine Kachel ohne Bild, ein Bild aus den
 *      Beiträgen der letzten Tage. Braucht kein Netz und keinen Schlüssel.
 *   2. **Angesehen** (`instagram-beitrag.yml`, Schritt „Sichtprüfung"): Ein
 *      Modell sieht jede Kachel an und sagt, ob das Bild zur Meldung passt –
 *      die Frage, die keine Rechnung beantwortet (Büffel, Gebärdensprache).
 *      Sein Befund kommt als `sichtpruefung.json`, gelesen von `sichtBefund()`.
 */
import sharp from 'sharp'

import { BILDZONE, IG_BREITE, IG_HOEHE } from '@/lib/instagram-bild'

/**
 * Bis zu so vielen abweichenden Bits gelten zwei Bildzonen als dasselbe Bild.
 *
 * Gewählt am echten Material, den Kacheln vom 26.10.2026 in sechs Fassungen:
 * Dasselbe Bild ergab 0 (dreimal die Börse, Fassung vom Morgen), die 36
 * Paare verschiedener Bilder 22 bis 43. Acht lässt nach beiden Seiten Luft –
 * für ein neu komprimiertes JPEG nach unten, für ähnliche Fotos nach oben.
 */
export const GLEICH_HOECHSTENS = 8

/**
 * Darunter ist die Bildzone eine Fläche, kein Bild (Standardabweichung der
 * Helligkeit). Gemessen am 26.10.2026: Kachel ohne Foto, nur das blasse
 * Wasserzeichen 4,6; der Kursverlauf als ruhigstes Bild 20,5, Fotos und
 * Logo 40 bis 72.
 */
export const LEER_UNTER = 10

/** Wie viele Tage zurück ein Bild als „schon gezeigt" gilt. */
export const TAGE_ZURUECK = 14

export interface Abdruck {
  stelle: number
  /** 64 Bit als 16 Hexziffern – Differenz-Hash der Bildzone. */
  abdruck: string
  /** Ist die Bildzone leer (eine Fläche ohne Bild)? */
  leer: boolean
}

/** Fingerabdruck der Bildzone einer Kachel – gleich groß wie gebaut oder nicht. */
export async function fingerabdruck(stelle: number, jpeg: Buffer): Promise<Abdruck> {
  /*
    Erst auf volle Größe und in ein festes Bild, dann ausschneiden: `stats()`
    von sharp misst das Eingangsbild, nicht den Ausschnitt – die erste Fassung
    fand im leeren Feld einer Kachel ohne Foto Schwarz und Weiß der
    Überschrift. Deshalb wird hier aus den rohen Bildpunkten selbst gerechnet.
  */
  const voll = await sharp(jpeg)
    .flatten({ background: '#ffffff' })
    .resize(IG_BREITE, IG_HOEHE, { fit: 'fill' })
    .toBuffer()
  const zone = await sharp(voll)
    .extract({
      left: BILDZONE.links,
      top: BILDZONE.oben,
      width: BILDZONE.breite,
      height: BILDZONE.unten - BILDZONE.oben,
    })
    .grayscale()
    .png()
    .toBuffer()
  const klein = await sharp(zone)
    .resize(100, 60, { fit: 'fill' })
    .toColourspace('b-w')
    .raw()
    .toBuffer()
  const mittel = klein.reduce((s, v) => s + v, 0) / klein.length
  const stdev = Math.sqrt(klein.reduce((s, v) => s + (v - mittel) ** 2, 0) / klein.length)
  const px = await sharp(zone)
    .resize(9, 8, { fit: 'fill' })
    .toColourspace('b-w')
    .raw()
    .toBuffer()
  let bits = ''
  for (let y = 0; y < 8; y++)
    for (let x = 0; x < 8; x++) bits += px[y * 9 + x] > px[y * 9 + x + 1] ? '1' : '0'
  const abdruck = BigInt(`0b${bits}`).toString(16).padStart(16, '0')
  return { stelle, abdruck, leer: stdev < LEER_UNTER }
}

/** Abweichende Bits zwischen zwei Abdrücken. */
export function abstand(a: string, b: string): number {
  let n = 0
  for (let i = 0; i < 16; i++) {
    let x = parseInt(a[i] ?? '0', 16) ^ parseInt(b[i] ?? '0', 16)
    for (; x; x >>= 1) n += x & 1
  }
  return n
}

/** Eine Zeile im Gedächtnis auf `instagram-gepostet` (`bilder.txt`). */
export interface Frueher {
  datum: string
  stelle: number
  abdruck: string
}

export function liesFrueher(text: string): Frueher[] {
  return text
    .split('\n')
    .map((z) => z.trim().split(/\s+/))
    .filter((t) => t.length === 3 && /^\d{4}-\d{2}-\d{2}$/.test(t[0]))
    .map(([datum, stelle, abdruck]) => ({ datum, stelle: Number(stelle), abdruck }))
}

/**
 * Was an den Kacheln des Tages nicht stimmt – leer heißt: in Ordnung.
 * Das Deckblatt (Stelle 1) gehört nicht hinein: Es wechselt mit Absicht
 * durch eine feste Reihe (`NEUTRALE_DECKBLAETTER`).
 */
export function gerechneterBefund(
  datum: string,
  heute: Abdruck[],
  frueher: Frueher[]
): string[] {
  const fehler: string[] = []
  const kacheln = heute.filter((k) => k.stelle >= 2)
  for (const k of kacheln) if (k.leer) fehler.push(`Kachel ${k.stelle} hat kein Bild`)
  for (let i = 0; i < kacheln.length; i++)
    for (let j = i + 1; j < kacheln.length; j++) {
      const a = kacheln[i]
      const b = kacheln[j]
      if (a.leer || b.leer) continue
      if (abstand(a.abdruck, b.abdruck) <= GLEICH_HOECHSTENS)
        fehler.push(`Kachel ${a.stelle} und ${b.stelle} zeigen dasselbe Bild`)
    }
  const grenze = new Date(`${datum}T00:00:00Z`)
  grenze.setUTCDate(grenze.getUTCDate() - TAGE_ZURUECK)
  const ab = grenze.toISOString().slice(0, 10)
  for (const k of kacheln) {
    if (k.leer) continue
    const alt = frueher.find(
      (f) =>
        f.datum < datum &&
        f.datum >= ab &&
        abstand(f.abdruck, k.abdruck) <= GLEICH_HOECHSTENS
    )
    if (alt)
      fehler.push(
        `Kachel ${k.stelle} zeigt das Bild vom ${alt.datum} (Kachel ${alt.stelle}) noch einmal`
      )
  }
  return fehler
}

/**
 * Der Befund der Sichtprüfung. `ausgefallen` heißt: kein lesbares Urteil –
 * dann warnt der Lauf und verlässt sich auf die gerechnete Prüfung, statt den
 * Beitrag des Tages an einem leeren Kontingent scheitern zu lassen.
 */
export function sichtBefund(
  roh: string | null,
  stellen: number[]
): {
  fehler: string[]
  ausgefallen: boolean
  urteile: { stelle: number; passt: boolean; grund: string }[]
} {
  const leer = { fehler: [], ausgefallen: true, urteile: [] }
  if (!roh) return leer
  let daten: unknown
  try {
    daten = JSON.parse(roh)
  } catch {
    return leer
  }
  const liste = (daten as { kacheln?: unknown })?.kacheln
  if (!Array.isArray(liste)) return leer
  const urteile = new Map<number, { passt: boolean; grund: string }>()
  for (const e of liste as { stelle?: unknown; passt?: unknown; grund?: unknown }[])
    if (typeof e?.stelle === 'number' && typeof e.passt === 'boolean')
      urteile.set(e.stelle, { passt: e.passt, grund: String(e.grund ?? '') })
  /* Ein Urteil, das eine Kachel auslässt, hat sie nicht angesehen. */
  const alle = [...urteile].map(([stelle, u]) => ({ stelle, ...u }))
  if (stellen.some((s) => !urteile.has(s))) return { ...leer, urteile: alle }
  const fehler = stellen
    .filter((s) => !urteile.get(s)!.passt)
    .map((s) => `Kachel ${s}: ${urteile.get(s)!.grund || 'Bild passt nicht zur Meldung'}`)
  return { fehler, ausgefallen: false, urteile: alle }
}

/**
 * Die Stellen, deren Bild neu gesucht werden muss – aus den Befunden gelesen.
 *
 * Bis zum 28.10.2026 hielt eine abgelehnte Kachel den Tagesbeitrag an, und
 * nichts tauschte sie aus: Jeder weitere Lauf scheiterte am selben Bild, zwei
 * Tage ging keine News hinaus. Jetzt sucht `instagram-beitrag.yml` für genau
 * diese Stellen neu. Bei „Kachel 3 und 5 zeigen dasselbe Bild" wird die
 * spätere getauscht; bei „zeigt das Bild vom … (Kachel 4)" die erste Zahl,
 * nicht die alte Stelle.
 */
export function abgelehnteStellen(fehler: string[]): number[] {
  const stellen = new Set<number>()
  for (const f of fehler) {
    const treffer = /^Kachel (\d+)(?: und (\d+))?/.exec(f)
    if (treffer) stellen.add(Number(treffer[2] ?? treffer[1]))
  }
  return [...stellen].filter((s) => s >= 2).sort((a, b) => a - b)
}
