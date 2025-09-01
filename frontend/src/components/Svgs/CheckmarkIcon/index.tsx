import React from "react";

interface CheckmarkIconProps {
  rectColor?: string; // Couleur du rectangle
  width?: number | string; // Largeur du SVG
  height?: number | string; // Hauteur du SVG
  className?: string; // Classe CSS supplémentaire
}

const CheckmarkIcon: React.FC<CheckmarkIconProps> = ({
  rectColor = "white",
  width = 50,
  height = 50,
  className = "w-[48px] h-[48px] md:w-[50px] md:h-[50px]",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 41"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className} // Permet d'ajouter des classes CSS personnalisées
    >
      {/* Rectangle blanc avec coins arrondis */}
      <rect
        x="10.8018"
        y="11.7671"
        width="18"
        height="18"
        rx="2"
        fill={rectColor} // Couleur du rectangle personnalisable
      />
      {/* Icône de checkmark avec dégradé */}
      <path
        d="M17.8018 25.1671L13.8018 21.1671L15.2018 19.7671L17.8018 22.3671L24.4018 15.7671L25.8018 17.1671L17.8018 25.1671Z"
        fill="url(#paint0_linear_4159_10943)"
      />
      {/* Définition du dégradé */}
      <defs>
        <linearGradient
          id="paint0_linear_4159_10943"
          x1="19.8279"
          y1="15.7671"
          x2="19.3988"
          y2="25.1499"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#5051C3" /> {/* Couleur de départ du dégradé */}
          <stop offset="1" stopColor="#9178F1" /> {/* Couleur de fin du dégradé */}
        </linearGradient>
      </defs>
    </svg>
  );
};

export default CheckmarkIcon;