// Sidebar.tsx
import React from "react";
import {FaChevronDown} from "react-icons/fa";
import {
    FiBook,
    FiBox,
    FiCalendar,
    FiDatabase,
    FiFile,
    FiFileText,
    FiHelpCircle,
    FiMap,
    FiSettings,
    FiStar,
    FiTarget,
    FiUser,
    FiUsers,
} from "react-icons/fi";
import Image from "next/image";
import {useRouter} from "next/router";
import {useAuth, UserRole} from "@/contexts/AuthContext";
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";
import {BsFillEnvelopeFill} from "react-icons/bs";

interface SubMenuItem {
    name: string;
    path: string;
    allowedRoles?: UserRole[];
}

interface MenuItem {
    name: string;
    icon?: React.ReactNode;
    key: string;
    path?: string;
    defaultPath?: string;
    subMenu?: SubMenuItem[];
    allowedRoles?: UserRole[];
    isTitle?: boolean; // Nouveau champ pour identifier les titres de section
}

interface SidebarProps {
    collapsed: boolean;
}

// Configuration complète des menus avec les titres de section
const MENU_ITEMS: MenuItem[] = [
    {
        name: "Menu Principal",
        key: "mainMenuTitle",
        isTitle: true,
    },
    {
        name: "Tableau de bord",
        icon: <FiBox/>,
        key: "Dashboard",
        path: "/",
        allowedRoles: [UserRole.Admin, UserRole.User, UserRole.Collaborateur, UserRole.Formateur, UserRole.Manager],
    },
    {
        name: "Utilisateurs",
        icon: <FiUsers/>,
        key: "Users",
        allowedRoles: [UserRole.Admin],
        subMenu: [
            {name: "Tous", path: "/User"},
            {name: "Groupes", path: "/User/groups"},
        ],
    },
    {
        name: "Besoins",
        icon: <FiTarget/>,
        key: "Needs",
        defaultPath: "/Needs",
        allowedRoles: [UserRole.Admin],
        subMenu: [
            {name: "Axes stratégiques", path: "/Needs/strategic-axes"},
            {name: "Évaluation", path: "/Needs/evaluation"},
            {name: "Catalogue interne", path: "/Needs/internal-catalog"},
            {name: "Catalogue OCF", path: "/Needs/ocf-catalog"},
            {name: "Requêtes individuelles", path: "/Needs/individual-request"},
        ],
    },
    {
        name: "Plan",
        icon: <FiCalendar/>,
        key: "Plan",
        allowedRoles: [UserRole.Admin],
        subMenu: [
            {name: "Plan annuel", path: "/Plan/annual"},
            {name: "Remboursement", path: "/Plan/refund"},
            {name: "Rédacteur du CSF", path: "/Plan/csf-editor"},
        ],
    },
    {
        name: "Profile",
        icon: <FiUser/>,
        key: "ProfileComponent",
        path: "/profile",
        allowedRoles: [UserRole.User, UserRole.Manager, UserRole.Collaborateur, UserRole.Formateur],
    },
    {
        name: "Invitation",
        icon: <BsFillEnvelopeFill/>,
        key: "Invitation",
        path: "/invitations",
        allowedRoles: [UserRole.User, UserRole.Manager, UserRole.Collaborateur, UserRole.Formateur],
    },
    {
        name: "Invitation Équipe",
        icon: <BsFillEnvelopeFill/>,
        key: "Team Invitation",
        path: "/team-invitations",
        allowedRoles: [UserRole.Manager],
    },
    {
        name: "Calendrier",
        icon: <FiCalendar/>,
        key: "Calendar",
        path: "/calendar",
        allowedRoles: [UserRole.User, UserRole.Manager, UserRole.Collaborateur, UserRole.Formateur],
    },
    {
        name: "Évaluation",
        icon: <FiStar/>,
        key: "MyEvaluationsComponent",
        path: "/evaluation",
        allowedRoles: [UserRole.Admin, UserRole.User, UserRole.Manager, UserRole.Collaborateur, UserRole.Formateur],
    },
    {
        name: "Mes demandes",
        icon: <FiFile/>,
        key: "MyRequestsComponent",
        path: "/my-requests",
        allowedRoles: [UserRole.Collaborateur, UserRole.Manager],
    },
    {
        name: "Parcours",
        icon: <FiMap/>,
        key: "Path",
        path: "/path",
        allowedRoles: [UserRole.Collaborateur, UserRole.Manager],
    },
    {
        name: "Menu équipe",
        key: "teamMenuTitle",
        isTitle: true,
        allowedRoles: [UserRole.Manager], // Afficher le titre seulement pour les managers
    },
    {
        name: "Mon équipe",
        icon: <FiUsers/>,
        key: "MyTeam",
        path: "/my-team",
        allowedRoles: [UserRole.Manager],
    },
    {
        name: "Calendrier équipe",
        icon: <FiCalendar/>,
        key: "TeamCalendar",
        path: "/team-calendar",
        allowedRoles: [UserRole.Manager],
    },
    {
        name: "Demandes équipe",
        icon: <FiFileText/>,
        key: "TeamRequests",
        path: "/team-requests",
        allowedRoles: [UserRole.Manager],
    },
    {
        name: "Évaluation équipe",
        icon: <FiStar/>,
        key: "TeamEvaluation",
        path: "/team-evaluations",
        allowedRoles: [UserRole.Manager],
    },
    {
        name: "Catalogue",
        icon: <FiBook/>,
        key: "Catalog",
        allowedRoles: [UserRole.Admin],
        subMenu: [
            {name: "Interne", path: "/catalog/internal"},
            {name: "Externe", path: "/catalog/external"},
        ],
    },
    {
        name: "OCF",
        icon: <FiDatabase/>,
        key: "OCF",
        path: "/ocf",
        allowedRoles: [UserRole.Admin],
    },
    {
        name: "Rapports",
        icon: <FiFileText/>,
        key: "Reports",
        allowedRoles: [UserRole.Admin],
        subMenu: [
            {name: "Statistiques", path: "/Reports/statistics"},
            {name: "Activités", path: "/Reports/activities"},
            {name: "Performance", path: "/Reports/performance"},
        ],
    },
    {
        name: "Paramètres",
        icon: <FiSettings/>,
        key: "Settings",
        allowedRoles: [UserRole.Admin],
        subMenu: [
            {name: "Général", path: "/settings/general"},
            {name: "Notifications", path: "/Settings/notifications"},
            {name: "Sécurité", path: "/Settings/security"},
        ],
    },
    {
        name: "Support",
        icon: <FiHelpCircle/>,
        key: "Support",
        path: "/Support",
        allowedRoles: [UserRole.Admin, UserRole.Manager],
    },
];

