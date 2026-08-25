import momentaufnahme from '@/data/snapshots/quartalstermine.json'

import { marketDefinitions } from '@/data/markets'
import type { Termin } from '@/data/kalender/typen'
import { berlinerUhrzeit, sitzungslage, sitzungslageLabel } from '@/lib/zonenzeit'

/**
 * Erwartete Termine der Quartalszahlen.
 *
 * Die Momentaufnahme entsteht wöchentlich durch
 * `.github/workflows/quartalstermine.yml` aus den 8-K-Meldungen bei der SEC.
 * Zur Laufzeit gibt es keinen Server, der etwas nachladen könnte.
 *
 * ## Warum diese Termine anders behandelt werden als die übrigen
 *
 * Alles andere im Kalender steht fest: Ein Zinsentscheid der EZB ist ein Jahr
 * vorher terminiert, ein Verfallstag folgt einer Regel, ein Wahltermin steht
 * im Gesetz. Diese Termine dagegen sind **abgeleitet** – aus dem Muster, mit
 * dem ein Unternehmen bisher gemeldet hat.
 *
 * Sie tragen deshalb `geschaetzt` und weisen den Vorjahrestag als Beleg aus.
 * Ein erwarteter Termin, der wie ein feststehender aussieht, wäre schlechter
 * als gar keiner: Wer danach eine Order legt, verlässt sich auf eine
 * Hochrechnung, ohne es zu wissen.
 *
 * ## Warum nur ein halbes Jahr
 *
 * Vorausgerechnet werden vier Quartale. Angezeigt wird weniger: Je weiter ein
 * Termin entfernt liegt, desto wahrscheinlicher hat das Unternehmen ihn
 * inzwischen selbst bekannt gegeben – dann steht hier eine Schätzung neben
 * einer öffentlich bekannten Tatsache. Ein halbes Jahr ist der Bereich, in
 * dem die Ableitung mehr nützt als stört.
 */

const HORIZONT_MONATE = 6

/*
  Ein erwarteter Meldetermin steht auf **einem** Tag.

  Bis August 2026 wurde daraus bei unsicherem Muster ein Zeitraum: `datum` der
  erwartete Tag, `bis` der Tag plus die Streuung des Vorjahres. Gedacht war das
  als Ehrlichkeit über die Genauigkeit – herausgekommen ist das Gegenteil.

  Auf der Kalenderseite fasst die Ansicht alle geschätzten Meldetermine
  desselben Anfangstags zu einer Zeile zusammen und nennt dazu das **späteste**
  Ende der Gruppe. Aus elf Unternehmen mit demselben erwarteten Tag und
  unterschiedlichen Streuungen wurde damit „um den 5. Aug. bis 14. Aug. –
  11 Unternehmen melden Quartalszahlen": eine Spanne von zehn Tagen, die kein
  einziges dieser Unternehmen so gemeint hatte, und darunter eine Namensliste,
  aus der niemand mehr ablesen konnte, wer wann meldet. Daneben stand die
  nächste Zeile mit „6. Aug. bis 15. Aug." und teilweise denselben Tagen.

  Die Streuung ist damit nicht verschwiegen – sie steht als Satz in der
  Bedeutung, wie bei den Dividendenterminen auch. Dort gehört sie hin: Sie ist
  eine Aussage über die Verlässlichkeit der Schätzung, keine über den Kalender.
*/

