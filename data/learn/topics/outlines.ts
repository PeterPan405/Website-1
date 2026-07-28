import { outlineTopic } from '@/data/learn/outline'

/**
 * Themen, deren Seitenstruktur vollständig steht und deren Fließtext folgt.
 *
 * Reihenfolge und Slugs entsprechen der Themenliste des Projekts. Jede Stufe
 * bekommt eine eigene Gliederung mit klarer Abgrenzung: Beginner klärt
 * Begriffe, Fortgeschritten die Umsetzung, Profi Sonderfälle, Kennzahlen,
 * Risiken und Steuern.
 */

export const rente = outlineTopic({
  slug: 'rente',
  title: 'Rente',
  headline: 'Rente: gesetzlich, betrieblich und privat im Zusammenspiel',
  metaTitle: 'Rente erklärt: gesetzlich, betrieblich und privat',
  metaDescription:
    'Wie die drei Säulen der Altersvorsorge zusammenwirken, was Rentenpunkte wirklich bedeuten und wie du deine tatsächliche Versorgungslücke berechnest.',
  lead: 'Die gesetzliche Rente ist als Basis gedacht, nicht als Vollversorgung. Erst die drei Säulen zusammen ergeben ein Bild.',
  overview: [
    'Altersvorsorge in Deutschland ruht auf drei Säulen: der gesetzlichen Rentenversicherung, der betrieblichen Altersversorgung und der privaten Vorsorge. Keine trägt allein.',
    'Die gesetzliche Rente arbeitet im Umlageverfahren: Die Beiträge der Beschäftigten finanzieren unmittelbar die heutigen Renten. Sie ist damit unmittelbar von der Bevölkerungsentwicklung abhängig.',
    'Die Stufen führen von den Grundbegriffen über Rentenpunkte, Steuer- und Sozialabgaben auf Renten bis zu Betriebsrentenzusagen, Rentenfaktoren und der Frage, wann Sonderzahlungen sinnvoll sind.',
  ],
  keywords: ['Rente', 'gesetzliche Rente', 'Rentenpunkte', 'betriebliche Altersvorsorge'],
  related: ['zinseszins', 'cost-average-sparplan', 'worauf-achten-einsteiger'],
  calculators: ['/rechner/rentenrechner', '/rechner/rentenluecke'],
  levels: {
    beginner: {
      metaTitle: 'Rente einfach erklärt – die drei Säulen im Überblick',
      metaDescription:
        'Wie die gesetzliche Rente funktioniert, was Rentenpunkte sind, was die Renteninformation aussagt und warum der Bruttobetrag darauf täuscht.',
      title: 'Rente einfach erklärt',
      lead: 'Die drei Säulen, das Umlageverfahren und wie du deine Renteninformation richtig liest.',
      readingMinutes: 9,
      sections: [
        {
          heading: 'Die drei Säulen',
          points: [
            'Gesetzliche Rentenversicherung: Pflichtsystem für die meisten Beschäftigten.',
            'Betriebliche Altersversorgung: Zusage über den Arbeitgeber, oft mit Zuschuss.',
            'Private Vorsorge: alles, was du selbst aufbaust – vom Sparplan bis zur Rentenversicherung.',
            'Warum keine Säule allein ausreicht und wie sie sich ergänzen.',
          ],
        },
        {
          heading: 'Wie die gesetzliche Rente rechnet',
          points: [
            'Umlageverfahren: Beiträge von heute zahlen Renten von heute, es wird nichts angespart.',
            'Rentenpunkte: ein Punkt pro Jahr bei Durchschnittsverdienst, mehr oder weniger je nach Einkommen.',
            'Rentenformel: Punkte × aktueller Rentenwert ergibt die monatliche Bruttorente.',
            'Wartezeiten und Mindestversicherungszeiten für den Rentenanspruch.',
          ],
        },
        {
          heading: 'Die Renteninformation richtig lesen',
          points: [
            'Der genannte Betrag ist brutto und in heutiger Kaufkraft ausgedrückt.',
            'Abzüge: Beiträge zur Kranken- und Pflegeversicherung sowie Steuern.',
            'Die Hochrechnung unterstellt, dass dein Einkommen so weiterläuft wie bisher.',
            'Erste Einordnung: Was von 1.600 Euro brutto realistisch übrig bleibt.',
          ],
        },
      ],
    },
    fortgeschritten: {
      metaTitle: 'Rente fortgeschritten: Abzüge, bAV und Rentenbeginn',
      metaDescription:
        'Steuern und Sozialabgaben auf Renten, Durchführungswege der betrieblichen Altersvorsorge und die Rechnung hinter früherem oder späterem Rentenbeginn.',
      title: 'Rente in der Praxis',
      lead: 'Was von der Bruttorente bleibt, wie Betriebsrenten aufgebaut sind und was Rentenbeginn und Abschläge kosten.',
      readingMinutes: 12,
      sections: [
        {
          heading: 'Von brutto zu netto',
          points: [
            'Kranken- und Pflegeversicherungsbeiträge auf gesetzliche Renten.',
            'Nachgelagerte Besteuerung: der steuerpflichtige Anteil steigt mit dem Rentenjahrgang.',
            'Rentenfreibetrag: Ermittlung und dauerhafte Festschreibung.',
            'Beispielrechnung von der Bruttorente zum verfügbaren Betrag.',
          ],
        },
        {
          heading: 'Betriebliche Altersversorgung',
          points: [
            'Die fünf Durchführungswege und wer das Anlagerisiko trägt.',
            'Entgeltumwandlung: Vorteil heute, Beitragspflicht in der Rentenphase.',
            'Arbeitgeberzuschuss, Unverfallbarkeit und Portabilität bei Jobwechsel.',
            'Wann eine Betriebsrente rechnerisch lohnt und wann nicht.',
          ],
        },
        {
          heading: 'Rentenbeginn und Abschläge',
          points: [
            'Regelaltersgrenze, vorgezogene Rente und dauerhafte Abschläge pro Monat.',
            'Zuschläge beim Aufschub und die Rechnung zur Amortisationsdauer.',
            'Ausgleichszahlungen für Rentenabschläge und ihre steuerliche Wirkung.',
            'Hinzuverdienst und Teilrente im Überblick.',
          ],
        },
      ],
    },
    profi: {
      metaTitle: 'Rente für Profis: Rentenfaktor, Steuern, Sonderfälle',
      metaDescription:
        'Garantierter Rentenfaktor und Verrentungsquote, Doppelverbeitragung in der bAV, Beitragsbemessungsgrenzen sowie Auslandsfälle und Versorgungsausgleich.',
      title: 'Rente auf Profi-Niveau',
      lead: 'Rentenfaktoren, Doppelverbeitragung, freiwillige Beiträge und die Sonderfälle, die selten erklärt werden.',
      readingMinutes: 14,
      sections: [
        {
          heading: 'Verrentung privater Verträge bewerten',
          points: [
            'Rentenfaktor: garantierter gegen prognostizierter Wert und was er über die nötige Lebenserwartung sagt.',
            'Kapitalwahlrecht gegen Verrentung – Break-even-Berechnung.',
            'Kosten in der Rentenphase und ihre Wirkung auf die Auszahlung.',
            'Sterbetafeln und Langlebigkeitsrisiko: was die Versicherung tatsächlich absichert.',
          ],
        },
        {
          heading: 'Steuer- und Beitragsfallen',
          points: [
            'Doppelverbeitragung bei Betriebsrenten: Ansparphase gegen Auszahlungsphase.',
            'Freibetrag für Betriebsrenten in der Krankenversicherung.',
            'Beitragsbemessungsgrenze, Höchstbeiträge und die Grenzen freiwilliger Einzahlungen.',
            'Sonderzahlungen in die gesetzliche Rente: Rendite, Steuerabzug, Break-even.',
          ],
        },
        {
          heading: 'Sonderfälle',
          points: [
            'Versorgungsausgleich bei Scheidung und die Wirkung auf Rentenpunkte.',
            'Auslandszeiten, Sozialversicherungsabkommen und die Zusammenrechnung von Zeiten.',
            'Selbstständige: freiwillige Versicherung, Pflichtversicherung und Alternativen.',
            'Erwerbsminderungsrente und Hinterbliebenenversorgung im Überblick – kein Rechtsrat.',
          ],
        },
      ],
    },
  },
})

export const immobilien = outlineTopic({
  slug: 'immobilien',
  title: 'Immobilien',
  headline: 'Immobilien als Geldanlage: mehr Unternehmen als Sparbuch',
  metaTitle: 'Immobilien als Geldanlage: Rendite, Kosten, Risiken',
  metaDescription:
    'Was eine vermietete Immobilie wirklich einbringt, welche Kosten die Rechnung verändern und wie Kredithebel, Steuern und Klumpenrisiko zusammenwirken.',
  lead: 'Eine vermietete Immobilie ist kein passives Einkommen, sondern ein kleines Unternehmen mit Kredit, Verwaltung und Instandhaltung.',
  overview: [
    'Immobilien gelten als sichere Anlage. Tatsächlich verbinden sie mehrere Risiken, die bei Wertpapieren getrennt auftreten: Marktrisiko, Kreditrisiko, Mietausfallrisiko und einen erheblichen Verwaltungsaufwand.',
    'Der entscheidende Unterschied zu Aktien und Fonds ist der Kredithebel. Er vergrößert Gewinne und Verluste gleichermaßen – und macht die Finanzierungsstruktur wichtiger als den Kaufpreis.',
    'Die Stufen führen von Kaufnebenkosten und Mietrendite über Finanzierung und Steuerwirkung bis zu Bewertungsverfahren, Sanierungspflichten und der Frage nach Klumpenrisiko.',
  ],
  keywords: [
    'Immobilien als Geldanlage',
    'Mietrendite',
    'Kaufnebenkosten',
    'Immobilienkredit',
  ],
  related: ['zinseszins', 'aktien-laender-branchen', 'worauf-achten-einsteiger'],
  calculators: ['/rechner/zinsrechner', '/rechner/haushaltsrechner'],
  levels: {
    beginner: {
      metaTitle: 'Immobilien als Anlage – Grundlagen für Einsteiger',
      metaDescription:
        'Kaufnebenkosten, Brutto- und Nettomietrendite, laufende Kosten und der Unterschied zwischen selbst genutzter und vermieteter Immobilie.',
      title: 'Immobilien als Geldanlage: Grundlagen',
      lead: 'Was eine Immobilie kostet, was sie einbringt und warum die Bruttomietrendite fast nie stimmt.',
      readingMinutes: 9,
      sections: [
        {
          heading: 'Die Rechnung beim Kauf',
          points: [
            'Kaufnebenkosten: Grunderwerbsteuer, Notar, Grundbuch, gegebenenfalls Makler.',
            'Nebenkosten von rund 10 Prozent müssen erst wieder erwirtschaftet werden.',
            'Selbst genutzt gegen vermietet: völlig unterschiedliche Betrachtung.',
            'Warum der Kaufpreis allein nichts über die Qualität der Anlage sagt.',
          ],
        },
        {
          heading: 'Was wirklich als Rendite bleibt',
          points: [
            'Bruttomietrendite: Jahresmiete geteilt durch Kaufpreis – ein Startwert, kein Ergebnis.',
            'Nettomietrendite: nach Nebenkosten, nicht umlagefähigen Kosten und Instandhaltung.',
            'Instandhaltungsrücklage: Größenordnung pro Quadratmeter und Jahr.',
            'Mietausfall und Leerstand realistisch einplanen.',
          ],
        },
        {
          heading: 'Der Aufwand, der selten erwähnt wird',
          points: [
            'Mietersuche, Nebenkostenabrechnung, Handwerkerkoordination, Eigentümerversammlungen.',
            'Verwaltung durch Dritte kostet Rendite, spart Zeit.',
            'Alternative ohne Aufwand: offene Immobilienfonds und Immobilienaktien.',
            'Zeitaufwand als echte Kostenposition begreifen.',
          ],
        },
      ],
    },
    fortgeschritten: {
      metaTitle: 'Immobilien fortgeschritten: Finanzierung und Steuern',
      metaDescription:
        'Tilgungsplan und Zinsbindung, Wirkung des Kredithebels, Abschreibung und Werbungskosten sowie die Lage als wichtigster Werttreiber.',
      title: 'Finanzierung und Steuerwirkung',
      lead: 'Wie der Kredithebel wirkt, was steuerlich absetzbar ist und woran sich eine Lage beurteilen lässt.',
      readingMinutes: 12,
      sections: [
        {
          heading: 'Finanzierung verstehen',
          points: [
            'Annuitätendarlehen: Zusammensetzung aus Zins und Tilgung über die Laufzeit.',
            'Zinsbindung, Restschuld und Anschlussfinanzierungsrisiko.',
            'Eigenkapitalquote und ihre Wirkung auf Zinssatz und Sicherheit.',
            'Sondertilgungsrechte und Vorfälligkeitsentschädigung.',
          ],
        },
        {
          heading: 'Der Hebel wirkt in beide Richtungen',
          points: [
            'Eigenkapitalrendite bei 20 Prozent Eigenkapital: Rechenbeispiel nach oben und unten.',
            'Wann der Hebel kippt: Zinsanstieg, Mietausfall, Wertverlust.',
            'Nachschusspflicht und Übersicherung durch die Bank.',
            'Vergleich mit einem kreditfinanzierten Wertpapierdepot.',
          ],
        },
        {
          heading: 'Steuern und Lage',
          points: [
            'Abschreibung, Werbungskosten und die Abgrenzung Erhaltungsaufwand gegen Herstellungskosten.',
            'Spekulationsfrist bei Verkauf und die Ausnahme für selbst genutzte Objekte.',
            'Lagekriterien: Infrastruktur, Arbeitsmarkt, Demografie, Neubauvolumen.',
            'Mikrolage gegen Makrolage – warum die Straße wichtiger ist als die Stadt.',
          ],
        },
      ],
    },
    profi: {
      metaTitle: 'Immobilien für Profis: Bewertung, Sanierung, Risiko',
      metaDescription:
        'Ertragswert- und DCF-Bewertung, energetische Sanierungspflichten, Erbbaurecht und WEG-Recht sowie Klumpenrisiko und Liquiditätsplanung.',
      title: 'Immobilien auf Profi-Niveau',
      lead: 'Bewertungsverfahren, Sanierungspflichten, Rechtskonstruktionen und die Grenzen der Streuung.',
      readingMinutes: 15,
      sections: [
        {
          heading: 'Bewertung',
          points: [
            'Ertragswertverfahren: Liegenschaftszins, Bodenwert, Restnutzungsdauer.',
            'DCF-Bewertung mit Mietsteigerungs- und Leerstandsannahmen.',
            'Vergleichswertverfahren und die Belastbarkeit von Vergleichspreisen.',
            'Sensitivitätsanalyse: Was passiert bei einem Prozentpunkt höherem Zins?',
          ],
        },
        {
          heading: 'Regulatorische Risiken',
          points: [
            'Energetische Sanierungspflichten und Wirkung auf Wert und Cashflow.',
            'Mietrechtliche Grenzen: Kappungsgrenze, Modernisierungsumlage, Mietpreisbremse.',
            'WEG-Recht: Beschlüsse, Sonderumlagen, Sanierungsstau der Gemeinschaft.',
            'Erbbaurecht, Denkmalschutz und Wohnungsbindung als Sonderfälle.',
          ],
        },
        {
          heading: 'Portfoliosicht',
          points: [
            'Klumpenrisiko: ein Objekt kann 80 Prozent des Vermögens binden.',
            'Illiquidität: Verkaufsdauer, Preisabschlag bei Zeitdruck.',
            'Liquiditätsplanung für Instandhaltung, Leerstand, Zinsanpassung.',
            'Vergleich der risikoadjustierten Rendite mit Immobilienaktien und offenen Fonds.',
          ],
        },
      ],
    },
  },
})

export const aktienLaenderBranchen = outlineTopic({
  slug: 'aktien-laender-branchen',
  title: 'Länder & Branchen',
  headline: 'Diversifikation: Aktien nach Ländern und Branchen streuen',
  metaTitle: 'Diversifikation nach Ländern und Branchen erklärt',
  metaDescription:
    'Warum Streuung über Länder und Branchen Risiko senkt, was Home Bias kostet und wie Korrelationen in Krisen ihre Schutzwirkung verlieren.',
  lead: 'Streuung ist die einzige Möglichkeit, Risiko zu senken, ohne gleichzeitig die erwartete Rendite zu opfern.',
  overview: [
    'Wer sein Geld über viele Unternehmen, Branchen und Länder verteilt, senkt das Risiko einzelner Ausfälle, ohne dafür Rendite abzugeben. Das ist ein selten kostenloser Vorteil.',
    'In der Praxis scheitert Streuung häufig an zwei Punkten: dem Home Bias, also der Übergewichtung des Heimatmarkts, und der Illusion von Streuung, wenn viele Positionen letztlich auf dieselbe Ursache reagieren.',
    'Die Stufen behandeln Grundprinzip, Gewichtungsmethoden, Währungsrisiko und schließlich Korrelationsdynamik, Faktorüberschneidungen und den echten Beitrag von Schwellenländern.',
  ],
  keywords: ['Diversifikation', 'Streuung', 'Home Bias', 'Branchen', 'Korrelation'],
  related: ['etf', 'aktie', 'wie-funktioniert-der-markt', 'groesste-crashes'],
  symbols: ['msci-world', 'dax', 'euro-stoxx-50'],
  levels: {
    beginner: {
      metaTitle: 'Diversifikation einfach erklärt – Streuung für Einsteiger',
      metaDescription:
        'Warum Streuung Risiko senkt, wie viele Positionen sinnvoll sind, was Home Bias bedeutet und wie ein einzelner Welt-ETF das Problem löst.',
      title: 'Streuung einfach erklärt',
      lead: 'Warum es riskant ist, alles auf ein Unternehmen oder ein Land zu setzen.',
      readingMinutes: 8,
      sections: [
        {
          heading: 'Warum Streuung funktioniert',
          points: [
            'Einzelne Unternehmen können ausfallen, ein ganzer Markt praktisch nicht.',
            'Unternehmensspezifisches Risiko lässt sich wegstreuen, Marktrisiko nicht.',
            'Der Nutzen zusätzlicher Positionen nimmt schnell ab – die ersten 20 bringen am meisten.',
            'Streuung kostet keine erwartete Rendite: der Grund, warum sie zuerst kommt.',
          ],
        },
        {
          heading: 'Home Bias: die Falle des Vertrauten',
          points: [
            'Anleger übergewichten systematisch den Heimatmarkt, weil er bekannt wirkt.',
            'Der deutsche Aktienmarkt macht nur einen kleinen Teil des Weltmarkts aus.',
            'Bekanntheit ist keine Risikoreduktion, sondern nur ein Gefühl.',
            'Was passiert, wenn Arbeitsplatz und Depot in derselben Volkswirtschaft hängen.',
          ],
        },
        {
          heading: 'Streuung ohne Aufwand',
          points: [
            'Ein breiter Welt-Index enthält Hunderte Unternehmen aus vielen Ländern.',
            'Branchenstreuung entsteht dabei automatisch mit.',
            'Was ein Welt-Index nicht abdeckt: Schwellenländer und kleine Unternehmen.',
            'Erste Orientierung für ein einfaches, breites Basisportfolio.',
          ],
        },
      ],
    },
    fortgeschritten: {
      metaTitle: 'Gewichtung und Währungsrisiko bei der Streuung',
      metaDescription:
        'Marktkapitalisierung gegen BIP-Gewichtung, die Rolle von Schwellenländern, Branchenzyklen und wie Währungsrisiko in einem Weltportfolio wirkt.',
      title: 'Gewichtung, Branchen und Währungen',
      lead: 'Nach welchen Regeln man gewichtet, was Branchenzyklen bedeuten und wie stark Währungen mitspielen.',
      readingMinutes: 11,
      sections: [
        {
          heading: 'Gewichtungsmethoden',
          points: [
            'Marktkapitalisierung: selbstregulierend, aber mit hoher US-Quote.',
            'BIP-Gewichtung: höhere Schwellenländerquote, höherer Umschichtungsaufwand.',
            'Gleichgewichtung: mehr kleine Unternehmen, höhere Kosten.',
            'Regionale Beimischung: die 70/30-Konstruktion und ihre Begründung.',
          ],
        },
        {
          heading: 'Branchen und Zyklen',
          points: [
            'Zyklische gegen defensive Branchen und ihr Verhalten im Konjunkturverlauf.',
            'Sektorkonzentration in großen Indizes prüfen, nicht annehmen.',
            'Warum Branchenwetten oft eine Wette auf einen Zeitpunkt sind.',
            'Beispiel: fünf Autohersteller sind keine Streuung.',
          ],
        },
        {
          heading: 'Währungsrisiko',
          points: [
            'Wo das Risiko entsteht: Kurs des Wertpapiers gegen Kurs der Währung.',
            'Warum es bei Aktien langfristig weniger dominiert als bei Anleihen.',
            'Kosten und Nutzen von Währungsabsicherung (Hedging).',
            'Der zweite Kanal: Unternehmensumsätze in Fremdwährung.',
          ],
        },
      ],
    },
    profi: {
      metaTitle: 'Diversifikation für Profis: Korrelation und Faktoren',
      metaDescription:
        'Korrelationsanstieg in Krisen, Faktorüberschneidungen, echter Beitrag von Schwellenländern und Small Caps sowie Rebalancing-Regeln und ihre Steuerwirkung.',
      title: 'Diversifikation auf Profi-Niveau',
      lead: 'Wann Korrelationen versagen, wie sich Faktoren überschneiden und was Rebalancing tatsächlich bringt.',
      readingMinutes: 14,
      sections: [
        {
          heading: 'Korrelation ist nicht konstant',
          points: [
            'In Krisen steigen Korrelationen – genau dann, wenn Streuung schützen soll.',
            'Rollierende Korrelationen statt eines Durchschnittswerts betrachten.',
            'Tail Dependence: gemeinsames Verhalten in extremen Marktphasen.',
            'Konsequenz für die Portfoliokonstruktion und Erwartungsmanagement.',
          ],
        },
        {
          heading: 'Faktoren und Überschneidungen',
          points: [
            'Size, Value, Momentum, Quality und Low Volatility im Überblick.',
            'Wenn mehrere Fonds dieselben Faktoren abbilden: Streuung nur auf dem Papier.',
            'Faktor-Timing und lange Phasen der Unterperformance.',
            'Durchschau auf Einzeltitelebene: die tatsächlichen Überschneidungen prüfen.',
          ],
        },
        {
          heading: 'Rebalancing und Umsetzung',
          points: [
            'Kalender- gegen Bandbreiten-Rebalancing im Vergleich.',
            'Steuerwirkung: In Deutschland löst jeder Verkauf Abgeltungssteuer aus.',
            'Rebalancing über neue Einzahlungen statt über Verkäufe.',
            'Marginaler Nutzen weiterer Bausteine gegen zusätzliche Kosten und Komplexität.',
          ],
        },
      ],
    },
  },
})

