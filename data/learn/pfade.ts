import type { LearnLevelId } from '@/data/learn/types'

/**
 * Geführte Lernpfade – Wege durch den Bestand statt einer Liste.
 *
 * ## Warum es die neben den Themen gibt
 *
 * Die Themenübersicht ist nach Sachlogik geordnet: erst Grundlagen, dann
 * Anlageklassen, dann das Depot. Das ist die richtige Reihenfolge für jemanden,
 * der alles lesen will – und die falsche für jemanden mit einer konkreten
 * Frage. Wer 30.000 Euro geerbt hat, braucht nicht die Reihenfolge von vorn,
 * sondern sechs bestimmte Stufen aus vier verschiedenen Abschnitten.
 *
 * Ein Pfad ist deshalb kein neuer Inhalt, sondern eine Auswahl mit Begründung:
 * Er zeigt auf vorhandene Stufen und sagt bei jedem Schritt, **warum jetzt
 * dieser**. Diese Begründung ist der eigentliche Unterschied zu einer Liste von
 * Links.
 *
 * ## Warum Stufen und nicht Themen
 *
 * Weil ein Thema drei Stufen hat und selten alle drei gebraucht werden. Wer
 * einen Sparplan einrichten will, braucht ETF auf Beginner-Niveau und Kosten
 * auf Fortgeschritten – nicht neun Seiten. Ein Pfad, der auf Themen zeigt,
 * wäre wieder eine Liste.
 *
 * ## Warum Rechner mitten im Weg stehen
 *
 * Weil an bestimmten Stellen Rechnen mehr bringt als Weiterlesen. Nach dem
 * Zinseszins gehört der Zinsrechner hin, nach den Kosten der Kostenrechner:
 * eine Zahl, die man selbst eingegeben hat, bleibt anders hängen als eine, die
 * im Text steht.
 *
 * ## Fortschritt
 *
 * Pfade führen keinen eigenen Fortschritt. Sie lesen denselben, den der
 * Lernbereich schreibt – wer eine Stufe dort abhakt, sieht sie im Pfad als
 * erledigt und umgekehrt. Ein zweiter Speicher wäre eine zweite Wahrheit.
 */

/** Ein Schritt auf einem Pfad: eine Lernstufe oder ein Rechner. */
export type Pfadschritt =
  | {
      art: 'stufe'
      /** Slug des Lernthemas. */
      thema: string
      stufe: LearnLevelId
      /** Warum genau dieser Schritt an dieser Stelle steht. */
      warum: string
    }
  | {
      art: 'rechner'
      /** Slug des Rechners, ohne `/rechner/`. */
      rechner: string
      warum: string
    }

export interface Lernpfad {
  slug: string
  /** Kurzname für Kacheln und Navigation. */
  titel: string
  /** <h1> der Pfadseite. */
  headline: string
  metaTitle: string
  metaDescription: string
  /** Ein Satz auf der Übersichtskachel. */
  kurz: string
  /** Einleitung auf der Pfadseite. */
  lead: string
  /** An wen sich der Pfad richtet – steht als eigene Zeile über den Schritten. */
  fuerWen: string
  /** Was am Ende anders ist. Kein Versprechen auf Rendite, sondern auf Wissen. */
  ergebnis: string
  schritte: Pfadschritt[]
}

