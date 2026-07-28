import type { LearnTopic } from '@/data/learn/types'
import { kurs, modifizierteDuration, zinsschock } from '@/lib/anleihen'
import { formatNumber, formatPercent } from '@/lib/format'
import {
  anleiheBeispiel as BEISPIEL,
  anleiheLaufzeiten as LAUFZEITEN,
  anleiheMarktzins as MARKTZINS,
  anleiheNeuerZins as NEUER_ZINS,
  anleiheSchocks as SCHOCKS,
} from '@/lib/lernszenarien'

/*
  Alle Kurse und Durationen dieses Themas kommen aus `lib/anleihen.ts`.

  Diese Zahlen sind der Grund, warum das Thema überhaupt schwer ist: Dass ein
  Anleihekurs fällt, wenn die Zinsen steigen, lässt sich behaupten. Wie stark
  er fällt, muss man rechnen – und die verbreitete Faustformel über die
  Duration liegt dabei systematisch daneben. Beides nebeneinander zu zeigen
  geht nur, wenn beide Zahlen aus derselben geprüften Funktion stammen.
*/
const kursJeLaufzeit = LAUFZEITEN.map((jahre) => ({
  jahre,
  kurs: kurs({ kuponProzent: BEISPIEL.kuponProzent, jahre }, NEUER_ZINS),
  duration: modifizierteDuration(
    { kuponProzent: BEISPIEL.kuponProzent, jahre },
    MARKTZINS
  ),
}))

/** Näherung gegen tatsächliche Rechnung – der Unterschied ist die Konvexität. */
const schockreihe = SCHOCKS.map((punkte) => ({
  punkte,
  ...zinsschock(BEISPIEL, MARKTZINS, punkte),
}))

/*
  Break-even-Spread: Welche jährliche Ausfallquote trägt ein Aufschlag gerade
  noch? Näherung nach dem üblichen Kreditmodell – Aufschlag geteilt durch den
  Verlust im Ausfall. Sie unterschlägt Zinseszins und Laufzeitstruktur und
  taugt deshalb als Größenordnung, nicht als Bewertung. Genau so steht sie
  auch im Text.
*/
const ERLOESQUOTE = 40
const SPREADS = [1, 2, 3, 5]
const breakEven = SPREADS.map((spread) => ({
  spread,
  ausfallquote: spread / (1 - ERLOESQUOTE / 100),
}))

/**
 * Vollständig ausgearbeitetes Thema.
 *
 * Stufenaufbau: Beginner klärt Gläubigerstellung und Emittentenrisiko –
 * einschließlich der Warnung, dass Zertifikate rechtlich dasselbe sind.
 * Fortgeschritten rechnet die Kursmechanik und die Duration durch. Profi
 * behandelt Rangfolge und Bail-in, Vertragsklauseln und die Bewertung über
 * Barwert und Break-even-Spread.
 *
 * ## Abgrenzung zu „Staatsanleihe“
 *
 * Dort geht es um den Emittenten Staat, seine Besonderheiten und die
 * Zinsstrukturkurve. Hier um das Instrument selbst, unabhängig davon, wer es
 * ausgibt.
 */
