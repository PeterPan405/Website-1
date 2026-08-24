import {
  BalkenDiagramm,
  FARBEN,
  Feld,
  SaeulenDiagramm,
  UmbrochenerText,
} from '@/components/content/figures/Diagramme'
import { BUNDESPAPIERE } from '@/components/content/figures/kastenreihen'
import { Beschriftung, FigureSvg } from '@/components/content/figures/Rahmen'
import { calculateBudget } from '@/lib/finance'
import { formatCurrencyRounded, formatPercent } from '@/lib/format'
import {
  haushaltAusgaben,
  haushaltEinnahmen,
  portfolioDepotwert,
  portfolioMarktrueckgang,
  portfolioQuoten,
} from '@/lib/lernszenarien'

/**
 * Grafiken für die Beginner-Stufen.
 *
 * Hier gilt eine andere Messlatte als weiter oben: Wer eine Einstiegsstufe
 * liest, hat die Begriffe noch nicht. Eine Grafik muss deshalb ohne die
 * Tabelle daneben verständlich sein und darf keine Kenntnis voraussetzen, die
 * erst zwei Stufen später kommt.
 */

// -------------------------------------------------------- Wohin das Geld geht

/**
 * Ein Haushalt, nach Größe der Posten sortiert.
 *
 * ## Warum sortiert und nicht in der Reihenfolge des Kontoauszugs
 *
 * Weil die Reihenfolge die Aussage ist. Wer Ausgaben senken will, fängt oben
 * an – und oben steht bei fast jedem Haushalt dasselbe: Wohnen. Die drei
 * größten Posten machen regelmäßig mehr aus als alle übrigen zusammen, und
 * genau das geht unter, wenn die Liste nach Fälligkeit sortiert ist.
 *
 * Gerechnet wird mit `calculateBudget` – derselben Funktion wie im
 * Haushaltsrechner der Website. Käme der Text zu anderen Zahlen als der
 * Rechner drei Klicks weiter, wäre das der peinlichste Fehler, den dieses
 * Thema haben kann.
 */
export function BudgetHaushalt() {
  const haushalt = calculateBudget([...haushaltEinnahmen], [...haushaltAusgaben])

  const sortiert = [...haushaltAusgaben].sort((a, b) => b.amount - a.amount)

  const balken = [
    ...sortiert.map((posten) => ({
      label: posten.label,
      wert: posten.amount,
      wertText: formatCurrencyRounded(posten.amount),
      farbe: FARBEN.ruhig,
    })),
    {
      label: 'bleibt übrig',
      wert: Math.max(haushalt.balance, 0),
      wertText: formatCurrencyRounded(haushalt.balance),
      farbe: FARBEN.marke,
    },
  ]

  return <BalkenDiagramm id="budget-haushalt" balken={balken} labelBreite={186} />
}

// ------------------------------------------ Depot und Verrechnungskonto

/**
 * Warum das eine kein Bankkonto ist und das andere schon.
 *
 * Das ist die wichtigste Unterscheidung der Einstiegsstufe und wird
 * regelmäßig verwechselt – meist in die beruhigende Richtung: Leute halten
 * ihre Wertpapiere für „bis 100.000 Euro gesichert“ und wissen nicht, dass
 * sie diesen Schutz gar nicht brauchen.
 */
