import type { LearnTopic } from '@/data/learn/types'

/**
 * Rohstoffe als Anlageklasse, mit Schwerpunkt auf Gold und Silber.
 *
 * Vollständig ausformuliert wie `aktie` und `zinseszins`. Der rote Faden über
 * die drei Stufen: Rohstoffe erzeugen keinen Ertrag – daraus folgt alles
 * Weitere, von der Bewertung über die Produktwahl bis zur Rolle im Portfolio.
 *
 * Steuerangaben stehen bewusst nur in der Profi-Stufe und mit ausdrücklichem
 * Hinweis, dass sie keine Beratung ersetzen. Sie sind der Teil, der sich am
 * ehesten ändert.
 */
export const rohstoffe: LearnTopic = {
  slug: 'rohstoffe',
  title: 'Rohstoffe',
  headline: 'Rohstoffe: Gold, Silber und was sie von Aktien unterscheidet',
  metaTitle: 'Rohstoffe: Gold, Silber und Rohstoffanlagen erklärt',
  metaDescription:
    'Rohstoffe als Anlageklasse in drei Stufen: von der Feinunze über ETCs und Rollverluste bis zu Steuern und der Wirkung im Portfolio.',
  lead: 'Ein Barren Gold zahlt keine Zinsen und ein Fass Öl keine Dividende. Was Rohstoffe trotzdem zur eigenen Anlageklasse macht – und wo die Fallstricke liegen.',
  overview: [
    'Rohstoffe sind die einzige große Anlageklasse, die aus sich heraus nichts erwirtschaftet. Ein Unternehmen erzielt Gewinne, eine Anleihe zahlt Zinsen, eine Immobilie bringt Miete. Ein Kilogramm Kupfer liegt einfach da. Der gesamte Ertrag muss deshalb aus einer Preisänderung kommen – und der Preis richtet sich nach Angebot und Nachfrage, nicht nach einem Ertragswert.',
    'Das klingt nach einem Nachteil und ist zunächst auch einer. Es erklärt aber zugleich, warum Rohstoffe im Portfolio etwas leisten können, was Aktien nicht leisten: Sie reagieren auf andere Ereignisse. Ein Lieferengpass, ein Ernteausfall, eine geopolitische Krise – Dinge, die Aktienkurse belasten, können Rohstoffpreise treiben.',
    'Gold und Silber nehmen dabei eine Sonderstellung ein. Sie werden kaum verbraucht, sondern gehortet, und beide tragen eine jahrtausendealte Geschichte als Geld mit sich. Das macht sie zum meistdiskutierten und zugleich meistmissverstandenen Teil dieser Anlageklasse.',
  ],
  keywords: [
    'Rohstoffe',
    'Gold',
    'Silber',
    'Edelmetalle',
    'Feinunze',
    'ETC',
    'Rollverluste',
    'Contango',
    'Gold-Silber-Ratio',
    'Inflationsschutz',
  ],
  related: ['etf', 'derivat', 'aktien-laender-branchen', 'worauf-achten-einsteiger'],
  symbols: ['gold', 'silber'],
  levels: {
    // ---------------------------------------------------------- Beginner
    beginner: {
      metaTitle: 'Rohstoffe verstehen: Gold, Silber und was sie sind',
      metaDescription:
        'Was Rohstoffe als Anlage ausmacht, warum Gold keine Zinsen zahlt und worin sich Silber davon unterscheidet – verständlich erklärt für den Einstieg.',
      title: 'Rohstoffe – die Grundlagen',
      lead: 'Warum ein Goldbarren etwas grundsätzlich anderes ist als eine Aktie, und was daraus folgt.',
      readingMinutes: 12,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Rohstoffe sind Güter, die aus der Natur gewonnen und weitgehend austauschbar sind. Ein Barren Gold aus Südafrika unterscheidet sich in nichts von einem aus Kanada, solange Reinheit und Gewicht stimmen. Genau diese Austauschbarkeit macht sie handelbar: Wer Rohstoffe kauft, kauft eine Menge und eine Qualität, keine Marke.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die vier Gruppen',
        },
        {
          type: 'table',
          caption: 'Übliche Einteilung des Rohstoffmarkts',
          head: ['Gruppe', 'Beispiele', 'Was den Preis bewegt'],
          rows: [
            [
              'Edelmetalle',
              'Gold, Silber, Platin',
              'Anlagenachfrage, Realzinsen, Notenbankkäufe',
            ],
            [
              'Industriemetalle',
              'Kupfer, Aluminium, Nickel',
              'Konjunktur, Bautätigkeit, Elektrifizierung',
            ],
            [
              'Energie',
              'Rohöl, Erdgas',
              'Förderentscheidungen, Konflikte, Wetter, Lagerbestände',
            ],
            [
              'Agrar',
              'Weizen, Kaffee, Zucker',
              'Ernten, Wetter, Transportwege, Handelspolitik',
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'Für private Anlage spielen fast nur die Edelmetalle eine Rolle, allen voran **Gold und Silber**. Die übrigen Gruppen sind zwar handelbar, aber über Umwege, die eigene Tücken mitbringen – dazu mehr in der nächsten Stufe.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Der entscheidende Unterschied: kein laufender Ertrag',
        },
        {
          type: 'paragraph',
          text: 'Wer eine Aktie hält, ist am Gewinn eines Unternehmens beteiligt. Wer eine Anleihe hält, bekommt Zinsen. Wer eine Wohnung vermietet, bekommt Miete. In allen drei Fällen entsteht Ertrag, ohne dass jemand das Papier oder die Immobilie kaufen muss.',
        },
        {
          type: 'paragraph',
          text: 'Bei Rohstoffen ist das anders. Ein Goldbarren im Tresor wird nicht mehr. Der **einzige** Weg zu einem Gewinn ist, dass später jemand mehr dafür zahlt als du. Das ist kein Makel, sondern eine Eigenschaft – aber sie ändert, wie man über eine solche Anlage nachdenkt.',
        },
        {
          type: 'figure',
          figure: 'rohstoffe-kein-ertrag',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Woran sich der Wert bemisst',
          items: [
            'Eine Aktie lässt sich an erwarteten Gewinnen messen. Ist der Kurs sehr hoch im Verhältnis dazu, ist das ein Warnsignal.',
            'Für Gold gibt es keine solche Kennzahl. Es gibt keinen „fairen Wert“, den man ausrechnen könnte – nur den Preis, den andere gerade zu zahlen bereit sind.',
            'Wer Gold kauft, trifft deshalb immer auch eine Aussage darüber, wie sich die Nachfrage anderer entwickeln wird. Das ist schwerer zu begründen als eine Gewinnschätzung.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die Feinunze – und warum der Euro-Preis zwei Ursachen hat',
        },
        {
          type: 'paragraph',
          text: 'Edelmetalle werden international in **Feinunzen** gehandelt. Eine Feinunze sind 31,1035 Gramm – nicht zu verwechseln mit der amerikanischen Unze für Lebensmittel, die leichter ist. Notiert wird fast immer in US-Dollar.',
        },
        {
          type: 'formula',
          expression: 'Preis in Euro = Preis in USD je Unze ÷ Wechselkurs EUR/USD',
          description:
            'Steht Gold bei 2.400 USD und EUR/USD bei 1,10, kostet die Unze rund 2.182 Euro. Fällt der Euro auf 1,00, kostet dieselbe Unze 2.400 Euro – ohne dass sich der Goldpreis bewegt hätte.',
        },
        {
          type: 'paragraph',
          text: 'Daraus folgt etwas, das viele überrascht: Als Anleger im Euroraum trägst du bei Gold **zwei** Risiken gleichzeitig. Das des Metallpreises und das des Wechselkurses. In manchen Jahren gleichen sie sich aus, in anderen verstärken sie sich.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Gold und Silber sind nicht dasselbe',
        },
        {
          type: 'table',
          caption: 'Zwei Metalle, zwei Charaktere',
          head: ['', 'Gold', 'Silber'],
          rows: [
            ['Industrienachfrage', 'gering, etwa ein Zehntel', 'rund die Hälfte'],
            ['Marktgröße', 'sehr groß', 'deutlich kleiner'],
            ['Schwankung', 'moderat', 'deutlich höher'],
            ['Notenbanken', 'kaufen und halten es', 'spielt kaum eine Rolle'],
            ['Umsatzsteuer beim Kauf', 'befreit (Anlagegold)', 'fällt an'],
          ],
        },
        {
          type: 'paragraph',
          text: 'Silber wird oft als „kleiner Bruder“ des Goldes bezeichnet. Das trifft die Richtung, aber nicht den Charakter: Weil die halbe Nachfrage aus der Industrie kommt – Photovoltaik, Elektronik, Löttechnik –, hängt Silber zusätzlich an der Konjunktur. Es reagiert damit auf mehr Einflüsse, und die kleinere Marktgröße verstärkt jede Bewegung.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Die Umsatzsteuer ist kein Detail',
          items: [
            'Anlagegold ist in der EU von der Umsatzsteuer befreit. Wer physisches Gold kauft, zahlt den Metallpreis plus einen Aufschlag des Händlers.',
            'Bei Silbermünzen und -barren fällt Umsatzsteuer an. Je nach Ware und Händler über die Differenzbesteuerung abgemildert, aber nie ganz vermieden.',
            'Das heißt: Silber muss erst um diesen Betrag steigen, bevor überhaupt ein Gewinn beginnt. Bei kleinen Beträgen ist das ein spürbarer Startnachteil.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Drei verbreitete Missverständnisse',
        },
        {
          type: 'list',
          items: [
            '**„Gold schützt vor Inflation.“** Über sehr lange Zeiträume hat Gold die Kaufkraft ungefähr erhalten. Über zehn oder zwanzig Jahre kann es aber deutlich hinter der Inflation zurückbleiben – wer 1980 auf dem Höchststand kaufte, brauchte fast drei Jahrzehnte, um nominal wieder dort zu sein.',
            '**„Gold steigt, wenn Aktien fallen.“** Manchmal ja, oft nicht. In der Finanzkrise 2008 fiel Gold zunächst mit, weil Anleger verkauften, was sich verkaufen ließ. Verlässlich gegenläufig ist es nicht.',
            '**„Physisch ist immer sicherer.“** Physisches Gold hat kein Ausfallrisiko eines Emittenten – aber ein Diebstahlrisiko, Lagerkosten und einen spürbaren Abstand zwischen An- und Verkaufspreis. Sicherer ist es nur in einer bestimmten Hinsicht.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wie viel gehört ins Depot?',
        },
        {
          type: 'paragraph',
          text: 'Auf diese Frage gibt es keine allgemeingültige Antwort, und wer eine nennt, verkauft meist etwas. Was sich sagen lässt: Rohstoffe sind eine **Beimischung**, kein Fundament. Ein Anteil im niedrigen einstelligen bis knapp zweistelligen Prozentbereich ist die verbreitete Größenordnung – nicht, weil sie bewiesen wäre, sondern weil darüber hinaus der fehlende laufende Ertrag zunehmend ins Gewicht fällt.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die vier Wege, Gold zu halten',
        },
        {
          type: 'paragraph',
          text: 'Sie unterscheiden sich in Kosten, Verwahrung und Steuer – und die Unterschiede sind größer als die zwischen zwei Aktienfonds.',
        },
        {
          type: 'table',
          caption: 'Was jeweils dafür und dagegen spricht',
          head: ['Weg', 'Vorteil', 'Preis dafür'],
          rows: [
            [
              'Barren und Münzen zu Hause',
              'Niemandes Verbindlichkeit, jederzeit greifbar',
              'Diebstahlrisiko, Versicherungsfrage, deutlicher Abstand zwischen An- und Verkaufspreis',
            ],
            [
              'Schließfach oder Händlerlager',
              'Sicherer verwahrt, größere Mengen möglich',
              'Laufende Gebühr, und man ist auf den Verwahrer angewiesen',
            ],
            [
              'Wertpapier mit Auslieferungsanspruch',
              'Handelbar wie eine Aktie, Gewinn nach einem Jahr Haltedauer steuerfrei',
              'Rechtlich eine Schuldverschreibung – der Emittent zählt, auch wenn Gold hinterlegt ist',
            ],
            [
              'Fonds oder ETC auf den Preis',
              'Kleine Beträge, sparplanfähig, keine Verwahrfrage',
              'Laufende Kosten, kein Metall in der Hand, steuerlich wie ein Wertpapier',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Die Spanne zwischen Kauf und Verkauf',
          items: [
            'Beim physischen Kauf zahlt man den Metallpreis **plus** einen Aufschlag – und beim Verkauf bekommt man ihn **minus** einen Abschlag. Zusammen sind das je nach Stückelung mehrere Prozent.',
            'Kleine Einheiten sind dabei am teuersten: Eine Ein-Gramm-Prägung kostet anteilig ein Vielfaches einer Unze, weil der Herstellungsaufwand derselbe ist.',
            'Das heißt praktisch: Gold muss erst um diese Spanne steigen, bevor überhaupt ein Gewinn beginnt. Bei kurzen Haltedauern ist das der größte Kostenblock – größer als jede Fondsgebühr.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Warum Rohstoff-Fonds nicht den Preis abbilden',
        },
        {
          type: 'paragraph',
          text: 'Bei Öl, Kupfer oder Weizen gibt es einen Weg, der bei Gold nicht nötig ist: Diese Rohstoffe lassen sich nicht lagern wie Metall – ein Fonds kauft deshalb **Terminkontrakte** statt der Ware. Und ein Terminkontrakt läuft aus. Kurz vor dem Ende wird er verkauft und der nächste gekauft. Dieses Weiterrollen kostet oder bringt Geld, je nachdem, ob der nächste Kontrakt teurer oder billiger ist als der auslaufende.',
        },
        {
          type: 'paragraph',
          text: 'Deshalb kann ein Rohstofffonds über Jahre verlieren, obwohl der Rohstoffpreis am Ende gleich hoch steht wie am Anfang. Das ist kein Fehler des Fonds, sondern die Bauweise des Marktes – und der Grund, warum die Wertentwicklung solcher Produkte regelmäßig nicht zu dem passt, was in der Zeitung über den Ölpreis steht.',
        },
        {
          type: 'keyfacts',
          items: [
            { label: 'Ertragsart', value: 'ausschließlich Preisänderung' },
            { label: 'Laufender Ertrag', value: 'keiner' },
            { label: 'Handelseinheit', value: 'Feinunze = 31,1035 g' },
            { label: 'Notierung', value: 'meist US-Dollar' },
            { label: 'Zusätzliches Risiko', value: 'Wechselkurs' },
            { label: 'Rolle im Depot', value: 'Beimischung' },
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
            'Rohstoffe zahlen keinen laufenden Ertrag – der gesamte Gewinn muss aus dem Preis kommen.',
            'Der Euro-Preis hat zwei Ursachen: das Metall und den Wechselkurs.',
            'Silber ist kein kleines Gold: halbe Industrienachfrage, kleinerer Markt, Umsatzsteuer beim Kauf.',
            'Vier Wege, Gold zu halten – sie unterscheiden sich in Kosten, Verwahrung und Steuer erheblich.',
            'Die Spanne zwischen An- und Verkauf ist bei physischem Gold der größte Kostenblock.',
            'Fonds auf Öl oder Weizen bilden den Preis nicht ab, weil sie Terminkontrakte weiterrollen müssen.',
            'Beimischung, kein Fundament.',
          ],
        },
      ],
    },

    // --------------------------------------------------- Fortgeschritten
    fortgeschritten: {
      metaTitle: 'Rohstoffe anlegen: ETC, Futures und Rollverluste',
      metaDescription:
        'Wie man Gold und Silber tatsächlich kauft: physisch, ETC oder Terminkontrakt. Mit Besicherung, Rollverlusten und dem Zusammenhang zum Realzins.',
      title: 'Rohstoffe – Wege, Produkte und Kennzahlen',
      lead: 'Vier Wege führen zum Rohstoff, und sie unterscheiden sich stärker, als es aussieht.',
      readingMinutes: 18,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Die vier Wege im Vergleich',
        },
        {
          type: 'table',
          caption: 'Wege in Rohstoffe und ihre Eigenheiten',
          head: ['Weg', 'Was du hältst', 'Hauptnachteil'],
          rows: [
            ['Physisch', 'Barren oder Münzen', 'Lagerung, Versicherung, Handelsspanne'],
            [
              'ETC mit Hinterlegung',
              'Schuldverschreibung, mit Metall besichert',
              'Emittentenrisiko, wenn auch besichert',
            ],
            [
              'Futures-Fonds',
              'Anteil an rollenden Terminkontrakten',
              'Rollverluste, oft erheblich',
            ],
            [
              'Minenaktien',
              'Anteil an Unternehmen',
              'Unternehmensrisiko, folgt dem Metall nur grob',
            ],
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Warum es bei Rohstoffen keinen echten ETF gibt',
        },
        {
          type: 'paragraph',
          text: 'Ein ETF ist rechtlich ein Fonds und muss streuen. Ein Produkt, das nur Gold abbildet, erfüllt diese Anforderung nicht – ein einzelner Rohstoff ist keine Streuung. Deshalb sind Gold- und Silberprodukte in Europa fast immer **ETCs**: Exchange Traded Commodities, und das sind Schuldverschreibungen.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Was „Schuldverschreibung“ hier bedeutet',
          items: [
            'Ein Fonds ist Sondervermögen. Geht die Fondsgesellschaft pleite, gehört das Vermögen weiterhin den Anlegern.',
            'Ein ETC ist eine Forderung gegen den Emittenten. Geht dieser pleite, bist du Gläubiger – nicht Eigentümer des Metalls.',
            'Seriöse ETCs mildern das durch Hinterlegung: Für jeden Anteil liegt physisches Metall bei einer Verwahrstelle. Prüfen lohnt sich trotzdem, ob es hinterlegt und ob ein Lieferanspruch vereinbart ist.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Rollverluste: der teuerste Anfängerfehler',
        },
        {
          type: 'paragraph',
          text: 'Öl, Weizen oder Kupfer lassen sich nicht sinnvoll einlagern. Produkte auf diese Rohstoffe halten deshalb **Terminkontrakte** – Verträge auf Lieferung zu einem künftigen Datum. Läuft ein Kontrakt aus, wird er verkauft und ein späterer gekauft. Das nennt man rollen.',
        },
        {
          type: 'paragraph',
          text: 'Ist der spätere Kontrakt teurer als der auslaufende, kostet jeder Rollvorgang Geld. Dieser Zustand heißt **Contango** und ist bei lagerfähigen Rohstoffen der Normalfall, weil Lagerung und Zinsen im Preis stecken. Der umgekehrte Fall – der spätere Kontrakt ist billiger – heißt **Backwardation** und bringt einen Rollgewinn.',
        },
        {
          type: 'figure',
          figure: 'rohstoffe-rollkurve',
        },
        {
          type: 'formula',
          expression: 'Ergebnis ≈ Preisänderung des Rohstoffs + Rollertrag − Kosten',
          description:
            'Der Rollertrag kann über Jahre stark negativ sein. Es ist deshalb möglich, dass der Rohstoffpreis steigt und das Produkt darauf trotzdem verliert – ein Ergebnis, das ohne Kenntnis der Mechanik unerklärlich wirkt.',
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Für Gold und Silber gilt das nicht',
          items: [
            'Edelmetalle sind gut lagerfähig, deshalb arbeiten die gängigen Produkte mit physischer Hinterlegung statt mit Terminkontrakten.',
            'Rollverluste sind hier also kein Thema. Sie werden es sofort, wenn ein Produkt einen breiten Rohstoffkorb oder Energie abbildet.',
            'Ein Blick ins Factsheet klärt das in einer Minute: Steht dort „physisch hinterlegt“, wird nicht gerollt.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Der Realzins – der wichtigste Treiber beim Gold',
        },
        {
          type: 'paragraph',
          text: 'Gold zahlt nichts. Wer es hält, verzichtet auf den Zins, den er anderswo sicher bekäme. Dieser Verzicht ist der Preis des Haltens – und er richtet sich nicht nach dem nominalen Zins, sondern nach dem **Realzins**: dem Zins abzüglich der erwarteten Inflation.',
        },
        {
          type: 'formula',
          expression: 'Realzins ≈ Nominalzins − erwartete Inflation',
          description:
            'Bei 4 % Zins und 2 % erwarteter Inflation beträgt der Realzins rund 2 % – Gold zu halten kostet dann spürbar. Bei 2 % Zins und 5 % Inflation ist der Realzins negativ; dann verliert auch das Tagesgeld an Kaufkraft und Gold büßt seinen Nachteil ein.',
        },
        {
          type: 'paragraph',
          text: 'Diese Beziehung erklärt Goldbewegungen besser als jede Krisenerzählung. Sie ist keine Garantie und gilt nicht in jedem Quartal – aber wer nur eine einzige Größe beobachten will, sollte den Realzins nehmen und nicht die Nachrichtenlage.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die Gold-Silber-Ratio',
        },
        {
          type: 'formula',
          expression: 'Ratio = Goldpreis je Unze ÷ Silberpreis je Unze',
          description:
            'Bei 2.400 USD für Gold und 30 USD für Silber liegt die Ratio bei 80: Eine Unze Gold kostet so viel wie 80 Unzen Silber.',
        },
        {
          type: 'paragraph',
          text: 'Historisch schwankt sie grob zwischen 40 und 100. Ein hoher Wert bedeutet, dass Silber gegenüber Gold billig ist. Als Handelssignal taugt das wenig – die Ratio kann jahrelang hoch bleiben. Als Einordnung ist sie nützlich: Sie zeigt, welches der beiden Metalle die Bewegung gerade trägt.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Worauf beim Produkt zu achten ist',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Physisch hinterlegt?** Steht das Metall tatsächlich in einem Tresor oder wird der Preis über Kontrakte nachgebildet?',
            '**Lieferanspruch?** Manche ETCs erlauben, sich das Metall ausliefern zu lassen. Das ist nicht nur symbolisch – in Deutschland hat es steuerliche Folgen (siehe Profi-Stufe).',
            '**Laufende Kosten.** Bei Edelmetall-ETCs üblicherweise 0,1 bis 0,5 Prozent im Jahr. Sie werden aus dem hinterlegten Metall entnommen, der Anteil schrumpft also langsam.',
            '**Währung.** Ein in Euro gehandeltes Produkt ist deshalb noch nicht währungsgesichert. Ohne ausdrückliche Sicherung trägst du das Dollarrisiko.',
            '**Handelsspanne.** Beim physischen Kauf entscheidend: der Abstand zwischen An- und Verkaufspreis. Bei kleinen Stückelungen ist er prozentual am größten.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Warum Rohstoffe keinen Ertrag abwerfen – und was das bedeutet',
        },
        {
          type: 'paragraph',
          text: 'Eine Aktie zahlt Dividenden, eine Anleihe Zinsen, eine Immobilie Miete. Ein Barren Gold liegt und tut nichts. Das ist kein Nachteil unter mehreren, sondern der entscheidende Unterschied: Bei Rohstoffen gibt es keinen Zinseszins, weil es keinen Zins gibt. Der gesamte Ertrag muss aus einem höheren Preis kommen, den ein späterer Käufer zu zahlen bereit ist.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Drei Folgen, die daraus unmittelbar entstehen',
          items: [
            '**Es gibt keinen inneren Wert, gegen den man rechnen kann.** Ein Unternehmen lässt sich über seine Gewinne bewerten, ein Barren nicht. Jede Aussage über „zu teuer" oder „zu billig" ist bei Rohstoffen ein Vergleich mit der Vergangenheit, keine Bewertung.',
            '**Die Lagerung kostet, statt zu bringen.** Tresor, Versicherung, Produktgebühr – bei einem ETC laufen sie als jährlicher Abschlag mit. Über zwanzig Jahre summiert sich ein halber Prozentpunkt auf rund ein Zehntel des Bestands.',
            '**Warten hilft nicht von allein.** Bei Aktien arbeitet die Zeit über die einbehaltenen Gewinne für den Anleger. Hier arbeitet sie über die Kosten gegen ihn.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was der Preis eines Industriemetalls antreibt',
        },
        {
          type: 'paragraph',
          text: 'Gold folgt dem Realzins; Kupfer, Aluminium und Eisenerz folgen etwas anderem. Sie werden verbraucht, nicht gehortet – und damit hängt ihr Preis an der Industrieproduktion, vor allem an der Bautätigkeit in großen Volkswirtschaften.',
        },
        {
          type: 'table',
          caption: 'Zwei verschiedene Rohstoffwelten',
          head: ['', 'Edelmetalle', 'Industriemetalle und Energie'],
          rows: [
            [
              'Wichtigster Treiber',
              'Realzins, Währung, Krisennachfrage',
              'Industrieproduktion und Bau, vor allem in China',
            ],
            [
              'Bestand über der Erde',
              'sehr groß – fast alles je geförderte Gold existiert noch',
              'gering – was verbraucht ist, ist weg',
            ],
            [
              'Reaktion des Angebots',
              'träge, die Förderung ändert am Bestand kaum etwas',
              'ebenfalls träge: Eine neue Mine braucht viele Jahre',
            ],
            [
              'Typischer Verlauf',
              'lange Seitwärtsphasen, dann sprunghafte Bewegungen',
              'ausgeprägte Zyklen: hoher Preis → Investition → Überangebot → Preisverfall',
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'Die letzte Zeile ist der Kern des Rohstoffzyklus, und er erklärt sich selbst: Hohe Preise finanzieren neue Minen, die Jahre später zugleich in Betrieb gehen – regelmäßig dann, wenn die Nachfrage schon nachgelassen hat. Das Angebot kommt systematisch zu spät, und zwar in beide Richtungen.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wie viel gehört ins Depot',
        },
        {
          type: 'list',
          items: [
            '**Die übliche Größenordnung liegt im einstelligen Prozentbereich.** Darunter wirkt der Beitrag zur Streuung nicht mehr messbar, darüber bestimmt eine ertraglose Position spürbar das Gesamtergebnis.',
            '**Die Begründung entscheidet über die Höhe.** Wer Streuung will, braucht wenig. Wer sich gegen einen Extremfall absichern will, braucht mehr – und sollte wissen, dass er dafür laufend Rendite bezahlt.',
            '**Rebalancing ist hier wichtiger als anderswo**, gerade weil die Position ertraglos ist: Ohne Zurücksetzen wächst sie in guten Rohstoffjahren still über das an, was beschlossen war.',
            '**Ein Rohstoffkorb ist etwas anderes als Gold.** Der Korb enthält Terminkontrakte und damit Rollkosten; Gold als hinterlegtes Metall hat sie nicht. Beides in einen Topf zu werfen ist der häufigste Fehler bei der Höhe.',
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
            'Rohstoffe werfen keinen Ertrag ab – der ganze Gewinn muss aus einem höheren Preis kommen.',
            'Ohne inneren Wert ist „zu teuer" immer ein Vergleich mit der Vergangenheit, keine Bewertung.',
            'Edelmetalle folgen dem Realzins, Industriemetalle der Industrieproduktion.',
            'Das Angebot kommt im Rohstoffzyklus systematisch zu spät – in beide Richtungen.',
            'Ein Rohstoffkorb hat Rollkosten, hinterlegtes Gold nicht: zwei verschiedene Dinge.',
          ],
        },
        {
          type: 'keyfacts',
          items: [
            { label: 'Produktform in Europa', value: 'meist ETC, kein ETF' },
            { label: 'Rechtsnatur ETC', value: 'Schuldverschreibung' },
            { label: 'Rollverluste', value: 'nur bei Terminkontrakten' },
            { label: 'Wichtigster Treiber Gold', value: 'Realzins' },
            { label: 'Typische ETC-Kosten', value: '0,1 – 0,5 % p. a.' },
          ],
        },
      ],
    },

    // ------------------------------------------------------------- Profi
    profi: {
      metaTitle: 'Rohstoffe: Steuern, Rollmechanik und Portfoliowirkung',
      metaDescription:
        'Steuerliche Behandlung von Gold und Silber in Deutschland, Rollmechanik im Detail und was Rohstoffe im Portfolio wirklich leisten – und was nicht.',
      title: 'Rohstoffe – Steuern, Sonderfälle und Portfoliowirkung',
      lead: 'Wo die Anlageklasse steuerlich aus der Reihe fällt, und was empirisch von ihrem Ruf übrig bleibt.',
      readingMinutes: 14,
      status: 'complete',
      blocks: [
        {
          type: 'callout',
          variant: 'warning',
          title: 'Keine Steuerberatung',
          items: [
            'Die folgenden Angaben beschreiben die Rechtslage in Deutschland in ihren Grundzügen und dienen der Einordnung.',
            'Steuerrecht ändert sich, und die Behandlung hängt an Details des einzelnen Produkts und deiner persönlichen Situation.',
            'Für konkrete Entscheidungen ist eine Steuerberatung die richtige Adresse.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Der Sonderweg: physisches Gold nach einem Jahr',
        },
        {
          type: 'paragraph',
          text: 'Aktien, Fonds und ETFs unterliegen der Abgeltungsteuer – unabhängig davon, wie lange du sie hältst. Physische Edelmetalle sind anders eingeordnet: Sie gelten als **anderes Wirtschaftsgut** im Sinne von § 23 EStG. Ein Verkauf innerhalb eines Jahres nach dem Kauf ist ein privates Veräußerungsgeschäft und mit dem persönlichen Steuersatz zu versteuern; nach Ablauf eines Jahres ist der Gewinn steuerfrei.',
        },
        {
          type: 'paragraph',
          text: 'Das ist kein kleiner Unterschied. Bei einem hohen persönlichen Steuersatz kann die Haltedauer über einen erheblichen Teil des Ergebnisses entscheiden – ein Effekt, den es bei Aktien in dieser Form nicht gibt.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'ETCs mit Lieferanspruch',
          items: [
            'Ein ETC ist rechtlich eine Schuldverschreibung und damit grundsätzlich der Abgeltungsteuer unterworfen.',
            'Für Produkte, die einen Anspruch auf Lieferung des hinterlegten Metalls verbriefen, hat die Rechtsprechung entschieden, dass sie wie physisches Gold zu behandeln sind – mit derselben Jahresfrist.',
            'Ob ein bestimmtes Produkt darunterfällt, hängt an seinen Bedingungen. Das gehört vor dem Kauf geprüft, nicht danach.',
          ],
        },
        {
          type: 'figure',
          figure: 'rohstoffe-gold-steuer',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Umsatzsteuer: warum Silber teurer startet',
        },
        {
          type: 'table',
          caption: 'Umsatzsteuer beim physischen Kauf in Deutschland',
          head: ['Ware', 'Behandlung', 'Folge'],
          rows: [
            [
              'Anlagegold',
              'umsatzsteuerbefreit',
              'Kaufpreis ≈ Metallpreis plus Händleraufschlag',
            ],
            [
              'Silberbarren',
              'voller Steuersatz',
              'spürbarer Aufschlag, der erst verdient werden muss',
            ],
            [
              'Silbermünzen',
              'oft Differenzbesteuerung',
              'geringerer, aber im Preis unsichtbarer Aufschlag',
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'Bei der Differenzbesteuerung wird nur die Handelsspanne des Händlers besteuert, nicht der volle Warenwert. Der Nachteil: Der Steueranteil ist im Preis nicht ausgewiesen, was den Vergleich zwischen Händlern erschwert. Beim Wiederverkauf an einen anderen Händler kann das zu Abschlägen führen.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Rollmechanik im Detail',
        },
        {
          type: 'paragraph',
          text: 'Der Terminpreis eines lagerfähigen Rohstoffs lässt sich näherungsweise aus dem heutigen Preis, dem Zins und den Lagerkosten herleiten. Wer Öl in drei Monaten liefern will, muss es lagern, versichern und das gebundene Kapital verzinsen.',
        },
        {
          type: 'formula',
          expression:
            'Terminpreis ≈ Kassapreis × (1 + Zins + Lagerkosten − Verfügbarkeitsprämie)',
          description:
            'Die Verfügbarkeitsprämie ist der Vorteil, den Verbraucher daraus ziehen, die Ware sofort zu haben. Ist sie sehr hoch – etwa bei akutem Mangel –, kann der Terminpreis unter den Kassapreis fallen: Backwardation.',
        },
        {
          type: 'paragraph',
          text: 'Für Anlageprodukte hat das eine unangenehme Folge: In dauerhaftem Contango frisst das Rollen einen Teil der Rendite auf, Jahr für Jahr. Bei Erdgas erreichte dieser Effekt in manchen Perioden eine Größenordnung, gegen die jede Kostenquote vernachlässigbar wirkt. Wer Rohstoffprodukte jenseits von Edelmetallen erwägt, muss diese Größe kennen – sie steht nicht im Kostenblatt.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was Rohstoffe im Portfolio tatsächlich leisten',
        },
        {
          type: 'paragraph',
          text: 'Die übliche Begründung lautet: geringe Korrelation zu Aktien, also Diversifikation. Das ist im Grundsatz richtig und im Detail unzuverlässig. Korrelationen sind nicht stabil – ausgerechnet in schweren Marktkrisen steigen sie oft, weil breite Verkäufe alles gleichzeitig treffen.',
        },
        {
          type: 'list',
          items: [
            '**2008:** Gold fiel zunächst mit den Aktien, weil Anleger Liquidität brauchten. Erst danach setzte die Erholung ein.',
            '**2020:** Der Einbruch im März erfasste ebenfalls beide. Die Erholung des Goldes kam schneller.',
            '**2022:** Bei hoher Inflation und steigenden Zinsen trat Gold weitgehend auf der Stelle – der oft erwartete Inflationsschutz zeigte sich nicht, weil die Realzinsen stiegen.',
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Die ehrlichere Formulierung',
          items: [
            'Gold ist kein verlässlicher Schutz gegen Inflation über mittlere Zeiträume. Wer das erwartet, wird enttäuscht.',
            'Es ist eher ein Schutz gegen Vertrauensverlust – in Währungen, in Institutionen, in die Zahlungsfähigkeit von Staaten.',
            'Diese Ereignisse sind selten. Eine Versicherung, die selten zahlt, kostet in der Zwischenzeit Rendite. Genau das ist die Abwägung.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Minenaktien sind kein Ersatz',
        },
        {
          type: 'paragraph',
          text: 'Goldminen wirken wie ein gehebelter Zugang zum Metall: Steigt der Goldpreis über die Förderkosten, wächst der Gewinn überproportional. In der Praxis kommt jedoch alles hinzu, was Unternehmen mitbringen – Verschuldung, Führungsentscheidungen, politische Risiken der Förderländer, Streiks, Umweltauflagen.',
        },
        {
          type: 'paragraph',
          text: 'Über lange Zeiträume sind Minenaktien deshalb keine saubere Abbildung des Metallpreises. Sie sind Aktien mit einem Rohstoffbezug – und gehören in die Aktienquote, nicht in die Rohstoffquote.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Verwahrung: die unterschätzte Entscheidung',
        },
        {
          type: 'table',
          caption: 'Verwahrformen und ihre Kehrseiten',
          head: ['Form', 'Vorteil', 'Kehrseite'],
          rows: [
            [
              'Zu Hause',
              'sofort verfügbar, keine Gebühr',
              'Diebstahl, Versicherungsgrenzen',
            ],
            [
              'Bankschließfach',
              'gesichert',
              'Jahresgebühr, Zugang nur zu Öffnungszeiten',
            ],
            [
              'Zollfreilager',
              'professionell, versichert',
              'Kosten, Vertrauen in den Betreiber',
            ],
            [
              'ETC',
              'kein Aufwand, börsentäglich handelbar',
              'Emittentenrisiko trotz Hinterlegung',
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'Hausratversicherungen decken Bargeld und Wertsachen oft nur bis zu einem niedrigen Betrag ab, im Schließfach mitunter etwas höher. Wer nennenswerte Beträge physisch hält, sollte die Police lesen, bevor er den Kauf tätigt – nicht danach.',
        },
        {
          type: 'keyfacts',
          items: [
            { label: 'Physisches Gold', value: 'nach 1 Jahr steuerfrei (§ 23 EStG)' },
            { label: 'ETC ohne Lieferanspruch', value: 'Abgeltungsteuer' },
            { label: 'Anlagegold', value: 'umsatzsteuerbefreit' },
            { label: 'Silber', value: 'umsatzsteuerpflichtig' },
            { label: 'Minenaktien', value: 'gehören in die Aktienquote' },
            { label: 'Korrelation', value: 'niedrig, aber nicht stabil' },
          ],
        },
      ],
    },
  },
}
