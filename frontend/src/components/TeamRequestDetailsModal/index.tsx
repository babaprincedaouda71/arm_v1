import React, { useState } from "react";
import { TeamRequestsProps } from "@/types/dataTypes";
import { mutate } from "swr";
import RejectRequestModal from "@/components/RejectRequestModal";
import ApproveRequestModal from "@/components/ApproveRequestModal";

interface RequestDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    request: TeamRequestsProps | null;
    mutateUrl?: string;
    apiUrl?: string;
}

const TeamRequestDetailsModal: React.FC<RequestDetailsModalProps> = ({
                                                                     isOpen,
                                                                     onClose,
                                                                     request,
                                                                     mutateUrl,
                                                                     apiUrl
                                                                 }) => {
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [requestToProcess, setRequestToProcess] = useState<TeamRequestsProps | null>(null);

    // Si le modal n'est pas ouvert ou s'il n'y a pas de demande
    if (!isOpen && !isRejectModalOpen && !isApproveModalOpen) return null;
    if (!request && !requestToProcess) return null;

    // Stocker la demande pour l'utiliser même après la fermeture du modal principal
    const currentRequest = requestToProcess || request;

    const handleReject = () => {
        setRequestToProcess(request); // Mémoriser la demande En Cours
        setIsRejectModalOpen(true); // Préparer l'ouverture du modal de rejet
        onClose(); // Fermer le modal de détails
    };

    const handleApprove = () => {
        setRequestToProcess(request); // Mémoriser la demande En Cours
        setIsApproveModalOpen(true); // Préparer l'ouverture du modal d'approbation
        onClose(); // Fermer le modal de détails
    };

    // Formatage de la date si nécessaire
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('fr-FR');
        } catch {
            return dateString;
        }
    };

    return (
        <>
            {isOpen && request && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
                    <div className="bg-white rounded-lg p-6 max-w-lg w-full relative">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-bold mb-1">Détails de la demande</h2>
                        <p className="text-gray-500 text-sm mb-4">Informations complètes sur la demande de formation</p>

                        <div className="mb-4">
                            <h3 className="text-lg font-semibold">{request.theme}</h3>
                            <p className="text-gray-600">{request.domain}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="text-gray-500 text-sm">Année</p>
                                <p className="font-medium">{request.year}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Demandeur</p>
                                <p className="font-medium">{request.requester}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Site</p>
                                <p className="font-medium">{request.site}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Département</p>
                                <p className="font-medium">{request.department}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Date souhaitée</p>
                                <p className="font-medium">{formatDate(request.creationDate)}</p>
                            </div>
                        </div>

                        {request.objective && (
                            <div className="mb-6">
                                <p className="text-gray-500 text-sm">Description</p>
                                <p className="font-medium">{request.objective}</p>
                            </div>
                        )}

                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
                            >
                                Fermer
                            </button>
                            <button
                                onClick={handleReject}
                                className="px-4 py-2 bg-white hover:bg-red-50 text-red-500 border border-red-500 rounded-md flex items-center"
                            >
                                <span className="mr-1">⨯</span> Refuser
                            </button>
                            <button
                                onClick={handleApprove}
                                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md flex items-center"
                            >
                                <span className="mr-1">✓</span> Approuver
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <RejectRequestModal
                isOpen={isRejectModalOpen}
                onClose={() => {
                    setIsRejectModalOpen(false);
                    setRequestToProcess(null);
                }}
                request={currentRequest}
                mutateUrl={mutateUrl}
                apiUrl={apiUrl}
            />

            <ApproveRequestModal
                isOpen={isApproveModalOpen}
                onClose={() => {
                    setIsApproveModalOpen(false);
                    setRequestToProcess(null);
                }}
                request={currentRequest}
                mutateUrl={mutateUrl}
                apiUrl={apiUrl}
            />
        </>
    );
};

export default TeamRequestDetailsModal;