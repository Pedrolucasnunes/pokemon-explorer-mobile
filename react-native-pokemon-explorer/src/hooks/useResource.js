import { useCallback, useEffect, useState } from 'react';

import { fetchMoveDetail, fetchPokemonDetail, getMoveTypeIndex } from '../api/pokeApi';

/**
 * Hook genérico para telas que carregam um único recurso.
 * Devolve sempre o mesmo contrato — dados, status, erro e uma função de retry —
 * para que as Telas 5 e 6 tratem carregamento e falha exatamente da mesma forma.
 */
function useResource(loader, dependencies) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [error, setError] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let active = true;

    setStatus('loading');
    setError(null);

    loader()
      .then((result) => {
        if (!active) return;
        setData(result);
        setStatus('ready');
      })
      .catch((loadError) => {
        if (!active) return;
        setError(loadError);
        setStatus('error');
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies, reloadToken]);

  const retry = useCallback(() => setReloadToken((token) => token + 1), []);

  return { data, status, error, retry };
}

/** Tela 5: detalhe do Pokémon e sua lista de movimentos. */
export function usePokemonDetail(nameOrId) {
  const resource = useResource(() => fetchPokemonDetail(nameOrId), [nameOrId]);

  // O índice de tipos dos movimentos chega depois e apenas enriquece os chips.
  // A tela é exibida antes dele, sem esperar.
  const [moveTypes, setMoveTypes] = useState({});

  useEffect(() => {
    let active = true;
    getMoveTypeIndex()
      .then((index) => {
        if (active) setMoveTypes(index);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return {
    pokemon: resource.data,
    moveTypes,
    status: resource.status,
    error: resource.error,
    retry: resource.retry,
  };
}

/** Tela 6: detalhe de um movimento. */
export function useMoveDetail(moveName) {
  const resource = useResource(() => fetchMoveDetail(moveName), [moveName]);

  return {
    move: resource.data,
    status: resource.status,
    error: resource.error,
    retry: resource.retry,
  };
}

export default useResource;
