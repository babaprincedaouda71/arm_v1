import CustomSelect from "@/components/FormComponents/CustomSelect";
import InputField from "@/components/FormComponents/InputField";
import Switch from "@/components/FormComponents/Switch";
import TextAreaField from "@/components/FormComponents/TextAreaField";
import ProtectedRoute from "@/components/ProtectedRoute";
import {UserRole} from "@/contexts/AuthContext";
import React, {ChangeEvent, useCallback, useEffect, useState} from "react";
import SwitchSelect, {SwitchOption} from "@/components/FormComponents/SwitchSelect2";
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";
import {useRouter} from "next/router";
import {PDF_URLS, TRAINING_URLS} from "@/config/urls";
import PDFGenerationModal from "@/components/ui/PDFGenerationModal";

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
    f
    location: string;
    theme: string;
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
    internalTrainer: boolean;
    ocf: boolean;
    sms: boolean;
}

const CancelTraining: React.FC = () => {
    const {navigateTo} = useRoleBasedNavigation();
    const router = useRouter();
    const {exercice, trainingId, planId} = router.query;

    // états pour le modal PDF dans le composant CancelTraining
    const [isPDFModalOpen, setPDFModalOpen] = useState(false);

    // Fonction pour générer le contenu dynamique
    const generateDynamicContent = useCallback((training: TrainingDto | null): string => {
        if (!training) {
            return `À tous,

Veuillez noter que la session de formation sur [Thème de la Formation] prévue le [Date] à [Lieu] a été annulée.

Toute information complémentaire vous sera communiquée en temps utile.

Merci de votre attention.

Cordialement,`;
        }

        // Formatage de la date
        const formattedDate = new Date(training.startDate).toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `À tous,

Veuillez noter que la session de formation sur "${training.theme}" prévue le ${formattedDate} à ${training.location} a été annulée.

Toute information complémentaire vous sera communiquée en temps utile.

Merci de votre attention.

Cordialement,`;
    }, []);

    // État pour stocker les données du formulaire
    const [formData, setFormData] = useState<FormData>({
        priority: "",
        recipient: "",
        object: "Annulation de Formation",
        content: `À tous,

Veuillez noter que la session de formation sur [Thème de la Formation] prévue le [Date] à [Lieu] a été annulée.

Toute information complémentaire vous sera communiquée en temps utile.

Merci de votre attention.

Cordialement,`,
        allParticipant: false,
        internalTrainer: false,
        ocf: false,
        sms: false,
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
        {id: 'formateur', label: 'Formateur interne', checked: false},
        {id: 'ocf', label: 'OCF', checked: false},
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
            const response = await fetch(`${TRAINING_URLS.getParticipants}/${trainingId}`, {
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

            console.log("Participants après mise à jour : ", participants);

        } catch (error) {
            console.error('Erreur lors de la récupération des participants:', error);
            setError('Impossible de charger les participants. Veuillez réessayer.');
        } finally {
            setIsLoading(false);
        }
    }, [trainingId]);

    // Fonction pour récupérer les données de la formation
    const fetchTrainingData = useCallback(async () => {
        if (!trainingId) return;

        try {
            const response = await fetch(`${TRAINING_URLS.getTrainingDetailForCancel}/${trainingId}`, {
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

    // Charger les participants au montage du composant
    useEffect(() => {
        fetchTrainingParticipants();
    }, [fetchTrainingParticipants]);

    // Charger les données de la formation au montage du composant
    useEffect(() => {
        fetchTrainingData();
    }, [fetchTrainingData]);

    // Mettre à jour le contenu dynamiquement quand les données de formation arrivent
    useEffect(() => {
        if (trainingData) {
            const dynamicContent = generateDynamicContent(trainingData);
            setFormData(prev => ({
                ...prev,
                content: dynamicContent
            }));
        }
    }, [trainingData, generateDynamicContent]);

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
        const formateurOption = newOptions.find(opt => opt.id === 'formateur');
        const ocfOption = newOptions.find(opt => opt.id === 'ocf');

        setFormData(prev => ({
            ...prev,
            allParticipant: allParticipantsOption?.checked || false,
            internalTrainer: formateurOption?.checked || false,
            ocf: ocfOption?.checked || false,
        }));
    }, []);

    // Gestionnaire pour les changements du CustomSelect
    const handleSelectChange = useCallback((event: { name: string; value: string }) => {
        const {name, value} = event;
        setFormData(prev => ({...prev, [name]: value}));
    }, []);

    // Gestionnaire pour l'annulation
    const handleCancel = useCallback(() => {
        if (exercice && planId) {
            navigateTo(`/Plan/annual/${exercice}`, {
                query: {planId}
            });
        }
    }, [exercice, planId, navigateTo]);

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

        // Validation des destinataires
        const selectedParticipantIds = getSelectedParticipants();
        const hasDestinataireSelected = selectedParticipantIds.length > 0 ||
            formData.internalTrainer ||
            formData.ocf;

        if (!hasDestinataireSelected) {
            errors.push('Veuillez sélectionner au moins un destinataire');
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
    }, [formData, getSelectedParticipants]);

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
            const selectedParticipantIds = getSelectedParticipants();

            // Préparation des données pour l'envoi
            const requestData = {
                priority: formData.priority.trim(),
                object: formData.object.trim(),
                content: formData.content.trim(),
                participantIds: selectedParticipantIds,
                includeInternalTrainer: formData.internalTrainer,
                includeOcf: formData.ocf,
                sendSms: formData.sms,
                trainingId: trainingId
            };

            console.log('Données à envoyer:', requestData);

            // Appel API pour l'annulation
            const response = await fetch(`${TRAINING_URLS.cancelTraining}`, {
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
                        errorMessage = 'Formation non trouvée.';
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
            alert('Annulation envoyée avec succès');

            // Redirection vers la page que vous définirez
            // Option 1: Retour vers le plan annuel
            if (exercice && planId) {
                navigateTo(`/Plan/annual/${exercice}`, {
                    query: {planId}
                });
            } else {
                // Option 2: Redirection par défaut (à personnaliser selon vos besoins)
                navigateTo('/dashboard'); // Changez cette route selon votre besoin

                // Option 3: Vous pouvez aussi utiliser router.push directement
                // router.push('/votre-page-de-destination');

                // Option 4: Redirection conditionnelle selon le rôle ou autre logique
                // navigateTo('/formations/liste');
            }

        } catch (error) {
            console.error('Erreur lors de l\'envoi:', error);
            setSubmitError(error instanceof Error ? error.message : 'Une erreur inconnue est survenue');
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, getSelectedParticipants, trainingId, validateForm, exercice, planId, navigateTo]);


    // fonctions pour gérer l'enregistrement du PDF
    const handleSavePDF = useCallback(async (pdfBlob: Blob) => {
        try {
            // Créer un FormData pour envoyer le fichier
            const formData = new FormData();
            formData.append('file', pdfBlob, `avis_annulation_${trainingData?.theme || 'formation'}_${new Date().toISOString().split('T')[0]}.pdf`);
            formData.append('trainingId', trainingId as string);

            // Appel API pour sauvegarder sur MinIO
            const response = await fetch(`${PDF_URLS.savePDFToMinio}`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la sauvegarde du PDF');
            }

            const result = await response.json();
            console.log('PDF sauvegardé:', result);

            // Afficher un message de succès
            alert('PDF enregistré avec succès');

        } catch (error) {
            console.error('Erreur lors de la sauvegarde du PDF:', error);
            alert('Erreur lors de l\'enregistrement du PDF');
            throw error;
        }
    }, [trainingId, trainingData]);

    const handleSaveAndDownloadPDF = useCallback(async (pdfBlob: Blob) => {
        // D'abord sauvegarder, puis le téléchargement sera géré par le modal
        await handleSavePDF(pdfBlob);
    }, [handleSavePDF]);

    return (
        <ProtectedRoute requiredRole={UserRole.Admin}>
            <div className="min-h-screen bg-backColor px-4 py-6">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden p-4">
                    <form className="mx-auto bg-white font-title rounded-lg px-6 pb-14 pt-4">
                        <div className="grid md:grid-cols-2 gap-y-4 gap-x-8 md:gap-x-16 lg:gap-x-24 mb-4">
                            <CustomSelect
                                label="Priorité"
                                name="priority"
                                options={Object.values(Priority)}
                                value={formData.priority}
                                onChange={handleSelectChange}
                            />

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

                            <InputField
                                label="Objet"
                                name="object"
                                value={formData.object}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Affichage des erreurs de validation */}
                        {submitError && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-start">
                                    <div className="text-red-600 text-sm">
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
                                    textAreaClassName="h-[300px]"
                                />

                                <Switch
                                    label="Envoyer une notification par SMS"
                                    name="sms"
                                    checked={formData.sms}
                                    onChange={(checked) => handleSwitchChange("sms", checked)}
                                    className="ml-[18%] md-custom:ml-[9%]"
                                />

                                <span
                                    className="text-primary font-tHead text-xs md:text-sm lg:text-base font-bold cursor-pointer ml-[18%] md-custom:ml-[9%]"
                                    onClick={() => setPDFModalOpen(true)}
                                >
                                    Générer un avis d'annulation pour l'OFPPT
                                </span>
                            </div>
                        </div>

                        <div className="mt-5 flex items-center justify-around text-xs md:text-sm lg:text-base">
                            <button
                                type="button"
                                className="bg-white border font-bold p-2 md:p-3 lg:p-4 rounded-xl hover:bg-gray-100 transition-colors"
                                onClick={handleCancel}
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
                {/* PDF Generation Modal */}
                <PDFGenerationModal
                    isOpen={isPDFModalOpen}
                    onClose={() => setPDFModalOpen(false)}
                    trainingData={trainingData}
                    groupData={null} // Vous devrez récupérer les données du groupe si nécessaire
                    onSave={handleSavePDF}
                    onSaveAndDownload={handleSaveAndDownloadPDF}
                />
            </div>
        </ProtectedRoute>
    );
};

export default CancelTraining;