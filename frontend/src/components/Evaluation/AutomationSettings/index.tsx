import React from 'react';

interface AutomationSettingsProps {
    time: string;
    onTimeChange: (value: string) => void;
    days: string;
    onDaysChange: (value: string) => void;
    timing: string;
    onTimingChange: (value: string) => void;
    eventType: string;
    onEventTypeChange: (value: string) => void;
}

const AutomationSettings = ({
    time,
    onTimeChange,
    days,
    onDaysChange,
    timing,
    onTimingChange,
    eventType,
    onEventTypeChange
}: AutomationSettingsProps) => {
    return (
        <div className="flex items-center space-x-4">
            <span>A</span>
            <input
                type="text"
                value={time}
                onChange={(e) => onTimeChange(e.target.value)}
                className="bg-gray-100 p-2 rounded w-20"
            />
            <span>Nombre de jours</span>
            <input
                type="text"
                value={days}
                onChange={(e) => onDaysChange(e.target.value)}
                className="bg-gray-100 p-2 rounded w-20"
            />
            <select
                value={timing}
                onChange={(e) => onTimingChange(e.target.value)}
                className="bg-gray-100 p-2 rounded"
            >
                <option value="before">Avant</option>
                <option value="after">Après</option>
            </select>
            <select
                value={eventType}
                onChange={(e) => onEventTypeChange(e.target.value)}
                className="bg-gray-100 p-2 rounded flex-grow"
            >
                <option value="session-start">La date de début de la session de formation</option>
            </select>
        </div>
    );
};

export default AutomationSettings;