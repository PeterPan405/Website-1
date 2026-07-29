import { newsArticles } from '@/data/news'
import { kennzahlenQuellen } from '@/data/laender/kennzahlen'
import { editions } from '@/data/editions'
import laenderSnapshot from '@/data/snapshots/laender.json'

import {
  fundamentalHerkunft,
  fundamentalQuelle,
  fundamentalQuelleEsef,
  fundamentalStand,
} from '@/lib/fundamentaldaten'
import { getDevisenkurse, getLiveSeries, snapshotFetchedAt } from '@/lib/market-live'
import { marketDefinitions } from '@/data/markets'
import { quartalstermineQuelle, quartalstermineStand } from '@/lib/quartalstermine'

/**
 * Das Verzeichnis aller Datenquellen dieser Website.
 *
 * ## Warum es diese Seite gibt
 *
 * Weil die Frage, woher eine Zahl kommt, auf einer Seite über Geld die erste
 * ist, die ein aufmerksamer Leser stellt – und weil sie bisher nur
 * stückweise beantwortet war: ein Satz unter jeder Kurstafel, drei Zeilen unter
 * dem Globus, ein Absatz im Kalender. Wer wissen wollte, worauf das Ganze
 * steht, musste die Website absuchen.
 *
 * ## Warum die Zahlen hier gerechnet und nicht geschrieben sind
 *
 * Jede Angabe auf der Quellenseite – wie viele Instrumente, wie viele
 * Unternehmen, wann zuletzt abgerufen – wird beim Bauen aus den
 * Momentaufnahmen gezählt. Eine von Hand gepflegte Quellenseite wäre nach
 * wenigen Wochen genau das, was sie zu verhindern versucht: eine Behauptung
 * über Daten, die niemand nachgeprüft hat.
 *
 * ## Was Lizenz ist und was Höflichkeit
 *
 * Nicht jede Nennung hier ist freiwillig. Die Weltbank stellt ihre Reihen unter
 * CC BY 4.0, die TopoJSON-Umsetzung der Karte steht unter der ISC-Lizenz – in
 * beiden Fällen ist die Namensnennung **Bedingung der Nutzung**. Wo das so ist,
 * steht es am Eintrag, damit niemand auf die Idee kommt, ihn zu kürzen.
 */

/** Ob die Nennung einer Quelle rechtlich verlangt ist oder aus Sorgfalt geschieht. */
export type Nennungsgrund =
  /** Die Lizenz verlangt sie – Weglassen wäre eine Vertragsverletzung. */
  | 'lizenz'
  /** Amtliche Daten ohne Auflage; genannt, damit die Zahl nachprüfbar bleibt. */
  | 'nachpruefbarkeit'

export interface Quelleneintrag {
  /** Kurzname, wie er auf der Seite als Überschrift steht. */
  name: string
  /** Wofür die Daten auf dieser Website benutzt werden. */
  verwendung: string
  url: string
  /** Lizenz oder Rechtsgrundlage, falls eine benannt ist. */
  lizenz?: string
  grund: Nennungsgrund
  /** Wie viele Datensätze daraus stammen – gezählt, nicht geschätzt. */
  umfang?: string
  /** Wann zuletzt abgerufen, als ISO-Zeitstempel oder Datum. */
  stand?: string | null
  /** Einschränkungen, die man kennen muss, um die Zahlen richtig zu lesen. */
  abgrenzung?: string
}

export interface Quellengruppe {
  titel: string
  einleitung: string
  eintraege: Quelleneintrag[]
}

interface LaenderSnapshot {
  abgerufenAm: string
  bezugsjahr: number
  quelle: { label: string; urls?: string[]; url?: string }
  laender: Record<string, unknown>
}

const laenderDaten = laenderSnapshot as unknown as LaenderSnapshot

/**
 * Zählt die Instrumente je Kursquelle.
 *
 * Je Quelle und nicht insgesamt: Der erste Entwurf schrieb jeder Quelle die
 * Gesamtzahl zu, und dann stand unter „Europäische Zentralbank“ und unter
 * „Yahoo Finance“ dieselbe Zahl – als lieferte jede allein sämtliche Kurse.
 */
function kurszahlen(): { echt: number; gesamt: number; jeQuelle: Map<string, number> } {
  const jeQuelle = new Map<string, number>()
  let echt = 0
  for (const definition of marketDefinitions) {
    const reihe = getLiveSeries(definition.symbol)
    if (!reihe) continue
    echt += 1
    jeQuelle.set(reihe.source.label, (jeQuelle.get(reihe.source.label) ?? 0) + 1)
  }
  return { echt, gesamt: marketDefinitions.length, jeQuelle }
}

/** Wie viele Unternehmen im Fundamentaldaten-Bestand stehen. */
function unternehmenszahl(): number {
  // Der Bestand liegt hinter `lib/fundamentaldaten`; gezählt wird über die
  // Kürzel des Katalogs, damit hier keine zweite Datenquelle entsteht.
  return marketDefinitions.filter((d) => d.kind === 'stock').length
}

