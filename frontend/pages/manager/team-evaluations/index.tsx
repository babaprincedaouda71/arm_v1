import ProtectedRoute from "@/components/ProtectedRoute";
import {useAuth, UserRole} from "@/contexts/AuthContext";
import React, {useMemo} from "react";
import {handleSort} from "@/utils/sortUtils";
import Table from "@/components/Tables/Table1";
import useTable from "@/hooks/useTable";
import {TeamEvaluationProps, UserProps} from "@/types/dataTypes";
import ProgressBar from "@/components/ProgressBar";
import SearchFilterAddBar from "@/components/SearchFilterAddBar";
import ModalButton from "@/components/ModalButton";
import DynamicActionsRenderer from "@/components/Tables/DynamicActionsRenderer";
import {TEAM_EVALUATIONS_URLS} from "@/config/urls";
import StatusRenderer from "@/components/Tables/StatusRenderer";
import {statusConfig} from "@/config/tableConfig";
import {fetcher} from "@/services/api";
import useSWR from "swr";
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";

const TABLE_HEADERS = [
    "Intitulé",
    "Type",
    "État",
    "Destinataires",
    "Avancement",
    "Date de création",
    "Actions",
];
const TABLE_KEYS = [
    "title",
    "type",
    "status",
    "participants",
    "progress",
    "creationDate",
    "actions",
];

const RECORDS_PER_PAGE = 5;

const ACTIONS_TO_SHOW = ["view"];


const TeamEvaluations = () => {
    const {buildRoleBasedPath} = useRoleBasedNavigation()
    const {user} = useAuth()
    const {data: teamEvaluationsData} = useSWR<TeamEvaluationProps[]>(`${TEAM_EVALUATIONS_URLS.mutate}/${user?.id}`, fetcher);
    console.log(teamEvaluationsData)
    const memoizedUserData = useMemo(() =>
        teamEvaluationsData || [], [teamEvaluationsData]);
    const {
        currentPage,
        setCurrentPage,
        toggleColumnVisibility,
        totalPages,
        visibleColumns,
        handleSortData,
        totalRecords,
        sortableColumns,
        paginatedData,
    } = useTable(memoizedUserData, TABLE_HEADERS, TABLE_KEYS, RECORDS_PER_PAGE)

    const renderers = {
        status: (value: string, row: UserProps) => (
            <StatusRenderer
                value={value}
                groupeConfig={statusConfig}
                row={row}
            />
        ),
        progress: (_: string, row: TeamEvaluationProps) => (
            <div>
                <span>{row.progress} %</span>
                <ProgressBar progress={row.progress}/>
            </div>
        ),
        actions: (_: string, row: TeamEvaluationProps) => (
            <DynamicActionsRenderer
                actions={ACTIONS_TO_SHOW}
                row={row}
                viewUrl={buildRoleBasedPath(`${TEAM_EVALUATIONS_URLS.view}`)}
            />
        )
    };
    return (
        <ProtectedRoute requiredRole={UserRole.Manager}>
            <div className="bg-white rounded-lg pt-6">
                {/* Search and Filter Bar */}
                <div className="flex items-start gap-2 md:gap-8 mt-4">
                    <SearchFilterAddBar
                        isLeftButtonVisible={false}
                        isFiltersVisible={false}
                        isRightButtonVisible={false}
                        leftTextButton="Filtrer les colonnes"
                        rightTextButton="Nouvel"
                        filters={[]}
                        placeholderText={"Recherche d'évaluations"}
                    />
                    <ModalButton
                        headers={TABLE_HEADERS}
                        visibleColumns={visibleColumns}
                        toggleColumnVisibility={toggleColumnVisibility}
                    />
                </div>

                {/* Table Component */}
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
                    onAdd={() => console.log("Nouveau")}
                    visibleColumns={visibleColumns}
                    renderers={renderers}
                />
            </div>
        </ProtectedRoute>
    )
}
export default TeamEvaluations;