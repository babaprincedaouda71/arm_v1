import React, {useCallback} from 'react';
import StatusRenderer from "@/components/Tables/StatusRenderer";
import DynamicActionsRenderer from "@/components/Tables/DynamicActionsRenderer";
import {statusConfig} from "@/config/tableConfig";
import {NEED_TO_ADD_TO_PLAN_URLS, TRAINING_URLS} from "@/config/urls";
import {PlanAnnualExerciceProps, TrainingProps} from "@/types/dataTypes";
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";
import {TRAINING_ACTIONS_TO_SHOW} from "@/config/plans/planExercicesTableConfig";

interface usePlanTableRendererProps {
    openCancelModal: (training?: TrainingProps) => void;
    handleThemeClick: (row: PlanAnnualExerciceProps) => void;
    exercice?: string | string[];
    planId?: string | string[];
}

// Fonction utilitaire pour formater les dates selon les règles d'affichage
const formatGroupDates = (dates: string[]): string => {
    if (!dates || dates.length === 0) {
        return 'Dates non définies';
    }

    try {
        // Convertir les dates en objets Date et les trier
        const sortedDates = dates
            .map(dateStr => new Date(dateStr))
            .sort((a, b) => a.getTime() - b.getTime());

        // Grouper les dates par mois/année
        const datesByMonth = sortedDates.reduce((groups, date) => {
            const monthYear = `${date.getMonth()}-${date.getFullYear()}`;
            if (!groups[monthYear]) {
                groups[monthYear] = [];
            }
            groups[monthYear].push(date);
            return groups;
        }, {} as Record<string, Date[]>);

        // Formater chaque groupe de mois
        const formattedGroups = Object.values(datesByMonth).map(monthDates => {
            const firstDate = monthDates[0];
            const month = firstDate.toLocaleDateString('fr-FR', { month: '2-digit' });
            const year = firstDate.getFullYear();

            if (monthDates.length === 1) {
                // Une seule date dans ce mois
                return `${firstDate.getDate().toString().padStart(2, '0')}/${month}/${year}`;
            } else {
                // Plusieurs dates dans le même mois
                const days = monthDates
                    .map(date => date.getDate().toString().padStart(2, '0'))
                    .join(',');
                return `${days}/${month}/${year}`;
            }
        });

        return formattedGroups.join(', ');

    } catch (error) {
        console.warn('Erreur lors du formatage des dates:', dates, error);
        return dates.join(', ');
    }
};

export const useTrainingTableRenderer = ({
                                             openCancelModal,
                                             handleThemeClick,
                                             exercice,
                                             planId,
                                         }: usePlanTableRendererProps) => {
    const {buildRoleBasedPath, navigateTo} = useRoleBasedNavigation();

    return {
        theme: useCallback((value: string, row: PlanAnnualExerciceProps) => (
            <div
                onClick={() => handleThemeClick(row)}
                className="hover:underline cursor-pointer"
            >
                {value}
            </div>
        ), [handleThemeClick]),

        // Nouveau renderer pour la colonne date
        date: useCallback((value: string, row: TrainingProps) => {
            // Si pas de groupes ou pas de dates, afficher la date originale
            if (!row.groupDates || row.groupDates.length === 0) {
                return <span>{value}</span>;
            }

            return (
                <div className="space-y-1">
                    {row.groupDates.map((group, index) => (
                        <div key={group.groupId || index} className="text-sm">
                            <span className="font-medium text-gray-700">
                                {group.groupName} :
                            </span>
                            <span className="ml-1">
                                {formatGroupDates(group.dates)}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }, []),

        status: useCallback((value: string, row: PlanAnnualExerciceProps) => (
            <StatusRenderer
                value={value}
                groupeConfig={statusConfig}
                row={row}
                statusOptions={["Non_Planifié", "Planifié", "Terminé"]}
                apiUrl={TRAINING_URLS.updateStatus}
                mutateUrl={TRAINING_URLS.mutate}
            />
        ), []),

        actions: useCallback((_: any, row: TrainingProps) => (
            <DynamicActionsRenderer
                actions={TRAINING_ACTIONS_TO_SHOW}
                row={row}
                deleteUrl={NEED_TO_ADD_TO_PLAN_URLS.removeTheme}
                openCancelModal={() => openCancelModal(row)}
                customViewHandler={() => {
                    navigateTo(`/Plan/annual/${exercice}/${row.theme}`, {
                        query: {
                            id: row.id,
                        }
                    });
                }}
                customEditHandler={(row) => {
                    navigateTo(buildRoleBasedPath(`/Plan/annual/${exercice}/editTraining`), {
                        query: {
                            trainingId: row.id,
                            exercice: exercice,
                            planId: planId,
                        }
                    });
                }}
                mutateUrl={`${TRAINING_URLS.mutate}/${planId}`}
                confirmMessage={`Êtes-vous sûr de vouloir supprimer le plan ${row.theme} ?`}
            />
        ), [buildRoleBasedPath, openCancelModal, navigateTo, exercice, planId]),
    };
};