import Papa from "papaparse";
import {CsvUserData} from "@/types/dataTypes";

/**
 * Parse le fichier CSV, valide les données et appelle les callbacks de succès ou d'erreur.
 * @param csvFile Le fichier CSV à analyser.
 * @param onSuccess Callback appelé avec les données valides.
 * @param onError Callback appelé en cas d'erreur.
 */
export const parseAndValidateCSV = (
    csvFile: File,
    onSuccess: (validData: CsvUserData[]) => void,
    onError: (error: string) => void
): void => {
    Papa.parse(csvFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
            // Typage explicite des résultats
            const data = results.data as CsvUserData[];
            const validData: CsvUserData[] = data
                .filter((row): row is CsvUserData => {
                    const isValid =
                        typeof row.firstName === "string" &&
                        typeof row.lastName === "string" &&
                        typeof row.email === "string" &&
                        typeof row.gender === "string" &&
                        typeof row.birthDate === "string" &&
                        typeof row.phoneNumber === "string" &&
                        typeof row.address === "string" &&
                        typeof row.cin === "string" &&
                        typeof row.collaboratorCode === "string" &&
                        typeof row.socialSecurityNumber === "string" &&
                        typeof row.hiringDate === "string" &&
                        typeof row.department === "string" &&
                        typeof row.position === "string" &&
                        typeof row.creationDate === "string";

                    if (!isValid) {
                        console.log("Ligne exclue:", row);
                    }
                    return isValid;
                })
                .map((row) => ({
                    ...row,
                    status: row.status || "active",
                }));

            if (validData.length > 0) {
                onSuccess(validData);
            } else {
                onError("Aucune donnée valide trouvée dans le fichier CSV");
            }
        },
        error: () => {
            onError("Erreur lors de l'analyse du fichier CSV");
        },
    });
};

/**
 * Envoie les données CSV validées vers le backend.
 * @param data Les données validées à envoyer.
 */
export const sendCsvDataToBackend = async (
    data: CsvUserData[]
): Promise<void> => {
    const response = await fetch("http://localhost:8888/api/users/import", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error("Erreur lors de l'importation des données");
    }
    await response.json();
};

/**
 * Exporte les données en CSV et déclenche le téléchargement.
 * @param data Les données à exporter.
 * @param filename Nom du fichier CSV à télécharger.
 */
export const exportToCSV = (data: any[], filename: string = "export.csv"): void => {
    const csv = Papa.unparse(data, {
        header: true,
        delimiter: ",",
    });
    const blob = new Blob([csv], {type: "text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};