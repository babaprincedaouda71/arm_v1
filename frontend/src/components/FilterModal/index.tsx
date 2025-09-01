// components/FilterModal.js
import React from "react";

const FilterModal = ({
                         show,
                         onClose,
                         headers,
                         visibleColumns,
                         toggleColumnVisibility,
                     }) => {
    if (!show) return null;

    // Filtrer les colonnes "Sélection" et "Actions"
    const filteredHeaders = headers.filter(header => !["Sélection", "Actions"].includes(header));

    return (
        <div
            className="absolute w-64 -top-0 right-10 bg-white text-textColor font-medium shadow-lg font-title rounded-lg p-4 z-10"
        >
            <ul className="max-h-96 overflow-y-auto"> {/* Ajoutez max-height et overflow-y ici */}
                {filteredHeaders.map((header, index) => (
                    <li key={index} className="flex items-center gap-3 p-3 mb-2">
                        <input
                            type="checkbox"
                            checked={visibleColumns.includes(header)}
                            onChange={() => toggleColumnVisibility(header)}
                            className="mr-2 h-6 w-6 border-2 border-gray-400 accent-primary"
                        />
                        <label>{header}</label>
                    </li>
                ))}
            </ul>
            <div className="flex justify-end">
                <button
                    onClick={onClose}
                    className="mt-4 px-4 py-1 bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd font-bold text-white rounded-xl"
                >
                    OK
                </button>
            </div>
        </div>
    );
};

export default FilterModal;