import type { Zeitpunkt } from '@/lib/finanzgeschichte'

/**
 * Die Ereignisse des Zeitstrahls, die keine Kurseinbrüche sind.
 *
 * ## Was hier aufgenommen ist – und was nicht
 *
 * Aufgenommen ist, was sich **an einem Vorgang festmachen lässt**: eine
 * Gründung, ein Gesetz, ein Vertrag, eine aufgekündigte Einlösepflicht. Das
 * sind Daten, keine Messwerte, und sie sind nachprüfbar.
 *
 * Nicht aufgenommen ist alles, wofür man eine Zahl bräuchte, die hier niemand
 * nachgeschlagen hat. Es gibt auf diesem Strahl deshalb keine Angaben zu
 * Geldmengen, Kursständen oder Inflationsraten historischer Jahre – die stünden
 * gut da und wären erinnert. Wo eine Größenordnung zur Sache gehört, steht sie
 * in Worten („mehr als fünfzig Prozent im Monat“ ist die Definition der
 * Hyperinflation, keine Messung eines bestimmten Jahres).
 *
 * Dieselbe Regel wie in `lib/geldsystem-daten.ts`, wo aus demselben Grund der
 * vielzitierte Durchschnitt von 27 Jahren über 775 Papierwährungen fehlt.
 *
 * ## Warum die Auswahl so schmal ist
 *
 * Weil ein Zeitstrahl, der alles nennt, nichts erzählt. Die Auswahl folgt einer
 * Frage: **Wovon war das Geld gedeckt, und wer entschied darüber?** Deshalb
 * stehen hier Notenbankgründungen und Währungsordnungen und nicht die
 * Regierungswechsel, die sie begleiteten.
 *
 * Die Kurseinbrüche kommen aus `data/crashes.ts` dazu und werden nicht hier
 * wiederholt. Wer eine Erholungsdauer ändert, ändert sie dort.
 */

/** Ein Ereignis – ohne die Einbruchszahlen, die es hier nicht gibt. */
export type Ereignis = Omit<Zeitpunkt, 'einbruch'>

