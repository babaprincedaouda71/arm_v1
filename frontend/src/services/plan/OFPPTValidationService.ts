// src/services/ofpptValidationService.ts

import {PLANS_URLS} from "@/config/urls";

export interface ValidationError {
    type: string;
    description: string;
}

export interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
    message?: string;
    errorSummary?: string;
}

export interface OFPPTValidationStatus {
    currentStatus: boolean;
    canEnable: boolean;
    statistics: {
        totalCsfTrainings: number;
        completeTrainings: number;
        totalGroups: number;
        completeGroups: number;
    };
    errors: ValidationError[];
}

export class OFPPTValidationService {
    /**
     * Vérifie si la validation OFPPT peut être activée
     */
    static async checkValidation(planId: string): Promise<ValidationResult> {
        try {
            const response = await fetch(`${PLANS_URLS.ofpptValidation.check(planId)}`, {
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur lors de la vérification OFPPT:', error);
            throw error;
        }
    }

    /**
     * Active ou désactive la validation OFPPT
     */
    static async toggleValidation(planId: string, enable: boolean): Promise<ValidationResult> {
        try {
            const response = await fetch(`${PLANS_URLS.ofpptValidation.toggle(planId)}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({enable}),
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur lors de la modification OFPPT:', error);
            throw error;
        }
    }

    /**
     * Obtient le statut détaillé de validation OFPPT
     */
    static async getDetailedStatus(planId: string): Promise<OFPPTValidationStatus> {
        try {
            const response = await fetch(`${PLANS_URLS.ofpptValidation.status(planId)}`, {
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur lors de la récupération du statut OFPPT:', error);
            throw error;
        }
    }
}