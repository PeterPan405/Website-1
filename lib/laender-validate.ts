import type { Kennwert, Quellenangabe } from '@/data/laender/kennzahlen'

/**
 * Prüft die Länderdaten beim Bauen.
 *
 * Karten verzeihen keine Lücke sichtbar. Ein Kurs ohne Landzuordnung fehlt
 * einfach in der Seitenleiste, eine Kennzahl unter einer Kennung, die es nicht
 * gibt, erscheint nirgends, und eine Quelle ohne Link steht als Behauptung da.
 * Nichts davon fällt beim Draufschauen auf – deshalb bricht der Build ab,
 * statt zu warnen. Dasselbe Vorgehen wie bei `lib/news-validate.ts` und
 * `lib/editions-validate.ts`.
 */

interface Eingang {
  laendernamen: Record<string, string>
  marktLand: Record<string, string>
  uebernational: Record<string, string>
  zuordnungshinweise: Record<string, string>
  marktSymbole: { symbol: string; kind: string }[]
  kennzahlen: Record<string, Record<string, Kennwert>>
  quellen: Record<string, Quellenangabe>
  ersatzschluessel: Record<string, string>
}

/** Kursarten, die von einem einzelnen Land kommen und deshalb zugeordnet sein müssen. */
const BRAUCHT_LAND = new Set(['index', 'stock'])

export function validateLaender(eingang: Eingang): string[] {
  const probleme: string[] = []
  const laender = new Set(Object.keys(eingang.laendernamen))
  const symbole = new Set(eingang.marktSymbole.map((eintrag) => eintrag.symbol))

  // ------------------------------------------------------------- Ländernamen

  for (const [id, name] of Object.entries(eingang.laendernamen)) {
    const istErsatz = Object.values(eingang.ersatzschluessel).includes(id)
    if (!istErsatz && !/^\d{3}$/.test(id)) {
      probleme.push(
        `Land „${name}“: Die Kennung „${id}“ ist weder dreistellig-numerisch noch ein vereinbarter Ersatzschlüssel.`
      )
    }
    if (name.trim().length === 0) {
      probleme.push(`Land „${id}“ hat keinen Namen.`)
    }
  }

  /*
    Der häufigste Fehler beim Erweitern: ein Kurs kommt dazu, die Zuordnung
    nicht. Auf dem Globus fehlte er dann wortlos in seinem Land.
  */
  for (const eintrag of eingang.marktSymbole) {
    if (!BRAUCHT_LAND.has(eintrag.kind)) continue
    const zugeordnet = eintrag.symbol in eingang.marktLand
    const bewusstOhne = eintrag.symbol in eingang.uebernational
    if (!zugeordnet && !bewusstOhne) {
      probleme.push(
        `Kurs „${eintrag.symbol}“ (${eintrag.kind}) hat kein Herkunftsland und steht auch nicht unter „uebernational“.`
      )
    }
    if (zugeordnet && bewusstOhne) {
      probleme.push(
        `Kurs „${eintrag.symbol}“ steht gleichzeitig unter „marktLand“ und „uebernational“ – eins von beidem ist gemeint.`
      )
    }
  }

  for (const [symbol, id] of Object.entries(eingang.marktLand)) {
    if (!symbole.has(symbol)) {
      probleme.push(
        `Zuordnung für „${symbol}“: Diesen Kurs gibt es in data/markets.ts nicht.`
      )
    }
    if (!laender.has(id)) {
      probleme.push(`Zuordnung für „${symbol}“: Die Länderkennung „${id}“ ist unbekannt.`)
    }
  }

  for (const symbol of Object.keys(eingang.uebernational)) {
    if (!symbole.has(symbol)) {
      probleme.push(`„${symbol}“ steht unter „uebernational“, existiert aber nicht.`)
    }
  }

  for (const symbol of Object.keys(eingang.zuordnungshinweise)) {
    if (!symbole.has(symbol)) {
      probleme.push(`Hinweis zu „${symbol}“: Diesen Kurs gibt es nicht.`)
    }
  }

  // --------------------------------------------------------------- Kennzahlen

  for (const [name, werte] of Object.entries(eingang.kennzahlen)) {
    for (const [id, kennwert] of Object.entries(werte)) {
      const wo = `${name} für „${id}“`
      if (!laender.has(id)) {
        probleme.push(`${wo}: unbekannte Länderkennung.`)
      }
      if (!Number.isFinite(kennwert.wert)) {
        probleme.push(`${wo}: „${kennwert.wert}“ ist keine Zahl.`)
      }
      // Ein Wert ohne Zeitraum ist bei Wirtschaftsdaten wertlos: Eine
      // Schuldenquote von 2019 sagt über heute nichts.
      if (!kennwert.zeitraum || kennwert.zeitraum.trim().length === 0) {
        probleme.push(`${wo}: Der Zeitraum fehlt.`)
      }
      if (!(kennwert.quelle in eingang.quellen)) {
        probleme.push(`${wo}: Die Quelle „${kennwert.quelle}“ ist nicht hinterlegt.`)
      }
    }
  }

  for (const [schluessel, quelle] of Object.entries(eingang.quellen)) {
    if (!quelle.url.startsWith('https://')) {
      probleme.push(`Quelle „${schluessel}“ hat keinen https-Link.`)
    }
    if (quelle.label.trim().length === 0) {
      probleme.push(`Quelle „${schluessel}“ hat keine Beschriftung.`)
    }
    /*
      Die Abgrenzung ist Pflicht, nicht Zierde.

      Eine Schuldenquote nach Maastricht und eine nach IWF-Abgrenzung sind
      verschiedene Größen. Ohne den Hinweis stünden sie unkommentiert
      nebeneinander, und der Vergleich wäre falsch, ohne falsch auszusehen.
    */
    if (quelle.abgrenzung.trim().length < 20) {
      probleme.push(`Quelle „${schluessel}“: Die Abgrenzung fehlt oder ist zu knapp.`)
    }
  }

  const benutzt = new Set(
    Object.values(eingang.kennzahlen).flatMap((werte) =>
      Object.values(werte).map((kennwert) => kennwert.quelle)
    )
  )
  for (const schluessel of Object.keys(eingang.quellen)) {
    if (!benutzt.has(schluessel)) {
      probleme.push(`Quelle „${schluessel}“ wird von keinem Wert verwendet.`)
    }
  }

  return probleme
}

export function assertLaenderValid(eingang: Eingang): void {
  const probleme = validateLaender(eingang)
  if (probleme.length > 0) {
    throw new Error(
      `Die Länderdaten sind fehlerhaft:\n${probleme.map((p) => `  - ${p}`).join('\n')}`
    )
  }
}
