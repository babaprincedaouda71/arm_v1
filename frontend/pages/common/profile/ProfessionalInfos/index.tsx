import React from "react";
import {ProfessionalInfosProps} from "@/types/dataTypes";
import {FiAward} from "react-icons/fi";
import {FaCalendar, FaCalendarAlt, FaCheckCircle, FaFile, FaPhone, FaSuitcase,} from "react-icons/fa";

interface Props {
    data: ProfessionalInfosProps;
}

const ProfessionalInfos: React.FC<Props> = ({data}) => {
    if (!data) return null;

    const InfoItem = ({
                          icon,
                          label,
                          value,
                      }: {
        icon: React.ReactNode;
        label: string;
        value: string;
    }) => (
        <div className="flex items-start gap-3">
            <div className="text-primary text-lg mt-1">{icon}</div>
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="font-medium">{value}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-4">
            {/* Infos pro */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow-sm">
                <InfoItem icon={<FaSuitcase/>} label="Matricule employé" value={data.collaboratorCode}/>
                <InfoItem icon={<FaCalendar/>} label="Date d'embauche" value={data.hiringDate}/>
                <InfoItem icon={<FaCalendarAlt/>} label="Département" value={data.department}/>
                <InfoItem icon={<FaSuitcase/>} label="Poste" value={data.position}/>
                <InfoItem icon={<FaPhone/>} label="Niveau hiérarchique" value={"Niveau 3"}/>
                <InfoItem icon={<FaFile/>} label="Numéro de sécurité sociale" value={data.socialSecurityNumber}/>
            </div>

            {/* Certificats */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-primary font-semibold text-lg mb-4 flex items-center gap-2">
                    <FiAward/> Certificats
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                    {data.certificates.map((cert, idx) => (
                        <div
                            key={idx}
                            className="flex justify-between items-center border rounded-lg p-3"
                        >
                            <div className="flex items-center gap-2">
          <span className="text-primary">
            <FaCheckCircle/>
          </span>
                                <p className="font-medium text-sm">{"Docker"}</p>
                            </div>
                            <span className="text-gray-500 text-sm">{"12-03-2025"}</span>
                        </div>
                    ))}
                </div>
            </div>


            {/* Compétences */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-primary font-semibold text-lg mb-4 flex items-center gap-2">
                    <FiAward/> Compétences
                </h2>
                <div className="flex flex-wrap gap-2">
                    {data.competences.map((skill, idx) => (
                        <span
                            key={idx}
                            className="bg-purple-100 text-primary text-sm px-3 py-1 rounded-full"
                        >
              {skill}
            </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProfessionalInfos;