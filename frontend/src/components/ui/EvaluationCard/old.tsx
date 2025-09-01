import React, {useRef, useState} from 'react';
import {Check, Edit, Eye, X} from "lucide-react"; // Changed import to include Edit icon
import ProgressBar from "@/components/ProgressBar";
import {QuestionsProps} from "@/types/dataTypes";
import QuestionCard from "@/components/ui/QuestionCard";
import {useAuth} from "@/contexts/AuthContext";
import {MY_EVALUATIONS_URLS, USER_RESPONSES_URLS} from "@/config/urls";
import {ConfirmModal} from "@/components/Tables/ConfirmModal";

interface EvaluationCardProps {
    id: string;
    category: string;
    status: string;
    title: string;
    description: string;
    type: string;
    startDate: string;
    progress: number;
    questions?: QuestionsProps[];
    onResponsesSaved?: () => void; // Nouvelle prop pour la fonction de mise à jour
}

interface UserResponse {
    id?: string;
    companyId?: number;
    userId: number;
    questionnaireId: string;
    questionId: string;
    responseType: string;
    textResponse?: string | null;
    commentResponse?: string | null;
    scoreResponse?: number | null;
    ratingResponse?: number | null;
    multipleChoiceResponse?: string[] | null;
    singleChoiceResponse?: string | null;
    singleLevelChoiceResponse?: string | null;
    status?: string;
    isSentToManger?: boolean;
    progression?: number;
    startDate?: string;
    lastModifiedDate?: string;
    campaignEvaluationId?: string | null;
}

