import React, {useState} from 'react';
import InputField from "@/components/FormComponents/InputField";
import TextAreaField from "@/components/FormComponents/TextAreaField";
import Switch from "@/components/FormComponents/Switch";
import CustomSelect from "@/components/FormComponents/CustomSelect";

interface InvitationPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onSend: (data: InvitationData) => void;
    trainerName?: string;
}

interface InvitationData {
    priority: string;
    recipient: string;
    subject: string;
    content: string;
    smsNotification: boolean;
}

const InvitationPopup: React.FC<InvitationPopupProps> = ({
                                                             isOpen,
                                                             onClose,
                                                             onSend,
                                                             trainerName = "Nom du formateur"
                                                         }) => {
    const [formData, setFormData] = useState<InvitationData>({
        priority: "Critique/Urgent",
        recipient: "",
        subject: "Confirmation de Formation",
        content: `Cher [${trainerName}],

J'ai le plaisir de vous informer que vous allez animer une session de formation sur [Thème de la formation].
Date : [Date]
Lieu : [Lieu]
Public cible : [Public cible]
Nombre de participants : [Nombre de participants]

Veuillez confirmer votre disponibilité en cliquant sur le lien ci-dessous.
Lien

Meilleures salutations.`,
        smsNotification: true
    });

    const priorityOptions = ["Critique/Urgent", "Important", "Normal", "Faible"];
    const recipientOptions = ["Formateur principal", "Formateur adjoint", "Tous les formateurs"];

    const handleInputChange = (field: keyof InvitationData, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSelectChange = (event: { name: string; value: string }) => {
        handleInputChange(event.name as keyof InvitationData, event.value);
    };

    const handleSubmit = () => {
        onSend(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl min-h-[60vh] max-h-[95vh] overflow-y-auto flex flex-col">
                {/* Header avec bordure bleue */}
                <div className="border-t-4 border-blue-500 p-8 pb-6 flex-1">
                    <div className="flex justify-between items-start mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800">Nouvelle invitation</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                        >
                            ×
                        </button>
                    </div>

                    {/* Formulaire */}
                    <div className="space-y-8">
                        {/* Première ligne: Priorité et Destinataire */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <CustomSelect
                                name="priority"
                                label="Priorité"
                                options={priorityOptions}
                                value={formData.priority}
                                onChange={handleSelectChange}
                                className="text-sm"
                                labelClassName="text-gray-700 font-medium"
                            />
                            <CustomSelect
                                name="recipient"
                                label="Destinataire"
                                options={recipientOptions}
                                value={formData.recipient}
                                onChange={handleSelectChange}
                                className="text-sm"
                                labelClassName="text-gray-700 font-medium"
                            />
                        </div>

                        {/* Objet */}
                        <InputField
                            label="Objet"
                            name="subject"
                            value={formData.subject}
                            onChange={(e) => handleInputChange('subject', e.target.value)}
                            className="text-sm"
                            labelClassName="text-gray-700 font-medium"
                        />

                        {/* Contenu */}
                        <TextAreaField
                            label="Contenu"
                            name="content"
                            value={formData.content}
                            onChange={(e) => handleInputChange('content', e.target.value)}
                            className="text-sm"
                            labelClassName="text-gray-700 font-medium"
                            textAreaClassName="min-h-[400px]"
                        />

                        {/* Switch SMS */}
                        <Switch
                            label="Envoyer une notification par SMS"
                            name="smsNotification"
                            checked={formData.smsNotification}
                            onChange={(checked) => handleInputChange('smsNotification', checked)}
                            className="text-sm"
                        />
                    </div>
                </div>

                {/* Footer avec boutons */}
                <div className="px-8 py-6 bg-gray-50 flex justify-end gap-4 flex-shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-8 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors text-base"
                    >
                        Annuler
                    </button>
                    <button
                        type={"button"}
                        onClick={handleSubmit}
                        className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-md hover:from-purple-600 hover:to-purple-700 transition-colors text-base"
                    >
                        Envoyer
                    </button>
                </div>
            </div>
        </div>
    );
};
export default InvitationPopup;