import 'package:flutter/material.dart';

class PrivacyScreen extends StatelessWidget {
  const PrivacyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('Datenschutzerklärung'),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black87,
        elevation: 1,
      ),
      body: const SingleChildScrollView(
        padding: EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Datenschutzerklärung – Frisch nach Hause',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 16),
            _Abschnitt(
              titel: '1. Verantwortlicher',
              text:
                  'Verantwortlich für die Verarbeitung deiner personenbezogenen Daten im Rahmen der App "Frisch nach Hause" ist der Betreiber der App. Bei Fragen zum Datenschutz kannst du dich jederzeit über die in der App hinterlegten Kontaktdaten an uns wenden.',
            ),
            _Abschnitt(
              titel: '2. Welche Daten wir erheben',
              text:
                  'Bei der Registrierung erheben wir folgende Daten: deinen Namen, deine E-Mail-Adresse und deine Lieferadresse. Beim Login verwenden wir deine E-Mail-Adresse und dein Passwort zur Authentifizierung. Zusätzlich verarbeiten wir Daten zu deinen Bestellungen (z. B. ausgewählte Produkte und Mengen).',
            ),
            _Abschnitt(
              titel: '3. Zweck der Datenverarbeitung',
              text:
                  'Wir verwenden deine Daten ausschließlich, um dein Nutzerkonto zu verwalten, deine Bestellungen abzuwickeln und dir die bestellten Produkte an die angegebene Adresse zu liefern. Deine E-Mail-Adresse nutzen wir außerdem, um dich über den Status deiner Bestellung zu informieren.',
            ),
            _Abschnitt(
              titel: '4. Rechtsgrundlage',
              text:
                  'Die Verarbeitung deiner Daten erfolgt auf Grundlage der Erfüllung des Nutzungsvertrags (Art. 6 Abs. 1 lit. b DSGVO) sowie – soweit erforderlich – auf Grundlage deiner Einwilligung (Art. 6 Abs. 1 lit. a DSGVO).',
            ),
            _Abschnitt(
              titel: '5. Speicherung des Passworts',
              text:
                  'Dein Passwort wird niemals im Klartext gespeichert, sondern ausschließlich in verschlüsselter (gehashter) Form abgelegt.',
            ),
            _Abschnitt(
              titel: '6. Weitergabe von Daten',
              text:
                  'Eine Weitergabe deiner Daten an Dritte erfolgt nur, soweit dies zur Vertragserfüllung notwendig ist (z. B. an einen Lieferdienst zur Zustellung deiner Bestellung) oder wir gesetzlich dazu verpflichtet sind.',
            ),
            _Abschnitt(
              titel: '7. Speicherdauer',
              text:
                  'Wir speichern deine personenbezogenen Daten nur so lange, wie es für die Erfüllung der genannten Zwecke erforderlich ist oder wie es gesetzliche Aufbewahrungsfristen vorschreiben.',
            ),
            _Abschnitt(
              titel: '8. Deine Rechte',
              text:
                  'Du hast jederzeit das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung deiner Daten sowie ein Widerspruchsrecht und das Recht auf Datenübertragbarkeit gemäß den Vorgaben der DSGVO. Du kannst dein Konto und die damit verbundenen Daten jederzeit über die App löschen lassen.',
            ),
            _Abschnitt(
              titel: '9. Änderungen dieser Datenschutzerklärung',
              text:
                  'Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie an geänderte rechtliche Rahmenbedingungen oder Änderungen der App anzupassen. Die jeweils aktuelle Fassung findest du immer hier in der App.',
            ),
            SizedBox(height: 24),
            Text(
              'Stand: September 2026',
              style: TextStyle(color: Colors.black54, fontSize: 12),
            ),
          ],
        ),
      ),
    );
  }
}

class _Abschnitt extends StatelessWidget {
  final String titel;
  final String text;

  const _Abschnitt({required this.titel, required this.text});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            titel,
            style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 4),
          Text(
            text,
            style: const TextStyle(fontSize: 13, height: 1.4, color: Colors.black87),
          ),
        ],
      ),
    );
  }
}