export function DepotUndKonto() {
  const hoehe = 264
  const spalte = 288
  const links = 16
  const rechts = 640 - links - spalte

  return (
    <FigureSvg id="depot-und-konto" viewBox={`0 0 640 ${hoehe}`}>
      <Beschriftung x={320} y={20} anchor="middle" ton="leise" groesse={12}>
        zwei Dinge, ein Vertrag – und zwei völlig verschiedene Rechtslagen
      </Beschriftung>

      <Feld x={links} y={32} breite={spalte} hoehe={182} farbe={FARBEN.marke}>
        <Beschriftung
          x={links + spalte / 2}
          y={58}
          anchor="middle"
          ton="stark"
          gewicht="kraeftig"
        >
          Depot: deine Wertpapiere
        </Beschriftung>
        <UmbrochenerText
          x={links + spalte / 2}
          y={82}
          breite={spalte - 28}
          text="Sie gehören dir. Die Bank verwahrt sie nur und führt sie getrennt von ihrem eigenen Vermögen."
          ton="gedaempft"
        />
        <UmbrochenerText
          x={links + spalte / 2}
          y={148}
          breite={spalte - 28}
          text="Bei einer Pleite fallen sie nicht in die Masse. Du kannst Herausgabe verlangen oder das Depot übertragen."
          ton="leise"
        />
      </Feld>

      <Feld x={rechts} y={32} breite={spalte} hoehe={182} farbe={FARBEN.warnung}>
        <Beschriftung
          x={rechts + spalte / 2}
          y={58}
          anchor="middle"
          ton="stark"
          gewicht="kraeftig"
        >
          Verrechnungskonto: Guthaben
        </Beschriftung>
        <UmbrochenerText
          x={rechts + spalte / 2}
          y={82}
          breite={spalte - 28}
          text="Das Geld gehört der Bank. Sie schuldet es dir – das ist ein Anspruch, kein Eigentum."
          ton="gedaempft"
        />
        <UmbrochenerText
          x={rechts + spalte / 2}
          y={148}
          breite={spalte - 28}
          text="Hier greift die Einlagensicherung. Sie ist nötig, weil ohne sie nur die Insolvenzquote bliebe."
          ton="leise"
        />
      </Feld>

      <UmbrochenerText
        x={320}
        y={238}
        breite={600}
        text="Die Einlagensicherung schützt also genau das, was du nicht besitzt – und wird ausgerechnet für das gesucht, was dir ohnehin gehört."
        ton="gedaempft"
      />
    </FigureSvg>
  )
}

// ------------------------------------------------ Bundeswertpapiere nach Laufzeit

export function StaatsanleiheLaufzeiten() {
  /*
    Die Höhe hat Platz für zwei Zeilen Fußtext.

    Bei 210 ragte die zweite Zeile zweieinhalb Pixel heraus und wurde
    abgeschnitten – SVG bricht nicht um, es schneidet ab. Aufgefallen ist es
    nur, weil die Prüfung jede Textkoordinate gegen die viewBox hält.
  */
  const hoehe = 238
  const links = 58
  const breite = 640 - links - 24
  const achse = 150

  /*
    Die Achse ist logarithmisch.

    Linear aufgetragen klebten vier der fünf Papiere im ersten Sechstel, weil
    die dreißigjährige alles andere zusammendrückt. Gerade bei den kurzen
    Laufzeiten liegt aber der Unterschied, um den es geht: Ein Jahr und zwei
    Jahre verhalten sich völlig verschieden.
  */
  const x = (jahre: number) => links + (Math.log(jahre) / Math.log(30)) * breite

  return (
    <FigureSvg id="staatsanleihe-laufzeiten" viewBox={`0 0 640 ${hoehe}`}>
      <Beschriftung x={links - 6} y={30} ton="leise" groesse={12}>
        kurz – folgt der Notenbank
      </Beschriftung>
      <Beschriftung x={links + breite} y={30} anchor="end" ton="leise" groesse={12}>
        lang – schwankt am stärksten
      </Beschriftung>

      <line
        x1={links}
        y1={achse}
        x2={links + breite}
        y2={achse}
        stroke={FARBEN.raster}
        strokeWidth={1.5}
      />

      {BUNDESPAPIERE.map((papier, index) => {
        const px = x(papier.jahre)
        // Abwechselnd über und unter der Achse, sonst überlappen die Namen.
        const oben = index % 2 === 0
        return (
          <g key={papier.name}>
            <line
              x1={px}
              y1={achse - 7}
              x2={px}
              y2={achse + 7}
              stroke={FARBEN.marke}
              strokeWidth={2}
            />
            <circle cx={px} cy={achse} r={4.5} fill={FARBEN.marke} />
            <Beschriftung
              x={px}
              y={oben ? achse - 34 : achse + 30}
              anchor="middle"
              ton="stark"
              gewicht="kraeftig"
            >
              {papier.name}
            </Beschriftung>
            <Beschriftung
              x={px}
              y={oben ? achse - 18 : achse + 46}
              anchor="middle"
              ton="leise"
              groesse={12}
            >
              {papier.jahre === 1 ? 'bis 1 J.' : `${papier.jahre} J.`}
            </Beschriftung>
          </g>
        )
      })}

      <UmbrochenerText
        x={320}
        y={196}
        breite={600}
        text="Derselbe Schuldner, dieselbe Bonität. Was sich unterscheidet, ist nicht die Sicherheit, sondern wie stark der Kurs auf Zinsänderungen reagiert."
        ton="gedaempft"
      />
    </FigureSvg>
  )
}

