import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/cart_provider.dart';
import '../services/auth_service.dart';

class CheckoutScreen extends StatefulWidget {
  const CheckoutScreen({super.key});

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  bool _isProcessing = false;

  void _completeOrder(BuildContext context) async {
    setState(() => _isProcessing = true);

    // Simulieren einer Zahlungsabwicklung
    await Future.delayed(const Duration(seconds: 2));

    if (!mounted) return;

    context.read<CartProvider>().clearCart();

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        title: const Text('Erfolg!'),
        content: const Text('Deine Bestellung wurde erfolgreich aufgegeben und wird bald geliefert.'),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(ctx).pop(); // Dialog schließen
              Navigator.of(context).popUntil((route) => route.isFirst); // Zurück zum Home
            },
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final cart = context.watch<CartProvider>();
    final auth = context.watch<AuthService>();
    final user = auth.currentUser;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Kasse'),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black87,
        elevation: 1,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'Lieferadresse',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Card(
              child: ListTile(
                leading: const Icon(Icons.location_on, color: Color(0xFF8E24AA)),
                title: Text(user?.name ?? 'Gast'),
                subtitle: Text(user?.adresse ?? 'Keine Adresse hinterlegt'),
                trailing: TextButton(
                  onPressed: () {
                    // Hier könnte man die Adresse ändern
                  },
                  child: const Text('Ändern'),
                ),
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'Bestellübersicht',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            ...cart.items.values.map((item) => Padding(
              padding: const EdgeInsets.symmetric(vertical: 4),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('${item.mengeKg.toStringAsFixed(1)} kg ${item.produkt.name}'),
                  Text('${item.gesamtpreis.toStringAsFixed(2).replaceAll('.', ',')} €'),
                ],
              ),
            )),
            const Divider(height: 32),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Gesamtbetrag',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                Text(
                  '${cart.totalAmount.toStringAsFixed(2).replaceAll('.', ',')} €',
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFFE53935),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 40),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFE53935),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
              onPressed: _isProcessing ? null : () => _completeOrder(context),
              child: _isProcessing
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                    )
                  : const Text(
                      'Zahlungspflichtig bestellen',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
