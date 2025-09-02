import React, {useCallback, useState, useRef, useEffect} from "react";
import {createPortal} from "react-dom";
import {GroupeRendererProps} from "@/types/Table.types";
import {mutate} from "swr";
import {ConfirmModal} from "@/components/Tables/ConfirmModal";
import TeamRequestDetailsModal from "@/components/TeamRequestDetailsModal";

interface StatusConfig {
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

interface EnhancedStatusRendererProps extends GroupeRendererProps {
    row?: any;
    statusOptions?: string[];
    apiUrl?: string;
    mutateUrl?: string;
    isTeamRequest?: boolean;
    readOnly?: boolean; // Nouvelle prop pour désactiver les modifications
}

const StatusRenderer: React.FC<EnhancedStatusRendererProps> = ({
                                                                   value,
                                                                   groupeConfig,
                                                                   row,
                                                                   statusOptions = [],
                                                                   apiUrl,
                                                                   mutateUrl,
                                                                   isTeamRequest = false,
                                                                   readOnly = false // Valeur par défaut
                                                               }) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

    const buttonRef = useRef<HTMLDivElement>(null);

    const config = groupeConfig[value] || {
        label: value,
        color: '#475569',
        backgroundColor: '#47556926'
    };

    // Calculer la position du dropdown
    const calculateDropdownPosition = useCallback(() => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY + 4,
                left: rect.left + window.scrollX + (rect.width / 2) - 75 // Centrer le dropdown (150px / 2 = 75px)
            });
        }
    }, []);

    // Mettre à jour la position quand le menu s'ouvre
    useEffect(() => {
        if (isMenuOpen) {
            calculateDropdownPosition();
        }
    }, [isMenuOpen, calculateDropdownPosition]);

    // Recalculer la position lors du redimensionnement ou du scroll
    useEffect(() => {
        if (isMenuOpen) {
            const handleResize = () => calculateDropdownPosition();
            const handleScroll = () => calculateDropdownPosition();

            window.addEventListener('resize', handleResize);
            window.addEventListener('scroll', handleScroll);

            return () => {
                window.removeEventListener('resize', handleResize);
                window.removeEventListener('scroll', handleScroll);
            };
        }
    }, [isMenuOpen, calculateDropdownPosition]);

    const updateStatus = useCallback(async (newStatus: string) => {
        if (readOnly) return; // Empêcher la modification en mode lecture seule

        setSelectedStatus(newStatus);
        setIsConfirmationOpen(true);
        setIsMenuOpen(false); // Fermer le menu
    }, [readOnly]);

    const handleConfirmation = useCallback(async (confirmed: boolean, newStatus: string | null) => {
        if (confirmed && newStatus && row?.id && !readOnly) {
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
                        status: newStatus
                    })
                });

                if (!response.ok) {
                    throw new Error(`Erreur lors de la mise à jour du statut: ${response.statusText}`);
                }

                await mutate(mutateUrl);

            } catch (error) {
                console.error("Erreur lors de la mise à jour du statut:", error);
            } finally {
                setIsUpdating(false);
            }
        }

        setIsConfirmationOpen(false);
        setSelectedStatus(null);
    }, [row?.id, apiUrl, mutateUrl, readOnly]);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (isTeamRequest && row) {
            setIsMenuOpen(false);
            setIsConfirmationOpen(false);
            setIsDetailsModalOpen(true);
            return;
        }

        // Ne pas ouvrir le menu en mode lecture seule
        if (!readOnly && statusOptions.length > 0) {
            setIsMenuOpen(!isMenuOpen);
        }
    };

    return (
        <div className="flex justify-center items-center relative">
            <div
                ref={buttonRef}
                className={`relative ${!readOnly && statusOptions.length > 0 ? 'cursor-pointer' : ''} ${readOnly ? 'cursor-not-allowed' : ''}`}
                onClick={handleClick}
                title={readOnly ? "Modification non autorisée" : undefined}
            >
                <div
                    className={`flex items-center py-[8px] px-[16px] rounded-lg font-extrabold ${
                        isUpdating ? 'opacity-50' : ''
                    } ${readOnly ? 'opacity-75' : ''}`}
                    style={{
                        color: config.color,
                        backgroundColor: config.backgroundColor
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
                    {readOnly && (
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

            {/* Menu déroulant utilisant un Portal */}
            {!readOnly && isMenuOpen && statusOptions.length > 0 && typeof document !== 'undefined' && createPortal(
                <div
                    className="fixed z-50 bg-white border rounded-md shadow-lg min-w-[150px] max-h-[200px] overflow-y-auto"
                    style={{
                        top: `${dropdownPosition.top}px`,
                        left: `${dropdownPosition.left}px`,
                    }}
                >
                    <ul className="py-1">
                        {statusOptions.map((statut) => (
                            <li
                                key={statut}
                                className={`px-4 py-2 hover:bg-gray-100 cursor-pointer text-center ${
                                    statut === value ? 'font-bold bg-gray-50' : ''
                                }`}
                                onClick={() => updateStatus(statut)}
                            >
                                {groupeConfig[statut]?.label || statut}
                            </li>
                        ))}
                    </ul>
                </div>,
                document.body
            )}

            {/* Overlay pour fermer le menu */}
            {!readOnly && isMenuOpen && statusOptions.length > 0 && typeof document !== 'undefined' && createPortal(
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsMenuOpen(false)}
                />,
                document.body
            )}

            {/* Modal de confirmation */}
            {!readOnly && (
                <ConfirmModal
                    isOpen={isConfirmationOpen}
                    onClose={() => handleConfirmation(false, null)}
                    onConfirm={() => handleConfirmation(true, selectedStatus)}
                    title="Confirmer le changement de statut"
                    message="Êtes-vous sûr de vouloir changer le statut?"
                />
            )}

            {/* Modal des détails de la demande */}
            {isTeamRequest && row && (
                <TeamRequestDetailsModal
                    isOpen={isDetailsModalOpen}
                    onClose={() => setIsDetailsModalOpen(false)}
                    request={row}
                    mutateUrl={mutateUrl}
                    apiUrl={apiUrl}
                />
            )}
        </div>
    );
};

export default StatusRenderer;