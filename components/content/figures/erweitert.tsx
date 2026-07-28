import {
  AblaufKette,
  FARBEN,
  Feld,
  LinienDiagramm,
  UmbrochenerText,
} from '@/components/content/figures/Diagramme'
import { Beschriftung, FigureSvg } from '@/components/content/figures/Rahmen'
import { formatNumber, formatPercent } from '@/lib/format'
import {
  absicherungJahre,
  absicherungRendite,
  absicherungZinsdifferenz,
  basiseffektMonate,
  basiseffektSprungMonat,
  basiseffektSprungProzent,
} from '@/lib/lernszenarien'

/**
 * Grafiken für die Fortgeschritten-Stufen, die keine Zahlenreihe brauchen.
 *
 * Vier der sechs zeichnen eine Ordnung statt einer Größe: welche Verkaufs-
 * gründe aus dem eigenen Leben stammen und welche aus dem Markt, wer bei
 * welchem Zugangsweg zu Krypto welches Risiko trägt, in welcher Reihenfolge
 * fünf Fragen ein Produkt aussortieren, und was eine periodische Bewertung mit
 * einem Kursverlauf macht. Zwei rechnen: die laufenden Kosten einer
 * Währungsabsicherung und der Basiseffekt in der Teuerungsrate.
 */

// -------------------------------------------------- Kosten der Absicherung

/**
 * Was eine Währungsabsicherung über die Jahre kostet.
 *
 * ## Warum der Wechselkurs in dieser Grafik nicht vorkommt
 *
 * Weil er für die Aussage nichts tut. Die Absicherung kostet die
 * Zinsdifferenz – unabhängig davon, wohin der Kurs läuft. Wer eine
 * Wechselkursbewegung einzeichnete, machte aus einer Kostenrechnung eine
 * Wette, und der Leser nähme mit, die Absicherung habe sich „gelohnt“ oder
 * eben nicht. Beides wäre eine Aussage über den gezeichneten Verlauf und nicht
 * über die Absicherung.
 *
 * Beide Linien zeigen deshalb dieselbe Anlage bei derselben Wertentwicklung.
 * Was sie unterscheidet, ist allein der laufende Abzug.
 */
export function WaehrungAbsicherung() {
  const jahre = Array.from({ length: absicherungJahre + 1 }, (_, jahr) => jahr)
  const ohne = jahre.map((jahr) => ({
    x: jahr,
    y: 100 * (1 + absicherungRendite / 100) ** jahr,
  }))
  const mit = jahre.map((jahr) => ({
    x: jahr,
    y: 100 * (1 + (absicherungRendite - absicherungZinsdifferenz) / 100) ** jahr,
  }))

  const letzteOhne = ohne[ohne.length - 1].y
  const letzteMit = mit[mit.length - 1].y
  const abstand = ((letzteOhne - letzteMit) / letzteOhne) * 100

  return (
    <LinienDiagramm
      id="waehrung-absicherung"
      xVon={0}
      xBis={absicherungJahre}
      xTeilstriche={[0, 2, 4, 6, 8, absicherungJahre].map((jahr) => ({
        wert: jahr,
        text: jahr === 0 ? 'Start' : `${jahr} J.`,
      }))}
      yEinheit="Anlagewert, Start = 100"
      hoehe={310}
      rechterRand={54}
      reihen={[
        {
          name: 'ohne Absicherung',
          farbe: FARBEN.marke,
          punkte: ohne,
          endText: formatNumber(letzteOhne, 0),
        },
        {
          name: `mit Absicherung – ${formatPercent(absicherungZinsdifferenz, 0)} im Jahr`,
          farbe: FARBEN.gefahr,
          punkte: mit,
          endText: formatNumber(letzteMit, 0),
        },
      ]}
      beschreibung={
        `Dieselbe Anlage über ${absicherungJahre} Jahre, einmal mit und einmal ohne ` +
        `Währungsabsicherung. Die Wertentwicklung ist in beiden Fällen dieselbe – der Wechselkurs kommt ` +
        `in dieser Rechnung bewusst nicht vor, weil er für die Kosten der Absicherung keine Rolle ` +
        `spielt. Die Absicherung kostet die Zinsdifferenz zwischen den beiden Währungsräumen, hier ` +
        `angenommen mit ${formatPercent(absicherungZinsdifferenz, 0)} im Jahr. Das ist keine Gebühr, die ` +
        `sich verhandeln ließe, sondern eine Folge der Arbitragefreiheit: Der Terminkurs entspricht dem ` +
        `Kassakurs, angepasst um genau diese Differenz. Aus 100 werden ohne Absicherung ` +
        `${formatNumber(letzteOhne, 0)}, mit Absicherung ${formatNumber(letzteMit, 0)} – ein Rückstand ` +
        `von ${formatPercent(abstand, 0)} nach ${absicherungJahre} Jahren. Kehrt sich die Zinsdifferenz ` +
        `um, kehrt sich auch das Vorzeichen um: Dann wird die Absicherung zur Einnahme. Beides ist ` +
        `unabhängig davon, wohin der Wechselkurs tatsächlich läuft.`
      }
    />
  )
}

