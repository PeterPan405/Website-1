import {
  BalkenDiagramm,
  FARBEN,
  Feld,
  UmbrochenerText,
} from '@/components/content/figures/Diagramme'
import { Beschriftung, FigureSvg } from '@/components/content/figures/Rahmen'
import { calculateBudget } from '@/lib/finance'
import { formatCurrencyRounded, formatPercent } from '@/lib/format'
import { haushaltAusgaben, haushaltEinnahmen } from '@/lib/lernszenarien'

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
  const einnahmen = haushaltEinnahmen.reduce((summe, e) => summe + e.amount, 0)

  const sortiert = [...haushaltAusgaben].sort((a, b) => b.amount - a.amount)
  const dreiGroesste = sortiert.slice(0, 3).reduce((summe, a) => summe + a.amount, 0)

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

  return (
    <BalkenDiagramm
      id="budget-haushalt"
      balken={balken}
      labelBreite={186}
      beschreibung={
        `Ein Haushalt mit ${formatCurrencyRounded(einnahmen)} netto im Monat, die Ausgaben nach Größe ` +
        `sortiert: ` +
        sortiert.map((p) => `${p.label} ${formatCurrencyRounded(p.amount)}`).join(', ') +
        `. Übrig bleiben ${formatCurrencyRounded(haushalt.balance)}, also eine Sparquote von ` +
        `${formatPercent(haushalt.savingsRatePercent, 1)}. Die drei größten Posten machen zusammen ` +
        `${formatCurrencyRounded(dreiGroesste)} aus – mehr als alle übrigen zusammen. Deshalb ist die ` +
        `Reihenfolge die eigentliche Aussage: Wer sparen will, fängt oben an. Zehn Prozent bei den ` +
        `Wohnkosten bringen mehr als der vollständige Verzicht auf die beiden kleinsten Posten.`
      }
    />
  )
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

/** Die vier Bundeswertpapiere, aufgetragen nach ihrer Laufzeit bei Ausgabe. */
const BUNDESPAPIERE = [
  { name: 'Bubill', jahre: 1, hinweis: 'unverzinslich, bis 12 Monate' },
  { name: 'Schatz', jahre: 2, hinweis: 'reagiert am stärksten auf die Notenbank' },
  { name: 'Bobl', jahre: 5, hinweis: 'mittleres Segment' },
  { name: 'Bund', jahre: 10, hinweis: 'der Zinsmaßstab der Eurozone' },
  { name: 'Bund lang', jahre: 30, hinweis: 'die längste Laufzeit' },
] as const

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
    <FigureSvg
      id="staatsanleihe-laufzeiten"
      viewBox={`0 0 640 ${hoehe}`}
      beschreibung={
        'Die deutschen Bundeswertpapiere nach ihrer Laufzeit bei Ausgabe: ' +
        BUNDESPAPIERE.map(
          (p) =>
            `${p.name} mit ${p.jahre} ${p.jahre === 1 ? 'Jahr' : 'Jahren'} – ${p.hinweis}`
        ).join('; ') +
        '. Die Namen sagen nichts über die Sicherheit: Hinter allen steht derselbe Schuldner. Sie sagen ' +
        'etwas über die Empfindlichkeit. Je länger die Laufzeit, desto stärker schwankt der Kurs, wenn ' +
        'sich die Zinsen ändern – und desto weniger folgt er kurzfristigen Entscheidungen der Notenbank. ' +
        'Die Achse ist gestaucht, weil sonst vier der fünf Papiere übereinanderlägen.'
      }
    >
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
