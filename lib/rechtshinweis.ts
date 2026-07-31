/**
 * Die Rechtshinweise dieser Website – an einer Stelle.
 *
 * ## Warum zentral
 *
 * Weil sie es vorher nicht waren. Derselbe Absatz stand im Impressum und in
 * der Fußzeile, und im Impressum stand daneben der Satz: „Die Fassungen müssen
 * deshalb zusammen gepflegt werden.“ Das ist eine Absichtserklärung, und
 * Absichtserklärungen halten genau so lange, bis jemand es eilig hat. Bei
 * einem Text, der aus rechtlichen Gründen dasteht, ist die schwächere Fassung
 * die gefährliche – und im Zweifel wird die gelesen.
 *
 * Mit dem Herunterladen der Rechnerergebnisse kam eine dritte Stelle dazu.
 * Spätestens hier musste es eine Quelle werden.
 *
 * ## Warum das auf ein Dokument gehört, das jemand ausdruckt
 *
 * Ein PDF verlässt die Website. Es wird weitergegeben, abgeheftet, in einem
 * Jahr wieder hervorgeholt und dann ohne den Kasten in der Fußzeile gelesen,
 * der auf der Website danebenstand. Was für die Einordnung nötig ist, muss
 * deshalb **im Dokument** stehen: dass es sich um eine Modellrechnung handelt,
 * worauf sie beruht, wann sie entstand und was sie ausdrücklich nicht ist.
 *
 * ## Was hier bewusst nicht steht
 *
 * Eine Rechtsberatung darüber, was ein Anbieter schuldet. Die Formulierungen
 * folgen dem, was die Website ohnehin an jeder Stelle sagt, und sind bewusst
 * einfach gehalten. Wer eine belastbare Prüfung braucht, holt sie sich – ein
 * Kommentar in einer TypeScript-Datei ist keine.
 *
 * Ohne Laufzeitimporte, damit `tests/` das Modul direkt laden kann.
 */

/** Die Überschrift, unter der die Hinweise stehen. */
export const RECHTSHINWEIS_TITEL =
  'Keine Anlage- oder Steuerberatung – nur Wissensvermittlung'

/**
 * Der Kernabsatz, wie er auf jeder Seite steht.
 *
 * Wortgleich in Fußzeile, Impressum und in jedem erzeugten Dokument.
 */
export const RECHTSHINWEIS_KERN =
  'Alle Inhalte dieser Website dienen der allgemeinen Information und Bildung. ' +
  'Sie stellen keine Anlage-, Rechts- oder Steuerberatung dar und berücksichtigen ' +
  'weder die persönliche Situation noch die Anlageziele einzelner Leserinnen und ' +
  'Leser. Jede Kapitalanlage ist mit Risiken verbunden, bis zum vollständigen ' +
  'Verlust des eingesetzten Kapitals.'

/**
 * Die Punkte, die auf ein heruntergeladenes Ergebnis gehören.
 *
 * Jeder einzelne beantwortet eine Frage, die sich jemandem stellt, der das
 * Blatt in einem Jahr wiederfindet: Woher kommen die Zahlen? Was ist das
 * überhaupt? Worauf kann ich mich stützen – und worauf nicht?
 */
export const DOKUMENT_HINWEISE: readonly string[] = [
  /*
    Zuerst das, was am häufigsten missverstanden wird. Ein ausgedrucktes Blatt
    mit Eurobeträgen und einer Jahreszahl sieht aus wie eine Auskunft über die
    Zukunft. Es ist eine Fortschreibung der eingegebenen Annahmen, nicht mehr.
  */
  'Modellrechnung, keine Prognose. Das Ergebnis schreibt die oben genannten Annahmen ' +
    'fort und ist genau so verlässlich wie diese. Eine andere Annahme ergibt ein ' +
    'anderes Ergebnis.',
  'Keine Anlageberatung und keine Anlageempfehlung. Es findet keine Prüfung der ' +
    'persönlichen Verhältnisse, der Anlageziele oder der Risikotragfähigkeit statt.',
  'Keine geschäftsmäßige Hilfeleistung in Steuersachen im Sinne des ' +
    'Steuerberatungsgesetzes. Steuerliche Angaben sind allgemeine Erläuterungen; ' +
    'maßgeblich ist der Einzelfall und die Auskunft einer dazu befugten Person.',
  'Das Dokument ist keine Bescheinigung und kein Nachweis. Es eignet sich nicht als ' +
    'Beleg gegenüber Finanzamt, Bank oder Versicherung.',
  'Kosten, Steuern und Inflation sind nur enthalten, soweit sie oben als Annahme ' +
    'aufgeführt sind. Was dort nicht steht, ist nicht gerechnet.',
  'Vergangene Wertentwicklungen sind kein verlässlicher Hinweis auf künftige.',
  'Erstellt im Browser aus den eingegebenen Werten. Es wurden keine Daten übertragen ' +
    'und keine gespeichert; die Angaben sind nicht geprüft worden.',
  'Für Richtigkeit und Vollständigkeit wird trotz sorgfältiger Erstellung keine ' +
    'Gewähr übernommen.',
] as const

/**
 * Die Zeile ganz unten auf jeder Seite eines Dokuments.
 *
 * Kurz genug, um in eine Fußzeile zu passen, und vollständig genug, dass ein
 * gefundenes Blatt sich zuordnen lässt: Wer es erstellt hat, wo das Original
 * steht, und der Kernsatz in fünf Wörtern.
 */
export function dokumentFusszeile(adresse: string): string {
  return `${adresse} · Modellrechnung, keine Anlage- oder Steuerberatung · im Browser erstellt`
}

/**
 * Der Untertitel eines Dokuments: wann es entstand.
 *
 * Ein Datum ist auf einem Ausdruck keine Zierde. Ohne es lässt sich nicht
 * sagen, ob die verwendeten Kurse und Zinssätze von gestern oder von vorletztem
 * Jahr sind – und genau danach fragt jeder, der das Blatt wiederfindet.
 */
export function erstelltAm(datum: Date): string {
  const tag = String(datum.getDate()).padStart(2, '0')
  const monat = String(datum.getMonth() + 1).padStart(2, '0')
  const stunde = String(datum.getHours()).padStart(2, '0')
  const minute = String(datum.getMinutes()).padStart(2, '0')
  return `Erstellt am ${tag}.${monat}.${datum.getFullYear()} um ${stunde}:${minute} Uhr`
}
