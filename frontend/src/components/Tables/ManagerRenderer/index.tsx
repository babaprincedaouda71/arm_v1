import React, {useCallback, useState} from "react";
import {ManagerRendererProps} from "@/types/Table.types";
import {mutate} from "swr";
import {ConfirmModal} from "@/components/Tables/ConfirmModal";

interface ManagerConfig {
    label?: string;
    color?: string;
    backgroundColor?: string;
    showDot?: boolean;
    icon?: React.ReactNode;
    pill?: {
        value: number;
        show: boolean;
    };
}

interface RowData {
    id: string | number;
    manager: string; // Nom affiché du manager actuel
    managerId?: number | null; // ID du manager actuel (peut être null)
    [key: string]: any; // Autres propriétés de la ligne
}

interface EnhancedManagerRendererProps extends ManagerRendererProps {
    row?: RowData; // Objet contenant les données de la ligne
    managerOptions?: { value: number; label: string }[]; // Liste des managers potentiels { id, "Prénom Nom" }
    apiUrl?: string; // URL pour la mise à jour du manager
}

const ManagerRenderer: React.FC<EnhancedManagerRendererProps> = ({
                                                                     value: currentManagerName, // Le nom du manager actuel affiché
                                                                     row,
                                                                     managerOptions = [],
                                                                     apiUrl = "http://localhost:8888/api/users/update-manager",
                                                                 }) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [selectedManagerId, setSelectedManagerId] = useState<number | null>(null);
    const [selectedManagerName, setSelectedManagerName] = useState<string | null>(currentManagerName || "Pas défini");


    const updateManager = useCallback(async (newManagerId: number, newManagerName: string) => {
        const currentManagerId = row?.managerId;
        if (newManagerId === currentManagerId) {
            setIsMenuOpen(false);
            return;
        }

        setSelectedManagerId(newManagerId);
        setSelectedManagerName(newManagerName);
        setIsConfirmationOpen(true);
    }, [row?.managerId]);

    const handleConfirmation = useCallback(async (confirmed: boolean) => {
        if (confirmed && selectedManagerId !== null && row?.id) {
            try {
                setIsUpdating(true);
                const response = await fetch(apiUrl, {
                    method: 'PUT',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: row.id,
                        managerId: selectedManagerId,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`Erreur lors de la mise à jour du manager: ${response.statusText}`);
                }

                // Rafraîchir les données avec SWR après mise à jour
                await mutate("http://localhost:8888/api/users/get/all");
                // Mise à jour locale du nom du manager après succès
                setSelectedManagerName(selectedManagerName);
            } catch (error) {
                console.error("Erreur lors de la mise à jour du manager:", error);
                // Optionnel : ajouter une notification d'erreur ici
            } finally {
                setIsUpdating(false);
                setIsMenuOpen(false);
            }
        }

        setIsConfirmationOpen(false);
        setSelectedManagerId(null);
        setSelectedManagerName(null);
    }, [selectedManagerId, row?.id, apiUrl, selectedManagerName]);

    const toggleMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="flex justify-center items-center relative">
            <div
                className="relative cursor-pointer"
                onClick={toggleMenu}
                role="button"
                aria-haspopup="true"
                aria-expanded={isMenuOpen}
            >
                <div
                    className={`py-[8px] px-[16px] rounded-lg font-medium ${isUpdating ? 'opacity-50' : ''}`}
                    style={{
                        backgroundColor: '#e0f2f7', // Couleur de fond différente
                        color: '#0d47a1', // Couleur du texte différente
                    }}
                >
                    {currentManagerName || "Pas défini"}
                </div>
            </div>

            {/* Menu déroulant pour sélectionner un nouveau manager */}
            {isMenuOpen && (
                <div className="absolute z-10 mt-2 bg-white border rounded-md shadow-lg top-full">
                    <ul className="py-1">
                        {managerOptions.map((manager) => (
                            <li
                                key={manager.value}
                                className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${manager.label === currentManagerName ? 'font-bold bg-gray-50' : ''}`}
                                onClick={() => updateManager(manager.value, manager.label)}
                                role="menuitem"
                            >
                                {manager.label}
                            </li>
                        ))}
                        {/* Option pour désélectionner le manager */}
                        {row?.managerId !== null && (
                            <li
                                className={`px-4 py-2 hover:bg-gray-100 cursor-pointer`}
                                onClick={() => updateManager(null, "Pas défini")}
                                role="menuitem"
                            >
                                <span className="text-gray-500">Pas de manager</span>
                            </li>
                        )}
                    </ul>
                </div>
            )}

            {/* Cliquer en dehors du menu pour le fermer */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 z-0"
                    onClick={() => setIsMenuOpen(false)}
                    role="presentation"
                />
            )}

            {/* Pop-up de confirmation */}
            <ConfirmModal
                isOpen={isConfirmationOpen}
                onClose={() => handleConfirmation(false)}
                onConfirm={() => handleConfirmation(true)}
                title="Changer le manager"
                message={`Êtes-vous sûr de vouloir assigner ${selectedManagerName} comme manager ?`}
            />
        </div>
    );
};

export default ManagerRenderer;