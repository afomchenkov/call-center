/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface ApiOptions<T> {
  method?: Method;
  body?: any;
  headers?: HeadersInit;
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
}

export function useApi<T = any>() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);

  const request = useCallback(async (url: string, options: ApiOptions<T> = {}) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(url, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      const result = await res.json();
      if (!res.ok) throw result;

      setData(result);
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      setError(err);
      options.onError?.(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, data, error, request };
}