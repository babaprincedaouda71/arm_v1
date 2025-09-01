// // src/components/Forms/EvaluationForm.tsx
import React, {useState} from "react";
import InputField from "../InputField";
import CustomSelect from "../CustomSelect";
import Switch from "../Switch";
import InputFieldNumber from "../InputFieldNumber";

interface EvaluationFormProps {
    onSubmit: (data: any) => void;
}

const EvaluationForm: React.FC<EvaluationFormProps> = ({onSubmit}) => {
    const [isAutomaticEnabled, setIsAutomaticEnabled] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        time: "17:00",
        days: 5,
        timing: "Avant",
        dateReference: "La date de début de la session de formation",
        smsNotification: false,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSelectChange = (event: { name: string; value: string }) => {
        setFormData((prevData) => ({
            ...prevData,
            [event.name]: event.value,
        }));
    };

    return (
        <div className="w-full mx-auto p-6 space-y-6 bg-white rounded-lg">
            {/* Titre */}
            <InputField
                label="Titre de l'évaluation"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
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

                <div>
                    <p className="text-sm text-gray-600 mb-4">
                        Ajouter un nouveau type de question
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {[
                            {
                                name: "Texte",
                                icon: (
                                    <svg
                                        className="w-6 h-6"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="M4 6h16M4 12h16M4 18h7"/>
                                    </svg>
                                ),
                            },
                            {
                                name: "Score",
                                icon: (
                                    <svg
                                        className="w-6 h-6"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                                    </svg>
                                ),
                            },
                            {
                                name: "MyEvaluationsComponent",
                                icon: (
                                    <svg
                                        className="w-6 h-6"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                                    </svg>
                                ),
                            },
                            {
                                name: "Grille de choix",
                                icon: (
                                    <svg
                                        className="w-6 h-6"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                                    </svg>
                                ),
                            },
                            {
                                name: "Réponse unique",
                                icon: (
                                    <svg
                                        className="w-6 h-6"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <circle cx="12" cy="12" r="10"/>
                                        <path d="M12 8v8M8 12h8"/>
                                    </svg>
                                ),
                            },
                            {
                                name: "Réponse multiple",
                                icon: (
                                    <svg
                                        className="w-6 h-6"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                                        <path d="M9 12l2 2 4-4"/>
                                    </svg>
                                ),
                            },
                        ].map((item, index) => (
                            <button
                                key={index}
                                className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                onClick={() => {
                                    /* handle click */
                                }}
                            >
                                <div className="text-gray-600 mb-2">{item.icon}</div>
                                <span className="text-sm text-center">{item.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bouton Enregistrer */}
            <div className="flex justify-end">
                <button
                    className="px-6 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition-colors"
                    onClick={() => onSubmit(formData)}
                >
                    Enregistrer
                </button>
            </div>
        </div>
    );
};

export default EvaluationForm;