/**
 * Formatações de texto e número usadas na interface.
 *
 * Os números são formatados manualmente em vez de usar Intl/toLocaleString porque
 * o motor Hermes do React Native nem sempre embarca a tabela de locales completa,
 * o que faria "1.302" virar "1302" em alguns dispositivos.
 */

/** 1302 -> "1.302" */
export function formatThousands(value) {
  if (value === null || value === undefined) return '—';
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/** 25 -> "#0025" */
export function formatPokedexNumber(id) {
  if (id === null || id === undefined) return '#----';
  return `#${String(id).padStart(4, '0')}`;
}

/** "thunder-shock" -> "Thunder Shock" | "nidoran-f" -> "Nidoran F" */
export function formatName(rawName) {
  if (!rawName) return '';
  return rawName
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/** A API devolve altura em decímetros: 7 -> "0,7 m" */
export function formatHeight(decimeters) {
  if (decimeters === null || decimeters === undefined) return '—';
  return `${(decimeters / 10).toFixed(1).replace('.', ',')} m`;
}

/** A API devolve peso em hectogramas: 69 -> "6,9 kg" */
export function formatWeight(hectograms) {
  if (hectograms === null || hectograms === undefined) return '—';
  return `${(hectograms / 10).toFixed(1).replace('.', ',')} kg`;
}

/**
 * Campos que a API pode devolver como null (power e accuracy de golpes de status)
 * são exibidos como travessão, e não omitidos, para não parecer erro de carregamento.
 */
export function formatNullable(value, suffix = '') {
  if (value === null || value === undefined) return '—';
  return `${value}${suffix}`;
}

/** "firered-leafgreen" -> "FireRed / LeafGreen" */
export function formatVersionName(rawName) {
  if (!rawName) return '';
  const specialCases = {
    firered: 'FireRed',
    leafgreen: 'LeafGreen',
    heartgold: 'HeartGold',
    soulsilver: 'SoulSilver',
    omegaruby: 'OmegaRuby',
    alphasapphire: 'AlphaSapphire',
    ultrasun: 'UltraSun',
    ultramoon: 'UltraMoon',
    lets: "Let's",
  };
  return rawName
    .split('-')
    .map((part) => specialCases[part] || part.charAt(0).toUpperCase() + part.slice(1))
    .join(' / ');
}

/** Remove quebras de linha estranhas que a PokéAPI traz nos textos dos jogos. */
export function cleanFlavorText(text) {
  if (!text) return '';
  return text.replace(/[\n\f\r\u000c]/g, ' ').replace(/\s+/g, ' ').trim();
}
