// src/hooks/plans/usePlanValidation.ts
import { useState, useCallback, useEffect } from 'react';
import { PLANS_URLS } from '@/config/urls';
import { PlansProps } from '@/types/dataTypes';

interface ValidationStatus {
    canBeValidated: boolean | null;
    isLoading: boolean;
    error: string | null;
}

interface UsePlanValidationReturn extends ValidationStatus {
    checkValidationStatus: () => Promise<void>;
    updateOFPPTValidation: (isValidated: boolean) => Promise<boolean>;
    getValidationReport: () => Promise<any>;
}

export const usePlanValidation = (plan: PlansProps): UsePlanValidationReturn => {
    const [validationStatus, setValidationStatus] = useState<ValidationStatus>({
        canBeValidated: null,
        isLoading: false,
        error: null
    });

    const checkValidationStatus = useCallback(async () => {
        if (!plan.isCSFPlan) {
            setValidationStatus(prev => ({ ...prev, canBeValidated: false }));
            return;
        }

        setValidationStatus(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const response = await fetch(`${PLANS_URLS.canBeValidated}/${plan.id}`, {
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la vérification');
            }

            const data = await response.json();
            setValidationStatus(prev => ({
                ...prev,
                canBeValidated: data.canBeValidated,
                isLoading: false
            }));
        } catch (error) {
            setValidationStatus(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Erreur inconnue',
                isLoading: false
            }));
        }
    }, [plan.id, plan.isCSFPlan]);

    const updateOFPPTValidation = useCallback(async (isValidated: boolean): Promise<boolean> => {
        setValidationStatus(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const response = await fetch(`${PLANS_URLS.updateOFPPTValidation}/${plan.id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isValidated }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.error || 'Erreur lors de la mise à jour');
            }

            setValidationStatus(prev => ({
                ...prev,
                canBeValidated: isValidated,
                isLoading: false
            }));

            return true;
        } catch (error) {
            setValidationStatus(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Erreur inconnue',
                isLoading: false
            }));
            return false;
        }
    }, [plan.id]);

    const getValidationReport = useCallback(async () => {
        try {
            const response = await fetch(`${PLANS_URLS.validationReport}/${plan.id}`, {
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération du rapport');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }, [plan.id]);

    // Vérifier automatiquement le statut au montage du composant
    useEffect(() => {
        if (plan.isCSFPlan) {
            checkValidationStatus();
        }
    }, [plan.isCSFPlan, checkValidationStatus]);

    return {
        ...validationStatus,
        checkValidationStatus,
        updateOFPPTValidation,
        getValidationReport
    };
};