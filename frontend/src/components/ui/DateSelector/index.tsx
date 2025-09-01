import React, { useState, useRef, useEffect } from 'react';
import { FiCalendar, FiChevronDown } from 'react-icons/fi';

interface DateSelectorProps {
    dates: string[];
    selectedDate: string | null;
    onDateChange: (date: string) => void;
    loading?: boolean;
}

const DateSelector: React.FC<DateSelectorProps> = ({
                                                       dates,
                                                       selectedDate,
                                                       onDateChange,
                                                       loading = false
                                                   }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fermer le dropdown quand on clique à l'extérieur
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fonction pour formater la date de manière lisible (format principal)
    const formatDateToReadable = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Fonction pour formater la date courte (format secondaire)
    const formatDateToShort = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR');
    };

    // Trier les dates par ordre chronologique
    const sortedDates = [...dates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    const handleDateSelect = (date: string) => {
        onDateChange(date);
        setIsOpen(false);
    };

    if (loading) {
        return (
            <div className="font-extrabold flex items-center">
                La liste de présence du{' '}
                <div className="ml-2 animate-pulse bg-gray-200 h-6 w-24 rounded"></div>
            </div>
        );
    }

    if (!dates.length) {
        return (
            <div className="font-extrabold">
                La liste de présence du{' '}
                <span className="text-gray-400">Aucune date disponible</span>
            </div>
        );
    }

    return (
        <div className="font-extrabold flex items-center flex-wrap">
            La liste de présence du{' '}
            <div className="relative ml-2" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors duration-200 bg-primary/5 hover:bg-primary/10 px-3 py-1 rounded-lg border border-primary/20 hover:border-primary/30"
                    disabled={!dates.length}
                >
                    <FiCalendar className="w-4 h-4" />
                    <span>
            {selectedDate
                ? formatDateToReadable(selectedDate)
                : 'Sélectionner une date'
            }
          </span>
                    <FiChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                        }`}
                    />
                </button>

                {isOpen && (
                    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[320px] max-h-64 overflow-y-auto">
                        <div className="p-2">
                            <div className="text-xs text-gray-500 px-3 py-2 border-b border-gray-100 font-normal">
                                Sélectionner une date
                            </div>
                            {sortedDates.length === 0 ? (
                                <div className="px-3 py-4 text-center text-gray-500 text-sm font-normal">
                                    Aucune date disponible
                                </div>
                            ) : (
                                sortedDates.map((date) => (
                                    <button
                                        key={date}
                                        onClick={() => handleDateSelect(date)}
                                        className={`w-full text-left px-3 py-2 rounded-md transition-colors duration-150 font-normal text-sm ${
                                            selectedDate === date
                                                ? 'bg-primary text-white'
                                                : 'hover:bg-gray-50 text-gray-700'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-medium">
                                                    {formatDateToReadable(date)}
                                                </div>
                                                <div className="text-xs opacity-75">
                                                    {formatDateToShort(date)}
                                                </div>
                                            </div>
                                            {selectedDate === date && (
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                            )}
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DateSelector;