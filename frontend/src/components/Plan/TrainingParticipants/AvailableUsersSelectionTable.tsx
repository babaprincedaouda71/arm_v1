import React from 'react';
import Table from '@/components/Tables/Table';
import { UserProps } from '@/types/dataTypes';

interface AvailableUsersSelectionTableProps {
    users: UserProps[];
    selectedUsers: Set<string>;
    onUserSelection: (userId: string, selected: boolean) => void;
    onAddSelected: () => void;
    isSubmitting: boolean;
    tableConfig: {
        headers: string[];
        keys: string[];
        recordsPerPage: number;
    };
}

const AvailableUsersSelectionTable: React.FC<AvailableUsersSelectionTableProps> = ({
                                                                                       users,
                                                                                       selectedUsers,
                                                                                       onUserSelection,
                                                                                       onAddSelected,
                                                                                       isSubmitting,
                                                                                       tableConfig
                                                                                   }) => {
    const renderers = {
        selection: (_: string, row: UserProps) => (
            <div className="flex justify-center items-center">
                <input
                    type="checkbox"
                    className="h-5 w-5 accent-primary"
                    checked={selectedUsers.has(row.id.toString())}
                    onChange={(e) => onUserSelection(row.id.toString(), e.target.checked)}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Sélectionner ${row.firstName + ' ' + row.lastName}`}
                />
            </div>
        ),
    };

    return (
        <div className="mt-10">
            <h3 className="text-lg font-semibold mb-4">Sélectionner les participants</h3>
            <Table
                data={users}
                keys={tableConfig.keys}
                headers={tableConfig.headers}
                sortableCols={tableConfig.headers.filter(h => !["Actions", "Sélection"].includes(h))}
                onSort={() => {}} // Géré par le hook useTable
                isPagination={false}
                visibleColumns={tableConfig.headers}
                renderers={renderers}
                loading={false}
            />
            <div className="text-right text-xs md:text-sm lg:text-base mt-2">
                <button
                    type="button"
                    className="bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd hover:bg-indigo-700 text-white font-bold p-2 md:p-3 lg:p-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={onAddSelected}
                    disabled={selectedUsers.size === 0 || isSubmitting}
                >
                    {isSubmitting ? 'Ajout En Cours...' : `Ajouter à la liste (${selectedUsers.size})`}
                </button>
            </div>
        </div>
    );
};

export default AvailableUsersSelectionTable;