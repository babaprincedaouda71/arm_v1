type FormErrors = {
    email?: string;
    password?: string;
    confirmationPassword?: string;
    general?: string;
    token?: string; // Ajout pour gérer l'erreur de token expiré
};

interface SettingPasswordFormProps {
    formData: {
        email: string;
        password: string;
        confirmationPassword: string;
    };
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    error: FormErrors;
}

const SettingPasswordForm = ({formData, handleChange, handleSubmit, error}: SettingPasswordFormProps) => {
    return (
        <form onSubmit={handleSubmit} noValidate> {/* Désactiver la validation native */}
            <div className="space-y-6">
                <div className="flex flex-col items-center">
                    <h2 className="text-3xl font-medium">Définir un mot de passe</h2>
                    <p className="text-gray-600 text-md">Pour sécuriser votre compte</p>
                </div>

                {/* Afficher l'erreur générale */}
                {error.general && (
                    <div className="text-red text-center text-sm">
                        {error.general}
                    </div>
                )}
                {/* Afficher l'erreur de token expiré */}
                {error.token && (
                    <div className="text-red text-center text-sm">
                        {error.token}
                    </div>
                )}

                <div>
                    <label htmlFor="password" className="block text-md font-medium text-gray-700">
                        Mot de passe
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={formData.password}
                        name="password"
                        onChange={handleChange}
                        className={`mt-1 block h-14 w-full px-3 py-2 border ${
                            error.password ? "border-red" : "border-gray-300"
                        } rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                    {/* Afficher l'erreur spécifique au mot de passe */}
                    {error.password && (
                        <p className="text-red text-sm mt-1">{error.password}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="confirmationPassword" className="block text-md font-medium text-gray-700">
                        Confirmer le mot de passe
                    </label>
                    <input
                        id="confirmationPassword"
                        type="password"
                        value={formData.confirmationPassword}
                        name="confirmationPassword"
                        onChange={handleChange}
                        className={`mt-1 block h-14 w-full px-3 py-2 border ${
                            error.confirmationPassword ? "border-red" : "border-gray-300"
                        } rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                    {/* Afficher l'erreur spécifique à la confirmation du mot de passe */}
                    {error.confirmationPassword && (
                        <p className="text-red text-sm mt-1">{error.confirmationPassword}</p>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full h-14 flex justify-center items-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-md font-medium text-white bg-primary hover:bg-primary_hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                >
                    Définir le mot de passe
                </button>
            </div>
        </form>
    );
};

export default SettingPasswordForm;