# BL3Labs – Offizielle Website & Landingpage

Offizielle Webpräsenz und interaktive Landingpage von **BL3Labs** ([bl3labs.com](https://bl3labs.com/)), dem Anbieter für intelligente KI-Telefonassistenz für Unternehmen.

---

## 📌 Über das Projekt

Die Website präsentiert **Leonie**, die KI-Telefonassistentin von BL3Labs. Sie demonstriert, wie Unternehmen (z. B. Praxen, Handwerksbetriebe, Salons, Hotels und Dienstleister) eingehende Kundenanrufe rund um die Uhr automatisiert, freundlich und mehrsprachig bearbeiten können – von der Beantwortung wiederkehrender Fragen über die Terminabstimmung bis hin zur strukturierten Übergabe an das Team.

### Highlights & Kernfunktionen

- **🎙️ Interaktive In-Browser Sprachdemo:**
  - Besucher können Leonie direkt über das Mikrofon im Browser testen.
  - Implementiert via WebRTC und dem **ElevenLabs Conversational AI Web SDK** (`@elevenlabs/client`).
  - Automatische Statusanzeigen (Sprechen, Zuhören, Verbindungsaufbau, Mikrofonberechtigungen).
- **📊 Simulierter Live-Anruf-Feed:**
  - Dynamischer Feed, der typische Anrufszenarien, Gesprächsdauern und Ergebnisse in Echtzeit visualisiert.
  - Automatische Zähleraktualisierung (Anrufe heute, Anfragen, Gesprächsminuten).
  - Respektiert Barrierefreiheitseinstellungen (`prefers-reduced-motion`).
- **📱 Responsives & Leichtgewichtiges Design:**
  - Entwickelt mit semantischem HTML5, modernen CSS Custom Properties (CSS-Variablen) und Vanilla JavaScript.
  - Vollständig responsives Layout optimiert für Smartphones, Tablets und Desktops.
  - Keine externen Build-Tools oder Framework-Abhängigkeiten erforderlich (Zero-Build-Architektur).
  - Inline eingebettete SVG- und PNG-Grafiken zur Minimierung externer Netzwerk-Requests.

---

## 🏢 Zielbranchen

Die Landingpage stellt konkrete Einsatzmöglichkeiten für diverse Branchen dar:

1. **Praxen & Therapie:** Terminwünsche aufnehmen, Öffnungszeiten und Anfahrt erklären.
2. **Friseur & Kosmetik:** Behandlungen erläutern, Termine abstimmen und Leerlaufzeiten minimieren.
3. **Hotels & Pensionen:** Buchungsanfragen aufnehmen, Anreisezeiten und Check-in-Fragen klären.
4. **Bau & Handwerk:** Projektanfragen aufnehmen, Besichtigungen und Rückrufe koordinieren.
5. **Handel & Floristik:** Verfügbarkeiten prüfen, Bestellungen entgegennehmen.
6. **Service & Beratung:** Kundenanliegen qualifizieren, Kontaktdaten erfassen und weiterleiten.

---

## 🛠️ Technologie-Stack

- **Markup & Struktur:** HTML5 (mit semantischen Elementen wie `<dialog>`, `<section>`, `<aside>`, etc.)
- **Styling:** Modernes Vanilla CSS3 (Flexbox, CSS Grid, Clamp-Typografie, Backdrop-Filter, CSS Animations)
- **Logik:** Modernes Vanilla JavaScript (ESM, async/await, DOM APIs)
- **Echtzeit-Sprach-KI:** [ElevenLabs Conversational AI SDK](https://elevenlabs.io/) via WebRTC
- **Hosting / DNS:** Konfiguriert für GitHub Pages (oder vergleichbares Static Web Hosting) mit Custom Domain (`CNAME: bl3labs.com`)

---

## 📂 Verzeichnisstruktur

```plaintext
.
├── CNAME           # Konfiguration der Custom Domain (bl3labs.com)
├── index.html      # Zentrale Landingpage inkl. Markup, Styling, Assets & Scripts
└── README.md       # Projektdokumentation
```

---

## 🚀 Lokale Entwicklung & Vorschau

Da die Website als statische Einzelseite konzipiert ist, wird kein Build-Schritt (`npm build` o. ä.) benötigt.

### Voraussetzungen für die Sprachdemo
> [!IMPORTANT]
> Moderne Browser verlangen für den Zugriff auf das Mikrofon (`navigator.mediaDevices.getUserMedia`) eine sichere Verbindung (**HTTPS**) oder **`localhost`**.

### Lokalen Server starten

Mit einem beliebigen lokalen HTTP-Server lässt sich die Seite sofort testen:

**Mit Python 3:**
```bash
python3 -m http.server 8000
```
Öffnen Sie anschließend [http://localhost:8000](http://localhost:8000) im Browser.

**Mit Node.js (`npx`):**
```bash
npx serve .
```

---

## ⚙️ Konfiguration & Anpassungen

### 1. ElevenLabs Agent-Parameter
Die Verbindung zur Sprach-KI ist in `index.html` im `<script>`-Block konfiguriert:
```javascript
const params = new URLSearchParams({
    agent_id: 'agent_2901m2zfr7qxegft77e97qyecx54',
    branch_id: 'agtbrch_4201m2zfr8ptegx8tnkrn0x1fx1m'
});
```
Um einen eigenen Assistenten zu verbinden, können `agent_id` und `branch_id` hier ausgetauscht werden.

### 2. Kontaktdaten & Mailto-Links
Inquiry- und Demobuttons verlinken standardmäßig auf:
- E-Mail: `office@bl3labs.com`
- Betreff-Parameter: z. B. `?subject=BL3Labs%20Demo`

### 3. Simulierte Anrufszenarien
Die Einträge für den automatisierten Live-Feed befinden sich im `examples`-Array in `index.html` und können beliebig ergänzt oder an neue Branchen angepasst werden.

---

## 📄 Lizenz & Kontakt

- **Unternehmen:** BL3Labs
- **Website:** [https://bl3labs.com](https://bl3labs.com)
- **Kontakt:** [office@bl3labs.com](mailto:office@bl3labs.com)
- **Copyright:** © 2026 BL3Labs. Alle Rechte vorbehalten.
