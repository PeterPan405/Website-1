import type { LearnTopic } from '@/data/learn/types'

/**
 * Vollständig ausgearbeitetes Thema.
 *
 * Stufenaufbau: Beginner erklärt, was ein ETF ist und welche vier Angaben vor
 * einem Kauf zu prüfen sind. Fortgeschritten behandelt die Nachbildungsmethoden,
 * die Tracking-Differenz als das ehrlichere Kostenmaß und die Handelspraxis.
 * Profi geht auf Konstruktionsrisiken, den Liquiditätsmechanismus im Stressfall
 * und die deutsche Besteuerung ein.
 *
 * ## Warum hier so wenige Zahlen stehen
 *
 * Kostenquoten, Fondsvolumen und Tracking-Differenzen ändern sich laufend und
 * unterscheiden sich je Anbieter. Eine Zahl im Text wäre am Tag der
 * Veröffentlichung richtig und ein Jahr später falsch, ohne dass es jemandem
 * auffiele. Wo Größenordnungen nötig sind, stehen sie als Spanne und mit dem
 * Hinweis, wo die aktuelle Zahl zu finden ist – im Basisinformationsblatt des
 * jeweiligen Fonds.
 */
export const etf: LearnTopic = {
  slug: 'etf',
  title: 'ETF',
  headline: 'ETF: der Indexfonds als Basisbaustein',
  metaTitle: 'ETF erklärt: Funktionsweise, Kosten und Auswahl',
  metaDescription:
    'Wie ein ETF einen Index nachbildet, worin er sich vom klassischen Fonds unterscheidet und woran du bei der Auswahl tatsächlich erkennst, was du kaufst.',
  lead: 'Ein ETF bildet einen Index nach, statt ihn schlagen zu wollen – das macht ihn günstig, transparent und langweilig im besten Sinn.',
  overview: [
    'Ein ETF ist ein Investmentfonds, der einen Index nachbildet und fortlaufend an der Börse gehandelt wird. Er verfolgt kein eigenes Auswahlurteil, sondern reproduziert eine Regel.',
    'Daraus folgen die typischen Eigenschaften: sehr niedrige laufende Kosten, hohe Transparenz über den Inhalt und eine Wertentwicklung, die nahe am Index liegt – abzüglich der Kosten.',
    'Die Stufen behandeln Grundmechanik und Auswahl, dann Nachbildungsmethoden, Tracking-Differenz und Handelspraxis, schließlich Konstruktionsrisiken, Wertpapierleihe und Besteuerung.',
  ],
  keywords: ['ETF', 'Indexfonds', 'TER', 'Tracking-Differenz', 'thesaurierend'],
  related: ['fonds', 'aktie', 'cost-average-sparplan', 'aktien-laender-branchen'],
  calculators: ['/rechner/zinsrechner'],
  symbols: ['msci-world', 'sp500'],
  levels: {
    // ---------------------------------------------------------------- Beginner
    beginner: {
      metaTitle: 'ETF einfach erklärt – Grundlagen für Einsteiger',
      metaDescription:
        'Was ein ETF ist, wie er einen Index nachbildet, worin er sich von aktiven Fonds unterscheidet und welche vier Angaben du vor dem Kauf prüfst.',
      title: 'ETF einfach erklärt',
      lead: 'Nach dieser Stufe weißt du, was ein ETF tut, warum er so wenig kostet und welche vier Angaben du vor jedem Kauf nachschlägst.',
      readingMinutes: 11,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Stell dir vor, du willst Anteile an den 500 größten Unternehmen der USA kaufen. Einzeln wären das 500 Kaufaufträge, 500-mal Gebühren und die Frage, wie viel du von jedem nimmst. Ein ETF auf den S&P 500 erledigt das mit einem einzigen Auftrag.',
        },
        {
          type: 'paragraph',
          text: 'ETF steht für **Exchange Traded Fund**, auf Deutsch börsengehandelter Fonds. Zwei Dinge stecken in dem Namen: Es ist ein Fonds – ein gemeinsamer Topf, in den viele Anleger einzahlen –, und er wird an der Börse gehandelt wie eine Aktie. Was ihn von anderen Fonds unterscheidet, steht allerdings nicht im Namen.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Der eigentliche Unterschied: Regel statt Meinung',
        },
        {
          type: 'paragraph',
          text: 'Ein klassischer Fonds beschäftigt ein Team, das entscheidet, welche Aktien gekauft werden. Dieses Team hat eine Meinung darüber, welche Unternehmen sich besser entwickeln als andere, und wird dafür bezahlt.',
        },
        {
          type: 'paragraph',
          text: 'Ein ETF hat keine Meinung. Er bildet einen **Index** nach – eine feste Regel, welche Werte in welcher Gewichtung enthalten sind. Der DAX enthält die 40 größten börsennotierten Unternehmen Deutschlands, gewichtet nach ihrem Börsenwert. Wer einen DAX-ETF kauft, kauft genau das, ohne dass irgendjemand entscheidet, ob eines davon gerade eine gute Idee ist.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Index und ETF sind nicht dasselbe',
          items: [
            'Der **Index** ist eine Rechengröße – eine Liste mit Gewichtungen, die eine Indexgesellschaft pflegt. Man kann ihn nicht kaufen.',
            'Der **ETF** ist ein Fonds, der versucht, diese Rechengröße möglichst genau abzubilden. Ihn kann man kaufen.',
            'Auf denselben Index gibt es oft ein Dutzend ETFs verschiedener Anbieter. Sie unterscheiden sich in Kosten, Größe und Bauart – nicht im Inhalt.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Warum ETFs so wenig kosten',
        },
        {
          type: 'paragraph',
          text: 'Eine Regel zu befolgen ist billiger, als eine Meinung zu haben. Es braucht kein Analystenteam, keine Unternehmensbesuche, keine Kaufentscheidungen. Und weil die Zusammensetzung sich nur ändert, wenn der Index sich ändert, wird innerhalb des Fonds selten gehandelt – jeder Handel kostet Geld, das sonst den Anlegern gehören würde.',
        },
        {
          type: 'paragraph',
          text: 'Die laufenden Kosten breiter ETFs liegen deshalb typischerweise im Bereich von 0,05 bis 0,25 Prozent im Jahr. Aktiv verwaltete Aktienfonds nehmen häufig 1,5 Prozent und mehr. Der Unterschied klingt nach wenig und ist es nicht: Über dreißig Jahre entscheidet er über einen erheblichen Teil des Endvermögens, und zwar völlig unabhängig davon, wie sich die Börse entwickelt. Kosten sind die einzige Größe bei der Geldanlage, die im Voraus feststeht.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Günstig heißt nicht sicher',
          items: [
            'Ein ETF senkt die Kosten, nicht das Kursrisiko. Fällt der Index um 40 Prozent, fällt der ETF um 40 Prozent.',
            'Ein ETF ist auch keine Anlageklasse. Es gibt ETFs auf breite Aktienmärkte, auf einzelne Branchen, auf Anleihen, auf Rohstoffe – das Risiko steckt im Index, nicht in der Hülle.',
            'Der Satz „ETFs sind sicher“ verwechselt die Verpackung mit dem Inhalt.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Dein Geld liegt getrennt: Sondervermögen',
        },
        {
          type: 'paragraph',
          text: 'Wie jeder Investmentfonds ist ein ETF rechtlich ein **Sondervermögen**. Das heißt: Was im Fonds liegt, gehört nicht der Fondsgesellschaft, sondern anteilig den Anlegern. Geht die Gesellschaft pleite, fällt das Fondsvermögen nicht in die Insolvenzmasse; es wird an eine andere Gesellschaft übertragen oder aufgelöst und ausgezahlt.',
        },
        {
          type: 'paragraph',
          text: 'Das ist ein echter Schutz, und er wird trotzdem oft falsch verstanden. Er schützt vor der Pleite des Anbieters, nicht vor fallenden Kursen. Wenn die enthaltenen Aktien die Hälfte wert sind, ist auch das Sondervermögen die Hälfte wert.',
        },
        {
          type: 'figure',
          figure: 'msci-world-laender',
          caption:
            'Ein Welt-ETF ist breit gestreut – aber nicht gleichmäßig. Nach Börsenwert gewichtet heißt: Das Gewicht folgt dem Marktwert, nicht der Zahl der Länder.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Vier Angaben, die du vor jedem Kauf prüfst',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Welcher Index?** Der Name des ETF ist Marketing, der Index ist der Inhalt. „Global Equity“ kann 1.400 Unternehmen aus 23 Ländern bedeuten oder 100 aus dreien. Der Index steht immer im Basisinformationsblatt.',
            '**Was kostet er?** Die laufenden Kosten (TER, Gesamtkostenquote) werden täglich anteilig aus dem Fondsvermögen entnommen – du siehst sie nie auf einer Abrechnung, sie sind trotzdem da.',
            '**Thesaurierend oder ausschüttend?** Thesaurierend heißt: Dividenden bleiben im Fonds und werden wieder angelegt. Ausschüttend heißt: Sie landen auf deinem Konto. Beides ist legitim, es sind unterschiedliche Zwecke.',
            '**Wie groß ist er?** Sehr kleine Fonds werden häufiger geschlossen und zusammengelegt. Das ist kein Beinbruch, erzeugt aber einen Verkauf zu einem Zeitpunkt, den du nicht gewählt hast – und der kann steuerlich ungünstig liegen.',
          ],
        },
        {
          type: 'table',
          caption: 'Thesaurierend oder ausschüttend – wofür was passt',
          head: ['', 'Thesaurierend', 'Ausschüttend'],
          rows: [
            [
              'Was mit den Dividenden passiert',
              'Bleiben im Fonds, werden wieder angelegt',
              'Werden auf dein Konto überwiesen',
            ],
            [
              'Wirkung',
              'Zinseszins läuft automatisch weiter',
              'Du bekommst regelmäßig Geld, musst es selbst wieder anlegen',
            ],
            [
              'Passt zu',
              'Vermögensaufbau über viele Jahre',
              'Entnahmephase, oder wenn der Sparerpauschbetrag gezielt ausgenutzt werden soll',
            ],
            [
              'Aufwand',
              'Keiner',
              'Wiederanlage kostet Ordergebühren, wenn du sie selbst vornimmst',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Ein häufiger Irrtum',
          items: [
            'Ausschüttungen sind kein Ertrag „obendrauf“. Der Kurs des ETF sinkt am Ausschüttungstag um genau den ausgeschütteten Betrag.',
            'Wer zwischen zwei sonst gleichen ETFs wählt, wählt also nicht zwischen mehr und weniger Rendite, sondern zwischen zwei Wegen, dasselbe Geld zu bewegen.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Der Name verrät fast alles',
        },
        {
          type: 'paragraph',
          text: 'ETF-Namen sehen aus wie Buchstabensuppe und folgen einem festen Muster. Wer es einmal kennt, liest die wichtigsten Eigenschaften direkt aus dem Titel:',
        },
        {
          type: 'list',
          items: [
            '**Der Anbieter** steht vorn – der Fondsgesellschaft, nicht dem Index.',
            '**Der Index** in der Mitte. Das ist der Teil, der über Rendite und Risiko entscheidet.',
            '**UCITS** heißt: europäisch reguliert, mit Streuungsvorschriften und Sondervermögen. Bei einem in Deutschland handelbaren Fonds steht es fast immer da.',
            '**Acc** oder **Dist** – thesaurierend („accumulating“) oder ausschüttend („distributing“). Manchmal auch „C“ und „D“.',
            '**EUR Hedged** heißt währungsgesichert. Fehlt der Zusatz, ist er es nicht – und die Handelswährung sagt darüber nichts.',
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Zwei Missverständnisse, die aus dem Namen entstehen',
          items: [
            '**„EUR“ im Namen heißt nicht währungsgesichert.** Es bezeichnet meist nur die Handelswährung – das Währungsrisiko der enthaltenen Unternehmen bleibt vollständig bestehen.',
            '**„Thesaurierend“ heißt nicht steuerfrei.** Auch ohne Ausschüttung fällt jährlich die Vorabpauschale an; sie wird vom Verrechnungskonto eingezogen. Der Vorteil ist die automatische Wiederanlage, nicht die Steuerersparnis.',
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
            'Ein ETF bildet einen Index nach, statt Werte auszuwählen – daher die niedrigen Kosten.',
            'Das Risiko steckt im zugrunde liegenden Index, nicht in der Fondshülle.',
            'Sondervermögen schützt vor der Pleite des Anbieters, nicht vor Kursverlusten.',
            'Der Name verrät Anbieter, Index, Regulierung, Ertragsverwendung und Absicherung.',
            'Vor dem Kauf: Index, Kosten, Ertragsverwendung und Fondsgröße nachschlagen.',
          ],
        },
      ],
    },

    // -------------------------------------------------------- Fortgeschritten
    fortgeschritten: {
      metaTitle: 'ETF fortgeschritten: Nachbildung, Tracking, Handel',
      metaDescription:
        'Physische und synthetische Replikation, Tracking-Differenz gegen TER, Spread und Handelszeiten sowie die Wahl zwischen Index-Varianten.',
      title: 'Nachbildung, Tracking und Handelspraxis',
      lead: 'Wie ETFs ihren Index tatsächlich abbilden, warum die TER das schlechtere Kostenmaß ist und worauf es beim Handeln ankommt.',
      readingMinutes: 11,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Ein ETF verspricht, einen Index abzubilden. Wie er das tut, ist keine Formsache – daraus folgen unterschiedliche Risiken, unterschiedliche Kosten und mitunter unterschiedliche Ergebnisse nach Steuern.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Drei Wege, einen Index nachzubilden',
        },
        {
          type: 'paragraph',
          text: 'Die naheliegende Methode ist die **vollständig physische** Nachbildung: Der Fonds kauft alle Indexwerte in der Gewichtung des Index. Beim DAX mit 40 Titeln ist das unproblematisch. Bei einem Index mit 3.000 Titeln aus 47 Ländern wird es teuer, weil manche davon selten gehandelt werden.',
        },
        {
          type: 'paragraph',
          text: 'Deshalb gibt es die **optimierte physische** Nachbildung, auch Sampling genannt. Der Fonds kauft nicht alle Titel, sondern eine Auswahl, die den Index in seinen Eigenschaften nachbildet – Branchen, Länder, Größenklassen. Die kleinsten und am schwersten handelbaren Positionen bleiben außen vor. Das spart Handelskosten und erzeugt eine kleine, in der Regel unauffällige Abweichung.',
        },
        {
          type: 'paragraph',
          text: 'Die dritte Methode ist die **synthetische** Nachbildung über einen Swap. Der Fonds hält irgendein Wertpapierportfolio und schließt mit einer Bank ein Tauschgeschäft: Die Bank liefert die Wertentwicklung des Index, der Fonds liefert die Wertentwicklung seines Portfolios. Was der Fonds besitzt, hat mit dem Index dann nichts zu tun.',
        },
        {
          type: 'table',
          caption: 'Nachbildungsmethoden im Vergleich',
          head: ['Methode', 'Was der Fonds besitzt', 'Stärke', 'Zusätzliches Risiko'],
          rows: [
            [
              'Vollständig physisch',
              'Alle Indextitel',
              'Größte Nachvollziehbarkeit',
              'Keines über den Index hinaus',
            ],
            [
              'Optimiert physisch',
              'Repräsentative Auswahl',
              'Geringere Handelskosten bei sehr breiten Indizes',
              'Abweichung durch die Auswahl',
            ],
            [
              'Synthetisch (Swap)',
              'Ein beliebiges Sicherheitenportfolio',
              'Bildet auch schwer zugängliche Märkte exakt ab',
              'Ausfall des Swap-Partners',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Synthetisch ist nicht automatisch schlechter',
          items: [
            'Das Kontrahentenrisiko ist gesetzlich auf 10 Prozent des Fondsvermögens begrenzt, in der Praxis wird es meist täglich auf nahe null besichert.',
            'Bei Märkten, an denen ein europäischer Fonds nicht direkt handeln darf, ist der Swap oft der einzige Weg.',
            'Bei US-Aktien war er lange steuerlich im Vorteil, weil der Swap keine US-Quellensteuer auslöste. Diese Lücke wurde weitgehend geschlossen.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Tracking-Differenz: das ehrlichere Kostenmaß',
        },
        {
          type: 'paragraph',
          text: 'Die Gesamtkostenquote TER ist die meistzitierte Zahl und die weniger nützliche. Sie enthält die Verwaltungsgebühr, aber nicht die Handelskosten innerhalb des Fonds, nicht die Quellensteuern auf Dividenden und nicht die Erträge aus Wertpapierleihe.',
        },
        {
          type: 'paragraph',
          text: 'Die **Tracking-Differenz** misst stattdessen das Ergebnis: Wie weit lag die Wertentwicklung des ETF im vergangenen Jahr hinter der des Index? Sie enthält alles, was tatsächlich passiert ist. Und sie kann kleiner sein als die TER – wenn ein Fonds über Wertpapierleihe Zusatzerträge erzielt oder Quellensteuern besser zurückholt als der Index unterstellt. In Einzelfällen ist sie sogar negativ, der ETF hat den Index also geschlagen.',
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'So vergleichst du richtig',
          items: [
            'Tracking-Differenz über mehrere Jahre ansehen, nicht nur über eines. Ein einzelnes Jahr kann von einem Sondereffekt geprägt sein.',
            'Nur ETFs auf denselben Index vergleichen. Zwei „Welt“-ETFs auf verschiedene Indizes zu vergleichen misst den Index, nicht die Umsetzung.',
            'Auf die Index-Variante achten – dazu gleich mehr.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Daneben steht der **Tracking Error**. Er misst nicht, wie groß der Rückstand ist, sondern wie stark er schwankt. Ein ETF mit konstant 0,3 Prozent Rückstand ist besser vorhersehbar als einer, der mal 0,1 und mal 0,6 Prozent zurückliegt – auch wenn beide im Schnitt gleich abschneiden.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Net, Gross, Price: derselbe Index in drei Fassungen',
        },
        {
          type: 'paragraph',
          text: 'Fast jeder Index existiert in drei Varianten, und der Unterschied liegt in der Behandlung der Dividenden:',
        },
        {
          type: 'list',
          items: [
            '**Price Index** (Kursindex): Dividenden werden ignoriert. Der Index bildet nur die Kursbewegung ab.',
            '**Gross Return** (Bruttoindex): Dividenden werden voll wieder angelegt, ohne Abzug von Quellensteuer.',
            '**Net Return** (Nettoindex): Dividenden werden wieder angelegt, abzüglich einer unterstellten Quellensteuer.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Über lange Zeiträume ist der Unterschied gewaltig. Der DAX wird üblicherweise als Performanceindex zitiert, der Dow Jones und der S&P 500 als Kursindex – wer beide Zahlen nebeneinanderlegt, vergleicht Ungleiches. Für ETF-Vergleiche gilt: Fast alle messen sich am Net Return, und genau daran gehört die Tracking-Differenz gemessen.',
        },
        {
          type: 'figure',
          figure: 'etf-index-fassungen',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Handeln: wann, wo, und immer mit Limit',
        },
        {
          type: 'paragraph',
          text: 'Ein ETF wird an der Börse gehandelt, und dort gibt es zu jedem Zeitpunkt einen Geldkurs (was jemand zu zahlen bereit ist) und einen Briefkurs (was jemand verlangt). Die Spanne dazwischen, der **Spread**, ist eine Kostenkomponente, die in keiner Kostenquote auftaucht.',
        },
        {
          type: 'paragraph',
          text: 'Der Spread ist am engsten, wenn die zugrunde liegenden Märkte geöffnet sind. Ein ETF auf japanische Aktien lässt sich um 9 Uhr deutscher Zeit handeln – nur ist die Börse in Tokio dann längst geschlossen, und der Market Maker muss den fairen Preis schätzen statt ihn abzulesen. Er sichert sich über eine größere Spanne ab. Dieselbe Order am frühen Nachmittag, wenn sich die Handelszeiten überlappen, ist oft messbar günstiger.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Nie ohne Limit',
          items: [
            'Eine unlimitierte Order (Market Order) wird zum nächstbesten Preis ausgeführt – auch wenn dieser gerade völlig aus dem Rahmen fällt.',
            'Bei einer Limit-Order legst du den Höchstpreis fest, den du zahlst. Wird er nicht erreicht, wird nicht ausgeführt. Das ist der bessere Ausgang.',
            'Als Orientierung dient der **iNAV** – der fortlaufend berechnete faire Wert des Fondsvermögens je Anteil. Die meisten Broker zeigen ihn an.',
            'Die ersten und letzten Minuten des Börsentags meiden: Dort sind die Spannen regelmäßig am größten.',
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
            'Physisch, optimiert oder synthetisch – jede Methode hat einen eigenen Grund und ein eigenes Zusatzrisiko.',
            'Die Tracking-Differenz sagt mehr als die TER, weil sie das Ergebnis misst statt einer einzelnen Gebühr.',
            'Net Return, Gross Return und Price Index sind drei verschiedene Zahlen für denselben Markt.',
            'Der Spread ist eine reale Kostenkomponente. Handelszeit wählen, Limit setzen.',
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ Profi
    profi: {
      metaTitle: 'ETF für Profis: Konstruktion, Leihe, Besteuerung',
      metaDescription:
        'Swap-Kontrahentenrisiko, Wertpapierleihe und Sicherheitenqualität, Liquidität im Sekundärmarkt sowie Vorabpauschale und Teilfreistellung bei ETFs.',
      title: 'ETF auf Profi-Niveau',
      lead: 'Konstruktionsrisiken, der Liquiditätsmechanismus im Stressfall und die deutsche Besteuerung im Detail.',
      readingMinutes: 14,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Die Kritik an ETFs zielt selten auf das Prinzip und fast immer auf die Konstruktion: auf Gegenparteien, auf verliehene Wertpapiere und auf die Frage, was in einer Panik passiert, wenn alle gleichzeitig verkaufen wollen. Diese Fragen verdienen präzise Antworten.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Kontrahentenrisiko beim Swap',
        },
        {
          type: 'paragraph',
          text: 'Bei einem synthetischen ETF hängt die Indexlieferung an der Zahlungsfähigkeit des Swap-Partners. Die OGAW-Richtlinie begrenzt das Ausfallrisiko gegenüber einer einzelnen Gegenpartei auf 10 Prozent des Fondsvermögens. In der Praxis liegt es deutlich darunter, weil die Anbieter den Swap regelmäßig zurücksetzen – täglich oder sobald ein Schwellenwert erreicht ist – und den Wert über Sicherheiten abdecken.',
        },
        {
          type: 'paragraph',
          text: 'Entscheidend ist die Qualität dieser Sicherheiten. Ein mit Staatsanleihen bester Bonität besicherter Swap ist etwas anderes als einer, der mit Aktien zweiter Reihe unterlegt ist. Die Zusammensetzung steht im Jahresbericht des Fonds; bei den großen Anbietern liegt sie zusätzlich als tägliche Übersicht online.',
        },
        {
          type: 'figure',
          figure: 'etf-swap',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wertpapierleihe: die stille Ertragsquelle',
        },
        {
          type: 'paragraph',
          text: 'Auch physische ETFs bergen ein Gegenparteirisiko, nur an anderer Stelle. Viele verleihen Teile ihres Bestands gegen Gebühr – meist an Marktteilnehmer, die auf fallende Kurse setzen und die Papiere für einen Leerverkauf brauchen. Die Leihgebühr fließt in den Fonds und verbessert die Tracking-Differenz. Das ist einer der Gründe, warum manche ETFs weniger hinter ihrem Index zurückbleiben, als ihre TER erwarten ließe.',
        },
        {
          type: 'paragraph',
          text: 'Das Risiko: Geht der Entleiher pleite, bevor er zurückgibt, bleiben dem Fonds die Sicherheiten. Sind die weniger wert als die verliehenen Papiere, entsteht ein Verlust. Deshalb sind drei Angaben aus dem Jahresbericht interessant.',
        },
        {
          type: 'list',
          items: [
            '**Umfang**: Welcher Anteil des Fondsvermögens ist im Schnitt und maximal verliehen?',
            '**Übersicherung**: Wie viel Sicherheiten werden gestellt – 102 Prozent oder 105 Prozent des Werts?',
            '**Ertragsteilung**: Welcher Anteil der Leihgebühr geht in den Fonds und welcher an die Fondsgesellschaft? Üblich sind 60 bis 70 Prozent für den Fonds; einige Anbieter verzichten ganz auf Leihe.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Liquidität: warum ein kleiner ETF nicht illiquide ist',
        },
        {
          type: 'paragraph',
          text: 'Ein verbreiteter Denkfehler ist, die Handelbarkeit eines ETF an seinem Handelsvolumen zu messen. Bei einer Aktie stimmt das – wer eine selten gehandelte Aktie verkaufen will, findet vielleicht keinen Käufer. Bei einem ETF funktioniert es anders.',
        },
        {
          type: 'paragraph',
          text: 'ETFs haben zwei Märkte. Am **Sekundärmarkt** handeln Anleger untereinander über die Börse. Am **Primärmarkt** können zugelassene Teilnehmer, die Authorised Participants, neue Anteile schaffen oder bestehende zurückgeben, indem sie dem Fonds die entsprechenden Wertpapiere liefern oder abnehmen. Steigt die Nachfrage über das Angebot an der Börse, werden einfach neue Anteile geschaffen.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Die Folge',
          items: [
            'Die Liquidität eines ETF entspricht der Liquidität seiner Basiswerte, nicht seinem eigenen Handelsvolumen.',
            'Ein kleiner ETF auf den S&P 500 ist so handelbar wie ein großer – die zugrunde liegenden Aktien sind dieselben.',
            'Umgekehrt hilft hohes Handelsvolumen nicht, wenn die Basiswerte illiquide sind: Bei Hochzinsanleihen oder Nebenwerten aus Schwellenländern kann sich der Börsenpreis in einer Panik deutlich vom Nettoinventarwert lösen.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Genau das war im März 2020 zu beobachten: Anleihen-ETFs handelten zeitweise mit spürbarem Abschlag zu ihrem berechneten Nettoinventarwert. Die verbreitete Deutung, der ETF sei „kaputt“, greift zu kurz – der Anleihemarkt selbst war praktisch zum Erliegen gekommen, und der ETF-Preis war der einzige fortlaufend gestellte Preis. Er war nicht falsch, sondern aktueller als die Bewertung der Anleihen.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Fondsschließung: der Fall, den niemand einplant',
        },
        {
          type: 'paragraph',
          text: 'Anbieter legen ETFs zusammen oder schließen sie, wenn sie sich nicht rechnen. Der Ablauf ist geordnet: Ankündigung mit Frist, dann Verkauf des Vermögens und Auszahlung, oder Verschmelzung auf einen anderen Fonds. Ein Totalverlust droht dabei nicht.',
        },
        {
          type: 'paragraph',
          text: 'Die unangenehme Folge ist steuerlicher Natur. Eine Auflösung gilt als Verkauf – aufgelaufene Kursgewinne werden versteuert, zu einem Zeitpunkt, den du nicht bestimmt hast. Wer über Jahrzehnte plant, hat einen praktischen Grund, sehr kleine Fonds zu meiden. Eine Verschmelzung ist demgegenüber in der Regel steuerneutral.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Besteuerung in Deutschland',
        },
        {
          type: 'paragraph',
          text: 'Seit der Investmentsteuerreform 2018 werden thesaurierende und ausschüttende Fonds weitgehend gleich behandelt. Drei Begriffe sollte man dennoch auseinanderhalten können.',
        },
        {
          type: 'table',
          caption: 'Die drei Begriffe der Fondsbesteuerung',
          head: ['Begriff', 'Was er bedeutet'],
          rows: [
            [
              'Vorabpauschale',
              'Eine jährliche Mindestbesteuerung bei thesaurierenden Fonds. Sie ersetzt die fehlende Ausschüttung und wird auf Basis des Basiszinses der Bundesbank berechnet, höchstens jedoch in Höhe des Wertzuwachses. In einem Verlustjahr fällt sie nicht an.',
            ],
            [
              'Teilfreistellung',
              'Ein pauschaler Ausgleich für Steuern, die der Fonds bereits selbst gezahlt hat. Bei Aktienfonds mit mindestens 51 Prozent Aktienanteil bleiben 30 Prozent der Erträge im Privatvermögen steuerfrei, bei Mischfonds ab 25 Prozent Aktienanteil 15 Prozent.',
            ],
            [
              'Quellensteuer im Fonds',
              'Auf Dividenden, die der Fonds vereinnahmt, behält das Sitzland des Unternehmens Steuer ein. Wie viel davon zurückgeholt werden kann, hängt vom Fondsdomizil ab – Irland hat bei US-Aktien ein günstiges Abkommen, was ein Grund für die Häufigkeit irischer Fonds ist.',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Praktische Folgen',
          items: [
            'Die Vorabpauschale wird im Januar dem Verrechnungskonto belastet. Ist dort kein Geld, kann die Bank einen Sollstand erzeugen – im Januar auf ausreichende Deckung achten.',
            'Ein Freistellungsauftrag verhindert den Abzug, solange der Sparerpauschbetrag reicht. Er will jährlich überprüft werden.',
            'Bereits gezahlte Vorabpauschalen werden beim späteren Verkauf angerechnet. Doppelt besteuert wird nichts.',
            'Beim Teilverkauf gilt FIFO: Die zuerst gekauften Anteile gelten als zuerst verkauft. Das lässt sich nicht wählen und ist bei geplanten Entnahmen einzurechnen.',
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Keine Steuerberatung',
          items: [
            'Diese Darstellung beschreibt die allgemeine Rechtslage für Privatanleger in Deutschland und ersetzt keine Beratung im Einzelfall.',
            'Bei ausländischen Depots, betrieblichem Vermögen oder größeren Beträgen gehört der Fall zu jemandem mit Zulassung.',
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
            'Swap-Risiko ist begrenzt und besichert – entscheidend ist die Qualität der Sicherheiten, nicht die Methode an sich.',
            'Wertpapierleihe verbessert die Tracking-Differenz und bringt ein eigenes Gegenparteirisiko mit. Umfang, Übersicherung und Ertragsteilung stehen im Jahresbericht.',
            'ETF-Liquidität hängt an den Basiswerten, nicht am Handelsvolumen des Fonds.',
            'Vorabpauschale, Teilfreistellung und Quellensteuer sind drei verschiedene Dinge – und FIFO gilt immer.',
          ],
        },
      ],
    },
  },
}
