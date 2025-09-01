import * as React from "react";

interface Icon {
  width?: string; 
  height?: string; 
  color?: string; 
  strokeWidth?: number; 
  className?: string; 
  onClick?: () => void; 
}

const ChevronBack = ({
  width = "8",
  height = "14",
  color = "#0B41A8",
  strokeWidth = 1.5,
  className = "",
  onClick,
}: Icon) => {
  return (
    <svg
      className={className}
      onClick={onClick}
      width={width}
      height={height}
      viewBox="0 0 8 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.00038 1L1.46191 7L7.00038 13"
        stroke={color}
        strokeWidth={`${strokeWidth}`}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ChevronBack;
