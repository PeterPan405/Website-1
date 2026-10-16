/**
 * Die Wirtschaftstermine der Woche aus dem Kalender von ForexFactory.
 *
 * Auftrag des Betreibers vom 16.10.2026: „Kalender ausbauen mit Daten von
 * ForexFactory". Bis dahin standen Konjunkturdaten nur von Hand im Kalender
 * – 18 Einträge in drei Monaten. ForexFactory führt jede Woche rund hundert
 * Veröffentlichungen weltweit, mit Uhrzeit, Bedeutung, Prognose und Vorwert.
 *
 * ## Die Quelle
 *
 * `https://nfs.faireconomy.media/ff_calendar_thisweek.json` – der Export,
 * den ForexFactory selbst anbietet. Am 16.10.2026 von einem Läufer geholt:
 * 111 Einträge der laufenden Woche (Sonntag bis Samstag), Zeiten in New
 * Yorker Zeit mit Versatz (`2026-10-14T08:30:00-04:00`). Eine Folgewoche
 * gibt es dort nicht (`ff_calendar_nextweek.json` antwortet 404) – der
 * Kalender reicht damit immer bis zum kommenden Samstag. Ältere Wochen hält
 * die Momentaufnahme `data/snapshots/forexfactory.json` fest, geholt von
 * `.github/workflows/konjunkturkalender.yml`.
 *
 * ## Was davon in den Kalender kommt
 *
 * Nicht alles. Der Kalender soll zeigen, worauf der Markt schaut, nicht
 * jede Rede eines Ratsmitglieds. Deshalb:
 *
 *   - nur USA, Euroraum (mit Deutschland), Großbritannien, Japan, Schweiz,
 *     China
 *   - nur, was ForexFactory als „High" oder „Medium" einstuft – und aus
 *     Deutschland zusätzlich Inflation, Wachstum und Stimmung jeder Stufe
 *   - nur Veröffentlichungen, für die hier eine Einordnung steht
 *     (`FAMILIEN`). Eine Zeile ohne Einordnung ist kein Kalendereintrag,
 *     und eine erfundene Einordnung schon gar keiner.
 *
 * Mehrere Zeilen derselben Veröffentlichung (CPI m/m, CPI y/y, Core CPI …)
 * werden ein Termin; Prognose und Vorwert stehen je Zeile in `werte`.
 *
 * Was schon von Hand im Kalender steht – ein Zinsentscheid der Fed, die
 * US-Inflation –, wird nicht verdoppelt (siehe `konjunkturtermine`).
 */
import type { Termin, TerminArt } from '@/data/kalender/typen'

export interface FfEreignis {
  title: string
  country: string
  /** ISO mit Versatz, New Yorker Zeit. */
  date: string
  impact: string
  forecast?: string
  previous?: string
}

export interface FfMomentaufnahme {
  /** Wann zuletzt geholt, ISO. */
  abgerufen: string
  ereignisse: FfEreignis[]
}

export const FF_QUELLE = {
  label: 'ForexFactory, Wirtschaftskalender',
  url: 'https://www.forexfactory.com/calendar',
}

/** So lange bleibt eine Woche in der Momentaufnahme stehen. */
export const AUFBEWAHREN_TAGE = 70

/** Was eine Antwort mindestens haben muss, damit sie als Kalender gilt. */
export function pruefeFeed(daten: unknown): string[] {
  const f: string[] = []
  if (!Array.isArray(daten)) return ['Die Antwort ist keine Liste.']
  if (daten.length < 20)
    f.push(`Nur ${daten.length} Einträge – eine Woche hat sonst rund hundert.`)
  for (const [i, e] of daten.entries()) {
    const ok =
      e &&
      typeof e.title === 'string' &&
      typeof e.country === 'string' &&
      typeof e.impact === 'string' &&
      typeof e.date === 'string' &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/.test(e.date)
    if (!ok) {
      f.push(
        `Eintrag ${i} hat nicht die erwartete Form: ${JSON.stringify(e).slice(0, 120)}`
      )
      if (f.length > 5) break
    }
  }
  return f
}

const schluessel = (e: FfEreignis) => `${e.date}|${e.country}|${e.title}`

/**
 * Die neue Woche in die Momentaufnahme mischen.
 *
 * Im Zeitraum, den der neue Abruf abdeckt, gilt nur er – so verschwindet ein
 * verschobener oder gestrichener Termin. Davor bleibt stehen, was war, bis
 * es älter als `AUFBEWAHREN_TAGE` ist.
 */
