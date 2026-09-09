/**
 * Serviço da PokéAPI: um método por operação prevista na coleção do Postman.
 *
 * Endpoints usados (todos GET, base https://pokeapi.co/api/v2):
 *   /pokemon?limit=20&offset={n}   paginação da listagem            (Tela 2)
 *   /pokemon/{nome}                detalhe, imagem, tipos, moves    (Telas 2 e 5)
 *   /pokemon?limit=100000          índice completo de nomes         (Tela 3, busca)
 *   /type?limit=50                 régua de filtros                 (Tela 4)
 *   /type/{nome}                   Pokémon e movimentos de um tipo  (Tela 4 e chips)
 *   /pokemon-species/{nome}        categoria da espécie             (Tela 5)
 *   /move/{nome}                   detalhe do movimento             (Tela 6)
 */
import { getJson } from './client';
import { adaptMoveDetail, adaptPokemonDetail, adaptPokemonSummary } from './adapters';
import { TYPE_FILTER_ORDER, getTypeLabel } from '../theme/pokemonTypes';

export const PAGE_SIZE = 20;

/** GET /pokemon/{nome} reduzido ao que o card da listagem precisa. */
export async function fetchPokemonSummary(nameOrId) {
  const raw = await getJson(`/pokemon/${nameOrId}`);
  return adaptPokemonSummary(raw);
}

/**
 * Uma página da listagem.
 * A resposta paginada traz só nome e URL, então buscamos o detalhe de cada item
 * em paralelo para conseguir imagem e tipo — exatamente como descrito na fase 1.
 */
export async function fetchPokemonPage(offset = 0) {
  const page = await getJson(`/pokemon?limit=${PAGE_SIZE}&offset=${offset}`);
  const items = await hydratePokemonNames(page.results.map((result) => result.name));

  return {
    count: page.count,
    hasNext: Boolean(page.next),
    items,
  };
}

/**
 * Busca os detalhes de uma lista de nomes em paralelo.
 * Usa allSettled porque alguns nomes retornados por /type são formas especiais
 * que respondem 404 em /pokemon/{nome}; elas são simplesmente descartadas.
 */
export async function hydratePokemonNames(names) {
  const results = await Promise.allSettled(names.map((name) => fetchPokemonSummary(name)));
  return results
    .filter((result) => result.status === 'fulfilled')
    .map((result) => result.value);
}

/**
 * Índice completo de nomes, usado pela busca parcial da Tela 3.
 * Baixado uma única vez e mantido em cache: filtrar localmente evita uma
 * requisição a cada tecla digitada.
 */
export async function fetchAllPokemonNames() {
  const raw = await getJson('/pokemon?limit=100000&offset=0');
  return {
    count: raw.count,
    names: raw.results.map((result) => result.name),
  };
}

/** GET /type?limit=50, restrito e ordenado conforme a régua definida no protótipo. */
export async function fetchTypeList() {
  const raw = await getJson('/type?limit=50');
  const available = new Set(raw.results.map((result) => result.name));

  return TYPE_FILTER_ORDER.filter((name) => available.has(name)).map((name) => ({
    key: name,
    label: getTypeLabel(name),
  }));
}

/** GET /type/{nome} — nomes dos Pokémon daquele tipo. */
export async function fetchPokemonNamesByType(typeName) {
  const raw = await getJson(`/type/${typeName}`);
  return raw.pokemon.map((entry) => entry.pokemon.name);
}

/** GET /pokemon/{nome} + /pokemon-species/{nome} para a Tela 5. */
export async function fetchPokemonDetail(nameOrId) {
  const raw = await getJson(`/pokemon/${nameOrId}`);

  let species = null;
  try {
    species = await getJson(`/pokemon-species/${raw.species.name}`);
  } catch (error) {
    // A categoria da espécie é informação complementar: sem ela a tela continua útil.
    species = null;
  }

  return adaptPokemonDetail(raw, species);
}

/** GET /move/{nome} para a Tela 6. */
export async function fetchMoveDetail(nameOrId) {
  const raw = await getJson(`/move/${nameOrId}`);
  return adaptMoveDetail(raw);
}

/**
 * Índice movimento -> tipo.
 *
 * A resposta de /pokemon/{nome} lista os movimentos mas não informa o tipo de
 * cada um. Buscar /move/{nome} para os 80+ movimentos de um Pokémon geraria
 * dezenas de requisições por tela. Em vez disso, montamos o índice uma única vez
 * a partir de /type/{nome}, que já devolve todos os movimentos daquele tipo —
 * 18 requisições no total, reaproveitando o cache da régua de filtros.
 */
let moveTypeIndexPromise = null;

async function buildMoveTypeIndex() {
  const types = await fetchTypeList();
  const responses = await Promise.all(types.map((type) => getJson(`/type/${type.key}`)));

  const index = {};
  responses.forEach((response, position) => {
    const typeName = types[position].key;
    response.moves.forEach((move) => {
      index[move.name] = typeName;
    });
  });

  return index;
}

export function getMoveTypeIndex() {
  if (!moveTypeIndexPromise) {
    moveTypeIndexPromise = buildMoveTypeIndex().catch((error) => {
      moveTypeIndexPromise = null; // libera o índice para uma nova tentativa
      throw error;
    });
  }
  return moveTypeIndexPromise;
}

/**
 * Disparado pela Tela 1 (splash) enquanto a marca está em tela.
 * Quando o usuário chega à listagem, o cache já responde de imediato.
 */
export function preloadFirstPage() {
  return fetchPokemonPage(0);
}
