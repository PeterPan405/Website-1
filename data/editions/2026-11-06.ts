import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-11-06.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-11-06 00:11 UTC
 */
export const edition: DailyEdition = {
  date: '2026-11-06',
  intro:
    'Ein KI-Ausverkauf trifft die Wall Street, die Bank of England erhöht den Leitzins, und Rüstungswerte, eine Bank und ein Vermieter laufen gegensätzlich.',
  top: [
    {
      headline: 'Wall Street verliert an einem Tag drei Billionen Dollar',
      summary: [
        'Die Wall Street erlebt den schwersten Ausverkauf seit Monaten. Der Nasdaq 100 fällt um 6,33 Prozent. Der Dow Jones verliert 3,41 Prozent, meldet wallstreet-online am frühen Morgen.',
        'Auslöser ist die Sorge vor strengerer KI-Regulierung. Nach ihrem Sieg bei den Midterms fordern führende Demokraten ein Moratorium für neue Rechenzentren, berichtet CNBC. Allein die sieben größten Technologiewerte verloren nach CNBC-Angaben rund eine Billion Dollar.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Kursrutsch, der aus politischer Unsicherheit entsteht, lässt sich nicht aus Unternehmenszahlen ablesen – er trifft konzentrierte Indizes härter als breit gestreute.',
      relatedTopics: ['boerse', 'risiko-und-rendite'],
      relatedSymbols: ['nasdaq-100', 'dow-jones'],
      sources: [
        {
          label:
            "Handelsblatt, 5.11.2026, 23:40 Uhr: „Wall Street: 'KI-Blutbad' an Börse – rund drei Billionen Dollar Börsenwert an einem Tag vernichtet\"",
          url: 'https://www.handelsblatt.com/finanzen/maerkte/marktberichte/wall-street-ki-blutbad-an-us-boersen-sp-500-bricht-um-vier-prozent-ein/100267625.html',
        },
        {
          label: 'CNBC, 6.11.2026, 00:39 Uhr: „Magnificent 7 loses $1 trillion"',
          url: 'https://www.cnbc.com/2026/11/05/stock-market-selloff-ai-fears.html',
        },
      ],
    },
    {
      headline: 'Bank of England erhöht Leitzins auf 4,0 Prozent',
      summary: [
        'Die Bank of England erhöht ihren Leitzins erstmals seit drei Jahren. Der neue Satz liegt bei 4,0 Prozent, berichtet Handelsblatt.',
        'Ein Energiepreisschock hat die britische Inflation zuletzt auf 3,5 Prozent getrieben. Die Notenbank signalisiert bereits weitere Zinsschritte.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Eine Notenbank, die mitten in einem Energiepreisschock die Zinsen erhöht, stellt Inflationsbekämpfung bewusst über kurzfristiges Wachstum.',
      relatedTopics: ['notenbanken-geldpolitik', 'inflation'],
      relatedSymbols: ['eur-gbp'],
      sources: [
        {
          label:
            'Handelsblatt, 5.11.2026, 14:27 Uhr: „Bank of England: Britische Notenbank hebt Zinsen erstmals seit drei Jahren an – auf 4,0 Prozent"',
          url: 'https://www.handelsblatt.com/finanzen/geldpolitik/bank-of-england-britische-notenbank-hebt-zinsen-erstmals-seit-drei-jahren-an/100266567.html',
        },
      ],
    },
    {
      headline: 'Rüstungsbranche: Rheinmetall kappt Prognose, Hensoldt hebt an',
      summary: [
        'Rheinmetall senkt seine Prognose. Hensoldt hebt seine Prognose dagegen an, meldet die WirtschaftsWoche. Beide Unternehmen profitieren vom selben Rüstungsboom.',
        'Am selben Tag einigten sich Bund und Eigentümerfamilien auf einen Kaufpreis für den Panzerbauer KNDS. Die Bundesregierung übernimmt alle Anteile der Familien, berichtet die Tagesschau.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Branchenboom hebt nicht automatisch alle Aktien einer Branche – Guidance-Unterschiede zeigen, wessen Geschäft wirklich robust ist.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['rheinmetall', 'dax'],
      sources: [
        {
          label:
            'WirtschaftsWoche, 5.11.2026, 15:20 Uhr: „BörsenTag: Der Rüstungsboom allein reicht nicht mehr"',
          url: 'https://www.wiwo.de/finanzen/boerse/rheinmetall-aktie-warum-der-ruestungsboom-an-der-boerse-kippt/100267604.html',
        },
        {
          label:
            'tagesschau.de, 5.11.2026, 15:11 Uhr: „Bund und Eigentümerfamilien einigen sich auf Kaufpreis bei KNDS"',
          url: 'https://www.tagesschau.de/wirtschaft/unternehmen/knds-bundesregierung-100.html',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Commerzbank verfehlt Erwartungen wegen Einlagen-Wettbewerb',
      summary: [
        'Die Commerzbank hat die Markterwartungen leicht verfehlt. Das Geldhaus rechnet mit weniger Zinseinnahmen, berichtet Handelsblatt.',
        'Die Ratingagentur RBC senkte ihr Kursziel für die Aktie auf 39 Euro, meldet wallstreet-online. Grund ist der harte Wettbewerb um Spareinlagen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Die Zinsspanne zwischen Einlagen- und Kreditzinsen entscheidet oft mehr über die Qualität einer Bank als die reine Gewinnzahl.',
      relatedTopics: ['tagesgeld', 'risiko-und-rendite'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label:
            'Handelsblatt, 5.11.2026, 14:44 Uhr: „Geldinstitut: Harter Wettbewerb um Spareinlagen setzt Commerzbank zu – Aktie unter Druck"',
          url: 'https://www.handelsblatt.com/finanzen/banken-versicherungen/banken/commerzbank-harter-wettbewerb-um-einlagen-setzt-institut-zu/100266237.html',
        },
        {
          label:
            "wallstreet-online, 5.11.2026: „ANALYSE-FLASH: RBC senkt Ziel für Commerzbank auf 39 Euro – 'Sector Perform'\" (dpa-AFX)",
          url: 'https://www.wallstreet-online.de/nachricht/21649197-analyse-flash-rbc-ziel-commerzbank-39-euro-sector-perform',
        },
      ],
    },
    {
      headline: 'Vonovia kappt Prognose und verliert den Finanzchef',
      summary: [
        'Vonovia senkt seine Prognose. Deutschlands größter Vermieter leidet weiter unter den hohen Zinsen, schreibt die WirtschaftsWoche.',
        'Das Unternehmen verliert zudem bald seinen Finanzchef. Weitere Einzelheiten dazu nennt der Bericht nicht.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Vermieter mit viel Fremdkapital zeigt, wie stark höhere Zinsen auch außerhalb der Finanzmärkte wirken.',
      relatedTopics: ['immobilien', 'schulden-und-kredit'],
      relatedSymbols: ['vonovia'],
      sources: [
        {
          label:
            'WirtschaftsWoche, 4.11.2026, 13:19 Uhr: „Immobilienkonzern: Sechs Punkte, die die Krise bei Vonovia erklären"',
          url: 'https://www.wiwo.de/finanzen/immobilien/krise-bei-vonovia-sechs-gruende-und-was-jetzt-aktionaeren-droht/100267169.html',
        },
      ],
    },
  ],
}
