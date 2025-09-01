/**
 * Service API générique utilisé par SWR et d'autres appels réseau.
 */
export const fetcher = async (url: string) => {
    const response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données");
    }
    return response.json();
};