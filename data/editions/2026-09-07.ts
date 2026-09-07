import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-09-07.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-09-07 00:17 UTC
 */
export const edition: DailyEdition = {
  date: '2026-09-07',
  intro:
    'Die EZB steuert am Donnerstag auf eine Zinserhöhung zu, OPEC+ bremst die Förderung, und HPE zeigt: Rekordzahlen schützen nicht vor Kursverlusten.',
  top: [
    {
      headline: 'EZB vor Zinserhöhung: Der Markt traut ihr mehr zu als die Ökonomen',
      summary: [
        'Die EZB entscheidet am Donnerstag über die Zinsen. Ökonomen erwarten laut wallstreet-online einen Schritt um 25 Basispunkte auf 2,5 Prozent und danach eine Pause bis 2027.',
        'Die an den Terminmärkten eingepreiste Erwartung geht weiter: Sie deutet auf rund drei weitere Erhöhungen bis Mitte 2027 hin, was den Einlagensatz auf 3,0 Prozent triebe.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Zeigt den Unterschied zwischen einer Ökonomenumfrage und einer aus Terminkontrakten abgeleiteten Markterwartung – und dass beide falschliegen können.',
      relatedTopics: ['notenbanken-geldpolitik', 'staatsanleihe'],
      relatedSymbols: ['dax', 'euro-stoxx-50'],
      sources: [
        {
          label:
            'wallstreetONLINE Redaktion, Nachricht vom 4.9.2026: „Mehr EZB-Erhöhungen erwartet: Der Markt erwartet viel härtere EZB-Schritte als die Experten“',
          url: 'https://www.wallstreet-online.de/nachricht/21335740-ezb-erhoehungen-erwartet-markt-erwartet-haertere-ezb-schritte-experten',
        },
      ],
    },
    {
      headline: 'OPEC+ bricht die Serie: keine höhere Förderquote für Oktober',
      summary: [
        'Sieben Kernstaaten um Saudi-Arabien und Russland heben die Ölquote für Oktober erstmals seit Herbst nicht an – die monatliche Erhöhungsserie pausiert.',
        'Als Grund nennt die Meldung, dass die reale Förderung wegen des Iran-Kriegs und einer Blockade der Straße von Hormus ohnehin hinter der Quote zurückgeblieben war.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zeigt, dass eine Förderquote eine politische Zielgröße ist und nicht automatisch die tatsächlich am Markt ankommende Ölmenge widerspiegelt.',
      relatedTopics: ['rohstoffe', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['brent', 'wti'],
      sources: [
        {
          label:
            'dpa-AFX über finanzen.at, Meldung vom 6.9.2026: „Ölkartell verzichtet auf Anhebung der Produktionsziele“',
          url: 'https://www.finanzen.at/nachrichten/aktien/oelkartell-verzichtet-auf-anhebung-der-produktionsziele-1036524912',
        },
      ],
    },
    {
      headline:
        'HPE übertrifft alle Erwartungen – die Aktie fällt trotzdem um 3,3 Prozent',
      summary: [
        'Umsatz (12,2 Mrd. Dollar, +33 Prozent) und Gewinn je Aktie (1,11 statt erwarteter 0,94 Dollar) liegen bei HPE klar über den Schätzungen, die Jahresprognose wurde angehoben.',
        'Die Aktie fiel trotzdem um rund 3,3 Prozent – warum, benennt die Quelle nicht; das Kurs-Gewinn-Verhältnis liegt danach bei rund 12,8, das PEG-Verhältnis bei etwa 0,5.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Beispiel dafür, dass eine Kursreaktion stärker von vorab im Kurs steckenden Erwartungen abhängen kann als von den tatsächlichen Zahlen selbst.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['sp500'],
      sources: [
        {
          label:
            'onvista, Aktien-Analysen vom 3.9.2026, 15:22 Uhr: „HPE: Warum der Rücksetzer nach Rekordzahlen reizt“',
          url: 'https://www.onvista.de/news/2026/09-03-hpe-warum-der-ruecksetzer-nach-rekordzahlen-reizt-40338625-19-26549607',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'International Seaways erhöht die Dividende um 556 Prozent',
      summary: [
        'Der Reeder zahlt statt 0,77 nun 5,05 Dollar Quartalsdividende, davon nur 0,12 Dollar regulär – der Rest ist eine variable Sonderausschüttung aus Rekordgewinnen.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Zeigt, dass eine hohe Renditeangabe genau danach fragen lässt, welcher Anteil fest zugesagt und welcher von einer zyklischen Gewinnlage abhängig ist.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'wallstreetONLINE Redaktion, Dividenden-Radar vom 6.9.2026: „International Seaways glänzt mit 20 % Rendite – wie nachhaltig ist das?“',
          url: 'https://www.wallstreet-online.de/nachricht/21341525-dividenden-radar-international-seaways-glaenzt-20-rendite-nachhaltig-das',
        },
      ],
    },
    {
      headline:
        'Silber vor einer entscheidenden Woche: Die Ratio zu Gold verrät mehr als der Kurs',
      summary: [
        'Silber notiert bei rund 66 Dollar, die Gold-Silber-Ratio liegt bei 67 statt im langfristigen Schnitt von 60 – am 11. und 16. September entscheiden US-Daten über die Richtung.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Erklärt, dass eine Ratio zwei Preise zueinander einordnet, aber keine Aussage über die künftige Kursrichtung eines der beiden Werte trifft.',
      relatedTopics: ['rohstoffe', 'risiko-und-rendite'],
      relatedSymbols: ['silber', 'gold'],
      sources: [
        {
          label:
            'wallstreetONLINE Redaktion, Silberpreis-Prognose vom 6.9.2026: „Anleger bangen um Silberrallye: Warum dieser Freitag für Silber alles ändern könnte“',
          url: 'https://www.wallstreet-online.de/nachricht/21340495-anleger-bangen-silberrallye-silberpreis-prognose-freitag-silber-aendern',
        },
      ],
    },
    {
      headline: 'Gold-Futures: Der Spekulanten-Anteil bleibt nahe einem Rekord',
      summary: [
        'CoT-Daten zeigen einen Spekulanten-Anteil von 64 Prozent am Open Interest, kaum unter dem Rekord der Vorwoche von 65 Prozent – ein Risikomaß, keine Kursprognose.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Vermittelt, dass eine einseitige Positionierung am Terminmarkt die Schwankungsbreite eines Preises erhöhen kann, ohne dessen Richtung vorherzusagen.',
      relatedTopics: ['rohstoffe', 'risiko-und-rendite'],
      relatedSymbols: ['gold'],
      sources: [
        {
          label:
            'Goldreporter, CoT-Analyse vom 5.9.2026: „Goldpreis bleibt volatil – Spekulanten-Anteil im US-Goldhandel weiter hoch“',
          url: 'https://www.goldreporter.de/goldpreis-bleibt-volatil-spekulanten-anteil-im-us-goldhandel-weiter-hoch/cot/261599/',
        },
      ],
    },
  ],
}
