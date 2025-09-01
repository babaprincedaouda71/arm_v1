import React, {useCallback, useMemo, useState} from 'react'
import useSWR from "swr";
import {fetcher} from "@/services/api";
import {DomainProps} from "@/types/dataTypes";
import {DOMAIN_URLS} from "@/config/urls";
import useTable from "@/hooks/useTable";
import DynamicActionsRenderer from "@/components/Tables/DynamicActionsRenderer";
import SearchFilterAddBar from "@/components/SearchFilterAddBar";
import ModalButton from "@/components/ModalButton";
import Table from "@/components/Tables/Table/index";
import {handleSort} from "@/utils/sortUtils";
import Modal from "@/components/Modal";
import InputField from "@/components/FormComponents/InputField";
import ProtectedRoute from "@/components/ProtectedRoute";

const TABLE_HEADERS = ['Code', 'Nom du domain', 'Actions'];
const TABLE_KEYS = ['code', 'name', 'actions'];

const ACTIONS_TO_SHOW = ['edit', 'delete'];

const RECORDS_PER_PAGE = 10;

const Domain = () => {
    const {data: domainData, mutate} = useSWR<DomainProps[]>(
        DOMAIN_URLS.mutate,
        fetcher
    );

    const [isEditMode, setIsEditMode] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState({
        id: null,
        code: '',
        name: '',
    });

    const openModal = () => {
        setIsEditMode(false);
        setFormData({
            id: null,
            code: '',
            name: '',
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        // Assurons-nous que cette fonction ne cause pas d'erreurs
        try {
            setErrors({});
            setModalOpen(false);
            setFormData({
                id: null,
                code: '',
                name: '',
            });
            setIsEditMode(false);
        } catch (error) {
            console.error('Erreur lors de la fermeture du modal:', error);
        }
    };

    /******* Start Add Domain ******/
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const {name, value} = e.target;
            setFormData((prevFormData) => ({...prevFormData, [name]: value}));
            // Clear error when field is updated
            if (errors[name]) {
                setErrors((prev) => ({...prev, [name]: undefined}));
            }
        },
        [errors]
    );

    const handleSubmit = async () => {
        // Basic validation example
        const newErrors: Record<string, string> = {};

        if (!formData.code.trim()) {
            newErrors.code = 'Le code est requis';
        }

        if (!formData.name.trim()) {
            newErrors.name = 'Le nom est requise';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Création d'une copie des données pour la soumission
        const submissionData = {...formData};

        // Proceed with form submission
        try {
            const url = isEditMode
                ? `${DOMAIN_URLS.edit}/${formData.id}`
                : DOMAIN_URLS.add;
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
                setErrors(errorData.message || "Erreur lors de l'ajout du site");
                return;
            }

            const json = await result.json();
            console.log('Success : ', json);
            await mutate(); // Rafraîchir les données après un ajout réussi
        } catch (error) {
            console.error('Erreur:', error);
        }

        console.log(submissionData);

        closeModal();
    };
    /******* End Add Domain ******/

    /***** Start Edit Domain ******/
    const handleEditDomain = (row) => {
        setFormData({
            id: row.id,
            code: row.code,
            name: row.name,
        });
        setIsEditMode(true);
        setModalOpen(true);
    };
    /***** End Edit Department ******/

        // Filtrer les données en fonction de la recherche
    const [searchValue, setSearchValue] = useState("");
    const filteredData = useMemo(() => {
        if (!domainData) return [];
        if (!searchValue.trim()) return domainData;

        return domainData.filter(domain =>
            domain.name.toLowerCase().includes(searchValue.toLowerCase())
        );
    }, [domainData, searchValue]);

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


    /***** Start Recherche ******/
    const handleSearchChange = useCallback((value: string) => {
        setSearchValue(value);
        // Réinitialiser la pagination à la première page lorsque la recherche change
        setCurrentPage(1);
    }, [setCurrentPage]);

    const renderers = {
        actions: (_: any, row: DomainProps) => (
            <DynamicActionsRenderer
                actions={ACTIONS_TO_SHOW}
                row={row}
                deleteUrl={DOMAIN_URLS.delete}
                viewUrl={DOMAIN_URLS.view}
                mutateUrl={DOMAIN_URLS.mutate}
                confirmMessage={`Êtes-vous sûr de vouloir supprimer le site ${row.name}  ?`}
                customEditHandler={() => handleEditDomain(row)}
            />
        ),
    };
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
                            ? "Modification d'un domaine"
                            : "Création d'un nouveau domaine"
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
                            name="name"
                            label="Nom du domaine"
                            className=""
                            value={formData.name}
                            inputClassName="focus:outline-none focus:ring-2 focus:ring-primary"
                            onChange={handleChange}
                            error={errors.name}
                        />
                    </div>
                </Modal>
            </div>
        </ProtectedRoute>
    )
}

export default Domain