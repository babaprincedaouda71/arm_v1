// src/components/QuestionResponseCard.tsx (ou le chemin de votre choix)

import React, {RefObject} from 'react';
import {X} from 'lucide-react'; // Assurez-vous que lucide-react est installé
import ProgressBar from '@/components/ProgressBar'; // Adaptez le chemin si nécessaire
import QuestionCard from '@/components/ui/QuestionCard'; // Adaptez le chemin si nécessaire
import {QuestionsProps} from '@/types/dataTypes'; // Adaptez le chemin vers vos types

// Définition des props pour le composant QuestionResponseCard
interface QuestionResponseCardProps {
    isOpen: boolean; // Pour contrôler la visibilité de la modale
    onClose: () => void; // Fonction pour fermer la modale
    title: string;
    category: string;
    description: string;
    progress: number;
    loadingResponses: boolean;
    errorLoadingResponses: string | null;
    questions?: QuestionsProps[];
    initialResponses: UserResponse[]; // Anciennement modalResponses
    mode: 'view' | 'respond' | null; // Pour déterminer le mode d'affichage
    onSaveDraft?: () => void; // Fonction pour sauvegarder le brouillon
    questionCardRef: RefObject<any>; // Référence au composant QuestionCard
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

const QuestionResponseCard: React.FC<QuestionResponseCardProps> = ({
                                                                       isOpen,
                                                                       onClose,
                                                                       title,
                                                                       category,
                                                                       description,
                                                                       progress,
                                                                       loadingResponses,
                                                                       errorLoadingResponses,
                                                                       questions,
                                                                       initialResponses,
                                                                       mode,
                                                                       onSaveDraft,
                                                                       questionCardRef,
                                                                   }) => {
    // Si la modale n'est pas ouverte, ne rien rendre
    if (!isOpen) {
        return null;
    }

    // Voici le JSX de votre modale, adapté pour utiliser les props
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl relative">
                <button
                    onClick={onClose} // Utilise la prop onClose
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
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
                    <div className="text-redShade-600">{errorLoadingResponses}</div>
                ) : questions && questions.length > 0 ? (
                    <>
                        <QuestionCard
                            ref={questionCardRef} // Passe la réf au QuestionCard
                            questions={questions}
                            initialResponses={initialResponses}
                            readOnly={mode === 'view'} // Utilise la prop mode
                        />
                        {mode === 'respond' && ( // Utilise la prop mode
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={onSaveDraft} // Utilise la prop onSaveDraft
                                    className="py-3 px-6 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                >
                                    Enregistrer (Brouillon)
                                </button>
                            </div>
                        )}
                        {mode === 'view' && ( // Utilise la prop mode
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
    );
};

export default QuestionResponseCard;