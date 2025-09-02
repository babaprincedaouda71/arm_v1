// src/pages/admin/User/index.tsx - Version complète

import React, {useCallback, useMemo, useState, useEffect} from "react";
import useSWR from "swr";

// Composants globaux
import Table from "@/components/Tables/Table/index";
import ModalButton from "@/components/ModalButton";
import SearchFilterAddBar from "@/components/SearchFilterAddBar";
import ImportExportButtons from "@/components/ImportExportButtons";
import DragAndDropModal from "@/components/DragAndDropModal";
import ProtectedRoute from "@/components/ProtectedRoute";
import StatusRenderer from "@/components/Tables/StatusRenderer";
import DynamicActionsRenderer from "@/components/Tables/DynamicActionsRenderer";
import GroupeRenderer from "@/components/Tables/GroupeRenderer";
import ManagerRenderer from "@/components/Tables/ManagerRenderer";

// Hooks personnalisés
import useTable from "@/hooks/useTable";
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";
import {useCsvImport} from "@/hooks/users/useCsvImport";
import {useTableSelection} from "@/hooks/users/useTableSelection";
import {usePermissions} from "@/contexts/PermissionContext";

// Types de données
import {GroupsProps, UserProps} from "@/types/dataTypes";
import {UserRole} from "@/contexts/AuthContext";

// Configurations
import {GROUPS_URLS, USERS_URLS} from "@/config/urls";
import {
    USERS_DEFAULT_VISIBLE_COLUMNS,
    USERS_RECORDS_PER_PAGE,
    USERS_TABLE_HEADERS,
    USERS_TABLE_KEYS
} from "@/config/users/usersTableConfig";
import {groupeConfig, statusConfig} from "@/config/tableConfig";
import {USERS_MODULE_URL} from "@/config/internal-url";

// Services et Utilitaires
import {fetcher} from "@/services/api";
import {exportToCSV} from "@/services/csvService";
import {handleSort} from "@/utils/sortUtils";

