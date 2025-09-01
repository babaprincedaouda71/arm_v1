import {useEffect, useState} from "react";
import Image from "next/image";
import {useRouter} from "next/router";
import ResetPasswordForm from "@/components/ResetPasswordForm";

export default function ResetPassword() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const {token} = router.query;


    const handleChange = (event) => {
        const {value, name} = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Exclure `confirmPassword` des données envoyées
        const {confirmPassword, ...dataToSend} = formData;

        console.log(dataToSend); // Vérifie que `confirmPassword` est bien exclu
        // Envoie `dataToSend` au backend (exemple avec fetch)
        fetch("http://localhost:8888/api/auth/reset-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSend),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("Success:", data)
                router.push("http://localhost:3000/signin")
            })
            .catch((err) => console.error("Error:", err));
    };

    useEffect(() => {
        console.log("token:", token);
        if (token) {
            fetch(`http://localhost:8888/api/auth/get-email-from-reset-token?token=${token}`)
                .then((res) => res.json())
                .then(data => {
                    setEmail(data.email)
                    console.log(data.email);
                })
                .catch((err) => console.log(err));
        }
    }, [token])

    // Mettre à jour formData.email quand email change
    useEffect(() => {
        if (email) {
            setFormData((prev) => ({
                ...prev,
                email: email, // Mettre à jour l'email dans le formulaire
            }));
        }
    }, [email]);

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
                <ResetPasswordForm
                    handleSubmit={handleSubmit}
                    formData={formData}
                    handleChange={handleChange}
                    error={error}
                />
            </div>
        </div>
    );
}

ResetPassword.useLayout = false;