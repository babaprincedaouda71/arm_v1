import React, {useEffect, useState} from "react";
import Image from "next/image";
import GeneralInfosForm from "@/components/GeneralInfosForm";
import LegalContactForm from "@/components/LegalContactForm";
import LegalInfosForm from "@/components/LegalInfosForm";
import {useRouter} from "next/router";
import {COMPANIES_URLS} from "@/config/urls";

const GeneralInfos = () => {
    const [formData, setFormData] = useState({
        companyId: "",
        mainContactEmail: "",
        sector: "",
        employees: "",
        legalContactFirstName: "",
        legalContactLastName: "",
        legalContactRole: "",
        iceNumber: "",
        tp: "",
        rc: "",
        fi: ""
    });
    const router = useRouter();
    const {mainContactEmail, companyId} = router.query;
    const [showGeneralInfos, setShowGeneralInfos] = useState(true);
    const [showLegalContact, setShowLegalContact] = useState(false);
    const [showLegalInfos, setShowLegalInfos] = useState(false);

    const handleClick1 = () => {
        setShowGeneralInfos(false);
        setShowLegalContact(true);
        console.log(formData);
    };

    const handleClick2 = () => {
        setShowLegalContact(false);
        setShowLegalInfos(true);
        console.log(formData);
    };

    const handleClick3 = async () => {
        console.log("click click");
        console.log(formData);
        try {
            const response = await fetch(COMPANIES_URLS.complete_register, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                router.push("/account-creation/end-of-register");
            }
        } catch (err) {
            console.log(err.message);
        }
    };

    const handleSelectChange = (event) => {
        const {name, value} = event;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (typeof mainContactEmail === "string") {
            setFormData((prev) => ({
                ...prev,
                mainContactEmail: mainContactEmail,
            }));
        }
    }, [mainContactEmail]);

    useEffect(() => {
        if (typeof companyId === 'string') {
            setFormData((prev) => ({
                ...prev,
                companyId: companyId
            }));
        }
    }, [companyId]);

    return (
        <div
            className="flex justify-center items-center min-h-screen bg-authBgColor flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
            <div className="w-full max-w-[638px] h-auto">
                <Image
                    src="/images/auth-banner.png"
                    width={638}
                    height={573}
                    alt="Illustration de connexion"
                    priority
                />
            </div>
            <form>
                {showGeneralInfos &&
                    <GeneralInfosForm
                        formData={formData}
                        handleSelectChange={handleSelectChange}
                        handleChange={handleChange}
                        handleSubmit={handleClick1}
                    />
                }
                {showLegalContact &&
                    <LegalContactForm
                        formData={formData}
                        handleSelectChange={handleSelectChange}
                        handleChange={handleChange}
                        handleSubmit={handleClick2}
                    />
                }
                {showLegalInfos &&
                    <LegalInfosForm
                        formData={formData}
                        handleSelectChange={handleSelectChange}
                        handleChange={handleChange}
                        handleSubmit={handleClick3}
                    />
                }
            </form>
        </div>
    );
};

export default GeneralInfos;
GeneralInfos.useLayout = false;