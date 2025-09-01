import {Notification} from "@/@types/notification";
import useSWR from "swr";
import {NOTIFICATIONS_URLS} from "@/config/urls";
import {useAuth} from "@/contexts/AuthContext";

// Fetcher for SWR
const fetcher = async (url: string) => {
    const response = await fetch(url, {
        method: "GET",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        }
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données');
    }
    return response.json();
};

export const useNotifications = () => {
    const {user} = useAuth();
    const {data: notifications = [], mutate} = useSWR<Notification[]>(NOTIFICATIONS_URLS.fetchAll(user.id), fetcher);

    const markAsRead = async (id: number) => {
        try {
            // Envoyer une requête au backend pour marquer la notification comme lue
            const response = await fetch(NOTIFICATIONS_URLS.markAsRead(id), {
                method: "PUT",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour de la notification');
            }

            // Mettre à jour l'état local des notifications
            const updatedNotifications = notifications.map(notif =>
                notif.id === id ? {...notif, read: true} : notif
            );
            mutate(updatedNotifications, false); // `false` pour éviter une requête de revalidation immédiate
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            // Envoyer une requête au backend pour marquer toutes les notifications comme lues
            const response = await fetch(NOTIFICATIONS_URLS.markAllAsRead, {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour des notifications');
            }

            // Mettre à jour l'état local des notifications
            const updatedNotifications = notifications.map(notif => ({...notif, read: true}));
            mutate(updatedNotifications, false); // `false` pour éviter une requête de revalidation immédiate
        } catch (error) {
            console.error('Erreur:', error);
        }
    };


    const unreadCount = notifications.filter(notif => !notif.read).length;

    return {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead
    };
};