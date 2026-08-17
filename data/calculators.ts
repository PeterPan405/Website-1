import type { ContentBlock } from '@/data/content'
import { RECHNER_ANZAHL } from '@/lib/site'

/**
 * Metadaten und Methodik-Texte der Rechner.
 *
 * Die Rechenlogik selbst liegt in `lib/finance.ts`. Hier steht ausschließlich,
 * was auf der Seite erklärt wird – jeder Rechner legt seine Formel und seine
 * Annahmen offen, damit ein Ergebnis eingeordnet werden kann.
 *
 * Über dieser Zeile stand „Metadaten und Methodik-Texte der fünf Rechner“, und
 * das war das kleinste Problem: Auf Startseite und Übersicht warb die Website
 * mit fünf, während hier acht standen. Deshalb die Prüfung am Ende der Datei.
 */

export interface CalculatorDefinition {
  slug: string
  /** Kurzname für Navigation und Kacheln. */
  title: string
  /** <h1> der Rechnerseite. */
  headline: string
  metaTitle: string
  metaDescription: string
  lead: string
  /** Ein Satz für Übersichtskacheln. */
  summary: string
  /** Für die WebApplication-Auszeichnung. */
  featureList: string[]
  /** Erklärung der Methodik unter dem Rechner. */
  methodology: ContentBlock[]
  /**
   * Was dieser Rechner **nicht** sagt.
   *
   * Steht unter dem Rechner als Kasten und noch einmal auf dem
   * heruntergeladenen PDF. Eine Quelle für beides – die Grenzen standen
   * zwischenzeitlich in den Komponenten, und damit hätte auf dem Ausdruck
   * etwas anderes stehen können als auf der Seite.
   *
   * Pflichtfeld, kein optionales. Ein Rechner, der seine Grenzen nicht nennt,
   * behauptet, keine zu haben – und das stimmt bei keinem von ihnen.
   */
  grenzen: string[]
  /**
   * Die Bedienschritte, für die `HowTo`-Auszeichnung.
   *
   * Nur, was auf der Seite tatsächlich zu tun ist: die Eingabefelder in ihrer
   * Reihenfolge und das, was danach abzulesen ist. Keine Ratschläge, keine
   * Verweise auf andere Seiten.
   *
   * Pflichtfeld aus demselben Grund wie `grenzen`: Wer einen Rechner baut und
   * nicht in drei Sätzen sagen kann, was daran zu tun ist, hat ein Problem an
   * der Oberfläche und nicht bei den strukturierten Daten.
   */
  schritte: string[]
  /** Slugs passender Lernthemen. */
  relatedTopics: string[]
}

