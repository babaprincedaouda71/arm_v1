// src/pages/admin/User/index0.tsx

import React, {useCallback, useMemo, useState} from "react";
import useSWR from "swr";

// Composants globaux
import Table from "@/components/Tables/Table/index";
import ModalButton from "@/components/ModalButton";
import SearchFilterAddBar from "@/components/SearchFilterAddBar";
import ImportExportButtons from "@/components/ImportExportButtons";
import DragAndDropModal from "@/components/DragAndDropModal";
import ProtectedRoute from "@/components/ProtectedRoute";

// Hooks personnalisés
import useTable from "@/hooks/useTable";
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";
import {useCsvImport} from "@/hooks/users/useCsvImport"; // Nouveau hook
import {useTableSelection} from "@/hooks/users/useTableSelection"; // Nouveau hook
import {useUserTableRenderers} from "@/hooks/users/useUserTableRenderers"; // Nouveau hook
// Types de données
import {GroupsProps, UserProps} from "@/types/dataTypes";
import {UserRole} from "@/types/authTypes"; // Type pour le rôle utilisateur
// Configurations
import {GROUPS_URLS, USERS_URLS} from "@/config/urls"; // URLs des APIs
import {
    USERS_DEFAULT_VISIBLE_COLUMNS,
    USERS_RECORDS_PER_PAGE,
    USERS_TABLE_HEADERS,
    USERS_TABLE_KEYS
} from "@/config/users/usersTableConfig"; // Constantes spécifiques au tableau des utilisateurs
// Services et Utilitaires
import {fetcher} from "@/services/api"; // Fonction fetcher pour les appels API
import {exportToCSV} from "@/services/csvService"; // Service d'exportation CSV
import {handleSort} from "@/utils/sortUtils"; // Fonction de tri générique

