import ProtectedRoute from "@/components/ProtectedRoute";
import {UserRole} from "@/contexts/AuthContext";
import CustomSelect from "@/components/FormComponents/CustomSelect";
import SwitchSelect, {SwitchOption} from "@/components/FormComponents/SwitchSelect2";
import InputField from "@/components/FormComponents/InputField";
import TextAreaField from "@/components/FormComponents/TextAreaField";
import Switch from "@/components/FormComponents/Switch";
import React, {ChangeEvent, useCallback, useEffect, useState} from "react";
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";
import {useRouter} from "next/router";
import {TRAINERS_URLS, TRAINING_GROUPE_URLS, TRAINING_INVITATION_URLS, TRAINING_URLS} from "@/config/urls";

// Interface correspondant au DTO Java Participant
interface ParticipantDto {
    id: number;
    name: string;
    email?: string;
}

// Interface pour les données de la formation
interface TrainingDto {
    id: string;
    startDate: string;
    location: string;
    theme: string;
}

// Interface pour le group
interface GroupDto {
    id: number;
    location: string;
    targetAudience: string;
    participantCount: number;
}

// Interface pour les données du formateur
interface TrainerDto {
    id: number;
    name: string;
    email?: string;
}

// Interface pour les participants du SwitchSelect (utilisez celle du SwitchSelect)
interface Participant {
    id: string;
    name: string;
    checked: boolean;
}

// Types pour les priorités
enum Priority {
    CRITICAL = "Critique/Urgent",
    HIGH = "Priorité Élevée",
    MEDIUM = "Priorité moyenne",
    LOW = "Faible priorité"
}

// Interface pour le formulaire
interface FormData {
    priority: string;
    recipient: string;
    object: string;
    content: string;
    allParticipant: boolean;
    sms: boolean;
    // Nouveaux champs pour formateur
    isTrainerInvitation?: boolean;
    trainerId?: number;
    confirmationLink?: string;
}

