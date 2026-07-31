/**
 * Zwei Aktien nebeneinander – die Regeln, welcher Vergleich zulässig ist.
 *
 * ## Warum das der schwierige Teil ist
 *
 * Zwei Zahlenreihen nebeneinanderzustellen kann jede Tabelle. Die Frage ist,
 * welche der Gegenüberstellungen etwas bedeuten. Ein Kurs von 320 gegen einen
 * von 41 sagt gar nichts – er hängt daran, in wie viele Stücke ein Unternehmen
 * zerlegt wurde. Ein KGV von 12 gegen eines von 38 sagt fast nichts, solange
 * die beiden in verschiedenen Branchen arbeiten: Ein Versorger und ein
 * Softwarehaus werden aus guten Gründen unterschiedlich bewertet.
 *
 * Dieses Modul markiert deshalb **nicht** überall einen Sieger. Wo eine
 * Gegenüberstellung nicht trägt, steht statt der Markierung der Grund.
 *
 * ## Die drei Regeln
 *
 * 1. **Kein Sieger ohne Richtung.** Bei Kurs, Währung, Branche und Sitzland
 *    gibt es kein „besser“, sondern nur „anders“.
 * 2. **Kein Sieger bei zu kleinem Abstand.** Zwei Prozentpunkte Unterschied
 *    über fünf Jahre sind kein Unterschied, sondern Rauschen. Wer ihn
 *    markiert, erfindet eine Aussage.
 * 3. **Kein Bewertungsvergleich über Branchengrenzen.** Wo die Branchen
 *    auseinandergehen, bleiben KGV, KUV und KBV unmarkiert – mit dem Hinweis,
 *    woran es liegt.
 *
 * Ohne Laufzeitimporte, damit `tests/` das Modul direkt laden kann.
 */

/**
 * Die Gattung eines Instruments.
 *
 * Bis August 2026 gab es sie hier nicht, weil die Seite nur Aktien kannte.
 * Seit auch Rohstoffe, Indizes, ETFs, Devisen und Kryptowährungen vergleichbar
 * sind, entscheidet sie über zwei Dinge: welche Gruppen überhaupt erscheinen
 * und welcher Vorbehalt über der Tabelle steht. Eine Unze Gold hat kein
 * Kurs-Gewinn-Verhältnis – nicht, weil die Zahl fehlt, sondern weil es die
 * Frage nicht gibt.
 */
export type Anlageart = 'stock' | 'index' | 'etf' | 'commodity' | 'fx' | 'crypto'

/** Wie die Gattungen im Fließtext heißen. */
export const ARTNAMEN: Record<Anlageart, string> = {
  stock: 'Aktie',
  index: 'Index',
  etf: 'ETF',
  commodity: 'Rohstoff',
  fx: 'Währungspaar',
  crypto: 'Kryptowährung',
}

/**
 * Was hinter einer Gattung steht – in einem Halbsatz.
 *
 * Der Vorbehalt über der Tabelle setzt daraus einen Satz zusammen. Zuerst
 * stand dort ein fester Text über Aktien und Rohstoffe, und der erschien dann
 * auch bei „Kryptowährung gegen Index“ – ein Beispiel über zwei Gattungen, von
 * denen keine beteiligt war.
 */
const WAS_DAHINTER: Record<Anlageart, string> = {
  stock: 'ein Unternehmen, das arbeitet und Gewinne erzeugt',
  index: 'ein Korb aus vielen Titeln, nach festen Regeln zusammengesetzt',
  etf: 'ein Fonds, der einen Index nachbildet – mit laufenden Kosten',
  commodity: 'ein Preis, den Angebot und Nachfrage machen',
  fx: 'das Verhältnis zweier Währungen zueinander',
  crypto: 'ein Netzwerk ohne Gewinn, ohne Bilanz und ohne Anspruch auf etwas',
}

/**
 * Ob für diese Gattung Bewertungszahlen überhaupt eine Frage sind.
 *
 * Nur bei Aktien. Ein Index hat kein Eigenkapital, eine Unze Gold keinen
 * Gewinn – und der Unterschied zwischen „nicht erfasst“ und „gibt es nicht“
 * ist genau der, den eine leere Tabellenzeile verwischt.
 */
