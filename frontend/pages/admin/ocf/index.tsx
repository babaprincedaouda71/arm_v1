import React, {useMemo} from "react";
import Table from "@/components/Tables/Table/index";
import ModalButton from "@/components/ModalButton";
import SearchFilterAddBar from "@/components/SearchFilterAddBar";
import StatusRenderer from "@/components/Tables/StatusRenderer";
import {SupplierProps} from "@/types/dataTypes";
import {handleSort} from "@/utils/sortUtils";
import DynamicActionsRenderer from "@/components/Tables/DynamicActionsRenderer";
import {statusConfig} from "@/config/tableConfig";
import useTable from "@/hooks/useTable";
import useSWR from "swr";
import {fetcher} from "@/services/api";
import {OCF_URLS, SUPPLIERS_URLS} from "@/config/urls";
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import {UserRole} from "@/contexts/AuthContext";

const TABLE_HEADERS = [
    "Raison sociale",
    "ICE",
    "Téléphone",
    "Email",
    "Contact principal",
    "Fonction",
    "Email du contact",
    "Téléphone du contact",
    "Statut",
    "Actions",
];
const TABLE_KEYS = [
    "corporateName",
    "ice",
    "phone",
    "email",
    "nameMainContact",
    "positionMainContact",
    "emailMainContact",
    "phoneMainContact",
    "status",
    "actions",
];

const ACTIONS_TO_SHOW = ["view", "edit", "delete"];
const RECORDS_PER_PAGE = 4;

const OCFPage = () => {
    const {navigateTo, isCurrentPath, getPathWithoutRolePrefix} = useRoleBasedNavigation();
    const {data: supplierData} = useSWR<SupplierProps[]>(SUPPLIERS_URLS.mutate, fetcher);
    const memoizedUserData = useMemo(() => supplierData || [], [supplierData]);
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
    } = useTable<SupplierProps>(memoizedUserData, TABLE_HEADERS, TABLE_KEYS, RECORDS_PER_PAGE)

    const renderers = {
        status: (value: string, row: SupplierProps) => (
            <StatusRenderer
                value={value}
                groupeConfig={statusConfig}
                statusOptions={["Actif", "Inactif"]}
                apiUrl={OCF_URLS.updateStatus}
                mutateUrl={OCF_URLS.mutate}
                row={row}
            />
        ),
        actions: (_: any, row: any) =>
            <DynamicActionsRenderer
                actions={ACTIONS_TO_SHOW}
                row={row}
                mutateUrl={OCF_URLS.mutate}
                deleteUrl={OCF_URLS.deleteOCF}
                editUrl={OCF_URLS.editPage}
                viewUrl={OCF_URLS.details}
            />
    };

    const handleAdd = () => (
        navigateTo("/ocf/add"))
    return (
        <ProtectedRoute requiredRole={UserRole.Admin}>
            <div className="font-title text-xs md:text-sm lg:text-base bg-white rounded-xl pt-6">
                <div className="flex items-start gap-2 md:gap-8">
                    <SearchFilterAddBar
                        isLeftButtonVisible={false}
                        isFiltersVisible={false}
                        isRightButtonVisible={true}
                        leftTextButton="Filtrer les colonnes"
                        rightTextButton="Nouveau"
                        onRightButtonClick={handleAdd}
                        filters={[]}
                        placeholderText={"Recherche de fournisseurs"}
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
        </ProtectedRoute>
    );
};

export default OCFPage;