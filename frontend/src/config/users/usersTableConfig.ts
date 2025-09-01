// src/config/users/usersTableConfig.ts

export const USERS_TABLE_HEADERS = [
    "Sélection",
    "Nom",
    "Prénoms",
    "Email",
    "Groupe",
    "Manager",
    "Genre",
    "Date de naissance",
    "Numéro de téléphone",
    "Adresse",
    "Cin",
    "Code employé",
    "Date de recrutement",
    "Sécurité sociale",
    "Département",
    "Date de création",
    "Statut",
    "Actions",
];

export const USERS_TABLE_KEYS = [
    "selection",
    "lastName",
    "firstName",
    "email",
    "role",
    "manager",
    "gender",
    "birthDate",
    "phoneNumber",
    "address",
    "cin",
    "collaboratorCode",
    "hiringDate",
    "socialSecurityNumber",
    "department",
    "creationDate",
    "status",
    "actions",
];

export const USERS_ACTIONS_TO_SHOW = ["view", "edit", "delete"];
export const USERS_RECORDS_PER_PAGE = 5;

export const USERS_DEFAULT_VISIBLE_COLUMNS = [
    "Sélection",
    "Nom",
    "Prénoms",
    "Groupe",
    "Manager",
    "Département",
    "Date de création",
    "Statut",
    "Actions",
];


export const USERS_COLUMN_CONFIGS = {
    lastName: {
        // Note: onClick ne doit pas être ici car il dépend de row et navigateTo.
        // La classe peut être définie ici si elle est toujours la même.
        className: "hover:underline cursor-pointer",
    },
    // ... Ajoutez d'autres configurations de colonnes si nécessaire
};