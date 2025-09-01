import React, { forwardRef } from 'react';
import { Notification } from '@/@types/notification';
import NotificationItem from "@/components/Notification/NotificationItem";

interface NotificationMenuProps {
    notifications: Notification[];
    unreadCount: number;
    onMarkAsRead: (id: number) => void;
    onMarkAllAsRead: () => void;
}

const NotificationMenu = forwardRef<HTMLDivElement, NotificationMenuProps>(
    ({ notifications, unreadCount, onMarkAsRead, onMarkAllAsRead }, ref) => {
        return (
            <div
                ref={ref}
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 border border-gray-100 dark:border-gray-700 z-50"
            >
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-700 dark:text-white">Notifications</h3>
                    {unreadCount > 0 && (
                        <button
                            onClick={onMarkAllAsRead}
                            className="text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400"
                        >
                            Marquer tout comme lu
                        </button>
                    )}
                </div>

                <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onRead={onMarkAsRead}
                            />
                        ))
                    ) : (
                        <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                            Aucune notification
                        </div>
                    )}
                </div>

                {notifications.length > 0 && (
                    <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700 text-center">
                        <a href="#" className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400">
                            Voir toutes les notifications
                        </a>
                    </div>
                )}
            </div>
        );
    }
);

NotificationMenu.displayName = 'NotificationMenu';

export default NotificationMenu;