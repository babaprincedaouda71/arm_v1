// components/Tables/TableContainer.tsx
import React, { useState, useMemo } from 'react'
import { ActionConfig, StatusConfig } from '@/types/Table.types'
import StatusRenderer from '../StatusRenderer'
import TableActions from '../TableActions'
import SearchFilterAddBar from '@/components/SearchFilterAddBar'
import ModalButton from '@/components/ModalButton'
import Table from '../Table1'

interface TableContainerProps<T> {
    data: T[]
    headers: string[]
    keys: string[]
    statusConfig?: Record<string, StatusConfig>
    actions?: ActionConfig[]
    recordsPerPage?: number
    onAdd?: () => void
    customRenderers?: Record<string, (value: any, row: any) => React.ReactNode>

    showSearchBar?: boolean
    showColumnVisibilityButton?: boolean
}

interface SortState {
    column: string | null;
    order: 'asc' | 'desc' | null;
}

const TableContainer = <T extends Record<string, any>>({
    data: initialData,
    headers,
    keys,
    statusConfig = {},
    actions = [],
    recordsPerPage = 5,
    onAdd,
    customRenderers = {},
    showSearchBar = true,  // par défaut true pour maintenir le comportement existant
    showColumnVisibilityButton = true // par défaut true pour maintenir le comportement existant
}: TableContainerProps<T>) => {
    // États
    const [data, setData] = useState<T[]>(initialData)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState('')
    const [visibleColumns, setVisibleColumns] = useState(headers)

    // Colonnes triables (excluant Actions)
    const sortableCols = useMemo(() =>
        headers.filter(header => header !== 'Actions'),
        [headers]
    )

    const [sortState, setSortState] = useState<SortState>({
        column: null,
        order: null
    });

    // Filtrage des données
    const filteredData = useMemo(() => {
        if (!searchTerm) return data

        return data.filter(item =>
            Object.values(item).some(value =>
                value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
    }, [data, searchTerm])

    // Pagination
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * recordsPerPage
        const end = start + recordsPerPage
        return filteredData.slice(start, end)
    }, [filteredData, currentPage, recordsPerPage])

    // Fonction de tri améliorée
    const handleSort = (column: string) => {
        setSortState(prevSort => {
            // Si on clique sur une nouvelle colonne
            if (prevSort.column !== column) {
                return { column, order: 'asc' };
            }

            // Si on clique sur la même colonne, on change l'ordre
            if (prevSort.order === 'asc') {
                return { column, order: 'desc' };
            }

            // Si on est déjà en desc, on réinitialise
            return { column: null, order: null };
        });
    };

    const toggleColumnVisibility = (column: string) => {
        setVisibleColumns(prev =>
            prev.includes(column)
                ? prev.filter(col => col !== column)
                : [...prev, column]
        )
    }

    // Combinaison des renderers par défaut et personnalisés
    const renderers = {
        ...customRenderers,
        status: statusConfig ? (value: string) => (
            <StatusRenderer value={value} groupeConfig={statusConfig} />
        ) : customRenderers.status,
        actions: actions.length > 0 ? (value: any, row: any) => (
            <TableActions actions={actions} row={row} />
        ) : customRenderers.actions
    }

    return (
        <div className="mx-auto bg-white font-title rounded-lg px-6 pb-2 pt-6">
            {(showSearchBar || showColumnVisibilityButton) && (
                <div className="flex items-start gap-2 md:gap-8 mt-4">
                    {showSearchBar && (
                        <SearchFilterAddBar
                            isLeftButtonVisible={false}
                            isFiltersVisible={false}
                            isRightButtonVisible={!!onAdd}
                            rightTextButton="Nouveau"
                            onRightButtonClick={onAdd}
                            filters={[]}
                            placeholderText="Recherche..."
                        />
                    )}
                    {showColumnVisibilityButton && (
                        <ModalButton
                            headers={headers}
                            visibleColumns={visibleColumns}
                            toggleColumnVisibility={toggleColumnVisibility}
                        />
                    )}
                </div>
            )}

            <Table
                data={paginatedData}
                keys={keys}
                headers={headers}
                sortableCols={sortableCols}
                onSort={handleSort}
                isPagination={true}
                totalRecords={filteredData.length}
                loading={false}
                visibleColumns={visibleColumns}
                renderers={renderers}
                pagination={{
                    currentPage,
                    totalPages: Math.ceil(filteredData.length / recordsPerPage),
                    onPageChange: setCurrentPage
                }}
            />
        </div>
    )
}

export default TableContainer

// // Exemple d'utilisation pour la page MyEvaluationsComponent
// const MyEvaluationsComponent = () => {
//     return (
//         <TableContainer
//             data={planGroupEvaluationData}
//             headers={["N°", "Label", "Type", "Date de création", "Statut", "Actions"]}
//             keys={["number", "label", "type", "creationDate", "status", "actions"]}
//             statusConfig={statusConfig}
//             actions={tableActions}
//             onAdd={() => console.log("Nouveau")}
//         />
//     )
// }

// // Exemple pour une autre page avec des données différentes
// const Users = () => {
//     return (
//         <TableContainer
//             data={usersData}
//             headers={["ID", "Nom", "Email", "Rôle", "Actions"]}
//             keys={["id", "name", "email", "role", "actions"]}
//             actions={userActions}
//             recordsPerPage={10}
//         />
//     )
// }