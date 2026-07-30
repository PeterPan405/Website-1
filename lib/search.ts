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

import { getAlleLektionen, getBereiche } from '@/lib/akademie'
import { getEditions } from '@/lib/editions'
import { formatDate, formatNumber } from '@/lib/format'
import { getLaender } from '@/lib/laender'
import { getLearnTopics } from '@/lib/learn'
import { learnLevelIds, learnLevelMeta } from '@/lib/learn'
import { getInstruments, STIMMUNG_SEITEN } from '@/lib/markets'
import { calculators } from '@/data/calculators'
import { getGlossar } from '@/lib/glossar'
import { getLernpfade } from '@/lib/lernpfade'
import { getNewsArticles } from '@/lib/news'
import { folgenAdresse, getFolgen, kurzfassung } from '@/lib/podcast'
import { rubriken } from '@/lib/rubriken'
import { getBranchen } from '@/lib/branchen'
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
    title: 'Börsenkalender',
    href: '/kalender',
    kind: 'Plattform',
    hint: 'Zinsentscheide, Berichtssaison, Verfallstage, Börsenfeiertage und Wahlen mit Einordnung.',
    keywords: [
      'kalender',
      'termine',
      'zinsentscheid',
      'ezb',
      'fed',
      'verfallstag',
      'hexensabbat',
      'boersenfeiertag',
      'quartalszahlen',
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
    title: 'Quellen',
    href: '/quellen',
    kind: 'Rechtliches',
    hint: 'Woher die Zahlen kommen – alle Datenquellen an einer Stelle.',
    keywords: ['quellen', 'daten', 'herkunft', 'nachweis', 'lizenz'],
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
  const [themen, instrumente, artikel, ausgaben, laender] = await Promise.all([
    getLearnTopics(),
    getInstruments(),
    getNewsArticles(),
    getEditions(),
    getLaender(),
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

  eintraege.push({
    title: 'Korrekturen',
    href: '/news/korrekturen',
    kind: 'Bereich',
    hint: 'Was nach der Veröffentlichung an Artikeln geändert wurde und warum.',
    keywords: ['korrektur', 'fehler', 'berichtigung', 'aktualisiert', 'transparenz'],
  })

  eintraege.push({
    title: 'Startseite',
    href: '/',
    kind: 'Bereich',
    hint: 'Der Einstieg: Kurse, Nachrichten, Lernbereich, Akademie, Rechner und der Globus auf einen Blick.',
    keywords: ['start', 'startseite', 'home', 'uebersicht', 'im invests'],
  })

  eintraege.push({
    title: 'Alle Erklärgrafiken',
    href: '/lernen/grafiken',
    kind: 'Bereich',
    hint: 'Über hundert eigene Zeichnungen an einer Stelle – zum Wiederfinden und zum Durchsehen.',
    keywords: ['grafik', 'grafiken', 'zeichnung', 'bild', 'schaubild', 'erklaergrafik'],
  })

  eintraege.push({
    title: 'Lernpfade',
    href: '/lernen/pfade',
    kind: 'Bereich',
    hint: 'Geführte Reihenfolgen durch den Lernbereich – für alle, die nicht wissen, womit sie anfangen sollen.',
    keywords: ['lernpfad', 'pfad', 'reihenfolge', 'kurs', 'einstieg', 'gefuehrt'],
  })

  /*
    Die beiden Stimmungsseiten.

    Sie hatten keinen Eintrag, obwohl „Angst und Gier“ zu den Begriffen gehört,
    unter denen am ehesten gesucht wird. Aufgefallen ist das erst, als jede
    gebaute Seite gegen den Index gehalten wurde – die Suche zu benutzen und
    zufrieden zu sein, hätte es nie gezeigt.
  */
  for (const [bereich, meta] of Object.entries(STIMMUNG_SEITEN)) {
    eintraege.push({
      title: meta.titel,
      href: `/maerkte/stimmung/${bereich}`,
      kind: 'Plattform',
      hint: meta.lead,
      keywords: [...meta.stichworte],
    })
  }

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

  /*
    3. Rechner – aus ihrer eigenen Liste.

    Hier standen sie abgetippt, und wie in der Sitemap war die Kopie irgendwann
    veraltet: Kosten-, Steuerrechner und Vermögensübersicht gab es längst, in
    der Suche fanden sie sich nicht. Die Suchbegriffe entstehen aus den
    verwandten Lernthemen – dieselben Wörter, unter denen jemand sucht.
  */
  /*
    Die Akademie: erst die beiden Bereiche, dann jede Lektion.

    Die Stichworte einer Lektion sind genau die Wörter, unter denen jemand
    sucht – „MACD“, „Widerstand“, „KGV“. Sie stehen deshalb ohne Umweg als
    Suchbegriffe im Index; der Titel allein würde „überkauft“ nicht finden.
  */
  for (const bereich of getBereiche()) {
    eintraege.push({
      title: bereich.titel,
      href: `/akademie/${bereich.id}`,
      kind: 'Akademie',
      hint: bereich.kurz,
    })
  }

  for (const lektion of getAlleLektionen()) {
    eintraege.push({
      title: lektion.titel,
      href: `/akademie/${lektion.bereich}/${lektion.slug}`,
      kind: 'Akademie',
      hint: lektion.kurz,
      keywords: [lektion.slug, ...lektion.stichworte],
    })
  }

  for (const rechner of calculators) {
    eintraege.push({
      title: rechner.title,
      href: `/rechner/${rechner.slug}`,
      kind: 'Rechner',
      hint: rechner.summary,
      keywords: [rechner.slug, ...rechner.relatedTopics],
    })
  }

  /*
    3a2. Branchen.

    Der häufigste Weg zu einer Branchenseite dürfte die Suche sein: Wer
    „Halbleiter“ eintippt, meint keine einzelne Aktie, sondern die Gruppe. Die
    Übersicht steht als eigener Eintrag daneben, sonst fände man sie nur über
    einen Umweg – sie heißt nicht wie eine Branche.
  */
  eintraege.push({
    title: 'Das Tagesbild',
    href: '/maerkte/tagesbild',
    kind: 'Bereich',
    hint: 'Wie viele Aktien heute steigen, welche Branche vorn liegt, wie breit die Bewegung ist',
    keywords: ['tagesbild', 'marktbericht', 'breite', 'gewinner', 'verlierer', 'heute'],
  })
  eintraege.push({
    title: 'Zwei Aktien vergleichen',
    href: '/maerkte/vergleich',
    kind: 'Bereich',
    hint: 'Zwei Titel nebeneinander – mit der Angabe, welche Gegenüberstellung etwas bedeutet',
    keywords: [
      'vergleich',
      'vergleichen',
      'gegenueberstellung',
      'besser',
      'welche aktie',
      'duell',
    ],
  })
  eintraege.push({
    title: 'Dividenden im Überblick',
    href: '/maerkte/dividenden',
    kind: 'Bereich',
    hint: 'Wer zahlt wie viel, in welchem Rhythmus und seit wann ohne Kürzung',
    keywords: [
      'dividende',
      'dividenden',
      'ausschuettung',
      'rendite',
      'dividendenrendite',
      'quartalsdividende',
      'auszahlung',
    ],
  })
  eintraege.push({
    title: 'Merkliste',
    href: '/maerkte/merkliste',
    kind: 'Bereich',
    hint: 'Titel im Blick behalten – gespeichert allein in diesem Browser',
    keywords: ['merkliste', 'merken', 'watchlist', 'beobachten', 'favoriten'],
  })
  eintraege.push({
    title: 'Aktien nach Branchen',
    href: '/maerkte/branchen',
    kind: 'Bereich',
    hint: `${getBranchen().length} Branchen, in denen die hier geführten Aktien zusammengefasst sind`,
    keywords: ['branche', 'branchen', 'sektor', 'sektoren', 'industrie'],
  })
  for (const branche of getBranchen()) {
    eintraege.push({
      title: branche.name,
      href: `/maerkte/branchen/${branche.slug}`,
      kind: 'Branche',
      hint: `${branche.aktien.length} Aktien · ${branche.aktien
        .slice(0, 3)
        .map((aktie) => aktie.name)
        .join(', ')} und weitere`,
      keywords: ['branche', 'sektor', branche.slug],
    })
  }

  // 3b. Lernpfade – die geführten Wege durch den Lernbereich.
  for (const pfad of await getLernpfade()) {
    eintraege.push({
      title: `Lernpfad: ${pfad.titel}`,
      href: `/lernen/pfade/${pfad.slug}`,
      kind: 'Lernpfad',
      hint: pfad.kurz,
      keywords: ['lernpfad', 'pfad', pfad.slug],
    })
  }

  /*
    3c. Glossarbegriffe.

    Jeder Begriff einzeln, mit Sprungmarke: Wer „Vorabpauschale“ sucht, will
    nicht die Glossarseite, sondern die Stelle darauf. Die Kurzerklärung steht
    als Hinweis darunter – oft ist die Frage damit schon beantwortet, ohne dass
    jemand klicken muss.
  */
  for (const begriff of await getGlossar()) {
    eintraege.push({
      title: begriff.begriff,
      href: `/glossar#${begriff.slug}`,
      kind: 'Begriff',
      hint: begriff.kurz,
      keywords: [
        begriff.slug,
        ...(begriff.formen ?? []).map((form) => form.toLowerCase()),
      ],
    })
  }

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

  /*
    5. Länder.

    Wer „Indonesien“ in die Lupe tippt, sucht Indonesien – und nicht eine
    Nachricht, in der das Wort vorkommt. Bis eben fand die Suche nichts: Die
    Länder standen nur auf dem Globus, und der war ein einziger Eintrag.

    Das Ziel ist deshalb nicht `/globus`, sondern `/globus#land-360`. Die
    Globusansicht liest diese Raute, wählt das Land aus und dreht die Kugel
    dorthin – dasselbe Ergebnis wie ein Klick auf die Fläche.

    Ohne Datenlage kein Eintrag: Ein Gebiet wie die Heard-Insel, zu dem weder
    Zahlen noch Kurse vorliegen, wäre in der Trefferliste ein leeres
    Versprechen. Auf dem Globus bleibt es anklickbar, dort steht es im
    räumlichen Zusammenhang.
  */
  for (const land of laender) {
    const kurse = land.indizes.length + land.aktien.length
    const hatZahlen = Boolean(land.bipUsd || land.einwohner)
    if (!hatZahlen && kurse === 0) continue

    const teile = [
      land.region,
      // Unter einer Million bliebe von „0 Mio.“ nichts übrig – Monaco hat
      // 38.000 Einwohner, und die stehen dann ausgeschrieben da.
      land.einwohner
        ? land.einwohner >= 1_000_000
          ? `${formatNumber(Math.round(land.einwohner / 1_000_000))} Mio. Einwohner`
          : `${formatNumber(land.einwohner)} Einwohner`
        : null,
      kurse > 0 ? `${kurse} ${kurse === 1 ? 'Kurs' : 'Kurse'} von hier` : null,
    ].filter(Boolean)

    eintraege.push({
      title: land.name,
      href: `/globus#land-${land.id}`,
      kind: 'Land',
      hint: teile.join(' · '),
      keywords: [land.alpha2, land.waehrung, 'globus', 'land'].filter(
        (wert): wert is string => Boolean(wert)
      ),
    })
  }

  // 6. Nachrichten und Tagesausgaben.
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

  /*
    Der Podcast: die Übersicht und jede Folge einzeln.

    Der Grund, warum die Folgen überhaupt im Bestand liegen, ist genau dieser
    Eintrag – gesucht wird nach dem Titel einer Folge, an die man sich erinnert.
    Solange keine Feed-Adresse hinterlegt ist, bleibt es beim Übersichtseintrag;
    er beantwortet die Frage „gibt es einen Podcast?“ auch dann.
  */
  const folgen = getFolgen()
  eintraege.push({
    title: 'Der Podcast',
    href: '/podcast',
    kind: 'Bereich',
    hint:
      folgen.length > 0
        ? `${folgen.length} Folgen zum Hören – mit Titel, Datum und Inhalt zum Nachlesen`
        : 'Dieselben Themen wie hier, nur gesprochen – und wo sie zu hören sind',
    keywords: ['podcast', 'folge', 'folgen', 'hoeren', 'audio', 'spotify'],
  })
  for (const folge of folgen) {
    eintraege.push({
      title: folge.titel,
      href: folgenAdresse(folge),
      kind: 'Podcastfolge',
      hint: folge.beschreibung ? kurzfassung(folge.beschreibung) : folge.datum,
      keywords: ['podcast', 'folge', folge.datum],
    })
  }

  for (const rubrik of rubriken) {
    eintraege.push({
      title: `${rubrik.name} – Nachrichten`,
      href: `/news/rubrik/${rubrik.slug}`,
      kind: 'Bereich',
      hint: rubrik.beschreibung,
      keywords: ['rubrik', 'kategorie', rubrik.slug],
    })
  }

  eintraege.push(...seiten)

  return eintraege
}
