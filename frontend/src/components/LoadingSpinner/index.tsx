import React from "react";

const LoadingSpinner = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
            <div className="flex flex-col items-center">
                <div
                    className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-blue-600 font-medium">Chargement...</p>
            </div>
        </div>
    );
};
export default LoadingSpinner;