import {FiUser} from "react-icons/fi";
import {FaCalendarAlt, FaEnvelope, FaIdCard, FaMapMarkerAlt, FaPhone, FaVenusMars} from "react-icons/fa";
import {PersonalInfosProps} from "@/types/dataTypes";
import React from "react";

interface Props {
    data: PersonalInfosProps,
}

const PersonalInfos: React.FC<Props> = ({data}) => {
    if (!data) return null; // ou un spinner, ou un message d'erreur

    const InfoItem = ({icon, label, value}: { icon: React.ReactNode; label: string; value: string }) => (
        <div className="flex items-start gap-3">
            <div className="text-purple-500 text-lg mt-1">{icon}</div>
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="font-medium">{value}</p>
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow-sm">
            <InfoItem icon={<FiUser/>} label="Nom complet" value={data.fullName}/>
            <InfoItem icon={<FaVenusMars/>} label="Sexe" value={data.gender}/>
            <InfoItem icon={<FaCalendarAlt/>} label="Date de naissance" value={data.birthDate}/>
            <InfoItem icon={<FaMapMarkerAlt/>} label="Adresse" value={data.address}/>
            <InfoItem icon={<FaPhone/>} label="Numéro de téléphone" value={data.phoneNumber}/>
            <InfoItem icon={<FaEnvelope/>} label="Email" value={data.email}/>
            <InfoItem icon={<FaIdCard/>} label="Numéro de carte d'identité" value={data.cin}/>
        </div>
    );
}

export default PersonalInfos;