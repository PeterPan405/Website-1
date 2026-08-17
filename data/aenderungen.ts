/**
 * Was sich an dieser Website geändert hat – in der Sprache des Lesers.
 *
 * ## Warum das eine gepflegte Datei ist und kein Git-Auszug
 *
 * Weil ein Commit-Titel für Entwickler geschrieben ist. „Wortgrenzen
 * gekoppelt, elf Warnungen aufgelöst" beantwortet keine Frage, die ein
 * Besucher hat. Was ihn angeht, ist: *Was kann ich jetzt, was ich vorher
 * nicht konnte – und worauf muss ich achten?*
 *
 * Eine automatische Übersetzung von Commit-Titeln in Lesersprache gibt es
 * nicht. Sie erfände Bedeutung, wo im Titel keine steht.
 *
 * **Damit trotzdem nichts untergeht**, gibt es `npm run aenderungen`: Der Lauf
 * liest die Git-Historie seit dem jüngsten Eintrag hier und listet auf, was
 * noch keinen Eintrag hat. Er schlägt vor, er schreibt nicht.
 *
 * ## Warum es nicht beim Bauen aus Git entsteht
 *
 * Weil beim Bauen keine Historie da ist. `paket-bauen.yml` klont mit
 * `fetch-depth: 50` – eine Seite, die live aus `git log` läse, wäre nach
 * fünfzig Commits still abgeschnitten, und niemand sähe es. Bei rund zehn
 * Commits am Tag wären das fünf Tage Rückschau statt der ganzen.
 *
 * Genau die Sorte Fehler, die dieses Projekt an allen Ecken abzuschaffen
 * versucht: nicht kaputt, nur unvollständig, und ohne Meldung.
 *
 * ## Was hier hineingehört
 *
 * Was ein Besucher **merkt**: neue Seiten, geänderte Darstellung, korrigierte
 * Angaben. Nicht: Umbauten unter der Haube, Testabdeckung, Formatierung.
 *
 * Und ausdrücklich auch **Korrekturen an uns selbst**. Das ist die Fortsetzung
 * dessen, was `/news/korrekturen` für einzelne Artikel begonnen hat: Wer nur
 * die Verbesserungen aufzählt, schreibt Werbung.
 */

/** Was für ein Eintrag es ist – bestimmt die Beschriftung, nicht die Farbe. */
export type Aenderungsart = 'neu' | 'geaendert' | 'korrigiert'

export interface Aenderung {
  /** ISO-Datum des Tages, an dem es live ging. */
  datum: string
  art: Aenderungsart
  /** Eine Zeile, die ohne Vorwissen verständlich ist. */
  titel: string
  /** Was das für den Leser bedeutet – zwei bis drei Sätze. */
  text: string
  /** Wohin, falls es etwas zu sehen gibt. */
  ziel?: { text: string; href: string }
}

/**
 * Die Einträge, neueste zuerst.
 *
 * Die Reihenfolge steht hier und wird nicht sortiert: Zwei Änderungen am
 * selben Tag haben eine Rangfolge, die kein Zeitstempel kennt.
 */
