import type { ContentBlock } from '@/data/content'

/**
 * Metadaten und Methodik-Texte der fünf Rechner.
 *
 * Die Rechenlogik selbst liegt in `lib/finance.ts`. Hier steht ausschließlich,
 * was auf der Seite erklärt wird – jeder Rechner legt seine Formel und seine
 * Annahmen offen, damit ein Ergebnis eingeordnet werden kann.
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
  /** Slugs passender Lernthemen. */
  relatedTopics: string[]
}

export const calculators: CalculatorDefinition[] = [
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
      {
        type: 'callout',
        variant: 'warning',
        title: 'Was dieser Rechner nicht ist',
        items: [
          'Eine Modellrechnung, keine Prognose. Die Rendite gibst du selbst vor – das Ergebnis ist genau so verlässlich wie diese Annahme.',
          'Für Aktienanlagen liefert eine konstante Rendite systematisch zu glatte Ergebnisse. Schwankungen kosten zusätzlich Rendite (Volatilitätsbremse).',
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
      'Trage Besitz und Schulden in einen Bogen ein und lade ihn als Tabelle herunter – ausgefüllt oder leer zum Ausdrucken. Alle Eingaben bleiben im Browser.',
    lead: 'Was besitzt du, was schuldest du, was bleibt? Der Bogen führt durch beide Seiten und rechnet das Nettovermögen aus. Herunterladen kannst du ihn ausgefüllt oder leer zum Ausdrucken – gedacht zum Abheften und Wiedervorlegen.',
    summary:
      'Besitz und Schulden erfassen, Nettovermögen ermitteln, Bogen herunterladen.',
    featureList: [
      'Sechs Bereiche von Konten bis Sachwerten und Schulden',
      'Mehrere Zeilen je Posten, jede mit eigener Bezeichnung',
      'Nettovermögen, Besitz und Schulden auf einen Blick',
      'Download als Tabelle – ausgefüllt oder leer zum Ausdrucken',
      'Leere Spalten für die nächsten Stichtage',
      'Eingaben bleiben im Browser, ohne Anmeldung',
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
        text: 'In der heruntergeladenen Datei steht jede Zeile einzeln, mit ihrem eigenen Namen. Zusammengezogen würde sie genau die Auskunft verlieren, für die man sie getrennt eingetragen hat.',
      },
      { type: 'heading', level: 2, text: 'Warum es zwei Downloads gibt' },
      {
        type: 'paragraph',
        text: 'Weil es zwei Arten gibt, so etwas zu führen. Die einen füllen den Bogen hier aus und nehmen das Ergebnis mit. Die anderen wollen einen leeren Bogen zum Ausdrucken, den sie mit dem Kontoauszug daneben mit der Hand ausfüllen. Beide Wege enden bei derselben Datei – einmal mit Zahlen, einmal ohne.',
      },
      {
        type: 'paragraph',
        text: 'Die Datei ist eine Tabelle mit Semikolon-Trennung und Dezimalkomma. Sie öffnet sich in deutschen Tabellenprogrammen ohne Importdialog und bringt fünf leere Spalten für die nächsten Stichtage mit.',
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
          'Dafür gibt es den Weg über die Zwischenablage: „Ausgefüllt anzeigen“ zeigt dieselbe Tabelle als Text. Kopieren, in eine leere Tabelle einfügen und beim Einfügen das Semikolon als Trennzeichen wählen – das Ergebnis ist dasselbe.',
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
]

export function getCalculatorDefinition(slug: string): CalculatorDefinition | undefined {
  return calculators.find((calculator) => calculator.slug === slug)
}
