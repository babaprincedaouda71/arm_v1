const SignupForm = ({handleChange, formData, handleSigning, handleSubmit}) => {
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h2 className="text-2xl md:text-3xl font-medium mb-4">Créer un compte</h2>
            </div>
            <div>
                <label className="block text-base font-medium text-formInputTextColor">
                    Nom
                </label>
                <input
                    type="text"
                    value={formData.firstName}
                    name="firstName"
                    onChange={handleChange}
                    className="mt-1 h-14 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                />
            </div>
            <div>
                <label className="block text-base font-medium text-formInputTextColor">
                    Prénoms
                </label>
                <input
                    type="text"
                    value={formData.lastName}
                    name="lastName"
                    onChange={handleChange}
                    className="mt-1 h-14 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                />
            </div>
            <div>
                <label className="block text-base font-medium text-formInputTextColor">
                    Email
                </label>
                <input
                    type="email"
                    value={formData.email}
                    name="email"
                    onChange={handleChange}
                    className="mt-1 h-14 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                />
            </div>
            <div>
                <label className="block text-base font-medium text-formInputTextColor">
                    Mot de passe
                </label>
                <input
                    type="password"
                    value={formData.password}
                    name="password"
                    onChange={handleChange}
                    className="mt-1 h-14 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                />
            </div>
            <div className="flex items-start gap-2">
                <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="mt-1 h-6 w-6 text-black focus:ring-black border-gray-300 rounded"
                    required
                />
                <label
                    htmlFor="terms"
                    className="block text-sm md:text-base text-gray-900"
                >
                    Par la création du compte, J'accepte{" "}
                    <a href="#" className="text-black hover:text-indigo-900 underline">
                        Conditions d'utilisation
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-black hover:text-indigo-900 underline">
                        Politique de confidentialité
                    </a>
                    .
                </label>
            </div>
            <button
                type="submit"
                className="w-full h-14 flex justify-center items-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-primary hover:bg-primary_hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Inscription
            </button>
            <div className="text-center text-base md:text-lg font-medium text-gray-700">
                <p>
                    Déjà un compte?{" "}
                    <button className="font-bold text-primary" onClick={handleSigning}>
                        Connexion
                    </button>
                </p>
            </div>
        </form>
    )
}

export default SignupForm