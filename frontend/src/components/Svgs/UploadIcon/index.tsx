import React from "react";

interface UploadIconProps {
    color?: string; // Couleur du SVG
    width?: number | string; // Largeur du SVG
    height?: number | string; // Hauteur du SVG
    strokeWidth?: number; // Épaisseur du trait
    className?: string; // Classe CSS supplémentaire
}

const UploadIcon: React.FC<UploadIconProps> = ({
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
                d="M10.0788 6.86203L12.6388 4.30203L15.1988 6.86203M12.6388 14.542V4.37203M4.75879 12.362C4.75879 16.782 7.75879 20.362 12.7588 20.362C17.7588 20.362 20.7588 16.782 20.7588 12.362"
                stroke={color} // Couleur personnalisable
                strokeWidth={strokeWidth} // Épaisseur du trait personnalisable
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default UploadIcon;