/**
 * Der Zweig „Portfoliotheorie“ der Akademie.
 *
 * ## Warum dieser Zweig anders gebaut ist als die beiden ersten
 *
 * Technische und fundamentale Analyse fragen, was man kaufen soll. Dieser
 * Zweig setzt die Frage voraus und behandelt die daneben: Wie viel von jedem,
 * und was macht das zusammen? Das ist der Teil, an dem sich empirisch am
 * meisten entscheidet – und der Teil, den die meisten überspringen.
 *
 * ## Zur Beleglage
 *
 * Hier steht mehr Mathematik als in den anderen Zweigen, und die Rechenwege
 * sind unstrittig: Eine Standardabweichung ist eine Standardabweichung. Was
 * strittig ist, sind die Annahmen darunter – dass Renditen normalverteilt
 * sind, dass Korrelationen stabil bleiben, dass Schwankung dasselbe ist wie
 * Risiko. Jede dieser Annahmen ist in einer Krise schon gebrochen.
 *
 * Die Lektionen trennen das deshalb streng: Der Rechenweg trägt die
 * Einstufung „Rechenweg“, die Annahme darüber die Einstufung „Auslegung“.
 */

import type { Bereich, Lektion } from '@/data/akademie/types'

export const portfoliotheorie: Bereich = {
  id: 'portfoliotheorie',
  titel: 'Portfoliotheorie',
  sinnbild: 'layers',
  kurz: 'Wie aus einzelnen Anlagen ein Depot wird – Streuung, Risikomaße und die Annahmen, auf denen sie ruhen.',
  einleitung:
    'Nicht die Auswahl der einzelnen Papiere entscheidet über das Ergebnis, sondern ihre Zusammensetzung. Diese Lektionen erklären, wie Rendite und Risiko gemessen werden, warum Streuung mathematisch wirkt und nicht nur gefühlt – und an welchen Stellen die Modelle, auf denen die halbe Finanzbranche aufbaut, ihre Annahmen überziehen.',
  grenzen: [
    'Die Modelle setzen normalverteilte Renditen voraus. Tatsächlich kommen extreme Tage sehr viel häufiger vor, als die Normalverteilung zulässt – und sie entscheiden über das Ergebnis.',
    'Korrelationen werden aus der Vergangenheit geschätzt und ändern sich genau dann, wenn es darauf ankommt: In einem Crash steigen sie gegen eins, und die Streuung wirkt am wenigsten, wenn man sie am dringendsten bräuchte.',
    'Schwankung wird mit Risiko gleichgesetzt. Für jemanden, der dreißig Jahre nicht verkauft, ist Schwankung aber kein Risiko, sondern nur Lärm – das eigentliche Risiko ist der dauerhafte Verlust.',
    'Alle Kennzahlen sind rückwärtsgewandt. Eine hohe Sharpe-Ratio der letzten fünf Jahre sagt nichts über die nächsten fünf, und je kürzer der Zeitraum, desto mehr misst sie Zufall.',
  ],
  reihenfolge: [
    'was-portfoliotheorie-ist',
    'rendite-richtig-messen',
    'risiko-als-schwankung',
    'korrelation',
    'diversifikation',
    'effizienzlinie',
    'beta-und-capm',
    'alpha-und-vergleichsmassstab',
    'risikobereinigte-kennzahlen',
    'maximaler-rueckgang',
    'value-at-risk',
    'faktoren',
    'rebalancing',
    'sequenzrisiko',
  ],
}

