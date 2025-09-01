import {NavItem} from '@/types/dataTypes';
import React from 'react';
import {FaChevronRight} from 'react-icons/fa';

interface NavigationItemProps {
    item: NavItem;
    isCollapsed: boolean;
    isActive: boolean;
    activeSubItem: string | null;
    isSubmenuOpen: boolean;
    onItemClick: (itemId: string) => void;
    onSubItemClick: (itemId: string, subItemId: string) => void;
    onSubmenuToggle: (itemId: string) => void;
    className?: string;
}

const NavigationItem = React.memo<NavigationItemProps>(({
                                                            item,
                                                            isCollapsed,
                                                            isActive,
                                                            activeSubItem,
                                                            isSubmenuOpen,
                                                            onItemClick,
                                                            onSubItemClick,
                                                            onSubmenuToggle,
                                                            className = '',
                                                        }) => {
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            if (item.subItems) {
                onSubmenuToggle(item.id);
            } else {
                onItemClick(item.id);
            }
        }
    };

    const isActiveWithSubItems = isActive && item.subItems;

    const baseButtonStyles = `
        w-full relative flex items-center p-3 rounded-lg mb-2 transition-colors duration-200
        ${isActive ? "text-white" : "text-tBodyTextColor"}
        ${isActive && !isActiveWithSubItems ? "bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd" : ""}
        ${className}
    `;

    return (
        <div role="none" className={`relative ${isActiveWithSubItems
            ? "bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd text-white rounded-lg mb-2"
            : "text-tBodyTextColor"
        }`}>
            <button
                onClick={() => item.subItems ? onSubmenuToggle(item.id) : onItemClick(item.id)}
                className={`${baseButtonStyles} ${isActiveWithSubItems
                    ? "hover:bg-transparent"
                    : "hover:bg-gray-100"
                }`}
                aria-expanded={isSubmenuOpen}
                aria-haspopup={Boolean(item.subItems)}
                aria-label={isCollapsed ? item.name : undefined}
                role="menuitem"
                tabIndex={0}
                onKeyDown={handleKeyDown}
            >
                <div className={`
                    flex items-center
                    ${isCollapsed ? "justify-center w-full" : "w-full pl-4"}
                `}>
                    <span className="text-xl" aria-hidden="true">{item.icon}</span>
                    {!isCollapsed && <span className="ml-3">{item.name}</span>}
                    {!isCollapsed && item.subItems && (
                        <FaChevronRight
                            className={`ml-auto transform transition-transform duration-300 
                            ${isSubmenuOpen ? "rotate-90" : ""}`}
                            aria-hidden="true"
                        />
                    )}
                </div>
            </button>
            {!isCollapsed && isSubmenuOpen && item.subItems && (
                <div
                    className="pl-16 pr-4 mb-2"
                    role="menu"
                    aria-label={`Sous-menu de ${item.name}`}
                >
                    {item.subItems.map((subItem) => (
                        <button
                            key={subItem.id}
                            onClick={() => onSubItemClick(item.id, subItem.id)}
                            className={`
                                w-full p-2 rounded-md mb-1 transition-colors duration-200
                                ${activeSubItem === subItem.id
                                ? "bg-white text-primary"
                                : isActive
                                    ? "text-white hover:bg-white/10"
                                    : "hover:bg-gray-100"
                            }
                            `}
                            role="menuitem"
                            tabIndex={0}
                        >
                            <div className="flex items-center pl-2">
                                {subItem.icon && <span className="mr-2">{subItem.icon}</span>}
                                <span>{subItem.name}</span>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
});

NavigationItem.displayName = 'NavigationItem';
export default NavigationItem;