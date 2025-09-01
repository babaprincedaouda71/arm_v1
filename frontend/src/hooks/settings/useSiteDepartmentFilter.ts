// src/hooks/useSiteDepartmentFilter.ts
import {useMemo} from 'react';
import {DepartmentProps, SiteProps} from '@/types/dataTypes';

interface FilteredDepartment {
    id: number;
    name: string;
    siteLabel: string;
    displayName: string; // Format: "Finance (Site de Casa)"
}

interface UseSiteDepartmentFilterProps {
    sitesData?: SiteProps[];
    departmentsData?: DepartmentProps[];
    selectedSiteIds: number[];
}

export const useSiteDepartmentFilter = ({
                                            sitesData,
                                            departmentsData,
                                            selectedSiteIds
                                        }: UseSiteDepartmentFilterProps) => {

    // Calcul des départements filtrés avec leur site d'origine
    const filteredDepartments = useMemo((): FilteredDepartment[] => {
        if (!sitesData || !departmentsData) return [];

        // Si aucun site n'est sélectionné, retourner tous les départements sans filtre
        if (selectedSiteIds.length === 0) {
            return departmentsData.map(dept => ({
                id: dept.id,
                name: dept.name,
                siteLabel: 'Aucun site',
                displayName: dept.name
            }));
        }

        const filteredResults: FilteredDepartment[] = [];

        // Pour chaque site sélectionné
        selectedSiteIds.forEach(siteId => {
            const site = sitesData.find(s => s.id === siteId);
            if (!site || !site.departmentIds) return;

            // Pour chaque département de ce site
            site.departmentIds.forEach(deptId => {
                const department = departmentsData.find(d => d.id === deptId);
                if (!department) return;

                // Éviter les doublons si un département appartient à plusieurs sites sélectionnés
                const alreadyExists = filteredResults.some(fd => fd.id === department.id && fd.siteLabel === site.label);
                if (alreadyExists) return;

                filteredResults.push({
                    id: department.id,
                    name: department.name,
                    siteLabel: site.label,
                    displayName: `${department.name} (${site.label})`
                });
            });
        });

        return filteredResults.sort((a, b) => a.displayName.localeCompare(b.displayName));
    }, [sitesData, departmentsData, selectedSiteIds]);

    // Options formatées pour le MultiSelectField
    const departmentOptions = useMemo(() => {
        return filteredDepartments.map(fd => fd.displayName);
    }, [filteredDepartments]);

    // Fonction pour convertir les IDs sélectionnés en noms d'affichage
    const getDisplayNamesByIds = (departmentIds: number[]): string[] => {
        return departmentIds
            .map(id => filteredDepartments.find(fd => fd.id === id)?.displayName)
            .filter((name): name is string => name !== undefined);
    };

    // Fonction pour convertir les noms d'affichage en IDs
    const getIdsByDisplayNames = (displayNames: string[]): number[] => {
        return displayNames
            .map(displayName => filteredDepartments.find(fd => fd.displayName === displayName)?.id)
            .filter((id): id is number => id !== undefined);
    };

    // Fonction pour nettoyer les départements sélectionnés quand on change les sites
    const cleanSelectedDepartments = (currentDepartmentIds: number[]): number[] => {
        const availableIds = filteredDepartments.map(fd => fd.id);
        return currentDepartmentIds.filter(id => availableIds.includes(id));
    };

    return {
        filteredDepartments,
        departmentOptions,
        getDisplayNamesByIds,
        getIdsByDisplayNames,
        cleanSelectedDepartments,
        hasAvailableDepartments: filteredDepartments.length > 0
    };
};