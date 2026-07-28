import { FARBEN, Feld, UmbrochenerText } from '@/components/content/figures/Diagramme'
import { Beschriftung, FigureSvg } from '@/components/content/figures/Rahmen'

/**
 * Grafiken für die Profi-Stufen, die einen Aufbau zeigen statt einer Größe.
 *
 * Vier Konstruktionen, bei denen die Frage nicht lautet „wie viel“, sondern
 * „wer steht wo“: Wer bezahlt eine kostenlose Order, was liegt in einem
 * synthetischen Fonds, wohin fließt die Verwaltungsvergütung, und warum
 * lassen sich zwei Verluste nicht gegeneinander stellen. In allen vier Fällen
 * ist die Antwort ein Bild und keine Zahl – und in allen vier Fällen wird sie
 * regelmäßig falsch geraten.
 */

/** Ein Pfeil von einem Punkt zum anderen, mit Beschriftung an der Mitte. */
function Pfeil({
  von,
  bis,
  text,
  farbe = FARBEN.ruhig,
  textOben = true,
}: {
  von: { x: number; y: number }
  bis: { x: number; y: number }
  text?: string
  farbe?: string
  textOben?: boolean
}) {
  const dx = bis.x - von.x
  const dy = bis.y - von.y
  const laenge = Math.hypot(dx, dy) || 1
  const spitze = { x: bis.x, y: bis.y }
  const dreh = (Math.atan2(dy, dx) * 180) / Math.PI

  return (
    <g>
      <line
        x1={von.x}
        y1={von.y}
        x2={bis.x - (dx / laenge) * 8}
        y2={bis.y - (dy / laenge) * 8}
        stroke={farbe}
        strokeWidth={1.8}
      />
      <path
        d={`M${spitze.x} ${spitze.y} l-9 -5 v10 Z`}
        fill={farbe}
        transform={`rotate(${dreh} ${spitze.x} ${spitze.y})`}
      />
      {text && (
        <Beschriftung
          x={(von.x + bis.x) / 2}
          y={(von.y + bis.y) / 2 + (textOben ? -8 : 16)}
          anchor="middle"
          ton="leise"
          groesse={11.5}
        >
          {text}
        </Beschriftung>
      )}
    </g>
  )
}

// ------------------------------------------------------ Payment for Order Flow

/**
 * Wer eine kostenlose Order bezahlt.
 *
 * Der Kreis ist die Aussage: Das Geld, das der Broker nicht von dir nimmt,
 * kommt von einem Handelsplatz, und der verdient es am Spread – also wieder
 * an dir. Kein Vorwurf, sondern ein Geschäftsmodell; man sollte es nur kennen,
 * bevor man „kostenlos“ für kostenlos hält.
 */
