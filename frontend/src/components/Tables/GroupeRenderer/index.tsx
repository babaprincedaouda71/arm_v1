// src/components/Tables/GroupeRenderer/index.tsx - Version finale

import React, {useCallback, useState} from "react";
import {GroupeRendererProps} from "@/types/Table.types";
import {mutate} from "swr";
import {ConfirmModal} from "@/components/Tables/ConfirmModal";
import {USERS_URLS} from "@/config/urls";

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
    groupeOptions?: string[]; // Liste des groupes possibles
    apiUrl?: string; // URL pour la mise à jour du groupe
    mutateUrl?: string; // URL pour revalider les données
    readOnly?: boolean; // Nouvelle prop pour désactiver les modifications
}

const GroupeRenderer: React.FC<EnhancedGroupeRendererProps> = ({
                                                                   value,
                                                                   groupeConfig: groupConfig,
                                                                   row,
                                                                   groupeOptions = [],
                                                                   apiUrl = USERS_URLS.changeRole,
                                                                   mutateUrl = USERS_URLS.mutate,
                                                                   readOnly = false // Valeur par défaut
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
        if (newRole === value || isAdmin || readOnly) {
            setIsMenuOpen(false);
            return;
        }

        setSelectedGroupe(newRole);
        setIsConfirmationOpen(true);
    }, [value, isAdmin, readOnly]);

    const handleConfirmation = useCallback(async (confirmed: boolean) => {
        if (confirmed && selectedGroupe && row?.id && !readOnly) {
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
                    throw new Error(`Erreur lors de la mise à jour du groupe: ${response.statusText}`);
                }

                // Rafraîchir les données avec SWR après mise à jour
                await mutate(mutateUrl);
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
    }, [selectedGroupe, row?.id, apiUrl, mutateUrl, readOnly]);

    const toggleMenu = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (readOnly) {
            return; // Ne rien faire en mode lecture seule
        }

        if (isAdmin) {
            alert("Le rôle Admin ne peut pas être modifié.");
        } else if (groupeOptions.length > 0) {
            setIsMenuOpen(!isMenuOpen);
        }
    };

    const getDisplayMessage = () => {
        if (readOnly) return "Modification non autorisée";
        if (isAdmin) return "Le rôle Admin ne peut pas être modifié";
        if (groupeOptions.length === 0) return "Aucun groupe disponible";
        return undefined;
    };

    return (
        <div className="flex justify-center items-center relative">
            <div
                className={`relative ${
                    !readOnly && !isAdmin && groupeOptions.length > 0
                        ? 'cursor-pointer'
                        : readOnly
                            ? 'cursor-not-allowed'
                            : 'cursor-default'
                }`}
                onClick={toggleMenu}
                role="button"
                aria-haspopup="true"
                aria-expanded={isMenuOpen}
                title={getDisplayMessage()}
            >
                <div
                    className={`flex items-center py-[8px] px-[16px] rounded-lg font-extrabold ${
                        isUpdating ? 'opacity-50' : ''
                    } ${readOnly ? 'opacity-75' : ''}`}
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
                    {isAdmin && (
                        <span className="ml-2 text-sm text-gray-500">(Non modifiable)</span>
                    )}
                    {readOnly && !isAdmin && (
                        <span className="ml-1 text-xs opacity-60" title="Lecture seule">
                            🔒
                        </span>
                    )}
                </div>
                {config.pill?.show && (
                    <div className="absolute -top-0 -right-2 bg-red text-white text-xs p-0.5 rounded-full">
                        {config.pill.value}
                    </div>
                )}
            </div>

            {/* Menu déroulant pour sélectionner un nouveau groupe */}
            {isMenuOpen && !isAdmin && !readOnly && groupeOptions.length > 0 && (
                <div className="absolute z-10 mt-2 bg-white border rounded-md shadow-lg top-full min-w-[150px]">
                    <ul className="py-1">
                        {groupeOptions.map((groupe) => (
                            <li
                                key={groupe}
                                className={`px-4 py-2 hover:bg-gray-100 cursor-pointer text-center ${
                                    groupe === value ? 'font-bold bg-gray-50' : ''
                                }`}
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
            {!readOnly && (
                <ConfirmModal
                    isOpen={isConfirmationOpen}
                    onClose={() => handleConfirmation(false)}
                    onConfirm={() => handleConfirmation(true)}
                    title="Confirmer le changement de rôle"
                    message="Êtes-vous sûr de vouloir changer le rôle de cet utilisateur ?"
                />
            )}
        </div>
    );
};

export default GroupeRenderer;