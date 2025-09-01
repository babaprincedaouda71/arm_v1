import React, {useEffect, useMemo, useState} from "react";
import {UserDataProps} from "@/types/dataTypes";
import Table from "@/components/Tables/Table/index";
import useTable from "@/hooks/useTable";
import {useRouter} from "next/router";
import StatusRenderer from "@/components/Tables/StatusRenderer";
import {statusConfig} from "@/config/tableConfig";
import DynamicActionsRenderer from "@/components/Tables/DynamicActionsRenderer";
import {handleSort} from "@/utils/sortUtils";
import DonutChart from "@/components/DonutChart";

const TABLE_HEADERS = [
    "Nom complet",
    "Groupe",
    "Date de création",
    "Statut",
    "Actions",
];

const TABLE_KEYS = [
    "fullName",
    "group",
    "creationDate",
    "status",
    "actions",
];

const ACTIONS_TO_SHOW = ["view", "edit", "delete"];
const RECORDS_PER_PAGE = 4;


const Data = () => {
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const {
        data,
        currentPage,
        visibleColumns,
        setCurrentPage,
        handleSortData,
        toggleColumnVisibility,
    } = useTable<UserDataProps>(userData, TABLE_HEADERS, TABLE_KEYS, RECORDS_PER_PAGE)

    const router = useRouter();

    const totalRecords = userData.length;
    const totalPages = useMemo(() => Math.ceil(totalRecords / RECORDS_PER_PAGE), [totalRecords]);

    // Sortable Columns
    const sortableColumns = useMemo(
        () => TABLE_HEADERS.filter((TABLE_HEADERS) => !["Actions", "Sélection"].includes(TABLE_HEADERS)),
        []
    );
    // Pagination des données
    const paginatedData = useMemo(
        () => userData.slice((currentPage - 1) * RECORDS_PER_PAGE, currentPage * RECORDS_PER_PAGE),
        [userData, currentPage]
    );

    const renderers = {
        status: (value: string) => (
            <StatusRenderer value={value} groupeConfig={statusConfig}/>
        ),
        actions: (_: any, row: UserDataProps) => (
            <DynamicActionsRenderer actions={ACTIONS_TO_SHOW} row={row}/>
        ),
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5000/users"); // Remplacez par l'URL de votre JSON Server
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des données");
            }
            const data = await response.json();
            setUserData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <div>Chargement des données...</div>;
    if (error) return <div>Erreur : {error}</div>;


    const departmentData = [
        { name: 'IT', value: 5, color: '#DC2626' },         // Rouge
        { name: 'Marketing', value: 4, color: '#93C5FD' },  // Bleu clair
        { name: 'Ingénierie', value: 3, color: '#C4B5FD' }, // Violet
        { name: 'Sécurité', value: 2, color: '#E0E7FF' }    // Bleu très clair
    ];

    return (
        <div>
            <table>
                <thead>
                <tr>
                    <th>Full name</th>
                    <th>Group</th>
                    <th>Creation date</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {userData.map((user: UserDataProps) => (
                    <tr key={user.fullName}>
                        <td>{user.fullName}</td>
                        <td>{user.group}</td>
                        <td>{user.creationDate}</td>
                        <td>{user.status}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <Table data={paginatedData} keys={TABLE_KEYS} headers={TABLE_HEADERS} sortableCols={sortableColumns}
                   onSort={(col, order) => handleSortData(col, order, handleSort)} visibleColumns={visibleColumns}
                   renderers={renderers}/>

            <DonutChart data={departmentData} />
        </div>
    )
}
export default Data