// ------------------------------------------------------------ Basiseffekt

/**
 * Warum die Teuerungsrate fallen kann, ohne dass ein Preis sinkt.
 *
 * ## Was hier gerechnet wird
 *
 * Ein einziger Preissprung, danach bleibt alles, wie es ist. Die Teuerungsrate
 * misst den Abstand zum selben Monat des Vorjahres – sie zeigt den Sprung
 * deshalb zwölf Monate lang und danach gar nicht mehr.
 *
 * ## Warum beide Linien in Prozent stehen
 *
 * Weil sie sonst zwei Achsen bräuchten, und zwei Achsen in einem Bild sind
 * die zuverlässigste Art, einen Zusammenhang zu behaupten, den es nicht gibt.
 * Hier geht das ohne: Das Preisniveau wird als Abstand zum Ausgangsmonat
 * gezeichnet, die Teuerungsrate als Abstand zum Vorjahresmonat. Beides sind
 * Prozentangaben auf derselben Skala – und der Punkt der Grafik ist gerade,
 * dass die eine oben bleibt, während die andere auf null fällt.
 */
export function InflationBasiseffekt() {
  const monate = Array.from({ length: basiseffektMonate + 1 }, (_, monat) => monat)

  /** Das Preisniveau: vor dem Sprung 100, danach dauerhaft darüber. */
  const niveau = (monat: number) =>
    monat < basiseffektSprungMonat ? 100 : 100 * (1 + basiseffektSprungProzent / 100)

  const preisniveau = monate.map((monat) => ({
    x: monat,
    y: (niveau(monat) / 100 - 1) * 100,
  }))

  /*
    Die Teuerungsrate vergleicht mit dem Vorjahresmonat.

    Für die ersten zwölf Monate gibt es keinen – dort beginnt die Reihe
    deshalb erst. Eine Null hineinzuschreiben wäre bequem und falsch: Sie
    behauptete eine Messung, die es nicht gibt.
  */
  const teuerung = monate
    .filter((monat) => monat >= 12)
    .map((monat) => ({
      x: monat,
      y: (niveau(monat) / niveau(monat - 12) - 1) * 100,
    }))

  const letzterMonatMitRate = basiseffektSprungMonat + 11

  return (
    <LinienDiagramm
      id="inflation-basiseffekt"
      xVon={0}
      xBis={basiseffektMonate}
      xTeilstriche={[0, 6, 12, 18, 24, basiseffektMonate].map((monat) => ({
        wert: monat,
        text: `${monat}`,
      }))}
      xLabel="Monat"
      yEinheit="Prozent"
      hoehe={310}
      reihen={[
        {
          name: 'Preisniveau gegenüber dem Ausgangsmonat',
          farbe: FARBEN.marke,
          punkte: preisniveau,
        },
        {
          name: 'Teuerungsrate gegenüber dem Vorjahresmonat',
          farbe: FARBEN.gefahr,
          punkte: teuerung,
        },
      ]}
      beschreibung={
        `Ein einziger Preissprung um ${formatPercent(basiseffektSprungProzent, 0)} im Monat ` +
        `${basiseffektSprungMonat}; danach ändert sich kein Preis mehr. Die blaue Linie zeigt das ` +
        `Preisniveau gegenüber dem Ausgangsmonat: Sie springt einmal und bleibt oben. Die rote Linie ` +
        `zeigt die Teuerungsrate, also den Abstand zum selben Monat des Vorjahres. Sie beginnt erst im ` +
        `zwölften Monat, weil es vorher keinen Vergleichsmonat gibt, steht dann bis Monat ` +
        `${letzterMonatMitRate} bei ${formatPercent(basiseffektSprungProzent, 0)} und fällt danach auf ` +
        `null. Gesunken ist dabei kein einziger Preis – aus der Rechnung ist lediglich der Sprung ` +
        `herausgefallen, weil er nun auch im Vergleichsmonat steckt. Das ist der Basiseffekt. Er ist der ` +
        `Grund, warum „die Inflation geht zurück“ und „es wird wieder billiger“ zwei völlig verschiedene ` +
        `Aussagen sind – und warum eine fallende Rate niemanden entlastet, der die höheren Preise weiter ` +
        `bezahlt.`
      }
    />
  )
}

