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
import { formatDate, formatMonthYearLong, formatNumber } from '@/lib/format'
import { getLaender } from '@/lib/laender'
import { getLearnTopics } from '@/lib/learn'
import { learnLevelIds, learnLevelMeta } from '@/lib/learn'
import { getInstruments, STIMMUNG_SEITEN } from '@/lib/markets'
import { calculators } from '@/data/calculators'
import { IRRTUEMER } from '@/data/irrtuemer'
import { zeitstrahl } from '@/lib/finanzgeschichte'
import { themenMitKarten } from '@/lib/lernkarten-daten'
import { getGlossar } from '@/lib/glossar'
import { getLernpfade } from '@/lib/lernpfade'
import { getRueckblickJahre } from '@/lib/jahresrueckblick-daten'
import { getNewsArticles, getNewsByMonth } from '@/lib/news'
import { straenge } from '@/lib/nachrichtenstrang'
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
    title: 'Unsere Philosophie',
    href: '/unternehmensphilosophie',
    kind: 'Plattform',
    hint: 'Grundsätze der redaktionellen Arbeit.',
    keywords: ['leitbild', 'werte', 'philosophie', 'unternehmensphilosophie'],
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
  {
    title: 'Datenumzug: deinen Stand mitnehmen',
    href: '/umzug',
    kind: 'Plattform',
    hint: 'Lernstand, Merkliste und Vermögensübersicht als Datei aufs nächste Gerät – ohne Konto.',
    keywords: ['umzug', 'sichern', 'übertragen', 'backup', 'export', 'gerät', 'konto'],
  },
  {
    title: 'Wochenrückblick der Märkte',
    href: '/news/woche',
    kind: 'News',
    hint: 'Die letzte Handelswoche in Zahlen samt Zahl der Woche – gerechnet, nicht geschrieben.',
    keywords: ['woche', 'wochenrückblick', 'rückblick', 'zahl der woche'],
  },
  {
    title: 'Das 30-Tage-Programm',
    href: '/lernen/30-tage',
    kind: 'Lernwerkzeug',
    hint: 'Eine Tagesportion Finanzwissen, vier Wochen lang – aus Lernstufen und Rechnern.',
    keywords: ['30 tage', 'programm', 'einsteiger', 'plan', 'rhythmus', 'kurs'],
  },
  {
    title: 'Glossar-Karteikarten',
    href: '/glossar/karteikarten',
    kind: 'Lernwerkzeug',
    hint: 'Die Fachbegriffe als Karteikasten mit wachsenden Abständen.',
    keywords: ['karteikarten', 'karteikasten', 'vokabeln', 'wiederholen', 'leitner'],
  },
  {
    title: 'Keine Cookies, kein Tracking',
    href: '/keine-cookies',
    kind: 'Rechtliches',
    hint: 'Warum es hier kein Zustimmungsbanner gibt – und wie du das nachprüfst.',
    keywords: ['cookies', 'tracking', 'privatsphäre', 'banner', 'analyse', 'daten'],
  },
  {
    title: 'Barrierefreiheit',
    href: '/barrierefreiheit',
    kind: 'Rechtliches',
    hint: 'Wie Zugänglichkeit geprüft wird und wohin man Barrieren meldet.',
    keywords: ['barriere', 'zugänglich', 'wcag', 'vorlesen', 'tastatur', 'kontrast'],
  },
]

