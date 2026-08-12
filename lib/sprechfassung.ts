/**
 * Die Sprechfassung: aus einer Tagesausgabe wird eine Podcastfolge.
 *
 * ## Woher die Regeln kommen
 *
 * Bis August 2026 entstand der tägliche Podcast „Börse am Morgen“ von Hand:
 * Zusammenfassung im Chat, Vertonung bei ElevenLabs, Hochladen. Die
 * Arbeitsanweisung dieses Ablaufs ist hier Zeile für Zeile übernommen –
 * fester Einstieg und Abschluss, Freitagsvariante, Fazit-Absatz,
 * ausgeschriebene Zahlen, 710 bis 740 Wörter, Folgennummer ab dem
 * 30. Juli 2026.
 *
 * ## Warum die Quelle die Tagesausgabe ist und nicht die Website
 *
 * Die alte Anweisung beschreibt drei Fehlerquellen beim Abruf von
 * iminvests.de: veraltete Zwischenspeicher, zu frühe Abrufzeiten und die
 * Verwechslung mit den automatischen Zahlen-Beiträgen. Alle drei entfallen,
 * wenn die Quelle `data/editions/JJJJ-MM-TT.ts` ist – dieselbe Datei, aus
 * der auch die Nachrichtenseite entsteht. Was dort steht, ist recherchiert,
 * geprüft und bereits veröffentlicht.
 *
 * ## Warum Zahlen ausgeschrieben werden
 *
 * Die KI-Stimme betont „26.364,00 Punkte“ falsch oder liest es englisch.
 * „sechsundzwanzigtausenddreihundertvierundsechzig Punkte“ kann sie nicht
 * missverstehen. Nachkommastellen werden Ziffer für Ziffer gesprochen, so
 * verlangt es die Vorlage: „null Komma acht eins Prozent“.
 *
 * Ohne Laufzeitimporte, damit `tests/` das Modul direkt laden kann.
 */

import type { DailyEdition, EditionItem } from '@/data/editions/types'
import { hashtagZeile } from './social-text.ts'

/* ------------------------------------------------------------- Zahlwörter */

const EINER = [
  'null',
  'ein',
  'zwei',
  'drei',
  'vier',
  'fünf',
  'sechs',
  'sieben',
  'acht',
  'neun',
]
const ZEHN_BIS_NEUNZEHN = [
  'zehn',
  'elf',
  'zwölf',
  'dreizehn',
  'vierzehn',
  'fünfzehn',
  'sechzehn',
  'siebzehn',
  'achtzehn',
  'neunzehn',
]
const ZEHNER = [
  '',
  '',
  'zwanzig',
  'dreißig',
  'vierzig',
  'fünfzig',
  'sechzig',
  'siebzig',
  'achtzig',
  'neunzig',
]

/** Ganze Zahl bis unter eine Billion als deutsches Zahlwort. */
export function zahlwort(n: number): string {
  if (!Number.isFinite(n) || n < 0) return String(n)
  if (n === 0) return 'null'

  function bisTausend(rest: number): string {
    let wort = ''
    const hundert = Math.floor(rest / 100)
    const zehnerRest = rest % 100
    if (hundert > 0) wort += `${EINER[hundert]}hundert`
    if (zehnerRest === 0) return wort
    if (zehnerRest < 10) return wort + (zehnerRest === 1 ? 'eins' : EINER[zehnerRest])
    if (zehnerRest < 20) return wort + ZEHN_BIS_NEUNZEHN[zehnerRest - 10]
    const einerRest = zehnerRest % 10
    const zehnerWert = Math.floor(zehnerRest / 10)
    if (einerRest === 0) return wort + ZEHNER[zehnerWert]
    return wort + `${EINER[einerRest]}und${ZEHNER[zehnerWert]}`
  }

  const teile: string[] = []
  const milliarden = Math.floor(n / 1_000_000_000)
  const millionen = Math.floor((n % 1_000_000_000) / 1_000_000)
  const tausender = Math.floor((n % 1_000_000) / 1000)
  const rest = n % 1000

  if (milliarden === 1) teile.push('eine Milliarde ')
  else if (milliarden > 1) teile.push(`${bisTausend(milliarden)} Milliarden `)
  if (millionen === 1) teile.push('eine Million ')
  else if (millionen > 1) teile.push(`${bisTausend(millionen)} Millionen `)
  if (tausender === 1) teile.push('eintausend')
  else if (tausender > 1) teile.push(`${bisTausend(tausender)}tausend`)
  if (rest > 0) {
    /* Alleinstehende Eins heißt „eins“, im Verbund „ein“: „eintausendeins“. */
    if (teile.length === 0 && rest === 1) teile.push('eins')
    else teile.push(bisTausend(rest))
  }
  return teile.join('').trim()
}

/* -------------------------------------------------------- Ordnungszahlen */

/**
 * Die Endung einer Ordnungszahl. Sie hängt nicht an der Zahl, sondern am
 * Satz – siehe `ordnungszahl()`.
 */
type Endung = 'e' | 'en' | 'er' | 'es'

/**
 * Ordnungszahl für Monatstage, in der Beugung, die der Satz verlangt.
 *
 * **Eine Ordnungszahl ist ein Adjektiv und wird wie eines gebeugt.** Welche
 * Endung sie trägt, entscheidet das Wort davor:
 *
 *     der 9. August       →  der neunte August       Nominativ
 *     am 9. August        →  am neunten August       Dativ
 *     den 9. August       →  den neunten August      Akkusativ
 *     Stand 9. August     →  Stand neunter August    ohne Artikel
 *
 * Bis zum 10. August 2026 gab es hier nur die erste Form. Damit sprach die
 * Folge „am neunte August“, und im Podcast fällt das sofort auf: Geschrieben
 * steht dort „9.“, und wer liest, beugt selbst mit. Erst die Stimme macht die
 * fehlende Endung hörbar.
 */
