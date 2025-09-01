import CustomSelect from '@/components/FormComponents/CustomSelect';
import FileInputField from '@/components/FormComponents/FileInputField';
import TextAreaField from '@/components/FormComponents/TextAreaField';
import InputField from '@/components/FormComponents/InputField';
import PDFField from '@/components/ui/PDFField';
import PDFModal from '@/components/ui/PDFModalProps';
import React, {useEffect, useState} from 'react';
import {FiCornerUpLeft} from "react-icons/fi";
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";
import {useRouter} from "next/router";
import {GROUPE_INVOICE_URLS} from "@/config/urls";
import useSWR from "swr";
import {fetcher} from "@/services/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import {UserRole} from "@/contexts/AuthContext";

// État initial du formulaire
const INITIAL_FORM_DATA = {
    type: "",
    description: "",
    amount: "",
    paymentDate: "",
    paymentMethod: "",
};

const INITIAL_FILES = {
    invoiceFile: null,
    bankRemiseFile: null,
    receiptFile: null,
};

interface AddGroupeInvoiceProps {
    onCancel: () => void;
    onSuccess: () => void;
    invoiceId?: string; // 🆕 Prop pour l'ID de la facture à éditer
}

const AddGroupeInvoice: React.FC<AddGroupeInvoiceProps> = ({ onCancel, onSuccess, invoiceId }) => {
    const {navigateTo} = useRoleBasedNavigation();
    const router = useRouter();
    const {trainingId, groupId} = router.query;

    // Déterminer si on est en mode édition
    const isEditMode = !!invoiceId;

    // État pour stocker les données du formulaire
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);

    // État pour stocker les fichiers
    const [files, setFiles] = useState(INITIAL_FILES);

    // État pour les fichiers existants (en mode édition)
    const [existingFiles, setExistingFiles] = useState({
        invoiceFile: null as string | null,
        bankRemiseFile: null as string | null,
        receiptFile: null as string | null,
    });

    // États pour le modal PDF (comme dans AccountingDetails)
    const [pdfModal, setPdfModal] = useState({
        isOpen: false,
        pdfUrl: null as string | null,
        title: '',
        isLoading: false
    });

    // État pour les erreurs de validation
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Récupération des données en mode édition
    const {data: invoiceData, error: invoiceError, isLoading} = useSWR(
        isEditMode ? `${GROUPE_INVOICE_URLS.getGroupeInvoiceDetails}/${invoiceId}` : null,
        fetcher
    );

    // Options pour les selects
    const typeOptions = [
        "Formation professionnelle",
        "Frais de restauration",
        "Frais de déplacement",
        "Matériel pédagogique",
        "Location de salle",
        "Intervenant externe",
        "Frais administratifs"
    ];

    const paymentMethodOptions = [
        "Chèque",
        "Virement bancaire",
        "Carte bancaire",
        "Espèces",
        "Prélèvement automatique"
    ];

    // Charger les données en mode édition
    useEffect(() => {
        if (isEditMode && invoiceData) {
            setFormData({
                type: invoiceData.type || "",
                description: invoiceData.description || "",
                amount: invoiceData.amount || "",
                paymentDate: invoiceData.paymentDate || "",
                paymentMethod: invoiceData.paymentMethod || "",
            });

            setExistingFiles({
                invoiceFile: invoiceData.invoiceFile || null,
                bankRemiseFile: invoiceData.bankRemiseFile || null,
                receiptFile: invoiceData.receiptFile || null,
            });
        }
    }, [isEditMode, invoiceData]);

    // Fonction pour réinitialiser le formulaire
    const resetForm = () => {
        setFormData(INITIAL_FORM_DATA);
        setFiles(INITIAL_FILES);
        setExistingFiles({
            invoiceFile: null,
            bankRemiseFile: null,
            receiptFile: null,
        });
        setErrors({});
        setIsSubmitting(false);
    };

    // Fonction pour gérer les changements dans les champs du formulaire
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Supprimer l'erreur pour ce champ s'il y en avait une
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    // Fonction pour gérer les changements dans les selects
    const handleSelectChange = (event) => {
        const {name, value} = event;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Supprimer l'erreur pour ce champ s'il y en avait une
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    // Fonction pour gérer les changements de fichiers
    const handleFileChange = (fieldName) => (selectedFiles) => {
        // Prendre seulement le premier fichier (pas de multiple)
        const file = selectedFiles.length > 0 ? selectedFiles[0] : null;

        // Validation du fichier PDF
        if (file) {
            if (!isPdfFile(file)) {
                setErrors(prev => ({
                    ...prev,
                    [fieldName]: "Seuls les fichiers PDF sont acceptés"
                }));
                return;
            }

            if (file.size > 10 * 1024 * 1024) { // 10MB max
                setErrors(prev => ({
                    ...prev,
                    [fieldName]: "Le fichier ne peut pas dépasser 10MB"
                }));
                return;
            }
        }

        setFiles(prev => ({
            ...prev,
            [fieldName]: file
        }));

        // Supprimer l'erreur pour ce fichier s'il y en avait une
        if (errors[fieldName]) {
            setErrors(prev => ({
                ...prev,
                [fieldName]: null
            }));
        }
    };

    // Fonction pour vérifier si c'est un fichier PDF
    const isPdfFile = (file) => {
        const contentType = file.type;
        const filename = file.name;

        return (contentType && contentType === "application/pdf") ||
            (filename && filename.toLowerCase().endsWith(".pdf"));
    };

    // Validation du formulaire
    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.type.trim()) {
            newErrors.type = "Le type de facture est obligatoire";
        }

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            newErrors.amount = "Le montant doit être supérieur à 0";
        }

        if (!formData.description.trim()) {
            newErrors.description = "La description est obligatoire";
        }

        if (!formData.paymentMethod.trim()) {
            newErrors.paymentMethod = "La méthode de paiement est obligatoire";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Fonction pour soumettre le formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Créer FormData pour l'envoi multipart
            const formDataToSend = new FormData();

            // Ajouter les données JSON comme Blob avec le bon Content-Type
            const invoiceData = {
                type: formData.type,
                description: formData.description,
                amount: parseFloat(formData.amount),
                paymentDate: formData.paymentDate || null,
                paymentMethod: formData.paymentMethod,
                ...(isEditMode ? {} : { creationDate: new Date().toISOString().split('T')[0] })
            };

            // Le @RequestPart attend un objet JSON, pas une string
            formDataToSend.append('invoice', new Blob([JSON.stringify(invoiceData)], {
                type: 'application/json'
            }));

            // Ajouter les fichiers s'ils existent
            if (files.invoiceFile) {
                formDataToSend.append('invoiceFile', files.invoiceFile);
            }
            if (files.bankRemiseFile) {
                formDataToSend.append('bankRemiseFile', files.bankRemiseFile);
            }
            if (files.receiptFile) {
                formDataToSend.append('receiptFile', files.receiptFile);
            }

            // Déterminer l'URL et la méthode selon le mode
            const url = isEditMode
                ? `${GROUPE_INVOICE_URLS.editGroupeInvoice}/${invoiceId}`
                : `${GROUPE_INVOICE_URLS.addGroupeInvoice}/${groupId}`;
            const method = isEditMode ? 'PUT' : 'POST';

            // Envoyer la requête
            const response = await fetch(url, {
                method: method,
                credentials: 'include',
                body: formDataToSend,
            });

            if (response.ok) {
                // Succès - réinitialiser le formulaire et fermer
                resetForm();

                // Si une fonction onSuccess est fournie, l'appeler
                if (onSuccess) {
                    onSuccess();
                } else {
                    // Sinon, naviguer vers la liste (comportement de fallback)
                    navigateTo(`/Plan/annual/add-group`, {
                        query: {
                            trainingId: trainingId,
                            groupId: groupId,
                            tab: 'accounting',
                        }
                    });
                }
            } else {
                const errorData = await response.json();
                console.error('Erreur lors de la sauvegarde:', errorData);
                setErrors({submit: `Erreur lors de la ${isEditMode ? 'modification' : 'création'} de la facture`});
            }
        } catch (error) {
            console.error('Erreur réseau:', error);
            setErrors({submit: "Erreur de connexion"});
        } finally {
            setIsSubmitting(false);
        }
    };

    // Fonction pour gérer le retour à la liste
    const handleBackToList = () => {
        resetForm();

        // Si une fonction onCancel est fournie, l'appeler
        if (onCancel) {
            onCancel();
        } else {
            // Sinon, naviguer vers la liste (comportement de fallback)
            navigateTo(`/Plan/annual/add-group`, {
                query: {
                    trainingId: trainingId,
                    groupId: groupId,
                }
            });
        }
    };

    // Fonction pour voir un PDF existant avec modal (inspiré d'AccountingDetails)
    const handleViewPDF = async (fileType: 'invoice' | 'bankRemise' | 'receipt') => {
        if (!isEditMode || !invoiceId) return;

        const fileNames = {
            invoice: existingFiles.invoiceFile,
            bankRemise: existingFiles.bankRemiseFile,
            receipt: existingFiles.receiptFile
        };

        const titles = {
            invoice: 'Fichier de facture',
            bankRemise: 'Remise de la banque',
            receipt: 'Reçu de paiement'
        };

        const fileName = fileNames[fileType];
        if (!fileName) return;

        setPdfModal({
            isOpen: true,
            pdfUrl: null,
            title: titles[fileType],
            isLoading: true
        });

        try {
            // Appel API pour récupérer le PDF
            const response = await fetch(`${GROUPE_INVOICE_URLS.getPdf}/${invoiceId}/${fileType}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const blob = await response.blob();

                // Vérifier que c'est bien un PDF
                if (blob.type !== 'application/pdf') {
                    // Si ce n'est pas un PDF, forcer le type
                    const pdfBlob = new Blob([blob], {type: 'application/pdf'});
                    const pdfUrl = URL.createObjectURL(pdfBlob);

                    setPdfModal(prev => ({
                        ...prev,
                        pdfUrl: pdfUrl + '#toolbar=0&navpanes=0&scrollbar=0',
                        isLoading: false
                    }));
                } else {
                    const pdfUrl = URL.createObjectURL(blob);

                    setPdfModal(prev => ({
                        ...prev,
                        pdfUrl: pdfUrl + '#toolbar=0&navpanes=0&scrollbar=0',
                        isLoading: false
                    }));
                }
            } else {
                throw new Error('Erreur lors du chargement du PDF');
            }
        } catch (error) {
            console.error('Erreur lors du chargement du PDF:', error);
            setPdfModal(prev => ({
                ...prev,
                isLoading: false
            }));
        }
    };

    // Fonction pour fermer le modal et nettoyer l'URL
    const closePDFModal = () => {
        if (pdfModal.pdfUrl) {
            URL.revokeObjectURL(pdfModal.pdfUrl);
        }
        setPdfModal({
            isOpen: false,
            pdfUrl: null,
            title: '',
            isLoading: false
        });
    };

    // Nettoyage lors du démontage du composant
    useEffect(() => {
        return () => {
            if (pdfModal.pdfUrl) {
                URL.revokeObjectURL(pdfModal.pdfUrl);
            }
        };
    }, [pdfModal.pdfUrl]);

    // Affichage du loader pendant le chargement des données en mode édition
    if (isEditMode && isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des données...</p>
                </div>
            </div>
        );
    }

    // Affichage d'erreur si les données n'ont pas pu être chargées en mode édition
    if (isEditMode && invoiceError) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Erreur lors du chargement des données</p>
                    <button
                        onClick={handleBackToList}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                    >
                        Retour à la liste
                    </button>
                </div>
            </div>
        );
    }

    return (
        <ProtectedRoute requiredRole={UserRole.Admin}>
            <form onSubmit={handleSubmit}>
                <section>
                    <div className="relative pl-2 flex items-center mb-4">
                        {/* Bouton Retour à la liste alignée à gauche */}
                        <button
                            type="button"
                            onClick={handleBackToList}
                            className="text-blue-500 border-2 flex gap-2 rounded-xl p-2 hover:underline focus:outline-none"
                        >
                            <FiCornerUpLeft size={24}/>
                            Retour à la liste
                        </button>

                        {/* Titre centré */}
                        <div className="absolute inset-x-0 flex justify-center items-center pointer-events-none">
                            <h1 className="text-2xl font-semibold text-gray-800 pointer-events-auto">
                                {isEditMode ? 'Modifier une facture' : 'Ajouter une facture'}
                            </h1>
                        </div>
                    </div>

                    <h2 className="text-base text-textColor md:text-lg lg:text-xl font-bold mb-4 text-center md:text-start">
                        Informations générales
                    </h2>
                    <hr className="my-6 border-gray-300"/>

                    <div className="grid md:grid-cols-2 gap-y-4 gap-x-8 md:gap-x-16 lg:gap-x-24">
                        <CustomSelect
                            label='Type de facture'
                            value={formData.type}
                            name='type'
                            options={typeOptions}
                            onChange={handleSelectChange}
                            error={errors.type}
                        />

                        <InputField
                            type="number"
                            label="Montant"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            minValue="1"
                            error={errors.amount}
                        />

                        {/* Champ fichier avec gestion de l'existant */}
                        <div className="space-y-2">
                            {isEditMode && existingFiles.invoiceFile ? (
                                <PDFField
                                    label="Fichier de facture actuel (PDF)"
                                    fileName={existingFiles.invoiceFile}
                                    onView={() => handleViewPDF('invoice')}
                                />
                            ) : null}

                            <FileInputField
                                label={isEditMode ? "Nouveau fichier de facture (PDF)" : "Fichier de facture (PDF)"}
                                name="invoiceFile"
                                onChange={handleFileChange('invoiceFile')}
                                accept="application/pdf,.pdf"
                            />
                            {errors.invoiceFile && (
                                <p className="text-sm text-red mt-1">{errors.invoiceFile}</p>
                            )}
                        </div>

                        <TextAreaField
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            error={errors.description}
                        />
                    </div>
                </section>

                <hr className="my-6 border-gray-300"/>

                <section>
                    <h2 className="text-base text-textColor md:text-lg lg:text-xl font-bold mb-4 text-center md:text-start">
                        Informations de paiement
                    </h2>
                    <hr className="my-6 border-gray-300"/>

                    <div className="grid md:grid-cols-2 gap-y-4 gap-x-8 md:gap-x-16 lg:gap-x-24">
                        <CustomSelect
                            label='Méthode de paiement'
                            value={formData.paymentMethod}
                            name='paymentMethod'
                            options={paymentMethodOptions}
                            onChange={handleSelectChange}
                            error={errors.paymentMethod}
                        />

                        <InputField
                            type='date'
                            label="Date de paiement"
                            name="paymentDate"
                            value={formData.paymentDate}
                            onChange={handleChange}
                        />

                        {/* Reçu de paiement */}
                        <div className="space-y-2">
                            {isEditMode && existingFiles.receiptFile ? (
                                <PDFField
                                    label="Reçu de paiement actuel (PDF)"
                                    fileName={existingFiles.receiptFile}
                                    onView={() => handleViewPDF('receipt')}
                                />
                            ) : null}

                            <FileInputField
                                label={isEditMode ? "Nouveau reçu de paiement (PDF)" : "Reçu de paiement (PDF)"}
                                name="receiptFile"
                                onChange={handleFileChange('receiptFile')}
                                accept="application/pdf,.pdf"
                            />
                            {errors.receiptFile && (
                                <p className="text-sm text-red mt-1">{errors.receiptFile}</p>
                            )}
                        </div>

                        {/* Remise de la banque */}
                        <div className="space-y-2">
                            {isEditMode && existingFiles.bankRemiseFile ? (
                                <PDFField
                                    label="Remise de la banque actuelle (PDF)"
                                    fileName={existingFiles.bankRemiseFile}
                                    onView={() => handleViewPDF('bankRemise')}
                                />
                            ) : null}

                            <FileInputField
                                label={isEditMode ? "Nouvelle remise de la banque (PDF)" : "Remise de la banque (PDF)"}
                                name="bankRemiseFile"
                                onChange={handleFileChange('bankRemiseFile')}
                                accept="application/pdf,.pdf"
                            />
                            {errors.bankRemiseFile && (
                                <p className="text-sm text-red mt-1">{errors.bankRemiseFile}</p>
                            )}
                        </div>
                    </div>
                </section>

                {/* Messages d'erreur globaux */}
                {errors.submit && (
                    <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {errors.submit}
                    </div>
                )}

                {/* Boutons d'action */}
                <div className="mt-5 flex justify-end gap-4 text-xs md:text-sm lg:text-base">
                    <button
                        type="button"
                        onClick={handleBackToList}
                        className="bg-redShade-500 hover:bg-redShade-600 text-white font-bold p-2 md:p-3 lg:p-4 rounded-xl transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`${
                            isSubmitting
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd hover:bg-indigo-700'
                        } text-white font-bold p-2 md:p-3 lg:p-4 rounded-xl transition-colors`}
                    >
                        {isSubmitting
                            ? `${isEditMode ? 'Modification' : 'Enregistrement'}...`
                            : `${isEditMode ? 'Modifier' : 'Enregistrer'}`
                        }
                    </button>
                </div>

                {/* Modal PDF */}
                <PDFModal
                    isOpen={pdfModal.isOpen}
                    onClose={closePDFModal}
                    pdfUrl={pdfModal.pdfUrl}
                    title={pdfModal.title}
                    isLoading={pdfModal.isLoading}
                />
            </form>
        </ProtectedRoute>
    );
};

export default AddGroupeInvoice;