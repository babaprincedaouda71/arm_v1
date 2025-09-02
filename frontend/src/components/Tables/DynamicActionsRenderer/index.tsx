import CloseIcon from "@/components/Svgs/CloseIcon";
import DeleteIcon from "@/components/Svgs/DeleteIcon";
import EditIcon from "@/components/Svgs/EditIcon";
import EyeFileIcon from "@/components/Svgs/EyeFileIcon";
import React, {useState} from "react";
import {mutate} from "swr";
import {ConfirmModal} from "@/components/Tables/ConfirmModal";
import ModalInformation from "@/components/ModalInformation";
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";

interface DynamicActionsRendererProps {
    actions: string[];
    row: any;
    openCancelModal?: () => void;
    deleteUrl?: string;
    editUrl?: string;
    viewUrl?: string;
    mutateUrl?: string;
    confirmMessage?: string | ((row: any) => string);
    isSelected?: boolean;
    customEditHandler?: (row: any) => void;
    isEditDisabled?: (row: any) => boolean;
    onDeleteSuccess?: (groupId: number) => void;
    customViewHandler?: () => void;
    // Nouvelle prop pour déterminer si une action est désactivée
    getActionDisabledState?: (actionKey: string, row: any) => boolean;
    // Prop pour désactiver des actions spécifiques basées sur les permissions
    disabledActions?: {
        view?: boolean;
        edit?: boolean;
        delete?: boolean;
        cancel?: boolean;
        [key: string]: boolean | undefined;
    };
    // Nouvelles props pour personnaliser les query params
    getViewQueryParams?: (row: any) => Record<string, string | number | boolean | string[]>;
    getEditQueryParams?: (row: any) => Record<string, string | number | boolean | string[]>;
}

const DynamicActionsRenderer: React.FC<DynamicActionsRendererProps> = ({
                                                                           actions,
                                                                           row,
                                                                           openCancelModal,
                                                                           isSelected,
                                                                           deleteUrl,
                                                                           editUrl,
                                                                           viewUrl,
                                                                           mutateUrl,
                                                                           confirmMessage,
                                                                           customEditHandler,
                                                                           isEditDisabled,
                                                                           onDeleteSuccess,
                                                                           customViewHandler,
                                                                           getActionDisabledState,
                                                                           disabledActions = {}, // Nouvelle prop avec valeur par défaut
                                                                           getViewQueryParams,
                                                                           getEditQueryParams,
                                                                       }) => {
    const {navigateTo} = useRoleBasedNavigation()
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [rowToDelete, setRowToDelete] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const openConfirmModal = (row: any) => {
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

                if (onDeleteSuccess && rowToDelete.id) {
                    onDeleteSuccess(rowToDelete.id);
                }

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
            customViewHandler();
        } else if (viewUrl) {
            // Vérifier si l'action 'view' est désactivée
            if (!isActionDisabled('view')) {
                // Utiliser les query params personnalisés ou par défaut
                const queryParams = getViewQueryParams
                    ? getViewQueryParams(row)
                    : {id: row.id};

                navigateTo(viewUrl, {
                    query: queryParams
                });
            } else {
                console.log("Action 'view' désactivée pour cette ligne.");
                // Optionnel : Afficher un message ou une indication à l'utilisateur
            }
        }
    }

    const handleEdit = () => {
        if (isSelected === undefined || isSelected) {
            // Vérifier si l'édition est désactivée
            if (isActionDisabled('edit')) {
                openInfoModal();
                console.log("L'édition n'est pas autorisée pour cet élément.");
            } else {
                if (customEditHandler) {
                    customEditHandler(row);
                } else if (editUrl) {
                    // Utiliser les query params personnalisés ou par défaut
                    const queryParams = getEditQueryParams
                        ? getEditQueryParams(row)
                        : {id: row.id};

                    navigateTo(editUrl, {
                        query: queryParams
                    });
                }
            }
        }
    }

    const handleDeleteClick = (row: any) => {
        // Vérifier si l'action 'delete' est désactivée
        if (!isActionDisabled('delete')) {
            openConfirmModal(row);
        } else {
            console.log("Action 'delete' désactivée pour cette ligne.");
            // Optionnel : Afficher un message ou une indication
        }
    }

    const handleCancelClick = () => {
        // Vérifier si l'action 'cancel' est désactivée
        if (!isActionDisabled('cancel')) {
            openCancelModal?.();
        } else {
            console.log("Action 'cancel' désactivée pour cette ligne.");
            // Optionnel : Afficher un message ou une indication
        }
    }

    // Fonction helper pour vérifier si une action est désactivée
    const isActionDisabled = (actionKey: string): boolean => {
        // Vérifier d'abord les permissions générales
        if (disabledActions[actionKey]) {
            return true;
        }

        // Vérifier avec la fonction personnalisée si elle existe
        if (getActionDisabledState && getActionDisabledState(actionKey, row)) {
            return true;
        }

        // Vérifier avec la fonction spécifique pour l'édition (legacy)
        if (actionKey === 'edit' && isEditDisabled && isEditDisabled(row)) {
            return true;
        }

        // Vérifier si la ligne n'est pas sélectionnée (pour certaines actions)
        if (isSelected !== undefined && !isSelected && ['edit', 'delete', 'cancel'].includes(actionKey)) {
            return true;
        }

        return false;
    };

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
            onClick: handleDeleteClick,
        },
        cancel: {
            icon: CloseIcon,
            onClick: handleCancelClick,
        },
    };

    return (
        <>
            <div className="flex justify-center items-center space-x-2">
                {actions.map((actionKey) => {
                    const action = globalActions[actionKey];
                    if (!action) return null;

                    const Icon = action.icon;
                    const disabled = isActionDisabled(actionKey);

                    const buttonClassName = `p-2 rounded hover:bg-gray-200 transition-colors ${
                        disabled
                            ? 'opacity-50 cursor-not-allowed bg-gray-100'
                            : 'hover:bg-gray-200'
                    }`;

                    return (
                        <button
                            type="button"
                            key={actionKey}
                            onClick={disabled ? undefined : () => action.onClick(row)}
                            className={buttonClassName}
                            aria-label={actionKey}
                            disabled={disabled}
                            title={
                                disabled
                                    ? `Action ${actionKey} non autorisée`
                                    : `${actionKey.charAt(0).toUpperCase() + actionKey.slice(1)}`
                            }
                        >
                            <Icon className={`w-5 h-5 ${disabled ? 'text-gray-400' : ''}`}/>
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
                        ? confirmMessage(rowToDelete)
                        : confirmMessage || "Êtes-vous sûr de vouloir supprimer cet élément ?"
                }
                errors={error}
            />

            {/* Modal d'information */}
            <ModalInformation
                isOpen={isInfoModalOpen}
                onClose={closeInfoModal}
                message="Vous n'avez pas les permissions nécessaires pour cette action"
            />
        </>
    );
};

export default DynamicActionsRenderer;