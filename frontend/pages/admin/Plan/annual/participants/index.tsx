import {useParticipantsFormValidation} from "@/hooks/plans/useParticipantsFormValidation";
import {useTrainingGroupParticipantsData} from "@/hooks/plans/useTrainingGroupParticipantsData";
import {useTrainingInvitationsManager} from "@/hooks/plans/useTrainingInvitationsManager";
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";
import {TrainingInvitationProps} from "@/types/dataTypes";
import React, {useEffect, useMemo, useState} from "react";
import Alert from "@/components/Alert";
import TrainingParticipantsForm from "@/components/Plan/TrainingParticipants/TrainingParticipantsForm";
import AvailableUsersSelectionTable from "@/components/Plan/TrainingParticipants/AvailableUsersSelectionTable";
import TrainingInvitationsTable from "@/components/Plan/TrainingParticipants/TrainingInvitationsTable";
import Modal from "@/components/Modal";
import AttendanceListModal from "@/components/ui/AttendanceListModal";
import {TrainingGroupParticipantsService} from "@/services/plan/trainingGroupParticipantsService";

// Définir une interface pour les données du groupe, incluant les IDs des utilisateurs sélectionnés
interface GroupData {
    id?: number;
    name?: string;
    targetAudience: string;
    managerCount: number;
    employeeCount: number;
    workerCount: number;
    temporaryWorkerCount: number;
    userGroupIds: number[];
    dates?: string[]; // Ajout des dates pour le tableau de présence
    location: string;
    trainingType?: string;
    ocf?: {
        id: number;
        corporateName: string;
        emailMainContact?: string;
    };
}

// Interface pour les participants du PDF
interface ParticipantForPDF {
    id: number;
    firstName: string;
    lastName: string;
    code: string;
    position: string;
    level: string;
    manager: string;
    cnss?: string;
    cin?: string;
}

// Configuration des tableaux
const TRAINING_PARTICIPANTS_TABLE_CONFIG = {
    availableUsers: {
        headers: ["Code", "Nom", "Prénoms", "Poste", "Niveau", "Manager", "Sélection"],
        keys: ["code", "firstName", "lastName", "position", "level", "manager", "selection"],
        recordsPerPage: 5
    },
    trainingInvitations: {
        headers: ["Nom", "Date d'invitation", "État", "Actions"],
        keys: ["userFullName", "invitationDate", "status", "actions"],
        recordsPerPage: 5
    }
};

interface TrainingGroupParticipantsProps {
    trainingId: string | string[] | undefined;
    groupId: string | string[] | undefined;
    groupData?: GroupData;
    onGroupDataUpdated: (newGroupData: GroupData) => void;
}