export const AENDERUNGEN: Aenderung[] = [
  {
    datum: '2026-08-17',
    art: 'neu',
    titel: 'Die Website in Zahlen',
    text: 'Eine Seite, die sagt, wie viel hier eigentlich steht: Lernseiten, Kurse, Artikel, Quellen, Rechenwege. Keine dieser Zahlen ist eingetragen – jede wird beim Bauen aus demselben Bestand gezählt, aus dem die Seiten lesen, und kann deshalb nicht veralten.',
    ziel: { text: 'Zu den Zahlen', href: '/zahlen' },
  },
  {
    datum: '2026-08-17',
    art: 'korrigiert',
    titel: 'Der Podcast sagt jetzt selbst, dass er mit KI entsteht',
    text: 'Bisher stand der Hinweis nur in der Beschreibung – wer eine Folge in einer Podcast-App hört, sieht die nie. Jede Folge beginnt deshalb mit zwei Sätzen: dass sie automatisiert entsteht und dass die Stimme künstlich erzeugt ist.',
    ziel: { text: 'Zum Podcast', href: '/podcast' },
  },
  {
    datum: '2026-08-17',
    art: 'korrigiert',
    titel: 'Ein Versprechen zurückgenommen, das wir nicht einhalten',
    text: 'Unter jeder Folge und im Fußbereich stand, Texte würden „vor der Veröffentlichung von einem Menschen inhaltlich geprüft". Das trifft nicht zu: Nachrichten und Podcast gehen ohne Zwischenhalt online. Der Satz sagt jetzt, was wirklich passiert – automatisiert, mit der redaktionellen Verantwortung beim Betreiber.',
  },
  {
    datum: '2026-08-17',
    art: 'neu',
    titel: 'Methoden: wie jede Kennzahl gerechnet wird',
    text: 'Für acht Kennzahlen stehen jetzt Formel, Datengrundlage und Stichtag an einer Stelle – und vor allem, was dabei bewusst weggelassen wird. Die Beispielrechnungen sind nicht abgetippt, sondern werden aus derselben Funktion erzeugt, die auch die Zahl auf der Website rechnet.',
    ziel: { text: 'Zu den Methoden', href: '/methoden' },
  },
  {
    datum: '2026-08-17',
    art: 'neu',
    titel: 'Jede Zahl sagt, wie alt sie ist',
    text: 'Neben Angaben, die sich regelmäßig ändern, steht jetzt eine Ampel: wie alt der Wert ist und ab wann das zu alt wäre. Sie rechnet im Browser mit Ihrer Uhr – eine beim Bauen gerechnete Ampel stünde für immer auf Grün.',
    ziel: { text: 'Beispiel: Marktstimmung', href: '/maerkte/stimmung/aktien' },
  },
  {
    datum: '2026-08-17',
    art: 'geaendert',
    titel: 'Die Farbe der Browserleiste folgt dem Farbschema',
    text: 'Auf dem Telefon war der Balken über der Seite hell, während die Seite dunkel war – oder umgekehrt. Er folgt jetzt der gewählten Darstellung. Beim Umschalten lädt die Seite dafür kurz neu.',
  },
  {
    datum: '2026-08-16',
    art: 'neu',
    titel: '52 Wochen: wo jeder Wert in seinem Jahr steht',
    text: 'Eine sortierbare Übersicht über alle geführten Werte: Abstand zum Jahreshoch, Abstand zum Jahrestief und die Position dazwischen. Die beiden sind nicht dasselbe – zwei Titel, beide zehn Prozent unter ihrem Hoch, können im unteren Drittel oder im oberen Fünftel ihrer Spanne stehen.',
    ziel: { text: 'Zur Übersicht', href: '/maerkte/52-wochen' },
  },
  {
    datum: '2026-08-13',
    art: 'geaendert',
    titel: 'Der erste Besuch ist hell, auch auf dunkel gestellten Geräten',
    text: 'Vorher entschied die Systemeinstellung des Geräts. Wer sein Telefon auf Dunkel gestellt hatte, bekam eine dunkle Seite, ohne je etwas an ihr eingestellt zu haben. Der Umschalter oben rechts bleibt.',
  },
  {
    datum: '2026-08-11',
    art: 'geaendert',
    titel: 'Nachrichten und Podcast sind zuverlässig um sechs Uhr da',
    text: 'Die Schritte hängen jetzt aneinander statt an einzelnen Uhrzeiten: Jeder stößt den nächsten an, sobald er fertig ist. Vorher konnte ein ausgefallener Termin die ganze Kette bis zum nächsten Tag aufhalten.',
    ziel: { text: 'Zu den Nachrichten', href: '/news' },
  },
]
