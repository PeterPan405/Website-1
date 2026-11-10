/**
 * Die Zahlenkarte – ein einzelnes Bild, eine Zahl, die hängen bleibt.
 *
 * Vorbild ist der Beitrag vom 12.10.2026 („7 US-Giganten sind mehr Wert als
 * Europas 600"), über den der Betreiber am 15.10.2026 schrieb: „Ich wollte
 * nur sagen, dass ich sehr zufrieden bin." Beschrieben ist die Form in
 * `INSTAGRAM.md` unter „C — Zahlenkarte"; diese Datei setzt sie.
 *
 *   Kopf         Logo und Wortmarke „IM Invests", mittig
 *   Überschrift  Anton 112 px, schwarz, die Pointe dunkelgrün
 *   Grafik       schwarzer Balken gegen dunkelgrünen, Wert fett-kursiv darüber,
 *                die Differenz dunkelrot zwischen zwei gestrichelten Linien
 *   Fuß          Beschriftung unter den Balken, Fußzeile „Stand | Quelle"
 *
 * **Zwei Formen**, Kopf, Überschrift und Fuß bleiben gleich. Der Betreiber am
 * 15.10.2026 zum ersten Entwurf: „mache mehrere Länder in den Vergleich, es
 * muss auch nicht immer so ein Balkendiagramm sein … ich meinte mit Vorlage
 * Schrift und dass unser Logo oben drauf ist." Die Vorlage ist also Anton und
 * das Logo – nicht die zwei Balken. Daher neben dem `vergleich` die
 * `rangliste`: bis elf Zeilen mit Flagge, Name, zehn Häuschen (eins je zehn
 * Prozent, das letzte anteilig gefüllt) und Wert; eine Zeile hervorgehoben,
 * ein Schnitt gestrichelt eingereiht.
 *
 * Wann eine Karte hinausgeht, entscheidet **nicht** diese Datei: Jede Karte
 * wird vorher abgestimmt (Anordnung vom 15.10.2026: „Ich möchte, dass die
 * Themen der Beiträge mit mir bzw. mit unserer Social-Media-Abteilung
 * abgesprochen werden"). Der Ablauf steht in `INSTAGRAM.md`.
 */
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { ImageResponse } from 'next/og.js'
import { createElement as h } from 'react'

import { RECHTSHINWEIS } from './instagram-plan.ts'

export const ZK_BREITE = 1080
export const ZK_HOEHE = 1350

/** Eine Seite des Vergleichs. */
export interface Seite {
  /** Unter dem Balken: „Deutschland", „Magnificent Seven". */
  name: string
  /** Die Zahl, die die Balkenhöhe bestimmt. */
  wert: number
  /** So steht sie über dem Balken: „47,2 %", „24,9". */
  anzeige: string
  /** Kleine Zeile unter der Zahl: „im Eigentum", „Bio. US-$". */
  zusatz: string
  /** Kreisrunde Flagge aus waagrechten Streifen, von oben – oder keine. */
  flagge?: string[]
  /** Statt `flagge`: ein Schlüssel in `FLAGGEN` – auch für Flaggen ohne Streifen (USA). */
  land?: string
}

interface KarteGemeinsam {
  /** Erscheinungstag, JJJJ-MM-TT. */
  datum: string
  /**
   * Die Überschrift in Stücken; `gruen` hebt die Pointe hervor – in der
   * Akzentfarbe des Tages (`akzentfarbe()`), seit dem 18.10.2026 nicht mehr
   * immer grün. Der Feldname blieb, damit die Karten im Bestand gelten.
   */
  titel: {
    text: string
    gruen?: boolean
    /**
     * Statt der Akzentfarbe die Farbe einer Kurve: „steigt" grün, „faellt"
     * rot (30.10.2026, Gaspreis: „Europa grün und …" USA rot – dieselben
     * Töne wie die Linien im Duell).
     */
    richtung?: 'steigt' | 'faellt'
  }[]
  /** Unter der Linie, klein: „Stand: 2025 | Quelle: Eurostat …" */
  fusszeile: string
  /** Aufhänger, ein bis zwei Absätze, „Quellen: …" – ohne Rechtshinweis. */
  text: string
  /** Genau fünf, klein, ohne `#`. */
  schlagworte: string[]
  /**
   * Der Tag der Freigabe durch den Betreiber – erst dann geht die Karte
   * hinaus, und auch dann frühestens um 15 Uhr (`lib/zahlenkarten-wecker.ts`).
   * Gesetzt wird es **nach** seinem „passt", nie davor; ein Entwurf hat keins.
   */
  freigabe?: string
  /**
   * Ausnahmsweise früher als 15 Uhr hinaus, „HH:MM" deutscher Zeit
   * (Betreiber, 04.11.2026, zu den US-Zwischenwahlen: „ausnahmsweise um
   * 10:30 Uhr bis 11:00 Uhr"). Nur zusammen mit der Freigabe wirksam.
   */
  ab?: string
  /**
   * Eine zweite Seite – dann geht die Karte als Karussell aus zwei Bildern
   * hinaus (`/instagram/zahlenkarte-2.jpg`). Sie teilt Datum, Freigabe und
   * Beschriftung der ersten.
   */
  zweiteSeite?: Personenkarte
}

/** Zwei Balken gegeneinander – die Form des Vorbilds vom 12.10.2026. */
export interface Vergleichskarte extends KarteGemeinsam {
  art?: 'vergleich'
  /** Links schwarz, rechts dunkelgrün – wie im Vorbild. */
  links: Seite
  rechts: Seite
  /** Zwischen den Balken: „+40,0", darunter „Prozentpunkte". */
  differenz: { text: string; zusatz: string }
}

/** Eine Zeile der Rangliste. */
export interface Rang {
  name: string
  /** Prozent – bei Häuschen 0 bis 100, eins je zehn; bei Balken auch darüber. */
  wert: number
  /** Schlüssel in `FLAGGEN`: ISO-3, „EU27" oder „WELT" (Schnitt aller Länder). */
  land: string
  /**
   * Nur Kacheln: das Firmenlogo statt Flagge und Name – Dateiname in
   * `lib/instagram/logos/` (28.10.2026, Betreiber: „mit logo vom
   * unternehmen"). Nur gemeinfreie Logos von Commons, Fundstelle im
   * Kommentar der Karte. Ohne Logo steht der Name wie bisher.
   */
  logo?: string
  /** Die Zeile, um die es geht – dunkelgrün, umrandet. Genau eine. */
  hervor?: boolean
  /** Ein Durchschnitt, eingereiht – grau, gestrichelt. */
  schnitt?: boolean
  /** Nur Zeitleiste: die zweite Zahl unter dem Namen, etwa „Einbruch −86 %". */
  zusatz?: string
}

export interface Rangkarte extends KarteGemeinsam {
  art: 'rangliste'
  /** Die Zeile unter der Überschrift: „Von 10 Menschen wohnen so viele im Eigentum:" */
  unterzeile: string
  /** Absteigend, vier bis elf Zeilen. */
  zeilen: Rang[]
  /**
   * Häuschen (Voreinstellung) für Anteile bis 100 %, Balken für Werte, die
   * darüber gehen – Staatsschulden von 308,7 % des BIP wären 31 Häuschen.
   * Die Balken zeigen eine gestrichelte Linie bei 100 %. Kacheln: ein
   * Raster aus Karten mit großer Zahl, zwei Spalten, ohne Grafik.
   */
  skala?: 'haeuser' | 'balken' | 'kacheln' | 'zeitleiste' | 'burger'
  /**
   * Was hinter der Zahl steht – voreingestellt „ %". Leer für Größen ohne
   * Einheit wie die Geburtenziffer (1,36 Kinder je Frau; die Einheit steht
   * dann in der Unterzeile). Nur mit Balken: Häuschen zählen Prozent.
   */
  einheit?: string
  /** Nachkommastellen der Werte – voreingestellt eine; die Geburtenziffer braucht zwei. */
  stellen?: number
  /**
   * Zwei, drei Sätze zwischen Überschrift und Unterzeile: was die Zahl ist,
   * von wem, seit wann. Betreiber, 26.10.2026, zum Big-Mac-Index: „Leute,
   * die davon das erste Mal hören, denken sonst, was ist das für ein …".
   * Nur bei zweizeiliger Überschrift – die dritte Zeile bräuchte den Platz.
   */
  erklaerung?: string
}

/** Eine Linie im Verlauf – ein Index oder Wert aus dem Kursbestand. */
export interface Verlaufreihe {
  name: string
  /** Symbol im Kursbestand (`data/markets.ts`). */
  symbol: string
  /** Schlüssel in `FLAGGEN`, am Ende der Linie. */
  land?: string
  /** Die Linie in der Akzentfarbe – genau eine; die andere ist schwarz. */
  akzent?: boolean
  /** So steht der Endwert am Linienende: „+11,9 %" – derselbe wie im Text. */
  endwert: string
}

/**
 * Zwei Linien seit Jahresbeginn, in Prozent (18.10.2026). Der Betreiber zum
 * Vergleich mit zwei Balken: „nein, mit Chart vergleich, bissl kreativer
 * werden!!"
 */
export interface Verlaufkarte extends KarteGemeinsam {
  art: 'verlauf'
  unterzeile: string
  /** Letzter Handelstag, der zählt – spätere Kurse bleiben draußen. */
  bis: string
  reihen: Verlaufreihe[]
}

/** Eine Seite im Duell: Schlusskurse eines Zeitraums, Tag für Tag. */
export interface Duellseite {
  name: string
  /** Kleine Zeile unter dem Namen: „Schweizer Leitindex". */
  zusatz: string
  land?: string
  /** Schlusskurse, alt nach neu; der erste ist der Bezug (0 %). */
  punkte: { t: string; wert: number }[]
}

/**
 * Zwei kleine Charts nebeneinander und die Differenz in einem Kasten
 * (19.10.2026, nach dem Vorbild HKCM „Konsumaktien schlagen Tech um 12,7
 * Prozentpunkte"). Steigt eine Seite, ist ihre Linie grün, fällt sie, rot –
 * die Logotöne; die Differenz steht in der Akzentfarbe.
 */
export interface Duellkarte extends KarteGemeinsam {
  art: 'duell'
  unterzeile: string
  links: Duellseite
  rechts: Duellseite
}

/**
 * Ein Unternehmen allein (28.10.2026). Der Betreiber zur Liste der
 * teuersten Aktien: „ich habe doch gesagt, nur Berkshire Hathaway
 * vorstellen." Logo groß, darunter vier bis sechs Kennzahlen als Liste –
 * Name links, Wert rechts. Jede Zahl mit Quelle im Kommentar der Karte.
 */
export interface Steckbriefkarte extends KarteGemeinsam {
  art: 'steckbrief'
  /** Datei in `lib/instagram/logos/` – nur gemeinfreie Logos. */
  logo: string
  /**
   * Ein Foto daneben – Datei in `lib/instagram/fotos/`, nur gemeinfrei oder
   * CC BY(-SA) mit Nennung. Betreiber, 28.10.2026: „irgendwas zu Warren
   * Buffett. Noch ein Bild von ihm." Mit Foto stehen Logo und Kennzahlen
   * rechts daneben, untereinander.
   */
  foto?: string
  /** Zwei Sätze unter der Überschrift: wer das ist. */
  erklaerung: string
  fakten: { name: string; wert: string }[]
}

/**
 * Die Geschichte eines Kurses (28.10.2026). Betreiber zum Steckbrief
 * Berkshire: „mach entwicklung von denen mit chart geschichte usw". Ein
 * Verlauf über Jahrzehnte auf logarithmischer Achse – sonst wären 1.490 $
 * neben 810.106 $ eine Nulllinie –, darauf die Meilensteine mit Jahr und
 * Kurs, oben rechts optional ein Foto.
 */
export interface Geschichtskarte extends KarteGemeinsam {
  art: 'geschichte'
  erklaerung: string
  unterzeile: string
  /** Hinter jeder Zahl: „ $". */
  einheit: string
  /** Kurse, alt nach neu – je Jahr einer genügt. */
  punkte: { t: string; wert: number }[]
  /** Meilensteine auf der Linie: Tag, Kurs, kurze Zeile. */
  marken: { t: string; wert: number; text: string }[]
  /** Datei in `lib/instagram/fotos/`. */
  foto?: string
}

/**
 * Eine Pyramide (28.10.2026). Betreiber zu zwei Balken für Anthropic:
 * „gib dir mühe kreativ und nicht immer das selbe". Stufen von der
 * schmalen Spitze bis zur breiten Basis – wenige ganz oben, viele unten –,
 * je Stufe eine große Zahl und eine Zeile. Die Spitze in der Akzentfarbe.
 */
export interface Pyramidenkarte extends KarteGemeinsam {
  art: 'pyramide'
  erklaerung: string
  unterzeile: string
  /** Von der Spitze zur Basis, drei bis fünf. */
  stufen: { zahl: string; text: string }[]
  /** Optional: Logo in `lib/instagram/logos/`, rechts neben der Spitze. */
  logo?: string
  /** Optional: ein Satz unter der Pyramide, in einer hervorgehobenen Zeile. */
  hinweis?: string
}

/**
 * Eine Torte (28.10.2026, Betreiber für Anthropic: „Big Tech kassiert
 * mit"). Ein Ring aus zwei bis fünf Stücken, in der Mitte die Summe;
 * rechts je Stück das Logo, der Betrag und eine Zeile. Das größte Stück in
 * der Akzentfarbe.
 */
export interface Tortenkarte extends KarteGemeinsam {
  art: 'torte'
  erklaerung: string
  unterzeile: string
  /** Groß in der Mitte des Rings, darunter klein `text`. */
  mitte: { zahl: string; text: string }
  /** Größtes zuerst. `wert` bestimmt den Winkel, `anzeige` steht da. */
  stuecke: {
    name: string
    wert: number
    anzeige: string
    zusatz: string
    logo?: string
  }[]
  hinweis?: string
  /**
   * Eckdaten unter dem Ring, zwei bis drei nebeneinander – Betreiber,
   * 28.10.2026: „die gesamte Börsenbewertung … und wann der IPO dann auch
   * ist … Solche Daten fehlen da einfach". Statt `hinweis`.
   */
  infos?: { name: string; wert: string }[]
}

/**
 * Die Kurvenkarte (30.10.2026) – die erste Karte im Hausstil von
 * `INSTAGRAM-STIL.md`: weiß, Logo oben mittig, Titel in Montserrat schwarz
 * mit einer Pointe in Logo-Navy, darunter frei auf Weiß Zahlen und Grafik.
 *
 * Der Weg dahin, alles am 30.10.2026: zwei Balken „voll langweilig",
 * Monatskacheln „billig nach Vibecoding", Phantom-Schwarz „in schwarz sieht
 * es sehr billig aus", Weiß mit Leuchtlinie „KI-Slop … nicht ein wirklich
 * eigenes Design". Daraus die Vorgaben.
 *
 * Darunter: die zwei Endstände als große Zahlen, unter jeder ihre Kennzahl
 * als Pille, und beide Linien über dieselbe Zeit.
 */
/** Was alle Karten im Hausstil (`INSTAGRAM-STIL.md`) gemeinsam haben. */
interface StilGemeinsam extends KarteGemeinsam {
  erklaerung: string
  /** Die gesperrte Zeile über den Zahlen: „Dax · 100 € ab Januar 1990". */
  stichzeile: string
  /** Ein Symbol zum Anlass hinter der ersten Titelzeile – nur eins, nur dort. */
  symbol?: Anlass
}

/** Eine große Zahl im Hausstil, mit ihrer Kennzahl als Pille darunter. */
export interface Held {
  name: string
  wert: string
  richtung?: 'steigt' | 'faellt'
  pille?: { wert: string; name: string; richtung?: 'steigt' | 'faellt' }
}

export interface Kurvenkarte extends StilGemeinsam {
  art: 'kurven'
  /** Genau zwei, gleich lang. */
  linien: {
    name: string
    ende: string
    /** Ohne Richtung steht die Linie in Tinte – etwa wenn beide fallen und sich sonst nicht unterscheiden. */
    richtung?: 'steigt' | 'faellt'
    /** „grau" setzt die zweite Linie ab, wenn beide keine Richtung tragen. */
    ton?: 'grau'
    punkte: readonly number[]
  }[]
  /** Beschriftung der x-Achse: Stelle in `punkte` und Text. */
  achse: { bei: number; text: string }[]
  /** Hinter den Zahlen der y-Achse: „€". */
  einheit: string
  kennzahlen: { name: string; wert: string; richtung?: 'steigt' | 'faellt' }[]
  /** Den Namen jeder Linie über ihren Höchststand schreiben – nötig, wenn die Farben keine Richtung tragen. */
  namenAnKurve?: boolean
}

/**
 * Säulen im Hausstil (01.11.2026, US-Zwischenwahlen): je Säule ein Wert,
 * über ihr der Wert, unter ihr die Beschriftung; darüber ein oder zwei
 * Heldenzahlen. Für eine Reihe gleichartiger Fälle, etwa „jedes Jahr nach
 * einer Zwischenwahl".
 */
export interface Saeulenkarte extends StilGemeinsam {
  art: 'saeulen'
  helden: Held[]
  /**
   * `bild`: ein rundes Porträt über der Beschriftung, Datei in `lib/instagram/fotos/`.
   * `symbol`: ein kleines rundes Produktfoto unter der Beschriftung, Datei in
   * `lib/instagram/symbole/` (07.11.2026, Betreiber: „unten drunter so ganz
   * kleine Bildchen machen von den Produkten"; Emoji verworfen: „sehen aus
   * wie Kindersymbole und nicht wie das mögliche Produkt").
   */
  saeulen: { text: string; wert: number; bild?: string; symbol?: string }[]
  /** Hinter den Werten: „%". */
  einheit: string
  /** Nachkommastellen der Werte über den Säulen – ohne Angabe eine. */
  nachkomma?: number
}

/**
 * Zeitstrahl im Hausstil (02.11.2026, Lagardes vorzeitiger Abschied): je
 * Person ein waagerechter Balken über ihre Amtszeit, mit rundem Porträt
 * davor. Was regulär noch übrig gewesen wäre, steht gestrichelt dahinter.
 * Für eine Abfolge von Amtsinhabern oder Zeitabschnitten.
 */
export interface Zeitstrahlkarte extends StilGemeinsam {
  art: 'zeitstrahl'
  helden: Held[]
  /** Daten als JJJJ-MM-TT; `regelEnde` nur, wenn `ende` davor liegt. */
  balken: {
    name: string
    beginn: string
    ende: string
    regelEnde?: string
    /** Hinter dem Balken: „5,4 Jahre". */
    text: string
    bild?: string
    /** Der eine Balken, um den es geht – in Tinte, die anderen grau. */
    hervor?: boolean
  }[]
  /** Jahre, an denen die x-Achse beschriftet wird. */
  achse: number[]
}

/**
 * Waagerechte Balken im Hausstil (02.11.2026, Kriege und der Ölpreis): je
 * Zeile ein Fall mit Jahr und Name links, der Balken nach rechts, sein Wert
 * dahinter. Für drei bis acht Fälle, die man nebeneinander misst – anders
 * als `saeulen` ohne Zeitachse, die Reihenfolge ist die der Zeilen.
 */
export interface Balkenkarte extends StilGemeinsam {
  art: 'balken'
  helden: Held[]
  balken: {
    /** Fett, vorn: „1973". */
    marke: string
    /** Grau, dahinter: „Ölembargo". */
    text: string
    wert: number
    /** In Tinte statt Grau – der eine Fall, um den es geht. */
    hervor?: boolean
  }[]
  /** Hinter den Werten: „%". */
  einheit: string
  /** false: Werte ohne „+" – für Anzahlen wie Sitze, nicht für Veränderungen. */
  vorzeichen?: boolean
}

/**
 * Eine Gesamtkurve und darunter kleine Kurven je Teil, jede auf eigener
 * Skala (03.11.2026, Atomsprengköpfe weltweit und je Atommacht –
 * Betreiber: „insgesamt Sprengköpfe … dann halt noch ein paar Charts
 * dazu. Von China, Nordkorea und so weiter"). Alle Reihen gleich lang.
 */
export interface Vielfachkarte extends StilGemeinsam {
  art: 'vielfach'
  helden: Held[]
  gesamt: { name: string; punkte: readonly number[] }
  /** Beschriftung der x-Achse der Gesamtkurve: Stelle in `punkte` und Text. */
  achse: { bei: number; text: string }[]
  /** Drei bis neun, in Reihen zu drei. `wert` steht neben dem Namen. */
  teile: { name: string; wert: string; punkte: readonly number[] }[]
}

/**
 * Sitzverteilung je Kammer als ein Balken über alle Sitze (04.11.2026,
 * US-Zwischenwahl – Betreiber zur Balkenfassung: „ziemlich
 * unverständlich"). Ein Strich markiert die Mehrheit. Parteifarben
 * stehen hier für Parteien, nicht für eine Richtung.
 */
export interface Kammerkarte extends StilGemeinsam {
  art: 'kammern'
  helden: Held[]
  kammern: {
    name: string
    gesamt: number
    mehrheit: number
    teile: { name: string; wert: number; farbe: 'blau' | 'rot' | 'offen' }[]
  }[]
}

/**
 * Eine Seite mit Personen im Hausstil – rundes Porträt, Name, eine Zeile
 * zu Herkunft und Amt, eine zum Stand (05.11.2026, mögliche Nachfolger
 * Lagardes; Betreiber: „Mach doch noch eine zweite Seite für mögliche
 * Nachfolger"). Bisher nur als zweite Seite (`zweiteSeite`).
 */
export interface Personenkarte extends StilGemeinsam {
  art: 'personen'
  personen: { name: string; zeile: string; stand: string; bild?: string }[]
}

/**
 * Der Zahlenstrahl (Sorte D in `INSTAGRAM.md`, eingeführt 07.11.2026): ein
 * Karussell aus 5 bis 8 Kacheln, durch die eine waagrechte Achse läuft. Wer
 * wischt, wandert zu größeren Werten. Gezeichnet wird eine Panoramafläche
 * von `kacheln` × 1080 px; jede Kachel ist ihr Ausschnitt. Der Maßstab ist
 * linear und beginnt bei null – sonst lügt die Strecke.
 */
export interface Zahlenstrahlkarte extends KarteGemeinsam {
  art: 'zahlenstrahl'
  /** Unterzeile auf der Titelkachel – Stichpunkte, keine Sätze. */
  erklaerung: string
  kacheln: number
  /** Anfang und Ende der Achse, Abstand der Striche – in der Einheit der Werte. */
  start?: number
  bis: number
  /**
   * Gleiche Abstände statt Maßstab (07.11.2026, Betreiber: „es reicht ja,
   * wenn der Zeitstrahl nicht richtig ist, also von den Abständen her, das
   * ist egal"; „nicht nach Volumen … sondern schon nach Zeit"). Die Punkte
   * stehen in der Reihenfolge der Liste, ohne Striche – die Zahl steht am
   * Punkt.
   */
  gleichmaessig?: boolean
  schritt: number
  /** An den Strichen: „Mrd. $". */
  einheit: string
  /** Aufsteigend. `logo` in `lib/instagram/logos/`. */
  punkte: {
    name: string
    wert: number
    anzeige: string
    zusatz: string
    logo?: string
    hervor?: boolean
    /** Eine fremde Größe zum Vergleich (BIP eines Landes) – grau, hohler Punkt. */
    vergleich?: boolean
    /**
     * Noch offen, etwa ein geplanter Börsengang (Anthropic, 07.11.2026):
     * grau, hohler Punkt, `wert` zählt nicht – nur mit `gleichmaessig`.
     */
    offen?: boolean
  }[]
  /** Der Satz unten auf einer Kachel (ab Kachel 2), der den Vergleich zuspitzt. */
  saetze: { kachel: number; text: string }[]
}

/**
 * Das Börsenrätsel (09.11.2026, Betreiber: „such mal noch andere Ideen außer
 * diesen Zahlenstrahl“ – gewählt: „Thema eins klingt cool“). Ein Karussell,
 * je Rätsel zwei Kacheln: erst die Kurve ohne Namen, mit einem Tipp; wer
 * wischt, sieht die Auflösung mit Logo – dieselbe Kurve an derselben Stelle.
 * Die Prozentzahl wird aus den Punkten gerechnet, nicht eingetragen.
 */
export interface Raetselkarte extends KarteGemeinsam {
  art: 'raetsel'
  fragen: {
    /** Überschrift der Rätselkachel ab dem zweiten Rätsel: „Und diese?“. */
    frage?: string
    /** Der Tipp unten auf der Rätselkachel – ohne den Namen. */
    tipp: string
    /** Kurse, alt nach neu, in der Währung der Quelle. */
    punkte: readonly number[]
    /** Beschriftung der x-Achse: Stelle in `punkte` und Text. */
    achse: { bei: number; text: string }[]
    /** Der Name, der aufgelöst wird. */
    name: string
    /** Datei in `lib/instagram/logos/`. */
    logo: string
    /** Die Erläuterung auf der Auflösung – zwei, drei kurze Sätze. */
    satz: string
  }[]
}

/**
 * Mythos oder Fakt (10.11.2026): je Behauptung zwei Kacheln – erst die
 * Behauptung, dann das Urteil mit Säulen aus den Kursdaten.
 */
