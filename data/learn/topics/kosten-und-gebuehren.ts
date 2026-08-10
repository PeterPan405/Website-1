import type { LearnTopic } from '@/data/learn/types'
import { calculateCompoundInterest } from '@/lib/finance'
import { formatCurrencyRounded, formatPercent } from '@/lib/format'

/*
  Alle Kostenzahlen dieses Themas stammen aus derselben Rechnung.

  Kosten sind das Thema, bei dem am häufigsten mit gerundeten Behauptungen
  gearbeitet wird – „ein Prozent kostet ein Viertel des Vermögens“ steht in
  Dutzenden Ratgebern und stimmt je nach Annahme oder eben nicht. Hier steht
  die Annahme über der Tabelle, und die Zahl kommt aus derselben Funktion, die
  auch der Zinsrechner der Website benutzt.
*/
const SPARFALL = {
  rate: 300,
  jahre: 30,
  brutto: 6,
}

/** Endkapital bei einer bestimmten Kostenquote – alles andere bleibt gleich. */
function endkapitalBei(kosten: number): number {
  return calculateCompoundInterest({
    principal: 0,
    contribution: SPARFALL.rate,
    interval: 'monthly',
    annualRatePercent: SPARFALL.brutto - kosten,
    years: SPARFALL.jahre,
  }).finalBalance
}

const KOSTENSTUFEN = [0.2, 0.5, 1.0, 1.5, 2.0]
const kostenreihe = KOSTENSTUFEN.map((kosten) => ({
  kosten,
  endkapital: endkapitalBei(kosten),
}))
const eingezahlt = SPARFALL.rate * 12 * SPARFALL.jahre
const guenstigste = kostenreihe[0].endkapital
const teuerste = kostenreihe[kostenreihe.length - 1].endkapital
/** Was der Unterschied ausmacht – als Anteil am besten Ergebnis. */
const anteilVerloren = ((guenstigste - teuerste) / guenstigste) * 100

/**
 * Vollständig ausgearbeitetes Thema.
 *
 * Stufenaufbau: Beginner benennt die Kostenarten und rechnet ihre Wirkung vor.
 * Fortgeschritten zeigt, was in der Kostenquote fehlt und wie sich die
 * tatsächlichen Gesamtkosten ermitteln lassen. Profi behandelt Rückvergütungen,
 * erfolgsabhängige Vergütungen und die Grenze, ab der Sparen schadet.
 */
