import type { LearnTopic } from '@/data/learn/types'
import {
  inflationsbeispiel,
  kaufkraftende,
  kaufkraftreihe,
  realzinsbeispiel,
} from '@/lib/inflations-beispiele'
import { formatCurrencyRounded, formatNumber, formatPercent } from '@/lib/format'

/*
  Zahlen gerechnet statt geschrieben.

  Dieselbe Ausnahme wie in `zinseszins.ts`: `lib/inflations-beispiele.ts` ist
  reine Rechnung ohne eigene Datenabhängigkeit, es entsteht also kein Kreis.
  Der Grund ist derselbe – dieselben Zahlen stehen zusätzlich in der Grafik
  daneben und im Inflationsrechner der Website. Als Literale wären das drei
  Quellen für dieselbe Aussage, und die laufen erfahrungsgemäß auseinander.
*/

const beispiel = inflationsbeispiel
const reihe = kaufkraftreihe()

/**
 * Vollständig ausgearbeitetes Thema.
 *
 * Stufenaufbau: Beginner klärt Messung, den Richtungsfehler und den
 * Kaufkraftverlust in Zahlen. Fortgeschritten behandelt Ursachen, Kerninflation,
 * Basiseffekte und Erwartungen. Profi prüft die gängigen Inflationsschutz-
 * Versprechen und rechnet die Scheingewinnbesteuerung durch.
 *
 * ## Warum keine aktuellen Inflationsraten im Text stehen
 *
 * Eine Rate ist einen Monat lang aktuell. Auf einer Seite, die Jahre steht,
 * wäre sie eine tickende Falschaussage. Die Beispiele rechnen deshalb mit einer
 * runden Annahme, die als Annahme gekennzeichnet ist – wer die echte Zahl
 * braucht, findet sie beim Statistischen Bundesamt.
 */
