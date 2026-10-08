import 'package:flutter/material.dart';

/// Zeigt den App-Namen "Frisch nach Hause" an:
/// "Frisch" in Rot, "nach Hause" in Lila, auf weißem Hintergrund.
class FreshToHomeLogo extends StatelessWidget {
  final double fontSize;

  const FreshToHomeLogo({super.key, this.fontSize = 32});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 4),
      child: RichText(
        text: TextSpan(
          style: TextStyle(
            fontSize: fontSize,
            fontWeight: FontWeight.bold,
            fontFamily: 'Roboto',
          ),
          children: const [
            TextSpan(
              text: 'Frisch',
              style: TextStyle(color: Color(0xFFE53935)), // Rot
            ),
            TextSpan(
              text: ' nach Hause',
              style: TextStyle(color: Color(0xFF8E24AA)), // Lila
            ),
          ],
        ),
      ),
    );
  }
}
