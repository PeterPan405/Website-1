import type { Pfadschritt } from '@/data/learn/pfade'

/**
 * Das 30-Tage-Programm: eine Tagesportion Finanzwissen, vier Wochen lang.
 *
 * ## Was es ist – und was nicht
 *
 * Kein neuer Inhalt, sondern eine Dramaturgie über Bestehendem: Jeder Tag
 * verweist auf eine Lernstufe, oft mit dem passenden Rechner daneben. Die
 * Lernpfade beantworten „Ich habe eine Frage, führe mich hin“; das Programm
 * beantwortet „Ich will es endlich lernen, gib mir einen Rhythmus“. Eine
 * Portion am Tag ist klein genug für den Feierabend und groß genug, dass
 * nach dreißig Tagen das Fundament steht.
 *
 * ## Aufbau
 *
 * Woche 1 legt das Fundament ums eigene Geld, Woche 2 erklärt den Markt,
 * Woche 3 macht das Anlegen konkret, Woche 4 ordnet ein und vertieft. Die
 * letzten beiden Tage heben auf die Stufe Fortgeschritten – als Beweis an
 * den Leser, dass er sie inzwischen lesen kann.
 *
 * Verweise werden beim Bauen aufgelöst (`lib/dreissig-tage.ts`); ein Tippfehler
 * in einem Slug bricht den Build ab, statt einen toten Link auszuliefern.
 */
export interface Programmtag {
  /** 1 bis 30, zugleich die Anzeige-Nummer. */
  tag: number
  titel: string
  /** Warum dieser Tag an dieser Stelle steht – der rote Faden. */
  warum: string
  schritte: Pfadschritt[]
}