// ------------------------------------------------------- Verkaufsgründe

/**
 * Woher ein Verkaufsgrund stammt – aus dem eigenen Plan oder aus dem Markt.
 *
 * Die beiden Tabellen im Thema stehen untereinander und tragen die Überschrift
 * „Vier Gründe, die tragen“ und „Vier, die nicht tragen“. Was sie nicht
 * zeigen, ist das Unterscheidungsmerkmal, und genau das ist das Werkzeug: Ein
 * tragfähiger Grund kommt fast immer von innen, ein Scheingrund von außen.
 * Nebeneinandergestellt ist das eine Regel, die man sich merken kann.
 */
const VERKAUFSGRUENDE = {
  tragen: [
    'Das Geld wird gebraucht',
    'Das Ziel ist erreicht',
    'Die Anlagethese ist widerlegt',
    'Die Aufteilung ist verschoben',
  ],
  tragenNicht: [
    'Der eigene Einstiegskurs',
    'Runde Marken und Chartlinien',
    'Medienstimmung und Prognosen',
    'Gewinne „mitnehmen“ wollen',
  ],
} as const

export function VerkaufGruende() {
  const spalte = 296
  const links = 16
  const rechts = 640 - links - spalte
  const zeile = 34
  const oben = 84
  const hoehe = oben + VERKAUFSGRUENDE.tragen.length * zeile + 96

  const spalten = [
    {
      titel: 'aus deinem Plan',
      unterzeile: 'trägt einen Verkauf',
      x: links,
      farbe: FARBEN.marke,
      eintraege: VERKAUFSGRUENDE.tragen,
    },
    {
      titel: 'aus dem Markt',
      unterzeile: 'trägt keinen',
      x: rechts,
      farbe: FARBEN.gefahr,
      eintraege: VERKAUFSGRUENDE.tragenNicht,
    },
  ]

  return (
    <FigureSvg
      id="verkauf-gruende"
      viewBox={`0 0 640 ${hoehe}`}
      beschreibung={
        'Acht Verkaufsgründe in zwei Spalten, sortiert nach ihrer Herkunft. Links die vier, die tragen, ' +
        'weil sie aus dem eigenen Plan oder dem eigenen Leben stammen: ' +
        VERKAUFSGRUENDE.tragen.join(', ') +
        '. Rechts die vier, die nicht tragen, weil sie aus dem Markt kommen: ' +
        VERKAUFSGRUENDE.tragenNicht.join(', ') +
        '. Die Herkunft ist das Erkennungsmerkmal und damit das eigentliche Werkzeug: Wer vor einem ' +
        'Verkauf nur eine Frage stellen kann, stellt diese – kommt der Grund von innen oder von außen? ' +
        'Ein Grund von außen ist fast immer eine Reaktion auf etwas, das bereits im Kurs steht.'
      }
    >
      {spalten.map((spalteDaten) => (
        <g key={spalteDaten.titel}>
          <Feld
            x={spalteDaten.x}
            y={40}
            breite={spalte}
            hoehe={VERKAUFSGRUENDE.tragen.length * zeile + 34}
            farbe={spalteDaten.farbe}
          >
            <Beschriftung
              x={spalteDaten.x + spalte / 2}
              y={64}
              anchor="middle"
              ton="stark"
              gewicht="kraeftig"
              groesse={14}
            >
              {spalteDaten.titel}
            </Beschriftung>
            {spalteDaten.eintraege.map((eintrag, index) => (
              <Beschriftung
                key={eintrag}
                x={spalteDaten.x + spalte / 2}
                y={oben + index * zeile + 6}
                anchor="middle"
                ton="gedaempft"
                groesse={12.5}
              >
                {eintrag}
              </Beschriftung>
            ))}
          </Feld>
          <Beschriftung
            x={spalteDaten.x + spalte / 2}
            y={28}
            anchor="middle"
            ton="leise"
            groesse={12}
          >
            {spalteDaten.unterzeile}
          </Beschriftung>
        </g>
      ))}

      <UmbrochenerText
        x={320}
        y={hoehe - 56}
        breite={608}
        text="Die Herkunft ist das Erkennungsmerkmal. Wer vor einem Verkauf nur eine Frage stellen kann, stellt diese: Kommt der Grund von innen oder von außen? Was von außen kommt, steht bereits im Kurs."
        ton="gedaempft"
      />
    </FigureSvg>
  )
}

