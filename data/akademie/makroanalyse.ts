/**
 * Der Zweig „Makroanalyse“ der Akademie.
 *
 * ## Warum dieser Zweig heikler ist als die anderen
 *
 * Konjunkturdaten wirken hart – sie kommen von Statistikämtern, tragen
 * Nachkommastellen und werden auf die Minute veröffentlicht. Tatsächlich sind
 * sie fast alle Schätzungen, werden regelmäßig nach oben oder unten korrigiert
 * und beschreiben ein Quartal, das längst vorbei ist.
 *
 * Dazu kommt die zweite Stufe: Selbst wer die Wirtschaftslage richtig
 * vorhersagt, hat damit noch nichts über Kurse gesagt. Der Markt handelt
 * Erwartungen, nicht Zustände. Eine gute Zahl kann Kurse fallen lassen, weil
 * eine bessere erwartet wurde.
 *
 * Beide Punkte stehen deshalb nicht als Fußnote am Ende, sondern in den
 * Grenzen des Bereichs und in der ersten Lektion.
 */

import type { Bereich, Lektion } from '@/data/akademie/types'

export const makroanalyse: Bereich = {
  id: 'makroanalyse',
  titel: 'Makroanalyse',
  sinnbild: 'globe',
  kurz: 'Konjunktur, Zinsen und Preisdaten – welche Zahlen Märkte bewegen und was sie tatsächlich aussagen.',
  einleitung:
    'Jeden Monat erscheinen dutzende Wirtschaftsdaten, und ein Teil davon bewegt Kurse binnen Sekunden. Diese Lektionen erklären, was hinter den wichtigsten Veröffentlichungen steckt, wie sie erhoben werden und wie zuverlässig sie sind – und vor allem, warum die Reaktion des Marktes so oft nicht zur Zahl passt.',
  grenzen: [
    'Fast alle Konjunkturdaten sind erste Schätzungen und werden später korrigiert. Die Korrektur ist oft größer als der Unterschied, über den bei der Veröffentlichung berichtet wurde.',
    'Sie beschreiben die Vergangenheit. Ein Quartalsergebnis erscheint Wochen nach dem Quartal; eine Rezession wird amtlich festgestellt, wenn sie meist schon vorbei ist.',
    'Der Markt handelt die Abweichung von der Erwartung, nicht die Zahl. Wer eine gute Zahl vorhersagt und daraus steigende Kurse ableitet, hat die halbe Rechnung gemacht.',
    'Zusammenhänge zwischen Konjunktur und Kursen sind über einzelne Zyklen hinweg instabil. Was in den 1980er Jahren galt, gilt bei anderen Zinsniveaus und anderer Notenbankpolitik nicht mehr.',
  ],
  reihenfolge: [
    'was-makroanalyse-ist',
    'konjunkturzyklus',
    'bruttoinlandsprodukt',
    'inflationsmessung',
    'arbeitsmarktdaten',
    'stimmungsindikatoren',
    'leitzins',
    'zinsstrukturkurve',
    'inverse-zinskurve',
    'geldmenge-und-kredit',
    'staatsverschuldung',
    'wechselkurs-und-aussenhandel',
    'rohstoffe-als-indikator',
    'wie-maerkte-auf-daten-reagieren',
  ],
}