export const schuldverschreibung = outlineTopic({
  slug: 'schuldverschreibung',
  title: 'Schuldverschreibung',
  headline: 'Schuldverschreibung: du bist Gläubiger, nicht Eigentümer',
  metaTitle: 'Schuldverschreibung erklärt: Zins, Kurs und Risiko',
  metaDescription:
    'Wie eine Schuldverschreibung funktioniert, warum Kurs und Rendite gegenläufig sind und welche Risiken bei Zertifikaten und Anleihen wirklich zählen.',
  lead: 'Wer eine Schuldverschreibung kauft, leiht Geld. Der entscheidende Unterschied zur Aktie: kein Miteigentum, dafür ein Rückzahlungsanspruch.',
  overview: [
    'Eine Schuldverschreibung ist ein verbrieftes Darlehen. Der Emittent verpflichtet sich, Zinsen zu zahlen und das Geld zum Laufzeitende zurückzugeben.',
    'Als Gläubiger stehst du bei einer Insolvenz vor den Eigentümern – aber hinter besicherten Gläubigern. Die Rangfolge entscheidet über den tatsächlichen Schutz.',
    'Die Stufen führen von Nennwert, Kupon und Laufzeit über Kursmechanik, Duration und Bonität bis zu Nachrangkonstruktionen, Zertifikaten und Bewertungsdetails.',
  ],
  keywords: ['Schuldverschreibung', 'Anleihe', 'Kupon', 'Emittentenrisiko', 'Duration'],
  related: ['staatsanleihe', 'fonds', 'derivat', 'einlagensicherung'],
  levels: {
    beginner: {
      metaTitle: 'Schuldverschreibung einfach erklärt – die Grundlagen',
      metaDescription:
        'Nennwert, Kupon und Laufzeit verständlich erklärt, der Unterschied zur Aktie und was Emittentenrisiko für dein Geld konkret bedeutet.',
      title: 'Schuldverschreibung einfach erklärt',
      lead: 'Was du kaufst, wenn du einem Unternehmen oder Staat Geld leihst.',
      readingMinutes: 8,
      sections: [
        {
          heading: 'Die Grundbegriffe',
          points: [
            'Nennwert: der Betrag, der am Ende zurückgezahlt wird.',
            'Kupon: der feste Zinssatz auf den Nennwert.',
            'Laufzeit und Fälligkeitstermin.',
            'Emittent: wer das Geld leiht und zurückzahlen muss.',
          ],
        },
        {
          heading: 'Gläubiger gegen Eigentümer',
          points: [
            'Als Gläubiger hast du Anspruch auf Zins und Rückzahlung, kein Stimmrecht.',
            'Du profitierst nicht vom Erfolg des Unternehmens über den Kupon hinaus.',
            'In der Insolvenz stehen Gläubiger vor Aktionären – aber nicht an erster Stelle.',
            'Warum „sicherer als Aktien“ nur die halbe Wahrheit ist.',
          ],
        },
        {
          heading: 'Das entscheidende Risiko',
          points: [
            'Emittentenrisiko: Zahlt der Schuldner nicht, ist das Geld weg.',
            'Keine Einlagensicherung – Schuldverschreibungen sind keine Bankeinlagen.',
            'Höherer Kupon bedeutet fast immer höheres Risiko, nicht ein besseres Angebot.',
            'Warnhinweis zu Zertifikaten von Banken: rechtlich ebenfalls Schuldverschreibungen.',
          ],
        },
      ],
    },
    fortgeschritten: {
      metaTitle: 'Anleihen fortgeschritten: Kurs, Duration und Bonität',
      metaDescription:
        'Warum Kurs und Rendite gegenläufig laufen, wie Duration die Zinsempfindlichkeit misst und was Ratings über Ausfallwahrscheinlichkeiten sagen.',
      title: 'Kursmechanik, Duration und Bonität',
      lead: 'Warum Anleihekurse fallen, wenn die Zinsen steigen – und wie stark.',
      readingMinutes: 11,
      sections: [
        {
          heading: 'Kurs und Rendite',
          points: [
            'Der Kupon ist fest, also passt sich der Kurs an das Marktzinsniveau an.',
            'Rendite bis Fälligkeit gegen laufende Verzinsung.',
            'Kurs über und unter 100 Prozent und was das bedeutet.',
            'Stückzinsen beim Kauf zwischen zwei Zinsterminen.',
          ],
        },
        {
          heading: 'Duration und Zinsänderungsrisiko',
          points: [
            'Duration als Maß der Zinsempfindlichkeit in Jahren.',
            'Näherung: Kursänderung entspricht minus Duration mal Zinsänderung.',
            'Konvexität: warum die Näherung bei großen Sprüngen ungenau wird.',
            'Einzelanleihe bis Fälligkeit gegen Anleihefonds ohne Endtermin.',
          ],
        },
        {
          heading: 'Bonität einschätzen',
          points: [
            'Ratingskalen von Investment Grade bis High Yield.',
            'Credit Spread als Marktpreis des Ausfallrisikos.',
            'Grenzen von Ratings: verzögerte Anpassung, Interessenkonflikte.',
            'Streuung über viele Emittenten statt Vertrauen auf ein Rating.',
          ],
        },
      ],
    },
    profi: {
      metaTitle: 'Anleihen für Profis: Rang, Klauseln, Bewertung',
      metaDescription:
        'Nachrang und Bail-in, Kündigungsrechte und Covenants, strukturierte Zertifikate sowie Bewertung über Barwert und Break-even-Analysen.',
      title: 'Schuldverschreibungen auf Profi-Niveau',
      lead: 'Rangfolge, Vertragsklauseln, strukturierte Produkte und die Bewertung über Zahlungsströme.',
      readingMinutes: 14,
      sections: [
        {
          heading: 'Rangfolge und Bail-in',
          points: [
            'Besicherte, unbesicherte, nachrangige und hybride Papiere.',
            'Bankenabwicklung: Haftungskaskade und Bail-in-fähige Verbindlichkeiten.',
            'CoCo-Bonds: Umwandlung oder Abschreibung bei Kapitalunterdeckung.',
            'Praxisbeispiele, in denen Nachranggläubiger vollständig ausfielen.',
          ],
        },
        {
          heading: 'Vertragsklauseln lesen',
          points: [
            'Kündigungsrechte des Emittenten (Call) und ihr Effekt auf die Rendite.',
            'Covenants: Schutzklauseln und ihre praktische Durchsetzbarkeit.',
            'Step-up-Kupons, Floater und inflationsindexierte Varianten.',
            'Prospekt und Basisinformationsblatt: wo die relevanten Angaben stehen.',
          ],
        },
        {
          heading: 'Bewertung und strukturierte Produkte',
          points: [
            'Barwertberechnung aller Zahlungsströme mit passender Zinsstrukturkurve.',
            'Break-even: Welcher Spread deckt welche Ausfallwahrscheinlichkeit?',
            'Zertifikate zerlegen: Anleihe plus Option, inklusive verdeckter Kosten.',
            'Steuerliche Behandlung von Kursgewinnen, Stückzinsen und Verlusten – keine Steuerberatung.',
          ],
        },
      ],
    },
  },
})

export const staatsanleihe = outlineTopic({
  slug: 'staatsanleihe',
  title: 'Staatsanleihe',
  headline: 'Staatsanleihen: wie Staaten sich Geld leihen',
  metaTitle: 'Staatsanleihen erklärt: Renditen, Risiken, Rolle',
  metaDescription:
    'Wie Staatsanleihen funktionieren, warum Renditen zwischen Ländern auseinanderlaufen und welche Rolle sie in einem Portfolio wirklich spielen.',
  lead: 'Staatsanleihen gelten als Maßstab für den risikofreien Zins – ganz risikofrei sind sie trotzdem nicht.',
  overview: [
    'Ein Staat, der mehr ausgibt als er einnimmt, leiht sich Geld über Anleihen. Deren Rendite ist der Referenzpunkt, an dem sich fast alle anderen Zinsen orientieren.',
    'Weil Staaten Steuern erheben und – in eigener Währung – notfalls Geld schöpfen können, gilt ihr Ausfallrisiko als niedrig. Historische Zahlungsausfälle zeigen, dass es nicht null ist.',
    'Die Stufen führen von Grundfunktion und Emissionsverfahren über Zinsstrukturkurve und Spreads bis zu Schuldentragfähigkeit, Restrukturierungen und der Rolle der Notenbanken.',
  ],
  keywords: ['Staatsanleihe', 'Bund', 'Rendite', 'Zinsstrukturkurve', 'Spread'],
  related: ['schuldverschreibung', 'fonds', 'wie-funktioniert-der-markt'],
  levels: {
    beginner: {
      metaTitle: 'Staatsanleihe einfach erklärt – Grundlagen',
      metaDescription:
        'Warum Staaten Anleihen ausgeben, wie Bundesanleihen funktionieren, was die Rendite aussagt und weshalb sie als sicherer Zinsmaßstab gilt.',
      title: 'Staatsanleihen einfach erklärt',
      lead: 'Wie Staaten sich finanzieren und was das mit deinem Sparzins zu tun hat.',
      readingMinutes: 7,
      sections: [
        {
          heading: 'Warum Staaten Anleihen ausgeben',
          points: [
            'Haushaltsdefizit: Ausgaben über den Steuereinnahmen.',
            'Anleihe als Alternative zu Steuererhöhung oder Ausgabenkürzung.',
            'Wer die Papiere kauft: Banken, Versicherungen, Fonds, Notenbanken, Privatanleger.',
            'Begriffe in Deutschland: Bundesanleihe, Bobl, Schatz und ihre Laufzeiten.',
          ],
        },
        {
          heading: 'Der risikofreie Zins als Maßstab',
          points: [
            'Warum die Rendite sicherer Staatsanleihen als Referenz dient.',
            'Alle anderen Zinsen enthalten einen Aufschlag darauf.',
            'Wirkung auf Kredite, Sparzinsen und Aktienbewertungen.',
            'Warum „risikofrei“ eine Vereinfachung ist.',
          ],
        },
        {
          heading: 'Was schiefgehen kann',
          points: [
            'Kursverluste bei steigenden Zinsen – auch bei bester Bonität.',
            'Inflation: nominale Rückzahlung, gesunkene Kaufkraft.',
            'Zahlungsausfall: historisch selten, aber nicht ausgeschlossen.',
            'Fremdwährungsanleihen: zusätzliches Wechselkursrisiko.',
          ],
        },
      ],
    },
    fortgeschritten: {
      metaTitle: 'Staatsanleihen: Zinsstruktur, Spreads, Auktionen',
      metaDescription:
        'Zinsstrukturkurve und ihre Aussagekraft, Renditeunterschiede zwischen Ländern, Emissionsverfahren und die Rolle von Anleihen im Portfolio.',
      title: 'Zinsstruktur, Spreads und Emission',
      lead: 'Was die Zinskurve verrät, warum Länderrenditen auseinanderlaufen und wie Anleihen emittiert werden.',
      readingMinutes: 11,
      sections: [
        {
          heading: 'Die Zinsstrukturkurve',
          points: [
            'Normale, flache und inverse Kurve und ihre üblichen Deutungen.',
            'Warum eine inverse Kurve als Rezessionssignal gilt – und ihre Trefferquote.',
            'Erwartungs-, Liquiditätsprämien- und Marktsegmentierungstheorie.',
            'Reale gegen nominale Kurve und die daraus abgeleitete Inflationserwartung.',
          ],
        },
        {
          heading: 'Spreads zwischen Ländern',
          points: [
            'Renditeabstand zu deutschen Bundesanleihen als Risikomaß in der Eurozone.',
            'Was den Spread treibt: Bonität, Liquidität, politische Unsicherheit.',
            'Gemeinsame Währung ohne gemeinsame Fiskalpolitik: die strukturelle Spannung.',
            'Bezug zur Übersichtsseite Staatsverschuldung.',
          ],
        },
        {
          heading: 'Emission und Portfoliorolle',
          points: [
            'Auktionsverfahren, Primär- und Sekundärmarkt.',
            'Direktkauf gegen Anleihefonds und ETFs.',
            'Laufzeitleiter zur Steuerung des Zinsänderungsrisikos.',
            'Warum Anleihen 2022 nicht als Puffer funktionierten.',
          ],
        },
      ],
    },
    profi: {
      metaTitle: 'Staatsanleihen für Profis: Tragfähigkeit und Ausfall',
      metaDescription:
        'Schuldentragfähigkeit und Zins-Wachstums-Differenz, Umschuldungen und Umschuldungsklauseln, Notenbankkäufe sowie Repo-Markt und Sicherheitenfunktion.',
      title: 'Staatsanleihen auf Profi-Niveau',
      lead: 'Tragfähigkeitsanalyse, Umschuldungsmechanik und die Rolle von Notenbanken und Repo-Märkten.',
      readingMinutes: 14,
      sections: [
        {
          heading: 'Schuldentragfähigkeit',
          points: [
            'Zins-Wachstums-Differenz: der entscheidende Term der Schuldendynamik.',
            'Primärsaldo, Schuldenquote und Rollover-Bedarf.',
            'Durchschnittliche Restlaufzeit als Puffer gegen Zinsanstiege.',
            'Eigene Währung gegen Fremdwährungsschulden: der fundamentale Unterschied.',
          ],
        },
        {
          heading: 'Ausfall und Restrukturierung',
          points: [
            'Ablauf einer Umschuldung: Haircut, Laufzeitverlängerung, Kuponsenkung.',
            'Collective Action Clauses und Holdout-Gläubiger.',
            'Historische Fälle und die tatsächlichen Rückflussquoten.',
            'CDS als Preisindikator und die Grenzen ihrer Aussagekraft.',
          ],
        },
        {
          heading: 'Notenbanken und Marktinfrastruktur',
          points: [
            'Anleihekaufprogramme: Wirkung auf Renditen und Marktliquidität.',
            'Bilanzabbau und die Frage, wer als Käufer nachfolgt.',
            'Repo-Markt: Staatsanleihen als Sicherheit im Finanzsystem.',
            'Sonderfall inflationsindexierter Anleihen und die Breakeven-Inflationsrate.',
          ],
        },
      ],
    },
  },
})

export const derivat = outlineTopic({
  slug: 'derivat',
  title: 'Derivat',
  headline: 'Derivate: Verträge, deren Wert von etwas anderem abhängt',
  metaTitle: 'Derivate erklärt: Arten, Hebel und Risiken',
  metaDescription:
    'Was Derivate sind, wie Futures, Optionen und Swaps funktionieren, wie der Hebel entsteht und warum Absicherung und Spekulation dieselben Werkzeuge nutzen.',
  lead: 'Ein Derivat hat keinen eigenen Wert – er wird von einem Basiswert abgeleitet. Genau daraus entsteht Hebel.',
  overview: [
    'Derivate sind Verträge über künftige Zahlungen, deren Höhe von der Entwicklung eines Basiswerts abhängt: einer Aktie, einem Index, einem Zins, einem Rohstoff oder einem Wechselkurs.',
    'Dasselbe Instrument kann Risiko abbauen oder aufbauen. Ein Landwirt, der seine Ernte per Future zu einem festen Preis verkauft, sichert ab. Wer denselben Future ohne Ernte kauft, spekuliert.',
    'Die Stufen führen von der Grundidee über Futures, Optionen und Swaps bis zu Bewertungslogik, Margin-Mechanik und den Risiken gehebelter Retail-Produkte.',
  ],
  keywords: ['Derivat', 'Future', 'Option', 'Hebel', 'Absicherung'],
  related: ['option', 'schuldverschreibung', 'wie-funktioniert-der-markt'],
  symbols: ['eur-jpy'],
  levels: {
    beginner: {
      metaTitle: 'Derivate einfach erklärt – Grundlagen und Hebel',
      metaDescription:
        'Was ein Derivat ist, wie Absicherung und Spekulation zusammenhängen, wie ein Hebel entsteht und warum Verluste das eingesetzte Geld übersteigen können.',
      title: 'Derivate einfach erklärt',
      lead: 'Warum es Verträge auf Kurse gibt und was der Hebel praktisch bedeutet.',
      readingMinutes: 8,
      sections: [
        {
          heading: 'Die Grundidee',
          points: [
            'Basiswert und abgeleiteter Vertrag: das Prinzip in einem Satz.',
            'Absicherung: den künftigen Preis heute festschreiben.',
            'Spekulation: auf eine Kursrichtung setzen, ohne den Basiswert zu besitzen.',
            'Ursprung im Warenhandel – warum Derivate keine Erfindung der Finanzindustrie sind.',
          ],
        },
        {
          heading: 'Wie der Hebel entsteht',
          points: [
            'Ein Bruchteil des Kapitals steuert eine große Position.',
            'Rechenbeispiel: 5 Prozent Kursbewegung, 50 Prozent Positionsveränderung.',
            'Der Hebel wirkt in beide Richtungen, symmetrisch.',
            'Warum kleine Bewegungen große Verluste auslösen können.',
          ],
        },
        {
          heading: 'Was Einsteiger wissen sollten',
          points: [
            'Verluste können das eingesetzte Kapital übersteigen – je nach Produkt.',
            'Zeitwertverlust: manche Derivate verlieren auch bei unverändertem Kurs.',
            'Ohne konkretes Absicherungsbedürfnis gibt es meist keinen Grund für den Einsatz.',
            'Klarer Hinweis: kein Einstiegsinstrument für den Vermögensaufbau.',
          ],
        },
      ],
    },
    fortgeschritten: {
      metaTitle: 'Derivate fortgeschritten: Futures, Swaps, Margin',
      metaDescription:
        'Wie Futures und Forwards funktionieren, was Margin und Nachschusspflicht bedeuten, wie Swaps eingesetzt werden und wie Absicherungsquoten berechnet werden.',
      title: 'Futures, Swaps und Margin',
      lead: 'Die wichtigsten Derivatearten, ihre Abwicklung und die Mechanik von Sicherheitsleistungen.',
      readingMinutes: 12,
      sections: [
        {
          heading: 'Futures und Forwards',
          points: [
            'Standardisierter Future an der Börse gegen individuellen Forward.',
            'Kontraktgröße, Liefertermin, Barausgleich gegen physische Lieferung.',
            'Rollen von Positionen: Contango und Backwardation.',
            'Warum Rohstoff-Indexprodukte oft hinter dem Spotpreis zurückbleiben.',
          ],
        },
        {
          heading: 'Margin und Clearing',
          points: [
            'Initial Margin und Variation Margin: täglicher Ausgleich.',
            'Margin Call und Zwangsliquidation.',
            'Clearingstelle als zentraler Kontrahent und was sie absichert.',
            'Rechenbeispiel: wie schnell eine gehebelte Position aufgelöst wird.',
          ],
        },
        {
          heading: 'Swaps und Absicherung',
          points: [
            'Zinsswap: variable gegen feste Zahlung.',
            'Währungsswap und Total Return Swap – letzterer in synthetischen ETFs.',
            'Hedge Ratio: wie viele Kontrakte eine Position absichern.',
            'Basisrisiko: wenn Absicherung und Position nicht exakt zusammenpassen.',
          ],
        },
      ],
    },
    profi: {
      metaTitle: 'Derivate für Profis: Bewertung, Griechen, Retail-Risiken',
      metaDescription:
        'Bewertung über Arbitragefreiheit, Sensitivitäten und implizite Volatilität, Kostenstruktur von Hebelprodukten sowie Kontrahenten- und Modellrisiken.',
      title: 'Derivate auf Profi-Niveau',
      lead: 'Bewertungslogik, Sensitivitäten und die tatsächlichen Kosten gehebelter Retail-Produkte.',
      readingMinutes: 15,
      sections: [
        {
          heading: 'Bewertung',
          points: [
            'Arbitragefreiheit und Replikationsportfolio als Bewertungsgrundlage.',
            'Cost-of-Carry-Modell für Futures-Preise.',
            'Implizite gegen historische Volatilität.',
            'Modellrisiko: wo Annahmen brechen (Sprünge, Liquiditätslücken).',
          ],
        },
        {
          heading: 'Retail-Hebelprodukte',
          points: [
            'Knock-out-Zertifikate, Faktorzertifikate und CFDs im Vergleich.',
            'Pfadabhängigkeit: warum tägliche Hebel über Zeit nicht dem Hebel entsprechen.',
            'Finanzierungskosten, Spread und Anpassungsklauseln des Emittenten.',
            'Emittentenrisiko: Zertifikate sind rechtlich Schuldverschreibungen.',
          ],
        },
        {
          heading: 'Risiko und Regulierung',
          points: [
            'Kontrahentenrisiko bei außerbörslichen Geschäften.',
            'Verlustbegrenzung bei CFDs für Privatanleger in der EU.',
            'Steuerliche Behandlung von Termingeschäften und Verlustverrechnungsgrenzen.',
            'Warum die Verlustverrechnungsbeschränkung Absicherungsstrategien verteuert – keine Steuerberatung.',
          ],
        },
      ],
    },
  },
})