export function BrokerOrderflow() {
  // Zwei Zeilen Fußtext unter dem Spread-Kasten, samt Unterlängen.
  const hoehe = 306
  const kasten = { breite: 176, hoehe: 68 }
  const oben = 52
  const unten = 176
  const links = 24
  const mitte = 232
  const rechts = 440

  const feld = (x: number, y: number) => ({
    x: x + kasten.breite / 2,
    y: y + kasten.hoehe / 2,
  })

  return (
    <FigureSvg id="broker-orderflow" viewBox={`0 0 640 ${hoehe}`}>
      <Beschriftung x={320} y={24} anchor="middle" ton="leise" groesse={12}>
        was „kostenlos“ tatsächlich heißt
      </Beschriftung>

      <Feld
        x={links}
        y={oben}
        breite={kasten.breite}
        hoehe={kasten.hoehe}
        farbe={FARBEN.marke}
      >
        <Beschriftung
          x={links + kasten.breite / 2}
          y={oben + 28}
          anchor="middle"
          ton="stark"
          gewicht="kraeftig"
        >
          Du
        </Beschriftung>
        <Beschriftung
          x={links + kasten.breite / 2}
          y={oben + 48}
          anchor="middle"
          ton="leise"
          groesse={11.5}
        >
          zahlst keine Ordergebühr
        </Beschriftung>
      </Feld>

      <Feld
        x={mitte}
        y={oben}
        breite={kasten.breite}
        hoehe={kasten.hoehe}
        farbe={FARBEN.ruhig}
      >
        <Beschriftung
          x={mitte + kasten.breite / 2}
          y={oben + 28}
          anchor="middle"
          ton="stark"
          gewicht="kraeftig"
        >
          Broker
        </Beschriftung>
        <Beschriftung
          x={mitte + kasten.breite / 2}
          y={oben + 48}
          anchor="middle"
          ton="leise"
          groesse={11.5}
        >
          leitet die Order weiter
        </Beschriftung>
      </Feld>

      <Feld
        x={rechts}
        y={oben}
        breite={kasten.breite}
        hoehe={kasten.hoehe}
        farbe={FARBEN.warnung}
      >
        <Beschriftung
          x={rechts + kasten.breite / 2}
          y={oben + 28}
          anchor="middle"
          ton="stark"
          gewicht="kraeftig"
        >
          Handelsplatz
        </Beschriftung>
        <Beschriftung
          x={rechts + kasten.breite / 2}
          y={oben + 48}
          anchor="middle"
          ton="leise"
          groesse={11.5}
        >
          führt sie aus
        </Beschriftung>
      </Feld>

      {/* Ohne Beschriftung: Zwischen den Kästen liegen 32 Pixel, und ein
          zentrierter Text ragt dort auf beiden Seiten in die Kästen hinein. */}
      <Pfeil
        von={{ x: links + kasten.breite + 4, y: oben + 34 }}
        bis={{ x: mitte - 4, y: oben + 34 }}
      />
      <Pfeil
        von={{ x: mitte + kasten.breite + 4, y: oben + 34 }}
        bis={{ x: rechts - 4, y: oben + 34 }}
      />

      {/* Der Rückweg: die Vergütung an den Broker und der Spread von dir. */}
      <Pfeil
        von={feld(rechts, oben)}
        bis={{ x: mitte + kasten.breite / 2, y: unten + 20 }}
        farbe={FARBEN.warnung}
      />
      <Beschriftung x={430} y={unten + 4} anchor="middle" ton="leise" groesse={11.5}>
        Vergütung für die Weiterleitung
      </Beschriftung>

      <Feld
        x={mitte - 60}
        y={unten + 24}
        breite={kasten.breite + 120}
        hoehe={54}
        farbe={FARBEN.gefahr}
      >
        <Beschriftung
          x={mitte + kasten.breite / 2}
          y={unten + 48}
          anchor="middle"
          ton="gefahr"
          gewicht="kraeftig"
          groesse={13}
        >
          bezahlt wird sie aus dem Spread
        </Beschriftung>
        <Beschriftung
          x={mitte + kasten.breite / 2}
          y={unten + 66}
          anchor="middle"
          ton="leise"
          groesse={11.5}
        >
          also aus deinem Ausführungskurs
        </Beschriftung>
      </Feld>

      <UmbrochenerText
        x={320}
        y={278}
        breite={608}
        text="Nicht automatisch nachteilig: Bei kleinen Orders ist die gesparte Gebühr oft mehr wert als ein etwas besserer Kurs. Bei großen kehrt sich das um."
        ton="gedaempft"
      />
    </FigureSvg>
  )
}

// ------------------------------------------------------------ Swap-ETF

/**
 * Was in einem synthetischen Fonds tatsächlich liegt.
 *
 * Die verbreitete Sorge lautet, ein Swap-ETF halte „nichts“. Er hält ein
 * Trägerportfolio – nur eben nicht die Indexwerte. Geliefert wird die
 * Indexrendite über ein Tauschgeschäft, und genau daran hängt das
 * Gegenparteirisiko, das die Richtlinie auf zehn Prozent des Fondsvermögens
 * begrenzt.
 */
