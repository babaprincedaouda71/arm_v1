import * as React from "react";

interface Icon {
  width?: string;
  height?: string;
  className?: string;
  color?: string;
}

const ChevronUp = ({
  width = "12",
  height = "8",
  className = "",
  color = "#ffff",
}: Icon) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 8 5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1 3.66667L3.93213 1L7 3.66667" stroke={color} />
    </svg>
  );
};

export default ChevronUp;

