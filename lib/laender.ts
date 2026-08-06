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
import { ersatzschluessel, laendernamen, unbewohnt } from '@/data/laender/namen'
import { marketDefinitions, marketKindMeta, type MarketKind } from '@/data/markets'
import { assertLaenderValid } from '@/lib/laender-validate'
import {
  passeAn,
  schaetze,
  typischerFehlerProzent,
  type Beobachtung,
} from '@/lib/schaetzung'

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
  /** Wahr, wenn `bipUsd` aus Einwohnern und Einkommen gebildet wurde. */
  bipUsdGeschaetzt?: boolean
  /**
   * Gesetzt, wenn das Gebiet keine ständige Bevölkerung hat.
   *
   * Dann fehlen die Kennzahlen nicht, es gibt sie nicht – ein Unterschied, den
   * „keine Angabe hinterlegt“ verwischt.
   */
  unbewohnt?: string
  einwohner?: number
  /** Gerechnet, nicht gespeichert – siehe `scripts/laender-abrufen.ts`. */
  bipProKopfUsd?: number

  schuldenquote?: Kennwert
  durchschnittsgehalt?: Kennwert
  medianvermoegen?: Kennwert
  bneProKopf?: Kennwert
  bipProKopfKKP?: Kennwert
  arbeitslosenquote?: Kennwert
  inflation?: Kennwert

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
  | 'bneProKopf'
  | 'bipProKopfKKP'
  | 'arbeitslosenquote'
  | 'inflation'
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
      'Jahreslohn einer vollzeitbeschäftigten Person, kaufkraftbereinigt. Brutto, vor Steuern und Abgaben. Erhoben wird er nur für die 38 OECD-Mitglieder; bei den übrigen ist er aus der Wirtschaftsleistung je Kopf geschätzt und liegt typischerweise um ein Achtel daneben.',
    einheit: 'US-Dollar im Jahr',
    hoherWertIstGross: true,
  },
  {
    id: 'medianvermoegen',
    label: 'Medianvermögen',
    /*
      Die Angabe „je Haushalt“ gehört in die Erklärung, nicht nur in die
      Einheit.

      Ein Haushaltswert liegt naturgemäß über einem Pro-Kopf-Wert. Wer das
      nicht mitliest, hält 106.000 Euro für Deutschland für ein Pro-Kopf-
      Vermögen und wundert sich – oder rechnet damit weiter.
    */
    erklaerung:
      'Das Vermögen des Haushalts genau in der Mitte – Besitz abzüglich Schulden. Aussagekräftiger als der Durchschnitt, den wenige sehr Vermögende nach oben ziehen. Ein Haushalt umfasst je nach Land ein bis drei Personen; der Wert ist deshalb nicht mit einem Pro-Kopf-Vermögen zu verwechseln. Erhoben wird er nur für 30 wohlhabende Länder – bei allen übrigen ist er geschätzt und liegt typischerweise um ein gutes Drittel daneben. Die Karte zeigt hier also überwiegend eine Größenordnung, keine Messung.',
    einheit: 'US-Dollar je Haushalt',
    hoherWertIstGross: true,
  },
  {
    id: 'bneProKopf',
    label: 'Einkommen je Kopf',
    /*
      Der Name ist mit Bedacht nicht „Durchschnittsgehalt“.

      Das Bruttonationaleinkommen enthält Unternehmensgewinne und
      Staatseinnahmen; geteilt durch die Einwohnerzahl ergibt das eine Zahl, die
      deutlich über dem liegt, was ein Angestellter verdient. Wer sie für ein
      Gehalt hält, zieht falsche Schlüsse – deshalb steht der Unterschied
      ausdrücklich in der Erklärung.
    */
    erklaerung:
      'Bruttonationaleinkommen je Einwohner: alles, was ein Land in einem Jahr erwirtschaftet, geteilt durch seine Bevölkerung. Kein Gehalt – enthalten sind auch Unternehmensgewinne und Staatseinnahmen. Die Weltbank glättet Wechselkursschwankungen über drei Jahre (Atlas-Methode).',
    einheit: 'US-Dollar im Jahr',
    hoherWertIstGross: true,
  },
  {
    id: 'bipProKopfKKP',
    label: 'Kaufkraft je Kopf',
    erklaerung:
      'Wirtschaftsleistung je Einwohner, umgerechnet nach dem, was man vor Ort dafür bekommt. Ein Friseurbesuch kostet in Kairo weniger als in Kopenhagen; wer nur zum Wechselkurs umrechnet, unterschätzt ärmere Länder deshalb systematisch. Diese Zahl gleicht das aus.',
    einheit: 'internationale Dollar im Jahr',
    hoherWertIstGross: true,
  },
  {
    id: 'arbeitslosenquote',
    label: 'Arbeitslosenquote',
    /*
      Der Hinweis auf die Modellschätzung gehört in die Erklärung, nicht ins
      Kleingedruckte.

      Wer in Deutschland auf die Karte schaut, hat die Zahl der Bundesagentur
      im Kopf und findet hier eine andere. Ohne den Grund daneben sieht das
      nach einem Fehler aus – dabei ist es die Bedingung dafür, dass Spanien
      und Japan überhaupt nebeneinanderstehen dürfen.
    */
    erklaerung:
      'Anteil der Arbeitslosen an allen Erwerbspersonen. Eine Modellschätzung der Internationalen Arbeitsorganisation: Jedes Land zählt nach eigenen Regeln, die ILO rechnet sie auf eine gemeinsame Abgrenzung um. Der Wert weicht deshalb von der national veröffentlichten Zahl ab – das ist der Preis dafür, dass sich Länder vergleichen lassen. Gezählt wird nur, wer Arbeit sucht; wer die Suche aufgegeben hat, taucht nicht auf.',
    einheit: 'Prozent der Erwerbspersonen',
    hoherWertIstGross: true,
  },
  {
    id: 'inflation',
    label: 'Inflation',
    /*
      Zwei Missverständnisse sind vorprogrammiert, und beide stehen deshalb im
      ersten und zweiten Satz: Es ist ein Jahresdurchschnitt, kein aktueller
      Wert, und der Warenkorb ist je Land ein anderer.
    */
    erklaerung:
      'Wie stark die Verbraucherpreise gegenüber dem Vorjahr gestiegen sind. Das ist der Durchschnitt eines abgeschlossenen Jahres, nicht die Rate von heute – wenn die Inflation gerade fällt, steht hier eine höhere Zahl als in den Nachrichten. Welche Waren gemessen werden, legt jedes Land selbst fest; die Körbe sind zwischen Ländern nicht deckungsgleich. Ein negativer Wert bedeutet fallende Preise.',
    einheit: 'Prozent gegenüber dem Vorjahr',
    hoherWertIstGross: true,
  },
  {
    id: 'kurse',
    label: 'Kurse auf dieser Seite',
    erklaerung:
      'Wie viele Indizes und Aktien aus diesem Land auf IM Invests zu finden sind. Zeigt die Schlagseite der Auswahl – nicht die der Weltwirtschaft.',
    // „Kursen je Land“ und nicht „Kurse“: Die Legende setzt „Angaben in …“
    // davor, und „Angaben in Kurse“ ist kein Satz.
    einheit: 'Kursen je Land',
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
      schuldenquote?: { wert: number; jahr: number }
      durchschnittsgehalt?: { wert: number; jahr: number }
      medianvermoegen?: { wert: number; jahr: number }
      bneProKopf?: { wert: number; jahr: number }
      bipProKopfKKP?: { wert: number; jahr: number }
      arbeitslosenquote?: { wert: number; jahr: number }
      inflation?: { wert: number; jahr: number }
    }
  >
  schuldenQuelle?: { label: string; url: string; abgrenzung: string }
  lohnQuelle?: { label: string; url: string; abgrenzung: string }
  vermoegenQuelle?: { label: string; url: string; abgrenzung: string }
  einkommenQuelle?: { label: string; url: string; abgrenzung: string }
  arbeitslosenQuelle?: { label: string; url: string; abgrenzung: string }
  inflationQuelle?: { label: string; url: string; abgrenzung: string }
}

