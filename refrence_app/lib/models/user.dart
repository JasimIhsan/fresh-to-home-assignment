class User {
  final String name;
  final String email;
  final String adresse;

  User({
    required this.name,
    required this.email,
    required this.adresse,
  });

  Map<String, dynamic> toJson() => {
        'name': name,
        'email': email,
        'adresse': adresse,
      };

  factory User.fromJson(Map<String, dynamic> json) => User(
        name: json['name'],
        email: json['email'],
        adresse: json['adresse'],
      );
}