export const lernpfade: Lernpfad[] = [
  {
    slug: 'erste-schritte',
    titel: 'Von null anfangen',
    headline: 'Von null anfangen: der Weg bis zum ersten Sparplan',
    metaTitle: 'Lernpfad: von null bis zum ersten Sparplan',
    metaDescription:
      'Zehn Schritte vom Haushaltsüberblick bis zum eingerichteten ETF-Sparplan – in der Reihenfolge, in der sie aufeinander aufbauen.',
    kurz: 'Zehn Schritte vom Kontoauszug bis zum eingerichteten Sparplan.',
    lead: 'Der Weg, den fast alle gehen – nur meistens in der falschen Reihenfolge. Hier steht er so, dass jeder Schritt den nächsten trägt: erst wissen, was übrig bleibt, dann den Notgroschen, und erst danach die Frage, worin angelegt wird.',
    fuerWen:
      'Für alle, die noch nichts angelegt haben und wissen wollen, womit man anfängt.',
    ergebnis:
      'Du weißt, welcher Betrag monatlich übrig ist, wie groß dein Notgroschen sein muss, was ein ETF ist und woran du einen teuren von einem günstigen unterscheidest.',
    schritte: [
      {
        art: 'stufe',
        thema: 'worauf-achten-einsteiger',
        stufe: 'beginner',
        warum: 'Die Fehler, die am Anfang am meisten kosten – bevor sie passieren.',
      },
      {
        art: 'stufe',
        thema: 'budget-und-sparquote',
        stufe: 'beginner',
        warum:
          'Ohne diese Zahl ist alles Weitere Theorie: Wie viel bleibt am Monatsende tatsächlich übrig?',
      },
      {
        art: 'rechner',
        rechner: 'haushaltsrechner',
        warum:
          'Einnahmen und Ausgaben einmal gegenüberstellen. Die Sparquote, die dabei herauskommt, ist die Zahl, mit der du weiterrechnest.',
      },
      {
        art: 'stufe',
        thema: 'tagesgeld',
        stufe: 'beginner',
        warum:
          'Der Notgroschen kommt vor jeder Anlage. Wer ihn nicht hat, verkauft im falschen Moment.',
      },
      {
        art: 'stufe',
        thema: 'zinseszins',
        stufe: 'beginner',
        warum:
          'Der einzige Grund, warum früh anfangen mehr bringt als viel anlegen. Ab hier wird klar, worum es überhaupt geht.',
      },
      {
        art: 'rechner',
        rechner: 'zinsrechner',
        warum:
          'Setz deine eigene Sparrate ein und lass sie 30 Jahre laufen. Die Zahl, die dabei entsteht, überzeugt nachhaltiger als jeder Text.',
      },
      {
        art: 'stufe',
        thema: 'inflation',
        stufe: 'beginner',
        warum:
          'Die Gegenrechnung: Was der Zinseszins aufbaut, nimmt die Inflation zum Teil wieder weg. Beides gehört zusammen.',
      },
      {
        art: 'stufe',
        thema: 'risiko-und-rendite',
        stufe: 'beginner',
        warum:
          'Bevor du etwas auswählst: Rendite gibt es nicht ohne Schwankung. Wer das vorher weiß, hält sie später aus.',
      },
      {
        art: 'stufe',
        thema: 'etf',
        stufe: 'beginner',
        warum:
          'Das Produkt, mit dem die meisten anfangen – und warum ein Index kaufen etwas anderes ist als Aktien aussuchen.',
      },
      {
        art: 'stufe',
        thema: 'depot-und-broker',
        stufe: 'beginner',
        warum:
          'Wo das Depot eröffnet wird und woran du eine Bank erkennst, bei der du nicht draufzahlst.',
      },
      {
        art: 'stufe',
        thema: 'cost-average-sparplan',
        stufe: 'beginner',
        warum:
          'Warum monatlich gleich viel einzahlen die Entscheidung „ist jetzt der richtige Zeitpunkt“ überflüssig macht.',
      },
      {
        art: 'stufe',
        thema: 'kosten-und-gebuehren',
        stufe: 'beginner',
        warum:
          'Der letzte Schritt vor dem Einrichten: Die Gebühr ist das Einzige an der ganzen Rechnung, das du sicher beeinflussen kannst.',
      },
      {
        art: 'rechner',
        rechner: 'kostenrechner',
        warum:
          'Stell 0,2 gegen 1,5 Prozent und sieh, was der Unterschied über deine Anlagedauer ausmacht. Danach vergleichst du Produkte anders.',
      },
    ],
  },
  {
    slug: 'groesserer-betrag',
    titel: 'Ein größerer Betrag',
    headline: 'Ein größerer Betrag: Erbschaft, Abfindung, Bonus',
    metaTitle: 'Lernpfad: einen größeren Betrag anlegen',
    metaDescription:
      'Wie man eine einmalige Summe aufteilt: Reihenfolge von Schulden, Notgroschen und Anlage, Streuung, alles auf einmal oder gestückelt, und die Steuer.',
    kurz: 'Eine einmalige Summe aufteilen, ohne sie in einem Aufwasch zu verplanen.',
    lead: 'Ein größerer Betrag stellt andere Fragen als eine monatliche Sparrate. Nicht „womit anfangen“, sondern „in welcher Reihenfolge“ – und die häufigste teure Entscheidung fällt in den ersten zwei Wochen.',
    fuerWen:
      'Für alle, denen einmalig eine größere Summe zufließt – aus einer Erbschaft, einer Abfindung, einem Bonus oder einem Verkauf.',
    ergebnis:
      'Du kennst die Reihenfolge, in der ein Betrag verplant wird, weißt, worüber du streust, und kannst die Frage „alles auf einmal oder in Raten“ selbst beantworten statt sie zu vertagen.',
    schritte: [
      {
        art: 'stufe',
        thema: 'schulden-und-kredit',
        stufe: 'beginner',
        warum:
          'Der erste Schritt ist keine Anlage: Ein Kredit zu sechs Prozent zu tilgen ist eine sichere Rendite von sechs Prozent.',
      },
      {
        art: 'stufe',
        thema: 'tagesgeld',
        stufe: 'fortgeschritten',
        warum:
          'Was in den nächsten drei Jahren gebraucht wird, gehört nicht an den Aktienmarkt. Hier steht, wohin stattdessen.',
      },
      {
        art: 'stufe',
        thema: 'einlagensicherung',
        stufe: 'beginner',
        warum:
          'Bei größeren Beträgen zählt eine Zahl, die sonst niemanden betrifft: 100.000 Euro je Bank und Person.',
      },
      {
        art: 'stufe',
        thema: 'risiko-und-rendite',
        stufe: 'fortgeschritten',
        warum:
          'Wie viel Schwankung du tragen kannst, ist bei einer großen Summe keine theoretische Frage mehr – zehn Prozent von 100.000 Euro sind sichtbar.',
      },
      {
        art: 'stufe',
        thema: 'aktien-laender-branchen',
        stufe: 'beginner',
        warum:
          'Streuung ist der einzige Vorteil, den es umsonst gibt. Worüber gestreut wird, entscheidet sich hier.',
      },
      {
        art: 'stufe',
        thema: 'portfolio-aufbau',
        stufe: 'fortgeschritten',
        warum:
          'Die Aufteilung zwischen Aktien und Sicherem bestimmt den Großteil des Ergebnisses – mehr als die Auswahl einzelner Produkte.',
      },
      {
        art: 'stufe',
        thema: 'cost-average-sparplan',
        stufe: 'fortgeschritten',
        warum:
          'Alles auf einmal oder über zwölf Monate verteilt? Hier steht, was die Zahlen sagen und was der Kopf sagt – und warum beides auseinandergeht.',
      },
      {
        art: 'stufe',
        thema: 'kosten-und-gebuehren',
        stufe: 'fortgeschritten',
        warum:
          'Bei einer großen Summe kostet ein Prozentpunkt Gebühr keinen Kaffee, sondern ein Auto.',
      },
      {
        art: 'rechner',
        rechner: 'kostenrechner',
        warum:
          'Setz deinen Betrag ein. Der Unterschied wird in Euro deutlicher als in Prozent.',
      },
      {
        art: 'stufe',
        thema: 'sparerpauschbetrag',
        stufe: 'fortgeschritten',
        warum:
          'Ab einer gewissen Summe ist der Freibetrag im ersten Jahr aufgebraucht. Danach zählt, wie besteuert wird.',
      },
      {
        art: 'rechner',
        rechner: 'steuerrechner',
        warum:
          'Was nach Teilfreistellung, Freibetrag und Zuschlägen übrig bleibt – und wie die Vorabpauschale entsteht.',
      },
      {
        art: 'rechner',
        rechner: 'vermoegensuebersicht',
        warum:
          'Zum Schluss der Bogen: Wo der Betrag am Ende gelandet ist, gehört einmal vollständig aufgeschrieben.',
      },
    ],
  },
  {
    slug: 'altersvorsorge',
    titel: 'Vorsorge prüfen',
    headline: 'Altersvorsorge prüfen: was fehlt und was es kostet',
    metaTitle: 'Lernpfad: Altersvorsorge prüfen und Lücke schließen',
    metaDescription:
      'Von der Renteninformation zur Lücke: wie die gesetzliche Rente entsteht, was die Inflation davon lässt und welche Sparrate den Rest deckt.',
    kurz: 'Von der Renteninformation zur Lücke – und zur Sparrate, die sie schließt.',
    lead: 'Die Renteninformation nennt einen Betrag, der größer aussieht, als er ist: Er steht in heutigen Euro und vor Abzügen. Dieser Pfad rechnet ihn in etwas um, mit dem sich planen lässt.',
    fuerWen:
      'Für alle zwischen 30 und 55, die ihre Renteninformation schon einmal weggelegt haben, ohne etwas damit anzufangen.',
    ergebnis:
      'Du kennst deine monatliche Lücke in heutiger Kaufkraft, weißt, welche Sparrate sie schließt, und kannst einordnen, was eine Zusatzvorsorge nach Kosten und Steuern wirklich bringt.',
    schritte: [
      {
        art: 'stufe',
        thema: 'rente',
        stufe: 'beginner',
        warum:
          'Wie aus Beitragsjahren Rentenpunkte werden – und warum die Zahl auf der Renteninformation nicht das ist, was ankommt.',
      },
      {
        art: 'rechner',
        rechner: 'rentenrechner',
        warum:
          'Deine Punkte einsetzen und sehen, was nach Kranken- und Pflegeversicherung sowie Steuern übrig bleibt.',
      },
      {
        art: 'stufe',
        thema: 'inflation',
        stufe: 'fortgeschritten',
        warum:
          'Bis zur Rente sind es 25 Jahre. Bei zwei Prozent Teuerung ist der Betrag dann rund 40 Prozent weniger wert – das ist der Schritt, den die meisten überspringen.',
      },
      {
        art: 'rechner',
        rechner: 'rentenluecke',
        warum:
          'Bedarf gegen Erwartung, alles in heutiger Kaufkraft. Ergebnis ist die monatliche Sparrate, um die es geht.',
      },
      {
        art: 'stufe',
        thema: 'zinseszins',
        stufe: 'fortgeschritten',
        warum:
          'Warum dieselbe Sparrate zehn Jahre früher begonnen ungefähr das Doppelte ergibt.',
      },
      {
        art: 'stufe',
        thema: 'etf',
        stufe: 'fortgeschritten',
        warum:
          'Das übliche Werkzeug für den Aufbau – mit den Unterschieden, auf die es bei langen Laufzeiten ankommt.',
      },
      {
        art: 'stufe',
        thema: 'kosten-und-gebuehren',
        stufe: 'profi',
        warum:
          'Über 30 Jahre entscheidet die Kostenquote über einen erheblichen Teil des Ergebnisses. Bei Vorsorgeprodukten steht sie selten vorne.',
      },
      {
        art: 'stufe',
        thema: 'sparerpauschbetrag',
        stufe: 'profi',
        warum:
          'Teilfreistellung, Vorabpauschale und was beim Entsparen anfällt – bei Vorsorge ist die Steuer kein Nebenschauplatz.',
      },
      {
        art: 'stufe',
        thema: 'portfolio-aufbau',
        stufe: 'profi',
        warum:
          'Wie sich die Aufteilung ändert, je näher der Ruhestand rückt – und warum „alles in Aktien“ mit 62 etwas anderes ist als mit 32.',
      },
      {
        art: 'stufe',
        thema: 'immobilien',
        stufe: 'fortgeschritten',
        warum:
          'Die abbezahlte Wohnung ist für viele der größte Vorsorgebaustein. Was sie leistet und was sie nicht leistet.',
      },
    ],
  },
  {
    slug: 'wenn-es-faellt',
    titel: 'Wenn es fällt',
    headline: 'Wenn es fällt: was in einem Crash zu tun ist',
    metaTitle: 'Lernpfad: ruhig bleiben, wenn die Kurse fallen',
    metaDescription:
      'Was in einem Crash passiert, wie lange Erholungen historisch gedauert haben und warum die teuersten Fehler in genau diesen Wochen gemacht werden.',
    kurz: 'Was in einem Crash passiert – gelesen, bevor einer kommt.',
    lead: 'Dieser Pfad ist der einzige, den man vorher lesen sollte. Mitten im Fall liest niemand mehr nach; da wird gehandelt. Was dann getan wird, entscheidet sich daran, was vorher verstanden wurde.',
    fuerWen:
      'Für alle, die investiert sind und noch keinen richtigen Einbruch erlebt haben – und für alle, die den letzten schlecht überstanden haben.',
    ergebnis:
      'Du weißt, wie oft und wie tief Märkte historisch gefallen sind, wie lange sie zurückbrauchten, und warum ein Verkauf im Tief aus zwei Fehlern besteht statt aus einem.',
    schritte: [
      {
        art: 'stufe',
        thema: 'groesste-crashes',
        stufe: 'beginner',
        warum:
          'Die Zahlen zuerst: wie tief es ging, wie lange es dauerte, und dass es jedes Mal weiterging.',
      },
      {
        art: 'stufe',
        thema: 'anlegerpsychologie',
        stufe: 'beginner',
        warum:
          'Warum der Verlust doppelt so weh tut, wie der gleiche Gewinn freut – und was das mit dem Verkaufsknopf macht.',
      },
      {
        art: 'stufe',
        thema: 'risiko-und-rendite',
        stufe: 'fortgeschritten',
        warum:
          'Schwankung ist der Preis, nicht der Fehler. Wer den Preis nicht zahlen will, bekommt die Rendite nicht.',
      },
      {
        art: 'stufe',
        thema: 'wann-kaufen-verkaufen',
        stufe: 'fortgeschritten',
        warum:
          'Warum aussteigen und später wieder einsteigen zwei richtige Entscheidungen erfordert – und was das Verpassen der besten Tage kostet.',
      },
      {
        art: 'stufe',
        thema: 'anlegerpsychologie',
        stufe: 'fortgeschritten',
        warum:
          'Die Muster im Einzelnen: Verlustaversion, Bestätigungsfehler, der Hang, Gewinner zu früh zu verkaufen und Verlierer zu behalten.',
      },
      {
        art: 'stufe',
        thema: 'portfolio-aufbau',
        stufe: 'fortgeschritten',
        warum:
          'Die Aufteilung, die man in einem Crash aushält, ist die richtige – auch wenn eine andere auf dem Papier mehr brächte.',
      },
      {
        art: 'stufe',
        thema: 'cost-average-sparplan',
        stufe: 'beginner',
        warum:
          'Ein laufender Sparplan kauft im Fall automatisch mehr Anteile. Das ist der Grund, ihn gerade dann nicht zu stoppen.',
      },
      {
        art: 'stufe',
        thema: 'groesste-crashes',
        stufe: 'profi',
        warum:
          'Zum Abschluss die Einzelfälle: was 1929, 2000, 2008 und 2020 jeweils ausgelöst hat und worin sie sich unterscheiden.',
      },
    ],
  },
  {
    slug: 'steuern-verstehen',
    titel: 'Steuern verstehen',
    headline: 'Steuern auf Kapitalerträge: von der Abrechnung zur Erklärung',
    metaTitle: 'Lernpfad: Steuern auf Kapitalerträge verstehen',
    metaDescription:
      'Abgeltungsteuer, Freistellungsauftrag, Teilfreistellung und Vorabpauschale – warum die Bank im Januar abbucht und was in die Steuererklärung gehört.',
    kurz: 'Warum die Bank im Januar abbucht, obwohl nichts verkauft wurde.',
    lead: 'Die meisten treffen dieses Thema zum ersten Mal, wenn im Januar unangekündigt Geld vom Verrechnungskonto verschwindet. Dieser Pfad erklärt, was da passiert – und was man vorher hätte einstellen können.',
    fuerWen:
      'Für alle mit einem Depot, die schon einmal eine Abrechnung bekommen haben, die sie nicht nachvollziehen konnten.',
    ergebnis:
      'Du kannst eine Erträgnisaufstellung lesen, weißt, was ein Freistellungsauftrag bewirkt, und kennst den Unterschied zwischen Teilfreistellung, Freibetrag und Vorabpauschale.',
    schritte: [
      {
        art: 'stufe',
        thema: 'sparerpauschbetrag',
        stufe: 'beginner',
        warum:
          'Die 1.000 Euro, die steuerfrei bleiben – und warum sie nur wirken, wenn der Auftrag bei der Bank liegt.',
      },
      {
        art: 'stufe',
        thema: 'fonds',
        stufe: 'fortgeschritten',
        warum:
          'Warum Fonds anders besteuert werden als Einzelaktien: Der Fonds zahlt bereits auf seiner Ebene, und das wird ausgeglichen.',
      },
      {
        art: 'stufe',
        thema: 'sparerpauschbetrag',
        stufe: 'fortgeschritten',
        warum:
          'Teilfreistellung nach Fondsart, Reihenfolge der Abzüge und die Frage, wo der Freibetrag am meisten bringt.',
      },
      {
        art: 'rechner',
        rechner: 'steuerrechner',
        warum:
          'Die Rechnung selbst nachvollziehen – erst Teilfreistellung, dann Freibetrag, dann die Steuer mit ihren Zuschlägen.',
      },
      {
        art: 'stufe',
        thema: 'etf',
        stufe: 'profi',
        warum:
          'Thesaurierend oder ausschüttend: steuerlich seit 2018 fast gleichgestellt – „fast“ ist hier das entscheidende Wort.',
      },
      {
        art: 'stufe',
        thema: 'sparerpauschbetrag',
        stufe: 'profi',
        warum:
          'Verlustverrechnungstöpfe, Günstigerprüfung, ausländische Quellensteuer und der Depotwechsel mit seinen Anschaffungsdaten.',
      },
      {
        art: 'stufe',
        thema: 'depot-und-broker',
        stufe: 'profi',
        warum:
          'Warum ein deutscher Broker die Steuer abführt und ein ausländischer nicht – und was das für die Steuererklärung bedeutet.',
      },
    ],
  },
]
