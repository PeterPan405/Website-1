/**
 * Prüfungen für die Sprechfassung des Podcasts.
 *
 * Die Regeln stammen aus der Arbeitsanweisung des von Hand geführten
 * Podcasts; jede Prüfung hier entspricht einem Punkt ihrer Checkliste.
 * Die Zahlwörter sind der heikelste Teil – ein falsches Zahlwort klingt
 * in der Vertonung plausibel und ist trotzdem eine falsche Zahl.
 */

import { readdirSync, readFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

import type { DailyEdition } from '../data/editions/types.ts'
import {
  baueFolge,
  folgennummer,
  ordnungszahl,
  sprechbar,
  verdaechtigeAnglizismen,
  WORTZIEL_MAX,
  WORTZIEL_MIN,
  zahlwort,
} from '../lib/sprechfassung.ts'

let gescheitert = 0
function pruefe(name: string, ist: unknown, soll: unknown) {
  const ok = JSON.stringify(ist) === JSON.stringify(soll)
  if (!ok) gescheitert++
  console.log(
    `${ok ? 'OK  ' : 'FEHL'} ${name}${ok ? '' : `\n     erwartet ${JSON.stringify(soll)}\n     erhalten ${JSON.stringify(ist)}`}`
  )
}

/* ------------------------------------------------------------- Zahlwörter */

pruefe('null', zahlwort(0), 'null')
pruefe('eins allein', zahlwort(1), 'eins')
pruefe('einundzwanzig', zahlwort(21), 'einundzwanzig')
pruefe('siebzehn', zahlwort(17), 'siebzehn')
pruefe('hundert', zahlwort(100), 'einhundert')
pruefe('500', zahlwort(500), 'fünfhundert')
pruefe(
  '26.068 – das Beispiel aus der Vorlage',
  zahlwort(26_068),
  'sechsundzwanzigtausendachtundsechzig'
)
pruefe('2026 als Jahreszahl', zahlwort(2026), 'zweitausendsechsundzwanzig')
pruefe(
  'eine Million zweihunderttausend',
  zahlwort(1_200_000),
  'eine Million zweihunderttausend'
)

pruefe('der 7. ist der siebte', ordnungszahl(7), 'siebte')
pruefe('der 1. ist der erste', ordnungszahl(1), 'erste')
pruefe('der 20. ist der zwanzigste', ordnungszahl(20), 'zwanzigste')
pruefe('der 31. ist der einunddreißigste', ordnungszahl(31), 'einunddreißigste')

/* --------------------------------------------------------- Sprechbarkeit */

pruefe(
  'Prozent mit Nachkommastellen, Ziffer für Ziffer',
  sprechbar('2,8 %'),
  'zwei Komma acht Prozent'
)
pruefe(
  'Punktestand aus der Vorlage',
  sprechbar('26.068,45 Punkte'),
  'sechsundzwanzigtausendachtundsechzig Komma vier fünf Punkte'
)
pruefe('S&P 500', sprechbar('Der S&P 500 stieg.'), 'Der S und P fünfhundert stieg.')
/*
  Die eigene Adresse ist der eigene Name plus Endung, und beides wird
  englisch gesprochen. „iminvests punkt de" las die Stimme als ein einziges
  deutsches Wort – gemeldet vom Betreiber am 11. August 2026 beim Hören des
  Abschlusssatzes, der ihn jeden Morgen enthält.
*/
pruefe(
  'Webadresse – die Endung wird buchstabiert',
  sprechbar('auf iminvests.de'),
  'auf Ei Emm Inwests punkt Deh Eh'
)
pruefe(
  'Fremde Adressen genauso',
  sprechbar('Quelle: reuters.com'),
  'Quelle: reuters punkt Zeh Oh Emm'
)
/*
  Zwei Fallen der deutschen Rechtschreibung, beide am 11. August 2026 vom
  Betreiber gehört: „st" am Wortanfang ist /scht/, „W" am Wortanfang ist /v/.
  „Wohl Striet" für Wall Street traf beide auf einmal.
*/
pruefe(
  'Wall Street: kein „Vohl Schtriet" mehr',
  sprechbar('Die Wall Street gibt nach.'),
  'Die Uallstriet gibt nach.'
)
pruefe(
  'Euro Stoxx: kein „Euroschtox" mehr',
  sprechbar('Der Euro Stoxx 50 steigt.'),
  'Der Eurostocks fünfzig steigt.'
)
pruefe(
  'Der eigene Name wird englisch gesprochen',
  sprechbar('Das Marktupdate von IM Invests.'),
  'Das Markt-Appdejt von Ei Emm Inwests.'
)
/*
  Und die Umschrift darf kein deutsches „im" anfassen. Ein `\bIM\b` ohne
  Gross-/Kleinschreibung hätte genau das getan – deshalb steht die Probe hier
  und nicht nur die Regel dort.
*/
pruefe(
  'Das deutsche „im" bleibt unberührt',
  sprechbar('Der Kurs stieg im Handel am Vormittag.'),
  'Der Kurs stieg im Handel am Vormittag.'
)
/*
  Seit dem 11. August 2026 gilt die Regel nicht nur für Namen, sondern für
  **alle** englischen Wörter – Anordnung des Betreibers, nachdem er „Boom",
  „Rating" und „Cashflow" deutsch gelesen gehört hatte. Ein Börsentext besteht
  zur Hälfte aus Anglizismen.
*/
pruefe(
  'Anglizismen: zusammengesetzte zuerst',
  sprechbar('Der Cashflow und der Cash-Bestand.'),
  'Der Käschflau und der Käsch-Bestand.'
)
pruefe(
  'Anglizismen im Fließtext',
  sprechbar('Das Rating fällt auf Hold, der Outlook bleibt schwach.'),
  'Das Rejting fällt auf Hohld, der Autluck bleibt schwach.'
)
pruefe(
  'Der eigene Sendungsname ist auch ein Anglizismus',
  sprechbar('Das Marktupdate beginnt.'),
  'Das Markt-Appdejt beginnt.'
)
/*
  Die Gegenprobe ist hier die wichtigere Hälfte: Eine Umschrift, die deutsche
  Wörter anfasst, wäre schlimmer als gar keine.
*/
pruefe(
  'Deutsche Wörter mit englisch aussehenden Silben bleiben stehen',
  sprechbar('Die Chipindustrie meldet Wachstum, der Bootsbau auch.'),
  'Die Chipindustrie meldet Wachstum, der Bootsbau auch.'
)
pruefe(
  'Uhrzeit verbraucht ein folgendes „Uhr“',
  sprechbar('Um 01:22 Uhr lief die Meldung.'),
  'Um ein Uhr zweiundzwanzig lief die Meldung.'
)
pruefe('Datum vor der Zahlregel', sprechbar('der 7. August'), 'der siebte August')

/*
  Die Beugung der Ordnungszahl.

  Geschrieben steht überall „9. August“, und wer liest, ergänzt die Endung im
  Kopf. Eine Stimme tut das nicht: Bis zum 10. August 2026 sprach die Folge
  „am neunte August“. Gemeldet hat es der Betreiber, nicht eine Prüfung – die
  hier steht deshalb.
*/
pruefe('Dativ: am → neunten', sprechbar('am 9. August'), 'am neunten August')
pruefe('Dativ: vom → neunten', sprechbar('vom 9. August'), 'vom neunten August')
pruefe(
  'Dativ: seit dem → neunten',
  sprechbar('seit dem 9. August'),
  'seit dem neunten August'
)
pruefe('Dativ: bis zum → ersten', sprechbar('bis zum 1. August'), 'bis zum ersten August')
pruefe('Akkusativ: den → dritten', sprechbar('den 3. August'), 'den dritten August')
pruefe('Genitiv: des → achten', sprechbar('des 8. August'), 'des achten August')
pruefe('Nominativ: der → neunte', sprechbar('der 9. August'), 'der neunte August')
pruefe('ohne Artikel: neunter', sprechbar('Stand 9. August'), 'Stand neunter August')
pruefe(
  'zwei Tage vor einem Monat gehören zusammen',
  sprechbar('vom 28. und 29. Juli'),
  'vom achtundzwanzigsten und neunundzwanzigsten Juli'
)
pruefe('Quartal ist sächlich, Dativ', sprechbar('im 2. Quartal'), 'im zweiten Quartal')
pruefe(
  'Quartal ist sächlich, Nominativ',
  sprechbar('das 3. Quartal'),
  'das dritte Quartal'
)
pruefe('Ordnungszahl mit Endung', ordnungszahl(9, 'en'), 'neunten')
pruefe('Ordnungszahl ohne Artikel', ordnungszahl(9, 'er'), 'neunter')
pruefe(
  'Klammern werden zu Einschüben',
  sprechbar('bei 100 Punkten (+0,5 %)').includes('('),
  false
)

/* ----------------------------------------------------------- Die Folge */

pruefe('30.07. ist Folge 1', folgennummer('2026-07-30'), 1)
pruefe('06.08. ist Folge 6', folgennummer('2026-08-06'), 6)
pruefe('07.08. ist Folge 7', folgennummer('2026-08-07'), 7)
pruefe('10.08. (Montag) ist Folge 8', folgennummer('2026-08-10'), 8)

const dateien = readdirSync('data/editions').filter((n) =>
  /^\d{4}-\d{2}-\d{2}\.ts$/.test(n)
)
const juengste = dateien.sort().at(-1)!
const { edition } = (await import(pathToFileURL(`data/editions/${juengste}`).href)) as {
  edition: DailyEdition
}
const folge = baueFolge(edition)

/*
  Der KI-Hinweis steht **hinter** der Begrüßung – seit dem 20. August 2026.

  Vom 17. bis zum 20. August stand er davor, und diese Prüfung verlangte das
  auch so. Der Betreiber hat es beanstandet: „Dann schreckt das nicht ganz so
  ab." Ein Podcast hat drei Sekunden, um jemanden zu halten; Kleingedrucktes
  in diesen drei Sekunden kostet genau die Hörer, die der Hinweis erreichen
  soll.

  Geprüft wird deshalb weiter die **Reihenfolge** und nicht bloß, dass beides
  vorkommt – nur andersherum als vorher. Und zusätzlich, dass der Hinweis
  früh kommt: Ans Ende gehört er ebenso wenig, weil sich bis dahin jeder eine
  Meinung gebildet hat.
*/
pruefe(
  'Sprechtext beginnt mit der Begrüßung',
  folge.sprechtext.startsWith(
    'Guten Morgen und herzlich willkommen zum Markt-Appdejt von Ei Emm Inwests.'
  ),
  true
)

const hinweisAb = folge.sprechtext.indexOf('Bevor es losgeht, ein Hinweis:')
pruefe('Der KI-Hinweis steht im Sprechtext', hinweisAb >= 0, true)

/*
  „Vor der ersten Meldung" wird an der Begrüßung gemessen und nicht an einer
  Zeichenzahl: Die Begrüßung endet mit dem Satz über den Tag, und der ist mal
  hundertzehn und mal hundertsechzig Zeichen lang. Eine feste Grenze wäre an
  manchen Tagen erfüllt und an anderen nicht, ohne dass sich etwas geändert
  hätte.
*/
const ersterAbsatz = folge.sprechtext.split('\n\n')[1] ?? ''
pruefe(
  'Der Hinweis ist der zweite Absatz, also vor der ersten Meldung',
  ersterAbsatz.startsWith('Bevor es losgeht, ein Hinweis:'),
  true
)
pruefe(
  'Sprechtext endet auf „viel Erfolg.“',
  folge.sprechtext.endsWith('viel Erfolg.'),
  true
)
/*
  Die Marke heißt **IM Invests**, nicht „IM Investments".

  Bis zum 9. August 2026 stand die längere Form an vier Stellen, darunter in
  Begrüßung und Abschluss jeder Folge – sie wurde also jeden Morgen zweimal
  laut ausgesprochen. Aufgefallen ist es dem Betreiber beim Hören einer
  Probe, nicht beim Lesen des Codes: Der falsche Name sieht plausibel aus,
  weil er wie eine ausgeschriebene Fassung des richtigen wirkt.

  Genau deshalb steht hier eine Prüfung und nicht nur eine Korrektur. Ein
  Name, der sich von selbst „vervollständigt", kommt zurück.
*/
pruefe(
  'Sprechtext nennt nirgends „IM Investments"',
  /IM Investments/.test(folge.sprechtext),
  false
)
pruefe('Fazit-Absatz vorhanden', folge.sprechtext.includes('Bleibt das Fazit.'), true)
pruefe('keine Ziffern im Sprechtext', /\d/.test(folge.sprechtext), false)
pruefe('keine Klammern im Sprechtext', /[()]/.test(folge.sprechtext), false)
pruefe('kein Prozentzeichen im Sprechtext', folge.sprechtext.includes('%'), false)
pruefe('Titel ohne Datum', /\d{1,2}\.\s*(August|Juli)/.test(folge.titel), false)
pruefe('Titel ohne „Marktupdate“', folge.titel.includes('Marktupdate'), false)
pruefe('Titel ohne Gedankenstrich', /[–—]/.test(folge.titel), false)
pruefe('mindestens drei Kapitel', folge.kapitel.length >= 3, true)
pruefe('erstes Kapitel ist die Begrüßung', folge.kapitel[0], 'Begrüßung und Überblick')
pruefe(
  'Beschreibung trägt den KI-Hinweis',
  folge.beschreibung.includes('automatisiert mit KI-Werkzeugen'),
  true
)

/*
  Der Hinweis muss **gesprochen** werden, nicht nur dastehen.

  Bis zum 17. August 2026 stand er ausschließlich in der Beschreibung. Wer
  eine Folge in einer Podcast-App hört – im Auto, beim Laufen –, sieht die
  Beschreibung nie. Genau dort entsteht der Eindruck, ein Mensch spreche, und
  genau dort war der Hinweis nicht.

  Geprüft wird beides: dass er im Sprechtext steht und dass er **früh** steht.
  Ein Hinweis auf eine erzeugte Stimme nach fünf Minuten Zuhören kommt zu
  spät; bis dahin hat sich jeder eine Meinung gebildet.

  „Früh" heißt seit dem 20. August: der zweite Absatz, hinter der Begrüßung
  (siehe oben). Vorher stand hier eine Grenze von 200 Zeichen – die zählte,
  solange der Hinweis das Erste war, und wurde mit dem Umzug zu einer Zahl
  ohne Bedeutung: Die Begrüßung ist je nach Tagesausgabe verschieden lang.
*/
pruefe(
  'Sprechtext trägt den KI-Hinweis',
  folge.sprechtext.includes('KI-Werkzeugen'),
  true
)
pruefe(
  'Sprechtext nennt die erzeugte Stimme',
  /Stimme.{0,40}künstlich erzeugt/.test(folge.sprechtext),
  true
)
pruefe(
  'Der Hinweis steht vor jeder Meldung',
  folge.sprechtext.indexOf('KI-Werkzeugen') < folge.sprechtext.indexOf('\n\n', hinweisAb),
  true
)

/*
  Und die Gegenprobe, die den eigentlichen Fehler festhält.

  Der Hinweis behauptete bis zum 17. August 2026, jede Folge werde „vor der
  Veröffentlichung von einem Menschen inhaltlich geprüft". `podcast-erzeugen.yml`
  schreibt, vertont und veröffentlicht ohne Halt dazwischen – die Zusage traf
  nicht zu, und ein Kommentar im Quelltext hatte das sogar benannt.

  Wer den Halbsatz zurückholt, baut zuerst den Halt in die Kette. Diese
  Prüfung sorgt dafür, dass die Reihenfolge stimmt.
*/
pruefe(
  'Kein Versprechen einer menschlichen Prüfung vor Veröffentlichung',
  /vor der Veröffentlichung von einem Menschen/.test(folge.beschreibung) ||
    /vor der Veröffentlichung von einem Menschen/.test(folge.sprechtext),
  false
)
pruefe(
  'Beschreibung trägt den Haftungshinweis',
  folge.beschreibung.includes('keine Anlageberatung'),
  true
)
pruefe(
  'Beschreibung trägt den Kapitel-Platzhalter',
  folge.beschreibung.includes('[KAPITEL]'),
  true
)
/*
  Die Grenze kommt aus `lib/sprechfassung.ts`, nicht als Zahl hierher.

  Hier stand `<= 740`. Wer das Zielfenster verschiebt, ändert die
  Kürzungsschleife dort – und diese Prüfung schlüge weiter an 740 an, also an
  einer Grenze, die niemand mehr meint. Dieselbe Bauart hat am 16. August 2026
  eine Tagesausgabe gekostet.
*/
pruefe(
  `Wortzahl unter der Obergrenze (${WORTZIEL_MAX})`,
  folge.wortzahl <= WORTZIEL_MAX,
  true
)

/*
  Und die Untergrenze wird **gemeldet, nicht erzwungen**.

  Gekürzt wird durch Weglassen, verlängert würde durch Erfinden. Eine Ausgabe
  mit wenig Stoff ergibt eine kurze Folge, und das ist gewollt. Die Prüfung
  sagt es trotzdem – sonst fällt niemandem auf, wenn es zur Regel wird.
*/
if (folge.wortzahl < WORTZIEL_MIN) {
  console.log(
    `HINW Wortzahl ${folge.wortzahl} unter dem Zielfenster (${WORTZIEL_MIN}). ` +
      'Kein Fehler – die Ausgabe gab nicht mehr her.'
  )
}

/*
  Die harte Untergrenze, an der etwas kaputt wäre.

  Unter 300 Wörtern ist es keine Folge mehr, sondern eine Meldung – dann hat
  die Kürzungsschleife zu viel weggenommen oder die Ausgabe ist leer.
*/
pruefe('Wortzahl gemeldet und plausibel', folge.wortzahl > 300, true)

/* ------------------------------------------------------------------
   Die Wortgrenzen stehen an einer Stelle – geprüft, nicht gehofft.

   Bis zum 17. August 2026 standen sie an dreien: als Konstanten in
   `lib/sprechfassung.ts`, als Zahlen im Erzeugungsskript und als Zahl in
   dieser Datei. `WORTZIEL_MIN` war dabei gar nicht benutzt – der Linter hat
   es als unbenutzte Variable gemeldet, und das war der einzige Hinweis.

   Wer das Fenster verschiebt, ändert die Kürzungsschleife und lässt Skript und
   Prüfung auf den alten Zahlen stehen. Dieselbe Bauart hat am 16. August eine
   Tagesausgabe gekostet: zwei Grenzen für dieselbe Zeichenkette, 165 gegen 160.
------------------------------------------------------------------- */

{
  const skript = readFileSync('scripts/podcast-folge-erzeugen.ts', 'utf8')
  const ohneKommentare = skript.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')

  pruefe(
    'Das Erzeugungsskript nennt die Grenzen nicht als eigene Zahlen',
    /\b(710|740)\b/.test(ohneKommentare),
    false
  )
  pruefe(
    'Es bezieht sie aus lib/sprechfassung.ts',
    ohneKommentare.includes('WORTZIEL_MIN') && ohneKommentare.includes('WORTZIEL_MAX'),
    true
  )
  pruefe('Das Fenster ist nicht leer', WORTZIEL_MIN < WORTZIEL_MAX, true)
}

console.log(
  gescheitert === 0
    ? '\nAlle Pruefungen bestanden'
    : `\n${gescheitert} Pruefung(en) fehlgeschlagen`
)
process.exit(gescheitert === 0 ? 0 : 1)

/*
  Der Melder für unbehandelte Anglizismen.

  Er ist ausdrücklich ein Hinweis und kein Urteil – deshalb prüft der Test
  beide Richtungen, und die zweite ist die wichtigere: Ein Melder, der jeden
  Tag harmlose deutsche Wörter anzeigt, wird nach einer Woche überlesen. Das
  ist dieselbe Rechnung wie beim roten Lauf, der zum Rauschen wird.
*/
pruefe(
  'Meldet, was englisch aussieht und keine Umschrift hat',
  verdaechtigeAnglizismen(
    'Das Onboarding beim Pitch; der Payment-Anbieter meldet Growth.'
  ),
  ['Growth', 'Onboarding', 'Payment', 'Pitch']
)
pruefe(
  'Schweigt bei deutschen Wörtern auf -ling',
  verdaechtigeAnglizismen('Im Frühling kaufte der Zwilling ein Haus, der Lehrling auch.'),
  []
)
pruefe(
  'Schweigt bei Wachstum, Reichtum und einem Mythos',
  verdaechtigeAnglizismen('Wachstum, Reichtum und ein Mythos.'),
  []
)
/*
  Und die Probe, auf die es wirklich ankommt: Was die Tabelle bereits
  umschreibt, darf der Melder nicht mehr anzeigen – sonst meldet er jeden Tag
  dieselben Wörter und wird genau dadurch wertlos.
*/
pruefe(
  'Schweigt bei allem, was die Tabelle schon umschreibt',
  verdaechtigeAnglizismen(
    sprechbar('Das Rating, der Cashflow, das Marktupdate, der Outlook.')
  ),
  []
)
