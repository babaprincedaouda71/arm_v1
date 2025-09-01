import React from "react";
import ChevronDown from "../../Svgs/ChevronDown";
import ChevronUp from "../../Svgs/ChevronUp";
import {TableHeadProps} from "@/types/Table.types";

interface ExtendedTableHeadProps extends TableHeadProps {
    headerRenderers?: {
        [key: string]: () => React.ReactNode;
    };
}

const TableHead: React.FC<ExtendedTableHeadProps> = ({
                                                         cols,
                                                         sortableCols,
                                                         sort,
                                                         onSort,
                                                         sortColumn,
                                                         headerRenderers,
                                                     }) => {

    const handleClick = (col: string) => {
        if (!sortableCols.includes(col)) return;
        // On inverse l'ordre actuel
        onSort(col, sort === "asc" ? "desc" : "asc");
    };

    const renderHeaderContent = (item: string) => {
        // Si un renderer personnalisé existe pour cette colonne, l'utiliser
        if (headerRenderers && headerRenderers[item]) {
            return headerRenderers[item]();
        }
        // Sinon, afficher le texte normal
        return item;
    };

    return (
        <thead className="text-white font-tHead text-xs md:text-sm lg:text-base">
        <tr className="font-bold text-lightBlack text-center">
            {cols.map((item, index) => (
                <th
                    key={item}
                    scope="row"
                    className={`pb-[18px] px-6 pt-[30px] font-[600] bg-gradient-to-b from-[#5051C3] to-[#9178F1] ${
                        index === 0 ? "rounded-tl-lg" : ""
                    } ${index === cols.length - 1 ? "rounded-tr-lg" : ""} ${
                        sortableCols.includes(item) ? "cursor-pointer" : ""
                    }`}
                    onClick={() => handleClick(item)}
                >
                    <div className="flex justify-center items-center h-full">
                        {sortableCols.includes(item) && item === sortColumn && (
                            <span className="mr-[10px]" data-testid="sort-icon">
                  {sort === "desc" ? <ChevronDown/> : <ChevronUp/>}
                </span>
                        )}
                        {renderHeaderContent(item)}
                    </div>
                </th>
            ))}
        </tr>
        </thead>
    );
};

export default TableHead;