// ------------------------------------------------------------ Die Blockkette

/**
 * Ein Block mit zwei Prüfsummen: der übernommenen und der eigenen.
 *
 * Die Zeichnung braucht keine echten Hashes und soll auch keine zeigen. Eine
 * Reihe Hexadezimalstellen sieht nach Genauigkeit aus, ist an dieser Stelle
 * aber erfunden – und die Aussage hängt nicht an den Zeichen, sondern daran,
 * dass zwei Felder übereinstimmen müssen. Deshalb heißen die Prüfsummen hier
 * A, B, C.
 */
function Block({
  x,
  y,
  breite,
  hoehe,
  nummer,
  uebernommen,
  eigene,
  passt,
  geaendert = false,
}: {
  x: number
  y: number
  breite: number
  hoehe: number
  nummer: number
  /** Die Prüfsumme des Vorgängers. Der erste Block hat keinen. */
  uebernommen: string | null
  /** Die Prüfsumme über den eigenen Inhalt. */
  eigene: string
  /** Ob die übernommene Prüfsumme noch zu der des Vorgängers passt. */
  passt: boolean
  /** Ob am Inhalt dieses Blocks etwas verändert wurde. */
  geaendert?: boolean
}) {
  const rahmen = geaendert ? FARBEN.gefahr : FARBEN.marke
  const feldBreite = (breite - 26) / 2
  const feldY = y + hoehe - 44

  const felder = [
    { titel: 'vom Vorgänger', wert: uebernommen ?? '—', gut: passt },
    { titel: 'eigene', wert: eigene, gut: !geaendert },
  ]

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={breite}
        height={hoehe}
        rx={8}
        fill="var(--c-surface-muted)"
        stroke={rahmen}
        strokeWidth={1.5}
      />
      <Beschriftung
        x={x + breite / 2}
        y={y + 22}
        anchor="middle"
        ton="stark"
        gewicht="kraeftig"
      >
        Block {nummer}
      </Beschriftung>
      <Beschriftung
        x={x + breite / 2}
        y={y + 40}
        anchor="middle"
        ton="leise"
        groesse={11.5}
      >
        {geaendert ? 'Buchung nachträglich geändert' : 'Buchungen'}
      </Beschriftung>

      {felder.map((feld, index) => {
        const fx = x + 9 + index * (feldBreite + 8)
        const farbe = feld.gut ? FARBEN.marke : FARBEN.gefahr
        return (
          <g key={feld.titel}>
            <rect
              x={fx}
              y={feldY}
              width={feldBreite}
              height={36}
              rx={5}
              fill={feld.gut ? 'var(--c-brand-soft)' : 'var(--c-danger-soft)'}
            />
            <Beschriftung
              x={fx + feldBreite / 2}
              y={feldY + 14}
              anchor="middle"
              ton="leise"
              groesse={10.5}
            >
              {feld.titel}
            </Beschriftung>
            <text
              x={fx + feldBreite / 2}
              y={feldY + 29}
              textAnchor="middle"
              fontSize={13}
              fontWeight={600}
              fill={farbe}
            >
              {feld.wert}
            </text>
          </g>
        )
      })}
    </g>
  )
}

