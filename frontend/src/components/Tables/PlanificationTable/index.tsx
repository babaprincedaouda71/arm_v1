import React, { useState } from "react";
import Pagination from "../../Pagination";
import TableBody from "../TableBody";
import TableHead from "../TableHead";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";

const Table = ({
  data,
  keys,
  headers,
  sort,
  sortable,
  onSort,
  isPagination = true,
  pagination,
  totalRecords,
  loading,
}) => {
  const [visibleColumns, setVisibleColumns] = useState(headers);


  return (
    <div className="relative bg-white">

      {/* Tableau */}
      <div className="flex justify-center mx-auto rounded-b-[16px] px-3 bg-white overflow-x-auto">
        <div className="gap-y-2 md:gap-y-10 relative pb-[10%] w-full overflow-initial  ">
          <table className="w-full min-w-[600px] text-sm text-center text-gray-500  ">
            <TableHead
              cols={headers.filter((header) => visibleColumns.includes(header))}
              sortableCols={[
                "Nom Complet",
                "Groupe",
                "Date de création",
                "Statut",
              ]} // Seules ces colonnes sont triables
              onSort={(col, order) =>
                console.log("Trier par :", col, "Ordre :", order)
              }
            />

            {!loading && (
              <TableBody
                keys={keys.filter((key, index) =>
                  visibleColumns.includes(headers[index])
                )}
                data={data}
              />
            )}
          </table>
          {loading && (
            <div className="w-full">
              <Skeleton count={10} width="100%" height="65px" />
            </div>
          )}
          {isPagination && pagination && (
            <div className="flex justify-between mt-[32px] mb-[20px] mx-[15px]">
              <div className="w-[10%]">
                <p className="text-[#313D48] text-[14px]">{`${totalRecords} Total`}</p>
              </div>
              <Pagination
                currentPage={pagination.currentPage}
                pageDetails={{ ...pagination.pageDetails }}
                setCurrentPage={pagination.setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Table;