export const calculators: CalculatorDefinition[] = [
  {
    slug: 'kreditrechner',
    title: 'Kreditrechner',
    headline: 'Kreditrechner: Rate, Laufzeit und Restschuld eines Annuitätendarlehens',
    metaTitle: 'Kreditrechner: Annuitätendarlehen mit Restschuld',
    metaDescription:
      'Annuitätendarlehen durchrechnen: monatliche Rate, Laufzeit, Zinskosten und die Restschuld am Ende der Zinsbindung – der Wert, den die Ratenanzeige verschweigt.',
    lead: 'Darlehenssumme, Zins und Rate eingeben – der Rechner zeigt Laufzeit, gesamte Zinskosten und die Restschuld am Ende der Zinsbindung. Auf sie kommt es bei Immobilienkrediten an, nicht auf die Rate.',
    summary: 'Annuitätendarlehen: Rate, Laufzeit, Zinskosten und Restschuld.',
    featureList: [
      'Monatliche Rate aus Zins und anfänglicher Tilgung',
      'Laufzeit bis zur vollständigen Tilgung',
      'Gesamte Zinskosten über die Laufzeit',
      'Restschuld am Ende der Zinsbindung',
    ],
    grenzen: [
      'Eine Modellrechnung mit konstantem Zins über die gesamte Laufzeit. Was nach der Zinsbindung gilt, weiß heute niemand – genau deshalb wird die Restschuld ausgewiesen.',
      'Ohne Nebenkosten: Bereitstellungszinsen, Notar, Grunderwerbsteuer und Gebühren kommen hinzu.',
      'Sondertilgungen sind nicht berücksichtigt. Wer sie nutzen kann, ist schneller fertig als hier gerechnet.',
      'Der Rechner vergleicht keine Angebote und ersetzt keine Beratung – er macht die Mechanik nachvollziehbar.',
    ],
    schritte: [
      'Darlehenssumme und nominalen Jahreszins eintragen.',
      'Die monatliche Rate angeben oder über die anfängliche Tilgung bestimmen.',
      'Die Dauer der Zinsbindung wählen.',
      'Laufzeit, Zinskosten und die Restschuld am Ende der Bindung ablesen.',
    ],
    relatedTopics: ['schulden-und-kredit', 'immobilien', 'zinseszins'],
    methodology: [
      { type: 'heading', level: 2, text: 'So wird gerechnet' },
      {
        type: 'paragraph',
        text: 'Ein Annuitätendarlehen hat eine feste Rate. In ihr stecken **Zins und Tilgung**, und ihr Verhältnis verschiebt sich mit jedem Monat: Der Zins wird auf die Restschuld berechnet, und weil die sinkt, bleibt von derselben Rate immer mehr für die Tilgung übrig.',
      },
      {
        type: 'formula',
        expression: 'Zins im Monat = Restschuld × Jahreszins ÷ 12',
        description:
          'Was von der Rate nach dem Zins übrig bleibt, tilgt. Der Rechner führt diese Rechnung Monat für Monat, bis die Restschuld null ist.',
      },
      {
        type: 'paragraph',
        text: 'Die Rate aus der anfänglichen Tilgung folgt der üblichen Angebotsform „Zins plus Anfangstilgung“: Bei 3,8 Prozent Zins und 2 Prozent Tilgung sind das 5,8 Prozent der Darlehenssumme im Jahr, geteilt durch zwölf.',
      },
      {
        type: 'paragraph',
        text: 'Deckt die Rate nicht einmal den Monatszins, wird die Schuld nie kleiner. Der Rechner sagt das dann, statt einen Plan über tausend Jahre auszugeben – es ist derselbe Mechanismus, aus dem ein dauerhaft überzogenes Konto nie herauskommt.',
      },
    ],
  },
  {
    slug: 'bewertungsrechner',
    title: 'Bewertungsrechner',
    headline: 'Bewertungsrechner: Welches Gewinnwachstum ist im Kurs eingepreist?',
    metaTitle: 'Bewertungsrechner: eingepreistes Gewinnwachstum aus dem KGV',
    metaDescription:
      'Rückwärts gerechnet: Aus KGV, Abzinsung und End-KGV zeigt der Rechner, welches Gewinnwachstum der heutige Kurs bereits bezahlt – kein Kursziel, eine Messlatte.',
    lead: 'Statt eines Kursziels rechnet dieser Rechner rückwärts: Welches Gewinnwachstum müsste ein Unternehmen liefern, damit sich der heutige Kurs lohnt? Aus dem KGV wird die Wette sichtbar, die im Preis steckt.',
    summary: 'Rückwärts gerechnet: das im KGV eingepreiste Gewinnwachstum.',
    featureList: [
      'Eingepreistes jährliches Gewinnwachstum aus dem KGV',
      'Vergleichswert: das KGV, das ganz ohne Wachstum gerechtfertigt wäre',
      'Empfindlichkeitstafel über Abzinsung und End-KGV',
      'Vorbelegbar mit dem KGV jeder Aktienseite',
    ],
    grenzen: [
      'Ein Modell mit konstantem Wachstum über den ganzen Zeitraum – das liefert kein Unternehmen. Die Rechnung ist eine Messlatte für den Preis, kein Abbild der Zukunft.',
      'Das Ergebnis hängt spürbar an Abzinsung und End-KGV; genau dafür steht die Empfindlichkeitstafel daneben. Wer nur eine Zelle liest, liest zu wenig.',
      'Kein Kursziel und keine Kauf- oder Verkaufsempfehlung: Ob ein bezahltes Wachstum realistisch ist, beantwortet die Geschäftslage des Unternehmens, nicht diese Formel.',
      'Bei Verlustunternehmen gibt es kein KGV und damit keine Rechnung – das ist eine Eigenschaft der Kennzahl, keine Lücke des Rechners.',
    ],
    schritte: [
      'Kurs-Gewinn-Verhältnis eingeben – es steht auf jeder Aktienseite dieser Website.',
      'Betrachtungszeitraum, Abzinsung und End-KGV setzen oder bei den Voreinstellungen lassen.',
      'Das eingepreiste Gewinnwachstum ablesen und mit der Empfindlichkeitstafel gegenprüfen.',
    ],
    relatedTopics: ['aktie', 'risiko-und-rendite', 'wann-kaufen-verkaufen'],
    methodology: [
      { type: 'heading', level: 2, text: 'So wird gerechnet' },
      {
        type: 'paragraph',
        text: 'Das Modell nimmt an, dass der Gewinn je Aktie über den gewählten Zeitraum mit **konstanter Rate** wächst. Jeder Jahresgewinn wird mit der Abzinsung auf heute umgerechnet; am Ende wird das erreichte Gewinnniveau zum End-KGV bewertet und ebenfalls abgezinst. Die Summe ist das KGV, das ein solches Wachstum rechtfertigen würde.',
      },
      {
        type: 'formula',
        expression:
          'gerechtfertigtes KGV = Σ (1+g)ᵗ ÷ (1+r)ᵗ  +  End-KGV × (1+g)ⁿ ÷ (1+r)ⁿ',
        description:
          'g ist das jährliche Gewinnwachstum, r die Abzinsung, n der Zeitraum. Kurs und Gewinn kürzen sich zum KGV – deshalb braucht die Rechnung keine Währung und keinen Einzelkurs.',
      },
      {
        type: 'paragraph',
        text: 'Der Rechner läuft **rückwärts**: Er sucht per Intervallhalbierung das Wachstum g, bei dem das gerechtfertigte KGV genau dem eingegebenen entspricht. Weil mehr Wachstum immer ein höheres KGV rechtfertigt, gibt es höchstens eine Lösung. Liegt sie außerhalb von −50 bis +60 Prozent je Jahr, meldet der Rechner das, statt eine Zahl zu erfinden.',
      },
      {
        type: 'paragraph',
        text: 'Warum kein Kursziel? Vorwärts gerechnet hinge das Ergebnis an denselben weichen Annahmen, sähe aber wie eine Präzisionsangabe aus. Rückwärts wird aus den Annahmen eine überprüfbare Aussage über den Preis: „Dieses KGV bezahlt so viel Wachstum.“ Ob das Unternehmen es liefern kann, ist die eigentliche Frage – und sie gehört dir, nicht dem Rechner.',
      },
    ],
  },
  {
    slug: 'zinsrechner',
    title: 'Zinsrechner',
    headline: 'Zinsrechner mit Zinseszins und Sparplan',
    metaTitle: 'Zinsrechner: Zinseszins mit Sparplan berechnen',
    metaDescription:
      'Berechne Endkapital, Einzahlungen und Zinsertrag für Startkapital plus Sparrate – mit Jahresverlauf und Angabe, wie viel vom Ergebnis aus Zinsen stammt.',
    lead: 'Startkapital, Sparrate, Zinssatz und Laufzeit eingeben – der Rechner zeigt, welcher Teil des Endkapitals aus deinen Einzahlungen kommt und welcher aus Erträgen.',
    summary:
      'Zinseszins mit Sparplan – inklusive Aufteilung in Einzahlungen und Erträge.',
    featureList: [
      'Zinseszinsberechnung mit Startkapital',
      'Sparplan mit monatlichem, vierteljährlichem oder jährlichem Intervall',
      'Jahresverlauf als Tabelle und Diagramm',
      'Verdopplungszeit nach der 72er-Regel',
    ],
    grenzen: [
      'Eine Modellrechnung, keine Prognose. Die Rendite gibst du selbst vor – das Ergebnis ist genau so verlässlich wie diese Annahme.',
      'Für Aktienanlagen liefert eine konstante Rendite systematisch zu glatte Ergebnisse. Schwankungen kosten zusätzlich Rendite (Volatilitätsbremse).',
      'Ohne Kosten, Steuern und Inflation. Alle drei senken das reale Ergebnis.',
    ],
    schritte: [
      'Startkapital eintragen – der Betrag, der zu Beginn angelegt wird. Null ist erlaubt.',
      'Sparrate und Einzahlungsintervall wählen: monatlich, vierteljährlich oder jährlich.',
      'Zinssatz je Jahr und Laufzeit in Jahren angeben.',
      'Endkapital ablesen und daneben die Aufteilung in Einzahlungen und Erträge; der Jahresverlauf steht als Tabelle und Diagramm darunter.',
    ],
    relatedTopics: ['zinseszins', 'cost-average-sparplan', 'etf', 'tagesgeld'],
    methodology: [
      { type: 'heading', level: 2, text: 'So wird gerechnet' },
      {
        type: 'paragraph',
        text: 'Der Rechner arbeitet **monatsweise**. Der eingegebene Jahreszins wird durch zwölf geteilt und jeden Monat auf den aktuellen Kapitalstand angewendet. Einzahlungen fließen in den Monaten, die zum gewählten Intervall passen.',
      },
      {
        type: 'formula',
        expression: 'Kapitalₘ₊₁ = (Kapitalₘ + Rate) × (1 + Jahreszins / 12)',
        description:
          'Bei nachschüssiger Zahlweise kommt die Rate erst nach der Zinsgutschrift hinzu – dann verzinst sie sich einen Monat später. Der Unterschied zur vorschüssigen Variante liegt unter einem Prozent.',
      },
      {
        type: 'paragraph',
        text: 'Für eine Einmalanlage ohne Sparrate entspricht das der klassischen Zinseszinsformel Endkapital = Startkapital × (1 + Zinssatz)^Jahre.',
      },
      { type: 'heading', level: 2, text: 'Welche Annahmen dahinterstehen' },
      {
        type: 'list',
        items: [
          '**Konstanter Zinssatz** über die gesamte Laufzeit. Das ist bei Tagesgeld und Anleihen für einen bestimmten Zeitraum realistisch, bei Aktien und Fonds nicht – dort schwankt die Rendite jedes Jahr.',
          '**Keine Steuern.** Abgeltungssteuer, Solidaritätszuschlag und die Vorabpauschale bei Fonds sind nicht berücksichtigt.',
          '**Keine Kosten.** Fondskosten, Ausführungsgebühren und Ausgabeaufschläge fehlen ebenfalls. Ein Prozentpunkt Kosten pro Jahr kostet über 30 Jahre rund ein Viertel des Endvermögens.',
          '**Keine Inflation.** Das Ergebnis ist ein nominaler Betrag. Um in heutiger Kaufkraft zu rechnen, setze den Realzins ein – der Inflationsrechner nennt ihn.',
        ],
      },
    ],
  },
  {
    slug: 'kostenrechner',
    title: 'Kostenrechner',
    headline: 'Kostenrechner: was eine Gebühr über die Jahre kostet',
    metaTitle: 'Kostenrechner: TER-Vergleich über 30 Jahre',
    metaDescription:
      'Vergleiche zwei Kostenquoten bei gleicher Rendite: Der Rechner zeigt, welchen Anteil am Endvermögen die laufende Gebühr über die Jahre auffrisst.',
    lead: 'Eine Kostenquote von 1,5 Prozent klingt nach 1,5 Prozent weniger Ertrag. Über dreißig Jahre ist es rund ein Fünftel des Endvermögens. Der Rechner stellt zwei Gebühren bei sonst gleichen Annahmen gegenüber.',
    summary: 'Was zwei Kostenquoten bei gleicher Rendite auseinanderbringt.',
    featureList: [
      'Endvermögen bei zwei Kostenquoten',
      'Unterschied in Euro und als Anteil am Vermögen',
      'Nettorendite nach laufenden Kosten',
      'Gesamte Gebührenlast samt entgangenem Zinsertrag',
    ],
    grenzen: [
      'Eine Modellrechnung bei konstanter Rendite. Die Bruttorendite gibst du selbst vor.',
      'Gerechnet werden nur die laufenden Kosten. Ausgabeaufschläge, Transaktionskosten und Depotgebühren kommen gegebenenfalls hinzu.',
      'Ohne Steuern und ohne Inflation.',
    ],
    schritte: [
      'Anlagebetrag und Sparrate eintragen.',
      'Bruttorendite je Jahr und Laufzeit angeben.',
      'Zwei Kostenquoten gegenüberstellen – etwa 0,2 Prozent für einen Indexfonds und 1,5 Prozent für einen gemanagten Fonds.',
      'Den Unterschied der beiden Endvermögen ablesen; er ist der Betrag, den die höhere Gebühr über die Laufzeit gekostet hat.',
    ],
    relatedTopics: ['etf', 'kosten-und-gebuehren', 'fonds', 'zinseszins'],
    methodology: [
      { type: 'heading', level: 2, text: 'So wird gerechnet' },
      {
        type: 'paragraph',
        text: 'Eine Fondskostenquote wird dem **Vermögen** entnommen, nicht dem Ertrag. Über ein Jahr gerechnet bleibt deshalb nicht die Differenz aus Rendite und Kosten übrig, sondern etwas weniger.',
      },
      {
        type: 'formula',
        expression: 'Nettorendite = (1 + Bruttorendite) × (1 − Kostenquote) − 1',
        description:
          'Bei 7 Prozent Rendite und 1,5 Prozent Kosten bleiben 5,395 Prozent, nicht 5,5. Der Unterschied ist der Teil der Gebühr, der auf den Wertzuwachs des Jahres erhoben wird.',
      },
      {
        type: 'paragraph',
        text: 'Sparraten werden **monatlich** verzinst, nicht als Jahresbetrag am Jahresende. Der Unterschied beträgt über dreißig Jahre mehrere Prozent, und er geht immer zulasten der bequemeren Rechnung.',
      },
      { type: 'heading', level: 2, text: 'Warum die Zahl so groß ausfällt' },
      {
        type: 'paragraph',
        text: 'Weil die Gebühr zweimal wirkt. Sie nimmt einen Betrag heraus – und dieser Betrag erwirtschaftet danach nie wieder etwas. Nach dreißig Jahren besteht der größere Teil der Differenz nicht aus den Gebühren selbst, sondern aus dem Zinseszins, den sie verhindert haben.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Wo die Zahl im Factsheet steht',
        items: [
          'Als **laufende Kosten** oder **TER** (Total Expense Ratio), meist in Prozent je Jahr.',
          'Nicht enthalten sind darin: Ausgabeaufschlag, Depotgebühr, Transaktionskosten des Fonds und Steuern.',
          'Bei ETFs steht daneben oft die **Tracking-Differenz** – sie ist die ehrlichere Zahl, weil sie misst, was am Ende tatsächlich gegenüber dem Index fehlte.',
        ],
      },
      { type: 'heading', level: 2, text: 'Annahmen und Grenzen' },
      {
        type: 'list',
        items: [
          '**Gleiche Bruttorendite für beide.** Das ist die entscheidende Annahme. Ob ein teurer Fonds seine Kosten durch bessere Auswahl wieder einspielt, beantwortet dieser Rechner nicht – er zeigt, wie hoch die Hürde dafür ist.',
          '**Konstante Rendite.** Tatsächlich schwankt sie. Für den Vergleich zweier Kostenquoten spielt das keine Rolle, weil beide dieselbe Schwankung erleben.',
          '**Keine Steuern.** Sie fallen bei beiden an und verschieben das Ergebnis in dieselbe Richtung.',
        ],
      },
    ],
  },
  {
    slug: 'steuerrechner',
    title: 'Steuerrechner',
    headline: 'Steuer auf Kapitalerträge – samt Vorabpauschale',
    metaTitle: 'Steuerrechner: Kapitalerträge und Vorabpauschale',
    metaDescription:
      'Berechne die Steuer auf Zinsen, Dividenden und Fondserträge: mit Teilfreistellung, Sparerpauschbetrag, Kirchensteuer und der Vorabpauschale.',
    lead: 'Auf Kapitalerträge werden 25 Prozent fällig – aber fast nie auf den vollen Betrag. Der Rechner zeigt, was Teilfreistellung und Sparerpauschbetrag davon abziehen, und wie die Vorabpauschale entsteht, die viele erst beim Blick aufs Verrechnungskonto bemerken.',
    summary: 'Abgeltungsteuer, Teilfreistellung, Freibetrag und Vorabpauschale.',
    featureList: [
      'Kapitalertragsteuer, Solidaritätszuschlag und Kirchensteuer',
      'Teilfreistellung nach Fondsart',
      'Sparerpauschbetrag für Einzel- und Zusammenveranlagung',
      'Vorabpauschale aus Basiszins, Wertzuwachs und Ausschüttungen',
    ],
    grenzen: [
      'Keine geschäftsmäßige Hilfeleistung in Steuersachen. Die Rechnung erläutert die Systematik; maßgeblich ist der Steuerbescheid.',
      'Nur Abgeltungsteuer auf Kapitalerträge im Privatvermögen. Die Günstigerprüfung, Verlustverrechnungstöpfe, ausländische Quellensteuer und die Anlage KAP sind nicht abgebildet.',
      'Der Basiszins wird jährlich neu bekanntgegeben; die Rechnung nutzt den oben genannten Stand.',
      'Teilfreistellungen richten sich nach der tatsächlichen Aktienquote des Fonds, nicht nach seiner Bezeichnung.',
    ],
    schritte: [
      'Art der Erträge wählen: Zinsen, Dividenden oder Kursgewinne aus Fondsanteilen.',
      'Ertragshöhe eintragen und angeben, wie viel vom Sparerpauschbetrag noch frei ist.',
      'Kirchensteuerpflicht angeben, falls zutreffend.',
      'Steuerlast und Nettoertrag ablesen; die Aufschlüsselung zeigt, was Teilfreistellung und Pauschbetrag abgezogen haben.',
    ],
    relatedTopics: ['sparerpauschbetrag', 'etf', 'fonds', 'depot-und-broker'],
    methodology: [
      { type: 'heading', level: 2, text: 'Die Reihenfolge entscheidet' },
      {
        type: 'paragraph',
        text: 'Zwischen dem Ertrag und der Steuer stehen vier Schritte, und sie gehören in diese Reihenfolge: **Teilfreistellung**, dann **Sparerpauschbetrag**, dann **Kapitalertragsteuer**, dann die **Zuschläge**. Wer Freibetrag und Teilfreistellung vertauscht, rechnet bei kleinen Beträgen Steuer aus, die gar nicht anfällt.',
      },
      {
        type: 'paragraph',
        text: 'Beispiel: 1.400 Euro Ertrag aus einem Aktienfonds. Nach 30 Prozent Teilfreistellung bleiben 980 Euro – und die deckt der Sparerpauschbetrag von 1.000 Euro vollständig ab. Es fällt keine Steuer an.',
      },
      { type: 'heading', level: 2, text: 'Warum es nicht 25 Prozent sind' },
      {
        type: 'paragraph',
        text: 'Auf die Kapitalertragsteuer kommen 5,5 Prozent Solidaritätszuschlag. Wer kirchensteuerpflichtig ist, zahlt zusätzlich 8 oder 9 Prozent davon – aber die Kirchensteuer mindert zugleich als Sonderausgabe ihre eigene Bemessungsgrundlage. Deshalb wird nicht addiert, sondern geteilt:',
      },
      {
        type: 'formula',
        expression: 'Kapitalertragsteuer = Ertrag / (4 + Kirchensteuersatz)',
        description:
          'Ohne Kirchensteuer ergibt das 25 Prozent und eine Gesamtbelastung von 26,375 Prozent. Mit 9 Prozent Kirchensteuer sind es 24,45 Prozent und insgesamt 27,99 – nicht 28,375, wie die naheliegende Addition ergäbe.',
      },
      { type: 'heading', level: 2, text: 'Die Vorabpauschale' },
      {
        type: 'paragraph',
        text: 'Ein thesaurierender Fonds schüttet nichts aus. Ohne Vorabpauschale bliebe er bis zum Verkauf unversteuert, ein ausschüttender nicht. Deshalb gilt jährlich ein Mindestbetrag als zugeflossen – auch wenn kein Geld geflossen ist.',
      },
      {
        type: 'formula',
        expression: 'Basisertrag = Wert zu Jahresbeginn × Basiszins × 0,7',
        description:
          'Der Basiszins wird jährlich vom Bundesfinanzministerium bekanntgegeben; für 2025 lag er bei 2,53 Prozent. Die 70 Prozent sind ein pauschaler Abschlag und stehen so im Gesetz.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Drei Regeln, an denen die meisten hängen bleiben',
        items: [
          'Der Basisertrag ist auf den **Wertzuwachs des Jahres begrenzt**. Ist der Fonds gefallen, gibt es keine Vorabpauschale.',
          '**Ausschüttungen werden abgezogen.** Wer genug ausgeschüttet bekommen hat, zahlt keine.',
          'Sie ist **keine zusätzliche Steuer**: Beim Verkauf wird alles bereits Versteuerte vom Gewinn abgezogen.',
        ],
      },
      { type: 'heading', level: 2, text: 'Annahmen und Grenzen' },
      {
        type: 'list',
        items: [
          '**Privatanleger mit Wohnsitz in Deutschland.** Für Betriebsvermögen gelten andere Teilfreistellungssätze.',
          '**Keine Günstigerprüfung.** Wer insgesamt wenig verdient, fährt mit dem persönlichen Steuersatz besser und beantragt das in der Steuererklärung.',
          '**Keine ausländische Quellensteuer, keine Verlustverrechnung, keine Altbestände von vor 2009.**',
          'Das Ergebnis ist eine Orientierung und ersetzt keine Steuerberatung.',
        ],
      },
    ],
  },
  {
    slug: 'vermoegensuebersicht',
    title: 'Vermögensübersicht',
    headline: 'Vermögensübersicht: Bogen zum Ausfüllen und Abheften',
    metaTitle: 'Vermögensübersicht: Nettovermögen erfassen und herunterladen',
    metaDescription:
      'Trage Besitz und Schulden in einen Bogen ein und lade ihn als PDF herunter – ausgefüllt oder leer zum Ausdrucken. Alle Eingaben bleiben im Browser.',
    lead: 'Was besitzt du, was schuldest du, was bleibt? Der Bogen führt durch beide Seiten und rechnet das Nettovermögen aus. Herunterladen kannst du ihn als PDF – ausgefüllt oder leer zum Ausdrucken, gedacht zum Abheften und Wiedervorlegen.',
    summary:
      'Besitz und Schulden erfassen, Nettovermögen ermitteln, Bogen herunterladen.',
    featureList: [
      'Sechs Bereiche von Konten bis Sachwerten und Schulden',
      'Mehrere Zeilen je Posten, jede mit eigener Bezeichnung',
      'Nettovermögen, Besitz und Schulden auf einen Blick',
      'Download als PDF – ausgefüllt oder leer zum Ausdrucken',
      'Zusätzlich als Tabelle zum Weiterrechnen',
      'Eingaben bleiben im Browser, ohne Anmeldung',
    ],
    grenzen: [
      'Eine Momentaufnahme zum Stichtag, keine Bewertung. Was ein Gegenstand tatsächlich einbringt, zeigt erst ein Verkauf.',
      'Immobilien, Fahrzeuge und Hausrat werden mit dem Wert angesetzt, den du selbst einträgst. Für Immobilien ist das die unsicherste Zahl der Aufstellung.',
      'Ohne Steuern auf stille Reserven. Wer Wertpapiere mit Gewinn verkauft, hat danach weniger als hier steht.',
      'Ansprüche aus der gesetzlichen Rente und aus Betriebsrenten sind kein Vermögen im Sinne dieser Aufstellung und fehlen deshalb.',
    ],
    schritte: [
      'Besitzpositionen eintragen: Konten, Wertpapiere, Immobilien, Sachwerte.',
      'Verbindlichkeiten eintragen: Kredite, Darlehen, offene Rechnungen.',
      'Nettovermögen als Differenz ablesen.',
      'Den Bogen als PDF herunterladen – ausgefüllt oder leer zum Ausdrucken.',
    ],
    relatedTopics: ['worauf-achten-einsteiger', 'tagesgeld', 'immobilien', 'rente'],
    methodology: [
      { type: 'heading', level: 2, text: 'Was das Nettovermögen ist' },
      {
        type: 'formula',
        expression: 'Nettovermögen = Besitz − Schulden',
        description:
          'Mehr steht hier nicht dahinter. Der Wert dieser Aufstellung liegt nicht in der Rechnung, sondern darin, einmal alles zusammenzutragen – die meisten kennen ihre Kontostände und schätzen die Summe trotzdem falsch.',
      },
      {
        type: 'paragraph',
        text: 'Schulden werden als **positive Beträge** eingetragen und abgezogen. Ein negatives Ergebnis ist kein Fehler: Wer ein Haus finanziert oder ein Studium hinter sich hat, steht am Anfang regelmäßig im Minus.',
      },
      { type: 'heading', level: 2, text: 'Welcher Wert gehört in die Zeile' },
      {
        type: 'list',
        items: [
          '**Geldanlagen:** der heutige Kurswert, nicht der Einstandspreis. Was du bezahlt hast, ist für diese Aufstellung ohne Bedeutung.',
          '**Immobilien:** eine vorsichtige Schätzung. Entscheidend ist weniger, dass sie genau stimmt, als dass sie beim nächsten Mal nach derselben Regel entsteht – sonst misst du deine Bewertungslaune statt deines Vermögens.',
          '**Kredite:** die heutige Restschuld, nicht die ursprüngliche Kreditsumme. Sie steht in der jährlichen Mitteilung der Bank.',
          '**Altersvorsorge:** der Rückkaufs- oder Anwartschaftswert. Ob die gesetzliche Rente hineingehört, ist Ansichtssache – der Bogen lässt die Zeile deshalb bewusst leer.',
        ],
      },
      { type: 'heading', level: 2, text: 'Mehrere Konten, mehrere Depots' },
      {
        type: 'paragraph',
        text: 'Kaum jemand hat genau ein Girokonto. Über das **Plus** rechts an einem Posten entsteht deshalb eine weitere Zeile, und ab der zweiten bekommt jede ein Feld für ihre Bezeichnung – „Girokonto Sparkasse“, „Depot bei der ING“. Bleibt es bei einer Zeile, bleibt auch die Ansicht wie vorher: Bezeichnung links, Betrag rechts.',
      },
      {
        type: 'paragraph',
        text: 'Im PDF steht jede Zeile einzeln, mit ihrem eigenen Namen. Zusammengezogen würde sie genau die Auskunft verlieren, für die man sie getrennt eingetragen hat.',
      },
      { type: 'heading', level: 2, text: 'Warum es zwei Downloads gibt' },
      {
        type: 'paragraph',
        text: 'Weil es zwei Arten gibt, so etwas zu führen. Die einen füllen den Bogen hier aus und nehmen das Ergebnis mit. Die anderen wollen einen leeren Bogen zum Ausdrucken, den sie mit dem Kontoauszug daneben mit der Hand ausfüllen. Beide Wege enden bei derselben Datei – einmal mit Zahlen, einmal ohne.',
      },
      {
        type: 'paragraph',
        text: 'Beide sind **PDF-Dateien**: Ein PDF sieht auf jedem Gerät gleich aus, lässt sich ohne Rückfrage drucken und altert nicht mit dem Tabellenprogramm. Der leere Bogen bringt für jeden Posten eine Punktlinie mit, auf die man mit der Hand schreibt.',
      },
      {
        type: 'paragraph',
        text: 'Wer mit den Zahlen weiterrechnen will, findet unter den Download-Knöpfen zusätzlich die **Tabellenfassung** mit Semikolon-Trennung und Dezimalkomma – zum Kopieren und Einfügen in ein Tabellenprogramm.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Zweimal im Jahr genügt',
        items: [
          'Eine einzelne Momentaufnahme sagt wenig. Erst die Reihe über zwei bis drei Jahre zeigt, ob das Nettovermögen wächst – und ob das am Sparen liegt oder an den Kursen.',
          'Halte den Stichtag fest: immer zum Jahresende und zur Jahresmitte. Wer mal im Januar und mal im Mai zählt, vergleicht Zeiträume unterschiedlicher Länge.',
          'Die interessantere Zahl ist oft nicht die Summe, sondern ihre Zusammensetzung: Wie viel liegt unverzinst auf dem Girokonto, wie viel steckt in einer einzigen Position?',
        ],
      },
      { type: 'heading', level: 2, text: 'Grenzen' },
      {
        type: 'list',
        items: [
          '**Alles in Euro.** Fremdwährungsbestände musst du selbst zum Stichtagskurs umrechnen.',
          '**Keine Steuern.** In Depot und Immobilien stecken stille Reserven, auf die bei einem Verkauf Steuer anfiele. Das Nettovermögen ist ein Bruttowert vor Steuern.',
          '**Keine Bewertung.** Der Bogen sagt nicht, ob eine Aufteilung gut ist. Er stellt sie nur hin.',
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Deine Daten bleiben bei dir',
        items: [
          'Die Eingaben werden ausschließlich im Browser verarbeitet und dort gespeichert, damit der Bogen beim nächsten Besuch noch dasteht. Es findet keine Übertragung an einen Server statt.',
          'Über „Alle Eingaben löschen“ ist der Speicher wieder leer. Auf einem fremden Gerät ist das der Schritt, den man nicht vergessen sollte.',
        ],
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Wenn der Download nicht ankommt',
        items: [
          'Auf verwalteten Geräten – Firmenlaptops, Schulrechner, manche Sicherheitsprogramme – sperren Browser Downloads pauschal und melden „durch Richtlinie blockiert“. Die Sperre sitzt vor dem Herunterladen; von der Seite aus lässt sich daran nichts ändern.',
          'Dafür gibt es den Weg über die Zwischenablage: „Als Tabelle anzeigen“ zeigt denselben Bogen als Text. Kopieren, in eine leere Tabelle einfügen und beim Einfügen das Semikolon als Trennzeichen wählen – die Zahlen sind dieselben.',
        ],
      },
    ],
  },
  {
    slug: 'inflationsrechner',
    title: 'Inflationsrechner',
    headline: 'Inflationsrechner: Kaufkraft über die Jahre',
    metaTitle: 'Inflationsrechner: Kaufkraftverlust berechnen',
    metaDescription:
      'Berechne, was von einem Betrag nach Jahren real übrig bleibt, welche Summe du für gleiche Kaufkraft brauchst und wann sich die Kaufkraft halbiert.',
    lead: 'Wie viel ist dein Geld in zehn, zwanzig oder dreißig Jahren noch wert? Der Rechner zeigt beide Richtungen: den Kaufkraftverlust und den Betrag, der später für dieselbe Kaufkraft nötig ist.',
    summary: 'Kaufkraftverlust und benötigter Betrag über beliebige Zeiträume.',
    featureList: [
      'Kaufkraft eines Betrags nach n Jahren',
      'Benötigter Betrag für gleiche Kaufkraft',
      'Halbierungszeit der Kaufkraft',
      'Realzins aus Nominalzins und Inflationsrate',
    ],
    grenzen: [
      'Eine gleichbleibende Inflationsrate ist eine Annahme. Tatsächlich schwankt sie von Jahr zu Jahr erheblich.',
      'Die amtliche Rate misst einen Durchschnittswarenkorb. Der persönliche Warenkorb weicht davon ab – wer viel Miete zahlt, erlebt eine andere Inflation als wer viel tankt.',
    ],
    schritte: [
      'Betrag eintragen, dessen Kaufkraft betrachtet werden soll.',
      'Angenommene Inflationsrate je Jahr und den Zeitraum in Jahren angeben.',
      'Wahlweise die nominale Rendite einer Anlage eintragen, um den Realzins zu sehen.',
      'Beide Richtungen ablesen: was der Betrag später noch wert ist und welcher Betrag später dieselbe Kaufkraft hat.',
    ],
    relatedTopics: ['zinseszins', 'tagesgeld', 'staatsanleihe', 'immobilien'],
    methodology: [
      { type: 'heading', level: 2, text: 'So wird gerechnet' },
      {
        type: 'paragraph',
        text: 'Inflation wirkt genau wie Zinseszins, nur in die andere Richtung: Jedes Jahr verliert der Betrag auf den bereits verringerten Wert weiter an Kaufkraft.',
      },
      {
        type: 'formula',
        expression: 'Kaufkraft = Betrag / (1 + Inflationsrate)^Jahre',
        description:
          'Umgekehrt gilt für den später nötigen Betrag: Benötigt = Betrag × (1 + Inflationsrate)^Jahre. Beide Angaben zeigt der Rechner gleichzeitig.',
      },
      {
        type: 'paragraph',
        text: 'Die Halbierungszeit folgt derselben Logik wie die 72er-Regel beim Sparen: Bei 3 Prozent Inflation halbiert sich die Kaufkraft in etwa 24 Jahren.',
      },
      { type: 'heading', level: 2, text: 'Realzins statt Differenz' },
      {
        type: 'paragraph',
        text: 'Die verbreitete Näherung „Realzins = Nominalzins − Inflation“ ist für kleine Werte brauchbar, aber nicht exakt. Korrekt ist der Quotient, weil beide Effekte multiplikativ wirken.',
      },
      {
        type: 'formula',
        expression: 'Realzins = (1 + Nominalzins) / (1 + Inflationsrate) − 1',
        description:
          'Bei 6 Prozent Rendite und 2,5 Prozent Inflation ergibt das 3,41 Prozent statt der genäherten 3,5 Prozent. Über 30 Jahre macht dieser Unterschied rund 8 Prozent Endvermögen aus.',
      },
      { type: 'heading', level: 2, text: 'Annahmen und Grenzen' },
      {
        type: 'list',
        items: [
          '**Konstante Inflationsrate.** Tatsächlich schwankt sie erheblich – in einzelnen Jahren zweistellig, in anderen nahe null.',
          '**Ein Durchschnittswarenkorb.** Deine persönliche Inflationsrate weicht ab, weil du anders konsumierst als der statistische Durchschnitt. Wer viel Miete zahlt oder viel heizt, erlebt in manchen Jahren deutlich höhere Teuerung.',
          '**Keine Qualitätsänderungen.** Statistikämter rechnen Produktverbesserungen heraus. Ob das die gefühlte Teuerung korrekt abbildet, ist umstritten.',
        ],
      },
    ],
  },
  {
    slug: 'rentenrechner',
    title: 'Rentenrechner',
    headline: 'Rentenrechner: Alterseinkommen grob schätzen',
    metaTitle: 'Rentenrechner: gesetzliche Rente grob schätzen',
    metaDescription:
      'Schätze deine gesetzliche Rente über Rentenpunkte und sieh, was nach Kranken-, Pflegeversicherung und Steuern voraussichtlich netto übrig bleibt.',
    lead: 'Der Rechner schätzt über Rentenpunkte, welche Bruttorente sich ergibt – und was davon nach Kranken- und Pflegeversicherung sowie Steuern übrig bleibt.',
    summary: 'Rentenpunkte, Bruttorente und geschätzte Nettorente auf einen Blick.',
    featureList: [
      'Rentenpunkte aus Einkommen und Beitragsjahren',
      'Bruttorente über den aktuellen Rentenwert',
      'Abzüge für Kranken- und Pflegeversicherung',
      'Geschätzte Steuerlast und Nettorente',
      'Berücksichtigung betrieblicher und privater Zusatzrenten',
    ],
    grenzen: [
      'Eine Überschlagsrechnung, keine Rentenauskunft. Verbindlich ist allein die Renteninformation der Deutschen Rentenversicherung.',
      'Gerechnet wird mit gleichbleibendem Einkommen und gleichbleibendem Rentenwert. Beide ändern sich über die Jahre.',
      'Der Steuerabzug ist geschätzt. Die tatsächliche Steuer hängt vom Gesamteinkommen im Ruhestand ab.',
      'Zeiten für Kindererziehung, Arbeitslosigkeit, Ausbildung und Abschläge für einen vorzeitigen Beginn sind nicht enthalten.',
    ],
    schritte: [
      'Bisherige Rentenpunkte und das aktuelle Bruttoeinkommen eintragen.',
      'Alter und geplanten Renteneintritt angeben.',
      'Bruttorente ablesen und darunter, was nach Kranken- und Pflegeversicherung sowie Steuern bleibt.',
    ],
    relatedTopics: ['rente', 'zinseszins', 'cost-average-sparplan'],
    methodology: [
      { type: 'heading', level: 2, text: 'So wird gerechnet' },
      {
        type: 'paragraph',
        text: 'Die gesetzliche Rente beruht auf Rentenpunkten. Wer genau das Durchschnittsentgelt aller Versicherten verdient, erhält für dieses Jahr einen Punkt. Wer doppelt so viel verdient, zwei – begrenzt durch die Beitragsbemessungsgrenze.',
      },
      {
        type: 'formula',
        expression: 'Punkte pro Jahr = Bruttojahreseinkommen / Durchschnittsentgelt',
        description:
          'Einkommen oberhalb der Beitragsbemessungsgrenze erhöht die Punktzahl nicht mehr, weil darauf keine Beiträge erhoben werden.',
      },
      {
        type: 'formula',
        expression: 'Bruttorente pro Monat = Summe der Punkte × aktueller Rentenwert',
        description:
          'Der Rentenwert ist der Euro-Betrag, den ein Punkt monatlich wert ist. Er wird jährlich angepasst; im Rechner ist er als Eingabefeld hinterlegt.',
      },
      { type: 'heading', level: 2, text: 'Von brutto zu netto' },
      {
        type: 'list',
        items: [
          '**Kranken- und Pflegeversicherung** werden von der Bruttorente abgezogen.',
          '**Steuern:** Renten sind nachgelagert zu einem Anteil steuerpflichtig, der vom Jahr des Rentenbeginns abhängt. Der Rechner arbeitet mit einem einstellbaren steuerpflichtigen Anteil und einem einstellbaren persönlichen Steuersatz.',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Bewusst stark vereinfacht',
        items: [
          'Angenommen wird ein **konstantes Einkommen** über alle Beitragsjahre und ein konstanter Rentenwert. Beides trifft in der Realität nicht zu.',
          'Nicht berücksichtigt: Kindererziehungs- und Pflegezeiten, Ausbildungszeiten, Abschläge bei früherem Rentenbeginn, Zuschläge bei Aufschub, Erwerbsminderung, Zeiten im Ausland und künftige Rentenanpassungen.',
          'Verbindliche Auskunft erteilt ausschließlich die Deutsche Rentenversicherung. Dieser Rechner liefert eine **Größenordnung**, keine Zusage – und keine Steuerberatung.',
        ],
      },
    ],
  },
  {
    slug: 'rentenluecke',
    title: 'Rentenlücke',
    headline: 'Rentenlücken-Rechner: Bedarf gegen Erwartung',
    metaTitle: 'Rentenlücke berechnen: Bedarf, Kapital, Sparrate',
    metaDescription:
      'Ermittle deine monatliche Rentenlücke, das dafür nötige Kapital und die monatliche Sparrate – durchgehend in heutiger Kaufkraft gerechnet.',
    lead: 'Wie groß ist der Abstand zwischen gewünschtem Alterseinkommen und erwarteter Rente – und welche Sparrate schließt ihn? Gerechnet wird in heutiger Kaufkraft.',
    summary: 'Monatliche Lücke, nötiges Kapital und die dafür erforderliche Sparrate.',
    featureList: [
      'Monatliche Rentenlücke aus Bedarf und erwarteten Einkünften',
      'Benötigtes Kapital zum Rentenbeginn',
      'Erforderliche monatliche Sparrate',
      'Rechnung in heutiger Kaufkraft über den Realzins',
      'Berücksichtigung vorhandenen Vorsorgevermögens',
    ],
    grenzen: [
      'Die erwartete gesetzliche Rente gibst du selbst vor. Verlässlicher ist die Renteninformation der Deutschen Rentenversicherung.',
      'Eine konstante Rendite und eine konstante Inflationsrate über Jahrzehnte sind Annahmen, keine Erwartungswerte.',
      'Ohne Steuern auf Kapitalerträge und ohne Kranken- und Pflegeversicherungsbeiträge im Ruhestand.',
      'Ein längeres Leben als angenommen verlängert den Bedarf. Die Dauer des Ruhestands ist die unsicherste Größe der Rechnung.',
    ],
    schritte: [
      'Gewünschtes monatliches Alterseinkommen in heutiger Kaufkraft eintragen.',
      'Erwartete gesetzliche Rente und vorhandenes Vorsorgevermögen angeben.',
      'Jahre bis zum Renteneintritt und angenommene Rendite eintragen.',
      'Die Lücke und die Sparrate ablesen, die sie bis zum Renteneintritt schließt.',
    ],
    relatedTopics: ['rente', 'zinseszins', 'cost-average-sparplan', 'etf'],
    methodology: [
      { type: 'heading', level: 2, text: 'Alles in heutiger Kaufkraft' },
      {
        type: 'paragraph',
        text: 'Der Rechner arbeitet durchgehend mit dem **Realzins** und gibt alle Ergebnisse in heutigen Euro aus. Das vermeidet die häufigste Schwäche solcher Rechnungen: eine große nominale Endsumme, deren tatsächlichen Wert in 30 Jahren niemand einschätzen kann. Die nominale Zielsumme wird zusätzlich ausgewiesen.',
      },
      {
        type: 'formula',
        expression: 'Realzins = (1 + Rendite) / (1 + Inflation) − 1',
        description:
          'Mit diesem Satz werden sowohl der Kapitalaufbau als auch die Entnahmephase gerechnet. Die eingegebene Sparrate ist damit ebenfalls in heutiger Kaufkraft zu verstehen.',
      },
      { type: 'heading', level: 2, text: 'Die drei Rechenschritte' },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Monatliche Lücke:** gewünschtes Netto minus erwartete gesetzliche Rente minus sonstige gesicherte Einkünfte.',
          '**Benötigtes Kapital:** der Barwert dieser monatlichen Zahlung über die erwartete Dauer des Ruhestands, abgezinst mit dem Realzins.',
          '**Sparrate:** die umgestellte Sparplanformel für den Betrag, den vorhandenes Vermögen nicht abdeckt.',
        ],
      },
      {
        type: 'formula',
        expression: 'Kapitalbedarf = Lücke × (1 − (1 + i)^−n) / i',
        description:
          'i ist der reale Monatszins, n die Anzahl der Monate im Ruhestand. Diese Formel unterstellt, dass das Kapital am Ende des Zeitraums vollständig verbraucht ist.',
      },
      { type: 'heading', level: 2, text: 'Annahmen und Grenzen' },
      {
        type: 'list',
        items: [
          '**Konstante Rendite und Inflation** über Jahrzehnte. Beides schwankt in der Realität erheblich.',
          '**Kapitalverzehr:** Das Kapital ist am Ende der eingegebenen Ruhestandsdauer aufgebraucht. Wer länger lebt, braucht mehr – das Langlebigkeitsrisiko ist nicht abgesichert.',
          '**Kein Sequenzrisiko:** Schwache Renditejahre unmittelbar nach Rentenbeginn treffen Entnahmen besonders hart. Eine Rechnung mit konstanter Rendite kann diesen Effekt nicht abbilden.',
          '**Keine Steuern in der Entnahmephase** und keine Produktkosten.',
        ],
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Wie du das Ergebnis nutzt',
        items: [
          'Rechne mehrere Szenarien: eine Rendite ein Prozentpunkt niedriger, eine Inflationsrate ein Prozentpunkt höher, eine Ruhestandsdauer fünf Jahre länger. Die Spannweite dieser Ergebnisse ist aussagekräftiger als jede einzelne Zahl.',
        ],
      },
    ],
  },
  {
    slug: 'haushaltsrechner',
    title: 'Haushaltsrechner',
    headline: 'Haushaltsrechner: Budget und Sparquote',
    metaTitle: 'Haushaltsrechner: Budget und Sparquote berechnen',
    metaDescription:
      'Stelle Einnahmen und Ausgaben gegenüber, ermittle deine Sparquote und sieh, wie lange der Aufbau eines Notgroschens dauert.',
    lead: 'Einnahmen und Ausgaben gegenüberstellen, Sparquote ermitteln und sehen, wie schnell der Notgroschen zusammenkommt. Alle Angaben pro Monat.',
    summary: 'Einnahmen, Ausgaben, Sparquote und Notgroschen-Ziel.',
    featureList: [
      'Einnahmen und Ausgaben mit eigenen Kategorien',
      'Monatlicher Überschuss und Sparquote',
      'Verteilung der Ausgaben als Diagramm',
      'Empfohlener Notgroschen und Dauer des Aufbaus',
    ],
    grenzen: [
      'Eine Momentaufnahme eines Monats. Jährliche Posten – Versicherungen, Urlaub, Reparaturen – verzerren das Bild, wenn sie nicht anteilig eingerechnet sind.',
      'Gerechnet wird nur, was eingetragen wurde. Der häufigste Fehler ist eine vergessene Ausgabe, nicht eine falsche Zahl.',
    ],
    schritte: [
      'Monatliche Einnahmen eintragen.',
      'Ausgaben nach Posten eintragen: Wohnen, Lebensmittel, Mobilität, Versicherungen, Sonstiges.',
      'Sparquote ablesen und daneben, wie viele Monate der Notgroschen bis zur gewünschten Höhe braucht.',
    ],
    relatedTopics: ['worauf-achten-einsteiger', 'tagesgeld', 'cost-average-sparplan'],
    methodology: [
      { type: 'heading', level: 2, text: 'So wird gerechnet' },
      {
        type: 'formula',
        expression: 'Sparquote = (Einnahmen − Ausgaben) / Einnahmen × 100',
        description:
          'Der Überschuss ist das, was am Monatsende übrig bleibt. Die Sparquote setzt ihn ins Verhältnis zu den Einnahmen – dadurch bleiben unterschiedliche Einkommenshöhen vergleichbar.',
      },
      {
        type: 'paragraph',
        text: 'Der empfohlene Notgroschen orientiert sich an den **Ausgaben**, nicht am Einkommen: drei bis sechs Monatsausgaben. Entscheidend ist, wie lange du ohne Einkommen durchkommst.',
      },
      { type: 'heading', level: 2, text: 'Was leicht vergessen wird' },
      {
        type: 'paragraph',
        text: 'Die häufigste Fehlerquelle sind Posten, die nicht monatlich anfallen: Versicherungsbeiträge, Kfz-Steuer, Werkstatt, Urlaub, Weihnachten, Rundfunkbeitrag, Zahnersatz. Wer sie weglässt, überschätzt seine Sparquote regelmäßig um mehrere Prozentpunkte.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Der Trick mit dem Zwölftel',
        items: [
          'Rechne jährliche Posten auf den Monat um: Ein Jahresbeitrag von 480 Euro sind 40 Euro monatlich. Diese Beträge gehören in ein separates Rücklagenkonto, damit sie nicht als frei verfügbar gelten.',
          'Die zweite Prüfung ist einfacher als jedes Haushaltsbuch: Vergleiche den berechneten Überschuss mit dem tatsächlichen Kontostandzuwachs der letzten drei Monate. Weichen sie ab, fehlen Positionen.',
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Deine Daten bleiben bei dir',
        items: [
          'Die Eingaben werden ausschließlich im Browser verarbeitet. Es findet keine Übertragung an einen Server und keine Speicherung statt – nach dem Neuladen der Seite sind die Werte wieder auf die Vorbelegung zurückgesetzt.',
        ],
      },
    ],
  },
  {
    slug: 'sparplanverlauf',
    title: 'Sparplan am echten Verlauf',
    headline: 'Sparplan am tatsächlichen Kursverlauf',
    metaTitle: 'Sparplan-Rechner mit echten Kursen statt fester Rendite',
    metaDescription:
      'Was ein Sparplan an echten Kursen ergeben hätte – und was dieselbe Rendite ohne Schwankung gebracht hätte. Der Unterschied ist die Wirkung der Reihenfolge.',
    lead: 'Ein Zinsrechner nimmt eine feste Rendite an und liefert eine glatte Kurve. Ein echter Kursverlauf tut das nie. Dieser Rechner stellt beides nebeneinander – bei derselben Gesamtentwicklung.',
    summary: 'Sparplan an echten Kursen gegen dieselbe Rendite ohne Schwankung.',
    featureList: [
      'Sparplan über die abgerufene Kursreihe eines Titels',
      'Vergleichsrechnung mit gleichmäßiger Rendite bei gleicher Gesamtentwicklung',
      'Mittlerer Einstand gegen Durchschnitt der Kurse',
      'Über tausend Titel zur Auswahl',
    ],
    grenzen: [
      'Der Zeitraum ist so lang wie die gespeicherte Kursreihe – derzeit fünf Jahre. Für eine Aussage über Sparpläne ist das kurz, und es steht überall dabei.',
      'Ohne Dividenden. Die Kursreihe ist eine Kursreihe; bei einem Titel mit vier Prozent Ausschüttung fehlen über den Zeitraum entsprechend viele Prozentpunkte.',
      'Ohne Kosten und Steuern. Ordergebühren, Spread und Abgeltungsteuer sind nicht enthalten.',
      'Ein Rückblick auf **einen** Titel und **einen** Zeitraum. Dass der echte Verlauf hier besser abgeschnitten hat, sagt nichts über den nächsten.',
    ],
    schritte: [
      'Titel über das Suchfeld auswählen – Aktie, ETF, Index, Rohstoff oder Kryptowährung.',
      'Rate je Monat eintragen; gekauft wird am ersten Handelstag jedes Monats.',
      'Beide Endwerte nebeneinander ablesen: am echten Kursverlauf und bei gleichmäßiger Rendite.',
      'Den mittleren Einstand mit dem Durchschnitt der Kurse vergleichen – er liegt immer darunter.',
    ],
    relatedTopics: ['cost-average-sparplan', 'zinseszins', 'risiko-und-rendite', 'etf'],
    methodology: [
      { type: 'heading', level: 2, text: 'So wird gerechnet' },
      {
        type: 'paragraph',
        text: 'Der Rechner nimmt die gespeicherte Kursreihe des Titels und kauft an jedem ersten Handelstag eines Monats für die eingegebene Rate. Wie viele Anteile das sind, entscheidet der Kurs an genau diesem Tag.',
      },
      {
        type: 'formula',
        expression: 'Anteile = Σ ( Rate / Kursₘ )   ·   Endwert = Anteile × letzter Kurs',
        description:
          'Bei niedrigem Kurs bringt dieselbe Rate mehr Anteile. Genau daher kommt der Unterschied zur gleichmäßigen Rechnung.',
      },
      { type: 'heading', level: 2, text: 'Womit verglichen wird' },
      {
        type: 'paragraph',
        text: 'Die Vergleichsrechnung setzt **nicht** sieben Prozent an oder irgendeine andere Annahme, sondern die Rendite, die der Titel im selben Zeitraum tatsächlich erzielt hat. Beide Wege beginnen und enden damit beim selben Kurs.',
      },
      {
        type: 'paragraph',
        text: 'Das ist der Punkt: Was übrig bleibt, ist allein die Wirkung der **Reihenfolge**. Eine geratene Vergleichsrendite würde zwei Dinge auf einmal ändern, und aus dem Ergebnis ließe sich nichts mehr ablesen.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Warum der Einstand unter dem Durchschnitt liegt',
        items: [
          'Der **mittlere Einstand** ist Einzahlung geteilt durch Anteile. Der **Durchschnittskurs** ist der Mittelwert der Kurse an den Kauftagen. Beide sind verschieden, sobald die Kurse schwanken – und der Einstand liegt dann immer darunter.',
          'Das ist kein Trick und kein Vorteil, sondern eine Eigenschaft des harmonischen Mittels: Bei niedrigem Kurs fließt dieselbe Rate in mehr Anteile, sie wiegt also schwerer.',
          'Daraus folgt **nicht**, dass ein Sparplan eine Einmalanlage schlägt. Bei durchweg steigenden Kursen tut er das nicht – dann war die Einmalanlage länger investiert.',
        ],
      },
    ],
  },
  {
    slug: 'entnahmeplan',
    title: 'Entnahmeplan',
    headline: 'Entnahmeplan: wie lange trägt das Kapital',
    metaTitle: 'Entnahmeplan-Rechner: Reichweite des Kapitals im Ruhestand',
    metaDescription:
      'Wie lange ein Kapital trägt, aus dem monatlich entnommen wird – mit Inflationsanpassung der Entnahme, Realzins und dem Betrag, der dauerhaft möglich wäre.',
    lead: 'Rentenrechner und Rentenlücke rechnen bis zum Ruhestand. Dieser rechnet danach: Ein Kapital, eine monatliche Entnahme – und die Frage, wie lange das gutgeht.',
    summary: 'Reichweite eines Kapitals bei monatlicher Entnahme, inflationsbereinigt.',
    featureList: [
      'Reichweite in Jahren aus Kapital, Entnahme, Rendite und Inflation',
      'Entnahme steigt jedes Jahr mit der Inflation – reale und nominale Beträge nebeneinander',
      'Der Betrag, der dauerhaft möglich wäre, ohne das Kapital zu verringern',
      'Verlauf Jahr für Jahr und das Sequenzrisiko an echten Jahresrenditen',
    ],
    grenzen: [
      'Eine feste Rendite je Jahr. Genau die gibt es nicht – wie sehr die **Reihenfolge** der Jahre zählt, steht unter dem Rechner an echten Jahresrenditen.',
      'Ohne Steuern. In der Entnahmephase fällt Abgeltungsteuer auf den Gewinnanteil jedes verkauften Anteils an; wie hoch der ist, hängt vom Einstandskurs ab, den dieser Rechner nicht kennt.',
      'Ohne Produktkosten. Eine Fondsgebühr von 0,5 Prozent senkt die Rendite um genau diesen Betrag und verkürzt die Reichweite spürbar.',
      'Entnommen wird rechnerisch am Jahresende. Wer monatlich entnimmt, nimmt im Schnitt ein halbes Jahr früher heraus – über dreißig Jahre kostet das etwa ein halbes bis ein Jahr Reichweite.',
      'Die Dauer ist eine Eingabe, kein Wissen. Wer länger lebt als geplant, hat kein Kapital mehr – das ist das Langlebigkeitsrisiko, und dagegen hilft nur eine niedrigere Entnahme oder eine lebenslange Rente.',
    ],
    schritte: [
      'Vorhandenes Kapital eintragen – alles, woraus entnommen werden soll.',
      'Gewünschte monatliche Entnahme in heutiger Kaufkraft eingeben.',
      'Gewünschte Dauer, erwartete Rendite und Inflationsrate setzen.',
      'Reichweite ablesen und mit den beiden Vergleichsbeträgen daneben abgleichen: was dauerhaft ginge und was die gewünschte Dauer genau ausschöpft.',
    ],
    relatedTopics: ['rente', 'inflation', 'zinseszins', 'risiko-und-rendite'],
    methodology: [
      { type: 'heading', level: 2, text: 'So wird gerechnet' },
      {
        type: 'paragraph',
        text: 'Jedes Jahr wächst das Kapital um die erwartete Rendite, danach wird die Jahresentnahme abgezogen. Die Reichweite ist das Jahr, in dem nichts mehr übrig ist.',
      },
      {
        type: 'formula',
        expression: 'Kapitalₜ = Kapitalₜ₋₁ × (1 + realer Zins) − Entnahme',
        description:
          'Gerechnet wird durchgehend in heutiger Kaufkraft. Der reale Zins ist nicht die Differenz aus Rendite und Inflation, sondern der Quotient: (1 + Rendite) ÷ (1 + Inflation) − 1.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum die Entnahme jedes Jahr steigt',
      },
      {
        type: 'paragraph',
        text: 'Weil sonst eine Kürzung eingerechnet wäre, die niemand beschlossen hat. Wer heute 2.000 € im Monat braucht, braucht in zwanzig Jahren mehr Euro für denselben Warenkorb – bei zwei Prozent Inflation rund 2.970 €.',
      },
      {
        type: 'paragraph',
        text: 'Ein Rechner mit fester Entnahme in Euro liefert deshalb eine zu freundliche Reichweite. Hier steigt der Betrag jedes Jahr mit der Inflationsrate; in der Tabelle stehen beide Spalten nebeneinander, damit sichtbar wird, was daraus wird.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Die beiden Vergleichsbeträge',
      },
      {
        type: 'paragraph',
        text: 'Neben der Reichweite stehen zwei Beträge, die dieselbe Frage von der anderen Seite stellen. Der eine ist die Entnahme, bei der nur der reale Ertrag verbraucht wird – das Kapital behält dann seine Kaufkraft. Der andere ist die Entnahme, die das Kapital über die gewünschte Dauer genau aufbraucht.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Was von der Vier-Prozent-Regel zu halten ist',
        items: [
          'Die bekannte Regel stammt aus einer Untersuchung des US-Marktes über dreißig Jahre. Sie sagt: Wer im ersten Jahr vier Prozent entnimmt und den Betrag danach mit der Inflation erhöht, kam historisch über dreißig Jahre.',
          'Sie ist keine Naturkonstante. Sie hängt am untersuchten Markt, am Zeitraum, an der Aufteilung zwischen Aktien und Anleihen – und an genau dreißig Jahren. Wer vierzig Jahre plant, hat eine andere Zahl.',
          'Was sie richtig macht: Sie erhöht die Entnahme mit der Inflation. Was sie offenlässt: Steuern, Kosten und die Reihenfolge der Renditejahre.',
        ],
      },
    ],
  },
  {
    slug: 'depotanalyse',
    title: 'Depotanalyse',
    headline: 'Depotanalyse: wie sich das Geld tatsächlich verteilt',
    metaTitle: 'Depotanalyse: Gewichtung, Branchen, Länder, Währungen',
    metaDescription:
      'Positionen eintragen und sehen, wie sich die Summe auf Anlagearten, Branchen, Länder und Währungen verteilt – mit Klumpenrisiko und wirksamer Positionszahl.',
    lead: 'Zehn Positionen fühlen sich nach Streuung an. Sind sechs davon aus einer Branche und macht eine allein die Hälfte aus, ist es keine – einer Liste sieht man das nicht an. Trag deine Positionen mit ihrem Wert ein; die Aufteilung rechnet der Browser.',
    summary: 'Gewichtung nach Anlageart, Branche, Land und Währung – samt Klumpenrisiko.',
    featureList: [
      'Gewichtung je Position als Balken',
      'Aufteilung nach Anlageart, Branche, Sitzland und Währung',
      'Größte Position, drei größte und wirksame Positionszahl',
      'Gewichtete Kostenquote und Ausschüttungsrendite mit Angabe der Abdeckung',
      'Rechnet im Browser; nichts wird gespeichert oder gesendet',
    ],
    methodology: [
      {
        type: 'paragraph',
        text: 'Gerechnet wird nur mit Anteilen. Jeder eingetragene Betrag wird durch die Summe geteilt – daraus ergeben sich alle Aufteilungen. Ob jemand 300 oder 30.000 Euro angelegt hat, ändert nichts daran, ob die Hälfte davon in einer Branche steckt.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Die wirksame Positionszahl',
      },
      {
        type: 'paragraph',
        text: 'Sie beantwortet die Frage, wie vielen **gleich großen** Positionen die Aufteilung entspricht. Gerechnet als Kehrwert der Summe aller quadrierten Anteile – dem Herfindahl-Index, der in der Wettbewerbsökonomie Marktkonzentration misst und hier dasselbe für ein Depot tut.',
      },
      {
        type: 'paragraph',
        text: 'Ein Beispiel: fünf Positionen, davon eine mit 60 Prozent und vier mit je 10. Die wirksame Zahl ist 2,5. Es sind fünf Zeilen, aber die Verteilung verhält sich wie zweieinhalb gleich große. Genau diesen Unterschied verdeckt eine Liste.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Woher die Zuordnungen kommen',
      },
      {
        type: 'paragraph',
        text: 'Branche, Sitzland und Währung stehen an den Instrumenten dieser Website. Die Brancheneinteilung ist die eigene und keine amtliche – GICS und ICB sind lizenzpflichtig und ordnen dieselbe Firma gelegentlich verschieden ein.',
      },
      {
        type: 'paragraph',
        text: 'Zu ETFs und Rohstoffen ist keine Branche hinterlegt, weil sie keine einzelne haben. Sie erscheinen als „nicht zugeordnet" – die Branchenaufteilung beschreibt dann ausdrücklich nur den Rest und nicht das Ganze.',
      },
      {
        type: 'paragraph',
        text: 'Die Eingaben bleiben im Browser. Die Seite ist ein statisches Dokument ohne Gegenstelle – es gibt keinen Server, an den etwas gehen könnte.',
      },
    ],
    grenzen: [
      'Kein Risikomaß. Es wird keine Schwankungsbreite und keine Korrelation gerechnet – zwei Titel aus verschiedenen Branchen können sich trotzdem im Gleichschritt bewegen.',
      'Nur was eingetragen wurde. Ein vergessener Posten fehlt in jeder Aufteilung.',
      'Zu ETFs und Rohstoffen ist keine Branche hinterlegt; die Branchenaufteilung beschreibt nur den zugeordneten Teil.',
      'Keine Steuern, keine Transaktionskosten.',
    ],
    schritte: [
      'Positionen über das Suchfeld auswählen und ihren Wert eintragen.',
      'Aufteilung nach Anlageart, Branche, Land und Währung ablesen.',
      'Die Beobachtungen darunter lesen – sie nennen Klumpen, die einer Liste nicht anzusehen sind.',
    ],
    relatedTopics: ['portfolio-aufbau', 'risiko-und-rendite', 'aktien-laender-branchen'],
  },
]

/*
  Die Zahl in `lib/site.ts` gegen die Wirklichkeit prüfen.

  Dort steht sie als Ziffer, weil die Kopfzeile eine Client-Komponente ist und
  ein Import dieser Datei den ganzen Datensatz ins Browser-Bundle zöge – für
  eine einzige Zahl. Der Preis dafür ist, dass sie veralten kann. Genau das ist
  passiert: Drei Rechner kamen dazu, die Texte blieben bei fünf stehen.

  Umgekehrt als beim Lernbereich, wo `lib/learn.ts` die Daten prüft: Hier
  importiert die Datendatei die Zahl, weil es keine Dienstschicht für die
  Rechner gibt. Der Effekt ist derselbe – der Build bricht ab, statt eine
  falsche Zahl auf die Startseite zu schreiben.
*/
if (calculators.length !== RECHNER_ANZAHL) {
  throw new Error(
    `RECHNER_ANZAHL in lib/site.ts steht auf ${RECHNER_ANZAHL}, es gibt aber ${calculators.length} Rechner. Bitte dort anpassen – auch RECHNER_ANZAHL_WORT.`
  )
}

export function getCalculatorDefinition(slug: string): CalculatorDefinition | undefined {
  return calculators.find((calculator) => calculator.slug === slug)
}
