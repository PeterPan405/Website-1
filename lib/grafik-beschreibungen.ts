import {
  ANSTECKUNGSWEGE,
  BEWERTUNGSSTUFEN,
  ERSATZANSAETZE,
  KOSTENEBENEN,
  MESSGROESSEN,
  PARITAETEN,
  PARKPLAETZE,
  BUNDESPAPIERE,
  KASKADE,
  reiheAlsText,
  VERKAUFSGRUENDE,
  ZUGANGSWEGE,
} from '@/components/content/figures/kastenreihen'
import { figureMeta } from '@/data/figures'
import { kurseinbrueche } from '@/data/crashes'
import { indexZusammensetzung } from '@/data/index-zusammensetzung'
import { kurs, zinsschock } from '@/lib/anleihen'
import { ewigeRente, noetigeBruttorendite, schuldenquotenpfad } from '@/lib/bewertung'
import {
  calculateBudget,
  calculateCompoundInterest,
  calculatePension,
  pensionDefaults,
  recoveryGainPercent,
} from '@/lib/finance'
import {
  formatCurrency,
  formatCurrencyRounded,
  formatNumber,
  formatPercent,
} from '@/lib/format'
import {
  inflationsbeispiel,
  kaufkraftreihe,
  realzinsbeispiel,
} from '@/lib/inflations-beispiele'
import {
  auswerten,
  rateBeiTilgungssatz,
  restschuldNach,
  tilgungsplan,
} from '@/lib/kredit'
import { marginverlauf } from '@/lib/margin'
import {
  absicherungJahre,
  absicherungRendite,
  absicherungZinsdifferenz,
  aktionsmonate,
  aktionszins,
  anleiheBeispiel,
  anleiheLaufzeiten,
  anleiheMarktzins,
  anleiheNeuerZins,
  basiseffektSprungMonat,
  basiseffektSprungProzent,
  bewertungAenderung,
  bewertungBasiszins,
  bewertungKapitalkosten,
  bewertungWachstum,
  bitcoinBloeckeJeEpoche,
  bitcoinMinutenJeBlock,
  bitcoinObergrenze,
  bitcoinStartbelohnung,
  bitcoinStartjahr,
  dauerzins,
  derivatEinsatz,
  derivatSicherheitssaetze,
  dynamikJahre,
  dynamikRendite,
  dynamikStartrate,
  dynamikSteigerungen,
  effektiverSteuersatz,
  einlagensicherungErhoeht,
  einlagensicherungGrenze,
  entnahmeraten,
  folgezins,
  handelszeiten,
  haushaltAusgaben,
  haushaltEinnahmen,
  goldEinsatz,
  goldWertsteigerungen,
  hebelAusgang,
  hebelMehrRate,
  hebelMehrRendite,
  hebelAnstieg,
  hebelFaktoren,
  immobilieAnfangstilgung,
  immobilieDarlehenszins,
  immobilieDarlehensquote,
  immobilieEigenkapitalquoten,
  immobilieInstandhaltung,
  immobilieJahresmiete,
  immobilieKaufpreis,
  immobilieMietausfallProzent,
  immobilieNebenkostenProzent,
  immobilieVerwaltung,
  immobilieWertaenderungen,
  immobilienkredit,
  immobilienTilgungssaetze,
  immobilienZinsbindung,
  indexDividendenrendite,
  indexJahre,
  indexKursrendite,
  indexQuellensteuer,
  inflationNominalrenditen,
  kostenstufen,
  marginErsteinschussProzent,
  marginKontraktwert,
  marginKursverlauf,
  marginUntergrenzeProzent,
  kostenfaelle,
  kostenFondsquote,
  optionBasis,
  optionVolatilitaeten,
  ordergroessen,
  portfolioDepotwert,
  portfolioMarktrueckgang,
  portfolioQuoten,
  renteAbschlagJeMonat,
  renteErhoehungProzent,
  renteFreibetragJahre,
  rentenBeispiel,
  renteZuschlagJeMonat,
  risikoRueckgaenge,
  schuldenDifferenzen,
  schuldenJahre,
  schuldenStartquote,
  schuldenWachstum,
  sequenzEntnahme,
  sequenzRenditen,
  sequenzStartkapital,
  sparerPauschbetrag,
  sparerRenditen,
  sparfall,
  sparplanKurse,
  sparplanRate,
  sparquoteRendite,
  sparquoteZielvielfaches,
  spreadProzent,
  streuungEinzelvolatilitaet,
  streuungKorrelation,
  timingGewinnJeTreffer,
  orderbuchBeispiel,
  orderbuchMarktauftrag,
  ordergebuehrFest,
  portfolioJahre,
  portfolioRenditeAktien,
  portfolioRenditeSicher,
  portfolioStart,
  tilgungszinsen,
  timingAuslassungen,
  timingIndex,
  timingKostenJeRunde,
  verhaltensluecke,
  verteiljahre,
  verteilmonate,
  verteilrendite,
  verteilsumme,
  waehrungEinsatz,
  waehrungKurse,
  waehrungKursgewinn,
  waehrungKursStart,
} from '@/lib/lernszenarien'
import { gewinnschwelle, preis, sensitivitaeten } from '@/lib/optionen'
import { reihenfolgevergleich } from '@/lib/sequenzrisiko'
import { getLiveSeries } from '@/lib/market-live'
import { noetigeTrefferquote, ohneBestePerioden, type Kurspunkt } from '@/lib/timing'

/**
 * Die gerechneten Vorlesefassungen der Grafiken.
 *
 * ## Warum es diese Datei gibt
 *
 * 53 der 135 Grafiken haben in `data/figures.ts` **keine** `description`, und
 * das ist Absicht: Ihre Zahlen kommen aus einem Datensatz. Stünde die
 * Beschreibung dort fest, wäre sie nach der ersten Aktualisierung falsch – und
 * zwar unbemerkt, weil sie niemand sieht, der die Grafik sehen kann. Sie
 * rechnen ihre Beschreibung deshalb selbst und geben sie `FigureSvg` mit.
 *
 * Für einen Screenreader ist damit alles in Ordnung: `<desc>` trägt den vollen
 * Satz.
 *
 * **Die Vorlesefassung sah ihn nicht.** `vorleseAbschnitte()` bekommt
 * `figureMeta` und fällt auf `description ?? caption` zurück – für diese 53
 * also auf die Bildunterschrift. Dieselbe Grafik hatte damit für einen
 * Screenreader eine volle Beschreibung und für die Aufnahme eine Zeile.
 *
 * Naheliegend wäre, die Beschreibung beim Bauen aus der gezeichneten Grafik
 * herauszulesen. Das geht nicht: `scripts/lese-texte-schreiben.ts` läuft unter
 * `node --experimental-strip-types` und kann keine `.tsx` laden
 * (`ERR_UNKNOWN_FILE_EXTENSION`). Die Beschreibung muss in reinem TypeScript
 * stehen, sonst erreicht sie den Weg zur Aufnahme nie.
 *
 * ## Wie sie richtig bleibt
 *
 * Gerechnet wird hier aus denselben Modulen wie in der Zeichnung – `lib/`
 * und `lib/lernszenarien.ts`. Keine Zahl ist getippt; ändert sich eine
 * Annahme, ändern sich Grafik und Beschreibung gemeinsam.
 *
 * Dass beide Seiten dasselbe sagen, prüft `tests/grafik-beschreibungen.test.ts`
 * gegen das gebaute Paket: Es liest jedes `<desc>` aus `out/` und vergleicht es
 * mit dem, was die Vorlesefassung sagen würde. Ohne diesen Vergleich wäre die
 * Datei genau die Sorte zweite Wahrheit, die auf dieser Website schon einmal
 * drei Wochen lang danebenlag.
 */

/* ------------------------------------------------------------- Anleihen */

const ZINS_LAUFZEITEN = [2, 10, 20]

function anleiheKursUndZins(): string {
  const beiVier = ZINS_LAUFZEITEN.map((jahre) => ({
    jahre,
    kurs: kurs({ kuponProzent: anleiheBeispiel.kuponProzent, jahre }, anleiheNeuerZins),
  }))

  return (
    `Der Kurs einer Anleihe mit ${formatPercent(anleiheBeispiel.kuponProzent, 0)} Kupon, ` +
    `aufgetragen über dem Marktzins. Alle drei Kurven schneiden sich bei ` +
    `${formatPercent(anleiheMarktzins, 0)} im Kurs von 100 – dort entspricht der Kupon genau dem Marktzins. ` +
    `Steigt der Marktzins auf ${formatPercent(anleiheNeuerZins, 0)}, fällt der Kurs bei ` +
    beiVier
      .map((e) => `${e.jahre} Jahren Restlaufzeit auf ${formatNumber(e.kurs, 1)}`)
      .join(', bei ') +
    `. Die kurze Laufzeit verläuft fast waagerecht, die lange fällt steil.`
  )
}

/** Um wie viele Prozentpunkte der Marktzins in der Schockrechnung steigt. */
const ZINSSCHOCK_AENDERUNG = 2

function staatsanleiheZinsschock(): string {
  const verluste = anleiheLaufzeiten.map((jahre) => {
    const ergebnis = zinsschock(
      { kuponProzent: anleiheBeispiel.kuponProzent, jahre },
      anleiheMarktzins,
      ZINSSCHOCK_AENDERUNG
    )
    return `−${formatNumber(Math.abs(ergebnis.tatsaechlichProzent), 1)} %`
  })

  return (
    `Vier Anleihen mit gleichem Kupon und unterschiedlicher Restlaufzeit. Steigt der ` +
    `Marktzins um ${formatNumber(ZINSSCHOCK_AENDERUNG, 0)} Prozentpunkte, verliert die Anleihe mit ` +
    `${anleiheLaufzeiten[0]} Jahren Restlaufzeit ${verluste[0]} an Kurswert, die mit ` +
    `${anleiheLaufzeiten[anleiheLaufzeiten.length - 1]} Jahren ${verluste[verluste.length - 1]}. Der Verlust ` +
    `wächst mit der Restlaufzeit, aber nicht proportional zu ihr.`
  )
}

/* --------------------------------------------------- Kredit und Immobilie */

function kreditAnfangstilgung(): string {
  const langsam = immobilienTilgungssaetze[0]
  const zuegig = immobilienTilgungssaetze[1]
  const rateLangsam = rateBeiTilgungssatz(immobilienkredit, langsam)
  const rateZuegig = rateBeiTilgungssatz(immobilienkredit, zuegig)
  const jahreLangsam = auswerten(immobilienkredit, rateLangsam).monate / 12
  const jahreZuegig = auswerten(immobilienkredit, rateZuegig).monate / 12
  const restLangsam = restschuldNach(immobilienkredit, rateLangsam, immobilienZinsbindung)

  return (
    `Dasselbe Darlehen über ${formatCurrencyRounded(immobilienkredit.summe)}, vier Anfangstilgungen. ` +
    `Mit ${langsam} Prozent dauert die Rückzahlung ${formatNumber(jahreLangsam, 0)} Jahre, mit ` +
    `${zuegig} Prozent nur ${formatNumber(jahreZuegig, 0)} – bei einer Rate, die um ` +
    `${formatNumber(((rateZuegig - rateLangsam) / rateLangsam) * 100, 0)} Prozent höher liegt. ` +
    `Nach ${immobilienZinsbindung} Jahren Zinsbindung stehen bei der langsamsten Variante noch ` +
    `${formatCurrencyRounded(restLangsam)} offen, die dann zum unbekannten Zins der Zukunft neu ` +
    `finanziert werden müssen.`
  )
}

function immobilieRestschuld(): string {
  const darlehen = {
    summe: immobilieKaufpreis * (immobilieDarlehensquote / 100),
    zinsProzent: immobilieDarlehenszins,
  }
  const rate = rateBeiTilgungssatz(darlehen, immobilieAnfangstilgung)
  const laufzeit = Math.round(auswerten(darlehen, rate).monate / 12)
  const stuetzjahre = [5, immobilienZinsbindung, 20, laufzeit]

  const zeilen = stuetzjahre.map((jahr) => {
    const offen = restschuldNach(darlehen, rate, jahr)
    return {
      jahr,
      offen,
      getilgt: darlehen.summe - offen,
      anteil: (offen / darlehen.summe) * 100,
    }
  })

  const beiBindung = zeilen.find((zeile) => zeile.jahr === immobilienZinsbindung)!

  return (
    `Ein Darlehen über ${formatCurrencyRounded(darlehen.summe)} zu ` +
    `${formatNumber(darlehen.zinsProzent, 1)} Prozent mit ${immobilieAnfangstilgung} Prozent ` +
    `Anfangstilgung. Jede Säule zeigt dieselbe Summe, aufgeteilt in bereits getilgt und noch offen: ` +
    zeilen
      .map(
        (zeile) =>
          `nach ${zeile.jahr} Jahren sind ${formatCurrencyRounded(zeile.getilgt)} getilgt und ` +
          `${formatCurrencyRounded(zeile.offen)} offen`
      )
      .join('; ') +
    `. Am Ende der üblichen Zinsbindung von ${immobilienZinsbindung} Jahren stehen damit noch ` +
    `${formatNumber(beiBindung.anteil, 0)} Prozent der ursprünglichen Summe offen. Genau dieser ` +
    `Betrag muss zu den dann geltenden Konditionen weiterfinanziert werden – und welche das sein ` +
    `werden, weiß heute niemand. Vollständig getilgt ist das Darlehen erst nach ${laufzeit} Jahren.`
  )
}

/* --------------------------------------------------------- Profi-Grafiken */

