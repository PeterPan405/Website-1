import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-10-16.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-10-16 04:23 UTC
 */
export const edition: DailyEdition = {
  date: '2026-10-16',
  intro:
    'UniCredit erhält grünes Licht für die Commerzbank-Übernahme, US-Erzeugerpreise schießen hoch, die UBS prüft einen Umzug, Lagarde könnte zum WEF wechseln.',
  top: [
    {
      headline: 'UniCredit erhält EZB-Freigabe, baut Commerzbank-Kontrolle aus',
      summary: [
        'Die Europäische Zentralbank hat UniCredit grünes Licht gegeben, ihren Anteil an der Commerzbank über 30 Prozent hinaus zu erhöhen – ohne Obergrenze. UniCredit hält bereits knapp 30 Prozent der Aktien direkt und hat sich über ein Tauschangebot zusätzlichen Zugriff auf rund 20 Prozent weitere Anteile gesichert.',
        'Bis zum Jahresende rechnet UniCredit damit, über rund 50 Prozent der Stimmrechte an der Commerzbank zu verfügen. Die Bank könnte damit die Kontrolle über den deutschen Mittelstandsfinanzierer übernehmen. Commerzbank und Bundesregierung hatten sich lange gegen die Übernahme gewehrt, zuletzt nahmen beide Banken aber Gespräche über einen Zusammenschluss auf.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Die 30-Prozent-Schwelle ist ein regulatorischer Auslöser: Erst die aufsichtsrechtliche Prüfung der EZB entscheidet, ob ein Großaktionär die Kontrolle über eine Bank übernehmen darf – unabhängig davon, wie viele Anteile er sich wirtschaftlich schon gesichert hat.',
      relatedTopics: ['aktie', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label:
            'Tagesschau, 15.10.2026, 21:53 Uhr: „UniCredit bekommt grünes Licht von EZB für Übernahme der Commerzbank“',
          url: 'https://www.tagesschau.de/wirtschaft/ezb-uebernahme-commerzbank-100.html',
        },
        {
          label:
            'Handelsblatt, 15.10.2026, 21:41 Uhr: „Banken: EZB gibt Unicredit grünes Licht für volle Commerzbank-Übernahme“',
          url: 'https://www.handelsblatt.com/finanzen/banken-versicherungen/banken/banken-ezb-gibt-unicredit-gruenes-licht-fuer-volle-commerzbank-uebernahme/100262659.html',
        },
      ],
    },
    {
      headline:
        'US-Erzeugerpreise springen stärker als seit 2022, Fed-Chef Warsh spricht heute',
      summary: [
        'Die US-Erzeugerpreise sind im September um 1,3 Prozent zum Vormonat gestiegen, das Doppelte der erwarteten 0,6 Prozent. Zum Vorjahr beträgt der Anstieg 6,3 Prozent – der stärkste Jahreswert seit Dezember 2022. Ohne Energie und Nahrungsmittel legten die Preise um 0,5 Prozent zu.',
        'Am Freitag sprechen mehrere Notenbanker: Fed-Chef Kevin Warsh um 5:30 Uhr, EZB-Vorstand Joachim Nagel um 4:30 Uhr und Bank-of-England-Chef Andrew Bailey um 4 Uhr, am Rande der IWF-Jahrestagung in Washington. Am Fed-Futures-Markt lag die Wahrscheinlichkeit einer Zinserhöhung Ende Oktober laut CNBC bei 29 Prozent, bis Dezember bei 91 Prozent.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Erzeugerpreise gelten als Frühindikator für die Verbraucherinflation, weil Unternehmen gestiegene Einkaufskosten oft erst zeitversetzt weitergeben – deshalb beobachten Notenbanken sie genau vor Zinsentscheidungen.',
      relatedTopics: ['notenbanken-geldpolitik', 'inflation'],
      relatedSymbols: [],
      sources: [
        {
          label:
            "CNBC, 15.10.2026, 11:37 Uhr Ortszeit: „Economists: Hot PPI shows Fed's work is not done“",
          url: 'https://www.cnbc.com/2026/10/15/pce-ppi-september-fed-reserve-rate-hike.html',
        },
        {
          label:
            'CNBC, 15.10.2026, 08:32 Uhr Ortszeit: „Wholesale prices jumped 6.3% annually in September, biggest gain since 2022“',
          url: 'https://www.cnbc.com/2026/10/15/september-producer-price-index-retail-sales-data.html',
        },
      ],
    },
    {
      headline: 'UBS prüft laut Insidern Umzug oder Fusion wegen Kapitalregeln',
      summary: [
        'Die UBS prüft laut Insidern für den Fall zu strenger Schweizer Eigenkapitalvorschriften einen Umzug ins Ausland oder einen Zusammenschluss. Eine interne Arbeitsgruppe spiele mehrere Szenarien durch, berichtete das Handelsblatt unter Berufung auf Reuters und drei mit der Sache vertraute Personen. Konkrete Gespräche gebe es bislang nicht, die UBS lehnte eine Stellungnahme ab.',
        'Hintergrund sind schärfere Kapitalvorgaben der Schweizer Politik nach dem Zusammenbruch der Credit Suisse 2023. Die Regierung verlangt von der UBS, ihre Auslandstöchter vollständig mit hartem Kernkapital zu unterlegen – nach Handelsblatt-Angaben ein Mehrbedarf von über 20 Milliarden Dollar. Der Ständerat senkte die Vorgabe im September auf 90 Prozent, eine Kommission des Nationalrats berät noch diesen Monat weiter. Eine zweite, unabhängige Quelle zum Umzug-Bericht lag bislang nicht vor.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Hartes Kernkapital ist die teuerste Finanzierungsform einer Bank – je mehr eine Regulierung davon verlangt, desto stärker gerät die Eigenkapitalrendite im Vergleich zu Banken mit laxeren Vorgaben unter Druck.',
      relatedTopics: ['risiko-und-rendite', 'aktie'],
      relatedSymbols: ['ubs'],
      sources: [
        {
          label:
            'Handelsblatt, 15.10.2026, 20:44 Uhr: „Banken: UBS erwägt bei zu strengen Schweizer Regeln offenbar Umzug oder Fusion“',
          url: 'https://www.handelsblatt.com/finanzen/banken-versicherungen/banken/banken-ubs-erwaegt-bei-zu-strengen-regeln-offenbar-umzug-oder-fusion/100262665.html',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Lagarde könnte Anfang November WEF-Chefin werden',
      summary: [
        'Das Kuratorium des Weltwirtschaftsforums tagt laut Reuters am 2. November und könnte EZB-Chefin Christine Lagarde zur nächsten Vorsitzenden wählen. Die Wahl sei noch nicht gesichert, Lagarde genieße aber breite Unterstützung im Gremium. Die EZB lehnte eine Stellungnahme ab, das WEF nannte keinen Termin. Eine zweite, unabhängige Quelle dazu lag bislang nicht vor.',
        'Lagarde hatte Ende September selbst skizziert, vor Ablauf ihrer Amtszeit bei der EZB zurücktreten zu können. Bei einem Fernsehgespräch in Bangkok äußerte sie sich zu einem möglichen Wechsel zum WEF zuletzt nicht.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Ein absehbarer Führungswechsel an der EZB-Spitze kann die Markterwartungen über den künftigen geldpolitischen Kurs schon vor einer offiziellen Nachfolgeentscheidung verschieben.',
      relatedTopics: ['notenbanken-geldpolitik'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'Handelsblatt, 15.10.2026, 15:59 Uhr: „EZB-Präsidentin: Bericht: WEF könnte Lagarde Anfang November zur künftigen Chefin küren“',
          url: 'https://www.handelsblatt.com/finanzen/geldpolitik/ezb-wef-koennte-lagarde-anfang-november-zur-kuenftigen-chefin-kueren/100262581.html',
        },
      ],
    },
    {
      headline: 'EuGH: Banken müssen Kontobetrug-Opfern das Geld sofort erstatten',
      summary: [
        'Der Europäische Gerichtshof hat entschieden, dass Banken Opfern von Kontobetrug das Geld zunächst sofort erstatten müssen – auch wenn sie grobe Fahrlässigkeit vorwerfen. Anlass war ein Fall aus Polen, in dem eine Frau über einen gefälschten Link rund 700 Euro verlor und ihre Bank die Erstattung verweigerte.',
        'Nach dem Urteil gibt es nur eine Ausnahme: wenn die Bank den Verdacht auf einen Betrug durch den Kunden selbst schriftlich bei der zuständigen Behörde meldet. Erst danach darf sie versuchen, das Geld zurückzufordern – muss dafür aber grobe Fahrlässigkeit beweisen.',
      ],
      category: 'Steuern & Recht',
      whyItMatters:
        'Die Beweislast für grobe Fahrlässigkeit liegt künftig zuerst bei der Bank, nicht beim Kunden – das beschleunigt die Rückerstattung für Phishing-Opfer in der gesamten EU.',
      relatedTopics: ['einlagensicherung', 'worauf-achten-einsteiger'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'Tagesschau, 15.10.2026, 15:59 Uhr: „EuGH-Urteil: Banken müssen bei Kontobetrug Geld erstatten“',
          url: 'https://www.tagesschau.de/wirtschaft/verbraucher/eugh-konto-betrug-phishing-100.html',
        },
        {
          label:
            'FAZ, 15.10.2026, 11:29 Uhr: „Gerichtsurteil: Banken müssen Geld bei Kontobetrug erst einmal erstatten“',
          url: 'https://www.faz.net/aktuell/finanzen/kontobetrug-banken-muessen-geld-erst-einmal-erstatten-accg-201339759.html',
        },
      ],
    },
  ],
}
