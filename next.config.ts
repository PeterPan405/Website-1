import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /*
    Eigenständiger Node-Server statt statischem Export.

    `next build` legt unter `.next/standalone` einen lauffähigen Server ab, der
    nur die tatsächlich benötigten Abhängigkeiten mitbringt – kein `npm install`
    auf dem Webspace nötig, wo Speicher und Laufzeit knapp bemessen sind.

    Warum nicht mehr `output: 'export'`: Der statische Export erzeugt rund 1.500
    Einzeldateien. Deren Übertragung per FTP hat Hostinger nach drei Läufen
    gesperrt – die Verbindung zum Port 21 kommt seither nicht mehr zustande.
    Ein Standalone-Paket ist eine Handvoll Dateien und lässt sich als ZIP über
    den Dateimanager hochladen, den Weg also, der nachweislich funktioniert.

    Nebeneffekt: Mit einem laufenden Server sind Daten zur Laufzeit möglich –
    Kurse und Ausgaben können sich erneuern, ohne dass jemand neu hochlädt.
  */
  output: 'standalone',

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
