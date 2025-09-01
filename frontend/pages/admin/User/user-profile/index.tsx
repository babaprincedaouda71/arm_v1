import ProfileField from "@/components/ProfileField";
import React from "react";
import {useAuth} from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingSpinner from "@/components/LoadingSpinner";
import {useRoleBasedNavigation} from "@/hooks/useRoleBasedNavigation";

const UserProfile = () => {
    const {user, loading} = useAuth();
    const {navigateTo, isCurrentPath, getPathWithoutRolePrefix} = useRoleBasedNavigation();

    // Example user data for demonstration, remove when real data is working.
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


    function handleChangePassword() {
        navigateTo("/User/user-profile/change-password");
    }

    if (loading) {
        return <LoadingSpinner/>; // Ou un spinner
    }

    const handleEdit = () => {
        navigateTo(
            "/User/user-profile/edit-profile",
            {
                query: {id: user.id},
            });
    }

    return (
        <ProtectedRoute>
            <div className="mx-auto bg-white font-title rounded-lg px-6 pb-14 p-2">
                <section className="mb-6">
                    <h2 className="text-base md:text-lg lg:text-xl font-bold mb-4 text-center md:text-start">
                        Informations personnelles
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-5">
                        <div className="lg:col-span-1 mb-5 lg:m-0 flex justify-center items-center">
                            <div
                                className="relative w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
                                {exampleUserData.photo ? (
                                    <img
                                        src={exampleUserData.photo}
                                        alt="Avatar"
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                ) : (
                                    <div>Aucune image</div>
                                )}
                            </div>
                        </div>
                        <div className="lg:col-span-4 grid md:grid-cols-2 gap-y-4 gap-x-8">
                            <ProfileField label="Nom" value={user?.firstName || ''}/>
                            <ProfileField label="Prénoms" value={user?.lastName || ''}/>
                            <ProfileField label="Email" value={user?.email || ''}/>
                            {/* Ajoutez les autres champs en utilisant les propriétés de 'user' */}
                            <ProfileField label="Genre" value={user?.gender || ''}/>
                            <ProfileField label="Adresse" value={user?.address || ''}/>
                            <ProfileField
                                label="Date de naissance"
                                value={user?.birthDate || ''}
                            />
                            <ProfileField label="Numéro de téléphone" value={user?.phoneNumber || ''}/>
                            <ProfileField label="CIN" value={user?.cin || ''}/>
                        </div>
                    </div>
                </section>

                <hr className="my-6 border-gray-300"/>

                <div className={"flex justify-around"}>
                    <div className="mt-5 text-xs md:text-sm lg:text-base">
                        <button
                            onClick={handleChangePassword}
                            type="button"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-2 md:p-3 lg:p-4 rounded-xl"
                        >
                            Changer le mot de passe
                        </button>
                    </div>
                    <div className="mt-5 text-xs md:text-sm lg:text-base">
                        <button
                            onClick={handleEdit}
                            type="button"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-2 md:p-3 lg:p-4 rounded-xl"
                        >
                            Modifier
                        </button>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default UserProfile;