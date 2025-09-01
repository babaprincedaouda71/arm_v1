import React, { useState, useRef, useEffect } from 'react';

interface DatePickerProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
    className?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
                                                   value,
                                                   onChange,
                                                   placeholder = "Sélectionner une date",
                                                   error,
                                                   disabled = false,
                                                   className = ""
                                               }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fermer le calendrier quand on clique à l'extérieur
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Initialiser le mois courant basé sur la valeur
    useEffect(() => {
        if (value) {
            const selectedDate = new Date(value);
            if (!isNaN(selectedDate.getTime())) {
                setCurrentMonth(selectedDate);
            }
        }
    }, [value]);

    const formatDisplayDate = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatDateForInput = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);

        // Commencer par le lundi précédent
        const dayOfWeek = firstDay.getDay();
        const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        startDate.setDate(firstDay.getDate() - mondayOffset);

        const days = [];
        const currentDate = new Date(startDate);

        // Générer 42 jours (6 semaines)
        for (let i = 0; i < 42; i++) {
            days.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return { days, firstDay, lastDay };
    };

    const handleDateSelect = (date: Date) => {
        const formattedDate = formatDateForInput(date);
        onChange(formattedDate);
        setIsOpen(false);
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentMonth(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
            return newDate;
        });
    };

    const { days, firstDay, lastDay } = getDaysInMonth(currentMonth);
    const selectedDate = value ? new Date(value) : null;
    const today = new Date();

    const monthNames = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {/* Input Field */}
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`
                    w-full h-[48px] px-5 bg-inputBgColor rounded-md cursor-pointer
                    flex items-center justify-between outline-none border-[1px]
                    ${error ? 'border-redShade' : 'border-none'}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-80'}
                    transition-all duration-200
                `}
            >
                <span className={`${value ? 'text-formInputTextColor' : 'text-gray-400'}`}>
                    {value ? formatDisplayDate(value) : placeholder}
                </span>
                <svg
                    className={`w-5 h-5 text-formInputTextColor transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>

            {/* Error Message */}
            {error && (
                <p className="mt-1 text-sm text-redShade">
                    {error}
                </p>
            )}

            {/* Calendar Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-4 min-w-[280px]">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <button
                            type="button"
                            onClick={() => navigateMonth('prev')}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <h3 className="text-lg font-semibold text-formInputTextColor">
                            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </h3>

                        <button
                            type="button"
                            onClick={() => navigateMonth('next')}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Days of week */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {dayNames.map(day => (
                            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {days.map((day, index) => {
                            const isCurrentMonth = day >= firstDay && day <= lastDay;
                            const isToday = day.toDateString() === today.toDateString();
                            const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();

                            return (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => handleDateSelect(day)}
                                    className={`
                                        w-8 h-8 text-sm rounded-md transition-all duration-200
                                        ${!isCurrentMonth
                                        ? 'text-gray-300 hover:text-gray-400'
                                        : 'text-formInputTextColor hover:bg-violet-50'
                                    }
                                        ${isToday
                                        ? 'bg-violet-100 text-violet-600 font-semibold'
                                        : ''
                                    }
                                        ${isSelected
                                        ? 'bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd text-white font-semibold'
                                        : ''
                                    }
                                        hover:scale-110
                                    `}
                                >
                                    {day.getDate()}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DatePicker;