const TrainingGroupParticipants: React.FC<TrainingGroupParticipantsProps> = ({
                                                                                 trainingId,
                                                                                 groupData,
                                                                                 onGroupDataUpdated,
                                                                                 groupId
                                                                             }) => {
    const {navigateTo} = useRoleBasedNavigation();

    // ========================================
    // HOOKS MÉTIER
    // ========================================
    const {users, setUsers, companyData, initialUsersLoading, initialUsersError} =
        useTrainingGroupParticipantsData(groupData);

    const {
        invitations, isLoading: isLoadingInvitations, error: invitationsError,
        fetchInvitations, cancelInvitation
    } = useTrainingInvitationsManager(groupId);

    // FormData initial
    const initialFormData = useMemo(() => ({
        targetAudience: groupData?.targetAudience || '',
        staff: (groupData?.managerCount || 0) + (groupData?.employeeCount || 0) +
            (groupData?.workerCount || 0) + (groupData?.temporaryWorkerCount || 0),
        managerCount: groupData?.managerCount || 0,
        employeeCount: groupData?.employeeCount || 0,
        workerCount: groupData?.workerCount || 0,
        temporaryWorkerCount: groupData?.temporaryWorkerCount || 0,
    }), [groupData]);

    const {formData, setFormData, staffError, handleInputChange} =
        useParticipantsFormValidation(initialFormData);

    // ========================================
    // ÉTAT LOCAL SIMPLIFIÉ
    // ========================================
    const [tempSelectedUsers, setTempSelectedUsers] = useState<Set<string>>(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('success');

    // Modal states
    const [isSendInvitationModalOpen, setIsSendInvitationModalOpen] = useState(false);
    const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedListType, setSelectedListType] = useState<'internal' | 'csf'>('internal');

    // État pour les données PDF
    const [participantsForPDF, setParticipantsForPDF] = useState<ParticipantForPDF[]>([]);

    // ========================================
    // EFFETS
    // ========================================
    useEffect(() => {
        if (groupData) {
            setFormData(initialFormData);
        }
    }, [groupData, initialFormData, setFormData]);

    useEffect(() => {
        fetchInvitations();
    }, [fetchInvitations]);

    // ========================================
    // HANDLERS MÉTIER
    // ========================================
    const handleUserSelection = (userId: string, selected: boolean) => {
        const newSelection = new Set(tempSelectedUsers);
        if (selected) {
            newSelection.add(userId);
        } else {
            newSelection.delete(userId);
        }
        setTempSelectedUsers(newSelection);
    };

    const handleAddToSelected = async () => {
        if (tempSelectedUsers.size === 0) return;

        const usersToAdd = users.filter(user => tempSelectedUsers.has(user.id.toString()));
        const existingUserIds = invitations.map(inv => inv.userId);
        const selectedUserIds = [...existingUserIds, ...usersToAdd.map(user => user.id)];

        setIsSubmitting(true);
        try {
            const responseData = await TrainingGroupParticipantsService.addParticipantsToGroup(
                trainingId,
                groupData,
                formData,
                selectedUserIds
            );

            onGroupDataUpdated(responseData);
            setUsers(users.filter(user => !tempSelectedUsers.has(user.id.toString())));
            setTempSelectedUsers(new Set());
            await fetchInvitations();

            setAlertMessage('Participants ajoutés avec succès !');
            setAlertType('success');
            setShowAlert(true);
        } catch (error) {
            console.error('Erreur:', error);
            setAlertMessage('Erreur lors de l\'ajout des participants');
            setAlertType('error');
            setShowAlert(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancelInvitation = async (invitation: TrainingInvitationProps) => {
        const result = await cancelInvitation(invitation);
        setAlertMessage(result.message);
        setAlertType(result.success ? 'success' : 'error');
        setShowAlert(true);
    };

    const handleSendInvitations = () => {
        if (invitations.length === 0) {
            setAlertMessage('Aucun participant à inviter');
            setAlertType('warning');
            setShowAlert(true);
            return;
        }

        setIsSendInvitationModalOpen(false);
        navigateTo(`/Plan/annual/sendInvitation`, {
            query: {trainingId, groupId}
        });
    };

    // ========================================
    // HANDLERS UI
    // ========================================
    const handleCloseAlert = () => {
        setShowAlert(false);
        setAlertMessage('');
    };

    const openAttendanceModal = (date: string, listType: 'internal' | 'csf') => {
        setSelectedDate(date);
        setSelectedListType(listType);
        setIsAttendanceModalOpen(true);
    };

    // Fonction pour récupérer les participants pour le PDF
    const fetchParticipantsForPDF = async () => {
        try {
            const participants = await TrainingGroupParticipantsService.fetchParticipantsForAttendanceList(groupId);

            // Filtrer les participants qui ont des invitations
            const invitedUserIds = invitations.map(inv => inv.userId);
            const filteredParticipants = participants.filter(user => invitedUserIds.includes(user.id));

            setParticipantsForPDF(filteredParticipants);
        } catch (error) {
            console.error('Erreur lors de la récupération des participants pour PDF:', error);
            setAlertMessage('Erreur lors de la récupération des participants');
            setAlertType('error');
            setShowAlert(true);
            setParticipantsForPDF([]);
        }
    };

    // ========================================
    // RENDU CONDITIONNEL
    // ========================================
    if (initialUsersLoading) {
        return <div>Chargement des utilisateurs...</div>;
    }

    if (initialUsersError) {
        return <div>Erreur lors du chargement des données.</div>;
    }

    // ========================================
    // RENDU PRINCIPAL
    // ========================================
    return (
        <form className=''>
            {showAlert && (
                <Alert
                    message={alertMessage}
                    type={alertType}
                    onClose={handleCloseAlert}
                />
            )}

            {/* Formulaire des effectifs */}
            <TrainingParticipantsForm
                formData={formData}
                staffError={staffError}
                onInputChange={handleInputChange}
            />

            {/* Tableau de sélection des utilisateurs */}
            <AvailableUsersSelectionTable
                users={users}
                selectedUsers={tempSelectedUsers}
                onUserSelection={handleUserSelection}
                onAddSelected={handleAddToSelected}
                isSubmitting={isSubmitting}
                tableConfig={TRAINING_PARTICIPANTS_TABLE_CONFIG.availableUsers}
            />

            {/* Tableau des invitations */}
            <TrainingInvitationsTable
                invitations={invitations}
                onCancelInvitation={handleCancelInvitation}
                onSendInvitations={() => setIsSendInvitationModalOpen(true)}
                isSubmitting={isSubmitting}
                isLoading={isLoadingInvitations}
                error={invitationsError}
                tableConfig={TRAINING_PARTICIPANTS_TABLE_CONFIG.trainingInvitations}
            />

            {/* Tableau des listes de présence */}
            {groupData?.dates && groupData.dates.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Listes de présence</h3>
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left bg-primary text-white font-medium tracking-wider">
                                    Type
                                </th>
                                {groupData.dates.map((date, index) => (
                                    <th key={index}
                                        className="px-4 py-3 text-center font-medium text-white bg-primary tracking-wider">
                                        {new Date(date).toLocaleDateString('fr-FR')}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            <tr className="hover:bg-gray-50">
                                <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-900">
                                    Liste de présence interne
                                </td>
                                {groupData.dates.map((date, index) => (
                                    <td key={index} className="px-4 py-4 whitespace-nowrap text-center">
                                        <button
                                            type="button"
                                            className="bg-red text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={async () => {
                                                await fetchParticipantsForPDF();
                                                openAttendanceModal(date, 'internal');
                                            }}
                                            disabled={invitations.length === 0}
                                        >
                                            PDF
                                        </button>
                                    </td>
                                ))}
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-900">
                                    Liste de présence CSF
                                </td>
                                {groupData.dates.map((date, index) => (
                                    <td key={index} className="px-4 py-4 whitespace-nowrap text-center">
                                        <button
                                            type="button"
                                            className="bg-red text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={async () => {
                                                await fetchParticipantsForPDF();
                                                openAttendanceModal(date, 'csf');
                                            }}
                                            disabled={invitations.length === 0}
                                        >
                                            PDF
                                        </button>
                                    </td>
                                ))}
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal de confirmation pour l'envoi d'invitations */}
            <Modal
                isOpen={isSendInvitationModalOpen}
                onClose={() => setIsSendInvitationModalOpen(false)}
                title="Invitation"
                subtitle="Veuillez confirmer"
                actions={[
                    {
                        label: "Non",
                        onClick: () => setIsSendInvitationModalOpen(false),
                        className: "border"
                    },
                    {
                        label: "Oui",
                        onClick: handleSendInvitations,
                        className: "bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd text-white",
                    },
                ]}
                icon=""
            >
                <div className="flex flex-col justify-center space-y-2">
                    <div className="font-bold text-center">
                        Vous êtes sur le point d'envoyer une invitation aux participants
                    </div>
                </div>
            </Modal>

            {/* Modal de génération de liste de présence */}
            <AttendanceListModal
                isOpen={isAttendanceModalOpen}
                onClose={() => {
                    setIsAttendanceModalOpen(false);
                    setParticipantsForPDF([]); // Reset des données
                }}
                trainingData={{
                    theme: 'Formation',
                    location: groupData?.location || '',
                    startDate: groupData?.dates?.[0] || '',
                }}
                groupData={groupData}
                participants={participantsForPDF}
                selectedDate={selectedDate}
                listType={selectedListType}
                companyData={companyData}
                ocfData={groupData?.trainingType === "Externe" && groupData?.ocf ?
                    {corporateName: groupData.ocf.corporateName} : null}
                onSave={async (pdfBlob: Blob) => {
                    try {
                        await TrainingGroupParticipantsService.saveAttendanceListPDF(
                            pdfBlob, trainingId, groupId, selectedDate, selectedListType, groupData?.name
                        );
                        setAlertMessage('PDF enregistré avec succès');
                        setAlertType('success');
                        setShowAlert(true);
                    } catch (error) {
                        setAlertMessage('Erreur lors de l\'enregistrement du PDF');
                        setAlertType('error');
                        setShowAlert(true);
                    }
                }}
                onSaveAndDownload={async (pdfBlob: Blob) => {
                    try {
                        await TrainingGroupParticipantsService.saveAttendanceListPDF(
                            pdfBlob, trainingId, groupId, selectedDate, selectedListType, groupData?.name
                        );
                        setAlertMessage('PDF enregistré avec succès');
                        setAlertType('success');
                        setShowAlert(true);
                    } catch (error) {
                        setAlertMessage('Erreur lors de l\'enregistrement du PDF');
                        setAlertType('error');
                        setShowAlert(true);
                    }
                }}
                trainingId={trainingId}
                groupId={groupId}
            />
        </form>
    );
};

export default TrainingGroupParticipants;