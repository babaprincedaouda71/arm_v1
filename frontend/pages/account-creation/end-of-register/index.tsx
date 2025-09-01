import Image from "next/image";
import router from "next/router";

const EndOfRegister = () => {
    const handleSignIn = () => {
        router.push("/signin");
    }
    return (
        <div
            className="flex min-h-screen bg-authBgColor flex-col md:flex-row items-center justify-center p-4 md:p-8 gap-8">
            <div className="w-full max-w-2xl">
                <div className="relative w-full aspect-[1.11] max-h-[573px]">
                    <Image
                        src="/images/auth-banner.png"
                        fill
                        style={{objectFit: 'contain'}}
                        alt="Sign Up Picture"
                        priority
                    />
                </div>
            </div>

            <div className="w-full max-w-xl px-4 md:px-16 text-xl">
                <div>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                        Félicitations !
                    </h2>
                    <p className="mb-6 text-gray-700">
                        Vous pouvez vous connecter en cliquant sur le bouton ci-dessous.
                    </p>
                    <button
                        onClick={handleSignIn}
                        type="button"
                        className="w-full h-14 flex justify-center items-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-md font-medium text-white bg-primary hover:bg-primary_hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200"
                    >
                        Connexion
                    </button>
                </div>
            </div>
        </div>
    )
}
export default EndOfRegister
EndOfRegister.useLayout = false