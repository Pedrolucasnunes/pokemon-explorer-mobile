/**
 * Adaptadores: convertem o JSON bruto da PokéAPI nos modelos que a interface consome.
 *
 * Manter essa tradução isolada significa que nenhum componente precisa conhecer
 * caminhos como `sprites.other['official-artwork'].front_default` ou
 * `version_group_details[].move_learn_method.name`.
 */
import { cleanFlavorText, formatName } from '../utils/format';

/** Ordem de preferência ao escolher como um movimento é "principalmente" aprendido. */
export const LEARN_METHOD_PRIORITY = ['level-up', 'machine', 'egg', 'tutor'];

export const LEARN_METHOD_LABELS = {
  'level-up': 'Nível',
  machine: 'MT/HM',
  egg: 'Ovo',
  tutor: 'Tutor',
};

const AILMENT_LABELS = {
  paralysis: 'Paralisia',
  burn: 'Queimadura',
  freeze: 'Congelamento',
  poison: 'Envenenamento',
  sleep: 'Sono',
  confusion: 'Confusão',
  infatuation: 'Atração',
  trap: 'Armadilha',
  leech: 'Sugador',
};

const DAMAGE_CLASS_LABELS = {
  physical: 'Físico',
  special: 'Especial',
  status: 'Status',
};

export function getDamageClassLabel(name) {
  return DAMAGE_CLASS_LABELS[name] || formatName(name);
}

function pickSprite(raw) {
  // A fase 1 definiu sprites.front_default como imagem oficial da listagem.
  // O fallback existe porque alguns Pokémon recentes ainda não têm esse sprite.
  return (
    raw?.sprites?.front_default ||
    raw?.sprites?.other?.['official-artwork']?.front_default ||
    raw?.sprites?.other?.home?.front_default ||
    null
  );
}

export function adaptPokemonSummary(raw) {
  return {
    id: raw.id,
    name: raw.name,
    displayName: formatName(raw.name),
    imageUrl: pickSprite(raw),
    types: raw.types.map((entry) => entry.type.name),
  };
}

/**
 * Reduz as várias entradas de `version_group_details` a uma lista curta de
 * pares {método, nível}, elege o método principal e guarda todos os métodos
 * para que os chips de filtro da Tela 5 funcionem corretamente.
 */
function adaptMoveEntry(entry) {
  const learnOptions = [];

  entry.version_group_details.forEach((detail) => {
    const method = detail.move_learn_method.name;
    const level = detail.level_learned_at;
    const alreadyListed = learnOptions.some(
      (option) => option.method === method && option.level === level
    );
    if (!alreadyListed) {
      learnOptions.push({ method, level });
    }
  });

  let primary = null;
  for (const method of LEARN_METHOD_PRIORITY) {
    const candidates = learnOptions
      .filter((option) => option.method === method)
      .sort((a, b) => a.level - b.level);
    if (candidates.length > 0) {
      primary = candidates[0];
      break;
    }
  }
  if (!primary) {
    primary = learnOptions[0] || { method: 'unknown', level: 0 };
  }

  return {
    name: entry.move.name,
    displayName: formatName(entry.move.name),
    url: entry.move.url,
    method: primary.method,
    level: primary.level,
    methods: Array.from(new Set(learnOptions.map((option) => option.method))),
  };
}

function compareMoves(a, b) {
  const priorityA = LEARN_METHOD_PRIORITY.indexOf(a.method);
  const priorityB = LEARN_METHOD_PRIORITY.indexOf(b.method);
  const safeA = priorityA === -1 ? LEARN_METHOD_PRIORITY.length : priorityA;
  const safeB = priorityB === -1 ? LEARN_METHOD_PRIORITY.length : priorityB;

  if (safeA !== safeB) return safeA - safeB;
  if (a.level !== b.level) return a.level - b.level;
  return a.displayName.localeCompare(b.displayName);
}

export function adaptPokemonDetail(raw, speciesRaw) {
  const genusEntry = speciesRaw?.genera?.find((entry) => entry.language.name === 'en');

  return {
    id: raw.id,
    name: raw.name,
    displayName: formatName(raw.name),
    imageUrl: pickSprite(raw),
    types: raw.types.map((entry) => entry.type.name),
    height: raw.height,
    weight: raw.weight,
    baseExperience: raw.base_experience,
    genus: genusEntry ? genusEntry.genus : null,
    moves: raw.moves.map(adaptMoveEntry).sort(compareMoves),
  };
}

/**
 * O texto narrativo dos jogos só existe em alguns idiomas — português não é um deles.
 * Preferimos a versão FireRed/LeafGreen (usada no protótipo) e caímos para a
 * entrada em inglês mais recente quando ela não existe para aquele movimento.
 */
function pickFlavorText(entries) {
  if (!Array.isArray(entries)) return null;

  const englishEntries = entries.filter((entry) => entry.language.name === 'en');
  if (englishEntries.length === 0) return null;

  const preferred =
    englishEntries.find((entry) => entry.version_group?.name === 'firered-leafgreen') ||
    englishEntries[englishEntries.length - 1];

  return {
    text: cleanFlavorText(preferred.flavor_text),
    versionGroup: preferred.version_group?.name || null,
  };
}

export function adaptMoveDetail(raw) {
  const effectEntry = raw.effect_entries?.find((entry) => entry.language.name === 'en');
  const shortEffect = effectEntry
    ? cleanFlavorText(effectEntry.short_effect).replace(
        '$effect_chance',
        String(raw.effect_chance ?? '')
      )
    : null;

  const ailment = raw.meta?.ailment?.name;

  return {
    id: raw.id,
    name: raw.name,
    displayName: formatName(raw.name),
    type: raw.type?.name || null,
    damageClass: raw.damage_class?.name || null,
    power: raw.power,
    accuracy: raw.accuracy,
    pp: raw.pp,
    priority: raw.priority,
    effectChance: raw.effect_chance,
    target: raw.target?.name || null,
    generation: raw.generation?.name || null,
    ailment: ailment && ailment !== 'none' ? ailment : null,
    ailmentLabel:
      ailment && ailment !== 'none' ? AILMENT_LABELS[ailment] || formatName(ailment) : null,
    shortEffect,
    flavor: pickFlavorText(raw.flavor_text_entries),
  };
}
