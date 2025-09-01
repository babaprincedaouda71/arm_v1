// src/config/tableConfig.ts
import {GroupeConfig, PermissionConfig, StatusConfig} from "@/types/Table.types";

// ==========================================
// CONFIGURATION DES STATUTS
// ==========================================

/**
 * Couleurs et styles prédéfinis pour éviter la duplication
 */
const STATUS_STYLES = {
    SUCCESS: {
        color: "#08A710",
        backgroundColor: "#08A71026",
    },
    WARNING: {
        color: "#D9AF0A",
        backgroundColor: "#D9AF0A26",
    },
    ERROR: {
        color: "#DB2525",
        backgroundColor: "#DB252526",
    },
    INFO: {
        color: "#4680FE",
        backgroundColor: "#4680FE26",
    },
    NEUTRAL: {
        color: "#475569",
        backgroundColor: "#47556926",
    },
    SPECIAL: {
        color: "#5051C3",
        backgroundColor: "#5051C326",
    },
    AUTO: {
        color: "#FFFFFF",
        backgroundColor: "#FFA411",
    },
} as const;

/**
 * Configuration des statuts organisée par catégories
 */
export const statusConfig: Record<string, StatusConfig> = {
    // === STATUTS GÉNÉRAUX ===
    Actif: {
        label: "Actif",
        ...STATUS_STYLES.SUCCESS,
        showDot: true,
    },
    Inactif: {
        label: "Inactif",
        ...STATUS_STYLES.NEUTRAL,
        showDot: true,
    },

    // === STATUTS DE PLANIFICATION ===
    "Non_Planifié": {
        label: "Non Planifié",
        ...STATUS_STYLES.NEUTRAL,
        showDot: true,
    },
    "Planifiée": {
        label: "Planifiée",
        ...STATUS_STYLES.WARNING,
        showDot: true,
    },
    "Planifié": {
        label: "Planifié",
        ...STATUS_STYLES.WARNING,
        showDot: true,
    },

    // === STATUTS DE WORKFLOW ===
    Brouillon: {
        label: "Brouillon",
        ...STATUS_STYLES.NEUTRAL,
        showDot: true,
    },
    Validé: {
        label: "Validé",
        ...STATUS_STYLES.SUCCESS,
        showDot: true,
    },
    "En Cours": {
        label: "En Cours",
        ...STATUS_STYLES.WARNING,
        showDot: true,
    },
    "En attente": {
        label: "En attente",
        ...STATUS_STYLES.INFO,
        showDot: true,
    },

    // === STATUTS DE PUBLICATION ===
    Publiée: {
        label: "Publiée",
        ...STATUS_STYLES.SUCCESS,
        showDot: true,
    },
    Publié: {
        label: "Publié",
        ...STATUS_STYLES.SUCCESS,
        showDot: true,
    },
    "Non envoyée": {
        label: "Non Envoyée",
        ...STATUS_STYLES.NEUTRAL,
        showDot: true,
    },

    // === STATUTS DE COMPLETION ===
    Terminé: {
        label: "Terminé",
        ...STATUS_STYLES.SUCCESS,
        showDot: true,
    },
    Terminée: {
        label: "Terminée",
        ...STATUS_STYLES.SUCCESS,
        showDot: true,
    },
    Réalisée: {
        label: "Réalisée",
        ...STATUS_STYLES.SUCCESS,
        showDot: true,
    },
    Réalisé: {
        label: "Réalisé",
        ...STATUS_STYLES.INFO,
        showDot: true,
    },
    Clôturée: {
        label: "Clôturée",
        ...STATUS_STYLES.SUCCESS,
        showDot: true,
    },
    Fermé: {
        label: "Fermé",
        ...STATUS_STYLES.SPECIAL,
        showDot: true,
    },

    // === STATUTS D'APPROBATION ===
    Approuvée: {
        label: "Approuvée",
        ...STATUS_STYLES.SUCCESS,
        showDot: true,
    },
    Acceptée: {
        label: "Acceptée",
        ...STATUS_STYLES.SUCCESS,
        showDot: true,
    },
    Confirmé: {
        label: "Confirmé",
        ...STATUS_STYLES.SUCCESS,
        showDot: true,
    },
    Accordée: {
        label: "Accordée",
        ...STATUS_STYLES.SUCCESS,
        showDot: true,
    },

    // === STATUTS DE REJET/ANNULATION ===
    Rejetée: {
        label: "Rejetée",
        ...STATUS_STYLES.ERROR,
        showDot: true,
    },
    Annulée: {
        label: "Annulée",
        ...STATUS_STYLES.ERROR,
        showDot: true,
    },
    Annulé: {
        label: "Annulé",
        ...STATUS_STYLES.ERROR,
        showDot: true,
    },
    Refusée: {
        label: "Refusée",
        ...STATUS_STYLES.ERROR,
        showDot: true,
    },

    // === STATUTS FINANCIERS ===
    Réglée: {
        label: "Réglée",
        ...STATUS_STYLES.SUCCESS,
        showDot: true,
    },
    "Non Réglée": {
        label: "Non Réglée",
        ...STATUS_STYLES.WARNING,
        showDot: true,
    },
    Remboursée: {
        label: "Remboursée",
        ...STATUS_STYLES.SUCCESS,
        showDot: true,
    },

    // === STATUTS TEMPORELS ===
    Échu: {
        label: "Échu",
        ...STATUS_STYLES.NEUTRAL,
        showDot: true,
    },

    // === STATUTS DE PRÉSENCE ===
    "Présent": {
        label: "Présent",
        ...STATUS_STYLES.SUCCESS,
        showDot: true,
    },
    Absent: {
        label: "Absent",
        ...STATUS_STYLES.ERROR,
        showDot: true,
    },

    // === STATUTS SPÉCIAUX ===
    Auto: {
        label: "Auto",
        ...STATUS_STYLES.AUTO,
        showDot: true,
    },
};

