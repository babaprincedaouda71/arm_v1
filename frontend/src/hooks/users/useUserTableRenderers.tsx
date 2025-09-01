// src/hooks/users/useUserTableRenderers.ts

import React, {useCallback} from 'react';
import StatusRenderer from "@/components/Tables/StatusRenderer";
import DynamicActionsRenderer from "@/components/Tables/DynamicActionsRenderer";
import GroupeRenderer from "@/components/Tables/GroupeRenderer";
import {groupeConfig, statusConfig} from "@/config/tableConfig"; // Ces configs peuvent venir de tableConfig.ts
import {USERS_URLS} from "@/config/urls";
import {UserProps} from "@/types/dataTypes";
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation"; // Si navigateTo est utilisé dans les renderers
import {USERS_ACTIONS_TO_SHOW} from "@/config/users/usersTableConfig";
import ManagerRenderer from "@/components/Tables/ManagerRenderer";
import {USERS_MODULE_URL} from "@/config/internal-url"; // Les actions spécifiques aux utilisateurs

interface UseUserTableRenderersProps {
    isRowSelected: (rowId: number) => boolean;
    handleRowSelection: (rowId: number, isSelected: boolean) => void;
    handleFullNameClick: (_: string, row: UserProps) => void;
    groupeOptions: string[];
    managerOptions?: { value: number; label: string }[]; // Liste des managers potentiels { id, "Prénom Nom" }
    adminOptions?: { value: number; label: string }[]; // Liste des admins potentiels { id, "Prénom Nom" }
}

export const useUserTableRenderers = ({
                                          isRowSelected,
                                          handleRowSelection,
                                          handleFullNameClick,
                                          groupeOptions,
                                          managerOptions,
                                          adminOptions
                                      }: UseUserTableRenderersProps) => {
    const {buildRoleBasedPath} = useRoleBasedNavigation(); // Ou passez-le en prop si ce hook ne doit pas dépendre de useRoleBasedNavigation

    return {
        selection: useCallback((_: string, row: UserProps) => (
            <div className="flex justify-center items-center">
                <input
                    type="checkbox"
                    className="h-5 w-5 accent-primary"
                    checked={isRowSelected(row.id)}
                    onChange={(e) => handleRowSelection(row.id, e.target.checked)}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Sélectionner ${row.firstName + ' ' + row.lastName}`}
                />
            </div>
        ), [isRowSelected, handleRowSelection]),

        lastName: useCallback((value: string, row: UserProps) => (
            <div
                onClick={() => handleFullNameClick(value, row)}
                className="hover:underline cursor-pointer" // Classe CSS ici ou importée
            >
                {value}
            </div>
        ), [handleFullNameClick]),

        role: useCallback((value: any, row: UserProps) => (
            <GroupeRenderer
                value={value}
                groupeConfig={groupeConfig}
                row={row}
                groupeOptions={groupeOptions}
            />
        ), [groupeOptions]),

        manager: useCallback((value: any, row: UserProps) => {
            // Cas où l'utilisateur est un Manager - on affiche les admins comme options
            if (row.role === "Manager" && adminOptions) {
                return (
                    <ManagerRenderer
                        value={value}
                        row={row}
                        managerOptions={adminOptions}
                    />
                );
            }
            // Cas où l'utilisateur est Admin - on affiche "N/A"
            else if (row.role === "Admin") {
                return <div>N/A</div>;
            }
            // Pour tous les autres rôles - on combine managerOptions et adminOptions
            else {
                const combinedOptions = [
                    ...(managerOptions || []),
                    ...(adminOptions || [])
                ];

                // On pourrait aussi dédupliquer les options si nécessaire
                // const uniqueOptions = Array.from(new Map(combinedOptions.map(option => [option.value, option])).values());

                return (
                    <ManagerRenderer
                        value={value}
                        row={row}
                        managerOptions={combinedOptions}
                    />
                );
            }
        }, [managerOptions, adminOptions]),

        status: useCallback((value: string, row: UserProps) => (
            <StatusRenderer
                value={value}
                groupeConfig={statusConfig}
                row={row}
                statusOptions={["Actif", "Inactif", "Suspendu", "Bloqué"]}
                apiUrl={USERS_URLS.updateStatus}
                mutateUrl={USERS_URLS.mutate}
            />
        ), []),

        actions: useCallback((_: any, row: UserProps) => (
            <DynamicActionsRenderer
                actions={USERS_ACTIONS_TO_SHOW}
                row={row}
                isSelected={isRowSelected(row.id)}
                deleteUrl={USERS_URLS.delete}
                viewUrl={buildRoleBasedPath(`${USERS_MODULE_URL.user}`)}
                editUrl={buildRoleBasedPath(`${USERS_MODULE_URL.edit}`)}
                mutateUrl={USERS_URLS.mutate}
                confirmMessage={`Êtes-vous sûr de vouloir supprimer l'utilisateur ${row.firstName} ${row.lastName} ?`}
            />
        ), [isRowSelected, buildRoleBasedPath]),
    };
};