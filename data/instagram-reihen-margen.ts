/**
 * Umsatz und Nettogewinn (US-Dollar) des zuletzt gemeldeten Geschäftsjahres
 * für die Zahlenkarte vom 27.11.2026 „Black Friday: Was bleibt hängen?“ –
 * eingefroren aus data/snapshots/fundamentaldaten.json (SEC, XBRL-
 * Pflichtmeldungen, abgerufen 21.11.2026). Der Bestand wird fortgeschrieben;
 * die Karte muss in einer Woche dieselben Zahlen zeigen, und der Test
 * rechnet den Gewinn je 100 $ hieraus nach.
 */
export const MARGEN_SEC = [
  { name: 'Nvidia', umsatz: 215938000000, gewinn: 120067000000 },
  { name: 'Microsoft', umsatz: 281724000000, gewinn: 101832000000 },
  { name: 'Apple', umsatz: 416161000000, gewinn: 112010000000 },
  { name: 'Amazon', umsatz: 716924000000, gewinn: 77670000000 },
  { name: 'Walmart', umsatz: 706413000000, gewinn: 21893000000 },
  { name: 'Costco', umsatz: 275235000000, gewinn: 8099000000 },
] as const