// ==========================================
// CONFIGURATION DES GROUPES
// ==========================================

/**
 * Style uniforme pour tous les groupes (peut être personnalisé individuellement si nécessaire)
 */
const GROUP_DEFAULT_STYLE = {
    color: "#08A710",
    backgroundColor: "#08A71026",
    showDot: true,
};

export const groupeConfig: Record<string, GroupeConfig> = {
    Admin: {
        label: "Admin",
        ...GROUP_DEFAULT_STYLE,
    },
    Collaborateur: {
        label: "Collaborateur",
        ...GROUP_DEFAULT_STYLE,
    },
    Manager: {
        label: "Manager",
        ...GROUP_DEFAULT_STYLE,
    },
    Formateur: {
        label: "Formateur",
        ...GROUP_DEFAULT_STYLE,
    },
    Default: {
        label: "Default",
        ...GROUP_DEFAULT_STYLE,
    },
};

// ==========================================
// CONFIGURATION DES PERMISSIONS
// ==========================================

export const permissionConfig: Record<string, PermissionConfig> = {
    Admin: {
        label: "Admin",
        color: "text-white",
        backgroundColor: "bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd",
        showIcon: false,
    },
    _: {
        label: "Gérer l'accès",
        color: "text-white",
        backgroundColor: "bg-gradient-to-b from-gradientGreenStart to-gradientGreenEnd",
        showIcon: true,
    },
};

// ==========================================
// CONFIGURATION DES TABLEAUX
// ==========================================

/**
 * Configuration du tableau des utilisateurs
 */
export const USER_TABLE_CONFIG = {
    HEADERS: [
        "Sélection",
        "Nom complet",
        "Groupe",
        "Date de création",
        "Statut",
        "Actions",
    ],
    KEYS: [
        "selection",
        "fullName",
        "group",
        "creationDate",
        "status",
        "actions",
    ],
    ACTIONS_TO_SHOW: ["view", "edit", "delete"],
    RECORDS_PER_PAGE: 4,
} as const;

// ==========================================
// EXPORTS POUR COMPATIBILITÉ DESCENDANTE
// ==========================================

// Maintien des exports existants pour ne pas casser le code existant
export const TABLE_USER_HEADER = USER_TABLE_CONFIG.HEADERS;
export const TABLE_USER_KEYS = USER_TABLE_CONFIG.KEYS;
export const TABLE_USER_ACTIONS_TO_SHOW = USER_TABLE_CONFIG.ACTIONS_TO_SHOW;
export const TABLE_USER_RECORDS_PER_PAGE = USER_TABLE_CONFIG.RECORDS_PER_PAGE;

// ==========================================
// UTILITAIRES
// ==========================================

/**
 * Fonction utilitaire pour obtenir la configuration d'un statut
 * @param status - Le statut à rechercher
 * @returns La configuration du statut ou undefined
 */
export const getStatusConfig = (status: string): StatusConfig | undefined => {
    return statusConfig[status];
};

/**
 * Fonction utilitaire pour obtenir tous les statuts d'une catégorie
 * @param category - Catégorie de statuts (basée sur les commentaires)
 * @returns Liste des statuts de la catégorie
 */
export const getStatusByCategory = (category: 'success' | 'warning' | 'error' | 'info' | 'neutral'): string[] => {
    const styleMap = {
        success: STATUS_STYLES.SUCCESS,
        warning: STATUS_STYLES.WARNING,
        error: STATUS_STYLES.ERROR,
        info: STATUS_STYLES.INFO,
        neutral: STATUS_STYLES.NEUTRAL,
    };

    const targetStyle = styleMap[category];
    return Object.keys(statusConfig).filter(key =>
        statusConfig[key].color === targetStyle.color
    );
};