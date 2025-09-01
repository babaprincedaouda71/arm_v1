import {FiEye, FiEyeOff} from "react-icons/fi";
import {useState} from "react";

const SigningForm = ({handleSubmit, formData, handleChange, handleSignup, error, fieldErrors}) => {
    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = () => setShowPassword((prev) => !prev);

    const inputStyle =
        "mt-1 block h-14 w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";

    return (
        <form onSubmit={handleSubmit} noValidate> {/* Désactiver la validation native */}
            <div className="flex flex-col items-center">
                <h2 className="text-3xl font-medium">Connexion</h2>
                <p className="text-gray-600 text-md">Pour accéder à votre compte</p>
            </div>

            {/* Afficher l'erreur générale */}
            {error && (
                <div className="text-red text-center text-sm">
                    {error}
                </div>
            )}

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
                    className={`${inputStyle} ${fieldErrors.email ? "border-red" : ""}`}
                />
                {/* Afficher l'erreur spécifique à l'email */}
                {fieldErrors.email && (
                    <p className="text-red text-sm mt-1">{fieldErrors.email}</p>
                )}
            </div>

            <div>
                <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-md font-medium text-gray-700">
                        Mot de passe
                    </label>
                    <button
                        type="button"
                        onClick={toggleShowPassword}
                        className="flex items-center text-sm leading-5 text-gray-600 hover:text-gray-900"
                        aria-pressed={showPassword}
                    >
                        {showPassword ? (
                            <FiEyeOff className="mr-2 text-lg"/>
                        ) : (
                            <FiEye className="mr-2 text-lg"/>
                        )}
                        <span>{showPassword ? "Masquer" : "Afficher"}</span>
                    </button>
                </div>
                <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    name="password"
                    onChange={handleChange}
                    className={`${inputStyle} ${fieldErrors.password ? "border-red" : ""}`}
                />
                {/* Afficher l'erreur spécifique au mot de passe */}
                {fieldErrors.password && (
                    <p className="text-red text-sm mt-1">{fieldErrors.password}</p>
                )}
                <div className="flex justify-end mt-1">
                    <a
                        href="/forgot-password"
                        className="text-md font-bold text-red hover:text-gray-900 underline cursor-pointer"
                    >
                        Mot de passe oublié?
                    </a>
                </div>
            </div>

            <button
                type="submit"
                className="w-full h-14 flex justify-center items-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-md font-medium text-white bg-primary hover:bg-primary_hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
                Connexion
            </button>

            <div className="text-center text-lg font-medium text-gray-700">
                Vous n'avez pas encore de compte?{" "}
                <a
                    className="font-bold text-primary cursor-pointer"
                    onClick={handleSignup}
                >
                    Inscription
                </a>
            </div>
        </form>
    );
};

export default SigningForm;