function hatBewertung(art: Anlageart): boolean {
  return art === 'stock'
}

export interface Vergleichsposten {
  symbol: string
  ticker: string
  name: string
  art: Anlageart
  /** Kurswährung nach der Umrechnung von Pence & Co. in die Hauptwährung. */
  waehrung: string
  branche: string | null
  /** Sitzland als ISO-3166-Zahl. */
  sitzland: string | null
  kurs: number
  veraenderung: number
  /** Dividendenrendite in Prozent, wo sie gebildet werden konnte. */
  rendite: number | null
  /** Wertentwicklung in Prozent über feste Zeiträume. */
  performance: Partial<Record<'1J' | '3J' | '5J', number>>
  /** Jahresschwankung in Prozent. */
  schwankung: number | null
  /** Größter Rückgang vom Hoch zum Tief, in Prozent (negativ). */
  maxRueckgang: number | null
  /** Währung, in der die Bilanzzahlen gemeldet sind. */
  bilanzwaehrung: string | null
  /** Kurs mal Aktienzahl, in der Bilanzwährung. */
  marktkapitalisierung: number | null
  kgv: number | null
  kuv: number | null
  kbv: number | null
}

/**
 * Wie ein Wert geschrieben wird.
 *
 * `prozent` trägt ein Vorzeichen, `anteil` nicht. Der Unterschied ist nicht
 * kosmetisch: „+2,4 %“ bei einer Dividendenrendite läse sich wie eine
 * Veränderung, und eine Schwankung von „+25 %“ ergäbe gar keinen Sinn.
 */
export type Einheit = 'prozent' | 'anteil' | 'faktor' | 'geld' | 'kurs' | 'text'

export interface Vergleichszeile {
  feld: string
  einheit: Einheit
  links: number | null
  rechts: number | null
  /** Bei `einheit: 'text'` steht der Inhalt hier statt in `links`/`rechts`. */
  linksText?: string | null
  rechtsText?: string | null
  /** Welcher der beiden nach der Konvention dieser Zeile vorn liegt. */
  vorn: 'links' | 'rechts' | null
  /** Was „vorn“ hier heißt – oder warum niemand markiert ist. */
  hinweis: string | null
}

export interface Vergleichsgruppe {
  titel: string
  /** Ein Satz darüber, was die Gruppe beantwortet. */
  einleitung: string
  zeilen: Vergleichszeile[]
}

/**
 * Ab wann ein Unterschied einer ist.
 *
 * Bei Prozentangaben in Prozentpunkten, bei Verhältniszahlen relativ. Die
 * Werte sind gesetzt und nicht hergeleitet – sie sollen verhindern, dass aus
 * 12,3 gegen 12,4 eine Aussage wird, nicht eine Signifikanz behaupten.
 */
const MINDESTABSTAND_PROZENTPUNKTE = 1
const MINDESTABSTAND_RELATIV = 0.05

/** Wählt den größeren Wert, wenn der Abstand groß genug ist. */
function hoeher(
  links: number | null,
  rechts: number | null,
  mindest: number
): 'links' | 'rechts' | null {
  if (links === null || rechts === null) return null
  if (Math.abs(links - rechts) < mindest) return null
  return links > rechts ? 'links' : 'rechts'
}

/** Wählt den kleineren Wert, wenn der Abstand groß genug ist. */
function niedriger(
  links: number | null,
  rechts: number | null,
  mindest: number
): 'links' | 'rechts' | null {
  const groesser = hoeher(links, rechts, mindest)
  if (groesser === null) return null
  return groesser === 'links' ? 'rechts' : 'links'
}

/**
 * Der relative Mindestabstand für Verhältniszahlen.
 *
 * Fünf Prozent vom kleineren der beiden Werte. Absolut wäre hier falsch: Bei
 * einem KGV von 6 gegen 7 ist ein Punkt viel, bei 60 gegen 61 nichts.
 */
function relativerMindestabstand(links: number | null, rechts: number | null): number {
  if (links === null || rechts === null) return Number.POSITIVE_INFINITY
  return Math.min(Math.abs(links), Math.abs(rechts)) * MINDESTABSTAND_RELATIV
}

