import React, {ChangeEvent, useEffect, useMemo, useState} from 'react'
import MultipleInputField from "@/components/FormComponents/MultipleInputField";
import MultiSelectField from "@/components/FormComponents/MultiselectField";
import {TRAINING_GROUPE_URLS, TRAINING_URLS} from '@/config/urls';
import {DepartmentProps, SiteProps} from '@/types/dataTypes';
import InputField from '@/components/FormComponents/InputField';
import {GroupData} from '../add-group';
import Alert from '@/components/Alert';
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";
import CustomDatePicker from "@/components/FormComponents/CustomDatePicker";
import {useSiteDepartmentFilter} from "@/hooks/settings/useSiteDepartmentFilter";

type UUID = string

interface PlanningProps {
    groupId?: string | string[] | undefined;
    trainingId: string | UUID | string[] | undefined;
    siteData: SiteProps[] | undefined;
    departmentData: DepartmentProps[] | undefined;
    groupData?: GroupData;
    isEditMode?: boolean;
    onGroupDataUpdated: (newGroupData: GroupData) => void;
}

interface FormErrors {
    fromDate?: string;
    toDate?: string;
    fromMorning?: string;
    toMorning?: string;
    fromAfternoon?: string;
    toAfternoon?: string;
    general?: string;
}

interface FormData {
    site: number[];
    department: number[];
    location: string;
    city: string;
    dates: string[];
}

