import React, {ChangeEvent, useEffect, useMemo, useState} from "react";
import InputField from "../FormComponents/InputField";
import TextAreaField from "../FormComponents/TextAreaField";
import MultiSelectField from "../FormComponents/MultiselectField";
import Modal from "../Modal";
import RadioButton from "../FormComponents/RadioButton";
import CustomSelect from "../FormComponents/CustomSelect";
import {DepartmentProps, DomainProps, QualificationProps, SiteProps, StrategicAxes} from "@/types/dataTypes";
import {
    DEPARTMENT_URLS,
    DOMAIN_URLS,
    NEEDS_STRATEGIC_AXES_URLS,
    QUALIFICATION_URLS,
    SITE_URLS,
    STRATEGIC_AXES_URLS
} from "@/config/urls";
import useSWR from "swr";
import {fetcher} from "@/services/api";
import Switch from "@/components/FormComponents/Switch";
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";
import {useSiteDepartmentFilter} from "@/hooks/settings/useSiteDepartmentFilter";

interface FormData {
    axe: number | null;
    site: number[];
    domain: number | null;
    nbrDay: string;
    nbrGroup: string;
    qualification: number | null;
    objective: string;
    content: string;
    department: number[];
    theme: string;
    type: string;
    csf: boolean;
    csfPlanifie: string;
}

