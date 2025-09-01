// pages/IndividualRequest.tsx
import React, {useEffect, useState} from "react";
import {useRouter} from 'next/router';
import NeedsEvaluationDashboard from "@/components/Needs/Evaluation/Dashboar";
import NeedsEvaluationCampaign from "@/components/Needs/Evaluation/Campaign";
import ProtectedRoute from "@/components/ProtectedRoute";
import {UserRole} from "@/contexts/AuthContext";
import TabBar from "@/components/TabBar";

const NeedsEvaluation = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const router = useRouter();

    useEffect(() => {
        const tabFromQuery = router.query.tab;
        if (tabFromQuery === 'campaign') {
            setActiveTab('campaign');
        }
    }, [router.query.tab]);

    const tabs = [
        {id: "dashboard", label: "Tableau de bord"},
        {id: "campaign", label: "Campagne"},
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return <NeedsEvaluationDashboard/>;
            case "campaign":
                return <NeedsEvaluationCampaign/>;
        }
    };


    return (
        <ProtectedRoute requiredRole={UserRole.Admin}>
            <div className="font-title text-xs md:text-sm lg:text-base rounded-t-xl">
                <TabBar tabs={tabs} onTabChange={setActiveTab} activeTab={activeTab}/>
                <div className=""> {renderContent()} </div>
            </div>
        </ProtectedRoute>
    );
};

export default NeedsEvaluation;