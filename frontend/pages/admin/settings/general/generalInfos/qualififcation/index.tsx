import React, {useCallback, useMemo, useState} from 'react';
import useSWR from "swr";
import {QualificationProps} from "@/types/dataTypes";
import {QUALIFICATION_URLS} from "@/config/urls";
import {fetcher} from "@/services/api";
import useTable from "@/hooks/useTable";
import DynamicActionsRenderer from "@/components/Tables/DynamicActionsRenderer";
import ProtectedRoute from "@/components/ProtectedRoute";
import Table from "@/components/Tables/Table/index";
import {handleSort} from "@/utils/sortUtils";
import Modal from "@/components/Modal";
import InputField from "@/components/FormComponents/InputField";
import CustomSelect from "@/components/FormComponents/CustomSelect";
import SearchFilterAddBar from "@/components/SearchFilterAddBar";
import ModalButton from "@/components/ModalButton"; // Importez le composant CustomSelect

const TABLE_HEADERS = ['Code', 'Type de qualification', 'Validité', 'Rappel', 'Actions'];
const TABLE_KEYS = ['code', 'type', 'validity', 'reminder', 'actions'];

const ACTIONS_TO_SHOW = ['edit', 'delete'];

const RECORDS_PER_PAGE = 10;

const Qualification = () => {
    const {data: qualificationData, mutate} = useSWR<QualificationProps[]>(
        QUALIFICATION_URLS.mutate,
        fetcher
    );

    const [isEditMode, setIsEditMode] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState({
        id: null,
        code: '',
        type: '',
        validityNumber: '', // Nouveau champ pour le nombre de validité
        validityUnit: 'ANNEE', // Nouveau champ pour l'unité de validité (Année/Mois)
        reminderNumber: '', // Nouveau champ pour le nombre de rappel
        reminderUnit: 'MOIS', // Nouveau champ pour l'unité de rappel (Mois/Jour)
    });

    const openModal = () => {
        setIsEditMode(false);
        setFormData({
            id: null,
            code: '',
            type: '',
            validityNumber: '',
            validityUnit: 'Ans',
            reminderNumber: '',
            reminderUnit: 'Mois',
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        try {
            setErrors({});
            setModalOpen(false);
            setFormData({
                id: null,
                code: '',
                type: '',
                validityNumber: '',
                validityUnit: 'Ans',
                reminderNumber: '',
                reminderUnit: 'Mois',
            });
            setIsEditMode(false);
        } catch (error) {
            console.error('Erreur lors de la fermeture du modal:', error);
        }
    };

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData((prevFormData) => ({...prevFormData, [name]: value}));
        // Clear error when field is updated
        if (errors[name]) {
            setErrors(prev => ({...prev, [name]: undefined}));
        }
    }, [errors]);

    const handleSelectChange = useCallback((e: { name: string; value: string }) => {
        const {name, value} = e;
        setFormData((prevFormData) => ({...prevFormData, [name]: value}));
        // Clear error when field is updated
        if (errors[name]) {
            setErrors(prev => ({...prev, [name]: undefined}));
        }
    }, [errors]);

    const handleSubmit = async () => {
        const newErrors: Record<string, string> = {};

        if (!formData.code.trim()) {
            newErrors.code = 'Le code est requis';
        }

        if (!formData.type.trim()) {
            newErrors.type = 'Le type est requis';
        }

        if (formData.validityNumber === undefined || formData.validityNumber === null || String(formData.validityNumber).trim() === "") {
            newErrors.validityNumber = 'Le nombre de validité est requis';
        }

        if (formData.reminderNumber === undefined || formData.reminderNumber === null || String(formData.reminderNumber).trim() === "") {
            newErrors.reminderNumber = 'Le nombre de rappel est requis';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Préparation des données pour l'API (vous devrez peut-être ajuster cela en fonction de votre backend)
        const submissionData = {
            ...formData,
            // validity: `${formData.validityNumber} ${formData.validityUnit}`,
            // reminder: `${formData.reminderNumber} ${formData.reminderUnit}`,
        };

        try {
            const url = isEditMode
                ? `${QUALIFICATION_URLS.edit}/${formData.id}`
                : QUALIFICATION_URLS.add;
            const method = isEditMode ? 'PUT' : 'POST';
            const result = await fetch(url, {
                method: method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData),
            });

            if (!result.ok) {
                const errorData = await result.json();
                setErrors(errorData.message || "Erreur lors de l'ajout de la qualification");
                return;
            }

            const json = await result.json();
            console.log('Success : ', json);
            await mutate();
        } catch (error) {
            console.error('Erreur:', error);
        }

        console.log(submissionData);
        closeModal();
    };

    const handleEditQualification = (row) => {
        // // Ici, vous devrez probablement parser les chaînes 'validity' et 'reminder'
        // // pour extraire le nombre et l'unité et les affecter à formData.
        // const [validityNumber, ...validityUnitParts] = row.validity.split(' ');
        // const validityUnit = validityUnitParts.join(' ') || 'Année'; // Fallback en cas de problème de parsing
        //
        // const [reminderNumber, ...reminderUnitParts] = row.reminder.split(' ');
        // const reminderUnit = reminderUnitParts.join(' ') || 'Mois'; // Fallback

        setFormData({
            id: row.id,
            code: row.code,
            type: row.type,
            validityNumber: row.validityNumber || '',
            validityUnit: row.validityUnit,
            reminderNumber: row.reminderNumber || '',
            reminderUnit: row.reminderUnit,
        });
        setIsEditMode(true);
        setModalOpen(true);
    };

    const [searchValue, setSearchValue] = useState("");
    const filteredData = useMemo(() => {
        if (!qualificationData) return [];
        if (!searchValue.trim()) return qualificationData;

        return qualificationData.filter(qualification =>
            qualification.type.toLowerCase().includes(searchValue.toLowerCase())
        );
    }, [qualificationData, searchValue]);

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
        validity: (_: string, row: QualificationProps) => (
            <div
            >
                {row.validityNumber} {row.validityUnit}
            </div>
        ),
        reminder: (_: string, row: QualificationProps) => (
            <div
            >
                {row.reminderNumber} {row.reminderUnit}
            </div>
        ),
        actions: (_: any, row: QualificationProps) => (
            <DynamicActionsRenderer
                actions={ACTIONS_TO_SHOW}
                row={row}
                deleteUrl={QUALIFICATION_URLS.delete}
                viewUrl={QUALIFICATION_URLS.view}
                mutateUrl={QUALIFICATION_URLS.mutate}
                confirmMessage={`Êtes-vous sûr de vouloir supprimer la qualification ${row.type}  ?`}
                customEditHandler={() => handleEditQualification(row)}
            />
        ),
    };

    return (
        <ProtectedRoute>
            <div>
                {/* ... (SearchFilterAddBar et ModalButton restent inchangés) */}
                <div className="flex items-start gap-2 md:gap-8">
                    <SearchFilterAddBar
                        isLeftButtonVisible={false}
                        isFiltersVisible={false}
                        isRightButtonVisible={true}
                        leftTextButton="Filtrer les colonnes"
                        rightTextButton="Nouveau"
                        onRightButtonClick={openModal}
                        filters={[]}
                        placeholderText={'Recherche de domaines'}
                        searchValue={searchValue}
                        onSearchChange={handleSearchChange}
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
                    isPagination={false}
                    pagination={{
                        currentPage,
                        totalPages,
                        onPageChange: setCurrentPage,
                    }}
                    totalRecords={totalRecords}
                    loading={false}
                    onAdd={() => console.log('Nouveau')}
                    visibleColumns={visibleColumns}
                    renderers={renderers}
                />

                {/* Add Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    title={
                        isEditMode
                            ? "Modification de la qualification"
                            : "Création d'une nouvelle qualification"
                    }
                    subtitle={'Veuillez remplir les champs ci-dessous'}
                    actions={[
                        {label: 'Annuler', onClick: closeModal, className: 'border'},
                        {
                            label: 'Enregistrer',
                            onClick: handleSubmit,
                            className:
                                'bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd text-white',
                        },
                    ]}
                    icon={undefined}
                >
                    <div className="flex flex-col space-y-4">
                        <InputField
                            name="code"
                            label="Code"
                            className=""
                            value={formData.code}
                            inputClassName="focus:outline-none focus:ring-2 focus:ring-primary"
                            onChange={handleChange}
                            error={errors.code}
                        />
                        <InputField
                            name="type"
                            label="Type de qualification"
                            className=""
                            value={formData.type}
                            inputClassName="focus:outline-none focus:ring-2 focus:ring-primary"
                            onChange={handleChange}
                            error={errors.type}
                        />
                        <div className="flex items-center space-x-2">
                            <div className="flex-1">
                                <InputField
                                    name="validityNumber"
                                    label="Validité"
                                    className=""
                                    type="number"
                                    value={formData.validityNumber}
                                    inputClassName="focus:outline-none focus:ring-2 focus:ring-primary"
                                    onChange={handleChange}
                                    error={errors.validityNumber}
                                />
                            </div>
                            <div className="flex-1">
                                <CustomSelect
                                    name="validityUnit"
                                    label=" " // Pas de label ici car il est déjà dans l'InputField
                                    options={['Ans', 'Mois']}
                                    value={formData.validityUnit}
                                    onChange={handleSelectChange}
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="flex-1">
                                <InputField
                                    name="reminderNumber"
                                    label="Rappel"
                                    className=""
                                    type="number"
                                    value={formData.reminderNumber}
                                    inputClassName="focus:outline-none focus:ring-2 focus:ring-primary"
                                    onChange={handleChange}
                                    error={errors.reminderNumber}
                                />
                            </div>
                            <div className="flex-1">
                                <CustomSelect
                                    name="reminderUnit"
                                    label=" " // Pas de label ici
                                    options={['Mois', 'Jour']}
                                    value={formData.reminderUnit}
                                    onChange={handleSelectChange}
                                />
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </ProtectedRoute>
    );
};

export default Qualification;