export function mischeFeed(
  alt: FfMomentaufnahme | null,
  neu: FfEreignis[],
  jetzt: Date
): FfMomentaufnahme {
  const tage = neu.map((e) => e.date.slice(0, 10)).sort()
  const von = tage[0]
  const bis = tage.at(-1)!
  const grenze = new Date(jetzt.getTime() - AUFBEWAHREN_TAGE * 86_400_000)
    .toISOString()
    .slice(0, 10)
  const bleiben = (alt?.ereignisse ?? []).filter((e) => {
    const tag = e.date.slice(0, 10)
    return tag >= grenze && (tag < von || tag > bis)
  })
  const gesehen = new Set<string>()
  const ereignisse = [...bleiben, ...neu]
    .filter((e) => {
      const k = schluessel(e)
      if (gesehen.has(k)) return false
      gesehen.add(k)
      return true
    })
    .sort((a, b) => schluessel(a).localeCompare(schluessel(b)))
  return { abgerufen: jetzt.toISOString(), ereignisse }
}

/**
 * Eine Zeile je Termin – im Diff lesbar, und Prettier fasst die Datei nicht
 * an (`.prettierignore`), sonst meldete der Paketbau sie nach jedem Abruf
 * als falsch formatiert.
 */
export function serialisiereFf(m: FfMomentaufnahme): string {
  const zeilen = m.ereignisse.map((e) => `    ${JSON.stringify(e)}`)
  return `{\n  "abgerufen": ${JSON.stringify(m.abgerufen)},\n  "ereignisse": [\n${zeilen.join(',\n')}\n  ]\n}\n`
}

/* ------------------------------------------------------------ Einordnung */

const ORTE: Record<string, string> = {
  USD: 'USA',
  EUR: 'Euroraum',
  GBP: 'Großbritannien',
  JPY: 'Japan',
  CHF: 'Schweiz',
  CNY: 'China',
}

const LAENDER_PRAEFIX: [RegExp, string][] = [
  [/^German /, 'Deutschland'],
  [/^French /, 'Frankreich'],
  [/^Italian /, 'Italien'],
  [/^Spanish /, 'Spanien'],
]

const SYMBOLE: Record<string, string[]> = {
  USA: ['sp500', 'eur-usd'],
  Euroraum: ['euro-stoxx-50', 'eur-usd'],
  Deutschland: ['dax', 'eur-usd'],
  Frankreich: ['euro-stoxx-50'],
  Italien: ['euro-stoxx-50'],
  Spanien: ['euro-stoxx-50'],
  Großbritannien: ['ftse-100', 'eur-gbp'],
  Japan: ['nikkei-225'],
  Schweiz: ['smi', 'eur-chf'],
  China: ['hang-seng'],
}

interface Familie {
  id: string
  muster: RegExp
  art: TerminArt
  name: string
  bedeutung: string
  themen: string[]
  /** Woran ein gepflegter Termin derselben Familie zu erkennen ist. */
  gepflegt: RegExp
  /** Aus Deutschland auch bei niedriger Einstufung. */
  deutschlandImmer?: boolean
}

