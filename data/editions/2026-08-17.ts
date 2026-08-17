import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-08-17.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-08-17 01:59 UTC
 */
export const edition: DailyEdition = {
  date: '2026-08-17',
  intro:
    'Zum Wochenstart macht die Sorge um Fed, Yen und KI-Bewertungen die Runde, Gold-ETFs wachsen vier Wochen in Folge, dazu EZB-Rede und Kanadas Inflation.',
  top: [
    {
      headline:
        '„Sell America“: Fed, Yen und KI-Boom sollen US-Anleger wieder nervös machen',
      summary: [
        'Ein Nachrichtenticker von finanzen.net meldet um 3:37 Uhr eine Rückkehr der „Sell America“-Stimmung, ausgelöst durch Sorgen um Fed, Yen und die Bewertung von KI-Aktien.',
        'Parallel berichtet Goldreporter über eine mögliche japanische Zinswende, und wallstreet-online veröffentlicht ein Interview zu einem „neuen Zinsregime“ in Japan.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zeigt, wie eng US-Aktien, der japanische Yen und die Notenbankpolitik mittlerweile verflochten sind – wichtig für alle, die international investiert sind.',
      relatedTopics: ['notenbanken-geldpolitik', 'waehrungen-wechselkurse'],
      relatedSymbols: ['dax', 'nasdaq-100'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 17.8.2026, 3:37 Uhr: „‚Sell America‘ ist zurück: Warum Fed, Yen und KI-Boom die US-Aktienmärkte nervös machen“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
        {
          label:
            'Goldreporter, Startseite „Letzte Beiträge“, abgerufen 17.8.2026: „Yen-Krise: Japan unterstützt schnellere Zinserhöhung“',
          url: 'https://www.goldreporter.de/',
        },
      ],
    },
    {
      headline:
        'Gold-ETFs wachsen vier Wochen in Folge, auch Spekulanten bauen Long-Positionen aus',
      summary: [
        'Der größte Gold-ETF verzeichnet laut Goldreporter die vierte Woche in Folge steigende Bestände, während aktuelle CoT-Daten zusätzlich wachsende spekulative Long-Positionen zeigen.',
        'Der Goldpreis selbst beendete die vergangene Woche bei 4.376 US-Dollar und notiert am Montagmorgen bei 4.395,04 US-Dollar, ein Plus von 0,42 Prozent.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Zeigt, dass ETF-Zuflüsse, spekulative Positionierung und der tatsächliche Goldpreis drei unterschiedliche Messwerte sind, die nicht zwangsläufig im Gleichschritt laufen.',
      relatedTopics: ['rohstoffe', 'risiko-und-rendite'],
      relatedSymbols: ['gold'],
      sources: [
        {
          label:
            'Goldreporter, Startseite „Letzte Beiträge“, abgerufen 17.8.2026: „Größter Gold-ETF: Bestände steigen vierte Woche in Folge“',
          url: 'https://www.goldreporter.de/',
        },
        {
          label:
            'Goldreporter, Analyse vom 15.8.2026: „Goldmarkt: Spekulanten bauen Long-Positionen weiter aus“',
          url: 'https://www.goldreporter.de/',
        },
      ],
    },
    {
      headline:
        'Wochenstart im Kalender: EZB-Rede, Kanadas Inflation und Japans Industriedaten',
      summary: [
        'Der Wirtschaftskalender von wallstreet-online nennt für heute unter anderem eine Rede von EZB-Ratsmitglied Philip Lane um 11:30 Uhr und Kanadas Inflationsdaten um 14:30 Uhr.',
        'Bereits um 6:30 Uhr veröffentlicht Japan Industrieproduktion, Kapazitätsauslastung und den Tertiary Industry Index.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Gibt Anlegern einen konkreten Fahrplan für den Tag statt eines reinen Rückblicks – wichtig, um Kursbewegungen später richtig einzuordnen.',
      relatedTopics: ['notenbanken-geldpolitik'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label:
            'wallstreet-online, Wirtschaftskalender „Kommende Termine“, abgerufen 17.8.2026',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Rekord-Wetten auf Bitcoin gelten als Warnsignal für die Erholung',
      summary: [
        'Ein Ticker von finanzen.net berichtet um 3:28 Uhr von Rekord-Wetten auf Bitcoin, die laut der Meldung die laufende Erholung des Kurses gefährden könnten.',
        'Zum Zeitpunkt der Meldung notierte Bitcoin bei rund 54.535 US-Dollar, ein Plus von 0,5 Prozent gegenüber dem Vortag.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Erinnert daran, dass hohe gehebelte Positionen Kursbewegungen in beide Richtungen verstärken können – nicht nur nach oben.',
      relatedTopics: ['bitcoin-krypto', 'risiko-und-rendite'],
      relatedSymbols: ['bitcoin'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 17.8.2026, 3:28 Uhr: „Warnsignal bei Bitcoin: Rekord-Wetten bedrohen die Erholung“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Silber im „Schicksalsmonat“ August: Trendwende laut Prognose offen',
      summary: [
        'Eine Prognose von wallstreet-online bezeichnet den August als „Schicksalsmonat“ für Silber und erwartet jetzt die Trendwende der zuletzt ins Stocken geratenen Erholung.',
        'Eine Begründung für den Zeitpunkt liefert die Überschrift nicht; Silber notiert am Morgen bei 64,70 US-Dollar, ein Plus von 0,35 Prozent.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Zeigt, dass Silber wegen seiner Industrienachfrage stärkere Ausschläge zeigt als Gold – ein Unterschied, der bei der Depotgewichtung zählt.',
      relatedTopics: ['rohstoffe', 'risiko-und-rendite'],
      relatedSymbols: ['silber'],
      sources: [
        {
          label:
            'wallstreetONLINE Redaktion, 16.8.2026: „Silber: Schicksalsmonat August: Silberpreis-Prognose: Jetzt entscheidet sich die Trendwende bei Silber“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline:
        'PKO Bank soll doppelt so viel Dividendenrendite bieten wie Deutsche Bank und Commerzbank',
      summary: [
        'Ein Dividenden-Radar von wallstreet-online stellt heraus, dass die polnische PKO Bank Polski so viel Rendite bieten soll wie Deutsche Bank und Commerzbank zusammen.',
        'Der polnische Staat ist laut der Meldung Großaktionär der Bank; konkrete Zahlen zu Kurs oder Ausschüttungsquote nennt die Kurzmeldung nicht.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Erinnert daran, dass eine hohe Dividendenrendite ebenso gut von einem niedrigen Kurs wie von hohen Gewinnen stammen kann.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['deutsche-bank'],
      sources: [
        {
          label:
            'wallstreetONLINE Redaktion, Dividenden-Radar vom 16.8.2026: „PKO Bank lockt mit doppelter Rendite gegenüber deutscher Konkurrenz“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline:
        'DAX vorbörslich fester, US-Futures schwächer – zwei Portale, zwei Prozentzahlen',
      summary: [
        'Finanzen.net zeigte den DAX am frühen Morgen bei plus 0,5 Prozent, wallstreet-online bei plus 0,18 Prozent – beide Male vorbörsliche Indikationen desselben Index.',
        'Bei den US-Indizes stimmte die Richtung überein: Nasdaq und US Tech 100 lagen jeweils leicht im Minus.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zeigt, dass leicht abweichende Prozentzahlen zwischen zwei Portalen kein Fehler sind, sondern zwei Momentaufnahmen eines sich noch bewegenden Marktes.',
      relatedTopics: ['wie-funktioniert-der-markt'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label: 'finanzen.net, Kursleiste, Stand 17.8.2026, ca. 3:59 Uhr',
          url: 'https://www.finanzen.net/nachrichten/',
        },
        {
          label: 'wallstreet-online, Kursleiste, Stand 17.8.2026, ca. 3:59 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
}
