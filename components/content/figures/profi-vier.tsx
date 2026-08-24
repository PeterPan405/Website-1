import {
  AblaufKette,
  FARBEN,
  Feld,
  UmbrochenerText,
} from '@/components/content/figures/Diagramme'
import {
  ANSTECKUNGSWEGE,
  BEWERTUNGSSTUFEN,
  ERSATZANSAETZE,
  KOSTENEBENEN,
  MESSGROESSEN,
  PARITAETEN,
  PARKPLAETZE,
  type Kasten,
} from '@/components/content/figures/kastenreihen'
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
    />
  )
}

// ------------------------------------------------------- Die Bewertungsstufen

export function FondsBewertungsstufen() {
  const hoehe = 292
  const kastenHoehe = 116

  return (
    <FigureSvg id="fonds-bewertungsstufen" viewBox={`0 0 640 ${hoehe}`}>
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

export function CrashesAnsteckung() {
  const hoehe = 320
  const oben = 56
  const kastenHoehe = 122

  return (
    <FigureSvg id="crashes-ansteckung" viewBox={`0 0 640 ${hoehe}`}>
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

export function NotenbankMessgroessen() {
  const hoehe = 288
  const oben = 58
  const kastenHoehe = 118

  return (
    <FigureSvg id="notenbank-messgroessen" viewBox={`0 0 640 ${hoehe}`}>
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

export function TagesgeldParkplaetze() {
  const hoehe = 300
  const oben = 56
  const kastenHoehe = 130

  return (
    <FigureSvg id="tagesgeld-parkplaetze" viewBox={`0 0 640 ${hoehe}`}>
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

export function WaehrungParitaeten() {
  const hoehe = 296
  const oben = 54
  const kastenHoehe = 132

  return (
    <FigureSvg id="waehrung-paritaeten" viewBox={`0 0 640 ${hoehe}`}>
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

export function KostenEbenen() {
  const hoehe = 316
  const oben = 56
  const kastenHoehe = 146

  return (
    <FigureSvg id="kosten-ebenen" viewBox={`0 0 640 ${hoehe}`}>
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

export function KryptoBewertung() {
  // Drei Zeilen Fußtext unter der Kastenreihe, samt Unterlängen.
  const hoehe = 350
  const oben = 52
  const obenHoehe = 76

  return (
    <FigureSvg id="krypto-bewertung" viewBox={`0 0 640 ${hoehe}`}>
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
