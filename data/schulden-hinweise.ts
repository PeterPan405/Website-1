/**
 * Erklärende Hinweise zu einzelnen Ländern im Schuldenvergleich.
 *
 * ## Warum das übrig blieb
 *
 * Bis Juli 2026 stand die Staatsverschuldung als Demo-Datensatz von achtzehn
 * handgeschriebenen Ländern in `data/debt.ts`. Die Zahlen darin sind ersetzt –
 * sie kommen jetzt aus `data/snapshots/laender.json`, also von IWF und
 * Weltbank. Diese Sätze nicht: Sie sind das Einzige an dem alten Datensatz,
 * was keine Schnittstelle liefert.
 *
 * Eine Schuldenquote von 40 Prozent sieht gut aus. Dass sie bei Irland
 * hauptsächlich daran liegt, dass internationale Konzernstrukturen das BIP
 * aufblähen, steht in keiner Datenbank – und ohne diesen Satz führt die Zahl
 * in die Irre. Genau dafür sind diese Hinweise da: für die Fälle, in denen die
 * Zahl allein etwas Falsches nahelegt.
 *
 * ## Was hier nicht hineingehört
 *
 * Ein Hinweis je Land. Für 178 Länder gäbe es keine 178 belegten Sätze,
 * sondern 160 erfundene. Was hier steht, ist begründbar; alles andere fehlt
 * lieber.
 *
 * Schlüssel ist der ISO-3166-1-Alpha-3-Code, wie ihn die Momentaufnahme führt.
 */

export const schuldenHinweise: Readonly<Record<string, string>> = {
  DEU: 'Die Schuldenbremse im Grundgesetz begrenzt die strukturelle Neuverschuldung des Bundes.',
  ITA: 'Hoher Schuldenstand bei gleichzeitig langer durchschnittlicher Restlaufzeit der Anleihen.',
  GRC: 'Ein großer Teil der Schulden liegt bei öffentlichen Gläubigern mit sehr langen Laufzeiten und festen Zinsen.',
  IRL: 'Das irische BIP ist durch internationale Konzernstrukturen stark überhöht – die Quote sieht dadurch günstiger aus, als sie wirtschaftlich ist.',
  USA: 'Der Dollar als Weltreservewährung verschafft den USA dauerhaft besonders günstige Finanzierungsbedingungen.',
  JPN: 'Höchste Quote der Industrieländer – aber überwiegend im Inland finanziert, ein großer Teil liegt bei der eigenen Notenbank.',
  CHN: 'Zusätzlich existieren erhebliche Schulden von Provinzen und staatsnahen Unternehmen, die in dieser Kennzahl nicht enthalten sind.',
  LUX: 'Das luxemburgische BIP ist durch den Finanzplatz stark überhöht: Ein erheblicher Teil der Wirtschaftsleistung entsteht durch Grenzgänger und internationale Fondsstrukturen.',
  NOR: 'Dem Schuldenstand steht der Staatsfonds gegenüber, der die Schulden um ein Vielfaches übersteigt. Die Bruttoquote allein sagt hier besonders wenig.',
  CHE: 'Die Schuldenbremse ist seit 2003 in der Verfassung verankert und hat die Quote über zwei Jahrzehnte gesenkt.',
}

/**
 * Die Mitglieder des Euroraums.
 *
 * Ausgeschrieben und nicht abgeleitet. Der naheliegende Weg wäre, auf die
 * Währung im Datenbestand zu sehen – aber Monaco, Andorra, San Marino, der
 * Vatikan, Montenegro und der Kosovo verwenden ebenfalls den Euro, ohne dem
 * Währungsraum anzugehören. Sie mitzuzählen wäre nicht bloß ungenau, es wäre
 * eine falsche Aussage über die Geldpolitik dieser Länder.
 *
 * Stand: 20 Mitglieder, zuletzt Kroatien zum 1. Januar 2023.
 */
export const euroraum: ReadonlySet<string> = new Set([
  'AUT',
  'BEL',
  'HRV',
  'CYP',
  'EST',
  'FIN',
  'FRA',
  'DEU',
  'GRC',
  'IRL',
  'ITA',
  'LVA',
  'LTU',
  'LUX',
  'MLT',
  'NLD',
  'PRT',
  'SVK',
  'SVN',
  'ESP',
])
