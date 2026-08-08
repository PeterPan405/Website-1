/**
 * Der Zweig „Technische Analyse“ der Akademie.
 *
 * ## Warum alle Lektionen in einer Datei stehen
 *
 * Anders als die Lernthemen, die je eine eigene Datei bekommen. Der Grund ist
 * die Reihenfolge: Diese Lektionen bauen aufeinander auf, und die Übergänge
 * müssen stimmen. Wer in der Lektion zum MACD schreibt „der EMA aus der
 * vorigen Lektion“, muss beim Umstellen sehen, dass die vorige Lektion noch
 * der EMA ist. Über 13 Dateien verteilt sieht das niemand.
 *
 * ## Zur Haltung dieses Kapitels
 *
 * Die technische Analyse ist umstritten, und dieser Text tut nicht so, als
 * wäre sie es nicht. Jede Lektion trägt eine Einstufung – Rechenweg,
 * Beobachtung oder Auslegung –, und wo eine Methode in Untersuchungen schlecht
 * abschneidet, steht das dabei. Das ist keine Ablehnung: Wer die Begriffe
 * nicht kennt, versteht die halbe Finanzberichterstattung nicht. Es ist der
 * Unterschied zwischen erklären und empfehlen.
 */

import type { Bereich, Lektion } from '@/data/akademie/types'

export const technischeAnalyse: Bereich = {
  id: 'technische-analyse',
  titel: 'Technische Analyse',
  sinnbild: 'chart',
  kurz: 'Was sich aus Kurs und Umsatz ablesen lässt – Trends, Marken, Indikatoren und Muster.',
  einleitung:
    'Die technische Analyse betrachtet nur zwei Dinge: den Kurs und den gehandelten Umsatz. Sie fragt nicht, was ein Unternehmen verdient, sondern was die Käufer und Verkäufer bisher getan haben. Diese Lektionen erklären die Begriffe, die Rechenwege und die Muster – und an jeder Stelle, wie belastbar das jeweils ist.',
  grenzen: [
    'Ein Chart enthält keine Information über das Unternehmen. Eine Gewinnwarnung ist am Vortag nicht im Kursverlauf zu sehen, sondern am Tag danach im Kurssturz.',
    'Die meisten Muster werden erst im Rückblick eindeutig. Ein Aufwärtstrend ist so lange ein Aufwärtstrend, bis er keiner mehr war – und der Zeitpunkt steht erst danach fest.',
    'Untersuchungen zur Vorhersagekraft kommen zu widersprüchlichen Ergebnissen. Was nach Handelskosten und Steuern übrig bleibt, ist in vielen Studien nichts.',
    'Wer viele Indikatoren auf denselben Chart legt, findet immer einen, der zum eigenen Wunsch passt. Das ist kein Erkenntnisgewinn, sondern Auswahl im Nachhinein.',
  ],
  reihenfolge: [
    'was-technische-analyse-ist',
    'charttypen-und-kerzen',
    'trend-und-trendlinien',
    'unterstuetzung-und-widerstand',
    'gleitende-durchschnitte',
    'macd',
    'rsi-und-oszillatoren',
    'volatilitaet-bollinger-atr',
    'volumen',
    'chartmuster',
    'kerzenmuster',
    'fibonacci-retracements',
    'elliott-wellen',
    'elliott-impulse',
    'elliott-korrekturen',
    'elliott-wellenziele',
  ],
}