function risikoSequenz(): string {
  const vergleich = reihenfolgevergleich(
    sequenzStartkapital,
    sequenzRenditen,
    sequenzEntnahme
  )
  const jahre = sequenzRenditen.length

  return (
    `Zwei Ruhestandsdepots über ${jahre} Jahre. Beide starten mit ` +
    `${formatCurrencyRounded(sequenzStartkapital)}, beide entnehmen jedes Jahr ` +
    `${formatCurrencyRounded(sequenzEntnahme)}, und beide erleben genau dieselben ` +
    `${jahre} Jahresrenditen – im Mittel ` +
    `${formatPercent(vergleich.mittlereRenditeProzent, 1)} im Jahr. Der einzige Unterschied ist die ` +
    `Reihenfolge. Wer die guten Jahre zuerst hat, steht am Ende bei ` +
    `${formatCurrencyRounded(vergleich.gutZuerst.endwert)}; wer die schlechten zuerst hat, bei ` +
    `${formatCurrencyRounded(vergleich.schlechtZuerst.endwert)} – ein Unterschied von ` +
    `${formatCurrencyRounded(vergleich.unterschied)}. Der Grund ist, dass in einem Rückgangsjahr ` +
    `Anteile billig verkauft werden müssen; die fehlen bei der späteren Erholung dauerhaft. Ohne ` +
    `Entnahme wären beide Linien am Ende deckungsgleich.`
  )
}

/** Die Kursspanne, über der die Delta-Kurve gezeichnet wird. */
const OPTION_KURS_VON = 60
const OPTION_KURS_BIS = 140

function optionDelta(): string {
  const amGeld = sensitivitaeten('call', optionBasis)
  const tiefImGeld = sensitivitaeten('call', { ...optionBasis, kurs: OPTION_KURS_BIS })
  const weitAusDemGeld = sensitivitaeten('call', {
    ...optionBasis,
    kurs: OPTION_KURS_VON,
  })

  return (
    `Das Delta einer Kaufoption über dem Kurs des Basiswerts, bei einem Basispreis von ` +
    `${formatNumber(optionBasis.basispreis, 0)}. Weit aus dem Geld liegt es nahe null ` +
    `(${formatNumber(weitAusDemGeld.delta, 2)} bei einem Kurs von ${OPTION_KURS_VON}): Die Option reagiert ` +
    `kaum. Tief im Geld liegt es nahe eins (${formatNumber(tiefImGeld.delta, 2)} bei ${OPTION_KURS_BIS}): ` +
    `Sie bewegt sich fast wie die Aktie selbst. Am Geld liegt es bei ` +
    `${formatNumber(amGeld.delta, 2)}. Die gestrichelte Linie zeigt dieselbe Option eine Woche vor ` +
    `Verfall – der Übergang wird zur Stufe. Genau diese Verschärfung ist das Gamma, und sie ist der ` +
    `Grund, warum eine Absicherung kurz vor Verfall dauernd nachjustiert werden muss.`
  )
}

function anleiheKonvexitaet(): string {
  const aenderungen = Array.from({ length: 33 }, (_, index) => -4 + index * 0.25)
  const punkte = aenderungen.map((aenderung) => ({
    aenderung,
    ...zinsschock(anleiheBeispiel, anleiheMarktzins, aenderung),
  }))

  const beiPlusZwei = punkte.find((p) => p.aenderung === 2)!
  const beiMinusZwei = punkte.find((p) => p.aenderung === -2)!

  return (
    `Für eine Anleihe mit ${formatPercent(anleiheBeispiel.kuponProzent, 0)} Kupon und ` +
    `${anleiheBeispiel.jahre} Jahren Restlaufzeit: die tatsächliche Kursänderung gegen das, was die ` +
    `Duration vorhersagt. Die Näherung ist eine Gerade, der wirkliche Verlauf eine Kurve – und die ` +
    `Kurve liegt auf beiden Seiten über der Geraden. Bei ` +
    `${formatNumber(2, 0)} Prozentpunkten mehr Zins fällt der Kurs um ` +
    `${formatNumber(Math.abs(beiPlusZwei.tatsaechlichProzent), 1)} Prozent statt der vorhergesagten ` +
    `${formatNumber(Math.abs(beiPlusZwei.genaehertProzent), 1)}; bei zwei Punkten weniger steigt er um ` +
    `${formatNumber(beiMinusZwei.tatsaechlichProzent, 1)} statt ` +
    `${formatNumber(beiMinusZwei.genaehertProzent, 1)}. Dieser Abstand ist die Konvexität. Sie fällt ` +
    `immer zugunsten des Anleihebesitzers aus: Es fällt weniger als gedacht und steigt mehr als ` +
    `gedacht. Die Duration allein ist deshalb keine grobe Schätzung, sondern eine systematisch ` +
    `vorsichtige.`
  )
}

function zinseszinsSteuerstundung(): string {
  const satz = effektiverSteuersatz / 100
  const brutto = sparfall.brutto / 100

  const wertJaehrlich = (jahr: number) => {
    let wert = 0
    for (let i = 0; i < jahr; i++) {
      wert = (wert + sparfall.rate * 12) * (1 + brutto * (1 - satz))
    }
    return wert
  }

  const wertGestundet = (jahr: number) => {
    let wert = 0
    for (let i = 0; i < jahr; i++) {
      wert = (wert + sparfall.rate * 12) * (1 + brutto)
    }
    const eingezahlt = sparfall.rate * 12 * jahr
    return wert - Math.max(wert - eingezahlt, 0) * satz
  }

  const endeJaehrlich = wertJaehrlich(sparfall.jahre)
  const endeGestundet = wertGestundet(sparfall.jahre)

  return (
    `${formatCurrencyRounded(sparfall.rate)} monatlich über ${sparfall.jahre} Jahre bei ` +
    `${formatPercent(sparfall.brutto, 0)} Bruttorendite und ` +
    `${formatPercent(effektiverSteuersatz, 2)} Steuer auf Erträge. Wird jedes Jahr versteuert, ` +
    `bleiben am Ende ${formatCurrencyRounded(endeJaehrlich)}; fällt die Steuer erst beim Verkauf an, ` +
    `sind es ${formatCurrencyRounded(endeGestundet)} – ` +
    `${formatCurrencyRounded(endeGestundet - endeJaehrlich)} mehr bei identischem Steuersatz. Der ` +
    `Unterschied entsteht allein daraus, dass der noch nicht abgeführte Betrag bis zum Verkauf ` +
    `mitarbeitet. Die deutsche Vorabpauschale verkleinert diesen Vorteil; sie ist hier nicht ` +
    `eingerechnet, die Grafik zeigt also die Obergrenze.`
  )
}

function inflationSteuer(): string {
  const saeulen = inflationNominalrenditen.map((nominal) => {
    const nachSteuer = nominal * (1 - effektiverSteuersatz / 100)
    const real = nachSteuer - inflationsbeispiel.rate
    return {
      label: formatPercent(nominal, 0),
      wertText: `${real >= 0 ? '+' : '−'} ${formatPercent(Math.abs(real), 1)}`,
    }
  })

  const schwelle = inflationsbeispiel.rate / (1 - effektiverSteuersatz / 100)

  return (
    `Vier Nominalrenditen bei ${formatPercent(inflationsbeispiel.rate, 1)} Inflation und ` +
    `${formatPercent(effektiverSteuersatz, 2)} Steuer. Versteuert wird der nominale Ertrag – auch der ` +
    `Teil, der nur die Geldentwertung ausgleicht. ` +
    saeulen
      .map((s, index) =>
        index === 0
          ? `Bei ${s.label} nominal bleiben real ${s.wertText}`
          : `bei ${s.label} nominal ${s.wertText}`
      )
      .join(', ') +
    `. Erst ab ${formatPercent(schwelle, 1)} Nominalrendite steht man nach Steuer und Inflation ` +
    `überhaupt bei null. Das ist der Grund, warum ein Zinssatz, der die Inflation gerade deckt, real ` +
    `ein Verlust ist.`
  )
}

function immobilieHebel(): string {
  const balken = immobilieEigenkapitalquoten.flatMap((quote) => {
    const eigenkapital = immobilieKaufpreis * (quote / 100)
    return immobilieWertaenderungen.map((aenderung) => {
      const wirkung = ((immobilieKaufpreis * (aenderung / 100)) / eigenkapital) * 100
      return {
        label: `${formatPercent(quote, 0)} Eigenkapital, ${aenderung > 0 ? '+' : '−'}${formatPercent(Math.abs(aenderung), 0)}`,
        wertText: `${wirkung > 0 ? '+' : '−'} ${formatPercent(Math.abs(wirkung), 0)}`,
      }
    })
  })

  const kleinste = immobilieEigenkapitalquoten[immobilieEigenkapitalquoten.length - 1]

  return (
    `Ein Objekt für ${formatCurrencyRounded(immobilieKaufpreis)}, finanziert mit unterschiedlich viel ` +
    `Eigenkapital. Der Kredit bleibt bei einer Wertänderung in voller Höhe stehen, also trifft die ` +
    `gesamte Änderung den eigenen Einsatz. ` +
    balken.map((b) => `${b.label} ergibt ${b.wertText}`).join('; ') +
    `. Bei ${formatPercent(kleinste, 0)} Eigenkapital wird aus zehn Prozent Wertverlust ein Verlust von ` +
    `hundert Prozent des Einsatzes – das Eigenkapital ist dann rechnerisch weg, der Kredit läuft weiter. ` +
    `Der Hebel wirkt in beide Richtungen gleich stark; vorgerechnet wird meist nur die eine.`
  )
}

function derivatPfadabhaengigkeit(): string {
  const rueckgang = (100 / (100 + hebelAnstieg)) * 100 - 100

  const nachZweiTagen = (faktor: number) => {
    const tagEins = 100 * (1 + (faktor * hebelAnstieg) / 100)
    return tagEins * (1 + (faktor * rueckgang) / 100)
  }

  const schlimmster = nachZweiTagen(hebelFaktoren[hebelFaktoren.length - 1])

  return (
    `Zwei Tage: Der Basiswert steigt um ${formatPercent(hebelAnstieg, 0)} und fällt dann um ` +
    `${formatNumber(Math.abs(rueckgang), 2)} Prozent – womit er wieder genau bei 100 steht. ` +
    `Produkte mit täglichem Vielfachen stehen danach bei ` +
    hebelFaktoren
      .map((f) => `Faktor ${f}: ${formatNumber(nachZweiTagen(f), 1)}`)
      .join(', ') +
    `. Keines ist wieder bei 100, und der Rückstand wächst mit dem Faktor: beim höchsten sind es ` +
    `${formatNumber(100 - schlimmster, 1)} Punkte. Der Grund ist, dass das Vielfache **täglich** ` +
    `neu angesetzt wird – nach dem ersten Tag arbeitet es auf einer anderen Basis. Über Wochen mit ` +
    `Seitwärtsbewegung wird daraus ein Verlust, obwohl der Basiswert sich nicht bewegt hat.`
  )
}

function streuungTitelzahl(): string {
  const volatilitaet = (n: number) =>
    streuungEinzelvolatilitaet * Math.sqrt(1 / n + (1 - 1 / n) * streuungKorrelation)
  const untergrenze = streuungEinzelvolatilitaet * Math.sqrt(streuungKorrelation)

  return (
    `Ein gleichgewichtetes Depot aus Titeln mit je ` +
    `${formatPercent(streuungEinzelvolatilitaet, 0)} Schwankung und einer mittleren Korrelation von ` +
    `${formatNumber(streuungKorrelation, 1)}. Ein einzelner Titel schwankt mit ` +
    `${formatNumber(volatilitaet(1), 0)} Prozent, fünf Titel mit ${formatNumber(volatilitaet(5), 0)}, ` +
    `zwanzig mit ${formatNumber(volatilitaet(20), 0)} und hundert mit ` +
    `${formatNumber(volatilitaet(100), 0)}. Der weitaus größte Teil des Gewinns liegt zwischen einem und ` +
    `zwanzig Titeln; danach passiert kaum noch etwas. Die gestrichelte Linie bei ` +
    `${formatNumber(untergrenze, 0)} Prozent ist die Grenze: Sie entsteht daraus, dass alle Aktien ` +
    `teilweise gemeinsam schwanken, und gegen sie hilft keine Zahl von Titeln. Wer streut, entfernt das ` +
    `Risiko einzelner Unternehmen – nicht das des Marktes.`
  )
}

function portfolioEntnahme(): string {
  const vier = entnahmeraten.indexOf(4 as (typeof entnahmeraten)[number])
  const beiVier = reihenfolgevergleich(
    sequenzStartkapital,
    sequenzRenditen,
    (sequenzStartkapital * 4) / 100
  )

  return (
    `Vier Entnahmeraten auf ${formatCurrencyRounded(sequenzStartkapital)} über ` +
    `${sequenzRenditen.length} Jahre, gerechnet gegen dieselbe Renditereihe – einmal mit den schlechten ` +
    `Jahren zuerst, einmal mit den guten. Der untere Teil jeder Säule ist das, was in beiden Fällen ` +
    `sicher übrig bleibt; der obere ist der Unterschied, den allein die Reihenfolge ausmacht. ` +
    (vier >= 0
      ? `Bei der verbreiteten Vier-Prozent-Regel stehen am Ende zwischen ` +
        `${formatCurrencyRounded(beiVier.schlechtZuerst.endwert)} und ` +
        `${formatCurrencyRounded(beiVier.gutZuerst.endwert)}. `
      : '') +
    `Je höher die Rate, desto größer wird der obere Teil im Verhältnis – die Regel wird also nicht nur ` +
    `knapper, sondern auch unsicherer. Eine Entnahmerate ist deshalb keine Zahl, sondern eine Zahl mit ` +
    `einer Spanne.`
  )
}

function rohstoffeGoldSteuer(): string {
  const saeulen = goldWertsteigerungen.map((zuwachs) => {
    const gewinn = (goldEinsatz * zuwachs) / 100
    const steuer = gewinn * (effektiverSteuersatz / 100)
    return { hinweis: `${formatCurrencyRounded(steuer)} Unterschied` }
  })

  return (
    `${formatCurrencyRounded(goldEinsatz)} Einsatz, drei Wertsteigerungen. Bei physischem Gold ist der ` +
    `Gewinn nach einem Jahr Haltedauer in Deutschland steuerfrei; bei einem Wertpapier auf denselben ` +
    `Goldpreis fallen ${formatPercent(effektiverSteuersatz, 2)} an, gleich wie lange gehalten wurde. ` +
    saeulen
      .map((s, index) =>
        index === 0
          ? `Bei ${formatPercent(goldWertsteigerungen[index], 0)} Wertsteigerung sind das ${s.hinweis}`
          : `bei ${formatPercent(goldWertsteigerungen[index], 0)} ${s.hinweis}`
      )
      .join(', ') +
    `. Der Unterschied ist kein Detail, sondern bei gleicher Bruttorendite gut ein Viertel des Gewinns. ` +
    `Dem stehen Kosten gegenüber, die ein Wertpapier nicht hat: Aufschlag beim Kauf, Abschlag beim ` +
    `Verkauf, Verwahrung. Der Rechtsstand kann sich ändern.`
  )
}

