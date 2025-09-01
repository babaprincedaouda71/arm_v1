import React from 'react';

interface ModalInformationProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
}

const ModalInformation: React.FC<ModalInformationProps> = ({ isOpen, onClose, message }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Information</h2>
                <p className="text-gray-700 mb-4">{message}</p>
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-grayz-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalInformation;