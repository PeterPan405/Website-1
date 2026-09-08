import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-09-08.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-09-08 00:19 UTC
 */
export const edition: DailyEdition = {
  date: '2026-09-08',
  intro:
    'Frachtschiffe meiden die Straße von Hormus, China kauft weiter Gold, Hornbach schlägt Erwartungen, und JPMorgan traut der KI-Welle mehr zu.',
  top: [
    {
      headline: 'Nur noch zehn Schiffe am Tag: Die Straße von Hormus verstopft',
      summary: [
        'Nach neuen Angriffen auf Tanker am Wochenende ist der Schiffsverkehr durch die Straße von Hormus laut wallstreet-online auf durchschnittlich zehn Frachtschiffe pro Tag gefallen – der niedrigste Wert seit Mai.',
        'Seit Mittwoch hat demnach kein einziger sehr großer Rohöltanker die Meerenge verlassen; Brent-Öl legte am Montagabend um 1,64 Prozent auf 97,31 US-Dollar zu.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zeigt, wie ein einzelner geografischer Engpass den globalen Ölpreis bewegen kann, ohne dass sich an der weltweiten Fördermenge etwas ändert.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent', 'wti'],
      sources: [
        {
          label:
            'wallstreet-online, Rohstoffnachrichten vom 7.9.2026, 20:30 Uhr: „Ölpreis geht durch die Decke: Straße von Hormus: Hier geht nichts mehr durch!“',
          url: 'https://www.wallstreet-online.de/nachricht/21344735-oelpreis-decke-strasse-hormus-durch',
        },
      ],
    },
    {
      headline: 'China stockt seine Goldreserven im August kräftig auf',
      summary: [
        'Chinas Zentralbank erhöhte ihre offiziellen Goldreserven laut Goldreporter im August um rund 20,2 Tonnen auf 76,73 Millionen Unzen, der Wert stieg auf 350,08 Milliarden US-Dollar.',
        'China kauft nach Angaben der Quelle seit der Wiederaufnahme offizieller Käufe im November 2022 ununterbrochen zu, zuletzt in beschleunigtem Tempo.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Ein wachsender Goldanteil in den Reserven einer großen Zentralbank ist ein langfristiges Signal für die Nachfrage nach Gold, keine kurzfristige Kursprognose.',
      relatedTopics: ['notenbanken-geldpolitik', 'rohstoffe'],
      relatedSymbols: ['gold'],
      sources: [
        {
          label:
            'Goldreporter, Meldung vom 7.9.2026: „China kauft weiter kräftig Gold – Reserven steigen auf 76,73 Millionen Unzen“',
          url: 'https://www.goldreporter.de/china-goldreserven-august-2026/china/261647/',
        },
      ],
    },
    {
      headline: 'DAX hält die 26.000 knapp, die entscheidende Woche beginnt erst',
      summary: [
        'Der DAX schloss den Montag laut dpa-AFX mit einem Minus von 0,15 Prozent bei 26.006,53 Punkten – belastet von hohen Ölpreisen und ausbleibenden Impulsen wegen eines US-Feiertags.',
        'Die eigentlichen Termine der Woche stehen noch aus: der EZB-Zinsentscheid und am Freitag US-Inflationsdaten; in der Nacht zum Dienstag bestätigte sich unterdessen Japans Wirtschaftswachstum wie erwartet mit 0,4 Prozent.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ordnet einen ruhigen Handelstag richtig ein: als Vorlauf zu mehreren dicht getakteten Terminen, nicht als bedeutungslosen Tag.',
      relatedTopics: ['wie-funktioniert-der-markt', 'notenbanken-geldpolitik'],
      relatedSymbols: ['dax', 'euro-stoxx-50'],
      sources: [
        {
          label:
            'dpa-AFX über investing.com, Meldung vom 7.9.2026: „ROUNDUP/Aktien Frankfurt Schluss: Dax gibt wieder leicht nach“',
          url: 'https://de.investing.com/news/stock-market-news/roundupaktien-frankfurt-schluss-dax-gibt-wieder-leicht-nach-3651976',
        },
        {
          label:
            'dpa-AFX über finanzen.at, Meldung vom 7.9.2026: „Aktien Europa Schluss: Träger Wochenstart vor EZB-Zinsentscheid und US-Inflation“',
          url: 'https://www.finanzen.at/nachrichten/aktien/aktien-europa-schluss-trager-wochenstart-vor-ezb-zinsentscheid-und-us-inflation-1036526631',
        },
        {
          label:
            'wallstreet-online, Wirtschaftskalender-Widget „Kommende Termine“, Abruf 8.9.2026, 00:19 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Fed-Chef Warsh zwischen Inflationskampf und Schuldenlast',
      summary: [
        'Eine Analyse von Goldreporter beziffert die US-Staatsschulden auf über 40,1 Billionen Dollar und die Zinskosten bis Juli auf 1,17 Billionen Dollar – ein Umfeld, das Fed-Chef Kevin Warshs Spielraum gegen die Inflation einschränkt.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Erklärt, warum eine Zinsentscheidung selten nur eine Frage der Inflation ist, sondern immer auch die Kosten der Staatsverschuldung mitbestimmt.',
      relatedTopics: ['notenbanken-geldpolitik', 'schulden-und-kredit'],
      relatedSymbols: ['gold'],
      sources: [
        {
          label:
            'Goldreporter, Analyse vom 7.9.2026: „Kevin Warsh steckt im Zins-Dilemma – was das für den Goldpreis bedeutet“',
          url: 'https://www.goldreporter.de/kevin-warsh-zins-dilemma-goldpreis-fed-goldreserven/geldpolitik/261614/',
        },
      ],
    },
    {
      headline:
        'Hornbach verdient im Quartal zweistellig mehr, die Prognose bleibt gleich',
      summary: [
        'Hornbach steigerte Umsatz und bereinigtes EBIT im zweiten Quartal um 7,3 beziehungsweise 12,8 Prozent, bestätigte aber die bisherige Jahresprognose unverändert.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zeigt den Unterschied zwischen einem starken Einzelquartal und der Vorsicht, die ein Unternehmen für die restlichen Monate einpreist.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['sdax'],
      sources: [
        {
          label:
            'EQS-Adhoc über finanzen.net, Meldung vom 7.9.2026, 19:19 Uhr: „HORNBACH Holding AG & Co. KGaA: Umsatz und bereinigtes EBIT in Q2 2026/27 über Vorjahresniveau – Prognose für das Gesamtjahr bestätigt“',
          url: 'https://www.finanzen.net/nachricht/aktien/eqs-adhoc-hornbach-holding-ag-co-kgaa-umsatz-und-bereinigtes-ebit-in-q2-2026-27-ber-vorjahresniveau-prognose-f-r-das-gesamtjahr-best-tigt-15922253',
        },
      ],
    },
    {
      headline: 'JPMorgan erhöht seine Prognose für globale KI-Investitionen',
      summary: [
        'JPMorgan hebt die Schätzung für weltweite KI-Investitionen bis 2030 laut finanzen.net von 5,1 auf 5,5 Billionen Dollar an, gut 4,1 Billionen davon fremdfinanziert.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Macht sichtbar, dass ein wachsender Teil der KI-Investitionswelle über Schulden statt Eigenkapital finanziert wird – mit entsprechender Zinsempfindlichkeit.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['amazon', 'alphabet', 'microsoft'],
      sources: [
        {
          label:
            'finanzen.net, Meldung vom 7.9.2026, 21:35 Uhr: „KI-Aktien im Blick: Warum JPMorgan die Billionen-Investitionen für tragfähig hält“',
          url: 'https://www.finanzen.net/nachricht/aktien/rechenzentren-ki-aktien-im-blick-warum-jpmorgan-die-billionen-investitionen-fuer-tragfaehig-haelt-00-15910055',
        },
      ],
    },
    {
      headline: 'Der Coinbase-Chef sieht Bitcoin bei bis zu 400.000 Dollar – bis 2030',
      summary: [
        'Coinbase-CEO Brian Armstrong hält laut finanzen.net einen Bitcoin-Kurs von 300.000 bis 400.000 Dollar bis 2030 für wahrscheinlich, während der Kurs in derselben Nacht um 1,8 Prozent auf 68.085 Dollar nachgab.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Erinnert daran, dass eine Kursprognose über mehrere Jahre und die Kursbewegung einer einzelnen Nacht zwei verschiedene Fragen beantworten.',
      relatedTopics: ['bitcoin-krypto', 'anlegerpsychologie'],
      relatedSymbols: ['bitcoin'],
      sources: [
        {
          label:
            'finanzen.net, Meldung vom 7.9.2026: „Coinbase-CEO: Bitcoin-Kurs könnte bis zu diesem Zeitpunkt auf bis zu 400.000 US-Dollar steigen“',
          url: 'https://www.finanzen.net/nachricht/devisen/mega-kursprognose-coinbase-ceo-bitcoin-kurs-koennte-bis-zu-diesem-zeitpunkt-auf-bis-zu-400-000-us-dollar-steigen-00-15911477',
        },
        {
          label:
            'finanzen.net, Kursleiste (Abruf 8.9.2026, 02:19 Uhr): Bitcoin 68.085 US-Dollar (-1,8 %)',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Japans Staatsanleihen werden zur Konkurrenz für US-Treasuries',
      summary: [
        'Höhere Leitzinsen der Bank of Japan stützen laut wallstreet-online den Yen und machen japanische Staatsanleihen attraktiver – mit dem Potenzial, Kapital aus US-Treasuries abzuziehen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zeigt, wie eine Zinswende in einem Land die Kapitalströme zwischen zwei Anleihemärkten verschiebt, ohne dass sich an der US-Verzinsung etwas ändert.',
      relatedTopics: ['waehrungen-wechselkurse', 'staatsanleihe'],
      relatedSymbols: ['eur-jpy'],
      sources: [
        {
          label:
            'wallstreetONLINE Redaktion über finanznachrichten.de, Meldung vom 7.9.2026, 19:23 Uhr: „Geld fließt aus US-Treasuries: Japan wird ernsthafte Konkurrenz zu den USA“',
          url: 'https://www.finanznachrichten.de/nachrichten-2026-09/69513463-geld-fliesst-aus-us-treasuries-japan-wird-ernsthafte-konkurrenz-zu-den-usa-049.htm',
        },
        {
          label:
            'wallstreet-online, Devisenpreise (Abruf 8.9.2026, 02:18 Uhr): EUR/JPY 178,65250 (-0,43 %)',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
}
