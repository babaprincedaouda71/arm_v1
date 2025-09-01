import {useCallback, useEffect, useMemo, useState} from "react";

const useTable = <T, >(
    initialData: T[] | undefined,
    headers: string[],
    keys: string[],
    recordsPerPage?: number,
    defaultVisibleColumns?: string[] // Nouveau paramètre pour les colonnes par défaut
) => {
    const [data, setData] = useState<T[]>(initialData || []);
    const [currentPage, setCurrentPage] = useState(1);
    const [visibleColumns, setVisibleColumns] = useState(defaultVisibleColumns ? defaultVisibleColumns : headers);

    // Mettre à jour data uniquement si initialData change
    useEffect(() => {
        setData(initialData || []);
    }, [initialData]);

    // Ajout d'un effet pour vérifier si la page courante est devenue vide
    useEffect(() => {
        // Calcul des pages totales basé sur les données actuelles
        const calculatedTotalPages = Math.ceil(data.length / recordsPerPage);

        // Si nous sommes sur une page qui n'existe plus et ce n'est pas la page 1
        if (currentPage > calculatedTotalPages && currentPage > 1) {
            // Revenir à la dernière page disponible ou à la page 1
            setCurrentPage(Math.max(1, calculatedTotalPages));
        }
    }, [data, currentPage, recordsPerPage]);

    const totalRecords = data.length;
    const totalPages = useMemo(
        () => Math.ceil(totalRecords / recordsPerPage),
        [totalRecords, recordsPerPage]
    );

    const paginatedData = useMemo(
        () => data.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage),
        [data, currentPage, recordsPerPage]
    );

    const handleSortData = useCallback(
        (column: string, order: "asc" | "desc", sortFunction: (data: T[], order: "asc" | "desc", key: string) => T[]) => {
            const columnKey = keys[headers.indexOf(column)];
            const sortedData = sortFunction(data, order, columnKey);
            setData(sortedData);
        },
        [data, headers, keys]
    );

    const sortableColumns = useMemo(
        () => headers.filter((header) => !["Actions", "Sélection"].includes(header)),
        [headers]
    );

    const toggleColumnVisibility = useCallback((column: string) => {
        setVisibleColumns((prev) =>
            prev.includes(column) ? prev.filter((col) => col !== column) : [...prev, column]
        );
    }, []);

    return {
        data,
        currentPage,
        totalPages,
        visibleColumns,
        setCurrentPage,
        handleSortData,
        toggleColumnVisibility,
        totalRecords,
        paginatedData,
        sortableColumns,
    };
};
export default useTable;