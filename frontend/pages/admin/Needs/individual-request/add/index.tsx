import React, {ChangeEvent, useEffect, useMemo, useState} from "react";
import MultiSelectField from "@/components/FormComponents/MultiselectField";
import InputField from "@/components/FormComponents/InputField";
import TextAreaField from "@/components/FormComponents/TextAreaField";
import Modal from "@/components/Modal";
import RadioButton from "@/components/FormComponents/RadioButton";
import FolderIcon from "@/components/Svgs/FolderIcon";
import useSWR from "swr";
import {fetcher} from "@/services/api";
import {DEPARTMENT_URLS, DOMAIN_URLS, SITE_URLS} from "@/config/urls";
import {DepartmentProps, DomainProps, SiteProps} from "@/types/dataTypes";
import {useSiteDepartmentFilter} from "@/hooks/settings/useSiteDepartmentFilter";

interface FormData {
    site: number[];
    domaine: number[];
    nbrDay: string;
    nbrGroup: string;
    qualification: string;
    validity: string;
    objective: string;
    content: string;
    department: number[];
    theme: string;
    type: string;
}

const Index = () => {
    const [formData, setFormData] = useState<FormData>({
        site: [],
        domaine: [],
        nbrDay: "",
        nbrGroup: "",
        qualification: "",
        validity: "",
        objective: "",
        content: "",
        department: [],
        theme: "",
        type: "",
    });

    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");
    const [errors, setErrors] = useState<Partial<Record<keyof FormData | 'destination', string>>>({});

    // 🆕 Fetching des données nécessaires
    const {data: sitesData} = useSWR<SiteProps[]>(SITE_URLS.mutate, fetcher);
    const {data: departmentsData} = useSWR<DepartmentProps[]>(DEPARTMENT_URLS.mutate, fetcher);
    const {data: domainsData} = useSWR<DomainProps[]>(DOMAIN_URLS.mutate, fetcher);

    // 🆕 Utilisation du hook pour le filtrage intelligent des départements
    const {
        departmentOptions,
        getDisplayNamesByIds,
        getIdsByDisplayNames,
        cleanSelectedDepartments,
        hasAvailableDepartments
    } = useSiteDepartmentFilter({
        sitesData,
        departmentsData,
        selectedSiteIds: formData.site
    });

    // 🆕 Nettoyage automatique des départements quand les sites changent
    useEffect(() => {
        if (formData.site.length > 0 && formData.department.length > 0) {
            const cleanedDepartments = cleanSelectedDepartments(formData.department);
            if (cleanedDepartments.length !== formData.department.length) {
                setFormData(prev => ({
                    ...prev,
                    department: cleanedDepartments
                }));
            }
        }
    }, [formData.site, cleanSelectedDepartments, formData.department]);

    // 🆕 Formatage des options pour les MultiSelectField
    const sitesOptionsFormatted = useMemo(() => {
        return sitesData ? sitesData.map(site => ({label: site.label, id: site.id})) : [];
    }, [sitesData]);

    const domainsOptionsFormatted = useMemo(() => {
        return domainsData ? domainsData.map(domain => ({label: domain.name, id: domain.id})) : [];
    }, [domainsData]);

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
        setErrors(prevErrors => ({...prevErrors, [name]: ""}));
    };

    // 🆕 Gestion des changements dans les MultiSelect
    const handleMultiSelectChange = (name: keyof FormData, selectedLabels: string[]) => {
        let selectedIds: number[] = [];

        switch (name) {
            case "site":
                selectedIds = selectedLabels
                    .map(label => sitesData?.find(site => site.label === label)?.id)
                    .filter((id): id is number => id !== undefined);
                break;
            case "department":
                // Utilisation du hook pour convertir les noms d'affichage en IDs
                selectedIds = getIdsByDisplayNames(selectedLabels);
                break;
            case "domaine":
                selectedIds = selectedLabels
                    .map(label => domainsData?.find(domain => domain.name === label)?.id)
                    .filter((id): id is number => id !== undefined);
                break;
            default:
                break;
        }

        setFormData(prev => ({
            ...prev,
            [name]: selectedIds,
        }));
        setErrors(prevErrors => ({...prevErrors, [name]: ""}));
    };

    const openModal = () => {
        // 🆕 Validation basique avant d'ouvrir la modal
        let isValid = true;
        const newErrors: Partial<Record<keyof FormData | 'destination', string>> = {};

        // Exemple de validation - à adapter selon vos besoins
        if (!formData.theme.trim()) {
            newErrors.theme = "Le thème est obligatoire";
            isValid = false;
        }

        if (formData.site.length === 0) {
            newErrors.site = "Au moins un site doit être sélectionné";
            isValid = false;
        }

        setErrors(newErrors);

        if (isValid) {
            setModalOpen(true);
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedOption("");
        setErrors(prevErrors => ({...prevErrors, destination: ""}));
    };

    const handleSave = () => {
        // 🆕 Validation de la destination
        if (!selectedOption) {
            setErrors(prevErrors => ({...prevErrors, destination: "Veuillez sélectionner une destination"}));
            return;
        }

        // 🆕 Préparer les données à envoyer
        const sitesToSend = formData.site.map(id => {
            const site = sitesData?.find(s => s.id === id);
            return site ? {id: site.id, label: site.label} : null;
        }).filter((site): site is { id: number; label: string } => site !== null);

        const departmentsToSend = formData.department.map(id => {
            const dept = departmentsData?.find(d => d.id === id);
            return dept ? {id: dept.id, name: dept.name} : null;
        }).filter((dept): dept is { id: number; name: string } => dept !== null);

        const domainsToSend = formData.domaine.map(id => {
            const domain = domainsData?.find(d => d.id === id);
            return domain ? {id: domain.id, name: domain.name} : null;
        }).filter((domain): domain is { id: number; name: string } => domain !== null);

        const dataToSend = {
            site: sitesToSend,
            department: departmentsToSend,
            domaine: domainsToSend,
            theme: formData.theme,
            nbrDay: parseInt(formData.nbrDay, 10) || 0,
            nbrGroup: parseInt(formData.nbrGroup, 10) || 1,
            type: formData.type,
            qualification: formData.qualification,
            validity: formData.validity,
            objective: formData.objective,
            content: formData.content,
            destination: selectedOption,
        };

        console.log('Données à envoyer:', dataToSend);

        // TODO: Remplacer par l'appel API réel
        closeModal();
        setTimeout(() => {
            alert("Requête enregistrée avec succès !");
        }, 100);
    };

    const handleDestinationChange = (value: string) => {
        setSelectedOption(value);
        setErrors(prevErrors => ({...prevErrors, destination: ""}));
    };

    const options = [
        {
            id: "option1",
            value: "catalogue",
            label: "Enregistrer dans le catalogue interne et le plan de formation",
        },
        {
            id: "option2",
            value: "plan",
            label: "Enregistrer uniquement dans le plan de formation",
        },
    ];

    return (
        <form className="mx-auto bg-white font-title rounded-lg px-6 pb-14 pt-4">
            <div className="grid md:grid-cols-2 gap-y-4 gap-x-8 md:gap-x-16 lg:gap-x-24 mb-4">
                {/* 🆕 Site avec données dynamiques */}
                <MultiSelectField
                    options={sitesOptionsFormatted.map(opt => opt.label)}
                    value={formData.site.map(id => sitesData?.find(s => s.id === id)?.label || '')}
                    onChange={(values) => handleMultiSelectChange("site", values)}
                    label="Site"
                    error={errors.site}
                />

                {/* 🆕 Département avec filtrage intelligent */}
                <div className="relative">
                    <MultiSelectField
                        options={departmentOptions}
                        value={getDisplayNamesByIds(formData.department)}
                        onChange={(values) => handleMultiSelectChange("department", values)}
                        label="Département"
                        error={errors.department}
                    />
                    {/* Indicateur visuel si aucun département disponible */}
                    {formData.site.length > 0 && !hasAvailableDepartments && (
                        <p className="text-sm text-gray-500 mt-1">
                            Aucun département disponible pour les sites sélectionnés
                        </p>
                    )}
                </div>

                {/* 🆕 Domaine avec données dynamiques */}
                <MultiSelectField
                    options={domainsOptionsFormatted.map(opt => opt.label)}
                    value={formData.domaine.map(id => domainsData?.find(d => d.id === id)?.name || '')}
                    onChange={(values) => handleMultiSelectChange("domaine", values)}
                    label="Domaine"
                    error={errors.domaine}
                />

                <InputField
                    label="Thème"
                    name="theme"
                    value={formData.theme}
                    onChange={handleInputChange}
                    error={errors.theme}
                />
                <InputField
                    label="Nbr de jour"
                    name="nbrDay"
                    type="number"
                    value={formData.nbrDay}
                    onChange={handleInputChange}
                    error={errors.nbrDay}
                />
                <InputField
                    label="Type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    error={errors.type}
                />
                <InputField
                    label="Nbr de groupe"
                    name="nbrGroup"
                    type="number"
                    value={formData.nbrGroup}
                    onChange={handleInputChange}
                    error={errors.nbrGroup}
                />
                <InputField
                    label="Qualification"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    error={errors.qualification}
                />
            </div>

            <div className="grid md:grid-cols-2 gap-x-20">
                <div className="col-span-1 grid gap-y-4">
                    <InputField
                        label="Validité"
                        name="validity"
                        type="date"
                        value={formData.validity}
                        onChange={handleInputChange}
                        error={errors.validity}
                    />
                    <TextAreaField
                        label="Objectif"
                        name="objective"
                        value={formData.objective}
                        onChange={handleInputChange}
                        error={errors.objective}
                    />
                    <TextAreaField
                        label="Contenu"
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        error={errors.content}
                    />
                </div>
                <div className="col-span-1"></div>
            </div>

            <div className="mt-5 text-right text-xs md:text-sm lg:text-base">
                <button
                    type="button"
                    className="bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd hover:bg-indigo-700 text-white font-bold p-2 md:p-3 lg:p-4 rounded-xl"
                    onClick={openModal}
                >
                    Enregistrer
                </button>
            </div>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={"Sélection de la destination"}
                subtitle={"Veuillez choisir la destination de ce nouveau besoin"}
                actions={[
                    {label: "Annuler", onClick: closeModal, className: "border"},
                    {
                        label: "Valider",
                        onClick: handleSave,
                        className:
                            "bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd text-white",
                    },
                ]}
                icon={<FolderIcon/>}
            >
                <div className="flex flex-col items-start justify-center space-y-4">
                    {options.map((option) => (
                        <RadioButton
                            key={option.id}
                            id={option.id}
                            name="destination"
                            value={option.value}
                            label={option.label}
                            checked={selectedOption === option.value}
                            onChange={(e) => handleDestinationChange(e.target.value)}
                            className={"w-4 h-4 md:w-6 md:h-6"}
                        />
                    ))}
                    {errors.destination && (
                        <p className="text-red text-xs italic">{errors.destination}</p>
                    )}
                </div>
            </Modal>
        </form>
    );
};

export default Index;