function renteRentenbeginn(): string {
  const rechnung = calculatePension({ ...rentenBeispiel })
  const frueh = rechnung.netStatutoryMonthly * (1 - (36 * renteAbschlagJeMonat) / 100)
  const spaet = rechnung.netStatutoryMonthly * (1 + (36 * renteZuschlagJeMonat) / 100)

  return (
    `Dieselbe erworbene Rente, sieben Zeitpunkte des Beginns. Je vorgezogenem Monat mindert sich die ` +
    `Rente um ${formatPercent(renteAbschlagJeMonat, 1)}, je aufgeschobenem erhöht sie sich um ` +
    `${formatPercent(renteZuschlagJeMonat, 1)}. Drei Jahre früher bedeuten ` +
    `${formatCurrencyRounded(frueh)} im Monat statt ` +
    `${formatCurrencyRounded(rechnung.netStatutoryMonthly)}, drei Jahre später ` +
    `${formatCurrencyRounded(spaet)}. Zwischen dem frühesten und dem spätesten Zeitpunkt liegen damit ` +
    `${formatCurrencyRounded(spaet - frueh)} im Monat – und zwar dauerhaft, nicht bis zum Regelalter. ` +
    `Der Aufschub bringt zusätzlich weiter erworbene Punkte, wenn man weiterarbeitet; die sind hier ` +
    `nicht eingerechnet.`
  )
}

function timingTrefferquote(): string {
  const balken = timingKostenJeRunde
    .map((kosten) => ({
      kosten: kosten as number,
      quote: noetigeTrefferquote(timingGewinnJeTreffer, kosten),
    }))
    .filter((s): s is { kosten: number; quote: number } => s.quote !== null)
    .map((s) => ({
      kostenText: s.kosten === 0 ? null : formatPercent(s.kosten, 1),
      anteil: formatPercent(s.quote, 1),
    }))

  return (
    `Wie oft eine Timing-Strategie richtig liegen müsste, um überhaupt bei null herauszukommen – bei ` +
    `${formatPercent(timingGewinnJeTreffer, 0)} Gewinn je richtiger Entscheidung. ` +
    balken
      .map((b) =>
        b.kostenText === null
          ? `Ohne Kosten müssen ${b.anteil} der Entscheidungen sitzen`
          : `bei ${b.kostenText} Kosten je Runde ${b.anteil}`
      )
      .join(', ') +
    `. Ohne Kosten genügt die Hälfte – das ist der Münzwurf. Jeder Prozentpunkt an Spread, Gebühren ` +
    `und Steuer auf realisierte Gewinne hebt die Schwelle darüber. Und das ist erst die Frage, ob sich ` +
    `der Aufwand lohnt; die Frage, ob überhaupt jemand so oft richtig liegt, kommt danach.`
  )
}

/* ------------------------------------------------------- Kastenreihen */

/*
  Diese sieben sind keine Rechnungen, sondern Zusammenfassungen: Der Satz
  entsteht aus denselben Einträgen, aus denen die Kästen gezeichnet werden.
  Fest in `data/figures.ts` geschrieben wäre er nach der ersten geänderten
  Beschriftung falsch – und niemand würde es merken, weil beide Fassungen für
  sich stimmig aussehen.
*/

function fondsBewertungsstufen(): string {
  return (
    'Die drei Bewertungsstufen eines Fonds, von links nach rechts abnehmend nachprüfbar. ' +
    reiheAlsText(BEWERTUNGSSTUFEN) +
    '. Für eine Aktie mit Börsenkurs ist die Bewertung trivial. Für eine Unternehmensanleihe, die zuletzt vor drei Wochen gehandelt wurde, gibt es keinen Kurs – bewertet wird dann nach Modell, abgeleitet aus vergleichbaren Papieren, aus Renditekurven, aus Kursstellungen von Händlern. Wie hoch der Anteil der Stufen zwei und drei am Fondsvermögen ist, steht im Jahresbericht: bei einem Aktienfonds nahe null, bei manchen Anleihe- und Mischfonds erheblich. Dort entscheidet, wer die Annahmen setzt – und dort entsteht im Krisenfall der Streit über den richtigen Anteilspreis.'
  )
}

function crashesAnsteckung(): string {
  return (
    'Die drei Wege, auf denen ein Kurssturz die Wirtschaft erreicht. ' +
    reiheAlsText(ANSTECKUNGSWEGE) +
    '. Ein gestrichelter Pfeil führt vom dritten Kasten zurück zum zweiten: Die Rückkopplung trifft wieder die Banken. Nur dieser eine Weg schließt sich zu einem Kreis, und nur er hat die Wucht, aus einem Kurssturz eine Krise zu machen. 1987 verlor der Markt an einem Tag rund ein Fünftel, ohne dass eine Rezession folgte – das Bankensystem war nicht betroffen. 2008 begann mit fallenden Immobilienpreisen und endete in einer weltweiten Wirtschaftskrise, weil es betroffen war. Ist der Kreis erst geschlossen, entscheidet nur noch die Reaktion der Politik über die Dauer.'
  )
}

function notenbankMessgroessen(): string {
  return (
    'Die drei Größen, aus denen sich der angemessene Leitzins ergeben soll. ' +
    reiheAlsText(MESSGROESSEN) +
    '. Zwei der drei sind damit keine Beobachtungen, sondern Schätzungen mit erheblicher Streuung und laufenden Revisionen. Geldpolitik ist deshalb keine Steuerung nach Messwerten, sondern Navigation mit unsicherer Position – Notenbanken sagen das inzwischen selbst. Für Anleger folgt daraus vor allem eines: Wer meint, die richtige Zinshöhe besser zu kennen als der Rat, überschätzt die Genauigkeit der verfügbaren Größen, und zwar aller verfügbaren, auch der eigenen.'
  )
}

function tagesgeldParkplaetze(): string {
  return (
    'Vier Wege, Geld kurzfristig zu parken, verglichen nach Verfügbarkeit und Art des Schutzes. ' +
    reiheAlsText(PARKPLAETZE) +
    '. Die Rendite steht bewusst nicht daran: Der Unterschied zwischen den vier Möglichkeiten beträgt einen Bruchteil eines Prozentpunkts, der Unterschied zwischen „am Tag X verfügbar“ und „nicht verfügbar“ kann teuer werden. Für kurzfristig gebundenes Geld entscheidet deshalb zuerst, wann es verfügbar sein muss, und erst danach, was es einbringt. Wer für den Notgroschen ein halbes Prozent mehr sucht, optimiert die kleinste Stellschraube im ganzen Portfolio.'
  )
}

function waehrungParitaeten(): string {
  return (
    'Die drei Paritätsbedingungen des Devisenmarkts, geordnet nach ihrem empirischen Rang – links gilt immer, rechts gilt systematisch nicht. ' +
    reiheAlsText(PARITAETEN) +
    '. Die Ordnung ist die Aussage: Die gedeckte Zinsparität ist keine Theorie über Verhalten, sondern eine Arbitragebedingung – gälte sie nicht, ließe sich risikolos Geld verdienen. Die Kaufkraftparität ist über Jahrzehnte eine Tendenz und über Jahre unbrauchbar. Die ungedeckte Zinsparität dagegen ist widerlegt: Hochzinswährungen werten im Mittel nicht so ab, wie sie es müsste, teils werten sie sogar auf. Genau darauf beruht der Carry-Trade, der über Monate und Jahre funktioniert und dann abrupt zusammenbricht. Sein Ertragsprofil ist dasselbe wie beim Verkauf von Volatilität: viele kleine Gewinne, selten ein sehr großer Verlust. Das ist vermutlich die beste Erklärung für das Puzzle – die Zinsdifferenz ist keine Anomalie, sondern die Vergütung für ein Risiko, das sich in ruhigen Phasen nicht zeigt.'
  )
}

function kostenEbenen(): string {
  return (
    'Die vier Ebenen, auf denen bei einer Geldanlage Kosten anfallen, geordnet nach ihrer Sichtbarkeit. ' +
    reiheAlsText(KOSTENEBENEN) +
    '. Die Reihenfolge ist die der Sichtbarkeit und nicht die der Höhe – darin liegt die Aussage. Vollständig ist eine Kostenbetrachtung erst, wenn alle vier zusammengezählt sind. Die meisten schauen auf die erste Ebene, weil sie auf der Abrechnung steht, und übersehen die anderen drei. Ausgerechnet die letzte ist regelmäßig die teuerste.'
  )
}

function kryptoBewertung(): string {
  return (
    'Oben das übliche Bewertungsverfahren: künftige Zahlungen schätzen und abzinsen – so werden Aktien, Anleihen und Immobilien bewertet. Bei einem Kryptowert gibt es keine künftigen Zahlungen; das Verfahren ist damit nicht ungenau, sondern nicht anwendbar. Darunter die drei üblichen Ersatzansätze und woran jeder scheitert. ' +
    reiheAlsText(ERSATZANSAETZE) +
    '. Bei den Erzeugungskosten läuft die Kausalität umgekehrt: Der Aufwand richtet sich nach dem Preis, nicht der Preis nach dem Aufwand. Die Knappheitsverhältnisse sind ein reines Angebotsmaß ohne jede Aussage über die Nachfrage; Prognosen auf dieser Grundlage sind mehrfach deutlich verfehlt worden. Ehrlicher ist die Feststellung, dass hier ein Preis ohne Bewertungsanker existiert. Das macht die Anlage nicht illegitim – Gold hat dasselbe Problem und wird seit Jahrtausenden gehalten. Es macht nur jede Aussage der Form „fair bewertet“ oder „unterbewertet“ gegenstandslos.'
  )
}

/* ---------------------------------------------------------- Orderbuch */

function marktOrderbuch(): string {
  const { brief, geld } = orderbuchBeispiel
  const bester = { brief: brief[brief.length - 1], geld: geld[0] }
  const spread = bester.brief.preis - bester.geld.preis

  return (
    'Ein Orderbuch als Leiter, Preise von oben nach unten. Oben stehen die Verkaufsaufträge: ' +
    brief
      .map(
        (lage) =>
          `${formatNumber(lage.stueck, 0)} Stück zu ${formatNumber(lage.preis, 2)} Euro`
      )
      .join(', ') +
    '. Unten die Kaufaufträge: ' +
    geld
      .map(
        (lage) =>
          `${formatNumber(lage.stueck, 0)} Stück zu ${formatNumber(lage.preis, 2)} Euro`
      )
      .join(', ') +
    `. Zwischen dem besten Gebot von ${formatNumber(bester.geld.preis, 2)} und der besten Forderung von ` +
    `${formatNumber(bester.brief.preis, 2)} Euro liegt niemand – diese Lücke von ` +
    `${formatNumber(spread, 2)} Euro ist der Spread. Wer nur wenige Stücke kauft, bekommt sie zum besten ` +
    `Briefkurs. Wer ${formatNumber(orderbuchMarktauftrag, 0)} Stück sofort kauft, räumt mehrere Lagen ab ` +
    `und zahlt im Schnitt mehr – das ist die Slippage.`
  )
}

/* -------------------------------------------------------------- Sparen */

/**
 * Das Endkapital eines Sparplans – dieselbe Rechnung wie in der Zeichnung.
 *
 * Steht hier ein zweites Mal, weil `components/content/figures/sparen.tsx`
 * eine `.tsx` ist und von hier nicht geladen werden kann. Beide rufen
 * `calculateCompoundInterest` auf; die Rechnung selbst gibt es nur einmal.
 */
function endkapital(rate: number, rendite: number, jahre: number): number {
  return calculateCompoundInterest({
    principal: 0,
    contribution: rate,
    interval: 'monthly',
    annualRatePercent: rendite,
    years: jahre,
  }).finalBalance
}

function psychologieVerhaltensluecke(): string {
  const ohne = sparfall.brutto
  const mit = sparfall.brutto - verhaltensluecke
  const endeOhne = endkapital(sparfall.rate, ohne, sparfall.jahre)
  const endeMit = endkapital(sparfall.rate, mit, sparfall.jahre)

  return (
    `Zwei Sparpläne über ${formatCurrencyRounded(sparfall.rate)} monatlich und ${sparfall.jahre} Jahre. ` +
    `Der eine erzielt ${formatPercent(ohne, 0)} im Jahr, der andere ` +
    `${formatPercent(mit, 0)} – dasselbe Produkt, nur schlechter getroffene Ein- und Ausstiege. ` +
    `Zwanzig Jahre lang liegen beide Linien fast aufeinander. Am Ende stehen ` +
    `${formatCurrencyRounded(endeOhne)} gegen ${formatCurrencyRounded(endeMit)}: ` +
    `${formatCurrencyRounded(endeOhne - endeMit)} Unterschied, ` +
    `${formatPercent(((endeOhne - endeMit) / endeOhne) * 100, 0)} des Ergebnisses, für einen einzigen ` +
    `Prozentpunkt im Jahr.`
  )
}

