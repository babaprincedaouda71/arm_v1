import React, {useEffect, useRef} from "react";

interface FilterMenuProps {
    header: string;
    values: any[];
    isValueSelected: (header: string, value: any) => boolean;
    toggleFilterValue: (header: string, value: any) => void;
    selectAllValues: (header: string, select: boolean) => void;
    hasActiveFilter: boolean;
    onClose: () => void;
}

const FilterMenu: React.FC<FilterMenuProps> = ({
                                                   header,
                                                   values,
                                                   isValueSelected,
                                                   toggleFilterValue,
                                                   selectAllValues,
                                                   hasActiveFilter,
                                                   onClose,
                                               }) => {
    const menuRef = useRef<HTMLDivElement>(null);

    // Gérer la fermeture du menu lors d'un clic à l'extérieur
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    // Vérifier si tous les éléments sont sélectionnés
    const areAllSelected = values.every(value => isValueSelected(header, value));

    // Vérifier si aucun élément n'est sélectionné
    const areNoneSelected = values.every(value => !isValueSelected(header, value));

    return (
        <div
            ref={menuRef}
            className="absolute z-50 bg-white shadow-lg rounded-md p-4 min-w-[200px] max-h-[400px] overflow-y-auto"
            style={{top: "100%", left: 0}}
        >
            <div className="flex justify-between items-center mb-2 pb-2 border-b">
                <h3 className="font-semibold text-primary">Filtrer par {header}</h3>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                >
                    &times;
                </button>
            </div>

            {/* Checkbox "Sélectionner tout" */}
            <div className="mb-2 pb-2 border-b text-textColor">
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={areAllSelected}
                        onChange={() => selectAllValues(header, !areAllSelected)}
                        className="form-checkbox h-4 w-4 text-primary"
                    />
                    <span className="font-medium">Sélectionner tout</span>
                </label>
            </div>

            {/* Recherche (implémentation optionnelle) */}
            {values.length > 10 && (
                <div className="mb-2 pb-2 border-b">
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        className="w-full px-2 py-1 border rounded"
                        // Implémentation de recherche à ajouter selon vos besoins
                    />
                </div>
            )}

            {/* Liste des valeurs */}
            <div className="space-y-1 text-textColor">
                {values.map((value, index) => (
                    <label key={index} className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isValueSelected(header, value)}
                            onChange={() => toggleFilterValue(header, value)}
                            className="form-checkbox h-4 w-4 text-primary"
                        />
                        <span>{value === "" ? "(Vide)" : String(value)}</span>
                    </label>
                ))}
            </div>

            {/* Boutons d'action */}
            <div className="mt-4 pt-2 border-t flex justify-between">
                <button
                    onClick={() => selectAllValues(header, false)}
                    className="px-2 py-1 text-sm text-gray-600 hover:text-gray-800"
                    disabled={areNoneSelected}
                >
                    Effacer
                </button>
                <button
                    onClick={onClose}
                    className="px-3 py-1 text-sm bg-primary text-white rounded"
                >
                    Appliquer
                </button>
            </div>
        </div>
    );
};

export default FilterMenu;