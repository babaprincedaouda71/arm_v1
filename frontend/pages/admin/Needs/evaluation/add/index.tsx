import React, {ChangeEvent, useEffect, useMemo, useState} from 'react';
import {
    DepartmentProps,
    EvaluationCampaignParticipantProps,
    EvaluationsByTypeProps,
    NeedsEvaluationAddProps,
    SiteProps,
    UpdateCampaignProps
} from '@/types/dataTypes';
import useTable from "@/hooks/useTable";
import useSWR from "swr";
import {CAMPAIGN_URLS, DEPARTMENT_URLS, QUESTIONNAIRE_URLS, SITE_URLS, USERS_URLS} from "@/config/urls";
import {fetcher} from "@/services/api";
import {useRouter} from 'next/router';
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import {UserRole} from "@/contexts/AuthContext";
import InputField from "@/components/FormComponents/InputField";
import MultiSelectField from "@/components/FormComponents/MultiselectField";
import TextAreaField from "@/components/FormComponents/TextAreaField";
import SearchFilterAddBar from "@/components/SearchFilterAddBar";
import ModalButton from "@/components/ModalButton";
import Table from "@/components/Tables/Table/index";
import {handleSort} from "@/utils/sortUtils";
import {useSiteDepartmentFilter} from "@/hooks/settings/useSiteDepartmentFilter";

const TABLE_HEADERS = ["Nom", "Prénoms", "Poste", "Manager", "Département", "Sélection"];
const TABLE_KEYS = ["firstName", "lastName", "position", "manager", "department", "selection"];
const RECORDS_PER_PAGE = 10;

interface FormData {
    campaignTitle: string;
    instructions: string;
    site: number[];
    department: number[];
    questionnaire: string[];
    selectedTypes: string[];
    participantIds: number[];
}

