import {OCF_URLS} from "@/config/urls";
import {fetcher} from "@/services/api";
import React, {useEffect, useState} from 'react';
import useSWR from "swr";
import {FiCornerUpLeft} from "react-icons/fi";
import InputField from "@/components/FormComponents/InputField";
import PDFField from "@/components/ui/PDFField";
import PDFModal from "@/components/ui/PDFModalProps";
import {useRouter} from "next/router";

// Interface pour les données OCF détaillées
interface OCFDetailsData {
    id: string;
    code: string;
    corporateName: string;
    ice: string;
    phone: string;
    email: string;
    address?: string;
    city?: string;
    nameMainContact: string;
    positionMainContact: string;
    emailMainContact: string;
    phoneMainContact: string;
    status: string;
    creationDate: string;
    // Fichiers PDF potentiels
    contractFile?: string;
    certificationFile?: string;
    profileFile?: string;
}

interface OCFDetailsProps {
    ocfId: string;
    onCancel: () => void;
}

const OCFDetails: React.FC<OCFDetailsProps> = ({ocfId, onCancel}) => {
    const router = useRouter();
    const  {id} = router.query;
    // États pour le modal PDF
    const [pdfModal, setPdfModal] = useState({
        isOpen: false,
        pdfUrl: null as string | null,
        title: '',
        isLoading: false
    });

    // Récupération des données OCF
    const {data: ocfData, error, isLoading} = useSWR<OCFDetailsData>(
        id ? `${OCF_URLS.getDetails}/${id}` : null,
        fetcher
    );

    // Fonction pour charger et afficher un PDF
    const handleViewPDF = async (fileType: 'contract' | 'certification' | 'profile') => {
        if (!ocfData || !id) return;

        const fileNames = {
            contract: ocfData.contractFile,
            certification: ocfData.certificationFile,
            profile: ocfData.profileFile
        };

        const titles = {
            contract: 'Contrat OCF',
            certification: 'Certificat de qualification',
            profile: 'Profil entreprise'
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
            const response = await fetch(`${OCF_URLS.getPdf}/${id}/${fileType}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const blob = await response.blob();

                // Vérifier que c'est bien un PDF
                if (blob.type !== 'application/pdf') {
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des détails OCF...</p>
                </div>
            </div>
        );
    }

    if (error || !ocfData) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Erreur lors du chargement des données OCF</p>
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                    >
                        Retour à la liste
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="relative pl-2 flex items-center mb-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="text-blue-500 border-2 flex gap-2 rounded-xl p-2 hover:underline focus:outline-none"
                >
                    <FiCornerUpLeft size={24}/>
                    Retour à la liste
                </button>

                <div className="absolute inset-x-0 flex justify-center items-center pointer-events-none">
                    <h1 className="text-2xl font-semibold text-gray-800 pointer-events-auto">
                        Détails OCF - {ocfData.corporateName}
                    </h1>
                </div>
            </div>

            {/* Informations générales */}
            <section>
                <h2 className="text-base text-textColor md:text-lg lg:text-xl font-bold mb-4 text-center md:text-start">
                    Informations générales
                </h2>
                <hr className="my-6 border-gray-300"/>

                <div className="grid md:grid-cols-2 gap-y-4 gap-x-8 md:gap-x-16 lg:gap-x-24">
                    {/* Code OCF */}
                    <InputField
                        label="Code OCF"
                        name="code"
                        value={ocfData.code}
                        disabled={true}
                    />

                    {/* Raison sociale */}
                    <InputField
                        label="Raison sociale"
                        name="corporateName"
                        value={ocfData.corporateName}
                        disabled={true}
                    />

                    {/* ICE */}
                    <InputField
                        label="ICE"
                        name="ice"
                        value={ocfData.ice}
                        disabled={true}
                    />

                    {/* Téléphone */}
                    <InputField
                        label="Téléphone"
                        name="phone"
                        value={ocfData.phone}
                        disabled={true}
                    />

                    {/* Email */}
                    <InputField
                        label="Email"
                        name="email"
                        value={ocfData.email}
                        disabled={true}
                    />

                    {/* Adresse */}
                    {ocfData.address && (
                        <InputField
                            label="Adresse"
                            name="address"
                            value={ocfData.address}
                            disabled={true}
                        />
                    )}

                    {/* Ville */}
                    {ocfData.city && (
                        <InputField
                            label="Ville"
                            name="city"
                            value={ocfData.city}
                            disabled={true}
                        />
                    )}

                    {/* Contrat OCF */}
                    {ocfData.contractFile && (
                        <PDFField
                            label="Contrat OCF (PDF)"
                            fileName={ocfData.contractFile}
                            onView={() => handleViewPDF('contract')}
                            isLoading={pdfModal.isLoading && pdfModal.title === 'Contrat OCF'}
                        />
                    )}
                </div>
            </section>

            <hr className="my-6 border-gray-300"/>

            {/* Contact principal */}
            <section>
                <h2 className="text-base text-textColor md:text-lg lg:text-xl font-bold mb-4 text-center md:text-start">
                    Contact principal
                </h2>
                <hr className="my-6 border-gray-300"/>

                <div className="grid md:grid-cols-2 gap-y-4 gap-x-8 md:gap-x-16 lg:gap-x-24">
                    {/* Nom du contact */}
                    <InputField
                        label="Nom du contact"
                        name="nameMainContact"
                        value={ocfData.nameMainContact}
                        disabled={true}
                    />

                    {/* Fonction */}
                    <InputField
                        label="Fonction"
                        name="positionMainContact"
                        value={ocfData.positionMainContact}
                        disabled={true}
                    />

                    {/* Email du contact */}
                    <InputField
                        label="Email du contact"
                        name="emailMainContact"
                        value={ocfData.emailMainContact}
                        disabled={true}
                    />

                    {/* Téléphone du contact */}
                    <InputField
                        label="Téléphone du contact"
                        name="phoneMainContact"
                        value={ocfData.phoneMainContact}
                        disabled={true}
                    />
                </div>
            </section>

            <hr className="my-6 border-gray-300"/>

            {/* Documents et certifications */}
            <section>
                <h2 className="text-base text-textColor md:text-lg lg:text-xl font-bold mb-4 text-center md:text-start">
                    Documents et certifications
                </h2>
                <hr className="my-6 border-gray-300"/>

                <div className="grid md:grid-cols-2 gap-y-4 gap-x-8 md:gap-x-16 lg:gap-x-24">
                    {/* Certificat de qualification */}
                    {ocfData.certificationFile && (
                        <PDFField
                            label="Certificat de qualification (PDF)"
                            fileName={ocfData.certificationFile}
                            onView={() => handleViewPDF('certification')}
                            isLoading={pdfModal.isLoading && pdfModal.title === 'Certificat de qualification'}
                        />
                    )}

                    {/* Profil entreprise */}
                    {ocfData.profileFile && (
                        <PDFField
                            label="Profil entreprise (PDF)"
                            fileName={ocfData.profileFile}
                            onView={() => handleViewPDF('profile')}
                            isLoading={pdfModal.isLoading && pdfModal.title === 'Profil entreprise'}
                        />
                    )}
                </div>
            </section>

            <hr className="my-6 border-gray-300"/>

            {/* Informations supplémentaires */}
            <section>
                <h2 className="text-base text-textColor md:text-lg lg:text-xl font-bold mb-4 text-center md:text-start">
                    Informations supplémentaires
                </h2>
                <hr className="my-6 border-gray-300"/>

                <div className="grid md:grid-cols-2 gap-y-4 gap-x-8 md:gap-x-16 lg:gap-x-24">
                    {/* Date de création */}
                    <InputField
                        type="date"
                        label="Date de création"
                        name="creationDate"
                        value={ocfData.creationDate}
                        disabled={true}
                    />

                    {/* Statut */}
                    <div className="flex items-center w-full font-tHead text-formInputTextColor font-semibold text-xs md:text-sm lg:text-base">
                        <label className="flex-[1] block break-words">
                            Statut
                        </label>
                        <div className="flex-[4] h-[48px] flex items-center px-5 bg-inputBgColor rounded-md">
                            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                                ocfData.status === 'Actif'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                            }`}>
                                {ocfData.status}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bouton de retour */}
            <div className="mt-5 flex justify-end gap-4 text-xs md:text-sm lg:text-base">
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-redShade-500 hover:bg-redShade-600 text-white font-bold p-2 md:p-3 lg:p-4 rounded-xl transition-colors"
                >
                    Retour à la liste
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
        </div>
    );
};

export default OCFDetails;