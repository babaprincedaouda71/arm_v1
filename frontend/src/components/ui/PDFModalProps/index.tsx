// Interface pour le modal PDF
import React from "react";
import {FiX} from "react-icons/fi";

// Interface pour le modal PDF
interface PDFModalProps {
    isOpen: boolean;
    onClose: () => void;
    pdfUrl: string | null;
    title: string;
    isLoading: boolean;
}

// Composant Modal PDF
const PDFModal: React.FC<PDFModalProps> = ({isOpen, onClose, pdfUrl, title, isLoading}) => {
    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleOverlayClick}
        >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded"
                    >
                        <FiX size={24}/>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 p-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <div
                                    className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">Chargement du PDF...</p>
                            </div>
                        </div>
                    ) : pdfUrl ? (
                        <iframe
                            src={pdfUrl}
                            className="w-full h-full border-0 rounded"
                            title={title}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500">Erreur lors du chargement du PDF</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end p-4 border-t bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-redShade-500 hover:bg-redShade-600 text-white rounded-lg transition-colors"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
};
export default PDFModal;