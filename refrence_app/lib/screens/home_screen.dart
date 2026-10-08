import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/product.dart';
import '../providers/cart_provider.dart';
import '../services/auth_service.dart';
import '../widgets/fresh_to_home_logo.dart';
import 'cart_screen.dart';
import 'privacy_screen.dart';
import 'login_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final cart = context.watch<CartProvider>();
    final auth = context.watch<AuthService>();

    return Scaffold(
      backgroundColor: const Color(0xFFF7F7F7),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 1,
        titleSpacing: 0,
        title: const FreshToHomeLogo(fontSize: 22),
        actions: [
          Stack(
            alignment: Alignment.center,
            children: [
              IconButton(
                icon: const Icon(Icons.shopping_cart_outlined,
                    color: Colors.black87),
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => const CartScreen(),
                    ),
                  );
                },
              ),
              if (cart.itemCount > 0)
                Positioned(
                  right: 6,
                  top: 6,
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: const BoxDecoration(
                      color: Color(0xFFE53935),
                      shape: BoxShape.circle,
                    ),
                    child: Text(
                      '${cart.itemCount}',
                      style: const TextStyle(color: Colors.white, fontSize: 10),
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(width: 8),
        ],
      ),
      drawer: Drawer(
        child: SafeArea(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const FreshToHomeLogo(fontSize: 26),
                    if (auth.isAuthenticated) ...[
                      const SizedBox(height: 12),
                      Text(
                        'Hallo, ${auth.currentUser?.name}',
                        style: const TextStyle(
                            fontWeight: FontWeight.bold, fontSize: 16),
                      ),
                      Text(
                        auth.currentUser?.email ?? '',
                        style: const TextStyle(
                            color: Colors.black54, fontSize: 14),
                      ),
                    ],
                  ],
                ),
              ),
              const Divider(height: 1),
              ListTile(
                leading: const Icon(Icons.privacy_tip_outlined),
                title: const Text('Datenschutzerklärung'),
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(builder: (_) => const PrivacyScreen()),
                  );
                },
              ),
              ListTile(
                leading: const Icon(Icons.logout),
                title: const Text('Abmelden'),
                onTap: () async {
                  await auth.logout();
                  if (context.mounted) {
                    Navigator.of(context).pushAndRemoveUntil(
                      MaterialPageRoute(builder: (_) => const LoginScreen()),
                      (route) => false,
                    );
                  }
                },
              ),
            ],
          ),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text(
            'Unsere Produkte',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 4),
          const Text(
            'Frisch geliefert – direkt zu dir nach Hause.',
            style: TextStyle(color: Colors.black54),
          ),
          const SizedBox(height: 16),
          ...produktListe.map(
            (produkt) => _ProduktKarte(
              produkt: produkt,
              menge: cart.getQuantity(produkt.id),
              onMengeAendern: (neueMenge) =>
                  cart.addItem(produkt, neueMenge),
            ),
          ),
        ],
      ),
    );
  }
}

class _ProduktKarte extends StatelessWidget {
  final Product produkt;
  final double menge;
  final ValueChanged<double> onMengeAendern;

  const _ProduktKarte({
    required this.produkt,
    required this.menge,
    required this.onMengeAendern,
  });

  @override
  Widget build(BuildContext context) {
    final istImWarenkorb = menge > 0;

    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: Container(
                width: 80,
                height: 80,
                color: const Color(0xFFF0E5F5),
                child: const Icon(Icons.set_meal_outlined,
                    size: 36, color: Color(0xFF8E24AA)),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    produkt.name,
                    style: const TextStyle(
                        fontSize: 16, fontWeight: FontWeight.w600),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    produkt.beschreibung,
                    style: const TextStyle(fontSize: 12, color: Colors.black54),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    '${produkt.preisProKg.toStringAsFixed(2).replaceAll('.', ',')} € / kg',
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFFE53935),
                    ),
                  ),
                  const SizedBox(height: 8),
                  if (!istImWarenkorb)
                    SizedBox(
                      width: 140,
                      child: OutlinedButton.icon(
                        onPressed: () => onMengeAendern(1.0),
                        icon: const Icon(Icons.add_shopping_cart, size: 16),
                        label: const Text('In den Warenkorb'),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: const Color(0xFF8E24AA),
                          side: const BorderSide(color: Color(0xFF8E24AA)),
                        ),
                      ),
                    )
                  else
                    Row(
                      children: [
                        IconButton(
                          icon: const Icon(Icons.remove_circle_outline),
                          color: const Color(0xFF8E24AA),
                          onPressed: () => onMengeAendern(
                              (menge - 0.5).clamp(0, 999).toDouble()),
                        ),
                        Text(
                          '${menge.toStringAsFixed(1)} kg',
                          style: const TextStyle(fontWeight: FontWeight.w600),
                        ),
                        IconButton(
                          icon: const Icon(Icons.add_circle_outline),
                          color: const Color(0xFF8E24AA),
                          onPressed: () => onMengeAendern(menge + 0.5),
                        ),
                      ],
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
