import {useState} from 'react';

export const useToggle = (initialState = false) => {
    const [state, setState] = useState(initialState);

    const toggle = () => setState(prev => !prev);
    const setTrue = () => setState(true);
    const setFalse = () => setState(false);

    return [state, toggle, setTrue, setFalse] as const;
};