// ------------------------------------------------------- Zugangswege Krypto

/**
 * Drei Wege zu derselben Anlage, drei verschiedene Risiken.
 *
 * Die Tabelle im Thema stellt Merkmal und Preis nebeneinander. Was sie nicht
 * sichtbar macht: Es ist immer dasselbe Risiko, das nur die Stelle wechselt.
 * Wer den Schlüssel selbst hält, trägt das Verwahrrisiko selbst; wer ihn
 * abgibt, tauscht es gegen das Risiko der Gegenstelle. Verschwinden lässt es
 * sich nicht.
 */
const ZUGANGSWEGE = [
  {
    weg: 'Selbst verwahrt',
    hat: 'Du hältst den Schlüssel',
    risiko: 'Verlust des Schlüssels – kein Zurücksetzen, keine Hotline',
    farbe: FARBEN.marke,
  },
  {
    weg: 'Bei der Plattform',
    hat: 'Die Plattform hält den Schlüssel',
    risiko: 'Insolvenz und Missbrauch der Plattform',
    farbe: FARBEN.warnung,
  },
  {
    weg: 'ETP im Depot',
    hat: 'Ein Wertpapier auf den Kurs',
    risiko: 'Der Emittent – auch bei hinterlegten Beständen',
    farbe: FARBEN.gefahr,
  },
] as const

export function KryptoZugangswege() {
  const breite = 196
  const abstand = 16
  const links = (640 - (3 * breite + 2 * abstand)) / 2
  const oben = 46
  const kastenHoehe = 148
  const hoehe = oben + kastenHoehe + 74

  return (
    <FigureSvg
      id="krypto-zugangswege"
      viewBox={`0 0 640 ${hoehe}`}
      beschreibung={
        'Drei Wege zu derselben Anlage, nebeneinander, mit dem jeweils verbleibenden Risiko: ' +
        ZUGANGSWEGE.map((z) => `${z.weg} – ${z.hat}; das Risiko ist ${z.risiko}`).join(
          '. '
        ) +
        '. Die Gegenüberstellung zeigt, dass es immer dasselbe Risiko ist, das nur die Stelle wechselt. ' +
        'Wer den Schlüssel selbst hält, trägt die Verwahrung selbst – und ein verlorener Schlüssel lässt ' +
        'sich nicht zurücksetzen. Wer ihn abgibt, tauscht dieses Risiko gegen das der Gegenstelle. ' +
        'Verschwinden lässt es sich auf keinem der drei Wege. Die Frage lautet deshalb nicht, welcher Weg ' +
        'sicher ist, sondern welches Risiko man lieber trägt.'
      }
    >
      <Beschriftung x={320} y={24} anchor="middle" ton="leise" groesse={12}>
        dieselbe Anlage, drei Wege – das Risiko wechselt nur die Stelle
      </Beschriftung>

      {ZUGANGSWEGE.map((zugang, index) => {
        const x = links + index * (breite + abstand)
        return (
          <Feld
            key={zugang.weg}
            x={x}
            y={oben}
            breite={breite}
            hoehe={kastenHoehe}
            farbe={zugang.farbe}
          >
            <Beschriftung
              x={x + breite / 2}
              y={oben + 26}
              anchor="middle"
              ton="stark"
              gewicht="kraeftig"
            >
              {zugang.weg}
            </Beschriftung>
            <UmbrochenerText
              x={x + breite / 2}
              y={oben + 50}
              breite={breite - 20}
              text={zugang.hat}
              ton="gedaempft"
              groesse={12}
            />
            <Beschriftung
              x={x + breite / 2}
              y={oben + 96}
              anchor="middle"
              ton="leise"
              groesse={11}
            >
              das bleibende Risiko
            </Beschriftung>
            <UmbrochenerText
              x={x + breite / 2}
              y={oben + 114}
              breite={breite - 20}
              text={zugang.risiko}
              ton="gedaempft"
              groesse={11.5}
            />
          </Feld>
        )
      })}

      <UmbrochenerText
        x={320}
        y={oben + kastenHoehe + 30}
        breite={608}
        text="Die Frage lautet nicht, welcher Weg sicher ist. Sie lautet, welches Risiko man lieber trägt – das eigene Verwahren oder eine fremde Bilanz."
        ton="gedaempft"
      />
    </FigureSvg>
  )
}

