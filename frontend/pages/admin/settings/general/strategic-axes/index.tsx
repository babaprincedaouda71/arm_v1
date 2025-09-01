import React, {useCallback, useState} from 'react'
import StrategicAxesSection from "@/components/StrategicAxes/StractegicAxesSection/inde";
import PlusIcon from "@/components/Svgs/PlusIcon";
import InputField from "@/components/FormComponents/InputField";
import Modal from "@/components/Modal";
import CustomSelect from "@/components/FormComponents/CustomSelect";
import {STRATEGIC_AXES_URLS} from "@/config/urls";
import useSWR from "swr";
import {StrategicAxesSectionProps} from "@/types/dataTypes";
import {fetcher} from "@/services/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import {useAuth} from "@/contexts/AuthContext";
import {ConfirmModal} from "@/components/Tables/ConfirmModal";

const StrategicAxes = () => {
    const {loading} = useAuth()
    const {
        data: strategicAxesData,
        mutate
    } = useSWR<StrategicAxesSectionProps[]>(STRATEGIC_AXES_URLS.fetchAllByYear, fetcher);
    const [openSectionIndex, setOpenSectionIndex] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({title: "", id: null, year: ""});
    const [isEditMode, setIsEditMode] = useState(false);
    const [errors, setErrors] = useState<string | null>(null);

    // États pour la suppression
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [axeToDelete, setAxeToDelete] = useState<{ id: number | null, type: string } | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData((prevFormData) => ({...prevFormData, [name]: value}));
    }, []);

    const openModal = () => {
        setIsEditMode(false);
        setFormData({title: "", id: null, year: ""});
        setModalOpen(true);
    };

    const closeModal = () => {
        setErrors(null);
        setModalOpen(false);
        setFormData({title: "", id: null, year: ""});
        setIsEditMode(false);
    };

    const handleSave = useCallback(async () => {
        if (!formData.title.trim()) {
            setErrors("Le nom de l'axe est obligatoire")
            return;
        }

        try {
            const url = isEditMode ?
                `${STRATEGIC_AXES_URLS.edit}/${formData.id}` :
                STRATEGIC_AXES_URLS.add;
            const method = isEditMode ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({title: formData.title, year: formData.year})
            })

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Erreur lors de ${isEditMode ? "la modification" : "l'ajout"} de l'axe stratégique`);
            }

            await mutate();
            closeModal();
        } catch (error) {
            setErrors(error.message)
        }
        console.log(formData)
    }, [formData, mutate, isEditMode]);

    const handleEditStrategicAxes = (axeToEdit) => {
        setFormData({
            title: axeToEdit.type,
            id: axeToEdit.id,
            year: axeToEdit.year ? axeToEdit.year.toString() : ""
        });
        setIsEditMode(true);
        setModalOpen(true);
    };

    // Fonction pour ouvrir le modal de confirmation de suppression
    const handleDeleteRequest = (axe: { id: number | null; type: string }) => {
        setAxeToDelete(axe);
        setDeleteError(null);
        setDeleteModalOpen(true);
    };

    // Fonction pour effectuer la suppression
    const handleDeleteConfirm = async () => {
        if (!axeToDelete || axeToDelete.id === null) {
            setDeleteError("Impossible de supprimer cet axe stratégique");
            return;
        }

        try {
            const response = await fetch(`${STRATEGIC_AXES_URLS.delete}/${axeToDelete.id}`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erreur lors de la suppression de l'axe stratégique");
            }

            await mutate();
            setDeleteModalOpen(false);
            setAxeToDelete(null);
        } catch (error) {
            setDeleteError(error.message);
        }
    };

    // Fonction pour fermer le modal de suppression
    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setAxeToDelete(null);
        setDeleteError(null);
    };

    const handleSectionToggle = (index) => {
        setOpenSectionIndex(openSectionIndex === index ? null : index);
    };
    // Fonction pour gérer les changements dans les champs du formulaire
    const handleChangeCustomSelect = (event: { name: string; value: string }) => {
        const {name, value} = event;
        // Mettre à jour l'état formData avec la nouvelle valeur
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    return (
        <ProtectedRoute>
            <div className={"p-6 mx-auto bg-white rounded-lg flex flex-col"}>
                <div className="flex justify-end mb-4"> {/* Ajout d'un conteneur flex et justify-end */}
                    <button
                        className="flex items-center font-title justify-center text-white bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd rounded-lg p-2 text-sm md:text-base md:px-4 md:py-3"
                        onClick={openModal}
                    >
                        <PlusIcon/>
                        <span className="hidden sm:block">Nouvel</span>
                    </button>
                </div>
                {loading ? (
                        <div>Chargement des axes stratégiques...</div> // Ou un autre indicateur de chargement
                    )
                    : strategicAxesData ? (
                        strategicAxesData.map((section, index) => (
                            <StrategicAxesSection
                                key={index}
                                title={section.title}
                                strategicAxes={section.strategicAxes}
                                isOpen={openSectionIndex === index}
                                onToggle={() => handleSectionToggle(index)}
                                onEditStrategicAxes={handleEditStrategicAxes}
                                onDeleteStrategicAxes={handleDeleteRequest}

                            />
                        ))
                    ) : null}
            </div>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={isEditMode ? "Modification d'un axe stratégique" : "Création d'un nouvel axe stratégique"}
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
                <div className="flex flex-col space-y-4"> {/* Modification ici : flex-col et space-y-4 */}
                    <CustomSelect
                        label="Année"
                        name="year"
                        options={["2027", "2026", "2025", "2024", "2023", "2022"]}
                        onChange={handleChangeCustomSelect}
                        value={formData.year || ''}
                    />
                    <InputField
                        name="title"
                        label="Axe stratégique"
                        className=""
                        value={formData.title}
                        inputClassName="focus:outline-none focus:ring-2 focus:ring-primary"
                        onChange={handleChange}
                    />
                </div>
            </Modal>

            {/* Modal de confirmation de suppression */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDeleteConfirm}
                title="Confirmation de suppression"
                message={`Êtes-vous sûr de vouloir supprimer l'axe stratégique "${axeToDelete?.title}" ?`}
                errors={deleteError}
            />
        </ProtectedRoute>
    )
}

export default StrategicAxes