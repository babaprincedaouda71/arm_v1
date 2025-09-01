import React, {useMemo, useState} from "react";
import Pagination from "../../Pagination1";
import TableBody from "../TableBody1";
import TableHead from "../TableHead1/index";
import Skeleton from "react-loading-skeleton";
import {TableProps} from "../../../types/Table.types";

interface ExtendedTableProps extends TableProps {
    headerRenderers?: {
        [key: string]: () => React.ReactNode;
    };
}

const Table: React.FC<ExtendedTableProps> = ({
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
                                                 headerRenderers,
                                             }) => {

    const [sortColumn, setSortColumn] = useState<string>("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const visibleKeys = useMemo(
        () => keys.filter((key, index) => visibleColumns.includes(headers[index])),
        [keys, headers, visibleColumns]
    );

    const handleSort = (column: string, order: "asc" | "desc") => {
        // On met à jour la colonne de tri
        setSortColumn(column);
        // On met à jour l'ordre de tri
        setSortOrder(order);
        // On appelle la fonction de tri parent
        onSort(column, order);
    };

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
                            headerRenderers={headerRenderers}
                        />

                        {!loading ? (
                            <TableBody keys={visibleKeys} data={data} renderers={renderers}/>
                        ) : (
                            <Skeleton count={10} width="100%" height="65px"/>
                        )}
                    </table>

                    {isPagination && pagination && (
                        <div className="flex justify-between mt-[32px] mb-[20px] mx-[15px]">
                            <div className="w-[10%]">
                                <p className="text-[#313D48]">{`Affichage de 1 à ${totalRecords} résultats`}</p>
                            </div>
                            <Pagination {...pagination} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Table;