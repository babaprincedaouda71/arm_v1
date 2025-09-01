// Table.js : Tableau configurable (expansible ou non expansible)
import React, {useCallback, useMemo, useState} from "react";
import Pagination from "../../Pagination1";
import TableHead from "../TableHead1/index";
import Skeleton from "react-loading-skeleton";
import {TableProps} from "@/types/Table.types";
import TableBody from "../ExpandableTableBodyGPT";

const Table: React.FC<TableProps> = ({
                                         data,
                                         keys,
                                         headers,
                                         sortableCols,
                                         onSort,
                                         isPagination = true,
                                         pagination,
                                         totalRecords = 0,
                                         loading = false,
                                         visibleColumns,
                                         renderers,
                                         expandable = false, // Nouvelle prop pour gérer l'expansibilité
                                         expandableColumn,
                                         renderExpandedContent,
                                         onGroupAdd,
                                         onGroupEdit,
                                         onDuplicate
                                     }) => {
    const [sortColumn, setSortColumn] = useState<string>("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const visibleKeys = useMemo(
        () => keys.filter((key, index) => visibleColumns.includes(headers[index])),
        [keys, headers, visibleColumns]
    );

    const handleSort = useCallback(
        (column: string, order: "asc" | "desc") => {
            setSortColumn(column);
            setSortOrder(order);
            onSort(column, order);
        },
        [onSort]
    );

    return (
        <div className="relative bg-white">
            <div className="flex justify-center mx-auto rounded-b-[16px] px-3 bg-white overflow-x-auto">
                <div className="gap-y-2 md:gap-y-10 relative w-full overflow-initial">
                    <table className="w-full min-w-full text-sm text-center text-gray-500">
                        <TableHead
                            cols={headers.filter((header) => visibleColumns.includes(header))}
                            sortableCols={sortableCols}
                            onSort={handleSort}
                            sort={sortOrder}
                            sortColumn={sortColumn}
                        />

                        {!loading ? (
                            <TableBody
                                keys={visibleKeys}
                                data={data}
                                renderers={renderers}
                                expandable={expandable}
                                expandableColumn={expandableColumn}
                                renderExpandedContent={renderExpandedContent}
                                onGroupAdd={onGroupAdd}
                                onGroupEdit={onGroupEdit}
                                onDuplicate={onDuplicate}
                            />
                        ) : (
                            <tbody>
                            <tr>
                                <td colSpan={visibleKeys.length}>
                                    <Skeleton count={10} height="65px"/>
                                </td>
                            </tr>
                            </tbody>
                        )}
                    </table>

                    {isPagination && pagination && (
                        <div className="flex justify-between mt-[32px] mb-[20px] mx-[15px]">
                            <div className="w-[10%]">
                                <p className="text-[#313D48]">
                                    {totalRecords > 0
                                        ? `Affichage de 1 à ${totalRecords} résultats`
                                        : "Aucun résultat trouvé"}
                                </p>
                            </div>
                            {totalRecords > 0 && <Pagination {...pagination} />}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Table;