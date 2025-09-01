import React, {useCallback, useMemo, useState} from 'react'
import ProtectedRoute from "@/components/ProtectedRoute";
import useSWR from "swr";
import {DepartmentProps, SiteProps} from "@/types/dataTypes";
import {DEPARTMENT_URLS, SITE_URLS} from "@/config/urls";
import {fetcher} from "@/services/api";
import useTable from "@/hooks/useTable";
import DynamicActionsRenderer from "@/components/Tables/DynamicActionsRenderer";
import SearchFilterAddBar from "@/components/SearchFilterAddBar";
import ModalButton from "@/components/ModalButton";
import Table from "@/components/Tables/Table/index";
import {handleSort} from "@/utils/sortUtils";
import Modal from "@/components/Modal";
import InputField from "@/components/FormComponents/InputField";
import CustomSelect from '@/components/FormComponents/CustomSelect';
import MultiSelectField from '@/components/FormComponents/MultiselectField';

const TABLE_HEADERS = [
    "Code",
    "Label",
    "Adresse",
    "Ville",
    "Téléphone",
    "Salle de formation",
    "Taille",
    "Départements",
    "Actions",
];
const TABLE_KEYS = [
    "code",
    "label",
    "address",
    "city",
    "phone",
    "trainingRoom",
    "size",
    "departments",
    "actions",
];

const ACTIONS_TO_SHOW = ["edit", "delete"];
const RECORDS_PER_PAGE = 10;

