import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../widgets/fresh_to_home_logo.dart';
import '../services/auth_service.dart';
import 'home_screen.dart';
import 'privacy_screen.dart';

class SignUpScreen extends StatefulWidget {
  const SignUpScreen({super.key});

  @override
  State<SignUpScreen> createState() => _SignUpScreenState();
}

class _SignUpScreenState extends State<SignUpScreen> {
  final _formKey = GlobalKey<FormState>();

  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _adresseController = TextEditingController();
  final TextEditingController _passwortController = TextEditingController();

  bool _passwortSichtbar = false;
  bool _datenschutzAkzeptiert = false;

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _adresseController.dispose();
    _passwortController.dispose();
    super.dispose();
  }

  String? _pflichtfeld(String? value, String feldname) {
    if (value == null || value.trim().isEmpty) {
      return 'Bitte $feldname eingeben';
    }
    return null;
  }

  String? _validiereEmail(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Bitte E-Mail-Adresse eingeben';
    }
    final emailRegex = RegExp(r'^[^@\s]+@[^@\s]+\.[^@\s]+$');
    if (!emailRegex.hasMatch(value.trim())) {
      return 'Bitte eine gültige E-Mail-Adresse eingeben';
    }
    return null;
  }

  String? _validierePasswort(String? value) {
    if (value == null || value.isEmpty) {
      return 'Bitte Passwort eingeben';
    }
    if (value.length < 6) {
      return 'Das Passwort muss mindestens 6 Zeichen haben';
    }
    return null;
  }

  Future<void> _registrieren(BuildContext context) async {
    if (!_formKey.currentState!.validate()) return;

    if (!_datenschutzAkzeptiert) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
              'Bitte akzeptiere die Datenschutzerklärung, um fortzufahren.'),
        ),
      );
      return;
    }

    final auth = context.read<AuthService>();
    final success = await auth.register(
      name: _nameController.text,
      email: _emailController.text,
      adresse: _adresseController.text,
      password: _passwortController.text,
    );

    if (!mounted) return;

    if (success) {
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(builder: (_) => const HomeScreen()),
        (route) => false,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthService>();

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.black87),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Center(child: FreshToHomeLogo(fontSize: 32)),
                const SizedBox(height: 8),
                const Center(
                  child: Text(
                    'Konto erstellen',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w600,
                      color: Colors.black87,
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                TextFormField(
                  controller: _nameController,
                  textCapitalization: TextCapitalization.words,
                  validator: (v) => _pflichtfeld(v, 'deinen Namen'),
                  decoration: const InputDecoration(
                    labelText: 'Name',
                    prefixIcon: Icon(Icons.person_outline),
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _emailController,
                  keyboardType: TextInputType.emailAddress,
                  validator: _validiereEmail,
                  decoration: const InputDecoration(
                    labelText: 'E-Mail-Adresse',
                    prefixIcon: Icon(Icons.email_outlined),
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _adresseController,
                  textCapitalization: TextCapitalization.sentences,
                  maxLines: 2,
                  validator: (v) => _pflichtfeld(v, 'deine Lieferadresse'),
                  decoration: const InputDecoration(
                    labelText: 'Adresse (Straße, PLZ, Ort)',
                    prefixIcon: Icon(Icons.home_outlined),
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _passwortController,
                  obscureText: !_passwortSichtbar,
                  validator: _validierePasswort,
                  decoration: InputDecoration(
                    labelText: 'Passwort',
                    prefixIcon: const Icon(Icons.lock_outline),
                    suffixIcon: IconButton(
                      icon: Icon(_passwortSichtbar
                          ? Icons.visibility_off
                          : Icons.visibility),
                      onPressed: () => setState(
                          () => _passwortSichtbar = !_passwortSichtbar),
                    ),
                    border: const OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Checkbox(
                      value: _datenschutzAkzeptiert,
                      activeColor: const Color(0xFF8E24AA),
                      onChanged: (value) {
                        setState(() => _datenschutzAkzeptiert = value ?? false);
                      },
                    ),
                    Expanded(
                      child: Wrap(
                        children: [
                          const Text('Ich akzeptiere die '),
                          GestureDetector(
                            onTap: () {
                              Navigator.of(context).push(
                                MaterialPageRoute(
                                    builder: (_) => const PrivacyScreen()),
                              );
                            },
                            child: const Text(
                              'Datenschutzerklärung',
                              style: TextStyle(
                                color: Color(0xFF8E24AA),
                                decoration: TextDecoration.underline,
                              ),
                            ),
                          ),
                          const Text('.'),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF8E24AA),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                  onPressed: auth.isLoading ? null : () => _registrieren(context),
                  child: auth.isLoading
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(
                            color: Colors.white,
                            strokeWidth: 2,
                          ),
                        )
                      : const Text('Registrieren', style: TextStyle(fontSize: 16)),
                ),
                const SizedBox(height: 24),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
