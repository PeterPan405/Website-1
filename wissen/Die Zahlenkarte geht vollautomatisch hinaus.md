---
titel: Die Zahlenkarte geht vollautomatisch hinaus
datum: 2026-11-20
quelle: ENTSCHEIDUNGEN.md
tags:
  - projektgedaechtnis
  - website-1
---
> [!info] Abbild – nicht hier bearbeiten
> Diese Notiz wird aus `ENTSCHEIDUNGEN.md` im Repository `Website-1` erzeugt
> (`ANWENDEN=1 npm run wissen`). Änderungen hier überschreibt der nächste Lauf.

# Die Zahlenkarte geht vollautomatisch hinaus – 20. November 2026

Seit dem 15.10.2026 wurde jede Zahlenkarte abgesprochen: Vorschläge, Wahl,
Entwurf gegen 14 Uhr, „passt“, dann ab 15 Uhr hinaus. In fünf Wochen hat der
Betreiber gezeigt, was er will und was nicht – genaue Zahlen, echte
Darstellungen, wenig Text, keine großen fetten Zahlen und Pillen, kein
Thema zweimal, ein weißer, ruhiger Feed (die bunte Vollbild-Seite am
18.11.: „würde zu sehr rausstechen … unästhetisch“). Am 20.11.2026 ordnete
er an: „nicht nur die Daily News, sondern auch die Daily Beiträge
vollautomatisch … Dann ab morgen alles vollautomatisch.“

## Der Riegel bleibt, nur die Hand wechselt

`freigabe` an der Karte und die Prüfungen in `lib/zahlenkarten-wecker.ts`
und `scripts/instagram-zahlenkarte.ts` bleiben unverändert: Ohne Datum von
heute geht nichts hinaus, vor 15 Uhr nichts, nach den News. Neu ist nur, wer
das Datum setzt – die Routine „Zahlenkarte des Tages“ selbst, nachdem sie
die Karte gebaut, gegen die Quellen geprüft, die Tests laufen lassen und jede
Seite angesehen hat. So bleibt ein „stopp“ des Betreibers bis 15 Uhr ein
Handgriff (Freigabe heraus), und ein Fehler der Routine hält am selben
Riegel wie bisher.

## Was die Routine nicht darf

Die Regeln für Zahlen gelten unverändert: nichts erfunden, „Warum“ nur aus
gelesenen Quellen, keine eigene Prognose. Was sie nicht belegen kann, lässt
sie weg – und wenn dann keine Karte trägt, geht an dem Tag keine hinaus.
Der Betreiber bekommt den fertigen Beitrag trotzdem zu sehen, nur danach
statt davor.

## Schlagzeile, keine Zahlenkolonne

Betreiber am 27.11.2026: „die news wirken noch immer wie wiederholende
langweilige zahlen nicht wie spannend nachrichten“. Die Anweisung verlangte
Titel „mit Zahl, wenn es eine gibt“ – heraus kam Tag für Tag dasselbe
Muster: „US-BIP: 4,3 % Wachstum“, „Reallöhne: nur noch +1,3 %“,
„US-Vertrauen: 103,3“. Thema, Doppelpunkt, Zahl; dazu Statistiken als Thema.

Seitdem: Ereignisse vor Statistiken (Entscheidungen, Übernahmen, Wechsel,
Streit, Überraschungen; eine reine Statistik höchstens einmal), der Titel
sagt, wer was tut. `schlagzeilenStil()` misst das Muster – „Thema: Zahl“,
mehr als zwei Titel mit Ziffer, mehr als zwei mit Doppelpunkt. Von den 14
Beiträgen 14.–27.11. hätte es 12 beanstandet.

Warum nur in der Probe ein Fehler: Der Instagram-Plan hält die Ausgabe nie
auf, aber ein ungültiger Plan kostet die Daily News des Tages. Der Agent
sieht den Befund in seiner Probe und schreibt um; der Weg über die
Schnittstelle fragt nicht nach – dort bleibt es eine Warnung, sonst ginge
an solchen Tagen gar nichts hinaus (Betreiber 01.11.: „Stoppen ist nicht
korrekt“).
