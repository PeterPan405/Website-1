/**
 * Die Umschrifttabelle gegen ihre eigenen Regeln.
 *
 * ## Warum es diese Prüfung gibt
 *
 * Über `ENGLISCHE_NAMEN` steht seit dem 11. August 2026 ein Kommentar mit den
 * Fallen, die die deutsche Rechtschreibung stellt. Am 20. August hat der
 * Betreiber die Aussprache erneut beanstandet, und beim Nachzählen verletzten
 * **neun Einträge derselben Tabelle** genau diese Regeln: „Häthaweh",
 * „Schwobb", „Bittweiß", „Ohwerwejt", „Anderwejt", „Softwer", „Hardwer" – und
 * „Riserv", das im Deutschen auf /f/ endet.
 *
 * Eine Regel, die in einem Kommentar steht und von der Tabelle darunter
 * verletzt wird, ist keine Regel. Sie wird hier deshalb gezählt statt
 * beschrieben.
 *
 * ## Was sich mechanisch entscheiden lässt – und was nicht
 *
 * Ob ein englisches Wort an einer Stelle /v/ oder /w/ hat, ist keine
 * Geschmacksfrage: Es steht in der Schreibweise des englischen Wortes selbst.
 *
 * - Ein **„w" vor einem Vokal** ist im Englischen der Laut /w/. Im Deutschen
 *   wird „w" zu /v/; die Umschrift braucht dort ein **„u"**.
 * - Ein **„v"** ist im Englischen /v/. Im Deutschen schreibt man den Laut
 *   **„w"** – ein „v" wäre /f/.
 *
 * Nicht geprüft wird das „w" in `ow` und `aw` (Dow, Downgrade, Shutdown): Da
 * gehört es zum Doppellaut und wird richtig als „au" umgeschrieben.
 *
 * Und nicht geprüft wird Falle 1, das „st" am Wortanfang. Sie lässt sich
 * nicht überall umgehen, und ein Test, der eine unvermeidbare Stelle
 * beanstandet, wird abgeschaltet statt befolgt.
 */

import { ENGLISCHE_NAMEN, englischeNamenSprechbar } from '@/lib/sprechfassung'

let failed = 0

function pruefen(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

/*
  Geprüft wird über die öffentliche Funktion, nicht über die Tabelle.

  Die Tabelle ist nicht exportiert, und das soll so bleiben – sie ist ein
  Innenteil. Was zählt, ist ohnehin das Ergebnis: Was kommt heraus, wenn man
  das englische Wort hineingibt?

  Die Liste unten ist damit zugleich die Prüfung der Regel **und** eine
  Sammlung der Wörter, an denen sie schon einmal verletzt wurde.
*/
const WOERTER = [
  // /w/ vor Vokal – die Umschrift braucht ein „u".
  'Berkshire Hathaway',
  'Charles Schwab',
  'Bitwise',
  'Overweight',
  'Underweight',
  'Software',
  'Hardware',
  'Wall Street',
  'Warren Buffett',
  // /v/ – die Umschrift braucht ein „w".
  'Nvidia',
  'Value',
  'Vanguard',
  'Venture Capital',
  'Leverage',
  'Private Equity',
  'Federal Reserve',
  'IM Invests',
]

const VOKALE = 'aeiouyäöü'

for (const wort of WOERTER) {
  const umschrift = englischeNamenSprechbar(wort)

  pruefen(
    `„${wort}" wird überhaupt umgeschrieben`,
    umschrift !== wort,
    'Fehlt der Eintrag, prüft alles Folgende die leere Menge.'
  )

  /* Regel 2: englisches „w" vor Vokal → „u" in der Umschrift. */
  const wVorVokal = [...wort.toLowerCase().matchAll(/w(.)/g)].filter(([, next]) =>
    VOKALE.includes(next)
  ).length
  if (wVorVokal > 0) {
    const us = (umschrift.toLowerCase().match(/u/g) ?? []).length
    pruefen(
      `„${wort}": ${wVorVokal}× englisches /w/ steht als „u"`,
      us >= wVorVokal,
      `„${umschrift}" – mit „w" gesprochen ergäbe das ein /v/.`
    )
  }

  /* Regel 3: englisches „v" → „w" in der Umschrift, nie „v". */
  const vs = (wort.toLowerCase().match(/v/g) ?? []).length
  if (vs > 0) {
    pruefen(
      `„${wort}": das /v/ steht als „w" und nicht als „v"`,
      !umschrift.toLowerCase().includes('v'),
      `„${umschrift}" – „v" ist im Deutschen /f/.`
    )
  }
}

/*
  Die Gegenprobe.

  Ohne sie wäre oben nur bewiesen, dass die Prüfung nichts findet – nicht,
  dass sie etwas finden **kann**. Die beiden Zeilen sind die Fassungen, wie
  sie bis zum 20. August 2026 wirklich in der Tabelle standen; sie müssen
  durchfallen.
*/
const ALT: [string, string][] = [
  ['Berkshire Hathaway', 'Berkschir Häthaweh'],
  ['Software', 'Softwer'],
  ['Federal Reserve', 'Fedderel Riserv'],
]

for (const [wort, alteUmschrift] of ALT) {
  const wVorVokal = [...wort.toLowerCase().matchAll(/w(.)/g)].filter(([, next]) =>
    VOKALE.includes(next)
  ).length
  const us = (alteUmschrift.toLowerCase().match(/u/g) ?? []).length
  const hatV = alteUmschrift.toLowerCase().includes('v')

  pruefen(
    `Die alte Fassung „${alteUmschrift}" würde beanstandet`,
    (wVorVokal > 0 && us < wVorVokal) || hatV,
    'Wenn das hier durchgeht, prüft der Test nichts.'
  )
}

/* ======================================================================
   Und jetzt die ganze Tabelle, nicht nur die Liste oben.
   ====================================================================== */

/*
  ## Warum das die eigentliche Prüfung ist

  Die Liste `WOERTER` ist von Hand gepflegt. Sie hat die neun Verstöße vom
  20. August 2026 gefunden – und jeden Eintrag ungeprüft gelassen, der danach
  dazukam. Wer einen Namen in die Tabelle schreibt, denkt nicht daran, ihn
  zusätzlich hierher zu schreiben.

  So ist „Skwies" für „Squeeze" stehen geblieben: Die Regel sucht ein „w" im
  **englischen** Wort, und in „Squeeze" steht keins – das /w/ steckt im „qu".
  Gefunden hat es am 16. September 2026 ein Mensch beim Zuhören.

  Deshalb läuft die Regel jetzt über **jeden** Eintrag. Das Probewort entsteht
  aus dem Muster selbst; lässt es sich nicht ablesen, fällt der Eintrag durch,
  statt übersprungen zu werden. Eine Prüfung, die still auslässt, was sie
  nicht versteht, ist wieder eine Stichprobe.
*/

/**
 * Aus einem Muster ein Wort machen, das es trifft.
 *
 * Fangende Klammern kommen seit `mitGenitiv()` vor: Das Muster bekommt ein
 * `(s?)` angehängt, die Umschrift ein `$2`. Das Probewort nimmt das `s` mit
 * und prüft damit gleich die Form, um derentwillen es die Erweiterung gibt –
 * den Genitiv.
 */
function probewort(muster: RegExp): string {
  return muster.source
    .replaceAll('\\b', '')
    .replaceAll(/\((?:\?:)?([^)|]+)\|[^)]*\)/g, '$1') // (?:xx|cks), (a|b) → xx
    .replaceAll(/\(([^)]*)\)/g, '$1') // (s?) → s?
    .replaceAll(/\[([^\]])[^\]]*\]\??/g, '$1') // [ -]? → Leerzeichen
    .replaceAll(/(.)\?/g, '$1') // Sell-?off → Sell-off, s? → s
}

