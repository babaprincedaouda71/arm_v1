import React, { useState } from "react";
import InputField from "../Forms/InputField";
import SelectField from "../Forms/SelectField";

const ManualEntry = () => {
    // État pour stocker les données du formulaire
    const [formData, setFormData] = useState({
        axe: "",
        site: "",
        domaine: "",
        nbrDay: "",
        nbrGroup: "",
        qualification: "",
        validity: "",
        objective: "",
        content: "",
        department: "",
        theme: "",
        type: "",
        csf: "",
    });
    // Fonction pour gérer les changements dans les champs du formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    return (
        <form className="mx-auto bg-white font-title rounded-lg px-6 pb-14">
            <div className="flex justify-between items-center">
                <h2 className="text-base md:text-lg lg:text-xl font-bold mb-4 text-center md:text-start">
                    Veuillez choisir l'axe à partir duquel vous souhaitez ajouter le thème
                </h2>
                <SelectField label={undefined} name={undefined} options={["Axe 1", "Axe 2", "Axe 3"]} onChange={undefined}/>
            </div>
            <div className="grid md:grid-cols-2 gap-y-4 gap-x-8 md:gap-x-16 lg:gap-x-24 mb-4">
                <InputField label="Site" name="site" onChange={handleChange} />
                <InputField
                    label="Département"
                    name="department"
                    onChange={handleChange}
                />
                <InputField label="Domaine" name="domaine" onChange={handleChange} />
                <InputField label="Thème" name="theme" onChange={handleChange} />
                <InputField label="Nbr de jour" name="nbrDay" onChange={handleChange} />
                <InputField label="Type" name="type" onChange={handleChange} />
                <InputField
                    label="Nbr de groupe"
                    name="nbrGroup"
                    onChange={handleChange}
                />
                <InputField label="CSF" name="csf" onChange={handleChange} />
                <InputField
                    label="Qualification"
                    name="qualification"
                    onChange={handleChange}
                />
            </div>
            <div className="grid grid-cols-2">
                <div className="col-span-1 grid gap-y-4">
                    <InputField
                        label="Validité"
                        name="validity"
                        onChange={handleChange}
                    />
                    <InputField
                        label="Objectif"
                        name="objective"
                        onChange={handleChange}
                    />
                    <InputField label="Contenu" name="content" onChange={handleChange} />
                </div>
                <div className="col-span-1"></div>
            </div>

            {/* Bouton Submit */}
            <div className="mt-5 text-right text-xs md:text-sm lg:text-base">
                <button
                    type="submit"
                    className="bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd hover:bg-indigo-700 text-white font-bold p-2 md:p-3 lg:p-4 rounded-xl"
                >
                    Enregistrer
                </button>
            </div>
        </form>
    );
};

export default ManualEntry;
