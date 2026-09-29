---
titel: Vier Rechtspflichten aus einem Reel, geprüft
datum: 2026-08-28
quelle: ENTSCHEIDUNGEN.md
tags:
  - projektgedaechtnis
  - website-1
---
> [!info] Abbild – nicht hier bearbeiten
> Diese Notiz wird aus `ENTSCHEIDUNGEN.md` im Repository `Website-1` erzeugt
> (`ANWENDEN=1 npm run wissen`). Änderungen hier überschreibt der nächste Lauf.

# Vier Rechtspflichten aus einem Reel, geprüft – 28. August 2026

Der Betreiber schickte ein WhatsApp-Video mit der Bitte, es anzusehen und zu
prüfen, „ob wir alles eingehalten haben".

Es war kein Screencast der Website, sondern ein Instagram-Reel eines
Marketing-Kontos: „10.000 EURO ABMAHNUNG DURCH KI-WEBSITE", „Ab 2. August –
AI ACT – NEUE REGELN", dazu eine Liste von vier Punkten. Der Aufruf am Ende
(„Schreib WEBSITE in die Kommentare") zeigt, was es ist: Werbung für eine
Dienstleistung. Das macht die vier Punkte nicht falsch – sie sind es wert,
nachgesehen zu werden –, aber die genannte Zahl ist eine Schlagzeile und keine
Rechtsfolge.

**Angesehen wurde es, indem 55 Einzelbilder herausgezogen und in
Kontaktbögen gelesen wurden.** Das mitgelieferte ffmpeg der Playwright-
Installation kann kein H.264 (`--disable-everything` beim Bauen); ein volles
über `npm i --no-save ffmpeg-static` kann es. Der Ton blieb ungehört – dafür
fehlt hier ein Modell. Die vier Punkte standen aber als Bildtafeln im Video,
sodass nichts fehlt.

## Punkt für Punkt

**1. Impressumspflicht – war erfüllt.** `/impressum` nennt Name, Anschrift und
elektronische Kontaktmöglichkeit nach § 5 DDG, dazu die redaktionell
verantwortliche Person.

**2. Urheberrecht – halb erfüllt, jetzt ganz.** Der Abschnitt sagte nur, dass
_unsere_ Inhalte geschützt sind. Das schreibt jede Website hin; die Frage, an
der es tatsächlich hängt, ist die umgekehrte: Was passiert hier mit _fremdem_
Material?

Die Antwort stand seit jeher im Code – `data/editions/types.ts`: „Die
Zusammenfassungen sind selbst geschrieben und keine Übernahme fremder Texte …
verlinkt wird stattdessen auf die Quelle" –, nur nirgends, wo ein Leser sie
findet. Nachgeprüft und ergänzt: eigene Worte statt Volltext, Quelle mit Datum
an jeder Zusammenfassung, keine Bilder Dritter (im ganzen `public/` liegt ein
einziges Bild, das eigene Logo), Kurse als Tatsachenangaben mit Quelle, dazu
ein Satz, an wen sich wenden kann, wer trotzdem Rechte berührt sieht.

**3. Datenschutz – die eine echte Lücke.** Der KI-Einsatz stand ausschließlich
im Impressum, und dort unter dem Blickwinkel der Transparenz: _Wie entstehen
die Inhalte?_ Die datenschutzrechtliche Frage ist eine andere und wurde
nirgends beantwortet: _Gehen Daten von Besuchern in ein KI-System?_

Sie tun es nicht, und das ist am Code nachprüfbar: keine Tracker (nachgesehen:
kein Google Analytics, kein Matomo, kein Plausible, kein eingebettetes
Fremdskript), die Seiten sind vorab erzeugt, die Suche läuft im Browser gegen
eine mitgelieferte Liste, das Modell bekommt ausschließlich öffentlich
veröffentlichte Quellen zu lesen. Neu ist Abschnitt 6 der
Datenschutzerklärung, der genau das hinschreibt – **keine neue Praxis, die
bestehende in lesbarer Form.**

**4. Transparenzpflicht – war erfüllt, und zwar gründlicher als verlangt.**
`/impressum` trägt seit jeher den Abschnitt „Einsatz künstlicher Intelligenz"
mit ausdrücklichem Bezug auf Art. 50 der Verordnung (EU) 2024/1689. Der
Kommentar daneben hält sogar fest, warum er dort steht, obwohl die
Kennzeichnungspflicht bei menschlicher Prüfung entfällt: „So hängt nichts an
der Auslegung der Ausnahme, und der Leser erfährt, wie die Inhalte entstehen."
Dazu kommt der gesprochene KI-Hinweis in jeder Podcastfolge.

## Was das über solche Videos sagt

Von vier Punkten waren zwei vollständig erfüllt, einer halb und einer gar
nicht – und der eine, der fehlte, fehlte nicht in der Praxis, sondern in ihrer
Beschreibung. Das ist das wiederkehrende Muster dieses Projekts: **Was nur im
Code steht, gilt für niemanden, der den Code nicht liest.**

Ein Reel ist keine Rechtsberatung, und diese Prüfung ist es auch nicht. Sie
sagt, was auf der Website steht und was der Code tut; ob die Formulierungen
tragen, gehört vor die Augen eines Anwalts. Das ist eine Entscheidung des
Betreibers und keine, die sich hier treffen lässt.