export function EtfSwap() {
  // Zwei Zeilen Fußtext unter dem Risikokasten, samt Unterlängen.
  const hoehe = 316
  const spalte = 250
  const links = 26
  const rechts = 640 - links - spalte
  const oben = 54
  const kastenHoehe = 132

  return (
    <FigureSvg id="etf-swap" viewBox={`0 0 640 ${hoehe}`}>
      <Beschriftung x={320} y={26} anchor="middle" ton="leise" groesse={12}>
        ein synthetischer Fonds hält nicht nichts – er hält etwas anderes
      </Beschriftung>

      <Feld x={links} y={oben} breite={spalte} hoehe={kastenHoehe} farbe={FARBEN.marke}>
        <Beschriftung
          x={links + spalte / 2}
          y={oben + 26}
          anchor="middle"
          ton="stark"
          gewicht="kraeftig"
        >
          Der Fonds
        </Beschriftung>
        <UmbrochenerText
          x={links + spalte / 2}
          y={oben + 50}
          breite={spalte - 24}
          text="hält ein Trägerportfolio aus liquiden Wertpapieren – nicht die Werte des Index"
          ton="gedaempft"
          groesse={12}
        />
        <UmbrochenerText
          x={links + spalte / 2}
          y={oben + 100}
          breite={spalte - 24}
          text="Sondervermögen, wie jeder Fonds"
          ton="leise"
          groesse={11.5}
        />
      </Feld>

      <Feld
        x={rechts}
        y={oben}
        breite={spalte}
        hoehe={kastenHoehe}
        farbe={FARBEN.warnung}
      >
        <Beschriftung
          x={rechts + spalte / 2}
          y={oben + 26}
          anchor="middle"
          ton="stark"
          gewicht="kraeftig"
        >
          Der Swap-Partner
        </Beschriftung>
        <UmbrochenerText
          x={rechts + spalte / 2}
          y={oben + 50}
          breite={spalte - 24}
          text="liefert die Wertentwicklung des Index und bekommt die des Trägerportfolios"
          ton="gedaempft"
          groesse={12}
        />
        <UmbrochenerText
          x={rechts + spalte / 2}
          y={oben + 100}
          breite={spalte - 24}
          text="eine Bank – kein Sondervermögen"
          ton="leise"
          groesse={11.5}
        />
      </Feld>

      <Pfeil
        von={{ x: links + spalte + 4, y: oben + 52 }}
        bis={{ x: rechts - 4, y: oben + 52 }}
        text="Rendite des Trägerportfolios"
      />
      <Pfeil
        von={{ x: rechts - 4, y: oben + 88 }}
        bis={{ x: links + spalte + 4, y: oben + 88 }}
        text="Rendite des Index"
        textOben={false}
      />

      <Feld
        x={links}
        y={oben + kastenHoehe + 22}
        breite={640 - 2 * links}
        hoehe={56}
        farbe={FARBEN.gefahr}
      >
        <Beschriftung
          x={320}
          y={oben + kastenHoehe + 44}
          anchor="middle"
          ton="gefahr"
          gewicht="kraeftig"
          groesse={13}
        >
          Das Risiko sitzt zwischen den beiden Kästen
        </Beschriftung>
        <Beschriftung
          x={320}
          y={oben + kastenHoehe + 64}
          anchor="middle"
          ton="leise"
          groesse={11.5}
        >
          gesetzlich auf 10 % des Fondsvermögens begrenzt, in der Praxis durch
          Sicherheiten und tägliches Zurücksetzen weit darunter
        </Beschriftung>
      </Feld>

      <UmbrochenerText
        x={320}
        y={288}
        breite={608}
        text="Entscheidend ist die Qualität der Sicherheiten – Staatsanleihen bester Bonität sind etwas anderes als Aktien zweiter Reihe. Sie steht im Jahresbericht."
        ton="gedaempft"
      />
    </FigureSvg>
  )
}

