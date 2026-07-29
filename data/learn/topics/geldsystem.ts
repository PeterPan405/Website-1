import type { LearnTopic } from '@/data/learn/types'

/**
 * Vollständig ausgearbeitetes Thema.
 *
 * ## Warum es dieses Thema neben „Währungen & Wechselkurse“ gibt
 *
 * Das andere Thema beantwortet eine Anlegerfrage: Was macht der Wechselkurs
 * mit meiner Rendite? Dieses hier beantwortet die Frage darunter: Was ist das
 * eigentlich, was da schwankt – und woher kommt es? Beides in eine Seite zu
 * packen hieße, jemandem die Absicherung eines Dollar-ETF zu erklären, bevor
 * geklärt ist, was einen Dollar zu einem Dollar macht.
 *
 * ## Der Kern des Themas
 *
 * Geld ist eine Forderung, kein Ding. Fast alles Weitere folgt daraus: warum
 * Geldmenge und Schulden zusammen wachsen, warum eine Staatsanleihe und die
 * Währung desselben Staates dasselbe Vertrauen brauchen, und warum Währungen
 * nicht an Geldmengen sterben, sondern an verlorenem Vertrauen.
 *
 * ## Zur Zahl 27
 *
 * Die Behauptung „Papiergeld hält im Schnitt 27 Jahre“ war der Anlass für
 * dieses Thema. Sie steht auf der Seite – aber mit ihrer Herkunft, und die
 * hält der Nachfrage nicht stand. Eine Zahl zu übernehmen, weil sie oft
 * zitiert wird, wäre auf einer Seite mit Quellenverzeichnis das Gegenteil
 * dessen, wofür das Verzeichnis da ist. Was stattdessen gezeigt wird, sind
 * nachprüfbare Einzelfälle – und die erzählen eine andere Geschichte als der
 * Durchschnitt.
 */
