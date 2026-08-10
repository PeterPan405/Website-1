import type { LearnTopic } from '@/data/learn/types'
import { formatCurrencyRounded } from '@/lib/format'
import {
  einlagensicherungErhoeht as ERHOEHT,
  einlagensicherungGrenze as GRENZE,
} from '@/lib/lernszenarien'

/*
  Die Grenze steht an einer Stelle.

  100.000 Euro je Person und Institut ist die Zahl, um die sich dieses ganze
  Thema dreht, und sie taucht in allen drei Stufen auf – bei
  Gemeinschaftskonten verdoppelt, bei mehreren Instituten vervielfacht. Als
  getippte Zahl an sieben Stellen wäre sie beim ersten Rechtsänderungsfall
  an sechs Stellen falsch.
*/
const ERHOEHT_MONATE = 6
const FRIST_ARBEITSTAGE = 7

/**
 * Vollständig ausgearbeitetes Thema.
 *
 * Stufenaufbau: Beginner klärt, was gesichert ist und was nicht – wobei der
 * wichtigste Punkt ist, dass „nicht gesichert“ und „unsicher“ zwei
 * verschiedene Dinge sind. Fortgeschritten vergleicht die Sicherungssysteme
 * und behandelt Auslandsbanken und Zinsplattformen. Profi geht auf das
 * Abwicklungsrecht, den Bail-in und die tatsächliche Belastbarkeit der
 * Fonds ein.
 *
 * ## Warum das Thema so früh im Lernweg steht
 *
 * Es beantwortet die Frage, die vor jeder Anlage steht: Was passiert, wenn
 * mein Institut untergeht? Wer sie nicht beantworten kann, streut aus den
 * falschen Gründen.
 */
