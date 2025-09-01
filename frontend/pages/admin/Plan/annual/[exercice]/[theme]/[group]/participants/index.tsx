import React, { useState } from 'react';
import { planGroupUserData } from '@/data/planGroupUserData';
import { planGroupUser2Data } from '@/data/planGroupUser2Data';
import { PlanGroupUserProps, PlanGroupUser2Props } from '@/types/dataTypes';
import { ActionConfig } from '@/types/Table.types';

// Components
import InputField from '@/components/FormComponents/InputField';
import Table from '@/components/Tables/Table/index';
import TableActions from '@/components/Tables/TableActions';
import StatusRenderer from '@/components/Tables/StatusRenderer';
import EditIcon from '@/components/Svgs/EditIcon';
import { handleSort } from '@/utils/sortUtils';
import { statusConfig } from '@/config/tableConfig';

const Participants = () => {
    // Data and State
    const [data, setData] = useState<PlanGroupUserProps[]>(planGroupUserData);
    const [data2, setData2] = useState<PlanGroupUser2Props[]>(planGroupUser2Data);
    const [currentPage, setCurrentPage] = useState(1);
    const totalRecords = data.length;
    const recordsPerPage = 5;
    const showActions = true; // Decide if "actions" should be included

    // Table Configurations
    const headers1 = ["Code", "Nom", "Prénoms", "Poste", "Niveau", "Manager", "Select"];
    const keys1 = ["code", "firstName", "lastName", "position", "level", "manager", "select"];
    const headers2 = ["Nom", "Prénoms", "CIN", "CNSS", "Statut", "Actions"];
    const keys2 = ["firstName", "lastName", "cin", "cnss", "status", "actions"];

    // Column Visibility
    const [visibleColumns, setVisibleColumns] = useState(headers1);
    const [visibleColumns2, setVisibleColumns2] = useState(headers2);

    // Sorting
    const sortableCols1 = headers1.filter(header => header !== "Actions");
    const sortableCols2 = headers1.filter(header => header !== "Actions");

    const handleSortData1 = (column: string, order: "asc" | "desc") => {
        const columnKey = keys1[headers1.indexOf(column)].toLowerCase();
        const sortedData = handleSort(data, order, columnKey);
        setData(sortedData);
    };

    const handleSortData2 = (column: string, order: "asc" | "desc") => {
        const columnKey = keys2[headers2.indexOf(column)].toLowerCase();
        const sortedData = handleSort(data, order, columnKey);
        setData(sortedData);
    };

    // Renderers
    const renderers1 = {
        select: (_: string) => (
            <div className="flex justify-center items-center">
                <input type="checkbox" className="h-5 w-5 accent-primary" />
            </div>
        ),
    };

    // Table Actions Configuration
    const tableActions: ActionConfig[] = [
        {
            icon: <EditIcon />,
            label: "Modifier",
            onClick: (row) => {
                // Action de modification
                console.log("Modifier:", row);
            },
        },
        {
            icon: <img src='/images/cancel.svg' />,
            label: "Annuler",
            onClick: (row) => {
                // Action de suppression
                alert("Annuler");
            },
        },
    ];

    const renderers2 = {
        status: (value: string) => (
            <StatusRenderer value={value} groupeConfig={statusConfig} />
        ),
        actions: (_: any, row: any) =>
            showActions ? <TableActions actions={tableActions} row={row} /> : null,
    };

    return (
        <form className=''>
            {/* Form Fields */}
            <div className="grid md:grid-cols-2 md:gap-10 gap-4">
                <div>
                    {/*<InputField label="Public cible" name="targetAudience" onChange={() => null} />*/}
                </div>
                <div>
                    {/*<InputField type='number' label="Éffectif" name="staff" onChange={() => null} />*/}
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 mt-5">
                        {/*<InputField type='number' label="Manager" name="managerStaff" onChange={() => null} />*/}
                        {/*<InputField type='number' label="Employé" name="employeeStaff" onChange={() => null} />*/}
                        {/*<InputField type='number' label="Ouvrier" name="workerStaff" onChange={() => null} />*/}
                        {/*<InputField type='number' label="Temporaire" name="temporaryStaff" onChange={() => null} />*/}
                    </div>
                </div>
            </div>

            {/* Tables and Buttons */}
            <div className="mt-10">
                <Table
                    data={data.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage)}
                    keys={keys1}
                    headers={headers1}
                    sortableCols={sortableCols1}
                    onSort={handleSortData1}
                    isPagination={false}
                    pagination={{
                        currentPage,
                        totalPages: Math.ceil(totalRecords / recordsPerPage),
                        onPageChange: setCurrentPage,
                    }}
                    totalRecords={totalRecords}
                    loading={false}
                    onAdd={() => console.log("Nouveau")}
                    visibleColumns={visibleColumns}
                    renderers={renderers1}
                />
                {/* Section : Bouton d'action */}
                <div className="text-right text-xs md:text-sm lg:text-base">
                    <button
                        type="button"
                        className="bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd hover:bg-indigo-700 text-white font-bold p-2 md:p-3 lg:p-4 rounded-xl"
                        onClick={() => alert("MyEvaluationsComponent ajoutée avec succès")}
                    >
                        Ajouter à la liste
                    </button>
                </div>
            </div>
            <div className="mt-5">
                <Table
                    data={data2.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage)}
                    keys={keys2}
                    headers={headers2}
                    sortableCols={sortableCols2}
                    onSort={handleSortData2}
                    isPagination={false}
                    pagination={{
                        currentPage,
                        totalPages: Math.ceil(totalRecords / recordsPerPage),
                        onPageChange: setCurrentPage,
                    }}
                    totalRecords={totalRecords}
                    loading={false}
                    onAdd={() => console.log("Nouveau")}
                    visibleColumns={visibleColumns2}
                    renderers={renderers2}
                />
                {/* Section : Bouton d'action */}
                <div className="text-right text-xs md:text-sm lg:text-base">
                    <button
                        type="button"
                        className="bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd hover:bg-indigo-700 text-white font-bold p-2 md:p-3 lg:p-4 rounded-xl"
                        onClick={() => alert("MyEvaluationsComponent ajoutée avec succès")}
                    >
                        Envoyer
                    </button>
                </div>
            </div>
        </form>
    );
};

export default Participants;