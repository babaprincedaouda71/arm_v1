// src/hooks/users/useCsvImport.ts

import React, {useCallback, useState} from 'react';
import {parseAndValidateCSV, sendCsvDataToBackend} from "@/services/csvService";
import {CsvUserData} from "@/types/dataTypes";
import {mutate} from "swr"; // Pour invalider le cache SWR
import {USERS_URLS} from "@/config/urls"; // Pour l'URL à muter

interface UseCsvImportResult {
    csvFile: File | null;
    setCsvFile: (file: File | null) => void;
    isLoading: boolean;
    errorMessage: string | null;
    handleSave: (onSuccess?: () => void) => void;
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    resetCsvImport: () => void;
}

export const useCsvImport = (): UseCsvImportResult => {
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const resetCsvImport = useCallback(() => {
        setCsvFile(null);
        setIsLoading(false);
        setErrorMessage(null);
    }, []);

    const handleSave = useCallback((onSuccess?: () => void) => {
        if (!csvFile) {
            setErrorMessage("Veuillez sélectionner un fichier CSV.");
            return;
        }
        setIsLoading(true);
        parseAndValidateCSV(
            csvFile,
            async (validData: CsvUserData[]) => {
                try {
                    await sendCsvDataToBackend(validData);
                    setErrorMessage("Importation des données réussie");
                    await mutate(USERS_URLS.mutate); // Invalide le cache après succès
                    if (onSuccess) onSuccess();
                } catch (error) {
                    setErrorMessage("Échec de l'importation des données");
                    console.error("CSV Import Error:", error);
                } finally {
                    setIsLoading(false);
                }
            },
            (error: string) => {
                setErrorMessage(error);
                setIsLoading(false);
            }
        );
    }, [csvFile]);

    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === 'text/csv') {
            setCsvFile(file);
            setErrorMessage(null); // Réinitialise le message d'erreur si un fichier valide est sélectionné
        } else {
            setCsvFile(null);
            setErrorMessage('Veuillez sélectionner un fichier CSV valide');
        }
    }, []);

    return {
        csvFile,
        setCsvFile,
        isLoading,
        errorMessage,
        handleSave,
        handleFileChange,
        resetCsvImport,
    };
};