export function ordnungszahl(tag: number, endung: Endung = 'e'): string {
  /* Vier Stämme lassen sich nicht aus dem Zahlwort bilden: „eint“, „dreit“,
     „siebent“ und „achtt“ gibt es nicht. */
  const staemme: Record<number, string> = { 1: 'erst', 3: 'dritt', 7: 'siebt', 8: 'acht' }
  const stamm = staemme[tag] ?? (tag < 20 ? `${zahlwort(tag)}t` : `${zahlwort(tag)}st`)
  return stamm + endung
}

/* Wörter, die den Fall der folgenden Ordnungszahl setzen. Dativ, Akkusativ
   und Genitiv verlangen bei bestimmtem Artikel dieselbe Endung `-en`; sie
   müssen deshalb nicht auseinandergehalten werden. */
const GEBEUGT = new Set([
  'am',
  'im',
  'vom',
  'zum',
  'beim',
  'dem',
  'den',
  'des',
  'diesem',
  'diesen',
  'dieses',
  'jenem',
  'jenen',
  'jenes',
  'seinem',
  'seinen',
  'ihrem',
  'ihren',
  'meinem',
  'meinen',
  'unserem',
  'unseren',
])
const NOMINATIV = new Set([
  'der',
  'das',
  'dieser',
  'diese',
  'jener',
  'welcher',
  'welches',
])

/** Monatsnamen sind männlich, Quartal und Halbjahr sächlich. */
const MASKULIN: Record<string, Endung> = { gebeugt: 'en', nominativ: 'e', bloss: 'er' }
const NEUTRUM: Record<string, Endung> = { gebeugt: 'en', nominativ: 'e', bloss: 'es' }

function fall(davor: string | undefined): 'gebeugt' | 'nominativ' | 'bloss' {
  const wort = davor?.trim().toLowerCase() ?? ''
  if (GEBEUGT.has(wort)) return 'gebeugt'
  if (NOMINATIV.has(wort)) return 'nominativ'
  /* Kein Artikel, keine Präposition: „Stand 9. August“ heißt „neunter“. */
  return 'bloss'
}

const MONATSNAMEN =
  'Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember'

/*
  Mehrere Tage vor einem Monatsnamen gehören zusammen: „vom 28. und 29. Juli“.
  Ohne diese Klammer sähe die Regel nur den 29., und die 28. fiele der
  Zahlregel zu – „vom achtundzwanzig. und neunundzwanzigsten Juli“.
*/
const DATUM = new RegExp(
  String.raw`([A-Za-zÄÖÜäöüß]+ )?` +
    String.raw`(\d{1,2}\.(?:\s*(?:und|bis|oder|sowie)\s*\d{1,2}\.)*)` +
    String.raw`\s*(${MONATSNAMEN})\b`,
  'g'
)

/* Quartale und Halbjahre folgen derselben Regel: „im 2. Quartal“ heißt
   „im zweiten Quartal“, nicht „im zwei. Quartal“. */
const ZEITRAUM = /([A-Za-zÄÖÜäöüß]+ )?([1-4])\.\s*(Quartal|Halbjahr)\b/g

/**
 * Schreibt Ordnungszahlen vor Monaten, Quartalen und Halbjahren aus – gebeugt
 * nach dem Wort davor.
 *
 * Steht getrennt von `sprechbar()`, weil die Lernseiten sie brauchen, ohne
 * dass dort jede Zahl zum Wort wird: In einer Lektion ist „26.364,45“ eine
 * Zahl zum Anschauen, in der Folge ein Wort zum Hören.
 */
export function ordnungszahlenSprechbar(text: string): string {
  let s = text.replaceAll(
    DATUM,
    (_, davor: string | undefined, tage: string, monat: string) => {
      const endung = MASKULIN[fall(davor)]
      const gesprochen = tage.replaceAll(/(\d{1,2})\./g, (__, tag: string) =>
        ordnungszahl(Number(tag), endung)
      )
      return `${davor ?? ''}${gesprochen} ${monat}`
    }
  )
  s = s.replaceAll(
    ZEITRAUM,
    (_, davor: string | undefined, zahl: string, wort: string) =>
      `${davor ?? ''}${ordnungszahl(Number(zahl), NEUTRUM[fall(davor)])} ${wort}`
  )
  return s
}

/* ----------------------------------------------------- Text sprechbar machen */

/**
 * Eine Zahl aus dem Fließtext in Sprechform: „26.364,45“ →
 * „sechsundzwanzigtausenddreihundertvierundsechzig Komma vier fünf“.
 */
function zahlAlsSprechform(ganz: string, nachkomma?: string): string {
  const wert = Number(ganz.replaceAll('.', ''))
  let wort = zahlwort(wert)
  if (nachkomma) {
    const ziffern = [...nachkomma]
      .map((z) =>
        z === '0' ? 'null' : EINER[Number(z)] === 'ein' ? 'eins' : EINER[Number(z)]
      )
      .join(' ')
    wort += ` Komma ${ziffern}`
  }
  return wort
}

/**
 * Englische Namen in deutscher Lautschrift.
 *
 * ## Warum das nötig ist
 *
 * Die Stimme ist ein **deutsches** Modell. Es liest, was dasteht, nach
 * deutschen Regeln – und macht aus „Alphabet" dasselbe Wort wie aus dem ABC
 * und aus „Goldman Sachs" etwas, das mit dem Unternehmen nur die Buchstaben
 * teilt. Der Betreiber hat es am 11. August 2026 beim Hören gemeldet: „klingt
 * komisch."
 *
 * Es gibt keinen Schalter dafür. Ein Modell, das mitten im deutschen Satz auf
 * englische Aussprache umschaltet, müsste die Sprache je Wort erkennen; das
 * kann dieses nicht. Was bleibt, ist der Weg, den Vorleseprogramme seit jeher
 * gehen: **den Namen so schreiben, wie er klingen soll.**
 *
 * ## Wie die Umschrift gewählt ist
 *
 * Nicht nach Lautschrift, sondern nach dem, was ein deutsches Modell daraus
 * macht. „Ällfabet" trifft es, „ˈælfəbɛt" nicht – das Modell kennt keine
 * IPA-Zeichen und spräche sie einzeln.
 *
 * Doppelvokale und Konsonanten steuern die Länge: „Säx" wird kurz gesprochen,
 * „Sähx" lang. Wo ein englischer Laut im Deutschen fehlt – das „th" in
 * „Berkshire Hathaway" –, steht die nächstliegende Näherung; ein „Häthaweh"
 * ist näher an der Sache als ein deutsches „Hathawai".
 *
 * ## Was hier **nicht** hineingehört
 *
 * Namen, die im Deutschen ohnehin deutsch gesprochen werden (Siemens, Allianz,
 * Bayer), und solche, bei denen die deutsche Lesart längst üblich ist
 * (Microsoft). Wer hier zu viel einträgt, macht aus einer Nachrichtensendung
 * eine Karikatur.
 *
 * Die Liste ist bewusst kurz und wächst nur mit dem, was tatsächlich
 * auffällt – gehört, nicht vermutet.
 */
