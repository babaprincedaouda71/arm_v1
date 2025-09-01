import React, {useEffect, useState} from "react";
import InputField from "@/components/FormComponents/InputField";
import {useAuth} from "@/contexts/AuthContext";
import router from "next/router";
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";

const ChangePassword = () => {
    const {navigateTo, isCurrentPath, getPathWithoutRolePrefix} = useRoleBasedNavigation();
    const {user, logout} = useAuth();
    const [formData, setFormData] = useState({
        email: "",
        currentPassword: "",
        newPassword: "",
        confirmationPassword: "",
    });
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState<{ [key: string]: string }>({}); // État pour stocker les erreurs

    useEffect(() => {
        if (user) {
            setFormData((prev) => ({
                ...prev,
                email: user.username || "", // Assurez-vous que l'email est défini si user.username existe
            }));
            setLoading(false);
        } else {
            // Rediriger vers la page de connexion ou gérer un utilisateur non authentifié
            navigateTo("/signin");
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
        // Effacer l'erreur associée au champ lorsqu'il est modifié
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Empêcher le rechargement de la page

        try {
            const response = await fetch("http://localhost:8888/api/users/change-password", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json(); // Récupérer les détails de l'erreur
                throw errorData; // Lancer l'erreur avec les détails
            }

            // Déconnexion après la mise à jour du mot de passe
            await logout();
        } catch (error) {
            console.error("Error:", error);
            if (error.code) {
                // Afficher les erreurs spécifiques en fonction du code d'erreur
                switch (error.code) {
                    case "INCORRECT_PASSWORD":
                        setErrors({currentPassword: error.message});
                        break;
                    case "PASSWORD_MISMATCH":
                        setErrors({confirmationPassword: error.message});
                        break;
                    case "PASSWORD_UPDATE":
                        setErrors({newPassword: error.message});
                        break;
                    default:
                        setErrors({general: "Une erreur s'est produite. Veuillez réessayer."});
                }
            } else {
                setErrors({general: "Une erreur s'est produite. Veuillez réessayer."});
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>; // Afficher un indicateur de chargement
    }

    return (
        <form onSubmit={handleSubmit} className={"w-full mx-auto p-6 space-y-6 bg-white rounded-lg"}>
            <h1 className="text-xl font-bold mb-4">Changer mot de passe</h1>

            {/* Champ : Mot de passe actuel */}
            <InputField
                type={"password"}
                autoComplete={"currentPassword"}
                label={"Mot de passe actuel"}
                name={"currentPassword"}
                onChange={handleChange}
                value={formData.currentPassword}
                className={"w-1/2"}
                error={errors.currentPassword} // Afficher l'erreur associée
            />

            {/* Champ : Nouveau mot de passe */}
            <InputField
                type={"password"}
                autoComplete={"newPassword"}
                label={"Nouveau mot de passe"}
                name={"newPassword"}
                onChange={handleChange}
                value={formData.newPassword}
                className={"w-1/2"}
                error={errors.newPassword} // Afficher l'erreur associée
            />

            {/* Champ : Confirmer nouveau mot de passe */}
            <InputField
                type={"password"}
                autoComplete={"confirmationPassword"}
                label={"Confirmer nouveau mot de passe"}
                name={"confirmationPassword"}
                onChange={handleChange}
                value={formData.confirmationPassword}
                className={"w-1/2"}
                error={errors.confirmationPassword} // Afficher l'erreur associée
            />

            {/* Erreur générale */}
            {errors.general && (
                <div className="text-red text-sm mt-2">{errors.general}</div>
            )}

            {/* Bouton de soumission */}
            <div className="mt-5 text-xs md:text-sm lg:text-base">
                <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-2 md:p-3 lg:p-4 rounded-xl"
                >
                    Modifier
                </button>
            </div>
        </form>
    );
};

export default ChangePassword;