interface Vorhersage {
  erwartet: string
  basis: string
  streuungTage: number
  /**
   * Die erwartete **New Yorker** Wanduhrzeit, `HH:MM`, wenn belegbar.
   *
   * Sie stammt aus `acceptanceDateTime` der Vorjahresmeldung – dem Zeitpunkt,
   * zu dem die US-Börsenaufsicht das 8-K angenommen hat. Näher kommt eine
   * freie Quelle an den Moment der Veröffentlichung nicht heran; das
   * Unternehmen reicht die Meldung minutennah zur Pressemitteilung ein.
   *
   * Warum New Yorker und nicht deutsche Zeit steht in `lib/zonenzeit.ts`:
   * Ein Unternehmen meldet nach *seinem* Börsenschluss, und wie spät das in
   * Deutschland ist, hängt vom erwarteten Tag ab.
   *
   * Fehlt sie, steht keine Uhrzeit auf der Seite. Eine erfundene wäre hier
   * besonders teuer: Wer eine Order vor die Zahlen legen will, richtet sich
   * nach genau dieser Angabe.
   */
  newYorkerZeit?: string
  /**
   * Gesetzt, wenn das Unternehmen den Tag **selbst angekündigt** hat.
   *
   * Dann wurde nichts hochgerechnet: `basis` ist das Ende des
   * Berichtszeitraums statt eines Vorjahrestags, und `streuungTage` bedeutet
   * nichts. Ein solcher Termin trägt kein `geschaetzt` – der Unterschied ist
   * die ganze Aussage.
   */
  angekuendigt?: true
  /**
   * Welche Quelle den angekündigten Tag genannt hat.
   *
   * Fehlt das Feld, ist es der Sammelkalender – so stand es im Bestand, bevor
   * es eine zweite Quelle für angekündigte Termine gab, und ein Bestand aus
   * einem früheren Lauf soll deswegen nicht neu geschrieben werden müssen.
   *
   * Warum das Feld überhaupt da ist: Unter jedem Termin steht, woher er
   * stammt. Solange „angekündigt" und „Alpha Vantage" dasselbe bedeuteten,
   * genügte ein `true`. Seit die Tokioter Börse ihre eigenen Termine
   * beisteuert, wäre diese Angabe bei 72 Titeln schlicht falsch – und eine
   * falsche Quellenangabe ist schlimmer als keine.
   */
  herkunft?: 'kalender' | 'jpx'
  /** Die vom Anbieter genannte Lage zur US-Sitzung, ohne Minutenangabe. */
  lage?: 'vorboerse' | 'nachboerse'
}

interface Eintrag {
  name: string
  bisher: string[]
  bisherZeiten?: Record<string, string>
  vorhersagen: Vorhersage[]
}

interface Momentaufnahme {
  abgerufenAm: string | null
  quelle: { label: string; url: string; abgrenzung: string }
  unternehmen: Record<string, Eintrag>
}

const daten = momentaufnahme as Momentaufnahme

/** Wann die Termine zuletzt abgeleitet wurden – `null`, solange kein Lauf war. */
export const quartalstermineStand: string | null = daten.abgerufenAm

/** Herkunft und Abgrenzung, wie sie unter dem Kalender steht. */
export const quartalstermineQuelle = daten.quelle

/**
 * Die Quellen neben der SEC – für angekündigte **und** abgeleitete Termine.
 *
 * Beide müssen als solche dastehen: Ein Termin, der aus dem Sammelkalender
 * oder von der Tokioter Börse kommt, ist nicht aus 8-K-Meldungen abgeleitet,
 * und die Quellenangabe darunter wäre sonst schlicht falsch. Ein Leser, der
 * die Angabe nachschlägt, fände an der genannten Stelle nichts – und hielte
 * danach zu Recht auch den Termin für erfunden.
 *
 * **Bis zum 25. August 2026 hieß diese Tabelle `ANGEKUENDIGTE_QUELLEN`, und
 * der Name war der Fehler.** Er hat `herkunftVon()` dazu verleitet, die
 * Herkunft nur bei angekündigten Terminen zu fragen – siehe dort.
 */
export const TERMINQUELLEN = {
  kalender: {
    label: 'Sammelkalender angekündigter Meldetermine (Alpha Vantage)',
    url: 'https://www.alphavantage.co/documentation/#earnings-calendar',
  },
  jpx: {
    label: 'Japan Exchange Group – geplante Meldetermine der gelisteten Unternehmen',
    url: 'https://www.jpx.co.jp/listing/event-schedules/financial-announcement/index.html',
  },
} as const