export const technischeAnalyseLektionen: Lektion[] = [
  /* ------------------------------------------------------------------ 1 */
  {
    slug: 'was-technische-analyse-ist',
    bereich: 'technische-analyse',
    titel: 'Was technische Analyse ist – und was sie nicht ist',
    kurz: 'Die drei Annahmen hinter jeder Chartbetrachtung, ihre Herkunft und die Einwände dagegen.',
    kernaussage:
      'Die technische Analyse beschreibt das Verhalten von Käufern und Verkäufern. Sie erklärt nicht, warum sie so handeln – und sie kennt die Zukunft nicht.',
    belegart: 'deutung',
    dauer: 7,
    stichworte: ['Technische Analyse', 'Chartanalyse', 'Dow-Theorie', 'Random Walk'],
    lernthemen: ['boerse', 'aktie'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Wer einen Kurschart ansieht, sieht keine Zahlen über ein Unternehmen. Er sieht eine Aufzeichnung darüber, zu welchen Preisen sich Käufer und Verkäufer in der Vergangenheit geeinigt haben. Die technische Analyse ist der Versuch, aus dieser Aufzeichnung etwas über die nächste Einigung zu erfahren.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Die drei Annahmen',
      },
      {
        type: 'paragraph',
        text: 'Jede Chartbetrachtung ruht auf drei Sätzen. Sie stammen aus den Börsenkommentaren von Charles Dow um 1900 und wurden nach seinem Tod zur **Dow-Theorie** zusammengefasst. Wer die Sätze kennt, versteht, was die Methode behauptet – und wo sie angreifbar ist.',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Der Kurs enthält alles.** Was über ein Unternehmen bekannt ist – Zahlen, Gerüchte, Stimmung –, steckt bereits im Preis. Wer den Kurs betrachtet, betrachtet das Ergebnis aller Meinungen.',
          '**Kurse bewegen sich in Trends.** Eine Bewegung hält eher an, als dass sie zufällig die Richtung wechselt.',
          '**Geschichte wiederholt sich.** Menschen reagieren auf Gewinne und Verluste heute wie vor hundert Jahren, und deshalb entstehen ähnliche Muster.',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Der erste und der zweite Satz vertragen sich schlecht',
        items: [
          'Wenn der Kurs wirklich alles enthält, was bekannt ist, dann enthält er auch das Wissen um den Trend. Dann müsste der Trend sofort eingepreist sein und wäre nicht mehr handelbar.',
          'Genau das ist der Kern der Kritik: Die beiden ersten Annahmen widersprechen einander, sobald man sie ernst nimmt. Die technische Analyse lebt davon, den ersten Satz nur halb zu meinen.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Der Einwand: Zufallspfad',
      },
      {
        type: 'paragraph',
        text: 'Die bekannteste Gegenposition ist die **Random-Walk-Hypothese**. Sie besagt, dass Kursänderungen im Wesentlichen zufällig sind: Der nächste Schritt hängt nicht vom letzten ab. Trifft das zu, ist jedes Muster im Chart eine Figur, die das Auge hineinsieht – so wie man in Wolken Gesichter sieht.',
      },
      {
        type: 'paragraph',
        text: 'Ganz so eindeutig ist die Lage nicht. Für kurze Zeiträume finden Untersuchungen einen schwachen **Momentum-Effekt**: Was zuletzt gestiegen ist, steigt etwas häufiger weiter, als der Zufall erwarten ließe. Über längere Zeiträume kehrt sich das um. Beide Effekte sind klein, schwanken über die Jahrzehnte und schrumpfen weiter, sobald Handelskosten abgezogen werden.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Der andere Einwand: selbsterfüllende Erwartung',
      },
      {
        type: 'paragraph',
        text: 'Manche Marken wirken, weil viele auf sie schauen. Liegt eine viel beachtete Linie bei 100 Euro und legen tausende Anleger dort ihre Kauforder, dann findet bei 100 Euro tatsächlich Nachfrage statt. Das Muster hat funktioniert – aber nicht, weil es etwas über das Unternehmen wusste, sondern weil genug Leute daran geglaubt haben.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Warum das trotzdem im Lehrplan steht',
        items: [
          'Die Begriffe prägen die halbe Finanzberichterstattung. Wer nicht weiß, was „der DAX hat seine 200-Tage-Linie zurückerobert“ bedeutet, versteht die Meldung nicht – auch wenn er sie für belanglos hält.',
          'Ein Teil der Werkzeuge ist unstrittig nützlich, weil er nichts vorhersagt, sondern beschreibt: Die durchschnittliche Tagesschwankung eines Wertes zu kennen, hilft bei der Frage, wie groß eine Position sein darf.',
          'Wer die Grenzen kennt, fällt seltener auf Angebote herein, die aus Chartmustern eine Gewissheit machen.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was diese Lektionen tun',
      },
      {
        type: 'paragraph',
        text: 'Jede Lektion trägt oben eine Einstufung. **Rechenweg** heißt: Das ist Arithmetik, darüber gibt es nichts zu streiten. **Beobachtung** heißt: Das Muster gibt es, seine Vorhersagekraft ist umstritten. **Auslegung** heißt: Zwei Fachleute können denselben Chart verschieden einzeichnen und zu gegenteiligen Schlüssen kommen. Diese Unterscheidung ist der eigentliche Inhalt des Kapitels.',
      },
    ],
  },

  /* ------------------------------------------------------------------ 2 */
  {
    slug: 'charttypen-und-kerzen',
    bereich: 'technische-analyse',
    titel: 'Charttypen und der Aufbau einer Kerze',
    kurz: 'Linie, Balken, Kerze – und warum die Wahl des Zeitrahmens die halbe Aussage bestimmt.',
    kernaussage:
      'Eine Kerze zeigt vier Zahlen: Eröffnung, Hoch, Tief, Schluss. Der Körper ist die Bilanz des Zeitraums, die Dochte sind, was dazwischen versucht wurde.',
    belegart: 'definition',
    dauer: 6,
    stichworte: ['Candlestick', 'Kerzenchart', 'OHLC', 'Zeitrahmen'],
    setztVoraus: ['was-technische-analyse-ist'],
    lernthemen: ['boerse'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Bevor man einen Chart deutet, muss man wissen, was er zeigt. Dieselben Kurse ergeben je nach Darstellung ein anderes Bild – und je nach Zeitrahmen sogar eine andere Richtung.',
      },
      { type: 'heading', level: 2, text: 'Drei Darstellungen' },
      {
        type: 'table',
        caption: 'Was die gängigen Charttypen zeigen und was sie weglassen.',
        head: ['Typ', 'Zeigt je Zeitraum', 'Stärke', 'Schwäche'],
        rows: [
          [
            'Linienchart',
            'nur den Schlusskurs',
            'Ruhig, der Trend ist sofort sichtbar',
            'Verschweigt die Schwankung innerhalb des Zeitraums',
          ],
          [
            'Balkenchart (OHLC)',
            'Eröffnung, Hoch, Tief, Schluss',
            'Vollständig, platzsparend',
            'Auf einen Blick schwerer zu lesen',
          ],
          [
            'Kerzenchart',
            'dieselben vier Werte',
            'Richtung durch die Körperfarbe sofort erkennbar',
            'Verleitet dazu, jeder einzelnen Kerze Bedeutung zuzuschreiben',
          ],
        ],
      },
      {
        type: 'figure',
        figure: 'ta-kerze-aufbau',
      },
      { type: 'heading', level: 2, text: 'Körper und Docht' },
      {
        type: 'paragraph',
        text: 'Der **Körper** reicht von der Eröffnung bis zum Schluss. Liegt der Schluss höher, ist er hell oder grün; liegt er tiefer, dunkel oder rot. Die dünnen Linien darüber und darunter heißen **Dochte** oder Schatten und reichen bis zum Hoch und zum Tief.',
      },
      {
        type: 'paragraph',
        text: 'Die Aussage steckt im Verhältnis. Ein langer Körper heißt: Eine Seite hat sich von Anfang bis Ende durchgesetzt. Ein kurzer Körper mit langen Dochten heißt das Gegenteil – es wurde in beide Richtungen gezogen, und am Ende stand man fast dort, wo man begonnen hatte.',
      },
      { type: 'heading', level: 2, text: 'Der Zeitrahmen entscheidet mit' },
      {
        type: 'paragraph',
        text: 'Jede Kerze fasst einen Zeitraum zusammen: eine Minute, eine Stunde, einen Tag, eine Woche. Derselbe Kursverlauf kann im Stundenchart ein klarer Abwärtstrend und im Wochenchart eine belanglose Delle innerhalb eines Aufwärtstrends sein. Beides ist richtig.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Die häufigste Selbsttäuschung',
        items: [
          'Wer eine Meinung hat und danach den Zeitrahmen sucht, der sie bestätigt, hat nichts analysiert, sondern nur ausgewählt.',
          'Üblich ist der umgekehrte Weg: erst den Zeitrahmen festlegen, der zum eigenen Anlagehorizont passt, dann hineinsehen. Wer auf zehn Jahre anlegt, hat im Fünf-Minuten-Chart nichts verloren.',
        ],
      },
      {
        type: 'keyfacts',
        items: [
          { label: 'Vier Werte je Kerze', value: 'Eröffnung, Hoch, Tief, Schluss' },
          { label: 'Körper', value: 'Eröffnung bis Schluss' },
          { label: 'Docht', value: 'Bis zum Hoch beziehungsweise Tief' },
          { label: 'Herkunft', value: 'Japanischer Reishandel, 18. Jahrhundert' },
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 3 */
  {
    slug: 'trend-und-trendlinien',
    bereich: 'technische-analyse',
    titel: 'Trend, Trendlinie und Trendkanal',
    kurz: 'Aufwärts, abwärts, seitwärts – wie ein Trend definiert ist und wann er als gebrochen gilt.',
    kernaussage:
      'Ein Aufwärtstrend besteht aus höheren Hochs und höheren Tiefs. Fällt eines davon weg, ist er kein Aufwärtstrend mehr – unabhängig davon, wie der Kurs gerade aussieht.',
    belegart: 'beobachtung',
    dauer: 8,
    stichworte: [
      'Aufwärtstrend',
      'Abwärtstrend',
      'Seitwärtstrend',
      'Trendlinie',
      'Trendkanal',
    ],
    setztVoraus: ['charttypen-und-kerzen'],
    lernthemen: ['wann-kaufen-verkaufen'],
    inhalt: [
      {
        type: 'paragraph',
        text: '„Der Trend ist dein Freund“ gehört zu den Sätzen, die jeder kennt und kaum jemand prüft. Dabei ist ein Trend nichts Vages, sondern eine Struktur, die sich aufschreiben lässt – und genau deshalb lässt sich auch sagen, wann sie endet.',
      },
      { type: 'heading', level: 2, text: 'Die Definition' },
      {
        type: 'list',
        items: [
          '**Aufwärtstrend:** Jedes neue Hoch liegt über dem vorigen Hoch, und jedes neue Tief über dem vorigen Tief.',
          '**Abwärtstrend:** Jedes neue Tief liegt unter dem vorigen, und jedes neue Hoch ebenfalls.',
          '**Seitwärtstrend:** Hochs und Tiefs liegen ungefähr auf gleicher Höhe. Der Kurs pendelt in einer Spanne.',
        ],
      },
      { type: 'figure', figure: 'ta-trendstruktur' },
      {
        type: 'paragraph',
        text: 'Wichtig ist die Reihenfolge: Der Trend endet nicht, wenn der Kurs einmal fällt. Er endet, wenn die **Struktur** bricht – wenn also ein Tief unter das vorherige Tief rutscht. Ein Kursrückgang, der über dem letzten Tief endet, ist eine Korrektur innerhalb des Trends.',
      },
      { type: 'heading', level: 2, text: 'Die Trendlinie' },
      {
        type: 'paragraph',
        text: 'Eine Trendlinie verbindet im Aufwärtstrend die Tiefpunkte, im Abwärtstrend die Hochpunkte. Für eine Linie braucht es zwei Punkte; als bestätigt gilt sie erst mit dem dritten Berührungspunkt. Vorher ist es eine Gerade durch zwei beliebige Stellen – und durch zwei Punkte lässt sich immer eine Gerade legen.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Hier fängt die Beliebigkeit an',
        items: [
          'Zeichnet man auf Schlusskursbasis oder auf Basis der Dochte? Beides ist üblich, und die Linien liegen unterschiedlich.',
          'Bei einer logarithmischen Achse verläuft dieselbe Trendlinie anders als bei einer linearen. Über lange Zeiträume ist der Unterschied erheblich.',
          'Wer lange genug sucht, findet in jedem Chart eine Linie, die dreimal berührt wurde. Das ist der Grund, warum diese Lektion als Beobachtung und nicht als Rechenweg eingestuft ist.',
        ],
      },
      { type: 'heading', level: 2, text: 'Der Trendkanal' },
      {
        type: 'paragraph',
        text: 'Zieht man parallel zur Trendlinie eine zweite Linie durch die Gegenseite, entsteht ein **Trendkanal**. Er beschreibt die Spanne, in der sich die Bewegung bisher abgespielt hat. Das ist zunächst eine reine Beschreibung. Zur Prognose wird sie erst durch die Annahme, dass die Spanne so bleibt – und das ist die Annahme, die regelmäßig nicht hält.',
      },
      { type: 'heading', level: 2, text: 'Wann gilt ein Trend als gebrochen' },
      {
        type: 'paragraph',
        text: 'Darauf gibt es keine allgemeingültige Antwort, und das ist ein ehrlicheres Ergebnis als jede Faustregel. Üblich sind drei Filter, um kurze Fehlausbrüche auszusortieren:',
      },
      {
        type: 'list',
        items: [
          '**Schlusskursregel** – nur ein Schlusskurs jenseits der Linie zählt, kein kurzes Unterschreiten im Tagesverlauf.',
          '**Prozentfilter** – der Bruch muss ein bestimmtes Maß überschreiten, oft zwei bis drei Prozent.',
          '**Zeitfilter** – der Kurs muss mehrere Perioden jenseits der Linie schließen.',
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Was diese Filter wirklich sind',
        items: [
          'Sie sind keine Erkenntnis, sondern eine Abwägung: Ein enger Filter meldet den Bruch früh und oft falsch, ein weiter Filter spät und seltener falsch.',
          'Welche Einstellung „richtig“ ist, lässt sich nur im Rückblick sagen – und die im Rückblick beste Einstellung ist im nächsten Zeitraum meist nicht mehr die beste. Dieses Problem heißt Überanpassung und begleitet die gesamte technische Analyse.',
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 4 */
  {
    slug: 'unterstuetzung-und-widerstand',
    bereich: 'technische-analyse',
    titel: 'Unterstützung und Widerstand',
    kurz: 'Warum bestimmte Kursbereiche wiederkehren, was der Rollentausch bedeutet und wo die Grenzen liegen.',
    kernaussage:
      'Unterstützungen und Widerstände sind Zonen, keine Linien. Sie entstehen dort, wo viele Anleger denselben Einstandskurs haben.',
    belegart: 'beobachtung',
    dauer: 7,
    stichworte: ['Unterstützung', 'Widerstand', 'Support', 'Resistance', 'Rollentausch'],
    setztVoraus: ['trend-und-trendlinien'],
    lernthemen: ['wie-funktioniert-der-markt'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Manche Kursbereiche tauchen in einem Chart immer wieder auf: Der Kurs fällt bis dorthin und dreht, mehrfach, über Monate. Solche Bereiche heißen **Unterstützung**, wenn sie von oben angelaufen werden, und **Widerstand**, wenn von unten.',
      },
      { type: 'figure', figure: 'ta-unterstuetzung-widerstand' },
      { type: 'heading', level: 2, text: 'Warum es sie gibt' },
      {
        type: 'paragraph',
        text: 'Die übliche Erklärung ist keine Chartmagie, sondern Verhalten. Wer bei 100 Euro gekauft hat und mitansehen musste, wie der Kurs auf 80 fiel, wartet auf die Rückkehr zu 100, um „mit einer Null“ herauszukommen. Steigt der Kurs dorthin, treffen diese Verkäufe auf den Markt. Bei 100 Euro entsteht Angebot – der Kurs kommt nicht durch.',
      },
      {
        type: 'paragraph',
        text: 'Umgekehrt bei der Unterstützung: Wer sie beim letzten Mal verpasst hat, legt seine Kauforder dorthin. Bei Annäherung entsteht Nachfrage.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Zone statt Linie',
        items: [
          'Anleger haben nicht alle bei exakt 100,00 Euro gekauft, sondern zwischen 98 und 102. Deshalb ist eine Marke ein Bereich, kein Strich.',
          'Wer eine Marke auf zwei Nachkommastellen genau angibt, gibt eine Genauigkeit vor, die die Sache nicht hat.',
        ],
      },
      { type: 'heading', level: 2, text: 'Der Rollentausch' },
      {
        type: 'paragraph',
        text: 'Wird ein Widerstand nachhaltig überwunden, wird er der Erfahrung nach häufig zur Unterstützung – und umgekehrt. Die Erklärung ist dieselbe: Nach dem Ausbruch über 100 Euro sind die Wartenden bedient. Wer jetzt kauft, tut es über 100. Fällt der Kurs dorthin zurück, sind es diese Käufer, die nachlegen.',
      },
      { type: 'heading', level: 2, text: 'Woher Marken sonst noch kommen' },
      {
        type: 'list',
        items: [
          '**Runde Zahlen.** 100, 1.000, 20.000 Punkte. Menschen legen Order auf runde Beträge, nicht auf 9.987.',
          '**Alte Hochs und Tiefs.** Sie sind für jeden im Chart sichtbar und werden deshalb von vielen gleich gelesen.',
          '**Eröffnungslücken.** Springt ein Kurs über Nacht, bleibt eine Lücke im Chart, die oft später wieder angelaufen wird.',
          '**Viel gehandelte Kursbereiche.** Wo über lange Zeit hohe Stückzahlen umgesetzt wurden, haben viele Anleger ihren Einstand.',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Was eine Marke nicht ist',
        items: [
          'Sie ist keine Grenze, die der Kurs nicht überschreiten kann. Sie beschreibt eine Häufung von Aufträgen, und Häufungen werden aufgelöst.',
          'Fällt eine wichtige Nachricht an, ist jede Marke bedeutungslos. Der Kurs springt darüber hinweg, ohne sie zu bemerken.',
          'Je öfter eine Marke bereits gehalten hat, desto mehr Anleger warten dort – und desto größer die Bewegung, wenn sie doch fällt.',
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 5 */
  {
    slug: 'gleitende-durchschnitte',
    bereich: 'technische-analyse',
    titel: 'Gleitende Durchschnitte: SMA und EMA',
    kurz: 'Der Rechenweg, der Unterschied zwischen einfach und exponentiell, und was Kreuzungen taugen.',
    kernaussage:
      'Ein gleitender Durchschnitt glättet den Kurs, indem er ihm hinterherläuft. Diese Verzögerung ist kein Fehler, sondern der Preis für die Glättung.',
    belegart: 'definition',
    dauer: 9,
    stichworte: [
      'SMA',
      'EMA',
      'Gleitender Durchschnitt',
      '200-Tage-Linie',
      'Golden Cross',
    ],
    setztVoraus: ['trend-und-trendlinien'],
    rechner: ['zinsrechner'],
    lernthemen: ['wann-kaufen-verkaufen'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Ein Kursverlauf ist unruhig. Der gleitende Durchschnitt ist der einfachste Versuch, aus dieser Unruhe eine Linie zu machen: Statt des Tageskurses wird der Mittelwert der letzten Tage gezeichnet.',
      },
      { type: 'heading', level: 2, text: 'Der einfache Durchschnitt (SMA)' },
      {
        type: 'formula',
        expression: 'SMA(n) = (K₁ + K₂ + … + Kₙ) ÷ n',
        description:
          'K sind die letzten n Schlusskurse. Beim 200-Tage-SMA werden die letzten 200 Schlusskurse addiert und durch 200 geteilt. Jeden Tag fällt der älteste Kurs heraus und der neue kommt hinzu – daher „gleitend“.',
      },
      {
        type: 'paragraph',
        text: 'Jeder Kurs zählt gleich viel. Der Kurs von vor 200 Tagen hat dasselbe Gewicht wie der von gestern. Das ist die Stärke – die Linie ist ruhig – und zugleich die Schwäche: Ein Kurssprung wirkt sich verzögert aus, und er wirkt sich ein zweites Mal aus, wenn er 200 Tage später aus dem Fenster herausfällt.',
      },
      { type: 'heading', level: 2, text: 'Der exponentielle Durchschnitt (EMA)' },
      {
        type: 'formula',
        expression: 'EMA_heute = K_heute × α + EMA_gestern × (1 − α),   α = 2 ÷ (n + 1)',
        description:
          'Der neue Wert ist eine Mischung aus dem heutigen Kurs und dem gestrigen Durchschnitt. Beim 20-Tage-EMA ist α = 2 ÷ 21 ≈ 0,095: Der heutige Kurs geht zu rund 9,5 Prozent ein, der bisherige Verlauf zu 90,5 Prozent.',
      },
      {
        type: 'paragraph',
        text: 'Der EMA gewichtet neuere Kurse stärker. Er reagiert schneller und läuft dem Kurs näher – dafür ist er unruhiger und meldet häufiger Bewegungen, die keine sind. Anders als beim SMA fällt kein Kurs jemals ganz heraus; sein Einfluss wird nur immer kleiner.',
      },
      { type: 'figure', figure: 'ta-sma-vs-ema' },
      { type: 'heading', level: 2, text: 'Welche Periode' },
      {
        type: 'table',
        caption: 'Gebräuchliche Einstellungen und wofür sie stehen.',
        head: ['Periode', 'Üblich für', 'Verhalten'],
        rows: [
          ['20 Tage', 'kurzfristig, etwa ein Handelsmonat', 'nah am Kurs, viele Signale'],
          ['50 Tage', 'mittelfristig, gut zwei Handelsmonate', 'ausgeglichen'],
          [
            '200 Tage',
            'langfristig, gut ein Dreivierteljahr',
            'träge, gilt als Trendmaß',
          ],
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Warum ausgerechnet 200',
        items: [
          'Ein Handelsjahr hat rund 250 Tage, ein Dreivierteljahr rund 190. Die 200 ist eine runde Zahl in dieser Gegend – mehr steckt nicht dahinter.',
          'Sie wirkt trotzdem, weil sie überall abgebildet wird und viele Anleger auf dieselbe Linie schauen. Das ist der selbsterfüllende Anteil.',
        ],
      },
      { type: 'heading', level: 2, text: 'Kreuzungen' },
      {
        type: 'paragraph',
        text: 'Schneidet eine kurze Linie eine lange von unten nach oben, heißt das **goldenes Kreuz**; umgekehrt **Todeskreuz**. Meist gemeint sind der 50- und der 200-Tage-Durchschnitt.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Was eine Kreuzung tatsächlich sagt',
        items: [
          'Sie ist keine Vorhersage, sondern eine Feststellung: Der Durchschnitt der letzten 50 Tage liegt jetzt über dem der letzten 200. Das ist Vergangenheit, in zwei Zahlen zusammengefasst.',
          'Beide Linien laufen dem Kurs hinterher. Eine Kreuzung tritt deshalb regelmäßig erst ein, wenn ein guter Teil der Bewegung gelaufen ist.',
          'In Seitwärtsphasen kreuzen sich die Linien ständig hin und her. Genau dann ist das Signal am häufigsten – und am wertlosesten.',
        ],
      },
      {
        type: 'keyfacts',
        items: [
          { label: 'SMA', value: 'alle Kurse gleich gewichtet' },
          { label: 'EMA', value: 'neuere Kurse stärker gewichtet' },
          { label: 'Glättungsfaktor', value: 'α = 2 ÷ (n + 1)' },
          { label: 'Gemeinsame Eigenschaft', value: 'Beide laufen dem Kurs hinterher' },
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 6 */
  {
    slug: 'macd',
    bereich: 'technische-analyse',
    titel: 'MACD: Abstand zweier Durchschnitte',
    kurz: 'Wie der Indikator gerechnet wird, was Signallinie und Histogramm zeigen und wo er versagt.',
    kernaussage:
      'Der MACD misst den Abstand zwischen einem schnellen und einem langsamen Durchschnitt. Er ist damit ein Maß für die Beschleunigung – nicht für die Richtung.',
    belegart: 'definition',
    dauer: 8,
    stichworte: ['MACD', 'Signallinie', 'Histogramm', 'Divergenz'],
    setztVoraus: ['gleitende-durchschnitte'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Der MACD – **Moving Average Convergence Divergence** – wurde Ende der 1970er Jahre von Gerald Appel entwickelt. Der sperrige Name beschreibt genau, was er tut: Er misst, ob zwei gleitende Durchschnitte aufeinander zulaufen oder auseinanderdriften.',
      },
      { type: 'heading', level: 2, text: 'Der Rechenweg' },
      {
        type: 'formula',
        expression:
          'MACD = EMA(12) − EMA(26)\nSignallinie = EMA(9) des MACD\nHistogramm = MACD − Signallinie',
        description:
          'Drei Zahlen, in der Standardeinstellung 12, 26 und 9 Perioden. Die MACD-Linie ist die Differenz zweier exponentieller Durchschnitte, die Signallinie deren Glättung, das Histogramm der Abstand zwischen beiden.',
      },
      { type: 'figure', figure: 'ta-macd' },
      { type: 'heading', level: 2, text: 'Was die drei Teile zeigen' },
      {
        type: 'list',
        items: [
          '**MACD über null:** Der schnelle Durchschnitt liegt über dem langsamen – der Kurs ist zuletzt gestiegen.',
          '**MACD steigend:** Der Abstand wächst, die Bewegung beschleunigt sich.',
          '**MACD kreuzt die Signallinie:** Die Beschleunigung hat sich gedreht. Das ist das eigentliche Signal, das die meisten meinen.',
          '**Histogramm:** Dasselbe als Balken. Es wird kleiner, bevor sich die Linien kreuzen – deshalb gilt es als früher Hinweis.',
        ],
      },
      { type: 'heading', level: 2, text: 'Divergenz' },
      {
        type: 'paragraph',
        text: 'Als aussagekräftigster Fall gilt die **Divergenz**: Der Kurs macht ein neues Hoch, der MACD aber nicht. Die Lesart lautet, dass die Bewegung an Kraft verliert, obwohl der Kurs noch steigt.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Warum Divergenzen trügen',
        items: [
          'Eine Divergenz kann sich über Monate hinziehen, während der Kurs weiter steigt. „Zu früh“ ist an der Börse dasselbe wie „falsch“.',
          'Sie ist im Rückblick immer offensichtlich. Wer live nach ihr sucht, findet auch die drei Divergenzen, die zu nichts geführt haben.',
        ],
      },
      { type: 'heading', level: 2, text: 'Wo der MACD versagt' },
      {
        type: 'paragraph',
        text: 'Der MACD besteht aus zwei nachlaufenden Durchschnitten und läuft deshalb selbst nach. In einem klaren Trend ist er brauchbar zur Beschreibung. In einer Seitwärtsphase kreuzt er ständig und erzeugt eine Folge von Signalen, von denen die meisten sofort wieder aufgehoben werden.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Die Einstellung 12, 26, 9',
        items: [
          'Sie stammt aus einer Zeit mit sechs Handelstagen je Woche: 12 und 26 waren zwei und vier Wochen. Diese Begründung gilt seit Jahrzehnten nicht mehr.',
          'Geblieben ist die Einstellung trotzdem – weil alle sie benutzen. Wer sie ändert, sieht etwas anderes als der Rest des Marktes.',
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 7 */
  {
    slug: 'rsi-und-oszillatoren',
    bereich: 'technische-analyse',
    titel: 'RSI und andere Oszillatoren',
    kurz: 'Wie der Relative-Stärke-Index rechnet, was „überkauft“ wirklich heißt und warum die 70 keine Verkaufsmarke ist.',
    kernaussage:
      '„Überkauft“ heißt nicht „zu teuer“, sondern „zuletzt stark gestiegen“. In einem starken Trend bleibt der RSI wochenlang über 70 – und der Kurs steigt weiter.',
    belegart: 'definition',
    dauer: 8,
    stichworte: ['RSI', 'Relative Stärke', 'überkauft', 'überverkauft', 'Stochastik'],
    setztVoraus: ['gleitende-durchschnitte'],
    lernthemen: ['anlegerpsychologie'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Ein **Oszillator** ist ein Indikator, der sich zwischen zwei festen Grenzen bewegt. Der bekannteste ist der Relative-Stärke-Index, 1978 von J. Welles Wilder vorgestellt. Er läuft zwischen 0 und 100.',
      },
      { type: 'heading', level: 2, text: 'Der Rechenweg' },
      {
        type: 'formula',
        expression: 'RSI = 100 − 100 ÷ (1 + RS),   RS = Ø Gewinn ÷ Ø Verlust',
        description:
          'Über die letzten 14 Perioden werden die Tage mit Kursgewinn und die mit Kursverlust getrennt gemittelt. RS ist deren Verhältnis. Steigt der Kurs an allen 14 Tagen, ist der durchschnittliche Verlust null und der RSI erreicht 100.',
      },
      {
        type: 'paragraph',
        text: 'Der RSI misst also nichts anderes als das Verhältnis von Aufwärts- zu Abwärtsbewegung in einem Zeitfenster. Er sagt nichts über die Höhe des Kurses und nichts über den Wert des Unternehmens.',
      },
      { type: 'heading', level: 2, text: 'Die Marken 70 und 30' },
      {
        type: 'paragraph',
        text: 'Über 70 gilt als **überkauft**, unter 30 als **überverkauft**. Diese beiden Zahlen sind der am häufigsten missverstandene Teil der technischen Analyse.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Was die Marken nicht bedeuten',
        items: [
          '„Überkauft“ ist kein Verkaufssignal. Es bedeutet, dass zuletzt viel mehr Aufwärts- als Abwärtstage vorkamen – genau das, was in einem starken Aufwärtstrend passiert.',
          'In kräftigen Trends kann der RSI wochenlang über 70 bleiben. Wer bei 70 verkauft, verkauft am Anfang der Bewegung.',
          'Wilder selbst hat den RSI nicht als Ein- und Ausstiegsschalter beschrieben, sondern als Hilfsmittel zur Einordnung.',
        ],
      },
      { type: 'heading', level: 2, text: 'Was brauchbarer ist' },
      {
        type: 'list',
        items: [
          '**Divergenz.** Neues Kurshoch, aber niedrigerer RSI-Hochpunkt – dieselbe Lesart und dieselbe Schwäche wie beim MACD.',
          '**Verhalten um die Mitte.** In einem Aufwärtstrend fällt der RSI oft nur bis etwa 40 und dreht dort. Bricht er deutlich darunter, hat sich am Charakter der Bewegung etwas geändert.',
          '**Angepasste Marken.** In starken Trends werden statt 70 und 30 oft 80 und 40 verwendet. Das ist eine Anpassung an die Lage – und zugleich ein Beispiel dafür, wie beliebig die Zahlen sind.',
        ],
      },
      { type: 'heading', level: 2, text: 'Verwandte Oszillatoren' },
      {
        type: 'table',
        caption: 'Drei Oszillatoren im Vergleich.',
        head: ['Indikator', 'Misst', 'Spanne'],
        rows: [
          ['RSI', 'Verhältnis von Gewinn- zu Verlusttagen', '0 bis 100'],
          [
            'Stochastik',
            'Lage des Schlusskurses in der Spanne der letzten Perioden',
            '0 bis 100',
          ],
          ['Momentum', 'Kursdifferenz zu vor n Perioden', 'ohne feste Grenzen'],
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Warum sie sich oft ähneln',
        items: [
          'Alle drei verarbeiten dieselbe Kursreihe und unterscheiden sich nur in der Rechnung. Wer sie übereinanderlegt, sieht dreimal dasselbe und hält es für drei Bestätigungen.',
          'Zwei Indikatoren, die aus derselben Quelle stammen, bestätigen einander nicht – sie wiederholen sich.',
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 8 */
  {
    slug: 'volatilitaet-bollinger-atr',
    bereich: 'technische-analyse',
    titel: 'Schwankungsbreite: Bollinger-Bänder und ATR',
    kurz: 'Wie sich Volatilität messen lässt – und warum das der nützlichste Teil der technischen Analyse ist.',
    kernaussage:
      'Volatilität sagt nichts über die Richtung, aber viel über das Risiko. Wer weiß, wie stark ein Wert üblicherweise schwankt, kann seine Positionsgröße daran ausrichten.',
    belegart: 'definition',
    dauer: 8,
    stichworte: ['Bollinger-Bänder', 'ATR', 'Volatilität', 'Standardabweichung'],
    setztVoraus: ['gleitende-durchschnitte'],
    lernthemen: ['risiko-und-rendite'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Die meisten Indikatoren versuchen, die Richtung vorherzusagen. Die beiden hier tun das nicht: Sie messen, wie stark ein Kurs schwankt. Genau deshalb sind sie der Teil der technischen Analyse, der am wenigsten umstritten ist.',
      },
      { type: 'heading', level: 2, text: 'Bollinger-Bänder' },
      {
        type: 'formula',
        expression:
          'Mitte = SMA(20)\nOberes Band = SMA(20) + 2 × Standardabweichung\nUnteres Band = SMA(20) − 2 × Standardabweichung',
        description:
          'Um einen 20-Tage-Durchschnitt wird ein Schlauch gelegt, dessen Breite sich nach der Streuung der letzten 20 Kurse richtet. Schwankt der Kurs stark, weitet sich der Schlauch; wird es ruhig, zieht er sich zusammen.',
      },
      {
        type: 'paragraph',
        text: 'Bei einer Normalverteilung lägen rund 95 Prozent aller Werte innerhalb von zwei Standardabweichungen. Kursverteilungen sind aber nicht normal: Extreme kommen deutlich häufiger vor, als die Rechnung erwarten lässt. Die Bänder sind also eine Orientierung, keine Grenze.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Der klassische Fehlschluss',
        items: [
          '„Der Kurs berührt das obere Band, also ist er zu teuer“ ist falsch. In einem Ausbruch läuft der Kurs am oberen Band entlang, teils über Wochen.',
          'John Bollinger selbst nennt die Bänder ausdrücklich kein eigenständiges Handelssystem, sondern einen Rahmen zur Einordnung anderer Beobachtungen.',
        ],
      },
      { type: 'heading', level: 2, text: 'Die Enge vor der Bewegung' },
      {
        type: 'paragraph',
        text: 'Die bekannteste Beobachtung an den Bändern ist der **Squeeze**: Ziehen sie sich stark zusammen, war es zuletzt ungewöhnlich ruhig. Auf ruhige Phasen folgen statistisch eher bewegte – Volatilität tritt in Häufungen auf. Was die Enge nicht verrät, ist die Richtung des kommenden Ausbruchs.',
      },
      { type: 'heading', level: 2, text: 'Average True Range' },
      {
        type: 'formula',
        expression:
          'True Range = größter Wert aus:\n  Hoch − Tief\n  |Hoch − Schluss der Vorperiode|\n  |Tief − Schluss der Vorperiode|',
        description:
          'Die ATR ist der geglättete Durchschnitt dieser Spanne über meist 14 Perioden. Dass auch der Vortagesschluss eingeht, hat einen Grund: Springt ein Kurs über Nacht, ist die Tagesspanne klein, die tatsächliche Bewegung aber groß.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Wofür die ATR wirklich taugt',
        items: [
          '**Positionsgröße.** Wer bereit ist, 500 Euro zu riskieren, und der Wert schwankt täglich um 2 Euro, kann daraus ableiten, wie viele Stücke vertretbar sind.',
          '**Abstand von Absicherungen.** Eine Verlustbegrenzung innerhalb der normalen Tagesschwankung wird durch das übliche Rauschen ausgelöst, nicht durch eine echte Trendwende.',
          '**Vergleichbarkeit.** Eine Aktie mit 1 Prozent und eine mit 5 Prozent Tagesschwankung sind verschiedene Risiken, auch bei gleichem Anlagebetrag.',
        ],
      },
      {
        type: 'keyfacts',
        items: [
          { label: 'Bollinger-Bänder', value: 'SMA(20) ± 2 Standardabweichungen' },
          { label: 'ATR', value: 'geglättete Spanne über 14 Perioden' },
          { label: 'Beide sagen', value: 'wie stark – nicht wohin' },
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 9 */
  {
    slug: 'volumen',
    bereich: 'technische-analyse',
    titel: 'Volumen: die zweite Größe im Chart',
    kurz: 'Was der gehandelte Umsatz über eine Bewegung verrät – und wo er gar nichts verrät.',
    kernaussage:
      'Volumen bestätigt keine Richtung, sondern Beteiligung. Ein Ausbruch bei geringem Umsatz bedeutet, dass kaum jemand mitgegangen ist.',
    belegart: 'beobachtung',
    dauer: 7,
    stichworte: ['Volumen', 'Umsatz', 'OBV', 'Ausbruch'],
    setztVoraus: ['unterstuetzung-und-widerstand'],
    lernthemen: ['wie-funktioniert-der-markt', 'boerse'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Der Kurs sagt, worauf man sich geeinigt hat. Das **Volumen** sagt, über wie viele Stücke. Beides zusammen ist mehr als eines allein – und Volumen ist die einzige Größe neben dem Kurs, die die technische Analyse überhaupt kennt.',
      },
      { type: 'heading', level: 2, text: 'Die Grundregeln' },
      {
        type: 'list',
        items: [
          '**Steigende Kurse bei steigendem Volumen** gelten als gesund: Die Bewegung wird getragen.',
          '**Steigende Kurse bei fallendem Volumen** gelten als Warnzeichen: Es steigen immer weniger mit.',
          '**Ausbruch über eine Marke bei hohem Volumen** gilt als glaubwürdiger als einer bei geringem.',
          '**Sehr hohes Volumen nach langer Bewegung** kann eine Erschöpfung anzeigen – die letzten Zögernden steigen ein.',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Was diese Regeln nicht sind',
        items: [
          'Sie sind Erfahrungssätze, keine Gesetze. Zu jeder gibt es Gegenbeispiele, und in Untersuchungen ist ihre Trefferquote bescheiden.',
          'Zu jedem Käufer gehört ein Verkäufer. „Es wird gekauft“ ist deshalb sprachlich schief: Es wird immer gleich viel gekauft wie verkauft. Volumen misst Umschlag, nicht Kaufdruck.',
        ],
      },
      { type: 'heading', level: 2, text: 'On-Balance-Volume' },
      {
        type: 'formula',
        expression:
          'OBV_heute = OBV_gestern + Volumen  (wenn der Kurs gestiegen ist)\nOBV_heute = OBV_gestern − Volumen  (wenn er gefallen ist)',
        description:
          'Eine laufende Summe: Das Tagesvolumen wird addiert, wenn der Kurs stieg, und abgezogen, wenn er fiel. Der absolute Wert ist bedeutungslos – interessant ist nur, ob die Linie steigt oder fällt.',
      },
      { type: 'heading', level: 2, text: 'Wo Volumen nichts aussagt' },
      {
        type: 'list',
        items: [
          '**Devisen.** Der Devisenhandel läuft nicht über eine zentrale Börse. Ein Gesamtvolumen für EUR/USD gibt es nicht; Charts zeigen dort nur die Umsätze des jeweiligen Anbieters.',
          '**Verfallstage.** An Terminmarkt-Verfallstagen schnellt das Volumen hoch, weil Positionen gerollt werden. Mit der Meinung über den Wert hat das nichts zu tun.',
          '**Indexumstellungen.** Wird eine Aktie in einen Index aufgenommen, kaufen Indexfonds sie kaufen – unabhängig vom Preis.',
          '**Marktenge Werte.** Bei wenig gehandelten Aktien kann eine einzige größere Order das Bild vollständig verzerren.',
        ],
      },
    ],
  },

  /* ----------------------------------------------------------------- 10 */
  {
    slug: 'chartmuster',
    bereich: 'technische-analyse',
    titel: 'Chartmuster: Formationen und ihre Kursziele',
    kurz: 'Kopf-Schulter, Doppeltop, Dreiecke und Flaggen – Aufbau, Messregeln und Trefferquoten.',
    kernaussage:
      'Chartmuster sind benannte Formen. Ihr Wert steht und fällt damit, ob man sie erkennt, bevor sie fertig sind – und das ist der schwierige Teil.',
    belegart: 'deutung',
    dauer: 9,
    stichworte: ['Kopf-Schulter', 'Doppeltop', 'Dreieck', 'Flagge', 'Chartformation'],
    setztVoraus: ['unterstuetzung-und-widerstand', 'volumen'],
    lernthemen: ['anlegerpsychologie'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Chartmuster sind wiederkehrende Formen im Kursverlauf, denen die technische Analyse Namen und Bedeutungen gegeben hat. Man unterscheidet **Umkehrmuster**, die das Ende eines Trends anzeigen sollen, und **Fortsetzungsmuster**, die eine Pause innerhalb eines Trends beschreiben.',
      },
      { type: 'heading', level: 2, text: 'Umkehrmuster' },
      {
        type: 'table',
        caption: 'Die drei häufigsten Umkehrmuster.',
        head: ['Muster', 'Aufbau', 'Messregel'],
        rows: [
          [
            'Kopf-Schulter',
            'Drei Hochs, das mittlere am höchsten; die Tiefs dazwischen bilden die Nackenlinie',
            'Abstand Kopf zur Nackenlinie, nach unten abgetragen',
          ],
          [
            'Doppeltop',
            'Zwei Hochs auf ähnlicher Höhe mit einem Tief dazwischen',
            'Höhe des Musters, ab dem Zwischentief abgetragen',
          ],
          [
            'Doppelboden',
            'Dasselbe gespiegelt: zwei Tiefs auf ähnlicher Höhe',
            'Höhe des Musters, ab dem Zwischenhoch abgetragen',
          ],
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Der Haken an den Messregeln',
        items: [
          'Sie haben keine Begründung. Warum sollte der Kurs genau so weit fallen, wie der Kopf über der Nackenlinie stand? Eine Herleitung dafür gibt es nicht – es ist eine Konvention.',
          'Ein Muster gilt erst als bestätigt, wenn die Nackenlinie gebrochen ist. Bis dahin sieht ein abgebrochenes Kopf-Schulter-Muster genauso aus wie ein fertiges.',
        ],
      },
      { type: 'heading', level: 2, text: 'Fortsetzungsmuster' },
      {
        type: 'list',
        items: [
          '**Aufsteigendes Dreieck:** waagerechter Widerstand oben, steigende Tiefs unten. Wird als Kraftaufbau nach oben gelesen.',
          '**Absteigendes Dreieck:** waagerechte Unterstützung unten, fallende Hochs oben. Spiegelbild.',
          '**Symmetrisches Dreieck:** beide Linien laufen aufeinander zu. Richtungsneutral – hier wird nur der Ausbruch abgewartet.',
          '**Flagge und Wimpel:** eine kurze Gegenbewegung nach einer steilen Bewegung. Gilt als Verschnaufpause.',
        ],
      },
      { type: 'heading', level: 2, text: 'Was die Untersuchungen sagen' },
      {
        type: 'paragraph',
        text: 'Zu Chartmustern gibt es umfangreiche Auswertungen historischer Kursreihen. Ihr gemeinsames Ergebnis: Einzelne Muster erreichen Trefferquoten, die spürbar über dem Zufall liegen können – aber die Ergebnisse hängen stark davon ab, wie das Muster definiert wurde, in welchem Markt und in welchem Jahrzehnt gemessen wurde. Nach Handelskosten bleibt in vielen Auswertungen wenig übrig.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Warum das Erkennen das eigentliche Problem ist',
        items: [
          'Ein Rechner, der Muster nach festen Regeln sucht, findet andere als ein Mensch, der auf den Chart schaut. Der Mensch findet mehr – weil er großzügiger ist.',
          'Diese Großzügigkeit ist der Grund, warum Auswertungen so weit auseinandergehen: Sie messen nicht dasselbe.',
          'Für die eigene Praxis heißt das: Wer ein Muster erkennt, sollte aufschreiben, woran genau – und beim nächsten Mal an derselben Regel festhalten.',
        ],
      },
    ],
  },

  /* ----------------------------------------------------------------- 11 */
  {
    slug: 'kerzenmuster',
    bereich: 'technische-analyse',
    titel: 'Kerzenmuster',
    kurz: 'Hammer, Engulfing, Doji – was einzelne Kerzen aussagen und warum der Zusammenhang alles entscheidet.',
    kernaussage:
      'Ein Kerzenmuster ohne den Verlauf davor ist bedeutungslos. Derselbe Hammer ist am Ende eines Abwärtstrends etwas anderes als mitten in einer Seitwärtsphase.',
    belegart: 'deutung',
    dauer: 6,
    stichworte: ['Hammer', 'Engulfing', 'Doji', 'Kerzenmuster'],
    setztVoraus: ['charttypen-und-kerzen'],
    lernthemen: ['anlegerpsychologie'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Kerzenmuster stammen aus dem japanischen Reishandel und wurden in den 1990er Jahren im Westen bekannt. Sie deuten den Verlauf einer oder weniger Perioden – deutlich kürzer als die Chartmuster der vorigen Lektion.',
      },
      { type: 'heading', level: 2, text: 'Drei Muster und ihre Lesart' },
      {
        type: 'table',
        caption: 'Aufbau und übliche Deutung.',
        head: ['Muster', 'Aussehen', 'Lesart'],
        rows: [
          [
            'Hammer',
            'kleiner Körper oben, langer unterer Docht',
            'Es wurde tief verkauft, aber bis zum Schluss zurückgekauft',
          ],
          [
            'Engulfing',
            'eine Kerze, deren Körper den der Vorkerze vollständig umschließt',
            'Die Gegenseite hat die Kontrolle übernommen',
          ],
          [
            'Doji',
            'Eröffnung und Schluss fast gleich, Dochte in beide Richtungen',
            'Unentschieden – niemand hat sich durchgesetzt',
          ],
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Warum der Zusammenhang alles ist',
        items: [
          'Ein Hammer nach einem langen Abwärtstrend gilt als Hinweis auf eine Wende. Derselbe Hammer mitten in einer ruhigen Seitwärtsphase ist ein Tag wie jeder andere.',
          'Kerzenmuster kommen sehr häufig vor. In einem Jahreschart finden sich Dutzende Hämmer – die allermeisten ohne jede Folge.',
          'Bei Werten, die über Nacht handeln, hängt die Kerzenform davon ab, wann der Anbieter den Tag beginnen lässt. Eine andere Zeitzone ergibt andere Muster aus denselben Kursen.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Der nützliche Kern bleibt trotzdem: Eine Kerze mit langem Docht sagt, dass ein Kursbereich getestet und nicht gehalten wurde. Das ist eine Beobachtung über tatsächliches Verhalten – und sie ist etwas anderes als der Anspruch, daraus den nächsten Tag abzuleiten.',
      },
    ],
  },

  /* ----------------------------------------------------------------- 12 */
  {
    slug: 'fibonacci-retracements',
    bereich: 'technische-analyse',
    titel: 'Fibonacci-Retracements',
    kurz: 'Woher 38,2, 50 und 61,8 kommen, wie tief welche Welle üblicherweise zurückläuft – und was davon zu halten ist.',
    kernaussage:
      'Die Fibonacci-Verhältnisse sind mathematisch korrekt hergeleitet. Dass Kurse sich an sie halten sollten, ist eine Behauptung ohne Begründung.',
    belegart: 'deutung',
    dauer: 9,
    stichworte: [
      'Fibonacci',
      'Retracement',
      'Goldener Schnitt',
      '61,8 Prozent',
      'Projektion',
      'Regel des Wechsels',
    ],
    setztVoraus: ['trend-und-trendlinien'],
    lernthemen: ['wann-kaufen-verkaufen'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Die Fibonacci-Folge beginnt mit 0 und 1; jede weitere Zahl ist die Summe der beiden vorigen: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89. Teilt man eine Zahl durch ihre Nachfolgerin, nähert sich das Ergebnis 0,618 – dem **goldenen Schnitt**.',
      },
      { type: 'heading', level: 2, text: 'Die üblichen Marken' },
      {
        type: 'table',
        caption: 'Wie die Werte zustande kommen.',
        head: ['Marke', 'Herkunft'],
        rows: [
          ['23,6 %', 'Zahl geteilt durch die drittnächste (etwa 21 ÷ 89)'],
          ['38,2 %', 'Zahl geteilt durch die übernächste (etwa 34 ÷ 89)'],
          ['50,0 %', 'keine Fibonacci-Zahl – schlicht die Hälfte'],
          ['61,8 %', 'Zahl geteilt durch die nächste (etwa 55 ÷ 89)'],
          ['78,6 %', 'Wurzel aus 0,618'],
        ],
      },
      {
        type: 'paragraph',
        text: 'In der Anwendung wird eine abgeschlossene Bewegung genommen – vom Tief zum Hoch – und diese Prozentsätze der Strecke als waagerechte Linien eingezeichnet. Die Erwartung: Eine Gegenbewegung endet an einer dieser Marken.',
      },

      { type: 'heading', level: 2, text: 'Welche Welle wie tief zurückläuft' },
      {
        type: 'paragraph',
        text: 'Wer die Wellenzählung benutzt – sie steht in der nächsten Lektion –, findet in der Literatur für jede Welle einen erwarteten Rücklauf. Die folgenden Bereiche stammen aus der Standarddarstellung von Frost und Prechter und sind seither weitgehend unverändert weitergereicht worden.',
      },
      {
        type: 'table',
        caption:
          'Übliche Erwartung je Welle. Bezugsstrecke ist jeweils die Welle in der letzten Spalte.',
        head: ['Welle', 'Üblicher Bereich', 'Häufig genannt', 'gemessen an'],
        rows: [
          ['Welle 2', '50 – 78,6 %', '61,8 %', 'Welle 1'],
          ['Welle 4', '23,6 – 50 %', '38,2 %', 'Welle 3'],
          ['Welle B', '38,2 – 78,6 %', '50 %', 'Welle A'],
          ['Welle 3 (Ziel)', '161,8 – 261,8 %', '161,8 %', 'Welle 1'],
          ['Welle 5 (Ziel)', '61,8 – 100 %', '100 %', 'Welle 1'],
          ['Welle C (Ziel)', '100 – 161,8 %', '100 %', 'Welle A'],
        ],
      },
      {
        type: 'paragraph',
        text: 'Die beiden Rücklaufwellen hängen zusammen. Die **Regel des Wechsels** besagt: Läuft Welle 2 tief und schnell zurück, ist Welle 4 meist flach und zäh – und umgekehrt. Wer die zweite Welle gesehen hat, hat damit einen Anhaltspunkt für die vierte, und nur für diesen Zusammenhang gibt es in der Wellenlehre überhaupt eine Begründung: Nach einem tiefen Rücksetzer ist weniger Anlass für einen zweiten.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Warum hier keine Wahrscheinlichkeiten stehen',
        items: [
          'Diese Bereiche sind Faustregeln aus der Literatur, keine gemessenen Häufigkeiten. Wer „Welle 2 endet zu 70 Prozent bei 61,8“ liest, sollte nach der Untersuchung fragen, aus der die Zahl stammt – es gibt keine allgemein anerkannte.',
          'Eine solche Häufigkeit ließe sich auch schwer bilden: Die Wellenzählung steht erst im Rückblick fest. Man müsste zählen, wie oft eine Welle 2 an einer Marke endete – aber als Welle 2 gilt eine Bewegung meist erst, nachdem sie dort geendet hat.',
          'Nimmt man die Bereiche zusammen, sind 23,6 bis 78,6 Prozent abgedeckt. Ein Rücklauf, der nicht in irgendeine Zeile passt, ist die Ausnahme.',
        ],
      },

      { type: 'heading', level: 2, text: 'Zum Übernehmen ins Chartprogramm' },
      {
        type: 'formula',
        expression:
          'Retracement:  23,6   38,2   50,0   61,8   78,6\nProjektion:   100,0   127,2   161,8   261,8',
        description:
          'Diese Werte trägt man einmal als Voreinstellung des Fibonacci-Werkzeugs ein; die meisten Programme erwarten sie als Liste. 127,2 ist die Wurzel aus 1,618 und gehört nur zu den Projektionen, nicht zu den Rücklaufmarken.',
      },
      {
        type: 'list',
        items: [
          '**Retracement** wird vom Anfang zum Ende der Bewegung aufgezogen – für einen Rücklauf in einem Aufwärtstrend also vom Tief zum Hoch. Die Marke 0 liegt am Ende, 100 am Anfang.',
          '**Projektion** braucht drei Punkte statt zwei und dient den Zielen aus der Tabelle: Welle 3 aus Welle 1, Welle C aus Welle A.',
          'Wer mit den Wellen nichts anfangen kann, kommt mit drei Marken aus – 38,2, 50 und 61,8. Die übrigen zwei erhöhen vor allem die Zahl der Linien, an denen sich hinterher etwas erklären lässt.',
        ],
      },

      {
        type: 'callout',
        variant: 'warning',
        title: 'Die drei Einwände',
        items: [
          '**Keine Begründung.** Dass die Folge in Sonnenblumen und Tannenzapfen auftaucht, ist gut belegt. Warum Aktienkurse sich daran halten sollten, hat niemand je hergeleitet.',
          '**Zu viele Linien.** Mit fünf Marken plus 0 und 100 Prozent ist der Bereich so dicht bedeckt, dass fast jede Umkehr in der Nähe einer Linie liegt.',
          '**Beliebiger Ausgangspunkt.** Welches Tief und welches Hoch man nimmt, entscheidet, wo alle Linien liegen. Bei anderer Wahl ergibt sich ein völlig anderes Bild.',
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Warum sie trotzdem manchmal wirken',
        items: [
          'Weil viele dieselben Linien einzeichnen und dort ihre Order platzieren. Bei 61,8 Prozent entsteht Nachfrage, weil dort Nachfrage erwartet wird.',
          'Das macht die Marke real, aber nicht aus dem Grund, den ihre Anhänger nennen. Es ist eine Verabredung, keine Naturkonstante.',
        ],
      },
    ],
  },

  /* ----------------------------------------------------------------- 13 */
  {
    slug: 'elliott-wellen',
    bereich: 'technische-analyse',
    titel: 'Die Elliott-Wellen-Theorie',
    kurz: 'Fünf Impuls- und drei Korrekturwellen, die drei festen Regeln – und das Problem der Unwiderlegbarkeit.',
    kernaussage:
      'Die Theorie hat drei harte Regeln und beliebig viele Ausnahmen. Genau das macht sie im Rückblick überzeugend und für die Vorhersage nahezu unbrauchbar.',
    belegart: 'deutung',
    dauer: 10,
    stichworte: ['Elliott', 'Wellentheorie', 'Impulswelle', 'Korrekturwelle', 'Fraktal'],
    setztVoraus: ['trend-und-trendlinien', 'fibonacci-retracements'],
    lernthemen: ['anlegerpsychologie'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Ralph Nelson Elliott, ein amerikanischer Buchhalter, veröffentlichte 1938 die Beobachtung, dass sich Kursverläufe in wiederkehrenden Wellen bewegen. Seine Theorie ist die ehrgeizigste der technischen Analyse: Sie beansprucht, den gesamten Verlauf zu ordnen – von Minuten bis zu Jahrhunderten.',
      },
      { type: 'heading', level: 2, text: 'Der Grundzyklus' },
      {
        type: 'paragraph',
        text: 'Eine vollständige Bewegung besteht aus acht Wellen: fünf in Trendrichtung, die **Impulswellen** 1 bis 5, und drei dagegen, die **Korrekturwellen** A, B und C.',
      },
      { type: 'figure', figure: 'ta-elliott-zyklus' },
      {
        type: 'list',
        items: [
          '**Welle 1** – die erste Bewegung. Wird meist noch für eine Gegenbewegung im alten Trend gehalten.',
          '**Welle 2** – Rücksetzer. Viele halten den alten Trend für zurück.',
          '**Welle 3** – üblicherweise die längste und dynamischste. Hier wird die Wende allgemein erkannt.',
          '**Welle 4** – Verschnaufpause, oft seitwärts und zäh.',
          '**Welle 5** – letzter Schub, häufig von schwächerer Beteiligung getragen.',
          '**A, B, C** – die Korrektur des gesamten Aufbaus.',
        ],
      },
      { type: 'heading', level: 2, text: 'Die drei Regeln' },
      {
        type: 'paragraph',
        text: 'Anders als bei vielen Chartmustern gibt es hier harte Bedingungen. Wird eine verletzt, ist die Zählung falsch:',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'Welle 2 darf den Startpunkt von Welle 1 nicht unterschreiten.',
          'Welle 3 ist nie die kürzeste der drei Impulswellen 1, 3 und 5.',
          'Welle 4 darf nicht in den Kursbereich von Welle 1 hineinreichen.',
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Der fraktale Aufbau',
        items: [
          'Jede Welle besteht selbst wieder aus Wellen: Welle 1 zerfällt in fünf kleinere, Welle 2 in drei. Dasselbe Muster wiederholt sich auf jeder Zeitebene.',
          'Elliott gab neun Ebenen an, vom „Grand Supercycle“ über Jahrhunderte bis zur „Subminuette“ von Minuten.',
          'Der Zusammenhang mit Fibonacci ist eingebaut: Korrekturen sollen typischerweise 38,2 oder 61,8 Prozent der vorigen Welle betragen.',
        ],
      },
      { type: 'heading', level: 2, text: 'Der Einwand' },
      {
        type: 'paragraph',
        text: 'Die Kritik richtet sich nicht gegen einzelne Regeln, sondern gegen den Bau der Theorie. Sie kennt neben den drei Regeln zahlreiche zulässige Sonderformen: gestreckte Wellen, verkürzte fünfte Wellen, Dreiecke in Welle 4, doppelte und dreifache Korrekturen. Zu fast jedem Verlauf lässt sich damit eine gültige Zählung finden.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Woran man das erkennt',
        items: [
          'Zwei erfahrene Anwender zählen denselben Chart häufig unterschiedlich – und beide Zählungen sind regelkonform.',
          'Erweist sich eine Prognose als falsch, wird die Zählung angepasst statt verworfen. Eine Theorie, die durch keine Beobachtung widerlegt werden kann, sagt nichts über die Zukunft.',
          'Elliott selbst hielt die Wellen für ein Naturgesetz menschlichen Verhaltens. Belege dafür, die über die nachträgliche Einordnung hinausgehen, gibt es nicht.',
        ],
      },
      { type: 'heading', level: 2, text: 'Was sich mitnehmen lässt' },
      {
        type: 'paragraph',
        text: 'Ohne den Anspruch auf Vorhersage bleibt eine brauchbare Beschreibung: Märkte bewegen sich selten in geraden Linien, sondern in Schüben mit Gegenbewegungen. Dass nach einem starken Anstieg eine Korrektur folgt und der Trend danach weiterlaufen kann, ist eine nützliche Erwartungshaltung. Sie braucht nur keine acht nummerierten Wellen.',
      },
      {
        type: 'quote',
        text: 'Wenn eine Zählung nicht mehr passt, war es die falsche Zählung – nie die falsche Theorie.',
        source: 'Zusammenfassung des Haupteinwands gegen die Wellentheorie',
      },
    ],
  },
  {
    slug: 'elliott-impulse',
    bereich: 'technische-analyse',
    titel: 'Impulswellen und ihre Sonderformen',
    kurz: 'Streckung, verkürzte fünfte Welle, führende und endende Diagonale – und was jede Welle im Einzelnen kennzeichnet.',
    kernaussage:
      'Der Fünferzug hat drei harte Regeln und vier zugelassene Abweichungen. Wer die Abweichungen kennt, zählt sauberer – und sieht zugleich, warum kaum eine Zählung eindeutig bleibt.',
    belegart: 'deutung',
    dauer: 12,
    stichworte: [
      'Impulswelle',
      'Extension',
      'Streckung',
      'Truncation',
      'Diagonale',
      'Keil',
      'Elliott',
    ],
    setztVoraus: ['elliott-wellen'],
    lernthemen: ['anlegerpsychologie'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Der Fünferzug ist der Baustein, aus dem die Theorie alles Übrige zusammensetzt. Die drei Regeln aus der vorigen Lektion gelten für ihn ausnahmslos – aber sie legen nur fest, was **verboten** ist. Wie ein Impuls aussehen darf, ist damit noch weit offen, und die zugelassenen Formen sind der Grund, warum zwei Anwender denselben Chart verschieden auszählen.',
      },
      { type: 'heading', level: 2, text: 'Was jede einzelne Welle kennzeichnet' },
      {
        type: 'paragraph',
        text: 'Die fünf Wellen unterscheiden sich nicht nur in der Richtung, sondern in Charakter, Beteiligung und typischer Länge. Diese Beschreibungen stammen aus der Literatur und sind Erfahrungssätze, keine Messwerte.',
      },
      {
        type: 'table',
        caption:
          'Die fünf Impulswellen im Einzelnen. Die Verhältnisse sind Erwartungswerte, keine gemessenen Häufigkeiten.',
        head: ['Welle', 'Aufbau', 'Übliches Verhältnis', 'Was sie kennzeichnet'],
        rows: [
          [
            '1',
            'fünfteilig',
            'Maßstab für alles Weitere',
            'Wird meist noch für eine Gegenbewegung im alten Trend gehalten. Beteiligung gering, Nachrichtenlage schlecht.',
          ],
          [
            '2',
            'dreiteilig',
            '50 / 61,8 / 78,6 % von Welle 1',
            'Scharf und schnell. Holt oft fast die gesamte Welle 1 zurück – darf ihren Startpunkt aber nie unterschreiten.',
          ],
          [
            '3',
            'fünfteilig',
            '1,618 / 2,618 × Welle 1',
            'Meist die längste und steilste. Hier wird die Wende allgemein erkannt; höchste Beteiligung, deutlichste Kurslücken.',
          ],
          [
            '4',
            'dreiteilig',
            '23,6 / 38,2 % von Welle 3',
            'Flach und zäh, oft ein Dreieck. Darf nicht in den Kursbereich von Welle 1 reichen.',
          ],
          [
            '5',
            'fünfteilig',
            '0,618 × (Start 1 bis Ende 3) oder ≈ Welle 1',
            'Letzter Schub, häufig von schwächerer Beteiligung getragen. Abweichungen zwischen Kurs und Schwungindikatoren sind hier typisch.',
          ],
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Was diese Tabelle nicht ist',
        items: [
          'Keine Trefferquote. Es gibt keine belastbare Erhebung darüber, wie oft Welle 3 tatsächlich das 1,618-fache erreicht.',
          'Keine Reihenfolge der Prüfung. Welche Welle man vor sich hat, entscheidet die Zählung – und die steht meist erst fest, wenn die Bewegung vorbei ist.',
          'Kein Ersatz für eine Absicherung. Ein verfehltes Ziel widerlegt die Zählung nicht, es verschiebt sie nur.',
        ],
      },
      { type: 'heading', level: 2, text: 'Die Streckung' },
      {
        type: 'paragraph',
        text: 'Eine der drei Impulswellen 1, 3 oder 5 ist üblicherweise deutlich länger als die beiden anderen – sie ist **gestreckt**. Die beiden übrigen ähneln einander dann in Länge und Dauer. Am häufigsten trifft es Welle 3.',
      },
      { type: 'figure', figure: 'ta-elliott-extension' },
      {
        type: 'paragraph',
        text: 'Praktisch bedeutsam ist das, weil eine gestreckte Welle sich beim Auszählen in fünf eigene Unterwellen zerlegen lässt – aus einer Welle werden neun sichtbare Abschnitte. Wer die Streckung übersieht, zählt diese neun als eine eigene Sequenz und liegt eine ganze Ebene daneben.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Die Faustregel zur Streckung',
        items: [
          'Ist Welle 3 gestreckt, ähneln Welle 1 und Welle 5 einander in der Länge – die häufigste Konstellation.',
          'War Welle 1 bereits gestreckt, wird Welle 5 selten noch einmal gestreckt.',
          'Eine gestreckte Welle 5 nach bereits gestreckter Welle 3 gilt als Zeichen von Übertreibung und wird meist rasch und tief korrigiert.',
        ],
      },
      { type: 'heading', level: 2, text: 'Die verkürzte fünfte Welle' },
      {
        type: 'paragraph',
        text: 'Welle 5 überbietet das Hoch von Welle 3 nicht – der Impuls endet trotzdem. Diese Form heißt **Truncation** oder verkürzte fünfte Welle und ist zulässig, aber selten.',
      },
      { type: 'figure', figure: 'ta-elliott-verkuerzung' },
      {
        type: 'paragraph',
        text: 'Voraussetzung ist, dass Welle 5 in sich vollständig fünfteilig ist. Fehlt ihr der fünfte Unterabschnitt, liegt keine Verkürzung vor, sondern eine unfertige Bewegung. Die Verkürzung gilt als Hinweis auf ungewöhnliche Schwäche; die anschließende Korrektur wird üblicherweise als kräftig erwartet.',
      },
      { type: 'heading', level: 2, text: 'Die Diagonalen' },
      {
        type: 'paragraph',
        text: 'Ein **Keil**, in dem sich die Begrenzungslinien annähern. Zwei Fassungen gibt es, und sie stehen an genau entgegengesetzten Stellen der Sequenz.',
      },
      { type: 'figure', figure: 'ta-elliott-diagonale' },
      {
        type: 'list',
        items: [
          '**Führende Diagonale** – steht in Welle 1 oder in Welle A, also am Anfang einer Bewegung.',
          '**Endende Diagonale** – steht in Welle 5 oder in Welle C, also am Schluss.',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Die einzige Ausnahme von der dritten Regel',
        items: [
          'In der endenden Diagonale darf Welle 4 in den Kursbereich von Welle 1 hineinreichen. Sonst ist genau das ein Ausschlusskriterium.',
          'Damit fällt für diese Form die am leichtesten prüfbare der drei Regeln weg – und ausgerechnet dort, wo sie am meisten gebraucht würde.',
          'Wer eine Überlappung sieht, hat zwei Möglichkeiten: Die Zählung ist falsch, oder es ist eine endende Diagonale. Zwischen beidem entscheidet nichts Nachprüfbares.',
        ],
      },
      {
        type: 'paragraph',
        text: 'In beiden Diagonalen sind die Teilwellen dreiteilig statt fünfteilig. Das unterscheidet sie im Aufbau von jedem gewöhnlichen Impuls und ist beim Auszählen der zuverlässigste Anhaltspunkt – zuverlässiger jedenfalls als die Keilform, die sich in vielen Verläufen einzeichnen lässt.',
      },
      { type: 'heading', level: 2, text: 'Der Wechsel' },
      {
        type: 'paragraph',
        text: 'Elliott erwartete, dass sich die beiden Korrekturwellen innerhalb eines Impulses im Charakter unterscheiden: Ist Welle 2 ein scharfer, kurzer Zickzack, wird Welle 4 flach und lang – und umgekehrt.',
      },
      { type: 'figure', figure: 'ta-elliott-wechsel' },
      {
        type: 'paragraph',
        text: 'Das ist die einzige Aussage der Theorie, die eine Zählung **im Voraus** einschränkt statt sie nachträglich zu rechtfertigen. Sie ist trotzdem keine der drei Regeln: Eine Zählung, die den Wechsel verletzt, gilt nicht als ungültig.',
      },
      {
        type: 'quote',
        text: 'Eine Form, die alles zulässt, schließt nichts aus. Der Wechsel ist die eine Stelle, an der die Theorie sich festlegt – und ausgerechnet dort verbindlich ist sie nicht.',
        source: 'Zur Stellung der Alternation im Regelwerk',
      },
    ],
  },
  {
    slug: 'elliott-korrekturen',
    bereich: 'technische-analyse',
    titel: 'Korrekturformen: Zickzack, Flat und Dreieck',
    kurz: 'Zickzack, Flat in drei Fassungen, drei Dreiecksformen – und die zusammengesetzten Korrekturen W-X-Y und W-X-Y-X-Z.',
    kernaussage:
      'Die Korrekturen sind der Teil der Theorie mit den meisten zugelassenen Formen. Genau deshalb lässt sich fast jede Seitwärtsphase im Nachhinein regelkonform auszählen.',
    belegart: 'deutung',
    dauer: 14,
    stichworte: [
      'Korrektur',
      'Zickzack',
      'Flat',
      'Dreieck',
      'WXY',
      'WXYXZ',
      'Kombination',
      'Elliott',
    ],
    setztVoraus: ['elliott-wellen', 'elliott-impulse'],
    lernthemen: ['anlegerpsychologie'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Der Impuls kennt eine Grundform und vier Abweichungen. Die Korrektur kennt drei Grundformen, von denen zwei je drei Fassungen haben – und darüber hinaus die Möglichkeit, zwei oder drei fertige Korrekturen aneinanderzuhängen. Das ist der Teil der Theorie, an dem sich der Haupteinwand am deutlichsten zeigt.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Die Kurzschrift des Aufbaus',
        items: [
          'Eine Zahlenfolge wie 5-3-5 beschreibt, aus wie vielen Unterwellen die einzelnen Abschnitte bestehen.',
          '5-3-5 heißt: Welle A ist fünfteilig, Welle B dreiteilig, Welle C fünfteilig. Das ist der Zickzack.',
          '3-3-5 heißt: A und B je dreiteilig, C fünfteilig. Das ist die Flat.',
          '3-3-3-3-3 heißt: fünf Abschnitte, jeder dreiteilig. Das ist das Dreieck.',
        ],
      },
      { type: 'heading', level: 2, text: 'Der Zickzack (5-3-5)' },
      {
        type: 'paragraph',
        text: 'Die scharfe Korrekturform. Welle A fällt deutlich, Welle B holt einen Teil zurück, Welle C läuft klar unter das Tief von A.',
      },
      { type: 'figure', figure: 'ta-elliott-zigzag' },
      {
        type: 'list',
        items: [
          '**Welle B** holt üblicherweise 38,2 bis 61,8 Prozent von A zurück. Läuft sie über 61,8 Prozent hinaus, spricht das gegen einen Zickzack.',
          '**Welle C** entspricht häufig der Länge von A oder dem 1,618-fachen davon.',
          'Der Zickzack ist die typische Gestalt der **Welle 2** und der **Welle A**.',
        ],
      },
      { type: 'heading', level: 2, text: 'Die Flat (3-3-5) in drei Fassungen' },
      {
        type: 'paragraph',
        text: 'Die seitwärts verlaufende Korrekturform. Alle drei Fassungen haben denselben Aufbau; unterschieden werden sie ausschließlich daran, **wo B und C relativ zum Startpunkt enden**.',
      },
      { type: 'figure', figure: 'ta-elliott-flat' },
      {
        type: 'table',
        caption:
          'Die drei Flat-Fassungen. Maßstab ist jeweils der Startpunkt von Welle A.',
        head: ['Fassung', 'Welle B endet', 'Welle C endet', 'Was daraus folgt'],
        rows: [
          [
            'Normale Flat',
            'ungefähr am Startpunkt (90 – 105 % von A)',
            'ungefähr auf Höhe des Tiefs von A',
            'Gleichgewicht. Der Trend ist weder bestätigt noch gebrochen.',
          ],
          [
            'Erweiterte Flat',
            'über den Startpunkt hinaus (über 105 % von A)',
            'unter dem Tief von A',
            'Die häufigste der drei. Das falsche Ausbrechen in Welle B fängt viele auf dem falschen Fuß.',
          ],
          [
            'Laufende Flat',
            'über den Startpunkt hinaus',
            'über dem Tief von A',
            'Die Korrektur bleibt in Trendrichtung zurück – ein Zeichen für einen sehr starken übergeordneten Trend.',
          ],
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Warum die erweiterte Flat so unangenehm ist',
        items: [
          'Welle B läuft über den Ausgangspunkt hinaus. Wer nach Ausbrüchen handelt, wird hier planmäßig eingesammelt.',
          'Erst Welle C zeigt, dass es kein Ausbruch war – dann liegt der Kurs bereits unter dem Tief von A.',
          'Im Rückblick ist die Form eindeutig. Währenddessen ist sie von einem echten Ausbruch nicht zu unterscheiden.',
        ],
      },
      { type: 'heading', level: 2, text: 'Das Dreieck (3-3-3-3-3)' },
      {
        type: 'paragraph',
        text: 'Fünf Abschnitte A bis E, jeder dreiteilig. Ein Dreieck steht fast ausschließlich in **Welle 4** oder in **Welle B** – also unmittelbar vor der letzten Bewegung einer Sequenz.',
      },
      { type: 'figure', figure: 'ta-elliott-dreieck' },
      {
        type: 'table',
        caption: 'Die Dreiecksformen und wo sie auftreten.',
        head: ['Form', 'Begrenzungen', 'Häufigkeit'],
        rows: [
          [
            'Kontrahierend',
            'laufen beide aufeinander zu',
            'die weitaus häufigste Fassung',
          ],
          [
            'Barrier',
            'eine Seite bleibt waagerecht',
            'seltener; im Ergebnis dem kontrahierenden ähnlich',
          ],
          [
            'Expandierend',
            'laufen auseinander, die Schwankung nimmt zu',
            'selten und schwer zu handeln',
          ],
          [
            'Laufend',
            'Welle B überschreitet den Startpunkt von A',
            'selten; gilt als besonders trendstark',
          ],
        ],
      },
      {
        type: 'paragraph',
        text: 'Die Position ist der eigentliche Nutzen dieser Form: Wer ein Dreieck sicher erkennt, weiß, dass **noch genau eine Bewegung** in Trendrichtung aussteht. Nach ihr ist die Sequenz abgeschlossen. Das ist eine der wenigen Stellen, an denen die Theorie eine überprüfbare Erwartung liefert.',
      },
      { type: 'heading', level: 2, text: 'Die Kombinationen: W-X-Y und W-X-Y-X-Z' },
      {
        type: 'paragraph',
        text: 'Reicht eine einzelne Korrektur nicht aus, um die Zeit zu füllen, hängt die Theorie zwei oder drei davon aneinander. Die Verbindungsstücke heißen **X-Wellen**.',
      },
      { type: 'figure', figure: 'ta-elliott-kombination' },
      {
        type: 'table',
        caption: 'Die zusammengesetzten Korrekturen.',
        head: ['Bezeichnung', 'Aufbau', 'Bestandteile'],
        rows: [
          [
            'Doppelte Korrektur',
            'W – X – Y',
            'zwei Korrekturmuster, verbunden durch eine X-Welle',
          ],
          [
            'Dreifache Korrektur',
            'W – X – Y – X – Z',
            'drei Korrekturmuster, verbunden durch zwei X-Wellen',
          ],
        ],
      },
      {
        type: 'list',
        items: [
          '**W, Y und Z** sind jeweils vollständige Korrekturen für sich – ein Zickzack, eine Flat oder ein Dreieck.',
          '**X** ist die Verbindungswelle. Sie ist selbst dreiteilig und läuft gegen die Richtung der Korrektur.',
          'Ein Dreieck steht in einer Kombination fast immer an **letzter** Stelle, also als Y oder Z.',
          'Mehr als drei Bestandteile sieht die Theorie nicht vor. Das ist die einzige Begrenzung dieser Bauform.',
        ],
      },
      {
        type: 'heading',
        level: 3,
        text: 'Die Sonderregeln der Kombinationen',
      },
      {
        type: 'table',
        caption:
          'Was innerhalb einer Kombination zulässig ist und was nicht. Diese Regeln grenzen die Bauform ein – ohne sie wäre sie beliebig.',
        head: ['Regel', 'Was sie besagt'],
        rows: [
          [
            'Höchstens drei Bestandteile',
            'W-X-Y und W-X-Y-X-Z sind die einzigen Formen. Eine vierte Korrektur anzuhängen ist nicht vorgesehen.',
          ],
          [
            'Kein Zickzack zweimal hintereinander',
            'Zwei aufeinanderfolgende Zickzacks gelten nicht als Kombination, sondern als doppelter Zickzack – ein eigener Fall mit eigener Zählung.',
          ],
          [
            'Das Dreieck steht am Ende',
            'Tritt ein Dreieck in einer Kombination auf, dann als letzter Bestandteil – also als Y oder Z, nie als W.',
          ],
          [
            'X ist selbst eine Korrektur',
            'Die Verbindungswelle ist dreiteilig und kann jede Korrekturform annehmen, meist einen Zickzack.',
          ],
          [
            'X bleibt kürzer als die Nachbarn',
            'Läuft X weiter zurück als die Korrektur davor, ist es keine Verbindungswelle – dann liegt eine andere Zählung vor.',
          ],
          [
            'Die Bestandteile ähneln sich in der Größe',
            'W, Y und Z sind üblicherweise etwa gleich lang. Ein deutlich größerer Bestandteil spricht gegen die Kombination.',
          ],
        ],
      },
      {
        type: 'paragraph',
        text: 'Die praktisch wichtigste dieser Regeln ist die letzte: **Ähneln sich W, Y und Z nicht in der Größe, stimmt die Zählung vermutlich nicht.** Sie ist die einzige, die sich während der laufenden Bewegung prüfen lässt – alle übrigen setzen voraus, dass die Formen bereits fertig sind.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Hier wird der Haupteinwand greifbar',
        items: [
          'Eine Kombination erlaubt es, drei beliebige Korrekturformen in beliebiger Reihenfolge aneinanderzuhängen.',
          'Bei drei Grundformen mit insgesamt sieben Fassungen ergibt das mehrere hundert regelkonforme Verläufe für dieselbe Seitwärtsphase.',
          'Damit lässt sich praktisch jede ausgedehnte Seitwärtsbewegung im Nachhinein gültig auszählen – und genau deshalb sagt eine solche Zählung über die Zukunft wenig.',
        ],
      },
      { type: 'heading', level: 2, text: 'Was sich davon behalten lässt' },
      {
        type: 'paragraph',
        text: 'Zwei Dinge sind auch ohne Zählung brauchbar. Erstens die Beobachtung, dass Korrekturen in **drei** Abschnitten verlaufen, Trendbewegungen dagegen in **fünf** – wer nach einem Rücksetzer die Struktur zählt, hat einen Anhaltspunkt, ob der Trend weiterläuft oder gedreht hat. Zweitens die Erwartung, dass ein Dreieck vor der letzten Bewegung steht.',
      },
      {
        type: 'paragraph',
        text: 'Beides sind Erfahrungssätze und keine Gesetzmäßigkeiten. Sie taugen als Erwartungshaltung, nicht als Grundlage für eine Position ohne Absicherung.',
      },
    ],
  },
  {
    slug: 'elliott-wellenziele',
    bereich: 'technische-analyse',
    titel: 'Wellenziele: welche Welle welches Level anläuft',
    kurz: 'Die Fibonacci-Verhältnisse je Welle – Rücklauftiefen, Streckungsziele und wie man sie aufträgt.',
    kernaussage:
      'Jede Welle hat ihre eigenen Erwartungswerte. Ein Verhältnis ohne die Welle, auf die es sich bezieht, ist keine Aussage – und ein getroffenes Ziel ist kein Beleg.',
    belegart: 'deutung',
    dauer: 12,
    stichworte: [
      'Fibonacci',
      'Wellenziel',
      'Retracement',
      'Extension',
      'Projektion',
      'Elliott',
    ],
    setztVoraus: ['fibonacci-retracements', 'elliott-impulse'],
    lernthemen: ['anlegerpsychologie'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Die Fibonacci-Lektion hat die Marken selbst erklärt – 23,6, 38,2, 50, 61,8 und 78,6 Prozent. Hier geht es um die Zuordnung: **welche** dieser Marken zu **welcher** Welle gehört. Das ist der Teil, der in Darstellungen am häufigsten fehlt, und ohne ihn ist eine Prozentzahl im Chart bedeutungslos.',
      },
      { type: 'figure', figure: 'ta-elliott-ziele' },
      {
        type: 'heading',
        level: 2,
        text: 'Welche Marke bei welcher Welle die übliche ist',
      },
      {
        type: 'paragraph',
        text: 'Die Wellenliteratur nennt für jede Welle ein bevorzugtes Verhältnis und daneben weitere gebräuchliche. Die folgenden beiden Grafiken zeigen diese Rangfolge – kräftig markiert der Regelfall, schwächer das Übrige.',
      },
      { type: 'figure', figure: 'ta-elliott-ruecklaeufe' },
      {
        type: 'paragraph',
        text: 'Die wichtigste Aussage daraus ist der Unterschied zwischen den beiden Korrekturwellen im Impuls: **Welle 2 korrigiert tief, Welle 4 flach.** Welle 2 holt regelmäßig 61,8 Prozent der Welle 1 zurück und mitunter 78,6; Welle 4 bleibt meist bei 38,2 Prozent der Welle 3 und oft schon bei 23,6. Wer eine flache erste Korrektur sieht, zählt vermutlich falsch – und umgekehrt.',
      },
      { type: 'figure', figure: 'ta-elliott-streckungen' },
      {
        type: 'paragraph',
        text: 'Bei den Impulswellen ist Welle 3 die einzige, für die regelmäßig ein Vielfaches **über** eins erwartet wird. Welle 5 bleibt in der Regel darunter – das 0,618-fache der Strecke von Beginn Welle 1 bis Ende Welle 3 ist der Regelfall, und genau das ist der rechnerische Ausdruck dafür, dass die letzte Bewegung eines Trends schwächer getragen wird.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Warum hier keine Prozentzahlen für die Häufigkeit stehen',
        items: [
          'Die Literatur beschreibt Verhältnisse als häufiger oder seltener. Eine Auszählung mit Stichprobe, Zeitraum und Methode liefert sie nicht.',
          'Eine Angabe wie „Welle 2 korrigiert in 61 Prozent der Fälle auf 61,8 Prozent“ wäre deshalb erfunden – auch wenn sie so klänge wie die übrigen Zahlen dieser Seite.',
          'Gezeigt wird darum eine Rangfolge und keine Wahrscheinlichkeit. Das ist die stärkste Aussage, die sich hier belegen lässt.',
        ],
      },
      { type: 'heading', level: 2, text: 'Drei verschiedene Rechenarten' },
      {
        type: 'paragraph',
        text: 'Die Verhältnisse werden nicht alle gleich gebildet. Wer sie durcheinanderbringt, trägt Marken auf, die nichts bedeuten.',
      },
      {
        type: 'table',
        caption:
          'Die drei Arten, ein Wellenziel zu bilden. Der Unterschied liegt darin, worauf sich das Verhältnis bezieht.',
        head: ['Art', 'Bezug', 'Wofür'],
        rows: [
          [
            'Rücklauf (Retracement)',
            'Anteil der unmittelbar vorigen Welle',
            'Korrekturwellen: 2, 4, B',
          ],
          [
            'Streckung (Extension)',
            'Vielfaches der vorigen gleichgerichteten Welle',
            'Impulswellen: 3, 5, C',
          ],
          [
            'Projektion',
            'Vielfaches einer früheren Strecke, angetragen an einem späteren Punkt',
            'Welle 5 aus der Strecke 1 bis 3',
          ],
        ],
      },
      { type: 'heading', level: 2, text: 'Die Ziele Welle für Welle' },
      {
        type: 'table',
        caption:
          'Übliche Erwartungswerte je Welle. Die Reihenfolge in der Spalte nennt zuerst den häufigsten Wert.',
        head: ['Welle', 'Art', 'Werte', 'Gemessen woran'],
        rows: [
          [
            'Welle 2',
            'Rücklauf',
            '61,8 % · 50 % · 78,6 %',
            'an Welle 1, vom Hoch der Welle 1 nach unten',
          ],
          [
            'Welle 3',
            'Streckung',
            '1,618 × · 2,618 × · 4,236 ×',
            'an Welle 1, angetragen ab dem Tief der Welle 2',
          ],
          [
            'Welle 4',
            'Rücklauf',
            '38,2 % · 23,6 % · 50 %',
            'an Welle 3, vom Hoch der Welle 3 nach unten',
          ],
          [
            'Welle 5',
            'Projektion',
            '0,618 × · 1,000 × der Strecke Start 1 bis Ende 3',
            'angetragen ab dem Tief der Welle 4',
          ],
          [
            'Welle 5 (Nebenweg)',
            'Streckung',
            '1,000 × · 1,618 × Welle 1',
            'an Welle 1, angetragen ab dem Tief der Welle 4',
          ],
          [
            'Welle A',
            'Rücklauf',
            '38,2 % · 50 % · 61,8 %',
            'an der gesamten Bewegung 1 bis 5',
          ],
          [
            'Welle B',
            'Rücklauf',
            '38,2 % · 50 % · 61,8 % (Flat: über 90 %)',
            'an Welle A',
          ],
          [
            'Welle C',
            'Streckung',
            '1,000 × · 1,618 × Welle A',
            'an Welle A, angetragen ab dem Hoch der Welle B',
          ],
        ],
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Die Zusammenballung ist aussagekräftiger als der Einzelwert',
        items: [
          'Fallen mehrere Ziele aus verschiedenen Rechenarten auf denselben Bereich, gilt dieser als besonders beachtet.',
          'Beispiel: Welle 4 bei 38,2 Prozent der Welle 3 und zugleich am Hoch der Unterwelle 4 innerhalb von Welle 3 – zwei unabhängige Herleitungen, ein Bereich.',
          'Das ist ein Argument für einen Bereich, nicht für einen Punkt. Wer auf die zweite Nachkommastelle plant, überdehnt die Methode.',
        ],
      },
      { type: 'heading', level: 2, text: 'Welche Regel welche Zählung ausschließt' },
      {
        type: 'paragraph',
        text: 'Ein Ziel zu verfehlen widerlegt eine Zählung nicht. Es gibt aber Marken, deren Überschreiten sie tatsächlich beendet – und die sind praktisch wertvoller als jede Zielprojektion, weil sie eine überprüfbare Grenze setzen.',
      },
      {
        type: 'table',
        caption:
          'Die Marken, an denen eine Zählung ungültig wird. Sie folgen unmittelbar aus den drei Regeln.',
        head: ['Wird überschritten', 'Dann gilt'],
        rows: [
          [
            'Welle 2 unterschreitet den Start von Welle 1',
            'Die Zählung ist falsch. Kein Ermessen, keine Sonderform.',
          ],
          [
            'Welle 4 reicht in den Kursbereich von Welle 1',
            'Die Zählung ist falsch – es sei denn, es ist eine endende Diagonale.',
          ],
          [
            'Welle 3 ist kürzer als Welle 1 und Welle 5',
            'Die Zählung ist falsch. Welle 3 darf nie die kürzeste sein.',
          ],
          [
            'Welle B über 105 % von Welle A',
            'Kein Zickzack. Es kommt nur noch eine erweiterte oder laufende Flat in Frage.',
          ],
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Warum ein getroffenes Ziel nichts beweist',
        items: [
          'Die genannten Marken liegen dicht beieinander: Zwischen 38,2 und 61,8 Prozent liegt bei einer Bewegung von 100 Punkten ein Korridor von 24 Punkten.',
          'Legt man Rücklauf-, Streckungs- und Projektionsziele übereinander, ist ein erheblicher Teil des Kursraums von irgendeiner Marke belegt.',
          'Ein Kurs, der eine davon trifft, bestätigt deshalb wenig. Aussagekräftig wäre erst der Nachweis, dass er sie häufiger trifft als bei zufälliger Verteilung – und dieser Nachweis fehlt.',
        ],
      },
      { type: 'heading', level: 2, text: 'Wie man es praktisch aufträgt' },
      {
        type: 'list',
        ordered: true,
        items: [
          'Zuerst die Zählung festlegen und die Punkte markieren: Start von Welle 1, Ende jeder Welle. Ohne diese Punkte gibt es nichts zu messen.',
          'Für die laufende Welle die passende Rechenart aus der Tabelle oben wählen – Rücklauf, Streckung oder Projektion.',
          'Alle drei üblichen Werte auftragen, nicht nur den häufigsten. Der Bereich dazwischen ist die Erwartung, nicht die einzelne Linie.',
          'Die Ausschlussmarke aus der letzten Tabelle daneben eintragen. Sie ist der einzige Wert, der die Zählung tatsächlich beenden kann.',
          'Bei jeder abgeschlossenen Welle neu messen. Die Ziele der folgenden Welle hängen von der tatsächlichen Länge der vorigen ab, nicht von der erwarteten.',
        ],
      },
      {
        type: 'quote',
        text: 'Die Ausschlussmarke ist die nützlichere Zahl. Sie sagt, wann man sich geirrt hat – das Ziel sagt nur, worauf man gehofft hatte.',
        source: 'Zum praktischen Umgang mit Wellenzielen',
      },
    ],
  },
]
