import { calculators } from '@/data/calculators'
import { AENDERUNGEN } from '@/data/aenderungen'
import { IRRTUEMER } from '@/data/irrtuemer'
import { getAlleLektionen, getBereiche } from '@/lib/akademie'
import { getEditions } from '@/lib/editions'
import { getGlossar } from '@/lib/glossar'
import { getLearnTopics, getLearnLevelParams } from '@/lib/learn'
import { getInstruments } from '@/lib/markets'
import { METHODEN } from '@/lib/methoden'
import { getNewsArticles } from '@/lib/news'
import { getFolgen } from '@/lib/podcast'
import { getQuellengruppen } from '@/lib/quellen'

/**
 * Die Website in Zahlen – beim Bauen gezählt, nicht gepflegt.
 *
 * ## Warum das gezählt und nicht hingeschrieben wird
 *
 * Eine Zahl auf einer Seite, die jemand von Hand einträgt, ist am Tag nach
 * ihrer Eintragung falsch. „34 Themen" stand monatelang richtig da und wäre
 * beim fünfunddreißigsten still zur Lüge geworden – niemand ändert eine
 * Überschrift, weil ein Datensatz dazugekommen ist.
 *
 * Gezählt wird deshalb aus **denselben Funktionen, aus denen die Seiten
 * lesen**. Eine Zahl hier kann nicht von der Wirklichkeit abweichen, weil sie
 * die Wirklichkeit ist.
 *
 * ## Und warum sie zugleich eine Prüfung ist
 *
 * Das ist der eigentliche Zweck. Diese Zahlen fallen nicht von selbst: Ein
 * Artikel verschwindet nicht, ein Instrument wird nicht weniger, eine
 * Podcastfolge löscht sich nicht.
 *
 * **Wenn eine Zahl trotzdem fällt, ist etwas kaputt** – ein Datenbestand hat
 * sich geleert, ein Abruf hat eine Datei überschrieben, ein Import ist
 * stillschweigend leer zurückgekommen. Genau die Sorte Fehler, die nichts rot
 * macht: Die Seite baut, die Prüfungen laufen, es steht nur weniger da.
 *
 * `data/zahlen-stand.json` hält den letzten bekannten Stand fest,
 * `npm run zahlen` vergleicht. Ein Rückgang ist eine Meldung, kein Absturz –
 * es gibt legitime Rückgänge, und eine Prüfung, die bei jedem davon rot wird,
 * schaltet jemand ab.
 */

/** Eine gezählte Größe mit dem, was sie bedeutet. */
export interface Zahl {
  /** Schlüssel für den Abgleich mit dem letzten Stand – nie umbenennen. */
  id: string
  label: string
  wert: number
  /** Ein Satz dazu, was da eigentlich gezählt wurde. */
  hinweis: string
  ziel?: string
}

/**
 * Alle Zahlen, aus den echten Beständen.
 *
 * Absichtlich `async`: Die Hälfte der Quellen ist es, und eine Mischung aus
 * synchron und asynchron an der Aufrufstelle wäre eine Fehlerquelle für
 * nichts.
 */