const ENGLISCHE_NAMEN: [RegExp, string][] = [
  /*
    Der eigene Name zuerst, und er ist der wichtigste Eintrag der Tabelle:
    Er fällt in jeder Folge zweimal, in Begrüßung und Abschluss.

    „IM" ist im Deutschen ein Wort. Die Stimme las „das Marktupdate von IM
    Invests" also als „vom im Invests" – zwei Buchstaben, die eine Marke
    tragen sollen, verschluckt zu einer Präposition. Gesprochen wird die
    Marke englisch, Buchstabe für Buchstabe: „Ei Emm Inwests".

    Deshalb steht das Muster **gross** und ohne `i`-Schalter: Ein
    unempfindliches `\bIM\b` träfe jedes deutsche „im".
  */
  [/\bIM Invests\b/g, 'Ei Emm Inwests'],
  [/\bAlphabet\b/g, 'Ällfabett'],
  /* Wie bei Berkshire steht die Kurzform hinter der langen: Erst „Goldman
     Sachs", dann das allein stehende „Goldman" – so, wie es der Nachrichten-
     text oft schreibt („Goldman warnt vor …"). Umgekehrte Reihenfolge
     zerlegte den Namen und ließe „Sachs" deutsch stehen. */
  [/\bGoldman Sachs\b/g, 'Goldmänn Sacks'],
  [/\bGoldman\b/g, 'Goldmänn'],
  [/\bBerkshire Hathaway\b/g, 'Berkschir Häthaweh'],
  [/\bBerkshire\b/g, 'Berkschir'],
  [/\bMorgan Stanley\b/g, 'Morgen Stänli'],
  [/\bJPMorgan\b/g, 'Dschej-Pi-Morgen'],
  [/\bBank of America\b/g, 'Bänk of Amerika'],
  /*
    Zwei Fallen, die die deutsche Rechtschreibung stellt – und beide sind
    dem Betreiber am 11. August 2026 im Ohr aufgefallen:

    1. **„st" am Wortanfang ist /scht/.** „Striet" las die Stimme als
       „Schtriet", „Stoxx" als „Schtox". Mitten im Wort gilt das nicht:
       In „Fenster" und „Liste" ist es sauberes /st/. Deshalb werden die
       Bestandteile **zusammengeschrieben** – aus zwei Wörtern wird eines,
       und die Falle ist weg.
    2. **„W" am Wortanfang ist /v/.** Aus „Wohl Striet" wurde damit
       „Vohl Schtriet". Für den englischen /w/-Laut steht „U".

    „Wall Street" hieß deshalb bis dahin „Wohl Striet" und traf beide Fallen
    auf einmal. Wer hier etwas ergänzt, prüft beide.
  */
  [/\bWall Street\b/g, 'Uallstriet'],
  [/\bEuro[ -]?Sto(?:xx|cks)\b/gi, 'Eurostocks'],
  [/\bSto(?:xx|cks) Europe\b/gi, 'Stocks Juropp'],
  [/\bNvidia\b/gi, 'Enwidia'],
  [/\bTesla\b/g, 'Tessla'],
  [/\bAmazon\b/g, 'Ämmazon'],
  [/\bApple\b/g, 'Äppl'],
  [/\bGoogle\b/g, 'Guhgl'],
  [/\bNetflix\b/g, 'Nettflix'],
  [/\bBoeing\b/g, 'Bo-ing'],
  [/\bCoca-Cola\b/g, 'Koka Kohla'],
  [/\bJohnson & Johnson\b/g, 'Dschonson und Dschonson'],
  [/\bGeneral Motors\b/g, 'Dschennerel Motors'],
  [/\bHome Depot\b/g, 'Hohm Diepoh'],
  [/\bCharles Schwab\b/g, 'Tscharls Schwobb'],
  [/\bJensen Huang\b/g, 'Dschensen Huang'],
  [/\bWarren Buffett\b/g, 'Uoren Baffett'],
  [/\bBuffett\b/g, 'Baffett'],
  [/\bJefferies\b/g, 'Dschefferis'],
  [/\bBitwise\b/g, 'Bittweiß'],
  [/\bDow Jones\b/g, 'Dau Dschons'],
  [/\bNasdaq\b/gi, 'Nässdack'],
  [/\bFederal Reserve\b/g, 'Fedderel Riserv'],
  [/\bTreasury\b/g, 'Treschery'],
  [/\bBofA\b/g, 'Bänk of Amerika'],
  [/\bOpenAI\b/g, 'Ohpen Ej Ei'],
  [/\bAnthropic\b/g, 'Änthropick'],
  [/\bMicrosoft\b/g, 'Meikrosoft'],
  [/\bOracle\b/g, 'Orakl'],
  [/\bPalantir\b/g, 'Pallantihr'],
  [/\bGitHub\b/g, 'Gitthabb'],
  [/\bBig Tech\b/g, 'Bigg Teck'],
  [/\bFear[- ]and[- ]Greed\b/g, 'Fier and Griedd'],
  [/\bUnderperform\b/g, 'Anderperform'],
  [/\bOutperform\b/g, 'Autperform'],
  [/\bValue\b/g, 'Wällju'],
  [/\bCash\b/g, 'Käsch'],
  [/\bNews\b/g, 'Njuhs'],
  [/\bMeta\b/g, 'Metta'],
  [/\bBitcoin\b/g, 'Bittkoin'],
  [/\bStrategy\b/g, 'Strättedschi'],
  [/\bMicroStrategy\b/g, 'Meikro-Strättedschi'],
  [/\bCoinbase\b/g, 'Koinbejs'],
  [/\bBlackRock\b/g, 'Bläck Rock'],
  [/\bVanguard\b/g, 'Wängguard'],
  [/\bHold\b/g, 'Hohld'],
  [/\bBuy\b/g, 'Bai'],

  /* ------------------------------------------------------- Anglizismen
     Bis hierher standen nur Namen. Am 11. August 2026 hat der Betreiber die
     Regel erweitert: **Was englisch ist, wird englisch gesprochen – auch
     Anglizismen.** Ein Börsentext besteht zur Hälfte aus ihnen, und die
     Stimme las sie Buchstabe für Buchstabe deutsch: „Boom" als „Bohm",
     „Rating" als „Ratting", „Cashflow" als „Kaschflow".

     Zusammengesetzte Wörter zuerst, sonst zerlegt die Einzelregel sie:
     „Cashflow" vor „Cash", „Marktupdate" vor „Update".

     Die Umschrift folgt derselben Regel wie oben – deutsche Rechtschreibung
     für einen englischen Klang, keine Lautschrift. */
  [/\bMarktupdate\b/g, 'Markt-Appdejt'],
  [/\bCashflow\b/g, 'Käschflau'],
  [/\bBuyback\b/g, 'Bajbeck'],
  [/\bSell-?off\b/g, 'Sellof'],
  [/\bSpin-?off\b/g, 'Spinnof'],
  [/\bStart-?up\b/g, 'Startapp'],
  [/\bBlue Chips?\b/g, 'Bluh Tschipps'],
  [/\bSmall Caps?\b/g, 'Smohl Kepps'],
  [/\bLarge Caps?\b/g, 'Lahdsch Kepps'],
  [/\bPrivate Equity\b/g, 'Preiwet Ekwiti'],
  [/\bVenture Capital\b/g, 'Wentscher Käpitel'],
  [/\bSupply Chain\b/g, 'Saplei Tschejn'],
  [/\bShort Squeeze\b/g, 'Schort Skwies'],
  [/\bHedgefonds?\b/g, 'Hedschfonds'],

  [/\bBoom\b/g, 'Buhm'],
  [/\bRating\b/g, 'Rejting'],
  [/\bRanking\b/g, 'Renking'],
  [/\bReport\b/g, 'Riport'],
  [/\bResearch\b/g, 'Risörtsch'],
  [/\bDeal\b/g, 'Diel'],
  [/\bPerformance\b/g, 'Perförmens'],
  [/\bHedge\b/g, 'Hedsch'],
  [/\bSpread\b/g, 'Spredd'],
  [/\bLeverage\b/g, 'Lewweridsch'],
  [/\bTrading\b/g, 'Trejding'],
  [/\bScreening\b/g, 'Skriening'],
  [/\bEarnings\b/g, 'Örnings'],
  [/\bGuidance\b/g, 'Geidens'],
  [/\bOutlook\b/g, 'Autluck'],
  [/\bUpgrade\b/g, 'Appgrejd'],
  [/\bDowngrade\b/g, 'Daungrejd'],
  [/\bUpdate\b/g, 'Appdejt'],
  [/\bTurnaround\b/g, 'Törnaraund'],
  [/\bBreakout\b/g, 'Brejkaut'],
  [/\bMerger\b/g, 'Mördscher'],
  [/\bTakeover\b/g, 'Tejkohwer'],
  [/\bShutdown\b/g, 'Schattdaun'],
  [/\bBailout\b/g, 'Bejlaut'],
  [/\bDefault\b/g, 'Difohlt'],
  [/\bYield\b/g, 'Jield'],
  [/\bRall(?:y|ye)\b/g, 'Räli'],
  [/\bChips?\b/g, 'Tschipps'],
  [/\bCloud\b/g, 'Klaud'],
  [/\bSoftware\b/g, 'Softwer'],
  [/\bHardware\b/g, 'Hardwer'],
  [/\bStreaming\b/g, 'Strieming'],
  [/\bOverweight\b/g, 'Ohwerwejt'],
  [/\bUnderweight\b/g, 'Anderwejt'],
  [/\bHighlights?\b/g, 'Heilaits'],
  [/\bMeetings?\b/g, 'Mietings'],

  /* Abkürzungen, die deutsch buchstabiert falsch klingen. „ETF" und „KI"
     gehören ausdrücklich **nicht** dazu – die spricht man hierzulande
     deutsch, und alles andere wäre die Karikatur aus dem Kopf der Datei. */
  [/\bCEO\b/g, 'Sieh Ie Ou'],
  [/\bCFO\b/g, 'Sieh Eff Ou'],
  [/\bIPO\b/g, 'Ei Pie Ou'],
]

