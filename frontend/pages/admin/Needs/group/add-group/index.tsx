import React, {useEffect, useMemo} from 'react'
import {useRouter} from 'next/router';
import {FiCalendar, FiUsers} from 'react-icons/fi';
import SecondaryNavbar from '@/components/SecondaryNavbar';
import {useNavigationState} from '@/hooks/useNavigationState';
import ErrorMessage from '@/components/ErrorBoundary/ErrorMessage';
import {ErrorBoundary} from 'react-error-boundary';
import {Package} from 'lucide-react';
import Planning from '../planning';
import Participants from '../participants'
import Providers from '../providers';
import useSWR from 'swr';
import {DepartmentProps, SiteProps} from '@/types/dataTypes';
import {DEPARTMENT_URLS, NEEDS_GROUP_URLS, SITE_URLS} from '@/config/urls';
import {fetcher} from '@/services/api';

export interface TrainerProps {
    id: number;
    name: string;
}

export interface OCFProps {
    id: number;
    corporateName: string;
    emailMainContact: string;
}

export interface GroupData {
    id: number;
    location: string;
    city: string;
    dates: string[];
    morningStartTime: string;
    morningEndTime: string;
    afternoonStartTime: string;
    afternoonEndTime: string;
    targetAudience: string;
    managerCount: number;
    employeeCount: number;
    workerCount: number;
    temporaryWorkerCount: number;
    userGroupIds: number[];
    trainer: TrainerProps;
    internalTrainerId: number;
    comment: string;
    trainingType: string;
    ocf: OCFProps
    externalTrainerName: string;
    externalTrainerEmail: string;
    externalTrainerCv: string;
    cost: number;
}


const AddGroup = () => {
    const router = useRouter();
    const {needId, groupId} = router.query; // Récupérer l'ID depuis les paramètres de l'URL

    /* const { exercice, theme, group, id } = router.query; */
    console.log('needId', needId);
    console.log('groupId', groupId);
    const isEditMode = Boolean(groupId);

    // État pour stocker les données des sites, des départements et des groupes
    const {data: sitesData} = useSWR<SiteProps[]>(SITE_URLS.mutate, fetcher);
    const {data: departmentsData} = useSWR<DepartmentProps[]>(DEPARTMENT_URLS.mutate, fetcher);
    const [groupData, setGroupData] = React.useState<GroupData | null>(null);
    console.log('groupData', groupData);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    // Fonction pour mettre à jour groupData
    const handleGroupDataUpdated = (newGroupData: GroupData) => {
        setGroupData(newGroupData);
    };

    // Charger les données du groupe si on est en mode édition
    useEffect(() => {
        const fetchGroupData = async () => {
            if (!isEditMode) return;

            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(`${NEEDS_GROUP_URLS.getGroupToAddOrEdit}/${groupId}`, {
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch group data');
                }

                const data = await response.json();
                setGroupData(data);
            } catch (err) {
                setError('Error loading group data');
                console.error('Error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGroupData();
    }, [groupId, isEditMode]);

    const navigationItems = useMemo(() => [
        {
            id: "planning",
            name: "Planification",
            icon: <FiCalendar/>,
        },
        {
            id: "participants",
            name: "Participants",
            icon: <FiUsers/>,
        },
        {
            id: "suppliers",
            name: "Fournisseurs",
            icon: <Package/>,
        },
    ], []);

    const {state, setActiveTab, setActiveSubItem} = useNavigationState('planning', {
        availableTabs: ['planning', 'participants', 'suppliers'],
    });

    const renderContent = () => {
        if (isLoading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <ErrorMessage error={new Error(error)}/>;
        }
        try {
            switch (state.activeTab) {
                case 'planning':
                    return <Planning
                        needId={needId}
                        groupId={groupId}
                        siteData={sitesData}
                        departmentData={departmentsData}
                        groupData={groupData}
                        isEditMode={isEditMode}
                        onGroupDataUpdated={handleGroupDataUpdated}
                    />;
                case 'participants':
                    return <Participants
                        needId={needId}
                        groupData={groupData}
                        onGroupDataUpdated={handleGroupDataUpdated}
                    />;
                case 'suppliers':
                    return <Providers
                        needId={needId}
                        groupData={groupData}
                        onGroupDataUpdated={handleGroupDataUpdated}
                    />;
                default:
                    return null;
            }
        } catch (error) {
            console.error('Error rendering content:', error);
            return <ErrorMessage error={error as Error}/>;
        }
    };


    return (
        <div className="flex flex-col h-screen bg-backColor">
            {/* <BreadcrumbNav /> */}

            <div className="flex gap-4 py-4 flex-1">
                <ErrorBoundary FallbackComponent={ErrorMessage}>
                    <SecondaryNavbar
                        items={navigationItems}
                        activeTab={state.activeTab}
                        activeSubItem={state.activeSubItem}
                        onMainTabChange={setActiveTab}
                        onSubItemSelect={setActiveSubItem}
                    />

                    <main className="flex-1 bg-white rounded-lg p-8">
                        {renderContent()}
                    </main>
                </ErrorBoundary>
            </div>
        </div>
    )
}
export default AddGroup