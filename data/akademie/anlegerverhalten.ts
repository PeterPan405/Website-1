/**
 * Der Zweig „Anlegerverhalten“ der Akademie.
 *
 * ## Warum dieser Zweig eine eigene Schwierigkeit hat
 *
 * Über Denkfehler zu lesen erzeugt zuverlässig ein Gefühl von Überlegenheit.
 * Man erkennt sie – bei anderen. Genau das ist selbst ein dokumentierter
 * Effekt, und er macht diesen Zweig zu dem, der am ehesten das Gegenteil
 * dessen bewirkt, was er soll.
 *
 * Die Lektionen sind deshalb anders gebaut als in den übrigen Zweigen: Jede
 * endet nicht mit „darauf sollte man achten“, sondern mit einer Vorkehrung,
 * die auch dann noch wirkt, wenn man den Fehler in dem Moment nicht bemerkt.
 * Denn bemerken wird man ihn nicht.
 *
 * ## Zur Beleglage
 *
 * Die hier beschriebenen Effekte stammen aus der experimentellen Psychologie
 * und sind überwiegend gut repliziert. Wo ein Effekt in der Wiederholungskrise
 * der Psychologie gelitten hat oder wo seine Übertragung vom Labor auf echte
 * Depots umstritten ist, steht das dabei.
 */

import type { Bereich, Lektion } from '@/data/akademie/types'

export const anlegerverhalten: Bereich = {
  id: 'anlegerverhalten',
  titel: 'Anlegerverhalten',
  sinnbild: 'compass',
  kurz: 'Die dokumentierten Denkfehler beim Anlegen – und die Vorkehrungen, die auch dann wirken, wenn man sie nicht bemerkt.',
  einleitung:
    'Die klassische Finanztheorie unterstellt Menschen, die alle Informationen verarbeiten und nüchtern abwägen. Die Verhaltensökonomie hat über fünfzig Jahre hinweg gezeigt, dass sie das nicht tun – systematisch und in vorhersagbarer Richtung. Diese Lektionen erklären die wichtigsten dieser Muster, was sie im Depot kosten und wie man ihnen begegnet, ohne sich auf die eigene Wachsamkeit zu verlassen.',
  grenzen: [
    'Einen Denkfehler zu kennen schützt nicht davor. Das ist in Untersuchungen mehrfach gezeigt worden und der Grund, warum dieser Bereich auf Vorkehrungen setzt statt auf Aufmerksamkeit.',
    'Viele Effekte stammen aus Laborexperimenten mit kleinen Beträgen. Ob sie sich in derselben Stärke auf Entscheidungen über das eigene Vermögen übertragen, ist im Einzelfall offen.',
    'Die Psychologie hat eine Wiederholungskrise hinter sich: Bekannte Befunde ließen sich in neuen Untersuchungen nicht bestätigen. Wo das einen der hier genannten Effekte betrifft, steht es in der Lektion.',
    'Wer alles Verhalten mit Denkfehlern erklärt, erklärt nichts mehr. Für fast jede Marktbewegung lässt sich im Nachhinein ein passender Effekt finden – das macht die Erklärung wertlos.',
  ],
  reihenfolge: [
    'was-verhaltensoekonomie-ist',
    'verlustaversion',
    'prospect-theory',
    'dispositionseffekt',
    'selbstueberschaetzung',
    'ankereffekt',
    'bestaetigungsfehler',
    'rueckschaufehler',
    'verfuegbarkeit-und-aktualitaet',
    'herdenverhalten',
    'mentale-buchfuehrung',
    'heimatneigung',
    'was-tatsaechlich-hilft',
  ],
}

