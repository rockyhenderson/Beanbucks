// Import necessary hooks from React
import { useEffect, useState } from "react";

// Custom hook to fetch data with retry functionality
export default function useFetchWithRetry(url) {
    // State to store fetched data
    const [data, setData] = useState(null);
    // State to track if an error occurred
    const [error, setError] = useState(false);
    // State to trigger retries by incrementing a key
    const [retryKey, setRetryKey] = useState(0);

    // Function to trigger a retry by updating the retryKey
    const retry = () => setRetryKey(prev => prev + 1);

    // Effect to handle the fetch logic
    useEffect(() => {
        // Flag to track if the component is still mounted
        let isMounted = true;

        // Perform the fetch request
        fetch(url)
            .then((res) => {
                // Check if the response is not OK, throw an error
                if (!res.ok) throw new Error("Fetch failed");
                // Parse the response as JSON
                return res.json();
            })
            .then((data) => {
                // If the component is still mounted, update the data and reset error state
                if (isMounted) {
                    setData(data);
                    setError(false);
                }
            })
            .catch((err) => {
                // Log the error to the console
                console.error(`Fetch error from ${url}:`, err);
                // If the component is still mounted, set the error state to true
                if (isMounted) setError(true);
            });

        // Cleanup function to set isMounted to false when the component unmounts
        return () => {
            isMounted = false;
        };
    }, [url, retryKey]); // Dependencies: re-run the effect when url or retryKey changes

    // Return the fetched data, error state, and retry function
    return { data, error, retry };
}
