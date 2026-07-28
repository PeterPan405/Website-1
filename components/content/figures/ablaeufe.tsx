import { AblaufKette, FARBEN } from '@/components/content/figures/Diagramme'

/**
 * Die Grafiken, die einen Weg zeigen statt einer Menge.
 *
 * ## Warum diese vier zusammen in einer Datei stehen
 *
 * Eine Order vom Klick bis ins Depot, eine Zahlung durch eine Blockchain, ein
 * Leitzins bis in die Ladenpreise, die ersten Schritte vor dem ersten Kauf –
 * inhaltlich haben diese vier nichts miteinander zu tun. Formal schon: Alle
 * vier sind eine Abfolge, bei der die *Reihenfolge* der eigentliche Inhalt
 * ist.
 *
 * Im Lerntext stehen sie deshalb bereits als nummerierte Liste. Was die
 * Zeichnung hinzufügt, ist nicht die Aufzählung, sondern der Abstand: dass
 * zwischen Schritt drei und vier eine Grenze liegt, dass der Weg an einer
 * Stelle die Hand wechselt, dass es keine Abkürzung gibt.
 *
 * ## Warum hier keine Zahlen stehen
 *
 * Anders als bei den übrigen Grafiken rechnet keine dieser vier. Sie
 * beschreiben eine Abfolge, und eine Abfolge hat keine Achse. Die Texte in
 * den Kästen sind deshalb Kurzfassungen der Listen daneben und müssen mit
 * ihnen mitwandern – dafür steht in jedem Abschnitt, aus welcher Stelle des
 * Themas sie stammen.
 */

// ---------------------------------------------------- Vom Klick zur Buchung

/**
 * Der Weg einer Wertpapierorder.
 *
 * Kurzfassung der nummerierten Liste unter „Vom Klick zur Buchung“ im Thema
 * Börse. Der Punkt, den die Zeichnung deutlicher macht als die Liste: Nach der
 * Ausführung ist das Geschäft geschlossen, aber noch nichts geliefert – die
 * beiden letzten Kästen liegen Tage hinter den ersten drei.
 */
export function BoerseVomKlickZurBuchung() {
  return (
    <AblaufKette
      id="boerse-vom-klick-zur-buchung"
      hoehe={166}
      stationen={[
        {
          titel: 'Order',
          text: 'Du erteilst sie beim Broker, nicht bei der Börse',
        },
        {
          titel: 'Weiterleitung',
          text: 'Der Broker gibt sie an den Handelsplatz',
        },
        {
          titel: 'Ausführung',
          text: 'Passt ein Gegenangebot, kommt das Geschäft zustande',
        },
        {
          titel: 'Abwicklung',
          text: 'Ein bis zwei Werktage bis zum Tausch',
          farbe: FARBEN.akzent,
        },
        {
          titel: 'Depot',
          text: 'Erst jetzt gehören die Papiere dir',
          farbe: FARBEN.akzent,
        },
      ]}
      beschreibung={
        'Der Weg einer Wertpapierorder in fünf Schritten. Erstens: Du erteilst die Order bei deinem Broker – ' +
        'zur Börse selbst haben nur zugelassene Teilnehmer Zugang. Zweitens: Der Broker leitet sie an den ' +
        'Handelsplatz weiter. Drittens: Findet sich im Orderbuch ein passendes Gegenangebot, kommt das ' +
        'Geschäft zustande; andernfalls wartet die Order oder verfällt. Diese drei Schritte dauern ' +
        'Sekundenbruchteile. Viertens: Die Abwicklung tauscht Geld gegen Papiere, in der EU zwei Werktage ' +
        'nach dem Geschäft, in den USA einen. Fünftens: die Buchung ins Depot. Bis dahin hattest du einen ' +
        'Anspruch auf die Papiere, nicht die Papiere.'
      }
    />
  )
}

// ------------------------------------------------ Eine Zahlung im Blockchain

/**
 * Was mit einer Überweisung in einem Blockchain-Netz passiert.
 *
 * Kurzfassung der Abschnitte „Vier Begriffe genügen“ und „Wie eine Einigung
 * zustande kommt“ im Thema Blockchain. Der letzte Kasten ist der, der beim
 * Vergleich mit einer Banküberweisung regelmäßig fehlt: Bestätigt ist eine
 * Zahlung nicht mit dem Block, sondern erst mit den Blöcken danach.
 */
