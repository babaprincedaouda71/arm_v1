import InputField from "@/components/FormComponents/InputField";
import CustomSelect from "@/components/FormComponents/CustomSelect";
import React from "react";

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

interface AddUserFormProps {
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleCancel?: () => void;
    image: string | null;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    formData: FormDataType;
    handleRemoveImage: () => void;
    handleChangeCustomSelect: (event: { name: string; value: string }) => void;
    isEditMode?: boolean;
    groupeOptions?: string[];
    departmentOptions?: string[];
    formErrors?: FormErrorsType;
}

const AddUserForm: React.FC<AddUserFormProps> = ({
                                                     handleSubmit,
                                                     handleCancel,
                                                     image,
                                                     handleChange,
                                                     formData,
                                                     handleRemoveImage,
                                                     handleChangeCustomSelect,
                                                     isEditMode = false,
                                                     groupeOptions = [],
                                                     departmentOptions = [],
                                                     formErrors = {}
                                                 }) => {
    return (
        <form
            onSubmit={handleSubmit}
            className="mx-auto bg-white font-title rounded-lg px-6 pb-14 pt-4"
        >
            {/* Section Informations Personnelles */}
            <section className="mb-6">
                <h2 className="text-base md:text-lg lg:text-xl font-bold mb-4 text-center md:text-start">
                    Informations personnelles
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-5">
                    {/* Zone upload image (à gauche) - Non obligatoire */}
                    <div className="lg:col-span-1 mb-5 lg:m-0 flex justify-center items-center">
                        <div
                            className="relative w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
                            {/* Si une image est upload, on l'affiche, sinon on montre l'icône */}
                            {image ? (
                                <img
                                    src={image}
                                    alt="Avatar"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            ) : (
                                <svg
                                    width="90"
                                    height="78"
                                    viewBox="0 0 148 136"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M105.501 32C105.501 49.397 91.3978 63.5 74.0008 63.5C56.6038 63.5 42.5008 49.397 42.5008 32C42.5008 14.603 56.6038 0.5 74.0008 0.5C91.3978 0.5 105.501 14.603 105.501 32ZM95.0008 32C95.0008 43.598 85.5988 53 74.0008 53C62.4028 53 53.0008 43.598 53.0008 32C53.0008 20.402 62.4028 11 74.0008 11C85.5988 11 95.0008 20.402 95.0008 32Z"
                                        fill="#4F53C5"
                                    />
                                    <path
                                        d="M74.0008 79.25C40.0103 79.25 11.0495 99.3492 0.0175781 127.508C2.70503 130.177 5.53605 132.701 8.49805 135.068C16.7129 109.215 42.4836 89.75 74.0008 89.75C105.518 89.75 131.289 109.215 139.504 135.068C142.466 132.701 145.297 130.177 147.984 127.508C136.952 99.3492 107.991 79.25 74.0008 79.25Z"
                                        fill="#4F53C5"
                                    />
                                </svg>
                            )}

                            {/* Bouton pour fermer l'avatar */}
                            {image && (
                                <button
                                    onClick={handleRemoveImage}
                                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow z-10"
                                >
                                    <svg
                                        width="16"
                                        height="24"
                                        viewBox="0 0 24 32"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M3.15527 21.7992L7.62077 21.3734L16.0208 12.5671L11.9768 8.32969L3.55127 17.1549L3.15527 21.7992ZM13.9857 6.22625L18.0282 10.4605L20.9487 7.39676L16.9077 3.16406L13.9857 6.22625ZM0.439344 24.6447C0.124344 24.3148 -0.033156 23.856 0.00584403 23.3909L0.574344 16.8392C0.637344 16.1212 0.940344 15.444 1.42934 14.9318L14.9233 0.79768C15.9763 -0.309986 17.8858 -0.254996 18.9973 0.90609L23.1043 5.20792L23.1058 5.20949C24.2533 6.413 24.2998 8.32667 23.2078 9.47361L9.71235 23.6093C9.22484 24.1199 8.57835 24.4373 7.89135 24.5033L1.63634 25.0988C1.59134 25.1019 1.54634 25.1035 1.49984 25.1035C1.10534 25.1035 0.722844 24.9401 0.439344 24.6447ZM24 29.8133C24 30.6775 23.325 31.3845 22.5 31.3845H1.5C0.6765 31.3845 0 30.6775 0 29.8133C0 28.9508 0.6765 28.2422 1.5 28.2422H22.5C23.325 28.2422 24 28.9508 24 29.8133Z"
                                            fill="#4F53C5"
                                        />
                                    </svg>
                                </button>
                            )}

                            {/* Champ de fichier caché */}
                            <input
                                type="file"
                                name="photo"
                                accept="image/*"
                                onChange={handleChange}
                                className="absolute inset-0 opacity-0 cursor-pointer z-0"
                            />
                        </div>
                    </div>
                    {/* Zone champs de saisies */}
                    <div className="lg:col-span-4 grid md:grid-cols-2 gap-y-4 gap-x-8">
                        <InputField
                            label="Nom"
                            name="lastName"
                            value={formData.lastName || ''}
                            onChange={handleChange}
                            error={formErrors.lastName}
                        />
                        <InputField
                            label="Prénoms"
                            name="firstName"
                            value={formData.firstName || ''}
                            onChange={handleChange}
                            error={formErrors.firstName}
                        />
                        <CustomSelect
                            label="Genre"
                            name="gender"
                            options={["Homme", "Femme"]}
                            onChange={handleChangeCustomSelect}
                            value={formData.gender || ''}
                            error={formErrors.gender}
                        />
                        <InputField
                            label="Adresse"
                            name="address"
                            value={formData.address || ''}
                            onChange={handleChange}
                            error={formErrors.address}
                        />
                        <InputField
                            label="Date de naissance"
                            name="birthDate"
                            type="date"
                            value={formData.birthDate || ''}
                            onChange={handleChange}
                            error={formErrors.birthDate}
                        />
                        <InputField
                            label="Numéro de téléphone"
                            name="phoneNumber"
                            value={formData.phoneNumber || ''}
                            onChange={handleChange}
                            error={formErrors.phoneNumber}
                        />
                        <InputField
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email || ''}
                            onChange={handleChange}
                            error={formErrors.email}
                        />
                        <InputField
                            label="CIN"
                            name="cin"
                            value={formData.cin || ''}
                            onChange={handleChange}
                            error={formErrors.cin}
                        />
                    </div>
                </div>
            </section>

            <hr className="my-6 border-gray-300"/>

            {/* Section Informations Professionnelles */}
            <section>
                <h2 className="text-base md:text-lg lg:text-xl font-bold mb-4 text-center md:text-start">
                    Informations professionnelles
                </h2>
                <div className="grid md:grid-cols-2 gap-y-4 gap-x-8 md:gap-x-16 lg:gap-x-24">
                    <InputField
                        label="Code de l'employé"
                        name="collaboratorCode"
                        value={formData.collaboratorCode || ''}
                        onChange={handleChange}
                        error={formErrors.collaboratorCode}
                    />
                    <InputField
                        label="Numéro de sécurité sociale"
                        name="socialSecurityNumber"
                        value={formData.socialSecurityNumber || ''}
                        onChange={handleChange}
                        error={formErrors.socialSecurityNumber}
                    />
                    <InputField
                        label="Date de recrutement"
                        name="hiringDate"
                        type="date"
                        value={formData.hiringDate || ''}
                        onChange={handleChange}
                        error={formErrors.hiringDate}
                    />
                    <InputField
                        label="Attestations"
                        name="attestations"
                        value={formData.attestations || ''}
                        onChange={handleChange}
                        error={formErrors.attestations}
                    />
                    {/*<InputField*/}
                    {/*    label="Département"*/}
                    {/*    name="department"*/}
                    {/*    value={formData.department || ''}*/}
                    {/*    onChange={handleChange}*/}
                    {/*    error={formErrors.department}*/}
                    {/*/>*/}
                    <CustomSelect
                        label="Département"
                        name="department"
                        options={departmentOptions}
                        onChange={handleChangeCustomSelect}
                        value={formData.department || ''}
                        error={formErrors.department}
                    />
                    <InputField
                        label="Compétences"
                        name="competences"
                        value={formData.competences || ''}
                        onChange={handleChange}
                        error={formErrors.competences}
                    />
                    <InputField
                        label="Poste"
                        name="position"
                        value={formData.position || ''}
                        onChange={handleChange}
                        error={formErrors.position}
                    />
                    <InputField
                        label="Signature"
                        name="signature"
                        value={formData.signature || ''}
                        onChange={handleChange}
                        error={formErrors.signature}
                    />
                    <InputField
                        label="Niveau hiérarchique"
                        name="niveauHierarchique"
                        value={formData.niveauHierarchique || ''}
                        onChange={handleChange}
                        error={formErrors.niveauHierarchique}
                    />
                    <CustomSelect
                        label="Groupe"
                        name="groupe"
                        options={groupeOptions}
                        onChange={handleChangeCustomSelect}
                        value={formData.groupe || ''}
                        error={formErrors.groupe}
                    />
                </div>
            </section>

            <hr className="my-6 border-gray-300"/>
            <div className="mt-5 flex justify-between"> {/* Conteneur flex avec justify-between */}
                {/* Bouton Annuler */}
                <div className="text-left text-xs md:text-sm lg:text-base">
                    <button
                        onClick={handleCancel}
                        type="button" // Change submit to button, or make sure form handles it.
                        className="text-primary border-2 font-bold p-2 md:p-3 lg:p-4 rounded-xl"
                    >
                        Annuler
                    </button>
                </div>

                {/* Bouton Submit */}
                <div className="text-right text-xs md:text-sm lg:text-base">
                    <button
                        type="submit"
                        className="bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd hover:bg-indigo-700 text-white font-bold p-2 md:p-3 lg:p-4 rounded-xl"
                    >
                        {isEditMode ? "Modifier" : "Enregistrer"}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default AddUserForm;