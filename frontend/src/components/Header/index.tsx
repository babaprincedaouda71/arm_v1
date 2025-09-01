import React, {useRef} from "react";
import {AiOutlineMessage} from "react-icons/ai";
import {CiSearch} from "react-icons/ci";
import {IoIosArrowDown} from "react-icons/io";
import ThemeToggle from "../ThemeToggle";
import {FaEnvelope} from "react-icons/fa";
import {LogOut, Menu, Settings, User} from "lucide-react";
import {useAuth} from "@/contexts/AuthContext";
import {useNotifications} from "@/hooks/useNotifications";
import {useToggle} from "@/hooks/useToggle";
import {useOutsideClick} from "@/hooks/useOutsideClick";
import NotificationButton from "@/components/Notification/NotificationButton";
import NotificationMenu from "@/components/Notification/NotificationMenu";
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";

interface HeaderProps {
    onMenuClick: () => void;
}

const Header = ({onMenuClick}: HeaderProps) => {
    const {user, logout} = useAuth();
    const {navigateTo} = useRoleBasedNavigation();

    // État et refs pour les notifications
    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead
    } = useNotifications();

    const [isNotificationOpen, toggleNotification, , closeNotification] = useToggle(false);
    const notificationRef = useRef<HTMLDivElement>(null);
    const notificationButtonRef = useRef<HTMLDivElement>(null);

    // État et refs pour le menu du profil
    const [isDropdownOpen, toggleDropdown, , closeDropdown] = useToggle(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const profileButtonRef = useRef<HTMLDivElement>(null);

    // Gestion des clics à l'extérieur
    useOutsideClick([dropdownRef, profileButtonRef], closeDropdown);
    useOutsideClick([notificationRef, notificationButtonRef], closeNotification);

    const handleProfileClick = () => {
        navigateTo('/User/user-profile');
    };

    return (
        <header className="sticky top-0 z-20 bg-white border rounded-xl mb-2 md:mb-[25px]">
            <div className="px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Menu onClick={onMenuClick} className="lg-custom:hidden cursor-pointer text-gray-700 text-3xl"/>
                        <h1 className="hidden lg-custom:block text-xl font-tHead text-gray-700 cursor-pointer">
                            Tableau de bord
                        </h1>

                        <div className="relative max-w-md w-full hidden sm:block">
                            <CiSearch
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                            <input
                                type="text"
                                placeholder={"Rechercher..."}
                                className="w-full pl-10 pr-4 py-2 font-tHead text-[#B1B2B5] rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 sm:space-x-4">
                        <ThemeToggle/>
                        <FaEnvelope className="text-xl hidden sm:block cursor-pointer text-gray-700"/>
                        <AiOutlineMessage className="text-xl hidden sm:block cursor-pointer text-gray-700"/>

                        {/* Système de notifications */}
                        <div className="relative hidden sm:block">
                            <NotificationButton
                                ref={notificationButtonRef}
                                unreadCount={unreadCount}
                                onClick={toggleNotification}
                            />

                            {isNotificationOpen && (
                                <NotificationMenu
                                    ref={notificationRef}
                                    notifications={notifications}
                                    unreadCount={unreadCount}
                                    onMarkAsRead={markAsRead}
                                    onMarkAllAsRead={markAllAsRead}
                                />
                            )}
                        </div>

                        {/* Menu profil */}
                        <div
                            ref={profileButtonRef}
                            className="flex items-center space-x-2 cursor-pointer relative"
                            onClick={toggleDropdown}
                        >
                            <img
                                src="/images/profile.png"
                                alt="ProfileComponent"
                                className="w-8 h-8 rounded-full bg-primary"
                            />
                            <div className="font-title hidden sm:block">
                                <p className="font-semibold text-black">{user ? user.firstName + ' ' + user.lastName : 'user'}</p>
                                <p className="text-sm text-gray-500">{user ? user.role : 'role'}</p>
                            </div>
                            <IoIosArrowDown
                                className={`hidden sm:block text-lg ml-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}/>

                            {isDropdownOpen && (
                                <div
                                    ref={dropdownRef}
                                    className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 border border-gray-100 dark:border-gray-700 z-50 transition-all duration-200 ease-in-out"
                                >
                                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 sm:hidden">
                                        <p className="font-semibold text-black dark:text-white">{user ? user.firstName + ' ' + user.lastName : 'user'}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{user ? user.role : 'role'}</p>
                                    </div>
                                    <a
                                        onClick={handleProfileClick}
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                    >
                                        <User className="w-4 h-4 mr-2"/>
                                        Mon profil
                                    </a>
                                    <a
                                        href="#"
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        <Settings className="w-4 h-4 mr-2"/>
                                        Paramètres
                                    </a>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent event bubbling
                                            logout();
                                        }}
                                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        <LogOut className="w-4 h-4 mr-2"/>
                                        Déconnexion
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;