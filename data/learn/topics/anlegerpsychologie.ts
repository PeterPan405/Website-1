import type { LearnTopic } from '@/data/learn/types'
import { calculateCompoundInterest } from '@/lib/finance'
import { formatCurrencyRounded, formatPercent } from '@/lib/format'

/*
  Zwei gerechnete Größen tragen dieses Thema.

  Psychologie ist das Feld, auf dem am leichtesten behauptet wird. „Verluste
  wiegen doppelt so schwer“ ist eine Messung aus der Forschung und wird hier
  als solche zitiert. Was daneben steht, muss nachrechenbar sein – sonst
  unterscheidet sich der Text nicht von den Ratgebertexten, die er kritisiert.

  1. Die Erholungstabelle: Wie viel Anstieg ein Rückgang braucht, um wieder
     auf null zu kommen. Reine Arithmetik, aber sie erklärt, warum der
     gefühlte Unterschied zwischen Gewinn und Verlust einen realen Kern hat.
  2. Der Preis eines Prozentpunkts: Die Verhaltenslücke wird in Studien in der
     Größenordnung eines Prozentpunkts pro Jahr gemessen. Was das über eine
     Ansparzeit ausmacht, rechnet dieselbe Funktion aus, die auch der
     Zinsrechner der Website benutzt.
*/
const RUECKGAENGE = [10, 20, 30, 40, 50, 60]
const erholungJeRueckgang = RUECKGAENGE.map((rueckgang) => ({
  rueckgang,
  // Aus 100 werden (100 − r). Um zurück auf 100 zu kommen, braucht es
  // r / (100 − r) – bezogen auf den kleiner gewordenen Bestand.
  erholung: (rueckgang / (100 - rueckgang)) * 100,
}))

const SPARFALL = { rate: 300, jahre: 30 }
const LUECKE = 1

function endkapitalBei(rendite: number): number {
  return calculateCompoundInterest({
    principal: 0,
    contribution: SPARFALL.rate,
    interval: 'monthly',
    annualRatePercent: rendite,
    years: SPARFALL.jahre,
  }).finalBalance
}

const OHNE_LUECKE = 7
const mitDisziplin = endkapitalBei(OHNE_LUECKE)
const mitLuecke = endkapitalBei(OHNE_LUECKE - LUECKE)
const lueckeInEuro = mitDisziplin - mitLuecke
const lueckeInProzent = (lueckeInEuro / mitDisziplin) * 100

/**
 * Vollständig ausgearbeitetes Thema.
 *
 * Stufenaufbau: Beginner benennt die vier Grundmuster und zeigt, wie sie sich
 * im Depot niederschlagen. Fortgeschritten geht auf die feineren Mechanismen
 * ein und auf die Gegenmittel, für die es Belege gibt. Profi verlässt die
 * Einzelperson und betrachtet, was auf Marktebene daraus wird – samt der
 * Frage, ob sich das ausnutzen lässt.
 *
 * ## Abgrenzung zu „Wann kaufen und verkaufen“
 *
 * Dort geht es um die Entscheidung selbst, hier um die Kräfte, die sie
 * verzerren. Der Markttiming-Nachweis gehört deshalb dorthin und wird hier
 * nur als Konsequenz gestreift.
 */
