// Composant pour afficher un champ PDF avec bouton "Visualiser"
import React from "react";
import {FiEye} from "react-icons/fi";

interface PDFFieldProps {
    label: string;
    fileName?: string;
    onView: () => void;
    isLoading?: boolean;
}

const PDFField: React.FC<PDFFieldProps> = ({label, fileName, onView, isLoading = false}) => {
    const handleViewClick = (e: React.MouseEvent) => {
        console.log('PDF view clicked'); // Debug
        e.preventDefault();
        e.stopPropagation();
        onView();
    };

    return (
        <div
            className="flex items-center w-full font-tHead text-formInputTextColor font-semibold text-xs md:text-sm lg:text-base">
            <label className="flex-[1] block break-words pt-2">
                {label}
            </label>
            <div className="flex-[4] flex items-center space-x-3 h-[48px] px-5 bg-inputBgColor rounded-md">
                {fileName ? (
                    <>
                        <span className="text-sm text-gray-600 truncate flex-1">
                            {fileName}
                        </span>
                        <button
                            type="button"
                            onClick={handleViewClick}
                            disabled={isLoading}
                            className="flex items-center space-x-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white text-sm rounded-lg transition-colors"
                        >
                            <FiEye size={16}/>
                            <span>{isLoading ? 'Chargement...' : 'Visualiser'}</span>
                        </button>
                    </>
                ) : (
                    <span className="text-sm text-gray-400 italic">Aucun fichier</span>
                )}
            </div>
        </div>
    );
};
export default PDFField;