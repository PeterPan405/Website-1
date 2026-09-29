import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-09-25.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-09-25 04:49 UTC
 */
export const edition: DailyEdition = {
  date: '2026-09-25',
  intro:
    'US-Anleiherenditen springen auf ein Mehrjahreshoch, der Ölpreis pendelt zwischen Hormus-Drohkulisse und saudischem Angebot, dazu ein Bankenstresstest und Gold.',
  top: [
    {
      headline: 'US-Anleiherenditen steigen auf Mehrjahreshoch',
      summary: [
        'Die Renditen US-amerikanischer Staatsanleihen sind am Donnerstag laut wallstreet-online auf das höchste Niveau seit Jahren gestiegen.',
        'Am Freitag spricht um 11:15 Uhr Fed-Vertreter John C. Williams, um 14:30 Uhr veröffentlichen die USA die Auftragseingänge langlebiger Güter.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Steigende Anleiherenditen verteuern Kredite und gelten als Signal dafür, welche Zinserwartungen Anleger derzeit einpreisen.',
      relatedTopics: ['staatsanleihe', 'notenbanken-geldpolitik'],
      relatedSymbols: ['dow-jones', 'nasdaq-100'],
      sources: [
        {
          label:
            'wallstreet-online, Nachrichten: Aktien & Indizes, Stand 25.09.2026, 00:11 Uhr (GMT): „Die Renditen von US-Staatsanleihen sind am Donnerstag auf ein seit Jahren nicht mehr gesehenes Niveau gestiegen.“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
        {
          label:
            'wallstreet-online, Wirtschaftskalender „Kommende Termine“, Stand 25.09.2026, 00:11 Uhr (GMT)',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Ölpreis baut Anstieg seit Dienstag auf zehn Prozent aus',
      summary: [
        'Der Ölpreis hat seinen Anstieg seit Dienstagabend bis Donnerstag laut dpa-AFX auf zehn Prozent ausgebaut.',
        'Zuvor war der Preis in derselben Woche mehrfach gedreht: Saudi-Arabien erhöhte nach eigenen Angaben das Angebot, der Iran stellte eine Öffnung der Straße von Hormus in Aussicht und nannte dann einen eigenen Preis dafür.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Schwankungen dieser Größenordnung binnen weniger Tage zeigen, wie stark politische Ankündigungen den Ölpreis bewegen können, ohne dass sich Fördermengen ändern.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent', 'wti'],
      sources: [
        {
          label:
            'wallstreet-online, Rohstoffnachrichten, Meldung vom 24.09.2026, dpa-AFX: „Ölpreise bauen Anstieg seit Dienstagabend auf zehn Prozent aus“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
        {
          label:
            'wallstreet-online, Gefragte Nachrichten, Meldung vom 23.09.2026, wallstreetONLINE Redaktion: „Iran nennt seinen Preis für Hormus – Brent fällt unter 99 US-Dollar“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline:
        'Netanjahu verteidigt bei UN-Rede Angriffe auf Iran, Delegationen verlassen Saal',
      summary: [
        'Israels Regierungschef Netanjahu verteidigte am Donnerstag vor der UN-Generalversammlung in New York die Angriffe auf iranische Atomanlagen und sagte, das iranische Volk werde frei sein.',
        'Mehrere Delegationen verließen laut dpa-AFX während seiner Rede den Saal, die Rede fand unter Protest statt.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Nahost-Ereignisse wie diese wirken erfahrungsgemäß auf den Ölpreis, weil ein großer Teil der weltweiten Ölexporte durch die Region verläuft.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent'],
      sources: [
        {
          label:
            'onvista, Aktuelle News, Meldung vom 24.09.2026, 20:47 Uhr, dpa-AFX: „ROUNDUP 2/Konfrontiert mit Protest: Netanjahu verteidigt Kriege bei UN“',
          url: 'https://www.onvista.de/news/',
        },
        {
          label:
            'wallstreet-online, Politik Nachrichten, Meldung vom 24.09.2026, dpa-AFX: „Netanjahu verteidigt Angriffe auf iranische Atomanlagen“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Stresstest bescheinigt kleinen Banken robustes Kapitalpolster',
      summary: [
        'Ein gemeinsamer Stresstest von BaFin und Bundesbank bescheinigt kleinen und mittelgroßen Banken sowie Sparkassen in Deutschland trotz wirtschaftlicher und geopolitischer Belastungen ein robustes Kapitalpolster.',
      ],
      category: 'Vorsorge',
      whyItMatters:
        'Ein robustes Testergebnis betrifft die Institute, bei denen viele Sparerinnen und Sparer ihr Giro- oder Tagesgeldkonto führen.',
      relatedTopics: ['einlagensicherung'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'Deutsche Bundesbank, Pressemitteilungen, Meldung vom 24.09.2026: „LSI-Stresstest 2026: Banken und Sparkassen mit robustem Kapitalpolster“',
          url: 'https://www.bundesbank.de/de/presse/pressenotizen',
        },
      ],
    },
    {
      headline: 'Goldpreis fällt auf 50-Tage-Linie, größter Gold-ETF wächst wieder',
      summary: [
        'Der Goldpreis ist laut Goldreporter auf seine 50-Tage-Linie gefallen, weil die US-Renditen steigen.',
        'Der größte Gold-ETF GLD baute seine Bestände zuletzt dagegen wieder leicht aus und hält knapp 1.052 Tonnen Gold, während der Silber-ETF SLV kurzfristig Bestände verlor.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Steigende Zinsen erhöhen die Opportunitätskosten des zinslosen Golds – ein Grund, warum Goldpreis und Anleiherenditen häufig gegenläufig reagieren.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['gold'],
      sources: [
        {
          label:
            'Goldreporter, Top-News / ETF, Meldung vom 24.09.2026: „Goldpreis fällt auf 50-Tage-Linie – US-Renditen steigen“ und „Große Gold- und Silber-ETFs ziehen wieder Kapital an“',
          url: 'https://www.goldreporter.de/',
        },
      ],
    },
  ],
}
