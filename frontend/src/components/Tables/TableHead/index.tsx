import React from "react";
import { Sort } from "../../enums";
import ChevronDown from "../../Svgs/ChevronDown";
import ChevronUp from "../../Svgs/ChevronUp";

const TableHead = ({ cols, sortableCols = [], sort = Sort.asc, onSort }) => {
  const handleClick = (col) => {
    if (!sortableCols.includes(col)) return; // Permet de n'appliquer le tri qu'aux colonnes sélectionnées.
    onSort(col, sort === Sort.asc ? Sort.desc : Sort.asc);
  };

  const getChevron = () => (sort === "desc" ? <ChevronUp /> : <ChevronDown />);

  return (
    <thead className="text-xs text-white font-tHead capitalize">
      <tr className="font-bold text-lightBlack text-center">
        {cols.map((item, index) => (
          <th
            scope="row"
            className={`pb-[18px] px-6 pt-[30px] font-[600] text-[14px] bg-gradient-to-b from-[#5051C3] to-[#9178F1] text-center align-middle ${
              index === 0 ? "rounded-tl-lg" : "" // Coin supérieur gauche
            } ${index === cols.length - 1 ? "rounded-tr-lg" : ""}`} // Coin supérieur droit
            key={item}
            onClick={() => handleClick(item)}
          >
            <div className="flex justify-center items-center h-full">
              {sortableCols.includes(item) && (
                <span className="mr-[10px]">{getChevron()}</span>
              )}
              <span>{item}</span>
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHead;
