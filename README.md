# HIIT Timer PWA

## Dateistruktur
```
hiit-pwa/
├── index.html          ← Haupt-App
├── manifest.json       ← PWA Manifest
├── service-worker.js   ← Offline & Caching
├── README.md           ← Diese Datei
└── icons/
    ├── icon-72.png
    ├── icon-96.png
    ├── icon-128.png
    ├── icon-144.png
    ├── icon-152.png
    ├── icon-192.png
    ├── icon-384.png
    ├── icon-512.png
    └── apple-touch-icon.png
```

## Deployment auf Netlify (empfohlen, kostenlos)
1. Gehe auf https://netlify.com und erstelle einen Account
2. Klicke auf "Add new site" → "Deploy manually"
3. Ziehe den gesamten `hiit-pwa/` Ordner per Drag & Drop
4. Netlify gibt dir eine URL wie: https://your-site.netlify.app
5. Öffne diese URL auf deinem iPhone in Safari

## Deployment auf GitHub Pages
1. Erstelle ein neues GitHub Repository
2. Lade alle Dateien aus `hiit-pwa/` hoch (Root-Ebene)
3. Settings → Pages → Branch: main → Save
4. URL: https://USERNAME.github.io/REPO-NAME

## App auf dem iPhone installieren
1. Öffne die App-URL in **Safari** (nicht Chrome!)
2. Tippe auf das **Teilen-Symbol** (□↑) unten
3. Scrolle zu **„Zum Home-Bildschirm"**
4. Tippe **Hinzufügen**
5. Die App erscheint als Icon auf deinem Homescreen

## Firebase verbinden
Trage deine Firebase-Config in index.html unter FIREBASE CONFIG ein.
Anleitung: siehe vorherige Chat-Nachrichten.

## PWA Features
- ✅ Offline-fähig (Service Worker)
- ✅ Installierbar auf iOS & Android
- ✅ Vollbild ohne Browser-UI
- ✅ Screen bleibt an während des Workouts (Wake Lock)
- ✅ Haptic Feedback bei Phasenwechsel
- ✅ iOS Safe Area (Notch / Dynamic Island)
- ✅ Automatisches Update-Handling
