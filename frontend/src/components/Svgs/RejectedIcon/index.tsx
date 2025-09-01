import React from "react";

type Size = "xs" | "sm" | "md" | "lg";
type Color = "red" | "rose" | "pink"; // Couleurs Tailwind pour erreur/rejet

interface RejectedIconProps {
    iconSize?: Size;
    circleSize?: Size;
    iconColor?: Color;
    bgColor?: Color;
    strokeWidth?: number;
    className?: string;
}

const sizeClasses = {
    xs: {icon: "w-3 h-3", circle: "w-5 h-5"},
    sm: {icon: "w-4 h-4", circle: "w-6 h-6"},
    md: {icon: "w-5 h-5", circle: "w-8 h-8"},
    lg: {icon: "w-6 h-6", circle: "w-10 h-10"},
};

export const RejectedIcon: React.FC<RejectedIconProps> = ({
                                                              iconSize = "sm",
                                                              circleSize = "sm",
                                                              iconColor = "red",
                                                              bgColor = "red",
                                                              strokeWidth = 2,
                                                              className = "",
                                                          }) => {
    const bgColorClass = `bg-${bgColor}-100`;

    return (
        <div
            className={`${sizeClasses[circleSize].circle} rounded-full ${bgColorClass} flex items-center justify-center ${className}`}
            aria-label="Rejeté"
            role="img"
        >
            <svg
                className={`${sizeClasses[iconSize].icon} text-${iconColor}-500`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={strokeWidth}
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
        </div>
    );
};