/**
 * Die Herkunft eines Termins, wie sie unter ihm steht.
 *
 * Gefragt wird **zuerst der Termin selbst**: Trägt die Vorhersage ein
 * `herkunft`, gilt das – ob sie angekündigt ist oder abgeleitet. Erst wenn sie
 * keines trägt, gilt die Quelle der Momentaufnahme, also die SEC.
 *
 * ## Warum die Reihenfolge zählt
 *
 * Bis zum 25. August 2026 stand die Frage nach `angekuendigt` davor:
 *
 *     if (!vorhersage.angekuendigt) return daten.quelle   // SEC
 *     return ANGEKUENDIGTE_QUELLEN[vorhersage.herkunft ?? 'kalender']
 *
 * Solange es nur angekündigte Termine aus fremden Quellen gab, stimmte das.
 * Am 25. August hat der nächtliche Lauf zum ersten Mal die **abgeleiteten**
 * Tokioter Termine eingespielt: 268 Stück, `angekuendigt` nicht gesetzt, weil
 * sie geschätzt sind – und damit fiel jeder einzelne in den ersten Zweig.
 *
 * Unter Toyota, Sony und Hitachi stand danach „US-Börsenaufsicht SEC –
 * Formular 8-K". Keines dieser Unternehmen reicht ein 8-K ein. Genau der Fall,
 * vor dem der Kommentar über `TERMINQUELLEN` warnt, und er ist eingetreten,
 * weil eine neue Art von Termin durch eine alte Fallunterscheidung lief.
 *
 * `tests/quartalstermine.test.ts` prüft das jetzt an echten Terminen und an
 * einem Gegenbeispiel.
 */
function herkunftVon(vorhersage: Vorhersage): { label: string; url: string } {
  if (vorhersage.herkunft) return TERMINQUELLEN[vorhersage.herkunft]
  if (vorhersage.angekuendigt) return TERMINQUELLEN.kalender
  return { label: daten.quelle.label, url: daten.quelle.url }
}

/**
 * Der Anzeigename und der Slug eines Kürzels aus dem Katalog.
 *
 * Ohne diesen Abgleich stünde im Kalender das Börsenkürzel – `MSFT` statt
 * „Microsoft“. Und ohne den Slug ließe sich der Termin nicht mit der
 * Kursseite verbinden, auf der er eigentlich hingehört.
 */
function ausKatalog(ticker: string): { name: string; symbol: string } | null {
  const eintrag = marketDefinitions.find((definition) => definition.ticker === ticker)
  if (!eintrag) return null

  /*
    Nur Aktien, und das ist die zweite Sperre für denselben Fehler.

    Das Kürzel „WTI“ steht im Katalog für die amerikanische Ölsorte, bei der
    SEC für W&T Offshore. Solange der Abruf beides zusammenwarf, stand im
    Kalender „WTI Rohöl (USA): Quartalszahlen erwartet“ – ein Termin für einen
    Rohstoff, der keine Zahlen vorlegt.

    Behoben ist das schon beim Abruf. Die Prüfung hier bleibt trotzdem: Die
    Momentaufnahme kommt aus einer wöchentlichen Routine, und wenn dort etwas
    schiefgeht, soll es nicht bis auf die Seite durchschlagen.
  */
  if (eintrag.kind !== 'stock') return null

  return { name: eintrag.name, symbol: eintrag.symbol }
}

function plusMonate(monate: number): string {
  const d = new Date()
  d.setUTCMonth(d.getUTCMonth() + monate)
  return d.toISOString().slice(0, 10)
}

/**
 * Die erwarteten Meldetermine als Kalendereinträge.
 *
 * Erzeugt wird je Unternehmen und Quartal ein Eintrag. Wer im Katalog nicht
 * geführt wird, fällt heraus – ein Termin ohne zugehörige Kursseite hätte auf
 * dieser Website keinen Ort.
 */