// ------------------------------------------------------- Bestandsprovision

/**
 * Wohin die Verwaltungsvergütung tatsächlich fließt.
 *
 * Der Satz „die Beratung ist kostenlos“ ist in dieser Konstruktion wörtlich
 * richtig und wirtschaftlich falsch. Bezahlt wird sie – jedes Jahr, aus dem
 * Fondsvermögen, in einer Höhe, die auf keiner Rechnung erscheint und
 * regelmäßig die Hälfte der Verwaltungsvergütung ausmacht.
 */
export function KostenBestandsprovision() {
  // Drei Zeilen Fußtext unter dem unteren Kasten.
  const hoehe = 316
  const kasten = { breite: 178, hoehe: 66 }
  const reiheOben = 56
  const reiheUnten = 176
  const links = 30
  const mitte = (640 - kasten.breite) / 2
  const rechts = 640 - links - kasten.breite

  return (
    <FigureSvg id="kosten-bestandsprovision" viewBox={`0 0 640 ${hoehe}`}>
      <Beschriftung x={320} y={26} anchor="middle" ton="leise" groesse={12}>
        warum die Empfehlung erwartbar ist
      </Beschriftung>

      {[
        {
          x: links,
          y: reiheOben,
          titel: 'Dein Depot',
          text: 'zahlt die laufende Vergütung',
          farbe: FARBEN.marke,
        },
        {
          x: mitte,
          y: reiheOben,
          titel: 'Fondsgesellschaft',
          text: 'verwaltet den Fonds',
          farbe: FARBEN.ruhig,
        },
        {
          x: rechts,
          y: reiheUnten,
          titel: 'Bank oder Vermittler',
          text: 'hat den Fonds verkauft',
          farbe: FARBEN.gefahr,
        },
      ].map((eintrag) => (
        <Feld
          key={eintrag.titel}
          x={eintrag.x}
          y={eintrag.y}
          breite={kasten.breite}
          hoehe={kasten.hoehe}
          farbe={eintrag.farbe}
        >
          <Beschriftung
            x={eintrag.x + kasten.breite / 2}
            y={eintrag.y + 26}
            anchor="middle"
            ton="stark"
            gewicht="kraeftig"
          >
            {eintrag.titel}
          </Beschriftung>
          <Beschriftung
            x={eintrag.x + kasten.breite / 2}
            y={eintrag.y + 46}
            anchor="middle"
            ton="leise"
            groesse={11.5}
          >
            {eintrag.text}
          </Beschriftung>
        </Feld>
      ))}

      <Pfeil
        von={{ x: links + kasten.breite + 4, y: reiheOben + 33 }}
        bis={{ x: mitte - 4, y: reiheOben + 33 }}
        text="jedes Jahr"
      />
      <Pfeil
        von={{ x: mitte + kasten.breite / 2, y: reiheOben + kasten.hoehe + 4 }}
        bis={{ x: rechts + kasten.breite / 2 - 20, y: reiheUnten - 4 }}
        farbe={FARBEN.gefahr}
      />
      {/* Links vom Pfeil und unterhalb der oberen Kastenreihe – auf der
          Pfeilmitte lag der Text quer auf der Linie. */}
      <Beschriftung x={links + 12} y={reiheUnten + 16} ton="gefahr" groesse={12}>
        Bestandsprovision – oft die Hälfte davon
      </Beschriftung>

      <UmbrochenerText
        x={320}
        y={266}
        breite={608}
        text="Ein Berater, der davon lebt, verdient an einem Fonds mit 1,5 Prozent Kosten jährlich und an einem Indexfonds mit 0,15 Prozent praktisch nichts. Das macht ihn nicht unehrlich – es macht seine Empfehlung erwartbar. Seit MiFID II steht der Betrag in der jährlichen Kosteninformation."
        ton="gedaempft"
      />
    </FigureSvg>
  )
}

