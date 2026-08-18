import { IRRTUEMER } from '@/data/irrtuemer'
import { VERWECHSLUNGEN } from '@/data/verwechslungen'
import { getLearnTopics } from '@/lib/learn'
import { getLernpfade } from '@/lib/lernpfade'
import { getFolgen } from '@/lib/podcast'
import { learnLevelIds, learnLevelMeta } from '@/data/learn/types'
import { minutenAusSekunden, type Vorschlag } from '@/lib/zeitbudget'

/**
 * Woraus die Vorschläge nach Zeit entstehen.
 *
 * Getrennt von `lib/zeitbudget.ts`, weil dort keine Importe stehen dürfen –
 * der Test lädt das Modul direkt.
 *
 * ## Die Regel für die Dauern
 *
 * **Gemessen wird nur, was in den Daten steht.** `readingMinutes` einer
 * Lernstufe, `dauerSekunden` einer Podcastfolge, die aufsummierte Lesezeit
 * eines Lernpfads. Alles andere bekommt `offen` und keine Zahl.
 *
 * Ein Irrtum mit seiner Rechnung ist offensichtlich kürzer als fünf Minuten,
 * und ein Verwechslungspaar auch – nur weiß niemand, um wie viel. Eine
 * geschätzte „2 Minuten" wäre auf einer Seite, die Zeitangaben verspricht,
 * genau die Zahl, der man glaubt.
 */
export async function alleVorschlaege(): Promise<Vorschlag[]> {
  const [themen, pfade] = await Promise.all([getLearnTopics(), getLernpfade()])
  const vorschlaege: Vorschlag[] = []

  /*
    Podcastfolgen – die einzigen gemessenen Stücke unter fünf Minuten.

    Nur die jüngsten drei: Eine Folge ist eine Tagesausgabe, und wer fünf
    Minuten hat, will die von heute und nicht die vom März.
  */
  for (const folge of getFolgen().slice(0, 3)) {
    /*
      Ohne hinterlegte Länge kein Vorschlag.

      `dauerSekunden` ist `number | null` – bei einer Folge, deren Datei noch
      nicht vermessen ist, steht dort nichts. Sie hier mit einer angenommenen
      Länge einzusetzen wäre auf dieser Seite der Fehler, um den es geht.
    */
    if (folge.dauerSekunden === null) continue

    vorschlaege.push({
      id: `podcast-${folge.slug}`,
      titel: folge.titel,
      hinweis: 'Die Marktlage des Tages, vertont.',
      href: `/podcast#${folge.slug}`,
      herkunft: 'Podcastfolge',
      dauer: { art: 'gemessen', minuten: minutenAusSekunden(folge.dauerSekunden) },
    })
  }

  /*
    Lernstufen. Jede trägt ihre eigene Lesezeit – deshalb landen sie von selbst
    im richtigen Fenster, ohne dass hier jemand sortiert.
  */
  for (const thema of themen) {
    for (const stufe of learnLevelIds) {
      const ebene = thema.levels[stufe]
      vorschlaege.push({
        id: `stufe-${thema.slug}-${stufe}`,
        titel: `${thema.title} – ${learnLevelMeta[stufe].label}`,
        hinweis: ebene.lead ?? learnLevelMeta[stufe].promise,
        href: `/lernen/${thema.slug}/${stufe}`,
        herkunft: 'Lernstufe',
        dauer: { art: 'gemessen', minuten: ebene.readingMinutes },
      })
    }
  }

  /*
    Ein ganzes Thema – alle drei Stufen zusammen.

    Ohne diesen Eintrag füllte das Stunden-Fenster niemand: Die längste
    Lernstufe braucht 15 Minuten, der kürzeste Lernpfad 70. Zwischen beiden
    klaffte eine Lücke, und die Seite bot in der Stunde exakt dieselbe Liste an
    wie in der Viertelstunde – sichtbar erst im gebauten HTML, weil beide
    Abschnitte für sich betrachtet richtig aussahen.

    Ein Thema über alle drei Stufen liegt bei 33 bis 44 Minuten und ist damit
    genau das, was in eine Stunde passt.
  */
  for (const thema of themen) {
    const minuten = learnLevelIds.reduce(
      (summe, stufe) => summe + thema.levels[stufe].readingMinutes,
      0
    )
    vorschlaege.push({
      id: `thema-${thema.slug}`,
      titel: `${thema.title} – alle drei Stufen`,
      hinweis: thema.lead,
      href: `/lernen/${thema.slug}`,
      herkunft: 'Lernthema',
      dauer: { art: 'gemessen', minuten },
    })
  }

  /*
    Lernpfade – die Summe ihrer Stufen, ohne die Rechner.

    Ohne die Rechner, weil deren Dauer niemand kennt: Man sitzt eine Minute
    davor oder zwanzig. Der Pfad ist damit eher zu kurz als zu lang
    angegeben – die richtige Richtung für eine Zusage.
  */
  for (const pfad of pfade) {
    vorschlaege.push({
      id: `pfad-${pfad.slug}`,
      titel: pfad.titel,
      hinweis: pfad.lead,
      href: `/lernen/pfade/${pfad.slug}`,
      herkunft: 'Lernpfad',
      dauer: { art: 'gemessen', minuten: pfad.lesezeit },
    })
  }

  /*
    Und das, was keine hinterlegte Dauer hat.

    Je einer, nicht alle: Diese Seiten sind Sammlungen, und der Vorschlag lautet
    „geh dorthin und sieh dich um", nicht „lies alle 35 Irrtümer".
  */
  if (IRRTUEMER.length > 0) {
    vorschlaege.push({
      id: 'irrtuemer',
      titel: 'Ein Satz, der so nicht stimmt',
      hinweis: `${IRRTUEMER.length} verbreitete Irrtümer, jeder mit der Rechnung daneben.`,
      href: '/irrtuemer',
      herkunft: 'Richtigstellungen',
      dauer: { art: 'offen', hinweis: 'einer reicht' },
    })
  }

  if (VERWECHSLUNGEN.length > 0) {
    vorschlaege.push({
      id: 'verwechslungen',
      titel: 'Zwei Begriffe nebeneinander',
      hinweis: `${VERWECHSLUNGEN.length} Paare, die im Alltag durcheinandergehen – mit dem Satz zum Unterscheiden.`,
      href: '/verwechslungen',
      herkunft: 'Verwechslungspaare',
      dauer: { art: 'offen', hinweis: 'ein Paar reicht' },
    })
  }

  vorschlaege.push({
    id: 'glossar',
    titel: 'Ein Begriff aus dem Glossar',
    hinweis: 'Jeder in einem Satz erklärt – und der Satz trägt allein.',
    href: '/glossar',
    herkunft: 'Glossar',
    dauer: { art: 'offen', hinweis: 'so lange, wie man liest' },
  })

  return vorschlaege
}
