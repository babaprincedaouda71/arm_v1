// ====================
// PAGE : pages/public/attendance/scan/[token].tsx - VERSION MOBILE/TABLETTE OPTIMISÉE
// ====================

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {AlertCircle, Calendar, Check, Clock, MapPin, Users, X, ChevronDown, ChevronUp, CheckCircle, XCircle} from 'lucide-react';
import {ATTENDANCE_URLS} from "@/config/urls";

// Interfaces
interface AttendanceRecord {
    recordId: string;
    userId: number;
    userFullName: string;
    userCode: string;
    userEmail: string;
    status: string; // "PRESENT" ou "ABSENT"
    statusDescription: string; // "présent" ou "absent"
    markedDate: string | null;
    canEdit: boolean;
}

interface AttendanceList {
    qrCodeToken: string;
    attendanceDate: string;
    groupName: string;
    trainingTheme: string;
    listType: string;
    listTypeDescription: string;
    totalParticipants: number;
    presentCount: number;
    absentCount: number;
    attendanceRecords: AttendanceRecord[];
    groupInfo: {
        groupId: number;
        groupName: string;
        trainingTheme: string;
        location: string;
        city: string;
        formationDates: string[];
        trainerName: string;
        trainingType: string;
    };
}

interface QRScanResponse {
    valid: boolean;
    message: string;
    attendanceList?: AttendanceList;
    errorCode?: string;
}

