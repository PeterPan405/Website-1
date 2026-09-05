/**
 * Werte, die zu einem bekannten Termin veralten.
 *
 * ## Warum es dieses Verzeichnis gibt
 *
 * Auf dieser Website stehen drei Arten von Zahlen. Die erste kommt aus einer
 * Momentaufnahme und ist so frisch wie der letzte Abruf. Die zweite ist
 * abgeleitet und stimmt, solange die Rechnung stimmt. Die dritte steht als
 * Literal im Quelltext, weil sie aus einem Gesetz oder einer Bekanntmachung
 * stammt – und **die ist die gefährliche**: Sie ist heute richtig, wird zu
 * einem vorhersehbaren Termin falsch, und niemand merkt es.
 *
 * Der Basiszins für die Vorabpauschale ist das Musterbeispiel. Das
 * Bundesfinanzministerium gibt ihn jeden Januar neu bekannt. Bis dahin rechnet
 * der Steuerrechner mit dem Wert des Vorjahres weiter, der Build ist grün,
 * jede Prüfung ist grün, und das Ergebnis ist trotzdem falsch.
 *
 * Hier steht deshalb zu jedem solchen Wert, **für welches Jahr** er gilt und
 * **wo er herkommt**. `scripts/frische-pruefen.ts` hält das gegen das laufende
 * Jahr und meldet, was nachzutragen ist.
 *
 * ## Was hier nicht hineingehört
 *
 * Werte ohne Verfallsdatum. Der Abgeltungsteuersatz von 25 Prozent steht seit
 * 2009 im Gesetz, der Solidaritätszuschlag von 5,5 Prozent darauf ebenso. Sie
 * können sich ändern, aber nicht zu einem Termin, den man vorher kennt – bei
 * ihnen hilft kein Kalender, sondern nur Lesen.
 *
 * ## Was am 28. August 2026 versucht wurde, die Sätze zu belegen
 *
 * Damit sich niemand dieselbe halbe Stunde noch einmal nimmt. Der
 * Zwei-Wochen-Turnus (`data/inhalte-turnus.ts`, `steuerwerte`) verlangt, die
 * Sätze „gegen den amtlichen Stand" zu halten. Aus dieser Umgebung heraus geht
 * das nur über einen Läufer (`quellen-holen.yml`), und der kommt an zwei von
 * drei Adressen nicht heran:
 *
 * - **`gesetze-im-internet.de` antwortet Läufern nicht.** Vier Adressen
 *   (`estg/__20`, `estg/__32d`, `solzg_1995/__4`, `invstg_2018/__20`), zwei
 *   Läufe, jedes Mal `urlopen error timed out` – kein 403, keine Antwort.
 *   Ein Browser-Kennzeichen schickt der Abruf längst mit. Ein stilles
 *   Fallenlassen ist eine gesetzte Schranke; sie wird nicht umgangen.
 * - **Die BMF-Themenseite zur Abgeltungsteuer** (`/Web/DE/Themen/Steuern/
 *   Steuerarten/Abgeltungsteuer/abgeltungsteuer.html`) antwortet mit 200 und
 *   einer Sperrseite („You reached this page when trying to access … from
 *   <IP>"). Die Adresse ist geraten und war entweder falsch oder gesperrt.
 * - **Die BMF-Seite zum Basiszins ist erreichbar** (200) und trägt Titel und
 *   Datum des Schreibens vom 13.01.2026. Die Zahl steht weiterhin nur in der
 *   PDF daneben – so, wie es unten beim Eintrag `basiszins` steht.
 *
 * Der Basiszins ist damit belegt, so weit er es sein kann: Die Quelle lebt,
 * das Schreiben gilt für 2026, der nächste Wert kommt im Januar 2027. Die
 * **Sätze** dagegen – 25 Prozent, 5,5 Prozent, 1.000/2.000 Euro,
 * Teilfreistellungen 30/15/60/80 Prozent – konnten am 28. August 2026 aus
 * dieser Umgebung **nicht** gegen eine Primärquelle gehalten werden. Das ist
 * ein Zwischenstand, kein Ergebnis, und deshalb steht er hier und nicht als
 * abgehakte Durchsicht in `data/inhalte-turnus.ts`.
 *
 * Der nächste Versuch braucht eine amtliche Quelle, die einem Läufer
 * antwortet – oder einen Menschen mit einem Browser.
 *
 * ## Nachgeprüft am 5. September 2026
 *
 * Zwei Dinge, die den Stand von oben schärfen.
 *
 * **Die Sperre ist keine Werkzeugsache.** Am 1. September stellte sich
 * heraus, dass `quellen-holen.yml` an jeder Adresse mit AAAA-Eintrag
 * scheiterte, weil GitHub-Läufer kein IPv6 haben (`scripts/netz.py`). Das war
 * ein naheliegender Verdacht für die Zeitüberschreitungen hier. Er ist
 * **falsch**: Mit repariertem Abrufweg, vier Adressen, derselbe Befund –
 * `urlopen error timed out`. Die Schranke steht und wird nicht umgangen.
 *
 * **`recht.bund.de` antwortet.** Seit dem 1.1.2023 ist das die amtliche
 * Verkündungsplattform; sie liefert einem Läufer 200 und lesbaren Text
 * (`bgbl.de` daneben trägt nur noch das Archiv bis 2022). Sie löst das
 * Problem trotzdem **nicht**: Verkündet wird dort das Bundesgesetzblatt, also
 * das Gesetz in seiner ursprünglichen Fassung und jedes Änderungsgesetz
 * einzeln. Den heute geltenden Satz bekäme man nur, indem man die
 * Konsolidierung selbst nachvollzieht – und ein selbst zusammengerechneter
 * Gesetzesstand ist keine Quelle, sondern eine Behauptung.
 *
 * Konsolidiertes Bundesrecht gibt es amtlich nur bei
 * `gesetze-im-internet.de`, und genau die antwortet nicht. Damit bleibt es
 * beim Menschen mit einem Browser; eine dritte Adresse zu suchen lohnt nicht.
 *
 * Und: **Bewusste Annahmen gehören auch nicht hierher.** Die 2,5 Prozent
 * Inflation im Lernthema sind keine veraltete Zahl, sondern eine gerundete
 * Annahme über dreißig Jahre; das steht in `lib/inflations-beispiele.ts` so
 * begründet. Eine aktuelle Rate wäre dort einen Monat lang richtig.
 */

