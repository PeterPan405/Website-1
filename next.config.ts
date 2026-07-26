import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /*
    Statischer Export: `next build` legt die fertige Website als HTML, CSS und
    JavaScript in `out/` ab.

    Möglich, weil das Projekt keine Server-Funktionen verwendet – keine Route
    Handler, keine Middleware, keine Server Actions, kein `next/image`. Alle
    Seiten werden ohnehin beim Build vorgerendert.

    Zur Vorgeschichte: Zwischendurch stand hier `output: 'standalone'`, weil ein
    Node-Server den Upload von 1.500 Einzeldateien vermieden hätte. Node.js gibt
    es beim Hoster aber nur mit einem eigenen VPS. Der Export ist ohnehin die
    passendere Form – Cloudflare Pages baut das Repository selbst und liefert das
    Ergebnis aus, es wird also überhaupt nichts mehr übertragen.
  */
  output: 'export',

  /*
    Erzeugt `news/index.html` statt `news.html`.

    Ohne diese Zeile liegt die Seite als `news.html` neben einem Ordner `news/`,
    der nur Next-interne Dateien enthält. Apache und LiteSpeed – und damit die
    üblichen Webhosting-Tarife – finden bei `/news` dann den Ordner, darin kein
    `index.html`, und liefern einen Fehler statt der Seite. Mit `trailingSlash`
    liegt in jedem Ordner ein `index.html`; die Auslieferung funktioniert damit
    ohne serverseitige Umschreiberegeln.
  */
  trailingSlash: true,
}

export default nextConfig
