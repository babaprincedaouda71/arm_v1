import React, {useMemo, useState} from "react";
import AddUserForm from "@/components/AddUserForm";
import {useRouter} from "next/router";
import useSWR from "swr";
import {DepartmentProps, GroupsProps} from "@/types/dataTypes";
import {fetcher} from "@/services/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import {UserRole} from "@/contexts/AuthContext";
import {DEPARTMENT_URLS, GROUPS_URLS, USERS_URLS} from "@/config/urls";
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";

// Interface pour les erreurs de formulaire
interface FormErrorsType {
    [key: string]: string;
}

// Interface pour les données du formulaire
interface FormDataType {
    photo: File | null;
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    birthDate: string;
    phoneNumber: string;
    address: string;
    cin: string;
    collaboratorCode: string;
    hiringDate: string;
    socialSecurityNumber: string;
    department: string;
    groupe: string;
    position: string;
    attestations: string;
    competences: string;
    signature: string;
    niveauHierarchique: string;
    password: string;

    [key: string]: any; // Pour permettre l'accès dynamique aux propriétés
}

function AddUser() {
    const {navigateTo, isCurrentPath, getPathWithoutRolePrefix} = useRoleBasedNavigation();
    const [error, setError] = useState<string>("");
    const router = useRouter();
    // fetching groups
    const {
        data: groupsData,
        error: groupsError
    } = useSWR<GroupsProps[]>(GROUPS_URLS.mutate, fetcher);
    const groupeOptions = useMemo(() => {
        if (groupsData) {
            return groupsData.map(group => group.name);
        }
        return [];
    }, [groupsData]);

    // fetching departments
    const {
        data: departmentsData,
        error: departmentsError,
    } = useSWR<DepartmentProps[]>(DEPARTMENT_URLS.mutate, fetcher);
    const departmentsOptions = useMemo(() => {
        if (departmentsData) {
            return departmentsData.map(group => group.name);
        }
        return [];
    }, [departmentsData]);

    // État pour stocker les erreurs de validation par champ
    const [formErrors, setFormErrors] = useState<FormErrorsType>({});

    // État pour stocker les données du formulaire
    const [formData, setFormData] = useState<FormDataType>({
        photo: null, // Image upload - non obligatoire
        firstName: "",
        lastName: "",
        email: "",
        gender: "",
        birthDate: "",
        phoneNumber: "",
        address: "",
        cin: "",
        collaboratorCode: "",
        hiringDate: "",
        socialSecurityNumber: "",
        department: "",
        groupe: "",
        position: "",
        attestations: "",
        competences: "",
        signature: "",
        niveauHierarchique: "",
        password: "",
    });

    // Fonction pour gérer les changements dans les champs du formulaire
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value, files} = e.target;

        // Effacer l'erreur de ce champ lorsqu'il est modifié
        if (formErrors[name]) {
            setFormErrors({
                ...formErrors,
                [name]: ""
            });
        }

        if (name === "photo" && files && files.length > 0) {
            setFormData({...formData, photo: files[0]});
        } else {
            setFormData({...formData, [name]: value});
        }
    };

    // Validation du formulaire
    const validateForm = (): boolean => {
        const errors: FormErrorsType = {};
        let isValid = true;

        // Liste des champs obligatoires (tous sauf photo)
        const requiredFields = [
            {name: "firstName", label: "Prénoms"},
            {name: "lastName", label: "Nom"},
            {name: "email", label: "Email"},
            {name: "gender", label: "Genre"},
            // { name: "birthDate", label: "Date de naissance" },
            {name: "phoneNumber", label: "Numéro de téléphone"},
            // { name: "address", label: "Adresse" },
            {name: "cin", label: "CIN"},
            {name: "collaboratorCode", label: "Code de l'employé"},
            {name: "hiringDate", label: "Date de recrutement"},
            {name: "socialSecurityNumber", label: "Numéro de sécurité sociale"},
            {name: "department", label: "Département"},
            {name: "groupe", label: "Groupe"},
            {name: "position", label: "Poste"},
            // { name: "attestations", label: "Attestations" },
            // { name: "competences", label: "Compétences" },
            // { name: "signature", label: "Signature" },
            // { name: "niveauHierarchique", label: "Niveau hiérarchique" }
        ];

        // Vérifier chaque champ obligatoire
        requiredFields.forEach(field => {
            if (!formData[field.name] || formData[field.name].toString().trim() === "") {
                errors[field.name] = `Le champ ${field.label} est obligatoire`;
                isValid = false;
            }
        });

        // Validation spécifique pour l'email
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = "Veuillez entrer une adresse email valide";
            isValid = false;
        }

        // Validation du numéro de téléphone
        if (formData.phoneNumber && !/^\d+$/.test(formData.phoneNumber)) {
            errors.phoneNumber = "Le numéro de téléphone ne doit contenir que des chiffres";
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    //Fonction pour revenir en arrière
    const handleCancel = () => {
        navigateTo("/User");
    }

    // Fonction pour soumettre le formulaire
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Valider le formulaire avant soumission
        if (!validateForm()) {
            setError("Veuillez corriger les erreurs dans le formulaire");
            return;
        }

        console.log("Données du formulaire :", formData);

        try {
            const result = await fetch(USERS_URLS.add, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!result.ok) {
                const errorData = await result.json();
                setError(errorData.message || "Erreur lors de l'ajout du collaborateur");
                return;
            }

            const json = await result.json();
            console.log("Success : ", json);

            navigateTo("/User");
        } catch (error) {
            console.error("Erreur:", error);
            setError("Erreur lors de l'enregistrement du collaborateur!");
        }
    };

    const [image, setImage] = useState<string | null>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
    };

    // Fonction pour gérer les changements dans les champs du formulaire
    const handleChangeCustomSelect = (event: { name: string; value: string }) => {
        const {name, value} = event;

        // Effacer l'erreur de ce champ lorsqu'il est modifié
        if (formErrors[name]) {
            setFormErrors({
                ...formErrors,
                [name]: ""
            });
        }

        // Mettre à jour l'état formData avec la nouvelle valeur
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    return (
        <ProtectedRoute requiredRole={UserRole.Admin}>
            {error && (
                <div className="bg-red-100 border border-red text-red px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <AddUserForm
                formData={formData}
                image={image}
                handleSubmit={handleSubmit}
                handleCancel={handleCancel}
                handleRemoveImage={handleRemoveImage}
                handleChange={handleChange}
                handleChangeCustomSelect={handleChangeCustomSelect}
                groupeOptions={groupeOptions}
                departmentOptions={departmentsOptions}
                formErrors={formErrors}
            />
        </ProtectedRoute>
    );
}

export default AddUser;