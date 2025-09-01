import { useMemo, useState, useCallback } from 'react';

// Type pour représenter un filtre appliqué
export interface ColumnFilter {
    column: string;
    key: string;
    selectedValues: Set<any>;
}

export interface FilterState {
    [key: string]: Set<any>; // Clé = nom de la colonne, Valeur = ensemble des valeurs sélectionnées
}

export const useColumnFilters = <T extends Record<string, any>>(
    data: T[],
    headers: string[],
    keys: string[],
) => {
    // État pour suivre les filtres actifs
    const [activeFilters, setActiveFilters] = useState<FilterState>({});

    // Identifie la colonne actuellement en mode filtre
    const [activeFilterColumn, setActiveFilterColumn] = useState<string | null>(null);

    // Extrait toutes les valeurs uniques pour chaque colonne
    const uniqueValues = useMemo(() => {
        const values: Record<string, Set<any>> = {};

        // Pour chaque colonne
        keys.forEach((key, index) => {
            const header = headers[index];
            // Ignorer les colonnes spéciales
            if (header === 'Actions' || header === 'Sélection') return;

            // Créer un Set pour stocker les valeurs uniques
            const uniqueSet = new Set<any>();

            // Parcourir toutes les données
            data.forEach((item) => {
                if (item[key] !== undefined && item[key] !== null) {
                    uniqueSet.add(item[key]);
                }
            });

            values[header] = uniqueSet;
        });

        return values;
    }, [data, headers, keys]);

    // Convertit les Sets en tableaux triés pour l'affichage dans l'UI
    const uniqueValuesArrays = useMemo(() => {
        const result: Record<string, any[]> = {};

        Object.entries(uniqueValues).forEach(([header, valueSet]) => {
            result[header] = Array.from(valueSet).sort((a, b) => {
                if (typeof a === 'string' && typeof b === 'string') {
                    return a.localeCompare(b);
                }
                return String(a).localeCompare(String(b));
            });
        });

        return result;
    }, [uniqueValues]);

    // Applique les filtres et retourne les données filtrées
    const filteredData = useMemo(() => {
        // Si aucun filtre n'est actif, retourner toutes les données
        if (Object.keys(activeFilters).length === 0) {
            return data;
        }

        // Sinon, filtrer les données
        return data.filter((item) => {
            // Pour chaque filtre actif
            return Object.entries(activeFilters).every(([header, selectedValues]) => {
                // Si aucune valeur n'est sélectionnée pour ce filtre, considérer comme "tout sélectionné"
                if (selectedValues.size === 0) return true;

                // Trouver la clé correspondant à l'en-tête
                const keyIndex = headers.indexOf(header);
                if (keyIndex === -1) return true;

                const key = keys[keyIndex];
                // Vérifier si la valeur de l'élément est dans les valeurs sélectionnées
                return selectedValues.has(item[key]);
            });
        });
    }, [data, activeFilters, headers, keys]);

    // Ajouter ou supprimer une valeur du filtre pour une colonne spécifique
    const toggleFilterValue = useCallback((header: string, value: any) => {
        setActiveFilters((prevFilters) => {
            const newFilters = { ...prevFilters };

            // Initialiser le set s'il n'existe pas
            if (!newFilters[header]) {
                newFilters[header] = new Set<any>();
            }

            // Toggle la valeur
            const currentSet = newFilters[header];
            if (currentSet.has(value)) {
                currentSet.delete(value);
            } else {
                currentSet.add(value);
            }

            return newFilters;
        });
    }, []);

    // Sélectionner ou désélectionner toutes les valeurs d'une colonne
    const selectAllValues = useCallback((header: string, select: boolean) => {
        setActiveFilters((prevFilters) => {
            const newFilters = { ...prevFilters };

            if (select) {
                // Sélectionner toutes les valeurs
                newFilters[header] = new Set(uniqueValuesArrays[header]);
            } else {
                // Désélectionner toutes les valeurs
                newFilters[header] = new Set<any>();
            }

            return newFilters;
        });
    }, [uniqueValuesArrays]);

    // Effacer tous les filtres
    const clearAllFilters = useCallback(() => {
        setActiveFilters({});
    }, []);

    // Voir si une valeur est sélectionnée pour un en-tête
    const isValueSelected = useCallback((header: string, value: any) => {
        const selectedValues = activeFilters[header];
        if (!selectedValues || selectedValues.size === 0) return true; // Tout est sélectionné par défaut
        return selectedValues.has(value);
    }, [activeFilters]);

    // Vérifier si une colonne a des filtres actifs
    const hasActiveFilter = useCallback((header: string) => {
        return !!activeFilters[header] && activeFilters[header].size > 0;
    }, [activeFilters]);

    return {
        uniqueValuesArrays,
        filteredData,
        activeFilterColumn,
        setActiveFilterColumn,
        toggleFilterValue,
        selectAllValues,
        clearAllFilters,
        isValueSelected,
        hasActiveFilter,
        activeFilters
    };
};