const daten = momentaufnahme as Momentaufnahme

/** Bezugsjahr der Weltbank-Reihen – gehört sichtbar auf die Seite. */
export const WELTBANK_JAHR = daten.bezugsjahr
export const WELTBANK_QUELLE = daten.quelle

/*
  Die Momentaufnahme führt zu den abgerufenen Reihen `schuldenQuelle` und
  `lohnQuelle` – Beschriftung, Link und Abgrenzung, so wie sie beim Abruf
  gegolten haben.

  Angezeigt werden sie von dort aus nicht. Auf der Seite steht die Quelle an
  jedem einzelnen Wert, und dieser Weg führt über `kennzahlenQuellen`: Der
  Kennwert trägt einen Schlüssel, die Tafel schlägt ihn nach. Zwei Wege zur
  selben Angabe wären zwei Gelegenheiten, auseinanderzulaufen. Was in der
  Momentaufnahme steht, ist deshalb Herkunftsnachweis für den, der die Datei
  liest – die Anzeige gehört `data/laender/kennzahlen.ts`.
*/

/** Die Felder der Momentaufnahme, die als Kennwert mit Jahr vorliegen. */
type Reihenfeld =
  'durchschnittsgehalt' | 'medianvermoegen' | 'bneProKopf' | 'bipProKopfKKP'

