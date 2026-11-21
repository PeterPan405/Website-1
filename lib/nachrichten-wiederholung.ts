/**
 * Zwei Dinge, die eine Ausgabe nicht tun darf: den Vortag wiederholen und
 * Quellen gegeneinander ausspielen.
 *
 * Geprüft vom Entwurfsriegel in `scripts/nachrichten-erzeugen.ts`, den der
 * Agent vor der Abgabe selbst fährt. Getestet in
 * `tests/nachrichten-wiederholung.test.ts`.
 *
 * ## Der Anlass
 *
 * Am 14. Oktober 2026 meldete der Betreiber zwei Dinge auf einmal, mit drei
 * Bildschirmfotos des Karussells: „wir brauchen keine news doppelt" und, zu
 * „Ölpreis: Übersicht nennt 107 Dollar, Kursleiste zeigt 106,37": „sowas
 * klingt unsicher, ist verwirrend und unseriös."
 *
 * Nachgezählt über alle 521 Artikel und 86 Tage:
 *
 * - **Öl, Gold oder Silber** kamen an 79 von 86 Tagen vor; an 75 von 85
 *   aufeinanderfolgenden Tagespaaren an beiden. Das Karussell zeigt zwei
 *   Tage – also stand fast immer zweimal dasselbe darin, mit anderen Zahlen.
 * - **Quellenstreit als Aufhänger** – „zwei Quellen, zwei Schlusskurse",
 *   „Brent bei 88,14 oder 90,12 Dollar? Beide Zahlen stimmen" – seit dem
 *   1. August immer wieder. „Kursleiste" stand in 96 von 521 Artikeln, ein
 *   Wort aus dem Seitenaufbau der Quelle, das kein Leser kennt.
 *
 * Das zweite war **bestellt**: Die Anweisung an den Agenten nannte als
 * Beispiel für Spannung „Zwei Portale nennen denselben Preis mit
 * verschiedenen Prozentzahlen". Zwei Zahlen für denselben Preis sind keine
 * Nachricht, sondern zwei Abrufzeitpunkte.
 */

/**
 * Ab dieser Ähnlichkeit zur Überschrift des Vortags gilt ein Titel als
 * Wiederholung.
 *
 * **Gewählt am echten Material**, 521 Titel gegen ihren Vortag, gemessen am
 * 14. Oktober 2026. Ab 1/3 sind es acht Treffer, und alle acht sind
 * Wiederholungen:
 *
 *     0.40  Gold pendelt nahe 4.200 Dollar, Silber gibt weiter nach   (14.10.)
 *     0.40  Öl steigt auf 106 Dollar, Gold und Silber geben nach       (13.10.)
 *     0.33  Silber nähert sich 61 Dollar, Gold hält die Linie          (12.10.)
 *     0.33  Gold nähert sich 4.200 Dollar, Spekulanten bauen ab        (11.10.)
 *     0.33  Gold nähert sich 4.200 Dollar – trotz steigender Renditen  (10.10.)
 *     0.33  Fünf PMI-Werte und zwei EZB-Reden zum Wochenstart          (05.10.)
 *     0.33  Der Dax schließt … – und zwei Quellen nennen zwei Zahlen   (04.08.)
 *     0.50  Brent bei 88,14 oder 90,12 Dollar? Beide Zahlen stimmen    (01.08.)
 *
 * **Darunter beginnen die Fälle, die erlaubt sein müssen:**
 *
 *     0.30  HPE übertrifft alle Erwartungen – die Aktie fällt trotzdem
 *           (am Vortag NetApp: zwei Unternehmen, dasselbe Muster)
 *     0.29  Öl fällt trotz neuer Zwischenfälle in der Straße von Hormus
 *           (ein neuer Vorfall)
 *     0.27  Diesel-Deal mit Russland: Diese Mengen hat Trump zugesagt
 *           (trägt die Mengen nach – eine Entwicklung)
 *
 * Eine Wiederholung bleibt unter der Grenze: „Mercedes-Benz eröffnet die
 * dichteste Berichtswoche des Jahres" nach „Die dichteste Berichtswoche des
 * Quartals beginnt" (0,25). Sie herunterzuholen kostete die drei oben.
 *
 * Der Abstand zwischen dem letzten Treffer und dem ersten erlaubten Fall ist
 * schmal. Wer die Grenze oder die Füllwörter ändert, misst neu und schreibt
 * beide Listen hin – `tests/nachrichten-wiederholung.test.ts` prüft beide
 * gegen den Bestand.
 *
 * **Die Prüfung ist ein Stellvertreter.** Sie vergleicht Wörter, nicht
 * Inhalte; wer „Edelmetalle uneinheitlich" schreibt statt „Gold und Silber
 * geben nach", kommt durch. Die eigentliche Regel steht in der Anweisung an
 * den Agenten: Ein Preis allein ist kein Ereignis.
 */
