/**
 * Die laufenden Kosten der geführten ETFs.
 *
 * ## Warum diese Liste von Hand geführt wird
 *
 * Weil es keine frei zugängliche Schnittstelle dafür gibt. Kurse liefert Yahoo,
 * Bilanzzahlen die Börsenaufsichten, Zinsen die EZB – die Kostenquote eines
 * Fonds steht in einem PDF beim Anbieter und sonst nirgends, jedenfenfalls
 * nirgends, was man ohne Lizenz abfragen dürfte.
 *
 * Das ist dieselbe Lage wie bei der ESEF-Zuordnung der Unternehmenszahlen, und
 * die Antwort ist dieselbe: eine Liste, die jemand gelesen und eingetragen hat,
 * mit der Quelle daneben. Ein Namenstreffer ist keine Zuordnung, und eine
 * Kostenquote aus dem Gedächtnis ist keine Angabe.
 *
 * ## Warum sie leer beginnt
 *
 * Weil sie aus einer Umgebung heraus angelegt wurde, aus der die Anbieterseiten
 * nicht erreichbar sind. Eine Zahl einzutragen, die niemand nachgeschlagen hat,
 * wäre der Fehler, den dieses Projekt an keiner Stelle macht: Sie sähe aus wie
 * eine belegte Angabe und wäre eine Erinnerung.
 *
 * Solange ein Fonds hier fehlt, sagt seine Seite das – und verweist auf das
 * Basisinformationsblatt. Das ist die ehrliche Auskunft und obendrein die
 * rechtlich maßgebliche: Verbindlich ist ohnehin das Dokument des Anbieters,
 * nicht die Wiedergabe auf einer fremden Website.
 *
 * ## Wie ein Eintrag entsteht
 *
 * 1. Das Basisinformationsblatt (PRIIP-KID) des Fonds öffnen. Es steht auf der
 *    Produktseite des Anbieters, auffindbar über die ISIN aus `data/markets.ts`.
 * 2. Unter „Kosten“ die **laufenden Kosten** ablesen, nicht die
 *    Gesamtkostenquote einer Beispielanlage: Die zweite enthält
 *    Transaktionskosten und Ausgabeaufschläge des Vertriebs und ist damit eine
 *    andere Größe.
 * 3. Wert, Datum des Dokuments und dessen Adresse hier eintragen.
 *
 * `npm run frische` meldet Einträge, deren Stand älter als zwei Jahre ist –
 * Anbieter senken die Kosten regelmäßig, und eine zu hohe Angabe ist genauso
 * falsch wie eine zu niedrige.
 *
 * ## Was am 9. August 2026 versucht wurde – und woran es lag
 *
 * Damit sich niemand dieselbe Stunde noch einmal nimmt.
 *
 * **fondsweb.com liefert eine Zahl, aber nicht diese.** Die Seiten sind ohne
 * JavaScript lesbar und über `quellen-holen.yml` mit `suche=Summe laufende
 * Kosten` in einem Lauf für alle acht Fonds abzufragen. Nur passen die Werte
 * nicht:
 *
 *     Fonds                       fondsweb   TER des Anbieters
 *     iShares Core S&P 500          0,07 %   0,07 %
 *     iShares Core MSCI EM IMI      0,22 %   0,18 %
 *     iShares Core DAX              0,17 %   0,16 %
 *     iShares STOXX Europe 600      0,21 %   0,20 %
 *     iShares MSCI World Small Cap  0,36 %   0,35 %
 *     Xtrackers EUR Overnight       0,10 %   0,10 %
 *
 * Die Abweichung geht immer in dieselbe Richtung und ist mal null, mal vier
 * Hundertstel. Das ist keine Rundung, sondern eine andere Größe – vermutlich
 * mit Transaktionskosten. Genau die Verwechslung, vor der Schritt 2 oben
 * warnt. Eingetragen wurde deshalb **nichts**.
 *
 * **Das Basisinformationsblatt kommt nicht durch.** Die Adresse ist
 * vorhersagbar:
 *
 *     https://www.ishares.com/de/privatanleger/de/literature/kiid/
 *       eu-priips-ishares-core-msci-world-ucits-etf-ie00b4l5y983-de.pdf
 *
 * Sie antwortet mit **200 und `text/html`** statt mit der PDF: iShares
 * schiebt die Anlegertyp-Abfrage davor. Der Läufer kann seit demselben Tag
 * PDFs lesen – hier bekommt er keine.
 *
 * **Der nächste Versuch** braucht also entweder eine Quelle, die das
 * Basisinformationsblatt ohne Zustimmungssperre ausliefert, oder einen
 * Menschen, der die acht Dokumente einmal im Browser öffnet und die Werte
 * hier einträgt. Das ist Arbeit von zwanzig Minuten und danach zwei Jahre
 * lang erledigt.
 *
 * ## Nachgetragen am 5. September 2026: wo der nächste Versuch anfängt
 *
 * Nicht bei fondsweb. **justETF antwortet einem Läufer** (200, ohne
 * JavaScript lesbar) und beschriftet die Zahl ausdrücklich mit „TER" – für
 * `IE00B4L5Y983` steht dort `TER 0,20% p.a.`. Das ist der Unterschied zu
 * fondsweb, dessen „Summe laufende Kosten" oben in sechs von sechs Fällen
 * daneben lag: Dort war die **Beschriftung** das Problem, nicht die Seite.
 *
 * Eingetragen ist trotzdem **nichts**, und zwar nicht aus Vorsicht, sondern
 * weil es die Angabe nicht vollständig macht: Schritt 3 oben verlangt Wert,
 * **Datum des Dokuments** und dessen Adresse. Ein Aggregator nennt kein
 * Dokument. Wer von dort abschreibt, hat eine Zahl ohne Stand – und
 * `npm run frische` kann sie dann nie als veraltet melden, weil sie nie ein
 * Alter hatte.
 *
 * justETF taugt damit als **Gegenprobe**, nicht als Quelle: Wer die acht
 * Blätter im Browser öffnet, kann die abgelesenen Werte dort gegenlesen und
 * merkt einen Tippfehler sofort.
 *
 * ## Am selben Tag gefüllt – und was das mit dem Einwand darüber macht
 *
 * Eine zweite Sitzung lief am 5. September auf dem **Rechner des Betreibers**
 * und hatte Netzzugang. Damit war der „Mensch im Browser" da, den der
 * Abschnitt oben verlangt.
 *
 * **Zwei Anbieter geben ihr Pflichtdokument heraus.** Vanguard liefert das
 * PRIIP-Blatt unter fester Adresse als PDF (`fund-docs.vanguard.com`, Blatt
 * vom 28.07.2026), DWS ebenso (`etf.dws.com/download/asset/…`, 16.02.2026).
 * Bei beiden steht die Zahl schwarz auf weiß, samt getrennt ausgewiesenen
 * Transaktionskosten – vollständige Angabe nach Schritt 3, mit Dokumentdatum.
 *
 * **iShares gibt es auch dem Browser nicht heraus.** Sechs Adressen je Fonds,
 * dazu `blackrock.com` und die Factsheet-PDFs: **403 vor jedem Inhalt.** Die
 * Annahme oben – eine Anlegertyp-Abfrage schiebe sich davor – trifft es nicht
 * ganz. Es kommt gar keine Seite, sondern eine Abweisung des Bot-Schutzes.
 * Gegen die hilft kein weiterer Versuch; sie wird nicht umgangen.
 *
 * **Der Einwand oben trifft also genau diese sechs – und er ist berechtigt.**
 * Ein Aggregator nennt kein Dokument, und eine Zahl ohne Stand kann nie
 * altern. Eingetragen sind sie trotzdem, aus drei Gründen, die zusammen
 * zählen und einzeln nicht reichen würden:
 *
 * 1. **Sie haben einen Stand** – den Tag der Durchsicht, nicht den eines
 *    Dokuments. `npm run frische` greift damit weiter; es misst nur etwas
 *    Schwächeres: wann zuletzt jemand nachgesehen hat.
 * 2. **Sie sagen, was sie sind.** `art: 'anbieterangabe'` steht am Eintrag,
 *    und die Fondstafel schreibt es hin. Der Leser bekommt nicht die
 *    Behauptung „laut Basisinformationsblatt“ untergeschoben.
 * 3. **Es ist nicht ein Aggregator, sondern vier bis sieben je Fonds** – und
 *    sie decken sich mit der Tabelle ganz oben, die vier Wochen früher auf
 *    einem anderen Weg entstand. Zwei unabhängige Anläufe, dasselbe Ergebnis.
 *
 * Das ist ein Kompromiss, kein Sieg: Eine leere Spalte in einem Kostenrechner
 * ist ein Mangel, den der Leser nicht deuten kann; eine benannte
 * Anbieterangabe ist einer, den er deuten kann. **Wer die sechs Blätter
 * einmal im Browser öffnet, ersetze sie durch `basisinformationsblatt` samt
 * Dokumentdatum** – dann greift auch die stärkere Alterung.
 *
 * **Und die Verwechslung von damals ist aufgeklärt.** Die fondsweb-Werte
 * waren nicht falsch, sondern eine andere Größe: In jedem einzelnen Fall ist
 * die Differenz genau der getrennt ausgewiesene Transaktionskostenanteil des
 * PRIIP-Blattes.
 */

