import React, {useState} from 'react';
import {useScreenSize} from '@/hooks/useScreenSize';
import {useNavigation} from '@/hooks/useNavigation';
import NavigationItem from './NavigationItem';
import {FaChevronLeft, FaChevronRight} from 'react-icons/fa';
import {NAVIGATION_CONSTANTS} from '@/constants/navigation';
import {NavItem} from '@/types/dataTypes';

interface SecondaryNavbarProps {
    items: readonly NavItem[];
    activeTab: string;
    activeSubItem: string | null;
    onMainTabChange: (tabId: string) => void;
    onSubItemSelect: (mainTabId: string, subItemId: string) => void;
    className?: string;
}

const SecondaryNavbar: React.FC<SecondaryNavbarProps> = ({
                                                             items,
                                                             activeTab,
                                                             activeSubItem,
                                                             onMainTabChange,
                                                             onSubItemSelect,
                                                             className = ''
                                                         }) => {
    const isLargeScreen = useScreenSize();
    const {state: navState, toggleCollapse} = useNavigation(isLargeScreen);
    const {isCollapsed} = navState;
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

    const handleSubmenuToggle = (itemId: string) => {
        setOpenSubmenu(prev => prev === itemId ? null : itemId);
    };

    const handleMainTabChange = (tabId: string) => {
        if (activeTab !== tabId) {
            setOpenSubmenu(null);
        }
        onMainTabChange(tabId);
    };

    return (
        <div className={`pt-10 relative bg-white rounded-lg shadow-md ${className}`}>
            <nav
                className={`
                    transition-all duration-${NAVIGATION_CONSTANTS.ANIMATION_DURATION} ease-in-out
                    min-h-screen bg-white
                    ${isCollapsed ? "w-16" : "w-56"}
                    ${!isLargeScreen ? "fixed left-0 top-0 z-40" : "relative"}
                    ${!isLargeScreen && isCollapsed ? "-translate-x-full" : "translate-x-0"}
                `}
                role="navigation"
                aria-label="Navigation secondaire"
            >
                <div className="">
                    {items.map((item) => (
                        <NavigationItem
                            key={item.id}
                            item={item}
                            isCollapsed={isCollapsed}
                            isActive={activeTab === item.id}
                            activeSubItem={activeSubItem}
                            isSubmenuOpen={openSubmenu === item.id}
                            onItemClick={handleMainTabChange}
                            onSubItemClick={onSubItemSelect}
                            onSubmenuToggle={handleSubmenuToggle}
                        />
                    ))}
                </div>
            </nav>

            {!isLargeScreen && !isCollapsed && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={toggleCollapse}
                    aria-hidden="true"
                />
            )}

            {isLargeScreen ? (
                <button
                    onClick={toggleCollapse}
                    className="absolute -right-3 top-1/2 transform -translate-y-1/2
                        w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center
                        border border-gray-200 hover:bg-gray-50 z-40"
                    aria-label={isCollapsed ? "Développer le menu" : "Réduire le menu"}
                >
                    {isCollapsed ? (
                        <FaChevronRight size={12} aria-hidden="true"/>
                    ) : (
                        <FaChevronLeft size={12} aria-hidden="true"/>
                    )}
                </button>
            ) : (
                <button
                    onMouseEnter={toggleCollapse}
                    className={`fixed top-1/2 left-0 z-40 
                        bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd text-white shadow-lg 
                        flex items-center justify-center
                        transition-transform duration-300 rounded-full`}
                    style={{
                        width: NAVIGATION_CONSTANTS.MOBILE_BUTTON_SIZE.width,
                        height: NAVIGATION_CONSTANTS.MOBILE_BUTTON_SIZE.height
                    }}
                    aria-label={isCollapsed ? "Développer le menu" : "Réduire le menu"}
                >
                    {isCollapsed ? (
                        <FaChevronRight size={10} aria-hidden="true"/>
                    ) : (
                        <FaChevronLeft size={10} aria-hidden="true"/>
                    )}
                </button>
            )}
        </div>
    );
};

export default SecondaryNavbar;