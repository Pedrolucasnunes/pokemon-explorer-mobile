import { useCallback, useEffect, useRef, useState } from 'react';

import {
  PAGE_SIZE,
  fetchAllPokemonNames,
  fetchPokemonNamesByType,
  fetchPokemonPage,
  fetchTypeList,
  hydratePokemonNames,
} from '../api/pokeApi';
import { useDebouncedValue } from './useDebouncedValue';

/**
 * Toda a lógica de dados da Tela 2 (e dos seus estados 3, 4 e 7).
 *
 * Separar isso da tela deixa o componente responsável apenas pela apresentação
 * e concentra num único lugar as regras de paginação e filtragem.
 *
 * O hook opera em dois modos:
 *
 *  - modo paginado (sem busca e sem tipo): consome /pokemon?limit=20&offset={n}
 *    e o botão "Carregar mais" incrementa o offset em 20;
 *
 *  - modo filtrado (com busca e/ou tipo): monta o conjunto de nomes candidatos
 *    (todos, ou só os do tipo escolhido), aplica o filtro de nome sobre ele e
 *    hidrata 20 itens por vez. É assim que os dois filtros se combinam: a busca
 *    por nome atua sobre o conjunto já restrito pelo tipo.
 */
export function usePokemonList() {
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState(null);
  const debouncedQuery = useDebouncedValue(query.trim().toLowerCase(), 400);

  const [types, setTypes] = useState([]);
  const [totalCount, setTotalCount] = useState(null);

  const [items, setItems] = useState([]);
  const [matchCount, setMatchCount] = useState(0);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [error, setError] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [canLoadMore, setCanLoadMore] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  // Refs guardam a posição da paginação sem provocar re-render a cada avanço.
  const offsetRef = useRef(0);
  const filteredNamesRef = useRef([]);
  const shownCountRef = useRef(0);
  const requestIdRef = useRef(0);

  const isFilterMode = debouncedQuery.length > 0 || selectedType !== null;

  // Régua de tipos: carregada uma vez e independente do restante.
  // Se falhar, a listagem continua funcionando sem o filtro por tipo.
  useEffect(() => {
    let active = true;
    fetchTypeList()
      .then((result) => {
        if (active) setTypes(result);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    // Cada carga recebe um id; respostas de filtros antigos são descartadas.
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    const isStale = () => requestId !== requestIdRef.current;

    async function load() {
      setStatus('loading');
      setError(null);
      setItems([]);
      setCanLoadMore(false);

      try {
        if (!isFilterMode) {
          const page = await fetchPokemonPage(0);
          if (isStale()) return;

          offsetRef.current = PAGE_SIZE;
          setTotalCount(page.count);
          setMatchCount(page.count);
          setItems(page.items);
          setCanLoadMore(page.hasNext);
        } else {
          const candidateNames = selectedType
            ? await fetchPokemonNamesByType(selectedType)
            : (await fetchAllPokemonNames()).names;
          if (isStale()) return;

          const matches = debouncedQuery
            ? candidateNames.filter((name) => name.includes(debouncedQuery))
            : candidateNames;

          filteredNamesRef.current = matches;
          setMatchCount(matches.length);

          const firstSlice = matches.slice(0, PAGE_SIZE);
          const hydrated = await hydratePokemonNames(firstSlice);
          if (isStale()) return;

          shownCountRef.current = firstSlice.length;
          setItems(hydrated);
          setCanLoadMore(matches.length > firstSlice.length);
        }

        setStatus('ready');
      } catch (loadError) {
        if (isStale()) return;
        setError(loadError);
        setStatus('error');
      }
    }

    load();
  }, [debouncedQuery, selectedType, isFilterMode, reloadToken]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !canLoadMore || status !== 'ready') return;

    setLoadingMore(true);
    try {
      if (!isFilterMode) {
        const page = await fetchPokemonPage(offsetRef.current);
        offsetRef.current += PAGE_SIZE;
        setItems((previous) => [...previous, ...page.items]);
        setCanLoadMore(page.hasNext);
      } else {
        const nextSlice = filteredNamesRef.current.slice(
          shownCountRef.current,
          shownCountRef.current + PAGE_SIZE
        );
        const hydrated = await hydratePokemonNames(nextSlice);
        shownCountRef.current += nextSlice.length;
        setItems((previous) => [...previous, ...hydrated]);
        setCanLoadMore(shownCountRef.current < filteredNamesRef.current.length);
      }
    } catch (loadMoreError) {
      // Falha ao paginar não derruba o que já está em tela: apenas para de avançar.
      setCanLoadMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [canLoadMore, isFilterMode, loadingMore, status]);

  const retry = useCallback(() => setReloadToken((token) => token + 1), []);

  const clearQuery = useCallback(() => setQuery(''), []);

  const clearFilters = useCallback(() => {
    setQuery('');
    setSelectedType(null);
  }, []);

  const toggleType = useCallback((typeKey) => {
    setSelectedType((current) => (current === typeKey ? null : typeKey));
  }, []);

  return {
    // dados
    items,
    types,
    totalCount,
    matchCount,
    // estado
    status,
    error,
    isEmpty: status === 'ready' && items.length === 0,
    isFilterMode,
    // filtros
    query,
    setQuery,
    appliedQuery: debouncedQuery,
    selectedType,
    toggleType,
    clearQuery,
    clearFilters,
    // paginação
    loadingMore,
    canLoadMore,
    loadMore,
    retry,
  };
}

export default usePokemonList;
