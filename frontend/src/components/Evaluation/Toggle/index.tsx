import React from "react";

interface ToggleProps {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    label: string;
}

const Toggle = ({ enabled, onChange, label }: ToggleProps) => {
    return (
        <div className="flex items-center justify-between">
            <span>{label}</span>
            <button
                onClick={() => onChange(!enabled)}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${enabled ? "bg-green-500" : "bg-gray-200"
                    }`}
            >
                <div
                    className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${enabled ? "translate-x-6" : ""
                        }`}
                />
            </button>
        </div>
    );
};

export default Toggle;
