import { taktErwartung, beurteile } from '@/lib/datenstand'
import { entnahmeplan, MAX_JAHRE } from '@/lib/entnahme'
import { notgroschen } from '@/lib/notgroschen'
import { abstandZumHoch, spannenPosition } from '@/lib/jahresspanne'
import { formatNumber, formatPercent, formatPercentSigned } from '@/lib/format'
import { aufSkala, gleitenderDurchschnitt, marktbreite } from '@/lib/stimmungsindex'
import { median } from '@/lib/marktbreite'
import { einmalanlage } from '@/lib/rueckblick'

/**
 * Wie jede Kennzahl dieser Website gerechnet wird.
 *
 * ## Das Gegenstück zu `/quellen`
 *
 * Dort steht **woher** die Zahlen kommen, hier steht **wie** daraus eine
 * Kennzahl wird. Beides zusammen ist der Unterschied zwischen einer Zahl, die
 * jemand nachvollziehen kann, und einer, die er glauben muss.
 *
 * ## Warum die Formeln nicht abgetippt werden
 *
 * Weil abgetippte Formeln auseinanderlaufen. Genau das ist an diesem Tag
 * zweimal aufgefallen: Die Wortgrenzen der Podcastfolge standen an drei
 * Stellen mit denselben Zahlen und ohne Kopplung, und die `intro`-Grenze hat
 * am 16. August in derselben Bauart eine Tagesausgabe gekostet.
 *
 * Eine Methodenseite ist dafür der schlimmste Ort: Sie **verspricht**
 * Nachvollziehbarkeit. Eine Formel, die dort steht und im Code anders lautet,
 * ist schlimmer als gar keine Angabe – sie ist eine falsche Auskunft an
 * jemanden, der ausdrücklich nachgesehen hat.
 *
 * Deshalb trägt jeder Eintrag zwei Dinge, die ihn an den Code binden:
 *
 * 1. **`herkunft`** – Datei und Funktionsname. `tests/methoden.test.ts` prüft,
 *    dass es die Datei gibt und die Funktion dort exportiert wird.
 * 2. **`beispiel`** – eine Rechnung, die die **echte Funktion aufruft**. Was
 *    auf der Seite als Beispiel steht, ist nicht beschrieben, sondern
 *    ausgerechnet. Ändert sich die Rechnung, ändert sich das Beispiel mit.
 *
 * Die Formelzeile bleibt Prosa und kann veralten – aber sie steht neben einem
 * Beispiel, das es nicht kann, und einem Verweis auf die Stelle, an der es
 * wirklich passiert.
 *
 * ## Warum Vereinfachungen ausdrücklich dastehen
 *
 * Jede Kennzahl hier lässt etwas weg. Die Dividendenrendite blickt zurück
 * statt vorauszurechnen, die Marktbreite zählt Werte statt sie zu gewichten,
 * die Jahresspanne nimmt zwölf Monate, weil zwölf Monate eine Konvention sind.
 *
 * Das sind keine Fehler, sondern Entscheidungen – und sie gehören dorthin, wo
 * jemand nach der Methode sucht. Wer sie nicht nennt, lässt den Leser glauben,
 * die Zahl sei genauer, als sie ist.
 */

/** Eine Kennzahl mit allem, was zum Nachrechnen gehört. */
export interface Methode {
  slug: string
  /** Die Kennzahl, wie sie auf der Website heißt. */
  titel: string
  /** Was sie beantwortet – ein Satz, keine Definition. */
  frage: string
  /** Die Rechnung in einer Zeile, lesbar statt formal. */
  formel: string
  /** Woher die Eingangsdaten stammen. */
  quelle: string
  /** Wie der Stichtag bestimmt wird – die Frage hinter jeder Momentaufnahme. */
  stichtag: string
  /** Was bewusst weggelassen wird. Nie leer: Jede Kennzahl vereinfacht. */
  vereinfachungen: string[]
  /** Wo es wirklich gerechnet wird – geprüft von `tests/methoden.test.ts`. */
  herkunft: { datei: string; funktion: string }
  /** Wo die Kennzahl auf der Website steht. */
  zuSehen: { text: string; href: string }
  /**
   * Ein Beispiel, das die echte Funktion aufruft.
   *
   * Kein `string`, sondern eine Funktion: Ein fertiger Text wäre wieder eine
   * abgetippte Behauptung. So steht auf der Seite, was herauskommt.
   */
  beispiel: () => { eingabe: string; ergebnis: string }
}

