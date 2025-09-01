import React, {useEffect} from 'react';
import {Notification} from '@/@types/notification';
import {NOTIFICATIONS_URLS} from "@/config/urls";
import {Simulate} from "react-dom/test-utils";


interface NotificationItemProps {
    notification: Notification;
    onRead: (id: number) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({notification, onRead}) => {
    const handleClick = async () => {
        onRead(notification.id); // Marquer la notification comme lue
        await new Promise(resolve => setTimeout(resolve, 1000)); // Délai de 1 seconde
        if (notification.link) {
            window.location.href = notification.link; // Rediriger vers le lien
        }
    };

    // test notification en temps réel
    // const [notifications, setNotifications] = React.useState([])
    // useEffect(() => {
    //     const eventSource = new EventSource(NOTIFICATIONS_URLS.notifs)
    //
    //     eventSource.onmessage = (event) => {
    //         const notificationData = event.data;
    //         setNotifications(prevNotifications => [...prevNotifications, notificationData]);
    //     }
    //
    //     eventSource.onerror = (error) => {
    //         console.error('Sse error: ', error);
    //     }
    //
    //     return () => {
    //         eventSource.close()
    //     }
    // }, [])
    // fin test notification en temps réel

    return (
        <div
            className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                notification.read ? 'bg-white dark:bg-gray-800' : 'bg-blue-50 dark:bg-gray-700'
            }`}
            onClick={handleClick}
        >
            <div className="flex justify-between items-start">
                <h4 className="font-semibold text-sm text-gray-800 dark:text-white">
                    {notification.title}
                    {!notification.read && (
                        <span className="ml-2 w-2 h-2 inline-block bg-blue-500 rounded-full"></span>
                    )}
                </h4>
                <span className="text-xs text-gray-500 dark:text-gray-400">{notification.timeAgo}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{notification.message}</p>
            {/* Section notification en temps réel */}
            {/*<div>*/}
            {/*    <p>Notification en temps réel</p>*/}
            {/*    {notifications.map((notification, AnnualPlanPage) => (*/}
            {/*        <li key={AnnualPlanPage}>{notification}</li>*/}
            {/*    ))}*/}
            {/*</div>*/}
            {/* Fin Section notification en temps réel */}
        </div>
    );
};

export default NotificationItem;