import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-08-30.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-08-30 00:13 UTC
 */
export const edition: DailyEdition = {
  date: '2026-08-30',
  intro:
    'PayPal verliert eine Übernahme und einen Teil des Kurses, der Iran beansprucht die Straße von Hormus, und Spaniens Inflation zieht deutlich an.',
  top: [
    {
      headline:
        'PayPal-Übernahme geplatzt: Vorstand lehnt 53-Milliarden-Dollar-Angebot ab',
      summary: [
        'Ein Konsortium aus Stripe und Advent International wollte PayPal für gut 53 Milliarden Dollar übernehmen; der PayPal-Vorstand lehnte das Angebot als zu niedrig ab.',
        'Die PayPal-Aktie verlor daraufhin schon vor US-Börsenstart am Freitag rund 13 Prozent – ein Hinweis darauf, wie viel Übernahmefantasie bereits im Kurs steckte.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zeigt, dass eine aus Anlegersicht eigentlich positive Ablehnung eines Angebots die eigene Aktie trotzdem stark belasten kann, weil vorher eingepreiste Erwartungen wegfallen.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['paypal'],
      sources: [
        {
          label:
            'onvista, Nachricht vom 28.8.2026: „PayPal im Fokus nach Berichten über ein Ende der Übernahmegespräche“',
          url: 'https://www.onvista.de/news/2026/08-28-paypal-im-fokus-nach-berichten-ueber-ein-ende-der-uebernahmegespraeche-0-12-26547473',
        },
      ],
    },
    {
      headline: 'Iran erklärt Kontrolle über Hormus, Ölpreis bleibt ruhig',
      summary: [
        'Irans Revolutionsgarden melden die vollständige Kontrolle über die Straße von Hormus, während rund 400 Schiffe im Persischen Golf feststecken.',
        'Der Ölpreis reagierte am Sonntagmorgen kaum: Öl notierte laut finanzen.net nur 0,4 Prozent niedriger als zuvor.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Macht sichtbar, dass Marktpreise zwischen einer politischen Behauptung und einer tatsächlich nachweisbaren Lieferstörung unterscheiden – ablesbar an der Reaktion des Ölpreises.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent', 'wti'],
      sources: [
        {
          label:
            'finanzen.net, Rubrik „Aktuelle News zu Rohstoffen“, Abruf 30.8.2026: „29.08.26 Irans Revolutionsgarden erklären: Straße von Hormus vollständig unter Kontrolle“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline:
        'Spaniens Inflation zieht auf 4,5 Prozent an, Deutschland folgt erst am Montag',
      summary: [
        'In Spanien kletterte die Inflationsrate im August auf 4,5 Prozent, den höchsten Stand seit 2023 – als Grund werden vor allem höhere Energiepreise durch den Nahost-Konflikt genannt.',
        'Für Deutschland erwarten Prognosen am Montag eine Jahresrate von 2,9 bis 3,0 Prozent, nach 2,8 Prozent im Juli.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Zeigt am Beispiel zweier Euro-Länder, warum ein einziger EZB-Leitzins nie für alle Mitgliedsländer gleichzeitig passend sein kann.',
      relatedTopics: ['inflation', 'notenbanken-geldpolitik'],
      relatedSymbols: ['eur-usd'],
      sources: [
        {
          label:
            'goldreporter.de, Meldung vom 29.8.2026: „Inflation in Spanien steigt auf 4,5 Prozent“ (Datenquelle: Trading Economics)',
          url: 'https://www.goldreporter.de/inflation-spanien-august-2026/hot-links/261368/',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Norwegens Energiebehörde warnt vor sinkender Förderung ab 2030',
      summary: [
        'Norwegen deckt 44 Prozent der deutschen Erdgas- und rund 16,6 Prozent der deutschen Rohölimporte, seit russische Pipeline-Lieferungen weggefallen sind.',
        'Die norwegische Offshore-Behörde warnt, dass neue Funde die laufende Förderung nicht mehr ersetzen – die Szenarien bis 2050 reichen von 65 bis nur 5 Prozent der heutigen Menge.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Legt offen, wie stark sich Deutschlands Energieversorgung inzwischen auf einen einzigen Lieferanten konzentriert, dessen eigene Behörde vor sinkenden Reserven warnt.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent', 'erdgas'],
      sources: [
        {
          label:
            'wallstreet-online, Nachricht vom 28.8.2026: „Öl- und Gas-Schock ab 2030: Deutschlands Top-Lieferant gehen Öl und Gas aus“',
          url: 'https://www.wallstreet-online.de/nachricht/21302038-oel-gas-schock-2030-deutschlands-top-lieferant-oel-gas',
        },
      ],
    },
    {
      headline: 'Siemens-Chef Busch kritisiert Tempo der EU-KI-Regulierung',
      summary: [
        'Roland Busch sagte der „Welt am Sonntag“, Gesetze wie der AI Act bräuchten rund zwei Jahre bis zum Inkrafttreten, während sich KI-Technologie in dieser Zeit mehrfach weiterentwickle.',
        'Die Aussage ändert an geltendem EU-Recht zunächst nichts, benennt aber ein Risiko, das Anleger in KI-nahen Aktien neben Umsatz und Marge im Blick behalten sollten.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Ordnet eine CEO-Aussage richtig ein: eine Meinungsäußerung ist keine Gesetzesänderung, aber ein Hinweis auf regulatorisches Risiko für KI-Investments.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['siemens'],
      sources: [
        {
          label:
            'heise online, Meldung vom 29.8.2026: „Siemens-Chef warnt vor zu viel Regulierung bei KI“ (Interview mit der „Welt am Sonntag“)',
          url: 'https://www.heise.de/news/Siemens-Chef-warnt-vor-zu-viel-Regulierung-bei-KI-11434313.html',
        },
      ],
    },
  ],
}
