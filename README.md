# Michael Friedl · Finanzberatung

Offizielle Website. Statische Seite, veröffentlicht über GitHub Pages.

**Live:** https://michaelgitiiii.github.io/Michael--friedl--finanzberatung/

Veröffentlichung läuft direkt aus diesem Branch (Settings → Pages → Deploy from a branch).
Jeder Push aktualisiert die Seite nach ein bis zwei Minuten automatisch.

## Aufbau

| Datei | Inhalt |
|---|---|
| `index.html` | Startseite mit Leistungen, Ablauf, Über mich, Terminbuchung und Fragebogen |
| `impressum.html` | Impressum |
| `datenschutz.html` | Datenschutzerklärung und Erstinformation |
| `styles.css` | Gestaltung |
| `script.js` | Fragebogen, Navigation, Terminkalender-Einbindung |
| `assets/` | Portraitfotos |

## Konfiguration in `script.js`

- `BOOKINGS_URL` — Microsoft-Bookings-Seite, synchron mit Outlook. **Eingetragen.**
- `WEB3FORMS_ACCESS_KEY` — Zustellung der Fragebogen-Anfragen per E-Mail. **Fehlt noch:**
  Zugang auf web3forms.com anlegen, Key hier eintragen.

## Vor dem endgültigen Livegang

Im Impressum und in der Datenschutzerklärung sind einzelne Pflichtangaben noch offen
(gelb markiert): Vermittlerregisternummer, USt-IdNr., zuständige Schlichtungsstelle
sowie die exakte Formulierung zu Erlaubnisstatus und Haftung. Diese Angaben mit tecis
abstimmen und rechtlich prüfen lassen.
