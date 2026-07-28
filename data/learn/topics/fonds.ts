import type { LearnTopic } from '@/data/learn/types'

/**
 * Vollständig ausgearbeitetes Thema.
 *
 * Stufenaufbau: Beginner erklärt Grundmechanik, Sondervermögen und
 * Anteilspreis. Fortgeschritten vergleicht die Fondsarten und macht die
 * Gesamtkosten sichtbar. Profi behandelt Bewertung, Liquiditätsrisiken und die
 * Besteuerung.
 *
 * ## Verhältnis zum Thema ETF
 *
 * Ein ETF ist ein Fonds; alles hier Gesagte gilt für ihn auch. Umgekehrt nicht:
 * Aktive Fonds haben eine Kostenstruktur und ein Auswahlrisiko, die es beim
 * Indexfonds nicht gibt. Dieses Thema behandelt deshalb das Gemeinsame und die
 * Besonderheiten der aktiven Seite; die Bauweise von Indexfonds steht unter
 * `etf`.
 */
export const fonds: LearnTopic = {
  slug: 'fonds',
  title: 'Fonds',
  headline: 'Investmentfonds: gemeinsam anlegen, professionell verwaltet',
  metaTitle: 'Investmentfonds erklärt: Arten, Kosten und Auswahl',
  metaDescription:
    'Was ein Investmentfonds ist, wie Sondervermögen dein Geld schützt, welche Fondsarten es gibt und woran du Kosten und Qualität erkennst – in drei Lernstufen.',
  lead: 'Ein Fonds bündelt das Geld vieler Anleger und investiert es nach festen Regeln – Streuung ab dem ersten Euro.',
  overview: [
    'Ein Investmentfonds sammelt Geld vieler Anlegerinnen und Anleger und legt es gemeinsam an. Schon mit kleinen Beträgen entsteht dadurch eine Streuung, die mit Einzelkäufen kaum erreichbar wäre.',
    'Rechtlich entscheidend ist der Status als Sondervermögen: Das Fondsvermögen ist vom Vermögen der Fondsgesellschaft getrennt und fällt bei deren Insolvenz nicht in die Masse.',
    'Die Stufen führen von der Grundmechanik über Fondsarten und Kostenstruktur bis zu Bewertungsfragen, Liquiditätsrisiken und der Besteuerung nach dem Investmentsteuerrecht.',
  ],
  keywords: ['Investmentfonds', 'Sondervermögen', 'aktiver Fonds', 'TER', 'Fondskosten'],
  related: ['etf', 'aktie', 'zinseszins', 'cost-average-sparplan'],
  calculators: ['/rechner/zinsrechner'],
  levels: {
    // ---------------------------------------------------------------- Beginner
    beginner: {
      metaTitle: 'Fonds einfach erklärt – Grundlagen für Einsteiger',
      metaDescription:
        'Wie ein Investmentfonds funktioniert, was Sondervermögen bedeutet, wie Anteilspreise entstehen und worin sich Fonds von einer Einzelaktie unterscheidet.',
      title: 'Fonds einfach erklärt',
      lead: 'Nach dieser Stufe weißt du, was mit deinem Geld in einem Fonds passiert, wie der Anteilspreis zustande kommt und wovor Sondervermögen schützt – und wovor nicht.',
      readingMinutes: 8,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Eine einzelne Aktie zu kaufen ist einfach. Fünfzig verschiedene zu kaufen, in sinnvoller Gewichtung, und sie über Jahre nachzujustieren, ist Arbeit – und mit kleinen Beträgen ohnehin nicht möglich, weil die Gebühren jeden Kauf auffressen würden.',
        },
        {
          type: 'paragraph',
          text: 'Ein **Investmentfonds** löst das. Viele Anleger zahlen in einen gemeinsamen Topf, eine Fondsgesellschaft legt das Geld nach festgelegten Regeln an, und jeder hält Anteile am Ganzen. Mit fünfzig Euro im Monat besitzt man anteilig dasselbe wie jemand mit fünfzigtausend – nur weniger davon.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was du besitzt',
        },
        {
          type: 'paragraph',
          text: 'Nicht die einzelnen Aktien. Du besitzt **Anteile am Fondsvermögen** – einen Bruchteil von allem, was drin ist. Bei einer Hauptversammlung stimmt die Fondsgesellschaft ab, nicht du; Dividenden fließen in den Fonds, nicht auf dein Konto.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Wie der Anteilspreis entsteht',
          items: [
            'Einmal täglich wird der Wert aller Anlagen im Fonds addiert und um Verbindlichkeiten bereinigt. Das Ergebnis ist das **Nettoinventarvermögen**.',
            'Geteilt durch die Zahl der ausgegebenen Anteile ergibt sich der Anteilspreis – auf Englisch NAV, Net Asset Value.',
            'Ein Fonds kann deshalb keine „Blase“ auf sich selbst bilden: Sein Preis ist eine Rechnung, kein Verhandlungsergebnis. Bei börsengehandelten Fonds kommt allerdings ein Börsenpreis daneben, der leicht abweichen kann.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Sondervermögen: der Schutz, der oft falsch verstanden wird',
        },
        {
          type: 'paragraph',
          text: 'Das Fondsvermögen ist rechtlich vom Vermögen der Fondsgesellschaft getrennt. Verwahrt wird es von einer unabhängigen **Depotbank**, die zusätzlich prüft, ob die Bewertung stimmt und ob der Fonds seine eigenen Anlagegrenzen einhält.',
        },
        {
          type: 'table',
          caption: 'Wovor Sondervermögen schützt – und wovor nicht',
          head: ['Ereignis', 'Folge für dich'],
          rows: [
            [
              'Die Fondsgesellschaft wird insolvent',
              'Keine. Das Fondsvermögen fällt nicht in die Masse; es wird übertragen oder ausgezahlt.',
            ],
            [
              'Die Depotbank wird insolvent',
              'Keine. Sie verwahrt nur, sie besitzt nicht.',
            ],
            [
              'Die enthaltenen Aktien fallen um 40 Prozent',
              'Dein Anteil fällt um 40 Prozent. Dagegen schützt nichts.',
            ],
            [
              'Ein enthaltenes Unternehmen geht pleite',
              'Der Anteil dieses Unternehmens am Fonds ist weg – bei 200 Titeln also ein Bruchteil.',
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'Die letzte Zeile ist der eigentliche Grund, warum Fonds für die meisten Menschen die passendere Form sind als Einzelaktien. Nicht weil sie mehr Rendite bringen – sondern weil ein einzelner Fehlgriff nicht mehr das ganze Ergebnis bestimmt.',
        },
        {
          type: 'figure',
          figure: 'fonds-sondervermoegen',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was ein Fonds kostet',
        },
        {
          type: 'list',
          items: [
            '**Ausgabeaufschlag.** Eine einmalige Gebühr beim Kauf über die Fondsgesellschaft, oft drei bis fünf Prozent. Sie ist sofort weg: Wer 1.000 Euro einzahlt, hat bei fünf Prozent noch 950 im Fonds und muss erst wieder auf null kommen. Über die Börse gekauft entfällt sie meist.',
            '**Laufende Kosten.** Werden täglich anteilig aus dem Fondsvermögen entnommen. Du siehst sie nie auf einer Abrechnung – der Anteilspreis ist bereits um sie gemindert.',
            '**Erfolgsabhängige Vergütung.** Bei manchen aktiven Fonds zusätzlich, wenn eine Messlatte übertroffen wird. Worauf sich die Messlatte bezieht, steht im Verkaufsprospekt und lohnt einen Blick.',
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Warum die laufenden Kosten so schwer wiegen',
          items: [
            'Sie fallen jedes Jahr an, auf das gesamte angelegte Vermögen – auch in Jahren mit Verlust.',
            'Ein Prozentpunkt Unterschied klingt klein und ist über dreißig Jahre ein erheblicher Teil des Endvermögens.',
            'Und es ist die einzige Größe bei der Geldanlage, die vorher feststeht. Rendite ist eine Hoffnung, Kosten sind eine Tatsache.',
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
            'Du besitzt Anteile am Ganzen, nicht die einzelnen Wertpapiere.',
            'Der Anteilspreis ist eine tägliche Rechnung: Vermögen geteilt durch Anteile.',
            'Sondervermögen schützt vor der Pleite des Anbieters, nicht vor fallenden Kursen.',
            'Von allen Größen ist nur die Kostenquote im Voraus bekannt.',
          ],
        },
      ],
    },

    // -------------------------------------------------------- Fortgeschritten
    fortgeschritten: {
      metaTitle: 'Fondsarten und Kosten: Auswahl für Fortgeschrittene',
      metaDescription:
        'Aktiv oder passiv, Aktien- Renten- und Mischfonds, thesaurierend oder ausschüttend – und wie du die tatsächlichen Gesamtkosten eines Fonds ermittelst.',
      title: 'Fondsarten und Kostenstruktur',
      lead: 'Welche Fondstypen es gibt, worin sie sich unterscheiden und wie du die tatsächlichen Gesamtkosten ermittelst.',
      readingMinutes: 11,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Die Fondsarten und wofür sie gebaut sind',
        },
        {
          type: 'table',
          caption: 'Was drin ist und was das bedeutet',
          head: ['Art', 'Enthält', 'Typische Schwankung', 'Gedacht für'],
          rows: [
            [
              'Aktienfonds',
              'Aktien, meist nach Region oder Branche',
              'Hoch',
              'Anlagehorizonte ab zehn bis fünfzehn Jahren',
            ],
            [
              'Rentenfonds',
              'Anleihen von Staaten und Unternehmen',
              'Mittel – abhängig von Laufzeit und Bonität',
              'Ausgleich zu Aktien; Erträge statt Kursgewinne',
            ],
            [
              'Mischfonds',
              'Beides, in wechselnder Gewichtung',
              'Dazwischen',
              'Wer die Aufteilung abgeben will – und dafür zahlt',
            ],
            [
              'Geldmarktfonds',
              'Sehr kurz laufende Forderungen',
              'Sehr gering',
              'Geld parken, nicht anlegen',
            ],
            [
              'Offene Immobilienfonds',
              'Gewerbeimmobilien',
              'Optisch gering, in Wahrheit anders gelagert',
              'Siehe Warnung weiter unten',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Offene Immobilienfonds sind ein Sonderfall',
          items: [
            'Ihr Preis schwankt kaum, weil Immobilien nicht täglich gehandelt, sondern periodisch durch Gutachter bewertet werden. Das ist keine Stabilität, sondern eine seltener aktualisierte Zahl.',
            'Seit der Reform gelten eine Mindesthaltefrist von 24 Monaten und eine Kündigungsfrist von zwölf Monaten – eingeführt, nachdem in der Finanzkrise mehrere Fonds die Rücknahme aussetzen mussten und Anleger jahrelang nicht an ihr Geld kamen.',
            'Wer sie mit Tagesgeld vergleicht, weil „der Kurs so ruhig ist“, vergleicht Ungleiches.',
          ],
        },
        {
          type: 'figure',
          figure: 'fonds-bewertungsglaettung',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Aktiv oder passiv – die ehrliche Bilanz',
        },
        {
          type: 'paragraph',
          text: 'Ein aktiver Fonds versucht, seinen Vergleichsindex zu schlagen. Das gelingt einzelnen, und es gelingt selten dauerhaft. Der Grund ist arithmetisch und nicht polemisch: Alle Anleger zusammen halten den Markt, ihre durchschnittliche Rendite vor Kosten ist also die Marktrendite. Nach Kosten liegt der Durchschnitt darunter – und aktive Fonds haben die höheren Kosten.',
        },
        {
          type: 'paragraph',
          text: 'Daraus folgt nicht, dass aktive Fonds sinnlos sind. In engen, schlecht abgedeckten Märkten – Nebenwerte, Schwellenländeranleihen – ist der Vorsprung durch Recherche größer als in einem Markt, den tausend Analysten beobachten. Es folgt aber, dass die Kostenfrage bei einem aktiven Fonds die erste ist, nicht die letzte.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Kosten vollständig erfassen',
        },
        {
          type: 'paragraph',
          text: 'Die genannte Kostenquote ist nicht alles. Vier Posten gehören zusammengezählt:',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Laufende Kosten (TER).** Verwaltung, Depotbank, Prüfung, Vertrieb. Steht im Basisinformationsblatt.',
            '**Transaktionskosten im Fonds.** Was das Handeln innerhalb des Fonds kostet – nicht in der TER enthalten. Ein Fonds, der seinen Bestand jedes Jahr komplett umschichtet, zahlt hier ein Vielfaches eines ruhigen.',
            '**Erfolgsabhängige Vergütung.** Prüfen, worauf sie sich bezieht und ob es eine Hochwassermarke gibt – ohne sie kann derselbe Zuwachs nach einem Verlustjahr zweimal vergütet werden.',
            '**Ausgabeaufschlag.** Einmalig, aber wirksam: Bei fünf Prozent und einer angenommenen Rendite von sechs Prozent ist fast ein ganzes Anlagejahr weg, bevor es losgeht.',
          ],
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Die eine Zahl, die alles enthält',
          items: [
            'Vergleiche die **Wertentwicklung nach Kosten** über fünf und zehn Jahre mit der des passenden Index – nicht die Kostenquoten miteinander.',
            'Achte darauf, dieselbe Index-Variante zu nehmen: Ein Fonds gegen einen Kursindex verglichen sieht immer gut aus, weil dort die Dividenden fehlen.',
            'Und vergleiche gegen den *passenden* Index. Ein Weltfonds gegen den DAX gemessen misst die Regionenwahl, nicht die Leistung des Fondsmanagements.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Thesaurierend oder ausschüttend',
        },
        {
          type: 'paragraph',
          text: 'Thesaurierend heißt, dass Erträge im Fonds bleiben und wieder angelegt werden; ausschüttend, dass sie auf dein Konto fließen. Der Unterschied ist keiner der Rendite – am Ausschüttungstag sinkt der Anteilspreis um den ausgeschütteten Betrag –, sondern einer des Zeitpunkts und des Aufwands.',
        },
        {
          type: 'paragraph',
          text: 'In der Aufbauphase ist thesaurierend meist bequemer: Der Zinseszins läuft ohne Zutun weiter, und es fallen keine Ordergebühren für die Wiederanlage an. In der Entnahmephase oder wenn der Sparerpauschbetrag gezielt ausgenutzt werden soll, spricht mehr für ausschüttend.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was du dir merken solltest',
        },
        {
          type: 'list',
          items: [
            'Der ruhige Kurs offener Immobilienfonds ist eine Bewertungsfrage, keine Sicherheit – dazu Fristen von bis zu drei Jahren.',
            'Aktiv gegen passiv ist zuerst eine Kostenfrage; die Marktrendite vor Kosten haben alle gemeinsam.',
            'Vier Kostenblöcke, nicht einer – und Transaktionskosten stehen in keiner TER.',
            'Verglichen wird die Wertentwicklung nach Kosten gegen den passenden Index in der richtigen Variante.',
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ Profi
    profi: {
      metaTitle: 'Fonds für Profis: Bewertung, Liquidität, Besteuerung',
      metaDescription:
        'Bewertung schwer handelbarer Positionen, Rücknahmeaussetzung und Swing Pricing, Anlagegrenzen sowie Vorabpauschale und Teilfreistellung bei Fonds.',
      title: 'Fonds auf Profi-Niveau',
      lead: 'Wie bewertet wird, was im Krisenfall mit der Rücknahme geschieht und wie Fondserträge besteuert werden.',
      readingMinutes: 13,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Ein Fonds verspricht zwei Dinge, die im Normalfall selbstverständlich wirken und sich im Ernstfall widersprechen können: einen täglich berechneten fairen Preis und die Möglichkeit, täglich zurückzugeben. Die interessanten Regeln entstehen genau an dieser Stelle.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Bewertung: einfach, bis es das nicht mehr ist',
        },
        {
          type: 'paragraph',
          text: 'Für eine DAX-Aktie ist die Bewertung trivial – es gibt einen Börsenkurs. Für eine Unternehmensanleihe, die zuletzt vor drei Wochen gehandelt wurde, gibt es keinen. Bewertet wird dann nach Modell: abgeleitet aus vergleichbaren Papieren, aus Renditekurven, aus Kursstellungen von Händlern.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Die drei Bewertungsstufen',
          items: [
            '**Stufe 1** – notierte Preise an einem aktiven Markt. Unstrittig.',
            '**Stufe 2** – abgeleitet aus beobachtbaren Größen für ähnliche Papiere. Vertretbar, aber eine Schätzung.',
            '**Stufe 3** – überwiegend aus Modellannahmen. Hier entscheidet, wer die Annahmen setzt.',
            'Wie hoch der Anteil der Stufen 2 und 3 ist, steht im Jahresbericht. Bei einem Aktienfonds ist er nahe null, bei manchen Anleihe- und Mischfonds erheblich.',
          ],
        },
        {
          type: 'figure',
          figure: 'fonds-bewertungsstufen',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wenn alle gleichzeitig zurückgeben wollen',
        },
        {
          type: 'paragraph',
          text: 'Ein Fonds muss verkaufen, um Rückgaben zu bedienen. Solange die Anlagen liquide sind, ist das unproblematisch. Sind sie es nicht, entsteht ein Anreizproblem: Wer zuerst zurückgibt, wird noch zu guten Preisen bedient; wer wartet, trägt die Kosten des Notverkaufs. Genau dieser Mechanismus macht aus einer Verunsicherung einen Ansturm.',
        },
        {
          type: 'table',
          caption: 'Werkzeuge gegen diesen Mechanismus',
          head: ['Werkzeug', 'Wie es wirkt'],
          rows: [
            [
              'Swing Pricing',
              'Bei hohen Nettorückgaben wird der Anteilspreis für diesen Tag um die Handelskosten gesenkt – wer zurückgibt, trägt sie selbst statt der Verbleibenden.',
            ],
            [
              'Rücknahmefristen',
              'Bei offenen Immobilienfonds gesetzlich: 24 Monate Mindesthaltedauer, zwölf Monate Kündigungsfrist.',
            ],
            [
              'Aussetzung der Rücknahme',
              'Der Notfall. Zulässig, wenn eine geordnete Bewertung oder Veräußerung nicht mehr möglich ist. Kann Monate dauern.',
            ],
            [
              'Anlagegrenzen (OGAW)',
              'Höchstens 10 Prozent in einen Emittenten, und Positionen über 5 Prozent zusammen höchstens 40 Prozent – die berühmte 5/10/40-Regel.',
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'Die 5/10/40-Regel ist der Grund, warum ein OGAW-Fonds nie zur Hälfte aus einem einzigen Wert bestehen kann, auch wenn der Manager es für richtig hielte. Sie begrenzt das Klumpenrisiko rechtlich statt nur nach Ermessen.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Besteuerung in Deutschland',
        },
        {
          type: 'paragraph',
          text: 'Seit der Investmentsteuerreform 2018 gilt für alle Fonds dasselbe System – gleich, ob aktiv oder Index, thesaurierend oder ausschüttend, in- oder ausländisch.',
        },
        {
          type: 'table',
          caption: 'Die drei Begriffe',
          head: ['Begriff', 'Bedeutung'],
          rows: [
            [
              'Vorabpauschale',
              'Jährliche Mindestbesteuerung bei thesaurierenden Fonds, berechnet aus dem Basiszins der Bundesbank und gedeckelt auf den Wertzuwachs des Jahres. In einem Verlustjahr fällt sie nicht an.',
            ],
            [
              'Teilfreistellung',
              'Ausgleich für Steuern, die der Fonds selbst gezahlt hat: 30 Prozent der Erträge bleiben bei Aktienfonds ab 51 Prozent Aktienanteil steuerfrei, 15 Prozent bei Mischfonds ab 25 Prozent, 60 oder 80 Prozent bei Immobilienfonds.',
            ],
            [
              'Anrechnung beim Verkauf',
              'Bereits versteuerte Vorabpauschalen mindern den steuerpflichtigen Gewinn beim späteren Verkauf. Doppelt besteuert wird nichts.',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Zwei praktische Stolpersteine',
          items: [
            'Die Vorabpauschale wird im Januar vom Verrechnungskonto abgebucht. Fehlt dort Geld, kann ein Sollstand entstehen – im Januar auf Deckung achten.',
            'Beim Teilverkauf gilt FIFO: Die zuerst gekauften Anteile gelten als zuerst verkauft, und das sind bei gestiegenen Kursen die mit dem höchsten Gewinn. Wählen lässt sich das nicht.',
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Keine Steuerberatung',
          items: [
            'Diese Darstellung beschreibt die allgemeine Rechtslage für Privatanleger in Deutschland.',
            'Sätze, Freibeträge und der Basiszins ändern sich; für den Einzelfall ist jemand mit Zulassung zuständig.',
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
            'Nicht jeder Anteilspreis beruht auf Börsenkursen – der Anteil der Modellbewertung steht im Jahresbericht.',
            'Täglicher Preis und tägliche Rückgabe vertragen sich nur, solange die Anlagen liquide sind.',
            'Die 5/10/40-Regel begrenzt Klumpenrisiken rechtlich, nicht nach Ermessen des Managers.',
            'Vorabpauschale, Teilfreistellung und Anrechnung greifen ineinander – doppelt besteuert wird nichts.',
          ],
        },
      ],
    },
  },
}
