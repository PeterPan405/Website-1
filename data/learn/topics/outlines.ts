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
