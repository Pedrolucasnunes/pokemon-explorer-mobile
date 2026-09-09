import { useEffect, useState } from 'react';

/**
 * Devolve o valor recebido apenas depois que ele para de mudar por `delay` ms.
 *
 * É o que sustenta o debounce de 400 ms da busca por nome descrito na fase 1:
 * o usuário digita "charizard" e o filtro roda uma vez, não nove.
 */
export function useDebouncedValue(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timeoutId);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebouncedValue;
