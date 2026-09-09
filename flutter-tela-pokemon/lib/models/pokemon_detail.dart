/// Modelos da tela de detalhes.
///
/// Diferente do aplicativo principal, aqui os dados não vêm da PokéAPI: são
/// carregados de uma fonte em memória (`data/mock_pokemon.dart`), conforme o
/// enunciado da fase 2 para a tecnologia secundária. Os modelos, no entanto,
/// têm a mesma forma dos objetos produzidos pelos adaptadores do React Native,
/// de modo que a tela seria plugável a uma camada de rede sem alteração.

/// Como um Pokémon aprende um movimento.
enum LearnMethod {
  levelUp('level-up', 'Nível'),
  machine('machine', 'MT/HM'),
  egg('egg', 'Ovo'),
  tutor('tutor', 'Tutor');

  const LearnMethod(this.apiName, this.label);

  /// Nome exato devolvido pela API em `move_learn_method.name`.
  final String apiName;

  /// Rótulo exibido no filtro da tela.
  final String label;
}

class MoveSummary {
  const MoveSummary({
    required this.name,
    required this.typeName,
    required this.method,
    this.level = 0,
    this.machineId,
  });

  /// Nome já formatado para exibição, ex.: "Vine Whip".
  final String name;

  /// Tipo do movimento, ex.: "grass".
  final String typeName;

  final LearnMethod method;

  /// Nível em que é aprendido; só é relevante quando o método é level-up.
  final int level;

  /// Identificador da MT, ex.: "TM11". Nulo para os demais métodos.
  final String? machineId;

  /// Linha secundária da lista, no mesmo formato do protótipo da fase 1.
  String get subtitle {
    switch (method) {
      case LearnMethod.levelUp:
        return 'level-up · nível $level';
      case LearnMethod.machine:
        return machineId == null ? 'machine' : 'machine · $machineId';
      case LearnMethod.egg:
        return 'egg';
      case LearnMethod.tutor:
        return 'tutor';
    }
  }
}

class PokemonDetail {
  const PokemonDetail({
    required this.id,
    required this.name,
    required this.genus,
    required this.types,
    required this.heightInMeters,
    required this.weightInKilograms,
    required this.baseExperience,
    required this.imageUrl,
    required this.moves,
  });

  final int id;
  final String name;

  /// Categoria da espécie, ex.: "Seed Pokémon".
  final String genus;

  final List<String> types;
  final double heightInMeters;
  final double weightInKilograms;
  final int baseExperience;
  final String imageUrl;
  final List<MoveSummary> moves;

  /// Define a cor do cabeçalho da tela.
  String get primaryType => types.first;

  /// "#0001"
  String get pokedexNumber => '#${id.toString().padLeft(4, '0')}';

  /// "0,7 m" — vírgula decimal, como no protótipo.
  String get formattedHeight =>
      '${heightInMeters.toStringAsFixed(1).replaceAll('.', ',')} m';

  /// "6,9 kg"
  String get formattedWeight =>
      '${weightInKilograms.toStringAsFixed(1).replaceAll('.', ',')} kg';

  /// Filtra os movimentos pelo método selecionado; `null` devolve todos.
  List<MoveSummary> movesBy(LearnMethod? method) {
    if (method == null) return moves;
    return moves.where((MoveSummary move) => move.method == method).toList();
  }
}
