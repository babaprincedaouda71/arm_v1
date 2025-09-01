import React, { useState } from "react";
import { TeamRequestsProps } from "@/types/dataTypes";
import { mutate } from "swr";

interface ApproveRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    request: TeamRequestsProps;
    mutateUrl?: string;
    apiUrl?: string;
}

const ApproveRequestModal: React.FC<ApproveRequestModalProps> = ({
                                                                     isOpen,
                                                                     onClose,
                                                                     request,
                                                                     mutateUrl,
                                                                     apiUrl
                                                                 }) => {
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen || !request) return null;

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            setError(null);

            const response = await fetch(apiUrl, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: request.id,
                    status: "Approved",
                    approvalComment: comment // Commentaire optionnel
                })
            });

            if (!response.ok) {
                throw new Error(`Erreur lors de l'approbation de la demande: ${response.statusText}`);
            }

            // Rafraîchir les données avec SWR après mise à jour
            if (mutateUrl) {
                await mutate(mutateUrl);
            }

            onClose();
        } catch (error) {
            console.error("Erreur lors de l'approbation de la demande:", error);
            setError(error.message || "Une erreur est survenue lors de l'approbation de la demande");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold">Approuver la demande</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                <p className="mb-4 text-gray-600">
                    Vous êtes sur le point d'approuver la demande de formation suivante:
                </p>

                <div className="bg-green-50 p-4 rounded-lg mb-6 flex items-start">
                    <div className="text-green-500 mr-3 mt-1">✓</div>
                    <div>
                        <h3 className="font-medium text-gray-900">{request.theme}</h3>
                        <p className="text-gray-600">Demandeur: {request.requester} • {request.department}</p>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block mb-2 text-gray-700 font-medium">
                        Commentaire (optionnel)
                    </label>
                    <textarea
                        className="w-full border border-gray-300 rounded-md p-3 h-24"
                        placeholder="Ajoutez un commentaire à l'approbation..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    {error && <p className="text-red text-sm mt-1">{error}</p>}
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
                        disabled={isSubmitting}
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Traitement..." : "Confirmer l'approbation"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApproveRequestModal;