import React from "react";
import { NavItem } from "../../../types/dataTypes";

interface SubmenuProps {
    items: NavItem[];
    currentPath: string;
    onItemClick: (path: string) => void;
}

const Submenu = React.memo(({ items, currentPath, onItemClick }: SubmenuProps) => (
    <div className="ml-8 mb-2" role="menu">
        {items.map((item) => (
            <button
                key={item.path}
                onClick={() => onItemClick(item.path)}
                className={`
            w-full text-left p-2 rounded-md mb-1
            ${currentPath === item.path ? "bg-primary text-white" : "hover:bg-gray-100"}
        `}
                role="menuitem"
            >
                {item.name}
            </button>
        ))}
    </div>
));

export default Submenu;
Submenu.displayName = 'Submenu';