// Fichier: DefaultButton.tsx (Corrigé)
import React from "react";

interface DefaultButtonProps {
    isDefault: boolean;
    onClick?: () => void; // La fonction onClick est optionnelle mais sera toujours attachée si fournie
}

const DefaultButton: React.FC<DefaultButtonProps> = ({isDefault, onClick}) => {
    const buttonClass = `px-3 py-1 text-sm rounded-md ${
        isDefault
            ? "bg-blue-100 text-blue-600" // Style quand l'élément EST par défaut
            : "bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer" // Style quand l'élément N'EST PAS par défaut mais cliquable
    }`;

    return (
        <button
            className={buttonClass}
            onClick={onClick} // Toujours attacher le gestionnaire onClick fourni
            disabled={!onClick} // Désactiver le bouton seulement si aucune fonction onClick n'est fournie
            // Ou vous pouvez le laisser toujours activé si une action est implicite.
            // Dans votre cas, il sera toujours cliquable pour devenir le défaut.
        >
            Par défaut
        </button>
    );
};

export default DefaultButton;