export const geldsystem: LearnTopic = {
  slug: 'geldsystem',
  title: 'Das Geldsystem',
  headline: 'Woher Geld kommt – und warum Währungen sterben',
  metaTitle: 'Das Geldsystem erklärt: Geldschöpfung und Währungen',
  metaDescription:
    'Wie Geld entsteht, warum Giralgeld aus Kreditvergabe kommt, was Währungen scheitern lässt und welche Rolle Staatsanleihen, Petrodollar und Devisenmarkt spielen.',
  lead: 'Geld ist kein Ding, sondern eine Forderung. Wer das einmal verstanden hat, versteht auch, warum Schulden und Geldmenge zusammen wachsen.',
  overview: [
    'Fast jede Diskussion über Inflation, Staatsschulden oder den Dollar setzt ein Bild von Geld voraus, das nicht stimmt: dass irgendwo ein Vorrat liegt, den eine Notenbank verteilt. Tatsächlich entsteht der weitaus größte Teil des Geldes, mit dem in Deutschland bezahlt wird, in Geschäftsbanken – und zwar in dem Moment, in dem jemand einen Kredit aufnimmt.',
    'Dieses Thema beginnt deshalb bei der Frage, was Geld überhaupt ist, geht über die Geschichte der Einlöseversprechen bis zum heutigen Fiatgeld und erklärt dann, was ein Geldsystem trägt und was es zum Einsturz bringt. Die dritte Stufe behandelt die Ebene darüber: den Devisenmarkt als größten Markt der Welt, die Leitwährungen und die Geschäfte, die auf Zinsunterschieden zwischen Währungen beruhen.',
    'Wer wissen will, wie sich ein Wechselkurs auf die eigene Anlage auswirkt, ist bei „Währungen & Wechselkurse“ besser aufgehoben. Hier geht es eine Ebene tiefer.',
  ],
  keywords: [
    'geld',
    'geldsystem',
    'geldschoepfung',
    'giralgeld',
    'fiatgeld',
    'waehrung',
    'waehrungen',
    'goldstandard',
    'bretton woods',
    'hyperinflation',
    'petrodollar',
    'carry trade',
    'devisenmarkt',
    'leitwaehrung',
    'reservewaehrung',
    'zentralbankgeld',
    'schuldgeld',
  ],
  related: [
    'waehrungen-wechselkurse',
    'inflation',
    'notenbanken-geldpolitik',
    'staatsanleihe',
  ],
  calculators: ['/rechner/inflationsrechner'],
  symbols: ['eur-usd', 'gold'],

  levels: {
    /* ------------------------------------------------------------ Beginner */
    beginner: {
      metaTitle: 'Wie Geld entsteht: Geldschöpfung einfach erklärt',
      metaDescription:
        'Was Geld ist, wie aus Tauschmitteln Papiergeld wurde und warum der größte Teil des Geldes nicht von der Notenbank kommt, sondern bei der Kreditvergabe entsteht.',
      title: 'Was Geld ist und woher es kommt',
      lead: 'Drei Aufgaben, eine lange Geschichte – und ein Entstehungsweg, der die meisten überrascht.',
      readingMinutes: 9,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Ein Zwanzig-Euro-Schein ist ein bedrucktes Stück Baumwollpapier. Sein Materialwert liegt bei wenigen Cent. Trotzdem gibt jemand dafür ein Mittagessen her – nicht weil der Schein etwas wert wäre, sondern weil alle darauf vertrauen, dass der Nächste ihn ebenfalls nimmt. Geld ist eine gemeinsame Erwartung, und das ist keine Schwäche des Systems, sondern seine Bauart.',
        },

        { type: 'heading', level: 2, text: 'Die drei Aufgaben' },
        {
          type: 'paragraph',
          text: 'Was Geld ist, lässt sich nicht am Gegenstand ablesen, sondern nur daran, was es leistet. Drei Dinge muss es können, und sie geraten regelmäßig miteinander in Konflikt.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Tauschmittel.** Ohne Geld müsste der Bäcker jemanden finden, der Brot will und zufällig genau das anbietet, was der Bäcker braucht. Geld ersetzt diese doppelte Übereinstimmung durch zwei einfache Geschäfte.',
            '**Recheneinheit.** Preise werden in einer gemeinsamen Einheit ausgedrückt. Ohne sie gäbe es für hundert Waren fast fünftausend Austauschverhältnisse, die alle jemand kennen müsste.',
            '**Wertaufbewahrung.** Wer heute verkauft, kann nächstes Jahr kaufen. Diese Aufgabe erfüllt Geld am schlechtesten – bei zwei Prozent Inflation verliert es in zwanzig Jahren ein Drittel seiner Kaufkraft.',
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Warum die dritte Aufgabe absichtlich schlecht erfüllt wird',
          items: [
            'Eine Währung, die sicher an Wert gewinnt, wird gehortet statt ausgegeben. Genau das ist in Deflationsphasen zu beobachten: Wer weiß, dass alles nächstes Jahr billiger ist, wartet – und die Nachfrage bricht weg.',
            'Die Zielinflation von zwei Prozent ist deshalb kein Versehen, sondern eine Entscheidung. Sie macht Geld zu einem schlechten Wertspeicher und zu einem guten Tauschmittel.',
          ],
        },

        { type: 'heading', level: 2, text: 'Von der Münze zum Versprechen' },
        {
          type: 'paragraph',
          text: 'Die ersten Münzen entstanden um 600 v. Chr. in Lydien, im Westen der heutigen Türkei: Klumpen aus einer Gold-Silber-Legierung, gestempelt von der Obrigkeit. Der Stempel war die eigentliche Erfindung – er ersparte das Wiegen und Prüfen bei jedem Geschäft. Wer der Prägung traute, musste dem Metall nicht mehr nachrechnen.',
        },
        {
          type: 'paragraph',
          text: 'Der zweite Schritt kam viel später und war größer. Goldschmiede und frühe Banken gaben Quittungen über eingelagertes Metall aus, und irgendwann begannen die Leute, mit den Quittungen zu bezahlen statt mit dem Metall. Damit war die Banknote geboren: ein **Einlöseversprechen**. Auf britischen Pfundnoten steht der Satz bis heute – „I promise to pay the bearer on demand the sum of …“ –, obwohl seit über neunzig Jahren nichts mehr einzulösen ist.',
        },
        {
          type: 'table',
          caption: 'Vier Stufen, in denen die Deckung immer weiter zurücktritt.',
          head: ['Form', 'Wodurch gedeckt', 'Das Problem daran'],
          rows: [
            [
              'Warengeld',
              'durch sich selbst – Salz, Vieh, Metall',
              'Schwer zu transportieren, schlecht zu teilen',
            ],
            [
              'Münzgeld',
              'durch den Metallgehalt und den Stempel',
              'Die Obrigkeit kann den Gehalt heimlich senken',
            ],
            [
              'Gedeckte Banknote',
              'durch einen Anspruch auf Gold beim Aussteller',
              'Die Geldmenge hängt an der Fördermenge, nicht an der Wirtschaft',
            ],
            [
              'Fiatgeld (heute)',
              'durch gesetzliche Anordnung und Vertrauen',
              'Nichts hindert den Ausgeber außer seiner eigenen Regel',
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'Der Goldstandard bündelte diese Versprechen zwischen 1870 und 1914 zu einem Weltsystem: Jede große Währung war in Gold definiert, damit waren alle Wechselkurse fest. Nach zwei Weltkriegen wurde daraus 1944 in Bretton Woods eine Konstruktion mit einem Zwischenschritt – nur der Dollar war noch an Gold gebunden, zu 35 Dollar je Feinunze, und alle anderen Währungen an den Dollar.',
        },
        {
          type: 'paragraph',
          text: 'Am 15. August 1971 kündigte US-Präsident Nixon die Einlösbarkeit auf. Es waren schlicht mehr Dollar im Umlauf, als Gold in Fort Knox lag, und mehrere Länder hatten begonnen, ihre Bestände einzutauschen. Seit 1973 schwanken die großen Währungen frei gegeneinander. Damit ist jede heutige Währung **Fiatgeld** – von lateinisch *fiat*, „es werde“. Sie gilt, weil sie für gültig erklärt wurde.',
        },

        { type: 'heading', level: 2, text: 'Wer heute Geld herstellt' },
        {
          type: 'paragraph',
          text: 'Hier beginnt der Teil, den fast jeder falsch im Kopf hat. Es gibt nämlich zwei Sorten Geld, und die weitaus größere macht nicht die Notenbank.',
        },
        {
          type: 'keyfacts',
          items: [
            {
              label: 'Zentralbankgeld',
              value: 'Bargeld und Guthaben von Banken bei der Zentralbank',
            },
            {
              label: 'Giralgeld',
              value: 'Guthaben von Bürgern und Firmen auf Bankkonten',
            },
            {
              label: 'Wer Giralgeld schafft',
              value: 'Geschäftsbanken, bei jeder Kreditvergabe',
            },
            {
              label: 'Anteil am Bezahlten',
              value: 'Der ganz überwiegende Teil läuft über Giralgeld',
            },
          ],
        },
        {
          type: 'paragraph',
          text: 'Die verbreitete Vorstellung lautet: Sparer bringen Geld zur Bank, die Bank verleiht es weiter. So funktioniert es nicht. Wenn eine Bank einen Kredit über 200.000 Euro bewilligt, nimmt sie dieses Geld niemandem weg – sie schreibt es dem Kreditnehmer auf dem Konto gut und trägt gleichzeitig eine Forderung in gleicher Höhe in ihre Bücher ein. Beide Seiten der Bilanz werden länger. Das Guthaben, mit dem der Kreditnehmer anschließend das Haus bezahlt, gab es vorher nicht.',
        },
        { type: 'figure', figure: 'geldsystem-giralgeld' },
        {
          type: 'callout',
          variant: 'info',
          title: 'Das steht nicht in einem Randbericht',
          items: [
            'Die Bank of England hat es 2014 in ihrem Quartalsbericht ausdrücklich klargestellt: Kredite schaffen Einlagen, nicht umgekehrt – und der in Lehrbüchern verbreitete Geldschöpfungsmultiplikator beschreibe den Vorgang nicht zutreffend.',
            'Die Deutsche Bundesbank hat dasselbe im Monatsbericht April 2017 dargelegt. Beide Texte sind frei abrufbar und in klarem Deutsch beziehungsweise Englisch geschrieben.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Begrenzt wird das nicht durch vorhandene Spareinlagen, sondern durch drei andere Dinge: durch die Zahl der Kreditnehmer, die zum verlangten Zins zahlungsfähig sind; durch das Eigenkapital, das die Bank je Kredit vorhalten muss; und durch den Zins, den die Zentralbank für Zentralbankgeld verlangt. Die Mindestreserve im Euroraum – ein Prozent der Einlagen – ist dabei die kleinste dieser Bremsen.',
        },

        { type: 'heading', level: 2, text: 'Warum Geld und Schulden zusammen wachsen' },
        {
          type: 'paragraph',
          text: 'Aus dem Entstehungsweg folgt eine Eigenschaft, die das ganze System prägt: Jedem Euro Giralgeld steht ein Kredit in gleicher Höhe gegenüber. Wer seinen Kredit zurückzahlt, vernichtet dieses Geld wieder – die Gutschrift verschwindet, die Forderung ebenso. Beide Seiten der Bilanz werden kürzer.',
        },
        {
          type: 'paragraph',
          text: 'Deshalb ist die Frage „Warum werden die Schulden nicht einfach getilgt?“ schwerer zu beantworten, als sie klingt. Würden alle Kredite gleichzeitig zurückgezahlt, bliebe kaum Geld übrig, mit dem irgendjemand irgendetwas kaufen könnte. Das ist keine Verschwörung, sondern die Kehrseite eines Systems, in dem Geld als Forderung entsteht.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Was daraus nicht folgt',
          items: [
            'Nicht, dass Banken beliebig Geld schaffen können. Jeder Kredit ist ein Risiko in ihrer Bilanz, und wer ihn nicht bedient, kostet die Bank Eigenkapital.',
            'Nicht, dass das Geld „aus dem Nichts“ wertlos wäre. Ihm steht eine Verpflichtung gegenüber, die eingetrieben werden kann – die Immobilie, die Maschine, das künftige Einkommen.',
            'Nicht, dass Sparguthaben unwichtig wären. Sie sind für die einzelne Bank die günstigste Refinanzierung; nur sind sie nicht der Stoff, aus dem der Kredit gemacht wird.',
          ],
        },

        { type: 'heading', level: 2, text: 'Was du dir merken solltest' },
        {
          type: 'list',
          items: [
            'Geld ist eine Forderung, kein Gegenstand. Ein Bankguthaben ist ein Anspruch gegen die Bank – deshalb gibt es überhaupt eine Einlagensicherung.',
            'Die Geschichte des Geldes ist eine Geschichte des Zurücktretens der Deckung: erst Metall, dann ein Anspruch auf Metall, heute gar nichts außer Vertrauen und Gesetz.',
            'Der größte Teil des Geldes entsteht in Geschäftsbanken bei der Kreditvergabe, nicht in der Notenbank.',
            'Geldmenge und Verschuldung sind zwei Seiten derselben Buchung. Tilgung vernichtet Geld.',
          ],
        },
      ],
    },

    /* ----------------------------------------------------- Fortgeschritten */
    fortgeschritten: {
      metaTitle: 'Warum Währungen scheitern: Lebensdauer und Ursachen',
      metaDescription:
        'Was Währungen zusammenhalten lässt und was sie zerstört: Hyperinflation, Währungsreformen, die vielzitierten 27 Jahre und der Zusammenhang mit Staatsanleihen.',
      title: 'Warum Währungen sterben',
      lead: 'Vertrauen ist die einzige Deckung. Was passiert, wenn es weg ist – und woran man vorher erkennt, dass es bröckelt.',
      readingMinutes: 11,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Eine Fiatwährung hat keinen Rückhalt außer der Erwartung, dass man sie morgen wieder loswird. Diese Erwartung ist erstaunlich stabil – bis sie es nicht mehr ist. Dann geht es sehr schnell, und zwar nicht, weil plötzlich mehr Geld gedruckt würde, sondern weil alle gleichzeitig aufhören, es zu halten.',
        },

        { type: 'heading', level: 2, text: 'Die vielzitierten 27 Jahre' },
        {
          type: 'paragraph',
          text: 'Wer sich mit dem Thema befasst, stößt früher oder später auf einen Satz wie diesen: „Eine Untersuchung von 775 Papierwährungen hat ergeben, dass sie im Schnitt 27 Jahre halten.“ Die Zahl taucht in Vorträgen, Büchern und Beiträgen auf, oft ohne Fundstelle. Sie ist es wert, einmal nachverfolgt zu werden – weil dabei etwas Lehrreicheres herauskommt als der Durchschnitt selbst.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Woher die Zahl stammt – und warum sie hier nicht als Statistik steht',
          items: [
            'Zurückverfolgen lässt sie sich auf eine private Zusammenstellung aus dem Jahr 2009, veröffentlicht in einem Blog, nicht in einer geprüften Untersuchung. Wer die 775 Währungen sind und nach welcher Regel sie ausgewählt wurden, steht nirgends nachvollziehbar.',
            'Der Durchschnitt vermischt außerdem zwei völlig verschiedene Vorgänge. Die D-Mark ist 1999 nicht gescheitert, sie ist im Euro aufgegangen. Der Franc, die Lira und der Gulden ebenso. In einer Sterbetafel stehen sie neben dem Zimbabwe-Dollar – und ziehen den Schnitt genauso nach unten.',
            'Ein Mittelwert über Währungen sagt zudem nichts über die Währung, die man in der Hand hält. Der Schweizer Franken ist seit 1850 im Umlauf. Für ihn ist der Durchschnitt aller anderen keine Prognose.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Was sich dagegen nachprüfen lässt, sind die Einzelfälle. Die folgende Übersicht stellt Währungen, die tatsächlich zusammengebrochen sind, denen gegenüber, die seit Jahrhunderten laufen. Der Abstand zwischen beiden Gruppen ist die eigentliche Auskunft.',
        },
        { type: 'figure', figure: 'geldsystem-lebensdauer' },
        {
          type: 'paragraph',
          text: 'Auffällig ist nicht die Streuung, sondern das Muster dahinter: Die kurzlebigen Währungen gehören fast alle zu Staaten in Krieg, Bürgerkrieg oder Systemzusammenbruch. Wo der Staat funktioniert und die Notenbank nicht seine Kasse ist, halten Währungen sehr lange.',
        },

        { type: 'heading', level: 2, text: 'Wie eine Hyperinflation abläuft' },
        {
          type: 'paragraph',
          text: 'Als Hyperinflation gilt üblicherweise eine Teuerung von mehr als fünfzig Prozent im Monat – eine Grenze, die der Ökonom Phillip Cagan 1956 gezogen hat. Der Ablauf ist in allen dokumentierten Fällen ähnlich und hat wenig mit der Druckerpresse zu tun, jedenfalls nicht am Anfang.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Die Einnahmen brechen weg.** Krieg, Besetzung, Systemwechsel: Der Staat kann nicht mehr genug Steuern eintreiben, hat aber weiter Ausgaben.',
            '**Die Notenbank springt ein.** Sie finanziert die Lücke – früher mit gedruckten Scheinen, heute durch Ankauf von Staatspapieren.',
            '**Die Preise ziehen an, aber gemächlich.** Noch hält jeder sein Geld, weil er annimmt, es beruhige sich wieder.',
            '**Die Erwartung kippt.** Jetzt gibt jeder das Geld sofort aus. Dieselbe Geldmenge wechselt viel häufiger den Besitzer – und wirkt dadurch wie ein Vielfaches.',
            '**Die Währung wird umgangen.** Gerechnet wird in Dollar, Zigaretten oder Eiern. Am Ende steht eine Reform: neue Währung, alte Guthaben entwertet.',
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Der vierte Schritt ist der entscheidende',
          items: [
            'Zwischen dem dritten und dem vierten Schritt liegt kein neuer Geldschein, sondern eine Meinungsänderung. Deshalb sind Hyperinflationen so schwer vorherzusagen und so schwer zu stoppen: Man müsste eine Erwartung zurückholen.',
            'Umgekehrt endeten die meisten historischen Fälle nicht durch Einsammeln von Geld, sondern durch einen glaubwürdigen Bruch – eine neue Währung, eine unabhängige Notenbank, ein ausgeglichener Haushalt. Die Rentenmark von 1923 wirkte binnen Wochen.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Der schwerste dokumentierte Fall ist nicht Deutschland 1923, sondern Ungarn 1946: Am Höhepunkt verdoppelten sich die Preise etwa alle fünfzehn Stunden. Der Pengő wurde im August 1946 durch den Forint ersetzt, der bis heute gilt – ein Beispiel dafür, dass auf einen Zusammenbruch eine stabile Währung folgen kann, wenn der Bruch glaubwürdig ist.',
        },

        { type: 'heading', level: 2, text: 'Der Zusammenhang mit Staatsanleihen' },
        {
          type: 'paragraph',
          text: 'Eine Staatsanleihe ist das Versprechen eines Staates, in einer bestimmten Währung zu zahlen. Wenn dieser Staat dieselbe Währung kontrolliert, sind Anleihe und Währung zwei Versprechen aus derselben Hand – und wer dem einen misstraut, misstraut auch dem anderen.',
        },
        {
          type: 'table',
          caption: 'Derselbe Schuldenstand, zwei völlig verschiedene Risiken.',
          head: ['Verschuldet in', 'Kann nominal immer zahlen?', 'Wo das Risiko liegt'],
          rows: [
            [
              'eigener Währung',
              'ja – die Währung ist herstellbar',
              'in der Kaufkraft: Bedient wird mit Geld, das weniger wert ist',
            ],
            [
              'fremder Währung',
              'nein – der Staat kann sie nicht herstellen',
              'im Ausfall: Wer keine Dollar hat, zahlt keine Dollar zurück',
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'Diese Unterscheidung erklärt Fälle, die sonst widersprüchlich wirken. Japan ist mit weit über 200 Prozent der Wirtschaftsleistung verschuldet, überwiegend im eigenen Yen und im eigenen Land, und zahlt seit Jahrzehnten sehr niedrige Zinsen. Argentinien war mit einem Bruchteil davon verschuldet und ist mehrfach ausgefallen – seine Schulden lauteten auf Dollar. Nicht die Höhe entscheidet, sondern die Währung und wer die Papiere hält.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Warum „einfach drucken“ keine Lösung ist',
          items: [
            'Ein Staat, der seine Anleihen mit frisch geschaffenem Geld bedient, zahlt formal zurück und enteignet dabei seine Gläubiger über die Kaufkraft. Das merken die Gläubiger beim nächsten Mal.',
            'Sie verlangen dann einen höheren Zins oder kaufen gar nicht mehr. Der Anleihemarkt ist damit die härteste Grenze, die ein Staat kennt – härter als jede Schuldenbremse, weil sie täglich neu gezogen wird.',
            'Im Euroraum kommt eine rechtliche Grenze hinzu: Die EZB darf Staatsanleihen nicht direkt bei der Ausgabe kaufen. Am Markt darf sie es, und genau an dieser Linie verläuft die Auseinandersetzung über die Anleihekaufprogramme.',
          ],
        },

        { type: 'heading', level: 2, text: 'Woran man Vertrauensverlust früh sieht' },
        {
          type: 'list',
          items: [
            '**Der Wechselkurs fällt schneller als die Inflationsdifferenz.** Dann ist es keine Anpassung mehr, sondern Abfluss.',
            '**Die Rendite langlaufender Staatsanleihen steigt, während die Notenbank die Zinsen senkt.** Der Markt preist Risiko ein, nicht Zinserwartung.',
            '**Im Inland wird in einer fremden Währung gerechnet.** Preise in Dollar sind das deutlichste Zeichen, weil es die eigene Recheneinheit aufgibt.',
            '**Die Notenbank verliert ihre Unabhängigkeit.** Personalwechsel und neue Zielvorgaben stehen am Anfang, nicht am Ende der Kette.',
          ],
        },

        { type: 'heading', level: 2, text: 'Was du dir merken solltest' },
        {
          type: 'list',
          items: [
            'Die Zahl 27 hält keiner Prüfung stand: Sie stammt aus einer nicht nachvollziehbaren Sammlung und wirft Währungsunionen mit Zusammenbrüchen in einen Topf.',
            'Währungen sterben an Vertrauen, nicht an Geldmengen. Die Geldmenge ist meist die Folge, nicht die Ursache.',
            'Ob Schulden gefährlich sind, hängt an der Währung, auf die sie lauten – nicht an ihrer Höhe.',
            'Der Anleihemarkt ist die tägliche Abstimmung über beides: über den Staat und über seine Währung.',
          ],
        },
      ],
    },

    /* --------------------------------------------------------------- Profi */
    profi: {
      metaTitle: 'Devisenmarkt, Leitwährungen und Carry Trade',
      metaDescription:
        'Der größte Markt der Welt, der Dollar als Reservewährung, was der Petrodollar wirklich ist und wie Zinsdifferenzgeschäfte zwischen Währungen funktionieren.',
      title: 'Leitwährungen, Petrodollar und Carry Trade',
      lead: 'Wie das Weltwährungssystem tatsächlich gebaut ist – und wo die Bruchstellen liegen, die alle paar Jahre sichtbar werden.',
      readingMinutes: 12,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Über den Währungen der einzelnen Staaten liegt eine zweite Ebene: ein Markt, auf dem sie gegeneinander getauscht werden, und eine Rangordnung, in der eine von ihnen die Rolle des gemeinsamen Bezugspunkts übernimmt. Beides ist nicht geplant worden, beides ist gewachsen – und beides ist veränderlich.',
        },

        { type: 'heading', level: 2, text: 'Der größte Markt der Welt' },
        {
          type: 'paragraph',
          text: 'Die Bank für Internationalen Zahlungsausgleich erhebt alle drei Jahre, wie viel auf dem Devisenmarkt umgesetzt wird. Für April 2022 kam sie auf **7,5 Billionen US-Dollar pro Handelstag**. Zum Vergleich: Der gesamte Welthandel mit Waren und Dienstleistungen lag im selben Jahr bei rund 32 Billionen Dollar – im ganzen Jahr.',
        },
        { type: 'figure', figure: 'geldsystem-devisenmarkt' },
        {
          type: 'paragraph',
          text: 'In gut vier Handelstagen wird also so viel Währung getauscht wie der gesamte Welthandel eines Jahres bewegt. Das wirft die Frage auf, wofür der Rest da ist – denn Import und Export erklären offensichtlich nur einen kleinen Bruchteil.',
        },
        {
          type: 'list',
          items: [
            '**Absicherung.** Wer in fremder Währung einkauft, produziert oder anlegt, sichert den Kurs ab. Jede Absicherung ist ein weiteres Geschäft.',
            '**Devisenswaps.** Der mit Abstand größte Einzelposten. Zwei Parteien tauschen Währungen und vereinbaren den Rücktausch gleich mit – im Kern eine besicherte Geldaufnahme in fremder Währung, keine Wette auf den Kurs.',
            '**Handel zwischen Händlern.** Eine Kundenorder wird zwischen Banken weitergereicht, bis sie jemanden findet, der die Gegenposition halten will. Jede Weitergabe zählt als Umsatz.',
            '**Spekulation.** Der Teil, den die Öffentlichkeit für den ganzen Markt hält, ist der kleinste der vier.',
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Ein Markt ohne Börse',
          items: [
            'Es gibt kein zentrales Handelsgebäude und keine amtliche Schlussnotiz. Gehandelt wird zwischen Banken, rund um die Uhr von Montagmorgen in Sydney bis Freitagabend in New York.',
            'Deshalb ist der Devisenmarkt auch der am wenigsten regulierte große Markt. Die Referenzkurse, die in Verträgen stehen, werden von Notenbanken erhoben – im Euroraum von der EZB, täglich am frühen Nachmittag.',
          ],
        },

        { type: 'heading', level: 2, text: 'Die Rangordnung der Währungen' },
        {
          type: 'paragraph',
          text: 'Notenbanken halten Reserven, um im Notfall den eigenen Kurs stützen oder Importe bezahlen zu können. Welche Währungen sie dafür wählen, veröffentlicht der Internationale Währungsfonds vierteljährlich. Die Verteilung ist seit Jahrzehnten erstaunlich stabil.',
        },
        {
          type: 'table',
          caption:
            'Anteile an den zugeordneten Währungsreserven, gerundet (IWF, Stand Ende 2024).',
          head: ['Währung', 'Anteil', 'Wodurch getragen'],
          rows: [
            [
              'US-Dollar',
              'rund 58 %',
              'Tiefster Anleihemarkt der Welt, Rechnungswährung im Rohstoffhandel',
            ],
            [
              'Euro',
              'rund 20 %',
              'Zweitgrößter Wirtschaftsraum, aber kein gemeinsamer Anleihemarkt',
            ],
            [
              'Japanischer Yen',
              'rund 6 %',
              'Jahrzehnte niedriger Zinsen, hohe Auslandsvermögen',
            ],
            ['Britisches Pfund', 'rund 5 %', 'Alte Reservewährung, Finanzplatz London'],
            [
              'Chinesischer Renminbi',
              'rund 2 %',
              'Große Wirtschaft, aber Kapitalverkehrskontrollen',
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'Die letzte Zeile erklärt, warum die Ablösung des Dollars regelmäßig angekündigt und regelmäßig nicht eintritt. Eine Reservewährung braucht nicht nur eine große Wirtschaft, sondern einen Anleihemarkt, in den man jederzeit hinein- und wieder herauskommt – und dafür muss ein Land fremdes Kapital frei ein- und ausreisen lassen. China hat sich bislang dagegen entschieden.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Das Triffin-Dilemma',
          items: [
            'Robert Triffin beschrieb 1960 den Widerspruch, in dem jede Leitwährung steckt: Die Welt braucht laufend mehr davon, und bekommen kann sie sie nur, wenn das ausgebende Land dauerhaft mehr einführt als ausführt.',
            'Genau diese Defizite untergraben aber langfristig das Vertrauen in die Währung. Triffin sagte damit das Ende von Bretton Woods elf Jahre vorher voraus.',
            'Der Widerspruch ist nicht aufgelöst, sondern nur verschoben: Seit 1971 wird das Vertrauen nicht mehr an Goldbeständen gemessen, sondern an der Zahlungsfähigkeit und der Rechtsordnung des Ausgebers.',
          ],
        },

        { type: 'heading', level: 2, text: 'Was der Petrodollar ist – und was nicht' },
        {
          type: 'paragraph',
          text: 'Nach dem Ende der Goldbindung suchte der Dollar eine neue Verankerung, und er fand sie im Öl. 1974 vereinbarten die Vereinigten Staaten und Saudi-Arabien eine wirtschaftliche Zusammenarbeit: Waffen und Technik gegen Öl, und die Erlöse flossen zu einem erheblichen Teil in amerikanische Staatsanleihen zurück. Da Öl ohnehin in Dollar notierte, brauchte jeder Importeur weltweit Dollar – eine Nachfrage, die nichts mit der amerikanischen Wirtschaft zu tun hat.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Zwei verbreitete Behauptungen, die nicht stimmen',
          items: [
            'Es gab **keinen Vertrag, der die Preisstellung in Dollar vorschreibt**. Die Notierung in Dollar ist Marktbrauch, kein Rechtsgebot – deshalb kann sie sich auch ohne Vertragsbruch ändern, und in Teilen tut sie das bereits.',
            'Es gab folglich auch **kein Abkommen, das im Juni 2024 ausgelaufen wäre**. Diese Meldung ging um die Welt und ließ sich auf kein Dokument zurückführen. Was 1974 geschlossen wurde, war eine Vereinbarung über Zusammenarbeit, nicht über Ölpreise, und sie hatte kein Ablaufdatum dieser Art.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Der eigentliche Effekt des Petrodollar-Kreislaufs ist auch nicht die Preisstellung, sondern die Wiederanlage. Wer Öl verkauft und den Erlös nicht sofort ausgibt, muss ihn parken – und der einzige Markt, der Beträge dieser Größenordnung aufnimmt, ohne die Kurse zu verwerfen, ist der für US-Staatsanleihen. Dieser Kreislauf drückt die amerikanischen Zinsen und ist der Grund, warum ein Ölexporteur zum großen Gläubiger der Vereinigten Staaten wird.',
        },

        { type: 'heading', level: 2, text: 'Der Carry Trade' },
        {
          type: 'paragraph',
          text: 'Wenn Zinsen zwischen Währungsräumen weit auseinanderliegen, entsteht ein naheliegendes Geschäft: dort aufnehmen, wo es fast nichts kostet, und dort anlegen, wo es etwas bringt. Der Ertrag ist die Zinsdifferenz, das Risiko ist der Wechselkurs.',
        },
        {
          type: 'formula',
          expression:
            'Ertrag = Zins Anlagewährung − Zins Finanzierungswährung ± Kursänderung',
          description:
            'Die ersten beiden Größen stehen bei Abschluss fest, die dritte nicht. Genau darin liegt das Geschäft – und das Problem.',
        },
        {
          type: 'paragraph',
          text: 'Die Lehre sagt, dass das nicht funktionieren dürfte: Nach der ungedeckten Zinsparität müsste die Hochzinswährung genau so viel an Wert verlieren, wie sie an Zins mehr bringt. In der Beobachtung tut sie das über lange Strecken nicht – und dann tut sie es auf einmal. Carry-Positionen verdienen viele Monate lang wenig und verlieren an wenigen Tagen viel.',
        },
        {
          type: 'paragraph',
          text: 'Das Lehrbuchbeispiel ist der **Yen**. Japan hielt seinen Leitzins jahrzehntelang bei null oder darunter, während anderswo drei bis fünf Prozent zu holen waren. Als die Bank of Japan Ende Juli 2024 auf 0,25 Prozent erhöhte, stieg der Yen binnen Tagen kräftig – und die Auflösung der Positionen traf Märkte, die mit Japan nichts zu tun hatten. Am 5. August 2024 verlor der Nikkei 12,4 Prozent, der stärkste Tagesverlust seit 1987.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Und der Renminbi?',
          items: [
            'Seit die chinesischen Zinsen unter die amerikanischen gefallen sind, wird auch der Renminbi als Finanzierungswährung genutzt. Die Mechanik ist dieselbe, die Risikolage nicht.',
            'Der Kurs wird täglich innerhalb eines Bandes um einen amtlichen Mittelkurs geführt, und der Kapitalverkehr ist beschränkt. Eine plötzliche Auflösung wie beim Yen ist dadurch weniger wahrscheinlich – dafür liegt das Risiko in einer politischen Entscheidung statt in einer Marktbewegung.',
            'Wer beides gleichsetzt, unterschätzt den Unterschied zwischen einem Kurs, den ein Markt macht, und einem, den eine Behörde festlegt.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Für Privatanleger ist der Carry Trade selten ein eigenes Geschäft, aber er ist ein guter Erklärer für sonst rätselhafte Tage: Wenn Aktienmärkte ohne erkennbare Nachricht gleichzeitig einbrechen und ausgerechnet eine Niedrigzinswährung dabei steigt, wird meist eine solche Position aufgelöst.',
        },

        { type: 'heading', level: 2, text: 'Welche Währungen sonst noch zählen' },
        {
          type: 'list',
          items: [
            '**Schweizer Franken.** Der klassische Zufluchtsort. Wie stark das wirkt, zeigte der 15. Januar 2015: Die Nationalbank gab ihre Kursuntergrenze von 1,20 Franken je Euro auf, und der Franken stieg binnen Minuten um rund ein Fünftel.',
            '**Währungen mit fester Bindung.** Der Hongkong-Dollar ist seit 1983 an den US-Dollar gebunden, mehrere Golfstaaten ebenso. Diese Länder importieren damit die amerikanische Geldpolitik, ob sie zu ihrer Lage passt oder nicht.',
            '**Sonderziehungsrechte.** Keine Währung, sondern eine Recheneinheit des Währungsfonds aus fünf Währungen – Dollar, Euro, Renminbi, Yen, Pfund. Sie taucht in Verträgen und Statistiken auf, nicht im Zahlungsverkehr.',
            '**Rohstoffwährungen.** Kanadischer und australischer Dollar, norwegische Krone: Ihre Kurse hängen erkennbar an Öl-, Gas- und Metallpreisen, was sie zu einem indirekten Rohstoffengagement macht.',
          ],
        },

        { type: 'heading', level: 2, text: 'Was du dir merken solltest' },
        {
          type: 'list',
          items: [
            'Der Devisenmarkt ist der größte Markt der Welt, aber der kleinste Teil davon ist Spekulation – der größte sind Swaps und Absicherung.',
            'Eine Leitwährung braucht keinen Beschluss, sondern einen tiefen Anleihemarkt und freien Kapitalverkehr. Daran scheitert die Ablösung des Dollars bisher.',
            'Der Petrodollar wirkt über die Wiederanlage der Erlöse, nicht über eine vertragliche Preisvorschrift – die es nie gab.',
            'Carry Trades erklären Tage, an denen alles gleichzeitig fällt, ohne dass etwas passiert wäre.',
          ],
        },
      ],
    },
  },
}
