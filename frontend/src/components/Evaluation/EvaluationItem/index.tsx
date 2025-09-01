import React from 'react';
import DefaultButton from '../DefaultButton';
import DeleteIcon from '../../Svgs/DeleteIcon';
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";
import {EvaluationsProps} from "@/types/dataTypes";

interface EvaluationItemProps extends EvaluationsProps {
    onSetDefault: (id: string) => void; // Fonction pour notifier le parent du changement de défaut
    onDelete: (id: string, title: string) => void;
}

const EvaluationItem: React.FC<EvaluationItemProps> = ({id, type, title, isDefault, onSetDefault, onDelete}) => {
    const {navigateTo} = useRoleBasedNavigation();

    const handleEditClick = () => {
        if (id && type) {
            navigateTo("evaluation/add", {
                query: {
                    questionnaireId: id,
                    questionnaireType: type
                }
            })
        } else {
            console.warn("Cannot edit: EvaluationItem does not have an ID.");
        }
    };

    const handleDefaultClick = () => {
        if (id) {
            onSetDefault(id);
        }
    };

    const handleDeleteClick = () => {
        if (id && title) { // S'assurer que title existe aussi
            onDelete(id, title); // Appeler la fonction onDelete reçue en prop avec l'id et le titre
        } else {
            console.warn("Cannot delete: EvaluationItem does not have an ID or title.");
        }
    };

    // Définir les classes et le titre du bouton de suppression en fonction de isDefault
    const deleteButtonClassName = `p-1 rounded-md transition-colors duration-150 ${
        isDefault
            ? "text-gray-400 cursor-not-allowed" // Style pour bouton désactivé
            : "text-red-500 hover:text-red-700 hover:bg-red-100" // Style pour bouton activé
    }`;

    const deleteButtonTitleMessage = isDefault
        ? "Vous ne pouvez pas supprimer un questionnaire par défaut. Veuillez d'abord définir un autre questionnaire comme étant celui par défaut."
        : `Supprimer le questionnaire ${title}`;


    return (
        <div className="flex items-center md:text-base justify-between py-2">
            <span
                onClick={handleEditClick}
                className="text-blue-700 cursor-pointer">{title}</span>
            <div className="flex items-center space-x-2">
                <DefaultButton
                    isDefault={isDefault}
                    onClick={handleDefaultClick} // Toujours passer handleDefaultClick
                />
                <button
                    onClick={handleDeleteClick}
                    className={deleteButtonClassName}
                    disabled={isDefault} // Désactiver le bouton si isDefault est true
                    aria-label={isDefault ? "Suppression désactivée pour questionnaire par défaut" : `Supprimer le questionnaire ${title}`}
                    title={deleteButtonTitleMessage} // Message affiché au survol
                >
                    <DeleteIcon/>
                </button>
            </div>
        </div>
    )
}

export default EvaluationItem;