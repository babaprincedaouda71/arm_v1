// pages/collaborator/TeamInvitations/OCFPage.tsx
import React, {useMemo, useState} from 'react';
import {useAuth} from '@/contexts/AuthContext';
import useSWR from 'swr';
import {fetcher} from '@/services/api';
import Table from '@/components/Tables/Table/index';
import {handleSort} from '@/utils/sortUtils';
import useTable from '@/hooks/useTable';
import StatusRenderer from '@/components/Tables/StatusRenderer';
import {statusConfig} from '@/config/tableConfig';
import SearchFilterAddBar from '@/components/SearchFilterAddBar';
import ModalButton from '@/components/ModalButton';
import Alert from '@/components/Alert';
import Modal from '@/components/Modal';
import {Calendar, Check, MapPin, Users, X} from 'lucide-react';
import {TRAINING_INVITATION_URLS} from "@/config/urls";

// Types
interface UserInvitation {
    id: string;
    trainingTheme: string;
    trainingId: string;
    groupId: number;
    invitationDate: string;
    status: string;
    trainerName?: string;
    location?: string;
    city?: string;
    dates?: string[];
    participantCount?: number;
}

// Configuration du tableau
const TABLE_HEADERS = [
    "Thème de formation",
    "Date d'invitation",
    "Lieu",
    "Dates de formation",
    "Participants",
    "Statut",
    "Actions"
];

const TABLE_KEYS = [
    "trainingTheme",
    "invitationDate",
    "location",
    "dates",
    "participantCount",
    "status",
    "actions"
];

const RECORDS_PER_PAGE = 10;

