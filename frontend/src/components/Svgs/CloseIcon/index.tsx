import React from "react";

interface CloseIconProps {
  color?: string; // Couleur du SVG
  width?: number | string; // Largeur du SVG
  height?: number | string; // Hauteur du SVG
  strokeWidth?: number; // Épaisseur du trait
  className?: string; // Classe CSS supplémentaire
}

const CloseIcon: React.FC<CloseIconProps> = ({
  color = "#F14848",
  width = 21,
  height = 21,
  strokeWidth = 2,
  className = "",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className} // Permet d'ajouter des classes CSS personnalisées
    >
      <path
        d="M17.0169 3.84082L3.68359 17.1742M17.0169 17.1742L3.68359 3.84082"
        stroke={color} // Couleur personnalisable
        strokeWidth={strokeWidth} // Épaisseur du trait personnalisable
        strokeLinecap="round"
      />
    </svg>
  );
};

export default CloseIcon;