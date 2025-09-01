// src/hooks/users/useTableSelection.ts

import {useCallback, useState} from 'react';

interface UseTableSelectionResult {
    selectedRows: Record<string, boolean>;
    handleRowSelection: (rowId: number, isSelected: boolean) => void;
    isRowSelected: (rowId: number) => boolean;
    clearSelection: () => void;
}

export const useTableSelection = (): UseTableSelectionResult => {
    const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

    const handleRowSelection = useCallback(
        (rowId: number, isSelected: boolean) => {
            setSelectedRows((prev) => ({...prev, [rowId]: isSelected}));
        },
        []
    );

    const isRowSelected = useCallback(
        (rowId: number): boolean => !!selectedRows[rowId],
        [selectedRows]
    );

    const clearSelection = useCallback(() => {
        setSelectedRows({});
    }, []);

    return {
        selectedRows,
        handleRowSelection,
        isRowSelected,
        clearSelection,
    };
};