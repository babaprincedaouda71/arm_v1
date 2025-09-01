import React, {useMemo, useState} from "react";
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";
import useSWR from "swr";
import {fetcher} from "@/services/api";
import {MY_REQUESTS_URLS} from "@/config/urls";
import {MyRequestsProps} from "@/types/dataTypes";
import useTable from "@/hooks/useTable";
import {statusConfig} from "@/config/tableConfig";
import StatusRenderer from "@/components/Tables/StatusRenderer";
import DynamicActionsRenderer from "@/components/Tables/DynamicActionsRenderer";
import {useAuth, UserRole} from "@/contexts/AuthContext";
import SearchFilterAddBar from "@/components/SearchFilterAddBar";
import ModalButton from "@/components/ModalButton";
import Table from "@/components/Tables/Table/index";
import {handleSort} from "@/utils/sortUtils";
import ProtectedRoute from "@/components/ProtectedRoute";
import MyRequestDetailsModal from "@/components/MyRequestDetailsModal";

const TABLE_HEADERS = [
    "Thème",
    "Date de soumission",
    "Période",
    "Statut",
    "Actions",
];
const TABLE_KEYS = [
    "theme",
    "creationDate",
    "wishDate",
    "status",
    "actions",
];

const ACTIONS_TO_SHOW = ["view", "edit", "delete"];
const RECORDS_PER_PAGE = 4;

const MyRequestsComponent: React.FC = () => {
    const {user} = useAuth()
    const {navigateTo, buildRoleBasedPath} = useRoleBasedNavigation()

    // Récupération des données
    const {data: myRequestsData} = useSWR<MyRequestsProps[]>(`${MY_REQUESTS_URLS.mutate}/${user?.id}`, fetcher)
    const memoizedMyRequestsData = useMemo(() =>
        myRequestsData || [], [myRequestsData]);

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
    } = useTable(
        memoizedMyRequestsData,
        TABLE_HEADERS,
        TABLE_KEYS,
        RECORDS_PER_PAGE,
    );

    // Ajoutez ces états pour gérer le modal
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<MyRequestsProps | null>(null);

    // Modifiez la fonction handleView pour afficher le modal au lieu de naviguer
    const handleView = (row: MyRequestsProps) => {
        setSelectedRequest(row);
        setIsDetailsModalOpen(true);
    };

    const renderers = {
        status: (value: string, row: MyRequestsProps) => (
            <StatusRenderer
                value={value === "Waiting" ? "En attente" : value === "Approved" ? "Approuvée" : value === "Rejected" ? "Rejetée" : value}
                groupeConfig={statusConfig}
                row={row}
                mutateUrl={MY_REQUESTS_URLS.mutate}
            />
        ),
        actions: (_: any, row: MyRequestsProps) => (
            <DynamicActionsRenderer actions={ACTIONS_TO_SHOW}
                                    row={row}
                                    deleteUrl={MY_REQUESTS_URLS.delete}
                                    editUrl={buildRoleBasedPath(`${MY_REQUESTS_URLS.edit}`)}
                                    mutateUrl={MY_REQUESTS_URLS.mutate}
                                    confirmMessage={`Êtes-vous sûr de vouloir supprimer cette requête?`}
                                    customViewHandler={() => handleView(row)} // Passez un gestionnaire personnalisé pour view
            />
        ),
    };

    const handleAdd = () => {
        navigateTo("/add-request");
    }

    return (
        <ProtectedRoute requiredRoles={[UserRole.Manager, UserRole.Collaborateur]}>
            <div className="bg-white rounded-lg pt-6">
                {/* Search and Filter Bar */}
                <div className="flex items-start gap-2 md:gap-8 mt-4">
                    <SearchFilterAddBar
                        isLeftButtonVisible={false}
                        isFiltersVisible={false}
                        isRightButtonVisible={true}
                        leftTextButton="Filtrer les colonnes"
                        rightTextButton="Nouvel"
                        onRightButtonClick={handleAdd}
                        filters={[]}
                        placeholderText={"Recherche de besoins"}
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

                {/* Ajoutez le modal à la fin */}
                <MyRequestDetailsModal
                    isOpen={isDetailsModalOpen}
                    onClose={() => setIsDetailsModalOpen(false)}
                    requestData={selectedRequest}
                />
            </div>
        </ProtectedRoute>
    )
}
export default MyRequestsComponent;