import type { LearnTopic } from '@/data/learn/types'

/**
 * Vollständig ausgearbeitetes Thema.
 *
 * Stufenaufbau: Beginner klärt, was ein Depot ist, wie die Eröffnung abläuft
 * und was bei der ersten Order zu tun ist. Fortgeschritten behandelt Ordertypen,
 * Handelsplätze und den Depotübertrag. Profi geht auf Payment for Order Flow,
 * Wertpapierleihe, ausländische Anbieter und den Insolvenzfall ein.
 *
 * ## Warum hier keine Broker verglichen werden
 *
 * Preise und Konditionen ändern sich mehrmals im Jahr, und ein Vergleich, der
 * nicht gepflegt wird, ist schlechter als keiner – er sieht aus wie eine
 * Empfehlung und ist längst falsch. Beschrieben werden deshalb die **Arten**
 * von Kosten und Unterschieden, damit sich ein aktueller Preisaushang lesen
 * lässt.
 */
export const depotUndBroker: LearnTopic = {
  slug: 'depot-und-broker',
  title: 'Depot & Broker',
  headline: 'Das Depot: wo die Wertpapiere liegen und wer sie verwahrt',
  metaTitle: 'Depot und Broker: Eröffnung, Ordertypen, Kosten',
  metaDescription:
    'Wie ein Wertpapierdepot funktioniert, worin sich Broker unterscheiden, welche Ordertypen es gibt und welche Kosten beim Kauf tatsächlich anfallen.',
  lead: 'Ein Depot ist ein Konto für Wertpapiere – und die gehören dir, nicht der Bank.',
  overview: [
    'Ein Depot ist ein Konto für Wertpapiere. Die Wertpapiere selbst gehören dir und sind kein Vermögen der Bank – bei einer Insolvenz des Brokers werden sie herausgegeben und fallen nicht in die Insolvenzmasse.',
    'Die Unterschiede zwischen Anbietern liegen weniger im Depotpreis als in den Ordergebühren, den verfügbaren Handelsplätzen, dem Sparplanangebot und der steuerlichen Abwicklung – Letztere spart bei einem deutschen Anbieter erheblich Aufwand.',
    'Die Stufen führen von der Depoteröffnung über Ordertypen, Handelszeiten und Spreads bis zu Wertpapierleihe, Payment for Order Flow, Depotübertrag und den Besonderheiten ausländischer Anbieter.',
  ],
  keywords: [
    'Depot',
    'Broker',
    'Order',
    'Limit-Order',
    'Handelsplatz',
    'Ordergebühren',
    'Depotübertrag',
    'Spread',
  ],
  related: ['boerse', 'etf', 'kosten-und-gebuehren', 'worauf-achten-einsteiger'],
  levels: {
    // ---------------------------------------------------------------- Beginner
    beginner: {
      metaTitle: 'Depot eröffnen: Grundlagen für Einsteiger',
      metaDescription:
        'Was ein Depot ist, wie die Eröffnung abläuft, warum Wertpapiere bei einer Brokerinsolvenz sicher sind und was beim ersten Kauf zu beachten ist.',
      title: 'Depot und Broker einfach erklärt',
      lead: 'Nach dieser Stufe weißt du, was ein Depot ist, welche Angaben bei der Eröffnung wichtig sind und wie deine erste Order aussieht.',
      readingMinutes: 11,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Ein Depot ist ein Konto, auf dem statt Geld Wertpapiere liegen. Dazu gehört immer ein zweites Konto, das **Verrechnungskonto**, über das das Geld läuft: Dorthin überweist du, von dort wird der Kaufpreis abgebucht, dort landen Verkaufserlöse und Dividenden.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Der wichtigste Unterschied zum Bankkonto',
        },
        {
          type: 'paragraph',
          text: 'Geld auf einem Konto gehört rechtlich der Bank – sie schuldet es dir. Wertpapiere im Depot gehören **dir**; die Bank verwahrt sie nur. Das klingt nach Haarspalterei und ist im Ernstfall der ganze Unterschied.',
        },
        {
          type: 'table',
          caption: 'Was bei einer Insolvenz des Anbieters passiert',
          head: ['', 'Guthaben auf dem Verrechnungskonto', 'Wertpapiere im Depot'],
          rows: [
            ['Gehört', 'der Bank – sie schuldet es dir', 'dir'],
            [
              'Im Insolvenzfall',
              'Fällt in die Masse, geschützt durch die Einlagensicherung',
              'Wird herausgegeben oder übertragen, fällt gar nicht erst hinein',
            ],
            [
              'Obergrenze',
              '100.000 Euro je Person und Institut',
              'Keine – es ist ja deins',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Praktische Folge',
          items: [
            'Ein Depot mit 500.000 Euro Wertpapieren bei einem einzigen Anbieter ist unproblematisch.',
            'Ein Verrechnungskonto mit 500.000 Euro Guthaben bei demselben Anbieter ist es nicht.',
            'Wer eine größere Summe erst überwiesen hat und noch nicht angelegt, sollte diesen Unterschied kennen – es ist der einzige Moment, in dem er zählt.',
          ],
        },
        {
          type: 'figure',
          figure: 'depot-und-konto',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die Eröffnung',
        },
        {
          type: 'paragraph',
          text: 'Sie dauert meist eine halbe Stunde und läuft überall ähnlich ab. Vier Angaben lohnen besondere Aufmerksamkeit, weil sie später Arbeit sparen:',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Steuer-Identifikationsnummer.** Ohne sie kann der Broker keinen Freistellungsauftrag berücksichtigen. Sie steht auf jedem Steuerbescheid.',
            '**Freistellungsauftrag.** Gleich bei der Eröffnung einrichten. Ohne ihn wird auf jeden Ertrag Steuer abgeführt, die du erst über die Steuererklärung zurückbekommst – ein Jahr später.',
            '**Kirchensteuermerkmal.** Wird automatisch beim Bundeszentralamt abgefragt; ein Widerspruch dagegen ist möglich, verlagert die Zahlung dann aber in die Steuererklärung.',
            '**Angemessenheitsprüfung.** Der Broker fragt nach Erfahrung und Kenntnissen. Das ist keine Prüfung, die man bestehen muss – es ist eine gesetzliche Pflicht, dich zu warnen, wenn du etwas kaufst, das nicht zu deinen Angaben passt.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die erste Order',
        },
        {
          type: 'paragraph',
          text: 'Eine Wertpapierorder braucht fünf Angaben. Vier davon sind schnell erklärt, die fünfte ist die wichtigste.',
        },
        {
          type: 'list',
          items: [
            '**Was?** Die **ISIN** ist die weltweit eindeutige Kennung, zwölf Stellen. Die WKN ist die ältere deutsche Kurzform mit sechs Stellen. Im Zweifel die ISIN nehmen – Namen sind mehrdeutig, es gibt Dutzende Fonds mit „Global“ im Titel.',
            '**Wie viel?** Stückzahl oder Betrag. Bei ETFs sind meist Bruchstücke möglich, sodass jeder Betrag passt.',
            '**Wo?** Der Handelsplatz. Für deutsche Werte ist der elektronische Referenzmarkt tagsüber meist die günstigste Wahl.',
            '**Wie lange?** Gültigkeit der Order – nur heute oder bis zu einem Datum.',
            '**Zu welchem Preis?** Und hier lohnt es sich, kurz nachzudenken.',
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Market oder Limit – die eine Entscheidung, die zählt',
          items: [
            'Eine **Market-Order** wird sofort ausgeführt, zum nächsten verfügbaren Preis. Welcher das ist, weißt du vorher nicht.',
            'Eine **Limit-Order** legt fest, was du höchstens zahlst. Passt es nicht, wird nicht ausgeführt – und das ist der bessere Ausgang.',
            'Bei einem umsatzstarken Wert am Nachmittag ist der Unterschied klein. Bei einem selten gehandelten Papier oder außerhalb der Haupthandelszeit kann er erheblich sein.',
            'Faustregel: Limit kostet nichts außer der Möglichkeit, dass nichts passiert. Setze es ein oder zwei Promille über den aktuellen Kurs, dann wird fast immer ausgeführt.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Woran du einen passenden Anbieter erkennst',
        },
        {
          type: 'paragraph',
          text: 'Die Unterschiede zwischen den Anbietern sind kleiner geworden, aber nicht verschwunden. Sechs Punkte entscheiden, und keiner davon ist die Aufmachung der App:',
        },
        {
          type: 'table',
          caption: 'Was zu prüfen ist – und worauf es hinausläuft',
          head: ['Punkt', 'Woran es hängt'],
          rows: [
            [
              'Depotgebühr',
              'Sollte null sein. Eine Gebühr für die reine Verwahrung ist heute nicht mehr üblich',
            ],
            [
              'Sparplanausführung',
              'Bei kleinen Raten der größte Posten überhaupt. Ein Euro auf 25 Euro Rate sind vier Prozent',
            ],
            [
              'Ordergebühr',
              'Nur wichtig, wenn du selbst kaufst statt per Sparplan – dann aber pro Kauf',
            ],
            [
              'Auswahl',
              'Sind die Wertpapiere handelbar, die du willst? Und sind sie sparplanfähig?',
            ],
            [
              'Steuerlicher Sitz',
              'Ein deutscher Anbieter führt die Steuer automatisch ab. Bei ausländischen musst du sie selbst erklären',
            ],
            ['Erreichbarkeit', 'Nur relevant, wenn etwas schiefgeht – dann aber sehr'],
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Der fünfte Punkt ist der unterschätzte',
          items: [
            'Ein Anbieter mit Sitz im Ausland darf keine deutsche Abgeltungsteuer abführen. Alle Kapitalerträge musst du dann selbst in der Steuererklärung angeben – jedes Jahr, für jedes Wertpapier.',
            'Das ist erlaubt und für manche in Ordnung. Es ist nur mehr Arbeit, als die günstigeren Gebühren wert sind, wenn man ohnehin nur einen Sparplan laufen lässt.',
            'Der Freistellungsauftrag funktioniert dort ebenfalls nicht – es gibt niemanden, der ihn anwenden könnte.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wechseln ist einfacher als gedacht',
        },
        {
          type: 'paragraph',
          text: 'Ein **Depotübertrag** ist gesetzlich kostenfrei, und er ist kein Verkauf: Die Papiere wandern samt Anschaffungsdaten und Einstandskursen zum neuen Anbieter, es fällt keine Steuer an, und die Haltedauer läuft weiter. Beantragt wird er beim **neuen** Anbieter – der kümmert sich um den Rest. Zwei bis vier Wochen sind normal, in denen die Papiere kurzzeitig nicht handelbar sind.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Drei Dinge, die dabei schiefgehen können',
          items: [
            '**Bruchstücke lassen sich meist nicht übertragen.** Sie werden verkauft und ausgezahlt – ein steuerpflichtiger Vorgang, den man beim Wechsel eher unfreiwillig auslöst.',
            '**Der Verlusttopf bleibt zurück.** Wer Verluste beim alten Anbieter stehen hat, braucht bis zum 15. Dezember eine Verlustbescheinigung, sonst sind sie beim neuen nicht verrechenbar.',
            '**Der Freistellungsauftrag zieht nicht mit um.** Er muss beim neuen Anbieter erteilt und beim alten gestrichen werden – sonst liegt er dort, wo keine Erträge mehr anfallen.',
            'Nichts davon spricht gegen einen Wechsel. Es sind drei Handgriffe, die man kennen muss, bevor man ihn macht.',
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
            'Wertpapiere gehören dir, Guthaben gehört der Bank – das entscheidet den Insolvenzfall.',
            'Freistellungsauftrag und Steuer-ID gleich bei der Eröffnung erledigen.',
            'Die ISIN ist eindeutig, der Name nicht.',
            'Limit statt Market, besonders außerhalb der Haupthandelszeit.',
            'Beim Vergleich zählen Depotgebühr, Sparplankosten und der steuerliche Sitz – nicht die App.',
            'Ein Depotübertrag ist kostenfrei und kein Verkauf. Nur Bruchstücke, Verlusttopf und Freistellungsauftrag brauchen Aufmerksamkeit.',
          ],
        },
      ],
    },

    // -------------------------------------------------------- Fortgeschritten
    fortgeschritten: {
      metaTitle: 'Ordertypen, Handelsplätze und Depotübertrag',
      metaDescription:
        'Market, Limit, Stop-Loss und Trailing-Stop im Vergleich, Unterschiede zwischen Handelsplätzen, Spread und Handelszeiten sowie der Depotübertrag.',
      title: 'Ordertypen, Handelsplätze, Wechsel',
      lead: 'Welche Ordertypen es gibt und was sie wirklich tun, wo der Spread mehr kostet als die Gebühr, und wie ein Depotwechsel abläuft.',
      readingMinutes: 10,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Die Ordertypen und was sie tatsächlich bewirken',
        },
        {
          type: 'table',
          caption: 'Vier Typen, vier verschiedene Zusagen',
          head: ['Typ', 'Was zugesagt wird', 'Was nicht zugesagt wird'],
          rows: [
            [
              'Market',
              'Ausführung',
              'Der Preis. Bei dünnem Handel kann er weit vom letzten Kurs abweichen.',
            ],
            [
              'Limit',
              'Der Preis – höchstens beim Kauf, mindestens beim Verkauf',
              'Dass überhaupt ausgeführt wird.',
            ],
            [
              'Stop-Loss',
              'Dass bei Erreichen der Schwelle eine Market-Order ausgelöst wird',
              'Zu welchem Preis diese ausgeführt wird – im Crash oft deutlich darunter.',
            ],
            [
              'Trailing-Stop',
              'Dass die Schwelle mit steigendem Kurs nachzieht',
              'Ebenfalls nicht der Ausführungspreis.',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Stop-Loss schützt nicht vor Verlust',
          items: [
            'Ausgelöst wird bei der Schwelle, **ausgeführt** wird zum nächsten verfügbaren Preis. Öffnet ein Wert 25 Prozent tiefer, wird auch 25 Prozent tiefer verkauft – der Stop bei minus 10 hat daran nichts geändert.',
            'In hektischen Phasen lösen viele Stops gleichzeitig aus und verstärken die Bewegung, die sie abfangen sollten.',
            'Für langfristige Anleger ist ein Stop-Loss meist schädlich: Er verwandelt eine vorübergehende Schwankung zuverlässig in einen festgeschriebenen Verlust.',
            'Wer die Ausführung begrenzen will, nimmt eine **Stop-Limit-Order** – dann kann es allerdings passieren, dass gar nicht verkauft wird.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wo der Spread mehr kostet als die Gebühr',
        },
        {
          type: 'paragraph',
          text: 'Die Ordergebühr steht auf der Abrechnung, der **Spread** nicht – er ist der Abstand zwischen dem Preis, zu dem gerade jemand kauft, und dem, zu dem jemand verkauft. Wer sofort nach dem Kauf wieder verkaufen würde, bekäme weniger heraus, als er bezahlt hat, obwohl sich nichts bewegt hat.',
        },
        {
          type: 'paragraph',
          text: 'Bei einer Order über 1.000 Euro sind 0,3 Prozent Spread drei Euro – oft mehr als die Ordergebühr. Und der Spread hängt stark davon ab, wann und wo gehandelt wird.',
        },
        {
          type: 'list',
          items: [
            '**Referenzmarkt tagsüber**: engste Spannen bei deutschen Werten und den meisten ETFs.',
            '**Außerbörslich am Abend**: Der Referenzmarkt ist zu, der Anbieter muss den fairen Wert schätzen und sichert sich über eine größere Spanne ab.',
            '**Ausländische Werte**: entscheidend ist, ob deren Heimatmarkt geöffnet hat. Ein US-Wert ist ab 15:30 Uhr deutscher Zeit deutlich günstiger zu handeln als um 10 Uhr.',
            '**Eröffnung und Schluss**: die unruhigsten Minuten des Tages, mit entsprechend großen Spannen.',
          ],
        },
        {
          type: 'figure',
          figure: 'depot-orderkosten',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Der Depotübertrag',
        },
        {
          type: 'paragraph',
          text: 'Ein Wechsel des Anbieters ist **gesetzlich kostenfrei** – die Verwahrung ist eine Nebenpflicht, und für ihre Beendigung darf nichts berechnet werden. Der Ablauf: Der neue Broker schickt einen Übertragsauftrag, du unterschreibst, der Rest läuft zwischen den Häusern. Zwei bis sechs Wochen sind normal.',
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Der Punkt, an dem es schiefgeht',
          items: [
            'Mit den Papieren wandern die **Anschaffungsdaten** – Kaufdatum und Kaufkurs. Nur mit ihnen kann der neue Broker den steuerpflichtigen Gewinn richtig berechnen.',
            'Kommen sie nicht mit – häufig bei Überträgen aus dem Ausland –, unterstellt der neue Broker als Anschaffungskosten **null**. Beim Verkauf wird dann der volle Erlös versteuert.',
            'Das lässt sich über die Steuererklärung korrigieren, verlangt aber Belege. Wer alte Abrechnungen aufbewahrt, hat sie dann.',
            'Während des Übertrags kann nicht gehandelt werden. Wer eine Order plant, macht sie vorher oder wartet.',
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
            'Market sagt Ausführung zu, Limit den Preis – beides zugleich gibt es nicht.',
            'Ein Stop-Loss schützt nicht vor Verlusten, er schreibt sie fest.',
            'Der Spread kostet oft mehr als die Gebühr und hängt an Uhrzeit und Handelsplatz.',
            'Der Übertrag ist kostenfrei; achte darauf, dass die Anschaffungsdaten mitkommen.',
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ Profi
    profi: {
      metaTitle: 'Broker für Profis: Order Flow, Leihe, Auslandsdepots',
      metaDescription:
        'Payment for Order Flow, Wertpapierleihe, ausländische Broker mit Quellensteuerthemen und was bei einer Brokerinsolvenz tatsächlich passiert.',
      title: 'Broker auf Profi-Niveau',
      lead: 'Wie ein Broker ohne Ordergebühren Geld verdient, was mit deinen Papieren im Hintergrund geschieht und was ein Auslandsdepot wirklich kostet.',
      readingMinutes: 12,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Wie ein Broker ohne Gebühren verdient',
        },
        {
          type: 'paragraph',
          text: 'Wenn eine Order „kostenlos“ ist, ist sie es nicht – sie wird nur woanders bezahlt. Die verbreitetste Form heißt **Payment for Order Flow**: Der Broker leitet die Order an einen bestimmten Handelsplatz weiter und erhält dafür eine Vergütung. Dieser Handelsplatz verdient am Spread.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Wie man das einordnet',
          items: [
            'Nicht automatisch nachteilig: Für kleine Order kann der Wegfall der Gebühr mehr wert sein als ein minimal besserer Kurs.',
            'Bei großen Order kehrt sich das um: Ein Zehntelprozent auf 50.000 Euro sind 50 Euro – da wären fünf Euro Ordergebühr am Referenzmarkt das bessere Geschäft.',
            'In der EU ist Payment for Order Flow nach der überarbeiteten Finanzmarktrichtlinie mit einer Übergangsfrist bis 2026 zu beenden. Was danach an seine Stelle tritt, entscheidet über die Preismodelle mehrerer großer Anbieter.',
            'Die Gegenprobe ist immer dieselbe: erzielter Kurs gegen Referenzkurs zur selben Sekunde, plus alle Gebühren.',
          ],
        },
        {
          type: 'figure',
          figure: 'broker-orderflow',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wertpapierleihe im Depot',
        },
        {
          type: 'paragraph',
          text: 'Manche Broker bieten an, Papiere aus dem Kundendepot zu verleihen und den Ertrag zu teilen. Das ist etwas anderes als die Wertpapierleihe innerhalb eines Fonds: Hier werden **deine** Papiere verliehen, und für die Dauer der Leihe bist du nicht mehr Eigentümer, sondern hast einen Rückgabeanspruch.',
        },
        {
          type: 'list',
          items: [
            '**Der Schutz entfällt.** Verliehene Papiere sind kein Sondervermögen mehr. Fällt der Entleiher aus, greifen nur die gestellten Sicherheiten.',
            '**Die Erträge sind gering** – bei breit gehaltenen Standardwerten oft Bruchteile eines Prozents im Jahr.',
            '**Dividenden werden ersetzt, nicht gezahlt.** Du bekommst eine Ausgleichszahlung, und die kann steuerlich anders behandelt werden als eine echte Dividende.',
            'Die Teilnahme ist freiwillig und lässt sich abschalten. Für die meisten Privatanleger ist das Verhältnis von Ertrag zu Zusatzrisiko ungünstig.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Ausländische Broker: der wahre Preis',
        },
        {
          type: 'paragraph',
          text: 'Anbieter aus dem EU-Ausland werben mit niedrigen Gebühren. Der Unterschied liegt selten dort, sondern in der steuerlichen Abwicklung – und die kostet Zeit statt Geld.',
        },
        {
          type: 'table',
          caption: 'Deutscher gegen ausländischer Anbieter',
          head: ['', 'Deutscher Anbieter', 'Ausländischer Anbieter'],
          rows: [
            [
              'Abgeltungsteuer',
              'Wird automatisch einbehalten und abgeführt',
              'Nicht. Alle Erträge gehören in die Steuererklärung',
            ],
            [
              'Freistellungsauftrag',
              'Möglich',
              'Nicht möglich – der Freibetrag wirkt erst über die Erklärung',
            ],
            [
              'Vorabpauschale',
              'Wird berechnet und abgeführt',
              'Selbst zu ermitteln und zu erklären',
            ],
            [
              'Verlustverrechnung',
              'Läuft automatisch über die Verrechnungstöpfe',
              'Von Hand über die Anlage KAP',
            ],
            [
              'Jahressteuerbescheinigung',
              'Kommt automatisch',
              'Oft nicht in deutscher Form – Umrechnung nötig',
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'Für ein Depot mit einem Sparplan und zwei Positionen ist das eine überschaubare Mehrarbeit. Für ein Depot mit vielen Transaktionen, Ausschüttungen in Fremdwährung und ausländischen Quellensteuern wird daraus ein Abend im Jahr – und ein Fehlerrisiko, das der Ersparnis gegenübersteht.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was bei einer Brokerinsolvenz wirklich passiert',
        },
        {
          type: 'paragraph',
          text: 'Die Wertpapiere sind da – sie liegen beim Zentralverwahrer, dein Broker führt dort nur ein Konto. Der Insolvenzverwalter überträgt sie auf ein anderes Institut, oder du benennst selbst eines. Ein Totalverlust droht nicht.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Was trotzdem unangenehm ist',
          items: [
            '**Es dauert.** Wochen bis Monate, in denen nicht gehandelt werden kann. Wer in dieser Zeit verkaufen will, kann es nicht.',
            '**Das Verrechnungskonto ist ein anderer Fall.** Guthaben dort ist Bankguthaben und nur bis 100.000 Euro geschützt.',
            '**Fehlbestände gibt es theoretisch.** Wenn ein Broker Bestände nicht sauber getrennt geführt hat, springt die Entschädigungseinrichtung ein – begrenzt auf 90 Prozent und höchstens 20.000 Euro. Das ist ein Betrugs-, kein Insolvenzszenario.',
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
            '„Kostenlos“ heißt anderswo bezahlt – bei großen Order lohnt die Gegenprobe gegen den Referenzkurs.',
            'Verliehene Papiere aus dem eigenen Depot sind kein Sondervermögen mehr.',
            'Ausländische Broker sparen Gebühren und kosten Steuerarbeit.',
            'Im Insolvenzfall sind die Papiere sicher, aber wochenlang nicht handelbar.',
          ],
        },
      ],
    },
  },
}