export const WIEDERHOLUNG_AB = 1 / 3

/*
  Wörter, die in fast jeder Börsenüberschrift stehen und nichts über das
  Thema sagen. Ohne sie wären „Dax steigt" und „Gold steigt" verwandt.

  „Straße" steht hier, weil „Straße von Hormus" ein Ort ist und nicht zwei
  Wörter: Am 31. August 2026 – „Öl fällt trotz neuer Zwischenfälle in der
  Straße von Hormus" nach „Iran beansprucht die Straße von Hormus" – zählte
  der Ort doppelt und machte aus einem neuen Vorfall eine Wiederholung.
  „Neu" steht hier aus demselben Grund: Es kündigt eine Entwicklung an und
  ist kein Thema.
*/
const FUELLWOERTER = new Set(
  (
    'der die das den dem des und oder mit von vom zum zur im in am an auf aus bei ' +
    'für über nach vor trotz als wie ein eine einen einem eines ist sind wird werden ' +
    'bleibt bleiben hält legt gibt geben steigt steigen fällt fallen sinkt nachgibt ' +
    'weiter leicht deutlich heute morgen dollar euro prozent punkte punkten seit bis ' +
    'sich auch noch nur dann neu neue neuer neuen neues straße unter'
  ).split(' ')
)

/**
 * Die Wörter einer Überschrift, die das Thema tragen.
 *
 * „Ölpreis" und „Öl" sind dasselbe Thema – das Anhängsel „preis" wird
 * abgeschnitten, sonst fände die Prüfung „Ölpreis steigt" neben „Öl steigt"
 * nicht verwandt.
 */
export function themenwoerter(titel: string): Set<string> {
  const woerter = titel.toLowerCase().match(/[a-zäöüß]+/g) ?? []
  const ergebnis = new Set<string>()
  for (const w of woerter) {
    if (FUELLWOERTER.has(w) || w.length < 2) continue
    const stamm = w.length > 6 && w.endsWith('preis') ? w.slice(0, -5) : w
    if (stamm.length > 2 || stamm === 'öl') ergebnis.add(stamm)
  }
  return ergebnis
}

/** Anteil gemeinsamer Themenwörter an allen (Jaccard). */
export function aehnlichkeit(a: string, b: string): number {
  const x = themenwoerter(a)
  const y = themenwoerter(b)
  if (x.size === 0 || y.size === 0) return 0
  let gemeinsam = 0
  for (const w of x) if (y.has(w)) gemeinsam++
  return gemeinsam / (x.size + y.size - gemeinsam)
}

export interface Wiederholung {
  titel: string
  gestern: string
  wert: number
}

/** Welche neuen Überschriften die des Vortags wiederholen. */
export function wiederholungen(neu: string[], gestern: string[]): Wiederholung[] {
  const funde: Wiederholung[] = []
  for (const titel of neu) {
    let bester: Wiederholung | null = null
    for (const alt of gestern) {
      const wert = aehnlichkeit(titel, alt)
      if (!bester || wert > bester.wert) bester = { titel, gestern: alt, wert }
    }
    if (bester && bester.wert >= WIEDERHOLUNG_AB - 1e-9) funde.push(bester)
  }
  return funde
}

