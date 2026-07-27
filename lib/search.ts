/**
 * Baut den Suchindex aus den Inhalten der Website.
 *
 * Läuft beim Bauen, nicht im Browser: Die Website wird statisch ausgeliefert,
 * es gibt keinen Server, der eine Suchanfrage beantworten könnte. Das Ergebnis
 * dieser Funktion reicht das Root-Layout an die Kopfzeile durch, von dort
 * durchsucht es `lib/search-match.ts` im Browser.
 *
 * Die Reihenfolge der Abschnitte ist bewusst gesetzt: Bei gleicher Bewertung
 * gewinnt der frühere Eintrag, deshalb stehen die Bereichsseiten vor den
 * einzelnen Themen und diese vor den Unterseiten.
 */

import { getEditions } from '@/lib/editions'
import { formatDate } from '@/lib/format'
import { getLearnTopics } from '@/lib/learn'
import { learnLevelIds, learnLevelMeta } from '@/lib/learn'
import { getInstruments } from '@/lib/markets'
import { getNewsArticles } from '@/lib/news'
import type { SearchEntry } from '@/lib/search-match'
import { areas } from '@/lib/site'

export type { SearchEntry }

/** Feste Seiten ohne eigene Datenquelle. */
const seiten: SearchEntry[] = [
  {
    title: 'Globus',
    href: '/globus',
    kind: 'Plattform',
    hint: 'Weltwirtschaft zum Drehen: BIP, Einwohner, Wohlstand und Schulden je Land – und die Kurse, die von dort kommen.',
    keywords: [
      'globus',
      'weltkarte',
      'laender',
      'weltwirtschaft',
      'bip',
      'einwohner',
      'karte',
    ],
  },
  {
    title: 'Über uns',
    href: '/ueber-uns',
    kind: 'Plattform',
    hint: 'Wer hinter IM Invests steht und wie die Inhalte entstehen.',
    keywords: ['redaktion', 'team', 'ueber uns'],
  },
  {
    title: 'Unternehmensphilosophie',
    href: '/unternehmensphilosophie',
    kind: 'Plattform',
    hint: 'Grundsätze der redaktionellen Arbeit.',
    keywords: ['leitbild', 'werte', 'philosophie'],
  },
  {
    title: 'Kontakt',
    href: '/kontakt',
    kind: 'Plattform',
    hint: 'Korrekturen, Themenwünsche und Fragen zur Plattform.',
    keywords: ['email', 'telefon', 'schreiben', 'anrufen'],
  },
  {
    title: 'Impressum',
    href: '/impressum',
    kind: 'Rechtliches',
    hint: 'Anbieterkennzeichnung nach § 5 DDG.',
    keywords: ['anbieter', 'anschrift', 'rechtliches'],
  },
  {
    title: 'Datenschutz',
    href: '/datenschutz',
    kind: 'Rechtliches',
    hint: 'Wie mit Daten umgegangen wird.',
    keywords: ['dsgvo', 'daten', 'rechtliches'],
  },
]

export async function buildSearchIndex(): Promise<SearchEntry[]> {
  const [themen, instrumente, artikel, ausgaben] = await Promise.all([
    getLearnTopics(),
    getInstruments(),
    getNewsArticles(),
    getEditions(),
  ])

  const eintraege: SearchEntry[] = []

  // 1. Die Bereichsseiten – der wahrscheinlichste Einstieg.
  for (const bereich of Object.values(areas)) {
    eintraege.push({
      title: bereich.label,
      href: bereich.href,
      kind: 'Bereich',
      hint: bereich.description,
    })
  }

  eintraege.push({
    title: 'Tagesüberblick',
    href: '/news/tag',
    kind: 'Bereich',
    hint: 'Alle bisherigen Ausgaben, nach Monaten gruppiert.',
    keywords: ['ausgabe', 'archiv', 'morgen'],
  })

  // 2. Lernthemen vor ihren einzelnen Stufen.
  for (const thema of themen) {
    eintraege.push({
      title: thema.title,
      href: `/lernen/${thema.slug}`,
      kind: 'Lernthema',
      hint: thema.lead,
      keywords: thema.keywords,
    })
  }

  for (const thema of themen) {
    for (const stufe of learnLevelIds) {
      eintraege.push({
        title: `${thema.title} – ${learnLevelMeta[stufe].label}`,
        href: `/lernen/${thema.slug}/${stufe}`,
        kind: 'Lernstufe',
        hint: learnLevelMeta[stufe].promise,
        keywords: thema.keywords,
      })
    }
  }

  // 3. Rechner. Nicht aus einer Datenquelle, sondern eigene Seiten – deshalb
  //    hier ausgeschrieben, mit den Begriffen, unter denen man sie sucht.
  eintraege.push(
    {
      title: 'Zinsrechner',
      href: '/rechner/zinsrechner',
      kind: 'Rechner',
      hint: 'Zinseszins mit Sparplan – zeigt, wie viel vom Ergebnis aus Erträgen stammt.',
      keywords: ['zinseszins', 'sparplan', 'rendite', 'zinsen'],
    },
    {
      title: 'Inflationsrechner',
      href: '/rechner/inflationsrechner',
      kind: 'Rechner',
      hint: 'Was von einem Betrag nach Jahren an Kaufkraft übrig bleibt.',
      keywords: ['inflation', 'kaufkraft', 'geldentwertung'],
    },
    {
      title: 'Rentenrechner',
      href: '/rechner/rentenrechner',
      kind: 'Rechner',
      hint: 'Grobe Schätzung des Alterseinkommens über Rentenpunkte.',
      keywords: ['rente', 'rentenpunkte', 'altersvorsorge'],
    },
    {
      title: 'Rentenlücke',
      href: '/rechner/rentenluecke',
      kind: 'Rechner',
      hint: 'Bedarf gegen Erwartung – und die nötige monatliche Sparrate.',
      keywords: ['rentenluecke', 'vorsorge', 'sparrate'],
    },
    {
      title: 'Haushaltsrechner',
      href: '/rechner/haushaltsrechner',
      kind: 'Rechner',
      hint: 'Einnahmen, Ausgaben und deine tatsächliche Sparquote.',
      keywords: ['budget', 'haushalt', 'sparquote', 'ausgaben'],
    }
  )

  // 4. Kurse und Indizes.
  for (const instrument of instrumente) {
    eintraege.push({
      title: instrument.name,
      href: `/maerkte/${instrument.symbol}`,
      kind: 'Kurs',
      hint: instrument.ticker,
      keywords: [instrument.ticker, instrument.symbol],
    })
  }

  // 5. Nachrichten und Tagesausgaben.
  for (const beitrag of artikel) {
    eintraege.push({
      title: beitrag.title,
      href: `/news/${beitrag.slug}`,
      kind: 'News',
      hint: beitrag.teaser,
    })
  }

  for (const ausgabe of ausgaben) {
    eintraege.push({
      title: `Tagesüberblick vom ${formatDate(ausgabe.date)}`,
      href: `/news/tag/${ausgabe.date}`,
      kind: 'Tagesüberblick',
      hint: ausgabe.intro,
      keywords: [ausgabe.date],
    })
  }

  eintraege.push(...seiten)

  return eintraege
}
