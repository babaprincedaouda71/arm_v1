import {useCallback, useEffect, useReducer} from 'react';
import {NavState} from '@/types/dataTypes';

type NavAction =
    | { type: 'TOGGLE_COLLAPSE' }
    | { type: 'SET_COLLAPSE'; payload: boolean }
    | { type: 'TOGGLE_SUBMENU'; payload: string };

const navReducer = (state: NavState, action: NavAction): NavState => {
    switch (action.type) {
        case 'TOGGLE_COLLAPSE':
            return {
                ...state,
                isCollapsed: !state.isCollapsed,
                // Fermer le sous-menu lors du collapse
                openSubmenu: !state.isCollapsed ? null : state.openSubmenu
            };
        case 'SET_COLLAPSE':
            return {
                ...state,
                isCollapsed: action.payload,
                // Fermer le sous-menu lors du collapse forcé
                openSubmenu: action.payload ? null : state.openSubmenu
            };
        case 'TOGGLE_SUBMENU':
            return {
                ...state,
                openSubmenu: state.openSubmenu === action.payload ? null : action.payload,
            };
        default:
            return state;
    }
};

export const useNavigation = (isLargeScreen: boolean) => {
    const [state, dispatch] = useReducer(navReducer, {
        isCollapsed: !isLargeScreen,
        openSubmenu: null,
    });

    // Mettre à jour l'état du collapse lors du changement de taille d'écran
    useEffect(() => {
        dispatch({type: 'SET_COLLAPSE', payload: !isLargeScreen});
    }, [isLargeScreen]);

    const toggleCollapse = useCallback(() => {
        dispatch({type: 'TOGGLE_COLLAPSE'});
    }, []);

    const toggleSubmenu = useCallback((path: string) => {
        dispatch({type: 'TOGGLE_SUBMENU', payload: path});
    }, []);

    return {state, toggleCollapse, toggleSubmenu};
};