/**
 * Wendungen, die eine Abweichung zwischen Quellen zum Thema machen.
 *
 * „Kursleiste" ist ein Bauteil der Quellseite, kein Begriff für den Leser –
 * er steht im Text, weil das Modell beschrieb, wo es eine Zahl gefunden hat.
 * In der Quellenangabe darf er bleiben; dort ist er eine Ortsangabe.
 */
const QUELLENSTREIT =
  /kursleiste|zwei quellen|je nach quelle|beide zahlen|übersicht nennt/i

/** Gibt die gefundene Wendung zurück – oder nichts. */
export function quellenstreit(text: string): string | null {
  const treffer = text.match(QUELLENSTREIT)
  return treffer ? treffer[0] : null
}

/**
 * Wie viele Erscheinungstage zurück verglichen wird.
 *
 * Bis zum 14. Oktober 2026 war es einer, der Vortag – weil das Karussell zwei
 * Tage zeigt. Am selben Tag kam das Briefing des Betreibers: „Vergleiche die
 * aktuelle Auswahl mit den Nachrichten der vergangenen sieben Tage."
 *
 * Gemessen am Bestand bis zum 14. Oktober, Grenze unverändert ein Drittel:
 * 22 Treffer statt 8. **21 sind Wiederholungen** – „Euro fällt auf
 * 17-Monats-Tief" am 6. und 8. Oktober fast wortgleich (0,67), „Dax klettert
 * zurück über 25.000" am 3. und 10. (0,50), die Öl- und Goldreihe, die Fed
 * zweimal, Siemens Energy zweimal in sechs Tagen. **Einer ist ein Fehlgriff:**
 * „Dax rutscht unter 25.000 Punkte, 200-Tage-Linie hält" gegen Gold unter der
 * 50-Tage-Linie (0,33) – derselbe Chartbegriff, zwei Anlagen. Ihn
 * wegzurechnen („Tage" und „Linie" als Füllwort) kostete eine echte
 * Wiederholung; der Preis des Fehlgriffs ist eine umformulierte Überschrift.
 *
 * Die drei erlaubten Fälle am Wert `WIEDERHOLUNG_AB` liegen auch im Fenster
 * von sieben Tagen unter der Grenze.
 */
export const WIEDERHOLUNG_TAGE = 7

/**
 * Ab wie vielen der letzten sieben Erscheinungstage ein Name ein
 * Dauerthema ist.
 *
 * Betreiber, 10.11.2026: „bei den Nachrichten lasse ich die Sachen nicht
 * immer doppeln … es kam jetzt schon öfters dran mit EZB-Spitze, wer da wen
 * vorschlägt … Oder Öl. Hin und her. Das kann man schon drin lassen, aber
 * vielleicht dann immer auf die letzte Seite packen. Und wenn es dann
 * nichts wirklich Neues gibt, dann muss man das ja auch nicht täglich mit
 * reinnehmen.“
 *
 * `wiederholungen()` sah das nicht: „EZB-Nachfolge: Finanzminister drängen
 * auf schnelle Entscheidung“ gegen „EZB-Nachfolge: Spanien nominiert
 * Hernández de Cos“ liegt bei 0,18, unter der Grenze von einem Drittel –
 * und gleich hoch wie viele verschiedene Themen. Ein Dauerthema erkennt man
 * nicht an der Überschrift, sondern am Namen, der immer wiederkommt.
 *
 * **Gemessen am Bestand 01.10.–10.11.2026** (Namen wie in
 * `themenwoerter()` aus `lib/instagram-plan.ts`, nach den dort ergänzten
 * Nicht-Themen): Mit „an mindestens zwei der sieben Tage davor“ trifft es
 * EZB (30.10., 04.11., 05.11., 07.11., 10.11.), Fed (29.10., 31.10.,
 * 03.11.), Frankreich (22.10., 25.10.), Binance (02.11.), Iran, China – und
 * Anfang Oktober Öl, Gold und Silber fast täglich. Mit einem Tag wären es
 * zwei bis vier Meldungen am Tag gewesen, darunter Microsoft vor und nach
 * seinen Zahlen; das sind zwei Ereignisse.
 */
export const DAUERTHEMA_AB_TAGEN = 2