/**
 * Warum sich eine alte Buchung nicht heimlich ändern lässt.
 *
 * ## Warum zwei Ketten und nicht eine
 *
 * Eine unversehrte Kette allein zeigt nichts. Dass jeder Block die Prüfsumme
 * seines Vorgängers trägt, ist erst dann eine Aussage, wenn daneben steht, was
 * bei einer Änderung passiert – der Bruch ist der Inhalt, nicht die Kette.
 *
 * ## Was hier bewusst nicht steht
 *
 * Nur die *erste* Verbindung bricht. Block 2 enthält weiterhin die alte
 * Prüfsumme A, seine eigene ist über seinen unveränderten Inhalt gebildet und
 * bleibt B – die Verbindung von 2 zu 3 stimmt also weiterhin. Es wäre bequemer
 * zu zeichnen, dass die ganze Kette rot wird, und es wäre falsch. Der Aufwand
 * für den Fälscher entsteht nicht dadurch, dass alles kaputtgeht, sondern
 * dadurch, dass er die Kette ab der Bruchstelle neu rechnen muss: Block 2 neu
 * bilden ändert dessen Prüfsumme, was Block 3 bricht, und so weiter.
 */
export function BlockchainKette() {
  const rand = 14
  const abstand = 40
  const breite = (640 - rand * 2 - abstand * 2) / 3
  const kasten = 118
  const obenGut = 52
  const obenBruch = 232
  // Der Fußtext läuft über drei Zeilen; darunter muss noch die Unterlänge passen.
  const hoehe = 424

  const ketten = [
    {
      y: obenGut,
      titel: 'unverändert – jedes Glied passt',
      pruefsummen: ['A', 'B', 'C'],
      uebernommen: [null, 'A', 'B'],
    },
    {
      y: obenBruch,
      titel: 'jemand ändert eine Buchung in Block 1',
      pruefsummen: ['A′', 'B', 'C'],
      uebernommen: [null, 'A', 'B'],
    },
  ] as const

  return (
    <FigureSvg id="blockchain-kette" viewBox={`0 0 640 ${hoehe}`}>
      {ketten.map((kette, kettenIndex) => {
        const gebrochen = kettenIndex === 1
        return (
          <g key={kette.titel}>
            <Beschriftung
              x={rand}
              y={kette.y - 14}
              ton={gebrochen ? 'gefahr' : 'gedaempft'}
              gewicht="kraeftig"
              groesse={12.5}
            >
              {kette.titel}
            </Beschriftung>

            {kette.pruefsummen.map((pruefsumme, index) => {
              const x = rand + index * (breite + abstand)
              /*
                Die Verbindung stimmt, wenn der übernommene Wert dem des
                Vorgängers gleicht. Das wird verglichen und nicht gesetzt –
                sonst könnte die Zeichnung eine Kette als heil ausweisen,
                deren Werte längst auseinandergehen.
              */
              const vorgaenger = index === 0 ? null : kette.pruefsummen[index - 1]
              const passt = kette.uebernommen[index] === vorgaenger

              return (
                <g key={index}>
                  <Block
                    x={x}
                    y={kette.y}
                    breite={breite}
                    hoehe={kasten}
                    nummer={index + 1}
                    uebernommen={kette.uebernommen[index]}
                    eigene={pruefsumme}
                    passt={passt}
                    geaendert={gebrochen && index === 0}
                  />

                  {index < kette.pruefsummen.length - 1 &&
                    (() => {
                      const naechsterPasst =
                        kette.uebernommen[index + 1] === kette.pruefsummen[index]
                      const von = x + breite
                      const bis = x + breite + abstand
                      const mitte = kette.y + kasten - 26
                      const farbe = naechsterPasst ? FARBEN.marke : FARBEN.gefahr
                      return (
                        <g>
                          <line
                            x1={von + 3}
                            y1={mitte}
                            x2={bis - 6}
                            y2={mitte}
                            stroke={farbe}
                            strokeWidth={1.8}
                            strokeDasharray={naechsterPasst ? undefined : '4 3'}
                          />
                          <path d={`M${bis - 3} ${mitte} l-7 -4.5 v9 Z`} fill={farbe} />
                          {!naechsterPasst && (
                            <g>
                              <line
                                x1={von + abstand / 2 - 5}
                                y1={mitte - 5}
                                x2={von + abstand / 2 + 5}
                                y2={mitte + 5}
                                stroke={FARBEN.gefahr}
                                strokeWidth={2}
                              />
                              <line
                                x1={von + abstand / 2 - 5}
                                y1={mitte + 5}
                                x2={von + abstand / 2 + 5}
                                y2={mitte - 5}
                                stroke={FARBEN.gefahr}
                                strokeWidth={2}
                              />
                            </g>
                          )}
                        </g>
                      )
                    })()}
                </g>
              )
            })}
          </g>
        )
      })}

      <UmbrochenerText
        x={320}
        y={obenBruch + kasten + 30}
        breite={608}
        text="Block 2 trägt noch die alte Prüfsumme A, Block 1 ergibt jetzt A′ – die Verbindung passt nicht mehr. Wer den Bruch verstecken will, muss Block 2 neu bilden; das ändert dessen Prüfsumme und bricht die nächste Verbindung. Und das gegen alle, die die richtige Kette haben."
        ton="gedaempft"
      />
    </FigureSvg>
  )
}

