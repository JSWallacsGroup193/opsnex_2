import { useCallback, useState } from 'react';

export function useRetry<T>(fn: () => Promise<T>, retries = 2, delay = 300) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const run = useCallback(async () => {
    setLoading(true); 
    setError(null);
    let attempt = 0;
    
    while (attempt <= retries) {
      try { 
        const res = await fn(); 
        setLoading(false); 
        return res; 
      } catch (e: any) { 
        attempt++; 
        if (attempt > retries) { 
          setLoading(false); 
          setError(e); 
          throw e; 
        } 
        await new Promise(r => setTimeout(r, delay)); 
      }
    }
  }, [fn, retries, delay]);
  
  return { run, loading, error };
}