export default function AttendanceMarkingPage() {
    const router = useRouter();
    const {token} = router.query;

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [attendanceList, setAttendanceList] = useState<AttendanceList | null>(null);
    const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);
    const [expandedDetails, setExpandedDetails] = useState(false);
    const [markingUserId, setMarkingUserId] = useState<number | null>(null);

    // Fonction pour scanner le QR code et récupérer les données
    const scanQRCode = async (qrToken: string) => {
        try {
            const response = await fetch(`${ATTENDANCE_URLS.scan}/${qrToken}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la validation du QR code');
            }

            const data: QRScanResponse = await response.json();

            if (!data.valid) {
                setError(data.message || 'QR code invalide');
                return;
            }

            if (data.attendanceList) {
                setAttendanceList(data.attendanceList);
            }
        } catch (err) {
            console.error('Erreur scan QR:', err);
            setError('Erreur lors de la validation du QR code');
        } finally {
            setIsLoading(false);
        }
    };

    // Fonction pour marquer la présence/absence
    const markAttendance = async (userId: number, status: 'PRESENT' | 'ABSENT') => {
        if (!attendanceList || isMarkingAttendance) return;

        setIsMarkingAttendance(true);
        setMarkingUserId(userId);

        try {
            const response = await fetch(`${ATTENDANCE_URLS.markAttendance}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    qrCodeToken: attendanceList.qrCodeToken,
                    userId: userId,
                    status: status,
                    markedBy: null
                })
            });

            if (!response.ok) {
                throw new Error('Erreur lors du marquage');
            }

            const result = await response.json();

            if (result.success) {
                // Mettre à jour l'état local
                setAttendanceList(prev => {
                    if (!prev) return null;

                    const updatedRecords = prev.attendanceRecords.map(record => {
                        if (record.userId === userId) {
                            return {
                                ...record,
                                status: status,
                                statusDescription: status === 'PRESENT' ? 'présent' : 'absent',
                                markedDate: new Date().toISOString()
                            };
                        }
                        return record;
                    });

                    // Recalculer les compteurs
                    const presentCount = updatedRecords.filter(r => r.status === 'PRESENT').length;
                    const absentCount = updatedRecords.filter(r => r.status === 'ABSENT').length;

                    return {
                        ...prev,
                        attendanceRecords: updatedRecords,
                        presentCount,
                        absentCount
                    };
                });

                // Feedback haptique sur mobile
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }
            }
        } catch (err) {
            console.error('Erreur marquage:', err);
            alert('Erreur lors du marquage de la présence');
        } finally {
            setIsMarkingAttendance(false);
            setMarkingUserId(null);
        }
    };

    // Actions rapides pour marquer tous présents/absents
    const markAllPresent = () => {
        if (!attendanceList || isMarkingAttendance) return;
        if (confirm('Marquer tous les participants comme présents ?')) {
            attendanceList.attendanceRecords.forEach(participant => {
                if (participant.canEdit && participant.status !== 'PRESENT') {
                    markAttendance(participant.userId, 'PRESENT');
                }
            });
        }
    };

    const markAllAbsent = () => {
        if (!attendanceList || isMarkingAttendance) return;
        if (confirm('Marquer tous les participants comme absents ?')) {
            attendanceList.attendanceRecords.forEach(participant => {
                if (participant.canEdit && participant.status !== 'ABSENT') {
                    markAttendance(participant.userId, 'ABSENT');
                }
            });
        }
    };

    // Effet pour scanner le QR code au chargement
    useEffect(() => {
        if (token && typeof token === 'string') {
            scanQRCode(token);
        }
    }, [token]);

    // Rendu conditionnel selon l'état
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-base sm:text-lg">Validation du QR code...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 max-w-md w-full">
                    <div className="text-center">
                        <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-redShade-500 mx-auto mb-4"/>
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Accès non autorisé</h2>
                        <p className="text-gray-600 mb-6 text-sm sm:text-base">{error}</p>
                        <button
                            onClick={() => router.back()}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto text-base font-medium"
                        >
                            Retour
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!attendanceList) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center">
                    <p className="text-gray-600">Aucune donnée trouvée</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header compact - Sticky pour garder le contexte */}
            <div className="bg-white shadow-sm border-b sticky top-0 z-20 flex-shrink-0">
                <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3">
                        <Users className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-blue-600 flex-shrink-0"/>
                        <h1 className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900 leading-tight truncate">
                            Marquage de présence
                        </h1>
                    </div>

                    {/* Informations essentielles - Ultra compact sur mobile */}
                    <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm lg:text-base">
                        <div className="flex items-start gap-2">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 mt-0.5 flex-shrink-0"/>
                            <div className="min-w-0 flex-1">
                                <span className="font-medium text-gray-900 block truncate">{attendanceList.trainingTheme}</span>
                                <span className="text-gray-600 text-xs sm:text-sm truncate block">{attendanceList.groupName}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0"/>
                            <span className="text-gray-600 truncate">
                                {new Date(attendanceList.attendanceDate).toLocaleDateString('fr-FR', {
                                    weekday: 'short',
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>

                    {/* Résumé des présences - Très compact */}
                    <div className="mt-3 grid grid-cols-3 gap-1 sm:gap-2">
                        <div className="bg-green-50 border border-green-200 text-green-800 px-1 sm:px-2 py-1 sm:py-2 rounded text-center">
                            <div className="text-sm sm:text-lg font-bold">{attendanceList.presentCount}</div>
                            <div className="text-xs font-medium">Présents</div>
                        </div>
                        <div className="bg-redShade-50 border border-redShade-200 text-redShade-800 px-1 sm:px-2 py-1 sm:py-2 rounded text-center">
                            <div className="text-sm sm:text-lg font-bold">{attendanceList.absentCount}</div>
                            <div className="text-xs font-medium">Absents</div>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-1 sm:px-2 py-1 sm:py-2 rounded text-center">
                            <div className="text-sm sm:text-lg font-bold">{attendanceList.totalParticipants}</div>
                            <div className="text-xs font-medium">Total</div>
                        </div>
                    </div>

                    {/* Actions rapides et détails */}
                    <div className="mt-3 flex items-center justify-between">
                        <button
                            onClick={() => setExpandedDetails(!expandedDetails)}
                            className="flex items-center gap-1 text-blue-600 text-xs sm:text-sm font-medium hover:text-blue-700 transition-colors"
                        >
                            <span>Détails</span>
                            {expandedDetails ? <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4"/> : <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4"/>}
                        </button>

                        <div className="flex gap-1 sm:gap-2">
                            <button
                                onClick={markAllPresent}
                                disabled={isMarkingAttendance}
                                className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded text-xs sm:text-sm font-medium transition-colors disabled:opacity-50"
                            >
                                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4"/>
                                <span className="hidden sm:inline">Tous présents</span>
                                <span className="sm:hidden">Tous +</span>
                            </button>
                            <button
                                onClick={markAllAbsent}
                                disabled={isMarkingAttendance}
                                className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-redShade-100 text-redShade-700 hover:bg-redShade-200 rounded text-xs sm:text-sm font-medium transition-colors disabled:opacity-50"
                            >
                                <XCircle className="w-3 h-3 sm:w-4 sm:h-4"/>
                                <span className="hidden sm:inline">Tous absents</span>
                                <span className="sm:hidden">Tous -</span>
                            </button>
                        </div>
                    </div>

                    {/* Détails supplémentaires - Repliables */}
                    {expandedDetails && (
                        <div className="mt-3 pt-3 border-t border-gray-200 space-y-1 sm:space-y-2 text-xs sm:text-sm">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0"/>
                                <span className="text-gray-600 truncate">
                                    {attendanceList.groupInfo.location}, {attendanceList.groupInfo.city}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0"/>
                                <span className="text-gray-600 truncate">
                                    Formateur: {attendanceList.groupInfo.trainerName}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Zone de scroll principale - Liste des participants */}
            <div className="flex-1 overflow-auto">
                <div className="px-3 sm:px-4 lg:px-6 py-2 sm:py-4">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 border-b border-gray-200 bg-gray-50 sticky top-0">
                            <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">
                                Participants ({attendanceList.totalParticipants})
                            </h2>
                        </div>

                        {/* Liste scrollable optimisée */}
                        <div className="divide-y divide-gray-100 max-h-[calc(100vh-280px)] sm:max-h-[calc(100vh-320px)] overflow-y-auto">
                            {attendanceList.attendanceRecords.map((participant, index) => (
                                <div key={participant.recordId} className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 hover:bg-gray-50 transition-colors">
                                    <div className="space-y-2 sm:space-y-3">
                                        {/* Layout adaptatif selon l'orientation */}
                                        <div className="flex items-center justify-between gap-3">
                                            {/* Info participant */}
                                            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs sm:text-sm font-medium text-gray-500 w-6 text-right">
                                                        {index + 1}
                                                    </span>
                                                    <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${
                                                        participant.status === 'PRESENT'
                                                            ? 'bg-green-500'
                                                            : 'bg-redShade-500'
                                                    }`}></div>
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="font-medium text-gray-900 truncate text-sm sm:text-base">
                                                        {participant.userFullName}
                                                    </h3>
                                                    <p className="text-xs sm:text-sm text-gray-500 truncate">
                                                        {participant.userCode}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Statut actuel */}
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                                                participant.status === 'PRESENT'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-redShade-100 text-redShade-800'
                                            }`}>
                                                {participant.status === 'PRESENT' ? 'P' : 'A'}
                                            </span>
                                        </div>

                                        {/* Boutons d'action - Optimisés pour le tactile */}
                                        {participant.canEdit && (
                                            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                                <button
                                                    onClick={() => markAttendance(participant.userId, 'PRESENT')}
                                                    disabled={isMarkingAttendance && markingUserId !== participant.userId}
                                                    className={`flex items-center justify-center gap-1 sm:gap-2 px-3 py-3 sm:py-4 rounded-lg text-sm font-medium transition-all duration-200 min-h-[48px] sm:min-h-[52px] relative ${
                                                        participant.status === 'PRESENT'
                                                            ? 'bg-green-600 text-white shadow-lg scale-105'
                                                            : 'bg-green-50 text-green-700 hover:bg-green-100 active:bg-green-200 border-2 border-green-200 hover:border-green-300'
                                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                >
                                                    {markingUserId === participant.userId && isMarkingAttendance ? (
                                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                                                    ) : (
                                                        <>
                                                            <Check className="w-4 h-4 flex-shrink-0"/>
                                                            <span>Présent</span>
                                                        </>
                                                    )}
                                                </button>

                                                <button
                                                    onClick={() => markAttendance(participant.userId, 'ABSENT')}
                                                    disabled={isMarkingAttendance && markingUserId !== participant.userId}
                                                    className={`flex items-center justify-center gap-1 sm:gap-2 px-3 py-3 sm:py-4 rounded-lg text-sm font-medium transition-all duration-200 min-h-[48px] sm:min-h-[52px] relative ${
                                                        participant.status === 'ABSENT'
                                                            ? 'bg-redShade-600 text-white shadow-lg scale-105'
                                                            : 'bg-redShade-50 text-redShade-700 hover:bg-redShade-100 active:bg-redShade-200 border-2 border-redShade-200 hover:border-redShade-300'
                                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                >
                                                    {markingUserId === participant.userId && isMarkingAttendance ? (
                                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                                                    ) : (
                                                        <>
                                                            <X className="w-4 h-4 flex-shrink-0"/>
                                                            <span>Absent</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        )}

                                        {/* Date de marquage - Compact */}
                                        {participant.markedDate && (
                                            <div className="text-xs text-gray-500 pt-1 border-t border-gray-100">
                                                Marqué: {new Date(participant.markedDate).toLocaleString('fr-FR', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer fixe - Information contextuelle */}
            <div className="bg-white border-t flex-shrink-0">
                <div className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
                    <div className="text-center text-xs sm:text-sm text-gray-500 space-y-1">
                        <p>{attendanceList.listTypeDescription}</p>
                        <p>Dernière mise à jour: {new Date().toLocaleString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

AttendanceMarkingPage.useLayout = false;