import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';

class AuthService extends ChangeNotifier {
  User? _currentUser;
  bool _isLoading = false;

  User? get currentUser => _currentUser;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _currentUser != null;

  AuthService() {
    _loadUser();
  }

  Future<void> _loadUser() async {
    final prefs = await SharedPreferences.getInstance();
    final userString = prefs.getString('user_data');
    if (userString != null) {
      _currentUser = User.fromJson(jsonDecode(userString));
      notifyListeners();
    }
  }

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    notifyListeners();

    // Simulieren eines API-Aufrufs
    await Future.delayed(const Duration(milliseconds: 800));

    // Hier eine einfache Demo-Logik
    if (email.isNotEmpty && password.length >= 6) {
      _currentUser = User(
        name: 'Test Benutzer',
        email: email,
        adresse: 'Teststraße 1, 12345 Teststadt',
      );
      await _saveUser();
      _isLoading = false;
      notifyListeners();
      return true;
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  Future<bool> register({
    required String name,
    required String email,
    required String adresse,
    required String password,
  }) async {
    _isLoading = true;
    notifyListeners();

    // Simulieren eines API-Aufrufs
    await Future.delayed(const Duration(milliseconds: 800));

    _currentUser = User(name: name, email: email, adresse: adresse);
    await _saveUser();

    _isLoading = false;
    notifyListeners();
    return true;
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('user_data');
    _currentUser = null;
    notifyListeners();
  }

  Future<void> _saveUser() async {
    final prefs = await SharedPreferences.getInstance();
    if (_currentUser != null) {
      await prefs.setString('user_data', jsonEncode(_currentUser!.toJson()));
    }
  }
}