export const option = outlineTopic({
  slug: 'option',
  title: 'Option',
  headline: 'Optionen: das Recht, aber nicht die Pflicht',
  metaTitle: 'Optionen erklärt: Call, Put, Prämie und Risiko',
  metaDescription:
    'Wie Calls und Puts funktionieren, woraus sich die Prämie zusammensetzt, was Käufer und Verkäufer riskieren und welche Strategien wofür gedacht sind.',
  lead: 'Eine Option gibt dir ein Recht. Wer sie verkauft, übernimmt dagegen eine Pflicht – und ein völlig anderes Risikoprofil.',
  overview: [
    'Eine Option verbrieft das Recht, einen Basiswert zu einem festgelegten Preis zu kaufen (Call) oder zu verkaufen (Put). Ausüben muss man nicht.',
    'Für dieses Recht zahlt der Käufer eine Prämie. Sein Verlust ist auf diese Prämie begrenzt. Der Verkäufer erhält die Prämie und übernimmt dafür eine Verpflichtung mit teils unbegrenztem Risiko.',
    'Die Stufen führen von Grundbegriffen über Prämienzusammensetzung und Standardstrategien bis zu Sensitivitäten, Volatilitätshandel und Ausübungsrisiken.',
  ],
  keywords: ['Option', 'Call', 'Put', 'Optionsprämie', 'Volatilität'],
  related: ['derivat', 'aktie', 'wie-funktioniert-der-markt'],
  levels: {
    beginner: {
      metaTitle: 'Optionen einfach erklärt – Call und Put verstehen',
      metaDescription:
        'Was Call und Put bedeuten, wie Basispreis und Laufzeit wirken, woraus die Prämie besteht und warum Verkäufer ein anderes Risiko tragen als Käufer.',
      title: 'Optionen einfach erklärt',
      lead: 'Call, Put, Basispreis und Prämie – die Grundbegriffe an einem konkreten Beispiel.',
      readingMinutes: 8,
      sections: [
        {
          heading: 'Call und Put',
          points: [
            'Call: das Recht zu kaufen. Put: das Recht zu verkaufen.',
            'Basispreis (Strike) und Verfallstag.',
            'Ein durchgerechnetes Beispiel für beide Varianten.',
            'Amerikanische gegen europäische Ausübung.',
          ],
        },
        {
          heading: 'Die Prämie',
          points: [
            'Innerer Wert: der sofort realisierbare Teil.',
            'Zeitwert: der Preis für die verbleibende Chance.',
            'Zeitwertverlust bis zum Verfall – beschleunigt am Ende.',
            'Warum eine Option auch bei unverändertem Kurs an Wert verliert.',
          ],
        },
        {
          heading: 'Käufer und Verkäufer',
          points: [
            'Käufer: Verlust auf die Prämie begrenzt, Chance theoretisch groß.',
            'Verkäufer: Ertrag auf die Prämie begrenzt, Risiko sehr groß.',
            'Der ungedeckte Verkauf eines Calls ist für Privatanleger ungeeignet.',
            'Warum die meisten gekauften Optionen wertlos verfallen.',
          ],
        },
      ],
    },
    fortgeschritten: {
      metaTitle: 'Optionen fortgeschritten: Strategien und Bepreisung',
      metaDescription:
        'Covered Call und Cash Secured Put, Spreads zur Risikobegrenzung, Einflussfaktoren auf die Prämie und die Rolle der impliziten Volatilität.',
      title: 'Strategien und Preisbildung',
      lead: 'Welche Standardstrategien es gibt, wofür sie gedacht sind und was die Prämie treibt.',
      readingMinutes: 12,
      sections: [
        {
          heading: 'Was die Prämie bestimmt',
          points: [
            'Kurs des Basiswerts, Basispreis, Restlaufzeit.',
            'Implizite Volatilität als wichtigster Preistreiber.',
            'Zinsniveau und erwartete Dividenden.',
            'Warum eine Option nach einer Gewinnwarnung teuer ist.',
          ],
        },
        {
          heading: 'Strategien mit Bestand',
          points: [
            'Covered Call: Prämie gegen Verzicht auf Kurschancen.',
            'Cash Secured Put: Kaufbereitschaft gegen Prämie.',
            'Protective Put als Versicherung und ihre laufenden Kosten.',
            'Wann diese Strategien wirtschaftlich sinnvoll sind – und wann nicht.',
          ],
        },
        {
          heading: 'Spreads',
          points: [
            'Vertical Spread: Risiko und Chance begrenzt.',
            'Kalender-Spread und Straddle im Überblick.',
            'Break-even-Berechnung und Gewinn-Verlust-Diagramme lesen.',
            'Transaktionskosten: warum viele Spreads für Kleinbeträge unrentabel sind.',
          ],
        },
      ],
    },
    profi: {
      metaTitle: 'Optionen für Profis: Griechen und Volatilitätshandel',
      metaDescription:
        'Delta, Gamma, Theta und Vega im Zusammenspiel, Volatilitätsflächen und Skew, Ausübungs- und Zuteilungsrisiken sowie Besteuerung von Termingeschäften.',
      title: 'Optionen auf Profi-Niveau',
      lead: 'Sensitivitäten, Volatilitätsstruktur, Ausübungsrisiken und steuerliche Besonderheiten.',
      readingMinutes: 15,
      sections: [
        {
          heading: 'Die Sensitivitäten',
          points: [
            'Delta und Gamma: Richtung und Beschleunigung.',
            'Theta: Zeitwertverfall als täglicher Ertrag oder Aufwand.',
            'Vega: Empfindlichkeit gegenüber der impliziten Volatilität.',
            'Delta-Hedging in der Praxis und seine Kosten.',
          ],
        },
        {
          heading: 'Volatilität als Handelsobjekt',
          points: [
            'Volatilitätsfläche: Skew und Term Structure.',
            'Volatilitätsrisikoprämie: warum Verkäufer im Schnitt verdienen.',
            'Tail-Risiko von Short-Volatility-Strategien.',
            'Historische Beispiele für Verluste in Volatilitätsspitzen.',
          ],
        },
        {
          heading: 'Abwicklung und Steuern',
          points: [
            'Vorzeitige Ausübung, Zuteilung und Pin-Risiko am Verfallstag.',
            'Kapitalmaßnahmen des Basiswerts und Kontraktanpassungen.',
            'Margin-Anforderungen bei kombinierten Positionen.',
            'Termingeschäfte in der deutschen Besteuerung und die Verlustverrechnung – keine Steuerberatung.',
          ],
        },
      ],
    },
  },
})

export const bitcoinKrypto = outlineTopic({
  slug: 'bitcoin-krypto',
  title: 'Bitcoin & Krypto',
  headline: 'Bitcoin und Kryptowährungen: Technik, Markt, Risiko',
  metaTitle: 'Bitcoin und Kryptowährungen verständlich erklärt',
  metaDescription:
    'Wie Bitcoin technisch funktioniert, woher der Preis kommt, welche Risiken Verwahrung und Regulierung bergen und wie Kryptogewinne besteuert werden.',
  lead: 'Bitcoin ist ein Zahlungssystem ohne zentrale Instanz. Ob es eine Geldanlage ist, ist eine völlig andere Frage.',
  overview: [
    'Bitcoin löst ein technisches Problem: Werte digital übertragen, ohne dass eine zentrale Stelle die Buchführung übernimmt. Dafür sorgen ein verteiltes Register und ein Konsensverfahren.',
    'Wirtschaftlich unterscheidet sich Bitcoin fundamental von Aktien oder Anleihen: Es gibt keine Gewinne, keine Zinsen und keine Zahlungsströme. Der Preis entsteht ausschließlich aus Angebot und Nachfrage.',
    'Die Stufen behandeln Funktionsweise und Verwahrung, dann Marktstruktur, Produktvarianten und Regulierung, schließlich Sicherheitsmodell, Bewertungsansätze und Besteuerung.',
  ],
  keywords: ['Bitcoin', 'Kryptowährung', 'Wallet', 'Volatilität', 'Krypto Steuern'],
  related: ['blockchain', 'derivat', 'worauf-achten-einsteiger'],
  levels: {
    beginner: {
      metaTitle: 'Bitcoin einfach erklärt – Grundlagen für Einsteiger',
      metaDescription:
        'Was Bitcoin ist, wie Transaktionen ohne Bank funktionieren, was ein Wallet und ein privater Schlüssel sind und welche Risiken am Anfang zählen.',
      title: 'Bitcoin einfach erklärt',
      lead: 'Was Bitcoin technisch leistet, wie du es verwahrst und woher der Preis kommt.',
      readingMinutes: 8,
      sections: [
        {
          heading: 'Was Bitcoin ist',
          points: [
            'Ein verteiltes Kassenbuch statt einer zentralen Bank.',
            'Transaktionen werden in Blöcken zusammengefasst und verkettet.',
            'Begrenzte Gesamtmenge und das Halving-Schema.',
            'Kein Unternehmen, kein Gewinn, keine Dividende dahinter.',
          ],
        },
        {
          heading: 'Verwahrung',
          points: [
            'Privater Schlüssel: wer ihn hat, verfügt über die Coins.',
            'Wallet-Arten: Software, Hardware, Börsenkonto.',
            '„Not your keys, not your coins“ – was der Satz praktisch bedeutet.',
            'Verlorener Schlüssel bedeutet endgültigen Verlust, ohne Wiederherstellung.',
          ],
        },
        {
          heading: 'Preis und Risiko',
          points: [
            'Der Preis entsteht rein aus Angebot und Nachfrage.',
            'Historische Rückgänge von über 70 Prozent und ihre Dauer.',
            'Keine Einlagensicherung, kein Anlegerschutz wie bei Wertpapieren.',
            'Nur Beträge einsetzen, deren Totalverlust die Finanzplanung nicht berührt.',
          ],
        },
      ],
    },
    fortgeschritten: {
      metaTitle: 'Krypto fortgeschritten: Markt, Produkte, Regulierung',
      metaDescription:
        'Marktstruktur und Liquidität, Unterschiede zwischen Direktkauf, ETP und Zertifikat, Stablecoins und der Regulierungsrahmen in der EU.',
      title: 'Marktstruktur, Produkte und Regulierung',
      lead: 'Wie der Kryptomarkt funktioniert, welche Produktwege es gibt und was reguliert ist.',
      readingMinutes: 11,
      sections: [
        {
          heading: 'Marktstruktur',
          points: [
            'Handelsplätze, Liquidität und Preisunterschiede zwischen Börsen.',
            'Bitcoin gegen Altcoins: Konzentration der Marktkapitalisierung.',
            'Stablecoins: Deckungsversprechen und Prüfbarkeit der Reserven.',
            'Marktmanipulation und dünne Orderbücher bei kleinen Coins.',
          ],
        },
        {
          heading: 'Zugangswege im Vergleich',
          points: [
            'Direktkauf mit eigener Verwahrung: maximale Kontrolle, maximale Eigenverantwortung.',
            'ETP und Zertifikate: einfacher Zugang, dafür Emittentenrisiko.',
            'Warum es in Europa kaum echte Krypto-ETFs gibt.',
            'Kostenvergleich: Spread, Verwahrgebühr, Produktkosten.',
          ],
        },
        {
          heading: 'Regulierung',
          points: [
            'Der EU-Rahmen für Kryptowerte im Überblick.',
            'Anforderungen an Verwahrer und Handelsplattformen.',
            'Was Regulierung schützt und was sie ausdrücklich nicht schützt.',
            'Insolvenzen von Handelsplattformen und die Lage der Kunden.',
          ],
        },
      ],
    },
    profi: {
      metaTitle: 'Krypto für Profis: Sicherheit, Bewertung, Steuern',
      metaDescription:
        'Konsensmechanismen und Angriffsszenarien, Bewertungsansätze ohne Zahlungsströme, Portfolioeffekte sowie Haltefrist und Besteuerung in Deutschland.',
      title: 'Kryptowährungen auf Profi-Niveau',
      lead: 'Sicherheitsmodell, Bewertungsversuche, Portfoliowirkung und die deutsche Besteuerung.',
      readingMinutes: 14,
      sections: [
        {
          heading: 'Sicherheitsmodell',
          points: [
            'Proof of Work gegen Proof of Stake: Anreize und Angriffskosten.',
            '51-Prozent-Angriff, Reorganisationen und Finalität.',
            'Mining-Konzentration und geografische Abhängigkeiten.',
            'Skalierungsschichten und ihre Vertrauensannahmen.',
          ],
        },
        {
          heading: 'Bewertung ohne Zahlungsströme',
          points: [
            'Warum Discounted-Cashflow-Verfahren nicht anwendbar sind.',
            'Ansätze über Netzwerkgröße, Kosten der Erzeugung und Knappheit – und ihre Schwächen.',
            'Korrelation mit Aktienmärkten in Stressphasen.',
            'Beitrag zum Portfolio: Rendite gegen zusätzliche Schwankung.',
          ],
        },
        {
          heading: 'Steuern und Verwahrung im Detail',
          points: [
            'Haltefrist bei direkt gehaltenen Kryptowerten und die Folgen für Verkäufe.',
            'Staking, Lending und Airdrops: unterschiedliche steuerliche Einordnung.',
            'Wertpapiere auf Kryptowerte folgen anderen Regeln als Direktbestände.',
            'Dokumentationspflichten und Nachweisprobleme – ausdrücklich keine Steuerberatung.',
          ],
        },
      ],
    },
  },
})

export const wieFunktioniertDerMarkt = outlineTopic({
  slug: 'wie-funktioniert-der-markt',
  title: 'Wie der Markt funktioniert',
  headline: 'Kursbildung: wie aus Angebot und Nachfrage ein Preis wird',
  metaTitle: 'Wie funktioniert der Markt? Kursbildung erklärt',
  metaDescription:
    'Wie ein Orderbuch einen Kurs erzeugt, welche Rolle Market Maker und Liquidität spielen und was Informationseffizienz für Anlageentscheidungen bedeutet.',
  lead: 'Ein Kurs ist keine Eigenschaft eines Wertpapiers, sondern der Preis, zu dem sich zuletzt Käufer und Verkäufer einig wurden.',
  overview: [
    'Kurse entstehen im Orderbuch: Kauf- und Verkaufsaufträge treffen aufeinander, und wo sie sich überschneiden, kommt ein Geschäft zustande. Der letzte Abschluss ist der Kurs.',
    'Daraus folgt eine wichtige Einsicht: Der Kurs spiegelt die Erwartungen der Marktteilnehmer, nicht die Vergangenheit eines Unternehmens. Neue Informationen wirken sofort.',
    'Die Stufen führen von Angebot und Nachfrage über Orderbuchmechanik und Liquidität bis zu Markteffizienz, Preisbildung im elektronischen Handel und der Rolle von Derivaten.',
  ],
  keywords: ['Kursbildung', 'Orderbuch', 'Liquidität', 'Markteffizienz', 'Spread'],
  related: ['boerse', 'aktie', 'wann-kaufen-verkaufen'],
  symbols: ['eur-usd', 'dax'],
  levels: {
    beginner: {
      metaTitle: 'Kursbildung einfach erklärt – Angebot und Nachfrage',
      metaDescription:
        'Wie ein Kurs entsteht, was Geld- und Briefkurs bedeuten, warum Kurse ständig schwanken und was eine Nachricht mit dem Preis macht.',
      title: 'Wie ein Kurs entsteht',
      lead: 'Angebot, Nachfrage und der Moment, in dem ein Geschäft zustande kommt.',
      readingMinutes: 7,
      sections: [
        {
          heading: 'Angebot und Nachfrage',
          points: [
            'Jeder Kurs braucht zwei Seiten: einen Käufer und einen Verkäufer.',
            'Geldkurs und Briefkurs, dazwischen der Spread.',
            'Der Kurs ist der letzte Abschluss, nicht der aktuelle Wert.',
            'Warum es keinen „richtigen“ Preis gibt.',
          ],
        },
        {
          heading: 'Warum Kurse schwanken',
          points: [
            'Neue Informationen verändern Erwartungen.',
            'Erwartungen, nicht Fakten, treiben den Preis.',
            'Warum ein guter Quartalsbericht den Kurs fallen lassen kann.',
            'Unterschied zwischen Nachricht und Überraschung.',
          ],
        },
        {
          heading: 'Was das für dich bedeutet',
          points: [
            'Wer kauft, glaubt an Aufwärtspotenzial – der Verkäufer sieht es anders.',
            'Öffentlich bekannte Informationen stecken meist schon im Kurs.',
            'Kurzfristige Bewegungen sind für Privatanleger praktisch nicht nutzbar.',
            'Konsequenz: langer Anlagehorizont statt Prognosen.',
          ],
        },
      ],
    },
    fortgeschritten: {
      metaTitle: 'Marktmechanik: Orderbuch, Liquidität, Market Maker',
      metaDescription:
        'Wie ein Orderbuch aufgebaut ist, wie Auktionen und fortlaufender Handel funktionieren und welche Rolle Market Maker und Liquidität spielen.',
      title: 'Orderbuch, Liquidität und Marktteilnehmer',
      lead: 'Wie der Handel technisch abläuft und wer im Markt welche Rolle spielt.',
      readingMinutes: 10,
      sections: [
        {
          heading: 'Das Orderbuch',
          points: [
            'Limit- und Marktaufträge im Orderbuch und ihre Priorität.',
            'Preis-Zeit-Priorität bei der Ausführung.',
            'Markttiefe: warum große Orders den Preis bewegen.',
            'Eröffnungs- und Schlussauktion gegen fortlaufenden Handel.',
          ],
        },
        {
          heading: 'Liquidität',
          points: [
            'Woran man Liquidität erkennt: Spread, Volumen, Markttiefe.',
            'Slippage: Differenz zwischen erwartetem und erzieltem Preis.',
            'Tageszeitliche Muster und die Überlappung von Handelszeiten.',
            'Warum Liquidität in Stressphasen verschwindet.',
          ],
        },
        {
          heading: 'Wer handelt',
          points: [
            'Market Maker: Stellen von Kursen gegen Spread-Ertrag.',
            'Institutionelle Anleger, Indexfonds und ihr mechanischer Handel.',
            'Algorithmischer und Hochfrequenzhandel: Wirkung auf Spreads.',
            'Bezahlte Orderweiterleitung und die Frage der Ausführungsqualität.',
          ],
        },
      ],
    },
    profi: {
      metaTitle: 'Markteffizienz für Profis: Anomalien und Mikrostruktur',
      metaDescription:
        'Formen der Markteffizienz und ihre empirische Prüfung, dokumentierte Anomalien und ihre Robustheit sowie Mikrostruktur, Preisfindung und Derivateeinfluss.',
      title: 'Markteffizienz und Mikrostruktur',
      lead: 'Wie effizient Märkte tatsächlich sind, welche Anomalien überleben und wie Preise technisch gefunden werden.',
      readingMinutes: 14,
      sections: [
        {
          heading: 'Effizienz und ihre Grenzen',
          points: [
            'Schwache, halbstarke und starke Informationseffizienz.',
            'Das Effizienzparadox: Effizienz entsteht durch die Suche nach Ineffizienz.',
            'Grenzen der Arbitrage: Kosten, Kapitalbindung, Zeithorizont.',
            'Warum Effizienz nicht bedeutet, dass Preise immer richtig sind.',
          ],
        },
        {
          heading: 'Anomalien kritisch prüfen',
          points: [
            'Momentum, Value, Size und Low Volatility im Überblick.',
            'Data Mining und Publikationsverzerrung als Erklärungsalternative.',
            'Out-of-Sample-Tests und der Rückgang von Effekten nach Veröffentlichung.',
            'Umsetzungskosten: warum Papierrenditen selten erreichbar sind.',
          ],
        },
        {
          heading: 'Mikrostruktur und Preisfindung',
          points: [
            'Preisfindung an verschiedenen Handelsplätzen und die Konsolidierung.',
            'Dark Pools und außerbörslicher Handel.',
            'Adverse Selektion und ihre Wirkung auf Spreads.',
            'Rückwirkung von Derivaten und Indexprodukten auf den Kassamarkt.',
          ],
        },
      ],
    },
  },
})

export const blockchain = outlineTopic({
  slug: 'blockchain',
  title: 'Blockchain',
  headline: 'Blockchain: ein Register, dem alle trauen können',
  metaTitle: 'Blockchain erklärt: Technik, Nutzen, Grenzen',
  metaDescription:
    'Wie eine Blockchain technisch funktioniert, welches Problem sie löst, wo sie echten Nutzen bringt und wo eine normale Datenbank besser wäre.',
  lead: 'Eine Blockchain ist eine Datenbank, die ohne zentrale Kontrollinstanz auskommt – dafür bezahlt sie mit Geschwindigkeit und Aufwand.',
  overview: [
    'Technisch ist eine Blockchain eine Kette von Datenblöcken, die durch kryptografische Prüfsummen miteinander verbunden sind. Wer einen alten Block ändert, macht alle folgenden ungültig.',
    'Der eigentliche Durchbruch ist nicht die Verkettung, sondern das Konsensverfahren: eine Regel, mit der sich viele unbekannte Teilnehmer auf einen gemeinsamen Zustand einigen.',
    'Die Stufen behandeln Aufbau und Grundbegriffe, dann Konsensverfahren, Smart Contracts und Skalierung, schließlich Sicherheitsgrenzen, Governance und realistische Anwendungsfelder.',
  ],
  keywords: ['Blockchain', 'Hash', 'Konsens', 'Smart Contract', 'Dezentralisierung'],
  related: ['bitcoin-krypto', 'wie-funktioniert-der-markt'],
  levels: {
    beginner: {
      metaTitle: 'Blockchain einfach erklärt – Aufbau und Zweck',
      metaDescription:
        'Was eine Blockchain ist, wie Blöcke durch Hashes verkettet werden, warum das Manipulation erschwert und welches Problem die Technik löst.',
      title: 'Blockchain einfach erklärt',
      lead: 'Wie die Kette aufgebaut ist und warum sie sich nachträglich kaum ändern lässt.',
      readingMinutes: 7,
      sections: [
        {
          heading: 'Der Aufbau',
          points: [
            'Blöcke enthalten Transaktionen und den Hash des Vorgängerblocks.',
            'Hash: eine Prüfsumme, die sich bei jeder Änderung komplett verändert.',
            'Warum eine Änderung im Nachhinein alle Folgeblöcke ungültig macht.',
            'Kopien des Registers liegen bei vielen Teilnehmern gleichzeitig.',
          ],
        },
        {
          heading: 'Welches Problem gelöst wird',
          points: [
            'Ohne zentrale Stelle klären, wer was besitzt.',
            'Double-Spending-Problem und seine Lösung durch Konsens.',
            'Vertrauen in Regeln statt Vertrauen in eine Institution.',
            'Warum das für Zahlungssysteme relevant ist.',
          ],
        },
        {
          heading: 'Was Blockchain nicht ist',
          points: [
            'Keine schnelle Datenbank – Konsens kostet Zeit.',
            'Keine Garantie für richtige Daten, nur für unveränderte Daten.',
            'Nicht automatisch anonym: Transaktionen sind meist öffentlich.',
            'Wann eine gewöhnliche Datenbank die bessere Wahl ist.',
          ],
        },
      ],
    },
    fortgeschritten: {
      metaTitle: 'Blockchain fortgeschritten: Konsens und Smart Contracts',
      metaDescription:
        'Proof of Work und Proof of Stake im Vergleich, Funktionsweise von Smart Contracts, Skalierungsansätze und der Unterschied zu privaten Ledgern.',
      title: 'Konsens, Smart Contracts und Skalierung',
      lead: 'Wie Einigkeit entsteht, was programmierbare Verträge leisten und wo die Kapazitätsgrenzen liegen.',
      readingMinutes: 11,
      sections: [
        {
          heading: 'Konsensverfahren',
          points: [
            'Proof of Work: Rechenaufwand als Kostenbremse gegen Angriffe.',
            'Proof of Stake: Kapitaleinsatz und Sanktionsmechanismen.',
            'Finalität: ab wann eine Transaktion als endgültig gilt.',
            'Forks: geplante Upgrades gegen dauerhafte Abspaltungen.',
          ],
        },
        {
          heading: 'Smart Contracts',
          points: [
            'Programmcode, der auf dem Register ausgeführt wird.',
            'Typische Anwendungen und ihre Voraussetzungen.',
            'Oracle-Problem: Daten von außen müssen jemandem vertraut werden.',
            'Unveränderlichkeit als Risiko: Fehler im Code lassen sich nicht patchen.',
          ],
        },
        {
          heading: 'Skalierung und Varianten',
          points: [
            'Blockgröße, Bestätigungszeit und der Zielkonflikt mit Dezentralisierung.',
            'Second-Layer-Lösungen und ihre zusätzlichen Vertrauensannahmen.',
            'Öffentliche gegen private und Konsortial-Blockchains.',
            'Frage, die jedes Projekt beantworten muss: Warum keine Datenbank?',
          ],
        },
      ],
    },
    profi: {
      metaTitle: 'Blockchain für Profis: Sicherheit und Governance',
      metaDescription:
        'Angriffsszenarien und Sicherheitsannahmen, MEV und Anreizprobleme, Governance-Konflikte sowie eine nüchterne Bewertung realer Anwendungsfälle.',
      title: 'Blockchain auf Profi-Niveau',
      lead: 'Sicherheitsannahmen, Anreizprobleme, Governance und eine ehrliche Nutzenbilanz.',
      readingMinutes: 13,
      sections: [
        {
          heading: 'Sicherheitsannahmen',
          points: [
            'Byzantinische Fehlertoleranz und die Grenzen der Annahmen.',
            'Angriffsszenarien: 51 Prozent, Eclipse, Long Range.',
            'Zentralisierungstendenzen bei Mining-Pools und Staking-Anbietern.',
            'Kryptografische Langzeitrisiken und Migrationspfade.',
          ],
        },
        {
          heading: 'Anreize und MEV',
          points: [
            'Wer entscheidet über die Reihenfolge von Transaktionen – und was das wert ist.',
            'MEV: Front-Running und Sandwich-Angriffe.',
            'Gebührenmärkte und ihr Verhalten bei Überlast.',
            'Ökonomische Sicherheit: Wann lohnt ein Angriff?',
          ],
        },
        {
          heading: 'Governance und Nutzenbilanz',
          points: [
            'Wer bestimmt Protokolländerungen und wie werden Konflikte gelöst.',
            'Rechtliche Fragen: Haftung, Datenschutz, Löschpflichten.',
            'Anwendungsfälle mit belegtem Nutzen gegen solche ohne.',
            'Prüfraster: Braucht der Fall wirklich Dezentralisierung?',
          ],
        },
      ],
    },
  },
})

