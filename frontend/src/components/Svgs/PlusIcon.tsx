import * as React from "react";

interface Icon {
  width?: string;
  height?: string;
  className?: string;
  color?: string;
}

const PlusIcon = ({
  width = "20",
  height = "21",
  className = "text-white font-bold w-8 h-8 sm:h-6 sm:w-6",
  color = "#FFFFFF", // Par défaut, couleur blanche
}: Icon) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M10.5009 5.59229V15.7341M15.5718 10.6632L5.42993 10.6632"
        stroke={color} // Utilisation de la prop color
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default PlusIcon;