export const dreissigTage: Programmtag[] = [
  // ------------------------------------------------- Woche 1: Das Fundament
  {
    tag: 1,
    titel: 'Der Kompass',
    warum:
      'Bevor es um Produkte geht, geht es um Fallen: Woran erkennt man Angebote, die nicht für einen selbst gebaut sind?',
    schritte: [
      {
        art: 'stufe',
        thema: 'worauf-achten-einsteiger',
        stufe: 'beginner',
        warum: 'Die Grundregeln, an denen sich alles Weitere messen lässt.',
      },
    ],
  },
  {
    tag: 2,
    titel: 'Wissen, was übrig bleibt',
    warum:
      'Anlegen beginnt nicht an der Börse, sondern beim Blick auf die eigenen Zahlen – erst wer seine Sparquote kennt, hat etwas anzulegen.',
    schritte: [
      {
        art: 'stufe',
        thema: 'budget-und-sparquote',
        stufe: 'beginner',
        warum: 'Einnahmen, Ausgaben, Sparquote – das Handwerkszeug.',
      },
      {
        art: 'rechner',
        rechner: 'haushaltsrechner',
        warum: 'Gleich mit den eigenen Zahlen rechnen, nicht mit Beispielen.',
      },
    ],
  },
  {
    tag: 3,
    titel: 'Der stärkste Mechanismus',
    warum:
      'Zinseszins ist der Grund, warum früh anfangen mehr zählt als viel einzahlen – das muss man einmal selbst gerechnet haben.',
    schritte: [
      {
        art: 'stufe',
        thema: 'zinseszins',
        stufe: 'beginner',
        warum: 'Warum Wachstum auf Wachstum die Kurve biegt.',
      },
      {
        art: 'rechner',
        rechner: 'zinsrechner',
        warum: 'Dieselbe Rechnung mit eigenen Beträgen und Laufzeiten.',
      },
    ],
  },
  {
    tag: 4,
    titel: 'Der stille Gegenspieler',
    warum:
      'Was der Zinseszins aufbaut, trägt die Inflation ab – wer nur eine der beiden Kräfte kennt, rechnet falsch.',
    schritte: [
      {
        art: 'stufe',
        thema: 'inflation',
        stufe: 'beginner',
        warum: 'Kaufkraft, Warenkorb, warum zwei Prozent das Ziel sind.',
      },
      {
        art: 'rechner',
        rechner: 'inflationsrechner',
        warum: 'Was aus heutigen 10.000 Euro in zwanzig Jahren wird.',
      },
    ],
  },
  {
    tag: 5,
    titel: 'Der Notgroschen',
    warum:
      'Bevor Geld langfristig arbeitet, braucht es eine Reserve, die sofort greifbar ist – sonst verkauft man im schlechtesten Moment.',
    schritte: [
      {
        art: 'stufe',
        thema: 'tagesgeld',
        stufe: 'beginner',
        warum: 'Wofür Tagesgeld da ist – und wofür nicht.',
      },
    ],
  },
  {
    tag: 6,
    titel: 'Was passiert, wenn die Bank fällt',
    warum:
      'Die Reserve liegt bei einer Bank – also gehört an Tag sechs die Frage beantwortet, wie sicher sie dort ist.',
    schritte: [
      {
        art: 'stufe',
        thema: 'einlagensicherung',
        stufe: 'beginner',
        warum: '100.000 Euro je Bank und Kunde – und was das genau heißt.',
      },
    ],
  },
  {
    tag: 7,
    titel: 'Die andere Seite des Zinses',
    warum:
      'Derselbe Zinseszins, der Vermögen aufbaut, arbeitet in jedem Kredit gegen einen – Schulden verstehen heißt Zinsen verstehen.',
    schritte: [
      {
        art: 'stufe',
        thema: 'schulden-und-kredit',
        stufe: 'beginner',
        warum: 'Gute Schulden, teure Schulden, und woran man sie unterscheidet.',
      },
      {
        art: 'rechner',
        rechner: 'kreditrechner',
        warum: 'Rate, Laufzeit, Restschuld – einmal selbst durchspielen.',
      },
    ],
  },
  // ------------------------------------------------------ Woche 2: Der Markt
  {
    tag: 8,
    titel: 'Wie Preise entstehen',
    warum:
      'Woche zwei beginnt mit der Mechanik: Ein Kurs ist kein Urteil, sondern der Punkt, an dem sich Käufer und Verkäufer treffen.',
    schritte: [
      {
        art: 'stufe',
        thema: 'wie-funktioniert-der-markt',
        stufe: 'beginner',
        warum: 'Angebot, Nachfrage, Orderbuch – die Mechanik hinter jedem Kurs.',
      },
    ],
  },
  {
    tag: 9,
    titel: 'Der Marktplatz',
    warum:
      'Die Börse ist der Ort, an dem diese Mechanik organisiert stattfindet – mit Regeln, Zeiten und Aufsicht.',
    schritte: [
      {
        art: 'stufe',
        thema: 'boerse',
        stufe: 'beginner',
        warum: 'Was eine Börse tut und wer dort was handelt.',
      },
    ],
  },
  {
    tag: 10,
    titel: 'Das Grundstück: die Aktie',
    warum:
      'Jetzt das wichtigste Einzelinstrument: Eine Aktie ist ein Anteil an einem Unternehmen – alles Weitere folgt aus diesem Satz.',
    schritte: [
      {
        art: 'stufe',
        thema: 'aktie',
        stufe: 'beginner',
        warum: 'Anteil, Dividende, Kursgewinn – was Aktionäre wirklich besitzen.',
      },
    ],
  },
  {
    tag: 11,
    titel: 'Kein Ertrag ohne Schwankung',
    warum:
      'Rendite ist die Bezahlung fürs Aushalten von Schwankung – wer das Paar trennt, fällt auf jedes „sicher und hochverzinst“ herein.',
    schritte: [
      {
        art: 'stufe',
        thema: 'risiko-und-rendite',
        stufe: 'beginner',
        warum: 'Warum die beiden zusammengehören und was Streuung daran ändert.',
      },
    ],
  },
  {
    tag: 12,
    titel: 'Viele Aktien in einem Korb',
    warum:
      'Streuung von Hand ist teuer – Fonds sind die Antwort der Branche darauf, mit einem eingebauten Interessenkonflikt.',
    schritte: [
      {
        art: 'stufe',
        thema: 'fonds',
        stufe: 'beginner',
        warum: 'Wie ein Fonds funktioniert und wer daran verdient.',
      },
    ],
  },
  {
    tag: 13,
    titel: 'Der Korb ohne Korbmacher',
    warum:
      'ETFs nehmen dem Fonds den teuersten Teil – das aktive Management – und sind deshalb das Standardwerkzeug für den langen Horizont.',
    schritte: [
      {
        art: 'stufe',
        thema: 'etf',
        stufe: 'beginner',
        warum: 'Index nachbilden statt schlagen wollen – und was das kostet.',
      },
    ],
  },
  {
    tag: 14,
    titel: 'Wenn alles fällt',
    warum:
      'Zum Abschluss der Marktwoche die Geschichte der Abstürze – nicht zur Abschreckung, sondern als Impfung: Es gab sie immer, es ging immer weiter.',
    schritte: [
      {
        art: 'stufe',
        thema: 'groesste-crashes',
        stufe: 'beginner',
        warum: '1929, 2000, 2008, 2020 – was Crashs gemeinsam haben.',
      },
    ],
  },
  // ------------------------------------------------------ Woche 3: Die Praxis
  {
    tag: 15,
    titel: 'Das Werkzeug: Depot und Broker',
    warum:
      'Woche drei macht es konkret. Ohne Depot keine Wertpapiere – und die Wahl des Brokers ist die erste echte Entscheidung.',
    schritte: [
      {
        art: 'stufe',
        thema: 'depot-und-broker',
        stufe: 'beginner',
        warum: 'Was ein Depot ist und worauf es bei der Wahl ankommt.',
      },
    ],
  },
  {
    tag: 16,
    titel: 'Der Preis des Anlegens',
    warum:
      'Kosten sind die einzige Stellgröße, die sicher wirkt – jede gesparte Gebühr ist Rendite ohne Risiko.',
    schritte: [
      {
        art: 'stufe',
        thema: 'kosten-und-gebuehren',
        stufe: 'beginner',
        warum: 'TER, Ausgabeaufschlag, Ordergebühr – wo Geld versickert.',
      },
      {
        art: 'rechner',
        rechner: 'kostenrechner',
        warum: 'Was 0,2 gegen 1,5 Prozent TER über 30 Jahre ausmachen.',
      },
    ],
  },
  {
    tag: 17,
    titel: 'Der Automat: der Sparplan',
    warum:
      'Regelmäßig statt richtig getimt – der Sparplan nimmt die schwerste Entscheidung (wann?) dauerhaft ab.',
    schritte: [
      {
        art: 'stufe',
        thema: 'cost-average-sparplan',
        stufe: 'beginner',
        warum: 'Was der Durchschnittseffekt kann und was nicht.',
      },
      {
        art: 'rechner',
        rechner: 'sparplanverlauf',
        warum: 'Ein Sparplan über echte Kursreihen statt konstanter Rendite.',
      },
    ],
  },
  {
    tag: 18,
    titel: 'Die Mischung',
    warum:
      'Einzelbausteine sind gewählt – jetzt die Frage, wie sie zusammen ein Ganzes ergeben, das zur eigenen Risikotragfähigkeit passt.',
    schritte: [
      {
        art: 'stufe',
        thema: 'portfolio-aufbau',
        stufe: 'beginner',
        warum: 'Aufteilung nach Anlageklassen – die wichtigste Einzelentscheidung.',
      },
    ],
  },
  {
    tag: 19,
    titel: 'Über den Tellerrand',
    warum:
      'Streuung heißt auch: nicht alles im Heimatmarkt. Länder und Branchen sind die zweite Dimension der Mischung.',
    schritte: [
      {
        art: 'stufe',
        thema: 'aktien-laender-branchen',
        stufe: 'beginner',
        warum: 'Warum „nur DAX“ keine Streuung ist.',
      },
    ],
  },
  {
    tag: 20,
    titel: 'Der größte Feind sitzt innen',
    warum:
      'Die Strategie steht – gebrochen wird sie fast immer vom eigenen Kopf. Die typischen Denkfehler einmal beim Namen nennen.',
    schritte: [
      {
        art: 'stufe',
        thema: 'anlegerpsychologie',
        stufe: 'beginner',
        warum: 'Verlustaversion, Herdentrieb, Ankereffekt – und ihre Gegenmittel.',
      },
    ],
  },
  {
    tag: 21,
    titel: 'Kaufen, halten, verkaufen',
    warum:
      'Zum Wochenschluss die Frage, an der die Psychologie konkret wird: Wann handelt man – und wann gerade nicht?',
    schritte: [
      {
        art: 'stufe',
        thema: 'wann-kaufen-verkaufen',
        stufe: 'beginner',
        warum: 'Warum Markttiming scheitert und Regeln helfen.',
      },
    ],
  },
  // ------------------------------------- Woche 4: Einordnung und Vertiefung
  {
    tag: 22,
    titel: 'Der Staat rechnet mit',
    warum:
      'Woche vier ordnet ein. Erträge werden besteuert – wer den Sparerpauschbetrag nicht nutzt, verschenkt jedes Jahr Geld.',
    schritte: [
      {
        art: 'stufe',
        thema: 'sparerpauschbetrag',
        stufe: 'beginner',
        warum: '1.000 Euro steuerfrei – wenn der Freistellungsauftrag steht.',
      },
      {
        art: 'rechner',
        rechner: 'steuerrechner',
        warum: 'Kapitalertragsteuer samt Vorabpauschale einmal durchrechnen.',
      },
    ],
  },
  {
    tag: 23,
    titel: 'Das Ziel: der Ruhestand',
    warum:
      'Der häufigste Grund fürs Anlegen bekommt einen eigenen Tag: Wie groß ist die Lücke, die das Depot einmal füllen soll?',
    schritte: [
      {
        art: 'stufe',
        thema: 'rente',
        stufe: 'beginner',
        warum: 'Drei Säulen, und warum die erste allein nicht reicht.',
      },
      {
        art: 'rechner',
        rechner: 'rentenluecke',
        warum: 'Die eigene Lücke in Zahlen statt in Bauchgefühl.',
      },
    ],
  },
  {
    tag: 24,
    titel: 'Die Hand am Zins',
    warum:
      'Leitzinsen bewegen alles, was bisher vorkam – Tagesgeld, Kredite, Aktien. Zeit zu verstehen, wer sie setzt und warum.',
    schritte: [
      {
        art: 'stufe',
        thema: 'notenbanken-geldpolitik',
        stufe: 'beginner',
        warum: 'Was eine Notenbank tut und wie der Leitzins wirkt.',
      },
    ],
  },
  {
    tag: 25,
    titel: 'Was Geld überhaupt ist',
    warum:
      'Einen Schritt weiter zurück: Woher kommt Geld, wer schöpft es, und warum ist das keine akademische Frage?',
    schritte: [
      {
        art: 'stufe',
        thema: 'geldsystem',
        stufe: 'beginner',
        warum: 'Geldschöpfung und Leitwährungen – das Fundament unter allem.',
      },
    ],
  },
  {
    tag: 26,
    titel: 'Über Grenzen hinweg',
    warum:
      'Wer weltweit streut, hält automatisch fremde Währungen – dieser Tag erklärt, was das für Rendite und Risiko heißt.',
    schritte: [
      {
        art: 'stufe',
        thema: 'waehrungen-wechselkurse',
        stufe: 'beginner',
        warum: 'Wechselkurse als stille Mitspieler im Depot.',
      },
    ],
  },
  {
    tag: 27,
    titel: 'Gold, Öl und der Rest',
    warum:
      'Rohstoffe tauchen in jeder Marktmeldung auf – und funktionieren anders als Aktien: ohne Ertrag, nur über den Preis.',
    schritte: [
      {
        art: 'stufe',
        thema: 'rohstoffe',
        stufe: 'beginner',
        warum: 'Warum ein Rohstoff keine Dividende zahlt und was das bedeutet.',
      },
    ],
  },
  {
    tag: 28,
    titel: 'Beton im Vergleich',
    warum:
      'Die beliebteste deutsche Anlageklasse gehört eingeordnet, nicht verklärt: Was leisten Immobilien im Vermögen – und was nicht?',
    schritte: [
      {
        art: 'stufe',
        thema: 'immobilien',
        stufe: 'beginner',
        warum: 'Eigenheim, Vermietung, Immobilienfonds – drei verschiedene Dinge.',
      },
    ],
  },
  {
    tag: 29,
    titel: 'Beweis: du liest jetzt Fortgeschritten',
    warum:
      'Die vorletzte Portion hebt die Stufe – derselbe Zinseszins wie an Tag drei, aber mit den Werkzeugen von vier Wochen Vorsprung.',
    schritte: [
      {
        art: 'stufe',
        thema: 'zinseszins',
        stufe: 'fortgeschritten',
        warum: 'Effektivzins, unterjährige Verzinsung, 72er-Regel.',
      },
    ],
  },
  {
    tag: 30,
    titel: 'Dein Bild, deine Mischung',
    warum:
      'Zum Abschluss zurück zur wichtigsten Entscheidung, eine Stufe höher – und dann das eigene Vermögen einmal schwarz auf weiß.',
    schritte: [
      {
        art: 'stufe',
        thema: 'portfolio-aufbau',
        stufe: 'fortgeschritten',
        warum: 'Rebalancing und Gewichtung – die Mischung im Betrieb.',
      },
      {
        art: 'rechner',
        rechner: 'vermoegensuebersicht',
        warum: 'Der Stand nach 30 Tagen, zum Abheften.',
      },
    ],
  },
]
