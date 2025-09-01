import React, { useState, useRef } from "react";
import { Upload, FileText, X } from "lucide-react";

interface SingleFileInputFieldProps {
    label: string;
    name: string;
    onChange: (file: File | null) => void;
    className?: string;
    accept?: string;
    labelClassName?: string;
    inputClassName?: string;
    error?: string;
}

const SingleFileInputField = ({
                                  label,
                                  name,
                                  onChange,
                                  className = "",
                                  accept = "*/*",
                                  labelClassName = "",
                                  inputClassName = "",
                                  error = "",
                              }: SingleFileInputFieldProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setSelectedFile(file);
        onChange(file);
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedFile(null);
        onChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className={`flex items-center font-tHead text-formInputTextColor font-semibold w-full text-xs md:text-sm lg:text-base ${className}`}>
            <label className={`flex-[1] block break-words pt-2 ${labelClassName}`}>
                {label}
            </label>
            <div className="flex-[4] relative">
                {!selectedFile ? (
                    // Bouton d'upload
                    <button
                        type="button"
                        onClick={handleClick}
                        className={`w-full h-[48px] bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd hover:bg-[#4F46E5] text-white rounded-md flex items-center justify-center gap-2 transition-colors ${error ? 'border-2 border-red-500' : ''} ${inputClassName}`}
                    >
                        <Upload size={20} />
                        <span>Choisir un fichier</span>
                    </button>
                ) : (
                    // Affichage du fichier sélectionné
                    <div className={`w-full h-[48px] bg-inputBgColor rounded-md flex items-center justify-between px-3 ${error ? 'border border-red-500' : 'border border-gray-200'}`}>
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            <FileText size={20} className="text-blue-500 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate" title={selectedFile.name}>
                                    {selectedFile.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {formatFileSize(selectedFile.size)}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="ml-2 p-1 hover:bg-red-100 rounded-full transition-colors flex-shrink-0"
                            title="Supprimer le fichier"
                        >
                            <X size={16} className="text-red-500" />
                        </button>
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    name={name}
                    onChange={handleFileChange}
                    accept={accept}
                    className="hidden"
                />

                {/* Affichage du message d'erreur */}
                {error && (
                    <p className="text-right mt-1 text-sm text-red">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
};

export default SingleFileInputField;