export async function buildSearchIndex(): Promise<SearchEntry[]> {
  const [themen, instrumente, artikel, ausgaben, laender, jahrgaenge] = await Promise.all(
    [
      getLearnTopics(),
      getInstruments(),
      getNewsArticles(),
      getEditions(),
      getLaender(),
      getRueckblickJahre(),
    ]
  )

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
    title: 'Monatsarchiv der Nachrichten',
    href: '/news/monat',
    kind: 'Bereich',
    hint: 'Alle Monate, in denen Artikel erschienen sind – von heute rückwärts.',
    keywords: ['monat', 'archiv', 'monatsarchiv'],
  })

  /*
    Jeder Monat einzeln.

    Wie bei den Jahrgängen des Rückblicks ist die Eingabe das Datum, nicht das
    Wort: Wer „August 2026" tippt, sucht diesen Monat. Die Seiten entstehen
    ohnehin je Monat – ohne Eintrag hier wären sie gebaut, verlinkt und
    unauffindbar, und die Paketprüfung meldet genau das.
  */
  for (const { monat, artikel } of await getNewsByMonth()) {
    eintraege.push({
      title: `Nachrichten aus ${formatMonthYearLong(`${monat}-01`)}`,
      href: `/news/monat/${monat}`,
      kind: 'News',
      hint: `${artikel.length} ${artikel.length === 1 ? 'Artikel' : 'Artikel'} aus diesem Monat.`,
      keywords: [monat, 'monat', 'archiv'],
    })
  }

  eintraege.push({
    title: 'Jahresrückblick',
    href: '/news/jahr',
    kind: 'Bereich',
    hint: 'Was jedes Jahr an den Märkten brachte – gerechnet aus den Kursreihen.',
    keywords: ['jahr', 'jahresbilanz', 'bilanz', 'rueckblick', 'jahresrendite'],
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
    title: 'Dein Lernstand',
    href: '/lernen/stand',
    kind: 'Bereich',
    hint: 'Welche Stufen erledigt sind – und ein Einstufungstest für alle, die nicht bei null anfangen.',
    keywords: [
      'lernstand',
      'fortschritt',
      'einstufung',
      'einstufungstest',
      'test',
      'wo anfangen',
      'niveau',
    ],
  })

  eintraege.push({
    title: 'Wiederholen',
    href: '/lernen/wiederholen',
    kind: 'Bereich',
    hint: 'Die Fragen aus allen Lernthemen in wachsenden Abständen – gegen das Vergessen.',
    keywords: [
      'wiederholen',
      'wiederholung',
      'karteikarten',
      'leitner',
      'spaced repetition',
      'behalten',
      'vergessen',
      'ueben',
    ],
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
        stufe,
      })
    }
  }

  /*
    Die Kartenbögen zum Ausdrucken.

    Ein Eintrag je Thema, aber nur wo es Karten gibt – dieselbe Bedingung wie
    in Sitemap und `generateStaticParams`, aus derselben Funktion. Wer
    „karteikarten drucken“ tippt, meint meistens ein bestimmtes Thema; deshalb
    steht das Thema im Titel und nicht das Wort „Lernkarten“ allein.
  */
  for (const slug of themenMitKarten(themen.map((thema) => thema.slug))) {
    const thema = themen.find((eintrag) => eintrag.slug === slug)
    if (!thema) continue
    eintraege.push({
      title: `Lernkarten: ${thema.title}`,
      href: `/lernen/${slug}/karten`,
      kind: 'Lernwerkzeug',
      hint: 'Begriffe und Prüffragen als Kartenbogen zum Ausdrucken – acht je Blatt.',
      keywords: [
        ...thema.keywords,
        'karten',
        'lernkarten',
        'karteikarten',
        'drucken',
        'ausdrucken',
        'papier',
      ],
    })
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
    title: 'Was läuft mit was',
    href: '/maerkte/zusammenhang',
    kind: 'Bereich',
    hint: 'Wie stark elf Leitwerte gemeinsam schwankten – und wie weit ihre Wochen auseinanderlagen',
    keywords: [
      'korrelation',
      'zusammenhang',
      'gleichlauf',
      'streuung',
      'diversifikation',
      'volatilitaet',
      'volatilität',
      'schwankung',
      'schwankungsbreite',
      'standardabweichung',
      'risiko',
    ],
  })
  eintraege.push({
    title: 'Gibt es gute und schlechte Börsenmonate?',
    href: '/maerkte/saisonalitaet',
    kind: 'Bereich',
    hint: 'Monatsrenditen elf Leitwerte über fünf Jahre – und die Rechnung, wie viel davon Zufall ist',
    keywords: [
      'saisonalitaet',
      'saisonalität',
      'saison',
      'monat',
      'monate',
      'monatsrendite',
      'boersenmonat',
      'börsenmonat',
      'sell in may',
      'jahresendrallye',
      'santa rally',
      'september',
      'bester monat',
      'schlechtester monat',
      'zufall',
    ],
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
    title: 'Was sich geändert hat',
    href: '/aenderungen',
    kind: 'Bereich',
    hint: 'Neue Seiten, geänderte Darstellung und korrigierte Angaben – auch die Fehler',
    keywords: [
      'aenderungen',
      'änderungen',
      'changelog',
      'neu',
      'neuerungen',
      'was ist neu',
      'protokoll',
      'verlauf',
      'korrektur',
    ],
  })
  eintraege.push({
    title: 'Wie viel Dollar in „weltweit" steckt',
    href: '/maerkte/waehrungen-im-weltindex',
    kind: 'Bereich',
    hint: 'Die Währungsaufteilung eines Weltdepots – aus den Ländergewichten des Indexanbieters',
    keywords: [
      'waehrung',
      'währung',
      'dollar',
      'dollaranteil',
      'usd',
      'weltweit',
      'weltdepot',
      'msci world',
      'streuung',
      'waehrungsrisiko',
      'währungsrisiko',
    ],
  })
  eintraege.push({
    title: 'Wie breit ist „breit gestreut"?',
    href: '/maerkte/klumpenrisiko',
    kind: 'Bereich',
    hint: '1.282 Werte im Weltindex – und die zehn größten tragen gut ein Viertel davon',
    keywords: [
      'klumpen',
      'klumpenrisiko',
      'konzentration',
      'streuung',
      'diversifikation',
      'breit gestreut',
      'groesste werte',
      'größte werte',
      'top 10',
      'branchen',
      'branchengewicht',
      'gewichtung',
      'msci world',
      'nvidia',
      'apple',
      'gleichgewicht',
    ],
  })
  /*
    Die Nachrichtenstränge.

    Aus derselben Quelle wie die Seiten selbst – eine abgetippte Liste wäre
    nach dem nächsten Artikel unvollständig, und die Paketprüfung meldet
    genau das (sie hat es bei diesen Seiten auch getan).
  */
  for (const strang of straenge(artikel, 'symbol')) {
    const wert = instrumente.find((eintrag) => eintrag.symbol === strang.schluessel)
    if (!wert) continue
    eintraege.push({
      title: `${wert.name}: alle Meldungen`,
      href: `/news/strang/wert/${strang.schluessel}`,
      kind: 'News',
      hint: `${strang.artikel.length} Meldungen zu ${wert.name}, chronologisch – von der jüngsten zurück bis zur ersten.`,
      keywords: [
        strang.schluessel,
        wert.ticker.toLowerCase(),
        'strang',
        'archiv',
        'alle meldungen',
        'chronologisch',
        'verlauf',
      ],
    })
  }

  for (const strang of straenge(artikel, 'thema')) {
    const thema = themen.find((eintrag) => eintrag.slug === strang.schluessel)
    if (!thema) continue
    eintraege.push({
      title: `${thema.title}: alle Meldungen`,
      href: `/news/strang/thema/${strang.schluessel}`,
      kind: 'News',
      hint: `${strang.artikel.length} Meldungen, die dieses Thema berührt haben – chronologisch.`,
      keywords: [
        strang.schluessel,
        'strang',
        'archiv',
        'alle meldungen',
        'chronologisch',
        thema.title.toLowerCase(),
      ],
    })
  }

  eintraege.push({
    title: 'Aktien nach Kennzahlen filtern',
    href: '/maerkte/screener',
    kind: 'Bereich',
    hint: 'KGV, Kurs-Buchwert, Börsenwert, Branche, Land – mit der Datenlage neben jedem Ergebnis',
    keywords: [
      'screener',
      'filter',
      'filtern',
      'kgv',
      'kurs gewinn verhaeltnis',
      'kurs-gewinn-verhältnis',
      'kbv',
      'kuv',
      'buchwert',
      'boersenwert',
      'börsenwert',
      'marktkapitalisierung',
      'guenstige aktien',
      'günstige aktien',
      'bewertung',
      'suchen',
    ],
  })
  eintraege.push({
    title: 'Wann welche Börse geschlossen war',
    href: '/maerkte/handelsfreie-tage',
    kind: 'Bereich',
    hint: 'Handelsfreie Werktage der Handelsplätze – aus den Kursreihen abgelesen',
    keywords: [
      'feiertag',
      'feiertage',
      'boersenfeiertage',
      'börsenfeiertage',
      'geschlossen',
      'handelsfrei',
      'handelstag',
      'handelstage',
      'kein handel',
      'boerse zu',
      'börse zu',
      'kurs bleibt stehen',
      'handelskalender',
      'xetra',
      'nyse',
    ],
  })
  eintraege.push({
    title: 'Begriffe, die ständig verwechselt werden',
    href: '/verwechslungen',
    kind: 'Bereich',
    hint: 'ETF und Fonds, Zins und Rendite, nominal und real – zweispaltig, mit dem Satz zum Unterscheiden',
    keywords: [
      'verwechslung',
      'verwechslungen',
      'unterschied',
      'unterschiede',
      'gegen',
      'versus',
      'vs',
      'etf oder fonds',
      'zins oder rendite',
      'nominal real',
      'volatilitaet risiko',
      'performanceindex',
      'kursindex',
      'cashflow',
    ],
  })
  eintraege.push({
    title: 'Ich habe fünf Minuten',
    href: '/lernen/zeit',
    kind: 'Lernwerkzeug',
    hint: 'Einstieg nach verfügbarer Zeit statt nach Thema – fünf Minuten bis ein Abend',
    keywords: [
      'zeit',
      'fuenf minuten',
      'fünf minuten',
      'kurz',
      'schnell',
      'wo anfangen',
      'einstieg',
      'anfangen',
      'lesezeit',
      'abend',
      'viertelstunde',
    ],
  })
  eintraege.push({
    title: 'Zeitstrahl der Finanzgeschichte',
    href: '/zeitstrahl',
    kind: 'Bereich',
    hint: 'Währungsordnungen, Notenbanken und Kurseinbrüche in zeitlicher Folge – mit der Dauer bis zur Erholung',
    keywords: [
      'zeitstrahl',
      'geschichte',
      'finanzgeschichte',
      'chronik',
      'historie',
      'crash',
      'crashs',
      'crashes',
      'bretton woods',
      'goldstandard',
      'waehrungsreform',
      'währungsreform',
      'nixon',
      'hyperinflation',
    ],
  })

  /*
    Die Punkte des Zeitstrahls, jeder einzeln.

    Wer „Bretton Woods“ tippt, findet den Glossareintrag – und soll auch die
    Stelle finden, an der steht, was davor und danach kam. Der Titel trägt das
    Jahr voran, weil auf einer Trefferliste sonst nicht zu sehen ist, dass es
    ein Zeitpunkt ist.
  */
  for (const punkt of zeitstrahl()) {
    eintraege.push({
      title: `${punkt.jahr}: ${punkt.titel}`,
      href: `/zeitstrahl#${punkt.id}`,
      kind: 'Zeitpunkt',
      hint: punkt.was.slice(0, 140),
      keywords: [punkt.id, ...punkt.id.split('-'), ...(punkt.glossar ?? [])],
    })
  }

  eintraege.push({
    title: 'Das stimmt so nicht',
    href: '/irrtuemer',
    kind: 'Bereich',
    hint: 'Verbreitete Irrtümer über Geldanlage – je Satz, was daran richtig ist, was nicht, und die Rechnung',
    keywords: [
      'irrtum',
      'irrtuemer',
      'irrtümer',
      'mythos',
      'mythen',
      'stimmt nicht',
      'falsch',
      'richtigstellung',
      'missverstaendnis',
      'missverständnis',
      'denkfehler',
      'faustregel',
      'boersenweisheit',
      'börsenweisheit',
    ],
  })
  eintraege.push({
    title: 'Die Website in Zahlen',
    href: '/zahlen',
    kind: 'Bereich',
    hint: 'Wie viele Lernseiten, Kurse, Artikel und Quellen es hier gibt – beim Bauen gezählt',
    keywords: [
      'zahlen',
      'umfang',
      'wie viele',
      'anzahl',
      'statistik',
      'ueberblick',
      'überblick',
      'groesse',
      'größe',
      'inhalte',
    ],
  })
  eintraege.push({
    title: 'Methoden: wie jede Kennzahl gerechnet wird',
    href: '/methoden',
    kind: 'Bereich',
    hint: 'Formel, Datengrundlage, Stichtag und was bewusst weggelassen wird',
    keywords: [
      'methode',
      'methoden',
      'methodik',
      'formel',
      'berechnung',
      'wie gerechnet',
      'rechenweg',
      'nachvollziehbar',
      'transparenz',
      'annahmen',
      'vereinfachung',
    ],
  })
  eintraege.push({
    title: '52 Wochen: Abstand zum Hoch',
    href: '/maerkte/52-wochen',
    kind: 'Bereich',
    hint: 'Wo jeder Wert zwischen Jahrestief und Jahreshoch steht – sortierbar',
    keywords: [
      '52 wochen',
      '52-wochen-hoch',
      '52-wochen-tief',
      'jahreshoch',
      'jahrestief',
      'hoch',
      'tief',
      'abstand zum hoch',
      'spanne',
      'jahresspanne',
      'allzeithoch',
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
    title: 'Was du gesucht und nicht gefunden hast',
    href: '/suche/luecken',
    kind: 'Bereich',
    hint: 'Erfolglose Suchen, notiert in diesem Browser – sichtbar, löschbar, nicht übertragen',
    keywords: [
      'suche',
      'suchen',
      'luecken',
      'nichts gefunden',
      'fehlt',
      'themenwunsch',
      'protokoll',
    ],
  })
  eintraege.push({
    title: 'Anleihen',
    href: '/anleihen',
    kind: 'Bereich',
    hint: 'Warum der Kurs fällt, wenn der Zins steigt – mit Rechner für Duration und Konvexität',
    keywords: [
      'anleihe',
      'anleihen',
      'bond',
      'kupon',
      'duration',
      'konvexitaet',
      'rendite',
      'zinsaenderungsrisiko',
      'rentenfonds',
      'staatsanleihe',
    ],
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
    /*
      Die Urkundenseite jedes Pfads.

      Sie ist eine eigene Seite und muss deshalb auffindbar sein – die
      Paketprüfung besteht zu Recht darauf. Wer „Urkunde" sucht, will nicht
      erst den Pfad finden und dort weiterklicken; und wer die Seite ohne
      abgeschlossenen Pfad öffnet, sieht seinen Stand statt eines Blattes.
    */
    eintraege.push({
      title: `Urkunde: ${pfad.titel}`,
      href: `/lernen/pfade/${pfad.slug}/urkunde`,
      kind: 'Lernpfad',
      hint: 'Das Blatt zum Ausdrucken, sobald alle Stufen dieses Pfads abgehakt sind.',
      keywords: ['urkunde', 'zertifikat', 'abschluss', 'drucken', pfad.slug],
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

  /*
    3d. Die Irrtümer, jeder einzeln.

    Anders als bei den Verwechslungen reicht ein Eintrag für die ganze Seite
    hier nicht. Wer sucht, tippt nicht „Irrtum“ – er tippt den Satz oder sein
    Stichwort: „vorabpauschale thesaurierend“, „50 prozent verlust“,
    „allzeithoch“. Der Satz selbst ist deshalb der Titel, und die Sprungmarke
    führt an die Stelle statt an den Seitenanfang.
  */
  for (const irrtum of IRRTUEMER) {
    eintraege.push({
      title: irrtum.satz,
      href: `/irrtuemer#${irrtum.slug}`,
      kind: 'Irrtum',
      hint: irrtum.falsch.slice(0, 140),
      keywords: [irrtum.slug, ...irrtum.slug.split('-'), ...(irrtum.glossar ?? [])],
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
      datum: beitrag.publishedAt.slice(0, 10),
    })
  }

  for (const ausgabe of ausgaben) {
    eintraege.push({
      title: `Tagesüberblick vom ${formatDate(ausgabe.date)}`,
      href: `/news/tag/${ausgabe.date}`,
      kind: 'Tagesüberblick',
      hint: ausgabe.intro,
      keywords: [ausgabe.date],
      datum: ausgabe.date,
    })
  }

  /*
    Jeder Jahrgang einzeln: Gesucht wird nach der Jahreszahl, nicht nach dem
    Wort „Jahresrückblick“ – „2025“ ist die Eingabe, die auf diese Seite führen
    soll.
  */
  for (const jahr of jahrgaenge) {
    eintraege.push({
      title: `Das Marktjahr ${jahr}`,
      href: `/news/jahr/${jahr}`,
      kind: 'Jahresrückblick',
      hint: `Veränderung, Hoch, Tief und größter Rückschlag von zwölf Märkten im Jahr ${jahr}.`,
      keywords: [String(jahr), 'jahresrueckblick', 'jahresbilanz'],
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
      datum: folge.datum.slice(0, 10),
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
