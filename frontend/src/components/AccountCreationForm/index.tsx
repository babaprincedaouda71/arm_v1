// AccountCreationForm.jsx
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {useState} from "react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const validationSchema = yup.object({
    companyName: yup
        .string()
        .required("La raison sociale est obligatoire")
        .min(2, "La raison sociale doit comporter au moins 2 caractères"),
    cnss: yup
        .string()
        .required("Le numéro CNSS est obligatoire")
        .min(2, "Le numéro CNSS doit comporter au moins 2 caractères"),
    mainContactLastName: yup
        .string()
        .required("Le nom est obligatoire")
        .min(2, "Le nom doit comporter au moins 2 caractères"),
    mainContactFirstName: yup
        .string()
        .required("Le prénom est obligatoire")
        .min(2, "Le prénom doit comporter au moins 2 caractères"),
    mainContactRole: yup
        .string()
        .required("La fonction est obligatoire"),
    mainContactEmail: yup
        .string()
        .required("L'email professionnel est obligatoire")
        .email("Veuillez saisir un email valide"),
    mainContactPhone: yup
        .string()
        .required("Le numéro de téléphone est obligatoire")
        .min(8, "Le numéro de téléphone n'est pas valide"),
    terms: yup
        .boolean()
        .oneOf([true], "Vous devez accepter les conditions d'utilisation")
});

