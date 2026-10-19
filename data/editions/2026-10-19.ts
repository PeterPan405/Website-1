import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-10-19.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-10-19 00:18 UTC
 */
export const edition: DailyEdition = {
  date: '2026-10-19',
  intro:
    'Südkoreas Finanzminister erwartet Chipwachstum bis 2027, die USA verhandeln mit China über Mastercard und Citigroup, und die Berichtssaison beginnt.',
  top: [
    {
      headline: 'Südkoreas Finanzminister erwartet Chip-Boom bis mindestens 2027',
      summary: [
        'Der weltweite Chip-Boom hält nach Einschätzung Südkoreas noch mindestens bis 2027 an. Das sagte Finanzminister Lee Hyoung-Il am Rande der IWF-Jahrestagung in Bangkok. Die Nachfrage nach Halbleitern übersteige das Angebot weiterhin deutlich, selbst wenn Hersteller ihre Kapazitäten ausbauten.',
        'Die Aussage fällt in eine Woche mit kräftigen Kursverlusten bei Chipwerten. Anleger sorgen sich vor allem wegen möglicher Zinserhöhungen und wachsender Konkurrenz aus China. Betroffen sind südkoreanische Werte wie SK Hynix und Seoul Semiconductor, aber auch der US-Riese Nvidia. Lee räumte ein, dass die hohe Gewichtung von Chipwerten die Schwankungen am südkoreanischen Aktienmarkt verstärkt.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Eine amtliche Wachstumsprognose für eine Branche und ein Kursrückgang bei denselben Aktien beschreiben zwei verschiedene Dinge: erwartete Nachfrage und aktuelle Markteinschätzung.',
      relatedTopics: ['aktien-laender-branchen', 'risiko-und-rendite'],
      relatedSymbols: ['kospi', 'nvidia', 'samsung'],
      sources: [
        {
          label:
            "CNBC, 18.10.2026, 07:10 Uhr EDT (aktualisiert): „Semiconductor market to remain solid 'at least through next year,' South Korea finance minister says“",
          url: 'https://www.cnbc.com/2026/10/17/south-korea-semiconductor-outlook-lee-hyoung-il.html',
        },
        {
          label:
            'Handelsblatt, 16.10.2026, 18:22 Uhr GMT: „Dow Jones, S&P 500, Nasdaq: US-Börsen verlieren deutlich – Ausverkauf bei KI-Aktien geht weiter“',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/marktberichte/dow-jones-sp-500-nasdaq-dow-jones-schliesst-03-prozent-niedriger/100262834.html',
        },
      ],
    },
    {
      headline: 'USA drängen China bei Marktzugang für Mastercard und Citigroup',
      summary: [
        'Die USA haben in Bangkok erneut auf mehr Marktzugang für amerikanische Finanzkonzerne in China gedrängt. Das sagte ein Vertreter des US-Finanzministeriums dem Sender CNBC. Im Mittelpunkt der Gespräche standen die Kreditkartenkonzerne Mastercard und Visa sowie die Bank Citigroup.',
        'Die Gespräche liefen am Rande der IWF-Jahrestagung mit Chinas Notenbank und dem Finanzministerium. Eine Zusage zu möglichen Genehmigungen war laut dem Beamten schon beim Treffen zwischen Trump und Xi im September in Washington vereinbart worden. China hatte der Visa-Tochter bereits am 13. Oktober die Vorbereitung eines eigenen Kartengeschäfts erlaubt, wie die chinesische Notenbank mitteilte.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Marktzugang für ausländische Finanzkonzerne in China hängt oft stärker von zwischenstaatlichen Zusagen ab als von einzelnen Unternehmensanträgen.',
      relatedTopics: ['aktien-laender-branchen', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['mastercard', 'visa'],
      sources: [
        {
          label:
            'CNBC, 16.10.2026, 12:46 Uhr EDT: „U.S. presses China on Mastercard, Citigroup market access in bilateral Bangkok talks, official says“',
          url: 'https://www.cnbc.com/2026/10/16/us-china-mastercard-citigroup-market-access.html',
        },
        {
          label:
            'The Star (Malaysia)/Xinhua, 14.10.2026, 01:07 Uhr MYT: „1st LD-Writethru: China approves Visa subsidiary application to establish bank card clearing institution“',
          url: 'https://www.thestar.com.my/news/world/2026/10/14/1st-ld-writethru-china-approves-visa-subsidiary-application-to-establish-bank-card-clearing-institution',
        },
      ],
    },
    {
      headline: 'Indiens Finanzministerin erklärt die Schwäche der eigenen Börse',
      summary: [
        'Indiens Börse hinkt seit Monaten hinterher, und Finanzministerin Nirmala Sitharaman hat dafür jetzt eine Erklärung genannt. Zu viel Liquidität mache den Ausstieg aus Aktien zu leicht, sagte sie dem Sender CNBC in Bangkok. Die Wirtschaft selbst stehe dagegen gut da.',
        'Die Zahlen hinter der Aussage sind deutlich. Indiens Leitindizes verloren seit Januar fast zwölf Prozent, meldet CNBC unter Berufung auf Daten von LSEG. Ausländische Investoren zogen laut der Depotstelle NSDL bislang mehr als 33 Milliarden Dollar aus indischen Aktien ab.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein schwacher Börsenindex und eine robuste Wirtschaft schließen sich nicht aus: Kapitalflüsse zwischen Ländern folgen oft Trends wie dem KI-Boom, nicht allein dem Wachstum vor Ort.',
      relatedTopics: ['aktien-laender-branchen', 'risiko-und-rendite'],
      relatedSymbols: ['nifty-50'],
      sources: [
        {
          label:
            "CNBC, 18.10.2026, 19:00 Uhr EDT: „India's Finance Minister blames easy exits and excess liquidity for equity market's underperformance“",
          url: 'https://www.cnbc.com/2026/10/18/india-ai-nifty50-sensex-investors.html',
        },
      ],
    },
    {
      headline: 'Berichtssaison nimmt Fahrt auf: Tesla, Meta und SAP legen vor',
      summary: [
        'Die Berichtssaison nimmt in dieser Woche laut einer Übersicht von wallstreetONLINE und der Agentur dpa-AFX deutlich an Fahrt auf. Als Höhepunkt gilt der Mittwoch: Tesla und Meta veröffentlichen dann ihre Quartalszahlen, ebenso der deutsche Softwarekonzern SAP.',
        'Bei Tesla blicken Anleger vor allem auf die Profitabilität des Fahrzeuggeschäfts. Bei Meta steht im Fokus, ob sich die hohen KI-Investitionen im Werbegeschäft auszahlen. SAP wiederum muss beim Cloudgeschäft liefern. Bereits am Dienstag berichtet mit Netflix ein weiteres Schwergewicht, zum Wochenschluss folgen American Express sowie die Energiekonzerne Eni und SLB.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Ergebnis unter hoher Bewertung wirkt anders als eines unter niedriger: Schon kleine Enttäuschungen können dann für große Kursbewegungen sorgen.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['tesla', 'meta', 'sap'],
      sources: [
        {
          label:
            'wallstreet-online, 18.10.2026: „Earnings der kommenden Woche: Earnings-Vorschau: Tesla, Meta, Netflix und SAP stehen im Fokus der Analysten!“',
          url: 'https://www.wallstreet-online.de/nachricht/21542281-earnings-kommenden-woche-earnings-vorschau-tesla-meta-netflix-sap-stehen-fokus-analysten',
        },
      ],
    },
  ],
  further: [
    {
      headline:
        'KI-Geräte von Apple, Amazon und Meta geraten ins Visier von US-Abhörgesetzen',
      summary: [
        'Immer mehr KI-Geräte hören laut einem Bericht des Senders CNBC ununterbrochen mit, und US-Juristen sehen darin ein wachsendes rechtliches Risiko. Betroffen sind neue Produkte von Apple, Amazon und Meta, die Gespräche automatisch zusammenfassen oder protokollieren.',
        'Mehrere Bundesstaaten definieren eine unerlaubte Abhörung sehr weit, unabhängig davon, ob eine Aufnahme gespeichert wird. Nach Einschätzung von Juristen könnte deshalb teils schon die Nutzerin oder der Nutzer selbst haftbar werden – nicht nur der Hersteller des Geräts.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Neue Geräte wie Smart-Glasses oder smarte Uhren sind für Apple, Amazon und Meta ein eigenes Wachstumsfeld – ein ungeklärtes Rechtsrisiko kann dieses Geschäft unmittelbar bremsen.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['apple', 'amazon', 'meta'],
      sources: [
        {
          label:
            'CNBC, 18.10.2026, 08:00 Uhr EDT: „Always on, always listening: New AI devices are pushing legal limits and could put users in jeopardy“',
          url: 'https://www.cnbc.com/2026/10/18/ai-wearables-privacy-wiretap-laws.html',
        },
      ],
    },
  ],
}
