import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /*
    Statischer Export: `next build` legt die fertige Website als HTML, CSS und
    JavaScript in `out/` ab. Das Projekt muss dafür auf nichts verzichten – es
    verwendet keine Server-Funktionen (keine Route Handler, keine Middleware,
    keine Server Actions, kein `next/image`), und alle Seiten werden ohnehin
    schon beim Build vorgerendert.

    Der Vorteil: Der Inhalt von `out/` läuft auf jedem Webspace, der Dateien
    ausliefern kann – also auch auf einem einfachen Tarif ohne Node.js.
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