/*
  Die Reihenfolge zählt: Die erste passende Familie gewinnt. Deshalb stehen
  die Sonderfälle (Kerninflation PCE, US-Arbeitsmarktbericht, Reden) vor
  den allgemeinen.
*/
export const FAMILIEN: Familie[] = [
  {
    id: 'rede',
    muster:
      /^(Fed Chairman|Fed Chair|ECB President|BOE Gov|BOJ Gov|SNB Chairman) (.+) Speaks$/,
    art: 'notenbank',
    name: 'Rede',
    bedeutung:
      'Was die Spitze einer Notenbank öffentlich sagt, lesen Anleger auf Hinweise zum nächsten Zinsschritt. Schon ein Nebensatz kann Währung und Anleihen bewegen.',
    themen: ['notenbanken-geldpolitik'],
    gepflegt: /Rede|Pressekonferenz/,
  },
  {
    id: 'zinsen',
    muster:
      /Federal Funds Rate|Main Refinancing Rate|Official Bank Rate|BOJ Policy Rate|SNB Policy Rate|Monetary Policy Statement|FOMC Statement|Press Conference|Policy Rate/,
    art: 'notenbank',
    name: 'Zinsentscheid',
    bedeutung:
      'Die Notenbank legt den Leitzins fest. Er bestimmt, was Tagesgeld bringt und Kredite kosten, und bewegt Währung und Anleihen in den Minuten nach der Bekanntgabe.',
    themen: ['notenbanken-geldpolitik', 'tagesgeld'],
    gepflegt: /Zinsentscheid/,
  },
  {
    id: 'protokoll',
    muster: /Meeting Minutes|Monetary Policy Meeting Accounts|MPC Meeting Minutes/,
    art: 'notenbank',
    name: 'Sitzungsprotokoll der Notenbank',
    bedeutung:
      'Das Protokoll der letzten Sitzung zeigt, wie einig sich die Notenbank war und ob weitere Zinsschritte zur Sprache kamen.',
    themen: ['notenbanken-geldpolitik'],
    gepflegt: /Protokoll/,
  },
  {
    id: 'pce',
    muster: /PCE Price Index/,
    art: 'konjunktur',
    name: 'PCE-Preisindex',
    bedeutung:
      'Das Inflationsmaß, auf das die US-Notenbank selbst schaut. Weicht es von der Prognose ab, verschieben sich die Erwartungen an den nächsten Zinsentscheid.',
    themen: ['inflation', 'notenbanken-geldpolitik'],
    gepflegt: /PCE/,
  },
  {
    id: 'inflation',
    muster: /\bCPI\b|Consumer Price|HICP|Inflation Rate/,
    art: 'konjunktur',
    name: 'Verbraucherpreise',
    bedeutung:
      'Die Inflationsrate entscheidet mit darüber, wie die Notenbank die Zinsen setzt. Fällt sie höher aus als erwartet, rechnen Anleger mit länger hohen Zinsen.',
    themen: ['inflation', 'notenbanken-geldpolitik'],
    gepflegt: /Verbraucherpreise|Inflation/,
    deutschlandImmer: true,
  },
  {
    id: 'erzeugerpreise',
    muster: /\bPPI\b|Producer Price/,
    art: 'konjunktur',
    name: 'Erzeugerpreise',
    bedeutung:
      'Die Preise, die Hersteller verlangen. Sie laufen den Verbraucherpreisen oft voraus und zeigen früh, ob Teuerung in der Lieferkette nachkommt.',
    themen: ['inflation'],
    gepflegt: /Erzeugerpreise/,
  },
  {
    id: 'arbeitsmarktbericht',
    muster: /Non-Farm Employment Change|Average Hourly Earnings/,
    art: 'konjunktur',
    name: 'Arbeitsmarktbericht',
    bedeutung:
      'Wie viele Stellen die US-Wirtschaft geschaffen hat und wie stark die Löhne steigen. Kaum ein Termin bewegt Dollar, Anleihen und Aktien so verlässlich.',
    themen: ['wie-funktioniert-der-markt', 'notenbanken-geldpolitik'],
    gepflegt: /Arbeitsmarkt/,
  },
  {
    id: 'erstantraege',
    muster: /Unemployment Claims/,
    art: 'konjunktur',
    name: 'Erstanträge auf Arbeitslosenhilfe',
    bedeutung:
      'Die wöchentliche Zahl neuer Anträge – das schnellste Signal dafür, ob Unternehmen Personal abbauen.',
    themen: ['wie-funktioniert-der-markt'],
    gepflegt: /Erstanträge/,
  },
  {
    id: 'arbeitsmarkt',
    muster: /Unemployment Rate|Employment Change|Claimant Count/,
    art: 'konjunktur',
    name: 'Arbeitsmarktdaten',
    bedeutung:
      'Ein starker Arbeitsmarkt stützt den Konsum, kann aber Zinssenkungen hinauszögern – deshalb schauen Notenbank und Anleihemarkt genau hin.',
    themen: ['wie-funktioniert-der-markt'],
    gepflegt: /Arbeitsmarkt|Arbeitslos/,
  },
  {
    id: 'bip',
    muster: /\bGDP\b/,
    art: 'konjunktur',
    name: 'Bruttoinlandsprodukt',
    bedeutung:
      'Wie stark die Wirtschaft gewachsen oder geschrumpft ist. Die erste Schätzung wird später oft noch spürbar korrigiert.',
    themen: ['wie-funktioniert-der-markt'],
    gepflegt: /Bruttoinlandsprodukt|BIP/,
    deutschlandImmer: true,
  },
  {
    id: 'einzelhandel',
    muster: /Retail Sales/,
    art: 'konjunktur',
    name: 'Einzelhandelsumsatz',
    bedeutung:
      'Zeigt, wie viel die Verbraucher ausgeben und wie belastbar der Konsum ist – die wichtigste Stütze vieler Volkswirtschaften.',
    themen: ['wie-funktioniert-der-markt'],
    gepflegt: /Einzelhandel/,
  },
  {
    id: 'einkaufsmanager',
    muster: /\bPMI\b|\bISM\b/,
    art: 'konjunktur',
    name: 'Einkaufsmanagerindex',
    bedeutung:
      'Eine Umfrage unter Einkaufsleitern: Werte über 50 deuten auf Wachstum, darunter auf Schrumpfung. Sie kommt Wochen früher als amtliche Zahlen.',
    themen: ['wie-funktioniert-der-markt'],
    gepflegt: /Einkaufsmanager|ISM/,
  },
  {
    id: 'stimmung',
    muster:
      /\bifo\b|\bZEW\b|Sentix|GfK|Consumer Sentiment|Consumer Confidence|Philly Fed|Empire State/,
    art: 'konjunktur',
    name: 'Stimmungsindex',
    bedeutung:
      'Ein Stimmungsindex misst keine Produktion. Er kommt dafür früher als jede amtliche Zahl – und irrt sich entsprechend öfter.',
    themen: ['wie-funktioniert-der-markt', 'anlegerpsychologie'],
    gepflegt: /ifo|ZEW|Stimmung|Geschäftsklima|Verbrauchervertrauen/,
    deutschlandImmer: true,
  },
  {
    id: 'industrie',
    muster: /Industrial Production|Factory Orders|Durable Goods|Manufacturing Production/,
    art: 'konjunktur',
    name: 'Industriedaten',
    bedeutung:
      'Produktion und Aufträge der Industrie zeigen, ob die Unternehmen mehr herstellen oder weniger – ein Gradmesser für den Konjunkturzyklus.',
    themen: ['wie-funktioniert-der-markt'],
    gepflegt: /Industrie|Auftragseingang/,
  },
  {
    id: 'handelsbilanz',
    muster: /Trade Balance/,
    art: 'konjunktur',
    name: 'Handelsbilanz',
    bedeutung:
      'Der Unterschied zwischen Ausfuhren und Einfuhren. Er wirkt auf die Währung und zeigt, wie stark ein Land von der Weltnachfrage abhängt.',
    themen: ['waehrungen-wechselkurse'],
    gepflegt: /Handelsbilanz|Exporte/,
  },
  {
    id: 'immobilien',
    muster:
      /Building Permits|Housing Starts|Existing Home Sales|New Home Sales|Pending Home Sales/,
    art: 'konjunktur',
    name: 'Immobilienmarkt',
    bedeutung:
      'Baugenehmigungen und Hausverkäufe reagieren früh auf die Zinsen – an ihnen zeigt sich zuerst, wie stark teure Kredite bremsen.',
    themen: ['immobilien'],
    gepflegt: /Immobilien|Baugenehmigung/,
  },
  {
    id: 'oel',
    muster: /Crude Oil Inventories/,
    art: 'konjunktur',
    name: 'Rohölvorräte',
    bedeutung:
      'Die wöchentlichen Lagerbestände. Steigen sie stärker als erwartet, drückt das meist auf den Ölpreis, sinken sie, stützt es ihn.',
    themen: ['rohstoffe'],
    gepflegt: /Rohöl|Ölvorräte/,
  },
]

