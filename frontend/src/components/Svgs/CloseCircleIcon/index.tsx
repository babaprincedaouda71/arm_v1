import React from "react";

interface CloseCircleIconProps {
    color?: string; // Couleur du SVG
    fillOpacity?: number; // Opacité du remplissage
    width?: number | string; // Largeur du SVG
    height?: number | string; // Hauteur du SVG
    className?: string; // Classe CSS supplémentaire
}

const CloseCircleIcon: React.FC<CloseCircleIconProps> = ({
                                                             color = "#DB2525",
                                                             fillOpacity = 0.5,
                                                             width = 24,
                                                             height = 24,
                                                             className = "",
                                                         }) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className} // Permet d'ajouter des classes CSS personnalisées
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24ZM7.38946 5.97525C6.99894 5.58472 6.36577 5.58472 5.97525 5.97525C5.58472 6.36577 5.58472 6.99894 5.97525 7.38946L10.727 12.1412L5.97525 16.8929C5.58472 17.2834 5.58472 17.9166 5.97525 18.3071C6.36577 18.6976 6.99894 18.6976 7.38946 18.3071L12.1412 13.5554L16.8929 18.3071C17.2834 18.6976 17.9166 18.6976 18.3071 18.3071C18.6976 17.9166 18.6976 17.2834 18.3071 16.8929L13.5554 12.1412L18.3071 7.38946C18.6976 6.99894 18.6976 6.36577 18.3071 5.97525C17.9166 5.58472 17.2834 5.58472 16.8929 5.97525L12.1412 10.727L7.38946 5.97525Z"
                fill={color} // Couleur personnalisable
                fillOpacity={fillOpacity} // Opacité personnalisable
            />
        </svg>
    );
};

export default CloseCircleIcon;