export interface Dauerthema {
  /** Stelle in der Ausgabe, ab 0. */
  stelle: number
  titel: string
  /** Die Namen, die schon an `DAUERTHEMA_AB_TAGEN` Tagen dastanden. */
  namen: string[]
}

/**
 * Welche neuen Überschriften ein Dauerthema tragen: einen Namen, der in den
 * letzten sieben Erscheinungstagen schon an mindestens
 * `DAUERTHEMA_AB_TAGEN` Tagen in einer Überschrift stand.
 */
export function dauerthemen(
  neu: string[],
  frueher: { tag: string; titel: string }[],
  woerter: (titel: string) => Set<string>
): Dauerthema[] {
  const tageJeName = new Map<string, Set<string>>()
  for (const f of frueher)
    for (const w of woerter(f.titel)) {
      if (!tageJeName.has(w)) tageJeName.set(w, new Set())
      tageJeName.get(w)!.add(f.tag)
    }
  const funde: Dauerthema[] = []
  for (const [stelle, titel] of neu.entries()) {
    const namen = [...woerter(titel)].filter(
      (w) => (tageJeName.get(w)?.size ?? 0) >= DAUERTHEMA_AB_TAGEN
    )
    if (namen.length) funde.push({ stelle, titel, namen })
  }
  return funde
}

/**
 * Die Überschriften der letzten `tage` Erscheinungstage vor `stichtag`,
 * jüngster zuerst, mit ihrem Tag – für den Riegel und für die Anweisung.
 */
