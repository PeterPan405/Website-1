import type { LearnTopic } from '@/data/learn/types'
import { formatNumber, formatPercent } from '@/lib/format'
import {
  bitcoinBloeckeJeEpoche as BLOECKE_JE_EPOCHE,
  bitcoinObergrenze as gesamtmenge,
  bitcoinStartbelohnung as START_BELOHNUNG,
} from '@/lib/lernszenarien'

/*
  Das Halving-Schema wird gerechnet, nicht abgeschrieben.

  Die Zahl 21 Millionen steht in jedem Text über Bitcoin und wird selten
  hergeleitet. Sie ist aber kein Beschluss, sondern das Ergebnis einer
  geometrischen Reihe: alle 210.000 Blöcke halbiert sich die Belohnung.
  Wer das einmal aufsummiert sieht, versteht die Knappheit als Regel und
  nicht als Versprechen – und sieht zugleich, dass der weit überwiegende
  Teil längst erzeugt ist.
*/
const EPOCHEN = 6

const halvings = Array.from({ length: EPOCHEN }, (_, index) => {
  const belohnung = START_BELOHNUNG / 2 ** index
  const menge = belohnung * BLOECKE_JE_EPOCHE
  return { epoche: index + 1, belohnung, menge }
})

const nachSechsEpochen = halvings.reduce((summe, e) => summe + e.menge, 0)

/**
 * Vollständig ausgearbeitetes Thema.
 *
 * Stufenaufbau: Beginner klärt, was Bitcoin ist, wie Verwahrung
 * funktioniert und welches Risiko dabei tatsächlich zählt. Fortgeschritten
 * behandelt Marktstruktur, Zugangswege und Regulierung. Profi geht auf das
 * Sicherheitsmodell und die Bewertungsfrage ein.
 *
 * ## Haltung dieses Themas
 *
 * Weder Werbung noch Abwehr. Krypto ist eine Anlageklasse ohne
 * Zahlungsströme – daraus folgt eine Reihe nachprüfbarer Aussagen, und die
 * stehen hier. Was nicht hierhergehört, ist eine Preisprognose in die eine
 * oder andere Richtung.
 *
 * ## Abgrenzung zu „Blockchain“
 *
 * Dort steht die Technik: Blöcke, Konsens, Smart Contracts. Hier steht die
 * Anlageklasse.
 */