/** Setzt die Umschrift der englischen Namen ein – siehe `ENGLISCHE_NAMEN`. */
export function englischeNamenSprechbar(text: string): string {
  let s = text
  for (const [muster, laut] of ENGLISCHE_NAMEN) s = s.replaceAll(muster, laut)
  return s
}

/*
  Die Endung einer Webadresse wird **buchstabiert**, nicht gelesen.

  „punkt de" sprach die Stimme als Silbe – irgendetwas zwischen „deh" und
  „die", und im Ohr war es kein Wort und keine Endung. Gemeldet hat es der
  Betreiber am 11. August 2026: gesprochen gehört „punkt D E".

  Geschrieben wird das als die deutschen Buchstabennamen. „Deh Eh" liest das
  Modell als zwei Laute; ein „DE" läse es als Wort.
*/
const ENDUNG = {
  de: 'punkt Deh Eh',
  com: 'punkt Zeh Oh Emm',
  net: 'punkt Enn Eh Teh',
} as const

/*
  Formen, die im Deutschen praktisch nur bei englischen Wörtern vorkommen.
  Bewusst wenige und enge Muster: Ein Melder, der jeden Tag zehn harmlose
  Wörter anzeigt, wird nach einer Woche überlesen – dieselbe Rechnung wie
  beim roten Lauf.
*/
const ENGLISCH_VERDAECHTIG: RegExp[] = [
  /* „Marketing", „Leasing", „Timing" – aber nicht „Frühling", „Zwilling",
     „Häuptling": die deutschen Fälle enden fast alle auf „-ling". */
  /^(?!.*ling$)[A-Za-zÄÖÜäöüß]{6,}ing$/,
  /* „Match", „Pitch", „Watchlist" – „tch" gibt es im Deutschen nicht. */
  /tch/,
  /* „Cash", „Crash", „Flash" am Wortende; deutsches „sch" schreibt sich anders. */
  /[a-zäöüß]sh$/,
  /* „Baby", „Handy", „Rally", „Equity" – ein „y" hinter einem Konsonanten
     am Wortende ist im Deutschen fast immer ein Lehnwort. */
  /[bcdfghjklmnpqrstvwxz]y$/,
  /* „Layout", „Payment", „Display". */
  /ay[a-z]|ay$/,
  /* „Growth", „Wealth", „Health" – „th" am Wortende. */
  /th$/,
]

