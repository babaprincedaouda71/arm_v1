import React, {useEffect, useRef, useState} from 'react';
import {Check, Edit, Eye} from "lucide-react";
import ProgressBar from "@/components/ProgressBar";
import {QuestionsProps} from "@/types/dataTypes";
import {useAuth} from "@/contexts/AuthContext";
import {MY_EVALUATIONS_URLS, USER_RESPONSES_URLS} from "@/config/urls";
import {ConfirmModal} from "@/components/Tables/ConfirmModal";
import QuestionResponseCard from "@/components/ui/QuestionResponseCard";

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
    onResponsesSaved?: () => void;
    isSentToManager?: boolean;
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
                                                           isSentToManager: initialIsSentToManager = false,
                                                       }) => {
    const {user} = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalResponses, setModalResponses] = useState<UserResponse[]>([]);
    const questionCardRef = useRef<any>(null);
    const [loadingResponses, setLoadingResponses] = useState(false);
    const [errorLoadingResponses, setErrorLoadingResponses] = useState<string | null>(null);
    const [modalMode, setModalMode] = useState<'view' | 'respond' | null>(null);
    const [isSentToManager, setIsSentToManager] = useState(initialIsSentToManager);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    // Mettre à jour l'état local si la prop change
    useEffect(() => {
        setIsSentToManager(initialIsSentToManager);
    }, [initialIsSentToManager]);

    // Fonction unifiée pour déterminer les couleurs basées sur le statut réel
    const getStatusColors = () => {
        // Si l'évaluation est envoyée au manager, elle est considérée comme terminée
        if (isSentToManager) {
            return {
                barColor: 'bg-green-500',
                badgeColor: 'bg-green-50 text-green-700 border-green-200',
                statusText: 'Terminée',
                statusIcon: <Check className="h-3 w-3 inline-block mr-1"/>
            };
        }

        // Sinon, on se base sur le statut de progression
        switch (status) {
            case "Terminée":
                return {
                    barColor: 'bg-blue-500', // Terminée mais pas encore envoyée
                    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
                    statusText: 'Prête à envoyer',
                    statusIcon: null
                };
            case "En Cours":
                return {
                    barColor: 'bg-yellow-500',
                    badgeColor: 'bg-yellow-50 text-yellow-700 border-yellow-200',
                    statusText: 'En Cours',
                    statusIcon: null
                };
            default:
                return {
                    barColor: 'bg-gray-500',
                    badgeColor: 'bg-gray-50 text-gray-700 border-gray-200',
                    statusText: 'Brouillon',
                    statusIcon: null
                };
        }
    };

    const fetchResponses = async () => {
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
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalMode(null);
        setModalResponses([]);
        setErrorLoadingResponses(null);
    };

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
            handleCloseModal();
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
        const responsesToSend = {
            questionnaireId: id,
            userId: user?.id,
        }

        try {
            const statusUpdateResponse = await fetch(`${MY_EVALUATIONS_URLS.sendEvaluation}/${id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(responsesToSend),
            });

            if (!statusUpdateResponse.ok) {
                console.error("Erreur lors de la mise à jour du statut de l'évaluation :", statusUpdateResponse.statusText);
            } else {
                console.log("Statut de l'évaluation mis à jour avec succès.");
                setIsSentToManager(true);
                if (onResponsesSaved) {
                    onResponsesSaved();
                }
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour du statut :", error);
        }
    };

    const statusColors = getStatusColors();

    return (
        <div>
            <div className="relative rounded-lg border border-gray-200 shadow-sm overflow-hidden bg-white shadow-md">
                {/* Barre verticale avec couleur synchronisée */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${statusColors.barColor}`}></div>

                <div className="p-5 pl-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                        <div>
                            <h2 className="text-lg font-medium text-gray-900">{title}</h2>
                            <p className="text-sm text-gray-600">{category}</p>
                        </div>

                        <div className="flex items-center mt-2 md:mt-0">
                            {/* Badge avec couleur synchronisée */}
                            <span
                                className={`${statusColors.badgeColor} rounded-full border px-2.5 py-0.5 text-xs font-semibold flex items-center`}>
                                {statusColors.statusIcon}
                                {statusColors.statusText}
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

                        <div className="flex justify-end items-center mt-4">
                            <button
                                onClick={() => handleOpenModal('respond')}
                                disabled={isSentToManager}
                                aria-disabled={isSentToManager}
                                className={`text-blue-700 flex items-center p-2 gap-1 transition-colors duration-300 ease-in-out mr-2
                                    ${isSentToManager
                                    ? "opacity-50 cursor-not-allowed"
                                    : "cursor-pointer hover:text-blue-900"}`}
                            >
                                <Edit className="h-4 w-4"/> Répondre
                            </button>
                            <button
                                onClick={() => handleOpenModal('view')}
                                disabled={status !== "En Cours" && status !== "Terminée"}
                                aria-disabled={status !== "En Cours" && status !== "Terminée"}
                                className={`text-gray-700 flex items-center p-2 gap-1 transition-colors duration-300 ease-in-out mr-2
                                        ${status !== "En Cours" && status !== "Terminée"
                                    ? "opacity-50 cursor-not-allowed"
                                    : "cursor-pointer hover:text-gray-900"}`}
                            >
                                <Eye className="h-4 w-4"/> Voir détails
                            </button>
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

            <QuestionResponseCard
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={title}
                category={category}
                description={description}
                progress={progress}
                loadingResponses={loadingResponses}
                errorLoadingResponses={errorLoadingResponses}
                questions={questions}
                initialResponses={modalResponses}
                mode={modalMode}
                onSaveDraft={handleSaveResponses}
                questionCardRef={questionCardRef}
            />

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