// ------------------------------------------------------- Der Zinskorridor

/**
 * Die drei Leitzinsen der EZB als Korridor.
 *
 * ## Warum keine Zahlen daranstehen
 *
 * Weil sie mit jedem Beschluss andere sind. Eine Grafik mit „2,25 %“ wäre nach
 * der nächsten Sitzung falsch, und zwar unauffällig falsch – sie sieht ja
 * weiterhin richtig aus. Was sich nicht ändert, ist die Reihenfolge: Der
 * Spitzenrefinanzierungssatz liegt immer oben, der Einlagesatz immer unten.
 * Genau das ist die Aussage, um die es in dieser Stufe geht.
 *
 * Die aktuellen Sätze stehen dort, wo sie hingehören und gepflegt werden: im
 * Kalender und in den Ausgaben.
 */
export function NotenbankZinskorridor() {
  const hoehe = 330
  const links = 16
  const rechts = 624

  const saetze = [
    {
      name: 'Spitzenrefinanzierungssatz',
      rolle: 'Obergrenze – Notfallkredit über Nacht',
      y: 76,
    },
    {
      name: 'Hauptrefinanzierungssatz',
      rolle: 'die wöchentliche Geldversorgung',
      y: 156,
    },
    {
      name: 'Einlagesatz',
      rolle: 'Untergrenze – hieran hängt dein Tagesgeld',
      y: 250,
    },
  ] as const

  const oben = saetze[0].y
  const unten = saetze[saetze.length - 1].y

  return (
    <FigureSvg id="notenbank-zinskorridor" viewBox={`0 0 640 ${hoehe}`}>
      <Beschriftung x={320} y={26} anchor="middle" ton="leise" groesse={12}>
        höherer Zins oben – die Abstände sind nicht maßstäblich
      </Beschriftung>

      {/* Der eingefärbte Streifen ist der Korridor. Er braucht einen eigenen
          Ton und nicht die Flächenfarbe: Gegen den Seitenhintergrund wäre er
          nicht zu erkennen, und dann zeigte die Grafik drei Linien statt eines
          Raums zwischen zweien. */}
      <rect
        x={links}
        y={oben}
        width={rechts - links}
        height={unten - oben}
        rx={8}
        fill="var(--c-brand-soft)"
      />

      <Beschriftung x={320} y={116} anchor="middle" ton="gedaempft" groesse={12}>
        der Korridor – hier bewegt sich der Zins, zu dem Banken einander leihen
      </Beschriftung>

      {saetze.map((satz, index) => (
        <g key={satz.name}>
          <Beschriftung
            x={links + 6}
            y={satz.y - 10}
            ton="stark"
            gewicht="kraeftig"
            groesse={13.5}
          >
            {satz.name}
          </Beschriftung>
          <Beschriftung
            x={rechts - 6}
            y={satz.y - 10}
            anchor="end"
            ton="leise"
            groesse={12}
          >
            {satz.rolle}
          </Beschriftung>
          <line
            x1={links}
            y1={satz.y}
            x2={rechts}
            y2={satz.y}
            stroke={index === saetze.length - 1 ? FARBEN.marke : FARBEN.ruhig}
            strokeWidth={index === saetze.length - 1 ? 3 : 1.8}
          />
        </g>
      ))}

      {/* Der Geldmarktzins liegt dicht über der Untergrenze – deshalb ist sie
          der Satz, der auf dem Tagesgeldkonto ankommt. */}
      <line
        x1={links}
        y1={222}
        x2={rechts}
        y2={222}
        stroke={FARBEN.akzent}
        strokeWidth={1.8}
        strokeDasharray="5 4"
      />
      <Beschriftung x={links + 6} y={216} ton="akzent" groesse={12}>
        Geldmarktzins – klebt an der Untergrenze
      </Beschriftung>

      <UmbrochenerText
        x={320}
        y={286}
        breite={608}
        text="Niemand verleiht Geld für weniger, als die Notenbank ohne jedes Risiko dafür zahlt. Deshalb ist der Einlagesatz die Untergrenze – und deshalb ist im Euroraum meist er gemeint, wenn von „dem Leitzins“ die Rede ist."
        ton="gedaempft"
      />
    </FigureSvg>
  )
}

