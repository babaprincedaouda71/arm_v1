export interface Notification {
    id: number;
    title: string;
    message: string;
    timeAgo: string;
    read: boolean;
    link?: string;
}