/* Wörter, die eines der Muster treffen und trotzdem deutsch sind. Die Liste
   ist der Preis dafür, dass die Muster eng bleiben dürfen. */
const KEINE_ANGLIZISMEN = new Set([
  'Mythos',
  'Wachstum',
  'Reichtum',
  'Datum',
  'Nord',
  'Süd',
])

/**
 * Nennt Wörter, die englisch aussehen und **keine** Umschrift bekommen haben.
 *
 * ## Warum es das gibt
 *
 * Weil `ENGLISCHE_NAMEN` eine Liste ist und eine Liste immer unvollständig
 * bleibt. Am 11. August 2026 hat der Betreiber die Regel auf Anglizismen
 * erweitert – „was englisch ist, wird englisch gesprochen". Diese Regel lässt
 * sich nicht abschließend in eine Tabelle schreiben: Morgen steht ein Wort in
 * der Ausgabe, an das heute niemand gedacht hat.
 *
 * Aufgefallen ist bisher **jeder** dieser Fälle beim Hören, nicht beim Bauen.
 * Das ist der teure Weg: Er kostet eine Folge, eine Meldung und einen zweiten
 * Lauf. Diese Prüfung dreht das um – sie schreibt vor dem Sprechen ins
 * Protokoll, was ihr englisch vorkommt und keine Umschrift hat.
 *
 * **Sie ist ein Hinweis, kein Urteil.** Sie kann nicht wissen, was englisch
 * ist; sie kennt nur ein paar Schreibweisen, die es im Deutschen kaum gibt.
 * Deshalb wird nichts abgebrochen und nichts von selbst ersetzt – die
 * Entscheidung, ob ein Wort in die Tabelle gehört, trifft ein Ohr.
 */
export function verdaechtigeAnglizismen(sprechtext: string): string[] {
  const gefunden = new Set<string>()
  for (const wort of sprechtext.match(/[A-Za-zÄÖÜäöüß][A-Za-zÄÖÜäöüß-]*/g) ?? []) {
    if (KEINE_ANGLIZISMEN.has(wort)) continue
    /* Zusammensetzungen am Bindestrich einzeln ansehen: „News-Ticker". */
    for (const teil of wort.split('-')) {
      if (teil.length < 3 || KEINE_ANGLIZISMEN.has(teil)) continue
      if (ENGLISCH_VERDAECHTIG.some((muster) => muster.test(teil))) gefunden.add(teil)
    }
  }
  return [...gefunden].sort()
}

/**
 * Macht einen geschriebenen Satz vorlesbar.
 *
 * Die Reihenfolge der Ersetzungen ist Absicht: Erst die festen Wendungen
 * („S&P 500“, Adressen, Uhrzeiten), dann Vorzeichen und Prozent, zuletzt die
 * nackten Zahlen – sonst zerlegt die Zahlregel eine Uhrzeit, bevor die
 * Uhrzeitregel sie sieht.
 */
