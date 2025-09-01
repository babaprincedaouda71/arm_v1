// src/components/FormComponents/CustomDatePicker/AddOCFPage.tsx
import React, { useState, useRef, useEffect } from 'react';

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
    >
        <path d="m6 9 6 6 6-6" />
    </svg>
);

const CalendarIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
        <line x1="16" x2="16" y1="2" y2="6"/>
        <line x1="8" x2="8" y1="2" y2="6"/>
        <line x1="3" x2="21" y1="10" y2="10"/>
    </svg>
);

interface CustomDatePickerProps {
    value: string;
    onChange: (date: string) => void;
    error?: string;
    className?: string;
    label?: string;
    labelClassName?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
                                                               value,
                                                               onChange,
                                                               error,
                                                               className = "",
                                                               label,
                                                               labelClassName
                                                           }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const dropdownRef = useRef<HTMLDivElement>(null);

    const months = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    const daysOfWeek = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Initialiser le mois courant basé sur la valeur sélectionnée
    useEffect(() => {
        if (value) {
            const selectedDate = new Date(value);
            setCurrentMonth(selectedDate);
        }
    }, [value]);

    const formatDate = (date: string) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDate = firstDay.getDay();

        const days = [];

        // Ajouter les jours du mois précédent
        for (let i = startDate - 1; i >= 0; i--) {
            const prevDate = new Date(year, month, -i);
            days.push({
                date: prevDate.getDate(),
                month: 'prev',
                fullDate: prevDate
            });
        }

        // Ajouter les jours du mois actuel
        for (let i = 1; i <= daysInMonth; i++) {
            const currentDate = new Date(year, month, i);
            days.push({
                date: i,
                month: 'current',
                fullDate: currentDate
            });
        }

        // Ajouter les jours du mois suivant pour compléter la grille
        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            const nextDate = new Date(year, month + 1, i);
            days.push({
                date: i,
                month: 'next',
                fullDate: nextDate
            });
        }

        return days;
    };

    const handleDateSelect = (fullDate: Date) => {
        const formatted = fullDate.toISOString().split('T')[0];
        onChange(formatted);
        setIsOpen(false);
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            if (direction === 'prev') {
                newMonth.setMonth(prev.getMonth() - 1);
            } else {
                newMonth.setMonth(prev.getMonth() + 1);
            }
            return newMonth;
        });
    };

    const isSelected = (fullDate: Date) => {
        if (!value) return false;
        const selectedDate = new Date(value);
        return fullDate.toDateString() === selectedDate.toDateString();
    };

    const isToday = (fullDate: Date) => {
        const today = new Date();
        return fullDate.toDateString() === today.toDateString();
    };

    const days = getDaysInMonth(currentMonth);

    return (
        <div className={`flex items-center text-formInputTextColor font-semibold text-xs md:text-sm lg:text-base w-full ${className}`}>
            {label && (
                <label className={`flex-[1] block break-words font-tHead ${labelClassName}`}>
                    {label}
                </label>
            )}
            <div className="flex-[4] relative" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`relative flex items-center justify-between w-full h-[48px] bg-inputBgColor rounded-md px-5 ${
                        error ? 'border border-red' : 'border-none'
                    } outline-none`}
                >
                    <div className="flex items-center gap-2 text-formInputTextColor">
                        <CalendarIcon />
                        <span className="font-tHead text-xs md:text-sm lg:text-base">
                            {value ? formatDate(value) : 'Sélectionner une date...'}
                        </span>
                    </div>
                    <ChevronIcon isOpen={isOpen} />
                </button>

                {isOpen && (
                    <div className="absolute z-50 w-80 mt-1 bg-white rounded-md shadow-lg border border-gray-100 overflow-hidden">
                        {/* En-tête du calendrier */}
                        <div className="flex items-center justify-between p-4 bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd text-white">
                            <button
                                type="button"
                                onClick={() => navigateMonth('prev')}
                                className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="m15 18-6-6 6-6"/>
                                </svg>
                            </button>
                            <h3 className="text-lg font-semibold font-tHead">
                                {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                            </h3>
                            <button
                                type="button"
                                onClick={() => navigateMonth('next')}
                                className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="m9 18 6-6-6-6"/>
                                </svg>
                            </button>
                        </div>

                        {/* Jours de la semaine */}
                        <div className="grid grid-cols-7 bg-gray-50">
                            {daysOfWeek.map(day => (
                                <div key={day} className="p-2 text-center text-sm font-medium text-formInputTextColor font-tHead">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Grille des jours */}
                        <div className="grid grid-cols-7 p-2">
                            {days.map((day, index) => {
                                const isCurrentMonth = day.month === 'current';
                                const selected = isSelected(day.fullDate);
                                const today = isToday(day.fullDate);

                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => handleDateSelect(day.fullDate)}
                                        className={`
                                            p-2 text-sm rounded-md m-0.5 transition-colors font-tHead
                                            ${!isCurrentMonth
                                            ? 'text-gray-300 hover:bg-gray-100'
                                            : 'text-formInputTextColor hover:bg-primary hover:bg-opacity-5'
                                        }
                                            ${selected
                                            ? 'bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd text-white hover:opacity-90'
                                            : ''
                                        }
                                            ${today && !selected
                                            ? 'bg-primary bg-opacity-10 text-primary font-semibold'
                                            : ''
                                        }
                                        `}
                                    >
                                        {day.date}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Bouton Aujourd'hui */}
                        <div className="p-3 border-t border-gray-200 bg-gray-50">
                            <button
                                type="button"
                                onClick={() => handleDateSelect(new Date())}
                                className="w-full py-2 px-4 text-sm bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd text-white rounded-md hover:opacity-90 transition-opacity font-tHead"
                            >
                                Aujourd'hui
                            </button>
                        </div>
                    </div>
                )}

                {error && (
                    <p className="text-right mt-1 text-sm text-red">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
};

export default CustomDatePicker;