const AccountCreationForm = ({handleSigning, onSubmitSuccess}) => {
    const [apiError, setApiError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: {errors, touchedFields},
        trigger,
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: "onBlur", // Validation lors du blur du champ
        defaultValues: {
            companyName: "",
            cnss: "",
            mainContactFirstName: "",
            mainContactLastName: "",
            mainContactRole: "",
            mainContactEmail: "",
            mainContactPhone: "",
            terms: false
        }
    });

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setApiError(null);

        try {
            const result = await onSubmitSuccess(data);
            if (result && result.apiError) {
                setApiError(result.message);
            }
        } catch (error) {
            setApiError("Une erreur inattendue s'est produite. Veuillez réessayer.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePhoneChange = (value) => {
        setValue("mainContactPhone", value, {shouldValidate: true, shouldDirty: true, shouldTouch: true});
    };

    const handleBlur = (name) => {
        trigger(name);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
                <h2 className="text-2xl md:text-3xl font-medium mb-4">Créer un compte</h2>
                {apiError && (
                    <div className="p-3 bg-rose-100 border border-red text-red rounded-lg mt-4">
                        {apiError}
                    </div>
                )}
            </div>

            <div>
                <label className="block text-base font-medium text-formInputTextColor">
                    Nom de l'entreprise
                </label>
                <input
                    type="text"
                    {...register("companyName")}
                    onBlur={() => handleBlur("companyName")}
                    className={`mt-1 h-14 block w-full px-3 py-2 border ${
                        errors.companyName ? "border-red" : "border-gray-300"
                    } rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {errors.companyName && (
                    <p className="mt-1 text-sm text-red">{errors.companyName.message}</p>
                )}
            </div>

            <div>
                <label className="block text-base font-medium text-formInputTextColor">
                    Numéro de CNSS
                </label>
                <input
                    type="text"
                    {...register("cnss")}
                    onBlur={() => handleBlur("cnss")}
                    className={`mt-1 h-14 block w-full px-3 py-2 border ${
                        errors.cnss ? "border-red" : "border-gray-300"
                    } rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {errors.cnss && (
                    <p className="mt-1 text-sm text-red">{errors.cnss.message}</p>
                )}
            </div>

            <div>
                <label className="block text-base font-medium text-formInputTextColor">
                    Nom
                </label>
                <input
                    type="text"
                    {...register("mainContactLastName")}
                    onBlur={() => handleBlur("mainContactLastName")}
                    className={`mt-1 h-14 block w-full px-3 py-2 border ${
                        errors.mainContactLastName ? "border-red" : "border-gray-300"
                    } rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {errors.mainContactLastName && (
                    <p className="mt-1 text-sm text-red">{errors.mainContactLastName.message}</p>
                )}
            </div>

            <div>
                <label className="block text-base font-medium text-formInputTextColor">
                    Prénoms
                </label>
                <input
                    type="text"
                    {...register("mainContactFirstName")}
                    onBlur={() => handleBlur("mainContactFirstName")}
                    className={`mt-1 h-14 block w-full px-3 py-2 border ${
                        errors.mainContactFirstName ? "border-red" : "border-gray-300"
                    } rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {errors.mainContactFirstName && (
                    <p className="mt-1 text-sm text-red">{errors.mainContactFirstName.message}</p>
                )}
            </div>

            <div>
                <label className="block text-base font-medium text-formInputTextColor">
                    Poste
                </label>
                <input
                    type="text"
                    {...register("mainContactRole")}
                    onBlur={() => handleBlur("mainContactRole")}
                    className={`mt-1 h-14 block w-full px-3 py-2 border ${
                        errors.mainContactRole ? "border-red" : "border-gray-300"
                    } rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {errors.mainContactRole && (
                    <p className="mt-1 text-sm text-red">{errors.mainContactRole.message}</p>
                )}
            </div>

            <div>
                <label className="block text-base font-medium text-formInputTextColor">
                    Email Professionnel
                </label>
                <input
                    type="email"
                    {...register("mainContactEmail")}
                    onBlur={() => handleBlur("mainContactEmail")}
                    className={`mt-1 h-14 block w-full px-3 py-2 border ${
                        errors.mainContactEmail ? "border-red" : "border-gray-300"
                    } rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {errors.mainContactEmail && (
                    <p className="mt-1 text-sm text-red">{errors.mainContactEmail.message}</p>
                )}
            </div>

            <div>
                <label className="block text-base font-medium text-formInputTextColor">
                    Téléphone Professionnel
                </label>
                <PhoneInput
                    country={'ma'}
                    value=""
                    onChange={handlePhoneChange}
                    onBlur={() => handleBlur("mainContactPhone")}
                    inputProps={{
                        name: 'mainContactPhone',
                        required: true,
                    }}
                    containerClass={`mt-2 ${errors.mainContactPhone ? "phone-input-error" : ""}`}
                    inputClass={`h-14 w-full px-3 py-2 border ${
                        errors.mainContactPhone ? "border-red" : "border-gray-300"
                    } rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    buttonClass={errors.mainContactPhone ? "phone-button-error" : ""}
                />
                {errors.mainContactPhone && (
                    <p className="mt-1 text-sm text-red">{errors.mainContactPhone.message}</p>
                )}
            </div>

            <div className="flex items-start gap-2">
                <input
                    id="terms"
                    {...register("terms")}
                    type="checkbox"
                    className={`mt-1 h-6 w-6 text-black focus:ring-black border-gray-300 rounded ${
                        errors.terms ? "border-red" : ""
                    }`}
                />
                <label
                    htmlFor="terms"
                    className="block text-sm md:text-base text-gray-900"
                >
                    Par la création du compte, J'accepte{" "}
                    <a href="#" className="text-black hover:text-indigo-900 underline">
                        Conditions d'utilisation
                    </a>{" "}
                    et{" "}
                    <a href="#" className="text-black hover:text-indigo-900 underline">
                        Politique de confidentialité
                    </a>
                    .
                </label>
            </div>
            {errors.terms && (
                <p className="mt-1 text-sm text-red">{errors.terms.message}</p>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 flex justify-center items-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-primary hover:bg-primary_hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70"
            >
                {isSubmitting ? "Inscription En Cours..." : "Inscription"}
            </button>

            <div className="text-center text-base md:text-lg font-medium text-gray-700">
                <p>
                    Déjà un compte?{" "}
                    <button type="button" className="font-bold text-primary" onClick={handleSigning}>
                        Connexion
                    </button>
                </p>
            </div>
        </form>
    );
};

export default AccountCreationForm;