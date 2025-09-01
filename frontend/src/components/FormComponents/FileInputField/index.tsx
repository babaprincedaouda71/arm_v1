import React, { useState, useRef } from "react";
import { Upload } from "lucide-react";

interface FileInputFieldProps {
    label: string;
    name: string;
    onChange: (files: File[]) => void;
    className?: string;
    accept?: string;
    labelClassName?: string;
    inputClassName?: string;
}

const FileInputField = ({
    label,
    name,
    onChange,
    className = "",
    accept = "*/*",
    labelClassName = "",
    inputClassName = "",
}: FileInputFieldProps) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setSelectedFiles(files);
        onChange(files);
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={`flex items-center font-tHead text-formInputTextColor font-semibold w-full text-xs md:text-sm lg:text-base ${className}`}>
            <label className={`flex-[1] block break-words pt-2 ${labelClassName}`}>
                {label}
            </label>
            <div className="flex-[4] relative">
                <button
                    type="button"
                    onClick={handleClick}
                    className={`w-full h-[48px] bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd hover:bg-[#4F46E5] text-white rounded-md flex items-center justify-center gap-2 transition-colors ${inputClassName}`}
                >
                    <Upload size={26} />
                    <span>
                        {selectedFiles.length > 0
                            ? `${selectedFiles.length} fichier${selectedFiles.length > 1 ? 's' : ''} sélectionné${selectedFiles.length > 1 ? 's' : ''}`
                            : "Choisir des fichiers"}
                    </span>
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    name={name}
                    onChange={handleFileChange}
                    accept={accept}
                    multiple
                    className={`hidden`}
                />
            </div>
        </div>
    );
};

export default FileInputField;