const Planning: React.FC<PlanningProps> = ({
                                               groupId,
                                               trainingId,
                                               siteData,
                                               departmentData,
                                               groupData,
                                               isEditMode,
                                               onGroupDataUpdated
                                           }) => {
    const {navigateTo} = useRoleBasedNavigation();

    // État pour gérer les alertes
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('success');

    const handleCloseAlert = () => {
        setShowAlert(false);
        setAlertMessage('');
    };

    const [formData, setFormData] = useState<FormData>(() => {
        return {
            site: [],
            department: [],
            location: "",
            city: "",
            dates: [],
        };
    });

    // 🆕 Utilisation du hook pour le filtrage intelligent
    const {
        departmentOptions,
        getDisplayNamesByIds,
        getIdsByDisplayNames,
        cleanSelectedDepartments,
        hasAvailableDepartments
    } = useSiteDepartmentFilter({
        sitesData: siteData,
        departmentsData: departmentData,
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

    const sitesOptionsFormatted = useMemo(() => {
        if (siteData) {
            return siteData.map(site => ({label: site.label, id: site.id}));
        }
        return [];
    }, [siteData]);

    useEffect(() => {
        if (trainingId) {
            const fetchtrainingData = async () => {
                try {
                    const response = await fetch(TRAINING_URLS.getTrainingForAddGroup + `/${trainingId}`, {
                        method: "GET",
                        credentials: "include",
                    });

                    if (!response.ok) {
                        throw new Error("Failed to fetch need data");
                    }

                    const trainingData = await response.json();
                    console.log("trainingData : ", trainingData)

                    if (isEditMode || groupData) {
                        setFormData({
                            site: trainingData.site?.map(site => site.id) || [],
                            department: trainingData.department?.map(dept => dept.id) || [],
                            location: groupData?.location || "",
                            city: groupData?.city || "",
                            dates: groupData?.dates || [""],
                        });

                        setFormValues({
                            fromDate: "",
                            toDate: "",
                            fromMorning: groupData?.morningStartTime || "",
                            toMorning: groupData?.morningEndTime || "",
                            fromAfternoon: groupData?.afternoonStartTime || "",
                            toAfternoon: groupData?.afternoonEndTime || "",
                        });
                    } else {
                        setFormData({
                            site: trainingData.site?.map(site => site.id) || [],
                            department: trainingData.department?.map(dept => dept.id) || [],
                            location: "",
                            city: "",
                            dates: [],
                        });
                    }

                } catch (error) {
                    console.error("Erreur lors de la récupération des données de la formation :", error);
                }
            };

            fetchtrainingData();
        }
    }, [trainingId]);

    const [formValues, setFormValues] = useState({
        fromDate: "",
        toDate: "",
        fromMorning: "",
        fromAfternoon: "",
        toMorning: "",
        toAfternoon: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const handleChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({...formValues, [name]: e.target.value});
        setErrors(prevErrors => ({...prevErrors, [name]: ''}));
    };

    const handleChangeSelect = (event) => {
        const {name, value} = event;
        setFormValues(prevFormData => ({...prevFormData, [name]: value}));
        setErrors(prevErrors => ({...prevErrors, [name]: ''}));
    };

    // 🆕 Gestionnaire modifié pour les MultiSelectField
    const handleMultiSelectChange = (name: keyof FormData, selectedLabels: string[]) => {
        let selectedIds: number[] = [];

        switch (name) {
            case "site":
                selectedIds = selectedLabels
                    .map(label => siteData?.find(site => site.label === label)?.id)
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
        } else if (name.startsWith("dates-")) {
            const index = parseInt(name.split("-")[1]);
            const newDates = [...formData.dates];
            newDates[index] = value;
            setFormData(prev => ({...prev, dates: newDates}));
            return;
        }

        setFormData(prev => ({...prev, [name]: newValue}));
        setErrors(prevErrors => ({...prevErrors, [name]: ""}));
    };

    const addDate = () => {
        setFormData(prev => ({...prev, dates: [...prev.dates, '']}));
        setErrors(prevErrors => ({...prevErrors, fromDate: undefined}));
    };

    const removeDate = (index: number) => {
        if (formData.dates.length > 1) {
            const newDates = [...formData.dates];
            newDates.splice(index, 1);
            setFormData(prev => ({...prev, dates: newDates}));
        }
    };

    // Nouvelle fonction pour gérer les changements de dates
    const handleDateChange = (index: number, newDate: string) => {
        const newDates = [...formData.dates];
        newDates[index] = newDate;
        setFormData(prev => ({...prev, dates: newDates}));
        setErrors(prevErrors => ({...prevErrors, fromDate: ""}));
    };

    const handleSubmit = async () => {
        const sitesToSend = formData.site.map(id => {
            const site = siteData?.find(s => s.id === id);
            return site ? {id: site.id, label: site.label} : null;
        }).filter((site): site is { id: number; label: string } => site !== null);

        const departmentsToSend = formData.department.map(id => {
            const dept = departmentData?.find(d => d.id === id);
            return dept ? {id: dept.id, name: dept.name} : null;
        }).filter((dept): dept is { id: number; name: string } => dept !== null);

        const payload = {
            site: sitesToSend,
            department: departmentsToSend,
            location: formData.location,
            city: formData.city,
            dates: formData.dates,
            morningStartTime: formValues.fromMorning,
            morningEndTime: formValues.toMorning,
            afternoonStartTime: formValues.fromAfternoon,
            afternoonEndTime: formValues.toAfternoon,
        }

        console.log("Payload à envoyer :", payload);

        try {
            console.log("Is edit mode:", isEditMode);
            const url = groupData
                ? `${TRAINING_GROUPE_URLS.editGroupPlanning}/${groupData.id}`
                : `${TRAINING_GROUPE_URLS.addGroupPlanning}/${trainingId}`;

            const response = await fetch(url, {
                method: groupData ? 'PUT' : 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const responseData: GroupData = await response.json();
                onGroupDataUpdated(responseData);

                setAlertMessage('Mise à jour effectuée avec succès !');
                setAlertType('success');
                setShowAlert(true);

                navigateTo(TRAINING_URLS.addPage, {
                    query: {trainingId: trainingId, groupId: responseData.id},
                });
            } else {
                const errorData = await response.json();
                console.error('Erreur lors de l\'enregistrement du groupe:', errorData);
                setErrors(errorData.errors || {general: 'Une erreur est survenue lors de l\'enregistrement.'});
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi de la requête:', error);
            setErrors({general: 'Erreur de connexion au serveur.'});
        }
    };

    return (
        <div onSubmit={(e) => e.preventDefault()}>
            {showAlert && (
                <Alert
                    message={alertMessage}
                    type={alertType}
                    onClose={handleCloseAlert}
                />
            )}
            <div className='grid md:grid-cols-2 md:gap-10 gap-4'>
                <MultiSelectField
                    options={sitesOptionsFormatted.map(opt => opt.label)}
                    label="Site"
                    value={formData.site.map(id => siteData?.find(s => s.id === id)?.label || '')}
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

                    {/* 🆕 Messages informatifs */}
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

                <InputField
                    label="Lieu"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                />
                <InputField
                    label="Ville"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                />

                {/* Champ pour la date */}
                <div className="md:col-span-1">
                    <div className="mb-2">
                        <div className="flex items-center text-formInputTextColor font-semibold text-xs md:text-sm lg:text-base w-full">
                            <label className="flex-[1] block break-words font-tHead">
                                Date(s)
                            </label>
                            <div className="flex-[4] flex justify-end">
                                <button
                                    type="button"
                                    onClick={addDate}
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-sm focus:outline-none focus:shadow-outline"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {formData.dates.map((date, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div className="flex-grow">
                                    <CustomDatePicker
                                        value={date}
                                        onChange={(newDate) => handleDateChange(index, newDate)}
                                        error={errors.fromDate?.[index]}
                                    />
                                </div>
                                {formData.dates.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeDate(index)}
                                        className="bg-red hover:bg-red-700 text-white font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline"
                                    >
                                        -
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <MultipleInputField
                    label="Horaires"
                    fromFields={[
                        {
                            label: "De",
                            name: "fromMorning",
                            type: "time",
                            value: formValues.fromMorning,
                            onChange: handleChange("fromMorning"),
                        },
                        {
                            label: "De",
                            name: "fromAfternoon",
                            type: "time",
                            value: formValues.fromAfternoon,
                            onChange: handleChange("fromAfternoon"),
                        }
                    ]}
                    toFields={[
                        {
                            label: "À",
                            name: "toMorning",
                            type: "time",
                            value: formValues.toMorning,
                            onChange: handleChange("toMorning"),
                        },
                        {
                            label: "À",
                            name: "toAfternoon",
                            type: "time",
                            value: formValues.toAfternoon,
                            onChange: handleChange("toAfternoon"),
                        }
                    ]}
                    errorFrom={errors.fromMorning}
                    errorTo={errors.toMorning}
                />
            </div>

            {/* Affichage des erreurs générales */}
            {errors.general && (
                <div className="text-redShade-500 mt-2">{errors.general}</div>
            )}

            {/* Bouton Enregistrer */}
            <div className="flex justify-end mt-4">
                <button
                    type='button'
                    className="px-6 py-2 bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd text-white rounded-md hover:bg-violet-700 transition-colors"
                    onClick={handleSubmit}
                >
                    Enregistrer
                </button>
            </div>
        </div>
    )
}

export default Planning