import * as React from "react";

interface Icon {
  width?: string;
  height?: string;
  className?: string;
  color?: string;
}

const SearchIcon = ({
  width = "20",
  height = "21",
  className = "absolute text-searchColor left-2 top-1/2 transform -translate-y-1/2",
  color = "#F8FAFC",
}: Icon) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle
        cx="12.4874"
        cy="12.4269"
        r="9.12414"
        stroke="#3E3E3E"
        strokeWidth="1.52263"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.8333 19.2466L22.4104 22.8145"
        stroke="#3E3E3E"
        strokeWidth="1.52263"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SearchIcon;
