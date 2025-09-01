import React, {useCallback, useMemo, useState} from "react";
import {GroupsProps} from "@/types/dataTypes";
import PermissionRenderer from "@/components/Tables/PermissionRenderer";
import {permissionConfig} from "@/config/tableConfig";
import DynamicActionsRenderer from "@/components/Tables/DynamicActionsRenderer";
import useTable from "@/hooks/useTable";
import useSWR from "swr";
import {GROUPS_URLS} from "@/config/urls";
import {fetcher} from "@/services/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import {UserRole} from "@/contexts/AuthContext";
import SearchFilterAddBar from "@/components/SearchFilterAddBar";
import ModalButton from "@/components/ModalButton";
import Table from "@/components/Tables/Table/index";
import {handleSort} from "@/utils/sortUtils";
import Modal from "@/components/Modal";
import InputField from "@/components/FormComponents/InputField";
import AccessRightModal from "@/components/AccessRightModal";

const TABLE_KEYS = ["name", "userCount", "accessRights", "actions"];
const TABLE_HEADERS = ["Groupe", "Utilisateurs", "Permission d'accès", "Actions"];

const ACTIONS_TO_SHOW = ["edit", "delete"];
const RECORDS_PER_PAGE = 5;


const Groups = () => {
    const {data: groupData, mutate} = useSWR<GroupsProps[]>(GROUPS_URLS.mutate, fetcher);

    const [searchValue, setSearchValue] = useState("");
    const [isEditMode, setIsEditMode] = useState(false);

    // Filtrer les données en fonction de la recherche
    const filteredData = useMemo(() => {
        if (!groupData) return [];
        if (!searchValue.trim()) return groupData;

        return groupData.filter(group =>
            group.name.toLowerCase().includes(searchValue.toLowerCase())
        );
    }, [groupData, searchValue]);

    const memorizedData = useMemo(() => filteredData || [], [filteredData]);

    const {
        currentPage,
        visibleColumns,
        setCurrentPage,
        handleSortData,
        toggleColumnVisibility,
        totalRecords,
        paginatedData,
        sortableColumns,
        totalPages,
    } = useTable(memorizedData, TABLE_HEADERS, TABLE_KEYS, RECORDS_PER_PAGE);

    const [isModalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({name: "", id: null});
    const [errors, setErrors] = useState<string | null>(null);

    const openModal = () => {
        setIsEditMode(false);
        setFormData({name: "", id: null});
        setModalOpen(true);
    };

    const closeModal = () => {
        setErrors(null);
        setModalOpen(false);
        setFormData({name: "", id: null});
        setIsEditMode(false);
    };

    // Fonction personnalisée pour gérer l'édition d'un groupe
    const handleEditGroup = (row) => {
        setFormData({name: row.name, id: row.id});
        setIsEditMode(true);
        setModalOpen(true);
    };

    //Gestion du groupe Modal
    const [isAccessModalOpen, setAccessModalOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<GroupsProps | null>(null);

    const openAccessModal = (group: GroupsProps) => {
        setSelectedGroup(group);
        setAccessModalOpen(true);
    };

    const closeAccessModal = () => {
        setSelectedGroup(null);
        setAccessModalOpen(false);
    };

    const handleSave = useCallback(async () => {
        // Vérifier si le champ "name" est vide
        if (!formData.name.trim()) {
            setErrors("Le nom du groupe est obligatoire");
            return; // Arrêter l'exécution si le champ est vide
        }

        try {
            const url = isEditMode
                ? `${GROUPS_URLS.update}/${formData.id}`
                : GROUPS_URLS.add;
            const method = isEditMode ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({name: formData.name}),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Erreur lors de ${isEditMode ? "la modification" : "l'ajout"} du groupe`);
            }

            // Revalider les données après l'ajout/modification du groupe
            await mutate();
            console.log(`Groupe ${isEditMode ? "modifié" : "ajouté"} avec succès`);
            closeModal();
        } catch (error) {
            setErrors(error.message);
            console.error(`Erreur lors de ${isEditMode ? "la modification" : "l'ajout"} du groupe :`, error);
        }
    }, [formData, mutate, isEditMode]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData((prevFormData) => ({...prevFormData, [name]: value}));
    }, []);

    const handleSearchChange = useCallback((value: string) => {
        setSearchValue(value);
        // Réinitialiser la pagination à la première page lorsque la recherche change
        setCurrentPage(1);
    }, [setCurrentPage]);

    const renderers = {
        accessRights: (_: any, row: GroupsProps) => (
            <PermissionRenderer
                value={row.name === "Admin" ? "Admin" : "_"}
                permissionConfig={permissionConfig}
                onClick={() => openAccessModal(row)}
            />
        ),
        actions: (_: string, row: GroupsProps) => (
            <DynamicActionsRenderer
                actions={ACTIONS_TO_SHOW}
                row={row}
                deleteUrl={GROUPS_URLS.delete}
                editUrl="/admin/groups/edit" // Conservez la route existante pour compatibilité
                mutateUrl={GROUPS_URLS.mutate}
                confirmMessage={`Êtes-vous sûr de vouloir supprimer le groupe ${row.name} ?`}
                customEditHandler={() => handleEditGroup(row)}
            />
        ),
    };

    return (
        <ProtectedRoute requiredRole={UserRole.Admin}>
            <div className="font-title text-xs md:text-sm lg:text-base bg-white rounded-xl pt-6">
                <div className="flex items-start gap-2 md:gap-8">
                    <SearchFilterAddBar
                        isLeftButtonVisible={false}
                        isFiltersVisible={false}
                        isRightButtonVisible={true}
                        leftTextButton="Filtrer les colonnes"
                        rightTextButton="Ajouter un groupe"
                        onRightButtonClick={openModal}
                        filters={[]}
                        placeholderText={"Rechercher un groupe"}
                        searchValue={searchValue}
                        onSearchChange={handleSearchChange}
                    />
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
                    onAdd={() => console.log("Nouveau groupe")}
                    visibleColumns={visibleColumns}
                    renderers={renderers}
                />

                {/* Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    title={isEditMode ? "Modification d'un groupe" : "Création d'un nouveau groupe"}
                    subtitle={"Veuillez remplir les champs ci-dessous"}
                    actions={[
                        {label: "Annuler", onClick: closeModal, className: "border"},
                        {
                            label: "Enregistrer",
                            onClick: handleSave,
                            className: "bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd text-white",
                        },
                    ]}
                    icon={undefined}
                >
                    {errors && (
                        <div className="text-red text-center pb-5 text-sm mt-2">{errors}</div>
                    )}
                    <div className="flex justify-between items-center space-x-2">
                        <InputField
                            name="name"
                            label="Nom du groupe"
                            className=""
                            value={formData.name}
                            inputClassName="focus:outline-none focus:ring-2 focus:ring-primary"
                            onChange={handleChange}
                        />
                    </div>
                </Modal>

                {/* Modal de gestion des accès */}
                <AccessRightModal
                    isOpen={isAccessModalOpen}
                    onClose={closeAccessModal}
                    title={`Gérer les accès - ${selectedGroup?.name || ''}`}
                    subtitle="Modifiez les permissions de ce groupe"
                    children={undefined}
                    actions={undefined}
                    accessRights={null}
                />
            </div>
        </ProtectedRoute>
    );
};

export default Groups;