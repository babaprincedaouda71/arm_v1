import React, {useMemo} from "react";
import SearchFilterAddBar from "../../../SearchFilterAddBar";
import ModalButton from "../../../ModalButton";
import Table from "../../../Tables/Table/index";
import {NeedsEvaluationCampaignProps} from "../../../../types/dataTypes";
import StatusRenderer from "@/components/Tables/StatusRenderer";
import {statusConfig} from "@/config/tableConfig";
import {handleSort} from "@/utils/sortUtils";
import useTable from "@/hooks/useTable";
import DynamicActionsRenderer from "@/components/Tables/DynamicActionsRenderer";
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";
import useSWR from "swr";
import {CAMPAIGN_URLS} from "@/config/urls";
import {fetcher} from "@/services/api";
import {formatCommaSeparatedToColumn, formatCommaSeparatedToLines} from "@/utils/formateString";
import ProgressBar from "@/components/ProgressBar";

// Table Headers and Keys
const TABLE_HEADERS = [
    "Titre de la campagne",
    "Date de création",
    "Questionnaire",
    "Département",
    "Site",
    "Statut",
    "Progression",
    "Actions",
];
const TABLE_KEYS = [
    "title",
    "creationDate",
    "questionnaire",
    "department",
    "site",
    "status",
    "progress",
    "actions",
];

const ACTIONS_TO_SHOW = ["edit", "delete"];
const RECORDS_PER_PAGE = 4;

const NeedsEvaluationCampaign = () => {
    const {data: campaignEvaluationData} = useSWR<NeedsEvaluationCampaignProps[]>(CAMPAIGN_URLS.mutate, fetcher);
    const memoizedUserData = useMemo(() =>
        campaignEvaluationData || [], [campaignEvaluationData]);

    const {navigateTo, buildRoleBasedPath} = useRoleBasedNavigation()
    const {
        currentPage,
        visibleColumns,
        setCurrentPage,
        handleSortData,
        toggleColumnVisibility,
        totalRecords,
        totalPages,
        sortableColumns,
        paginatedData,
    } = useTable(memoizedUserData, TABLE_HEADERS, TABLE_KEYS, RECORDS_PER_PAGE)

    const renderers = {
        questionnaire: (value: string) => (
            formatCommaSeparatedToLines(value)
        ),
        site: (value: string) => (
            formatCommaSeparatedToColumn(value)
        ),
        department: (value: string) => (
            formatCommaSeparatedToColumn(value)
        ),
        status: (value: string, row: NeedsEvaluationCampaignProps) => (
            <StatusRenderer
                value={value}
                row={row}
                groupeConfig={statusConfig}
                statusOptions={["Brouillon", "Publiée"]}
                apiUrl={CAMPAIGN_URLS.publish}
                mutateUrl={CAMPAIGN_URLS.mutate}
            />
        ),
        progress: (_: string, row: NeedsEvaluationCampaignProps) => (
            <div>
                <span>{row.progress} %</span>
                <ProgressBar progress={row.progress}/>
            </div>
        ),
        actions: (_: any, row: NeedsEvaluationCampaignProps) => {
            let actionsToRender: string[];

            // Si le statut est 'Publiée', remplacer 'edit' par 'view'
            if (row.status === 'Publiée') {
                actionsToRender = ['view', 'delete'];
            } else {
                // Sinon, utiliser la liste par défaut (edit et delete)
                actionsToRender = ACTIONS_TO_SHOW; // Qui est ["edit", "delete"]
            }

            return (
                <DynamicActionsRenderer
                    actions={actionsToRender}
                    row={row}
                    editUrl={CAMPAIGN_URLS.editPage}
                    deleteUrl={CAMPAIGN_URLS.delete}
                    viewUrl={buildRoleBasedPath(`${CAMPAIGN_URLS.view}`)}
                    mutateUrl={CAMPAIGN_URLS.mutate}
                    // 🆕 Nouvelle prop pour désactiver les actions selon les conditions
                    getActionDisabledState={(actionKey: string, row: NeedsEvaluationCampaignProps) => {
                        // Désactiver le bouton 'delete' si le statut est 'Publiée'
                        return actionKey === 'delete' && row.status === 'Publiée';

                    }}
                />
            );
        }
    };

    const handleAddCampaign = () => {
        navigateTo("/Needs/evaluation/add");
    };

    return (
        <div>
            <div className="font-title text-xs md:text-sm lg:text-base bg-white rounded-xl pt-6">
                <div className="flex items-start gap-2 md:gap-8">
                    <SearchFilterAddBar
                        isLeftButtonVisible={false}
                        isFiltersVisible={false}
                        isRightButtonVisible={true}
                        leftTextButton="Filtrer les colonnes"
                        rightTextButton="Nouvelle"
                        onRightButtonClick={handleAddCampaign}
                        filters={[]}
                        placeholderText={"Recherche de besoins"}
                    />
                    {/* Bouton pour afficher/masquer la fenêtre modale */}
                    <ModalButton
                        headers={TABLE_HEADERS}
                        visibleColumns={visibleColumns}
                        toggleColumnVisibility={toggleColumnVisibility}
                    />
                </div>

                {/* Tableau */}
                <Table
                    data={paginatedData}
                    keys={TABLE_KEYS}
                    headers={TABLE_HEADERS}
                    sortableCols={sortableColumns}
                    onSort={(column, order) => handleSortData(column, order, handleSort)}
                    isPagination
                    pagination={{
                        currentPage,
                        totalPages,
                        onPageChange: setCurrentPage,
                    }}
                    totalRecords={totalRecords}
                    loading={false}
                    onAdd={() => console.log("Nouveau")}
                    visibleColumns={visibleColumns}
                    renderers={renderers}
                />
            </div>
        </div>
    );
};

export default NeedsEvaluationCampaign;