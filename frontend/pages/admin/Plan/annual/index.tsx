// src/pages/AnnualPlanPage.tsx - Version simplifiée
import React, {ChangeEvent, useCallback, useMemo, useState} from "react";
import Table from "@/components/Tables/Table/index";
import ModalButton from "@/components/ModalButton";
import SearchFilterAddBar from "@/components/SearchFilterAddBar";
import Modal from "@/components/Modal";
import {handleSort} from "@/utils/sortUtils";
import useTable from "@/hooks/useTable";
import CloseCircleIcon from "@/components/Svgs/CloseCircleIcon";
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";

import {
    PLANS_DEFAULT_VISIBLE_COLUMNS,
    PLANS_RECORDS_PER_PAGE,
    PLANS_TABLE_HEADERS,
    PLANS_TABLE_KEYS
} from "@/config/plans/plansTableConfig";
import useSWR from "swr";
import {fetcher} from "@/services/api";
import {PlansProps} from "@/types/dataTypes";
import {PLANS_URLS} from "@/config/urls";
import {usePlanTableRenderer} from "@/hooks/plans/usePlanTableRenderers";
import CustomSelect from "@/components/FormComponents/CustomSelect";
import InputField from "@/components/FormComponents/InputField";
import ProtectedRoute from "@/components/ProtectedRoute";
import {UserRole} from "@/contexts/AuthContext";