export type Turnus = 'jaehrlich' | 'unbestimmt'

export interface Stichtagswert {
  /** Kennung, unter der das Prüfskript den Wert meldet. */
  id: string
  bezeichnung: string
  wert: number
  einheit: 'prozent' | 'euro'
  /** Das Jahr, für das dieser Wert bekanntgegeben wurde. */
  gilt: number
  /**
   * Wie oft er neu gesetzt wird.
   *
   * `jaehrlich` heißt: Ab Januar des Folgejahres ist der hier stehende Wert
   * überholt, und das Prüfskript sagt es. `unbestimmt` heißt: Er kann sich
   * ändern, aber nicht planbar – dann meldet die Prüfung nichts und es hilft
   * nur, die Quelle im Auge zu behalten.
   */
  turnus: Turnus
  quelle: { label: string; url: string }
  /** Wo der neue Wert zu finden ist, wenn dieser abgelaufen ist. */
  pflege: string
}

export const stichtagswerte: readonly Stichtagswert[] = [
  {
    id: 'basiszins',
    bezeichnung: 'Basiszins für die Vorabpauschale',
    /*
      3,20 Prozent zum 2. Januar 2026, wörtlich aus dem BMF-Schreiben vom
      13. Januar 2026 (GZ IV C 1 - S 1980/00230/012/001):

        „Die Deutsche Bundesbank hat hierfür auf den 2. Januar 2026 anhand
        der Zinsstrukturdaten einen Wert von 3,20 Prozent für
        Bundeswertpapiere mit jährlicher Kuponzahlung und einer Restlaufzeit
        von 15 Jahren errechnet."

      Bis zum 9. August 2026 stand hier der Wert für 2025 (2,53 %). Er war
      seit Januar überholt, und `npm run frische` hat es die ganze Zeit
      gemeldet – nur lief die Prüfung nirgends automatisch. Genau daraus ist
      der Zwei-Wochen-Turnus entstanden.

      Die Zahl steht **nur in der PDF**; die HTML-Seite daneben nennt bloß
      Titel und Datum. Deshalb kann `quellen-holen.yml` seit demselben Tag
      PDFs lesen.
    */
    wert: 3.2,
    einheit: 'prozent',
    gilt: 2026,
    turnus: 'jaehrlich',
    quelle: {
      label:
        'Bundesfinanzministerium, BMF-Schreiben vom 13. Januar 2026, ' +
        'Basiszins zum 2. Januar 2026 nach § 18 Absatz 4 InvStG',
      url: 'https://www.bundesfinanzministerium.de/Content/DE/Downloads/BMF_Schreiben/Steuerarten/Investmentsteuer/2026-01-13-basiszins-berechnung-vorabpauschale.html',
    },
    pflege:
      'Das BMF veröffentlicht den Zins jeweils im Januar im Bundessteuerblatt. ' +
      'Er leitet sich aus der Rendite langfristiger deutscher Staatsanleihen zum ' +
      'ersten Börsentag des Jahres ab. Der Wert steht nur in der verlinkten PDF – ' +
      'über `quellen-holen.yml` ist sie lesbar.',
  },
  {
    id: 'sparerpauschbetrag',
    bezeichnung: 'Sparerpauschbetrag je Person',
    wert: 1000,
    einheit: 'euro',
    gilt: 2023,
    /*
      Kein jährlicher Turnus: Der Betrag steht im Gesetz und wurde zuletzt 2023
      von 801 auf 1.000 Euro angehoben. Er läuft nicht ab – er ändert sich,
      wenn der Gesetzgeber ihn ändert, und das kündigt kein Kalender an.
    */
    turnus: 'unbestimmt',
    quelle: {
      label: '§ 20 Absatz 9 Einkommensteuergesetz',
      url: 'https://www.gesetze-im-internet.de/estg/__20.html',
    },
    pflege:
      'Ändert sich nur durch Gesetzesänderung. Der doppelte Betrag gilt für ' +
      'Zusammenveranlagte und wird daraus abgeleitet, nicht getrennt geführt.',
  },
]

/** Ein Wert über seine Kennung, oder `undefined`. */
export function stichtagswert(id: string): Stichtagswert | undefined {
  return stichtagswerte.find((eintrag) => eintrag.id === id)
}
