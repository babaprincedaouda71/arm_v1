import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import {F4_EVALUATION_URLS} from "@/config/urls";
import {AlertCircle, Calendar, CheckCircle, MapPin, User} from "lucide-react";

// Types pour les données
interface ParticipantInfo {
    participantId: number;
    fullName: string;
    cin: string;
    cnss: string;
    email: string;
}

interface TrainingInfo {
    groupName: string;
    trainingTheme: string;
    location: string;
    city: string;
}

interface Question {
    questionId: string;
    type: string;
    text: string;
    comment?: string;
    options?: string[];
    levels?: string[];
    required: boolean;
}

interface Questionnaire {
    questionnaireId: string;
    title: string;
    description: string;
    questions: Question[];
}

interface EvaluationForm {
    token: string;
    groupeEvaluationId: string;
    evaluationLabel: string;
    evaluationType: string;
    participant: ParticipantInfo;
    training: TrainingInfo;
    questionnaire: Questionnaire;
}

interface EvaluationResponse {
    questionId: string;
    responseType: string;
    textResponse?: string;
    commentResponse?: string;
    scoreResponse?: number;
    ratingResponse?: number;
    multipleChoiceResponse?: string[];
    singleChoiceResponse?: string;
    singleLevelChoiceResponse?: string;
}

