import React, { useMemo } from 'react'
import BreadcrumbNav from '@/components/BreadcrumbNav'
import { useRouter } from 'next/router';
import { FiCalendar, FiUsers } from 'react-icons/fi';
import SecondaryNavbar from '@/components/SecondaryNavbar';
import Planning from './planning';
import Participants from './participants';
import { useNavigationState } from '@/hooks/useNavigationState';
import ErrorMessage from '@/components/ErrorBoundary/ErrorMessage';
import { ErrorBoundary } from 'react-error-boundary';
import Suppliers from './suppliers';
import Evaluation from './evaluation';
import Accounting from './accounting';
import { CalculatorIcon, Library, Package, StarsIcon } from 'lucide-react';
import Document from './library/document';
import Certificate from './library/certificate';
import Media from './library/media';
const index = () => {
    const router = useRouter();

    const { exercice, theme, group } = router.query;

    const navigationItems = useMemo(() => [
        {
            id: "planning",
            name: "Planification",
            icon: <FiCalendar />,
            // subItems: [
            //   { id: "daily", name: "Planning journalier" },
            //   { id: "weekly", name: "Planning hebdomadaire" }
            // ]
        },
        {
            id: "participants",
            name: "Participants",
            icon: <FiUsers />,
        },
        {
            id: "suppliers",
            name: "Fournisseurs",
            icon: <Package />,
        },
        {
            id: "evaluation",
            name: "Evaluation",
            // icon: <img src='/images/ranking.svg' />,
            icon: <StarsIcon />,
        },
        {
            id: "accounting",
            name: "Comptabilité",
            // icon: <img src='/images/calculator.svg' />,
            icon: <CalculatorIcon />,
        },
        {
            id: "library",
            name: "Bibliothèque",
            // icon: <img src='/images/archive.svg' />,
            icon: <Library />,
            subItems: [
                { id: "document", name: "DocumentPage" },
                { id: "certificate", name: "Certificat" },
                { id: "media", name: "Media" },
            ]
        },
    ], []);

    const { state, setActiveTab, setActiveSubItem } = useNavigationState();

    const renderContent = () => {
        try {
            if (state.activeSubItem) {
                switch (`${state.activeSubItem}`) {
                    case 'document':
                        return <Document />;
                    case 'certificate':
                        return <Certificate />;
                    case 'media':
                        return <Media />;
                    default:
                        return null;
                }
            }

            switch (state.activeTab) {
                case 'planning':
                    return <Planning />;
                case 'participants':
                    return <Participants />;
                case 'suppliers':
                    return <Suppliers />;
                case 'evaluation':
                    return <Evaluation />;
                case 'accounting':
                    return <Accounting />;
                default:
                    return null;
            }
        } catch (error) {
            console.error('Error rendering content:', error);
            return <ErrorMessage error={error as Error} />;
        }
    };


    return (
        <div className="flex flex-col h-screen bg-backColor">
            <BreadcrumbNav />

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

export default index