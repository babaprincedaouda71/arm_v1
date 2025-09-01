import React from "react";

interface ChartIconProps {
    width?: number | string; // Largeur du SVG
    height?: number | string; // Hauteur du SVG
    className?: string; // Classe CSS supplémentaire
}

const ChartIcon: React.FC<ChartIconProps> = ({
                                                 width = 15,
                                                 height = 16,
                                                 className = "",
                                             }) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 15 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className} // Permet d'ajouter des classes CSS personnalisées
        >
            <path
                d="M5.86713 13.4746V10.933M5.86713 13.4746L5.8678 10.9685C5.86781 10.9566 5.86758 10.9448 5.86713 10.933M5.86713 13.4746L3.50365 13.4746C3.18112 13.4746 2.91965 13.1478 2.91965 12.7446V10.9683C2.91965 10.5651 3.18112 10.2383 3.50365 10.2383H5.2838C5.59688 10.2383 5.85241 10.5462 5.86713 10.933M5.86713 13.4746L8.81548 13.4746M5.86713 10.933V7.52754C5.86713 7.12437 6.1286 6.79754 6.45113 6.79754H8.23148C8.55401 6.79754 8.81548 7.12437 8.81548 7.52754M8.81548 13.4746V7.52754M8.81548 13.4746L11.0956 13.4746C11.4182 13.4746 11.6796 13.1478 11.6796 12.7446L11.6796 3.25461C11.6796 2.85144 11.4182 2.52461 11.0956 2.52461H9.39948C9.07694 2.52461 8.81548 2.85144 8.81548 3.25461L8.81548 7.52754M1.45965 13.4746H13.1396"
                stroke="url(#paint0_linear_4159_10778)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_4159_10778"
                    x1="13.1396"
                    y1="7.9758"
                    x2="1.50181"
                    y2="8.70051"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#5051C3"/>
                    {/* Couleur de départ du dégradé */}
                    <stop offset="1" stopColor="#9178F1"/>
                    {/* Couleur de fin du dégradé */}
                </linearGradient>
            </defs>
        </svg>
    );
};

export default ChartIcon;