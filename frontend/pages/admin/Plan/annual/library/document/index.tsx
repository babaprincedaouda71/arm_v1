import TabBar from '@/components/TabBar';
import React, {useState} from 'react'
import PresenceList from './AttendanceList';
import Evaluation from './Evaluation';
import EducationalDocuments from './EducationalDocuments';

const DocumentPage = () => {
    const [activeTab, setActiveTab] = useState("presenceList");

    const tabs = [
        {id: "presenceList", label: "Liste de présence"},
        {id: "evaluation", label: "Évaluation"},
        {id: "educationalDocuments", label: "Documents pédagogiques"},
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "presenceList":
                return <PresenceList/>;
            case "evaluation":
                return <Evaluation/>;
            case "educationalDocuments":
                return <EducationalDocuments/>;
        }
    };
    return (
        <div className="font-title text-xs md:text-sm lg:text-base rounded-t-xl">
            <TabBar tabs={tabs} onTabChange={setActiveTab} activeTab={activeTab}/>
            <div className=""> {renderContent()} </div>
        </div>
    )
}

export default DocumentPage