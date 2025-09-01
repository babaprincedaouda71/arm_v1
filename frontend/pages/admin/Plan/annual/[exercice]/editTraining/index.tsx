import React, {ChangeEvent, useEffect, useMemo, useState} from "react";
import {DepartmentProps, DomainProps, QualificationProps, SiteProps, StrategicAxes} from "@/types/dataTypes";
import {
    DEPARTMENT_URLS,
    DOMAIN_URLS,
    QUALIFICATION_URLS,
    SITE_URLS,
    STRATEGIC_AXES_URLS,
    TRAINING_URLS
} from "@/config/urls";
import useSWR from "swr";
import {fetcher} from "@/services/api";
import {useRouter} from "next/router";
import Switch from "@/components/FormComponents/Switch";
import CustomSelect from "@/components/FormComponents/CustomSelect";
import TextAreaField from "@/components/FormComponents/TextAreaField";
import InputField from "@/components/FormComponents/InputField";
import MultiSelectField from "@/components/FormComponents/MultiselectField";
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";

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


const EditTrainingPage = () => {
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
        type: "",
        csf: false,
        csfPlanifie: '',
    });

    const [selectedOptionDestination, setSelectedOptionDestination] = useState("");
    const [errors, setErrors] = useState<Partial<Record<keyof FormData | 'destination', string>>>({});
    const [isEditMode, setIsEditMode] = useState(false);

    const {data: axesData} = useSWR<StrategicAxes[]>(STRATEGIC_AXES_URLS.fetchAll, fetcher);
    const {data: sitesData} = useSWR<SiteProps[]>(SITE_URLS.mutate, fetcher);
    const {data: domainsData} = useSWR<DomainProps[]>(DOMAIN_URLS.mutate, fetcher);
    const {data: qualificationsData} = useSWR<QualificationProps[]>(QUALIFICATION_URLS.mutate, fetcher);
    const {data: departmentsData} = useSWR<DepartmentProps[]>(DEPARTMENT_URLS.mutate, fetcher);

    const router = useRouter();
    const {trainingId, exercice, planId} = router.query; // Récupérer l'ID depuis les paramètres de l'URL

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

    const departmentsOptionsFormatted = useMemo(() => {
        if (departmentsData) {
            return departmentsData.map(dept => ({label: dept.name, id: dept.id}));
        }
        return [];
    }, [departmentsData]);

    useEffect(() => {
        if (trainingId) {
            const fetchTrainingData = async () => {
                try {
                    const response = await fetch(TRAINING_URLS.getTrainingToEdit + `/${trainingId}`, {
                        method: "GET",
                        credentials: "include",
                    });

                    if (!response.ok) {
                        throw new Error("Failed to fetch training data");
                    }

                    const TrainingData = await response.json();
                    console.log("Données de la formation : ", TrainingData);

                    // Adapter la structure des données pour correspondre à formData
                    setFormData({
                        axe: TrainingData.axe?.id || null,
                        site: TrainingData.site?.map(site => site.id) || [],
                        domain: TrainingData.domain?.id || null,
                        nbrDay: String(TrainingData.nbrDay || ""),
                        nbrGroup: String(TrainingData.nbrGroup || "1"),
                        qualification: TrainingData.qualification?.id || null,
                        objective: TrainingData.objective || "",
                        content: TrainingData.content || "",
                        department: TrainingData.department?.map(dept => dept.id) || [],
                        theme: TrainingData.theme || "",
                        type: TrainingData.type || "",
                        csf: TrainingData.csf,
                        csfPlanifie: TrainingData.csfPlanifie || '',
                    });

                } catch (error) {
                    console.error("Erreur lors de la récupération des données de la formation :", error);
                    // Gérer l'erreur ici, par exemple afficher un message à l'utilisateur
                }
            };

            fetchTrainingData();
        }
    }, [trainingId]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        let newValue = value;
        if (name === "nbrGroup") {
            if (value === "0") {
                return; // Empêche la mise à jour de l'état si la valeur est "0"
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

    const handleMultiSelectChange = (name: keyof FormData, selectedLabels: string[]) => {
        let selectedIds: number[] = [];
        switch (name) {
            case "site":
                selectedIds = selectedLabels
                    .map(label => sitesData?.find(site => site.label === label)?.id)
                    .filter((id): id is number => id !== undefined);
                break;
            case "department":
                selectedIds = selectedLabels
                    .map(name => departmentsData?.find(dept => dept.name === name)?.id)
                    .filter((id): id is number => id !== undefined);
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
                break;
            case "domain":
                selectedId = domainsData?.find(domain => domain.name === value)?.id || null;
                break;
            case "qualification":
                selectedId = qualificationsData?.find(qual => qual.type === value)?.id || null;
                break;
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
        e.preventDefault();
        let isValid = true;
        const newErrors: Partial<Record<keyof FormData | 'destination', string>> = {};

        const requiredFields: (keyof FormData)[] = [
            "axe",
            "theme",
        ];

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

        setErrors(newErrors);

        if (isValid) {
            setSelectedOptionDestination("");
            setErrors(prevErrors => ({...prevErrors, destination: ""}));
            handleSave();
        }
    };

    const handleSave = async () => {
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

        console.log("Données à envoyer : ", dataToSend);

        try {
            const result = await fetch(TRAINING_URLS.editTraining + `/${trainingId}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend),
            });

            if (!result.ok) {
                const errorData = await result.json();
                console.error(`Erreur lors de ${isEditMode ? "la modification" : "l'envoi"} :`, errorData);
                return;
            }

            const json = await result.json();
            console.log("Success : ", json);

            navigateTo(`/Plan/annual/${exercice}`, {
                query: {
                    planId: planId
                }
            });
        } catch (error) {
            console.error("Erreur:", error);
        }
    };

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

    return (
        <form className="mx-auto bg-white font-title rounded-lg py-4 px-6 pb-14" onSubmit={handleSubmit}>
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

            <div className="grid md:grid-cols-2 gap-y-4 gap-x-8 md:gap-x-16 lg:gap-x-24 mb-4">
                <MultiSelectField
                    options={sitesOptionsFormatted.map(opt => opt.label)}
                    label="Site"
                    value={formData.site.map(id => sitesData?.find(s => s.id === id)?.label || '')}
                    onChange={(values) => handleMultiSelectChange("site", values)}
                    error={errors.site}
                />
                <MultiSelectField
                    options={departmentsOptionsFormatted.map(opt => opt.label)}
                    label="Département"
                    value={formData.department.map(id => departmentsData?.find(d => d.id === id)?.name || '')}
                    onChange={(values) => handleMultiSelectChange("department", values)}
                    error={errors.department}
                />
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
                    minValue={1}
                    value={formData.nbrGroup}
                    onChange={handleInputChange}
                    error={errors.nbrGroup}
                />
                <Switch
                    label="CSF"
                    name="csf" checked={formData.csf}
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

            <div className="mt-5 text-right text-xs md:text-sm lg:text-base">
                <button
                    type="submit"
                    className="bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd hover:bg-indigo-700 text-white font-bold p-2 md:p-3 lg:p-4 rounded-xl"
                >
                    {isEditMode ? "Enregistrer les modifications" : "Enregistrer"}
                </button>
            </div>
        </form>
    );
};

export default EditTrainingPage;