export function getQuartalstermine(): Termin[] {
  const grenze = plusMonate(HORIZONT_MONATE)
  const ergebnis: Termin[] = []

  for (const [ticker, eintrag] of Object.entries(daten.unternehmen)) {
    const katalog = ausKatalog(ticker)
    if (!katalog) continue

    for (const vorhersage of eintrag.vorhersagen) {
      if (vorhersage.erwartet > grenze) continue

      const uhrzeit = uhrzeitsatz(vorhersage)

      /*
        Ein angekündigter Termin trägt kein `geschaetzt` – und das ist keine
        Formalie. `geschaetzt` steuert auf der Kalenderseite das „erwartet,
        nicht bestätigt" und das „um den …". Beides an einem Tag, den das
        Unternehmen selbst genannt hat, wäre eine Untertreibung: Wer danach
        plant, plant richtig, und die Warnung nähme ihm die Sicherheit, die
        die Quelle hergibt.
      */
      ergebnis.push({
        datum: vorhersage.erwartet,
        titel: vorhersage.angekuendigt
          ? `${katalog.name}: Quartalszahlen angekündigt`
          : `${katalog.name}: Quartalszahlen erwartet`,
        art: 'berichtssaison',
        ...(uhrzeit ? { uhrzeit } : {}),
        bedeutung: vorhersage.angekuendigt
          ? `Das Unternehmen hat diesen Tag selbst angekündigt. ` +
            `Für den Kurs zählt nicht die Zahl selbst, sondern ihre Abweichung von der Erwartung.`
          : `Abgeleitet aus dem bisherigen Meldemuster – im Vorjahr meldete das Unternehmen am ` +
            `${aufDeutsch(vorhersage.basis)}. ${streuungssatz(vorhersage.streuungTage)}` +
            `Der genaue Tag wird wenige Wochen vorher bekannt gegeben. ` +
            `Für den Kurs zählt ohnehin nicht die Zahl selbst, sondern ihre Abweichung von der Erwartung.`,
        themen: ['aktie', 'wie-funktioniert-der-markt'],
        symbole: [katalog.symbol],
        ...(vorhersage.angekuendigt
          ? {}
          : {
              geschaetzt: {
                basis: vorhersage.basis,
                streuungTage: vorhersage.streuungTage,
              },
            }),
        quelle: herkunftVon(vorhersage),
      })
    }
  }

  return ergebnis
}

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

/**
 * ISO-Datum als deutscher Fließtext.
 *
 * Die Momentaufnahme führt Daten als `2025-07-30` – richtig für einen
 * Datensatz, falsch mitten in einem Satz. Ohne diese Umwandlung stünde die
 * Maschinenschreibweise in der Erklärung unter dem Termin.
 */
function aufDeutsch(datum: string): string {
  const [jahr, monat, tag] = datum.split('-')
  return `${Number(tag)}. ${MONATE[Number(monat) - 1]} ${jahr}`
}

/**
 * Wie verlässlich der geschätzte Tag ist – als Satz, nicht als Zeitspanne.
 *
 * Die Streuung ist die Abweichung, die dasselbe Unternehmen im Vorjahr
 * gegenüber dem Jahr davor hatte. Bei null oder einem Tag lohnt der Hinweis
 * nicht; er stünde bei den meisten Einträgen und sagte nichts.
 *
 * Der abschließende Leerschritt gehört dazu: Der Satz wird mitten in die
 * Bedeutung eingesetzt, und ein fehlendes Leerzeichen fällt nur auf der
 * gebauten Seite auf.
 */
function streuungssatz(tage: number): string {
  if (tage < 2) return ''
  return `Das Muster schwankte dabei um bis zu ${tage} Tage. `
}