export function sprechbar(text: string): string {
  let s = text

  /*
    Die Namen zuerst. „Nasdaq 100“ muss `Nässdack` heißen, bevor die Regel für
    Buchstabe-plus-Ziffer oder die Zahlregel den Ausdruck anfasst – und
    „Johnson & Johnson“ vor jeder Regel, die das Kaufmannsund umschreibt.
  */
  s = englischeNamenSprechbar(s)

  s = s.replaceAll(/S&P[  ]?500/g, 'S und P fünfhundert')
  /* Die eigene Adresse ist die Marke plus Endung – siehe `ENGLISCHE_NAMEN`.
     „iminvests punkt de" las die Stimme als ein einziges deutsches Wort. */
  s = s.replaceAll(/\biminvests\.de\b/gi, `Ei Emm Inwests ${ENDUNG.de}`)
  s = s.replaceAll(
    /\b(?:www\.)?([a-z0-9-]+)\.(de|com|net)\b/gi,
    (_, name: string, endung: string) =>
      `${name} ${ENDUNG[endung.toLowerCase() as keyof typeof ENDUNG]}`
  )

  /*
    Uhrzeiten: „07:04“ → „sieben Uhr vier“, „09:00“ → „neun Uhr“. Ein
    nachfolgendes „Uhr“ im Quelltext wird mitverbraucht – sonst stand im
    ersten Lauf „eins Uhr zweiundzwanzig Uhr“ da. Und ein Uhr heißt „ein“,
    nicht „eins“.
  */
  s = s.replaceAll(/\b(\d{1,2}):(\d{2})(\s*Uhr)?\b/g, (_, h: string, m: string) => {
    const stunde = Number(h) === 1 ? 'ein' : zahlwort(Number(h))
    const minute = Number(m)
    return minute === 0 ? `${stunde} Uhr` : `${stunde} Uhr ${zahlwort(minute)}`
  })

  /* Datumsangaben: „am 7. August“ → „am siebten August“ – vor der Zahlregel,
     die sonst „am sieben. August“ daraus machte. */
  s = ordnungszahlenSprechbar(s)

  /*
    Namen, in denen eine Ziffer klebt: „K3“, „R1“, „GPT5“.
    Gesprochen wird „K drei“ – der Buchstabe bleibt, die Ziffer wird Wort.

    Am 11. August 2026 hat genau das eine Ausgabe aufgehalten: Der Agent
    schrieb über „das chinesische Modell Kimi K3", die Zahlregel weiter unten
    fasst nur **freistehende** Zahlen, und der Test „keine Ziffern im
    Sprechtext" ließ den ganzen Nachrichtenlauf scheitern. Eine gute Ausgabe,
    verhindert von zwei Zeichen.

    Die Regel greift nur bei ein bis drei Buchstaben unmittelbar vor ein bis
    zwei Ziffern und nur am Wortende. Damit bleiben Wörter wie „DAX40“ – die
    es hier nicht gibt – und alles, was hinter der Ziffer weitergeht,
    unangetastet, und Kürzel wie „S&P 500“ hat die Regel darüber längst
    gefasst.
  */
  s = s.replaceAll(
    /\b([A-ZÄÖÜ][A-Za-zÄÖÜäöü]{0,2})(\d{1,2})\b/g,
    (ganz: string, wort: string, ziffern: string) =>
      // Reine Jahreszahlen und Ähnliches nicht anfassen – nur Buchstabe+Ziffer.
      /^\d+$/.test(wort) ? ganz : `${wort} ${zahlwort(Number(ziffern))}`
  )

  /* Klammern sind in der Sprechfassung verboten – sie werden zu Einschüben. */
  s = s.replaceAll(/\s*\(([^)]*)\)/g, ', $1,')

  /* Vorzeichen vor Zahlen. */
  s = s.replaceAll(/([+−-])(\d)/g, (_, z: string, d: string) =>
    z === '+' ? `plus ${d}` : `minus ${d}`
  )

  /* Prozentzeichen, bevor die Zahl davor umgeschrieben wird. */
  s = s.replaceAll(/\s*%/g, ' Prozent')

  /* Zahlen mit Tausenderpunkt und/oder Dezimalkomma. */
  s = s.replaceAll(
    /\b(\d{1,3}(?:\.\d{3})+|\d+)(?:,(\d+))?\b/g,
    (_, ganz: string, nachkomma?: string) => zahlAlsSprechform(ganz, nachkomma)
  )

  /* Aufräumen: doppelte Kommas und Leerzeichen aus der Klammerersetzung. */
  s = s.replaceAll(/,\s*,/g, ',').replaceAll(/\s{2,}/g, ' ')
  s = s.replaceAll(/,\s*\./g, '.').replaceAll('**', '')
  return s.trim()
}

/* ----------------------------------------------------------- Die Folge */

const WOCHENTAGE = [
  'Sonntag',
  'Montag',
  'Dienstag',
  'Mittwoch',
  'Donnerstag',
  'Freitag',
  'Samstag',
]
const MONATE = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
]

/** Der Kalendertag einer Ausgabe, ohne Umweg über die Zeitzone. */
function zerlegeDatum(date: string): {
  jahr: number
  monat: number
  tag: number
  wochentag: number
} {
  const [jahr, monat, tag] = date.split('-').map(Number)
  /* Zeller-frei: UTC-Mittag vermeidet jede Zeitzonenverschiebung. */
  const wochentag = new Date(Date.UTC(jahr, monat - 1, tag, 12)).getUTCDay()
  return { jahr, monat, tag, wochentag }
}

/**
 * Folgennummer – ab dem 10. August 2026 zählt **jeder** Tag.
 *
 * Bis dahin erschien die Folge werktags, und die Nummer war die Zahl der
 * Werktage seit dem 30. Juli 2026, dem Tag der ersten Folge: 30.07. ist
 * Folge 1, 07.08. ist Folge 7. Sieben Folgen stehen so im Register.
 *
 * Seit dem 9. August 2026 erscheint sie sieben Tage die Woche. Die Zählung
 * einfach auf Kalendertage umzustellen, wäre falsch gewesen – der 10. August
 * hätte dann Nummer 12 getragen, ein Sprung von 7 auf 12 mitten in der
 * laufenden Reihe. Eine Folgennummer ist eine Ordnungszahl; sie darf keine
 * Lücke bekommen, nur weil sich der Takt ändert.
 *
 * Deshalb zwei Abschnitte mit einer Naht dazwischen:
 *
 *     bis 09.08.2026      Werktage seit dem 30.07.  →  7
 *     ab  10.08.2026      7 + Kalendertage seit dem 09.08.
 *
 * Die Naht liegt auf dem 9. August, weil an diesem Tag keine Folge im
 * Register steht: Die des Tages wurde zurückgenommen. Es gibt also keine
 * veröffentlichte Nummer, die durch die Umstellung ihren Wert ändert.
 *
 * Bewusst ohne Blick ins Register: Diese Datei kommt ohne Laufzeitimporte
 * aus, und eine Nummer, die von einer JSON-Datei abhängt, wäre in einem Test
 * nicht mehr allein aus dem Datum vorhersagbar.
 */
const TAKTWECHSEL = Date.UTC(2026, 7, 9, 12)
const FOLGEN_BIS_TAKTWECHSEL = 7

export function folgennummer(date: string): number {
  const start = Date.UTC(2026, 6, 30, 12)
  const ziel = (() => {
    const { jahr, monat, tag } = zerlegeDatum(date)
    return Date.UTC(jahr, monat - 1, tag, 12)
  })()

  if (ziel > TAKTWECHSEL) {
    const tage = Math.round((ziel - TAKTWECHSEL) / 86_400_000)
    return FOLGEN_BIS_TAKTWECHSEL + tage
  }

  let nummer = 0
  for (let t = start; t <= ziel; t += 86_400_000) {
    const wt = new Date(t).getUTCDay()
    if (wt !== 0 && wt !== 6) nummer += 1
  }
  return nummer
}

