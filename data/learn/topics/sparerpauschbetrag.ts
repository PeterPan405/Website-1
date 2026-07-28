import type { LearnTopic } from '@/data/learn/types'
import { formatCurrencyRounded, formatPercent } from '@/lib/format'
import {
  abgeltungsteuer as ABGELTUNGSTEUER,
  effektiverSteuersatz as effektiverSatz,
  soliAufSteuer as SOLI_AUF_STEUER,
  sparerPauschbetrag as PAUSCHBETRAG,
} from '@/lib/lernszenarien'

/*
  Steuersätze und Freibeträge stehen an genau einer Stelle.

  Dieses Thema besteht aus Zahlen, die der Gesetzgeber ändern kann und in der
  Vergangenheit geändert hat – der Sparerpauschbetrag zuletzt 2023. Getippt
  im Fließtext wären sie nach der nächsten Änderung an einem Dutzend Stellen
  falsch, und zwar auf einer Seite, die Menschen für ihre Steuererklärung
  lesen. Deshalb: einmal definiert, überall abgeleitet.

  Der effektive Satz wird ebenfalls gerechnet. „Rund 26 Prozent“ steht in
  vielen Ratgebern; die genaue Zahl ergibt sich aus Abgeltungsteuer plus
  Solidaritätszuschlag darauf – und der Zuschlag wirkt auf die Steuer, nicht
  auf den Ertrag. Das ist der Rechenfehler, der dabei am häufigsten passiert.
*/

/** Was von einem Ertrag oberhalb des Freibetrags übrig bleibt. */
function nachSteuern(ertrag: number): number {
  return ertrag * (1 - effektiverSatz / 100)
}

/*
  Vorabpauschale an einem durchgerechneten Beispiel.

  Basisertrag = Wert am Jahresanfang × Basiszins × 0,7. Die Vorabpauschale
  ist der kleinere Wert aus Basisertrag und tatsächlicher Wertsteigerung,
  vermindert um Ausschüttungen. Bei einem Aktienfonds bleiben davon 30
  Prozent teilfreigestellt.

  Der Basiszins wird jährlich neu festgesetzt; der hier verwendete Wert ist
  eine Annahme und steht im Text auch als solche.
*/
const BASISZINS_ANNAHME = 2.5
const BASISERTRAG_FAKTOR = 0.7
const TEILFREISTELLUNG_AKTIENFONDS = 30

const depotwert = 50_000
const wertsteigerung = 4_000
const basisertrag = depotwert * (BASISZINS_ANNAHME / 100) * BASISERTRAG_FAKTOR
const vorabpauschale = Math.min(basisertrag, wertsteigerung)
const steuerpflichtig = vorabpauschale * (1 - TEILFREISTELLUNG_AKTIENFONDS / 100)

/**
 * Vollständig ausgearbeitetes Thema.
 *
 * Stufenaufbau: Beginner erklärt den Freibetrag und den Freistellungsauftrag
 * samt der häufigsten Fehler. Fortgeschritten behandelt die Verteilung über
 * mehrere Institute, die Anlage KAP und Sonderfälle. Profi geht auf
 * Verlusttöpfe, Vorabpauschale und Teilfreistellung ein.
 *
 * ## Zum Umgang mit Rechtsstand
 *
 * Alle Beträge stehen als Konstanten oben in dieser Datei und tragen im Text
 * den Hinweis, dass sie geändert werden können. Dieses Thema ist das mit dem
 * kürzesten Haltbarkeitsdatum im gesamten Lernbereich.
 */