export const METHODEN: Methode[] = [
  {
    slug: 'abstand-hoch',
    titel: 'Abstand zum 52-Wochen-Hoch',
    frage: 'Wie weit ist es von hier bis zum höchsten Kurs der letzten zwölf Monate?',
    formel: '(Kurs − Hoch) ÷ Hoch × 100',
    quelle: 'Tagesschlusskurse der letzten 366 Kalendertage, plus der angezeigte Kurs',
    stichtag:
      'Rollierend: gezählt wird ab dem Bezugstag zurück, nach Datum und nicht nach Anzahl der Punkte. Ein Feiertag verschiebt das Fenster deshalb nicht.',
    vereinfachungen: [
      'Zwölf Monate sind eine Konvention, keine Eigenschaft des Marktes. Ein Wert, der vor dreizehn Monaten höher stand, sieht hier aus, als stünde er am Hoch.',
      'Der angezeigte Kurs zählt beim Bilden des Hochs mit. Ohne das könnte ein laufender Kurs über dem Jahreshoch liegen und der „Abstand nach unten" wäre positiv.',
      'Dividenden bleiben außen vor – gerechnet wird auf Kursbasis, nicht auf Gesamtrendite.',
    ],
    herkunft: { datei: 'lib/jahresspanne.ts', funktion: 'abstandZumHoch' },
    zuSehen: { text: '52 Wochen', href: '/maerkte/52-wochen' },
    beispiel: () => ({
      eingabe: 'Kurs 90, Jahreshoch 100',
      ergebnis: formatPercentSigned(abstandZumHoch({ value: 90, high52w: 100 }), 1),
    }),
  },
  {
    slug: 'position-spanne',
    titel: 'Position in der Zwölfmonatsspanne',
    frage: 'Wo steht der Kurs zwischen Jahrestief und Jahreshoch?',
    formel: '(Kurs − Tief) ÷ (Hoch − Tief) × 100',
    quelle: 'Dieselben Schlusskurse wie beim Abstand zum Hoch',
    stichtag: 'Rollierend über zwölf Monate, wie oben',
    vereinfachungen: [
      'Fallen Hoch und Tief zusammen, gibt es keine Spanne. Dann steht ein Strich statt einer Zahl – „100 %" wäre über einen Wert mit einem einzigen bekannten Kurs schlicht falsch.',
      'Die Position sagt nichts über den Weg dorthin: Ein Titel, der die Spanne dreimal durchlaufen hat, sieht aus wie einer, der ruhig gestiegen ist.',
    ],
    herkunft: { datei: 'lib/jahresspanne.ts', funktion: 'spannenPosition' },
    zuSehen: { text: '52 Wochen', href: '/maerkte/52-wochen' },
    beispiel: () => ({
      eingabe: 'Kurs 90, Spanne 85 bis 100',
      ergebnis: formatPercent(
        spannenPosition({ value: 90, high52w: 100, low52w: 85 }) ?? 0,
        0
      ),
    }),
  },
  {
    slug: 'datenstand',
    titel: 'Wie alt eine Zahl ist',
    frage: 'Darf ich dieser Zahl heute noch trauen?',
    formel:
      'Bei Kursen: verpasste Handelsschlüsse seit dem Stand. Bei Statistiken: Tage gegen den Veröffentlichungstakt.',
    quelle: 'Der Zeitstempel der Zahl und die Handelszeiten ihres Handelsplatzes',
    stichtag:
      'Die Uhr des Besuchers, nicht die des Bauens. Eine beim Bau gerechnete Ampel stünde für immer auf Grün.',
    vereinfachungen: [
      'Börsenfeiertage sind nicht hinterlegt. Nach einem Feiertag zählt die Rechnung eine Sitzung zu viel – lieber einmal zu oft gefragt als eine tote Zahl, die aussieht wie eine lebende.',
      'Für Krypto, Devisen und Rohstoffe gibt es keinen Handelsschluss. Dort urteilt die Ampel nach Tagen und sagt das dazu.',
      'Die Grenzen sind weit: das Doppelte des Takts, mindestens eine Woche. Eine Meldung, die grundlos anschlägt, wird abgeschaltet.',
    ],
    herkunft: { datei: 'lib/datenstand.ts', funktion: 'beurteile' },
    zuSehen: { text: 'Marktstimmung', href: '/maerkte/stimmung/aktien' },
    beispiel: () => {
      const befund = beurteile(
        '2026-06-01',
        taktErwartung('monatlich', 30),
        new Date('2026-08-17T09:00:00Z')
      )
      /*
        `frische` ist ein interner Schlüssel (`aelter`), kein Text für Leser.
        Er stand hier zuerst wörtlich auf der Seite – die Prüfung hat ihn
        durchgewinkt, weil sie nur auf Zahlen und Leerzeichen sieht.
      */
      const wort = { frisch: 'aktuell', aelter: 'älter', veraltet: 'veraltet' }
      return {
        eingabe: 'Stand 1. Juni, Quelle liefert monatlich, heute der 17. August',
        ergebnis: `${befund.alterTage} Tage alt – „${wort[befund.frische]}"`,
      }
    },
  },
  {
    slug: 'marktbreite',
    titel: 'Marktbreite',
    frage: 'Steigt der Markt in der Breite oder tragen ihn wenige Werte?',
    formel: 'Anteil der Werte über ihrem gleitenden Durchschnitt, in Prozent',
    quelle: 'Alle Einzelreihen mit echten Kursen',
    stichtag: 'Der jüngste gemeinsame Handelstag der einbezogenen Reihen',
    vereinfachungen: [
      'Ungewichtet: Ein Konzern mit einer Billion Börsenwert zählt wie ein mittelständischer Zulieferer. Genau das ist der Punkt – gewichtet wäre es wieder der Index.',
      'Reihen ohne echte Kurse zählen nicht mit, statt mit einem geschätzten Wert einzugehen.',
    ],
    herkunft: { datei: 'lib/stimmungsindex.ts', funktion: 'marktbreite' },
    zuSehen: { text: 'Marktstimmung', href: '/maerkte/stimmung/aktien' },
    beispiel: () => {
      /*
        Acht Reihen und nicht vier: `marktbreite()` gibt unter acht brauchbaren
        Reihen `null` zurück – zu wenige Werte ergeben keine Breite. Ein
        Beispiel, das „keine Angabe" liefert, zeigt die Rechnung nicht,
        sondern nur ihre Untergrenze.
      */
      const reihe = (letzter: number) =>
        Array.from({ length: 60 }, (_, i) => ({
          d: `2026-06-${String(i + 1).padStart(2, '0')}`,
          c: i === 59 ? letzter : 100,
        }))
      const letzte = [110, 108, 105, 103, 101, 95, 92, 90]
      const wert = marktbreite(letzte.map(reihe), 50)
      return {
        eingabe: 'Acht Reihen, fünf davon über ihrem Durchschnitt',
        ergebnis: wert === null ? 'keine Angabe' : formatPercent(wert, 0),
      }
    },
  },
  {
    slug: 'skala',
    titel: 'Umrechnung auf die Skala 0 bis 100',
    frage: 'Wie wird aus einer Messgröße ein Wert zwischen Angst und Gier?',
    formel: '(Wert − beiNull) ÷ (beiHundert − beiNull) × 100, begrenzt auf 0…100',
    quelle: 'Die jeweilige Messgröße – Abstand zum Trend, Schwankung, Marktbreite',
    stichtag: 'Derselbe wie bei der Messgröße',
    vereinfachungen: [
      'Die beiden Ankerwerte sind gesetzt, nicht gemessen. Sie bestimmen, ab wann etwas als „viel" gilt, und eine andere Wahl ergäbe eine andere Zahl.',
      'Werte außerhalb der Anker werden gekappt statt extrapoliert – jenseits der Skala ist „sehr viel" keine feinere Auskunft mehr.',
    ],
    herkunft: { datei: 'lib/stimmungsindex.ts', funktion: 'aufSkala' },
    zuSehen: { text: 'Marktstimmung', href: '/maerkte/stimmung/aktien' },
    beispiel: () => ({
      eingabe: 'Wert 5, Skala von −10 (Angst) bis +10 (Gier)',
      ergebnis: formatNumber(aufSkala(5, -10, 10), 0),
    }),
  },
  {
    slug: 'gleitender-durchschnitt',
    titel: 'Gleitender Durchschnitt',
    frage: 'Wo liegt der Kurs im Verhältnis zu seinem eigenen Verlauf?',
    formel: 'Mittel der letzten n Schlusskurse',
    quelle: 'Tagesschlusskurse der Reihe',
    stichtag: 'Der letzte Punkt der Reihe',
    vereinfachungen: [
      'Ungewichtet: Der Kurs von vor hundert Tagen zählt so viel wie der von gestern. Ein exponentiell gewichteter Durchschnitt reagiert schneller und schwankt mehr – beides ist vertretbar, hier steht das einfachere.',
      'Handelstage, keine Kalendertage. „50 Tage" sind rund zehn Wochen.',
    ],
    herkunft: { datei: 'lib/stimmungsindex.ts', funktion: 'gleitenderDurchschnitt' },
    zuSehen: { text: 'Marktstimmung', href: '/maerkte/stimmung/aktien' },
    beispiel: () => {
      const punkte = [100, 102, 98, 104, 106].map((c, i) => ({
        d: `2026-08-0${i + 1}`,
        c,
      }))
      const wert = gleitenderDurchschnitt(punkte, 5)
      return {
        eingabe: 'Fünf Schlusskurse: 100, 102, 98, 104, 106',
        ergebnis: wert === null ? 'keine Angabe' : formatNumber(wert, 1),
      }
    },
  },
  {
    slug: 'median',
    titel: 'Median statt Mittelwert',
    frage: 'Was ist der typische Wert, wenn einzelne Ausreißer das Bild verzerren?',
    formel:
      'Der mittlere Wert der sortierten Reihe; bei gerader Anzahl das Mittel der beiden mittleren',
    quelle: 'Die jeweilige Wertereihe',
    stichtag: 'Derselbe wie bei der Reihe',
    vereinfachungen: [
      'Der Median verschweigt die Verteilung: Ob die Werte dicht beieinanderliegen oder weit streuen, ist ihm nicht anzusehen.',
      'Er wird dort genommen, wo einzelne Ausreißer den Mittelwert verzerren würden – ein Mittelwert kann nichts finden, was er verdünnt.',
    ],
    herkunft: { datei: 'lib/marktbreite.ts', funktion: 'median' },
    zuSehen: { text: 'Marktstimmung', href: '/maerkte/stimmung/aktien' },
    beispiel: () => ({
      eingabe: 'Werte 10, 12, 14, 900',
      ergebnis: formatNumber(median([10, 12, 14, 900]) ?? 0, 1),
    }),
  },
  {
    slug: 'einmalanlage',
    titel: 'Was aus 1.000 € geworden wäre',
    frage: 'Wie hätte sich ein Betrag entwickelt, den jemand damals angelegt hätte?',
    formel: 'Betrag ÷ Kurs am Starttag × Kurs am Endtag',
    quelle: 'Die Fünfjahresreihe des Instruments',
    stichtag: 'Der erste Punkt der Reihe als Start, der letzte als Ende',
    vereinfachungen: [
      'Ohne Kosten, Steuern und Währungseffekte. Ein echter Kauf hätte Ordergebühren, Spread und je nach Titel Quellensteuer gekostet.',
      'Ohne Dividenden – gerechnet wird auf Kursbasis. Bei ausschüttenden Titeln liegt die tatsächliche Rendite darüber.',
      'Ein einziger Starttag. Wer eine Woche früher gekauft hätte, bekäme ein anderes Ergebnis; das ist keine Eigenschaft des Titels, sondern des Stichtags.',
    ],
    herkunft: { datei: 'lib/rueckblick.ts', funktion: 'einmalanlage' },
    zuSehen: { text: 'Einzelne Instrumente', href: '/maerkte' },
    beispiel: () => {
      const reihe = [
        { d: '2021-08-17', c: 100 },
        { d: '2026-08-17', c: 180 },
      ]
      const ergebnis = einmalanlage(reihe, 1000, '2021-08-17')
      return {
        eingabe: '1.000 € bei Kurs 100, heute Kurs 180',
        ergebnis: ergebnis ? formatNumber(ergebnis.endwert, 0) + ' €' : 'keine Angabe',
      }
    },
  },
  {
    slug: 'notgroschen',
    titel: 'Höhe des Notgroschens',
    frage: 'Wie viele Monatsausgaben muss der Puffer tragen?',
    formel: '(3 + Summe der Beiträge) × Monatsausgaben, gedeckelt auf 2 bis 24 Monate',
    quelle:
      'Ausschließlich Eingaben – Beschäftigung, Zahl der Einkommen, Ausgaben, Fixkostenanteil, Unterhaltspflichten',
    stichtag: 'Kein Stichtag: eine Einschätzung der Lage, keine Messung.',
    vereinfachungen: [
      'Die Zu- und Abschläge sind begründete Größenordnungen, keine Messungen. Es gibt keine Untersuchung, aus der „selbstständig = plus drei Monate" folgt – belegbar ist die Richtung, nicht die Höhe.',
      'Gerechnet wird an den Ausgaben, nicht am Gehalt. „Drei Monatsgehälter" nimmt die falsche Bezugsgröße: Entscheidend ist, wie lange jemand ohne Einkommen zurechtkommt.',
      'Zwei Einkommen zählen nur als zwei, solange sie nicht am selben Arbeitgeber oder derselben Branche hängen.',
      'Nicht enthalten: bestehende Schulden, absehbare große Ausgaben, Gesundheitszustand, Reparaturstau an einer eigenen Immobilie. Jeder Punkt spricht für mehr.',
    ],
    herkunft: { datei: 'lib/notgroschen.ts', funktion: 'notgroschen' },
    zuSehen: { text: 'Notgroschen-Rechner', href: '/rechner/notgroschen' },
    beispiel: () => {
      const ergebnis = notgroschen({
        beschaeftigung: 'selbststaendig',
        einkommen: 1,
        ausgabenProMonat: 2_400,
        fixkostenProMonat: 1_800,
        unterhaltspflichten: 1,
      })
      return {
        eingabe:
          'selbstständig, ein Einkommen, 2.400 € Ausgaben davon 75 % fix, ein Kind',
        ergebnis: `${ergebnis.monateVon}–${ergebnis.monateBis} Monatsausgaben`,
      }
    },
  },
  {
    slug: 'entnahme-reichweite',
    titel: 'Reichweite eines Entnahmeplans',
    frage: 'Wie lange trägt ein Kapital, aus dem monatlich entnommen wird?',
    formel: 'Kapitalₜ = Kapitalₜ₋₁ × (1 + realer Zins) − Entnahme',
    quelle: 'Ausschließlich Eingaben – Kapital, Entnahme, Rendite, Inflationsrate',
    stichtag:
      'Kein Stichtag: eine Vorausrechnung, keine Messung. Gerechnet wird in ganzen Jahren, erst die Rendite, dann die Entnahme.',
    vereinfachungen: [
      'Die Entnahme steigt jedes Jahr mit der Inflation – gerechnet wird deshalb mit dem realen Zins, dem Quotienten aus Rendite und Teuerung, nicht ihrer Differenz.',
      'Eine feste Rendite je Jahr. Genau die gibt es nicht, und für jemanden, der entnimmt, zählt die Reihenfolge der Jahre: Schwache Jahre am Anfang wirken stärker als dieselben Jahre am Ende.',
      'Entnommen wird rechnerisch am Jahresende. Wer monatlich entnimmt, nimmt im Schnitt ein halbes Jahr früher heraus – über dreißig Jahre etwa ein halbes bis ein Jahr Reichweite.',
      'Ohne Steuern und Produktkosten. Die Abgeltungsteuer hängt am Einstandskurs, den diese Rechnung nicht kennt.',
    ],
    herkunft: { datei: 'lib/entnahme.ts', funktion: 'entnahmeplan' },
    zuSehen: { text: 'Entnahmeplan', href: '/rechner/entnahmeplan' },
    beispiel: () => {
      const plan = entnahmeplan({
        kapital: 500_000,
        entnahmeProMonat: 2_000,
        renditeProzent: 5,
        inflationProzent: 2,
        zieldauerJahre: 30,
      })
      return {
        eingabe: '500.000 €, 2.000 €/Monat, 5 % Rendite, 2 % Inflation',
        ergebnis: plan.dauerhaft
          ? 'trägt dauerhaft'
          : plan.reichweiteJahre === null
            ? `über ${MAX_JAHRE} Jahre`
            : `${formatNumber(plan.reichweiteJahre)} Jahre`,
      }
    },
  },
]
