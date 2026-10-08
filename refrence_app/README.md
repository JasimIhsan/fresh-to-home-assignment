# Frisch nach Hause – Flutter App

Eine Beispiel-App zur Bestellung von frischem Fleisch, komplett auf Deutsch.

## Enthaltene Funktionen

- **Splash Screen** mit Logo: "Frisch" (rot) + "nach Hause" (lila) auf weißem Hintergrund
- **Registrierung (Sign Up):** Name, E-Mail-Adresse, Adresse, Passwort
- **Anmeldung (Sign In):** E-Mail-Adresse + Passwort
- **Produktliste:**
  - Leber – 5,00 € / kg
  - Curry Cut – 10,00 € / kg
  - Rippchen mit Knochen – 10,00 € / kg
- **Warenkorb** mit Mengenauswahl (in kg) und Gesamtsumme
- **Datenschutzerklärung** (Datenschutz-Screen, DSGVO-orientiert)

## Projektstruktur

```
fresh_to_home/
├── pubspec.yaml
└── lib/
    ├── main.dart
    ├── models/
    │   └── product.dart
    ├── widgets/
    │   └── fresh_to_home_logo.dart
    └── screens/
        ├── splash_screen.dart
        ├── login_screen.dart
        ├── signup_screen.dart
        ├── home_screen.dart
        ├── cart_screen.dart
        └── privacy_screen.dart
```

## Installation & Start

1. Flutter SDK installieren (falls noch nicht vorhanden): https://docs.flutter.dev/get-started/install
2. Diesen Ordner (`fresh_to_home`) in dein Projektverzeichnis kopieren.
3. Im Terminal in den Projektordner wechseln:
   ```bash
   cd fresh_to_home
   ```
4. Abhängigkeiten installieren:
   ```bash
   flutter pub get
   ```
5. App starten (Emulator oder angeschlossenes Gerät):
   ```bash
   flutter run
   ```

## Hinweise zur Weiterentwicklung

- Aktuell ist **keine echte Backend-Anbindung** enthalten. Login und Registrierung
  simulieren nur einen Ladevorgang (`Future.delayed`). Für eine echte App solltest
  du eine Backend-API (z. B. Firebase Auth, eigenes REST-Backend) anbinden.
- Passwörter sollten serverseitig immer gehasht gespeichert werden – niemals im Klartext.
- Für Produktbilder kannst du eigene Bilder in `assets/images/` ablegen und in
  `pubspec.yaml` unter `flutter: assets:` registrieren. Aktuell wird ein
  Platzhalter-Icon angezeigt.
- Preise und Produkte kannst du einfach in `lib/models/product.dart` anpassen
  oder erweitern.
