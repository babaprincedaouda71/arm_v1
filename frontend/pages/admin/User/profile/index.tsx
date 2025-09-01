import React from "react";
import ProfileField from "@/components/ProfileField";
import ProtectedRoute from "@/components/ProtectedRoute";
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";

const Profil = ({userData}) => {
    const {navigateTo, isCurrentPath, getPathWithoutRolePrefix} = useRoleBasedNavigation();
    // Example user data for demonstration
    const exampleUserData = {
        photo:
            "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        nom: "Dupont",
        prenoms: "Jean-Claude",
        genre: "Homme",
        adresse: "123 Rue de la Paix, Paris",
        dateNaissance: "1985-06-15",
        telephone: "+33 6 12 34 56 78",
        email: "jean.dupont@example.com",
        cin: "123456789",
        codeEmploye: "EMP-4567",
        numeroSecuriteSociale: "789456123",
        dateRecrutement: "2020-01-15",
        attestations: "Certification Agile, Certification Scrum Master",
        departement: "Informatique",
        competences: "Développement Web, Gestion de projet",
        poste: "Chef de projet",
        signature: "Jean Dupont",
        niveauHierarchique: "Niveau 3",
    };

    const handleEdit = () => {
        navigateTo("/User/editUser", {
            query: {id: data.id},
        });
    }

    const data = userData;
    return (
        <ProtectedRoute>
            <div className="mx-auto bg-white font-title rounded-lg px-6 pb-14 p-2">
                {/* Section Informations Personnelles */}
                <section className="mb-6">
                    <h2 className="text-base md:text-lg lg:text-xl font-bold mb-4 text-center md:text-start">
                        Informations personnelles
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-5">
                        {/* Zone d'upload image (à gauche) */}
                        <div className="lg:col-span-1 mb-5 lg:m-0 flex justify-center items-center">
                            <div
                                className="relative w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
                                {/* Si une image est uploadée, on l'affiche, sinon on montre l'icône */}
                                {exampleUserData.photo ? (
                                    <img
                                        src={exampleUserData.photo}
                                        alt="Avatar"
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                ) : (
                                    <div>Aucune image</div>
                                )}

                                {/* Bouton pour fermer l'avatar */}
                                {/* {image && (
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
              )} */}

                                {/* Champ de fichier caché */}
                                {/* <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer z-0"
              /> */}
                            </div>
                        </div>
                        {/* Zone champs de saisies */}
                        <div className="lg:col-span-4 grid md:grid-cols-2 gap-y-4 gap-x-8">
                            <ProfileField label="Nom" value={data.lastName}/>
                            <ProfileField label="Prénoms" value={data.firstName}/>
                            <ProfileField label="Genre" value={data.gender}/>
                            <ProfileField label="Adresse" value={data.address}/>
                            <ProfileField
                                label="Date de naissance"
                                value={data.birthDate}
                            />
                            <ProfileField label="Numéro de téléphone" value={data.phoneNumber}/>
                            <ProfileField label="Email" value={data.email}/>

                            <ProfileField label="CIN" value={data.cin}/>
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
                        <ProfileField label="Code de l'employé" value={data.collaboratorCode}/>
                        <ProfileField
                            label="Numéro de sécurité sociale"
                            value={data.socialSecurityNumber}
                        />
                        <ProfileField
                            label="Date de recrutement"
                            value={data.hiringDate}
                        />
                        <ProfileField label="Attestations" value={""}/>
                        <ProfileField label="Département" value={data.department}/>
                        <ProfileField label="Compétences" value={""}/>
                        <ProfileField label="Poste" value={data.position}/>
                        <ProfileField label="Signature" value={""}/>
                        <ProfileField
                            label="Niveau hiérarchique"
                            value={""}
                        />
                    </div>
                </section>

                {/* Bouton Submit */}
                <div className="mt-5 text-right text-xs md:text-sm lg:text-base">
                    <button
                        onClick={handleEdit}
                        type="button"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-2 md:p-3 lg:p-4 rounded-xl"
                    >
                        Modifier
                    </button>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default Profil;