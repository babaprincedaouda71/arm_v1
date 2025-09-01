import {useState} from "react";
import {FiEye, FiEyeOff} from "react-icons/fi";

const ForgotPasswordForm = ({handleSubmit, formData, handleChange, error}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const toggleShowPassword = () => setShowPassword((prev) => !prev);
    const toggleShowConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

    const inputStyle =
        "mt-1 block h-14 w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center">
                <h2 className="text-3xl font-medium">Veuillez définir un nouveau mot de passe</h2>
                <p className="text-gray-600 text-md">Réinitialisation du mot de passe</p>
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
                        {showPassword ? <FiEyeOff className="mr-2 text-lg"/> :
                            <FiEye className="mr-2 text-lg"/>}
                        <span>{showPassword ? "Masquer" : "Afficher"}</span>
                    </button>
                </div>
                <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    name="password"
                    onChange={handleChange}
                    className={inputStyle}
                    required
                    autoComplete="current-password"
                    aria-required="true"
                />
            </div>
            <div>
                <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-md font-medium text-gray-700">
                        Confirmer mot de passe
                    </label>
                    <button
                        type="button"
                        onClick={toggleShowConfirmPassword}
                        className="flex items-center text-sm leading-5 text-gray-600 hover:text-gray-900"
                        aria-pressed={showConfirmPassword}
                    >
                        {showConfirmPassword ? <FiEyeOff className="mr-2 text-lg"/> :
                            <FiEye className="mr-2 text-lg"/>}
                        <span>{showConfirmPassword ? "Masquer" : "Afficher"}</span>
                    </button>
                </div>
                <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    name="confirmPassword"
                    onChange={handleChange}
                    className={inputStyle}
                    required
                    autoComplete="current-password"
                    aria-required="true"
                />
            </div>
            {error && <p className="text-red">{error}</p>}
            <button
                type="submit"
                className="w-full h-14 flex justify-center items-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-md font-medium text-white bg-primary hover:bg-primary_hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
                Envoyer
            </button>
        </form>
    );
};

export default ForgotPasswordForm;