export const portfoliotheorieLektionen: Lektion[] = [
  /* ------------------------------------------------------------------ 1 */
  {
    slug: 'was-portfoliotheorie-ist',
    bereich: 'portfoliotheorie',
    titel: 'Was Portfoliotheorie ist',
    kurz: 'Warum die Zusammensetzung mehr entscheidet als die Auswahl – und was Markowitz 1952 tatsächlich gezeigt hat.',
    kernaussage:
      'Der Beitrag einer Anlage zum Depot hängt nicht davon ab, wie gut sie allein ist, sondern davon, wie sie sich zu allem anderen verhält.',
    belegart: 'definition',
    dauer: 6,
    stichworte: ['Portfoliotheorie', 'Markowitz', 'Streuung'],
    lernthemen: ['portfolio-aufbau', 'risiko-und-rendite'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Bis in die 1950er Jahre bestand Anlageberatung im Kern darin, gute Einzelwerte zu finden. Dass man mehrere kaufen sollte, war bekannt – warum genau, hatte niemand aufgeschrieben. Harry Markowitz tat es 1952 in einem vierzehnseitigen Aufsatz und bekam dafür achtunddreißig Jahre später den Wirtschaftsnobelpreis.',
      },
      { type: 'heading', level: 2, text: 'Die Einsicht in einem Satz' },
      {
        type: 'paragraph',
        text: 'Das Risiko eines Depots ist **nicht** der Durchschnitt der Einzelrisiken. Es ist kleiner – und zwar umso kleiner, je weniger sich die Bestandteile im Gleichschritt bewegen. Zwei Anlagen mit je 20 Prozent Schwankung ergeben zusammen nur dann 20 Prozent, wenn sie exakt parallel laufen. Tun sie das nicht, liegt das Ergebnis darunter.',
      },
      {
        type: 'paragraph',
        text: 'Daraus folgt der Satz, um den es in diesem ganzen Zweig geht: Eine Anlage wird nicht danach beurteilt, wie gut sie für sich ist, sondern danach, was sie zum Ganzen beiträgt. Eine schwankungsstarke Anlage kann ein Depot ruhiger machen, wenn sie sich gegenläufig bewegt.',
      },
      { type: 'heading', level: 2, text: 'Was dieser Zweig behandelt' },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Messen.** Wie Rendite und Schwankung sauber gerechnet werden – und warum die naheliegende Rechnung bei beiden falsch ist.',
          '**Zusammensetzen.** Korrelation, Streuung, Effizienzlinie: der Kern der Theorie.',
          '**Bewerten.** Beta, Alpha, Sharpe und die Frage, was eine Rendite wert ist, wenn man das Risiko dazurechnet.',
          '**Misstrauen.** Maximaler Rückgang, Value at Risk, Sequenzrisiko – die Größen, die zeigen, wo die schönen Kennzahlen aufhören.',
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Was hier nicht steht',
        items: [
          'Keine Empfehlung für eine bestimmte Aufteilung. Wie viel Aktien jemand halten sollte, hängt von seiner Lage ab und nicht von einer Formel.',
          'Die Rechenwege sind nachvollziehbar, die Annahmen darunter sind es nicht immer. Wo eine Lektion eine Annahme benutzt, benennt sie sie.',
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 2 */
  {
    slug: 'rendite-richtig-messen',
    bereich: 'portfoliotheorie',
    titel: 'Rendite richtig messen',
    kurz: 'Warum der Durchschnitt der Jahresrenditen fast immer zu hoch ist und was stattdessen zu rechnen ist.',
    kernaussage:
      'Der einfache Mittelwert von Renditen überschätzt das Ergebnis systematisch. Was tatsächlich herauskam, sagt nur die geometrische Rendite.',
    belegart: 'definition',
    dauer: 7,
    stichworte: ['Rendite', 'geometrisches Mittel', 'CAGR'],
    setztVoraus: ['was-portfoliotheorie-ist'],
    lernthemen: ['risiko-und-rendite', 'zinseszins'],
    rechner: ['zinsrechner'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Eine Anlage steigt im ersten Jahr um 50 Prozent und fällt im zweiten um 50 Prozent. Der Durchschnitt ist null. Tatsächlich sind aus 100 Euro erst 150 und dann 75 geworden – ein Verlust von einem Viertel.',
      },
      {
        type: 'formula',
        expression:
          'arithmetisch:  (r₁ + r₂ + … + rₙ) ÷ n\ngeometrisch:   ⁿ√((1+r₁) × (1+r₂) × … × (1+rₙ)) − 1',
        description:
          'Die zweite Zeile ist die, die zählt. Sie beantwortet die Frage: Welcher gleichbleibende Satz hätte zum selben Endwert geführt? Genau das ist die Rendite, die jemand tatsächlich hatte.',
      },
      { type: 'heading', level: 2, text: 'Warum der Abstand wächst' },
      {
        type: 'paragraph',
        text: 'Der Unterschied zwischen beiden Zahlen ist keine Rundungsfrage: Er wächst mit der Schwankung. Grob gilt, dass die geometrische Rendite um etwa die halbe Varianz unter der arithmetischen liegt. Bei ruhigen Anlagen sind das Zehntelprozentpunkte, bei schwankungsstarken mehrere Prozentpunkte im Jahr.',
      },
      {
        type: 'table',
        caption: 'Derselbe Durchschnitt, verschiedene Ergebnisse.',
        head: ['Jahr 1', 'Jahr 2', 'Mittelwert', 'Tatsächlich'],
        rows: [
          ['+10 %', '−10 %', '0 %', '−1,0 %'],
          ['+30 %', '−30 %', '0 %', '−9,0 %'],
          ['+50 %', '−50 %', '0 %', '−25,0 %'],
        ],
      },
      {
        type: 'paragraph',
        text: 'Das ist der Grund, warum Schwankung nicht nur unangenehm, sondern teuer ist: Sie kostet Rendite, auch wenn die Auf- und Abbewegungen sich scheinbar ausgleichen. In der Fachsprache heißt der Effekt **Volatilitätsbremse**.',
      },
      { type: 'heading', level: 2, text: 'Zeitgewichtet oder geldgewichtet' },
      {
        type: 'paragraph',
        text: 'Wer während des Zeitraums ein- und auszahlt, hat zwei verschiedene Fragen zu beantworten. Die **zeitgewichtete** Rendite misst, wie gut die Anlage lief, unabhängig von den Zahlungen – so werden Fonds verglichen. Die **geldgewichtete** misst, was der Anleger tatsächlich verdient hat, samt der Wirkung seines Timings.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Wo diese Unterscheidung Werbung ermöglicht',
        items: [
          'Ein Fonds darf seine zeitgewichtete Rendite ausweisen. Wenn die Anleger überwiegend nach einer guten Phase eingestiegen sind, liegt ihre tatsächliche Rendite deutlich darunter – beide Zahlen sind korrekt.',
          'Untersuchungen zu dieser Lücke finden regelmäßig ein bis zwei Prozentpunkte im Jahr zulasten der Anleger. Die Ursache ist nicht der Fonds, sondern der Zeitpunkt der Zahlungen.',
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 3 */
  {
    slug: 'risiko-als-schwankung',
    bereich: 'portfoliotheorie',
    titel: 'Risiko als Schwankung',
    kurz: 'Was die Standardabweichung misst, wie sie gerechnet wird – und warum sie das Risiko nur zum Teil trifft.',
    kernaussage:
      'Die Portfoliotheorie setzt Risiko mit Schwankung gleich, weil Schwankung rechenbar ist. Das ist eine Entscheidung, keine Erkenntnis.',
    belegart: 'deutung',
    dauer: 8,
    stichworte: ['Volatilität', 'Standardabweichung', 'Risiko'],
    setztVoraus: ['rendite-richtig-messen'],
    lernthemen: ['risiko-und-rendite'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Um Anlagen vergleichen zu können, braucht die Theorie eine Zahl für Risiko. Gewählt wurde die **Standardabweichung** der Renditen, üblicherweise **Volatilität** genannt: ein Maß dafür, wie weit die einzelnen Renditen um ihren Mittelwert streuen.',
      },
      {
        type: 'formula',
        expression: 'σ = √( Σ (rᵢ − r̄)² ÷ (n − 1) )',
        description:
          'Abweichungen vom Mittelwert werden quadriert, gemittelt und wieder gewurzelt. Das Quadrieren sorgt dafür, dass sich positive und negative Abweichungen nicht aufheben – und gewichtet zugleich große Abweichungen stärker als kleine.',
      },
      {
        type: 'paragraph',
        text: 'Volatilität wird fast immer auf ein Jahr bezogen angegeben. Aus Tageswerten wird sie mit der Wurzel aus der Zahl der Handelstage hochgerechnet – bei 250 Tagen also mit rund 15,8. Diese Wurzelregel gilt nur, wenn die Tage voneinander unabhängig sind; sind sie es nicht, ist die Jahresangabe zu niedrig.',
      },
      { type: 'heading', level: 2, text: 'Was die Zahl bedeutet' },
      {
        type: 'paragraph',
        text: 'Unter der Annahme normalverteilter Renditen liegen rund zwei Drittel aller Jahre innerhalb einer Standardabweichung um den Mittelwert und rund 95 Prozent innerhalb von zweien. Bei einem Aktienindex mit 7 Prozent erwarteter Rendite und 18 Prozent Volatilität heißt das: Zwei von drei Jahren zwischen −11 und +25 Prozent.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Drei Einwände, die alle zutreffen',
        items: [
          '**Aufwärts wird mitgezählt.** Ein Jahr mit plus 40 Prozent erhöht die Volatilität genauso wie eines mit minus 40. Als Risikomaß ist das schwer zu begründen – niemand beschwert sich über die gute Überraschung.',
          '**Die Normalverteilung stimmt nicht.** Tage mit extremen Ausschlägen kommen um ein Vielfaches häufiger vor, als sie dürften. Der 19. Oktober 1987 war nach dem Modell ein Ereignis, das in der Lebensdauer des Universums nicht einmal vorkommen sollte.',
          '**Schwankung ist nicht dasselbe wie Verlustgefahr.** Wer dreißig Jahre nicht verkauft, für den ist der Weg gleichgültig; für ihn zählt nur, wo es endet. Umgekehrt kann eine ruhige Anlage vollständig ausfallen, ohne vorher geschwankt zu haben.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Trotzdem wird weiter mit ihr gerechnet, und dafür gibt es einen guten Grund: Sie ist eindeutig definiert, aus vorhandenen Kursen berechenbar und über alle Anlageklassen vergleichbar. Die Alternativen sind entweder ebenso angreifbar oder gar nicht erst zu bekommen.',
      },
    ],
  },

  /* ------------------------------------------------------------------ 4 */
  {
    slug: 'korrelation',
    bereich: 'portfoliotheorie',
    titel: 'Korrelation',
    kurz: 'Wie der Gleichlauf zweier Anlagen gemessen wird und warum der Wert genau dann steigt, wenn er fallen sollte.',
    kernaussage:
      'Die Korrelation ist die Stellschraube der Streuung. Sie wird aus der Vergangenheit geschätzt und ist gerade in Krisen am wenigsten verlässlich.',
    belegart: 'beobachtung',
    dauer: 8,
    stichworte: ['Korrelation', 'Gleichlauf', 'Kovarianz'],
    setztVoraus: ['risiko-als-schwankung'],
    lernthemen: ['portfolio-aufbau'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Zwei Anlagen können denselben Verlauf haben, gegenläufige Verläufe oder gar keinen erkennbaren Zusammenhang. Die **Korrelation** fasst das in eine Zahl zwischen −1 und +1.',
      },
      { type: 'figure', figure: 'pt-korrelation' },
      {
        type: 'table',
        caption: 'Was die Werte bedeuten.',
        head: ['Wert', 'Bedeutung', 'Wirkung im Depot'],
        rows: [
          [
            '+1,0',
            'exakter Gleichlauf',
            'keine Streuungswirkung – es ist dieselbe Wette',
          ],
          [
            '+0,5',
            'überwiegend gleichläufig',
            'etwas Wirkung; typisch für zwei Aktienmärkte',
          ],
          ['0,0', 'kein Zusammenhang', 'deutliche Wirkung'],
          [
            '−1,0',
            'exakt gegenläufig',
            'rechnerisch vollständige Absicherung – kommt praktisch nicht vor',
          ],
        ],
      },
      {
        type: 'formula',
        expression: 'ρ(A,B) = Kovarianz(A,B) ÷ (σA × σB)',
        description:
          'Die Kovarianz misst, ob Abweichungen vom Mittelwert gemeinsam auftreten. Geteilt durch die beiden Standardabweichungen wird daraus eine einheitenlose Zahl, die sich zwischen verschiedenen Anlagen vergleichen lässt.',
      },
      { type: 'heading', level: 2, text: 'Das Problem mit dem Zeitraum' },
      {
        type: 'paragraph',
        text: 'Eine Korrelation ist immer die Korrelation eines bestimmten Zeitraums in einer bestimmten Frequenz. Dieselben zwei Anlagen können auf Tagesbasis unkorreliert und auf Jahresbasis stark gleichläufig sein. Wer eine Korrelationszahl nennt, ohne beides dazuzusagen, nennt keine Zahl.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Warum die Streuung dann versagt, wenn man sie braucht',
        items: [
          'In ruhigen Phasen laufen Anlageklassen auseinander. In Panik verkaufen alle alles, was sich verkaufen lässt – und dann bewegen sich Aktien, Anleihen, Rohstoffe und Immobilienfonds gemeinsam nach unten.',
          'Im März 2020 fielen über Tage hinweg Aktien und Gold gleichzeitig, weil Anleger Liquidität brauchten und dafür das verkauften, was sich noch verkaufen ließ.',
          'Die Konsequenz ist nicht, auf Streuung zu verzichten, sondern ihre Wirkung nicht für die Krise einzuplanen. Wer sie dort einrechnet, plant mit einer Zahl, die genau dann kippt.',
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Korrelation ist keine Ursache',
        items: [
          'Dass zwei Reihen gemeinsam schwanken, sagt nichts darüber, ob eine die andere bewegt oder ob beide von einem Dritten getrieben werden.',
          'Bei genügend Suche findet sich zu jeder Kursreihe eine hochkorrelierte zweite. Der berühmte Fall ist die Butterproduktion in Bangladesch, die den amerikanischen Aktienmarkt über Jahre mit 0,99 traf.',
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 5 */
  {
    slug: 'diversifikation',
    bereich: 'portfoliotheorie',
    titel: 'Diversifikation',
    kurz: 'Warum Streuung wirkt, wo sie aufhört zu wirken und wie viele Positionen tatsächlich nötig sind.',
    kernaussage:
      'Streuung beseitigt das Risiko einzelner Unternehmen und lässt das Risiko des Marktes unberührt. Nur der zweite Teil wird bezahlt.',
    belegart: 'definition',
    dauer: 8,
    stichworte: ['Diversifikation', 'Streuung', 'Marktrisiko'],
    setztVoraus: ['korrelation'],
    lernthemen: ['portfolio-aufbau', 'aktien-laender-branchen'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Das Risiko einer einzelnen Aktie zerfällt in zwei Teile. Der eine gehört zum Unternehmen: schlechte Führung, ein verlorener Prozess, ein Produkt, das niemand will. Der andere gehört zum Markt: Zinsen, Konjunktur, Krieg. Nur der erste lässt sich wegstreuen.',
      },
      { type: 'figure', figure: 'pt-diversifikation' },
      {
        type: 'formula',
        expression: 'Gesamtrisiko = spezifisches Risiko + Marktrisiko',
        description:
          'Das spezifische Risiko verschwindet mit steigender Zahl der Positionen, weil sich unabhängige Einzelereignisse gegenseitig ausgleichen. Das Marktrisiko bleibt, egal wie viele Werte man kauft.',
      },
      {
        type: 'paragraph',
        text: 'Daraus folgt eine Aussage, die weit über die Portfoliotheorie hinaus wirkt: Für spezifisches Risiko gibt es keine Rendite. Wer es trägt, obwohl er es kostenlos loswerden könnte, wird dafür nicht entschädigt – der Markt zahlt keine Prämie für vermeidbare Risiken.',
      },
      { type: 'heading', level: 2, text: 'Wie viele Positionen' },
      {
        type: 'paragraph',
        text: 'Untersuchungen dazu gibt es seit den 1960er Jahren, und die Antworten sind über die Jahrzehnte gestiegen: Frühe Arbeiten nannten zehn bis fünfzehn Werte, spätere deutlich mehr, weil die Einzelwerte selbst schwankungsstärker geworden sind. Der Verlauf ist dabei wichtiger als die Zahl – der Nutzen fällt steil ab.',
      },
      {
        type: 'list',
        items: [
          'Von einer auf zehn Positionen verschwindet der größte Teil des spezifischen Risikos.',
          'Von zehn auf dreißig kommt noch ein spürbarer Rest hinzu.',
          'Von dreißig auf dreihundert ändert sich wenig – außer den Kosten der Verwaltung.',
        ],
      },
      { type: 'heading', level: 2, text: 'Wo Streuung nur so aussieht' },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Drei Formen von Scheinstreuung',
        items: [
          '**Zehn Fonds mit demselben Inhalt.** Wer fünf Welt-ETFs kauft, hält fünfmal fast dieselben Unternehmen. Entscheidend ist, was drin ist, nicht wie viele Produkte es sind.',
          '**Streuung nur innerhalb einer Klasse.** Dreißig Aktien sind gegen das Scheitern eines Unternehmens gestreut, nicht gegen einen Aktienmarkt, der als Ganzes fällt.',
          '**Alles im selben Land, in derselben Währung, bei derselben Bank.** Wer dort arbeitet, wo auch sein Vermögen liegt, hat sein Einkommen und seine Anlage im selben Risiko.',
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Der einzige Vorteil, den es umsonst gibt',
        items: [
          'Diversifikation senkt das Risiko, ohne die erwartete Rendite zu senken. In einem Feld, in dem sonst jeder Vorteil bezahlt werden muss, ist das die Ausnahme.',
          'Der Satz stammt in dieser Form von Markowitz’ Schüler und späterem Nobelpreisträger Harry Markowitz selbst und wird meist als „the only free lunch in finance“ zitiert.',
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 6 */
  {
    slug: 'effizienzlinie',
    bereich: 'portfoliotheorie',
    titel: 'Die Effizienzlinie',
    kurz: 'Welche Mischungen sinnvoll sind, welche nicht – und warum die Linie in der Praxis kaum zu treffen ist.',
    kernaussage:
      'Zu jedem Risikoniveau gibt es genau eine Mischung mit der höchsten erwarteten Rendite. Alle anderen sind schlechter, ohne dafür etwas zu bieten.',
    belegart: 'deutung',
    dauer: 8,
    stichworte: ['Effizienzlinie', 'Markowitz', 'Optimierung'],
    setztVoraus: ['diversifikation'],
    lernthemen: ['portfolio-aufbau'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Trägt man alle denkbaren Mischungen aus einem Vorrat von Anlagen in ein Diagramm ein – Risiko waagerecht, erwartete Rendite senkrecht –, entsteht eine Fläche. Ihre obere linke Kante ist die **Effizienzlinie**: Auf ihr liegen die Mischungen, zu denen es keine bessere gibt.',
      },
      { type: 'figure', figure: 'pt-effizienzlinie' },
      {
        type: 'paragraph',
        text: 'Alles unterhalb der Linie ist ineffizient: Zu jedem dieser Punkte gibt es eine Mischung mit gleichem Risiko und höherer Rendite oder mit gleicher Rendite und geringerem Risiko. Oberhalb der Linie liegt nichts – dort ist mit den vorhandenen Bausteinen nichts zu holen.',
      },
      { type: 'heading', level: 2, text: 'Was der risikolose Zins ändert' },
      {
        type: 'paragraph',
        text: 'Nimmt man eine risikolose Anlage hinzu, wird aus der gekrümmten Linie eine Gerade: Man mischt die risikolose Anlage mit genau einem Punkt auf der Effizienzlinie – dem **Tangentialportfolio**. Diese Gerade liegt über der gesamten alten Linie. Daraus folgt die praktisch bedeutsamste Aussage der Theorie: Für die Aufteilung braucht es nur zwei Entscheidungen – welches riskante Portfolio, und wie viel davon.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Warum sich damit trotzdem kaum jemand ein Depot baut',
        items: [
          '**Die Eingaben sind Schätzungen.** Die Optimierung braucht erwartete Renditen, Volatilitäten und alle paarweisen Korrelationen. Nichts davon ist bekannt; eingesetzt werden Vergangenheitswerte.',
          '**Das Ergebnis reagiert extrem empfindlich.** Ändert man eine erwartete Rendite um einen halben Prozentpunkt, springt die optimale Mischung oft von einer Ecke in die andere. Das ist als „Fehlerverstärker“ bekannt.',
          '**Die Lösungen sind unbrauchbar konzentriert.** Ohne zusätzliche Nebenbedingungen legt die Rechnung regelmäßig fast alles in zwei oder drei Anlagen – genau das Gegenteil dessen, was die Theorie eigentlich empfiehlt.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Was aus der Theorie in der Praxis übrig bleibt, ist deshalb nicht die Optimierung, sondern die Denkweise: dass Anlagen zusammen betrachtet werden müssen, dass Streuung Risiko ohne Renditeverzicht senkt und dass die Aufteilung zwischen riskant und sicher die eigentliche Stellschraube ist.',
      },
    ],
  },

  /* ------------------------------------------------------------------ 7 */
  {
    slug: 'beta-und-capm',
    bereich: 'portfoliotheorie',
    titel: 'Beta und das CAPM',
    kurz: 'Wie stark ein Wert mit dem Markt mitschwingt und welche Rendite ihm dafür zusteht.',
    kernaussage:
      'Das CAPM behauptet, dass nur das Mitschwingen mit dem Markt bezahlt wird. Es ist elegant, allgegenwärtig – und empirisch schlecht bestätigt.',
    belegart: 'deutung',
    dauer: 9,
    stichworte: ['Beta', 'CAPM', 'Marktrisiko', 'Risikoprämie'],
    setztVoraus: ['diversifikation'],
    lernthemen: ['risiko-und-rendite'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Wenn spezifisches Risiko wegstreubar ist und deshalb nicht bezahlt wird, bleibt die Frage: Wofür genau bekommt man dann eine Rendite? Die Antwort des **Capital Asset Pricing Model** aus den 1960er Jahren lautet: für das Mitschwingen mit dem Gesamtmarkt, gemessen als **Beta**.',
      },
      {
        type: 'formula',
        expression:
          'β = Kovarianz(Wert, Markt) ÷ Varianz(Markt)\nerwartete Rendite = risikoloser Zins + β × Marktrisikoprämie',
        description:
          'Ein Beta von 1 heißt: Der Wert bewegt sich im Mittel wie der Markt. 1,5 heißt anderthalbfach so stark in beide Richtungen, 0,5 halb so stark. Ein negatives Beta bedeutet gegenläufig.',
      },
      {
        type: 'table',
        caption: 'Grobe Einordnung typischer Bereiche.',
        head: ['Beta', 'Verhalten', 'Häufig bei'],
        rows: [
          ['unter 0,7', 'ruhiger als der Markt', 'Versorger, Basiskonsum, Gesundheit'],
          ['um 1,0', 'wie der Markt', 'breite Indizes, große Mischkonzerne'],
          ['über 1,3', 'stärker als der Markt', 'Technologie, Zykliker, kleine Werte'],
        ],
      },
      { type: 'heading', level: 2, text: 'Was das Modell leistet' },
      {
        type: 'paragraph',
        text: 'Es liefert einen Preis für Risiko – und damit den Abzinsungssatz, mit dem in der Fundamentalanalyse künftige Zahlungen auf heute gerechnet werden. Ohne ein solches Modell gäbe es keinen begründbaren Zinssatz für diese Rechnung. Deshalb steckt das CAPM in fast jeder Unternehmensbewertung, auch bei denen, die es für falsch halten.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Was gegen das Modell spricht',
        items: [
          '**Der Zusammenhang ist zu flach.** In den Daten verdienen Werte mit hohem Beta weniger, als das Modell verlangt, und Werte mit niedrigem Beta mehr. Diese Beobachtung ist über Jahrzehnte und viele Märkte hinweg stabil.',
          '**Beta ist instabil.** Der Wert hängt vom gewählten Zeitraum, vom Vergleichsindex und von der Frequenz ab. Dasselbe Unternehmen bekommt bei verschiedenen Anbietern spürbar verschiedene Betas.',
          '**Der „Markt“ ist nicht messbar.** Gemeint ist die Gesamtheit aller Vermögenswerte einschließlich Immobilien, Humankapital und Unnotiertem. Eingesetzt wird ein Aktienindex – ein Ersatz, dessen Tauglichkeit seit 1977 bestritten wird.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Das CAPM ist damit ein gutes Beispiel für den Umgang mit Modellen in diesem Feld: Es ist nachweislich unvollständig und wird trotzdem benutzt, weil es eine gemeinsame Sprache liefert. Wer eine Zahl daraus übernimmt, sollte wissen, wie weich sie ist.',
      },
    ],
  },

  /* ------------------------------------------------------------------ 8 */
  {
    slug: 'alpha-und-vergleichsmassstab',
    bereich: 'portfoliotheorie',
    titel: 'Alpha und der Vergleichsmaßstab',
    kurz: 'Was Überrendite bedeutet, warum die Wahl des Maßstabs sie erzeugen kann und wie oft sie Zufall ist.',
    kernaussage:
      'Alpha ist immer Alpha gegenüber einem bestimmten Maßstab. Wer den Maßstab wählt, wählt zu einem guten Teil auch das Ergebnis.',
    belegart: 'deutung',
    dauer: 8,
    stichworte: ['Alpha', 'Benchmark', 'aktives Management'],
    setztVoraus: ['beta-und-capm'],
    lernthemen: ['fonds', 'etf'],
    inhalt: [
      {
        type: 'paragraph',
        text: '**Alpha** ist der Teil der Rendite, den das Risiko nicht erklärt: was übrig bleibt, wenn man von der erzielten Rendite abzieht, was einem nach dem Modell für das eingegangene Marktrisiko ohnehin zugestanden hätte.',
      },
      {
        type: 'formula',
        expression:
          'α = erzielte Rendite − (risikoloser Zins + β × Marktrendite über dem Zins)',
        description:
          'Positiv heißt: mehr verdient, als das Risiko erklärt. Die Zahl hängt vollständig davon ab, welcher Markt eingesetzt wird und über welchen Zeitraum gerechnet wird.',
      },
      { type: 'heading', level: 2, text: 'Wie ein Maßstab Alpha erzeugt' },
      {
        type: 'list',
        items: [
          'Ein Fonds mit vielen kleinen Werten, gemessen an einem Index großer Werte, zeigt in Phasen, in denen kleine Werte laufen, ein Alpha – das keines ist, sondern eine andere Anlage.',
          'Ein Fonds mit hohem Auslandsanteil, gemessen am Heimatindex, zeigt bei fallender Heimatwährung ein Alpha.',
          'Ein Fonds, der dauerhaft etwas Kasse hält, zeigt in fallenden Märkten ein Alpha und in steigenden ein negatives.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Keiner dieser drei Fälle ist Betrug, und in allen dreien ist die Zahl richtig gerechnet. Sie misst nur nicht das, was sie zu messen vorgibt. Der ehrliche Vergleich braucht einen Maßstab mit demselben Anlageuniversum.',
      },
      { type: 'heading', level: 2, text: 'Die Frage des Zufalls' },
      {
        type: 'paragraph',
        text: 'Selbst bei sauberem Maßstab bleibt ein statistisches Problem: Bei tausenden Fonds gibt es allein durch Zufall jedes Jahr hunderte mit Überrendite. Um bei üblichen Schwankungen ein Alpha von zwei Prozentpunkten statistisch abzusichern, braucht man Zeitreihen von mehreren Jahrzehnten – länger, als die meisten Fonds und Fondsmanager existieren.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Zwei Verzerrungen in jeder Fondsstatistik',
        items: [
          '**Überlebensfehler.** Geschlossene und verschmolzene Fonds verschwinden aus den Auswertungen. Übrig bleiben die, die es geschafft haben – und der Durchschnitt sieht besser aus, als er war.',
          '**Rückrechnung.** Neue Strategien werden mit historischen Daten getestet, bevor sie auf den Markt kommen. Veröffentlicht wird, was in der Rückrechnung gut aussah; die anderen Versuche sieht niemand.',
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 9 */
  {
    slug: 'risikobereinigte-kennzahlen',
    bereich: 'portfoliotheorie',
    titel: 'Sharpe, Sortino und Verwandte',
    kurz: 'Rendite je Einheit Risiko – die gängigen Maße, ihre Rechenwege und wo jedes von ihnen kippt.',
    kernaussage:
      'Eine Rendite ohne das Risiko daneben ist keine Auskunft. Eine risikobereinigte Kennzahl ohne ihren Zeitraum ebenso wenig.',
    belegart: 'definition',
    dauer: 8,
    stichworte: ['Sharpe-Ratio', 'Sortino', 'Information Ratio'],
    setztVoraus: ['risiko-als-schwankung'],
    lernthemen: ['risiko-und-rendite', 'fonds'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Zwei Fonds haben acht Prozent im Jahr gebracht. Der eine schwankte dabei um zehn Prozent, der andere um dreißig. Ohne die zweite Zahl sind die beiden nicht vergleichbar – risikobereinigte Kennzahlen setzen sie ins Verhältnis.',
      },
      {
        type: 'formula',
        expression:
          'Sharpe   = (Rendite − risikoloser Zins) ÷ Gesamtschwankung\nSortino  = (Rendite − risikoloser Zins) ÷ Abwärtsschwankung\nInformation Ratio = (Rendite − Maßstab) ÷ Schwankung der Differenz',
        description:
          'Alle drei folgen demselben Bau: oben ein Ertrag über einem Bezugspunkt, unten ein Streuungsmaß. Sie unterscheiden sich darin, gegen was gemessen wird und welche Schwankung zählt.',
      },
      {
        type: 'table',
        caption: 'Wofür welche Kennzahl gedacht ist.',
        head: ['Kennzahl', 'Beantwortet', 'Schwäche'],
        rows: [
          [
            'Sharpe-Ratio',
            'Wie viel Ertrag je Einheit Gesamtschwankung?',
            'Bestraft Aufwärtsschwankung genauso wie Abwärtsschwankung',
          ],
          [
            'Sortino-Ratio',
            'Wie viel Ertrag je Einheit Verlustschwankung?',
            'Beruht auf weniger Datenpunkten und ist dadurch unruhiger',
          ],
          [
            'Information Ratio',
            'Wie verlässlich schlägt ein Fonds seinen Maßstab?',
            'Hängt vollständig an der Wahl des Maßstabs',
          ],
        ],
      },
      {
        type: 'paragraph',
        text: 'Für die Sharpe-Ratio gilt als grobe Einordnung: unter 0,5 wenig überzeugend, um 1 solide, über 2 auffällig gut – und ab dort lohnt die Frage, ob die Schwankung vollständig erfasst wurde.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Wie sich eine Sharpe-Ratio frisieren lässt',
        items: [
          '**Illiquide Werte.** Was selten bewertet wird, schwankt in den Daten wenig. Immobilien- und Private-Equity-Fonds haben dadurch strukturell zu gute Kennzahlen – das Risiko ist nicht kleiner, es wird nur seltener gemessen.',
          '**Strategien mit seltenen großen Verlusten.** Wer laufend kleine Prämien einnimmt und alle paar Jahre einen schweren Einbruch hat, zeigt bis dahin eine hervorragende Sharpe-Ratio. Genau das war das Muster vieler Fonds vor 2008.',
          '**Kurze Zeiträume.** Über drei Jahre gerechnet misst die Kennzahl überwiegend, welche Marktphase gerade war.',
        ],
      },
    ],
  },

  /* ----------------------------------------------------------------- 10 */
  {
    slug: 'maximaler-rueckgang',
    bereich: 'portfoliotheorie',
    titel: 'Der maximale Rückgang',
    kurz: 'Der größte Verlust vom Hoch zum Tief – die Zahl, die am ehesten beschreibt, was man aushalten muss.',
    kernaussage:
      'Der maximale Rückgang misst nicht Schwankung, sondern Schmerz: wie tief es ging und wie lange es dauerte, bis es wieder aufgeholt war.',
    belegart: 'definition',
    dauer: 11,
    stichworte: ['Maximum Drawdown', 'Rückgang', 'Erholungsdauer'],
    setztVoraus: ['risiko-als-schwankung'],
    lernthemen: ['groesste-crashes', 'anlegerpsychologie'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Der **maximale Rückgang** ist der größte prozentuale Verlust vom höchsten bis zum darauffolgenden tiefsten Stand. Er beantwortet die Frage, die eine Volatilitätszahl nicht beantwortet: Wie schlimm wurde es tatsächlich?',
      },
      { type: 'figure', figure: 'pt-maximaler-rueckgang' },
      {
        type: 'formula',
        expression:
          'Rückgang = (Tiefstand − vorheriger Höchststand) ÷ vorheriger Höchststand',
        description:
          'Gerechnet wird immer gegen den bisherigen Höchststand, nicht gegen den Anfangswert. Deshalb kann eine Anlage über den Gesamtzeitraum im Plus liegen und trotzdem einen schweren Rückgang aufweisen.',
      },
      { type: 'heading', level: 2, text: 'Warum die Erholungsdauer dazugehört' },
      {
        type: 'paragraph',
        text: 'Ein Rückgang von vierzig Prozent, der nach einem Jahr aufgeholt ist, ist etwas anderes als derselbe Rückgang mit dreizehn Jahren Erholungszeit. Die zweite Zahl entscheidet darüber, ob jemand durchhält – und wer während der Erholungsphase Geld entnehmen muss, hat den Verlust festgeschrieben.',
      },
      {
        type: 'paragraph',
        text: 'Dazu kommt die Asymmetrie der Prozentrechnung, die regelmäßig unterschätzt wird: Nach minus 50 Prozent braucht es plus 100, um wieder bei null zu sein. Nach minus 20 reichen plus 25.',
      },
      {
        type: 'table',
        caption: 'Was zur Rückkehr auf den alten Stand nötig ist.',
        head: ['Rückgang', 'Nötiger Anstieg'],
        rows: [
          ['−10 %', '+11 %'],
          ['−20 %', '+25 %'],
          ['−33 %', '+50 %'],
          ['−50 %', '+100 %'],
          ['−80 %', '+400 %'],
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Warum diese Zahl wichtiger sein kann als die Rendite',
        items: [
          'Die durchschnittliche Rendite bekommt nur, wer dabeibleibt. Wer bei minus 45 Prozent verkauft, hat die Rendite der Statistik nie erhalten.',
          'Deshalb gehört zur Auswahl einer Aufteilung die Frage, welchen Rückgang man erlebt hat und noch aushalten würde – nicht, welche Rendite man gern hätte.',
        ],
      },
      {
        type: 'heading',
        level: 3,
        text: 'Die zwei Zahlen, die immer zusammengehören',
      },
      {
        type: 'paragraph',
        text: 'Ein maximaler Rückgang von 50 Prozent sagt für sich genommen wenig. Erst mit der **Dauer bis zur Erholung** wird daraus eine Aussage darüber, was auszuhalten war – und die Dauer ist regelmäßig die härtere der beiden Zahlen.',
      },
      {
        type: 'list',
        items: [
          '**Die Tiefe entscheidet über den Schrecken**, die Dauer über das Durchhalten. Ein schneller Absturz mit rascher Erholung ist unangenehm; Jahre unter Wasser sind es länger.',
          '**Die Erholung braucht mehr, als der Rückgang genommen hat.** Nach minus 50 Prozent sind plus 100 Prozent nötig, um wieder bei null zu sein. Diese Asymmetrie ist der Grund, warum große Rückgänge so viel schwerer wiegen als kleine.',
          '**Die Zeit zählt ab dem alten Höchststand, nicht ab dem Tief.** Wer erst ab dem Tief rechnet, verkürzt jede Erholungsdauer erheblich – ein häufiger Fehler in Werbematerial.',
        ],
      },
      {
        type: 'heading',
        level: 3,
        text: 'Warum die historische Zahl zu klein ist',
      },
      {
        type: 'callout',
        variant: 'warning',
        title:
          'Drei Gründe, den größten beobachteten Rückgang nicht für die Obergrenze zu halten',
        items: [
          '**Die Stichprobe ist kurz.** Der größte Rückgang der letzten dreißig Jahre ist der größte, der in dreißig Jahren vorkam – nicht der größte, der vorkommen kann.',
          '**Er hängt am Startzeitpunkt.** Dieselbe Anlage hat je nach Betrachtungsbeginn verschiedene Höchststände und damit verschiedene Rückgänge. Die Zahl ist keine Eigenschaft der Anlage allein.',
          '**Überlebende verzerren.** Ausgewertet wird, was es noch gibt. Was während des Zeitraums verschwand, taucht in keiner Reihe auf – und hatte einen Rückgang von hundert Prozent.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Für die Planung ist der historische Rückgang deshalb eine **Untergrenze der Erwartung**, kein Grenzwert. Wer prüfen will, ob er sein Depot aushält, rechnet mit spürbar mehr – und mit einer Erholungsdauer, die länger ist als die bisher beobachtete.',
      },
    ],
  },

  /* ----------------------------------------------------------------- 11 */
  {
    slug: 'value-at-risk',
    bereich: 'portfoliotheorie',
    titel: 'Value at Risk',
    kurz: 'Die Kennzahl der Bankenaufsicht: was sie aussagt, wie sie gerechnet wird und warum sie 2008 versagt hat.',
    kernaussage:
      'Value at Risk nennt eine Verlustschwelle, die selten überschritten wird – und sagt nichts darüber, wie schlimm es wird, wenn sie überschritten wird.',
    belegart: 'deutung',
    dauer: 8,
    stichworte: ['Value at Risk', 'Risikomessung', 'Tail Risk'],
    setztVoraus: ['risiko-als-schwankung'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Der **Value at Risk** beantwortet eine sehr konkrete Frage: Welcher Verlust wird in einem bestimmten Zeitraum mit einer bestimmten Wahrscheinlichkeit nicht überschritten? Ein Ein-Tages-VaR von einer Million bei 99 Prozent heißt: An 99 von 100 Tagen bleibt der Verlust darunter.',
      },
      {
        type: 'paragraph',
        text: 'Die Kennzahl wurde in den 1990er Jahren populär, weil sie das Risiko eines ganzen Handelshauses in eine einzige Zahl fasst, die auch ohne Fachwissen lesbar ist. Sie steht seither in der Bankenaufsicht und bestimmt mit, wie viel Eigenkapital ein Institut vorhalten muss.',
      },
      { type: 'heading', level: 2, text: 'Der Satz, der alles erklärt' },
      {
        type: 'quote',
        text: 'Er sagt uns, dass wir an 99 von 100 Tagen nicht mehr als eine bestimmte Summe verlieren. Über den hundertsten Tag sagt er nichts.',
        source:
          'Sinngemäße Kritik, wie sie seit den 1990er Jahren gegen den VaR vorgebracht wird',
      },
      {
        type: 'paragraph',
        text: 'Genau darin liegt die Schwäche. Der VaR schneidet den Rand der Verteilung ab und macht keine Aussage über das, was dahinter liegt. Zwei Portfolios mit demselben VaR können im schlechtesten Prozent völlig verschieden ausfallen – das eine verliert etwas mehr, das andere alles.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Drei Gründe, warum die Zahl zu niedrig ausfällt',
        items: [
          '**Die Verteilungsannahme.** Wird mit der Normalverteilung gerechnet, kommen extreme Tage viel zu selten vor. Die tatsächlichen Ränder sind dicker.',
          '**Der Beobachtungszeitraum.** Gerechnet wird meist mit den letzten ein bis zwei Jahren. Nach einer ruhigen Phase fällt der VaR niedrig aus – also genau dann, wenn die Risikobereitschaft ohnehin am höchsten ist.',
          '**Die Rückkopplung.** Wenn viele Häuser dasselbe Maß benutzen, verkaufen sie in Stressphasen gleichzeitig, weil ihre Kennzahl gleichzeitig anschlägt. Das Maß bewegt dann den Markt, den es messen soll.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Als Reaktion darauf wird zunehmend der **erwartete Fehlbetrag** verlangt: der durchschnittliche Verlust in genau den Fällen, in denen die VaR-Schwelle überschritten wird. Er beantwortet die Frage nach dem hundertsten Tag – und ist seit der Überarbeitung der Bankenregeln das maßgebliche Maß im Handelsbuch.',
      },
    ],
  },

  /* ----------------------------------------------------------------- 12 */
  {
    slug: 'faktoren',
    bereich: 'portfoliotheorie',
    titel: 'Faktoren',
    kurz: 'Größe, Bewertung, Momentum, Qualität: die Merkmale, die Renditeunterschiede erklären sollen – und der Verdacht gegen sie.',
    kernaussage:
      'Faktoren erklären Renditeunterschiede besser als das Marktrisiko allein. Ob sie eine Prämie oder ein Fund der Datensuche sind, ist offen.',
    belegart: 'deutung',
    dauer: 9,
    stichworte: ['Faktoren', 'Fama-French', 'Momentum', 'Value'],
    setztVoraus: ['beta-und-capm'],
    lernthemen: ['etf', 'aktien-laender-branchen'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Nachdem sich gezeigt hatte, dass Beta allein die Renditeunterschiede zwischen Aktien nur schlecht erklärt, suchten Eugene Fama und Kenneth French nach weiteren Merkmalen. Ihr Modell von 1992 fügte zwei hinzu: die Unternehmensgröße und das Verhältnis von Buchwert zu Marktwert.',
      },
      {
        type: 'table',
        caption: 'Die am häufigsten genannten Faktoren.',
        head: ['Faktor', 'Merkmal', 'Behauptete Begründung'],
        rows: [
          [
            'Größe',
            'kleine Unternehmen',
            'Höheres Ausfallrisiko, schlechtere Handelbarkeit',
          ],
          [
            'Bewertung',
            'niedriges Kurs-Buchwert-Verhältnis',
            'Unternehmen in Schwierigkeiten, dafür Risikoprämie',
          ],
          [
            'Momentum',
            'zuletzt gut gelaufen',
            'Keine risikobasierte – am ehesten verhaltensbedingt',
          ],
          [
            'Qualität',
            'hohe, stabile Kapitalrendite',
            'Widerspricht der Risikologik: mehr Rendite bei weniger Risiko',
          ],
          [
            'Geringe Schwankung',
            'ruhige Aktien',
            'Ebenfalls gegen die Logik – und trotzdem gut belegt',
          ],
        ],
      },
      {
        type: 'paragraph',
        text: 'Die letzten beiden Zeilen sind der wunde Punkt. Ein Faktor gilt als erklärbar, wenn seine Mehrrendite eine Entschädigung für ein Risiko ist. Bei Qualität und geringer Schwankung ist es umgekehrt: Dort verdient man mehr bei weniger Risiko. Das ist nach der Theorie nicht vorgesehen.',
      },
      { type: 'heading', level: 2, text: 'Der Faktorzoo' },
      {
        type: 'paragraph',
        text: 'In der Fachliteratur sind inzwischen mehrere hundert Faktoren veröffentlicht worden. Bei so vielen Untersuchungen an denselben Kursreihen ist es statistisch sicher, dass ein Teil davon reiner Zufallsfund ist. Arbeiten, die den üblichen Signifikanzmaßstab an die Zahl der Versuche anpassen, halten nur eine Minderheit für belastbar.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Was gegen die Anwendung spricht',
        items: [
          '**Lange Durststrecken.** Der Bewertungsfaktor hat zwischen 2007 und 2020 über ein Jahrzehnt hinweg verloren. Kein Anleger hält eine Strategie durch, die dreizehn Jahre nicht funktioniert – und wer sie am Ende aufgibt, hat den schlechtesten Teil mitgenommen.',
          '**Nach Veröffentlichung schrumpft der Effekt.** Untersuchungen dazu finden regelmäßig, dass die Mehrrendite nach der Publikation deutlich zurückgeht. Entweder war sie ein Fund, oder sie ist wegarbitriert.',
          '**Kosten und Umschlag.** Momentum verlangt häufiges Umschichten. Was in der Untersuchung ohne Kosten gerechnet wurde, schrumpft in der Umsetzung erheblich.',
        ],
      },
    ],
  },

  /* ----------------------------------------------------------------- 13 */
  {
    slug: 'rebalancing',
    bereich: 'portfoliotheorie',
    titel: 'Rebalancing',
    kurz: 'Warum eine Aufteilung wieder hergestellt werden muss, nach welcher Regel – und was es tatsächlich bringt.',
    kernaussage:
      'Rebalancing hält das Risiko auf dem gewählten Niveau. Dass es zusätzlich Rendite bringt, ist der seltenere Fall und hängt vom Verlauf ab.',
    belegart: 'beobachtung',
    dauer: 12,
    stichworte: ['Rebalancing', 'Umschichten', 'Aufteilung'],
    setztVoraus: ['diversifikation'],
    lernthemen: ['portfolio-aufbau', 'wann-kaufen-verkaufen'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Wer 60 Prozent Aktien und 40 Prozent Anleihen wählt und dann nichts tut, hat nach einigen guten Aktienjahren 75 zu 25. Die Aufteilung hat sich verschoben, ohne dass jemand etwas entschieden hätte – und mit ihr das Risiko.',
      },
      {
        type: 'paragraph',
        text: 'Das ist der eigentliche Zweck des Rebalancings: nicht Rendite, sondern die Rückkehr zu dem Risiko, das man einmal für richtig gehalten hat. Wer nie zurückschichtet, hat am Ende eines langen Aufschwungs das höchste Aktiengewicht seines Lebens – kurz bevor es darauf ankommt.',
      },
      { type: 'heading', level: 2, text: 'Nach welcher Regel' },
      {
        type: 'table',
        caption: 'Die drei gängigen Auslöser.',
        head: ['Regel', 'Vorgehen', 'Eigenschaft'],
        rows: [
          [
            'Nach Kalender',
            'einmal im Jahr, unabhängig vom Stand',
            'einfach, planbar, wenige Umsätze',
          ],
          [
            'Nach Bandbreite',
            'wenn eine Position mehr als 5 Punkte abweicht',
            'reagiert auf das, worauf es ankommt',
          ],
          [
            'Über Zuflüsse',
            'neues Geld in die untergewichtete Seite',
            'löst nichts aus – keine Kosten, keine Steuer',
          ],
        ],
      },
      {
        type: 'paragraph',
        text: 'Die dritte Zeile ist für die meisten die beste. Wer ohnehin monatlich einzahlt, kann die Aufteilung über Jahre allein mit der Verteilung der Einzahlungen halten und muss nie verkaufen – und damit nie einen steuerpflichtigen Gewinn auslösen.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Was der Rebalancing-Bonus ist und wann er verschwindet',
        items: [
          'Bei Anlagen, die um einen Mittelwert pendeln, verkauft Rebalancing regelmäßig teuer und kauft billig. Daraus kann eine kleine Mehrrendite entstehen.',
          'Bei Anlagen mit dauerhaftem Trend ist es umgekehrt: Man verkauft immer wieder das, was weiter steigt. Über lange Aktienhaussen kostet Rebalancing Rendite.',
          'Wer es also mit Renditeversprechen begründet, begründet es falsch. Die tragfähige Begründung ist das Risiko.',
        ],
      },
      {
        type: 'heading',
        level: 3,
        text: 'Kalender oder Bandbreite',
      },
      {
        type: 'paragraph',
        text: 'Es gibt zwei Auslöser, und die Wahl zwischen ihnen ist die einzige Entscheidung, die man beim Rebalancing überhaupt trifft. Beide funktionieren; sie haben nur verschiedene Schwächen.',
      },
      {
        type: 'table',
        caption: 'Die beiden Regeln im Vergleich',
        head: ['', 'Nach Kalender', 'Nach Bandbreite'],
        rows: [
          [
            'Auslöser',
            'ein fester Termin, etwa einmal jährlich',
            'eine Abweichung von der Zielquote über eine festgelegte Spanne hinaus',
          ],
          [
            'Stärke',
            'null Aufwand, null Entscheidungen, kein Blick ins Depot nötig',
            'greift dann, wenn es etwas zu tun gibt – auch mitten im Jahr',
          ],
          [
            'Schwäche',
            'ein Absturz im März wird erst im Dezember korrigiert',
            'verlangt regelmäßiges Nachsehen, und genau das erzeugt Handlungsdruck',
          ],
          [
            'Zahl der Transaktionen',
            'planbar und niedrig',
            'in ruhigen Jahren null, in unruhigen mehrere',
          ],
        ],
      },
      {
        type: 'paragraph',
        text: 'Die verbreitete Kombination nimmt von beidem das Beste: einmal jährlich nachsehen und **nur dann handeln**, wenn die Abweichung eine Schwelle überschreitet. Damit ist der Aufwand fest und die Zahl der Geschäfte klein.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Was Rebalancing wirklich leistet',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Die häufigste Fehlbehauptung',
        items: [
          '**Es steigert nicht zuverlässig die Rendite.** Wer eine Anlageklasse hält, die langfristig stärker steigt, verkauft durch Rebalancing regelmäßig die bessere und kauft die schlechtere nach. Über lange Zeiträume kostet das eher Rendite, als es welche bringt.',
          '**Es hält das Risiko dort, wo es beschlossen wurde.** Das ist der eigentliche Zweck: Ohne Rückführung wächst der Aktienanteil in guten Jahren still an – und der Rückgang trifft dann ein Depot, das riskanter ist als geplant.',
          '**Der antizyklische Effekt ist ein Nebenprodukt**, kein Ziel. Er wirkt in schwankenden Seitwärtsmärkten am stärksten und in durchlaufenden Aufwärtsphasen gar nicht.',
        ],
      },
      {
        type: 'heading',
        level: 3,
        text: 'Die billigste Variante: über die Zuflüsse',
      },
      {
        type: 'paragraph',
        text: 'Jeder Verkauf kostet Gebühren, Spread und meist Steuer. Wer regelmäßig einzahlt, kann die Quote ganz ohne Verkauf zurückführen – indem die nächsten Raten in den zu leichten Baustein fließen. Bei einem noch wachsenden Depot reicht das über viele Jahre vollständig aus, und es ist die einzige Form des Rebalancing, die nichts kostet.',
      },
    ],
  },

  /* ----------------------------------------------------------------- 14 */
  {
    slug: 'sequenzrisiko',
    bereich: 'portfoliotheorie',
    titel: 'Sequenzrisiko',
    kurz: 'Warum die Reihenfolge der Renditen über das Ergebnis entscheidet, sobald Geld entnommen wird.',
    kernaussage:
      'Beim reinen Ansparen ist die Reihenfolge der Renditen gleichgültig. Sobald entnommen wird, ist sie das Wichtigste überhaupt.',
    belegart: 'definition',
    dauer: 8,
    stichworte: ['Sequenzrisiko', 'Entnahme', 'Ruhestand'],
    setztVoraus: ['maximaler-rueckgang'],
    lernthemen: ['rente', 'portfolio-aufbau'],
    rechner: ['rentenluecke'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Zwei Menschen erleben über zwanzig Jahre exakt dieselben Jahresrenditen – nur in umgekehrter Reihenfolge. Wer nichts entnimmt, landet bei genau demselben Endwert: Multiplikation ist von der Reihenfolge unabhängig. Wer monatlich entnimmt, landet weit auseinander.',
      },
      { type: 'figure', figure: 'pt-sequenzrisiko' },
      {
        type: 'paragraph',
        text: 'Der Grund ist einfach und unangenehm: Wer in einem schlechten Jahr entnimmt, verkauft Anteile zu niedrigen Kursen. Diese Anteile fehlen dauerhaft und können an der späteren Erholung nicht mehr teilnehmen. Kommen die schlechten Jahre am Anfang, ist die Entnahmephase gefährdet, auch wenn die Durchschnittsrendite stimmt.',
      },
      {
        type: 'formula',
        expression:
          'Ansparen:  Endwert = Einzahlung × (1+r₁) × (1+r₂) × …\nEntnahme:  jedes Jahr wird ein fester Betrag abgezogen, bevor weiter multipliziert wird',
        description:
          'In der ersten Zeile darf man die Faktoren beliebig vertauschen. In der zweiten nicht mehr – der Abzug dazwischen macht die Reihenfolge bedeutsam.',
      },
      { type: 'heading', level: 2, text: 'Was dagegen hilft' },
      {
        type: 'list',
        items: [
          '**Ein Puffer aus sicheren Anlagen.** Zwei bis drei Jahresentnahmen in Tagesgeld oder kurzen Anleihen; in schlechten Jahren wird daraus entnommen statt aus den Aktien.',
          '**Flexible Entnahme.** Wer in schwachen Jahren weniger entnimmt, verkauft weniger Anteile zu Tiefstkursen. Schon geringe Anpassungen wirken stark.',
          '**Das Aktiengewicht um den Renteneintritt senken und danach wieder anheben.** Die verwundbarste Phase liegt in den ersten Jahren der Entnahme, nicht am Ende.',
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Warum die Durchschnittsrendite hier in die Irre führt',
        items: [
          'Eine Planung mit „sechs Prozent im Schnitt“ unterstellt stillschweigend, dass die Renditen gleichmäßig anfallen. Genau das tun sie nie.',
          'Sinnvoller ist die Frage: Was passiert, wenn die ersten fünf Jahre schlecht laufen? Wer das durchrechnet, plant belastbar statt optimistisch.',
        ],
      },
    ],
  },
]