const TeamInvitations: React.FC = () => {
    const {user} = useAuth();

    // États pour les alertes
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('success');

    // États pour le modal de détails
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedInvitation, setSelectedInvitation] = useState<UserInvitation | null>(null);

    // États pour le modal de confirmation
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState<{
        invitationId: string;
        action: 'accept' | 'decline'
    } | null>(null);

    // Chargement des données
    const {
        data: invitationsData,
        error,
        isLoading,
        mutate
    } = useSWR<UserInvitation[]>(
        user?.id ? `${TRAINING_INVITATION_URLS.getTeamInvitations}/${user.id}` : null,
        fetcher
    );

    const memoizedInvitationsData = useMemo(() => invitationsData || [], [invitationsData]);
    // Hook pour la table
    const {
        currentPage,
        visibleColumns,
        setCurrentPage,
        handleSortData,
        toggleColumnVisibility,
        totalPages,
        totalRecords,
        paginatedData,
        sortableColumns,
    } = useTable(
        memoizedInvitationsData,
        TABLE_HEADERS,
        TABLE_KEYS,
        RECORDS_PER_PAGE
    );

    // Handlers
    const handleCloseAlert = () => {
        setShowAlert(false);
        setAlertMessage('');
    };

    const handleViewDetails = (invitation: UserInvitation) => {
        setSelectedInvitation(invitation);
        setIsDetailModalOpen(true);
    };

    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedInvitation(null);
    };

    const handleInvitationAction = (invitationId: string, action: 'accept' | 'decline') => {
        setPendingAction({invitationId, action});
        setIsConfirmModalOpen(true);
    };

    const handleCloseConfirmModal = () => {
        setIsConfirmModalOpen(false);
        setPendingAction(null);
    };

    const handleConfirmAction = async () => {
        if (!pendingAction) return;

        try {
            const response = await fetch(`${TRAINING_INVITATION_URLS.respondToInvitation}/${pendingAction.invitationId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: pendingAction.action,
                    userId: user?.id
                }),
            });

            if (response.ok) {
                const actionText = pendingAction.action === 'accept' ? 'acceptée' : 'refusée';
                setAlertMessage(`Invitation ${actionText} avec succès !`);
                setAlertType('success');
                setShowAlert(true);

                // Recharger les données
                await mutate();
            } else {
                throw new Error('Erreur lors de la réponse à l\'invitation');
            }
        } catch (error) {
            console.error('Erreur:', error);
            setAlertMessage('Erreur lors de la réponse à l\'invitation');
            setAlertType('error');
            setShowAlert(true);
        } finally {
            handleCloseConfirmModal();
        }
    };

    // Renderers pour le tableau
    const renderers = {
        location: (value: string, row: UserInvitation) => (
            <div className="flex items-center gap-1">
                <MapPin size={16} className="text-gray-500"/>
                <span>{row.location && row.city ? `${row.location}, ${row.city}` : 'Non défini'}</span>
            </div>
        ),
        dates: (value: string[], row: UserInvitation) => (
            <div className="flex items-center gap-1">
                <Calendar size={16} className="text-gray-500"/>
                <span>{row.dates && row.dates.length > 0 ? row.dates.join(', ') : 'Non défini'}</span>
            </div>
        ),
        participantCount: (value: number, row: UserInvitation) => (
            <div className="flex items-center gap-1">
                <Users size={16} className="text-gray-500"/>
                <span>{value || 'Non défini'}</span>
            </div>
        ),
        status: (value: string, row: UserInvitation) => (
            <StatusRenderer
                value={value}
                groupeConfig={statusConfig}
                statusOptions={['En attente', 'Acceptée', 'Rejetée']}
                apiUrl={TRAINING_INVITATION_URLS.respondToInvitation}
                mutateUrl={TRAINING_INVITATION_URLS.getUserInvitations}
                row={row}
            />
        ),
        actions: (_: any, row: UserInvitation) => (
            <div className="flex items-center gap-2">
                <button
                    onClick={() => handleViewDetails(row)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                >
                    Détails
                </button>
                {row.status === 'PENDING' && (
                    <>
                        <button
                            onClick={() => handleInvitationAction(row.id, 'accept')}
                            className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm flex items-center gap-1"
                        >
                            <Check size={14}/>
                            Accepter
                        </button>
                        <button
                            onClick={() => handleInvitationAction(row.id, 'decline')}
                            className="px-3 py-1 bg-red text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm flex items-center gap-1"
                        >
                            <X size={14}/>
                            Refuser
                        </button>
                    </>
                )}
            </div>
        ),
    };

    if (error) {
        return (
            <div className="bg-white rounded-lg p-6">
                <div className="text-center text-red-600">
                    Erreur lors du chargement des invitations
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg pt-6">
            {showAlert && (
                <Alert
                    message={alertMessage}
                    type={alertType}
                    onClose={handleCloseAlert}
                />
            )}

            <h1 className="text-2xl font-semibold text-gray-800 mb-6 px-6">
                Les invitations de formation de mon équipe
            </h1>

            {/* Barre de recherche et filtres */}
            <div className="flex items-start gap-2 md:gap-8 mt-4">
                <SearchFilterAddBar
                    isLeftButtonVisible={false}
                    isFiltersVisible={false}
                    isRightButtonVisible={false}
                    filters={[]}
                    placeholderText="Rechercher une formation..."
                />
                <ModalButton
                    headers={TABLE_HEADERS}
                    visibleColumns={visibleColumns}
                    toggleColumnVisibility={toggleColumnVisibility}
                />
            </div>

            {/* Tableau des TeamInvitations */}
            <Table
                data={paginatedData}
                keys={TABLE_KEYS}
                headers={TABLE_HEADERS}
                sortableCols={sortableColumns}
                onSort={(column, order) => handleSortData(column, order, handleSort)}
                isPagination
                pagination={{
                    currentPage,
                    totalPages,
                    onPageChange: setCurrentPage,
                }}
                totalRecords={totalRecords}
                loading={isLoading}
                onAdd={() => null}
                visibleColumns={visibleColumns}
                renderers={renderers}
            />

            {/* Modal des détails */}
            {isDetailModalOpen && selectedInvitation && (
                <Modal
                    isOpen={isDetailModalOpen}
                    onClose={handleCloseDetailModal}
                    title="Détails de l'invitation"
                    subtitle={selectedInvitation.trainingTheme}
                    actions={[
                        {
                            label: "Fermer",
                            onClick: handleCloseDetailModal,
                            className: "border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }
                    ]}
                    icon=""
                >
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Formateur
                                </label>
                                <p className="text-gray-900">{selectedInvitation.trainerName || 'Non défini'}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Lieu
                                </label>
                                <p className="text-gray-900">
                                    {selectedInvitation.location && selectedInvitation.city
                                        ? `${selectedInvitation.location}, ${selectedInvitation.city}`
                                        : 'Non défini'}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Dates de formation
                                </label>
                                <p className="text-gray-900">
                                    {selectedInvitation.dates && selectedInvitation.dates.length > 0
                                        ? selectedInvitation.dates.join(', ')
                                        : 'Non défini'}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre de participants
                                </label>
                                <p className="text-gray-900">{selectedInvitation.participantCount || 'Non défini'}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Statut de l'invitation
                                </label>
                                <div className="mt-1">
                                    <StatusRenderer
                                        value={selectedInvitation.status}
                                        groupeConfig={statusConfig}
                                    />
                                </div>
                            </div>
                        </div>

                        {selectedInvitation.status === 'En attente' && (
                            <div className="flex gap-3 pt-4 border-t">
                                <button
                                    onClick={() => {
                                        handleCloseDetailModal();
                                        handleInvitationAction(selectedInvitation.id, 'accept');
                                    }}
                                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Check size={16}/>
                                    Accepter l'invitation
                                </button>
                                <button
                                    onClick={() => {
                                        handleCloseDetailModal();
                                        handleInvitationAction(selectedInvitation.id, 'decline');
                                    }}
                                    className="flex-1 bg-red text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <X size={16}/>
                                    Refuser l'invitation
                                </button>
                            </div>
                        )}
                    </div>
                </Modal>
            )}

            {/* Modal de confirmation */}
            {isConfirmModalOpen && pendingAction && (
                <Modal
                    isOpen={isConfirmModalOpen}
                    onClose={handleCloseConfirmModal}
                    title="Confirmer l'action"
                    subtitle="Êtes-vous sûr de votre choix ?"
                    actions={[
                        {
                            label: "Annuler",
                            onClick: handleCloseConfirmModal,
                            className: "border border-gray-300 text-gray-700 hover:bg-gray-50"
                        },
                        {
                            label: pendingAction.action === 'accept' ? 'Accepter' : 'Refuser',
                            onClick: handleConfirmAction,
                            className: pendingAction.action === 'accept'
                                ? "bg-green-600 text-white hover:bg-green-700"
                                : "bg-red text-white hover:bg-red"
                        }
                    ]}
                    icon=""
                >
                    <div className="text-center">
                        <p className="text-gray-600">
                            Vous êtes sur le point de{' '}
                            <span className="font-medium">
                                {pendingAction.action === 'accept' ? 'accepter' : 'refuser'}
                            </span>
                            {' '}cette invitation de formation.
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            Cette action ne pourra pas être annulée.
                        </p>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default TeamInvitations;