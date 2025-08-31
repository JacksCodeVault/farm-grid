import React, { useState, useCallback } from 'react';

export function useApi(apiFunc, { auto = false, args = [] } = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const request = useCallback(async (...callArgs) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFunc(...callArgs);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  // Auto-fetch on mount if enabled
  React.useEffect(() => {
    if (auto) {
      request(...args);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, ...args]);

  return { data, loading, error, request, reset };
}
