/**
 * @file tableConfig.ts
 * @description Configuration pour les statuts et actions du tableau
 */

import { StatusConfig } from '@/types/Table.types';

/**
 * Configuration des statuts et leurs styles visuels
 */
export const STATUS_CONFIG: Record<string, StatusConfig> = {
    Brouillon: {
        label: "Brouillon",
        color: "#475569",
        backgroundColor: "#47556926",
        showDot: true,
    },
    Fermé: {
        label: "Fermé",
        color: "#4680FE",
        backgroundColor: "#4680FE26",
        showDot: true,
    },
    Publié: {
        label: "Publié",
        color: "#08A710",
        backgroundColor: "#08A71026",
        showDot: true,
    },
    Auto: {
        label: "Auto",
        color: "#FFFFFF",
        backgroundColor: "#FFA411",
        showDot: false,
        pill: {
            show: true,
            value: -12,
        },
    },
};