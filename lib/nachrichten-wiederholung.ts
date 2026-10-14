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
    'sich auch noch nur dann neu neue neuer neuen neues straße'
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
