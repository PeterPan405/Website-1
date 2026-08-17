/**
 * Begriffe, die im Alltag durcheinandergehen – zwei Spalten nebeneinander.
 *
 * ## Warum das eine eigene Seite verdient
 *
 * Das Glossar erklärt Begriffe **einzeln**, und das ist genau die Form, in der
 * eine Verwechslung überlebt. Wer „Volatilität" nachschlägt, liest eine
 * richtige Erklärung und geht mit demselben Missverständnis weiter, weil er
 * gar nicht wusste, dass er zwei Dinge verwechselt. Man sucht nicht nach einem
 * Unterschied, den man nicht vermutet.
 *
 * Nebeneinander gestellt zeigt sich der Unterschied, ohne dass man nach ihm
 * gesucht hat. Deshalb liegen die Zeilen **parallel**: dieselbe Frage links
 * und rechts, so dass man quer liest statt zweimal längs.
 *
 * ## Was ein Paar hier braucht
 *
 * Einen **Merksatz** – die eine Zeile, an der man die beiden im Alltag
 * auseinanderhält. Eine Gegenüberstellung ohne ihn ist eine Tabelle, die man
 * beim nächsten Mal wieder nachschlagen muss.
 *
 * Und ein **„warum es zählt"**: was die Verwechslung kostet. Ohne das ist es
 * Begriffskunde. Bei Performance- gegen Kursindex sind es über zehn Jahre
 * mehrere zehn Prozentpunkte in einem Vergleich, den jemand für sauber hielt.
 */

/** Eine Zeile der Gegenüberstellung – dieselbe Frage an beide Begriffe. */
export interface Vergleichszeile {
  /** Die Frage, die beide Spalten beantworten. */
  was: string
  links: string
  rechts: string
}

export interface Verwechslungspaar {
  slug: string
  linksName: string
  rechtsName: string
  /** Warum die beiden überhaupt verwechselt werden. */
  frage: string
  zeilen: Vergleichszeile[]
  /** Die eine Zeile, an der man sie im Alltag unterscheidet. */
  merksatz: string
  /** Was die Verwechslung kostet. */
  warumEsZaehlt: string
  /** Wo der Unterschied auf dieser Website sichtbar wird. */
  zuSehen?: { text: string; href: string }
  /** Glossareinträge zu beiden Seiten, als Slugs. */
  glossar?: { links?: string; rechts?: string }
}

