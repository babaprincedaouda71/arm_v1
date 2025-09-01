import * as React from "react";

interface Icon {
  width?: string;
  height?: string;
  className?: string;
  color?: string; // Optionnel si vous souhaitez une couleur configurable
}

const ViewIcon = ({
  width = "21",
  height = "21",
  color = "#475569", // Valeur par défaut
  className = "",
}: Icon) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }} // Application de la couleur ici
    >
      <g id="File Eye 3">
        <path
          id="Icon"
          d="M9.30176 18.4481H4.30175C3.19718 18.4481 2.30175 17.5526 2.30176 16.4481L2.30184 4.44811C2.30184 3.34354 3.19727 2.44812 4.30183 2.44812H13.3021C14.4066 2.44812 15.3021 3.34355 15.3021 4.44812V8.44812M14.8018 14.9056V14.853M5.80207 6.44812H11.8021M5.80207 9.44812H11.8021M5.80207 12.4481H8.80207M18.3018 14.9481C18.3018 14.9481 17.4716 17.3978 14.8018 17.3551C12.1319 17.3123 11.3018 14.9481 11.3018 14.9481C11.3018 14.9481 12.0982 12.4556 14.8018 12.4556C17.5053 12.4556 18.3018 14.9481 18.3018 14.9481Z"
        />
      </g>
    </svg>
  );
};

export default ViewIcon;