function budgetHebel(): string {
  const jahre = Array.from({ length: 41 }, (_, index) => index)

  const zugewinn = (variante: 'rate' | 'rendite') =>
    jahre.map((jahr) => {
      const basis = endkapital(hebelAusgang.rate, hebelAusgang.rendite, jahr)
      const mit =
        variante === 'rate'
          ? endkapital(hebelAusgang.rate + hebelMehrRate, hebelAusgang.rendite, jahr)
          : endkapital(hebelAusgang.rate, hebelAusgang.rendite + hebelMehrRendite, jahr)
      return { x: jahr, y: mit - basis }
    })

  const durchRate = zugewinn('rate')
  const durchRendite = zugewinn('rendite')
  const wechsel = jahre.find((jahr) => durchRendite[jahr].y > durchRate[jahr].y) ?? null

  return (
    `Ausgangslage: ${formatCurrencyRounded(hebelAusgang.rate)} monatlich bei ` +
    `${formatPercent(hebelAusgang.rendite, 0)}. Zwei Hebel im Vergleich – ` +
    `${formatCurrencyRounded(hebelMehrRate)} mehr sparen oder einen Prozentpunkt mehr Rendite erzielen. ` +
    (wechsel === null
      ? 'Über vierzig Jahre bleibt der Sparhebel durchgehend vorn.'
      : `In den ersten ${wechsel - 1} Jahren bringt die höhere Rate mehr; ab Jahr ${wechsel} zieht die ` +
        `höhere Rendite vorbei und läuft danach immer weiter davon.`) +
    ` Nach zehn Jahren liegt der Sparhebel bei ${formatCurrencyRounded(durchRate[10].y)} gegen ` +
    `${formatCurrencyRounded(durchRendite[10].y)}, nach vierzig bei ` +
    `${formatCurrencyRounded(durchRate[40].y)} gegen ${formatCurrencyRounded(durchRendite[40].y)}. ` +
    `Die höhere Rate wirkt sofort, die höhere Rendite erst mit der Zeit – und nur die Rate hat man ` +
    `selbst in der Hand.`
  )
}

function portfolioDrift(): string {
  const jahre = Array.from({ length: portfolioJahre + 1 }, (_, index) => index)
  const quote = jahre.map((jahr) => {
    const aktien = portfolioStart.aktien * (1 + portfolioRenditeAktien / 100) ** jahr
    const sicher = portfolioStart.sicher * (1 + portfolioRenditeSicher / 100) ** jahr
    return (aktien / (aktien + sicher)) * 100
  })
  const ende = quote[quote.length - 1]
  const nachFuenf = quote[5]

  return (
    `Ein Depot startet mit ${formatPercent(portfolioStart.aktien, 0)} Aktien und ` +
    `${formatPercent(portfolioStart.sicher, 0)} sicherem Teil. Angenommen, der Aktienteil wächst über ` +
    `zehn gute Jahre mit ${formatPercent(portfolioRenditeAktien, 0)} im Jahr, der sichere mit ` +
    `${formatPercent(portfolioRenditeSicher, 0)}. Ohne dass jemand etwas entscheidet, steigt der ` +
    `Aktienanteil nach fünf Jahren auf ${formatPercent(nachFuenf, 0)} und nach zehn auf ` +
    `${formatPercent(ende, 0)}. Das Depot trägt dann mehr Risiko als geplant – und zwar am Ende einer ` +
    `guten Phase, also genau dann, wenn ein Rückschlag am wahrscheinlichsten ist. Die gestrichelte ` +
    `Linie ist die geplante Quote, auf die Rebalancing zurücksetzt.`
  )
}

function kostenWahreQuote(): string {
  const faelle = kostenfaelle.map((fall) => {
    const umsatz = fall.kaeufeJeJahr * fall.kaufbetrag
    const fondskosten = fall.depotwert * (kostenFondsquote / 100)
    const ordergebuehren = fall.kaeufeJeJahr * ordergebuehrFest
    const spread = umsatz * (spreadProzent / 100)
    const summe = fondskosten + ordergebuehren + spread
    const alsQuote = (betrag: number) => (betrag / fall.depotwert) * 100
    return {
      ...fall,
      teile: [
        { name: 'Fondskosten', euro: fondskosten },
        { name: 'Ordergebühr', euro: ordergebuehren },
        { name: 'Spread', euro: spread },
      ],
      summe,
      quote: alsQuote(summe),
    }
  })

  return (
    `Dieselben drei Kostenarten in zwei Depots, jeweils auf ein Jahr gerechnet und durch den ` +
    `Depotwert geteilt. ` +
    faelle
      .map(
        (fall) =>
          `Beim ${fall.name} – ${formatCurrencyRounded(fall.depotwert)} Depotwert, ` +
          `${fall.kaeufeJeJahr} Käufe zu je ${formatCurrencyRounded(fall.kaufbetrag)} – kostet ein ` +
          `Jahr ${formatCurrencyRounded(fall.summe)}, also ${formatPercent(fall.quote, 2)}: ` +
          fall.teile
            .map((teil) => `${teil.name} ${formatCurrencyRounded(teil.euro)}`)
            .join(', ')
      )
      .join('. ') +
    `. Die Rangfolge dreht sich um: Im kleinen Depot machen Ordergebühr und Spread den größten ` +
    `Teil aus, im großen sind sie neben den laufenden Fondskosten kaum noch zu sehen. Deshalb hat ` +
    `die Frage, welcher Anbieter günstiger ist, keine allgemeine Antwort – sie hängt an Depotgröße ` +
    `und Handelshäufigkeit. Gerechnet ist mit ${formatPercent(kostenFondsquote, 1)} Fondskosten, ` +
    `${formatCurrencyRounded(ordergebuehrFest)} je Order und ${formatPercent(spreadProzent, 1)} ` +
    `Spread; eine Depotgebühr fällt bei den üblichen Anbietern nicht an.`
  )
}

/* --------------------------------- Depot, Sparquote, Korrelation, Index */

function depotOrderkosten(): string {
  const saeulen = ordergroessen.map((volumen) => {
    const spread = volumen * (spreadProzent / 100)
    const gesamt = ordergebuehrFest + spread
    return { wertText: formatPercent((gesamt / volumen) * 100, 2) }
  })

  const klein = ordergroessen[0]
  const gross = ordergroessen[ordergroessen.length - 1]

  return (
    `Was eine Order kostet, aufgeteilt in die beiden Blöcke: einen Festpreis von ` +
    `${formatCurrency(ordergebuehrFest)} und einen Spread von ${formatPercent(spreadProzent, 1)} des ` +
    `Volumens. Bei ${formatCurrencyRounded(klein)} überwiegt die Gebühr deutlich, und die Gesamtkosten ` +
    `betragen ${saeulen[0].wertText} des Einsatzes. Bei ${formatCurrencyRounded(gross)} ist die Gebühr ` +
    `kaum noch zu sehen; fast alles ist Spread, und die Gesamtkosten sinken auf ` +
    `${saeulen[saeulen.length - 1].wertText}. Der Block, der auf der Abrechnung steht, ist also der ` +
    `kleinere – ausgerechnet der andere lässt sich durch die Wahl von Handelsplatz und Uhrzeit ` +
    `beeinflussen.`
  )
}

/** Wie lange es bis zum Zielvielfachen dauert – dieselbe Formel wie in der Zeichnung. */
function jahreBisZumZiel(sparquoteProzent: number): number {
  const s = sparquoteProzent / 100
  const r = sparquoteRendite / 100
  if (r === 0) return (sparquoteZielvielfaches * (1 - s)) / s
  return Math.log(1 + ((sparquoteZielvielfaches * (1 - s)) / s) * r) / Math.log(1 + r)
}

function budgetSparquoteJahre(): string {
  const beiZehn = jahreBisZumZiel(10)
  const beiZwanzig = jahreBisZumZiel(20)
  const beiFuenfzig = jahreBisZumZiel(50)

  return (
    `Wie lange es dauert, bis das Ersparte das ${sparquoteZielvielfaches}-Fache der Jahresausgaben ` +
    `erreicht – bei ${formatPercent(sparquoteRendite, 0)} realer Rendite. Bei einer Sparquote von ` +
    `${formatPercent(10, 0)} sind es ${formatNumber(beiZehn, 0)} Jahre, bei ` +
    `${formatPercent(20, 0)} noch ${formatNumber(beiZwanzig, 0)}, bei ${formatPercent(50, 0)} nur ` +
    `${formatNumber(beiFuenfzig, 0)}. Die Kurve fällt am Anfang steil und flacht dann ab: Die ersten ` +
    `zehn Prozentpunkte mehr Sparquote bringen mehr als die letzten zehn. ` +
    `In dieser Rechnung kommt das Einkommen nicht vor, und das ist kein Versehen – es kürzt sich ` +
    `heraus, weil sowohl das Ziel als auch die Sparrate daran hängen. Entscheidend ist nicht, wie viel ` +
    `hereinkommt, sondern der Abstand zwischen Einnehmen und Ausgeben.`
  )
}

function risikoKorrelation(): string {
  const mischung = (rho: number) => streuungEinzelvolatilitaet * Math.sqrt((1 + rho) / 2)

  return (
    `Zwei Anlagen zu gleichen Teilen, jede mit ${formatPercent(streuungEinzelvolatilitaet, 0)} ` +
    `Schwankung. Laufen sie vollständig gleich – Korrelation eins –, schwankt die Mischung genauso ` +
    `stark wie jede einzelne: ${formatNumber(mischung(1), 0)} Prozent. Die gestrichelte Linie zeigt ` +
    `diesen Fall. Bei Korrelation null sind es ${formatNumber(mischung(0), 0)} Prozent, bei ` +
    `minus 0,5 noch ${formatNumber(mischung(-0.5), 0)}, und bei vollständigem Gegenlauf verschwindet ` +
    `die Schwankung ganz. Nichts davon kostet Rendite: Die erwartete Rendite der Mischung ist der ` +
    `Durchschnitt der beiden, gleich wie sie zusammenhängen. Das ist gemeint, wenn von einem ` +
    `kostenlosen Hebel die Rede ist. Was die Grafik nicht zeigt: Korrelationen sind nicht stabil und ` +
    `steigen ausgerechnet dann, wenn alles fällt.`
  )
}

function optionVolatilitaet(): string {
  const niedrig = preis('call', {
    ...optionBasis,
    volatilitaetProzent: optionVolatilitaeten[0],
  })
  const hoch = preis('call', {
    ...optionBasis,
    volatilitaetProzent: optionVolatilitaeten[optionVolatilitaeten.length - 1],
  })

  return (
    `Dieselbe Kaufoption – Kurs und Basispreis ${formatNumber(optionBasis.basispreis, 0)}, ` +
    `${formatNumber(optionBasis.jahre * 12, 0)} Monate Restlaufzeit – bei vier erwarteten ` +
    `Schwankungen. Bei ${formatPercent(optionVolatilitaeten[0], 0)} kostet sie ` +
    `${formatCurrency(niedrig)}, bei ` +
    `${formatPercent(optionVolatilitaeten[optionVolatilitaeten.length - 1], 0)} das ` +
    `${formatNumber(hoch / niedrig, 1)}-Fache: ${formatCurrency(hoch)}. Am Kurs des Basiswerts hat ` +
    `sich dabei nichts geändert. Die erwartete Schwankung ist der einzige Preisbestandteil, den man ` +
    `nicht ablesen kann – Kurs, Basispreis, Laufzeit und Zins stehen fest. Deshalb ist der Kauf einer ` +
    `Option immer auch eine Meinung darüber, ob diese Erwartung zu hoch oder zu niedrig ist.`
  )
}

function etfIndexFassungen(): string {
  const netto = indexKursrendite + indexDividendenrendite * (1 - indexQuellensteuer / 100)
  const brutto = indexKursrendite + indexDividendenrendite
  const ende = (rendite: number) => 100 * (1 + rendite / 100) ** indexJahre

  return (
    `Derselbe Markt in drei Fassungen, über ${indexJahre} Jahre: ` +
    `${formatPercent(indexKursrendite, 0)} Kursrendite und ` +
    `${formatPercent(indexDividendenrendite, 0)} Dividendenrendite, bei ` +
    `${formatPercent(indexQuellensteuer, 0)} unterstellter Quellensteuer. Der Preisindex zählt nur ` +
    `die Kurse und steht am Ende bei ${formatNumber(ende(indexKursrendite), 0)}. Der Nettoindex ` +
    `rechnet Dividenden nach Quellensteuer mit und kommt auf ` +
    `${formatNumber(ende(netto), 0)}, der Bruttoindex rechnet sie voll mit und erreicht ` +
    `${formatNumber(ende(brutto), 0)}. Zwischen der obersten und der untersten Linie liegen damit ` +
    `${formatNumber(ende(brutto) - ende(indexKursrendite), 0)} Punkte – ein Vielfaches jeder ` +
    `Kostenquote. Welcher Maßstab in einem Werbeblatt steht, entscheidet deshalb über das Urteil, ` +
    `bevor über den Fonds selbst gesprochen wird. Üblich und richtig ist der Nettoindex.`
  )
}

function tagesgeldAktionszins(): string {
  const anteilAktion = aktionsmonate / 12
  const gemischt = aktionszins * anteilAktion + folgezins * (1 - anteilAktion)

  return (
    `Ein Angebot mit ${formatPercent(aktionszins, 2)} Aktionszins für ${aktionsmonate} Monate, danach ` +
    `${formatPercent(folgezins, 2)}. Über das ganze Jahr ergibt das ${formatPercent(gemischt, 2)} – ` +
    `beworben wird die erste Säule, gutgeschrieben wird die dritte. Ein unspektakuläres Dauerangebot ` +
    `mit ${formatPercent(dauerzins, 2)} liegt darüber, obwohl es in keinem Vergleichsportal oben ` +
    `steht. Wer die Frist im Kalender hat und rechtzeitig wechselt, bekommt den Aktionszins wirklich; ` +
    `wer das nicht tut – und das sind die meisten –, bekommt die Mischung. Genau darauf ist das ` +
    `Angebot gerechnet.`
  )
}

/* ------------------------------- Abläufe, Handelszeiten, Margin, Rente */

function einlagensicherungKaskade(): string {
  return (
    'Die gesetzliche Reihenfolge, in der eine Bank abgewickelt wird, von oben nach unten: ' +
    KASKADE.map((k, index) => `${index + 1}. ${k.stufe} – ${k.text}`).join('; ') +
    '. Jede Stufe muss vollständig aufgezehrt sein, bevor die nächste angefasst wird. Gedeckte ' +
    'Einlagen stehen ganz unten und sind damit nicht ein bisschen sicherer als der Rest, sondern ' +
    'durch alles darüber geschützt. Die Kästen sind gleich hoch und stellen keine Beträge dar: Die ' +
    'tatsächlichen Größenverhältnisse unterscheiden sich von Bank zu Bank. Was feststeht, ist die ' +
    'Reihenfolge.'
  )
}

