import momentaufnahme from '@/data/snapshots/laender.json'

import {
  durchschnittsgehalt,
  kennzahlenQuellen,
  medianvermoegen,
  schuldenquote,
  type Kennwert,
  type Quellenangabe,
} from '@/data/laender/kennzahlen'
import {
  marktLand,
  uebernational,
  zuordnungshinweise,
} from '@/data/laender/markt-zuordnung'
import { ersatzschluessel, laendernamen } from '@/data/laender/namen'
import { marketDefinitions, marketKindMeta, type MarketKind } from '@/data/markets'
import { assertLaenderValid } from '@/lib/laender-validate'

/**
 * Service-Schicht für den Globus.
 *
 * Führt vier Quellen zusammen, die absichtlich getrennt gepflegt werden:
 *
 * - die Kartengeometrie (`public/globus/`, Natural Earth) – nur Formen
 * - die Weltbank-Momentaufnahme (`data/snapshots/laender.json`) – BIP und
 *   Einwohner, automatisch geholt
 * - die von Hand gepflegten Kennzahlen (`data/laender/kennzahlen.ts`) – mit
 *   Quelle und Zeitraum an jedem einzelnen Wert
 * - die Kurse aus `data/markets.ts` über `data/laender/markt-zuordnung.ts`
 *
 * Komponenten sehen nur das Ergebnis. Keine Seite greift auf `data/` zu –
 * dieselbe Regel wie im übrigen Projekt.
 */

export type { Kennwert, Quellenangabe } from '@/data/laender/kennzahlen'

/** Ein Kurs, der zu einem Land gehört. */
export interface Landeskurs {
  symbol: string
  ticker: string
  name: string
  kind: MarketKind
  kindLabel: string
  summary: string
  /** Erläuterung, wo Sitz und landläufige Zuordnung auseinandergehen. */
  hinweis?: string
}

export interface Land {
  /** ISO-3166-1-numerisch, dreistellig – Schlüssel der Kartengeometrie. */
  id: string
  name: string
  /** Zweibuchstabiger Code, sofern vorhanden. */
  alpha2?: string
  /** UN-Region, z. B. „Europe“. */
  region?: string
  waehrung?: string

  /** Bruttoinlandsprodukt in Millionen US-Dollar. */
  bipUsd?: number
  einwohner?: number
  /** Gerechnet, nicht gespeichert – siehe `scripts/laender-abrufen.ts`. */
  bipProKopfUsd?: number

  schuldenquote?: Kennwert
  durchschnittsgehalt?: Kennwert
  medianvermoegen?: Kennwert

  indizes: Landeskurs[]
  aktien: Landeskurs[]
}

/** Welche Kennzahl der Globus gerade einfärbt. */
export type MetrikId =
  | 'bip'
  | 'einwohner'
  | 'bipProKopf'
  | 'schuldenquote'
  | 'durchschnittsgehalt'
  | 'medianvermoegen'
  | 'kurse'

export interface Metrik {
  id: MetrikId
  label: string
  /** Ein Satz darüber, was die Zahl aussagt. */
  erklaerung: string
  einheit: string
  /** Für die Sortierung der Rangliste: Ist ein hoher Wert „mehr“? */
  hoherWertIstGross: boolean
}

export const metriken: Metrik[] = [
  {
    id: 'bip',
    label: 'Bruttoinlandsprodukt',
    erklaerung:
      'Der Wert aller Waren und Dienstleistungen, die ein Land in einem Jahr herstellt. Eine Größenangabe – kein Wohlstandsmaß.',
    einheit: 'US-Dollar',
    hoherWertIstGross: true,
  },
  {
    id: 'bipProKopf',
    label: 'BIP pro Kopf',
    erklaerung:
      'Wirtschaftsleistung geteilt durch Einwohner. Sagt nichts darüber, wie sie verteilt ist.',
    einheit: 'US-Dollar je Kopf',
    hoherWertIstGross: true,
  },
  {
    id: 'einwohner',
    label: 'Einwohner',
    erklaerung: 'Bevölkerung des Landes.',
    einheit: 'Personen',
    hoherWertIstGross: true,
  },
  {
    id: 'schuldenquote',
    label: 'Staatsverschuldung',
    erklaerung:
      'Schulden des Staates im Verhältnis zur jährlichen Wirtschaftsleistung. Über 100 Prozent heißt: mehr Schulden als ein Jahr Wirtschaftsleistung.',
    einheit: 'Prozent des BIP',
    hoherWertIstGross: true,
  },
  {
    id: 'durchschnittsgehalt',
    label: 'Durchschnittsgehalt',
    erklaerung:
      'Jahreslohn einer vollzeitbeschäftigten Person, kaufkraftbereinigt. Brutto, vor Steuern und Abgaben.',
    einheit: 'US-Dollar im Jahr',
    hoherWertIstGross: true,
  },
  {
    id: 'medianvermoegen',
    label: 'Medianvermögen',
    erklaerung:
      'Das Vermögen der Person genau in der Mitte. Aussagekräftiger als der Durchschnitt, den wenige sehr Vermögende nach oben ziehen.',
    einheit: 'US-Dollar je Erwachsenem',
    hoherWertIstGross: true,
  },
  {
    id: 'kurse',
    label: 'Kurse auf dieser Seite',
    erklaerung:
      'Wie viele Indizes und Aktien aus diesem Land auf IM Invests zu finden sind. Zeigt die Schlagseite der Auswahl – nicht die der Weltwirtschaft.',
    einheit: 'Kurse',
    hoherWertIstGross: true,
  },
]