// --------------------------------------------------- Die Zehn-Minuten-Prüfung

/**
 * Fünf Fragen an ein Basisinformationsblatt, in der Reihenfolge ihrer Schärfe.
 *
 * Die Reihenfolge ist der Inhalt: Die ersten beiden Fragen sortieren die
 * meisten Produkte bereits aus, und wer sie zuerst stellt, spart sich die
 * übrigen drei. Als Liste im Text steht das nebeneinander; als Kette ist zu
 * sehen, dass es ein Sieb ist.
 */
export function EinsteigerPruefung() {
  return (
    <AblaufKette
      id="einsteiger-pruefung"
      hoehe={182}
      stationen={[
        { titel: 'Basiswert', text: 'Worauf bezieht sich das Produkt überhaupt?' },
        { titel: 'Kosten', text: 'Einstieg, laufend, Ausstieg – alle drei stehen drin' },
        { titel: 'Laufzeit', text: 'Wann komme ich heran, und was kostet es dann?' },
        {
          titel: 'Risiko',
          text: 'Was steht im schlechten Szenario?',
          farbe: FARBEN.warnung,
        },
        {
          titel: 'Wer haftet',
          text: 'Sondervermögen oder Forderung gegen den Emittenten',
          farbe: FARBEN.gefahr,
        },
      ]}
      beschreibung={
        'Fünf Fragen an das gesetzlich vorgeschriebene Basisinformationsblatt, in der Reihenfolge, in ' +
        'der sie am meisten aussortieren. Erstens: Was ist der Basiswert – worauf bezieht sich das ' +
        'Produkt überhaupt? Zweitens: Was kostet es? Einstieg, laufende Kosten und Ausstieg stehen alle ' +
        'drei darin. Drittens: Welche Laufzeit hat es, wann kommt man an das Geld, und was kostet ein ' +
        'vorzeitiger Ausstieg? Viertens: Was steht im ungünstigen Szenario – das ist die Zahl, die man ' +
        'aushalten muss. Fünftens: Wer haftet? Ein Fonds ist Sondervermögen, ein Zertifikat eine ' +
        'Forderung gegen die ausgebende Bank. Die Reihenfolge ist der eigentliche Rat: Die ersten beiden ' +
        'Fragen sortieren die meisten Produkte bereits aus, und wer sie zuerst stellt, spart sich die ' +
        'übrigen drei.'
      }
    />
  )
}

// -------------------------------------------------- Geglättete Bewertung