/** Eine Stunde als deutsche Uhrzeit – dieselbe Schreibweise wie in der Zeichnung. */
function alsUhrzeit(stunde: number): string {
  const volle = Math.floor(stunde)
  const minuten = Math.round((stunde - volle) * 60)
  return minuten === 0
    ? `${volle} Uhr`
    : `${volle}:${String(minuten).padStart(2, '0')} Uhr`
}

function boerseHandelszeiten(): string {
  const referenz = handelszeiten[0]
  const laengster = handelszeiten[handelszeiten.length - 1]
  const blindVon = referenz.bis
  const blindBis = laengster.bis

  return (
    'Die Handelszeiten der drei Platzarten übereinander, von 7 bis 24 Uhr: ' +
    handelszeiten
      .map(
        (platz) =>
          `${platz.name} von ${alsUhrzeit(platz.von)} bis ${alsUhrzeit(platz.bis)} – ${platz.hinweis}`
      )
      .join('; ') +
    `. Der eingefärbte Bereich zwischen ${alsUhrzeit(blindVon)} und ${alsUhrzeit(blindBis)} ` +
    'ist der Punkt der Grafik: Dort ist der Referenzmarkt geschlossen, der Direkthandel aber offen. ' +
    'Wer in diesen Stunden ein Angebot bekommt, hat keinen Kurs, an dem er dessen Fairness messen ' +
    'könnte – und der Anbieter weiß das. Die Spanne ist dann regelmäßig deutlich größer als am ' +
    'Nachmittag. Bei ausländischen Werten kommt hinzu, dass auch ein Referenzmarkt schätzen muss, ' +
    'solange der Heimatmarkt geschlossen ist.'
  )
}

function derivatMargin(): string {
  const einschuss = marginKontraktwert * (marginErsteinschussProzent / 100)
  const untergrenze = marginKontraktwert * (marginUntergrenzeProzent / 100)

  const { tage, margincall } = marginverlauf(
    marginKontraktwert,
    marginErsteinschussProzent,
    marginUntergrenzeProzent,
    marginKursverlauf
  )

  const call = margincall ?? tage.length - 1
  const endkurs = tage[tage.length - 1].kurs
  const tiefstkurs = Math.min(...tage.map((t) => t.kurs))
  const beimCall = tage[call]
  const haetteGehabt = tage[tage.length - 1].konto

  return (
    `Ein Future über ${formatCurrencyRounded(marginKontraktwert)} Kontraktwert, hinterlegt mit ` +
    `${formatPercent(marginErsteinschussProzent, 0)} Ersteinschuss, also ` +
    `${formatCurrencyRounded(einschuss)}. Jeden Abend wird abgerechnet: Die Kursbewegung des Tages ` +
    `wird dem Sicherheitskonto gutgeschrieben oder abgebucht. Der Kurs fällt in diesem Beispiel auf ` +
    `${formatNumber(tiefstkurs, 1)} Prozent des Ausgangswerts und steigt danach auf ` +
    `${formatNumber(endkurs, 1)} Prozent – also darüber hinaus. Das Sicherheitskonto fällt dabei von ` +
    `${formatCurrencyRounded(einschuss)} an Handelstag ${call + 1} auf ` +
    `${formatCurrencyRounded(beimCall.konto)} und damit unter die Untergrenze von ` +
    `${formatCurrencyRounded(untergrenze)}. Dort endet die durchgezogene Linie, denn dort wird die ` +
    `Position glattgestellt. Die gestrichelte Fortsetzung ist gerechnet und nicht geschehen: Wer ` +
    `hätte halten können, stünde am zehnten Tag bei ${formatCurrencyRounded(haetteGehabt)}, also ` +
    `über dem Ersteinschuss. Die Einschätzung war am Ende richtig; halten ließ sie sich trotzdem ` +
    `nicht, weil die Sicherheit jeden Abend reichen muss. Genau das ist der Unterschied zwischen ` +
    `einem Verlustrisiko und einem Liquiditätsrisiko – und Letzteres ist der häufigere Grund für ` +
    `gescheiterte Positionen.`
  )
}

function sparplanWartezeit(): string {
  const monatsrate = (monate: number) => verteilsumme / monate

  const zeilen = verteilmonate.map((monate) => {
    if (monate === 0) {
      return {
        monate,
        endkapital: calculateCompoundInterest({
          principal: verteilsumme,
          contribution: 0,
          interval: 'monthly',
          annualRatePercent: verteilrendite,
          years: verteiljahre,
        }).finalBalance,
      }
    }

    const nachEinzahlung = calculateCompoundInterest({
      principal: 0,
      contribution: monatsrate(monate),
      interval: 'monthly',
      annualRatePercent: verteilrendite,
      years: monate / 12,
    }).finalBalance

    return {
      monate,
      endkapital: calculateCompoundInterest({
        principal: nachEinzahlung,
        contribution: 0,
        interval: 'monthly',
        annualRatePercent: verteilrendite,
        years: verteiljahre - monate / 12,
      }).finalBalance,
    }
  })

  const sofort = zeilen[0].endkapital
  const letzte = zeilen[zeilen.length - 1]

  return (
    `${formatCurrencyRounded(verteilsumme)}, angelegt über ${verteiljahre} Jahre bei ` +
    `${formatPercent(verteilrendite, 0)} Rendite im Jahr – einmal sofort, einmal über mehrere ` +
    `Monate verteilt. Ergebnisse: ` +
    zeilen
      .map(
        (zeile) =>
          `${zeile.monate === 0 ? 'sofort' : `verteilt über ${zeile.monate} Monate`} ` +
          `${formatCurrencyRounded(zeile.endkapital)}`
      )
      .join('; ') +
    `. Über ${letzte.monate} Monate verteilt bleiben damit ` +
    `${formatCurrencyRounded(sofort - letzte.endkapital)} liegen. Gerechnet ist ohne jede ` +
    `Kursschwankung, und das ist der Punkt: Der Nachteil des Verteilens ist kein Pech, sondern ` +
    `Arithmetik – ein Teil des Geldes ist schlicht nicht am Markt. Was die Grafik nicht zeigt, ist ` +
    `der Fall, für den man das Verteilen kauft: der Einbruch kurz nach dem Start. Beides zusammen ` +
    `ist die Entscheidung – hier steht der Preis, im Text daneben die Versicherung.`
  )
}

function renteFreibetrag(): string {
  const rechnung = calculatePension({ ...rentenBeispiel })
  const start = rechnung.grossStatutoryMonthly
  const freibetrag = start * (1 - pensionDefaults.taxablePercent / 100)

  const zeilen = [0, 5, 10, renteFreibetragJahre].map((jahr) => {
    const rente = start * (1 + renteErhoehungProzent / 100) ** jahr
    return { jahr, rente, anteil: ((rente - freibetrag) / rente) * 100 }
  })

  const erstes = zeilen[0]
  const letztes = zeilen[zeilen.length - 1]

  return (
    `Eine Bruttorente von ${formatCurrencyRounded(start)} im Monat, die jedes Jahr um ` +
    `${formatPercent(renteErhoehungProzent, 0)} steigt – eine bewusst vorsichtige Annahme. Im ersten ` +
    `Rentenjahr sind ${formatPercent(100 - pensionDefaults.taxablePercent, 0)} steuerfrei, das sind ` +
    `${formatCurrencyRounded(freibetrag)} im Monat. Dieser Eurobetrag wird festgeschrieben und bleibt ` +
    `lebenslang gleich; er ist in jeder Säule gleich hoch. Alles darüber ist steuerpflichtig. Dadurch ` +
    `steigt der steuerpflichtige Anteil von ${formatPercent(erstes.anteil, 0)} bei Rentenbeginn auf ` +
    `${formatPercent(letztes.anteil, 0)} nach ${renteFreibetragJahre} Jahren, und die Bruttorente ` +
    `wächst dabei von ${formatCurrencyRounded(erstes.rente)} auf ` +
    `${formatCurrencyRounded(letztes.rente)}. Am Steuerrecht muss sich dafür nichts ändern. Wer nur ` +
    `mit dem Prozentsatz des ersten Jahres plant, rechnet deshalb zu optimistisch.`
  )
}

/* ----------------------------------- Währung, Basiseffekt, Verkauf, Krypto */

function waehrungAbsicherung(): string {
  const letzteOhne = 100 * (1 + absicherungRendite / 100) ** absicherungJahre
  const letzteMit =
    100 * (1 + (absicherungRendite - absicherungZinsdifferenz) / 100) ** absicherungJahre
  const abstand = ((letzteOhne - letzteMit) / letzteOhne) * 100

  return (
    `Dieselbe Anlage über ${absicherungJahre} Jahre, einmal mit und einmal ohne ` +
    `Währungsabsicherung. Die Wertentwicklung ist in beiden Fällen dieselbe – der Wechselkurs kommt ` +
    `in dieser Rechnung bewusst nicht vor, weil er für die Kosten der Absicherung keine Rolle ` +
    `spielt. Die Absicherung kostet die Zinsdifferenz zwischen den beiden Währungsräumen, hier ` +
    `angenommen mit ${formatPercent(absicherungZinsdifferenz, 0)} im Jahr. Das ist keine Gebühr, die ` +
    `sich verhandeln ließe, sondern eine Folge der Arbitragefreiheit: Der Terminkurs entspricht dem ` +
    `Kassakurs, angepasst um genau diese Differenz. Aus 100 werden ohne Absicherung ` +
    `${formatNumber(letzteOhne, 0)}, mit Absicherung ${formatNumber(letzteMit, 0)} – ein Rückstand ` +
    `von ${formatPercent(abstand, 0)} nach ${absicherungJahre} Jahren. Kehrt sich die Zinsdifferenz ` +
    `um, kehrt sich auch das Vorzeichen um: Dann wird die Absicherung zur Einnahme. Beides ist ` +
    `unabhängig davon, wohin der Wechselkurs tatsächlich läuft.`
  )
}

function inflationBasiseffekt(): string {
  const letzterMonatMitRate = basiseffektSprungMonat + 11

  return (
    `Ein einziger Preissprung um ${formatPercent(basiseffektSprungProzent, 0)} im Monat ` +
    `${basiseffektSprungMonat}; danach ändert sich kein Preis mehr. Die blaue Linie zeigt das ` +
    `Preisniveau gegenüber dem Ausgangsmonat: Sie springt einmal und bleibt oben. Die rote Linie ` +
    `zeigt die Teuerungsrate, also den Abstand zum selben Monat des Vorjahres. Sie beginnt erst im ` +
    `zwölften Monat, weil es vorher keinen Vergleichsmonat gibt, steht dann bis Monat ` +
    `${letzterMonatMitRate} bei ${formatPercent(basiseffektSprungProzent, 0)} und fällt danach auf ` +
    `null. Gesunken ist dabei kein einziger Preis – aus der Rechnung ist lediglich der Sprung ` +
    `herausgefallen, weil er nun auch im Vergleichsmonat steckt. Das ist der Basiseffekt. Er ist der ` +
    `Grund, warum „die Inflation geht zurück“ und „es wird wieder billiger“ zwei völlig verschiedene ` +
    `Aussagen sind – und warum eine fallende Rate niemanden entlastet, der die höheren Preise weiter ` +
    `bezahlt.`
  )
}

function verkaufGruende(): string {
  return (
    'Acht Verkaufsgründe in zwei Spalten, sortiert nach ihrer Herkunft. Links die vier, die tragen, ' +
    'weil sie aus dem eigenen Plan oder dem eigenen Leben stammen: ' +
    VERKAUFSGRUENDE.tragen.join(', ') +
    '. Rechts die vier, die nicht tragen, weil sie aus dem Markt kommen: ' +
    VERKAUFSGRUENDE.tragenNicht.join(', ') +
    '. Die Herkunft ist das Erkennungsmerkmal und damit das eigentliche Werkzeug: Wer vor einem ' +
    'Verkauf nur eine Frage stellen kann, stellt diese – kommt der Grund von innen oder von außen? ' +
    'Ein Grund von außen ist fast immer eine Reaktion auf etwas, das bereits im Kurs steht.'
  )
}

function kryptoZugangswege(): string {
  return (
    'Drei Wege zu derselben Anlage, nebeneinander, mit dem jeweils verbleibenden Risiko: ' +
    ZUGANGSWEGE.map((z) => `${z.weg} – ${z.hat}; das Risiko ist ${z.risiko}`).join('. ') +
    '. Die Gegenüberstellung zeigt, dass es immer dasselbe Risiko ist, das nur die Stelle wechselt. ' +
    'Wer den Schlüssel selbst hält, trägt die Verwahrung selbst – und ein verlorener Schlüssel lässt ' +
    'sich nicht zurücksetzen. Wer ihn abgibt, tauscht dieses Risiko gegen das der Gegenstelle. ' +
    'Verschwinden lässt es sich auf keinem der drei Wege. Die Frage lautet deshalb nicht, welcher Weg ' +
    'sicher ist, sondern welches Risiko man lieber trägt.'
  )
}

/* ------------------------ Barwert, Tilgung, Schuldenquote, Dynamisierung */

function aktieBarwert(): string {
  const { von, bis } = bewertungKapitalkosten

  const wirkung = bewertungWachstum.map((wachstum) => {
    const basis = ewigeRente(1, bewertungBasiszins, wachstum)!
    const hoeher = ewigeRente(1, bewertungBasiszins + bewertungAenderung, wachstum)!
    return { wachstum, abweichung: ((hoeher - basis) / basis) * 100 }
  })

  return (
    `Der Barwert einer ewig wachsenden Zahlung von einem Euro, aufgetragen über dem ` +
    `Kapitalkostensatz von ${formatPercent(von, 1)} bis ${formatPercent(bis, 0)}, für zwei ` +
    `Wachstumsannahmen. Beide Kurven fallen von links nach rechts, und beide tun das nicht ` +
    `gleichmäßig: Zum unteren Ende hin läuft der Wert davon, weil er durch die Differenz aus ` +
    `Kapitalkosten und Wachstum geteilt wird und diese Differenz dort klein wird. ` +
    wirkung
      .map(
        (w) =>
          `Bei ${formatPercent(w.wachstum, 0)} Wachstum kostet ein halber Prozentpunkt mehr ` +
          `Kapitalkosten – von ${formatPercent(bewertungBasiszins, 0)} auf ` +
          `${formatPercent(bewertungBasiszins + bewertungAenderung, 1)} – ` +
          `${formatPercent(Math.abs(w.abweichung), 0)} des Werts`
      )
      .join('; ') +
    `. Beide Größen, Kapitalkosten und ewiges Wachstum, sind Annahmen und keine Beobachtungen. ` +
    `Deshalb liefert ein Bewertungsmodell keine Zahl, sondern eine Bandbreite – und die ` +
    `produktivere Frage lautet nicht „was ist die Aktie wert“, sondern „welche Annahmen ` +
    `unterstellt der heutige Kurs“.`
  )
}