export default function F4EvaluationResponsePage() {
    const router = useRouter();
    const {token} = router.query;

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [evaluationForm, setEvaluationForm] = useState<EvaluationForm | null>(null);
    const [responses, setResponses] = useState<Record<string, EvaluationResponse>>({});
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const scanQRCode = async () => {
        try {
            const response = await fetch(`${F4_EVALUATION_URLS.scan}/${token}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la validation du QR code');
            }

            const data = await response.json();

            if (!data.valid) {
                setError(data.message || 'QR code invalide');
                return;
            }

            setEvaluationForm(data.evaluationForm);
            initializeResponses(data.evaluationForm.questionnaire.questions);

        } catch (error: any) {
            setError(error.message || 'Erreur lors de la validation du QR code');
        } finally {
            setIsLoading(false);
        }
    };

    const initializeResponses = (questions: Question[]) => {
        const initialResponses: Record<string, EvaluationResponse> = {};
        questions.forEach(question => {
            initialResponses[question.questionId] = {
                questionId: question.questionId,
                responseType: question.type,
            };
        });
        setResponses(initialResponses);
    };

    const updateResponse = (questionId: string, field: keyof EvaluationResponse, value: any) => {
        setResponses(prev => ({
            ...prev,
            [questionId]: {
                ...prev[questionId],
                [field]: value
            }
        }));

        // Supprimer l'erreur de validation si elle existe
        if (validationErrors[questionId]) {
            setValidationErrors(prev => {
                const newErrors = {...prev};
                delete newErrors[questionId];
                return newErrors;
            });
        }
    };

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!evaluationForm) return false;

        evaluationForm.questionnaire.questions.forEach(question => {
            if (question.required) {
                const response = responses[question.questionId];
                const hasValue = !!response?.singleChoiceResponse;

                if (!hasValue) {
                    errors[question.questionId] = 'Cette question est obligatoire';
                }
            }
        });

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const submitForm = async () => {
        if (!validateForm()) {
            alert('Veuillez répondre à toutes les questions obligatoires');
            return;
        }

        setIsSubmitting(true);

        try {
            const responsesArray = Object.values(responses);

            const submitData = {
                token: evaluationForm!.token,
                responses: responsesArray
            };

            const response = await fetch(F4_EVALUATION_URLS.submit, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(submitData)
            });

            const result = await response.json();

            if (result.success) {
                setIsSubmitted(true);
            } else {
                setError(result.message || 'Erreur lors de la soumission');
            }

        } catch (error: any) {
            setError(error.message || 'Erreur lors de la soumission');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderQuestion = (question: Question) => {
        const response = responses[question.questionId];
        const hasError = !!validationErrors[question.questionId];

        return (
            <div className="space-y-4">
                {question.options?.map((option, index) => (
                    <label key={option}
                           className={`flex items-start space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                               response?.singleChoiceResponse === option
                                   ? 'border-blue-500 bg-blue-50 shadow-md'
                                   : hasError
                                       ? 'border-redShade-300 hover:border-redShade-400 bg-redShade-50'
                                       : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:bg-gray-100'
                           }`}>
                        <input
                            type="radio"
                            name={question.questionId}
                            checked={response?.singleChoiceResponse === option}
                            onChange={() => updateResponse(question.questionId, 'singleChoiceResponse', option)}
                            className="mt-1 w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-gray-900 leading-relaxed text-base font-medium flex-1">{option}</span>
                    </label>
                ))}
                {!question.options?.length && (
                    <div className="text-gray-500 italic text-center py-8">Aucune option disponible pour cette
                        question</div>
                )}
            </div>
        );
    };

    useEffect(() => {
        if (token && typeof token === 'string') {
            scanQRCode();
        }
    }, [token]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
                    <p className="text-gray-600 text-lg font-medium">Validation du QR code...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full">
                    <div className="text-center">
                        <AlertCircle className="w-16 h-16 text-redShade-500 mx-auto mb-6"/>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Erreur</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
                        <button
                            onClick={() => router.back()}
                            className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors w-full text-lg font-semibold"
                        >
                            Retour
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full">
                    <div className="text-center">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6"/>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Merci !</h2>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Vos réponses ont été enregistrées avec succès.
                        </p>
                        <div className="text-sm text-gray-500 space-y-2 bg-gray-50 p-4 rounded-xl">
                            <p><strong>Participant:</strong> {evaluationForm?.participant.fullName}</p>
                            <p><strong>Formation:</strong> {evaluationForm?.training.trainingTheme}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!evaluationForm) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-4 px-4">
            <div className="max-w-2xl mx-auto">
                {/* En-tête - optimisé mobile */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
                            {evaluationForm.questionnaire.title}
                        </h1>
                        <p className="text-gray-600 leading-relaxed">{evaluationForm.questionnaire.description}</p>
                    </div>

                    {/* Informations participant et formation - empilées sur mobile */}
                    <div className="space-y-6 border-t pt-6">
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                <User className="w-5 h-5 mr-2 text-blue-600"/>
                                Participant
                            </h3>
                            <div className="bg-blue-50 p-4 rounded-xl space-y-2">
                                <p className="text-sm"><strong>Nom:</strong> {evaluationForm.participant.fullName}</p>
                                <p className="text-sm"><strong>CIN:</strong> {evaluationForm.participant.cin}</p>
                                <p className="text-sm"><strong>CNSS:</strong> {evaluationForm.participant.cnss}</p>
                                <p className="text-sm"><strong>Email:</strong> {evaluationForm.participant.email}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                <Calendar className="w-5 h-5 mr-2 text-green-600"/>
                                Formation
                            </h3>
                            <div className="bg-green-50 p-4 rounded-xl space-y-2">
                                <p className="text-sm"><strong>Thème:</strong> {evaluationForm.training.trainingTheme}
                                </p>
                                <p className="text-sm"><strong>Groupe:</strong> {evaluationForm.training.groupName}</p>
                                <p className="text-sm flex items-center">
                                    <MapPin className="w-4 h-4 mr-1"/>
                                    {evaluationForm.training.location}, {evaluationForm.training.city}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Formulaire des questions - optimisé pour le touch */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        submitForm();
                    }}>
                        <div className="space-y-8">
                            {evaluationForm.questionnaire.questions.map((question, index) => (
                                <div key={question.questionId}
                                     className="border-b border-gray-100 pb-8 last:border-b-0">
                                    <div className="mb-6">
                                        <div className="flex items-start space-x-3 mb-4">
                                            <span
                                                className="bg-blue-600 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                                                {index + 1}
                                            </span>
                                            <h3 className="text-lg font-semibold text-gray-900 leading-relaxed">
                                                {question.text}
                                                {question.required && <span className="text-redShade-500 ml-1">*</span>}
                                            </h3>
                                        </div>
                                        {question.comment && (
                                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg ml-11">{question.comment}</p>
                                        )}
                                    </div>

                                    <div className="ml-11">
                                        {renderQuestion(question)}
                                    </div>

                                    {validationErrors[question.questionId] && (
                                        <div className="ml-11 mt-3">
                                            <p className="text-redShade-500 text-sm font-medium bg-redShade-50 p-3 rounded-lg">
                                                {validationErrors[question.questionId]}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Bouton de soumission - optimisé mobile */}
                        <div className="mt-8">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors text-lg font-bold shadow-lg"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center">
                                        <div
                                            className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                        Envoi En Cours...
                                    </span>
                                ) : (
                                    'Soumettre l\'évaluation'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

F4EvaluationResponsePage.useLayout = false;