const Site = () => {
    const {data: siteData, mutate} = useSWR<SiteProps[]>(SITE_URLS.mutate, fetcher);
    const {data: departmentData} = useSWR<DepartmentProps[]>(DEPARTMENT_URLS.mutate, fetcher);

    const [isEditMode, setIsEditMode] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState({
        id: null,
        code: "",
        label: "",
        address: "",
        city: "",
        phone: "",
        trainingRoom: "Non",
        size: "",
        departmentIds: [] as string[], // 🆕 Ajout des départements sélectionnés
    });

    // 🆕 Transformer les départements pour le MultiSelectField
    const departmentOptions = useMemo(() => {
        if (!departmentData) return [];
        return departmentData.map(dept => dept.name);
    }, [departmentData]);

    // 🆕 Fonction pour convertir les noms en IDs et vice-versa
    const getDepartmentIdsByNames = useCallback((names: string[]) => {
        if (!departmentData) return [];
        return names.map(name => {
            const dept = departmentData.find(d => d.name === name);
            return dept ? dept.id.toString() : null;
        }).filter(Boolean) as string[];
    }, [departmentData]);

    const getDepartmentNamesByIds = useCallback((ids: string[]) => {
        if (!departmentData) return [];
        return ids.map(id => {
            const dept = departmentData.find(d => d.id.toString() === id);
            return dept ? dept.name : null;
        }).filter(Boolean) as string[];
    }, [departmentData]);

    const openModal = () => {
        setIsEditMode(false);
        setFormData({
            id: null,
            code: "",
            label: "",
            address: "",
            city: "",
            phone: "",
            trainingRoom: "Non",
            size: "",
            departmentIds: [],
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        try {
            setErrors({});
            setModalOpen(false);
            setFormData({
                id: null,
                code: "",
                label: "",
                address: "",
                city: "",
                phone: "",
                trainingRoom: "Non",
                size: "",
                departmentIds: [],
            });
            setIsEditMode(false);
        } catch (error) {
            console.error("Erreur lors de la fermeture du modal:", error);
        }
    };

    // Filtrer les données en fonction de la recherche
    const [searchValue, setSearchValue] = useState("");
    const filteredData = useMemo(() => {
        if (!siteData) return [];
        if (!searchValue.trim()) return siteData;

        return siteData.filter(site =>
            site.label.toLowerCase().includes(searchValue.toLowerCase())
        );
    }, [siteData, searchValue]);

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

    const handleSearchChange = useCallback((value: string) => {
        setSearchValue(value);
        setCurrentPage(1);
    }, [setCurrentPage]);

    const renderers = {
        departments: (_: any, row: SiteProps) => (
            <div className="flex flex-wrap gap-1 max-w-[200px]">
                {row.departmentIds && row.departmentIds.length > 0 ? (
                    getDepartmentNamesByIds(row.departmentIds.map(id => id.toString())).map((name, index) => (
                        <span
                            key={index}
                            className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                        >
                            {name}
                        </span>
                    ))
                ) : (
                    <span className="text-gray-400 text-sm">Aucun département</span>
                )}
            </div>
        ),
        actions: (_: any, row: SiteProps) => (
            <DynamicActionsRenderer
                actions={ACTIONS_TO_SHOW}
                row={row}
                deleteUrl={SITE_URLS.delete}
                viewUrl={SITE_URLS.view}
                mutateUrl={SITE_URLS.mutate}
                confirmMessage={`Êtes-vous sûr de vouloir supprimer le site ${row.label} ?`}
                customEditHandler={() => handleEditSite(row)}
            />
        ),
    };

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData((prevFormData) => ({...prevFormData, [name]: value}));
        if (errors[name]) {
            setErrors(prev => ({...prev, [name]: undefined}));
        }
    }, [errors]);

    const handleSelectChange = useCallback((e: { name: string; value: string }) => {
        const {name, value} = e;
        setFormData((prevFormData) => ({...prevFormData, [name]: value}));
        if (errors[name]) {
            setErrors(prev => ({...prev, [name]: undefined}));
        }

        if (name === "trainingRoom" && value === "Non") {
            setFormData(prevFormData => ({...prevFormData, size: ""}));
        }
    }, [errors]);

    // 🆕 Gestionnaire pour le MultiSelectField
    const handleDepartmentChange = useCallback((selectedNames: string[]) => {
        const selectedIds = getDepartmentIdsByNames(selectedNames);
        setFormData(prevFormData => ({
            ...prevFormData,
            departmentIds: selectedIds
        }));

        if (errors.departmentIds) {
            setErrors(prev => ({...prev, departmentIds: undefined}));
        }
    }, [getDepartmentIdsByNames, errors]);

    const handleSubmit = async () => {
        const newErrors: Record<string, string> = {};

        if (!formData.label.trim()) {
            newErrors.label = "Le label est requis";
        }

        if (!formData.address.trim()) {
            newErrors.address = "L'adresse est requise";
        }

        if (!formData.city.trim()) {
            newErrors.city = "La ville est requise";
        }

        if (formData.trainingRoom === "Oui" && (!formData.size || formData.size === "")) {
            newErrors.size = "La taille est requise pour une salle de formation";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // 🆕 Préparation des données avec les IDs de départements
        const submissionData = {
            ...formData,
            departmentIds: formData.departmentIds.map(id => parseInt(id))
        };

        try {
            const url = isEditMode
                ? `${SITE_URLS.edit}/${formData.id}`
                : SITE_URLS.add;
            const method = isEditMode ? "PUT" : "POST";
            const result = await fetch(url, {
                method: method,
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(submissionData),
            });

            if (!result.ok) {
                const errorData = await result.json();
                setErrors(errorData.message || "Erreur lors de l'ajout du site");
                return;
            }

            const json = await result.json();
            console.log("Success : ", json);
            await mutate();
        } catch (error) {
            console.error("Erreur:", error);
        }

        closeModal();
    };

    const handleEditSite = (row: SiteProps) => {
        setFormData({
            id: row.id,
            code: row.code,
            label: row.label,
            address: row.address,
            city: row.city,
            phone: row.phone,
            trainingRoom: row.trainingRoom,
            size: row.size.toString(),
            departmentIds: row.departmentIds ? row.departmentIds.map(id => id.toString()) : [],
        });
        setIsEditMode(true);
        setModalOpen(true);
    };

    const showSizeField = formData.trainingRoom === "Oui";

    return (
        <ProtectedRoute>
            <div>
                <div className="flex items-start gap-2 md:gap-8">
                    <SearchFilterAddBar
                        isLeftButtonVisible={false}
                        isFiltersVisible={false}
                        isRightButtonVisible={true}
                        leftTextButton="Filtrer les colonnes"
                        rightTextButton="Nouveau"
                        onRightButtonClick={openModal}
                        filters={[]}
                        placeholderText={"Recherche de sites"}
                        searchValue={searchValue}
                        onSearchChange={handleSearchChange}
                    />
                    <ModalButton
                        headers={TABLE_HEADERS}
                        visibleColumns={visibleColumns}
                        toggleColumnVisibility={toggleColumnVisibility}
                    />
                </div>

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
                    loading={false}
                    onAdd={() => console.log("Nouveau")}
                    visibleColumns={visibleColumns}
                    renderers={renderers}
                />

                <Modal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    title={isEditMode ? "Modification d'un site" : "Création d'un nouveau site"}
                    subtitle={"Veuillez remplir les champs ci-dessous"}
                    actions={[
                        {label: "Annuler", onClick: closeModal, className: "border"},
                        {
                            label: "Enregistrer",
                            onClick: handleSubmit,
                            className: "bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd text-white",
                        },
                    ]}
                    icon={undefined}
                >
                    <div className="space-y-6">
                        <div className="border rounded p-4">
                            <div className="bg-gray-100 px-2 py-1 mb-4 font-medium">Site</div>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField
                                        label="Label"
                                        name="label"
                                        value={formData.label}
                                        onChange={handleChange}
                                        error={errors.label}
                                    />
                                    <CustomSelect
                                        label="Salle de formation"
                                        name="trainingRoom"
                                        options={["Oui", "Non"]}
                                        value={formData.trainingRoom}
                                        onChange={handleSelectChange}
                                        error={errors.trainingRoom}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField
                                        label="Adresse"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        error={errors.address}
                                    />
                                    {showSizeField && (
                                        <InputField
                                            label="Taille"
                                            name="size"
                                            value={formData.size}
                                            onChange={handleChange}
                                            error={errors.size}
                                        />
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField
                                        label="Ville"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        error={errors.city}
                                    />
                                    <InputField
                                        label="Téléphone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        error={errors.phone}
                                    />
                                </div>
                                {/* 🆕 Nouveau champ de sélection multiple pour les départements */}
                                <MultiSelectField
                                    label="Départements"
                                    options={departmentOptions}
                                    value={getDepartmentNamesByIds(formData.departmentIds)}
                                    onChange={handleDepartmentChange}
                                    error={errors.departmentIds}
                                />
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </ProtectedRoute>
    )
}

export default Site