/**
 * Warum ein ruhiger Kurs nicht dasselbe ist wie ein ruhiger Wert.
 *
 * ## Was gezeichnet wird
 *
 * Derselbe Verlauf zweimal: einmal täglich bewertet, einmal in Stufen, wie
 * ihn eine Bewertung durch Gutachter alle paar Monate erzeugt. Die Stufenlinie
 * sieht ruhiger aus, obwohl sie dasselbe abbildet – sie ist nur seltener
 * aktualisiert.
 *
 * ## Warum die Kurve schematisch ist
 *
 * Weil sie keine Immobilienpreise behauptet. Sie zeigt, was eine periodische
 * Bewertung mit einem beliebigen Verlauf macht, und das ist unabhängig davon,
 * welcher Verlauf es ist. Zahlen an der Achse wären deshalb nicht genauer,
 * sondern nur zutraulicher.
 */
export function FondsBewertungsglaettung() {
  const hoehe = 300
  const links = 20
  const rechts = 620
  const oben = 52
  const unten = 208
  const schritte = 96
  const stufen = 6

  /* Ein zusammengesetzter Verlauf – kein Zufall, damit die Zeichnung bei
     jedem Bauen dieselbe ist. Zufällige Kurven sind in einem statisch
     gebauten Bild eine Fehlerquelle ohne Gegenwert. */
  const wert = (anteil: number) =>
    Math.sin(anteil * 5.2) * 0.55 + Math.sin(anteil * 12.4) * 0.28 - anteil * 0.5

  const y = (w: number) => (oben + unten) / 2 - w * ((unten - oben) / 2.4)
  const x = (anteil: number) => links + anteil * (rechts - links)

  const taeglich = Array.from({ length: schritte + 1 }, (_, i) => {
    const anteil = i / schritte
    return `${i === 0 ? 'M' : 'L'}${x(anteil).toFixed(1)} ${y(wert(anteil)).toFixed(1)}`
  }).join(' ')

  /*
    Die Stufenlinie nimmt den Wert zum Bewertungsstichtag und hält ihn.

    Genau das tut eine Bewertung durch Gutachter: Sie misst selten und
    schreibt den gemessenen Wert bis zur nächsten Messung fort.
  */
  const gestuft = Array.from({ length: stufen + 1 }, (_, i) => {
    const anteil = i / stufen
    const px = x(anteil)
    const py = y(wert(anteil))
    return i === 0
      ? `M${px.toFixed(1)} ${py.toFixed(1)}`
      : `L${px.toFixed(1)} ${y(wert((i - 1) / stufen)).toFixed(1)} L${px.toFixed(1)} ${py.toFixed(1)}`
  }).join(' ')

  return (
    <FigureSvg id="fonds-bewertungsglaettung" viewBox={`0 0 640 ${hoehe}`}>
      {/* Kopfzeile links, Kurvenbeschriftung rechts – mittig gesetzt stießen
          die beiden Texte in der oberen Zeile zusammen. */}
      <Beschriftung x={links} y={24} ton="leise" groesse={12}>
        schematisch – derselbe Verlauf, zwei Arten ihn zu messen
      </Beschriftung>

      {Array.from({ length: stufen + 1 }, (_, i) => (
        <line
          key={i}
          x1={x(i / stufen)}
          y1={oben - 6}
          x2={x(i / stufen)}
          y2={unten + 6}
          stroke={FARBEN.raster}
          strokeWidth={1}
        />
      ))}

      <path d={taeglich} fill="none" stroke={FARBEN.ruhig} strokeWidth={2} />
      <path d={gestuft} fill="none" stroke={FARBEN.marke} strokeWidth={2.5} />

      <Beschriftung x={links} y={unten + 26} ton="leise" groesse={12}>
        Bewertungsstichtage
      </Beschriftung>
      <Beschriftung x={rechts} y={unten + 26} anchor="end" ton="marke" groesse={12}>
        so sieht der Kurs aus
      </Beschriftung>
      <Beschriftung x={rechts} y={24} anchor="end" ton="leise" groesse={12}>
        so bewegt sich der Wert
      </Beschriftung>

      <UmbrochenerText
        x={320}
        y={unten + 56}
        breite={608}
        text="Die ruhige Linie ist nicht ruhiger, sie ist seltener gemessen. Wer einen offenen Immobilienfonds mit Tagesgeld vergleicht, weil „der Kurs so ruhig ist“, vergleicht eine Eigenschaft der Anlage mit einer Eigenschaft des Messverfahrens."
        ton="gedaempft"
      />
    </FigureSvg>
  )
}
