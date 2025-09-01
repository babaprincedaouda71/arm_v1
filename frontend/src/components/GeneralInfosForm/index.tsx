import CustomSelect from "@/components/FormComponents/CustomSelect";

const SigningForm = ({handleSubmit, formData, handleChange, handleSelectChange}) => {
    const inputStyle =
        "mt-1 block h-14 w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
    return (
        <div className="space-y-6">
            <div className="flex flex-col items-center">
                <h2 className="text-3xl font-medium">Taille de l'entreprise</h2>
                <p className="text-gray-600 text-md">Pour activer le compte</p>
            </div>
            <div>
                <label className="block text-md font-medium text-gray-700">
                    Secteur d'activité
                </label>
                <CustomSelect
                    name="sector"
                    options={
                        [
                            "Agriculture et agroalimentaire",
                            "Industrie manufacturière",
                            "Construction",
                            "Commerce de détail",
                            "Services financiers",
                            "Technologies de l'information",
                            "Transport et logistique",
                            "Énergie",
                            "Autre..."
                        ]
                }
                    value={formData.sector}
                    onChange={handleSelectChange}
                />
            </div>
            <div>
                <label className="block text-md font-medium text-gray-700">
                    Nombre d'employés
                </label>
                <CustomSelect
                    name="employees" // Nom du champ
                    options={["0 - 10", "10 - 50", "50 - 100", "100 - 500", "Plus de 500"]} // Options disponibles
                    value={formData.employees} // Valeur actuelle
                    onChange={handleSelectChange} // Gestionnaire d'événement
                />
            </div>
            <button
                type="button"
                className="w-full h-14 flex justify-center items-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-md font-medium text-white bg-primary hover:bg-primary_hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                onClick={handleSubmit}
            >
                Suivant
            </button>
        </div>
    )
}

export default SigningForm;