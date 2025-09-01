// Modification du composant Accounting (pages/admin/Plan/annual/accounting/AddOCFPage.tsx)

import Table from '@/components/Tables/Table/index'
import React, {useMemo, useState} from 'react'
import {AccountingsProps} from '@/types/dataTypes'
import StatusRenderer from '@/components/Tables/StatusRenderer'
import SearchFilterAddBar from '@/components/SearchFilterAddBar'
import ModalButton from '@/components/ModalButton'
import AddFee from './addFee'
import AccountingDetails from './details'
import {handleSort} from '@/utils/sortUtils'
import {statusConfig} from '@/config/tableConfig'
import DynamicActionsRenderer from '@/components/Tables/DynamicActionsRenderer'
import useTable from '@/hooks/useTable'
import useSWR from "swr";
import {fetcher} from "@/services/api";
import {GROUPE_INVOICE_URLS} from "@/config/urls";
import {useRouter} from "next/router";
import ProtectedRoute from "@/components/ProtectedRoute";
import {UserRole} from "@/contexts/AuthContext";

const TABLE_HEADERS = [
    "Type de frais",
    "Date de création",
    "Description",
    "Montant",
    "Statut du paiement",
    "Date de paiement",
    "Actions",
];
const TABLE_KEYS = [
    "type",
    "creationDate",
    "description",
    "amount",
    "status",
    "paymentDate",
    "actions",
];

const ACTIONS_TO_SHOW = ["edit", "delete"];
const RECORDS_PER_PAGE = 4;

const Accounting = () => {
    const router = useRouter();
    const {groupId} = router.query;

    // États pour gérer les vues
    const [currentView, setCurrentView] = useState<'list' | 'add' | 'edit' | 'details'>('list');
    const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

    // Récupération des données via SWR
    const {
        data: accountingData,
        error,
        mutate
    } = useSWR<AccountingsProps[]>(GROUPE_INVOICE_URLS.mutate + `/${groupId}`, fetcher);

    // Mémorisation des données
    const memoizeData = useMemo(() => accountingData || [], [accountingData]);
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
    } = useTable(
        memoizeData,
        TABLE_HEADERS,
        TABLE_KEYS,
        RECORDS_PER_PAGE
    )

    // Renderer pour rendre le type de frais cliquable
    const TypeRenderer = ({value, row}: { value: string, row: AccountingsProps }) => {
        const handleTypeClick = () => {
            setSelectedInvoiceId(row.id);
            setCurrentView('details');
        };

        return (
            <button
                onClick={handleTypeClick}
                className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-left w-full"
                title="Cliquer pour voir les détails"
            >
                {value}
            </button>
        );
    };

    // Handler pour l'édition personnalisé
    const handleEdit = (row: AccountingsProps) => {
        setSelectedInvoiceId(row.id);
        setCurrentView('edit');
    };

    const renderers = {
        type: (value: string, row: AccountingsProps) => (
            <TypeRenderer value={value} row={row}/>
        ),
        // Formatage du montant avec devise
        amount: (value: string) => (
            <span className="font-medium">
                {parseFloat(value).toLocaleString('fr-FR')} Dh
            </span>
        ),
        // Formatage des dates
        creationDate: (value: string) => (
            <span>
                {new Date(value).toLocaleDateString('fr-FR')}
            </span>
        ),
        paymentDate: (value: string) => (
            <span>
                {value ? new Date(value).toLocaleDateString('fr-FR') : 'Non renseignée'}
            </span>
        ),
        status: (value: string, row: AccountingsProps) => (
            <StatusRenderer
                value={value}
                groupeConfig={statusConfig}
                statusOptions={['Non Réglée', 'Réglée', 'Annulée']}
                mutateUrl={GROUPE_INVOICE_URLS.mutate + `/${groupId}`}
                apiUrl={GROUPE_INVOICE_URLS.updateStatus}
                row={row}
            />
        ),
        actions: (_: any, row: AccountingsProps) =>
            <DynamicActionsRenderer
                actions={ACTIONS_TO_SHOW}
                row={row}
                mutateUrl={GROUPE_INVOICE_URLS.mutate + `/${groupId}`}
                deleteUrl={GROUPE_INVOICE_URLS.deleteGroupeInvoice}
                customEditHandler={handleEdit}
            />
    };

    const handleAdd = () => {
        setCurrentView('add');
    };

    const handleBackToList = () => {
        setCurrentView('list');
        setSelectedInvoiceId(null);
    };

    const handleSubmitSuccess = async () => {
        await mutate();
        setCurrentView('list');
        setSelectedInvoiceId(null);
    };

    // Rendu conditionnel basé sur la vue actuelle
    const renderContent = () => {
        switch (currentView) {
            case 'add':
                return (
                    <AddFee
                        onCancel={handleBackToList}
                        onSuccess={handleSubmitSuccess}
                    />
                );
            case 'edit':
                return selectedInvoiceId ? (
                    <AddFee
                        onCancel={handleBackToList}
                        onSuccess={handleSubmitSuccess}
                        invoiceId={selectedInvoiceId}
                    />
                ) : null;
            case 'details':
                return selectedInvoiceId ? (
                    <AccountingDetails
                        invoiceId={selectedInvoiceId}
                        groupId={groupId}
                        onCancel={handleBackToList}
                    />
                ) : null;
            case 'list':
            default:
                return (
                    <>
                        <div className="flex items-start gap-2 md:gap-8">
                            <SearchFilterAddBar
                                isLeftButtonVisible={false}
                                isFiltersVisible={false}
                                isRightButtonVisible={true}
                                leftTextButton="Filtrer les colonnes"
                                rightTextButton="Nouvelle"
                                onRightButtonClick={handleAdd}
                                filters={[]}
                                placeholderText={"Recherche..."}
                            />
                            <ModalButton
                                headers={TABLE_HEADERS}
                                visibleColumns={visibleColumns}
                                toggleColumnVisibility={toggleColumnVisibility}
                            />
                        </div>
                        <Table
                            data={paginatedData}
                            keys={TABLE_KEYS}
                            headers={TABLE_HEADERS}
                            sortableCols={sortableColumns}
                            onSort={(column, order) => handleSortData(column, order, handleSort)}
                            isPagination={true}
                            pagination={{
                                currentPage,
                                totalPages,
                                onPageChange: setCurrentPage,
                            }}
                            totalRecords={totalRecords}
                            loading={!accountingData && !error}
                            onAdd={() => null}
                            visibleColumns={visibleColumns}
                            renderers={renderers}
                        />
                    </>
                );
        }
    };

    return (
        <ProtectedRoute requiredRole={UserRole.Admin}>
            {renderContent()}
        </ProtectedRoute>
    );
}

export default Accounting;