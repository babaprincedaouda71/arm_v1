// src/hooks/plans/usePlanTableRenderers.tsx - Version mise à jour
import React, {useCallback} from 'react';
import StatusRenderer from "@/components/Tables/StatusRenderer";
import DynamicActionsRenderer from "@/components/Tables/DynamicActionsRenderer";
import {statusConfig} from "@/config/tableConfig";
import {PLANS_URLS} from "@/config/urls";
import {PlansProps} from "@/types/dataTypes";
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";
import {PLANS_ACTIONS_TO_SHOW} from "@/config/plans/plansTableConfig";
import OFPPTValidationSwitch from "@/components/FormComponents/OFPPTValidationSwitch";

interface UsePlanTableRenderersProps {
    handleTitleClick: (row: PlansProps) => void;
    onStatusUpdate?: () => void; // Pour rafraîchir les données après un changement
}

export const usePlanTableRenderer = ({
                                         handleTitleClick,
                                         onStatusUpdate,
                                     }: UsePlanTableRenderersProps) => {
    const {buildRoleBasedPath} = useRoleBasedNavigation();

    // Optionnel: Fonction utilitaire pour formater les statuts (peut être dans un fichier séparé, ex: src/utils/formatters.ts)
    const formatStatusForDisplay = (statusValue: string): string => {
        if (statusValue === "Non_Planifié") {
            return "Non Planifié";
        }
        // Vous pouvez ajouter d'autres transformations ici si nécessaire pour d'autres statuts
        // Par exemple:
        // if (statusValue === "Some_Other_Status") {
        //     return "Some Other Status";
        // }
        return statusValue;
    };

    return {
        // Rendu du titre avec lien cliquable
        title: useCallback((value: string, row: PlansProps) => (
            <div
                onClick={() => handleTitleClick(row)}
                className="hover:underline cursor-pointer text-blue-600 font-medium"
                title="Cliquer pour voir les détails du plan"
            >
                {value}
            </div>
        ), [handleTitleClick]),

        // Rendu du switch de validation OFPPT avec la nouvelle logique
        isOFPPTValidation: useCallback((isCurrentlyValidated: boolean, row: PlansProps) => (
            <OFPPTValidationSwitch
                plan={row}
                onStatusUpdate={onStatusUpdate}
            />
        ), [onStatusUpdate]),

        // Rendu du statut avec mise à jour possible
        status: useCallback((value: string, row: PlansProps) => (
            <StatusRenderer
                value={formatStatusForDisplay(value)}
                groupeConfig={statusConfig}
                row={row}
                statusOptions={["Non_Planifié", "Planifié", "Réalisé", "Terminé", "Annulé"]}
                apiUrl={PLANS_URLS.updateStatus}
                mutateUrl={PLANS_URLS.mutate}
            />
        ), []),

        // Rendu des actions (voir, éditer, supprimer)
        actions: useCallback((_: any, row: PlansProps) => (
            <DynamicActionsRenderer
                actions={PLANS_ACTIONS_TO_SHOW}
                row={row}
                deleteUrl={PLANS_URLS.delete}
                viewUrl={buildRoleBasedPath(`${PLANS_URLS.view}${row.title}`)}
                editUrl={buildRoleBasedPath(`${PLANS_URLS.edit}`)}
                mutateUrl={PLANS_URLS.mutate}
                confirmMessage={`Êtes-vous sûr de vouloir supprimer le plan "${row.title}" ?`}
                getViewQueryParams={(row: PlansProps) => ({
                    planId: row.id,
                })}
                getEditQueryParams={(row: PlansProps) => ({
                    id: row.id,
                })}
            />
        ), [buildRoleBasedPath]),

        // Rendu personnalisé pour le type de plan CSF
        isCSFPlan: useCallback((value: boolean) => (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                value
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
            }`}>
                {value ? 'CSF' : 'Non CSF'}
            </span>
        ), []),

        // Rendu du budget avec formatage
        estimatedBudget: useCallback((value: number) => (
            <span className="font-medium">
                {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'MAD'
                }).format(value)}
            </span>
        ), []),

        // Rendu des dates avec formatage
        startDate: useCallback((value: string) => (
            <span className="text-sm">
                {new Date(value).toLocaleDateString('fr-FR')}
            </span>
        ), []),

        endDate: useCallback((value: string) => (
            <span className="text-sm">
                {new Date(value).toLocaleDateString('fr-FR')}
            </span>
        ), []),

        // Rendu de l'année
        year: useCallback((value: number) => (
            <span className="font-medium text-sm">
                {value}
            </span>
        ), []),
    };
};