// pages/admin/Needs/strategic-axes/editStrategicAxe/AddOCFPage.tsx
// Modifications minimales à apporter

import React, {ChangeEvent, useEffect, useMemo, useState} from "react";
import {DepartmentProps, DomainProps, QualificationProps, SiteProps, StrategicAxes} from "@/types/dataTypes";
import {
    DEPARTMENT_URLS,
    DOMAIN_URLS,
    NEEDS_URLS,
    QUALIFICATION_URLS,
    SITE_URLS,
    STRATEGIC_AXES_URLS
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
import {useSiteDepartmentFilter} from "@/hooks/settings/useSiteDepartmentFilter";

// 🆕 Enum pour les types de besoins
enum NeedSource {
    Strategic_Axes = "Strategic_Axes",
    Evaluation = "Evaluation",
    Internal_Catalog = "Internal_Catalog",
    External_Catalog = "External_Catalog",
    Individual_Requests = "Individual_Requests"
}

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

const EditNeedPage = () => {
    const {navigateTo, isCurrentPath, getPathWithoutRolePrefix} = useRoleBasedNavigation();

    // 🆕 État pour le type de besoin
    const [needSource, setNeedSource] = useState<NeedSource | null>(null);

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

    // 🆕 Conditional fetching des axes stratégiques selon le type
    const shouldFetchAxes = needSource === NeedSource.Strategic_Axes;
    const {data: axesData} = useSWR<StrategicAxes[]>(
        shouldFetchAxes ? STRATEGIC_AXES_URLS.fetchAll : null,
        fetcher
    );

    const {data: sitesData} = useSWR<SiteProps[]>(SITE_URLS.mutate, fetcher);
    const {data: domainsData} = useSWR<DomainProps[]>(DOMAIN_URLS.mutate, fetcher);
    const {data: qualificationsData} = useSWR<QualificationProps[]>(QUALIFICATION_URLS.mutate, fetcher);
    const {data: departmentsData} = useSWR<DepartmentProps[]>(DEPARTMENT_URLS.mutate, fetcher);

    const router = useRouter();
    const {id} = router.query;

    // Hook pour le filtrage des départements (inchangé)
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

    // Nettoyage automatique des départements (inchangé)
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

    // Options formatées (inchangé)
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

    // 🆕 Fetch des données du besoin avec détection du type
    useEffect(() => {
        if (id) {
            const fetchNeedData = async () => {
                try {
                    const response = await fetch(NEEDS_URLS.getNeed + `/${id}`, {
                        method: "GET",
                        credentials: "include",
                    });

                    if (!response.ok) {
                        throw new Error("Failed to fetch need data");
                    }

                    const needData = await response.json();
                    console.log("Need data:", needData);

                    // 🆕 Déterminer le type de besoin
                    setNeedSource(needData.source || NeedSource.Strategic_Axes);

                    setFormData({
                        axe: needData.axe?.id || null,
                        site: needData.site?.map(site => site.id) || [],
                        domain: needData.domain?.id || null,
                        nbrDay: String(needData.nbrDay || ""),
                        nbrGroup: String(needData.nbrGroup || "1"),
                        qualification: needData.qualification?.id || null,
                        objective: needData.objective || "",
                        content: needData.content || "",
                        department: needData.department?.map(dept => dept.id) || [],
                        theme: needData.theme || "",
                        type: needData.type || "",
                        csf: needData.csf,
                        csfPlanifie: needData.csfPlanifie || '',
                    });

                } catch (error) {
                    console.error("Erreur lors de la récupération des données du besoin :", error);
                }
            };

            fetchNeedData();
        }
    }, [id]);

    // Tous les autres handlers restent identiques...
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

    const handleMultiSelectChange = (name: keyof FormData, selectedLabels: string[]) => {
        let selectedIds: number[] = [];

        switch (name) {
            case "site":
                selectedIds = selectedLabels
                    .map(label => sitesData?.find(site => site.label === label)?.id)
                    .filter((id): id is number => id !== undefined);
                break;
            case "department":
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

    // 🆕 Validation conditionnelle selon le type
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let isValid = true;
        const newErrors: Partial<Record<keyof FormData | 'destination', string>> = {};

        // Validation du thème (toujours obligatoire)
        const requiredFields: (keyof FormData)[] = ["theme"];

        // 🆕 Validation de l'axe seulement pour Strategic_Axes
        if (needSource === NeedSource.Strategic_Axes) {
            requiredFields.push("axe");
        }

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

    // handleSave reste identique...
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

        // 🆕 Préparer l'axe pour Strategic_Axes
        const axeToSend = (needSource === NeedSource.Strategic_Axes && formData.axe)
            ? axesData?.find(axe => axe.id === formData.axe)
            : null;
        const formattedAxe = axeToSend ? {id: axeToSend.id, title: axeToSend.title} : null;

        // 🆕 Construire l'objet avec ou sans axe selon le type
        const dataToSend: any = {
            theme: formData.theme,
            nbrDay: parseInt(formData.nbrDay, 10),
            type: formData.type,
            nbrGroup: formData.nbrGroup,
            objective: formData.objective,
            content: formData.content,
            csf: formData.csf ? "true" : "false",
            csfPlanifie: formData.csf ? formData.csfPlanifie : null,
            site: sitesToSend,
            department: departmentsToSend,
            domain: formattedDomain,
            qualification: formattedQualification,
            // 🆕 Ajouter l'axe conditionnellement
            ...(needSource === NeedSource.Strategic_Axes && {axe: formattedAxe}),
        };

        console.log("Données à envoyer : ", dataToSend);

        try {
            const result = await fetch(NEEDS_URLS.update + `/${id}`, {
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

            // 🆕 Redirection conditionnelle selon le type
            const getRedirectPath = () => {
                switch (needSource) {
                    case NeedSource.Strategic_Axes:
                        return "/Needs/strategic-axes";
                    case NeedSource.Individual_Requests:
                        return "/Needs/individual-request";
                    case NeedSource.Evaluation:
                        return "/Needs/evaluation";
                    default:
                        return "/Needs";
                }
            };

            navigateTo(getRedirectPath());
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

    // 🆕 Titre dynamique selon le type
    const getPageTitle = () => {
        switch (needSource) {
            case NeedSource.Strategic_Axes:
                return "Veuillez choisir l'axe à partir duquel vous souhaitez modifier le thème";
            case NeedSource.Individual_Requests:
                return "Modifier la demande individuelle";
            case NeedSource.Evaluation:
                return "Modifier le besoin d'évaluation";
            case NeedSource.Internal_Catalog:
                return "Modifier le besoin du catalogue interne";
            case NeedSource.External_Catalog:
                return "Modifier le besoin du catalogue externe";
            default:
                return "Modifier le besoin";
        }
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
        <div className="mx-auto bg-white font-title rounded-lg py-4 px-6 pb-14" onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row lg:space-x-44 justify-between items-center mb-4">
                <h2 className="flex-[1] text-base md-custom:text-lg lg:text-xl font-bold text-center md:text-start">
                    {getPageTitle()}
                </h2>

                {/* 🆕 Affichage conditionnel du champ Axe Stratégique */}
                {needSource === NeedSource.Strategic_Axes && (
                    <CustomSelect
                        options={axesOptionsFormatted.map(opt => opt.label)}
                        name="axe"
                        value={axesData?.find(a => a.id === formData.axe)?.title || ''}
                        onChange={handleChangeCustomSelect}
                        className="lg:flex-1"
                        error={errors.axe}
                    />
                )}
            </div>

            {/* Le reste du formulaire reste exactement identique... */}
            <div className="grid md:grid-cols-2 gap-y-4 gap-x-8 md:gap-x-16 lg:gap-x-24 mb-4">
                <MultiSelectField
                    options={sitesOptionsFormatted.map(opt => opt.label)}
                    label="Site"
                    value={formData.site.map(id => sitesData?.find(s => s.id === id)?.label || '')}
                    onChange={(values) => handleMultiSelectChange("site", values)}
                    error={errors.site}
                />

                <div className="relative">
                    <MultiSelectField
                        options={departmentOptions}
                        label="Département"
                        value={getDisplayNamesByIds(formData.department)}
                        onChange={(values) => handleMultiSelectChange("department", values)}
                        error={errors.department}
                    />

                    {formData.site.length === 0 && (
                        <div className="absolute -bottom-6 left-0 text-xs text-gray-500 italic">
                            💡 Sélectionnez d'abord un ou plusieurs sites pour filtrer les départements
                        </div>
                    )}

                    {formData.site.length > 0 && !hasAvailableDepartments && (
                        <div className="absolute -bottom-6 left-0 text-xs text-amber-600 italic">
                            ⚠️ Aucun département disponible pour les sites sélectionnés
                        </div>
                    )}
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
                    onClick={handleSubmit}
                    className="bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd hover:bg-indigo-700 text-white font-bold p-2 md:p-3 lg:p-4 rounded-xl"
                >
                    {isEditMode ? "Enregistrer les modifications" : "Enregistrer"}
                </button>
            </div>
        </div>
    );
}

export default EditNeedPage;