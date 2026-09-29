import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-09-27.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-09-27 05:28 UTC
 */
export const edition: DailyEdition = {
  date: '2026-09-27',
  intro:
    'Huthi-Drohnen treffen Riad, der Iran sieht die USA am Zug bei Hormus, US-Autobauer kappen Rabatte, und Gold fällt vor dem Terminverfall.',
  top: [
    {
      headline: 'Huthi-Miliz greift Riad an, Iran sieht USA am Zug bei Hormus',
      summary: [
        'Die Huthi-Miliz griff nach Angaben von dpa-AFX am Samstag die saudi-arabische Hauptstadt Riad mit Drohnen an; der UN-Sicherheitsrat verurteilte die Angriffe auf Saudi-Arabien.',
        'Der Iran erklärte laut finanzen.net und wallstreet-online, die USA seien nun am Zug, um eine Öffnung der Straße von Hormus zu ermöglichen; Brent notierte am Sonntagmorgen unverändert bei 97,47 US-Dollar je Fass.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Durch die Straße von Hormus wird ein großer Teil der weltweiten Ölexporte verschifft, weshalb der Ölpreis schon auf Ankündigungen reagiert, nicht erst auf tatsächlich ausgefallene Lieferungen.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent', 'wti'],
      sources: [
        {
          label:
            'wallstreet-online, Rohstoffnachrichten, Meldung vom 26.09.2026, dpa-AFX: „ROUNDUP/Militär: Huthi-Miliz greift saudische Hauptstadt Riad mit Drohnen an“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
        {
          label:
            'finanzen.net, News-Ticker, Meldung vom 27.09.2026, 06:57 Uhr: „Straße von Hormus: Iran schiebt den Ball bei Öffnung den USA zu“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'US-Autobauer schränken Rabatte bei Neuwagen ein',
      summary: [
        'Mehrere US-Autobauer – darunter Stellantis, General Motors, Toyota, Tesla und Rivian – schränken laut wallstreet-online ihre Rabatte bei Neuwagen ein.',
        'Das erschwert Käufern den Preisvergleich; Gebrauchtwagen und Elektroautos könnten dadurch nach Einschätzung der Quelle an Attraktivität gewinnen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Weniger Rabatt bei Neuwagen verändert die relative Preisattraktivität von Gebraucht- und Elektrofahrzeugen und damit ein zentrales Kaufkriterium vieler Haushalte.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['tesla', 'toyota'],
      sources: [
        {
          label:
            'wallstreet-online, Nachrichten: Aktien & Indizes, Meldung vom 26.09.2026: „Keine Schnäppchen mehr? Darum drehen US-Autobauer beim Autokauf die Regeln um“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Goldpreis fällt auf 4.283 Dollar vor dem Terminverfall',
      summary: [
        'Der Goldpreis ist laut Goldreporter auf 4.283 US-Dollar je Feinunze gefallen; am Terminmarkt hat das Managed Money seine Long-Positionen vor dem bevorstehenden September-Verfall reduziert.',
        'Für den 30. September nennt wallstreet-online die US-Konsumausgabendaten (PCE) als möglichen weiteren Belastungstest für den Goldpreis.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Ein Terminverfall zwingt Marktteilnehmer, Positionen zu schließen oder zu verlängern, was kurzfristige Kursbewegungen auslösen kann, die nichts mit der langfristigen Nachfrage nach Gold zu tun haben müssen.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['gold'],
      sources: [
        {
          label:
            'Goldreporter, Analyse, Meldung vom 26.09.2026: „Der Goldpreis ist auf 4.283 USD zurückgefallen. Am US-Terminmarkt reduzierte das Managed Money seine Long-Positionen. Jetzt steht der September-Verfall bevor.“',
          url: 'https://www.goldreporter.de/',
        },
        {
          label:
            'wallstreet-online, Rohstoffnachrichten, Meldung vom 26.09.2026, wallstreetONLINE Redaktion: „Goldpreis-Prognose: Lösen die PCE-Daten am 30. September ein großes Beben aus?“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Apple soll 5,7 Milliarden Dollar in Patentstreit zahlen',
      summary: [
        'Ein Gericht hat Apple laut dpa-AFX zu einer Zahlung von 5,7 Milliarden Dollar in einem Patentverfahren verurteilt.',
        'Kläger, betroffenes Patent und ob das Urteil rechtskräftig ist, nennt die Meldung nicht.',
      ],
      category: 'Steuern & Recht',
      whyItMatters:
        'Patentverfahren dieser Größenordnung zeigen, wie hoch Schadenersatzforderungen gegenüber selbst sehr großen Technologiekonzernen ausfallen können, auch wenn Urteile oft noch angefochten werden.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['apple'],
      sources: [
        {
          label:
            'onvista, Aktuelle News, Meldung vom 26.09.2026, 23:36 Uhr, dpa-AFX: „Patent-Urteil: Apple soll 5,7 Milliarden Dollar zahlen“',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
  ],
}
