// ====================
// PAGE : pages/public/attendance/scan/[token].tsx
// ====================

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {AlertCircle, Calendar, Check, Clock, MapPin, Users, X} from 'lucide-react';
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

    // Fonction pour scanner le QR code et récupérer les données
    const scanQRCode = async (qrToken: string) => {
        try {
            const response = await fetch(`${ATTENDANCE_URLS.scan}/${qrToken}`, {
                method: 'GET',
                // credentials: 'include'
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
        try {
            const response = await fetch('/api/plan/attendance/mark', {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    qrCodeToken: attendanceList.qrCodeToken,
                    userId: userId,
                    status: status,
                    markedBy: null // Pour l'instant pas de gestion d'utilisateur connecté
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
            }
        } catch (err) {
            console.error('Erreur marquage:', err);
            alert('Erreur lors du marquage de la présence');
        } finally {
            setIsMarkingAttendance(false);
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Validation du QR code...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
                    <div className="text-center">
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4"/>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès non autorisé</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button
                            onClick={() => router.back()}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Aucune donnée trouvée</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Users className="w-8 h-8 text-blue-600"/>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Marquage de présence
                        </h1>
                    </div>

                    {/* Informations de la formation */}
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="w-4 h-4"/>
                                <span className="font-medium">Formation:</span>
                                <span>{attendanceList.trainingTheme}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Users className="w-4 h-4"/>
                                <span className="font-medium">Groupe:</span>
                                <span>{attendanceList.groupName}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="w-4 h-4"/>
                                <span className="font-medium">Lieu:</span>
                                <span>{attendanceList.groupInfo.location}, {attendanceList.groupInfo.city}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Clock className="w-4 h-4"/>
                                <span className="font-medium">Date:</span>
                                <span>{new Date(attendanceList.attendanceDate).toLocaleDateString('fr-FR', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</span>
                            </div>
                        </div>
                    </div>

                    {/* Résumé des présences */}
                    <div className="mt-4 flex gap-4">
                        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            Présents: {attendanceList.presentCount}
                        </div>
                        <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                            Absents: {attendanceList.absentCount}
                        </div>
                        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            Total: {attendanceList.totalParticipants}
                        </div>
                    </div>
                </div>
            </div>

            {/* Liste des participants */}
            <div className="max-w-4xl mx-auto px-4 py-6">
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Liste des participants ({attendanceList.totalParticipants})
                        </h2>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {attendanceList.attendanceRecords.map((participant) => (
                            <div key={participant.recordId} className="px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${
                                                participant.status === 'PRESENT'
                                                    ? 'bg-green-500'
                                                    : 'bg-red-500'
                                            }`}></div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">
                                                    {participant.userFullName}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    Code: {participant.userCode}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            participant.status === 'PRESENT'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {participant.statusDescription}
                                        </span>

                                        {participant.canEdit && (
                                            <div className="flex gap-2 ml-4">
                                                <button
                                                    onClick={() => markAttendance(participant.userId, 'PRESENT')}
                                                    disabled={isMarkingAttendance || participant.status === 'PRESENT'}
                                                    className={`flex items-center gap-1 px-3 py-1 rounded text-sm font-medium transition-colors ${
                                                        participant.status === 'PRESENT'
                                                            ? 'bg-green-600 text-white'
                                                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                >
                                                    <Check className="w-4 h-4"/>
                                                    Présent
                                                </button>

                                                <button
                                                    onClick={() => markAttendance(participant.userId, 'ABSENT')}
                                                    disabled={isMarkingAttendance || participant.status === 'ABSENT'}
                                                    className={`flex items-center gap-1 px-3 py-1 rounded text-sm font-medium transition-colors ${
                                                        participant.status === 'ABSENT'
                                                            ? 'bg-red-600 text-white'
                                                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                >
                                                    <X className="w-4 h-4"/>
                                                    Absent
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {participant.markedDate && (
                                    <div className="mt-2 text-xs text-gray-500">
                                        Marqué le {new Date(participant.markedDate).toLocaleString('fr-FR')}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-white border-t mt-8">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="text-center text-sm text-gray-500">
                        <p>Liste de présence {attendanceList.listTypeDescription}</p>
                        <p>Dernière mise à jour: {new Date().toLocaleString('fr-FR')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

AttendanceMarkingPage.useLayout = false;