const Index = () => {
    const {navigateTo} = useRoleBasedNavigation();
    const {query} = useRouter();
    const campaignId = query.id as string | undefined;
    const isEditMode = !!campaignId;

    // États locaux
    const [formData, setFormData] = useState<FormData>({
        campaignTitle: "",
        instructions: "",
        site: [],
        department: [],
        questionnaire: [],
        selectedTypes: [],
        participantIds: [],
    });
    const [errors, setErrors] = useState({});

    // Fetching des données nécessaires
    const {data: user} = useSWR<EvaluationCampaignParticipantProps[]>(USERS_URLS.fetchCampaignEvaluationParticipants, fetcher);
    const memoizedUserData = useMemo(() => user || [], [user]);

    const {data: sitesData} = useSWR<SiteProps[]>(SITE_URLS.mutate, fetcher);
    const {data: departmentsData} = useSWR<DepartmentProps[]>(DEPARTMENT_URLS.mutate, fetcher);
    const {data: questionnairesData} = useSWR<EvaluationsByTypeProps[]>(QUESTIONNAIRE_URLS.fetchAllByType, fetcher);

    const {data: campaignData} = useSWR<UpdateCampaignProps>(
        isEditMode && campaignId ? `${CAMPAIGN_URLS.getDetails}/${campaignId}` : null,
        fetcher
    );

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

    // Fonction pour convertir les IDs de questionnaires en types
    const getTypesFromQuestionnaireIds = useMemo(() => {
        return (questionnaireIds: string[]): string[] => {
            if (!questionnairesData || !questionnaireIds.length) return [];

            const types: string[] = [];
            questionnairesData.forEach(typeData => {
                if (typeData.questionnaires) {
                    typeData.questionnaires.forEach(questionnaire => {
                        if (questionnaireIds.includes(questionnaire.id) && questionnaire.isDefault) {
                            types.push(typeData.type);
                        }
                    });
                }
            });
            return types;
        };
    }, [questionnairesData]);

    // Fonction pour convertir les types en IDs de questionnaires par défaut
    const getDefaultQuestionnaireIdsFromTypes = useMemo(() => {
        return (types: string[]): string[] => {
            if (!questionnairesData || !types.length) return [];

            const questionnaireIds: string[] = [];
            types.forEach(type => {
                const typeData = questionnairesData.find(data => data.type === type);
                if (typeData?.questionnaires) {
                    const defaultQuestionnaire = typeData.questionnaires.find(q => q.isDefault === true);
                    if (defaultQuestionnaire) {
                        questionnaireIds.push(defaultQuestionnaire.id);
                    }
                }
            });
            return questionnaireIds;
        };
    }, [questionnairesData]);

    // Pré-remplissage du formulaire en mode édition
    useEffect(() => {
        if (isEditMode && campaignData) {
            const types = getTypesFromQuestionnaireIds(campaignData.questionnaireIds || []);

            setFormData({
                campaignTitle: campaignData.title || "",
                instructions: campaignData.instructions || "",
                site: campaignData.siteIds || [],
                department: campaignData.departmentIds || [],
                questionnaire: campaignData.questionnaireIds || [],
                selectedTypes: types,
                participantIds: campaignData.participantIds || [],
            });
        } else if (!isEditMode) {
            setFormData({
                campaignTitle: "",
                instructions: "",
                site: [],
                department: [],
                questionnaire: [],
                selectedTypes: [],
                participantIds: [],
            });
        }
    }, [isEditMode, campaignData, getTypesFromQuestionnaireIds]);

    // Formatage des options pour les Sélections Multiples
    const sitesOptionsFormatted = useMemo(() => {
        return sitesData ? sitesData.map(site => ({label: site.label, id: site.id})) : [];
    }, [sitesData]);

    // Options des types au lieu des questionnaires individuels
    const typeOptionsFormatted = useMemo(() => {
        if (!questionnairesData) return [];

        return questionnairesData
            .filter(typeData =>
                typeData.questionnaires &&
                typeData.questionnaires.some(q => q.isDefault === true)
            )
            .map(typeData => typeData.type);
    }, [questionnairesData]);

    // Filtrer les utilisateurs par département sélectionné
    const filteredUsers = useMemo(() => {
        const selectedDepartmentIds = formData.department;

        if (!selectedDepartmentIds || selectedDepartmentIds.length === 0) {
            return memoizedUserData;
        }

        const selectedDepartmentNames = departmentsData
            ? departmentsData
                .filter(dept => selectedDepartmentIds.includes(dept.id))
                .map(dept => dept.name)
            : [];

        if (selectedDepartmentNames.length === 0) {
            return memoizedUserData.length === 0 ? [] : memoizedUserData;
        }

        return memoizedUserData.filter(user =>
            user.department && selectedDepartmentNames.includes(user.department)
        );
    }, [memoizedUserData, formData.department, departmentsData]);

    // Configuration du tableau
    const {
        visibleColumns,
        handleSortData,
        toggleColumnVisibility,
        totalRecords,
        currentPage,
        setCurrentPage,
        totalPages,
        paginatedData,
        sortableColumns,
    } = useTable(
        filteredUsers,
        TABLE_HEADERS,
        TABLE_KEYS,
        RECORDS_PER_PAGE);

    // Gestion des changements dans les inputs
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
        setErrors(prevErrors => ({...prevErrors, [name]: ""}));
    };

    // Gestion du submit du formulaire
    const handleSubmit = () => {
        const dataToSend = {
            title: formData.campaignTitle,
            instructions: formData.instructions,
            siteIds: formData.site,
            departmentIds: formData.department,
            questionnaireIds: formData.questionnaire,
            participantIds: formData.participantIds,
        };

        const url = isEditMode ? `${CAMPAIGN_URLS.update}/${campaignId}` : CAMPAIGN_URLS.add;
        const method = isEditMode ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Succès:', data);
                navigateTo('/Needs/evaluation?tab=campaign');
            })
            .catch((error) => {
                console.error('Erreur:', error);
            });
    };

    // Rendu personnalisé pour la colonne de sélection
    const renderers = {
        selection: (_: string, row: NeedsEvaluationAddProps) => {
            const isSelected = formData.participantIds.includes(row.id);

            const handleCheckboxChange = () => {
                setFormData(prev => {
                    const newParticipantIds = [...prev.participantIds];
                    const index = newParticipantIds.indexOf(row.id);
                    if (isSelected) {
                        if (index > -1) {
                            newParticipantIds.splice(index, 1);
                        }
                    } else {
                        newParticipantIds.push(row.id);
                    }
                    return {...prev, participantIds: newParticipantIds};
                });
            };

            return (
                <div className="flex justify-center items-center">
                    <input
                        type="checkbox"
                        className="h-5 w-5 accent-primary"
                        checked={isSelected}
                        onChange={handleCheckboxChange}
                        aria-label={`Sélectionner ${row.firstName} ${row.lastName}`}
                    />
                </div>
            );
        },
    };

    // Gestion spéciale pour la sélection de types
    const handleTypeMultiSelectChange = (selectedTypes: string[]) => {
        const questionnaireIds = getDefaultQuestionnaireIdsFromTypes(selectedTypes);

        setFormData(prev => ({
            ...prev,
            selectedTypes: selectedTypes,
            questionnaire: questionnaireIds
        }));

        setErrors(prevErrors => ({...prevErrors, questionnaire: ""}));
    };

    // 🆕 Gestion modifiée des changements dans les MultiSelect
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

        setFormData(prev => ({
            ...prev,
            [name]: selectedIds,
        }));
        setErrors(prevErrors => ({...prevErrors, [name]: ""}));
    };

    // Gestion du retour à la liste
    const handleBackToList = () => {
        navigateTo('/Needs/evaluation?tab=campaign');
    };

    const pageTitle = isEditMode ? "Modifier la Campagne d'évaluation" : "Nouvelle Campagne d'évaluation";
    const submitButtonText = isEditMode ? "Enregistrer les modifications" : "Enregistrer";

    return (
        <ProtectedRoute requiredRole={UserRole.Admin}>
            <div className='mx-auto bg-white font-title rounded-lg px-6 pb-2 pt-6'>
                {/* Titre global et bouton Retour */}
                <div className="relative flex items-center mb-4">
                    <button
                        onClick={handleBackToList}
                        className="text-blue-500 border-2 rounded-xl p-2 hover:underline focus:outline-none"
                    >
                        Retour à la liste
                    </button>

                    <div className="absolute inset-x-0 flex justify-center items-center pointer-events-none">
                        <h1 className="text-2xl font-semibold text-gray-800 pointer-events-auto">
                            {pageTitle}
                        </h1>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-y-4 gap-x-8 md:gap-x-16 lg:gap-x-24 mb-4">
                    <InputField
                        label="Titre de la campagne"
                        name="campaignTitle"
                        value={formData.campaignTitle}
                        onChange={handleInputChange}
                    />
                    <MultiSelectField
                        options={sitesOptionsFormatted.map(opt => opt.label)}
                        label="Site"
                        value={formData.site.map(id => sitesData?.find(s => s.id === id)?.label || '')}
                        onChange={(values) => handleMultiSelectChange("site", values)}
                    />

                    {/* 🆕 Champ Département avec filtrage intelligent */}
                    <div className="relative">
                        <MultiSelectField
                            options={departmentOptions}
                            label="Département"
                            value={getDisplayNamesByIds(formData.department)}
                            onChange={(values) => handleMultiSelectChange("department", values)}
                        />
                        {/* 🆕 Indicateur visuel optionnel si aucun département disponible */}
                        {formData.site.length > 0 && !hasAvailableDepartments && (
                            <p className="text-sm text-gray-500 mt-1">
                                Aucun département disponible pour les sites sélectionnés
                            </p>
                        )}
                    </div>

                    <MultiSelectField
                        options={typeOptionsFormatted}
                        label="Type de questionnaire"
                        value={formData.selectedTypes}
                        onChange={handleTypeMultiSelectChange}
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-x-20">
                    <TextAreaField
                        label="Instruction"
                        name="instructions"
                        value={formData.instructions}
                        onChange={handleInputChange}
                        className=''
                    />
                </div>

                <div className="flex items-start gap-2 md:gap-8 mt-4">
                    <SearchFilterAddBar
                        isLeftButtonVisible={false}
                        isFiltersVisible={false}
                        isRightButtonVisible={false}
                        leftTextButton="Filtrer les colonnes"
                        rightTextButton="Nouvel"
                        onRightButtonClick={() => null}
                        filters={[]}
                        placeholderText={"Recherche de besoins"}
                    />
                    <ModalButton
                        headers={TABLE_HEADERS}
                        visibleColumns={visibleColumns}
                        toggleColumnVisibility={toggleColumnVisibility}
                    />
                </div>

                {/* Section : Tableau des données */}
                <Table
                    data={paginatedData}
                    keys={TABLE_KEYS}
                    headers={TABLE_HEADERS}
                    sortableCols={sortableColumns}
                    onSort={(column, order) => handleSortData(column, order, handleSort)}
                    totalRecords={totalRecords}
                    isPagination
                    pagination={{
                        currentPage,
                        totalPages,
                        onPageChange: setCurrentPage,
                    }}
                    visibleColumns={visibleColumns}
                    renderers={renderers}
                />

                {/* Section : Bouton d'action */}
                <div className="text-right text-xs md:text-sm lg:text-base">
                    <button
                        type="button"
                        className="bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd hover:bg-indigo-700 text-white font-bold p-2 md:p-3 lg:p-4 rounded-xl"
                        onClick={handleSubmit}
                    >
                        {submitButtonText}
                    </button>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default Index;