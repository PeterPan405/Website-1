import { AblaufKette, FARBEN } from '@/components/content/figures/Diagramme'
import { KASKADE } from '@/components/content/figures/kastenreihen'
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
    />
  )
}

// ----------------------------------------------------------- Haftungskaskade

export function EinlagensicherungKaskade() {
  const zeilenhoehe = 52
  const oben = 34
  const hoehe = oben + KASKADE.length * zeilenhoehe + 16
  const links = 34
  const breite = 640 - links * 2

  return (
    <FigureSvg id="einlagensicherung-kaskade" viewBox={`0 0 640 ${hoehe}`}>
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
              fill="var(--c-surface-muted)"
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

      {/* Acht Pixel Luft, nicht zwei: Bei zwei lagen die Unterlängen von „zuletzt“
          und „praktisch“ unter dem Rand und wurden abgeschnitten. */}
      <Beschriftung x={links} y={hoehe - 8} ton="leise" groesse={12}>
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
    />
  )
}
