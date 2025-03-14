import { useEffect, useState } from 'react';

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler); // Cleanup timeout if value or delay changes
        };
    }, [value, delay]);

    return debouncedValue;
}

export default useDebounce;
