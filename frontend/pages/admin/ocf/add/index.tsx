import React, {useEffect, useState} from "react";
import {FiCornerUpLeft} from "react-icons/fi";
import {useRouter} from "next/router";
import useSWR from "swr";
import {OCF_URLS} from "@/config/urls";
import {fetcher} from "@/services/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import {UserRole} from "@/contexts/AuthContext";
import FileInputField from "@/components/FormComponents/FileInputField";
import InputField from "@/components/FormComponents/InputField";
import PDFField from "@/components/ui/PDFField";
import PDFModal from "@/components/ui/PDFModalProps";
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";

// États initiaux
const INITIAL_FORM_DATA = {
    corporateName: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    staff: "",
    creationDate: "",
    legalForm: "",
    ice: "",
    rc: "",
    patent: "",
    ifValue: "",
    cnss: "",
    permanentStaff: "",
    password: "",
    nameLegalRepresentant: "",
    positionLegalRepresentant: "",
    phoneLegalRepresentant: "",
    emailLegalRepresentant: "",
    nameMainContact: "",
    positionMainContact: "",
    phoneMainContact: "",
    emailMainContact: "",
};

const INITIAL_FILES = {
    legalStatusFile: null,
    eligibilityCertificateFile: null,
    jrcTemplateFile: null,
    insurancePolicyFile: null,
    taxComplianceCertificateFile: null,
    bankStatementCertificateFile: null,
    termsAndConditionsFile: null,
    otherCertificationsFile: null,
};

interface AddOCFPageProps {
    onCancel?: () => void;
    onSuccess?: () => void;
    id?: number; // ID pour le mode édition
}

