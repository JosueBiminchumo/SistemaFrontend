import { useCallback, useEffect, useState } from 'react';

// Carga datos al montar y expone { data, loading, error, reload, setData }.
export default function useAsync(loader) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const run = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setData(await loader());
    } catch (err) {
      setError(err?.message || 'No se pudo cargar la información.');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    run();
  }, [run]);

  return { data, loading, error, reload: run, setData };
}
