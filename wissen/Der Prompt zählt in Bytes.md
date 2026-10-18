---
titel: Der Prompt zählt in Bytes
datum: 2026-10-18
quelle: ENTSCHEIDUNGEN.md
tags:
  - projektgedaechtnis
  - website-1
---
> [!info] Abbild – nicht hier bearbeiten
> Diese Notiz wird aus `ENTSCHEIDUNGEN.md` im Repository `Website-1` erzeugt
> (`ANWENDEN=1 npm run wissen`). Änderungen hier überschreibt der nächste Lauf.

# Der Prompt zählt in Bytes – 18. Oktober 2026

Nach der Wochenend-Regel lief `nachrichten-agent.yml` nicht mehr: bei jedem
Push ein roter Lauf „No jobs were run", Mails an den Betreiber. GitHub nimmt
für einen Text mit `${{ … }}` höchstens 21.000 – **Bytes**. Der Prompt hatte
20.898 Bytes (lief), mit der Regel 21.560. Die erste Korrektur kürzte nach
Zeichen auf 20.680 und lag in Bytes mit 21.142 noch darüber; „, ä, – sind
zwei bis drei Bytes.

Jetzt 20.737 Bytes, und `tests/instagram-tagesnews.test.ts` misst den Block
in Bytes (Grenze 20.800). Wer dort eine Regel ergänzt, kürzt an anderer
Stelle. **Eine Grenze, die man in der falschen Einheit misst, ist keine.**