export const anlegerverhaltenLektionen: Lektion[] = [
  /* ------------------------------------------------------------------ 1 */
  {
    slug: 'was-verhaltensoekonomie-ist',
    bereich: 'anlegerverhalten',
    titel: 'Was Verhaltensökonomie ist',
    kurz: 'Woher das Fach kommt, was es der klassischen Theorie entgegenhält – und warum Wissen allein nicht hilft.',
    kernaussage:
      'Menschen entscheiden nicht falsch im Sinne von zufällig, sondern falsch in eine vorhersagbare Richtung. Genau das macht die Fehler untersuchbar.',
    belegart: 'definition',
    dauer: 7,
    stichworte: ['Verhaltensökonomie', 'Kahneman', 'Denkfehler'],
    lernthemen: ['anlegerpsychologie'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Die Wirtschaftstheorie der Nachkriegszeit rechnete mit einem Menschen, der alle verfügbaren Informationen verarbeitet, konsequent abwägt und seinen Nutzen maximiert. Das war nie als Beschreibung gemeint, sondern als brauchbare Vereinfachung. Ab den 1970er Jahren zeigten Daniel Kahneman und Amos Tversky, dass die Abweichungen weder klein noch zufällig sind.',
      },
      {
        type: 'paragraph',
        text: 'Der entscheidende Punkt ist die **Systematik**. Wären Fehler zufällig, würden sie sich über viele Menschen und viele Entscheidungen ausgleichen, und die Modelle blieben im Mittel richtig. Tatsächlich gehen sie fast alle in dieselbe Richtung – und verstärken sich dadurch, statt sich aufzuheben.',
      },
      { type: 'heading', level: 2, text: 'Zwei Arten zu denken' },
      {
        type: 'table',
        caption: 'Die Unterscheidung, auf der das ganze Fach aufbaut.',
        head: ['', 'Schnelles Denken', 'Langsames Denken'],
        rows: [
          [
            'Arbeitsweise',
            'automatisch, mühelos, immer an',
            'bewusst, anstrengend, träge',
          ],
          [
            'Stärke',
            'Muster, Gesichter, Gefahren',
            'Rechnen, Abwägen, Widersprüche prüfen',
          ],
          [
            'Beim Anlegen',
            'fast alle Entscheidungen im Alltag',
            'wird selten eingeschaltet und ermüdet schnell',
          ],
        ],
      },
      {
        type: 'paragraph',
        text: 'Die meisten Fehlgriffe entstehen, weil das schnelle System eine Frage beantwortet, die einfacher ist als die gestellte. Statt „Ist diese Aktie ihren Preis wert?“ beantwortet es „Kenne ich das Unternehmen und mag ich es?“ – und liefert das Ergebnis mit demselben Gefühl von Sicherheit.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Warum dieser Bereich auf Vorkehrungen setzt',
        items: [
          'Untersuchungen zur Aufklärung über Denkfehler finden regelmäßig, dass Wissen die Anfälligkeit kaum senkt. Man erkennt die Fehler zuverlässig bei anderen und nicht bei sich.',
          'Was wirkt, sind Entscheidungen, die vorher getroffen und dann nicht mehr angefasst werden: ein Sparplan, eine schriftliche Regel, eine feste Aufteilung. Sie umgehen den Moment, in dem der Fehler passiert.',
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 2 */
  {
    slug: 'verlustaversion',
    bereich: 'anlegerverhalten',
    titel: 'Verlustaversion',
    kurz: 'Warum ein Verlust ungefähr doppelt so schwer wiegt wie ein gleich großer Gewinn.',
    kernaussage:
      'Verluste werden stärker empfunden als gleich große Gewinne. Aus dieser Asymmetrie folgen die meisten teuren Anlegerentscheidungen.',
    belegart: 'beobachtung',
    dauer: 7,
    stichworte: ['Verlustaversion', 'Asymmetrie', 'Kahneman'],
    setztVoraus: ['was-verhaltensoekonomie-ist'],
    lernthemen: ['anlegerpsychologie', 'risiko-und-rendite'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Ein einfaches Angebot: Bei Kopf gewinnen Sie 150 Euro, bei Zahl verlieren Sie 100. Der Erwartungswert ist eindeutig positiv, und die große Mehrheit lehnt trotzdem ab. Erst ab einem Gewinn von etwa dem Doppelten des möglichen Verlustes nimmt eine Mehrheit an.',
      },
      {
        type: 'paragraph',
        text: 'Dieses Verhältnis von rund zwei zu eins ist in vielen Untersuchungen gemessen worden und einer der stabilsten Befunde des Fachs. Es beschreibt keine Ängstlichkeit, sondern eine Asymmetrie der Empfindung: Der Schmerz eines Verlusts ist stärker als die Freude über einen gleich großen Gewinn.',
      },
      { type: 'heading', level: 2, text: 'Was daraus im Depot folgt' },
      {
        type: 'list',
        items: [
          '**Zu wenig Aktien.** Wer die Schwankung als Schmerz erlebt, wählt eine Aufteilung, die über Jahrzehnte Rendite kostet – der teuerste Fehler von allen und der unauffälligste.',
          '**Häufiges Nachsehen macht es schlimmer.** Wer täglich in sein Depot schaut, sieht an etwa der Hälfte der Tage ein Minus. Wer einmal im Jahr schaut, sieht in den meisten Jahren ein Plus – bei identischer Anlage.',
          '**Verlustpositionen werden gehalten.** Solange nicht verkauft wurde, fühlt sich der Verlust nicht endgültig an. Diesem Muster ist eine eigene Lektion gewidmet.',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Der Denkfehler mit der Rückkehr',
        items: [
          'Der Satz „Ich verkaufe, wenn ich wieder bei null bin“ macht den eigenen Einstandskurs zum Maßstab. Der Markt kennt diesen Kurs nicht und richtet sich nicht danach.',
          'Die einzige sinnvolle Frage lautet: Würde ich diese Position heute zu diesem Preis kaufen? Wenn nein, ist der Einstandskurs kein Grund, sie zu behalten.',
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Die Vorkehrung',
        items: [
          'Seltener nachsehen. Ein fester Termin – etwa zweimal im Jahr – nimmt der Schwankung ihre Wirkung, ohne dass man sich zusammenreißen müsste.',
          'Die Aufteilung schriftlich festhalten, solange nichts passiert. Ein Satz, der in ruhiger Lage aufgeschrieben wurde, trägt in unruhiger.',
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 3 */
  {
    slug: 'prospect-theory',
    bereich: 'anlegerverhalten',
    titel: 'Die Prospect Theory',
    kurz: 'Das Modell hinter der Verlustaversion: Bezugspunkt, gekrümmter Wert und die Überschätzung kleiner Wahrscheinlichkeiten.',
    kernaussage:
      'Menschen bewerten nicht Endzustände, sondern Veränderungen gegenüber einem Bezugspunkt – und der Bezugspunkt lässt sich verschieben.',
    belegart: 'deutung',
    dauer: 9,
    stichworte: ['Prospect Theory', 'Bezugspunkt', 'Wahrscheinlichkeitsgewichtung'],
    setztVoraus: ['verlustaversion'],
    lernthemen: ['anlegerpsychologie'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Die **Prospect Theory** von Kahneman und Tversky (1979) ist die meistzitierte Arbeit ihres Fachs und der Grund für den Wirtschaftsnobelpreis 2002. Sie beschreibt Entscheidungen unter Unsicherheit mit drei Bausteinen, die alle drei der klassischen Theorie widersprechen.',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Bezugspunkt.** Bewertet wird nicht das Endvermögen, sondern der Gewinn oder Verlust gegenüber einem Ausgangspunkt. Ob 100.000 Euro gut oder schlecht sind, hängt davon ab, ob vorher 80.000 oder 130.000 dastanden.',
          '**Abnehmende Empfindlichkeit.** Der Unterschied zwischen 0 und 100 Euro wiegt schwerer als der zwischen 1.000 und 1.100. Das gilt in beide Richtungen.',
          '**Verzerrte Wahrscheinlichkeiten.** Sehr kleine Wahrscheinlichkeiten werden überschätzt, mittlere und hohe unterschätzt.',
        ],
      },
      { type: 'heading', level: 2, text: 'Die Folge: Risikoverhalten kippt' },
      {
        type: 'table',
        caption: 'Dieselbe Person, entgegengesetztes Verhalten.',
        head: ['Lage', 'Verhalten', 'Im Depot'],
        rows: [
          [
            'im Gewinn',
            'risikoscheu – der sichere Gewinn wird bevorzugt',
            'Gewinner werden zu früh verkauft',
          ],
          [
            'im Verlust',
            'risikofreudig – lieber die Chance auf null als der sichere Verlust',
            'Verlierer werden gehalten und nachgekauft',
          ],
        ],
      },
      {
        type: 'paragraph',
        text: 'Der dritte Baustein erklärt zwei Geschäfte, die nebeneinander widersprüchlich wirken: Dieselbe Person kauft ein Lotterielos und schließt eine Versicherung ab. Beides beruht auf der Überschätzung kleiner Wahrscheinlichkeiten – einmal des großen Gewinns, einmal des seltenen Schadens.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Wo das Modell an seine Grenzen kommt',
        items: [
          'Der Bezugspunkt ist im Modell nicht festgelegt. Er ergibt sich aus der Darstellung der Situation – und genau darin liegt die Schwäche: Was der Bezugspunkt ist, weiß man oft erst hinterher.',
          'Damit lässt sich fast jedes beobachtete Verhalten nachträglich erklären, indem man den passenden Bezugspunkt annimmt. Eine Theorie, die alles erklärt, sagt wenig voraus.',
          'Für die Praxis bleibt trotzdem eine handfeste Einsicht: Wer die Darstellung ändert, ändert die Entscheidung – auch bei sich selbst.',
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 4 */
  {
    slug: 'dispositionseffekt',
    bereich: 'anlegerverhalten',
    titel: 'Der Dispositionseffekt',
    kurz: 'Gewinner zu früh verkaufen, Verlierer zu lange halten – der am besten belegte Fehler in echten Depots.',
    kernaussage:
      'Anleger verkaufen Positionen im Gewinn deutlich häufiger als solche im Verlust. Das kostet Rendite und obendrein Steuer.',
    belegart: 'beobachtung',
    dauer: 8,
    stichworte: ['Dispositionseffekt', 'Realisieren', 'Verlustposition'],
    setztVoraus: ['prospect-theory'],
    lernthemen: ['wann-kaufen-verkaufen', 'sparerpauschbetrag'],
    rechner: ['steuerrechner'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Dieser Effekt ist deshalb besonders gut belegt, weil er nicht im Labor gemessen wurde, sondern in Millionen echter Wertpapierabrechnungen. Untersuchungen an Depotdaten großer Broker finden ihn übereinstimmend: Die Wahrscheinlichkeit, eine Position zu verkaufen, ist im Gewinn deutlich höher als im Verlust.',
      },
      {
        type: 'paragraph',
        text: 'Der Mechanismus folgt unmittelbar aus der vorigen Lektion: Ein Verkauf im Plus liefert das gute Gefühl eines realisierten Gewinns. Ein Verkauf im Minus macht den Verlust endgültig – und solange nicht verkauft wurde, fühlt er sich vorläufig an, obwohl er buchhalterisch längst eingetreten ist.',
      },
      { type: 'heading', level: 2, text: 'Warum es doppelt teuer ist' },
      {
        type: 'list',
        items: [
          '**Renditeseite.** Untersuchungen finden, dass die verkauften Gewinner anschließend im Mittel besser laufen als die behaltenen Verlierer. Die Auswahl ist also nicht nur zufällig, sondern verkehrt herum.',
          '**Steuerseite.** In Deutschland fällt auf realisierte Gewinne Abgeltungsteuer an. Wer Gewinne früh realisiert und Verluste liegen lässt, zahlt früher Steuer und verzichtet auf die Verrechnung – der Zinseszinsvorteil des Aufschubs geht verloren.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Damit ist der Dispositionseffekt der einzige der hier behandelten Fehler, bei dem sich der Schaden für den einzelnen Anleger annähernd beziffern lässt: Er besteht aus der Renditedifferenz und der vorgezogenen Steuerzahlung.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Die üblichen Ausreden',
        items: [
          '„Gewinne mitnehmen kann nie falsch sein.“ Doch – wenn die Position weiter läuft und man dafür eine schlechtere behält.',
          '„Ich verkaufe erst, wenn ich wieder im Plus bin.“ Der Einstandskurs ist eine Zahl in der eigenen Abrechnung und sonst nirgends.',
          '„Nachkaufen senkt den Einstandskurs.“ Richtig – und erhöht den Einsatz in genau der Position, bei der man sich bisher geirrt hat.',
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Die Vorkehrung',
        items: [
          'Vor dem Kauf aufschreiben, unter welcher Bedingung wieder verkauft wird – inhaltlich, nicht nach Kurs. Zum Beispiel: wenn die Annahme über das Geschäftsmodell nicht mehr trägt.',
          'Einmal im Jahr die Frage stellen: Würde ich jede dieser Positionen heute zum aktuellen Kurs neu kaufen? Wer sie ehrlich beantwortet, umgeht den Einstandskurs vollständig.',
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 5 */
  {
    slug: 'selbstueberschaetzung',
    bereich: 'anlegerverhalten',
    titel: 'Selbstüberschätzung',
    kurz: 'Warum fast alle sich für überdurchschnittlich halten und was das an Handelskosten verursacht.',
    kernaussage:
      'Wer sich für überdurchschnittlich gut hält, handelt häufiger. Häufiger handeln kostet – und zwar messbar.',
    belegart: 'beobachtung',
    dauer: 8,
    stichworte: ['Selbstüberschätzung', 'Handelshäufigkeit', 'Kontrollillusion'],
    setztVoraus: ['was-verhaltensoekonomie-ist'],
    lernthemen: ['kosten-und-gebuehren', 'anlegerpsychologie'],
    rechner: ['kostenrechner'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'In Befragungen halten sich regelmäßig weit über die Hälfte der Teilnehmer für überdurchschnittliche Autofahrer. Beim Anlegen ist es nicht anders, und dort hat die Fehleinschätzung einen Preis.',
      },
      {
        type: 'paragraph',
        text: 'Die bekannteste Untersuchung dazu wertete die Depots zehntausender Privatanleger über sechs Jahre aus. Ergebnis: Die Gruppe mit dem häufigsten Handel erzielte nach Kosten deutlich weniger als die mit dem seltensten – bei ähnlicher Bruttorendite. Der Unterschied bestand fast vollständig aus Handelskosten.',
      },
      { type: 'heading', level: 2, text: 'Drei Formen derselben Sache' },
      {
        type: 'table',
        caption: 'Wie sich Selbstüberschätzung äußert.',
        head: ['Form', 'Beschreibung', 'Folge'],
        rows: [
          [
            'Überschätzung der Genauigkeit',
            'Die eigene Schätzspanne ist zu eng',
            'Zu große Positionen, zu wenig Streuung',
          ],
          [
            'Überschätzung im Vergleich',
            'Man hält sich für besser als die anderen',
            'Häufiger Handel gegen genau diese anderen',
          ],
          [
            'Kontrollillusion',
            'Man hält Zufall für beeinflussbar',
            'Mehr Handel bei Werten, die man zu kennen glaubt',
          ],
        ],
      },
      {
        type: 'paragraph',
        text: 'Die zweite Zeile enthält den logischen Kern: Jedes Wertpapiergeschäft hat eine Gegenseite. Wer kauft, kauft von jemandem, der zum selben Preis verkaufen will. Beide können nicht recht haben – und häufig sitzt auf der anderen Seite ein Institut mit besseren Daten.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Was den Effekt verstärkt',
        items: [
          '**Eine gute Phase.** Nach Gewinnen steigt die Handelshäufigkeit messbar. Zugeschrieben wird der Erfolg dem eigenen Können, nicht dem Markt, der insgesamt gestiegen ist.',
          '**Apps mit Belohnungsmechanik.** Farben, Bestenlisten und kostenfreier Handel senken die Hemmschwelle. Untersuchungen finden bei solchen Zugängen deutlich höhere Umsatzraten.',
          '**Viel Information.** Mehr Daten erhöhen die Sicherheit der Einschätzung stärker als ihre Treffsicherheit. Das ist getrennt gemessen worden – die Sicherheit steigt, die Trefferquote kaum.',
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 6 */
  {
    slug: 'ankereffekt',
    bereich: 'anlegerverhalten',
    titel: 'Der Ankereffekt',
    kurz: 'Wie eine willkürliche Zahl die nächste Schätzung verschiebt – auch wenn man weiß, dass sie willkürlich ist.',
    kernaussage:
      'Jede genannte Zahl wird zum Bezugspunkt für die nächste Schätzung, selbst wenn sie erkennbar nichts mit der Sache zu tun hat.',
    belegart: 'beobachtung',
    dauer: 7,
    stichworte: ['Ankereffekt', 'Bezugspunkt', 'Schätzung'],
    setztVoraus: ['was-verhaltensoekonomie-ist'],
    lernthemen: ['anlegerpsychologie'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Im klassischen Versuch drehten Teilnehmer ein Glücksrad und sollten anschließend schätzen, wie viele afrikanische Staaten Mitglied der Vereinten Nationen sind. Wer eine hohe Zahl gedreht hatte, schätzte höher. Das Rad war erkennbar Zufall, und es wirkte trotzdem.',
      },
      {
        type: 'paragraph',
        text: 'Beim Anlegen sind Anker allgegenwärtig, und die meisten davon werden gar nicht als Zahlenangabe wahrgenommen.',
      },
      {
        type: 'list',
        items: [
          '**Der eigene Einstandskurs.** Der wirkungsvollste Anker überhaupt – er teilt jede Position in „im Plus“ und „im Minus“ und bestimmt darüber, wie sie beurteilt wird.',
          '**Das Jahreshoch.** Eine Aktie, die von 100 auf 70 gefallen ist, wirkt günstig. Ob 70 günstig ist, hat mit den 100 nichts zu tun.',
          '**Kursziele in Analysen.** Eine genannte Zahl verschiebt die eigene Einschätzung, unabhängig davon, wie sie zustande kam.',
          '**Runde Zahlen.** Kurse häufen sich um glatte Marken, und Orders werden dort gebündelt platziert – ein Anker, der sich im Orderbuch abbildet.',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Warum Aufmerksamkeit hier besonders wenig hilft',
        items: [
          'Der Effekt tritt auch dann auf, wenn die Teilnehmer vorher darüber aufgeklärt wurden. Er wirkt unterhalb der bewussten Abwägung.',
          'Er tritt ebenfalls bei Fachleuten auf. In Untersuchungen mit Immobiliengutachtern verschob ein genannter Angebotspreis die Wertermittlung deutlich – bei Fachleuten, die angaben, ihn nicht beachtet zu haben.',
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Die Vorkehrung',
        items: [
          'Die eigene Einschätzung aufschreiben, bevor man fremde Zahlen ansieht. Ein notierter Wert lässt sich anschließend vergleichen; ein nur gedachter passt sich unbemerkt an.',
          'Bewusst von der Gegenrichtung her prüfen: Was müsste zutreffen, damit dieser Kurs zu hoch ist? Diese Frage arbeitet gegen den Anker statt mit ihm.',
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 7 */
  {
    slug: 'bestaetigungsfehler',
    bereich: 'anlegerverhalten',
    titel: 'Der Bestätigungsfehler',
    kurz: 'Warum man nach Belegen sucht statt nach Gegenbelegen – und wie Empfehlungsalgorithmen das verstärken.',
    kernaussage:
      'Wer eine Meinung hat, sucht bevorzugt nach Bestätigung. Der einzige wirksame Gegenzug ist, gezielt nach dem Gegenteil zu suchen.',
    belegart: 'beobachtung',
    dauer: 8,
    stichworte: ['Bestätigungsfehler', 'Confirmation Bias', 'Informationsauswahl'],
    setztVoraus: ['selbstueberschaetzung'],
    lernthemen: ['anlegerpsychologie'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Der Bestätigungsfehler wirkt an drei Stellen gleichzeitig: bei der Auswahl der Informationen, bei ihrer Bewertung und beim Erinnern. Wer eine Aktie besitzt, liest häufiger die zustimmenden Analysen, hält die widersprechenden für schwächer begründet und erinnert sich später besser an die zustimmenden.',
      },
      {
        type: 'paragraph',
        text: 'Im bekanntesten Versuch dazu bekamen Teilnehmer eine Zahlenfolge und sollten die dahinterliegende Regel finden, indem sie eigene Folgen zur Prüfung vorschlugen. Fast alle schlugen ausschließlich Folgen vor, die ihrer Vermutung entsprachen – und bekamen deshalb nur Bestätigungen. Wer eine Regel widerlegen will, muss Beispiele wählen, von denen er annimmt, dass sie nicht passen.',
      },
      { type: 'heading', level: 2, text: 'Was heute dazukommt' },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Die Verstärkung von außen',
        items: [
          '**Empfehlungssysteme.** Was angezeigt wird, richtet sich danach, was zuvor angeklickt wurde. Wer einmal nach einer Aktie gesucht hat, bekommt danach überwiegend Zustimmendes – der Fehler wird von der Technik bedient.',
          '**Foren und Gruppen zu einzelnen Werten.** Wer skeptisch ist, geht dort nicht hin oder wird nicht gehört. Die Zustimmung im Forum ist deshalb kein Signal, sondern eine Folge der Auswahl.',
          '**Die eigene Position als Filter.** Sobald man gekauft hat, ändert sich die Bewertung derselben Nachricht. Das ist gemessen worden und tritt sofort ein.',
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Die Vorkehrung',
        items: [
          'Vor dem Kauf drei Gründe aufschreiben, die dagegen sprechen. Wer keine drei findet, hat nicht genug gesucht.',
          'Gezielt die bestbegründete Gegenposition suchen – nicht die dümmste. Ein schwaches Gegenargument bestärkt nur.',
          'Bei jeder Bestätigung fragen: Hätte ich diese Quelle auch gelesen, wenn sie das Gegenteil geschrieben hätte?',
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 8 */
  {
    slug: 'rueckschaufehler',
    bereich: 'anlegerverhalten',
    titel: 'Der Rückschaufehler',
    kurz: 'Warum im Nachhinein alles absehbar war und weshalb das jedes Lernen aus Erfahrung untergräbt.',
    kernaussage:
      'Wer das Ergebnis kennt, erinnert seine frühere Einschätzung als treffender, als sie war. Damit fällt die Grundlage weg, aus der man lernen könnte.',
    belegart: 'beobachtung',
    dauer: 7,
    stichworte: ['Rückschaufehler', 'Hindsight Bias', 'Erinnerung'],
    setztVoraus: ['bestaetigungsfehler'],
    lernthemen: ['groesste-crashes', 'anlegerpsychologie'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Nach jedem Crash gibt es zahlreiche Menschen, die ihn kommen sahen. Ein Teil davon hat es tatsächlich vorher gesagt. Der größere Teil erinnert sich lediglich so – und zwar aufrichtig.',
      },
      {
        type: 'paragraph',
        text: 'In Versuchen wurden Teilnehmer vor einem Ereignis nach ihrer Einschätzung gefragt und danach gebeten, ihre eigene frühere Antwort wiederzugeben. Die Erinnerung verschob sich verlässlich in Richtung des tatsächlichen Ausgangs, ohne dass es den Teilnehmern auffiel.',
      },
      { type: 'heading', level: 2, text: 'Warum das teuer ist' },
      {
        type: 'list',
        items: [
          '**Lernen wird unmöglich.** Wer glaubt, es vorher gewusst zu haben, sieht keinen Anlass, seine Vorgehensweise zu ändern.',
          '**Die Vergangenheit wirkt berechenbarer, als sie war.** Daraus entsteht die Erwartung, die Zukunft ähnlich lesen zu können.',
          '**Gute Entscheidungen mit schlechtem Ausgang werden verworfen.** Eine breit gestreute Anlage ist richtig, auch wenn eine Einzelwette in diesem Jahr mehr gebracht hätte. Wer nur am Ergebnis misst, lernt das Falsche.',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Ergebnis und Entscheidung sind zweierlei',
        items: [
          'Eine Entscheidung wird an dem gemessen, was zum Zeitpunkt bekannt war – nicht an dem, was daraus wurde. Wer beim Roulette auf eine Zahl setzt und gewinnt, hat trotzdem schlecht entschieden.',
          'Umgekehrt ist ein Verlust kein Beweis für einen Fehler. Bei Anlagen mit Unsicherheit gehen auch richtige Entscheidungen regelmäßig schief.',
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Die Vorkehrung',
        items: [
          'Ein Anlagetagebuch. Vor jeder Entscheidung zwei Sätze: was erwartet wird und woran man erkennen würde, dass man falsch lag. Das aufgeschriebene Wort ist die einzige Erinnerung, die sich nicht anpasst.',
          'Nach einem Jahr nachlesen. Der Abstand zwischen dem Notierten und dem Erinnerten ist die eigentliche Lehre.',
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 9 */
  {
    slug: 'verfuegbarkeit-und-aktualitaet',
    bereich: 'anlegerverhalten',
    titel: 'Verfügbarkeit und Aktualität',
    kurz: 'Warum das Erinnerbare für häufig gehalten wird und das Jüngste für maßgeblich.',
    kernaussage:
      'Wahrscheinlichkeit wird danach geschätzt, wie leicht ein Beispiel einfällt. Medien entscheiden damit mit, was für wahrscheinlich gehalten wird.',
    belegart: 'beobachtung',
    dauer: 7,
    stichworte: ['Verfügbarkeitsheuristik', 'Aktualitätseffekt', 'Wahrnehmung'],
    setztVoraus: ['was-verhaltensoekonomie-ist'],
    lernthemen: ['anlegerpsychologie', 'groesste-crashes'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Zwei eng verwandte Muster: Die **Verfügbarkeitsheuristik** schätzt Häufigkeit danach, wie leicht ein Beispiel einfällt. Der **Aktualitätseffekt** gewichtet das Jüngste stärker als das Ältere. Beide führen dazu, dass die Erfahrung der letzten Monate für den Normalfall gehalten wird.',
      },
      {
        type: 'table',
        caption: 'Wie sich das im Depot niederschlägt.',
        head: ['Nach welcher Phase', 'Was für normal gehalten wird', 'Was daraus folgt'],
        rows: [
          [
            'einer langen Hausse',
            'Kurse steigen; Rückschläge sind Kaufgelegenheiten',
            'Risiko wird erhöht, gerade wenn es teuer ist',
          ],
          [
            'einem Crash',
            'Es kann noch viel tiefer gehen',
            'Ausstieg nach dem Fall, Wiedereinstieg nach der Erholung',
          ],
          [
            'einem Skandal in einer Branche',
            'Diese Branche ist besonders gefährlich',
            'Pauschale Meidung, unabhängig vom Einzelfall',
          ],
        ],
      },
      {
        type: 'paragraph',
        text: 'Verstärkt wird beides durch die Berichterstattung. Berichtet wird über das Seltene und Dramatische – deshalb kommt es einem häufiger vor. Ein Flugzeugabsturz ist überall, die Millionen unauffälliger Flüge sind nirgends. Bei Kursen ist es dasselbe: Über einen Absturz wird geschrieben, über zwölf ruhige Monate nicht.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Wo die Verzerrung am teuersten ist',
        items: [
          'Bei der Einschätzung von Rückgängen. Wer nur die letzten fünf ruhigen Jahre erinnert, unterschätzt, was ein Aktienmarkt tun kann – Halbierungen sind mehrfach vorgekommen.',
          'Bei der Auswahl von Fonds. Ausgewählt wird fast immer nach der jüngsten Wertentwicklung. Genau davon rät jeder Pflichthinweis ab, und genau das tun die Zuflüsse.',
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Die Vorkehrung',
        items: [
          'Sich lange Zeitreihen ansehen statt Jahresübersichten. Wer die Kursverläufe über hundert Jahre kennt, hat mehr Beispiele im Kopf als die aus der eigenen Erfahrung.',
          'Vor jeder Entscheidung nach der Grundhäufigkeit fragen: Wie oft kommt das eigentlich vor – nicht: Wie oft habe ich zuletzt davon gelesen?',
        ],
      },
    ],
  },

  /* ----------------------------------------------------------------- 10 */
  {
    slug: 'herdenverhalten',
    bereich: 'anlegerverhalten',
    titel: 'Herdenverhalten',
    kurz: 'Warum es vernünftig sein kann, anderen zu folgen – und wann daraus eine Blase wird.',
    kernaussage:
      'Anderen zu folgen ist für den Einzelnen oft rational und für den Markt als Ganzes zerstörerisch. Genau daraus entstehen Blasen.',
    belegart: 'deutung',
    dauer: 8,
    stichworte: ['Herdenverhalten', 'Blase', 'Informationskaskade'],
    setztVoraus: ['verfuegbarkeit-und-aktualitaet'],
    lernthemen: ['groesste-crashes', 'anlegerpsychologie'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Herdenverhalten wird meist als Schwäche beschrieben. Das greift zu kurz: In vielen Lagen ist es die vernünftige Antwort auf fehlende Information. Wer nichts weiß und sieht, dass andere etwas tun, darf annehmen, dass sie einen Grund haben.',
      },
      {
        type: 'paragraph',
        text: 'Aus dieser Vernunft entsteht das Problem. Wenn jeder auf das Verhalten der anderen schließt statt auf eigene Information, kann eine **Informationskaskade** entstehen: Alle folgen, aber niemand hat die Sache selbst geprüft. Die Bewegung sieht dann breit abgestützt aus und ruht auf nichts.',
      },
      { type: 'heading', level: 2, text: 'Warum Fachleute mitlaufen' },
      {
        type: 'list',
        items: [
          '**Berufliches Risiko.** Ein Fondsmanager, der mit der Masse falsch liegt, behält seine Stelle. Wer allein falsch liegt, nicht. Diese Asymmetrie wirkt in Richtung Anpassung.',
          '**Messung am Vergleichsmaßstab.** Wer an einem Index gemessen wird, weicht nur begrenzt von ihm ab – auch wenn er die Zusammensetzung für falsch hält.',
          '**Der Zwang der Zuflüsse.** Steigt ein Wert, wächst sein Indexgewicht, und indexnahe Fonds müssen nachkaufen. Das ist kein Verhalten, sondern Mechanik – wirkt aber genauso.',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Woran sich eine Übertreibung erkennen lässt – und woran nicht',
        items: [
          'Wiederkehrende Anzeichen: Begründungen, warum diesmal andere Maßstäbe gelten; Kredithebel bei Privatanlegern; Berichterstattung außerhalb der Wirtschaftsteile; steile Preisanstiege ohne veränderte Erträge.',
          'Was nicht funktioniert: daraus einen Zeitpunkt abzuleiten. Alle diese Anzeichen waren in den späten 1990er Jahren schon Jahre vor dem Höhepunkt sichtbar, und wer danach ausgestiegen ist, hat eine Verdopplung verpasst.',
          'Der Satz, dass ein Markt länger unvernünftig bleiben kann, als man zahlungsfähig bleibt, wird meist John Maynard Keynes zugeschrieben. Belegt ist die Zuschreibung nicht – zutreffend ist sie trotzdem.',
        ],
      },
    ],
  },

  /* ----------------------------------------------------------------- 11 */
  {
    slug: 'mentale-buchfuehrung',
    bereich: 'anlegerverhalten',
    titel: 'Mentale Buchführung',
    kurz: 'Warum dasselbe Geld je nach Herkunft anders behandelt wird – und was das im Depot anrichtet.',
    kernaussage:
      'Geld wird gedanklich in Töpfe sortiert, die verschieden behandelt werden. Für den Kontostand ist es dasselbe Geld.',
    belegart: 'beobachtung',
    dauer: 7,
    stichworte: ['Mental Accounting', 'Töpfe', 'Thaler'],
    setztVoraus: ['prospect-theory'],
    lernthemen: ['budget-und-sparquote', 'portfolio-aufbau'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Richard Thaler beschrieb in den 1980er Jahren, dass Menschen Geld nicht als eine Summe behandeln, sondern in getrennten gedanklichen Konten führen. Ein Lottogewinn wird anders ausgegeben als ein Monatsgehalt, obwohl beides denselben Wert hat.',
      },
      { type: 'heading', level: 2, text: 'Wo es beim Anlegen schadet' },
      {
        type: 'table',
        caption: 'Vier verbreitete Fälle.',
        head: ['Verhalten', 'Was dabei übersehen wird'],
        rows: [
          [
            'Kredit mit 8 % laufen lassen und gleichzeitig für 2 % sparen',
            'Der Saldo verliert jedes Jahr sechs Prozentpunkte',
          ],
          [
            'Kursgewinne riskanter anlegen als eingezahltes Geld',
            'Für das Vermögen ist beides derselbe Betrag',
          ],
          [
            'Dividenden ausgeben, Kursgewinne behalten',
            'Beides ist Ertrag; die Dividende senkt den Kurs entsprechend',
          ],
          [
            'Depots getrennt betrachten statt zusammen',
            'Das Risiko ergibt sich aus dem Gesamtbild, nicht je Konto',
          ],
        ],
      },
      {
        type: 'paragraph',
        text: 'Die dritte Zeile ist besonders folgenreich, weil sie sich als Anlagestrategie tarnt. Wer nur von den Dividenden lebt und den Bestand nicht antasten will, behandelt zwei Formen desselben Ertrags verschieden – und wählt seine Anlagen danach aus, was einen guten Topf füllt statt was den höchsten Gesamtertrag bringt.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Wo das Sortieren in Töpfe hilft',
        items: [
          'Es ist nicht durchgehend schädlich. Ein getrennter Notgroschen, der nicht angetastet wird, funktioniert gerade deshalb, weil er gedanklich abgetrennt ist.',
          'Auch das Sparen für ein bestimmtes Ziel wirkt besser, wenn es ein eigenes Konto hat. Die Trennung ist dann eine Selbstbindung und kein Denkfehler.',
          'Schädlich wird es dort, wo die Töpfe verschiedene Risikoentscheidungen für dasselbe Geld erzeugen – oder wo ein teurer Kredit neben einem Guthaben stehen bleibt.',
        ],
      },
    ],
  },

  /* ----------------------------------------------------------------- 12 */
  {
    slug: 'heimatneigung',
    bereich: 'anlegerverhalten',
    titel: 'Heimatneigung',
    kurz: 'Warum fast alle zu viel im eigenen Land anlegen und weshalb Vertrautheit mit Sicherheit verwechselt wird.',
    kernaussage:
      'Anleger halten weltweit einen Vielfachen des Anteils, den ihr Heimatmarkt an den Weltbörsen hat. Vertrautheit ist keine Information.',
    belegart: 'beobachtung',
    dauer: 8,
    stichworte: ['Home Bias', 'Heimatneigung', 'Streuung'],
    setztVoraus: ['selbstueberschaetzung'],
    lernthemen: ['aktien-laender-branchen', 'portfolio-aufbau'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Der deutsche Aktienmarkt macht an der weltweiten Börsenkapitalisierung einen niedrigen einstelligen Prozentanteil aus. In deutschen Privatdepots liegt der Anteil deutscher Aktien um ein Vielfaches darüber. Dasselbe Muster findet sich in praktisch jedem Land, das untersucht wurde.',
      },
      {
        type: 'paragraph',
        text: 'Die üblichen Erklärungen – Wechselkursrisiko, Steuern, Kosten – reichen zur Begründung nicht aus: Sie sind über die Jahrzehnte stark gefallen, die Heimatneigung ist geblieben. Was bleibt, ist die **Vertrautheit**: Man kennt die Unternehmen aus dem Alltag und hält das für Wissen.',
      },
      { type: 'heading', level: 2, text: 'Warum es doppelt riskant ist' },
      {
        type: 'list',
        items: [
          '**Weniger Streuung.** Ein einzelner Markt kann über sehr lange Zeiträume zurückbleiben. Der japanische Markt brauchte nach 1989 mehr als drei Jahrzehnte bis zum alten Stand.',
          '**Häufungen im Index.** Ein kleiner Heimatindex ist selten breit aufgestellt. Wenige Branchen bestimmen dann einen großen Teil der Bewegung.',
          '**Bündelung mit dem Einkommen.** Wer im eigenen Land arbeitet, hat dort bereits sein wichtigstes Vermögen – die künftigen Arbeitseinkommen. Wer dann auch noch heimisch anlegt, verdoppelt dasselbe Risiko.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Der dritte Punkt wird am häufigsten übersehen und wiegt am schwersten. Wer in der Automobilzulieferung arbeitet und Aktien desselben Sektors hält, verliert im schlechten Fall Arbeitsplatz und Ersparnisse gleichzeitig.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Vertrautheit ist kein Informationsvorsprung',
        items: [
          'Ein Unternehmen aus der Werbung zu kennen sagt nichts über seine Bewertung. Genau diese Verwechslung ist gemeint, wenn empfohlen wird, „zu kaufen, was man kennt“ – der Rat war nie so gemeint und wird fast immer so verstanden.',
          'Am gefährlichsten ist der Sonderfall Belegschaftsaktien: vergünstigt, vertraut, und im Ernstfall fallen Arbeitsplatz und Depot zusammen. Diese Kombination hat bei mehreren Unternehmenszusammenbrüchen Existenzen gekostet.',
        ],
      },
    ],
  },

  /* ----------------------------------------------------------------- 13 */
  {
    slug: 'was-tatsaechlich-hilft',
    bereich: 'anlegerverhalten',
    titel: 'Was tatsächlich hilft',
    kurz: 'Die Vorkehrungen, die auch dann wirken, wenn man den Fehler im Moment nicht bemerkt.',
    kernaussage:
      'Gegen Denkfehler hilft keine Aufmerksamkeit, sondern eine Entscheidung, die vorher getroffen wurde und im Moment nicht mehr zur Debatte steht.',
    belegart: 'deutung',
    dauer: 8,
    stichworte: ['Selbstbindung', 'Regeln', 'Sparplan'],
    setztVoraus: ['heimatneigung'],
    lernthemen: ['cost-average-sparplan', 'portfolio-aufbau', 'wann-kaufen-verkaufen'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Zwölf Lektionen über Denkfehler laufen auf eine unbequeme Schlussfolgerung hinaus: Man wird sie nicht bemerken. Sie fühlen sich nicht wie Fehler an, sondern wie Einsichten. Was hilft, sind deshalb Vorkehrungen, die ohne Wachsamkeit auskommen.',
      },
      { type: 'heading', level: 2, text: 'Die fünf, die belegt sind' },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Automatisieren.** Ein Sparplan trifft die Entscheidung einmal und danach nicht mehr. Er entzieht Timing, Stimmung und Nachrichtenlage jeden Zugriff.',
          '**Vorher aufschreiben.** Die Aufteilung, die Verkaufsbedingung und die Erwartung – in ruhiger Lage notiert. Das schriftliche Wort hält der Erinnerung stand, das gedachte nicht.',
          '**Seltener nachsehen.** Weniger Blicke bedeuten weniger gesehene Verluste und weniger Anlässe zu handeln. Zweimal im Jahr genügt für alles, was zu tun ist.',
          '**Reibung einbauen.** Eine Nacht zwischen Entschluss und Order. Die meisten Fehlgriffe entstehen in Minuten, in denen etwas als dringend erscheint.',
          '**Breit streuen.** Streuung schützt nicht nur vor Marktrisiken, sondern vor den eigenen Fehleinschätzungen. Wer breit anlegt, muss seltener recht haben.',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Was dagegen nicht wirkt',
        items: [
          '**Sich vornehmen, ruhig zu bleiben.** In Untersuchungen der wirkungsloseste Ansatz. Der Vorsatz wird genau dann aufgegeben, wenn er gebraucht würde.',
          '**Mehr Information.** Sie erhöht die Sicherheit stärker als die Treffsicherheit. Wer mehr liest, entscheidet nicht besser, sondern überzeugter.',
          '**Aus dem eigenen Fehler lernen wollen.** Der Rückschaufehler verhindert es zuverlässig – es sei denn, es steht etwas Geschriebenes daneben.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Der gemeinsame Nenner aller fünf wirksamen Punkte ist derselbe: Sie verlagern die Entscheidung aus dem Moment heraus, in dem sie schwerfällt. Das ist kein Trick, sondern die einzige Methode, die bei einem Fehler funktioniert, den man nicht bemerkt.',
      },
    ],
  },
]