const filterMenuItemsByRole = (menuItems: MenuItem[], userRole: UserRole): MenuItem[] => {
    return menuItems.filter((item) => {
        if (item.isTitle) {
            return !item.allowedRoles || item.allowedRoles.includes(userRole);
        }
        if (!item.allowedRoles) return true;
        return item.allowedRoles.includes(userRole);
    });
};

const Sidebar: React.FC<SidebarProps> = ({collapsed}) => {
    const router = useRouter();
    const [openMenuKey, setOpenMenuKey] = React.useState<string>("");
    const [hoveredSubMenu, setHoveredSubMenu] = React.useState<string | null>(null);

    const {user} = useAuth();
    const {navigateTo, isCurrentPath, getPathWithoutRolePrefix} = useRoleBasedNavigation();

    // Filtre les menus en fonction du rôle
    const filteredMenuItems = filterMenuItemsByRole(MENU_ITEMS, user.role as UserRole);

    const currentPath = getPathWithoutRolePrefix(router.asPath);

    const isMenuActive = (item: MenuItem): boolean => {
        if ((currentPath === '/' || currentPath === '') && (item.path === '/' || item.path === '')) {
            return true;
        }
        if (item.path && (currentPath === item.path || currentPath === item.path.substring(1))) return true;
        if (item.defaultPath && (currentPath === item.defaultPath || currentPath === item.defaultPath.substring(1))) return true;
        if (item.subMenu) {
            return item.subMenu.some((subItem) =>
                currentPath === subItem.path || currentPath === subItem.path.substring(1)
            );
        }
        return false;
    };

    const isSubMenuActive = (path: string): boolean => {
        return currentPath === path || currentPath === path.substring(1);
    };

    const handleMenuClick = (item: MenuItem) => {
        if (item.defaultPath) {
            navigateTo(item.defaultPath);
        } else if (item.path) {
            navigateTo(item.path);
            setOpenMenuKey("");
            return;
        }
        setOpenMenuKey(openMenuKey === item.key ? "" : item.key);
    };

    const handleSubMenuClick = (path: string) => {
        navigateTo(path);
    };

    return (
        <div
            className="h-full font-bold font-title flex flex-col bg-gradient-to-b from-gradientStart to-gradientEnd text-white dark:bg-gradient-to-b dark:from-[#FFFFFF] dark:to-[#E5E5E5] dark:text-primary">
            {/* Logo Section */}
            <div className="flex items-center justify-center py-6">
                <div
                    className={`${collapsed ? "w-10 h-10" : "w-[60%] h-auto"} bg-white rounded-lg flex duration-500 ease-in-out items-center justify-center`}>
                    <Image src="/images/logo.png" alt="Logo" width={collapsed ? 40 : 100} height={collapsed ? 40 : 100}
                           priority className="object-contain"/>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1">
                <ul className="space-y-2">
                    {filteredMenuItems.map((item) => {
                        if (item.isTitle) {
                            return (
                                <li key={item.key} className="px-6 py-2 text-sm font-medium text-gray-200 uppercase">
                                    {item.name}
                                </li>
                            );
                        }

                        const isActive = isMenuActive(item);
                        return (
                            <li key={item.key}
                                className={`relative ml-4 flex flex-col ${isActive ? "bg-backColor rounded-l-3xl text-black" : ""}`}>
                                <button
                                    onClick={() => handleMenuClick(item)}
                                    className={`flex items-center px-6 py-3 w-full text-left ${collapsed ? "justify-center" : ""} ${
                                        isActive ? "text-primary" : "hover:bg-white hover:bg-opacity-10 hover:rounded-l-3xl"
                                    }`}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    {!collapsed && (
                                        <div className="flex items-center justify-between w-full">
                                            <span className="ml-3">{item.name}</span>
                                            {item.subMenu && <FaChevronDown
                                                className={`ml-auto transition-transform duration-300 ease-in-out ${openMenuKey === item.key ? "rotate-180" : ""}`}/>}
                                        </div>
                                    )}
                                </button>

                                {item.subMenu && !collapsed && (
                                    <div
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${openMenuKey === item.key ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                                        <ul className="ml-[12%] pl-6 pb-2 text-sm font-medium">
                                            {item.subMenu.map((subItem) => {
                                                const isSubActive = isSubMenuActive(subItem.path);
                                                return (
                                                    <li
                                                        key={subItem.path}
                                                        onClick={() => handleSubMenuClick(subItem.path)}
                                                        className={`px-2 py-2 cursor-pointer transition-all duration-200 ease-in-out ${isSubActive
                                                            ? "text-primary font-bold"
                                                            : isActive
                                                                ? "hover:text-primary"
                                                                : "hover:bg-backColor hover:text-white hover:bg-opacity-10 hover:rounded-l-3xl"
                                                        }`}
                                                    >
                                                        {subItem.name}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;