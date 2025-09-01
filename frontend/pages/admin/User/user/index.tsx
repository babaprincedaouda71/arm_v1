import React, {useMemo, useState} from "react";
import TabBar from "@/components/TabBar";
import Profile from "../profile";
import Planning from "../planning";
import TrainingHistory from "../training-history";
import useSWR from "swr";
import {CollaboratorProps} from "@/types/dataTypes";
import {useRouter} from "next/router";
import ProtectedRoute from "@/components/ProtectedRoute";
import {UserRole} from "@/contexts/AuthContext";
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";
import {FiCornerUpLeft} from "react-icons/fi";

const GET_COLLABORATOR_URL = "http://localhost:8888/api/users/get/";

const fetchCollaboratorData = async (url: string) => {
    const response = await fetch(url, {
        method: "GET",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        }
    });

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return response.json();
};

const CollaboratorIndex = () => {
    const {navigateTo} = useRoleBasedNavigation();
    const router = useRouter();
    const {id} = router.query;

    const {data: userData, error} = useSWR<CollaboratorProps>(
        id ? `${GET_COLLABORATOR_URL}${id}` : null,
        fetchCollaboratorData
    );

    const tabs = useMemo(() => [
        {id: 'profile', label: 'Profil'},
        {id: 'planning', label: 'Planification'},
        {id: 'training-history', label: 'Historique de formation'},
    ], []);

    const [activeTab, setActiveTab] = useState<string>(tabs[0].id);

    const content = useMemo(() => ({
        profile: <Profile userData={userData || {}}/>,
        planning: <Planning userId={id}/>,
        'training-history': <TrainingHistory userId={id}/>,
    }), [userData, id]);

    if (error) return <div>Failed to load user data</div>;
    if (!userData && id) return <div>Loading...</div>;

    const handleBackToList = () => {
        navigateTo('/User');
    }

    return (
        <ProtectedRoute requiredRole={UserRole.Admin}>
            <div className="font-title text-xs md:text-sm lg:text-base bg-white rounded-t-xl">
                <TabBar tabs={tabs} onTabChange={setActiveTab} activeTab={activeTab}/>
                <div
                    className="relative pl-2 flex items-center mb-4"> {/* Conteneur principal pour le positionnement relatif */}
                    {/* Bouton Retour à la liste aligné à gauche */}
                    <button
                        onClick={handleBackToList}
                        className="text-blue-500 border-2 flex gap-2 rounded-xl p-2 hover:underline focus:outline-none"
                    >
                        <FiCornerUpLeft size={24}/>
                        Retour à la liste
                    </button>

                    {/* Conteneur pour centrer le titre */}
                    {/* 'absolute inset-x-0' permet au titre de se centrer par rapport au conteneur parent sans être affecté par le bouton */}
                    {/* 'pointer-events-none' sur le conteneur du titre et 'pointer-events-auto' sur le h1 sont pour s'assurer que le titre ne bloque pas les clics si jamais il se superpose (peu probable ici) */}
                    <div className="absolute inset-x-0 flex justify-center items-center pointer-events-none">
                        <h1 className="text-2xl font-semibold text-gray-800 pointer-events-auto">
                        </h1>
                    </div>
                </div>
                <div className="">{content[activeTab as keyof typeof content]}</div>
            </div>
        </ProtectedRoute>
    );
};

export default CollaboratorIndex;