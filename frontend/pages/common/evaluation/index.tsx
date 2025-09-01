import React, {useCallback, useMemo} from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import {useAuth, UserRole} from "@/contexts/AuthContext";
import EvaluationCard from "@/components/ui/EvaluationCard";
import useSWR, {mutate} from "swr";
import {MyEvaluationsProps} from "@/types/dataTypes";
import {MY_EVALUATIONS_URLS} from "@/config/urls";
import {fetcher} from "@/services/api";

const MyEvaluationsComponent: React.FC = () => {
    const {user} = useAuth()
    const {data: myEvaluationsData} = useSWR<MyEvaluationsProps[]>(`${MY_EVALUATIONS_URLS.mutate}/${user?.id}`, fetcher);
    const memorizedMyEvaluationsData = useMemo(() =>
        myEvaluationsData || [], [myEvaluationsData]);


    // Fonction pour déclencher la réactualisation des données
    const revalidateEvaluations = useCallback(() => {
        mutate(`${MY_EVALUATIONS_URLS.mutate}/${user?.id}`);
    }, [user?.id]);

    return (
        <ProtectedRoute requiredRoles={[UserRole.Collaborateur, UserRole.Manager]}>
            <div className="container mx-auto py-8 px-4 bg-white rounded-lg">
                <h1 className="text-2xl font-bold mb-6">Mes évaluations</h1>
                <div className="grid gap-6">
                    {memorizedMyEvaluationsData.map((course) => (
                        <EvaluationCard
                            key={course.id}
                            id={course.id}
                            category={course.category}
                            status={course.status}
                            title={course.title}
                            description={course.description}
                            type={course.type}
                            startDate={course.startDate}
                            progress={course.progress}
                            questions={course.questions}
                            isSentToManager={course.isSentToManager} // Ajouter cette ligne
                            onResponsesSaved={revalidateEvaluations}
                        />
                    ))}
                </div>
            </div>
        </ProtectedRoute>

    )
}
export default MyEvaluationsComponent;