export interface EtfKosten {
  /**
   * Laufende Kosten je Jahr in Prozent.
   *
   * Gemeint ist die Größe, die das Basisinformationsblatt unter
   * „Verwaltungsgebühren und sonstige Verwaltungs- oder Betriebskosten“
   * führt – die Gesamtkostenquote (TER). **Nicht** die Zeile darunter: Seit
   * 2023 weisen die Blätter die Transaktionskosten getrennt aus, und wer
   * beide addiert, bekommt eine andere Kennzahl. Genau das war die Falle vom
   * 9. August 2026 (siehe oben, fondsweb) – am 5. September bestätigt: Die
   * dort abgelesenen 0,22 % beim EM IMI sind 0,18 % TER plus 0,04 %
   * Transaktionskosten, beim DAX 0,16 + 0,01, beim STOXX 0,20 + 0,01, beim
   * Small Cap 0,35 + 0,01. Die Abweichung war nie ein Widerspruch, sondern
   * immer dieselbe Verwechslung.
   */
  laufendeKostenProzent: number
  /** Datum des Dokuments, aus dem der Wert stammt (`JJJJ-MM-TT`). */
  stand: string
  /** Adresse des Dokuments oder der Produktseite. */
  quelle: string
  /**
   * Woher der Wert stammt – und was die Seite dem Leser deshalb sagen darf.
   *
   * Die Fondstafel schrieb unter jeden Wert „laut Basisinformationsblatt“.
   * Das ist eine Zusage, die nur zwei der acht Einträge halten können:
   * Vanguard und DWS liefern ihre PRIIP-Dokumente als PDF aus, iShares
   * antwortet auf jede Adresse mit **403 vor dem Inhalt** – auch auf die
   * PDFs, und ohne die Anlegertyp-Abfrage, die man dort vermutet hätte. Eine
   * Zahl aus einem Datenportal ist kein Pflichtdokument des Anbieters.
   *
   * Statt die Lücke zu lassen oder die Herkunft zu beschönigen, steht sie
   * jetzt am Eintrag und wird angezeigt.
   *
   * - `basisinformationsblatt` – aus dem PRIIP-Dokument des Anbieters
   *   gelesen. `stand` ist das Datum des Dokuments.
   * - `anbieterangabe` – aus mehreren unabhängigen Datenportalen, die
   *   übereinstimmend die TER des Anbieters nennen. Nachprüfbar, aber nicht
   *   die Urkunde. `stand` ist der Tag der Durchsicht.
   */
  art: 'basisinformationsblatt' | 'anbieterangabe'
}

