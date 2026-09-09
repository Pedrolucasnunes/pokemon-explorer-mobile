/**
 * Cliente HTTP da PokéAPI.
 *
 * Concentra três responsabilidades que não deveriam ficar espalhadas pelas telas:
 *  1. montar a URL base;
 *  2. transformar qualquer falha (rede, timeout, status HTTP) em um ApiError com código;
 *  3. guardar em cache a *promessa* de cada requisição, e não só o resultado.
 *
 * O cache de promessas é o que permite a Tela 1 (splash) disparar a primeira
 * requisição e a Tela 2 encontrar o dado já pronto, sem repetir a chamada.
 */

export const BASE_URL = 'https://pokeapi.co/api/v2';

const REQUEST_TIMEOUT_MS = 15000;

export class ApiError extends Error {
  constructor(message, status = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const responseCache = new Map();

async function performRequest(path) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, { signal: controller.signal });
  } catch (error) {
    // Sem internet, DNS falhando ou timeout: não existe status HTTP para reportar.
    throw new ApiError('Não foi possível conectar ao servidor.', null);
  } finally {
    clearTimeout(timeoutId);
  }

  if (response.status === 404) {
    throw new ApiError('Recurso não encontrado na PokéAPI.', 404);
  }

  if (!response.ok) {
    throw new ApiError('A PokéAPI respondeu com um erro.', response.status);
  }

  try {
    return await response.json();
  } catch (error) {
    throw new ApiError('A resposta da PokéAPI veio em formato inválido.', response.status);
  }
}

/**
 * Executa um GET no caminho informado.
 * Requisições bem-sucedidas ficam em cache; as que falham são removidas para que
 * o botão "Tentar novamente" consiga de fato refazer a chamada.
 */
export function getJson(path) {
  if (responseCache.has(path)) {
    return responseCache.get(path);
  }

  const promise = performRequest(path).catch((error) => {
    responseCache.delete(path);
    throw error;
  });

  responseCache.set(path, promise);
  return promise;
}

export function clearCache() {
  responseCache.clear();
}
