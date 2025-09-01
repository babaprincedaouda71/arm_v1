// // SelectableTable.tsx - Composant table réutilisable avec gestion des sélections
// import React, { useState, useCallback, useMemo } from "react";
// import { TableProps } from "@/types/Table.types";
// import Pagination from "@/components/Pagination";
//
// interface SelectableTableProps<T = any> extends Omit<TableProps, 'renderers'> {
//     // Props spécifiques à la sélection
//     selectable?: boolean;
//     selectedIds?: Set<string | number>;
//     onSelectionChange?: (selectedIds: Set<string | number>) => void;
//     getItemId?: (item: T) => string | number;
//     selectAllLabel?: string;
//
//     // Renderers normaux (sans selection qui est géré automatiquement)
//     renderers?: { [key: string]: (value: any, row: T) => React.ReactNode };
// }
//
// const SelectableTable = <T extends Record<string, any>>({
//                                                             data,
//                                                             keys,
//                                                             headers,
//                                                             sortableCols = [],
//                                                             onSort,
//                                                             isPagination = true,
//                                                             pagination,
//                                                             totalRecords = 0,
//                                                             loading = false,
//                                                             visibleColumns,
//                                                             renderers = {},
//
//                                                             // Props de sélection
//                                                             selectable = false,
//                                                             selectedIds = new Set(),
//                                                             onSelectionChange,
//                                                             getItemId = (item) => item.id,
//                                                             selectAllLabel = "Sélection",
//                                                         }: SelectableTableProps<T>) => {
//     const [sortColumn, setSortColumn] = useState<string>("");
//     const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
//
//     // Filtrer les colonnes visibles
//     const visibleKeys = useMemo(
//         () => keys.filter((key, TrainingDetailsPage) => visibleColumns.includes(headers[TrainingDetailsPage])),
//         [keys, headers, visibleColumns]
//     );
//
//     const visibleHeaders = useMemo(
//         () => headers.filter(header => visibleColumns.includes(header)),
//         [headers, visibleColumns]
//     );
//
//     const handleSort = useCallback(
//         (column: string, order: "asc" | "desc") => {
//             setSortColumn(column);
//             setSortOrder(order);
//             onSort?.(column, order);
//         },
//         [onSort]
//     );
//
//     // Gestion des sélections
//     const handleItemSelection = useCallback((itemId: string | number, isChecked: boolean) => {
//         if (!onSelectionChange) return;
//
//         const newSelectedIds = new Set(selectedIds);
//         if (isChecked) {
//             newSelectedIds.add(itemId);
//         } else {
//             newSelectedIds.delete(itemId);
//         }
//         onSelectionChange(newSelectedIds);
//     }, [selectedIds, onSelectionChange]);
//
//     const handleSelectAll = useCallback((isChecked: boolean) => {
//         if (!onSelectionChange) return;
//
//         if (isChecked) {
//             const allIds = data.map(item => getItemId(item));
//             onSelectionChange(new Set(allIds));
//         } else {
//             onSelectionChange(new Set());
//         }
//     }, [data, getItemId, onSelectionChange]);
//
//     // États pour "Tout sélectionner"
//     const areAllSelected = useMemo(() =>
//             data.length > 0 && data.every(item => selectedIds.has(getItemId(item))),
//         [data, selectedIds, getItemId]
//     );
//
//     const areSomeSelected = useMemo(() =>
//             data.some(item => selectedIds.has(getItemId(item))),
//         [data, selectedIds, getItemId]
//     );
//
//     // Renderer automatique pour la sélection
//     const selectionRenderer = useCallback((value: any, row: T) => (
//         <div className="flex justify-center items-center">
//             <input
//                 type="checkbox"
//                 className="h-5 w-5 accent-primary"
//                 checked={selectedIds.has(getItemId(row))}
//                 onChange={(e) => handleItemSelection(getItemId(row), e.target.checked)}
//                 aria-label={`Sélectionner ${row.name || row.title || 'cet élément'}`}
//             />
//         </div>
//     ), [selectedIds, getItemId, handleItemSelection]);
//
//     // Combiner les renderers avec celui de sélection si nécessaire
//     const finalRenderers = useMemo(() => {
//         if (!selectable) return renderers;
//
//         return {
//             ...renderers,
//             selection: selectionRenderer
//         };
//     }, [selectable, renderers, selectionRenderer]);
//
//     // Composant en-tête personnalisé
//     const CustomTableHead = () => (
//         <thead className="text-white font-tHead text-xs md:text-sm lg:text-base">
//         <tr className="font-bold text-lightBlack text-center">
//             {visibleHeaders.map((header, TrainingDetailsPage) => {
//                 const isSortable = sortableCols.includes(header);
//                 const isFirstColumn = TrainingDetailsPage === 0;
//                 const isLastColumn = TrainingDetailsPage === visibleHeaders.length - 1;
//
//                 return (
//                     <th
//                         key={header}
//                         scope="row"
//                         className={`pb-[18px] px-6 pt-[30px] font-[600] bg-gradient-to-b from-[#5051C3] to-[#9178F1] ${
//                             isFirstColumn ? "rounded-tl-lg" : ""
//                         } ${isLastColumn ? "rounded-tr-lg" : ""} ${
//                             isSortable ? "cursor-pointer" : ""
//                         }`}
//                         onClick={() => isSortable && handleSort(header, sortOrder === "asc" ? "desc" : "asc")}
//                     >
//                         <div className="flex justify-center items-center h-full">
//                             {/* Icône de tri */}
//                             {isSortable && header === sortColumn && (
//                                 <span className="mr-[10px]">
//                                         {sortOrder === "desc" ? "↓" : "↑"}
//                                     </span>
//                             )}
//
//                             {/* Contenu de l'en-tête */}
//                             {selectable && header === selectAllLabel ? (
//                                 <input
//                                     type="checkbox"
//                                     className="h-5 w-5 accent-primary"
//                                     checked={areAllSelected}
//                                     ref={(el) => {
//                                         if (el) el.indeterminate = areSomeSelected && !areAllSelected;
//                                     }}
//                                     onChange={(e) => handleSelectAll(e.target.checked)}
//                                     aria-label="Sélectionner tout"
//                                 />
//                             ) : (
//                                 header
//                             )}
//                         </div>
//                     </th>
//                 );
//             })}
//         </tr>
//         </thead>
//     );
//
//     return (
//         <div className="relative bg-white">
//             <div className="flex justify-center mx-auto rounded-b-[16px] px-3 bg-white overflow-x-auto">
//                 <div className="gap-y-2 md:gap-y-10 relative w-full overflow-initial">
//                     <table className="w-full min-w-full text-sm text-center text-gray-500">
//                         <CustomTableHead />
//
//                         {!loading ? (
//                             <tbody className="text-xs md:text-sm lg:text-base">
//                             {!data.length ? (
//                                 <tr>
//                                     <td colSpan={visibleKeys.length}>
//                                         <div className="w-full h-[250px] flex justify-center items-center">
//                                             <p className="text-gray">Aucun résultat trouvé</p>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 data.map((item, idx) => {
//                                     const isEven = idx % 2 === 0;
//                                     const baseBackgroundColor = isEven ? "bg-[#F7F7FF]" : "bg-white";
//
//                                     return (
//                                         <tr key={getItemId(item)} className={`${baseBackgroundColor} font-title font-medium`}>
//                                             {visibleKeys.map((key) => (
//                                                 <td
//                                                     key={key}
//                                                     scope="row"
//                                                     className="py-[28px] px-6 justify-center items-center text-center"
//                                                 >
//                                                     {finalRenderers[key]
//                                                         ? finalRenderers[key](item[key], item)
//                                                         : item[key]}
//                                                 </td>
//                                             ))}
//                                         </tr>
//                                     );
//                                 })
//                             )}
//                             </tbody>
//                         ) : (
//                             <tbody>
//                             <tr>
//                                 <td colSpan={visibleKeys.length}>
//                                     <div className="animate-pulse space-y-4 p-4">
//                                         {[...Array(5)].map((_, i) => (
//                                             <div key={i} className="h-16 bg-gray-200 rounded"></div>
//                                         ))}
//                                     </div>
//                                 </td>
//                             </tr>
//                             </tbody>
//                         )}
//                     </table>
//
//                     {isPagination && pagination && (
//                         <div className="flex justify-between mt-[32px] mb-[20px] mx-[15px]">
//                             <div className="w-[10%]">
//                                 <p className="text-[#313D48]">
//                                     {totalRecords > 0
//                                         ? `Affichage de 1 à ${totalRecords} résultats`
//                                         : "Aucun résultat trouvé"}
//                                 </p>
//                             </div>
//                             {totalRecords > 0 && <Pagination {...pagination} />}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default SelectableTable;