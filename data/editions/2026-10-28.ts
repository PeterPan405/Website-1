import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-10-28.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-10-28 00:16 UTC
 */
export const edition: DailyEdition = {
  date: '2026-10-28',
  intro:
    'Die Fed entscheidet heute über die Zinsen, die IG Metall lehnt ein Lohnangebot ab, und Dax-Aktien sind jetzt rund um die Uhr handelbar.',
  top: [
    {
      headline: 'Die US-Notenbank Fed entscheidet heute über die Zinsen',
      summary: [
        'Die US-Notenbank Fed trifft heute ihre Zinsentscheidung, am zweiten Tag ihrer Sitzung. Der Dax blieb laut Handelsblatt bereits vor der Entscheidung unter Druck.',
        'Auch die Europäische Zentralbank entscheidet in dieser Woche über ihre Leitzinsen. Mehrere Dax-Konzerne legten zugleich ihre Quartalszahlen vor, darunter Beiersdorf und Porsche.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Zinsentscheidungen verändern die Finanzierungskosten von Unternehmen und Staaten und wirken sich darüber auf Aktien- und Anleihekurse aus.',
      relatedTopics: ['notenbanken-geldpolitik'],
      relatedSymbols: ['dax', 'sp500'],
      sources: [
        {
          label:
            'Federal Reserve, FOMC-Sitzungskalender 2026 (offizielle Terminübersicht)',
          url: 'https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm',
        },
        {
          label:
            'Handelsblatt, Marktbericht vom 27.10.2026, 17:00 Uhr: „Dax aktuell: Dax schließt im Plus – Autoaktie gegen den Trend größter Verlierer"',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/marktberichte/dax-aktuell-dax-schliesst-im-plus-mercedes-aktie-verlierer-des-tages/100265163.html',
        },
      ],
    },
    {
      headline: 'IG Metall weist erstes Angebot der Arbeitgeber zurück',
      summary: [
        'Die Arbeitgeber der Metall- und Elektroindustrie haben der IG Metall ein erstes Angebot vorgelegt. Die Gewerkschaft lehnt es laut Tagesschau als unzureichend ab.',
        'Ohne Einigung sind von diesem Sonntag an Warnstreiks in der Branche möglich.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Tarifabschluss in der größten deutschen Industriebranche wirkt sich über die Lohnkosten auf die Gewinne vieler Industrieunternehmen aus.',
      relatedTopics: ['aktien-laender-branchen'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label:
            'Tagesschau, 27.10.2026, 17:12 Uhr: „Tarifverhandlungen: IG Metall lehnt Angebot ab - Warnstreiks drohen"',
          url: 'https://www.tagesschau.de/wirtschaft/ig-metall-wirtschaftsmeldung-oktober2026-100.html',
        },
      ],
    },
    {
      headline: 'Bundesbank: Banken straffen Kreditrichtlinien für Firmen',
      summary: [
        'Die deutschen Banken haben ihre Kreditrichtlinien im Unternehmenskreditgeschäft im dritten Quartal weiter gestrafft, meldet die Bundesbank.',
        'Bei privaten Wohnungsbaukrediten lockerten die Institute ihre Bedingungen dagegen. Bei Konsumentenkrediten sahen sie keinen Anpassungsbedarf.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Strengere Kreditbedingungen für Unternehmen bremsen Investitionen oft erst mit Verzögerung – die Umfrage gilt deshalb als Frühindikator.',
      relatedTopics: ['schulden-und-kredit'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'Deutsche Bundesbank, Pressemitteilung vom 27.10.2026: „Oktober-Ergebnisse der Umfrage zum Kreditgeschäft (Bank Lending Survey) in Deutschland"',
          url: 'https://www.bundesbank.de/de/presse/pressemitteilungen/oktober-ergebnisse-der-umfrage-zum-kreditgeschaeft-bank-lending-survey-in-deutschland-1012864',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Deutsche Börse startet Rund-um-die-Uhr-Handel für 40 Dax-Aktien',
      summary: [
        'Die Deutsche Börse ermöglicht seit Dienstag den Handel mit 40 Dax-Aktien rund um die Uhr, auch abends und am Wochenende.',
        'Der Frankfurter Börsenbetreiber reagiert damit auf einen ähnlichen Trend an der Wall Street. Bei genügend Nachfrage ist eine Ausweitung auf weitere Werte möglich.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Außerhalb der regulären Handelszeiten ist die Liquidität meist geringer, was die Spanne zwischen An- und Verkaufskurs vergrößern kann.',
      relatedTopics: ['boerse'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label:
            'Tagesschau, 27.10.2026, 15:12 Uhr: „40 DAX-Aktien jetzt rund um die Uhr handelbar"',
          url: 'https://www.tagesschau.de/wirtschaft/finanzen/dax-aktien-handel-100.html',
        },
        {
          label:
            'Handelsblatt, 27.10.2026, 14:15 Uhr: „Vorbild USA: Deutsche Börse startet Handel mit Dax-Aktien rund um die Uhr"',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/aktien/aktien-deutsche-boerse-startet-handel-mit-dax-aktien-rund-um-die-uhr/100264972.html',
        },
      ],
    },
    {
      headline: 'EZB genehmigt Intesa Sanpaolos Übernahme von MPS',
      summary: [
        'Die Europäische Zentralbank hat Intesa Sanpaolo als Bankenaufsicht grünes Licht für die Übernahme der Banca Monte dei Paschi di Siena gegeben, berichtet Handelsblatt.',
        'Italiens größte Bank kommt ihrem rund 32 Milliarden Euro schweren Angebot damit näher. Die Zustimmung der Börsenaufsicht und der Wettbewerbshüter steht noch aus.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Eine Bankenübernahme braucht mehrere unabhängige Genehmigungen – von der Finanzaufsicht bis zu den Wettbewerbshütern –, bevor sie abgeschlossen ist.',
      relatedTopics: ['aktien-laender-branchen'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'Handelsblatt, 27.10.2026, 23:59 Uhr (nach Reuters und Bloomberg): „Banken: EZB gibt Intesa Sanpaolo grünes Licht für MPS-Übernahme"',
          url: 'https://www.handelsblatt.com/finanzen/banken-versicherungen/banken/banken-ezb-gibt-intesa-sanpaolo-gruenes-licht-fuer-mps-uebernahme/100265409.html',
        },
      ],
    },
  ],
}