export const inflation: LearnTopic = {
  slug: 'inflation',
  title: 'Inflation',
  headline: 'Inflation: warum Geld ohne Zutun weniger wert wird',
  metaTitle: 'Inflation erklärt: Ursachen, Messung und Schutz',
  metaDescription:
    'Wie die Inflationsrate gemessen wird, warum eine sinkende Rate keine sinkenden Preise bedeutet und welche Anlagen tatsächlich vor Kaufkraftverlust schützen.',
  lead: 'Inflation ist der stille Posten in jeder Geldanlage: Sie steht auf keinem Kontoauszug und wirkt trotzdem jedes Jahr.',
  overview: [
    'Inflation bezeichnet den Anstieg des allgemeinen Preisniveaus. Für die Geldanlage ist sie die Messlatte: Erst was über der Inflationsrate liegt, ist ein echter Zuwachs.',
    'Der häufigste Denkfehler betrifft die Richtung: Eine fallende Inflationsrate bedeutet nicht, dass Dinge billiger werden, sondern nur, dass sie langsamer teurer werden. Der Preissprung vergangener Jahre bleibt im System.',
    'Die Stufen führen von Messung und Warenkorb über Ursachen, Erwartungen und die Rolle der Notenbanken bis zu der Frage, welche Anlagen historisch tatsächlich Kaufkraft erhalten haben – und welche nur als Inflationsschutz gelten.',
  ],
  keywords: [
    'Inflation',
    'Inflationsrate',
    'Kaufkraft',
    'Verbraucherpreisindex',
    'Realzins',
    'Deflation',
    'Warenkorb',
    'Teuerung',
  ],
  related: ['zinseszins', 'tagesgeld', 'notenbanken-geldpolitik', 'rohstoffe'],
  calculators: ['/rechner/inflationsrechner', '/rechner/zinsrechner'],
  levels: {
    // ---------------------------------------------------------------- Beginner
    beginner: {
      metaTitle: 'Inflation einfach erklärt – Grundlagen für Einsteiger',
      metaDescription:
        'Was Inflation bedeutet, wie sie gemessen wird, warum eine sinkende Rate keine sinkenden Preise sind und was Kaufkraftverlust konkret heißt.',
      title: 'Inflation einfach erklärt',
      lead: 'Nach dieser Stufe kannst du die Inflationsrate richtig lesen, den häufigsten Denkfehler vermeiden und ausrechnen, was Inflation mit deinem Ersparten macht.',
      readingMinutes: 8,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Dein Geld liegt auf dem Konto und die Zahl darauf ändert sich nicht. Trotzdem kannst du dir davon jedes Jahr etwas weniger kaufen. Das ist Inflation: nicht dein Geld wird weniger, sondern das, was du dafür bekommst.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wie die Rate zustande kommt',
        },
        {
          type: 'paragraph',
          text: 'Das Statistische Bundesamt führt einen **Warenkorb** – rund 700 Güter und Dienstleistungen, von Brot über Miete bis zur Autoversicherung. Jeder Posten bekommt ein Gewicht danach, wie viel ein durchschnittlicher Haushalt dafür ausgibt. Die Miete wiegt schwer, Salz wiegt fast nichts.',
        },
        {
          type: 'paragraph',
          text: 'Jeden Monat werden für diesen Korb Hunderttausende Preise erhoben. Die Inflationsrate ist dann der Vergleich mit **demselben Monat des Vorjahres** – nicht mit dem Vormonat. Steht in den Nachrichten „Inflation im Juni bei 2,3 Prozent“, heißt das: Der Warenkorb kostet 2,3 Prozent mehr als im Juni des Vorjahres.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Warum es zwei Zahlen gibt',
          items: [
            'Der **Verbraucherpreisindex (VPI)** ist die deutsche Größe und die, die in den Nachrichten genannt wird.',
            'Der **harmonisierte Verbraucherpreisindex (HVPI)** ist nach europaweit einheitlichen Regeln gebaut, damit die Länder vergleichbar sind. Die EZB steuert nach ihm.',
            'Die beiden weichen meist um wenige Zehntel ab – hauptsächlich, weil sie selbstgenutztes Wohneigentum unterschiedlich behandeln.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Deine persönliche Rate ist fast nie die veröffentlichte. Wer zur Miete wohnt und pendelt, spürt Mietsteigerungen und Spritpreise stärker als jemand mit abbezahltem Haus im Ort. Die amtliche Zahl beschreibt einen Durchschnittshaushalt, den es so nicht gibt – das ist keine Schwäche der Statistik, sondern die Natur eines Durchschnitts.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Der häufigste Denkfehler',
        },
        {
          type: 'paragraph',
          text: 'Wenn die Inflationsrate von 6 auf 2 Prozent fällt, wird nichts billiger. Die Preise steigen nur langsamer weiter. Der Sprung der Vorjahre bleibt vollständig im System – er wird nicht zurückgenommen.',
        },
        {
          type: 'paragraph',
          text: 'Das erklärt eine Beobachtung, die vielen widersprüchlich vorkommt: Die Rate sinkt, die Nachrichten melden Entspannung, und im Supermarkt ist alles trotzdem teuer. Beides stimmt. Die Rate misst die Geschwindigkeit, nicht den Stand.',
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Drei Begriffe, die oft verwechselt werden',
          items: [
            '**Inflation** – die Preise steigen.',
            '**Disinflation** – die Preise steigen weiter, aber langsamer als zuvor. Das ist der Normalfall nach einem Preisschub.',
            '**Deflation** – die Preise fallen tatsächlich. Klingt zunächst gut und gilt unter Fachleuten als das gefährlichere Übel: Wer erwartet, dass alles nächstes Jahr billiger ist, verschiebt Anschaffungen. Die Nachfrage bricht ein, Unternehmen entlassen, die Preise fallen weiter – eine Spirale, aus der herauszukommen deutlich schwerer ist als aus moderater Inflation.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was das mit deinem Ersparten macht',
        },
        {
          type: 'paragraph',
          text: `Nimm ${formatCurrencyRounded(beispiel.betrag)}, die unverzinst liegen bleiben, und eine Inflationsrate von ${formatPercent(beispiel.rate, 1)} im Jahr. Die Zahl auf dem Konto bleibt gleich. Was du dafür kaufen kannst, nicht:`,
        },
        {
          type: 'figure',
          figure: 'inflation-kaufkraft',
        },
        {
          type: 'table',
          caption: `Kaufkraft von ${formatCurrencyRounded(beispiel.betrag)} bei ${formatPercent(beispiel.rate, 1)} Inflation`,
          head: [
            'Nach',
            'Kaufkraft in heutigem Geld',
            'Verlust',
            'Nötig für dieselbe Menge',
          ],
          rows: beispiel.stuetzjahre.map((jahr) => {
            const zeile = reihe[jahr]
            return [
              `${jahr} Jahren`,
              formatCurrencyRounded(zeile.kaufkraft),
              formatPercent(zeile.verlustProzent, 1),
              formatCurrencyRounded(zeile.noetig),
            ]
          }),
        },
        {
          type: 'paragraph',
          text: `Nach ${beispiel.jahre} Jahren sind aus ${formatCurrencyRounded(beispiel.betrag)} real ${formatCurrencyRounded(kaufkraftende.kaufkraft)} geworden – ein Verlust von ${formatPercent(kaufkraftende.verlustProzent, 1)}, ohne dass irgendjemand etwas abgebucht hätte. Bei dieser Rate halbiert sich die Kaufkraft in rund ${formatNumber(kaufkraftende.halbierungNachJahren ?? 0, 0)} Jahren.`,
        },
        {
          type: 'heading',
          level: 2,
          text: 'Realzins: die einzige Zahl, die zählt',
        },
        {
          type: 'paragraph',
          text: `Ein Zins von ${formatPercent(realzinsbeispiel.nominal, 1)} klingt nach Zuwachs. Liegt die Inflation bei ${formatPercent(realzinsbeispiel.inflation, 1)}, ist er keiner: Der **Realzins** beträgt ${formatPercent(realzinsbeispiel.real, 2)}. Du hast am Jahresende mehr Geld und kannst dir weniger davon kaufen.`,
        },
        {
          type: 'formula',
          expression: 'Realzins = (1 + Nominalzins) ÷ (1 + Inflationsrate) − 1',
          description:
            'Genau genommen ein Quotient, nicht eine Differenz. Bei kleinen Raten ist der Unterschied zur einfachen Subtraktion gering; bei hohen Raten wird er spürbar.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Die verlässlichsten Verlierer',
          items: [
            'Bargeld: Zins null, Kaufkraftverlust in voller Höhe der Inflationsrate.',
            'Girokonto: praktisch dasselbe, nur mit einer Kontoführungsgebühr obendrauf.',
            'Das heißt nicht, dass man kein Bargeld halten sollte. Der Notgroschen hat eine Aufgabe, und die ist Verfügbarkeit, nicht Rendite. Es heißt nur: Was darüber hinaus jahrelang auf dem Konto liegt, verliert planmäßig.',
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
            'Die Inflationsrate vergleicht mit dem Vorjahresmonat und misst Geschwindigkeit, nicht Preisniveau.',
            'Eine fallende Rate bedeutet nicht fallende Preise – der Anstieg der Vorjahre bleibt.',
            'Deine persönliche Rate weicht ab, weil dein Warenkorb ein anderer ist.',
            'Erst der Realzins sagt, ob du reicher geworden bist. Nominal ist eine Zahl, real ist ein Ergebnis.',
          ],
        },
      ],
    },

    // -------------------------------------------------------- Fortgeschritten
    fortgeschritten: {
      metaTitle: 'Inflation: Ursachen, Kerninflation und Erwartungen',
      metaDescription:
        'Nachfrage- und Angebotsinflation, Zweitrundeneffekte, Kerninflation und warum Inflationserwartungen für Notenbanken wichtiger sind als die aktuelle Rate.',
      title: 'Woher Inflation kommt',
      lead: 'Welche Ursachen unterschieden werden, was Kerninflation aussagt und warum Erwartungen die Rate selbst beeinflussen.',
      readingMinutes: 11,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Inflation ist kein einheitliches Phänomen. Ob die Preise steigen, weil zu viel Geld auf zu wenig Ware trifft, oder weil die Produktion teurer geworden ist, macht für die Diagnose den ganzen Unterschied – und erst recht für die Frage, was dagegen hilft.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Zwei Ursachen, zwei Verläufe',
        },
        {
          type: 'table',
          caption: 'Nachfrage- und Angebotsinflation im Vergleich',
          head: ['', 'Nachfrageinflation', 'Angebotsinflation'],
          rows: [
            [
              'Auslöser',
              'Mehr Kaufkraft trifft auf unverändertes Angebot',
              'Produktion wird teurer: Energie, Rohstoffe, Lieferketten, Löhne',
            ],
            [
              'Begleiterscheinung',
              'Wirtschaft läuft heiß, Arbeitslosigkeit niedrig',
              'Wirtschaft schwächelt, Gewinne unter Druck',
            ],
            [
              'Reaktion der Notenbank',
              'Zinsen erhöhen dämpft die Nachfrage – das Instrument passt',
              'Zinsen erhöhen macht Energie nicht billiger – das Instrument passt nicht',
            ],
            [
              'Typisches Beispiel',
              'Konjunkturboom, kreditfinanzierter Nachfrageschub',
              'Ölpreisschocks der 1970er Jahre, Lieferkettenstörungen 2021/22',
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'Die Unterscheidung ist keine akademische Spitzfindigkeit. Eine Notenbank kann über den Zins die Nachfrage bremsen; sie kann keine Gaspipeline bauen. Bei einem reinen Angebotsschock steht sie deshalb vor einer unangenehmen Wahl: nichts tun und riskieren, dass der Schock sich festsetzt – oder die Zinsen erhöhen und eine ohnehin schwache Wirtschaft weiter bremsen.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Zweitrundeneffekte: wie ein Schock dauerhaft wird',
        },
        {
          type: 'paragraph',
          text: 'Ein einmaliger Preissprung – etwa beim Gas – muss nicht in Inflation münden. Er tut es dann, wenn er weitergereicht wird. Die Bäckerei erhöht wegen der Energiekosten die Preise. Die Beschäftigten verlangen wegen der gestiegenen Preise mehr Lohn. Die Bäckerei gibt die höheren Löhne über die Preise weiter. Aus einem Schock wird ein Kreislauf.',
        },
        {
          type: 'paragraph',
          text: 'Diese **Lohn-Preis-Spirale** ist der Grund, warum Notenbanken auf Lohnabschlüsse so genau schauen. Der Begriff wird allerdings oft einseitig verwendet: Ebenso möglich ist, dass Unternehmen einen Kostenschock zum Anlass nehmen, die Preise stärker anzuheben als nötig – solange alle es tun, fällt es nicht auf. Beides sind Zweitrundeneffekte.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Kerninflation, Basiseffekte, Erzeugerpreise',
        },
        {
          type: 'paragraph',
          text: 'Die **Kerninflation** lässt Energie und Nahrungsmittel weg. Nicht weil die unwichtig wären – sie sind für viele Haushalte das Wichtigste –, sondern weil sie stark schwanken und dabei oft von Wetter oder Politik getrieben sind. Wer wissen will, ob die Teuerung sich im Rest der Wirtschaft festgesetzt hat, schaut auf den Kern. Als Aussage über die Lebenshaltungskosten taugt sie nicht.',
        },
        {
          type: 'paragraph',
          text: 'Der **Basiseffekt** ist die häufigste Ursache für Schlagzeilen ohne Inhalt. Weil die Rate mit dem Vorjahresmonat vergleicht, hängt sie ebenso vom Vorjahr ab wie von der Gegenwart. War der Energiepreis vor einem Jahr auf einem Höchststand, fällt die Rate allein deshalb, weil dieser Höchststand aus dem Vergleich herausrutscht – ohne dass heute irgendetwas billiger geworden wäre.',
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Zwei nützliche Frühindikatoren',
          items: [
            '**Erzeugerpreise** messen, was Hersteller für ihre Waren verlangen, bevor diese im Handel ankommen. Sie laufen den Verbraucherpreisen typischerweise einige Monate voraus – allerdings unvollständig, weil Handel und Dienstleister nicht alles weitergeben.',
            '**Break-even-Inflationsrate**: die Differenz zwischen der Rendite einer normalen Staatsanleihe und der einer inflationsindexierten mit gleicher Laufzeit. Sie zeigt, welche Inflation der Markt für diesen Zeitraum einpreist – gemessen an echtem Geld, nicht an einer Umfrage.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Erwartungen sind selbst eine Kraft',
        },
        {
          type: 'paragraph',
          text: 'Inflation hängt davon ab, welche Inflation erwartet wird. Wer für nächstes Jahr fünf Prozent Teuerung erwartet, verlangt fünf Prozent mehr Lohn und kalkuliert fünf Prozent höhere Preise – und macht die Erwartung damit wahr. Ökonomen nennen das eine sich selbst erfüllende Prophezeiung; die Notenbanken nennen es das eigentliche Schlachtfeld.',
        },
        {
          type: 'paragraph',
          text: 'Deshalb der Ausdruck von den **verankerten Erwartungen**. Solange alle darauf vertrauen, dass die Notenbank die Inflation mittelfristig auf ihr Ziel zurückführt, wird ein Preisschock als vorübergehend behandelt und nicht in Löhne und Kalkulationen eingebaut. Geht dieses Vertrauen verloren, muss die Notenbank es mit sehr viel höheren Zinsen zurückkaufen – so geschehen in den USA Anfang der 1980er Jahre, um den Preis einer schweren Rezession.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Glaubwürdigkeit als Instrument',
          items: [
            'Eine Notenbank, der man glaubt, muss seltener handeln. Die Ankündigung wirkt bereits.',
            'Gemessen werden Erwartungen über Verbraucher- und Unternehmensumfragen, über Prognosen von Banken und über Marktpreise wie die Break-even-Rate.',
            'Das erklärt, warum Sätze aus Pressekonferenzen Kurse bewegen, obwohl kein Zins verändert wurde.',
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
            'Nachfrage- und Angebotsinflation verlangen unterschiedliche Antworten – die Notenbank erreicht nur die Nachfrageseite.',
            'Aus einem einmaligen Preisschock wird erst durch Zweitrundeneffekte anhaltende Inflation.',
            'Kerninflation misst die Verfestigung, nicht die Lebenshaltungskosten.',
            'Basiseffekte können eine Rate bewegen, ohne dass sich am Preisniveau etwas ändert.',
            'Erwartungen sind kein Nebenschauplatz, sondern Ursache.',
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ Profi
    profi: {
      metaTitle: 'Inflationsschutz: Was historisch funktioniert hat',
      metaDescription:
        'Sachwerte, inflationsindexierte Anleihen, Aktien und Gold im Vergleich – und warum viele als Inflationsschutz beworbene Anlagen keiner sind.',
      title: 'Inflationsschutz auf dem Prüfstand',
      lead: 'Welche Anlagen Kaufkraft historisch erhalten haben, über welche Zeiträume das galt und wo der Schutz nur behauptet wird.',
      readingMinutes: 12,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: '„Inflationsschutz“ ist ein Verkaufsargument, und wie die meisten Verkaufsargumente hält es einer genauen Prüfung nur teilweise stand. Der entscheidende Zusatz fehlt fast immer: über welchen Zeitraum.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Der Zeitraum entscheidet über alles',
        },
        {
          type: 'paragraph',
          text: 'Aktien gelten als Sachwerte, und über lange Zeiträume trifft das zu: Unternehmen verkaufen reale Güter und Dienstleistungen und können gestiegene Kosten über die Preise weitergeben. Ihre Erträge wachsen langfristig mit dem Preisniveau mit.',
        },
        {
          type: 'paragraph',
          text: 'Kurzfristig gilt eher das Gegenteil. In Phasen anziehender Inflation fallen Aktienkurse häufig, statt zu steigen – aus zwei Gründen. Erstens hebt die Notenbank die Zinsen, und höhere Zinsen senken den heutigen Wert künftiger Gewinne. Zweitens können Unternehmen Preise nicht sofort weitergeben; Verträge laufen, Kunden wandern ab, die Margen geraten zuerst unter Druck. Wer Aktien als kurzfristigen Inflationsschutz kauft, kauft das Falsche.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Der Satz, der fehlt',
          items: [
            'Aktien schützen über zwanzig Jahre zuverlässig vor Kaufkraftverlust.',
            'Über zwei Jahre tun sie es nicht – dort ist der Zusammenhang oft negativ.',
            'Beide Aussagen stehen nicht im Widerspruch. Sie beantworten verschiedene Fragen.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die Kandidaten im Einzelnen',
        },
        {
          type: 'table',
          caption: 'Inflationsschutz nach Anlageform',
          head: ['Anlage', 'Wirkung', 'Einschränkung'],
          rows: [
            [
              'Breite Aktienanlage',
              'Langfristig verlässlich, weil Erträge mit dem Preisniveau wachsen',
              'Kurzfristig oft negativ korreliert; erfordert Durchhaltevermögen über Jahrzehnte',
            ],
            [
              'Inflationsindexierte Anleihen',
              'Direkter Schutz: Nennwert und Kupon werden an den Preisindex gekoppelt',
              'Lohnt nur, wenn die tatsächliche Inflation über der eingepreisten Break-even-Rate liegt',
            ],
            [
              'Immobilie mit Kredit',
              'Doppelt: Miete steigt mit dem Preisniveau, die Kreditschuld entwertet sich real',
              'Steigende Zinsen drücken zugleich die Bewertung und die Anschlussfinanzierung',
            ],
            [
              'Gold',
              'Über sehr lange Zeiträume Kaufkrafterhalt',
              'Über Jahre und Jahrzehnte kein verlässlicher Zusammenhang; kein laufender Ertrag',
            ],
            [
              'Rohstoffe über Terminkontrakte',
              'Reagieren am direktesten auf Angebotsschocks',
              'Rollkosten in Contango können den Schutz über die Zeit vollständig aufzehren',
            ],
            [
              'Tages- und Festgeld',
              'Kein Schutz – der Zins ist nominal vereinbart',
              'Auch ein hoher Zins schützt nicht, wenn die Inflation höher ist',
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'Die inflationsindexierte Anleihe verdient eine Ergänzung, weil sie am häufigsten missverstanden wird. Sie schützt nicht vor Inflation an sich, sondern vor **unerwarteter** Inflation. Die erwartete Inflation ist bereits im Preis enthalten – das ist genau die Break-even-Rate. Liegt die tatsächliche Teuerung darunter, hättest du mit der normalen Anleihe mehr verdient. Es ist eine Wette auf die Abweichung, nicht auf die Richtung.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Inflation und Steuern: der Teil, der weh tut',
        },
        {
          type: 'paragraph',
          text: 'Das deutsche Steuerrecht kennt keine Inflation. Besteuert wird der **nominale** Ertrag – auch dann, wenn real nichts hinzugekommen ist. Das führt zu einem Ergebnis, das viele überrascht, wenn sie es zum ersten Mal durchrechnen.',
        },
        {
          type: 'paragraph',
          text: `Angenommen, eine Anlage bringt ${formatPercent(realzinsbeispiel.nominal, 1)} im Jahr, die Inflation liegt bei ${formatPercent(realzinsbeispiel.inflation, 1)}. Real hast du ${formatPercent(realzinsbeispiel.real, 2)} verloren. Das Finanzamt sieht davon nichts: Es sieht ${formatPercent(realzinsbeispiel.nominal, 1)} Gewinn und erhebt darauf Abgeltungsteuer, Solidaritätszuschlag und gegebenenfalls Kirchensteuer – rund ein Viertel bis gut ein Viertel des nominalen Ertrags. Nach Steuern ist der reale Verlust größer als vorher.`,
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Scheingewinn und kalte Progression',
          items: [
            '**Scheingewinnbesteuerung**: Besteuert wird der nominale Zuwachs, auch wenn er die Inflation nicht ausgleicht. Je höher die Inflation, desto größer der Anteil der Steuer, der auf gar keinen echten Gewinn entfällt.',
            '**Kalte Progression**: Eine Lohnerhöhung, die genau die Inflation ausgleicht, schiebt dich in einen höheren Steuersatz. Real verdienst du gleich viel und zahlst anteilig mehr Steuern. Der Gesetzgeber gleicht das inzwischen regelmäßig über die Anpassung der Eckwerte aus – vollständig ist der Ausgleich selten.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Daraus folgt ein praktischer Punkt für die Anlagedauer. Weil Steuern erst bei Zufluss anfallen, arbeitet ein nicht ausgeschütteter Gewinn länger für dich. Bei thesaurierenden Fonds greift zwar die Vorabpauschale, aber sie ist auf den Wertzuwachs gedeckelt und damit meist deutlich kleiner als die volle Besteuerung einer Ausschüttung. Über lange Zeiträume ist dieser Steuerstundungseffekt kein Randposten.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Keine Steuerberatung',
          items: [
            'Diese Darstellung beschreibt die allgemeine Rechtslage für Privatanleger in Deutschland.',
            'Steuersätze, Freibeträge und der Basiszins der Vorabpauschale ändern sich; für den Einzelfall ist jemand mit Zulassung zuständig.',
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
            'Ohne Zeitraum ist die Aussage „schützt vor Inflation“ inhaltsleer.',
            'Aktien schützen langfristig, kurzfristig eher nicht – beides ist richtig.',
            'Inflationsindexierte Anleihen schützen vor unerwarteter Inflation; die erwartete steckt schon im Preis.',
            'Rohstoff-Terminkontrakte können in Contango ihren eigenen Schutz aufzehren.',
            'Besteuert wird nominal. Bei hoher Inflation zahlst du Steuern auf Gewinne, die es real nicht gibt.',
          ],
        },
      ],
    },
  },
}