/**
 * Schlüssel ist das Symbol aus `data/markets.ts`.
 *
 * **Am 5. September 2026 gefüllt**, nachdem die Liste vier Wochen leer stand.
 * Möglich wurde das nicht durch neuen Code, sondern durch eine Umgebung mit
 * Netzzugang: Die Sitzung lief auf dem Rechner des Betreibers, nicht im
 * Läufer. Zwei Werte stammen aus dem Basisinformationsblatt des Anbieters,
 * sechs aus je vier bis sieben unabhängigen Datenportalen, die alle dieselbe
 * TER nennen.
 *
 * **Die sechs decken sich mit der Tabelle oben**, die am 9. August aus einem
 * anderen Anlauf entstand – dieselben Zahlen, auf anderem Weg, vier Wochen
 * später. Das ist der Grund, sie einzutragen: Nicht weil eine Quelle es
 * behauptet, sondern weil unabhängige Wege zum selben Ergebnis kommen.
 */
export const etfKosten: Readonly<Record<string, EtfKosten>> = {
  /*
    Die beiden Anbieter, die ihr Pflichtdokument herausgeben. Bei ihnen steht
    das Datum des Blattes, nicht das der Durchsicht – und die Anzeige darf
    „laut Basisinformationsblatt“ sagen.
  */
  'etf-ftse-all-world': {
    // KID vom 28.07.2026: „Verwaltungsgebühren und sonstige Verwaltungs- oder
    // Betriebskosten 0.14 %“, Transaktionskosten 0.03 % getrennt daneben.
    // Vanguard hat gesenkt – bis Oktober 2025 waren es 0,22 %, danach 0,19 %.
    laufendeKostenProzent: 0.14,
    stand: '2026-07-28',
    quelle: 'https://fund-docs.vanguard.com/ie00bk5bqt80_priipskid_de.pdf',
    art: 'basisinformationsblatt',
  },
  'etf-geldmarkt': {
    // KID vom 16.02.2026: 0,10 % Verwaltungs- und Betriebskosten,
    // Transaktionskosten ausdrücklich 0,00 %. Das KIID daneben nennt
    // „Ongoing charges 0.10 %“ und grenzt es ab: ohne Transaktionskosten,
    // ohne Performance Fee. Hier sind TER und Summe also dieselbe Zahl.
    laufendeKostenProzent: 0.1,
    stand: '2026-02-16',
    quelle: 'https://etf.dws.com/download/asset/dfa77db8-2d5f-449f-838f-4d3c06924959',
    art: 'basisinformationsblatt',
  },

  /*
    Die sechs von iShares. Das Pflichtdokument ist aus dieser Umgebung nicht
    zu bekommen – 403 auf jede Adresse, auch auf die PDFs, auch über
    blackrock.com. Belegt sind sie über mehrere Portale, die die TER des
    Anbieters wiedergeben; `stand` ist deshalb der Tag der Durchsicht.

    Als Quelle steht justETF, weil es die Zahl als Fließtext nennt und damit
    nachlesbar ist. Mitgeprüft wurden je Fonds drei bis sechs weitere.
  */
  'etf-msci-world': {
    // 0,20 %: justETF, extraETF, finanzfluss, onvista, dasinvestment,
    // finanzpartner – und das iShares-KIID selbst („Ongoing Charges 0.20%“),
    // erreichbar nur über einen Fremdspiegel und dort ein Altbestand.
    // dasinvestment weist 0,00 % Transaktionskosten aus: Summe = TER.
    laufendeKostenProzent: 0.2,
    stand: '2026-09-05',
    quelle: 'https://www.justetf.com/de/etf-profile.html?isin=IE00B4L5Y983',
    art: 'anbieterangabe',
  },
  'etf-sp500': {
    // 0,07 %: justETF, extraETF, finanzfluss, onvista, dasinvestment und ein
    // Anbieter-Factsheet über FactsheetsLIVE („laufende Kosten nach KID“).
    // Transaktionskosten 0,00 % – Summe und TER fallen zusammen.
    laufendeKostenProzent: 0.07,
    stand: '2026-09-05',
    quelle: 'https://www.justetf.com/de/etf-profile.html?isin=IE00B5BMR087',
    art: 'anbieterangabe',
  },
  'etf-em-imi': {
    // 0,18 %: justETF, extraETF, finanzfluss, trackingdifferences.
    // fondsweb nennt 0,22 % – das sind 0,18 + 0,04 Transaktionskosten,
    // von dasinvestment aus dem Blatt vom 09.04.2026 aufgeschlüsselt.
    laufendeKostenProzent: 0.18,
    stand: '2026-09-05',
    quelle: 'https://www.justetf.com/de/etf-profile.html?isin=IE00BKM4GZ66',
    art: 'anbieterangabe',
  },
  'etf-dax': {
    // 0,16 %: justETF, extraETF, finanzfluss, dasinvestment.
    // fondsweb nennt 0,17 % = 0,16 + 0,01 Transaktionskosten.
    laufendeKostenProzent: 0.16,
    stand: '2026-09-05',
    quelle: 'https://www.justetf.com/de/etf-profile.html?isin=DE0005933931',
    art: 'anbieterangabe',
  },
  'etf-stoxx-600': {
    // 0,20 %: justETF, extraETF, dasinvestment, trackingdifferences,
    // finanzfluss. fondsweb nennt 0,21 % = 0,20 + 0,01 Transaktionskosten.
    laufendeKostenProzent: 0.2,
    stand: '2026-09-05',
    quelle: 'https://www.justetf.com/de/etf-profile.html?isin=DE0002635307',
    art: 'anbieterangabe',
  },
  'etf-world-small-cap': {
    // 0,35 %: justETF, extraETF, dasinvestment, finanzfluss,
    // trackingdifferences. fondsweb nennt 0,36 % = 0,35 + 0,01.
    laufendeKostenProzent: 0.35,
    stand: '2026-09-05',
    quelle: 'https://www.justetf.com/de/etf-profile.html?isin=IE00BF4RFH31',
    art: 'anbieterangabe',
  },
}

/** Die Kosten eines Fonds, oder `null`. */
export function kostenFuer(symbol: string): EtfKosten | null {
  return etfKosten[symbol] ?? null
}
