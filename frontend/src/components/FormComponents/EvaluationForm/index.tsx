import React, {useEffect, useState} from "react"; // Assurez-vous que useEffect est importé
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
    questionnaireId?: string | string[] | undefined; // Rendre undefined possible si non fourni
    questionnaireType?: string | string[];
    onSubmit: (data: any) => void;
    initialData?: any | null; // Nouvelle prop pour les données initiales
}

export interface Question {
    id: string; // Devrait être unique, idéalement venant du backend pour les questions existantes
    type: string;
    text?: string;
    comment?: string; // Non utilisé dans le rendu actuel, mais gardé si besoin
    scoreValue?: number;
    options?: string[];
    scale?: number[]; // Non utilisé dans le rendu actuel, mais gardé si besoin
    levels?: string[];
    ratingValue?: number;
}

const EvaluationForm: React.FC<EvaluationFormProps> = ({
                                                           questionnaireId,
                                                           questionnaireType,
                                                           onSubmit,
                                                           initialData
                                                       }) => {
    const {navigateTo} = useRoleBasedNavigation();
    const [isAutomaticEnabled, setIsAutomaticEnabled] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        time: "",       // Format HH:mm
        days: 5,
        timing: "Après", // Valeur par défaut cohérente avec les options
        dateReference: "La date de fin de la session de formation", // Valeur par défaut
        smsNotification: false,
        // 'automatic' n'est pas dans formData, mais géré par isAutomaticEnabled
    });

    const [questions, setQuestions] = useState<Question[]>([]);

    // useEffect pour pré-remplir le formulaire avec initialData
    useEffect(() => {
        if (initialData && questionnaireId) { // S'assurer que nous sommes en mode édition et que les données sont là
            const {
                title = "",
                description = "",
                time = "",
                days = 5,
                timing = "Après",
                dateReference = "La date de fin de la session de formation",
                smsNotification = false,
                automatic = false, // Supposons que 'automatic' vient de initialData
                questions: initialQuestions = [] // Récupérer les questions
            } = initialData;

            setFormData({
                title,
                description,
                time,
                days,
                timing,
                dateReference,
                smsNotification,
            });
            setIsAutomaticEnabled(automatic);

            // Assurez-vous que chaque question a un ID unique, surtout si certaines viennent du backend et d'autres sont ajoutées localement.
            // Si les questions du backend ont déjà des IDs, utilisez-les. Sinon, générez-en.
            setQuestions(initialQuestions.map((q: any, index: number) => ({
                ...q,
                id: q.id || `loaded_${index}_${Math.random().toString(36).substring(2, 15)}`, // S'assurer d'un ID
                // Normaliser les données si nécessaire pour correspondre à l'interface Question
                // Par exemple, s'assurer que options/levels sont bien des arrays
                options: Array.isArray(q.options) ? q.options : ((q.type === "Réponse multiple" || q.type === "Réponse unique") ? [''] : undefined),
                levels: Array.isArray(q.levels) ? q.levels : (q.type === "MyEvaluationsComponent" ? ['', '', '', ''] : undefined),
                scoreValue: q.scoreValue !== undefined ? Number(q.scoreValue) : (q.type === "Score" ? 0 : undefined),
                ratingValue: q.ratingValue !== undefined ? Number(q.ratingValue) : (q.type === "Notation" ? 0 : undefined),
            })));
        }
    }, [initialData, questionnaireId]); // Dépendance à initialData et questionnaireId

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { // Etendre pour TextArea
        const {name, value, type} = e.target;
        // Pour les checkbox, la valeur est dans 'checked'
        const inputValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData({
            ...formData,
            [name]: inputValue,
        });
    };

    // handleTextAreaChange est maintenant fusionné dans handleInputChange
    // const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    //     setFormData({
    //         ...formData,
    //         [e.target.name]: e.target.value,
    //     });
    // };

    const handleQuestionInputChange = (id: string, name: string, value: string | number, optionOrLevelIndex?: number) => {
        setQuestions(prevQuestions =>
            prevQuestions.map(question => {
                if (question.id === id) {
                    if (name.startsWith('level-') && typeof optionOrLevelIndex === 'number' && question.levels) {
                        const newLevels = [...question.levels];
                        newLevels[optionOrLevelIndex] = String(value);
                        return {...question, levels: newLevels};
                    } else if (name.startsWith('option-') && typeof optionOrLevelIndex === 'number' && question.options) {
                        const newOptions = [...question.options];
                        newOptions[optionOrLevelIndex] = String(value);
                        return {...question, options: newOptions};
                    } else if (name === 'ratingValue') {
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
            id: `new_${Math.random().toString(36).substring(2, 15)}`, // Préfixer pour distinguer des questions chargées
            type: type,
            text: `Nouvelle question ${type}`, // Texte initial plus descriptif
            levels: type === "MyEvaluationsComponent" ? ['', '', '', ''] : undefined,
            options: ["Réponse multiple", "Réponse unique"].includes(type) ? ['Nouvelle option'] : undefined,
            scoreValue: type === "Score" ? 0 : undefined,
            ratingValue: type === "Notation" ? 0 : undefined,
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
                    ? {...question, options: [...question.options, 'Nouvelle option']}
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

    const handleSubmitForm = () => {
        // Inclure 'automatic' qui est géré par isAutomaticEnabled
        // et 'questions' dans l'objet data soumis
        onSubmit({...formData, questions, automatic: isAutomaticEnabled});
    };

    const pageTitle = questionnaireId ? `Modifier le Questionnaire : ${formData.title || ''}` : "Ajouter un nouveau Questionnaire";


    return (
        <ProtectedRoute requiredRole={UserRole.Admin}>
            <div className="w-full mx-auto p-6 space-y-6 bg-white rounded-lg">
                <div className="flex justify-between items-center mb-4 px-6">
                    <h1 className="text-2xl font-semibold text-gray-800">{pageTitle}</h1>
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
                    label="Description" // Orthographe corrigée
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange} // Utilisez handleInputChange
                />

                <div className="h-px bg-gray-200"/>

                <div className="space-y-4">
                    <h2 className="text-lg font-medium">Automatisation</h2>
                    <div className="h-px bg-gray-200"/>
                    <Switch
                        label="Activer l'envoi automatique pour ce modèle d'évaluation"
                        name="automatic_switch" // Ce 'name' est pour le composant Switch, pas directement pour formData
                        checked={isAutomaticEnabled}
                        onChange={setIsAutomaticEnabled} // Met à jour directement isAutomaticEnabled
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
                                    {/* Pour InputFieldNumber, assurez-vous qu'il appelle onChange
                                        correctement ou adaptez handleInputChange.
                                        Ici, on suppose qu'il fonctionne comme un InputField standard. */}
                                    <InputFieldNumber
                                        label="Nombre de jours"
                                        name="days"
                                        type="number"
                                        value={formData.days}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e)} // ou adaptez si InputFieldNumber a une signature onChange différente
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
                                name="smsNotification" // Ce name est correct car il correspond à une clé dans formData
                                checked={formData.smsNotification}
                                onChange={(checked) => // Ici, onChange passe directement la valeur 'checked'
                                    setFormData({...formData, smsNotification: checked})
                                }
                            />
                        </div>
                    )}
                </div>

                <div className="h-px bg-gray-200"/>

                <div className="space-y-4">
                    <h2 className="text-lg font-medium">Formulaire</h2>
                    <div className="h-px bg-gray-200"/>
                    <div className="mt-6 space-y-4">
                        {questions.map((question, index) => (
                            <div key={question.id}
                                 className="flex items-center gap-4 p-4 border rounded-md"> {/* Utilisez question.id comme clé */}
                                <div className="flex-1 space-y-2">
                                    <div>Question {index + 1} (Type: {question.type})</div>
                                    {/* Pour les champs de texte, fournir une chaîne vide par défaut si undefined */}
                                    {question.type === "Texte" && (
                                        <InputField
                                            label={`Texte de la question`}
                                            name="text" // Le nom ici est relatif à la question
                                            value={question.text || ''}
                                            onChange={(e) => handleQuestionInputChange(question.id, 'text', e.target.value)}
                                        />
                                    )}
                                    {question.type === "Commentaire" && (
                                        <InputField
                                            label={`Texte du commentaire`}
                                            name="text"
                                            value={question.text || ''}
                                            onChange={(e) => handleQuestionInputChange(question.id, 'text', e.target.value)}
                                        />
                                    )}
                                    {question.type === "Score" && (
                                        <>
                                            <InputField
                                                label={`Libellé Score`}
                                                name="text"
                                                value={question.text || ''}
                                                onChange={(e) => handleQuestionInputChange(question.id, 'text', e.target.value)}
                                            />
                                            <InputField
                                                label={`Valeur Score`}
                                                name="scoreValue"
                                                type="number"
                                                value={question.scoreValue !== undefined ? question.scoreValue : ''}
                                                onChange={(e) => handleQuestionInputChange(question.id, 'scoreValue', Number(e.target.value))}
                                            />
                                        </>
                                    )}
                                    {question.type === "MyEvaluationsComponent" && (
                                        <div className="space-y-2">
                                            <InputField
                                                label={`Libellé Évaluation`}
                                                name="text"
                                                value={question.text || ''}
                                                onChange={(e) => handleQuestionInputChange(question.id, 'text', e.target.value)}
                                            />
                                            {Array.isArray(question.levels) && question.levels.map((level, levelIndex) => (
                                                <InputField
                                                    key={levelIndex}
                                                    label={`Niveau ${levelIndex + 1}`}
                                                    name={`level-${levelIndex}`} // Nom unique pour le niveau
                                                    value={level || ''}
                                                    onChange={(e) => handleQuestionInputChange(question.id, `level-${levelIndex}`, e.target.value, levelIndex)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                    {question.type === "Notation" && (
                                        <>
                                            <InputField
                                                label={`Libellé Notation`}
                                                name="text"
                                                value={question.text || ''}
                                                onChange={(e) => handleQuestionInputChange(question.id, 'text', e.target.value)}
                                            />
                                            <RatingInput
                                                questionId={question.id} // L'ID de la question est important ici
                                                initialRating={question.ratingValue || 0}
                                                onRatingChange={(qId, rating) => handleQuestionInputChange(qId, 'ratingValue', rating)} // Adapter pour passer l'ID
                                            />
                                        </>
                                    )}
                                    {["Réponse multiple", "Réponse unique"].includes(question.type) && question.options && (
                                        <div className="space-y-2">
                                            <InputField
                                                label={`Libellé Question`}
                                                name="text"
                                                value={question.text || ''}
                                                onChange={(e) => handleQuestionInputChange(question.id, 'text', e.target.value)}
                                            />
                                            {question.options.map((option, optionIndex) => (
                                                <div key={optionIndex} className="flex items-center gap-2">
                                                    <InputField
                                                        label={`Option ${optionIndex + 1}`}
                                                        name={`option-${optionIndex}`} // Nom unique pour l'option
                                                        value={option || ''}
                                                        onChange={(e) => handleQuestionInputChange(question.id, `option-${optionIndex}`, e.target.value, optionIndex)}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="text-red-500 hover:text-red-700 p-1" // Ajustement du padding pour être plus cliquable
                                                        onClick={() => handleRemoveOption(question.id, optionIndex)}
                                                    >
                                                        <DeleteIcon/>
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
                                                onClick={() => handleAddOption(question.id)}
                                            >
                                                Ajouter une option
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <button
                                    className="px-3 py-2 text-red-500 hover:text-red-700 rounded-md transition-colors" // hover:text-red-700
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
                        {/* ... (Reste des boutons d'ajout de question, inchangé) ... */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
                                // {
                                //     name: "MyEvaluationsComponent",
                                //     icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                //                strokeWidth="2">
                                //         <path
                                //             d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                                //     </svg>
                                // },
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

                <div className="h-px bg-gray-200"/>

                <div className="flex justify-end">
                    <button
                        className="px-6 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition-colors"
                        onClick={handleSubmitForm} // Appelle la fonction handleSubmitForm
                    >
                        Enregistrer
                    </button>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default EvaluationForm;