/**
 * Die erwartete Uhrzeit als ein Satz in deutscher Zeit – oder `null`.
 *
 * ## Warum die Lage vor der Minute steht
 *
 * Der Betreiber hat am 20. August 2026 verlangt, dass im Kalender steht, „um
 * wie viel Uhr europäischer Zeit die Zahlen veröffentlicht werden". Die
 * ehrlichste Antwort darauf hat zwei Teile, und die Reihenfolge ist nicht
 * beliebig.
 *
 * Was **feststeht**, ist die Lage: Ein Unternehmen, das seit Jahren nach dem
 * US-Schluss meldet, meldet auch dieses Mal nach dem US-Schluss. Daran hängt
 * die einzige Frage, die ein Anleger hier wirklich hat – bewegt sich der Kurs
 * noch heute oder erst morgen früh?
 *
 * Was **schwankt**, ist die Minute. 16:01 Uhr im einen Jahr, 16:32 im
 * nächsten. Sie steht deshalb dahinter und mit dem Wort, das sie einordnet:
 * „im Vorjahr". Eine Zeitangabe ohne dieses Wort wäre eine Zusage, die die
 * Quelle nicht deckt – dieselbe Überlegung wie beim Tag, der `geschaetzt`
 * trägt.
 *
 * Fehlt die Zeit, steht keine da. Sie entsteht nur, wenn zwei
 * aufeinanderfolgende Jahre in derselben Lage gemeldet haben.
 *
 * ## Warum die Minute als Eingang bei der Behörde bezeichnet wird
 *
 * Weil sie das ist. Gemessen wird, wann die US-Börsenaufsicht die Meldung
 * angenommen hat – bei den meisten Unternehmen ist das der Augenblick der
 * Veröffentlichung, bei manchen liegt ein Nachlauf dazwischen. Wer das
 * dazuschreibt, gibt dem Leser die Möglichkeit, es einzuordnen; wer „um 22:22
 * Uhr veröffentlicht" schreibt, nimmt sie ihm.
 *
 * ## Warum es „während des US-Handels" nicht gibt
 *
 * Es steht als Fall in `lib/zonenzeit.ts`, und trotzdem erscheint es nie –
 * das ist kein Versehen, sondern das Ergebnis einer Zählung.
 *
 * Am 20. August 2026 trugen 1.142 der 1.205 vorausgerechneten Termine eine
 * Zeit. 645 lagen vor der Eröffnung, 467 nach dem Schluss, **30 mitten in der
 * Sitzung**. Nachgesehen, wer diese 30 sind: Citigroup mit 10:08 Uhr, Ford mit
 * 12:08, Chubb mit 12:19, Sempra mit 10:51 – lauter Häuser, die ihre Zahlen in
 * Wahrheit vorbörslich herausgeben. Was hier gemessen wurde, ist nicht ihre
 * Pressemitteilung, sondern das Formular, das sie Stunden später nachreichen.
 *
 * Ein Unternehmen dieser Größe meldet nicht um halb elf am Vormittag. Wenn die
 * Zahl das behauptet, misst sie etwas anderes als die Veröffentlichung – und
 * dann ist Schweigen richtiger als eine Uhrzeit, die um vier Stunden daneben
 * liegt. Die 30 fallen deshalb heraus, und zwar hier und nicht schon beim
 * Abruf: Der Abruf hält fest, was er gemessen hat; ob daraus eine Aussage
 * wird, entscheidet die Stelle, die sie trifft.
 */
export function uhrzeitsatz(vorhersage: Vorhersage): string | null {
  /*
    Ein angekündigter Termin nennt die Lage, aber keine Minute – und dann steht
    auch keine da. Aus „post-market" eine Uhrzeit zu rechnen, nur damit beide
    Quellen durch dieselbe Anzeige laufen, hieße eine Genauigkeit zu behaupten,
    die die Quelle nicht hergibt.
  */
  if (vorhersage.angekuendigt) {
    return vorhersage.lage ? sitzungslageLabel[vorhersage.lage] : null
  }

  if (!vorhersage.newYorkerZeit) return null

  const lage = sitzungslage(vorhersage.newYorkerZeit)
  if (!lage || lage === 'handel') return null

  const deutsch = berlinerUhrzeit(vorhersage.erwartet, vorhersage.newYorkerZeit)
  if (!deutsch) return null

  return (
    `${sitzungslageLabel[lage]} – im Vorjahr ${deutsch.uhrzeit} Uhr ` +
    `${deutsch.kuerzel} bei der Behörde eingegangen`
  )
}

/** Wie weit voraus ein Meldetermin als „bald“ gilt. */
export const BALD_TAGE = 14

/** Was auf einer Aktienseite über den nächsten Meldetermin steht. */
export interface Quartalsterminbefund {
  /** Der nächste erwartete Meldetermin, `JJJJ-MM-TT`. */
  erwartet: string
  /** Der Vorjahrestag, aus dem er abgeleitet ist. */
  basis: string
  /** Wie weit das Muster bisher gestreut hat, in Tagen. */
  streuungTage: number
  /** Wie viele Tage bis dahin – negativ gibt es nicht, Vergangenes fällt weg. */
  inTagen: number
  /** Ob der Termin in den nächsten zwei Wochen liegt. */
  bald: boolean
  /** Die erwartete Uhrzeit als Satz in deutscher Zeit, wenn belegbar. */
  uhrzeit: string | null
  /**
   * Ob das Unternehmen den Tag selbst angekündigt hat.
   *
   * Steuert die Wortwahl auf der Seite: „angekündigt" statt „geschätzt", und
   * ohne den Absatz über das Meldemuster. Zwei verschiedene Zusagen dürfen
   * nicht gleich aussehen – die eine trägt eine Order, die andere nicht.
   */
  angekuendigt: boolean
  /** Die Herkunft dieses einen Termins. */
  quelle: { label: string; url: string }
}