const ROLLEN: Record<string, string> = {
  'Fed Chairman': 'Fed',
  'Fed Chair': 'Fed',
  'ECB President': 'EZB',
  'BOE Gov': 'Bank of England',
  'BOJ Gov': 'Bank of Japan',
  'SNB Chairman': 'SNB',
}

/** Zeit in Berlin – Tag und „8:30 Uhr", ohne Zeitzonen-Rechnerei von Hand. */
export function inBerlin(iso: string): { tag: string; uhrzeit: string | null } {
  const d = new Date(iso)
  const teile = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Berlin',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(d)
      .map((t) => [t.type, t.value])
  )
  /* Mitternacht in New York heißt bei ForexFactory „ganztägig" oder
     „noch offen" – eine Uhrzeit daraus wäre erfunden. */
  const ganztaegig = iso.slice(11, 16) === '00:00'
  return {
    tag: `${teile.year}-${teile.month}-${teile.day}`,
    uhrzeit: ganztaegig ? null : `${Number(teile.hour)}:${teile.minute} Uhr`,
  }
}

/** „0.3%" → „0,3 %", „215K" → „215 Tsd." */
export function wertDeutsch(wert: string | undefined): string | undefined {
  const w = (wert ?? '').trim()
  if (!w) return undefined
  return w
    .replace(/(\d)\.(\d)/g, '$1,$2')
    .replace(/(\d)%$/, '$1 %')
    .replace(/(\d)K$/, '$1 Tsd.')
    .replace(/(\d)M$/, '$1 Mio.')
    .replace(/(\d)B$/, '$1 Mrd.')
    .replace(/(\d)T$/, '$1 Bio.')
}

