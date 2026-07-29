import Link from 'next/link'

import { Kennzahlzeile } from '@/components/markets/Kennzahlzeile'
import type { Ausfallgrund, Kennwert } from '@/lib/fundamentalkennzahlen'
import type { Fundamentalbefund } from '@/lib/markets'
import { formatDate, formatLargeAmount, formatNumber } from '@/lib/format'
import { fundamentalStand } from '@/lib/fundamentaldaten'

/**
 * Die fünf Bewertungskennzahlen einer Aktie.
 *
 * ## Warum genau diese fünf
 *
 * Sie beantworten fünf verschiedene Fragen, und keine ist durch eine andere zu
 * ersetzen:
 *
 * - **Marktkapitalisierung** – wie groß ist das Unternehmen an der Börse?
 * - **Kurs-Gewinn-Verhältnis** – wie teuer ist der Gewinn, den es macht?
 * - **Kurs-Umsatz-Verhältnis** – wie teuer ist der Umsatz? Die einzige der
 *   Bewertungszahlen, die auch bei Verlust noch etwas sagt.
 * - **Kurs-Buchwert-Verhältnis** – wie teuer ist das, was tatsächlich da ist?
 * - **Cashflow je Aktie** – wie viel Geld fließt wirklich herein? Gewinn lässt
 *   sich buchhalterisch gestalten, Zahlungsströme weit weniger.
 *
 * ## Warum bei manchen Aktien nichts steht
 *
 * Die Zahlen stammen aus zwei Sammlungen von Pflichtmeldungen: der
 * US-Börsenaufsicht für alles mit US-Notierung – auch über einen
 * Hinterlegungsschein, und damit auch Toyota und Shell – und den
 * ESEF-Meldungen der EU für die europäischen Werte ohne US-Notierung.
 *
 * Welche der beiden es war, steht unter der Tafel und wird nicht geraten: Für
 * Airbus stünde sonst die SEC da, eine Behörde, bei der Airbus nichts
 * einreicht.
 *
 * Wer in keine der beiden fällt – der deutsche Markt, Japan, Korea, Indien –,
 * bekommt hier einen Satz, der das erklärt, und keine geschätzte Zahl.
 */