export const makroanalyseLektionen: Lektion[] = [
  /* ------------------------------------------------------------------ 1 */
  {
    slug: 'was-makroanalyse-ist',
    bereich: 'makroanalyse',
    titel: 'Was Makroanalyse ist',
    kurz: 'Warum die Wirtschaftslage und die Kursentwicklung zwei verschiedene Dinge sind.',
    kernaussage:
      'Der Markt handelt nicht die Wirtschaftslage, sondern den Abstand zwischen ihr und dem, was erwartet wurde.',
    belegart: 'deutung',
    dauer: 7,
    stichworte: ['Makroanalyse', 'Konjunktur', 'Erwartung'],
    lernthemen: ['wie-funktioniert-der-markt', 'notenbanken-geldpolitik'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Am 6. November erscheint um 14:30 Uhr der amerikanische Arbeitsmarktbericht. Er meldet 250.000 neue Stellen – ein guter Wert. Der Aktienmarkt fällt trotzdem um anderthalb Prozent. Wer die Zahl richtig vorhergesagt hatte, hat trotzdem Geld verloren.',
      },
      {
        type: 'paragraph',
        text: 'Der Grund ist das Grundprinzip dieses ganzen Zweiges: **Kurse enthalten bereits, was erwartet wird.** Erwartet wurden 180.000 Stellen; die 250.000 sind stärker – und damit steigt die Wahrscheinlichkeit, dass die Notenbank die Zinsen länger hoch lässt. Eine gute Nachricht für die Wirtschaft ist an diesem Tag eine schlechte für die Kurse.',
      },
      { type: 'heading', level: 2, text: 'Die drei Fragen bei jeder Zahl' },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Was wurde erwartet?** Ohne die Erwartung ist die Zahl bedeutungslos. Analystenschätzungen stehen in jedem Wirtschaftskalender.',
          '**Wie groß ist die Abweichung im Verhältnis zur üblichen Schwankung?** Eine Abweichung von 20.000 Stellen liegt im Rauschen, eine von 200.000 nicht.',
          '**Über welchen Weg wirkt sie?** Über den Gewinn der Unternehmen, über den Zins oder über beide gegenläufig? Der dritte Fall erklärt die meisten überraschenden Reaktionen.',
        ],
      },
      { type: 'heading', level: 2, text: 'Vorlauf, Gleichlauf, Nachlauf' },
      {
        type: 'table',
        caption: 'Wann eine Kennzahl reagiert.',
        head: ['Art', 'Beispiele', 'Nutzen'],
        rows: [
          [
            'vorlaufend',
            'Einkaufsmanagerindizes, Auftragseingänge, Zinsstruktur, Aktienkurse selbst',
            'Zeigen die Richtung, sind dafür ungenau',
          ],
          [
            'gleichlaufend',
            'Industrieproduktion, Einzelhandelsumsatz, Beschäftigung',
            'Beschreiben den Ist-Zustand',
          ],
          [
            'nachlaufend',
            'Arbeitslosenquote, Insolvenzen, Kerninflation',
            'Bestätigen im Nachhinein, taugen nicht zur Vorhersage',
          ],
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Was dieser Zweig nicht kann',
        items: [
          'Er sagt keine Kurse vorher. Selbst eine perfekte Konjunkturprognose ergibt keine Kursprognose, weil zwischen beiden die Erwartung des Marktes steht.',
          'Wirtschaftsdaten kommen zu spät für kurzfristige Entscheidungen und sind für langfristige zu unruhig. Ihr Nutzen liegt dazwischen: im Einordnen dessen, was gerade passiert.',
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 2 */
  {
    slug: 'konjunkturzyklus',
    bereich: 'makroanalyse',
    titel: 'Der Konjunkturzyklus',
    kurz: 'Die vier Phasen, was in jeder von ihnen üblicherweise läuft – und warum die Einteilung erst im Rückblick eindeutig ist.',
    kernaussage:
      'Die Phasen des Zyklus sind gut beschrieben und in der Gegenwart nie eindeutig zuzuordnen. Wer meint, sie sicher zu erkennen, verwechselt Rückblick mit Sicht.',
    belegart: 'beobachtung',
    dauer: 8,
    stichworte: ['Konjunktur', 'Zyklus', 'Rezession'],
    setztVoraus: ['was-makroanalyse-ist'],
    lernthemen: ['groesste-crashes'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Wirtschaftsleistung wächst nicht gleichmäßig, sondern in Wellen. Die Einteilung in vier Phasen ist alt und hat sich als Beschreibung bewährt: Aufschwung, Hochkonjunktur, Abschwung, Rezession.',
      },
      {
        type: 'table',
        caption: 'Was in den Phasen üblicherweise geschieht.',
        head: ['Phase', 'Kennzeichen', 'Was meist steigt'],
        rows: [
          [
            'Aufschwung',
            'Auftragseingänge ziehen an, Arbeitslosigkeit fällt, Zinsen noch niedrig',
            'Zykliker, kleine Werte, Industriemetalle',
          ],
          [
            'Hochkonjunktur',
            'Kapazitäten ausgelastet, Löhne und Preise ziehen an, Notenbank strafft',
            'Energie, Rohstoffe – Anleihen leiden',
          ],
          [
            'Abschwung',
            'Aufträge brechen ein, Lager füllen sich, Gewinne sinken',
            'Basiskonsum, Gesundheit, lange Staatsanleihen',
          ],
          [
            'Rezession',
            'Wirtschaftsleistung schrumpft, Arbeitslosigkeit steigt, Notenbank lockert',
            'Staatsanleihen – Aktien drehen meist mitten in der Phase',
          ],
        ],
      },
      {
        type: 'paragraph',
        text: 'Die letzte Zeile enthält die wichtigste Beobachtung: Aktienmärkte drehen in aller Regel nach oben, während die Nachrichten noch schlecht sind. Wer auf gute Meldungen wartet, kauft nach der Erholung – der Markt läuft der Konjunktur um Monate voraus.',
      },
      { type: 'heading', level: 2, text: 'Wann eine Rezession eine ist' },
      {
        type: 'paragraph',
        text: 'Die verbreitete Faustregel lautet: zwei aufeinanderfolgende Quartale mit schrumpfender Wirtschaftsleistung. In den Vereinigten Staaten entscheidet das jedoch ein Gremium des National Bureau of Economic Research anhand mehrerer Größen – und es lässt sich Zeit. Die Feststellung erfolgt regelmäßig erst ein halbes bis ein Jahr nach dem Beginn.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Warum die Phase in der Gegenwart nie feststeht',
        items: [
          'Die Daten, aus denen sie sich ergibt, erscheinen mit Wochen Verzögerung und werden anschließend korrigiert. Ein Quartal, das zunächst leichtes Wachstum zeigte, kann nach der zweiten Korrektur negativ sein.',
          'Kein Zyklus gleicht dem vorherigen. Länge, Tiefe und Auslöser unterscheiden sich so stark, dass Durchschnittswerte über vergangene Zyklen wenig aussagen.',
          'Der Zyklus lässt sich unterbrechen: 2020 dauerte die amtlich festgestellte Rezession in den USA zwei Monate. Jede Regel, die auf zwei Quartalen beruht, hätte sie nicht erfasst.',
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 3 */
  {
    slug: 'bruttoinlandsprodukt',
    bereich: 'makroanalyse',
    titel: 'Das Bruttoinlandsprodukt',
    kurz: 'Wie die Wirtschaftsleistung gemessen wird, was dabei nicht mitgezählt wird und wie stark die Zahl nachträglich wandert.',
    kernaussage:
      'Das BIP misst, was gegen Geld getauscht wurde – nicht, was geleistet wurde, und schon gar nicht, wie es den Menschen geht.',
    belegart: 'definition',
    dauer: 8,
    stichworte: ['BIP', 'Wirtschaftsleistung', 'Wachstum'],
    setztVoraus: ['konjunkturzyklus'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Das **Bruttoinlandsprodukt** ist der Wert aller Waren und Dienstleistungen, die in einem Zeitraum innerhalb eines Landes für den Endverbrauch hergestellt wurden. Es lässt sich auf drei Wegen berechnen, die rechnerisch zum selben Ergebnis führen müssen.',
      },
      {
        type: 'formula',
        expression:
          'Verwendung:   BIP = Konsum + Investitionen + Staatsausgaben + (Ausfuhr − Einfuhr)\nEntstehung:   Summe der Wertschöpfung aller Wirtschaftsbereiche\nVerteilung:   Summe aller Einkommen aus Arbeit und Vermögen',
        description:
          'Die erste Zeile ist die geläufigste. Dass Einfuhren abgezogen werden, ist kein Werturteil über Importe, sondern eine Korrektur: Sie stecken bereits in Konsum und Investitionen und wurden nicht im Inland hergestellt.',
      },
      { type: 'heading', level: 2, text: 'Nominal, real, je Kopf' },
      {
        type: 'list',
        items: [
          '**Nominal** ist die Zahl zu laufenden Preisen. Sie steigt auch dann, wenn nur die Preise steigen.',
          '**Real** ist um die Preisentwicklung bereinigt und die Größe, die für Wachstum gemeint ist.',
          '**Je Kopf** teilt durch die Einwohnerzahl. Ein Land kann real wachsen und je Kopf schrumpfen, wenn die Bevölkerung schneller wächst.',
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Auf dieser Website',
        items: [
          'Der Globus zeigt für jedes Land die Wirtschaftsleistung je Kopf, kaufkraftbereinigt – also so umgerechnet, dass unterschiedliche Preisniveaus die Vergleichbarkeit nicht zerstören.',
          'Ohne diese Bereinigung sähe ein Land mit niedrigen Preisen ärmer aus, als es ist: Dieselbe Ware kostet dort weniger, das Einkommen reicht also weiter.',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Was das BIP nicht misst',
        items: [
          '**Unbezahlte Arbeit.** Kinderbetreuung, Pflege und Hausarbeit tauchen nicht auf. Wer eine Pflegekraft einstellt, erhöht das BIP; wer selbst pflegt, nicht.',
          '**Schäden und ihre Beseitigung.** Ein Sturm senkt das BIP nicht, der Wiederaufbau hebt es. Zerstörung erscheint dadurch als Wachstum.',
          '**Verteilung.** Ein Land mit stark steigenden Spitzeneinkommen wächst, auch wenn die Mehrheit nichts davon hat.',
          '**Korrekturen.** Die erste Schätzung erscheint wenige Wochen nach dem Quartal und wird mehrfach überarbeitet. Korrekturen um mehrere Zehntelprozentpunkte sind üblich – mehr, als bei der Veröffentlichung den Unterschied ausmachte.',
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 4 */
  {
    slug: 'inflationsmessung',
    bereich: 'makroanalyse',
    titel: 'Wie Inflation gemessen wird',
    kurz: 'Warenkorb, Kernrate, Basiseffekt – warum die gefühlte Teuerung fast immer über der gemessenen liegt.',
    kernaussage:
      'Die Inflationsrate misst einen festgelegten Durchschnittshaushalt. Dass sie sich für den Einzelnen falsch anfühlt, ist kein Messfehler, sondern die Folge der Mittelung.',
    belegart: 'definition',
    dauer: 9,
    stichworte: ['Inflation', 'Warenkorb', 'Kerninflation', 'Basiseffekt'],
    setztVoraus: ['bruttoinlandsprodukt'],
    lernthemen: ['inflation'],
    rechner: ['inflationsrechner'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Eine Inflationsrate entsteht, indem ein festgelegter **Warenkorb** immer wieder neu bepreist wird. In Deutschland umfasst er mehrere hundert Güterarten, deren Gewichte aus Verbrauchsstichproben stammen: Wohnen wiegt schwer, Zeitungen leicht.',
      },
      {
        type: 'formula',
        expression: 'Rate = (Preisindex heute ÷ Preisindex vor zwölf Monaten − 1) × 100',
        description:
          'Verglichen wird fast immer mit dem Vorjahresmonat, nicht mit dem Vormonat. Das schaltet saisonale Schwankungen aus und erzeugt zugleich den Basiseffekt.',
      },
      { type: 'heading', level: 2, text: 'Der Basiseffekt' },
      {
        type: 'paragraph',
        text: 'Weil immer gegen den Vorjahresmonat gerechnet wird, wirkt jeder Ausreißer zweimal: einmal beim Auftreten und ein Jahr später beim Herausfallen. Ein Energiepreissprung treibt die Rate zwölf Monate lang nach oben und drückt sie danach nach unten, ohne dass die Preise gefallen wären. Die Rate sinkt dann – die Preise bleiben hoch.',
      },
      {
        type: 'paragraph',
        text: 'Genau hier liegt der häufigste Irrtum: Eine fallende Inflationsrate heißt nicht fallende Preise, sondern langsamer steigende. Für fallende Preise bräuchte es eine negative Rate, also Deflation.',
      },
      { type: 'heading', level: 2, text: 'Kernrate und harmonisierter Index' },
      {
        type: 'list',
        items: [
          '**Kerninflation** lässt Energie und Nahrungsmittel weg. Nicht weil sie unwichtig wären, sondern weil sie stark schwanken und von Wetter und Weltmarkt getrieben sind – die Kernrate zeigt besser, ob die Teuerung sich im Inland festgesetzt hat.',
          '**HVPI** ist der harmonisierte Index, den alle EU-Länder nach denselben Regeln erheben. Nur er ist zwischen Ländern vergleichbar, und nur er zählt für die EZB.',
          '**Deflator** ist die Preisbereinigung im BIP. Er umfasst alles Produzierte statt nur den Verbrauch und weicht deshalb regelmäßig von den anderen ab.',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Warum die eigene Teuerung eine andere ist',
        items: [
          '**Ein anderer Korb.** Wer zur Miete wohnt, pendelt und keine Kinder hat, kauft nicht den Durchschnittskorb. Bei stark auseinanderlaufenden Preisen weicht die persönliche Rate um mehrere Prozentpunkte ab.',
          '**Häufig Gekauftes prägt die Wahrnehmung.** Brot und Benzin sieht man wöchentlich, die gesunkene Waschmaschine alle zehn Jahre. Untersuchungen finden hier den Hauptgrund für die Lücke zwischen gefühlter und gemessener Teuerung.',
          '**Qualitätsbereinigung.** Wird ein Gerät teurer und zugleich besser, rechnen die Statistiker den Verbesserungsanteil heraus. Das ist methodisch begründet und für den Käufer schwer nachvollziehbar – er zahlt den vollen Preis.',
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 5 */
  {
    slug: 'arbeitsmarktdaten',
    bereich: 'makroanalyse',
    titel: 'Arbeitsmarktdaten',
    kurz: 'Warum der amerikanische Stellenbericht die wichtigste Zahl des Monats ist und was die Quote verschweigt.',
    kernaussage:
      'Die Arbeitslosenquote fällt auch dann, wenn Menschen die Suche aufgeben. Ohne die Erwerbsquote daneben ist sie nicht zu lesen.',
    belegart: 'definition',
    dauer: 8,
    stichworte: ['Arbeitsmarkt', 'Arbeitslosenquote', 'Erwerbsquote'],
    setztVoraus: ['was-makroanalyse-ist'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Am ersten Freitag jedes Monats veröffentlicht das amerikanische Arbeitsministerium den Beschäftigungsbericht. Keine andere regelmäßige Zahl bewegt Aktien-, Anleihe- und Devisenmärkte so verlässlich – weil sie zugleich etwas über die Konjunktur und über die nächste Zinsentscheidung sagt.',
      },
      {
        type: 'table',
        caption: 'Die Bestandteile des Berichts.',
        head: ['Größe', 'Was sie misst', 'Erhoben bei'],
        rows: [
          [
            'Beschäftigte außerhalb der Landwirtschaft',
            'Veränderung der Stellenzahl',
            'Betrieben',
          ],
          [
            'Arbeitslosenquote',
            'Anteil der Suchenden an den Erwerbspersonen',
            'Haushalten',
          ],
          ['Erwerbsquote', 'Anteil der Erwerbspersonen an der Bevölkerung', 'Haushalten'],
          ['Stundenlöhne', 'Veränderung gegenüber Vorjahr', 'Betrieben'],
        ],
      },
      {
        type: 'paragraph',
        text: 'Dass zwei verschiedene Erhebungen dahinterstehen, erklärt einen wiederkehrenden Widerspruch: Die Stellenzahl kann steigen, während die Quote ebenfalls steigt. Beides ist möglich, weil die eine Zahl von Betrieben und die andere von Haushalten kommt.',
      },
      { type: 'heading', level: 2, text: 'Warum die Quote allein irreführt' },
      {
        type: 'paragraph',
        text: 'Als arbeitslos gilt nur, wer aktiv sucht. Wer aufgibt, verschwindet aus der Statistik – und die Quote sinkt. Deshalb muss die **Erwerbsquote** danebenstehen: Fällt sie, während die Arbeitslosenquote fällt, ist der Arbeitsmarkt nicht besser geworden, sondern kleiner.',
      },
      {
        type: 'paragraph',
        text: 'Für die Notenbank ist inzwischen der Lohnanstieg die wichtigere Zeile. Steigen die Löhne deutlich schneller als die Produktivität, geraten die Preise unter Druck – daraus entsteht die Sorge vor einer Lohn-Preis-Spirale, die Zinsentscheidungen stärker beeinflusst als die Stellenzahl selbst.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Die Zahl, über die berichtet wird, ist selten die endgültige',
        items: [
          'Der Stellenbericht wird in den beiden Folgemonaten überarbeitet. Korrekturen von mehreren zehntausend Stellen sind gewöhnlich, gelegentlich ändert sich das Vorzeichen.',
          'Einmal jährlich kommt eine umfassende Revision anhand von Meldedaten hinzu. Sie hat schon ganze Jahresverläufe verschoben – nachdem die Märkte jede Einzelmeldung längst gehandelt hatten.',
          'Die Arbeitslosenquote ist zudem nachlaufend: Sie erreicht ihren Tiefpunkt regelmäßig kurz vor Beginn einer Rezession. Als Warnsignal taugt sie deshalb nicht.',
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 6 */
  {
    slug: 'stimmungsindikatoren',
    bereich: 'makroanalyse',
    titel: 'Einkaufsmanager und andere Umfragen',
    kurz: 'Warum eine Umfrage schneller ist als jede amtliche Statistik – und wo ihre Aussagekraft endet.',
    kernaussage:
      'Umfragen messen Erwartungen, nicht Zustände. Genau deshalb kommen sie früh, und genau deshalb liegen sie an Wendepunkten häufig daneben.',
    belegart: 'beobachtung',
    dauer: 7,
    stichworte: ['Einkaufsmanagerindex', 'PMI', 'ifo', 'Frühindikator'],
    setztVoraus: ['konjunkturzyklus'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Ein Statistikamt braucht Wochen, um Produktionszahlen zusammenzutragen. Eine Umfrage unter Einkaufsleitern ist in Tagen ausgewertet. Der Verzicht auf Genauigkeit wird mit Geschwindigkeit bezahlt – das ist der Handel, den jeder Stimmungsindikator eingeht.',
      },
      {
        type: 'table',
        caption: 'Die meistbeachteten Umfragen.',
        head: ['Index', 'Wer wird gefragt', 'Schwelle'],
        rows: [
          [
            'Einkaufsmanagerindex (PMI)',
            'Einkaufsleiter in Industrie und Dienstleistung',
            '50 – darüber Ausweitung, darunter Schrumpfung',
          ],
          [
            'ifo-Geschäftsklima',
            'rund 9.000 deutsche Unternehmen',
            'Indexwert, kein fester Punkt',
          ],
          [
            'ZEW-Index',
            'Finanzanalysten, nicht Unternehmen',
            'Saldo aus Optimisten und Pessimisten',
          ],
          [
            'Verbrauchervertrauen',
            'Haushalte',
            'Indexwert; wirkt auf den Konsum mit Verzögerung',
          ],
        ],
      },
      {
        type: 'paragraph',
        text: 'Die Schwelle von 50 beim PMI ist der Grund für seine Beliebtheit: Sie macht aus einer Umfrage eine Ja-Nein-Aussage. Wichtig ist dabei, dass 48 nicht „Wirtschaft schrumpft“ heißt, sondern „mehr Befragte melden weniger als mehr“ – eine Aussage über die Richtung, nicht über das Ausmaß.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Drei Schwächen, die alle Umfragen teilen',
        items: [
          '**Stimmung ist ansteckend.** Wer die Nachrichten liest, antwortet danach. Umfragen laufen dadurch teilweise den Schlagzeilen hinterher statt der Wirtschaft voraus.',
          '**Der ZEW-Index misst Analysten.** Er sagt etwas darüber, was Finanzleute erwarten – nicht darüber, was Unternehmen tun. Als Konjunkturindikator ist er deshalb der schwächste der vier.',
          '**Falsche Alarme.** Frühindikatoren haben mehr Abschwünge angezeigt, als eingetreten sind. Wer nach ihnen handelt, steigt regelmäßig aus, ohne dass etwas passiert.',
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 7 */
  {
    slug: 'leitzins',
    bereich: 'makroanalyse',
    titel: 'Der Leitzins',
    kurz: 'Was eine Notenbank tatsächlich steuert, wie die Wirkung durchsickert und warum sie so spät ankommt.',
    kernaussage:
      'Eine Notenbank setzt einen sehr kurzfristigen Zins. Alles andere – Kredite, Mieten, Kurse – folgt daraus indirekt und mit erheblicher Verzögerung.',
    belegart: 'definition',
    dauer: 9,
    stichworte: ['Leitzins', 'EZB', 'Fed', 'Geldpolitik'],
    setztVoraus: ['inflationsmessung'],
    lernthemen: ['notenbanken-geldpolitik'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Wenn es heißt, „die Zinsen“ seien erhöht worden, ist genau ein Zins gemeint: der, zu dem sich Geschäftsbanken bei der Notenbank Geld beschaffen oder dort anlegen. Alles andere ist Folge.',
      },
      {
        type: 'table',
        caption: 'Die Steuersätze der beiden wichtigsten Notenbanken.',
        head: ['Notenbank', 'Steuernder Satz', 'Auftrag'],
        rows: [
          [
            'Europäische Zentralbank',
            'Einlagesatz – was Banken für geparktes Geld bekommen',
            'Preisstabilität, mittelfristig zwei Prozent',
          ],
          [
            'Federal Reserve',
            'Zielband für den Tagesgeldsatz zwischen Banken',
            'Zwei Ziele: stabile Preise und hohe Beschäftigung',
          ],
        ],
      },
      {
        type: 'paragraph',
        text: 'Der Unterschied in der letzten Spalte hat Folgen. Die Fed muss bei schwacher Beschäftigung lockern, auch wenn die Preise noch steigen; die EZB hat diesen Abwägungsauftrag nicht. Wer Entscheidungen der beiden vergleicht, muss das mitdenken.',
      },
      { type: 'heading', level: 2, text: 'Wie die Wirkung durchsickert' },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Geldmarkt.** Der Tagesgeldsatz zwischen Banken folgt sofort.',
          '**Kreditzinsen.** Banken passen Konditionen für Unternehmen und Bauherren über Wochen bis Monate an.',
          '**Nachfrage.** Investitionen und Käufe werden verschoben – das dauert Quartale.',
          '**Preise.** Erst am Ende der Kette wirkt es auf die Inflation. Als Faustregel gelten vier bis sechs Quartale.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Diese Verzögerung ist das Kernproblem der Geldpolitik. Eine Notenbank entscheidet heute anhand von Daten, die die Vergangenheit beschreiben, über eine Wirkung, die in anderthalb Jahren eintritt. Deshalb wird regelmäßig zu spät gebremst und zu spät gelockert – nicht aus Unfähigkeit, sondern weil die Kette so lang ist.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Was neben dem Zins noch wirkt',
        items: [
          '**Anleihekäufe.** Kauft die Notenbank langlaufende Papiere, drückt sie deren Rendite – dort, wo der Leitzins nicht hinreicht.',
          '**Worte.** Ankündigungen über den künftigen Kurs wirken sofort auf die Erwartungen und damit auf die langen Zinsen. Ein Satz auf einer Pressekonferenz kann mehr bewegen als der Beschluss selbst.',
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 8 */
  {
    slug: 'zinsstrukturkurve',
    bereich: 'makroanalyse',
    titel: 'Die Zinsstrukturkurve',
    kurz: 'Was die Renditen verschiedener Laufzeiten zusammen ergeben und wie die Form zu lesen ist.',
    kernaussage:
      'Die Kurve zeigt, was der Markt über Zinsen und Preise der nächsten Jahre denkt – lesbarer als jede Umfrage, weil dahinter Geld steht.',
    belegart: 'definition',
    dauer: 8,
    stichworte: ['Zinskurve', 'Laufzeit', 'Rendite'],
    setztVoraus: ['leitzins'],
    lernthemen: ['staatsanleihe'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Trägt man die Renditen von Staatsanleihen desselben Schuldners nach Laufzeit auf, entsteht eine Kurve: von wenigen Monaten bis dreißig Jahre. Ihre Form enthält mehr Information als jede einzelne Rendite.',
      },
      {
        type: 'table',
        caption: 'Die drei Grundformen.',
        head: ['Form', 'Aussehen', 'Übliche Deutung'],
        rows: [
          [
            'normal',
            'steigt mit der Laufzeit',
            'Der Normalfall: Wer länger verleiht, verlangt mehr',
          ],
          [
            'flach',
            'kurze und lange Renditen fast gleich',
            'Übergangsphase; der Markt erwartet keine Bewegung mehr',
          ],
          [
            'invers',
            'kurze Renditen über den langen',
            'Der Markt erwartet fallende Zinsen, also eine Abkühlung',
          ],
        ],
      },
      { type: 'heading', level: 2, text: 'Warum sie normalerweise steigt' },
      {
        type: 'list',
        items: [
          '**Erwartete Zinsen.** Eine zehnjährige Rendite ist ungefähr der Durchschnitt der erwarteten kurzen Zinsen der nächsten zehn Jahre.',
          '**Laufzeitprämie.** Wer sein Geld lange bindet, trägt mehr Unsicherheit über Inflation und verlangt dafür einen Aufschlag.',
          '**Angebot und Nachfrage.** Versicherungen und Pensionskassen brauchen lange Papiere, um ihre Verpflichtungen abzudecken – ihre Nachfrage kann das lange Ende dauerhaft drücken.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Für Banken ist die Form unmittelbar geschäftsrelevant: Sie nehmen kurzfristig auf und verleihen langfristig. Eine steile Kurve ist ihr Geschäftsmodell, eine flache oder inverse drückt ihre Marge – und mit ihr die Bereitschaft, Kredite zu vergeben.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Auf dieser Website',
        items: [
          'Die Renditen zehnjähriger Staatsanleihen mehrerer Länder stehen unter den Märkten und lassen sich im Zeitverlauf vergleichen.',
          'Der Abstand zwischen zwei Ländern derselben Laufzeit ist dabei ein eigenes Maß: Er zeigt, welches Ausfallrisiko der Markt dem einen gegenüber dem anderen zurechnet.',
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 9 */
  {
    slug: 'inverse-zinskurve',
    bereich: 'makroanalyse',
    titel: 'Die inverse Zinskurve',
    kurz: 'Das bekannteste Rezessionssignal: was es kann, wie oft es stimmte und warum es trotzdem schwer zu benutzen ist.',
    kernaussage:
      'Die Inversion hat fast jede amerikanische Rezession angekündigt – mit einem Vorlauf zwischen sechs und vierundzwanzig Monaten. Genau diese Spanne macht sie als Handlungsanweisung wertlos.',
    belegart: 'beobachtung',
    dauer: 8,
    stichworte: ['inverse Zinskurve', 'Rezessionssignal', 'Vorlauf'],
    setztVoraus: ['zinsstrukturkurve'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Normalerweise bringt eine zehnjährige Anleihe mehr als eine zweijährige. Kehrt sich das um, spricht man von einer **inversen Zinskurve**. Der Markt sagt damit: In einigen Jahren werden die Zinsen niedriger sein als heute – und niedrigere Zinsen setzt eine Notenbank, wenn die Wirtschaft schwächelt.',
      },
      {
        type: 'paragraph',
        text: 'Die Beobachtung ist für die Vereinigten Staaten seit den 1950er Jahren dokumentiert und gehört zu den robustesten der gesamten Makroanalyse: Praktisch jeder Rezession ging eine Inversion voraus. Deshalb wird die Kennzahl bei jeder Umkehr breit berichtet.',
      },
      { type: 'heading', level: 2, text: 'Warum sie trotzdem kaum nutzbar ist' },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Vier Einschränkungen',
        items: [
          '**Der Vorlauf schwankt extrem.** Zwischen Inversion und Rezessionsbeginn lagen historisch sechs bis über zwanzig Monate. Wer beim Signal verkauft, kann fast zwei Jahre einer Hausse verpassen.',
          '**Der Aktienmarkt steigt oft weiter.** Die stärksten Kursgewinne eines Zyklus fallen häufig in die Zeit nach der Inversion und vor der Rezession.',
          '**Welche Laufzeiten?** Üblich sind zehn gegen zwei Jahre und zehn gegen drei Monate. Die beiden Varianten drehen zu unterschiedlichen Zeitpunkten und haben schon widersprüchliche Signale gegeben.',
          '**Die Stichprobe ist klein.** Seit 1955 gab es gut ein Dutzend Zyklen. Eine Trefferquote aus einem Dutzend Fällen trägt keine große Sicherheit, so beeindruckend sie klingt.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Hinzu kommt ein struktureller Einwand. Die Anleihekaufprogramme der Notenbanken haben das lange Ende der Kurve über Jahre künstlich gedrückt. Ob eine Inversion dann noch dieselbe Aussage trägt wie in einem Markt ohne diese Käufe, ist unter Fachleuten offen.',
      },
      {
        type: 'paragraph',
        text: 'Was bleibt, ist die richtige Verwendung: als Hinweis darauf, dass der Anleihemarkt eine Abkühlung einpreist – nicht als Auslöser für eine Umschichtung. Das gilt für den größten Teil dieses Bereichs.',
      },
    ],
  },

  /* ----------------------------------------------------------------- 10 */
  {
    slug: 'geldmenge-und-kredit',
    bereich: 'makroanalyse',
    titel: 'Geldmenge und Kreditvergabe',
    kurz: 'Was M1, M2 und M3 unterscheiden und warum die Kreditvergabe die aussagekräftigere Größe ist.',
    kernaussage:
      'Die Geldmenge allein sagt wenig über Preise. Entscheidend ist, ob das Geld auch umläuft – und das zeigt sich in der Kreditvergabe.',
    belegart: 'deutung',
    dauer: 8,
    stichworte: ['Geldmenge', 'M3', 'Kreditvergabe', 'Umlaufgeschwindigkeit'],
    setztVoraus: ['leitzins'],
    lernthemen: ['geldsystem'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Notenbanken veröffentlichen Geldmengen in Abstufungen, geordnet nach Verfügbarkeit: Je höher die Zahl, desto mehr ist enthalten und desto länger ist es gebunden.',
      },
      {
        type: 'table',
        caption: 'Die Abgrenzungen im Euroraum.',
        head: ['Größe', 'Enthält', 'Aussage'],
        rows: [
          [
            'M1',
            'Bargeld und täglich fällige Einlagen',
            'Was sofort ausgegeben werden kann',
          ],
          [
            'M2',
            'M1 plus kurzfristige Spareinlagen',
            'Was kurzfristig mobilisierbar ist',
          ],
          [
            'M3',
            'M2 plus Geldmarktfondsanteile und kurze Papiere',
            'Die Größe, auf die die EZB lange geschaut hat',
          ],
        ],
      },
      {
        type: 'paragraph',
        text: 'Die klassische Vorstellung – mehr Geld, also höhere Preise – geht auf die Verkehrsgleichung zurück. Sie ist als Buchungsidentität richtig und als Prognosewerkzeug schwach, weil zwei ihrer vier Größen selbst schwanken.',
      },
      {
        type: 'formula',
        expression: 'Geldmenge × Umlaufgeschwindigkeit = Preisniveau × Handelsvolumen',
        description:
          'Steigt die Geldmenge und fällt gleichzeitig die Umlaufgeschwindigkeit, passiert bei den Preisen nichts. Genau das war zwischen 2009 und 2020 zu beobachten.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Warum die Inflationsprognosen aus der Geldmenge scheiterten',
        items: [
          'Nach 2009 wuchsen die Notenbankbilanzen massiv, und die erwartete Inflation blieb aus. Das neue Geld lag als Überschussreserve bei den Notenbanken und kam nie in der Wirtschaft an.',
          'Nach 2020 stieg dagegen die Kreditvergabe an Unternehmen und Haushalte, verbunden mit direkten staatlichen Zahlungen – und die Preise zogen an.',
          'Der Unterschied liegt nicht in der Geldmenge, sondern darin, ob das Geld in den Wirtschaftskreislauf gelangt. Deshalb ist die Kreditvergabe der brauchbarere Indikator.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Praktisch verwertbar sind deshalb weniger die Bestandsgrößen als die Umfragen der Notenbanken zur Kreditvergabe: Wenn Banken ihre Standards straffen und die Nachfrage zugleich fällt, kühlt die Wirtschaft mit einigen Quartalen Verzögerung ab.',
      },
    ],
  },

  /* ----------------------------------------------------------------- 11 */
  {
    slug: 'staatsverschuldung',
    bereich: 'makroanalyse',
    titel: 'Staatsverschuldung und Defizit',
    kurz: 'Schuldenstand, Neuverschuldung, Zinslast – welche der drei Zahlen tatsächlich etwas aussagt.',
    kernaussage:
      'Ob eine Schuldenquote tragfähig ist, entscheidet nicht ihre Höhe, sondern das Verhältnis von Zins zu Wachstum.',
    belegart: 'deutung',
    dauer: 9,
    stichworte: ['Staatsverschuldung', 'Defizit', 'Schuldenquote'],
    setztVoraus: ['bruttoinlandsprodukt'],
    lernthemen: ['staatsanleihe', 'geldsystem'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Drei Zahlen werden regelmäßig verwechselt: der **Schuldenstand** ist der aufgelaufene Bestand, das **Defizit** die Neuverschuldung eines Jahres, die **Zinslast** das, was jährlich für den Bestand zu zahlen ist. Nur die dritte belastet den laufenden Haushalt.',
      },
      {
        type: 'paragraph',
        text: 'Üblich ist die Angabe als Anteil der Wirtschaftsleistung – die Schuldenquote. Sie kann auf drei Wegen sinken, und nur einer davon ist Sparen: Rückzahlung, Wachstum des Nenners, oder Inflation, die den Nenner nominal aufbläht.',
      },
      {
        type: 'formula',
        expression:
          'Veränderung der Quote ≈ (Zinssatz − nominales Wachstum) × Quote − Primärsaldo',
        description:
          'Die Klammer ist der entscheidende Teil. Liegt das nominale Wachstum über dem Zinssatz, sinkt die Quote von selbst, auch ohne Überschuss. Kehrt sich das Verhältnis um, steigt sie – auch bei ausgeglichenem Haushalt.',
      },
      {
        type: 'paragraph',
        text: 'Das erklärt, warum dieselbe Quote in verschiedenen Zeiten völlig verschieden zu bewerten ist. Bei Zinsen nahe null und nominalem Wachstum von vier Prozent schrumpft eine Quote von selbst. Bei vier Prozent Zins und einem Prozent Wachstum wächst sie, ohne dass jemand mehr ausgibt.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Gegen die verbreiteten Faustregeln',
        items: [
          '**Die 60-Prozent-Marke** der europäischen Verträge ist eine politische Vereinbarung, keine ökonomische Schwelle. Sie wurde nicht aus Untersuchungen abgeleitet.',
          '**Die 90-Prozent-Schwelle**, ab der Wachstum angeblich einbricht, stammt aus einer Arbeit von 2010, in der später ein Tabellenkalkulationsfehler und eine fragwürdige Gewichtung gefunden wurden. Nach der Korrektur blieb kein Schwellenwert übrig.',
          '**Der Vergleich mit einem Haushalt** trägt nicht: Ein Staat hat kein Lebensende, an dem er schuldenfrei sein müsste, und kann sich in eigener Währung verschulden.',
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Auf dieser Website',
        items: [
          'Die Schuldenquoten von rund 190 Ländern stehen auf der Seite zur Staatsverschuldung und auf dem Globus, mit dem Bezugsjahr und der Quelle daneben.',
          'Sie stammen aus der Datenbank des Internationalen Währungsfonds und sind zwischen den Ländern vergleichbar erhoben – anders als nationale Angaben, die unterschiedliche Abgrenzungen verwenden.',
        ],
      },
    ],
  },

  /* ----------------------------------------------------------------- 12 */
  {
    slug: 'wechselkurs-und-aussenhandel',
    bereich: 'makroanalyse',
    titel: 'Wechselkurs und Außenhandel',
    kurz: 'Wie Handelsbilanz, Kapitalströme und Wechselkurs zusammenhängen – und warum ein Überschuss kein Gütesiegel ist.',
    kernaussage:
      'Ein Leistungsbilanzüberschuss bedeutet, dass ein Land mehr produziert als verbraucht und die Differenz dem Ausland leiht. Ob das gut ist, hängt davon ab, wem es leiht.',
    belegart: 'deutung',
    dauer: 8,
    stichworte: ['Handelsbilanz', 'Leistungsbilanz', 'Wechselkurs'],
    setztVoraus: ['bruttoinlandsprodukt'],
    lernthemen: ['waehrungen-wechselkurse', 'geldsystem'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Die **Handelsbilanz** vergleicht Warenein- und -ausfuhren, die **Leistungsbilanz** nimmt Dienstleistungen und grenzüberschreitende Einkommen hinzu. Ihr Saldo hat eine buchhalterisch zwingende Kehrseite: Was an Gütern zu viel ausgeführt wird, fließt als Kapital hinaus.',
      },
      {
        type: 'formula',
        expression: 'Leistungsbilanzsaldo + Kapitalbilanzsaldo = 0',
        description:
          'Ein Land mit Überschuss erwirbt zwangsläufig Forderungen gegen das Ausland – es verkauft Güter und bekommt Ansprüche. Ein Defizitland verkauft im Gegenzug Vermögenswerte oder verschuldet sich.',
      },
      { type: 'heading', level: 2, text: 'Wie der Wechselkurs dazwischensteht' },
      {
        type: 'list',
        items: [
          'Eine schwächere Währung verbilligt die eigenen Waren im Ausland und verteuert Importe. Das stützt die Ausfuhr – und verteuert Energie und Vorprodukte, was den Vorteil je nach Wirtschaftsstruktur wieder aufzehrt.',
          'Die Anpassung braucht Zeit. Kurzfristig verschlechtert eine Abwertung die Bilanz sogar, weil die teureren Importe sofort wirken und die Ausfuhrmengen erst später reagieren.',
          'Kapitalströme dominieren inzwischen den Handel. Zinsunterschiede und Anlageentscheidungen bewegen Kurse stärker als Ein- und Ausfuhren.',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Warum ein Überschuss nicht automatisch gut ist',
        items: [
          'Er bedeutet, dass im Inland weniger investiert und verbraucht wird, als produziert wurde. Über Jahrzehnte kann daraus eine Lücke bei Infrastruktur und Ausrüstung werden.',
          'Die Forderungen gegen das Ausland können ausfallen oder durch Abwertungen an Wert verlieren. Ein Teil der deutschen Überschüsse der 2000er Jahre ist in Wertberichtigungen verschwunden.',
          'Umgekehrt ist ein Defizit nicht automatisch schlecht: Ein Land, das Kapital importiert, um damit produktiv zu investieren, tut etwas Sinnvolles. Entscheidend ist, wofür es verwendet wird.',
        ],
      },
    ],
  },

  /* ----------------------------------------------------------------- 13 */
  {
    slug: 'rohstoffe-als-indikator',
    bereich: 'makroanalyse',
    titel: 'Rohstoffe als Konjunkturzeiger',
    kurz: 'Warum Kupfer als Frühindikator gilt, was Öl anzeigt und wo diese Signale getäuscht haben.',
    kernaussage:
      'Rohstoffpreise reagieren früh, weil sie am Anfang jeder Produktionskette stehen – und sie täuschen häufig, weil auch das Angebot sie bewegt.',
    belegart: 'beobachtung',
    dauer: 7,
    stichworte: ['Rohstoffe', 'Kupfer', 'Öl', 'Frühindikator'],
    setztVoraus: ['stimmungsindikatoren'],
    lernthemen: ['rohstoffe'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Wer eine Fabrik baut, kauft Kupfer, bevor er Personal einstellt, und stellt Personal ein, bevor er produziert. Rohstoffnachfrage steht deshalb zeitlich vor fast allem, was Statistikämter später messen.',
      },
      {
        type: 'table',
        caption: 'Was einzelne Rohstoffe anzeigen sollen.',
        head: ['Rohstoff', 'Behauptete Aussage', 'Störgröße'],
        rows: [
          [
            'Kupfer',
            'Bau- und Industriekonjunktur, besonders in China',
            'Streiks, Minenausfälle, staatliche Lagerkäufe',
          ],
          [
            'Öl',
            'Weltweite Aktivität, zugleich Kostentreiber',
            'Förderquoten und geopolitische Ereignisse',
          ],
          [
            'Gold',
            'Misstrauen: Realzins, Inflationssorge, Krisenangst',
            'Notenbankkäufe, Schmucknachfrage',
          ],
          [
            'Frachtraten',
            'Tatsächlich transportierte Warenmenge',
            'Schiffsangebot, Kanalsperren, Hafenstaus',
          ],
        ],
      },
      {
        type: 'paragraph',
        text: 'Die dritte Spalte enthält den entscheidenden Vorbehalt. Ein Preis entsteht aus Angebot und Nachfrage; als Konjunkturzeiger taugt er nur, wenn die Bewegung von der Nachfrage kommt. Fällt der Ölpreis, weil ein Förderland die Menge erhöht, sagt das über die Weltwirtschaft nichts.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Der Spitzname täuscht',
        items: [
          'Kupfer trägt den Beinamen „Doktor Kupfer“, weil es der Wirtschaft angeblich den Puls fühlt. Untersuchungen zu seiner Vorhersagekraft kommen zu gemischten Ergebnissen – belastbar ist der Zusammenhang nicht.',
          'Ein großer Teil der weltweiten Kupfernachfrage entfällt auf China. Der Preis misst damit vor allem die chinesische Bautätigkeit und nicht die Weltkonjunktur.',
          'Frachtratenindizes gelten als besonders anfällig: Sie schwanken stark mit dem Schiffsangebot, das über Jahre im Voraus bestellt wird.',
        ],
      },
    ],
  },

  /* ----------------------------------------------------------------- 14 */
  {
    slug: 'wie-maerkte-auf-daten-reagieren',
    bereich: 'makroanalyse',
    titel: 'Wie Märkte auf Daten reagieren',
    kurz: 'Warum gute Nachrichten Kurse fallen lassen können und was in den Sekunden nach einer Veröffentlichung passiert.',
    kernaussage:
      'Was eine Zahl mit den Kursen macht, hängt an drei Dingen: der Abweichung von der Erwartung, dem Wirkungsweg – und daran, welche Sorge gerade die größere ist.',
    belegart: 'deutung',
    dauer: 8,
    stichworte: ['Marktreaktion', 'Erwartung', 'Überraschung'],
    setztVoraus: ['was-makroanalyse-ist', 'leitzins'],
    lernthemen: ['wie-funktioniert-der-markt', 'anlegerpsychologie'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Eine Konjunkturzahl wirkt über zwei Wege gleichzeitig, und die beiden ziehen oft in verschiedene Richtungen: über die erwarteten Unternehmensgewinne und über den Zins, mit dem diese Gewinne auf heute gerechnet werden.',
      },
      {
        type: 'table',
        caption: 'Dieselbe Nachricht, zwei Wirkungen.',
        head: ['Lage', 'Starke Konjunkturdaten wirken', 'Ergebnis'],
        rows: [
          [
            'Inflation ist das Hauptproblem',
            'Zinserwartung steigt stärker als die Gewinnerwartung',
            'Kurse fallen – „gute Nachricht ist schlechte Nachricht“',
          ],
          [
            'Rezessionsangst ist das Hauptproblem',
            'Gewinnerwartung steigt stärker als die Zinserwartung',
            'Kurse steigen – der Normalfall',
          ],
        ],
      },
      {
        type: 'paragraph',
        text: 'Welche der beiden Zeilen gerade gilt, wechselt im Laufe eines Zyklus. Genau deshalb lässt sich aus einer Datenmeldung keine Kursrichtung ableiten, ohne zu wissen, worüber sich der Markt in diesem Monat sorgt.',
      },
      { type: 'heading', level: 2, text: 'Die ersten Sekunden' },
      {
        type: 'list',
        ordered: true,
        items: [
          'Die Zahl erscheint. Automatische Systeme lesen sie in Millisekunden und handeln, bevor ein Mensch sie gelesen hat.',
          'Die erste Bewegung überschießt regelmäßig und wird binnen Minuten teilweise zurückgenommen.',
          'Danach kommt die Einordnung: Details des Berichts, Korrekturen der Vormonate, Zusammenhang mit anderen Daten. Diese zweite Bewegung geht nicht selten in die Gegenrichtung.',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Was das für Privatanleger heißt',
        items: [
          'Auf eine Veröffentlichung hin zu handeln, ist ein Wettlauf gegen Systeme, die in Mikrosekunden arbeiten und näher an der Datenquelle sitzen. Dieser Wettlauf ist nicht zu gewinnen.',
          'Der Nutzen dieses Bereichs liegt nicht im Reagieren, sondern im Verstehen: zu wissen, warum ein Markt sich bewegt, verhindert Fehlschlüsse – etwa den, aus einem Kursrutsch auf schlechte Wirtschaftsdaten zu schließen.',
        ],
      },
    ],
  },
]
