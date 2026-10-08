import 'package:flutter/material.dart';
import '../models/product.dart';

class CartProvider extends ChangeNotifier {
  final Map<String, WarenkorbEintrag> _items = {};

  Map<String, WarenkorbEintrag> get items => {..._items};

  int get itemCount => _items.length;

  double get totalAmount {
    var total = 0.0;
    _items.forEach((key, cartItem) {
      total += cartItem.gesamtpreis;
    });
    return total;
  }

  void addItem(Product product, double quantity) {
    if (_items.containsKey(product.id)) {
      _items[product.id]!.mengeKg = quantity;
      if (_items[product.id]!.mengeKg <= 0) {
        _items.remove(product.id);
      }
    } else {
      if (quantity > 0) {
        _items.putIfAbsent(
          product.id,
          () => WarenkorbEintrag(produkt: product, mengeKg: quantity),
        );
      }
    }
    notifyListeners();
  }

  void updateQuantity(String productId, double newQuantity) {
    if (_items.containsKey(productId)) {
      if (newQuantity <= 0) {
        _items.remove(productId);
      } else {
        _items[productId]!.mengeKg = newQuantity;
      }
      notifyListeners();
    }
  }

  void removeItem(String productId) {
    _items.remove(productId);
    notifyListeners();
  }

  void clearCart() {
    _items.clear();
    notifyListeners();
  }

  double getQuantity(String productId) {
    return _items[productId]?.mengeKg ?? 0.0;
  }
}