export function BlockchainZahlung() {
  return (
    <AblaufKette
      id="blockchain-zahlung"
      hoehe={166}
      stationen={[
        {
          titel: 'Signieren',
          text: 'Der Absender unterschreibt mit seinem privaten Schlüssel',
        },
        {
          titel: 'Verteilen',
          text: 'Die Zahlung geht an alle Knoten im Netz',
        },
        {
          titel: 'Bündeln',
          text: 'Wer den nächsten Block bauen darf, nimmt sie auf',
        },
        {
          titel: 'Anhängen',
          text: 'Der Block verweist auf den vorherigen',
        },
        {
          titel: 'Bestätigen',
          text: 'Jeder weitere Block macht ein Zurücknehmen teurer',
          farbe: FARBEN.akzent,
        },
      ]}
      beschreibung={
        'Der Weg einer Zahlung durch ein Blockchain-Netz. Der Absender signiert sie mit seinem privaten ' +
        'Schlüssel – das ist der Nachweis, dass sie von ihm stammt. Die signierte Zahlung wird an alle ' +
        'Knoten des Netzes verteilt. Wer nach den Regeln des Netzes den nächsten Block bauen darf, nimmt ' +
        'sie in diesen Block auf. Der Block enthält einen Verweis auf seinen Vorgänger; dadurch entsteht ' +
        'die Kette. Endgültig ist die Zahlung damit noch nicht: Erst jeder weitere angehängte Block macht ' +
        'es teurer, sie nachträglich herauszurechnen. Bestätigung ist hier eine Frage des Grades, nicht ' +
        'ein Zustand.'
      }
    />
  )
}

// ------------------------------------------------------ Vom Leitzins zum Preis

/**
 * Wie ein Zinsentscheid in der Wirtschaft ankommt.
 *
 * Kurzfassung des Abschnitts „Vier Wege in die Wirtschaft“ und der Frage
 * „Warum alles so lange dauert“ im Thema Notenbanken. Die Zeichnung
 * beantwortet vor allem die zweite: Zwischen dem Beschluss und der Wirkung
 * liegen vier Übergaben, und jede kostet Zeit.
 */
export function NotenbankTransmission() {
  return (
    <AblaufKette
      id="notenbank-transmission"
      hoehe={166}
      stationen={[
        {
          titel: 'Leitzins',
          text: 'Die Notenbank beschließt, zu welchem Satz Banken Geld bekommen',
        },
        {
          titel: 'Banken',
          text: 'Kredite werden teurer, und es wird strenger geprüft',
        },
        {
          titel: 'Nachfrage',
          text: 'Investitionen und Käufe auf Pump werden zurückgestellt',
        },
        {
          titel: 'Preise',
          text: 'Erst nach Quartalen bis Jahren messbar',
          farbe: FARBEN.akzent,
        },
      ]}
      beschreibung={
        'Wie ein Zinsentscheid in der Wirtschaft ankommt. Die Notenbank setzt nur den Satz, zu dem sich ' +
        'Banken bei ihr Geld beschaffen. Die Banken geben ihn weiter – über den Preis ihrer Kredite und ' +
        'über die Bereitschaft, überhaupt welche zu vergeben. Erst dadurch ändert sich, was Unternehmen ' +
        'investieren und was Haushalte auf Kredit kaufen. Und erst wenn sich die Nachfrage geändert hat, ' +
        'bewegen sich die Preise. Zwischen dem ersten und dem letzten Kasten liegen mehrere Quartale bis ' +
        'Jahre – der Grund, warum Notenbanken auf eine Lage reagieren müssen, die es beim Wirken ihrer ' +
        'Entscheidung schon nicht mehr gibt.'
      }
    />
  )
}

// ----------------------------------------------- Die Reihenfolge für Einsteiger

/**
 * Was vor dem ersten Wertpapierkauf zu erledigen ist.
 *
 * Kurzfassung der vier nummerierten Schritte im Thema „Worauf Einsteiger
 * achten sollten“. Der Grund für die Zeichnung ist die Reihenfolge selbst:
 * Jeder dieser Schritte bringt sicher mehr als der Kauf, der meistens zuerst
 * kommt.
 */
export function EinsteigerReihenfolge() {
  return (
    <AblaufKette
      id="einsteiger-reihenfolge"
      hoehe={172}
      stationen={[
        {
          titel: 'Teure Schulden',
          text: 'Getilgt bringt sicher, was kein Depot verspricht',
          farbe: FARBEN.gefahr,
        },
        {
          titel: 'Notgroschen',
          text: 'Drei Nettogehälter, jederzeit verfügbar',
        },
        {
          titel: 'Versicherungen',
          text: 'Nur das, was existenziell wäre',
        },
        {
          titel: 'Ziele mit Frist',
          text: 'Erst der Zeitraum entscheidet über die Anlage',
        },
        {
          titel: 'Anlegen',
          text: 'Breit gestreut und günstig, danach in Ruhe lassen',
          farbe: FARBEN.akzent,
        },
      ]}
      beschreibung={
        'Die Reihenfolge vor dem ersten Wertpapierkauf. Erstens teure Schulden tilgen: Ein Dispo zu zehn ' +
        'Prozent zu beenden bringt sicher zehn Prozent, was keine Anlage verspricht. Zweitens den ' +
        'Notgroschen aufbauen – rund drei Nettogehälter, jederzeit verfügbar, damit die erste kaputte ' +
        'Waschmaschine nicht zum Verkauf im falschen Moment zwingt. Drittens die Risiken versichern, die ' +
        'existenzbedrohend wären, und nur diese. Viertens die Ziele mit einem Zeitraum versehen; erst er ' +
        'entscheidet, was überhaupt in Frage kommt. Der eigentliche Kauf steht am Ende dieser Kette, nicht ' +
        'am Anfang.'
      }
    />
  )
}