// ------------------------------------------------------------ Verlusttöpfe

/**
 * Warum ein Aktienverlust einen Fondsgewinn nicht ausgleicht.
 *
 * Die Trennwand ist die Aussage. Sie steht in der Tabelle des Themas als
 * Spalte „verrechenbar mit“, und wer sie überliest, hält die beiden Töpfe für
 * eine Buchhaltungsformalie. Sie ist die folgenreichste Einzelheit des
 * deutschen Kapitalertragsteuerrechts.
 */
export function SparerVerlusttoepfe() {
  const hoehe = 300
  const spalte = 272
  const links = 24
  const rechts = 640 - links - spalte
  const oben = 52
  const kastenHoehe = 158

  const toepfe = [
    {
      x: links,
      titel: 'Aktienverlusttopf',
      enthaelt: 'Verluste aus dem Verkauf einzelner Aktien',
      gegen: 'nur gegen Gewinne aus dem Verkauf einzelner Aktien',
      nicht: 'nicht gegen Dividenden, nicht gegen Fondsgewinne',
      farbe: FARBEN.gefahr,
    },
    {
      x: rechts,
      titel: 'Allgemeiner Topf',
      enthaelt: 'Verluste aus Fonds, ETFs, Anleihen, Zertifikaten',
      gegen: 'gegen alle übrigen Kapitalerträge',
      nicht: 'einschließlich Zinsen und Dividenden',
      farbe: FARBEN.marke,
    },
  ]

  return (
    <FigureSvg id="sparer-verlusttoepfe" viewBox={`0 0 640 ${hoehe}`}>
      <Beschriftung x={320} y={26} anchor="middle" ton="leise" groesse={12}>
        zwei Töpfe, keine Verbindung
      </Beschriftung>

      {toepfe.map((topf) => (
        <Feld
          key={topf.titel}
          x={topf.x}
          y={oben}
          breite={spalte}
          hoehe={kastenHoehe}
          farbe={topf.farbe}
        >
          <Beschriftung
            x={topf.x + spalte / 2}
            y={oben + 26}
            anchor="middle"
            ton="stark"
            gewicht="kraeftig"
          >
            {topf.titel}
          </Beschriftung>
          <UmbrochenerText
            x={topf.x + spalte / 2}
            y={oben + 50}
            breite={spalte - 24}
            text={topf.enthaelt}
            ton="gedaempft"
            groesse={12}
          />
          <UmbrochenerText
            x={topf.x + spalte / 2}
            y={oben + 96}
            breite={spalte - 24}
            text={topf.gegen}
            ton="leise"
            groesse={11.5}
          />
          <UmbrochenerText
            x={topf.x + spalte / 2}
            y={oben + 130}
            breite={spalte - 24}
            text={topf.nicht}
            ton="leise"
            groesse={11.5}
          />
        </Feld>
      ))}

      {/* Die Wand zwischen den Töpfen – der ganze Inhalt der Grafik. */}
      <line
        x1={320}
        y1={oben - 8}
        x2={320}
        y2={oben + kastenHoehe + 8}
        stroke={FARBEN.gefahr}
        strokeWidth={3}
      />
      <Beschriftung
        x={320}
        y={oben + kastenHoehe + 28}
        anchor="middle"
        ton="gefahr"
        gewicht="kraeftig"
        groesse={12.5}
      >
        kein Übergang
      </Beschriftung>

      <UmbrochenerText
        x={320}
        y={oben + kastenHoehe + 54}
        breite={608}
        text="Wer mit Einzelaktien Verluste macht und mit ETFs Gewinne, kann beides nicht gegeneinander stellen: Der Aktienverlust bleibt liegen, der ETF-Gewinn wird versteuert. Vorgetragen wird er unbegrenzt – aber immer nur in seinen eigenen Topf."
        ton="gedaempft"
      />
    </FigureSvg>
  )
}