const User = (): JSX.Element => {
    // États locaux
    const [isModalOpen, setModalOpen] = useState(false);
    const [permissionError, setPermissionError] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState("");

    // Hook de permissions
    const { hasPermission, loading: permissionsLoading, loadModulePermissions } = usePermissions();

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
    const {data: userData, isLoading: userDataLoading} = useSWR<UserProps[]>(USERS_URLS.mutate, fetcher);
    const {data: groupsData} = useSWR<GroupsProps[]>(GROUPS_URLS.mutate, fetcher);

    // Charger les permissions du module users au montage
    useEffect(() => {
        loadModulePermissions('users');
    }, [loadModulePermissions]);

    // Vérification des permissions spécifiques
    const canView = hasPermission('users', 'view');
    const canCreate = hasPermission('users', 'create');
    const canEdit = hasPermission('users', 'edit');
    const canDelete = hasPermission('users', 'delete');
    const canExport = hasPermission('users', 'export');
    const canViewDetails = hasPermission('users', 'view_details');

    // Filtrer les données en fonction de la recherche
    const filteredData = useMemo(() => {
        if (!userData) return [];
        if (!searchValue.trim()) return userData;

        return userData.filter(user =>
            user.firstName?.toLowerCase().includes(searchValue.toLowerCase()) ||
            user.lastName?.toLowerCase().includes(searchValue.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
            user.role?.toLowerCase().includes(searchValue.toLowerCase())
        );
    }, [userData, searchValue]);

    // Si l'utilisateur n'a pas le droit de voir la liste, afficher un message d'erreur
    if (!permissionsLoading && !canView) {
        return (
            <ProtectedRoute>
                <div className="bg-white rounded-lg p-8 text-center">
                    <div className="mb-4">
                        <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Accès refusé</h3>
                    <p className="text-gray-500">Vous n'avez pas les permissions nécessaires pour voir la liste des utilisateurs.</p>
                </div>
            </ProtectedRoute>
        );
    }

    // Récupération des managers et admins avec vérification des permissions
    const managers = useMemo(() => {
        return (userData || []).filter(user => (user.role === "Manager"));
    }, [userData]);

    const admins = useMemo(() => {
        return (userData || []).filter(user => user.role === "Admin");
    }, [userData]);

    // Mémorisation des données pour éviter les re-calculs inutiles
    const memoizedUserData = useMemo(() => filteredData || [], [filteredData]);
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

    // Création d'adminOptions
    const adminOptions = useMemo(() => {
        return admins.map(admin => ({
            value: admin.id,
            label: `${admin.firstName} ${admin.lastName}`,
        })) || [];
    }, [admins]);

    // Logique de navigation spécifique au composant avec vérification des permissions
    const handleAddUser = useCallback((): void => {
        if (!canCreate) {
            setPermissionError("Vous n'avez pas la permission de créer des utilisateurs.");
            return;
        }
        navigateTo("/User/addUser");
    }, [navigateTo, canCreate]);

    const handleFullNameClick = useCallback(
        (_: string, row: UserProps): void => {
            if (!canViewDetails) {
                setPermissionError("Vous n'avez pas la permission de voir les détails des utilisateurs.");
                return;
            }
            if (row.lastName) {
                navigateTo("/User/user", {
                    query: {id: row.id}
                });
            }
        },
        [navigateTo, canViewDetails]
    );

    // Gestion de la recherche
    const handleSearchChange = useCallback((value: string) => {
        setSearchValue(value);
    }, []);

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

    // Filtrer les actions selon les permissions
    const getAvailableActions = useCallback(() => {
        const actions = [];

        if (canViewDetails) {
            actions.push('view');
        }

        if (canEdit) {
            actions.push('edit');
        }

        if (canDelete) {
            actions.push('delete');
        }

        return actions;
    }, [canEdit, canDelete, canViewDetails]);

    // Renderers pour les colonnes du tableau avec permissions
    const renderers = {
        selection: useCallback((_: string, row: UserProps) => (
            <div className="flex justify-center items-center">
                <input
                    type="checkbox"
                    className="h-5 w-5 accent-primary"
                    checked={isRowSelected(row.id)}
                    onChange={(e) => handleRowSelection(row.id, e.target.checked)}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Sélectionner ${row.firstName + ' ' + row.lastName}`}
                    disabled={!canEdit}
                />
            </div>
        ), [isRowSelected, handleRowSelection, canEdit]),

        lastName: useCallback((value: string, row: UserProps) => (
            <div
                onClick={canViewDetails ? () => handleFullNameClick(value, row) : undefined}
                className={canViewDetails ? "hover:underline cursor-pointer" : "text-gray-500"}
                title={!canViewDetails ? "Vous n'avez pas l'autorisation de voir les détails" : undefined}
            >
                {value}
            </div>
        ), [handleFullNameClick, canViewDetails]),

        role: useCallback((value: any, row: UserProps) => (
            <GroupeRenderer
                value={value}
                groupeConfig={groupeConfig}
                row={row}
                groupeOptions={canEdit ? groupeOptions : []}
                readOnly={!canEdit}
            />
        ), [groupeOptions, canEdit]),

        manager: useCallback((value: any, row: UserProps) => {
            // Déterminer les options selon le rôle et les permissions
            const getManagerOptions = () => {
                if (!canEdit) return [];

                if (row.role === "Manager" && adminOptions) {
                    return adminOptions;
                } else if (row.role === "Admin") {
                    return [];
                } else {
                    return [...(managerOptions || []), ...(adminOptions || [])];
                }
            };

            const options = getManagerOptions();

            if (row.role === "Admin") {
                return <div>N/A</div>;
            }

            return (
                <ManagerRenderer
                    value={value}
                    row={row}
                    managerOptions={options}
                    readOnly={!canEdit}
                />
            );
        }, [managerOptions, adminOptions, canEdit]),

        status: useCallback((value: string, row: UserProps) => (
            <StatusRenderer
                value={value}
                groupeConfig={statusConfig}
                row={row}
                statusOptions={canEdit ? ["Actif", "Inactif", "Suspendu", "Bloqué"] : []}
                apiUrl={USERS_URLS.updateStatus}
                mutateUrl={USERS_URLS.mutate}
                readOnly={!canEdit}
            />
        ), [canEdit]),

        actions: useCallback((_: any, row: UserProps) => (
            <DynamicActionsRenderer
                actions={getAvailableActions()}
                row={row}
                isSelected={isRowSelected(row.id)}
                deleteUrl={USERS_URLS.delete}
                viewUrl={buildRoleBasedPath(`${USERS_MODULE_URL.user}`)}
                editUrl={buildRoleBasedPath(`${USERS_MODULE_URL.edit}`)}
                mutateUrl={USERS_URLS.mutate}
                confirmMessage={`Êtes-vous sûr de vouloir supprimer l'utilisateur ${row.firstName} ${row.lastName} ?`}
                disabledActions={{
                    view: !canViewDetails,
                    edit: !canEdit,
                    delete: !canDelete
                }}
            />
        ), [isRowSelected, buildRoleBasedPath, getAvailableActions, canViewDetails, canEdit, canDelete]),
    };

    // Fonctions pour la modale d'import CSV avec vérification des permissions
    const openModal = (): void => {
        if (!canCreate) {
            setPermissionError("Vous n'avez pas la permission d'importer des utilisateurs.");
            return;
        }
        setModalOpen(true);
    };

    const closeModal = (): void => {
        resetCsvImport();
        setModalOpen(false);
        setPermissionError(null);
    };

    // Gestion de l'export CSV avec vérification des permissions
    const handleExport = useCallback(async (): Promise<void> => {
        if (!canExport) {
            setPermissionError("Vous n'avez pas la permission d'exporter la liste des utilisateurs.");
            return;
        }

        if (!userData) {
            console.warn("Aucune donnée utilisateur à exporter.");
            return;
        }
        exportToCSV(userData, "users.csv");
    }, [userData, canExport]);

    // Affichage du chargement des permissions
    if (permissionsLoading || userDataLoading) {
        return (
            <ProtectedRoute>
                <div className="bg-white rounded-lg p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-gray-500">
                        {permissionsLoading ? "Vérification des permissions..." : "Chargement des données..."}
                    </p>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute requiredRole={UserRole.Admin}>
            <div className="bg-white rounded-lg">
                {/* Message d'erreur de permission */}
                {permissionError && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm">{permissionError}</p>
                            </div>
                            <div className="ml-auto pl-3">
                                <div className="-mx-1.5 -my-1.5">
                                    <button
                                        onClick={() => setPermissionError(null)}
                                        className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100"
                                    >
                                        <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Boutons d'Importation et d'Exportation */}
                {(canCreate || canExport) && (
                    <div className="rounded-t-lg p-6 bg-white md:mx-auto">
                        <ImportExportButtons
                            onImport={canCreate ? openModal : undefined}
                            onExport={canExport ? handleExport : undefined}
                        />
                    </div>
                )}

                {/* Barre de Recherche et de Filtres */}
                <div className="flex items-start gap-2 md:gap-8 mt-4">
                    <SearchFilterAddBar
                        isLeftButtonVisible={false}
                        isFiltersVisible={false}
                        isRightButtonVisible={canCreate}
                        leftTextButton="Filtrer les colonnes"
                        rightTextButton="Nouvel"
                        onRightButtonClick={handleAddUser}
                        filters={[]}
                        placeholderText={"Recherche d'utilisateurs"}
                        searchValue={searchValue}
                        onSearchChange={handleSearchChange}
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
                    loading={userDataLoading}
                />

                {/* Modale d'Importation CSV */}
                {canCreate && (
                    <DragAndDropModal
                        isOpen={isModalOpen}
                        onClose={closeModal}
                        title={"Importation des collaborateurs"}
                        subtitle={"Veuillez importer la liste des collaborateurs"}
                        actions={[
                            {label: "Annuler", onClick: closeModal, className: "border"},
                            {
                                label: isCsvLoading ? "Importation..." : "Enregistrer",
                                onClick: () => handleSaveCsv(closeModal),
                                className: "bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd text-white",
                                disabled: isCsvLoading,
                            },
                        ]}
                        handleFileChange={handleCsvFileChange}
                        icon={undefined}
                        children={undefined}
                    />
                )}

                {/* Message d'erreur CSV */}
                {csvErrorMessage && (
                    <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-600 px-4 py-3 rounded-md">
                        <p className="text-sm">{csvErrorMessage}</p>
                    </div>
                )}

                {/* État vide */}
                {!userDataLoading && (!userData || userData.length === 0) && (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun utilisateur</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Commencez par créer un utilisateur ou importer une liste.
                        </p>
                        {canCreate && (
                            <div className="mt-6">
                                <button
                                    onClick={handleAddUser}
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
                                >
                                    Créer un utilisateur
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
};

export default User;