const ZU_KNAPP = 'Der Unterschied ist zu klein, um etwas zu bedeuten.'
const FEHLT_EINER = 'Für einen der beiden fehlt die Angabe – ohne beide kein Vergleich.'

/** Der Hinweis, wenn kein Sieger markiert wurde, sonst der mitgegebene Text. */
function begruendung(
  vorn: 'links' | 'rechts' | null,
  links: number | null,
  rechts: number | null,
  wennVorn: string | null
): string | null {
  if (vorn !== null) return wennVorn
  if (links === null || rechts === null) return FEHLT_EINER
  return ZU_KNAPP
}

const ZEITRAUMNAMEN: Record<'1J' | '3J' | '5J', string> = {
  '1J': 'Ein Jahr',
  '3J': 'Drei Jahre',
  '5J': 'Fünf Jahre',
}

/**
 * Die Gegenüberstellung in vier Gruppen.
 *
 * `links` und `rechts` sind die beiden gewählten Titel; die Reihenfolge ist
 * die der Auswahl und bedeutet nichts.
 */
/**
 * Ob eine Zeile überhaupt etwas enthält.
 *
 * Eine Zahl, ein Text – irgendetwas auf einer der beiden Seiten. Zeilen, auf
 * die das für keine Seite zutrifft, verschwinden mitsamt ihrer Gruppe.
 */
function traegtEtwas(zeile: Vergleichszeile): boolean {
  return (
    zeile.links !== null ||
    zeile.rechts !== null ||
    Boolean(zeile.linksText) ||
    Boolean(zeile.rechtsText)
  )
}

/**
 * Wirft Gruppen weg, in denen auf beiden Seiten nichts steht.
 *
 * Der Grund ist eine Unterscheidung, die eine leere Tabellenzeile nicht
 * treffen kann: **fehlt** gegen **gibt es nicht**. Vier leere Zeilen unter
 * „Bewertung“ lesen sich bei Gold gegen Bitcoin wie eine Lücke im Bestand.
 * Tatsächlich hat weder eine Unze noch eine Kryptowährung einen Gewinn, an dem
 * sich ein Kurs-Gewinn-Verhältnis bilden ließe.
 *
 * Bei zwei Aktien ändert das nichts: Dort trägt die Gruppe Werte, sobald einer
 * der beiden welche hat, und die halbleere Tabelle steht weiterhin da – dort
 * heißt leer nämlich wirklich „nicht erfasst“.
 */
function ohneLeere(gruppen: Vergleichsgruppe[]): Vergleichsgruppe[] {
  return gruppen
    .map((gruppe) => ({ ...gruppe, zeilen: gruppe.zeilen.filter(traegtEtwas) }))
    .filter((gruppe) => gruppe.zeilen.length > 0)
}

