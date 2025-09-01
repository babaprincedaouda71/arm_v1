// src/config/plans/plansTableConfig.ts

export const TRAINING_TABLE_HEADERS = [
    "Thème",
    "Date",
    "Type",
    "OCF",
    "Budget",
    "Statut",
    "Actions",
];

export const TRAINING_TABLE_KEYS = [
    "theme",
    "date",
    "type",
    "ocf",
    "budget",
    "status",
    "actions",
];

export const TRAINING_ACTIONS_TO_SHOW = ["view", "edit", "cancel"];
export const TRAINING_RECORDS_PER_PAGE = 5;

export const TRAINING_DEFAULT_VISIBLE_COLUMNS = [
    "Thème",
    "Date",
    "Type",
    "OCF",
    "Budget",
    "Statut",
    "Actions",
];


export const TRAINING_COLUMN_CONFIGS = {
    title: {
        // Note: onClick ne doit pas être ici car il dépend de row et navigateTo.
        // La classe peut être définie ici si elle est toujours la même.
        className: "hover:underline cursor-pointer",
    },
    // ... Ajoutez d'autres configurations de colonnes si nécessaire
};