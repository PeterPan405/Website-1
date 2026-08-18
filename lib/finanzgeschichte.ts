import { kurseinbrueche, type Kurseinbruch } from '@/data/crashes'
import { GESCHICHTSEREIGNISSE, type Ereignis } from '@/data/finanzgeschichte'

/**
 * Der Zeitstrahl der Finanzgeschichte – aus den Beständen zusammengesetzt.
 *
 * ## Die Aussage, um die es geht
 *
 * **Nicht die Falltiefe zählt, sondern die Erholungsdauer.** Wer 1987 an dem
 * Tag zusah, an dem die Kurse um ein Fünftel fielen, erlebte einen Schrecken,
 * der nach zwei Jahren erledigt war. Wer 1929 dabei war, wartete eine
 * Generation. Und der tiefste Einbruch der jüngeren Zeit – 2020, ein Drittel –
 * war nach einem halben Jahr vorbei.
 *
 * Das ist keine Meinung, sondern ein Vergleich zweier Spalten in
 * `data/crashes.ts`. `erholungsbefund()` rechnet ihn aus, damit die Aussage
 * auf der Seite nicht danebenliegt, wenn ein Fall dazukommt.
 *
 * ## Warum die Ereignisse aus zwei Quellen kommen
 *
 * Die Einbrüche stehen in `data/crashes.ts` und werden dort mit Rückgang und
 * Erholungsdauer gepflegt; sie werden hier **nicht abgeschrieben**, sondern
 * umgeformt. Alles andere – Währungsordnungen, Reformen, Notenbankgründungen –
 * steht in `data/finanzgeschichte.ts`.
 *
 * Zwei Bestände, ein Strahl: Wer eine Erholungsdauer ändert, ändert sie an
 * einer Stelle, und die Seite folgt. Stünde sie zweimal da, wäre die zweite
 * nach der ersten Änderung falsch – und zwar die auf dem Zeitstrahl, weil sie
 * beim Korrekturlesen niemand mitliest.
 *
 * ## Was ein Datum ist und was eine Schätzung
 *
 * Ein Datum ist nachprüfbar: Bretton Woods endete am 15. August 1971. Eine
 * Erholungsdauer ist es nicht – sie hängt daran, welcher Index betrachtet wird
 * und ob real oder nominal gerechnet wird; bei 1929 liegen die gängigen
 * Angaben zwischen gut fünfzehn und über fünfundzwanzig Jahren.
 *
 * Deshalb trägt jedes Ereignis eine `genauigkeit`, und die Seite zeigt sie an.
 * Eine Jahreszahl neben einer Näherung, beide gleich gesetzt, wäre die stille
 * Behauptung, beide seien gleich sicher.
 */

/** Woher die Angaben eines Ereignisses stammen – und wie fest sie sind. */
export type Genauigkeit =
  /** Ein Datum oder ein Jahr, das sich an einem Vorgang festmachen lässt. */
  | 'datum'
  /** Eine Größenordnung aus der gängigen Darstellung, keine Messung. */
  | 'naeherung'

export type Art = 'einbruch' | 'geldsystem' | 'notenbank' | 'waehrung'

export const ARTEN: { id: Art; label: string; beschreibung: string }[] = [
  {
    id: 'einbruch',
    label: 'Kurseinbruch',
    beschreibung: 'Rückgang und Dauer bis zum Wiedererreichen des alten Stands.',
  },
  {
    id: 'geldsystem',
    label: 'Geldsystem',
    beschreibung: 'Wovon das Geld gedeckt war und wann sich das änderte.',
  },
  {
    id: 'notenbank',
    label: 'Notenbank',
    beschreibung: 'Wer über die Geldmenge entscheidet – und seit wann.',
  },
  {
    id: 'waehrung',
    label: 'Währung',
    beschreibung: 'Einführungen, Reformen und das Ende einzelner Währungen.',
  },
]

/** Ein Punkt auf dem Strahl. */
export interface Zeitpunkt {
  /** Kennung für Sprungmarke und Test. */
  id: string
  jahr: number
  /** Der Tag, wo er sich benennen lässt – sonst leer. */
  tag?: string
  titel: string
  art: Art
  /** Was geschah, in zwei bis drei Sätzen. */
  was: string
  /** Was man daraus mitnimmt. */
  lehre: string
  genauigkeit: Genauigkeit
  /** Nur bei Einbrüchen: Rückgang und Dauer, aus `data/crashes.ts`. */
  einbruch?: { rueckgangProzent: number; erholungJahre: number }
  glossar?: string[]
}

