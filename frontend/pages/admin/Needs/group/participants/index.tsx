import React, {useEffect, useState} from 'react'; // Import useEffect
import {UserProps} from '@/types/dataTypes';
import useSWR from "swr";

// Components
import InputField from '@/components/FormComponents/InputField';
import Table from '@/components/Tables/Table/index';
import StatusRenderer from '@/components/Tables/StatusRenderer';
import {handleSort} from '@/utils/sortUtils';
import {statusConfig} from '@/config/tableConfig';
import DynamicActionsRenderer from '@/components/Tables/DynamicActionsRenderer';
import {NEEDS_GROUP_URLS, USERS_URLS} from '@/config/urls';
import {fetcher} from '@/services/api';
import useTable from '@/hooks/useTable';
import Alert from '@/components/Alert';
import {useRouter} from 'next/router';
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";

const TABLE_HEADERS_1 = ["Code", "Nom", "Prénoms", "Poste", "Niveau", "Manager", "Sélection"];
const TABLE_HEADERS_2 = ["Nom", "Prénoms", "CIN", "CNSS", "Actions"];
const TABLE_KEYS_1 = ["code", "firstName", "lastName", "position", "level", "manager", "selection"];
const TABLE_KEYS_2 = ["firstName", "lastName", "cin", "cnss", "actions"];

const ACTIONS_TO_SHOW = ["cancel"];
const RECORDS_PER_PAGE = 5;

// Interface pour les participants sélectionnés (similaire aux TeamInvitations dans Plan)
interface SelectedParticipant {
    id: number;
    firstName: string;
    lastName: string;
    cin: string;
    cnss: string;
    status: string;
}

// Définir une interface pour les données du groupe, incluant les IDs des utilisateurs sélectionnés
interface GroupData {
    id?: number; // ID du groupe si en mode édition
    targetAudience: string;
    managerCount: number;
    employeeCount: number;
    workerCount: number;
    temporaryWorkerCount: number;
    userGroupIds: number[]; // Assumant que les IDs sont des nombres
    // Ajoutez d'autres propriétés du groupe si nécessaire
}

interface ParticipantsProps {
    needId: string | string[] | undefined; // ID du besoin, requis pour l'ajout
    groupData?: GroupData; // Rendre groupData optionnel
    onGroupDataUpdated: (newGroupData: GroupData) => void; // Updated prop
}

