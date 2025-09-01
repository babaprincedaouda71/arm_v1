import {useCallback, useEffect, useState} from 'react';
import {NavigationState} from '@/types/dataTypes';

const STORAGE_KEY = 'navigationState';
const DEFAULT_TAB = 'planning'; // Valeur par défaut explicite

interface UseNavigationStateOptions {
    availableTabs?: string[]; // Liste des onglets disponibles pour cette page
}

export const useNavigationState = (initialTab?: string, options?: UseNavigationStateOptions) => {
    const {availableTabs} = options || {};
    // Fonction pour valider si un onglet est disponible
    const isTabAvailable = (tabId: string): boolean => {
        return !availableTabs || availableTabs.includes(tabId);
    };

    // Fonction pour obtenir le premier onglet disponible ou la valeur par défaut
    const getValidTab = (preferredTab: string): string => {
        if (isTabAvailable(preferredTab)) {
            return preferredTab;
        }

        // Si l'onglet préféré n'est pas disponible, essayer la valeur par défaut
        if (isTabAvailable(DEFAULT_TAB)) {
            return DEFAULT_TAB;
        }

        // En dernier recours, prendre le premier onglet disponible
        return availableTabs?.[0] || DEFAULT_TAB;
    };

    // Initialiser l'état avec les valeurs du localStorage ou les valeurs par défaut
    const [state, setState] = useState<NavigationState>(() => {
        if (typeof window !== 'undefined') {
            const savedState = localStorage.getItem(STORAGE_KEY);
            const parsedState = savedState ? JSON.parse(savedState) : null;

            // Si on a un état sauvegardé, valider l'onglet
            if (parsedState && parsedState.activeTab) {
                return {
                    activeTab: getValidTab(parsedState.activeTab),
                    activeSubItem: parsedState.activeSubItem
                };
            }

            // Si on a un onglet initial depuis l'URL, l'utiliser en priorité (s'il est disponible)
            if (initialTab) {
                return {
                    activeTab: getValidTab(initialTab),
                    activeSubItem: null
                };
            }

            // Sinon utiliser la valeur par défaut validée
            return {
                activeTab: getValidTab(DEFAULT_TAB),
                activeSubItem: null
            };
        }

        // Côté serveur, utiliser initialTab ou la valeur par défaut validée
        return {
            activeTab: getValidTab(initialTab || DEFAULT_TAB),
            activeSubItem: null
        };
    });

    // Sauvegarder l'état dans le localStorage à chaque changement
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        }
    }, [state]);

    const setActiveTab = useCallback((tabId: string) => {
        // Valider que l'onglet est disponible avant de l'activer
        const validTabId = getValidTab(tabId);
        setState(prev => ({
            ...prev,
            activeTab: validTabId,
            activeSubItem: null
        }));
    }, [availableTabs]);

    const setActiveSubItem = useCallback((mainTabId: string, subItemId: string) => {
        setState({
            activeTab: mainTabId,
            activeSubItem: subItemId
        });
    }, []);

    return {state, setActiveTab, setActiveSubItem};
};