export const anlegerpsychologie: LearnTopic = {
  slug: 'anlegerpsychologie',
  title: 'Anlegerpsychologie',
  headline: 'Die Fehler, die nicht am Wissen liegen',
  metaTitle: 'Anlegerpsychologie: typische Denkfehler bei der Geldanlage',
  metaDescription:
    'Verlustaversion, Herdentrieb, Selbstüberschätzung und Dispositionseffekt – welche Denkmuster Anlageergebnisse verschlechtern und was dagegen tatsächlich hilft.',
  lead: 'Die meisten Anlagefehler entstehen nicht aus fehlendem Wissen, sondern aus vorhersehbaren Reaktionen auf Kursbewegungen.',
  overview: [
    'Untersuchungen zur Rendite von Privatanlegern finden regelmäßig eine Lücke zwischen dem, was ein Fonds erwirtschaftet hat, und dem, was seine Anleger tatsächlich erzielten. Der Unterschied entsteht durch das Verhalten: Kaufen nach Anstiegen, Verkaufen nach Rückgängen.',
    'Diese Muster sind nicht Ausdruck von Dummheit. Sie sind systematisch, gut dokumentiert und bei allen Menschen vorhanden – auch bei denen, die sie kennen.',
    'Die Stufen führen von den bekanntesten Denkfehlern über ihre Wirkung im Depot bis zu den Gegenmitteln, die tatsächlich etwas bringen: schriftliche Regeln, Automatisierung und weniger Anlässe, überhaupt zu entscheiden.',
  ],
  keywords: [
    'Anlegerpsychologie',
    'Behavioral Finance',
    'Verlustaversion',
    'Herdentrieb',
    'Dispositionseffekt',
    'Selbstüberschätzung',
    'Anlagefehler',
  ],
  related: [
    'wann-kaufen-verkaufen',
    'groesste-crashes',
    'cost-average-sparplan',
    'worauf-achten-einsteiger',
  ],
  calculators: ['/rechner/zinsrechner'],
  levels: {
    // ---------------------------------------------------------------- Beginner
    beginner: {
      metaTitle: 'Denkfehler bei der Geldanlage: die häufigsten Muster',
      metaDescription:
        'Die häufigsten psychologischen Fallen bei Anlageentscheidungen, warum sie jeden betreffen und wie sie sich im Depot bemerkbar machen.',
      title: 'Die häufigsten Denkfehler',
      lead: 'Welche Muster bei fast allen auftreten, wie sie konkret Geld kosten – und warum sie nicht verschwinden, wenn man sie kennt.',
      readingMinutes: 8,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Wer sich mit Geldanlage beschäftigt, lernt zuerst Produkte und Regeln. Die meisten schlechten Ergebnisse entstehen aber nicht daran, dass jemand den falschen Fonds gewählt hätte. Sie entstehen daran, dass eine an sich gute Entscheidung nach zwei schlechten Jahren rückgängig gemacht wird.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Vier Muster, die fast jeden betreffen',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Verlustaversion.** Ein Verlust wiegt gefühlt deutlich schwerer als ein gleich großer Gewinn – in der Forschung von Kahneman und Tversky etwa doppelt so schwer. Deshalb fühlt sich ein Depot, das um zehn Prozent gefallen und wieder gestiegen ist, nach einer schlechten Erfahrung an, obwohl nichts passiert ist.',
            '**Herdentrieb.** Was viele tun, wirkt sicher. Der Haken ist der Zeitpunkt: Ein Thema wird meist dann allgemein bekannt, wenn der Kurs den Anstieg bereits hinter sich hat.',
            '**Selbstüberschätzung.** In Befragungen halten sich regelmäßig weit mehr als die Hälfte der Teilnehmer für überdurchschnittlich informiert. Rechnerisch kann das nicht sein. Die Folge sind mehr Umschichtungen – und jede kostet.',
            '**Bestätigungsfehler.** Nach dem Kauf liest man bevorzugt, was für die eigene Entscheidung spricht. Gegenargumente wirken schwächer, weil sie unbequem sind, nicht weil sie schwächer wären.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Warum Verluste einen realen Kern haben',
        },
        {
          type: 'paragraph',
          text: 'Die Verlustaversion ist ein Gefühl, aber sie hat eine sachliche Entsprechung: Ein Rückgang und der Anstieg zurück auf denselben Stand sind nicht gleich groß. Nach einem Rückgang ist der Bestand kleiner, und der Anstieg wirkt nur noch auf diesen kleineren Bestand.',
        },
        {
          type: 'table',
          caption: 'Welcher Anstieg einen Rückgang wieder ausgleicht',
          head: ['Rückgang', 'Nötiger Anstieg', 'Aus 10.000 € werden'],
          rows: erholungJeRueckgang.map((zeile) => [
            `− ${formatPercent(zeile.rueckgang, 0)}`,
            `+ ${formatPercent(zeile.erholung, 1)}`,
            formatCurrencyRounded(10_000 * (1 - zeile.rueckgang / 100)),
          ]),
        },
        {
          type: 'paragraph',
          text: 'Halbierung braucht eine Verdopplung. Das ist keine Psychologie, sondern Prozentrechnung – und es ist der Grund, warum große Verluste zu vermeiden wichtiger ist, als große Gewinne zu treffen.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wie sich das im Depot zeigt',
        },
        {
          type: 'list',
          items: [
            '**Der Dispositionseffekt.** Gewinner werden zu früh verkauft („Gewinne mitnehmen“), Verlierer zu lange gehalten („noch nicht realisiert“). Beides folgt dem Bedürfnis, sich den Fehler nicht eingestehen zu müssen – nicht einer Einschätzung der Zukunft.',
            '**Der Einstandskurs als Bezugspunkt.** Was du bezahlt hast, weiß der Markt nicht. Für die Frage, ob eine Anlage heute gehalten werden sollte, ist der eigene Kaufkurs ohne jede Bedeutung.',
            '**Kaufen nach Anstiegen, Verkaufen nach Rückgängen.** Zuflüsse in Fonds sind historisch nach guten Phasen am höchsten und nach Einbrüchen am niedrigsten. Das ist die Umkehrung dessen, was jeder erklärtermaßen will.',
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Wissen allein hilft nicht',
          items: [
            'Die Muster verschwinden nicht, wenn man sie kennt – sie werden nur benennbar. Unter Stress, Zeitdruck und roten Zahlen greifen sie trotzdem.',
            'Deshalb setzt alles Wirksame vor der Situation an: Regeln festlegen, solange nichts passiert ist.',
            'Der Sparplan ist die einfachste Form davon. Er kauft weiter, während man selbst zögern würde.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was du dir merken solltest',
        },
        {
          type: 'list',
          items: [
            'Verluste wiegen gefühlt schwerer – und rechnerisch sind sie tatsächlich schwerer aufzuholen.',
            'Der Dispositionseffekt verkauft die Gewinner und behält die Verlierer.',
            'Der eigene Einstandskurs ist für die Zukunft bedeutungslos.',
            'Gegen die Muster hilft keine Willenskraft, sondern eine vorher festgelegte Regel.',
          ],
        },
      ],
    },

    // -------------------------------------------------------- Fortgeschritten
    fortgeschritten: {
      metaTitle: 'Behavioral Finance: Mechanismen und wirksame Gegenmittel',
      metaDescription:
        'Ankereffekt, Rezenzeffekt, Verfügbarkeitsheuristik und mentale Buchführung – wie sie entstehen und welche Gegenmaßnahmen tatsächlich wirken.',
      title: 'Mechanismen und Gegenmittel',
      lead: 'Die feineren Muster, was sie im Depot anrichten – und was die Verhaltenslücke über eine Ansparzeit kostet.',
      readingMinutes: 11,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Vier weitere Muster',
        },
        {
          type: 'table',
          caption: 'Mechanismus und typische Auswirkung',
          head: ['Muster', 'Was passiert', 'Im Depot'],
          rows: [
            [
              'Ankereffekt',
              'Die erste gesehene Zahl prägt jede spätere Einschätzung',
              'Ein früherer Höchstkurs gilt als „eigentlicher“ Wert, obwohl er nur ein Datenpunkt ist',
            ],
            [
              'Rezenzeffekt',
              'Die jüngste Entwicklung wird in die Zukunft verlängert',
              'Nach drei guten Jahren wird die Aktienquote erhöht, nach einem schlechten gesenkt',
            ],
            [
              'Verfügbarkeitsheuristik',
              'Was medial präsent ist, wirkt wahrscheinlich',
              'Ein Einzelfall in den Nachrichten verdrängt die unspektakuläre Statistik',
            ],
            [
              'Mentale Buchführung',
              'Geld wird je nach Herkunft unterschiedlich behandelt',
              'Eine Erbschaft wird vorsichtiger angelegt als Erspartes – obwohl es dasselbe Geld ist',
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'Die mentale Buchführung ist das am meisten unterschätzte Muster. Sie erklärt, warum jemand einen Kredit mit acht Prozent Zinsen bedient und gleichzeitig Tagesgeld hält, das zwei Prozent bringt: Beides liegt in getrennten Schubladen, und die Rechnung über beide zusammen wird nicht aufgemacht.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Vertrautheit ist nicht Sicherheit',
        },
        {
          type: 'paragraph',
          text: 'Anleger in fast allen Ländern halten deutlich mehr heimische Aktien, als es dem Anteil ihres Landes am Weltmarkt entspricht – der **Home Bias**. Der Grund ist Vertrautheit: Man kennt die Namen, liest die Nachrichten, war Kunde. Nichts davon hat mit dem Risiko der Anlage zu tun.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Der Sonderfall Mitarbeiteraktien',
          items: [
            'Wer Aktien des eigenen Arbeitgebers hält, koppelt Arbeitsplatz, Einkommen und Vermögen an dasselbe Unternehmen.',
            'Gerät es in Schwierigkeiten, fallen Gehalt und Depotwert gleichzeitig – genau dann, wenn Rücklagen gebraucht würden.',
            'Rabatte auf Mitarbeiteraktien sind ein echter Vorteil. Er rechtfertigt den Kauf, nicht das dauerhafte Halten großer Bestände.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was die Verhaltenslücke kostet',
        },
        {
          type: 'paragraph',
          text: `Untersuchungen, die die Wertentwicklung von Fonds mit der tatsächlichen Rendite ihrer Anleger vergleichen, finden die Differenz meist in der Größenordnung eines Prozentpunkts pro Jahr. Ein Prozentpunkt klingt nach wenig. Über eine Ansparzeit hinweg ist er es nicht: Bei ${formatCurrencyRounded(SPARFALL.rate)} monatlich über ${SPARFALL.jahre} Jahre stehen am Ende ${formatCurrencyRounded(mitDisziplin)} statt ${formatCurrencyRounded(mitLuecke)}.`,
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Die Rechnung im Einzelnen',
          items: [
            `Angenommene Rendite ohne Verhaltenslücke: ${formatPercent(OHNE_LUECKE, 0)} pro Jahr.`,
            `Mit Lücke: ${formatPercent(OHNE_LUECKE - LUECKE, 0)} – dieselbe Anlage, dasselbe Produkt, nur schlechter getroffene Zeitpunkte.`,
            `Unterschied nach ${SPARFALL.jahre} Jahren: ${formatCurrencyRounded(lueckeInEuro)} oder ${formatPercent(lueckeInProzent, 0)} des Ergebnisses.`,
            'Die Renditeannahme ist gesetzt, nicht gemessen – der Punkt ist die Größenordnung des Unterschieds, nicht der Endbetrag.',
          ],
        },
        {
          type: 'figure',
          figure: 'psychologie-verhaltensluecke',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was tatsächlich hilft',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Schriftliche Regeln vor dem ersten Kauf.** Zwei Sätze genügen: Wie hoch ist die Aktienquote, und unter welchen Bedingungen wird sie geändert? Aufgeschrieben lässt sich später prüfen, ob eine Änderung dem Plan folgt oder der Stimmung.',
            '**Automatisierung.** Sparplan, fester Rebalancing-Termin, feste Bandbreiten. Jede automatisierte Entscheidung ist eine, die nicht im ungünstigsten Moment getroffen wird.',
            '**Seltener nachsehen.** Wer täglich in das Depot schaut, sieht mehr rote Tage – bei täglicher Betrachtung ist rund die Hälfte rot, bei jährlicher deutlich weniger. Mehr Blicke erzeugen mehr Handlungsdruck ohne mehr Information.',
            '**Entscheidungen protokollieren.** Datum, Entscheidung, Begründung. Nach zwei Jahren nachgelesen, ist das die einzige verlässliche Auskunft darüber, wie gut die eigenen Einschätzungen wirklich waren.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was du dir merken solltest',
        },
        {
          type: 'list',
          items: [
            'Anker und Rezenzeffekt lassen die jüngste Vergangenheit wie die Zukunft aussehen.',
            'Vertrautheit wird routinemäßig mit Sicherheit verwechselt – beim Heimatmarkt wie beim Arbeitgeber.',
            'Ein Prozentpunkt Verhaltenslücke kostet über eine Ansparzeit einen erheblichen Teil des Ergebnisses.',
            'Wirksam sind vorher festgelegte Regeln, Automatisierung und weniger Blicke ins Depot.',
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ Profi
    profi: {
      metaTitle: 'Marktphänomene und die Grenzen der Rationalität',
      metaDescription:
        'Von Blasenbildung über Momentum bis zur Frage, ob sich Verhaltensmuster systematisch ausnutzen lassen – und warum das schwerer ist, als es klingt.',
      title: 'Psychologie auf Marktebene',
      lead: 'Wo aus individuellen Mustern Marktphänomene werden, was sich daraus ableiten lässt – und was nicht.',
      readingMinutes: 11,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Vom Einzelnen zum Markt',
        },
        {
          type: 'paragraph',
          text: 'Wären Denkfehler zufällig verteilt, würden sie sich im Markt gegenseitig aufheben. Sie sind aber gleichgerichtet: Menschen werden zur selben Zeit optimistisch. Aus einem individuellen Muster wird dadurch eine Marktbewegung.',
        },
        {
          type: 'list',
          items: [
            '**Die Selbstverstärkung.** Steigende Kurse erzeugen Berichterstattung, Berichterstattung erzeugt Zuflüsse, Zuflüsse erzeugen steigende Kurse. Kommt Kredit hinzu, beschleunigt sich der Vorgang – und kehrt sich beim ersten Rückgang um, weil Sicherheiten nachgeschossen werden müssen.',
            '**Die Erzählung.** Jede Blase hat einen plausiblen Kern und einen Satz, der die hohen Bewertungen erklärt: neue Technologie, neue Wirtschaftsordnung, diesmal ist es anders. Der Kern stimmt oft. Falsch ist der Schluss, dass daraus jeder Preis gerechtfertigt sei.',
            '**Die Abwärtsspirale.** Fallende Kurse zwingen fremdfinanzierte Marktteilnehmer zu Verkäufen, diese Verkäufe drücken die Kurse weiter. Deshalb sind Einbrüche schneller als Anstiege – Zwang wirkt sofort, Zuversicht braucht Zeit.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Lassen sich Verhaltensmuster ausnutzen?',
        },
        {
          type: 'paragraph',
          text: 'Die Forschung hat eine Reihe von **Anomalien** dokumentiert – regelmäßige Abweichungen von dem, was ein vollkommen effizienter Markt erwarten ließe. Zwei werden am häufigsten genannt und beide werden verhaltensökonomisch erklärt.',
        },
        {
          type: 'table',
          caption: 'Zwei bekannte Anomalien',
          head: ['Effekt', 'Beobachtung', 'Verhaltensökonomische Deutung'],
          rows: [
            [
              'Momentum',
              'Was zuletzt gestiegen ist, steigt mittelfristig oft weiter',
              'Anleger reagieren zunächst zu schwach auf Neuigkeiten und springen erst verzögert auf',
            ],
            [
              'Value',
              'Niedrig bewertete Unternehmen schnitten über lange Zeiträume besser ab',
              'Unbeliebte Geschäftsmodelle werden zu pessimistisch eingeschätzt',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Warum das in der Praxis selten trägt',
          items: [
            '**Veröffentlichung schwächt.** Viele Effekte fallen nach ihrer Beschreibung in der Literatur deutlich kleiner aus – sobald genug Kapital ihnen folgt, verschwindet der Vorsprung, dem es folgt.',
            '**Die Kosten fressen den Rest.** Momentum verlangt häufiges Umschichten. Spread, Gebühren und Abgeltungsteuer auf jeden realisierten Gewinn zehren genau den Vorsprung auf, um den es geht.',
            '**Die Durststrecken sind lang.** Value lag über mehr als ein Jahrzehnt zurück. Eine Strategie, die zehn Jahre schlechter läuft, wird von fast allen vorher aufgegeben – wieder aus psychologischen Gründen.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Die Effizienzmarkthypothese besagt, dass alle bekannten Informationen im Kurs stecken. Die Verhaltensökonomie hat gezeigt, dass sie in dieser Strenge nicht gilt. Für die Praxis ändert das weniger, als es klingt: Ein Markt kann unvollkommen sein und trotzdem schwer zu schlagen – weil die Abweichungen klein, unbeständig und teuer zu handeln sind.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Sich selbst ehrlich beurteilen',
        },
        {
          type: 'paragraph',
          text: 'Der **Rückschaufehler** ist der hartnäckigste aller Denkfehler, weil er die Beweise vernichtet: Nach dem Ereignis erscheint der Verlauf naheliegend, und die eigene damalige Unsicherheit ist aus der Erinnerung verschwunden. Wer sich fragt, ob er den Markt einschätzen kann, befragt damit eine Erinnerung, die sich bereits angepasst hat.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Vorher aufschreiben.** Eine Einschätzung ist nur dann prüfbar, wenn sie vor dem Ereignis notiert wurde – mit Datum und Begründung.',
            '**Gegen den richtigen Maßstab messen.** Ein Depot mit 15 Prozent Jahresrendite war schwach, wenn der Vergleichsindex 22 Prozent gemacht hat. Ohne Vergleichsmaßstab ist jede Renditeangabe bedeutungslos.',
            '**Vollständig rechnen.** Alle Positionen, auch die verkauften und die verlustreichen. Die Erinnerung an das eigene Depot ist verlässlich zu gut.',
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Die nüchterne Schlussfolgerung',
          items: [
            'Die große Mehrheit der Privatanleger und auch der Berufsanleger übertrifft den passenden Vergleichsindex über lange Zeiträume nicht.',
            'Das ist kein Makel, sondern die zu erwartende Verteilung – der Index ist der Durchschnitt aller Beteiligten vor Kosten.',
            'Wer das akzeptiert, gewinnt Zeit und spart Gebühren. Der Marktdurchschnitt über Jahrzehnte ist ein sehr gutes Ergebnis.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was du dir merken solltest',
        },
        {
          type: 'list',
          items: [
            'Denkfehler heben sich nicht auf, weil sie gleichgerichtet auftreten – daraus entstehen Blasen und Panikphasen.',
            'Dokumentierte Anomalien schwächen sich nach ihrer Veröffentlichung häufig ab.',
            'Kosten, Steuern und lange Durststrecken lassen verhaltensbasierte Strategien in der Praxis oft scheitern.',
            'Der Rückschaufehler macht Selbsteinschätzung unbrauchbar – es hilft nur, vorher aufzuschreiben.',
          ],
        },
      ],
    },
  },
}