function tageZwischen(von: string, bis: string): number {
  return Math.round(
    (Date.parse(`${bis}T00:00:00Z`) - Date.parse(`${von}T00:00:00Z`)) / 86_400_000
  )
}

/**
 * Der nächste erwartete Meldetermin einer Aktie – oder `null`.
 *
 * ## Warum `heute` von außen kommt
 *
 * Weil sonst keine Prüfung möglich wäre, die morgen noch dasselbe sagt.
 * `getQuartalstermine()` greift für seinen Horizont auf `new Date()` zurück,
 * und das ist dort vertretbar – hier nicht: Ob ein Termin „bald“ ist,
 * entscheidet über ein Symbol neben der Überschrift, und ein Test, der an der
 * Systemuhr hängt, prüft an zwei Wochen im Jahr etwas anderes als sonst.
 *
 * ## Warum der Tag der Grenze noch dazugehört
 *
 * `inTagen === 14` gilt als „bald“. Wer am 6. August liest, dass ein
 * Unternehmen am 20. meldet, ist mit „in zwei Wochen“ richtig bedient – eine
 * Grenze, die genau diesen Fall ausschließt, wäre eine Grenze gegen das Wort,
 * das sie beschreibt.
 */
export function getQuartalsterminbefund(
  symbol: string,
  heute: string
): Quartalsterminbefund | null {
  const definition = marketDefinitions.find((eintrag) => eintrag.symbol === symbol)
  if (!definition || definition.kind !== 'stock') return null

  const eintrag = daten.unternehmen[definition.ticker]
  if (!eintrag) return null

  /*
    Der nächste, der noch kommt.

    Sortiert wird hier und nicht auf die Reihenfolge der Datei vertraut: Der
    Abruf schreibt sie zwar aufsteigend, aber ein Bestand, der aus einem
    früheren Lauf übernommen wurde, hat diese Zusage nie gegeben.
  */
  const kommende = eintrag.vorhersagen
    .filter((vorhersage) => vorhersage.erwartet >= heute)
    .sort((a, b) => a.erwartet.localeCompare(b.erwartet))

  const naechste = kommende[0]
  if (!naechste) return null

  const inTagen = tageZwischen(heute, naechste.erwartet)

  return {
    erwartet: naechste.erwartet,
    basis: naechste.basis,
    streuungTage: naechste.streuungTage,
    inTagen,
    bald: inTagen <= BALD_TAGE,
    uhrzeit: uhrzeitsatz(naechste),
    angekuendigt: naechste.angekuendigt === true,
    quelle: herkunftVon(naechste),
  }
}

/**
 * Warum für eine Aktie kein Meldetermin dasteht.
 *
 * ## Warum hier überhaupt etwas steht
 *
 * Weil eine Leerstelle nicht erklärt, was sie bedeutet. Wer auf der Seite von
 * SAP keine Zeile zu den nächsten Zahlen findet, liest daraus: „Die melden
 * wohl nichts" oder „Die Website hat es nicht" – und beides ist falsch. Der
 * wahre Grund ist eine Eigenschaft der Quelle, und der gehört dorthin, wo die
 * Frage entsteht, statt in eine Methodenseite.
 *
 * Für 711 der 1.029 geführten Aktien war das der Normalfall, nachgezählt am
 * 20. August 2026. Die erste Quelle ist die US-Börsenaufsicht, und dort meldet,
 * wer in den USA notiert. Wer nur an seiner Heimatbörse notiert, taucht gar
 * nicht auf; wer als ausländischer Emittent in New York notiert, reicht ein
 * 6-K ein, und das kennt keine Punktnummern, an denen sich eine
 * Ergebnismeldung erkennen ließe. Alibaba ist der Fall, an dem es aufgefallen
 * ist: bei der SEC geführt, aber ohne eine einzige 8-K-Meldung mit Punkt 2.02.
 *
 * ## Warum der Grund vom Titel abhängt
 *
 * Seit die Tokioter Börse dazugekommen ist, gibt es zwei verschiedene Gründe
 * für dieselbe Leerstelle – und der Satz über die US-Börsenaufsicht wäre auf
 * der Seite von Toyota schlicht falsch. Ein japanischer Titel ohne Termin
 * fehlt nicht in der Quelle, sondern nur in ihrem Zeitfenster: Die Börse führt
 * die nächsten Wochen, nicht das ganze Jahr.
 *
 * ## Warum `heute` hier gebraucht wird
 *
 * Weil „kein Eintrag" nicht dasselbe ist wie „kein kommender Termin". Ein
 * Unternehmen kann im Bestand stehen und trotzdem keinen Tag mehr vor sich
 * haben – dann lieferte diese Funktion bisher `null`, `getQuartalsterminbefund`
 * ebenfalls, und der Abschnitt auf der Aktienseite verschwand **ganz**. Kein
 * Termin und keine Erklärung: genau die stille Leerstelle, gegen die es diesen
 * Satz gibt.
 */