/**
 * Die UN-Regionen auf Deutsch.
 *
 * Die Ländercode-Tabelle führt sie englisch. Auf einer deutschsprachigen Seite
 * stünde sonst „Europe · EUR“ in der Detailtafel.
 */
const regionsnamen: Record<string, string> = {
  Africa: 'Afrika',
  Americas: 'Amerika',
  Asia: 'Asien',
  Europe: 'Europa',
  Oceania: 'Ozeanien',
  Antarctica: 'Antarktis',
}

type Momentaufnahme = {
  abgerufenAm: string
  bezugsjahr: number
  quelle: { label: string; urls: string[] }
  laender: Record<
    string,
    {
      alpha2: string
      numerisch: string
      region: string
      subregion: string
      waehrung: string
      bipUsd?: number
      einwohner?: number
    }
  >
}

const daten = momentaufnahme as Momentaufnahme

/** Bezugsjahr der Weltbank-Reihen – gehört sichtbar auf die Seite. */
export const WELTBANK_JAHR = daten.bezugsjahr
export const WELTBANK_QUELLE = daten.quelle

function kursZu(symbol: string): Landeskurs | null {
  const definition = marketDefinitions.find((eintrag) => eintrag.symbol === symbol)
  if (!definition) return null
  return {
    symbol: definition.symbol,
    ticker: definition.ticker,
    name: definition.name,
    kind: definition.kind,
    kindLabel: marketKindMeta[definition.kind].short,
    summary: definition.summary,
    ...(zuordnungshinweise[symbol] ? { hinweis: zuordnungshinweise[symbol] } : {}),
  }
}

/*
  Die Länderliste entsteht aus den Namen, nicht aus der Momentaufnahme.

  `data/laender/namen.ts` deckt jede Form der Kartengeometrie ab – auch
  Grönland, die Westsahara und die drei Gebiete ohne ISO-Kennung. Ginge man von
  der Weltbank-Liste aus, hätten diese Flächen keinen Namen, und ein Klick
  darauf liefe ins Leere.
*/
function baueLaender(): Land[] {
  // Von Alpha-3 auf numerisch: Die Momentaufnahme ist nach Alpha-3 abgelegt,
  // die Geometrie kennt nur die numerische Kennung.
  const nachNummer = new Map<string, Momentaufnahme['laender'][string]>()
  for (const eintrag of Object.values(daten.laender)) {
    nachNummer.set(eintrag.numerisch, eintrag)
  }

  const kurseJeLand = new Map<string, string[]>()
  for (const [symbol, id] of Object.entries(marktLand)) {
    const liste = kurseJeLand.get(id) ?? []
    liste.push(symbol)
    kurseJeLand.set(id, liste)
  }

  return Object.entries(laendernamen).map(([id, name]) => {
    const basis = nachNummer.get(id)
    const symbole = kurseJeLand.get(id) ?? []
    const kurse = symbole
      .map(kursZu)
      .filter((kurs): kurs is Landeskurs => kurs !== null)
      // Innerhalb eines Landes zuerst die Indizes: Sie beschreiben den Markt,
      // die Einzelwerte sind Beispiele daraus.
      .sort((a, b) => (a.kind === b.kind ? 0 : a.kind === 'index' ? -1 : 1))

    const bipUsd = basis?.bipUsd
    const einwohner = basis?.einwohner

    return {
      id,
      name,
      ...(basis?.alpha2 ? { alpha2: basis.alpha2 } : {}),
      ...(basis?.region ? { region: regionsnamen[basis.region] ?? basis.region } : {}),
      ...(basis?.waehrung ? { waehrung: basis.waehrung } : {}),
      ...(bipUsd ? { bipUsd } : {}),
      ...(einwohner ? { einwohner } : {}),
      /*
        Pro Kopf wird gerechnet, nicht gespeichert.

        Beide Größen stammen aus demselben Jahr (dafür sorgt das Abrufskript),
        und ein abgelegter dritter Wert könnte von den beiden anderen
        abweichen, ohne dass es jemandem auffiele.
      */
      ...(bipUsd && einwohner ? { bipProKopfUsd: (bipUsd * 1_000_000) / einwohner } : {}),
      ...(schuldenquote[id] ? { schuldenquote: schuldenquote[id] } : {}),
      ...(durchschnittsgehalt[id]
        ? { durchschnittsgehalt: durchschnittsgehalt[id] }
        : {}),
      ...(medianvermoegen[id] ? { medianvermoegen: medianvermoegen[id] } : {}),
      indizes: kurse.filter((kurs) => kurs.kind === 'index'),
      aktien: kurse.filter((kurs) => kurs.kind === 'stock'),
    }
  })
}