const SendInvitationPage = () => {
    const {navigateTo} = useRoleBasedNavigation();
    const router = useRouter();
    const {trainingId, groupId, type, trainerId} = router.query;

    // Déterminer si c'est une invitation formateur
    const isTrainerInvitation = type === 'trainer';

    // État pour les données du formateur
    const [trainerData, setTrainerData] = useState<TrainerDto | null>(null);
    const [groupInfo, setGroupInfo] = useState<GroupDto>(null);

    // Fonction pour générer le contenu dynamique pour participants
    const generateDynamicContent = useCallback((training: TrainingDto | null): string => {
        if (!training) {
            return `Cher Collaborateur,

Vous êtes invité à participer à une session de formation sur : [Thème de la formation].

Date : [Date]

Lieu : [Lieu]

Cordialement,`;
        }

        // Formatage de la date
        const formattedDate = new Date(training.startDate).toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `Cher Collaborateur,

Vous êtes invité à participer à une session de formation sur : ${training.theme}.

Date : ${formattedDate}

Lieu : ${training.location}

Cordialement,`;
    }, []);

    // Fonction pour générer le contenu pour formateur
    const generateTrainerContent = useCallback((
        training: TrainingDto | null,
        trainer: TrainerDto | null,
        group: any | null
    ): string => {
        if (!training || !trainer) {
            return `Cher [Nom du formateur],

Je suis heureux de vous informer que vous allez animer une session de formation sur [Thème de la formation].

Date : [Date]
Lieu : [Lieu]
Public cible : [Public cible]
Nombre de participants : [Nombre de participants]

Veuillez confirmer votre disponibilité en cliquant sur le lien ci-dessous.

Lien

Cordialement,`;
        }

        const formattedDate = new Date(training.startDate).toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `Cher ${trainer.name},

Je suis heureux de vous informer que vous allez animer une session de formation sur ${training.theme}.

Date : ${formattedDate}
Lieu : ${group.location}
Public cible : ${group?.targetAudience || '[Public cible]'}
Nombre de participants : ${group ? group.participantCount : '[Nombre de participants]'}

Veuillez confirmer votre disponibilité en cliquant sur le lien ci-dessous.

[Lien de confirmation à générer]

Cordialement,`;
    }, []);

    // État pour stocker les données du formulaire
    const [formData, setFormData] = useState<FormData>({
        priority: "",
        recipient: "",
        object: isTrainerInvitation ? "Invitation à animer une session de formation" : "Invitation à une session de formation",
        content: isTrainerInvitation ?
            `Cher [Nom du formateur],

Je suis heureux de vous informer que vous allez animer une session de formation sur [Thème de la formation].

Date : [Date]
Lieu : [Lieu]
Public cible : [Public cible]
Nombre de participants : [Nombre de participants]

Veuillez confirmer votre disponibilité en cliquant sur le lien ci-dessous.

Lien

Cordialement,` :
            `Cher [Nom],

Vous êtes invité à participer à une session de formation sur : [Thème de la formation].

Date : [Date]

Lieu : [Lieu]

Cordialement,`,
        allParticipant: false,
        sms: false,
        isTrainerInvitation,
        trainerId: trainerId ? parseInt(trainerId as string) : undefined,
    });

    // État pour les données de la formation
    const [trainingData, setTrainingData] = useState<TrainingDto | null>(null);

    // État pour les participants avec typage correct
    const [participants, setParticipants] = useState<SwitchOption[]>([
        {
            id: 'all-participants',
            label: 'Tous les participants',
            checked: false,
            hasSubOptions: true,
            subOptions: [] // Sera rempli par l'API
        },
    ]);

    // État pour gérer le chargement et les erreurs
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fonction pour récupérer les participants depuis l'API
    const fetchTrainingParticipants = useCallback(async () => {
        if (!trainingId) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${TRAINING_GROUPE_URLS.getParticipants}/${groupId}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const participantsData: ParticipantDto[] = await response.json();
            console.log("Participants récupérés : ", participantsData);

            // Conversion des participants en format Participant[] pour le SwitchSelect
            const formattedParticipants: Participant[] = participantsData.map(p => ({
                id: `p-${p.id}`,
                name: p.name,
                checked: false
            }));

            console.log("Participants formatés : ", formattedParticipants);

            // Mise à jour de l'état avec les participants récupérés
            setParticipants(prevParticipants =>
                prevParticipants.map(option =>
                    option.id === 'all-participants'
                        ? {
                            ...option,
                            subOptions: formattedParticipants
                        }
                        : option
                )
            );

        } catch (error) {
            console.error('Erreur lors de la récupération des participants:', error);
            setError('Impossible de charger les participants. Veuillez réessayer.');
        } finally {
            setIsLoading(false);
        }
    }, [trainingId, groupId]);

    // Fonction pour récupérer les données de la formation
    const fetchTrainingData = useCallback(async () => {
        if (!trainingId) return;

        try {
            const response = await fetch(`${TRAINING_URLS.getTrainingDetailForInvitation}/${trainingId}/${groupId}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const trainingData: TrainingDto = await response.json();
            console.log("Données de la formation récupérées : ", trainingData);
            setTrainingData(trainingData);
        } catch (e) {
            console.log(e.message);
        }
    }, [trainingId]);

    // Fonction pour récupérer les données du formateur
    const fetchTrainerData = useCallback(async () => {
        if (!trainerId || !isTrainerInvitation) return;

        try {
            const response = await fetch(`${TRAINERS_URLS.getTrainerName}/${trainerId}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const trainer: TrainerDto = await response.json();
            console.log("Données du formateur récupérées : ", trainer);
            setTrainerData(trainer);
        } catch (error) {
            console.error('Erreur lors de la récupération du formateur:', error);
            setError('Impossible de charger les données du formateur.');
        }
    }, [trainerId, isTrainerInvitation]);

    // Fonction pour récupérer les données du groupe
    const fetchGroupData = useCallback(async () => {
        if (!groupId || !isTrainerInvitation) return;

        try {
            const response = await fetch(`${TRAINING_GROUPE_URLS.getGroupDetailsForSendInvitationToTrainer}/${groupId}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const group = await response.json();
            console.log("Données du groupe récupérées : ", group);
            setGroupInfo(group);
        } catch (error) {
            console.error('Erreur lors de la récupération du groupe:', error);
        }
    }, [groupId, isTrainerInvitation]);

    // Charger les données selon le type d'invitation
    useEffect(() => {
        if (isTrainerInvitation) {
            fetchTrainerData();
            fetchGroupData();
        } else {
            fetchTrainingParticipants();
        }
    }, [isTrainerInvitation, fetchTrainerData, fetchGroupData, fetchTrainingParticipants]);

    // Charger les données de la formation dans tous les cas
    useEffect(() => {
        fetchTrainingData();
    }, [fetchTrainingData]);

    // Mettre à jour le contenu dynamiquement quand les données arrivent
    useEffect(() => {
        if (isTrainerInvitation && trainingData && trainerData) {
            const dynamicContent = generateTrainerContent(trainingData, trainerData, groupInfo);
            setFormData(prev => ({
                ...prev,
                content: dynamicContent
            }));
        } else if (!isTrainerInvitation && trainingData) {
            const dynamicContent = generateDynamicContent(trainingData);
            setFormData(prev => ({
                ...prev,
                content: dynamicContent
            }));
        }
    }, [trainingData, trainerData, groupInfo, isTrainerInvitation, generateTrainerContent, generateDynamicContent]);

    // Gestionnaire pour les changements d'input
    const handleInputChange = useCallback((
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    }, []);

    // Gestionnaire pour les changements de switch
    const handleSwitchChange = useCallback((name: keyof FormData, checked: boolean) => {
        setFormData(prev => ({...prev, [name]: checked}));
    }, []);

    // Gestionnaire pour les changements du SwitchSelect
    const handleSwitchSelectChange = useCallback((newOptions: SwitchOption[]) => {
        console.log("SwitchSelect changement:", newOptions);
        setParticipants(newOptions);

        // Mettre à jour l'état du formulaire en fonction des sélections
        const allParticipantsOption = newOptions.find(opt => opt.id === 'all-participants');

        setFormData(prev => ({
            ...prev,
            allParticipant: allParticipantsOption?.checked || false,
        }));
    }, []);

    // Gestionnaire pour les changements du CustomSelect
    const handleSelectChange = useCallback((event: { name: string; value: string }) => {
        const {name, value} = event;
        setFormData(prev => ({...prev, [name]: value}));
    }, []);

    // Gestionnaire pour l'annulation
    const handleCancel = useCallback(() => {
        if (trainingId && groupId) {
            navigateTo(`/Plan/annual/add-group`, {
                query: {
                    trainingId: trainingId,
                    groupId: groupId
                }
            });
        }
    }, [trainingId, groupId, navigateTo]);

    // Fonction pour obtenir les participants sélectionnés
    const getSelectedParticipants = useCallback((): number[] => {
        const selectedIds: number[] = [];

        participants.forEach(option => {
            if (option.id === 'all-participants' && option.subOptions) {
                option.subOptions.forEach(subOption => {
                    if (subOption.checked) {
                        // Extraire l'ID numérique depuis l'ID string (p-123 -> 123)
                        const numericId = parseInt(subOption.id.replace('p-', ''), 10);
                        if (!isNaN(numericId)) {
                            selectedIds.push(numericId);
                        }
                    }
                });
            }
        });

        return selectedIds;
    }, [participants]);

    // État pour gérer l'envoi
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Fonction de validation complète
    const validateForm = useCallback((): { isValid: boolean; errors: string[] } => {
        const errors: string[] = [];

        // Validation des champs obligatoires
        if (!formData.priority.trim()) {
            errors.push('La priorité est obligatoire');
        }

        if (!formData.object.trim()) {
            errors.push('L\'objet est obligatoire');
        }

        if (!formData.content.trim()) {
            errors.push('Le contenu est obligatoire');
        }

        // Validation des destinataires seulement pour les participants
        if (!isTrainerInvitation) {
            const selectedParticipantIds = getSelectedParticipants();
            if (selectedParticipantIds.length === 0) {
                errors.push('Veuillez sélectionner au moins un destinataire');
            }
        }

        // Validation de la longueur du contenu
        if (formData.content.trim().length < 10) {
            errors.push('Le contenu doit contenir au moins 10 caractères');
        }

        if (formData.content.trim().length > 2000) {
            errors.push('Le contenu ne peut pas dépasser 2000 caractères');
        }

        // Validation de l'objet
        if (formData.object.trim().length > 200) {
            errors.push('L\'objet ne peut pas dépasser 200 caractères');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }, [formData, getSelectedParticipants, isTrainerInvitation]);

    // Gestionnaire pour l'envoi du formulaire
    const handleSubmit = useCallback(async () => {
        // Reset des erreurs précédentes
        setSubmitError(null);

        // Validation complète
        const validation = validateForm();

        if (!validation.isValid) {
            setSubmitError(validation.errors.join('\n'));
            return;
        }

        // Vérification que trainingId existe
        if (!trainingId) {
            setSubmitError('ID de formation manquant');
            return;
        }

        setIsSubmitting(true);

        try {
            let requestData;
            let endpoint;

            if (isTrainerInvitation) {
                // Données pour invitation formateur
                requestData = {
                    priority: formData.priority.trim(),
                    object: formData.object.trim(),
                    content: formData.content.trim(),
                    trainerId: formData.trainerId,
                    sendSms: formData.sms,
                    trainingId: trainingId
                };
                endpoint = `${TRAINING_INVITATION_URLS.sendTrainerInvitation}/${groupId}`;
            } else {
                // Données pour invitation participants
                const selectedParticipantIds = getSelectedParticipants();
                requestData = {
                    priority: formData.priority.trim(),
                    object: formData.object.trim(),
                    content: formData.content.trim(),
                    participantIds: selectedParticipantIds,
                    sendSms: formData.sms,
                    trainingId: trainingId
                };
                endpoint = `${TRAINING_INVITATION_URLS.sendInvitations}/${groupId}`;
            }

            console.log('Données à envoyer:', requestData);

            // Appel API
            const response = await fetch(endpoint, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            // Gestion des erreurs HTTP
            if (!response.ok) {
                let errorMessage = 'Une erreur est survenue lors de l\'envoi';

                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch {
                    // Si la réponse n'est pas du JSON, utiliser le message par défaut
                    if (response.status === 400) {
                        errorMessage = 'Données invalides. Veuillez vérifier le formulaire.';
                    } else if (response.status === 401) {
                        errorMessage = 'Vous n\'êtes pas autorisé à effectuer cette action.';
                    } else if (response.status === 403) {
                        errorMessage = 'Accès refusé.';
                    } else if (response.status === 404) {
                        errorMessage = isTrainerInvitation ? 'Formateur non trouvé.' : 'Formation non trouvée.';
                    } else if (response.status >= 500) {
                        errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
                    }
                }

                throw new Error(errorMessage);
            }

            // Succès - récupération de la réponse
            const responseData = await response.json();
            console.log('Réponse du serveur:', responseData);

            // Message de succès
            alert(isTrainerInvitation ?
                'Invitation formateur envoyée avec succès' :
                'Invitations participants envoyées avec succès'
            );

            // Redirection vers la page de gestion du groupe
            if (trainingId && groupId) {
                navigateTo(`/Plan/annual/add-group`, {
                    query: {
                        trainingId: trainingId,
                        groupId: groupId
                    }
                });
            } else {
                // Option de secours
                navigateTo('/dashboard');
            }

        } catch (error) {
            console.error('Erreur lors de l\'envoi:', error);
            setSubmitError(error instanceof Error ? error.message : 'Une erreur inconnue est survenue');
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, getSelectedParticipants, trainingId, validateForm, groupId, navigateTo, isTrainerInvitation]);

    if (isLoading && !isTrainerInvitation) {
        return (
            <ProtectedRoute requiredRole={UserRole.Admin}>
                <div className="min-h-screen bg-backColor px-4 py-6 flex items-center justify-center">
                    <div>Chargement des participants...</div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute requiredRole={UserRole.Admin}>
            <div className="min-h-screen bg-backColor px-4 py-6">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden p-4">
                    <form className="mx-auto bg-white font-title rounded-lg px-6 pb-14 pt-4">
                        {/* Titre dynamique selon le type d'invitation */}
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-gray-900">
                                {isTrainerInvitation ?
                                    'Invitation Formateur' :
                                    'Invitation Participants'
                                }
                            </h1>
                            {/*{isTrainerInvitation && trainerData && (*/}
                            {/*    <p className="text-gray-600 mt-2">*/}
                            {/*        Envoi d'invitation à {trainerData.name}*/}
                            {/*    </p>*/}
                            {/*)}*/}
                        </div>

                        <div className="grid md:grid-cols-2 gap-y-4 gap-x-8 md:gap-x-16 lg:gap-x-24 mb-4">
                            <CustomSelect
                                label="Priorité"
                                name="priority"
                                options={Object.values(Priority)}
                                value={formData.priority}
                                onChange={handleSelectChange}
                            />

                            {/* Afficher le champ destinataire seulement pour les participants */}
                            {!isTrainerInvitation && (
                                <div>
                                    <SwitchSelect
                                        label="Destinataire"
                                        options={participants}
                                        onChange={handleSwitchSelectChange}
                                    />
                                    {isLoading && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            Chargement des participants...
                                        </p>
                                    )}
                                    {error && (
                                        <p className="text-sm text-red-500 mt-1">{error}</p>
                                    )}
                                </div>
                            )}

                            {/* Pour les formateurs, afficher les informations du formateur */}
                            {/*{isTrainerInvitation && trainerData && (*/}
                            {/*    <div>*/}
                            {/*        <label className="block text-sm font-medium text-gray-700 mb-2">*/}
                            {/*            Formateur sélectionné*/}
                            {/*        </label>*/}
                            {/*        <div className="p-3 bg-gray-50 rounded-lg border">*/}
                            {/*            <p className="font-medium text-gray-900">{trainerData.name}</p>*/}
                            {/*            {trainerData.email && (*/}
                            {/*                <p className="text-sm text-gray-600">{trainerData.email}</p>*/}
                            {/*            )}*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*)}*/}

                            <InputField
                                label="Objet"
                                name="object"
                                value={formData.object}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Affichage des erreurs de validation */}
                        {submitError && (
                            <div className="mb-4 p-4 bg-redShade-50 border border-redShade-200 rounded-lg">
                                <div className="flex items-start">
                                    <div className="text-redShade-600 text-sm">
                                        <strong>Erreur(s) de validation :</strong>
                                        <div className="mt-1 whitespace-pre-line">
                                            {submitError}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid md:grid-cols-1">
                            <div className="col-span-1 grid gap-y-4">
                                <TextAreaField
                                    label="Contenu"
                                    name="content"
                                    value={formData.content}
                                    onChange={handleInputChange}
                                    className="flex justify-start md-custom:w-[80%]"
                                    labelClassName="md-custom:flex-[0.49]"
                                    textAreaClassName={isTrainerInvitation ? "h-[400px]" : "h-[300px]"}
                                />

                                <Switch
                                    label="Envoyer une notification par SMS"
                                    name="sms"
                                    checked={formData.sms}
                                    onChange={(checked) => handleSwitchChange("sms", checked)}
                                    className="ml-[18%] md-custom:ml-[9%]"
                                />
                            </div>
                        </div>

                        <div className="mt-5 flex items-center justify-around text-xs md:text-sm lg:text-base">
                            <button
                                type="button"
                                className="bg-white border font-bold p-2 md:p-3 lg:p-4 rounded-xl hover:bg-gray-100 transition-colors"
                                onClick={handleCancel}
                                disabled={isSubmitting}
                            >
                                Annuler
                            </button>
                            <button
                                type="button"
                                className={`bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd hover:opacity-90 text-white font-bold p-2 md:p-3 lg:p-4 rounded-xl transition-opacity ${
                                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Envoi En Cours...' : 'Envoyer'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default SendInvitationPage;