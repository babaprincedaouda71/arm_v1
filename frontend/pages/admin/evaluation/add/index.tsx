import React, {useEffect, useState} from 'react'; // Importez useState et useEffect
import EvaluationForm from '@/components/FormComponents/EvaluationForm';
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";
import {QUESTIONNAIRE_URLS} from "@/config/urls";
import {useRouter} from "next/router";

// Il est préférable de donner un nom plus descriptif au composant, par exemple QuestionnairePage
const QuestionnairePage = () => {
    const {navigateTo} = useRoleBasedNavigation();
    const router = useRouter();
    const {questionnaireId, questionnaireType} = router.query;

    // État pour stocker les données du questionnaire à modifier
    const [initialData, setInitialData] = useState<any | null>(null);
    // État pour gérer le chargement des données en mode modification
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // useEffect pour récupérer les données du questionnaire si questionnaireId est présent
    useEffect(() => {
        if (questionnaireId) {
            setIsLoading(true);
            // Remplacez cette URL par l'URL réelle de votre API pour récupérer un questionnaire
            const fetchUrl = `${QUESTIONNAIRE_URLS.getQuestionnaire}/${questionnaireId}`; // Exemple d'URL d'API GET

            fetch(fetchUrl, {credentials: 'include'}) // 'include' pour envoyer les cookies si nécessaire
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(data => {
                    // Supposons que votre API renvoie les données du questionnaire
                    // directement ou sous une propriété (ex : data. Questionnaire)
                    // Adaptez la ligne suivante à la structure de votre réponse API
                    setInitialData(data.questionnaire || data);
                })
                .catch(error => {
                    console.error("Erreur lors de la récupération du questionnaire:", error);
                    // Optionnel : Gérer l'erreur, par exemple, rediriger ou afficher un message
                    // navigateTo('/evaluation?error=notfound');
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [questionnaireId]); // Ce hook s'exécute à chaque changement de questionnaireId

    // Dans QuestionnairePage.tsx

    const handleSubmit = (data: any) => {
        console.log("Données du formulaire soumises :", data);
        const method = questionnaireId ? 'PUT' : 'POST';
        const url = questionnaireId ? `${QUESTIONNAIRE_URLS.update}/${questionnaireId}` : QUESTIONNAIRE_URLS.add;

        const bodyPayload = questionnaireType ? {...data, questionnaireType} : data;

        fetch(url, {
            method: method,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                // Si vous avez un token d'authentification, ajoutez-le ici, par exemple :
                // 'Authorization': `Bearer ${votreToken}`
            },
            body: JSON.stringify(bodyPayload),
        })
            .then(data => {
                console.log('Succès:', data);
                navigateTo('/evaluation');
            })
            .catch((error) => {
                console.error('Erreur:', error);
            });
    };

    // Afficher un message de chargement pendant la récupération des données
    if (questionnaireId && isLoading) {
        return (
            <div className='mx-auto bg-white font-title rounded-lg px-6 pb-14 pt-4 text-center'>
                <p>Chargement du questionnaire...</p>
            </div>
        );
    }

    // Si questionnaireId est présent, mais initialData est null (et pas en chargement),
    // cela peut signifier une erreur ou que le questionnaire n'a pas été trouvé.
    if (questionnaireId && !initialData && !isLoading) {
        return (
            <div className='mx-auto bg-white font-title rounded-lg px-6 pb-14 pt-4 text-center'>
                <p>Impossible de charger les données du questionnaire. Vérifiez l'identifiant ou réessayez.</p>
                <button onClick={() => navigateTo('/evaluation')} className="mt-4 text-blue-500 hover:underline">
                    Retour à la liste
                </button>
            </div>
        );
    }

    return (
        <div className='mx-auto bg-white font-title rounded-lg px-6 pb-14 pt-4'>
            {/* Passez initialData au composant EvaluationForm */}
            {/* questionnaireId est passé pour que EvaluationForm sache aussi s'il est en mode édition */}
            <EvaluationForm
                questionnaireType={questionnaireType}
                questionnaireId={questionnaireId}
                onSubmit={handleSubmit}
                initialData={initialData}
            />
        </div>
    )
}

export default QuestionnairePage; // Exportez avec le nouveau nom