import React, {useMemo, useState} from 'react'
import useSWR from "swr";
import {MyProfileProps} from "@/types/dataTypes";
import {fetcher} from "@/services/api";
import PersonalInfos from "./PersonalInfos";
import ProfessionalInfos from "./ProfessionalInfos";
import TabBar from "@/components/TabBar";
import ProfileCard from "@/components/ProfileCard";
import {useAuth} from "@/contexts/AuthContext";

const GET_COLLABORATOR_URL = "http://localhost:8888/api/users/get/my-profile";

const ProfileComponent = () => {
    const {user} = useAuth()
    const userId = user?.id; // utilisation de l'opérateur de chaînage optionnel

    const {data: userData} = useSWR<MyProfileProps>(
        userId ? `${GET_COLLABORATOR_URL}/${userId}` : null,
        fetcher
    );

    const tabs = useMemo(() => [
        {id: 'personal-infos', label: 'Informations Personnelles'},
        {id: 'professional-infos', label: 'Informations Professionnelles'},
    ], []);
    const [activeTab, setActiveTab] = useState<string>(tabs[0].id);

    const content = useMemo(() => ({
        'personal-infos': userData?.personalInfos ? <PersonalInfos data={userData.personalInfos}/> : null,
        'professional-infos': userData?.professionalInfos ? <ProfessionalInfos data={userData.professionalInfos}/> : null,
    }), [userData]);

    return (
        <div className="font-title p-10 text-xs md:text-sm lg:text-base bg-white rounded-t-xl">
            {userData && <ProfileCard user={userData}/>}
            <TabBar tabs={tabs} onTabChange={setActiveTab} activeTab={activeTab}/>
            <div className="">{content[activeTab as keyof typeof content]}</div>
        </div>
    )
}

export default ProfileComponent