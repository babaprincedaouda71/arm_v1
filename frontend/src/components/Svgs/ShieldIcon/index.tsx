import React from "react";

interface ShieldIconProps {
    width?: number | string; // Largeur du SVG
    height?: number | string; // Hauteur du SVG
    className?: string; // Classe CSS supplémentaire
}

const ShieldIcon: React.FC<ShieldIconProps> = ({
                                                   width = 100,
                                                   height = 100,
                                                   className = "lg:h-36 lg:w-36",
                                               }) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className} // Permet d'ajouter des classes CSS personnalisées
        >
            <path
                d="M50.0003 37.5007V58.334M49.9774 70.834H50.0148M50.0003 89.209H24.7503C10.292 89.209 4.25029 78.8756 11.2503 66.2506L24.2503 42.834L36.5003 20.834C43.917 7.45898 56.0836 7.45898 63.5003 20.834L88.7503 66.2923C95.7503 78.9173 89.667 89.2506 75.2503 89.2506H50.0003V89.209Z"
                stroke="url(#paint0_linear_4268_13135)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_4268_13135"
                    x1="49.9967"
                    y1="10.8027"
                    x2="49.9967"
                    y2="89.2506"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#08A710"/>
                    {/* Couleur de départ du dégradé */}
                    <stop offset="1" stopColor="#00C80A"/>
                    {/* Couleur de fin du dégradé */}
                </linearGradient>
            </defs>
        </svg>
    );
};

export default ShieldIcon;