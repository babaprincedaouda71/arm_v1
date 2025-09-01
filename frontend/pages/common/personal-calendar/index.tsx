// pages/common/personal-calendar/EvaluationListPage.ts
import React, {useMemo, useState} from 'react';
import {Calendar, Check, ChevronLeft, ChevronRight, Clock, MapPin, Users, X} from 'lucide-react';
import {useAuth} from '@/contexts/AuthContext';
import useSWR from 'swr';
import {fetcher} from '@/services/api';
import {TRAINING_INVITATION_URLS} from '@/config/urls';

interface UserInvitation {
    id: string;
    trainingTheme: string;
    dates?: string[];
    location?: string;
    city?: string;
    participantCount?: number;
    status: string;
    trainerName?: string;
    invitationDate: string;
    startTime?: string;
    endTime?: string;
}

const statusColors = {
    PENDING: {bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300'},
    ACCEPTED: {bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300'},
    DECLINED: {bg: 'bg-redShade-100', text: 'text-redShade-800', border: 'border-redShade-300'},

    'En attente': {bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300'},
    'Acceptée': {bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300'},
    'Refusée': {bg: 'bg-redShade-100', text: 'text-redShade-800', border: 'border-redShade-300'}
};

const statusLabels = {
    PENDING: 'En attente',
    ACCEPTED: 'Acceptée',
    DECLINED: 'Refusée',
};

const CalendarPage: React.FC = () => {
    const {user} = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedInvitation, setSelectedInvitation] = useState<UserInvitation | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Chargement des invitations avec optimisation pour grandes volumes
    const {data: invitationsData, mutate} = useSWR<UserInvitation[]>(
        user?.id ? `${TRAINING_INVITATION_URLS.getUserInvitations}/${user.id}` : null,
        fetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 60000, // Cache pendant 1 minute pour éviter trop de requêtes
        }
    );

    const invitations = useMemo(() => invitationsData || [], [invitationsData]);

    // Calcul des statistiques avec optimisation mémoire
    const invitationStats = useMemo(() => {
        const stats = {
            pending: 0,
            accepted: 0,
            declined: 0
        };

        invitations.forEach(invitation => {
            switch (invitation.status) {
                case 'En attente':
                case 'PENDING':
                    stats.pending++;
                    break;
                case 'Acceptée':
                case 'ACCEPTED':
                    stats.accepted++;
                    break;
                case 'Refusée':
                case 'DECLINED':
                    stats.declined++;
                    break;
            }
        });

        return stats;
    }, [invitations]);

    // Générer les jours du calendrier
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

        // Jours du mois suivant
        const remainingDays = 42 - days.length;
        for (let day = 1; day <= remainingDays; day++) {
            const date = new Date(year, month + 1, day);
            days.push({date, isCurrentMonth: false});
        }

        return days;
    };

    // Obtenir les formations pour une date avec optimisation
    const getTrainingsForDate = (date: Date) => {
        const dateString = date.toISOString().split('T')[0];
        return invitations.filter(invitation =>
            invitation.dates && invitation.dates.includes(dateString)
        );
    };

    const navigateMonth = (direction: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + direction);
            return newDate;
        });
    };

    // Nouvelle fonction pour revenir à aujourd'hui
    const goToToday = () => {
        setCurrentDate(new Date());
    };

    // Vérifier si on est déjà sur le mois actuel
    const isCurrentMonth = () => {
        const today = new Date();
        return currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear();
    };

    const handleInvitationAction = async (invitationId: string, action: 'accept' | 'decline') => {
        try {
            const response = await fetch(`${TRAINING_INVITATION_URLS.respondToInvitation}/${invitationId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action, userId: user?.id})
            });

            if (response.ok) {
                await mutate(); // Recharger les données
                closeModal();
            }
        } catch (error) {
            console.error('Erreur lors de la réponse à l\'invitation:', error);
        }
    };

    const openModal = (invitation: UserInvitation) => {
        setSelectedInvitation(invitation);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedInvitation(null);
        setIsModalOpen(false);
    };

    const calendarDays = generateCalendarDays();
    const today = new Date().toDateString();

    return (
        <div className="bg-white rounded-lg p-6">
            {/* En-tête */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Calendar className="w-6 h-6"/>
                    Calendrier des Formations
                </h1>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigateMonth(-1)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Mois précédent"
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
                        aria-label="Mois suivant"
                    >
                        <ChevronRight className="w-5 h-5"/>
                    </button>

                    {/* Bouton Aujourd'hui */}
                    {!isCurrentMonth() && (
                        <button
                            onClick={goToToday}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            aria-label="Aller à aujourd'hui"
                        >
                            Aujourd'hui
                        </button>
                    )}
                </div>
            </div>

            {/* Statistiques des invitations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="text-yellow-800 font-semibold">En attente</div>
                    <div className="text-2xl font-bold text-yellow-900">
                        {invitationStats.pending}
                    </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="text-green-800 font-semibold">Acceptées</div>
                    <div className="text-2xl font-bold text-green-900">
                        {invitationStats.accepted}
                    </div>
                </div>
                <div className="bg-redShade-50 p-4 rounded-lg border border-redShade-200">
                    <div className="text-redShade-800 font-semibold">Refusées</div>
                    <div className="text-2xl font-bold text-redShade-900">
                        {invitationStats.declined}
                    </div>
                </div>
            </div>

            {/* Légende */}
            <div className="flex gap-4 mb-4 text-sm">
                {Object.entries(statusLabels).map(([status, label]) => (
                    <div key={status} className="flex items-center gap-2">
                        <div
                            className={`w-3 h-3 rounded-full ${statusColors[status].bg} ${statusColors[status].border} border`}></div>
                        <span>{label}</span>
                    </div>
                ))}
            </div>

            {/* Grille calendrier */}
            <div className="grid grid-cols-7 gap-1">
                {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
                    <div key={day} className="p-3 text-center font-semibold text-gray-600 bg-gray-50">
                        {day}
                    </div>
                ))}

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
                                    const statusColor = statusColors[training.status] || statusColors.PENDING;
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
                                            {training.startTime && (
                                                <div className="flex items-center gap-1 mt-1">
                                                    <Clock className="w-3 h-3"/>
                                                    <span>{training.startTime}</span>
                                                </div>
                                            )}
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
                    ${statusColors[selectedInvitation.status]?.bg || statusColors.PENDING.bg} 
                    ${statusColors[selectedInvitation.status]?.text || statusColors.PENDING.text}
                    ${statusColors[selectedInvitation.status]?.border || statusColors.PENDING.border} border`}>
                                        {statusLabels[selectedInvitation.status] || selectedInvitation.status}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    {selectedInvitation.location && selectedInvitation.city && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-gray-500"/>
                                            <span>{selectedInvitation.location}, {selectedInvitation.city}</span>
                                        </div>
                                    )}

                                    {selectedInvitation.participantCount && (
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-gray-500"/>
                                            <span>{selectedInvitation.participantCount} participants</span>
                                        </div>
                                    )}

                                    {selectedInvitation.startTime && selectedInvitation.endTime && (
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-gray-500"/>
                                            <span>{selectedInvitation.startTime} - {selectedInvitation.endTime}</span>
                                        </div>
                                    )}
                                </div>

                                {selectedInvitation.trainerName && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Formateur
                                        </label>
                                        <p className="text-gray-900">{selectedInvitation.trainerName}</p>
                                    </div>
                                )}

                                {selectedInvitation.dates && selectedInvitation.dates.length > 0 && (
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
                                )}

                                {(selectedInvitation.status === 'En attente' || selectedInvitation.status === 'PENDING') && (
                                    <div className="flex gap-3 pt-4 border-t">
                                        <button
                                            onClick={() => handleInvitationAction(selectedInvitation.id, 'accept')}
                                            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Check className="w-4 h-4"/>
                                            Accepter
                                        </button>
                                        <button
                                            onClick={() => handleInvitationAction(selectedInvitation.id, 'decline')}
                                            className="flex-1 bg-redShade-600 text-white py-2 px-4 rounded-lg hover:bg-redShade-700 transition-colors flex items-center justify-center gap-2"
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

export default CalendarPage;