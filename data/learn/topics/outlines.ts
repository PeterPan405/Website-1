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