export const costAverageSparplan = outlineTopic({
  slug: 'cost-average-sparplan',
  title: 'Cost-Average & Sparplan',
  headline: 'Cost-Average-Effekt und Sparplan: regelmäßig statt richtig',
  metaTitle: 'Cost-Average-Effekt und Sparplan richtig verstehen',
  metaDescription:
    'Wie der Durchschnittskosteneffekt rechnerisch funktioniert, warum eine Einmalanlage oft besser abschneidet und worin der echte Vorteil des Sparplans liegt.',
  lead: 'Der Sparplan macht dich nicht zum besseren Anleger, sondern zu einem, der dabeibleibt. Genau darin liegt sein Wert.',
  overview: [
    'Ein Sparplan investiert automatisch feste Beträge zu festen Terminen. Bei hohen Kursen kaufst du weniger Anteile, bei niedrigen mehr – der Durchschnittspreis deiner Anteile liegt unter dem Durchschnitt der Kurse.',
    'Dieser mathematische Effekt wird häufig überschätzt. Bei langfristig steigenden Märkten schneidet eine sofortige Einmalanlage im Durchschnitt besser ab, weil das Geld länger investiert ist.',
    'Die Stufen führen von der Grundmechanik über den korrekten Vergleich mit der Einmalanlage bis zu Dynamisierung, Rebalancing über Raten und der Entnahmephase.',
  ],
  keywords: ['Cost-Average-Effekt', 'Sparplan', 'Durchschnittskosten', 'Einmalanlage'],
  related: ['etf', 'zinseszins', 'wann-kaufen-verkaufen', 'fonds'],
  calculators: ['/rechner/zinsrechner'],
  levels: {
    beginner: {
      metaTitle: 'Cost-Average-Effekt einfach erklärt – mit Beispiel',
      metaDescription:
        'Wie der Durchschnittskosteneffekt entsteht, ein durchgerechnetes Beispiel, wie du einen Sparplan einrichtest und welcher Vorteil der wichtigste ist.',
      title: 'Sparplan und Cost-Average einfach erklärt',
      lead: 'Wie regelmäßiges Kaufen den Durchschnittspreis senkt – und was das wirklich wert ist.',
      readingMinutes: 7,
      sections: [
        {
          heading: 'Das Grundprinzip',
          points: [
            'Feste Summe zu festen Terminen, unabhängig vom Kurs.',
            'Hoher Kurs bedeutet wenige Anteile, niedriger Kurs viele.',
            'Rechenbeispiel über sechs Monate mit schwankendem Kurs.',
            'Warum der Durchschnittspreis unter dem Kursdurchschnitt liegt.',
          ],
        },
        {
          heading: 'Der wichtigste Vorteil',
          points: [
            'Die Frage „ist jetzt ein guter Zeitpunkt?“ entfällt.',
            'Automatisierung schlägt gute Vorsätze.',
            'Kleine Beträge sind ab wenigen Euro monatlich möglich.',
            'Warum Durchhalten mehr bringt als die optimale Rate.',
          ],
        },
        {
          heading: 'Praktisch einrichten',
          points: [
            'Ausführungstermin, Rate und Kosten der Ausführung.',
            'Bruchstücke von Anteilen: warum jeder Betrag passt.',
            'Rate anpassen, pausieren, wieder starten.',
            'Notgroschen zuerst, dann Sparplan.',
          ],
        },
      ],
    },
    fortgeschritten: {
      metaTitle: 'Sparplan gegen Einmalanlage: der korrekte Vergleich',
      metaDescription:
        'Warum die Einmalanlage im Durchschnitt vorn liegt, wann Stückeln trotzdem sinnvoll ist und wie Kosten und Ausführungstermine das Ergebnis beeinflussen.',
      title: 'Sparplan oder Einmalanlage?',
      lead: 'Was die Daten sagen, wo der Cost-Average-Effekt überschätzt wird und wann Stückeln trotzdem richtig ist.',
      readingMinutes: 10,
      sections: [
        {
          heading: 'Der ehrliche Vergleich',
          points: [
            'Bei steigenden Märkten gewinnt die Einmalanlage im Durchschnitt – wegen der längeren Investitionsdauer.',
            'Der Sparplan gewinnt in fallenden und seitwärts laufenden Phasen.',
            'Warum der Vergleich nur bei vorhandener Summe überhaupt gestellt werden kann.',
            'Risikoreduktion gegen Renditeerwartung: eine Präferenzfrage, keine Rechenfrage.',
          ],
        },
        {
          heading: 'Stückeln als Kompromiss',
          points: [
            'Große Summen über 6 bis 12 Monate verteilen.',
            'Was das kostet und was es an Reue-Risiko einspart.',
            'Der Effekt sinkender Wirkung mit steigender Depotgröße.',
            'Faustregel: Ab wann neue Raten das Gesamtergebnis kaum noch beeinflussen.',
          ],
        },
        {
          heading: 'Details, die wirken',
          points: [
            'Kosten pro Ausführung gegen Rate: relative Belastung kleiner Raten.',
            'Ausführungstermin und Häufigkeit: messbarer Effekt nahe null.',
            'Ausschüttungen wieder anlegen oder thesaurierend wählen.',
            'Steuern: Sparerpauschbetrag während der Ansparphase nutzen.',
          ],
        },
      ],
    },
    profi: {
      metaTitle: 'Sparplan für Profis: Dynamik, Rebalancing, Entnahme',
      metaDescription:
        'Dynamisierte Raten, Rebalancing über neue Einzahlungen statt Verkäufe, Value Averaging im Test sowie der Übergang in die Entnahmephase.',
      title: 'Sparpläne auf Profi-Niveau',
      lead: 'Dynamisierung, Rebalancing ohne Steuerlast, Value Averaging und der Ausstieg aus der Ansparphase.',
      readingMinutes: 12,
      sections: [
        {
          heading: 'Dynamisierung und Steuerung',
          points: [
            'Rate an Inflation oder Einkommen koppeln: Wirkung auf das Endvermögen.',
            'Value Averaging: Idee, Umsetzung und praktische Probleme.',
            'Regelbasiertes Nachkaufen bei Kursrückgängen und der Test gegen konstante Raten.',
            'Warum zusätzliche Komplexität selten bezahlt wird.',
          ],
        },
        {
          heading: 'Rebalancing über Raten',
          points: [
            'Neue Einzahlungen in die untergewichtete Klasse lenken.',
            'Steuerlast vermeiden: kein Verkauf, keine Abgeltungssteuer.',
            'Bandbreiten festlegen und Kontrollintervalle definieren.',
            'Grenzen: Ab einer bestimmten Depotgröße reichen Raten nicht mehr aus.',
          ],
        },
        {
          heading: 'Übergang in die Entnahme',
          points: [
            'Sequenzrisiko am Übergang von Anspar- zu Entnahmephase.',
            'Gleitpfad: Aktienquote vor dem Ziel reduzieren.',
            'Liquiditätspuffer aufbauen statt zum Stichtag verkaufen.',
            'FIFO-Effekt bei Teilverkäufen einplanen – keine Steuerberatung.',
          ],
        },
      ],
    },
  },
})

export const woraufAchtenEinsteiger = outlineTopic({
  slug: 'worauf-achten-einsteiger',
  title: 'Tipps für Einsteiger',
  headline: 'Worauf du achten musst: Tipps und Fehlerquellen für Einsteiger',
  metaTitle: 'Geldanlage für Einsteiger: worauf du achten musst',
  metaDescription:
    'Die richtige Reihenfolge beim Start, die häufigsten Fehler und ihre Kosten sowie unseriöse Angebote zuverlässig erkennen – praxisnah zusammengefasst.',
  lead: 'Die meisten Fehler beim Vermögensaufbau passieren nicht bei der Produktwahl, sondern in der Reihenfolge der Schritte.',
  overview: [
    'Vor dem ersten Wertpapierkauf steht eine Reihenfolge: teure Schulden abbauen, Notgroschen aufbauen, existenzielle Risiken versichern, Ziele und Zeithorizont klären. Erst dann folgt die Anlage.',
    'Die typischen Fehler sind gut dokumentiert und wiederholen sich: zu wenig Streuung, zu hohe Kosten, zu häufiges Handeln, Verkaufen im Tief und der Glaube an Prognosen.',
    'Die Stufen gehen von der Startreihenfolge über Fehlerkosten und Produktprüfung bis zu Verhaltensmustern, Depotstruktur und dem Erkennen unseriöser Angebote.',
  ],
  keywords: ['Geldanlage Einsteiger', 'Anlagefehler', 'Notgroschen', 'Anlagestrategie'],
  related: ['etf', 'cost-average-sparplan', 'wann-kaufen-verkaufen', 'tagesgeld'],
  calculators: ['/rechner/haushaltsrechner', '/rechner/zinsrechner'],
  levels: {
    beginner: {
      metaTitle: 'Erste Schritte bei der Geldanlage – die Reihenfolge',
      metaDescription:
        'Welche Schritte vor dem ersten Wertpapierkauf kommen, wie groß der Notgroschen sein sollte und wie du Ziele und Zeithorizont festlegst.',
      title: 'Die richtige Reihenfolge zum Start',
      lead: 'Was vor dem ersten Kauf erledigt sein sollte – und warum diese Reihenfolge wichtig ist.',
      readingMinutes: 8,
      sections: [
        {
          heading: 'Fundament zuerst',
          points: [
            'Teure Schulden abbauen: Dispo und Ratenkredite schlagen jede erwartbare Rendite.',
            'Notgroschen: drei bis sechs Monatsausgaben auf dem Tagesgeldkonto.',
            'Existenzielle Risiken versichern, nicht Kleinschäden.',
            'Erst dann investieren – Reihenfolge schlägt Produktauswahl.',
          ],
        },
        {
          heading: 'Ziele und Zeithorizont',
          points: [
            'Jedem Ziel einen Zeithorizont und einen Betrag zuordnen.',
            'Unter fünf Jahren keine Aktienanlage.',
            'Was du realistisch monatlich übrig hast: Haushaltsrechner nutzen.',
            'Risikotragfähigkeit gegen Risikobereitschaft unterscheiden.',
          ],
        },
        {
          heading: 'Einfach anfangen',
          points: [
            'Ein breit gestreuter Basisbaustein genügt für den Start.',
            'Kosten prüfen: laufende Kosten und Ausführungskosten.',
            'Sparplan einrichten und in Ruhe lassen.',
            'Was du in den ersten zwei Jahren nicht brauchst: Einzelaktien, Hebel, Krypto.',
          ],
        },
      ],
    },
    fortgeschritten: {
      metaTitle: 'Typische Anlagefehler und was sie tatsächlich kosten',
      metaDescription:
        'Die häufigsten Fehler mit Zahlen unterlegt, wie du ein Produkt in zehn Minuten prüfst und wie eine schriftliche Anlagestrategie Fehlentscheidungen verhindert.',
      title: 'Fehler, Kosten und Produktprüfung',
      lead: 'Was die häufigsten Fehler kosten und wie du ein Produkt schnell und sicher einschätzt.',
      readingMinutes: 11,
      sections: [
        {
          heading: 'Fehler mit Preisschild',
          points: [
            'Zu häufiges Handeln: Kosten und Spread als sichere Verluste.',
            'Verkaufen im Tief: der Behavior Gap in Zahlen.',
            'Zu hohe Kosten: ein Prozentpunkt über 30 Jahre.',
            'Klumpenrisiko: Arbeitgeberaktien, eine Branche, ein Land.',
          ],
        },
        {
          heading: 'Ein Produkt in zehn Minuten prüfen',
          points: [
            'Basisinformationsblatt: Kosten, Risikoindikator, Anlageziel.',
            'Was ist der Basiswert und wer ist der Emittent?',
            'Gesamtkosten pro Jahr statt einzelner Gebührenposten.',
            'Ausstiegsmöglichkeiten und Mindestlaufzeiten.',
          ],
        },
        {
          heading: 'Strategie schriftlich',
          points: [
            'Zielallokation, Sparrate und Rebalancing-Regel notieren.',
            'Vorab festlegen, was bei 30 Prozent Kursrückgang passiert.',
            'Depot-Protokoll: Entscheidungen mit Begründung dokumentieren.',
            'Warum ein Blatt Papier mehr bringt als jede Prognose.',
          ],
        },
      ],
    },
    profi: {
      metaTitle: 'Fortgeschrittene Fehlerquellen und unseriöse Angebote',
      metaDescription:
        'Verhaltensmuster und Gegenmaßnahmen, Depotstruktur und Ausfallszenarien, Kostenanalyse über alle Ebenen sowie Warnzeichen unseriöser Anbieter.',
      title: 'Fehlerquellen auf Profi-Niveau',
      lead: 'Verhaltensmuster, Depotstruktur, versteckte Kostenebenen und das Erkennen unseriöser Angebote.',
      readingMinutes: 13,
      sections: [
        {
          heading: 'Verhalten systematisch begrenzen',
          points: [
            'Verlustaversion, Bestätigungsfehler, Rückschaufehler und Overconfidence.',
            'Vorab definierte Regeln statt situativer Entscheidungen.',
            'Depot bewusst seltener ansehen: messbarer Effekt auf Handelsfrequenz.',
            'Umgang mit Sonderzahlungen und Erbschaften.',
          ],
        },
        {
          heading: 'Struktur und Ausfallszenarien',
          points: [
            'Mehrere Depots: Kosten gegen Ausfallsicherheit.',
            'Broker-Insolvenz: Sondervermögen und praktische Übertragungsdauer.',
            'Vollmachten, Zugangsdaten und Vorsorge für den Notfall.',
            'Dokumentation für Angehörige.',
          ],
        },
        {
          heading: 'Unseriöse Angebote erkennen',
          points: [
            'Renditeversprechen ohne Risikoangabe als klares Ausschlusskriterium.',
            'Zeitdruck, Exklusivität und Empfehlungsprämien als Muster.',
            'Zulassung und Sitz des Anbieters prüfen, Warnlisten der Aufsicht nutzen.',
            'Nicht handelbare oder nicht bewertbare Anlagen meiden.',
          ],
        },
      ],
    },
  },
})

export const groessteCrashes = outlineTopic({
  slug: 'groesste-crashes',
  title: 'Die größten Crashes',
  headline: 'Die größten Börsencrashs – und was danach möglich war',
  metaTitle: 'Börsencrashs der Geschichte: Ursachen und Lehren',
  metaDescription:
    'Von 1929 bis zur Corona-Panik: Ursachen, Verläufe und Erholungsdauern der großen Crashs – und welche Chancen für Anleger daraus entstanden.',
  lead: 'Jeder Crash hatte eine eigene Ursache und ein gemeinsames Muster: Er endete, und wer investiert blieb, profitierte von der Erholung.',
  overview: [
    'Kursstürze gehören zum Aktienmarkt. Historisch traten Rückgänge von 20 Prozent und mehr regelmäßig auf – im Schnitt mehrmals pro Jahrzehnt.',
    'Interessant sind nicht die Verluste, sondern die Erholungsdauern und die Frage, wovon sie abhingen: von der Bewertung vor dem Einbruch, der Reaktion von Notenbanken und Politik und davon, ob der Auslöser das Finanzsystem selbst betraf.',
    'Die Stufen behandeln die wichtigsten Ereignisse im Überblick, dann Mechanik und Ansteckungswege, schließlich Bewertungsniveaus, Liquiditätsspiralen und die Belastbarkeit historischer Vergleiche.',
  ],
  keywords: ['Börsencrash', '1929', 'Finanzkrise 2008', 'Dotcom', 'Erholungsdauer'],
  related: ['aktie', 'wann-kaufen-verkaufen', 'aktien-laender-branchen'],
  symbols: ['nasdaq-100', 'sp500', 'dax'],
  levels: {
    beginner: {
      metaTitle: 'Börsencrashs einfach erklärt – die wichtigsten Fälle',
      metaDescription:
        'Die großen Crashs von 1929 bis 2020 im Überblick, wie lange die Erholung jeweils dauerte und was Anleger daraus praktisch lernen können.',
      title: 'Die großen Crashs im Überblick',
      lead: 'Was passiert ist, wie lange es dauerte und was daraus folgt.',
      readingMinutes: 9,
      sections: [
        {
          heading: 'Die wichtigsten Ereignisse',
          points: [
            '1929 und die Weltwirtschaftskrise: Ausmaß und Dauer.',
            '1987 Schwarzer Montag: ein Tag, schnelle Erholung.',
            '2000 bis 2003 Dotcom: Technologiewerte besonders betroffen.',
            '2008 Finanzkrise und 2020 Corona-Panik im Vergleich.',
          ],
        },
        {
          heading: 'Was sie gemeinsam hatten',
          points: [
            'Vorher: steigende Kurse und wachsende Zuversicht.',
            'Ein Auslöser, der die Erwartungen kippen ließ.',
            'Panikverkäufe verstärken die Bewegung.',
            'Und dann: eine Erholung, deren Dauer stark variierte.',
          ],
        },
        {
          heading: 'Was Anleger mitnehmen',
          points: [
            'Rückgänge von 20 Prozent und mehr sind normal, nicht außergewöhnlich.',
            'Wer investiert blieb, hat historisch die Erholung mitgenommen.',
            'Wer verkaufte, verpasste oft den stärksten Teil der Erholung.',
            'Deshalb: nur Geld anlegen, das lange liegen bleiben kann.',
          ],
        },
      ],
    },
    fortgeschritten: {
      metaTitle: 'Crash-Mechanik: Blasen, Hebel und Ansteckung',
      metaDescription:
        'Wie Blasen entstehen, welche Rolle Kredithebel und Zwangsverkäufe spielen, wie Ansteckung zwischen Märkten funktioniert und wie Politik reagierte.',
      title: 'Mechanik und Ansteckungswege',
      lead: 'Wie aus Übertreibung ein Absturz wird und warum sich Krisen ausbreiten.',
      readingMinutes: 12,
      sections: [
        {
          heading: 'Wie Blasen entstehen',
          points: [
            'Neue Technologie oder neues Narrativ als Ausgangspunkt.',
            'Kredit als Verstärker: steigende Hebel in der Spätphase.',
            'Bewertungskennzahlen kurz vor dem Wendepunkt.',
            'Warum „diesmal ist es anders“ ein wiederkehrender Satz ist.',
          ],
        },
        {
          heading: 'Der Absturz',
          points: [
            'Margin Calls und Zwangsverkäufe.',
            'Liquiditätsspirale: Verkäufe drücken Preise, Preise erzwingen Verkäufe.',
            'Korrelationen steigen, Streuung wirkt schlechter als erwartet.',
            'Rolle automatisierter Strategien und Handelsunterbrechungen.',
          ],
        },
        {
          heading: 'Ansteckung und Reaktion',
          points: [
            'Von Finanzmarkt zu Realwirtschaft und zurück.',
            'Bankensystem als Übertragungskanal.',
            'Notenbank- und Fiskalreaktionen im historischen Vergleich.',
            'Warum die Erholungsdauer stark von der Reaktion abhing.',
          ],
        },
      ],
    },
    profi: {
      metaTitle: 'Crashs für Profis: Bewertung, Liquidität, Vergleichbarkeit',
      metaDescription:
        'Bewertungsniveaus vor Einbrüchen, Liquiditäts- und Kreditkanäle, Sequenzrisiko für Entnehmer und die Grenzen historischer Rückvergleiche.',
      title: 'Crashs auf Profi-Niveau',
      lead: 'Bewertungsindikatoren, Übertragungskanäle und wie belastbar historische Vergleiche wirklich sind.',
      readingMinutes: 14,
      sections: [
        {
          heading: 'Bewertung als Vorlauf',
          points: [
            'Zyklisch bereinigte Kennzahlen und ihre Prognosekraft über lange Zeiträume.',
            'Risikoprämien und Kreditspreads als Frühindikatoren.',
            'Warum Bewertung Timing nicht ersetzt.',
            'Basiseffekte und Definitionsprobleme historischer Datenreihen.',
          ],
        },
        {
          heading: 'Übertragungskanäle im Detail',
          points: [
            'Fristentransformation, Repo-Markt und Sicherheitenabschläge.',
            'Fire Sales und ihre Preiswirkung auf Dritte.',
            'Verflechtung über Derivate und zentrale Gegenparteien.',
            'Regulatorische Reformen nach 2008 und ihre offenen Flanken.',
          ],
        },
        {
          heading: 'Folgen für die Planung',
          points: [
            'Sequenzrisiko: derselbe Crash trifft Ansparer und Entnehmer völlig unterschiedlich.',
            'Rebalancing im Crash: Wirkung und psychologische Voraussetzungen.',
            'Survivorship Bias in Langzeitreihen und Länderauswahl.',
            'Warum „Kaufgelegenheit“ nur mit vorhandener Liquidität eine ist.',
          ],
        },
      ],
    },
  },
})

