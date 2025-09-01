import React, {useState} from "react";
import StrategicAxesDashboard from "@/components/Needs/StrategicAxes/Dashboard";
import StrategicAxesCampaign from "@/components/Needs/StrategicAxes/Campaign";
import ProtectedRoute from "@/components/ProtectedRoute";
import TabBar from "@/components/TabBar";
import {NEEDS_STRATEGIC_AXES_URLS, NEEDS_URLS} from "@/config/urls";
import {mutate} from "swr";
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";

const NeedsStrategicAxes = () => {
    const {navigateTo, buildRoleBasedPath} = useRoleBasedNavigation();
    const [activeTab, setActiveTab] = useState("dashboard");

    const tabs = [
        {id: "dashboard", label: "Tableau de bord"},
        {id: "strategicAxes", label: "Axes Stratégiques"},
    ];

    const handleDuplicateGroup = async (group: any) => {
        // Logique pour dupliquer le groupe
        console.log("Duplication du groupe :", group);
        // Implémentez ici la logique pour dupliquer le groupe dans votre état ou API
        const response = await fetch(`${NEEDS_URLS.duplicateGroup}/${group.id}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error(`Erreur lors de la duplication du groupe : ${response.status}`);
        }


        // Mettez à jour le tableau ou l'état local après la duplication
        mutate(NEEDS_STRATEGIC_AXES_URLS.mutate);
    };

    const handleAddGroup = (need: any) => {
        navigateTo("/Needs/group/add-group", {
            query: {needId: need.id},
        });
    }
    const handleEditGroup = (need: any, groupId: number) => {
        navigateTo("/Needs/group/add-group", {
            query: {
                needId: need.id,
                groupId: groupId,
            },
        });
    }

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return <StrategicAxesDashboard
                    handleDuplicateGroup={handleDuplicateGroup}
                    handleAddGroup={handleAddGroup}
                    handleEditGroup={handleEditGroup}
                />;
            case "strategicAxes":
                return <StrategicAxesCampaign
                    handleDuplicateGroup={handleDuplicateGroup}
                    handleAddGroup={handleAddGroup}
                    handleEditGroup={handleEditGroup}
                />;
        }
    };
    return (
        <ProtectedRoute>
            <div className="font-title text-xs md:text-sm lg:text-base rounded-t-xl">
                <TabBar tabs={tabs} onTabChange={setActiveTab} activeTab={activeTab}/>
                <div className=""> {renderContent()} </div>
            </div>
        </ProtectedRoute>
    );
};

export default NeedsStrategicAxes;