import {
  AblaufKette,
  FARBEN,
  Feld,
  UmbrochenerText,
} from '@/components/content/figures/Diagramme'
import { Beschriftung, FigureSvg } from '@/components/content/figures/Rahmen'

/**
 * Die letzten neun Grafiken der Profi-Stufen.
 *
 * Keine von ihnen rechnet. Das ist kein Versäumnis: Was auf dieser Stufe
 * fehlt, sind selten Zahlen und fast immer Zuordnungen – welcher der drei
 * Wege die Wucht hat, welche zwei der drei Größen niemand messen kann, in
 * welcher Reihenfolge ein Angriff abläuft. Für all das wäre eine erfundene
 * Zahl schlechter als keine.
 */

interface Kasten {
  titel: string
  text: string
  farbe: string
  fuss?: string
}

/**
 * Die Vorlesefassung einer Kastenreihe, aus denselben Einträgen gebildet.
 *
 * Sie zweimal zu schreiben – einmal für das Auge, einmal für die Vorlesung –
 * hieße, sie zweimal zu pflegen. Der Build bricht ab, wenn eine Grafik keine
 * Beschreibung hat; er kann nicht prüfen, ob eine vorhandene noch stimmt.
 */
function reiheAlsText(eintraege: readonly Kasten[]): string {
  return eintraege
    .map((e) => `${e.titel}: ${e.text}${e.fuss ? ` – ${e.fuss}` : ''}`)
    .join('. ')
}

/** Eine Reihe gleich breiter Kästen mit Titel und zwei Textzeilen. */
function Kastenreihe({
  eintraege,
  y,
  hoehe,
  breite,
  abstand = 16,
}: {
  eintraege: readonly Kasten[]
  y: number
  hoehe: number
  breite: number
  abstand?: number
}) {
  const gesamt = eintraege.length * breite + (eintraege.length - 1) * abstand
  const links = (640 - gesamt) / 2

  return (
    <g>
      {eintraege.map((eintrag, index) => {
        const x = links + index * (breite + abstand)
        return (
          <Feld
            key={eintrag.titel}
            x={x}
            y={y}
            breite={breite}
            hoehe={hoehe}
            farbe={eintrag.farbe}
          >
            <Beschriftung
              x={x + breite / 2}
              y={y + 24}
              anchor="middle"
              ton="stark"
              gewicht="kraeftig"
              groesse={13}
            >
              {eintrag.titel}
            </Beschriftung>
            <UmbrochenerText
              x={x + breite / 2}
              y={y + 46}
              breite={breite - 20}
              text={eintrag.text}
              ton="gedaempft"
              groesse={11.5}
            />
            {eintrag.fuss && (
              <UmbrochenerText
                x={x + breite / 2}
                y={y + hoehe - 26}
                breite={breite - 20}
                text={eintrag.fuss}
                ton="leise"
                groesse={11}
              />
            )}
          </Feld>
        )
      })}
    </g>
  )
}

// -------------------------------------------------------- Zwang und Zuversicht

/**
 * Warum Einbrüche schneller sind als Anstiege.
 *
 * Die Erklärung im Text ist ein Satz: Zwang wirkt sofort, Zuversicht braucht
 * Zeit. Als Kurve ist daraus eine Form, die jeder aus Kurscharts kennt und
 * selten benannt bekommt – der lange Aufbau und der kurze Absturz.
 *
 * Bewusst ohne Achsenzahlen: Wie lange ein Aufbau dauert und wie tief ein
 * Einbruch geht, ist von Fall zu Fall verschieden. Das Verhältnis der beiden
 * Zeiträume ist es nicht.
 */
