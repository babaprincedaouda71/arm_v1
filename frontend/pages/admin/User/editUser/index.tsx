import React, {useEffect, useMemo, useState} from "react";
import AddUserForm from "@/components/AddUserForm";
import {useRouter} from "next/router";
import useSWR from "swr";
import {DepartmentProps, GroupsProps} from "@/types/dataTypes";
import {DEPARTMENT_URLS, GROUPS_URLS} from "@/config/urls";
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";

// Fetcher for SWR
const fetcher = async (url: string) => {
    const response = await fetch(url, {
        method: "GET",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        }
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données');
    }
    return response.json();
};

function EditUser() {
    const {navigateTo, isCurrentPath, getPathWithoutRolePrefix} = useRoleBasedNavigation();
    const [error, setError] = useState("");
    const router = useRouter();
    const {id} = router.query; // Récupérer l'ID de l'utilisateur depuis l'URL

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

    console.log(departmentsOptions);

    // État pour stocker les données du formulaire
    const [formData, setFormData] = useState({
        photo: null,
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

    // Récupérer les données de l'utilisateur à partir de l'API
    useEffect(() => {
        if (id) {
            const fetchUserData = async () => {
                try {
                    const response = await fetch(`http://localhost:8888/api/users/get/${id}`, {
                        method: "GET",
                        credentials: "include",
                    });

                    if (!response.ok) {
                        throw new Error("Failed to fetch user data");
                    }

                    const userData = await response.json();
                    console.log(userData);
                    setFormData(userData); // Pré-remplir le formulaire avec les données récupérées
                } catch (error) {
                    setError("Error fetching user data");
                }
            };

            fetchUserData();
        }
    }, [id]);

    // Fonction pour gérer les changements dans les champs du formulaire
    const handleChange = (e) => {
        const {name, value, files} = e.target;
        if (name === "photo") {
            setFormData({...formData, photo: files[0]});
        } else {
            setFormData({...formData, [name]: value});
        }
    };

    // Fonction pour soumettre le formulaire de modification
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Données du formulaire :", formData);

        try {
            const result = await fetch(`http://localhost:8888/api/users/update/${id}`, {
                method: "PUT", // ou "PATCH" selon votre API
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!result.ok) {
                setError("Error during update collaborator");
            }

            const json = await result.json();
            console.log("Success : ", json);

            navigateTo("/User");
        } catch (error) {
            setError("Error during updating collaborator!!!");
        }
    };

    const [image, setImage] = useState(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
    };

    // Fonction pour gérer les changements dans les champs du formulaire
    const handleChangeCustomSelect = (event) => {
        const {name, value} = event;

        // Mettre à jour l'état formData avec la nouvelle valeur
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    return (
        <>
            <AddUserForm
                formData={formData}
                image={image}
                handleSubmit={handleSubmit}
                handleRemoveImage={handleRemoveImage}
                handleChange={handleChange}
                handleChangeCustomSelect={handleChangeCustomSelect}
                groupeOptions={groupeOptions}
                departmentOptions={departmentsOptions}
            />
        </>
    );
}

export default EditUser;