// src/components/AccessRightModal/index.tsx
import React, {useCallback, useEffect, useState} from 'react';
import Modal from '@/components/Modal';
import {GroupsProps} from '@/types/dataTypes';

interface AccessRight {
    id?: number;
    action: string;
    allowed: boolean;
    actionLabel: string;
}

interface GroupAccessRightsResponse {
    groupeId: number;
    groupeName: string;
    module: string;
    accessRights: AccessRight[];
}

interface AccessRightModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle: string;
    group: GroupsProps | null;
    module?: string;
}

const ACCESS_RIGHTS_API = "/api/access-rights";

const AccessRightModal: React.FC<AccessRightModalProps> = ({
                                                               isOpen,
                                                               onClose,
                                                               title,
                                                               subtitle,
                                                               group,
                                                               module = "users"
                                                           }) => {
    const [accessRights, setAccessRights] = useState<AccessRight[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasChanges, setHasChanges] = useState(false);

    // Charger les droits d'accès du groupe
    const loadAccessRights = useCallback(async () => {
        if (!group || !isOpen) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${ACCESS_RIGHTS_API}/group/${group.id}/module/${module}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Erreur lors du chargement des droits d\'accès');
            }

            const data: GroupAccessRightsResponse = await response.json();
            setAccessRights(data.accessRights);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur inconnue');
            console.error('Erreur lors du chargement des droits d\'accès:', err);
        } finally {
            setLoading(false);
        }
    }, [group, module, isOpen]);

    // Sauvegarder les modifications
    const handleSave = useCallback(async () => {
        if (!group || !hasChanges) return;

        setLoading(true);
        setError(null);

        try {
            const updateRequest = {
                groupeId: group.id,
                module,
                accessRights: accessRights.map(ar => ({
                    action: ar.action,
                    allowed: ar.allowed
                }))
            };

            const response = await fetch(`${ACCESS_RIGHTS_API}/update`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateRequest),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la sauvegarde des droits d\'accès');
            }

            setHasChanges(false);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur de sauvegarde');
            console.error('Erreur lors de la sauvegarde:', err);
        } finally {
            setLoading(false);
        }
    }, [group, module, accessRights, hasChanges, onClose]);

    // Gérer le changement d'un droit d'accès
    const handleAccessRightChange = useCallback((action: string, allowed: boolean) => {
        setAccessRights(prev =>
            prev.map(ar =>
                ar.action === action ? {...ar, allowed} : ar
            )
        );
        setHasChanges(true);
    }, []);

    // Charger les données à l'ouverture
    useEffect(() => {
        if (isOpen && group) {
            loadAccessRights();
            setHasChanges(false);
        }
    }, [isOpen, group, loadAccessRights]);

    // Réinitialiser l'état à la fermeture
    useEffect(() => {
        if (!isOpen) {
            setAccessRights([]);
            setError(null);
            setHasChanges(false);
        }
    }, [isOpen]);

    const modalActions = [
        {
            label: "Annuler",
            onClick: onClose,
            className: "border border-gray-300 hover:bg-gray-50",
            disabled: loading
        },
        {
            label: loading ? "Sauvegarde..." : "Sauvegarder",
            onClick: handleSave,
            className: "bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd text-white hover:opacity-90",
            disabled: loading || !hasChanges
        }
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            subtitle={subtitle}
            actions={modalActions}
            icon={undefined}
        >
            <div className="space-y-4">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                        {error}
                    </div>
                )}

                {loading && accessRights.length === 0 ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <h4 className="font-semibold text-gray-700 mb-4">
                            Permissions pour le module "{module}"
                        </h4>

                        {accessRights.map((accessRight) => (
                            <div
                                key={accessRight.action}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                                <div className="flex flex-col">
                  <span className="font-medium text-gray-800">
                    {accessRight.actionLabel}
                  </span>
                                    <span className="text-sm text-gray-500 capitalize">
                    Action: {accessRight.action}
                  </span>
                                </div>

                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={accessRight.allowed}
                                        onChange={(e) => handleAccessRightChange(accessRight.action, e.target.checked)}
                                        disabled={loading}
                                    />
                                    <div
                                        className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    <span className="ml-3 text-sm font-medium text-gray-700">
                    {accessRight.allowed ? 'Autorisé' : 'Refusé'}
                  </span>
                                </label>
                            </div>
                        ))}

                        {accessRights.length === 0 && !loading && (
                            <div className="text-center py-8 text-gray-500">
                                Aucun droit d'accès trouvé pour ce groupe.
                            </div>
                        )}
                    </div>
                )}

                {hasChanges && (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                ⚠️
                            </div>
                            <div className="ml-3">
                                <p className="text-sm">
                                    Des modifications ont été apportées. N'oubliez pas de sauvegarder.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default AccessRightModal;