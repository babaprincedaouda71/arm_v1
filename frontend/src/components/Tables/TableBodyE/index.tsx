import React, { useState } from "react";
import ExpandableRow from "../../ExpandableRow";
import { TableBodyProps } from "../../../types/Table.types";

const TableBodyE: React.FC<TableBodyProps> = ({
  data,
  keys,
  renderers,
  expandableColumn = "noGroup",
  renderExpandedContent,
  onGroupAdd,
}) => {
  // État pour suivre quelle ligne est étendue
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const handleRowClick = (index: number, key: string) => {
    if (key === expandableColumn) {
      setExpandedRow(expandedRow === index ? null : index);
    }
  };

  return (
    <tbody className="text-xs md:text-sm lg:text-base">
      {!data.length ? (
        <tr>
          <td colSpan={keys.length}>
            <div className="w-full h-[250px] flex justify-center items-center">
              <p className="text-gray">No Record Found</p>
            </div>
          </td>
        </tr>
      ) : (
        data.map((item, idx) => {
          const isEven = idx % 2 === 0;
          const baseBackgroundColor = isEven ? "bg-white" : "bg-[#F7F7FF]";

          return (
            <React.Fragment key={idx}>
              <tr className={`${baseBackgroundColor} font-title font-medium`}>
                {keys.map((key) => (
                  <td
                    key={key}
                    scope="row"
                    className="py-[28px] px-6 justify-center items-center text-center cursor-pointer"
                    onClick={() => handleRowClick(idx, key)}
                  >
                    {renderers && renderers[key]
                      ? renderers[key](item[key], item)
                      : item[key]}
                  </td>
                ))}
              </tr>
              {expandedRow === idx && (
                <tr className={baseBackgroundColor}>
                  <td colSpan={keys.length}>
                    {renderExpandedContent ? (
                      renderExpandedContent(item)
                    ) : (
                      <ExpandableRow
                        item={item}
                        onAddGroup={() => onGroupAdd?.(idx)}
                        isEven={isEven}
                      />
                    )}
                  </td>
                </tr>
              )}
            </React.Fragment>
          );
        })
      )}
    </tbody>
  );
};

export default TableBodyE;