export function vergleiche(
  links: Vergleichsposten,
  rechts: Vergleichsposten
): Vergleichsgruppe[] {
  const gleicheBranche =
    links.branche !== null && rechts.branche !== null && links.branche === rechts.branche
  const gleicheBilanzwaehrung =
    links.bilanzwaehrung !== null &&
    rechts.bilanzwaehrung !== null &&
    links.bilanzwaehrung === rechts.bilanzwaehrung

  const entwicklung: Vergleichszeile[] = (['1J', '3J', '5J'] as const).map((zeitraum) => {
    const a = links.performance[zeitraum] ?? null
    const b = rechts.performance[zeitraum] ?? null
    const vorn = hoeher(a, b, MINDESTABSTAND_PROZENTPUNKTE)
    return {
      feld: ZEITRAUMNAMEN[zeitraum],
      einheit: 'prozent' as const,
      links: a,
      rechts: b,
      vorn,
      hinweis: begruendung(
        vorn,
        a,
        b,
        'Mehr Kursgewinn im selben Zeitraum. Was war, sagt nichts über das, was kommt.'
      ),
    }
  })

  const renditeVorn = hoeher(links.rendite, rechts.rendite, 0.2)

  const kgvVorn = gleicheBranche
    ? niedriger(links.kgv, rechts.kgv, relativerMindestabstand(links.kgv, rechts.kgv))
    : null
  const kuvVorn = gleicheBranche
    ? niedriger(links.kuv, rechts.kuv, relativerMindestabstand(links.kuv, rechts.kuv))
    : null
  const kbvVorn = gleicheBranche
    ? niedriger(links.kbv, rechts.kbv, relativerMindestabstand(links.kbv, rechts.kbv))
    : null

  /*
    Der Hinweis bei verschiedenen Branchen steht an jeder der drei Zeilen und
    nicht nur einmal über der Gruppe. Wer eine einzelne Zeile liest – und so
    liest man eine Tabelle –, sieht sonst zwei Zahlen und keine Einschränkung.
  */
  const brancheFehlt = links.branche === null || rechts.branche === null
  const bewertungsvorbehalt = brancheFehlt
    ? 'Für einen der beiden ist keine Branche hinterlegt – ohne sie ist nicht zu beurteilen, ob die Bewertung vergleichbar ist.'
    : 'Verschiedene Branchen werden aus guten Gründen verschieden bewertet – ein niedrigerer Wert ist hier kein günstigerer.'

  const bewertungsHinweis = (
    vorn: 'links' | 'rechts' | null,
    a: number | null,
    b: number | null,
    satz: string
  ): string | null => {
    if (!gleicheBranche) return bewertungsvorbehalt
    return begruendung(vorn, a, b, satz)
  }

  return ohneLeere([
    {
      titel: 'Wertentwicklung',
      einleitung:
        'Kursveränderung über feste Zeiträume, ohne Dividenden. Wo ein Zeitraum leer ist, reicht die Kursreihe nicht so weit zurück.',
      zeilen: [
        ...entwicklung,
        {
          feld: 'Dividendenrendite',
          einheit: 'anteil',
          links: links.rendite,
          rechts: rechts.rendite,
          vorn: renditeVorn,
          hinweis: begruendung(
            renditeVorn,
            links.rendite,
            rechts.rendite,
            'Höhere Ausschüttung gemessen am Kurs. Eine hohe Rendite entsteht auch dadurch, dass der Kurs gefallen ist.'
          ),
        },
      ],
    },
    {
      titel: 'Schwankung',
      einleitung:
        'Wie unruhig der Kurs war. Weniger Schwankung heißt ruhiger, nicht besser – wer Schwankung vermeidet, verzichtet auch auf einen Teil der Rendite.',
      zeilen: [
        {
          feld: 'Jahresschwankung',
          einheit: 'anteil',
          links: links.schwankung,
          rechts: rechts.schwankung,
          vorn: niedriger(
            links.schwankung,
            rechts.schwankung,
            MINDESTABSTAND_PROZENTPUNKTE
          ),
          hinweis: begruendung(
            niedriger(links.schwankung, rechts.schwankung, MINDESTABSTAND_PROZENTPUNKTE),
            links.schwankung,
            rechts.schwankung,
            'Ruhigerer Verlauf im letzten Jahr.'
          ),
        },
        {
          feld: 'Größter Rückgang',
          einheit: 'prozent',
          links: links.maxRueckgang,
          rechts: rechts.maxRueckgang,
          /*
            Der Rückgang ist negativ; der kleinere Betrag ist der mildere,
            also der größere Wert. Ein Vorzeichen zu übersehen dreht hier die
            Aussage vollständig um – deshalb steht es als Kommentar da und
            nicht nur im Test.
          */
          vorn: hoeher(
            links.maxRueckgang,
            rechts.maxRueckgang,
            MINDESTABSTAND_PROZENTPUNKTE
          ),
          hinweis: begruendung(
            hoeher(links.maxRueckgang, rechts.maxRueckgang, MINDESTABSTAND_PROZENTPUNKTE),
            links.maxRueckgang,
            rechts.maxRueckgang,
            'Milderer Einbruch vom Hoch zum darauffolgenden Tief.'
          ),
        },
      ],
    },
    /*
      Die Bewertungsgruppe gibt es nur, wenn beide Seiten Aktien sind.

      `ohneLeere` allein genügt hier nicht: Bei Gold gegen NVIDIA trägt die
      rechte Spalte echte Zahlen, also blieben die Zeilen stehen – mit einem
      Strich für Gold. Das läse sich als „für Gold nicht erfasst“, und richtig
      ist „für Gold nicht definiert“. Ein Vergleich braucht zwei Seiten; eine
      Zahl gegen einen Strich ist keiner.
    */
    ...(hatBewertung(links.art) && hatBewertung(rechts.art)
      ? ([
          {
            titel: 'Bewertung',
            einleitung:
              'Was der Markt für einen Euro Gewinn, Umsatz oder Eigenkapital verlangt. Aussagekräftig nur innerhalb derselben Branche.',
            zeilen: [
              {
                feld: 'Kurs-Gewinn-Verhältnis',
                einheit: 'faktor',
                links: links.kgv,
                rechts: rechts.kgv,
                vorn: kgvVorn,
                hinweis: bewertungsHinweis(
                  kgvVorn,
                  links.kgv,
                  rechts.kgv,
                  'Günstiger gemessen am Gewinn. Günstig ist nicht dasselbe wie gut – oft ist es der Preis für schwächere Aussichten.'
                ),
              },
              {
                feld: 'Kurs-Umsatz-Verhältnis',
                einheit: 'faktor',
                links: links.kuv,
                rechts: rechts.kuv,
                vorn: kuvVorn,
                hinweis: bewertungsHinweis(
                  kuvVorn,
                  links.kuv,
                  rechts.kuv,
                  'Günstiger gemessen am Umsatz.'
                ),
              },
              {
                feld: 'Kurs-Buchwert-Verhältnis',
                einheit: 'faktor',
                links: links.kbv,
                rechts: rechts.kbv,
                vorn: kbvVorn,
                hinweis: bewertungsHinweis(
                  kbvVorn,
                  links.kbv,
                  rechts.kbv,
                  'Günstiger gemessen am Eigenkapital.'
                ),
              },
              {
                feld: 'Börsenwert',
                einheit: 'geld',
                links: links.marktkapitalisierung,
                rechts: rechts.marktkapitalisierung,
                /*
            Größe ist kein Vorzug, und der Vergleich trägt ohnehin nur bei
            gleicher Bilanzwährung: 400 Milliarden Yen sind nicht mehr als 40
            Milliarden Dollar, obwohl die Zahl größer ist.
          */
                vorn: null,
                hinweis: gleicheBilanzwaehrung
                  ? 'Größe ist weder ein Vorzug noch ein Mangel – sie sagt, wie viel Geld in dem Unternehmen steckt.'
                  : 'Die beiden melden in verschiedenen Währungen. Die Beträge stehen nebeneinander, vergleichbar sind sie nicht.',
              },
            ],
          },
        ] satisfies Vergleichsgruppe[])
      : []),
    {
      titel: 'Einordnung',
      einleitung:
        'Woher die beiden kommen und womit sie ihr Geld verdienen. Hier gibt es kein Besser, sondern nur Unterschiede – die aber wiegen schwer.',
      zeilen: [
        {
          feld: 'Branche',
          einheit: 'text',
          links: null,
          rechts: null,
          linksText: links.branche,
          rechtsText: rechts.branche,
          vorn: null,
          hinweis: gleicheBranche
            ? 'Dieselbe Branche – damit sind die Bewertungszahlen oben vergleichbar.'
            : 'Verschiedene Branchen. Zwei Titel aus verschiedenen Geschäften bewegen sich aus verschiedenen Gründen.',
        },
        {
          feld: 'Kurs',
          einheit: 'kurs',
          links: links.kurs,
          rechts: rechts.kurs,
          vorn: null,
          hinweis:
            'Ein Aktienkurs für sich sagt nichts. Er hängt daran, in wie viele Stücke ein Unternehmen zerlegt wurde – nicht daran, was es wert ist.',
        },
        {
          feld: 'Heute',
          einheit: 'prozent',
          links: links.veraenderung,
          rechts: rechts.veraenderung,
          vorn: null,
          hinweis: 'Ein Handelstag. Für einen Vergleich zweier Unternehmen zu kurz.',
        },
      ],
    },
  ])
}