/**
 * Baut ein Schätzmodell aus zwei Reihen der Momentaufnahme.
 *
 * Einmal beim Laden des Moduls, nicht je Land: Die Anpassung ist für alle
 * dieselbe, und die Fehlermessung durch Weglassen kostet je Modell so viele
 * Regressionen, wie es Beobachtungen gibt. Beides je Aufruf zu wiederholen wäre
 * Verschwendung – und schlimmer, es könnte je nach Aufrufreihenfolge
 * verschiedene Ergebnisse liefern.
 *
 * Die Güte wird mitgeführt, weil sie auf die Seite gehört. Eine Schätzung ohne
 * Angabe, wie weit sie danebenliegt, ist eine Behauptung.
 */
function modellFuer(ziel: Reihenfeld, basis: Reihenfeld) {
  const beobachtungen: Beobachtung[] = Object.values(daten.laender)
    .filter((land) => land[ziel] && land[basis])
    .map((land) => ({ x: land[basis]!.wert, y: land[ziel]!.wert }))

  const modell = passeAn(beobachtungen)
  const fehlerProzent = typischerFehlerProzent(beobachtungen)

  return {
    modell,
    fehlerProzent,
    /** Der geschätzte Zielwert, auf volle Einheiten gerundet. */
    fuer(eingang: number | undefined | null): number | null {
      if (!modell || eingang === undefined || eingang === null) return null
      const wert = schaetze(modell, eingang)
      return wert === null ? null : Math.round(wert)
    },
  }
}

/**
 * Die vier Schätzungen, die aus den vorhandenen Reihen ableitbar sind.
 *
 * ## Warum diese vier und keine fünfte
 *
 * Weil es bei den übrigen keinen Zusammenhang gibt, aus dem sich etwas
 * ableiten ließe. Für die **Schuldenquote** ist das gemessen: Gegen die
 * Kaufkraft je Kopf ergibt sie ein Bestimmtheitsmaß von 0,010 – praktisch null.
 * Japan ist reich und hoch verschuldet, Norwegen reich und kaum; Ruanda ist arm
 * und mäßig verschuldet, der Sudan arm und überschuldet. Eine Regression würde
 * dort im schlimmsten Fall um das Siebenunddreißigfache danebenliegen. Das wäre
 * keine Schätzung mehr, sondern eine Erfindung mit Nachkommastelle.
 *
 * **Einwohnerzahlen** stehen aus demselben Grund nicht hier: Sie lassen sich
 * aus Wirtschaftsdaten grundsätzlich nicht herleiten.
 *
 * ## Zur Reihenfolge
 *
 * `kaufkraft` wird zuerst gebraucht, weil Lohn und Vermögen darauf aufsetzen.
 * Wo sie selbst geschätzt ist, beruht die zweite Schätzung auf einer ersten –
 * das betrifft sechs Länder und ist an der Quellenangabe erkennbar.
 */