export const GESCHICHTSEREIGNISSE: Ereignis[] = [
  {
    id: 'bank-of-england',
    jahr: 1694,
    titel: 'Die Bank of England wird gegründet',
    art: 'notenbank',
    was: 'Gegründet, um einen Krieg zu finanzieren: Private Geldgeber liehen der Krone Geld und erhielten dafür das Recht, Banknoten auszugeben. Das Pfund Sterling ist damit die älteste bis heute umlaufende Währung dieses Strahls.',
    lehre:
      'Notenbanken sind nicht aus einer Theorie entstanden, sondern aus Geldnot. Die Unabhängigkeit von der Regierung kam später – und ist bis heute keine Selbstverständlichkeit.',
    genauigkeit: 'datum',
    glossar: ['notenbank', 'fiatgeld'],
  },
  {
    id: 'us-dollar',
    jahr: 1792,
    titel: 'Der US-Dollar wird eingeführt',
    art: 'waehrung',
    was: 'Der Coinage Act legte den Dollar als Währung der Vereinigten Staaten fest, definiert über eine feste Menge Silber und Gold. Eine zentrale Notenbank hatten die USA damals noch nicht – die kam erst 121 Jahre später.',
    lehre:
      'Eine Währung braucht keine Notenbank, um zu entstehen. Sie braucht eine, um Krisen zu überstehen – das war die Lehre, die die USA im 19. Jahrhundert teuer bezahlten.',
    genauigkeit: 'datum',
    glossar: ['leitwaehrung', 'goldstandard'],
  },
  {
    id: 'goldstandard',
    jahr: 1870,
    titel: 'Der klassische Goldstandard setzt sich durch',
    art: 'geldsystem',
    was: 'Zwischen 1870 und 1914 definierten die großen Handelsnationen ihre Währungen über feste Goldmengen. Das machte die Wechselkurse untereinander fest – und die Geldmenge abhängig davon, wie viel Gold gefördert wurde.',
    lehre:
      'Feste Wechselkurse und eine selbstbestimmte Geldpolitik sind nicht gleichzeitig zu haben. Jede Ordnung auf diesem Strahl hat sich für eine Seite entschieden.',
    genauigkeit: 'datum',
    glossar: ['goldstandard', 'wechselkurs'],
  },
  {
    id: 'federal-reserve',
    jahr: 1913,
    titel: 'Die Federal Reserve entsteht',
    art: 'notenbank',
    was: 'Nach wiederholten Bankenpaniken, in denen private Bankiers als letzte Instanz einspringen mussten, schuf der Federal Reserve Act ein Notenbanksystem für die USA. Aufgabe: im Ernstfall Geld bereitzustellen, wenn sonst niemand mehr leiht.',
    lehre:
      'Der Zweck einer Notenbank ist nicht der Zinssatz, sondern die Bereitschaft, in der Panik zu leihen. Alles andere kam später dazu.',
    genauigkeit: 'datum',
    glossar: ['notenbank', 'leitzins', 'zentralbankgeld'],
  },
  {
    id: 'papiermark-ende',
    jahr: 1923,
    titel: 'Das Ende der Papiermark',
    art: 'waehrung',
    was: 'Die im Krieg von der Goldbindung gelöste Mark verlor bis 1923 ihre Funktion als Zahlungsmittel vollständig. Die Rentenmark löste sie ab; auf ihre Einführung folgte 1924 die Reichsmark.',
    lehre:
      'Hyperinflation beginnt nicht mit der Geldmenge allein, sondern mit dem Punkt, an dem alle ihr Geld sofort ausgeben. Dieselbe Menge wechselt dann viel häufiger den Besitzer.',
    genauigkeit: 'datum',
    glossar: ['hyperinflation', 'inflation', 'fiatgeld'],
  },
  {
    id: 'bretton-woods',
    jahr: 1944,
    titel: 'Bretton Woods',
    art: 'geldsystem',
    was: 'Die Nachkriegsordnung band den Dollar an Gold und alle anderen Währungen an den Dollar. Wer Dollar hielt, konnte sie bei den USA in Gold einlösen – jedenfalls als Staat.',
    lehre:
      'Die Weltwährung war damit an das Versprechen eines einzelnen Landes geknüpft. Wie lange ein solches Versprechen trägt, ist der Rest dieser Zeile.',
    genauigkeit: 'datum',
    glossar: ['bretton-woods', 'goldstandard', 'leitwaehrung'],
  },
  {
    id: 'dmark',
    jahr: 1948,
    titel: 'Die D-Mark löst die Reichsmark ab',
    art: 'waehrung',
    was: 'Die Reichsmark hatte nach dem Krieg ihre Funktion verloren – gehandelt wurde in Zigaretten und Naturalien. Die Währungsreform tauschte sie gegen die D-Mark und entwertete dabei Guthaben stark.',
    lehre:
      'Eine Währungsreform trifft Sparer und entlastet Schuldner. Wer Sachwerte hielt, kam besser durch als wer ein Konto hatte – der Grund, warum diese Frage bis heute jede Anlagediskussion in Deutschland begleitet.',
    genauigkeit: 'datum',
    glossar: ['kaufkraft', 'inflation'],
  },
  {
    id: 'triffin',
    jahr: 1960,
    titel: 'Triffin beschreibt den Widerspruch',
    art: 'geldsystem',
    was: 'Robert Triffin zeigte, dass die Weltwährung in einem Dilemma steckt: Damit alle genug Dollar haben, müssen die USA dauerhaft mehr ausgeben als einnehmen – wodurch das Einlöseversprechen in Gold immer unglaubwürdiger wird.',
    lehre:
      'Das Ende von Bretton Woods war elf Jahre vorher beschrieben. Ein bekannter Konstruktionsfehler beendet ein System trotzdem nicht – er wartet nur.',
    genauigkeit: 'datum',
    glossar: ['triffin-dilemma', 'leitwaehrung', 'bretton-woods'],
  },
  {
    id: 'nixon-schock',
    jahr: 1971,
    tag: '15. August 1971',
    titel: 'Das Goldfenster schließt',
    art: 'geldsystem',
    was: 'Die USA kündigten die Einlösbarkeit des Dollars in Gold auf. Seit 1973 schwanken die großen Währungen frei gegeneinander; seither ist alles umlaufende Geld Fiatgeld – gedeckt durch nichts als die Erwartung, dass es angenommen wird.',
    lehre:
      'Der wichtigste Tag dieses Strahls für heutige Anleger. Alles, was über Inflation, Notenbanken und Kaufkraft zu sagen ist, gilt erst seit ihm in dieser Form.',
    genauigkeit: 'datum',
    glossar: ['fiatgeld', 'bretton-woods', 'goldstandard'],
  },
  {
    id: 'ezb',
    jahr: 1998,
    titel: 'Die Europäische Zentralbank nimmt die Arbeit auf',
    art: 'notenbank',
    was: 'Elf Staaten übertrugen ihre Geldpolitik einer gemeinsamen Notenbank mit einem vorrangigen Ziel: Preisstabilität. Die Zinsentscheidungen für den Euroraum fallen seither an einer Stelle, die Haushaltspolitik bleibt bei den Staaten.',
    lehre:
      'Eine gemeinsame Geldpolitik ohne gemeinsame Finanzpolitik ist die Konstruktion, an der sich jede Eurokrise entzündet hat.',
    genauigkeit: 'datum',
    glossar: ['notenbank', 'leitzins', 'inflation'],
  },
  {
    id: 'euro',
    jahr: 1999,
    titel: 'Der Euro kommt – zuerst als Buchgeld',
    art: 'waehrung',
    was: 'Zum 1. Januar 1999 wurden die Umrechnungskurse unwiderruflich festgelegt; Konten und Wertpapiere lauteten von da an auf Euro. Scheine und Münzen folgten erst drei Jahre später.',
    lehre:
      'Die D-Mark ist nicht gescheitert, sie ist aufgegangen. Wer beides in eine Statistik über „gescheiterte Papierwährungen“ wirft, vergleicht zwei grundverschiedene Vorgänge.',
    genauigkeit: 'datum',
    glossar: ['wechselkurs', 'leitwaehrung'],
  },
  {
    id: 'euro-bargeld',
    jahr: 2002,
    titel: 'Euro-Scheine und -Münzen ersetzen die nationalen',
    art: 'waehrung',
    was: 'Am 1. Januar 2002 kam das Bargeld in Umlauf, in zwölf Ländern gleichzeitig. Die D-Mark blieb kurz parallel gültig und ist bei der Bundesbank bis heute unbefristet umtauschbar.',
    lehre:
      'Der Umtausch ohne Frist ist die Ausnahme, nicht die Regel – bei den meisten abgelösten Währungen der Welt verfiel der Anspruch. Wer alte Scheine findet, sollte zuerst diese Frage klären.',
    genauigkeit: 'datum',
    glossar: ['kaufkraft'],
  },
  {
    id: 'abgeltungsteuer',
    jahr: 2009,
    titel: 'Die Abgeltungsteuer löst die Spekulationsfrist ab',
    art: 'geldsystem',
    was: 'Bis 2008 waren Kursgewinne nach einem Jahr Haltedauer steuerfrei. Seit 2009 werden Kapitalerträge pauschal besteuert – dafür einheitlich und ohne Rücksicht auf den persönlichen Steuersatz.',
    lehre:
      'Steuerregeln sind kein Naturgesetz. Wer eine Renditerechnung über dreißig Jahre aufstellt, rechnet mit einem Steuerrecht, das es dreißig Jahre lang so nicht geben wird.',
    genauigkeit: 'datum',
    glossar: ['abgeltungsteuer', 'sparerpauschbetrag'],
  },
  {
    id: 'investmentsteuerreform',
    jahr: 2018,
    titel: 'Die Investmentsteuerreform bringt die Vorabpauschale',
    art: 'geldsystem',
    was: 'Fonds werden seither auf Fondsebene besteuert, dafür sind Teile der Erträge beim Anleger freigestellt. Neu ist die Vorabpauschale: ein rechnerischer Mindestertrag, der auch dann besteuert wird, wenn nichts ausgeschüttet wurde.',
    lehre:
      'Der Grund, warum „thesaurierend heißt steuerfrei bis zum Verkauf“ seit 2018 nicht mehr stimmt – und warum im Januar Geld vom Verrechnungskonto abgeht.',
    genauigkeit: 'datum',
    glossar: ['vorabpauschale', 'teilfreistellung', 'thesaurierung'],
  },
]
