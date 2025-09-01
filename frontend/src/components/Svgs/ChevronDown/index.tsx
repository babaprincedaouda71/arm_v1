import * as React from "react";

interface Icon {
  color?: string;
  width?: string;
  height?: string;
  className?: string;
  onClick?: () => void;
}

const ChevronDown = ({
  color = "#ffff",
  width = "12",
  height = "8 ",
  className = "",
  onClick,
}: Icon) => {
  return (
    <svg
      className={className}
      onClick={onClick}
      width={width}
      height={height}
      viewBox="0 0 8 5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1 1.33333L3.93213 4L7 1.33333" stroke={color} />
    </svg>
  );
};
export default ChevronDown; 