export const kostenUndGebuehren: LearnTopic = {
  slug: 'kosten-und-gebuehren',
  title: 'Kosten & Gebühren',
  headline: 'Kosten: die einzige Größe, die vorher feststeht',
  metaTitle: 'Kosten bei der Geldanlage: Arten, Wirkung, Vergleich',
  metaDescription:
    'Welche Kosten bei der Geldanlage anfallen, wo sie versteckt sind, wie stark sie über Jahrzehnte wirken und an welchen Stellen sich am meisten sparen lässt.',
  lead: 'Rendite ist eine Hoffnung, Kosten sind eine Tatsache – und sie wirken jedes Jahr auf das gesamte Vermögen.',
  overview: [
    'Kosten wirken jedes Jahr auf das gesamte angelegte Vermögen, nicht nur auf die neue Sparrate. Über 30 Jahre kann ein Unterschied von einem Prozentpunkt jährlich ein Viertel des Endvermögens ausmachen.',
    'Das Tückische ist die Unsichtbarkeit: Laufende Fondskosten werden täglich anteilig aus dem Fondsvermögen entnommen und tauchen auf keiner Abrechnung auf. Wer nur auf Ordergebühren achtet, sieht den kleineren Teil.',
    'Die Stufen führen von den einzelnen Kostenarten über die vollständige Erfassung der Gesamtkostenquote bis zu Rückvergütungen, Performance-Fees und der Frage, wo Sparen sinnvoll ist und wo es zulasten der Qualität geht.',
  ],
  keywords: [
    'Kosten',
    'Gebühren',
    'TER',
    'Gesamtkostenquote',
    'Ausgabeaufschlag',
    'Spread',
    'Ordergebühren',
    'Depotgebühren',
  ],
  related: ['etf', 'fonds', 'depot-und-broker', 'zinseszins'],
  calculators: ['/rechner/zinsrechner'],
  levels: {
    // ---------------------------------------------------------------- Beginner
    beginner: {
      metaTitle: 'Kosten bei der Geldanlage einfach erklärt',
      metaDescription:
        'Welche Kostenarten es gibt, wo sie anfallen, warum laufende Kosten schwerer wiegen als einmalige und wie stark sie über Jahrzehnte wirken.',
      title: 'Welche Kosten es gibt und was sie anrichten',
      lead: 'Nach dieser Stufe kennst du die sechs Kostenarten, weißt, welche davon auf keiner Abrechnung stehen, und hast ihre Wirkung über dreißig Jahre gesehen.',
      readingMinutes: 11,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Bei der Geldanlage ist fast alles ungewiss. Wie sich die Märkte entwickeln, weiß niemand; wie hoch die Inflation ausfällt, auch nicht. Genau eine Größe steht am ersten Tag fest, lässt sich vergleichen und beeinflussen: die Kosten.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Sechs Kostenarten – drei davon sieht man nicht',
        },
        {
          type: 'table',
          caption: 'Wo sie anfallen und ob sie auf einer Abrechnung stehen',
          head: ['Kostenart', 'Wann', 'Sichtbar?'],
          rows: [
            ['Ausgabeaufschlag', 'Einmal beim Kauf über die Fondsgesellschaft', 'Ja'],
            ['Ordergebühr', 'Bei jedem Kauf und Verkauf über die Börse', 'Ja'],
            ['Depotgebühr', 'Jährlich, bei vielen Anbietern null', 'Ja'],
            [
              'Laufende Fondskosten',
              'Täglich anteilig aus dem Fondsvermögen',
              'Nein – der Anteilspreis ist bereits gemindert',
            ],
            [
              'Spread',
              'Bei jedem Kauf und Verkauf, im Preis enthalten',
              'Nein – wird nie berechnet',
            ],
            [
              'Handelskosten im Fonds',
              'Wenn der Fonds selbst umschichtet',
              'Nein – auch nicht in der Kostenquote enthalten',
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'Die drei unsichtbaren sind zusammen fast immer der größere Posten. Wer beim Vergleich nur auf die Ordergebühr schaut, optimiert den kleinsten Hebel.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Warum laufende Kosten so viel schwerer wiegen',
        },
        {
          type: 'paragraph',
          text: 'Ein Ausgabeaufschlag von fünf Prozent trifft einmal die eingezahlte Summe. Eine laufende Kostenquote von 1,5 Prozent trifft **jedes Jahr das gesamte angesparte Vermögen** – im dreißigsten Jahr also einen sechsstelligen Betrag, nicht die Monatsrate.',
        },
        {
          type: 'paragraph',
          text: 'Dazu kommt ein zweiter Effekt, den man leicht übersieht: Was an Kosten entnommen wird, kann sich nicht mehr verzinsen. Der Verlust ist deshalb größer als die Summe der Gebühren.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die Rechnung',
        },
        {
          type: 'paragraph',
          text: `${formatCurrencyRounded(SPARFALL.rate)} im Monat, ${SPARFALL.jahre} Jahre lang, ${formatPercent(SPARFALL.brutto, 0)} Rendite vor Kosten. Eingezahlt werden in allen Fällen ${formatCurrencyRounded(eingezahlt)}. Nur die Kostenquote unterscheidet sich:`,
        },
        {
          type: 'table',
          caption: `Endkapital nach ${SPARFALL.jahre} Jahren`,
          head: ['Laufende Kosten', 'Endkapital', 'Gegenüber der günstigsten Variante'],
          rows: kostenreihe.map((fall) => [
            formatPercent(fall.kosten, 1),
            formatCurrencyRounded(fall.endkapital),
            fall.kosten === KOSTENSTUFEN[0]
              ? '—'
              : `− ${formatCurrencyRounded(guenstigste - fall.endkapital)}`,
          ]),
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Was diese Tabelle sagt',
          items: [
            `Zwischen ${formatPercent(KOSTENSTUFEN[0], 1)} und ${formatPercent(KOSTENSTUFEN[KOSTENSTUFEN.length - 1], 1)} Kosten liegen ${formatCurrencyRounded(guenstigste - teuerste)} – ${formatPercent(anteilVerloren, 0)} des Ergebnisses.`,
            'Bei identischer Einzahlung, identischem Markt und identischem Verhalten. Der einzige Unterschied ist die Kostenquote.',
            'Und dieser Unterschied stand am ersten Tag fest. Er war weder Glück noch Können.',
          ],
        },
        {
          type: 'figure',
          figure: 'kosten-endkapital',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wo am meisten zu holen ist',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Laufende Fondskosten.** Der mit Abstand größte Hebel, weil sie jedes Jahr auf alles wirken. Breite Indexfonds liegen bei 0,05 bis 0,25 Prozent, aktive Aktienfonds häufig bei 1,5 Prozent und mehr.',
            '**Ausgabeaufschlag.** Bei einem Kauf über die Börse entfällt er ganz. Wer über eine Fondsgesellschaft oder Vermittlung kauft, sollte gezielt danach fragen.',
            '**Depotgebühr.** Viele Anbieter erheben keine. Eine jährliche Gebühr für die reine Verwahrung ist verhandelbar oder ein Grund zu wechseln – der Wechsel ist gesetzlich kostenfrei.',
            '**Ordergebühr.** Bei langfristiger Anlage der kleinste Hebel: Wer zweimal im Jahr kauft, zahlt sie zweimal. Wichtig wird sie nur bei sehr kleinen Sparraten.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wo du die Kosten tatsächlich nachliest',
        },
        {
          type: 'paragraph',
          text: 'Zu jedem Fonds gibt es ein zweiseitiges Pflichtdokument, das **Basisinformationsblatt** – früher hieß es „wesentliche Anlegerinformationen“. Es sieht langweilig aus und ist das einzige Papier, das man vor einem Kauf wirklich braucht. Auf der zweiten Seite steht eine Kostentabelle, und dort stehen die Zahlen, die vergleichbar sind.',
        },
        {
          type: 'list',
          items: [
            '**Laufende Kosten** in Prozent pro Jahr – das ist die Zahl, die zwischen zwei ähnlichen Fonds entscheidet.',
            '**Transaktionskosten** – was der Fonds für sein eigenes Handeln zahlt. Sie stehen getrennt, weil sie nicht in der Kostenquote enthalten sind.',
            '**Einstiegs- und Ausstiegskosten** – der Ausgabeaufschlag, sofern es einen gibt.',
            '**Wirkung auf die Rendite** – dasselbe noch einmal als Beispielrechnung über eine Halteperiode. Das ist die ehrlichste Darstellung, die es gibt, weil sie in Euro rechnet.',
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Drei Kosten, die woanders stehen',
          items: [
            '**Der Spread** taucht in keinem Dokument auf. Er ist die Differenz zwischen An- und Verkaufskurs und wird nie in Rechnung gestellt – man zahlt ihn, indem man über dem Mittelkurs kauft und darunter verkauft. Bei breiten ETFs zur Haupthandelszeit ist er klein, außerhalb davon und bei Nischenprodukten spürbar.',
            '**Die Zuwendung an den Vermittler.** Wer über eine Bank oder einen Berater kauft, findet sie im Beratungsprotokoll oder in der jährlichen Kostenaufstellung. Sie ist Teil der laufenden Kosten und fließt an den, der beraten hat – was erklärt, warum manche Produkte häufiger empfohlen werden als andere.',
            '**Die Steuer.** Sie ist keine Gebühr, wirkt aber wie eine: Was jedes Jahr abgeführt wird, verzinst sich nicht mehr mit. Deshalb ist ein thesaurierender Fonds im Depot einer Ausschüttung, die man ohnehin wieder anlegen würde, meist überlegen.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Der Vergleich, der sich lohnt – und der, der es nicht tut',
        },
        {
          type: 'paragraph',
          text: 'Kostenvergleiche haben eine natürliche Grenze. Zwischen 1,5 und 0,2 Prozent liegt über dreißig Jahre ein Vermögen; zwischen 0,20 und 0,12 Prozent liegt eine Zahl, die von der Handelsspanne eines einzigen Kaufs überdeckt wird. Wer den zweiten Vergleich wochenlang betreibt, optimiert die dritte Nachkommastelle und übersieht darüber die erste.',
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Die Reihenfolge, in der es sich rechnet',
          items: [
            '**Einmal richtig entscheiden:** breiter Indexfonds statt teurem aktivem Fonds. Das ist der ganze Unterschied, alles Weitere sind Feinheiten.',
            '**Einmal den Anbieter wählen:** keine Depotgebühr, kostenfreie Sparplanausführung. Danach nie wieder darüber nachdenken.',
            '**Zur Haupthandelszeit kaufen** – vormittags bis nachmittags, wenn die Heimatbörse der enthaltenen Aktien geöffnet ist. Das kostet nichts und spart Spread.',
            '**Und dann aufhören zu optimieren.** Der teuerste Posten in dieser Liste ist keine Gebühr, sondern die Zeit, die man mit dem Vergleichen der letzten Zehntelprozente verbringt.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was du dir merken solltest',
        },
        {
          type: 'list',
          items: [
            'Drei der sechs Kostenarten stehen auf keiner Abrechnung – und sind zusammen der größere Posten.',
            'Laufende Kosten treffen jedes Jahr das gesamte Vermögen, einmalige nur die Einzahlung.',
            'Über dreißig Jahre entscheidet die Kostenquote über einen erheblichen Teil des Ergebnisses.',
            'Der größte Hebel sind die Fondskosten, der kleinste die einzelne Ordergebühr.',
            'Nachlesen im Basisinformationsblatt – dort stehen laufende Kosten und Transaktionskosten getrennt.',
            'Der Sprung von 1,5 auf 0,2 Prozent lohnt jede Mühe. Der von 0,20 auf 0,12 keine.',
          ],
        },
      ],
    },

    // -------------------------------------------------------- Fortgeschritten
    fortgeschritten: {
      metaTitle: 'TER, Tracking-Differenz und die wahren Gesamtkosten',
      metaDescription:
        'Was die TER enthält und was nicht, wie die Tracking-Differenz die wahren Kosten eines ETF zeigt und wie sich die Gesamtkostenquote sauber berechnen lässt.',
      title: 'Kosten vollständig erfassen',
      lead: 'Warum die Kostenquote eine Untergrenze ist, welche Zahl stattdessen zählt und wie sich die eigenen Gesamtkosten je Jahr berechnen lassen.',
      readingMinutes: 10,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Was in der Kostenquote fehlt',
        },
        {
          type: 'paragraph',
          text: 'Die **TER** – Total Expense Ratio, Gesamtkostenquote – klingt vollständig und ist es nicht. Sie umfasst Verwaltung, Depotbank, Wirtschaftsprüfung und Vertrieb. Drei Posten stehen ausdrücklich nicht darin:',
        },
        {
          type: 'list',
          items: [
            '**Transaktionskosten innerhalb des Fonds.** Was das Handeln im Fonds kostet, wird gesondert ausgewiesen. Ein Fonds, der seinen Bestand jährlich umschlägt, zahlt hier ein Vielfaches eines ruhigen – bei identischer TER.',
            '**Erfolgsabhängige Vergütung.** Wird nur in guten Jahren fällig und steht deshalb nicht in der laufenden Quote.',
            '**Swap-Gebühren** bei synthetisch abbildenden Fonds – der Preis für das Tauschgeschäft.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Die TER ist damit eine **Untergrenze**, keine Gesamtangabe. Das ist kein Vorwurf an die Fondsgesellschaften – so ist die Kennzahl definiert. Man muss es nur wissen.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die Zahl, die stattdessen zählt',
        },
        {
          type: 'paragraph',
          text: 'Bei Indexfonds gibt es eine bessere Größe: die **Tracking-Differenz**. Sie misst nicht eine Gebühr, sondern ein Ergebnis – wie weit lag die Wertentwicklung des Fonds im vergangenen Jahr hinter der seines Index? Alles, was tatsächlich passiert ist, steckt darin: Verwaltung, Handelskosten, Quellensteuern, Erträge aus Wertpapierleihe.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Sie kann kleiner sein als die TER – und sogar negativ',
          items: [
            'Wenn ein Fonds über Wertpapierleihe Zusatzerträge erzielt oder Quellensteuern besser zurückholt, als der Index unterstellt, verkleinert das seinen Rückstand.',
            'In Einzelfällen liegt der Fonds sogar vor seinem Index. Das ist kein Kunststück des Managements, sondern eine Folge der Konstruktion.',
            'Zu betrachten sind mehrere Jahre. Ein einzelnes kann von einem Sondereffekt geprägt sein.',
            'Zu finden ist die Zahl im Jahresbericht des Fonds und in unabhängigen Datenbanken.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die eigenen Gesamtkosten ausrechnen',
        },
        {
          type: 'paragraph',
          text: 'Für einen ehrlichen Vergleich zweier Wege rechnet man die Kosten eines Jahres zusammen – in Euro, nicht in Prozent. Prozentzahlen verschiedener Bezugsgrößen lassen sich nicht addieren.',
        },
        {
          type: 'table',
          caption: 'Beispielrechnung für ein Jahr',
          head: ['Posten', 'Rechnung'],
          rows: [
            ['Laufende Fondskosten', 'Depotwert × Kostenquote'],
            ['Ordergebühren', 'Anzahl der Käufe × Gebühr je Order'],
            ['Spread', 'Umgesetzter Betrag × halbe Geld-Brief-Spanne'],
            ['Depotgebühr', 'Fester Jahresbetrag'],
            ['Summe', 'Alles zusammen, geteilt durch den Depotwert = wahre Quote'],
          ],
        },
        {
          type: 'paragraph',
          text: 'Diese Rechnung führt regelmäßig zu einer Überraschung: Bei einem kleinen Depot mit häufigen Käufen dominieren die Ordergebühren, bei einem großen mit wenigen Käufen die Fondskosten. Die Frage „welcher Broker ist günstiger“ hat deshalb keine allgemeine Antwort – sie hängt an Depotgröße und Handelshäufigkeit.',
        },
        {
          type: 'figure',
          figure: 'kosten-wahre-quote',
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Die praktische Konsequenz',
          items: [
            'Kleines Depot, monatlicher Sparplan: Auf kostenfreie Sparplanausführung achten. Die Fondskostenquote ist zweitrangig, solange sie im üblichen Rahmen liegt.',
            'Großes Depot, seltene Käufe: Auf die Fondskostenquote und die Tracking-Differenz achten. Ein Euro mehr je Order ist bedeutungslos.',
            'In beiden Fällen gilt: Beim Kauf über die Börse entfällt der Ausgabeaufschlag, und viele Anbieter erheben keine Depotgebühr.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was du dir merken solltest',
        },
        {
          type: 'list',
          items: [
            'Die TER ist eine Untergrenze: Handelskosten im Fonds, Erfolgsvergütung und Swap-Gebühren fehlen darin.',
            'Die Tracking-Differenz misst das Ergebnis statt einer Gebühr – über mehrere Jahre betrachtet.',
            'Gesamtkosten in Euro rechnen, nicht in Prozent addieren.',
            'Welcher Anbieter günstiger ist, hängt von Depotgröße und Handelshäufigkeit ab.',
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ Profi
    profi: {
      metaTitle: 'Kosten für Profis: Rückvergütungen, Performance-Fee, Grenzen',
      metaDescription:
        'Bestandsprovisionen und Kickbacks, erfolgsabhängige Vergütungen mit und ohne Hochwassermarke sowie die Frage, wo Sparen an Kosten schadet.',
      title: 'Kosten auf Profi-Niveau',
      lead: 'Wer an deinem Depot mitverdient, ohne dass es auf einer Rechnung steht – und wo billiger tatsächlich schlechter ist.',
      readingMinutes: 11,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Bestandsprovisionen: die unsichtbarste Kostenebene',
        },
        {
          type: 'paragraph',
          text: 'Ein erheblicher Teil der laufenden Fondskosten fließt nicht an die Fondsgesellschaft, sondern zurück an den Vertrieb – an die Bank oder den Vermittler, über den der Fonds verkauft wurde. Diese **Bestandsprovision** wird jährlich gezahlt, solange der Fonds im Depot liegt, und beträgt oft die Hälfte der Verwaltungsvergütung.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Warum das den Rat beeinflusst, den man bekommt',
          items: [
            'Ein Berater, der von Bestandsprovisionen lebt, verdient an einem Fonds mit 1,5 Prozent Kosten jährlich, an einem Indexfonds mit 0,15 Prozent praktisch nichts.',
            'Das macht ihn nicht unehrlich – es macht seine Empfehlung erwartbar. Beides zu wissen ist besser, als eines davon zu unterstellen.',
            'Seit MiFID II muss offengelegt werden, was geflossen ist. Die Angabe steht in der jährlichen Kosteninformation, meist auf der letzten Seite.',
            'Die Alternative heißt **Honorarberatung**: Man zahlt für die Beratung direkt und bekommt Fonds ohne Vertriebsvergütung. Sichtbar teurer, in der Summe häufig günstiger.',
          ],
        },
        {
          type: 'figure',
          figure: 'kosten-bestandsprovision',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Erfolgsabhängige Vergütung – auf die Bedingungen kommt es an',
        },
        {
          type: 'paragraph',
          text: 'Eine **Performance-Fee** klingt fair: Der Manager verdient nur, wenn er liefert. Ob das stimmt, hängt an drei Bedingungen, die im Verkaufsprospekt stehen.',
        },
        {
          type: 'table',
          caption: 'Worauf zu achten ist',
          head: ['Bedingung', 'Was sie bewirkt'],
          rows: [
            [
              'Hochwassermarke',
              'Ohne sie kann derselbe Wertzuwachs nach einem Verlustjahr ein zweites Mal vergütet werden. Mit ihr muss der alte Höchststand erst wieder erreicht sein.',
            ],
            [
              'Vergleichsmaßstab',
              'Gegen den risikolosen Zins gemessen ist eine Aktienrendite fast immer eine „Überrendite“. Gegen einen passenden Index gemessen wird es anspruchsvoll.',
            ],
            [
              'Abrechnungszeitraum',
              'Jährlich abgerechnet zahlt man in guten Jahren, ohne dass schlechte gegengerechnet werden. Über mehrere Jahre ist es ausgewogener.',
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'Eine Performance-Fee ohne Hochwassermarke, gemessen gegen den Geldmarktzins und jährlich abgerechnet, ist im Kern eine erhöhte Verwaltungsvergütung mit besserem Namen.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wo Sparen an Kosten schadet',
        },
        {
          type: 'paragraph',
          text: 'Kosten zu senken ist der zuverlässigste Renditehebel – aber nicht unbegrenzt. An vier Stellen ist die billigste Variante die schlechtere.',
        },
        {
          type: 'list',
          items: [
            '**Sehr kleine Fonds.** Ein Fondsvolumen im niedrigen zweistelligen Millionenbereich rechnet sich für den Anbieter kaum. Die Schließung ist wahrscheinlicher, und sie schreibt Gewinne zu einem Zeitpunkt fest, den man nicht gewählt hat.',
            '**Exotische Handelsplätze.** Ein Handelsplatz ohne Gebühr, aber mit doppeltem Spread ist teurer, nicht günstiger. Die Gegenprobe ist der Vergleich mit dem Referenzkurs zur selben Sekunde.',
            '**Ausländische Broker ohne Steuerabwicklung.** Die Gebührenersparnis wird mit Eigenarbeit und Fehlerrisiko bezahlt. Bei einem einfachen Depot vertretbar, bei vielen Positionen selten.',
            '**Versicherungen.** Der günstigste Tarif ist wertlos, wenn die Bedingungen den Leistungsfall ausschließen. Hier entscheidet der Vertragstext, nicht der Beitrag.',
          ],
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Die Faustregel',
          items: [
            'Bei **standardisierten** Produkten – breite Indexfonds, Tagesgeld, Wertpapierhandel – ist billiger fast immer besser, weil die Leistung identisch ist.',
            'Bei **Leistungsversprechen** – Versicherungen, Beratung, Verwahrung besonderer Werte – entscheidet der Inhalt, und der Preis ist zweitrangig.',
            'Die Unterscheidung zu treffen ist die eigentliche Aufgabe. Wer sie beherrscht, spart an der richtigen Stelle.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was du dir merken solltest',
        },
        {
          type: 'list',
          items: [
            'Bestandsprovisionen erklären, warum ein Berater bestimmte Fonds empfiehlt – nachzulesen in der jährlichen Kosteninformation.',
            'Eine Performance-Fee ist nur ohne Hochwassermarke und mit schwachem Maßstab ein schlechtes Geschäft – beides steht im Prospekt.',
            'Bei standardisierten Produkten ist billiger besser, bei Leistungsversprechen entscheidet der Inhalt.',
          ],
        },
      ],
    },
  },
}