/**
 * Ein Einbruch aus `data/crashes.ts` als Punkt auf dem Strahl.
 *
 * Die Prosa steht hier, die Zahlen kommen von dort. Umgekehrt wäre es
 * bequemer und in einem Jahr falsch.
 */
function ausEinbruch(einbruch: Kurseinbruch, was: string, lehre: string): Zeitpunkt {
  return {
    id: `einbruch-${einbruch.jahr}`,
    jahr: einbruch.jahr,
    titel:
      einbruch.name === String(einbruch.jahr)
        ? `Der Crash von ${einbruch.jahr}`
        : einbruch.name,
    art: 'einbruch',
    was,
    lehre,
    genauigkeit: 'naeherung',
    einbruch: {
      rueckgangProzent: einbruch.rueckgangProzent,
      erholungJahre: einbruch.erholungJahre,
    },
    glossar: ['index', 'volatilitaet'],
  }
}

/**
 * Die Prosa zu jedem Einbruch, nach Jahr.
 *
 * Getrennt von `data/crashes.ts`, weil dort Zahlen stehen und hier Sätze.
 * Fehlt zu einem Einbruch ein Eintrag, fällt er nicht still weg – der Test
 * beanstandet es, und `zeitstrahl()` nimmt ihn mit der Auslöserzeile auf.
 */
const EINBRUCHSTEXTE: Record<number, { was: string; lehre: string }> = {
  1929: {
    was: 'Auf Jahre steigender Kurse und Käufe auf Kredit folgte ein Einbruch, der nicht nur die Börse traf: Banken schlossen, die Realwirtschaft brach ein, und die Erholung fiel mit einem Weltkrieg zusammen.',
    lehre:
      'Der einzige Fall auf diesem Strahl, in dem „aussitzen“ für einen Menschen keine praktikable Antwort war. Wer 1929 zum Höchststand kaufte, sah den Stand als Rentner wieder.',
  },
  1987: {
    was: 'An einem einzigen Handelstag im Oktober fielen die Kurse um rund ein Fünftel – ohne dass ein Anlass zu benennen wäre. Automatisierte Absicherungsprogramme verkauften, weil die Kurse fielen, und die Kurse fielen, weil verkauft wurde.',
    lehre:
      'Der dramatischste Tag dieses Strahls war nach zwei Jahren erledigt. Die Schlagzeile misst nicht den Schaden.',
  },
  2000: {
    was: 'Technologiewerte waren nach Umsatzvielfachen bewertet worden, weil viele noch keinen Gewinn hatten. Als das Kapital ausblieb, verschwanden Unternehmen ganz – nicht nur ihre Kurse.',
    lehre:
      'Der Index kam zurück, viele einzelne Werte nie. Für Indizes gilt „der Markt erholt sich“, für einzelne Aktien gilt es nicht.',
  },
  2008: {
    was: 'Immobilienkredite waren gebündelt, weiterverkauft und als sicher bewertet worden. Als die Kette riss, war unklar, welche Bank welchen Teil hielt – und Banken liehen einander nichts mehr.',
    lehre:
      'Der Auslöser lag nicht an der Börse, sondern in der Buchhaltung. Was gestreut aussah, war es nicht: Alles hing an derselben Annahme über Hauspreise.',
  },
  2020: {
    was: 'Innerhalb weniger Wochen stellten Staaten das öffentliche Leben ein. Der Rückgang war der schnellste dieses Strahls, die Erholung ebenfalls – gestützt von Notenbanken und Staatshaushalten in einer Größenordnung ohne Beispiel.',
    lehre:
      'Der zweittiefste Fall dieser Liste war der kürzeste. Wer im März verkaufte, hatte im September einen Verlust festgeschrieben, den das Halten nicht gehabt hätte.',
  },
}

/**
 * Alle Punkte, nach Jahr sortiert.
 *
 * Bei gleichem Jahr entscheidet die Art, damit die Reihenfolge nicht davon
 * abhängt, in welcher Datei ein Eintrag zufällig steht.
 */
export function zeitstrahl(): Zeitpunkt[] {
  const ausEinbruechen = kurseinbrueche.map((einbruch) => {
    const text = EINBRUCHSTEXTE[einbruch.jahr]
    return ausEinbruch(
      einbruch,
      text?.was ?? `Auslöser: ${einbruch.ausloeser}.`,
      text?.lehre ??
        'Wie lange die Erholung dauerte, sagt mehr über den Schaden als die Falltiefe.'
    )
  })

  const ausEreignissen = GESCHICHTSEREIGNISSE.map((ereignis: Ereignis): Zeitpunkt => ({
    ...ereignis,
  }))

  return [...ausEinbruechen, ...ausEreignissen].sort(
    (a, b) => a.jahr - b.jahr || a.art.localeCompare(b.art) || a.id.localeCompare(b.id)
  )
}

