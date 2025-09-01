import {useEffect, useState} from 'react';

export const useScreenSize = () => {
    const [isLargeScreen, setIsLargeScreen] = useState(true); // Default to true to prevent hydration mismatch

    useEffect(() => {
        const checkScreenSize = () => {
            setIsLargeScreen(window.innerWidth >= 1200);
        };

        // Initial check
        checkScreenSize();

        // Add event listener
        window.addEventListener('resize', checkScreenSize);

        // Cleanup
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    return isLargeScreen;
};