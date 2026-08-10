import type { LearnTopic } from '@/data/learn/types'

/**
 * Vollständig ausgearbeitetes Thema.
 *
 * Stufenaufbau: Beginner erklärt die Aufgabe einer Börse und verfolgt einen
 * Kauf vom Klick bis zur Buchung. Fortgeschritten vergleicht die Handelsplätze,
 * behandelt Ausführungsqualität und die Aufsicht. Profi geht auf Marktsegmente,
 * die Abwicklungsinfrastruktur und die Ausnahmefälle ein – Unterbrechungen,
 * Mistrades, Kapitalmaßnahmen.
 *
 * ## Was hier bewusst fehlt
 *
 * Gebührenmodelle einzelner Broker. Sie ändern sich mehrmals im Jahr, und ein
 * Vergleich, der nicht gepflegt wird, ist schlechter als keiner – er sieht aus
 * wie eine Empfehlung. Beschrieben werden die Arten von Kosten, damit man einen
 * Preisaushang lesen kann.
 */
export const boerse: LearnTopic = {
  slug: 'boerse',
  title: 'Börse',
  headline: 'Was eine Börse ist und was man dort tatsächlich macht',
  metaTitle: 'Was ist eine Börse? Aufbau, Handel, Aufsicht',
  metaDescription:
    'Welche Aufgaben eine Börse erfüllt, wie Handel und Abwicklung ablaufen, welche Handelsplätze es gibt und wer den Handel überwacht.',
  lead: 'Eine Börse ist ein organisierter Marktplatz mit Regeln – ihr eigentliches Produkt ist Vertrauen in die Abwicklung.',
  overview: [
    'An einer Börse treffen Kauf- und Verkaufsaufträge unter festgelegten Regeln zusammen. Sie garantiert nicht Kurse, sondern geordnete Preisfindung und verlässliche Abwicklung.',
    'Neben klassischen Börsen gibt es außerbörsliche Handelsplätze und Direkthandelsangebote. Sie unterscheiden sich in Kosten, Handelszeiten und Ausführungsqualität.',
    'Die Stufen behandeln Aufgaben und Ablauf eines Kaufs, dann Handelsplätze, Ausführungsqualität und Aufsicht, schließlich Marktsegmente, Clearing und Handelsunterbrechungen.',
  ],
  keywords: ['Börse', 'Handelsplatz', 'Xetra', 'Abwicklung', 'Börsenaufsicht'],
  related: ['aktie', 'wie-funktioniert-der-markt', 'etf'],
  symbols: ['dax', 'euro-stoxx-50'],
  levels: {
    // ---------------------------------------------------------------- Beginner
    beginner: {
      metaTitle: 'Was ist eine Börse? Einfach erklärt für Einsteiger',
      metaDescription:
        'Welche Aufgabe eine Börse hat, was dort gehandelt wird, wie ein Kauf vom Klick bis zur Buchung abläuft und welche Rolle dein Broker spielt.',
      title: 'Was ist eine Börse?',
      lead: 'Nach dieser Stufe weißt du, wozu eine Börse überhaupt da ist, was zwischen deinem Klick und dem Eintrag im Depot passiert und warum ein Limit fast immer die bessere Wahl ist.',
      readingMinutes: 10,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Du willst eine Aktie kaufen. Irgendwo da draußen gibt es jemanden, der genau diese Aktie verkaufen will. Ihr kennt euch nicht, wohnt womöglich auf verschiedenen Kontinenten und habt keinen Grund, einander zu vertrauen. Eine Börse löst dieses Problem – und das ist ihre eigentliche Leistung.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wozu eine Börse da ist',
        },
        {
          type: 'list',
          items: [
            '**Zusammenführen.** Kauf- und Verkaufsaufträge landen in einem gemeinsamen Orderbuch. Wer kaufen will, muss nicht selbst nach einem Verkäufer suchen.',
            '**Preise finden.** Es gibt keinen amtlich festgesetzten Preis für eine Aktie. Der Kurs entsteht dort, wo Angebot und Nachfrage sich treffen – nach Regeln, die für alle gleich sind und die vorher feststehen.',
            '**Handelbarkeit sichern.** Ein Markt, an dem man nur kaufen, aber nicht wieder verkaufen kann, wäre wertlos. Je mehr Aufträge zusammenkommen, desto leichter findet man jederzeit ein Gegenüber.',
            '**Abwicklung garantieren.** Du bekommst deine Aktien und der Verkäufer sein Geld – auch wenn einer von beiden zwischendurch zahlungsunfähig wird. Dafür sorgen Einrichtungen hinter der Börse, von denen Privatanleger nie etwas mitbekommen.',
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Was eine Börse ausdrücklich nicht tut',
          items: [
            'Sie garantiert keine Kurse und prüft nicht, ob ein Preis angemessen ist.',
            'Sie beurteilt nicht, ob ein Unternehmen gut geführt ist. Zulassung heißt: Die formalen Anforderungen sind erfüllt.',
            'Sie schützt nicht vor Verlusten. Sie sorgt dafür, dass der Handel geordnet abläuft – nicht dafür, dass er sich lohnt.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Vom Klick zur Buchung',
        },
        {
          type: 'paragraph',
          text: 'Was zwischen „Kaufen“ und dem Eintrag im Depot passiert, dauert Sekundenbruchteile und ein paar Tage – in dieser Reihenfolge.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Du erteilst die Order.** Sie geht nicht an die Börse, sondern an deinen Broker. Du selbst hast keinen Zugang zur Börse; das haben nur zugelassene Teilnehmer.',
            '**Der Broker leitet sie weiter** – an den Handelsplatz, den du gewählt hast, oder an den, den seine Ausführungsgrundsätze vorsehen.',
            '**Ausführung im Orderbuch.** Findet sich ein passendes Gegenangebot, kommt das Geschäft zustande. Findet sich keines, wartet deine Order oder verfällt.',
            '**Abwicklung.** Innerhalb weniger Werktage werden Wertpapiere und Geld tatsächlich getauscht. In der EU gilt derzeit zwei Werktage nach dem Geschäft; in den USA ist es seit 2024 ein Werktag.',
            '**Buchung ins Depot.** Erst jetzt gehören dir die Papiere. Vorher hattest du einen Anspruch darauf.',
          ],
        },
        {
          type: 'figure',
          figure: 'boerse-vom-klick-zur-buchung',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Dein Depot ist kein Bankkonto',
          items: [
            'Wertpapiere im Depot gehören dir, nicht der Bank. Sie verwahrt sie nur.',
            'Geht die Bank pleite, fallen sie nicht in die Insolvenzmasse – du kannst die Herausgabe verlangen oder das Depot übertragen.',
            'Deshalb greift die Einlagensicherung über 100.000 Euro hier nicht: Sie ist für Guthaben da, also für Geld, das der Bank gehört und das sie dir schuldet. Wertpapiere braucht sie nicht zu schulden, sie sind schon deine.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Handelszeiten und Auktionen',
        },
        {
          type: 'paragraph',
          text: 'Der deutsche Referenzhandel läuft werktags von 9:00 bis 17:30 Uhr. Er beginnt und endet nicht einfach – am Anfang steht eine Eröffnungsauktion, am Ende eine Schlussauktion. Dabei wird für einen kurzen Zeitraum nicht fortlaufend gehandelt; stattdessen sammeln sich Aufträge, und am Ende wird der eine Preis ermittelt, zu dem das größte Volumen zustande kommt.',
        },
        {
          type: 'paragraph',
          text: 'Das ist kein Ritual, sondern ein Schutzmechanismus. Nach einer Nachrichtenlage über Nacht ist völlig unklar, wo ein Kurs stehen sollte. Würde sofort fortlaufend gehandelt, entstünden willkürliche erste Kurse. Die Auktion bündelt die Unsicherheit in einem Preis.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was ein Kauf kostet',
        },
        {
          type: 'table',
          caption: 'Die drei Kostenarten – nur die erste steht auf der Abrechnung',
          head: ['Kostenart', 'Wer sie erhebt', 'Erkennbar?'],
          rows: [
            [
              'Ordergebühr',
              'Dein Broker, teils als Grundpreis plus Prozentsatz',
              'Ja, steht in der Abrechnung',
            ],
            [
              'Handelsplatzentgelt',
              'Die Börse beziehungsweise der Handelsplatz',
              'Meist ja, oft als eigene Zeile',
            ],
            [
              'Spread',
              'Niemand direkt – es ist der Abstand zwischen Kauf- und Verkaufspreis',
              'Nein. Er wird nie in Rechnung gestellt und ist trotzdem oft der größte Posten',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Warum ein Limit fast immer besser ist',
          items: [
            'Eine **unlimitierte Order** wird zum nächstbesten verfügbaren Preis ausgeführt – auch wenn dieser gerade weit vom letzten Kurs entfernt liegt.',
            'Eine **Limit-Order** legt fest, was du höchstens zahlst. Passt es nicht, wird nicht gehandelt – und das ist der bessere Ausgang.',
            'Der Preis dafür ist eine Unsicherheit: Es kann sein, dass gar nicht ausgeführt wird. Wer langfristig anlegt, kann damit leben.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was ein Index ist – und was er nicht ist',
        },
        {
          type: 'paragraph',
          text: '„Der DAX steht bei 18.000“ klingt wie eine Preisangabe und ist keine. Ein Index ist eine **Rechenvorschrift**: Man wählt eine Gruppe von Unternehmen aus, gewichtet sie nach einer Regel und rechnet daraus eine einzige Zahl. Der Startwert ist willkürlich festgelegt worden – für den DAX 1.000 Punkte am 31. Dezember 1987. Wichtig ist nie der Stand, sondern die Veränderung.',
        },
        {
          type: 'list',
          items: [
            '**Wer drin ist, entscheidet ein Gremium** nach festen Regeln – meist nach Marktwert und Handelsumsatz. Unternehmen steigen auf und ab; der Index von heute enthält andere Firmen als der vor zwanzig Jahren.',
            '**Die Gewichtung ist Teil der Regel.** In den meisten Indizes zählt ein Unternehmen nach seinem Börsenwert. Ein großes bewegt den Index also stärker als zehn kleine.',
            '**Ein Index ist nicht handelbar.** Er ist eine Zahl. Kaufen kann man nur ein Produkt, das ihn nachbildet – einen Indexfonds.',
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Kursindex oder Performanceindex – der Unterschied ist groß',
          items: [
            'Ein **Kursindex** zählt nur die Kurse. Am Tag der Dividendenzahlung fällt er, weil die Aktien um die Ausschüttung fallen – das Geld ist ja aus dem Unternehmen heraus.',
            'Ein **Performanceindex** rechnet die Dividenden so, als würden sie sofort wieder angelegt. Er steigt deshalb schneller.',
            'Der DAX wird üblicherweise als Performanceindex genannt, die meisten internationalen Indizes als Kursindex. Wer beide vergleicht, vergleicht ungleiche Dinge – über Jahrzehnte macht das mehrere hundert Prozent aus.',
            'Beim Vergleich eines Fonds mit „seinem Index" ist das die erste Frage: Welche Variante steht daneben?',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wann welche Börse geöffnet ist',
        },
        {
          type: 'paragraph',
          text: 'Der deutsche Parketthandel läuft werktags von 9:00 bis 17:30 Uhr, der elektronische Referenzmarkt in ähnlichem Rahmen. Die amerikanischen Börsen öffnen um 15:30 Uhr deutscher Zeit und schließen um 22:00 Uhr – die Überschneidung am Nachmittag ist deshalb die Zeit mit dem meisten Umsatz und den engsten Spannen.',
        },
        {
          type: 'list',
          items: [
            '**Außerbörsliche Handelsplätze** bieten oft bis 22 oder 23 Uhr an. Das ist bequem und nicht immer günstig: Je weiter die Heimatbörse geschlossen ist, desto mehr muss der Handelspartner schätzen – und das steht im Spread.',
            '**Feiertage sind national.** Am 3. Oktober ist Frankfurt zu und New York offen; am Thanksgiving-Donnerstag umgekehrt. Ein ETF auf US-Aktien wird dann in Deutschland trotzdem gehandelt, nur ohne die Preise, auf die er sich bezieht.',
            '**Zwischen Schluss und Eröffnung passiert trotzdem etwas.** Nachrichten aus der Nacht stecken am nächsten Morgen in der ersten Notierung – deshalb springen Kurse zur Eröffnung manchmal, ohne dass ein einziger Handel dazwischenlag.',
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
            'Die Börse organisiert Preisfindung und Abwicklung – sie garantiert keine Kurse.',
            'Deine Order läuft über den Broker; Zugang zur Börse haben nur zugelassene Teilnehmer.',
            'Wertpapiere im Depot gehören dir, nicht der Bank.',
            'Von drei Kostenarten steht nur eine sichtbar auf der Abrechnung.',
            'Ein Index ist eine Rechenvorschrift, kein Preis – und nur die Veränderung sagt etwas.',
            'Kursindex und Performanceindex unterscheiden sich um alle Dividenden. Immer nachsehen, welcher gemeint ist.',
            'Die umsatzstärkste Zeit ist der Nachmittag, wenn Europa und die USA gleichzeitig handeln.',
          ],
        },
      ],
    },

    // -------------------------------------------------------- Fortgeschritten
    fortgeschritten: {
      metaTitle: 'Handelsplätze und Ausführungsqualität im Vergleich',
      metaDescription:
        'Xetra, Regionalbörsen und außerbörslicher Handel im Vergleich, wie sich Ausführungsqualität messen lässt und welche Aufsicht den Handel überwacht.',
      title: 'Handelsplätze, Ausführung und Aufsicht',
      lead: 'Wo du handeln kannst, woran du gute Ausführung erkennst und was die Aufsicht leistet – und was nicht.',
      readingMinutes: 10,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Die meisten Broker bieten ein Dutzend Handelsplätze zur Auswahl. Die Wahl wird selten bewusst getroffen, und sie kostet trotzdem Geld – manchmal mehr als die Ordergebühr, um die so viel Aufhebens gemacht wird.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Drei Arten von Handelsplätzen',
        },
        {
          type: 'table',
          caption: 'Wo dieselbe Aktie gehandelt werden kann',
          head: ['Art', 'Wie gehandelt wird', 'Typische Zeiten', 'Stärke'],
          rows: [
            [
              'Elektronischer Referenzmarkt',
              'Offenes Orderbuch, alle Aufträge treffen aufeinander',
              '9:00 – 17:30 Uhr',
              'Die meiste Liquidität, die engsten Spannen bei deutschen Werten',
            ],
            [
              'Regionalbörse',
              'Orderbuch mit betreuendem Makler, der Kurse stellt',
              '8:00 – 20:00 Uhr, teils länger',
              'Auch bei selten gehandelten Papieren kommt ein Kurs zustande',
            ],
            [
              'Außerbörslicher Direkthandel',
              'Ein Handelspartner stellt dir einen Preis, du nimmst an oder nicht',
              'Oft 7:30 – 23:00 Uhr',
              'Lange Zeiten, sofortige Ausführung, häufig ohne Handelsplatzentgelt',
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'Beim Direkthandel handelst du nicht gegen andere Anleger, sondern gegen ein Unternehmen, das vom Spread lebt. Das ist nicht anrüchig – es ist ein anderes Geschäftsmodell. Aber die Interessen sind gegenläufig, und deshalb gilt hier eine Regel besonders: Vergleiche den gestellten Preis mit dem Kurs am Referenzmarkt, bevor du annimmst.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Der teuerste Zeitpunkt',
          items: [
            'Um 22 Uhr ist der Referenzmarkt seit über vier Stunden geschlossen. Es gibt keinen Vergleichskurs, an dem sich die Fairness eines Angebots messen ließe.',
            'Der Anbieter weiß das und kalkuliert entsprechend. Die Spanne ist dann regelmäßig deutlich größer als am Nachmittag.',
            'Bei ausländischen Werten kommt hinzu: Ist der Heimatmarkt geschlossen, muss auch ein Referenzmarkt schätzen.',
          ],
        },
        {
          type: 'figure',
          figure: 'boerse-handelszeiten',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Best Execution: die Pflicht und ihre Grenze',
        },
        {
          type: 'paragraph',
          text: 'Broker sind verpflichtet, Aufträge so auszuführen, dass für dich das bestmögliche Ergebnis erreicht wird. Wie das konkret aussieht, steht in den **Ausführungsgrundsätzen** – einem Dokument, das jeder Broker veröffentlicht und fast niemand liest.',
        },
        {
          type: 'paragraph',
          text: 'Die Pflicht bezieht sich nicht allein auf den Preis. Berücksichtigt werden dürfen auch Kosten, Geschwindigkeit, Ausführungswahrscheinlichkeit und die Abwicklung. Das gibt Spielraum, und dieser Spielraum ist der Grund, warum die Standardvorgabe eines Brokers nicht zwangsläufig der Handelsplatz mit dem besten Kurs ist.',
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Woran du gute Ausführung tatsächlich erkennst',
          items: [
            'Vergleiche den erzielten Kurs mit dem Referenzkurs zur selben Sekunde. Diese Abweichung ist die ehrlichste Kennzahl.',
            'Rechne die Ordergebühr und das Handelsplatzentgelt hinzu. Ein Handelsplatz „ohne Gebühren“ kann über den Spread deutlich teurer sein.',
            'Bei kleinen Ordergrößen wiegt die feste Gebühr schwerer, bei großen der Spread. Die richtige Wahl hängt vom Betrag ab.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wer den Handel überwacht',
        },
        {
          type: 'paragraph',
          text: 'Die Aufsicht ist mehrstufig, und die Stufen haben verschiedene Aufgaben.',
        },
        {
          type: 'list',
          items: [
            '**Die Handelsüberwachungsstelle** sitzt an der Börse selbst und beobachtet den laufenden Handel auf Auffälligkeiten. Sie ist ein eigenständiges Organ der Börse, nicht Teil ihrer Geschäftsleitung.',
            '**Die Börsenaufsichtsbehörde** des jeweiligen Bundeslandes beaufsichtigt die Börse als Einrichtung.',
            '**Die BaFin** ist für die Marktintegrität in Deutschland zuständig: Insiderhandel, Marktmanipulation, Veröffentlichungspflichten der Unternehmen.',
            '**Die ESMA** koordiniert auf europäischer Ebene und sorgt dafür, dass die Regeln in den Mitgliedstaaten gleich ausgelegt werden.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Für Anleger sind vor allem die Pflichten der Unternehmen relevant. **Ad-hoc-Mitteilungen** müssen kursrelevante Informationen unverzüglich veröffentlichen – damit nicht einige früher Bescheid wissen als andere. **Stimmrechtsmitteilungen** machen öffentlich, wenn jemand bestimmte Schwellen an einem Unternehmen überschreitet. **Directors’ Dealings** melden Käufe und Verkäufe durch Vorstand und Aufsichtsrat.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Was Aufsicht nicht leistet',
          items: [
            'Sie prüft keine Geschäftsmodelle und warnt nicht vor schlechten Unternehmen.',
            'Sie verhindert keine Kursstürze und keine Blasen.',
            'Sie greift überwiegend nachträglich ein. Ein Betrug wird geahndet, nachdem er stattgefunden hat – das Geld ist dann meist weg.',
            'Der Satz „das ist doch reguliert“ ist deshalb keine Aussage über das Risiko einer Anlage.',
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
            'Referenzmarkt, Regionalbörse und Direkthandel unterscheiden sich in Preisbildung, Zeiten und Interessenlage.',
            'Beim Direkthandel ist dein Gegenüber ein Unternehmen, das vom Spread lebt – Vergleichskurs prüfen.',
            'Best Execution meint das beste Gesamtergebnis, nicht zwingend den besten Kurs.',
            'Aufsicht sichert die Ordnung des Handels, nicht die Qualität der Anlage.',
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ Profi
    profi: {
      metaTitle: 'Börse für Profis: Segmente, Clearing, Unterbrechungen',
      metaDescription:
        'Marktsegmente und Zulassungsfolgen, Clearing und zentrale Gegenparteien, Volatilitätsunterbrechungen sowie Kapitalmaßnahmen in der Abwicklung.',
      title: 'Börse auf Profi-Niveau',
      lead: 'Marktsegmente, die Infrastruktur hinter der Abwicklung und was passiert, wenn der Handel aus dem Tritt gerät.',
      readingMinutes: 13,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Die Mechanik hinter dem Handel wird erst sichtbar, wenn etwas schiefgeht. Wer sie vorher kennt, versteht auch, warum eine Aktie plötzlich nicht handelbar ist oder warum am Morgen andere Stückzahlen im Depot stehen als am Abend zuvor.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Regulierter Markt und Freiverkehr',
        },
        {
          type: 'paragraph',
          text: 'Nicht jedes börsengehandelte Papier unterliegt denselben Regeln. Der **regulierte Markt** ist ein gesetzlich geregeltes Segment: Zulassung durch die Börse, Prospektpflicht, Rechnungslegung nach internationalen Standards, Ad-hoc-Publizität, Stimmrechtsmitteilungen. Der **Freiverkehr** ist dagegen privatrechtlich von der Börse organisiert; welche Pflichten gelten, bestimmt weitgehend deren Regelwerk.',
        },
        {
          type: 'paragraph',
          text: 'Für Anleger ist das kein Formalismus. Im Freiverkehr kann eine Aktie gelistet sein, ohne dass das Unternehmen einen geprüften Abschluss nach internationalen Standards vorlegen muss. Marktmissbrauchsrecht gilt zwar auch dort – die laufenden Informationspflichten sind aber schwächer.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Delisting: der Fall, den man nicht erwartet',
          items: [
            'Verlässt ein Unternehmen den regulierten Markt, verschwindet die Aktie nicht – sie wird nur schwerer handelbar, oft mit deutlich größeren Spannen.',
            'Beim Widerruf der Zulassung ist in Deutschland ein Erwerbsangebot an die Aktionäre vorgeschrieben. Wer es nicht annimmt, behält Anteile an einem Unternehmen mit erheblich reduzierter Publizität.',
            'Ein **Downlisting** in den Freiverkehr ist kein Delisting, wird aber häufig so genannt. Die Folgen ähneln sich.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was zwischen Abschluss und Lieferung passiert',
        },
        {
          type: 'paragraph',
          text: 'Zwischen dem Geschäft und der Buchung im Depot liegen zwei Werktage, und in dieser Zeit arbeiten zwei Einrichtungen, von denen Privatanleger nie hören.',
        },
        {
          type: 'paragraph',
          text: 'Die **zentrale Gegenpartei** (Central Counterparty) schaltet sich zwischen Käufer und Verkäufer. Rechtlich entstehen aus einem Geschäft zwei: Du kaufst von der Gegenpartei, der Verkäufer verkauft an sie. Fällt eine Seite aus, trägt die Gegenpartei den Schaden, nicht die andere Seite – abgesichert über Sicherheitsleistungen der Teilnehmer und einen Ausfallfonds. Nebenbei entsteht dabei **Netting**: Wer an einem Tag 900 Stück kauft und 850 verkauft, muss nur 50 liefern lassen. Das reduziert die tatsächlich zu bewegenden Beträge um ein Vielfaches.',
        },
        {
          type: 'paragraph',
          text: 'Der **Zentralverwahrer** führt die eigentlichen Bestände. Die Aktien liegen dort in einer Sammelverwahrung; deine Bank hält ein Konto beim Verwahrer, du hältst ein Depot bei der Bank. Diese Kette ist der Grund, warum ein Depotübertrag Tage dauert und nicht Sekunden.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Wenn nicht geliefert wird',
          items: [
            'Kann ein Verkäufer nicht liefern, entsteht ein Settlement Fail. Seit der EU-Abwicklungsverordnung fallen dafür tagesweise Strafzahlungen an.',
            'Ein Großteil solcher Fälle hat mit Leerverkäufen zu tun: Verkauft wurde etwas, das erst noch geliehen werden musste.',
            'Für dich als Käufer ändert das in der Regel nichts – die zentrale Gegenpartei steht dazwischen und beschafft notfalls am Markt.',
          ],
        },
        {
          type: 'figure',
          figure: 'boerse-abwicklung',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wenn der Handel unterbrochen wird',
        },
        {
          type: 'paragraph',
          text: 'Bewegt sich ein Kurs zu weit oder zu schnell, unterbricht das System den fortlaufenden Handel und ruft eine **Volatilitätsunterbrechung** aus – eine kurze Auktion von meist wenigen Minuten. Der Zweck ist nicht, den Kurs zu stützen, sondern die Preisbildung zu entschleunigen: Bei einer sprunghaften Bewegung soll niemand zu einem Preis ausgeführt werden, der eine Sekunde später niemandes Meinung mehr entspricht.',
        },
        {
          type: 'paragraph',
          text: 'Davon zu unterscheiden ist die **Handelsaussetzung**. Sie wird angeordnet, wenn eine Information aussteht, ohne die kein sinnvoller Preis zustande kommen kann – vor einer Übernahmemeldung etwa oder bei einer Insolvenz. Sie kann Stunden dauern oder Tage.',
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Mistrade-Regeln',
          items: [
            'Kommt ein Geschäft zu einem offensichtlich unsinnigen Preis zustande – ein Zahlendreher, ein technischer Fehler –, kann es innerhalb einer Frist aufgehoben werden.',
            'Die Regeln sind je Handelsplatz unterschiedlich und stehen in dessen Bedingungen. Ein Anspruch darauf besteht nicht in jedem Fall.',
            'Das ist einer der Gründe, warum eine unlimitierte Order in einem dünnen Orderbuch ein reales Risiko ist – und keines, auf dessen Korrektur man sich verlassen sollte.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Kapitalmaßnahmen: wenn sich das Papier selbst ändert',
        },
        {
          type: 'paragraph',
          text: 'Bei einem Aktiensplit im Verhältnis eins zu drei hältst du am nächsten Morgen dreimal so viele Aktien zu einem Drittel des Kurses. Dein Vermögen ist unverändert; nur die Stückelung ist eine andere. Ähnlich bei Kapitalerhöhungen mit Bezugsrecht, bei Abspaltungen oder Zusammenlegungen.',
        },
        {
          type: 'paragraph',
          text: 'Praktisch wichtig sind zwei Punkte. Erstens werden offene Orders bei Kapitalmaßnahmen in der Regel **gelöscht** – ein Limit, das sich auf den alten Kurs bezog, wäre nach dem Split unsinnig. Wer eine Order langfristig stehen hat, muss sie danach neu erfassen. Zweitens ist ein Kursrückgang am Tag einer Kapitalmaßnahme kein Verlust; Charts und Depotanzeigen rechnen ihn üblicherweise heraus, manche Übersichten tun das aber nicht.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was du dir merken solltest',
        },
        {
          type: 'list',
          items: [
            'Regulierter Markt und Freiverkehr unterscheiden sich in den laufenden Pflichten der Unternehmen erheblich.',
            'Zentrale Gegenpartei und Zentralverwahrer machen aus zwei Fremden ein sicheres Geschäft – und erklären, warum Übertragungen Tage dauern.',
            'Volatilitätsunterbrechung entschleunigt die Preisbildung, Handelsaussetzung wartet auf eine fehlende Information.',
            'Bei Kapitalmaßnahmen verfallen offene Orders, und ein optisch fallender Kurs ist kein Verlust.',
          ],
        },
      ],
    },
  },
}