export function Unternehmenszahlen({
  befund,
  name,
  quelle,
  className,
}: {
  befund: Fundamentalbefund
  name: string
  /** Die Sammlung, aus der die Zahlen dieses Unternehmens stammen. */
  quelle?: { label: string } | null
  className?: string
}) {
  const kennzahlen = befund.art === 'zahlen' ? befund.kennzahlen : null
  /*
    Die Währung kommt vom Befund, nicht als Festwert.

    Vorher stand hier „USD“ – für die us-gaap-Melder richtig, für Toyota
    grundfalsch: Dessen Börsenwert von 38,65 Billionen Yen erschien als
    „38,65 Bio. USD“. Eine Zahl, die um den Faktor 150 danebenliegt und der
    man nichts ansieht.
  */
  const waehrung = befund.art === 'zahlen' ? befund.waehrung : 'USD'
  const betrag = (wert: number) =>
    // Unter tausend Einheiten ist es ein Wert je Aktie, darüber eine Bilanzsumme.
    Math.abs(wert) < 1000
      ? `${formatNumber(wert, 2)} ${waehrung}`
      : formatLargeAmount(wert, waehrung)

  return (
    <section aria-labelledby="unternehmenszahlen" className={className}>
      <h2 id="unternehmenszahlen" className="text-fg text-2xl font-bold">
        Unternehmenszahlen
      </h2>
      <p className="text-fg-muted mt-2 max-w-2xl leading-relaxed">
        Der Kurs allein sagt nichts darüber, ob eine Aktie teuer ist – dafür braucht es
        die Zahlen des Unternehmens dahinter. Die folgenden fünf setzen den Kurs ins
        Verhältnis zu dem, was {name} tatsächlich erwirtschaftet.
      </p>

      {kennzahlen ? (
        <>
          <div className="fk-card mt-5 p-5 sm:p-6">
            <dl className="space-y-4">
              <Kennzahlzeile
                label="Marktkapitalisierung"
                wert={zahl(kennzahlen.marktkapitalisierung, betrag)}
                erklaerung={
                  kennzahlen.marktkapitalisierung.wert === null
                    ? grundText(kennzahlen.marktkapitalisierung.grund, 'die Aktienzahl')
                    : 'Der Preis für alle Aktien zusammen – was das gesamte Unternehmen an der Börse gerade kostet. Die Zahl ordnet ein, mit wem man es zu tun hat: Ein Wert unter zwei Milliarden gilt als klein, über zweihundert Milliarden als sehr groß.'
                }
              />
              <Kennzahlzeile
                label="Kurs-Gewinn-Verhältnis"
                wert={zahl(kennzahlen.kgv, verhaeltnis)}
                erklaerung={
                  kennzahlen.kgv.wert === null
                    ? grundText(kennzahlen.kgv.grund, 'der Gewinn')
                    : 'Wie viele Jahresgewinne man für eine Aktie bezahlt. Bei 20 kostet die Aktie das Zwanzigfache dessen, was das Unternehmen in einem Jahr verdient hat. Hohe Werte bedeuten, dass der Markt mit wachsenden Gewinnen rechnet – tritt das nicht ein, fällt der Kurs.'
                }
              />
              <Kennzahlzeile
                label="Kurs-Umsatz-Verhältnis"
                wert={zahl(kennzahlen.kuv, verhaeltnis)}
                erklaerung={
                  kennzahlen.kuv.wert === null
                    ? grundText(kennzahlen.kuv.grund, 'der Umsatz')
                    : 'Dasselbe, bezogen auf den Umsatz statt auf den Gewinn. Nützlich bei jungen Unternehmen, die noch keinen Gewinn machen – und als Gegenprobe, wenn ein Gewinn durch Sondereffekte verzerrt ist.'
                }
              />
              <Kennzahlzeile
                label="Kurs-Buchwert-Verhältnis"
                wert={zahl(kennzahlen.kbv, verhaeltnis)}
                erklaerung={
                  kennzahlen.kbv.wert === null
                    ? grundText(kennzahlen.kbv.grund, 'das Eigenkapital')
                    : 'Der Kurs im Verhältnis zum Eigenkapital je Aktie – also zu dem, was nach Abzug aller Schulden bilanziell übrig bliebe. Bei Banken und Industrie ist das aussagekräftig; bei Software- und Markenunternehmen weniger, weil deren Wert kaum in der Bilanz steht.'
                }
              />
              <Kennzahlzeile
                label="Cashflow je Aktie"
                wert={zahl(kennzahlen.cashflowJeAktie, betrag)}
                erklaerung={
                  kennzahlen.cashflowJeAktie.wert === null
                    ? grundText(kennzahlen.cashflowJeAktie.grund, 'der Cashflow')
                    : 'Wie viel Geld das laufende Geschäft je Aktie eingebracht hat. Anders als der Gewinn hängt diese Zahl kaum von Bewertungsspielräumen ab – liegt sie dauerhaft deutlich unter dem Gewinn, lohnt ein genauerer Blick.'
                }
              />
            </dl>
          </div>

          {befund.art === 'zahlen' && befund.umrechnung && (
            <p className="text-fg-subtle mt-3 text-xs leading-relaxed">
              Die Aktie notiert in {befund.umrechnung.vonWaehrung}, das Unternehmen
              berichtet in {waehrung}. Umgerechnet wurde deshalb der Börsenwert – Kurs mal
              Aktienzahl, beides von heute – mit dem Euro-Referenzkurs der Europäischen
              Zentralbank vom {formatDate(befund.umrechnung.kursStand)}. Die gemeldeten
              Zahlen selbst sind unangetastet geblieben; ein Wechselkurs berührt hier
              keine einzige Bilanzgröße.
            </p>
          )}

          {/*
            Kurz, und der Rest auf der Quellenseite.

            Hier stand die vollständige Herkunft samt Abgrenzung – auf jeder
            einzelnen der über fünfhundert Aktienseiten derselbe Absatz. Was
            hier bleiben muss, ist das Datum: Der Kurs ist tagesaktuell, die
            Bilanzzahlen sind es naturgemäß nicht, und wer das nicht danebenstehen
            hat, liest eine Kennzahl als Aussage über heute.
          */}
          <p className="text-fg-subtle mt-3 text-xs leading-relaxed">
            {quelle?.label ?? 'Bilanzzahlen der US-Börsenaufsicht'}, abgerufen am{' '}
            {formatDate(fundamentalStand)}; der Kurs ist tagesaktuell, die Bilanzzahlen
            sind es naturgemäß nicht – sie ändern sich mit den Quartalsberichten.{' '}
            <Link href="/quellen" className="hover:text-fg underline underline-offset-2">
              Herkunft und Abgrenzung
            </Link>
          </p>
        </>
      ) : (
        <div className="fk-card mt-5 p-5 sm:p-6">
          {befund.art === 'keinEchterKurs' ? (
            <p className="text-fg-muted leading-relaxed">
              Die Bilanzzahlen von {name} liegen vor, ein echter Kurs jedoch nicht – für
              diesen Wert ist noch keine Kursquelle eingerichtet, der Chart zeigt
              gekennzeichnete Beispieldaten. Jede der fünf Kennzahlen setzt den Kurs ins
              Verhältnis zu den Unternehmenszahlen; mit einem erfundenen Kurs käme eine
              Zahl heraus, die echt aussieht und es nicht ist.
            </p>
          ) : (
            <p className="text-fg-muted leading-relaxed">
              Für {name} liegen keine Unternehmenszahlen vor. Sie stammen aus zwei
              Sammlungen von Pflichtmeldungen: der US-Börsenaufsicht für alles, was in den
              Vereinigten Staaten notiert ist – auch über einen Hinterlegungsschein,
              weshalb etwa Toyota und Shell erfasst sind –, und den ESEF-Meldungen der EU
              für die europäischen Werte ohne US-Notierung. Was in keine der beiden fällt,
              hat keine offene Quelle mit derselben Verlässlichkeit: Der deutsche Markt
              meldet an den Bundesanzeiger, Japan, Korea und Indien haben je eine eigene
              Aufsicht mit eigenem Format, und die kommerziellen Anbieter verlangen eine
              Lizenz.
            </p>
          )}
          <p className="text-fg-muted mt-3 leading-relaxed">
            Ein geschätztes Kurs-Gewinn-Verhältnis stünde hier zwar – es sähe nur aus wie
            eine Tatsache, ohne eine zu sein. Was sich aus dem Kursverlauf selbst rechnen
            lässt, steht deshalb weiter unten und gilt für jeden Wert gleichermaßen.
          </p>
        </div>
      )}
    </section>
  )
}

