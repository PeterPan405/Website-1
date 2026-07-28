import { AblaufKette, FARBEN } from '@/components/content/figures/Diagramme'
import { Beschriftung, FigureSvg } from '@/components/content/figures/Rahmen'

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

// ----------------------------------------------------------- Haftungskaskade

/**
 * In welcher Reihenfolge eine Bank abgewickelt wird.
 *
 * ## Warum als Stapel und nicht als Kette
 *
 * Die übrigen Grafiken dieser Datei zeigen einen Weg – hier geht es um eine
 * Rangfolge. Ein Stapel bildet das ab, was die Sache ausmacht: Jede Stufe muss
 * vollständig aufgezehrt sein, bevor die nächste überhaupt angefasst wird. Wer
 * ganz unten steht, ist nicht ein bisschen sicherer, sondern durch alles
 * darüber geschützt.
 *
 * Die Höhen sind gleich und stellen keine Beträge dar. Das ist Absicht: Die
 * tatsächlichen Größenverhältnisse unterscheiden sich von Bank zu Bank und
 * ändern sich laufend. Was hier steht, ist die Reihenfolge, und die ist
 * gesetzlich festgelegt.
 */
const KASKADE = [
  {
    stufe: 'Eigenkapital der Aktionäre',
    text: 'Wird zuerst und in voller Höhe aufgezehrt',
  },
  {
    stufe: 'Hybride und Nachranganleihen',
    text: 'Wandlung oder Abschreibung, oft schon vor der Abwicklung',
  },
  {
    stufe: 'Nicht bevorrechtigte vorrangige Anleihen',
    text: 'Eigens geschaffen, um den Puffer vor den Einlagen zu bilden',
  },
  {
    stufe: 'Übrige Verbindlichkeiten und Einlagen über der Grenze',
    text: 'Hier beginnt es Unternehmen und große Vermögen zu treffen',
  },
  {
    stufe: 'Gedeckte Einlagen',
    text: 'Gesetzlich vom Bail-in ausgenommen – praktisch nie erreicht',
  },
] as const

export function EinlagensicherungKaskade() {
  const zeilenhoehe = 52
  const oben = 34
  const hoehe = oben + KASKADE.length * zeilenhoehe + 16
  const links = 34
  const breite = 640 - links * 2

  return (
    <FigureSvg
      id="einlagensicherung-kaskade"
      viewBox={`0 0 640 ${hoehe}`}
      beschreibung={
        'Die gesetzliche Reihenfolge, in der eine Bank abgewickelt wird, von oben nach unten: ' +
        KASKADE.map((k, index) => `${index + 1}. ${k.stufe} – ${k.text}`).join('; ') +
        '. Jede Stufe muss vollständig aufgezehrt sein, bevor die nächste angefasst wird. Gedeckte ' +
        'Einlagen stehen ganz unten und sind damit nicht ein bisschen sicherer als der Rest, sondern ' +
        'durch alles darüber geschützt. Die Kästen sind gleich hoch und stellen keine Beträge dar: Die ' +
        'tatsächlichen Größenverhältnisse unterscheiden sich von Bank zu Bank. Was feststeht, ist die ' +
        'Reihenfolge.'
      }
    >
      <Beschriftung x={links} y={20} ton="leise" groesse={12}>
        wird zuerst herangezogen
      </Beschriftung>

      {KASKADE.map((eintrag, index) => {
        const y = oben + index * zeilenhoehe
        const letzte = index === KASKADE.length - 1
        const farbe = letzte ? FARBEN.marke : index === 0 ? FARBEN.gefahr : FARBEN.warnung
        return (
          <g key={eintrag.stufe}>
            <rect
              x={links}
              y={y}
              width={breite}
              height={zeilenhoehe - 8}
              rx={6}
              fill="var(--c-bg-subtle)"
              stroke={farbe}
              strokeWidth={letzte ? 2 : 1.25}
            />
            <Beschriftung x={links + 14} y={y + 20} ton="stark" gewicht="kraeftig">
              {`${index + 1}. ${eintrag.stufe}`}
            </Beschriftung>
            <Beschriftung x={links + 14} y={y + 36} ton="gedaempft" groesse={12}>
              {eintrag.text}
            </Beschriftung>
          </g>
        )
      })}

      <Beschriftung x={links} y={hoehe - 2} ton="leise" groesse={12}>
        zuletzt – und praktisch nie
      </Beschriftung>
    </FigureSvg>
  )
}

// ------------------------------------------------ Zwischen Abschluss und Depot

/**
 * Was in den zwei Werktagen nach dem Geschäft passiert.
 *
 * Kurzfassung des Abschnitts „Was zwischen Abschluss und Lieferung passiert“
 * im Thema Börse. Der Punkt, den die Kette deutlicher macht als der Text: Aus
 * einem Geschäft werden rechtlich zwei, und die Gegenpartei steht in beiden –
 * deshalb trifft der Ausfall einer Seite nie die andere.
 */
export function BoerseAbwicklung() {
  return (
    <AblaufKette
      id="boerse-abwicklung"
      hoehe={172}
      stationen={[
        {
          titel: 'Abschluss',
          text: 'Zwei Aufträge treffen sich im Orderbuch',
        },
        {
          titel: 'Gegenpartei',
          text: 'Aus einem Geschäft werden rechtlich zwei',
          farbe: FARBEN.akzent,
        },
        {
          titel: 'Netting',
          text: 'Nur der Saldo des Tages wird bewegt',
          farbe: FARBEN.akzent,
        },
        {
          titel: 'Lieferung',
          text: 'Papiere und Geld wechseln Zug um Zug',
        },
        {
          titel: 'Depot',
          text: 'Erst hier gehören die Papiere dir',
        },
      ]}
      beschreibung={
        'Was zwischen dem Geschäft und der Buchung im Depot passiert – zwei Werktage, in denen zwei ' +
        'Einrichtungen arbeiten, von denen Privatanleger nie hören. Erstens der Abschluss: Zwei Aufträge ' +
        'treffen sich im Orderbuch. Zweitens die zentrale Gegenpartei: Sie schaltet sich dazwischen, und ' +
        'aus einem Geschäft werden rechtlich zwei – du kaufst von ihr, der Verkäufer verkauft an sie. ' +
        'Fällt eine Seite aus, trägt sie den Schaden, nicht die andere Seite. Drittens das Netting: Wer an ' +
        'einem Tag 900 Stück kauft und 850 verkauft, lässt nur 50 liefern; das verkleinert die tatsächlich ' +
        'bewegten Beträge um ein Vielfaches. Viertens die Lieferung Zug um Zug, damit keine Seite in ' +
        'Vorleistung geht. Und erst danach die Buchung ins Depot.'
      }
    />
  )
}