export const einlagensicherung: LearnTopic = {
  slug: 'einlagensicherung',
  title: 'Einlagensicherung',
  headline: 'Was geschützt ist – und was nicht geschützt werden muss',
  metaTitle: 'Einlagensicherung erklärt: Höhe, Umfang, Grenzen',
  metaDescription:
    'Welche Guthaben die Einlagensicherung abdeckt, bis zu welcher Höhe sie greift, was ausdrücklich nicht geschützt ist und wie die Auszahlung abläuft.',
  lead: 'Die Einlagensicherung schützt Bankguthaben bis zu einer festen Grenze. Wertpapiere schützt sie überhaupt nicht – weil sie es nicht muss.',
  overview: [
    'Geht eine Bank pleite, greift die gesetzliche Einlagensicherung: Guthaben werden bis zu einer festgelegten Obergrenze je Person und Institut ersetzt.',
    'Entscheidend ist der Unterschied zwischen Einlagen und Wertpapieren. Eine Einlage ist eine Forderung gegen die Bank und deshalb sicherungsbedürftig. Wertpapiere im Depot sind Sondervermögen – sie gehören ohnehin dir und tauchen in der Insolvenzmasse gar nicht auf.',
    'Die Stufen behandeln Umfang und Höhe, dann die verschiedenen Sicherungssysteme samt Auslandsfällen, schließlich Abwicklungsrecht, Bail-in und die Frage, wie belastbar die Fonds im Ernstfall sind.',
  ],
  keywords: [
    'Einlagensicherung',
    'Bankguthaben',
    'Sondervermögen',
    'Bail-in',
    'Institutssicherung',
  ],
  related: ['tagesgeld', 'schuldverschreibung', 'fonds'],
  levels: {
    // ---------------------------------------------------------------- Beginner
    beginner: {
      metaTitle: 'Einlagensicherung einfach erklärt: was gilt',
      metaDescription:
        'Was die Einlagensicherung abdeckt, bis zu welcher Höhe sie greift, was nicht geschützt ist und warum Wertpapiere anders behandelt werden.',
      title: 'Welche Guthaben geschützt sind',
      lead: 'Die Grenze, was darunterfällt – und warum die größte Position im Depot gar keinen Schutz braucht.',
      readingMinutes: 11,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: `Wenn du Geld auf ein Bankkonto legst, gehört es nicht mehr dir. Du hast eine **Forderung** gegen die Bank – sie schuldet dir den Betrag. Geht sie unter, stehst du mit dieser Forderung in einer Reihe mit anderen Gläubigern. Genau dafür gibt es die Einlagensicherung: Sie ersetzt Guthaben bis zu ${formatCurrencyRounded(GRENZE)} je Person und Institut.`,
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die Grenze richtig lesen',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Je Person und je Institut – nicht je Konto',
          items: [
            `Wer bei derselben Bank ${formatCurrencyRounded(50_000)} auf dem Tagesgeld und ${formatCurrencyRounded(80_000)} auf dem Festgeld hat, ist nicht zweimal, sondern einmal bis ${formatCurrencyRounded(GRENZE)} geschützt. Die Konten werden zusammengezählt.`,
            `Bei einem **Gemeinschaftskonto** steht die Grenze jedem Inhaber zu: Ein Konto zweier Personen ist bis ${formatCurrencyRounded(2 * GRENZE)} gedeckt.`,
            '**Mehrere Marken können ein Institut sein.** Etliche Banken treten unter verschiedenen Namen auf, gehören aber zu derselben juristischen Person – dann gilt die Grenze nur einmal für alle zusammen. Das ist der am häufigsten übersehene Punkt und in wenigen Minuten prüfbar: Die Sicherungsangaben stehen im Impressum und im Preis- und Leistungsverzeichnis.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was dazugehört – und was nicht',
        },
        {
          type: 'table',
          caption: 'Zwei grundverschiedene Rechtslagen',
          head: ['', 'Beispiele', 'Warum'],
          rows: [
            [
              'Von der Sicherung erfasst',
              'Girokonto, Tagesgeld, Festgeld, Sparbuch',
              'Es sind Forderungen gegen die Bank. Sie fallen bei einer Insolvenz in die Masse – deshalb brauchen sie einen Ersatz',
            ],
            [
              'Nicht erfasst, weil nicht nötig',
              'Aktien, Anleihen anderer Emittenten, Fonds und ETFs im Depot',
              'Sie gehören dir und werden nur verwahrt. Bei einer Insolvenz werden sie herausgegeben oder auf eine andere Bank übertragen',
            ],
            [
              'Nicht erfasst und tatsächlich ungeschützt',
              'Zertifikate und Anleihen der eigenen Bank',
              'Sie sind ebenfalls Forderungen gegen die Bank – aber ausdrücklich von der Sicherung ausgenommen',
            ],
            [
              'Außerhalb des Systems',
              'Kryptoguthaben auf Handelsplattformen',
              'Keine Einlage im Rechtssinn und je nach Plattform nicht einmal insolvenzfest getrennt',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: '„Nicht geschützt“ heißt nicht „unsicher“',
          items: [
            'Die zweite Zeile ist die wichtigste dieser Tabelle und wird regelmäßig falsch verstanden. Ein ETF ist **Sondervermögen**: Er gehört rechtlich den Anlegern, nicht der Fondsgesellschaft und nicht der Depotbank.',
            'Eine Bankpleite kostet dort Zeit und Nerven, aber nicht das Geld – die Bestände werden übertragen. Der ETF selbst schwankt weiter, das ist ein anderes Risiko.',
            'Die dritte Zeile dagegen ist echte Gefahr: Ein Zertifikat der eigenen Bank ist eine Forderung gegen genau den Schuldner, der ausgefallen ist – und ausdrücklich nicht gesichert.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wie die Auszahlung abläuft',
        },
        {
          type: 'paragraph',
          text: `Tritt der Sicherungsfall ein, stellt die Aufsicht ihn fest, und die Entschädigung erfolgt ohne Antrag – die Einrichtung kennt die Kontostände. Die gesetzliche Frist beträgt ${FRIST_ARBEITSTAGE} Arbeitstage. Mitgesichert sind auch die bis dahin aufgelaufenen Zinsen, soweit sie zusammen mit dem Guthaben unter der Grenze bleiben.`,
        },
        {
          type: 'list',
          items: [
            '**Größere Beträge auf mehrere Institute verteilen.** Die einfachste und wirksamste Maßnahme – und die einzige, die keinen Zinsverzicht kostet.',
            '**Prüfen, wer wirklich der Vertragspartner ist.** Bei Zinsplattformen liegt das Geld nicht bei der Plattform, sondern bei einer Partnerbank, oft im Ausland. Deren Sicherungssystem ist zuständig, nicht das deutsche.',
            '**Bei auffällig hohen Zinsen genauer hinsehen.** Ein Institut, das deutlich über dem Markt bietet, braucht das Geld dringender als andere. Das muss nichts heißen – es ist aber der Anlass, das Sicherungssystem zu prüfen, statt nur die Zinstabelle.',
          ],
        },
        {
          type: 'figure',
          figure: 'einlagensicherung-grenze',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wenn vorübergehend viel mehr auf dem Konto liegt',
        },
        {
          type: 'paragraph',
          text: 'Es gibt Wochen, in denen die Grenze offensichtlich nicht passt: nach einem Hausverkauf, einer Erbschaft, einer Abfindung oder einer Versicherungsleistung. Für genau diese Fälle sieht das Gesetz einen **erhöhten Schutz** vor – für sechs Monate ab Gutschrift sind deutlich höhere Beträge gedeckt.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Was dabei zu beachten ist',
          items: [
            'Der erhöhte Schutz gilt nur für **bestimmte, im Gesetz genannte Anlässe** – im Kern Immobilienverkauf, Lebensereignisse wie Heirat oder Scheidung, Erbschaft, Abfindung und Versicherungsleistungen.',
            'Er gilt **sechs Monate**, gerechnet ab der Gutschrift. Danach fällt alles auf die normale Grenze zurück, ohne Erinnerung und ohne Hinweis der Bank.',
            'Und er kommt nicht von selbst: Im Entschädigungsfall muss der Anlass **nachgewiesen** werden – Kaufvertrag, Erbschein, Abfindungsvereinbarung. Wer die Unterlagen nicht mehr hat, hat den erhöhten Schutz faktisch nicht.',
            'Praktisch heißt das: Der Puffer ist gut für die Zeit, in der man ohnehin überlegt, wohin das Geld soll – aber kein Ersatz dafür, es innerhalb dieser sechs Monate zu verteilen.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Der Fall Greensill – warum das kein theoretisches Thema ist',
        },
        {
          type: 'paragraph',
          text: 'Im März 2021 wurde die Bremer Greensill Bank geschlossen. Privatanleger bekamen ihr Geld über die gesetzliche Sicherung zurück, im Rahmen der Grenze und binnen der Frist – das System funktionierte genau so, wie es soll. Der Fall ist trotzdem lehrreich, weil er zwei Dinge vorgeführt hat, die vorher als theoretisch galten.',
        },
        {
          type: 'list',
          items: [
            '**Der Zins war das Signal.** Die Bank hatte über Zinsplattformen Gelder eingeworben und lag dabei deutlich über dem Markt. Das ist kein Beweis für irgendetwas – aber es ist der Anlass, das Sicherungssystem zu prüfen, statt nur die Zinstabelle zu vergleichen.',
            '**Kommunen und Institutionelle waren nicht geschützt.** Die gesetzliche Sicherung gilt für Privatpersonen und kleinere Unternehmen. Städte, Kirchen und Verbände verloren dreistellige Millionenbeträge, weil sie von der Sicherung ausgenommen sind.',
            '**Die freiwillige Sicherung ist kein Rechtsanspruch.** Über die gesetzliche Grenze hinaus sichern viele Institute zusätzlich über Verbandseinrichtungen ab. Diese Systeme haben in der Vergangenheit zuverlässig geleistet – ein einklagbarer Anspruch daraus besteht aber nicht, und die Bedingungen sind seither mehrfach verschärft worden.',
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
            `Gesichert sind ${formatCurrencyRounded(GRENZE)} je Person und Institut – nicht je Konto.`,
            'Wertpapiere im Depot sind Sondervermögen und brauchen keine Sicherung.',
            'Zertifikate und Anleihen der eigenen Bank sind Forderungen gegen sie und ausdrücklich nicht gesichert.',
            'Mehrere Marken können ein Institut sein; das ist vor der Verteilung größerer Beträge zu prüfen.',
            'Nach Hausverkauf oder Erbschaft gilt sechs Monate lang ein höherer Schutz – gegen Nachweis.',
            'Auffällig hohe Zinsen sind kein Verbot, aber ein Anlass, das Sicherungssystem nachzulesen.',
          ],
        },
      ],
    },

    // -------------------------------------------------------- Fortgeschritten
    fortgeschritten: {
      metaTitle: 'Sicherungssysteme und Sonderfälle im Vergleich',
      metaDescription:
        'Gesetzliche Sicherung, freiwillige Fonds und Institutssicherung im Vergleich, temporär höhere Grenzen und die Lage bei Auslandsbanken.',
      title: 'Die Systeme und ihre Unterschiede',
      lead: 'Welche Systeme es gibt, worin sie sich rechtlich unterscheiden – und warum das im Ernstfall zählt.',
      readingMinutes: 10,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Drei Systeme nebeneinander',
        },
        {
          type: 'table',
          caption: 'Was sie leisten und worauf der Anspruch beruht',
          head: ['System', 'Umfang', 'Rechtliche Stellung'],
          rows: [
            [
              'Gesetzliche Einlagensicherung',
              `${formatCurrencyRounded(GRENZE)} je Person und Institut`,
              'Gesetzlicher Anspruch. Pflichtmitgliedschaft für jede Bank in der EU',
            ],
            [
              'Freiwilliger Sicherungsfonds',
              'Deutlich darüber hinaus, abhängig vom Eigenkapital der Bank',
              'Kein durchsetzbarer Rechtsanspruch – Leistung nach Satzung des Fonds',
            ],
            [
              'Institutssicherung',
              'Zielt darauf, das Institut selbst zu stützen, statt Einleger zu entschädigen',
              'Verbundprinzip bei Sparkassen und Genossenschaftsbanken; ebenfalls kein individueller Anspruch',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Der Unterschied, auf den es ankommt',
          items: [
            '**Rechtsanspruch** heißt: Du kannst ihn einklagen, und er besteht unabhängig davon, wie es dem Sicherungssystem geht.',
            '**Satzungsmäßige Leistung** heißt: Der Fonds leistet nach seinen Regeln, und diese Regeln kann er ändern. Deutsche Fonds haben ihre Grenzen in den vergangenen Jahren mehrfach abgesenkt.',
            'Das entwertet die freiwilligen Systeme nicht – sie haben in der Praxis zuverlässig gezahlt. Es heißt nur: Wer sich auf Beträge weit über der gesetzlichen Grenze verlässt, verlässt sich auf eine Zusage anderer Qualität.',
            'Die **Institutssicherung** verfolgt einen anderen Ansatz: Sie lässt das Institut gar nicht erst ausfallen. Für Einleger ist das im Ergebnis oft besser – ein Entschädigungsfall tritt dann nie ein.',
          ],
        },
        {
          type: 'figure',
          figure: 'einlagensicherung-anspruch',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Sonderfälle',
        },
        {
          type: 'list',
          items: [
            `**Vorübergehend höhere Grenze.** Nach bestimmten Ereignissen – Verkauf einer selbstgenutzten Immobilie, Erbschaft, Abfindung, Auszahlung aus einer Versicherung – gilt für ${ERHOEHT_MONATE} Monate ein erhöhter Schutz bis ${formatCurrencyRounded(ERHOEHT)}. Er greift nicht automatisch: Der Anlass muss im Entschädigungsfall nachgewiesen werden. Belege gehören also aufgehoben.`,
            '**Treuhand- und Anderkonten.** Wird ein Konto erkennbar für einen Dritten geführt, steht die Grenze wirtschaftlich diesem Dritten zu. Voraussetzung ist, dass die Treuhandstellung gegenüber der Bank offengelegt und dokumentiert ist.',
            '**Fremdwährungseinlagen.** Auch sie sind gesichert; entschädigt wird in Euro, umgerechnet zum Stichtag. Das Wechselkursrisiko bleibt also beim Einleger.',
            '**Zinsen.** Bis zum Eintritt des Sicherungsfalls aufgelaufene Zinsen zählen mit – allerdings innerhalb der Grenze, nicht zusätzlich. Wer sie ausschöpft, sollte den Puffer einplanen.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Banken im Ausland',
        },
        {
          type: 'paragraph',
          text: `Innerhalb der EU gilt überall dieselbe Grenze von ${formatCurrencyRounded(GRENZE)} – die Richtlinie ist harmonisiert. Zuständig ist aber immer das System des **Sitzlandes**, und dort liegen die praktischen Unterschiede.`,
        },
        {
          type: 'list',
          items: [
            '**Die Leistungsfähigkeit des Systems.** Ein nationaler Sicherungsfonds steht hinter dem Bankensektor seines Landes. Ist dieser Sektor im Verhältnis zur Wirtschaftskraft groß, ist die Zusage schwächer unterlegt als in einem Land mit kleinem Bankensektor. Island 2008 ist der Fall, an dem das sichtbar wurde.',
            '**Sprache und Antragswege.** Die Abwicklung läuft über die heimische Einrichtung, die als Zahlstelle auftritt – der Schriftverkehr im Streitfall aber nach dem Recht des Sitzlandes.',
            '**Zinsplattformen.** Sie vermitteln Festgeld bei Partnerbanken im europäischen Ausland. Vertragspartner ist die jeweilige Bank, nicht die Plattform. Wer über eine Plattform bei drei Banken anlegt, hat drei getrennte Grenzen – aber auch drei verschiedene Sicherungssysteme, deren Qualität sich unterscheidet.',
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
            'Nur die gesetzliche Sicherung gibt einen einklagbaren Anspruch; freiwillige Fonds leisten nach Satzung.',
            'Die Institutssicherung entschädigt nicht, sondern verhindert den Ausfall – für Einleger meist das bessere Ergebnis.',
            `Nach Immobilienverkauf oder Erbschaft gilt ${ERHOEHT_MONATE} Monate lang eine erhöhte Grenze – gegen Nachweis.`,
            'Im Ausland gilt dieselbe Grenze, aber ein anderes System; dessen Leistungsfähigkeit ist der eigentliche Unterschied.',
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ Profi
    profi: {
      metaTitle: 'Einlagensicherung: Abwicklungsrecht und Bail-in',
      metaDescription:
        'Haftungskaskade im Abwicklungsrecht, Bail-in-fähige Verbindlichkeiten, Deckungsgrad der Sicherungsfonds und Systemrisiko im Ernstfall.',
      title: 'Abwicklung, Haftungskaskade und Belastbarkeit',
      lead: 'Was heute an die Stelle der Bankeninsolvenz tritt, wer in welcher Reihenfolge haftet – und wie viel in den Fonds tatsächlich liegt.',
      readingMinutes: 13,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Abwicklung statt Insolvenz',
        },
        {
          type: 'paragraph',
          text: 'Nach 2008 wurde das Recht grundlegend umgebaut. Eine große Bank geht heute nicht mehr in ein normales Insolvenzverfahren – das dauerte Jahre und legte den Zahlungsverkehr still. Stattdessen greift eine **Abwicklungsbehörde** über ein Wochenende ein, mit Instrumenten, die es vorher nicht gab.',
        },
        {
          type: 'list',
          items: [
            '**Brückeninstitut.** Die überlebensfähigen Teile samt Kundeneinlagen werden auf eine neue Gesellschaft übertragen, die den Betrieb am Montag fortführt. Für Kunden ändert sich der Name, nicht der Kontostand.',
            '**Übertragung auf einen Erwerber.** Der Regelfall bei kleineren Instituten: Eine andere Bank übernimmt Geschäft und Einlagen. Ein Entschädigungsfall tritt dann gar nicht ein.',
            '**Ausgliederung der schlechten Vermögenswerte** in eine Abbaugesellschaft, die außerhalb des laufenden Betriebs abgewickelt wird.',
            '**Bail-in** – die Beteiligung der Eigentümer und Gläubiger an den Verlusten, bevor öffentliche Mittel fließen.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die Haftungskaskade',
        },
        {
          type: 'table',
          caption: 'Wer in welcher Reihenfolge herangezogen wird',
          head: ['Stufe', 'Wer haftet', 'Anmerkung'],
          rows: [
            [
              '1',
              'Eigenkapital der Aktionäre',
              'Wird zuerst und in voller Höhe aufgezehrt',
            ],
            [
              '2',
              'Hybride Instrumente (AT1) und Nachranganleihen',
              'Wandlung oder Abschreibung; kann bereits vor der Abwicklung greifen',
            ],
            [
              '3',
              'Nicht bevorrechtigte vorrangige Anleihen',
              'Eigens für diesen Zweck geschaffene Klasse – sie soll den Puffer vor den Einlagen bilden',
            ],
            [
              '4',
              'Übrige vorrangige Verbindlichkeiten und Einlagen über der Grenze',
              'Hier beginnt es Unternehmen und vermögende Privatpersonen zu treffen',
            ],
            [
              '5',
              'Gedeckte Einlagen',
              `Bis ${formatCurrencyRounded(GRENZE)} gesetzlich vom Bail-in ausgenommen – sie stehen ganz am Ende und werden praktisch nie erreicht`,
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'MREL – der Puffer, der Einleger schützt',
          items: [
            'Banken müssen einen Mindestbetrag an Eigenmitteln und bail-in-fähigen Verbindlichkeiten vorhalten. Diese Anforderung heißt MREL.',
            'Ihr eigentlicher Zweck ist nicht die Solvenz, sondern die **Abwickelbarkeit**: Es soll genug haftendes Material vorhanden sein, um Verluste zu tragen, bevor die Kaskade bei den Einlagen ankommt.',
            'Für Einleger ist MREL damit der wirksamere Schutz als der Sicherungsfonds – er verhindert den Entschädigungsfall, statt ihn zu bezahlen.',
            'Für Anleger, die Bankanleihen halten, ist es umgekehrt die Ansage, dass genau ihre Papiere zum Haftungsmaterial gehören.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Wie das praktisch aussieht, zeigen zwei Fälle. In **Zypern 2013** wurden Einlagen oberhalb der Grenze in erheblichem Umfang herangezogen – der erste große Fall, in dem Einleger tatsächlich verloren. Bei der **Credit Suisse 2023** wurden AT1-Papiere vollständig abgeschrieben, während Aktionäre noch Anteile erhielten; die gewohnte Reihenfolge war damit umgekehrt. Beide Fälle zeigen dieselbe Lehre: Die Kaskade ist Recht, aber ihre Anwendung im Einzelfall folgt der politischen Lage.',
        },
        {
          type: 'figure',
          figure: 'einlagensicherung-kaskade',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wie belastbar sind die Fonds?',
        },
        {
          type: 'paragraph',
          text: 'Die gesetzlichen Sicherungssysteme sind vorfinanziert: Die Banken zahlen laufend ein, bis ein festgelegter Anteil der gedeckten Einlagen erreicht ist. Dieser Anteil liegt im niedrigen einstelligen Prozentbereich – und das ist kein Versehen, sondern die Konstruktion.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Für den Einzelfall reicht es.** Fällt ein mittelgroßes Institut aus, ist der Fonds gut ausgestattet. Genau dafür ist er gebaut.',
            '**Für eine Systemkrise nicht.** Fallen mehrere große Institute gleichzeitig aus, übersteigt der Bedarf jeden vorfinanzierten Bestand. Dafür gibt es Nachschusspflichten der übrigen Banken und Kreditlinien – Mittel, die in einer Krise genau dann angefordert werden, wenn die übrigen Banken selbst unter Druck stehen.',
            '**Am Ende steht der Staat.** Ohne dass das irgendwo zugesagt wäre. Der gesamte Umbau nach 2008 zielte darauf, diese Notwendigkeit zu verringern – abgeschafft hat er sie nicht.',
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Was sich seit 2023 verändert hat',
          items: [
            'Beim Ausfall der Silicon Valley Bank flossen binnen eines Tages Beträge ab, für die früher Wochen nötig gewesen wären – ausgelöst über soziale Netzwerke, ausgeführt per App.',
            'Die Annahmen des Aufsichtsrechts über die Geschwindigkeit von Einlagenabflüssen stammen aus einer Zeit, in der man dafür in eine Filiale gehen musste. Sie sind damit erkennbar zu langsam kalibriert.',
            'Für Einleger folgt daraus nichts Neues, aber etwas Bestätigendes: Die Verteilung über mehrere Institute und über verschiedene Sicherungssysteme ist die einzige Maßnahme, die unabhängig von der Belastbarkeit eines einzelnen Systems wirkt.',
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
            'Große Banken gehen heute in die Abwicklung, nicht in die Insolvenz – Einlagen werden dabei meist übertragen.',
            'Gedeckte Einlagen stehen am Ende der Haftungskaskade und sind gesetzlich vom Bail-in ausgenommen.',
            'MREL schützt Einleger wirksamer als der Sicherungsfonds, weil es den Entschädigungsfall verhindert.',
            'Die Fonds sind für den Einzelfall gebaut, nicht für eine Systemkrise; Streuung über Institute bleibt die einzige eigene Maßnahme.',
          ],
        },
      ],
    },
  },
}