const AddOCFPage: React.FC<AddOCFPageProps> = ({onCancel, onSuccess}) => {
    const {navigateTo} = useRoleBasedNavigation();
    const router = useRouter();
    const {id} = router.query;

    console.log('ocfId', id);

    // Déterminer si on est en mode édition
    const isEditMode = !!id;

    console.log('isEditMode', isEditMode);

    // États du formulaire
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [files, setFiles] = useState(INITIAL_FILES);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // États pour les fichiers existants (mode édition)
    const [existingFiles, setExistingFiles] = useState({
        legalStatusFile: null as string | null,
        eligibilityCertificateFile: null as string | null,
        jrcTemplateFile: null as string | null,
        insurancePolicyFile: null as string | null,
        taxComplianceCertificateFile: null as string | null,
        bankStatementCertificateFile: null as string | null,
        termsAndConditionsFile: null as string | null,
        otherCertificationsFile: null as string | null,
    });

    // États pour le modal PDF
    const [pdfModal, setPdfModal] = useState({
        isOpen: false,
        pdfUrl: null as string | null,
        title: '',
        isLoading: false
    });

    // Récupération des données en mode édition
    const {data: ocfData, error: ocfError, isLoading} = useSWR(
        isEditMode ? `${OCF_URLS.getDetails}/${id}` : null,
        fetcher
    );

    console.log('ocfData', ocfData);

    // Charger les données en mode édition
    useEffect(() => {
        if (isEditMode && ocfData) {
            setFormData({
                corporateName: ocfData.corporateName || "",
                address: ocfData.address || "",
                phone: ocfData.phone || "",
                email: ocfData.email || "",
                website: ocfData.website || "",
                staff: ocfData.staff || "",
                creationDate: ocfData.creationDate || "",
                legalForm: ocfData.legalForm || "",
                ice: ocfData.ice || "",
                rc: ocfData.rc || "",
                patent: ocfData.patent || "",
                ifValue: ocfData.ifValue || "",
                cnss: ocfData.cnss || "",
                permanentStaff: ocfData.permanentStaff || "",
                password: "", // Ne pas préremplir le mot de passe
                nameLegalRepresentant: ocfData.nameLegalRepresentant || "",
                positionLegalRepresentant: ocfData.positionLegalRepresentant || "",
                phoneLegalRepresentant: ocfData.phoneLegalRepresentant || "",
                emailLegalRepresentant: ocfData.emailLegalRepresentant || "",
                nameMainContact: ocfData.nameMainContact || "",
                positionMainContact: ocfData.positionMainContact || "",
                phoneMainContact: ocfData.phoneMainContact || "",
                emailMainContact: ocfData.emailMainContact || "",
            });

            setExistingFiles({
                legalStatusFile: ocfData.legalStatusFile || null,
                eligibilityCertificateFile: ocfData.eligibilityCertificateFile || null,
                jrcTemplateFile: ocfData.jrcTemplateFile || null,
                insurancePolicyFile: ocfData.insurancePolicyFile || null,
                taxComplianceCertificateFile: ocfData.taxComplianceCertificateFile || null,
                bankStatementCertificateFile: ocfData.bankStatementCertificateFile || null,
                termsAndConditionsFile: ocfData.termsAndConditionsFile || null,
                otherCertificationsFile: ocfData.otherCertificationsFile || null,
            });
        }
    }, [isEditMode, ocfData]);

    // Fonction pour réinitialiser le formulaire
    const resetForm = () => {
        setFormData(INITIAL_FORM_DATA);
        setFiles(INITIAL_FILES);
        setExistingFiles({
            legalStatusFile: null,
            eligibilityCertificateFile: null,
            jrcTemplateFile: null,
            insurancePolicyFile: null,
            taxComplianceCertificateFile: null,
            bankStatementCertificateFile: null,
            termsAndConditionsFile: null,
            otherCertificationsFile: null,
        });
        setErrors({});
        setIsSubmitting(false);
    };

    // Fonction pour gérer les changements dans les champs
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Supprimer l'erreur pour ce champ
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    // Fonction pour gérer les changements de fichiers
    const handleFileChange = (fieldName) => (selectedFiles) => {
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

        // Supprimer l'erreur pour ce fichier
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

        // Validations obligatoires
        if (!formData.corporateName.trim()) {
            newErrors.corporateName = "La raison sociale est obligatoire";
        }

        if (!formData.address.trim()) {
            newErrors.address = "L'adresse est obligatoire";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Le téléphone est obligatoire";
        } else if (!/^[0-9]{10}$/.test(formData.phone)) {
            newErrors.phone = "Le numéro de téléphone doit contenir 10 chiffres";
        }

        if (!formData.email.trim()) {
            newErrors.email = "L'email est obligatoire";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "L'email doit être valide";
        }

        if (!formData.ice.trim()) {
            newErrors.ice = "L'ICE est obligatoire";
        }

        if (!formData.nameLegalRepresentant.trim()) {
            newErrors.nameLegalRepresentant = "Le nom du représentant légal est obligatoire";
        }

        if (!formData.nameMainContact.trim()) {
            newErrors.nameMainContact = "Le nom du contact principal est obligatoire";
        }

        // Validation des emails optionnels
        if (formData.emailLegalRepresentant && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailLegalRepresentant)) {
            newErrors.emailLegalRepresentant = "L'email du représentant légal doit être valide";
        }

        if (formData.emailMainContact && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailMainContact)) {
            newErrors.emailMainContact = "L'email du contact principal doit être valide";
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
            const formDataToSend = new FormData();

            // Ajouter les données JSON
            const ocfData = {
                corporateName: formData.corporateName,
                address: formData.address,
                phone: formData.phone,
                email: formData.email,
                website: formData.website,
                staff: formData.staff,
                creationDate: formData.creationDate || null,
                legalForm: formData.legalForm,
                ice: formData.ice,
                rc: formData.rc,
                patent: formData.patent,
                ifValue: formData.ifValue,
                cnss: formData.cnss,
                permanentStaff: formData.permanentStaff ? parseInt(formData.permanentStaff) : null,
                password: formData.password,
                nameLegalRepresentant: formData.nameLegalRepresentant,
                positionLegalRepresentant: formData.positionLegalRepresentant,
                phoneLegalRepresentant: formData.phoneLegalRepresentant,
                emailLegalRepresentant: formData.emailLegalRepresentant,
                nameMainContact: formData.nameMainContact,
                positionMainContact: formData.positionMainContact,
                phoneMainContact: formData.phoneMainContact,
                emailMainContact: formData.emailMainContact,
            }

            const dtoKey = isEditMode ? 'ocfUpdateDto' : 'ocfCreateDto';
            formDataToSend.append(dtoKey, new Blob([JSON.stringify(ocfData)], {
                type: 'application/json'
            }));

            // Ajouter les fichiers s'ils existent
            Object.entries(files).forEach(([key, file]) => {
                if (file) {
                    formDataToSend.append(key, file);
                }
            });

            // Déterminer l'URL et la méthode
            const url = isEditMode
                ? `${OCF_URLS.edit}/${id}`
                : OCF_URLS.add;
            const method = isEditMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                credentials: 'include',
                body: formDataToSend,
            });

            if (response.ok) {
                resetForm();

                if (onSuccess) {
                    onSuccess();
                } else {
                    navigateTo("/ocf");
                }
            } else {
                const errorData = await response.json();
                console.error('Erreur lors de la sauvegarde:', errorData);
                setErrors({
                    submit: `Erreur lors de la ${isEditMode ? 'modification' : 'création'} de l'OCF`
                });
            }
        } catch (error) {
            console.error('Erreur réseau:', error);
            setErrors({submit: "Erreur de connexion"});
        } finally {
            setIsSubmitting(false);
        }
    };

    // Fonction pour gérer le retour
    const handleBackToList = () => {
        resetForm();

        if (onCancel) {
            onCancel();
        } else {
            navigateTo("/ocf");
        }
    };

    // Fonction pour voir un PDF existant
    const handleViewPDF = async (fileType: string) => {
        if (!isEditMode || !id) return;

        const fileName = existingFiles[fileType];
        if (!fileName) return;

        const titles = {
            legalStatusFile: 'Statut juridique',
            eligibilityCertificateFile: 'Attestation d\'éligibilité',
            jrcTemplateFile: 'Modèle J RC',
            insurancePolicyFile: 'Police d\'assurance',
            taxComplianceCertificateFile: 'Certificat de régularité fiscal',
            bankStatementCertificateFile: 'Attestation de RIB bancaire',
            termsAndConditionsFile: 'Conditions générales de vente',
            otherCertificationsFile: 'Autres certifications'
        };

        setPdfModal({
            isOpen: true,
            pdfUrl: null,
            title: titles[fileType] || 'Document',
            isLoading: true
        });

        try {
            const response = await fetch(`${OCF_URLS.getPdf}/${id}/${fileType}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const blob = await response.blob();
                const pdfBlob = blob.type !== 'application/pdf'
                    ? new Blob([blob], {type: 'application/pdf'})
                    : blob;
                const pdfUrl = URL.createObjectURL(pdfBlob);

                setPdfModal(prev => ({
                    ...prev,
                    pdfUrl: pdfUrl + '#toolbar=0&navpanes=0&scrollbar=0',
                    isLoading: false
                }));
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

    // Fonction pour fermer le modal PDF
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

    // Nettoyage lors du démontage
    useEffect(() => {
        return () => {
            if (pdfModal.pdfUrl) {
                URL.revokeObjectURL(pdfModal.pdfUrl);
            }
        };
    }, [pdfModal.pdfUrl]);

    // Affichage du loader en mode édition
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

    // Affichage d'erreur en mode édition
    if (isEditMode && ocfError) {
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
            <form className="mx-auto bg-white font-title rounded-lg px-6 py-4" onSubmit={handleSubmit}>
                {/* Header avec bouton retour et titre */}
                <div className="relative pl-2 flex items-center mb-4">
                    <button
                        type="button"
                        onClick={handleBackToList}
                        className="text-blue-500 border-2 flex gap-2 rounded-xl p-2 hover:underline focus:outline-none"
                    >
                        <FiCornerUpLeft size={24}/>
                        Retour à la liste
                    </button>

                    <div className="absolute inset-x-0 flex justify-center items-center pointer-events-none">
                        <h1 className="text-2xl font-semibold text-gray-800 pointer-events-auto">
                            {isEditMode ? 'Modifier un OCF' : 'Ajouter un OCF'}
                        </h1>
                    </div>
                </div>

                {/* Section Informations sur l'entreprise */}
                <section>
                    <h2 className="text-base text-textColor md:text-lg lg:text-xl font-bold mb-4 text-center md:text-start">
                        Informations sur l'entreprise
                    </h2>
                    <hr className="my-6 border-gray-300"/>

                    <div className="grid md:grid-cols-2 gap-y-4 gap-x-8 md:gap-x-16 lg:gap-x-24">
                        <InputField
                            label="Raison sociale"
                            name="corporateName"
                            onChange={handleChange}
                            value={formData.corporateName}
                            error={errors.corporateName}
                        />
                        <InputField
                            label="ICE"
                            name="ice"
                            onChange={handleChange}
                            value={formData.ice}
                            error={errors.ice}
                        />
                        <InputField
                            label="Adresse"
                            name="address"
                            onChange={handleChange}
                            value={formData.address}
                            error={errors.address}
                        />
                        <InputField
                            label="RC"
                            name="rc"
                            onChange={handleChange}
                            value={formData.rc}
                        />
                        <InputField
                            label="Téléphone"
                            name="phone"
                            onChange={handleChange}
                            value={formData.phone}
                            error={errors.phone}
                        />
                        <InputField
                            label="Patente"
                            name="patent"
                            onChange={handleChange}
                            value={formData.patent}
                        />
                        <InputField
                            label="Email"
                            name="email"
                            onChange={handleChange}
                            value={formData.email}
                            error={errors.email}
                        />
                        <InputField
                            label="IF"
                            name="ifValue"
                            onChange={handleChange}
                            value={formData.ifValue}
                        />
                        <InputField
                            label="Site web"
                            name="website"
                            onChange={handleChange}
                            value={formData.website}
                        />
                        <InputField
                            label="CNSS"
                            name="cnss"
                            onChange={handleChange}
                            value={formData.cnss}
                        />
                        <InputField
                            label="Effectif"
                            name="staff"
                            onChange={handleChange}
                            value={formData.staff}
                        />
                        <InputField
                            label="Effectif permanent"
                            name="permanentStaff"
                            type="number"
                            onChange={handleChange}
                            value={formData.permanentStaff}
                        />
                        <InputField
                            label="Date de création"
                            type="date"
                            name="creationDate"
                            onChange={handleChange}
                            value={formData.creationDate}
                        />
                        <InputField
                            label={isEditMode ? "Nouveau mot de passe" : "Mot de passe"}
                            name="password"
                            type="password"
                            onChange={handleChange}
                            value={formData.password}
                        />
                        <InputField
                            label="Forme juridique"
                            name="legalForm"
                            onChange={handleChange}
                            value={formData.legalForm}
                        />
                    </div>
                </section>

                {/* Section Représentant légal */}
                <section>
                    <hr className="my-6 border-gray-300"/>
                    <h2 className="text-base text-textColor md:text-lg lg:text-xl font-bold mb-4 text-center md:text-start">
                        Informations sur le représentant légal
                    </h2>
                    <hr className="my-6 border-gray-300"/>
                    <div className="grid md:grid-cols-2 gap-y-4 gap-x-8 md:gap-x-16 lg:gap-x-24">
                        <InputField
                            label="Nom complet"
                            name="nameLegalRepresentant"
                            onChange={handleChange}
                            value={formData.nameLegalRepresentant}
                            error={errors.nameLegalRepresentant}
                        />
                        <InputField
                            label="Téléphone"
                            name="phoneLegalRepresentant"
                            onChange={handleChange}
                            value={formData.phoneLegalRepresentant}
                        />
                        <InputField
                            label="Fonction"
                            name="positionLegalRepresentant"
                            onChange={handleChange}
                            value={formData.positionLegalRepresentant}
                        />
                        <InputField
                            label="Email"
                            name="emailLegalRepresentant"
                            onChange={handleChange}
                            value={formData.emailLegalRepresentant}
                            error={errors.emailLegalRepresentant}
                        />
                    </div>
                </section>

                {/* Section Contact principal */}
                <section>
                    <hr className="my-6 border-gray-300"/>
                    <h2 className="text-base text-textColor md:text-lg lg:text-xl font-bold mb-4 text-center md:text-start">
                        Informations sur le contact principal
                    </h2>
                    <hr className="my-6 border-gray-300"/>
                    <div className="grid md:grid-cols-2 gap-y-4 gap-x-8 md:gap-x-16 lg:gap-x-24">
                        <InputField
                            label="Nom complet"
                            name="nameMainContact"
                            onChange={handleChange}
                            value={formData.nameMainContact}
                            error={errors.nameMainContact}
                        />
                        <InputField
                            label="Téléphone"
                            name="phoneMainContact"
                            onChange={handleChange}
                            value={formData.phoneMainContact}
                        />
                        <InputField
                            label="Fonction"
                            name="positionMainContact"
                            onChange={handleChange}
                            value={formData.positionMainContact}
                        />
                        <InputField
                            label="Email"
                            name="emailMainContact"
                            onChange={handleChange}
                            value={formData.emailMainContact}
                            error={errors.emailMainContact}
                        />
                    </div>
                </section>

                {/* Section Documents */}
                <section>
                    <hr className="my-6 border-gray-300"/>
                    <h2 className="text-base text-textColor md:text-lg lg:text-xl font-bold mb-4 text-center md:text-start">
                        Documents
                    </h2>
                    <hr className="my-6 border-gray-300"/>

                    <div className="grid md:grid-cols-2 gap-y-4 gap-x-8 md:gap-x-16 lg:gap-x-24">
                        {/* Statut juridique */}
                        <div className="space-y-2">
                            {isEditMode && existingFiles.legalStatusFile && (
                                <PDFField
                                    label="Statut juridique actuel (PDF)"
                                    fileName={existingFiles.legalStatusFile}
                                    onView={() => handleViewPDF('legalStatusFile')}
                                />
                            )}
                            <FileInputField
                                label={isEditMode ? "Nouveau statut juridique (PDF)" : "Statut juridique (PDF)"}
                                name="legalStatusFile"
                                onChange={handleFileChange('legalStatusFile')}
                                accept="application/pdf,.pdf"
                            />
                            {errors.legalStatusFile && (
                                <p className="text-sm text-red mt-1">{errors.legalStatusFile}</p>
                            )}
                        </div>

                        {/* Attestation d'éligibilité */}
                        <div className="space-y-2">
                            {isEditMode && existingFiles.eligibilityCertificateFile && (
                                <PDFField
                                    label="Attestation d'éligibilité actuelle (PDF)"
                                    fileName={existingFiles.eligibilityCertificateFile}
                                    onView={() => handleViewPDF('eligibilityCertificateFile')}
                                />
                            )}
                            <FileInputField
                                label={isEditMode ? "Nouvelle attestation d'éligibilité (PDF)" : "Attestation d'éligibilité (PDF)"}
                                name="eligibilityCertificateFile"
                                onChange={handleFileChange('eligibilityCertificateFile')}
                                accept="application/pdf,.pdf"
                            />
                            {errors.eligibilityCertificateFile && (
                                <p className="text-sm text-red mt-1">{errors.eligibilityCertificateFile}</p>
                            )}
                        </div>

                        {/* Continuer pour les autres documents... */}
                        {/* Modèle J RC */}
                        <div className="space-y-2">
                            {isEditMode && existingFiles.jrcTemplateFile && (
                                <PDFField
                                    label="Modèle J RC actuel (PDF)"
                                    fileName={existingFiles.jrcTemplateFile}
                                    onView={() => handleViewPDF('jrcTemplateFile')}
                                />
                            )}
                            <FileInputField
                                label={isEditMode ? "Nouveau modèle J RC (PDF)" : "Modèle J RC (PDF)"}
                                name="jrcTemplateFile"
                                onChange={handleFileChange('jrcTemplateFile')}
                                accept="application/pdf,.pdf"
                            />
                            {errors.jrcTemplateFile && (
                                <p className="text-sm text-red mt-1">{errors.jrcTemplateFile}</p>
                            )}
                        </div>

                        {/* Police d'assurance */}
                        <div className="space-y-2">
                            {isEditMode && existingFiles.insurancePolicyFile && (
                                <PDFField
                                    label="Police d'assurance actuelle (PDF)"
                                    fileName={existingFiles.insurancePolicyFile}
                                    onView={() => handleViewPDF('insurancePolicyFile')}
                                />
                            )}
                            <FileInputField
                                label={isEditMode ? "Nouvelle police d'assurance (PDF)" : "Police d'assurance (PDF)"}
                                name="insurancePolicyFile"
                                onChange={handleFileChange('insurancePolicyFile')}
                                accept="application/pdf,.pdf"
                            />
                            {errors.insurancePolicyFile && (
                                <p className="text-sm text-red mt-1">{errors.insurancePolicyFile}</p>
                            )}
                        </div>

                        {/* Certificat de régularité fiscal */}
                        <div className="space-y-2">
                            {isEditMode && existingFiles.taxComplianceCertificateFile && (
                                <PDFField
                                    label="Certificat de régularité fiscal actuel (PDF)"
                                    fileName={existingFiles.taxComplianceCertificateFile}
                                    onView={() => handleViewPDF('taxComplianceCertificateFile')}
                                />
                            )}
                            <FileInputField
                                label={isEditMode ? "Nouveau certificat de régularité fiscal (PDF)" : "Certificat de régularité fiscal (PDF)"}
                                name="taxComplianceCertificateFile"
                                onChange={handleFileChange('taxComplianceCertificateFile')}
                                accept="application/pdf,.pdf"
                            />
                            {errors.taxComplianceCertificateFile && (
                                <p className="text-sm text-red mt-1">{errors.taxComplianceCertificateFile}</p>
                            )}
                        </div>

                        {/* Attestation de RIB bancaire */}
                        <div className="space-y-2">
                            {isEditMode && existingFiles.bankStatementCertificateFile && (
                                <PDFField
                                    label="Attestation de RIB bancaire actuelle (PDF)"
                                    fileName={existingFiles.bankStatementCertificateFile}
                                    onView={() => handleViewPDF('bankStatementCertificateFile')}
                                />
                            )}
                            <FileInputField
                                label={isEditMode ? "Nouvelle attestation de RIB bancaire (PDF)" : "Attestation de RIB bancaire (PDF)"}
                                name="bankStatementCertificateFile"
                                onChange={handleFileChange('bankStatementCertificateFile')}
                                accept="application/pdf,.pdf"
                            />
                            {errors.bankStatementCertificateFile && (
                                <p className="text-sm text-red mt-1">{errors.bankStatementCertificateFile}</p>
                            )}
                        </div>

                        {/* Autres certifications */}
                        <div className="space-y-2">
                            {isEditMode && existingFiles.otherCertificationsFile && (
                                <PDFField
                                    label="Autres certifications actuelles (PDF)"
                                    fileName={existingFiles.otherCertificationsFile}
                                    onView={() => handleViewPDF('otherCertificationsFile')}
                                />
                            )}
                            <FileInputField
                                label={isEditMode ? "Nouvelles autres certifications (PDF)" : "Autres certifications (PDF)"}
                                name="otherCertificationsFile"
                                onChange={handleFileChange('otherCertificationsFile')}
                                accept="application/pdf,.pdf"
                            />
                            {errors.otherCertificationsFile && (
                                <p className="text-sm text-red mt-1">{errors.otherCertificationsFile}</p>
                            )}
                        </div>

                        {/* Conditions générales de vente */}
                        <div className="space-y-2">
                            {isEditMode && existingFiles.termsAndConditionsFile && (
                                <PDFField
                                    label="Conditions générales de vente actuelles (PDF)"
                                    fileName={existingFiles.termsAndConditionsFile}
                                    onView={() => handleViewPDF('termsAndConditionsFile')}
                                />
                            )}
                            <FileInputField
                                label={isEditMode ? "Nouvelles conditions générales de vente (PDF)" : "Conditions générales de vente (PDF)"}
                                name="termsAndConditionsFile"
                                onChange={handleFileChange('termsAndConditionsFile')}
                                accept="application/pdf,.pdf"
                            />
                            {errors.termsAndConditionsFile && (
                                <p className="text-sm text-red mt-1">{errors.termsAndConditionsFile}</p>
                            )}
                        </div>

                        {/* Champs non-fichiers pour compléter la grille */}
                        <InputField
                            label="Référence clients"
                            name="clientReferences"
                            onChange={handleChange}
                            // value={formData.clientReferences || ""}
                        />
                        <InputField
                            label="Qualification"
                            name="qualification"
                            onChange={handleChange}
                            // value={formData.qualification || ""}
                        />
                        <InputField
                            label="Validité"
                            name="validity"
                            type="date"
                            onChange={handleChange}
                            // value={formData.validity || ""}
                        />
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

export default AddOCFPage;