export function ueberschriftenLetzteTage(
  newsQuelltext: string,
  stichtag: string,
  tage: number = WIEDERHOLUNG_TAGE
): { tag: string; titel: string }[] {
  const alle: { tag: string; titel: string }[] = []
  for (const block of newsQuelltext.split(/\n {2}\{\n/).slice(1)) {
    const titel = block.match(/^ {4}title:\s*(?:\n\s*)?'((?:[^'\\]|\\.)*)'/m)?.[1]
    const tag = block.match(/^ {4}publishedAt:\s*'(\d{4}-\d{2}-\d{2})/m)?.[1]
    if (!titel || !tag || tag >= stichtag) continue
    alle.push({ tag, titel: titel.replace(/\\'/g, "'") })
  }
  const fenster = new Set(
    [...new Set(alle.map((a) => a.tag))].sort().reverse().slice(0, tage)
  )
  return alle.filter((a) => fenster.has(a.tag)).sort((x, y) => (x.tag < y.tag ? 1 : -1))
}

/**
 * Die Überschriften des letzten Erscheinungstags vor `stichtag`, gelesen aus
 * dem Quelltext von `data/news.ts`.
 *
 * Gelesen wird der Text und nicht das Modul: Der Riegel läuft vor dem
 * Schreiben, und ein Import zöge den ganzen Datenbestand samt seiner Importe
 * nach. Zwei Schreibweisen kommen vor – `title: '…'` in einer Zeile und, bei
 * langen Titeln, `title:` mit dem Text in der nächsten.
 */
export function ueberschriftenVortag(newsQuelltext: string, stichtag: string): string[] {
  const proTag = new Map<string, string[]>()
  for (const block of newsQuelltext.split(/\n {2}\{\n/).slice(1)) {
    const titel = block.match(/^ {4}title:\s*(?:\n\s*)?'((?:[^'\\]|\\.)*)'/m)?.[1]
    const tag = block.match(/^ {4}publishedAt:\s*'(\d{4}-\d{2}-\d{2})/m)?.[1]
    if (!titel || !tag || tag >= stichtag) continue
    if (!proTag.has(tag)) proTag.set(tag, [])
    proTag.get(tag)!.push(titel.replace(/\\'/g, "'"))
  }
  const tage = [...proTag.keys()].sort()
  return tage.length ? proTag.get(tage[tage.length - 1])! : []
}

/**
 * Wie viele Erscheinungstage zurück ein Name als „schon dagewesen" gilt.
 *
 * Betreiber, 21.11.2026, nach „IG Metall startet Warnstreiks gegen
 * VW-Sparplan" (20.11.) und „IG Metall weitet Warnstreiks aus" als
 * Top-Meldung am 21.11.: „die news doppeln sich schon wieder mit denen der
 * letzten tage … wenn sich was doppelt … dann nach hinten, wenn es
 * überhaupt relevant ist, sonst einfach etwas anderes interessantes finden."
 *
 * Weder `wiederholungen()` (0,25, unter einem Drittel) noch `dauerthemen()`
 * (nur ein Vortag) sah es – und die Artikelüberschrift „150.000 Beschäftigte
 * legen für 24 Stunden die Arbeit nieder" trägt gar keinen Namen. Den trug
 * nur die Schlagzeile im Karussell. Deshalb vergleicht diese Prüfung
 * Artikelüberschrift **und** Schlagzeile jeder Stelle.
 *
 * Drei Tage wie bei Instagram (`themaWiederholt()`). **Gemessen 23.10.–
 * 21.11.2026** über Überschriften und Schlagzeilen, nach den in
 * `lib/instagram-plan.ts` ergänzten Nicht-Themen: an etwa jedem vierten Tag
 * standen zwei oder mehr Wiederholungen in der Ausgabe – Nvidia 16.–18.11.,
 * Fed 17./19.11., Commerzbank 17./19.11., Anthropic 14./19./20.11.,
 * IG Metall 20./21.11. Das sind die Tage, an denen der Agent ein Thema
 * ersetzen muss.
 */
export const NACHGANG_TAGE = 3

export interface Nachgang {
  /** Stelle in der Ausgabe, ab 0. */
  stelle: number
  titel: string
  frueher: string
  tag: string
  namen: string[]
}

/**
 * Welche Stellen einen Namen tragen, der in den letzten `tage`
 * Erscheinungstagen schon in einer Überschrift oder Schlagzeile stand.
 * `neu[i]` sind alle Überschriften der Stelle i (Artikel und Schlagzeile).
 */
export function themenDerLetztenTage(
  neu: string[][],
  frueher: { tag: string; titel: string }[],
  woerter: (titel: string) => Set<string>,
  tage: number = NACHGANG_TAGE
): Nachgang[] {
  const fenster = new Set(
    [...new Set(frueher.map((f) => f.tag))].sort().reverse().slice(0, tage)
  )
  const alt = frueher
    .filter((f) => fenster.has(f.tag))
    .sort((x, y) => (x.tag < y.tag ? 1 : x.tag > y.tag ? -1 : 0))
    .map((f) => ({ ...f, w: woerter(f.titel) }))
  const funde: Nachgang[] = []
  for (const [stelle, titel] of neu.entries()) {
    const jetzt = new Set(titel.flatMap((t) => [...woerter(t)]))
    for (const a of alt) {
      const namen = [...a.w].filter((w) => jetzt.has(w))
      if (namen.length) {
        funde.push({ stelle, titel: titel[0], frueher: a.titel, tag: a.tag, namen })
        break
      }
    }
  }
  return funde
}

/**
 * Die Schlagzeilen (`headline`) der Tagesausgaben vor `stichtag` – das,
 * was im Karussell stand. Gleiche Form wie `ueberschriftenLetzteTage()`.
 */
export function schlagzeilenLetzteTage(
  ausgaben: { tag: string; quelltext: string }[],
  stichtag: string,
  tage: number = WIEDERHOLUNG_TAGE
): { tag: string; titel: string }[] {
  const vorher = ausgaben.filter((a) => a.tag < stichtag)
  const fenster = new Set(
    [...new Set(vorher.map((a) => a.tag))].sort().reverse().slice(0, tage)
  )
  const alle: { tag: string; titel: string }[] = []
  for (const a of vorher) {
    if (!fenster.has(a.tag)) continue
    for (const m of a.quelltext.matchAll(/headline:\s*(?:\n\s*)?'((?:[^'\\]|\\.)*)'/g))
      alle.push({ tag: a.tag, titel: m[1].replace(/\\'/g, "'") })
  }
  return alle.sort((x, y) => (x.tag < y.tag ? 1 : x.tag > y.tag ? -1 : 0))
}
