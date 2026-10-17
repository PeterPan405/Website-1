/**
 * Die OAuth-1.0a-Anmeldung für X – im Namen des Kontos, HMAC-SHA1.
 *
 * Eigene Datei, damit der Test sie gegen das Rechenbeispiel aus der
 * X-Dokumentation („Creating a signature") prüfen kann: Diese Umgebung
 * erreicht X nicht, und ein Fehler in der Signatur zeigte sich sonst erst
 * beim ersten echten Lauf als 401.
 *
 * In die Signatur gehören die OAuth-Werte, die Abfrageparameter der Adresse
 * und – nur bei `application/x-www-form-urlencoded` – die Felder des Rumpfs.
 * JSON und multipart bleiben draußen.
 */
import { createHmac, randomBytes } from 'node:crypto'

export interface XSchluessel {
  key: string
  secret: string
  token: string
  tokenSecret: string
}

/** Prozentkodierung nach RFC 3986 – `encodeURIComponent` lässt `!'()*` stehen. */
export const kodiere = (s: string) =>
  encodeURIComponent(s).replace(
    /[!'()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`
  )

export function oauthKopf(
  methode: string,
  adresse: string,
  s: XSchluessel,
  formular: Record<string, string> = {},
  nonce = randomBytes(16).toString('hex'),
  zeit = Math.floor(Date.now() / 1000)
): string {
  const oauth: Record<string, string> = {
    oauth_consumer_key: s.key,
    oauth_nonce: nonce,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: String(zeit),
    oauth_token: s.token,
    oauth_version: '1.0',
  }
  const url = new URL(adresse)
  const alle = [
    ...Object.entries(oauth),
    ...url.searchParams.entries(),
    ...Object.entries(formular),
  ]
    .map(([k, v]) => [kodiere(k), kodiere(v)])
    .sort(([a, x], [b, y]) => (a === b ? (x < y ? -1 : 1) : a < b ? -1 : 1))
    .map(([k, v]) => `${k}=${v}`)
    .join('&')
  const basis = [
    methode.toUpperCase(),
    kodiere(`${url.origin}${url.pathname}`),
    kodiere(alle),
  ].join('&')
  oauth.oauth_signature = createHmac(
    'sha1',
    `${kodiere(s.secret)}&${kodiere(s.tokenSecret)}`
  )
    .update(basis)
    .digest('base64')
  return (
    'OAuth ' +
    Object.entries(oauth)
      .map(([k, v]) => `${kodiere(k)}="${kodiere(v)}"`)
      .join(', ')
  )
}