pruefen(
  `Die Tabelle hat Einträge (${ENGLISCHE_NAMEN.length})`,
  ENGLISCHE_NAMEN.length > 50,
  'Ohne Einträge prüft alles Folgende die leere Menge.'
)

for (const [muster, umschrift] of ENGLISCHE_NAMEN) {
  const wort = probewort(muster)

  /* Zuerst: Trifft das abgelesene Wort sein eigenes Muster? Wenn nicht, ist
     das Muster zu verwickelt für diese Prüfung – und dann wird es gemeldet,
     nicht stillschweigend ausgelassen. */
  if (!new RegExp(muster.source, muster.flags.replace('g', '')).test(wort)) {
    pruefen(
      `/${muster.source}/: Probewort ablesbar`,
      false,
      `Aus dem Muster wurde „${wort}" – das trifft es nicht. Entweder das ` +
        `Muster vereinfachen oder probewort() erweitern. Übersprungen wird nicht.`
    )
    continue
  }

  /* Regel 2: englisches „w" vor Vokal → „u" in der Umschrift. */
  const wVorVokal = [...wort.toLowerCase().matchAll(/w(.)/g)].filter(([, next]) =>
    VOKALE.includes(next)
  ).length
  if (wVorVokal > 0) {
    const us = (umschrift.toLowerCase().match(/u/g) ?? []).length
    pruefen(
      `„${wort}" → „${umschrift}": /w/ steht als „u"`,
      us >= wVorVokal,
      'Mit „w" gesprochen ergäbe das ein /v/.'
    )
  }

  /* Regel 3: englisches „v" → „w", nie „v". */
  if (wort.toLowerCase().includes('v')) {
    pruefen(
      `„${wort}" → „${umschrift}": das /v/ steht als „w"`,
      !umschrift.toLowerCase().includes('v'),
      '„v" ist im Deutschen /f/.'
    )
  }

  /*
    Regel 2, zweite Gestalt: das „qu".

    Englisches „qu" ist /kw/. Ein „kw" in der Umschrift wäre im Deutschen
    /kv/ – dieselbe Falle wie beim „w", nur dass die Regel oben sie nicht
    sieht, weil im englischen Wort kein „w" steht. Genau daran ist „Squeeze"
    vorbeigekommen.
  */
  if (/qu/i.test(wort)) {
    pruefen(
      `„${wort}" → „${umschrift}": das /kw/ aus „qu" steht als „ku"`,
      !/kw/i.test(umschrift),
      '„kw" ist im Deutschen /kv/ – gebraucht wird „ku".'
    )
  }
}

/*
  Und die Regel darf nicht zu scharf sein: Wörter ohne englisches /w/ und
  ohne „v" dürfen ruhig ein „w" tragen – es ist dann der richtige Laut.
*/
pruefen(
  'Ein deutsches /v/ darf weiter als „w" dastehen',
  englischeNamenSprechbar('Value') === 'Wällju',
  englischeNamenSprechbar('Value')
)

pruefen(
  'Der Doppellaut in „Dow Jones" bleibt „au"',
  englischeNamenSprechbar('Dow Jones') === 'Dau Dschons',
  englischeNamenSprechbar('Dow Jones')
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
