/**
 * Der Wächter über die Irrtümer-Seite.
 *
 * ## Wogegen er schützt
 *
 * Die Seite widerlegt Sätze mit Rechnungen. Eine falsche Zahl auf ihr wäre
 * deshalb nicht bloß ein Fehler, sondern die Pointe an der falschen Stelle –
 * ein Text über irreführende Zahlen, der selbst eine enthält.
 *
 * Genau das passiert leicht: Jemand schreibt in der Prosa „rund ein Fünftel"
 * und lässt die Rechnung daneben stehen, oder er ändert eine Annahme in der
 * Probe und nicht die Ergebniszeile. Beides sieht im Build gut aus.
 *
 * ## Was hier geprüft wird
 *
 * 1. **Jede Rechnung wird nachgerechnet** – mit denselben Funktionen, mit
 *    denen die Rechner dieser Website rechnen. Das Ergebnis muss die
 *    Ergebniszeile treffen, auf die Genauigkeit ihrer Einheit.
 * 2. **Die Form stimmt.** Genau eine Ergebniszeile je Rechnung, und die Probe
 *    bekommt so viele Eingaben, wie sie braucht. `rechneNach()` gibt bei
 *    Formfehlern `null` zurück – ohne diese Prüfung wäre `null` ein stiller
 *    Freifahrtschein.
 * 3. **Kein stiller Ausweg.** `probe: { art: 'keine' }` ist erlaubt, aber nur
 *    mit einer Begründung, die etwas sagt. Ein leeres oder knappes `warum`
 *    wäre die Hintertür, durch die jede unbelegte Zahl spaziert.
 * 4. **Die Gegenprobe.** Am Ende wird eine absichtlich falsche Rechnung
 *    vorgelegt. Beanstandet der Wächter sie nicht, ist er keiner – und eine
 *    Absicherung, die nie anschlägt, sieht aus wie Ruhe.
 * 5. **Die Pflichtstücke jedes Eintrags:** Satz, richtig, falsch, Beleg. Fehlt
 *    das „was daran richtig ist", ist der Eintrag Spott, und genau den soll
 *    die Seite nicht enthalten.
 */

import { IRRTUEMER } from '@/data/irrtuemer'
import { indexZusammensetzung } from '@/data/index-zusammensetzung'
import {
  GENAUIGKEIT,
  GRUPPEN,
  eingabezeilen,
  ergebniszeile,
  nachGruppe,
  rechneNach,
  type Rechnung,
} from '@/lib/irrtuemer'

let failed = 0

