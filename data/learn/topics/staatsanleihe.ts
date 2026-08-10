import { countryDebtRecords, DEBT_QUOTE_YEAR } from '@/lib/debt'
import type { LearnTopic } from '@/data/learn/types'
import { zinsschock } from '@/lib/anleihen'
import { formatNumber, formatPercent } from '@/lib/format'

/*
  Zwei gerechnete Blöcke, beide aus vorhandenen Quellen.

  1. Der Zinsschock von 2022 kommt aus `lib/anleihen.ts`. Er beantwortet die
     Frage, die nach 2022 am häufigsten gestellt wurde: Wie kann eine Anlage
     mit bester Bonität zweistellig verlieren? Die Antwort ist Arithmetik,
     nicht Bonität – und sie gehört ausgerechnet, nicht behauptet.

  2. Die Schuldendynamik benutzt die Länderdaten, die ohnehin unter
     /staatsverschuldung stehen. Damit stimmen Lerntext und Übersichtsseite
     zwangsläufig überein, und die Tabelle veraltet gemeinsam mit den Daten
     statt für sich allein.
*/

/** Eine lange Anleihe mit niedrigem Kupon – der Fall von 2022. */
const LANGE_ANLEIHE = { kuponProzent: 1, jahre: 20 }
const ZINS_2021 = 1
const SPRUNG = [1, 2, 3]
const schockreihe = SPRUNG.map((punkte) => ({
  punkte,
  ...zinsschock(LANGE_ANLEIHE, ZINS_2021, punkte),
}))

/*
  Schuldendynamik in ihrer einfachsten Form.

  Die Schuldenquote bleibt stabil, wenn der Primärsaldo den Term
  b · (r − g) / (1 + g) deckt. Alles daran ist grob: ein einheitlicher
  Zinssatz statt der tatsächlichen Zinslast des Altbestands, nominale
  Größen, keine Wechselkurse. Der Punkt ist auch nicht die Genauigkeit,
  sondern das Vorzeichen – wer unter g bleibt, braucht gar keinen Überschuss.
*/
const NOMINALES_WACHSTUM = 3
const DIFFERENZEN = [-1, 0, 1, 2]
const AUSWAHL = ['Deutschland', 'Italien', 'Japan']

const laender = AUSWAHL.map((name) =>
  countryDebtRecords.find((land) => land.name === name)!
)

function noetigerPrimaersaldo(quoteProzent: number, differenz: number): number {
  return ((quoteProzent / 100) * (differenz / 100) * 100) / (1 + NOMINALES_WACHSTUM / 100)
}

/**
 * Vollständig ausgearbeitetes Thema.
 *
 * Stufenaufbau: Beginner erklärt, warum Staaten Anleihen ausgeben und was
 * „risikofreier Zins“ bedeutet. Fortgeschritten behandelt Zinsstrukturkurve,
 * Spreads und die Portfoliorolle – einschließlich der Frage, warum Anleihen
 * 2022 nicht gepuffert haben. Profi rechnet Schuldentragfähigkeit durch und
 * behandelt Umschuldung, Notenbankkäufe und den Repo-Markt.
 *
 * ## Abgrenzung zu „Schuldverschreibung“
 *
 * Dort steht die Mechanik des Instruments: Kupon, Kurs, Duration. Sie wird
 * hier vorausgesetzt. Dieses Thema behandelt den Emittenten Staat und das,
 * was nur bei ihm gilt.
 */
