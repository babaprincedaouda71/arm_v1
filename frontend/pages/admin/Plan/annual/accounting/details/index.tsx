import {GROUPE_INVOICE_URLS} from "@/config/urls";
import {fetcher} from "@/services/api";
import React, {useEffect, useState} from 'react';
import useSWR from "swr";
import {FiCornerUpLeft} from "react-icons/fi";
import InputField from "@/components/FormComponents/InputField";
import PDFField from "@/components/ui/PDFField";
import PDFModal from "@/components/ui/PDFModalProps";

// Interface pour les données de facture
interface InvoiceData {
    id: string;
    type: string;
    description: string;
    amount: number;
    paymentDate?: string;
    paymentMethod: string;
    creationDate: string;
    status: string;
    invoiceFile?: string; // URL ou nom du fichier
    bankRemiseFile?: string;
    receiptFile?: string;
}

const AccountingDetails = ({invoiceId, groupId, onCancel}) => {
    // États pour le modal PDF
    const [pdfModal, setPdfModal] = useState({
        isOpen: false,
        pdfUrl: null as string | null,
        title: '',
        isLoading: false
    });

    // Récupération des données de la facture
    const {data: invoiceData, error, isLoading} = useSWR<InvoiceData>(
        invoiceId ? `${GROUPE_INVOICE_URLS.getGroupeInvoiceDetails}/${invoiceId}` : null,
        fetcher
    );

    // Fonction pour charger et afficher un PDF
    const handleViewPDF = async (fileType: 'invoice' | 'bankRemise' | 'receipt') => {
        if (!invoiceData || !invoiceId) return;

        const fileNames = {
            invoice: invoiceData.invoiceFile,
            bankRemise: invoiceData.bankRemiseFile,
            receipt: invoiceData.receiptFile
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
            console.log("File type: ", fileType);
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des détails...</p>
                </div>
            </div>
        );
    }

    if (error || !invoiceData) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Erreur lors du chargement des données</p>
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
                        Détails de la facture
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
                    {/* Type de facture */}
                    <InputField
                        label="Type de facture"
                        name="type"
                        value={invoiceData.type}
                        disabled={true}
                    />

                    {/* Montant */}
                    <InputField
                        label="Montant"
                        name="amount"
                        value={`${invoiceData.amount.toLocaleString('fr-FR')} Dh`}
                        disabled={true}
                    />

                    {/* Fichier de facture */}
                    <PDFField
                        label="Fichier de facture (PDF)"
                        fileName={invoiceData.invoiceFile}
                        onView={() => handleViewPDF('invoice')}
                        isLoading={pdfModal.isLoading && pdfModal.title === 'Fichier de facture'}
                    />

                    {/* Description */}
                    <div
                        className="flex items-center w-full font-tHead text-formInputTextColor font-semibold text-xs md:text-sm lg:text-base">
                        <label className="flex-[1] block break-words pt-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={invoiceData.description}
                            readOnly={true}
                            className="flex-[4] min-h-[150px] outline-none border-[1px] bg-inputBgColor border-none p-5 rounded-md resize-none"
                        />
                    </div>
                </div>
            </section>

            <hr className="my-6 border-gray-300"/>

            {/* Informations de paiement */}
            <section>
                <h2 className="text-base text-textColor md:text-lg lg:text-xl font-bold mb-4 text-center md:text-start">
                    Informations de paiement
                </h2>
                <hr className="my-6 border-gray-300"/>

                <div className="grid md:grid-cols-2 gap-y-4 gap-x-8 md:gap-x-16 lg:gap-x-24">
                    {/* Méthode de paiement */}
                    <InputField
                        label="Méthode de paiement"
                        name="paymentMethod"
                        value={invoiceData.paymentMethod}
                        disabled={true}
                    />

                    {/* Date de paiement */}
                    <InputField
                        type="date"
                        label="Date de paiement"
                        name="paymentDate"
                        value={invoiceData.paymentDate || ''}
                        disabled={true}
                    />

                    {/* Reçu de paiement */}
                    <PDFField
                        label="Reçu de paiement (PDF)"
                        fileName={invoiceData.receiptFile}
                        onView={() => handleViewPDF('receipt')}
                        isLoading={pdfModal.isLoading && pdfModal.title === 'Reçu de paiement'}
                    />

                    {/* Remise de la banque */}
                    <PDFField
                        label="Remise de la banque (PDF)"
                        fileName={invoiceData.bankRemiseFile}
                        onView={() => handleViewPDF('bankRemise')}
                        isLoading={pdfModal.isLoading && pdfModal.title === 'Remise de la banque'}
                    />
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
                        value={invoiceData.creationDate}
                        disabled={true}
                    />

                    {/* Statut */}
                    <div
                        className="flex items-center w-full font-tHead text-formInputTextColor font-semibold text-xs md:text-sm lg:text-base">
                        <label className="flex-[1] block break-words">
                            Statut
                        </label>
                        <div className="flex-[4] h-[48px] flex items-center px-5 bg-inputBgColor rounded-md">
                            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                                invoiceData.status === 'Réglée'
                                    ? 'bg-green-100 text-green-800'
                                    : invoiceData.status === 'Non Réglée'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-red-100 text-red-800'
                            }`}>
                                {invoiceData.status}
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
export default AccountingDetails;