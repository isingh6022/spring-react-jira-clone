import { useCallback, useEffect, useState } from "react";

// Loads data whenever `load` changes (memoise it with useCallback).
export function useFetch<T>(
  load: (signal: AbortSignal) => Promise<T>,
  initial: T,
) {
  const [state, setState] = useState<{
    data: T;
    error: string | null;
    // The load function whose result is in state; loading until it matches the current one.
    loadedBy: unknown;
  }>({ data: initial, error: null, loadedBy: null });

  useEffect(() => {
    const controller = new AbortController();

    load(controller.signal)
      .then((data) => setState({ data, error: null, loadedBy: load }))
      .catch((e: Error) => {
        if (!controller.signal.aborted) {
          setState((s) => ({ ...s, error: e.message, loadedBy: load }));
        }
      });

    return () => controller.abort();
  }, [load]);

  const setData = useCallback(
    (data: T) => setState((s) => ({ ...s, data })),
    [],
  );
  const loading = state.loadedBy !== load;

  return { data: state.data, setData, error: loading ? null : state.error, loading };
}
