/**
 * @file useToast.ts
 * @description Hook personnalisé pour la gestion des notifications toast
 */

import { useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastState {
    message: string;
    type: ToastType;
    isVisible: boolean;
}

/**
 * Hook pour gérer les notifications toast dans l'application
 * @returns {Object} Méthodes et états pour gérer les toasts
 */
export const useToast = () => {
    const [toast, setToast] = useState<ToastState>({
        message: '',
        type: 'info',
        isVisible: false,
    });

    /**
     * Affiche un message toast
     * @param message - Le message à afficher
     * @param type - Le type de toast (success, error, info, warning)
     */
    const showToast = useCallback((message: string, type: ToastType) => {
        setToast({ message, type, isVisible: true });
        setTimeout(() => {
            setToast(prev => ({ ...prev, isVisible: false }));
        }, 3000);
    }, []);

    return { showToast, toast };
};