export const schuldverschreibung: LearnTopic = {
  slug: 'schuldverschreibung',
  title: 'Schuldverschreibung',
  headline: 'Du bist Gläubiger, nicht Eigentümer',
  metaTitle: 'Schuldverschreibung erklärt: Zins, Kurs und Risiko',
  metaDescription:
    'Wie eine Schuldverschreibung funktioniert, warum Kurs und Rendite gegenläufig sind und welche Risiken bei Anleihen und Zertifikaten wirklich zählen.',
  lead: 'Wer eine Schuldverschreibung kauft, leiht Geld. Der Unterschied zur Aktie: kein Miteigentum, dafür ein Rückzahlungsanspruch – solange der Schuldner zahlen kann.',
  overview: [
    'Eine Schuldverschreibung ist ein verbrieftes Darlehen. Der Emittent verpflichtet sich, Zinsen zu zahlen und den Nennwert zum Laufzeitende zurückzugeben.',
    'Als Gläubiger stehst du in der Insolvenz vor den Eigentümern – aber hinter den besicherten Gläubigern. Die Rangfolge entscheidet über den tatsächlichen Schutz, nicht das Wort „Anleihe“.',
    'Die Stufen führen von Nennwert, Kupon und Laufzeit über Kursmechanik, Duration und Bonität bis zu Nachrangkonstruktionen, Vertragsklauseln und der Bewertung über Zahlungsströme.',
  ],
  keywords: [
    'Schuldverschreibung',
    'Anleihe',
    'Kupon',
    'Emittentenrisiko',
    'Duration',
    'Zertifikat',
  ],
  related: ['staatsanleihe', 'fonds', 'derivat', 'einlagensicherung'],
  levels: {
    // ---------------------------------------------------------------- Beginner
    beginner: {
      metaTitle: 'Schuldverschreibung einfach erklärt: Kupon und Risiko',
      metaDescription:
        'Nennwert, Kupon und Laufzeit verständlich erklärt, der Unterschied zur Aktie und was Emittentenrisiko für dein Geld konkret bedeutet.',
      title: 'Was du kaufst, wenn du Geld verleihst',
      lead: 'Die vier Grundbegriffe, der Unterschied zur Aktie – und das eine Risiko, auf das es ankommt.',
      readingMinutes: 8,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Eine Aktie macht dich zum Miteigentümer. Eine Schuldverschreibung macht dich zum Gläubiger: Du leihst Geld her und bekommst dafür ein Versprechen – Zinsen während der Laufzeit und den Betrag am Ende zurück. Das klingt nach der sichereren Variante, und oft ist es das auch. Wovon es abhängt, ist der Inhalt dieser Stufe.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die vier Grundbegriffe',
        },
        {
          type: 'table',
          caption: 'Was auf jedem Papier steht',
          head: ['Begriff', 'Bedeutung', 'Beispiel'],
          rows: [
            [
              'Nennwert',
              'Der Betrag, der am Laufzeitende zurückgezahlt wird',
              '1.000 € je Stück – üblich sind 1.000 €, bei Neuemissionen auch 100.000 €',
            ],
            [
              'Kupon',
              'Der feste Zinssatz, jährlich auf den Nennwert',
              '3 % Kupon bedeutet 30 € im Jahr je 1.000 € Nennwert',
            ],
            [
              'Laufzeit',
              'Bis wann geliehen wird, mit festem Fälligkeitstermin',
              'Von wenigen Monaten bis zu dreißig Jahren',
            ],
            [
              'Emittent',
              'Wer das Geld leiht und zurückzahlen muss',
              'Staat, Bank, Unternehmen – hier entscheidet sich alles',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Der Kupon bezieht sich immer auf den Nennwert',
          items: [
            'Nicht auf den Kurs, den du bezahlt hast. Ein Papier mit 3 % Kupon zahlt 30 € im Jahr – auch wenn du es für 900 € gekauft hast.',
            'Deine tatsächliche Verzinsung ist deshalb eine andere als der Kupon. Bei 900 € Kaufpreis sind 30 € Zins gut 3,3 % – plus dem Gewinn, wenn am Ende 1.000 € zurückkommen.',
            'Genau darum geht es in der nächsten Stufe: Kupon und Rendite sind nicht dasselbe.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Gläubiger gegen Eigentümer',
        },
        {
          type: 'table',
          caption: 'Zwei Rollen, zwei Rechtepakete',
          head: ['', 'Aktie', 'Schuldverschreibung'],
          rows: [
            ['Rolle', 'Miteigentümer', 'Gläubiger'],
            [
              'Anspruch',
              'Anteil am Gewinn, wenn er anfällt',
              'Zins und Rückzahlung, vertraglich zugesagt',
            ],
            ['Mitsprache', 'Stimmrecht auf der Hauptversammlung', 'Keines'],
            [
              'Bei gutem Verlauf',
              'Unbegrenzte Beteiligung am Erfolg',
              'Genau der vereinbarte Kupon, nicht mehr',
            ],
            [
              'In der Insolvenz',
              'Zuletzt bedient – meist Totalverlust',
              'Vor den Aktionären, aber hinter besicherten Gläubigern',
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'Die letzte Zeile ist die wichtigste und wird am häufigsten missverstanden. „Vor den Aktionären“ heißt nicht „an erster Stelle“. Vor dir stehen Sicherheiten, Löhne, Steuern und oft besicherte Kredite. Was danach übrig ist, wird unter den einfachen Gläubigern verteilt.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Das entscheidende Risiko',
        },
        {
          type: 'paragraph',
          text: 'Bei einer Schuldverschreibung gibt es genau ein Risiko, das alles andere überlagert: **Zahlt der Schuldner?** Alle anderen Größen – Kurs, Laufzeit, Zinsniveau – bewegen den Wert. Ein Ausfall vernichtet ihn.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Drei Sätze, die zusammengehören',
          items: [
            '**Es gibt keine Einlagensicherung.** Eine Schuldverschreibung ist keine Bankeinlage. Die 100.000 € Sicherung gelten für Tagesgeld und Festgeld – nicht für Papiere derselben Bank.',
            '**Ein hoher Kupon ist kein gutes Angebot, sondern eine Einschätzung.** Wer 8 % zahlen muss, während andere 3 % zahlen, bekommt das Geld nicht billiger. Der Aufschlag ist der Preis für das Risiko, und der Markt setzt ihn nicht zufällig.',
            '**Zertifikate sind rechtlich Schuldverschreibungen.** Auch wenn sie sich auf einen Index beziehen: Geht die ausgebende Bank unter, ist das Papier wertlos – unabhängig davon, wie der Index steht.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Der letzte Punkt hat 2008 in Deutschland viele getroffen: Zertifikate der Investmentbank Lehman Brothers waren über Bankfilialen breit verkauft worden. Als die Bank zusammenbrach, waren die Papiere praktisch wertlos – die zugrunde liegenden Indizes spielten dabei keine Rolle. Bei einem Fonds wäre das nicht passiert: Ein Fonds ist Sondervermögen und gehört nicht der Bank.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was du dir merken solltest',
        },
        {
          type: 'list',
          items: [
            'Der Kupon bezieht sich auf den Nennwert, nicht auf deinen Kaufpreis.',
            'Gläubiger stehen vor Aktionären, aber hinter besicherten Gläubigern.',
            'Ein hoher Kupon ist der Preis für ein Risiko, kein Sonderangebot.',
            'Zertifikate sind Schuldverschreibungen der ausgebenden Bank – Fonds sind Sondervermögen.',
          ],
        },
      ],
    },

    // -------------------------------------------------------- Fortgeschritten
    fortgeschritten: {
      metaTitle: 'Anleihen: Kursmechanik, Duration und Bonität',
      metaDescription:
        'Warum Kurs und Rendite gegenläufig laufen, wie Duration die Zinsempfindlichkeit misst und was Ratings über Ausfallwahrscheinlichkeiten sagen.',
      title: 'Kursmechanik, Duration und Bonität',
      lead: 'Warum Anleihekurse fallen, wenn die Zinsen steigen – und um wie viel genau.',
      readingMinutes: 12,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Warum sich der Kurs bewegt',
        },
        {
          type: 'paragraph',
          text: `Der Kupon einer Anleihe ist festgeschrieben und ändert sich nie. Wenn sich das Zinsniveau ändert, muss sich also etwas anderes anpassen – und das ist der Kurs. Eine Anleihe mit ${formatPercent(BEISPIEL.kuponProzent, 0)} Kupon ist unattraktiv, sobald neue Papiere ${formatPercent(NEUER_ZINS, 0)} zahlen. Kaufen wird sie nur, wer sie so günstig bekommt, dass unter dem Strich dieselbe Rendite herauskommt.`,
        },
        {
          type: 'paragraph',
          text: 'Rechnerisch ist der Kurs nichts anderes als der **Barwert** aller künftigen Zahlungen: alle Kupons plus die Rückzahlung, jeweils mit dem aktuellen Marktzins abgezinst. Steigt der Marktzins, wiegen künftige Zahlungen weniger – der Kurs fällt. Und je länger die Restlaufzeit, desto mehr Zahlungen sind betroffen.',
        },
        {
          type: 'table',
          caption: `Kurs einer Anleihe mit ${formatPercent(BEISPIEL.kuponProzent, 0)} Kupon, wenn der Marktzins bei ${formatPercent(NEUER_ZINS, 0)} steht`,
          head: ['Restlaufzeit', 'Kurs in % vom Nennwert', 'Verlust gegenüber 100'],
          rows: kursJeLaufzeit.map((zeile) => [
            `${zeile.jahre} Jahre`,
            formatNumber(zeile.kurs, 2),
            `− ${formatPercent(100 - zeile.kurs, 1)}`,
          ]),
        },
        {
          type: 'paragraph',
          text: 'Dieselbe Zinsbewegung, viermal derselbe Kupon – und der Kursverlust reicht von wenigen Prozent bis über ein Viertel. Die Restlaufzeit ist der Hebel, nicht die Zinsänderung. Das ist die Erklärung dafür, warum 2022 langlaufende Anleihen zweistellig verloren haben, obwohl an ihrer Bonität nichts auszusetzen war.',
        },
        {
          type: 'figure',
          figure: 'anleihe-kurs-und-zins',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Drei Begriffe, die auseinandergehalten werden müssen',
          items: [
            '**Kupon.** Der feste Zinssatz auf den Nennwert. Ändert sich nie.',
            '**Laufende Verzinsung.** Kupon geteilt durch den aktuellen Kurs. Sagt, was du bezogen auf deinen Einsatz an Zins bekommst – ignoriert aber den Rückzahlungsgewinn oder -verlust.',
            '**Rendite bis Fälligkeit.** Die Gesamtrendite, wenn du bis zum Ende hältst: Kupons plus die Differenz zwischen Kaufkurs und Nennwert. Das ist die Zahl, die zählt.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Dazu kommen die **Stückzinsen**: Wer zwischen zwei Zinsterminen kauft, zahlt dem Verkäufer den bis dahin aufgelaufenen Zinsanteil zusätzlich zum Kurs. Das ist kein Aufschlag, sondern eine Verrechnung – beim nächsten Kupontermin bekommst du den vollen Kupon, also auch den Teil, der dem Verkäufer zustand.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Duration: die Zinsempfindlichkeit in einer Zahl',
        },
        {
          type: 'paragraph',
          text: 'Die **modifizierte Duration** beantwortet die Frage, wie stark der Kurs auf eine Zinsänderung reagiert. Sie wird in Jahren angegeben und lässt sich direkt lesen: Duration 8 heißt, dass ein Prozentpunkt mehr Zins etwa acht Prozent Kurs kostet.',
        },
        {
          type: 'table',
          caption: `Modifizierte Duration bei ${formatPercent(BEISPIEL.kuponProzent, 0)} Kupon und ${formatPercent(MARKTZINS, 0)} Marktzins`,
          head: [
            'Restlaufzeit',
            'Modifizierte Duration',
            'Erwartete Kursänderung je Prozentpunkt',
          ],
          rows: kursJeLaufzeit.map((zeile) => [
            `${zeile.jahre} Jahre`,
            `${formatNumber(zeile.duration, 2)} Jahre`,
            `∓ ${formatPercent(zeile.duration, 1)}`,
          ]),
        },
        {
          type: 'paragraph',
          text: 'Die Duration liegt immer unter der Laufzeit, sobald es Kupons gibt – ein Teil des Geldes fließt ja früher zurück. Bei einer Nullkuponanleihe fallen beide zusammen, weil alles am Ende kommt. Und je höher der Kupon, desto kürzer die Duration bei gleicher Laufzeit.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wo die Faustformel danebenliegt',
        },
        {
          type: 'paragraph',
          text: `Die Durationsregel ist eine Näherung, und sie ist an einer Stelle systematisch falsch. Für die zehnjährige Anleihe aus der Tabelle – ${formatPercent(BEISPIEL.kuponProzent, 0)} Kupon bei ${formatPercent(MARKTZINS, 0)} Marktzins, also Kurs 100 – sieht der Vergleich so aus:`,
        },
        {
          type: 'table',
          caption: 'Näherung über die Duration gegen exakt gerechneten Barwert',
          head: ['Zinsänderung', 'Näherung', 'Tatsächlich', 'Neuer Kurs'],
          rows: schockreihe.map((zeile) => [
            `${zeile.punkte > 0 ? '+' : '−'} ${formatPercent(Math.abs(zeile.punkte), 0)}`,
            `${formatPercent(zeile.genaehertProzent, 1)}`,
            `${formatPercent(zeile.tatsaechlichProzent, 1)}`,
            formatNumber(zeile.nachher, 2),
          ]),
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Die Abweichung geht immer zu deinen Gunsten',
          items: [
            'Bei steigenden Zinsen fällt der Kurs **weniger** stark als vorhergesagt.',
            'Bei fallenden Zinsen steigt er **stärker** als vorhergesagt.',
            'Diese Eigenschaft heißt **Konvexität**. Sie ist der Grund, warum die Durationsregel bei kleinen Zinsschritten gut genug ist und bei großen zu pessimistisch wird – und warum sie nie zu optimistisch wird.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Einzelanleihe oder Anleihefonds?',
        },
        {
          type: 'paragraph',
          text: 'Der Unterschied ist größer, als er aussieht. Eine **Einzelanleihe** hat einen Endtermin: Wer bis zur Fälligkeit hält und der Schuldner zahlt, bekommt den Nennwert – gleichgültig, was der Kurs zwischendurch gemacht hat. Der Buchverlust löst sich mit der Zeit von selbst auf.',
        },
        {
          type: 'paragraph',
          text: 'Ein **Anleihefonds** hat keinen Endtermin. Er hält laufend Papiere einer bestimmten Restlaufzeit und ersetzt fällige durch neue. Ein Kursverlust verschwindet hier nicht automatisch – er wird durch die höheren Kupons der neu gekauften Papiere erst über einen Zeitraum aufgeholt, der ungefähr der Duration des Fonds entspricht. Dafür bekommt man Streuung über viele Emittenten, die mit einzelnen Papieren kaum zu erreichen ist.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Bonität einschätzen',
        },
        {
          type: 'table',
          caption: 'Ratingstufen und was sie bedeuten',
          head: ['Bereich', 'Stufen', 'Einordnung'],
          rows: [
            [
              'Investment Grade',
              'AAA bis BBB−',
              'Ausfälle sind historisch selten; viele institutionelle Anleger dürfen nur hier kaufen',
            ],
            [
              'High Yield',
              'BB+ und darunter',
              'Deutlich höhere Ausfallraten, entsprechend höhere Kupons. Früher „Junk Bonds“',
            ],
            ['Ausfall', 'D', 'Zahlung ist ausgeblieben oder das Verfahren läuft'],
          ],
        },
        {
          type: 'paragraph',
          text: 'Der **Credit Spread** ist der Aufschlag gegenüber einer als sicher geltenden Staatsanleihe gleicher Laufzeit. Er ist die Meinung des Marktes über das Ausfallrisiko – und er bewegt sich täglich, während ein Rating monatelang unverändert bleibt. Wer wissen will, was der Markt gerade denkt, schaut auf den Spread, nicht auf den Buchstaben.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Grenzen von Ratings',
          items: [
            '**Sie reagieren spät.** Herabstufungen kommen typischerweise, nachdem der Kurs bereits gefallen ist.',
            '**Sie werden vom Emittenten bezahlt.** Der Interessenkonflikt ist strukturell und war ein zentraler Kritikpunkt nach 2008, als hochbewertete Verbriefungen reihenweise ausfielen.',
            '**Sie sind eine Rangfolge, keine Wahrscheinlichkeit.** AA ist besser als A. Wie viel besser, sagt der Buchstabe nicht.',
            'Die praktische Konsequenz ist Streuung über viele Emittenten statt Vertrauen auf eine Note.',
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
            'Der Kurs ist der Barwert aller Zahlungen – steigt der Marktzins, fällt er.',
            'Die Restlaufzeit ist der Hebel: Dieselbe Zinsbewegung wirkt bei zwanzig Jahren um ein Vielfaches stärker als bei zwei.',
            'Die Durationsregel ist eine Näherung, die bei großen Sprüngen zu pessimistisch ist – nie zu optimistisch.',
            'Die Einzelanleihe holt Buchverluste durch die Fälligkeit auf, der Fonds über die Zeit seiner Duration.',
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ Profi
    profi: {
      metaTitle: 'Anleihen für Profis: Rang, Klauseln, Bewertung',
      metaDescription:
        'Nachrang und Bail-in, Kündigungsrechte und Covenants, strukturierte Zertifikate sowie Bewertung über Barwert und Break-even-Spread.',
      title: 'Rang, Klauseln und Bewertung',
      lead: 'Wo im Kleingedruckten entschieden wird, wie viel ein Rückzahlungsversprechen wert ist.',
      readingMinutes: 14,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Die Rangfolge ist das Produkt',
        },
        {
          type: 'paragraph',
          text: 'Zwei Anleihen desselben Emittenten mit derselben Laufzeit können völlig verschiedene Risiken tragen. Der Unterschied steht nicht im Kupon, sondern im Rang – und der entscheidet, wer im Ernstfall etwas bekommt.',
        },
        {
          type: 'table',
          caption: 'Rangfolge bei einer Insolvenz, von oben nach unten',
          head: ['Rang', 'Merkmal', 'Erwartung im Ernstfall'],
          rows: [
            [
              'Besichert',
              'Mit Sicherheiten unterlegt, etwa Immobilien oder Forderungen',
              'Zugriff auf die Sicherheit, oft weitgehende Rückzahlung',
            ],
            [
              'Vorrangig unbesichert',
              'Der Normalfall bei Unternehmensanleihen',
              'Quote aus der Insolvenzmasse; historisch grob ein Drittel bis die Hälfte',
            ],
            [
              'Nachrangig',
              'Wird erst nach allen vorrangigen Gläubigern bedient',
              'Meist Totalverlust, wenn es überhaupt so weit kommt',
            ],
            [
              'Hybrid / AT1',
              'Zusätzliches Kernkapital von Banken, mit Wandlungs- oder Abschreibungsklausel',
              'Ausfall bereits vor der Insolvenz möglich – siehe unten',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Bail-in und CoCo-Bonds',
          items: [
            'Seit der Finanzkrise gilt für Banken eine gesetzliche Haftungskaskade: Bevor öffentliche Mittel fließen, haften Eigentümer und bestimmte Gläubiger – das ist der **Bail-in**.',
            '**CoCo-Bonds** (AT1) tragen diese Haftung im Vertrag: Unterschreitet die Kapitalquote eine festgelegte Schwelle, werden sie in Aktien gewandelt oder ganz abgeschrieben. Ein Insolvenzverfahren braucht es dafür nicht.',
            'Bei der Notübernahme der Credit Suisse im März 2023 wurden AT1-Papiere im Umfang von rund 16 Milliarden Franken vollständig abgeschrieben, während die Aktionäre UBS-Anteile erhielten. Die übliche Rangfolge war damit umgekehrt – vertraglich zulässig und für viele Anleger eine Überraschung.',
            'Die Lehre daraus ist nicht „AT1 meiden“, sondern: Bei diesen Papieren steht das Risiko in den Vertragsbedingungen, nicht in der Bilanz des Emittenten.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Klauseln, die die Rendite verändern',
        },
        {
          type: 'list',
          items: [
            '**Kündigungsrecht des Emittenten (Call).** Er darf vorzeitig zurückzahlen – und tut das genau dann, wenn er sich billiger refinanzieren kann, also bei gefallenen Zinsen. Für dich heißt das: Der Kursanstieg bei fallenden Zinsen ist gedeckelt, der Kursverlust bei steigenden nicht. Die aussagekräftige Kennzahl ist deshalb die Rendite bis zum frühesten Kündigungstermin, nicht bis zur Fälligkeit.',
            '**Covenants.** Vertragliche Auflagen, etwa Obergrenzen für weitere Verschuldung oder Ausschüttungen. Sie schützen Gläubiger – aber nur, wenn sie durchsetzbar formuliert sind. In Phasen hoher Nachfrage nach Anleihen werden sie regelmäßig verwässert; der Fachbegriff dafür ist „covenant-lite“.',
            '**Floater.** Der Kupon hängt an einem Referenzzins und wird regelmäßig angepasst. Das Zinsänderungsrisiko ist damit weitgehend weg, das Emittentenrisiko bleibt vollständig.',
            '**Inflationsindexierte Papiere.** Nennwert oder Kupon werden an einen Preisindex gekoppelt. Sie schützen gegen Inflation, nicht gegen steigende Realzinsen – bei denen verlieren sie wie jede andere Anleihe.',
            '**Step-up-Kupons.** Der Kupon steigt über die Laufzeit oder bei einer Ratingverschlechterung. Meist ein Zugeständnis an Anleger, das ohne den zugehörigen Call-Termin nicht zu bewerten ist.',
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Wo diese Angaben stehen',
          items: [
            'Im **Wertpapierprospekt** – vollständig, juristisch und mehrere hundert Seiten lang. Die Anleihebedingungen darin sind der maßgebliche Text.',
            'Im **Basisinformationsblatt** – drei Seiten, verpflichtend, mit Risikoindikator und Kostenangaben. Gut für den ersten Überblick, unzureichend für die Rangfrage.',
            'Wer den Rang nicht in zwei Minuten findet, sollte das als Antwort werten: Bei einer vorrangig besicherten Anleihe steht er auf der ersten Seite.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Bewertung: Barwert und Break-even',
        },
        {
          type: 'paragraph',
          text: 'Die saubere Bewertung diskontiert jede Zahlung mit dem Zinssatz, der für ihren Zeitpunkt gilt – also mit der **Zinsstrukturkurve**, nicht mit einem einheitlichen Satz. Das ändert bei normalem Kurvenverlauf wenig und bei einer inversen Kurve erheblich. Die Rechnungen der vorigen Stufe verwenden bewusst einen Einheitszins: Sie zeigen die Mechanik, nicht den Marktpreis.',
        },
        {
          type: 'paragraph',
          text: `Für die Frage, ob ein Aufschlag das Risiko trägt, genügt eine einfache Überlegung. Fällt ein Schuldner aus, ist selten alles verloren – bei vorrangigen Unternehmensanleihen liegt die historische Erlösquote grob bei ${formatPercent(ERLOESQUOTE, 0)}. Der Aufschlag muss also den erwarteten Verlust decken, und der ist Ausfallwahrscheinlichkeit mal Verlustquote:`,
        },
        {
          type: 'table',
          caption: `Welche jährliche Ausfallquote ein Aufschlag gerade noch trägt, bei ${formatPercent(ERLOESQUOTE, 0)} Erlösquote`,
          head: ['Aufschlag über der sicheren Anlage', 'Getragene Ausfallquote je Jahr'],
          rows: breakEven.map((zeile) => [
            `+ ${formatPercent(zeile.spread, 0)}`,
            formatPercent(zeile.ausfallquote, 1),
          ]),
        },
        {
          type: 'paragraph',
          text: 'Die Rechnung ist eine Näherung – sie unterschlägt Zinseszins, Laufzeitstruktur und die Tatsache, dass Ausfälle gehäuft in Rezessionen auftreten, also gerade dann, wenn auch der Rest des Depots leidet. Als Größenordnung leistet sie trotzdem etwas: Ein Aufschlag von fünf Prozentpunkten ist kein Geschenk, sondern die Aussage des Marktes, dass hier mit erheblichen Ausfällen gerechnet wird.',
        },
        {
          type: 'figure',
          figure: 'anleihe-konvexitaet',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Zertifikate zerlegen',
        },
        {
          type: 'paragraph',
          text: 'Ein strukturiertes Zertifikat lässt sich fast immer in zwei Teile zerlegen: eine Nullkuponanleihe der ausgebenden Bank und eine oder mehrere Optionen. Ein Kapitalschutzzertifikat etwa besteht aus einer Anleihe, die zum Laufzeitende den Einsatz zurückbringt, plus einer Kaufoption vom Rest des Geldes.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Die Marge steckt in der Zerlegung.** Wer beide Teile einzeln bewertet und mit dem Ausgabepreis vergleicht, sieht die Kosten – im Produktblatt stehen sie oft nur teilweise.',
            '**Der Kapitalschutz ist so gut wie der Emittent.** Er ist ein Zahlungsversprechen derselben Bank, nicht eine Sicherheit. Bei deren Ausfall schützt er nichts.',
            '**Dividenden fehlen meist.** Bezieht sich das Zertifikat auf einen Kursindex statt auf einen Performanceindex, finanziert die einbehaltene Dividendenrendite einen Teil der Konstruktion.',
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Steuerliche Einordnung – keine Steuerberatung',
          items: [
            'Kupons gelten als Kapitalerträge, Kursgewinne beim Verkauf oder bei Fälligkeit ebenso; beides unterliegt der Abgeltungsteuer.',
            'Gezahlte Stückzinsen mindern im Jahr des Kaufs die steuerpflichtigen Erträge, erhaltene erhöhen sie – die Verrechnung übernimmt die inländische depotführende Stelle.',
            'Verluste aus Anleihen sind mit anderen Kapitalerträgen verrechenbar; für Aktien gilt ein eigener Verrechnungskreis, für Anleihen nicht.',
            'Bei größeren Beträgen, Auslandsdepots oder strukturierten Produkten gehört das zu jemandem mit Zulassung.',
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
            'Der Rang entscheidet über den Ernstfall – nicht der Kupon und nicht der Name des Emittenten.',
            'AT1-Papiere können vor einer Insolvenz ausfallen; die Credit Suisse 2023 hat gezeigt, dass die gewohnte Rangfolge dabei umkehrbar ist.',
            'Ein Kündigungsrecht des Emittenten deckelt den Gewinn und lässt das Verlustrisiko unberührt.',
            'Ein Aufschlag von fünf Prozentpunkten trägt bei üblicher Erlösquote eine jährliche Ausfallquote im hohen einstelligen Bereich – das ist die Aussage des Marktes, nicht ein Geschenk.',
          ],
        },
      ],
    },
  },
}