const User = (): JSX.Element => {
    // États locaux
    const [isModalOpen, setModalOpen] = useState(false);

    // Hooks personnalisés pour la logique réutilisable
    const {navigateTo, buildRoleBasedPath} = useRoleBasedNavigation();
    const {
        csvFile,
        isLoading: isCsvLoading,
        errorMessage: csvErrorMessage,
        handleSave: handleSaveCsv,
        handleFileChange: handleCsvFileChange,
        resetCsvImport,
    } = useCsvImport();
    const {
        selectedRows,
        handleRowSelection,
        isRowSelected,
        clearSelection,
    } = useTableSelection();

    // Récupération des données via SWR
    const {data: userData} = useSWR<UserProps[]>(USERS_URLS.mutate, fetcher);
    const {data: groupsData} = useSWR<GroupsProps[]>(GROUPS_URLS.mutate, fetcher);

    // Récupération des managers
    const managers = useMemo(() => {
        return (userData || []).filter(user => (user.role === "Manager"));
    }, [userData]);

    // Récupération des admins
    const admins = useMemo(() => {
        return (userData || []).filter(user => user.role === "Admin");
    }, [userData]);

    // Mémorisation des données pour éviter les re-calculs inutiles
    const memoizedUserData = useMemo(() => userData || [], [userData]);
    const groupeOptions = useMemo(
        () => groupsData?.map((group) => group.name) || [],
        [groupsData]
    );

    // Création de managerOptions
    const managerOptions = useMemo(() => {
        return managers.map(manager => ({
            value: manager.id,
            label: `${manager.firstName} ${manager.lastName}`,
        })) || [];
    }, [managers]);

    // Création de managerOptions
    const adminOptions = useMemo(() => {
        return admins.map(admin => ({
            value: admin.id,
            label: `${admin.firstName} ${admin.lastName}`,
        })) || [];
    }, [admins]);

    // Logique de navigation spécifique au composant
    const handleAddUser = useCallback((): void => {
        navigateTo("/User/addUser");
    }, [navigateTo]);

    const handleFullNameClick = useCallback(
        (_: string, row: UserProps): void => {
            if (row.lastName) {
                navigateTo("/User/user", {
                    query: {id: row.id}
                });
            }
        },
        [navigateTo]
    );

    // Utilisation du hook useTable pour la gestion de la pagination, du tri, etc.
    const {
        currentPage,
        visibleColumns,
        setCurrentPage,
        handleSortData,
        toggleColumnVisibility,
        totalPages,
        totalRecords,
        paginatedData,
        sortableColumns,
    } = useTable(
        memoizedUserData,
        USERS_TABLE_HEADERS,
        USERS_TABLE_KEYS,
        USERS_RECORDS_PER_PAGE,
        USERS_DEFAULT_VISIBLE_COLUMNS
    );

    // Renderers pour les colonnes du tableau, extraits dans un hook dédié
    const renderers = useUserTableRenderers({
        isRowSelected,
        handleRowSelection,
        handleFullNameClick, // Passé au renderer
        groupeOptions,
        managerOptions,
        adminOptions,
        // Ces éléments sont nécessaires pour les renderers internes
        // USERS_ACTIONS_TO_SHOW, USERS_URLS, buildRoleBasedPath sont importés directement dans useUserTableRenderers
        // statusConfig, groupeConfig sont aussi importés directement dans useUserTableRenderers
    });

    // Fonctions pour la modale d'import CSV
    const openModal = (): void => setModalOpen(true);
    const closeModal = (): void => {
        resetCsvImport(); // Réinitialise l'état d'import CSV
        setModalOpen(false);
    };

    // Gestion de l'export CSV
    const handleExport = useCallback(async (): Promise<void> => {
        if (!userData) {
            // Pas de message d'erreur d'état, l'erreur est gérée dans le service ou affichée à l'utilisateur
            console.warn("Aucune donnée utilisateur à exporter.");
            return;
        }
        exportToCSV(userData, "users.csv");
    }, [userData]);


    return (
        <ProtectedRoute requiredRole={UserRole.Admin}>
            <div className="bg-white rounded-lg">
                {/* Boutons d'Importation et d'Exportation */}
                <div className="rounded-t-lg p-6 bg-white md:mx-auto">
                    <ImportExportButtons onImport={openModal} onExport={handleExport}/>
                </div>

                {/* Barre de Recherche et de Filtres */}
                <div className="flex items-start gap-2 md:gap-8 mt-4">
                    <SearchFilterAddBar
                        isLeftButtonVisible={false}
                        isFiltersVisible={false}
                        isRightButtonVisible={true}
                        leftTextButton="Filtrer les colonnes"
                        rightTextButton="Nouvel"
                        onRightButtonClick={handleAddUser}
                        filters={[]}
                        placeholderText={"Recherche d'utilisateurs"}
                    />
                    <ModalButton
                        headers={USERS_TABLE_HEADERS}
                        visibleColumns={visibleColumns}
                        toggleColumnVisibility={toggleColumnVisibility}
                    />
                </div>

                {/* Composant Tableau */}
                <Table
                    data={paginatedData}
                    keys={USERS_TABLE_KEYS}
                    headers={USERS_TABLE_HEADERS}
                    sortableCols={sortableColumns}
                    onSort={(column, order) => handleSortData(column, order, handleSort)}
                    isPagination
                    pagination={{
                        currentPage,
                        totalPages,
                        onPageChange: setCurrentPage,
                    }}
                    totalRecords={totalRecords}
                    onAdd={() => console.log("Nouveau utilisateur")}
                    visibleColumns={visibleColumns}
                    renderers={renderers}
                />

                {/* Modale d'Importation CSV */}
                <DragAndDropModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    title={"Importation des collaborateurs"}
                    subtitle={"Veuillez importer la liste des collaborateurs"}
                    actions={[
                        {label: "Annuler", onClick: closeModal, className: "border"},
                        {
                            label: "Enregistrer",
                            onClick: () => handleSaveCsv(closeModal), // Appel du hook de sauvegarde, avec un callback pour fermer la modale
                            className: "bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd text-white",
                            disabled: isCsvLoading, // Désactiver pendant le chargement
                        },
                    ]}
                    handleFileChange={handleCsvFileChange}
                    icon={undefined}
                    children={undefined}
                />
            </div>
        </ProtectedRoute>
    );
};

export default User;