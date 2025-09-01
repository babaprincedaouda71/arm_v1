import React, { forwardRef } from 'react';
import { GrNotification } from "react-icons/gr";

interface NotificationButtonProps {
    unreadCount: number;
    onClick: () => void;
}

const NotificationButton = forwardRef<HTMLDivElement, NotificationButtonProps>(
    ({ unreadCount, onClick }, ref) => {
        return (
            <div
                ref={ref}
                className="cursor-pointer relative"
                onClick={onClick}
            >
                <GrNotification className="text-xl cursor-pointer text-gray-700" />
                {unreadCount > 0 && (
                    <span
                        className="absolute -top-1 -right-1 bg-red text-white text-xs w-4 h-4 flex items-center justify-center rounded-full"
                    >
                        {unreadCount}
                    </span>
                )}
            </div>
        );
    }
);

NotificationButton.displayName = 'NotificationButton';

export default NotificationButton;