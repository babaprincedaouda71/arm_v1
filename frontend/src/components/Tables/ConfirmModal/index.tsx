import React from "react";

// Composant de modal de confirmation
interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    errors?: string | null;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({isOpen, onClose, onConfirm, title, message, errors}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>

            {/* Modal */}
            <div className="relative bg-white rounded-lg p-6 shadow-xl max-w-md w-full">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <p className="mt-2 text-sm text-gray-600">{message}</p>
                    {errors && (
                        <div className="text-redShade-100 text-sm mt-2">{errors}</div>
                    )}
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        className="px-4 py-2 text-sm font-medium text-gray-800 bg-gray-300 rounded-md hover:bg-gray-400"
                        onClick={onClose}
                    >
                        Non, annuler
                    </button>
                    <button
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                        onClick={() => {
                            onConfirm();
                        }}
                    >
                        Oui
                    </button>

                </div>
            </div>
        </div>
    );
};