const ManualEntry = () => {
    const {navigateTo, isCurrentPath, getPathWithoutRolePrefix} = useRoleBasedNavigation();
    const [formData, setFormData] = useState<FormData>({
        axe: null,
        site: [],
        domain: null,
        nbrDay: "",
        nbrGroup: "1",
        qualification: null,
        objective: "",
        content: "",
        department: [],
        theme: "",
        type: null,
        csf: false,
        csfPlanifie: '',
    });

    const [showRestOfForm, setShowRestOfForm] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedOptionDestination, setSelectedOptionDestination] = useState("");
    const [errors, setErrors] = useState<Partial<Record<keyof FormData | 'destination', string>>>({});

    const {data: axesData} = useSWR<StrategicAxes[]>(STRATEGIC_AXES_URLS.fetchAll, fetcher);
    const {data: sitesData} = useSWR<SiteProps[]>(SITE_URLS.mutate, fetcher);
    const {data: domainsData} = useSWR<DomainProps[]>(DOMAIN_URLS.mutate, fetcher);
    const {data: departmentsData} = useSWR<DepartmentProps[]>(DEPARTMENT_URLS.mutate, fetcher);
    const {data: qualificationsData} = useSWR<QualificationProps[]>(QUALIFICATION_URLS.mutate, fetcher);

    // 🆕 Utilisation du hook pour le filtrage intelligent
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

    const axesOptionsFormatted = useMemo(() => {
        if (axesData) {
            return axesData.map(axe => ({label: axe.title, id: axe.id}));
        }
        return [];
    }, [axesData]);

    const sitesOptionsFormatted = useMemo(() => {
        if (sitesData) {
            return sitesData.map(site => ({label: site.label, id: site.id}));
        }
        return [];
    }, [sitesData]);

    const domainsOptionsFormatted = useMemo(() => {
        if (domainsData) {
            return domainsData.map(domain => ({label: domain.name, id: domain.id}));
        }
        return [];
    }, [domainsData]);

    const qualificationsOptionsFormatted = useMemo(() => {
        if (qualificationsData) {
            return qualificationsData.map(qual => ({label: qual.type, id: qual.id}));
        }
        return [];
    }, [qualificationsData]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        let newValue = value;
        if (name === "nbrGroup") {
            if (value === "0") {
                return;
            }
            const parsedValue = parseInt(value, 10);
            if (isNaN(parsedValue) || parsedValue < 1) {
                newValue = "1";
            } else {
                newValue = String(parsedValue);
            }
        }
        setFormData(prev => ({...prev, [name]: newValue}));
        setErrors(prevErrors => ({...prevErrors, [name]: ""}));
    };

    const handleSwitchChange = (checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            csf: checked,
            csfPlanifie: checked ? prev.csfPlanifie : ''
        }));
        setErrors(prevErrors => ({...prevErrors, csf: ""}));
        if (!checked) {
            setErrors(prevErrors => ({...prevErrors, csfPlanifie: ""}));
        }
    };

    // 🆕 Gestionnaire modifié pour les MultiSelectField
    const handleMultiSelectChange = (name: keyof FormData, selectedLabels: string[]) => {
        let selectedIds: number[] = [];

        switch (name) {
            case "site":
                selectedIds = selectedLabels
                    .map(label => sitesData?.find(site => site.label === label)?.id)
                    .filter((id): id is number => id !== undefined);
                break;
            case "department":
                // 🆕 Utilisation du hook pour convertir les noms d'affichage en IDs
                selectedIds = getIdsByDisplayNames(selectedLabels);
                break;
            default:
                break;
        }

        setFormData(prev => ({...prev, [name]: selectedIds}));
        setErrors(prevErrors => ({...prevErrors, [name]: ""}));
    };

    const handleChangeCustomSelect = (event: { name: string; value: string }) => {
        const {name, value} = event;
        let selectedId: number | null = null;

        switch (name) {
            case "axe":
                selectedId = axesData?.find(axe => axe.title === value)?.id || null;
                setShowRestOfForm(selectedId !== null);
                break;
            case "domain":
                selectedId = domainsData?.find(domain => domain.name === value)?.id || null;
                break;
            case "qualification":
                selectedId = qualificationsData?.find(qual => qual.type === value)?.id || null;
                break;
            case "type":
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    type: value,
                }));
                return;
            default:
                selectedId = parseInt(value, 10) || null;
                break;
        }

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: selectedId,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        console.log("🚀 handleSubmit déclenché !");
        e.preventDefault();
        let isValid = true;
        const newErrors: Partial<Record<keyof FormData | 'destination', string>> = {};

        const requiredFields: (keyof FormData)[] = ["axe", "theme"];

        requiredFields.forEach(field => {
            if (!formData[field] || (Array.isArray(formData[field]) && formData[field].length === 0)) {
                newErrors[field] = "Ce champ est obligatoire";
                isValid = false;
            }
        });

        if (formData.csf && !formData.csfPlanifie) {
            newErrors["csfPlanifie"] = "Ce champ est obligatoire si CSF est activé";
            isValid = false;
        }

        console.log("📊 Validation :", {isValid, newErrors, formData});
        setErrors(newErrors);

        if (isValid) {
            console.log("✅ Validation réussie, appel de handleSave");
            setSelectedOptionDestination("");
            setErrors(prevErrors => ({...prevErrors, destination: ""}));
            handleSave();
        } else {
            console.log("❌ Validation échouée :", newErrors);
        }
    };

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const handleDestinationChange = (value: string) => {
        setSelectedOptionDestination(value);
        setErrors(prevErrors => ({...prevErrors, destination: ""}));
    };

    const handleSave = async () => {
        console.log("💾 handleSave démarré");
        const sitesToSend = formData.site.map(id => {
            const site = sitesData?.find(s => s.id === id);
            return site ? {id: site.id, label: site.label} : null;
        }).filter((site): site is { id: number; label: string } => site !== null);

        const domainToSend = formData.domain ? domainsData?.find(domain => domain.id === formData.domain) : null;
        const formattedDomain = domainToSend ? {id: domainToSend.id, name: domainToSend.name} : null;

        const departmentsToSend = formData.department.map(id => {
            const dept = departmentsData?.find(d => d.id === id);
            return dept ? {id: dept.id, name: dept.name} : null;
        }).filter((dept): dept is { id: number; name: string } => dept !== null);

        const qualificationToSend = formData.qualification ? qualificationsData?.find(qual => qual.id === formData.qualification) : null;
        const formattedQualification = qualificationToSend ? {
            id: qualificationToSend.id,
            type: qualificationToSend.type
        } : null;

        const axeToSend = formData.axe ? axesData?.find(axe => axe.id === formData.axe) : null;
        const formattedAxe = axeToSend ? {id: axeToSend.id, title: axeToSend.title} : null;

        const dataToSend = {
            axe: formattedAxe,
            site: sitesToSend,
            department: departmentsToSend,
            domain: formattedDomain,
            qualification: formattedQualification,
            theme: formData.theme,
            nbrDay: parseInt(formData.nbrDay, 10),
            type: formData.type,
            nbrGroup: formData.nbrGroup,
            objective: formData.objective,
            content: formData.content,
            csf: formData.csf ? "true" : "false",
            csfPlanifie: formData.csf ? formData.csfPlanifie : null,
        };

        console.log("📤 Données à envoyer :", dataToSend);

        try {
            console.log("🌐 Envoi de la requête...");
            const result = await fetch(NEEDS_STRATEGIC_AXES_URLS.add, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend),
            });

            console.log("📥 Réponse reçue :", result.status, result.statusText);

            if (!result.ok) {
                const errorData = await result.json();
                console.error("❌ Erreur lors de l'envoi :", errorData);
                return;
            }

            const json = await result.json();
            console.log("✅ Success :", json);

            console.log("🔄 Navigation vers /Needs/strategic-axes");
            await navigateTo("/Needs/strategic-axes");
        } catch (error) {
            console.error("💥 Erreur catch:", error);
        }
    };

    const optionsDestination = [
        {id: "option1", value: "catalogue", label: "Enregistrer dans le catalogue interne et le plan de formation"},
        {id: "option2", value: "plan", label: "Enregistrer uniquement dans le plan de formation"},
    ];

    const handleChange = (event) => {
        const {name, value} = event;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const planifieSelect = formData.csf ? (
        <CustomSelect
            name="csfPlanifie"
            options={["Planifié", "Non Planifié", "Alphabétisation"]}
            value={formData.csfPlanifie}
            onChange={handleChange}
            className={undefined}
            label={""}
        />
    ) : null;

    const customIcon = <img src="/images/folder.svg" className="h-7 w-7" alt="Icône de dossier"/>;

    return (
        <div className="mx-auto bg-white font-title rounded-lg px-6 pb-14">
            <div className="flex flex-col lg:flex-row lg:space-x-44 justify-between items-center mb-4">
                <h2 className="flex-[1] text-base md-custom:text-lg lg:text-xl font-bold text-center md:text-start">
                    Veuillez choisir l'axe à partir duquel vous souhaitez ajouter le thème
                </h2>
                <CustomSelect
                    options={axesOptionsFormatted.map(opt => opt.label)}
                    name="axe"
                    value={axesData?.find(a => a.id === formData.axe)?.title || ''}
                    onChange={handleChangeCustomSelect}
                    className="lg:flex-1"
                    error={errors.axe}
                />
            </div>

            {showRestOfForm && (
                <div className="grid md:grid-cols-2 gap-y-4 gap-x-8 md:gap-x-16 lg:gap-x-24 mb-4">
                    <MultiSelectField
                        options={sitesOptionsFormatted.map(opt => opt.label)}
                        label="Site"
                        value={formData.site.map(id => sitesData?.find(s => s.id === id)?.label || '')}
                        onChange={(values) => handleMultiSelectChange("site", values)}
                        error={errors.site}
                    />

                    {/* 🆕 Champ Département avec filtrage intelligent */}
                    <div className="relative">
                        <MultiSelectField
                            options={departmentOptions}
                            label="Département"
                            value={getDisplayNamesByIds(formData.department)}
                            onChange={(values) => handleMultiSelectChange("department", values)}
                            error={errors.department}
                        />
                    </div>

                    <CustomSelect
                        label={"Domaine"}
                        options={domainsOptionsFormatted.map(opt => opt.label)}
                        name="domain"
                        value={domainsData?.find(d => d.id === formData.domain)?.name || ''}
                        onChange={handleChangeCustomSelect}
                        className="lg:flex-1"
                        error={errors.domain}
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
                    <CustomSelect
                        label={"Type"}
                        options={["Intra-entreprise", "Inter-entreprise"]}
                        name="type"
                        value={formData.type || ''}
                        onChange={handleChangeCustomSelect}
                        className="lg:flex-1"
                        error={errors.type}
                    />
                    <InputField
                        label="Nbr de groupe"
                        name="nbrGroup"
                        type="number"
                        minValue={1}
                        value={formData.nbrGroup}
                        onChange={handleInputChange}
                        error={errors.nbrGroup}
                    />
                    <Switch
                        label="CSF"
                        name="csf"
                        checked={formData.csf}
                        onChange={handleSwitchChange}
                        planifieField={planifieSelect}
                    />
                    <CustomSelect
                        label={"Qualification"}
                        options={qualificationsOptionsFormatted.map(opt => opt.label)}
                        name="qualification"
                        value={qualificationsData?.find(q => q.id === formData.qualification)?.type || ''}
                        onChange={handleChangeCustomSelect}
                        error={errors.qualification}
                    />
                </div>
            )}

            {showRestOfForm && (
                <div className="grid md:grid-cols-2 gap-x-20">
                    <div className="col-span-1 grid gap-y-4">
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
            )}

            {showRestOfForm && (
                <div className="mt-5 text-right text-xs md:text-sm lg:text-base">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd hover:bg-indigo-700 text-white font-bold p-2 md:p-3 lg:p-4 rounded-xl"
                    >
                        Enregistrer
                    </button>
                </div>
            )}

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
                        className: "bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd text-white",
                    },
                ]}
                icon={customIcon}
            >
                <div className="flex flex-col items-start justify-center space-y-4">
                    {optionsDestination.map((option) => (
                        <RadioButton
                            key={option.id}
                            id={option.id}
                            name="destination"
                            value={option.value}
                            label={option.label}
                            checked={selectedOptionDestination === option.value}
                            onChange={(e) => handleDestinationChange(e.target.value)}
                            className={"w-6 h-6"}
                        />
                    ))}
                    {errors.destination && <p className="text-red text-xs italic">{errors.destination}</p>}
                </div>
            </Modal>
        </div>
    );
};

export default ManualEntry;