const EvaluationCard: React.FC<EvaluationCardProps> = ({
                                                           id,
                                                           category,
                                                           status,
                                                           title,
                                                           description,
                                                           type,
                                                           startDate,
                                                           progress,
                                                           questions,
                                                           onResponsesSaved,
                                                       }) => {
    const {user} = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalResponses, setModalResponses] = useState<UserResponse[]>([]);
    const questionCardRef = useRef<any>(null);
    const [loadingResponses, setLoadingResponses] = useState(false);
    const [errorLoadingResponses, setErrorLoadingResponses] = useState<string | null>(null);
    const [modalMode, setModalMode] = useState<'view' | 'respond' | null>(null);
    const [isSentToManager, setIsSentToManager] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const getVerticalBarColorClass = () => {
        switch (status) {
            case "Terminée":
                return 'bg-green-500';
            case "En Cours":
                return 'bg-yellow-500';
            default:
                return 'bg-gray-500';
        }
    };

    const fetchResponses = async () => {
        console.log("Fetching responses...");
        if (status === "En Cours" || status === "Terminée") {
            setLoadingResponses(true);
            setErrorLoadingResponses(null);
            try {
                const response = await fetch(`${USER_RESPONSES_URLS.fetchUserResponses}/${user?.id}/${id}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: UserResponse[] = await response.json();
                setIsSentToManager(data?.[0]?.isSentToManger ?? false);
                console.log(data)
                setModalResponses(data);
            } catch (error: any) {
                console.error("Erreur lors de la récupération des réponses :", error);
                setErrorLoadingResponses("Erreur lors du chargement des réponses.");
            } finally {
                setLoadingResponses(false);
            }
        }
    };

    const handleOpenModal = (mode: 'view' | 'respond') => {
        setIsModalOpen(true);
        setModalMode(mode);
        if ((mode === 'view' || mode === 'respond') && (status === "En Cours" || status === "Terminée")) {
            fetchResponses();
        }
        // Si le mode est 'respond' et le statut n'est pas "En Cours" ou "Terminée",
        // alors modalResponses restera vide, ce qui est correct pour une nouvelle réponse.
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalMode(null);
        setModalResponses([]);
        setErrorLoadingResponses(null);
    };

    // Nouvelle fonction interne pour préparer les données de réponse
    const prepareResponsesToSend = (): Omit<UserResponse, 'id'>[] | null => {
        if (!questionCardRef.current?.getResponses) {
            console.error("QuestionCard ref or getResponses method not available.");
            return null;
        }
        const responses = questionCardRef.current.getResponses();
        const questionnaireId = id;
        const userId = user?.id;

        if (!userId) {
            console.error("L'ID de l'utilisateur n'est pas disponible.");
            return null;
        }

        const userResponsesToSend: Omit<UserResponse, 'id'>[] = [];
        const responseStartDate = startDate ? startDate : new Date().toISOString().split('T')[0];

        questions?.forEach((question) => {
            const baseResponse = {
                userId: userId,
                questionnaireId: questionnaireId,
                questionId: question.id,
                responseType: question.type,
                startDate: responseStartDate,
                lastModifiedDate: new Date().toISOString().split('T')[0],
            };

            switch (question.type) {
                case "Texte":
                    if (responses.textResponses[question.id] !== undefined && responses.textResponses[question.id] !== null) {
                        userResponsesToSend.push({
                            ...baseResponse,
                            textResponse: responses.textResponses[question.id],
                        });
                    }
                    break;
                case "Commentaire":
                    if (responses.commentResponses[question.id] !== undefined && responses.commentResponses[question.id] !== null) {
                        userResponsesToSend.push({
                            ...baseResponse,
                            commentResponse: responses.commentResponses[question.id],
                        });
                    }
                    break;
                case "Score":
                case "MyEvaluationsComponent":
                    if (responses.selectedScores[question.id] !== undefined && responses.selectedScores[question.id] !== null) {
                        userResponsesToSend.push({
                            ...baseResponse,
                            scoreResponse: responses.selectedScores[question.id],
                        });
                    }
                    break;
                case "Notation":
                    if (responses.ratingValues[question.id] !== undefined && responses.ratingValues[question.id] !== null) {
                        userResponsesToSend.push({
                            ...baseResponse,
                            ratingResponse: responses.ratingValues[question.id],
                        });
                    }
                    break;
                case "Réponse multiple":
                    if (responses.multipleChoices[question.id] && responses.multipleChoices[question.id].length > 0) {
                        userResponsesToSend.push({
                            ...baseResponse,
                            multipleChoiceResponse: responses.multipleChoices[question.id],
                        });
                    }
                    break;
                case "Réponse unique":
                    if (responses.singleChoices[question.id]) {
                        userResponsesToSend.push({
                            ...baseResponse,
                            singleChoiceResponse: responses.singleChoices[question.id],
                        });
                    }
                    break;
                default:
                    console.warn(`Type de question non géré pour l'envoi: ${question.type}`);
            }
        });
        return userResponsesToSend;
    };

    const sendResponsesToBackend = async (responsesToSend: Omit<UserResponse, 'id'>[]): Promise<boolean> => {
        if (responsesToSend.length === 0) {
            console.log("Aucune réponse à envoyer.");
            return true;
        }
        console.log("Données à envoyer au backend :", responsesToSend);
        try {
            const response = await fetch(`${USER_RESPONSES_URLS.sendUserResponse}/${id}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(responsesToSend),
            });
            if (!response.ok) {
                console.error("Erreur lors de l'envoi des réponses :", response);
                return false;
            } else {
                console.log("Réponses enregistrées avec succès.");
                return true;
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi des réponses :", error);
            return false;
        }
    };

    const handleSaveResponses = async () => {
        const responsesToSend = prepareResponsesToSend();
        if (!responsesToSend || responsesToSend.length === 0) {
            console.log("Pas de réponses à enregistrer.");
            handleCloseModal(); // Fermer la modale même s'il n'y a rien à envoyer
            if (onResponsesSaved) {
                onResponsesSaved();
            }
            return;
        }

        const success = await sendResponsesToBackend(responsesToSend);

        if (success) {
            handleCloseModal();
            if (onResponsesSaved) {
                onResponsesSaved();
            }
        }
    };

    const openConfirmModal = () => {
        setIsConfirmModalOpen(true);
    };
    const handleCloseConfirmModal = () => {
        setIsConfirmModalOpen(false);
    };

    const handleConfirmSendEvaluation = async () => {
        setIsConfirmModalOpen(false);
        // Préparer les réponses. On envoie même si le tableau est vide si l'utilisateur clique sur Envoyer
        const responsesToSend = {
            questionnaireId: id,
            userId: user?.id,
        }

        // Si l'enregistrement a réussi, maintenant mettre à jour le statut à 'Terminée'
        try {
            // Assurez-vous que cette URL et cette méthode sont corrects pour votre API de mise à jour du statut
            const statusUpdateResponse = await fetch(`${MY_EVALUATIONS_URLS.sendEvaluation}/${id}`, { // Exemple d'URL
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(responsesToSend),
            });

            if (!statusUpdateResponse.ok) {
                console.error("Erreur lors de la mise à jour du statut de l'évaluation :", statusUpdateResponse.statusText);
                // Gérer l'erreur
            } else {
                console.log("Statut de l'évaluation mis à jour avec succès.");
                // Rafraîchir la liste
                setIsSentToManager(true);
                if (onResponsesSaved) {
                    onResponsesSaved(); // Actualiser la liste des évaluations (et donc les réponses)
                }
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour du statut :", error);
            // Gérer les erreurs réseau
        }
    };

    const verticalBarColorClass = getVerticalBarColorClass();
    return (
        <div>
            <div className="relative rounded-lg border border-gray-200 shadow-sm overflow-hidden bg-white shadow-md">
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${verticalBarColorClass}`}></div>

                <div className="p-5 pl-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                        <div>
                            <h2 className="text-lg font-medium text-gray-900">{title}</h2>
                            <p className="text-sm text-gray-600">{category}</p>
                        </div>

                        <div className="flex items-center mt-2 md:mt-0">
                            {/* Cette span affiche le statut basé sur 'isSentToManager' */}
                            <span
                                className={`${isSentToManager ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'} 
                                    rounded-full border px-2.5 py-0.5 text-xs font-semibold flex items-center`}
                            >
                                {isSentToManager ? (
                                    <>
                                        <Check className="h-3 w-3 inline-block mr-1"/> Terminée
                                    </>
                                ) : (
                                    <>
                                        Brouillon
                                    </>
                                )}
                            </span>
                        </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">{description}</p>

                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div className="flex flex-wrap gap-2 mb-2 md:mb-0">
                            <div
                                className="bg-blue-500 rounded-full border px-2.5 py-0.5 text-xs font-semibold">{type}</div>
                            <span className="text-sm text-gray-500">{`Début: ${startDate}`}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Progression</span>
                            <span className="text-sm font-medium">{progress ?? 0}%</span>
                        </div>
                        <ProgressBar progress={progress}/>

                        <div
                            className="flex justify-end items-center mt-4"> {/* Ajout items-center pour aligner les boutons */}
                            {/* Bouton "Répondre" : Affiché pour En attente, En Cours, et Terminée */}
                            <button
                                onClick={() => handleOpenModal('respond')}
                                disabled={isSentToManager}  // Désactivé si isSentToManager === true
                                aria-disabled={isSentToManager}
                                className={`text-blue-700 flex items-center p-2 gap-1 transition-colors duration-300 ease-in-out mr-2
                                    ${isSentToManager
                                    ? "opacity-50 cursor-not-allowed"
                                    : "cursor-pointer hover:text-blue-900"}`}
                            >
                                <Edit className="h-4 w-4"/> Répondre
                            </button>
                            {/* Bouton "Voir détails" */}
                            <button
                                onClick={() => handleOpenModal('view')}
                                disabled={status !== "En Cours" && status !== "Terminée"} // Désactivé si NI "En Cours" NI "Terminée"
                                aria-disabled={status !== "En Cours" && status !== "Terminée"}
                                className={`text-gray-700 flex items-center p-2 gap-1 transition-colors duration-300 ease-in-out mr-2
                                        ${status !== "En Cours" && status !== "Terminée"
                                    ? "opacity-50 cursor-not-allowed"
                                    : "cursor-pointer hover:text-gray-900"}`}
                            >
                                <Eye className="h-4 w-4"/> Voir détails
                            </button>
                            {/* Nouveau Bouton "Envoyer l'évaluation" */}
                            <button
                                onClick={openConfirmModal}
                                disabled={status !== "Terminée" || isSentToManager}
                                aria-disabled={status !== "Terminée" || isSentToManager}
                                className={`text-green-700 flex items-center p-2 gap-1 transition-colors duration-300 ease-in-out 
                                    ${status !== "Terminée" || isSentToManager
                                    ? "opacity-50 cursor-not-allowed"
                                    : "cursor-pointer hover:text-green-900"}`}
                            >
                                {isSentToManager ? <Check className="h-4 w-4"/> : ""} Envoyer
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl relative">
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                            <X className="h-5 w-5"/>
                        </button>
                        <h2 className="text-xl font-semibold mb-1">{title}</h2>
                        <p className="text-sm text-gray-600 mb-4">{category}</p>
                        <div className="mb-4">
                            <p className="text-sm text-gray-700">{description}</p>
                        </div>
                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium">Progression</span>
                                <span className="text-sm font-medium">{progress ?? 0}% complété</span>
                            </div>
                            <ProgressBar progress={progress}/>
                        </div>

                        {loadingResponses ? (
                            <div>Chargement des réponses...</div>
                        ) : errorLoadingResponses ? (
                            <div className="text-red-600">{errorLoadingResponses}</div>
                        ) : questions && questions.length > 0 ? (
                            <>
                                <QuestionCard
                                    ref={questionCardRef}
                                    questions={questions}
                                    initialResponses={modalResponses}
                                    readOnly={modalMode === 'view'} // Prop pour le mode lecture seule
                                />
                                {modalMode === 'respond' && ( // Afficher les boutons d'action seulement en mode "respond"
                                    <div className="mt-6 flex justify-end"> {/* Alignement à droite */}
                                        <button
                                            onClick={handleSaveResponses} // Bouton Enregistrer seulement
                                            className="py-3 px-6 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                        >
                                            Enregistrer (Brouillon)
                                        </button>
                                        {/* Le bouton Envoyer est maintenant sur la carte */}
                                    </div>
                                )}
                                {modalMode === 'view' && ( // Message optionnel en mode visualisation
                                    <div className="mt-6 text-center text-gray-600">
                                        Mode visualisation - les réponses ne peuvent pas être modifiées.
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-gray-600">Aucune question disponible pour cette évaluation.</div>
                        )}
                    </div>
                </div>
            )}

            {/* Modal de confirmation d'envoi */}
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={handleCloseConfirmModal}
                onConfirm={handleConfirmSendEvaluation}
                title="Confirmation d'envoi"
                message="Êtes-vous sûr de vouloir envoyer cette évaluation ? Une fois envoyée, vous ne pourrez plus la modifier."
            />
        </div>
    );
};

export default EvaluationCard;