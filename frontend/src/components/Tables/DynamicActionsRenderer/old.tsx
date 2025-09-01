import CloseIcon from "@/components/Svgs/CloseIcon";
import DeleteIcon from "@/components/Svgs/DeleteIcon";
import EditIcon from "@/components/Svgs/EditIcon";
import EyeFileIcon from "@/components/Svgs/EyeFileIcon";
import React, {useState} from "react";
import {mutate} from "swr";
import router from "next/router";
import {ConfirmModal} from "@/components/Tables/ConfirmModal";
import ModalInformation from "@/components/ModalInformation";
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";

interface dynamicActionsRendererProps {
    actions: string[],
    row: any;
    openCancelModal?: () => void; // Type correctement la fonction openCancelModal
    deleteUrl?: string; // URL pour la suppression
    editUrl?: string;   // URL pour l'édition
    viewUrl?: string;   // URL pour la visualisation
    mutateUrl?: string; // URL pour revalider les données après une action
    confirmMessage?: string | ((row: any) => string); // Message de confirmation personnalisé
    isSelected?: boolean;
    customEditHandler?: (row: any) => void; // Fonction personnalisée pour l'édition
    isEditDisabled?: (row: any) => boolean; // Fonction pour désactiver l'édition conditionnellement
    onDeleteSuccess?: (groupId: number) => void; // Nouvelle prop pour la fonction de rappel
    customViewHandler?: () => void; // Ajoutez cette ligne

}

const DynamicActionsRenderer: React.FC<dynamicActionsRendererProps> = ({
                                                                           actions,
                                                                           row,
                                                                           openCancelModal,
                                                                           isSelected, // La valeur par défaut est maintenant undefined
                                                                           deleteUrl,
                                                                           editUrl,
                                                                           viewUrl,
                                                                           mutateUrl,
                                                                           confirmMessage,
                                                                           customEditHandler,
                                                                           isEditDisabled,
                                                                           onDeleteSuccess, // Nouvelle prop pour la fonction de rappel
                                                                           customViewHandler,
                                                                       }) => {
    const {navigateTo} = useRoleBasedNavigation()
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false); // Nouvel état pour le modal d'information
    const [rowToDelete, setRowToDelete] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);


    const openConfirmModal = (row: any) => {
        // Si isSelected n'est pas défini (pas de sélection), ou si la ligne est sélectionnée, on ouvre le modal
        if (isSelected === undefined || isSelected) {
            setRowToDelete(row);
            setIsConfirmModalOpen(true);
            setError(null);
        }
    };

    const closeConfirmModal = () => {
        setIsConfirmModalOpen(false);
        setRowToDelete(null);
        setError(null);
    };

    const openInfoModal = () => {
        setIsInfoModalOpen(true);
    };

    const closeInfoModal = () => {
        setIsInfoModalOpen(false);
    };

    const handleDelete = async () => {
        // Si isSelected n'est pas défini ou si la ligne est sélectionnée
        if (isSelected === undefined || (isSelected && rowToDelete)) {
            try {
                console.log("Suppression En Cours...");
                const response = await fetch(`${deleteUrl}/${rowToDelete.id}`, {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw errorData;
                }

                console.log(`Suppression réussie : ${rowToDelete.id}`);

                // Appeler la fonction de rappel si elle existe
                if (onDeleteSuccess && rowToDelete.id) {
                    onDeleteSuccess(rowToDelete.id);
                }

                // Revalider les données en utilisant l'URL fournie via mutateUrl
                if (mutateUrl) {
                    await mutate(mutateUrl);
                } else {
                    console.warn("Aucune URL de revalidation fournie (mutateUrl). Les données ne seront pas actualisées.");
                }
                closeConfirmModal()
            } catch (error) {
                setError(error.message);
                console.error('Erreur lors de la suppression:', error);
            }
        }
    };

    const handleView = () => {
        if (customViewHandler) {
            customViewHandler(); // Utilise le gestionnaire personnalisé s'il est fourni
        } else if (viewUrl) {
            router.push({
                pathname: viewUrl,
                query: {id: row.id},
            });
        }
    }

    const handleEdit = () => {
        // Vérifier si la ligne est sélectionnée (si la prop isSelected est définie)
        if (isSelected === undefined || isSelected) {
            // Vérifier si l'édition est désactivée pour cette ligne
            if (isEditDisabled && isEditDisabled(row)) {
                openInfoModal(); // Ouvrir le modal d'information
                console.log("L'édition n'est pas autorisée pour cet élément.");
            } else {
                // Si une fonction d'édition personnalisée est fournie, l'utiliser en priorité
                if (customEditHandler) {
                    customEditHandler(row);
                } else if (editUrl) {
                    // Sinon, utiliser le comportement par défaut (redirection)
                    navigateTo(editUrl, {
                        query: {id: row.id}
                    });
                }
            }
        }
    }

    // Définir les actions globales avec leurs icônes et leurs callbacks
    const globalActions = {
        view: {
            icon: EyeFileIcon,
            onClick: handleView
        },
        edit: {
            icon: EditIcon,
            onClick: handleEdit,
        },
        delete: {
            icon: DeleteIcon,
            onClick: (row: any) => openConfirmModal(row),
        },
        cancel: {
            icon: CloseIcon,
            onClick: () => openCancelModal?.(), // Utilise la fonction passée en prop s'il y en a une
        },
    };

    return (
        <>
            <div className="flex justify-center items-center space-x-2">
                {actions.map((actionKey) => {
                    const action = globalActions[actionKey];
                    if (!action) return null; // Ignore les actions non définies

                    const Icon = action.icon;
                    // Le bouton est désactivé seulement si isSelected est défini et est false
                    const isDisabled = isSelected !== undefined && !isSelected;
                    const buttonClassName = `p-2 rounded hover:bg-gray-200 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                    }`;

                    return (
                        <button
                            type="button"
                            key={actionKey}
                            onClick={() => action.onClick(row)}
                            className={buttonClassName}
                            aria-label={actionKey} // Pour l'accessibilité
                            disabled={isDisabled}
                        >
                            <Icon className="w-5 h-5"/>
                        </button>
                    );
                })}
            </div>

            {/* Modal de confirmation */}
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={closeConfirmModal}
                onConfirm={handleDelete}
                title="Confirmer la suppression"
                message={
                    typeof confirmMessage === "function"
                        ? confirmMessage(rowToDelete) // Appeler la fonction pour générer le message
                        : confirmMessage || "Êtes-vous sûr de vouloir supprimer cet élément ?" // Message par défaut
                }
                errors={error}
            />
            {/* Modal d'information */}
            <ModalInformation
                isOpen={isInfoModalOpen}
                onClose={closeInfoModal}
                message="Veuillez modifier le statut du besoin"
            />
        </>
    );
};

export default DynamicActionsRenderer;