/**
 * Alle Quellen, nach Bereichen geordnet.
 *
 * Asynchron, weil die Service-Schicht dieses Projekts durchgehend asynchron
 * ist – zieht der Bestand später in ein CMS um, ändert sich nur diese Datei.
 */
export async function getQuellengruppen(): Promise<Quellengruppe[]> {
  const kurse = kurszahlen()
  const devisen = getDevisenkurse()
  const laenderAnzahl = Object.keys(laenderDaten.laender).length

  return [
    {
      titel: 'Kurse und Wechselkurse',
      einleitung: `Für ${kurse.echt} der ${kurse.gesamt} geführten Instrumente liegen echte Kurse vor; die übrigen sind auf der Seite ausdrücklich als erzeugte Beispieldaten gekennzeichnet. Abgerufen wird während der Handelszeit regelmäßig und als Momentaufnahme abgelegt. Es sind keine Echtzeitdaten: Zwischen zwei Abrufen steht der zuletzt geholte Stand, und an jedem Kurs steht, von wann er ist.`,
      eintraege: [
        ...[...kurse.jeQuelle.entries()]
          .sort((a, b) => b[1] - a[1])
          .map(([label, anzahl]) => ({
            name: label,
            verwendung: `Tagesschlusskurse und, wo verfügbar, der zuletzt gehandelte Preis für ${anzahl} ${anzahl === 1 ? 'Instrument' : 'Instrumente'}.`,
            url: label.includes('Zentralbank')
              ? 'https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html'
              : 'https://finance.yahoo.com/',
            grund: 'nachpruefbarkeit' as const,
            stand: snapshotFetchedAt,
          })),
        ...(devisen
          ? [
              {
                name: 'Europäische Zentralbank, vollständige Referenztabelle',
                verwendung: `Umrechnung zwischen Währungen, wo ein Unternehmen in einer anderen Währung berichtet als seine Aktie notiert. ${Object.keys(devisen.jeEuro).length} Währungen.`,
                url: 'https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html',
                grund: 'nachpruefbarkeit' as const,
                stand: devisen.stand,
                abgrenzung:
                  'Tagesfixings gegen 16 Uhr. Ein Kurs von später am Tag wird mit einem Wechselkurs umgerechnet, der einige Stunden alt ist.',
              },
            ]
          : []),
      ],
    },
    {
      titel: 'Unternehmenszahlen',
      einleitung: `Umsatz, Gewinn, Cashflow, Eigenkapital und Aktienzahl stammen aus zwei Sammlungen von Pflichtmeldungen: der US-Börsenaufsicht für alles, was in den Vereinigten Staaten notiert ist – auch über einen Hinterlegungsschein, weshalb Toyota und Shell erfasst sind –, und den ESEF-Meldungen der EU für die europäischen Werte ohne US-Notierung. Beides sind Meldungen der Unternehmen selbst, keine Aufbereitung eines Anbieters. Was in keine der beiden fällt – der deutsche Markt, Japan, Korea, Indien –, steht mit „keine Angabe“ da statt mit einer geschätzten Zahl.`,
      eintraege: [
        {
          name: fundamentalQuelle.label,
          verwendung: `Bewertungskennzahlen für ${fundamentalHerkunft().sec} der ${unternehmenszahl()} geführten Aktien.`,
          url: fundamentalQuelle.url,
          lizenz: 'Werk der US-Regierung, gemeinfrei',
          grund: 'nachpruefbarkeit',
          stand: fundamentalStand,
          abgrenzung: fundamentalQuelle.abgrenzung,
        },
        ...(fundamentalQuelleEsef && fundamentalHerkunft().esef > 0
          ? [
              {
                name: fundamentalQuelleEsef.label,
                verwendung: `Dieselben Kennzahlen für ${fundamentalHerkunft().esef} europäische Werte ohne US-Notierung.`,
                url: fundamentalQuelleEsef.url,
                lizenz: 'Offenes Verzeichnis, Abschlüsse als Pflichtveröffentlichung',
                grund: 'nachpruefbarkeit' as const,
                stand: fundamentalStand,
                abgrenzung: fundamentalQuelleEsef.abgrenzung,
              },
            ]
          : []),
        {
          name: quartalstermineQuelle.label,
          verwendung: 'Die Termine im Quartalskalender.',
          url: quartalstermineQuelle.url,
          lizenz: 'Werk der US-Regierung, gemeinfrei',
          grund: 'nachpruefbarkeit',
          stand: quartalstermineStand,
          abgrenzung: quartalstermineQuelle.abgrenzung,
        },
      ],
    },
    {
      titel: 'Länder, Globus und Staatsverschuldung',
      einleitung: `Die Ländertafeln und der Globus beruhen auf mehreren amtlichen Reihen, jede mit eigener Abgrenzung und eigenem Bezugsjahr. Deshalb steht die Herkunft zusätzlich an jedem einzelnen Wert der Detailtafel – dort ist auch zu sehen, ob ein Wert gemessen oder gerechnet wurde. Erfasst sind ${laenderAnzahl} Gebiete.`,
      eintraege: [
        {
          name: laenderDaten.quelle.label,
          verwendung: `Wirtschaftsleistung und Einwohnerzahl, Bezugsjahr ${laenderDaten.bezugsjahr}.`,
          url:
            laenderDaten.quelle.urls?.[0] ??
            laenderDaten.quelle.url ??
            'https://data.worldbank.org/',
          lizenz: 'CC BY 4.0 – die Namensnennung ist Bedingung der Nutzung',
          grund: 'lizenz',
          stand: laenderDaten.abgerufenAm,
        },
        ...Object.values(kennzahlenQuellen)
          // Die geschätzten Größen sind keine fremde Quelle, sondern eine
          // eigene Rechnung; sie stehen weiter unten unter „Eigene Rechnungen“.
          .filter((q) => !q.label.startsWith('geschätzt'))
          .map((q) => ({
            name: q.label,
            verwendung: q.abgrenzung ?? '',
            url: q.url,
            grund: 'nachpruefbarkeit' as const,
          })),
        {
          name: 'Natural Earth, Kartengeometrie',
          verwendung: 'Die Umrisse der Länder auf dem Globus.',
          url: 'https://www.naturalearthdata.com/',
          lizenz: 'gemeinfrei',
          grund: 'nachpruefbarkeit',
        },
        {
          name: 'world-atlas, TopoJSON-Umsetzung',
          verwendung: 'Die maschinenlesbare Fassung derselben Umrisse.',
          url: 'https://github.com/topojson/world-atlas',
          lizenz: 'ISC-Lizenz – der Urhebervermerk muss erhalten bleiben',
          grund: 'lizenz',
        },
      ],
    },
    {
      titel: 'Nachrichten',
      einleitung: `Jede Meldung ist selbst zusammengefasst und keine Übernahme fremder Texte. Die Quelle steht deshalb weiterhin unter jedem einzelnen Artikel und unter jeder Meldung der Tagesausgabe – dort und nur dort ist zu sehen, worauf sich ein bestimmter Satz stützt. Derzeit sind es ${newsArticles.length} Artikel und ${editions.length} Tagesausgaben.`,
      eintraege: [
        {
          name: 'Wechselnde Redaktionen und Primärquellen',
          verwendung:
            'Notenbanken, Statistikämter, Unternehmensmitteilungen und Wirtschaftsredaktionen – je nach Meldung eine andere. Eine pauschale Aufzählung wäre hier wertlos, weil sich Artikel und Quelle nicht mehr zuordnen ließen.',
          url: '/news',
          grund: 'nachpruefbarkeit',
        },
      ],
    },
    {
      titel: 'Eigene Rechnungen',
      einleitung:
        'Einiges auf dieser Website ist nicht abgerufen, sondern gerechnet. Das ist kein Mangel, solange es als solches erkennbar bleibt – eine gerechnete Zahl, die wie eine gemessene aussieht, wäre schlimmer als eine Lücke. Deshalb steht an jedem solchen Wert, dass er geschätzt ist, und hier steht, wie.',
      eintraege: [
        {
          name: 'Geschätzte Länderkennzahlen',
          verwendung:
            'Wo eine Erhebung ein Land nicht erfasst, wird der Wert aus einer verwandten, für dieses Land vorliegenden Größe geschätzt. Das Verfahren ist eine Regression im logarithmischen Maßstab; ihre Güte wird bei jedem Bauen neu gemessen und auf der Globusseite ausgewiesen.',
          url: '/globus',
          grund: 'nachpruefbarkeit',
          abgrenzung:
            'Geschätzte Werte sind auf der Detailtafel als solche gekennzeichnet. Wo die Güte nicht ausreichte – etwa bei der Staatsverschuldung –, wird nicht geschätzt, sondern die Lücke gezeigt.',
        },
        {
          name: 'Kennzahlen aus Kursreihen',
          verwendung:
            'Rendite, Schwankungsbreite, größter Rückgang und der Angst-und-Gier-Index werden aus den abgerufenen Kursreihen gerechnet, nicht von einem Anbieter übernommen. Die Formeln stehen im Quelltext.',
          url: '/maerkte',
          grund: 'nachpruefbarkeit',
        },
        {
          name: 'Bewertungskennzahlen',
          verwendung:
            'Marktkapitalisierung, Kurs-Gewinn-, Kurs-Umsatz- und Kurs-Buchwert-Verhältnis sowie Cashflow je Aktie entstehen aus den gemeldeten Bilanzzahlen und dem aktuellen Kurs. Nichts davon ist von einem Datenanbieter übernommen.',
          url: '/maerkte',
          grund: 'nachpruefbarkeit',
        },
      ],
    },
  ]
}