const schaetzungen = {
  lohn: modellFuer('durchschnittsgehalt', 'bipProKopfKKP'),
  vermoegen: modellFuer('medianvermoegen', 'bipProKopfKKP'),
  kaufkraft: modellFuer('bipProKopfKKP', 'bneProKopf'),
  einkommen: modellFuer('bneProKopf', 'bipProKopfKKP'),
}

/** Für die Anzeige der Güte auf der Globusseite. */
export const lohnSchaetzung = schaetzungen.lohn
export const vermoegenSchaetzung = schaetzungen.vermoegen

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
  Grönland, die Westsahara, Hongkong und die fünf Gebiete ohne ISO-Kennung.
  Ginge man von der Weltbank-Liste aus, hätten diese Flächen keinen Namen, und
  ein Klick darauf liefe ins Leere.
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

    const einwohner = basis?.einwohner

    /*
      Die Kaufkraft je Kopf, notfalls geschätzt.

      Sie steht vor allem anderen, weil Lohn und Vermögen darauf aufsetzen.
      Gemessen liegt sie für 197 Länder vor; für sechs weitere lässt sie sich
      aus dem Bruttonationaleinkommen ableiten, das dort vorhanden ist.
    */
    const kaufkraftGemessen = basis?.bipProKopfKKP
    const kaufkraftGeschaetzt =
      kaufkraftGemessen === undefined
        ? schaetzungen.kaufkraft.fuer(basis?.bneProKopf?.wert)
        : null
    const kaufkraft = kaufkraftGemessen?.wert ?? kaufkraftGeschaetzt ?? undefined

    /*
      Das Bruttoinlandsprodukt, notfalls aus Einwohnern und Einkommen gebildet.

      Das ist keine Regression, sondern fast eine Identität: Das
      Bruttonationaleinkommen je Kopf mal der Einwohnerzahl ergibt das
      Nationaleinkommen, und das weicht vom Inlandsprodukt nur um die
      Grenzüberschreitungen ab. An den 184 Ländern, wo alle drei Größen
      vorliegen, liegt die Rechnung im Mittel 10,6 Prozent daneben.
    */
    const bipGemessen = basis?.bipUsd
    const bipAbgeleitet =
      bipGemessen === undefined && einwohner && basis?.bneProKopf
        ? Math.round((einwohner * basis.bneProKopf.wert) / 1_000_000)
        : null
    const bipUsd = bipGemessen ?? bipAbgeleitet ?? undefined

    return {
      id,
      name,
      ...(basis?.alpha2 ? { alpha2: basis.alpha2 } : {}),
      ...(basis?.region ? { region: regionsnamen[basis.region] ?? basis.region } : {}),
      ...(basis?.waehrung ? { waehrung: basis.waehrung } : {}),
      ...(unbewohnt[id] ? { unbewohnt: unbewohnt[id] } : {}),
      ...(bipUsd ? { bipUsd } : {}),
      ...(bipAbgeleitet !== null ? { bipUsdGeschaetzt: true } : {}),
      ...(einwohner ? { einwohner } : {}),
      /*
        Pro Kopf wird gerechnet, nicht gespeichert.

        Beide Größen stammen aus demselben Jahr (dafür sorgt das Abrufskript),
        und ein abgelegter dritter Wert könnte von den beiden anderen
        abweichen, ohne dass es jemandem auffiele.
      */
      ...(bipUsd && einwohner ? { bipProKopfUsd: (bipUsd * 1_000_000) / einwohner } : {}),
      /*
        Abgerufene Schuldenquote vor der von Hand gepflegten.

        Der Abruf über den IWF deckt alle Länder nach derselben Abgrenzung ab;
        die Handpflege war nur der Notbehelf, solange es keinen Abruf gab. Wo
        beides vorliegt, gewinnt die maschinelle Reihe – sie ist einheitlich
        und altert nicht unbemerkt.
      */
      ...(() => {
        const abgerufen = basis?.schuldenquote
        if (abgerufen) {
          return {
            schuldenquote: {
              wert: abgerufen.wert,
              zeitraum: String(abgerufen.jahr),
              quelle: 'imf-datamapper',
            },
          }
        }
        return schuldenquote[id] ? { schuldenquote: schuldenquote[id] } : {}
      })(),
      /*
        Wie bei der Schuldenquote: der Abruf vor der Handpflege.

        Die OECD-Reihe deckt rund vierzig Länder nach einer Abgrenzung ab; die
        neun von Hand eingetragenen Werte waren der Notbehelf, solange es
        keinen Abruf gab. Wo beides vorliegt, gewinnt die maschinelle Reihe.
      */
      ...(() => {
        const abgerufen = basis?.durchschnittsgehalt
        if (abgerufen) {
          return {
            durchschnittsgehalt: {
              wert: abgerufen.wert,
              zeitraum: String(abgerufen.jahr),
              quelle: 'oecd-sdmx',
            },
          }
        }
        if (durchschnittsgehalt[id]) {
          return { durchschnittsgehalt: durchschnittsgehalt[id] }
        }
        /*
          Zuletzt die Schätzung – nur in die Lücke, nie über einen Messwert.

          Sie steht bewusst am Ende dieser Kette: erst der Abruf, dann die
          Handpflege, dann die Rechnung. Und sie trägt eine eigene
          Quellenangabe, damit auf der Tafel zu sehen ist, dass hier gerechnet
          und nicht gemessen wurde.
        */
        const geschaetzt = schaetzungen.lohn.fuer(kaufkraft)
        return geschaetzt !== null
          ? {
              durchschnittsgehalt: {
                wert: geschaetzt,
                zeitraum: String(basis?.bipProKopfKKP?.jahr ?? WELTBANK_JAHR),
                quelle: 'geschaetzt-kaufkraft',
              },
            }
          : {}
      })(),
      /*
        Der Abruf vor der Handpflege – mit einer Besonderheit.

        Die abgerufene Reihe misst das Median-Reinvermögen **je Haushalt**, die
        drei von Hand eingetragenen Werte stammen aus einem Bankenbericht und
        gelten **je erwachsener Person**. Das sind zwei verschiedene Zahlen.

        Beide nebeneinander in einer Spalte wären deshalb nicht bloß ungenau,
        sondern eine falsche Rangfolge: Ein Haushaltswert liegt naturgemäß über
        einem Pro-Kopf-Wert, und ein Land mit Handpflege stünde ohne Grund
        weiter unten. Wo die Reihe greift, gilt allein sie; wo nicht, bleibt es
        beim alten Wert samt seiner eigenen Quellenangabe, die auf der Seite an
        jedem einzelnen Wert steht.
      */
      ...(() => {
        const abgerufen = basis?.medianvermoegen
        if (abgerufen) {
          return {
            medianvermoegen: {
              wert: abgerufen.wert,
              zeitraum: String(abgerufen.jahr),
              quelle: 'oecd-vermoegen',
            },
          }
        }
        if (medianvermoegen[id]) return { medianvermoegen: medianvermoegen[id] }
        /*
          Zuletzt die Schätzung – mit deutlich mehr Unsicherheit als beim Lohn.

          Sie steht hier, weil eine Lücke auf 210 von 240 Tafeln die Kennzahl
          unbrauchbar machte. Wie weit sie danebenliegt, steht an der
          Quellenangabe und auf der Globusseite: rund 38 Prozent im Mittel
          gegenüber 12 beim Lohn. Der Grund ist inhaltlich – Vermögen hängt an
          Wohneigentum, Rentensystem und Verschuldung, nicht am Einkommen.
        */
        const geschaetzt = schaetzungen.vermoegen.fuer(kaufkraft)
        return geschaetzt !== null
          ? {
              medianvermoegen: {
                wert: geschaetzt,
                zeitraum: String(basis?.bipProKopfKKP?.jahr ?? WELTBANK_JAHR),
                quelle: 'geschaetzt-vermoegen',
              },
            }
          : {}
      })(),
      /*
        Die beiden Einkommensreihen gibt es nur aus dem Abruf.

        Von Hand gepflegte Ersatzwerte wären hier sinnlos: Die Weltbank deckt
        245 beziehungsweise 242 Länder ab – mehr, als diese Website führt.
      */
      ...(basis?.bneProKopf
        ? {
            bneProKopf: {
              wert: basis.bneProKopf.wert,
              zeitraum: String(basis.bneProKopf.jahr),
              quelle: 'weltbank-einkommen',
            },
          }
        : (() => {
            // Fehlt nur diese Reihe, lässt sie sich aus der Kaufkraft ableiten.
            const geschaetzt = schaetzungen.einkommen.fuer(basis?.bipProKopfKKP?.wert)
            return geschaetzt !== null
              ? {
                  bneProKopf: {
                    wert: geschaetzt,
                    zeitraum: String(basis?.bipProKopfKKP?.jahr ?? WELTBANK_JAHR),
                    quelle: 'geschaetzt-reihe',
                  },
                }
              : {}
          })()),
      ...(basis?.bipProKopfKKP
        ? {
            bipProKopfKKP: {
              wert: basis.bipProKopfKKP.wert,
              zeitraum: String(basis.bipProKopfKKP.jahr),
              quelle: 'weltbank-einkommen',
            },
          }
        : kaufkraftGeschaetzt !== null
          ? {
              bipProKopfKKP: {
                wert: kaufkraftGeschaetzt,
                zeitraum: String(basis?.bneProKopf?.jahr ?? WELTBANK_JAHR),
                quelle: 'geschaetzt-reihe',
              },
            }
          : {}),
      /*
        Arbeitslosenquote und Inflation: gemessen oder gar nicht.

        Bei Lohn und Vermögen füllt eine Regression aus der Kaufkraft die
        Lücken. Hier wäre das falsch. Beide Raten hängen nicht am Wohlstand,
        sondern an Konjunktur, Währungsordnung und Politik: Die Schweiz und
        Spanien sind ähnlich reich und liegen bei der Arbeitslosigkeit um den
        Faktor fünf auseinander. Eine daraus geschätzte Zahl wäre erfunden,
        und eine Lücke ist ehrlicher als eine Erfindung.
      */
      ...(basis?.arbeitslosenquote
        ? {
            arbeitslosenquote: {
              wert: basis.arbeitslosenquote.wert,
              zeitraum: String(basis.arbeitslosenquote.jahr),
              quelle: 'weltbank-arbeitslosigkeit',
            },
          }
        : {}),
      ...(basis?.inflation
        ? {
            inflation: {
              wert: basis.inflation.wert,
              zeitraum: String(basis.inflation.jahr),
              quelle: 'weltbank-inflation',
            },
          }
        : {}),
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
  // Werden nicht in `kennzahlen` gesetzt, sondern aus der Momentaufnahme –
  // die letzte nicht einmal von dort, sondern aus der Rechnung darüber.
  dynamischeQuellen: [
    'imf-datamapper',
    'oecd-sdmx',
    'oecd-vermoegen',
    'weltbank-einkommen',
    'weltbank-arbeitslosigkeit',
    'weltbank-inflation',
    'geschaetzt-kaufkraft',
    'geschaetzt-vermoegen',
    'geschaetzt-reihe',
  ],
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
    case 'bneProKopf':
      return land.bneProKopf?.wert ?? null
    case 'bipProKopfKKP':
      return land.bipProKopfKKP?.wert ?? null
    case 'arbeitslosenquote':
      return land.arbeitslosenquote?.wert ?? null
    case 'inflation':
      return land.inflation?.wert ?? null
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