/*
  Wörter, auf denen eine gekürzte Überschrift nicht enden darf. Der erste
  Lauf lieferte „Trump erwägt laut Medienberichten erneut die“ – gekürzt an
  der Längengrenze, mitten im Satzglied. Abgeschnitten wird deshalb wortweise,
  und Artikel, Präpositionen und Hilfsverben am Ende fallen mit.
*/
const KEIN_SCHLUSSWORT = new Set([
  'der',
  'die',
  'das',
  'den',
  'dem',
  'des',
  'ein',
  'eine',
  'einen',
  'einem',
  'und',
  'oder',
  'auf',
  'von',
  'vom',
  'für',
  'mit',
  'in',
  'im',
  'an',
  'am',
  'zu',
  'zum',
  'zur',
  'nach',
  'über',
  'unter',
  'erwägt',
  'schickt',
  'laut',
  'erneut',
  'ist',
  'sind',
  'wird',
  'werden',
  'hat',
  'haben',
  'seine',
  'ihre',
])

/** Kürzt eine Überschrift auf ihren Kern – für Titelzeile und Kapitel. */
function kernDerUeberschrift(headline: string, maxLaenge = 44): string {
  /* Am ersten Doppelpunkt, Gedankenstrich oder Komma endet der Kern. */
  let kern = headline.split(/[:–—,]/)[0].trim()
  if (kern.length > maxLaenge) {
    const woerter = kern.split(' ')
    kern = ''
    for (const wort of woerter) {
      if ((kern + ' ' + wort).trim().length > maxLaenge) break
      kern = (kern + ' ' + wort).trim()
    }
  }
  const teile = kern.split(' ')
  while (teile.length > 1 && KEIN_SCHLUSSWORT.has(teile.at(-1)!.toLowerCase())) {
    teile.pop()
  }
  /* Titel dürfen laut Vorlage keine Gedankenstriche und Sonderzeichen tragen. */
  return teile
    .join(' ')
    .replaceAll(/[„“"«»]/g, '')
    .trim()
}

/** Reiht Kerne zu „A, B und C“ – und lässt den dritten weg, wenn es zu lang wird. */
function alsAufzaehlung(kerne: string[], maxGesamt = 100): string {
  let auswahl = kerne.filter(Boolean)
  while (auswahl.length > 2 && auswahl.join(', ').length > maxGesamt) {
    auswahl = auswahl.slice(0, -1)
  }
  if (auswahl.length <= 1) return auswahl[0] ?? ''
  return `${auswahl.slice(0, -1).join(', ')} und ${auswahl.at(-1)}`
}

export interface Podcastfolge {
  datum: string
  nummer: number
  titel: string
  sprechtext: string
  wortzahl: number
  /** Kapitelnamen in Reihenfolge – die Zeiten kommen erst aus der Audiodatei. */
  kapitel: string[]
  /** Beschreibung ohne Kapitelzeiten; `(0:00)`-Zeilen fügt der Läufer ein. */
  beschreibung: string
  hashtags: string
}

const WORTZIEL_MIN = 710
const WORTZIEL_MAX = 740

/**
 * Der KI-Hinweis, wie er unter jeder Folge steht.
 *
 * Vom Betreiber wörtlich vorgegeben und deshalb hier als Konstante: Er steht
 * an zwei Stellen – unter der einzelnen Folge und, sinngemäß, in der
 * Kanalbeschreibung des Feeds (`scripts/podcast-feed-schreiben.ts`). Zwei
 * verschiedene Angaben zur selben Sache wären schlimmer als gar keine.
 *
 * **Der Satz enthält eine Zusage, die die Technik nicht einhalten kann.**
 * „Vor der Veröffentlichung von einem Menschen inhaltlich geprüft“ trifft auf
 * die Kette nicht zu: `podcast-erzeugen.yml` schreibt, vertont und
 * veröffentlicht ohne Halt dazwischen. Wer den Satz stehen lässt, muss die
 * Folge morgens tatsächlich vor der Freigabe lesen – oder den Halbsatz
 * streichen. Er ist eine Beschreibung des Verfahrens, kein Schmuck.
 */
export const KI_HINWEIS =
  'Hinweis: Text und Vertonung dieser Folge entstehen mit Unterstützung von ' +
  'KI-Werkzeugen und werden vor der Veröffentlichung von einem Menschen ' +
  'inhaltlich geprüft; die redaktionelle Verantwortung liegt beim Betreiber.'

function wortzahl(text: string): number {
  return text.split(/\s+/).filter(Boolean).length
}

/** Ein Themenabsatz: Meldung mit Zahlen, dann die Einordnung. */
function themenAbsatz(item: EditionItem, mitEinordnung: boolean): string {
  const saetze = [...item.summary]
  if (mitEinordnung) saetze.push(item.whyItMatters)
  return sprechbar(saetze.join(' '))
}

/**
 * Baut die komplette Folge aus einer Tagesausgabe.
 *
 * Das Wortziel wird durch Weglassen erreicht, nie durch Erfinden: Reicht der
 * Stoff nicht an 710 Wörter heran, wird die Folge kürzer und die Wortzahl im
 * Ergebnis gemeldet – eine kurze ehrliche Folge schlägt eine gestreckte.
 */
export function baueFolge(edition: DailyEdition): Podcastfolge {
  const { jahr, monat, tag, wochentag } = zerlegeDatum(edition.date)
  const alle = [...edition.top, ...edition.further]

  /* Drei Themen für den Spannungsbogen der Begrüßung. */
  const spannungsbogen = alsAufzaehlung(
    alle.slice(0, 3).map((item) => kernDerUeberschrift(item.headline, 60)),
    150
  )

  /*
    Der Spannungsbogen kommt aus `intro` und nicht aus den Überschriften.

    Der erste Lauf setzte drei gekürzte Schlagzeilen hinter „Es geht um“ und
    ergab: „Es geht um Schwacher US-Jobbericht schickt DAX und Wall Street,
    Trump erwägt …“ – grammatisch falsch, weil eine Schlagzeile ein Satz ist
    und kein Satzglied. `intro` ist bereits ein gebauter Satz über den Tag,
    mit genau den drei Themen darin. Er passt, weil er für dieselbe Aufgabe
    geschrieben wurde.
  */
  /* Der Markenname geht durch dieselbe Umschrift wie jeder andere englische
     Name – nicht als fertige Lautschrift hier hineingeschrieben. Sonst
     stünde er an zwei Stellen und ginge beim nächsten Mal auseinander. */
  const einstieg =
    englischeNamenSprechbar(
      `Guten Morgen und herzlich willkommen zum Marktupdate von IM Invests. `
    ) +
    `Heute ist ${WOCHENTAGE[wochentag]}, der ${ordnungszahl(tag)} ${MONATE[monat - 1]} ` +
    `${zahlwort(jahr)}. ${sprechbar(edition.intro)}`

  /*
    Das Fazit wiederholt nicht die Begrüßung – dort steht `intro` bereits.
    Es nimmt die Einordnung der wichtigsten Meldung, weil das die Lehre des
    Tages ist, und die ist der erklärte Zweck dieses Podcasts.
  */
  const lehre = alle[0]?.whyItMatters ?? ''
  const fazit = `Bleibt das Fazit. ${sprechbar(lehre)}`

  /*
    Ein Abschluss für alle Tage.

    Bis zum 9. August 2026 stand freitags „Bis Montag früh, schönes
    Wochenende" – richtig, solange samstags und sonntags nichts erschien.
    Seither erscheint die Folge täglich, und der Satz wäre eine Ankündigung,
    die nicht eintrifft: Am Samstag früh steht die nächste da.
  */
  /* Die Adresse steht hier als Adresse und nicht als fertige Lautschrift –
     `sprechbar` macht daraus „Ei Emm Inwests punkt Deh Eh". Sonst stünde die
     Aussprache an zwei Stellen und ginge beim nächsten Mal auseinander. */
  const abschluss = sprechbar(
    'Das war das Marktupdate von IM Invests. Alle Themen ausführlich und mit Einordnung findest du auf iminvests.de. Bis morgen früh und viel Erfolg.'
  )

  /*
    Erst alles mit Einordnung, dann von hinten kürzen: zuerst verlieren die
    letzten Themen ihre Einordnung, dann fallen sie ganz weg. So bleibt die
    Rangfolge der Ausgabe gewahrt – gekürzt wird am Unwichtigsten.
  */
  let absaetze = alle.map((item) => themenAbsatz(item, true))
  const rumpf = () => [einstieg, ...absaetze, fazit, abschluss].join('\n\n')
  let ohneEinordnung = alle.length - 1
  while (wortzahl(rumpf()) > WORTZIEL_MAX && ohneEinordnung > 0) {
    absaetze[ohneEinordnung] = themenAbsatz(alle[ohneEinordnung], false)
    ohneEinordnung -= 1
    if (wortzahl(rumpf()) > WORTZIEL_MAX && absaetze.length > 3) {
      absaetze = absaetze.slice(0, -1)
    }
  }

  /*
    Und weiter kürzen, bis es wirklich passt.

    Die Schleife darüber hört auf, wenn `ohneEinordnung` bei null ankommt –
    also nach so vielen Runden, wie es Themen gibt. Ob der Text danach kurz
    genug ist, fragt sie nicht mehr. Bei fünf Themen fiel das nie auf; bei
    sieben schon.

    Am 11. August 2026 hat es zugeschlagen: Der Agent lieferte eine Ausgabe
    mit sieben Artikeln – deutlich reicher als die fünf, mit denen bis dahin
    gerechnet wurde –, der Sprechtext lag über 740 Wörtern, und
    `tests/sprechfassung.test.ts` ließ den ganzen Nachrichtenlauf scheitern.
    Die Ausgabe war gut, die Folge zu lang, und veröffentlicht wurde nichts.

    **Eine reiche Ausgabe darf die Folge nicht kosten.** Die Website zeigt
    alle Artikel; die Folge nimmt so viele, wie in ihre fünf Minuten passen.
    Gekürzt wird weiter von hinten – die Rangfolge der Ausgabe bleibt gewahrt.

    Die Untergrenze von drei Themen steht: Darunter wäre es keine Folge mehr,
    sondern eine Meldung. Reicht auch das nicht, kommt die Folge etwas zu
    lang heraus – lieber das als gar keine.
  */
  while (wortzahl(rumpf()) > WORTZIEL_MAX && absaetze.length > 3) {
    absaetze = absaetze.slice(0, -1)
  }

  const sprechtext = rumpf()

  const titel = alsAufzaehlung(
    alle.slice(0, 3).map((item) => kernDerUeberschrift(item.headline, 60)),
    110
  )

  const kapitel = [
    'Begrüßung und Überblick',
    ...alle.slice(0, absaetze.length).map((item) => kernDerUeberschrift(item.headline)),
    'Fazit',
  ]

  /*
    Die Schlagworte kommen aus dem Tag, nicht aus einer Liste.

    Bis zum 9. August 2026 standen hier die Kategorienamen der Ausgabe plus
    fünf feste Wörter – „#Märkte #Börse #Aktien #Finanzen #Marktupdate
    #Finanzbildung". Das ist an jedem Tag richtig und an keinem Tag eine
    Auskunft: Wer nach Gold sucht, fand die Folge nicht, in der es um Gold
    ging. Jetzt kommen sie aus den `relatedSymbols` und `relatedTopics` der
    Meldungen – aus dem also, worüber die Folge wirklich spricht.

    Die Hinweise darunter bleiben unverändert. Sie sind gesetzt und gehen
    diesen Wechsel nichts an.
  */
  const hashtags = hashtagZeile(edition)

  const weitere = alle
    .slice(2)
    .map((item) => kernDerUeberschrift(item.headline, 60))
    .join(', ')
  const beschreibung = [
    `${edition.intro} ${alle[0]?.summary[0] ?? ''}`,
    `Wir sprechen über ${weitere || spannungsbogen}. Kompakt in rund fünf Minuten.`,
    '[KAPITEL]',
    'Website: iminvests.de',
    KI_HINWEIS,
    'Hinweis: Dieser Podcast dient ausschließlich der Information und Finanzbildung. Er stellt keine Anlageberatung und keine Kauf- oder Verkaufsempfehlung dar. Alle Angaben ohne Gewähr.',
    hashtags,
  ].join('\n\n')

  return {
    datum: edition.date,
    nummer: folgennummer(edition.date),
    titel,
    sprechtext,
    wortzahl: wortzahl(sprechtext),
    kapitel,
    beschreibung,
    hashtags,
  }
}