export interface Mythoskarte extends KarteGemeinsam {
  art: 'mythos'
  fragen: {
    /** Überschrift ab der zweiten Behauptung: „Und das?“. */
    frage?: string
    /** Ohne Anführungszeichen: „Montags fällt der Markt.“ */
    behauptung: string
    /** true: stimmt (grün), false: Mythos (rot). */
    fakt: boolean
    /** Was die Säulen messen: „DAX · Ø je Wochentag · 1988–2026“. */
    stichzeile: string
    saeulen: { name: string; wert: number; hervor?: boolean }[]
    einheit: string
    /** Nachkommastellen der Werte an den Säulen. */
    stellen: number
    satz: string
  }[]
}

export type Zahlenkarte =
  | Mythoskarte
  | Raetselkarte
  | Zahlenstrahlkarte
  | Personenkarte
  | Kammerkarte
  | Vielfachkarte
  | Kurvenkarte
  | Saeulenkarte
  | Zeitstrahlkarte
  | Balkenkarte
  | Tortenkarte
  | Pyramidenkarte
  | Vergleichskarte
  | Rangkarte
  | Verlaufkarte
  | Duellkarte
  | Steckbriefkarte
  | Geschichtskarte

/** Eine kreisrunde Flagge: Streifen, von oben oder von links, wahlweise mit Wappen. */
export interface Flagge {
  streifen: string[]
  senkrecht?: boolean
  /** Breite der Streifen im Verhältnis – Spanien 1 : 2 : 1. */
  gewichte?: number[]
  /** Ein Bild darüber, als SVG – das slowakische Wappen. */
  wappen?: string
  /** Statt Streifen ein Kürzel auf der ersten Farbe – „EU". */
  kuerzel?: string
  /** Farbe des Kürzels, sonst Gelb wie die Sterne der EU. */
  kuerzelFarbe?: string
  /** Die ganze Flagge als SVG, quadratisch – für Flaggen ohne Streifen (Japan, USA). */
  svg?: string
}