const AnnualPlanPage = () => {
    const {data: plansData, mutate, error, isLoading} = useSWR<PlansProps[]>(PLANS_URLS.mutate, fetcher);

    const memorizedPlansData = useMemo(() => plansData || [], [plansData])
    const {navigateTo, isCurrentPath, getPathWithoutRolePrefix} = useRoleBasedNavigation();
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
        memorizedPlansData,
        PLANS_TABLE_HEADERS,
        PLANS_TABLE_KEYS,
        PLANS_RECORDS_PER_PAGE,
        PLANS_DEFAULT_VISIBLE_COLUMNS
    );

    const handleTitleClick = useCallback(
        (row: PlansProps): void => {
            if (row.title) {
                navigateTo(`/Plan/annual/${row.title}`, {
                    query: {
                        isOFPPTValidation: row.isOFPPTValidation,
                        planId: row.id,
                    }
                })
            }
        }, [navigateTo])

    // Fonction pour rafraîchir les données (appelée par le composant OFPPTValidationSwitch)
    const handleStatusUpdate = useCallback(async () => {
        await mutate();
    }, [mutate]);

    const renderers = usePlanTableRenderer({
        handleTitleClick,
        onStatusUpdate: handleStatusUpdate,
    });

    const [isModalOpen, setModalOpen] = useState(false);
    const [isCancelModalOpen, setCancelModalOpen] = useState(false);
    const openModal = () => setModalOpen(true);
    const closeModal = () => {
        setModalOpen(false)
        resetForm();
    };
    const closeCancelModal = () => setCancelModalOpen(false);

    const handleSave = async () => {
        // Valider le formulaire avant de sauvegarder
        if (!validateForm()) {
            return; // Arrêter la sauvegarde si la validation échoue
        }

        const budgetValue = parseFloat(formData.estimatedBudget);

        if (isNaN(budgetValue)) {
            alert("Le budget prévisionnel doit être un montant numérique valide.");
            return;
        }

        // Vérification que la date de fin est postérieure à la date de début
        if (formData.startDate && formData.endDate && formData.endDate <= formData.startDate) {
            alert("La date de fin doit être postérieure à la date de début.");
            return;
        }

        // Convertir les valeurs CSF pour correspondre au backend
        const csfValue = formData.csf === "Oui" ? "true" : "false";

        const dataToSend = {
            ...formData,
            csf: csfValue, // Convertir en string boolean
            estimatedBudget: budgetValue,
        };

        try {
            const result = await fetch(PLANS_URLS.add, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend),
            });

            if (!result.ok) {
                const errorData = await result.json().catch(() => null);
                console.error("Erreur de réponse du serveur:", result.status, errorData);
                throw new Error(`Erreur lors de l'enregistrement du plan: ${errorData?.message || result.statusText}`);
            }
            await mutate();
            closeModal();
        } catch (e: any) {
            console.error("Erreur lors de la sauvegarde:", e);
            alert(`Une erreur est survenue : ${e.message}`);
        }
    };

    const handleCancel = () => {
        closeCancelModal();
        setTimeout(() => {
            alert("Plan de formation annulé avec succès !");
        }, 100);
    };

    const [formData, setFormData] = useState({
        csf: "",
        title: "",
        startDate: "",
        endDate: "",
        estimatedBudget: "",
    });

    const resetForm = () => {
        setFormData({
            csf: "",
            title: "",
            startDate: "",
            endDate: "",
            estimatedBudget: "",
        });
        setFormErrors({
            csf: "",
            title: "",
        });
    };

    const [formErrors, setFormErrors] = useState({
        csf: "",
        title: "",
    });

    const validateForm = () => {
        let isValid = true;
        const newErrors = {csf: "", title: ""};

        if (!formData.csf) {
            newErrors.csf = "Le champ CSF est obligatoire.";
            isValid = false;
        }
        if (!formData.title.trim()) {
            newErrors.title = "Le champ Titre est obligatoire.";
            isValid = false;
        }

        setFormErrors(newErrors);
        return isValid;
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;

        setFormData(prev => {
            const newFormData = {...prev, [name]: value};

            if (name === "startDate") {
                if (newFormData.endDate && newFormData.endDate <= value) {
                    newFormData.endDate = "";
                }
            }
            return newFormData;
        });

        if (name === "title" && formErrors.title) {
            setFormErrors(prevErrors => ({...prevErrors, title: ""}));
        }
    };

    const handleChangeCustomSelect = (event: { name: string; value: string }) => {
        const {name, value} = event;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));

        if (name === "csf" && formErrors.csf) {
            setFormErrors(prevErrors => ({...prevErrors, csf: ""}));
        }
    };

    const minEndDate = useMemo(() => {
        if (formData.startDate) {
            const startDateObj = new Date(formData.startDate);
            startDateObj.setDate(startDateObj.getDate() + 1);
            return startDateObj.toISOString().split('T')[0];
        }
        return undefined;
    }, [formData.startDate]);

    return (
        <ProtectedRoute requiredRole={UserRole.Admin}>
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
                        placeholderText={"Recherche de plans"}
                    />
                    <ModalButton
                        headers={PLANS_TABLE_HEADERS}
                        visibleColumns={visibleColumns}
                        toggleColumnVisibility={toggleColumnVisibility}
                    />
                </div>

                <Table
                    data={paginatedData}
                    keys={PLANS_TABLE_KEYS}
                    headers={PLANS_TABLE_HEADERS}
                    sortableCols={sortableColumns}
                    onSort={(column, order) => handleSortData(column, order, handleSort)}
                    isPagination
                    pagination={{
                        currentPage,
                        totalPages,
                        onPageChange: setCurrentPage,
                    }}
                    totalRecords={totalRecords}
                    loading={isLoading}
                    onAdd={() => console.log("Nouveau")}
                    visibleColumns={visibleColumns}
                    renderers={renderers}
                />
            </div>

            {/* Modal pour nouveau plan */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={"Ajout d'un nouveau plan annuel"}
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
                <div className="flex flex-col items-start justify-center space-y-4">
                    <CustomSelect
                        label={"CSF"}
                        name={"csf"}
                        value={formData.csf}
                        onChange={handleChangeCustomSelect}
                        options={["Oui", "Non"]}
                        error={formErrors.csf}
                    />
                    <InputField
                        label={"Titre"}
                        name={"title"}
                        value={formData.title}
                        onChange={handleInputChange}
                        error={formErrors.title}
                    />
                    <InputField
                        label={"Date de début"}
                        name={"startDate"}
                        value={formData.startDate}
                        onChange={handleInputChange}
                        type="date"
                    />
                    <InputField
                        label={"Date de fin"}
                        name={"endDate"}
                        value={formData.endDate}
                        onChange={handleInputChange}
                        type="date"
                        minValue={minEndDate}
                        disabled={!formData.startDate}
                    />
                    <InputField
                        label={"Budget prévisionnel"}
                        name={"estimatedBudget"}
                        value={formData.estimatedBudget}
                        onChange={handleInputChange}
                        type="text"
                    />
                </div>
            </Modal>

            {/* Modal d'annulation */}
            <Modal
                isOpen={isCancelModalOpen}
                onClose={closeCancelModal}
                title={"Annulation"}
                subtitle={"Veuillez confirmer l'annulation de la session de formation"}
                actions={[
                    {label: "Non", onClick: closeCancelModal, className: "border"},
                    {
                        label: "Oui",
                        onClick: handleCancel,
                        className: "bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd text-white",
                    },
                ]}
                icon={<CloseCircleIcon/>}
            >
                <div className="flex flex-col justify-center space-y-2">
                    <div className="font-bold text-center">Voulez-vous vraiment annuler l'action de formation?</div>
                </div>
            </Modal>
        </ProtectedRoute>
    );
};

export default AnnualPlanPage;