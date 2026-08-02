/**
 * Anbieterdaten für Impressum und Datenschutzerklärung.
 *
 * Bewusst ein eigenes Modul und **nicht** Teil von `siteConfig`: Es ist eine
 * Privatanschrift. Auf den beiden Rechtsseiten muss sie öffentlich stehen, in
 * den strukturierten Daten der Organisation hätte sie dagegen nichts zu suchen –
 * dort ginge sie zusätzlich maschinenlesbar an Suchmaschinen und Adresshändler.
 *
 * `siteConfig` wird von Layout, Fußzeile und JSON-LD gelesen; was dort steht,
 * landet früher oder später überall. Ein getrenntes Modul macht jede Verwendung
 * zu einer bewussten Entscheidung.
 */

export const provider = {
  name: 'Igor Maier',
  street: 'Neuffenstraße 38',
  city: '71696 Möglingen',
  country: 'Deutschland',
} as const

/** Anschrift in einer Zeile, für Fließtext. */
export const providerAddressLine = `${provider.name}, ${provider.street}, ${provider.city}`

/**
 * Zuständige Aufsichtsbehörde nach Art. 77 DSGVO.
 *
 * Richtet sich nach dem Sitz des Verantwortlichen – Möglingen liegt in
 * Baden-Württemberg. Zieht der Sitz in ein anderes Bundesland um, ändert sich
 * auch diese Angabe.
 */
export const supervisoryAuthority = {
  name: 'Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg',
  seat: 'Stuttgart',
  url: 'https://www.baden-wuerttemberg.datenschutz.de',
} as const

/**
 * Stand der Datenschutzerklärung.
 *
 * Fest eingetragen und nicht aus dem Bauzeitpunkt abgeleitet: Sonst behauptete
 * jede Neuveröffentlichung eine inhaltliche Überarbeitung, die es nicht gab.
 * Bei einer echten Änderung des Textes hier mit anpassen.
 */
export const privacyPolicyDate = '2. August 2026'