export function quartalsterminLuecke(symbol: string, heute: string): string | null {
  const definition = marketDefinitions.find((eintrag) => eintrag.symbol === symbol)
  if (!definition || definition.kind !== 'stock') return null

  const eintrag = daten.unternehmen[definition.ticker]
  if (eintrag) {
    const kommend = eintrag.vorhersagen.some((vorhersage) => vorhersage.erwartet >= heute)
    if (kommend) return null

    const letzter = [...eintrag.vorhersagen]
      .map((vorhersage) => vorhersage.erwartet)
      .sort()
      .at(-1)

    return (
      'Für diesen Titel steht gerade kein Termin an. ' +
      (letzter
        ? `Der zuletzt erfasste Meldetag war der ${aufDeutsch(letzter)}; der nächste `
        : 'Der nächste ') +
      'ist noch nicht bekannt gegeben. Sobald er vorliegt, steht er hier – eine ' +
      'Schätzung ohne Grundlage kommt nicht dazwischen.'
    )
  }

  if (/\.T$/.test(definition.ticker)) {
    return (
      'Für diesen Titel steht noch kein Termin an. Die Meldetermine japanischer ' +
      'Unternehmen kommen von der Tokioter Börse, und die veröffentlicht jeweils ' +
      'die nächsten Wochen – kündigt das Unternehmen seinen Tag an, steht er ' +
      'hier. Eine geschätzte Zahl stünde ohne Grundlage.'
    )
  }

  return (
    'Für diesen Titel liegt kein Meldemuster vor. Die Termine dieser Website ' +
    'stammen aus den Pflichtmeldungen bei der US-Börsenaufsicht und von den ' +
    'Börsen, die ihre Termine selbst veröffentlichen. Ein Unternehmen, das nur ' +
    'an einer Heimatbörse ohne solche Liste notiert, ist in beiden nicht ' +
    'enthalten. Eine geschätzte Zahl stünde hier ohne Grundlage.'
  )
}

/**
 * Wie viele Unternehmen und Termine abgedeckt sind – gehört sichtbar auf die Seite.
 *
 * Die Zahl der geführten Aktien steht bewusst daneben. Ohne sie liest sich
 * „158 Unternehmen“ wie Vollständigkeit; mit ihr wird sichtbar, dass es ein
 * knappes Drittel ist. Der Rest notiert nur an seiner Heimatbörse und reicht
 * bei der US-Börsenaufsicht nichts ein – für diese Aktien gibt es keine
 * vergleichbare öffentliche Quelle, und das gehört auf die Seite und nicht in
 * ein Protokoll, das niemand liest.
 */
export function getQuartalsterminAbdeckung(): {
  unternehmen: number
  termine: number
  /** Alle Aktien im Katalog der Website, also der mögliche Höchstwert. */
  aktienGesamt: number
} {
  const termine = getQuartalstermine()
  return {
    unternehmen: new Set(termine.map((t) => t.symbole?.[0])).size,
    termine: termine.length,
    aktienGesamt: marketDefinitions.filter((d) => d.kind === 'stock').length,
  }
}
