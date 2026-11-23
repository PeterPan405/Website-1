import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-11-23.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-11-23 00:18 UTC
 */
export const edition: DailyEdition = {
  date: '2026-11-23',
  intro:
    'China, Südkorea und Taiwan stützen ihre Börsen, der Iran-Konflikt eskaliert am Golf, und Argentiniens Staatsanleihen stehen stark unter Druck.',
  top: [
    {
      headline: 'China, Südkorea und Taiwan stützen ihre Börsen',
      summary: [
        'Die Börsen in Shanghai, Shenzhen und Peking senken ab dem 30. November die Mindestdeckung für kreditfinanzierte Aktienkäufe von 100 auf 80 Prozent. Anleger können sich damit mit denselben Sicherheiten mehr Geld leihen.',
        'Das Volumen ausstehender Wertpapierkredite ist seit Ende Juni um mehr als 20 Prozent auf rund 2,2 Billionen Yuan gefallen. Südkorea und Taiwan kündigten eigene Maßnahmen gegen die Kursverluste an.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Niedrigere Sicherheitsanforderungen erhöhen den Hebel im Markt: Mit weniger eigenem Kapital lassen sich größere Positionen halten, das verstärkt Kursbewegungen in beide Richtungen.',
      relatedTopics: ['risiko-und-rendite', 'aktien-laender-branchen'],
      relatedSymbols: ['hang-seng', 'kospi', 'taiex'],
      sources: [
        {
          label:
            'Handelsblatt, 22.11.2026, 13:34 Uhr: „Börse: Chinas Börsen lockern Regeln für Wertpapierkredite"',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/boerse-inside/china-boersen-anleger-koennen-sich-ab-30-november-mehr-geld-fuer-aktien-leihen/100271866.html',
        },
        {
          label:
            'WirtschaftsWoche, 22.11.2026, 14:01 Uhr: „Aktien: Chinas Börsen lockern Regeln für Wertpapierkredite"',
          url: 'https://www.wiwo.de/finanzen/boerse/aktien-chinas-boersen-lockern-regeln-fuer-wertpapierkredite/100271869.html',
        },
      ],
    },
    {
      headline: 'Iran-Konflikt: Neue Angriffe auf Saudi-Arabien und Bahrain',
      summary: [
        'Die von Saudi-Arabien geführte Koalition fing am Wochenende eine Drohne nahe Riad ab. Am Samstagabend wehrten Luftabwehrsysteme zudem eine ballistische Rakete Richtung der Westregion ab. Verantwortlich gemacht werden Huthi-Rebellen aus dem Jemen.',
        'Bahrains Innenministerium meldete einen iranischen Angriff auf eine zivile Industrieanlage mit zwei Verletzten. Iranische Staatsmedien sprachen zudem vom Abschuss einer US-Drohne, was das US-Zentralkommando bislang nicht kommentierte. Außenminister Abbas Araghchi erklärte, Iran bleibe offen für eine verhandelte Lösung mit den USA.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Der Krieg zwischen den USA, Israel und dem Iran dauert seit Ende Februar an und betrifft die Straße von Hormus, durch die ein großer Teil der weltweiten Öltransporte läuft.',
      relatedTopics: ['rohstoffe', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['brent', 'wti'],
      sources: [
        {
          label:
            'CNBC, 22.11.2026, 13:25 Uhr: „Saudi Arabia, Bahrain report new attacks as Iran says it remains open to a deal with U.S."',
          url: 'https://www.cnbc.com/2026/11/22/saudi-houthi-bahrain-iran-attacks-araghchi-talks.html',
        },
      ],
    },
    {
      headline: 'Argentinien: Druck auf Staatsanleihen wächst',
      summary: [
        'Argentiniens Staatsanleihen mit Laufzeit 2030 und 2035 verloren am Freitag bis 16:15 Uhr New Yorker Zeit jeweils mehr als 2,5 Cent je Dollar Nennwert – laut Bloomberg-Indikativkursen die größten Verluste unter allen Schwellenländeranleihen an diesem Tag.',
        'Der Risikoaufschlag gegenüber US-Staatsanleihen stieg laut JPMorgan-Index erstmals seit zwei Jahren über 1000 Basispunkte. Seit Anfang August haben Argentiniens Dollaranleihen rund 20 Prozent an Wert verloren.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Ein Risikoaufschlag über 1000 Basispunkten gilt als Signal erhöhter Ausfallgefahr und spiegelt Zweifel der Anleger an Präsident Mileis Wiederwahlchancen 2027.',
      relatedTopics: ['staatsanleihe', 'schulden-und-kredit'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'Handelsblatt, 22.11.2026, 11:10 Uhr: „Argentinien: Milei unter Zugwang – Druck auf Staatsanleihen wächst"',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/anleihen/argentinien-milei-unter-zugwang-druck-auf-staatsanleihen-waechst/100271849.html',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'GTA VI: Rekordumsatz am ersten Verkaufstag',
      summary: [
        'Rockstar Games meldete für den Verkaufsstart von GTA VI am 19. November einen Rekordumsatz von rund 3,8 Milliarden Dollar an einem einzigen Tag. Das Spiel erschien für Playstation 5 und Xbox Series X/S.',
        'Allein in den ersten 24 Stunden sahen Zuschauer nach Angaben von Streams Charts rund 125,5 Millionen Stunden GTA-VI-Inhalte auf Twitch, YouTube und Kick. Die gesamte Spielereihe hat weltweit mehr als 470 Millionen Exemplare verkauft.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein hoher Tagesumsatz sagt nichts über die Gewinnspanne: Erst wiederkehrende Einnahmen aus Online-Modus und Ingame-Käufen zeigen, ob sich die hohen Entwicklungskosten auszahlen.',
      relatedTopics: ['wie-funktioniert-der-markt', 'risiko-und-rendite'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'Tagesschau, 21.11.2026, 10:39 Uhr: „GTA VI spielt laut Konzern fast vier Milliarden Dollar am ersten Tag ein"',
          url: 'https://www.tagesschau.de/wirtschaft/unternehmen/milliardengewinn-gta-100.html',
        },
        {
          label:
            "CNBC, 20.11.2026: „'More than just a game': How GTA VI's blockbuster launch fuels a booming content economy\"",
          url: 'https://www.cnbc.com/2026/11/20/gta-vi-launch-streaming-content-economy.html',
        },
      ],
    },
    {
      headline: 'US-Geheimdienstchef warnt vor weiteren Tech-Ausfällen',
      summary: [
        'Geheimdienstdirektor Jay Clayton sagte bei CNN, Modernisierung und Investitionen in Cybersicherheit könnten weiterhin zu Ausfällen führen. Er sprach von „bumps in the road" und riet, sich auf Systemupgrades und Unterbrechungen einzustellen – kurz vor den verkehrsreichen Thanksgiving-Reisetagen.',
        'Zu den jüngsten Ausfällen zählen ein mehrstündiger Ground Stop der FAA nach einem Router-Upgrade, eine Outlook-Störung bei Microsoft und verlangsamte Transaktionen bei JPMorgan Chase. Schon am 17. November hatte Clayton erklärt, es gebe keine Hinweise auf einen koordinierten Cyberangriff.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ausfälle bei Fluglinien, Banken und Cloud-Diensten kurz vor einem der verkehrsreichsten Reisewochenenden des Jahres zeigen, wie verwundbar digitale Infrastruktur geworden ist.',
      relatedTopics: ['risiko-und-rendite', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['microsoft', 'jpmorgan'],
      sources: [
        {
          label:
            "CNBC, 22.11.2026, 17:14 Uhr: „Director of National Intelligence Jay Clayton warns Americans of 'bumps in the road' after tech outages\"",
          url: 'https://www.cnbc.com/2026/11/22/jay-clayton-tech-outages-faa-microsoft-thanksgiving.html',
        },
        {
          label:
            'Just the News, 17.11.2026: „DNI Jay Clayton, FBI downplay prospect of cyberattacks amid major outages"',
          url: 'https://justthenews.com/index.php/politics-policy/dni-jay-clayton-fbi-downplay-prospect-cyberattacks-amid-major-outages',
        },
      ],
    },
  ],
}
