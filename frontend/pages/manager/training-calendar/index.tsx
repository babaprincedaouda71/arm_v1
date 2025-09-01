import React, {useState} from 'react';
import {Calendar, Check, ChevronLeft, ChevronRight, Clock, MapPin, Users, X} from 'lucide-react';

// Mock data pour l'exemple - remplacez par vos vraies données d'invitations
const mockInvitations = [
    {
        id: '1',
        trainingTheme: 'Formation React Avancé',
        dates: ['2025-06-18', '2025-06-19'],
        location: 'Salle A',
        city: 'Casablanca',
        participantCount: 15,
        status: 'PENDING',
        trainerName: 'Ahmed Benali',
        invitationDate: '2025-06-10',
        startTime: '09:00',
        endTime: '17:00'
    },
    {
        id: '2',
        trainingTheme: 'Formation Docker',
        dates: ['2025-06-20'],
        location: 'Salle B',
        city: 'Rabat',
        participantCount: 12,
        status: 'ACCEPTED',
        trainerName: 'Fatima Alami',
        invitationDate: '2025-06-12',
        startTime: '10:00',
        endTime: '16:00'
    },
    {
        id: '3',
        trainingTheme: 'Formation TypeScript',
        dates: ['2025-06-25', '2025-06-26', '2025-06-27'],
        location: 'Centre de formation',
        city: 'Casablanca',
        participantCount: 8,
        status: 'PENDING',
        trainerName: 'Youssef Tahiri',
        invitationDate: '2025-06-15',
        startTime: '09:30',
        endTime: '17:30'
    }
];

const statusColors = {
    PENDING: {bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300'},
    ACCEPTED: {bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300'},
    DECLINED: {bg: 'bg-red', text: 'text-red-800', border: 'border-red-300'}
};

const statusLabels = {
    PENDING: 'En attente',
    ACCEPTED: 'Acceptée',
    DECLINED: 'Refusée'
};

const TrainingCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedInvitation, setSelectedInvitation] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Générer les jours du mois
    const generateCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const firstDayOfWeek = firstDayOfMonth.getDay();

        const days = [];

        // Jours du mois précédent
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            const date = new Date(year, month, -i);
            days.push({date, isCurrentMonth: false});
        }

        // Jours du mois actuel
        for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
            const date = new Date(year, month, day);
            days.push({date, isCurrentMonth: true});
        }

        // Jours du mois suivant pour compléter la grille
        const remainingDays = 42 - days.length;
        for (let day = 1; day <= remainingDays; day++) {
            const date = new Date(year, month + 1, day);
            days.push({date, isCurrentMonth: false});
        }

        return days;
    };

    // Obtenir les formations pour une date donnée
    const getTrainingsForDate = (date) => {
        const dateString = date.toISOString().split('T')[0];
        return mockInvitations.filter(invitation =>
            invitation.dates.includes(dateString)
        );
    };

    const navigateMonth = (direction) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + direction);
            return newDate;
        });
    };

    const calendarDays = generateCalendarDays();
    const today = new Date().toDateString();

    const handleInvitationAction = async (invitationId, action) => {
        // Ici vous pouvez implémenter la logique pour accepter/refuser l'invitation
        console.log(`${action} invitation ${invitationId}`);
        // Exemple d'appel API:
        // await fetch(`${TRAINING_INVITATION_URLS.respondToInvitation}/${invitationId}`, {
        //   method: 'PUT',
        //   credentials: 'include',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ action, userId: user?.id })
        // });
    };

    const openModal = (invitation) => {
        setSelectedInvitation(invitation);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedInvitation(null);
        setIsModalOpen(false);
    };

    return (
        <div className="bg-white rounded-lg p-6">
            {/* En-tête du calendrier */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Calendar className="w-6 h-6"/>
                    Calendrier des Formations
                </h1>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigateMonth(-1)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5"/>
                    </button>

                    <h2 className="text-xl font-semibold min-w-[200px] text-center">
                        {currentDate.toLocaleDateString('fr-FR', {
                            month: 'long',
                            year: 'numeric'
                        })}
                    </h2>

                    <button
                        onClick={() => navigateMonth(1)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ChevronRight className="w-5 h-5"/>
                    </button>
                </div>
            </div>

            {/* Légende des statuts */}
            <div className="flex gap-4 mb-4 text-sm">
                {Object.entries(statusLabels).map(([status, label]) => (
                    <div key={status} className="flex items-center gap-2">
                        <div
                            className={`w-3 h-3 rounded-full ${statusColors[status].bg} ${statusColors[status].border} border`}></div>
                        <span>{label}</span>
                    </div>
                ))}
            </div>

            {/* Grille du calendrier */}
            <div className="grid grid-cols-7 gap-1">
                {/* En-têtes des jours */}
                {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
                    <div key={day} className="p-3 text-center font-semibold text-gray-600 bg-gray-50">
                        {day}
                    </div>
                ))}

                {/* Jours du calendrier */}
                {calendarDays.map((day, index) => {
                    const trainings = getTrainingsForDate(day.date);
                    const isToday = day.date.toDateString() === today;

                    return (
                        <div
                            key={index}
                            className={`min-h-[120px] p-2 border border-gray-200 ${
                                day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                            } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
                        >
                            <div className={`text-sm font-medium mb-2 ${
                                day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                            } ${isToday ? 'text-blue-600' : ''}`}>
                                {day.date.getDate()}
                            </div>

                            <div className="space-y-1">
                                {trainings.map(training => {
                                    const statusColor = statusColors[training.status];
                                    return (
                                        <div
                                            key={training.id}
                                            onClick={() => openModal(training)}
                                            className={`p-1 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity
                        ${statusColor.bg} ${statusColor.text} ${statusColor.border} border`}
                                        >
                                            <div className="font-medium truncate">
                                                {training.trainingTheme}
                                            </div>
                                            <div className="flex items-center gap-1 mt-1">
                                                <Clock className="w-3 h-3"/>
                                                <span>{training.startTime}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal de détails */}
            {isModalOpen && selectedInvitation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Détails de la formation
                                </h3>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-5 h-5"/>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">
                                        {selectedInvitation.trainingTheme}
                                    </h4>
                                    <div className={`inline-block px-2 py-1 rounded text-xs font-medium
                    ${statusColors[selectedInvitation.status].bg} 
                    ${statusColors[selectedInvitation.status].text}
                    ${statusColors[selectedInvitation.status].border} border`}>
                                        {statusLabels[selectedInvitation.status]}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-500"/>
                                        <span>{selectedInvitation.location}, {selectedInvitation.city}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-gray-500"/>
                                        <span>{selectedInvitation.participantCount} participants</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-gray-500"/>
                                        <span>{selectedInvitation.startTime} - {selectedInvitation.endTime}</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Formateur
                                    </label>
                                    <p className="text-gray-900">{selectedInvitation.trainerName}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Dates de formation
                                    </label>
                                    <p className="text-gray-900">
                                        {selectedInvitation.dates.map(date =>
                                            new Date(date).toLocaleDateString('fr-FR')
                                        ).join(', ')}
                                    </p>
                                </div>

                                {selectedInvitation.status === 'PENDING' && (
                                    <div className="flex gap-3 pt-4 border-t">
                                        <button
                                            onClick={() => {
                                                handleInvitationAction(selectedInvitation.id, 'accept');
                                                closeModal();
                                            }}
                                            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Check className="w-4 h-4"/>
                                            Accepter
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleInvitationAction(selectedInvitation.id, 'decline');
                                                closeModal();
                                            }}
                                            className="flex-1 bg-red text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <X className="w-4 h-4"/>
                                            Refuser
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrainingCalendar;