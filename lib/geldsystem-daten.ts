/**
 * Die Zahlen zum Lernthema Geldsystem.
 *
 * ## Warum sie hier stehen und nicht in der Grafik
 *
 * Weil sie zweimal gebraucht werden: im Fließtext und in der Zeichnung. Stünde
 * dieselbe Zahl an beiden Stellen, wäre eine von beiden nach der ersten
 * Änderung falsch – und zwar die in der Grafik, weil sie beim Korrekturlesen
 * niemand mitliest. Dieses Projekt hatte diesen Fehler schon einmal.
 *
 * Ohne Importe, damit `tests/` das Modul direkt laden kann.
 *
 * ## Zu den Lebensdauern
 *
 * Aufgenommen ist nur, was sich an einem Datum festmachen lässt: Einführung
 * und Ablösung einer Währung. Nicht aufgenommen ist der vielzitierte
 * Durchschnitt von 27 Jahren über 775 Papierwährungen – er stammt aus einer
 * privaten Sammlung ohne nachvollziehbare Auswahlregel und vermischt zwei
 * grundverschiedene Vorgänge: das Scheitern einer Währung und ihr Aufgehen in
 * einer Union. Die D-Mark ist 1999 nicht gescheitert.
 *
 * Deshalb steht hier keine Durchschnittszahl, sondern eine Auswahl von Fällen,
 * die jeder einzeln nachprüfbar ist. Die Auswahl ist bewusst gemischt: die
 * bekanntesten Zusammenbrüche und die ältesten laufenden Währungen. Der
 * Abstand zwischen beiden Gruppen ist die Aussage.
 */

export interface Waehrungslebensdauer {
  name: string
  /** Jahre zwischen Einführung und Ablösung – bei laufenden bis 2026. */
  jahre: number
  /** Zusammengebrochen oder ersetzt; `false` heißt: bis heute im Umlauf. */
  gescheitert: boolean
}

const HEUTE = 2026

function laufend(name: string, seit: number): Waehrungslebensdauer {
  return { name, jahre: HEUTE - seit, gescheitert: false }
}

function beendet(name: string, von: number, bis: number): Waehrungslebensdauer {
  return { name, jahre: bis - von, gescheitert: true }
}

/**
 * Die Fälle der Grafik, nach Dauer sortiert.
 *
 * Die Sortierung steht hier und nicht in der Zeichnung: Sie ist eine Aussage
 * über die Daten, keine Frage der Darstellung.
 */
export const waehrungslebensdauern: readonly Waehrungslebensdauer[] = [
  laufend('Pfund Sterling (BoE)', 1694),
  laufend('US-Dollar', 1792),
  laufend('Schweizer Franken', 1850),
  laufend('Japanischer Yen', 1871),
  beendet('Zimbabwe-Dollar', 1980, 2009),
  beendet('Reichsmark', 1924, 1948),
  beendet('Ungarischer Pengő', 1927, 1946),
  beendet('Papiermark (Deutschland)', 1914, 1923),
  beendet('Argentinischer Austral', 1985, 1992),
  laufend('Euro', 1999),
].sort((a, b) => b.jahre - a.jahre)

/**
 * Devisenumsatz je Handelstag in Billionen US-Dollar.
 *
 * Bank für Internationalen Zahlungsausgleich, Dreijahreserhebung, April 2022.
 * Die Erhebung wird alle drei Jahre wiederholt; eine neuere Ausgabe existiert.
 * Hier steht die Zahl, deren Stand sich eindeutig benennen lässt – eine
 * ungefähr erinnerte neuere wäre auf einer Seite mit Quellenverzeichnis
 * schlechter als eine ältere mit Datum.
 */
export const devisenumsatzTag = 7.5

/**
 * Welthandel mit Waren und Dienstleistungen, Ausfuhren 2022, in Billionen US-Dollar.
 *
 * Größenordnung nach den Handelsstatistiken der Welthandelsorganisation:
 * rund 25 Billionen Waren und rund 7 Billionen Dienstleistungen.
 */
export const welthandelJahr = 32

/** Wie viele Handelstage der Devisenmarkt für einen Jahres-Welthandel braucht. */
export function handelstageJeWelthandelsjahr(): number {
  return welthandelJahr / devisenumsatzTag
}