export function PsychologieAsymmetrie() {
  const hoehe = 292
  const links = 24
  const rechts = 616
  const oben = 58
  const unten = 196
  const gipfel = 0.72

  const punkte: string[] = []
  for (let i = 0; i <= 100; i++) {
    const anteil = i / 100
    /* Der Aufbau ist eine flache Beschleunigung, der Absturz eine steile
       Gerade. Beide Formen sind schematisch – gemeint ist ihr Verhältnis. */
    const wert =
      anteil <= gipfel
        ? (anteil / gipfel) ** 1.8
        : 1 - ((anteil - gipfel) / (1 - gipfel)) ** 0.85
    const x = links + anteil * (rechts - links)
    const y = unten - wert * (unten - oben)
    punkte.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`)
  }

  const gipfelX = links + gipfel * (rechts - links)

  return (
    <FigureSvg id="psychologie-asymmetrie" viewBox={`0 0 640 ${hoehe}`}>
      <Beschriftung x={links} y={26} ton="leise" groesse={12}>
        schematisch – das Verhältnis der Zeiträume ist die Aussage
      </Beschriftung>

      <line
        x1={links}
        y1={unten}
        x2={rechts}
        y2={unten}
        stroke={FARBEN.raster}
        strokeWidth={1.5}
      />
      <path d={punkte.join(' ')} fill="none" stroke={FARBEN.marke} strokeWidth={2.5} />
      <line
        x1={gipfelX}
        y1={oben - 10}
        x2={gipfelX}
        y2={unten}
        stroke={FARBEN.raster}
        strokeWidth={1}
        strokeDasharray="4 4"
      />

      <Beschriftung
        x={gipfelX / 2 + links / 2}
        y={unten + 22}
        anchor="middle"
        ton="marke"
      >
        Zuversicht braucht Zeit
      </Beschriftung>
      <Beschriftung
        x={(gipfelX + rechts) / 2}
        y={unten + 22}
        anchor="middle"
        ton="gefahr"
      >
        Zwang wirkt sofort
      </Beschriftung>

      <UmbrochenerText
        x={320}
        y={unten + 54}
        breite={608}
        text="Steigende Kurse erzeugen Berichterstattung, Berichterstattung erzeugt Zuflüsse – das dauert. Fallende Kurse zwingen fremdfinanzierte Teilnehmer zu Verkäufen, und ein Margin Call kennt keine Bedenkzeit."
        ton="gedaempft"
      />
    </FigureSvg>
  )
}

// ---------------------------------------------------- Die Reihenfolge im Block

/**
 * Was es wert ist, über die Reihenfolge zu entscheiden.
 *
 * Der Ablauf ist der Inhalt: Ein Auftrag wird sichtbar, bevor er ausgeführt
 * ist – und in dieser Lücke lässt sich handeln. Als Aufzählung im Text
 * verliert das seine Schärfe, weil die Gleichzeitigkeit untergeht.
 */
export function BlockchainReihenfolge() {
  return (
    <AblaufKette
      id="blockchain-reihenfolge"
      hoehe={186}
      stationen={[
        {
          titel: 'Sichtbar',
          text: 'Dein Auftrag steht im offenen Wartebereich, bevor er ausgeführt ist',
        },
        {
          titel: 'Vorgezogen',
          text: 'Wer die Reihenfolge bestimmt, kauft davor',
          farbe: FARBEN.warnung,
        },
        {
          titel: 'Ausgeführt',
          text: 'Dein Auftrag läuft zum schlechteren Preis',
          farbe: FARBEN.gefahr,
        },
        {
          titel: 'Verkauft',
          text: 'Der Vorläufer stellt glatt und nimmt die Differenz mit',
          farbe: FARBEN.gefahr,
        },
      ]}
      beschreibung={
        'Wie sich aus der Reihenfolge von Transaktionen Geld ziehen lässt, in vier Schritten. Erstens ' +
        'steht dein Auftrag im offenen Wartebereich des Netzes – sichtbar für alle, aber noch nicht ' +
        'ausgeführt. Zweitens nutzt das, wer über die Reihenfolge im nächsten Block entscheidet: Er ' +
        'setzt einen eigenen Kauf davor. Drittens läuft dein Auftrag anschließend zu einem schlechteren ' +
        'Preis, weil der vorgezogene Kauf ihn bewegt hat. Viertens stellt der Vorläufer glatt und nimmt ' +
        'die Differenz mit. Bezahlt hast sie du, ohne dass eine Regel verletzt worden wäre. Genau darin ' +
        'liegt der Punkt: Das Recht, die Reihenfolge zu bestimmen, hat einen Geldwert, und dieser Wert ' +
        'schafft einen Anreiz zur Zentralisierung – wer ihn abschöpfen kann, kann mehr bieten als wer ' +
        'nur die Blockbelohnung sucht.'
      }
    />
  )
}

// ------------------------------------------------------- Die Bewertungsstufen

/**
 * Wie sicher der Preis ist, den ein Fonds für seine Positionen ansetzt.
 *
 * Die drei Stufen bilden eine Leiter abnehmender Nachprüfbarkeit, und die
 * unterste ist die interessante: Dort entscheidet, wer die Annahmen setzt.
 * Als Liste stehen sie gleichwertig nebeneinander; als Leiter ist zu sehen,
 * dass es ein Gefälle ist.
 */
const BEWERTUNGSSTUFEN = [
  {
    titel: 'Stufe 1',
    text: 'notierte Preise an einem aktiven Markt',
    fuss: 'unstrittig',
    farbe: FARBEN.marke,
  },
  {
    titel: 'Stufe 2',
    text: 'abgeleitet aus beobachtbaren Größen ähnlicher Papiere',
    fuss: 'vertretbar – aber eine Schätzung',
    farbe: FARBEN.warnung,
  },
  {
    titel: 'Stufe 3',
    text: 'überwiegend aus Modellannahmen',
    fuss: 'hier entscheidet, wer die Annahmen setzt',
    farbe: FARBEN.gefahr,
  },
] as const

export function FondsBewertungsstufen() {
  const hoehe = 292
  const kastenHoehe = 116

  return (
    <FigureSvg
      id="fonds-bewertungsstufen"
      viewBox={`0 0 640 ${hoehe}`}
      beschreibung={
        'Die drei Bewertungsstufen eines Fonds, von links nach rechts abnehmend nachprüfbar. ' +
        reiheAlsText(BEWERTUNGSSTUFEN) +
        '. Für eine Aktie mit Börsenkurs ist die Bewertung trivial. Für eine Unternehmensanleihe, die zuletzt vor drei Wochen gehandelt wurde, gibt es keinen Kurs – bewertet wird dann nach Modell, abgeleitet aus vergleichbaren Papieren, aus Renditekurven, aus Kursstellungen von Händlern. Wie hoch der Anteil der Stufen zwei und drei am Fondsvermögen ist, steht im Jahresbericht: bei einem Aktienfonds nahe null, bei manchen Anleihe- und Mischfonds erheblich. Dort entscheidet, wer die Annahmen setzt – und dort entsteht im Krisenfall der Streit über den richtigen Anteilspreis.'
      }
    >
      <Beschriftung x={24} y={26} ton="leise" groesse={12}>
        nachprüfbar
      </Beschriftung>
      <Beschriftung x={616} y={26} anchor="end" ton="leise" groesse={12}>
        Ermessenssache
      </Beschriftung>

      <Kastenreihe eintraege={BEWERTUNGSSTUFEN} y={44} hoehe={kastenHoehe} breite={186} />

      <UmbrochenerText
        x={320}
        y={44 + kastenHoehe + 34}
        breite={608}
        text="Für eine DAX-Aktie gibt es einen Kurs. Für eine Unternehmensanleihe, die zuletzt vor drei Wochen gehandelt wurde, gibt es keinen – und dann wird bewertet, nicht abgelesen. Wie hoch der Anteil der Stufen zwei und drei ist, steht im Jahresbericht: bei einem Aktienfonds nahe null, bei manchen Anleihe- und Mischfonds erheblich."
        ton="gedaempft"
      />
    </FigureSvg>
  )
}

// ------------------------------------------------------------- Ansteckung

/**
 * Warum manche Einbrüche folgenlos bleiben und andere ein Jahrzehnt kosten.
 *
 * Drei Wege führen vom Kurssturz in die Wirtschaft, und nur einer hat die
 * Wucht. Erkennbar wird das nicht an der Aufzählung, sondern an der
 * Rückkopplung: Der Bankkanal ist der einzige, der zu sich selbst zurückführt.
 */
const ANSTECKUNGSWEGE = [
  {
    titel: 'Vermögenskanal',
    text: 'Weniger Vermögen, weniger Konsum',
    fuss: 'real, aber schwach und langsam',
    farbe: FARBEN.ruhig,
  },
  {
    titel: 'Bankkanal',
    text: 'Banken verlieren Eigenkapital und vergeben weniger Kredit',
    fuss: 'Unternehmen scheitern, obwohl ihr Geschäft trägt',
    farbe: FARBEN.gefahr,
  },
  {
    titel: 'Rückkopplung',
    text: 'Die schwächere Wirtschaft erzeugt Kreditausfälle',
    fuss: 'und die treffen wieder die Banken',
    farbe: FARBEN.gefahr,
  },
] as const

export function CrashesAnsteckung() {
  const hoehe = 320
  const oben = 56
  const kastenHoehe = 122

  return (
    <FigureSvg
      id="crashes-ansteckung"
      viewBox={`0 0 640 ${hoehe}`}
      beschreibung={
        'Die drei Wege, auf denen ein Kurssturz die Wirtschaft erreicht. ' +
        reiheAlsText(ANSTECKUNGSWEGE) +
        '. Ein gestrichelter Pfeil führt vom dritten Kasten zurück zum zweiten: Die Rückkopplung trifft wieder die Banken. Nur dieser eine Weg schließt sich zu einem Kreis, und nur er hat die Wucht, aus einem Kurssturz eine Krise zu machen. 1987 verlor der Markt an einem Tag rund ein Fünftel, ohne dass eine Rezession folgte – das Bankensystem war nicht betroffen. 2008 begann mit fallenden Immobilienpreisen und endete in einer weltweiten Wirtschaftskrise, weil es betroffen war. Ist der Kreis erst geschlossen, entscheidet nur noch die Reaktion der Politik über die Dauer.'
      }
    >
      <Beschriftung x={320} y={26} anchor="middle" ton="leise" groesse={12}>
        drei Wege vom Kurssturz in die Wirtschaft – einer hat die Wucht
      </Beschriftung>

      <Kastenreihe
        eintraege={ANSTECKUNGSWEGE}
        y={oben}
        hoehe={kastenHoehe}
        breite={192}
      />

      {/* Der Kreis zurück zum Bankkanal – ohne ihn ist es eine Aufzählung. */}
      <path
        d={`M${528} ${oben + kastenHoehe + 6} q-100 44 -200 0`}
        fill="none"
        stroke={FARBEN.gefahr}
        strokeWidth={1.8}
        strokeDasharray="6 4"
      />
      <path d={`M${328} ${oben + kastenHoehe + 6} l10 8 l-10 4 Z`} fill={FARBEN.gefahr} />
      <Beschriftung
        x={428}
        y={oben + kastenHoehe + 46}
        anchor="middle"
        ton="gefahr"
        groesse={12}
      >
        ist dieser Kreis geschlossen, wird aus dem Kurssturz eine Krise
      </Beschriftung>

      <UmbrochenerText
        x={320}
        y={oben + kastenHoehe + 82}
        breite={608}
        text="1987 verlor der Markt an einem Tag rund ein Fünftel, ohne dass eine Rezession folgte. 2008 begann mit fallenden Immobilienpreisen und endete in einer weltweiten Wirtschaftskrise. Der Unterschied liegt an einer Stelle: ob das Bankensystem betroffen ist."
        ton="gedaempft"
      />
    </FigureSvg>
  )
}

// ------------------------------------------------------ Messgrößen der Geldpolitik

/**
 * Zwei der drei zentralen Bezugsgrößen kann niemand messen.
 *
 * Das ist keine Kritik an Notenbanken – sie sagen es selbst. Es ist der Grund,
 * warum Geldpolitik keine Steuerung nach Messwerten ist, sondern Navigation
 * mit unsicherer Position. Und es ist das beste Argument gegen die Gewissheit,
 * mit der über die richtige Zinshöhe gestritten wird.
 */
const MESSGROESSEN = [
  {
    titel: 'Inflation',
    text: 'Wird laufend erhoben und veröffentlicht',
    fuss: 'gemessen',
    farbe: FARBEN.marke,
  },
  {
    titel: 'Natürlicher Zins',
    text: 'Das Niveau, bei dem die Geldpolitik weder bremst noch stimuliert',
    fuss: 'nicht beobachtbar – nur geschätzt',
    farbe: FARBEN.gefahr,
  },
  {
    titel: 'Output-Lücke',
    text: 'Abstand zwischen tatsächlicher und möglicher Wirtschaftsleistung',
    fuss: 'nicht messbar – und oft revidiert',
    farbe: FARBEN.gefahr,
  },
] as const

export function NotenbankMessgroessen() {
  const hoehe = 288
  const oben = 58
  const kastenHoehe = 118

  return (
    <FigureSvg
      id="notenbank-messgroessen"
      viewBox={`0 0 640 ${hoehe}`}
      beschreibung={
        'Die drei Größen, aus denen sich der angemessene Leitzins ergeben soll. ' +
        reiheAlsText(MESSGROESSEN) +
        '. Zwei der drei sind damit keine Beobachtungen, sondern Schätzungen mit erheblicher Streuung und laufenden Revisionen. Geldpolitik ist deshalb keine Steuerung nach Messwerten, sondern Navigation mit unsicherer Position – Notenbanken sagen das inzwischen selbst. Für Anleger folgt daraus vor allem eines: Wer meint, die richtige Zinshöhe besser zu kennen als der Rat, überschätzt die Genauigkeit der verfügbaren Größen, und zwar aller verfügbaren, auch der eigenen.'
      }
    >
      <Beschriftung x={320} y={26} anchor="middle" ton="leise" groesse={12}>
        woran sich der angemessene Zins bemisst
      </Beschriftung>

      <Kastenreihe eintraege={MESSGROESSEN} y={oben} hoehe={kastenHoehe} breite={192} />

      <UmbrochenerText
        x={320}
        y={oben + kastenHoehe + 34}
        breite={608}
        text="Zwei der drei Größen, aus denen sich der angemessene Leitzins ergeben soll, sind Schätzungen mit erheblicher Streuung. Geldpolitik ist deshalb keine Steuerung nach Messwerten, sondern Navigation mit unsicherer Position – wer die richtige Zinshöhe besser zu kennen meint als der Rat, überschätzt die Genauigkeit aller verfügbaren Größen, auch der eigenen."
        ton="gedaempft"
      />
    </FigureSvg>
  )
}

// ------------------------------------------------------------- Parkplätze

/**
 * Vier Wege, Geld kurzfristig zu parken – nach dem Kriterium, das zählt.
 *
 * Der Text sagt es ausdrücklich: Das Auswahlkriterium ist nicht die Rendite.
 * Deshalb steht sie hier nicht. Was unterschieden wird, ist die Verfügbarkeit
 * und die Art des Schutzes – die beiden Größen, bei denen die Unterschiede
 * groß sind statt Bruchteile eines Prozentpunkts.
 */
const PARKPLAETZE = [
  {
    titel: 'Tagesgeld',
    text: 'täglich verfügbar',
    fuss: 'Einlagensicherung bis zur gesetzlichen Grenze',
    farbe: FARBEN.marke,
  },
  {
    titel: 'Festgeldleiter',
    text: 'in Stufen fällig',
    fuss: 'gesichert – der laufende Teil ist gebunden',
    farbe: FARBEN.akzent,
  },
  {
    titel: 'Geldmarkt-ETF',
    text: 'börsentäglich handelbar',
    fuss: 'kein Einlagenschutz, dafür Sondervermögen',
    farbe: FARBEN.warnung,
  },
  {
    titel: 'Kurze Anleihen',
    text: 'börsentäglich handelbar',
    fuss: 'Bonität des Staates statt einer Bank; Kursrisiko',
    farbe: FARBEN.warnung,
  },
] as const

export function TagesgeldParkplaetze() {
  const hoehe = 300
  const oben = 56
  const kastenHoehe = 130

  return (
    <FigureSvg
      id="tagesgeld-parkplaetze"
      viewBox={`0 0 640 ${hoehe}`}
      beschreibung={
        'Vier Wege, Geld kurzfristig zu parken, verglichen nach Verfügbarkeit und Art des Schutzes. ' +
        reiheAlsText(PARKPLAETZE) +
        '. Die Rendite steht bewusst nicht daran: Der Unterschied zwischen den vier Möglichkeiten beträgt einen Bruchteil eines Prozentpunkts, der Unterschied zwischen „am Tag X verfügbar“ und „nicht verfügbar“ kann teuer werden. Für kurzfristig gebundenes Geld entscheidet deshalb zuerst, wann es verfügbar sein muss, und erst danach, was es einbringt. Wer für den Notgroschen ein halbes Prozent mehr sucht, optimiert die kleinste Stellschraube im ganzen Portfolio.'
      }
    >
      <Beschriftung x={320} y={26} anchor="middle" ton="leise" groesse={12}>
        das Auswahlkriterium ist nicht die Rendite, sondern die Verfügbarkeit
      </Beschriftung>

      <Kastenreihe
        eintraege={PARKPLAETZE}
        y={oben}
        hoehe={kastenHoehe}
        breite={144}
        abstand={12}
      />

      <UmbrochenerText
        x={320}
        y={oben + kastenHoehe + 34}
        breite={608}
        text="Der Unterschied im Ertrag beträgt einen Bruchteil eines Prozentpunkts. Der Unterschied zwischen „am Tag X verfügbar“ und „nicht verfügbar“ kann teuer werden. Wer für den Notgroschen ein halbes Prozent mehr sucht, optimiert die kleinste Stellschraube im ganzen Portfolio."
        ton="gedaempft"
      />
    </FigureSvg>
  )
}

// ------------------------------------------------------------- Paritäten

/**
 * Drei Bedingungen, die alle dasselbe verbinden – mit sehr verschiedenem Rang.
 *
 * Die Reihenfolge ist die Aussage: Eine gilt immer, weil sie eine
 * Arbitragebedingung ist; eine gilt langfristig als Tendenz; und eine gilt
 * systematisch nicht. Genau aus der dritten entsteht der Carry-Trade.
 */
const PARITAETEN = [
  {
    titel: 'Gedeckte Zinsparität',
    text: 'Der Terminkurs entspricht der Zinsdifferenz',
    fuss: 'Arbitragebedingung, keine Theorie über Verhalten',
    farbe: FARBEN.marke,
  },
  {
    titel: 'Kaufkraftparität',
    text: 'Gleiche Güter kosten überall gleich viel',
    fuss: 'über Jahrzehnte eine Tendenz, über Jahre unbrauchbar',
    farbe: FARBEN.warnung,
  },
  {
    titel: 'Ungedeckte Zinsparität',
    text: 'Hochzinswährungen müssten entsprechend abwerten',
    fuss: 'empirisch widerlegt – daraus lebt der Carry-Trade',
    farbe: FARBEN.gefahr,
  },
] as const

export function WaehrungParitaeten() {
  const hoehe = 296
  const oben = 54
  const kastenHoehe = 132

  return (
    <FigureSvg
      id="waehrung-paritaeten"
      viewBox={`0 0 640 ${hoehe}`}
      beschreibung={
        'Die drei Paritätsbedingungen des Devisenmarkts, geordnet nach ihrem empirischen Rang – links gilt immer, rechts gilt systematisch nicht. ' +
        reiheAlsText(PARITAETEN) +
        '. Die Ordnung ist die Aussage: Die gedeckte Zinsparität ist keine Theorie über Verhalten, sondern eine Arbitragebedingung – gälte sie nicht, ließe sich risikolos Geld verdienen. Die Kaufkraftparität ist über Jahrzehnte eine Tendenz und über Jahre unbrauchbar. Die ungedeckte Zinsparität dagegen ist widerlegt: Hochzinswährungen werten im Mittel nicht so ab, wie sie es müsste, teils werten sie sogar auf. Genau darauf beruht der Carry-Trade, der über Monate und Jahre funktioniert und dann abrupt zusammenbricht. Sein Ertragsprofil ist dasselbe wie beim Verkauf von Volatilität: viele kleine Gewinne, selten ein sehr großer Verlust. Das ist vermutlich die beste Erklärung für das Puzzle – die Zinsdifferenz ist keine Anomalie, sondern die Vergütung für ein Risiko, das sich in ruhigen Phasen nicht zeigt.'
      }
    >
      <Beschriftung x={24} y={26} ton="leise" groesse={12}>
        gilt immer
      </Beschriftung>
      <Beschriftung x={616} y={26} anchor="end" ton="leise" groesse={12}>
        gilt systematisch nicht
      </Beschriftung>

      <Kastenreihe eintraege={PARITAETEN} y={oben} hoehe={kastenHoehe} breite={192} />

      <UmbrochenerText
        x={320}
        y={oben + kastenHoehe + 34}
        breite={608}
        text="Hochzinswährungen werten im Mittel nicht so ab, wie die Theorie verlangt – teils werten sie auf. Der Carry-Trade lebt davon, funktioniert über Jahre und bricht dann abrupt zusammen. Die Zinsdifferenz ist deshalb vermutlich keine Anomalie, sondern die Vergütung für ein Risiko, das sich in ruhigen Phasen nicht zeigt."
        ton="gedaempft"
      />
    </FigureSvg>
  )
}

// ---------------------------------------------------------- Kostenebenen

/**
 * Vier Ebenen, und die teuerste ist die unsichtbarste.
 *
 * Die Reihenfolge im Bild ist die der Sichtbarkeit, nicht die der Höhe – und
 * genau darin liegt die Aussage. Wer auf die Ordergebühr schaut, sieht die
 * Ebene mit dem kleinsten Betrag und dem größten Aufhebens.
 */
const KOSTENEBENEN = [
  {
    titel: 'Depotebene',
    text: 'Depotgebühr, Ordergebühren, Handelsplatzentgelt, Spread',
    fuss: 'steht auf der Abrechnung',
    farbe: FARBEN.marke,
  },
  {
    titel: 'Produktebene',
    text: 'laufende Kosten, Handel im Fonds, Erfolgsvergütung',
    fuss: 'wird täglich aus dem Fondsvermögen entnommen',
    farbe: FARBEN.akzent,
  },
  {
    titel: 'Steuerebene',
    text: 'Abgeltungsteuer, Vorabpauschale, verlorene Quellensteuer',
    fuss: 'fällt erst beim Abrechnen auf',
    farbe: FARBEN.warnung,
  },
  {
    titel: 'Beratungsebene',
    text: 'Ausgabeaufschlag, Bestandsprovision, Verwaltungsgebühr',
    fuss: 'die teuerste – und die am schlechtesten sichtbare',
    farbe: FARBEN.gefahr,
  },
] as const

export function KostenEbenen() {
  const hoehe = 316
  const oben = 56
  const kastenHoehe = 146

  return (
    <FigureSvg
      id="kosten-ebenen"
      viewBox={`0 0 640 ${hoehe}`}
      beschreibung={
        'Die vier Ebenen, auf denen bei einer Geldanlage Kosten anfallen, geordnet nach ihrer Sichtbarkeit. ' +
        reiheAlsText(KOSTENEBENEN) +
        '. Die Reihenfolge ist die der Sichtbarkeit und nicht die der Höhe – darin liegt die Aussage. Vollständig ist eine Kostenbetrachtung erst, wenn alle vier zusammengezählt sind. Die meisten schauen auf die erste Ebene, weil sie auf der Abrechnung steht, und übersehen die anderen drei. Ausgerechnet die letzte ist regelmäßig die teuerste.'
      }
    >
      <Beschriftung x={24} y={26} ton="leise" groesse={12}>
        gut sichtbar
      </Beschriftung>
      <Beschriftung x={616} y={26} anchor="end" ton="leise" groesse={12}>
        kaum sichtbar
      </Beschriftung>

      <Kastenreihe
        eintraege={KOSTENEBENEN}
        y={oben}
        hoehe={kastenHoehe}
        breite={144}
        abstand={12}
      />

      <UmbrochenerText
        x={320}
        y={oben + kastenHoehe + 34}
        breite={608}
        text="Die Reihenfolge ist die der Sichtbarkeit, nicht die der Höhe – und darin liegt die Aussage. Vollständig ist eine Kostenbetrachtung erst, wenn alle vier zusammengezählt sind. Wer nur auf die Ordergebühr schaut, betrachtet die Ebene mit dem kleinsten Betrag und dem größten Aufhebens."
        ton="gedaempft"
      />
    </FigureSvg>
  )
}

// ------------------------------------------------------ Bewertung ohne Anker

/**
 * Warum jede Bewertung eines Kryptowerts an derselben Stelle scheitert.
 *
 * Links das Verfahren, das für Aktien, Anleihen und Immobilien funktioniert;
 * rechts die drei Ersatzansätze und woran jeder scheitert. Die Gegenüber-
 * stellung ist nötig, weil der Unterschied regelmäßig verwischt wird: Das
 * Verfahren ist hier nicht ungenau, sondern nicht anwendbar.
 */
const ERSATZANSAETZE = [
  {
    titel: 'Netzwerkgröße',
    text: 'Der Wert wächst mit der Zahl der Nutzer',
    fuss: 'bei pseudonymen Adressen nicht messbar',
    farbe: FARBEN.gefahr,
  },
  {
    titel: 'Erzeugungskosten',
    text: 'Der Preis kann nicht unter die Miningkosten fallen',
    fuss: 'die Kausalität läuft umgekehrt',
    farbe: FARBEN.gefahr,
  },
  {
    titel: 'Knappheit',
    text: 'Bestand geteilt durch jährlichen Zuwachs',
    fuss: 'ein Angebotsmaß ohne Aussage über Nachfrage',
    farbe: FARBEN.gefahr,
  },
] as const

export function KryptoBewertung() {
  // Drei Zeilen Fußtext unter der Kastenreihe, samt Unterlängen.
  const hoehe = 350
  const oben = 52
  const obenHoehe = 76

  return (
    <FigureSvg
      id="krypto-bewertung"
      viewBox={`0 0 640 ${hoehe}`}
      beschreibung={
        'Oben das übliche Bewertungsverfahren: künftige Zahlungen schätzen und abzinsen – so werden Aktien, Anleihen und Immobilien bewertet. Bei einem Kryptowert gibt es keine künftigen Zahlungen; das Verfahren ist damit nicht ungenau, sondern nicht anwendbar. Darunter die drei üblichen Ersatzansätze und woran jeder scheitert. ' +
        reiheAlsText(ERSATZANSAETZE) +
        '. Bei den Erzeugungskosten läuft die Kausalität umgekehrt: Der Aufwand richtet sich nach dem Preis, nicht der Preis nach dem Aufwand. Die Knappheitsverhältnisse sind ein reines Angebotsmaß ohne jede Aussage über die Nachfrage; Prognosen auf dieser Grundlage sind mehrfach deutlich verfehlt worden. Ehrlicher ist die Feststellung, dass hier ein Preis ohne Bewertungsanker existiert. Das macht die Anlage nicht illegitim – Gold hat dasselbe Problem und wird seit Jahrtausenden gehalten. Es macht nur jede Aussage der Form „fair bewertet“ oder „unterbewertet“ gegenstandslos.'
      }
    >
      <Beschriftung x={320} y={26} anchor="middle" ton="leise" groesse={12}>
        nicht ungenau – nicht anwendbar
      </Beschriftung>

      <Feld x={24} y={oben} breite={592} hoehe={obenHoehe} farbe={FARBEN.marke}>
        <Beschriftung
          x={320}
          y={oben + 26}
          anchor="middle"
          ton="stark"
          gewicht="kraeftig"
        >
          Das übliche Verfahren
        </Beschriftung>
        <UmbrochenerText
          x={320}
          y={oben + 48}
          breite={560}
          text="Künftige Zahlungen schätzen und abzinsen – so werden Aktien, Anleihen und Immobilien bewertet. Bei einem Kryptowert gibt es keine künftigen Zahlungen."
          ton="gedaempft"
          groesse={12}
        />
      </Feld>

      <Kastenreihe
        eintraege={ERSATZANSAETZE}
        y={oben + obenHoehe + 20}
        hoehe={124}
        breite={192}
      />

      <UmbrochenerText
        x={320}
        y={oben + obenHoehe + 168}
        breite={608}
        text="Ehrlicher ist die Feststellung, dass hier ein Preis ohne Bewertungsanker existiert. Das macht die Anlage nicht illegitim – Gold hat dasselbe Problem und wird seit Jahrtausenden gehalten. Es macht nur jede Aussage der Form „fair bewertet“ oder „unterbewertet“ gegenstandslos."
        ton="gedaempft"
      />
    </FigureSvg>
  )
}
