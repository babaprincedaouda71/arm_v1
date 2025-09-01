// utils/sortUtils.ts

export const handleSort = <T extends Record<string, any>>(
    data: T[],
    order: "asc" | "desc",
    columnKey: string
): T[] => {
    return [...data].sort((a, b) => {
        const aValue = a[columnKey];
        const bValue = b[columnKey];

        // Si les valeurs sont nulles ou undefined
        if (!aValue && !bValue) return 0;
        if (!aValue) return order === "asc" ? 1 : -1;
        if (!bValue) return order === "asc" ? -1 : 1;


        // Pour les autres chaînes de caractères
        return order === "asc"
            ? String(aValue).localeCompare(String(bValue))
            : String(bValue).localeCompare(String(aValue));
    });
};