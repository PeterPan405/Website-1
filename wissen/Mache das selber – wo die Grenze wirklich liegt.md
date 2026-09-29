---
titel: „Mache das selber" – wo die Grenze wirklich liegt
datum: 2026-08-28
quelle: ENTSCHEIDUNGEN.md
tags:
  - projektgedaechtnis
  - website-1
---
> [!info] Abbild – nicht hier bearbeiten
> Diese Notiz wird aus `ENTSCHEIDUNGEN.md` im Repository `Website-1` erzeugt
> (`ANWENDEN=1 npm run wissen`). Änderungen hier überschreibt der nächste Lauf.

# „Mache das selber" – wo die Grenze wirklich liegt, 28. August 2026

Nach der Feststellung, dass an der Website technisch nichts mehr fehlt und
zwei Dinge beim Betreiber liegen – Search Console anmelden, Markenname
vereinheitlichen –, kam die Antwort: „mache das selber".

Berechtigt. Und beim Nachsehen stellte sich heraus: **Von beiden Punkten lässt
sich jeweils eine Hälfte hier erledigen.** Die Grenze verlief nicht zwischen
den beiden Aufgaben, sondern mitten durch jede.

## Search Console: die Anmeldung nicht, die Vorbereitung schon

Die Anmeldung braucht ein Google-Konto. Das ist keine Bequemlichkeit, sondern
eine harte Grenze: Es gibt hier keine Zugangsdaten dafür, und diese Umgebung
erreicht ohnehin nur GitHub und npm.

Was sich vorbereiten lässt, ist der Teil, der auf der Website passiert. Die
Bestätigung läuft über ein `<meta name="google-site-verification">`, und das
kann hier fertig verdrahtet werden: `googleSiteVerification` in `lib/site.ts`,
ausgegeben im Wurzel-Layout. Aus der Aufgabe „herausfinden, wie man eine
Domain bestätigt" wird damit „eine Zeichenkette einsetzen".

**Der Spread ist dabei kein Stilmittel.** `verification: { google: '' }`
gäbe ein leeres `content=""` aus, und das ist schlechter als gar kein Element:
Es sieht nach einer gesetzten Angabe aus, die nicht stimmt. Ohne Schlüssel
steht deshalb nichts da.

Gegenprobe in beide Richtungen gebaut: ohne Schlüssel kein Element, mit einem
Probeschlüssel genau eines mit dem richtigen Wert. Danach zurückgesetzt und
noch einmal gebaut – der ausgelieferte Stand trägt keinen Probewert.

## Der Markenname: das Profil nicht, die Verknüpfung schon

Auf Instagram heißt dasselbe Konto „IM Investments (@im_invests)", die Website
heißt „IM Invests". Im Google-Ergebnis stehen beide Namen untereinander. Für
eine Suchmaschine sind das zwei Marken, solange niemand sagt, dass sie
dieselbe sind.

Das Instagram-Profil umzubenennen geht von hier aus nicht – fremdes Konto,
keine Zugangsdaten, und eine Änderung nach außen an einem Auftritt, der nicht
mir gehört. Die Verknüpfung der **Namen** dagegen ist eine Zeile:
`alternateName` im `WebSite`-Schema trägt jetzt auch „IM Investments".

Das ist keine erfundene Variante – es ist die Schreibweise, die auf dem
eigenen Profil steht, nachlesbar im Screenshot des Betreibers. `sameAs`
verknüpfte schon die Profile; dieser Eintrag verknüpft die Namen.

## Die Lehre

**„Das kann nur der Betreiber" ist selten für eine ganze Aufgabe wahr.** Beide
Punkte sahen von außen wie reine Kontosachen aus. Bei beiden lag die Hälfte im
Code – die Vorbereitung, die aus einer Recherche eine Handgriff-Aufgabe macht.

Wer eine Aufgabe zurückgibt, sollte vorher fragen, welcher Teil davon
tatsächlich Zugangsdaten braucht. Meistens ist es weniger als der ganze.
