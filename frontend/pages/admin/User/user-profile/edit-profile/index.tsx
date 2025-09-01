import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import InputField from "@/components/FormComponents/InputField";
import CustomSelect from "@/components/FormComponents/CustomSelect";
import ProtectedRoute from "@/components/ProtectedRoute";
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";

function EditProfile() {
    const [error, setError] = useState("");
    const router = useRouter();
    const {id} = router.query;
    const {navigateTo, isCurrentPath, getPathWithoutRolePrefix} = useRoleBasedNavigation();

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
    });

    const [image, setImage] = useState<string | null>(null);

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
                    setFormData(userData);
                    setImage(userData.photo); // Afficher l'image par défaut
                } catch (error) {
                    setError("Error fetching user data");
                }
            };

            fetchUserData();
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value, files} = e.target;

        if (name === "photo" && files) {
            setFormData({...formData, photo: files[0]});
        } else {
            setFormData({...formData, [name]: value});
        }
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

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                setFormData({...formData, photo: file});
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const result = await fetch(`http://localhost:8888/api/users/update-profile/${id}`, {
                method: "PUT",
                credentials: "include",
                body: JSON.stringify(formData),
                headers: {
                    "content-type": "application/json",
                }
            });

            if (!result.ok) {
                setError("Error during update collaborator");
            }

            const json = await result.json();
            console.log("Success : ", json);

            navigateTo("/User/user-profile");
        } catch (error) {
            setError("Error during updating collaborator!!!");
        }
    };

    return (
        <ProtectedRoute>
            <div className="mx-auto bg-white font-title rounded-lg px-6 pb-14 p-2">
                <section className="mb-6">
                    <h2 className="text-base md:text-lg lg:text-xl font-bold mb-4 text-center md:text-start">
                        Informations personnelles
                    </h2>
                    {error && (
                        <div className="text-red text-center text-sm mt-4">
                            {error}
                        </div>
                    )}
                    <div className="grid grid-cols-1 lg:grid-cols-5">
                        <div className="lg:col-span-1 mb-5 lg:m-0 flex justify-center items-center">
                            <div
                                className="relative w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
                                {image ? (
                                    <img
                                        src={image}
                                        alt="Avatar"
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                ) : (
                                    <div>Aucune image</div>
                                )}
                            </div>
                        </div>
                        <div className="lg:col-span-4 grid md:grid-cols-2 gap-y-4 gap-x-8">
                            <InputField
                                label="Nom"
                                value={formData.lastName || ' || '}
                                onChange={handleChange}
                                name="lastName"
                            />
                            <InputField
                                label="Prénoms"
                                value={formData.firstName || ''}
                                onChange={handleChange}
                                name="firstName"
                            />
                            <InputField
                                label="Email"
                                value={formData.email || ''}
                                onChange={handleChange}
                                name="email"
                                disabled={true}
                            />
                            <CustomSelect
                                label="Genre"
                                name="gender"
                                options={["Homme", "Femme"]}
                                onChange={handleChangeCustomSelect}
                                value={formData.gender || ''} // Pré-remplir avec formData
                            />
                            <InputField
                                label="Adresse"
                                value={formData.address || ''}
                                onChange={handleChange}
                                name="address"
                            />
                            <InputField
                                label="Date de naissance"
                                name="birthDate"
                                type="date"
                                value={formData.birthDate || ''} // Pré-remplir avec formData
                                onChange={handleChange}
                            />
                            <InputField
                                label="Numéro de téléphone"
                                value={formData.phoneNumber || ''}
                                onChange={handleChange}
                                name="phoneNumber"
                            />
                            <InputField
                                label="CIN"
                                value={formData.cin || ''}
                                onChange={handleChange}
                                name="cin"
                            />
                        </div>
                    </div>
                </section>

                <hr className="my-6 border-gray-300"/>

                <div className="flex justify-around">
                    <div className="mt-5 text-xs md:text-sm lg:text-base">
                        <button
                            onClick={handleSubmit}
                            type="button"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-2 md:p-3 lg:p-4 rounded-xl"
                        >
                            Enregistrer
                        </button>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

export default EditProfile;