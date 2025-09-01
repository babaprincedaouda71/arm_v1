// hooks/useFormHandlers.ts
import {useState} from "react";

export const useFormHandlers = (initialFiles: any = {}, initialFormData: any = {}) => {
    const [files, setFiles] = useState(initialFiles);
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const isPdfFile = (file: File) => {
        const contentType = file.type;
        const filename = file.name;
        return (contentType === "application/pdf") || filename.toLowerCase().endsWith(".pdf");
    };

    const handleFileChange = (fieldName: string) => (selectedFiles: File[]) => {
        const file = selectedFiles?.[0] || null;

        if (file && !isPdfFile(file)) {
            setErrors(prev => ({...prev, [fieldName]: "Seuls les fichiers PDF sont acceptés"}));
            return;
        }

        if (file && file.size > 10 * 1024 * 1024) {
            setErrors(prev => ({...prev, [fieldName]: "Le fichier ne peut pas dépasser 10MB"}));
            return;
        }

        setFiles(prev => ({...prev, [fieldName]: file}));
        if (errors[fieldName]) {
            setErrors(prev => ({...prev, [fieldName]: null}));
        }
    };

    return {
        formData,
        files,
        errors,
        handleChange,
        handleFileChange,
        isPdfFile,
        setFormData,
        setFiles,
        setErrors,
    };
};