import React, {useCallback, useState} from "react";
import {GroupeRendererProps} from "@/types/Table.types";
import {mutate} from "swr";
import {ConfirmModal} from "@/components/Tables/ConfirmModal";

interface GroupeConfig {
    label: string;
    color: string;
    backgroundColor: string;
    showDot?: boolean;
    icon?: React.ReactNode;
    pill?: {
        value: number;
        show: boolean;
    };
}

interface RowData {
    id: string | number;

    [key: string]: any; // Autres propriétés de la ligne
}

interface EnhancedGroupeRendererProps extends GroupeRendererProps {
    row?: RowData; // Objet contenant les données de la ligne
    groupeOptions?: string[]; // Liste des statuts possibles
    apiUrl?: string; // URL pour la mise à jour du statut
}

const GroupeRenderer: React.FC<EnhancedGroupeRendererProps> = ({
                                                                   value,
                                                                   groupeConfig: groupConfig,
                                                                   row,
                                                                   groupeOptions = ["active", "inactive", "pending"],
                                                                   apiUrl = "http://localhost:8888/api/users/change-role",
                                                               }) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [selectedGroupe, setSelectedGroupe] = useState<string | null>(null);

    // Vérifiez si le rôle actuel est "Admin"
    const isAdmin = value === "Admin";

    const config: GroupeConfig = groupConfig[value] || {
        label: value,
        color: '#475569',
        backgroundColor: '#47556926',
    };

    const updateGroupe = useCallback(async (newRole: string) => {
        if (newRole === value || isAdmin) {
            setIsMenuOpen(false);
            return;
        }

        setSelectedGroupe(newRole);
        setIsConfirmationOpen(true);
    }, [value]);

    const handleConfirmation = useCallback(async (confirmed: boolean) => {
        if (confirmed && selectedGroupe && row?.id) {
            try {
                setIsUpdating(true);

                const response = await fetch(apiUrl, {
                    method: 'PUT',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: row.id,
                        role: selectedGroupe,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`Erreur lors de la mise à jour du statut: ${response.statusText}`);
                }

                // Rafraîchir les données avec SWR après mise à jour
                await mutate("http://localhost:8888/api/users/get/all");
            } catch (error) {
                console.error("Erreur lors de la mise à jour du rôle de l'utilisateur:", error);
                // Optionnel : ajouter une notification d'erreur ici
            } finally {
                setIsUpdating(false);
                setIsMenuOpen(false);
            }
        }

        setIsConfirmationOpen(false);
        setSelectedGroupe(null);
    }, [selectedGroupe, row?.id, apiUrl]);

    const toggleMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isAdmin) {
            alert("Le rôle Admin ne peut pas être modifié.");
        } else {
            setIsMenuOpen(!isMenuOpen);
        }
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
                    className={`flex items-center py-[8px] px-[16px] rounded-lg font-extrabold ${isUpdating ? 'opacity-50' : ''}`}
                    style={{
                        color: config.color,
                        backgroundColor: config.backgroundColor,
                    }}
                >
                    {config.showDot && (
                        <span
                            className="w-2 h-2 rounded-full mr-2"
                            style={{backgroundColor: config.color}}
                        />
                    )}
                    {config.icon && <span className="mr-2">{config.icon}</span>}
                    {config.label}
                    {isAdmin && ( // Afficher un indicateur si l'utilisateur est un Admin
                        <span className="ml-2 text-sm text-gray-500">(Non modifiable)</span>
                    )}
                </div>
                {config.pill?.show && (
                    <div className="absolute -top-0 -right-2 bg-red text-white text-xs p-0.5 rounded-full">
                        {config.pill.value}
                    </div>
                )}
            </div>

            {/* Menu déroulant pour sélectionner un nouveau statut */}
            {isMenuOpen && !isAdmin && (
                <div className="absolute z-10 mt-2 bg-white border rounded-md shadow-lg top-full">
                    <ul className="py-1">
                        {groupeOptions.map((groupe) => (
                            <li
                                key={groupe}
                                className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${groupe === value ? 'font-bold bg-gray-50' : ''}`}
                                onClick={() => updateGroupe(groupe)}
                                role="menuitem"
                            >
                                {groupConfig[groupe]?.label || groupe}
                            </li>
                        ))}
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
                title="Confirmer le changement de rôle"
                message="Êtes-vous sûr de vouloir changer le rôle de cet utilisateur ?"
            />
        </div>
    );
};

export default GroupeRenderer;