function pruefen(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

/* ------------------------------------------------------- Die Pflichtstücke */

pruefen(
  'Es gibt mindestens dreißig Irrtümer',
  IRRTUEMER.length >= 30,
  `${IRRTUEMER.length} – die Seite ist als Sammlung angelegt, nicht als Auswahl.`
)

const slugs = IRRTUEMER.map((irrtum) => irrtum.slug)
pruefen(
  'Jeder Slug kommt einmal vor',
  new Set(slugs).size === slugs.length,
  'Doppelte Slugs ergeben zwei Anker mit derselben Adresse – der zweite ist unerreichbar.'
)

for (const irrtum of IRRTUEMER) {
  const vollstaendig =
    irrtum.satz.trim().length > 20 &&
    irrtum.richtig.trim().length > 40 &&
    irrtum.falsch.trim().length > 40 &&
    irrtum.beleg.text.trim().length > 20

  pruefen(
    `„${irrtum.slug}“ hat Satz, Richtiges, Falsches und Beleg`,
    vollstaendig,
    'Ohne das „was daran richtig ist“ wird aus der Richtigstellung Spott – und\n' +
      '     fast jeder dieser Sätze ist eine verkürzte Wahrheit, keine Dummheit.'
  )
}

const gruppenIds = GRUPPEN.map((gruppe) => gruppe.id)
for (const irrtum of IRRTUEMER) {
  if (!gruppenIds.includes(irrtum.gruppe)) {
    pruefen(`„${irrtum.slug}“ liegt in einer bekannten Gruppe`, false, irrtum.gruppe)
  }
}
pruefen(
  'Jede Gruppe ist besetzt',
  GRUPPEN.every((gruppe) => nachGruppe(IRRTUEMER, gruppe.id).length > 0),
  GRUPPEN.map((g) => `${g.id}:${nachGruppe(IRRTUEMER, g.id).length}`).join(', ') +
    ' – eine leere Überschrift wäre eine Rubrik ohne Inhalt.'
)

/* --------------------------------------------------------- Die Rechnungen */

console.log('')

/** Prüft eine Rechnung so, wie es der Wächter auf jedem Eintrag tut. */
function rechnungPruefen(kennung: string, rechnung: Rechnung): void {
  if (rechnung.probe.art === 'keine') {
    /*
      Der Ausweg braucht einen Grund, und der Grund muss ein Satz sein.

      Ohne diese Schranke wäre `keine` die Hintertür: Man schreibt eine Zahl
      in die Prosa, setzt die Probe auf `keine` und hat einen grünen Lauf.
      Die Länge ist kein Qualitätsmaß, aber sie schließt „noch offen“ aus.
    */
    pruefen(
      `„${kennung}“ begründet, warum hier keine Zahl steht`,
      rechnung.probe.warum.trim().length > 80,
      `${rechnung.probe.warum.trim().length} Zeichen – hier gehört hin, weshalb eine Zahl\n` +
        '     an dieser Stelle falsch wäre, nicht dass noch keine da ist.'
    )
    pruefen(
      `„${kennung}“ führt dann auch keine Zeilen`,
      rechnung.zeilen.length === 0,
      'Zeilen ohne Probe sind Zahlen, die niemand nachrechnet – genau das, was\n' +
        '     diese Datei verhindern soll.'
    )
    return
  }

  const ergebnis = ergebniszeile(rechnung)
  const ergebniszeilen = rechnung.zeilen.filter((zeile) => zeile.ergebnis)

  if (ergebniszeilen.length !== 1 || !ergebnis) {
    pruefen(
      `„${kennung}“ hat genau eine Ergebniszeile`,
      false,
      `${ergebniszeilen.length} – ohne genau eine weiß der Wächter nicht, was er prüfen soll.`
    )
    return
  }

  const gerechnet = rechneNach(rechnung)
  if (gerechnet === null) {
    pruefen(
      `„${kennung}“ lässt sich nachrechnen`,
      false,
      `Die Probe „${rechnung.probe.art}“ bekommt ${eingabezeilen(rechnung).length} Eingaben und\n` +
        '     kommt damit nicht zurecht. `null` ist hier ein Formfehler, kein Freibrief.'
    )
    return
  }

  const schranke = GENAUIGKEIT[ergebnis.einheit]
  const abweichung = Math.abs(gerechnet - ergebnis.wert)

  pruefen(
    `„${kennung}“ rechnet sich nach`,
    abweichung <= schranke,
    `Auf der Seite steht ${ergebnis.wert}, nachgerechnet ergibt sich ${gerechnet.toFixed(4)}\n` +
      `     (erlaubt: ${schranke} ${ergebnis.einheit}). Probe: ${rechnung.probe.art}.`
  )
}

for (const irrtum of IRRTUEMER) {
  const rechnung = irrtum.beleg.rechnung
  if (!rechnung) {
    /*
      Ein Beleg aus Daten oder aus einem Gesetz braucht keine Rechnung – aber
      eine Fundstelle. Sonst ist er eine Behauptung mit Etikett.
    */
    pruefen(
      `„${irrtum.slug}“ nennt eine Quelle, wo es nicht rechnet`,
      irrtum.beleg.quelle !== undefined && irrtum.beleg.quelle.label.trim().length > 5,
      `Beleg der Art „${irrtum.beleg.art}“ ohne Fundstelle – das ist eine Behauptung\n` +
        '     mit Etikett.'
    )
    continue
  }
  rechnungPruefen(irrtum.slug, rechnung)
}

/* ------------------------------------------- Die Zahlen aus fremden Beständen */

console.log('')

/*
  Drei Einträge zitieren den Weltindex.

  Sie stehen dort als Text, weil sie in Sätzen vorkommen – und ein Satz mit
  einer eingebauten Zahl ist genau die Stelle, an der eine Aktualisierung
  vorbeiläuft. Wenn das nächste Factsheet 1.290 Werte meldet, ändert jemand
  `data/index-zusammensetzung.ts` und nicht diese Sätze.

  Deshalb wird hier gegen den Bestand geprüft und nicht gegen die Erinnerung.
*/
const weltindex = indexZusammensetzung['msci-world']
pruefen(
  'Der Weltindex steht im Bestand',
  weltindex?.kennzahlen !== undefined && (weltindex.groesste?.length ?? 0) >= 10,
  'Ohne ihn prüfen die folgenden Zeilen nichts – und das wäre der Fall, den man\n' +
    '     nicht merkt: eine Reihe grüner Haken über einer leeren Quelle.'
)

function textPruefen(slug: string, erwartet: string): void {
  const irrtum = IRRTUEMER.find((eintrag) => eintrag.slug === slug)
  const text = `${irrtum?.beleg.text ?? ''} ${irrtum?.falsch ?? ''} ${irrtum?.richtig ?? ''}`
  pruefen(
    `„${slug}“ nennt „${erwartet}“ so, wie es im Bestand steht`,
    text.includes(erwartet),
    'Die Zahl im Satz weicht von `data/index-zusammensetzung.ts` ab – der Satz ist\n' +
      '     stehen geblieben, als der Bestand nachgezogen wurde.'
  )
}

const kennzahlen = weltindex?.kennzahlen
if (kennzahlen && weltindex.groesste) {
  const zehnGroesste = weltindex.groesste
    .slice(0, 10)
    .reduce((summe, wert) => summe + wert.anteil, 0)

  textPruefen('dreissig-aktien', zehnGroesste.toFixed(2).replace('.', ','))
  textPruefen('dreissig-aktien', kennzahlen.anzahlWerte.toLocaleString('de-DE'))
  textPruefen('msci-world-weltweit', `${kennzahlen.laender} Länder`)
  textPruefen('msci-world-weltweit', `${kennzahlen.abdeckungProzent} Prozent`)
  textPruefen('niedriges-kgv-billig', (kennzahlen.kgv ?? 0).toFixed(2).replace('.', ','))
  textPruefen(
    'niedriges-kgv-billig',
    (kennzahlen.kgvErwartet ?? 0).toFixed(2).replace('.', ',')
  )

  /*
    Beim Mittelwert-gegen-Median-Eintrag stehen die beiden Zahlen als
    Rechenzeilen. Dass ihr Verhältnis stimmt, prüft die Rechnung oben – dass es
    die Zahlen des Bestands sind, prüft niemand außer hier.
  */
  const durchschnitt = IRRTUEMER.find(
    (eintrag) => eintrag.slug === 'durchschnitt-typisch'
  )
  const zeilen = durchschnitt?.beleg.rechnung?.zeilen ?? []
  pruefen(
    'Mittelwert und Median stammen aus dem Bestand',
    zeilen[0]?.wert === kennzahlen.mittelMioUsd &&
      zeilen[1]?.wert === kennzahlen.medianMioUsd,
    `${zeilen[0]?.wert} / ${zeilen[1]?.wert} gegen ${kennzahlen.mittelMioUsd} / ${kennzahlen.medianMioUsd}\n` +
      '     – zwei Wahrheiten über dieselbe Zahl sind eine zu viel.'
  )
}

/* ----------------------------------------------------------- Die Gegenprobe */

console.log('')

/*
  Eine Absicherung, die nie anschlägt, sieht aus wie Ruhe.

  Deshalb bekommt der Wächter hier etwas vorgelegt, das er beanstanden **muss**:
  dieselbe Rechnung wie beim Verlustausgleich, nur mit der Zahl, die der Irrtum
  behauptet. Ginge sie durch, wäre jede Prüfung oben wertlos.
*/
const falscheRechnung: Rechnung = {
  titel: 'Absichtlich falsch',
  zeilen: [
    { was: 'Verlust', wert: 50, einheit: 'prozent' },
    { was: 'Nötiger Gewinn', wert: 50, einheit: 'prozent', ergebnis: true },
  ],
  probe: { art: 'erholung' },
}

const gegenprobe = rechneNach(falscheRechnung)
pruefen(
  'Die Gegenprobe wird beanstandet',
  gegenprobe !== null && Math.abs(gegenprobe - 50) > GENAUIGKEIT.prozent,
  `Nachgerechnet: ${gegenprobe} – wenn 50 hier durchgeht, prüft oben niemand etwas.`
)

/*
  Und die Umkehrung: Der Wächter darf nicht alles beanstanden. Eine Rechnung,
  die stimmt, muss durchgehen – sonst wäre die Schranke null und jede Zahl
  falsch.
*/
const richtigeRechnung: Rechnung = {
  ...falscheRechnung,
  zeilen: [
    { was: 'Verlust', wert: 50, einheit: 'prozent' },
    { was: 'Nötiger Gewinn', wert: 100, einheit: 'prozent', ergebnis: true },
  ],
}
const richtig = rechneNach(richtigeRechnung)
pruefen(
  'Und die richtige Zahl geht durch',
  richtig !== null && Math.abs(richtig - 100) <= GENAUIGKEIT.prozent,
  `${richtig}`
)

/*
  Ein Formfehler muss als Formfehler auffallen und nicht als bestandene Probe.
*/
const formfehler = rechneNach({
  titel: 'Zu wenige Eingaben',
  zeilen: [{ was: 'Ergebnis', wert: 1, einheit: 'prozent', ergebnis: true }],
  probe: { art: 'zinseszins' },
})
pruefen(
  'Eine Probe ohne genügend Eingaben ergibt null',
  formfehler === null,
  `${formfehler} – und der Test oben macht daraus einen roten Lauf, keinen grünen.`
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
