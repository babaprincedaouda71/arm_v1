import SecondaryNavbar from '@/components/SecondaryNavbar'
import React, { useMemo } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorMessage from '@/components/ErrorBoundary/ErrorMessage';
import { useNavigationState } from '@/hooks/useNavigationState';
import Site from './generalInfos/site';
import Department from './generalInfos/department';
import Domain from './generalInfos/domain';
import Qualification from './generalInfos/qualififcation';
import Position from './generalInfos/position';
import Level from './generalInfos/level';
import Fees from './generalInfos/fees';
import StrategicAxes from './strategic-axes';
import Email from './email';
import Template from './template';
import SMSModule from './sms';
import Calendar from './calendar';
import Documents from './document';
import Notifications from './notification';
import GeneralInfos from './generalInfos';
import { User } from 'lucide-react';

const GeneralSettings = () => {
    const navigationItems = useMemo(() => [
        {
            id: "general-info",
            name: "Informations générales",

            subItems: [
                { id: "site", name: "Site" },
                { id: "department", name: "Département" },
                { id: "domain", name: "Domaine" },
                { id: "qualification", name: "Qualification" },
                { id: "position", name: "Poste" },
                { id: "level", name: "Niveau" },
                { id: "fees", name: "Frais" },
            ],
            icon: <User />
        },
        {
            id: "strategic-axes",
            name: "Axes stratégiques",
            icon: <User />
        },
        {
            id: "email",
            name: "Email",
            icon: <User />
        },
        {
            id: "template",
            name: "Template",
            icon: <User />
        },
        {
            id: "sms",
            name: "Module SMS",
        },
        {
            id: "notification",
            name: "Notification",
            icon: <User />
        },
        {
            id: "document",
            name: "Document",
            icon: <User />
        },
        {
            id: "calendar",
            name: "Calendrier",
            icon: <User />
        },
    ], []);

    const { state, setActiveTab, setActiveSubItem } = useNavigationState();

    const renderContent = () => {
        try {
            if (state.activeSubItem) {
                switch (`${state.activeSubItem}`) {
                    case 'site':
                        return <Site />;
                    case 'department':
                        return <Department />;
                    case 'domain':
                        return <Domain />;
                    case 'qualification':
                        return <Qualification />;
                    case 'position':
                        return <Position />;
                    case 'level':
                        return <Level />;
                    case 'fees':
                        return <Fees />;
                    default:
                        return null;
                }
            }

            switch (state.activeTab) {
                case 'general-info':
                    return <GeneralInfos />;
                case 'strategic-axes':
                    return <StrategicAxes />;
                case 'email':
                    return <Email />;
                case 'template':
                    return <Template />;
                case 'sms':
                    return <SMSModule />;
                case 'notification':
                    return <Notifications />;
                case 'document':
                    return <Documents />;
                case 'calendar':
                    return <Calendar />;
                default:
                    return null;
            }
        } catch (error) {
            console.error('Error rendering content:', error);
            return <ErrorMessage error={error as Error} />;
        }
    };

    return (
        <div className='flex flex-col h-screen bg-backColor'>
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

            Hello settings
        </div>
    )
}

export default GeneralSettings