export const wannKaufenVerkaufen = outlineTopic({
  slug: 'wann-kaufen-verkaufen',
  title: 'Wann kaufen und verkaufen',
  headline: 'Wann kaufen, wann verkaufen? Was Timing wirklich bringt',
  metaTitle: 'Wann kaufen und verkaufen? Timing realistisch bewertet',
  metaDescription:
    'Was Market-Timing kostet, warum die besten Handelstage neben den schlechtesten liegen und welche Verkaufsgründe wirklich tragfähig sind.',
  lead: 'Die Frage nach dem richtigen Zeitpunkt ist die teuerste Frage der Geldanlage – weil sie sich nicht zuverlässig beantworten lässt.',
  overview: [
    'Market-Timing verlangt zwei richtige Entscheidungen: rechtzeitig aussteigen und rechtzeitig wieder einsteigen. Der zweite Teil scheitert in der Praxis häufiger als der erste.',
    'Empirisch hängt ein großer Teil der Langfristrendite an wenigen sehr starken Handelstagen – und die liegen typischerweise unmittelbar neben den schwächsten, also in Phasen maximaler Unsicherheit.',
    'Die Stufen behandeln die Grundfrage und die Kosten des Wartens, dann Regeln und Anlässe für Verkäufe, schließlich empirische Befunde, Steuerwirkung und regelbasierte Ansätze.',
  ],
  keywords: ['Market-Timing', 'Einstiegszeitpunkt', 'verkaufen', 'Anlagehorizont'],
  related: ['cost-average-sparplan', 'groesste-crashes', 'wie-funktioniert-der-markt'],
  symbols: ['sp500', 'dax'],
  levels: {
    beginner: {
      metaTitle: 'Der richtige Zeitpunkt: Timing für Einsteiger erklärt',
      metaDescription:
        'Warum es keinen erkennbar richtigen Einstiegszeitpunkt gibt, was Warten kostet und wie du mit einem Sparplan die Frage umgehst.',
      title: 'Gibt es den richtigen Zeitpunkt?',
      lead: 'Warum die Zeitpunktfrage weniger wichtig ist, als sie sich anfühlt.',
      readingMinutes: 7,
      sections: [
        {
          heading: 'Die Grundfrage',
          points: [
            'Ein günstiger Zeitpunkt ist immer erst im Rückblick erkennbar.',
            'Höchststände sind bei steigenden Märkten der Normalfall.',
            'Warten hat ein eigenes Risiko: die Aufwärtsbewegung zu verpassen.',
            'Zwei Risiken statt einem: Kursrisiko und Nichtinvestiert-Risiko.',
          ],
        },
        {
          heading: 'Was Warten kostet',
          points: [
            'Beispielrechnung: verpasste starke Tage über ein Jahrzehnt.',
            'Warum die besten Tage neben den schlechtesten liegen.',
            'Bargeld verliert währenddessen durch Inflation an Kaufkraft.',
            'Der Rückkehr-Zeitpunkt ist die schwerere der beiden Entscheidungen.',
          ],
        },
        {
          heading: 'Der pragmatische Ausweg',
          points: [
            'Sparplan: der Zeitpunkt wird zur Routine statt zur Entscheidung.',
            'Größere Summen über einige Monate stückeln.',
            'Zeithorizont statt Prognose als Auswahlkriterium.',
            'Wann Verkaufen tatsächlich sinnvoll ist: Geldbedarf und Zielerreichung.',
          ],
        },
      ],
    },
    fortgeschritten: {
      metaTitle: 'Verkaufsgründe und Regeln statt Bauchgefühl',
      metaDescription:
        'Tragfähige Verkaufsgründe, warum der eigene Einstiegskurs irrelevant ist, wie Rebalancing gegenüber Timing wirkt und was Stop-Kurse leisten.',
      title: 'Verkaufsgründe und Regeln',
      lead: 'Welche Gründe für einen Verkauf tragen und welche nur Gefühle sind.',
      readingMinutes: 10,
      sections: [
        {
          heading: 'Tragfähige Verkaufsgründe',
          points: [
            'Das Ziel ist erreicht oder das Geld wird gebraucht.',
            'Die Anlagethese ist widerlegt – nicht: der Kurs ist gefallen.',
            'Die Allokation ist aus dem Gleichgewicht geraten.',
            'Steuerliche oder Kostengründe mit konkretem Vorteil.',
          ],
        },
        {
          heading: 'Was kein Grund ist',
          points: [
            'Der eigene Einstiegskurs: eine Zahl, die nur du kennst.',
            'Runde Kursmarken und Chartlinien ohne Kontext.',
            'Medienstimmung und Prognosen einzelner Analysten.',
            'Verlustaversion: Gewinne früh mitnehmen, Verluste laufen lassen.',
          ],
        },
        {
          heading: 'Regeln statt Entscheidungen',
          points: [
            'Rebalancing mit festen Bandbreiten als antizyklisches Prinzip.',
            'Vorab schriftlich festlegen, was bei starken Rückgängen passiert.',
            'Stop-Kurse: was sie leisten und was nicht.',
            'Handelsfrequenz senken: der einfachste messbare Renditehebel.',
          ],
        },
      ],
    },
    profi: {
      metaTitle: 'Timing für Profis: Empirie, Steuern, Regelstrategien',
      metaDescription:
        'Empirische Befunde zu Timing-Strategien, Steuerwirkung häufiger Umschichtungen sowie Trendfolge und Bewertungsregeln kritisch geprüft.',
      title: 'Timing auf Profi-Niveau',
      lead: 'Was Studien zu Timing-Ansätzen zeigen, was Steuern davon übriglassen und wo Regeln tragen.',
      readingMinutes: 13,
      sections: [
        {
          heading: 'Empirische Befunde',
          points: [
            'Trefferquote, die eine Timing-Strategie braucht, um Kosten zu decken.',
            'Trendfolge und gleitende Durchschnitte: Ergebnisse nach Kosten.',
            'Bewertungsbasierte Steuerung und ihre langen Wartezeiten.',
            'Data Mining und Überanpassung in Rückrechnungen.',
          ],
        },
        {
          heading: 'Steuerliche Bremse',
          points: [
            'Jeder Verkauf realisiert Gewinne und löst Abgeltungssteuer aus.',
            'Verlorener Steuerstundungseffekt als versteckte Kostenposition.',
            'FIFO-Prinzip und seine Wirkung bei Teilverkäufen.',
            'Getrennte Verlustverrechnungstöpfe bei Aktien – keine Steuerberatung.',
          ],
        },
        {
          heading: 'Wo Regeln tragen',
          points: [
            'Risikobudget statt Prognose: Positionsgrößen als Steuerungsinstrument.',
            'Gleitpfad zum Zieltermin, besonders vor der Entnahmephase.',
            'Liquiditätsplanung, die Verkäufe im Tief unnötig macht.',
            'Dokumentation und Nachprüfung eigener Entscheidungen über Jahre.',
          ],
        },
      ],
    },
  },
})

export const einlagensicherung = outlineTopic({
  slug: 'einlagensicherung',
  title: 'Einlagensicherung',
  headline: 'Einlagensicherung: was geschützt ist und was nicht',
  metaTitle: 'Einlagensicherung erklärt: Höhe, Umfang, Grenzen',
  metaDescription:
    'Welche Guthaben die Einlagensicherung abdeckt, bis zu welcher Höhe sie greift, was ausdrücklich nicht geschützt ist und wie die Auszahlung abläuft.',
  lead: 'Die Einlagensicherung schützt Bankguthaben bis zu einer festen Grenze – Wertpapiere schützt sie überhaupt nicht, weil sie es nicht muss.',
  overview: [
    'Geht eine Bank pleite, greift die gesetzliche Einlagensicherung: Guthaben werden bis zu einer festgelegten Obergrenze pro Person und Institut ersetzt.',
    'Entscheidend ist der Unterschied zwischen Einlagen und Wertpapieren. Einlagen sind Forderungen gegen die Bank und deshalb sicherungsbedürftig. Wertpapiere im Depot sind Sondervermögen und gehören ohnehin dir.',
    'Die Stufen behandeln Umfang und Höhe, dann Sicherungssysteme und Sonderfälle, schließlich Abwicklungsrecht, Bail-in und die Belastbarkeit der Systeme im Ernstfall.',
  ],
  keywords: ['Einlagensicherung', 'Bankguthaben', 'Sondervermögen', 'Bail-in'],
  related: ['tagesgeld', 'schuldverschreibung', 'fonds'],
  levels: {
    beginner: {
      metaTitle: 'Einlagensicherung einfach erklärt – was gilt',
      metaDescription:
        'Was die Einlagensicherung abdeckt, bis zu welcher Höhe sie greift, was nicht geschützt ist und warum Wertpapiere anders behandelt werden.',
      title: 'Einlagensicherung einfach erklärt',
      lead: 'Welche Guthaben geschützt sind, bis zu welcher Grenze und was ausgenommen bleibt.',
      readingMinutes: 7,
      sections: [
        {
          heading: 'Was geschützt ist',
          points: [
            'Giro-, Tagesgeld-, Festgeld- und Sparkonten in der EU.',
            'Obergrenze pro Person und Institut, nicht pro Konto.',
            'Gemeinschaftskonten: Zuordnung der Grenze auf die Inhaber.',
            'Mehrere Marken einer Bank können ein Institut sein – wichtiger Prüfpunkt.',
          ],
        },
        {
          heading: 'Was nicht geschützt ist',
          points: [
            'Aktien, Fonds und ETFs – sie sind Sondervermögen und gehören dir.',
            'Zertifikate und Anleihen der Bank: Forderungen mit Emittentenrisiko.',
            'Krypto-Guthaben auf Handelsplattformen.',
            'Warum „nicht geschützt“ nicht automatisch „unsicher“ bedeutet.',
          ],
        },
        {
          heading: 'Praktische Konsequenzen',
          points: [
            'Größere Beträge auf mehrere Institute verteilen.',
            'Prüfen, welchem Sicherungssystem eine Bank angehört.',
            'Ablauf und Frist der Auszahlung im Sicherungsfall.',
            'Vorsicht bei sehr hohen Zinsen weit über dem Marktniveau.',
          ],
        },
      ],
    },
    fortgeschritten: {
      metaTitle: 'Sicherungssysteme und Sonderfälle im Vergleich',
      metaDescription:
        'Gesetzliche Sicherung, freiwillige Fonds und Institutssicherung im Vergleich, temporär höhere Grenzen und die Lage bei Auslandsbanken.',
      title: 'Sicherungssysteme und Sonderfälle',
      lead: 'Welche Systeme es gibt, wie stark sie sich unterscheiden und welche Sonderfälle gelten.',
      readingMinutes: 9,
      sections: [
        {
          heading: 'Die Systeme',
          points: [
            'Gesetzliche Einlagensicherung als Pflichtsystem.',
            'Freiwillige Einlagensicherungsfonds mit höheren Grenzen.',
            'Institutssicherung bei Sparkassen und Genossenschaftsbanken.',
            'Rechtsanspruch gegen satzungsmäßige Leistung: der wichtige Unterschied.',
          ],
        },
        {
          heading: 'Sonderfälle',
          points: [
            'Temporär höhere Absicherung nach Immobilienverkauf oder Erbschaft.',
            'Treuhand- und Anderkonten.',
            'Fremdwährungseinlagen und ihre Behandlung.',
            'Zinsen bis zum Sicherungsfall: was mitgesichert ist.',
          ],
        },
        {
          heading: 'Banken im Ausland',
          points: [
            'Zuständig ist das Sicherungssystem des Sitzlandes.',
            'Leistungsfähigkeit des Systems und Größe des Bankensektors.',
            'Sprache, Antragswege und Auszahlungsdauer in der Praxis.',
            'Zinsplattformen: wer eigentlich Vertragspartner ist.',
          ],
        },
      ],
    },
    profi: {
      metaTitle: 'Einlagensicherung für Profis: Bail-in und Abwicklung',
      metaDescription:
        'Haftungskaskade im Abwicklungsrecht, Bail-in-fähige Verbindlichkeiten, Deckungsgrad der Sicherungsfonds und Systemrisiko im Ernstfall.',
      title: 'Einlagensicherung auf Profi-Niveau',
      lead: 'Abwicklungsrecht, Haftungsreihenfolge und die Frage, wie belastbar die Systeme tatsächlich sind.',
      readingMinutes: 12,
      sections: [
        {
          heading: 'Abwicklung statt Insolvenz',
          points: [
            'Abwicklungsbehörden, Sanierungspläne und Abwicklungsinstrumente.',
            'Haftungskaskade: Eigenkapital, Nachrang, Senior-Anleihen, dann Einlagen.',
            'Vorrang gedeckter Einlagen in der Rangfolge.',
            'Brückeninstitut und Übertragung von Kundenbeständen.',
          ],
        },
        {
          heading: 'Bail-in in der Praxis',
          points: [
            'Welche Verbindlichkeiten herangezogen werden können.',
            'MREL-Anforderungen und ihre Schutzwirkung für Einleger.',
            'Historische Fälle mit Beteiligung von Gläubigern.',
            'Unterschied zwischen Systemkrise und Einzelinstitutsfall.',
          ],
        },
        {
          heading: 'Belastbarkeit der Systeme',
          points: [
            'Deckungsgrad der Sicherungsfonds gegenüber gedeckten Einlagen.',
            'Nachschusspflichten und Kreditlinien der Systeme.',
            'Digitale Bank Runs: Geschwindigkeit von Abflüssen heute.',
            'Praktische Streuung über Institute und Sicherungssysteme.',
          ],
        },
      ],
    },
  },
})

export const sparerpauschbetrag = outlineTopic({
  slug: 'sparerpauschbetrag',
  title: 'Sparerpauschbetrag',
  headline: 'Sparerpauschbetrag: der Freibetrag für Kapitalerträge',
  metaTitle: 'Sparerpauschbetrag richtig nutzen: so funktioniert es',
  metaDescription:
    'Wie der Freibetrag für Kapitalerträge wirkt, wie du Freistellungsaufträge sinnvoll verteilst und was bei mehreren Depots und Verlusttöpfen zu beachten ist.',
  lead: 'Der Sparerpauschbetrag stellt Kapitalerträge bis zu einer Jahresgrenze steuerfrei – aber nur, wenn du ihn aktiv zuweist.',
  overview: [
    'Zinsen, Dividenden und realisierte Kursgewinne sind bis zum Sparerpauschbetrag steuerfrei. Darüber greift die Abgeltungssteuer samt Solidaritätszuschlag und gegebenenfalls Kirchensteuer.',
    'Der Freibetrag wirkt nicht automatisch: Ohne Freistellungsauftrag führt die Bank Steuer ab. Er ist außerdem ein Jahresbetrag – nicht genutzte Teile verfallen zum Jahresende.',
    'Die Stufen behandeln Grundlagen und Freistellungsauftrag, dann die Verteilung über mehrere Institute und die Steuererklärung, schließlich Verlusttöpfe, Vorabpauschale und Sonderfälle.',
  ],
  keywords: [
    'Sparerpauschbetrag',
    'Freistellungsauftrag',
    'Abgeltungssteuer',
    'Kapitalerträge',
  ],
  related: ['tagesgeld', 'etf', 'aktie', 'fonds'],
  levels: {
    beginner: {
      metaTitle: 'Sparerpauschbetrag einfach erklärt – so wirkt er',
      metaDescription:
        'Welche Erträge unter den Freibetrag fallen, wie ein Freistellungsauftrag funktioniert und warum ungenutzter Freibetrag am Jahresende verfällt.',
      title: 'Sparerpauschbetrag einfach erklärt',
      lead: 'Welche Erträge steuerfrei bleiben und was du dafür tun musst.',
      readingMinutes: 6,
      sections: [
        {
          heading: 'Was darunterfällt',
          points: [
            'Zinsen, Dividenden, realisierte Kursgewinne, Fondserträge.',
            'Jahresbetrag pro Person, für Ehepaare gemeinsam verdoppelt.',
            'Was oberhalb der Grenze passiert: Abgeltungssteuer plus Zuschläge.',
            'Aktuelle Höhe vor jeder Planung prüfen – Beträge werden angepasst.',
          ],
        },
        {
          heading: 'Der Freistellungsauftrag',
          points: [
            'Ohne Auftrag führt die Bank Steuer ab, auch unterhalb des Freibetrags.',
            'Einrichtung dauert wenige Minuten, meist online.',
            'Auf mehrere Banken verteilbar, insgesamt aber nur einmal nutzbar.',
            'Steuer-Identifikationsnummer wird benötigt.',
          ],
        },
        {
          heading: 'Häufige Fehler',
          points: [
            'Kein Auftrag gestellt und dadurch unnötig Steuer gezahlt.',
            'Auftrag bei der falschen Bank – dort fallen kaum Erträge an.',
            'Ungenutzter Freibetrag verfällt zum Jahresende.',
            'Zu viel gezahlte Steuer lässt sich über die Steuererklärung zurückholen.',
          ],
        },
      ],
    },
    fortgeschritten: {
      metaTitle: 'Freistellungsauftrag optimal verteilen – so geht es',
      metaDescription:
        'Wie du den Freibetrag über mehrere Institute verteilst, wann sich die Anlage KAP lohnt und was bei Kirchensteuer und Nichtveranlagung gilt.',
      title: 'Verteilung, Erklärung und Sonderfälle',
      lead: 'Wie du den Freibetrag dort einsetzt, wo er wirkt, und wann die Steuererklärung hilft.',
      readingMinutes: 9,
      sections: [
        {
          heading: 'Sinnvoll verteilen',
          points: [
            'Erträge je Institut schätzen, dann zuweisen – nicht nach Gefühl.',
            'Einmal jährlich prüfen und anpassen.',
            'Reihenfolge: erst Vorabpauschale abdecken, dann Zinsen.',
            'Was bei Depotwechsel oder Bankwechsel zu beachten ist.',
          ],
        },
        {
          heading: 'Über die Steuererklärung',
          points: [
            'Anlage KAP: zu viel gezahlte Steuer zurückholen.',
            'Verluste zwischen Instituten verrechnen – Verlustbescheinigung beantragen.',
            'Frist für die Verlustbescheinigung im Blick behalten.',
            'Günstigerprüfung bei niedrigem persönlichem Steuersatz.',
          ],
        },
        {
          heading: 'Weitere Fälle',
          points: [
            'Kirchensteuerabzug und das Sperrvermerk-Verfahren.',
            'Nichtveranlagungsbescheinigung bei geringem Einkommen.',
            'Kinderdepots: eigener Freibetrag und die Grenzen der Gestaltung.',
            'Ausländische Depots: keine automatische Abführung, Erklärungspflicht.',
          ],
        },
      ],
    },
    profi: {
      metaTitle: 'Kapitalerträge für Profis: Töpfe, Pauschale, Gestaltung',
      metaDescription:
        'Verlustverrechnungstöpfe und ihre Grenzen, Vorabpauschale und Teilfreistellung im Zusammenspiel sowie zulässige Gestaltung und ihre Fallstricke.',
      title: 'Kapitalerträge auf Profi-Niveau',
      lead: 'Verlusttöpfe, Vorabpauschale, Teilfreistellung und die Grenzen zulässiger Gestaltung.',
      readingMinutes: 12,
      sections: [
        {
          heading: 'Verlustverrechnungstöpfe',
          points: [
            'Allgemeiner Topf gegen Aktienverlusttopf: strikte Trennung.',
            'Aktienverluste nur mit Aktiengewinnen verrechenbar.',
            'Verlustvortrag über Jahre, aber immer topfgebunden.',
            'Termingeschäfte: eigene Beschränkungen und ihre Kritik.',
          ],
        },
        {
          heading: 'Vorabpauschale und Teilfreistellung',
          points: [
            'Berechnung der Vorabpauschale über den Basisertrag.',
            'Anrechnung beim späteren Verkauf – keine Doppelbesteuerung.',
            'Teilfreistellungssätze nach Fondsart und Wirkung auf den Freibetrag.',
            'Liquidität für die Pauschale bereithalten: Belastung des Verrechnungskontos.',
          ],
        },
        {
          heading: 'Gestaltung und Grenzen',
          points: [
            'Freibetrag über Familienmitglieder: Schenkung, Verfügungsmacht, Grenzen.',
            'Realisierung von Gewinnen zur Freibetragsnutzung und der FIFO-Effekt.',
            'Wechsel zwischen ausschüttend und thesaurierend je Lebensphase.',
            'Ausdrücklicher Hinweis: allgemeine Information, keine Steuerberatung.',
          ],
        },
      ],
    },
  },
})

/* -------------------------------------------------------------------------
   Ergänzende Themen

   Die folgenden zehn Themen schließen Lücken, die beim Aufbau der
   Reihenfolge sichtbar wurden: Zwischen „Notgroschen anlegen“ und „Aktie
   kaufen“ fehlten das Haushaltsbudget, das Risikoverständnis und das Depot;
   zwischen Nachrichtenlage und Anlageklasse fehlten Inflation, Notenbanken
   und Wechselkurse.
   ------------------------------------------------------------------------- */

