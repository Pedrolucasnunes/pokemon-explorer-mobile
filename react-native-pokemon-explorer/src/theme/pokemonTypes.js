/**
 * Tradução e cor de cada tipo de Pokémon.
 *
 * A PokéAPI devolve os tipos sempre em inglês (types[].type.name). Este mapa é a
 * única fonte de verdade para exibi-los em português e para pintar os chips,
 * cabeçalhos e filtros com a cor correspondente.
 */
export const POKEMON_TYPES = {
  normal: { label: 'Normal', color: '#A8A77A' },
  fighting: { label: 'Lutador', color: '#C22E28' },
  flying: { label: 'Voador', color: '#A98FF3' },
  poison: { label: 'Venenoso', color: '#A33EA1' },
  ground: { label: 'Terrestre', color: '#E2BF65' },
  rock: { label: 'Pedra', color: '#B6A136' },
  bug: { label: 'Inseto', color: '#A6B91A' },
  ghost: { label: 'Fantasma', color: '#735797' },
  steel: { label: 'Aço', color: '#B7B7CE' },
  fire: { label: 'Fogo', color: '#EE8130' },
  water: { label: 'Água', color: '#6390F0' },
  grass: { label: 'Grama', color: '#63BC5A' },
  electric: { label: 'Elétrico', color: '#F7D02C' },
  psychic: { label: 'Psíquico', color: '#F95587' },
  ice: { label: 'Gelo', color: '#96D9D6' },
  dragon: { label: 'Dragão', color: '#6F35FC' },
  dark: { label: 'Sombrio', color: '#705746' },
  fairy: { label: 'Fada', color: '#D685AD' },
  stellar: { label: 'Estelar', color: '#40B5A5' },
  unknown: { label: 'Desconhecido', color: '#68A090' },
};

const FALLBACK = { label: 'Desconhecido', color: '#68A090' };

/** Ordem em que os tipos aparecem na régua de filtros da listagem. */
export const TYPE_FILTER_ORDER = [
  'grass',
  'fire',
  'water',
  'electric',
  'poison',
  'flying',
  'bug',
  'normal',
  'fighting',
  'ground',
  'rock',
  'psychic',
  'ice',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
];

export function getTypeInfo(typeName) {
  if (!typeName) return FALLBACK;
  return POKEMON_TYPES[typeName] || FALLBACK;
}

export function getTypeColor(typeName) {
  return getTypeInfo(typeName).color;
}

export function getTypeLabel(typeName) {
  return getTypeInfo(typeName).label;
}

/**
 * Decide entre texto claro ou escuro sobre uma cor de fundo.
 * Sem isso, tipos claros como Elétrico e Gelo ficariam ilegíveis com texto branco.
 */
export function getContrastingTextColor(hexColor) {
  const hex = String(hexColor).replace('#', '');
  if (hex.length !== 6) return '#FFFFFF';

  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  // Luminância relativa simplificada (ITU-R BT.709).
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.62 ? '#1C1C1E' : '#FFFFFF';
}