// --------------------------------------------------- Rangfolge in der Insolvenz

/**
 * Die Stufen werden nach unten schmaler, weil auf jeder weniger ankommt.
 *
 * Das ist der einzige Punkt, an dem diese Zeichnung eine Größe andeutet, und
 * sie ist nicht gemessen: Wie viel auf welcher Stufe ankommt, hängt am
 * Einzelfall. Die Verjüngung sagt „weniger“, nicht „so viel weniger“ – deshalb
 * steht an keiner Stufe eine Quote.
 */
const RANGFOLGE = [
  {
    titel: 'Sicherheiten',
    text: 'Wer ein Pfand hat, verwertet es',
    farbe: FARBEN.ruhig,
  },
  {
    titel: 'Verfahrenskosten, Löhne, Steuern',
    text: 'wird vorweg bezahlt',
    farbe: FARBEN.ruhig,
  },
  {
    titel: 'Einfache Gläubiger',
    text: 'hier steht deine Schuldverschreibung',
    farbe: FARBEN.marke,
    hervor: true,
  },
  {
    titel: 'Nachrangige Gläubiger',
    text: 'erst, wenn die Stufe darüber voll bedient ist',
    farbe: FARBEN.warnung,
  },
  {
    titel: 'Aktionäre',
    text: 'was übrig bleibt – meist nichts',
    farbe: FARBEN.gefahr,
  },
] as const

