// import {useState} from "react";
// import Image from "next/image";
// import {useRouter} from "next/router";
//
// export default function Signup() {
//     const [formData, setFormData] = useState({
//         firstName: "",
//         lastName: "",
//         email: "",
//         password: "",
//     });
//
//     const handleChange = (event) => {
//         const {type, value, name} = event.target;
//         setFormData((prev) => {
//             return {
//                 ...prev,
//                 [name]: value,
//             };
//         });
//     };
//
//     const handleSubmit = (event) => {
//         event.preventDefault();
//         console.log(formData);
//     };
//
//     const router = useRouter();
//     const handleSigning = () => {
//         router.push("/signin");
//     }
//
//     return (
//         <div
//             className="flex justify-center items-center min-h-screen bg-authBgColor flex-col md:flex-row rounded-lg p-8 md:space-y-0 md:space-x-8">
//             <div className="w-[636px] h-[573px]">
//                 <Image
//                     src="/images/auth-banner.png"
//                     width={638}
//                     height={573}
//                     alt="Sign Up Picture"
//                     className="mx-auto"
//                 />
//             </div>
//
//             <div className="w-[583px] h-[829px] flex items-center p-16">
//                 <form onSubmit={handleSubmit} className="space-y-7">
//                     <div className="flex flex-col items-start">
//                         <h2 className="text-3xl font-medium mb-4">Créer un compte</h2>
//                     </div>
//                     <div>
//                         <label className="block text-base font-medium text-formInputTextColor">
//                             Nom
//                         </label>
//                         <input
//                             type="text"
//                             value={formData.firstName}
//                             name="firstName"
//                             onChange={handleChange}
//                             className="mt-1 h-14 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                             required
//                         />
//                     </div>
//                     <div>
//                         <label className="block text-base font-medium text-formInputTextColor">
//                             Prénoms
//                         </label>
//                         <input
//                             type="text"
//                             value={formData.lastName}
//                             name="lastName"
//                             onChange={handleChange}
//                             className="mt-1 h-14 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                             required
//                         />
//                     </div>
//                     <div>
//                         <label className="block text-base font-medium text-formInputTextColor">
//                             Email
//                         </label>
//                         <input
//                             type="email"
//                             value={formData.email}
//                             name="email"
//                             onChange={handleChange}
//                             className="mt-1 h-14 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                             required
//                         />
//                     </div>
//                     <div>
//                         <label className="block text-base font-medium text-formInputTextColor">
//                             Mot de passe
//                         </label>
//                         <input
//                             type="password"
//                             value={formData.password}
//                             name="password"
//                             onChange={handleChange}
//                             className="mt-1 h-14 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                             required
//                         />
//                     </div>
//                     <div className="flex  justify-centeritems-center">
//                         <input
//                             id="terms"
//                             name="terms"
//                             type="checkbox"
//                             className="h-6 w-6 text-black focus:ring-black border-gray-300 rounded"
//                             required
//                         />
//                         <label
//                             htmlFor="terms"
//                             className="ml-2 block text-base text-gray-900"
//                         >
//                             Par la création du compte, J'accepte{" "}
//                             <a
//                                 href="#"
//                                 className="text-black hover:text-indigo-900 underline"
//                             >
//                                 Conditions d'utilisation
//                             </a>{" "}
//                             and{" "}
//                             <a
//                                 href="#"
//                                 className="text-black hover:text-indigo-900 underline"
//                             >
//                                 Politique de confidentialité
//                             </a>
//                             .
//                         </label>
//                     </div>
//                     <button
//                         type="submit"
//                         className="w-full h-14 flex justify-center items-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-primary hover:bg-primary_hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                     >
//                         Inscription
//                     </button>
//                     <div className="text-center text-lg font-medium text-gray-700">
//                         <p>
//                             Déjà un compte?{" "}
//                             <a className="font-bold text-primary" onClick={handleSigning}>
//                                 Connexion
//                             </a>
//                         </p>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// }
// Signup.useLayout = false;


import {useState} from "react";
import Image from "next/image";
import {useRouter} from "next/router";
import SignupForm from "@/components/SignupForm";

export default function Signup() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    const handleChange = (event) => {
        const {value, name} = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(formData);
    };

    const router = useRouter();
    const handleSigning = () => {
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

            <div className="w-full max-w-xl px-4 md:px-16">
                <SignupForm formData={formData} handleSigning={handleSigning} handleChange={handleChange}
                            handleSubmit={handleSubmit}/>
            </div>
        </div>
    );
}

Signup.useLayout = false;