export const budgetUndSparquote = outlineTopic({
  slug: 'budget-und-sparquote',
  title: 'Budget & Sparquote',
  headline: 'Budget und Sparquote: der Betrag, der alles andere bestimmt',
  metaTitle: 'Budget und Sparquote: Haushaltsplan richtig aufstellen',
  metaDescription:
    'Wie du deine tatsächlichen Ausgaben ermittelst, eine belastbare Sparquote berechnest und warum dieser Betrag über den Anlageerfolg mehr entscheidet als die Rendite.',
  lead: 'Bevor die Frage „worin anlegen“ überhaupt sinnvoll ist, steht die Frage „wie viel“ – und die beantwortet nur ein Haushaltsplan.',
  overview: [
    'Die Sparquote ist der Anteil des Einkommens, der nach allen Ausgaben übrig bleibt und angelegt werden kann. Sie ist die einzige Größe der Geldanlage, die vollständig in der eigenen Hand liegt.',
    'Über kurze Zeiträume schlägt sie die Rendite deutlich: Wer 300 statt 150 Euro im Monat spart, hat nach zehn Jahren mehr erreicht als jemand, der bei 150 Euro zwei Prozentpunkte mehr Rendite erzielt. Erst über Jahrzehnte dreht sich dieses Verhältnis.',
    'Die Stufen führen von der ehrlichen Bestandsaufnahme über feste Budgetregeln und den Umgang mit unregelmäßigen Ausgaben bis zur Frage, wie sich eine Sparquote durch Lebensphasen mit schwankendem Einkommen trägt.',
  ],
  keywords: [
    'Sparquote',
    'Haushaltsbuch',
    'Budget',
    'Fixkosten',
    'Notgroschen',
    'Ausgaben',
  ],
  related: ['worauf-achten-einsteiger', 'tagesgeld', 'zinseszins', 'schulden-und-kredit'],
  calculators: ['/rechner/haushaltsrechner', '/rechner/zinsrechner'],
  levels: {
    beginner: {
      metaTitle: 'Sparquote berechnen – Grundlagen für Einsteiger',
      metaDescription:
        'Was eine Sparquote ist, wie du deine echten Ausgaben ermittelst und warum Schätzungen dabei fast immer zu niedrig ausfallen.',
      title: 'Budget und Sparquote einfach erklärt',
      lead: 'Wie du herausfindest, wie viel Geld tatsächlich übrig bleibt – und warum die geschätzte Zahl selten stimmt.',
      readingMinutes: 8,
      sections: [
        {
          heading: 'Was die Sparquote ist',
          points: [
            'Sparquote = übrig bleibender Betrag geteilt durch Nettoeinkommen, in Prozent.',
            'Gemeint ist der Betrag nach allen Ausgaben, nicht der Betrag nach den Fixkosten.',
            'Abgrenzung: Sparen heißt zurücklegen, Anlegen heißt investieren – erst das eine, dann das andere.',
            'Warum die Quote und nicht der absolute Betrag: Sie bleibt vergleichbar, wenn das Einkommen sich ändert.',
          ],
        },
        {
          heading: 'Die eigenen Ausgaben ehrlich erfassen',
          points: [
            'Drei Monate Kontoauszüge auswerten statt schätzen – die Schätzung liegt fast immer zu niedrig.',
            'Fixkosten, variable Kosten und unregelmäßige Jahreskosten getrennt notieren.',
            'Typische Blindstellen: Abonnements, Versicherungen mit Jahresbeitrag, Autoreparaturen, Geschenke.',
            'Bargeldabhebungen sind keine Kategorie – sie verstecken die eigentliche Ausgabe.',
          ],
        },
        {
          heading: 'Der erste Plan',
          points: [
            'Die 50/30/20-Regel als grober Startpunkt: Notwendiges, Wünsche, Sparen.',
            'Warum die Regel nur ein Startpunkt ist: In Städten mit hoher Miete stimmt sie nicht.',
            'Dauerauftrag am Tag des Geldeingangs – gespart wird zuerst, nicht was übrig bleibt.',
            'Notgroschen zuerst aufbauen, erst danach anlegen.',
          ],
        },
      ],
    },
    fortgeschritten: {
      metaTitle: 'Budget steuern: Methoden und unregelmäßige Ausgaben',
      metaDescription:
        'Kontenmodelle, Umgang mit Jahreskosten, realistische Zielquoten und wie du ein Budget durch Gehaltssprünge und Einkommensausfälle trägst.',
      title: 'Ein Budget, das im Alltag hält',
      lead: 'Welche Methoden funktionieren, wie unregelmäßige Ausgaben eingeplant werden und woran Budgets in der Praxis scheitern.',
      readingMinutes: 10,
      sections: [
        {
          heading: 'Methoden im Vergleich',
          points: [
            'Drei-Konten-Modell: Gehaltskonto, Ausgabenkonto, Rücklagenkonto und ihre Aufgabenteilung.',
            'Umschlagmethode und ihre digitale Entsprechung über Unterkonten.',
            'Zero-Based-Budget: Jeder Euro bekommt eine Aufgabe – Aufwand gegen Genauigkeit.',
            'Automatisierung schlägt Disziplin: Was per Dauerauftrag läuft, muss nicht entschieden werden.',
          ],
        },
        {
          heading: 'Unregelmäßige Ausgaben planbar machen',
          points: [
            'Jahreskosten durch zwölf teilen und monatlich auf ein Rücklagenkonto legen.',
            'Typische Posten: Versicherungen, Kfz-Steuer, Urlaub, Weihnachten, Rundfunkbeitrag.',
            'Abgrenzung Rücklage gegen Notgroschen: geplante gegen ungeplante Ausgaben.',
            'Warum ein gemeinsamer Topf beides gefährdet.',
          ],
        },
        {
          heading: 'Die Quote über die Zeit',
          points: [
            'Lifestyle-Inflation: Warum Gehaltserhöhungen die Sparquote oft senken statt heben.',
            'Die halbe Erhöhung sparen – eine Regel, die ohne Verzicht auskommt.',
            'Sparquote in Phasen mit schwankendem Einkommen: Untergrenze statt Fixbetrag.',
            'Wann eine Sparquote bewusst gesenkt werden sollte, statt Schulden aufzunehmen.',
          ],
        },
      ],
    },
    profi: {
      metaTitle: 'Sparquote und Vermögensaufbau: Wirkung über Jahrzehnte',
      metaDescription:
        'Wie sich Sparquote und Rendite über verschiedene Zeiträume gegeneinander verhalten, wie Inflation die Quote entwertet und was eine Sparquote finanziell wirklich bewirkt.',
      title: 'Sparquote, Rendite und Zeit',
      lead: 'Wann der gesparte Betrag wichtiger ist als die Rendite – und ab wann sich das Verhältnis umkehrt.',
      readingMinutes: 11,
      sections: [
        {
          heading: 'Sparquote gegen Rendite',
          points: [
            'Rechenbeispiel über 10, 20 und 30 Jahre: ab wann die Rendite die Quote überholt.',
            'Der Grund: Die Quote wirkt linear, die Rendite exponentiell – aber erst mit Vorlauf.',
            'Praktische Folge: In den ersten zehn Jahren lohnt sich Sparen mehr als Optimieren.',
            'Selbst nachrechnen mit dem Zinsrechner statt Faustregeln zu übernehmen.',
          ],
        },
        {
          heading: 'Reale Betrachtung',
          points: [
            'Nominale Sparquote gegen reale Sparquote bei steigenden Lebenshaltungskosten.',
            'Dynamisierung der Sparrate: Anpassung an die Inflation statt fester Euro-Betrag.',
            'Wirkung einer um zwei Prozentpunkte steigenden Miete auf die verfügbare Quote.',
            'Warum eine Sparquote ohne Inflationsbezug über Jahrzehnte schrumpft.',
          ],
        },
        {
          heading: 'Grenzen des Sparens',
          points: [
            'Einkommensseite gegen Ausgabenseite: Wann Optimierung am Ende ist.',
            'Fixkostenblöcke Wohnen und Mobilität – die einzigen Hebel mit echter Größe.',
            'Sparquote und Lebensqualität: Der Punkt, an dem eine Quote nicht mehr durchhaltbar ist.',
            'Die durchhaltbare Quote schlägt die maximale – ein abgebrochener Plan hat keine Rendite.',
          ],
        },
      ],
    },
  },
})

export const risikoUndRendite = outlineTopic({
  slug: 'risiko-und-rendite',
  title: 'Risiko & Rendite',
  headline: 'Risiko und Rendite: die Regel hinter allen Anlageentscheidungen',
  metaTitle: 'Risiko und Rendite: Volatilität, Drawdown und Horizont',
  metaDescription:
    'Warum Rendite ohne Risiko nicht zu haben ist, wie Schwankung gemessen wird, was ein maximaler Drawdown aussagt und welche Rolle der Anlagehorizont spielt.',
  lead: 'Jede Anlageentscheidung ist eine Entscheidung über Risiko – die Rendite ist nur der Preis, den der Markt dafür zahlt.',
  overview: [
    'Rendite ist die Entschädigung für übernommenes Risiko. Eine Anlage, die höhere Erträge verspricht als andere, tut das nie ohne Gegenleistung – die Frage ist immer, worin diese Gegenleistung besteht.',
    'Risiko ist dabei nicht ein einziger Begriff: Kursschwankung, dauerhafter Kapitalverlust, Ausfall eines Schuldners und die Gefahr, zum falschen Zeitpunkt verkaufen zu müssen, sind vier verschiedene Dinge.',
    'Die Stufen führen von der Grundbeziehung über Kennzahlen wie Volatilität, maximalen Drawdown und Sharpe-Ratio bis zur Frage, wie sich eine persönliche Risikotragfähigkeit von der Risikobereitschaft unterscheidet.',
  ],
  keywords: [
    'Risiko',
    'Rendite',
    'Volatilität',
    'Drawdown',
    'Schwankung',
    'Anlagehorizont',
    'Risikotragfähigkeit',
    'Sharpe-Ratio',
  ],
  related: ['aktien-laender-branchen', 'portfolio-aufbau', 'groesste-crashes', 'aktie'],
  calculators: ['/rechner/zinsrechner'],
  symbols: ['msci-world', 'dax'],
  levels: {
    beginner: {
      metaTitle: 'Risiko und Rendite einfach erklärt',
      metaDescription:
        'Warum es keine hohe Rendite ohne Risiko gibt, welche Risikoarten es gibt und was Schwankung im Depot praktisch bedeutet.',
      title: 'Risiko und Rendite einfach erklärt',
      lead: 'Warum beide immer zusammengehören und welche Arten von Risiko es überhaupt gibt.',
      readingMinutes: 8,
      sections: [
        {
          heading: 'Die Grundbeziehung',
          points: [
            'Rendite ist die Entschädigung für übernommenes Risiko, nicht eine Belohnung für Klugheit.',
            'Warum ein risikoloser hoher Zins nicht existieren kann – jemand müsste ihn bezahlen.',
            'Der risikolose Zins als Ausgangspunkt, Risikoprämie als Aufschlag darauf.',
            'Prüffrage bei jedem Angebot: Wofür genau werde ich hier bezahlt?',
          ],
        },
        {
          heading: 'Vier verschiedene Risiken',
          points: [
            'Kursrisiko: Der Wert schwankt, ohne dass etwas verloren ist.',
            'Ausfallrisiko: Der Schuldner zahlt nicht zurück – der Verlust ist endgültig.',
            'Liquiditätsrisiko: Verkaufen ist nur mit Abschlag oder gar nicht möglich.',
            'Zeitpunktrisiko: Man muss verkaufen, wenn die Kurse gerade unten sind.',
          ],
        },
        {
          heading: 'Was Schwankung im Alltag heißt',
          points: [
            'Ein Minus von 30 Prozent braucht ein Plus von rund 43 Prozent zum Ausgleich.',
            'Buchverlust gegen realisierten Verlust – der Unterschied liegt in der Entscheidung.',
            'Warum der Anlagehorizont die wichtigste Angabe vor jedem Kauf ist.',
            'Geld, das in weniger als fünf Jahren gebraucht wird, gehört nicht in den Aktienmarkt.',
          ],
        },
      ],
    },
    fortgeschritten: {
      metaTitle: 'Volatilität, Drawdown und Kennzahlen für Fortgeschrittene',
      metaDescription:
        'Wie Volatilität berechnet wird, was der maximale Drawdown aussagt, wie Korrelation Risiko senkt und warum Standardabweichung nicht alles erfasst.',
      title: 'Risiko messen',
      lead: 'Welche Kennzahlen es gibt, was sie leisten und wo sie in die Irre führen.',
      readingMinutes: 11,
      sections: [
        {
          heading: 'Die gängigen Kennzahlen',
          points: [
            'Volatilität als Standardabweichung der Renditen – Berechnung und Aussage.',
            'Maximaler Drawdown: der größte Rückgang vom Hoch zum Tief und die Erholungsdauer.',
            'Sharpe-Ratio: Überrendite je Einheit Schwankung, und ihre Grenzen.',
            'Beta als Maß für die Bewegung relativ zum Gesamtmarkt.',
          ],
        },
        {
          heading: 'Wo die Kennzahlen versagen',
          points: [
            'Standardabweichung behandelt Aufwärts- und Abwärtsbewegung gleich.',
            'Normalverteilung als Annahme: Extremereignisse treten häufiger auf als das Modell erlaubt.',
            'Historische Werte sind Vergangenheit, keine Prognose – besonders nach ruhigen Phasen.',
            'Warum eine niedrige Volatilität kein Beleg für ein niedriges Risiko ist.',
          ],
        },
        {
          heading: 'Risiko senken, ohne Rendite zu opfern',
          points: [
            'Korrelation: Wie unterschiedlich laufende Anlagen die Gesamtschwankung dämpfen.',
            'Warum Streuung als einziger Effekt gilt, der ohne Renditeverzicht auskommt.',
            'Die Grenze: In schweren Krisen steigen Korrelationen sprunghaft an.',
            'Zeit als Risikofaktor – längerer Horizont verringert die Streuung der Ergebnisse.',
          ],
        },
      ],
    },
    profi: {
      metaTitle: 'Risikotragfähigkeit und Sequenzrisiko im Detail',
      metaDescription:
        'Der Unterschied zwischen Risikobereitschaft und Risikotragfähigkeit, das Sequenzrisiko in der Entnahmephase und warum Modelle Extremrisiken unterschätzen.',
      title: 'Risikotragfähigkeit und Sonderfälle',
      lead: 'Was persönliche Umstände zum Risiko beitragen und welche Risiken in keiner Kennzahl auftauchen.',
      readingMinutes: 12,
      sections: [
        {
          heading: 'Bereitschaft gegen Tragfähigkeit',
          points: [
            'Risikobereitschaft ist eine Frage der Person, Risikotragfähigkeit eine der Bilanz.',
            'Einkommensstabilität, Beruf und Humankapital als Teil der eigenen Vermögensaufstellung.',
            'Warum eine sichere Anstellung eine höhere Aktienquote rechtfertigen kann.',
            'Die maßgebliche Größe ist die kleinere von beiden.',
          ],
        },
        {
          heading: 'Sequenzrisiko',
          points: [
            'Warum die Reihenfolge der Renditen in der Ansparphase egal, in der Entnahmephase entscheidend ist.',
            'Beispielrechnung: identische Durchschnittsrendite, unterschiedliche Reihenfolge, verschiedene Ergebnisse.',
            'Gegenmaßnahmen: Liquiditätspuffer, flexible Entnahme, sinkende Aktienquote vor Beginn.',
            'Bezug zur Rentenplanung und zur Rentenlücke.',
          ],
        },
        {
          heading: 'Was Modelle nicht erfassen',
          points: [
            'Fat Tails: Extremereignisse in realen Marktdaten gegen die Modellannahme.',
            'Modellrisiko: Wenn die Risikomessung selbst das Risiko erzeugt.',
            'Währungs-, Länder- und regulatorische Risiken jenseits der Kursschwankung.',
            'Der Umgang mit Unsicherheit, die sich nicht in eine Zahl fassen lässt.',
          ],
        },
      ],
    },
  },
})

