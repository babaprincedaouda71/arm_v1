import RatingInput from "@/components/FormComponents/RatingInput";
import {QuestionsProps} from "@/types/dataTypes";
import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";

interface QuestionCardProps {
    questions?: QuestionsProps[];
    initialResponses?: any[]; // Expecting an array of UserResponse-like objects
    onSaveResponses?: (responses: any) => void;
    readOnly?: boolean; // <-- Ajoutez cette ligne
}

const QuestionCard = forwardRef<any, QuestionCardProps>(({
                                                             questions = [],
                                                             initialResponses = [],
                                                             readOnly = false
                                                         }, ref) => {
    const [selectedScores, setSelectedScores] = useState<Record<string, number>>({});
    const [multipleChoices, setMultipleChoices] = useState<Record<string, string[]>>({});
    const [singleChoices, setSingleChoices] = useState<Record<string, string>>({});
    const [textResponses, setTextResponses] = useState<Record<string, string>>({});
    const [commentResponses, setCommentResponses] = useState<Record<string, string>>({});
    const [ratingValues, setRatingValues] = useState<Record<string, number>>({});

    useEffect(() => {
        if (initialResponses && questions) {
            const initialScores: Record<string, number> = {};
            const initialRatingValues: Record<string, number> = {};
            const initialMultipleChoices: Record<string, string[]> = {};
            const initialSingleChoices: Record<string, string> = {};
            const initialTextResponses: Record<string, string> = {};
            const initialCommentResponses: Record<string, string> = {};

            initialResponses.forEach(response => {
                const question = questions.find(q => q.id === response.questionId);
                if (question) {
                    switch (response.responseType) {
                        case "Score":
                            if (response.scoreResponse !== null && response.scoreResponse !== undefined) {
                                initialScores[response.questionId] = response.scoreResponse;
                            }
                            break;
                        case "Réponse multiple":
                            if (response.multipleChoiceResponse) {
                                initialMultipleChoices[response.questionId] = response.multipleChoiceResponse;
                            }
                            break;
                        case "Réponse unique":
                            if (response.singleChoiceResponse) {
                                initialSingleChoices[response.questionId] = response.singleChoiceResponse;
                            }
                            break;
                        case "Texte":
                            if (response.textResponse) {
                                initialTextResponses[response.questionId] = response.textResponse;
                            }
                            break;
                        case "Commentaire":
                            if (response.commentResponse) {
                                initialCommentResponses[response.questionId] = response.commentResponse;
                            }
                            break;
                        case "Notation":
                            if (response.ratingResponse !== null && response.ratingResponse !== undefined) { // MODIFIÉ [cite: 136]
                                initialRatingValues[response.questionId] = response.ratingResponse; // MODIFIÉ [cite: 136]
                            }
                            break;
                        default:
                            break;
                    }
                }
            });

            setSelectedScores(initialScores);
            setMultipleChoices(initialMultipleChoices);
            setSingleChoices(initialSingleChoices);
            setTextResponses(initialTextResponses);
            setCommentResponses(initialCommentResponses);
            setRatingValues(initialRatingValues);
        }
    }, [initialResponses, questions]);

    useImperativeHandle(ref, () => ({
        getResponses: () => ({
            selectedScores: selectedScores,
            multipleChoices: multipleChoices,
            singleChoices: singleChoices,
            textResponses: textResponses,
            commentResponses: commentResponses,
            ratingValues: ratingValues,
        }),
    }));

    const handleScoreSelect = (questionId: string, score: number) => {
        if (readOnly) return;
        setSelectedScores(prev => ({
            ...prev,
            [questionId]: score
        }));
    };

    const handleRatingChange = (questionId: string, name: string, value: number) => {
        if (readOnly) return;
        if (name === 'ratingValue') {
            setRatingValues(prev => ({
                ...prev,
                [questionId]: value,
            }));
        }
    };

    const handleMultipleChoiceChange = (questionId: string, option: string, checked: boolean) => {
        if (readOnly) return;
        setMultipleChoices(prev => {
            const currentSelections = prev[questionId] || [];
            if (checked) {
                return {...prev, [questionId]: [...currentSelections, option]};
            } else {
                return {...prev, [questionId]: currentSelections.filter(item => item !== option)};
            }
        });
    };

    const handleSingleChoiceChange = (questionId: string, option: string) => {
        if (readOnly) return;
        setSingleChoices(prev => ({
            ...prev,
            [questionId]: option
        }));
    };

    const handleTextChange = (questionId: string, text: string) => {
        if (readOnly) return;
        setTextResponses(prev => ({
            ...prev,
            [questionId]: text
        }));
    };

    const handleCommentChange = (questionId: string, text: string) => {
        if (readOnly) return;
        setCommentResponses(prev => ({
            ...prev,
            [questionId]: text
        }));
    };

    const renderScoreQuestion = (question: QuestionsProps) => {
        const selectedScore = selectedScores[question.id] || 0;
        const maxScore = question.scoreValue;

        return (
            <div className="mb-6">
                <p className="text-base mb-4">{question.text}</p>
                <div className="flex gap-2">
                    {Array.from({length: maxScore}, (_, i) => i + 1).map((score) => (
                        <button
                            key={score}
                            onClick={() => handleScoreSelect(question.id, score)}
                            className={`w-12 h-12 flex items-center justify-center rounded-md ${
                                selectedScore === score ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-800'
                            }`}
                            disabled={readOnly}
                        >
                            {score}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    const renderMultipleChoiceQuestion = (question: QuestionsProps) => {
        const selectedOptions = multipleChoices[question.id] || [];

        return (
            <div className="mb-6">
                <p className="text-base mb-4">{question.text}</p>
                <div className="flex flex-col gap-2">
                    {question.options?.map((option, index) => (
                        <label key={index} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={selectedOptions.includes(option)}
                                onChange={(e) => handleMultipleChoiceChange(question.id, option, e.target.checked)}
                                className="h-5 w-5 rounded border-gray-300"
                                disabled={readOnly}
                            />
                            <span>{option}</span>
                        </label>
                    ))}
                </div>
            </div>
        );
    };

    const renderSingleChoiceQuestion = (question: QuestionsProps) => {
        const selectedOption = singleChoices[question.id] || '';

        return (
            <div className="mb-6">
                <p className="text-base mb-4">{question.text}</p>
                <div className="flex flex-col gap-2">
                    {question.options?.map((option, index) => (
                        <label key={index} className="flex items-center gap-2">
                            <input
                                type="radio"
                                checked={selectedOption === option}
                                onChange={() => handleSingleChoiceChange(question.id, option)}
                                name={`question-${question.id}`}
                                className="h-5 w-5 rounded-full border-gray-300"
                                disabled={readOnly}
                            />
                            <span>{option}</span>
                        </label>
                    ))}
                </div>
            </div>
        );
    };

    const renderTextQuestion = (question: QuestionsProps) => {
        return (
            <div className="mb-6">
                <p className="text-base mb-4">{question.text}</p>
                <input
                    type="text"
                    value={textResponses[question.id] || ''}
                    onChange={(e) => handleTextChange(question.id, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Votre réponse..."
                    disabled={readOnly}
                />
            </div>
        );
    };

    const renderCommentQuestion = (question: QuestionsProps) => {
        return (
            <div className="mb-6">
                <p className="text-base mb-4">{question.text}</p>
                <textarea
                    value={commentResponses[question.id] || ''}
                    onChange={(e) => handleCommentChange(question.id, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Votre réponse..."
                    disabled={readOnly}
                />
            </div>
        );
    };

    const renderEvaluationQuestion = (question: QuestionsProps) => {
        const levels = question.levels || ['Pas du tout', 'Un peu', 'Bien', 'Très bien'];
        const selectedScore = selectedScores[question.id] || 0;

        return (
            <div className="mb-6">
                <p className="text-base mb-4">{question.text}</p>
                <div className="flex gap-2">
                    {levels.map((level, index) => (
                        <button
                            key={index}
                            onClick={() => handleScoreSelect(question.id, index + 1)}
                            className={`px-4 py-2 rounded-md ${
                                selectedScore === index + 1 ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-800'
                            }`}
                            disabled={readOnly}
                        >
                            {level || `Niveau ${index + 1}`}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    const questionRender = (question: QuestionsProps) => {
        switch (question.type) {
            case "Texte":
                return renderTextQuestion(question);
            case "Commentaire":
                return renderCommentQuestion(question);
            case "Score":
                return renderScoreQuestion(question);
            case "Réponse multiple":
                return renderMultipleChoiceQuestion(question);
            case "Réponse unique":
                return renderSingleChoiceQuestion(question);
            case "MyEvaluationsComponent":
                return renderEvaluationQuestion(question);
            case "Notation":
                return (
                    <div className="mb-6">
                        <p className="text-base mb-4">{question.text}</p>
                        <RatingInput
                            questionId={question.id}
                            initialRating={ratingValues[question.id]}
                            onRatingChange={handleRatingChange}
                            readOnly={readOnly}
                        />
                    </div>
                );
            default:
                return <div>Type de question non pris en charge: {question.type}</div>;
        }
    };

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-medium mb-6">Questions</h2>
            {/* Ajout d'un conteneur scrollable pour les questions */}
            <div className="max-h-96 overflow-auto mb-6">
                {questions.map((question) => (
                    <div key={question.id} className="mb-8">
                        {questionRender(question)}
                    </div>
                ))}
            </div>
            {/* Le reste (bouton) reste en dehors du conteneur scrollable */}
        </div>
    );
});

export default QuestionCard;