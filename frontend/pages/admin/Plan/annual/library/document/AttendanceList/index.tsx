import FileInputField from '@/components/FormComponents/FileInputField';
import StatusRenderer from '@/components/Tables/StatusRenderer';
import Table from '@/components/Tables/Table/index';
import {statusConfig} from '@/config/tableConfig';
import useTable from '@/hooks/useTable';
import {handleSort} from '@/utils/sortUtils';
import React, {useMemo, useState} from 'react'
import useSWR from "swr";
import {ATTENDANCE_URLS, TRAINING_GROUPE_URLS} from "@/config/urls";
import {fetcher} from "@/services/api";
import {useRouter} from "next/router";
import DateSelector from "@/components/ui/DateSelector";

const TABLE_HEADERS = [
    "Nom",
    "Email",
    "Confirmation",
];
const TABLE_KEYS = [
    "userFullName",
    "userEmail",
    "status",
];

// Interfaces
interface AttendanceRecord {
    id: string;
    userId: number;
    userFullName: string;
    userEmail: string;
    status: string;
}

const RECORDS_PER_PAGE = 4;

const PresenceList = () => {
    const router = useRouter();
    const {groupId} = router.query;
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
    const [isLoadingAttendance, setIsLoadingAttendance] = useState(false);
    const [attendanceError, setAttendanceError] = useState<string | null>(null);

    // Chargement des dates disponibles
    const {
        data: dateData,
        error: dateError,
        mutate: mutateDates
    } = useSWR(
        groupId ? `${TRAINING_GROUPE_URLS.getGroupDates}/${groupId}` : null,
        fetcher
    );

    // Fonction pour charger les données de présence
    const loadAttendanceData = async (groupId: string | string[], date: string) => {
        setIsLoadingAttendance(true);
        setAttendanceError(null);

        try {
            const response = await fetch(ATTENDANCE_URLS.getAttendanceListPerDate, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    groupId: groupId,
                    date: date // Format ISO (YYYY-MM-DD)
                })
            });

            if (!response.ok) {
                throw new Error(`Erreur lors du chargement des données: ${response.statusText}`);
            }

            const data = await response.json();
            setAttendanceData(data || []);
            console.log('Données de présence chargées:', data);
        } catch (error) {
            console.error('Erreur lors du chargement des données de présence:', error);
            setAttendanceError(error.message);
            setAttendanceData([]); // Réinitialiser les données en cas d'erreur
        } finally {
            setIsLoadingAttendance(false);
        }
    };

    const memorizedDateData = useMemo(() => dateData || [], [dateData]);

    console.log('memorizedDateData:', memorizedDateData);
    console.log('selectedDate:', selectedDate);
    console.log('attendanceData:', attendanceData);

    // Utiliser les données de présence si disponibles, sinon les données par défaut
    const tableData = attendanceData.length > 0 ? attendanceData : null;

    const {
        currentPage,
        visibleColumns,
        setCurrentPage,
        handleSortData,
        totalRecords,
        totalPages,
        sortableColumns,
        paginatedData,
    } = useTable<AttendanceRecord>(tableData, TABLE_HEADERS, TABLE_KEYS, RECORDS_PER_PAGE)

    const renderers = {
        status: (value: string) => (
            <StatusRenderer
                value={value}
                groupeConfig={statusConfig}
            />
        ),
    };

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        console.log('Date sélectionnée:', date);

        if (groupId && date) {
            console.log('Chargement des données de présence pour le groupe:', groupId, 'et la date:', date);
            loadAttendanceData(groupId, date);
        }
    };

    return (
        <div className='space-y-10'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                {/* Vous pouvez garder d'autres champs ici si nécessaire */}
            </div>
            <div className='space-y-2'>
                <DateSelector
                    dates={memorizedDateData}
                    selectedDate={selectedDate}
                    onDateChange={handleDateChange}
                    loading={!dateData && !dateError}
                />

                {/* Affichage des erreurs */}
                {attendanceError && (
                    <div className="bg-redShade-50 border border-redShade-200 text-redShade-700 px-4 py-3 rounded-md">
                        <p className="text-sm">Erreur lors du chargement des données de présence: {attendanceError}</p>
                    </div>
                )}

                <Table
                    data={paginatedData}
                    keys={TABLE_KEYS}
                    headers={TABLE_HEADERS}
                    sortableCols={sortableColumns}
                    onSort={(column, order) => handleSortData(column, order, handleSort)}
                    isPagination={false}
                    pagination={{
                        currentPage,
                        totalPages,
                        onPageChange: setCurrentPage,
                    }}
                    totalRecords={totalRecords}
                    loading={isLoadingAttendance}
                    onAdd={() => null}
                    visibleColumns={visibleColumns}
                    renderers={renderers}
                />
                <FileInputField
                    label='Liste de présence émargée'
                    name='presenceFile'
                    onChange={() => null}
                    inputClassName='w-1/3'
                    labelClassName='font-extrabold'
                />
            </div>
        </div>
    )
}

export default PresenceList