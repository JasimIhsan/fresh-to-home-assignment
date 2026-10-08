class Product {
  final String id;
  final String name;
  final String beschreibung;
  final double preisProKg; // in Euro
  final String bildPfad; // Pfad zu assets, z.B. assets/images/leber.png

  const Product({
    required this.id,
    required this.name,
    required this.beschreibung,
    required this.preisProKg,
    required this.bildPfad,
  });
}

/// Statische Produktliste – hier kannst du später weitere Produkte
/// hinzufügen oder die Daten aus einer API laden.
final List<Product> produktListe = [
  const Product(
    id: 'leber',
    name: 'Leber',
    beschreibung: 'Frische Rinderleber, küchenfertig geschnitten.',
    preisProKg: 5.0,
    bildPfad: 'assets/images/leber.png',
  ),
  const Product(
    id: 'curry_cut',
    name: 'Curry Cut',
    beschreibung: 'Rindfleisch in Curry-Cut-Streifen, perfekt zum Kurzbraten.',
    preisProKg: 10.0,
    bildPfad: 'assets/images/curry_cut.png',
  ),
  const Product(
    id: 'rippchen',
    name: 'Rippchen mit Knochen',
    beschreibung: 'Saftige Rippchen mit Knochen, ideal zum Schmoren oder Grillen.',
    preisProKg: 10.0,
    bildPfad: 'assets/images/rippchen.png',
  ),
];

/// Ein Eintrag im Warenkorb: Produkt + gewählte Menge in kg
class WarenkorbEintrag {
  final Product produkt;
  double mengeKg;

  WarenkorbEintrag({required this.produkt, this.mengeKg = 1.0});

  double get gesamtpreis => produkt.preisProKg * mengeKg;
}
