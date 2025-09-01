import React, {useMemo, useState} from "react";
import Table from "@/components/Tables/Table/index";
import DashboardBar from "@/components/DashbordBar";
import SearchFilterAddBar from "@/components/SearchFilterAddBar";
import ModalButton from "@/components/ModalButton";
import StatusRenderer from "@/components/Tables/StatusRenderer";
import {statusConfig} from "@/config/tableConfig";
import {handleSort} from "@/utils/sortUtils";
import useTable from "@/hooks/useTable";
import DynamicActionsRenderer from "@/components/Tables/DynamicActionsRenderer";
import Modal from "@/components/Modal";
import RadioButton from "@/components/FormComponents/RadioButton";
import {useRouter} from "next/router";
import useSWR, {mutate} from "swr";
import {NEEDS_STRATEGIC_AXES_URLS, NEEDS_URLS} from "@/config/urls";
import {fetcher} from "@/services/api";
import {NeedsProps} from "@/types/dataTypes";
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import {UserRole} from "@/contexts/AuthContext";

const TABLE_HEADERS = [
    "Domaine",
    "Thème",
    "Source",
    "Nbr groupe",
    "Site",
    "Département",
    "Date",
    "Statut",
    "Actions",
];
const TABLE_KEYS = [
    "domain",
    "theme",
    "source",
    "nbrGroup",
    "site",
    "department",
    "creationDate",
    "status",
    "actions",
];

const ACTIONS_TO_SHOW = ["view", "edit", "delete"];
const RECORDS_PER_PAGE = 4;

