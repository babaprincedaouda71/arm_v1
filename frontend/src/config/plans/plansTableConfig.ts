// src/config/plans/plansTableConfig.ts

export const PLANS_TABLE_HEADERS = [
    "Exercice",
    "Titre",
    "Date de début",
    "Date de fin",
    "Budget prévisionnel",
    "Validation OFPPT",
    "CSF",
    "Statut",
    "Actions",
];

export const PLANS_TABLE_KEYS = [
    "year",
    "title",
    "startDate",
    "endDate",
    "estimatedBudget",
    "isOFPPTValidation",
    "isCSFPlan",
    "status",
    "actions",
];

export const PLANS_ACTIONS_TO_SHOW = ["view", "edit", "delete"];
export const PLANS_RECORDS_PER_PAGE = 5;

export const PLANS_DEFAULT_VISIBLE_COLUMNS = [
    "Exercice",
    "Titre",
    "Date de début",
    "Date de fin",
    "Budget prévisionnel",
    "Validation OFPPT",
    "Statut",
    "Actions",
];


export const PLANS_COLUMN_CONFIGS = {
    title: {
        // Note: onClick ne doit pas être ici car il dépend de row et navigateTo.
        // La classe peut être définie ici si elle est toujours la même.
        className: "hover:underline cursor-pointer",
    },
    // ... Ajoutez d'autres configurations de colonnes si nécessaire
};