// SettingPassword.tsx
import {useEffect, useState} from "react";
import Image from "next/image";
import {useRouter} from "next/router";
import SettingPasswordForm from "@/components/SettingPasswordForm";
import {AUTH_URLS} from "@/config/urls";

// Définir un type pour les erreurs
type FormErrors = {
    email?: string;
    password?: string;
    confirmationPassword?: string;
    general?: string;
    token?: string; // Ajout pour gérer l'erreur de token expiré
};

export default function SettingPassword() {
    const router = useRouter();
    const {token} = router.query;
    const [email, setEmail] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmationPassword: "",
    });
    const [error, setError] = useState<FormErrors>({}); // Appliquer le type FormErrors

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {value, name} = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError((prev) => ({...prev, [name]: ""})); // Effacer l'erreur spécifique au champ
    };

    const validateForm = () => {
        const errors: FormErrors = {}; // Utiliser le type FormErrors

        // Validation de l'email
        if (!formData.email) {
            errors.email = "L'adresse email est obligatoire";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = "L'adresse email est invalide";
        }

        // Validation du mot de passe
        if (!formData.password) {
            errors.password = "Le mot de passe est obligatoire";
        }
        // else if (formData.password.length < 8) {
        //     errors.password = "Le mot de passe doit contenir au moins 8 caractères";
        // }

        // Validation de la confirmation du mot de passe
        if (!formData.confirmationPassword) {
            errors.confirmationPassword = "La confirmation du mot de passe est obligatoire";
        } else if (formData.confirmationPassword !== formData.password) {
            errors.confirmationPassword = "Les mots de passe ne correspondent pas";
        }

        setError(errors); // Mettre à jour les erreurs
        return Object.keys(errors).length === 0; // Retourne true si aucune erreur n'est trouvée
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError({}); // Réinitialiser les erreurs avant de soumettre

        // Valider le formulaire avant de soumettre
        if (!validateForm()) {
            return; // Arrêter la soumission si le formulaire est invalide
        }

        fetch(AUTH_URLS.setting_password, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then((res) => {
                if (!res.ok) {
                    return res.json().then(err => {
                        console.error("Erreur du backend:", err);
                        return Promise.reject(err);
                    });
                }
                return res.json();
            })
            .then((data) => {
                console.log("Success:", data);
                router.push({
                    pathname: "/account-creation/general-infos",
                    query: {
                        mainContactEmail: data.email,
                        companyId: data.companyId,
                    },
                });
            })
            .catch((err) => {
                console.error("Error:", err);
                if (err.field === "token" && err.message) {
                    // Gérer l'erreur spécifique du token expiré
                    setError({token: err.message});
                } else if (err.field) {
                    setError({[err.field]: err.message}); // Afficher l'erreur sous le champ concerné
                } else {
                    setError({general: err.message || "Une erreur s'est produite"});
                }
            });
    };

    useEffect(() => {
        if (token) {
            fetch(`http://localhost:8888/api/auth/get-email?token=${token}`)
                .then((res) => {
                    if (!res.ok) {
                        return res.json().then(err => Promise.reject(err));
                    }
                    return res.json();
                })
                .then((data) => {
                    setEmail(data.email);
                })
                .catch((err) => {
                    console.error("Erreur :", err.error || "Erreur inconnue");
                    setError({general: err.error || "Une erreur s'est produite"});
                });
        }
    }, [token]);

    useEffect(() => {
        if (email) {
            setFormData((prev) => ({
                ...prev,
                email: email,
            }));
        }
    }, [email]);

    return (
        <div
            className="flex min-h-screen bg-authBgColor flex-col md:flex-row items-center justify-center p-4 md:p-8 gap-8">
            <div className="w-full max-w-2xl">
                <div className="relative w-full aspect-[1.11] max-h-[573px]">
                    <Image
                        src="/images/auth-banner.png"
                        fill
                        style={{objectFit: 'contain'}}
                        alt="Sign Up Picture"
                        priority
                    />
                </div>
            </div>

            <div className="w-full max-w-xl px-4 md:px-16">
                <SettingPasswordForm
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    error={error}
                />
            </div>
        </div>
    );
}

SettingPassword.useLayout = false;