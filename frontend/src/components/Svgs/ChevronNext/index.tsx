

import * as React from "react";

interface Icon {
  width?: string;
  height?: string;
  color?: string;
  strokeWidth?: number;
  className?: string;
  onClick?: () => void;
}

const ChevronNext = ({
  width = "8",
  height = "14",
  color = "#0B41A8",
  strokeWidth = 1.5,
  className = "",
  onClick,
}: Icon) => {
  return (
    <svg
      onClick={onClick}
      className={className}
      width={width}
      height={height}
      viewBox="0 0 8 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 11.5L6 6.5L1.5 1.5"
        stroke={color}
        strokeWidth={`${strokeWidth}`}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ChevronNext;
