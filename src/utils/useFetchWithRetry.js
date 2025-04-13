import { useEffect, useState } from "react";

// Custom hook to fetch data with retry functionality
export default function useFetchWithRetry(url) {
  const [data, setData] = useState(null); // fetched data
  const [error, setError] = useState(false); // error state
  const [retryKey, setRetryKey] = useState(0); // retry trigger

  const retry = () => setRetryKey(prev => prev + 1); // bump to refetch
  const [isLoading, setIsLoading] = useState(true); // NEW

  useEffect(() => {
    console.log(`[useFetchWithRetry] Fetching: ${url} (retryKey: ${retryKey})`);
    let isMounted = true;
  
    setIsLoading(true); // START loading
  
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Fetch failed");
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setData(data);
          setError(false);
          setIsLoading(false); // ✅ FINISHED
        }
      })
      .catch((err) => {
        console.error(`Fetch error from ${url}:`, err);
        if (isMounted) {
          setError(true);
          setIsLoading(false); // ✅ STOP even on fail
        }
      });
  
    return () => {
      isMounted = false;
    };
  }, [url, retryKey]);
  
  return { data, error, retry, isLoading };
} //   