import {useState} from "react";
import Image from "next/image";
import {useRouter} from "next/router";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";

export default function ForgotPassword() {
    const [formData, setFormData] = useState({
        email: "",
    });
    const [error, setError] = useState("");
    const [emailError, setEmailError] = useState(""); // Pour les erreurs spécifiques à l'email
    const router = useRouter();

    const handleChange = (event) => {
        const {value, name} = event.target;
        setFormData((prev) => ({...prev, [name]: value}));
        // Réinitialiser l'erreur de l'email lorsque l'utilisateur commence à taper
        if (name === "email") {
            setEmailError("");
        }
    };

    const validateEmail = (email) => {
        // Une expression régulière simple pour valider l'email
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleSubmitEmail = async (event) => {
        event.preventDefault();
        setError("");
        setEmailError("");

        // Validation de l'email côté client
        if (!formData.email) {
            setEmailError("L'email est obligatoire.");
            return;
        } else if (!validateEmail(formData.email)) {
            setEmailError("Veuillez entrer une adresse email valide.");
            return;
        }

        try {
            const result = await fetch("http://localhost:8888/api/auth/forgot-password", {
                method: "POST",
                body: JSON.stringify({email: formData.email}),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const response = await result.json(); // Extraire la réponse JSON

            if (result.ok) {
                // Si la requête réussit, rediriger l'utilisateur
                router.push("/reset-password-email");
            } else {
                // Gérer les erreurs spécifiques du backend
                if (response.error === "EMAIL_DOES_NOT_EXIST") {
                    setEmailError(response.message || "L'adresse email n'existe pas.");
                } else {
                    setError(response.message || "Erreur lors de l'envoi de l'email.");
                }
            }
        } catch (error) {
            console.error("Erreur lors de la validation de l'email", error);
            setError("Une erreur s'est produite. Veuillez réessayer plus tard.");
        }
    };

    return (
        <div
            className="flex justify-center items-center min-h-screen bg-authBgColor flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
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
                <ForgotPasswordForm
                    handleSubmitEmail={handleSubmitEmail}
                    formData={formData}
                    handleChange={handleChange}
                    error={error}
                    emailError={emailError} // Passer l'erreur spécifique à l'email
                />
            </div>
        </div>
    );
}

ForgotPassword.useLayout = false;