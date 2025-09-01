const ForgotPasswordForm = ({handleSubmitEmail, formData, handleChange, error, emailError}) => {
    const inputStyle =
        "mt-1 block h-14 w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";

    return (
        <form onSubmit={handleSubmitEmail} className="space-y-6">
            <div className="flex flex-col items-center">
                <h2 className="text-3xl font-medium">Veuillez entrez votre adresse mail</h2>
                <p className="text-gray-600 text-md">Réinitialisation du mot de passe</p>
            </div>
            <div>
                <label htmlFor="email" className="block text-md font-medium text-gray-700">
                    Adresse mail
                </label>
                <input
                    id="email"
                    type="email"
                    value={formData.email}
                    name="email"
                    onChange={handleChange}
                    className={inputStyle}
                    required
                    aria-required="true"
                />
                {/* Affichage de l'erreur spécifique à l'email */}
                {emailError && <p className="text-red text-sm mt-1">{emailError}</p>}
            </div>
            {/* Affichage de l'erreur générale */}
            {error && <p className="text-red text-sm mt-1">{error}</p>}
            <button
                type="submit"
                className="w-full h-14 flex justify-center items-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-md font-medium text-white bg-primary hover:bg-primary_hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
                Valider
            </button>
        </form>
    );
};

export default ForgotPasswordForm;