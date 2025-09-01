import React from "react";
import { TableBodyProps } from "../../../types/Table.types";

const TableBody: React.FC<TableBodyProps> = ({ data, keys, renderers }) => {
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
        data.map((item, idx) => (
          <tr
            key={idx}
            className={`even:bg-white odd:bg-[#F7F7FF] font-title font-medium`}
          >
            {keys.map((key) => (
              <td
                key={key}
                scope="row"
                className="py-[28px] px-6 justify-center items-center text-center cursor-pointer"
              >
                {renderers && renderers[key]
                  ? renderers[key](item[key], item)
                  : item[key]}
              </td>
            ))}
          </tr>
        ))
      )}
    </tbody>
  );
};

export default TableBody;