export const VERWECHSLUNGEN: Verwechslungspaar[] = [
  {
    slug: 'etf-fonds',
    linksName: 'ETF',
    rechtsName: 'Aktiv gemanagter Fonds',
    frage:
      '„ETF oder Fonds?" ist die Frage, die man überall hört – und sie ist falsch gestellt. Ein ETF **ist** ein Fonds. Gegenüber stehen sich nicht ETF und Fonds, sondern zwei Eigenschaften: wie er verwaltet und wie er gehandelt wird.',
    zeilen: [
      {
        was: 'Was ist es?',
        links:
          'Ein Investmentfonds – ein Topf, in dem viele Anleger gemeinsam investieren.',
        rechts:
          'Ebenfalls ein Investmentfonds. Derselbe rechtliche Rahmen, dasselbe Sondervermögen.',
      },
      {
        was: 'Wer entscheidet, was gekauft wird?',
        links: 'Niemand: Der Fonds bildet einen Index nach, Regel für Regel.',
        rechts: 'Ein Fondsmanager mit einem Team – er wählt aus und schichtet um.',
      },
      {
        was: 'Wo kauft man ihn?',
        links: 'An der Börse, zu laufenden Kursen, wie eine Aktie.',
        rechts: 'Meist direkt bei der Gesellschaft, einmal täglich zum Anteilspreis.',
      },
      {
        was: 'Was kostet er im Jahr?',
        links: 'Häufig 0,05 bis 0,5 Prozent.',
        rechts: 'Häufig 1,2 bis 2 Prozent, teils zusätzlich ein Ausgabeaufschlag.',
      },
      {
        was: 'Womit wirbt er?',
        links: 'Den Markt abzubilden – nicht mehr und nicht weniger.',
        rechts: 'Den Markt zu schlagen.',
      },
    ],
    merksatz:
      'Ein ETF ist ein Fonds. Die Frage lautet nicht „ETF oder Fonds", sondern „passiv oder aktiv verwaltet" – und getrennt davon „an der Börse oder bei der Gesellschaft gehandelt".',
    warumEsZaehlt:
      'Wer glaubt, ETFs und Fonds seien zwei Produktwelten, vergleicht Äpfel mit Äpfeln und hält es für Äpfel mit Birnen. Es gibt auch aktiv gemanagte ETFs und passive Indexfonds ohne Börsenhandel – beide fallen durch das falsche Raster.',
    zuSehen: { text: 'Lernthema ETF', href: '/lernen/etf/beginner' },
    glossar: { links: 'etf', rechts: 'fonds' },
  },
  {
    slug: 'zins-rendite',
    linksName: 'Zins',
    rechtsName: 'Rendite',
    frage:
      'Beides sind Prozentzahlen, beide stehen für „was bringt das Geld". Der Unterschied ist, ob jemand die Zahl **zugesagt** hat oder ob sie **herausgekommen** ist.',
    zeilen: [
      {
        was: 'Woher kommt die Zahl?',
        links: 'Aus einem Vertrag. Sie ist vorher vereinbart.',
        rechts: 'Aus einer Rechnung im Nachhinein: Ergebnis geteilt durch Einsatz.',
      },
      {
        was: 'Steht sie vorher fest?',
        links:
          'Ja – beim Festgeld für die ganze Laufzeit, beim Tagesgeld bis zur nächsten Änderung.',
        rechts:
          'Nein. Eine Rendite lässt sich nur schätzen, und die Schätzung ist eine Annahme.',
      },
      {
        was: 'Was ist alles enthalten?',
        links: 'Nur die Verzinsung selbst.',
        rechts: 'Alles: Kursveränderung, Ausschüttungen, Kosten, gegebenenfalls Steuern.',
      },
      {
        was: 'Typisches Beispiel',
        links: '2,4 Prozent Tagesgeldzins.',
        rechts: '7,1 Prozent Rendite eines Aktienfonds im vergangenen Jahr.',
      },
    ],
    merksatz:
      'Ein Zins ist ein Versprechen, eine Rendite ist ein Ergebnis. Wer eine Rendite in der Zukunftsform hört, hört eine Annahme – auch wenn sie klingt wie ein Zins.',
    warumEsZaehlt:
      'Werbung nutzt genau diese Unschärfe: „Bis zu 6 Prozent" klingt wie ein Zins und ist eine Renditehoffnung. Wer den Unterschied kennt, stellt die Rückfrage, die ihn beantwortet – zugesagt oder erhofft?',
    zuSehen: { text: 'Zinsrechner', href: '/rechner/zinsrechner' },
    glossar: { rechts: 'rendite' },
  },
  {
    slug: 'gewinn-cashflow',
    linksName: 'Gewinn',
    rechtsName: 'Cashflow',
    frage:
      'Beide stehen im Geschäftsbericht, beide in Euro, beide sollen sagen, wie gut es läuft. Nur misst der eine eine Rechnung und der andere eine Kontobewegung.',
    zeilen: [
      {
        was: 'Was wird gemessen?',
        links: 'Ertrag minus Aufwand nach den Regeln der Rechnungslegung.',
        rechts: 'Was tatsächlich an Geld hereinkam und hinausging.',
      },
      {
        was: 'Wie viel Spielraum hat das Unternehmen?',
        links: 'Erheblichen: Abschreibungsdauern, Rückstellungen, Bewertungswahlrechte.',
        rechts: 'Wenig. Geld ist auf dem Konto oder nicht.',
      },
      {
        was: 'Was fehlt darin?',
        links: 'Nichts – aber vieles davon ist noch kein Geld, etwa offene Rechnungen.',
        rechts:
          'Die Abnutzung: Eine Maschine, die in zehn Jahren ersetzt werden muss, taucht heute nicht auf.',
      },
      {
        was: 'Wann laufen sie auseinander?',
        links: 'Bei hohem Gewinn und leerer Kasse: Umsatz gebucht, Rechnung unbezahlt.',
        rechts:
          'Bei negativem Gewinn und positivem Cashflow: hohe Abschreibungen, laufende Einnahmen.',
      },
    ],
    merksatz:
      '„Gewinn ist eine Meinung, Cashflow ist eine Tatsache." Wer beide über mehrere Jahre nebeneinanderlegt und ein dauerhaftes Auseinanderlaufen sieht, hat die interessanteste Frage an ein Unternehmen gefunden.',
    warumEsZaehlt:
      'Fast jeder große Bilanzskandal war zuerst im Cashflow zu sehen: Der Gewinn stieg, das Geld kam nicht. Umgekehrt sind Unternehmen mit hohen Abschreibungen oft rentabler, als ihr Gewinn aussehen lässt.',
    glossar: { rechts: 'cashflow' },
  },
  {
    slug: 'performanceindex-kursindex',
    linksName: 'Performanceindex',
    rechtsName: 'Kursindex',
    frage:
      'Zwei Indizes auf dieselben Aktien, zwei ganz verschiedene Zahlen. Der Unterschied ist eine einzige Annahme: was mit den Dividenden passiert.',
    zeilen: [
      {
        was: 'Was passiert mit den Dividenden?',
        links: 'Sie werden rechnerisch wieder angelegt.',
        rechts: 'Sie fallen aus dem Index heraus.',
      },
      {
        was: 'Was zeigt der Stand?',
        links: 'Die Gesamtrendite eines Anlegers, der alles reinvestiert.',
        rechts: 'Nur die Kursentwicklung der enthaltenen Aktien.',
      },
      {
        was: 'Bekannte Beispiele',
        links: 'Der DAX, wie er in den Nachrichten genannt wird.',
        rechts:
          'Der EURO STOXX 50, der S&P 500 in seiner üblichen Form, der DAX-Kursindex.',
      },
      {
        was: 'Wie groß ist der Unterschied?',
        links:
          'Über zehn Jahre bei drei Prozent Dividendenrendite rund ein Drittel mehr.',
        rechts: 'Entsprechend weniger – bei gleicher Kursentwicklung.',
      },
    ],
    merksatz:
      'Steht der DAX gegen den EURO STOXX 50, vergleicht man einen Performanceindex mit einem Kursindex – und der DAX gewinnt allein durch die Rechenregel. Vor jedem Indexvergleich gehört die Frage: Sind beide von derselben Sorte?',
    warumEsZaehlt:
      'Das ist der häufigste stille Fehler in Anlagevergleichen. Ein Fonds, der „den Index schlägt", schlägt manchmal nur einen Kursindex, während er selbst Dividenden vereinnahmt. Über zehn Jahre sind das mehrere zehn Prozentpunkte.',
    zuSehen: { text: 'Indizes im Überblick', href: '/maerkte' },
    glossar: { rechts: 'index' },
  },
  {
    slug: 'volatilitaet-risiko',
    linksName: 'Volatilität',
    rechtsName: 'Risiko',
    frage:
      'In der Finanzbranche werden die beiden Wörter fast synonym benutzt. Das eine ist eine Messgröße, das andere die Frage, ob man am Ende weniger hat.',
    zeilen: [
      {
        was: 'Was ist es?',
        links: 'Ein Maß dafür, wie stark ein Kurs um seinen Mittelwert schwankt.',
        rechts: 'Die Gefahr, das Geld dauerhaft nicht wiederzusehen.',
      },
      {
        was: 'Lässt es sich messen?',
        links: 'Ja, aus vergangenen Kursen – eine Zahl, exakt gerechnet.',
        rechts: 'Nur teilweise. Die wichtigsten Risiken haben keine Zeitreihe.',
      },
      {
        was: 'Wie wird eine Aufwärtsbewegung gewertet?',
        links:
          'Als Schwankung – ein steiler Anstieg erhöht die Volatilität genauso wie ein Absturz.',
        rechts: 'Gar nicht. Wer Gewinne macht, hat kein Problem.',
      },
      {
        was: 'Was bleibt außen vor?',
        links: 'Die Insolvenz: Eine Anleihe kann bis zum Ausfall ruhig notieren.',
        rechts: 'Nichts – aber vieles davon steht in keiner Kennzahl.',
      },
    ],
    merksatz:
      'Volatilität ist, wie unruhig die Fahrt war. Risiko ist, ob man ankommt. Ein Sparbuch hat null Volatilität und ein sicheres Risiko: die Inflation.',
    warumEsZaehlt:
      'Wer Risiko mit Volatilität gleichsetzt, hält schwankungsarme Anlagen für sicher – und übersieht die zwei Gefahren, die dort am größten sind: schleichender Kaufkraftverlust und der Ausfall des Schuldners.',
    zuSehen: { text: 'Risiko und Rendite', href: '/lernen/risiko-und-rendite/beginner' },
    glossar: { links: 'volatilitaet' },
  },
  {
    slug: 'nominal-real',
    linksName: 'Nominal',
    rechtsName: 'Real',
    frage:
      'Zwei Wörter, die in fast jeder Finanzzahl mitschwingen und fast nie dabeistehen. Der Unterschied ist, ob die Inflation schon herausgerechnet ist.',
    zeilen: [
      {
        was: 'Was zeigt die Zahl?',
        links: 'Den Betrag, wie er auf dem Konto steht.',
        rechts: 'Was man sich dafür kaufen kann.',
      },
      {
        was: 'Ist die Inflation berücksichtigt?',
        links: 'Nein – die Teuerung steckt noch unbereinigt darin.',
        rechts: 'Ja – die Zahl ist um die Teuerung bereinigt.',
      },
      {
        was: 'Wie rechnet man um?',
        links: 'Aus real wird nominal, indem man die Teuerung wieder aufschlägt.',
        rechts:
          '(1 + nominal) ÷ (1 + Inflation) − 1 – der Quotient, nicht die Differenz.',
      },
      {
        was: 'Beispiel: 3 Prozent Zins bei 4 Prozent Inflation',
        links: '+3,0 Prozent – sieht nach Gewinn aus.',
        rechts: '−0,96 Prozent – ein Verlust an Kaufkraft.',
      },
    ],
    merksatz:
      'Steht keine Angabe dabei, ist eine Zahl fast immer nominal. Die Frage „ist das vor oder nach Inflation?" beantwortet die halbe Finanzwelt neu – besonders bei allem, was über zehn Jahre hinausgeht.',
    warumEsZaehlt:
      'Über dreißig Jahre halbiert eine Inflation von 2,3 Prozent die Kaufkraft. Eine Rentenlücke, ein Entnahmeplan, ein Sparziel: nominal gerechnet sehen sie alle gut aus und sind es nicht.',
    zuSehen: { text: 'Kaufkraft und Wechselkurs', href: '/rechner/kaufkraft' },
    glossar: { rechts: 'realzins' },
  },
]