const Participants = ({needId, groupData, onGroupDataUpdated}: ParticipantsProps) => {
    const {navigateTo, isCurrentPath, getPathWithoutRolePrefix} = useRoleBasedNavigation();
    const router = useRouter();

    // état pour gérer les alertes
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('success'); // Type de l'alerte
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCloseAlert = () => {
        setShowAlert(false);
        setAlertMessage('');
    };

    // form data
    const [formData, setFormData] = useState({
        targetAudience: '',
        staff: 0,
        managerCount: 0,
        employeeCount: 0,
        workerCount: 0,
        temporaryWorkerCount: 0,
    });

    // État pour gérer l'erreur de validation de l'effectif
    const [staffError, setStaffError] = useState('');

    // Data and State
    const {
        data: initialUsersData,
        error: initialUsersError,
        isLoading: initialUsersLoading
    } = useSWR<UserProps[]>(USERS_URLS.mutate, fetcher); // Ajoutez error et isLoading pour une meilleure gestion

    const [users, setUsers] = useState<UserProps[]>([]); // Utilisateurs disponibles à sélectionner
    const [selectedParticipants, setSelectedParticipants] = useState<SelectedParticipant[]>([]); // Participants sélectionnés (similaire aux TeamInvitations dans Plan)
    const [tempSelectedUsers, setTempSelectedUsers] = useState<Set<string>>(new Set()); // Pour suivre les sélections temporaires dans la première table
    const [isLoadingParticipants, setIsLoadingParticipants] = useState(false);
    const [participantsError, setParticipantsError] = useState<string | null>(null);

    // Fonction pour charger les participants sélectionnés depuis le backend
    const fetchSelectedParticipants = async () => {
        if (!groupData?.id) return;

        setIsLoadingParticipants(true);
        setParticipantsError(null);

        try {
            // Utilisez l'endpoint approprié pour récupérer les participants du groupe
            const response = await fetch(`${NEEDS_GROUP_URLS.getGroupParticipants}/${groupData.id}`, {
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch selected participants');
            }

            const data: SelectedParticipant[] = await response.json();
            setSelectedParticipants(data);
        } catch (error) {
            console.error('Error fetching selected participants:', error);
            setParticipantsError('Erreur lors du chargement des participants sélectionnés');
        } finally {
            setIsLoadingParticipants(false);
        }
    };

    // --- Nouvel useEffect pour charger les données en mode édition ou initialiser en mode ajout ---
    useEffect(() => {
        // Assurez-vous que les données initiales des utilisateurs sont chargées
        if (initialUsersData) {
            if (groupData) {
                // --- Mode Édition ---
                console.log("Mode Édition: Chargement des données du groupe", groupData);

                // Charger les données du groupe dans le formulaire
                setFormData({
                    targetAudience: groupData.targetAudience || '', // Utiliser || '' pour éviter undefined
                    managerCount: groupData.managerCount || 0,
                    employeeCount: groupData.employeeCount || 0,
                    workerCount: groupData.workerCount || 0,
                    temporaryWorkerCount: groupData.temporaryWorkerCount || 0,
                    staff: groupData.managerCount + groupData.employeeCount + groupData.workerCount + groupData.temporaryWorkerCount || 0,
                });

                // Identifier les IDs des utilisateurs sélectionnés dans le groupe
                const selectedIds = new Set((groupData.userGroupIds || []).map(id => id));

                // Partitionner initialUsersData en utilisateurs sélectionnés et non sélectionnés
                const usersForEdit = initialUsersData.filter(user => !selectedIds.has(user.id));

                setUsers(usersForEdit); // Les autres utilisateurs disponibles

                // Valider l'effectif chargé
                const sumLoadedCounts = (groupData.managerCount || 0) + (groupData.employeeCount || 0) + (groupData.workerCount || 0) + (groupData.temporaryWorkerCount || 0);
                if (formData.staff !== 0 && sumLoadedCounts !== formData.staff) {
                    setStaffError('La somme des effectifs chargés (' + sumLoadedCounts + ') ne correspond pas à l\'effectif total chargé (' + formData.staff + ').');
                } else {
                    setStaffError('');
                }

                // Charger les participants sélectionnés depuis le backend
                fetchSelectedParticipants();

            } else {
                // --- Mode Ajout ---
                console.log("Mode Ajout: Initialisation avec tous les utilisateurs");
                setUsers(initialUsersData); // Tous les utilisateurs sont disponibles pour l'ajout
                setSelectedParticipants([]); // Aucun participant n'est sélectionné au départ
                setFormData({ // Réinitialiser le formulaire en mode ajout si groupData devient null/undefined
                    targetAudience: '',
                    staff: 0,
                    managerCount: 0,
                    employeeCount: 0,
                    workerCount: 0,
                    temporaryWorkerCount: 0,
                });
                setStaffError(''); // Réinitialiser l'erreur en mode ajout
            }
        } else if (initialUsersError) {
            console.error("Erreur lors du chargement des utilisateurs initiaux:", initialUsersError);
            // Gérer l'erreur de chargement (afficher un message, etc.)
        }

    }, [groupData, initialUsersData, initialUsersError]); // Dépend des données du groupe et des utilisateurs initiaux

    // Hooks useTable pour le premier tableau (utilisateurs disponibles)
    const {
        currentPage: currentPageUsers,
        visibleColumns: visibleColumnsUsers,
        setCurrentPage: setCurrentPageUsers,
        handleSortData: handleSortDataUsers,
        totalPages: totalPagesUsers,
        totalRecords: totalRecordsUsers,
        paginatedData: paginatedUsersData,
        sortableColumns: sortableColumnsUsers,
    } = useTable(
        Array.isArray(users) ? users : [], // S'assurer que c'est un tableau
        TABLE_HEADERS_1,
        TABLE_KEYS_1,
        RECORDS_PER_PAGE,
    );

    // Hooks useTable pour le deuxième tableau (participants sélectionnés)
    const {
        currentPage: currentPageSelected,
        visibleColumns: visibleColumnsSelected,
        setCurrentPage: setCurrentPageSelected,
        handleSortData: handleSortDataSelected,
        totalPages: totalPagesSelected,
        totalRecords: totalRecordsSelected,
        paginatedData: paginatedSelectedParticipantsData,
        sortableColumns: sortableColumnsSelected,
    } = useTable(
        Array.isArray(selectedParticipants) ? selectedParticipants : [], // S'assurer que c'est un tableau
        TABLE_HEADERS_2,
        TABLE_KEYS_2,
        RECORDS_PER_PAGE,
    );

    // Renderers pour le premier tableau
    const renderers1 = {
        selection: (_: string, row: UserProps) => (
            <div className="flex justify-center items-center">
                <input
                    type="checkbox"
                    className="h-5 w-5 accent-primary"
                    checked={tempSelectedUsers.has(row.id.toString())}
                    onChange={(e) => {
                        const newTempSelectedUsers = new Set(tempSelectedUsers);
                        if (e.target.checked) {
                            newTempSelectedUsers.add(row.id.toString());
                        } else {
                            newTempSelectedUsers.delete(row.id.toString());
                        }
                        setTempSelectedUsers(newTempSelectedUsers);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Sélectionner ${row.firstName + ' ' + row.lastName}`}
                />
            </div>
        ),
    };

    // Fonction pour supprimer un participant sélectionné
    const handleCancelSelected = async (participantToRemove: SelectedParticipant) => {
        try {
            // Appel API pour supprimer le participant du groupe
            const response = await fetch(`${NEEDS_GROUP_URLS.removeGroupParticipant}/${groupData?.id}/${participantToRemove.id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                setAlertMessage('Participant retiré avec succès');
                setAlertType('success');
                setShowAlert(true);

                // Recharger les participants sélectionnés
                await fetchSelectedParticipants();

                // Récupérer les détails complets de l'utilisateur depuis initialUsersData
                if (initialUsersData) {
                    const userToAddBack = initialUsersData.find(user => user.id === participantToRemove.id);
                    if (userToAddBack) {
                        // Ajouter l'utilisateur de retour dans la liste des utilisateurs disponibles
                        setUsers(prevUsers => [...prevUsers, userToAddBack]);
                    }
                }

            } else {
                throw new Error('Erreur lors de la suppression du participant');
            }
        } catch (error) {
            console.error('Error removing participant:', error);
            setAlertMessage('Erreur lors de la suppression du participant');
            setAlertType('error');
            setShowAlert(true);
        }
    };

    // Renderers pour le deuxième tableau
    const renderers2 = {
        status: (value: string) => (
            <StatusRenderer value={value} groupeConfig={statusConfig}/>
        ),
        actions: (_: any, row: SelectedParticipant) => (
            <DynamicActionsRenderer
                actions={ACTIONS_TO_SHOW}
                row={row}
                openCancelModal={() => handleCancelSelected(row)}
            />
        ),
    };

    // Fonction pour ajouter les participants sélectionnés (envoi au backend)
    const handleAddToSelected = async () => {
        if (tempSelectedUsers.size === 0) return;

        const usersToAdd = users.filter(user => tempSelectedUsers.has(user.id.toString()));
        const {targetAudience, managerCount, employeeCount, workerCount, temporaryWorkerCount} = formData;

        // Convertir les valeurs du formulaire en nombres pour l'envoi
        const numManager = typeof managerCount === 'number' ? managerCount : parseInt(managerCount as any, 10) || 0;
        const numEmployee = typeof employeeCount === 'number' ? employeeCount : parseInt(employeeCount as any, 10) || 0;
        const numWorker = typeof workerCount === 'number' ? workerCount : parseInt(workerCount as any, 10) || 0;
        const numTemporary = typeof temporaryWorkerCount === 'number' ? temporaryWorkerCount : parseInt(temporaryWorkerCount as any, 10) || 0;

        // Récupérer les IDs existants depuis les participants sélectionnés + les nouveaux utilisateurs
        const existingUserIds = Array.isArray(selectedParticipants) ? selectedParticipants.map(participant => participant.id) : [];
        const selectedUserIds = [...existingUserIds, ...usersToAdd.map(user => user.id)];

        console.log('Selected user IDs:', selectedUserIds);

        const dataToSend = {
            id: groupData?.id, // Inclure l'ID si en mode édition
            targetAudience,
            managerCount: numManager,
            employeeCount: numEmployee,
            workerCount: numWorker,
            temporaryWorkerCount: numTemporary,
            userGroupIds: selectedUserIds,
        };

        console.log('Données à envoyer au backend:', dataToSend);

        setIsSubmitting(true);
        try {
            const url = groupData ?
                `${NEEDS_GROUP_URLS.editGroupParticipants}/${groupData.id}` : `${NEEDS_GROUP_URLS.addGroupParticipants}/${needId}`; // URL pour l'ajout ou la mise à jour
            const method = groupData ? 'PUT' : 'POST'; //

            const response = await fetch(url, {
                method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                console.log('Données envoyées avec succès');
                const responseData: GroupData = await response.json(); // Type assertion
                onGroupDataUpdated(responseData); // Calling the prop function with the response data

                // Mettre à jour les états locaux
                setUsers(users.filter(user => !tempSelectedUsers.has(user.id.toString())));
                setTempSelectedUsers(new Set());

                // Recharger les participants sélectionnés depuis le backend
                await fetchSelectedParticipants();

                // Afficher l'alerte de succès
                setAlertMessage('Participants ajoutés avec succès !');
                setAlertType('success');
                setShowAlert(true);

                navigateTo(NEEDS_GROUP_URLS.addPage, {
                    query: {needId: needId, groupId: responseData.id},
                });
            } else {
                const errorData = await response.json();
                console.error('Erreur lors de l\'envoi des données:', errorData);
                setAlertMessage('Erreur lors de l\'ajout des participants');
                setAlertType('error');
                setShowAlert(true);
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi des données:', error);
            setAlertMessage('Erreur lors de l\'ajout des participants');
            setAlertType('error');
            setShowAlert(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    // La logique de validation de l'effectif reste la même, mais s'applique aux valeurs de formData
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        let newValue;
        if (name === 'staff' || name.endsWith('Count')) {
            // Permettre la saisie de chaînes vides pour pouvoir effacer le champ
            newValue = value === '' ? '' : parseInt(value, 10) || 0;
        } else {
            newValue = value;
        }
        // Utiliser une fonction pour s'assurer d'avoir le dernier état pour la validation
        setFormData(prev => {
            const nextFormData = {...prev, [name]: newValue};
            // Validation en temps réel
            if (name === 'staff' || name.endsWith('Count')) {
                validateStaffCount(nextFormData);
            }
            return nextFormData;
        });
    };

    // Fonction de validation ajustée pour prendre le formulaire complet
    const validateStaffCount = (currentFormData: typeof formData) => {
        const {staff, managerCount, employeeCount, workerCount, temporaryWorkerCount} = currentFormData;

        // Convertir les valeurs en nombres, en traitant les chaînes vides comme 0 pour la somme
        const numStaff = typeof staff === 'number' ? staff : parseInt(staff as any, 10) || 0;
        const numManager = typeof managerCount === 'number' ? managerCount : parseInt(managerCount as any, 10) || 0;
        const numEmployee = typeof employeeCount === 'number' ? employeeCount : parseInt(employeeCount as any, 10) || 0;
        const numWorker = typeof workerCount === 'number' ? workerCount : parseInt(workerCount as any, 10) || 0;
        const numTemporary = typeof temporaryWorkerCount === 'number' ? temporaryWorkerCount : parseInt(temporaryWorkerCount as any, 10) || 0;

        const sumOfCounts = numManager + numEmployee + numWorker + numTemporary;

        // Appliquer la validation uniquement si l'effectif total n'est pas 0 ou si la somme n'est pas 0
        if ((numStaff !== 0 || sumOfCounts !== 0) && sumOfCounts !== numStaff) {
            setStaffError(`La somme des effectifs (${sumOfCounts}) doit être égale à l'effectif total (${numStaff}).`);
        } else {
            setStaffError('');
        }
    };

    // Optionnel: Afficher un indicateur de chargement ou une erreur pendant le fetch initial
    if (initialUsersLoading) {
        return <div>Chargement des utilisateurs...</div>;
    }

    if (initialUsersError) {
        return <div>Erreur lors du chargement des données.</div>;
    }

    return (
        <form className=''>
            {showAlert && (
                <Alert
                    message={alertMessage}
                    type={alertType}
                    onClose={handleCloseAlert}
                />
            )}
            {/* Form Fields */}
            <div className="grid md:grid-cols-2 md:gap-10 gap-4">
                <div>
                    <InputField
                        label="Public cible"
                        name="targetAudience"
                        value={formData.targetAudience} // Lier la valeur à l'état du formulaire
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <InputField
                        type='number'
                        label="Éffectif"
                        name="staff"
                        value={formData.staff} // Lier la valeur à l'état du formulaire
                        onChange={handleInputChange}
                    />
                    {staffError && <p className="text-red text-sm">{staffError}</p>}
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 mt-5">
                        <InputField
                            type='number'
                            label="Manager"
                            name="managerCount"
                            value={formData.managerCount} // Lier la valeur à l'état du formulaire
                            onChange={handleInputChange}
                        />
                        <InputField
                            type='number'
                            label="Employé"
                            name="employeeCount"
                            value={formData.employeeCount} // Lier la valeur à l'état du formulaire
                            onChange={handleInputChange}
                        />
                        <InputField
                            type='number'
                            label="Ouvrier"
                            name="workerCount"
                            value={formData.workerCount} // Lier la valeur à l'état du formulaire
                            onChange={handleInputChange}
                        />
                        <InputField
                            type='number'
                            label="Temporaire"
                            name="temporaryWorkerCount"
                            value={formData.temporaryWorkerCount} // Lier la valeur à l'état du formulaire
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </div>

            {/* Premier tableau - Sélectionner les participants */}
            <div className="mt-10">
                <h3 className="text-lg font-semibold mb-4">Sélectionner les participants</h3>
                <Table
                    data={paginatedUsersData}
                    keys={TABLE_KEYS_1}
                    headers={TABLE_HEADERS_1}
                    sortableCols={sortableColumnsUsers}
                    onSort={(column, order) => handleSortDataUsers(column, order, handleSort)}
                    isPagination={false}
                    pagination={{
                        currentPage: currentPageUsers,
                        totalPages: totalPagesUsers,
                        onPageChange: setCurrentPageUsers,
                    }}
                    totalRecords={totalRecordsUsers}
                    visibleColumns={visibleColumnsUsers}
                    renderers={renderers1}
                    loading={initialUsersLoading} // Afficher l'état de chargement
                />
                {/* Section : Bouton d'action */}
                <div className="text-right text-xs md:text-sm lg:text-base mt-2"> {/* Ajout de marge */}
                    <button
                        type="button" // Utiliser type="button" pour ne pas soumettre le formulaire ici
                        className="bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd hover:bg-indigo-700 text-white font-bold p-2 md:p-3 lg:p-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed" // Styles pour désactiver le bouton
                        onClick={handleAddToSelected}
                        disabled={tempSelectedUsers.size === 0 || isSubmitting} // Désactiver si rien n'est sélectionné temporairement ou En Cours de soumission
                    >
                        {isSubmitting ? 'Ajout En Cours...' : `Ajouter à la liste (${tempSelectedUsers.size})`}
                    </button>
                </div>
            </div>

            {/* Deuxième tableau - Participants sélectionnés */}
            <div className="mt-5">
                <h3 className="text-lg font-semibold mb-4">Participants sélectionnés</h3>
                {participantsError && (
                    <div className="text-red-600 mb-4">{participantsError}</div>
                )}
                <Table
                    data={paginatedSelectedParticipantsData}
                    keys={TABLE_KEYS_2}
                    headers={TABLE_HEADERS_2}
                    sortableCols={sortableColumnsSelected}
                    onSort={(column, order) => handleSortDataSelected(column, order, handleSort)}
                    isPagination={false}
                    pagination={{
                        currentPage: currentPageSelected,
                        totalPages: totalPagesSelected,
                        onPageChange: setCurrentPageSelected,
                    }}
                    totalRecords={totalRecordsSelected}
                    loading={isLoadingParticipants} // Afficher l'état de chargement
                    visibleColumns={visibleColumnsSelected}
                    renderers={renderers2}
                />
            </div>
        </form>
    );
};

export default Participants;