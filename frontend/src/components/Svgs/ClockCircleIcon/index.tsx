import React from "react";

type Size = "xs" | "sm" | "md" | "lg"; // Tailles prédéfinies compatibles avec Tailwind
type Color = "amber" | "yellow" | "orange"; // Couleurs Tailwind étendables

interface ClockCircleIconProps {
    iconSize?: Size;
    circleSize?: Size;
    iconColor?: Color;
    bgColor?: Color;
    className?: string;
}

const sizeClasses = {
    xs: {icon: "w-3 h-3", circle: "w-5 h-5"},
    sm: {icon: "w-4 h-4", circle: "w-6 h-6"},
    md: {icon: "w-5 h-5", circle: "w-8 h-8"},
    lg: {icon: "w-6 h-6", circle: "w-10 h-10"},
};

export const ClockCircleIcon: React.FC<ClockCircleIconProps> = ({
                                                                    iconSize = "sm",
                                                                    circleSize = "sm",
                                                                    iconColor = "amber",
                                                                    bgColor = "amber",
                                                                    className = "",
                                                                }) => {
    const bgColorClass = `bg-${bgColor}-100`;

    return (
        <div
            className={`${sizeClasses[circleSize].circle} rounded-full ${bgColorClass} flex items-center justify-center m-2 ${className}`}
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
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
        </div>
    );
};