/** Die Punkte eines Jahrhunderts – für die Gliederung der Seite. */
export function nachJahrhundert(punkte: readonly Zeitpunkt[]): {
  jahrhundert: number
  label: string
  punkte: Zeitpunkt[]
}[] {
  const gruppen = new Map<number, Zeitpunkt[]>()
  for (const punkt of punkte) {
    const jh = Math.floor(punkt.jahr / 100) * 100
    gruppen.set(jh, [...(gruppen.get(jh) ?? []), punkt])
  }

  return [...gruppen.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([jahrhundert, eintraege]) => ({
      jahrhundert,
      label: `${jahrhundert} bis ${jahrhundert + 99}`,
      punkte: eintraege,
    }))
}

export interface Erholungsbefund {
  /** Der tiefste Einbruch des Bestands. */
  tiefster: Kurseinbruch
  /** Der längste – nicht notwendig derselbe. */
  laengster: Kurseinbruch
  /** Der schnellste. */
  schnellster: Kurseinbruch
  /**
   * Zwei Fälle mit gleicher Falltiefe und ungleicher Dauer, falls es sie gibt.
   *
   * Das ist der stärkste Beleg der Seite: Bei identischem Rückgang unterscheidet
   * sich die Erholung – dann kann die Tiefe die Dauer nicht bestimmen.
   */
  gleicheTiefe: { a: Kurseinbruch; b: Kurseinbruch } | null
  /**
   * Trifft „tiefer heißt länger“ auf den Bestand zu?
   *
   * Geprüft wird die Ordnung, nicht ein Zusammenhangsmaß: Bei fünf Fällen
   * wäre eine Korrelation eine Zahl mit drei Nachkommastellen und ohne
   * Aussagekraft – ein Mittelwert kann nichts finden, was er verdünnt.
   */
  tiefeBestimmtDauer: boolean
}

/**
 * Was die Einbrüche über den Zusammenhang von Tiefe und Dauer hergeben.
 *
 * Gerechnet und nicht behauptet: Wenn ein Fall dazukommt, ändert sich die
 * Aussage der Seite mit. Die Lehre „nicht die Tiefe zählt, sondern die Dauer“
 * steht damit nicht als Meinung da, sondern als Auswertung.
 */
export function erholungsbefund(
  einbrueche: readonly Kurseinbruch[] = kurseinbrueche
): Erholungsbefund | null {
  if (einbrueche.length < 2) return null

  const nachTiefe = [...einbrueche].sort(
    (a, b) => b.rueckgangProzent - a.rueckgangProzent
  )
  const nachDauer = [...einbrueche].sort((a, b) => b.erholungJahre - a.erholungJahre)

  let gleicheTiefe: { a: Kurseinbruch; b: Kurseinbruch } | null = null
  for (let i = 0; i < einbrueche.length; i++) {
    for (let j = i + 1; j < einbrueche.length; j++) {
      const a = einbrueche[i]
      const b = einbrueche[j]
      if (
        a.rueckgangProzent === b.rueckgangProzent &&
        a.erholungJahre !== b.erholungJahre
      ) {
        gleicheTiefe = { a, b }
        break
      }
    }
    if (gleicheTiefe) break
  }

  /*
    „Tiefer heißt länger“ hieße: dieselbe Reihenfolge in beiden Spalten.
    Ein einziger Platztausch widerlegt den Satz – und mehr braucht es nicht,
    weil der Satz als Regel auftritt und nicht als Tendenz.
  */
  const tiefeBestimmtDauer = nachTiefe.every(
    (einbruch, index) => nachDauer[index]?.jahr === einbruch.jahr
  )

  return {
    tiefster: nachTiefe[0],
    laengster: nachDauer[0],
    schnellster: nachDauer[nachDauer.length - 1],
    gleicheTiefe,
    tiefeBestimmtDauer,
  }
}

/** Die Dauer als Text – halbe Jahre kommen vor, „0,5 Jahre“ liest sich schlecht. */
export function dauerText(jahre: number): string {
  if (jahre < 1) {
    const monate = Math.round(jahre * 12)
    return monate === 1 ? 'ein Monat' : `${monate} Monate`
  }
  if (jahre === 1) return 'ein Jahr'
  return `${jahre.toLocaleString('de-DE')} Jahre`
}