export const staatsanleihe: LearnTopic = {
  slug: 'staatsanleihe',
  title: 'Staatsanleihe',
  headline: 'Der Maßstab, an dem alle anderen Zinsen hängen',
  metaTitle: 'Staatsanleihen erklärt: Renditen, Risiken, Rolle',
  metaDescription:
    'Wie Staatsanleihen funktionieren, warum Renditen zwischen Ländern auseinanderlaufen und welche Rolle sie in einem Portfolio wirklich spielen.',
  lead: 'Staatsanleihen gelten als Maßstab für den risikofreien Zins. Ganz risikofrei sind sie trotzdem nicht – und 2022 hat gezeigt, woran das liegt.',
  overview: [
    'Ein Staat, der mehr ausgibt als er einnimmt, leiht sich Geld über Anleihen. Deren Rendite ist der Referenzpunkt, an dem sich fast alle anderen Zinsen orientieren – vom Baukredit bis zur Aktienbewertung.',
    'Weil Staaten Steuern erheben und in eigener Währung notfalls Geld schöpfen können, gilt ihr Ausfallrisiko als niedrig. Es ist deshalb nicht null: Argentinien, Griechenland und Russland stehen für drei verschiedene Arten, wie es trotzdem schiefgeht.',
    'Die Stufen führen von der Grundfunktion über Zinsstrukturkurve und Spreads bis zur Schuldentragfähigkeit, zu Umschuldungen und zur Rolle der Notenbanken.',
  ],
  keywords: [
    'Staatsanleihe',
    'Bundesanleihe',
    'Rendite',
    'Zinsstrukturkurve',
    'Spread',
    'Schuldentragfähigkeit',
  ],
  related: ['schuldverschreibung', 'fonds', 'wie-funktioniert-der-markt'],
  levels: {
    // ---------------------------------------------------------------- Beginner
    beginner: {
      metaTitle: 'Staatsanleihe einfach erklärt: Funktion und Risiken',
      metaDescription:
        'Warum Staaten Anleihen ausgeben, wie Bundesanleihen funktionieren, was die Rendite aussagt und weshalb sie als sicherer Zinsmaßstab gilt.',
      title: 'Wie Staaten sich Geld leihen',
      lead: 'Warum es diese Papiere gibt, was ihre Rendite mit deinem Sparzins zu tun hat – und was trotzdem schiefgehen kann.',
      readingMinutes: 11,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Ein Staat, der in einem Jahr mehr ausgibt, als er an Steuern einnimmt, hat drei Möglichkeiten: Steuern erhöhen, Ausgaben kürzen oder sich das Geld leihen. Die dritte ist politisch am billigsten und deshalb der Normalfall. Geliehen wird über Anleihen – und die kann jeder kaufen.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die deutschen Papiere und ihre Namen',
        },
        {
          type: 'table',
          caption: 'Bundeswertpapiere nach Laufzeit',
          head: ['Bezeichnung', 'Laufzeit bei Ausgabe', 'Bedeutung'],
          rows: [
            [
              'Bundesanleihe („Bund“)',
              '10 und 30 Jahre',
              'Die zehnjährige ist der wichtigste Zinsmaßstab der Eurozone',
            ],
            ['Bundesobligation („Bobl“)', '5 Jahre', 'Mittleres Laufzeitsegment'],
            [
              'Bundesschatzanweisung („Schatz“)',
              '2 Jahre',
              'Reagiert am stärksten auf Entscheidungen der Notenbank',
            ],
            [
              'Unverzinsliche Schatzanweisung („Bubill“)',
              'Bis 12 Monate',
              'Kein Kupon; der Ertrag steckt im Abschlag beim Kauf',
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'Gekauft werden diese Papiere überwiegend von Banken, Versicherungen, Pensionskassen und Fonds – und in den vergangenen Jahren in erheblichem Umfang von der Europäischen Zentralbank. Privatanleger sind eine kleine Gruppe, können aber über die Börse jederzeit mitmachen.',
        },
        {
          type: 'figure',
          figure: 'staatsanleihe-laufzeiten',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die vier Zahlen, die auf jedem Papier stehen',
        },
        {
          type: 'paragraph',
          text: 'Eine Anleihe sieht kompliziert aus und besteht aus vier Angaben. **Nennwert:** der Betrag, der am Ende zurückgezahlt wird, meist 100 Euro je Stück. **Kupon:** der jährliche Zins, bezogen auf den Nennwert, festgelegt bei der Ausgabe und danach unveränderlich. **Laufzeit:** der Tag der Rückzahlung. **Kurs:** der Preis, zu dem das Papier gerade gehandelt wird – notiert in Prozent des Nennwerts, also „98,40“ statt „98,40 Euro“.',
        },
        {
          type: 'paragraph',
          text: 'Aus Kurs, Kupon und Restlaufzeit ergibt sich die **Rendite** – und nur sie ist vergleichbar. Ein Papier mit drei Prozent Kupon, das bei 90 notiert und in fünf Jahren zu 100 zurückgezahlt wird, bringt mehr als drei Prozent: Zusätzlich zu den Zinsen kommt der Kursgewinn von zehn Punkten bis zur Fälligkeit dazu. Umgekehrt bringt ein Papier über pari weniger als sein Kupon. Wer zwei Anleihen vergleicht, vergleicht deshalb nie die Kupons.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Warum der Kurs fällt, wenn die Zinsen steigen',
          items: [
            'Der Kupon ist festgeschrieben – er kann sich nicht anpassen, wenn neue Papiere mehr bieten.',
            'Anpassen kann sich nur der Preis. Eine alte Anleihe mit einem Prozent Kupon wird neben einer neuen mit drei Prozent nur gekauft, wenn sie billiger wird.',
            'Genau so weit fällt der Kurs, bis die Rendite beider Papiere gleich ist. Das ist kein Marktversagen, sondern schlichte Arithmetik.',
            'Je länger die Restlaufzeit, desto stärker der Ausschlag: Bei einem dreißigjährigen Papier wirkt die Differenz dreißigmal, bei einem zweijährigen zweimal.',
            'Wer bis zur Fälligkeit hält, bekommt trotzdem Kupon und Nennwert wie vereinbart. Der Kursverlust wird nur für den zum Problem, der vorher verkaufen muss.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Der Maßstab für alles andere',
        },
        {
          type: 'paragraph',
          text: 'Die Rendite sicherer Staatsanleihen heißt **risikofreier Zins**, und sie ist der Bezugspunkt für nahezu jeden anderen Zinssatz. Wer risikoreicher verleiht, verlangt einen Aufschlag darauf – der Grundzins selbst wird aber hier gesetzt.',
        },
        {
          type: 'list',
          items: [
            '**Kredite** werden teurer, wenn die Rendite langlaufender Staatsanleihen steigt. Bauzinsen folgen der zehnjährigen Bundesanleihe eng, nicht dem Leitzins.',
            '**Sparzinsen** orientieren sich am kurzen Ende: Tagesgeld folgt dem, was Banken bei der Notenbank oder am Geldmarkt bekommen.',
            '**Aktienbewertungen** hängen daran, weil künftige Gewinne mit diesem Zins abgezinst werden. Steigt er, sinkt der rechnerische Wert weit entfernter Gewinne – das trifft besonders Unternehmen, deren Gewinne erst in der Zukunft erwartet werden.',
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Warum „risikofrei“ eine Vereinfachung ist',
          items: [
            'Gemeint ist ausschließlich: Der Emittent wird mit hoher Wahrscheinlichkeit nominal zurückzahlen.',
            'Nicht gemeint ist, dass der Kurs nicht schwankt. Er schwankt, und zwar erheblich.',
            'Ebenfalls nicht gemeint ist der Erhalt der Kaufkraft. Nominal zurückzuzahlen ist etwas anderes, als real gleich viel zurückzugeben.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was schiefgehen kann',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Kursverlust bei steigenden Zinsen.** Der häufigste Fall und völlig unabhängig von der Bonität. Wer verkaufen muss, bevor das Papier fällig wird, realisiert ihn.',
            '**Inflation.** 1.000 Euro in zehn Jahren sind 1.000 Euro – was man dafür bekommt, ist eine andere Frage. Bei zwei Prozent Inflation über zehn Jahre bleiben davon rund 820 Euro heutiger Kaufkraft.',
            '**Zahlungsausfall.** Selten, aber real. Griechenland hat 2012 umgeschuldet, Argentinien mehrfach, Russland 1998. Kein Staat ist eine Naturkonstante.',
            '**Wechselkurs.** Eine Anleihe in Fremdwährung bringt ein zweites Risiko mit, das mit dem Emittenten nichts zu tun hat und größer sein kann als der gesamte Zinsvorteil.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Einzelne Anleihe oder Fonds?',
        },
        {
          type: 'paragraph',
          text: 'Für Privatanleger ist das die einzige Entscheidung, die wirklich ansteht – und sie hat eine klare Trennlinie. Eine **einzelne Anleihe** hat einen Rückzahlungstermin. Wer sie bis dahin hält, kennt seinen Ertrag am Kauftag auf den Euro genau, ganz gleich, was der Kurs dazwischen macht. Das macht sie zum passenden Werkzeug für Geld mit Termin: Studienbeginn in fünf Jahren, Autokauf in drei.',
        },
        {
          type: 'paragraph',
          text: 'Ein **Anleihe-ETF** hat diesen Termin nicht. Er hält hunderte Papiere und ersetzt jedes, das zu kurz wird, durch ein längeres – die Restlaufzeit bleibt damit ungefähr konstant, es gibt aber keinen Tag, an dem du dein Geld zum Nennwert zurückbekommst. Dafür ist die Streuung geschenkt, schon kleine Beträge reichen, und du musst nichts wiederanlegen. Der Preis ist, dass ein Kursrückgang bei steigenden Zinsen nicht sicher „ausläuft“, sondern nur durch die höheren Zinsen der neu gekauften Papiere aufgeholt wird.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Zwei Fallen beim Kauf einzelner Anleihen',
          items: [
            '**Stückzinsen.** Kaufst du mitten im Jahr, zahlst du dem Verkäufer die bis dahin aufgelaufenen Zinsen zusätzlich zum Kurs. Das ist korrekt und kein Aufschlag – der volle Kupon kommt später an dich –, überrascht aber jeden beim ersten Mal.',
            '**Mindeststückelung.** Viele Unternehmens- und manche Staatsanleihen werden erst ab 50.000 oder 100.000 Euro gehandelt. Der Kurs sieht dann nach 98 Euro aus und die kleinste Order kostet fünfstellig.',
            'Dazu kommt die Handelsspanne: Bei selten gehandelten Papieren liegen An- und Verkaufskurs weit auseinander, und diese Differenz zahlt man sofort.',
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
            'Bund, Bobl und Schatz unterscheiden sich nur in der Laufzeit.',
            'Vergleichbar ist die Rendite, nicht der Kupon – der Kurs entscheidet mit.',
            'Steigende Zinsen drücken den Kurs, und zwar umso stärker, je länger die Restlaufzeit.',
            'Wer bis zur Fälligkeit hält, bekommt Kupon und Nennwert unabhängig vom Kurs dazwischen.',
            'Die Rendite sicherer Staatsanleihen ist der Bezugspunkt für Kredite, Sparzinsen und Aktienbewertungen.',
            '„Risikofrei“ meint die Rückzahlung, nicht den Kurs und nicht die Kaufkraft.',
            'Einzelne Anleihe für Geld mit Termin, Anleihe-ETF für dauerhafte Beimischung.',
            'Fremdwährungsanleihen tragen ein zweites Risiko, das den Zinsvorteil übersteigen kann.',
          ],
        },
      ],
    },

    // -------------------------------------------------------- Fortgeschritten
    fortgeschritten: {
      metaTitle: 'Staatsanleihen: Zinsstruktur, Spreads, Portfoliorolle',
      metaDescription:
        'Was die Zinskurve verrät, warum Länderrenditen auseinanderlaufen und warum Anleihen 2022 nicht als Puffer funktioniert haben.',
      title: 'Zinsstruktur, Spreads und die Rolle im Depot',
      lead: 'Was die Kurve über die Erwartungen des Marktes sagt, wie Renditeabstände entstehen – und warum 2022 anders lief als geplant.',
      readingMinutes: 12,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Die Zinsstrukturkurve',
        },
        {
          type: 'paragraph',
          text: 'Trägt man die Renditen desselben Emittenten über alle Laufzeiten auf, entsteht die **Zinsstrukturkurve**. Ihre Form ist eine der meistbeachteten Größen an den Finanzmärkten, weil sie zusammenfasst, was der Markt über die kommenden Jahre denkt.',
        },
        {
          type: 'table',
          caption: 'Drei Formen und ihre übliche Deutung',
          head: ['Form', 'Verlauf', 'Was daraus gelesen wird'],
          rows: [
            [
              'Normal',
              'Lange Laufzeiten rentieren höher als kurze',
              'Der Regelfall: Für längeres Binden wird eine Prämie verlangt',
            ],
            [
              'Flach',
              'Kurz und lang liegen nahe beieinander',
              'Übergangsphase – der Markt erwartet keine klare Richtung mehr',
            ],
            [
              'Invers',
              'Kurze Laufzeiten rentieren höher als lange',
              'Der Markt erwartet fallende Zinsen, meist wegen einer erwarteten Abkühlung',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Zur inversen Kurve als Rezessionssignal',
          items: [
            'In den USA ging fast jeder Rezession seit den 1950er-Jahren eine inverse Kurve voraus. Das ist eine bemerkenswerte Trefferquote und der Grund für die Aufmerksamkeit.',
            'Sie sagt aber nichts über den Zeitpunkt: Zwischen Inversion und Rezession lagen historisch sechs Monate bis über zwei Jahre.',
            'Und sie war nicht immer richtig. Eine Inversion ohne folgende Rezession ist vorgekommen – als Handelssignal taugt das Muster deshalb nicht.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Warum die Kurve überhaupt steigt, erklären drei Theorien nebeneinander. Die **Erwartungstheorie** sagt: Lange Zinsen sind der Durchschnitt der erwarteten kurzen. Die **Liquiditätsprämientheorie** ergänzt einen Aufschlag dafür, dass man sich länger bindet. Die **Marktsegmentierungstheorie** verweist darauf, dass Versicherer und Pensionskassen aus regulatorischen Gründen lange Laufzeiten kaufen müssen – unabhängig von jeder Erwartung. In der Praxis wirken alle drei.',
        },
        {
          type: 'paragraph',
          text: 'Aus der Differenz zwischen nominaler und inflationsindexierter Kurve lässt sich außerdem die **Breakeven-Inflationsrate** ablesen: die Preissteigerung, bei der beide Papiere dasselbe Ergebnis brächten. Sie ist die am Markt gehandelte Inflationserwartung – nicht die Prognose einer Behörde, sondern das, wofür Anleger tatsächlich Geld einsetzen.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Spreads zwischen Ländern',
        },
        {
          type: 'paragraph',
          text: 'Innerhalb der Eurozone haben alle Staaten dieselbe Währung – und trotzdem verschiedene Renditen. Der Abstand zur deutschen Bundesanleihe gleicher Laufzeit ist das übliche Maß dafür und wird täglich beobachtet.',
        },
        {
          type: 'list',
          items: [
            '**Bonität.** Schuldenstand, Haushaltslage und Wachstumsaussichten. Der offensichtlichste Treiber, aber nicht immer der stärkste.',
            '**Liquidität.** Der deutsche Markt ist der tiefste der Eurozone. Ein Teil des Abstands ist schlicht der Preis dafür, dass man kleinere Märkte schlechter verlassen kann.',
            '**Politische Unsicherheit.** Spreads reagieren auf Wahlen und Haushaltsentwürfe oft stärker als auf die Schuldenquote selbst – die ändert sich langsam, die politische Lage nicht.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Dahinter steht eine strukturelle Spannung: Die Eurozone hat eine gemeinsame Geldpolitik, aber neunzehn getrennte Haushalte. Ein einzelner Staat kann seine Schulden nicht durch eigene Geldschöpfung bedienen – er ist in einer Währung verschuldet, die er nicht selbst herstellt. Genau darin liegt der Unterschied zwischen der Eurokrise ab 2010 und der Lage Japans, das bei einer weit höheren Schuldenquote nie in eine vergleichbare Zwangslage geriet.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Die Zahlen dazu auf dieser Seite',
          items: [
            `Der Vergleich unter /staatsverschuldung führt die Schuldenquoten aller größeren Industrieländer für ${DEBT_QUOTE_YEAR}.`,
            'Er zeigt auch, wie wenig die Quote allein aussagt: Japan liegt weit vor jedem europäischen Land und zahlt trotzdem die niedrigsten Zinsen.',
            'Warum das so ist, rechnet die Profi-Stufe durch.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Emission und Handel',
        },
        {
          type: 'paragraph',
          text: 'Neue Papiere kommen über **Auktionen** an den Markt: Der Bund gibt Termin und Volumen bekannt, zugelassene Banken geben Gebote ab. Das ist der **Primärmarkt**. Danach werden die Papiere an der Börse weitergehandelt – der **Sekundärmarkt**, an dem auch Privatanleger teilnehmen. Die Kurse dort bestimmen, was der Staat bei der nächsten Auktion zahlen muss.',
        },
        {
          type: 'table',
          caption: 'Drei Wege in Staatsanleihen',
          head: ['Weg', 'Vorteil', 'Nachteil'],
          rows: [
            [
              'Einzelne Anleihen',
              'Fester Endtermin: Wer hält, bekommt den Nennwert',
              'Aufwand, größere Stückelungen, wenig Streuung',
            ],
            [
              'Anleihe-ETF',
              'Streuung über viele Papiere, jederzeit handelbar',
              'Kein Endtermin – ein Kursverlust löst sich nicht von selbst auf',
            ],
            [
              'Laufzeitleiter',
              'Gestaffelte Fälligkeiten; jedes Jahr wird ein Teil frei und neu angelegt',
              'Erfordert regelmäßige Wiederanlage von Hand',
            ],
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Warum 2022 nicht funktioniert hat, was funktionieren sollte',
        },
        {
          type: 'paragraph',
          text: `Die klassische Aufteilung setzt darauf, dass Anleihen steigen, wenn Aktien fallen. 2022 fielen beide gleichzeitig – für viele Depots das schlechteste Jahr seit Jahrzehnten. Der Grund lässt sich ausrechnen. Eine zwanzigjährige Anleihe mit ${formatPercent(LANGE_ANLEIHE.kuponProzent, 0)} Kupon, gekauft bei einem Marktzins von ${formatPercent(ZINS_2021, 0)}, steht bei 100. Dann steigt der Zins:`,
        },
        {
          type: 'table',
          caption: `Kurs einer zwanzigjährigen Anleihe mit ${formatPercent(LANGE_ANLEIHE.kuponProzent, 0)} Kupon bei steigendem Marktzins`,
          head: ['Zinsanstieg', 'Neuer Kurs', 'Kursverlust'],
          rows: schockreihe.map((zeile) => [
            `+ ${formatPercent(zeile.punkte, 0)}`,
            formatNumber(zeile.nachher, 2),
            formatPercent(zeile.tatsaechlichProzent, 1),
          ]),
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Was daraus folgt',
          items: [
            'Der Puffer funktioniert, wenn Aktien wegen einer Konjunkturschwäche fallen – dann senken Notenbanken die Zinsen und Anleihen steigen.',
            'Er funktioniert nicht, wenn beide aus demselben Grund fallen: hohe Inflation, steigende Zinsen. Genau das war 2022 der Fall.',
            'Die praktische Konsequenz ist nicht, Anleihen wegzulassen, sondern die Laufzeit bewusst zu wählen. Kurze Laufzeiten puffern schwächer, verlieren dafür bei Zinsanstiegen kaum.',
          ],
        },
        {
          type: 'figure',
          figure: 'staatsanleihe-zinsschock',
          caption:
            'Derselbe Zinsanstieg, vier Restlaufzeiten. Die Wahl der Laufzeit entscheidet über den Verlust – nicht die Bonität des Staates.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was du dir merken solltest',
        },
        {
          type: 'list',
          items: [
            'Die inverse Kurve hat eine gute Trefferquote als Rezessionssignal und sagt nichts über den Zeitpunkt.',
            'Spreads in der Eurozone entstehen aus Bonität, Liquidität und politischer Unsicherheit – nicht nur aus der Schuldenquote.',
            'Wer den Euro nicht selbst herstellt, ist in fremder Währung verschuldet; das ist der Kern der Eurokrise.',
            'Der Anleihepuffer wirkt gegen Konjunkturschwäche, nicht gegen Inflation – 2022 fielen deshalb beide Seiten.',
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ Profi
    profi: {
      metaTitle: 'Staatsanleihen: Schuldentragfähigkeit und Umschuldung',
      metaDescription:
        'Zins-Wachstums-Differenz und Primärsaldo, Ablauf einer Umschuldung, Notenbankkäufe und die Rolle von Staatsanleihen im Repo-Markt.',
      title: 'Tragfähigkeit, Ausfall und Notenbanken',
      lead: 'Wann eine Schuldenquote stabil bleibt, was bei einer Umschuldung tatsächlich passiert – und warum diese Papiere das Rückgrat des Finanzsystems sind.',
      readingMinutes: 14,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Die Frage ist nicht die Höhe, sondern die Richtung',
        },
        {
          type: 'paragraph',
          text: 'Ob eine Schuldenquote tragfähig ist, lässt sich an ihrer Höhe nicht ablesen. Japan liegt weit über jedem europäischen Land und zahlt die niedrigsten Zinsen der Industrieländer; Argentinien geriet mehrfach mit einem Bruchteil davon in Zahlungsschwierigkeiten. Entscheidend ist die Dynamik – und die hängt an einer einzigen Differenz.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Die Zins-Wachstums-Differenz',
          items: [
            'Liegt der durchschnittliche Zins **unter** dem nominalen Wachstum, sinkt die Schuldenquote von allein – selbst bei einem ausgeglichenen Primärsaldo. Die Wirtschaft wächst schneller als der Schuldenberg.',
            'Liegt er **darüber**, wächst die Quote von allein. Um sie zu halten, braucht es einen Primärüberschuss – Einnahmen über den Ausgaben, Zinszahlungen dabei noch nicht gerechnet.',
            'Der **Primärsaldo** ist deshalb die politisch entscheidende Größe: Er ist der Teil, den eine Regierung steuern kann. Zins und Wachstum kann sie es nicht.',
          ],
        },
        {
          type: 'paragraph',
          text: `Wie viel Überschuss nötig wäre, hängt an der Schuldenquote selbst – je höher sie ist, desto stärker wirkt jede Differenz. Gerechnet mit den Quoten von ${DEBT_QUOTE_YEAR} und einem angenommenen nominalen Wachstum von ${formatPercent(NOMINALES_WACHSTUM, 0)}:`,
        },
        {
          type: 'table',
          caption:
            'Nötiger Primärsaldo in Prozent des BIP, um die Schuldenquote zu halten',
          head: [
            'Land',
            'Schuldenquote',
            ...DIFFERENZEN.map(
              (differenz) =>
                `Zins ${differenz >= 0 ? '+' : '−'} ${formatPercent(Math.abs(differenz), 0)}`
            ),
          ],
          rows: laender.map((land) => [
            land.name,
            formatPercent(land.debtToGdpPercent, 0),
            ...DIFFERENZEN.map((differenz) =>
              formatPercent(noetigerPrimaersaldo(land.debtToGdpPercent, differenz), 1)
            ),
          ]),
        },
        {
          type: 'paragraph',
          text: 'Zwei Dinge fallen auf. Erstens: Bei einem Zins unter dem Wachstum sind alle Werte negativ – ein Defizit ist dann mit einer stabilen Quote vereinbar. Genau diese Konstellation herrschte in Europa über weite Teile der 2010er-Jahre und erklärt, warum die Schuldenquoten trotz laufender Defizite nicht explodierten. Zweitens: Für Japan bedeutet dieselbe Differenz das Vierfache dessen, was sie für Deutschland bedeutet. Eine hohe Quote ist kein Problem, solange die Differenz günstig bleibt – und ein sehr großes, sobald sie kippt.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Was die Rechnung nicht enthält',
          items: [
            'Sie unterstellt einen einheitlichen Zins. Tatsächlich zahlt ein Staat auf seinen Altbestand die alten Kupons; ein Zinsanstieg wirkt nur auf den Teil, der neu aufgenommen wird.',
            'Deshalb ist die **durchschnittliche Restlaufzeit** der wichtigste Puffer. Wer über zehn Jahre finanziert ist, spürt einen Zinsanstieg erst über Jahre – wer kurzfristig finanziert ist, sofort.',
            'Und sie unterschlägt die **Währungsfrage**: Wer sich in eigener Währung verschuldet, kann nominal immer zahlen. Wer es in fremder tut, kann es nicht – das unterscheidet Argentinien von Japan mehr als jede Kennzahl.',
          ],
        },
        {
          type: 'figure',
          figure: 'staatsschuld-dynamik',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wenn es doch schiefgeht',
        },
        {
          type: 'paragraph',
          text: 'Ein Staat kann nicht liquidiert werden. Es gibt kein Insolvenzverfahren, keine Masse und kein Gericht mit Durchgriff. Was es gibt, ist eine Verhandlung – und drei Stellschrauben, die dabei einzeln oder gemeinsam bewegt werden.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Nennwertschnitt (Haircut).** Der Rückzahlungsbetrag wird gekürzt. Der sichtbarste und schmerzhafteste Eingriff.',
            '**Laufzeitverlängerung.** Der Nennwert bleibt, die Rückzahlung rückt nach hinten. Wirtschaftlich ist auch das ein Verlust, weil der Barwert sinkt – er sieht nur harmloser aus.',
            '**Kuponsenkung.** Die laufenden Zinsen werden gekürzt. Oft mit den beiden anderen kombiniert.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Damit eine Umschuldung überhaupt gelingt, enthalten heutige Anleihebedingungen **Collective Action Clauses**: Stimmt eine qualifizierte Mehrheit der Gläubiger zu, gilt die Vereinbarung für alle. Ohne sie können einzelne **Holdouts** die Einigung blockieren und auf voller Zahlung bestehen – der argentinische Streit mit einzelnen Fonds zog sich über mehr als ein Jahrzehnt durch US-Gerichte. Der griechische Schuldenschnitt 2012 wurde erst möglich, nachdem entsprechende Klauseln nachträglich eingeführt worden waren.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Zu Kreditausfallversicherungen (CDS)',
          items: [
            'Ein CDS ist eine Versicherung gegen den Ausfall eines Emittenten; sein Preis gilt als Marktschätzung der Ausfallwahrscheinlichkeit.',
            'Die Grenze liegt in der Definition: Ob ein Ereignis als Ausfall zählt, entscheidet ein Gremium anhand des Vertragstexts. Bei Griechenland 2012 war lange strittig, ob der „freiwillige“ Umtausch die Versicherung überhaupt auslöst.',
            'Dazu ist der Markt dünn. Ein CDS-Preis kann Panik anzeigen, wo nur wenige Kontrakte gehandelt wurden.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Notenbanken als Käufer',
        },
        {
          type: 'paragraph',
          text: 'Seit 2015 hat die Europäische Zentralbank Staatsanleihen in großem Umfang gekauft, die US-Notenbank seit 2008. Der Zweck war, die langen Zinsen zu senken, nachdem die kurzen bei null angekommen waren. Die Wirkung auf die Renditen war erheblich – und sie hat eine Nebenwirkung, die erst beim Ausstieg sichtbar wird.',
        },
        {
          type: 'list',
          items: [
            '**Beim Kauf** verschwindet ein großer Teil des Umlaufs aus dem Markt. Die Kurse steigen, die Renditen fallen, und die Preisbildung wird dünner: Wer den Markt beobachtet, beobachtet zu einem Teil die Notenbank.',
            '**Beim Abbau** stellt sich die Frage, wer nachrückt. Fällige Papiere werden nicht ersetzt, das Angebot für private Käufer steigt – und diese verlangen einen Preis, den die Notenbank nicht verlangt hat.',
            '**Für einzelne Staaten** wirkt das unterschiedlich stark. Wo die Notenbank einen großen Anteil hielt, ist der Effekt des Ausstiegs größer.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Das Rückgrat des Finanzsystems',
        },
        {
          type: 'paragraph',
          text: 'Der am wenigsten beachtete Punkt ist der wichtigste für die Stabilität. Im **Repo-Markt** leihen sich Banken kurzfristig Geld und hinterlegen dafür Sicherheiten – ganz überwiegend Staatsanleihen. Dieser Markt ist der Ort, an dem sich das Finanzsystem täglich refinanziert.',
        },
        {
          type: 'paragraph',
          text: 'Daraus folgt eine Verkettung, die in Krisen entscheidend wird: Verliert eine Staatsanleihe an Wert, sinkt der Beleihungswert der Sicherheiten. Banken müssen nachschießen oder Positionen auflösen. Das erklärt, warum Zweifel an einem Staat sich innerhalb von Tagen zu einer Bankenkrise auswachsen können – und warum Aufsichtsbehörden Staatsanleihen trotz allem regulatorisch bevorzugt behandeln. Die Alternative wäre, das Fundament des Systems selbst infrage zu stellen.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was du dir merken solltest',
        },
        {
          type: 'list',
          items: [
            'Tragfähig ist eine Schuldenquote, wenn der Zins unter dem nominalen Wachstum liegt – die Höhe allein sagt nichts.',
            'Die durchschnittliche Restlaufzeit entscheidet, wie schnell ein Zinsanstieg durchschlägt.',
            'Eine Laufzeitverlängerung ist wirtschaftlich ebenso ein Verlust wie ein Nennwertschnitt – sie sieht nur harmloser aus.',
            'Staatsanleihen sind die Sicherheiten des Repo-Markts; deshalb wird aus Zweifeln am Staat schnell eine Bankenkrise.',
          ],
        },
      ],
    },
  },
}
