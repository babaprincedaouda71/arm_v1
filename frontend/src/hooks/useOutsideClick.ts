import { useEffect, RefObject } from 'react';

export const useOutsideClick = <T extends HTMLElement>(
    refs: RefObject<T>[],
    handler: () => void
) => {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const clickedOutside = refs.every(ref =>
                ref.current && !ref.current.contains(event.target as Node)
            );

            if (clickedOutside) {
                handler();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [refs, handler]);
};