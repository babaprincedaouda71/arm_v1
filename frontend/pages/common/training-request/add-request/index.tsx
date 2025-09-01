import React, {ChangeEvent, useEffect, useMemo, useState} from "react";
import useSWR from "swr";
import {DepartmentProps, DomainProps, SiteProps} from "@/types/dataTypes";
import {DEPARTMENT_URLS, DOMAIN_URLS, MY_REQUESTS_URLS, SITE_URLS} from "@/config/urls";
import {fetcher} from "@/services/api";
import CustomSelect from "@/components/FormComponents/CustomSelect";
import InputField from "@/components/FormComponents/InputField";
import TextAreaField from "@/components/FormComponents/TextAreaField";
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";
import {useAuth, UserRole} from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import {useSiteDepartmentFilter} from "@/hooks/settings/useSiteDepartmentFilter";

interface FormData {
    theme: string;
    year: number | null;
    domain: number | null;
    wishDate: string;
    site: number | null;
    department: number | null;
    learningMode: string;
    objective: string;
}

const AddRequestComponent: React.FC = () => {
    const {user} = useAuth()
    if (user) {
        console.log(user)
    }
    const {navigateTo} = useRoleBasedNavigation()
    const [errors, setErrors] = useState<Partial<Record<keyof FormData | 'destination', string>>>({});
    const [formData, setFormData] = useState<FormData>({
        theme: "",
        year: new Date().getFullYear(),
        domain: null,
        wishDate: "",
        site: null,
        department: null,
        learningMode: "",
        objective: "",
    });

    const {data: sitesData} = useSWR<SiteProps[]>(SITE_URLS.mutate, fetcher);
    const {data: domainsData} = useSWR<DomainProps[]>(DOMAIN_URLS.mutate, fetcher);
    const {data: departmentsData} = useSWR<DepartmentProps[]>(DEPARTMENT_URLS.mutate, fetcher);

    // 🆕 Utilisation du hook pour le filtrage intelligent des départements
    // Note: Conversion du site unique en tableau pour la compatibilité avec le hook
    const selectedSiteIds = formData.site ? [formData.site] : [];

    const {
        filteredDepartments,
        hasAvailableDepartments
    } = useSiteDepartmentFilter({
        sitesData,
        departmentsData,
        selectedSiteIds
    });

    // 🆕 Nettoyage automatique du département quand le site change
    useEffect(() => {
        if (formData.site && formData.department) {
            // Vérifier si le département sélectionné est encore valide pour le site choisi
            const isDepartmentValid = filteredDepartments.some(dept => dept.id === formData.department);

            if (!isDepartmentValid) {
                setFormData(prev => ({
                    ...prev,
                    department: null
                }));
            }
        }
    }, [formData.site, filteredDepartments, formData.department]);

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

    // 🆕 Options des départements filtrées selon le site sélectionné
    const departmentsOptionsFormatted = useMemo(() => {
        return filteredDepartments.map(dept => ({
            label: dept.displayName, // Format: "Département (Site)"
            id: dept.id
        }));
    }, [filteredDepartments]);

    const handleChangeCustomSelect = (event: { name: string; value: string }) => {
        const {name, value} = event;
        let selectedId: number | null = null;

        switch (name) {
            case "domain":
                selectedId = domainsData?.find(domain => domain.name === value)?.id || null;
                break;
            case "department":
                // 🆕 Recherche par displayName au lieu de name
                selectedId = filteredDepartments?.find(dept => dept.displayName === value)?.id || null;
                break;
            case "site":
                selectedId = sitesData?.find(site => site.label === value)?.id || null;
                break;
            case "learningMethod":
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    learningMode: value,
                }));
                setErrors(prevErrors => ({...prevErrors, learningMode: ""}));
                return;
            default:
                selectedId = parseInt(value, 10) || null;
                break;
        }

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: selectedId,
        }));
        setErrors(prevErrors => ({...prevErrors, [name]: ""}));
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        let newValue = value;
        setFormData(prev => ({...prev, [name]: newValue}));
        setErrors(prevErrors => ({...prevErrors, [name]: ""}));
    };

    const handleCancel = () => {
        navigateTo("/my-requests");
    }

    const handleSubmit = async () => {
        // 🆕 Validation basique
        let isValid = true;
        const newErrors: Partial<Record<keyof FormData | 'destination', string>> = {};

        if (!formData.theme.trim()) {
            newErrors.theme = "Le titre de la formation est obligatoire";
            isValid = false;
        }

        if (!formData.domain) {
            newErrors.domain = "Le domaine est obligatoire";
            isValid = false;
        }

        if (!formData.wishDate) {
            newErrors.wishDate = "La date souhaitée est obligatoire";
            isValid = false;
        }

        setErrors(newErrors);

        if (!isValid) {
            return;
        }

        // 🆕 Construction des objets complets au lieu d'envoyer uniquement les noms
        const siteToSend = formData.site
            ? sitesData?.find(site => site.id === formData.site)
            : null;
        const formattedSite = siteToSend
            ? { id: siteToSend.id, label: siteToSend.label }
            : null;

        const departmentToSend = formData.department
            ? filteredDepartments?.find(dpt => dpt.id === formData.department)
            : null;
        const formattedDepartment = departmentToSend
            ? { id: departmentToSend.id, name: departmentToSend.name }
            : null;

        const domainToSend = formData.domain
            ? domainsData?.find(domain => domain.id === formData.domain)
            : null;
        const formattedDomain = domainToSend
            ? { id: domainToSend.id, name: domainToSend.name }
            : null;

        const requesterToSend = user
            ? {
                requesterId: user.id,
                requesterFullName: `${user.firstName} ${user.lastName}`,
                managerId: user.managerId
            }
            : null;

        const dataToSend = {
            year: formData.year,
            domain: formattedDomain,        // 🆕 Objet complet au lieu du nom seul
            theme: formData.theme,
            site: formattedSite,            // 🆕 Objet complet au lieu du nom seul
            department: formattedDepartment, // 🆕 Objet complet au lieu du nom seul
            wishDate: formData.wishDate,
            requester: requesterToSend,
            objective: formData.objective,
            learningMode: formData.learningMode,
        };

        console.log("Nouvelle requête à envoyer : ", dataToSend);

        try {
            const result = await fetch(MY_REQUESTS_URLS.add, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend),
            });

            if (!result.ok) {
                const errorData = await result.json();
                console.error("Erreur lors de l'envoi :", errorData);
                return;
            }

            const json = await result.json();
            console.log("Success : ", json);

            navigateTo("/my-requests");
        } catch (error) {
            console.error("Erreur:", error);
        }
    };

    // 🆕 Fonction pour obtenir la valeur affichée du département
    const getDepartmentDisplayValue = (): string => {
        if (!formData.department) return '';
        const dept = filteredDepartments?.find(d => d.id === formData.department);
        return dept ? dept.displayName : '';
    };

    return (
        <ProtectedRoute requiredRoles={[UserRole.Collaborateur, UserRole.Manager]}>
            <form className="mx-auto bg-white font-title rounded-lg pt-6 px-6 pb-14">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Créer une nouvelle demande de formation</h2>
                <div className="grid md:grid-cols-2 gap-y-4 gap-x-8 md:gap-x-16 lg:gap-x-24 mb-4">
                    <InputField
                        label="Titre de la formation"
                        name="theme"
                        value={formData.theme}
                        onChange={handleInputChange}
                        error={errors.theme}
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
                        label="Année"
                        name="year"
                        type="number"
                        minValue={formData.year}
                        value={formData.year}
                        onChange={handleInputChange}
                        error={errors.year}
                    />
                    <InputField
                        label="Date souhaitée"
                        name="wishDate"
                        type="date"
                        value={formData.wishDate}
                        onChange={handleInputChange}
                        error={errors.wishDate}
                    />
                    <CustomSelect
                        label={"Site"}
                        options={sitesOptionsFormatted.map(site => site.label)}
                        name="site"
                        value={sitesData?.find(s => s.id === formData.site)?.label || ''}
                        onChange={handleChangeCustomSelect}
                        className="lg:flex-1"
                        error={errors.site}
                    />

                    {/* 🆕 Département avec filtrage intelligent et indicateur visuel */}
                    <div className="relative">
                        <CustomSelect
                            label={"Département"}
                            options={departmentsOptionsFormatted.map(opt => opt.label)}
                            name="department"
                            value={getDepartmentDisplayValue()}
                            onChange={handleChangeCustomSelect}
                            className="lg:flex-1"
                            error={errors.department}
                        />
                        {/* 🆕 Indicateurs visuels */}
                        {formData.site && !hasAvailableDepartments && (
                            <p className="text-sm text-gray-500 mt-1">
                                Aucun département disponible pour le site sélectionné
                            </p>
                        )}
                        {!formData.site && (
                            <p className="text-sm text-gray-400 mt-1">
                                Sélectionnez d'abord un site pour voir les départements disponibles
                            </p>
                        )}
                    </div>

                    <CustomSelect
                        label={"Mode de formation"}
                        options={["Présentiel", "A distance", "Hybride"]}
                        name="learningMethod"
                        value={formData.learningMode}
                        onChange={handleChangeCustomSelect}
                        className="lg:flex-1"
                        error={errors.learningMode}
                    />
                    <TextAreaField
                        label="Description & objectif"
                        name="objective"
                        value={formData.objective}
                        onChange={handleInputChange}
                        error={errors.objective}
                    />
                </div>
                <div className="mt-5 text-right text-xs md:text-sm lg:text-base flex justify-end gap-4">
                    <button
                        onClick={handleCancel}
                        type="button"
                        className="bg-white border-2 text-primary font-bold p-2 md:p-3 lg:p-4 rounded-xl"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSubmit}
                        type="button"
                        className="bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd hover:bg-indigo-700 text-white font-bold p-2 md:p-3 lg:p-4 rounded-xl"
                    >
                        Enregistrer
                    </button>
                </div>
            </form>
        </ProtectedRoute>
    )
}
export default AddRequestComponent;