export function AnleiheRangfolge() {
  const stufenHoehe = 46
  const luecke = 9
  const obersteBreite = 574
  const untersteBreite = 274
  const oben = 44
  const hoehe =
    oben + RANGFOLGE.length * stufenHoehe + (RANGFOLGE.length - 1) * luecke + 62

  return (
    <FigureSvg id="anleihe-rangfolge" viewBox={`0 0 640 ${hoehe}`}>
      <Beschriftung x={320} y={26} anchor="middle" ton="leise" groesse={12}>
        von oben nach unten – wer zuerst bedient wird
      </Beschriftung>

      {RANGFOLGE.map((stufe, index) => {
        const breite =
          obersteBreite -
          (index * (obersteBreite - untersteBreite)) / (RANGFOLGE.length - 1)
        const x = (640 - breite) / 2
        const y = oben + index * (stufenHoehe + luecke)
        const hervor = 'hervor' in stufe && stufe.hervor

        return (
          <g key={stufe.titel}>
            <rect
              x={x}
              y={y}
              width={breite}
              height={stufenHoehe}
              rx={7}
              fill={hervor ? 'var(--c-brand-soft)' : 'var(--c-surface-muted)'}
              stroke={stufe.farbe}
              strokeWidth={hervor ? 2 : 1.5}
            />
            <Beschriftung
              x={320}
              y={y + 20}
              anchor="middle"
              ton="stark"
              gewicht="kraeftig"
              groesse={13}
            >
              {stufe.titel}
            </Beschriftung>
            <Beschriftung x={320} y={y + 36} anchor="middle" ton="leise" groesse={11.5}>
              {stufe.text}
            </Beschriftung>
          </g>
        )
      })}

      <UmbrochenerText
        x={320}
        y={hoehe - 36}
        breite={608}
        text="Zwei Stufen stehen vor dem Anleihegläubiger, zwei hinter ihm. Das ist der ganze Unterschied zur Aktie – und er ist kleiner, als das Wort „vorrangig“ vermuten lässt."
        ton="gedaempft"
      />
    </FigureSvg>
  )
}

// ------------------------------------------- Was die Aktienquote im Fall bedeutet

/**
 * Fünf Depots mit demselben Startwert, unterschieden durch eine einzige Zahl.
 *
 * Alle Säulen sind gleich hoch – sie zeigen dasselbe Ausgangsdepot. Was sich
 * unterscheidet, ist der rote Anteil. Das ist die Darstellung, die zur Aussage
 * des Themas passt: Nicht die Rendite wird hier gewählt, sondern der Betrag,
 * den man vorübergehend verlieren kann, ohne zu verkaufen.
 */
export function PortfolioQuoteRueckgang() {
  const zeilen = portfolioQuoten.map((quote) => {
    const rueckgang = (quote / 100) * portfolioMarktrueckgang
    const verlust = portfolioDepotwert * (rueckgang / 100)
    return { quote, rueckgang, verlust, bleibt: portfolioDepotwert - verlust }
  })

  return (
    <SaeulenDiagramm
      id="portfolio-quote-rueckgang"
      einheit="Euro"
      hoehe={300}
      legende={[
        { farbe: FARBEN.marke, text: 'bleibt im Depot' },
        { farbe: FARBEN.gefahr, text: 'vorübergehend weg' },
      ]}
      /*
        Über der Säule steht der Verlust, nicht der Rest.

        Die Beschriftung sitzt bauartbedingt über dem obersten Abschnitt – und
        das ist hier der rote. Stünde dort „60.000 €“, schwebte diese Zahl an
        der 100.000er-Linie und benennte scheinbar den Gesamtwert. Was übrig
        bleibt, steht deshalb unten, direkt unter der Quote.
      */
      saeulen={zeilen.map((zeile) => ({
        label: `${formatPercent(zeile.quote, 0)} Aktien`,
        teile: [
          { wert: zeile.bleibt, farbe: FARBEN.marke },
          { wert: zeile.verlust, farbe: FARBEN.gefahr },
        ],
        wertText: `− ${formatCurrencyRounded(zeile.verlust)}`,
        hinweis: `bleiben ${formatCurrencyRounded(zeile.bleibt)}`,
      }))}
    />
  )
}
