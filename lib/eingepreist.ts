/**
 * Die umgekehrte Bewertung: Welches Wachstum ist im Kurs schon bezahlt?
 *
 * ## Warum rückwärts statt vorwärts
 *
 * Ein gewöhnliches Bewertungsmodell nimmt Annahmen und spuckt ein Kursziel
 * aus – eine Zahl, die wie eine Empfehlung aussieht und an der vierten
 * Nachkommastelle einer geratenen Annahme hängt. Hier läuft dieselbe
 * Rechnung rückwärts: Der Kurs steht fest, gesucht ist die Annahme. „Bei
 * einem KGV von 30 bezahlst du elf Prozent Gewinnwachstum pro Jahr über
 * zehn Jahre“ ist eine überprüfbare Aussage über den Preis – kein Urteil,
 * ob er sich lohnt.
 *
 * ## Warum das KGV genügt
 *
 * Der Barwert künftiger Gewinne ist linear im heutigen Gewinn je Aktie:
 * Kurs und Gewinn kürzen sich zum KGV. Damit braucht die Rechnung weder
 * Kurs noch Gewinn einzeln – und keine Währung, denn ein Verhältnis hat
 * keine.
 *
 * ## Das Modell, vollständig
 *
 * Der Gewinn je Aktie wächst `jahre` lang mit konstanter Rate, jeder
 * Jahresgewinn wird mit der Abzinsung auf heute abgezinst, am Ende wird
 * das letzte Gewinnniveau zu einem End-KGV bewertet und ebenfalls
 * abgezinst. Konstantes Wachstum über zehn Jahre liefert kein Unternehmen
 * der Welt – das Modell ist eine Messlatte für den Preis, kein Abbild der
 * Zukunft, und genau so steht es an der Rechnerseite.
 *
 * Ohne Laufzeitimporte, damit `tests/` das Modul direkt laden kann.
 * (`lib/bewertung.ts` daneben gehört dem Lernbereich – Gordon-Modell und
 * zwei weitere Belegrechnungen – und bleibt davon unberührt.)
 */

export interface Modellannahmen {
  /** Betrachtungszeitraum in Jahren. */
  jahre: number
  /** Abzinsung (geforderte Rendite) in Prozent je Jahr. */
  abzinsungProzent: number
  /** Zu welchem Vielfachen der Gewinn am Ende bewertet wird. */
  endKgv: number
}

/**
 * Die Standardannahmen – eine Stelle, zwei Verwender.
 *
 * Der Rechner öffnet mit ihnen, und die vorgerechnete Karte auf jeder
 * Aktienseite rechnet mit denselben. Stünden sie doppelt, zeigten Karte
 * und Rechner irgendwann verschiedene Zahlen für dieselbe Aktie – der
 * eine Fehler, den dieses Werkzeug nicht haben darf.
 *
 * Zehn Jahre sind der übliche Rahmen solcher Modelle, acht Prozent grob
 * die langfristige Aktienmarktrendite, 15 der historische
 * Durchschnitts-Marktmultiplikator.
 */
export const STANDARDANNAHMEN: Modellannahmen = {
  jahre: 10,
  abzinsungProzent: 8,
  endKgv: 15,
}

/**
 * Das gerechtfertigte KGV bei gegebenem Wachstum: der Barwert aller
 * Jahresgewinne plus abgezinster Endwert, je Einheit heutigen Gewinns.
 */
export function gerechtfertigtesKgv(
  wachstumProzent: number,
  annahmen: Modellannahmen
): number {
  const g = 1 + wachstumProzent / 100
  const r = 1 + annahmen.abzinsungProzent / 100
  let barwert = 0
  let gewinn = 1
  for (let jahr = 1; jahr <= annahmen.jahre; jahr++) {
    gewinn *= g
    barwert += gewinn / r ** jahr
  }
  return barwert + (gewinn * annahmen.endKgv) / r ** annahmen.jahre
}

/** Der Suchbereich der Umkehrung, in Prozent Wachstum je Jahr. */
export const WACHSTUM_MIN = -50
export const WACHSTUM_MAX = 60

/**
 * Das implizite Wachstum zu einem KGV – die Umkehrung per Bisektion.
 *
 * `gerechtfertigtesKgv` steigt streng mit dem Wachstum, es gibt also
 * höchstens eine Lösung. Liegt sie außerhalb von −50 bis +60 Prozent je
 * Jahr, kommt `null` zurück: Ein Modell, das 80 Prozent Dauerwachstum
 * ausweist, erklärt nichts mehr – die ehrliche Antwort ist dann „außerhalb
 * des Modells“, nicht die nächstgelegene Zahl.
 */
export function implizitesWachstum(kgv: number, annahmen: Modellannahmen): number | null {
  if (!Number.isFinite(kgv) || kgv <= 0) return null

  let unten = WACHSTUM_MIN
  let oben = WACHSTUM_MAX
  if (gerechtfertigtesKgv(unten, annahmen) > kgv) return null
  if (gerechtfertigtesKgv(oben, annahmen) < kgv) return null

  for (let schritt = 0; schritt < 100; schritt++) {
    const mitte = (unten + oben) / 2
    if (gerechtfertigtesKgv(mitte, annahmen) < kgv) unten = mitte
    else oben = mitte
  }
  return (unten + oben) / 2
}