export const bitcoinKrypto: LearnTopic = {
  slug: 'bitcoin-krypto',
  title: 'Bitcoin & Krypto',
  headline: 'Eine Anlageklasse ohne Zahlungsströme',
  metaTitle: 'Bitcoin und Krypto erklärt: Funktion, Verwahrung, Risiko',
  metaDescription:
    'Wie Bitcoin funktioniert, was Verwahrung praktisch bedeutet, welche Zugangswege es gibt und warum sich Kryptowerte nicht wie Aktien bewerten lassen.',
  lead: 'Hinter einer Aktie steht ein Unternehmen, hinter einer Anleihe ein Schuldner. Hinter Bitcoin steht eine Regel – und sonst nichts.',
  overview: [
    'Bitcoin ist ein verteiltes Kassenbuch: Wer wie viel besitzt, steht nicht bei einer Bank, sondern in einem Register, von dem tausende Kopien gleichzeitig geführt werden. Es gibt kein Unternehmen dahinter, keinen Gewinn und keine Ausschüttung.',
    'Daraus folgt das Wesentliche für die Anlage: Der Preis entsteht ausschließlich aus Angebot und Nachfrage. Es gibt keine Zahlungsströme, die man abzinsen könnte, und damit keinen Wert, gegen den sich ein Preis prüfen ließe.',
    'Die Stufen führen von der Funktionsweise und der Verwahrung über Marktstruktur, Zugangswege und Regulierung bis zum Sicherheitsmodell und der Frage, wie sich so etwas überhaupt bewerten lässt.',
  ],
  keywords: [
    'Bitcoin',
    'Kryptowährung',
    'Wallet',
    'Halving',
    'Stablecoin',
    'Kryptoverwahrung',
  ],
  related: ['blockchain', 'rohstoffe', 'risiko-und-rendite', 'derivat'],
  symbols: ['bitcoin'],
  levels: {
    // ---------------------------------------------------------------- Beginner
    beginner: {
      metaTitle: 'Bitcoin einfach erklärt: Funktion, Wallet, Risiko',
      metaDescription:
        'Was Bitcoin ist, wie das Halving die Menge begrenzt, was ein privater Schlüssel bedeutet und welche Risiken tatsächlich zählen.',
      title: 'Was Bitcoin ist – und was nicht',
      lead: 'Das Kassenbuch ohne Bank, die begrenzte Menge, der private Schlüssel – und das eine Risiko, auf das es tatsächlich ankommt.',
      readingMinutes: 12,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Wenn du Geld überweist, führt deine Bank Buch: Sie zieht bei dir ab und schreibt beim Empfänger gut. Alle vertrauen darauf, dass sie das richtig macht. Bitcoin ersetzt diese Bank durch ein **Register, das viele gleichzeitig führen** – jeder kann es einsehen, niemand kann es allein ändern. Der Rest ist Technik dazu.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wie die Menge begrenzt wird',
        },
        {
          type: 'paragraph',
          text: `Neue Bitcoin entstehen als Belohnung für das Zusammenstellen eines Blocks. Diese Belohnung halbiert sich alle ${formatNumber(BLOECKE_JE_EPOCHE, 0)} Blöcke – das **Halving**, etwa alle vier Jahre. Daraus ergibt sich die Gesamtmenge nicht als Beschluss, sondern als Summe einer geometrischen Reihe:`,
        },
        {
          type: 'table',
          caption: 'Was in den ersten Epochen entsteht',
          head: ['Epoche', 'Belohnung je Block', 'Neue Menge in dieser Epoche'],
          rows: halvings.map((e) => [
            `${e.epoche}.`,
            formatNumber(e.belohnung, 3),
            formatNumber(e.menge, 0),
          ]),
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Was die Tabelle zeigt',
          items: [
            `Die vollständige Reihe konvergiert gegen ${formatNumber(gesamtmenge, 0)} – das ist die berühmte Grenze von 21 Millionen. Sie ist keine Zusage, sondern eine Rechnung.`,
            `Schon nach sechs Epochen sind ${formatNumber(nachSechsEpochen, 0)} erzeugt, also ${formatPercent((nachSechsEpochen / gesamtmenge) * 100, 1)} der Gesamtmenge. Der weit überwiegende Teil entstand in den ersten Jahren.`,
            'Was daraus **nicht** folgt: dass der Preis steigen muss. Knappheit allein erzeugt keinen Wert – seltene Dinge ohne Nachfrage sind wertlos. Sie erzeugt nur die Voraussetzung dafür, dass Nachfrage sich im Preis niederschlägt.',
          ],
        },
        {
          type: 'figure',
          figure: 'bitcoin-angebot',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Der private Schlüssel',
        },
        {
          type: 'paragraph',
          text: 'Es gibt keine Coins, die irgendwo liegen. Es gibt einen Eintrag im Register und einen **privaten Schlüssel**, mit dem sich dieser Eintrag ändern lässt. Wer den Schlüssel hat, verfügt – ohne Legitimation, ohne Rückfrage, ohne Rückholung.',
        },
        {
          type: 'table',
          caption: 'Drei Verwahrformen',
          head: ['Form', 'Wer hält den Schlüssel', 'Abwägung'],
          rows: [
            [
              'Konto bei einer Handelsplattform',
              'Die Plattform',
              'Bequem. Dafür trägst du ihr Insolvenz- und Missbrauchsrisiko – wie bei jedem Guthaben ohne Einlagensicherung',
            ],
            [
              'Software-Wallet',
              'Du, auf einem internetfähigen Gerät',
              'Volle Kontrolle. Dafür hängt alles an der Sicherheit dieses Geräts',
            ],
            [
              'Hardware-Wallet',
              'Du, auf einem Gerät ohne Internetverbindung',
              'Der übliche Weg für größere Beträge. Verlust oder Zerstörung ohne gesicherte Wiederherstellungswörter bedeutet Totalverlust',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: '„Not your keys, not your coins“',
          items: [
            'Der Satz meint: Liegen deine Coins bei einer Plattform, gehören sie dir nur nach deren Buchführung. Du hast eine Forderung gegen ein Unternehmen, nicht die Verfügung über einen Registereintrag.',
            'Bei der Insolvenz mehrerer großer Plattformen hat sich genau das materialisiert – Kunden standen als gewöhnliche Gläubiger da, teils über Jahre.',
            'Die Gegenseite ist ebenso hart: Ein verlorener privater Schlüssel bedeutet endgültigen Verlust. Es gibt keine Hotline, kein Zurücksetzen, keinen Nachweis der Identität, der hülfe. Ein erheblicher Teil aller je erzeugten Bitcoin gilt aus diesem Grund als dauerhaft unzugänglich.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was das Risiko tatsächlich ist',
        },
        {
          type: 'list',
          items: [
            '**Der Preis hat keinen Boden aus Zahlungsströmen.** Bei einer Aktie kann man auf Gewinne und Substanz schauen. Hier gibt es nichts dergleichen – der Preis ist, was jemand zu zahlen bereit ist.',
            '**Rückgänge von über 70 Prozent sind mehrfach vorgekommen**, mit Erholungsdauern von Jahren. Das ist kein Ausreißer, sondern die bisherige Normalform dieses Marktes.',
            '**Kein Anlegerschutz.** Keine Einlagensicherung, kein Sondervermögen, keine Prospektpflicht wie bei Wertpapieren. Der EU-Rahmen für Kryptowerte hat daran etwas geändert, aber weniger, als sein Umfang vermuten lässt – dazu die nächste Stufe.',
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Die einzige Regel, die hier wirklich zählt',
          items: [
            'Setze nur Beträge ein, deren vollständiger Verlust deine Finanzplanung nicht berührt.',
            'Das ist keine Floskel: Es ist die praktische Konsequenz daraus, dass es keinen Bewertungsanker gibt und historische Rückgänge dieser Größenordnung eingetreten sind.',
            'Vorher stehen Notgroschen und die Tilgung teurer Schulden. Beides bringt eine sichere Rendite, die hier niemand zusagen kann.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was „Krypto“ alles meint',
        },
        {
          type: 'paragraph',
          text: 'Der Begriff fasst sehr verschiedene Dinge zusammen, und die Unterschiede sind größer als die Gemeinsamkeiten. Vier Gruppen genügen zur Orientierung:',
        },
        {
          type: 'table',
          caption: 'Vier Gruppen, vier Versprechen',
          head: ['Gruppe', 'Idee', 'Worauf zu achten ist'],
          rows: [
            [
              'Bitcoin',
              'Knappes digitales Gut mit festem Emissionsplan',
              'Kein Zahlungsstrom, kein Ertrag – der Preis ist reines Angebot und Nachfrage',
            ],
            [
              'Plattformen wie Ethereum',
              'Ein Netz, auf dem Programme laufen; die Münze bezahlt die Rechenzeit',
              'Näher an einem Nutzungswert – dafür Konkurrenz durch andere Netze',
            ],
            [
              'Stablecoins',
              'An eine Währung gekoppelt, meist an den Dollar',
              'Die Kopplung ist ein Versprechen des Herausgebers, kein Naturgesetz. Entscheidend ist, was tatsächlich als Deckung hinterlegt ist',
            ],
            [
              'Alles Übrige',
              'Tausende Projekte, Token zu Anwendungen, Sammelstücke',
              'Der weitaus größte Teil ist verschwunden. Hier findet das meiste statt, was diesem Feld seinen Ruf eingebracht hat',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Die Muster, an denen man Betrug erkennt',
          items: [
            '**Zugesagte Erträge.** „Acht Prozent auf dein Krypto-Guthaben" gibt es nicht risikofrei. Wer sie zusagt, verleiht dein Geld weiter oder zahlt aus Einlagen neuer Kunden.',
            '**Kontakt über Messenger oder Datingportale.** Wochenlanger freundlicher Austausch, dann eine Anlagegelegenheit, dann eine Plattform, die es nur für dich gibt. Die anfänglichen Auszahlungen sind Teil der Masche.',
            '**Auszahlung nur gegen Vorkosten.** „Erst Steuer überweisen, dann kommt das Geld." Ab hier ist alles Weitere ebenfalls verloren.',
            '**Prominente in der Werbung.** Fast durchweg gefälscht. Sie kosten den Betrügern nichts und erzeugen genau das Vertrauen, das die Prüfung ersetzt.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Steuerlich gelten eigene Regeln',
        },
        {
          type: 'paragraph',
          text: 'Kryptowerte sind in Deutschland keine Kapitalanlage im Sinne der Abgeltungsteuer, sondern **andere Wirtschaftsgüter**. Daraus folgen zwei Unterschiede, die man kennen muss, bevor man handelt.',
        },
        {
          type: 'list',
          items: [
            '**Nach einem Jahr Haltedauer ist ein Gewinn steuerfrei.** Das gilt bei Aktien und Fonds seit langem nicht mehr – hier schon. Der Stichtag zählt taggenau ab Anschaffung.',
            '**Innerhalb eines Jahres gilt der persönliche Steuersatz**, nicht die pauschalen 25 Prozent. Bei höherem Einkommen kann das deutlich mehr sein. Es gibt eine Freigrenze für solche privaten Veräußerungsgeschäfte – wird sie überschritten, ist der **gesamte** Gewinn steuerpflichtig, nicht nur der Teil darüber.',
            '**Niemand führt die Steuer für dich ab.** Anders als beim deutschen Broker gibt es keine automatische Abgeltung. Jeder Tausch – auch Coin gegen Coin – ist ein steuerlich relevanter Vorgang und muss selbst erklärt werden.',
            'Wer viel handelt, braucht deshalb eine lückenlose Aufzeichnung aller Käufe und Verkäufe. Das ist der praktische Grund, warum aus einem Nebenbei-Experiment schnell Buchhaltung wird.',
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Allgemeine Information, keine Steuerberatung',
          items: [
            'Die Regeln haben sich in diesem Feld mehrfach geändert und werden es wieder tun. Was hier steht, ist die Systematik zum Zeitpunkt der Erstellung.',
            'Vor einer Entscheidung gehört der aktuelle Stand geprüft – und bei größeren Beträgen der Gang zu jemandem, der dafür haftet.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was du dir merken solltest',
        },
        {
          type: 'list',
          items: [
            'Die Mengenbegrenzung folgt aus dem Halving-Schema – Knappheit allein erzeugt aber keinen Wert.',
            'Wer den privaten Schlüssel hat, verfügt; bei einer Plattform hat man nur eine Forderung.',
            'Ein verlorener Schlüssel bedeutet endgültigen Verlust ohne jede Wiederherstellung.',
            '„Krypto" meint vier sehr verschiedene Dinge – der weitaus größte Teil der Projekte ist verschwunden.',
            'Zugesagte Erträge, Messenger-Kontakt und Vorkosten sind die drei verlässlichen Betrugsmerkmale.',
            'Steuerlich gelten eigene Regeln: ein Jahr Haltedauer, persönlicher Satz davor, und niemand führt ab.',
            'Es gibt keinen Bewertungsanker und keinen Anlegerschutz – daraus folgt die Größe der Position.',
          ],
        },
      ],
    },

    // -------------------------------------------------------- Fortgeschritten
    fortgeschritten: {
      metaTitle: 'Kryptomarkt: Struktur, Zugangswege, Regulierung',
      metaDescription:
        'Wie der Kryptomarkt aufgebaut ist, was Stablecoins versprechen, welche Zugangswege es in Europa gibt und was Regulierung schützt – und was nicht.',
      title: 'Marktstruktur, Zugang und Regulierung',
      lead: 'Wo gehandelt wird, was hinter Stablecoins steckt, welche Wege es in Europa gibt – und was ein Regelwerk leisten kann.',
      readingMinutes: 17,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Ein Markt ohne Mitte',
        },
        {
          type: 'paragraph',
          text: 'Es gibt keine zentrale Börse und keine offiziellen Handelszeiten. Gehandelt wird rund um die Uhr auf konkurrierenden Plattformen, und die Preise unterscheiden sich zwischen ihnen – meist geringfügig, in Stressphasen deutlich. Wer kauft, kauft immer auf einer bestimmten Plattform zu deren Preis und deren Spread.',
        },
        {
          type: 'list',
          items: [
            '**Die Konzentration ist hoch.** Bitcoin stellt den mit Abstand größten Teil der gesamten Marktkapitalisierung, zusammen mit dem zweitgrößten Wert den überwiegenden. Die vielen tausend übrigen Coins teilen sich einen kleinen Rest – und in dieser Zahl steckt der wesentliche Unterschied im Risiko.',
            '**Kleine Coins haben dünne Orderbücher.** Wo wenig gehandelt wird, bewegen einzelne Aufträge den Preis. Das macht sie anfällig für koordinierte Kursbewegungen, deren Muster – schneller Anstieg, Werbung, Abverkauf – regelmäßig dokumentiert wird.',
            '**Handelsvolumina sind nicht durchweg belastbar.** Auf unregulierten Plattformen wurde wiederholt Handel ausgewiesen, der nicht stattgefunden hat. Für die Einschätzung der Liquidität eines kleinen Coins ist die ausgewiesene Zahl deshalb mit Vorsicht zu behandeln.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Stablecoins',
        },
        {
          type: 'paragraph',
          text: 'Ein **Stablecoin** soll dauerhaft einer Währung entsprechen, meist dem Dollar. Er ist das Bindeglied des gesamten Kryptohandels: Ein großer Teil aller Geschäfte wird gegen Stablecoins abgewickelt statt gegen echte Währung. Das Versprechen hängt vollständig an der Deckung.',
        },
        {
          type: 'table',
          caption: 'Drei Bauweisen, drei Risiken',
          head: ['Art', 'Deckung', 'Worauf es ankommt'],
          rows: [
            [
              'Mit Währungsreserven',
              'Bankguthaben und kurzlaufende Staatsanleihen',
              'Prüfbarkeit der Reserven: Wer bestätigt sie, wie oft, mit welcher Tiefe? Ein Bestätigungsvermerk ist keine Vollprüfung',
            ],
            [
              'Mit Kryptowerten überbesichert',
              'Hinterlegte Coins über dem ausgegebenen Wert',
              'Fällt die Sicherheit schnell, greifen automatische Liquidationen – in genau dem Moment, in dem der Markt ohnehin fällt',
            ],
            [
              'Algorithmisch',
              'Kein echtes Deckungsvermögen, nur ein Mechanismus',
              'Diese Konstruktion ist 2022 in großem Stil zusammengebrochen; der Mechanismus hielt der ersten ernsten Belastung nicht stand',
            ],
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Zugangswege in Europa',
        },
        {
          type: 'table',
          caption: 'Was es gibt und was es kostet',
          head: ['Weg', 'Merkmal', 'Preis dafür'],
          rows: [
            [
              'Direktkauf, eigene Verwahrung',
              'Volle Kontrolle über den Schlüssel',
              'Volle Eigenverantwortung: Sicherung, Wiederherstellung, Dokumentation',
            ],
            [
              'Direktkauf, Verwahrung bei der Plattform',
              'Bequem, sofort handelbar',
              'Insolvenz- und Missbrauchsrisiko der Plattform',
            ],
            [
              'ETP oder Zertifikat im Depot',
              'Läuft über das gewohnte Wertpapierdepot, oft physisch hinterlegt',
              'Rechtlich eine Schuldverschreibung – Emittentenrisiko. Dazu eine laufende Verwahrgebühr',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Warum es in Europa keine Krypto-ETFs gibt',
          items: [
            'Ein europäischer Fonds nach den geltenden Regeln muss gestreut sein – ein Fonds auf einen einzigen Vermögenswert erfüllt das nicht.',
            'Deshalb sind die europäischen Produkte **ETPs**, nicht ETFs: Schuldverschreibungen, meist mit hinterlegten Coins besichert. Die Besicherung mildert das Emittentenrisiko, sie beseitigt es nicht.',
            'Der Unterschied zum Sondervermögen eines echten Fonds ist rechtlich erheblich – und er ist genau der Punkt, an dem die Ähnlichkeit der Kürzel in die Irre führt.',
          ],
        },
        {
          type: 'figure',
          figure: 'krypto-zugangswege',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was Regulierung leistet',
        },
        {
          type: 'paragraph',
          text: 'Der europäische Rahmen für Kryptowerte stellt Anforderungen an die Anbieter: Zulassung, Eigenkapital, Trennung von Kundenbeständen, Informationspflichten, besondere Regeln für Stablecoin-Emittenten. Das ist ein deutlicher Fortschritt gegenüber dem vorherigen Zustand – und es lohnt, genau zu lesen, worauf er sich bezieht.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Der entscheidende Unterschied',
          items: [
            '**Geschützt wird der Umgang mit deinen Werten:** dass der Anbieter zugelassen ist, Kundenbestände getrennt hält und bestimmte Angaben machen muss.',
            '**Nicht geschützt wird der Wert selbst.** Es gibt keine Einlagensicherung für Kryptowerte und keine Entschädigung für Kursverluste. Ein Rückgang um achtzig Prozent ist unter dem neuen Rahmen genauso möglich wie vorher.',
            'Diese Unterscheidung wird in der Werbung regelmäßig verwischt. „Reguliert“ heißt: Der Anbieter unterliegt Regeln. Es heißt nicht, dass jemand für das Ergebnis einsteht.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Verwahrung: der Unterschied, den es sonst nirgends gibt',
        },
        {
          type: 'paragraph',
          text: 'Bei einer Aktie liegt das Papier im Depot einer Bank, und wer die Zugangsdaten verliert, ruft dort an. Bei einem Coin gibt es niemanden, den man anrufen kann: Wer den privaten Schlüssel hat, verfügt über die Werte – vollständig und endgültig. Das ist der Kern der Sache und nicht eine technische Randnotiz.',
        },
        {
          type: 'table',
          caption: 'Drei Arten der Verwahrung',
          head: ['Art', 'Wer den Schlüssel hat', 'Was schiefgehen kann'],
          rows: [
            [
              'Bei einer Handelsplattform',
              'die Plattform, nicht du',
              'Insolvenz, Einfrierung von Auszahlungen, Zweckentfremdung der Kundenbestände – 2022 mehrfach eingetreten',
            ],
            [
              'Eigene Verwahrung, Software',
              'du, auf einem Gerät mit Internetverbindung',
              'Schadsoftware, Gerätedefekt, verlorene Wiederherstellungswörter',
            ],
            [
              'Eigene Verwahrung, Hardware',
              'du, auf einem Gerät ohne dauerhafte Verbindung',
              'Verlust und Zerstörung des Geräts, verlorene Wiederherstellungswörter – die Wörter sind der eigentliche Wert, nicht das Gerät',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Was „endgültig" hier heißt',
          items: [
            '**Keine Rückbuchung.** Eine Überweisung an die falsche Adresse ist weg. Es gibt keine Stelle, die sie zurückholt, und keine Frist, innerhalb derer man widerspricht.',
            '**Kein Passwort-Zurücksetzen.** Die Wiederherstellungswörter *sind* der Zugang. Wer sie verliert, verliert den Bestand; wer sie abfotografiert, hat ihn verschenkt.',
            '**Kein Erbe ohne Vorbereitung.** Ohne hinterlegte Anweisung ist der Bestand für die Hinterbliebenen nicht auffindbar und nicht zugänglich. Bei einem Depot regelt das die Bank.',
            'Genau deshalb ist der Zugangsweg hier eine Anlageentscheidung und keine Bedienfrage.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die deutsche Steuer behandelt Coins anders als alles andere',
        },
        {
          type: 'paragraph',
          text: 'Kryptowerte gelten in Deutschland als **andere Wirtschaftsgüter**, nicht als Kapitalanlage. Damit greift nicht die Abgeltungsteuer, sondern § 23 EStG – dieselbe Vorschrift wie bei einem verkauften Gemälde. Das dreht mehrere gewohnte Regeln um.',
        },
        {
          type: 'list',
          items: [
            '**Nach einem Jahr Haltefrist ist der Gewinn steuerfrei.** Bei Aktien gibt es das nicht; hier schon, und das ist der größte Unterschied überhaupt.',
            '**Innerhalb des Jahres gilt der persönliche Steuersatz**, nicht die pauschalen 25 Prozent. Wer viel verdient, zahlt auf einen kurzfristigen Krypto-Gewinn mehr als auf einen Aktiengewinn.',
            '**Es gibt eine eigene Freigrenze** für private Veräußerungsgeschäfte, und sie ist eine Grenze und kein Freibetrag: Ein Euro darüber macht den **ganzen** Gewinn steuerpflichtig, nicht nur den Überschuss.',
            '**Die Bank zieht nichts ein.** Anders als beim Depot gibt es keinen automatischen Abzug – die Angabe in der Steuererklärung ist Pflicht, und die Belege dafür muss man selbst aufbewahren.',
            '**Ein ETP auf Bitcoin fällt nicht darunter.** Das ist eine Schuldverschreibung und damit Kapitalvermögen: Abgeltungsteuer, keine Haltefrist, dafür automatischer Einbehalt. Derselbe Basiswert, zwei völlig verschiedene Steuerwelten.',
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Bevor jemand danach plant',
          items: [
            'Diese Seite ist allgemeine Information und keine Steuerberatung. Die Behandlung von Kryptowerten hat sich mehrfach geändert und wird sich wieder ändern.',
            'Wer Beträge bewegt, bei denen es darauf ankommt, klärt den Einzelfall mit einer steuerberatenden Person – besonders bei Tausch zwischen Coins, bei Staking und bei allem, was Erträge abwirft.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was du dir merken solltest',
        },
        {
          type: 'list',
          items: [
            'Die Marktkapitalisierung ist stark konzentriert; kleine Coins haben dünne Orderbücher.',
            'Bei Stablecoins entscheidet die Prüfbarkeit der Deckung – algorithmische Konstruktionen sind 2022 gescheitert.',
            'Europäische Produkte sind ETPs, also Schuldverschreibungen – kein Sondervermögen.',
            'Regulierung schützt den Umgang mit den Werten, nicht ihren Wert.',
            'Wer den privaten Schlüssel hat, verfügt über die Werte – ohne Stelle, die etwas rückgängig macht.',
            'Die Wiederherstellungswörter sind der Zugang, nicht das Gerät.',
            'Coins gelten als andere Wirtschaftsgüter: nach einem Jahr steuerfrei, davor zum persönlichen Satz.',
            'Ein Bitcoin-ETP ist Kapitalvermögen – derselbe Basiswert, eine völlig andere Steuerwelt.',
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ Profi
    profi: {
      metaTitle: 'Krypto für Profis: Sicherheitsmodell und Bewertung',
      metaDescription:
        'Proof of Work gegen Proof of Stake, Angriffskosten und Finalität, Bewertungsansätze ohne Zahlungsströme und der Beitrag zum Portfolio.',
      title: 'Sicherheitsmodell und Bewertungsfrage',
      lead: 'Woraus die Sicherheit dieser Netze tatsächlich besteht – und warum jeder Bewertungsansatz an derselben Stelle scheitert.',
      readingMinutes: 13,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Sicherheit ist eine ökonomische Größe',
        },
        {
          type: 'paragraph',
          text: 'Die Sicherheit dieser Netze beruht nicht auf Verschlüsselung allein, sondern darauf, dass ein Angriff mehr kostet, als er einbringt. Das ist ein wirtschaftliches Argument, kein technisches – und es lässt sich beziffern.',
        },
        {
          type: 'table',
          caption: 'Zwei Konsensverfahren',
          head: ['', 'Proof of Work', 'Proof of Stake'],
          rows: [
            [
              'Einsatz',
              'Rechenleistung und Strom',
              'Hinterlegtes Kapital im Netz selbst',
            ],
            [
              'Angriffskosten',
              'Beschaffung und Betrieb von mehr Rechenleistung als der Rest zusammen',
              'Erwerb eines großen Anteils der eingesetzten Coins – was deren Preis treibt',
            ],
            [
              'Sanktion bei Fehlverhalten',
              'Keine direkte – der Angreifer verliert nur seine Betriebskosten',
              'Das eingesetzte Kapital wird eingezogen; der Angriff kostet unmittelbar',
            ],
            [
              'Laufende Kosten',
              'Erheblicher Energieverbrauch',
              'Sehr gering; das war der Hauptgrund für den Wechsel bei einigen Netzen',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Was daran verletzlich ist',
          items: [
            '**Der 51-Prozent-Angriff.** Wer die Mehrheit der Rechenleistung oder des Einsatzes kontrolliert, kann Transaktionen zurücknehmen. Bei den großen Netzen ist das prohibitiv teuer; bei kleineren ist es mehrfach tatsächlich geschehen.',
            '**Finalität ist eine Konvention.** Bei Proof of Work gilt eine Transaktion nie mathematisch als endgültig – sie wird nur immer unwahrscheinlicher rückgängig zu machen. Die üblichen sechs Bestätigungen sind eine Faustregel, keine Garantie.',
            '**Konzentration.** Die Rechenleistung sammelt sich in wenigen Pools, das eingesetzte Kapital bei wenigen großen Anbietern. Beides läuft der Grundidee zuwider, und beides folgt aus Skaleneffekten, die sich nicht wegregulieren lassen.',
            '**Zusatzschichten.** Lösungen, die Geschwindigkeit und Kosten verbessern, tun das regelmäßig, indem sie neue Vertrauensannahmen einführen. Wer sie nutzt, verlässt das Sicherheitsmodell der Basisschicht – oft ohne es zu bemerken.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Warum jede Bewertung an derselben Stelle scheitert',
        },
        {
          type: 'paragraph',
          text: 'Jedes Bewertungsverfahren für Aktien, Anleihen und Immobilien beruht auf demselben Gedanken: Man schätzt künftige Zahlungen und zinst sie ab. Bei einem Kryptowert gibt es keine künftigen Zahlungen. Das Verfahren ist damit nicht ungenau, sondern **nicht anwendbar** – ein Unterschied, der oft verwischt wird.',
        },
        {
          type: 'table',
          caption: 'Die üblichen Ersatzansätze und woran sie scheitern',
          head: ['Ansatz', 'Idee', 'Schwäche'],
          rows: [
            [
              'Netzwerkgröße',
              'Der Wert wächst überproportional mit der Zahl der Nutzer',
              'Die Nutzerzahl ist bei pseudonymen Adressen nicht messbar, und die unterstellte Beziehung ist nicht belegt',
            ],
            [
              'Erzeugungskosten',
              'Der Preis kann nicht dauerhaft unter die Kosten des Minings fallen',
              'Die Kausalität läuft umgekehrt: Der Aufwand richtet sich nach dem Preis, nicht der Preis nach dem Aufwand',
            ],
            [
              'Knappheitsverhältnisse',
              'Bestand geteilt durch jährlichen Zuwachs, wie bei Edelmetallen',
              'Ein reines Angebotsmaß ohne jede Aussage über Nachfrage. Prognosen auf dieser Grundlage sind mehrfach deutlich verfehlt worden',
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'Ehrlicher ist die Feststellung, dass ein Preis ohne Bewertungsanker existiert. Das macht die Anlage nicht illegitim – Gold hat dasselbe Problem und wird seit Jahrtausenden gehalten. Es macht nur jede Aussage der Form „fair bewertet“ oder „unterbewertet“ gegenstandslos.',
        },
        {
          type: 'figure',
          figure: 'krypto-bewertung',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Der Beitrag zu einem Portfolio',
        },
        {
          type: 'list',
          items: [
            '**Die Diversifikationsthese hält nicht.** Krypto galt lange als unkorreliert zu Aktien. In den Stressphasen seit 2020 fiel es gemeinsam mit Aktien, und zwar stärker – die Korrelation stieg genau dann, wenn ein Ausgleich gebraucht worden wäre. Das ist dasselbe Muster wie bei anderen risikoreichen Anlagen.',
            '**Die Schwankung dominiert jede kleine Position.** Bei einer Volatilität, die ein Vielfaches des Aktienmarkts beträgt, trägt schon eine Quote von wenigen Prozent spürbar zur Gesamtschwankung des Depots bei. Wer die Wirkung auf die Rendite spüren will, braucht eine Quote, die er im Rückgang kaum durchhält.',
            '**Die Frage, die vor jeder anderen steht:** Was wäre der Grund, hier eine Position zu halten, wenn sie nicht in den letzten Jahren gestiegen wäre? Wer darauf keine Antwort hat, die ohne den Kursverlauf auskommt, hat den Rezenzeffekt beantwortet und nicht die Anlagefrage.',
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Zur steuerlichen Behandlung – keine Steuerberatung',
          items: [
            'Kryptowerte gelten in Deutschland im Privatvermögen nicht als Kapitalanlage, sondern als sonstige Wirtschaftsgüter. Daraus folgt eine grundsätzlich andere Systematik als bei Aktien – mit einer Haltefrist, nach deren Ablauf Veräußerungsgewinne steuerfrei bleiben können.',
            'Die Einzelheiten – Zuordnung bei mehreren Käufen, Behandlung von Staking und Tausch zwischen Coins – sind streitanfällig und haben sich fortentwickelt.',
            'Bei nennenswerten Beträgen gehört das zu jemandem mit Zulassung. Die Dokumentationslast liegt dabei beim Anleger; Plattformen liefern keine Jahressteuerbescheinigung wie ein deutsches Depot.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was du dir merken solltest',
        },
        {
          type: 'list',
          items: [
            'Sicherheit ist hier eine ökonomische Größe: Ein Angriff muss teurer sein als sein Ertrag.',
            'Finalität ist bei Proof of Work eine Wahrscheinlichkeit, keine Garantie.',
            'Ohne Zahlungsströme ist jede Bewertung nicht ungenau, sondern nicht anwendbar.',
            'Die Unkorreliertheit zu Aktien hat sich in Stressphasen nicht bestätigt.',
          ],
        },
      ],
    },
  },
}