function kreditTilgenOderAnlegen(): string {
  const zeilen = tilgungszinsen.map((zins) => ({
    zins,
    noetig: noetigeBruttorendite(zins, effektiverSteuersatz),
  }))
  const mittel = zeilen.find((z) => z.zins === 5)!

  return (
    `Was eine Anlage vor Steuern bringen müsste, um eine Tilgung gerade auszugleichen – bei ` +
    `${formatPercent(effektiverSteuersatz, 3)} Abgeltungsteuer samt Solidaritätszuschlag. ` +
    zeilen
      .map(
        (zeile) =>
          `${formatPercent(zeile.zins, 0)} Kreditzins verlangen ` +
          `${formatPercent(zeile.noetig, 1)} Bruttorendite`
      )
      .join('; ') +
    `. Der Grund für den Abstand: Der Ertrag einer Tilgung ist der ersparte Zins, und der wird ` +
    `nicht besteuert – eine ersparte Ausgabe ist kein Ertrag. Wer beide Prozentzahlen ` +
    `nebeneinanderlegt, vergleicht deshalb eine Nettogröße mit einer Bruttogröße, und zwar ` +
    `systematisch zugunsten der Anlage. Bei ${formatPercent(mittel.zins, 0)} Kreditzins liegt die ` +
    `Schwelle schon bei ${formatPercent(mittel.noetig, 1)}. Der zweite Einwand steht in dieser ` +
    `Grafik nicht und wiegt schwerer: Die Tilgung liefert ihren Ertrag sicher, die Anlage im ` +
    `Erwartungswert. Der faire Vergleichspartner einer Tilgung ist deshalb eine ebenso sichere ` +
    `Anlage – und die bringt weit weniger als der Aktienmarkt.`
  )
}

function staatsschuldDynamik(): string {
  const enden = schuldenDifferenzen.map((differenz) => {
    const pfad = schuldenquotenpfad(
      schuldenStartquote,
      schuldenWachstum + differenz,
      schuldenWachstum,
      schuldenJahre
    )
    return formatPercent(pfad[pfad.length - 1], 0)
  })

  const guenstig = enden[0]
  const unguenstig = enden[enden.length - 1]

  return (
    `Dieselbe Startquote von ${formatPercent(schuldenStartquote, 0)} des ` +
    `Bruttoinlandsprodukts, ${schuldenJahre} Jahre fortgeschrieben – bei einem nominalen Wachstum ` +
    `von ${formatPercent(schuldenWachstum, 0)} und vier verschiedenen Zinssätzen. Gerechnet ist ` +
    `ohne jeden Primärsaldo: Der Haushalt ist in allen vier Fällen ausgeglichen, Zinszahlungen ` +
    `nicht gerechnet. Trotzdem laufen die Quoten auseinander. Liegt der Zins einen Prozentpunkt ` +
    `unter dem Wachstum, sinkt die Quote auf ${guenstig}; liegt er zwei darüber, steigt sie ` +
    `auf ${unguenstig}. Die Höhe einer Schuldenquote sagt deshalb wenig – entscheidend ist ` +
    `die Richtung, und die hängt an einer einzigen Differenz. Das erklärt, warum Japan mit einer ` +
    `weit höheren Quote die niedrigsten Zinsen der Industrieländer zahlt und Argentinien mit einem ` +
    `Bruchteil davon mehrfach in Zahlungsschwierigkeiten geriet. Was eine Regierung steuern kann, ` +
    `ist der Primärsaldo – Zins und Wachstum kann sie es nicht.`
  )
}

/** Endkapital eines dynamisierten Sparplans – dieselbe Schleife wie in der Zeichnung. */
function endkapitalMitDynamik(steigerungProzent: number): number {
  let kapital = 0
  let rate = dynamikStartrate

  for (let jahr = 0; jahr < dynamikJahre; jahr++) {
    for (let monat = 0; monat < 12; monat++) {
      kapital = kapital * (1 + dynamikRendite / 100 / 12) + rate
    }
    rate = rate * (1 + steigerungProzent / 100)
  }
  return kapital
}

/** Was dabei insgesamt eingezahlt wurde. */
function eingezahltMitDynamik(steigerungProzent: number): number {
  let summe = 0
  let rate = dynamikStartrate
  for (let jahr = 0; jahr < dynamikJahre; jahr++) {
    summe += rate * 12
    rate = rate * (1 + steigerungProzent / 100)
  }
  return summe
}

function sparplanDynamisierung(): string {
  const zeilen = dynamikSteigerungen.map((steigerung) => ({
    steigerung,
    endkapital: endkapitalMitDynamik(steigerung),
    eingezahlt: eingezahltMitDynamik(steigerung),
    letzteRate: dynamikStartrate * (1 + steigerung / 100) ** (dynamikJahre - 1),
  }))

  const ohne = zeilen[0]
  const staerkste = zeilen[zeilen.length - 1]

  return (
    `Ein Sparplan über ${dynamikJahre} Jahre, Startrate ` +
    `${formatCurrencyRounded(dynamikStartrate)} im Monat, ` +
    `${formatPercent(dynamikRendite, 0)} Rendite im Jahr – einmal mit gleichbleibender Rate und ` +
    `dreimal mit einer Rate, die jedes Jahr steigt. Ergebnisse: ` +
    zeilen
      .map(
        (zeile) =>
          `${zeile.steigerung === 0 ? 'ohne Steigerung' : `mit ${formatPercent(zeile.steigerung, 0)} Steigerung`} ` +
          `${formatCurrencyRounded(zeile.endkapital)}, davon ` +
          `${formatCurrencyRounded(zeile.eingezahlt)} eingezahlt, letzte Monatsrate ` +
          `${formatCurrencyRounded(zeile.letzteRate)}`
      )
      .join('; ') +
    `. Der Unterschied zwischen gleichbleibender Rate und ` +
    `${formatPercent(staerkste.steigerung, 0)} Steigerung beträgt ` +
    `${formatCurrencyRounded(staerkste.endkapital - ohne.endkapital)}. Er entsteht nicht durch ` +
    `Rendite, sondern durch Einzahlung: Die letzte Rate liegt bei ` +
    `${formatCurrencyRounded(staerkste.letzteRate)} statt bei ` +
    `${formatCurrencyRounded(dynamikStartrate)}. Genau deshalb ist die Dynamisierung die ` +
    `wirksamste Stellschraube, die keine Prognose braucht – sie folgt dem Einkommen und nicht dem ` +
    `Markt. Wer sie einrichtet, muss nur darauf achten, dass sie an das eigene Einkommen gekoppelt ` +
    `bleibt und nicht an eine feste Zusage, die in einem schlechten Jahr zur Belastung wird.`
  )
}

/* --------------------------- Grafiken mit Formbeschreibung im Verzeichnis */

/*
  Diese Gruppe hatte bis zum 23. August 2026 zwei Beschreibungen: eine
  gerechnete in der Zeichnung und eine **Formbeschreibung** in
  `data/figures.ts` („Waagerechte Balken, oben der kleinste Verlust“).
  `<desc>` zeigte die gerechnete, die Vorlesefassung sprach die Form.

  Wer die Grafik nicht sehen kann, bekam damit die Auskunft, wie sie aussieht,
  statt was in ihr steht – und `data/figures.ts` verlangt in seinem eigenen
  Kopf das Gegenteil: „ein inhaltlicher Satz und keine Formbeschreibung“. Die
  Formbeschreibungen sind gestrichen; hier stehen die gerechneten.
*/

function msciWorldLaender(): string {
  const satz = indexZusammensetzung['msci-world']
  if (!satz) throw new Error('Keine Ländergewichtung für msci-world hinterlegt.')

  return `Ländergewichtung zum ${satz.stand}: ${satz.laender
    .map((land) => `${land.land} ${formatPercent(land.anteil, 2)}`)
    .join(', ')}.`
}

function risikoErholung(): string {
  const stufen = risikoRueckgaenge.map((verlust) => ({
    verlust,
    gewinn: recoveryGainPercent(verlust) ?? 0,
  }))

  return (
    'Wie viel Gewinn nötig ist, um einen Verlust wieder auszugleichen: ' +
    stufen
      .map(
        ({ verlust, gewinn }) =>
          `${formatPercent(verlust, 0)} Verlust brauchen ${formatPercent(gewinn, 0)} Gewinn`
      )
      .join(', ') +
    '. Bis zu einem Fünftel sind beide Zahlen fast gleich groß, ab der Hälfte laufen sie ' +
    'auseinander: Wer neunzig Prozent verliert, braucht eine Verzehnfachung, nur um wieder bei ' +
    'null zu sein.'
  )
}

function bitcoinAngebot(): string {
  const jahreJeEpoche =
    (bitcoinBloeckeJeEpoche * bitcoinMinutenJeBlock) / (60 * 24 * 365.25)

  const punkte: { x: number; y: number }[] = [{ x: bitcoinStartjahr, y: 0 }]
  let menge = 0
  let belohnung = bitcoinStartbelohnung

  for (let epoche = 0; epoche < 32; epoche++) {
    menge += belohnung * bitcoinBloeckeJeEpoche
    punkte.push({ x: bitcoinStartjahr + (epoche + 1) * jahreJeEpoche, y: menge })
    belohnung /= 2
  }

  const heute = punkte.find((punkt) => punkt.x >= 2026) ?? punkte[punkte.length - 1]

  return (
    `Die Umlaufmenge nach dem Emissionsplan des Protokolls: ${bitcoinStartbelohnung} Münzen je Block, alle ` +
    `${formatNumber(bitcoinBloeckeJeEpoche, 0)} Blöcke halbiert, ein Block etwa alle ${bitcoinMinutenJeBlock} ` +
    `Minuten. Die Kurve steigt anfangs steil und flacht mit jeder Halbierung ab. Um ` +
    `${formatNumber(Math.round(heute.x), 0)} sind bereits rund ` +
    `${formatNumber(Math.round(heute.y / 100_000) / 10, 1)} Millionen im Umlauf – über ` +
    `${formatPercent((heute.y / bitcoinObergrenze) * 100, 0)} der Obergrenze von ` +
    `${formatNumber(bitcoinObergrenze / 1_000_000, 0)} Millionen. Der Rest verteilt sich auf mehr als ` +
    `hundert Jahre. Die Knappheit ist damit kein Versprechen, sondern eine Regel im Programmcode – was ` +
    `sie über den Preis aussagt, ist eine andere Frage: Ein knappes Gut ohne Nachfrage ist wertlos.`
  )
}

function budgetHaushalt(): string {
  const haushalt = calculateBudget([...haushaltEinnahmen], [...haushaltAusgaben])
  const einnahmen = haushaltEinnahmen.reduce((summe, e) => summe + e.amount, 0)
  const sortiert = [...haushaltAusgaben].sort((a, b) => b.amount - a.amount)
  const dreiGroesste = sortiert.slice(0, 3).reduce((summe, a) => summe + a.amount, 0)

  return (
    `Ein Haushalt mit ${formatCurrencyRounded(einnahmen)} netto im Monat, die Ausgaben nach Größe ` +
    `sortiert: ` +
    sortiert.map((p) => `${p.label} ${formatCurrencyRounded(p.amount)}`).join(', ') +
    `. Übrig bleiben ${formatCurrencyRounded(haushalt.balance)}, also eine Sparquote von ` +
    `${formatPercent(haushalt.savingsRatePercent, 1)}. Die drei größten Posten machen zusammen ` +
    `${formatCurrencyRounded(dreiGroesste)} aus – mehr als alle übrigen zusammen. Deshalb ist die ` +
    `Reihenfolge die eigentliche Aussage: Wer sparen will, fängt oben an. Zehn Prozent bei den ` +
    `Wohnkosten bringen mehr als der vollständige Verzicht auf die beiden kleinsten Posten.`
  )
}

function sparplanDurchschnittspreis(): string {
  const kaeufe = sparplanKurse.map((kurs) => ({ kurs, anteile: sparplanRate / kurs }))
  const anteile = kaeufe.reduce((summe, kauf) => summe + kauf.anteile, 0)
  const eingezahlt = sparplanRate * sparplanKurse.length
  const durchschnittspreis = eingezahlt / anteile
  const kursdurchschnitt =
    sparplanKurse.reduce((summe, kurs) => summe + kurs, 0) / sparplanKurse.length

  return (
    `Sechs Raten zu je ${formatCurrency(sparplanRate)} bei Kursen von ` +
    sparplanKurse.map((kurs) => formatCurrency(kurs)).join(', ') +
    `. Die Rate bleibt gleich, also kauft sie bei niedrigem Kurs mehr Anteile – bei ` +
    `${formatCurrency(Math.min(...sparplanKurse))} sind es ${formatNumber(sparplanRate / Math.min(...sparplanKurse), 1)}, ` +
    `bei ${formatCurrency(Math.max(...sparplanKurse))} nur ${formatNumber(sparplanRate / Math.max(...sparplanKurse), 1)}. ` +
    `Nach ${formatCurrency(eingezahlt)} Einzahlung liegen ${formatNumber(anteile, 1)} Anteile im Depot, ` +
    `im Schnitt zu ${formatCurrency(durchschnittspreis)} gekauft. Der Durchschnitt der sechs Kurse liegt bei ` +
    `${formatCurrency(kursdurchschnitt)} – der bezahlte Preis liegt darunter, und zwar allein deshalb, ` +
    `weil die Rate gleich blieb.`
  )
}

