// src/components/Forms/EvaluationForm.tsx
import React, {useState} from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import {UserRole} from "@/contexts/AuthContext";
import InputField from "@/components/FormComponents/InputField";
import Switch from "@/components/FormComponents/Switch";
import InputFieldNumber from "@/components/FormComponents/InputFieldNumber";
import CustomSelect from "@/components/FormComponents/CustomSelect";
import DeleteIcon from "@/components/Svgs/DeleteIcon";
import TextAreaField from "@/components/FormComponents/TextAreaField";
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";
import RatingInput from "@/components/FormComponents/RatingInput";

interface EvaluationFormProps {
    questionnaireId?: string | string[];
    questionnaireType?: string | string[];
    onSubmit: (data: any) => void;
}

export interface Question {
    id: string;
    type: string;
    text?: string;
    comment?: string;
    scoreValue?: number;
    options?: string[];
    scale?: number[];
    levels?: string[];
    ratingValue?: number;
}

const EvaluationForm: React.FC<EvaluationFormProps> = ({questionnaireId, questionnaireType, onSubmit}) => {
    const {navigateTo} = useRoleBasedNavigation();
    const [isAutomaticEnabled, setIsAutomaticEnabled] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        time: "",
        days: 5,
        timing: "",
        dateReference: "",
        smsNotification: false,
    });

    const [questions, setQuestions] = useState<Question[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleQuestionInputChange = (id: string, name: string, value: string | number, index?: number) => {
        setQuestions(prevQuestions =>
            prevQuestions.map(question => {
                if (question.id === id) {
                    if (name.startsWith('level-') && typeof index === 'number' && question.levels) {
                        const newLevels = [...question.levels];
                        newLevels[index] = String(value);
                        return {...question, levels: newLevels};
                    } else if (name.startsWith('option-') && typeof index === 'number' && question.options) {
                        const newOptions = [...question.options];
                        newOptions[index] = String(value);
                        return {...question, options: newOptions};
                    } else if (name === 'ratingValue') {
                        // Handle rating value changes
                        return {...question, ratingValue: Number(value)};
                    } else {
                        return {...question, [name]: value};
                    }
                }
                return question;
            })
        );
    };

    const handleSelectChange = (event: { name: string; value: string }) => {
        setFormData((prevData) => ({
            ...prevData,
            [event.name]: event.value,
        }));
    };

    const handleAddQuestion = (type: string) => {
        const newQuestion: Question = {
            id: Math.random().toString(36).substring(2, 15),
            type: type,
            text: type === "Score" ? "Question Score" :
                (type === "Texte" ? "Question Texte" :
                    (type === "MyEvaluationsComponent" ? "Question Évaluation" :
                        (type === "Réponse multiple" ? "Question Réponses Multiples" :
                            (type === "Réponse unique" ? "Question Réponse Unique" :
                                (type === "Notation" ? "Question Notation" :
                                    (type === "Commentaire" ? "Question Commentaire" : undefined)))))),
            levels: type === "MyEvaluationsComponent" ? ['', '', '', ''] : undefined,
            options: ["Réponse unique", "Réponse multiple"].includes(type) ? [''] : undefined,
            scoreValue: type === "Score" ? 0 : undefined, // Initialiser scoreValue à 0
            ratingValue: type === "Notation" ? 0 : undefined, // Initialize ratingValue for Notation
        };
        setQuestions([...questions, newQuestion]);
    };

    const handleRemoveQuestion = (idToRemove: string) => {
        setQuestions(questions.filter((question) => question.id !== idToRemove));
    };

    const handleAddOption = (questionId: string) => {
        setQuestions(prevQuestions =>
            prevQuestions.map(question =>
                question.id === questionId && question.options
                    ? {...question, options: [...question.options, '']}
                    : question
            )
        );
    };

    const handleRemoveOption = (questionId: string, indexToRemove: number) => {
        setQuestions(prevQuestions =>
            prevQuestions.map(question =>
                question.id === questionId && question.options
                    ? {...question, options: question.options.filter((_, index) => index !== indexToRemove)}
                    : question
            )
        );
    };

    const handleBackToList = () => {
        navigateTo('/evaluation');
    };


    return (
        <ProtectedRoute requiredRole={UserRole.Admin}>
            <div className="w-full mx-auto p-6 space-y-6 bg-white rounded-lg">
                {/* Titre global et bouton Retour */}
                <div className="flex justify-between items-center mb-4 px-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Évaluation formation JavaScript</h1>
                    <button onClick={handleBackToList}
                            className="text-blue-500 border-2 rounded-xl p-2 hover:underline focus:outline-none">
                        Retour à la liste
                    </button>
                </div>
                <InputField
                    label="Titre de l'évaluation"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                />
                <TextAreaField
                    label="Desciption"
                    name="description"
                    value={formData.description}
                    onChange={handleTextAreaChange}
                />

                {/* Séparateur */}
                <div className="h-px bg-gray-200"/>

                {/* Section Automatisation */}
                <div className="space-y-4">
                    <h2 className="text-lg font-medium">Automatisation</h2>
                    <div className="h-px bg-gray-200"/>

                    <Switch
                        label="Activer l'envoi automatique pour ce modèle d'évaluation"
                        name="automatic"
                        checked={isAutomaticEnabled}
                        onChange={setIsAutomaticEnabled}
                    />

                    {isAutomaticEnabled && (
                        <div className="space-y-4">
                            <div className="flex gap-4 flex-col md:flex-row">
                                <div className="w-full md:w-[15%]">
                                    <InputField
                                        label="À"
                                        name="time"
                                        type="time"
                                        value={formData.time}
                                        onChange={handleInputChange}
                                        className="w-full"
                                    />
                                </div>

                                <div className="w-full md:w-[20%]">
                                    <InputFieldNumber
                                        label="Nombre de jours"
                                        name="days"
                                        type="number"
                                        value={formData.days}
                                        onChange={handleInputChange}
                                        className="w-full"
                                    />
                                </div>

                                <div className="w-full md:w-[20%]">
                                    <CustomSelect
                                        label=""
                                        name="timing"
                                        options={["Avant", "Après"]}
                                        value={formData.timing}
                                        onChange={handleSelectChange}
                                        className="w-full"
                                    />
                                </div>

                                <div className="w-full md:w-[50%]">
                                    <CustomSelect
                                        label=""
                                        name="dateReference"
                                        options={[
                                            "La date de début de la session de formation",
                                            "La date de fin de la session de formation",
                                        ]}
                                        value={formData.dateReference}
                                        onChange={handleSelectChange}
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            <Switch
                                label="Notifications par SMS"
                                name="smsNotification"
                                checked={formData.smsNotification}
                                onChange={(checked) =>
                                    setFormData({...formData, smsNotification: checked})
                                }
                            />
                        </div>
                    )}
                </div>

                {/* Séparateur */}
                <div className="h-px bg-gray-200"/>

                {/* Section Formulaire */}
                <div className="space-y-4">
                    <h2 className="text-lg font-medium">Formulaire</h2>
                    <div className="h-px bg-gray-200"/>

                    {/* Affichage des questions ajoutées ici (maintenant en premier) */}
                    <div className="mt-6 space-y-4">
                        {questions.map((question, index) => (
                            <div key={question.id} className="flex items-center gap-4 p-4 border rounded-md">
                                <div className="flex-1 space-y-2">
                                    <div>Question de type: {question.type}</div>
                                    {question.type === "Texte" && (
                                        <InputField
                                            label={`Question ${index + 1}`}
                                            name={`question-text-${question.id}`}
                                            value={question.text}
                                            onChange={(e) => handleQuestionInputChange(question.id, 'text', e.target.value)}
                                        />
                                    )}
                                    {question.type === "Commentaire" && (
                                        <InputField
                                            label={`Question ${index + 1}`}
                                            name={`question-commentaire-${question.id}`}
                                            value={question.text}
                                            onChange={(e) => handleQuestionInputChange(question.id, 'text', e.target.value)}
                                        />
                                    )}
                                    {question.type === "Score" && (
                                        <>
                                            <InputField
                                                label={`Libellé Score ${index + 1}`}
                                                name={`score-label-${question.id}`}
                                                value={question.text}
                                                onChange={(e) => handleQuestionInputChange(question.id, 'text', e.target.value)}
                                            />
                                            <InputField
                                                label={`Valeur Score ${index + 1}`}
                                                name={`score-value-${question.id}`}
                                                type="number"
                                                value={question.scoreValue !== undefined ? question.scoreValue : 0} // S'assurer que scoreValue a une valeur
                                                onChange={(e) => handleQuestionInputChange(question.id, 'scoreValue', Number(e.target.value))}
                                            />
                                        </>
                                    )}
                                    {question.type === "MyEvaluationsComponent" && (
                                        <div className="space-y-2">
                                            <InputField
                                                label={`Libellé Évaluation ${index + 1}`}
                                                name={`evaluation-label-${question.id}`}
                                                value={question.text}
                                                onChange={(e) => handleQuestionInputChange(question.id, 'text', e.target.value)}
                                            />
                                            {Array.isArray(question.levels) && question.levels.map((level, levelIndex) => (
                                                <InputField
                                                    key={levelIndex}
                                                    label={`Niveau ${levelIndex + 1}`}
                                                    name={`level-${levelIndex}`}
                                                    value={level}
                                                    onChange={(e) => handleQuestionInputChange(question.id, `level-${levelIndex}`, e.target.value, levelIndex)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                    {question.type === "Notation" && (
                                        <>
                                            <InputField
                                                label={`Libellé Notation ${index + 1}`}
                                                name={`notation-label-${question.id}`}
                                                value={question.text}
                                                onChange={(e) => handleQuestionInputChange(question.id, 'text', e.target.value)}
                                            />
                                            <RatingInput
                                                questionId={question.id}
                                                initialRating={question.ratingValue}
                                                onRatingChange={handleQuestionInputChange}
                                            />
                                        </>
                                    )}
                                    {["Réponse multiple", "Réponse unique"].includes(question.type) && question.options && (
                                        <div className="space-y-2">
                                            <InputField
                                                label={`Libellé Question ${index + 1}`}
                                                name={`single-multiple-label-${question.id}`}
                                                value={question.text}
                                                onChange={(e) => handleQuestionInputChange(question.id, 'text', e.target.value)}
                                            />
                                            {question.options.map((option, optionIndex) => (
                                                <div key={optionIndex} className="flex items-center gap-2">
                                                    <InputField
                                                        label={`Option ${optionIndex + 1}`}
                                                        name={`option-${optionIndex}`}
                                                        value={option}
                                                        onChange={(e) => handleQuestionInputChange(question.id, `option-${optionIndex}`, e.target.value, optionIndex)}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="text-red hover:text-red-700"
                                                        onClick={() => handleRemoveOption(question.id, optionIndex)}
                                                    >
                                                        <DeleteIcon/>
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                                onClick={() => handleAddOption(question.id)}
                                            >
                                                Ajouter une option
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <button
                                    className="px-3 py-2 text-red-500 hover:text-red rounded-md transition-colors"
                                    onClick={() => handleRemoveQuestion(question.id)}
                                >
                                    Supprimer
                                </button>
                            </div>
                        ))}
                    </div>

                    <div>
                        <p className="text-sm text-gray-600 mb-4">
                            Ajouter un nouveau type de question
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
                            {[
                                {
                                    name: "Texte",
                                    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                               strokeWidth="2">
                                        <path d="M4 6h16M4 12h16M4 18h7"/>
                                    </svg>
                                },
                                {
                                    name: "Commentaire",
                                    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                               strokeWidth="2">
                                        <path d="M4 6h16M4 12h16M4 18h7"/>
                                    </svg>
                                },
                                {
                                    name: "Score",
                                    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                               strokeWidth="2">
                                        <path
                                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-.181h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                                    </svg>
                                },
                                {
                                    name: "MyEvaluationsComponent",
                                    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                               strokeWidth="2">
                                        <path
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                                    </svg>
                                },
                                {
                                    name: "Notation",
                                    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                               strokeWidth="2">
                                        <path
                                            d="M12 2.138l-3.006 6.092L2.297 8.855l4.834 4.708L5.82 18.802 12 15.777l6.18 3.025-1.301-5.239 4.834-4.708-5.703-.625L12 2.138z"/>
                                    </svg>
                                },
                                {
                                    name: "Réponse unique",
                                    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                               strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"/>
                                        <path d="M12 8v8M8 12h8"/>
                                    </svg>
                                },
                                {
                                    name: "Réponse multiple",
                                    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                               strokeWidth="2">
                                        <path
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                                        <path d="M9 12l2 2 4-4"/>
                                    </svg>
                                },
                            ].map((item, index) => (
                                <button
                                    key={index}
                                    className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors"
                                    onClick={() => handleAddQuestion(item.name)}
                                >
                                    <div className="text-gray-600 mb-2">{item.icon}</div>
                                    <span className="text-sm text-center">{item.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Séparateur */}
                <div className="h-px bg-gray-200"/>

                {/* Bouton Enregistrer */}
                <div className="flex justify-end">
                    <button
                        className="px-6 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition-colors"
                        onClick={() => onSubmit({...formData, questions})}
                    >
                        Enregistrer
                    </button>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default EvaluationForm;