/**
 * Die Vorbehalte, die für den ganzen Vergleich gelten.
 *
 * Sie stehen über der Tabelle und nicht darunter. Wer sie erst nach den Zahlen
 * liest, hat die Zahlen schon geglaubt.
 */
export function vorbehalte(links: Vergleichsposten, rechts: Vergleichsposten): string[] {
  const gesammelt: string[] = []

  /*
    Der Gattungsunterschied steht ganz oben, vor der Währung.

    Er ist der schwerste: Wer eine Aktie gegen einen Rohstoff hält, vergleicht
    zwei verschiedene Dinge. Hinter der Aktie steht ein Unternehmen, das
    arbeitet und Gewinne erzeugt; hinter dem Rohstoff steht ein Preis, den
    Angebot und Nachfrage machen. Beide haben eine Kurve, und die Kurven sehen
    gleich aus – das ist genau die Verwechslung, gegen die dieser Satz steht.
  */
  if (links.art !== rechts.art) {
    gesammelt.push(
      `${ARTNAMEN[links.art]} gegen ${ARTNAMEN[rechts.art]}: zwei verschiedene Gattungen. ` +
        `Hinter dem einen steht ${WAS_DAHINTER[links.art]}, hinter dem anderen ` +
        `${WAS_DAHINTER[rechts.art]}. Die Kurven lassen sich nebeneinanderlegen, die Sache ` +
        'dahinter nicht.'
    )
  }

  /*
    Krypto handelt an 365 Tagen, eine Aktie an rund 252.

    Die Schwankung wird über Handelstage gerechnet. Bei einem Titel mit sieben
    Handelstagen je Woche steckt in derselben Zahl ein anderer Zeitraum – das
    erklärt diese Website an anderer Stelle ausdrücklich, und hier ist die
    Stelle, an der es jemanden trifft.
  */
  const kryptoDabei = links.art === 'crypto' || rechts.art === 'crypto'
  if (kryptoDabei && links.art !== rechts.art) {
    gesammelt.push(
      'Kryptowährungen handeln an 365 Tagen im Jahr, Börsen an rund 252. Schwankung und ' +
        'größter Rückgang decken damit verschieden lange Zeiträume ab, obwohl dieselbe ' +
        'Anzahl Handelstage dahintersteht.'
    )
  }

  if (links.waehrung !== rechts.waehrung) {
    gesammelt.push(
      `Die beiden notieren in verschiedenen Währungen (${links.waehrung} und ${rechts.waehrung}). ` +
        'Die Prozentangaben lassen sich trotzdem vergleichen, die Beträge nicht – und in der ' +
        'Wertentwicklung steckt bei jedem Titel zusätzlich die Bewegung seiner Währung.'
    )
  }

  /* Nur unter Aktien: Bei einer Aktie gegen einen Index gibt es keine zwei Branchen. */
  if (links.branche !== rechts.branche && links.branche && rechts.branche) {
    gesammelt.push(
      `${links.branche} gegen ${rechts.branche}: verschiedene Branchen. ` +
        'Die Bewertungszahlen bleiben deshalb ohne Markierung – sie ließen sich nur ' +
        'innerhalb derselben Branche gegeneinanderhalten.'
    )
  }

  if (links.sitzland !== rechts.sitzland && links.sitzland && rechts.sitzland) {
    gesammelt.push(
      'Die beiden haben ihren Sitz in verschiedenen Ländern. Auf die Dividende fällt damit ' +
        'unterschiedlich viel Quellensteuer an – was davon anrechenbar ist, steht auf den ' +
        'jeweiligen Kursseiten.'
    )
  }

  const fehlend = (['1J', '3J', '5J'] as const).filter(
    (zeitraum) =>
      (links.performance[zeitraum] === undefined) !==
      (rechts.performance[zeitraum] === undefined)
  )
  if (fehlend.length > 0) {
    gesammelt.push(
      'Für einen der beiden reicht die Kursreihe nicht über alle Zeiträume zurück. ' +
        'Die leeren Felder heißen „nicht erfasst“ und nicht „keine Entwicklung“.'
    )
  }

  return gesammelt
}
