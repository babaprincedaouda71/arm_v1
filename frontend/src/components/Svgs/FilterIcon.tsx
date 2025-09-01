
import * as React from "react";

interface Icon {
  width?: string;
  height?: string;
  className?: string;
  color?: string;
}

const FilterIcon = ({
  width = "20",
  height = "21",
//   className = "ml-[5px]",
//   color = "#161D4A",
}: Icon) => {
  return (
    <svg
            width={width}
            height={height}
            viewBox="0 0 24 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.4515 1.14746H1.30396L9.76299 11.1503V18.0655L13.9925 20.1803V11.1503L22.4515 1.14746Z"
              stroke="#100E07"
              strokeWidth="1.30139"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
  
  );
};

export default FilterIcon;