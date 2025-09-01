import Image from "next/image";

export default function ActivationEmail() {
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

            <div className="w-full max-w-xl px-4 md:px-16 text-3xl">
                <div>
                    Vous recevrez un mail d'activation de votre compte
                </div>
            </div>
        </div>
    )
}
ActivationEmail.useLayout = false