import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import SigningForm from "src/components/SigningForm";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
    const router = useRouter();
    const { login } = useAuth();

    const handleChange = (event) => {
        const { value, name } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError(null); // Effacer l'erreur générale
        setFieldErrors((prev) => ({ ...prev, [name]: "" })); // Effacer l'erreur spécifique au champ
    };

    const validateForm = () => {
        const errors: { email?: string; password?: string } = {};

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

        setFieldErrors(errors); // Mettre à jour les erreurs de champ
        return Object.keys(errors).length === 0; // Retourne true si aucune erreur n'est trouvée
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null); // Réinitialiser l'erreur générale

        // Valider le formulaire avant de soumettre
        if (!validateForm()) {
            return; // Arrêter la soumission si le formulaire est invalide
        }

        const result = await login(formData.email, formData.password);
        if (!result.success) {
            setError(result.error || "Erreur lors de la connexion");
            setFormData({ email: "", password: "" }); // Vider le formulaire en cas d'échec
        }
    };

    const handleSignup = () => {
        router.push("/account-creation/first-step");
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-authBgColor flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
            <div className="w-full max-w-[638px] h-auto">
                <Image
                    src="/images/auth-banner.png"
                    width={638}
                    height={573}
                    alt="Illustration de connexion"
                    priority
                />
            </div>
            <div className="w-full max-w-[473px]">
                <SigningForm
                    handleSubmit={handleSubmit}
                    formData={formData}
                    handleChange={handleChange}
                    handleSignup={handleSignup}
                    error={error}
                    fieldErrors={fieldErrors}
                />
            </div>
        </div>
    );
}

Login.useLayout = false;