const Needs = () => {
    const {navigateTo, isCurrentPath, getPathWithoutRolePrefix, buildRoleBasedPath} = useRoleBasedNavigation();
    const {
        data: needsData,
    } = useSWR<NeedsProps[]>(NEEDS_URLS.mutate, fetcher);
// Dans pages/admin/Needs/AddOCFPage.tsx, ligne ~25 environ
    const memorizeNeedsData = useMemo(() => {
        const data = needsData || [];
        console.log("Sample need data:", data[1]); // 🆕 Debug
        return data;
    }, [needsData]);
    const defaultVisibleColumns = [
        "Domaine",
        "Thème",
        "Source",
        "Nbr groupe",
        "Site",
        "Département",
        "Statut",
        "Actions",
    ];
    const {
        currentPage,
        visibleColumns,
        setCurrentPage,
        handleSortData,
        toggleColumnVisibility,
        totalPages,
        totalRecords,
        sortableColumns,
        paginatedData,
    } = useTable(
        memorizeNeedsData,
        TABLE_HEADERS,
        TABLE_KEYS,
        RECORDS_PER_PAGE,
        defaultVisibleColumns,
    )

    const renderers = {
        theme: (value: string, row: NeedsProps) => (
            <span
                className="cursor-pointer text-blue-600 hover:text-blue-800 hover:underline font-medium"
                onClick={() => {
                    const viewUrl = buildRoleBasedPath(`${NEEDS_STRATEGIC_AXES_URLS.view}`);
                    navigateTo(viewUrl, { query: { id: row.id } });
                }}
            >
            {value}
        </span>
        ),
        source: (value: string) => (
            <div className="flex items-center gap-2">
                {value === "Strategic_Axes" ?
                    "Axes Stratégiques" :
                    value === "Individual_Requests" ?
                        "Requêtes individuelles" :
                        value === "Internal_Catalog" ?
                            "Catalogue interne" :
                            value === "External_Catalog" ?
                                "Catalogue Externe" :
                                value === "Evaluation" ?
                                    "Évaluation" : "Aucune source"}
            </div>
        ),
        actions: (_: any, row: NeedsProps) => (
            <DynamicActionsRenderer
                actions={ACTIONS_TO_SHOW}
                row={row}
                deleteUrl={NEEDS_URLS.delete}
                mutateUrl={NEEDS_URLS.mutate}
                editUrl={NEEDS_URLS.editPage}
                viewUrl={buildRoleBasedPath(`${NEEDS_STRATEGIC_AXES_URLS.view}`)}
                confirmMessage={`Êtes-vous sûr de vouloir supprimer le besoin ${row.theme}`}
                // 🆕 Fonction unifiée pour désactiver les actions selon le statut
                getActionDisabledState={(actionKey: string, row: NeedsProps) => {
                    // Désactiver l'édition ET la suppression si le statut est "Validé"
                    return (actionKey === 'edit' || actionKey === 'delete') && row.status === "Validé";

                }}
            />
        ),
        status: (value: string, row: NeedsProps) => (
            <StatusRenderer
                value={value}
                groupeConfig={statusConfig}
                row={row}
                statusOptions={["Brouillon", "Validé"]}
                apiUrl={NEEDS_URLS.updateStatus}
                mutateUrl={NEEDS_URLS.mutate}
            />
        )
    };

    const [isModalOpen, setModalOpen] = useState(false);
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);
    const [selectedOption, setSelectedOption] = useState("");

    const options = [
        {
            id: "strategicAxes",
            value: "strategicAxes",
            label: "Axes stratégiques",
        },
        {
            id: "evaluation",
            value: "evaluation",
            label: "Évaluation",
        },
        {
            id: "internalCatalog",
            value: "internalCatalog",
            label: "Catalogue interne",
        },
        {
            id: "ocfCatalog",
            value: "ocfCatalog",
            label: "Catalogue OCF",
        },
        {
            id: "individualRequest",
            value: "individualRequest",
            label: "Requêtes individuelles",
        },
    ];

    const router = useRouter();
    const onAddTheme = () => {
        closeModal();

        switch (selectedOption) {
            case "strategicAxes":
                closeModal();
                navigateTo("/Needs/strategic-axes/manual-entry");
                break;
            case "evaluation":
                setSelectedOption("evaluation");
                break;
            case "internalCatalog":
                setSelectedOption("internalCatalog");
                break;
            case "ocfCatalog":
                setSelectedOption("ocfCatalog");
                break;
            case "individualRequest":
                setSelectedOption("individualRequest");
                break;
            default:
                setSelectedOption("strategicAxes");
                break;
        }
    }

    const handleDuplicateGroup = async (group: any) => {
        // Logique pour dupliquer le groupe
        console.log("Duplication du groupe :", group);
        // Implémentez ici la logique pour dupliquer le groupe dans votre état ou API
        const response = await fetch(`${NEEDS_URLS.duplicateGroup}/${group.id}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error(`Erreur lors de la duplication du groupe : ${response.status}`);
        }


        // Mettez à jour le tableau ou l'état local après la duplication
        await mutate(NEEDS_URLS.mutate);
    };

    const handleAddGroup = (need: any) => {
        navigateTo("/Needs/group/add-group", {
            query: {needId: need.id},
        });
    }
    const handleEditGroup = (need: any, groupId: number) => {
        navigateTo("/Needs/group/add-group", {
            query: {
                needId: need.id,
                groupId: groupId,
            },
        });
    }

    return (
        <ProtectedRoute requiredRole={UserRole.Admin}>
            <DashboardBar/>
            <div className="font-title text-xs md:text-sm lg:text-base bg-white rounded-xl pt-6">
                <div className="flex items-start gap-2 md:gap-8">
                    <SearchFilterAddBar
                        isLeftButtonVisible={false}
                        isFiltersVisible={false}
                        isRightButtonVisible={true}
                        leftTextButton="Filtrer les colonnes"
                        rightTextButton="Nouveau"
                        onRightButtonClick={openModal}
                        filters={[]}
                        placeholderText={"Recherche de besoins"}
                    />
                    {/* Bouton pour afficher/masquer la fenêtre modale */}
                    <ModalButton
                        headers={TABLE_HEADERS}
                        visibleColumns={visibleColumns}
                        toggleColumnVisibility={toggleColumnVisibility}
                    />
                </div>

                {/* Tableau */}
                <Table
                    data={paginatedData}
                    keys={TABLE_KEYS}
                    headers={TABLE_HEADERS}
                    sortableCols={sortableColumns}
                    onSort={(column, order) => handleSortData(column, order, handleSort)}
                    isPagination
                    pagination={{
                        currentPage,
                        totalPages,
                        onPageChange: setCurrentPage,
                    }}
                    totalRecords={totalRecords}
                    loading={false}
                    onAdd={() => console.log("Nouveau")}
                    visibleColumns={visibleColumns}
                    renderers={renderers}
                    expandable={true}
                    onDuplicate={handleDuplicateGroup}
                    onGroupAdd={handleAddGroup}
                    onGroupEdit={handleEditGroup}
                />
            </div>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={"Ajout d'un nouveau besoin"}
                subtitle={"Veuillez choisir à partir de quelle source ajoutée le thème de formation"}
                actions={[
                    {
                        label: "Annuler",
                        onClick: closeModal,
                        className: "border"
                    },
                    {
                        label: "OK",
                        onClick: onAddTheme,
                        className: "bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd text-white",
                    },
                ]} icon={undefined}>
                <div className="flex flex-col justify-items-center space-y-4">
                    {options.map((option) => (
                        <RadioButton
                            key={option.id}
                            id={option.id}
                            name="destination"
                            value={option.value}
                            label={option.label}
                            checked={selectedOption === option.value}
                            onChange={(e) => setSelectedOption(e.target.value)}
                            className={"w-6 h-6"}
                        />
                    ))}
                </div>
            </Modal>
        </ProtectedRoute>
    );
};

export default Needs;