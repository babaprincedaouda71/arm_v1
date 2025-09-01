import React from 'react';
import {useRouter} from 'next/router';
import {ChevronRight, Home} from 'lucide-react';
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";

const BreadcrumbNav = () => {
    const {navigateTo} = useRoleBasedNavigation();
    const router = useRouter();
    const {theme, group} = router.query;

    // Déterminer la page active
    const pathSegments = router.asPath.split('/').filter(segment => segment);
    const currentPath = pathSegments[pathSegments.length - 1];

    const isActivePath = (path: string) => {
        return currentPath === path;
    };

    return (
        <nav className="flex items-center space-x-2 px-4 py-2 bg-white rounded-xl">
            <button
                onClick={() => navigateTo('/Plan/annual/exercice')}
                className={`text-gray-600 hover:text-gray-800 ${router.pathname === '/Plan/annual/exercice' ? 'text-primary font-medium' : ''
                }`}
            >
                <Home size={26}/>
            </button>

            {theme && (
                <>
                    <ChevronRight className="text-gray-400" size={26}/>
                    <button
                        onClick={() =>
                            navigateTo('/Plan/annual/exercice/theme', {
                                query: {theme}
                            })}
                        className={`text-gray-600 hover:text-gray-800 ${router.pathname === '/Plan/annual/exercice/theme' ? 'text-primary font-medium' : ''
                        }`}
                    >
                        {theme}
                    </button>
                </>
            )}

            {group && (
                <>
                    <ChevronRight className="text-gray-400" size={26}/>
                    <button
                        onClick={() =>
                            navigateTo('/Plan/annual/exercice/theme/group', {
                                query: {theme, group}
                            })}
                        className={`text-gray-600 hover:text-gray-800 ${router.pathname === '/Plan/annual/exercice/theme/group' ? 'text-primary font-medium' : ''
                        }`}
                    >
                        {group}
                    </button>
                </>
            )}
        </nav>
    );
};

export default BreadcrumbNav;