const alleLaender = baueLaender()

/*
  Prüfung beim Laden des Moduls und damit bei jedem Build.

  Ein Kurssymbol ohne Land, eine Kennzahl zu einer Kennung, die es nicht gibt,
  eine Quelle ohne Link – all das würde auf der Karte nicht auffallen. Der Build
  bricht deshalb ab, statt zu warnen; dasselbe Vorgehen wie bei den Nachrichten
  und den Tagesausgaben.
*/
assertLaenderValid({
  laendernamen,
  marktLand,
  uebernational,
  zuordnungshinweise,
  marktSymbole: marketDefinitions.map((eintrag) => ({
    symbol: eintrag.symbol,
    kind: eintrag.kind,
  })),
  kennzahlen: { schuldenquote, durchschnittsgehalt, medianvermoegen },
  quellen: kennzahlenQuellen,
  ersatzschluessel,
})

/** Alle Länder der Karte, alphabetisch. */
export async function getLaender(): Promise<Land[]> {
  return [...alleLaender].sort((a, b) => a.name.localeCompare(b.name, 'de'))
}

export async function getLand(id: string): Promise<Land | null> {
  return alleLaender.find((land) => land.id === id) ?? null
}

/** Kurse ohne einzelnes Herkunftsland, mit Begründung. */
export async function getUebernationaleKurse(): Promise<
  { kurs: Landeskurs; begruendung: string }[]
> {
  return Object.entries(uebernational)
    .map(([symbol, begruendung]) => ({ kurs: kursZu(symbol), begruendung }))
    .filter(
      (eintrag): eintrag is { kurs: Landeskurs; begruendung: string } =>
        eintrag.kurs !== null
    )
}

/** Den Wert einer Kennzahl aus einem Land holen – oder `null`. */
export function wertFuer(land: Land, metrik: MetrikId): number | null {
  switch (metrik) {
    case 'bip':
      return land.bipUsd ?? null
    case 'einwohner':
      return land.einwohner ?? null
    case 'bipProKopf':
      return land.bipProKopfUsd ?? null
    case 'schuldenquote':
      return land.schuldenquote?.wert ?? null
    case 'durchschnittsgehalt':
      return land.durchschnittsgehalt?.wert ?? null
    case 'medianvermoegen':
      return land.medianvermoegen?.wert ?? null
    case 'kurse': {
      const anzahl = land.indizes.length + land.aktien.length
      // Null Kurse ist eine Aussage, kein fehlender Wert – deshalb 0 und nicht
      // null. Sonst verschwände die Mehrheit der Länder aus der Legende.
      return anzahl
    }
  }
}

/** Wie viele Länder für eine Kennzahl überhaupt einen Wert haben. */
export async function getAbdeckung(): Promise<Record<MetrikId, number>> {
  const eintraege = metriken.map((metrik) => [
    metrik.id,
    alleLaender.filter((land) => wertFuer(land, metrik.id) !== null).length,
  ])
  return Object.fromEntries(eintraege) as Record<MetrikId, number>
}

/** Quellen, die auf der Seite genannt werden müssen. */
export async function getQuellen(): Promise<Quellenangabe[]> {
  return Object.values(kennzahlenQuellen)
}
