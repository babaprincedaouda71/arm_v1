import React, {useMemo} from "react";
import Pagination from "../../Pagination1";
import TableBody from "../TableBodyE";
import TableHead from "../TableHead1/index";
import Skeleton from "react-loading-skeleton";
import {TableProps} from "../../../types/Table.types";

const TableE: React.FC<TableProps> = ({
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
                                      }) => {

    const visibleKeys = useMemo(
        () => keys.filter((key, index) => visibleColumns.includes(headers[index])),
        [keys, headers, visibleColumns]
    );

    return (
        <div className="relative bg-white">
            <div className="flex justify-center mx-auto rounded-b-[16px] px-3 bg-white overflow-x-auto">
                <div className="gap-y-2 md:gap-y-10 relative pb-[5%] w-full overflow-initial">
                    <table className="w-full min-w-full text-sm text-center text-gray-500">
                        <TableHead
                            cols={headers.filter((header) => visibleColumns.includes(header))}
                            sortableCols={sortableCols}
                            onSort={onSort}
                            sort={"asc"} sortColumn={""}/>

                        {!loading ? (
                            <TableBody keys={visibleKeys} data={data} renderers={renderers} expandableColumn={"noGroup"}
                                       renderExpandedContent={undefined} onGroupAdd={undefined}/>
                        ) : (
                            <Skeleton count={10} width="100%" height="65px"/>
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

export default TableE;