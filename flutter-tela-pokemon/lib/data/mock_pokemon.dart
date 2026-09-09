import '../models/pokemon_detail.dart';

/// Dados em memória usados pela tecnologia secundária.
///
/// O enunciado da fase 2 dispensa a integração com a API nesta tela única, então
/// os valores abaixo reproduzem a resposta que /pokemon/bulbasaur e
/// /pokemon-species/bulbasaur devolveriam, incluindo os movimentos que aparecem
/// no protótipo da fase 1.
const PokemonDetail bulbasaur = PokemonDetail(
  id: 1,
  name: 'Bulbasaur',
  genus: 'Seed Pokémon',
  types: <String>['grass', 'poison'],
  heightInMeters: 0.7,
  weightInKilograms: 6.9,
  baseExperience: 64,
  imageUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
  moves: <MoveSummary>[
    // --- Aprendidos subindo de nível ---
    MoveSummary(
      name: 'Tackle',
      typeName: 'normal',
      method: LearnMethod.levelUp,
      level: 1,
    ),
    MoveSummary(
      name: 'Growl',
      typeName: 'normal',
      method: LearnMethod.levelUp,
      level: 3,
    ),
    MoveSummary(
      name: 'Vine Whip',
      typeName: 'grass',
      method: LearnMethod.levelUp,
      level: 7,
    ),
    MoveSummary(
      name: 'Poison Powder',
      typeName: 'poison',
      method: LearnMethod.levelUp,
      level: 13,
    ),
    MoveSummary(
      name: 'Sleep Powder',
      typeName: 'grass',
      method: LearnMethod.levelUp,
      level: 13,
    ),
    MoveSummary(
      name: 'Take Down',
      typeName: 'normal',
      method: LearnMethod.levelUp,
      level: 15,
    ),
    MoveSummary(
      name: 'Razor Leaf',
      typeName: 'grass',
      method: LearnMethod.levelUp,
      level: 19,
    ),
    MoveSummary(
      name: 'Sweet Scent',
      typeName: 'normal',
      method: LearnMethod.levelUp,
      level: 21,
    ),
    MoveSummary(
      name: 'Growth',
      typeName: 'normal',
      method: LearnMethod.levelUp,
      level: 25,
    ),
    MoveSummary(
      name: 'Double-Edge',
      typeName: 'normal',
      method: LearnMethod.levelUp,
      level: 27,
    ),
    MoveSummary(
      name: 'Worry Seed',
      typeName: 'grass',
      method: LearnMethod.levelUp,
      level: 31,
    ),
    MoveSummary(
      name: 'Synthesis',
      typeName: 'grass',
      method: LearnMethod.levelUp,
      level: 33,
    ),
    MoveSummary(
      name: 'Seed Bomb',
      typeName: 'grass',
      method: LearnMethod.levelUp,
      level: 37,
    ),

    // --- Aprendidos por MT/HM ---
    MoveSummary(
      name: 'Solar Beam',
      typeName: 'grass',
      method: LearnMethod.machine,
      machineId: 'TM11',
    ),
    MoveSummary(
      name: 'Toxic',
      typeName: 'poison',
      method: LearnMethod.machine,
      machineId: 'TM06',
    ),
    MoveSummary(
      name: 'Protect',
      typeName: 'normal',
      method: LearnMethod.machine,
      machineId: 'TM17',
    ),
    MoveSummary(
      name: 'Sludge Bomb',
      typeName: 'poison',
      method: LearnMethod.machine,
      machineId: 'TM36',
    ),
    MoveSummary(
      name: 'Swords Dance',
      typeName: 'normal',
      method: LearnMethod.machine,
      machineId: 'TM75',
    ),

    // --- Herdados por ovo ---
    MoveSummary(
      name: 'Grassy Terrain',
      typeName: 'grass',
      method: LearnMethod.egg,
    ),
    MoveSummary(
      name: 'Charm',
      typeName: 'fairy',
      method: LearnMethod.egg,
    ),
    MoveSummary(
      name: 'Curse',
      typeName: 'ghost',
      method: LearnMethod.egg,
    ),
    MoveSummary(
      name: 'Ingrain',
      typeName: 'grass',
      method: LearnMethod.egg,
    ),

    // --- Ensinados por tutor ---
    MoveSummary(
      name: 'Giga Drain',
      typeName: 'grass',
      method: LearnMethod.tutor,
    ),
    MoveSummary(
      name: 'Bind',
      typeName: 'normal',
      method: LearnMethod.tutor,
    ),
    MoveSummary(
      name: 'Snore',
      typeName: 'normal',
      method: LearnMethod.tutor,
    ),
  ],
);
