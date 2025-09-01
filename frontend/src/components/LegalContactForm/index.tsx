const LegalContactForm = ({handleSubmit, formData, handleChange, handleSelectChange}) => {
    const inputStyle =
        "mt-1 block h-14 w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
    return (
        <div className="space-y-6">
            <div className="flex flex-col items-center">
                <h2 className="text-3xl font-medium">Représentant légal</h2>
                <p className="text-gray-600 text-md">Pour activer le compte</p>
            </div>
            <div>
                <label className="block text-md font-medium text-gray-700">
                    Nom
                </label>
                <input
                    id="legalContactLastName"
                    type="text"
                    value={formData.legalContactLastName}
                    name="legalContactLastName"
                    onChange={handleChange}
                    className={inputStyle}
                    required
                    aria-required="true"
                />
            </div>
            <div>
                <label className="block text-md font-medium text-gray-700">
                    Prénoms
                </label>
                <input
                    id="legalContactFirstName"
                    type="text"
                    value={formData.legalContactFirstName}
                    name="legalContactFirstName"
                    onChange={handleChange}
                    className={inputStyle}
                    required
                    aria-required="true"
                />
            </div>
            <div>
                <label className="block text-md font-medium text-gray-700">
                    Fonction
                </label>
                <input
                    id="legalContactRole"
                    type="text"
                    value={formData.legalContactRole}
                    name="legalContactRole"
                    onChange={handleChange}
                    className={inputStyle}
                    required
                    aria-required="true"
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

export default LegalContactForm;