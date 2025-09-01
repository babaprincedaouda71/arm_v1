import React, { useState, useEffect } from 'react';

interface AlertProps {
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number; // Durée en millisecondes, par défaut à 5000 (5 secondes)
    onClose?: () => void; // Fonction optionnelle à appeler lors de la fermeture
}

const Alert: React.FC<AlertProps> = ({ message, type, duration = 2000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (isVisible && duration > 0) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                if (onClose) {
                    onClose();
                }
            }, duration);

            return () => clearTimeout(timer); // Nettoyage du timer si le composant est démonté
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible) {
        return null;
    }

    let backgroundColorClass = '';
    let borderColorClass = '';
    let textColorClass = '';

    switch (type) {
        case 'success':
            backgroundColorClass = 'bg-green-200';
            borderColorClass = 'border-green-400';
            textColorClass = 'text-green-700';
            break;
        case 'error':
            backgroundColorClass = 'bg-red-200';
            borderColorClass = 'border-red';
            textColorClass = 'text-red-700';
            break;
        case 'warning':
            backgroundColorClass = 'bg-yellow-200';
            borderColorClass = 'border-yellow-400';
            textColorClass = 'text-yellow-700';
            break;
        case 'info':
            backgroundColorClass = 'bg-blue-200';
            borderColorClass = 'border-blue-400';
            textColorClass = 'text-blue-700';
            break;
        default:
            backgroundColorClass = 'bg-gray-100';
            borderColorClass = 'border-gray-300';
            textColorClass = 'text-gray-700';
            break;
    }

    return (
        <div className={`px-4 py-3 rounded relative mb-4 border-l-4 ${backgroundColorClass} ${borderColorClass} ${textColorClass}`} role="alert">
            <strong className="font-bold">{type.toUpperCase()}!</strong>
            <span className="block sm:inline ml-2">{message}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                <svg onClick={() => setIsVisible(false)} className={`fill-current h-6 w-6 ${textColorClass} cursor-pointer`} role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path fillRule="evenodd" d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.586l-2.651 3.263a1.2 1.2 0 0 1-1.697-1.697L8.303 10l-3.263-2.651a1.2 1.2 0 0 1 1.697-1.697L10 8.303l2.651-3.263a1.2 1.2 0 0 1 1.697 1.697L11.697 10l3.263 2.651a1.2 1.2 0 0 1 0 1.697z" /></svg>
            </span>
        </div>
    );
};

export default Alert;