/** Die drei Guthaben, an denen die Sicherungsgrenze gezeigt wird. */
const SICHERUNGS_GUTHABEN = [60_000, 100_000, 180_000] as const

function einlagensicherungGrenzeText(): string {
  const groesstes = SICHERUNGS_GUTHABEN[SICHERUNGS_GUTHABEN.length - 1]

  return (
    `Die gesetzliche Einlagensicherung deckt ${formatCurrencyRounded(einlagensicherungGrenze)} je Kunde ` +
    `und Bank. Bei ${formatCurrencyRounded(SICHERUNGS_GUTHABEN[0])} ist damit alles gesichert. Bei ` +
    `${formatCurrencyRounded(einlagensicherungGrenze)} ebenfalls, genau bis zum letzten Euro. Bei ` +
    `${formatCurrencyRounded(groesstes)} sind ` +
    `${formatCurrencyRounded(groesstes - einlagensicherungGrenze)} nicht gedeckt – dieser Teil hinge im ` +
    `Insolvenzfall an der Masse. Die Grenze gilt je Bank, nicht je Konto: Zwei Konten bei derselben Bank ` +
    `werden zusammengezählt. Vorübergehend, etwa nach einem Hausverkauf, sind bis zu ` +
    `${formatCurrencyRounded(einlagensicherungErhoeht)} gedeckt.`
  )
}

function boerseVomKlickZurBuchung(): string {
  return (
    'Der Weg einer Wertpapierorder in fünf Schritten. Erstens: Du erteilst die Order bei deinem Broker – ' +
    'zur Börse selbst haben nur zugelassene Teilnehmer Zugang. Zweitens: Der Broker leitet sie an den ' +
    'Handelsplatz weiter. Drittens: Findet sich im Orderbuch ein passendes Gegenangebot, kommt das ' +
    'Geschäft zustande; andernfalls wartet die Order oder verfällt. Diese drei Schritte dauern ' +
    'Sekundenbruchteile. Viertens: Die Abwicklung tauscht Geld gegen Papiere, in der EU zwei Werktage ' +
    'nach dem Geschäft, in den USA einen. Fünftens: die Buchung ins Depot. Bis dahin hattest du einen ' +
    'Anspruch auf die Papiere, nicht die Papiere.'
  )
}

function derivatHebel(): string {
  const stufen = derivatSicherheitssaetze.map((satz) => ({
    satz,
    hebel: 100 / satz,
    totalverlustBei: satz,
  }))

  return (
    `Wie viel Sicherheitsleistung welchen Hebel ergibt, bei ${formatCurrencyRounded(derivatEinsatz)} ` +
    `Einsatz. ` +
    stufen
      .map(
        ({ satz, hebel, totalverlustBei }) =>
          `${formatPercent(satz, 0)} Sicherheit bedeuten Hebel ${formatNumber(hebel, 0)}, und der Einsatz ` +
          `ist bei ${formatPercent(totalverlustBei, 0)} Kursbewegung gegen die Position vollständig weg`
      )
      .join('; ') +
    `. Der Hebel wirkt in beide Richtungen, aber nicht symmetrisch: Nach oben ist der Gewinn offen, ` +
    `nach unten endet die Position beim Einsatz – und zwar bei einer Bewegung, die bei einer Aktie ein ` +
    `gewöhnlicher Handelstag wäre.`
  )
}

function inflationKaufkraft(): string {
  const reihe = kaufkraftreihe()
  const ende = reihe[reihe.length - 1]

  return `${formatCurrencyRounded(inflationsbeispiel.betrag)} bleiben ${inflationsbeispiel.jahre} Jahre unverzinst liegen, bei ${formatPercent(inflationsbeispiel.rate, 1)} Inflation im Jahr. Die Zahl auf dem Konto bleibt unverändert, die Kaufkraft fällt stetig auf ${formatCurrencyRounded(ende.kaufkraft)} – ein Verlust von ${formatPercent(ende.verlustProzent, 0)}, ohne dass etwas abgebucht worden wäre.`
}

function optionZeitwertverfall(): string {
  const bei = (restMonate: number) =>
    preis('call', { ...optionBasis, jahre: restMonate / 12 })

  const jahresPraemie = bei(12)
  const monatsPraemie = bei(1)
  const anteilLetzterMonat = (monatsPraemie / jahresPraemie) * 100

  return (
    `Die Prämie einer Kaufoption am Geld über die Restlaufzeit. Bei zwölf Monaten kostet sie ` +
    `${formatNumber(jahresPraemie, 2)} Euro, bei einem Monat noch ${formatNumber(monatsPraemie, 2)} Euro – ` +
    `${formatNumber(anteilLetzterMonat, 0)} Prozent des Anfangswerts. Elf Monate haben also drei Viertel ` +
    `des Werts gekostet, der letzte Monat allein das restliche Viertel. Die Kurve fällt zum Verfall hin ` +
    `immer steiler auf null.`
  )
}

function immobilieNettorendite(): string {
  const jahresmiete = immobilieJahresmiete
  const verwaltung = immobilieVerwaltung
  const instandhaltung = immobilieInstandhaltung
  const mietausfall = jahresmiete * (immobilieMietausfallProzent / 100)
  const nettomiete = jahresmiete - verwaltung - instandhaltung - mietausfall
  const einsatz = immobilieKaufpreis * (1 + immobilieNebenkostenProzent / 100)
  const brutto = (jahresmiete / immobilieKaufpreis) * 100
  const netto = (nettomiete / einsatz) * 100

  return (
    `Eine Wohnung für ${formatCurrencyRounded(immobilieKaufpreis)} bringt ` +
    `${formatCurrencyRounded(jahresmiete)} Miete im Jahr – beworben als ` +
    `${formatPercent(brutto, 1)} Rendite. Davon gehen ab: ` +
    `${formatCurrencyRounded(verwaltung)} Verwaltung, ${formatCurrencyRounded(instandhaltung)} ` +
    `Instandhaltung und ${formatCurrencyRounded(mietausfall)} kalkulierter Mietausfall. Übrig bleiben ` +
    `${formatCurrencyRounded(nettomiete)}. Bezogen auf den tatsächlichen Einsatz von ` +
    `${formatCurrencyRounded(einsatz)} – Kaufpreis plus ${formatPercent(immobilieNebenkostenProzent, 0)} ` +
    `Nebenkosten – sind das ${formatPercent(netto, 1)}. Aus der beworbenen Zahl ist damit weniger als die ` +
    `Hälfte geworden, und der Kredit ist darin noch nicht enthalten.`
  )
}

function optionAuszahlung(): string {
  const schwelleCall = gewinnschwelle('call', optionBasis)
  const schwellePut = gewinnschwelle('put', optionBasis)

  return (
    `Ergebnis zweier Optionen auf einen Basiswert von ${formatNumber(optionBasis.kurs, 0)} Euro ` +
    `mit Basispreis ${formatNumber(optionBasis.basispreis, 0)} Euro bei Verfall. Beide Linien verlaufen ` +
    `zunächst waagerecht im Minus – so hoch ist die bezahlte Prämie, und mehr kann der Käufer nicht ` +
    `verlieren. Ab dem Knick am Basispreis steigt das Ergebnis; die Gewinnschwelle liegt beim Call bei ` +
    `${formatNumber(schwelleCall, 2)} Euro, beim Put bei ${formatNumber(schwellePut, 2)} Euro. ` +
    `Der Call kennt nach oben keine Grenze, der Put endet bei einem Kurs von null.`
  )
}

function renteLuecke(): string {
  const rechnung = calculatePension({ ...rentenBeispiel })
  const bruttoMonat = rentenBeispiel.grossAnnualIncome / 12

  return (
    `Ein Bruttoeinkommen von ${formatCurrencyRounded(rentenBeispiel.grossAnnualIncome)} im Jahr, ` +
    `${rentenBeispiel.yearsWorked} Beitragsjahre hinter sich und ${rentenBeispiel.yearsRemaining} vor sich. ` +
    `Heute sind das ${formatCurrencyRounded(bruttoMonat)} brutto im Monat. Die Bruttorente daraus beträgt ` +
    `${formatCurrencyRounded(rechnung.grossStatutoryMonthly)} – das ist der Betrag, der auf der ` +
    `Renteninformation steht. Davon gehen ${formatCurrencyRounded(rechnung.healthDeduction)} für Kranken- ` +
    `und Pflegeversicherung und rund ${formatCurrencyRounded(rechnung.taxDeduction)} Steuer ab. Es bleiben ` +
    `${formatCurrencyRounded(rechnung.netStatutoryMonthly)} im Monat, also ` +
    `${formatPercent(rechnung.replacementRatePercent, 0)} des heutigen Bruttoeinkommens, erreicht mit ` +
    `${formatNumber(rechnung.totalPoints, 1)} Rentenpunkten.`
  )
}

function kostenEndkapital(): string {
  const eingezahlt = sparfall.rate * 12 * sparfall.jahre
  const guenstigste = endkapital(
    sparfall.rate,
    sparfall.brutto - kostenstufen[0],
    sparfall.jahre
  )
  const teuerste = endkapital(
    sparfall.rate,
    sparfall.brutto - kostenstufen[kostenstufen.length - 1],
    sparfall.jahre
  )

  return (
    `${formatCurrencyRounded(sparfall.rate)} monatlich über ${sparfall.jahre} Jahre bei ` +
    `${formatPercent(sparfall.brutto, 0)} Bruttorendite, belastet mit ` +
    `${formatPercent(kostenstufen[0], 1)} bis ${formatPercent(kostenstufen[kostenstufen.length - 1], 1)} ` +
    `laufenden Kosten. Der graue Sockel ist bei allen fünf gleich – das eingezahlte Geld von ` +
    `${formatCurrencyRounded(eingezahlt)}. Unterschiedlich ist allein der Ertrag darüber: ` +
    `${formatCurrencyRounded(guenstigste - eingezahlt)} bei der günstigsten Variante, ` +
    `${formatCurrencyRounded(teuerste - eingezahlt)} bei der teuersten. Am Ende stehen damit ` +
    `${formatCurrencyRounded(guenstigste)} gegen ${formatCurrencyRounded(teuerste)}. Die Differenz von ` +
    `${formatCurrencyRounded(guenstigste - teuerste)} entspricht ` +
    `${formatPercent(((guenstigste - teuerste) / eingezahlt) * 100, 0)} aller Einzahlungen – ` +
    `abgeflossen für einen Unterschied von ` +
    `${formatPercent(kostenstufen[kostenstufen.length - 1] - kostenstufen[0], 1)} pro Jahr.`
  )
}

/** Die Anfangstilgung des Beispieldarlehens – dieselbe wie in der Zeichnung. */
const KREDIT_TILGUNG = 2

function kreditZinsUndTilgung(): string {
  const rate = rateBeiTilgungssatz(immobilienkredit, KREDIT_TILGUNG)
  const plan = tilgungsplan(immobilienkredit, rate)
  const ergebnis = auswerten(immobilienkredit, rate)

  const laufzeitJahre = Math.ceil(plan.length / 12)
  const anteil = (jahr: number) => {
    const monate = plan.slice((jahr - 1) * 12, jahr * 12)
    const zins = monate.reduce((summe, monat) => summe + monat.zins, 0)
    const tilgung = monate.reduce((summe, monat) => summe + monat.tilgung, 0)
    return `${formatNumber((tilgung / (zins + tilgung)) * 100, 0)} % Tilgung`
  }

  return (
    `Ein Darlehen über ${formatCurrencyRounded(immobilienkredit.summe)} zu ` +
    `${formatNumber(immobilienkredit.zinsProzent, 1)} Prozent mit ${KREDIT_TILGUNG} Prozent Anfangstilgung. ` +
    `Die Jahresrate bleibt über die gesamte Laufzeit gleich hoch – jede Säule ist gleich groß. ` +
    `Was sich verschiebt, ist ihre Aufteilung: Im ersten Jahr sind ${anteil(1)}, im letzten ` +
    `${anteil(laufzeitJahre)}. Insgesamt läuft der Kredit ${formatNumber(ergebnis.monate / 12, 0)} Jahre, ` +
    `und es fallen ${formatCurrencyRounded(ergebnis.zinsenGesamt)} Zinsen an.`
  )
}

function einsteigerReihenfolge(): string {
  return (
    'Die Reihenfolge vor dem ersten Wertpapierkauf. Erstens teure Schulden tilgen: Ein Dispo zu zehn ' +
    'Prozent zu beenden bringt sicher zehn Prozent, was keine Anlage verspricht. Zweitens den ' +
    'Notgroschen aufbauen – rund drei Nettogehälter, jederzeit verfügbar, damit die erste kaputte ' +
    'Waschmaschine nicht zum Verkauf im falschen Moment zwingt. Drittens die Risiken versichern, die ' +
    'existenzbedrohend wären, und nur diese. Viertens die Ziele mit einem Zeitraum versehen; erst er ' +
    'entscheidet, was überhaupt in Frage kommt. Der eigentliche Kauf steht am Ende dieser Kette, nicht ' +
    'am Anfang.'
  )
}

function tagesgeldRealzins(): string {
  const fehlbetrag = inflationsbeispiel.rate - realzinsbeispiel.nominal

  return (
    `Ein Tagesgeldkonto zu ${formatPercent(realzinsbeispiel.nominal, 1)} Zins bei ` +
    `${formatPercent(inflationsbeispiel.rate, 1)} Inflation. Der Zins deckt den unteren Teil der ` +
    `Inflationssäule; der obere Teil von ${formatPercent(fehlbetrag, 1)} bleibt ungedeckt. Der Realzins ` +
    `beträgt damit ${formatPercent(realzinsbeispiel.real, 2)}: Das Konto wächst, die Kaufkraft schrumpft. ` +
    `Auf dem Kontoauszug ist davon nichts zu sehen – dort steht nur die erste Säule.`
  )
}

