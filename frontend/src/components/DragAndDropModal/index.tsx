import React, {useCallback, useState} from "react";
import {Upload} from "lucide-react";

const DragAndDropModal = ({
                              isOpen,
                              onClose,
                              title,
                              subtitle,
                              icon,
                              children,
                              actions,
                              handleFileChange
                          }) => {
    const [dragActive, setDragActive] = useState(false);
    const [files, setFiles] = useState([]);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const droppedFiles = [...e.dataTransfer.files];

        // Si un gestionnaire de fichiers est fourni, l'utiliser
        if (handleFileChange) {
            const syntheticEvent = {
                target: {files: droppedFiles},
                preventDefault: () => {
                }
            } as unknown as React.ChangeEvent<HTMLInputElement>;

            handleFileChange(syntheticEvent);
        }

        setFiles(droppedFiles);
    }, [handleFileChange]);

    const handleChange = useCallback((e) => {
        e.preventDefault();
        const uploadedFiles = [...e.target.files];

        // Si un gestionnaire de fichiers est fourni, l'utiliser
        if (handleFileChange) {
            handleFileChange(e);
        }

        setFiles(uploadedFiles);
    }, [handleFileChange]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-[55]">
            <div className="w-[400px] lg:w-[700px] bg-white rounded-lg p-6">
                <div className="flex flex-col space-y-6">
                    {/* En-tête du modal */}
                    <div className="relative">
                        {/* Arrière-plan de l'en-tête */}
                        <div
                            className="absolute inset-0 bg-right bg-[url('/images/bg-modal.svg')] bg-no-repeat opacity-20"
                            style={{backgroundSize: "35% auto"}}
                        />

                        <div className="flex items-center space-x-2 relative z-10">
                            {/* Icône */}
                            <div className="mr-2">
                                {icon ? (
                                    <div className="w-8 h-8 text-black">
                                        {icon}
                                    </div>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={3.5}
                                        stroke="currentColor"
                                        className="w-8 h-8 text-black"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 4v16m8-8H4"
                                        />
                                    </svg>
                                )}
                            </div>

                            {/* Titre et sous-titre */}
                            <div>
                                {title && (
                                    <h2 className="text-xl font-bold">
                                        {title}
                                    </h2>
                                )}
                                {subtitle && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        {subtitle}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Zone de glisser-déposer */}
                    <div
                        className={`
                            relative border-2 border-dashed rounded-lg p-6 transition-colors
                            ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
                            hover:border-blue-500
                        `}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input
                            type="file"
                            multiple
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleChange}
                            accept=".csv"
                        />

                        <div className="flex flex-col items-center">
                            <Upload className="w-12 h-12 text-gray-400 mb-4"/>
                            <p className="text-sm text-gray-600 text-center">
                                Glissez et déposez vos fichiers ici, ou
                                <span className="text-blue-500 hover:text-blue-600 ml-1">
                                    parcourez
                                </span>
                            </p>
                        </div>

                        {/* Liste des fichiers */}
                        {files.length > 0 && (
                            <div className="mt-4">
                                <p className="text-sm font-medium text-gray-700">
                                    Fichiers sélectionnés:
                                </p>
                                <ul className="mt-2 space-y-1">
                                    {files.map((file, index) => (
                                        <li key={index} className="text-sm text-gray-600">
                                            {file.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-around mt-6">
                        {actions && actions.map((action, index) => (
                            <button
                                key={index}
                                className={`${action.className} px-4 py-2 rounded-md`}
                                onClick={action.onClick}
                            >
                                {action.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DragAndDropModal;