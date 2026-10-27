---
titel: Die Designsprache von IM Capital
datum: 2026-10-27
quelle: ENTSCHEIDUNGEN.md
tags:
  - projektgedaechtnis
  - website-1
---
> [!info] Abbild – nicht hier bearbeiten
> Diese Notiz wird aus `ENTSCHEIDUNGEN.md` im Repository `Website-1` erzeugt
> (`ANWENDEN=1 npm run wissen`). Änderungen hier überschreibt der nächste Lauf.

# Die Designsprache von IM Capital – 27. Oktober 2026

Drei Runden „sieht nach Vibe-Coding aus" (26. und 27.10.: TradingView-Charts,
„Finanzhaus" mit IBM Plex, Startseite ohne Kartenwand) hatten jedes Mal
Einzelteile verbessert und jedes Mal die nächste Rüge geerntet. Dann legte
der Betreiber das Gestaltungsblatt seines zweiten Projekts IM Capital vor:
„Bitte in genau diesen Vorgaben alles umsetzen." Es steht unverändert in
`GESTALTUNG.md` und ist seitdem die Vorlage, nicht eine Anregung.

**Warum über die Marken und nicht Seite für Seite.** Die Website trägt rund
400 Stellen mit `text-fg-subtle`, 120 mit `fk-card`, 80 mit Bereichsfarben.
Die Tailwind-Namen zeigen deshalb auf die Stufen des Blatts: `text-xs` … `text-6xl`
sind die neun Größen samt Laufweite, eine Abstandseinheit sind 4 px, die
Wurzel 15 px, `rounded-md` 12 px. Die Bereichsfarben bleiben als Namen und
zeigen auf Text und Grau – „keine Farbe als Schmuck". `--c-fg-subtle` ist
dieselbe zweite Textstufe wie `--c-fg-muted`: zwei Textstufen, nicht drei.

**Was dafür von Hand umgebaut ist:** Navigation (Text statt Pille, 2-px-Strich),
Knöpfe (gefüllt in der Textfarbe, eine Hauptsache je Bildschirm), Felder,
Aufklapper (Haarlinie statt Kasten), Marktübersicht und Startseite (Listen
statt Kurskacheln), Nachrichten und Akademie (Abschnitte statt Karten),
Hinweiskästen (das eine Grau, keine Tönung), Kennzahlen ohne Grün auf dem Stand.

**Nebenbefund:** `npm run kontrast` maß nach dem Umschalten des Schemas sofort
– mitten in den 0,15-s-Übergängen. Schwarz auf Schwarz, das niemand je sieht,
stand als Fehler da. Die Prüfung schaltet Übergänge jetzt ab, bevor sie misst.

Zurück zu den Regeln: `AGENTS.md`, „Farbschema und Gestaltung".
