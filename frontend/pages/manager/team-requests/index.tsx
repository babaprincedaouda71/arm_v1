import React, {useMemo} from "react";
import SearchFilterAddBar from "@/components/SearchFilterAddBar";
import ModalButton from "@/components/ModalButton";
import Table from "@/components/Tables/Table/index";
import {handleSort} from "@/utils/sortUtils";
import ProtectedRoute from "@/components/ProtectedRoute";
import useTable from "@/hooks/useTable";
import StatusRenderer from "@/components/Tables/StatusRenderer";
import {statusConfig} from "@/config/tableConfig";
import DynamicActionsRenderer from "@/components/Tables/DynamicActionsRenderer";
import useSWR from "swr";
import {TeamRequestsProps} from "@/types/dataTypes";
import {TEAM_REQUESTS_URLS} from "@/config/urls";
import {fetcher} from "@/services/api";
import {useAuth, UserRole} from "@/contexts/AuthContext";

const TABLE_HEADERS = ["Exercice", "Domaine", "Thème", "Site", "Département", "Date", "Demandeur", "Validé par", "Statut"];
const TABLE_KEYS = ["year", "domain", "theme", "site", "department", "creationDate", "requester", "approver", "status"];

const ACTIONS_TO_SHOW = ["edit", "delete"];
const RECORDS_PER_PAGE = 4;
const STATUS_OPTIONS = ["Waiting", "Approved", "Rejected"];

const TeamRequests: React.FC = () => {
    const {user} = useAuth()
    const {data: teamRequestsData} = useSWR<TeamRequestsProps[]>(`${TEAM_REQUESTS_URLS.mutate}/${user?.id}`, fetcher);
    const memoizedTeamRequestsData = useMemo(() => teamRequestsData || [], [teamRequestsData]);
    const {
        currentPage,
        visibleColumns,
        setCurrentPage,
        handleSortData,
        toggleColumnVisibility,
        totalPages,
        totalRecords,
        paginatedData,
        sortableColumns,
    } = useTable(memoizedTeamRequestsData, TABLE_HEADERS, TABLE_KEYS, RECORDS_PER_PAGE,);

    const renderers = {
        status: (value: string, row: TeamRequestsProps) => (
            <StatusRenderer
                value={value === "Waiting" ? "En attente" : value === "Approved" ? "Approuvée" : value === "Rejected" ? "Rejetée" : value}
                groupeConfig={statusConfig}
                row={row}
                statusOptions={[]} // Ne pas afficher le menu déroulant car on use le modal
                apiUrl={`${TEAM_REQUESTS_URLS.updateStatus}/${user?.id}`}
                mutateUrl={`${TEAM_REQUESTS_URLS.mutate}/${user?.id}`}
                isTeamRequest={true} // Activer le comportement spécifique pour TeamRequests
            />
        ),
        actions: (_: any, row: TeamRequestsProps) => (<DynamicActionsRenderer actions={ACTIONS_TO_SHOW} row={row}/>)
    };
    return (
        <ProtectedRoute requiredRole={UserRole.Manager}>
            <div className="font-title text-xs md:text-sm lg:text-base bg-white rounded-xl pt-6">
                <div className="flex items-start gap-2 md:gap-8">
                    <SearchFilterAddBar
                        isLeftButtonVisible={false}
                        isFiltersVisible={false}
                        isRightButtonVisible={false}
                        leftTextButton="Filtrer les colonnes"
                        filters={[]}
                        placeholderText={"Recherche des demandes"}
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
                        currentPage, totalPages, onPageChange: setCurrentPage,
                    }}
                    totalRecords={totalRecords}
                    loading={false}
                    onAdd={() => console.log("Nouveau")}
                    visibleColumns={visibleColumns}
                    renderers={renderers}
                />
            </div>
        </ProtectedRoute>)
}
export default TeamRequests;