/** Formatiert einen Kennwert oder setzt einen Gedankenstrich. */
function zahl(eintrag: Kennwert, wie: (wert: number) => string): string {
  return eintrag.wert === null ? '–' : wie(eintrag.wert)
}

function verhaeltnis(wert: number): string {
  /*
    Ab hundert wird die Nachkommastelle zur Scheingenauigkeit.

    Ein Kurs-Gewinn-Verhältnis von 340,7 unterscheidet sich von 341 in nichts,
    was jemandem bei einer Entscheidung hülfe – beides heißt „sehr teuer“.
  */
  return formatNumber(wert, Math.abs(wert) >= 100 ? 0 : 1)
}

function grundText(grund: Ausfallgrund | null, groesse: string): string {
  if (grund === 'verlust') {
    return 'Das Unternehmen hat im letzten gemeldeten Geschäftsjahr Verlust gemacht. Die Formel ergäbe eine negative Zahl, und die läse sich wie „besonders günstig“, obwohl sie das Gegenteil bedeutet. Deshalb steht hier nichts.'
  }
  if (grund === 'negativesEigenkapital') {
    return 'Das Eigenkapital ist negativ – bilanziell übersteigen die Schulden das Vermögen. Das kommt bei Unternehmen vor, die viele eigene Aktien zurückgekauft haben, und macht diese Kennzahl unbrauchbar.'
  }
  return `Die Quelle meldet für dieses Unternehmen nicht, ${groesse === 'die Aktienzahl' ? 'wie viele Aktien ausstehen' : `wie hoch ${groesse} war`}.`
}