/*
  Nur Länder, deren Flagge aus Streifen besteht – oder deren Wappen sich in
  46 px noch erkennen lässt. Ohne Wappen wäre die Slowakei Russland.
*/
/*
  Flaggen, die sich nicht aus Streifen legen lassen, als ganzes Bild –
  vereinfacht auf das, was in 46 px noch zu sehen ist: die Sterne als Punkte,
  die Krone Liechtensteins als Umriss.
*/
const quadrat = (inhalt: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">${inhalt}</svg>`
/* Türkei (20.10.2026): Halbmond aus zwei Kreisen, Stern mit der Spitze zum Mond. */
const FLAGGE_TUERKEI = quadrat(
  '<rect width="60" height="60" fill="#E30A17"/><circle cx="25" cy="30" r="14" fill="#fff"/>' +
    '<circle cx="28.5" cy="30" r="11.2" fill="#E30A17"/><polygon points="35.00,30.00 39.73,28.35 39.84,23.34 42.87,27.34 47.66,25.89 44.80,30.00 47.66,34.11 42.87,32.66 39.84,36.66 39.73,31.65" fill="#fff"/>'
)
const FLAGGE_JAPAN = quadrat(
  '<rect width="60" height="60" fill="#fff"/><circle cx="30" cy="30" r="17" fill="#BC002D"/>'
)
const FLAGGE_USA = quadrat(
  Array.from(
    { length: 13 },
    (_, i) =>
      `<rect y="${((i * 60) / 13).toFixed(2)}" width="60" height="${(60 / 13 + 0.1).toFixed(2)}" fill="${i % 2 ? '#fff' : '#B22234'}"/>`
  ).join('') +
    '<rect width="30" height="32.3" fill="#3C3B6E"/>' +
    [8, 16, 24]
      .flatMap((y) =>
        [9, 17, 25].map((x) => `<circle cx="${x}" cy="${y}" r="1.8" fill="#fff"/>`)
      )
      .join('')
)
const FLAGGE_LIECHTENSTEIN = quadrat(
  '<rect width="60" height="30" fill="#002B7F"/><rect y="30" width="60" height="30" fill="#CE1126"/>' +
    '<path d="M13 23 L13 15 L17 19 L20.5 12 L24 19 L28 15 L28 23 Z" fill="#FFD83D"/>'
)
const FLAGGE_VENEZUELA = quadrat(
  '<rect width="60" height="20" fill="#FFCC00"/><rect y="20" width="60" height="20" fill="#00247D"/>' +
    '<rect y="40" width="60" height="20" fill="#CF142B"/>' +
    Array.from({ length: 8 }, (_, i) => {
      const w = Math.PI * (1.1 + (0.8 * i) / 7)
      return `<circle cx="${(30 + 13 * Math.cos(w)).toFixed(1)}" cy="${(36 + 13 * Math.sin(w)).toFixed(1)}" r="1.6" fill="#fff"/>`
    }).join('')
)

/** Ein fünfzackiger Stern als Pfad – für China. */
const stern = (cx: number, cy: number, r: number, drehung = 0) =>
  `<path d="${Array.from({ length: 10 }, (_, i) => {
    const w = drehung + (Math.PI * i) / 5 - Math.PI / 2
    const ri = i % 2 ? r * 0.38 : r
    return `${i ? 'L' : 'M'}${(cx + ri * Math.cos(w)).toFixed(2)} ${(cy + ri * Math.sin(w)).toFixed(2)}`
  }).join(' ')}Z" fill="#FFDE00"/>`
const FLAGGE_CHINA = quadrat(
  '<rect width="60" height="60" fill="#EE1C25"/>' +
    stern(16, 18, 9) +
    stern(28, 8, 2.6, 0.4) +
    stern(32, 14, 2.6, 0.9) +
    stern(32, 22, 2.6, 0) +
    stern(28, 28, 2.6, 0.4)
)
const FLAGGE_ISRAEL = quadrat(
  '<rect width="60" height="60" fill="#fff"/>' +
    '<rect y="9" width="60" height="7" fill="#0038B8"/><rect y="44" width="60" height="7" fill="#0038B8"/>' +
    '<path d="M30 19 L39.5 35.5 L20.5 35.5 Z M30 41 L20.5 24.5 L39.5 24.5 Z" fill="none" stroke="#0038B8" stroke-width="2.4"/>'
)
const FLAGGE_INDIEN = quadrat(
  '<rect width="60" height="20" fill="#FF9933"/><rect y="20" width="60" height="20" fill="#fff"/>' +
    '<rect y="40" width="60" height="20" fill="#138808"/>' +
    '<circle cx="30" cy="30" r="7" fill="none" stroke="#000080" stroke-width="1.6"/><circle cx="30" cy="30" r="1.6" fill="#000080"/>'
)
/* Südkorea: das Taegeuk (rot oben, blau unten) und die vier Trigramme als Striche. */
const FLAGGE_SUEDKOREA = quadrat(
  '<rect width="60" height="60" fill="#fff"/>' +
    '<path d="M18 30 A12 12 0 0 1 42 30 A6 6 0 0 1 30 30 A6 6 0 0 0 18 30 Z" fill="#CD2E3A"/>' +
    '<path d="M18 30 A6 6 0 0 0 30 30 A6 6 0 0 1 42 30 A12 12 0 0 1 18 30 Z" fill="#0047A0"/>' +
    [
      [10, 12, 45],
      [50, 12, -45],
      [10, 48, -45],
      [50, 48, 45],
    ]
      .map(
        ([x, y, w]) =>
          `<g transform="rotate(${w} ${x} ${y})">${[-3.5, 0, 3.5]
            .map(
              (d) =>
                `<rect x="${x - 5}" y="${y + d - 1}" width="10" height="2" fill="#000"/>`
            )
            .join('')}</g>`
      )
      .join('')
)

const FLAGGE_GROSSBRITANNIEN = quadrat(
  '<rect width="60" height="60" fill="#012169"/>' +
    '<path d="M0 0 L60 60 M60 0 L0 60" stroke="#fff" stroke-width="12"/>' +
    '<path d="M0 0 L60 60 M60 0 L0 60" stroke="#C8102E" stroke-width="4"/>' +
    '<path d="M30 0 V60 M0 30 H60" stroke="#fff" stroke-width="18"/>' +
    '<path d="M30 0 V60 M0 30 H60" stroke="#C8102E" stroke-width="10"/>'
)

const SYMBOL_OEL = quadrat(
  '<rect width="60" height="60" fill="#1b1b1b"/>' +
    '<path d="M30 12 C30 12 18 28 18 36 A12 12 0 0 0 42 36 C42 28 30 12 30 12 Z" fill="#fff"/>'
)

const FLAGGE_SCHWEIZ = quadrat(
  '<rect width="60" height="60" fill="#DA291C"/>' +
    '<rect x="25" y="12" width="10" height="36" fill="#fff"/><rect x="12" y="25" width="36" height="10" fill="#fff"/>'
)

/*
  Saudi-Arabien (27.10.2026, Gewinn pro Sekunde): grünes Feld, darauf in
  Weiß die Schriftzeile als Band und darunter das Schwert – die Schrift
  selbst ist in 46 px ohnehin nicht zu lesen.
*/
const FLAGGE_SAUDI = quadrat(
  '<rect width="60" height="60" fill="#006C35"/>' +
    '<rect x="12" y="19" width="36" height="9" rx="4" fill="#fff"/>' +
    '<rect x="13" y="36" width="34" height="3" fill="#fff"/><rect x="43" y="33" width="3" height="9" fill="#fff"/>'
)

/* Norwegen (26.10.2026, Big-Mac-Index): das skandinavische Kreuz, rot mit weiß-blauem Kreuz. */
const FLAGGE_NORWEGEN = quadrat(
  '<rect width="60" height="60" fill="#BA0C2F"/>' +
    '<rect x="16" width="14" height="60" fill="#fff"/><rect y="23" width="60" height="14" fill="#fff"/>' +
    '<rect x="20" width="6" height="60" fill="#00205B"/><rect y="27" width="60" height="6" fill="#00205B"/>'
)

const WAPPEN_SLOWAKEI =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 24">' +
  '<path d="M1 1H19V12C19 18 14 21 10 23C6 21 1 18 1 12Z" fill="#fff"/>' +
  '<path d="M2.5 2.5H17.5V12C17.5 17 13.5 19.7 10 21.3C6.5 19.7 2.5 17 2.5 12Z" fill="#EE1C25"/>' +
  '<rect x="9" y="4.5" width="2" height="11.5" fill="#fff"/>' +
  '<rect x="6.5" y="7" width="7" height="1.7" fill="#fff"/>' +
  '<rect x="5" y="10.5" width="10" height="1.9" fill="#fff"/>' +
  '<path d="M3.5 16C5 14.5 7 14.5 8 15.5C9 14 11 14 12 15.5C13 14.5 15 14.5 16.5 16L16 17.5C14.5 19.5 12 20.5 10 21.3C8 20.5 5.5 19.5 4 17.5Z" fill="#0B4EA2"/>' +
  '</svg>'

export const FLAGGEN: Record<string, Flagge> = {
  AUT: { streifen: ['#ED2939', '#FFFFFF', '#ED2939'] },
  /* Keine Länder: Rohstoffe und Bitcoin als Zeichen im Kreis (19.10.2026). */
  OEL: { streifen: ['#1b1b1b'], svg: SYMBOL_OEL },
  GOLD: { streifen: ['#C9A227'], kuerzel: 'Au', kuerzelFarbe: '#FFFFFF' },
  SILBER: { streifen: ['#A7A9AC'], kuerzel: 'Ag', kuerzelFarbe: '#FFFFFF' },
  BTC: { streifen: ['#F7931A'], kuerzel: 'BTC', kuerzelFarbe: '#FFFFFF' },
  CHE: { streifen: ['#DA291C'], svg: FLAGGE_SCHWEIZ },
  BEL: { streifen: ['#000000', '#FAE042', '#ED2939'], senkrecht: true },
  CHN: { streifen: ['#EE1C25'], svg: FLAGGE_CHINA },
  DEU: { streifen: ['#000000', '#DD0000', '#FFCE00'] },
  ESP: { streifen: ['#AA151B', '#F1BF00', '#AA151B'], gewichte: [1, 2, 1] },
  EU27: { streifen: ['#003399'], kuerzel: 'EU' },
  WELT: { streifen: ['#555555'], kuerzel: 'Ø', kuerzelFarbe: '#FFFFFF' },
  FRA: { streifen: ['#002395', '#FFFFFF', '#ED2939'], senkrecht: true },
  HUN: { streifen: ['#CE2939', '#FFFFFF', '#477050'] },
  /* Großbritannien: das Kreuz des Union Jack, ohne die Diagonalen der Einzelflaggen. */
  GBR: { streifen: ['#012169'], svg: FLAGGE_GROSSBRITANNIEN },
  IND: { streifen: ['#FF9933'], svg: FLAGGE_INDIEN },
  IRL: { streifen: ['#169B62', '#FFFFFF', '#FF883E'], senkrecht: true },
  ISR: { streifen: ['#FFFFFF'], svg: FLAGGE_ISRAEL },
  ITA: { streifen: ['#009246', '#FFFFFF', '#CE2B37'], senkrecht: true },
  JPN: { streifen: ['#FFFFFF'], svg: FLAGGE_JAPAN },
  KOR: { streifen: ['#FFFFFF'], svg: FLAGGE_SUEDKOREA },
  LUX: { streifen: ['#EF3340', '#FFFFFF', '#00A3E0'] },
  LVA: { streifen: ['#9E3039', '#FFFFFF', '#9E3039'], gewichte: [2, 1, 2] },
  LIE: { streifen: ['#002B7F'], svg: FLAGGE_LIECHTENSTEIN },
  NLD: { streifen: ['#AE1C28', '#FFFFFF', '#21468B'] },
  NOR: { streifen: ['#BA0C2F'], svg: FLAGGE_NORWEGEN },
  POL: { streifen: ['#FFFFFF', '#DC143C'] },
  ROU: { streifen: ['#002B7F', '#FCD116', '#CE1126'], senkrecht: true },
  SAU: { streifen: ['#006C35'], svg: FLAGGE_SAUDI },
  SVK: { streifen: ['#FFFFFF', '#0B4EA2', '#EE1C25'], wappen: WAPPEN_SLOWAKEI },
  /* Tschad: Streifen wie Rumänien, im Blau dunkler – so ist die Flagge. */
  TCD: { streifen: ['#002664', '#FECB00', '#C60C30'], senkrecht: true },
  TUR: { streifen: ['#E30A17'], svg: FLAGGE_TUERKEI },
  USA: { streifen: ['#B22234'], svg: FLAGGE_USA },
  VEN: { streifen: ['#FFCC00'], svg: FLAGGE_VENEZUELA },
}

const SCHWARZ = '#000000'
/*
  Die Akzentfarbe wechselt täglich durch die vier Farben des Logos – der
  Betreiber am 17.10.2026: „die Schriftfarben der Beiträge nicht nur grün,
  sondern abwechselnd mit den Farben aus dem Logo. Anthrazit, Navyblau und
  Rot … die gleichen Farbtöne." Die Werte stehen so in `public/logo.svg`;
  der Test vergleicht sie. Reihenfolge ab dem 17.10.2026 (grün): Grün,
  Navy, Rot, Anthrazit, dann wieder Grün.
*/
export const LOGOFARBEN = ['#205437', '#17296F', '#8B2225', '#6E6E6E'] as const
const FARBE_AB = Date.UTC(2026, 9, 17)

/** Die Akzentfarbe einer Karte – aus ihrem Datum, also stabil bei jedem Neubau. */
export function akzentfarbe(datum: string): string {
  const tage = Math.round((Date.parse(`${datum}T00:00:00Z`) - FARBE_AB) / 86_400_000)
  return LOGOFARBEN[((tage % 4) + 4) % 4]
}

/** Dieselbe Farbe, stark aufgehellt – der Grund der hervorgehobenen Zeile. */
function hell(farbe: string): string {
  const kanal = (i: number) =>
    Math.round(parseInt(farbe.slice(i, i + 2), 16) * 0.13 + 255 * 0.87)
      .toString(16)
      .padStart(2, '0')
  return `#${kanal(1)}${kanal(3)}${kanal(5)}`
}
const ROT = '#8e1b1b'
const GRAU = '#222222'
const MITTELGRAU = '#555555'
const LEER = '#dcdcdc'

/*
  Die Schriften der Vorlage: Anton für die Überschrift, Open Sans für alles
  andere – Wortmarke, Werte, Beschriftung, Fußzeile. Bis zum 15.10.2026 stand
  hier Noto Sans; der Betreiber: „die Schrift von IM Invests passt so noch
  nicht, das ist nicht wie in der Vorgabe". Gegen den Beitrag vom 12.10.
  gestellt kam Open Sans am nächsten (verglichen mit Montserrat, Inter,
  Albert Sans, Figtree).

  Die Vorlage ist in Canva gesetzt, in Canva Sans – und die verlangt der
  Betreiber seit dem 16.10.2026 für alle kleineren Texte. Sie ist eine
  Hausschrift von Canva und darf außerhalb von Canva nicht verwendet werden;
  Open Sans ist die Ersatzschrift, dieselbe wie in den Tageskacheln
  (`lib/instagram-bild.ts`).
*/
const ORDNER = join(process.cwd(), 'lib/instagram/schriften')
type Schrift = {
  name: string
  data: Buffer
  weight: 400 | 700 | 800
  style: 'normal' | 'italic'
}
let schriftVorrat: Schrift[] | null = null
function schriften() {
  schriftVorrat ??= [
    {
      name: 'Anton',
      data: readFileSync(join(ORDNER, 'anton-400.woff')),
      weight: 400,
      style: 'normal',
    },
    {
      name: 'Open',
      data: readFileSync(join(ORDNER, 'open-sans-400.woff')),
      weight: 400,
      style: 'normal',
    },
    {
      name: 'Open',
      data: readFileSync(join(ORDNER, 'open-sans-700.woff')),
      weight: 700,
      style: 'normal',
    },
    {
      name: 'Open',
      data: readFileSync(join(ORDNER, 'open-sans-800-kursiv.woff')),
      weight: 800,
      style: 'italic',
    },
    ...([400, 700, 800] as const).map((weight) => ({
      name: 'Montserrat',
      data: readFileSync(join(ORDNER, `montserrat-${weight}.woff`)),
      weight,
      style: 'normal' as const,
    })),
  ]
  return schriftVorrat
}

/*
  Die Geometrie, gemessen am ersten Entwurf (15.10.2026): Im zweiten Anlauf
  stieß die Beschriftung des höheren Balkens an die Überschrift – 6,2 px je
  Prozentpunkt waren zu viel. Jetzt wird der höhere Balken auf 400 px
  gesetzt, der andere im Verhältnis; das gilt für jede Größenordnung.
*/
const BODEN = 1030
const HOECHSTER = 400
const BALKEN = 200
const LUECKE = 200
const XL = (ZK_BREITE - (2 * BALKEN + LUECKE)) / 2 - 2
const XR = XL + BALKEN + LUECKE

/*
  Die Rangliste: Überschrift in 104 statt 112 px, damit drei Zeilen Anton
  und die Unterzeile über der ersten Zeile enden (Entwurf vom 15.10.2026).
  Elf Zeilen zu 62 px enden bei 1242 – über der Fußlinie bei 1276.
*/
const RL_TITEL = 104
/** Drei Zeilen Open Sans 25 px zwischen Überschrift und Unterzeile. */
export const ERKLAERUNG_MAX = 210
const RL_UNTERZEILE = 478
const RL_OBEN = 560
const RL_ZEILE = 62
/*
  Weniger als elf Zeilen verteilen sich auf dieselbe Höhe, bis 84 px je
  Zeile – sieben zu 62 px ließen unten ein Viertel der Karte leer
  (Entwurf vom 17.10.2026). Elf bleiben bei 62.
*/
export const RL_ZEILEN_MAX = 11
const RL_UNTEN = RL_OBEN + RL_ZEILEN_MAX * RL_ZEILE
const zeilenhoehe = (n: number) => Math.min(84, Math.floor((RL_UNTEN - RL_OBEN) / n))
const HAUS = 38
const HAUS_ABSTAND = 7
/*
  Die Balken beginnen, wo die Häuschen beginnen: Zeile ab 40, Rand 3,
  Innenabstand 18, Flagge 46, Abstand 16, Name 250. Der längste ist 430 px
  lang – Platz für „308,7 %" rechts daneben.
*/
const RL_BALKEN_X = 40 + 3 + 18 + 46 + 16 + 250
const RL_BALKEN = 430

/** Was jede Karte im Hausstil einhalten muss (`INSTAGRAM-STIL.md`). */
function stilBefunde(
  k:
    | Kurvenkarte
    | Saeulenkarte
    | Zeitstrahlkarte
    | Balkenkarte
    | Vielfachkarte
    | Kammerkarte
    | Personenkarte
): string[] {
  const f: string[] = []
  if (k.stichzeile.length > 40)
    f.push(`Stichzeile hat ${k.stichzeile.length} Zeichen – höchstens 40.`)
  if (k.erklaerung.length > ERKLAERUNG_MAX)
    f.push(`Erklärung hat ${k.erklaerung.length} Zeichen – höchstens ${ERKLAERUNG_MAX}.`)
  if (k.titel.length > 2 || k.titel.some((t) => t.text.length > 22))
    f.push('Der Titel hat höchstens zwei Stücke zu je 22 Zeichen – eine Zeile je Stück.')
  return f
}

/** Was an einer Karte nicht stimmt – leer heißt: in Ordnung. */
export function pruefeZahlenkarte(k: Zahlenkarte): string[] {
  const f: string[] = []
  if (!/^\d{4}-\d{2}-\d{2}$/.test(k.datum))
    f.push(`datum „${k.datum}" ist kein JJJJ-MM-TT.`)
  if (k.freigabe !== undefined && k.freigabe !== k.datum)
    f.push(
      `freigabe „${k.freigabe}" – freigegeben wird die Karte für ihren Tag (${k.datum}).`
    )
  if (
    k.art !== 'raetsel' &&
    k.art !== 'mythos' &&
    !k.titel.some((t) => t.gruen || t.richtung)
  )
    f.push('Die Überschrift braucht eine Pointe in der Akzentfarbe (`gruen`).')
  /*
    Meta nimmt höchstens 2.200 Zeichen. Am 30.10.2026 waren es mit
    Rechtshinweis und Schlagworten 2.225 – „The caption was too long" um
    15 Uhr, bei freigegebener Karte. Jetzt meldet es der Test vorher.
  */
  const laenge = beschriftungZahlenkarte(k).length
  if (laenge > BESCHRIFTUNG_GRENZE)
    f.push(
      `Beschriftung hat ${laenge} Zeichen mit Rechtshinweis – höchstens ${BESCHRIFTUNG_GRENZE} (Meta: 2.200).`
    )
  const zeichen = k.titel.map((t) => t.text).join(' ').length
  if (zeichen > 48)
    f.push(`Überschrift hat ${zeichen} Zeichen – mehr als drei Zeilen Anton.`)
  if (k.art === 'zahlenstrahl') f.push(...pruefeZahlenstrahl(k))
  else if (k.art === 'raetsel') f.push(...pruefeRaetsel(k))
  else if (k.art === 'mythos') f.push(...pruefeMythos(k))
  else if (k.art === 'rangliste') f.push(...pruefeRangliste(k))
  else if (k.art === 'torte') {
    if (k.stuecke.length < 2 || k.stuecke.length > 5)
      f.push(`${k.stuecke.length} Stücke – die Torte trägt zwei bis fünf.`)
    for (const [i, st] of k.stuecke.entries()) {
      if (!(st.wert > 0))
        f.push(`${st.name}: ${st.wert} – ein Stück braucht einen Wert über null.`)
      if (i > 0 && st.wert > k.stuecke[i - 1].wert)
        f.push(
          `${st.name} steht unter ${k.stuecke[i - 1].name}, ist aber größer – absteigend.`
        )
      if (st.logo !== undefined && !existsSync(join(LOGO_ORDNER, st.logo)))
        f.push(`Logo „${st.logo}" fehlt in lib/instagram/logos/.`)
    }
    if (k.infos && (k.infos.length < 2 || k.infos.length > 3))
      f.push(`${k.infos.length} Eckdaten – zwei oder drei.`)
    if (k.infos && k.hinweis) f.push('Eckdaten oder Hinweis, nicht beides.')
    if (k.erklaerung.length > ERKLAERUNG_MAX)
      f.push(
        `Erklärung hat ${k.erklaerung.length} Zeichen – höchstens ${ERKLAERUNG_MAX}.`
      )
    if (zeichen > 38)
      f.push(
        `Mit Erklärung höchstens 38 Zeichen Überschrift (zwei Zeilen) – sind ${zeichen}.`
      )
  } else if (k.art === 'kurven') {
    if (k.linien.length !== 2) f.push('Die Kurvenkarte hat genau zwei Linien.')
    else if (k.linien[0].punkte.length !== k.linien[1].punkte.length)
      f.push('Beide Linien brauchen gleich viele Punkte.')
    if (k.linien.some((l) => l.punkte.length < 2))
      f.push('Eine Linie braucht zwei Punkte.')
    for (const a of k.achse)
      if (a.bei < 0 || a.bei >= (k.linien[0]?.punkte.length ?? 0))
        f.push(`Achse „${a.text}": Stelle ${a.bei} liegt außerhalb der Linie.`)
    if (k.kennzahlen.length !== k.linien.length)
      f.push(`${k.kennzahlen.length} Kennzahlen – je Linie genau eine.`)
    f.push(...stilBefunde(k))
  } else if (k.art === 'saeulen') {
    if (k.helden.length < 1 || k.helden.length > 3)
      f.push(`${k.helden.length} Heldenzahlen – eine bis drei.`)
    if (k.saeulen.length < 3 || k.saeulen.length > 12)
      f.push(`${k.saeulen.length} Säulen – drei bis zwölf.`)
    for (const z of k.saeulen)
      if (z.bild !== undefined && !existsSync(join(FOTO_ORDNER, z.bild)))
        f.push(`Foto „${z.bild}" fehlt in lib/instagram/fotos/.`)
    for (const z of k.saeulen)
      if (z.symbol !== undefined && !existsSync(join(SYMBOL_ORDNER, z.symbol)))
        f.push(`Symbol „${z.symbol}" fehlt in lib/instagram/symbole/.`)
    if (k.saeulen.some((z) => z.symbol) && k.saeulen.some((z) => z.bild))
      f.push('Symbole und Porträts zugleich – eins von beiden.')
    f.push(...stilBefunde(k))
  } else if (k.art === 'personen') {
    if (k.personen.length < 2 || k.personen.length > 4)
      f.push(`${k.personen.length} Personen – zwei bis vier.`)
    for (const pe of k.personen)
      if (pe.bild !== undefined && !existsSync(join(FOTO_ORDNER, pe.bild)))
        f.push(`Foto „${pe.bild}" fehlt in lib/instagram/fotos/.`)
    f.push(...stilBefunde(k))
  } else if (k.art === 'kammern') {
    for (const ka of k.kammern) {
      const summe = ka.teile.reduce((a, t) => a + t.wert, 0)
      if (summe !== ka.gesamt)
        f.push(`${ka.name}: Teile ergeben ${summe}, nicht ${ka.gesamt}.`)
    }
    f.push(...stilBefunde(k))
  } else if (k.art === 'vielfach') {
    if (k.helden.length < 1 || k.helden.length > 2)
      f.push(`${k.helden.length} Heldenzahlen – eine oder zwei.`)
    if (k.teile.length < 3 || k.teile.length > 9)
      f.push(`${k.teile.length} kleine Kurven – drei bis neun.`)
    if (k.teile.some((t) => t.punkte.length !== k.gesamt.punkte.length))
      f.push('Alle Reihen müssen gleich viele Punkte haben wie die Gesamtkurve.')
    f.push(...stilBefunde(k))
  } else if (k.art === 'balken') {
    if (k.helden.length < 1 || k.helden.length > 2)
      f.push(`${k.helden.length} Heldenzahlen – eine oder zwei.`)
    if (k.balken.length < 3 || k.balken.length > 8)
      f.push(`${k.balken.length} Balken – drei bis acht.`)
    for (const b of k.balken)
      if (b.text.length > 22)
        f.push(`„${b.text}" hat ${b.text.length} Zeichen – höchstens 22 neben dem Jahr.`)
    if (k.balken.filter((b) => b.hervor).length > 1)
      f.push('Höchstens ein Balken hervorgehoben.')
    f.push(...stilBefunde(k))
  } else if (k.art === 'zeitstrahl') {
    if (k.helden.length < 1 || k.helden.length > 2)
      f.push(`${k.helden.length} Heldenzahlen – eine oder zwei.`)
    if (k.balken.length < 2 || k.balken.length > 6)
      f.push(`${k.balken.length} Balken – zwei bis sechs.`)
    if (k.balken.filter((b) => b.hervor).length > 1)
      f.push('Höchstens ein Balken hervorgehoben.')
    for (const b of k.balken) {
      if (!(b.beginn < b.ende)) f.push(`${b.name}: Beginn nicht vor Ende.`)
      if (b.regelEnde !== undefined && !(b.ende < b.regelEnde))
        f.push(`${b.name}: regelEnde nicht nach Ende.`)
      if (b.bild !== undefined && !existsSync(join(FOTO_ORDNER, b.bild)))
        f.push(`Foto „${b.bild}" fehlt in lib/instagram/fotos/.`)
    }
    f.push(...stilBefunde(k))
  } else if (k.art === 'pyramide') {
    if (k.stufen.length < 3 || k.stufen.length > 5)
      f.push(`${k.stufen.length} Stufen – die Pyramide trägt drei bis fünf.`)
    if (k.erklaerung.length > ERKLAERUNG_MAX)
      f.push(
        `Erklärung hat ${k.erklaerung.length} Zeichen – höchstens ${ERKLAERUNG_MAX}.`
      )
    if (zeichen > 38)
      f.push(
        `Mit Erklärung höchstens 38 Zeichen Überschrift (zwei Zeilen) – sind ${zeichen}.`
      )
    if (k.logo !== undefined && !existsSync(join(LOGO_ORDNER, k.logo)))
      f.push(`Logo „${k.logo}" fehlt in lib/instagram/logos/.`)
    for (const st of k.stufen)
      if (!st.zahl.trim() || !st.text.trim()) f.push('Eine Stufe ohne Zahl oder Text.')
  } else if (k.art === 'geschichte') {
    if (k.punkte.length < 10) f.push('Eine Geschichte braucht mindestens zehn Kurse.')
    if (k.marken.length < 2 || k.marken.length > 6)
      f.push(`${k.marken.length} Meilensteine – zwei bis sechs.`)
    for (const [i, p] of k.punkte.entries()) {
      if (!(p.wert > 0))
        f.push(`${p.t}: Kurs ${p.wert} – auf der Log-Achse nur über null.`)
      if (i > 0 && p.t <= k.punkte[i - 1].t)
        f.push(`${p.t}: Kurse alt nach neu, ohne Doppel.`)
    }
    if (k.erklaerung.length > ERKLAERUNG_MAX)
      f.push(
        `Erklärung hat ${k.erklaerung.length} Zeichen – höchstens ${ERKLAERUNG_MAX}.`
      )
    if (zeichen > 38)
      f.push(
        `Mit Erklärung höchstens 38 Zeichen Überschrift (zwei Zeilen) – sind ${zeichen}.`
      )
    if (k.foto !== undefined && !existsSync(join(FOTO_ORDNER, k.foto)))
      f.push(`Foto „${k.foto}" fehlt in lib/instagram/fotos/.`)
  } else if (k.art === 'steckbrief') {
    if (k.fakten.length < 4 || k.fakten.length > 6)
      f.push(`${k.fakten.length} Kennzahlen – der Steckbrief trägt vier bis sechs.`)
    if (!existsSync(join(LOGO_ORDNER, k.logo)))
      f.push(`Logo „${k.logo}" fehlt in lib/instagram/logos/.`)
    if (k.foto !== undefined && !existsSync(join(FOTO_ORDNER, k.foto)))
      f.push(`Foto „${k.foto}" fehlt in lib/instagram/fotos/.`)
    if (k.erklaerung.length > ERKLAERUNG_MAX)
      f.push(
        `Erklärung hat ${k.erklaerung.length} Zeichen – höchstens ${ERKLAERUNG_MAX}.`
      )
    if (zeichen > 38)
      f.push(
        `Mit Erklärung höchstens 38 Zeichen Überschrift (zwei Zeilen) – sind ${zeichen}.`
      )
    for (const x of k.fakten)
      if (!x.name.trim() || !x.wert.trim()) f.push('Eine Kennzahl ohne Namen oder Wert.')
  } else if (k.art === 'duell') {
    for (const sei of [k.links, k.rechts]) {
      if (sei.punkte.length < 3) f.push(`${sei.name}: zu wenige Kurse.`)
      if (sei.land && !FLAGGEN[sei.land])
        f.push(`${sei.name}: keine Flagge für „${sei.land}".`)
    }
  } else if (k.art === 'verlauf') {
    if (k.reihen.length < 2 || k.reihen.length > 3)
      f.push('Ein Verlauf trägt zwei oder drei Linien.')
    if (k.reihen.filter((r) => r.akzent).length !== 1)
      f.push('Genau eine Linie in der Akzentfarbe.')
    for (const r of k.reihen)
      if (r.land && !FLAGGEN[r.land]) f.push(`${r.name}: keine Flagge für „${r.land}".`)
  } else
    for (const s of [k.links, k.rechts]) {
      if (!(s.wert > 0)) f.push(`${s.name}: Wert muss größer als null sein.`)
      if (s.land && !FLAGGEN[s.land]) f.push(`${s.name}: keine Flagge für „${s.land}".`)
      if (s.flagge && s.flagge.length < 2)
        f.push(`${s.name}: eine Flagge braucht mindestens zwei Streifen.`)
    }
  if (!/Quelle/.test(k.fusszeile)) f.push('Die Fußzeile nennt keine Quelle.')
  if (!/^Stand: /.test(k.fusszeile)) f.push('Die Fußzeile beginnt nicht mit „Stand: ".')
  if (!/\nQuellen?: /.test(k.text)) f.push('Der Text endet ohne Zeile „Quellen: …".')
  if (k.schlagworte.length !== 5)
    f.push(`${k.schlagworte.length} Schlagworte, genau fünf.`)
  for (const w of k.schlagworte)
    if (!/^[a-zäöüß0-9]{2,30}$/.test(w))
      f.push(`Schlagwort „${w}" – klein, ohne # und Leerzeichen.`)
  return f
}

function pruefeRangliste(k: Rangkarte): string[] {
  const f: string[] = []
  const n = k.zeilen.length
  /* Kacheln stehen in zwei Spalten – zwölf sind sechs Reihen. */
  const hoechstens = k.skala === 'kacheln' ? 12 : RL_ZEILEN_MAX
  if (n < 4 || n > hoechstens)
    f.push(`${n} Zeilen – die Rangliste trägt vier bis ${hoechstens}.`)
  if (k.zeilen.filter((z) => z.hervor).length !== 1)
    f.push('Die Rangliste braucht genau eine hervorgehobene Zeile.')
  if (k.zeilen.filter((z) => z.schnitt).length > 1) f.push('Höchstens ein Schnitt.')
  if (!k.unterzeile.trim()) f.push('Die Unterzeile fehlt.')
  if (k.erklaerung !== undefined) {
    if (k.erklaerung.length > ERKLAERUNG_MAX)
      f.push(
        `Erklärung hat ${k.erklaerung.length} Zeichen – höchstens ${ERKLAERUNG_MAX}, drei Zeilen.`
      )
    const titel = k.titel.map((t) => t.text).join(' ').length
    if (titel > 38)
      f.push(
        `Mit Erklärung höchstens 38 Zeichen Überschrift (zwei Zeilen) – sind ${titel}.`
      )
  }
  if (k.skala === 'burger' && k.zeilen.some((z) => z.wert > 10))
    f.push('Ein Burger je Einheit, höchstens zehn – größere Werte mit Balken.')
  if (k.einheit !== undefined && (k.skala ?? 'haeuser') === 'haeuser')
    f.push(
      "Eine andere Einheit als Prozent nur mit skala: 'balken' – Häuschen zählen Prozent."
    )
  for (const [i, z] of k.zeilen.entries()) {
    if (!(z.wert > 0) && !(k.skala === 'balken' && z.wert < 0))
      f.push(
        `${z.name}: ${z.wert} – der Wert muss größer als null sein (negativ nur mit Balken).`
      )
    else if ((k.skala ?? 'haeuser') === 'haeuser' && z.wert > 100)
      f.push(
        `${z.name}: ${z.wert} – ein Häuschen je zehn Prozent, also 0 bis 100; darüber skala: 'balken'.`
      )
    if (!FLAGGEN[z.land]) f.push(`${z.name}: keine Flagge für „${z.land}" in FLAGGEN.`)
    if (z.logo !== undefined && k.skala !== 'kacheln')
      f.push(`${z.name}: Logos gibt es nur in Kacheln.`)
    if (z.logo !== undefined && !existsSync(join(LOGO_ORDNER, z.logo)))
      f.push(`${z.name}: Logo „${z.logo}" fehlt in lib/instagram/logos/.`)
    /* Eine Zeitleiste steht in der Reihenfolge der Zeit, nicht der Größe. */
    if (k.skala !== 'zeitleiste' && i > 0 && z.wert > k.zeilen[i - 1].wert)
      f.push(`${z.name} steht unter ${k.zeilen[i - 1].name}, hat aber mehr – absteigend.`)
  }
  return f
}

/** Etwas Luft unter Metas 2.200 – Emoji zählen dort teils doppelt. */
export const BESCHRIFTUNG_GRENZE = 2150

/** Die Beschriftung, wie sie hinausgeht: Text, Rechtshinweis, Schlagworte. */
export function beschriftungZahlenkarte(k: Zahlenkarte): string {
  return `${k.text.trim()}\n\n${RECHTSHINWEIS} ${k.schlagworte.map((w) => `#${w}`).join(' ')}`
}

const svgAdresse = (svg: string) =>
  `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`

const flagge = (fl: Flagge, groesse: number, rand: number) =>
  h(
    'div',
    {
      style: {
        position: 'relative',
        width: groesse,
        height: groesse,
        borderRadius: groesse / 2,
        border: `${rand}px solid #000`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: fl.senkrecht ? 'row' : 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: fl.streifen[0],
      },
    },
    ...(fl.svg
      ? [h('img', { src: svgAdresse(fl.svg), width: groesse, height: groesse })]
      : fl.kuerzel
        ? [
            h(
              'div',
              {
                style: {
                  fontFamily: 'Open',
                  fontWeight: 700,
                  fontSize: Math.round(groesse * (fl.kuerzel.length === 1 ? 0.6 : 0.35)),
                  color: fl.kuerzelFarbe ?? '#FFCC00',
                },
              },
              fl.kuerzel
            ),
          ]
        : [
            ...fl.streifen.map((farbe, i) =>
              h('div', {
                style: {
                  flex: fl.gewichte?.[i] ?? 1,
                  alignSelf: 'stretch',
                  backgroundColor: farbe,
                },
              })
            ),
            ...(fl.wappen
              ? [
                  h('img', {
                    src: svgAdresse(fl.wappen),
                    width: groesse * 0.43,
                    height: groesse * 0.52,
                    style: {
                      position: 'absolute',
                      left: groesse * 0.15,
                      top: groesse * 0.2,
                    },
                  }),
                ]
              : []),
          ])
  )

/*
  Ein Burger (26.10.2026, Big-Mac-Index – Betreiber: „werde mal ein bisschen
  kreativer"): Brötchen oben, Salat, Fleisch, Brötchen unten, in einer Farbe.
*/
const burger = (farbe: string) =>
  svgAdresse(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">' +
      `<path d="M4 17 C4 7 36 7 36 17 Z" fill="${farbe}"/>` +
      `<path d="M3 20 L37 20 L34 23 L29 20.5 L24 23 L19 20.5 L14 23 L9 20.5 L5 23 Z" fill="${farbe}" opacity="0.55"/>` +
      `<rect x="4" y="24" width="32" height="6" rx="3" fill="${farbe}"/>` +
      `<path d="M5 32 L35 32 C35 36 33 37 30 37 L10 37 C7 37 5 36 5 32 Z" fill="${farbe}"/></svg>`
  )

const haus = (farbe: string) =>
  svgAdresse(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">' +
      `<path d="M20 3 L38 19 L33 19 L33 37 L7 37 L7 19 L2 19 Z" fill="${farbe}"/></svg>`
  )

/* Deutsch gesetzt, mit Tausenderpunkt – „812.822" für das Vermögen. */
const zahl = (w: number, stellen = 1) =>
  w.toLocaleString('de-DE', {
    minimumFractionDigits: stellen,
    maximumFractionDigits: stellen,
  })

/*
  Der Kopf, nachgemessen am Beitrag vom 12.10.2026 (auf 1080 px gerechnet):
  Signet 46 px ab Zeile 24, Wortmarke mit 19 px Versalhöhe – Open Sans 27 px,
  schwarz – 11 px daneben. Das Signet dort trägt kein „IMI" in der Mitte.
*/
const KOPF_OBEN = 24
const KOPF_LOGO = 46

/**
 * Das Signet ohne den Schriftzug „IMI" in der Mitte – wie im Vorbild.
 * `public/logo.svg` führt ihn als letzte Fläche (grau); fehlt sie dort oder
 * steht sie anders, bleibt das Logo unverändert, statt eine Figur zu verlieren.
 */
export function signetOhneMitte(svg: string): string {
  const letzte = svg.lastIndexOf('<path')
  const ende = svg.indexOf('/>', letzte)
  if (letzte < 0 || ende < 0) return svg
  const flaeche = svg.slice(letzte, ende + 2)
  if (!flaeche.includes('fill="#6E6E6E"') || !/^\s*<\/svg>\s*$/.test(svg.slice(ende + 2)))
    return svg
  return svg.slice(0, letzte) + svg.slice(ende + 2)
}

/** Setzt die Karte; zurück kommt PNG – das JPEG macht der Aufrufer. */
export async function zahlenkartePng(k: Zahlenkarte, logoSvg: string): Promise<Buffer> {
  if (k.art === 'zahlenstrahl' || k.art === 'raetsel' || k.art === 'mythos')
    return zahlenkarteSeitePng(k, logoSvg, 1)
  const logo = svgAdresse(signetOhneMitte(logoSvg))
  if (
    k.art === 'kurven' ||
    k.art === 'saeulen' ||
    k.art === 'zeitstrahl' ||
    k.art === 'balken' ||
    k.art === 'vielfach' ||
    k.art === 'kammern' ||
    k.art === 'personen'
  ) {
    const bild =
      k.art === 'kurven'
        ? kurvenBild(k, logo)
        : k.art === 'saeulen'
          ? stilBild(k, logo, k.helden, saeulenGrafik(k))
          : k.art === 'personen'
            ? stilBild(k, logo, [], personenGrafik(k))
            : k.art === 'kammern'
              ? stilBild(k, logo, k.helden, kammerGrafik(k))
              : k.art === 'vielfach'
                ? stilBild(k, logo, k.helden, vielfachGrafik(k))
                : k.art === 'balken'
                  ? stilBild(k, logo, k.helden, balkenGrafik(k))
                  : stilBild(k, logo, k.helden, zeitstrahlGrafik(k))
    const antwort = new ImageResponse(bild, {
      width: ZK_BREITE,
      height: ZK_HOEHE,
      fonts: schriften(),
    })
    return Buffer.from(await antwort.arrayBuffer())
  }
  const rangliste = k.art !== undefined && k.art !== 'vergleich'
  const grafik =
    k.art === 'verlauf'
      ? await verlaufGrafik(k)
      : k.art === 'duell'
        ? duellGrafik(k)
        : k.art === 'steckbrief'
          ? steckbriefGrafik(k)
          : k.art === 'geschichte'
            ? geschichtsGrafik(k)
            : k.art === 'pyramide'
              ? pyramidenGrafik(k)
              : k.art === 'torte'
                ? tortenGrafik(k)
                : k.art === 'rangliste'
                  ? ranglistenGrafik(k)
                  : vergleichsGrafik(k)
  const bild = h(
    'div',
    {
      style: {
        width: ZK_BREITE,
        height: ZK_HOEHE,
        display: 'flex',
        position: 'relative',
        backgroundColor: '#ffffff',
      },
    },
    h(
      'div',
      {
        style: {
          position: 'absolute',
          top: KOPF_OBEN,
          left: 0,
          width: ZK_BREITE,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
      },
      h('img', { src: logo, width: KOPF_LOGO, height: KOPF_LOGO }),
      h(
        'div',
        { style: { fontFamily: 'Open', fontSize: 27, color: SCHWARZ, marginLeft: 11 } },
        'IM Invests'
      )
    ),
    h(
      'div',
      {
        style: {
          position: 'absolute',
          top: 120,
          left: 60,
          right: 60,
          display: 'flex',
          flexWrap: 'wrap',
          fontFamily: 'Anton',
          fontSize: rangliste ? RL_TITEL : 112,
          lineHeight: rangliste ? 1.1 : 1.12,
        },
      },
      ...k.titel.flatMap((stueck) =>
        stueck.text
          .split(' ')
          .filter(Boolean)
          .map((wort) =>
            h(
              'span',
              {
                style: {
                  color:
                    stueck.richtung === 'steigt'
                      ? LOGO_GRUEN
                      : stueck.richtung === 'faellt'
                        ? LOGO_ROT
                        : stueck.gruen
                          ? akzentfarbe(k.datum)
                          : SCHWARZ,
                  marginRight: rangliste ? 24 : 26,
                },
              },
              wort
            )
          )
      )
    ),
    ...((k.art === 'rangliste' ||
      k.art === 'steckbrief' ||
      k.art === 'geschichte' ||
      k.art === 'pyramide' ||
      k.art === 'torte') &&
    k.erklaerung
      ? [
          h(
            'div',
            {
              style: {
                position: 'absolute',
                top: 362,
                left: 60,
                right: 60,
                display: 'flex',
                fontFamily: 'Open',
                fontSize: 25,
                lineHeight: 1.3,
                color: GRAU,
              },
            },
            k.erklaerung
          ),
        ]
      : []),
    ...grafik,
    h('div', {
      style: {
        position: 'absolute',
        left: 40,
        right: 40,
        top: ZK_HOEHE - 74,
        height: 2,
        backgroundColor: '#333',
      },
    }),
    h(
      'div',
      {
        style: {
          position: 'absolute',
          left: 44,
          top: ZK_HOEHE - 62,
          fontFamily: 'Open',
          fontSize: 22,
          color: GRAU,
        },
      },
      k.fusszeile
    )
  )

  const antwort = new ImageResponse(bild, {
    width: ZK_BREITE,
    height: ZK_HOEHE,
    fonts: schriften(),
  })
  return Buffer.from(await antwort.arrayBuffer())
}

function vergleichsGrafik(k: Vergleichskarte) {
  const mass = HOECHSTER / Math.max(k.links.wert, k.rechts.wert)
  const hL = k.links.wert * mass
  const hR = k.rechts.wert * mass

  const wertKopf = (x: number, oben: number, s: Seite) =>
    h(
      'div',
      {
        style: {
          position: 'absolute',
          left: x - 40,
          top: oben - 128,
          width: BALKEN + 80,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        },
      },
      h(
        'div',
        {
          style: {
            fontFamily: 'Open',
            fontWeight: 800,
            fontStyle: 'italic',
            fontSize: 56,
            color: SCHWARZ,
            lineHeight: 1.1,
          },
        },
        s.anzeige
      ),
      h(
        'div',
        { style: { fontFamily: 'Open', fontWeight: 700, fontSize: 30, color: SCHWARZ } },
        s.zusatz
      )
    )
  const gestrichelt = (y: number) =>
    h('div', {
      style: {
        position: 'absolute',
        left: XL + BALKEN,
        top: y,
        width: LUECKE,
        height: 0,
        borderTop: '4px dashed #000',
      },
    })

  return [
    h('div', {
      style: {
        position: 'absolute',
        left: XL,
        top: BODEN - hL,
        width: BALKEN,
        height: hL,
        backgroundColor: SCHWARZ,
      },
    }),
    h('div', {
      style: {
        position: 'absolute',
        left: XR,
        top: BODEN - hR,
        width: BALKEN,
        height: hR,
        backgroundColor: akzentfarbe(k.datum),
      },
    }),
    wertKopf(XL, BODEN - hL, k.links),
    wertKopf(XR, BODEN - hR, k.rechts),
    gestrichelt(BODEN - hR),
    gestrichelt(BODEN - hL),
    h(
      'div',
      {
        style: {
          position: 'absolute',
          left: XL + BALKEN,
          top: BODEN - (hR + hL) / 2 - 52,
          width: LUECKE,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        },
      },
      h(
        'div',
        { style: { fontFamily: 'Open', fontWeight: 700, fontSize: 46, color: ROT } },
        k.differenz.text
      ),
      h(
        'div',
        { style: { fontFamily: 'Open', fontWeight: 700, fontSize: 22, color: SCHWARZ } },
        k.differenz.zusatz
      )
    ),
    h('div', {
      style: {
        position: 'absolute',
        left: 50,
        right: 50,
        top: BODEN,
        height: 3,
        backgroundColor: '#555',
      },
    }),
    ...[
      { x: XL, s: k.links },
      { x: XR, s: k.rechts },
    ].map(({ x, s }) =>
      h(
        'div',
        {
          style: {
            position: 'absolute',
            left: x - 60,
            top: BODEN + 24,
            width: BALKEN + 120,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          },
        },
        h(
          'div',
          {
            style: {
              fontFamily: 'Open',
              fontWeight: 700,
              fontSize: 36,
              color: SCHWARZ,
              marginBottom: 18,
            },
          },
          s.name
        ),
        ...(s.land && FLAGGEN[s.land]
          ? [flagge(FLAGGEN[s.land], 86, 3)]
          : s.flagge
            ? [flagge({ streifen: s.flagge }, 86, 3)]
            : [])
      )
    ),
  ]
}

/**
 * Zehn Häuschen, das letzte anteilig – 47,2 % sind vier volle und eins zu 72 %.
 * Mit `symbol` und `je` dieselbe Reihe aus anderen Zeichen: zehn Burger, einer
 * je Euro (7,91 € sind sieben volle und einer zu 91 %).
 */
function haeuser(wert: number, farbe: string, symbol = haus, je = 10) {
  return h(
    'div',
    { style: { display: 'flex' } },
    ...Array.from({ length: 10 }, (_, i) => {
      const anteil = Math.max(0, Math.min(1, wert / je - i))
      return h(
        'div',
        {
          style: {
            position: 'relative',
            width: HAUS,
            height: HAUS,
            marginRight: HAUS_ABSTAND,
            display: 'flex',
          },
        },
        h('img', {
          src: symbol(LEER),
          width: HAUS,
          height: HAUS,
          style: { position: 'absolute', left: 0, top: 0 },
        }),
        ...(anteil > 0
          ? [
              h(
                'div',
                {
                  style: {
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: HAUS * anteil,
                    height: HAUS,
                    overflow: 'hidden',
                    display: 'flex',
                  },
                },
                h('img', { src: symbol(farbe), width: HAUS, height: HAUS })
              ),
            ]
          : [])
      )
    })
  )
}

/** Ein Balken, gemessen am größten Wert der Liste – mindestens ein Strich. */
/*
  Negative Werte (19.10.2026, „Öl schlägt alles"): Die Null steht dort, wo
  der kleinste Wert Platz lässt; Plus geht nach rechts, Minus nach links.
*/
function balken(wert: number, groesster: number, farbe: string, kleinster = 0) {
  const spanne = groesster - Math.min(kleinster, 0)
  const null_ = (RL_BALKEN * -Math.min(kleinster, 0)) / spanne
  const breite = Math.max(4, (RL_BALKEN * Math.abs(wert)) / spanne)
  return h(
    'div',
    { style: { display: 'flex', width: RL_BALKEN, height: 34 } },
    h('div', {
      style: {
        marginLeft: wert < 0 ? null_ - breite : null_,
        width: breite,
        height: 34,
        borderRadius: 4,
        backgroundColor: farbe,
      },
    })
  )
}

/*
  Die Kacheln (18.10.2026): Der Betreiber zur zweiten Balkenkarte in Folge:
  „gleiche Beitragsart vom Design her wie gestern … Das soll sich
  durchrotieren, genauso wie die Farben. Sonst wirkt das langweilig."
  Zwei Spalten, je Land eine Karte mit Flagge, Name und großer Zahl; die
  hervorgehobene ist in der Akzentfarbe gefüllt, der Schnitt gestrichelt.
*/
/*
  Karten mit Firmenlogo (28.10.2026, „mit logo vom unternehmen"): eine Liste
  statt Kacheln – das Logo links, die Zahl rechts, eine Haarlinie dazwischen.
  Der erste Entwurf setzte jedes Logo in ein weißes Feld auf einer grauen
  Kachel; der Betreiber: „gefällt mir irgendwie nicht so". Zwei Flächen
  ineinander sind ein Kasten im Kasten, und die Logos brauchen keinen –
  sie stehen auf dem Weiß der Karte.

  Die hervorgehobene Zeile trägt ihre Zahl in der Akzentfarbe und einen
  Strich in derselben Farbe links. Wer kein freies Logo hat, steht mit
  seinem Namen da, in der Schrift der Karte – kein nachgebautes Zeichen.
*/
function logoKachel(z: Rang, k: Rangkarte, i: number, m: { akzent: string }) {
  const oben = RL_OBEN - 30
  const zeile = Math.floor((LOGO_LISTE_UNTEN - oben) / k.zeilen.length)
  const logoHoehe = Math.min(76, zeile - 36)
  return h(
    'div',
    {
      style: {
        position: 'absolute',
        left: 60,
        right: 60,
        top: oben + i * zeile,
        height: zeile,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 22,
        borderLeft: `6px solid ${z.hervor ? m.akzent : 'transparent'}`,
        borderBottom: i < k.zeilen.length - 1 ? '2px solid #e6e7e9' : 'none',
      },
    },
    z.logo
      ? h('img', {
          src: logoAdresse(z.logo),
          width: 440,
          height: logoHoehe,
          style: { objectFit: 'contain', objectPosition: 'left center' },
        })
      : h(
          'div',
          {
            style: { fontFamily: 'Open', fontWeight: 800, fontSize: 38, color: SCHWARZ },
          },
          z.name
        ),
    h(
      'div',
      { style: { display: 'flex', alignItems: 'center' } },
      flagge(FLAGGEN[z.land] ?? { streifen: [LEER] }, 38, 2),
      h(
        'div',
        {
          style: {
            marginLeft: 16,
            fontFamily: 'Open',
            fontWeight: 800,
            fontSize: 50,
            color: z.hervor ? m.akzent : SCHWARZ,
          },
        },
        `${zahl(z.wert, k.stellen)}${k.einheit ?? ' %'}`
      )
    )
  )
}

/*
  Der Steckbrief: das Logo groß auf Weiß, darunter die Kennzahlen als
  Liste wie bei den Logokarten – Name links in Grau, Wert rechts fett,
  Haarlinien dazwischen. Die erste Kennzahl steht in der Akzentfarbe.
*/
function steckbriefGrafik(k: Steckbriefkarte) {
  if (k.foto) return steckbriefMitFoto(k, k.foto)
  const akzent = akzentfarbe(k.datum)
  const logoOben = RL_UNTERZEILE - 10
  const logoHoehe = 120
  const oben = logoOben + logoHoehe + 40
  const zeile = Math.floor((LOGO_LISTE_UNTEN - oben) / k.fakten.length)
  return [
    h(
      'div',
      {
        style: {
          position: 'absolute',
          top: logoOben,
          left: 60,
          right: 60,
          height: logoHoehe,
          display: 'flex',
          alignItems: 'center',
        },
      },
      h('img', {
        src: logoAdresse(k.logo),
        width: ZK_BREITE - 120,
        height: logoHoehe,
        style: { objectFit: 'contain', objectPosition: 'left center' },
      })
    ),
    ...k.fakten.map((x, i) =>
      h(
        'div',
        {
          style: {
            position: 'absolute',
            left: 60,
            right: 60,
            top: oben + i * zeile,
            height: zeile,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '2px solid #e6e7e9',
          },
        },
        h(
          'div',
          { style: { fontFamily: 'Open', fontWeight: 700, fontSize: 30, color: GRAU } },
          x.name
        ),
        h(
          'div',
          {
            style: {
              fontFamily: 'Open',
              fontWeight: 800,
              fontSize: 44,
              color: i === 0 ? akzent : SCHWARZ,
            },
          },
          x.wert
        )
      )
    ),
  ]
}

/*
  Die Geschichtskarte: Linie in der Akzentfarbe auf logarithmischer Achse,
  Zehnerpotenzen als Gitter, Jahrzehnte auf der X-Achse, die Meilensteine
  als Punkte mit Kurs und Jahr daneben. Beide Achsen beschriftet (Betreiber:
  „immer mit X- und Y-Achse").
*/
function geschichtsGrafik(k: Geschichtskarte) {
  const akzent = akzentfarbe(k.datum)
  const X0 = 190
  const X1 = 1000
  const Y0 = 660
  const Y1 = 1170
  const werte = k.punkte.map((p) => p.wert)
  const lgU = Math.floor(Math.log10(Math.min(...werte)))
  const lgO = Math.ceil(Math.log10(Math.max(...werte)))
  const zeit = (t: string) => Date.parse(`${t}T00:00:00Z`)
  const t0 = zeit(k.punkte[0].t)
  const t1 = zeit(k.punkte.at(-1)!.t)
  const x = (t: string) => X0 + ((zeit(t) - t0) / (t1 - t0)) * (X1 - X0)
  const y = (w: number) => Y1 - ((Math.log10(w) - lgU) / (lgO - lgU)) * (Y1 - Y0)
  const pfad = k.punkte
    .map((p) => `${(x(p.t) - X0).toFixed(1)},${(y(p.wert) - Y0).toFixed(1)}`)
    .join(' ')
  const stufen: number[] = []
  for (let e = lgU; e <= lgO; e++) stufen.push(10 ** e)
  const gitter = stufen
    .map((w) => {
      const yy = (y(w) - Y0).toFixed(1)
      return `<line x1="0" x2="${X1 - X0}" y1="${yy}" y2="${yy}" stroke="#c9c9c9" stroke-width="2" stroke-dasharray="7 7"/>`
    })
    .join('')
  const kreise = k.marken
    .map(
      (m) =>
        `<circle cx="${(x(m.t) - X0).toFixed(1)}" cy="${(y(m.wert) - Y0).toFixed(1)}" r="11" fill="#ffffff" stroke="${SCHWARZ}" stroke-width="5"/>`
    )
    .join('')
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${X1 - X0}" height="${Y1 - Y0}" viewBox="0 0 ${X1 - X0} ${Y1 - Y0}">` +
    gitter +
    `<line x1="1.5" x2="1.5" y1="0" y2="${Y1 - Y0}" stroke="#333" stroke-width="3"/>` +
    `<line x1="0" x2="${X1 - X0}" y1="${Y1 - Y0 - 1.5}" y2="${Y1 - Y0 - 1.5}" stroke="#333" stroke-width="3"/>` +
    `<polyline points="${pfad}" fill="none" stroke="${akzent}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>` +
    kreise +
    `</svg>`
  const schrift = { fontFamily: 'Open', fontSize: 24, color: GRAU }
  const jahrA = Number(k.punkte[0].t.slice(0, 4))
  const jahrE = Number(k.punkte.at(-1)!.t.slice(0, 4))
  const jahre: number[] = []
  for (let j = Math.ceil(jahrA / 10) * 10; j <= jahrE; j += 10) jahre.push(j)
  const fotoGroesse = 170
  return [
    h(
      'div',
      {
        style: {
          position: 'absolute',
          top: RL_UNTERZEILE,
          left: 60,
          right: k.foto ? 60 + fotoGroesse + 20 : 60,
          display: 'flex',
          fontFamily: 'Open',
          fontWeight: 700,
          fontSize: 28,
          color: GRAU,
        },
      },
      k.unterzeile
    ),
    ...stufen.map((w) =>
      h(
        'div',
        {
          style: {
            ...schrift,
            position: 'absolute',
            left: 10,
            width: X0 - 24,
            top: y(w) - 16,
            display: 'flex',
            justifyContent: 'flex-end',
          },
        },
        `${zahl(w, 0)}${k.einheit}`
      )
    ),
    h('img', {
      src: svgAdresse(svg),
      width: X1 - X0,
      height: Y1 - Y0,
      style: { position: 'absolute', left: X0, top: Y0 },
    }),
    ...jahre.map((j) =>
      h(
        'div',
        {
          style: {
            ...schrift,
            position: 'absolute',
            left: x(`${j}-01-01`) - 40,
            width: 80,
            top: Y1 + 12,
            display: 'flex',
            justifyContent: 'center',
          },
        },
        String(j)
      )
    ),
    /*
      Meilensteine rechts unterhalb des Punktes – die Linie steigt nach
      rechts, dort ist frei. Nahe am rechten Rand links unterhalb. Der
      letzte Wert ist groß und in der Akzentfarbe.
    */
    ...k.marken.map((m, i) => {
      const letzter = i === k.marken.length - 1
      /* Der letzte Punkt: Die Zahl steht schon in der Überschrift – hier nur sein Wort. */
      if (letzter)
        return h(
          'div',
          {
            style: {
              position: 'absolute',
              left: x(m.t) - 160,
              width: 140,
              top: y(m.wert) - 44,
              display: 'flex',
              justifyContent: 'flex-end',
              fontFamily: 'Open',
              fontWeight: 800,
              fontSize: 26,
              color: akzent,
            },
          },
          m.text
        )
      const breite = 240
      const links = x(m.t) > X1 - breite - 20
      return h(
        'div',
        {
          style: {
            position: 'absolute',
            left: links ? x(m.t) - breite - 18 : x(m.t) + 18,
            width: breite,
            top: y(m.wert) + 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: links ? 'flex-end' : 'flex-start',
          },
        },
        h(
          'div',
          {
            style: {
              fontFamily: 'Open',
              fontWeight: 800,
              fontSize: 30,
              color: SCHWARZ,
              lineHeight: 1.05,
            },
          },
          `${zahl(m.wert, 0)}${k.einheit}`
        ),
        h(
          'div',
          { style: { fontFamily: 'Open', fontWeight: 700, fontSize: 22, color: GRAU } },
          m.text
        )
      )
    }),
    ...(k.foto
      ? [
          h('img', {
            src: `data:image/jpeg;base64,${readFileSync(join(FOTO_ORDNER, k.foto)).toString('base64')}`,
            width: fotoGroesse,
            height: fotoGroesse,
            style: {
              position: 'absolute',
              right: 60,
              top: RL_UNTERZEILE - 44,
              objectFit: 'cover',
              objectPosition: 'center top',
              borderRadius: fotoGroesse,
              border: `5px solid ${akzent}`,
            },
          }),
        ]
      : []),
  ]
}

/*
  Die Pyramide: gleich hohe Stufen, jede breiter als die darüber, mittig
  gesetzt. In jeder Stufe die Zahl groß und weiß, darunter die Zeile. Die
  Spitze in der Akzentfarbe, die Stufen darunter von Schwarz zu Grau. Unter
  der Pyramide optional ein Hinweis als Band in der Akzentfarbe.
*/
function pyramidenGrafik(k: Pyramidenkarte) {
  const akzent = akzentfarbe(k.datum)
  const n = k.stufen.length
  const oben = 600
  const unten = k.hinweis ? 1100 : 1200
  const luecke = 10
  const hoehe = (unten - oben - (n - 1) * luecke) / n
  const mitte = ZK_BREITE / 2
  const spitze = 120
  const basis = ZK_BREITE - 120
  /* Breite an Ober- und Unterkante einer Stufe – eine durchgehende Schräge. */
  const breiteBei = (yy: number) =>
    spitze + ((yy - oben) / (unten - oben)) * (basis - spitze)
  const farben = [akzent, SCHWARZ, '#3a3a3a', '#5a5a5a', '#7a7a7a']
  const flaechen = k.stufen
    .map((_, i) => {
      const y0 = oben + i * (hoehe + luecke)
      const y1 = y0 + hoehe
      const b0 = breiteBei(y0) / 2
      const b1 = breiteBei(y1) / 2
      return `<polygon points="${mitte - b0},${y0 - oben} ${mitte + b0},${y0 - oben} ${mitte + b1},${y1 - oben} ${mitte - b1},${y1 - oben}" fill="${farben[i] ?? GRAU}"/>`
    })
    .join('')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ZK_BREITE}" height="${unten - oben}" viewBox="0 0 ${ZK_BREITE} ${unten - oben}">${flaechen}</svg>`
  return [
    h(
      'div',
      {
        style: {
          position: 'absolute',
          top: RL_UNTERZEILE,
          left: 60,
          right: k.logo ? 360 : 60,
          display: 'flex',
          fontFamily: 'Open',
          fontWeight: 700,
          fontSize: 28,
          color: GRAU,
        },
      },
      k.unterzeile
    ),
    ...(k.logo
      ? [
          h('img', {
            src: logoAdresse(k.logo),
            width: 280,
            height: 40,
            style: {
              position: 'absolute',
              right: 60,
              top: RL_UNTERZEILE + 2,
              objectFit: 'contain',
              objectPosition: 'right center',
            },
          }),
        ]
      : []),
    h('img', {
      src: svgAdresse(svg),
      width: ZK_BREITE,
      height: unten - oben,
      style: { position: 'absolute', left: 0, top: oben },
    }),
    ...k.stufen.map((st, i) => {
      const y0 = oben + i * (hoehe + luecke)
      return h(
        'div',
        {
          style: {
            position: 'absolute',
            left: 0,
            width: ZK_BREITE,
            top: y0,
            height: hoehe,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          },
        },
        h(
          'div',
          {
            style: {
              fontFamily: 'Anton',
              fontSize: i === 0 ? 52 : 60,
              lineHeight: 1,
              color: '#ffffff',
            },
          },
          st.zahl
        ),
        h(
          'div',
          {
            style: {
              marginTop: 6,
              fontFamily: 'Open',
              fontWeight: 700,
              fontSize: i === 0 ? 20 : 25,
              color: '#ffffff',
            },
          },
          st.text
        )
      )
    }),
    ...(k.hinweis
      ? [
          h(
            'div',
            {
              style: {
                position: 'absolute',
                left: 60,
                right: 60,
                top: unten + 28,
                height: 76,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 18,
                border: `4px solid ${akzent}`,
                fontFamily: 'Open',
                fontWeight: 800,
                fontSize: 28,
                color: SCHWARZ,
              },
            },
            k.hinweis
          ),
        ]
      : []),
  ]
}

/*
  Die Torte: ein Ring links, das größte Stück in der Akzentfarbe, die
  übrigen Schwarz und Grau, zwischen den Stücken ein weißer Spalt. In der
  Mitte die Summe. Rechts die Legende: Farbfeld, Logo, Betrag, Zeile.
*/
function tortenGrafik(k: Tortenkarte) {
  const akzent = akzentfarbe(k.datum)
  const farben = [akzent, SCHWARZ, '#8a8a8a', '#b5b5b5', '#d5d5d5']
  const oben = 590
  const d = 470
  const r = d / 2
  const innen = r * 0.64
  const cx = r
  const cy = r
  const summe = k.stuecke.reduce((a, st) => a + st.wert, 0)
  let winkel = -Math.PI / 2
  const punkt = (rad: number, w: number) =>
    `${(cx + rad * Math.cos(w)).toFixed(2)},${(cy + rad * Math.sin(w)).toFixed(2)}`
  const stuecke = k.stuecke
    .map((st, i) => {
      const w0 = winkel
      const w1 = winkel + (st.wert / summe) * 2 * Math.PI
      winkel = w1
      const gross = w1 - w0 > Math.PI ? 1 : 0
      return `<path d="M ${punkt(r, w0)} A ${r} ${r} 0 ${gross} 1 ${punkt(r, w1)} L ${punkt(innen, w1)} A ${innen} ${innen} 0 ${gross} 0 ${punkt(innen, w0)} Z" fill="${farben[i]}" stroke="#ffffff" stroke-width="8"/>`
    })
    .join('')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${d}" height="${d}" viewBox="0 0 ${d} ${d}">${stuecke}</svg>`
  const links = 60
  const legendeLinks = links + d + 50
  const zeile = Math.floor(d / k.stuecke.length)
  return [
    h(
      'div',
      {
        style: {
          position: 'absolute',
          top: RL_UNTERZEILE,
          left: 60,
          right: 60,
          display: 'flex',
          fontFamily: 'Open',
          fontWeight: 700,
          fontSize: 28,
          color: GRAU,
        },
      },
      k.unterzeile
    ),
    h('img', {
      src: svgAdresse(svg),
      width: d,
      height: d,
      style: { position: 'absolute', left: links, top: oben },
    }),
    h(
      'div',
      {
        style: {
          position: 'absolute',
          left: links,
          width: d,
          top: oben,
          height: d,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        },
      },
      h(
        'div',
        { style: { fontFamily: 'Anton', fontSize: 50, lineHeight: 1, color: SCHWARZ } },
        k.mitte.zahl
      ),
      h(
        'div',
        {
          style: {
            marginTop: 8,
            fontFamily: 'Open',
            fontWeight: 700,
            fontSize: 24,
            color: GRAU,
          },
        },
        k.mitte.text
      )
    ),
    ...k.stuecke.map((st, i) =>
      h(
        'div',
        {
          style: {
            position: 'absolute',
            left: legendeLinks,
            right: 60,
            top: oben + i * zeile,
            height: zeile,
            display: 'flex',
            alignItems: 'center',
          },
        },
        h('div', {
          style: {
            width: 18,
            height: zeile - 40,
            borderRadius: 9,
            backgroundColor: farben[i],
            marginRight: 22,
          },
        }),
        h(
          'div',
          { style: { display: 'flex', flexDirection: 'column' } },
          st.logo
            ? h('img', {
                src: logoAdresse(st.logo),
                width: ZK_BREITE - 60 - legendeLinks - 40,
                height: 46,
                style: { objectFit: 'contain', objectPosition: 'left center' },
              })
            : h(
                'div',
                {
                  style: {
                    fontFamily: 'Open',
                    fontWeight: 800,
                    fontSize: 30,
                    color: SCHWARZ,
                  },
                },
                st.name
              ),
          h(
            'div',
            {
              style: {
                marginTop: 6,
                fontFamily: 'Anton',
                fontSize: 50,
                lineHeight: 1.05,
                color: i === 0 ? akzent : SCHWARZ,
              },
            },
            st.anzeige
          ),
          h(
            'div',
            { style: { fontFamily: 'Open', fontWeight: 700, fontSize: 21, color: GRAU } },
            st.zusatz
          )
        )
      )
    ),
    ...(k.infos
      ? k.infos.map((x, i) => {
          const n = k.infos!.length
          const breite = (ZK_BREITE - 120 - (n - 1) * 24) / n
          return h(
            'div',
            {
              style: {
                position: 'absolute',
                left: 60 + i * (breite + 24),
                width: breite,
                top: oben + d + 34,
                height: 130,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                paddingLeft: 20,
                borderRadius: 18,
                border: `4px solid ${i === 0 ? akzent : '#e6e7e9'}`,
              },
            },
            h(
              'div',
              {
                style: { fontFamily: 'Open', fontWeight: 700, fontSize: 19, color: GRAU },
              },
              x.name
            ),
            h(
              'div',
              {
                style: {
                  marginTop: 4,
                  fontFamily: 'Anton',
                  fontSize: 40,
                  lineHeight: 1.05,
                  color: i === 0 ? akzent : SCHWARZ,
                },
              },
              x.wert
            )
          )
        })
      : []),
    ...(k.hinweis
      ? [
          h(
            'div',
            {
              style: {
                position: 'absolute',
                left: 60,
                right: 60,
                top: oben + d + 40,
                height: 76,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 18,
                border: `4px solid ${akzent}`,
                fontFamily: 'Open',
                fontWeight: 800,
                fontSize: 27,
                color: SCHWARZ,
              },
            },
            k.hinweis
          ),
        ]
      : []),
  ]
}

/** Wo die Fotos der Steckbriefe liegen. */
const FOTO_ORDNER = join(process.cwd(), 'lib/instagram/fotos')
const SYMBOL_ORDNER = join(process.cwd(), 'lib/instagram/symbole')

/*
  Steckbrief mit Foto: das Foto links, groß und hochkant, rechts das Logo
  und darunter die Kennzahlen – Name klein in Grau über dem Wert, damit
  beide in die halbe Breite passen.
*/
function steckbriefMitFoto(k: Steckbriefkarte, foto: string) {
  const akzent = akzentfarbe(k.datum)
  const oben = RL_UNTERZEILE - 10
  const fotoBreite = 420
  const links = 60 + fotoBreite + 40
  const logoHoehe = 56
  const listeOben = oben + logoHoehe + 22
  const zeile = Math.floor((LOGO_LISTE_UNTEN - listeOben) / k.fakten.length)
  const fotoAdresse = `data:image/jpeg;base64,${readFileSync(join(FOTO_ORDNER, foto)).toString('base64')}`
  return [
    h('img', {
      src: fotoAdresse,
      width: fotoBreite,
      height: LOGO_LISTE_UNTEN - oben,
      style: {
        position: 'absolute',
        left: 60,
        top: oben,
        objectFit: 'cover',
        objectPosition: 'center top',
        borderRadius: 22,
      },
    }),
    h(
      'div',
      {
        style: {
          position: 'absolute',
          left: links,
          right: 60,
          top: oben,
          height: logoHoehe,
          display: 'flex',
          alignItems: 'center',
        },
      },
      h('img', {
        src: logoAdresse(k.logo),
        width: ZK_BREITE - 60 - links,
        height: logoHoehe,
        style: { objectFit: 'contain', objectPosition: 'left center' },
      })
    ),
    ...k.fakten.map((x, i) =>
      h(
        'div',
        {
          style: {
            position: 'absolute',
            left: links,
            right: 60,
            top: listeOben + i * zeile,
            height: zeile,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            borderTop: '2px solid #e6e7e9',
          },
        },
        h(
          'div',
          { style: { fontFamily: 'Open', fontWeight: 700, fontSize: 23, color: GRAU } },
          x.name
        ),
        h(
          'div',
          {
            style: {
              fontFamily: 'Open',
              fontWeight: 800,
              fontSize: 40,
              lineHeight: 1.1,
              color: i === 0 ? akzent : SCHWARZ,
            },
          },
          x.wert
        )
      )
    ),
  ]
}

/** Unterkante der Logoliste – über der Fußzeile. */
const LOGO_LISTE_UNTEN = 1235

/** Wo die Firmenlogos der Kacheln liegen. */
const LOGO_ORDNER = join(process.cwd(), 'lib/instagram/logos')

/** Ein Logo als Adresse für `img` – PNG aus `LOGO_ORDNER`. */
function logoAdresse(datei: string): string {
  return `data:image/png;base64,${readFileSync(join(LOGO_ORDNER, datei)).toString('base64')}`
}

function kachelGrafik(k: Rangkarte) {
  const akzent = akzentfarbe(k.datum)
  const spalten = 2
  const reihen = Math.ceil(k.zeilen.length / spalten)
  const luecke = 18
  const breite = (ZK_BREITE - 80 - luecke) / spalten
  const mitLogos = k.zeilen.some((z) => z.logo)
  const hoehe = Math.min(150, Math.floor((RL_UNTEN + 20 - RL_OBEN) / reihen) - luecke)
  const karte = (z: Rang, i: number) => {
    const farbe = z.hervor ? '#ffffff' : z.schnitt ? MITTELGRAU : SCHWARZ
    if (mitLogos) return logoKachel(z, k, i, { akzent })
    return h(
      'div',
      {
        style: {
          position: 'absolute',
          left: 40 + (i % spalten) * (breite + luecke),
          top: RL_OBEN - 20 + Math.floor(i / spalten) * (hoehe + luecke),
          width: breite,
          height: hoehe,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 28,
          paddingRight: 22,
          borderRadius: 22,
          backgroundColor: z.hervor ? akzent : z.schnitt ? '#ffffff' : '#f1f3f0',
          border: z.schnitt
            ? '3px dashed #777'
            : `3px solid ${z.hervor ? akzent : '#f1f3f0'}`,
        },
      },
      /* Keine Rangnummer: Die Auswahl ist nicht die Rangliste – Deutschland
         stünde als „6." da und ist weltweit 183. */
      flagge(FLAGGEN[z.land] ?? { streifen: [LEER] }, 58, z.hervor ? 3 : 2),
      h(
        'div',
        {
          style: {
            display: 'flex',
            flexDirection: 'column',
            marginLeft: 16,
          },
        },
        h(
          'div',
          { style: { fontFamily: 'Open', fontWeight: 700, fontSize: 26, color: farbe } },
          z.name
        ),
        h(
          'div',
          {
            style: {
              fontFamily: 'Open',
              fontWeight: 800,
              fontStyle: 'italic',
              fontSize: 50,
              lineHeight: 1.05,
              color: farbe,
            },
          },
          `${zahl(z.wert, k.stellen)}${k.einheit ?? ' %'}`
        )
      )
    )
  }
  return [
    h(
      'div',
      {
        style: {
          position: 'absolute',
          top: RL_UNTERZEILE,
          left: 60,
          right: 60,
          display: 'flex',
          fontFamily: 'Open',
          fontWeight: 700,
          fontSize: 28,
          color: GRAU,
        },
      },
      k.unterzeile
    ),
    ...k.zeilen.map(karte),
  ]
}

/**
 * Die Form einer Karte – zwei Tage hintereinander nie dieselbe (Betreiber,
 * 18.10.2026: „Das soll sich durchrotieren, genauso wie die Farben").
 */
export function form(
  k: Zahlenkarte
):
  | 'vergleich'
  | 'haeuser'
  | 'balken'
  | 'kacheln'
  | 'zeitleiste'
  | 'burger'
  | 'verlauf'
  | 'duell'
  | 'steckbrief'
  | 'geschichte'
  | 'pyramide'
  | 'torte'
  | 'kurven'
  | 'saeulen'
  | 'zeitstrahl'
  | 'hausbalken'
  | 'vielfach'
  | 'kammern'
  | 'personen'
  | 'zahlenstrahl'
  | 'raetsel'
  | 'mythos' {
  if (k.art === 'zahlenstrahl') return 'zahlenstrahl'
  if (k.art === 'raetsel') return 'raetsel'
  if (k.art === 'mythos') return 'mythos'
  if (k.art === 'personen') return 'personen'
  if (k.art === 'kammern') return 'kammern'
  if (k.art === 'balken') return 'hausbalken'
  if (k.art === 'vielfach') return 'vielfach'
  if (
    k.art === 'kurven' ||
    k.art === 'zeitstrahl' ||
    k.art === 'saeulen' ||
    k.art === 'verlauf' ||
    k.art === 'duell' ||
    k.art === 'steckbrief' ||
    k.art === 'geschichte' ||
    k.art === 'pyramide' ||
    k.art === 'torte'
  )
    return k.art
  return k.art === 'rangliste' ? (k.skala ?? 'haeuser') : 'vergleich'
}

/**
 * Die Zeitleiste: je Zeile ein Ereignis, eine Spur von null bis zum größten
 * Wert und darauf die Strecke dieser Zeile mit einem Punkt am Ende – für
 * Dauern („25 Jahre bis zum alten Hoch"). Unter dem Namen steht `zusatz`,
 * die zweite Zahl des Ereignisses. Eingeführt am 24.10.2026 für „Nach dem
 * Crash" (Betreiber: „kreativer werden, mal was Neues").
 */
function zeitleisteGrafik(k: Rangkarte) {
  const akzent = akzentfarbe(k.datum)
  const groesster = Math.max(...k.zeilen.map((z) => z.wert))
  const hoehe = Math.min(118, Math.floor((RL_UNTEN + 30 - RL_OBEN) / k.zeilen.length))
  const spurX = 370
  const spurBreite = ZK_BREITE - 40 - spurX - 240
  const zeile = (z: Rang, i: number) => {
    const farbe = z.hervor ? akzent : SCHWARZ
    const laenge = Math.max(16, (spurBreite * z.wert) / groesster)
    const oben = RL_OBEN - 30 + i * hoehe
    return [
      h('div', {
        style: {
          position: 'absolute',
          left: 40,
          right: 40,
          top: oben,
          height: hoehe - 10,
          borderRadius: 18,
          backgroundColor: z.hervor ? hell(akzent) : 'transparent',
          border: `3px solid ${z.hervor ? akzent : 'transparent'}`,
        },
      }),
      h(
        'div',
        {
          style: {
            position: 'absolute',
            left: 66,
            top: oben,
            height: hoehe - 10,
            width: spurX - 80,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          },
        },
        h(
          'div',
          { style: { fontFamily: 'Open', fontWeight: 800, fontSize: 29, color: farbe } },
          z.name
        ),
        ...(z.zusatz
          ? [
              h(
                'div',
                {
                  style: {
                    fontFamily: 'Open',
                    fontWeight: 700,
                    fontSize: 24,
                    color: ROT,
                  },
                },
                z.zusatz
              ),
            ]
          : [])
      ),
      /* Die Spur – grau, so lang wie der größte Wert. */
      h('div', {
        style: {
          position: 'absolute',
          left: spurX,
          top: oben + (hoehe - 10) / 2 - 4,
          width: spurBreite,
          height: 8,
          borderRadius: 4,
          backgroundColor: '#e3e5e1',
        },
      }),
      h('div', {
        style: {
          position: 'absolute',
          left: spurX,
          top: oben + (hoehe - 10) / 2 - 7,
          width: laenge,
          height: 14,
          borderRadius: 7,
          backgroundColor: farbe,
        },
      }),
      h('div', {
        style: {
          position: 'absolute',
          left: spurX + laenge - 13,
          top: oben + (hoehe - 10) / 2 - 13,
          width: 26,
          height: 26,
          borderRadius: 13,
          backgroundColor: '#ffffff',
          border: `6px solid ${farbe}`,
        },
      }),
      h(
        'div',
        {
          style: {
            position: 'absolute',
            right: 58,
            top: oben,
            height: hoehe - 10,
            display: 'flex',
            alignItems: 'center',
            fontFamily: 'Open',
            fontWeight: 800,
            fontStyle: 'italic',
            fontSize: 38,
            color: farbe,
          },
        },
        `${zahl(z.wert, k.stellen)}${k.einheit ?? ' %'}`
      ),
    ]
  }
  return [
    h(
      'div',
      {
        style: {
          position: 'absolute',
          top: RL_UNTERZEILE,
          left: 60,
          right: 60,
          display: 'flex',
          fontFamily: 'Open',
          fontWeight: 700,
          fontSize: 28,
          color: GRAU,
        },
      },
      k.unterzeile
    ),
    ...k.zeilen.flatMap(zeile),
  ]
}

function ranglistenGrafik(k: Rangkarte) {
  if (k.skala === 'kacheln') return kachelGrafik(k)
  if (k.skala === 'zeitleiste') return zeitleisteGrafik(k)
  const mitBalken = k.skala === 'balken'
  const akzent = akzentfarbe(k.datum)
  const groesster = Math.max(...k.zeilen.map((z) => z.wert), 0)
  const kleinster = Math.min(...k.zeilen.map((z) => z.wert), 0)
  const hundert = RL_BALKEN_X + (RL_BALKEN * 100) / groesster
  const nulllinie = RL_BALKEN_X + (RL_BALKEN * -kleinster) / (groesster - kleinster)
  const hoehe = zeilenhoehe(k.zeilen.length)
  const zeile = (z: Rang, i: number) => {
    const farbe = z.hervor
      ? akzent
      : z.schnitt
        ? MITTELGRAU
        : z.wert < 0
          ? '#8B2225'
          : SCHWARZ
    return h(
      'div',
      {
        style: {
          position: 'absolute',
          left: 40,
          right: 40,
          top: RL_OBEN + i * hoehe,
          height: hoehe - 6,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 18,
          paddingRight: 18,
          borderRadius: 14,
          backgroundColor: z.hervor ? hell(akzent) : 'transparent',
          border: z.schnitt
            ? '3px dashed #777'
            : z.hervor
              ? `3px solid ${akzent}`
              : '3px solid transparent',
        },
      },
      flagge(FLAGGEN[z.land] ?? { streifen: [LEER] }, 46, 2),
      h(
        'div',
        {
          style: {
            width: 250,
            marginLeft: 16,
            fontFamily: 'Open',
            fontWeight: 700,
            fontSize: 30,
            color: farbe,
          },
        },
        z.name
      ),
      mitBalken
        ? balken(z.wert, groesster, z.schnitt ? '#777777' : farbe, kleinster)
        : k.skala === 'burger'
          ? haeuser(z.wert, z.schnitt ? '#777777' : farbe, burger, 1)
          : haeuser(z.wert, z.schnitt ? '#777777' : farbe),
      h(
        'div',
        {
          style: {
            marginLeft: 'auto',
            fontFamily: 'Open',
            fontWeight: 800,
            fontStyle: 'italic',
            fontSize: 36,
            color: farbe,
          },
        },
        `${kleinster < 0 && z.wert > 0 ? '+' : z.wert < 0 ? '−' : ''}${zahl(Math.abs(z.wert), k.stellen)}${k.einheit ?? ' %'}`
      )
    )
  }

  return [
    h(
      'div',
      {
        style: {
          position: 'absolute',
          top: RL_UNTERZEILE,
          left: 60,
          right: 60,
          display: 'flex',
          alignItems: 'center',
          fontFamily: 'Open',
          fontWeight: 700,
          fontSize: 28,
          color: GRAU,
        },
      },
      k.unterzeile,
      ...(mitBalken
        ? []
        : [
            h('img', {
              src: k.skala === 'burger' ? burger(SCHWARZ) : haus(SCHWARZ),
              width: 30,
              height: 30,
              style: { marginLeft: 12 },
            }),
            h(
              'div',
              { style: { marginLeft: 8, fontWeight: 400 } },
              k.skala === 'burger' ? `= 1${k.einheit ?? ' %'}` : '= 10 %'
            ),
          ])
    ),
    /* Die Nulllinie, wenn es negative Werte gibt. */
    ...(mitBalken && kleinster < 0
      ? [
          h('div', {
            style: {
              position: 'absolute',
              left: nulllinie - 1,
              top: RL_OBEN - 10,
              width: 3,
              height: k.zeilen.length * hoehe + 4,
              backgroundColor: '#333',
            },
          }),
        ]
      : []),
    /*
      Die 100-%-Linie: links davon weniger Schulden als ein Jahr Wirtschaftsleistung.
      Nur bei Prozent – am 27.10.2026 stand sie in „Gewinn pro Sekunde" bei
      100 Dollar, beschriftet mit „100 %".
    */
    ...(mitBalken && groesster > 100 && (k.einheit ?? ' %').trim() === '%'
      ? [
          h('div', {
            style: {
              position: 'absolute',
              left: hundert - 1,
              top: RL_OBEN - 14,
              width: 0,
              height: k.zeilen.length * hoehe + 8,
              borderLeft: '3px dashed #777',
            },
          }),
          h(
            'div',
            {
              style: {
                position: 'absolute',
                left: hundert - 60,
                top: RL_OBEN - 44,
                width: 120,
                display: 'flex',
                justifyContent: 'center',
                fontFamily: 'Open',
                fontWeight: 700,
                fontSize: 22,
                color: MITTELGRAU,
              },
            },
            '100 %'
          ),
        ]
      : []),
    ...k.zeilen.map(zeile),
  ]
}

/* ------------------------------------------------------------ Verlauf */

/**
 * Die Entwicklung seit Jahresbeginn in Prozent – aus dem Kursbestand.
 * Bezug ist der Jahresschluss, so wie `ytdPercent` ihn rechnet; der
 * Schlusskurs des Stichtags kommt aus dem Kurs, wenn die Tagesreihe ihn noch
 * nicht trägt. Was nach `bis` liegt, bleibt draußen.
 */
export async function verlaufSeitJahresbeginn(
  symbol: string,
  bis: string
): Promise<{ t: string; prozent: number }[]> {
  const { getQuote, getSeries } = await import('@/lib/markets')
  const [reihe, kurs] = await Promise.all([getSeries(symbol, '1J'), getQuote(symbol)])
  if (!kurs) return []
  const jahr = bis.slice(0, 4)
  const basis = kurs.value / (1 + kurs.ytdPercent / 100)
  const punkte = reihe
    .filter((p) => p.t.slice(0, 4) === jahr && p.t.slice(0, 10) <= bis)
    .map((p) => ({ t: p.t.slice(0, 10), wert: p.value }))
  const kursTag = kurs.asOf.slice(0, 10)
  if (kursTag === bis && punkte.at(-1)?.t !== bis)
    punkte.push({ t: bis, wert: kurs.value })
  return [
    { t: `${Number(jahr) - 1}-12-31`, prozent: 0 },
    ...punkte.map((p) => ({ t: p.t, prozent: (p.wert / basis - 1) * 100 })),
  ]
}

const MONATE = [
  'Jan',
  'Feb',
  'Mär',
  'Apr',
  'Mai',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Okt',
  'Nov',
  'Dez',
]

async function verlaufGrafik(k: Verlaufkarte) {
  const akzent = akzentfarbe(k.datum)
  const reihen = await Promise.all(
    k.reihen.map(async (r) => ({
      ...r,
      punkte: await verlaufSeitJahresbeginn(r.symbol, k.bis),
    }))
  )
  const alle = reihen.flatMap((r) => r.punkte.map((p) => p.prozent))
  const roh = Math.max(...alle) - Math.min(...alle, 0)
  const schritt = [2, 2.5, 5, 10, 20, 25, 50].find((x) => roh / x <= 5) ?? 100
  const unten = Math.floor(Math.min(...alle, 0) / schritt) * schritt
  const oben = Math.ceil(Math.max(...alle, 0) / schritt) * schritt
  const teil: number[] = []
  for (let w = unten; w <= oben + 1e-9; w += schritt) teil.push(Math.round(w * 10) / 10)

  /* Fläche: links die Y-Achse, rechts Platz für die Endwerte. */
  const X0 = 130
  const X1 = 780
  const Y0 = 580
  const Y1 = 1150
  const zeitAnfang = Date.parse(`${reihen[0].punkte[0].t}T00:00:00Z`)
  const zeitEnde = Date.parse(`${k.bis}T00:00:00Z`)
  const x = (t: string) =>
    X0 +
    ((Date.parse(`${t}T00:00:00Z`) - zeitAnfang) / (zeitEnde - zeitAnfang)) * (X1 - X0)
  const y = (p: number) => Y1 - ((p - unten) / (oben - unten)) * (Y1 - Y0)

  const linien = reihen
    .map((r) => {
      const farbe = r.akzent ? akzent : SCHWARZ
      const pfad = r.punkte
        .map((p) => `${(x(p.t) - X0).toFixed(1)},${(y(p.prozent) - Y0).toFixed(1)}`)
        .join(' ')
      return `<polyline points="${pfad}" fill="none" stroke="${farbe}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>`
    })
    .join('')
  const gitter = teil
    .map((w) => {
      const yy = (y(w) - Y0).toFixed(1)
      return w === 0
        ? `<line x1="0" x2="${X1 - X0}" y1="${yy}" y2="${yy}" stroke="#333" stroke-width="3"/>`
        : `<line x1="0" x2="${X1 - X0}" y1="${yy}" y2="${yy}" stroke="#c9c9c9" stroke-width="2" stroke-dasharray="7 7"/>`
    })
    .join('')
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${X1 - X0}" height="${Y1 - Y0}" viewBox="0 0 ${X1 - X0} ${Y1 - Y0}">` +
    gitter +
    `<line x1="1.5" x2="1.5" y1="0" y2="${Y1 - Y0}" stroke="#333" stroke-width="3"/>` +
    `<line x1="0" x2="${X1 - X0}" y1="${Y1 - Y0 - 1.5}" y2="${Y1 - Y0 - 1.5}" stroke="#333" stroke-width="3"/>` +
    linien +
    `</svg>`

  const zahl = (w: number) => `${w > 0 ? '+' : ''}${w.toLocaleString('de-DE')} %`
  const schrift = { fontFamily: 'Open', fontSize: 24, color: GRAU }

  /* Monatsanfänge auf der X-Achse – jeder zweite, damit nichts zusammenstößt. */
  const monate: { t: string; text: string }[] = []
  const bisMonat = Number(k.bis.slice(5, 7))
  for (let m = 1; m <= bisMonat; m += 2)
    monate.push({
      t: `${k.bis.slice(0, 4)}-${String(m).padStart(2, '0')}-01`,
      text: MONATE[m - 1],
    })

  /* Endwerte: an der Höhe ihres letzten Punktes, auseinandergeschoben, wenn sie sich zu nah kommen. */
  const enden = reihen
    .map((r) => ({ r, yy: y(r.punkte.at(-1)!.prozent) }))
    .sort((a, b) => a.yy - b.yy)
  for (let i = 1; i < enden.length; i++)
    if (enden[i].yy - enden[i - 1].yy < 96) enden[i].yy = enden[i - 1].yy + 96

  return [
    h(
      'div',
      {
        style: {
          position: 'absolute',
          top: RL_UNTERZEILE,
          left: 60,
          right: 60,
          display: 'flex',
          fontFamily: 'Open',
          fontWeight: 700,
          fontSize: 28,
          color: GRAU,
        },
      },
      k.unterzeile
    ),
    ...teil.map((w) =>
      h(
        'div',
        {
          style: {
            ...schrift,
            position: 'absolute',
            left: 20,
            width: X0 - 34,
            top: y(w) - 16,
            display: 'flex',
            justifyContent: 'flex-end',
            fontWeight: w === 0 ? 700 : 400,
          },
        },
        zahl(w)
      )
    ),
    h('img', {
      src: svgAdresse(svg),
      width: X1 - X0,
      height: Y1 - Y0,
      style: { position: 'absolute', left: X0, top: Y0 },
    }),
    ...monate.map(({ t, text }) =>
      h(
        'div',
        {
          style: {
            ...schrift,
            position: 'absolute',
            left: x(t) - 40,
            width: 80,
            top: Y1 + 14,
            display: 'flex',
            justifyContent: 'center',
          },
        },
        text
      )
    ),
    ...enden.map(({ r, yy }) =>
      h(
        'div',
        {
          style: {
            position: 'absolute',
            left: X1 + 22,
            top: yy - 44,
            display: 'flex',
            alignItems: 'center',
          },
        },
        r.land ? flagge(FLAGGEN[r.land], 50, 2) : h('div', {}),
        h(
          'div',
          { style: { display: 'flex', flexDirection: 'column', marginLeft: 12 } },
          h(
            'div',
            {
              style: {
                fontFamily: 'Open',
                fontWeight: 700,
                fontSize: 26,
                color: SCHWARZ,
              },
            },
            r.name
          ),
          h(
            'div',
            {
              style: {
                fontFamily: 'Open',
                fontWeight: 800,
                fontStyle: 'italic',
                fontSize: 44,
                lineHeight: 1.05,
                color: r.akzent ? akzent : SCHWARZ,
              },
            },
            r.endwert
          )
        )
      )
    ),
  ]
}

/* ------------------------------------------------------------ Kurvenkarte */

/** Der Hausstil, Werte aus `INSTAGRAM-STIL.md` – dort ändern, hier nachziehen. */
const STIL = {
  tinte: '#0b1220',
  navy: '#17296F',
  grau: '#5b6472',
  hellgrau: '#8a93a0',
  rand: '#e3e7ee',
  gruen: '#205437',
  rot: '#8B2225',
}

function stilFarbe(richtung?: 'steigt' | 'faellt') {
  return richtung === 'steigt'
    ? STIL.gruen
    : richtung === 'faellt'
      ? STIL.rot
      : STIL.tinte
}

/** Ein runder Schritt für die y-Achse: 1, 2 oder 5 mal einer Zehnerpotenz. */
function achsenschritt(hoechst: number, linien: number) {
  const roh = hoechst / linien
  const zehner = 10 ** Math.floor(Math.log10(roh))
  return [1, 2, 5, 10].map((m) => m * zehner).find((m) => m >= roh)!
}

/** Der Kopf aller Karten im Hausstil: Signet und Wortmarke, oben mittig. */
function stilKopf(logo: string) {
  return h(
    'div',
    {
      style: {
        position: 'absolute',
        top: 48,
        left: 0,
        width: ZK_BREITE,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
    },
    h('img', { src: logo, width: 44, height: 44 }),
    h(
      'div',
      {
        style: {
          fontFamily: 'Montserrat',
          fontWeight: 700,
          fontSize: 26,
          color: STIL.tinte,
          marginLeft: 12,
        },
      },
      'IM Invests'
    )
  )
}

/** Die Symbole zum Anlass, flach gezeichnet wie ein Piktogramm. */
const SYMBOLE = {
  kuerbis:
    '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">' +
    '<path d="M31 15c0-6 3-9 8-9" fill="none" stroke="#3f6b2a" stroke-width="4" stroke-linecap="round"/>' +
    '<ellipse cx="20" cy="38" rx="13" ry="19" fill="#d9661a"/>' +
    '<ellipse cx="44" cy="38" rx="13" ry="19" fill="#d9661a"/>' +
    '<ellipse cx="32" cy="38" rx="13" ry="21" fill="#ef7f24"/>' +
    '<path d="M24 34l4-5 4 5zM36 34l4-5 4 5z" fill="#4a2208"/>' +
    '<path d="M23 44q9 7 18 0l-3 1-2 3-3-3-3 3-2-3z" fill="#4a2208"/>' +
    '</svg>',
  /* Die US-Flagge vereinfacht: sieben Streifen, das Feld ohne Sterne. */
  usa:
    '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">' +
    '<clipPath id="r"><rect x="4" y="14" width="56" height="38" rx="6"/></clipPath>' +
    '<g clip-path="url(#r)"><rect x="4" y="14" width="56" height="38" fill="#ffffff"/>' +
    [0, 2, 4, 6]
      .map(
        (i) =>
          `<rect x="4" y="${14 + i * (38 / 7)}" width="56" height="${38 / 7}" fill="#b22234"/>`
      )
      .join('') +
    '<rect x="4" y="14" width="26" height="21" fill="#3c3b6e"/></g>' +
    '<rect x="4" y="14" width="56" height="38" rx="6" fill="none" stroke="#d8dbe0" stroke-width="1.5"/>' +
    '</svg>',
}
type Anlass = keyof typeof SYMBOLE

/* Das Raster des Hausstils – siehe `INSTAGRAM-STIL.md`, „Aufbau einer Karte". */
const STIL_RAND = 60
const STIL_GRAFIK_O = 736
const STIL_GRAFIK_U = 1200

function stilBlock(inhalt: string, stil: Record<string, string | number>) {
  return h(
    'div',
    {
      style: { position: 'absolute', display: 'flex', fontFamily: 'Montserrat', ...stil },
    },
    inhalt
  )
}

const GESPERRT = { fontSize: 17, fontWeight: 700, letterSpacing: 3, color: STIL.hellgrau }

/**
 * Der Rahmen jeder Karte im Hausstil: Kopf, Titel mit Symbol, Unterzeile,
 * Stichzeile, ein oder zwei Heldenzahlen mit Pille, Quelle. Die Grafik
 * dazwischen (y 736–1200) bringt die Kartenart mit.
 */
function stilBild(
  k:
    | Kurvenkarte
    | Saeulenkarte
    | Zeitstrahlkarte
    | Balkenkarte
    | Vielfachkarte
    | Kammerkarte
    | Personenkarte,
  logo: string,
  helden: Held[],
  grafik: ReturnType<typeof h>[]
) {
  const rand = STIL_RAND
  const mitte = ZK_BREITE / 2

  /*
    Je Held eine Spalte: Name, Zahl, darunter die Pille – die Kennzahl, die
    zur großen gehört, steht unter ihr statt in einer eigenen Reihe am Fuß
    (Betreiber, 30.10.2026: „noch nicht perfekt").
  */
  /*
    Drei Helden (07.11.2026, „weltweite Teuerung und Euro und Teuerung in
    Deutschland"): drei gleich breite Spalten, die Zahl etwas kleiner.
  */
  const drei = helden.length === 3
  const spalte = (ZK_BREITE - 2 * rand) / 3
  const spalten = helden.map((held, n) => {
    const pille = held.pille
    const farbe = stilFarbe(pille?.richtung)
    return h(
      'div',
      {
        style: {
          position: 'absolute',
          top: 482,
          left: drei ? rand + n * spalte + (n ? 30 : 0) : n ? mitte + 40 : rand,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          fontFamily: 'Montserrat',
        },
      },
      h('div', { style: GESPERRT }, held.name.toUpperCase()),
      h(
        'div',
        {
          style: {
            fontSize: drei ? 76 : 96,
            fontWeight: 800,
            letterSpacing: -3,
            lineHeight: 1.05,
            color: stilFarbe(held.richtung),
            marginTop: 6,
          },
        },
        held.wert
      ),
      ...(pille
        ? [
            h(
              'div',
              {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: 14,
                  padding: '9px 18px',
                  borderRadius: 999,
                  backgroundColor: pille.richtung ? hell(farbe) : '#f1f2f4',
                },
              },
              h(
                'div',
                { style: { fontSize: 24, fontWeight: 800, color: farbe } },
                pille.wert
              ),
              h(
                'div',
                { style: { fontSize: 22, color: STIL.grau, marginLeft: 10 } },
                pille.name
              )
            ),
          ]
        : [])
    )
  })

  return h(
    'div',
    {
      style: {
        width: ZK_BREITE,
        height: ZK_HOEHE,
        display: 'flex',
        position: 'relative',
        backgroundColor: '#ffffff',
      },
    },
    stilKopf(logo),
    h(
      'div',
      {
        style: {
          position: 'absolute',
          top: 132,
          left: rand,
          right: rand,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Montserrat',
          fontWeight: 800,
          fontSize: 64,
          lineHeight: 1.14,
          letterSpacing: -1,
        },
      },
      /* Je Stück eine Zeile – ein Umbruch mitten in der Frage liest sich schlecht. */
      ...k.titel.map((t, i) =>
        h(
          'div',
          {
            style: {
              display: 'flex',
              alignItems: 'center',
              color: t.gruen ? STIL.navy : STIL.tinte,
            },
          },
          t.text,
          ...(i === 0 && k.symbol
            ? [
                h('img', {
                  src: svgAdresse(SYMBOLE[k.symbol]),
                  width: 64,
                  height: 64,
                  style: { marginLeft: 18 },
                }),
              ]
            : [])
        )
      )
    ),
    stilBlock(k.erklaerung, {
      top: 300,
      left: rand,
      right: rand,
      fontSize: 28,
      lineHeight: 1.42,
      color: STIL.grau,
    }),
    stilBlock(k.stichzeile.toUpperCase(), {
      top: 430,
      left: rand,
      ...GESPERRT,
      color: STIL.navy,
    }),
    ...spalten,
    ...(drei
      ? [1, 2].map((n) =>
          h('div', {
            style: {
              position: 'absolute',
              top: 486,
              left: rand + n * spalte,
              width: 1.5,
              height: 196,
              backgroundColor: STIL.rand,
            },
          })
        )
      : []),
    ...(helden.length === 2
      ? [
          h('div', {
            style: {
              position: 'absolute',
              top: 486,
              left: mitte,
              width: 1.5,
              height: 196,
              backgroundColor: STIL.rand,
            },
          }),
        ]
      : []),
    ...grafik,
    stilBlock(k.fusszeile, {
      top: ZK_HOEHE - 64,
      left: rand,
      right: rand,
      fontSize: 16,
      color: STIL.hellgrau,
    }),
    /*
      Hinweis aufs Weiterwischen, wenn es eine zweite Seite gibt (Betreiber,
      05.11.2026: „irgendwie ein Vermerk, dass es eine zweite Seite gibt.
      Vielleicht so ein Pfeil").
      Schlicht, ohne Fläche (Betreiber zur Navy-Pille: „sieht komisch aus
      und vibe gecodet"): ein grauer Hinweis rechts in der Fußzeile.
    */
    ...('zweiteSeite' in k && k.zweiteSeite
      ? [
          stilBlock('Weiter  →', {
            top: ZK_HOEHE - 79,
            right: rand,
            fontSize: 20,
            fontWeight: 700,
            color: STIL.grau,
          }),
        ]
      : [])
  )
}

/** Die y-Achse des Hausstils: durchgezogene Hilfslinien, Zahlen rechts. */
function stilAchse(
  striche: number[],
  y: (v: number) => number,
  rechts: number,
  einheit: string
) {
  return striche.map((v) =>
    stilBlock(`${v < 0 ? '−' : ''}${Math.abs(v).toLocaleString('de-DE')} ${einheit}`, {
      top: STIL_GRAFIK_O + y(v) - 11,
      left: rechts + 18,
      fontSize: 17,
      color: STIL.hellgrau,
    })
  )
}

function kurvenGrafik(k: Kurvenkarte) {
  const diagrammL = STIL_RAND
  const diagrammR = ZK_BREITE - STIL_RAND - 76
  /* Rand im SVG, damit der Punkt am Linienende nicht abgeschnitten wird. */
  const luft = 10
  const breite = diagrammR - diagrammL
  const hoehe = STIL_GRAFIK_U - STIL_GRAFIK_O
  const anzahl = k.linien[0].punkte.length
  const alle = k.linien.flatMap((l) => l.punkte)
  const schritt = achsenschritt(Math.max(...alle), 5)
  const oben = Math.ceil(Math.max(...alle) / schritt) * schritt
  const x = (i: number) => (i / (anzahl - 1)) * breite
  const y = (v: number) => hoehe - (v / oben) * hoehe
  const pfad = (p: readonly number[]) =>
    p.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')
  const striche = Array.from({ length: oben / schritt + 1 }, (_, i) => i * schritt)

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${breite + 2 * luft}" height="${hoehe + 2 * luft}" viewBox="${-luft} ${-luft} ${breite + 2 * luft} ${hoehe + 2 * luft}">` +
    striche
      .map(
        (v) =>
          `<line x1="0" x2="${breite}" y1="${y(v)}" y2="${y(v)}" stroke="${v ? STIL.rand : '#c9cfd8'}" stroke-width="${v ? 1.5 : 2}"/>`
      )
      .join('') +
    k.linien
      .map((l) => {
        const farbe = l.ton === 'grau' ? STIL.hellgrau : stilFarbe(l.richtung)
        return (
          `<path d="${pfad(l.punkte)}" fill="none" stroke="${farbe}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/>` +
          `<circle cx="${x(anzahl - 1)}" cy="${y(l.punkte[anzahl - 1])}" r="7" fill="#ffffff" stroke="${farbe}" stroke-width="3.5"/>`
        )
      })
      .join('') +
    '</svg>'

  return [
    h('img', {
      src: svgAdresse(svg),
      width: breite + 2 * luft,
      height: hoehe + 2 * luft,
      style: { position: 'absolute', left: diagrammL - luft, top: STIL_GRAFIK_O - luft },
    }),
    ...stilAchse(striche, y, diagrammR, k.einheit),
    ...(k.namenAnKurve
      ? k.linien.map((l) => {
          const hoch = Math.max(...l.punkte)
          const i = l.punkte.indexOf(hoch)
          return stilBlock(l.name, {
            top: STIL_GRAFIK_O + y(hoch) - 36,
            left: diagrammL + x(i) - 100,
            width: 200,
            justifyContent: 'center',
            fontSize: 20,
            fontWeight: 700,
            color: l.ton === 'grau' ? STIL.hellgrau : stilFarbe(l.richtung),
          })
        })
      : []),
    ...k.achse.map((a, i) =>
      stilBlock(a.text, {
        top: STIL_GRAFIK_U + 16,
        /* Erste und letzte Jahreszahl bündig mit dem Rand, nicht über ihn hinaus. */
        left:
          i === 0
            ? diagrammL
            : i === k.achse.length - 1
              ? diagrammL + x(a.bei) - 80
              : diagrammL + x(a.bei) - 40,
        width: 80,
        justifyContent:
          i === 0 ? 'flex-start' : i === k.achse.length - 1 ? 'flex-end' : 'center',
        fontSize: 17,
        color: STIL.hellgrau,
      })
    ),
  ]
}

function kurvenBild(k: Kurvenkarte, logo: string) {
  const helden: Held[] = k.linien.map((l, n) => ({
    name: l.name,
    wert: l.ende,
    richtung: l.richtung,
    pille: k.kennzahlen[n],
  }))
  return stilBild(k, logo, helden, kurvenGrafik(k))
}

/**
 * Die Säulen: Wert über jeder Säule in ihrer Richtungsfarbe, Beschriftung
 * darunter, Hilfslinien und Zahlen rechts wie bei der Kurve. Negative Werte
 * hängen unter der Nulllinie.
 */
function saeulenGrafik(k: Saeulenkarte) {
  const links = STIL_RAND
  const rechts = ZK_BREITE - STIL_RAND - 76
  const breite = rechts - links
  /* Platz über der höchsten Säule für ihren Wert. */
  const kopf = 40
  /* Mit Porträts wird die Grafik um ihre Reihe kürzer; die Jahreszahlen bleiben, wo sie sind. */
  const mitBild = k.saeulen.some((z) => z.bild)
  const bild = 78
  /*
    Mit Symbolen rückt die Beschriftung über die Bildchen; die Grafik wird
    um ihre Reihe kürzer, beginnt dafür aber höher (Betreiber 07.11.2026:
    „die Tabelle etwas hoch machen") – Platz, den eine einzelne Heldenzahl
    ohnehin frei lässt.
  */
  const mitSymbol = k.saeulen.some((z) => z.symbol)
  const symbol = 74
  const anheben = mitSymbol ? 40 : 0
  const unterkante = STIL_GRAFIK_U - (mitSymbol ? 58 : 0)
  const oberkante = STIL_GRAFIK_O - anheben
  const hoehe = unterkante - STIL_GRAFIK_O + anheben - (mitBild ? bild + 18 : 0)
  const werte = k.saeulen.map((z) => z.wert)
  const schritt = achsenschritt(Math.max(...werte.map(Math.abs)), 4)
  const oben = Math.ceil(Math.max(0, ...werte) / schritt) * schritt
  const unten = Math.floor(Math.min(0, ...werte) / schritt) * schritt
  const y = (v: number) => kopf + ((oben - v) / (oben - unten)) * hoehe
  const striche = Array.from(
    { length: (oben - unten) / schritt + 1 },
    (_, i) => unten + i * schritt
  )
  const fach = breite / k.saeulen.length
  const saeule = Math.min(64, fach * 0.62)
  /* Über den Säulen nur „%" hinter der Zahl; ein Wort wie „Sitze" steht an der Achse. */
  const zahl = (v: number) =>
    `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toLocaleString('de-DE', {
      minimumFractionDigits: k.nachkomma ?? 1,
      maximumFractionDigits: k.nachkomma ?? 1,
    })}${k.einheit === '%' ? ' %' : ''}`

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${breite}" height="${hoehe + kopf}" viewBox="0 0 ${breite} ${hoehe + kopf}">` +
    striche
      .map(
        (v) =>
          `<line x1="0" x2="${breite}" y1="${y(v)}" y2="${y(v)}" stroke="${v ? STIL.rand : '#c9cfd8'}" stroke-width="${v ? 1.5 : 2}"/>`
      )
      .join('') +
    k.saeulen
      .map((z, i) => {
        const x = i * fach + (fach - saeule) / 2
        const o = Math.min(y(z.wert), y(0))
        const hh = Math.abs(y(z.wert) - y(0))
        return `<rect x="${x}" y="${o}" width="${saeule}" height="${hh}" rx="6" fill="${stilFarbe(z.wert >= 0 ? 'steigt' : 'faellt')}"/>`
      })
      .join('') +
    '</svg>'

  return [
    h('img', {
      src: svgAdresse(svg),
      width: breite,
      height: hoehe + kopf,
      style: { position: 'absolute', left: links, top: oberkante - kopf },
    }),
    ...stilAchse(striche, (v) => y(v) - kopf - anheben, rechts, k.einheit),
    ...k.saeulen.flatMap((z, i) => [
      stilBlock(zahl(z.wert), {
        top: oberkante - kopf + (z.wert >= 0 ? y(z.wert) - 30 : y(z.wert) + 6),
        left: links + i * fach,
        width: fach,
        justifyContent: 'center',
        fontSize: 20,
        fontWeight: 800,
        color: stilFarbe(z.wert >= 0 ? 'steigt' : 'faellt'),
      }),
      ...(z.bild
        ? [
            h('img', {
              src: `data:image/jpeg;base64,${readFileSync(join(FOTO_ORDNER, z.bild)).toString('base64')}`,
              width: bild,
              height: bild,
              style: {
                position: 'absolute',
                top: STIL_GRAFIK_U - bild + 4,
                left: links + i * fach + (fach - bild) / 2,
                borderRadius: bild,
                border: `2px solid ${STIL.rand}`,
              },
            }),
          ]
        : []),
      stilBlock(z.text, {
        top: unterkante + 16,
        left: links + i * fach,
        width: fach,
        justifyContent: 'center',
        /* Dunkel und halbfett (07.11.2026, Betreiber: „nicht so in einem Grauton … dass man's richtig lesen kann"). */
        fontSize: 18,
        fontWeight: 600,
        color: STIL.tinte,
      }),
      ...(z.symbol
        ? [
            h('img', {
              src: `data:image/${z.symbol.endsWith('.svg') ? 'svg+xml' : 'jpeg'};base64,${readFileSync(join(SYMBOL_ORDNER, z.symbol)).toString('base64')}`,
              width: symbol,
              height: symbol,
              style: {
                position: 'absolute',
                top: unterkante + 42,
                left: links + i * fach + (fach - symbol) / 2,
                ...(z.symbol.endsWith('.svg')
                  ? {}
                  : { borderRadius: symbol, border: `2px solid ${STIL.rand}` }),
              },
            }),
          ]
        : []),
    ]),
  ]
}

/* Je Linie eine Farbe – gedeckt, ohne Grün und Rot, die eine Richtung tragen. */
const LINIENFARBEN = [
  '#0b1220',
  '#17296F',
  '#3f6fb5',
  '#6b4fa0',
  '#b07a2a',
  '#2f8a8a',
  '#8a5a44',
  '#c0568a',
  '#5b6472',
]

function personenGrafik(k: Personenkarte) {
  const bild = 150
  const oben = 500
  const zeile = (1210 - oben) / k.personen.length
  return k.personen.flatMap((pe, i) => {
    const o = oben + i * zeile
    const textLinks = STIL_RAND + bild + 36
    return [
      ...(pe.bild
        ? [
            h('img', {
              src: `data:image/jpeg;base64,${readFileSync(join(FOTO_ORDNER, pe.bild)).toString('base64')}`,
              width: bild,
              height: bild,
              style: {
                position: 'absolute',
                top: o,
                left: STIL_RAND,
                borderRadius: bild,
                objectFit: 'cover',
                border: `3px solid ${STIL.rand}`,
              },
            }),
          ]
        : []),
      stilBlock(pe.name, {
        top: o + 14,
        left: textLinks,
        fontSize: 36,
        fontWeight: 800,
        color: STIL.tinte,
      }),
      stilBlock(pe.zeile, {
        top: o + 64,
        left: textLinks,
        width: ZK_BREITE - textLinks - STIL_RAND,
        fontSize: 22,
        color: STIL.grau,
      }),
      stilBlock(pe.stand, {
        top: o + 100,
        left: textLinks,
        width: ZK_BREITE - textLinks - STIL_RAND,
        fontSize: 22,
        fontWeight: 700,
        color: STIL.navy,
      }),
    ]
  })
}

const PARTEIFARBE = { blau: '#1f4fa3', rot: '#b3262d', offen: '#d5dae2' }

function kammerGrafik(k: Kammerkarte) {
  const links = STIL_RAND
  const breite = ZK_BREITE - 2 * STIL_RAND
  const dicke = 70
  const zeile = (STIL_GRAFIK_U - STIL_GRAFIK_O) / k.kammern.length
  return k.kammern.flatMap((ka, n) => {
    const oben = STIL_GRAFIK_O + n * zeile
    const balkenOben = oben + 44
    let x = links
    const stuecke = ka.teile.map((t) => {
      const w = (t.wert / ka.gesamt) * breite
      const s = { t, x, w }
      x += w
      return s
    })
    const strich = links + (ka.mehrheit / ka.gesamt) * breite
    return [
      stilBlock(ka.name, {
        top: oben,
        left: links,
        fontSize: 26,
        fontWeight: 800,
        color: STIL.tinte,
      }),
      stilBlock(
        `${ka.gesamt.toLocaleString('de-DE')} Sitze · Mehrheit ab ${ka.mehrheit}`,
        {
          top: oben + 6,
          left: links,
          width: breite,
          justifyContent: 'flex-end',
          fontSize: 19,
          color: STIL.grau,
        }
      ),
      ...stuecke.map((s, i) =>
        h('div', {
          style: {
            position: 'absolute',
            top: balkenOben,
            left: s.x + (i ? 2 : 0),
            width: s.w - (i ? 2 : 0),
            height: dicke,
            backgroundColor: PARTEIFARBE[s.t.farbe],
            borderTopLeftRadius: i === 0 ? 8 : 0,
            borderBottomLeftRadius: i === 0 ? 8 : 0,
            borderTopRightRadius: i === stuecke.length - 1 ? 8 : 0,
            borderBottomRightRadius: i === stuecke.length - 1 ? 8 : 0,
          },
        })
      ),
      h('div', {
        style: {
          position: 'absolute',
          top: balkenOben - 10,
          left: strich - 1.5,
          width: 3,
          height: dicke + 20,
          backgroundColor: STIL.tinte,
        },
      }),
      ...stuecke.map((s, i) =>
        h(
          'div',
          {
            style: {
              position: 'absolute',
              top: balkenOben + dicke + 14,
              /* Das letzte Stück rechtsbündig – sonst überlappt es ein schmales davor. */
              left: i === stuecke.length - 1 && i > 0 ? links + breite - 320 : s.x,
              width: i === stuecke.length - 1 && i > 0 ? 320 : Math.max(s.w, 150),
              display: 'flex',
              flexDirection: 'column',
              alignItems: i === stuecke.length - 1 && i > 0 ? 'flex-end' : 'flex-start',
              fontFamily: 'Montserrat',
            },
          },
          h(
            'span',
            {
              style: {
                fontSize: 30,
                fontWeight: 800,
                color: s.t.farbe === 'offen' ? STIL.hellgrau : PARTEIFARBE[s.t.farbe],
              },
            },
            s.t.wert.toLocaleString('de-DE')
          ),
          h('span', { style: { fontSize: 18, color: STIL.grau } }, s.t.name)
        )
      ),
    ]
  })
}

function vielfachGrafik(k: Vielfachkarte) {
  /*
    Alle Reihen in einem Koordinatensystem (Betreiber, 03.11.2026: „jedes
    Land hat seinen eigenen Graphen, aber zusammen in einer
    XY-Koordinate"). Logarithmische y-Achse, sonst lägen 60 Nordkoreas
    unsichtbar unter 4.400 Russlands. Die Gesamtkurve gestrichelt in Grau.
  */
  const links = STIL_RAND + 70
  const rechts = ZK_BREITE - STIL_RAND - 190
  const breite = rechts - links
  const oben = STIL_GRAFIK_O - 30
  const hoehe = STIL_GRAFIK_U - oben
  const anzahl = k.gesamt.punkte.length
  const alle = [k.gesamt, ...k.teile].flatMap((r) => r.punkte).filter((v) => v > 0)
  const unten = Math.pow(10, Math.floor(Math.log10(Math.min(...alle))))
  const decke = Math.pow(10, Math.ceil(Math.log10(Math.max(...alle))))
  const y = (v: number) =>
    hoehe -
    ((Math.log10(Math.max(v, unten)) - Math.log10(unten)) /
      (Math.log10(decke) - Math.log10(unten))) *
      hoehe
  const x = (i: number) => (i / (anzahl - 1)) * breite
  /* Erst ab dem ersten Sprengkopf zeichnen – log(0) gibt es nicht. */
  const pfad = (p: readonly number[]) => {
    let d = ''
    p.forEach((v, i) => {
      if (v <= 0) return
      d += `${d ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`
    })
    return d
  }
  const striche: number[] = []
  for (let v = unten; v <= decke; v *= 10) striche.push(v)
  const reihen = [
    {
      name: k.gesamt.name,
      wert: k.gesamt.punkte.at(-1)!.toLocaleString('de-DE'),
      punkte: k.gesamt.punkte,
      farbe: '#9aa3b0',
      welt: true,
    },
    ...k.teile.map((t, n) => ({
      ...t,
      farbe: LINIENFARBEN[n % LINIENFARBEN.length],
      welt: false,
    })),
  ]
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${breite + 20}" height="${hoehe + 20}" viewBox="-10 -10 ${breite + 20} ${hoehe + 20}">` +
    striche
      .map(
        (v, i) =>
          `<line x1="0" x2="${breite}" y1="${y(v)}" y2="${y(v)}" stroke="${i ? STIL.rand : '#c9cfd8'}" stroke-width="${i ? 1.5 : 2}"/>`
      )
      .join('') +
    reihen
      .map(
        (r) =>
          `<path d="${pfad(r.punkte)}" fill="none" stroke="${r.farbe}" stroke-width="${r.welt ? 3 : 3}" ${r.welt ? 'stroke-dasharray="8 6"' : ''} stroke-linejoin="round" stroke-linecap="round"/>` +
          `<circle cx="${x(anzahl - 1)}" cy="${y(r.punkte[anzahl - 1])}" r="5" fill="#fff" stroke="${r.farbe}" stroke-width="3"/>`
      )
      .join('') +
    '</svg>'

  /* Namen am Linienende, auseinandergeschoben, wo sie sich sonst überlägen. */
  const abstand = 25
  const schilder = reihen
    .map((r) => ({ r, ziel: y(r.punkte[anzahl - 1]) }))
    .sort((a, b) => a.ziel - b.ziel)
  let zuletzt = -Infinity
  for (const s of schilder) {
    const lage = Math.max(s.ziel, zuletzt + abstand)
    ;(s as { lage?: number }).lage = lage
    zuletzt = lage
  }
  /* Ragt der unterste über den Rand, rückt alles nach oben. */
  const ueber = zuletzt - (hoehe + 6)
  if (ueber > 0) for (const s of schilder) (s as { lage?: number }).lage! -= ueber

  return [
    h('img', {
      src: svgAdresse(svg),
      width: breite + 20,
      height: hoehe + 20,
      style: { position: 'absolute', left: links - 10, top: oben - 10 },
    }),
    ...striche.map((v) =>
      stilBlock(v.toLocaleString('de-DE'), {
        top: oben + y(v) - 11,
        left: STIL_RAND - 10,
        width: 70,
        justifyContent: 'flex-end',
        fontSize: 16,
        color: STIL.hellgrau,
      })
    ),
    ...k.achse.map((a) =>
      stilBlock(a.text, {
        top: oben + hoehe + 12,
        left: links + x(a.bei) - 40,
        width: 80,
        justifyContent: 'center',
        fontSize: 16,
        color: STIL.hellgrau,
      })
    ),
    ...schilder.map((s) =>
      h(
        'div',
        {
          style: {
            position: 'absolute',
            top: oben + (s as { lage?: number }).lage! - 12,
            left: rechts + 16,
            display: 'flex',
            alignItems: 'baseline',
            fontFamily: 'Montserrat',
          },
        },
        h(
          'span',
          { style: { fontSize: 18, fontWeight: 800, color: s.r.farbe, marginRight: 8 } },
          s.r.wert
        ),
        h(
          'span',
          {
            style: {
              fontSize: 17,
              fontWeight: 700,
              color: s.r.welt ? STIL.grau : s.r.farbe,
            },
          },
          s.r.name
        )
      )
    ),
  ]
}

function balkenGrafik(k: Balkenkarte) {
  /*
    Links die Beschriftung (Jahr fett, Anlass grau), rechts die Balken an
    einer Nulllinie: fallende Werte nach links, steigende nach rechts.
  */
  const spalte = STIL_RAND + 330
  const rechts = ZK_BREITE - STIL_RAND - 110
  const plus = Math.max(0, ...k.balken.map((b) => b.wert))
  const minus = Math.max(0, ...k.balken.map((b) => -b.wert))
  /* Links der Nulllinie Platz für die Zahl hinter dem längsten fallenden Balken. */
  const luftLinks = minus > 0 ? 100 : 0
  const massstab = (rechts - spalte - luftLinks) / (plus + minus)
  const null_ = spalte + luftLinks + minus * massstab
  const zeile = (STIL_GRAFIK_U - STIL_GRAFIK_O + 40) / k.balken.length
  const dicke = Math.min(30, zeile * 0.45)
  const oben0 = STIL_GRAFIK_O - 30
  const zahl = (v: number) =>
    `${k.vorzeichen === false ? '' : v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(Math.round(v)).toLocaleString('de-DE')}${k.einheit === '%' ? ' %' : ` ${k.einheit}`}`
  return [
    h('div', {
      style: {
        position: 'absolute',
        top: oben0,
        left: null_ - 1,
        width: 2,
        height: zeile * k.balken.length,
        backgroundColor: '#c9cfd8',
      },
    }),
    ...k.balken.flatMap((b, i) => {
      const mitte = oben0 + i * zeile + zeile / 2
      const laenge = Math.max(4, Math.abs(b.wert) * massstab)
      const farbe = b.hervor ? STIL.tinte : '#b4bcc8'
      const links = b.wert >= 0 ? null_ : null_ - laenge
      return [
        h(
          'div',
          {
            style: {
              position: 'absolute',
              top: mitte - 19,
              left: STIL_RAND,
              width: spalte - STIL_RAND - 16,
              display: 'flex',
              alignItems: 'baseline',
              fontFamily: 'Montserrat',
            },
          },
          h(
            'span',
            {
              style: {
                fontSize: 22,
                fontWeight: 800,
                color: STIL.tinte,
                marginRight: 12,
              },
            },
            b.marke
          ),
          h(
            'span',
            { style: { fontSize: 19, color: b.hervor ? STIL.tinte : STIL.grau } },
            b.text
          )
        ),
        h('div', {
          style: {
            position: 'absolute',
            top: mitte - dicke / 2,
            left: links,
            width: laenge,
            height: dicke,
            borderRadius: 5,
            backgroundColor: farbe,
          },
        }),
        stilBlock(zahl(b.wert), {
          top: mitte - 15,
          ...(b.wert >= 0
            ? { left: null_ + laenge + 12 }
            : { left: links - 112, width: 100, justifyContent: 'flex-end' }),
          fontSize: 22,
          fontWeight: 800,
          color: b.hervor ? STIL.tinte : STIL.grau,
        }),
      ]
    }),
  ]
}

/** Ein Datum JJJJ-MM-TT als Jahr mit Bruchteil – genug für eine Balkenlänge. */
function jahrBruch(d: string): number {
  const [j, m, t] = d.split('-').map(Number)
  return j + (m - 1) / 12 + (t - 1) / 365
}

function zeitstrahlGrafik(k: Zeitstrahlkarte) {
  const bild = 72
  const links = STIL_RAND + bild + 24
  const rechts = ZK_BREITE - STIL_RAND
  const anfang = Math.min(...k.balken.map((b) => jahrBruch(b.beginn)), ...k.achse)
  const schluss = Math.max(
    ...k.balken.map((b) => jahrBruch(b.regelEnde ?? b.ende)),
    ...k.achse
  )
  /* Platz rechts für die Beschriftung hinter dem längsten Balken. */
  const x = (j: number) =>
    links + ((j - anfang) / (schluss - anfang)) * (rechts - links - 110)
  const achseY = STIL_GRAFIK_U - 10
  const zeile = (achseY - STIL_GRAFIK_O) / k.balken.length
  const dicke = 30
  const oben = STIL_GRAFIK_O

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${ZK_BREITE}" height="${achseY - oben + 2}" viewBox="0 ${oben} ${ZK_BREITE} ${achseY - oben + 2}">` +
    k.achse
      .map(
        (j) =>
          `<line x1="${x(j)}" x2="${x(j)}" y1="${oben}" y2="${achseY}" stroke="${STIL.rand}" stroke-width="1.5"/>`
      )
      .join('') +
    `<line x1="${links}" x2="${rechts}" y1="${achseY}" y2="${achseY}" stroke="#c9cfd8" stroke-width="2"/>` +
    k.balken
      .map((b, i) => {
        const mitte = oben + zeile * i + zeile / 2 + 12
        const farbe = b.hervor ? STIL.tinte : '#b4bcc8'
        const x0 = x(jahrBruch(b.beginn))
        const x1 = x(jahrBruch(b.ende))
        const rest = b.regelEnde
          ? `<rect x="${x1 + 3}" y="${mitte - dicke / 2 + 1.5}" width="${x(jahrBruch(b.regelEnde)) - x1 - 4.5}" height="${dicke - 3}" rx="5" fill="none" stroke="${farbe}" stroke-width="2.5" stroke-dasharray="7 6"/>`
          : ''
        return `<rect x="${x0}" y="${mitte - dicke / 2}" width="${x1 - x0}" height="${dicke}" rx="6" fill="${farbe}"/>${rest}`
      })
      .join('') +
    '</svg>'

  return [
    h('img', {
      src: svgAdresse(svg),
      width: ZK_BREITE,
      height: achseY - oben + 2,
      style: { position: 'absolute', left: 0, top: oben },
    }),
    ...k.balken.flatMap((b, i) => {
      const mitte = oben + zeile * i + zeile / 2 + 12
      const ende = x(jahrBruch(b.regelEnde ?? b.ende))
      return [
        ...(b.bild
          ? [
              h('img', {
                src: `data:image/jpeg;base64,${readFileSync(join(FOTO_ORDNER, b.bild)).toString('base64')}`,
                width: bild,
                height: bild,
                style: {
                  position: 'absolute',
                  top: mitte - bild / 2 - 10,
                  left: STIL_RAND,
                  borderRadius: bild,
                  objectFit: 'cover',
                  border: `2px solid ${STIL.rand}`,
                },
              }),
            ]
          : []),
        stilBlock(b.name, {
          top: mitte - dicke / 2 - 32,
          left: x(jahrBruch(b.beginn)),
          fontSize: 20,
          fontWeight: 700,
          color: b.hervor ? STIL.tinte : STIL.grau,
        }),
        stilBlock(b.text, {
          top: mitte - 14,
          left: ende + 14,
          fontSize: 22,
          fontWeight: 800,
          color: b.hervor ? STIL.tinte : STIL.grau,
        }),
      ]
    }),
    ...k.achse.map((j) =>
      stilBlock(String(j), {
        top: achseY + 12,
        left: x(j) - 40,
        width: 80,
        justifyContent: 'center',
        fontSize: 17,
        color: STIL.hellgrau,
      })
    ),
  ]
}

/* ------------------------------------------------------------ Duell */

/** Veränderung vom ersten bis zum letzten Schlusskurs, in Prozent. */
export function duellProzent(sei: Duellseite): number {
  return (sei.punkte.at(-1)!.wert / sei.punkte[0].wert - 1) * 100
}

/** „+4,0 %" – eine Nachkommastelle, deutsches Komma, Vorzeichen. */
export const prozentText = (w: number, stellen = 1) =>
  `${w > 0 ? '+' : w < 0 ? '−' : ''}${Math.abs(w).toLocaleString('de-DE', { minimumFractionDigits: stellen, maximumFractionDigits: stellen })} %`

const LOGO_GRUEN = '#205437'
const LOGO_ROT = '#8B2225'

function duellGrafik(k: Duellkarte) {
  /*
    Tragen die Zahlen der Überschrift schon Grün und Rot (`richtung`), steht
    die Differenz schwarz – sonst wären es mit Schwarz vier Farben (Betreiber,
    30.10.2026: „Das wird dann zu bunt").
  */
  const akzent = k.titel.some((t) => t.richtung) ? SCHWARZ : akzentfarbe(k.datum)
  const seiten = [k.links, k.rechts].map((sei) => ({
    sei,
    reihe: sei.punkte.map((p) => ({
      t: p.t,
      p: (p.wert / sei.punkte[0].wert - 1) * 100,
    })),
    prozent: duellProzent(sei),
  }))
  /* Beide Felder auf derselben Skala – sonst sähe −5 % aus wie +4 %. */
  const alle = seiten.flatMap((x) => x.reihe.map((r) => r.p))
  /*
    Höchstens vier Abschnitte. Die Liste endete bei 10, sonst 20 – bei der
    Gas-Schere (30.10.2026, +247 %) ergab das vierzehn Teilstriche, deren
    Beschriftung in die Nachbarzeile umbrach.
  */
  const schritt =
    [1, 2, 2.5, 5, 10, 20, 25, 50, 100, 200, 250, 500].find(
      (x) => (Math.max(...alle, 0) - Math.min(...alle, 0)) / x <= 4
    ) ?? 1000
  const unten = Math.floor(Math.min(...alle, 0) / schritt) * schritt
  const oben = Math.ceil(Math.max(...alle, 0) / schritt) * schritt
  const teil: number[] = []
  for (let w = unten; w <= oben + 1e-9; w += schritt) teil.push(Math.round(w * 10) / 10)

  const FELD_B = 485
  const FELD_H = 470
  const OBEN = 560
  /* 86 statt 74: „+300 %" brach bei 74 px in zwei Zeilen (30.10.2026). */
  const P_L = 86
  const P_R = 18
  const P_O = 128
  const P_U = 46
  const pb = FELD_B - P_L - P_R
  const ph = FELD_H - P_O - P_U

  const feld = (x: (typeof seiten)[number], links: number) => {
    const farbe = x.prozent >= 0 ? LOGO_GRUEN : LOGO_ROT
    const n = x.reihe.length - 1
    /* 12 px Luft rechts, sonst schneidet der Rand den Endpunkt ab. */
    const px = (i: number) => (i / n) * (pb - 12)
    const py = (w: number) => ph - ((w - unten) / (oben - unten)) * ph
    const linie = x.reihe
      .map((r, i) => `${px(i).toFixed(1)},${py(r.p).toFixed(1)}`)
      .join(' ')
    const flaeche = `0,${py(0).toFixed(1)} ${linie} ${px(n).toFixed(1)},${py(0).toFixed(1)}`
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${pb}" height="${ph}" viewBox="0 0 ${pb} ${ph}">` +
      teil
        .map((w) =>
          w === 0
            ? `<line x1="0" x2="${pb}" y1="${py(w).toFixed(1)}" y2="${py(w).toFixed(1)}" stroke="#333" stroke-width="2.5"/>`
            : `<line x1="0" x2="${pb}" y1="${py(w).toFixed(1)}" y2="${py(w).toFixed(1)}" stroke="#d0d0d0" stroke-width="2" stroke-dasharray="6 6"/>`
        )
        .join('') +
      `<polygon points="${flaeche}" fill="${farbe}" fill-opacity="0.13"/>` +
      `<polyline points="${linie}" fill="none" stroke="${farbe}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>` +
      `<line x1="1.5" x2="1.5" y1="0" y2="${ph}" stroke="#333" stroke-width="3"/>` +
      `<line x1="0" x2="${pb}" y1="${ph - 1.5}" y2="${ph - 1.5}" stroke="#333" stroke-width="3"/>` +
      `<circle cx="${px(n).toFixed(1)}" cy="${py(x.reihe[n].p).toFixed(1)}" r="8" fill="${farbe}"/>` +
      `</svg>`
    const tage = [0, Math.round(n / 2), n]
    return h(
      'div',
      {
        style: {
          position: 'absolute',
          left: links,
          top: OBEN,
          width: FELD_B,
          height: FELD_H,
          borderRadius: 22,
          border: '2px solid #e2e2e2',
          display: 'flex',
        },
      },
      h(
        'div',
        {
          style: {
            position: 'absolute',
            left: 22,
            top: 16,
            display: 'flex',
            alignItems: 'center',
          },
        },
        x.sei.land ? flagge(FLAGGEN[x.sei.land], 44, 2) : h('div', {}),
        h(
          'div',
          { style: { display: 'flex', flexDirection: 'column', marginLeft: 12 } },
          h(
            'div',
            {
              style: {
                fontFamily: 'Anton',
                fontSize: 38,
                color: SCHWARZ,
                lineHeight: 1.1,
              },
            },
            x.sei.name
          ),
          h(
            'div',
            { style: { fontFamily: 'Open', fontSize: 20, color: MITTELGRAU } },
            x.sei.zusatz
          )
        )
      ),
      h(
        'div',
        {
          style: {
            position: 'absolute',
            right: 18,
            top: 22,
            padding: '6px 14px',
            borderRadius: 10,
            backgroundColor: farbe,
            color: '#fff',
            fontFamily: 'Open',
            fontWeight: 800,
            fontStyle: 'italic',
            fontSize: 34,
            display: 'flex',
          },
        },
        prozentText(x.prozent, 2)
      ),
      ...teil.map((w) =>
        h(
          'div',
          {
            style: {
              position: 'absolute',
              left: 4,
              width: P_L - 12,
              top: P_O + py(w) - 13,
              display: 'flex',
              justifyContent: 'flex-end',
              fontFamily: 'Open',
              fontSize: 19,
              fontWeight: w === 0 ? 700 : 400,
              color: GRAU,
              whiteSpace: 'nowrap',
            },
          },
          `${w > 0 ? '+' : ''}${w.toLocaleString('de-DE')} %`
        )
      ),
      h('img', {
        src: svgAdresse(svg),
        width: pb,
        height: ph,
        style: { position: 'absolute', left: P_L, top: P_O },
      }),
      ...tage.map((i, j) =>
        h(
          'div',
          {
            style: {
              position: 'absolute',
              left: P_L + px(i) - (j === 0 ? 0 : j === 2 ? 70 : 35),
              width: 70,
              top: P_O + ph + 8,
              display: 'flex',
              justifyContent: j === 0 ? 'flex-start' : j === 2 ? 'flex-end' : 'center',
              fontFamily: 'Open',
              fontSize: 19,
              color: GRAU,
            },
          },
          `${x.reihe[i].t.slice(8, 10)}.${x.reihe[i].t.slice(5, 7)}.`
        )
      )
    )
  }

  const differenz = Math.abs(seiten[0].prozent - seiten[1].prozent)
  return [
    h(
      'div',
      {
        style: {
          position: 'absolute',
          top: RL_UNTERZEILE,
          left: 60,
          right: 60,
          display: 'flex',
          fontFamily: 'Open',
          fontWeight: 700,
          fontSize: 28,
          color: GRAU,
        },
      },
      k.unterzeile
    ),
    feld(seiten[0], 40),
    feld(seiten[1], 40 + FELD_B + 30),
    h(
      'div',
      {
        style: {
          position: 'absolute',
          left: 40,
          right: 40,
          top: OBEN + FELD_H + 24,
          height: 130,
          borderRadius: 22,
          border: '2px solid #e2e2e2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
      },
      h(
        'div',
        {
          style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            marginRight: 24,
          },
        },
        h(
          'div',
          { style: { fontFamily: 'Open', fontWeight: 700, fontSize: 26, color: GRAU } },
          'Differenz'
        ),
        h(
          'div',
          { style: { fontFamily: 'Open', fontSize: 20, color: MITTELGRAU } },
          `${k.links.name} vs. ${k.rechts.name}`
        )
      ),
      h(
        'div',
        { style: { fontFamily: 'Anton', fontSize: 92, color: akzent, lineHeight: 1 } },
        differenz.toLocaleString('de-DE', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      ),
      h(
        'div',
        { style: { fontFamily: 'Anton', fontSize: 46, color: SCHWARZ, marginLeft: 16 } },
        'Prozentpunkte'
      )
    ),
  ]
}

/* ------------------------------------------------------------------------ */
/* Zahlenstrahl (Sorte D, 07.11.2026)                                        */
/* ------------------------------------------------------------------------ */

/** Der Kontoname, klein auf jeder Karussellkachel ohne Logo. */
export const ABSENDER = '@im_invests'

const ZS_ACHSE = 640
const ZS_RECHTS = 150
const ZS_LOGO_B = 210
const ZS_LOGO_H = 86
const ZS_ETIKETT = 250
/** Höhe eines Etiketts: Logo, Zahl, Name, Zusatz. */
const ZS_HOCH = 224
/** Abstand der nahen Reihe zur Achse; die ferne liegt eine Etiketthöhe weiter. */
const ZS_NAH = 56

/*
  Vier Reihen für Etiketten (08.11.2026, Betreiber: „noch ein paar weitere
  Börsengänge rein"): nah über, nah unter, fern über, fern unter der Achse.
  Elf Börsengänge zwischen 16 und 29 Mrd. $ fänden in zwei Reihen keinen
  Platz.
*/
type Reihe = 0 | 1 | 2 | 3

function pruefeZahlenstrahl(k: Zahlenstrahlkarte): string[] {
  const f: string[] = []
  /* Mit gleichen Abständen genügen vier Kacheln (07.11.2026, „weniger Slides"). */
  const mindestens = k.gleichmaessig ? 4 : 5
  if (k.kacheln < mindestens || k.kacheln > 8)
    f.push(`${k.kacheln} Kacheln – ${mindestens === 4 ? 'vier' : 'fünf'} bis acht.`)
  /* „Es müssen immer 2 auf einer Seite sein" (07.11.2026). */
  if (k.gleichmaessig && k.punkte.length !== 2 * (k.kacheln - 1))
    f.push(
      `${k.punkte.length} Punkte auf ${k.kacheln - 1} Kacheln – je Kachel genau zwei, also ${2 * (k.kacheln - 1)}.`
    )
  if (k.punkte.length < 3) f.push(`${k.punkte.length} Punkte – mindestens drei.`)
  /* Mit gleichen Abständen gilt die Reihenfolge der Liste – etwa nach Jahr (07.11.2026). */
  for (let i = 1; i < k.punkte.length && !k.gleichmaessig; i++)
    if (k.punkte[i].wert < k.punkte[i - 1].wert)
      f.push(
        `Punkt „${k.punkte[i].name}" ist kleiner als der davor – aufsteigend ordnen.`
      )
  for (const p of k.punkte) {
    if (!p.offen && (p.wert < (k.start ?? 0) || p.wert > k.bis))
      f.push(`Punkt „${p.name}" liegt außerhalb der Achse.`)
    if (p.logo !== undefined && !existsSync(join(LOGO_ORDNER, p.logo)))
      f.push(`Logo „${p.logo}" fehlt in lib/instagram/logos/.`)
  }
  for (const z of k.saetze)
    if (z.kachel < 2 || z.kachel > k.kacheln)
      f.push(`Satz für Kachel ${z.kachel} – es gibt nur 2 bis ${k.kacheln}.`)
  if (k.erklaerung.length > 60)
    f.push(`Unterzeile hat ${k.erklaerung.length} Zeichen – höchstens 60, Stichpunkte.`)
  if (k.titel.length > 2 || k.titel.some((t) => t.text.length > 22))
    f.push('Der Titel hat höchstens zwei Stücke zu je 22 Zeichen – eine Zeile je Stück.')
  /* Keine leere Kachel (08.11.2026, Betreiber: „gar keine, die leer sind"). */
  const belegt = new Set(
    k.punkte.map((p, i) => Math.floor(zahlenstrahlX(k, p.wert, i) / ZK_BREITE) + 1)
  )
  for (let nr = 2; nr <= k.kacheln; nr++)
    if (!belegt.has(nr)) f.push(`Kachel ${nr} hat keinen Punkt – keine leere Kachel.`)
  for (const [i, p] of k.punkte.entries()) {
    const rand = zahlenstrahlX(k, p.wert, i) % ZK_BREITE
    if (rand < 24 || rand > ZK_BREITE - 24)
      f.push(
        `Punkt „${p.name}" liegt auf der Kante zweier Kacheln – \`bis\` verschieben.`
      )
  }
  const plan = zahlenstrahlPlan(k)
  if (plan.some((e) => e.reihe === undefined))
    f.push('Zu viele Punkte zu dicht – nicht jedes Etikett findet Platz.')
  return f
}

/**
 * Wo ein Wert auf der Panoramafläche liegt – linear. Kachel 1 trägt den
 * Titel; die Werte beginnen auf Kachel 2, die Achse läuft schon herein.
 */
function zahlenstrahlX(k: Zahlenstrahlkarte, wert: number, stelle = -1): number {
  const breite = k.kacheln * ZK_BREITE
  if (k.gleichmaessig) {
    /* Die Stelle in der Reihe, nicht der Wert: gleiche Abstände ab Kachel 2. */
    const schritt = (breite - ZK_BREITE) / k.punkte.length
    return ZK_BREITE + (Math.max(stelle, 0) + 0.5) * schritt
  }
  const start = ZK_BREITE + 60
  const ab = k.start ?? 0
  return start + ((wert - ab) / (k.bis - ab)) * (breite - start - ZS_RECHTS)
}

/** Etikett: ganz auf der Kachel seines Punkts, nie über die Kante. */
function zahlenstrahlEtikettX(x: number, breite = ZS_ETIKETT): number {
  const kachel = Math.floor(x / ZK_BREITE)
  const links = kachel * ZK_BREITE + 30
  const rechts = (kachel + 1) * ZK_BREITE - 30 - breite
  return Math.min(Math.max(x - breite / 2, links), rechts)
}

/** Größer, wenn gleiche Abstände Platz lassen. */
function zahlenstrahlMass(k: Zahlenstrahlkarte): number {
  return k.gleichmaessig ? 1.35 : 1
}

/** Je Punkt Lage und Reihe – die erste freie, nahe vor fern. */
function zahlenstrahlPlan(k: Zahlenstrahlkarte) {
  const ende: number[] = [-Infinity, -Infinity, -Infinity, -Infinity]
  return k.punkte.map((p) => {
    const x = zahlenstrahlX(k, p.wert, k.punkte.indexOf(p))
    const ex = zahlenstrahlEtikettX(x, ZS_ETIKETT * zahlenstrahlMass(k))
    /* Gleiche Abstände: abwechselnd über und unter der Linie, groß. */
    const reihe = k.gleichmaessig
      ? ((k.punkte.indexOf(p) % 2) as Reihe)
      : ([0, 1, 2, 3] as Reihe[]).find((r) => ex >= ende[r] + 16)
    if (reihe !== undefined) ende[reihe] = ex + ZS_ETIKETT
    return { p, x, ex, reihe }
  })
}

export function zahlenstrahlKachel(k: Zahlenstrahlkarte, logo: string, nr: number) {
  const versatz = (nr - 1) * ZK_BREITE
  const breite = k.kacheln * ZK_BREITE
  const ende = breite - ZS_RECHTS / 2
  const ab = k.start ?? 0
  const striche = k.gleichmaessig
    ? []
    : Array.from(
        { length: Math.floor((k.bis - ab) / k.schritt) + 1 },
        (_, i) => ab + i * k.schritt
      )
  const zahl = (v: number) => v.toLocaleString('de-DE')

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${breite}" height="80" viewBox="0 0 ${breite} 80">` +
    `<line x1="${STIL_RAND}" x2="${ende}" y1="20" y2="20" stroke="${STIL.tinte}" stroke-width="4"/>` +
    `<path d="M ${ende - 18} 8 L ${ende} 20 L ${ende - 18} 32" fill="none" stroke="${STIL.tinte}" stroke-width="4"/>` +
    striche
      .map((v) => {
        const x = zahlenstrahlX(k, v)
        return `<line x1="${x}" x2="${x}" y1="12" y2="28" stroke="${STIL.hellgrau}" stroke-width="2"/>`
      })
      .join('') +
    '</svg>'

  const elemente: ReturnType<typeof h>[] = [
    h('img', {
      src: svgAdresse(svg),
      width: breite,
      height: 80,
      style: { position: 'absolute', left: -versatz, top: ZS_ACHSE - 20 },
    }),
    ...striche.map((v) =>
      stilBlock(`${zahl(v)} ${k.einheit}`, {
        top: ZS_ACHSE + 14,
        left: zahlenstrahlX(k, v) - 80 - versatz,
        width: 160,
        justifyContent: 'center',
        fontSize: 17,
        color: STIL.hellgrau,
      })
    ),
  ]

  const g = zahlenstrahlMass(k)
  for (const { p, x, ex, reihe } of zahlenstrahlPlan(k)) {
    if (reihe === undefined) continue
    const oben = reihe === 0 || reihe === 2
    const fern = reihe >= 2
    const abstand = ZS_NAH + (fern ? ZS_HOCH + 20 : 0)
    const grau = p.vergleich || p.offen
    const farbe = grau ? STIL.grau : p.hervor ? STIL.navy : STIL.tinte
    /* Verbindung vom Punkt zum Etikett, dann der Punkt selbst. */
    elemente.push(
      h('div', {
        style: {
          position: 'absolute',
          left: x - 1.5 - versatz,
          top: oben ? ZS_ACHSE - abstand : ZS_ACHSE,
          width: 3,
          height: abstand,
          backgroundColor: STIL.rand,
        },
      }),
      h('div', {
        style: {
          position: 'absolute',
          left: x - 12 - versatz,
          top: ZS_ACHSE - 12,
          width: 24,
          height: 24,
          borderRadius: 24,
          backgroundColor: grau ? '#ffffff' : farbe,
          border: grau ? `4px solid ${STIL.grau}` : '4px solid #ffffff',
        },
      })
    )
    elemente.push(
      h(
        'div',
        {
          style: {
            position: 'absolute',
            left: ex - versatz,
            top: oben ? ZS_ACHSE - abstand - ZS_HOCH * g : ZS_ACHSE + abstand,
            width: ZS_ETIKETT * g,
            height: ZS_HOCH * g,
            display: 'flex',
            flexDirection: oben ? 'column-reverse' : 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            fontFamily: 'Montserrat',
          },
        },
        ...(p.logo
          ? [
              h(
                'div',
                {
                  style: {
                    width: ZS_LOGO_B * g,
                    height: ZS_LOGO_H * g,
                    borderRadius: 18,
                    border: `2px solid ${STIL.rand}`,
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '4px 0',
                  },
                },
                h('img', {
                  src: logoAdresse(p.logo),
                  width: (ZS_LOGO_B - 40) * g,
                  height: (ZS_LOGO_H - 28) * g,
                  style: { objectFit: 'contain' },
                })
              ),
            ]
          : []),
        h(
          'div',
          {
            style: {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              margin: '4px 0',
            },
          },
          h(
            'div',
            {
              style: {
                fontSize: (p.vergleich ? 40 : 48) * g,
                fontWeight: 800,
                letterSpacing: -1,
                color: farbe,
              },
            },
            p.anzeige
          ),
          h(
            'div',
            {
              style: {
                fontSize: 22 * g,
                fontWeight: 600,
                color: grau ? STIL.grau : STIL.tinte,
                textAlign: 'center',
              },
            },
            p.name
          ),
          h('div', { style: { fontSize: 19 * g, color: STIL.grau } }, p.zusatz)
        )
      )
    )
  }

  const satz = k.saetze.find((z) => z.kachel === nr)
  return h(
    'div',
    {
      style: {
        width: ZK_BREITE,
        height: ZK_HOEHE,
        display: 'flex',
        position: 'relative',
        backgroundColor: '#ffffff',
        overflow: 'hidden',
      },
    },
    ...(nr === 1
      ? [
          stilKopf(logo),
          h(
            'div',
            {
              style: {
                position: 'absolute',
                top: 170,
                left: STIL_RAND,
                right: STIL_RAND,
                display: 'flex',
                flexDirection: 'column',
                fontFamily: 'Montserrat',
                fontWeight: 800,
                fontSize: 96,
                lineHeight: 1.08,
                letterSpacing: -2,
              },
            },
            ...k.titel.map((t) =>
              h(
                'div',
                { style: { display: 'flex', color: t.gruen ? STIL.navy : STIL.tinte } },
                t.text
              )
            )
          ),
          stilBlock(k.erklaerung, {
            top: 400,
            left: STIL_RAND,
            right: STIL_RAND,
            fontSize: 30,
            color: STIL.grau,
          }),
          stilBlock('Wischen  →', {
            top: ZK_HOEHE - 79,
            right: STIL_RAND,
            fontSize: 20,
            fontWeight: 700,
            color: STIL.grau,
          }),
        ]
      : [
          /* Ab Kachel 2 steht kein Logo – der Absender reist mit jedem
             Bildschirmfoto mit (INSTAGRAM.md, Karussell-Regel 5). Höchste
             Etikettenreihe beginnt bei y ≈ 116, hier ist Platz. */
          stilBlock(ABSENDER, {
            top: 48,
            left: STIL_RAND,
            fontSize: 22,
            fontWeight: 700,
            color: STIL.hellgrau,
          }),
          stilBlock(`${nr} / ${k.kacheln}`, {
            top: 48,
            right: STIL_RAND,
            fontSize: 22,
            fontWeight: 700,
            color: STIL.hellgrau,
          }),
        ]),
    ...elemente,
    ...(satz
      ? [
          stilBlock(satz.text, {
            top: 1176,
            left: STIL_RAND,
            width: ZK_BREITE - 2 * STIL_RAND,
            fontSize: 30,
            fontWeight: 600,
            lineHeight: 1.3,
            color: STIL.tinte,
          }),
        ]
      : []),
    stilBlock(k.fusszeile, {
      top: ZK_HOEHE - 52,
      left: STIL_RAND,
      right: STIL_RAND,
      fontSize: 15,
      color: STIL.hellgrau,
    })
  )
}

/** Wie viele Bilder die Karte hat – ein Karussell mehr als eins. */
export function zahlenkarteSeiten(k: Zahlenkarte): number {
  if (k.art === 'zahlenstrahl') return k.kacheln
  if (k.art === 'raetsel' || k.art === 'mythos') return 2 * k.fragen.length
  return 'zweiteSeite' in k && k.zweiteSeite ? 2 : 1
}

/** Seite `nr` (ab 1) der Karte als PNG. */
export async function zahlenkarteSeitePng(
  k: Zahlenkarte,
  logoSvg: string,
  nr: number
): Promise<Buffer> {
  if (k.art === 'raetsel' || k.art === 'mythos') {
    const logo = svgAdresse(signetOhneMitte(logoSvg))
    const seite = Math.min(Math.max(nr, 1), 2 * k.fragen.length)
    const antwort = new ImageResponse(
      k.art === 'raetsel' ? raetselKachel(k, logo, seite) : mythosKachel(k, logo, seite),
      { width: ZK_BREITE, height: ZK_HOEHE, fonts: schriften() }
    )
    return Buffer.from(await antwort.arrayBuffer())
  }
  if (k.art === 'zahlenstrahl') {
    const logo = svgAdresse(signetOhneMitte(logoSvg))
    const antwort = new ImageResponse(
      zahlenstrahlKachel(k, logo, Math.min(Math.max(nr, 1), k.kacheln)),
      { width: ZK_BREITE, height: ZK_HOEHE, fonts: schriften() }
    )
    return Buffer.from(await antwort.arrayBuffer())
  }
  if (nr === 2 && 'zweiteSeite' in k && k.zweiteSeite)
    return zahlenkartePng(k.zweiteSeite, logoSvg)
  return zahlenkartePng(k, logoSvg)
}

/* ---------------------------------------------------------------- Rätsel */

const RS_GRAFIK_O = 720
const RS_GRAFIK_U = 1110

/** Veränderung vom ersten zum letzten Punkt in Prozent. */
export function raetselProzent(punkte: readonly number[]): number {
  return (punkte[punkte.length - 1] / punkte[0] - 1) * 100
}

/** „+469 %“ – ganze Prozent, echtes Minus. */
function raetselProzentText(punkte: readonly number[]): string {
  const p = Math.round(raetselProzent(punkte))
  return `${p < 0 ? '−' : '+'}${Math.abs(p).toLocaleString('de-DE')} %`
}

function pruefeRaetsel(k: Raetselkarte): string[] {
  const f: string[] = []
  if (k.fragen.length < 2 || k.fragen.length > 4)
    f.push(`${k.fragen.length} Rätsel – zwei bis vier.`)
  for (const t of k.titel)
    if (t.text.length > 22) f.push(`Titelzeile „${t.text}“ – höchstens 22 Zeichen.`)
  for (const [i, q] of k.fragen.entries()) {
    const nr = i + 1
    if (q.punkte.length < 20)
      f.push(`Rätsel ${nr}: ${q.punkte.length} Punkte – mindestens 20.`)
    if (q.punkte.some((v) => !(v > 0)))
      f.push(`Rätsel ${nr}: Kurse müssen über null liegen.`)
    if (!existsSync(join(LOGO_ORDNER, q.logo)))
      f.push(`Rätsel ${nr}: Logo „${q.logo}“ fehlt in lib/instagram/logos/.`)
    if (q.tipp.length > 80)
      f.push(`Rätsel ${nr}: Tipp hat ${q.tipp.length} Zeichen – höchstens 80.`)
    if (q.satz.length > 220)
      f.push(`Rätsel ${nr}: Erläuterung hat ${q.satz.length} Zeichen – höchstens 220.`)
    if ((q.frage ?? '').length > 22)
      f.push(`Rätsel ${nr}: Frage „${q.frage}“ – höchstens 22 Zeichen.`)
    if (i > 0 && !q.frage) f.push(`Rätsel ${nr}: braucht eine Frage als Überschrift.`)
    /* Ein Rätsel, dessen Tipp die Lösung nennt, ist keins. */
    const wort = q.name.split(/[\s-]+/)[0].toLowerCase()
    if (`${q.tipp} ${q.frage ?? ''}`.toLowerCase().includes(wort))
      f.push(`Rätsel ${nr}: Tipp oder Frage verrät „${q.name}“.`)
    for (const a of q.achse)
      if (a.bei < 0 || a.bei >= q.punkte.length)
        f.push(`Rätsel ${nr}: Achse „${a.text}“ liegt außerhalb der Kurve.`)
  }
  return f
}

/** Die Kurve in Prozent seit dem ersten Punkt, mit Nulllinie und Achse rechts. */
function raetselGrafik(q: Raetselkarte['fragen'][number]) {
  const links = STIL_RAND
  const rechts = ZK_BREITE - STIL_RAND - 90
  const luft = 10
  const breite = rechts - links
  const hoehe = RS_GRAFIK_U - RS_GRAFIK_O
  const werte = q.punkte.map((v) => (v / q.punkte[0] - 1) * 100)
  const hoch = Math.max(0, ...werte)
  const tief = Math.min(0, ...werte)
  const schritt = achsenschritt(hoch - tief, 5)
  const oben = Math.ceil(hoch / schritt) * schritt
  /*
    Unten reicht die Fläche bis zum tiefsten Punkt, nicht bis zum nächsten
    Strich: Ein Knick auf −11 % hätte sonst bei Schritten von 200 % ein
    Drittel der Grafik leer gelassen.
  */
  const unten = tief < -schritt / 2 ? Math.floor(tief / schritt) * schritt : tief
  const x = (i: number) => (i / (werte.length - 1)) * breite
  const y = (v: number) => hoehe - ((v - unten) / (oben - unten)) * hoehe
  const striche = Array.from(
    { length: Math.floor((oben - unten) / schritt + 1e-9) + 1 },
    (_, i) => oben - i * schritt
  ).filter((v) => v >= unten - 1e-9)
  const farbe = stilFarbe(werte[werte.length - 1] >= 0 ? 'steigt' : 'faellt')
  const pfad = werte
    .map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`)
    .join(' ')
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${breite + 2 * luft}" height="${hoehe + 2 * luft}" viewBox="${-luft} ${-luft} ${breite + 2 * luft} ${hoehe + 2 * luft}">` +
    striche
      .map(
        (v) =>
          `<line x1="0" x2="${breite}" y1="${y(v)}" y2="${y(v)}" stroke="${v ? STIL.rand : '#9aa3b0'}" stroke-width="${v ? 1.5 : 2.5}"/>`
      )
      .join('') +
    `<path d="${pfad} L${x(werte.length - 1)} ${y(0)} L0 ${y(0)} Z" fill="${farbe}" opacity="0.08"/>` +
    `<path d="${pfad}" fill="none" stroke="${farbe}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>` +
    `<circle cx="${x(werte.length - 1)}" cy="${y(werte[werte.length - 1])}" r="8" fill="#ffffff" stroke="${farbe}" stroke-width="4"/>` +
    '</svg>'
  return [
    h('img', {
      src: svgAdresse(svg),
      width: breite + 2 * luft,
      height: hoehe + 2 * luft,
      style: { position: 'absolute', left: links - luft, top: RS_GRAFIK_O - luft },
    }),
    ...striche.map((v) =>
      stilBlock(
        `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toLocaleString('de-DE')} %`,
        {
          top: RS_GRAFIK_O + y(v) - 11,
          left: rechts + 18,
          fontSize: 17,
          color: STIL.hellgrau,
        }
      )
    ),
    ...q.achse.map((a, i) =>
      stilBlock(a.text, {
        top: RS_GRAFIK_U + 16,
        left:
          i === 0
            ? links
            : i === q.achse.length - 1
              ? links + x(a.bei) - 120
              : links + x(a.bei) - 60,
        width: 120,
        justifyContent:
          i === 0 ? 'flex-start' : i === q.achse.length - 1 ? 'flex-end' : 'center',
        fontSize: 17,
        color: STIL.hellgrau,
      })
    ),
  ]
}

/**
 * Eine Kachel des Rätsels. Rätselkachel: Kurve ohne Namen, Prozentzahl und
 * Tipp. Auflösung: nur das Logo und die Erläuterung, ohne Zahl und Kurve.
 *
 * Betreiber, 09.11.2026: Eine Fassung im Rahmen von stilBild() und drei
 * neue Stilrichtungen hat er verworfen („sieht alles schrecklich aus“). Er
 * will die erste Fassung, nur die Auflösung anders: „nicht mehr die große
 * Zahl …, sondern nur noch das Logo und Erläuterung“. Danach: Titel in
 * einer Farbe, kein Zähler oben rechts, kein „Rätsel 2 von 3“ und keine
 * Unterzeile „Drei Kurven · drei Tipps“ – „diese Beschriftungen weg“.
 */
function raetselKachel(k: Raetselkarte, logo: string, nr: number) {
  const n = Math.ceil(nr / 2)
  const q = k.fragen[n - 1]
  const aufloesung = nr % 2 === 0
  const seiten = 2 * k.fragen.length
  const prozent = raetselProzentText(q.punkte)
  const farbe = stilFarbe(raetselProzent(q.punkte) >= 0 ? 'steigt' : 'faellt')

  const weiter =
    nr < seiten
      ? [
          stilBlock(aufloesung ? 'Nächstes Rätsel  →' : 'Auflösung  →', {
            top: 1236,
            right: STIL_RAND,
            fontSize: 20,
            fontWeight: 700,
            color: STIL.grau,
          }),
        ]
      : []
  const fuss = stilBlock(k.fusszeile, {
    top: ZK_HOEHE - 52,
    left: STIL_RAND,
    right: STIL_RAND,
    fontSize: 15,
    color: STIL.hellgrau,
  })
  const flaeche = (...inhalt: ReturnType<typeof h>[]) =>
    h(
      'div',
      {
        style: {
          width: ZK_BREITE,
          height: ZK_HOEHE,
          display: 'flex',
          position: 'relative',
          backgroundColor: '#ffffff',
          overflow: 'hidden',
        },
      },
      ...inhalt
    )

  if (aufloesung)
    return flaeche(
      stilBlock('AUFLÖSUNG', {
        top: 150,
        left: STIL_RAND,
        ...GESPERRT,
        color: STIL.navy,
      }),
      h(
        'div',
        {
          style: {
            position: 'absolute',
            top: 196,
            left: STIL_RAND,
            width: ZK_BREITE - 2 * STIL_RAND,
            height: 420,
            borderRadius: 24,
            border: `2px solid ${STIL.rand}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
        },
        h('img', {
          src: logoAdresse(q.logo),
          width: 640,
          height: 280,
          style: { objectFit: 'contain' },
        })
      ),
      stilBlock(q.name, {
        top: 680,
        left: STIL_RAND,
        right: STIL_RAND,
        fontSize: 72,
        fontWeight: 800,
        letterSpacing: -2,
        color: STIL.tinte,
      }),
      stilBlock(q.satz, {
        top: 790,
        left: STIL_RAND,
        width: ZK_BREITE - 2 * STIL_RAND,
        fontSize: 38,
        fontWeight: 500,
        lineHeight: 1.4,
        color: STIL.grau,
      }),
      ...weiter,
      fuss
    )

  const kopf =
    nr === 1
      ? [
          stilKopf(logo),
          h(
            'div',
            {
              style: {
                position: 'absolute',
                top: 150,
                left: STIL_RAND,
                right: STIL_RAND,
                display: 'flex',
                flexDirection: 'column',
                fontFamily: 'Montserrat',
                fontWeight: 800,
                fontSize: 88,
                lineHeight: 1.08,
                letterSpacing: -2,
              },
            },
            /* In einer Farbe (Betreiber, 09.11.2026: „welche Aktie ist das in einer Farbe“). */
            ...k.titel.map((t) =>
              h('div', { style: { display: 'flex', color: STIL.tinte } }, t.text)
            )
          ),
        ]
      : [
          stilBlock(q.frage ?? '', {
            top: 150,
            left: STIL_RAND,
            right: STIL_RAND,
            fontSize: 88,
            fontWeight: 800,
            letterSpacing: -2,
            color: STIL.tinte,
          }),
        ]

  return flaeche(
    ...kopf,
    stilBlock(prozent, {
      top: 490,
      left: STIL_RAND,
      fontSize: 132,
      fontWeight: 800,
      letterSpacing: -4,
      color: farbe,
    }),
    stilBlock('Kurs in fünf Jahren', {
      top: 652,
      left: STIL_RAND,
      fontSize: 26,
      color: STIL.grau,
    }),
    ...raetselGrafik(q),
    stilBlock(`Tipp: ${q.tipp}`, {
      top: 1166,
      left: STIL_RAND,
      width: ZK_BREITE - 2 * STIL_RAND,
      fontSize: 30,
      fontWeight: 600,
      lineHeight: 1.3,
      color: STIL.tinte,
    }),
    ...weiter,
    fuss
  )
}

/* ---------------------------------------------------------------- Mythos */

/** Eine Zahl mit Vorzeichen und Einheit: „+0,070 %“, „−2,08 %“. */
function mythosZahl(v: number, stellen: number, einheit: string): string {
  const t = Math.abs(v).toLocaleString('de-DE', {
    minimumFractionDigits: stellen,
    maximumFractionDigits: stellen,
  })
  /* Was auf null gerundet wird, trägt kein Vorzeichen: „0,0 %“, nicht „−0,0 %“. */
  const null_ = Number(Math.abs(v).toFixed(stellen)) === 0
  return `${null_ ? '' : v > 0 ? '+' : '−'}${t} ${einheit}`
}

function pruefeMythos(k: Mythoskarte): string[] {
  const f: string[] = []
  if (k.fragen.length < 2 || k.fragen.length > 4)
    f.push(`${k.fragen.length} Mythen – zwei bis vier.`)
  for (const t of k.titel)
    if (t.text.length > 22) f.push(`Titelzeile „${t.text}“ – höchstens 22 Zeichen.`)
  for (const [i, q] of k.fragen.entries()) {
    const nr = i + 1
    if (q.behauptung.length > 60)
      f.push(
        `Mythos ${nr}: Behauptung hat ${q.behauptung.length} Zeichen – höchstens 60.`
      )
    if (q.satz.length > 140)
      f.push(`Mythos ${nr}: Satz hat ${q.satz.length} Zeichen – höchstens 140.`)
    if (q.stichzeile.length > 60)
      f.push(
        `Mythos ${nr}: Stichzeile hat ${q.stichzeile.length} Zeichen – höchstens 60.`
      )
    if (i > 0 && !q.frage) f.push(`Mythos ${nr}: braucht eine Frage als Überschrift.`)
    if (q.saeulen.length < 2 || q.saeulen.length > 12)
      f.push(`Mythos ${nr}: ${q.saeulen.length} Säulen – zwei bis zwölf.`)
    if (q.saeulen.filter((s) => s.hervor).length !== 1)
      f.push(`Mythos ${nr}: genau eine Säule hervorheben.`)
  }
  return f
}

/** Die Säulen der Auflösung: Nulllinie, Wert über (oder unter) jeder Säule, Name darunter. */
function mythosGrafik(q: Mythoskarte['fragen'][number], farbe: string) {
  const oben = 600
  const unten = 1010
  const links = STIL_RAND
  const breite = ZK_BREITE - 2 * STIL_RAND
  const werte = q.saeulen.map((s) => s.wert)
  const hoch = Math.max(0, ...werte)
  const tief = Math.min(0, ...werte)
  const spanne = hoch - tief || 1
  const y = (v: number) => oben + ((hoch - v) / spanne) * (unten - oben)
  const null_ = y(0)
  const n = q.saeulen.length
  const fach = breite / n
  const saeule = Math.min(120, fach * 0.62)
  const klein = n > 6
  const teile: ReturnType<typeof h>[] = [
    h('div', {
      style: {
        position: 'absolute',
        left: links,
        top: null_ - 1,
        width: breite,
        height: 2,
        backgroundColor: '#9aa3b0',
      },
    }),
  ]
  for (const [i, s] of q.saeulen.entries()) {
    const mitte = links + fach * (i + 0.5)
    const y0 = Math.min(y(s.wert), null_)
    const hoehe = Math.max(Math.abs(y(s.wert) - null_), 3)
    const ton = s.hervor ? farbe : '#c9cfd8'
    teile.push(
      h('div', {
        style: {
          position: 'absolute',
          left: mitte - saeule / 2,
          top: y0,
          width: saeule,
          height: hoehe,
          backgroundColor: ton,
          borderRadius: 4,
        },
      }),
      stilBlock(mythosZahl(s.wert, q.stellen, q.einheit), {
        top: s.wert >= 0 ? y0 - (klein ? 30 : 40) : y0 + hoehe + 8,
        left: mitte - fach / 2,
        width: fach,
        justifyContent: 'center',
        fontSize: klein ? 19 : 26,
        fontWeight: 800,
        color: s.hervor ? farbe : STIL.grau,
      }),
      stilBlock(s.name, {
        top: unten + 46,
        left: mitte - fach / 2,
        width: fach,
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: klein ? 19 : 24,
        fontWeight: s.hervor ? 800 : 500,
        color: s.hervor ? STIL.tinte : STIL.grau,
      })
    )
  }
  return teile
}

/**
 * Mythos oder Fakt (10.11.2026, Betreiber wählte aus fünf Vorschlägen
 * „4“). Gebaut wie das Börsenrätsel, das er am 09.11. so wollte: je Mythos
 * zwei Kacheln. Erst die Behauptung groß, dann wischen; auf der Auflösung
 * das Urteil – „Mythos.“ in Rot, „Fakt.“ in Grün –, die Säulen aus den
 * Kursdaten und ein Satz. Titel in einer Farbe, ohne Zähler und
 * Hilfszeilen, wie beim Rätsel.
 */
function mythosKachel(k: Mythoskarte, logo: string, nr: number) {
  const n = Math.ceil(nr / 2)
  const q = k.fragen[n - 1]
  const aufloesung = nr % 2 === 0
  const seiten = 2 * k.fragen.length
  const farbe = q.fakt ? STIL.gruen : STIL.rot
  const weiter =
    nr < seiten
      ? [
          stilBlock(aufloesung ? 'Nächster Mythos  →' : 'Auflösung  →', {
            top: 1236,
            right: STIL_RAND,
            fontSize: 20,
            fontWeight: 700,
            color: STIL.grau,
          }),
        ]
      : []
  const fuss = stilBlock(k.fusszeile, {
    top: ZK_HOEHE - 52,
    left: STIL_RAND,
    right: STIL_RAND,
    fontSize: 15,
    color: STIL.hellgrau,
  })
  const flaeche = (...inhalt: ReturnType<typeof h>[]) =>
    h(
      'div',
      {
        style: {
          width: ZK_BREITE,
          height: ZK_HOEHE,
          display: 'flex',
          position: 'relative',
          backgroundColor: '#ffffff',
          overflow: 'hidden',
        },
      },
      ...inhalt
    )

  if (aufloesung)
    return flaeche(
      stilBlock('AUFLÖSUNG', {
        top: 150,
        left: STIL_RAND,
        ...GESPERRT,
        color: STIL.navy,
      }),
      /* 88 wie die Überschriften – 132 war „ein bisschen arg groß“ (Betreiber, 10.11.2026). */
      stilBlock(q.fakt ? 'Fakt.' : 'Mythos.', {
        top: 180,
        left: STIL_RAND,
        fontSize: 88,
        fontWeight: 800,
        letterSpacing: -2,
        color: farbe,
      }),
      stilBlock(`„${q.behauptung}“`, {
        top: 300,
        left: STIL_RAND,
        right: STIL_RAND,
        fontSize: 32,
        fontWeight: 600,
        color: STIL.grau,
      }),
      stilBlock(q.stichzeile.toUpperCase(), {
        top: 462,
        left: STIL_RAND,
        ...GESPERRT,
        color: STIL.hellgrau,
      }),
      /* Die Säule in Navy: Rot und Grün tragen nur eine Richtung (INSTAGRAM-STIL.md), das Urteil steht oben. */
      ...mythosGrafik(q, STIL.navy),
      stilBlock(q.satz, {
        top: 1150,
        left: STIL_RAND,
        width: ZK_BREITE - 2 * STIL_RAND,
        fontSize: 30,
        fontWeight: 600,
        lineHeight: 1.3,
        color: STIL.tinte,
      }),
      ...weiter,
      fuss
    )

  return flaeche(
    ...(nr === 1
      ? [
          stilKopf(logo),
          h(
            'div',
            {
              style: {
                position: 'absolute',
                top: 150,
                left: STIL_RAND,
                right: STIL_RAND,
                display: 'flex',
                flexDirection: 'column',
                fontFamily: 'Montserrat',
                fontWeight: 800,
                fontSize: 88,
                lineHeight: 1.08,
                letterSpacing: -2,
              },
            },
            ...k.titel.map((t) =>
              h('div', { style: { display: 'flex', color: STIL.tinte } }, t.text)
            )
          ),
        ]
      : [
          stilBlock(q.frage ?? '', {
            top: 150,
            left: STIL_RAND,
            right: STIL_RAND,
            fontSize: 88,
            fontWeight: 800,
            letterSpacing: -2,
            color: STIL.tinte,
          }),
        ]),
    stilBlock(`„${q.behauptung}“`, {
      top: 520,
      left: STIL_RAND,
      width: ZK_BREITE - 2 * STIL_RAND,
      fontSize: 84,
      fontWeight: 800,
      lineHeight: 1.12,
      letterSpacing: -2,
      color: STIL.navy,
    }),
    stilBlock('Mythos oder Fakt? Erst tippen, dann wischen.', {
      top: 1080,
      left: STIL_RAND,
      right: STIL_RAND,
      fontSize: 30,
      fontWeight: 600,
      color: STIL.grau,
    }),
    ...weiter,
    fuss
  )
}