function waehrungErgebnis(): string {
  const dollarStart = waehrungEinsatz * waehrungKursStart
  const dollarEnde = dollarStart * (1 + waehrungKursgewinn / 100)

  const saeulen = waehrungKurse.map((kursEnde) => {
    const euro = dollarEnde / kursEnde
    const ergebnis = ((euro - waehrungEinsatz) / waehrungEinsatz) * 100
    return {
      label: formatNumber(kursEnde, 2),
      wertText: `${ergebnis >= 0 ? '+' : '−'} ${formatPercent(Math.abs(ergebnis), 1)}`,
      hinweis: formatCurrencyRounded(euro),
    }
  })

  const schlechtester = waehrungKurse[waehrungKurse.length - 1]
  const euroSchlecht = dollarEnde / schlechtester

  return (
    `${formatCurrencyRounded(waehrungEinsatz)} werden bei einem Kurs von ` +
    `${formatNumber(waehrungKursStart, 2)} Dollar je Euro in eine Dollaranlage gesteckt. Die Anlage ` +
    `gewinnt ${formatPercent(waehrungKursgewinn, 0)} – in Dollar. Was in Euro ankommt, hängt vom Kurs ` +
    `beim Verkauf ab: ` +
    saeulen.map((s) => `bei ${s.label} sind es ${s.hinweis} (${s.wertText})`).join(', ') +
    `. Wertet der Euro auf ${formatNumber(schlechtester, 2)} auf, bleiben von zehn Prozent Kursgewinn ` +
    `${formatCurrencyRounded(euroSchlecht)} – der Wechselkurs hat mehr entschieden als die Anlage.`
  )
}

function sparerpauschbetragGrenze(): string {
  const balken = sparerRenditen.map((rendite) => ({
    label: `${formatPercent(rendite, 1)} Ertrag`,
    wertText: formatCurrencyRounded(sparerPauschbetrag / (rendite / 100)),
  }))

  const niedrig = sparerPauschbetrag / (sparerRenditen[0] / 100)
  const hoch = sparerPauschbetrag / (sparerRenditen[sparerRenditen.length - 1] / 100)

  return (
    `Bis zu welchem Depotwert der Sparerpauschbetrag von ` +
    `${formatCurrencyRounded(sparerPauschbetrag)} die steuerpflichtigen Erträge eines Jahres deckt – ` +
    `je nachdem, wie viel Prozent davon als Zins, Dividende oder Vorabpauschale anfallen. ` +
    balken.map((b) => `bei ${b.label} sind es ${b.wertText}`).join(', ') +
    `. Wer wenig laufenden Ertrag hat, kommt bis ${formatCurrencyRounded(niedrig)} ohne Steuer aus; ` +
    `bei hohem laufendem Ertrag ist der Freibetrag schon ab ${formatCurrencyRounded(hoch)} verbraucht. ` +
    `Die Rechnung sagt nichts über Kursgewinne – die werden erst beim Verkauf steuerpflichtig.`
  )
}

function crashesErholung(): string {
  const sortiert = [...kurseinbrueche].sort(
    (a, b) => b.rueckgangProzent - a.rueckgangProzent
  )

  return (
    'Fünf große Kurseinbrüche, nach der Tiefe des Rückgangs sortiert, und daneben die Zeit bis zum ' +
    'Wiedererreichen des alten Stands: ' +
    sortiert
      .map(
        (e) =>
          `${e.name}, ${formatPercent(e.rueckgangProzent, 0)} Rückgang, ` +
          (e.erholungJahre < 1
            ? `${formatNumber(e.erholungJahre * 12, 0)} Monate Erholung`
            : `${formatNumber(e.erholungJahre, 0)} Jahre Erholung`)
      )
      .join('; ') +
    '. Die Reihenfolge der Balken folgt der Tiefe – ihre Länge tut es nicht. Der Dotcom-Einbruch und ' +
    'die Finanzkrise waren gleich tief und unterschiedlich lang; die Pandemie war tiefer als 1987 und ' +
    'schneller vorbei. Was den Unterschied macht, ist nicht der Auslöser, sondern was danach ' +
    'wirtschaftspolitisch geschah. Alle Angaben sind Größenordnungen für breite Indizes.'
  )
}

function staatsanleiheLaufzeiten(): string {
  return (
    'Die deutschen Bundeswertpapiere nach ihrer Laufzeit bei Ausgabe: ' +
    BUNDESPAPIERE.map(
      (p) =>
        `${p.name} mit ${p.jahre} ${p.jahre === 1 ? 'Jahr' : 'Jahren'} – ${p.hinweis}`
    ).join('; ') +
    '. Die Namen sagen nichts über die Sicherheit: Hinter allen steht derselbe Schuldner. Sie sagen ' +
    'etwas über die Empfindlichkeit. Je länger die Laufzeit, desto stärker schwankt der Kurs, wenn ' +
    'sich die Zinsen ändern – und desto weniger folgt er kurzfristigen Entscheidungen der Notenbank. ' +
    'Die Achse ist gestaucht, weil sonst vier der fünf Papiere übereinanderlägen.'
  )
}

function portfolioQuoteRueckgang(): string {
  const zeilen = portfolioQuoten.map((quote) => {
    const rueckgang = (quote / 100) * portfolioMarktrueckgang
    const verlust = portfolioDepotwert * (rueckgang / 100)
    return { quote, rueckgang, verlust, bleibt: portfolioDepotwert - verlust }
  })

  return (
    `Fünf Depots mit jeweils ${formatCurrencyRounded(portfolioDepotwert)}, die sich allein in der ` +
    `Aktienquote unterscheiden. Der Aktienmarkt fällt um ${formatPercent(portfolioMarktrueckgang, 0)}, ` +
    `der risikoarme Teil bleibt, wo er ist. Übrig bleiben: ` +
    zeilen
      .map(
        (zeile) =>
          `bei ${formatPercent(zeile.quote, 0)} Aktienquote ${formatCurrencyRounded(zeile.bleibt)}, ` +
          `also ${formatCurrencyRounded(zeile.verlust)} oder ${formatPercent(zeile.rueckgang, 0)} weniger`
      )
      .join('; ') +
    `. Jede Säule ist gleich hoch, weil alle fünf Depots gleich groß starten – unterschiedlich ist ` +
    `allein der rote Anteil. Die Grafik beantwortet nicht, welche Quote richtig ist. Sie zeigt, ` +
    `worüber man entscheidet: nicht über eine Rendite, sondern über den Betrag, den man aushalten ` +
    `muss, ohne zu verkaufen.`
  )
}

/**
 * Was das Auslassen der besten Wochen kostet.
 *
 * Fällt die Kursreihe aus, sagt die Beschreibung genau das – dieselbe
 * Entscheidung wie in der Zeichnung, die dann leer bleibt. Eine Aussage über
 * Markttiming aus Demo-Kursen wäre schlimmer als gar keine.
 */
function timingBesteWochen(): string {
  const reihe = getLiveSeries(timingIndex)
  const punkte: Kurspunkt[] =
    reihe?.daily.map((punkt) => ({ d: punkt.t, c: punkt.value })) ?? []

  if (punkte.length === 0) {
    return 'Für diesen Index liegen derzeit keine echten Kurse vor. Die Grafik bleibt deshalb leer.'
  }

  const auslassungen = ohneBestePerioden(punkte, [...timingAuslassungen])
  const voll = auslassungen[0]
  const ohneZehn = auslassungen.find((a) => a.ausgelassen === 10)

  return (
    `Die Gesamtrendite des ${timingIndex.toUpperCase()} über den betrachteten Zeitraum, jeweils ohne die ` +
    `besten Wochen. Wer durchgehend investiert war, erzielte ${formatPercent(voll.rendite, 1)}. ` +
    (ohneZehn
      ? `Ohne die zehn besten Wochen – von mehreren hundert – bleiben ${formatPercent(ohneZehn.rendite, 1)}. `
      : '') +
    `Die besten Wochen sind wenige und liegen fast immer unmittelbar nach den schlechtesten; wer nach ` +
    `einem Rückgang aussteigt, verpasst genau sie.`
  )
}

/**
 * Die gerechneten Beschreibungen, nach Grafikkennung.
 *
 * Absichtlich `Record<string, () => string>` und keine feste Kennungsliste:
 * Eine Grafik gehört hier nur hinein, solange sie ihre Beschreibung rechnet.
 * Wer eine feste Beschreibung nach `data/figures.ts` verschiebt, streicht hier
 * die Zeile – ein `Record<FigureId, …>` würde ihn stattdessen zwingen, eine
 * zweite zu erfinden.
 */
const RECHNER: Record<string, () => string> = {
  'anleihe-kurs-und-zins': anleiheKursUndZins,
  'staatsanleihe-zinsschock': staatsanleiheZinsschock,
  'kredit-anfangstilgung': kreditAnfangstilgung,
  'immobilie-restschuld': immobilieRestschuld,
  'risiko-sequenz': risikoSequenz,
  'option-delta': optionDelta,
  'anleihe-konvexitaet': anleiheKonvexitaet,
  'zinseszins-steuerstundung': zinseszinsSteuerstundung,
  'inflation-steuer': inflationSteuer,
  'immobilie-hebel': immobilieHebel,
  'derivat-pfadabhaengigkeit': derivatPfadabhaengigkeit,
  'streuung-titelzahl': streuungTitelzahl,
  'portfolio-entnahme': portfolioEntnahme,
  'rohstoffe-gold-steuer': rohstoffeGoldSteuer,
  'rente-rentenbeginn': renteRentenbeginn,
  'timing-trefferquote': timingTrefferquote,
  'fonds-bewertungsstufen': fondsBewertungsstufen,
  'crashes-ansteckung': crashesAnsteckung,
  'notenbank-messgroessen': notenbankMessgroessen,
  'tagesgeld-parkplaetze': tagesgeldParkplaetze,
  'waehrung-paritaeten': waehrungParitaeten,
  'kosten-ebenen': kostenEbenen,
  'krypto-bewertung': kryptoBewertung,
  'markt-orderbuch': marktOrderbuch,
  'psychologie-verhaltensluecke': psychologieVerhaltensluecke,
  'budget-hebel': budgetHebel,
  'portfolio-drift': portfolioDrift,
  'kosten-wahre-quote': kostenWahreQuote,
  'depot-orderkosten': depotOrderkosten,
  'budget-sparquote-jahre': budgetSparquoteJahre,
  'risiko-korrelation': risikoKorrelation,
  'option-volatilitaet': optionVolatilitaet,
  'etf-index-fassungen': etfIndexFassungen,
  'tagesgeld-aktionszins': tagesgeldAktionszins,
  'einlagensicherung-kaskade': einlagensicherungKaskade,
  'boerse-handelszeiten': boerseHandelszeiten,
  'derivat-margin': derivatMargin,
  'sparplan-wartezeit': sparplanWartezeit,
  'rente-freibetrag': renteFreibetrag,
  'waehrung-absicherung': waehrungAbsicherung,
  'inflation-basiseffekt': inflationBasiseffekt,
  'verkauf-gruende': verkaufGruende,
  'krypto-zugangswege': kryptoZugangswege,
  'aktie-barwert': aktieBarwert,
  'kredit-tilgen-oder-anlegen': kreditTilgenOderAnlegen,
  'staatsschuld-dynamik': staatsschuldDynamik,
  'sparplan-dynamisierung': sparplanDynamisierung,
  'msci-world-laender': msciWorldLaender,
  'risiko-erholung': risikoErholung,
  'bitcoin-angebot': bitcoinAngebot,
  'budget-haushalt': budgetHaushalt,
  'sparplan-durchschnittspreis': sparplanDurchschnittspreis,
  'einlagensicherung-grenze': einlagensicherungGrenzeText,
  'boerse-vom-klick-zur-buchung': boerseVomKlickZurBuchung,
  'derivat-hebel': derivatHebel,
  'inflation-kaufkraft': inflationKaufkraft,
  'option-zeitwertverfall': optionZeitwertverfall,
  'immobilie-nettorendite': immobilieNettorendite,
  'option-auszahlung': optionAuszahlung,
  'rente-luecke': renteLuecke,
  'kosten-endkapital': kostenEndkapital,
  'kredit-zins-und-tilgung': kreditZinsUndTilgung,
  'einsteiger-reihenfolge': einsteigerReihenfolge,
  'tagesgeld-realzins': tagesgeldRealzins,
  'waehrung-ergebnis': waehrungErgebnis,
  'sparerpauschbetrag-grenze': sparerpauschbetragGrenze,
  'crashes-erholung': crashesErholung,
  'staatsanleihe-laufzeiten': staatsanleiheLaufzeiten,
  'portfolio-quote-rueckgang': portfolioQuoteRueckgang,
  'timing-beste-wochen': timingBesteWochen,
}

/** Die Beschreibung einer Grafik, sofern sie gerechnet wird. */
export function grafikBeschreibung(id: string): string | undefined {
  return RECHNER[id]?.()
}

/** Alle gerechneten Beschreibungen – für Vergleiche und Prüfungen. */
export function alleGrafikBeschreibungen(): Record<string, string> {
  return Object.fromEntries(Object.entries(RECHNER).map(([id, rechne]) => [id, rechne()]))
}

/**
 * Alle Grafiken so, wie die Vorlesefassung sie braucht.
 *
 * ## Warum es diese Funktion gibt und nicht `figureMeta` genügt
 *
 * `vorleseAbschnitte()` bekam bisher `figureMeta` und fiel bei jeder Grafik
 * ohne `description` auf die Bildunterschrift zurück – bei 53 von 135. Dieselbe
 * Grafik hatte damit für einen Screenreader eine volle Beschreibung und für die
 * Aufnahme eine Zeile, und beides sah für sich in Ordnung aus.
 *
 * Diese Funktion führt beide Quellen zusammen. Wer eine Vorlesefassung baut,
 * nimmt sie statt `figureMeta` – `app/lernen/[thema]/[stufe]/page.tsx`,
 * `app/akademie/[bereich]/[lektion]/page.tsx` und
 * `scripts/lese-texte-schreiben.ts` tun das.
 */
export function vorlesegrafiken(): Record<
  string,
  { title: string; caption: string; description?: string }
> {
  return Object.fromEntries(
    Object.entries(figureMeta).map(([id, meta]) => [
      id,
      {
        title: meta.title,
        caption: meta.caption,
        description: meta.description ?? grafikBeschreibung(id),
      },
    ])
  )
}
