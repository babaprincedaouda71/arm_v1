import React from "react";

interface DownloadIconProps {
    color?: string; // Couleur du SVG
    width?: number | string; // Largeur du SVG
    height?: number | string; // Hauteur du SVG
    strokeWidth?: number; // Épaisseur du trait
    className?: string; // Classe CSS supplémentaire
}

const DownloadIcon: React.FC<DownloadIconProps> = ({
    color = "#475569",
    width = 25,
    height = 25,
    strokeWidth = 1.5,
    className = "",
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className} // Permet d'ajouter des classes CSS personnalisées
        >
            <path
                d="M9.83758 12.042L12.3976 14.602L14.9576 12.042M12.3976 4.36203V14.532M20.5176 12.542C20.5176 16.962 17.5176 20.542 12.5176 20.542C7.51758 20.542 4.51758 16.962 4.51758 12.542"
                stroke={color} // Couleur personnalisable
                strokeWidth={strokeWidth} // Épaisseur du trait personnalisable
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default DownloadIcon;