export const anlegerpsychologie = outlineTopic({
  slug: 'anlegerpsychologie',
  title: 'Anlegerpsychologie',
  headline: 'Anlegerpsychologie: die Fehler, die nicht am Wissen liegen',
  metaTitle: 'Anlegerpsychologie: typische Denkfehler bei der Geldanlage',
  metaDescription:
    'Verlustaversion, Herdentrieb, Selbstüberschätzung und Dispositionseffekt – welche Denkmuster Anlageergebnisse verschlechtern und was dagegen tatsächlich hilft.',
  lead: 'Die meisten Anlagefehler entstehen nicht aus fehlendem Wissen, sondern aus vorhersehbaren Reaktionen auf Kursbewegungen.',
  overview: [
    'Studien zur Rendite von Privatanlegern zeigen regelmäßig eine Lücke zwischen der Wertentwicklung eines Fonds und dem, was seine Anleger tatsächlich erzielt haben. Der Unterschied entsteht durch das Verhalten: Kaufen nach Anstiegen, Verkaufen nach Rückgängen.',
    'Diese Muster sind nicht Ausdruck von Dummheit, sondern systematisch und bei allen Menschen vorhanden. Sie lassen sich nicht wegdenken – aber durch Regeln umgehen, die vor der Situation festgelegt werden.',
    'Die Stufen führen von den bekanntesten Denkfehlern über ihre Wirkung im Depot bis zu den Gegenmitteln, die empirisch etwas bringen: schriftliche Anlageregeln, Automatisierung und die bewusste Reduktion von Entscheidungsanlässen.',
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
  levels: {
    beginner: {
      metaTitle: 'Denkfehler bei der Geldanlage – Grundlagen',
      metaDescription:
        'Die häufigsten psychologischen Fallen bei Anlageentscheidungen, warum sie jeden betreffen und wie sie sich im Depot bemerkbar machen.',
      title: 'Die häufigsten Denkfehler',
      lead: 'Welche Muster bei fast allen auftreten und wie sie konkret Geld kosten.',
      readingMinutes: 8,
      sections: [
        {
          heading: 'Die vier wichtigsten Muster',
          points: [
            'Verlustaversion: Ein Verlust wiegt psychologisch etwa doppelt so schwer wie ein gleich großer Gewinn.',
            'Herdentrieb: Was viele tun, wirkt sicher – gerade dann, wenn es teuer geworden ist.',
            'Selbstüberschätzung: Die meisten halten sich für überdurchschnittlich gut informiert.',
            'Bestätigungsfehler: Man liest bevorzugt, was die eigene Meinung stützt.',
          ],
        },
        {
          heading: 'Wie sich das im Depot zeigt',
          points: [
            'Dispositionseffekt: Gewinner werden zu früh verkauft, Verlierer zu lange gehalten.',
            'Kaufen nach Anstiegen, Verkaufen nach Rückgängen – das genaue Gegenteil des Ziels.',
            'Der Einstandskurs als Bezugspunkt, obwohl er für die Zukunft bedeutungslos ist.',
            'Die Renditelücke zwischen Fondsergebnis und Anlegerergebnis.',
          ],
        },
        {
          heading: 'Warum Wissen allein nicht hilft',
          points: [
            'Die Muster verschwinden nicht, wenn man sie kennt – sie werden nur erkennbar.',
            'Unter Stress und Zeitdruck greifen sie zuverlässig.',
            'Deshalb Regeln vorher festlegen, nicht Entscheidungen im Moment verbessern.',
            'Der Sparplan als praktischer Ausweg: Er nimmt die Entscheidung heraus.',
          ],
        },
      ],
    },
    fortgeschritten: {
      metaTitle: 'Behavioral Finance: Mechanismen und Gegenmittel',
      metaDescription:
        'Ankereffekt, Recency Bias, Verfügbarkeitsheuristik und mentale Buchführung – wie sie entstehen und welche Gegenmaßnahmen belegt wirksam sind.',
      title: 'Mechanismen und Gegenmittel',
      lead: 'Die Denkfehler im Einzelnen, ihre Ursachen und was empirisch dagegen hilft.',
      readingMinutes: 11,
      sections: [
        {
          heading: 'Weitere Muster',
          points: [
            'Ankereffekt: Die erste gesehene Zahl bestimmt die spätere Einschätzung.',
            'Recency Bias: Die jüngste Entwicklung wird in die Zukunft verlängert.',
            'Verfügbarkeitsheuristik: Was medial präsent ist, wird für wahrscheinlich gehalten.',
            'Mentale Buchführung: Geld wird je nach Herkunft unterschiedlich behandelt.',
          ],
        },
        {
          heading: 'Home Bias und Vertrautheit',
          points: [
            'Übergewichtung heimischer Aktien, weil sie vertraut wirken.',
            'Vertrautheit wird mit Sicherheit verwechselt – ohne jeden Zusammenhang.',
            'Mitarbeiteraktien: Klumpenrisiko aus Arbeitsplatz und Depot in derselben Firma.',
            'Gegenmaßnahme über breite Streuung, nicht über bessere Auswahl.',
          ],
        },
        {
          heading: 'Was tatsächlich hilft',
          points: [
            'Schriftliche Anlageregeln vor dem ersten Kauf – als Vertrag mit sich selbst.',
            'Automatisierung: Sparplan, feste Termine, festgelegte Rebalancing-Regeln.',
            'Depot seltener ansehen: Häufiges Prüfen erhöht nachweislich die Handelsaktivität.',
            'Entscheidungen mit Datum und Begründung protokollieren, um sich später zu prüfen.',
          ],
        },
      ],
    },
    profi: {
      metaTitle: 'Marktphänomene und die Grenzen der Rationalität',
      metaDescription:
        'Von Blasenbildung über Momentum bis zur Frage, ob sich Verhaltensmuster systematisch ausnutzen lassen – und warum das schwerer ist, als es klingt.',
      title: 'Psychologie auf Marktebene',
      lead: 'Wo individuelle Muster zu Marktphänomenen werden und was sich daraus praktisch ableiten lässt.',
      readingMinutes: 11,
      sections: [
        {
          heading: 'Vom Einzelnen zum Markt',
          points: [
            'Blasenbildung: Selbstverstärkung aus Herdentrieb, Kredit und Erzählung.',
            'Panikverkäufe und Liquiditätsspiralen in Abwärtsphasen.',
            'Narrative Economics: Wie Erzählungen Kurse bewegen, unabhängig von Zahlen.',
            'Historische Beispiele und ihre wiederkehrende Struktur.',
          ],
        },
        {
          heading: 'Anomalien und ihre Ausnutzung',
          points: [
            'Momentum- und Value-Effekt als mögliche Folgen von Verhaltensmustern.',
            'Warum bekannte Anomalien nach Veröffentlichung häufig schwächer werden.',
            'Transaktionskosten und Steuern als Grund, warum Strategien in der Praxis scheitern.',
            'Effizienzmarkthypothese und ihre verhaltensökonomische Kritik.',
          ],
        },
        {
          heading: 'Selbsteinschätzung ehrlich betreiben',
          points: [
            'Rückschaufehler: Nach dem Ereignis wirkt alles vorhersehbar gewesen zu sein.',
            'Führen eines Anlagetagebuchs als Korrektiv gegen Rückschaufehler.',
            'Realistische Beurteilung der eigenen Ergebnisse gegen einen passenden Vergleichsindex.',
            'Die nüchterne Schlussfolgerung: Die meisten schlagen den Markt nicht – und das ist kein Problem.',
          ],
        },
      ],
    },
  },
})

export const schuldenUndKredit = outlineTopic({
  slug: 'schulden-und-kredit',
  title: 'Schulden & Kredit',
  headline: 'Schulden und Kredit: der Zinseszins in die andere Richtung',
  metaTitle: 'Kredit und Schulden: Effektivzins, Tilgung und Reihenfolge',
  metaDescription:
    'Wie Kredite wirklich rechnen, was der Effektivzins enthält, warum Dispo und Ratenkredit so teuer sind und in welcher Reihenfolge Schulden getilgt werden sollten.',
  lead: 'Ein Kredit ist Zinseszins mit umgekehrtem Vorzeichen – und meist zu einem Satz, den keine Geldanlage erreicht.',
  overview: [
    'Vor jeder Anlageentscheidung steht die Frage nach bestehenden Schulden. Ein Dispositionskredit zu zweistelligem Zins schlägt jede realistisch erwartbare Anlagerendite – die Tilgung ist dann die beste verfügbare Geldanlage.',
    'Der entscheidende Vergleichswert ist der Effektivzins: Er enthält neben dem Nominalzins auch Gebühren und den Zahlungsrhythmus und macht Angebote überhaupt erst vergleichbar.',
    'Die Stufen führen von den Kreditarten und ihren Kosten über Tilgungsrechnung, Sondertilgung und Umschuldung bis zu Restschuldversicherungen, Vorfälligkeitsentschädigung und dem Verhältnis von Tilgung zu Geldanlage.',
  ],
  keywords: [
    'Kredit',
    'Schulden',
    'Effektivzins',
    'Tilgung',
    'Dispokredit',
    'Ratenkredit',
    'Umschuldung',
    'Sondertilgung',
  ],
  related: ['zinseszins', 'immobilien', 'budget-und-sparquote', 'tagesgeld'],
  calculators: ['/rechner/haushaltsrechner', '/rechner/zinsrechner'],
  levels: {
    beginner: {
      metaTitle: 'Kredite einfach erklärt – Zinsen, Raten, Kosten',
      metaDescription:
        'Welche Kreditarten es gibt, was der Effektivzins bedeutet, warum der Dispo so teuer ist und wie eine Rate sich aus Zins und Tilgung zusammensetzt.',
      title: 'Kredite einfach erklärt',
      lead: 'Wie ein Kredit rechnet, welche Arten es gibt und woran sich die tatsächlichen Kosten ablesen lassen.',
      readingMinutes: 8,
      sections: [
        {
          heading: 'Die Kreditarten',
          points: [
            'Dispositionskredit: teuerste Alltagsform, oft im zweistelligen Zinsbereich.',
            'Ratenkredit: feste Laufzeit, feste Rate, planbar – aber selten günstig.',
            'Null-Prozent-Finanzierung: Wo die Kosten stattdessen versteckt sind.',
            'Immobilienkredit als eigener Fall mit Grundschuld als Sicherheit.',
          ],
        },
        {
          heading: 'Was eine Rate enthält',
          points: [
            'Jede Rate besteht aus Zinsanteil und Tilgungsanteil.',
            'Am Anfang überwiegt der Zins, mit sinkender Restschuld dreht sich das Verhältnis.',
            'Warum eine niedrige Rate die Gesamtkosten erhöht, nicht senkt.',
            'Laufzeit ist der Hebel mit der größten Wirkung auf die Gesamtkosten.',
          ],
        },
        {
          heading: 'Der einzige vergleichbare Wert',
          points: [
            'Effektivzins enthält Nominalzins, Gebühren und Zahlungsrhythmus.',
            'Warum der Nominalzins in der Werbung wenig aussagt.',
            'Bonitätsabhängige Zinsen: Was „ab 2,9 Prozent“ tatsächlich bedeutet.',
            'Vorsicht bei Kreditvergleichen, die die Schufa-Anfrage als Kreditanfrage stellen.',
          ],
        },
      ],
    },
    fortgeschritten: {
      metaTitle: 'Tilgung, Umschuldung und Sondertilgung in der Praxis',
      metaDescription:
        'Wie Tilgungspläne funktionieren, wann sich eine Umschuldung rechnet, was Sondertilgungen bringen und in welcher Reihenfolge mehrere Kredite abzulösen sind.',
      title: 'Schulden gezielt abbauen',
      lead: 'Wie ein Tilgungsplan aufgebaut ist, welche Reihenfolge sinnvoll ist und wann sich eine Umschuldung lohnt.',
      readingMinutes: 10,
      sections: [
        {
          heading: 'Tilgungsplan lesen',
          points: [
            'Annuitätendarlehen: gleichbleibende Rate bei wechselnder Zusammensetzung.',
            'Restschuld am Ende der Zinsbindung und das Anschlussfinanzierungsrisiko.',
            'Wirkung eines um einen Prozentpunkt höheren Tilgungssatzes auf die Laufzeit.',
            'Sondertilgungsrechte: Umfang, Fristen und ihr tatsächlicher Wert.',
          ],
        },
        {
          heading: 'Reihenfolge bei mehreren Schulden',
          points: [
            'Lawinenmethode: höchster Zins zuerst – rechnerisch immer die günstigste Variante.',
            'Schneeballmethode: kleinster Betrag zuerst – psychologisch oft durchhaltbarer.',
            'Dispo immer zuerst, unabhängig von der Methode.',
            'Warum parallel angelegtes Geld bei hohem Kreditzins ein Verlustgeschäft ist.',
          ],
        },
        {
          heading: 'Umschulden',
          points: [
            'Ablösung teurer Kredite durch einen günstigeren – Rechnung mit allen Kosten.',
            'Vorfälligkeitsentschädigung: wann sie anfällt und wie sie berechnet wird.',
            'Widerrufsjoker und gesetzliche Kündigungsrechte nach zehn Jahren.',
            'Restschuldversicherung: Kosten, Nutzen und die Frage der Freiwilligkeit.',
          ],
        },
      ],
    },
    profi: {
      metaTitle: 'Tilgen oder anlegen? Die Entscheidung im Detail',
      metaDescription:
        'Steuerliche Behandlung von Kreditzinsen, Leverage-Effekt, Risikobetrachtung und die Frage, ab welchem Zinsniveau Tilgen der Geldanlage vorzuziehen ist.',
      title: 'Tilgen oder anlegen',
      lead: 'Wie sich Tilgung und Anlage sauber vergleichen lassen – und warum die Antwort selten am reinen Zinsvergleich hängt.',
      readingMinutes: 11,
      sections: [
        {
          heading: 'Der korrekte Vergleich',
          points: [
            'Tilgung bringt eine risikolose Rendite in Höhe des Kreditzinses.',
            'Anlagerendite ist unsicher – der Vergleich muss risikoadjustiert erfolgen.',
            'Nach Steuern rechnen: Kapitalerträge werden besteuert, ersparte Zinsen nicht.',
            'Daumenregel und ihre Grenzen: Ab welchem Zinssatz die Tilgung praktisch immer gewinnt.',
          ],
        },
        {
          heading: 'Steuer und Sonderfälle',
          points: [
            'Absetzbarkeit von Schuldzinsen bei vermieteten Immobilien.',
            'Warum bei selbstgenutzten Immobilien keine Absetzbarkeit besteht.',
            'Modernisierungs- und Förderkredite mit Zinsverbilligung.',
            'Bausparvertrag als Zinssicherung – Rechenweise und typische Fehleinschätzung.',
          ],
        },
        {
          heading: 'Kredit als Hebel',
          points: [
            'Leverage-Effekt: Wie Fremdkapital die Eigenkapitalrendite erhöht – und den Verlust.',
            'Wertpapierkredit und Lombardkredit: Nachschusspflicht und Zwangsverkauf.',
            'Warum eine Anlage auf Kredit in Abschwüngen zwei Risiken gleichzeitig auslöst.',
            'Grenzen der Verschuldung aus der eigenen Einkommens- und Liquiditätslage.',
          ],
        },
      ],
    },
  },
})

export const notenbankenGeldpolitik = outlineTopic({
  slug: 'notenbanken-geldpolitik',
  title: 'Notenbanken & Geldpolitik',
  headline: 'Notenbanken: warum ein Zinsentscheid dein Depot erreicht',
  metaTitle: 'Notenbanken und Geldpolitik: EZB, Fed und die Leitzinsen',
  metaDescription:
    'Welche Aufgaben EZB und Fed haben, wie die drei Leitzinsen wirken, was Anleihekäufe bewirken und über welche Wege Geldpolitik bei Sparern und Anlegern ankommt.',
  lead: 'Notenbanken setzen den Preis des Geldes – und damit die Messlatte für jede Anlage, jeden Kredit und jeden Sparzins.',
  overview: [
    'Die Europäische Zentralbank hat ein vorrangiges Ziel: Preisstabilität, definiert als eine Inflationsrate von zwei Prozent auf mittlere Sicht. Die US-Notenbank verfolgt zusätzlich ein Beschäftigungsziel – dieser Unterschied erklärt viele abweichende Entscheidungen.',
    'Das wichtigste Werkzeug sind die Leitzinsen. Für Sparer ist der Einlagensatz maßgeblich: Er bestimmt, was Banken für über Nacht geparktes Geld erhalten, und damit die Obergrenze für Tagesgeldangebote.',
    'Die Stufen führen von den Aufgaben und Instrumenten über den Transmissionsmechanismus und die unkonventionelle Geldpolitik bis zu Bilanzpolitik, Unabhängigkeit und der Wirkung auf Wechselkurse und Anlageklassen.',
  ],
  keywords: [
    'Notenbank',
    'EZB',
    'Fed',
    'Leitzins',
    'Einlagenzins',
    'Geldpolitik',
    'Zinsentscheid',
    'Quantitative Lockerung',
  ],
  related: ['inflation', 'tagesgeld', 'staatsanleihe', 'waehrungen-wechselkurse'],
  symbols: ['eur-usd'],
  levels: {
    beginner: {
      metaTitle: 'Notenbanken einfach erklärt – Aufgaben und Leitzinsen',
      metaDescription:
        'Was eine Notenbank tut, welche drei Leitzinsen die EZB setzt, welcher davon für Sparer zählt und wie ein Zinsentscheid abläuft.',
      title: 'Notenbanken einfach erklärt',
      lead: 'Welche Aufgabe eine Notenbank hat, welche Zinsen sie setzt und welcher davon dein Tagesgeld bestimmt.',
      readingMinutes: 8,
      sections: [
        {
          heading: 'Aufgabe und Auftrag',
          points: [
            'Preisstabilität als vorrangiges Ziel der EZB: zwei Prozent auf mittlere Sicht.',
            'Doppelmandat der US-Notenbank: Preisstabilität und maximale Beschäftigung.',
            'Unabhängigkeit von der Politik und warum sie als Voraussetzung gilt.',
            'Abgrenzung: Notenbanken drucken kein Geld für den Staatshaushalt.',
          ],
        },
        {
          heading: 'Die drei Leitzinsen',
          points: [
            'Einlagesatz: Was Banken für über Nacht geparktes Geld erhalten – der Satz für Sparer.',
            'Hauptrefinanzierungssatz: Zu diesem Satz leihen sich Banken wöchentlich Geld.',
            'Spitzenrefinanzierungssatz: teurer Notfallsatz für kurzfristigen Bedarf.',
            'Warum in Meldungen meist der Einlagesatz gemeint ist, wenn von „dem Leitzins“ die Rede ist.',
          ],
        },
        {
          heading: 'Wie ein Zinsentscheid abläuft',
          points: [
            'Sitzungsrhythmus von EZB-Rat und FOMC, Veröffentlichung und Pressekonferenz.',
            'Warum die Erwartung wichtiger ist als die Entscheidung selbst.',
            'Projektionen und Dot Plot als Signal über den weiteren Kurs.',
            'Forward Guidance: Wirkung allein durch Ankündigung.',
          ],
        },
      ],
    },
    fortgeschritten: {
      metaTitle: 'Transmission: Wie Geldpolitik in der Wirtschaft ankommt',
      metaDescription:
        'Über welche Kanäle ein Zinsschritt wirkt, warum die Wirkung Monate braucht, was Anleihekäufe bewirken und wie Geldpolitik auf Wechselkurse durchschlägt.',
      title: 'Vom Zinsentscheid zur Wirkung',
      lead: 'Welche Wege ein Leitzinsschritt nimmt, wie lange er braucht und welche Instrumente es neben dem Zins gibt.',
      readingMinutes: 11,
      sections: [
        {
          heading: 'Die Übertragungswege',
          points: [
            'Zinskanal: Kredite und Einlagen verteuern oder verbilligen sich.',
            'Kreditkanal: Banken verändern Vergabebereitschaft und Bedingungen.',
            'Vermögenspreiskanal: Bewertungen von Aktien, Anleihen und Immobilien passen sich an.',
            'Wechselkurskanal: Zinsdifferenzen lenken internationale Kapitalströme.',
          ],
        },
        {
          heading: 'Zeitverzögerung',
          points: [
            'Wirkung auf die Inflation erst nach etwa vier bis sechs Quartalen.',
            'Warum Notenbanken auf Prognosen und nicht auf aktuelle Daten reagieren müssen.',
            'Risiko der Übersteuerung, wenn zu lange nachgesteuert wird.',
            'Asymmetrie: Banken geben sinkende Zinsen schneller weiter als steigende.',
          ],
        },
        {
          heading: 'Instrumente jenseits des Zinses',
          points: [
            'Quantitative Lockerung: Anleihekäufe und ihre Wirkung auf lange Laufzeiten.',
            'Quantitative Straffung: Bilanzabbau und seine Nebenwirkungen.',
            'Langfristige Refinanzierungsgeschäfte für Banken.',
            'Mindestreserve und ihre heute geringe praktische Bedeutung.',
          ],
        },
      ],
    },
    profi: {
      metaTitle: 'Geldpolitik: Bilanzpolitik, Regeln und Zielkonflikte',
      metaDescription:
        'Taylor-Regel, natürlicher Zins, Bilanzpolitik, fiskalische Dominanz und die Frage, wie Anleger geldpolitische Signale einordnen sollten.',
      title: 'Zielkonflikte und Grenzen',
      lead: 'Welche Regeln und Größen hinter Zinsentscheidungen stehen und wo Geldpolitik an ihre Grenzen stößt.',
      readingMinutes: 12,
      sections: [
        {
          heading: 'Regeln und Referenzgrößen',
          points: [
            'Taylor-Regel als Faustformel für einen angemessenen Leitzins.',
            'Natürlicher Zins: das theoretische Niveau, das weder bremst noch stimuliert.',
            'Output-Lücke und Phillips-Kurve als Bezugsgrößen – und ihre empirische Schwäche.',
            'Warum Notenbanken sich an keine Regel binden, sie aber als Orientierung nutzen.',
          ],
        },
        {
          heading: 'Grenzen und Konflikte',
          points: [
            'Nullzinsgrenze und die Suche nach Wirkung ohne Zinssenkungsspielraum.',
            'Fiskalische Dominanz: hohe Staatsschulden als Beschränkung der Zinspolitik.',
            'Finanzstabilität gegen Preisstabilität als Zielkonflikt.',
            'Fragmentierung im Euroraum und Instrumente dagegen.',
          ],
        },
        {
          heading: 'Was Anleger daraus machen',
          points: [
            'Zinserwartungen sind bereits in Kursen enthalten – bewegt wird nur die Abweichung.',
            'Wirkung auf Anleihen über die Duration, auf Aktien über die Abzinsung.',
            'Warum Notenbanksitzungen als Erklärung taugen, nicht als Handelssignal.',
            'Beobachtbare Größen: Zinsstrukturkurve, Break-even-Inflation, Terminmärkte.',
          ],
        },
      ],
    },
  },
})

export const depotUndBroker = outlineTopic({
  slug: 'depot-und-broker',
  title: 'Depot & Broker',
  headline: 'Depot und Broker: der Weg vom Entschluss zur Order',
  metaTitle: 'Depot eröffnen: Broker vergleichen, Order richtig aufgeben',
  metaDescription:
    'Wie ein Wertpapierdepot funktioniert, worin sich Broker unterscheiden, welche Ordertypen es gibt und welche Kosten beim Kauf tatsächlich anfallen.',
  lead: 'Zwischen der Entscheidung und dem gekauften Wertpapier liegt ein Depot, ein Handelsplatz und eine Order – und in jedem Schritt stecken Kosten.',
  overview: [
    'Ein Depot ist ein Konto für Wertpapiere. Die Wertpapiere selbst gehören dir und sind kein Vermögen der Bank – bei einer Insolvenz des Brokers werden sie herausgegeben und fallen nicht in die Insolvenzmasse.',
    'Die Unterschiede zwischen Anbietern liegen weniger im Depotpreis als in den Ordergebühren, den verfügbaren Handelsplätzen, dem Sparplanangebot und der steuerlichen Abwicklung – Letztere spart bei einem deutschen Anbieter erheblich Aufwand.',
    'Die Stufen führen von der Depoteröffnung über Ordertypen, Handelszeiten und Spreads bis zu Wertpapierleihe, Payment for Order Flow, Depotübertrag und den Besonderheiten ausländischer Anbieter.',
  ],
  keywords: [
    'Depot',
    'Broker',
    'Order',
    'Limit-Order',
    'Handelsplatz',
    'Ordergebühren',
    'Depotübertrag',
    'Spread',
  ],
  related: ['boerse', 'wie-funktioniert-der-markt', 'kosten-und-gebuehren', 'etf'],
  levels: {
    beginner: {
      metaTitle: 'Depot eröffnen – Grundlagen für Einsteiger',
      metaDescription:
        'Was ein Depot ist, wie die Eröffnung abläuft, warum Wertpapiere bei einer Brokerinsolvenz sicher sind und was beim ersten Kauf zu beachten ist.',
      title: 'Depot und Broker einfach erklärt',
      lead: 'Was ein Depot ist, wie du eines eröffnest und was beim ersten Kauf passiert.',
      readingMinutes: 8,
      sections: [
        {
          heading: 'Was ein Depot ist',
          points: [
            'Ein Konto für Wertpapiere, immer verbunden mit einem Verrechnungskonto für Geld.',
            'Die Wertpapiere gehören dir – sie sind kein Vermögen des Brokers.',
            'Bei Insolvenz des Brokers werden sie herausgegeben, nicht in die Masse gezogen.',
            'Abgrenzung zur Einlagensicherung, die nur das Guthaben auf dem Verrechnungskonto betrifft.',
          ],
        },
        {
          heading: 'Eröffnung und erste Schritte',
          points: [
            'Legitimation per Video- oder Postident, Steuer-Identifikationsnummer bereithalten.',
            'Freistellungsauftrag direkt bei der Eröffnung einrichten.',
            'Verlustverrechnung und Kirchensteuermerkmal einmal korrekt hinterlegen.',
            'Angemessenheitsprüfung: Warum der Broker nach Erfahrung fragt.',
          ],
        },
        {
          heading: 'Die erste Order',
          points: [
            'Wertpapierkennung: ISIN als eindeutige Angabe, WKN als deutsche Kurzform.',
            'Handelsplatz wählen: Börse oder außerbörslicher Handel.',
            'Stückzahl oder Betrag – und warum bei ETFs Bruchstücke möglich sind.',
            'Ausführungsbestätigung und Abrechnung lesen.',
          ],
        },
      ],
    },
    fortgeschritten: {
      metaTitle: 'Ordertypen und Handelsplätze richtig nutzen',
      metaDescription:
        'Market, Limit, Stop-Loss und Trailing-Stop im Vergleich, Unterschiede zwischen Handelsplätzen, Spread und Handelszeiten sowie der Depotübertrag.',
      title: 'Ordertypen, Handelsplätze, Kosten',
      lead: 'Welche Orderarten es gibt, wann welcher Handelsplatz sinnvoll ist und wie sich die Gesamtkosten zusammensetzen.',
      readingMinutes: 11,
      sections: [
        {
          heading: 'Ordertypen',
          points: [
            'Market-Order: sofortige Ausführung zum nächsten Kurs – Risiko bei dünnem Handel.',
            'Limit-Order: Preisobergrenze beim Kauf, Untergrenze beim Verkauf.',
            'Stop-Loss und Stop-Buy: Auslöseschwelle, danach Market-Order.',
            'Trailing-Stop und Gültigkeitsdauer: taggültig gegen ultimo.',
          ],
        },
        {
          heading: 'Handelsplätze im Vergleich',
          points: [
            'Xetra als Referenzmarkt mit der höchsten Liquidität.',
            'Regionalbörsen und außerbörsliche Handelsplätze: längere Zeiten, andere Spreads.',
            'Warum der Spread oft mehr kostet als die Ordergebühr.',
            'Handelszeiten vermeiden, in denen der Referenzmarkt geschlossen ist.',
          ],
        },
        {
          heading: 'Kosten und Wechsel',
          points: [
            'Ordergebühr, Handelsplatzentgelt, Spread und Fremdkostenpauschale getrennt betrachten.',
            'Sparplanausführung: Kosten je Ausführung und Mindestbeträge.',
            'Depotübertrag ist gesetzlich kostenfrei – Ablauf und typische Verzögerungen.',
            'Beim Übertrag mitwandernde Anschaffungsdaten und die Folgen bei Lücken.',
          ],
        },
      ],
    },
    profi: {
      metaTitle: 'Broker-Modelle, Wertpapierleihe und Sonderfälle',
      metaDescription:
        'Payment for Order Flow, Wertpapierleihe, ausländische Broker mit Quellensteuerthemen und was bei einer Brokerinsolvenz tatsächlich passiert.',
      title: 'Geschäftsmodelle und Sonderfälle',
      lead: 'Woran Broker verdienen, welche Nebenwirkungen das hat und was bei Auslandsdepots zu beachten ist.',
      readingMinutes: 11,
      sections: [
        {
          heading: 'Woran der Broker verdient',
          points: [
            'Payment for Order Flow: Rückvergütung durch den Handelsplatz und der Interessenkonflikt.',
            'Zinsmarge auf Guthaben des Verrechnungskontos.',
            'Wertpapierleihe: Erträge, Sicherheiten und das verbleibende Restrisiko.',
            'Best-Execution-Pflicht und wie sich ihre Einhaltung prüfen lässt.',
          ],
        },
        {
          heading: 'Ausländische Anbieter',
          points: [
            'Keine automatische Abgeltungssteuer – Erklärungspflicht über die Anlage KAP.',
            'Quellensteuer und Doppelbesteuerungsabkommen bei ausländischen Dividenden.',
            'Verlustverrechnung über Ländergrenzen und ihre praktischen Hürden.',
            'Anlegerentschädigung im Sitzland statt deutscher Regelung.',
          ],
        },
        {
          heading: 'Wenn etwas schiefgeht',
          points: [
            'Ablauf bei Brokerinsolvenz: Herausgabe der Wertpapiere, Zeitverzug, Sperrfristen.',
            'Sammelverwahrung gegen Streifbandverwahrung – rechtliche Stellung im Vergleich.',
            'Beschwerdewege: Ombudsstelle, BaFin, Schlichtung.',
            'Warum ein zweites Depot bei einem unabhängigen Anbieter Sinn ergeben kann.',
          ],
        },
      ],
    },
  },
})

export const waehrungenWechselkurse = outlineTopic({
  slug: 'waehrungen-wechselkurse',
  title: 'Währungen & Wechselkurse',
  headline: 'Währungen: das unsichtbare Risiko im weltweit gestreuten Depot',
  metaTitle: 'Wechselkurse verstehen: Währungsrisiko im Depot',
  metaDescription:
    'Wie Wechselkurse entstehen, warum ein weltweit streuender ETF immer auch eine Währungswette enthält und wann sich eine Währungsabsicherung lohnt.',
  lead: 'Wer weltweit anlegt, hält automatisch fremde Währungen – auch dann, wenn der ETF in Euro notiert.',
  overview: [
    'Ein Wechselkurs ist der Preis einer Währung in einer anderen. Er entsteht am größten Markt der Welt, an dem täglich ein Vielfaches des Welthandelsvolumens umgesetzt wird.',
    'Für Privatanleger ist der wichtigste Punkt oft überraschend: Die Handelswährung eines ETF sagt nichts über sein Währungsrisiko. Entscheidend ist, in welchen Währungen die enthaltenen Unternehmen wirtschaften.',
    'Die Stufen führen von der Notation und den Einflussfaktoren über Kaufkraftparität und Zinsparität bis zur Frage, ob eine Währungsabsicherung ihre Kosten wert ist – und wann sie sogar schadet.',
  ],
  keywords: [
    'Wechselkurs',
    'Währungsrisiko',
    'Devisen',
    'Euro',
    'US-Dollar',
    'Hedging',
    'Kaufkraftparität',
  ],
  related: ['aktien-laender-branchen', 'etf', 'notenbanken-geldpolitik', 'rohstoffe'],
  symbols: ['eur-usd', 'eur-chf', 'eur-gbp', 'eur-jpy', 'eur-cny'],
  levels: {
    beginner: {
      metaTitle: 'Wechselkurse einfach erklärt – Grundlagen',
      metaDescription:
        'Wie ein Wechselkurs zu lesen ist, was ihn bewegt und warum er die Rendite ausländischer Anlagen verändert, ohne dass sich der Kurs bewegt.',
      title: 'Wechselkurse einfach erklärt',
      lead: 'Wie ein Wechselkurs entsteht, was ihn bewegt und wie er in deiner Rendite auftaucht.',
      readingMinutes: 7,
      sections: [
        {
          heading: 'Einen Kurs lesen',
          points: [
            'EUR/USD 1,10 bedeutet: ein Euro kostet 1,10 US-Dollar.',
            'Steigender Kurs heißt starker Euro, fallender Kurs heißt starker Dollar.',
            'Geld- und Briefkurs, Spread und der Aufschlag beim Umtausch am Schalter.',
            'Warum Reisezahlungsmittel andere Kurse haben als der Devisenmarkt.',
          ],
        },
        {
          heading: 'Was Kurse bewegt',
          points: [
            'Zinsdifferenzen zwischen Währungsräumen als stärkster kurzfristiger Treiber.',
            'Inflationsunterschiede und Kaufkraft auf lange Sicht.',
            'Handelsbilanz und Kapitalströme.',
            'Sichere Häfen in Krisen: Franken, Dollar und Yen.',
          ],
        },
        {
          heading: 'Wirkung auf dein Depot',
          points: [
            'Ein stärkerer Euro senkt den Eurowert von Dollar-Anlagen – ohne Kursbewegung dort.',
            'Rechenbeispiel: Kurs unverändert, Wechselkurs verändert, Rendite verändert.',
            'Die Handelswährung eines ETF ist nicht sein Währungsrisiko.',
            'Warum ein in Euro notierter Welt-ETF trotzdem stark dollarabhängig ist.',
          ],
        },
      ],
    },
    fortgeschritten: {
      metaTitle: 'Währungsrisiko und Absicherung für Fortgeschrittene',
      metaDescription:
        'Wie hedged Share Classes funktionieren, was sie kosten, wann sich eine Absicherung lohnt und warum sie bei Aktien seltener sinnvoll ist als bei Anleihen.',
      title: 'Währungsrisiko steuern',
      lead: 'Wie eine Absicherung funktioniert, was sie kostet und in welchen Fällen sie sich rechnet.',
      readingMinutes: 10,
      sections: [
        {
          heading: 'Absicherung verstehen',
          points: [
            'Hedged Share Class: laufende Absicherung über Terminkontrakte.',
            'Kosten der Absicherung entsprechen im Kern der Zinsdifferenz beider Währungen.',
            'Warum eine Absicherung bei negativer Zinsdifferenz teuer wird.',
            'Tracking-Differenz zwischen abgesicherter und unabgesicherter Variante.',
          ],
        },
        {
          heading: 'Wann sie sinnvoll ist',
          points: [
            'Anleihen: Währungsschwankung übersteigt die erwartete Rendite deutlich – Absicherung üblich.',
            'Aktien: Schwankung des Aktienmarktes dominiert, Absicherung meist verzichtbar.',
            'Anlagehorizont: Je länger, desto eher gleichen sich Währungseffekte aus.',
            'Entnahmephase: Absicherung gewinnt an Bedeutung, wenn Beträge fest geplant sind.',
          ],
        },
        {
          heading: 'Verdeckte Währungseffekte',
          points: [
            'Unternehmenswährung gegen Notierungswährung: Was zählt, ist der Umsatz.',
            'Schwellenländer: Lokalwährungsanleihen gegen Hartwährungsanleihen.',
            'Rohstoffe notieren in Dollar – auch das ist eine Währungsposition.',
            'Aggregierte Währungsaufteilung des eigenen Depots ermitteln.',
          ],
        },
      ],
    },
    profi: {
      metaTitle: 'Devisenmarkt: Paritäten, Carry und Interventionen',
      metaDescription:
        'Kaufkraftparität, gedeckte und ungedeckte Zinsparität, Carry-Trades und die Rolle von Notenbankinterventionen und Währungsreserven.',
      title: 'Theorien und Marktmechanik',
      lead: 'Welche Modelle den Wechselkurs erklären wollen, wo sie funktionieren und wo sie versagen.',
      readingMinutes: 11,
      sections: [
        {
          heading: 'Die Paritätsbedingungen',
          points: [
            'Kaufkraftparität: gleiche Güter, gleicher Preis – langfristige Tendenz, kurzfristig unbrauchbar.',
            'Gedeckte Zinsparität als Arbitragebedingung am Terminmarkt.',
            'Ungedeckte Zinsparität und ihr empirisches Scheitern.',
            'Das Forward-Premium-Puzzle als Grundlage des Carry-Trades.',
          ],
        },
        {
          heading: 'Marktstruktur',
          points: [
            'Kassa-, Termin- und Swapmarkt: Größenordnungen und Teilnehmer.',
            'Handelszeiten rund um die Uhr und die Liquiditätsverteilung über den Tag.',
            'Notenbankinterventionen: Wirkung, Grenzen und historische Beispiele.',
            'Währungsreserven und ihre Rolle für Wechselkursbindungen.',
          ],
        },
        {
          heading: 'Steuer und Praxis',
          points: [
            'Behandlung von Fremdwährungsguthaben und Währungsgewinnen im Privatvermögen.',
            'Fremdwährungskonten: Nutzen, Kosten und steuerliche Dokumentation.',
            'Währungsrisiko in der Ruhestandsplanung mit Auslandsbezug.',
            'Warum die einfachste Absicherung darin besteht, in der eigenen Verbrauchswährung zu planen.',
          ],
        },
      ],
    },
  },
})

export const portfolioAufbau = outlineTopic({
  slug: 'portfolio-aufbau',
  title: 'Portfolio-Aufbau',
  headline: 'Portfolio-Aufbau: aus einzelnen Bausteinen wird ein Depot',
  metaTitle: 'Portfolio aufbauen: Aufteilung, Rebalancing, Kern-Satellit',
  metaDescription:
    'Wie eine Depotaufteilung entsteht, welche Rolle der risikoarme Anteil spielt, wie Rebalancing funktioniert und warum die Aufteilung wichtiger ist als die Auswahl.',
  lead: 'Nicht die Auswahl der einzelnen Anlage entscheidet über das Ergebnis, sondern ihre Gewichtung zueinander.',
  overview: [
    'Ein Portfolio ist mehr als eine Sammlung guter Einzelanlagen. Entscheidend ist die Aufteilung zwischen risikoarmem und risikoreichem Teil – sie bestimmt den Großteil der Schwankung und einen erheblichen Teil der Rendite.',
    'Die praktische Konsequenz ist unbequem: Die Zeit, die viele in die Auswahl des besten ETF stecken, wäre in der Frage nach der richtigen Aktienquote deutlich besser angelegt.',
    'Die Stufen führen von einfachen Zwei-Topf-Modellen über Rebalancing-Regeln und Kern-Satellit-Strukturen bis zu Entnahmestrategien, Steuerwirkung des Umschichtens und der Frage, wie sich eine Aufteilung über Lebensphasen verändern sollte.',
  ],
  keywords: [
    'Portfolio',
    'Asset Allocation',
    'Aufteilung',
    'Rebalancing',
    'Aktienquote',
    'Kern-Satellit',
    'Depotstruktur',
  ],
  related: [
    'aktien-laender-branchen',
    'risiko-und-rendite',
    'etf',
    'cost-average-sparplan',
  ],
  calculators: ['/rechner/zinsrechner', '/rechner/rentenluecke'],
  symbols: ['msci-world'],
  levels: {
    beginner: {
      metaTitle: 'Portfolio aufbauen – Grundlagen für Einsteiger',
      metaDescription:
        'Warum die Aufteilung wichtiger ist als die Auswahl, wie ein Zwei-Topf-Modell funktioniert und wie du deine Aktienquote bestimmst.',
      title: 'Portfolio-Aufbau einfach erklärt',
      lead: 'Wie aus einzelnen Anlagen ein Depot wird und welche Entscheidung dabei die wichtigste ist.',
      readingMinutes: 8,
      sections: [
        {
          heading: 'Die eine wichtige Entscheidung',
          points: [
            'Die Aufteilung zwischen risikoarm und risikoreich bestimmt den Großteil der Schwankung.',
            'Die Auswahl einzelner Produkte wirkt deutlich weniger als ihre Gewichtung.',
            'Warum die Frage „welcher ETF“ die zweite Frage ist, nicht die erste.',
            'Sichere Anlagen sind kein Renditebremsklotz, sondern der Grund, warum man durchhält.',
          ],
        },
        {
          heading: 'Das Zwei-Topf-Modell',
          points: [
            'Topf eins: Notgroschen und kurzfristig benötigtes Geld auf dem Tagesgeldkonto.',
            'Topf zwei: langfristiges Geld breit gestreut am Aktienmarkt.',
            'Warum diese einfache Struktur die meisten Fälle abdeckt.',
            'Erst wenn Topf eins steht, wird Topf zwei befüllt.',
          ],
        },
        {
          heading: 'Die eigene Aktienquote finden',
          points: [
            'Anlagehorizont als erste Grenze: Wann wird das Geld gebraucht?',
            'Tragfähigkeit als zweite: Welcher Rückgang wäre finanziell verkraftbar?',
            'Nachtschlaf-Test: Welcher Rückgang wäre emotional durchhaltbar?',
            'Bekannte Faustregeln und warum sie nur ein Startpunkt sind.',
          ],
        },
      ],
    },
    fortgeschritten: {
      metaTitle: 'Rebalancing und Depotstruktur für Fortgeschrittene',
      metaDescription:
        'Wann und wie Rebalancing sinnvoll ist, wie Kern-Satellit-Strukturen aufgebaut werden und welche Fehler beim Kombinieren von ETFs entstehen.',
      title: 'Struktur und Rebalancing',
      lead: 'Wie ein Depot im Gleichgewicht bleibt und welche Strukturen sich in der Praxis bewährt haben.',
      readingMinutes: 11,
      sections: [
        {
          heading: 'Rebalancing',
          points: [
            'Warum ein Depot ohne Eingriff mit der Zeit riskanter wird.',
            'Kalenderregel gegen Bandbreitenregel: jährlich oder ab fünf Prozentpunkten Abweichung.',
            'Rebalancing über neue Einzahlungen statt über Verkäufe – steuerlich meist besser.',
            'Warum Rebalancing keine Renditemaschine ist, sondern Risikosteuerung.',
          ],
        },
        {
          heading: 'Strukturen',
          points: [
            'Ein-ETF-Lösung: Vorteile, Grenzen und wann sie ausreicht.',
            'Kern-Satellit: breiter Kern plus kleine bewusste Abweichungen.',
            'Regionale Gewichtung nach Marktkapitalisierung gegen BIP-Gewichtung.',
            'Faktorprämien als Satellit: Anspruch, Evidenz und Kosten.',
          ],
        },
        {
          heading: 'Typische Konstruktionsfehler',
          points: [
            'Überschneidungen: Mehrere ETFs, die dieselben Unternehmen enthalten.',
            'Verwechslung von Anzahl der Positionen mit tatsächlicher Streuung.',
            'Themen-ETFs nach starkem Lauf – Kauf am Ende der Entwicklung.',
            'Depotkomplexität, die das jährliche Rebalancing praktisch verhindert.',
          ],
        },
      ],
    },
    profi: {
      metaTitle: 'Lebenszyklus, Entnahme und Steuerwirkung im Portfolio',
      metaDescription:
        'Gleitpfade der Aktienquote, Entnahmestrategien im Ruhestand, Steuerwirkung des Umschichtens und die Frage nach dem Gesamtvermögen statt nur dem Depot.',
      title: 'Lebenszyklus und Entnahme',
      lead: 'Wie sich eine Aufteilung über Jahrzehnte verändert und was in der Entnahmephase anders gilt.',
      readingMinutes: 12,
      sections: [
        {
          heading: 'Über den Lebenszyklus',
          points: [
            'Gleitpfad: sinkende Aktienquote mit abnehmendem Horizont.',
            'Humankapital als sichere Anleihe im Gesamtvermögen der Erwerbsphase.',
            'Immobilie, Betriebsrente und gesetzliche Rente als Teil der Gesamtaufteilung.',
            'Warum das Depot allein die falsche Bezugsgröße ist.',
          ],
        },
        {
          heading: 'Entnahmephase',
          points: [
            'Feste Entnahme gegen prozentuale Entnahme gegen dynamische Regeln.',
            'Sequenzrisiko und der Cash-Puffer als Gegenmaßnahme.',
            'Eimer-Strategie: Aufteilung nach Zeithorizont der Entnahme.',
            'Warum Entnahmeraten aus historischen Studien nicht ungeprüft übertragbar sind.',
          ],
        },
        {
          heading: 'Steuern im Portfolio',
          points: [
            'Steuerstundung durch Nichtverkauf als eigener Renditebeitrag.',
            'FIFO-Prinzip und die Folgen für Teilverkäufe.',
            'Vorabpauschale und Liquiditätsbedarf beim Rebalancing.',
            'Getrennte Depots zur Steuerung der Verkaufsreihenfolge.',
          ],
        },
      ],
    },
  },
})

export const kostenUndGebuehren = outlineTopic({
  slug: 'kosten-und-gebuehren',
  title: 'Kosten & Gebühren',
  headline: 'Kosten: der einzige Faktor, den du sicher beeinflussen kannst',
  metaTitle: 'Kosten bei der Geldanlage: TER, Spread, Gebühren im Überblick',
  metaDescription:
    'Welche Kosten bei der Geldanlage anfallen, wo sie versteckt sind, wie stark sie über Jahrzehnte wirken und an welchen Stellen sich am meisten sparen lässt.',
  lead: 'Die Rendite ist unsicher, die Kosten sind es nicht – deshalb ist jeder gesparte Kostenpunkt der verlässlichste Ertrag im Depot.',
  overview: [
    'Kosten wirken jedes Jahr auf das gesamte angelegte Vermögen, nicht nur auf die neue Sparrate. Über 30 Jahre kann ein Unterschied von einem Prozentpunkt jährlich ein Viertel des Endvermögens ausmachen.',
    'Das Tückische ist die Unsichtbarkeit: Laufende Fondskosten werden täglich anteilig aus dem Fondsvermögen entnommen und tauchen auf keiner Abrechnung auf. Wer nur auf Ordergebühren achtet, sieht den kleineren Teil.',
    'Die Stufen führen von den einzelnen Kostenarten über die vollständige Erfassung der Gesamtkostenquote bis zu Rückvergütungen, Performance-Fees und der Frage, wo Sparen sinnvoll ist und wo es zulasten der Qualität geht.',
  ],
  keywords: [
    'Kosten',
    'Gebühren',
    'TER',
    'Gesamtkostenquote',
    'Ausgabeaufschlag',
    'Spread',
    'Ordergebühren',
    'Depotgebühren',
  ],
  related: ['etf', 'fonds', 'depot-und-broker', 'zinseszins'],
  calculators: ['/rechner/zinsrechner'],
  levels: {
    beginner: {
      metaTitle: 'Kosten bei der Geldanlage – Grundlagen',
      metaDescription:
        'Welche Kostenarten es gibt, wo sie anfallen, warum laufende Kosten schwerer wiegen als einmalige und wie stark sie über Jahrzehnte wirken.',
      title: 'Kosten einfach erklärt',
      lead: 'Welche Kosten es gibt, wo sie versteckt sind und warum sie so stark wirken.',
      readingMinutes: 7,
      sections: [
        {
          heading: 'Die Kostenarten',
          points: [
            'Einmalige Kosten: Ausgabeaufschlag, Ordergebühr, Handelsplatzentgelt.',
            'Laufende Kosten: Verwaltungsvergütung des Fonds, Depotgebühr.',
            'Versteckte Kosten: Spread beim Kauf und Verkauf, Transaktionskosten im Fonds.',
            'Warum laufende Kosten schwerer wiegen als einmalige.',
          ],
        },
        {
          heading: 'Die Wirkung über die Zeit',
          points: [
            'Kosten wirken auf das gesamte Vermögen, nicht nur auf die neue Rate.',
            'Rechenbeispiel über 30 Jahre bei 0,2 gegen 1,5 Prozent jährlicher Kosten.',
            'Der entgangene Zinseszins auf die entnommenen Kosten als zweiter Effekt.',
            'Selbst nachrechnen mit dem Zinsrechner statt Prozentzahlen zu vergleichen.',
          ],
        },
        {
          heading: 'Wo am meisten zu holen ist',
          points: [
            'Größter Hebel: laufende Fondskosten, weil sie jedes Jahr wirken.',
            'Zweiter Hebel: Ausgabeaufschlag – bei ETFs entfällt er ganz.',
            'Dritter Hebel: Depotgebühr, die viele Anbieter gar nicht erheben.',
            'Kleinster Hebel bei langfristiger Anlage: die einzelne Ordergebühr.',
          ],
        },
      ],
    },
    fortgeschritten: {
      metaTitle: 'Gesamtkosten ermitteln: TER, TCO und Tracking-Differenz',
      metaDescription:
        'Was die TER enthält und was nicht, wie die Tracking-Differenz die wahren Kosten eines ETF zeigt und wie sich die Gesamtkostenquote sauber berechnen lässt.',
      title: 'Die tatsächlichen Gesamtkosten',
      lead: 'Wie du alle Kosten zusammenrechnest und warum die beworbene Kostenquote nur ein Teil davon ist.',
      readingMinutes: 10,
      sections: [
        {
          heading: 'Was die TER nicht enthält',
          points: [
            'Transaktionskosten innerhalb des Fonds sind nicht Teil der TER.',
            'Performance-Fee wird gesondert ausgewiesen.',
            'Swap-Gebühren bei synthetischer Abbildung.',
            'Deshalb ist die TER eine Untergrenze, keine Gesamtangabe.',
          ],
        },
        {
          heading: 'Die aussagekräftigere Größe',
          points: [
            'Tracking-Differenz: tatsächlicher Rückstand zum Index über ein Jahr.',
            'Warum sie negativ sein kann – Erträge aus Wertpapierleihe und Quellensteueroptimierung.',
            'Mehrjahresbetrachtung statt Einzeljahr.',
            'Wo die Werte zu finden sind: Jahresbericht, unabhängige Datenbanken.',
          ],
        },
        {
          heading: 'Gesamtkosten je Anlagejahr',
          points: [
            'Formel: laufende Kosten plus anteilige Einmalkosten über die geplante Haltedauer.',
            'Spread realistisch ansetzen: Handelsplatz und Uhrzeit beeinflussen ihn stark.',
            'Sparplankosten je Ausführung auf das Jahr umrechnen.',
            'Vergleich zweier Anbieter erst nach dieser Umrechnung.',
          ],
        },
      ],
    },
    profi: {
      metaTitle: 'Kickbacks, Performance-Fees und Kostenregulierung',
      metaDescription:
        'Bestandsprovisionen, Interessenkonflikte in der Beratung, Gestaltung von Performance-Fees und die regulatorischen Vorgaben zur Kostenausweisung.',
      title: 'Vergütungsmodelle und Regulierung',
      lead: 'Wer an deiner Anlage verdient, über welche Wege das geschieht und was die Regulierung offenlegen muss.',
      readingMinutes: 11,
      sections: [
        {
          heading: 'Vergütung in der Beratung',
          points: [
            'Bestandsprovision: laufende Zahlung des Fonds an den Vermittler.',
            'Provisionsberatung gegen Honorarberatung – Anreize im Vergleich.',
            'Warum ein Ausgabeaufschlag von fünf Prozent Jahre kostet, nicht Prozente.',
            'Offenlegungspflichten und wo die Angaben stehen.',
          ],
        },
        {
          heading: 'Performance-Fees richtig lesen',
          points: [
            'Bemessungsgrundlage: absolute Rendite gegen Vergleichsindex.',
            'High-Water-Mark und ihre Bedeutung nach Verlustjahren.',
            'Kristallisationszeitpunkt und die Wirkung unterjähriger Abrechnung.',
            'Asymmetrie: Beteiligung am Gewinn ohne Beteiligung am Verlust.',
          ],
        },
        {
          heading: 'Regulatorischer Rahmen',
          points: [
            'Basisinformationsblatt und die vorgeschriebene Kostendarstellung.',
            'Ex-ante- und Ex-post-Kostenausweis des Brokers.',
            'Kostenausweis in Euro statt in Prozent als wirksamste Transparenzregel.',
            'Grenzen der Regulierung: Was weiterhin nicht ausgewiesen werden muss.',
          ],
        },
      ],
    },
  },
})