export interface KonjunkturAuswahl {
  termine: Termin[]
  /** Was in Frage kam, aber keine Familie hat – für das Protokoll. */
  ohneEinordnung: string[]
}

/**
 * Aus der Momentaufnahme die Kalendertermine.
 *
 * `gepflegt` sind die Termine, die von Hand im Kalender stehen. Was davon
 * schon abgedeckt ist – gleicher Tag, gleicher Ort, gleiche Familie –, kommt
 * nicht ein zweites Mal: Steht am 14.10. „US-Verbraucherpreise für
 * September" von Hand drin, fällt „USA: Verbraucherpreise" weg. Der
 * gepflegte Eintrag hat die bessere Einordnung.
 */
export function konjunkturtermine(
  ereignisse: FfEreignis[],
  gepflegt: readonly Termin[] = []
): KonjunkturAuswahl {
  const gruppen = new Map<
    string,
    {
      familie: Familie
      ort: string
      tag: string
      uhrzeit: string | null
      zeilen: FfEreignis[]
      namen: Set<string>
    }
  >()
  const ohneEinordnung = new Set<string>()

  for (const e of ereignisse) {
    const grundort = ORTE[e.country]
    if (!grundort) continue
    const praefix = LAENDER_PRAEFIX.find(([m]) => m.test(e.title))
    const ort = praefix ? praefix[1] : grundort
    const stufe = e.impact === 'High' || e.impact === 'Medium'
    const familie = FAMILIEN.find((f) => f.muster.test(e.title))
    if (!familie) {
      if (stufe) ohneEinordnung.add(`${e.country}: ${e.title}`)
      continue
    }
    if (!stufe && !(ort === 'Deutschland' && familie.deutschlandImmer)) continue
    if (familie.id === 'rede') {
      const rolle = familie.muster.exec(e.title)![1]
      const fuehrend = rolle.startsWith('Fed') || rolle === 'ECB President'
      if (!fuehrend && e.impact !== 'High') continue
    }
    const { tag, uhrzeit } = inBerlin(e.date)
    const k = `${tag}|${ort}|${familie.id}`
    const g = gruppen.get(k) ?? {
      familie,
      ort,
      tag,
      uhrzeit,
      zeilen: [],
      namen: new Set(),
    }
    if (uhrzeit && (!g.uhrzeit || zeitWert(uhrzeit) < zeitWert(g.uhrzeit)))
      g.uhrzeit = uhrzeit
    g.zeilen.push(e)
    if (familie.id === 'rede') {
      const [, rolle, name] = familie.muster.exec(e.title)!
      g.namen.add(`${name} (${ROLLEN[rolle]})`)
    }
    gruppen.set(k, g)
  }

  const abgedeckt = (g: { familie: Familie; ort: string; tag: string }) =>
    gepflegt.some(
      (t) =>
        t.datum === g.tag &&
        t.art === g.familie.art &&
        t.ort === g.ort &&
        g.familie.gepflegt.test(t.titel)
    )

  const termine: Termin[] = [...gruppen.values()]
    .filter((g) => !abgedeckt(g))
    .map((g) => {
      const titel =
        g.familie.id === 'rede'
          ? `${g.ort}: Rede – ${[...g.namen].join(', ')}`
          : `${g.ort}: ${g.familie.name}`
      const werte = g.zeilen
        .filter((z) => (z.forecast ?? '').trim() || (z.previous ?? '').trim())
        .map((z) => ({
          name: z.title
            .replace(/^(German|French|Italian|Spanish) /, '')
            .replace(/ m\/m$/, ' ggü. Vormonat')
            .replace(/ q\/q$/, ' ggü. Vorquartal')
            .replace(/ y\/y$/, ' ggü. Vorjahr'),
          prognose: wertDeutsch(z.forecast),
          vorher: wertDeutsch(z.previous),
        }))
      return {
        datum: g.tag,
        titel,
        art: g.familie.art,
        ort: g.ort,
        ...(g.uhrzeit ? { uhrzeit: g.uhrzeit } : {}),
        bedeutung: g.familie.bedeutung,
        themen: g.familie.themen,
        symbole: SYMBOLE[g.ort] ?? [],
        ...(werte.length ? { werte } : {}),
        quelle: FF_QUELLE,
      }
    })

  return { termine, ohneEinordnung: [...ohneEinordnung].sort() }
}

function zeitWert(uhrzeit: string): number {
  const [h, m] = uhrzeit.replace(' Uhr', '').split(':').map(Number)
  return h * 60 + m
}