export const sparerpauschbetrag: LearnTopic = {
  slug: 'sparerpauschbetrag',
  title: 'Sparerpauschbetrag',
  headline: 'Der Freibetrag, der nicht von allein wirkt',
  metaTitle: 'Sparerpauschbetrag richtig nutzen: so funktioniert es',
  metaDescription:
    'Wie der Freibetrag für Kapitalerträge wirkt, wie du Freistellungsaufträge sinnvoll verteilst und was bei mehreren Depots und Verlusttöpfen zu beachten ist.',
  lead: 'Der Sparerpauschbetrag stellt Kapitalerträge bis zu einer Jahresgrenze steuerfrei – aber nur, wenn du ihn aktiv zuweist.',
  overview: [
    'Zinsen, Dividenden und realisierte Kursgewinne sind bis zum Sparerpauschbetrag steuerfrei. Darüber greift die Abgeltungsteuer samt Solidaritätszuschlag und gegebenenfalls Kirchensteuer.',
    'Der Freibetrag wirkt nicht automatisch: Ohne Freistellungsauftrag führt die Bank ab dem ersten Euro Steuer ab. Er ist außerdem ein Jahresbetrag – was bis zum 31. Dezember nicht genutzt wurde, ist weg.',
    'Die Stufen behandeln Grundlagen und Freistellungsauftrag, dann die Verteilung über mehrere Institute und die Steuererklärung, schließlich Verlusttöpfe, Vorabpauschale und Teilfreistellung.',
  ],
  keywords: [
    'Sparerpauschbetrag',
    'Freistellungsauftrag',
    'Abgeltungsteuer',
    'Kapitalerträge',
    'Vorabpauschale',
    'Verlusttopf',
  ],
  related: ['tagesgeld', 'etf', 'aktie', 'fonds'],
  levels: {
    // ---------------------------------------------------------------- Beginner
    beginner: {
      metaTitle: 'Sparerpauschbetrag einfach erklärt: so wirkt er',
      metaDescription:
        'Welche Erträge unter den Freibetrag fallen, wie ein Freistellungsauftrag funktioniert und warum ungenutzter Freibetrag am Jahresende verfällt.',
      title: 'Welche Erträge steuerfrei bleiben',
      lead: 'Was unter den Freibetrag fällt, was du dafür tun musst – und die vier Fehler, die er am häufigsten kostet.',
      readingMinutes: 7,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: `Auf Kapitalerträge zahlt man in Deutschland Steuern – aber erst oberhalb eines Freibetrags. Der **Sparerpauschbetrag** beträgt derzeit ${formatCurrencyRounded(PAUSCHBETRAG)} je Person und Jahr, für zusammen veranlagte Ehepaare ${formatCurrencyRounded(2 * PAUSCHBETRAG)}. Was darunter bleibt, ist steuerfrei. Der Betrag wurde zuletzt 2023 angehoben und kann wieder geändert werden – vor jeder Planung lohnt der Blick auf den aktuellen Stand.`,
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was dazuzählt',
        },
        {
          type: 'list',
          items: [
            '**Zinsen** aus Tagesgeld, Festgeld und Anleihen.',
            '**Dividenden** aus Aktien und **Ausschüttungen** aus Fonds und ETFs.',
            '**Realisierte Kursgewinne** – also erst beim Verkauf, nicht bei bloßer Wertsteigerung im Depot.',
            '**Die Vorabpauschale** bei thesaurierenden Fonds. Sie ist der einzige Posten, der ohne jede eigene Handlung entsteht; mehr dazu in der Profi-Stufe.',
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Was oberhalb der Grenze abgeht',
          items: [
            `**Abgeltungsteuer:** ${formatPercent(ABGELTUNGSTEUER, 0)} des Ertrags.`,
            `**Solidaritätszuschlag:** ${formatPercent(SOLI_AUF_STEUER, 1)} – aber auf die Steuer, nicht auf den Ertrag. Zusammen sind das ${formatPercent(effektiverSatz, 3)}.`,
            '**Kirchensteuer**, falls kirchensteuerpflichtig: 8 oder 9 Prozent der Abgeltungsteuer, je nach Bundesland. Sie mindert zugleich die Bemessungsgrundlage, sodass der Gesamtsatz etwas unter der schlichten Addition liegt.',
            `Von ${formatCurrencyRounded(1_000)} Ertrag oberhalb des Freibetrags bleiben ohne Kirchensteuer also rund ${formatCurrencyRounded(nachSteuern(1_000))}.`,
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Der Freistellungsauftrag',
        },
        {
          type: 'paragraph',
          text: 'Der Freibetrag wirkt nicht von selbst. Ohne **Freistellungsauftrag** führt die Bank vom ersten Euro an Steuer ab – sie kann nicht wissen, ob du den Freibetrag anderswo schon ausgeschöpft hast. Der Auftrag ist in wenigen Minuten online eingerichtet; nötig ist nur die Steuer-Identifikationsnummer.',
        },
        {
          type: 'paragraph',
          text: `Er lässt sich auf beliebig viele Institute verteilen – in der Summe darf er aber ${formatCurrencyRounded(PAUSCHBETRAG)} nicht überschreiten. Die Banken melden die erteilten Aufträge, und eine Überschreitung fällt auf.`,
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die vier häufigen Fehler',
        },
        {
          type: 'table',
          caption: 'Was den Freibetrag kostet – und was dagegen hilft',
          head: ['Fehler', 'Folge', 'Abhilfe'],
          rows: [
            [
              'Gar kein Auftrag gestellt',
              'Steuer wird ab dem ersten Euro abgezogen',
              'Auftrag stellen; zu viel Gezahltes über die Steuererklärung zurückholen',
            ],
            [
              'Auftrag bei der falschen Bank',
              'Er liegt dort, wo kaum Erträge anfallen, und läuft ins Leere',
              'Vor der Verteilung schätzen, wo welche Erträge entstehen',
            ],
            [
              'Nicht angepasst nach einem Wechsel',
              'Nach einem Depotübertrag steht der Auftrag noch beim alten Institut',
              'Einmal jährlich alle Aufträge durchsehen',
            ],
            [
              'Rest verfallen lassen',
              'Nicht genutzter Freibetrag ist zum 31. Dezember weg – es gibt keinen Übertrag',
              'Gegen Jahresende prüfen und gegebenenfalls Gewinne gezielt realisieren',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Der letzte Punkt ist der wertvollste',
          items: [
            'Ist der Freibetrag im November noch nicht ausgeschöpft, lässt sich der Rest nutzen, indem man Anteile mit Gewinn verkauft und sofort wieder kauft.',
            'Der Gewinn wird dadurch steuerfrei vereinnahmt, und der Einstandskurs steigt – spätere Verkäufe versteuern entsprechend weniger.',
            'Zu rechnen ist gegen die Ordergebühren und den Spread. Bei kleinen Beträgen und teurem Broker lohnt es sich nicht; bei einem Restfreibetrag im dreistelligen Bereich und günstigen Konditionen meist schon.',
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Allgemeine Information, keine Steuerberatung',
          items: [
            'Dieser Text erklärt die Systematik. Er ersetzt keine Beratung im Einzelfall und bildet den Rechtsstand zum Zeitpunkt der Erstellung ab.',
            'Beträge und Sätze werden vom Gesetzgeber geändert. Vor einer Entscheidung gehört der aktuelle Stand geprüft.',
          ],
        },
        {
          type: 'figure',
          figure: 'sparerpauschbetrag-grenze',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was du dir merken solltest',
        },
        {
          type: 'list',
          items: [
            `${formatCurrencyRounded(PAUSCHBETRAG)} je Person und Jahr, für Ehepaare das Doppelte.`,
            'Ohne Freistellungsauftrag zieht die Bank ab dem ersten Euro ab.',
            'Der Auftrag lässt sich verteilen, in der Summe aber nicht überschreiten.',
            'Was bis zum Jahresende nicht genutzt ist, verfällt.',
          ],
        },
      ],
    },

    // -------------------------------------------------------- Fortgeschritten
    fortgeschritten: {
      metaTitle: 'Freistellungsauftrag verteilen und Anlage KAP nutzen',
      metaDescription:
        'Wie du den Freibetrag über mehrere Institute verteilst, wann sich die Anlage KAP lohnt und was bei Kirchensteuer, Kinderdepots und Auslandsdepots gilt.',
      title: 'Verteilen, erklären, Sonderfälle',
      lead: 'Wie der Freibetrag dorthin kommt, wo er wirkt – und wann die Steuererklärung Geld zurückholt.',
      readingMinutes: 10,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Die Verteilung planen statt schätzen',
        },
        {
          type: 'paragraph',
          text: 'Wer mehrere Konten und Depots hat, verteilt den Freibetrag am besten nach einer kurzen Schätzung – und in einer bestimmten Reihenfolge, weil sich manche Erträge steuern lassen und andere nicht.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Zuerst das Fondsdepot mit thesaurierenden Anteilen.** Die Vorabpauschale wird Anfang Januar automatisch belastet, ohne dass du etwas tust. Liegt dort kein Freistellungsauftrag, wird sofort Steuer abgeführt – und das Verrechnungskonto muss gedeckt sein.',
            '**Dann die Konten mit planbaren Zinsen.** Tages- und Festgeld: Der Ertrag lässt sich vorab gut abschätzen.',
            '**Dann die Depots mit Dividenden.** Auch die sind ungefähr kalkulierbar.',
            '**Zuletzt der Rest.** Realisierte Kursgewinne entstehen nur, wenn du verkaufst – und darüber entscheidest du selbst. Diesen Posten kann man ans Ende der Reihenfolge stellen, weil er sich steuern lässt.',
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Beim Depotwechsel',
          items: [
            'Der Freistellungsauftrag wandert **nicht** mit. Er bleibt beim alten Institut stehen und blockiert dort einen Teil des Freibetrags.',
            'Erst beim alten Institut widerrufen oder herabsetzen, dann beim neuen erteilen – in dieser Reihenfolge, sonst überschreitet die Summe kurzzeitig die Grenze.',
            'Auch die Anschaffungsdaten wandern mit dem Depotübertrag. Werden sie nicht übermittelt – etwa bei einem Übertrag aus dem Ausland –, unterstellt die neue Bank eine pauschale Ersatzbemessungsgrundlage, die deutlich ungünstiger ausfallen kann.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was die Steuererklärung zurückholt',
        },
        {
          type: 'paragraph',
          text: 'Die Bank behält die Steuer automatisch ein – damit ist die Sache grundsätzlich erledigt. In vier Fällen lohnt die **Anlage KAP** trotzdem, und in einem davon ist sie sogar verpflichtend.',
        },
        {
          type: 'table',
          caption: 'Wann sich die Anlage KAP lohnt',
          head: ['Fall', 'Was passiert'],
          rows: [
            [
              'Freibetrag nicht ausgeschöpft, aber Steuer gezahlt',
              'Der ungenutzte Teil wird nachträglich angerechnet und die Steuer erstattet',
            ],
            [
              'Verluste bei Bank A, Gewinne bei Bank B',
              'Die Banken verrechnen nur institutsintern. Über die Erklärung lässt sich institutsübergreifend verrechnen',
            ],
            [
              'Persönlicher Steuersatz unter dem Abgeltungssatz',
              'Die Günstigerprüfung wendet den niedrigeren Satz an – das Finanzamt prüft von Amts wegen, wenn die Anlage beiliegt',
            ],
            [
              'Erträge aus einem ausländischen Depot',
              'Dort wird nichts automatisch abgeführt. Die Erklärung ist dann Pflicht, nicht Option',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Die Verlustbescheinigung hat eine Frist',
          items: [
            'Um Verluste bei Bank A gegen Gewinne bei Bank B zu stellen, braucht es eine **Verlustbescheinigung** von Bank A.',
            'Sie muss bis zum **15. Dezember** des jeweiligen Jahres beantragt werden. Diese Frist ist gesetzlich und nicht verlängerbar.',
            'Wer sie versäumt, verliert die Verrechnung nicht endgültig – die Verluste bleiben im Topf der Bank A und werden dort auf Folgejahre vorgetragen. Sie sind nur eben in diesem Jahr nicht nutzbar.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Weitere Fälle',
        },
        {
          type: 'list',
          items: [
            '**Kirchensteuer.** Sie wird standardmäßig automatisch mit abgeführt; die Bank fragt die Zugehörigkeit einmal jährlich beim Bundeszentralamt ab. Wer das nicht möchte, kann einen **Sperrvermerk** setzen – dann erfährt die Bank nichts, und die Kirchensteuer läuft über die Steuererklärung. Sie entfällt dadurch nicht.',
            '**Nichtveranlagungsbescheinigung.** Wer mit seinem gesamten Einkommen unter dem Grundfreibetrag bleibt – typisch bei Studierenden, Kindern und teils im Ruhestand –, kann sie beim Finanzamt beantragen. Sie stellt die Erträge vollständig frei, also über den Sparerpauschbetrag hinaus.',
            '**Kinderdepots.** Ein Kind hat einen eigenen Sparerpauschbetrag und einen eigenen Grundfreibetrag. Das Geld gehört dann aber rechtlich dem Kind – unwiderruflich und mit voller Verfügung ab dem 18. Geburtstag. Eigene Erträge des Kindes können außerdem die Familienversicherung und den Kindergeldanspruch berühren; das gehört vorher geklärt.',
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
            'Zuerst dort freistellen, wo die Vorabpauschale anfällt – sie kommt ohne dein Zutun.',
            'Beim Depotwechsel den alten Auftrag widerrufen, bevor der neue erteilt wird.',
            'Institutsübergreifende Verlustverrechnung geht nur über die Anlage KAP.',
            'Die Verlustbescheinigung muss bis zum 15. Dezember beantragt sein.',
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ Profi
    profi: {
      metaTitle: 'Kapitalerträge: Verlusttöpfe, Vorabpauschale, Gestaltung',
      metaDescription:
        'Verlustverrechnungstöpfe und ihre Grenzen, Vorabpauschale und Teilfreistellung im Zusammenspiel sowie zulässige Gestaltung und ihre Fallstricke.',
      title: 'Töpfe, Pauschale und Gestaltung',
      lead: 'Warum Verluste nicht gleich Verluste sind, wie die Vorabpauschale gerechnet wird – und wo die Gestaltung endet.',
      readingMinutes: 12,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Verluste sind nicht gleich Verluste',
        },
        {
          type: 'paragraph',
          text: 'Jede Bank führt für dich getrennte **Verlustverrechnungstöpfe**, und zwischen ihnen gibt es keinen Übergang. Das ist die folgenreichste Einzelheit des deutschen Kapitalertragsteuerrechts und wird regelmäßig zu spät bemerkt.',
        },
        {
          type: 'table',
          caption: 'Die Töpfe und was in sie hineindarf',
          head: ['Topf', 'Enthält', 'Verrechenbar mit'],
          rows: [
            [
              'Aktienverlusttopf',
              'Verluste aus dem Verkauf einzelner Aktien',
              'Ausschließlich Gewinnen aus dem Verkauf einzelner Aktien – nicht mit Dividenden, nicht mit Fondsgewinnen',
            ],
            [
              'Allgemeiner Topf',
              'Verluste aus Fonds, ETFs, Anleihen, Zertifikaten',
              'Allen übrigen Kapitalerträgen einschließlich Zinsen und Dividenden',
            ],
            [
              'Quellensteuertopf',
              'Im Ausland einbehaltene anrechenbare Quellensteuer',
              'Wird auf die deutsche Steuer angerechnet, ist aber kein Verlusttopf im engeren Sinn',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Was daraus praktisch folgt',
          items: [
            'Wer mit Einzelaktien Verluste macht und mit ETFs Gewinne, kann beides **nicht** gegeneinander stellen. Der Aktienverlust bleibt liegen, der ETF-Gewinn wird versteuert.',
            'Der Aktienverlusttopf wird über die Jahre vorgetragen – unbegrenzt, aber immer topfgebunden. Wer nie wieder Einzelaktien mit Gewinn verkauft, nutzt ihn nie.',
            'Für **Termingeschäfte** galt zeitweise eine zusätzliche betragsmäßige Verrechnungsgrenze, die Absicherungsstrategien empfindlich traf. Sie war verfassungsrechtlich umstritten, und die Rechtslage hat sich seither geändert – wer betroffen ist, sollte den aktuellen Stand prüfen lassen.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die Vorabpauschale',
        },
        {
          type: 'paragraph',
          text: 'Ein thesaurierender Fonds schüttet nichts aus – ohne weitere Regel bliebe er bis zum Verkauf unbesteuert, ein ausschüttender nicht. Die **Vorabpauschale** gleicht das aus: Sie besteuert jährlich einen fiktiven Mindestertrag. Sie wird Anfang Januar für das Vorjahr berechnet und direkt vom Verrechnungskonto eingezogen.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Die Rechnung an einem Beispiel',
          items: [
            `**Basisertrag:** Wert am Jahresanfang × Basiszins × ${formatPercent(BASISERTRAG_FAKTOR * 100, 0)}. Bei ${formatCurrencyRounded(depotwert)} Fondswert und einem angenommenen Basiszins von ${formatPercent(BASISZINS_ANNAHME, 1)} sind das ${formatCurrencyRounded(basisertrag)}.`,
            `**Deckelung:** Die Vorabpauschale ist höchstens die tatsächliche Wertsteigerung. Bei ${formatCurrencyRounded(wertsteigerung)} Wertzuwachs bleibt es also bei ${formatCurrencyRounded(vorabpauschale)} – bei einem Verlustjahr wäre sie null.`,
            `**Teilfreistellung:** Bei einem Aktienfonds sind ${formatPercent(TEILFREISTELLUNG_AKTIENFONDS, 0)} steuerfrei. Steuerpflichtig bleiben ${formatCurrencyRounded(steuerpflichtig)}.`,
            `**Freibetrag:** Liegt ein Freistellungsauftrag vor und ist der Sparerpauschbetrag noch nicht ausgeschöpft, wird gar nichts abgeführt – ${formatCurrencyRounded(steuerpflichtig)} liegen deutlich unter ${formatCurrencyRounded(PAUSCHBETRAG)}.`,
            'Der Basiszins wird jährlich vom Bundesfinanzministerium festgesetzt; der hier verwendete Wert ist eine Annahme für die Rechnung.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Zwei Punkte werden dabei regelmäßig missverstanden. Erstens ist das **keine Doppelbesteuerung**: Alle gezahlten Vorabpauschalen werden beim späteren Verkauf vom Gewinn abgezogen. Zweitens braucht es **Liquidität** – der Betrag wird eingezogen, auch wenn man nichts verkauft hat. Ist das Verrechnungskonto nicht gedeckt, kann daraus eine Kontoüberziehung werden.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Teilfreistellung',
        },
        {
          type: 'paragraph',
          text: 'Fonds zahlen auf Ebene des Fondsvermögens bereits Steuern. Damit dieselben Erträge nicht zweimal erfasst werden, bleibt beim Anleger ein Teil steuerfrei – die **Teilfreistellung**. Wie hoch sie ausfällt, hängt an der Aktienquote des Fonds: Aktienfonds erhalten den höchsten Satz, Mischfonds die Hälfte davon, reine Renten- und Geldmarktfonds gar keinen.',
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Der Effekt auf den Freibetrag',
          items: [
            'Die Teilfreistellung wirkt **vor** dem Sparerpauschbetrag. Der Freibetrag reicht damit weiter, als er auf den ersten Blick aussieht.',
            `Bei einem Aktienfonds mit ${formatPercent(TEILFREISTELLUNG_AKTIENFONDS, 0)} Teilfreistellung deckt der Freibetrag rechnerisch Bruttoerträge von rund ${formatCurrencyRounded(PAUSCHBETRAG / (1 - TEILFREISTELLUNG_AKTIENFONDS / 100))} ab.`,
            'Umgekehrt heißt das: Ein Rentenfonds ohne Teilfreistellung verbraucht den Freibetrag schneller als ein Aktienfonds mit gleicher Ausschüttung.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Gestaltung und ihre Grenzen',
        },
        {
          type: 'list',
          items: [
            '**Freibetrag über Familienmitglieder.** Ein Depot auf den Namen des Kindes nutzt dessen eigenen Freibetrag. Anerkannt wird das nur, wenn das Geld tatsächlich dem Kind gehört – also endgültig übertragen ist und nicht wieder für eigene Zwecke verwendet wird. Wer die Verfügungsmacht behält, hat steuerlich nichts erreicht.',
            '**Gewinne gezielt realisieren.** Verkaufen und sofort zurückkaufen hebt den Einstandskurs und nutzt den Freibetrag. Zu beachten ist das **FIFO-Prinzip**: Verkauft werden immer die ältesten Anteile, also bei gestiegenen Kursen die mit dem höchsten Gewinn. Wer nur einen Teil verkaufen will, kann die Reihenfolge nicht wählen – wohl aber über getrennte Depots vorsteuern.',
            '**Ausschüttend oder thesaurierend je Lebensphase.** In der Ansparphase ist thesaurierend bequemer. Wer den Freibetrag sonst ungenutzt ließe, fährt mit einem ausschüttenden Fonds besser – die Ausschüttung füllt ihn ohne eigenes Zutun. Ein Wechsel zwischen beiden ist allerdings ein Verkauf und löst Steuer aus; er lohnt sich fast nie nachträglich.',
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Allgemeine Information, keine Steuerberatung',
          items: [
            'Dieser Text stellt die Systematik dar. Er ersetzt keine Beratung und bildet den Rechtsstand zum Zeitpunkt der Erstellung ab.',
            'Gerade Verlustverrechnung, Vorabpauschale und Übertragungen innerhalb der Familie hängen an Einzelheiten, die sich im konkreten Fall auswirken.',
            'Bei größeren Beträgen oder Auslandsbezug gehört das zu jemandem mit Zulassung.',
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
            'Aktienverluste sind nur mit Aktiengewinnen verrechenbar – nicht mit Dividenden und nicht mit Fondsgewinnen.',
            'Die Vorabpauschale ist keine Doppelbesteuerung, verlangt aber Liquidität auf dem Verrechnungskonto.',
            'Die Teilfreistellung wirkt vor dem Freibetrag und lässt ihn weiter reichen.',
            'Ein Depot auf den Namen des Kindes wirkt steuerlich nur, wenn das Geld ihm tatsächlich gehört.',
          ],
        },
      ],
    },
  },
}