export async function getWebsiteZahlen(): Promise<Zahl[]> {
  const [themen, stufen, artikel, ausgaben, instrumente, glossar, quellen] =
    await Promise.all([
      getLearnTopics(),
      getLearnLevelParams(),
      getNewsArticles(),
      getEditions(),
      getInstruments(),
      getGlossar(),
      getQuellengruppen(),
    ])

  const lektionen = getAlleLektionen()
  const folgen = getFolgen()

  /*
    `getGlossar()` liefert die Einträge flach, `getQuellengruppen()` gruppiert.

    Beim ersten Anlauf stand hier für beide dieselbe Summierung – die
    Typprüfung hat es gemeldet. Ohne sie hätte auf der Seite die Zahl der
    Gruppen statt der Quellen gestanden: rund ein Zwanzigstel, und
    plausibel genug, dass es niemandem aufgefallen wäre.
  */
  const begriffe = glossar.length
  const quellenzahl = quellen.reduce(
    (summe, gruppe) => summe + gruppe.eintraege.length,
    0
  )

  return [
    {
      id: 'lernthemen',
      label: 'Lernthemen',
      wert: themen.length,
      hinweis: 'Jedes in den Stufen Beginner, Fortgeschritten und Profi.',
      ziel: '/lernen',
    },
    {
      id: 'lernstufen',
      label: 'Lernstufen',
      wert: stufen.length,
      hinweis: 'Einzelne Seiten mit eigenem Text – nicht Themen mal drei.',
      ziel: '/lernen',
    },
    {
      id: 'akademie-lektionen',
      label: 'Akademie-Lektionen',
      wert: lektionen.length,
      hinweis: `Aufbauende Kurseinheiten, verteilt auf ${getBereiche().length} Bereiche.`,
      ziel: '/akademie',
    },
    {
      id: 'rechner',
      label: 'Rechner',
      wert: calculators.length,
      hinweis: 'Alle mit offengelegter Formel, ohne Konto und ohne Übertragung.',
      ziel: '/rechner',
    },
    {
      id: 'instrumente',
      label: 'Kurse',
      wert: instrumente.length,
      hinweis: 'Aktien, Indizes, ETFs, Rohstoffe, Devisen und Kryptowährungen.',
      ziel: '/maerkte',
    },
    {
      id: 'artikel',
      label: 'Nachrichtenartikel',
      wert: artikel.length,
      hinweis: 'Jeder mit Quelle und Einordnung, was er für Privatanleger bedeutet.',
      ziel: '/news',
    },
    {
      id: 'ausgaben',
      label: 'Tagesausgaben',
      wert: ausgaben.length,
      hinweis: 'Eine je Erscheinungstag, seit dem Start.',
      ziel: '/news/tag',
    },
    {
      id: 'podcastfolgen',
      label: 'Podcastfolgen',
      wert: folgen.length,
      hinweis: 'Täglich, rund fünf Minuten – Text und Stimme mit KI erzeugt.',
      ziel: '/podcast',
    },
    {
      id: 'glossarbegriffe',
      label: 'Glossarbegriffe',
      wert: begriffe,
      hinweis: 'Mit Beispiel und Abgrenzung zu dem, womit sie verwechselt werden.',
      ziel: '/glossar',
    },
    {
      id: 'quellen',
      label: 'Datenquellen',
      wert: quellenzahl,
      hinweis: 'Herkunft, Abgrenzung und Lizenz jeder einzelnen offengelegt.',
      ziel: '/quellen',
    },
    {
      id: 'irrtuemer',
      label: 'Richtiggestellte Irrtümer',
      wert: IRRTUEMER.length,
      hinweis:
        'Je Satz: was daran richtig ist, was nicht – und die Rechnung, nachgeprüft.',
      ziel: '/irrtuemer',
    },
    {
      id: 'methoden',
      label: 'Offengelegte Rechenwege',
      wert: METHODEN.length,
      hinweis: 'Mit Formel, Stichtag und dem, was bewusst weggelassen wird.',
      ziel: '/methoden',
    },
    {
      id: 'aenderungen',
      label: 'Einträge im Änderungsprotokoll',
      wert: AENDERUNGEN.length,
      hinweis: `Davon ${AENDERUNGEN.filter((a) => a.art === 'korrigiert').length} Korrekturen an uns selbst.`,
      ziel: '/aenderungen',
    },
  ]
}

/** Ein Rückgang gegenüber dem letzten festgehaltenen Stand. */
export interface Rueckgang {
  id: string
  label: string
  vorher: number
  jetzt: number
}

/**
 * Vergleicht gezählte Zahlen mit einem festgehaltenen Stand.
 *
 * Gemeldet wird **nur, was gefallen ist**. Ein Zuwachs ist der Normalfall und
 * verdiente keine Zeile; eine Meldung, die bei jedem Lauf etwas sagt, wird
 * überlesen.
 *
 * Neue Schlüssel gelten nicht als Rückgang – sie standen vorher nirgends. Ein
 * **verschwundener** Schlüssel dagegen schon: Er ist ein Rückgang auf null und
 * genau der Fall, den niemand von Hand bemerkt.
 */
export function findeRueckgaenge(
  zahlen: readonly Zahl[],
  stand: Readonly<Record<string, number>>
): Rueckgang[] {
  const jetzt = new Map(zahlen.map((z) => [z.id, z]))
  const rueckgaenge: Rueckgang[] = []

  for (const [id, vorher] of Object.entries(stand)) {
    const zahl = jetzt.get(id)
    if (!zahl) {
      rueckgaenge.push({ id, label: id, vorher, jetzt: 0 })
      continue
    }
    if (zahl.wert < vorher) {
      rueckgaenge.push({ id, label: zahl.label, vorher, jetzt: zahl.wert })
    }
  }

  return rueckgaenge
}
